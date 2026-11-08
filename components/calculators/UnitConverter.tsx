'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  Calculator,
  RotateCcw,
  ArrowLeftRight,
  History,
  Trash2,
  ArrowUpRight,
  BookOpen,
  Scale,
  Table,
  ExternalLink,
  HelpCircle,
} from 'lucide-react';
import SingleCalculatorPageShell, {
  RelatedCalculatorLink,
} from '@/components/calculator-page/SingleCalculatorPageShell';
import {
  CONVERSION_CATEGORIES,
  CONVERSION_CATEGORY_SLUGS,
  ConversionCategorySlug,
  computeCommonValueRows,
  formatConversionNumber,
  resolveConversionCategorySlug,
} from '@/lib/conversionsData';

export type UnitCategory = ConversionCategorySlug;

interface UnitHistoryEntry {
  id: string;
  categoryName: string;
  fromValue: number;
  fromUnit: string;
  toValue: string;
  toUnit: string;
}

export interface UnitConverterProps {
  initialCategory?: ConversionCategorySlug;
  initialFromUnit?: string;
  initialToUnit?: string;
  initialValue?: string;
}

const HISTORY_STORAGE_KEY = 'solveit_unit_converter_history_v1';

const UNIT_RELATED_LINKS: RelatedCalculatorLink[] = [
  {
    name: 'Length & Distance Converter',
    description: 'Convert millimeters to inches, centimeters to inches, feet, and meters.',
    href: '/conversions/length',
    iconVariant: 'arrows-blue',
  },
  {
    name: 'Weight & Mass Converter',
    description: 'Convert kilograms to pounds (kg to lbs), grams, ounces, and stone.',
    href: '/conversions/weight',
    iconVariant: 'scale-teal',
  },
  {
    name: 'Temperature Converter',
    description: 'Convert Celsius to Fahrenheit (°C to °F), Fahrenheit to Celsius, and Kelvin.',
    href: '/conversions/temperature',
    iconVariant: 'percent-coral',
  },
  {
    name: 'Cooking Measurement Converter',
    description: 'Convert cups, tablespoons, teaspoons, and fluid ounces for recipes.',
    href: '/conversions/cooking',
    iconVariant: 'tag-amber',
  },
  {
    name: 'Ingredient Recipe Converter (Cups to Grams)',
    description: 'Scale recipe servings and convert volume to weight by ingredient density.',
    href: '/recipe-converter',
    iconVariant: 'chart-green',
  },
  {
    name: 'Fuel Economy Converter (L/100km to MPG)',
    description: 'Convert L/100km, US MPG, UK MPG, and km/L fuel consumption.',
    href: '/conversions/fuel-economy',
    iconVariant: 'calc-blue',
  },
];

