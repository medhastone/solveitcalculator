'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  Percent,
  TrendingDown,
  Layers,
  ArrowUpRight,
  Download,
  Copy,
  Check,
  RotateCcw,
  ShieldCheck,
  Clock,
  Sparkles,
  Info,
  Calendar,
  Wallet,
  Receipt,
  Scale,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  calculateUsFederalTax,
  FILING_STATUS_LABELS,
  UsTaxYear,
  UsFilingStatus,
} from '@/lib/finance-core/us-federal-tax';
import {
  formatWithGlobalCurrency,
  formatCompactWithGlobalCurrency,
  useCurrency,
} from '@/lib/currency';

function formatCurrency(val: number, decimals = 0): string {
  return formatWithGlobalCurrency(val, {
    fromCurrency: 'USD',
    decimals,
  });
}

function formatCompactCurrency(val: number): string {
  return formatCompactWithGlobalCurrency(val, {
    fromCurrency: 'USD',
  });
}

// Clean unboxed slider matching the user's design directive (no container boxes around sliders)
function CleanSlider({
  min,
  max,
  step,
  value,
  onChange,
  minLabel,
  midLabel,
  maxLabel,
  ariaLabel,
}: {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (val: number) => void;
  minLabel?: string;
  midLabel?: string;
  maxLabel?: string;
  ariaLabel: string;
}) {
  const clamped = Math.min(Math.max(value, min), max);
  const pct = Math.max(0, Math.min(100, ((clamped - min) / (max - min)) * 100));

  return (
    <div className="space-y-1 w-full py-1">
      <div className="relative w-full h-6 flex items-center touch-none select-none">
        <div className="w-full h-1.5 bg-surface-container-highest rounded-lg relative overflow-hidden">
          <div
            className="h-full bg-primary rounded-lg transition-[width] duration-75"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-slate-900 border-2 border-primary rounded-md shadow-sm pointer-events-none"
          style={{ left: `calc(8px + (100% - 16px) * ${pct / 100})` }}
        />
        <input
          type="range"
          aria-label={ariaLabel}
          min={min}
          max={max}
          step={step}
          value={clamped}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 m-0 p-0"
        />
      </div>
      {(minLabel || midLabel || maxLabel) && (
        <div className="flex justify-between text-[10px] font-medium text-on-surface-variant/75 select-none tabular-nums">
          <span>{minLabel}</span>
          <span>{midLabel}</span>
          <span>{maxLabel}</span>
        </div>
      )}
    </div>
  );
}

