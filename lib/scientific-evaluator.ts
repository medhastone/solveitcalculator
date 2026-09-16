// Scientific evaluation, AST tokenization, and multi-format converters

export type AngleMode = 'DEG' | 'RAD' | 'GRAD';
export type CalculatorDomain = 'standard' | 'engineering' | 'radix' | 'stats';
export type RadixBase = 'HEX' | 'DEC' | 'OCT' | 'BIN';
export type WordSize = 64 | 32 | 16 | 8;

export function toRadians(val: number, mode: AngleMode): number {
  if (mode === 'DEG') return val * (Math.PI / 180);
  if (mode === 'GRAD') return val * (Math.PI / 200);
  return val;
}

export function fromRadians(rad: number, mode: AngleMode): number {
  if (mode === 'DEG') return rad * (180 / Math.PI);
  if (mode === 'GRAD') return rad * (200 / Math.PI);
  return rad;
}

export function factorial(n: number): number {
  if (n < 0 || !Number.isFinite(n)) return NaN;
  if (n === 0 || n === 1) return 1;
  if (n > 170) return Infinity;
  let res = 1;
  for (let i = 2; i <= Math.floor(n); i++) res *= i;
  return res;
}

export function nPr(n: number, r: number): number {
  if (n < 0 || r < 0 || r > n) return 0;
  let res = 1;
  for (let i = 0; i < r; i++) {
    res *= n - i;
  }
  return res;
}

export function nCr(n: number, r: number): number {
  if (n < 0 || r < 0 || r > n) return 0;
  const k = Math.min(r, n - r);
  let res = 1;
  for (let i = 1; i <= k; i++) {
    res = (res * (n - k + i)) / i;
  }
  return Math.round(res);
}

export function randFloat(): number {
  return Math.random();
}

export function randInt(min: number, max: number): number {
  const low = Math.ceil(min);
  const high = Math.floor(max);
  return Math.floor(Math.random() * (high - low + 1)) + low;
}

export function normalPdf(x: number, mean: number = 0, stdDev: number = 1): number {
  if (stdDev <= 0) return NaN;
  const exponent = -Math.pow(x - mean, 2) / (2 * Math.pow(stdDev, 2));
  return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
}

export function parallelRes(r1: number, r2: number): number {
  if (r1 + r2 === 0) return 0;
  return (r1 * r2) / (r1 + r2);
}

