'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  RotateCcw,
  Copy,
  Check,
  HelpCircle,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Building2,
  DollarSign,
  Percent,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';

interface Preset {
  name: string;
  initialValue: number;
  rate: number;
  rateUnit: 'year' | 'month';
  period: number;
  periodUnit: 'year' | 'month';
  compounding: 'annual' | 'semi-annual' | 'quarterly' | 'monthly' | 'continuous';
  description: string;
}

const PRESETS: Preset[] = [
  {
    name: 'Home / Real Estate (US Avg)',
    initialValue: 350000,
    rate: 4.2,
    rateUnit: 'year',
    period: 10,
    periodUnit: 'year',
    compounding: 'annual',
    description: 'Long-term residential real estate historical average',
  },
  {
    name: 'Starter Home (Inch Calc Default)',
    initialValue: 100000,
    rate: 4.0,
    rateUnit: 'year',
    period: 10,
    periodUnit: 'year',
    compounding: 'annual',
    description: 'Standard $100k at 4% benchmark example',
  },
  {
    name: 'Stock Index Fund (S&P 500)',
    initialValue: 50000,
    rate: 7.5,
    rateUnit: 'year',
    period: 15,
    periodUnit: 'year',
    compounding: 'annual',
    description: 'Broad market historical real appreciation rate',
  },
  {
    name: 'Luxury Collectibles / Art',
    initialValue: 25000,
    rate: 6.0,
    rateUnit: 'year',
    period: 8,
    periodUnit: 'year',
    compounding: 'annual',
    description: 'Fine watches, classic vehicles, or curated art',
  },
  {
    name: 'High-Growth Tech / Equity',
    initialValue: 20000,
    rate: 12.0,
    rateUnit: 'year',
    period: 5,
    periodUnit: 'year',
    compounding: 'annual',
    description: 'Aggressive growth trajectory assets',
  },
];

