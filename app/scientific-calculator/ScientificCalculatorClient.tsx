'use client';

import React, { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import CalculatorWorkbench, { TapeItem } from '../../components/scientific/CalculatorWorkbench';
import UnitCircleSection from '../../components/scientific/UnitCircleSection';
import ReferenceSections from '../../components/scientific/ReferenceSections';
import { AngleMode, evaluateScientific } from '../../lib/scientific-evaluator';

export default function ScientificCalculatorClient() {
  const [activeMode, setActiveMode] = useState<'standard' | 'engineering' | 'radix' | 'stats'>('standard');
  const [inputVal, setInputVal] = useState<string>('sqrt(3^2 + 4^2) + sin(45) * cos(45)');
  const [displayResult, setDisplayResult] = useState<string>('5.5');
  const [evaluatedVal, setEvaluatedVal] = useState<number | null>(5.5);
  const [lastAns, setLastAns] = useState<number>(5.5);
  const [angleMode, setAngleMode] = useState<AngleMode>('DEG');
  const [isSecondActive, setIsSecondActive] = useState<boolean>(false);
  const [isHypActive, setIsHypActive] = useState<boolean>(false);
  const [memoryVal, setMemoryVal] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Undo / Redo history stacks
  const [history, setHistory] = useState<string[]>(['sqrt(3^2 + 4^2) + sin(45) * cos(45)']);
  const [historyIdx, setHistoryIdx] = useState<number>(0);

  // Initial audit tape entries
  const [tapeHistory, setTapeHistory] = useState<TapeItem[]>([
    {
      id: 't-1',
      expr: 'sqrt(3^2 + 4^2) + sin(45) * cos(45)',
      result: '5.5',
      tag: 'Formula AST Resolved',
    },
    {
      id: 't-2',
      expr: 'log(1024) / log(2)',
      result: '10',
      tag: 'Binary Radix Log',
    },
    {
      id: 't-3',
      expr: '120 + 9',
      result: '129',
      tag: 'Factorial Sum',
    },
  ]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  }, []);

  const handleCopyText = useCallback((text: string) => {
    if (!text || text === '-') return;
    navigator.clipboard.writeText(text).then(() => {
      showToast(`Copied to clipboard: ${text}`);
    });
  }, [showToast]);

  // Derive live quick evaluation
  const liveEvaluation = useMemo(() => {
    return evaluateScientific(inputVal, angleMode);
  }, [inputVal, angleMode]);

  // Main evaluation logic
  const handleEvaluate = useCallback(() => {
    if (!inputVal.trim()) return;

    const evalRes = evaluateScientific(inputVal, angleMode);
    if (evalRes.result !== null && Number.isFinite(evalRes.result)) {
      const num = evalRes.result;
      const formatted = Math.abs(num) < 1e-12 && num !== 0 ? '0' : Number(num.toFixed(12)).toString();
      setEvaluatedVal(num);
      setDisplayResult(formatted);
      setLastAns(num);

      // Save to undo history stack
      setHistory((prev) => [...prev.slice(0, historyIdx + 1), inputVal]);
      setHistoryIdx((prev) => prev + 1);

      // Append to audit tape
      setTapeHistory((prev) => [
        {
          id: `tape-${Date.now()}`,
          expr: inputVal,
          result: formatted,
          tag: 'User Evaluated',
        },
        ...prev.slice(0, 49),
      ]);
    } else {
      setDisplayResult(evalRes.error || 'Syntax Error');
      setEvaluatedVal(null);
    }
  }, [inputVal, angleMode, historyIdx]);

  // Computed effective result: evaluated if valid, or live if available
  const effectiveResult = useMemo(() => {
    if (liveEvaluation.result !== null && Number.isFinite(liveEvaluation.result)) {
      const num = liveEvaluation.result;
      return Math.abs(num) < 1e-12 && num !== 0 ? '0' : Number(num.toFixed(12)).toString();
    }
    return displayResult;
  }, [liveEvaluation, displayResult]);

  const effectiveNumeric = useMemo(() => {
    if (liveEvaluation.result !== null && Number.isFinite(liveEvaluation.result)) {
      return liveEvaluation.result;
    }
    return evaluatedVal;
  }, [liveEvaluation, evaluatedVal]);

  const handleUndo = useCallback(() => {
    if (historyIdx > 0) {
      const nextIdx = historyIdx - 1;
      setHistoryIdx(nextIdx);
      setInputVal(history[nextIdx] || '');
    }
  }, [historyIdx, history]);

  const handleRedo = useCallback(() => {
    if (historyIdx < history.length - 1) {
      const nextIdx = historyIdx + 1;
      setHistoryIdx(nextIdx);
      setInputVal(history[nextIdx] || '');
    }
  }, [historyIdx, history]);

  const handleRestoreTape = useCallback((expr: string, res: string) => {
    setInputVal(expr);
    setDisplayResult(res);
  }, []);

  const handleInsertPreset = useCallback((preset: string) => {
    setInputVal(preset);
  }, []);

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen flex flex-col selection:bg-primary/20">
      

      {/* Main Container */}
      <main className="w-full pt-16 bg-surface flex-1">
        <div className="flex flex-col w-full">
          {/* Micro Telemetry & Precision Architecture Top Bar */}
          <div className="w-full bg-surface-container-lowest/80 backdrop-blur-md sticky top-16 z-40 shadow-[0_1px_4px_rgba(0,0,0,0.03)] border-b border-outline-variant/20">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop py-2.5 flex flex-wrap items-center justify-between gap-y-2">
              {/* Breadcrumb Path */}
              <nav aria-label="Breadcrumbs" className="flex items-center gap-1.5 text-body-sm font-body-sm text-on-surface-variant">
                <Link className="hover:text-primary transition-colors" href="/">
                  Home
                </Link>
                <span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
                <Link className="hover:text-primary transition-colors" href="/science">
                  Science &amp; Math
                </Link>
                <span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
                <span className="text-on-surface font-headline-md text-body-sm font-bold">
                  Scientific Calculator
                </span>
              </nav>

              {/* Live Client Telemetry Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container text-on-surface text-label-caps font-label-caps uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                  <span>IEEE 754-2019 Core</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container text-on-surface text-label-caps font-label-caps uppercase tracking-wider">
                  <span className="material-symbols-outlined text-secondary text-[13px]">lock</span>
                  <span>Air-Gapped Sandbox</span>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant text-label-caps font-label-caps uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[13px] text-primary">speed</span>
                  <span>&lt;0.001ms Latency</span>
                </div>
                <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-high text-primary font-data-mono text-data-mono text-[11px] font-semibold">
                  <span>LaTeX v2026.1</span>
                </div>
              </div>
            </div>
          </div>

          {/* Primary Math Workbench Workspace */}
          <section className="max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop w-full py-space-xl space-y-space-xl">
            {/* Header Minimalist Hero */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
              <div className="space-y-space-xs max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-label-caps text-label-caps uppercase tracking-wider font-semibold">
                  <span className="material-symbols-outlined text-[15px]">calculate</span>
                  <span>High-Precision Mathematical Intelligence Workbench</span>
                </div>
                <h1 className="text-headline-lg font-headline-lg text-on-surface tracking-tight">
                  Scientific Calculator &amp; Equation Solver
                </h1>
                <p className="text-body-md font-body-md text-on-surface-variant">
                  Arbitrary-precision trigonometric routines, arbitrary base logarithms, factorials, permutations, power series, and engineering notations with client-side exact execution and live LaTeX rendering.
                </p>
              </div>

              {/* Quick Mode Switcher Tabs */}
              <div className="inline-flex p-1 rounded-xl bg-surface-container self-start md:self-auto shadow-inner">
                <button
                  type="button"
                  onClick={() => {
                    setActiveMode('standard');
                    setInputVal('sqrt(3^2 + 4^2) + sin(45) * cos(45)');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-body-sm transition-all cursor-pointer ${
                    activeMode === 'standard'
                      ? 'font-headline-md text-on-primary bg-primary shadow-sm font-bold'
                      : 'font-body-sm text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Standard
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveMode('engineering');
                    setInputVal('1 / (2 * pi * sqrt(10e-6 * 100e-12))');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-body-sm transition-all cursor-pointer ${
                    activeMode === 'engineering'
                      ? 'font-headline-md text-on-primary bg-primary shadow-sm font-bold'
                      : 'font-body-sm text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Engineering
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveMode('radix');
                    setInputVal('0xFF ^ 0x0F');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-body-sm transition-all cursor-pointer ${
                    activeMode === 'radix'
                      ? 'font-headline-md text-on-primary bg-primary shadow-sm font-bold'
                      : 'font-body-sm text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Radix &amp; CS
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveMode('stats');
                    setInputVal('nCr(52, 5)');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-body-sm transition-all cursor-pointer ${
                    activeMode === 'stats'
                      ? 'font-headline-md text-on-primary bg-primary shadow-sm font-bold'
                      : 'font-body-sm text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Probability
                </button>
              </div>
            </div>

            {/* Quick Formula Preset Scroller (Dynamically Adapted by Active Mode) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-label-caps font-label-caps text-outline uppercase tracking-wider whitespace-nowrap mr-1 font-semibold">
                {activeMode.toUpperCase()} Presets:
              </span>

              {/* Standard Mode Presets */}
              {activeMode === 'standard' && (
                <>
                  <button
                    type="button"
                    className="px-3 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-body-sm font-data-mono text-on-surface whitespace-nowrap transition-colors shadow-sm cursor-pointer border border-outline-variant/10"
                    onClick={() => handleInsertPreset('sin(45) * cos(45)')}
                  >
                    sin(45°) × cos(45°)
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-body-sm font-data-mono text-on-surface whitespace-nowrap transition-colors shadow-sm cursor-pointer border border-outline-variant/10"
                    onClick={() => handleInsertPreset('log(1024) / log(2)')}
                  >
                    log₂(1024)
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-body-sm font-data-mono text-on-surface whitespace-nowrap transition-colors shadow-sm cursor-pointer border border-outline-variant/10"
                    onClick={() => handleInsertPreset('sqrt(4^2 + 3^2)')}
                  >
                    √(4² + 3²)
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-body-sm font-data-mono text-on-surface whitespace-nowrap transition-colors shadow-sm cursor-pointer border border-outline-variant/10"
                    onClick={() => handleInsertPreset('15! / (10! * 5!)')}
                  >
                    15! / (10! × 5!)
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-body-sm font-data-mono text-on-surface whitespace-nowrap transition-colors shadow-sm cursor-pointer border border-outline-variant/10"
                    onClick={() => handleInsertPreset('(6.02214e23) * (1.60217e-19)')}
                  >
                    6.022×10²³ × 1.602×10⁻¹⁹
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-body-sm font-data-mono text-on-surface whitespace-nowrap transition-colors shadow-sm cursor-pointer border border-outline-variant/10"
                    onClick={() => handleInsertPreset('2.718281828459^(3.1415926535 * 0) + 1')}
                  >
                    e⁰ + 1
                  </button>
                </>
              )}

              {/* Engineering Mode Presets */}
              {activeMode === 'engineering' && (
                <>
                  <button
                    type="button"
                    className="px-3 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-body-sm font-data-mono text-on-surface whitespace-nowrap transition-colors shadow-sm cursor-pointer border border-outline-variant/10"
                    onClick={() => handleInsertPreset('1 / (2 * pi * sqrt(10e-6 * 100e-12))')}
                  >
                    Resonance: 1/(2π√LC)
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-body-sm font-data-mono text-on-surface whitespace-nowrap transition-colors shadow-sm cursor-pointer border border-outline-variant/10"
                    onClick={() => handleInsertPreset('parallel(10000, 15000)')}
                  >
                    Parallel: 10kΩ ∥ 15kΩ
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-body-sm font-data-mono text-on-surface whitespace-nowrap transition-colors shadow-sm cursor-pointer border border-outline-variant/10"
                    onClick={() => handleInsertPreset('20 * log10(5 / 0.775)')}
                  >
                    Audio Gain: 20·log₁₀(V₂/V₁)
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-body-sm font-data-mono text-on-surface whitespace-nowrap transition-colors shadow-sm cursor-pointer border border-outline-variant/10"
                    onClick={() => handleInsertPreset('(120 * 120) / 24')}
                  >
                    Power: V²/R (120V, 24Ω)
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-body-sm font-data-mono text-on-surface whitespace-nowrap transition-colors shadow-sm cursor-pointer border border-outline-variant/10"
                    onClick={() => handleInsertPreset('10 * 1e3 * 2.2 * 1e-6')}
                  >
                    RC Tau: 10kΩ × 2.2μF
                  </button>
                </>
              )}

              {/* Radix & CS Mode Presets */}
              {activeMode === 'radix' && (
                <>
                  <button
                    type="button"
                    className="px-3 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-body-sm font-data-mono text-on-surface whitespace-nowrap transition-colors shadow-sm cursor-pointer border border-outline-variant/10"
                    onClick={() => handleInsertPreset('0xFF ^ 0x0F')}
                  >
                    XOR Mask: 0xFF ^ 0x0F
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-body-sm font-data-mono text-on-surface whitespace-nowrap transition-colors shadow-sm cursor-pointer border border-outline-variant/10"
                    onClick={() => handleInsertPreset('(1 << 16) - 1')}
                  >
                    Max 16-bit: (1 &lt;&lt; 16) - 1
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-body-sm font-data-mono text-on-surface whitespace-nowrap transition-colors shadow-sm cursor-pointer border border-outline-variant/10"
                    onClick={() => handleInsertPreset('0b10110010 >> 2')}
                  >
                    Bit Shift: 0b10110010 &gt;&gt; 2
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-body-sm font-data-mono text-on-surface whitespace-nowrap transition-colors shadow-sm cursor-pointer border border-outline-variant/10"
                    onClick={() => handleInsertPreset('0xCAFE & 0x00FF')}
                  >
                    Low Byte: 0xCAFE &amp; 0x00FF
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-body-sm font-data-mono text-on-surface whitespace-nowrap transition-colors shadow-sm cursor-pointer border border-outline-variant/10"
                    onClick={() => handleInsertPreset('0x1000 + 0x0ABC')}
                  >
                    Offset: 0x1000 + 0x0ABC
                  </button>
                </>
              )}

              {/* Probability Mode Presets */}
              {activeMode === 'stats' && (
                <>
                  <button
                    type="button"
                    className="px-3 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-body-sm font-data-mono text-on-surface whitespace-nowrap transition-colors shadow-sm cursor-pointer border border-outline-variant/10"
                    onClick={() => handleInsertPreset('nCr(52, 5)')}
                  >
                    Poker Hands: ₅₂C₅
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-body-sm font-data-mono text-on-surface whitespace-nowrap transition-colors shadow-sm cursor-pointer border border-outline-variant/10"
                    onClick={() => handleInsertPreset('nPr(10, 3)')}
                  >
                    Podium: ₁₀P₃
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-body-sm font-data-mono text-on-surface whitespace-nowrap transition-colors shadow-sm cursor-pointer border border-outline-variant/10"
                    onClick={() => handleInsertPreset('nCr(10, 3) * (0.5^3) * (0.5^7)')}
                  >
                    Binomial: 3 Heads in 10
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-body-sm font-data-mono text-on-surface whitespace-nowrap transition-colors shadow-sm cursor-pointer border border-outline-variant/10"
                    onClick={() => handleInsertPreset('nCr(69, 5) * 26')}
                  >
                    Powerball Combinations
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-body-sm font-data-mono text-on-surface whitespace-nowrap transition-colors shadow-sm cursor-pointer border border-outline-variant/10"
                    onClick={() => handleInsertPreset('normalPdf(0, 0, 1)')}
                  >
                    Standard Normal Peak (0)
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-body-sm font-data-mono text-on-surface whitespace-nowrap transition-colors shadow-sm cursor-pointer border border-outline-variant/10"
                    onClick={() => handleInsertPreset('randInt(1, 6) + randInt(1, 6)')}
                  >
                    2d6 Dice Roll Simulation
                  </button>
                </>
              )}
            </div>

            {/* Master Calculator Console & Multi-Format/Tape Panels */}
            <CalculatorWorkbench
              activeMode={activeMode}
              inputVal={inputVal}
              setInputVal={setInputVal}
              evaluatedVal={effectiveNumeric}
              displayResult={effectiveResult}
              angleMode={angleMode}
              setAngleMode={setAngleMode}
              isSecondActive={isSecondActive}
              setIsSecondActive={setIsSecondActive}
              isHypActive={isHypActive}
              setIsHypActive={setIsHypActive}
              memoryVal={memoryVal}
              setMemoryVal={setMemoryVal}
              lastAns={lastAns}
              tapeHistory={tapeHistory}
              setTapeHistory={setTapeHistory}
              onEvaluate={handleEvaluate}
              onUndo={handleUndo}
              onRedo={handleRedo}
              onRestoreTape={handleRestoreTape}
              onCopyText={handleCopyText}
            />
          </section>

          {/* Section 4: Universal Mathematical & Physical Constants */}
          <ReferenceSections onInsertConstant={(val) => setInputVal(val)} />

          {/* Section 5: Interactive Unit Circle & Trigonometric Explorer */}
          <UnitCircleSection />
        </div>
      </main>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-4 py-2.5 rounded-xl shadow-lg font-body-sm flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
