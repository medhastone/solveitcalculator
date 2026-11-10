'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Building2,
  Calculator,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  FileText,
  Globe,
  Info,
  Lock,
  Percent,
  RefreshCw,
  Scale,
  ShieldCheck,
  Wallet,
} from 'lucide-react';
import {
  INDIA_TAX_REGIME_OPTIONS,
  JURISDICTION_LIST,
  JURISDICTION_MODULES,
  PAY_FREQUENCY_OPTIONS,
  US_FILING_STATUS_OPTIONS,
  type IndiaTaxRegime,
  type JurisdictionId,
  type PayFrequency,
  type USFilingStatus,
} from '@/lib/salaryTaxData';
import {
  calculateSalaryTakeHome,
  formatCurrencyAmount as baseFormatCurrencyAmount,
} from '@/lib/salaryTaxEngine';
import { useCurrency, formatWithGlobalCurrency } from '@/lib/currency';
import GlobalFinanceCurrencyBar from '@/components/finance-suite/GlobalFinanceCurrencyBar';

export default function SalaryCalculatorClient() {
  const { currency: globalCurrency, applyExchangeRate } = useCurrency();
  const [jurisdictionId, setJurisdictionId] = useState<JurisdictionId>('us');
  const [taxYearId, setTaxYearId] = useState<string>(
    JURISDICTION_MODULES.us.defaultTaxYearId
  );
  const [grossInput, setGrossInput] = useState<string>(
    String(
      JURISDICTION_MODULES.us.taxYears[JURISDICTION_MODULES.us.defaultTaxYearId]
        .defaultGrossAnnual
    )
  );
  const [payFrequency, setPayFrequency] = useState<PayFrequency>('annual');
  const [displayFrequency, setDisplayFrequency] =
    useState<PayFrequency>('monthly');
  const [usFilingStatus, setUsFilingStatus] =
    useState<USFilingStatus>('single');
  const [indiaTaxRegime, setIndiaTaxRegime] =
    useState<IndiaTaxRegime>('new_regime');
  const [preTaxPensionInput, setPreTaxPensionInput] = useState<string>('0');
  const [lastCalculatedAt, setLastCalculatedAt] = useState<string | null>(null);

  const activeJurisdiction = JURISDICTION_MODULES[jurisdictionId];
  const availableTaxYears = Object.values(activeJurisdiction.taxYears);
  const activeTaxYearConfig =
    activeJurisdiction.taxYears[taxYearId] ??
    activeJurisdiction.taxYears[activeJurisdiction.defaultTaxYearId];

  const handleJurisdictionChange = (nextId: JurisdictionId) => {
    const nextMod = JURISDICTION_MODULES[nextId];
    const nextDefaultYear = nextMod.defaultTaxYearId;
    const nextYearCfg = nextMod.taxYears[nextDefaultYear];
    const freqPeriods =
      PAY_FREQUENCY_OPTIONS.find((f) => f.id === payFrequency)
        ?.periodsPerYear ?? 1;
    const defaultForFrequency = Math.round(
      nextYearCfg.defaultGrossAnnual / freqPeriods
    );

    setJurisdictionId(nextId);
    setTaxYearId(nextDefaultYear);
    setGrossInput(String(defaultForFrequency));
    setPreTaxPensionInput('0');
  };

  const handleFrequencyChange = (nextFreq: PayFrequency) => {
    const currentPeriods =
      PAY_FREQUENCY_OPTIONS.find((f) => f.id === payFrequency)
        ?.periodsPerYear ?? 1;
    const nextPeriods =
      PAY_FREQUENCY_OPTIONS.find((f) => f.id === nextFreq)?.periodsPerYear ?? 1;
    const parsedGross = Number(grossInput);
    if (Number.isFinite(parsedGross) && parsedGross >= 0) {
      const annualized = parsedGross * currentPeriods;
      const converted =
        jurisdictionId === 'in'
          ? Math.round(annualized / nextPeriods)
          : Math.round((annualized / nextPeriods) * 100) / 100;
      setGrossInput(String(converted));
    }
    setPayFrequency(nextFreq);
    setDisplayFrequency(nextFreq === 'annual' ? 'monthly' : nextFreq);
  };

  const parsedGross = grossInput.trim() === '' ? NaN : Number(grossInput);
  const parsedPension =
    preTaxPensionInput.trim() === '' ? 0 : Number(preTaxPensionInput);

  const result = useMemo(() => {
    return calculateSalaryTakeHome({
      jurisdictionId,
      taxYearId: activeTaxYearConfig.taxYearId,
      grossAmount: parsedGross,
      payFrequency,
      usFilingStatus:
        activeTaxYearConfig.fieldSupport.supportsFilingStatus
          ? usFilingStatus
          : undefined,
      indiaTaxRegime:
        activeTaxYearConfig.fieldSupport.supportsTaxRegime
          ? indiaTaxRegime
          : undefined,
      preTaxPensionPercent:
        activeTaxYearConfig.fieldSupport.supportsPreTaxPension
          ? parsedPension
          : 0,
    });
  }, [
    jurisdictionId,
    activeTaxYearConfig.taxYearId,
    activeTaxYearConfig.fieldSupport.supportsFilingStatus,
    activeTaxYearConfig.fieldSupport.supportsTaxRegime,
    activeTaxYearConfig.fieldSupport.supportsPreTaxPension,
    parsedGross,
    payFrequency,
    usFilingStatus,
    indiaTaxRegime,
    parsedPension,
  ]);

  const handleCalculateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLastCalculatedAt(new Date().toLocaleTimeString());
  };

  const handleReset = () => {
    const defaultAnnual = activeTaxYearConfig.defaultGrossAnnual;
    setPayFrequency('annual');
    setDisplayFrequency('monthly');
    setGrossInput(String(defaultAnnual));
    setPreTaxPensionInput('0');
    setUsFilingStatus('single');
    setIndiaTaxRegime('new_regime');
    setLastCalculatedAt(null);
  };

  const activePeriodRow = result.ok
    ? result.periodBreakdowns[displayFrequency]
    : null;

  const formatCurrencyAmount = (
    amount: number,
    jurId: JurisdictionId,
    options?: { maximumFractionDigits?: number }
  ) => {
    const mod = JURISDICTION_MODULES[jurId];
    if (!applyExchangeRate && mod.currencyCode === globalCurrency) {
      return baseFormatCurrencyAmount(amount, jurId, options);
    }
    const maxDecimals =
      options?.maximumFractionDigits ?? (globalCurrency === 'INR' ? 0 : 0);
    return formatWithGlobalCurrency(amount, {
      fromCurrency: mod.currencyCode,
      decimals: maxDecimals,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-8">
      <GlobalFinanceCurrencyBar />
      <div className="max-w-7xl mx-auto space-y-8 pt-6 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-400"
        >
          <Link
            href="/"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Home
          </Link>
          <ChevronRight className="w-4 h-4 text-slate-400" />
          <Link
            href="/finance"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Finance Calculators
          </Link>
          <ChevronRight className="w-4 h-4 text-slate-400" />
          <span className="font-medium text-slate-900 dark:text-slate-100">
            Country-Specific Salary & Take-Home Pay Calculator
          </span>
        </nav>

        {/* Header */}
        <header className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider">
                <Globe className="w-3.5 h-3.5" />
                Verified Multi-Jurisdiction Tax Engine
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                Salary & Take-Home Pay Calculator
              </h1>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                Estimate gross-to-net take-home pay for supported countries
                using official statutory income tax brackets, standard
                allowances, and mandatory payroll contributions—with complete
                transparency on every assumption and exclusion.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/70 text-emerald-800 dark:text-emerald-200 text-xs sm:text-sm">
                <Lock className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>
                  <strong>100% Private:</strong> Salary inputs are calculated
                  locally in your browser and never leave your device.
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Grid: Input Form + Results */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start lg:items-stretch">
          {/* Left Column: Inputs + Quick Benchmark Presets */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
          <section
            aria-label="Salary Calculator Inputs"
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6"
          >
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <Calculator className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Jurisdiction & Salary Details
                </h2>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>

            <form onSubmit={handleCalculateSubmit} className="space-y-5">
              {/* Country / Jurisdiction Selector */}
              <div>
                <label
                  htmlFor="salary-jurisdiction"
                  className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5"
                >
                  Country / Jurisdiction
                </label>
                <select
                  id="salary-jurisdiction"
                  value={jurisdictionId}
                  onChange={(e) =>
                    handleJurisdictionChange(e.target.value as JurisdictionId)
                  }
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {JURISDICTION_LIST.map((jur) => (
                    <option key={jur.id} value={jur.id}>
                      {jur.countryName} ({jur.currencyCode} {jur.currencySymbol}
                      )
                    </option>
                  ))}
                </select>
                <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                  Scope: {activeJurisdiction.regionScopeLabel}
                </p>
              </div>

              {/* Tax Year Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="salary-tax-year"
                    className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5"
                  >
                    Tax Year
                  </label>
                  <select
                    id="salary-tax-year"
                    value={activeTaxYearConfig.taxYearId}
                    onChange={(e) => setTaxYearId(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {availableTaxYears.map((yr) => (
                      <option key={yr.taxYearId} value={yr.taxYearId}>
                        {yr.taxYearLabel}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="salary-pay-frequency"
                    className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5"
                  >
                    Pay Frequency
                  </label>
                  <select
                    id="salary-pay-frequency"
                    value={payFrequency}
                    onChange={(e) =>
                      handleFrequencyChange(e.target.value as PayFrequency)
                    }
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {PAY_FREQUENCY_OPTIONS.map((freq) => (
                      <option key={freq.id} value={freq.id}>
                        {freq.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Gross Income Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="salary-gross-amount"
                    className="block text-sm font-semibold text-slate-800 dark:text-slate-200"
                  >
                    Gross{' '}
                    {payFrequency === 'annual'
                      ? 'Annual'
                      : payFrequency === 'monthly'
                        ? 'Monthly'
                        : payFrequency === 'biweekly'
                          ? 'Bi-Weekly'
                          : 'Weekly'}{' '}
                    Income
                  </label>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    Currency: {activeJurisdiction.currencyCode} (
                    {activeJurisdiction.currencySymbol})
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-sm font-semibold text-slate-500 dark:text-slate-400 pointer-events-none">
                    {activeJurisdiction.currencySymbol}
                  </span>
                  <input
                    id="salary-gross-amount"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="any"
                    value={grossInput}
                    onChange={(e) => setGrossInput(e.target.value)}
                    placeholder="Enter gross pay"
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 pl-10 pr-4 py-2.5 text-base font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Jurisdiction-Specific Field: US Filing Status (Only displayed when US is selected) */}
              {activeTaxYearConfig.fieldSupport.supportsFilingStatus && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
                  <label
                    htmlFor="us-filing-status"
                    className="block text-sm font-semibold text-slate-800 dark:text-slate-200"
                  >
                    IRS Federal Filing Status
                  </label>
                  <select
                    id="us-filing-status"
                    value={usFilingStatus}
                    onChange={(e) =>
                      setUsFilingStatus(e.target.value as USFilingStatus)
                    }
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {US_FILING_STATUS_OPTIONS.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Determines your IRS Standard Deduction, progressive tax
                    bracket thresholds, and Additional Medicare Tax threshold.
                  </p>
                </div>
              )}

              {/* Jurisdiction-Specific Field: India Tax Regime (Only displayed when India is selected) */}
              {activeTaxYearConfig.fieldSupport.supportsTaxRegime && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2.5">
                  <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Income Tax Regime (India)
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {INDIA_TAX_REGIME_OPTIONS.map((opt) => {
                      const active = indiaTaxRegime === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setIndiaTaxRegime(opt.id)}
                          className={`text-left p-3 rounded-xl border transition-all ${
                            active
                              ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/50 dark:border-blue-500 text-slate-900 dark:text-white'
                              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-semibold">
                              {opt.label}
                            </span>
                            <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-200/80 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                              {opt.badge}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Jurisdiction-Specific Optional Pre-Tax Pension Contribution */}
              {activeTaxYearConfig.fieldSupport.supportsPreTaxPension && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="salary-pretax-pension"
                      className="block text-sm font-semibold text-slate-800 dark:text-slate-200"
                    >
                      {activeTaxYearConfig.fieldSupport.preTaxPensionLabel}
                    </label>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Optional (0% –{' '}
                      {
                        activeTaxYearConfig.fieldSupport
                          .preTaxPensionMaxRatePercent
                      }
                      %)
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      id="salary-pretax-pension"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      max={
                        activeTaxYearConfig.fieldSupport
                          .preTaxPensionMaxRatePercent
                      }
                      step="0.5"
                      value={preTaxPensionInput}
                      onChange={(e) => setPreTaxPensionInput(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 pr-10 py-2 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-sm font-semibold text-slate-500 dark:text-slate-400 pointer-events-none">
                      %
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {activeTaxYearConfig.fieldSupport.preTaxPensionDescription}
                  </p>
                </div>
              )}

              {/* Calculate Button */}
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-5 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <Calculator className="w-4 h-4" />
                Calculate Net Take-Home Pay
              </button>

              {lastCalculatedAt && (
                <p className="text-center text-xs text-slate-500 dark:text-slate-400">
                  Estimate updated at {lastCalculatedAt} (
                  {activeTaxYearConfig.taxYearLabel})
                </p>
              )}
            </form>

            {/* Verification Badge */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{activeTaxYearConfig.verificationStatus}</span>
              </div>
              <p>
                Effective Period: {activeTaxYearConfig.effectivePeriodLabel} •
                Verified: {activeTaxYearConfig.verifiedDate}
              </p>
            </div>
          </section>

          {/* Left-Column Companion Card to Balance Height with Right Results Column */}
          <section
            aria-label="Quick salary benchmarks and statutory scope"
            className="hidden lg:flex bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex-1 flex-col gap-4"
          >
            <div className="space-y-3">
              <div className="text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Quick {activeJurisdiction.countryName} Salary Benchmarks
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Click any annual gross salary preset below to load its progressive tax and take-home pay breakdown:
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {(jurisdictionId === 'in'
                  ? [800000, 1200000, 1800000, 2500000]
                  : [50000, 75000, 100000, 150000]
                ).map((presetAmt) => (
                  <button
                    key={presetAmt}
                    type="button"
                    onClick={() => {
                      setPayFrequency('annual');
                      setGrossInput(String(presetAmt));
                    }}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:border-blue-500 text-left transition-colors cursor-pointer"
                  >
                    <div className="text-xs font-bold text-slate-900 dark:text-white tabular-nums">
                      {formatCurrencyAmount(presetAmt, jurisdictionId)}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      Annual Gross Preset
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-4 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <div className="font-bold text-slate-900 dark:text-white">
                Statutory Calculation Scope ({activeTaxYearConfig.taxYearLabel})
              </div>
              <p className="leading-relaxed">
                Includes {activeJurisdiction.regionScopeLabel} progressive income tax brackets and mandatory employee social contributions.
              </p>
            </div>
          </section>
          </div>

          {/* Right Column: Calculation Results */}
          <section
            aria-label="Salary Calculation Results"
            className="lg:col-span-7 space-y-6 min-h-[540px]"
          >
            {!result.ok ? (
              <div className="space-y-6 min-h-[540px] flex flex-col justify-between">
                <div
                  role="alert"
                  className="bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded-2xl p-5 flex items-start gap-3 text-amber-900 dark:text-amber-200"
                >
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm sm:text-base">
                      Awaiting Valid Gross Income Input
                    </h3>
                    <p className="text-xs sm:text-sm">{result.errorMessage}</p>
                  </div>
                </div>

                {/* Persistent Placeholder Result Card to Prevent Right-Side Layout Collapse */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-sm space-y-6 flex-1 flex flex-col justify-between min-h-[420px]">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Estimated Net Take-Home Pay ({activeJurisdiction.countryName})
                      </span>
                      <div className="mt-1 flex items-baseline gap-3">
                        <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-400 dark:text-slate-600 tabular-nums select-none">
                          {activeJurisdiction.currencySymbol}—
                        </span>
                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                          /{' '}
                          {displayFrequency === 'annual'
                            ? 'year'
                            : displayFrequency === 'monthly'
                              ? 'month'
                              : displayFrequency === 'biweekly'
                                ? 'bi-weekly paycheck'
                                : 'week'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      'Gross Income (Annual)',
                      'Estimated Income Tax',
                      'Statutory Deductions',
                      'Net Take-Home Ratio',
                    ].map((label) => (
                      <div
                        key={label}
                        className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/70"
                      >
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          {label}
                        </p>
                        <p className="mt-1 text-lg font-bold text-slate-400 dark:text-slate-500 tabular-nums">
                          —
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-4 text-xs text-slate-600 dark:text-slate-400">
                    Enter a positive gross salary amount on the left to compute your{' '}
                    <strong>{activeTaxYearConfig.taxYearLabel}</strong> progressive tax brackets, statutory deductions, and net paycheck schedule across annual, monthly, bi-weekly, and weekly pay periods.
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Primary Net Pay Hero Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-sm space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                        Estimated Net Take-Home Pay (
                        {activeJurisdiction.countryName})
                      </span>
                      <div className="mt-1 flex items-baseline gap-3">
                        <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400">
                          {activePeriodRow
                            ? formatCurrencyAmount(
                                activePeriodRow.netPay,
                                jurisdictionId
                              )
                            : formatCurrencyAmount(
                                result.netPayAnnual,
                                jurisdictionId
                              )}
                        </span>
                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                          /{' '}
                          {displayFrequency === 'annual'
                            ? 'year'
                            : displayFrequency === 'monthly'
                              ? 'month'
                              : displayFrequency === 'biweekly'
                                ? 'bi-weekly paycheck'
                                : 'week'}
                        </span>
                      </div>
                    </div>

                    {/* Display Frequency Switcher */}
                    <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 self-start">
                      {(
                        [
                          'annual',
                          'monthly',
                          'biweekly',
                          'weekly',
                        ] as PayFrequency[]
                      ).map((freq) => (
                        <button
                          key={freq}
                          type="button"
                          onClick={() => setDisplayFrequency(freq)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                            displayFrequency === freq
                              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          {freq === 'annual'
                            ? 'Annual'
                            : freq === 'monthly'
                              ? 'Monthly'
                              : freq === 'biweekly'
                                ? 'Bi-Weekly'
                                : 'Weekly'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Summary Metrics Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/70">
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        Gross Income (Annual)
                      </p>
                      <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                        {formatCurrencyAmount(
                          result.grossAnnual,
                          jurisdictionId
                        )}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        Taxable:{' '}
                        {formatCurrencyAmount(
                          result.taxableIncomeAnnual,
                          jurisdictionId
                        )}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/70">
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        Estimated Income Tax
                      </p>
                      <p className="mt-1 text-lg font-bold text-rose-600 dark:text-rose-400">
                        {formatCurrencyAmount(
                          result.incomeTaxAnnual,
                          jurisdictionId
                        )}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        {result.effectiveIncomeTaxOnlyRatePercent}% of gross
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/70">
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        Statutory Deductions
                      </p>
                      <p className="mt-1 text-lg font-bold text-amber-600 dark:text-amber-400">
                        {formatCurrencyAmount(
                          result.socialContributionsAnnual,
                          jurisdictionId
                        )}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        {jurisdictionId === 'us'
                          ? 'FICA (SS + Medicare)'
                          : jurisdictionId === 'uk'
                            ? 'Class 1 Employee NI'
                            : jurisdictionId === 'ca'
                              ? 'CPP + EI Premiums'
                              : jurisdictionId === 'au'
                                ? 'Medicare Levy'
                                : '4% Health & Ed. Cess'}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/70">
                      <p className="text-xs font-medium text-emerald-800 dark:text-emerald-300">
                        Net Take-Home (Annual)
                      </p>
                      <p className="mt-1 text-lg font-bold text-emerald-700 dark:text-emerald-300">
                        {formatCurrencyAmount(
                          result.netPayAnnual,
                          jurisdictionId
                        )}
                      </p>
                      <p className="mt-0.5 text-xs text-emerald-700/90 dark:text-emerald-400">
                        {result.grossAnnual > 0
                          ? `${(
                              100 -
                              (result.totalAllDeductionsAnnual /
                                result.grossAnnual) *
                                100
                            ).toFixed(1)}% of gross retained`
                          : '0% of gross'}
                      </p>
                    </div>
                  </div>

                  {/* Effective vs Marginal Tax Rate Callout */}
                  <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                        <Percent className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span>
                          Effective Tax & Deduction Rate:{' '}
                          <span className="text-blue-700 dark:text-blue-300">
                            {result.effectiveTaxAndStatutoryRatePercent}%
                          </span>{' '}
                          vs. Marginal Income Tax Bracket:{' '}
                          <span className="text-slate-800 dark:text-slate-200">
                            {result.marginalIncomeTaxRatePercent}%
                          </span>
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        <strong>Why they differ:</strong> Your{' '}
                        <em>marginal rate</em> (
                        {result.marginalIncomeTaxRatePercent}
                        %) only applies to the top slice of your income. Because
                        lower income bands and your{' '}
                        {formatCurrencyAmount(
                          result.statutoryAllowanceOrDeductionAnnual,
                          jurisdictionId
                        )}{' '}
                        allowance/deduction are taxed at lower rates, your{' '}
                        <em>overall effective tax & statutory rate</em> is{' '}
                        {result.effectiveTaxAndStatutoryRatePercent}%.{' '}
                        {result.marginalCombinedRateNote}
                      </p>
                    </div>
                  </div>

                  {/* Itemized Deduction & Tax Breakdown */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Annual Tax & Deduction Breakdown
                    </h3>
                    <div className="divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-3 bg-slate-50/70 dark:bg-slate-800/40 text-sm">
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {result.statutoryAllowanceLabel}
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {formatCurrencyAmount(
                            result.statutoryAllowanceOrDeductionAnnual,
                            jurisdictionId
                          )}
                        </span>
                      </div>

                      {result.taxCreditsOrRebatesAnnual > 0 && (
                        <div className="flex items-center justify-between px-4 py-3 bg-emerald-50/40 dark:bg-emerald-950/20 text-sm">
                          <div>
                            <span className="font-medium text-emerald-800 dark:text-emerald-300">
                              {result.taxCreditsLabel ??
                                'Statutory Tax Credits / Rebates'}
                            </span>
                            <p className="text-xs text-emerald-700/80 dark:text-emerald-400/80">
                              Directly reduces gross bracket tax (
                              {formatCurrencyAmount(
                                result.grossBracketTaxAnnual,
                                jurisdictionId
                              )}
                              )
                            </p>
                          </div>
                          <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                            −
                            {formatCurrencyAmount(
                              result.taxCreditsOrRebatesAnnual,
                              jurisdictionId
                            )}
                          </span>
                        </div>
                      )}

                      {result.deductionLineItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-900 text-sm"
                        >
                          <div>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                              {item.label}
                            </span>
                            {item.note && (
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {item.note}
                              </p>
                            )}
                          </div>
                          <span className="font-bold text-slate-900 dark:text-white">
                            {formatCurrencyAmount(
                              item.annualAmount,
                              jurisdictionId
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Multi-Frequency Paycheck Table */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      Paycheck Breakdown by Pay Frequency
                    </h3>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      All amounts in {activeJurisdiction.currencyCode}
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-800 text-xs uppercase text-slate-500 dark:text-slate-400">
                          <th className="py-2.5 pr-4 font-semibold">Period</th>
                          <th className="py-2.5 px-3 font-semibold text-right">
                            Gross Pay
                          </th>
                          {result.preTaxPensionAnnual > 0 && (
                            <th className="py-2.5 px-3 font-semibold text-right">
                              Pre-Tax Pension
                            </th>
                          )}
                          <th className="py-2.5 px-3 font-semibold text-right">
                            Income Tax
                          </th>
                          <th className="py-2.5 px-3 font-semibold text-right">
                            Social / Statutory
                          </th>
                          <th className="py-2.5 pl-3 font-semibold text-right text-emerald-700 dark:text-emerald-400">
                            Net Take-Home
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {PAY_FREQUENCY_OPTIONS.map((freq) => {
                          const row = result.periodBreakdowns[freq.id];
                          return (
                            <tr
                              key={freq.id}
                              className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                            >
                              <td className="py-3 pr-4 font-semibold text-slate-900 dark:text-white">
                                {row.label}
                              </td>
                              <td className="py-3 px-3 text-right font-medium text-slate-700 dark:text-slate-300">
                                {formatCurrencyAmount(
                                  row.grossPay,
                                  jurisdictionId
                                )}
                              </td>
                              {result.preTaxPensionAnnual > 0 && (
                                <td className="py-3 px-3 text-right text-slate-600 dark:text-slate-400">
                                  {formatCurrencyAmount(
                                    row.preTaxPension,
                                    jurisdictionId
                                  )}
                                </td>
                              )}
                              <td className="py-3 px-3 text-right text-rose-600 dark:text-rose-400 font-medium">
                                {formatCurrencyAmount(
                                  row.incomeTax,
                                  jurisdictionId
                                )}
                              </td>
                              <td className="py-3 px-3 text-right text-amber-600 dark:text-amber-400 font-medium">
                                {formatCurrencyAmount(
                                  row.socialContributions,
                                  jurisdictionId
                                )}
                              </td>
                              <td className="py-3 pl-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                                {formatCurrencyAmount(
                                  row.netPay,
                                  jurisdictionId
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Progressive Tax Bracket Breakdown Table */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <Scale className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      Progressive Income Tax Bracket Calculation
                    </h3>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Based on{' '}
                      {formatCurrencyAmount(
                        result.taxableIncomeAnnual,
                        jurisdictionId
                      )}{' '}
                      annual taxable income
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-800 text-xs uppercase text-slate-500 dark:text-slate-400">
                          <th className="py-2.5 pr-4 font-semibold">
                            Tax Band / Slab
                          </th>
                          <th className="py-2.5 px-3 font-semibold">
                            Taxable Band Range
                          </th>
                          <th className="py-2.5 px-3 font-semibold text-right">
                            Rate
                          </th>
                          <th className="py-2.5 px-3 font-semibold text-right">
                            Income in Band
                          </th>
                          <th className="py-2.5 pl-3 font-semibold text-right">
                            Band Tax
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {result.bracketBreakdown.map((b, idx) => (
                          <tr
                            key={idx}
                            className={
                              b.taxableAmountInBracket > 0
                                ? 'bg-blue-50/30 dark:bg-blue-950/20'
                                : 'opacity-65'
                            }
                          >
                            <td className="py-2.5 pr-4 font-medium text-slate-900 dark:text-white">
                              {b.label}
                            </td>
                            <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400 text-xs">
                              {formatCurrencyAmount(b.min, jurisdictionId, {
                                maximumFractionDigits: 0,
                              })}{' '}
                              –{' '}
                              {b.max === null
                                ? 'No limit'
                                : formatCurrencyAmount(b.max, jurisdictionId, {
                                    maximumFractionDigits: 0,
                                  })}
                            </td>
                            <td className="py-2.5 px-3 text-right font-semibold text-slate-700 dark:text-slate-300">
                              {b.ratePercent}%
                            </td>
                            <td className="py-2.5 px-3 text-right text-slate-700 dark:text-slate-300">
                              {formatCurrencyAmount(
                                b.taxableAmountInBracket,
                                jurisdictionId
                              )}
                            </td>
                            <td className="py-2.5 pl-3 text-right font-bold text-slate-900 dark:text-white">
                              {formatCurrencyAmount(
                                b.taxForBracket,
                                jurisdictionId
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Step-by-Step Audit Trail */}
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      How Your Result Was Calculated
                    </h4>
                    <ol className="list-decimal list-inside space-y-1 text-xs text-slate-600 dark:text-slate-300">
                      {result.calculationSteps.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              </>
            )}
          </section>
        </div>

        {/* Assumptions, Inclusions/Exclusions & Official Sources Section */}
        <section
          aria-label="Tax Assumptions, Methodology, and Official Sources"
          className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6"
        >
          <div className="flex items-center gap-2.5 border-b border-slate-200 dark:border-slate-800 pb-4">
            <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Assumptions, Scope & Official Tax Authority Sources (
              {activeJurisdiction.countryName} —{' '}
              {activeTaxYearConfig.taxYearLabel})
            </h2>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {activeJurisdiction.summaryNote}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Key Assumptions */}
            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Jurisdiction Assumptions
              </h3>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed list-disc list-inside">
                {activeTaxYearConfig.assumptions.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Included in Estimate */}
            <div className="p-5 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/60 space-y-3">
              <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Included in This Calculation
              </h3>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed list-disc list-inside">
                {activeTaxYearConfig.includedItems.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Excluded from Estimate */}
            <div className="p-5 rounded-xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/60 space-y-3">
              <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                Excluded / Not Modeled
              </h3>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed list-disc list-inside">
                {activeTaxYearConfig.excludedItems.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Official Government Sources */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Official Government References & Rounding Methodology
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {activeTaxYearConfig.roundingRuleNote}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeTaxYearConfig.sources.map((src, idx) => (
                <a
                  key={idx}
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start justify-between gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 bg-slate-50/50 dark:bg-slate-800/40 transition-colors"
                >
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      {src.authority}
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      {src.title}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Effective: {src.effectivePeriod}
                    </p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Non-Advice Disclaimer */}
          <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            <strong>Important Tax & Financial Disclaimer:</strong> Results
            produced by this calculator are educational estimates based on
            published statutory tables for standard salaried employees and do
            not constitute personalized tax, payroll, or legal advice. Actual
            withholding and final tax liability depend on
            sub-national/state/provincial rules, employer payroll
            configurations, tax codes, benefit-in-kind adjustments, and personal
            tax credits. Consult a qualified tax professional or your official
            national revenue authority for formal guidance.
          </div>
        </section>

        {/* Frequently Asked Questions (Google Search Queries) */}
        <section
          id="faq"
          aria-label="Frequently Asked Salary and Take-Home Pay Questions"
          className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-5"
        >
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Frequently Asked Questions About Salary &amp; Take-Home Pay
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Most-searched questions on gross-to-net salary conversions, tax brackets, and social contributions.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                q: 'What is the difference between gross salary and net take-home pay?',
                a: 'Gross salary is your total contract compensation before any deductions. Net take-home pay is the actual cash deposited into your bank account after subtracting income tax, social security/national insurance, pension contributions, and payroll levies.',
              },
              {
                q: 'How do I convert an annual salary to an hourly wage?',
                a: 'Divide your annual gross salary by the total paid hours worked in a year. For a standard 40-hour workweek across 52 weeks (2,080 hours), a $75,000 annual salary equals $75,000 ÷ 2,080 = $36.06 per hour.',
              },
              {
                q: 'Why is my effective tax rate lower than my marginal tax bracket?',
                a: 'Progressive tax systems divide your income into tiers. Your marginal tax rate only applies to the top slice of dollars above the highest threshold, while earlier slices are taxed at 0% (personal allowance/standard deduction) and lower bracket percentages.',
              },
              {
                q: 'Why does biweekly pay produce 26 paychecks instead of 24?',
                a: 'Semimonthly payroll pays twice a month (12 × 2 = 24 paychecks). Biweekly payroll pays every two weeks (52 weeks ÷ 2 = 26 paychecks), creating two "three-paycheck months" each calendar year.',
              },
              {
                q: 'How do pre-tax retirement contributions (401k, Pension, Super) affect take-home pay?',
                a: 'Pre-tax employee contributions reduce your taxable gross income before income tax is calculated. Contributing $500 pre-tax at a 24% marginal rate lowers your tax withholding by $120, so your net paycheck only drops by $380.',
              },
              {
                q: 'How does the UK £100,000 Personal Allowance taper create a 60% tax trap?',
                a: 'In the UK, your £12,570 tax-free Personal Allowance is reduced by £1 for every £2 of adjusted net income between £100,000 and £125,140, creating an effective 60% income tax rate (+2% NI) inside that band.',
              },
              {
                q: 'What is the difference between CTC and in-hand salary in India?',
                a: 'Cost to Company (CTC) includes employer EPF, gratuity, and insurance alongside gross pay. Monthly in-hand salary subtracts employer perks, employee EPF (12% of Basic), professional tax, and TDS under the New or Old Tax Regime.',
              },
            ].map((faq) => (
              <div
                key={faq.q}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1.5"
              >
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {faq.q}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Contextual Related Calculators */}
        <section
          aria-label="Related Salary and Finance Calculators"
          className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Related Salary, Tax & Financial Calculators
            </h2>
            <Link
              href="/finance"
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
            >
              View All Finance Tools
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/finance/us-state-take-home-calculator"
              className="group p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
            >
              <p className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                US Paycheck & State Tax Estimator
              </p>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                Compare US federal, FICA, and custom state tax rate scenarios.
              </p>
            </Link>

            <Link
              href="/finance/uk-paye-calculator"
              className="group p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
            >
              <p className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                UK PAYE Income Tax Calculator
              </p>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                Dedicated HMRC tax band and National Insurance estimator.
              </p>
            </Link>

            <Link
              href="/finance/india-income-tax-calculator"
              className="group p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
            >
              <p className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                India Income Tax Calculator
              </p>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                Compare Indian tax slabs, deductions, and cess in INR.
              </p>
            </Link>

            <Link
              href="/finance/canada-income-tax-calculator"
              className="group p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
            >
              <p className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                Canada Income Tax Calculator
              </p>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                Explore Canadian federal and provincial tax estimates.
              </p>
            </Link>

            <Link
              href="/retirement-and-super"
              className="group p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
            >
              <p className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                Retirement & Super Calculators
              </p>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                Explore 401(k), Superannuation, RMD, and FIRE retirement projections.
              </p>
            </Link>

            <Link
              href="/calculation-workspace"
              className="group p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
            >
              <p className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                Universal Calculation Workspace
              </p>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                Run custom multi-step budget and take-home pay expressions.
              </p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