export default function AppreciationCalculator() {
  // Core input states (matching inchcalculator.com defaults)
  const [initialValue, setInitialValue] = useState<number>(100000);
  const [appreciationRate, setAppreciationRate] = useState<number>(4.0);
  const [rateUnit, setRateUnit] = useState<'year' | 'month'>('year');
  const [period, setPeriod] = useState<number>(10);
  const [periodUnit, setPeriodUnit] = useState<'year' | 'month'>('year');
  const [compounding, setCompounding] = useState<'annual' | 'semi-annual' | 'quarterly' | 'monthly' | 'continuous'>('annual');
  
  // Advanced options
  const [adjustInflation, setAdjustInflation] = useState<boolean>(false);
  const [inflationRate, setInflationRate] = useState<number>(2.5);
  const [copied, setCopied] = useState<boolean>(false);
  const [scheduleViewLimit, setScheduleViewLimit] = useState<number>(10);

  // Conversion of inputs to standardized annual/monthly units
  const calculations = useMemo(() => {
    const P = Math.max(0, initialValue);
    
    // Normalized annual nominal appreciation rate (as a decimal)
    let rAnnual = rateUnit === 'year' ? appreciationRate / 100 : (appreciationRate * 12) / 100;
    
    // Total duration in years
    const tYears = periodUnit === 'year' ? period : period / 12;
    
    if (P === 0 || tYears <= 0) {
      return {
        futureValue: P,
        totalAppreciation: 0,
        percentageGain: 0,
        cagr: 0,
        realFutureValue: P,
        schedule: [] as Array<{
          periodNumber: number;
          startValue: number;
          gain: number;
          endValue: number;
          cumulativeGain: number;
          percentGain: number;
        }>,
      };
    }

    // Determine compounding frequency n
    let n = 1;
    if (compounding === 'semi-annual') n = 2;
    else if (compounding === 'quarterly') n = 4;
    else if (compounding === 'monthly') n = 12;

    let fv = 0;
    if (compounding === 'continuous') {
      fv = P * Math.exp(rAnnual * tYears);
    } else {
      fv = P * Math.pow(1 + rAnnual / n, n * tYears);
    }

    const totalGain = fv - P;
    const percentGain = P > 0 ? (totalGain / P) * 100 : 0;
    const cagr = P > 0 && tYears > 0 ? (Math.pow(fv / P, 1 / tYears) - 1) * 100 : 0;

    // Inflation-adjusted real future value
    const realFv = adjustInflation && inflationRate > 0
      ? fv / Math.pow(1 + inflationRate / 100, tYears)
      : fv;

    // Generate step schedule
    const numDisplayPeriods = Math.min(Math.ceil(tYears), 100);
    const schedule: Array<{
      periodNumber: number;
      startValue: number;
      gain: number;
      endValue: number;
      cumulativeGain: number;
      percentGain: number;
    }> = [];

    let currentBalance = P;
    for (let yr = 1; yr <= numDisplayPeriods; yr++) {
      let periodEnd = 0;
      if (compounding === 'continuous') {
        periodEnd = P * Math.exp(rAnnual * yr);
      } else {
        periodEnd = P * Math.pow(1 + rAnnual / n, n * yr);
      }
      const periodGain = periodEnd - currentBalance;
      const cumGain = periodEnd - P;
      const pctGain = P > 0 ? (cumGain / P) * 100 : 0;

      schedule.push({
        periodNumber: yr,
        startValue: currentBalance,
        gain: periodGain,
        endValue: periodEnd,
        cumulativeGain: cumGain,
        percentGain: pctGain,
      });

      currentBalance = periodEnd;
    }

    return {
      futureValue: fv,
      totalAppreciation: totalGain,
      percentageGain: percentGain,
      cagr: cagr,
      realFutureValue: realFv,
      schedule,
    };
  }, [initialValue, appreciationRate, rateUnit, period, periodUnit, compounding, adjustInflation, inflationRate]);

  // Formatter helpers
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val);
  };

  const formatPercent = (val: number) => {
    return `${val >= 0 ? '+' : ''}${val.toFixed(2)}%`;
  };

  const handleCopySummary = () => {
    const text = `Appreciation Calculation:
• Initial Value: ${formatCurrency(initialValue)}
• Rate: ${appreciationRate}% per ${rateUnit} (${compounding} compounding)
• Period: ${period} ${periodUnit}${period > 1 ? 's' : ''}
• Future Value: ${formatCurrency(calculations.futureValue)}
• Total Appreciation: ${formatCurrency(calculations.totalAppreciation)} (${formatPercent(calculations.percentageGain)})
Generated by SolveIt Calculator`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const applyPreset = (preset: Preset) => {
    setInitialValue(preset.initialValue);
    setAppreciationRate(preset.rate);
    setRateUnit(preset.rateUnit);
    setPeriod(preset.period);
    setPeriodUnit(preset.periodUnit);
    setCompounding(preset.compounding);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 py-4">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="text-sm text-slate-500 dark:text-slate-400">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/finance" className="hover:text-primary transition-colors">
              Finance
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-slate-900 dark:text-white font-medium">Appreciation Calculator</li>
        </ol>
      </nav>

      {/* Hero Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 text-primary text-sm font-semibold">
          <Building2 className="w-4 h-4" />
          <span>Real Estate, Assets &amp; Investment Valuation</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Appreciation Calculator
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          Calculate the expected future value, total capital gain, and percentage appreciation of real estate, homes, collectibles, or investments over any timeframe with compounding interest controls.
        </p>
      </div>

      {/* Quick Scenario Presets */}
      <div className="space-y-2">
        <div className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-primary" />
          <span>Quick Benchmark Presets:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyPreset(p)}
              className="px-3.5 py-1.5 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-800 bg-surface-container-lowest hover:bg-surface-container-low hover:border-primary/50 text-slate-700 dark:text-slate-300 transition-all text-left"
              title={p.description}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-6 p-6 sm:p-7 rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-outline-variant">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span>Asset Valuation Inputs</span>
            </h2>
            <button
              type="button"
              onClick={() => {
                setInitialValue(100000);
                setAppreciationRate(4.0);
                setRateUnit('year');
                setPeriod(10);
                setPeriodUnit('year');
                setCompounding('annual');
                setAdjustInflation(false);
              }}
              className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* Initial Value Input */}
          <div className="space-y-2">
            <label htmlFor="initial-value" className="block text-base font-semibold text-slate-800 dark:text-slate-200">
              Initial Value (Starting Principal)
            </label>
            <div className="relative rounded-xl shadow-xs">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-mono text-lg">
                $
              </span>
              <input
                id="initial-value"
                type="number"
                min="0"
                step="5000"
                value={initialValue === 0 ? '' : initialValue}
                onChange={(e) => setInitialValue(Math.max(0, Number(e.target.value)))}
                placeholder="100000"
                className="block w-full pl-9 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-surface-container-low text-slate-900 dark:text-white font-mono text-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              />
            </div>
            {/* Quick amount shortcuts */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[50000, 100000, 250000, 500000, 1000000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setInitialValue(amt)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md border transition-colors ${
                    initialValue === amt
                      ? 'bg-primary text-on-primary border-primary'
                      : 'bg-surface-container-low border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-primary/50'
                  }`}
                >
                  ${(amt / 1000).toFixed(0)}k
                </button>
              ))}
            </div>
          </div>

          {/* Appreciation Rate Input & Frequency */}
          <div className="space-y-2">
            <label htmlFor="appreciation-rate" className="block text-base font-semibold text-slate-800 dark:text-slate-200">
              Appreciation Rate
            </label>
            <div className="flex rounded-xl shadow-xs">
              <div className="relative flex-1">
                <input
                  id="appreciation-rate"
                  type="number"
                  min="-100"
                  max="1000"
                  step="0.1"
                  value={appreciationRate}
                  onChange={(e) => setAppreciationRate(Number(e.target.value))}
                  className="block w-full pl-4 pr-9 py-3 rounded-l-xl border border-r-0 border-slate-300 dark:border-slate-700 bg-surface-container-low text-slate-900 dark:text-white font-mono text-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                />
                <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400 font-mono text-base">
                  %
                </span>
              </div>
              <select
                aria-label="Appreciation Rate Frequency"
                value={rateUnit}
                onChange={(e) => setRateUnit(e.target.value as 'year' | 'month')}
                className="px-4 py-3 rounded-r-xl border border-slate-300 dark:border-slate-700 bg-surface-container border-l-0 text-slate-800 dark:text-slate-200 font-medium text-base outline-none cursor-pointer hover:bg-surface-container-high transition-colors"
              >
                <option value="year">% per year</option>
                <option value="month">% per month</option>
              </select>
            </div>
          </div>

          {/* Time Period & Unit */}
          <div className="space-y-2">
            <label htmlFor="time-period" className="block text-base font-semibold text-slate-800 dark:text-slate-200">
              Time Period (Horizon)
            </label>
            <div className="flex rounded-xl shadow-xs">
              <input
                id="time-period"
                type="number"
                min="1"
                max="100"
                step="1"
                value={period}
                onChange={(e) => setPeriod(Math.max(1, Number(e.target.value)))}
                className="block w-full px-4 py-3 rounded-l-xl border border-r-0 border-slate-300 dark:border-slate-700 bg-surface-container-low text-slate-900 dark:text-white font-mono text-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              />
              <select
                aria-label="Time Period Unit"
                value={periodUnit}
                onChange={(e) => setPeriodUnit(e.target.value as 'year' | 'month')}
                className="px-4 py-3 rounded-r-xl border border-slate-300 dark:border-slate-700 bg-surface-container border-l-0 text-slate-800 dark:text-slate-200 font-medium text-base outline-none cursor-pointer hover:bg-surface-container-high transition-colors"
              >
                <option value="year">Years</option>
                <option value="month">Months</option>
              </select>
            </div>
          </div>

          {/* Compounding Frequency */}
          <div className="space-y-2">
            <label htmlFor="compounding-freq" className="block text-base font-semibold text-slate-800 dark:text-slate-200">
              Compounding Frequency
            </label>
            <select
              id="compounding-freq"
              value={compounding}
              onChange={(e) => setCompounding(e.target.value as any)}
              className="block w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-surface-container-low text-slate-900 dark:text-white font-medium text-base outline-none cursor-pointer focus:ring-2 focus:ring-primary transition-all"
            >
              <option value="annual">Annually (Once per year - Standard Real Estate)</option>
              <option value="semi-annual">Semi-Annually (2 times per year)</option>
              <option value="quarterly">Quarterly (4 times per year)</option>
              <option value="monthly">Monthly (12 times per year)</option>
              <option value="continuous">Continuously Compounded</option>
            </select>
          </div>

          {/* Optional Inflation Adjustment Toggle */}
          <div className="pt-2 border-t border-outline-variant space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  Adjust for Inflation (Purchasing Power)
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Compute real inflation-adjusted valuation
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={adjustInflation}
                onClick={() => setAdjustInflation(!adjustInflation)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  adjustInflation ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    adjustInflation ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {adjustInflation && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low border border-outline-variant">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Annual Inflation Rate:
                </span>
                <div className="relative w-28">
                  <input
                    type="number"
                    min="0"
                    max="50"
                    step="0.1"
                    value={inflationRate}
                    onChange={(e) => setInflationRate(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-surface-container font-mono text-sm text-right pr-6"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-mono">
                    %
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Results Card & Highlights (Inch Calculator Style) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Primary Result Container */}
          <div className="p-6 sm:p-7 rounded-2xl bg-surface-container-lowest border-2 border-primary/30 shadow-md space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant">
              <div className="text-sm font-extrabold uppercase tracking-wider text-primary">
                Results: Future Asset Value
              </div>
              <button
                type="button"
                onClick={handleCopySummary}
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline-variant text-slate-700 dark:text-slate-300 transition-colors"
                title="Copy Calculation Summary"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
              </button>
            </div>

            {/* Primary Future Value Display */}
            <div className="p-5 sm:p-6 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/60 space-y-1">
              <div className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400">
                Future Value after {period} {periodUnit}{period > 1 ? 's' : ''}:
              </div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-mono font-black text-primary tracking-tight">
                {formatCurrency(calculations.futureValue)}
              </div>
              <div className="pt-2 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/70 px-2 py-0.5 rounded">
                  <TrendingUp className="w-3.5 h-3.5" />
                  {formatPercent(calculations.percentageGain)}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Total capital increase over initial baseline
                </span>
              </div>
            </div>

            {/* Secondary Metrics Grid */}
            <div className="grid grid-cols-2 gap-3.5">
              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant space-y-1">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Total Appreciation Gain
                </div>
                <div className="text-xl sm:text-2xl font-mono font-bold text-slate-900 dark:text-white">
                  {formatCurrency(calculations.totalAppreciation)}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Gross profit without sales deductions
                </div>
              </div>

              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant space-y-1">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Compound Annual Growth (CAGR)
                </div>
                <div className="text-xl sm:text-2xl font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {calculations.cagr.toFixed(2)}%
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Annualized effective growth rate
                </div>
              </div>

              <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant space-y-1">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Starting Principal
                </div>
                <div className="text-xl font-mono font-semibold text-slate-700 dark:text-slate-300">
                  {formatCurrency(initialValue)}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Initial capital invested / paid
                </div>
              </div>

              {adjustInflation ? (
                <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant space-y-1">
                  <div className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                    Real Value (Inflation-Adjusted)
                  </div>
                  <div className="text-xl font-mono font-bold text-amber-600 dark:text-amber-400">
                    {formatCurrency(calculations.realFutureValue)}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    At {inflationRate}% annual inflation
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant space-y-1">
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Gain Ratio
                  </div>
                  <div className="text-xl font-mono font-semibold text-slate-700 dark:text-slate-300">
                    {(calculations.futureValue / Math.max(1, initialValue)).toFixed(2)}×
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Multiplier on initial capital
                  </div>
                </div>
              )}
            </div>

            {/* Quick Summary Statement */}
            <div className="p-4 rounded-xl bg-surface-container text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              An asset valued at <strong className="text-slate-900 dark:text-white">{formatCurrency(initialValue)}</strong> appreciating at a rate of <strong className="text-slate-900 dark:text-white">{appreciationRate}% per {rateUnit}</strong> will grow by <strong className="text-emerald-600 dark:text-emerald-400">{formatCurrency(calculations.totalAppreciation)}</strong> over <strong className="text-slate-900 dark:text-white">{period} {periodUnit}{period > 1 ? 's' : ''}</strong>, reaching a total valuation of <strong className="text-primary">{formatCurrency(calculations.futureValue)}</strong>.
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Visual Progression Chart */}
      {calculations.schedule.length > 0 && (
        <div className="p-6 sm:p-7 rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-sm space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Appreciation Trajectory Over Time
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Visualizing baseline principal versus cumulative accrued capital gains
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-slate-400 dark:bg-slate-600" />
                <span className="text-slate-600 dark:text-slate-400">Starting Value</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-primary" />
                <span className="text-slate-600 dark:text-slate-400">Accrued Appreciation</span>
              </span>
            </div>
          </div>

          {/* Simple Clean Responsive SVG Bar Chart */}
          <div className="w-full pt-4 overflow-x-auto">
            <div className="min-w-[500px] h-64 flex items-end gap-2 pb-6 border-b border-slate-200 dark:border-slate-800">
              {calculations.schedule.map((row) => {
                const maxVal = calculations.futureValue * 1.05;
                const principalHeight = Math.max(8, (initialValue / maxVal) * 100);
                const appreciationHeight = Math.max(
                  0,
                  ((row.endValue - initialValue) / maxVal) * 100
                );

                return (
                  <div key={row.periodNumber} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full mb-2 z-20 pointer-events-none p-2 rounded-lg bg-slate-900 text-white text-xs shadow-lg font-mono whitespace-nowrap">
                      <div>Year {row.periodNumber}: {formatCurrency(row.endValue)}</div>
                      <div className="text-emerald-400">+{formatCurrency(row.cumulativeGain)} (+{row.percentGain.toFixed(1)}%)</div>
                    </div>

                    <div className="w-full flex flex-col-reverse justify-start rounded-t-md overflow-hidden bg-slate-100 dark:bg-slate-800/40">
                      {/* Principal base */}
                      <div
                        style={{ height: `${principalHeight}%` }}
                        className="w-full bg-slate-300 dark:bg-slate-700 transition-all duration-300"
                      />
                      {/* Appreciation growth */}
                      <div
                        style={{ height: `${appreciationHeight}%` }}
                        className="w-full bg-primary/80 group-hover:bg-primary transition-all duration-300"
                      />
                    </div>
                    <div className="mt-2 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                      Y{row.periodNumber}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Period-by-Period Schedule Breakdown Table */}
      {calculations.schedule.length > 0 && (
        <div className="p-6 sm:p-7 rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Year-by-Year Appreciation Schedule
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Detailed compounding breakdown for each calendar year
              </p>
            </div>
            {calculations.schedule.length > 10 && (
              <button
                type="button"
                onClick={() => setScheduleViewLimit(scheduleViewLimit === 10 ? calculations.schedule.length : 10)}
                className="text-xs font-semibold text-primary hover:underline"
              >
                {scheduleViewLimit === 10 ? `Show All ${calculations.schedule.length} Years` : 'Show First 10 Years'}
              </button>
            )}
          </div>

          <div className="overflow-x-auto rounded-xl border border-outline-variant">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-surface-container border-b border-outline-variant text-slate-700 dark:text-slate-300 font-semibold">
                  <th className="py-3 px-4">Period</th>
                  <th className="py-3 px-4">Starting Value</th>
                  <th className="py-3 px-4">Annual Growth</th>
                  <th className="py-3 px-4">Ending Value</th>
                  <th className="py-3 px-4">Total Accrued Gain</th>
                  <th className="py-3 px-4 text-right">Cumulative %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant font-mono">
                {calculations.schedule.slice(0, scheduleViewLimit).map((row) => (
                  <tr
                    key={row.periodNumber}
                    className="hover:bg-surface-container-low transition-colors text-slate-800 dark:text-slate-200"
                  >
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      Year {row.periodNumber}
                    </td>
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                      {formatCurrency(row.startValue)}
                    </td>
                    <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-semibold">
                      +{formatCurrency(row.gain)}
                    </td>
                    <td className="py-3 px-4 font-bold text-primary">
                      {formatCurrency(row.endValue)}
                    </td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                      +{formatCurrency(row.cumulativeGain)}
                    </td>
                    <td className="py-3 px-4 text-right text-emerald-600 dark:text-emerald-400 font-semibold">
                      +{row.percentGain.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Step-by-Step Educational Guide & Formula Section (Directly matching Inch Calculator) */}
      <div className="p-6 sm:p-8 rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-sm space-y-6">
        <div className="space-y-2 pb-4 border-b border-outline-variant">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            <span>How to Calculate Asset Appreciation</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Appreciation is the increase in the value of an asset or property over time due to inflation, demand, market expansion, or physical improvements.
          </p>
        </div>

        {/* Formula Display Box */}
        <div className="p-5 sm:p-6 rounded-xl bg-surface-container-low border border-outline-variant space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            The Standard Appreciation Formula
          </div>
          <div className="p-4 rounded-lg bg-surface-container font-mono text-base sm:text-lg text-slate-900 dark:text-white font-bold overflow-x-auto text-center">
            Future Value = Initial Value × (1 + r)<sup>t</sup>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Where <strong className="text-slate-900 dark:text-white">r</strong> is the appreciation rate per period (as a decimal) and <strong className="text-slate-900 dark:text-white">t</strong> is the total number of compounding periods (years or months).
          </p>
        </div>

        {/* Step-by-Step Walkthrough */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            5 Simple Steps to Find Appreciation
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant space-y-1.5">
              <div className="text-xs font-bold text-primary">Step 1</div>
              <div className="font-semibold text-slate-900 dark:text-white">Find Starting Baseline Value</div>
              <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Determine your initial purchase price, appraisal valuation, or starting asset cost (e.g. $100,000).
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant space-y-1.5">
              <div className="text-xs font-bold text-primary">Step 2</div>
              <div className="font-semibold text-slate-900 dark:text-white">Convert Rate to a Decimal</div>
              <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Divide your annual percentage growth rate by 100. For instance, a 4% appreciation rate becomes 0.04.
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant space-y-1.5">
              <div className="text-xs font-bold text-primary">Step 3</div>
              <div className="font-semibold text-slate-900 dark:text-white">Calculate Growth Multiplier</div>
              <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Add 1 to your rate decimal: (1 + 0.04) = 1.04. Raise this value to the power of years: 1.04<sup>10</sup> ≈ 1.48024.
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant space-y-1.5">
              <div className="text-xs font-bold text-primary">Step 4</div>
              <div className="font-semibold text-slate-900 dark:text-white">Multiply by Starting Value</div>
              <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                $100,000 × 1.48024 = $148,024.43. This is your future projected valuation.
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant space-y-1.5">
            <div className="text-xs font-bold text-primary">Step 5</div>
            <div className="font-semibold text-slate-900 dark:text-white">Subtract Initial Principal for Gain</div>
            <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Total Gain = $148,024.43 - $100,000.00 = <strong>+$48,024.43</strong> (+48.02% total return).
            </div>
          </div>
        </div>

        {/* Real Estate Considerations Callout */}
        <div className="p-5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
          <div className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Key Factors Influencing Real Estate &amp; Asset Appreciation</span>
          </div>
          <ul className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-1.5 list-disc pl-5 leading-relaxed">
            <li><strong>Location &amp; Demographics:</strong> Neighborhood desirability, school ratings, and transit access remain the strongest drivers of residential real estate appreciation.</li>
            <li><strong>Economic Cycles &amp; Interest Rates:</strong> Mortgage interest rates and local job market growth significantly dictate buyer purchasing power and short-term price velocity.</li>
            <li><strong>Inflation &amp; Replacement Costs:</strong> When building materials and labor costs surge, existing property valuations typically appreciate to match replacement value.</li>
            <li><strong>Maintenance &amp; Upgrades:</strong> A portion of realized home value appreciation comes from active maintenance, energy renovations, and structural capital improvements.</li>
          </ul>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="p-6 sm:p-8 rounded-2xl bg-surface-container-lowest border border-outline-variant shadow-sm space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-primary" />
          <span>Frequently Asked Questions</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
          <div className="space-y-1.5">
            <h4 className="font-bold text-slate-900 dark:text-white">
              What is the average annual home appreciation in the United States?
            </h4>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-xs sm:text-sm">
              Historically, residential real estate in the US has appreciated between 3.8% and 4.5% per year over multi-decade cycles, tracking roughly 1.5% to 2.0% above general CPI inflation.
            </p>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-bold text-slate-900 dark:text-white">
              What is the difference between nominal and real appreciation?
            </h4>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-xs sm:text-sm">
              Nominal appreciation is the raw dollar increase in asset value. Real appreciation accounts for inflation, reflecting the true growth in real purchasing power over time.
            </p>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-bold text-slate-900 dark:text-white">
              Does appreciation compound on a monthly or annual basis?
            </h4>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-xs sm:text-sm">
              While real estate prices fluctuate continuously, annual compounding is the standard industry benchmark for multi-year property and asset valuation projections.
            </p>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-bold text-slate-900 dark:text-white">
              Can assets experience negative appreciation (depreciation)?
            </h4>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-xs sm:text-sm">
              Yes. If market demand decreases, economic conditions contract, or physical wear occurs (like automobiles or machinery), the rate is negative and represents asset depreciation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