export function sanitizeExpression(expr: string, mode: AngleMode): string {
  let parsed = expr;

  // Replace multiplication symbols and powers
  parsed = parsed.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');

  // Handle bitwise words when isolated
  parsed = parsed.replace(/\bAND\b/g, '&');
  parsed = parsed.replace(/\bOR\b/g, '|');
  parsed = parsed.replace(/\bXOR\b/g, '^');
  parsed = parsed.replace(/\bNOT\b/g, '~');
  parsed = parsed.replace(/\bSHL\b/g, '<<');
  parsed = parsed.replace(/\bSHR\b/g, '>>');

  // Handle standard power operator ^ (unless in bitwise mode where user typed XOR)
  parsed = parsed.replace(/\^/g, '**');

  // Replace factorials like 5! or (3+2)!
  parsed = parsed.replace(/(\d+)!/g, (_, n) => `factorial(${n})`);

  // Replace Math functions
  parsed = parsed.replace(/sqrt\(/g, 'Math.sqrt(');
  parsed = parsed.replace(/cbrt\(/g, 'Math.cbrt(');
  parsed = parsed.replace(/abs\(/g, 'Math.abs(');
  parsed = parsed.replace(/\bln\(/g, 'Math.log(');
  parsed = parsed.replace(/\blog10\(/g, 'Math.log10(');
  parsed = parsed.replace(/\blog\(/g, 'Math.log10(');
  parsed = parsed.replace(/\blog2\(/g, 'Math.log2(');
  parsed = parsed.replace(/10\*\*\(/g, 'Math.pow(10, ');

  // Combinatorics & Stats
  parsed = parsed.replace(/nPr\(([^,]+),([^)]+)\)/g, 'nPr($1,$2)');
  parsed = parsed.replace(/nCr\(([^,]+),([^)]+)\)/g, 'nCr($1,$2)');
  parsed = parsed.replace(/randInt\(([^,]+),([^)]+)\)/g, 'randInt($1,$2)');
  parsed = parsed.replace(/\brand\(\)/g, 'randFloat()');
  parsed = parsed.replace(/normalPdf\(([^)]+)\)/g, 'normalPdf($1)');
  parsed = parsed.replace(/parallel\(([^,]+),([^)]+)\)/g, 'parallelRes($1,$2)');

  // Constants
  parsed = parsed.replace(/π/g, 'Math.PI');
  parsed = parsed.replace(/\bpi\b/gi, 'Math.PI');
  parsed = parsed.replace(/\be\b/g, 'Math.E');

  // Trigonometry with angle mode injection
  parsed = parsed.replace(/asin\(([^)]+)\)/g, (_, a) => `fromRad(Math.asin(${a}))`);
  parsed = parsed.replace(/acos\(([^)]+)\)/g, (_, a) => `fromRad(Math.acos(${a}))`);
  parsed = parsed.replace(/atan\(([^)]+)\)/g, (_, a) => `fromRad(Math.atan(${a}))`);
  parsed = parsed.replace(/sinh\(([^)]+)\)/g, 'Math.sinh($1)');
  parsed = parsed.replace(/cosh\(([^)]+)\)/g, 'Math.cosh($1)');
  parsed = parsed.replace(/tanh\(([^)]+)\)/g, 'Math.tanh($1)');

  parsed = parsed.replace(/sin\(([^)]+)\)/g, (_, a) => `Math.sin(toRad(${a}))`);
  parsed = parsed.replace(/cos\(([^)]+)\)/g, (_, a) => `Math.cos(toRad(${a}))`);
  parsed = parsed.replace(/tan\(([^)]+)\)/g, (_, a) => `Math.tan(toRad(${a}))`);

  return parsed;
}

export function evaluateScientific(rawExpr: string, mode: AngleMode): { result: number | null; error?: string } {
  const trimmed = rawExpr.trim();
  if (!trimmed) return { result: null };

  try {
    const toRad = (v: number) => toRadians(v, mode);
    const fromRad = (v: number) => fromRadians(v, mode);
    const sanitized = sanitizeExpression(trimmed, mode);

    const fn = new Function(
      'toRad',
      'fromRad',
      'factorial',
      'nPr',
      'nCr',
      'randFloat',
      'randInt',
      'normalPdf',
      'parallelRes',
      `'use strict'; return (${sanitized});`
    );

    const val = fn(toRad, fromRad, factorial, nPr, nCr, randFloat, randInt, normalPdf, parallelRes);

    if (typeof val === 'number' && !Number.isNaN(val)) {
      return { result: val };
    }
    return { result: null, error: 'Undefined Result' };
  } catch {
    return { result: null, error: 'Syntax Error' };
  }
}

export function toSuperscript(num: number): string {
  const map: Record<string, string> = {
    '-': '⁻',
    '0': '⁰',
    '1': '¹',
    '2': '²',
    '3': '³',
    '4': '⁴',
    '5': '⁵',
    '6': '⁶',
    '7': '⁷',
    '8': '⁸',
    '9': '⁹',
  };
  return num
    .toString()
    .split('')
    .map((c) => map[c] || c)
    .join('');
}

export function toFraction(val: number): string {
  if (!Number.isFinite(val) || Number.isNaN(val)) return '-';
  if (Number.isInteger(val)) return `${val} / 1`;

  const isNeg = val < 0;
  const absVal = Math.abs(val);
  const whole = Math.floor(absVal);
  const x = absVal - whole;

  if (x < 1e-9) return `${isNeg ? '-' : ''}${whole} / 1`;

  let h1 = 1,
    h2 = 0,
    k1 = 0,
    k2 = 1;
  let b = x;
  const precision = 1e-7;

  for (let i = 0; i < 15; i++) {
    const a = Math.floor(b);
    const auxH = h1;
    h1 = a * h1 + h2;
    h2 = auxH;
    const auxK = k1;
    k1 = a * k1 + k2;
    k2 = auxK;

    if (Math.abs(x - h1 / k1) < precision || k1 > 50000) break;
    const diff = b - a;
    if (Math.abs(diff) < 1e-9) break;
    b = 1 / diff;
  }

  const totalNum = whole * k1 + h1;
  const num = isNeg ? -totalNum : totalNum;
  const mixed = whole > 0 ? ` (Mixed: ${isNeg ? '-' : ''}${whole} ${h1}/${k1})` : '';
  return `${num} / ${k1}${mixed}`;
}

