'use client';

import React, { useState, useMemo } from 'react';
import { calculateSelfEmploymentTax } from '@/lib/finance-core/tax-payroll-business-engines';
import { US_FICA_2025 } from '@/lib/finance-core/tax-payroll-business-data';
import { UsFilingStatus, FILING_STATUS_LABELS } from '@/lib/finance-core/us-federal-tax';
import {
  UnboxedSlider,
  VerifiedSourceBadge,
  RelatedCalculatorsStrip,
  formatMoney,
  formatPct,
} from '@/components/calculator/CleanFinanceControls';
import { RotateCcw, Calendar, ShieldCheck, Briefcase, Info } from 'lucide-react';
import { useCurrency } from '@/lib/currency';

export default function SelfEmploymentTaxClient() {
  useCurrency();
  const [netBusinessProfit, setNetBusinessProfit] = useState<number>(95000);
  const [filingStatus, setFilingStatus] = useState<UsFilingStatus>('single');
  const [otherW2Wages, setOtherW2Wages] = useState<number>(0);

  const result = useMemo(
    () =>
      calculateSelfEmploymentTax({
        netBusinessProfit,
        filingStatus,
        otherW2Wages,
        taxYear: '2025',
      }),
    [netBusinessProfit, filingStatus, otherW2Wages]
  );

  const handleReset = () => {
    setNetBusinessProfit(95000);
    setFilingStatus('single');
    setOtherW2Wages(0);
  };

  return (
    <div className="space-y-6">
      <VerifiedSourceBadge
        authority={result.source.authority}
        document={result.source.document}
        verifiedDate={result.source.verifiedDate}
        url={result.source.url}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* INPUTS */}
        <div className="lg:col-span-5 space-y-5 bg-[var(--bg)] border border-[var(--border)] rounded-2xl p-5">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
            <div className="flex items-center gap-2 font-bold text-sm text-[var(--text)]">
              <Briefcase className="w-4 h-4 text-blue-600" />
              <span>Schedule C &amp; SE Inputs (2025)</span>
            </div>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--muted)] hover:text-blue-600 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>

          {/* Net Business Profit */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                Net Business Profit (Schedule C)
              </label>
              <input
                type="number"
                value={netBusinessProfit}
                onChange={(e) => setNetBusinessProfit(Math.max(0, Number(e.target.value)))}
                className="w-36 text-right rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-sm font-bold tabular-nums"
              />
            </div>
            <UnboxedSlider
              ariaLabel="Net Business Profit"
              min={5000}
              max={400000}
              step={2500}
              value={netBusinessProfit}
              onChange={setNetBusinessProfit}
              minLabel="$5k"
              midLabel="$200k"
              maxLabel="$400k"
            />
          </div>

          {/* Filing Status */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1.5">
              Filing Status
            </label>
            <select
              aria-label="Filing Status"
              value={filingStatus}
              onChange={(e) => setFilingStatus(e.target.value as UsFilingStatus)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm font-semibold"
            >
              {(Object.keys(FILING_STATUS_LABELS) as UsFilingStatus[]).map((st) => (
                <option key={st} value={st}>
                  {FILING_STATUS_LABELS[st]}
                </option>
              ))}
            </select>
          </div>

          {/* Other W-2 Wages */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                Other W-2 Wages (Offsets $176,100 SS Cap)
              </label>
              <input
                type="number"
                value={otherW2Wages}
                onChange={(e) => setOtherW2Wages(Math.max(0, Number(e.target.value)))}
                className="w-36 text-right rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-sm font-bold tabular-nums"
              />
            </div>
            <UnboxedSlider
              ariaLabel="Other W-2 Wages"
              min={0}
              max={250000}
              step={2500}
              value={otherW2Wages}
              onChange={setOtherW2Wages}
              minLabel="$0"
              midLabel="$125k"
              maxLabel="$250k"
            />
          </div>
        </div>

        {/* OUTPUTS */}
        <div className="lg:col-span-7 space-y-5">
          {/* Primary SE Tax + Deduction Hero */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Total SE Tax (Schedule SE)
              </div>
              <div className="text-2xl font-extrabold tabular-nums text-[var(--text)] mt-1">
                {formatMoney(result.totalSeTax)}
              </div>
              <div className="text-xs text-[var(--muted)] mt-1">
                Effective SE Rate: {formatPct(result.effectiveSeRatePct, 2)} of profit
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                50% SE Tax AGI Deduction
              </div>
              <div className="text-2xl font-extrabold tabular-nums text-emerald-600 dark:text-emerald-400 mt-1">
                −{formatMoney(result.deductibleHalfSeTax)}
              </div>
              <div className="text-xs text-[var(--muted)] mt-1">
                Form 1040 Schedule 1 Line 15 deduction
              </div>
            </div>

            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Quarterly 1040-ES Payment
              </div>
              <div className="text-2xl font-extrabold tabular-nums text-[var(--text)] mt-1">
                {formatMoney(result.quarterlyPayment)}
              </div>
              <div className="text-xs text-[var(--muted)] mt-1">
                (SE Tax + Incremental Fed Tax) ÷ 4
              </div>
            </div>
          </div>

          {/* Step-by-Step Schedule SE Breakdown */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-5 space-y-3">
            <h3 className="text-sm font-bold text-[var(--text)]">
              IRS Schedule SE Line-by-Line Calculation
            </h3>
            <div className="divide-y divide-[var(--border)] text-xs tabular-nums">
              <div className="py-2 flex justify-between">
                <span>1. Net Business Profit (Schedule C Line 31)</span>
                <span className="font-bold">{formatMoney(result.profit)}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span>2. Taxable SE Net Earnings (92.35% × Profit — IRS Schedule SE Line 4a)</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {formatMoney(result.netEarningsFromSE)}
                </span>
              </div>
              <div className="py-2 flex justify-between">
                <span>
                  3. Social Security Tax (12.4% on {formatMoney(result.taxableSsEarnings)}; remaining ${US_FICA_2025.socialSecurityWageBase.toLocaleString()} cap after W-2)
                </span>
                <span className="font-semibold">{formatMoney(result.socialSecurityTax)}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span>4. Medicare Tax (2.9% uncapped on 92.35% net earnings)</span>
                <span className="font-semibold">{formatMoney(result.medicareTax)}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span>5. Additional Medicare Tax (0.9% above statutory threshold)</span>
                <span className="font-semibold">{formatMoney(result.additionalMedicareTax)}</span>
              </div>
              <div className="py-2 flex justify-between font-bold text-[var(--text)]">
                <span>6. Total Annual Self-Employment Tax + Incremental Federal Income Tax</span>
                <span>
                  {formatMoney(result.totalSeTax)} SE + {formatMoney(result.incrementalIncomeTax)} Income ={' '}
                  {formatMoney(result.totalAnnualEstimatedTax)}
                </span>
              </div>
            </div>
          </div>

          {/* Quarterly Payment Dates & IRS Safe-Harbor Box */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-5 space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-[var(--text)]">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>2025 / 2026 Form 1040-ES Quarterly Estimated Tax Due Dates</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
              {result.quarterlySchedule.map((q) => (
                <div
                  key={q.quarter}
                  className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-1"
                >
                  <div className="text-[11px] font-bold text-blue-600 dark:text-blue-400">{q.quarter}</div>
                  <div className="text-[11px] text-[var(--muted)]">{q.incomePeriod}</div>
                  <div className="text-base font-extrabold tabular-nums">{formatMoney(q.amount)}</div>
                  <div className="text-[11px] font-semibold text-[var(--text)]">Due: {q.dueDate}</div>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs space-y-1">
              <div className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                <Info className="w-4 h-4 shrink-0" />
                <span>IRS Safe-Harbor Rule to Avoid Underpayment Penalties (IRC § 6654)</span>
              </div>
              <p className="text-[var(--muted)] leading-relaxed">
                You avoid IRS estimated tax underpayment penalties if you pay at least <strong>90%</strong> of your
                current-year tax liability OR <strong>100%</strong> of your prior-year total tax shown on Form 1040
                (<strong>110%</strong> if your prior-year Adjusted Gross Income exceeded $150,000, or $75,000 if Married
                Filing Separately).
              </p>
            </div>
          </div>
        </div>
      </div>

      <RelatedCalculatorsStrip
        links={[
          {
            title: '1099 vs W-2 Calculator',
            path: '/finance/1099-vs-w2-calculator',
            desc: 'Solve for the exact 1099 hourly or annual rate required to match a W-2 salary and benefits package.',
          },
          {
            title: 'Freelance Hourly Rate Calculator',
            path: '/finance/salary-to-hourly-calculator',
            desc: 'Back out unbillable administrative hours, overhead, and self-employment taxes.',
          },
          {
            title: 'US Federal Income Tax Calculator',
            path: '/finance/us-federal-income-tax-calculator',
            desc: 'Compute complete 2025 federal income tax brackets, deductions, and credits.',
          },
        ]}
      />
    </div>
  );
}
