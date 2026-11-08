/**
 * Safe Mathematical Expression Parser & History Engine for SolveItCalculator.com
 * Route: /calculation-workspace
 *
 * SECURITY NOTE:
 * Never uses eval(), Function(), or dynamic code execution.
 * Uses a deterministic tokenizer + shunting-yard / AST evaluator with strict validation.
 */

export const WORKSPACE_STORAGE_KEY = 'solveit_calculation_workspace_v1';
export const WORKSPACE_STORAGE_VERSION = 1;
export const MAX_HISTORY_RECORDS = 100;
export const MAX_EXPRESSION_LENGTH = 300;

export interface EvaluationSuccess {
  ok: true;
  result: number;
  formattedResult: string;
  normalizedExpression: string;
  hasPercentage: boolean;
  percentageExplanation?: string;
}

export interface EvaluationFailure {
  ok: false;
  error: string;
  isIncomplete?: boolean;
}

export type EvaluationOutput = EvaluationSuccess | EvaluationFailure;

export interface WorkspaceHistoryRecord {
  id: string;
  expression: string;
  normalizedExpression: string;
  result: number;
  formattedResult: string;
  timestamp: string;
  note: string;
  sourceCalculator: string;
}

export interface NamedSubtotal {
  id: string;
  name: string;
  value: number;
  formattedValue: string;
  updatedAt: string;
}

export interface WorkspacePersistedState {
  version: number;
  history: WorkspaceHistoryRecord[];
  subtotals: NamedSubtotal[];
}

type TokenType = 'number' | 'operator' | 'lparen' | 'rparen' | 'percent';

interface Token {
  type: TokenType;
  value: string;
  numValue?: number;
}

/**
 * Formats a finite numeric value cleanly, eliminating IEEE-754 floating-point
 * representation artifacts (e.g., 0.1 + 0.2 -> 0.3) while keeping up to 10 decimal places.
 */
export function cleanNumber(val: number): number {
  if (!Number.isFinite(val)) return val;
  if (Object.is(val, -0) || Math.abs(val) < 1e-15) return 0;
  return Number(val.toPrecision(12));
}

export function formatWorkspaceNumber(val: number): string {
  const cleaned = cleanNumber(val);
  if (!Number.isFinite(cleaned)) return 'Invalid';
  const abs = Math.abs(cleaned);
  if (abs >= 1e12 || (abs > 0 && abs < 1e-7)) {
    return cleaned.toExponential(6).replace(/\.?0+e/, 'e');
  }
  const parts = cleaned.toString().split('.');
  const intPart = Number(parts[0]).toLocaleString('en-US');
  if (parts.length === 1) return intPart;
  const decPart = parts[1].slice(0, 8).replace(/0+$/, '');
  return decPart ? `${intPart}.${decPart}` : intPart;
}

/**
 * Tokenizes a mathematical expression safely without regex backtracking or eval.
 */
