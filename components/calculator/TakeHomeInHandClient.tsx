'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  calculateIndiaInHandSalary,
  calculateUsStateTakeHome,
} from '@/lib/finance-core/tax-payroll-business-engines';
import {
  INDIA_TAX_DATA,
  US_STATE_TAX_PROFILES_2025,
} from '@/lib/finance-core/tax-payroll-business-data';
import {
  UnboxedSlider,
  VerifiedSourceBadge,
  RelatedCalculatorsStrip,
  formatMoney,
} from '@/components/calculator/CleanFinanceControls';
import { RotateCcw, Wallet, Building2 } from 'lucide-react';

export default function TakeHomeInHandClient({ initialMode }: { initialMode: 'us' | 'india' }) {
  const [mode, setMode] = useState<'us' | 'india'>(initialMode);

  // India CTC-to-In-Hand Inputs
  const [annualCtc, setAnnualCtc] = useState<number>(1800000);
  const [basicPctOfCtc, setBasicPctOfCtc] = useState<number>(40);
  const [hraPctOfBasic, setHraPctOfBasic] = useState<number>(50);
  const [epfCapAtStatutoryCeiling, setEpfCapAtStatutoryCeiling] = useState<boolean>(false);
  const [includeGratuityInCtc, setIncludeGratuityInCtc] = useState<boolean>(true);
  const [indiaState, setIndiaState] = useState<keyof typeof INDIA_TAX_DATA.professionalTaxByStateAnnual>('MH');
  const [regime, setRegime] = useState<'new' | 'old'>('new');
  const [deduction80CExtra, setDeduction80CExtra] = useState<number>(50000);
  const [rentPaidAnnual, setRentPaidAnnual] = useState<number>(240000);
  const [isMetroCity, setIsMetroCity] = useState<boolean>(true);

  // US Paycheck Inputs
  const [usStateCode, setUsStateCode] = useState<string>('CA');
  const [usSalary, setUsSalary] = useState<number>(110000);
  const [us401k, setUs401k] = useState<number>(6600);
  const [usHsa, setUsHsa] = useState<number>(2000);

  const indiaResult = useMemo(
    () =>
      calculateIndiaInHandSalary({
        annualCtc,
        basicPctOfCtc,
        hraPctOfBasic,
        epfCapAtStatutoryCeiling,
        includeGratuityInCtc,
        stateCode: indiaState,
        regime,
        deduction80CExtra,
        rentPaidAnnual,
        isMetroCity,
      }),
    [
      annualCtc,
      basicPctOfCtc,
      hraPctOfBasic,
      epfCapAtStatutoryCeiling,
      includeGratuityInCtc,
      indiaState,
      regime,
      deduction80CExtra,
      rentPaidAnnual,
      isMetroCity,
    ]
  );

  const usResult = useMemo(
    () =>
      calculateUsStateTakeHome({
        stateCode: usStateCode,
        annualSalary: usSalary,
        payFrequency: 'monthly',
        filingStatus: 'single',
        preTax401k: us401k,
        preTaxHsaAndHealth: usHsa,
      }),
    [usStateCode, usSalary, us401k, usHsa]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex-1 min-w-[280px]">
          {mode === 'india' ? (
            <VerifiedSourceBadge
              authority={INDIA_TAX_DATA.source.authority}
              document="EPFO Act (12% PF / ₹15,000 ceiling), State PT & Section 115BAC TDS"
              verifiedDate={INDIA_TAX_DATA.source.verifiedDate}
              url={INDIA_TAX_DATA.source.url}
            />
          ) : (
            <VerifiedSourceBadge
              authority={usResult.stateProfile.source.authority}
              document="IRS Rev. Proc. 2024-40, FICA & State Withholding"
              verifiedDate={usResult.stateProfile.source.verifiedDate}
              url={usResult.stateProfile.source.url}
            />
          )}
        </div>

        {/* Mode Switcher */}
        <div className="inline-flex rounded-xl border border-[var(--border)] bg-[var(--bg)] p-1 text-xs font-bold">
          <button
            type="button"
            onClick={() => setMode('india')}
            className={`px-3 py-1.5 rounded-lg transition ${
              mode === 'india' ? 'bg-blue-600 text-white shadow-sm' : 'text-[var(--muted)]'
            }`}
          >
            🇮🇳 India CTC to In-Hand
          </button>
          <button
            type="button"
            onClick={() => setMode('us')}
            className={`px-3 py-1.5 rounded-lg transition ${
              mode === 'us' ? 'bg-blue-600 text-white shadow-sm' : 'text-[var(--muted)]'
            }`}
          >
            🇺🇸 US Take-Home Paycheck
          </button>
        </div>
      </div>

      {mode === 'india' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:items-stretch gap-6">
          {/* INDIA CTC INPUTS */}
          <div className="lg:col-span-5 flex flex-col justify-start gap-5 bg-[var(--bg)] border border-[var(--border)] rounded-2xl p-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                <div className="flex items-center gap-2 font-bold text-sm text-[var(--text)]">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span>India CTC Package &amp; EPF Rules</span>
                </div>
                <button
                  onClick={() => {
                    setAnnualCtc(1800000);
                    setBasicPctOfCtc(40);
                    setHraPctOfBasic(50);
                    setEpfCapAtStatutoryCeiling(false);
                    setIncludeGratuityInCtc(true);
                    setRegime('new');
                  }}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--muted)] hover:text-blue-600 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset
                </button>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                    Annual Cost to Company (CTC ₹)
                  </label>
                  <input
                    type="number"
                    value={annualCtc}
                    onChange={(e) => setAnnualCtc(Math.max(0, Number(e.target.value)))}
                    className="w-36 text-right rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-sm font-bold tabular-nums"
                  />
                </div>
                <UnboxedSlider
                  ariaLabel="Annual CTC INR"
                  min={300000}
                  max={6000000}
                  step={50000}
                  value={annualCtc}
                  onChange={setAnnualCtc}
                  minLabel="₹3L"
                  midLabel="₹18L"
                  maxLabel="₹60L"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
                    Basic % of CTC ({basicPctOfCtc}%)
                  </label>
                  <UnboxedSlider
                    ariaLabel="Basic Percentage of CTC"
                    min={30}
                    max={60}
                    step={5}
                    value={basicPctOfCtc}
                    onChange={setBasicPctOfCtc}
                    minLabel="30%"
                    maxLabel="60%"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
                    HRA % of Basic ({hraPctOfBasic}%)
                  </label>
                  <UnboxedSlider
                    ariaLabel="HRA Percentage of Basic"
                    min={0}
                    max={60}
                    step={5}
                    value={hraPctOfBasic}
                    onChange={setHraPctOfBasic}
                    minLabel="0%"
                    maxLabel="60%"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
                    State (Professional Tax)
                  </label>
                  <select
                    aria-label="India State Professional Tax"
                    value={indiaState}
                    onChange={(e) => setIndiaState(e.target.value as keyof typeof INDIA_TAX_DATA.professionalTaxByStateAnnual)}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold"
                  >
                    {Object.entries(INDIA_TAX_DATA.professionalTaxByStateAnnual).map(([code, st]) => (
                      <option key={code} value={code}>
                        {st.name} (₹{st.annualTax}/yr)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
                    Income Tax Regime (TDS)
                  </label>
                  <select
                    aria-label="Income Tax Regime"
                    value={regime}
                    onChange={(e) => setRegime(e.target.value as 'new' | 'old')}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold"
                  >
                    <option value="new">New Regime (FY 2025-26 Default)</option>
                    <option value="old">Old Regime (With HRA &amp; 80C)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <label className="flex items-center gap-2 text-xs font-semibold text-[var(--text)] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={epfCapAtStatutoryCeiling}
                    onChange={(e) => setEpfCapAtStatutoryCeiling(e.target.checked)}
                    className="rounded border-[var(--border)] text-blue-600"
                  />
                  <span>Cap Employee/Employer PF at ₹1,800/mo (12% of ₹15,000 EPFO Wage Ceiling)</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold text-[var(--text)] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeGratuityInCtc}
                    onChange={(e) => setIncludeGratuityInCtc(e.target.checked)}
                    className="rounded border-[var(--border)] text-blue-600"
                  />
                  <span>Deduct Employer Gratuity (4.81% of Basic) from CTC</span>
                </label>
              </div>
            </div>

            <div className="hidden lg:flex flex-col justify-between gap-2.5 pt-4 border-t border-[var(--border)]">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
                Quick CTC Package Tiers
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[800000, 1200000, 1800000, 3000000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAnnualCtc(preset)}
                    className={`px-2 py-1.5 rounded-lg border text-xs font-bold tabular-nums transition ${
                      annualCtc === preset
                        ? 'border-blue-600 bg-blue-500/10 text-blue-600 dark:text-blue-400'
                        : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:border-blue-500/40'
                    }`}
                  >
                    ₹{(preset / 100000).toFixed(0)}L
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* INDIA CTC OUTPUTS */}
          <div className="lg:col-span-7 space-y-5">
            <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-600/10 via-transparent to-emerald-500/5 p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    Monthly In-Hand Salary (Net Bank Credit)
                  </div>
                  <div className="text-3xl sm:text-4xl font-extrabold tabular-nums text-emerald-600 dark:text-emerald-400 mt-1">
                    {formatMoney(indiaResult.netInHandMonthly, 'INR')}
                    <span className="text-sm font-semibold text-[var(--muted)] ml-1.5">/ month</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-semibold text-[var(--muted)]">Annual Net In-Hand</div>
                  <div className="text-2xl font-extrabold tabular-nums text-[var(--text)]">
                    {formatMoney(indiaResult.netInHandAnnual, 'INR')}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-5">
              <h3 className="text-sm font-bold text-[var(--text)] mb-3">
                Complete CTC-to-In-Hand Payslip Breakdown (Annual &amp; Monthly)
              </h3>
              <table className="w-full text-xs border-collapse tabular-nums">
                <thead>
                  <tr className="border-b border-[var(--border)] text-[var(--muted)] text-left font-bold">
                    <th className="py-2">Salary Component</th>
                    <th className="py-2 text-right">Monthly (₹)</th>
                    <th className="py-2 text-right">Annual (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  <tr>
                    <td className="py-2 font-bold">Total Cost to Company (CTC)</td>
                    <td className="py-2 text-right font-bold">{formatMoney(indiaResult.ctc / 12, 'INR')}</td>
                    <td className="py-2 text-right font-bold">{formatMoney(indiaResult.ctc, 'INR')}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-[var(--muted)]">Less: Employer EPF (12%) &amp; Gratuity (4.81%) in CTC</td>
                    <td className="py-2 text-right text-rose-500">
                      −{formatMoney((indiaResult.employerPfAnnual + indiaResult.gratuityAnnual) / 12, 'INR')}
                    </td>
                    <td className="py-2 text-right text-rose-500">
                      −{formatMoney(indiaResult.employerPfAnnual + indiaResult.gratuityAnnual, 'INR')}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 font-semibold">Gross Salary (Basic + HRA + Special Allowance)</td>
                    <td className="py-2 text-right font-semibold">
                      {formatMoney(indiaResult.grossSalaryAnnual / 12, 'INR')}
                    </td>
                    <td className="py-2 text-right font-semibold">
                      {formatMoney(indiaResult.grossSalaryAnnual, 'INR')}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2">Less: Employee EPF Deduction (12% of Basic)</td>
                    <td className="py-2 text-right">−{formatMoney(indiaResult.employeePfAnnual / 12, 'INR')}</td>
                    <td className="py-2 text-right">−{formatMoney(indiaResult.employeePfAnnual, 'INR')}</td>
                  </tr>
                  <tr>
                    <td className="py-2">Less: State Professional Tax ({indiaResult.ptProfile.name})</td>
                    <td className="py-2 text-right">−{formatMoney(indiaResult.professionalTaxAnnual / 12, 'INR')}</td>
                    <td className="py-2 text-right">−{formatMoney(indiaResult.professionalTaxAnnual, 'INR')}</td>
                  </tr>
                  <tr>
                    <td className="py-2">Less: Income Tax TDS ({regime === 'new' ? 'New Regime' : 'Old Regime'})</td>
                    <td className="py-2 text-right text-rose-500">−{formatMoney(indiaResult.annualTds / 12, 'INR')}</td>
                    <td className="py-2 text-right text-rose-500">−{formatMoney(indiaResult.annualTds, 'INR')}</td>
                  </tr>
                  <tr className="font-bold text-[var(--text)]">
                    <td className="py-2">Net Take-Home (In-Hand) Salary</td>
                    <td className="py-2 text-right text-emerald-600 dark:text-emerald-400">
                      {formatMoney(indiaResult.netInHandMonthly, 'INR')}
                    </td>
                    <td className="py-2 text-right text-emerald-600 dark:text-emerald-400">
                      {formatMoney(indiaResult.netInHandAnnual, 'INR')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:items-stretch gap-6">
          {/* US TAKE-HOME MODE */}
          <div className="lg:col-span-5 flex flex-col justify-start gap-5 bg-[var(--bg)] border border-[var(--border)] rounded-2xl p-5">
            <div className="space-y-4">
              <div className="font-bold text-sm text-[var(--text)] pb-2 border-b border-[var(--border)]">
                US Paycheck Mode (Powered by #30 &amp; #31 Engines)
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-[var(--muted)] mb-1">US State</label>
                <select
                  aria-label="US State"
                  value={usStateCode}
                  onChange={(e) => setUsStateCode(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold"
                >
                  {Object.values(US_STATE_TAX_PROFILES_2025).map((st) => (
                    <option key={st.code} value={st.code}>
                      {st.name} ({st.code})
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase text-[var(--muted)]">Annual Salary ($)</label>
                  <input
                    type="number"
                    value={usSalary}
                    onChange={(e) => setUsSalary(Math.max(0, Number(e.target.value)))}
                    className="w-32 text-right rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-sm font-bold tabular-nums"
                  />
                </div>
                <UnboxedSlider
                  ariaLabel="US Annual Salary"
                  min={25000}
                  max={400000}
                  step={2500}
                  value={usSalary}
                  onChange={setUsSalary}
                  minLabel="$25k"
                  midLabel="$200k"
                  maxLabel="$400k"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-[var(--muted)] mb-1">401(k) ($/yr)</label>
                  <input
                    type="number"
                    value={us401k}
                    onChange={(e) => setUs401k(Math.max(0, Number(e.target.value)))}
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1.5 text-xs font-bold tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[var(--muted)] mb-1">HSA/Health ($/yr)</label>
                  <input
                    type="number"
                    value={usHsa}
                    onChange={(e) => setUsHsa(Math.max(0, Number(e.target.value)))}
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1.5 text-xs font-bold tabular-nums"
                  />
                </div>
              </div>
            </div>

            <div className="hidden lg:flex flex-col justify-between gap-2 pt-3 border-t border-[var(--border)]">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
                Quick US Salary Benchmarks
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[65000, 105000, 160000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setUsSalary(preset)}
                    className={`px-2 py-1 rounded-lg border text-xs font-bold tabular-nums transition ${
                      usSalary === preset
                        ? 'border-blue-600 bg-blue-500/10 text-blue-600 dark:text-blue-400'
                        : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:border-blue-500/40'
                    }`}
                  >
                    ${(preset / 1000).toFixed(0)}k
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-5">
              <div className="text-xs font-bold uppercase text-blue-600 dark:text-blue-400">
                US Monthly Take-Home Pay ({usResult.stateProfile.name})
              </div>
              <div className="text-3xl font-extrabold tabular-nums mt-1">
                {formatMoney(usResult.netMonthly, 'USD', 2)}/month
                <span className="text-sm font-normal text-[var(--muted)] ml-2">
                  ({formatMoney(usResult.netAnnual)}/year | {formatMoney(usResult.netBiWeekly, 'USD', 2)} bi-weekly)
                </span>
              </div>
              <div className="mt-3 text-xs text-[var(--muted)]">
                Federal Tax: {formatMoney(usResult.federalTax)} | FICA: {formatMoney(usResult.totalFica)} | State + SDI:{' '}
                {formatMoney(usResult.stateIncomeTax + usResult.statePayrollTotal)}
              </div>
            </div>
          </div>
        </div>
      )}

      <RelatedCalculatorsStrip
        links={[
          {
            title: 'India Income Tax Calculator',
            path: '/finance/india-income-tax-calculator',
            desc: 'Compare FY 2025-26 New vs Old Regime slabs and Section 87A rebate.',
          },
          {
            title: 'HRA Exemption Calculator',
            path: '/finance/hra-exemption-calculator',
            desc: 'Calculate tax-free House Rent Allowance under Section 10(13A).',
          },
          {
            title: 'Salary to Hourly Calculator',
            path: '/finance/salary-to-hourly-calculator',
            desc: 'Convert annual compensation across hourly, bi-weekly, and monthly periods.',
          },
        ]}
      />
    </div>
  );
}
