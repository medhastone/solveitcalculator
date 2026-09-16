'use client';

import React, { useRef, useEffect, useState } from 'react';
import {
  AngleMode,
  CalculatorDomain,
  RadixBase,
  WordSize,
  formatLatexPreview,
  toFraction,
  toEngineering,
  toRadix,
  formatRadixRegister,
} from '../../lib/scientific-evaluator';

export interface TapeItem {
  id: string;
  expr: string;
  result: string;
  tag: string;
}

interface Props {
  activeMode: CalculatorDomain;
  inputVal: string;
  setInputVal: React.Dispatch<React.SetStateAction<string>>;
  evaluatedVal: number | null;
  displayResult: string;
  angleMode: AngleMode;
  setAngleMode: (m: AngleMode) => void;
  isSecondActive: boolean;
  setIsSecondActive: React.Dispatch<React.SetStateAction<boolean>>;
  isHypActive: boolean;
  setIsHypActive: React.Dispatch<React.SetStateAction<boolean>>;
  memoryVal: number;
  setMemoryVal: React.Dispatch<React.SetStateAction<number>>;
  lastAns: number;
  tapeHistory: TapeItem[];
  setTapeHistory: React.Dispatch<React.SetStateAction<TapeItem[]>>;
  onEvaluate: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onRestoreTape: (expr: string, res: string) => void;
  onCopyText: (text: string) => void;
}