function tokenizeExpression(raw: string): { ok: true; tokens: Token[] } | { ok: false; error: string; isIncomplete?: boolean } {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { ok: false, error: 'Enter a mathematical expression to calculate.', isIncomplete: true };
  }
  if (trimmed.length > MAX_EXPRESSION_LENGTH) {
    return {
      ok: false,
      error: `Expression is too long (maximum ${MAX_EXPRESSION_LENGTH} characters).`,
    };
  }

  // Normalize display symbols to standard ASCII operators and strip thousand-separator commas between digits
  const normalizedChars = trimmed
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/[−–—]/g, '-')
    .replace(/(\d),(\d)/g, '$1$2');

  const tokens: Token[] = [];
  let i = 0;
  const len = normalizedChars.length;

  while (i < len) {
    const ch = normalizedChars[i];

    // Skip whitespace
    if (ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r') {
      i++;
      continue;
    }

    if (ch === '(') {
      // Implicit multiplication: e.g. 2(3+4) or )( or 50%(20)
      const prev = tokens[tokens.length - 1];
      if (prev && (prev.type === 'number' || prev.type === 'rparen' || prev.type === 'percent')) {
        tokens.push({ type: 'operator', value: '*' });
      }
      tokens.push({ type: 'lparen', value: '(' });
      i++;
      continue;
    }

    if (ch === ')') {
      tokens.push({ type: 'rparen', value: ')' });
      i++;
      continue;
    }

    if (ch === '%') {
      tokens.push({ type: 'percent', value: '%' });
      i++;
      continue;
    }

    if (ch === '+' || ch === '-' || ch === '*' || ch === '/') {
      tokens.push({ type: 'operator', value: ch });
      i++;
      continue;
    }

    // Number literal (digits and at most one decimal point)
    if ((ch >= '0' && ch <= '9') || ch === '.') {
      let numStr = '';
      let dotCount = 0;

      while (i < len) {
        const c = normalizedChars[i];
        if (c >= '0' && c <= '9') {
          numStr += c;
          i++;
        } else if (c === '.') {
          dotCount++;
          if (dotCount > 1) {
            return { ok: false, error: `Invalid number format near "${numStr}." (multiple decimal points).` };
          }
          numStr += c;
          i++;
        } else if (c === ',') {
          // Ignore commas inside numbers
          i++;
        } else {
          break;
        }
      }

      if (numStr === '.') {
        return { ok: false, error: 'Incomplete decimal number ".".', isIncomplete: true };
      }

      const parsed = Number(numStr);
      if (!Number.isFinite(parsed)) {
        return { ok: false, error: `Invalid numeric value "${numStr}".` };
      }

      // Implicit multiplication if a number immediately follows ')' or '%'
      const prev = tokens[tokens.length - 1];
      if (prev && (prev.type === 'rparen' || prev.type === 'percent')) {
        tokens.push({ type: 'operator', value: '*' });
      }

      tokens.push({ type: 'number', value: numStr, numValue: parsed });
      continue;
    }

    return {
      ok: false,
      error: `Unsupported character "${ch}". Allowed characters: numbers, +, −, ×, ÷, %, (, ), and decimal point.`,
    };
  }

  if (tokens.length === 0) {
    return { ok: false, error: 'Enter a mathematical expression to calculate.', isIncomplete: true };
  }

  return { ok: true, tokens };
}

/**
 * AST Node Types for clear evaluation & percentage semantics
 */
type AstNode =
  | { kind: 'number'; value: number }
  | { kind: 'unary'; op: '+' | '-'; operand: AstNode }
  | { kind: 'percent'; operand: AstNode }
  | { kind: 'binary'; op: '+' | '-' | '*' | '/'; left: AstNode; right: AstNode };

/**
 * Recursive-descent parser implementing standard operator precedence:
 * 1. Parentheses: ( expr )
 * 2. Postfix percentage: expr %
 * 3. Unary plus/minus: +expr, -expr
 * 4. Multiplication / Division: *, / (left-to-right)
 * 5. Addition / Subtraction: +, - (left-to-right, with documented percentage semantics)
 */
class ExpressionParser {
  private tokens: Token[];
  private pos = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  public parse(): AstNode {
    const node = this.parseAddSub();
    if (this.pos < this.tokens.length) {
      const unexpected = this.tokens[this.pos];
      if (unexpected.type === 'rparen') {
        throw new Error('Unmatched closing parenthesis ")".');
      }
      throw new Error(`Unexpected token "${unexpected.value}".`);
    }
    return node;
  }

  private peek(): Token | undefined {
    return this.tokens[this.pos];
  }

  private consume(): Token {
    return this.tokens[this.pos++];
  }

  private parseAddSub(): AstNode {
    let left = this.parseMulDiv();
    while (true) {
      const t = this.peek();
      if (t && t.type === 'operator' && (t.value === '+' || t.value === '-')) {
        this.consume();
        if (!this.peek()) {
          throw new Error(`Incomplete expression: missing value after "${t.value}".`);
        }
        const right = this.parseMulDiv();
        left = { kind: 'binary', op: t.value as '+' | '-', left, right };
      } else {
        break;
      }
    }
    return left;
  }

  private parseMulDiv(): AstNode {
    let left = this.parseUnary();
    while (true) {
      const t = this.peek();
      if (t && t.type === 'operator' && (t.value === '*' || t.value === '/')) {
        this.consume();
        if (!this.peek()) {
          throw new Error(`Incomplete expression: missing value after "${t.value}".`);
        }
        const right = this.parseUnary();
        left = { kind: 'binary', op: t.value as '*' | '/', left, right };
      } else {
        break;
      }
    }
    return left;
  }

  private parseUnary(): AstNode {
    const t = this.peek();
    if (t && t.type === 'operator' && (t.value === '+' || t.value === '-')) {
      this.consume();
      if (!this.peek()) {
        throw new Error(`Incomplete expression: missing value after unary "${t.value}".`);
      }
      const operand = this.parseUnary();
      return { kind: 'unary', op: t.value as '+' | '-', operand };
    }
    return this.parsePostfix();
  }

