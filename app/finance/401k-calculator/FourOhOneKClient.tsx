'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Percent,
  Calendar,
  AlertCircle,
  ArrowUpRight,
  Sparkles,
  Download,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Target,
  Flame,
  ShieldCheck,
  Zap,
  PiggyBank,
  Compass,
  Gift,
  Landmark,
  Scale,
  DollarSign,
  Layers,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import {
  calculateFourOhOneK,
  type FourOhOneKResult,
  type FourOhOneKInput,
  type CompoundingTiming,
  IRS_401K_LIMITS,
} from '@/lib/finance-core/401k';
import { WORLD_CURRENCIES } from '../financeData';
import {
  useCurrency,
  formatWithGlobalCurrency,
  formatCompactWithGlobalCurrency,
  type GlobalCurrencyCode,
} from '@/lib/currency';

type CalculationMode = 'accumulator' | 'match_optimizer';

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
  color?: 'primary' | 'tertiary';
}) {
  const clamped = Math.min(Math.max(value, min), max);
  const pct = Math.max(0, Math.min(100, ((clamped - min) / (max - min)) * 100));
  const activeColorClass = color === 'tertiary' ? 'bg-teal-600' : 'bg-primary';
  const borderThumbClass =
    color === 'tertiary'
      ? 'border-teal-600 ring-teal-500/25'
      : 'border-primary ring-primary/25';

  return (
    <div className="space-y-1 w-full pt-1 pb-1">
      <div className="relative w-full h-8 flex items-center px-3 touch-none select-none">
        {/* Track Bar (8px thickness) */}
        <div className="w-full h-2 bg-surface-container-highest rounded-full relative overflow-hidden">
          <div
            className={`h-full ${activeColorClass} rounded-full transition-[width] duration-75`}
            style={{ width: `${pct}%` }}
          />
        </div>
        {/* Thumb Ball (24px on mobile, 22px on desktop with crisp ring, shadow and solid inner core) */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 sm:w-5.5 sm:h-5.5 bg-white dark:bg-slate-900 border-[2.5px] ${borderThumbClass} ring-4 rounded-full shadow-lg flex items-center justify-center pointer-events-none transition-transform active:scale-125`}
          style={{ left: `calc(12px + (100% - 24px) * ${pct / 100})` }}
        >
          {/* Inner accent core ball */}
          <div className={`w-2 h-2 sm:w-1.5 sm:h-1.5 rounded-full ${activeColorClass}`} />
        </div>
        {/* Transparent native range input for interaction */}
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
        <div className="flex justify-between text-[10px] font-semibold text-on-surface-variant/70 select-none">
          <span>{minLabel}</span>
          <span>{midLabel}</span>
          <span>{maxLabel}</span>
        </div>
      )}
    </div>
  );
}

export default function FourOhOneKClient() {
  // Mode selection
  const [mode, setMode] = useState<CalculationMode>('accumulator');

  // Global Currency selection
  const { currency: selectedCurrency, setCurrency: setGlobalCurrency } =
    useCurrency();

  // Input States
  const [currentSalary, setCurrentSalary] = useState<number>(85000);
  const [currentAge, setCurrentAge] = useState<number>(30);
  const [retirementAge, setRetirementAge] = useState<number>(65);
  const [contributionPercent, setContributionPercent] = useState<number>(6.0);
  const [employerMatchRate, setEmployerMatchRate] = useState<number>(50); // 50% = $0.50 per $1
  const [employerMatchCapPercent, setEmployerMatchCapPercent] = useState<number>(6.0); // up to 6% of salary
  const [salaryGrowthPercent, setSalaryGrowthPercent] = useState<number>(3.0);
  const [annualReturnPercent, setAnnualReturnPercent] = useState<number>(7.5);
  const [currentBalance, setCurrentBalance] = useState<number>(25000);

  // Optional Feature Toggles
  const [enableInflation, setEnableInflation] = useState<boolean>(true);
  const [inflationRatePercent, setInflationRatePercent] = useState<number>(2.5);

  const [enableMatchDetails, setEnableMatchDetails] = useState<boolean>(true);
  const [compoundingTiming, setCompoundingTiming] = useState<CompoundingTiming>('mid-year');
  const [applyCatchUpRules, setApplyCatchUpRules] = useState<boolean>(true);

  // Tax and Decumulation Settings
  const [currentTaxBracket, setCurrentTaxBracket] = useState<number>(22);
  const [retirementTaxBracket, setRetirementTaxBracket] = useState<number>(15);
  const [swrPercent, setSwrPercent] = useState<number>(4.0);

  // UI Table pagination / tabs state
  const [showFullSchedule, setShowFullSchedule] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeAnalysisTab, setActiveAnalysisTab] = useState<
    'schedule' | 'match' | 'roth' | 'rmd' | 'guide'
  >('schedule');

  // Currency Object
  const currencyObj = useMemo(() => {
    return WORLD_CURRENCIES.find((c) => c.code === selectedCurrency) || WORLD_CURRENCIES[0];
  }, [selectedCurrency]);

  const handleCurrencyChange = (newCode: string) => {
    setGlobalCurrency(newCode as GlobalCurrencyCode);
  };

  // Compact Formatter with Exchange Rate Conversion
  const formatCompact = (val: number) => {
    if (!isFinite(val)) return 'N/A';
    return formatCompactWithGlobalCurrency(val, {
      fromCurrency: 'USD',
    });
  };

  const formatMoney = (val: number) => {
    if (!isFinite(val)) return 'N/A';
    return formatWithGlobalCurrency(val, {
      fromCurrency: 'USD',
      decimals: 0,
    });
  };

  // Primary Calculation Result
  const result: FourOhOneKResult = useMemo(() => {
    const input: FourOhOneKInput = {
      currentSalary,
      currentAge,
      retirementAge,
      contributionPercent: mode === 'match_optimizer' ? employerMatchCapPercent : contributionPercent,
      employerMatchRate,
      employerMatchCapPercent,
      salaryGrowthPercent,
      annualReturnPercent,
      inflationRatePercent: enableInflation ? inflationRatePercent : 0,
      currentBalance,
      compoundingTiming,
      applyCatchUpRules,
      enableSecure2CatchUp: true,
      currentTaxBracketPercent: currentTaxBracket,
      retirementTaxBracketPercent: retirementTaxBracket,
      swrPercent,
    };
    return calculateFourOhOneK(input);
  }, [
    mode,
    currentSalary,
    currentAge,
    retirementAge,
    contributionPercent,
    employerMatchRate,
    employerMatchCapPercent,
    salaryGrowthPercent,
    annualReturnPercent,
    enableInflation,
    inflationRatePercent,
    currentBalance,
    compoundingTiming,
    applyCatchUpRules,
    currentTaxBracket,
    retirementTaxBracket,
    swrPercent,
  ]);

  // Reset Defaults
  const handleReset = () => {
    setCurrentSalary(85000);
    setCurrentAge(30);
    setRetirementAge(65);
    setContributionPercent(6.0);
    setEmployerMatchRate(50);
    setEmployerMatchCapPercent(6.0);
    setSalaryGrowthPercent(3.0);
    setAnnualReturnPercent(7.5);
    setInflationRatePercent(2.5);
    setCurrentBalance(25000);
    setCompoundingTiming('mid-year');
    setApplyCatchUpRules(true);
    setCurrentTaxBracket(22);
    setRetirementTaxBracket(15);
    setSwrPercent(4.0);
  };

  // Copy Summary Handler
  const handleCopySummary = () => {
    const summary = `📊 SolveIt 401(k) Retirement Investment Plan Summary:
• Starting Salary: ${formatMoney(currentSalary)} | Current Balance: ${formatMoney(currentBalance)}
• Retirement Horizon: Age ${currentAge} to ${retirementAge} (${result.yearsToRetire} Years)
• Employee Contribution Rate: ${contributionPercent}% (${formatMoney(result.firstYearEmployeeContribution)}/yr)
• Employer Match: ${employerMatchRate}% up to ${employerMatchCapPercent}% of salary (+${formatMoney(result.firstYearEmployerMatch)}/yr)
• Annual Investment Return: ${annualReturnPercent}% | Inflation: ${enableInflation ? `${inflationRatePercent}%` : 'Off'}
• Compounding Timing: ${compoundingTiming.toUpperCase()} (Half-Year Payroll Convention)
--------------------------------------------------
• Ending 401(k) Balance (Nominal): ${formatMoney(result.endingBalanceNominal)} (${formatCompact(result.endingBalanceNominal)})
• Inflation-Adjusted Purchasing Power: ${formatMoney(result.endingBalanceInflationAdjusted)} (${formatCompact(result.endingBalanceInflationAdjusted)})
• Total Employee Contributions: ${formatMoney(result.totalEmployeeContributions)} (${result.employeeContributionSharePercent}%)
• Total Employer Match Received: ${formatMoney(result.totalEmployerMatch)} (${result.employerMatchSharePercent}%)
• Total Investment Compound Growth: ${formatMoney(result.totalInvestmentGrowth)} (${result.growthSharePercent}%)
• Estimated Sustainable Payout (${swrPercent}% SWR): ${formatMoney(result.annualRetirementIncomeNominal)}/yr (${formatMoney(result.monthlyRetirementIncomeNominal)}/mo)
${
  result.isLeavingMoneyOnTable
    ? `⚠️ MONEY LEFT ON TABLE: Missing ${formatMoney(result.missedMatchFirstYear)}/yr in employer match! Over your career, this equals ${formatMoney(result.missedMatchWithGrowthAtRetirement)} in lost compound retirement wealth.`
    : `✅ FULL MATCH CAPTURED: You are capturing 100% of your available company match.`
}
Generated via SolveIt Calculator (https://solveitcalculator.com/finance/401k-calculator)`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Download CSV
  const handleDownloadCsv = () => {
    const headers = [
      'Year',
      'Age',
      'Salary',
      'Employee Contribution',
      'Employer Match',
      'Total Annual Additions',
      'Investment Compound Return',
      'Nominal Ending Balance',
      'Inflation-Adjusted Real Balance',
    ];

    const rows = result.timeline.map((r) => [
      r.year,
      r.age,
      Math.round(r.salary),
      Math.round(r.employeeContribution),
      Math.round(r.employerMatch),
      Math.round(r.totalContribution),
      Math.round(r.annualInvestmentReturn),
      Math.round(r.endingBalanceNominal),
      Math.round(r.endingBalanceInflationAdjusted),
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `401k_retirement_schedule_age${currentAge}_to_${retirementAge}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Top Controls Header: Mode Switcher & Currency / Timing Selection */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-surface-container border border-outline-variant/60 shadow-xs">
        {/* Mode Switcher */}
        <div className="inline-flex p-1 rounded-xl bg-surface-container-high border border-outline-variant/40 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setMode('accumulator')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              mode === 'accumulator'
                ? 'bg-surface text-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-primary" />
            <span>401(k) Wealth Accumulator</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('match_optimizer')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              mode === 'match_optimizer'
                ? 'bg-surface text-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Gift className="w-4 h-4 text-primary" />
            <span>Employer Match Maximizer</span>
          </button>
        </div>

        {/* Currency & Timing Selectors */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end flex-wrap">
          {/* Compounding Timing Switch */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-on-surface-variant hidden md:inline">Compounding:</span>
            <select
              value={compoundingTiming}
              onChange={(e) => setCompoundingTiming(e.target.value as CompoundingTiming)}
              className="px-2.5 py-1.5 rounded-lg bg-surface border border-outline-variant text-xs font-semibold text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary/20"
              title="Select payroll compounding convention"
            >
              <option value="mid-year">Mid-Year (Payroll Continuous)</option>
              <option value="end-year">End-of-Year</option>
            </select>
          </div>

          {/* Currency Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-on-surface-variant">Currency:</span>
            <select
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

      {/* Main Interactive Workbench (2 Columns on Desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Input Configuration Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-surface-container border border-outline-variant/60 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/40">
              <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
                {mode === 'accumulator' ? (
                  <>
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <span>401(k) Retirement Parameters</span>
                  </>
                ) : (
                  <>
                    <Gift className="w-5 h-5 text-primary" />
                    <span>Company Match Optimization</span>
                  </>
                )}
              </h2>
              <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-semibold">
                IRS 2025/2026 Limits
              </span>
            </div>

            {/* 1. Annual Salary */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-on-surface">
                  Current Annual Salary
                </label>
                <span className="text-base font-extrabold text-primary font-mono">
                  {formatMoney(currentSalary)}
                </span>
              </div>

              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-on-surface-variant">
                  {currencyObj.symbol}
                </span>
                <input
                  type="number"
                  min={10000}
                  max={1000000}
                  step={2500}
                  value={currentSalary}
                  onChange={(e) => setCurrentSalary(Math.max(1000, Number(e.target.value)))}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-surface border border-outline-variant text-sm font-semibold text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary/20 font-mono"
                />
              </div>

              <PrecisionSlider
                min={25000}
                max={300000}
                step={2500}
                value={currentSalary}
                onChange={setCurrentSalary}
                minLabel={formatCompact(25000)}
                midLabel={formatCompact(162500)}
                maxLabel={formatCompact(300000)}
              />

              {/* Salary Quick Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[50000, 75000, 85000, 100000, 125000, 150000, 200000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setCurrentSalary(amt)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                      currentSalary === amt
                        ? 'bg-primary text-on-primary border-primary'
                        : 'bg-surface border-outline-variant/60 text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    {formatCompact(amt)}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Current Age & Retirement Age (Dual Input in a Row) */}
            <div className="grid grid-cols-2 gap-4">
              {/* Current Age */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-on-surface">Current Age</label>
                  <span className="text-sm font-bold text-primary font-mono">{currentAge} Yrs</span>
                </div>
                <input
                  type="number"
                  min={18}
                  max={retirementAge - 1}
                  value={currentAge}
                  onChange={(e) => setCurrentAge(Math.max(18, Math.min(retirementAge - 1, Number(e.target.value))))}
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant text-sm font-semibold text-on-surface font-mono"
                />
                <PrecisionSlider
                  min={18}
                  max={60}
                  step={1}
                  value={currentAge}
                  onChange={(val) => setCurrentAge(Math.min(val, retirementAge - 1))}
                  minLabel="18"
                  maxLabel="60"
                />
              </div>

              {/* Retirement Age */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-on-surface">Retirement Age</label>
                  <span className="text-sm font-bold text-primary font-mono">{retirementAge} Yrs</span>
                </div>
                <input
                  type="number"
                  min={currentAge + 1}
                  max={80}
                  value={retirementAge}
                  onChange={(e) => setRetirementAge(Math.max(currentAge + 1, Math.min(80, Number(e.target.value))))}
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant text-sm font-semibold text-on-surface font-mono"
                />
                <PrecisionSlider
                  min={50}
                  max={75}
                  step={1}
                  value={retirementAge}
                  onChange={(val) => setRetirementAge(Math.max(val, currentAge + 1))}
                  minLabel="50"
                  maxLabel="75"
                />
              </div>
            </div>

            {/* 3. Employee Contribution Rate % */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-on-surface">
                  Employee Contribution Rate (% of salary)
                </label>
                <span className="text-base font-extrabold text-primary font-mono">
                  {contributionPercent.toFixed(1)}% ({formatMoney((currentSalary * contributionPercent) / 100)}/yr)
                </span>
              </div>

              <div className="relative">
                <input
                  type="number"
                  min={0}
                  max={100}
                  step={0.5}
                  value={contributionPercent}
                  onChange={(e) => setContributionPercent(Math.max(0, Math.min(100, Number(e.target.value))))}
                  className="w-full pl-4 pr-9 py-2.5 rounded-xl bg-surface border border-outline-variant text-sm font-semibold text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary/20 font-mono"
                />
                <Percent className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              </div>

              <PrecisionSlider
                min={0}
                max={30}
                step={0.5}
                value={contributionPercent}
                onChange={setContributionPercent}
                minLabel="0%"
                midLabel="15%"
                maxLabel="30%"
              />

              {/* Contribution Quick Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  { label: '3%', val: 3 },
                  { label: `${employerMatchCapPercent}% (Match Cap)`, val: employerMatchCapPercent },
                  { label: '10%', val: 10 },
                  { label: '15%', val: 15 },
                  { label: '20%', val: 20 },
                  {
                    label: 'IRS Max ($23.5k)',
                    val: Math.min(100, Number(((23500 / currentSalary) * 100).toFixed(1))),
                  },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setContributionPercent(item.val)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                      Math.abs(contributionPercent - item.val) < 0.1
                        ? 'bg-primary text-on-primary border-primary'
                        : 'bg-surface border-outline-variant/60 text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Employer Match Box (Stylized Option Box like SIP Step-Up) */}
            <div className="p-4 rounded-2xl bg-surface border border-outline-variant/60 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gift className="w-4 h-4 text-primary" />
                  <label htmlFor="match-toggle" className="text-sm font-bold text-on-surface cursor-pointer">
                    Employer Company Match Plan
                  </label>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    id="match-toggle"
                    type="checkbox"
                    checked={enableMatchDetails}
                    onChange={(e) => setEnableMatchDetails(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              {enableMatchDetails && (
                <div className="pt-2 space-y-4 border-t border-outline-variant/40 animate-in fade-in duration-200">
                  {/* Match Rate on the Dollar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-on-surface-variant">Match Rate (On the Dollar):</span>
                      <span className="text-primary font-bold text-sm">
                        {employerMatchRate}% (${(employerMatchRate / 100).toFixed(2)} per $1)
                      </span>
                    </div>
                    <PrecisionSlider
                      min={0}
                      max={100}
                      step={10}
                      value={employerMatchRate}
                      onChange={setEmployerMatchRate}
                      minLabel="0%"
                      midLabel="50%"
                      maxLabel="100%"
                    />
                    <div className="flex gap-2">
                      {[25, 50, 75, 100].map((rate) => (
                        <button
                          key={rate}
                          type="button"
                          onClick={() => setEmployerMatchRate(rate)}
                          className={`flex-1 py-1 rounded-md text-xs font-semibold border ${
                            employerMatchRate === rate
                              ? 'bg-primary text-on-primary border-primary'
                              : 'bg-surface-container text-on-surface-variant border-outline-variant/50'
                          }`}
                        >
                          {rate}%
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Match Cap (% of Salary) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-on-surface-variant">Match Cap (% of Salary):</span>
                      <span className="text-primary font-bold text-sm">{employerMatchCapPercent}% of salary</span>
                    </div>
                    <PrecisionSlider
                      min={1}
                      max={12}
                      step={0.5}
                      value={employerMatchCapPercent}
                      onChange={setEmployerMatchCapPercent}
                      minLabel="1%"
                      midLabel="6%"
                      maxLabel="12%"
                    />
                    <div className="flex gap-2">
                      {[3, 4, 5, 6, 8].map((cap) => (
                        <button
                          key={cap}
                          type="button"
                          onClick={() => setEmployerMatchCapPercent(cap)}
                          className={`flex-1 py-1 rounded-md text-xs font-semibold border ${
                            employerMatchCapPercent === cap
                              ? 'bg-primary text-on-primary border-primary'
                              : 'bg-surface-container text-on-surface-variant border-outline-variant/50'
                          }`}
                        >
                          {cap}%
                        </button>
                      ))}
                    </div>
                  </div>

                  <p className="text-[11px] text-on-surface-variant leading-relaxed">
                    Example: {employerMatchRate}% match up to {employerMatchCapPercent}% salary equals a maximum free company contribution of{' '}
                    <strong>{formatMoney((currentSalary * (employerMatchCapPercent / 100) * employerMatchRate) / 100)}/year</strong>.
                  </p>
                </div>
              )}
            </div>

            {/* 5. Existing 401(k) Balance */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-on-surface">
                  Current 401(k) Balance
                </label>
                <span className="text-base font-extrabold text-primary font-mono">
                  {formatMoney(currentBalance)}
                </span>
              </div>

              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-on-surface-variant">
                  {currencyObj.symbol}
                </span>
                <input
                  type="number"
                  min={0}
                  max={2000000}
                  step={5000}
                  value={currentBalance}
                  onChange={(e) => setCurrentBalance(Math.max(0, Number(e.target.value)))}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-surface border border-outline-variant text-sm font-semibold text-on-surface focus:outline-hidden focus:ring-2 focus:ring-primary/20 font-mono"
                />
              </div>

              <PrecisionSlider
                min={0}
                max={500000}
                step={5000}
                value={currentBalance}
                onChange={setCurrentBalance}
                minLabel="$0"
                midLabel={formatCompact(250000)}
                maxLabel={formatCompact(500000)}
              />

              <div className="flex flex-wrap gap-1.5 pt-1">
                {[0, 10000, 25000, 50000, 100000, 250000].map((bal) => (
                  <button
                    key={bal}
                    type="button"
                    onClick={() => setCurrentBalance(bal)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                      currentBalance === bal
                        ? 'bg-primary text-on-primary border-primary'
                        : 'bg-surface border-outline-variant/60 text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    {formatCompact(bal)}
                  </button>
                ))}
              </div>
            </div>

            {/* 6. Expected Annual Return & Salary Growth */}
            <div className="grid grid-cols-2 gap-4">
              {/* Annual Return */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-on-surface">Annual Return</label>
                  <span className="text-sm font-bold text-primary font-mono">{annualReturnPercent}%</span>
                </div>
                <input
                  type="number"
                  min={1}
                  max={15}
                  step={0.5}
                  value={annualReturnPercent}
                  onChange={(e) => setAnnualReturnPercent(Math.max(0.1, Number(e.target.value)))}
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant text-sm font-semibold text-on-surface font-mono"
                />
                <PrecisionSlider
                  min={4}
                  max={12}
                  step={0.5}
                  value={annualReturnPercent}
                  onChange={setAnnualReturnPercent}
                  minLabel="4%"
                  maxLabel="12%"
                />
              </div>

              {/* Salary Growth */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-on-surface">Salary Growth</label>
                  <span className="text-sm font-bold text-primary font-mono">{salaryGrowthPercent}%/yr</span>
                </div>
                <input
                  type="number"
                  min={0}
                  max={10}
                  step={0.5}
                  value={salaryGrowthPercent}
                  onChange={(e) => setSalaryGrowthPercent(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant text-sm font-semibold text-on-surface font-mono"
                />
                <PrecisionSlider
                  min={0}
                  max={8}
                  step={0.5}
                  value={salaryGrowthPercent}
                  onChange={setSalaryGrowthPercent}
                  minLabel="0%"
                  maxLabel="8%"
                />
              </div>
            </div>

            {/* 7. Inflation Adjustment Box (Matching SIP Calculator) */}
            <div className="p-4 rounded-2xl bg-surface border border-outline-variant/60 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-tertiary" />
                  <label htmlFor="inflation-toggle-401k" className="text-sm font-bold text-on-surface cursor-pointer">
                    Adjust for Inflation (Real Value)
                  </label>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    id="inflation-toggle-401k"
                    type="checkbox"
                    checked={enableInflation}
                    onChange={(e) => setEnableInflation(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-tertiary"></div>
                </label>
              </div>

              {enableInflation && (
                <div className="pt-2 space-y-3 border-t border-outline-variant/40 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-on-surface-variant">Expected Inflation Rate:</span>
                    <span className="text-tertiary font-bold text-sm">{inflationRatePercent}% p.a.</span>
                  </div>

                  <PrecisionSlider
                    min={1}
                    max={6}
                    step={0.25}
                    value={inflationRatePercent}
                    onChange={setInflationRatePercent}
                    minLabel="1%"
                    midLabel="3%"
                    maxLabel="6%"
                    color="tertiary"
                  />

                  <div className="flex gap-2">
                    {[2.0, 2.5, 3.0, 3.5, 4.0].map((inf) => (
                      <button
                        key={inf}
                        type="button"
                        onClick={() => setInflationRatePercent(inf)}
                        className={`flex-1 py-1 rounded-md text-xs font-semibold border ${
                          inflationRatePercent === inf
                            ? 'bg-tertiary text-on-tertiary border-tertiary'
                            : 'bg-surface-container text-on-surface-variant border-outline-variant/50'
                        }`}
                      >
                        {inf}%
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-on-surface-variant leading-relaxed">
                    Computes your purchasing power in today&apos;s equivalent prices so you know what your 401(k) can actually buy in retirement.
                  </p>
                </div>
              )}
            </div>

            {/* 8. IRS Catch-Up & Tax Rules Box */}
            <div className="p-4 rounded-2xl bg-surface border border-outline-variant/60 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-bold text-on-surface">IRS Catch-Up &amp; SECURE 2.0</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={applyCatchUpRules}
                    onChange={(e) => setApplyCatchUpRules(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              <p className="text-xs text-on-surface-variant">
                Enables +$7,500/yr catch-up at age 50+, and +$11,250/yr SECURE 2.0 super catch-up for ages 60–63.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Results Dashboard, Visual Charts & Value-Added Insights */}
        <div className="lg:col-span-7 space-y-6">
          {/* Top Result Banner */}
          <div className="p-6 rounded-3xl bg-linear-to-br from-primary/10 via-surface-container to-surface-container-high border border-primary/20 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-primary tracking-wide uppercase">
                <PiggyBank className="w-4 h-4" />
                <span>Projected 401(k) Retirement Nest Egg</span>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary text-on-primary">
                At Age {retirementAge} ({result.yearsToRetire} Years)
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-on-surface tracking-tight font-mono">
                {formatMoney(result.endingBalanceNominal)}
              </span>
              {enableInflation && (
                <div className="text-right">
                  <span className="text-xs text-on-surface-variant block">Purchasing Power Today</span>
                  <span className="text-lg font-bold text-teal-600 dark:text-teal-400 font-mono">
                    {formatMoney(result.endingBalanceInflationAdjusted)}
                  </span>
                </div>
              )}
            </div>

            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              Contributing <strong>{formatMoney(result.firstYearEmployeeContribution)}/year</strong> ({contributionPercent}%) with an employer match of{' '}
              <strong>{formatMoney(result.firstYearEmployerMatch)}/year</strong> accumulates{' '}
              <strong>{formatMoney(result.endingBalanceNominal)}</strong> total nest egg over {result.yearsToRetire} years.
            </p>
          </div>

          {/* =========================================================================
              VALUE-ADDED ALERT: "MONEY LEFT ON THE TABLE" BANNER
              (Prominently alerts user if contribution is below the match cap)
          ========================================================================= */}
          {result.isLeavingMoneyOnTable ? (
            <div className="p-5 sm:p-6 rounded-3xl border border-amber-500/40 bg-amber-500/10 dark:bg-amber-950/20 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 bg-amber-500/20 border border-amber-500/40 rounded-2xl text-amber-600 dark:text-amber-400 shrink-0">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300">
                        Free Money Opportunity
                      </span>
                      <span className="text-xs text-on-surface-variant">Match Cap: {employerMatchCapPercent}% of salary</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-extrabold text-on-surface">
                      You are leaving <span className="text-amber-600 dark:text-amber-400">{formatMoney(result.missedMatchFirstYear)}/year</span> on the table!
                    </h3>
                    <p className="text-xs sm:text-sm text-on-surface-variant max-w-xl leading-relaxed">
                      Your employer matches up to <strong>{employerMatchCapPercent}%</strong> of pay, but you are currently contributing only <strong>{contributionPercent}%</strong>. Over your career with compound interest, this missed match equals{' '}
                      <strong className="text-amber-600 dark:text-amber-400 font-mono">{formatMoney(result.missedMatchWithGrowthAtRetirement)}</strong> in lost retirement wealth!
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setContributionPercent(employerMatchCapPercent)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-xs cursor-pointer shrink-0"
                >
                  <Gift className="w-4 h-4" /> Bump to {employerMatchCapPercent}% &amp; Claim All Match
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 dark:bg-emerald-950/20 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="text-on-surface font-semibold">
                  <strong>100% Match Captured!</strong> You are receiving{' '}
                  <strong className="text-emerald-600 dark:text-emerald-400">{formatMoney(result.firstYearEmployerMatch)}/yr</strong> in guaranteed free company money.
                </span>
              </div>
              <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold text-[11px]">
                Full Match Achieved
              </span>
            </div>
          )}

          {/* Key Metrics 4-Box Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-surface-container border border-outline-variant/60 space-y-1">
              <span className="text-[11px] font-semibold text-on-surface-variant flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-primary" />
                Your Contributions
              </span>
              <div className="text-base sm:text-lg font-extrabold text-on-surface font-mono">
                {formatCompact(result.totalEmployeeContributions)}
              </div>
              <span className="text-[11px] font-medium text-primary">
                {result.employeeContributionSharePercent}% of nest egg
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-surface-container border border-outline-variant/60 space-y-1">
              <span className="text-[11px] font-semibold text-on-surface-variant flex items-center gap-1">
                <Gift className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Employer Match
              </span>
              <div className="text-base sm:text-lg font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                {formatCompact(result.totalEmployerMatch)}
              </div>
              <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                {result.employerMatchSharePercent}% free money
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-surface-container border border-outline-variant/60 space-y-1">
              <span className="text-[11px] font-semibold text-on-surface-variant flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                Compound Returns
              </span>
              <div className="text-base sm:text-lg font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
                {formatCompact(result.totalInvestmentGrowth)}
              </div>
              <span className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400">
                {result.growthSharePercent}% pure gains
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-surface-container border border-outline-variant/60 space-y-1">
              <span className="text-[11px] font-semibold text-on-surface-variant flex items-center gap-1">
                <Landmark className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                Income ({swrPercent}% SWR)
              </span>
              <div className="text-base sm:text-lg font-extrabold text-on-surface font-mono">
                {formatMoney(result.monthlyRetirementIncomeNominal)}
                <span className="text-xs text-on-surface-variant font-normal">/mo</span>
              </div>
              <span className="text-[11px] font-medium text-on-surface-variant">
                {formatMoney(result.annualRetirementIncomeNominal)}/yr
              </span>
            </div>
          </div>

          {/* Corpus Composition Segmented Progress Bar */}
          <div className="p-6 rounded-3xl bg-surface-container border border-outline-variant/60 space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-on-surface">
              <span>401(k) Wealth Breakdown</span>
              <span className="text-on-surface-variant font-mono">
                Total: {formatMoney(result.endingBalanceNominal)}
              </span>
            </div>

            {/* Split Progress Bar */}
            <div className="h-4 rounded-full overflow-hidden flex bg-surface-container-highest shadow-inner">
              <div
                style={{ width: `${result.employeeContributionSharePercent}%` }}
                className="bg-primary h-full transition-all duration-300"
                title={`Your Deposits: ${result.employeeContributionSharePercent}%`}
              />
              <div
                style={{ width: `${result.employerMatchSharePercent}%` }}
                className="bg-emerald-500 h-full transition-all duration-300"
                title={`Company Match: ${result.employerMatchSharePercent}%`}
              />
              <div
                style={{ width: `${result.growthSharePercent}%` }}
                className="bg-indigo-500 h-full transition-all duration-300"
                title={`Compound Growth: ${result.growthSharePercent}%`}
              />
            </div>

            {/* Legend Pills */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0" />
                <span className="text-on-surface-variant truncate">
                  Deposits: <strong>{result.employeeContributionSharePercent}%</strong>
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="text-on-surface-variant truncate">
                  Match: <strong>{result.employerMatchSharePercent}%</strong>
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0" />
                <span className="text-on-surface-variant truncate">
                  Growth: <strong>{result.growthSharePercent}%</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Milestone Trajectory Visualization */}
          <div className="p-6 rounded-3xl bg-surface-container border border-outline-variant/60 space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-on-surface">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span>Milestone Growth Trajectory</span>
              </div>
              <span className="text-on-surface-variant">Age by Age Compounding</span>
            </div>

            <div className="grid grid-cols-6 gap-2 text-center pt-2">
              {[
                { label: `Age ${currentAge}`, age: currentAge, isStart: true },
                { label: `Age ${Math.round(currentAge + result.yearsToRetire * 0.2)}`, age: Math.round(currentAge + result.yearsToRetire * 0.2) },
                { label: `Age ${Math.round(currentAge + result.yearsToRetire * 0.4)}`, age: Math.round(currentAge + result.yearsToRetire * 0.4) },
                { label: `Age ${Math.round(currentAge + result.yearsToRetire * 0.6)}`, age: Math.round(currentAge + result.yearsToRetire * 0.6) },
                { label: `Age ${Math.round(currentAge + result.yearsToRetire * 0.8)}`, age: Math.round(currentAge + result.yearsToRetire * 0.8) },
                { label: `Age ${retirementAge}`, age: retirementAge },
              ].map((m, idx) => {
                let bal = currentBalance;
                if (m.isStart) {
                  bal = currentBalance;
                } else {
                  const targetRow = result.timeline.find((r) => r.age >= m.age) || result.timeline[result.timeline.length - 1];
                  bal = targetRow ? (targetRow.endingBalanceNominal ?? targetRow.endBalance ?? currentBalance) : currentBalance;
                }
                const maxBal = Math.max(1, result.endingBalanceNominal || currentBalance || 1);
                const heightPct = Math.max(12, Math.min(100, (bal / maxBal) * 100));

                return (
                  <div key={idx} className="flex flex-col items-center gap-2">
                    <span className="text-[10px] font-mono text-primary font-bold truncate w-full" title={formatMoney(bal)}>
                      {formatCompact(bal)}
                    </span>
                    <div className="w-full h-28 bg-surface-container-highest rounded-xl flex items-end p-1">
                      <div
                        style={{ height: `${heightPct}%` }}
                        className="w-full bg-primary rounded-lg transition-all duration-300 shadow-xs"
                      />
                    </div>
                    <span className="text-[10px] font-medium text-on-surface-variant truncate w-full">
                      {m.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons Bar (Matching SIP Calculator) */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-surface-container border border-outline-variant/60">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopySummary}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface border border-outline-variant text-xs font-semibold text-on-surface hover:text-primary transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Summary Copied' : 'Copy Summary'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadCsv}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface border border-outline-variant text-xs font-semibold text-on-surface hover:text-primary transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          BOTTOM FULL-WIDTH ANALYSIS TABS SECTION (Matching SIP Calculator Layout)
      ========================================================================= */}
      <div className="space-y-6 pt-4">
        {/* Segmented Tab Navigation Bar */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-surface-container border border-outline-variant/60 overflow-x-auto no-scrollbar">
          {[
            { id: 'schedule', label: 'Amortization Schedule', icon: Calendar },
            { id: 'match', label: 'Match Analysis', icon: Gift },
            { id: 'roth', label: 'Roth vs Traditional', icon: Scale },
            { id: 'rmd', label: 'RMD & Income Payout', icon: Landmark },
            { id: 'guide', label: 'IRS Limits & Guide', icon: BookOpen },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeAnalysisTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() =>
                  setActiveAnalysisTab(
                    tab.id as 'schedule' | 'match' | 'roth' | 'rmd' | 'guide'
                  )
                }
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
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

        {/* Tab 1: Amortization Schedule Table */}
        {activeAnalysisTab === 'schedule' && (
          <div className="p-6 rounded-3xl bg-surface-container border border-outline-variant/60 shadow-xs space-y-4 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-outline-variant/40">
              <div>
                <h3 className="text-base font-bold text-on-surface">Year-by-Year 401(k) Growth Schedule</h3>
                <p className="text-xs text-on-surface-variant">
                  Tracking salary increments, elective deferrals, company match, compound growth, and real purchasing power.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadCsv}
                  className="px-3 py-1.5 rounded-lg bg-surface border border-outline-variant text-xs font-semibold text-on-surface hover:text-primary transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Export Table
                </button>
                <button
                  type="button"
                  onClick={() => setShowFullSchedule(!showFullSchedule)}
                  className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors flex items-center gap-1"
                >
                  {showFullSchedule ? (
                    <>
                      <ChevronUp className="w-3.5 h-3.5" /> Show First 10 Yrs
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3.5 h-3.5" /> Show All {result.yearsToRetire} Yrs
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-outline-variant/40">
              <table className="w-full text-xs text-left">
                <thead className="bg-surface-container-high text-on-surface-variant font-semibold">
                  <tr>
                    <th className="py-3 px-3">Yr</th>
                    <th className="py-3 px-3">Age</th>
                    <th className="py-3 px-3">Salary</th>
                    <th className="py-3 px-3">Employee Contribution</th>
                    <th className="py-3 px-3">Employer Match</th>
                    <th className="py-3 px-3">Annual Growth</th>
                    <th className="py-3 px-3 text-right">Ending Balance (Nominal)</th>
                    <th className="py-3 px-3 text-right">Real Value (Today&apos;s $)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30 font-mono text-on-surface">
                  {(showFullSchedule ? result.timeline : result.timeline.slice(0, 10)).map((row) => (
                    <tr key={row.year} className="hover:bg-surface-container-high/50 transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-primary">{row.year}</td>
                      <td className="py-2.5 px-3 text-on-surface-variant">{row.age}</td>
                      <td className="py-2.5 px-3">{formatMoney(row.salary)}</td>
                      <td className="py-2.5 px-3 text-primary">{formatMoney(row.employeeContribution)}</td>
                      <td className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400">+{formatMoney(row.employerMatch)}</td>
                      <td className="py-2.5 px-3 text-indigo-600 dark:text-indigo-400">+{formatMoney(row.annualInvestmentReturn)}</td>
                      <td className="py-2.5 px-3 text-right font-bold">{formatMoney(row.endingBalanceNominal)}</td>
                      <td className="py-2.5 px-3 text-right text-teal-600 dark:text-teal-400">
                        {formatMoney(row.endingBalanceInflationAdjusted)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Match Analysis */}
        {activeAnalysisTab === 'match' && (
          <div className="p-6 rounded-3xl bg-surface-container border border-outline-variant/60 shadow-xs space-y-6 animate-in fade-in duration-200">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-on-surface">Employer Match Breakdown &amp; Opportunity Cost</h3>
              <p className="text-xs text-on-surface-variant">
                Understand the instant guaranteed return of company matching and see the cumulative cost of contributing below the cap.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-surface border border-outline-variant/60 space-y-3">
                <span className="text-xs font-bold text-primary uppercase">Your Match Formula</span>
                <div className="text-2xl font-extrabold text-on-surface">
                  {employerMatchRate}% match up to {employerMatchCapPercent}% salary
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  For every $1.00 you save (up to {employerMatchCapPercent}% of salary), your company deposits ${(employerMatchRate / 100).toFixed(2)}. This represents an immediate, risk-free <strong>{employerMatchRate}% guaranteed return</strong> on investment before any market gains.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-surface border border-outline-variant/60 space-y-3">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">First Year Match Payout</span>
                <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                  +{formatMoney(result.firstYearEmployerMatch)}/yr
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Maximum potential company match available is{' '}
                  <strong>{formatMoney((currentSalary * (employerMatchCapPercent / 100) * employerMatchRate) / 100)}/year</strong>.
                  {result.isLeavingMoneyOnTable
                    ? ` You are forfeiting ${formatMoney(result.missedMatchFirstYear)} every single year!`
                    : ` You are claiming 100% of available matching dollars.`}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-surface-container-high border border-outline-variant/40 space-y-2">
              <h4 className="text-xs font-bold text-on-surface">Why You Should Always Meet the Match</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Financial advisors universally recommend contributing at least enough to capture your full employer match before funding any IRA, HSA, or taxable brokerage accounts. Skipping the match is equivalent to turning down an immediate bonus or salary raise.
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Roth vs Traditional 401(k) */}
        {activeAnalysisTab === 'roth' && (
          <div className="p-6 rounded-3xl bg-surface-container border border-outline-variant/60 shadow-xs space-y-6 animate-in fade-in duration-200">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-on-surface">Roth vs Traditional 401(k) Comparison</h3>
              <p className="text-xs text-on-surface-variant">
                Analyze tax-deferred growth today vs tax-free withdrawals in retirement based on your marginal tax rates.
              </p>
            </div>

            {/* Tax Bracket Controls */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-surface border border-outline-variant/60">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-on-surface-variant">Current Marginal Tax Bracket:</span>
                  <span className="text-primary font-bold">{currentTaxBracket}%</span>
                </div>
                <PrecisionSlider
                  min={10}
                  max={37}
                  step={1}
                  value={currentTaxBracket}
                  onChange={setCurrentTaxBracket}
                  minLabel="10%"
                  midLabel="24%"
                  maxLabel="37%"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-on-surface-variant">Expected Retirement Tax Bracket:</span>
                  <span className="text-primary font-bold">{retirementTaxBracket}%</span>
                </div>
                <PrecisionSlider
                  min={10}
                  max={37}
                  step={1}
                  value={retirementTaxBracket}
                  onChange={setRetirementTaxBracket}
                  minLabel="10%"
                  midLabel="22%"
                  maxLabel="37%"
                />
              </div>
            </div>

            {/* Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-surface border border-outline-variant/60 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-on-surface">Traditional 401(k) (Pre-Tax)</h4>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-primary/10 text-primary font-semibold">Tax Deduction Today</span>
                </div>
                <ul className="text-xs text-on-surface-variant space-y-2 leading-relaxed">
                  <li>• Current Year Tax Savings: <strong>+{formatMoney((result.firstYearEmployeeContribution * currentTaxBracket) / 100)}/yr</strong></li>
                  <li>• Withdrawals in retirement are taxed as ordinary income at your {retirementTaxBracket}% rate.</li>
                  <li>• Net After-Tax Retirement Value: <strong>{formatMoney(result.endingBalanceNominal * (1 - retirementTaxBracket / 100))}</strong></li>
                  <li>• Subject to IRS Required Minimum Distributions (RMDs) starting at age 73/75.</li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-surface border border-outline-variant/60 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-on-surface">Roth 401(k) (After-Tax)</h4>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">100% Tax-Free in Retirement</span>
                </div>
                <ul className="text-xs text-on-surface-variant space-y-2 leading-relaxed">
                  <li>• No upfront tax deduction today; funded with after-tax earnings.</li>
                  <li>• All qualified retirement withdrawals—including compound gains—are <strong>100% tax-free</strong>.</li>
                  <li>• Net Spendable Retirement Value: <strong>{formatMoney(result.endingBalanceNominal)}</strong></li>
                  <li>• Exempt from lifetime RMD rules under the SECURE 2.0 Act.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: RMD & SWR Income Decumulation */}
        {activeAnalysisTab === 'rmd' && (
          <div className="p-6 rounded-3xl bg-surface-container border border-outline-variant/60 shadow-xs space-y-6 animate-in fade-in duration-200">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-on-surface">Required Minimum Distributions (RMD) &amp; SWR Payout</h3>
              <p className="text-xs text-on-surface-variant">
                SECURE 2.0 statutory distribution rules and sustainable withdrawal rate modeling.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-surface border border-outline-variant/60 space-y-3">
                <span className="text-xs font-bold text-primary uppercase">Safe Withdrawal Rate (SWR)</span>
                <div className="text-2xl font-extrabold text-on-surface font-mono">
                  {formatMoney(result.annualRetirementIncomeNominal)}/yr
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Based on the Bengen 4% Rule, withdrawing {swrPercent}% of your portfolio ({formatMoney(result.monthlyRetirementIncomeNominal)}/month) provides 30+ years of retirement income with a 95%+ historical success rate.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-surface border border-outline-variant/60 space-y-3">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase">SECURE 2.0 RMD Schedule</span>
                <div className="text-2xl font-extrabold text-on-surface font-mono">
                  Starts at Age 73 / 75
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Traditional pre-tax accounts must take annual minimum distributions starting at age 73 (increasing to age 75 in 2033). Roth 401(k) accounts are 100% exempt from pre-death RMDs starting in tax year 2024.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: IRS Limits & Statutory Guide */}
        {activeAnalysisTab === 'guide' && (
          <div className="p-6 rounded-3xl bg-surface-container border border-outline-variant/60 shadow-xs space-y-6 animate-in fade-in duration-200">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-on-surface">IRS 401(k) Contribution Limits &amp; SECURE 2.0 Rules (2025)</h3>
              <p className="text-xs text-on-surface-variant">
                Source:{' '}
                <a
                  href="https://www.irs.gov/pub/irs-drop/n-24-80.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-primary hover:underline"
                >
                  IRS Notice 2024-80 &amp; Internal Revenue Code § 402(g) (Published Nov 1, 2024 for 2025 Tax Year)
                </a>
                .
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-surface border border-outline-variant/60 space-y-2">
                <span className="text-xs font-bold text-primary">Elective Deferral Limit</span>
                <div className="text-xl font-bold font-mono text-on-surface">${IRS_401K_LIMITS.baseLimit2025.toLocaleString()}</div>
                <p className="text-[11px] text-on-surface-variant">Maximum standard employee contribution across all pre-tax and Roth 401(k) plans.</p>
              </div>

              <div className="p-4 rounded-2xl bg-surface border border-outline-variant/60 space-y-2">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Age 50+ Catch-Up</span>
                <div className="text-xl font-bold font-mono text-on-surface">+${IRS_401K_LIMITS.catchUpLimit2025.toLocaleString()}</div>
                <p className="text-[11px] text-on-surface-variant">Additional elective deferrals allowed for workers turning 50 or older during the tax year (Total $31,000).</p>
              </div>

              <div className="p-4 rounded-2xl bg-surface border border-outline-variant/60 space-y-2">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">SECURE 2.0 Ages 60–63</span>
                <div className="text-xl font-bold font-mono text-on-surface">+${IRS_401K_LIMITS.secure2CatchUpLimit2025.toLocaleString()}</div>
                <p className="text-[11px] text-on-surface-variant">Elevated super catch-up tier for employees aged 60, 61, 62, and 63 (Total $34,750).</p>
              </div>
            </div>
          </div>
        )}

        {/* Plain Disclaimer Box */}
        <div className="p-4 rounded-2xl bg-surface-container/60 border border-outline-variant/40 text-xs text-on-surface-variant leading-relaxed">
          <p>
            <strong>Disclaimer:</strong> Estimate only, not financial, tax, or investment advice. This 401(k) calculator provides mathematical projections based on user-supplied inputs and published IRS contribution limits (IRC § 401(k), § 402(g), § 415(c); IRS Notice 2024-80). Calculations assume constant annual compounding and do not guarantee future investment returns or account balances.
          </p>
        </div>

        {/* Related Retirement Calculators Suite */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider">Related Retirement Planning Calculators</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/fire-forecaster"
              className="p-4 rounded-2xl bg-surface-container border border-outline-variant/60 hover:border-primary transition-all group flex items-center justify-between"
            >
              <div className="space-y-1">
                <span className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors block">
                  FIRE &amp; Coast FIRE Forecaster
                </span>
                <p className="text-[11px] text-on-surface-variant">
                  Forecast if your investments will compound to your nest egg with zero additional savings.
                </p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-on-surface-variant group-hover:text-primary transition-colors shrink-0 ml-2" />
            </Link>

            <Link
              href="/finance/safe-withdrawal-rate-calculator"
              className="p-4 rounded-2xl bg-surface-container border border-outline-variant/60 hover:border-primary transition-all group flex items-center justify-between"
            >
              <div className="space-y-1">
                <span className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors block">
                  Safe Withdrawal Rate (SWR)
                </span>
                <p className="text-[11px] text-on-surface-variant">
                  Evaluate William Bengen’s 4% rule, portfolio longevity, and decumulation safety margins.
                </p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-on-surface-variant group-hover:text-primary transition-colors shrink-0 ml-2" />
            </Link>

            <Link
              href="/finance/roth-vs-traditional-calculator"
              className="p-4 rounded-2xl bg-surface-container border border-outline-variant/60 hover:border-primary transition-all group flex items-center justify-between"
            >
              <div className="space-y-1">
                <span className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors block">
                  Roth vs Traditional Calculator
                </span>
                <p className="text-[11px] text-on-surface-variant">
                  Compare equal after-tax outlays, break-even retirement tax rates, RMDs, and IRS MAGI limits.
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
