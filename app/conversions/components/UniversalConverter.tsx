'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  CONVERSION_CATEGORIES,
  convertValue,
  formatResult,
  CategoryDefinition,
  UnitDefinition,
} from '@/lib/conversions';

interface UniversalConverterProps {
  initialCategoryId?: string;
  initialFromId?: string;
  initialToId?: string;
  initialValue?: number | string;
  onRecordRecent?: (record: {
    categoryId: string;
    categoryName: string;
    fromId: string;
    fromName: string;
    fromSymbol: string;
    toId: string;
    toName: string;
    toSymbol: string;
    inputValue: number;
    resultValue: string;
  }) => void;
  onToggleFavorite?: (pair: {
    categoryId: string;
    categoryName: string;
    fromId: string;
    toId: string;
    label: string;
  }) => void;
  isFavorite?: boolean;
}

export default function UniversalConverter({
  initialCategoryId = 'length',
  initialFromId = 'cm',
  initialToId = 'in',
  initialValue = 10,
  onRecordRecent,
  onToggleFavorite,
  isFavorite = false,
}: UniversalConverterProps) {
  // Current active category
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(initialCategoryId);
  const currentCategory = useMemo<CategoryDefinition>(() => {
    return (
      CONVERSION_CATEGORIES.find((c) => c.id === selectedCategoryId) ||
      CONVERSION_CATEGORIES[0]
    );
  }, [selectedCategoryId]);

  // Current From & To units
  const [fromUnitId, setFromUnitId] = useState<string>(initialFromId);
  const [toUnitId, setToUnitId] = useState<string>(initialToId);

  // Synchronize when initial props change
  useEffect(() => {
    if (initialCategoryId && initialCategoryId !== selectedCategoryId) {
      setSelectedCategoryId(initialCategoryId);
    }
  }, [initialCategoryId]);

  useEffect(() => {
    if (initialFromId) setFromUnitId(initialFromId);
    if (initialToId) setToUnitId(initialToId);
  }, [initialFromId, initialToId]);

  // Ensure from and to units exist in the current category
  useEffect(() => {
    const validFrom = currentCategory.units.some((u) => u.id === fromUnitId);
    const validTo = currentCategory.units.some((u) => u.id === toUnitId);

    if (!validFrom) {
      setFromUnitId(currentCategory.popularPair.from || currentCategory.units[0]?.id || 'm');
    }
    if (!validTo) {
      setToUnitId(currentCategory.popularPair.to || currentCategory.units[1]?.id || 'in');
    }
  }, [currentCategory, fromUnitId, toUnitId]);

  // Input value state
  const [inputValue, setInputValue] = useState<string>(String(initialValue));
  const [precision, setPrecision] = useState<'auto' | '2' | '4' | '6' | '8' | 'scientific'>('auto');
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  // Lookup unit definitions
  const fromUnit = useMemo(() => {
    return currentCategory.units.find((u) => u.id === fromUnitId) || currentCategory.units[0];
  }, [currentCategory, fromUnitId]);

  const toUnit = useMemo(() => {
    return currentCategory.units.find((u) => u.id === toUnitId) || currentCategory.units[1] || currentCategory.units[0];
  }, [currentCategory, toUnitId]);

  // Validation
  const numericInput = useMemo(() => {
    if (selectedCategoryId === 'number_systems') return inputValue;
    const parsed = parseFloat(inputValue);
    return isNaN(parsed) ? 0 : parsed;
  }, [inputValue, selectedCategoryId]);

  const validationWarning = useMemo(() => {
    if (selectedCategoryId === 'temperature') {
      const val = typeof numericInput === 'number' ? numericInput : parseFloat(numericInput);
      if (fromUnitId === 'c' && val < -273.15) {
        return 'Value is below Absolute Zero (-273.15 °C). Physical states do not exist below 0 Kelvin.';
      }
      if (fromUnitId === 'f' && val < -459.67) {
        return 'Value is below Absolute Zero (-459.67 °F).';
      }
      if (fromUnitId === 'k' && val < 0) {
        return 'Kelvin cannot be negative (Absolute Zero is 0 K).';
      }
    }
    if (['length', 'area', 'volume', 'weight', 'time', 'speed', 'pressure'].includes(selectedCategoryId)) {
      const val = typeof numericInput === 'number' ? numericInput : parseFloat(numericInput);
      if (val < 0) {
        return 'Note: Physical measurements for this dimension are typically non-negative.';
      }
    }
    return null;
  }, [selectedCategoryId, numericInput, fromUnitId]);

  // Perform calculation
  const conversionResult = useMemo(() => {
    return convertValue(numericInput, selectedCategoryId, fromUnitId, toUnitId);
  }, [selectedCategoryId, fromUnitId, toUnitId, numericInput]);

  const formattedOutput = useMemo(() => {
    if (selectedCategoryId === 'number_systems') {
      return conversionResult.resultString;
    }
    return formatResult(conversionResult.resultNumber, precision);
  }, [selectedCategoryId, conversionResult, precision]);

  // Exactness determination
  const isExactRelationship = useMemo(() => {
    if (selectedCategoryId === 'temperature') return true;
    if (fromUnitId === toUnitId) return true;
    // Known exact definitions
    if (selectedCategoryId === 'length') {
      if ((fromUnitId === 'in' && toUnitId === 'cm') || (fromUnitId === 'cm' && toUnitId === 'in')) return true;
      if ((fromUnitId === 'ft' && toUnitId === 'm') || (fromUnitId === 'm' && toUnitId === 'ft')) return true;
      if ((fromUnitId === 'mi' && toUnitId === 'km') || (fromUnitId === 'km' && toUnitId === 'mi')) return true;
      if (fromUnit?.system === 'metric' && toUnit?.system === 'metric') return true;
    }
    if (selectedCategoryId === 'weight') {
      if ((fromUnitId === 'lb' && toUnitId === 'kg') || (fromUnitId === 'kg' && toUnitId === 'lb')) return true;
      if (fromUnit?.system === 'metric' && toUnit?.system === 'metric') return true;
    }
    if (selectedCategoryId === 'time') return true;
    if (selectedCategoryId === 'data_storage') return true;
    return false;
  }, [selectedCategoryId, fromUnitId, toUnitId, fromUnit, toUnit]);

  // Conversion factor explanation string
  const factorExplanation = useMemo(() => {
    if (fromUnitId === toUnitId) return `1 ${fromUnit.symbol} = 1 ${toUnit.symbol} (Identity)`;
    if (selectedCategoryId === 'temperature') {
      if (fromUnitId === 'c' && toUnitId === 'f') return '°F = (°C × 9/5) + 32';
      if (fromUnitId === 'f' && toUnitId === 'c') return '°C = (°F - 32) × 5/9';
      if (fromUnitId === 'c' && toUnitId === 'k') return 'K = °C + 273.15';
      if (fromUnitId === 'k' && toUnitId === 'c') return '°C = K - 273.15';
      return 'Temperature formula with starting offset';
    }
    if (selectedCategoryId === 'fuel_economy') {
      if (fromUnitId === 'mpg_us' && toUnitId === 'km_l') return '1 US MPG ≈ 0.425144 km/L';
      return 'Fuel efficiency inverse formula';
    }
    if (selectedCategoryId === 'number_systems') {
      return `Number format conversion (${fromUnit.symbol} to ${toUnit.symbol})`;
    }

    const directOne = convertValue(1, selectedCategoryId, fromUnitId, toUnitId);
    const inverseOne = convertValue(1, selectedCategoryId, toUnitId, fromUnitId);

    const directFormatted = formatResult(directOne.resultNumber, '6');
    const inverseFormatted = formatResult(inverseOne.resultNumber, '6');

    return `1 ${fromUnit.symbol} = ${directFormatted} ${toUnit.symbol} (or 1 ${toUnit.symbol} = ${inverseFormatted} ${fromUnit.symbol})`;
  }, [selectedCategoryId, fromUnitId, toUnitId, fromUnit, toUnit]);

  // Dynamic step breakdown
  const calculationStep = useMemo(() => {
    if (selectedCategoryId === 'temperature') {
      const num = typeof numericInput === 'number' ? numericInput : 0;
      if (fromUnitId === 'c' && toUnitId === 'f') {
        return `(${num} × 9/5) + 32 = ${(num * 1.8).toFixed(4)} + 32 = ${formattedOutput} °F`;
      }
      if (fromUnitId === 'f' && toUnitId === 'c') {
        return `(${num} - 32) × 5/9 = ${(num - 32).toFixed(4)} × 5/9 = ${formattedOutput} °C`;
      }
      if (fromUnitId === 'c' && toUnitId === 'k') {
        return `${num} + 273.15 = ${formattedOutput} K`;
      }
      if (fromUnitId === 'k' && toUnitId === 'c') {
        return `${num} - 273.15 = ${formattedOutput} °C`;
      }
    }
    if (selectedCategoryId === 'number_systems') {
      return `Parsed "${inputValue}" as ${fromUnit.name} and converted into ${toUnit.name}`;
    }
    const num = typeof numericInput === 'number' ? numericInput : 0;
    const factor = conversionResult.factor;
    if (factor === 1) return `${num} ${fromUnit.symbol} = ${formattedOutput} ${toUnit.symbol}`;
    return `${num} × ${factor < 0.0001 || factor > 10000 ? factor.toExponential(5) : factor.toFixed(6).replace(/0+$/, '').replace(/\.$/, '')} = ${formattedOutput} ${toUnit.symbol}`;
  }, [selectedCategoryId, numericInput, fromUnitId, toUnitId, formattedOutput, conversionResult, fromUnit, toUnit, inputValue]);

  // Swap function
  const handleSwap = useCallback(() => {
    const currentFrom = fromUnitId;
    const currentTo = toUnitId;
    setFromUnitId(currentTo);
    setToUnitId(currentFrom);

    // If result was numeric, update input value to keep consistency
    if (selectedCategoryId !== 'number_systems' && !isNaN(conversionResult.resultNumber)) {
      setInputValue(String(parseFloat(conversionResult.resultNumber.toFixed(4))));
    }
  }, [fromUnitId, toUnitId, selectedCategoryId, conversionResult]);

  // Record recent conversion
  useEffect(() => {
    if (!onRecordRecent) return;
    const timer = setTimeout(() => {
      const num = typeof numericInput === 'number' ? numericInput : 0;
      if (num !== 0 || inputValue !== '') {
        onRecordRecent({
          categoryId: selectedCategoryId,
          categoryName: currentCategory.name,
          fromId: fromUnitId,
          fromName: fromUnit.name,
          fromSymbol: fromUnit.symbol,
          toId: toUnitId,
          toName: toUnit.name,
          toSymbol: toUnit.symbol,
          inputValue: num,
          resultValue: formattedOutput,
        });
      }
    }, 1200);
    return () => clearTimeout(timer);
  }, [selectedCategoryId, fromUnitId, toUnitId, numericInput, formattedOutput]);

  // Copy result
  const handleCopyResult = async () => {
    const textToCopy = `${inputValue} ${fromUnit.symbol} = ${formattedOutput} ${toUnit.symbol}`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopyFeedback('Result copied to clipboard!');
      setTimeout(() => setCopyFeedback(null), 2500);
    } catch {
      setCopyFeedback('Failed to copy');
      setTimeout(() => setCopyFeedback(null), 2500);
    }
  };

  // Copy formula
  const handleCopyFormula = async () => {
    const formulaText = `${factorExplanation} | Calculation: ${calculationStep}`;
    try {
      await navigator.clipboard.writeText(formulaText);
      setCopyFeedback('Formula & calculation copied!');
      setTimeout(() => setCopyFeedback(null), 2500);
    } catch {
      setCopyFeedback('Failed to copy');
      setTimeout(() => setCopyFeedback(null), 2500);
    }
  };

  // Web Share API
  const handleShare = async () => {
    const shareData = {
      title: `${fromUnit.name} to ${toUnit.name} Conversion | SolveItCalculator`,
      text: `${inputValue} ${fromUnit.symbol} = ${formattedOutput} ${toUnit.symbol}\nFormula: ${factorExplanation}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled or share failed
      }
    } else {
      handleCopyResult();
    }
  };

  return (
    <section className="w-full py-8 px-4 sm:px-6 lg:px-8 bg-surface-container-lowest border-b border-outline-variant/15">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Category Pill Switcher (Horizontal scrollable on mobile) */}
        <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-outline-variant/15">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">tune</span>
            <span className="text-xs uppercase font-bold tracking-wider text-on-surface">
              Select Category
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 max-w-full">
            {CONVERSION_CATEGORIES.map((cat) => {
              const isActive = cat.id === selectedCategoryId;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategoryId(cat.id);
                    setFromUnitId(cat.popularPair.from || cat.units[0]?.id || 'm');
                    setToUnitId(cat.popularPair.to || cat.units[1]?.id || 'in');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-primary text-white shadow-xs'
                      : 'bg-surface border border-outline-variant/25 text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* PRIMARY CONVERTER INTERACTIVE CARD */}
        <div className="p-6 sm:p-8 rounded-2xl bg-surface border border-outline-variant/30 shadow-md space-y-6">
          {/* Header & Controls bar */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">
                  {currentCategory.icon}
                </span>
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-on-surface">
                  {currentCategory.name} Converter
                </h2>
                <div className="text-xs text-on-surface-variant">
                  {currentCategory.units.length} supported units in this category
                </div>
              </div>
            </div>

            {/* Precision & Bookmark controls */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-surface-container-low px-2.5 py-1.5 rounded-lg border border-outline-variant/20">
                <label htmlFor="precision-select" className="text-xs text-on-surface-variant font-medium">
                  Precision:
                </label>
                <select
                  id="precision-select"
                  value={precision}
                  onChange={(e) => setPrecision(e.target.value as any)}
                  className="bg-transparent text-xs font-semibold text-on-surface focus:outline-none cursor-pointer"
                  title="Display precision mode"
                >
                  <option value="auto">Auto (Smart)</option>
                  <option value="2">2 Decimals</option>
                  <option value="4">4 Decimals</option>
                  <option value="6">6 Decimals</option>
                  <option value="8">8 Decimals</option>
                  <option value="scientific">Scientific (exp)</option>
                </select>
              </div>

              {onToggleFavorite && (
                <button
                  type="button"
                  onClick={() =>
                    onToggleFavorite({
                      categoryId: selectedCategoryId,
                      categoryName: currentCategory.name,
                      fromId: fromUnitId,
                      toId: toUnitId,
                      label: `${fromUnit.symbol} → ${toUnit.symbol}`,
                    })
                  }
                  className={`p-2 rounded-lg border transition-colors ${
                    isFavorite
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                      : 'border-outline-variant/25 text-on-surface-variant hover:text-amber-500 hover:bg-surface-container'
                  }`}
                  title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  aria-label="Toggle favorite"
                >
                  <span className="material-symbols-outlined text-xl">
                    {isFavorite ? 'star' : 'star_border'}
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* INPUT VALUE, FROM, SWAP, TO GRID */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* VALUE INPUT (4 cols) */}
            <div className="md:col-span-4 space-y-1.5">
              <label htmlFor="conversion-value" className="text-xs font-bold text-on-surface uppercase tracking-wider block">
                Value
              </label>
              <div className="relative">
                <input
                  id="conversion-value"
                  type={selectedCategoryId === 'number_systems' ? 'text' : 'number'}
                  step="any"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter value"
                  className="w-full pl-4 pr-16 py-3 rounded-xl border border-outline-variant/40 bg-surface-container-lowest text-on-surface text-lg font-bold focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  aria-label="Input value to convert"
                />
                <div className="absolute right-3 top-3 flex items-center gap-1.5">
                  {inputValue && (
                    <button
                      type="button"
                      onClick={() => setInputValue('')}
                      className="text-on-surface-variant hover:text-on-surface text-xs font-semibold p-0.5"
                      title="Clear value"
                    >
                      ✕
                    </button>
                  )}
                  <span className="text-xs font-bold text-on-surface-variant px-1.5 py-0.5 rounded bg-surface-container">
                    {fromUnit.symbol}
                  </span>
                </div>
              </div>
            </div>

            {/* FROM UNIT (3.5 cols) */}
            <div className="md:col-span-3 space-y-1.5">
              <label htmlFor="from-unit-select" className="text-xs font-bold text-on-surface uppercase tracking-wider block">
                From
              </label>
              <select
                id="from-unit-select"
                value={fromUnitId}
                onChange={(e) => setFromUnitId(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl border border-outline-variant/40 bg-surface-container-lowest text-on-surface text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all cursor-pointer"
                aria-label="Source unit"
              >
                {currentCategory.units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.symbol})
                  </option>
                ))}
              </select>
            </div>

            {/* SWAP BUTTON (1 col) */}
            <div className="md:col-span-1 flex justify-center pt-5 sm:pt-6">
              <button
                type="button"
                onClick={handleSwap}
                className="w-11 h-11 rounded-xl bg-primary/10 hover:bg-primary hover:text-white text-primary border border-primary/20 flex items-center justify-center transition-all shadow-xs group cursor-pointer"
                title="Swap source and target units"
                aria-label="Swap units"
              >
                <span className="material-symbols-outlined text-2xl group-hover:rotate-180 transition-transform duration-300">
                  swap_horiz
                </span>
              </button>
            </div>

            {/* TO UNIT (3.5 cols) */}
            <div className="md:col-span-4 space-y-1.5">
              <label htmlFor="to-unit-select" className="text-xs font-bold text-on-surface uppercase tracking-wider block">
                To
              </label>
              <select
                id="to-unit-select"
                value={toUnitId}
                onChange={(e) => setToUnitId(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl border border-outline-variant/40 bg-surface-container-lowest text-on-surface text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all cursor-pointer"
                aria-label="Target unit"
              >
                {currentCategory.units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span className="text-[11px] font-semibold text-on-surface-variant mr-1">Quick values:</span>
            {[1, 5, 10, 25, 50, 100].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setInputValue(String(val))}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  inputValue === String(val)
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                }`}
              >
                {val}
              </button>
            ))}
          </div>

          {/* Validation Warning Alert (if any) */}
          {validationWarning && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-base shrink-0">warning</span>
              <span>{validationWarning}</span>
            </div>
          )}

          {/* LARGE RESULT DISPLAY CARD */}
          <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/20 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="text-xs uppercase font-bold text-on-surface-variant tracking-wider">
                Conversion Result
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                    isExactRelationship
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                  }`}
                >
                  {isExactRelationship ? 'Exact Match' : 'Rounded Value'}
                </span>
              </div>
            </div>

            <div className="flex items-baseline gap-3 flex-wrap">
              <div className="text-sm sm:text-base font-semibold text-on-surface-variant">
                {inputValue} {fromUnit.name} =
              </div>
              <div
                className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-primary tracking-tight"
                aria-live="polite"
              >
                {formattedOutput}
              </div>
              <div className="text-lg sm:text-xl font-bold text-on-surface">
                {toUnit.name} ({toUnit.symbol})
              </div>
            </div>

            {/* Mathematical Factor & Step Details */}
            <div className="pt-3 border-t border-outline-variant/15 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-on-surface-variant font-medium">Conversion Rate: </span>
                <span className="font-semibold text-on-surface">{factorExplanation}</span>
              </div>
              <div>
                <span className="text-on-surface-variant font-medium">Calculation: </span>
                <span className="font-mono text-on-surface bg-surface px-1.5 py-0.5 rounded border border-outline-variant/20">
                  {calculationStep}
                </span>
              </div>
            </div>

            {/* Precision Disclaimer */}
            <p className="text-[11px] text-on-surface-variant/80 italic">
              Tip: Choose your decimal precision above to show more or fewer digits after the decimal point.
            </p>

            {/* Action Buttons: Copy, Share, Copy Formula */}
            <div className="flex items-center gap-2 flex-wrap pt-2">
              <button
                type="button"
                onClick={handleCopyResult}
                className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-all flex items-center gap-1.5 shadow-xs"
              >
                <span className="material-symbols-outlined text-base">content_copy</span>
                <span>Copy Result</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="px-4 py-2 rounded-xl bg-surface border border-outline-variant/30 text-on-surface text-xs font-semibold hover:bg-surface-container transition-all flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">share</span>
                <span>Share</span>
              </button>

              <button
                type="button"
                onClick={handleCopyFormula}
                className="px-4 py-2 rounded-xl bg-surface border border-outline-variant/30 text-on-surface text-xs font-semibold hover:bg-surface-container transition-all flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">functions</span>
                <span>Copy Formula</span>
              </button>

              <button
                type="button"
                onClick={handleSwap}
                className="px-4 py-2 rounded-xl bg-surface border border-outline-variant/30 text-on-surface text-xs font-semibold hover:bg-surface-container transition-all flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">swap_horiz</span>
                <span>Swap Units</span>
              </button>

              {/* Dedicated category page link */}
              <Link
                href={`/${selectedCategoryId.replace(/_/g, '-')}-converter`}
                className="ml-auto text-xs font-semibold text-primary hover:underline flex items-center gap-1 py-1"
              >
                <span>Full {currentCategory.name} Calculator</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>

            {copyFeedback && (
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 animate-pulse">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                <span>{copyFeedback}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
