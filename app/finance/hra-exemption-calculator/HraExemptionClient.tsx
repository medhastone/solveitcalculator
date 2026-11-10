'use client';

import React, { useState, useMemo } from 'react';
import { calculateHraExemption } from '@/lib/finance-core/tax-payroll-business-engines';
import {
  UnboxedSlider,
  VerifiedSourceBadge,
  RelatedCalculatorsStrip,
  formatMoney,
} from '@/components/calculator/CleanFinanceControls';
import { RotateCcw, Home, CheckCircle2, Info } from 'lucide-react';
import { useCurrency } from '@/lib/currency';

export default function HraExemptionClient() {
  useCurrency();
  const [basicSalaryAnnual, setBasicSalaryAnnual] = useState<number>(720000);
  const [dearnessAllowanceAnnual, setDearnessAllowanceAnnual] = useState<number>(0);
  const [hraReceivedAnnual, setHraReceivedAnnual] = useState<number>(360000);
  const [rentPaidAnnual, setRentPaidAnnual] = useState<number>(300000);
  const [isMetroCity, setIsMetroCity] = useState<boolean>(true);

  const result = useMemo(
    () =>
      calculateHraExemption({
        basicSalaryAnnual,
        dearnessAllowanceAnnual,
        hraReceivedAnnual,
        rentPaidAnnual,
        isMetroCity,
      }),
    [basicSalaryAnnual, dearnessAllowanceAnnual, hraReceivedAnnual, rentPaidAnnual, isMetroCity]
  );

  const handleReset = () => {
    setBasicSalaryAnnual(720000);
    setDearnessAllowanceAnnual(0);
    setHraReceivedAnnual(360000);
    setRentPaidAnnual(300000);
    setIsMetroCity(true);
  };

  return (
    <div className="space-y-6">
      <VerifiedSourceBadge
        authority={result.source.authority}
        document="Income Tax Act Section 10(13A) & Income Tax Rule 2A"
        verifiedDate={result.source.verifiedDate}
        url={result.source.url}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* INPUTS */}
        <div className="lg:col-span-5 space-y-4 bg-[var(--bg)] border border-[var(--border)] rounded-2xl p-5">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
            <div className="flex items-center gap-2 font-bold text-sm text-[var(--text)]">
              <Home className="w-4 h-4 text-blue-600" />
              <span>Section 10(13A) HRA Inputs (Annual ₹)</span>
            </div>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--muted)] hover:text-blue-600 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>

          {/* Metro vs Non-Metro Toggle */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1.5">
              City Classification (Statutory Rule 2A)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsMetroCity(true)}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                  isMetroCity
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-[var(--surface)] text-[var(--text)] border-[var(--border)]'
                }`}
              >
                Metro (50% Cap)
              </button>
              <button
                type="button"
                onClick={() => setIsMetroCity(false)}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                  !isMetroCity
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-[var(--surface)] text-[var(--text)] border-[var(--border)]'
                }`}
              >
                Non-Metro (40% Cap)
              </button>
            </div>
            <div className="text-[11px] text-[var(--muted)] mt-1">
              Verified Rule 2A Metro Cities: <strong>{result.metroCities.join(', ')}</strong> (Bengaluru, Hyderabad,
              Pune, and Gurugram are classified as Non-Metro 40% under Rule 2A).
            </div>
          </div>

          {/* Basic Salary */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                Basic Salary (₹/year)
              </label>
              <input
                type="number"
                value={basicSalaryAnnual}
                onChange={(e) => setBasicSalaryAnnual(Math.max(0, Number(e.target.value)))}
                className="w-32 text-right rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-sm font-bold tabular-nums"
              />
            </div>
            <UnboxedSlider
              ariaLabel="Basic Salary Annual"
              min={120000}
              max={3600000}
              step={20000}
              value={basicSalaryAnnual}
              onChange={setBasicSalaryAnnual}
              minLabel="₹1.2L"
              midLabel="₹18L"
              maxLabel="₹36L"
            />
          </div>

          {/* Dearness Allowance */}
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
              Dearness Allowance (DA ₹/year)
            </label>
            <input
              type="number"
              value={dearnessAllowanceAnnual}
              onChange={(e) => setDearnessAllowanceAnnual(Math.max(0, Number(e.target.value)))}
              className="w-32 text-right rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-sm font-bold tabular-nums"
            />
          </div>

          {/* HRA Received */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                HRA Received from Employer (₹/yr)
              </label>
              <input
                type="number"
                value={hraReceivedAnnual}
                onChange={(e) => setHraReceivedAnnual(Math.max(0, Number(e.target.value)))}
                className="w-32 text-right rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-sm font-bold tabular-nums"
              />
            </div>
            <UnboxedSlider
              ariaLabel="HRA Received Annual"
              min={0}
              max={1800000}
              step={12000}
              value={hraReceivedAnnual}
              onChange={setHraReceivedAnnual}
              minLabel="₹0"
              midLabel="₹9L"
              maxLabel="₹18L"
            />
          </div>

          {/* Rent Paid */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                Actual Rent Paid (₹/year)
              </label>
              <input
                type="number"
                value={rentPaidAnnual}
                onChange={(e) => setRentPaidAnnual(Math.max(0, Number(e.target.value)))}
                className="w-32 text-right rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-sm font-bold tabular-nums"
              />
            </div>
            <UnboxedSlider
              ariaLabel="Actual Rent Paid Annual"
              min={0}
              max={1800000}
              step={12000}
              value={rentPaidAnnual}
              onChange={setRentPaidAnnual}
              minLabel="₹0"
              midLabel="₹9L"
              maxLabel="₹18L"
            />
          </div>
        </div>

        {/* OUTPUTS */}
        <div className="lg:col-span-7 space-y-5">
          {/* Exempt vs Taxable Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Tax-Exempt HRA u/s 10(13A)
              </div>
              <div className="text-3xl font-extrabold tabular-nums text-emerald-600 dark:text-emerald-400 mt-1">
                {formatMoney(result.exemptHraAnnual, 'INR')}
                <span className="text-xs font-normal text-[var(--muted)] ml-1.5">/ year</span>
              </div>
              <div className="text-xs font-semibold text-[var(--text)] mt-1 tabular-nums">
                Monthly Exempt: {formatMoney(result.exemptHraMonthly, 'INR')}/month
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-rose-500/30 bg-rose-500/5">
              <div className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                Taxable HRA Added to Salary
              </div>
              <div className="text-3xl font-extrabold tabular-nums text-[var(--text)] mt-1">
                {formatMoney(result.taxableHraAnnual, 'INR')}
                <span className="text-xs font-normal text-[var(--muted)] ml-1.5">/ year</span>
              </div>
              <div className="text-xs font-semibold text-[var(--muted)] mt-1 tabular-nums">
                Monthly Taxable: {formatMoney(result.taxableHraMonthly, 'INR')}/month
              </div>
            </div>
          </div>

          {/* 3-Limit Rule 2A Breakdown */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[var(--text)]">
                Income Tax Rule 2A: Least of the Three Statutory Limits Applied
              </h3>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                Governing Limit: {result.governingRuleLabel}
              </span>
            </div>

            <div className="space-y-2.5 text-xs tabular-nums">
              {[
                {
                  label: '1. Actual HRA Received from Employer',
                  val: result.limit1ActualHra,
                },
                {
                  label: '2. Actual Rent Paid minus 10% of (Basic + DA)',
                  val: result.limit2RentMinus10Pct,
                },
                {
                  label: isMetroCity
                    ? '3. 50% of (Basic + DA) for Metro City (Delhi, Mumbai, Kolkata, Chennai)'
                    : '3. 40% of (Basic + DA) for Non-Metro City',
                  val: result.limit3MetroPct,
                },
              ].map((lim) => {
                const isMin = lim.val === result.exemptHraAnnual;
                return (
                  <div
                    key={lim.label}
                    className={`p-3 rounded-xl border flex items-center justify-between ${
                      isMin
                        ? 'border-emerald-500 bg-emerald-500/10 font-bold text-[var(--text)]'
                        : 'border-[var(--border)] bg-[var(--surface)] text-[var(--muted)]'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {isMin && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                      {lim.label}
                    </span>
                    <span className="text-sm font-extrabold">{formatMoney(lim.val, 'INR')}</span>
                  </div>
                );
              })}
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-[var(--muted)] flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Old Regime Only &amp; Landlord PAN Rule:</strong> Section 10(13A) HRA exemption can only be
                claimed under the <strong>Old Tax Regime</strong>. If your annual rent paid exceeds{' '}
                <strong>₹1,00,000</strong> (₹8,333/month), furnishing your landlord&apos;s PAN to your employer is
                mandatory under CBDT Circular No. 8/2013.
              </span>
            </div>
          </div>
        </div>
      </div>

      <RelatedCalculatorsStrip
        links={[
          {
            title: 'India Income Tax Calculator',
            path: '/finance/india-income-tax-calculator',
            desc: 'Compare how your HRA exemption impacts Old Regime vs New Regime tax.',
          },
          {
            title: 'In-Hand Salary Calculator (CTC)',
            path: '/finance/in-hand-salary-calculator',
            desc: 'Compute monthly net in-hand pay from your annual CTC package.',
          },
          {
            title: 'Rent vs Buy / Mortgage Calculator',
            path: '/mortgage-calculator',
            desc: 'Model monthly home loan payments vs renting.',
          },
        ]}
      />
    </div>
  );
}