export default function CalculatorWorkbench({
  activeMode,
  inputVal,
  setInputVal,
  evaluatedVal,
  displayResult,
  angleMode,
  setAngleMode,
  isSecondActive,
  setIsSecondActive,
  isHypActive,
  setIsHypActive,
  memoryVal,
  setMemoryVal,
  lastAns,
  tapeHistory,
  setTapeHistory,
  onEvaluate,
  onUndo,
  onRedo,
  onRestoreTape,
  onCopyText,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Engineering step offset state (for stepping exponent with ENG / ENG-)
  const [engStepOffset, setEngStepOffset] = useState<number>(0);

  // Radix / CS mode states
  const [radixBase, setRadixBase] = useState<RadixBase>('DEC');
  const [wordSize, setWordSize] = useState<WordSize>(32);

  // Focus input on mount or mode change
  useEffect(() => {
    inputRef.current?.focus();
  }, [activeMode]);

  const insertToken = (token: string) => {
    const input = inputRef.current;
    if (!input) {
      setInputVal((prev) => prev + token);
      return;
    }
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? input.value.length;
    const text = input.value;
    const nextVal = text.substring(0, start) + token + text.substring(end);
    setInputVal(nextVal);

    setTimeout(() => {
      input.focus();
      input.setSelectionRange(start + token.length, start + token.length);
    }, 0);
  };

  const deleteChar = () => {
    const input = inputRef.current;
    if (!input) {
      setInputVal((prev) => prev.slice(0, -1));
      return;
    }
    const start = input.selectionStart ?? 0;
    const end = input.selectionEnd ?? 0;
    if (start === end && start > 0) {
      const nextVal = input.value.substring(0, start - 1) + input.value.substring(end);
      setInputVal(nextVal);
      setTimeout(() => {
        input.focus();
        input.setSelectionRange(start - 1, start - 1);
      }, 0);
    } else if (start !== end) {
      const nextVal = input.value.substring(0, start) + input.value.substring(end);
      setInputVal(nextVal);
      setTimeout(() => {
        input.focus();
        input.setSelectionRange(start, start);
      }, 0);
    }
  };

  const clearAll = () => {
    setInputVal('');
    inputRef.current?.focus();
  };

  const toggleSign = () => {
    if (!inputVal) return;
    if (inputVal.startsWith('-(') && inputVal.endsWith(')')) {
      setInputVal(inputVal.slice(2, -1));
    } else if (inputVal.startsWith('-')) {
      setInputVal(inputVal.slice(1));
    } else {
      setInputVal(`-(${inputVal})`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onEvaluate();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      clearAll();
    }
  };

  // Memory operations
  const handleMemAdd = () => {
    if (evaluatedVal !== null && !Number.isNaN(evaluatedVal)) {
      setMemoryVal((prev) => prev + evaluatedVal);
    }
  };

  const handleMemSub = () => {
    if (evaluatedVal !== null && !Number.isNaN(evaluatedVal)) {
      setMemoryVal((prev) => prev - evaluatedVal);
    }
  };

  // Derived representation values
  const numericResult = evaluatedVal ?? (Number(displayResult) || 5.5);
  const decimal16 = Number.isFinite(numericResult) ? numericResult.toFixed(16) : '-';
  const rationalFrac = toFraction(numericResult);
  const scientific = Number.isFinite(numericResult) ? numericResult.toExponential(6) : '-';
  const engineering = toEngineering(numericResult, engStepOffset);
  const radixVal = toRadix(numericResult);

  // Formatted output depending on mode
  let primaryDisplay = displayResult;
  if (activeMode === 'engineering' && Number.isFinite(numericResult)) {
    primaryDisplay = engineering.split(' (')[0];
  } else if (activeMode === 'radix' && Number.isFinite(numericResult)) {
    primaryDisplay = formatRadixRegister(numericResult, radixBase, wordSize);
  }

  // CSV export handler
  const exportTapeCSV = () => {
    if (tapeHistory.length === 0) {
      alert('No history entries to export.');
      return;
    }
    let csvContent = 'data:text/csv;charset=utf-8,Index,Expression,Result,Type\n';
    tapeHistory.forEach((item, index) => {
      const sanitizedExpr = `"${item.expr.replace(/"/g, '""')}"`;
      const sanitizedRes = `"${item.result.replace(/"/g, '""')}"`;
      csvContent += `${index + 1},${sanitizedExpr},${sanitizedRes},${item.tag}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'solveit_scientific_tape.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
      {/* Left / Central Calculator Console (7 cols) */}
      <div className="lg:col-span-7 bg-surface-container-low rounded-xl p-space-md shadow-md space-y-space-md border border-outline-variant/20">
        {/* High Contrast Natural Display Panel (3-Level LCD Simulation) */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm space-y-2 relative overflow-hidden border border-outline-variant/20">
          {/* Mode Status Ribbon inside LCD */}
          <div className="flex items-center justify-between text-label-caps font-label-caps text-on-surface-variant flex-wrap gap-1">
            <div className="flex items-center gap-1.5 font-data-mono">
              <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary font-bold uppercase">
                {activeMode === 'radix' ? radixBase : angleMode}
              </span>
              {activeMode === 'radix' && (
                <span className="px-1.5 py-0.5 rounded bg-secondary/10 text-secondary font-bold">
                  {wordSize}-BIT
                </span>
              )}
              {isHypActive && (
                <span className="px-1.5 py-0.5 rounded bg-surface-container text-on-surface font-semibold">
                  HYP
                </span>
              )}
              {isSecondActive && (
                <span className="px-1.5 py-0.5 rounded bg-secondary/15 text-secondary font-semibold">
                  2ND
                </span>
              )}
              <span className="px-1.5 py-0.5 rounded bg-surface-container text-outline">
                M: {memoryVal.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="hover:text-primary transition-colors p-1 cursor-pointer"
                onClick={onUndo}
                title="Undo (Ctrl+Z)"
              >
                <span className="material-symbols-outlined text-[16px]">undo</span>
              </button>
              <button
                type="button"
                className="hover:text-primary transition-colors p-1 cursor-pointer"
                onClick={onRedo}
                title="Redo (Ctrl+Y)"
              >
                <span className="material-symbols-outlined text-[16px]">redo</span>
              </button>
              <button
                type="button"
                className="hover:text-primary transition-colors p-1 cursor-pointer"
                onClick={() => onCopyText(primaryDisplay)}
                title="Copy Result"
              >
                <span className="material-symbols-outlined text-[16px]">content_copy</span>
              </button>
            </div>
          </div>

          {/* Line 1: Live Expression Input */}
          <div className="pt-1">
            <input
              ref={inputRef}
              className="w-full bg-transparent font-data-mono text-body-lg text-on-surface placeholder:text-outline focus:outline-none tracking-tight selection:bg-primary/20"
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                activeMode === 'radix'
                  ? 'Enter hex/binary expression (e.g. 0xFF & 0x0F)...'
                  : activeMode === 'engineering'
                  ? 'Enter circuit or physical formula...'
                  : activeMode === 'stats'
                  ? 'Enter probability equation (e.g. nCr(52, 5))...'
                  : 'Enter scientific expression...'
              }
            />
          </div>

          {/* Line 2: Mode-Specific Typeset Preview */}
          <div className="py-1 px-2 rounded-lg bg-surface-container-low/70 flex items-center justify-between text-body-sm font-data-mono text-on-surface-variant min-h-[30px] overflow-x-auto">
            <span className="text-label-caps uppercase text-outline text-[10px] tracking-wider shrink-0 mr-2 font-semibold">
              {activeMode === 'radix' ? 'Radix State:' : activeMode === 'engineering' ? 'SI Scale:' : 'LaTeX Preview:'}
            </span>
            <div className="truncate font-body-sm text-primary font-semibold">
              {activeMode === 'radix'
                ? `Base: ${radixBase} | Int: ${Math.floor(numericResult)}`
                : activeMode === 'engineering'
                ? engineering
                : formatLatexPreview(inputVal)}
            </div>
          </div>

          {/* Line 3: Big Evaluated Output */}
          <div className="flex items-baseline justify-end gap-2 pt-1">
            <span className="text-body-sm font-data-mono text-outline select-none font-bold">=</span>
            <span className="font-numerical-display text-numerical-display text-primary tracking-tight font-bold selection:bg-primary/20 break-all text-right">
              {primaryDisplay}
            </span>
          </div>

          {/* Specialized Live 4-Base Register Display in Radix & CS Mode */}
          {activeMode === 'radix' && (
            <div className="pt-2 mt-2 border-t border-outline-variant/20 grid grid-cols-2 gap-2 text-[11px] font-data-mono">
              <div
                className={`p-1.5 rounded cursor-pointer transition-colors ${
                  radixBase === 'HEX' ? 'bg-primary/10 text-primary font-bold' : 'bg-surface-container-low text-on-surface'
                }`}
                onClick={() => setRadixBase('HEX')}
              >
                <span className="text-outline uppercase text-[9px] block">HEX (Base 16)</span>
                <span className="truncate block">{formatRadixRegister(numericResult, 'HEX', wordSize)}</span>
              </div>
              <div
                className={`p-1.5 rounded cursor-pointer transition-colors ${
                  radixBase === 'DEC' ? 'bg-primary/10 text-primary font-bold' : 'bg-surface-container-low text-on-surface'
                }`}
                onClick={() => setRadixBase('DEC')}
              >
                <span className="text-outline uppercase text-[9px] block">DEC (Base 10)</span>
                <span className="truncate block">{formatRadixRegister(numericResult, 'DEC', wordSize)}</span>
              </div>
              <div
                className={`p-1.5 rounded cursor-pointer transition-colors ${
                  radixBase === 'OCT' ? 'bg-primary/10 text-primary font-bold' : 'bg-surface-container-low text-on-surface'
                }`}
                onClick={() => setRadixBase('OCT')}
              >
                <span className="text-outline uppercase text-[9px] block">OCT (Base 8)</span>
                <span className="truncate block">{formatRadixRegister(numericResult, 'OCT', wordSize)}</span>
              </div>
              <div
                className={`p-1.5 rounded cursor-pointer transition-colors ${
                  radixBase === 'BIN' ? 'bg-primary/10 text-primary font-bold' : 'bg-surface-container-low text-on-surface'
                }`}
                onClick={() => setRadixBase('BIN')}
              >
                <span className="text-outline uppercase text-[9px] block">BIN (Base 2)</span>
                <span className="truncate block">{formatRadixRegister(numericResult, 'BIN', wordSize)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Controls Bar Based on Active Mode */}
        {activeMode === 'standard' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* Angle Unit */}
            <div className="col-span-2 flex items-center p-1 rounded-lg bg-surface-container-high">
              {(['DEG', 'RAD', 'GRAD'] as AngleMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setAngleMode(mode)}
                  className={`flex-1 py-1 text-label-caps font-label-caps uppercase rounded transition-colors cursor-pointer ${
                    angleMode === mode
                      ? 'bg-primary text-on-primary shadow-xs font-bold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            {/* Modifiers */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsSecondActive((prev) => !prev)}
                className="flex-1 py-1.5 px-2 rounded-lg bg-surface-container hover:bg-surface-variant text-body-sm font-headline-md text-on-surface shadow-sm transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isSecondActive ? 'bg-secondary animate-ping' : 'bg-outline-variant'
                  }`}
                />
                <span className="font-semibold">2nd</span>
              </button>
              <button
                type="button"
                onClick={() => setIsHypActive((prev) => !prev)}
                className={`flex-1 py-1.5 px-2 rounded-lg text-body-sm font-headline-md shadow-sm transition-all cursor-pointer font-semibold ${
                  isHypActive
                    ? 'bg-secondary-fixed text-on-secondary-fixed font-bold'
                    : 'bg-surface-container hover:bg-surface-variant text-on-surface'
                }`}
              >
                hyp
              </button>
            </div>

            {/* Memory Quick Pad */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="flex-1 py-1.5 rounded-lg bg-surface-container text-body-sm font-data-mono text-on-surface hover:bg-surface-variant transition-colors cursor-pointer"
                onClick={handleMemAdd}
                title="Memory Add"
              >
                M+
              </button>
              <button
                type="button"
                className="flex-1 py-1.5 rounded-lg bg-surface-container text-body-sm font-data-mono text-on-surface hover:bg-surface-variant transition-colors cursor-pointer"
                onClick={handleMemSub}
                title="Memory Subtract"
              >
                M−
              </button>
              <button
                type="button"
                className="flex-1 py-1.5 rounded-lg bg-surface-container text-body-sm font-data-mono text-on-surface hover:bg-surface-variant transition-colors cursor-pointer"
                onClick={() => insertToken(memoryVal.toString())}
                title="Memory Recall"
              >
                MR
              </button>
              <button
                type="button"
                className="flex-1 py-1.5 rounded-lg bg-surface-container text-body-sm font-data-mono text-on-surface hover:bg-surface-variant transition-colors cursor-pointer"
                onClick={() => setMemoryVal(0)}
                title="Memory Clear"
              >
                MC
              </button>
            </div>
          </div>
        )}

        {/* Engineering Controls Bar */}
        {activeMode === 'engineering' && (
          <div className="space-y-2">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="col-span-2 flex items-center p-1 rounded-lg bg-surface-container-high">
                {(['DEG', 'RAD', 'GRAD'] as AngleMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setAngleMode(mode)}
                    className={`flex-1 py-1 text-label-caps font-label-caps uppercase rounded transition-colors cursor-pointer ${
                      angleMode === mode
                        ? 'bg-primary text-on-primary shadow-xs font-bold'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              {/* Exponent Steppers: ENG- / ENG+ */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setEngStepOffset((prev) => prev - 1)}
                  className="flex-1 py-1.5 px-2 rounded-lg bg-surface-container hover:bg-surface-variant text-body-sm font-data-mono text-on-surface shadow-sm transition-all cursor-pointer font-bold"
                  title="Shift exponent by 10^-3"
                >
                  ENG ◀
                </button>
                <button
                  type="button"
                  onClick={() => setEngStepOffset((prev) => prev + 1)}
                  className="flex-1 py-1.5 px-2 rounded-lg bg-surface-container hover:bg-surface-variant text-body-sm font-data-mono text-on-surface shadow-sm transition-all cursor-pointer font-bold"
                  title="Shift exponent by 10^+3"
                >
                  ENG ▶
                </button>
              </div>

              {/* Reset Stepper */}
              <button
                type="button"
                onClick={() => setEngStepOffset(0)}
                className="py-1.5 px-2 rounded-lg bg-surface-container hover:bg-surface-variant text-body-sm font-data-mono text-on-surface-variant hover:text-on-surface shadow-sm transition-all cursor-pointer font-semibold text-center"
              >
                Reset Norm
              </button>
            </div>

            {/* SI Metric Quick Injection Drawer */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
              <span className="text-label-caps font-label-caps uppercase text-outline shrink-0 font-semibold">
                SI Prefixes:
              </span>
              {[
                { label: 'G (10⁹)', val: '*1e9' },
                { label: 'M (10⁶)', val: '*1e6' },
                { label: 'k (10³)', val: '*1e3' },
                { label: 'm (10⁻³)', val: '*1e-3' },
                { label: 'μ (10⁻⁶)', val: '*1e-6' },
                { label: 'n (10⁻⁹)', val: '*1e-9' },
                { label: 'p (10⁻¹²)', val: '*1e-12' },
              ].map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => insertToken(p.val)}
                  className="px-2 py-0.5 rounded bg-surface-container hover:bg-surface-container-high text-[11px] font-data-mono text-on-surface whitespace-nowrap cursor-pointer transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Radix & CS Controls Bar */}
        {activeMode === 'radix' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Base Selector */}
            <div className="flex items-center p-1 rounded-lg bg-surface-container-high">
              {(['HEX', 'DEC', 'OCT', 'BIN'] as RadixBase[]).map((base) => (
                <button
                  key={base}
                  type="button"
                  onClick={() => setRadixBase(base)}
                  className={`flex-1 py-1 text-label-caps font-label-caps uppercase rounded transition-colors cursor-pointer ${
                    radixBase === base
                      ? 'bg-primary text-on-primary shadow-xs font-bold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {base}
                </button>
              ))}
            </div>

            {/* Word Size */}
            <div className="flex items-center p-1 rounded-lg bg-surface-container-high">
              {[
                { size: 64, label: 'QWORD (64)' },
                { size: 32, label: 'DWORD (32)' },
                { size: 16, label: 'WORD (16)' },
                { size: 8, label: 'BYTE (8)' },
              ].map((w) => (
                <button
                  key={w.size}
                  type="button"
                  onClick={() => setWordSize(w.size as WordSize)}
                  className={`flex-1 py-1 text-label-caps font-label-caps uppercase rounded transition-colors cursor-pointer ${
                    wordSize === w.size
                      ? 'bg-secondary text-on-secondary shadow-xs font-bold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {w.size}-bit
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Probability Controls Bar */}
        {activeMode === 'stats' && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
            <span className="text-label-caps font-label-caps uppercase text-outline shrink-0 font-semibold">
              Quick Functions:
            </span>
            <button
              type="button"
              onClick={() => insertToken('rand()')}
              className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high text-[11px] font-data-mono text-on-surface whitespace-nowrap cursor-pointer transition-colors font-semibold"
            >
              Rand (0..1)
            </button>
            <button
              type="button"
              onClick={() => insertToken('randInt(1, 100)')}
              className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high text-[11px] font-data-mono text-on-surface whitespace-nowrap cursor-pointer transition-colors font-semibold"
            >
              RandInt(1, 100)
            </button>
            <button
              type="button"
              onClick={() => insertToken('normalPdf(0, 0, 1)')}
              className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high text-[11px] font-data-mono text-on-surface whitespace-nowrap cursor-pointer transition-colors font-semibold"
            >
              NormalPDF(x, μ, σ)
            </button>
            <button
              type="button"
              onClick={() => insertToken('nCr(')}
              className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high text-[11px] font-data-mono text-secondary font-bold whitespace-nowrap cursor-pointer transition-colors"
            >
              nCr (Choose)
            </button>
            <button
              type="button"
              onClick={() => insertToken('nPr(')}
              className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high text-[11px] font-data-mono text-primary font-bold whitespace-nowrap cursor-pointer transition-colors"
            >
              nPr (Arrange)
            </button>
          </div>
        )}

        {/* Master 7x6 Scientific Keypad Matrix (Tailored by Active Mode!) */}
        <div className="grid grid-cols-6 gap-2">
          {/* ================= STANDARD MODE KEYPAD ================= */}
          {activeMode === 'standard' && (
            <>
              {/* Row 1 */}
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-data-mono text-body-sm font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken(isSecondActive ? 'asin(' : 'sin(')}
              >
                {isSecondActive ? 'asin' : 'sin'}
              </button>
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-data-mono text-body-sm font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken(isSecondActive ? 'acos(' : 'cos(')}
              >
                {isSecondActive ? 'acos' : 'cos'}
              </button>
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-data-mono text-body-sm font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken(isSecondActive ? 'atan(' : 'tan(')}
              >
                {isSecondActive ? 'atan' : 'tan'}
              </button>
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-data-mono text-body-sm font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken(isSecondActive ? '10^(' : 'log(')}
              >
                {isSecondActive ? '10ˣ' : 'log₁₀'}
              </button>
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-data-mono text-body-sm font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken(isSecondActive ? '2.718281828459045^(' : 'ln(')}
              >
                {isSecondActive ? 'eˣ' : 'ln'}
              </button>
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-data-mono text-body-sm font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken(isSecondActive ? '^3' : '^2')}
              >
                {isSecondActive ? 'x³' : 'x²'}
              </button>

              {/* Row 2 */}
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-data-mono text-body-sm font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken(isHypActive ? 'sinh(' : 'asin(')}
              >
                {isHypActive ? 'sinh' : 'asin'}
              </button>
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-data-mono text-body-sm font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken(isHypActive ? 'cosh(' : 'acos(')}
              >
                {isHypActive ? 'cosh' : 'acos'}
              </button>
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-data-mono text-body-sm font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken(isHypActive ? 'tanh(' : 'atan(')}
              >
                {isHypActive ? 'tanh' : 'atan'}
              </button>
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-data-mono text-body-sm font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken(isSecondActive ? 'cbrt(' : 'sqrt(')}
              >
                {isSecondActive ? '³√x' : '√x'}
              </button>
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-data-mono text-body-sm font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken('^')}
              >
                xʸ
              </button>
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-data-mono text-body-sm font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken('1/(')}
              >
                1/x
              </button>

              {/* Row 3 */}
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-secondary font-data-mono text-body-sm font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken('3.141592653589793')}
              >
                π
              </button>
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-secondary font-data-mono text-body-sm font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken('2.718281828459045')}
              >
                e
              </button>
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-data-mono text-body-sm font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken('!')}
              >
                n!
              </button>
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-data-mono text-body-sm font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken('nPr(')}
              >
                nPr
              </button>
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-data-mono text-body-sm font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken('nCr(')}
              >
                nCr
              </button>
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-data-mono text-body-sm font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken(' % ')}
              >
                mod
              </button>
            </>
          )}

          {/* ================= ENGINEERING MODE KEYPAD ================= */}
          {activeMode === 'engineering' && (
            <>
              {/* Row 1: Exponents & Resonant Equations */}
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-data-mono text-body-sm font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken('10^(')}
              >
                10ˣ
              </button>
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-data-mono text-body-sm font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken('e^(')}
              >
                eˣ
              </button>
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-data-mono text-body-sm font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken('^2')}
              >
                x²
              </button>
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-data-mono text-body-sm font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken('sqrt(')}
              >
                √x
              </button>
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-data-mono text-body-sm font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken('^')}
              >
                xʸ
              </button>
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-data-mono text-body-sm font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken('1/(')}
              >
                1/x
              </button>

              {/* Row 2: SI Unit Multipliers & Circuits */}
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-data-mono text-body-sm font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken('*1e3')}
              >
                k (10³)
              </button>
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-data-mono text-body-sm font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken('*1e6')}
              >
                M (10⁶)
              </button>
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-secondary font-data-mono text-body-sm font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken('*1e-3')}
              >
                m (10⁻³)
              </button>
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-secondary font-data-mono text-body-sm font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken('*1e-6')}
              >
                μ (10⁻⁶)
              </button>
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-secondary font-data-mono text-body-sm font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken('*1e-9')}
              >
                n (10⁻⁹)
              </button>
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-secondary font-data-mono text-body-sm font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken('*1e-12')}
              >
                p (10⁻¹²)
              </button>

              {/* Row 3: Engineering Formulas & Decibels */}
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-data-mono text-body-sm font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken('parallel(')}
                title="Parallel impedance/resistance (R1*R2)/(R1+R2)"
              >
                R₁∥R₂
              </button>
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-data-mono text-body-sm font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken('20*log10(')}
                title="Voltage decibel ratio 20*log10(V2/V1)"
              >
                dB (20·log)
              </button>
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-data-mono text-body-sm font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken('10*log10(')}
                title="Power decibel ratio 10*log10(P2/P1)"
              >
                dB (10·log)
              </button>
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-data-mono text-body-sm font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken('1/(2*pi*sqrt(')}
                title="Resonance frequency f = 1/(2pi*sqrt(L*C))"
              >
                f₀ (LC)
              </button>
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-secondary font-data-mono text-body-sm font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken('3.141592653589793')}
              >
                π
              </button>
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-data-mono text-body-sm font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken(' % ')}
              >
                mod
              </button>
            </>
          )}

          {/* ================= RADIX & CS MODE KEYPAD ================= */}
          {activeMode === 'radix' && (
            <>
              {/* Row 1: Hex Letters A - F */}
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-data-mono text-body-sm font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken('A')}
              >
                A
              </button>
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-data-mono text-body-sm font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken('B')}
              >
                B
              </button>
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-data-mono text-body-sm font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken('C')}
              >
                C
              </button>
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-data-mono text-body-sm font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken('D')}
              >
                D
              </button>
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-data-mono text-body-sm font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken('E')}
              >
                E
              </button>
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-data-mono text-body-sm font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken('F')}
              >
                F
              </button>

              {/* Row 2: Bitwise Logic */}
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-secondary font-data-mono text-body-sm font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken(' & ')}
              >
                AND (&amp;)
              </button>
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-secondary font-data-mono text-body-sm font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken(' | ')}
              >
                OR (|)
              </button>
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-secondary font-data-mono text-body-sm font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken(' ^ ')}
              >
                XOR (^)
              </button>
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-secondary font-data-mono text-body-sm font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken(' ~')}
              >
                NOT (~)
              </button>
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-secondary font-data-mono text-body-sm font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken(' << ')}
              >
                SHL (&lt;&lt;)
              </button>
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-secondary font-data-mono text-body-sm font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken(' >> ')}
              >
                SHR (&gt;&gt;)
              </button>

              {/* Row 3: Radix Prefix Identifiers */}
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-data-mono text-body-sm font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken('0x')}
              >
                0x (Hex)
              </button>
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-data-mono text-body-sm font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken('0b')}
              >
                0b (Bin)
              </button>
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-data-mono text-body-sm font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken('0o')}
              >
                0o (Oct)
              </button>
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-data-mono text-body-sm font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken('(')}
              >
                (
              </button>
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-data-mono text-body-sm font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken(')')}
              >
                )
              </button>
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-data-mono text-body-sm font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken(' % ')}
              >
                mod
              </button>
            </>
          )}

          {/* ================= PROBABILITY & STATS KEYPAD ================= */}
          {activeMode === 'stats' && (
            <>
              {/* Row 1: Combinatorics & Distributions */}
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-data-mono text-body-sm font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken('nPr(')}
              >
                nPr
              </button>
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-secondary font-data-mono text-body-sm font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken('nCr(')}
              >
                nCr
              </button>
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-data-mono text-body-sm font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken('!')}
              >
                n!
              </button>
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-data-mono text-body-sm font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken('rand()')}
              >
                Rand
              </button>
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-data-mono text-body-sm font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken('randInt(1, 100)')}
              >
                RandInt
              </button>
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-data-mono text-body-sm font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken('^2')}
              >
                x² (Var)
              </button>

              {/* Row 2: Density & Powers */}
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-data-mono text-body-sm font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken('normalPdf(')}
              >
                NormPDF
              </button>
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-data-mono text-body-sm font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken('sqrt(')}
              >
                √x (σ)
              </button>
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-data-mono text-body-sm font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken('^')}
              >
                pⁿ
              </button>
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-data-mono text-body-sm font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken('1/(')}
              >
                1/x (Odds)
              </button>
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-data-mono text-body-sm font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken('ln(')}
              >
                ln
              </button>
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-data-mono text-body-sm font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken('log(')}
              >
                log
              </button>

              {/* Row 3: Mathematical Constants */}
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-secondary font-data-mono text-body-sm font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken('2.718281828459045')}
              >
                e (Growth)
              </button>
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-secondary font-data-mono text-body-sm font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken('3.141592653589793')}
              >
                π
              </button>
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-data-mono text-body-sm font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken('(')}
              >
                (
              </button>
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-data-mono text-body-sm font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken(')')}
              >
                )
              </button>
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-data-mono text-body-sm font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken('abs(')}
              >
                |x|
              </button>
              <button
                type="button"
                className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-data-mono text-body-sm font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
                onClick={() => insertToken(' % ')}
              >
                mod
              </button>
            </>
          )}

          {/* ================= COMMON NUMERIC KEYPAD (ROWS 4 - 7) ================= */}
          {/* Row 4 */}
          <button
            type="button"
            className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-data-mono text-body-sm font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
            onClick={() => insertToken('(')}
          >
            (
          </button>
          <button
            type="button"
            className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-data-mono text-body-sm font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
            onClick={() => insertToken(')')}
          >
            )
          </button>
          <button
            type="button"
            className="p-2.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface font-numerical-display text-body-lg font-bold shadow-xs active:scale-95 transition-all cursor-pointer border border-outline-variant/10"
            onClick={() => insertToken('7')}
          >
            7
          </button>
          <button
            type="button"
            className="p-2.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface font-numerical-display text-body-lg font-bold shadow-xs active:scale-95 transition-all cursor-pointer border border-outline-variant/10"
            onClick={() => insertToken('8')}
          >
            8
          </button>
          <button
            type="button"
            className="p-2.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface font-numerical-display text-body-lg font-bold shadow-xs active:scale-95 transition-all cursor-pointer border border-outline-variant/10"
            onClick={() => insertToken('9')}
          >
            9
          </button>
          <button
            type="button"
            className="p-2.5 rounded-lg bg-surface-variant hover:bg-surface-container-highest text-primary font-data-mono text-body-lg font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
            onClick={() => insertToken(' / ')}
          >
            ÷
          </button>

          {/* Row 5 */}
          <button
            type="button"
            className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-error font-data-mono text-body-sm font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
            onClick={deleteChar}
          >
            DEL
          </button>
          <button
            type="button"
            className="p-2.5 rounded-lg bg-error-container hover:opacity-90 text-on-error-container font-data-mono text-body-sm font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
            onClick={clearAll}
          >
            AC
          </button>
          <button
            type="button"
            className="p-2.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface font-numerical-display text-body-lg font-bold shadow-xs active:scale-95 transition-all cursor-pointer border border-outline-variant/10"
            onClick={() => insertToken('4')}
          >
            4
          </button>
          <button
            type="button"
            className="p-2.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface font-numerical-display text-body-lg font-bold shadow-xs active:scale-95 transition-all cursor-pointer border border-outline-variant/10"
            onClick={() => insertToken('5')}
          >
            5
          </button>
          <button
            type="button"
            className="p-2.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface font-numerical-display text-body-lg font-bold shadow-xs active:scale-95 transition-all cursor-pointer border border-outline-variant/10"
            onClick={() => insertToken('6')}
          >
            6
          </button>
          <button
            type="button"
            className="p-2.5 rounded-lg bg-surface-variant hover:bg-surface-container-highest text-primary font-data-mono text-body-lg font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
            onClick={() => insertToken(' * ')}
          >
            ×
          </button>

          {/* Row 6 */}
          <button
            type="button"
            className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-data-mono text-body-sm font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
            onClick={() => insertToken('10^(')}
          >
            10ˣ
          </button>
          <button
            type="button"
            className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-data-mono text-body-sm font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
            onClick={() => insertToken('abs(')}
          >
            |x|
          </button>
          <button
            type="button"
            className="p-2.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface font-numerical-display text-body-lg font-bold shadow-xs active:scale-95 transition-all cursor-pointer border border-outline-variant/10"
            onClick={() => insertToken('1')}
          >
            1
          </button>
          <button
            type="button"
            className="p-2.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface font-numerical-display text-body-lg font-bold shadow-xs active:scale-95 transition-all cursor-pointer border border-outline-variant/10"
            onClick={() => insertToken('2')}
          >
            2
          </button>
          <button
            type="button"
            className="p-2.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface font-numerical-display text-body-lg font-bold shadow-xs active:scale-95 transition-all cursor-pointer border border-outline-variant/10"
            onClick={() => insertToken('3')}
          >
            3
          </button>
          <button
            type="button"
            className="p-2.5 rounded-lg bg-surface-variant hover:bg-surface-container-highest text-primary font-data-mono text-body-lg font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
            onClick={() => insertToken(' - ')}
          >
            −
          </button>

          {/* Row 7 */}
          <button
            type="button"
            className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-data-mono text-body-sm font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
            onClick={() => insertToken(lastAns.toString())}
          >
            Ans
          </button>
          <button
            type="button"
            className="p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-data-mono text-body-sm font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
            onClick={toggleSign}
          >
            ±
          </button>
          <button
            type="button"
            className="p-2.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface font-numerical-display text-body-lg font-bold shadow-xs active:scale-95 transition-all cursor-pointer border border-outline-variant/10"
            onClick={() => insertToken('0')}
          >
            0
          </button>
          <button
            type="button"
            className="p-2.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface font-numerical-display text-body-lg font-bold shadow-xs active:scale-95 transition-all cursor-pointer border border-outline-variant/10"
            onClick={() => insertToken('.')}
          >
            .
          </button>
          <button
            type="button"
            className="p-2.5 rounded-lg bg-surface-variant hover:bg-surface-container-highest text-primary font-data-mono text-body-lg font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
            onClick={() => insertToken(' + ')}
          >
            +
          </button>
          <button
            type="button"
            className="p-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-numerical-display text-headline-md font-bold shadow-md active:scale-95 transition-all flex items-center justify-center cursor-pointer"
            onClick={onEvaluate}
          >
            =
          </button>
        </div>
      </div>

      {/* Right Workbench Panel: Multi-Format Results Matrix & Tape History (5 cols) */}
      <div className="lg:col-span-5 space-y-space-md">
        {/* Multi-Format Representation Matrix Card */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-md space-y-space-sm border border-outline-variant/20">
          <div className="flex items-center justify-between pb-2 border-b border-outline-variant/10">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">format_list_numbered</span>
              <h2 className="text-headline-md font-headline-md text-on-surface text-base font-bold">
                Multi-Format Representation
              </h2>
            </div>
            <span className="px-2 py-0.5 rounded bg-surface-container text-[11px] font-data-mono text-on-surface-variant font-semibold">
              16-Digit Precision
            </span>
          </div>

          {/* Formats List */}
          <div className="space-y-2">
            {/* Exact Decimal */}
            <div className="p-2.5 rounded-lg bg-surface-container-low flex items-center justify-between group border border-outline-variant/10">
              <div className="space-y-0.5 truncate pr-2">
                <span className="text-label-caps font-label-caps text-outline uppercase block font-semibold">
                  Decimal (16 Digits)
                </span>
                <span className="font-data-mono text-body-sm text-on-surface font-semibold truncate block">
                  {decimal16}
                </span>
              </div>
              <button
                type="button"
                className="opacity-60 group-hover:opacity-100 p-1.5 rounded-md hover:bg-surface-container text-on-surface-variant transition-all cursor-pointer"
                onClick={() => onCopyText(decimal16)}
                title="Copy Decimal"
              >
                <span className="material-symbols-outlined text-[16px]">content_copy</span>
              </button>
            </div>

            {/* Exact Fraction */}
            <div className="p-2.5 rounded-lg bg-surface-container-low flex items-center justify-between group border border-outline-variant/10">
              <div className="space-y-0.5 truncate pr-2">
                <span className="text-label-caps font-label-caps text-outline uppercase block font-semibold">
                  Rational Fraction
                </span>
                <span className="font-data-mono text-body-sm text-primary font-semibold truncate block">
                  {rationalFrac}
                </span>
              </div>
              <button
                type="button"
                className="opacity-60 group-hover:opacity-100 p-1.5 rounded-md hover:bg-surface-container text-on-surface-variant transition-all cursor-pointer"
                onClick={() => onCopyText(rationalFrac.split(' ')[0])}
                title="Copy Fraction"
              >
                <span className="material-symbols-outlined text-[16px]">content_copy</span>
              </button>
            </div>

            {/* Scientific Notation */}
            <div className="p-2.5 rounded-lg bg-surface-container-low flex items-center justify-between group border border-outline-variant/10">
              <div className="space-y-0.5 truncate pr-2">
                <span className="text-label-caps font-label-caps text-outline uppercase block font-semibold">
                  Scientific Standard
                </span>
                <span className="font-data-mono text-body-sm text-on-surface font-semibold truncate block">
                  {scientific}
                </span>
              </div>
              <button
                type="button"
                className="opacity-60 group-hover:opacity-100 p-1.5 rounded-md hover:bg-surface-container text-on-surface-variant transition-all cursor-pointer"
                onClick={() => onCopyText(scientific)}
                title="Copy Scientific"
              >
                <span className="material-symbols-outlined text-[16px]">content_copy</span>
              </button>
            </div>

            {/* Engineering Notation */}
            <div className="p-2.5 rounded-lg bg-surface-container-low flex items-center justify-between group border border-outline-variant/10">
              <div className="space-y-0.5 truncate pr-2">
                <span className="text-label-caps font-label-caps text-outline uppercase block font-semibold">
                  Engineering &amp; SI Scale
                </span>
                <span className="font-data-mono text-body-sm text-on-surface font-semibold truncate block">
                  {engineering}
                </span>
              </div>
              <button
                type="button"
                className="opacity-60 group-hover:opacity-100 p-1.5 rounded-md hover:bg-surface-container text-on-surface-variant transition-all cursor-pointer"
                onClick={() => onCopyText(engineering)}
                title="Copy Engineering"
              >
                <span className="material-symbols-outlined text-[16px]">content_copy</span>
              </button>
            </div>

            {/* Hex / Binary */}
            <div className="p-2.5 rounded-lg bg-surface-container-low flex items-center justify-between group border border-outline-variant/10">
              <div className="space-y-0.5 truncate pr-2">
                <span className="text-label-caps font-label-caps text-outline uppercase block font-semibold">
                  Hexadecimal &amp; Binary
                </span>
                <span className="font-data-mono text-body-sm text-on-surface font-semibold truncate block">
                  {radixVal}
                </span>
              </div>
              <button
                type="button"
                className="opacity-60 group-hover:opacity-100 p-1.5 rounded-md hover:bg-surface-container text-on-surface-variant transition-all cursor-pointer"
                onClick={() => onCopyText(radixVal)}
                title="Copy Radix"
              >
                <span className="material-symbols-outlined text-[16px]">content_copy</span>
              </button>
            </div>
          </div>

          {/* Matrix Utilities Quick Toolbar */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              className="py-2 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-body-sm font-headline-md text-on-surface flex items-center justify-center gap-1.5 transition-colors cursor-pointer font-semibold"
              onClick={() => onCopyText(primaryDisplay)}
            >
              <span className="material-symbols-outlined text-[16px] text-primary">content_copy</span>
              <span>Copy Result</span>
            </button>
            <button
              type="button"
              className="py-2 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-body-sm font-headline-md text-on-surface flex items-center justify-center gap-1.5 transition-colors cursor-pointer font-semibold"
              onClick={() => insertToken(lastAns.toString())}
            >
              <span className="material-symbols-outlined text-[16px] text-secondary">input</span>
              <span>Insert as Ans</span>
            </button>
          </div>
        </div>

        {/* Calculation Audit History & Tape Session */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-md space-y-space-sm border border-outline-variant/20">
          <div className="flex items-center justify-between pb-2 border-b border-outline-variant/10">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[20px]">history_edu</span>
              <h3 className="text-headline-md font-headline-md text-on-surface text-base font-bold">
                Calculation Audit Tape
              </h3>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="px-2 py-1 text-label-caps font-label-caps uppercase text-error hover:bg-error-container/40 rounded transition-colors cursor-pointer font-semibold"
                onClick={() => setTapeHistory([])}
              >
                Clear
              </button>
              <button
                type="button"
                className="px-2 py-1 text-label-caps font-label-caps uppercase text-primary hover:bg-primary/10 rounded transition-colors cursor-pointer font-semibold"
                onClick={exportTapeCSV}
              >
                Export CSV
              </button>
            </div>
          </div>

          {/* History Entries List */}
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {tapeHistory.length === 0 ? (
              <div className="p-4 text-center text-outline text-body-sm font-data-mono">
                Tape empty. Evaluated formulas will appear here.
              </div>
            ) : (
              tapeHistory.map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container flex items-center justify-between cursor-pointer transition-colors border border-outline-variant/10"
                  onClick={() => onRestoreTape(item.expr, item.result)}
                >
                  <div className="space-y-0.5 truncate pr-2">
                    <span className="font-data-mono text-body-sm text-on-surface truncate block">
                      {item.expr}
                    </span>
                    <span className="text-label-caps font-label-caps text-outline font-medium">
                      {item.tag}
                    </span>
                  </div>
                  <span className="font-data-mono text-body-sm font-bold text-primary ml-2 shrink-0">
                    = {item.result}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
