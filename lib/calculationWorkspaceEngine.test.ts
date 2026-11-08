import test from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluateWorkspaceExpression,
  createHistoryRecord,
  addRecordToHistory,
  updateHistoryRecordNote,
  deleteHistoryRecord,
  computeHistoryRunningTotal,
  exportHistoryToCsv,
  exportHistoryToText,
  MAX_EXPRESSION_LENGTH,
} from './calculationWorkspaceEngine.ts';

test('Operator precedence: multiplication and division before addition and subtraction', () => {
  const r1 = evaluateWorkspaceExpression('2 + 3 * 4');
  assert.equal(r1.ok, true);
  if (r1.ok) assert.equal(r1.result, 14);

  const r2 = evaluateWorkspaceExpression('20 - 12 / 3 + 2 * 5');
  assert.equal(r2.ok, true);
  if (r2.ok) assert.equal(r2.result, 26);

  const r3 = evaluateWorkspaceExpression('0.1 + 0.2');
  assert.equal(r3.ok, true);
  if (r3.ok) assert.equal(r3.result, 0.3);
});

test('Parentheses and unary negative numbers', () => {
  const r1 = evaluateWorkspaceExpression('(2 + 3) * 4');
  assert.equal(r1.ok, true);
  if (r1.ok) assert.equal(r1.result, 20);

  const r2 = evaluateWorkspaceExpression('((10 + 5) * 2) / (3 + 2)');
  assert.equal(r2.ok, true);
  if (r2.ok) assert.equal(r2.result, 6);

  const r3 = evaluateWorkspaceExpression('-(4 + 6) * -2.5');
  assert.equal(r3.ok, true);
  if (r3.ok) assert.equal(r3.result, 25);

  // Implicit multiplication with parentheses
  const r4 = evaluateWorkspaceExpression('3(4 + 5)');
  assert.equal(r4.ok, true);
  if (r4.ok) assert.equal(r4.result, 27);
});

test('Percentage operations with documented semantics', () => {
  // Additive percentage: 100 + 15% = 115
  const addPct = evaluateWorkspaceExpression('100 + 15%');
  assert.equal(addPct.ok, true);
  if (addPct.ok) {
    assert.equal(addPct.result, 115);
    assert.equal(addPct.hasPercentage, true);
    assert.ok(addPct.percentageExplanation?.includes('115'));
  }

  // Subtractive percentage: 200 - 20% = 160
  const subPct = evaluateWorkspaceExpression('200 - 20%');
  assert.equal(subPct.ok, true);
  if (subPct.ok) assert.equal(subPct.result, 160);

  // Multiplicative percentage: 250 * 8% = 20
  const mulPct = evaluateWorkspaceExpression('250 * 8%');
  assert.equal(mulPct.ok, true);
  if (mulPct.ok) assert.equal(mulPct.result, 20);

  // Standalone percentage: 50% = 0.5
  const singlePct = evaluateWorkspaceExpression('50%');
  assert.equal(singlePct.ok, true);
  if (singlePct.ok) assert.equal(singlePct.result, 0.5);

  // Compound expression with parentheses and percentage: (120 + 80) + 10% = 220
  const compoundPct = evaluateWorkspaceExpression('(120 + 80) + 10%');
  assert.equal(compoundPct.ok, true);
  if (compoundPct.ok) assert.equal(compoundPct.result, 220);
});

test('Division by zero handling', () => {
  const divZero = evaluateWorkspaceExpression('10 / 0');
  assert.equal(divZero.ok, false);
  if (!divZero.ok) {
    assert.match(divZero.error, /Division by zero/i);
  }

  const exprDivZero = evaluateWorkspaceExpression('50 ÷ (10 - 10)');
  assert.equal(exprDivZero.ok, false);
  if (!exprDivZero.ok) {
    assert.match(exprDivZero.error, /Division by zero/i);
  }

  const pctDivZero = evaluateWorkspaceExpression('100 / 0%');
  assert.equal(pctDivZero.ok, false);
  if (!pctDivZero.ok) {
    assert.match(pctDivZero.error, /Division by zero/i);
  }
});

test('Invalid expressions and security rejection', () => {
  // Reject JS code execution attempts
  const jsAttempt = evaluateWorkspaceExpression('alert(1)');
  assert.equal(jsAttempt.ok, false);

  // Reject unmatched parentheses
  const unmatchedOpen = evaluateWorkspaceExpression('(10 + 5 * 2');
  assert.equal(unmatchedOpen.ok, false);

  const unmatchedClose = evaluateWorkspaceExpression('10 + 5) * 2');
  assert.equal(unmatchedClose.ok, false);

  // Reject empty parentheses
  const emptyParens = evaluateWorkspaceExpression('10 + ()');
  assert.equal(emptyParens.ok, false);

  // Reject trailing binary operator
  const trailingOp = evaluateWorkspaceExpression('45 + ');
  assert.equal(trailingOp.ok, false);

  // Reject multiple decimal points in one number
  const multiDot = evaluateWorkspaceExpression('12.3.4 + 5');
  assert.equal(multiDot.ok, false);

  // Reject excessively long expressions
  const tooLong = '1+'.repeat(MAX_EXPRESSION_LENGTH);
  const longRes = evaluateWorkspaceExpression(tooLong);
  assert.equal(longRes.ok, false);
});

test('History operations: add, annotate, delete, running total, and export', () => {
  const eval1 = evaluateWorkspaceExpression('120 + 30');
  const eval2 = evaluateWorkspaceExpression('200 - 15%');
  assert.equal(eval1.ok && eval2.ok, true);
  if (!eval1.ok || !eval2.ok) return;

  const rec1 = createHistoryRecord({
    id: 'rec_1',
    expression: '120 + 30',
    evalResult: eval1,
    note: 'Groceries',
    nowIso: '2026-10-26T12:00:00.000Z',
  });

  const rec2 = createHistoryRecord({
    id: 'rec_2',
    expression: '200 - 15%',
    evalResult: eval2,
    note: 'Discounted Jacket',
    nowIso: '2026-10-26T12:05:00.000Z',
  });

  let history = addRecordToHistory([], rec1);
  history = addRecordToHistory(history, rec2);
  assert.equal(history.length, 2);
  assert.equal(history[0].id, 'rec_2'); // newest first

  // Running total: 150 + 170 = 320
  const total = computeHistoryRunningTotal(history);
  assert.equal(total.total, 320);
  assert.equal(total.formattedTotal, '320');

  // Update note
  history = updateHistoryRecordNote(history, 'rec_1', 'Weekly Groceries');
  assert.equal(history.find((h) => h.id === 'rec_1')?.note, 'Weekly Groceries');

  // Export CSV and TXT
  const csv = exportHistoryToCsv(history);
  assert.ok(csv.includes('Weekly Groceries'));
  assert.ok(csv.includes('Discounted Jacket'));

  const txt = exportHistoryToText(history);
  assert.ok(txt.includes('Running Total of Results: 320'));

  // Delete single record
  history = deleteHistoryRecord(history, 'rec_1');
  assert.equal(history.length, 1);
  assert.equal(history[0].id, 'rec_2');

  // Enforce max records cap
  let cappedHistory = history;
  for (let i = 0; i < 10; i++) {
    cappedHistory = addRecordToHistory(
      cappedHistory,
      createHistoryRecord({
        id: `cap_${i}`,
        expression: '1 + 1',
        evalResult: eval1,
      }),
      5
    );
  }
  assert.equal(cappedHistory.length, 5);
});
