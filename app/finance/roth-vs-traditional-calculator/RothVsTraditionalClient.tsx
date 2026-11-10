'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Scale,
  TrendingUp,
  Percent,
  Calendar,
  ArrowUpRight,
  Download,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Landmark,
  DollarSign,
  Layers,
  ShieldCheck,
  Equal,
  Split,
  FileCheck2,
  Info,
} from 'lucide-react';
import {
  calculateRothVsTraditional,
  VERIFIED_IRS_RETIREMENT_LIMITS,
  VERIFIED_IRS_RMD_TABLE,
  type RothVsTraditionalResult,
  type ContributionFrequencyMode,
} from '@/lib/finance-core/roth-vs-traditional';
import { WORLD_CURRENCIES } from '../financeData';
import {
  useCurrency,
  formatWithGlobalCurrency,
  formatCompactWithGlobalCurrency,
  type GlobalCurrencyCode,
} from '@/lib/currency';

function PrecisionSlider({
  min,
  max,
  step,
  value,
  onChange,
  minLabel,
  midLabel,
  maxLabel,
  color = 'primary',
}: {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (val: number) => void;
  minLabel?: string;
  midLabel?: string;
  maxLabel?: string;
  color?: 'primary' | 'secondary' | 'tertiary';
}) {
  const clamped = Math.min(Math.max(value, min), max);
  const pct = Math.max(0, Math.min(100, ((clamped - min) / (max - min)) * 100));
  const activeColorClass =
    color === 'secondary'
      ? 'bg-teal-600'
      : color === 'tertiary'
      ? 'bg-amber-500'
      : 'bg-primary';
  const borderThumbClass =
    color === 'secondary'
      ? 'border-teal-600 ring-teal-500/25'
      : color === 'tertiary'
      ? 'border-amber-500 ring-amber-500/25'
      : 'border-primary ring-primary/25';

  return (
    <div className="space-y-1 w-full pt-1 pb-1">
      <div className="relative w-full h-8 flex items-center px-3 touch-none select-none">
        <div className="w-full h-2 bg-surface-container-highest rounded-full relative overflow-hidden">
          <div
            className={`h-full ${activeColorClass} rounded-full transition-[width] duration-75`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div
          className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 sm:w-5.5 sm:h-5.5 bg-white dark:bg-slate-900 border-[2.5px] ${borderThumbClass} ring-4 rounded-full shadow-lg flex items-center justify-center pointer-events-none transition-transform active:scale-125`}
          style={{ left: `calc(12px + (100% - 24px) * ${pct / 100})` }}
        >
          <div className={`w-2 h-2 sm:w-1.5 sm:h-1.5 rounded-full ${activeColorClass}`} />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={clamped}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 m-0 p-0"
        />
      </div>
      {(minLabel || midLabel || maxLabel) && (
        <div className="flex justify-between text-[10px] font-semibold text-on-surface-variant/70 select-none font-mono tabular-nums">
          <span>{minLabel}</span>
          <span>{midLabel}</span>
          <span>{maxLabel}</span>
        </div>
      )}
    </div>
  );
}

export default function RothVsTraditionalClient() {
  // Core Inputs requested in prompt:
  // pre-tax contribution amount, current marginal rate, expected retirement rate, years, return
  const [preTaxContribution, setPreTaxContribution] = useState<number>(10000);
  const [currentMarginalRate, setCurrentMarginalRate] = useState<number>(24);
  const [expectedRetirementRate, setExpectedRetirementRate] = useState<number>(15);
  const [years, setYears] = useState<number>(25);
  const [annualReturn, setAnnualReturn] = useState<number>(7.0);

  // Mode: Single contribution C(1+r)^n (default) vs Annual recurring contribution
  const [contributionMode, setContributionMode] = useState<ContributionFrequencyMode>('single');

  // Global Currency support
  const { currency: selectedCurrency, setCurrency: setGlobalCurrency } =
    useCurrency();

  // UI state
  const [activeTab, setActiveTab] = useState<'factors' | 'sensitivity' | 'schedule' | 'cap_nuance'>('factors');
  const [showFullSchedule, setShowFullSchedule] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [selectedTaxYear, setSelectedTaxYear] = useState<'2025' | '2024'>('2025');

  const currencyObj = useMemo(() => {
    return WORLD_CURRENCIES.find((c) => c.code === selectedCurrency) || WORLD_CURRENCIES[0];
  }, [selectedCurrency]);

  const handleCurrencyChange = (newCode: string) => {
    setGlobalCurrency(newCode as GlobalCurrencyCode);
  };

  const formatMoney = (val: number, decimals = 0) => {
    if (!isFinite(val)) return 'N/A';
    return formatWithGlobalCurrency(val, {
      fromCurrency: 'USD',
      decimals,
    });
  };

  const formatCompact = (val: number) => {
    if (!isFinite(val)) return 'N/A';
    return formatCompactWithGlobalCurrency(val, {
      fromCurrency: 'USD',
    });
  };

  const result: RothVsTraditionalResult = useMemo(() => {
    return calculateRothVsTraditional({
      preTaxContribution,
      currentMarginalRatePercent: currentMarginalRate,
      expectedRetirementRatePercent: expectedRetirementRate,
      years,
      annualReturnPercent: annualReturn,
      contributionMode,
    });
  }, [preTaxContribution, currentMarginalRate, expectedRetirementRate, years, annualReturn, contributionMode]);

  // Also calculate nominal cap comparison (if user contributes full C to Roth by paying tax from outside funds)
  const outsideTaxComparison = useMemo(() => {
    const fullRothEndValue = result.traditionalPreTaxEndValue; // C * (1+r)^n tax-free
    const extraOutOfPocketNow = result.immediateTaxPaidOrSaved; // C * t_now
    return {
      fullRothEndValue,
      extraOutOfPocketNow,
    };
  }, [result]);

  const handleReset = () => {
    setPreTaxContribution(10000);
    setCurrentMarginalRate(24);
    setExpectedRetirementRate(15);
    setYears(25);
    setAnnualReturn(7.0);
    setContributionMode('single');
  };

  const handleCopySummary = () => {
    const summary = `Roth vs. Traditional Calculator Summary (Equal After-Tax Outlay)
• Pre-Tax Contribution (C): ${formatMoney(preTaxContribution)} (${contributionMode === 'single' ? 'Single Contribution' : 'Annual Contribution'})
• Equal After-Tax Outlay Today: ${formatMoney(result.equalAfterTaxOutlayPerPeriod)} (after ${currentMarginalRate}% current tax)
• Current Marginal Tax Rate (t_now): ${currentMarginalRate}% -> Retention Factor (1 - t_now) = ${result.oneMinusCurrentRatePercent.toFixed(1)}%
• Expected Retirement Tax Rate (t_ret): ${expectedRetirementRate}% -> Retention Factor (1 - t_ret) = ${result.oneMinusRetirementRatePercent.toFixed(1)}%
• Horizon & Return: ${years} Years at ${annualReturn}% annual return
--------------------------------------------------
• Traditional Pre-Tax End Balance: ${formatMoney(result.traditionalPreTaxEndValue, 2)}
• Traditional After-Tax End Value: ${formatMoney(result.traditionalAfterTaxEndValue, 2)} (after ${formatMoney(result.traditionalTaxesOwedAtRetirement, 2)} retirement tax)
• Roth After-Tax End Value: ${formatMoney(result.rothAfterTaxEndValue, 2)} (100% tax-free withdrawal)
• Net After-Tax Difference: ${formatMoney(result.differenceAbsolute, 2)} (${
      result.higherOutcome === 'equal'
        ? 'Exact Parity'
        : result.higherOutcome === 'traditional'
        ? 'Higher under Traditional'
        : 'Higher under Roth'
    })
• Break-Even Retirement Tax Rate: ${result.breakEvenRetirementRatePercent.toFixed(1)}%
Generated via SolveIt Calculator (https://solveitcalculator.com/finance/roth-vs-traditional-calculator)`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadCsv = () => {
    const headers = [
      'Year',
      'Cumulative Pre-Tax Outlay',
      'Equal After-Tax Outlay',
      'Traditional Pre-Tax Balance',
      'Traditional Embedded Tax Liability',
      'Traditional After-Tax Value',
      'Roth After-Tax Value',
      'After-Tax Difference (Roth - Traditional)',
    ];

    const rows = result.timeline.map((r) => [
      r.year,
      r.cumulativePreTaxOutlay.toFixed(2),
      r.cumulativeAfterTaxOutlay.toFixed(2),
      r.traditionalPreTaxBalance.toFixed(2),
      r.traditionalEmbeddedTaxLiability.toFixed(2),
      r.traditionalAfterTaxValue.toFixed(2),
      r.rothAfterTaxBalance.toFixed(2),
      r.afterTaxDifference.toFixed(2),
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `roth_vs_traditional_${years}yr_comparison.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const limitsForYear = VERIFIED_IRS_RETIREMENT_LIMITS[selectedTaxYear];

  return (
    <div className="space-y-8">
      {/* Top Bar: Contribution Basis Switcher & Currency */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-surface-container border border-outline-variant/60 shadow-xs">
        <div className="inline-flex p-1 rounded-xl bg-surface-container-high border border-outline-variant/40 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setContributionMode('single')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer ${
              contributionMode === 'single'
                ? 'bg-surface text-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Scale className="w-4 h-4 text-primary" />
            <span>Single Contribution: C(1+r)ⁿ</span>
          </button>
          <button
            type="button"
            onClick={() => setContributionMode('annual')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer ${
              contributionMode === 'annual'
                ? 'bg-surface text-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-primary" />
            <span>Annual Contributions (Annuity)</span>
          </button>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end flex-wrap">
          <span className="text-xs text-on-surface-variant">
            Equal After-Tax Outlay: <strong className="font-mono text-on-surface">{formatMoney(result.equalAfterTaxOutlayPerPeriod)}</strong>
          </span>
          <div className="flex items-center gap-1.5">
            <label htmlFor="roth-currency-select" className="text-xs font-medium text-on-surface-variant">
              Currency:
            </label>
            <select
              id="roth-currency-select"
              value={selectedCurrency}
              onChange={(e) => handleCurrencyChange(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-surface border border-outline-variant text-xs font-semibold text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary/20"
            >
              {WORLD_CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.symbol} {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main 2-Column Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: 5 Core Inputs */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-surface-container border border-outline-variant/60 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/40">
              <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
                <Scale className="w-5 h-5 text-primary" />
                <span>Tax &amp; Compounding Inputs</span>
              </h2>
              <span className="text-xs text-on-surface-variant font-mono">
                Equal Outlay Model
              </span>
            </div>

            {/* 1. Pre-Tax Contribution Amount (C) */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label htmlFor="pretax-contrib-input" className="text-sm font-semibold text-on-surface">
                  Pre-Tax Contribution Amount (C)
                </label>
                <span className="text-base font-extrabold text-primary font-mono tabular-nums">
                  {formatMoney(preTaxContribution)}
                </span>
              </div>

              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-on-surface-variant font-mono">
                  {currencyObj.symbol}
                </span>
                <input
                  id="pretax-contrib-input"
                  type="number"
                  min={100}
                  max={1000000}
                  step={500}
                  value={preTaxContribution}
                  onChange={(e) => setPreTaxContribution(Math.max(0, Number(e.target.value)))}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-surface border border-outline-variant text-sm font-semibold text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary/20 font-mono tabular-nums"
                />
              </div>

              <PrecisionSlider
                min={500}
                max={70000}
                step={500}
                value={preTaxContribution}
                onChange={setPreTaxContribution}
                minLabel={formatCompact(500)}
                midLabel={formatCompact(23500)}
                maxLabel={formatCompact(70000)}
              />

              {/* IRS Statutory Limit Quick Presets */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  { label: '$7,000 (IRA Limit)', val: 7000 },
                  { label: '$8,000 (IRA 50+)', val: 8000 },
                  { label: '$10,000', val: 10000 },
                  { label: '$23,500 (401k Limit)', val: 23500 },
                  { label: '$31,000 (401k 50+)', val: 31000 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setPreTaxContribution(preset.val)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all whitespace-nowrap cursor-pointer font-mono tabular-nums ${
                      preTaxContribution === preset.val
                        ? 'bg-primary text-on-primary border-primary'
                        : 'bg-surface border-outline-variant/60 text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                With a <strong>{currentMarginalRate}%</strong> current tax rate, allocating{' '}
                <strong className="font-mono">{formatMoney(preTaxContribution)}</strong> pre-tax to Traditional equals{' '}
                <strong className="font-mono">{formatMoney(result.equalAfterTaxOutlayPerPeriod)}</strong> after-tax contributed to Roth.
              </p>
            </div>

            {/* 2. Current Marginal Tax Rate (t_now) */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label htmlFor="current-tax-input" className="text-sm font-semibold text-on-surface">
                  Current Marginal Tax Rate (t_now)
                </label>
                <span className="text-base font-extrabold text-primary font-mono tabular-nums">
                  {currentMarginalRate.toFixed(1)}%
                </span>
              </div>

              <div className="relative">
                <input
                  id="current-tax-input"
                  type="number"
                  min={0}
                  max={60}
                  step={0.5}
                  value={currentMarginalRate}
                  onChange={(e) => setCurrentMarginalRate(Math.max(0, Math.min(90, Number(e.target.value))))}
                  className="w-full pl-4 pr-9 py-2.5 rounded-xl bg-surface border border-outline-variant text-sm font-semibold text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary/20 font-mono tabular-nums"
                />
                <Percent className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              </div>

              <PrecisionSlider
                min={0}
                max={50}
                step={0.5}
                value={currentMarginalRate}
                onChange={setCurrentMarginalRate}
                minLabel="0%"
                midLabel="24%"
                maxLabel="50%"
              />

              {/* US Federal Marginal Brackets */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[10, 12, 22, 24, 32, 35, 37].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => setCurrentMarginalRate(rate)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer font-mono tabular-nums ${
                      Math.abs(currentMarginalRate - rate) < 0.05
                        ? 'bg-primary text-on-primary border-primary'
                        : 'bg-surface border-outline-variant/60 text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    {rate}%
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Expected Retirement Tax Rate (t_ret) */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label htmlFor="retirement-tax-input" className="text-sm font-semibold text-on-surface">
                  Expected Retirement Tax Rate (t_ret)
                </label>
                <span className="text-base font-extrabold text-teal-600 dark:text-teal-400 font-mono tabular-nums">
                  {expectedRetirementRate.toFixed(1)}%
                </span>
              </div>

              <div className="relative">
                <input
                  id="retirement-tax-input"
                  type="number"
                  min={0}
                  max={60}
                  step={0.5}
                  value={expectedRetirementRate}
                  onChange={(e) => setExpectedRetirementRate(Math.max(0, Math.min(90, Number(e.target.value))))}
                  className="w-full pl-4 pr-9 py-2.5 rounded-xl bg-surface border border-outline-variant text-sm font-semibold text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary/20 font-mono tabular-nums"
                />
                <Percent className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              </div>

              <PrecisionSlider
                min={0}
                max={50}
                step={0.5}
                value={expectedRetirementRate}
                onChange={setExpectedRetirementRate}
                minLabel="0%"
                midLabel="22%"
                maxLabel="50%"
                color="secondary"
              />

              {/* Quick Retirement Rate Buttons + Break-Even Sync */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[10, 12, 15, 22, 24, 32].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => setExpectedRetirementRate(rate)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer font-mono tabular-nums ${
                      Math.abs(expectedRetirementRate - rate) < 0.05
                        ? 'bg-teal-600 text-white border-teal-600'
                        : 'bg-surface border-outline-variant/60 text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    {rate}%
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setExpectedRetirementRate(currentMarginalRate)}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold border border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 transition-all cursor-pointer whitespace-nowrap"
                  title="Set retirement rate equal to current marginal rate to verify break-even parity"
                >
                  Set Break-Even ({currentMarginalRate}%)
                </button>
              </div>
            </div>

            {/* 4 & 5. Years to Retirement (n) & Expected Annual Return (r) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-outline-variant/40">
              {/* Years (n) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="years-input" className="text-xs font-semibold text-on-surface">
                    Years to Grow (n)
                  </label>
                  <span className="text-sm font-bold text-primary font-mono tabular-nums">
                    {years} Yrs
                  </span>
                </div>
                <input
                  id="years-input"
                  type="number"
                  min={1}
                  max={60}
                  step={1}
                  value={years}
                  onChange={(e) => setYears(Math.max(1, Math.min(70, Math.round(Number(e.target.value)))))}
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant text-sm font-semibold text-on-surface font-mono tabular-nums"
                />
                <PrecisionSlider
                  min={1}
                  max={50}
                  step={1}
                  value={years}
                  onChange={setYears}
                  minLabel="1y"
                  midLabel="25y"
                  maxLabel="50y"
                />
                <div className="flex flex-wrap gap-1">
                  {[10, 20, 25, 30, 40].map((yr) => (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => setYears(yr)}
                      className={`flex-1 py-1 rounded-md text-[11px] font-semibold border cursor-pointer font-mono tabular-nums ${
                        years === yr
                          ? 'bg-primary text-on-primary border-primary'
                          : 'bg-surface border-outline-variant/50 text-on-surface-variant'
                      }`}
                    >
                      {yr}y
                    </button>
                  ))}
                </div>
              </div>

              {/* Annual Return (r) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="return-input" className="text-xs font-semibold text-on-surface">
                    Annual Return (r)
                  </label>
                  <span className="text-sm font-bold text-primary font-mono tabular-nums">
                    {annualReturn.toFixed(1)}%
                  </span>
                </div>
                <input
                  id="return-input"
                  type="number"
                  min={0}
                  max={25}
                  step={0.5}
                  value={annualReturn}
                  onChange={(e) => setAnnualReturn(Math.max(0, Math.min(30, Number(e.target.value))))}
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant text-sm font-semibold text-on-surface font-mono tabular-nums"
                />
                <PrecisionSlider
                  min={1}
                  max={14}
                  step={0.5}
                  value={annualReturn}
                  onChange={setAnnualReturn}
                  minLabel="1%"
                  midLabel="7%"
                  maxLabel="14%"
                />
                <div className="flex flex-wrap gap-1">
                  {[5, 6, 7, 8, 10].map((ret) => (
                    <button
                      key={ret}
                      type="button"
                      onClick={() => setAnnualReturn(ret)}
                      className={`flex-1 py-1 rounded-md text-[11px] font-semibold border cursor-pointer font-mono tabular-nums ${
                        Math.abs(annualReturn - ret) < 0.05
                          ? 'bg-primary text-on-primary border-primary'
                          : 'bg-surface border-outline-variant/50 text-on-surface-variant'
                      }`}
                    >
                      {ret}%
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Primary Outputs, Side-by-Side Comparison & Mathematical Proof */}
        <div className="lg:col-span-7 space-y-6">
          {/* Primary Comparison Banner */}
          <div className="p-6 rounded-3xl bg-surface-container border border-outline-variant/60 shadow-xs space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-outline-variant/40">
              <div className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant">
                <span>Equal After-Tax Outlay Comparison</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-on-surface">
                  {years} Years @ {annualReturn}%
                </span>
              </div>
              <div className="text-xs font-semibold text-primary font-mono tabular-nums">
                Break-Even Retirement Rate: {result.breakEvenRetirementRatePercent.toFixed(1)}%
              </div>
            </div>

            {/* Side-by-Side End Value Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Traditional End Value Card */}
              <div
                className={`p-5 rounded-2xl border transition-all space-y-3 ${
                  result.higherOutcome === 'traditional'
                    ? 'bg-primary/5 border-primary/50'
                    : 'bg-surface border-outline-variant/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-on-surface">Traditional (Pre-Tax)</span>
                  <span className="text-[11px] text-on-surface-variant font-mono tabular-nums">
                    1 − t_ret = {result.oneMinusRetirementRatePercent.toFixed(1)}%
                  </span>
                </div>

                <div>
                  <span className="text-[11px] text-on-surface-variant block">
                    After-Tax End Value
                  </span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-on-surface font-mono tabular-nums tracking-tight">
                    {formatMoney(result.traditionalAfterTaxEndValue, 0)}
                  </div>
                </div>

                <div className="pt-2 border-t border-outline-variant/40 space-y-1 text-xs font-mono tabular-nums">
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Pre-Tax Balance:</span>
                    <span className="font-semibold text-on-surface">
                      {formatMoney(result.traditionalPreTaxEndValue, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Retirement Tax ({expectedRetirementRate}%):</span>
                    <span className="text-red-500 dark:text-red-400">
                      −{formatMoney(result.traditionalTaxesOwedAtRetirement, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Net Outlay Today:</span>
                    <span>{formatMoney(result.totalEqualAfterTaxOutlay, 0)}</span>
                  </div>
                </div>
              </div>

              {/* Roth End Value Card */}
              <div
                className={`p-5 rounded-2xl border transition-all space-y-3 ${
                  result.higherOutcome === 'roth'
                    ? 'bg-teal-500/5 border-teal-500/50'
                    : 'bg-surface border-outline-variant/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-on-surface">Roth (After-Tax)</span>
                  <span className="text-[11px] text-on-surface-variant font-mono tabular-nums">
                    1 − t_now = {result.oneMinusCurrentRatePercent.toFixed(1)}%
                  </span>
                </div>

                <div>
                  <span className="text-[11px] text-on-surface-variant block">
                    After-Tax End Value
                  </span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-teal-600 dark:text-teal-400 font-mono tabular-nums tracking-tight">
                    {formatMoney(result.rothAfterTaxEndValue, 0)}
                  </div>
                </div>

                <div className="pt-2 border-t border-outline-variant/40 space-y-1 text-xs font-mono tabular-nums">
                  <div className="flex justify-between text-on-surface-variant">
                    <span>After-Tax Principal:</span>
                    <span className="font-semibold text-on-surface">
                      {formatMoney(result.rothPrincipalContributed, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Tax-Free Growth:</span>
                    <span className="text-teal-600 dark:text-teal-400">
                      +{formatMoney(result.rothTaxFreeGrowth, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Retirement Tax (0%):</span>
                    <span>{formatMoney(0, 0)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Difference & Break-Even Summary Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-4 rounded-2xl bg-surface border border-outline-variant/60 space-y-1">
                <span className="text-[11px] font-semibold text-on-surface-variant block">
                  After-Tax Difference
                </span>
                <div className="text-lg font-extrabold text-on-surface font-mono tabular-nums">
                  {formatMoney(result.differenceAbsolute, 0)}
                </div>
                <span className="text-[11px] text-on-surface-variant block">
                  {result.higherOutcome === 'equal'
                    ? 'Identical end values ($0 delta)'
                    : result.higherOutcome === 'traditional'
                    ? `Higher under Traditional (+${result.percentageAdvantage.toFixed(1)}%)`
                    : `Higher under Roth (+${result.percentageAdvantage.toFixed(1)}%)`}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-surface border border-outline-variant/60 space-y-1">
                <span className="text-[11px] font-semibold text-on-surface-variant block">
                  Break-Even Retirement Rate
                </span>
                <div className="text-lg font-extrabold text-primary font-mono tabular-nums">
                  {result.breakEvenRetirementRatePercent.toFixed(1)}%
                </div>
                <span className="text-[11px] text-on-surface-variant block">
                  Equals current rate (t_ret = t_now)
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-surface border border-outline-variant/60 space-y-1">
                <span className="text-[11px] font-semibold text-on-surface-variant block">
                  Retention Ratio Comparison
                </span>
                <div className="text-lg font-extrabold text-on-surface font-mono tabular-nums">
                  {result.oneMinusRetirementRatePercent.toFixed(1)}% vs {result.oneMinusCurrentRatePercent.toFixed(1)}%
                </div>
                <span className="text-[11px] text-on-surface-variant block">
                  (1 − t_ret) vs (1 − t_now)
                </span>
              </div>
            </div>

            <p className="text-xs text-on-surface-variant leading-relaxed">
              {result.neutralSummaryText}
            </p>
          </div>

          {/* Commutative Equivalence Formula Verification Card */}
          <div className="p-6 rounded-3xl bg-surface-container border border-outline-variant/60 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
                <Equal className="w-4 h-4 text-primary" />
                <span>Mathematical Equivalence Proof (Equal After-Tax Outlay)</span>
              </h3>
              <span className="text-xs text-on-surface-variant font-mono tabular-nums">
                (1 + r)ⁿ = {result.singleContributionMultiplier.toFixed(3)}×
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono tabular-nums">
              <div className="p-3.5 rounded-2xl bg-surface border border-outline-variant/50 space-y-1.5">
                <div className="text-on-surface-variant font-sans font-semibold">
                  Traditional After-Tax Formula:
                </div>
                <div className="text-on-surface font-bold">
                  C(1 + r)ⁿ × (1 − t_ret)
                </div>
                <div className="text-on-surface-variant text-[11px]">
                  {contributionMode === 'single'
                    ? `${formatMoney(preTaxContribution)} × (1 + ${(annualReturn / 100).toFixed(3)})^${years} × (1 − ${(expectedRetirementRate / 100).toFixed(3)})`
                    : `${formatMoney(preTaxContribution)} × ${result.compoundGrowthFactor.toFixed(2)} × (1 − ${(expectedRetirementRate / 100).toFixed(3)})`}
                </div>
                <div className="text-primary font-bold pt-1 border-t border-outline-variant/30">
                  = {formatMoney(result.traditionalAfterTaxEndValue, 2)}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-surface border border-outline-variant/50 space-y-1.5">
                <div className="text-on-surface-variant font-sans font-semibold">
                  Roth After-Tax Formula:
                </div>
                <div className="text-on-surface font-bold">
                  C(1 − t_now)(1 + r)ⁿ
                </div>
                <div className="text-on-surface-variant text-[11px]">
                  {contributionMode === 'single'
                    ? `${formatMoney(preTaxContribution)} × (1 − ${(currentMarginalRate / 100).toFixed(3)}) × (1 + ${(annualReturn / 100).toFixed(3)})^${years}`
                    : `${formatMoney(preTaxContribution)} × (1 − ${(currentMarginalRate / 100).toFixed(3)}) × ${result.compoundGrowthFactor.toFixed(2)}`}
                </div>
                <div className="text-teal-600 dark:text-teal-400 font-bold pt-1 border-t border-outline-variant/30">
                  = {formatMoney(result.rothAfterTaxEndValue, 2)}
                </div>
              </div>
            </div>

            <p className="text-xs text-on-surface-variant leading-relaxed">
              Because multiplication is commutative, <span className="font-mono text-on-surface">C(1 + r)ⁿ</span> appears identically in both equations. Dividing both sides by <span className="font-mono text-on-surface">C(1 + r)ⁿ</span> reduces the comparison to{' '}
              <strong className="font-mono text-on-surface">(1 − t_ret) = {result.oneMinusRetirementRatePercent.toFixed(1)}%</strong> versus{' '}
              <strong className="font-mono text-on-surface">(1 − t_now) = {result.oneMinusCurrentRatePercent.toFixed(1)}%</strong>. The break-even retirement tax rate is therefore always equal to the current marginal tax rate (<strong className="font-mono text-on-surface">{result.breakEvenRetirementRatePercent.toFixed(1)}%</strong>).
            </p>
          </div>

          {/* Visual Bar Comparison across Horizon */}
          <div className="p-6 rounded-3xl bg-surface-container border border-outline-variant/60 space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-on-surface">
              <span>After-Tax Value Comparison at Year {years}</span>
              <span className="text-on-surface-variant font-mono tabular-nums">
                Outlay Today: {formatMoney(result.totalEqualAfterTaxOutlay)}
              </span>
            </div>

            <div className="space-y-3">
              {/* Traditional Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-on-surface">
                    Traditional After-Tax (after {expectedRetirementRate}% tax)
                  </span>
                  <span className="font-mono font-bold tabular-nums text-on-surface">
                    {formatMoney(result.traditionalAfterTaxEndValue, 0)}
                  </span>
                </div>
                <div className="h-4 rounded-full bg-surface-container-highest overflow-hidden flex">
                  <div
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(
                          8,
                          (result.traditionalAfterTaxEndValue /
                            Math.max(1, result.traditionalPreTaxEndValue)) *
                            100
                        )
                      )}%`,
                    }}
                    className="bg-primary h-full transition-all duration-200"
                    title="Traditional After-Tax Value"
                  />
                  <div
                    style={{
                      width: `${Math.min(
                        100,
                        (result.traditionalTaxesOwedAtRetirement /
                          Math.max(1, result.traditionalPreTaxEndValue)) *
                          100
                      )}%`,
                    }}
                    className="bg-red-500/40 h-full transition-all duration-200"
                    title="Deferred Tax Owed at Retirement"
                  />
                </div>
              </div>

              {/* Roth Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-on-surface">
                    Roth After-Tax (after {currentMarginalRate}% upfront tax, 0% at retirement)
                  </span>
                  <span className="font-mono font-bold tabular-nums text-teal-600 dark:text-teal-400">
                    {formatMoney(result.rothAfterTaxEndValue, 0)}
                  </span>
                </div>
                <div className="h-4 rounded-full bg-surface-container-highest overflow-hidden flex">
                  <div
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(
                          8,
                          (result.rothAfterTaxEndValue /
                            Math.max(1, result.traditionalPreTaxEndValue)) *
                            100
                        )
                      )}%`,
                    }}
                    className="bg-teal-600 h-full transition-all duration-200"
                    title="Roth Tax-Free End Value"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-[11px] text-on-surface-variant pt-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-primary shrink-0" />
                <span>Traditional Spendable</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-red-500/40 shrink-0" />
                <span>Traditional Deferred Tax ({formatMoney(result.traditionalTaxesOwedAtRetirement, 0)})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-teal-600 shrink-0" />
                <span>Roth Tax-Free Spendable</span>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-surface-container border border-outline-variant/60">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopySummary}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface border border-outline-variant text-xs font-semibold text-on-surface hover:text-primary transition-colors cursor-pointer whitespace-nowrap"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copied ? 'Summary Copied' : 'Copy Summary'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadCsv}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface border border-outline-variant text-xs font-semibold text-on-surface hover:text-primary transition-colors cursor-pointer whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          BOTTOM FULL-WIDTH VALUE-ADDED TABS
          (Non-Math Factors: RMDs, Verified Income Limits, Tax Diversification,
           Break-Even Sensitivity Matrix, Schedule, and Cap Limit Nuance)
      ========================================================================= */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-surface-container border border-outline-variant/60 overflow-x-auto no-scrollbar">
          {[
            { id: 'factors', label: 'Non-Math Factors (RMDs, Income Limits & Diversification)', icon: Landmark },
            { id: 'sensitivity', label: 'Break-Even & Rate Sensitivity', icon: Scale },
            { id: 'schedule', label: 'Year-by-Year Schedule', icon: Calendar },
            { id: 'cap_nuance', label: 'Equal Outlay vs. Statutory Cap', icon: Layers },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: Non-Math Factors (RMDs, Verified Income Limits, Tax Diversification) */}
        {activeTab === 'factors' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Three Core Non-Math Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Pillar 1: Required Minimum Distributions (RMDs) */}
              <div className="p-6 rounded-3xl bg-surface-container border border-outline-variant/60 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
                    <Landmark className="w-4 h-4 text-primary" />
                    <span>1. Required Minimum Distributions (RMDs)</span>
                  </h3>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  <strong>Traditional IRAs and 401(k)s</strong> require mandatory annual withdrawals starting at <strong>age 73</strong> (increasing to <strong>age 75 in 2033</strong> under SECURE 2.0), even if the account owner does not need the cash flow. These distributions are taxed as ordinary income and can increase taxable Social Security benefits or Medicare Part B/D IRMAA surcharges.
                </p>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  <strong>Roth IRAs and Designated Roth 401(k)s</strong> have <strong>no lifetime RMDs</strong> for the original owner (SECURE 2.0 removed pre-death RMDs for Roth employer plans starting in 2024), allowing balances to compound undisturbed for late-life expenses or estate planning.
                </p>
                <div className="p-3 rounded-xl bg-surface border border-outline-variant/50 text-xs font-mono tabular-nums space-y-1">
                  <div className="text-[11px] font-sans font-semibold text-on-surface-variant">
                    Age 73 RMD Illustration (IRS Table III Divisor {result.rmdAge73Divisor}):
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Traditional 1st-Yr RMD:</span>
                    <span className="font-bold text-on-surface">{formatMoney(result.traditionalFirstYearRmdAt73, 0)}/yr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Roth Owner Lifetime RMD:</span>
                    <span className="font-bold text-teal-600 dark:text-teal-400">{formatMoney(0, 0)}/yr</span>
                  </div>
                </div>
              </div>

              {/* Pillar 2: Income & Contribution Limits [VERIFIED] */}
              <div className="p-6 rounded-3xl bg-surface-container border border-outline-variant/60 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-primary" />
                    <span>2. Income &amp; Eligibility Limits</span>
                  </h3>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  <strong>Direct Roth IRA contributions</strong> are subject to Modified Adjusted Gross Income (MAGI) phase-outs (<strong>$150,000–$165,000 Single</strong> and <strong>$236,000–$246,000 Married Filing Jointly</strong> in 2025). High earners exceeding these limits cannot contribute directly to a Roth IRA without using a non-deductible Traditional IRA conversion (&ldquo;Backdoor Roth&rdquo;), which is subject to the IRS Pro-Rata aggregation rule.
                </p>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  <strong>Traditional IRA tax deductions</strong> also phase out if you or your spouse participate in a workplace retirement plan (<strong>$79,000–$89,000 Single</strong>; <strong>$126,000–$146,000 MFJ</strong> in 2025). By contrast, <strong>Roth 401(k) and Traditional 401(k)</strong> plans have <strong>no statutory income limits</strong> on employee elective deferrals.
                </p>
              </div>

              {/* Pillar 3: Tax Diversification & Flexibility */}
              <div className="p-6 rounded-3xl bg-surface-container border border-outline-variant/60 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
                    <Split className="w-4 h-4 text-primary" />
                    <span>3. Tax Diversification &amp; Access</span>
                  </h3>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Future tax laws, personal spending needs, and filing status (such as transitioning from Married Filing Jointly to Single filer status in widowhood) are uncertain over multi-decade horizons. Holding both Traditional and Roth balances allows retirees to manage their taxable income bracket each year.
                </p>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  In retirement, savers often draw from <strong>Traditional accounts</strong> to fill the standard deduction ($0% tax) and lower progressive brackets (10%–12%), then draw from <strong>Roth accounts</strong> for additional spending without pushing income into higher brackets. Additionally, direct Roth IRA contributions (principal only) can be withdrawn at any time without tax or penalty.
                </p>
              </div>
            </div>

            {/* Verified IRS Statutory Limits Table (2025 & 2024) */}
            <div className="p-6 rounded-3xl bg-surface-container border border-outline-variant/60 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-outline-variant/40">
                <div>
                  <h3 className="text-base font-bold text-on-surface">
                    Verified IRS Contribution &amp; MAGI Phase-Out Limits ({selectedTaxYear})
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    Source: {limitsForYear.verifiedBy} · Verified {limitsForYear.dateVerified} · US Internal Revenue Code §§ 401(k), 402(g), 408A
                  </p>
                </div>

                <div className="inline-flex p-1 rounded-xl bg-surface border border-outline-variant/60">
                  {(['2025', '2024'] as const).map((yr) => (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => setSelectedTaxYear(yr)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors font-mono tabular-nums ${
                        selectedTaxYear === yr
                          ? 'bg-primary text-on-primary'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      Tax Year {yr}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-outline-variant/40">
                <table className="w-full text-xs text-left">
                  <thead className="bg-surface-container-high text-on-surface-variant font-semibold">
                    <tr>
                      <th className="py-3 px-4">Statutory Rule / Provision</th>
                      <th className="py-3 px-4">Traditional Account</th>
                      <th className="py-3 px-4">Roth Account</th>
                      <th className="py-3 px-4 text-right">Statutory Threshold ({selectedTaxYear})</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/30 text-on-surface">
                    <tr className="hover:bg-surface-container-high/40">
                      <td className="py-3 px-4 font-semibold">IRA Annual Contribution Limit (Under Age 50)</td>
                      <td className="py-3 px-4 text-on-surface-variant">Combined cap across Traditional + Roth IRAs</td>
                      <td className="py-3 px-4 text-on-surface-variant">Combined cap across Traditional + Roth IRAs</td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums font-bold">
                        ${limitsForYear.ira.annualContributionLimit.toLocaleString('en-US')}
                      </td>
                    </tr>
                    <tr className="hover:bg-surface-container-high/40">
                      <td className="py-3 px-4 font-semibold">IRA Age 50+ Catch-Up Contribution</td>
                      <td className="py-3 px-4 text-on-surface-variant">Additional $1,000 ($8,000 total)</td>
                      <td className="py-3 px-4 text-on-surface-variant">Additional $1,000 ($8,000 total)</td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums font-bold">
                        +${limitsForYear.ira.catchUpAge50Plus.toLocaleString('en-US')} ($8,000 total)
                      </td>
                    </tr>
                    <tr className="hover:bg-surface-container-high/40">
                      <td className="py-3 px-4 font-semibold">Roth IRA MAGI Phase-Out (Single / Head of Household)</td>
                      <td className="py-3 px-4 text-on-surface-variant">No income cap on non-deductible contributions</td>
                      <td className="py-3 px-4 text-on-surface-variant">Direct contribution phases out to $0</td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums font-bold">
                        ${limitsForYear.ira.rothIraPhaseOutSingle.start.toLocaleString('en-US')} – ${limitsForYear.ira.rothIraPhaseOutSingle.end.toLocaleString('en-US')}
                      </td>
                    </tr>
                    <tr className="hover:bg-surface-container-high/40">
                      <td className="py-3 px-4 font-semibold">Roth IRA MAGI Phase-Out (Married Filing Jointly)</td>
                      <td className="py-3 px-4 text-on-surface-variant">No income cap on non-deductible contributions</td>
                      <td className="py-3 px-4 text-on-surface-variant">Direct contribution phases out to $0</td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums font-bold">
                        ${limitsForYear.ira.rothIraPhaseOutMFJ.start.toLocaleString('en-US')} – ${limitsForYear.ira.rothIraPhaseOutMFJ.end.toLocaleString('en-US')}
                      </td>
                    </tr>
                    <tr className="hover:bg-surface-container-high/40">
                      <td className="py-3 px-4 font-semibold">Traditional IRA Deduction Phase-Out (Workplace Plan Covered)</td>
                      <td className="py-3 px-4 text-on-surface-variant">Upfront tax deduction phases out by MAGI</td>
                      <td className="py-3 px-4 text-on-surface-variant">N/A (Roth contributions are never deductible)</td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums font-bold">
                        {selectedTaxYear === '2025' ? '$79,000 – $89,000 (Single) · $126,000 – $146,000 (MFJ)' : '$77,000 – $87,000 (Single) · $123,000 – $143,000 (MFJ)'}
                      </td>
                    </tr>
                    <tr className="hover:bg-surface-container-high/40">
                      <td className="py-3 px-4 font-semibold">401(k) / 403(b) / 457(b) Elective Deferral Limit</td>
                      <td className="py-3 px-4 text-on-surface-variant">No income limit on pre-tax deferrals</td>
                      <td className="py-3 px-4 text-on-surface-variant">No income limit on Designated Roth 401(k)</td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums font-bold">
                        ${limitsForYear.plan401k_403b_457.electiveDeferralLimit.toLocaleString('en-US')}
                      </td>
                    </tr>
                    <tr className="hover:bg-surface-container-high/40">
                      <td className="py-3 px-4 font-semibold">401(k) Age 50+ / Age 60–63 SECURE 2.0 Catch-Up</td>
                      <td className="py-3 px-4 text-on-surface-variant">Available across employer plans</td>
                      <td className="py-3 px-4 text-on-surface-variant">Available across Designated Roth plans</td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums font-bold">
                        +${limitsForYear.plan401k_403b_457.catchUpAge50Plus.toLocaleString('en-US')} (50+)
                        {'catchUpAge60To63Secure2' in limitsForYear.plan401k_403b_457
                          ? ` · +$${limitsForYear.plan401k_403b_457.catchUpAge60To63Secure2.toLocaleString('en-US')} (60–63)`
                          : ''}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Break-Even & Retirement Tax Rate Sensitivity Matrix */}
        {activeTab === 'sensitivity' && (
          <div className="p-6 rounded-3xl bg-surface-container border border-outline-variant/60 shadow-xs space-y-4 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-outline-variant/40">
              <div>
                <h3 className="text-base font-bold text-on-surface">
                  Retirement Tax Rate Sensitivity &amp; Break-Even Matrix
                </h3>
                <p className="text-xs text-on-surface-variant">
                  Holding current marginal rate at <strong>{currentMarginalRate}%</strong>, see how varying expected retirement tax rates (<span className="font-mono">t_ret</span>) affect after-tax end value.
                </p>
              </div>
              <span className="text-xs font-mono text-primary font-semibold">
                Break-Even Rate = {result.breakEvenRetirementRatePercent.toFixed(1)}%
              </span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-outline-variant/40">
              <table className="w-full text-xs text-left">
                <thead className="bg-surface-container-high text-on-surface-variant font-semibold">
                  <tr>
                    <th className="py-3 px-4">Expected Retirement Rate (t_ret)</th>
                    <th className="py-3 px-4">Retention Factor (1 − t_ret)</th>
                    <th className="py-3 px-4 text-right">Traditional After-Tax End Value</th>
                    <th className="py-3 px-4 text-right">Roth After-Tax End Value</th>
                    <th className="py-3 px-4 text-right">After-Tax Difference</th>
                    <th className="py-3 px-4 text-right">Comparison Outcome</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30 font-mono tabular-nums text-on-surface">
                  {result.sensitivityTable.map((row) => {
                    const isBreakEven = row.outcome === 'equal';
                    const isSelected = Math.abs(row.retirementRatePercent - expectedRetirementRate) < 0.05;
                    return (
                      <tr
                        key={row.retirementRatePercent}
                        onClick={() => setExpectedRetirementRate(row.retirementRatePercent)}
                        className={`transition-colors cursor-pointer ${
                          isBreakEven
                            ? 'bg-primary/10 font-bold'
                            : isSelected
                            ? 'bg-surface-container-high/80'
                            : 'hover:bg-surface-container-high/40'
                        }`}
                      >
                        <td className="py-2.5 px-4">
                          {row.retirementRatePercent.toFixed(1)}%
                          {isBreakEven ? ' (Break-Even)' : ''}
                          {isSelected && !isBreakEven ? ' (Selected)' : ''}
                        </td>
                        <td className="py-2.5 px-4 text-on-surface-variant">
                          {row.oneMinusRetRatePercent.toFixed(1)}%
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          {formatMoney(row.traditionalAfterTaxEndValue, 0)}
                        </td>
                        <td className="py-2.5 px-4 text-right text-teal-600 dark:text-teal-400">
                          {formatMoney(row.rothAfterTaxEndValue, 0)}
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          {row.outcome === 'equal'
                            ? formatMoney(0, 0)
                            : `${row.netDifference > 0 ? '+' : '−'}${formatMoney(Math.abs(row.netDifference), 0)}`}
                        </td>
                        <td className="py-2.5 px-4 text-right font-sans font-semibold">
                          {row.outcome === 'equal' ? (
                            <span className="text-primary">Break-Even Parity</span>
                          ) : row.outcome === 'traditional' ? (
                            <span className="text-on-surface">Traditional Higher</span>
                          ) : (
                            <span className="text-teal-600 dark:text-teal-400">Roth Higher</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: Year-by-Year Schedule */}
        {activeTab === 'schedule' && (
          <div className="p-6 rounded-3xl bg-surface-container border border-outline-variant/60 shadow-xs space-y-4 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-outline-variant/40">
              <div>
                <h3 className="text-base font-bold text-on-surface">
                  Year-by-Year Compounding &amp; After-Tax Trajectory
                </h3>
                <p className="text-xs text-on-surface-variant">
                  Comparing Traditional pre-tax balance, embedded retirement tax liability, Traditional after-tax value, and Roth tax-free value.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadCsv}
                  className="px-3 py-1.5 rounded-lg bg-surface border border-outline-variant text-xs font-semibold text-on-surface hover:text-primary transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <Download className="w-3.5 h-3.5" /> Export CSV
                </button>
                {result.timeline.length > 10 && (
                  <button
                    type="button"
                    onClick={() => setShowFullSchedule(!showFullSchedule)}
                    className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
                  >
                    {showFullSchedule ? (
                      <>
                        <ChevronUp className="w-3.5 h-3.5" /> Show First 10 Yrs
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3.5 h-3.5" /> Show All {result.years} Yrs
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-outline-variant/40">
              <table className="w-full text-xs text-left">
                <thead className="bg-surface-container-high text-on-surface-variant font-semibold">
                  <tr>
                    <th className="py-3 px-3">Yr</th>
                    <th className="py-3 px-3 text-right">After-Tax Outlay</th>
                    <th className="py-3 px-3 text-right">Traditional Pre-Tax</th>
                    <th className="py-3 px-3 text-right">Deferred Tax ({expectedRetirementRate}%)</th>
                    <th className="py-3 px-3 text-right">Traditional After-Tax</th>
                    <th className="py-3 px-3 text-right">Roth After-Tax</th>
                    <th className="py-3 px-3 text-right">Difference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30 font-mono tabular-nums text-on-surface">
                  {(showFullSchedule ? result.timeline : result.timeline.slice(0, 10)).map((row) => (
                    <tr key={row.year} className="hover:bg-surface-container-high/40 transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-primary">{row.year}</td>
                      <td className="py-2.5 px-3 text-right text-on-surface-variant">
                        {formatMoney(row.cumulativeAfterTaxOutlay, 0)}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {formatMoney(row.traditionalPreTaxBalance, 0)}
                      </td>
                      <td className="py-2.5 px-3 text-right text-red-500 dark:text-red-400">
                        −{formatMoney(row.traditionalEmbeddedTaxLiability, 0)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold">
                        {formatMoney(row.traditionalAfterTaxValue, 0)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-teal-600 dark:text-teal-400">
                        {formatMoney(row.rothAfterTaxBalance, 0)}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {Math.abs(row.afterTaxDifference) < 0.5
                          ? formatMoney(0, 0)
                          : `${row.afterTaxDifference > 0 ? '+' : '−'}${formatMoney(
                              Math.abs(row.afterTaxDifference),
                              0
                            )}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: Equal Outlay vs. Statutory Cap Nuance */}
        {activeTab === 'cap_nuance' && (
          <div className="p-6 rounded-3xl bg-surface-container border border-outline-variant/60 shadow-xs space-y-4 animate-in fade-in duration-200">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                <Info className="w-4 h-4 text-primary" />
                <span>Equal After-Tax Outlay vs. Maxing Out Statutory Dollar Limits</span>
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Why financial textbooks compare equal after-tax outlays—and what changes when a saver contributes the full statutory dollar limit ($7,000 IRA or $23,500 401(k)) to either account.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-surface border border-outline-variant/60 space-y-2">
                <h4 className="text-sm font-bold text-on-surface">
                  1. Equal After-Tax Outlay (Standard Apples-to-Apples Basis)
                </h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  To compare Traditional and Roth fairly on an equal budget, both choices must leave your take-home bank account with the exact same cash flow today. Allocating <strong className="font-mono">{formatMoney(preTaxContribution)}</strong> pre-tax to Traditional or <strong className="font-mono">{formatMoney(result.equalAfterTaxOutlayPerPeriod)}</strong> after-tax to Roth both cost <strong className="font-mono">{formatMoney(result.equalAfterTaxOutlayPerPeriod)}</strong> in spendable cash today. Under this condition, the comparison strictly reduces to <strong className="font-mono">(1 − t_ret)</strong> vs <strong className="font-mono">(1 − t_now)</strong>.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-surface border border-outline-variant/60 space-y-2">
                <h4 className="text-sm font-bold text-on-surface">
                  2. Statutory Contribution Cap Effect (Maxing Out Limits)
                </h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  IRS contribution limits ($7,000 IRA / $23,500 401(k)) are set in nominal dollars without adjusting for tax treatment. If you contribute the full <strong className="font-mono">{formatMoney(preTaxContribution)}</strong> into a Roth account AND pay the <strong className="font-mono">{formatMoney(outsideTaxComparison.extraOutOfPocketNow)}</strong> upfront tax from outside funds, the Roth grows to <strong className="font-mono">{formatMoney(outsideTaxComparison.fullRothEndValue)}</strong> tax-free. To keep the comparison equal, the Traditional contributor would need to invest their <strong className="font-mono">{formatMoney(outsideTaxComparison.extraOutOfPocketNow)}</strong> tax savings in a taxable brokerage account, where ongoing dividend and capital gains taxes slightly reduce the break-even rate.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Neutral Educational Note on Marginal vs Effective Tax Rates */}
        <div className="p-5 rounded-2xl bg-surface-container/60 border border-outline-variant/40 text-xs text-on-surface-variant space-y-2 leading-relaxed">
          <div className="font-bold text-on-surface">
            Methodology &amp; Neutral Planning Note: Marginal Rate Today vs. Effective Rate in Retirement
          </div>
          <p>
            When evaluating <span className="font-mono">t_now</span> versus <span className="font-mono">t_ret</span>, remember that pre-tax Traditional contributions are deducted from the top of your current income—saving tax at your <strong>current marginal rate</strong>. In retirement, if Traditional withdrawals are your primary income source, those withdrawals first fill the <strong>standard deduction (0% tax)</strong> and lower progressive tax brackets (10%, 12%) before reaching higher brackets, resulting in a lower <em>effective</em> tax rate on total withdrawals. Conversely, if Social Security, pensions, or required minimum distributions already fill your lower brackets in retirement, additional Traditional withdrawals will be taxed at your retirement marginal bracket. This calculator models mathematical projections for educational comparison and is not personalized tax or investment advice.
          </p>
        </div>

        {/* Related Finance Calculators (401(k), RMD / SWR, US Income Tax) */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-on-surface">
            Related Tax &amp; Retirement Calculators
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/finance/401k-calculator"
              className="p-4 rounded-2xl bg-surface-container border border-outline-variant/60 hover:border-primary transition-all group flex items-center justify-between"
            >
              <div className="space-y-1">
                <span className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors block">
                  401(k) Calculator (US)
                </span>
                <p className="text-[11px] text-on-surface-variant">
                  Model IRS $23,500 elective deferrals, employer match capture, and SECURE 2.0 catch-up rules.
                </p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-on-surface-variant group-hover:text-primary transition-colors shrink-0 ml-2" />
            </Link>

            <Link
              href="/finance/us-federal-income-tax-calculator"
              className="p-4 rounded-2xl bg-surface-container border border-outline-variant/60 hover:border-primary transition-all group flex items-center justify-between"
            >
              <div className="space-y-1">
                <span className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors block">
                  US Federal Income Tax Calculator
                </span>
                <p className="text-[11px] text-on-surface-variant">
                  Find your exact federal marginal tax bracket, effective tax rate, and standard deduction.
                </p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-on-surface-variant group-hover:text-primary transition-colors shrink-0 ml-2" />
            </Link>

            <Link
              href="/finance/rmd-calculator"
              className="p-4 rounded-2xl bg-surface-container border border-outline-variant/60 hover:border-primary transition-all group flex items-center justify-between"
            >
              <div className="space-y-1">
                <span className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors block">
                  RMD Calculator (IRS Pub 590-B)
                </span>
                <p className="text-[11px] text-on-surface-variant">
                  Calculate mandatory Required Minimum Distributions, SECURE 2.0 ages (73/75), and Table II/III factors.
                </p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-on-surface-variant group-hover:text-primary transition-colors shrink-0 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