  private parsePostfix(): AstNode {
    let node = this.parsePrimary();
    while (true) {
      const t = this.peek();
      if (t && t.type === 'percent') {
        this.consume();
        node = { kind: 'percent', operand: node };
      } else {
        break;
      }
    }
    return node;
  }

  private parsePrimary(): AstNode {
    const t = this.peek();
    if (!t) {
      throw new Error('Incomplete expression.');
    }

    if (t.type === 'number') {
      this.consume();
      return { kind: 'number', value: t.numValue! };
    }

    if (t.type === 'lparen') {
      this.consume();
      if (this.peek()?.type === 'rparen') {
        throw new Error('Empty parentheses "()" are not allowed.');
      }
      const inside = this.parseAddSub();
      const closing = this.peek();
      if (!closing || closing.type !== 'rparen') {
        throw new Error('Missing closing parenthesis ")".');
      }
      this.consume();
      return inside;
    }

    if (t.type === 'rparen') {
      throw new Error('Unmatched closing parenthesis ")".');
    }

    throw new Error(`Unexpected "${t.value}" in expression.`);
  }
}

interface EvalContext {
  hasPercentage: boolean;
  explanations: string[];
}

function evaluateAst(node: AstNode, ctx: EvalContext): number {
  switch (node.kind) {
    case 'number':
      return node.value;

    case 'unary': {
      const val = evaluateAst(node.operand, ctx);
      return node.op === '-' ? -val : val;
    }

    case 'percent': {
      ctx.hasPercentage = true;
      const rawVal = evaluateAst(node.operand, ctx);
      const decVal = rawVal / 100;
      ctx.explanations.push(`${cleanNumber(rawVal)}% = ${cleanNumber(rawVal)} ÷ 100 = ${cleanNumber(decVal)}`);
      return decVal;
    }

    case 'binary': {
      const leftVal = evaluateAst(node.left, ctx);

      // Documented Percentage Semantics for Addition and Subtraction:
      // A + B% => A + (A * (B / 100))
      // A - B% => A - (A * (B / 100))
      if ((node.op === '+' || node.op === '-') && node.right.kind === 'percent') {
        ctx.hasPercentage = true;
        const pctNum = evaluateAst(node.right.operand, ctx);
        const delta = leftVal * (pctNum / 100);
        const combined = node.op === '+' ? leftVal + delta : leftVal - delta;
        ctx.explanations.push(
          `${cleanNumber(leftVal)} ${node.op} ${cleanNumber(pctNum)}% = ${cleanNumber(leftVal)} ${node.op} (${cleanNumber(leftVal)} × ${cleanNumber(pctNum)} ÷ 100) = ${cleanNumber(combined)}`
        );
        return combined;
      }

      const rightVal = evaluateAst(node.right, ctx);

      if (node.op === '+') return leftVal + rightVal;
      if (node.op === '-') return leftVal - rightVal;
      if (node.op === '*') return leftVal * rightVal;
      if (node.op === '/') {
        if (Math.abs(rightVal) < 1e-15) {
          throw new Error('Division by zero is undefined. Please enter a non-zero divisor.');
        }
        return leftVal / rightVal;
      }
    }
  }
}

function formatAstHumanReadable(node: AstNode): string {
  switch (node.kind) {
    case 'number':
      return `${cleanNumber(node.value)}`;
    case 'unary':
      return node.op === '-' ? `-${formatAstHumanReadable(node.operand)}` : formatAstHumanReadable(node.operand);
    case 'percent':
      return `${formatAstHumanReadable(node.operand)}%`;
    case 'binary': {
      const opSymbol = node.op === '*' ? '×' : node.op === '/' ? '÷' : node.op;
      const l =
        node.left.kind === 'binary' &&
        (node.op === '*' || node.op === '/') &&
        (node.left.op === '+' || node.left.op === '-')
          ? `(${formatAstHumanReadable(node.left)})`
          : formatAstHumanReadable(node.left);
      const r =
        node.right.kind === 'binary' &&
        ((node.op === '*' || node.op === '/') ||
          (node.op === '-' && (node.right.op === '+' || node.right.op === '-')))
          ? `(${formatAstHumanReadable(node.right)})`
          : formatAstHumanReadable(node.right);
      return `${l} ${opSymbol} ${r}`;
    }
  }
}

/**
 * Main entry point to evaluate a user expression safely.
 */
