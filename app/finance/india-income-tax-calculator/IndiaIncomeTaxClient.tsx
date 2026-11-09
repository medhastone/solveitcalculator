'use client';

import React, { useState, useMemo } from 'react';
import { calculateIndiaIncomeTax } from '@/lib/finance-core/tax-payroll-business-engines';
import {
  UnboxedSlider,
  VerifiedSourceBadge,
  RelatedCalculatorsStrip,
  formatMoney,
} from '@/components/calculator/CleanFinanceControls';
import { RotateCcw, Scale, CheckCircle2, XCircle } from 'lucide-react';

export default function IndiaIncomeTaxClient() {
  const [financialYear, setFinancialYear] = useState<'2025-26' | '2024-25'>('2025-26');
  const [ageBand, setAgeBand] = useState<'under60' | 'senior60to79' | 'superSenior80Plus'>('under60');
  const [grossSalary, setGrossSalary] = useState<number>(1600000);
  const [otherIncome, setOtherIncome] = useState<number>(0);

  // Deductions
  const [deduction80C, setDeduction80C] = useState<number>(150000);
  const [deduction80D, setDeduction80D] = useState<number>(25000);
  const [hraExemption, setHraExemption] = useState<number>(180000);
  const [homeLoanInterest24b, setHomeLoanInterest24b] = useState<number>(0);
  const [npsExtra80CCD1B, setNpsExtra80CCD1B] = useState<number>(50000);
  const [employerNps80CCD2, setEmployerNps80CCD2] = useState<number>(0);

  const result = useMemo(
    () =>
      calculateIndiaIncomeTax({
        financialYear,
        ageBand,
        grossSalary,
        otherIncome,
        deduction80C,
        deduction80D,
        hraExemption,
        homeLoanInterest24b,
        npsExtra80CCD1B,
        employerNps80CCD2,
      }),
    [
      financialYear,
      ageBand,
      grossSalary,
      otherIncome,
      deduction80C,
      deduction80D,
      hraExemption,
      homeLoanInterest24b,
      npsExtra80CCD1B,
      employerNps80CCD2,
    ]
  );

  const handleReset = () => {
    setFinancialYear('2025-26');
    setAgeBand('under60');
    setGrossSalary(1600000);
    setOtherIncome(0);
    setDeduction80C(150000);
    setDeduction80D(25000);
    setHraExemption(180000);
    setHomeLoanInterest24b(0);
    setNpsExtra80CCD1B(50000);
    setEmployerNps80CCD2(0);
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
              <Scale className="w-4 h-4 text-blue-600" />
              <span>Income &amp; Chapter VI-A Deductions</span>
            </div>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--muted)] hover:text-blue-600 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
                Financial Year
              </label>
              <select
                aria-label="Financial Year"
                value={financialYear}
                onChange={(e) => setFinancialYear(e.target.value as '2025-26' | '2024-25')}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold"
              >
                <option value="2025-26">FY 2025–26 (AY 2026–27 Budget)</option>
                <option value="2024-25">FY 2024–25 (AY 2025–26)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
                Taxpayer Age Band
              </label>
              <select
                aria-label="Taxpayer Age Band"
                value={ageBand}
                onChange={(e) => setAgeBand(e.target.value as 'under60' | 'senior60to79' | 'superSenior80Plus')}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold"
              >
                <option value="under60">Below 60 Years</option>
                <option value="senior60to79">Senior Citizen (60–79 Yrs)</option>
                <option value="superSenior80Plus">Super Senior (80+ Yrs)</option>
              </select>
            </div>
          </div>

          {/* Gross Salary */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                Annual Gross Salary (₹)
              </label>
              <input
                type="number"
                value={grossSalary}
                onChange={(e) => setGrossSalary(Math.max(0, Number(e.target.value)))}
                className="w-36 text-right rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-sm font-bold tabular-nums"
              />
            </div>
            <UnboxedSlider
              ariaLabel="Annual Gross Salary INR"
              min={300000}
              max={6000000}
              step={50000}
              value={grossSalary}
              onChange={setGrossSalary}
              minLabel="₹3L"
              midLabel="₹12.75L Zero Tax"
              maxLabel="₹60L"
            />
          </div>

          {/* Deductions */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-[11px] font-bold uppercase text-[var(--muted)] mb-1">
                Sec 80C (Max ₹1.5L)
              </label>
              <input
                type="number"
                value={deduction80C}
                onChange={(e) => setDeduction80C(Math.max(0, Number(e.target.value)))}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1.5 text-xs font-bold tabular-nums"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-[var(--muted)] mb-1">
                Sec 80D Medical
              </label>
              <input
                type="number"
                value={deduction80D}
                onChange={(e) => setDeduction80D(Math.max(0, Number(e.target.value)))}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1.5 text-xs font-bold tabular-nums"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-[var(--muted)] mb-1">
                HRA Exemption u/s 10(13A)
              </label>
              <input
                type="number"
                value={hraExemption}
                onChange={(e) => setHraExemption(Math.max(0, Number(e.target.value)))}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1.5 text-xs font-bold tabular-nums"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-[var(--muted)] mb-1">
                Sec 24(b) Home Loan Int.
              </label>
              <input
                type="number"
                value={homeLoanInterest24b}
                onChange={(e) => setHomeLoanInterest24b(Math.max(0, Number(e.target.value)))}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1.5 text-xs font-bold tabular-nums"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-[var(--muted)] mb-1">
                Sec 80CCD(1B) NPS (₹50k)
              </label>
              <input
                type="number"
                value={npsExtra80CCD1B}
                onChange={(e) => setNpsExtra80CCD1B(Math.max(0, Number(e.target.value)))}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1.5 text-xs font-bold tabular-nums"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-[var(--muted)] mb-1">
                Employer NPS 80CCD(2)
              </label>
              <input
                type="number"
                value={employerNps80CCD2}
                onChange={(e) => setEmployerNps80CCD2(Math.max(0, Number(e.target.value)))}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1.5 text-xs font-bold tabular-nums"
              />
            </div>
          </div>
        </div>

        {/* OUTPUTS */}
        <div className="lg:col-span-7 space-y-5">
          {/* Neutral Lower-Tax Regime Callout */}
          <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-600/10 via-transparent to-emerald-500/5 p-5">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Regime Comparison Result (FY {financialYear})
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-[var(--text)] mt-1">
              Under your entered numbers,{' '}
              <span className="text-emerald-600 dark:text-emerald-400">{result.recommendedRegime}</span> results in{' '}
              {formatMoney(result.taxSavings, 'INR')} lower annual tax.
            </div>
            <div className="text-xs text-[var(--muted)] mt-1.5">
              Break-Even Threshold: For the Old Regime to match the New Regime at {formatMoney(result.grossTotal, 'INR')}{' '}
              gross income, total Old Regime deductions (including ₹50,000 standard deduction) must reach at least{' '}
              <strong className="text-[var(--text)]">
                {formatMoney(result.totalDeductionsNeededForOldToWin, 'INR')}
              </strong>
              .
            </div>

            {/* Side-by-Side Regime Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-[var(--border)]">
              <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase text-blue-600 dark:text-blue-400">
                    New Regime (Sec 115BAC)
                  </span>
                  <span className="text-[11px] font-mono text-[var(--muted)]">₹75,000 Std Ded</span>
                </div>
                <div className="text-2xl font-extrabold tabular-nums">
                  {formatMoney(result.newRegime.totalTax, 'INR')}{' '}
                  <span className="text-xs font-normal text-[var(--muted)]">tax</span>
                </div>
                <div className="text-xs text-[var(--muted)] tabular-nums">
                  Taxable Income: {formatMoney(result.newRegime.taxableIncome, 'INR')}
                  <br />
                  Annual Net Take-Home:{' '}
                  <strong className="text-emerald-600">{formatMoney(result.newRegime.netTakeHomeAnnual, 'INR')}</strong>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase text-[var(--text)]">Old Tax Regime</span>
                  <span className="text-[11px] font-mono text-[var(--muted)]">₹50,000 Std Ded</span>
                </div>
                <div className="text-2xl font-extrabold tabular-nums">
                  {formatMoney(result.oldRegime.totalTax, 'INR')}{' '}
                  <span className="text-xs font-normal text-[var(--muted)]">tax</span>
                </div>
                <div className="text-xs text-[var(--muted)] tabular-nums">
                  Taxable Income: {formatMoney(result.oldRegime.taxableIncome, 'INR')}
                  <br />
                  Annual Net Take-Home:{' '}
                  <strong className="text-emerald-600">{formatMoney(result.oldRegime.netTakeHomeAnnual, 'INR')}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Plain Guide: What is Allowed in Each Regime */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-5 space-y-3">
            <h3 className="text-sm font-bold text-[var(--text)]">
              Plain Guide: Which Deductions Are Allowed in New vs Old Regime?
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border)] text-[var(--muted)] text-left font-bold">
                    <th className="py-2">Exemption / Deduction</th>
                    <th className="py-2 text-center">New Regime (115BAC)</th>
                    <th className="py-2 text-center">Old Regime</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  <tr>
                    <td className="py-2 font-semibold">Salaried Standard Deduction u/s 16(ia)</td>
                    <td className="py-2 text-center text-emerald-600 font-bold">₹75,000 Allowed</td>
                    <td className="py-2 text-center font-semibold">₹50,000 Allowed</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-semibold">Section 87A Zero-Tax Rebate Ceiling</td>
                    <td className="py-2 text-center text-emerald-600 font-bold">
                      {financialYear === '2025-26' ? 'Up to ₹12,00,000 Taxable' : 'Up to ₹7,00,000 Taxable'}
                    </td>
                    <td className="py-2 text-center">Up to ₹5,00,000 Taxable</td>
                  </tr>
                  <tr>
                    <td className="py-2">Employer NPS Contribution u/s 80CCD(2)</td>
                    <td className="py-2 text-center text-emerald-600 font-bold">
                      <CheckCircle2 className="w-4 h-4 inline mr-1" /> Up to 14% Basic
                    </td>
                    <td className="py-2 text-center text-emerald-600 font-bold">
                      <CheckCircle2 className="w-4 h-4 inline mr-1" /> Up to 10% Basic
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2">HRA Exemption u/s 10(13A) &amp; LTA</td>
                    <td className="py-2 text-center text-rose-500">
                      <XCircle className="w-4 h-4 inline mr-1" /> Not Allowed
                    </td>
                    <td className="py-2 text-center text-emerald-600 font-bold">
                      <CheckCircle2 className="w-4 h-4 inline mr-1" /> Allowed
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2">Section 80C (EPF, PPF, ELSS — ₹1.5L) &amp; 80D Health</td>
                    <td className="py-2 text-center text-rose-500">
                      <XCircle className="w-4 h-4 inline mr-1" /> Not Allowed
                    </td>
                    <td className="py-2 text-center text-emerald-600 font-bold">
                      <CheckCircle2 className="w-4 h-4 inline mr-1" /> Allowed
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2">Self-Occupied Home Loan Interest u/s 24(b) (₹2L)</td>
                    <td className="py-2 text-center text-rose-500">
                      <XCircle className="w-4 h-4 inline mr-1" /> Not Allowed
                    </td>
                    <td className="py-2 text-center text-emerald-600 font-bold">
                      <CheckCircle2 className="w-4 h-4 inline mr-1" /> Allowed
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <RelatedCalculatorsStrip
        links={[
          {
            title: 'HRA Exemption Calculator',
            path: '/finance/hra-exemption-calculator',
            desc: 'Calculate exact Section 10(13A) Rule 2A tax-exempt House Rent Allowance.',
          },
          {
            title: 'In-Hand Salary Calculator (India CTC)',
            path: '/finance/in-hand-salary-calculator',
            desc: 'Convert annual CTC into monthly in-hand salary after EPF, Professional Tax, and TDS.',
          },
          {
            title: 'SIP Calculator',
            path: '/compound-interest-calculator',
            desc: 'Model systematic mutual fund investments and ELSS 80C wealth creation.',
          },
        ]}
      />
    </div>
  );
}
