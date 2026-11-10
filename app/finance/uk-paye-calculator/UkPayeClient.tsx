'use client';

import React, { useState, useMemo } from 'react';
import { calculateUkPaye } from '@/lib/finance-core/tax-payroll-business-engines';
import { UK_PAYE_DATA } from '@/lib/finance-core/tax-payroll-business-data';
import {
  UnboxedSlider,
  VerifiedSourceBadge,
  RelatedCalculatorsStrip,
  formatMoney,
  formatPct,
} from '@/components/calculator/CleanFinanceControls';
import { RotateCcw, Landmark, AlertTriangle } from 'lucide-react';
import { useCurrency } from '@/lib/currency';

export default function UkPayeClient() {
  useCurrency();
  const [taxYear, setTaxYear] = useState<'2025/26' | '2024/25'>('2025/26');
  const [grossSalary, setGrossSalary] = useState<number>(55000);
  const [pensionPct, setPensionPct] = useState<number>(5);
  const [pensionMethod, setPensionMethod] = useState<'salary_sacrifice' | 'net_pay' | 'relief_at_source'>(
    'salary_sacrifice'
  );
  const [studentLoanPlan, setStudentLoanPlan] = useState<keyof typeof UK_PAYE_DATA.studentLoanPlans>('none');
  const [isScotland, setIsScotland] = useState<boolean>(false);

  const result = useMemo(
    () =>
      calculateUkPaye({
        grossSalary,
        pensionPct,
        pensionMethod,
        studentLoanPlan,
        isScotland,
      }),
    [grossSalary, pensionPct, pensionMethod, studentLoanPlan, isScotland]
  );

  const handleReset = () => {
    setTaxYear('2025/26');
    setGrossSalary(55000);
    setPensionPct(5);
    setPensionMethod('salary_sacrifice');
    setStudentLoanPlan('none');
    setIsScotland(false);
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
        <div className="lg:col-span-5 space-y-4 bg-[var(--bg)] border border-[var(--border)] rounded-2xl p-5">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
            <div className="flex items-center gap-2 font-bold text-sm text-[var(--text)]">
              <Landmark className="w-4 h-4 text-blue-600" />
              <span>HMRC PAYE Parameters ({taxYear})</span>
            </div>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--muted)] hover:text-blue-600 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>

          {/* Tax Year & Region */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
                UK Tax Year
              </label>
              <select
                aria-label="UK Tax Year"
                value={taxYear}
                onChange={(e) => setTaxYear(e.target.value as '2025/26' | '2024/25')}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold"
              >
                <option value="2025/26">2025/26 (Current)</option>
                <option value="2024/25">2024/25</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
                UK Tax Region
              </label>
              <select
                aria-label="UK Tax Region"
                value={isScotland ? 'scotland' : 'ruk'}
                onChange={(e) => setIsScotland(e.target.value === 'scotland')}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold"
              >
                <option value="ruk">England, Wales &amp; N. Ireland</option>
                <option value="scotland">Scotland (6-Band Schedule)</option>
              </select>
            </div>
          </div>

          {/* Gross Salary */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                Annual Gross Salary (£)
              </label>
              <input
                type="number"
                value={grossSalary}
                onChange={(e) => setGrossSalary(Math.max(0, Number(e.target.value)))}
                className="w-32 text-right rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-sm font-bold tabular-nums"
              />
            </div>
            <UnboxedSlider
              ariaLabel="Annual Gross Salary"
              min={15000}
              max={250000}
              step={1000}
              value={grossSalary}
              onChange={setGrossSalary}
              minLabel="£15k"
              midLabel="£100k Taper"
              maxLabel="£250k"
            />
          </div>

          {/* Pension % & Method */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                Workplace Pension Contribution: {pensionPct}%
              </label>
              <span className="text-xs font-bold text-blue-600 tabular-nums">
                {formatMoney(result.pensionContribution, 'GBP')}/yr
              </span>
            </div>
            <UnboxedSlider
              ariaLabel="Workplace Pension Percentage"
              min={0}
              max={30}
              step={0.5}
              value={pensionPct}
              onChange={setPensionPct}
              minLabel="0%"
              midLabel="5% Auto-Enrol"
              maxLabel="30%"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
                Pension Relief Method
              </label>
              <select
                aria-label="Pension Relief Method"
                value={pensionMethod}
                onChange={(e) => setPensionMethod(e.target.value as 'salary_sacrifice' | 'net_pay' | 'relief_at_source')}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold"
              >
                <option value="salary_sacrifice">Salary Sacrifice (Saves NI + Tax)</option>
                <option value="net_pay">Net Pay Arrangement</option>
                <option value="relief_at_source">Relief at Source</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
                Student Loan Plan
              </label>
              <select
                aria-label="Student Loan Plan"
                value={studentLoanPlan}
                onChange={(e) => setStudentLoanPlan(e.target.value as keyof typeof UK_PAYE_DATA.studentLoanPlans)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold"
              >
                {Object.entries(UK_PAYE_DATA.studentLoanPlans).map(([key, plan]) => (
                  <option key={key} value={key}>
                    {plan.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* OUTPUTS */}
        <div className="lg:col-span-7 space-y-5">
          {/* Net Pay Hero */}
          <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-600/10 via-transparent to-emerald-500/5 p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  UK PAYE Net Take-Home Pay ({isScotland ? 'Scotland' : 'England, Wales & NI'})
                </div>
                <div className="text-3xl font-extrabold tabular-nums text-[var(--text)] mt-1">
                  {formatMoney(result.netAnnual, 'GBP')}
                  <span className="text-sm font-semibold text-[var(--muted)] ml-1.5">/ year</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-semibold text-[var(--muted)]">Effective Tax + NI Rate</div>
                <div className="text-2xl font-extrabold tabular-nums text-emerald-600 dark:text-emerald-400">
                  {formatPct(result.effectiveTaxAndNiRatePct, 1)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-[var(--border)]">
              <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                <div className="text-[11px] text-[var(--muted)]">Monthly Take-Home</div>
                <div className="text-base font-bold tabular-nums">{formatMoney(result.netMonthly, 'GBP', 2)}</div>
              </div>
              <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                <div className="text-[11px] text-[var(--muted)]">Weekly Take-Home</div>
                <div className="text-base font-bold tabular-nums">{formatMoney(result.netWeekly, 'GBP', 2)}</div>
              </div>
              <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                <div className="text-[11px] text-[var(--muted)]">Personal Allowance</div>
                <div className="text-base font-bold tabular-nums">{formatMoney(result.personalAllowance, 'GBP')}</div>
              </div>
            </div>
          </div>

          {/* £100k–£125,140 60% Tax Trap Alert */}
          {grossSalary > 100000 && result.personalAllowance < 12570 && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-[var(--text)]">£100,000 Personal Allowance Taper Triggered:</strong> Your
                £12,570 tax-free Personal Allowance is reduced by £1 for every £2 of adjusted net income above £100,000
                (currently reduced to <strong>{formatMoney(result.personalAllowance, 'GBP')}</strong>), creating an
                effective 60% marginal tax band between £100,000 and £125,140. Increasing your pension contribution
                restores your Personal Allowance.
              </div>
            </div>
          )}

          {/* PAYE Breakdown Table */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-5">
            <h3 className="text-sm font-bold text-[var(--text)] mb-3">
              HMRC Income Tax, Class 1 National Insurance &amp; Deductions
            </h3>
            <table className="w-full text-xs border-collapse tabular-nums">
              <thead>
                <tr className="border-b border-[var(--border)] text-[var(--muted)] text-left font-bold">
                  <th className="py-2">Component</th>
                  <th className="py-2 text-right">Annual</th>
                  <th className="py-2 text-right">Monthly</th>
                  <th className="py-2 text-right">Weekly</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                <tr>
                  <td className="py-2 font-semibold">Gross Salary</td>
                  <td className="py-2 text-right font-bold">{formatMoney(result.gross, 'GBP')}</td>
                  <td className="py-2 text-right">{formatMoney(result.gross / 12, 'GBP', 2)}</td>
                  <td className="py-2 text-right">{formatMoney(result.gross / 52, 'GBP', 2)}</td>
                </tr>
                <tr>
                  <td className="py-2">Income Tax ({isScotland ? 'Scottish Bands' : 'rUK 20% / 40% / 45%'})</td>
                  <td className="py-2 text-right text-rose-500">−{formatMoney(result.incomeTax, 'GBP')}</td>
                  <td className="py-2 text-right">−{formatMoney(result.incomeTax / 12, 'GBP', 2)}</td>
                  <td className="py-2 text-right">−{formatMoney(result.incomeTax / 52, 'GBP', 2)}</td>
                </tr>
                <tr>
                  <td className="py-2">Class 1 National Insurance (8% main / 2% upper)</td>
                  <td className="py-2 text-right text-amber-600">−{formatMoney(result.nationalInsurance, 'GBP')}</td>
                  <td className="py-2 text-right">−{formatMoney(result.nationalInsurance / 12, 'GBP', 2)}</td>
                  <td className="py-2 text-right">−{formatMoney(result.nationalInsurance / 52, 'GBP', 2)}</td>
                </tr>
                <tr>
                  <td className="py-2">Workplace Pension ({pensionPct}%)</td>
                  <td className="py-2 text-right">−{formatMoney(result.pensionContribution, 'GBP')}</td>
                  <td className="py-2 text-right">−{formatMoney(result.pensionContribution / 12, 'GBP', 2)}</td>
                  <td className="py-2 text-right">−{formatMoney(result.pensionContribution / 52, 'GBP', 2)}</td>
                </tr>
                {result.studentLoan > 0 && (
                  <tr>
                    <td className="py-2">Student Loan Repayment</td>
                    <td className="py-2 text-right">−{formatMoney(result.studentLoan, 'GBP')}</td>
                    <td className="py-2 text-right">−{formatMoney(result.studentLoan / 12, 'GBP', 2)}</td>
                    <td className="py-2 text-right">−{formatMoney(result.studentLoan / 52, 'GBP', 2)}</td>
                  </tr>
                )}
                <tr className="font-bold text-[var(--text)]">
                  <td className="py-2">Net Take-Home Pay</td>
                  <td className="py-2 text-right text-emerald-600 dark:text-emerald-400">
                    {formatMoney(result.netAnnual, 'GBP')}
                  </td>
                  <td className="py-2 text-right">{formatMoney(result.netMonthly, 'GBP', 2)}</td>
                  <td className="py-2 text-right">{formatMoney(result.netWeekly, 'GBP', 2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <RelatedCalculatorsStrip
        links={[
          {
            title: 'Salary to Hourly Calculator',
            path: '/finance/salary-to-hourly-calculator',
            desc: 'Convert annual salary into hourly, daily, weekly, and monthly equivalents.',
          },
          {
            title: 'Take-Home Pay Calculator',
            path: '/finance/take-home-pay-calculator',
            desc: 'Compare US and India net paycheck breakdowns.',
          },
          {
            title: 'Pay Raise Calculator',
            path: '/finance/pay-raise-calculator',
            desc: 'Model percentage pay raises, inflation-adjusted real gains, and multi-year compounding.',
          },
        ]}
      />
    </div>
  );
}