export function evaluateWorkspaceExpression(rawExpression: string): EvaluationOutput {
  const tokenized = tokenizeExpression(rawExpression);
  if (!tokenized.ok) {
    return tokenized;
  }

  try {
    const parser = new ExpressionParser(tokenized.tokens);
    const ast = parser.parse();
    const ctx: EvalContext = { hasPercentage: false, explanations: [] };
    const rawResult = evaluateAst(ast, ctx);

    if (!Number.isFinite(rawResult) || Number.isNaN(rawResult)) {
      return {
        ok: false,
        error: 'Result exceeds the maximum representable number (overflow).',
      };
    }

    const cleaned = cleanNumber(rawResult);
    return {
      ok: true,
      result: cleaned,
      formattedResult: formatWorkspaceNumber(cleaned),
      normalizedExpression: formatAstHumanReadable(ast),
      hasPercentage: ctx.hasPercentage,
      percentageExplanation: ctx.explanations.length > 0 ? ctx.explanations.join(' · ') : undefined,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid mathematical expression.';
    const isIncomplete =
      message.includes('Incomplete') || message.includes('Missing closing parenthesis');
    return {
      ok: false,
      error: message,
      isIncomplete,
    };
  }
}

/**
 * Pure History Operations (testable in Node & Browser)
 */
export function createHistoryRecord(params: {
  expression: string;
  evalResult: EvaluationSuccess;
  note?: string;
  sourceCalculator?: string;
  nowIso?: string;
  id?: string;
}): WorkspaceHistoryRecord {
  const timestamp = params.nowIso || new Date().toISOString();
  const uniqueId =
    params.id ||
    `calc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  return {
    id: uniqueId,
    expression: params.expression.trim(),
    normalizedExpression: params.evalResult.normalizedExpression,
    result: params.evalResult.result,
    formattedResult: params.evalResult.formattedResult,
    timestamp,
    note: (params.note || '').trim(),
    sourceCalculator: params.sourceCalculator || 'Calculation Workspace',
  };
}

export function addRecordToHistory(
  history: WorkspaceHistoryRecord[],
  newRecord: WorkspaceHistoryRecord,
  maxRecords: number = MAX_HISTORY_RECORDS
): WorkspaceHistoryRecord[] {
  return [newRecord, ...history].slice(0, maxRecords);
}

export function updateHistoryRecordNote(
  history: WorkspaceHistoryRecord[],
  id: string,
  note: string
): WorkspaceHistoryRecord[] {
  return history.map((item) =>
    item.id === id ? { ...item, note: note.trim() } : item
  );
}

export function deleteHistoryRecord(
  history: WorkspaceHistoryRecord[],
  id: string
): WorkspaceHistoryRecord[] {
  return history.filter((item) => item.id !== id);
}

export function computeHistoryRunningTotal(
  history: WorkspaceHistoryRecord[]
): { total: number; formattedTotal: string } {
  const sum = cleanNumber(
    history.reduce((acc, item) => acc + (Number.isFinite(item.result) ? item.result : 0), 0)
  );
  return {
    total: sum,
    formattedTotal: formatWorkspaceNumber(sum),
  };
}

export function exportHistoryToCsv(history: WorkspaceHistoryRecord[]): string {
  const escapeCsv = (val: string) => `"${String(val).replace(/"/g, '""')}"`;
  const headers = ['ID', 'Timestamp', 'Note', 'Expression', 'Normalized Expression', 'Result', 'Source Calculator'];
  const rows = history.map((h) => [
    escapeCsv(h.id),
    escapeCsv(h.timestamp),
    escapeCsv(h.note),
    escapeCsv(h.expression),
    escapeCsv(h.normalizedExpression),
    escapeCsv(String(h.result)),
    escapeCsv(h.sourceCalculator),
  ]);
  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

export function exportHistoryToText(history: WorkspaceHistoryRecord[]): string {
  const { formattedTotal } = computeHistoryRunningTotal(history);
  const lines = [
    'SolveItCalculator.com — Calculation Workspace History',
    `Exported: ${new Date().toISOString()}`,
    `Total Records: ${history.length}`,
    `Running Total of Results: ${formattedTotal}`,
    '------------------------------------------------------------',
    ...history.map((h, idx) => {
      const label = h.note ? `[${h.note}] ` : '';
      return `${idx + 1}. ${label}${h.normalizedExpression} = ${h.formattedResult}   (${h.timestamp})`;
    }),
  ];
  return lines.join('\n');
}
