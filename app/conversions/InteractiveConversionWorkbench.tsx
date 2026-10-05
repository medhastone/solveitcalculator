'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  Ruler,
  Scale,
  Thermometer,
  Droplets,
  Square,
  Gauge,
  HardDrive,
  Zap,
  Flame,
  CircleDot,
  Clock,
  Car,
  ArrowRightLeft,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Sliders,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  CONVERSION_CATEGORIES_DATA,
  ConversionCategoryType,
  ConversionUnit,
} from './conversionCategoryData';

const ICON_MAP: Record<string, React.ElementType> = {
  Ruler,
  Scale,
  Thermometer,
  Droplets,
  Square,
  Gauge,
  HardDrive,
  Zap,
  Flame,
  CircleDot,
  Clock,
  Car,
};

// Pure conversion math helper
export function convertValue(
  value: number,
  fromUnit: ConversionUnit,
  toUnit: ConversionUnit,
  categoryId: string
): number {
  if (isNaN(value)) return 0;
  if (fromUnit.id === toUnit.id) return value;

  // Temperature special affine transformations
  if (categoryId === 'temperature') {
    let kelvin = 0;
    if (fromUnit.id === 'c') {
      kelvin = value + 273.15;
    } else if (fromUnit.id === 'f') {
      kelvin = (value + 459.67) * (5 / 9);
    } else if (fromUnit.id === 'k') {
      kelvin = value;
    } else if (fromUnit.id === 'r') {
      kelvin = value * (5 / 9);
    } else if (fromUnit.id === 'reaumur') {
      kelvin = value * 1.25 + 273.15;
    }

    if (toUnit.id === 'c') {
      return kelvin - 273.15;
    } else if (toUnit.id === 'f') {
      return kelvin * (9 / 5) - 459.67;
    } else if (toUnit.id === 'k') {
      return kelvin;
    } else if (toUnit.id === 'r') {
      return kelvin * (9 / 5);
    } else if (toUnit.id === 'reaumur') {
      return (kelvin - 273.15) * 0.8;
    }
    return kelvin;
  }

  // Non-linear fuel consumption special case
  if (categoryId === 'everyday') {
    if (fromUnit.id === 'mpg_us' && toUnit.id === 'l100km') {
      return value > 0 ? 235.214583 / value : 0;
    }
    if (fromUnit.id === 'l100km' && toUnit.id === 'mpg_us') {
      return value > 0 ? 235.214583 / value : 0;
    }
    if (fromUnit.id === 'mpg_uk' && toUnit.id === 'l100km') {
      return value > 0 ? 282.480936 / value : 0;
    }
    if (fromUnit.id === 'l100km' && toUnit.id === 'mpg_uk') {
      return value > 0 ? 282.480936 / value : 0;
    }
  }

  // Standard linear factor-based transformation
  const baseValue = value * fromUnit.factor;
  return baseValue / toUnit.factor;
}

