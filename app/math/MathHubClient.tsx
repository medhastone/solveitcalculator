'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  MASTER_MATH_TOOLS,
  FEATURED_MATH_TOOLS,
  MATH_CATEGORIES,
  MATH_FORMULAS,
  MATH_STEP_PROBLEMS,
  MATH_DIFFERENCES,
  MATH_WORKBENCHES,
  MATH_GUIDES,
  MATH_FAQS,
  POPULAR_MATH_SEARCH_CHIPS,
  MathTool,
  MathCategory,
  MathFormula,
  MathDifference,
  MathStepProblem,
  MathWorkbench,
} from './mathData';
import {
  Calculator,
  Search,
  BookOpen,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Zap,
  TrendingUp,
  Percent,
  Divide,
  Activity,
  Award,
  Layers,
  BarChart2,
  FileText,
  ChevronDown,
  ChevronUp,
  Sliders,
  Compass,
  Circle,
  Hash,
  Binary,
  GraduationCap,
  ShieldCheck,
  Check,
  Info,
  Scale,
  RefreshCw,
  Eye,
  Terminal,
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/* Icon Mapping Helper                                                        */
/* -------------------------------------------------------------------------- */
function getMathIcon(name: string, className = 'w-5 h-5') {
  const n = name.toLowerCase();
  if (n.includes('percent') || n.includes('pie')) return <Percent className={className} />;
  if (n.includes('fraction') || n.includes('divide')) return <Divide className={className} />;
  if (n.includes('graph') || n.includes('chart') || n.includes('stat')) return <BarChart2 className={className} />;
  if (n.includes('geo') || n.includes('circle') || n.includes('trig') || n.includes('compass')) return <Compass className={className} />;
  if (n.includes('algebra') || n.includes('variable')) return <Hash className={className} />;
  if (n.includes('binary') || n.includes('theory')) return <Binary className={className} />;
  if (n.includes('grad') || n.includes('study') || n.includes('assign') || n.includes('book')) return <GraduationCap className={className} />;
  if (n.includes('scale') || n.includes('ratio')) return <Scale className={className} />;
  return <Calculator className={className} />;
}

/* -------------------------------------------------------------------------- */
/* 1. Hero Section with Live Math Evaluator & Hotkey Search                   */
/* -------------------------------------------------------------------------- */
function MathHero() {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [evalResult, setEvalResult] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut '/' to focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Real-time safe math expression evaluator
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setEvalResult(null);
      return;
    }

    // Check if query is an arithmetic expression (numbers, decimals, operators, parentheses)
    if (
      /^[0-9\.\s\+\-\*\/\^\(\)]+$/.test(trimmed) &&
      /[0-9]/.test(trimmed) &&
      /[\+\-\*\/\^]/.test(trimmed)
    ) {
      try {
        const sanitized = trimmed.replace(/\^/g, '**');
        if (/^[0-9\.\s\+\-\*\/\(\)]+$/.test(sanitized)) {
          const res = Function(`"use strict"; return (${sanitized});`)();
          if (typeof res === 'number' && !isNaN(res) && isFinite(res)) {
            setEvalResult(Number(res.toFixed(6)).toString());
            return;
          }
        }
      } catch {
        // Not a valid standalone expression, fallback to search
      }
    }
    setEvalResult(null);
  }, [query]);

  // Filter tools matching query
  const filteredTools = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return MASTER_MATH_TOOLS.filter((t) => {
      const matchName = t.name.toLowerCase().includes(q);
      const matchDesc = t.shortDesc ? t.shortDesc.toLowerCase().includes(q) : false;
      const matchCat = t.category.toLowerCase().includes(q);
      const matchKey = t.keywords ? t.keywords.some((k) => k.toLowerCase().includes(q)) : false;
      return matchName || matchDesc || matchCat || matchKey;
    }).slice(0, 8);
  }, [query]);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950/20 via-slate-900/60 to-slate-950 pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.15),rgba(255,255,255,0))] pointer-events-none" />
      
      <div className="relative max-w-5xl mx-auto text-center">
        {/* Breadcrumb */}
        <nav className="flex items-center justify-center space-x-2 text-xs font-medium text-slate-400 mb-6">
          <Link href="/" className="hover:text-emerald-400 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-emerald-400">Math & Statistics Calculators</span>
        </nav>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          56 Exact Calculators, Formula Proofs & Interactive Solvers
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight mb-4">
          Math & Statistics <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Solvers with Steps</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto mb-8 leading-relaxed">
          Comprehensive step-by-step problem solvers, algebraic simplification, statistical distributions, fraction arithmetic, and mathematical formula libraries with transparent proofs.
        </p>

        {/* Search Bar & Instant Math Evaluator */}
        <div className="max-w-2xl mx-auto relative mb-6">
          <div className="relative flex items-center">
            <div className="absolute left-4 text-slate-400 pointer-events-none">
              <Search className="w-5 h-5" />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(-1);
              }}
              placeholder="Search math solvers or enter formula (e.g. 24*15 + 10^2)... Press '/' to focus"
              className="w-full pl-12 pr-28 py-4 bg-slate-900/90 backdrop-blur-md text-white placeholder-slate-400 text-sm sm:text-base rounded-2xl border border-slate-700 shadow-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 transition-all"
            />
            <div className="absolute right-3 flex items-center gap-1.5">
              <kbd className="hidden sm:inline-block px-2 py-1 text-xs font-mono text-slate-400 bg-slate-800 border border-slate-700 rounded-md shadow-inner">
                /
              </kbd>
            </div>
          </div>

          {/* Instant Evaluator Live Dropdown / Search Results */}
          {(evalResult !== null || filteredTools.length > 0) && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-slate-900/95 backdrop-blur-md rounded-xl border border-slate-700 shadow-2xl overflow-hidden z-50 text-left">
              {evalResult !== null && (
                <div className="p-4 bg-emerald-950/40 border-b border-emerald-800/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-emerald-400 font-medium uppercase tracking-wider">Instant Math Evaluation</div>
                      <div className="text-slate-300 font-mono text-sm">{query} =</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold font-mono text-emerald-300 bg-emerald-900/50 px-3 py-1 rounded-lg border border-emerald-500/30">
                    {evalResult}
                  </div>
                </div>
              )}

              {filteredTools.length > 0 && (
                <div className="p-2 divide-y divide-slate-800 max-h-80 overflow-y-auto">
                  <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Matching Calculators & Solvers</div>
                  {filteredTools.map((t, idx) => (
                    <Link
                      key={t.id + idx}
                      href={t.path}
                      className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                        selectedIndex === idx ? 'bg-emerald-500/20 text-emerald-300' : 'hover:bg-slate-800/80 text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 rounded-lg bg-slate-800 text-emerald-400 shrink-0">
                          {getMathIcon(t.icon, 'w-4 h-4')}
                        </div>
                        <div className="truncate">
                          <div className="font-semibold text-sm truncate">{t.name}</div>
                          <div className="text-xs text-slate-400 truncate">{t.shortDesc}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-3">
                        <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {t.category}
                        </span>
                        {t.supportsSteps && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium">
                            Steps
                          </span>
                        )}
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Filter Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
          <span className="text-xs text-slate-400 font-medium mr-1">Popular:</span>
          {POPULAR_MATH_SEARCH_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => setQuery(chip)}
              className="text-xs px-3 py-1.5 rounded-full bg-slate-800/70 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 border border-slate-700 hover:border-emerald-500/40 transition-all"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 2. Interactive Quick Solvers Playground (Unit Circle, Parabola, Fractions)  */
/* -------------------------------------------------------------------------- */
function InteractiveMathPlayground() {
  const [activeTab, setActiveTab] = useState<'unit-circle' | 'parabola' | 'percentage'>('unit-circle');

  // Unit Circle State
  const [degrees, setDegrees] = useState(45);
  const radians = (degrees * Math.PI) / 180;
  const cosVal = Math.cos(radians);
  const sinVal = Math.sin(radians);
  const tanVal = Math.abs(cosVal) > 0.0001 ? (sinVal / cosVal).toFixed(3) : 'Undefined';

  // Parabola State
  const [coeffA, setCoeffA] = useState(1);
  const [coeffB, setCoeffB] = useState(0);
  const [coeffC, setCoeffC] = useState(-4);
  const vertexX = coeffA !== 0 ? -coeffB / (2 * coeffA) : 0;
  const vertexY = coeffA * vertexX * vertexX + coeffB * vertexX + coeffC;
  const discriminant = coeffB * coeffB - 4 * coeffA * coeffC;

  // Percentage State
  const [percentX, setPercentX] = useState(15);
  const [percentY, setPercentY] = useState(240);
  const percentResult = ((percentX / 100) * percentY).toFixed(2);

  return (
    <section id="interactive-visuals" className="w-full py-12 px-4 sm:px-6 lg:px-8 bg-slate-900 border-b border-slate-800">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sliders className="w-3.5 h-3.5" /> Interactive Math Studio
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Live Mathematical Visualizers</h2>
          <p className="text-slate-400 text-sm mt-2">
            Explore trigonometry angles, polynomial parabolas, and percentage proportions with live reactive calculations.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1 rounded-xl bg-slate-800/80 border border-slate-700">
            <button
              onClick={() => setActiveTab('unit-circle')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'unit-circle'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Unit Circle & Trig
            </button>
            <button
              onClick={() => setActiveTab('parabola')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'parabola'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Quadratic Parabola
            </button>
            <button
              onClick={() => setActiveTab('percentage')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'percentage'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Live Percentage
            </button>
          </div>
        </div>

        {/* Tab 1: Unit Circle */}
        {activeTab === 'unit-circle' && (
          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">Trigonometric Explorer</div>
              <h3 className="text-xl font-bold text-white mb-3">Unit Circle at θ = {degrees}° ({radians.toFixed(3)} rad)</h3>
              <p className="text-slate-400 text-sm mb-6">
                Slide to adjust the angle θ. Observe how the coordinates (x = cos θ, y = sin θ) trace the circumference of the unit radius circle.
              </p>

              <div className="space-y-4 mb-6">
                <div>
                  <div className="flex justify-between text-xs text-slate-300 font-medium mb-1">
                    <span>Angle θ (Degrees)</span>
                    <span className="font-mono text-emerald-400">{degrees}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    step="5"
                    value={degrees}
                    onChange={(e) => setDegrees(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                    <span>0° (0 rad)</span>
                    <span>90° (π/2)</span>
                    <span>180° (π)</span>
                    <span>270° (3π/2)</span>
                    <span>360° (2π)</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <div className="text-[11px] text-slate-400 font-medium">cos(θ) [x-coord]</div>
                  <div className="text-lg font-bold font-mono text-blue-400">{cosVal.toFixed(4)}</div>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <div className="text-[11px] text-slate-400 font-medium">sin(θ) [y-coord]</div>
                  <div className="text-lg font-bold font-mono text-emerald-400">{sinVal.toFixed(4)}</div>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <div className="text-[11px] text-slate-400 font-medium">tan(θ) [sin/cos]</div>
                  <div className="text-lg font-bold font-mono text-amber-400">{tanVal}</div>
                </div>
              </div>
            </div>

            {/* SVG Visual Canvas */}
            <div className="flex flex-col items-center justify-center p-4 bg-slate-900/60 rounded-xl border border-slate-800/80">
              <svg viewBox="-140 -140 280 280" className="w-64 h-64 sm:w-72 sm:h-72">
                {/* Axes */}
                <line x1="-120" y1="0" x2="120" y2="0" stroke="#475569" strokeWidth="1.5" />
                <line x1="0" y1="-120" x2="0" y2="120" stroke="#475569" strokeWidth="1.5" />
                {/* Unit Circle */}
                <circle cx="0" cy="0" r="90" fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
                {/* Triangle & Point */}
                {(() => {
                  const px = 90 * cosVal;
                  const py = -90 * sinVal; // SVG y is inverted
                  return (
                    <>
                      {/* Radius Line */}
                      <line x1="0" y1="0" x2={px} y2={py} stroke="#10b981" strokeWidth="2.5" />
                      {/* Cosine projection (blue) */}
                      <line x1="0" y1="0" x2={px} y2="0" stroke="#60a5fa" strokeWidth="2" />
                      {/* Sine projection (green) */}
                      <line x1={px} y1="0" x2={px} y2={py} stroke="#34d399" strokeWidth="2" strokeDasharray="2 2" />
                      {/* Angle Arc */}
                      <circle cx="0" cy="0" r="24" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
                      {/* Terminal Point */}
                      <circle cx={px} cy={py} r="5" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
                    </>
                  );
                })()}
              </svg>
              <div className="text-xs text-slate-400 text-center mt-3 font-mono">
                Coordinate (cos θ, sin θ) = ({cosVal.toFixed(2)}, {sinVal.toFixed(2)})
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Parabola */}
        {activeTab === 'parabola' && (
          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">Polynomial Analysis</div>
              <h3 className="text-xl font-bold text-white mb-3">
                f(x) = {coeffA}x² {coeffB >= 0 ? `+ ${coeffB}x` : `- ${Math.abs(coeffB)}x`} {coeffC >= 0 ? `+ ${coeffC}` : `- ${Math.abs(coeffC)}`}
              </h3>
              <p className="text-slate-400 text-sm mb-6">
                Adjust quadratic coefficients a, b, and c to compute the vertex coordinates, discriminant Δ, and root nature.
              </p>

              <div className="space-y-4 mb-6">
                <div>
                  <div className="flex justify-between text-xs text-slate-300 font-medium mb-1">
                    <span>Coefficient a (concavity)</span>
                    <span className="font-mono text-emerald-400">{coeffA}</span>
                  </div>
                  <input
                    type="range"
                    min="-5"
                    max="5"
                    step="1"
                    value={coeffA === 0 ? 1 : coeffA}
                    onChange={(e) => setCoeffA(Number(e.target.value) || 1)}
                    className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-slate-300 font-medium mb-1">
                    <span>Coefficient b (linear shift)</span>
                    <span className="font-mono text-emerald-400">{coeffB}</span>
                  </div>
                  <input
                    type="range"
                    min="-10"
                    max="10"
                    step="1"
                    value={coeffB}
                    onChange={(e) => setCoeffB(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-slate-300 font-medium mb-1">
                    <span>Constant c (y-intercept)</span>
                    <span className="font-mono text-emerald-400">{coeffC}</span>
                  </div>
                  <input
                    type="range"
                    min="-10"
                    max="10"
                    step="1"
                    value={coeffC}
                    onChange={(e) => setCoeffC(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                  <div className="text-xs text-slate-400 font-medium">Vertex (h, k)</div>
                  <div className="text-xl font-bold font-mono text-emerald-300 mt-1">
                    ({vertexX.toFixed(2)}, {vertexY.toFixed(2)})
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">h = -b/(2a), k = f(h)</div>
                </div>
                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                  <div className="text-xs text-slate-400 font-medium">Discriminant Δ (b² - 4ac)</div>
                  <div className="text-xl font-bold font-mono text-teal-300 mt-1">{discriminant}</div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    {discriminant > 0 ? '2 Real Roots' : discriminant === 0 ? '1 Repeated Root' : '2 Complex Roots'}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-400 font-medium mb-2">Exact Quadratic Formula Roots</div>
                {discriminant >= 0 ? (
                  <div className="font-mono text-sm text-slate-200 space-y-1">
                    <div>x₁ = {((-coeffB + Math.sqrt(discriminant)) / (2 * coeffA)).toFixed(3)}</div>
                    <div>x₂ = {((-coeffB - Math.sqrt(discriminant)) / (2 * coeffA)).toFixed(3)}</div>
                  </div>
                ) : (
                  <div className="font-mono text-sm text-amber-300">
                    x = {(-coeffB / (2 * coeffA)).toFixed(2)} ± {(Math.sqrt(-discriminant) / (2 * Math.abs(coeffA))).toFixed(2)}i
                  </div>
                )}
                <Link
                  href="/math/quadratic-formula-solver-with-steps"
                  className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-medium mt-3"
                >
                  Open full Quadratic Solver with factoring steps <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Live Percentage */}
        {activeTab === 'percentage' && (
          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 sm:p-8 max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">Direct Proportion Solver</div>
              <h3 className="text-xl font-bold text-white">What is X% of Y?</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Percentage (X %)</label>
                <input
                  type="number"
                  value={percentX}
                  onChange={(e) => setPercentX(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-slate-900 text-white rounded-xl border border-slate-700 font-mono text-base focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Base Number (Y)</label>
                <input
                  type="number"
                  value={percentY}
                  onChange={(e) => setPercentY(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-slate-900 text-white rounded-xl border border-slate-700 font-mono text-base focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="p-5 bg-slate-900 rounded-xl border border-emerald-500/30 text-center">
              <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Calculated Value</div>
              <div className="text-3xl font-extrabold font-mono text-emerald-300 my-1">{percentResult}</div>
              <div className="text-xs text-slate-400 font-mono">
                Calculation: {percentY} × ({percentX} / 100) = {percentResult}
              </div>
            </div>

            <div className="text-center mt-4">
              <Link
                href="/percentage-calculator"
                className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-medium"
              >
                Launch full Percentage Suite (Change, Difference, Discounts) <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 3. Featured Math Solvers Cards                                             */
/* -------------------------------------------------------------------------- */
function FeaturedMathSolvers() {
  return (
    <section id="popular-tools" className="w-full py-14 px-4 sm:px-6 lg:px-8 bg-slate-950">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Award className="w-3.5 h-3.5" /> Core Computational Engines
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Featured Math Solvers</h2>
            <p className="text-slate-400 text-sm mt-1">
              Top mathematical engines with step-by-step proofs, exact fraction representation, and degrees/radians modes.
            </p>
          </div>
          <a
            href="#math-categories"
            className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-400 hover:text-emerald-300 shrink-0"
          >
            View all 11 disciplines <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_MATH_TOOLS.map((tool) => (
            <Link
              key={tool.id}
              href={tool.path}
              className="group relative p-6 bg-slate-900/90 rounded-2xl border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-950/30 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-slate-800 group-hover:bg-emerald-500/20 text-emerald-400 transition-colors">
                    {getMathIcon(tool.icon, 'w-6 h-6')}
                  </div>
                  {tool.supportsSteps && (
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Step-by-Step
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors mb-2">
                  {tool.name}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-4">
                  {tool.shortDesc}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span className="font-medium text-slate-400">{tool.category}</span>
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-400 group-hover:translate-x-0.5 transition-transform">
                  Launch <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 4. Complete 11 Categories & 56 Tools Directory                             */
/* -------------------------------------------------------------------------- */
function MathCategoriesDirectory() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterText, setFilterText] = useState('');

  const displayedCategories = useMemo(() => {
    return MATH_CATEGORIES.filter((cat) => {
      if (selectedCategory !== 'all' && cat.id !== selectedCategory) return false;
      if (!filterText.trim()) return true;
      const ft = filterText.toLowerCase();
      const matchCat = cat.name.toLowerCase().includes(ft) || cat.desc.toLowerCase().includes(ft);
      const matchTools = cat.tools.some(
        (t) => t.name.toLowerCase().includes(ft) || t.desc.toLowerCase().includes(ft)
      );
      return matchCat || matchTools;
    });
  }, [selectedCategory, filterText]);

  const totalToolCount = useMemo(() => {
    return MATH_CATEGORIES.reduce((acc, c) => acc + c.tools.length, 0);
  }, []);

  return (
    <section id="math-categories" className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-slate-900/60 border-y border-slate-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Layers className="w-3.5 h-3.5" /> Complete Curriculum Directory
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            11 Mathematical Disciplines & {totalToolCount} Specialized Solvers
          </h2>
          <p className="text-slate-400 text-base mt-2">
            Explore our systematic math registry spanning foundational arithmetic, high school algebra, trigonometry, coordinate geometry, calculus, and descriptive statistics.
          </p>
        </div>

        {/* Category Pills & Local Filter */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              All Disciplines ({totalToolCount})
            </button>
            {MATH_CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === c.id
                    ? 'bg-emerald-600 text-white shadow-lg'
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Filter within categories..."
              className="w-full pl-9 pr-3 py-2 bg-slate-800/90 text-white placeholder-slate-500 text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedCategories.map((category) => (
            <div
              key={category.id}
              className="bg-slate-950 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all p-6 flex flex-col justify-between shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {getMathIcon(category.icon, 'w-5 h-5')}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{category.name}</h3>
                      <span className="text-xs text-emerald-400 font-medium">{category.tools.length} calculators</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                  {category.desc}
                </p>

                {/* Tools in Category */}
                <div className="space-y-2.5">
                  {category.tools.map((tool, idx) => (
                    <Link
                      key={tool.name + idx}
                      href={tool.path}
                      className="group/item flex items-start justify-between p-2.5 rounded-xl bg-slate-900/80 hover:bg-emerald-950/40 border border-slate-800/80 hover:border-emerald-500/30 transition-all"
                    >
                      <div className="pr-2">
                        <div className="text-xs font-semibold text-slate-200 group-hover/item:text-emerald-300 transition-colors">
                          {tool.name}
                        </div>
                        <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                          {tool.desc}
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover/item:text-emerald-400 shrink-0 mt-1 transition-transform group-hover/item:translate-x-0.5" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                <span>Explore all {category.name.toLowerCase()} methods</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  Open Category <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 5. Interactive Step-by-Step Problem Walkthroughs                           */
/* -------------------------------------------------------------------------- */
function StepByStepWalkthroughs() {
  const [activeProblemId, setActiveProblemId] = useState(MATH_STEP_PROBLEMS[0].id);
  const activeProblem = MATH_STEP_PROBLEMS.find((p) => p.id === activeProblemId) || MATH_STEP_PROBLEMS[0];

  return (
    <section id="quick-answers" className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-slate-950">
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <BookOpen className="w-3.5 h-3.5" /> Pedagogical Methodologies
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Interactive Step-by-Step Problem Solvers</h2>
          <p className="text-slate-400 text-sm mt-2">
            Inspect the exact five-step pedagogical derivation behind core algebra, statistics, fraction, and percentage problems.
          </p>
        </div>

        {/* Problem Selector Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {MATH_STEP_PROBLEMS.map((problem) => (
            <button
              key={problem.id}
              onClick={() => setActiveProblemId(problem.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeProblemId === problem.id
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {problem.topic}: {problem.question}
            </button>
          ))}
        </div>

        {/* Problem Card */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
          {/* Problem Header */}
          <div className="p-6 sm:p-8 bg-gradient-to-r from-emerald-950/50 via-slate-900 to-slate-900 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                {activeProblem.topic} Problem Walkthrough
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                {activeProblem.question}
              </h3>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/30 text-right sm:shrink-0">
              <div className="text-[11px] text-slate-400 uppercase font-semibold">Final Verified Result</div>
              <div className="text-2xl font-extrabold font-mono text-emerald-300 mt-0.5">
                {activeProblem.answer}
              </div>
            </div>
          </div>

          {/* Steps List */}
          <div className="p-6 sm:p-8 space-y-6">
            {activeProblem.steps.map((step) => (
              <div
                key={step.stepNumber}
                className="flex items-start gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold font-mono text-sm flex items-center justify-center shrink-0 border border-emerald-500/30">
                  {step.stepNumber}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-white">{step.title}</div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{step.content}</p>
                  {step.mathExpression && (
                    <div className="mt-2.5 p-2.5 rounded-lg bg-slate-900 font-mono text-xs text-emerald-300 border border-slate-800 inline-block">
                      {step.mathExpression}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Footer Call to Action */}
          <div className="p-6 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-slate-400 text-center sm:text-left">
              Need to solve custom variables with this exact step methodology?
            </span>
            <Link
              href={activeProblem.calculatorPath}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-all"
            >
              Open {activeProblem.calculatorName} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 6. Mathematical Formula Reference Library                                  */
/* -------------------------------------------------------------------------- */
function MathFormulaLibrary() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedFormula, setExpandedFormula] = useState<string | null>(MATH_FORMULAS[0].name);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(MATH_FORMULAS.map((f) => f.category)));
    return ['All', ...cats];
  }, []);

  const displayedFormulas = useMemo(() => {
    if (selectedCategory === 'All') return MATH_FORMULAS;
    return MATH_FORMULAS.filter((f) => f.category.toLowerCase() === selectedCategory.toLowerCase());
  }, [selectedCategory]);

  return (
    <section id="formula-library" className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-slate-900/60 border-y border-slate-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Hash className="w-3.5 h-3.5" /> Formula Library
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            17 Rigorous Mathematical Formula Specifications
          </h2>
          <p className="text-slate-400 text-base mt-2">
            Inspect LaTeX expressions, parameter definitions, algebraic explanations, and application contexts for standardized exams and STEM coursework.
          </p>
        </div>

        {/* Category Selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Formula Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedFormulas.map((formula) => {
            const isExpanded = expandedFormula === formula.name;
            return (
              <div
                key={formula.name}
                className="bg-slate-950 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all overflow-hidden p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {formula.category}
                      </span>
                      <h3 className="text-lg font-bold text-white mt-1.5">{formula.name}</h3>
                    </div>
                    <button
                      onClick={() => setExpandedFormula(isExpanded ? null : formula.name)}
                      className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition-colors"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Formula Display Box */}
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-sm sm:text-base text-emerald-300 font-bold mb-4 overflow-x-auto">
                    {formula.formula}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {formula.explanation}
                  </p>

                  {/* Variable Breakdown when expanded */}
                  {isExpanded && (
                    <div className="pt-4 border-t border-slate-800/80 space-y-3 mb-4">
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Variable Definitions
                      </div>
                      <div className="space-y-1.5">
                        {formula.variables.map((v) => (
                          <div key={v.symbol} className="text-xs flex items-start gap-2">
                            <span className="font-mono font-bold text-emerald-400 shrink-0 w-16">
                              {v.symbol}:
                            </span>
                            <span className="text-slate-400">{v.meaning}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 p-3 rounded-lg bg-slate-900/90 text-xs border border-slate-800 text-slate-400">
                        <span className="font-semibold text-slate-200">When to use: </span>
                        {formula.whenToUse}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Solve automatically:</span>
                  <Link
                    href={formula.calculatorPath}
                    className="inline-flex items-center gap-1 font-semibold text-emerald-400 hover:text-emerald-300"
                  >
                    Open {formula.calculatorName} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 7. Concept Comparison Workbench (11 Distinctions)                         */
/* -------------------------------------------------------------------------- */
function MathConceptDifferences() {
  const [selectedId, setSelectedId] = useState(MATH_DIFFERENCES[0].id);
  const selectedDiff = MATH_DIFFERENCES.find((d) => d.id === selectedId) || MATH_DIFFERENCES[0];

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-slate-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Scale className="w-3.5 h-3.5" /> Concept Comparisons
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            11 Fundamental Mathematical Distinctions
          </h2>
          <p className="text-slate-400 text-base mt-2">
            Clear up commonly confused concepts in statistics, algebra, geometry, and probability with precise definitions and practical examples.
          </p>
        </div>

        {/* Difference Selector Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {MATH_DIFFERENCES.map((diff) => (
            <button
              key={diff.id}
              onClick={() => setSelectedId(diff.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedId === diff.id
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {diff.title}
            </button>
          ))}
        </div>

        {/* Comparison Showcase Card */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 sm:p-8 max-w-5xl mx-auto shadow-2xl">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white">{selectedDiff.title}</h3>
            <p className="text-sm text-emerald-400 font-semibold mt-1">
              Key Distinction: {selectedDiff.keyDifference}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Term A */}
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-xs font-semibold uppercase tracking-wider text-blue-400 mb-1">Concept A</div>
              <h4 className="text-lg font-bold text-white mb-2">{selectedDiff.termA}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{selectedDiff.definitionA}</p>
            </div>

            {/* Term B */}
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">Concept B</div>
              <h4 className="text-lg font-bold text-white mb-2">{selectedDiff.termB}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{selectedDiff.definitionB}</p>
            </div>
          </div>

          {/* Example & When to Use */}
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Concrete Example</div>
              <div className="font-mono text-xs text-slate-200">{selectedDiff.example}</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">When to Use Each</div>
                <div className="text-xs text-slate-300">{selectedDiff.whenToUse}</div>
              </div>
              <Link
                href={selectedDiff.calculatorPath}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-slate-800 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors shrink-0"
              >
                Launch {selectedDiff.calculatorName} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 8. Study & Classroom Workbenches (6 Workbenches)                           */
/* -------------------------------------------------------------------------- */
function MathStudyWorkbenches() {
  return (
    <section id="math-goals" className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-slate-900/60 border-y border-slate-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <GraduationCap className="w-3.5 h-3.5" /> Targeted Workbenches
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Curated Tool Suites for Every Academic Stage
          </h2>
          <p className="text-slate-400 text-base mt-2">
            Jump directly to the essential calculator bundle optimized for your immediate homework assignment, standardized exam, or technical discipline.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MATH_WORKBENCHES.map((wb) => (
            <div
              key={wb.id}
              className="bg-slate-950 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between hover:border-emerald-500/40 transition-all shadow-md"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {getMathIcon(wb.icon, 'w-5 h-5')}
                  </div>
                  <h3 className="text-base font-bold text-white">{wb.title}</h3>
                </div>

                <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                  {wb.desc}
                </p>

                <div className="space-y-2">
                  {wb.tools.map((tool, idx) => (
                    <Link
                      key={tool.name + idx}
                      href={tool.path}
                      className="group/item flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 hover:bg-emerald-950/40 border border-slate-800/80 transition-all"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="text-xs font-semibold text-slate-200 group-hover/item:text-emerald-300 truncate">
                          {tool.name}
                        </div>
                        <div className="text-[11px] text-slate-400 line-clamp-1">
                          {tool.desc}
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover/item:text-emerald-400 shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 9. Deep-Dive Math Educational Guides                                      */
/* -------------------------------------------------------------------------- */
function MathGuidesSection() {
  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-slate-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <BookOpen className="w-3.5 h-3.5" /> Tutorials & Articles
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Step-by-Step Computational Guides
          </h2>
          <p className="text-slate-400 text-base mt-2">
            Read concise conceptual tutorials explaining common denominators, quadratic completing the square, variance calculation, and slope-intercept conversion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {MATH_GUIDES.map((guide, idx) => (
            <div
              key={guide.title + idx}
              className="p-6 bg-slate-900 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-400 mb-3">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">{guide.topic}</span>
                  <span className="text-slate-500">{guide.readTime}</span>
                </div>
                <h3 className="text-base font-bold text-white mb-2 leading-snug">{guide.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{guide.desc}</p>
              </div>

              <div className="pt-4 border-t border-slate-800/80">
                <Link
                  href={guide.calculatorPath}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                >
                  Use {guide.calculatorName} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 10. Accuracy & Academic Standards Bar                                      */
/* -------------------------------------------------------------------------- */
function MathStandardsSection() {
  return (
    <section className="w-full py-12 px-4 sm:px-6 lg:px-8 bg-slate-900/80 border-t border-slate-800">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center sm:text-left">
          <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">IEEE 754 High Precision</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Evaluated with 64-bit double-precision floating-point arithmetic and exact rational fractions to prevent intermediate rounding errors.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400 shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Transparent Proofs & Steps</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Step-by-step formulas, quadratic discriminants, and factoring sequences are displayed openly for classroom and homework validation.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">100% Free & Open Access</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                No paywalls, subscriptions, or required account sign-ups. Designed for students, teachers, engineers, and researchers worldwide.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 11. FAQ Accordions (15 Interactive Items)                                 */
/* -------------------------------------------------------------------------- */
function MathFaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [faqSearch, setFaqSearch] = useState('');

  const filteredFaqs = useMemo(() => {
    if (!faqSearch.trim()) return MATH_FAQS;
    const q = faqSearch.toLowerCase();
    return MATH_FAQS.filter(
      (f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q)
    );
  }, [faqSearch]);

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-slate-950 border-t border-slate-800">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <HelpCircle className="w-3.5 h-3.5" /> Frequently Asked Questions
          </div>
          <h2 className="text-3xl font-extrabold text-white">
            Math & Statistics Calculators FAQ
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            Answers regarding precision, angle modes (deg/rad), exact fractions, and homework usage.
          </p>

          <div className="relative max-w-md mx-auto mt-6">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
              placeholder="Search math FAQs..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 text-white placeholder-slate-500 text-xs rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="space-y-3">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.q}
                className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-800/50 transition-colors"
                >
                  <span className="font-semibold text-sm sm:text-base text-white">{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-emerald-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Main Hub Client Component                                                  */
/* -------------------------------------------------------------------------- */
export default function MathHubClient() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-200">
      <MathHero />
      <InteractiveMathPlayground />
      <FeaturedMathSolvers />
      <MathCategoriesDirectory />
      <StepByStepWalkthroughs />
      <MathFormulaLibrary />
      <MathConceptDifferences />
      <MathStudyWorkbenches />
      <MathGuidesSection />
      <MathStandardsSection />
      <MathFaqSection />
    </div>
  );
}