export default function UnitConverter({
  initialCategory = 'length',
  initialFromUnit,
  initialToUnit,
  initialValue,
}: UnitConverterProps) {
  const defaultCfg = CONVERSION_CATEGORIES[initialCategory] || CONVERSION_CATEGORIES.length;

  const [category, setCategory] = useState<ConversionCategorySlug>(defaultCfg.slug);
  const [fromUnit, setFromUnit] = useState<string>(
    initialFromUnit && defaultCfg.units.includes(initialFromUnit)
      ? initialFromUnit
      : defaultCfg.defaultFromUnit
  );
  const [toUnit, setToUnit] = useState<string>(
    initialToUnit && defaultCfg.units.includes(initialToUnit)
      ? initialToUnit
      : defaultCfg.defaultToUnit
  );
  const [rawInput, setRawInput] = useState<string>(
    initialValue ?? defaultCfg.defaultInputValue
  );
  const [history, setHistory] = useState<UnitHistoryEntry[]>([]);
  const [activePairId, setActivePairId] = useState<string | null>(
    defaultCfg.popularPairs[0]?.id ?? null
  );

  const config = CONVERSION_CATEGORIES[category] || CONVERSION_CATEGORIES.length;

  const applyCategory = (newCat: ConversionCategorySlug) => {
    const cfg = CONVERSION_CATEGORIES[newCat];
    setCategory(newCat);
    setFromUnit(cfg.defaultFromUnit);
    setToUnit(cfg.defaultToUnit);
    setRawInput(cfg.defaultInputValue);
    setActivePairId(cfg.popularPairs[0]?.id ?? null);
  };

  // Sync category from ?category= query parameter on legacy /unit-converter route
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const catParam = params.get('category');
    if (catParam) {
      const resolved = resolveConversionCategorySlug(catParam);
      if (resolved && resolved !== initialCategory) {
        applyCategory(resolved);
      }
    }
    try {
      const saved = window.localStorage.getItem(HISTORY_STORAGE_KEY);
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch {
      // Ignore storage errors
    }
  }, [initialCategory]);

  const numericValue = useMemo(() => {
    const parsed = parseFloat(rawInput);
    return Number.isFinite(parsed) ? parsed : 0;
  }, [rawInput]);

  // Check for physical boundary warnings (e.g., below Absolute Zero)
  const validationWarning = useMemo(() => {
    if (category === 'temperature') {
      const celsius = CONVERSION_CATEGORIES.temperature.toBase(numericValue, fromUnit);
      if (celsius < -273.15) {
        return 'Note: Input temperature is below absolute zero (0 K / −273.15 °C / −459.67 °F).';
      }
    }
    return null;
  }, [category, numericValue, fromUnit]);

  const conversion = useMemo(() => {
    const baseVal = config.toBase(numericValue, fromUnit);
    const convertedVal = config.fromBase(baseVal, toUnit);
    const formatted = formatConversionNumber(convertedVal, 6);

    const oneUnitInTarget = config.fromBase(config.toBase(1, fromUnit), toUnit);
    const unitFactor = formatConversionNumber(oneUnitInTarget, 6);

    let equation = `${numericValue} ${fromUnit} × ${unitFactor} = ${formatted} ${toUnit}`;
    let secondaryNote = `1 ${fromUnit} = ${unitFactor} ${toUnit} (conversion factors follow NIST SP 811)`;

    if (category === 'length' && fromUnit === 'Millimeters' && toUnit === 'Inches') {
      equation = `${numericValue} mm ÷ 25.4 = ${formatted} in`;
      secondaryNote = 'Exact factor: 1 inch = 25.4 mm (NIST SP 811)';
    } else if (category === 'length' && fromUnit === 'Centimeters' && toUnit === 'Inches') {
      equation = `${numericValue} cm ÷ 2.54 = ${formatted} in`;
      secondaryNote = 'Exact factor: 1 inch = 2.54 cm (NIST SP 811)';
    } else if (category === 'weight' && fromUnit === 'Kilograms' && toUnit === 'Pounds') {
      equation = `${numericValue} kg ÷ 0.45359237 = ${formatted} lbs`;
      secondaryNote = 'Exact factor: 1 lb = 0.45359237 kg (≈ 2.20462 lbs/kg, NIST SP 811)';
    } else if (category === 'weight' && fromUnit === 'Pounds' && toUnit === 'Kilograms') {
      equation = `${numericValue} lbs × 0.45359237 = ${formatted} kg`;
      secondaryNote = 'Exact factor: 1 lb = 0.45359237 kg (NIST SP 811)';
    } else if (category === 'temperature') {
      if (fromUnit === 'Celsius' && toUnit === 'Fahrenheit') {
        equation = `(${numericValue} °C × 1.8) + 32 = ${formatted} °F`;
        secondaryNote = 'Formula: °F = (°C × 1.8) + 32 (NIST SP 811)';
      } else if (fromUnit === 'Fahrenheit' && toUnit === 'Celsius') {
        equation = `(${numericValue} °F − 32) ÷ 1.8 = ${formatted} °C`;
        secondaryNote = 'Formula: °C = (°F − 32) ÷ 1.8 (NIST SP 811)';
      } else if (fromUnit === 'Celsius' && toUnit === 'Kelvin') {
        equation = `${numericValue} °C + 273.15 = ${formatted} K`;
        secondaryNote = 'Formula: K = °C + 273.15 (NIST SP 811)';
      } else if (fromUnit === 'Kelvin' && toUnit === 'Celsius') {
        equation = `${numericValue} K − 273.15 = ${formatted} °C`;
        secondaryNote = 'Formula: °C = K − 273.15 (NIST SP 811)';
      }
    } else if (category === 'fuel-economy') {
      if (
        fromUnit === 'Liters per 100 km (L/100km)' &&
        toUnit === 'US Miles per Gallon (MPG US)'
      ) {
        equation = `235.214583 ÷ ${numericValue} L/100km = ${formatted} MPG (US)`;
        secondaryNote = 'Reciprocal formula: US MPG = 235.214583 ÷ (L/100km)';
      }
    }

    const allUnitsTable = config.units.map((u) => ({
      unit: u,
      value: formatConversionNumber(config.fromBase(baseVal, u), 6),
    }));

    return {
      formatted,
      raw: convertedVal,
      unitFactor,
      equation,
      secondaryNote,
      allUnitsTable,
    };
  }, [config, category, numericValue, fromUnit, toUnit]);

  const computedCommonRows = useMemo(() => computeCommonValueRows(config), [config]);

  const handleSwapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setActivePairId(null);
  };

  const handleLoadConversion = (
    targetFrom: string,
    targetTo: string,
    targetVal: number,
    pairId?: string
  ) => {
    setFromUnit(targetFrom);
    setToUnit(targetTo);
    setRawInput(String(targetVal));
    if (pairId) {
      setActivePairId(pairId);
    }
    if (typeof window !== 'undefined') {
      const el = document.getElementById('workbench');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleSaveToHistory = () => {
    const newEntry: UnitHistoryEntry = {
      id: `${Date.now()}`,
      categoryName: config.shortLabel,
      fromValue: numericValue,
      fromUnit,
      toValue: conversion.formatted,
      toUnit,
    };
    const next = [newEntry, ...history].slice(0, 6);
    setHistory(next);
    try {
      window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore storage errors
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      window.localStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  };

  const handleReset = () => {
    setFromUnit(config.defaultFromUnit);
    setToUnit(config.defaultToUnit);
    setRawInput(config.defaultInputValue);
    setActivePairId(config.popularPairs[0]?.id ?? null);
  };

  const calculatorCard = (
    <div className="flex flex-col gap-5">
      {/* STEP 2.5: 1-Line Answer Near the Top of the Page for the Top Question-Type Keyword */}
      <div
        role="region"
        aria-label="Quick answer for top conversion question"
        className="bg-white rounded-2xl border border-[#CBD5E1] px-5 py-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div className="space-y-0.5">
          <div className="text-xs font-bold text-[#2457D6] flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>{config.topQuestionBanner.question}</span>
          </div>
          <p className="text-sm font-semibold text-[#152238] leading-snug">
            {config.topQuestionBanner.oneLineAnswer}
          </p>
        </div>
        <a
          href="#common-values-table"
          className="text-xs font-bold text-[#2457D6] hover:underline whitespace-nowrap shrink-0"
        >
          View Common Values Table ↓
        </a>
      </div>

      {/* Main Converter Input Workbench */}
      <section
        id="calculator"
        aria-label={`${config.categoryLabel} Converter input panel`}
        className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-7 shadow-2xs space-y-6"
      >
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#EBF2FF] text-[#2457D6] flex items-center justify-center shrink-0 mt-0.5">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-[#152238]">
                  Convert {config.categoryLabel}
                </h2>
                <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
                  Enter a number, pick your starting and target units, or select a popular pair below.
                </p>
              </div>
            </div>
          </div>

          {/* Canonical Category Links */}
          <nav
            aria-label="Canonical unit conversion categories"
            className="flex flex-wrap gap-1.5"
          >
            {CONVERSION_CATEGORY_SLUGS.map((catSlug) => {
              const catCfg = CONVERSION_CATEGORIES[catSlug];
              const active = category === catSlug;
              return (
                <Link
                  key={catSlug}
                  href={catCfg.canonicalPath}
                  onClick={() => applyCategory(catSlug)}
                  aria-current={active ? 'page' : undefined}
                  className={`px-3 py-1.5 rounded-lg text-xs font-extrabold border transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-[#2457D6] text-white border-[#2457D6]'
                      : 'bg-[#F1F5F9] text-[#152238] border-[#CBD5E1] hover:border-[#2457D6]'
                  }`}
                >
                  {catCfg.shortLabel}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
          <div className="sm:col-span-4">
            <label
              htmlFor="uc-val"
              className="block text-sm font-extrabold text-[#152238] mb-2"
            >
              Value to Convert <span className="text-[#E11D48]">*</span>
            </label>
            <div className="flex items-stretch rounded-xl border border-[#CBD5E1] bg-white overflow-hidden focus-within:border-[#2457D6] focus-within:ring-3 focus-within:ring-[#2457D6]/15">
              <input
                id="uc-val"
                type="number"
                step="any"
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
                className="w-full px-4 py-3 bg-white text-base font-bold text-[#152238] tabular-nums focus:outline-none"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="uc-from"
              className="block text-sm font-extrabold text-[#152238] mb-2"
            >
              From Unit
            </label>
            <select
              id="uc-from"
              value={fromUnit}
              onChange={(e) => {
                setFromUnit(e.target.value);
                setActivePairId(null);
              }}
              className="w-full px-3.5 py-3 rounded-xl border border-[#CBD5E1] bg-white text-sm font-bold text-[#152238] focus:border-[#2457D6] focus:outline-none cursor-pointer"
            >
              {config.units.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2 flex justify-center">
            <button
              type="button"
              onClick={handleSwapUnits}
              aria-label="Swap From and To units"
              title="Swap From and To units"
              className="w-full sm:w-auto px-3.5 py-3 rounded-xl bg-[#F1F5F9] hover:bg-[#E2E8F0] border border-[#CBD5E1] text-[#152238] font-bold text-xs inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <ArrowLeftRight className="w-4 h-4 text-[#2457D6]" />
              <span className="sm:sr-only">Swap Units</span>
            </button>
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="uc-to"
              className="block text-sm font-extrabold text-[#152238] mb-2"
            >
              To Unit
            </label>
            <select
              id="uc-to"
              value={toUnit}
              onChange={(e) => {
                setToUnit(e.target.value);
                setActivePairId(null);
              }}
              className="w-full px-3.5 py-3 rounded-xl border border-[#CBD5E1] bg-white text-sm font-bold text-[#152238] focus:border-[#2457D6] focus:outline-none cursor-pointer"
            >
              {config.units.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
        </div>

        {validationWarning && (
          <div
            role="alert"
            className="rounded-xl bg-[#FFF6E5] border border-[#F59E0B]/40 px-4 py-3 text-xs sm:text-sm font-semibold text-[#B45309]"
          >
            {validationWarning}
          </div>
        )}

        {config.routingNotice && (
          <div className="rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] px-4 py-3 text-xs sm:text-sm text-[#475569] flex flex-wrap items-center justify-between gap-2">
            <span>{config.routingNotice.text}</span>
            <Link
              href={config.routingNotice.linkHref}
              className="font-bold text-[#2457D6] hover:underline whitespace-nowrap shrink-0"
            >
              {config.routingNotice.linkLabel} →
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 pt-1">
          <button
            type="button"
            onClick={handleSaveToHistory}
            className="sm:col-span-8 inline-flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl bg-[#2457D6] hover:bg-[#1D46B0] text-white text-base font-extrabold shadow-xs transition-colors cursor-pointer whitespace-nowrap"
          >
            <Calculator className="w-5 h-5" />
            <span>Convert &amp; Save to History</span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="sm:col-span-4 inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-[#F1F5F9] hover:bg-[#E2E8F0] border border-[#CBD5E1] text-[#152238] text-base font-extrabold transition-colors cursor-pointer whitespace-nowrap"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>

        {/* Quick Jump to Popular Pairs & Reference Table */}
        <div className="pt-3 border-t border-[#F1F5F9] flex flex-wrap items-center justify-between gap-2 text-xs text-[#64748B]">
          <span>Instant live conversion as you type or switch units.</span>
          <div className="flex items-center gap-3 font-bold text-[#2457D6]">
            <a href="#popular-conversions" className="hover:underline">
              Popular Unit Pairs ↓
            </a>
            <a href="#common-values-table" className="hover:underline">
              Lookup Table ↓
            </a>
          </div>
        </div>
      </section>
    </div>
  );

  const isInputEmpty =
    rawInput.trim() === '' || !Number.isFinite(Number(rawInput));

  const leftColumnSupplement = (
    <section
      aria-label={`Quick ${config.categoryLabel} conversion presets`}
      className="hidden lg:flex bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-2xs flex-1 flex-col gap-3"
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="text-xs font-extrabold uppercase tracking-wider text-[#2457D6]">
            Instant 1-Click {config.shortLabel} Pair Presets
          </div>
          <a
            href="#popular-conversions"
            className="text-xs font-bold text-[#2457D6] hover:underline"
          >
            All Pairs ↓
          </a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {config.popularPairs.slice(0, 6).map((pair) => {
            const isSelected = activePairId === pair.id;
            return (
              <button
                key={pair.id}
                type="button"
                onClick={() => handleSelectPair(pair)}
                className={`rounded-xl px-3 py-2 border text-left transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#EBF2FF] border-[#2457D6] text-[#2457D6]'
                    : 'bg-[#F8FAFC] hover:bg-[#EEF4FF] border-[#E2E8F0] text-[#152238]'
                }`}
              >
                <div className="text-xs font-extrabold truncate">{pair.title}</div>
                <div className="text-[11px] text-[#64748B] font-mono truncate tabular-nums">
                  {pair.factorSummary}
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <div className="mt-auto pt-2.5 border-t border-[#F1F5F9] flex items-center justify-between text-xs text-[#64748B]">
        <span>Select any pair to load its exact NIST SP 811 factor.</span>
        <a href="#common-values-table" className="font-bold text-[#2457D6] hover:underline">
          Reference Table ↓
        </a>
      </div>
    </section>
  );

  const rightColumnSupplement = (
    <div className="flex-1 flex flex-col space-y-4">
      {/* All Equivalent Units Reference Card (Balances Right Column Under Green Result Card) */}
      <section
        aria-label={`All ${config.categoryLabel} equivalents`}
        className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-2xs min-h-[210px] flex-1 flex flex-col gap-3.5"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-extrabold text-[#152238]">
            {isInputEmpty
              ? `All ${config.categoryLabel} Equivalents (${fromUnit})`
              : `All ${config.categoryLabel} Equivalents for ${numericValue.toLocaleString()} ${fromUnit}`}
          </h3>
          <span className="text-xs text-[#64748B]">
            Conversion factors follow{' '}
            <a
              href="https://www.nist.gov/pml/special-publication-811"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#2457D6] hover:underline inline-flex items-center gap-0.5"
            >
              NIST SP 811
              <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </a>
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {conversion.allUnitsTable.map((row) => {
            const isTarget = row.unit === toUnit;
            return (
              <div
                key={row.unit}
                className={`rounded-xl px-3.5 py-2.5 border text-xs flex items-center justify-between gap-2 ${
                  isTarget
                    ? 'bg-[#EBF2FF] border-[#2457D6]'
                    : 'bg-[#F8FAFC] border-[#E2E8F0]'
                }`}
              >
                <span className="font-semibold text-[#475569] truncate">
                  {row.unit}
                </span>
                <span className="font-mono font-extrabold text-[#152238] tabular-nums">
                  {isInputEmpty ? '—' : row.value}
                </span>
              </div>
            );
          })}
        </div>

        {/* Optional Local Browser Calculation History */}
        {history.length > 0 && (
          <div className="pt-3.5 border-t border-[#E2E8F0]">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2 text-xs font-extrabold text-[#152238]">
                <History className="w-4 h-4 text-[#2457D6]" />
                <span>Recent Conversions (Stored in this browser)</span>
              </div>
              <button
                type="button"
                onClick={handleClearHistory}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#64748B] hover:text-[#E11D48] cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-2 text-xs flex items-center justify-between gap-2"
                >
                  <span className="font-semibold text-[#475569]">
                    {item.fromValue} {item.fromUnit}
                  </span>
                  <span className="font-mono font-bold text-[#2457D6] tabular-nums">
                    = {item.toValue} {item.toUnit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );

  const belowWorkbenchContent = (
    <div className="space-y-6">
      {/* Dynamic Category-Specific Ordering of Popular Pairs, Common Values Table, Unit Guide & Comparison Box */}
      {(() => {
        const popularPairsSection = (
          <section
            key="popular-conversions"
            id="popular-conversions"
            aria-labelledby="popular-conversions-heading"
            className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-7 shadow-2xs space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2
                  id="popular-conversions-heading"
                  className="text-lg font-extrabold text-[#152238]"
                >
                  Most-Used {config.categoryLabel} Unit Pairs
                </h2>
                <p className="text-xs sm:text-sm text-[#475569] mt-0.5">
                  Click any pair preset below to load its exact NIST SP 811 factor and sample calculation into the converter.
                </p>
              </div>
              <span className="text-xs text-[#64748B]">
                Instant pair loader
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {config.popularPairs.map((pair) => {
                const isSelected =
                  activePairId === pair.id ||
                  (fromUnit === pair.fromUnit && toUnit === pair.toUnit);
                const sampleBase = config.toBase(pair.sampleInput, pair.fromUnit);
                const sampleOut = formatConversionNumber(
                  config.fromBase(sampleBase, pair.toUnit),
                  4
                );

                if (pair.pairHref) {
                  return (
                    <Link
                      key={pair.id}
                      id={pair.anchorId}
                      href={pair.pairHref}
                      className="group rounded-xl border border-[#E2E8F0] hover:border-[#2457D6] bg-[#F8FAFC] hover:bg-white p-4 transition-colors flex flex-col justify-between gap-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-sm font-extrabold text-[#152238] group-hover:text-[#2457D6]">
                            {pair.label}
                          </h3>
                          <p className="text-xs text-[#64748B] mt-0.5">
                            {pair.abbrLabel} · {pair.factorSummary}
                          </p>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-[#2457D6] shrink-0" />
                      </div>
                      <div className="text-xs font-mono font-bold text-[#16856B] tabular-nums pt-1 border-t border-[#E2E8F0]/80">
                        Example: {pair.sampleInput} → {sampleOut}
                      </div>
                    </Link>
                  );
                }

                return (
                  <a
                    key={pair.id}
                    id={pair.anchorId}
                    href={`#${pair.anchorId}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLoadConversion(
                        pair.fromUnit,
                        pair.toUnit,
                        pair.sampleInput,
                        pair.id
                      );
                    }}
                    className={`group rounded-xl border p-4 transition-colors flex flex-col justify-between gap-2 cursor-pointer ${
                      isSelected
                        ? 'border-[#2457D6] bg-[#EBF2FF]/60'
                        : 'border-[#E2E8F0] hover:border-[#2457D6] bg-[#F8FAFC] hover:bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-extrabold text-[#152238] group-hover:text-[#2457D6]">
                          {pair.label}
                        </h3>
                        <p className="text-xs text-[#64748B] mt-0.5">
                          {pair.abbrLabel} · {pair.factorSummary}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-[#2457D6] whitespace-nowrap shrink-0">
                        {isSelected ? 'Active' : 'Load ⇄'}
                      </span>
                    </div>
                    <div className="text-xs font-mono font-bold text-[#16856B] tabular-nums pt-1 border-t border-[#E2E8F0]/80">
                      {pair.sampleInput} {pair.fromUnit} = {sampleOut} {pair.toUnit}
                    </div>
                  </a>
                );
              })}
            </div>
          </section>
        );

        const commonValuesSection = (
          <section
            key="common-values-table"
            id="common-values-table"
            aria-labelledby="common-values-heading"
            className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-7 shadow-2xs space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] flex items-center justify-center shrink-0">
                  <Table className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h2
                    id="common-values-heading"
                    className="text-lg font-extrabold text-[#152238]"
                  >
                    Worked {config.categoryLabel} Lookup Table ({config.defaultFromUnit} ↔ {config.defaultToUnit})
                  </h2>
                  <p className="text-xs sm:text-sm text-[#475569]">
                    Every figure is calculated live from the converter&apos;s exact factors. Click Load to test any row in the workbench.
                  </p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#E2E8F0]">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#152238] font-extrabold">
                    <th scope="col" className="py-3 px-4">
                      Conversion Query
                    </th>
                    <th scope="col" className="py-3 px-4">
                      Input Value
                    </th>
                    <th scope="col" className="py-3 px-4">
                      Converted Output
                    </th>
                    <th scope="col" className="py-3 px-4">
                      Formula Working
                    </th>
                    <th scope="col" className="py-3 px-4 text-right">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {computedCommonRows.map((row, idx) => {
                    const isRowActive =
                      numericValue === row.inputValue &&
                      fromUnit === row.fromUnit &&
                      toUnit === row.toUnit;
                    return (
                      <tr
                        key={idx}
                        className={
                          isRowActive ? 'bg-[#ECFDF5]/70 font-bold' : 'hover:bg-[#F8FAFC]'
                        }
                      >
                        <td className="py-3 px-4 font-bold text-[#152238]">
                          {row.keywordLabel}
                        </td>
                        <td className="py-3 px-4 font-mono text-[#475569] tabular-nums">
                          {row.inputValue} {row.fromAbbr}
                        </td>
                        <td className="py-3 px-4 font-mono font-extrabold text-[#2457D6] tabular-nums">
                          {row.computedOutput} {row.toAbbr}
                        </td>
                        <td className="py-3 px-4 font-mono text-xs text-[#475569] tabular-nums">
                          {row.workingFormula} = {row.computedOutput} {row.toAbbr}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              handleLoadConversion(
                                row.fromUnit,
                                row.toUnit,
                                row.inputValue
                              )
                            }
                            className="px-3 py-1 rounded-lg bg-[#EBF2FF] hover:bg-[#2457D6] text-[#2457D6] hover:text-white font-bold text-xs transition-colors cursor-pointer whitespace-nowrap"
                          >
                            Load
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        );

        const unitGuideSection = (
          <section
            key="unit-guide"
            id="unit-guide"
            aria-labelledby="unit-guide-heading"
            className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-7 shadow-2xs space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#EBF2FF] text-[#2457D6] flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <h2
                  id="unit-guide-heading"
                  className="text-lg font-extrabold text-[#152238]"
                >
                  {config.categoryLabel} Units, Symbols &amp; Where Each Is Used
                </h2>
                <p className="text-xs sm:text-sm text-[#475569]">
                  Official unit symbols, measurement systems, base-unit definitions, and real-world applications.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#E2E8F0]">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#152238] font-extrabold">
                    <th scope="col" className="py-3 px-4">
                      Unit
                    </th>
                    <th scope="col" className="py-3 px-4">
                      Symbol
                    </th>
                    <th scope="col" className="py-3 px-4">
                      System
                    </th>
                    <th scope="col" className="py-3 px-4">
                      Base Equivalent
                    </th>
                    <th scope="col" className="py-3 px-4">
                      Common Uses
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {config.unitGuide.map((item) => (
                    <tr key={item.unit} className="hover:bg-[#F8FAFC]">
                      <td className="py-3 px-4 font-bold text-[#152238] whitespace-nowrap">
                        {item.unit}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-[#2457D6] whitespace-nowrap">
                        {item.symbol}
                      </td>
                      <td className="py-3 px-4 text-[#475569] whitespace-nowrap">
                        {item.system}
                      </td>
                      <td className="py-3 px-4 font-mono text-xs text-[#152238] tabular-nums whitespace-nowrap">
                        {item.baseEquivalent}
                      </td>
                      <td className="py-3 px-4 text-[#475569] leading-relaxed">
                        {item.commonUse}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );

        const comparisonSection = config.comparisonBox ? (
          <section
            key="unit-comparison"
            id="unit-comparison"
            aria-labelledby="unit-comparison-heading"
            className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-7 shadow-2xs space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FFF4E5] text-[#D97706] flex items-center justify-center shrink-0">
                <Scale className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <h2
                  id="unit-comparison-heading"
                  className="text-lg font-extrabold text-[#152238]"
                >
                  {config.comparisonBox.title}
                </h2>
                <p className="text-xs sm:text-sm text-[#475569]">
                  Side-by-side breakdown of commonly confused measurement units.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-4 space-y-1.5">
                <h3 className="text-sm font-extrabold text-[#152238]">
                  {config.comparisonBox.unitALabel}
                </h3>
                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                  {config.comparisonBox.unitADetail}
                </p>
              </div>
              <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-4 space-y-1.5">
                <h3 className="text-sm font-extrabold text-[#152238]">
                  {config.comparisonBox.unitBLabel}
                </h3>
                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                  {config.comparisonBox.unitBDetail}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs sm:text-sm text-[#152238]">
              <p className="font-medium text-[#475569]">
                <strong className="font-bold text-[#152238]">Key difference: </strong>
                {config.comparisonBox.takeaway}
              </p>
              {config.comparisonBox.routingLink && (
                <Link
                  href={config.comparisonBox.routingLink.href}
                  className="font-bold text-[#2457D6] hover:underline whitespace-nowrap shrink-0"
                >
                  {config.comparisonBox.routingLink.label} →
                </Link>
              )}
            </div>
          </section>
        ) : null;

        // Vary the sub-section sequence across categories so pages don't share an identical DOM skeleton
        if (category === 'weight' || category === 'cooking' || category === 'energy') {
          return [commonValuesSection, popularPairsSection, comparisonSection, unitGuideSection];
        }
        if (category === 'temperature' || category === 'area' || category === 'digital') {
          return [popularPairsSection, comparisonSection, commonValuesSection, unitGuideSection];
        }
        if (category === 'volume' || category === 'speed' || category === 'fuel-economy') {
          return [commonValuesSection, unitGuideSection, popularPairsSection, comparisonSection];
        }
        return [popularPairsSection, commonValuesSection, unitGuideSection, comparisonSection];
      })()}
    </div>
  );

  return (
    <SingleCalculatorPageShell
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Unit Conversions', href: '/conversions' },
        { label: `${config.categoryLabel} Converter` },
      ]}
      title={config.h1}
      titleHighlight={config.h1Highlight}
      subtitle={config.subtitle}
      heroSymbol="⇄"
      heroBadgeBg="bg-[#EBF2FF]"
      heroBadgeColor="text-[#2457D6]"
      categoryName="Unit Conversion"
      categoryHref="/conversions"
      otherCalculatorsTitle="Other Canonical Unit Converters"
      otherCalculators={UNIT_RELATED_LINKS.filter(
        (item) => item.href !== config.canonicalPath
      )}
      relatedCalculators={UNIT_RELATED_LINKS.filter(
        (item) => item.href !== config.canonicalPath
      ).slice(0, 4)}
      calculatorCard={calculatorCard}
      leftColumnSupplement={leftColumnSupplement}
      rightColumnSupplement={rightColumnSupplement}
      belowWorkbenchContent={belowWorkbenchContent}
      resultCard={{
        promptSummary: `${numericValue.toLocaleString()} ${fromUnit} in ${toUnit}`,
        promptSuffix: 'is:',
        mainValue: `${conversion.formatted} ${toUnit}`,
        equation: conversion.equation,
        secondaryNote: conversion.secondaryNote,
        isEmpty: isInputEmpty,
        placeholderMessage: `Enter a ${config.shortLabel.toLowerCase()} value on the left to convert ${fromUnit} to ${toUnit}:`,
      }}
      formulaCard={config.formulaCard}
      howToUseSteps={[
        `Enter the ${config.shortLabel.toLowerCase()} value you want to convert in the input box.`,
        'Select your From Unit and To Unit, or click any Popular Conversion card to load a pair.',
        'Click Load in the Common Conversions Table to test benchmark numbers immediately.',
        'Review the worked equation and the all-units table (conversion factors follow NIST SP 811).',
      ]}
      howItWorks={config.howItWorks}
      understandingResult={{
        paragraph: (
          <>
            Converting{' '}
            <strong className="font-bold text-[#152238]">
              {numericValue.toLocaleString()} {fromUnit}
            </strong>{' '}
            gives{' '}
            <strong className="font-bold text-[#152238]">
              {conversion.formatted} {toUnit}
            </strong>
            . All conversion factors on this page follow{' '}
            <a
              href="https://www.nist.gov/pml/special-publication-811"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#2457D6] hover:underline"
            >
              NIST Special Publication 811 (NIST SP 811)
            </a>
            .
          </>
        ),
      }}
      faqs={config.faqs}
    />
  );
}