export default function UsFederalTaxClient() {
  useCurrency();
  // Core Inputs
  const [taxYear, setTaxYear] = useState<UsTaxYear>('2025');
  const [filingStatus, setFilingStatus] = useState<UsFilingStatus>('single');
  const [wages, setWages] = useState<number>(95000);
  const [otherIncome, setOtherIncome] = useState<number>(0);

  // Pre-tax deductions (Above-the-line)
  const [traditional401k, setTraditional401k] = useState<number>(6000);
  const [hsa, setHsa] = useState<number>(2000);
  const [traditionalIra, setTraditionalIra] = useState<number>(0);
  const [otherAdjustments, setOtherAdjustments] = useState<number>(0);

  // Deductions (Below-the-line)
  const [deductionType, setDeductionType] = useState<'standard' | 'itemized'>('standard');
  const [saltTax, setSaltTax] = useState<number>(7000);
  const [mortgageInterest, setMortgageInterest] = useState<number>(0);
  const [charity, setCharity] = useState<number>(1000);
  const [medicalExpenses, setMedicalExpenses] = useState<number>(0);

  // Credits
  const [qualifyingChildren, setQualifyingChildren] = useState<number>(0);
  const [otherCredits, setOtherCredits] = useState<number>(0);

  // Withholding
  const [taxesWithheld, setTaxesWithheld] = useState<number>(13500);

  // UI state
  const [showAdvancedDeductions, setShowAdvancedDeductions] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Sync URL query params if present
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const y = params.get('yr');
    if (y === '2024' || y === '2025') setTaxYear(y);

    const s = params.get('status') as UsFilingStatus;
    if (s && FILING_STATUS_LABELS[s]) setFilingStatus(s);

    const w = Number(params.get('wages'));
    if (w > 0) setWages(w);

    const k = Number(params.get('k'));
    if (k >= 0) setTraditional401k(k);

    const h = Number(params.get('hsa'));
    if (h >= 0) setHsa(h);

    const wh = Number(params.get('wh'));
    if (wh >= 0) setTaxesWithheld(wh);
  }, []);

  // Compute Federal Tax results
  const result = useMemo(() => {
    return calculateUsFederalTax({
      taxYear,
      filingStatus,
      wages,
      otherIncome,
      preTaxDeductions: {
        traditional401k,
        traditionalIra,
        hsa,
        otherAdjustments,
      },
      deductionType,
      itemizedDeductions: {
        saltStateAndLocalTax: saltTax,
        mortgageInterest,
        charitableDonations: charity,
        medicalExpensesOver75Pct: medicalExpenses,
      },
      taxCredits: {
        childTaxCredit: qualifyingChildren * 2000,
        otherCredits,
      },
      taxesWithheld,
    });
  }, [
    taxYear,
    filingStatus,
    wages,
    otherIncome,
    traditional401k,
    traditionalIra,
    hsa,
    otherAdjustments,
    deductionType,
    saltTax,
    mortgageInterest,
    charity,
    medicalExpenses,
    qualifyingChildren,
    otherCredits,
    taxesWithheld,
  ]);

  const handleReset = () => {
    setTaxYear('2025');
    setFilingStatus('single');
    setWages(95000);
    setOtherIncome(0);
    setTraditional401k(6000);
    setHsa(2000);
    setTraditionalIra(0);
    setOtherAdjustments(0);
    setDeductionType('standard');
    setSaltTax(7000);
    setMortgageInterest(0);
    setCharity(1000);
    setMedicalExpenses(0);
    setQualifyingChildren(0);
    setOtherCredits(0);
    setTaxesWithheld(13500);
  };

  const handleCopyLink = () => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams({
      yr: taxYear,
      status: filingStatus,
      wages: String(wages),
      k: String(traditional401k),
      hsa: String(hsa),
      wh: String(taxesWithheld),
    });
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleExportCsv = () => {
    const headers = ['Bracket Rate', 'Bracket Range', 'Taxable Amount in Bracket', 'Tax in Bracket'];
    const rows = result.bracketsBreakdown.map((b) => [
      `${b.ratePercent}%`,
      `"${b.bracketLabel}"`,
      b.taxableInBracket.toFixed(2),
      b.taxInBracket.toFixed(2),
    ]);
    rows.push(['---', '---', '---', '---']);
    rows.push(['Total Gross Income', '', '', result.totalGrossIncome.toFixed(2)]);
    rows.push(['Adjusted Gross Income (AGI)', '', '', result.agi.toFixed(2)]);
    rows.push(['Effective Deduction', `"${result.chosenDeductionType}"`, '', result.effectiveDeduction.toFixed(2)]);
    rows.push(['Taxable Income', '', '', result.taxableIncome.toFixed(2)]);
    rows.push(['Total Tax Before Credits', '', '', result.taxBeforeCredits.toFixed(2)]);
    rows.push(['Total Credits', '', '', result.totalCredits.toFixed(2)]);
    rows.push(['Final Tax Liability', '', '', result.taxAfterCredits.toFixed(2)]);
    rows.push(['Taxes Withheld', '', '', result.taxesWithheld.toFixed(2)]);
    rows.push([
      result.refundOrOwedType === 'refund' ? 'Estimated Refund' : 'Amount Owed',
      '',
      '',
      result.refundOrOwedType === 'refund' ? result.refundAmount.toFixed(2) : result.amountOwed.toFixed(2),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `us-federal-tax-${taxYear}-${filingStatus}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Input Controls (5 cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4 bg-surface-container border border-outline-variant/60 rounded-2xl p-5 shadow-xs">
          {/* Header & Quick Actions */}
          <div className="flex items-center justify-between border-b border-outline-variant/40 pb-3">
            <h2 className="text-sm font-bold text-on-surface flex items-center gap-2">
              <Receipt className="w-4 h-4 text-primary" />
              <span>Tax Inputs</span>
            </h2>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-2.5 py-1 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-xs font-medium text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-1"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied' : 'Share'}</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="p-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant hover:text-on-surface transition-colors"
                title="Reset"
                aria-label="Reset inputs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Tax Year & Filing Status */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="tax-year-select" className="text-xs font-bold text-on-surface">
                Tax Year
              </label>
              <div className="flex gap-1 bg-surface p-1 rounded-lg border border-outline-variant/60">
                {(['2025', '2024'] as UsTaxYear[]).map((yr) => (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => setTaxYear(yr)}
                    className={`px-3 py-1 rounded-md text-xs font-semibold tabular-nums transition-colors ${
                      taxYear === yr ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {yr}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="filing-status-select" className="block text-xs font-bold text-on-surface mb-1">
                Filing Status
              </label>
              <select
                id="filing-status-select"
                value={filingStatus}
                onChange={(e) => setFilingStatus(e.target.value as UsFilingStatus)}
                className="w-full px-3 py-2 rounded-xl bg-surface border border-outline-variant/60 text-xs font-semibold text-on-surface focus:outline-none focus:border-primary"
              >
                <option value="single">Single</option>
                <option value="marriedFilingJointly">Married Filing Jointly</option>
                <option value="headOfHousehold">Head of Household</option>
                <option value="marriedFilingSeparately">Married Filing Separately</option>
              </select>
            </div>
          </div>

          {/* Wages & Gross Income */}
          <div className="space-y-2 pt-2 border-t border-outline-variant/40">
            <div className="flex items-center justify-between">
              <label htmlFor="wages-input" className="text-xs font-bold text-on-surface">
                W-2 Wages &amp; Salary
              </label>
              <span className="text-xs font-bold text-primary tabular-nums">
                {formatCurrency(wages)}
              </span>
            </div>

            <div className="relative flex items-center">
              <span className="absolute left-3 text-sm font-bold text-on-surface-variant">$</span>
              <input
                id="wages-input"
                type="number"
                min={0}
                max={5000000}
                step={2500}
                value={wages}
                onChange={(e) => setWages(Math.max(0, Number(e.target.value)))}
                className="w-full pl-7 pr-3 py-2 rounded-xl bg-surface border border-outline-variant/60 text-sm font-bold text-on-surface tabular-nums focus:outline-none focus:border-primary"
              />
            </div>

            {/* Clean unboxed slider */}
            <CleanSlider
              ariaLabel="W-2 Wages slider"
              min={20000}
              max={350000}
              step={5000}
              value={wages}
              onChange={setWages}
              minLabel="$20k"
              midLabel="$185k"
              maxLabel="$350k"
            />

            <div className="grid grid-cols-4 gap-1.5 pt-0.5">
              {[50000, 85000, 120000, 200000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setWages(preset)}
                  className={`py-1 rounded-lg text-[11px] font-semibold tabular-nums border transition-colors ${
                    wages === preset
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-outline-variant/50 bg-surface text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {formatCompactCurrency(preset)}
                </button>
              ))}
            </div>

            <div className="pt-1">
              <label htmlFor="other-income-input" className="block text-[11px] text-on-surface-variant mb-1">
                Other Taxable Income (1099, dividends, interest)
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-xs font-bold text-on-surface-variant">$</span>
                <input
                  id="other-income-input"
                  type="number"
                  min={0}
                  max={2000000}
                  step={500}
                  value={otherIncome}
                  onChange={(e) => setOtherIncome(Math.max(0, Number(e.target.value)))}
                  className="w-full pl-6 pr-3 py-1.5 rounded-xl bg-surface border border-outline-variant/60 text-xs font-semibold text-on-surface tabular-nums focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Pre-Tax Deductions (Above-the-Line) */}
          <div className="space-y-2.5 pt-2 border-t border-outline-variant/40">
            <span className="text-xs font-bold text-on-surface block">
              Pre-Tax Deductions (Lowers AGI)
            </span>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label htmlFor="input-401k" className="block text-[11px] text-on-surface-variant mb-1">
                  Traditional 401(k)
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-2.5 text-xs text-on-surface-variant">$</span>
                  <input
                    id="input-401k"
                    type="number"
                    min={0}
                    max={31000}
                    step={500}
                    value={traditional401k}
                    onChange={(e) => setTraditional401k(Math.max(0, Number(e.target.value)))}
                    className="w-full pl-5 pr-2 py-1.5 rounded-lg bg-surface border border-outline-variant/60 text-xs font-semibold text-on-surface tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="input-hsa" className="block text-[11px] text-on-surface-variant mb-1">
                  HSA Contribution
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-2.5 text-xs text-on-surface-variant">$</span>
                  <input
                    id="input-hsa"
                    type="number"
                    min={0}
                    max={8550}
                    step={250}
                    value={hsa}
                    onChange={(e) => setHsa(Math.max(0, Number(e.target.value)))}
                    className="w-full pl-5 pr-2 py-1.5 rounded-lg bg-surface border border-outline-variant/60 text-xs font-semibold text-on-surface tabular-nums"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Standard vs. Itemized Deduction Choice */}
          <div className="space-y-2.5 pt-2 border-t border-outline-variant/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-on-surface">Deduction Method</span>
              <span className="text-[11px] text-primary font-bold">
                {result.recommendedDeductionType === 'standard' ? 'Standard Saves More' : 'Itemized Saves More'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-surface border border-outline-variant/60">
              <button
                type="button"
                onClick={() => setDeductionType('standard')}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                  deductionType === 'standard'
                    ? 'bg-primary text-on-primary'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Standard ({formatCurrency(result.standardDeduction)})
              </button>
              <button
                type="button"
                onClick={() => {
                  setDeductionType('itemized');
                  setShowAdvancedDeductions(true);
                }}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                  deductionType === 'itemized'
                    ? 'bg-primary text-on-primary'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Itemized ({formatCurrency(result.itemizedTotal)})
              </button>
            </div>

            {/* Itemized inputs toggle */}
            <div>
              <button
                type="button"
                onClick={() => setShowAdvancedDeductions(!showAdvancedDeductions)}
                className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1"
              >
                <span>{showAdvancedDeductions ? 'Hide Itemized Fields' : 'Customize Itemized Deductions'}</span>
                {showAdvancedDeductions ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>

              {showAdvancedDeductions && (
                <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                  <div>
                    <label htmlFor="input-salt" className="block text-[10px] text-on-surface-variant mb-0.5">
                      SALT (Capped at $10k)
                    </label>
                    <input
                      id="input-salt"
                      type="number"
                      min={0}
                      step={500}
                      value={saltTax}
                      onChange={(e) => setSaltTax(Math.max(0, Number(e.target.value)))}
                      className="w-full px-2 py-1 rounded-lg bg-surface border border-outline-variant/60 text-xs font-semibold tabular-nums"
                    />
                  </div>
                  <div>
                    <label htmlFor="input-mortgage" className="block text-[10px] text-on-surface-variant mb-0.5">
                      Mortgage Interest
                    </label>
                    <input
                      id="input-mortgage"
                      type="number"
                      min={0}
                      step={500}
                      value={mortgageInterest}
                      onChange={(e) => setMortgageInterest(Math.max(0, Number(e.target.value)))}
                      className="w-full px-2 py-1 rounded-lg bg-surface border border-outline-variant/60 text-xs font-semibold tabular-nums"
                    />
                  </div>
                  <div>
                    <label htmlFor="input-charity" className="block text-[10px] text-on-surface-variant mb-0.5">
                      Charitable Giving
                    </label>
                    <input
                      id="input-charity"
                      type="number"
                      min={0}
                      step={250}
                      value={charity}
                      onChange={(e) => setCharity(Math.max(0, Number(e.target.value)))}
                      className="w-full px-2 py-1 rounded-lg bg-surface border border-outline-variant/60 text-xs font-semibold tabular-nums"
                    />
                  </div>
                  <div>
                    <label htmlFor="input-medical" className="block text-[10px] text-on-surface-variant mb-0.5">
                      Medical (&gt;7.5% AGI)
                    </label>
                    <input
                      id="input-medical"
                      type="number"
                      min={0}
                      step={500}
                      value={medicalExpenses}
                      onChange={(e) => setMedicalExpenses(Math.max(0, Number(e.target.value)))}
                      className="w-full px-2 py-1 rounded-lg bg-surface border border-outline-variant/60 text-xs font-semibold tabular-nums"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Credits & Taxes Withheld */}
          <div className="space-y-2.5 pt-2 border-t border-outline-variant/40">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label htmlFor="input-children" className="block text-[11px] text-on-surface-variant mb-1">
                  Qualifying Children ($2k/ea)
                </label>
                <input
                  id="input-children"
                  type="number"
                  min={0}
                  max={10}
                  value={qualifyingChildren}
                  onChange={(e) => setQualifyingChildren(Math.max(0, Number(e.target.value)))}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-surface border border-outline-variant/60 text-xs font-semibold tabular-nums"
                />
              </div>

              <div>
                <label htmlFor="input-withheld" className="block text-[11px] text-on-surface-variant mb-1">
                  Taxes Already Withheld
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-2.5 text-xs text-on-surface-variant">$</span>
                  <input
                    id="input-withheld"
                    type="number"
                    min={0}
                    step={500}
                    value={taxesWithheld}
                    onChange={(e) => setTaxesWithheld(Math.max(0, Number(e.target.value)))}
                    className="w-full pl-5 pr-2 py-1.5 rounded-lg bg-surface border border-outline-variant/60 text-xs font-semibold tabular-nums"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Output Dashboard & Interactive Value-Adds (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Total Tax Liability */}
            <div className="p-5 rounded-2xl bg-surface-container border-2 border-primary/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Federal Tax Liability
                </span>
                <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[11px] font-bold tabular-nums">
                  {taxYear} IRS
                </span>
              </div>
              <div className="text-3xl font-extrabold text-on-surface tabular-nums tracking-tight">
                {formatCurrency(result.taxAfterCredits, 0)}
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-outline-variant/40 text-xs">
                <div>
                  <span className="text-on-surface-variant block text-[11px]">Taxable Income</span>
                  <span className="font-bold text-on-surface tabular-nums">
                    {formatCurrency(result.taxableIncome, 0)}
                  </span>
                </div>
                <div>
                  <span className="text-on-surface-variant block text-[11px]">Total Deductions</span>
                  <span className="font-bold text-on-surface tabular-nums">
                    {formatCurrency(result.effectiveDeduction, 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Refund or Amount Owed Card */}
            <div
              className={`p-5 rounded-2xl border-2 space-y-2 ${
                result.refundOrOwedType === 'refund'
                  ? 'bg-emerald-500/10 border-emerald-500/50'
                  : result.refundOrOwedType === 'owed'
                  ? 'bg-amber-500/10 border-amber-500/50'
                  : 'bg-surface-container border-outline-variant/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-on-surface">
                  {result.refundOrOwedType === 'refund'
                    ? 'Estimated Refund'
                    : result.refundOrOwedType === 'owed'
                    ? 'Amount You Owe'
                    : 'Tax Balanced Even'}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-md text-[11px] font-bold uppercase ${
                    result.refundOrOwedType === 'refund'
                      ? 'bg-emerald-600 text-white'
                      : result.refundOrOwedType === 'owed'
                      ? 'bg-amber-600 text-white'
                      : 'bg-surface-container-high text-on-surface'
                  }`}
                >
                  {result.refundOrOwedType}
                </span>
              </div>
              <div
                className={`text-3xl font-extrabold tabular-nums tracking-tight ${
                  result.refundOrOwedType === 'refund'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : result.refundOrOwedType === 'owed'
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-on-surface'
                }`}
              >
                {formatCurrency(
                  result.refundOrOwedType === 'refund'
                    ? result.refundAmount
                    : result.refundOrOwedType === 'owed'
                    ? result.amountOwed
                    : 0,
                  0
                )}
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-outline-variant/40 text-xs">
                <div>
                  <span className="text-on-surface-variant block text-[11px]">Withheld / Paid</span>
                  <span className="font-bold text-on-surface tabular-nums">
                    {formatCurrency(result.taxesWithheld, 0)}
                  </span>
                </div>
                <div>
                  <span className="text-on-surface-variant block text-[11px]">Tax Credits</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    −{formatCurrency(result.totalCredits, 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Rates Strip: Marginal vs. Effective */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-surface-container border border-outline-variant/60 space-y-1">
              <span className="text-[11px] text-on-surface-variant block">Effective Tax Rate</span>
              <div className="text-xl font-extrabold text-primary tabular-nums">
                {result.effectiveTaxRatePercent}%
              </div>
              <span className="text-[10px] text-on-surface-variant block">of Gross Income</span>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-container border border-outline-variant/60 space-y-1">
              <span className="text-[11px] text-on-surface-variant block">Top Marginal Rate</span>
              <div className="text-xl font-extrabold text-on-surface tabular-nums">
                {result.marginalTaxRatePercent}%
              </div>
              <span className="text-[10px] text-on-surface-variant block">on last dollar</span>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-container border border-outline-variant/60 space-y-1 col-span-2 sm:col-span-1">
              <span className="text-[11px] text-on-surface-variant block">Est. FICA Tax</span>
              <div className="text-xl font-extrabold text-on-surface tabular-nums">
                {formatCurrency(result.ficaEstimated.totalFica, 0)}
              </div>
              <span className="text-[10px] text-on-surface-variant block">Social Security + Medicare</span>
            </div>
          </div>

          {/* Value-Added 1: Marginal vs. Effective Rate Explanation (User's Own Numbers) */}
          <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/60 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-on-surface">
              <Scale className="w-3.5 h-3.5 text-primary" />
              <span>Marginal vs. Effective Rate: Why Your Actual Rate is Lower</span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              {result.marginalVsEffectiveExplanation}
            </p>
          </div>

          {/* Value-Added: Progressive Tax Brackets Breakdown Table & Visual Bars */}
          <div className="p-5 rounded-2xl bg-surface-container border border-outline-variant/60 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
                  <Layers className="w-4 h-4 text-primary" />
                  <span>
                    {taxYear} US Federal Tax Bracket Breakdown ({result.filingStatusLabel})
                  </span>
                </h3>
                <p className="text-[11px] text-on-surface-variant mt-0.5">
                  Source:{' '}
                  <a
                    href="https://www.irs.gov/pub/irs-drop/rp-24-40.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-primary hover:underline"
                  >
                    {taxYear === '2025'
                      ? 'IRS Revenue Procedure 2024-40 (Tax Year 2025, published Oct 22, 2024)'
                      : 'IRS Revenue Procedure 2023-34 (Tax Year 2024)'}
                  </a>
                </p>
              </div>
              <button
                type="button"
                onClick={handleExportCsv}
                className="px-2.5 py-1 rounded-lg bg-surface hover:bg-surface-container-high text-xs font-semibold text-on-surface transition-colors flex items-center gap-1 border border-outline-variant/50"
              >
                <Download className="w-3 h-3 text-primary" />
                <span>CSV</span>
              </button>
            </div>

            {/* Visual stacked progress bar of taxable income across brackets */}
            <div className="w-full space-y-1">
              <div className="h-4 rounded-lg bg-surface-container-highest overflow-hidden flex">
                {result.bracketsBreakdown
                  .filter((b) => b.taxableInBracket > 0)
                  .map((b, idx) => {
                    const widthPct = Math.max(
                      3,
                      (b.taxableInBracket / Math.max(1, result.taxableIncome)) * 100
                    );
                    const colors = [
                      'bg-emerald-500',
                      'bg-teal-500',
                      'bg-sky-500',
                      'bg-blue-600',
                      'bg-indigo-600',
                      'bg-purple-600',
                      'bg-rose-600',
                    ];
                    return (
                      <div
                        key={b.bracketIndex}
                        style={{ width: `${widthPct}%` }}
                        className={`${colors[idx % colors.length]} h-full transition-all`}
                        title={`${b.ratePercent}% tier: ${formatCurrency(b.taxableInBracket)} taxed`}
                      />
                    );
                  })}
              </div>
              <div className="flex justify-between text-[10px] text-on-surface-variant tabular-nums">
                <span>$0 Taxable</span>
                <span>Top Dollar @ {result.marginalTaxRatePercent}%</span>
                <span>{formatCurrency(result.taxableIncome, 0)} Total Taxable</span>
              </div>
            </div>

            {/* Bracket Breakdown Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs tabular-nums">
                <thead>
                  <tr className="border-b border-outline-variant/50 text-on-surface-variant font-bold">
                    <th className="py-2 px-2.5">Rate</th>
                    <th className="py-2 px-2.5">Bracket Range</th>
                    <th className="py-2 px-2.5 text-right">Taxable Amount</th>
                    <th className="py-2 px-2.5 text-right">Tax Generated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {result.bracketsBreakdown.map((b) => (
                    <tr
                      key={b.bracketIndex}
                      className={
                        b.isUserTopBracket
                          ? 'bg-primary/10 font-semibold text-on-surface'
                          : b.taxableInBracket > 0
                          ? 'text-on-surface hover:bg-surface-container-low'
                          : 'text-on-surface-variant/50'
                      }
                    >
                      <td className="py-2 px-2.5 font-bold">
                        {b.ratePercent}%
                        {b.isUserTopBracket && (
                          <span className="ml-1 text-[10px] text-primary">(Your Top Tier)</span>
                        )}
                      </td>
                      <td className="py-2 px-2.5 text-on-surface-variant">{b.bracketLabel}</td>
                      <td className="py-2 px-2.5 text-right font-medium">
                        {formatCurrency(b.taxableInBracket, 0)}
                      </td>
                      <td className="py-2 px-2.5 text-right font-bold text-on-surface">
                        {formatCurrency(b.taxInBracket, 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Value-Added 2: "What Lowers My Tax" Personalized Opportunities */}
          <div className="p-5 rounded-2xl bg-surface-container border border-outline-variant/60 space-y-3">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-bold text-on-surface">
                What Lowers My Tax: Personalized Tax Reduction Opportunities
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {result.optimizationTips.map((tip) => (
                <div
                  key={tip.id}
                  className="p-3 rounded-xl bg-surface border border-outline-variant/50 space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between font-bold text-on-surface">
                    <span>{tip.title}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 tabular-nums">
                      Save ~{formatCurrency(tip.potentialTaxSavings, 0)}
                    </span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant leading-snug">
                    {tip.actionableHint}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Related Tax & Retirement Tools */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
        <Link
          href="/finance/us-state-take-home-calculator"
          className="p-3.5 rounded-xl bg-surface-container border border-outline-variant/60 hover:border-primary transition-all group flex items-center justify-between"
        >
          <div>
            <span className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors block">
              State &amp; Take-Home Pay
            </span>
            <span className="text-[11px] text-on-surface-variant">State income tax &amp; net pay</span>
          </div>
          <ArrowUpRight className="w-4 h-4 text-on-surface-variant group-hover:text-primary shrink-0" />
        </Link>

        <Link
          href="/finance/self-employment-tax-calculator"
          className="p-3.5 rounded-xl bg-surface-container border border-outline-variant/60 hover:border-primary transition-all group flex items-center justify-between"
        >
          <div>
            <span className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors block">
              Self-Employment &amp; FICA
            </span>
            <span className="text-[11px] text-on-surface-variant">SECA tax &amp; Medicare surtax</span>
          </div>
          <ArrowUpRight className="w-4 h-4 text-on-surface-variant group-hover:text-primary shrink-0" />
        </Link>

        <Link
          href="/finance/capital-gains-tax-calculator"
          className="p-3.5 rounded-xl bg-surface-container border border-outline-variant/60 hover:border-primary transition-all group flex items-center justify-between"
        >
          <div>
            <span className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors block">
              Capital Gains &amp; Assets
            </span>
            <span className="text-[11px] text-on-surface-variant">Asset appreciation &amp; LTCG tiers</span>
          </div>
          <ArrowUpRight className="w-4 h-4 text-on-surface-variant group-hover:text-primary shrink-0" />
        </Link>

        <Link
          href="/finance/401k-calculator"
          className="p-3.5 rounded-xl bg-surface-container border border-outline-variant/60 hover:border-primary transition-all group flex items-center justify-between"
        >
          <div>
            <span className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors block">
              401(k) Pre-Tax Savings
            </span>
            <span className="text-[11px] text-on-surface-variant">Lower AGI &amp; model match</span>
          </div>
          <ArrowUpRight className="w-4 h-4 text-on-surface-variant group-hover:text-primary shrink-0" />
        </Link>
      </div>
    </div>
  );
}