export function toEngineering(val: number, stepOffset: number = 0): string {
  if (!Number.isFinite(val) || val === 0) return '0.000000 × 10⁰ (Base Unit)';
  const absVal = Math.abs(val);
  const rawExp = Math.floor(Math.log10(absVal));
  let engExp = Math.floor(rawExp / 3) * 3 + stepOffset * 3;
  const mantissa = val / Math.pow(10, engExp);

  const prefixMap: Record<number, string> = {
    18: 'Exa (E)',
    15: 'Peta (P)',
    12: 'Tera (T)',
    9: 'Giga (G)',
    6: 'Mega (M)',
    3: 'kilo (k)',
    0: 'Base Unit',
    [-3]: 'milli (m)',
    [-6]: 'micro (μ)',
    [-9]: 'nano (n)',
    [-12]: 'pico (p)',
    [-15]: 'femto (f)',
  };

  const prefix = prefixMap[engExp] || `10^${engExp}`;
  const supExp = toSuperscript(engExp);
  return `${mantissa.toFixed(6)} × 10${supExp} (${prefix})`;
}

export function toRadix(val: number): string {
  if (!Number.isFinite(val)) return '-';
  const intPart = Math.floor(Math.abs(val));
  const fracPart = Math.abs(val) - intPart;
  const hexInt = intPart.toString(16).toUpperCase();
  const binInt = intPart.toString(2);
  const sign = val < 0 ? '-' : '';

  let hexFrac = '';
  let binFrac = '';
  if (fracPart > 0.0001) {
    let fH = fracPart;
    for (let i = 0; i < 3; i++) {
      fH *= 16;
      const digit = Math.floor(fH);
      hexFrac += digit.toString(16).toUpperCase();
      fH -= digit;
    }
    let fB = fracPart;
    for (let i = 0; i < 4; i++) {
      fB *= 2;
      const bit = Math.floor(fB);
      binFrac += bit.toString(2);
      fB -= bit;
    }
  }

  const hexStr = `${sign}0x${hexInt}${hexFrac ? '.' + hexFrac : ''}`;
  const binStr = `${sign}0b${binInt}${binFrac ? '.' + binFrac : ''}`;
  return `${hexStr} / ${binStr}`;
}

export function formatRadixRegister(val: number, base: RadixBase, bits: WordSize = 32): string {
  if (!Number.isFinite(val)) return '0';
  let mask = BigInt(0);
  if (bits === 64) mask = BigInt('0xFFFFFFFFFFFFFFFF');
  else if (bits === 32) mask = BigInt('0xFFFFFFFF');
  else if (bits === 16) mask = BigInt('0xFFFF');
  else mask = BigInt('0xFF');

  let bigVal = BigInt(Math.floor(val));
  bigVal = BigInt.asUintN(bits, bigVal) & mask;

  if (base === 'HEX') {
    return '0x' + bigVal.toString(16).toUpperCase();
  }
  if (base === 'OCT') {
    return '0o' + bigVal.toString(8);
  }
  if (base === 'BIN') {
    const raw = bigVal.toString(2);
    // Pad to match bits
    const padded = raw.padStart(bits, '0');
    // Group into 4-bit nibbles
    return '0b ' + (padded.match(/.{1,4}/g)?.join(' ') || padded);
  }
  return bigVal.toString(10);
}

export function formatLatexPreview(expr: string): string {
  if (!expr.trim()) return 'Ready';
  return expr
    .replace(/sqrt\(/g, '\\sqrt{')
    .replace(/sin\(/g, '\\sin(')
    .replace(/cos\(/g, '\\cos(')
    .replace(/tan\(/g, '\\tan(')
    .replace(/\*/g, ' \\cdot ')
    .replace(/\^2/g, '^2')
    .replace(/\^/g, '^');
}