export default function InteractiveConversionWorkbench() {
  const [activeCategoryId, setActiveCategoryId] = useState<string>('length');
  const [inputValue, setInputValue] = useState<string>('1');
  const [fromUnitId, setFromUnitId] = useState<string>('m');
  const [toUnitId, setToUnitId] = useState<string>('ft');
  const [precision, setPrecision] = useState<number>(4);
  const [isScientific, setIsScientific] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showFormulaDetails, setShowFormulaDetails] = useState<boolean>(true);

  // Active Category configuration
  const activeCategory = useMemo(() => {
    return (
      CONVERSION_CATEGORIES_DATA.find((c) => c.id === activeCategoryId) ||
      CONVERSION_CATEGORIES_DATA[0]
    );
  }, [activeCategoryId]);

  // Handle switching category
  const handleSelectCategory = (cat: ConversionCategoryType) => {
    setActiveCategoryId(cat.id);
    const firstUnit = cat.units[0]?.id || 'm';
    const secondUnit =
      cat.units.find((u) => u.popular && u.id !== firstUnit)?.id ||
      cat.units[1]?.id ||
      firstUnit;
    setFromUnitId(firstUnit);
    setToUnitId(secondUnit);
    setInputValue('1');
  };

  const fromUnit = useMemo(() => {
    return activeCategory.units.find((u) => u.id === fromUnitId) || activeCategory.units[0];
  }, [activeCategory, fromUnitId]);

  const toUnit = useMemo(() => {
    return activeCategory.units.find((u) => u.id === toUnitId) || activeCategory.units[1] || activeCategory.units[0];
  }, [activeCategory, toUnitId]);

  const numericInput = parseFloat(inputValue) || 0;

  // Primary computed target value
  const primaryResult = useMemo(() => {
    return convertValue(numericInput, fromUnit, toUnit, activeCategory.id);
  }, [numericInput, fromUnit, toUnit, activeCategory.id]);

  // Format numbers nicely with precision or scientific notation
  const formatNumber = useCallback((val: number, customPrec?: number): string => {
    if (isNaN(val) || !isFinite(val)) return '0';
    if (isScientific) {
      return val.toExponential(customPrec !== undefined ? customPrec : precision);
    }
    if (Math.abs(val) > 0 && (Math.abs(val) >= 1e10 || Math.abs(val) < 1e-6)) {
      return val.toExponential(customPrec !== undefined ? customPrec : precision);
    }
    const fixed = val.toFixed(customPrec !== undefined ? customPrec : precision);
    const parsed = parseFloat(fixed);
    return parsed.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: customPrec !== undefined ? customPrec : precision,
    });
  }, [isScientific, precision]);

  // Multi-unit broadcast grid
  const broadcastList = useMemo(() => {
    return activeCategory.units.map((unit) => {
      const converted = convertValue(numericInput, fromUnit, unit, activeCategory.id);
      return {
        unit,
        value: converted,
        formatted: formatNumber(converted),
      };
    });
  }, [activeCategory, numericInput, fromUnit, formatNumber]);

  // Swap From / To units
  const handleSwapUnits = () => {
    const prevFrom = fromUnitId;
    const prevTo = toUnitId;
    setFromUnitId(prevTo);
    setToUnitId(prevFrom);
  };

  // Copy to clipboard
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Generate dynamic step formula derivation text
  const formulaProof = useMemo(() => {
    if (activeCategory.id === 'temperature') {
      if (fromUnit.id === 'c' && toUnit.id === 'f') {
        return `(${numericInput} °C × 9/5) + 32 = ${formatNumber(primaryResult, 4)} °F`;
      }
      if (fromUnit.id === 'f' && toUnit.id === 'c') {
        return `(${numericInput} °F - 32) × 5/9 = ${formatNumber(primaryResult, 4)} °C`;
      }
      if (fromUnit.id === 'c' && toUnit.id === 'k') {
        return `${numericInput} °C + 273.15 = ${formatNumber(primaryResult, 4)} K`;
      }
      if (fromUnit.id === 'k' && toUnit.id === 'c') {
        return `${numericInput} K - 273.15 = ${formatNumber(primaryResult, 4)} °C`;
      }
    }
    if (activeCategory.id === 'everyday' && (fromUnit.id === 'mpg_us' || toUnit.id === 'l100km')) {
      return `235.215 / ${numericInput} ${fromUnit.symbol} = ${formatNumber(primaryResult, 4)} ${toUnit.symbol}`;
    }
    const ratio = fromUnit.factor / toUnit.factor;
    return `${numericInput} ${fromUnit.symbol} × (${ratio.toPrecision(6)}) = ${formatNumber(primaryResult, 4)} ${toUnit.symbol}`;
  }, [activeCategory, fromUnit, toUnit, numericInput, primaryResult, formatNumber]);

  const ActiveIcon = ICON_MAP[activeCategory.iconName] || Ruler;

  return (
    <div className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl dark:shadow-2xl overflow-hidden transition-colors">
      {/* 1. Category Switcher Tab Ribbon */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-3 sm:p-4">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30">
              <ActiveIcon className="w-4 h-4" />
            </span>
            <h2 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100">
              Interactive Unit Conversion Workbench
            </h2>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 hidden sm:flex items-center gap-1.5">
            <span>NIST SP 811 & ISO 80000 Calibrated</span>
          </div>
        </div>

        {/* Scrollable Category Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {CONVERSION_CATEGORIES_DATA.map((cat) => {
            const CatIcon = ICON_MAP[cat.iconName] || Ruler;
            const isSelected = cat.id === activeCategoryId;
            return (
              <button
                key={cat.id}
                onClick={() => handleSelectCategory(cat)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 dark:shadow-blue-600/30 font-semibold'
                    : 'bg-white dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/50'
                }`}
              >
                <CatIcon className="w-3.5 h-3.5" />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Main Converter Rail */}
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Preset Quick Buttons */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-medium">Quick Presets:</span>
          {activeCategory.presetExamples.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputValue(preset.fromValue.toString());
                setFromUnitId(preset.fromUnitId);
                setToUnitId(preset.toUnitId);
              }}
              className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700/70 transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Primary Dual-Pane Conversion Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          {/* FROM PANEL */}
          <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-950/70 p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800/90">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="from-val-input" className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                From ({fromUnit.name})
              </label>
              <span className="text-xs font-mono text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800/40">
                {fromUnit.system.toUpperCase()}
              </span>
            </div>

            <div className="space-y-3">
              <input
                id="from-val-input"
                type="number"
                step="any"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter value..."
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3.5 py-2.5 text-xl sm:text-2xl font-mono tabular-nums font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />

              <div className="relative">
                <select
                  value={fromUnitId}
                  onChange={(e) => setFromUnitId(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer pr-9"
                >
                  {activeCategory.units.map((u) => (
                    <option key={u.id} value={u.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                      {u.name} ({u.symbol}) {u.description ? `— ${u.description}` : ''}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* SWAP CONTROLLER */}
          <div className="lg:col-span-2 flex justify-center">
            <button
              onClick={handleSwapUnits}
              title="Invert & Swap Units"
              className="p-3.5 rounded-full bg-white dark:bg-slate-800 hover:bg-blue-600 dark:hover:bg-blue-600 text-slate-700 dark:text-slate-300 hover:text-white border border-slate-300 dark:border-slate-700 hover:border-blue-500 transition-all shadow-md group"
            >
              <ArrowRightLeft className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" />
            </button>
          </div>

          {/* TO PANEL */}
          <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-950/70 p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800/90">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="to-val-display" className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                To ({toUnit.name})
              </label>
              <span className="text-xs font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/40">
                {toUnit.symbol}
              </span>
            </div>

            <div className="space-y-3">
              <div
                id="to-val-display"
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 rounded-lg px-3.5 py-2.5 flex items-center justify-between min-h-[50px] group"
              >
                <span className="text-xl sm:text-2xl font-mono tabular-nums font-bold text-emerald-600 dark:text-emerald-400 truncate mr-2">
                  {formatNumber(primaryResult)}
                </span>
                <button
                  onClick={() => handleCopy(`${formatNumber(primaryResult)} ${toUnit.symbol}`, 'primary')}
                  className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors shrink-0"
                  title="Copy result"
                >
                  {copiedKey === 'primary' ? (
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div className="relative">
                <select
                  value={toUnitId}
                  onChange={(e) => setToUnitId(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer pr-9"
                >
                  {activeCategory.units.map((u) => (
                    <option key={u.id} value={u.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                      {u.name} ({u.symbol}) {u.description ? `— ${u.description}` : ''}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* 3. Precision & Display Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-200 dark:border-slate-800/80 text-xs">
          <div className="flex items-center gap-3">
            <Sliders className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="text-slate-700 dark:text-slate-300 font-medium">Precision Decimals:</span>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="1"
                max="10"
                value={precision}
                onChange={(e) => setPrecision(parseInt(e.target.value))}
                className="w-24 sm:w-32 accent-blue-600 cursor-pointer"
              />
              <span className="font-mono tabular-nums text-slate-900 dark:text-slate-200 w-4 font-semibold">{precision}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
              <input
                type="checkbox"
                checked={isScientific}
                onChange={(e) => setIsScientific(e.target.checked)}
                className="rounded bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
              />
              <span>Scientific Notation (1.23e+4)</span>
            </label>

            <button
              onClick={() => {
                setInputValue('1');
                setPrecision(4);
                setIsScientific(false);
              }}
              className="flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              title="Reset defaults"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* 4. Live Formula Proof Breakdown Box */}
        <div className="bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Exact Mathematical Formula Derivation
              </h3>
            </div>
            <button
              onClick={() => setShowFormulaDetails(!showFormulaDetails)}
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
            >
              <span>{showFormulaDetails ? 'Hide Details' : 'Show Details'}</span>
              {showFormulaDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="mt-2.5 p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 font-mono text-xs sm:text-sm text-blue-700 dark:text-blue-300 overflow-x-auto">
            {formulaProof}
          </div>

          {showFormulaDetails && (
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {activeCategory.formulaDescription} Standard base unit: <strong className="text-slate-800 dark:text-slate-200">{activeCategory.baseUnit} ({activeCategory.baseUnitSymbol})</strong>.
            </p>
          )}
        </div>

        {/* 5. Simultaneous Multi-Unit Broadcast Output Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <span>Simultaneous Multi-Unit Broadcast ({activeCategory.name})</span>
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Live output for {inputValue} {fromUnit.symbol}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
            {broadcastList.map(({ unit, formatted }) => {
              const isCurrentFrom = unit.id === fromUnit.id;
              const isCurrentTo = unit.id === toUnit.id;
              return (
                <div
                  key={unit.id}
                  onClick={() => setToUnitId(unit.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer group ${
                    isCurrentTo
                      ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-400 dark:border-blue-500/60 ring-1 ring-blue-400/30 dark:ring-blue-500/30'
                      : isCurrentFrom
                      ? 'bg-slate-100 dark:bg-slate-950/60 border-slate-300 dark:border-slate-700/80'
                      : 'bg-slate-50/80 dark:bg-slate-950/30 border-slate-200 dark:border-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                      {unit.name}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {unit.symbol}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-1">
                    <span className="text-sm font-mono tabular-nums font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {formatted}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(`${formatted} ${unit.symbol}`, `bc_${unit.id}`);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all shrink-0"
                      title="Copy value"
                    >
                      {copiedKey === `bc_${unit.id}` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
