'use client';

import React, { useState, useMemo } from 'react';

interface GramToMgScaleVisualizerProps {
  currentGrams: number;
  currentMg: number;
  direction: 'g-to-mg' | 'mg-to-g';
  inputValue: string;
  onValueChange: (newValue: string) => void;
  onDirectionChange?: (newDirection: 'g-to-mg' | 'mg-to-g') => void;
}

type VisualMode = 'scale' | 'balance' | 'matrix';

export default function GramToMgScaleVisualizer({
  currentGrams,
  currentMg,
  direction,
  inputValue,
  onValueChange,
  onDirectionChange,
}: GramToMgScaleVisualizerProps) {
  const [mode, setMode] = useState<VisualMode>('scale');

  // Safe numerical values
  const safeGrams = isNaN(currentGrams) || currentGrams <= 0 ? 1 : currentGrams;
  const safeMg = isNaN(currentMg) || currentMg <= 0 ? 1000 : currentMg;

  // Percentage of 1.0 gram reference (capped between 1% and 100% for standard bar representation)
  const percentOfGram = Math.min(100, Math.max(1, (safeGrams / 1.0) * 100));

  // Slider value mapping: 0.01g to 10g
  const sliderGrams = Math.min(10, Math.max(0.01, safeGrams));

  // Physical mass analogy calculation
  const massAnalogy = useMemo(() => {
    const g = safeGrams;
    if (g < 0.005) {
      return {
        icon: 'grain',
        label: 'Microscopic Particle',
        desc: 'Comparable to an individual grain of table salt (~1 mg) or micro-dose medication.',
      };
    }
    if (g < 0.08) {
      return {
        icon: 'medication',
        label: 'Low-Dose Pharmaceutical',
        desc: 'Comparable to an active vitamin B or low-dose medication tablet (~20–50 mg).',
      };
    }
    if (g < 0.3) {
      return {
        icon: 'pill',
        label: 'Standard Active Tablet',
        desc: 'Comparable to a standard analgesic capsule or caffeine pill (~100–200 mg).',
      };
    }
    if (g < 0.8) {
      return {
        icon: 'vaccines',
        label: 'Full-Strength Paracetamol Tablet',
        desc: 'Comparable to a standard adult paracetamol / acetaminophen tablet (500 mg).',
      };
    }
    if (g < 1.8) {
      return {
        icon: 'attach_file',
        label: 'Standard Steel Paperclip',
        desc: 'The benchmark physical reference for one gram in metrology education (1 g = 1,000 mg).',
      };
    }
    if (g < 3.5) {
      return {
        icon: 'monetization_on',
        label: 'Standard US One-Cent Penny',
        desc: 'A modern post-1982 copper-plated zinc penny weighs approximately 2.5 g (2,500 mg).',
      };
    }
    if (g < 7.5) {
      return {
        icon: 'bakery_dining',
        label: 'US Five-Cent Nickel / Teaspoon of Sugar',
        desc: 'A standard US nickel weighs exactly 5.0 g (5,000 mg), matching one standard level teaspoon of sugar.',
      };
    }
    return {
      icon: 'scale',
      label: 'Multi-Gram Mass Assembly',
      desc: `Substantial laboratory mass (${safeGrams.toFixed(2)} g = ${Math.round(safeMg).toLocaleString()} mg), equivalent to multiple everyday household items.`,
    };
  }, [safeGrams, safeMg]);

  // Handle slider scrub
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (isNaN(val)) return;

    if (direction === 'g-to-mg') {
      onValueChange(val.toString());
    } else {
      onValueChange(Math.round(val * 1000).toString());
    }
  };

  // Quick preset click
  const handlePresetClick = (grams: number) => {
    if (direction === 'g-to-mg') {
      onValueChange(grams.toString());
    } else {
      onValueChange(Math.round(grams * 1000).toString());
    }
  };

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 space-y-space-sm shadow-sm border border-outline-variant/30 transition-all">
      {/* Header & Interactive View Mode Pills */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-outline-variant/20 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-[18px]">straighten</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-label-caps text-label-caps uppercase text-primary font-bold tracking-wider">
                Scale Ratio Visualization
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-data-mono bg-secondary/10 text-secondary font-bold">
                1:1,000
              </span>
            </div>
            <p className="text-[12px] text-on-surface-variant">
              Interactive 10³ metric magnitude comparator
            </p>
          </div>
        </div>

        {/* View Mode Selector */}
        <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl border border-outline-variant/20 text-xs">
          <button
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors flex items-center gap-1 ${
              mode === 'scale'
                ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
            onClick={() => setMode('scale')}
            type="button"
          >
            <span className="material-symbols-outlined text-[14px]">linear_scale</span>
            <span>Ratio Bar</span>
          </button>
          <button
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors flex items-center gap-1 ${
              mode === 'balance'
                ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
            onClick={() => setMode('balance')}
            type="button"
          >
            <span className="material-symbols-outlined text-[14px]">balance</span>
            <span>Equilibrium</span>
          </button>
          <button
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors flex items-center gap-1 ${
              mode === 'matrix'
                ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
            onClick={() => setMode('matrix')}
            type="button"
          >
            <span className="material-symbols-outlined text-[14px]">grid_view</span>
            <span>10³ Grid</span>
          </button>
        </div>
      </div>

      {/* Dynamic Active Mass Card */}
      <div className="grid grid-cols-2 gap-2 bg-surface-container-low/70 p-2.5 rounded-xl border border-outline-variant/20 font-data-mono">
        <div className="p-2 rounded-lg bg-surface-container-lowest border border-outline-variant/15 text-center">
          <span className="text-[10px] text-outline uppercase font-semibold block">Gram Macro Reference</span>
          <span className="text-sm sm:text-base font-bold text-primary">
            {safeGrams >= 1000 ? safeGrams.toLocaleString() : safeGrams.toFixed(safeGrams < 0.01 ? 4 : 2)} g
          </span>
          <span className="text-[10px] text-on-surface-variant block mt-0.5">10⁰ SI Mass</span>
        </div>
        <div className="p-2 rounded-lg bg-surface-container-lowest border border-outline-variant/15 text-center">
          <span className="text-[10px] text-outline uppercase font-semibold block">Milligram Sub-Units</span>
          <span className="text-sm sm:text-base font-bold text-secondary">
            {safeMg >= 1 ? Math.round(safeMg).toLocaleString() : safeMg.toFixed(2)} mg
          </span>
          <span className="text-[10px] text-on-surface-variant block mt-0.5">10⁻³ SI Scale (×1,000)</span>
        </div>
      </div>

      {/* MODE 1: RATIO BAR & INTERACTIVE SCRUBBER */}
      {mode === 'scale' && (
        <div className="space-y-3 py-1">
          {/* Dual Proportional Bar Graphic */}
          <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/20 space-y-2">
            <div className="flex items-center justify-between text-xs font-data-mono">
              <span className="text-on-surface-variant font-medium">Mass Relative to 1.00 Gram Baseline:</span>
              <span className="text-primary font-bold">
                {safeGrams <= 1 ? `${percentOfGram.toFixed(1)}% of 1 g` : `${safeGrams.toFixed(2)}× of 1 g`}
              </span>
            </div>

            {/* Visual Gauge Bar */}
            <div className="relative w-full h-7 bg-surface-container-lowest rounded-lg overflow-hidden border border-outline-variant/30 flex items-center">
              {/* Dynamic Fill */}
              <div
                className="h-full bg-gradient-to-r from-primary/80 to-secondary transition-all duration-300 rounded-l-lg flex items-center justify-end pr-2"
                style={{ width: `${Math.min(100, Math.max(3, percentOfGram))}%` }}
              >
                {percentOfGram >= 15 && (
                  <span className="text-[10px] font-data-mono text-on-primary font-bold whitespace-nowrap drop-shadow">
                    {Math.round(safeMg).toLocaleString()} mg
                  </span>
                )}
              </div>

              {/* Reference Baseline marker at 1.00g / 1,000mg */}
              <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-outline z-10"></div>
            </div>

            {/* Scale Tick Markers */}
            <div className="grid grid-cols-5 text-[10px] font-data-mono text-outline text-center pt-0.5">
              <button
                className="hover:text-primary transition-colors text-left pl-1"
                onClick={() => handlePresetClick(0.01)}
                type="button"
              >
                0 mg
              </button>
              <button
                className="hover:text-primary transition-colors text-center"
                onClick={() => handlePresetClick(0.25)}
                type="button"
              >
                250 mg
              </button>
              <button
                className="hover:text-primary transition-colors text-center"
                onClick={() => handlePresetClick(0.5)}
                type="button"
              >
                500 mg
              </button>
              <button
                className="hover:text-primary transition-colors text-center"
                onClick={() => handlePresetClick(0.75)}
                type="button"
              >
                750 mg
              </button>
              <button
                className="hover:text-primary transition-colors text-right pr-1 font-bold text-primary"
                onClick={() => handlePresetClick(1.0)}
                type="button"
              >
                1,000 mg
              </button>
            </div>
          </div>

          {/* Interactive Mass Scrubber Slider */}
          <div className="space-y-1 pt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-on-surface flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-primary">tune</span>
                Live Mass Scrubber
              </span>
              <span className="font-data-mono text-xs text-primary font-bold">
                {sliderGrams.toFixed(2)} g = {Math.round(sliderGrams * 1000).toLocaleString()} mg
              </span>
            </div>
            <input
              aria-label="Interactive Mass Scrubber from 0.01g to 10g"
              className="w-full h-2 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
              max="10"
              min="0.01"
              onChange={handleSliderChange}
              step="0.01"
              type="range"
              value={sliderGrams}
            />
            <div className="flex justify-between text-[10px] text-outline font-data-mono">
              <span>0.01 g (10 mg)</span>
              <span>2.5 g</span>
              <span>5.0 g</span>
              <span>7.5 g</span>
              <span>10.0 g (10,000 mg)</span>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: EQUILIBRIUM BALANCE SCALE */}
      {mode === 'balance' && (
        <div className="py-2 flex flex-col items-center space-y-3">
          <svg
            aria-label="Gravitational Mass Equilibrium Comparator"
            className="w-full max-w-[340px] h-36 drop-shadow-sm overflow-visible"
            viewBox="0 0 340 140"
          >
            {/* Fulcrum Stand */}
            <polygon className="fill-outline-variant/40" points="170,35 152,125 188,125" />
            <rect className="fill-outline-variant/60" height="8" rx="2" width="80" x="130" y="125" />

            {/* Pivot Joint & Equilibrium Pin */}
            <circle className="fill-primary" cx="170" cy="35" r="5" />
            <line
              className="stroke-emerald-500 stroke-2"
              strokeDasharray="2 2"
              x1="170"
              x2="170"
              y1="10"
              y2="35"
            />
            <polygon className="fill-emerald-500" points="170,8 167,14 173,14" />

            {/* Level Balance Beam (In Equilibrium because 1g = 1000mg) */}
            <line
              className="stroke-on-surface-variant stroke-[5]"
              strokeLinecap="round"
              x1="45"
              x2="295"
              y1="35"
              y2="35"
            />

            {/* Left Pan Strings & Tray (Gram Side) */}
            <line className="stroke-outline/60 stroke-1" x1="45" x2="25" y1="35" y2="80" />
            <line className="stroke-outline/60 stroke-1" x1="45" x2="65" y1="35" y2="80" />
            <ellipse className="fill-surface-container-high stroke-outline-variant/40" cx="45" cy="80" rx="30" ry="6" />

            {/* Left Weight Block (Grams) */}
            <rect
              className="fill-primary/20 stroke-primary stroke-1"
              height="24"
              rx="4"
              width="40"
              x="25"
              y="56"
            />
            <text
              className="fill-primary font-bold text-[10px]"
              fontFamily="monospace"
              textAnchor="middle"
              x="45"
              y="72"
            >
              {safeGrams >= 10 ? Math.round(safeGrams) : safeGrams.toFixed(1)} g
            </text>

            {/* Right Pan Strings & Tray (Milligram Side) */}
            <line className="stroke-outline/60 stroke-1" x1="295" x2="275" y1="35" y2="80" />
            <line className="stroke-outline/60 stroke-1" x1="295" x2="315" y1="35" y2="80" />
            <ellipse className="fill-surface-container-high stroke-outline-variant/40" cx="295" cy="80" rx="30" ry="6" />

            {/* Right Stack (Milligram Equivalent) */}
            <rect
              className="fill-secondary/20 stroke-secondary stroke-1"
              height="24"
              rx="4"
              width="46"
              x="272"
              y="56"
            />
            <text
              className="fill-secondary font-bold text-[9px]"
              fontFamily="monospace"
              textAnchor="middle"
              x="295"
              y="72"
            >
              {safeMg >= 1000 ? Math.round(safeMg).toLocaleString() : safeMg.toFixed(1)} mg
            </text>

            {/* Center Equilibrium Badge */}
            <rect className="fill-emerald-500/10 stroke-emerald-500/40" height="18" rx="9" width="110" x="115" y="48" />
            <text
              className="fill-emerald-600 dark:fill-emerald-400 font-bold text-[9px]"
              fontFamily="sans-serif"
              textAnchor="middle"
              x="170"
              y="60"
            >
              1:1,000 EQUILIBRIUM
            </text>
          </svg>

          <div className="text-center">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Exact Gravitational Mass Equivalence
            </span>
          </div>
        </div>
      )}

      {/* MODE 3: 1,000-UNIT METRIC MATRIX */}
      {mode === 'matrix' && (
        <div className="space-y-2 py-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-on-surface font-semibold">10×10 Matrix (Each block = 10 mg):</span>
            <span className="font-data-mono text-primary font-bold">
              100 blocks = 1,000 mg = 1 g
            </span>
          </div>

          {/* 100 Grid Cells */}
          <div className="grid grid-cols-10 gap-1 p-2.5 bg-surface-container-low rounded-xl border border-outline-variant/20">
            {Array.from({ length: 100 }).map((_, idx) => {
              const cellMg = (idx + 1) * 10;
              const isActive = safeMg >= cellMg;
              return (
                <button
                  className={`h-2.5 rounded-sm transition-all cursor-pointer ${
                    isActive
                      ? 'bg-primary hover:bg-primary-container shadow-xs'
                      : 'bg-surface-container-highest hover:bg-primary/40'
                  }`}
                  key={idx}
                  onClick={() => handlePresetClick(cellMg / 1000)}
                  title={`${cellMg} mg (${(cellMg / 1000).toFixed(2)} g)`}
                  type="button"
                />
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] text-on-surface-variant font-data-mono pt-1">
            <span>0 mg</span>
            <span className="text-primary font-semibold">
              {Math.min(100, Math.round(percentOfGram))} of 100 blocks active
            </span>
            <span>1,000 mg (1 g)</span>
          </div>
        </div>
      )}

      {/* Everyday Mass Physical Analogy */}
      <div className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/20 flex items-start gap-2.5 text-body-sm">
        <div className="w-7 h-7 rounded-lg bg-surface-container-lowest text-primary flex items-center justify-center shrink-0 shadow-xs mt-0.5">
          <span className="material-symbols-outlined text-[16px]">{massAnalogy.icon}</span>
        </div>
        <div>
          <span className="font-semibold text-on-surface block text-xs">
            {massAnalogy.label}
          </span>
          <p className="text-outline text-[11px] leading-relaxed mt-0.5">
            {massAnalogy.desc}
          </p>
        </div>
      </div>

      {/* Quick Interactive Benchmark Chips */}
      <div className="pt-1">
        <span className="text-[11px] font-label-caps uppercase text-outline font-semibold block mb-1.5">
          Quick Scale Anchors (Click to Visualize &amp; Calculate):
        </span>
        <div className="flex flex-wrap gap-1.5 font-data-mono text-xs">
          {[
            { label: '10 mg', g: 0.01 },
            { label: '100 mg', g: 0.1 },
            { label: '250 mg', g: 0.25 },
            { label: '500 mg', g: 0.5 },
            { label: '1,000 mg (1 g)', g: 1.0 },
            { label: '2,500 mg (2.5 g)', g: 2.5 },
            { label: '5,000 mg (5 g)', g: 5.0 },
          ].map((item) => (
            <button
              className={`px-2 py-0.5 rounded-md border text-[11px] transition-all cursor-pointer ${
                Math.abs(safeGrams - item.g) < 0.001
                  ? 'bg-primary text-on-primary border-primary font-bold shadow-xs'
                  : 'bg-surface-container-lowest hover:bg-surface-container text-on-surface border-outline-variant/30'
              }`}
              key={item.label}
              onClick={() => handlePresetClick(item.g)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
