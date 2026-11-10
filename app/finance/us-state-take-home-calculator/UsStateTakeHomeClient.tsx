'use client';

import React, { useState, useMemo } from 'react';
import {
  US_STATE_TAX_PROFILES_2025,
  PRIORITY_US_STATES,
  US_FICA_2025,
} from '@/lib/finance-core/tax-payroll-business-data';
import { calculateUsStateTakeHome } from '@/lib/finance-core/tax-payroll-business-engines';
import { UsFilingStatus, FILING_STATUS_LABELS } from '@/lib/finance-core/us-federal-tax';
import {
  UnboxedSlider,
  VerifiedSourceBadge,
  RelatedCalculatorsStrip,
  formatMoney,
  formatPct,
} from '@/components/calculator/CleanFinanceControls';
import { RotateCcw, Wallet, MapPin, Layers, ShieldAlert } from 'lucide-react';
import { useCurrency } from '@/lib/currency';

export default function UsStateTakeHomeClient() {
  useCurrency();
  const [stateCode, setStateCode] = useState<string>('CA');
  const [annualSalary, setAnnualSalary] = useState<number>(115000);
  const [payFrequency, setPayFrequency] = useState<'weekly' | 'biweekly' | 'semimonthly' | 'monthly' | 'annual'>('biweekly');
  const [filingStatus, setFilingStatus] = useState<UsFilingStatus>('single');
  const [preTax401k, setPreTax401k] = useState<number>(6900);
  const [preTaxHsaAndHealth, setPreTaxHsaAndHealth] = useState<number>(2400);

  const result = useMemo(
    () =>
      calculateUsStateTakeHome({
        stateCode,
        annualSalary,
        payFrequency,
        filingStatus,
        preTax401k,
        preTaxHsaAndHealth,
        taxYear: '2025',
      }),
    [stateCode, annualSalary, payFrequency, filingStatus, preTax401k, preTaxHsaAndHealth]
  );

  // Compare across priority states (CA, NY, TX, FL, WA) for same salary
  const priorityComparison = useMemo(() => {
    return PRIORITY_US_STATES.map((code) =>
      calculateUsStateTakeHome({
        stateCode: code,
        annualSalary,
        payFrequency,
        filingStatus,
        preTax401k,
        preTaxHsaAndHealth,
        taxYear: '2025',
      })
    );
  }, [annualSalary, payFrequency, filingStatus, preTax401k, preTaxHsaAndHealth]);

  const gross = Math.max(1, result.grossAnnual);
  const netPct = (result.netAnnual / gross) * 100;
  const fedPct = (result.federalTax / gross) * 100;
  const ficaPct = (result.totalFica / gross) * 100;
  const statePct = ((result.stateIncomeTax + result.statePayrollTotal) / gross) * 100;
  const preTaxPct = (result.totalPreTax / gross) * 100;

  const handleReset = () => {
    setStateCode('CA');
    setAnnualSalary(115000);
    setPayFrequency('biweekly');
    setFilingStatus('single');
    setPreTax401k(6900);
    setPreTaxHsaAndHealth(2400);
  };

  return (
    <div className="space-y-6">
      <VerifiedSourceBadge
        authority={result.stateProfile.source.authority}
        document={`${result.stateProfile.source.document} + IRS Rev. Proc. 2024-40`}
        verifiedDate={result.stateProfile.source.verifiedDate}
        url={result.stateProfile.source.url}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: INPUTS */}
        <div className="lg:col-span-5 space-y-5 bg-[var(--bg)] border border-[var(--border)] rounded-2xl p-5">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
            <div className="flex items-center gap-2 font-bold text-sm text-[var(--text)]">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>State &amp; Paycheck Parameters</span>
            </div>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--muted)] hover:text-blue-600 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>

          {/* Priority States Quick-Select (CA, NY, TX, FL, WA first) */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
              Select US State (Priority Hub + All Verified States)
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {PRIORITY_US_STATES.map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setStateCode(code)}
                  className={`py-2 px-2 rounded-lg text-xs font-bold border transition ${
                    stateCode === code
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-[var(--surface)] text-[var(--text)] border-[var(--border)] hover:border-blue-500/40'
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>
            <select
              aria-label="Select US State"
              value={stateCode}
              onChange={(e) => setStateCode(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm font-semibold text-[var(--text)]"
            >
              {Object.values(US_STATE_TAX_PROFILES_2025).map((st) => (
                <option key={st.code} value={st.code}>
                  {st.name} ({st.code}) — {st.hasIncomeTax ? 'State Income Tax' : '0% State Income Tax'}
                </option>
              ))}
            </select>
          </div>

          {/* Gross Annual Salary */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                Gross Annual Salary
              </label>
              <input
                type="number"
                value={annualSalary}
                onChange={(e) => setAnnualSalary(Math.max(0, Number(e.target.value)))}
                className="w-36 text-right rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-sm font-bold tabular-nums"
              />
            </div>
            <UnboxedSlider
              ariaLabel="Gross Annual Salary"
              min={20000}
              max={500000}
              step={2500}
              value={annualSalary}
              onChange={setAnnualSalary}
              minLabel="$20k"
              midLabel="$250k"
              maxLabel="$500k"
            />
          </div>

          {/* Filing Status & Pay Frequency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1.5">
                Filing Status
              </label>
              <select
                aria-label="Filing Status"
                value={filingStatus}
                onChange={(e) => setFilingStatus(e.target.value as UsFilingStatus)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold"
              >
                {(Object.keys(FILING_STATUS_LABELS) as UsFilingStatus[]).map((st) => (
                  <option key={st} value={st}>
                    {FILING_STATUS_LABELS[st]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1.5">
                Pay Frequency
              </label>
              <select
                aria-label="Pay Frequency"
                value={payFrequency}
                onChange={(e) => setPayFrequency(e.target.value as 'biweekly' | 'semimonthly' | 'monthly' | 'weekly' | 'annual')}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold"
              >
                <option value="biweekly">Bi-Weekly (26 paychecks/yr)</option>
                <option value="semimonthly">Semi-Monthly (24 paychecks/yr)</option>
                <option value="monthly">Monthly (12 paychecks/yr)</option>
                <option value="weekly">Weekly (52 paychecks/yr)</option>
                <option value="annual">Annual (1 lump sum)</option>
              </select>
            </div>
          </div>

          {/* Pre-Tax 401(k) */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                Pre-Tax 401(k) Deferral ($/yr)
              </label>
              <input
                type="number"
                value={preTax401k}
                onChange={(e) => setPreTax401k(Math.max(0, Number(e.target.value)))}
                className="w-28 text-right rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-sm font-bold tabular-nums"
              />
            </div>
            <UnboxedSlider
              ariaLabel="Pre-Tax 401k Deferral"
              min={0}
              max={23500}
              step={500}
              value={preTax401k}
              onChange={setPreTax401k}
              minLabel="$0"
              midLabel="$12k"
              maxLabel="$23.5k IRS Cap"
            />
          </div>

          {/* Pre-Tax HSA & Medical */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                Pre-Tax HSA &amp; Medical ($/yr)
              </label>
              <input
                type="number"
                value={preTaxHsaAndHealth}
                onChange={(e) => setPreTaxHsaAndHealth(Math.max(0, Number(e.target.value)))}
                className="w-28 text-right rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-sm font-bold tabular-nums"
              />
            </div>
            <UnboxedSlider
              ariaLabel="Pre-Tax HSA and Medical"
              min={0}
              max={15000}
              step={250}
              value={preTaxHsaAndHealth}
              onChange={setPreTaxHsaAndHealth}
              minLabel="$0"
              midLabel="$7.5k"
              maxLabel="$15k"
            />
          </div>
        </div>

        {/* RIGHT COLUMN: OUTPUTS */}
        <div className="lg:col-span-7 space-y-5">
          {/* Primary Net Pay Hero Card */}
          <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-600/10 via-transparent to-emerald-500/5 p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  {result.stateProfile.name} Estimated Net Take-Home Pay
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold tabular-nums text-[var(--text)] mt-1">
                  {formatMoney(result.netAnnual)}
                  <span className="text-sm font-semibold text-[var(--muted)] ml-1.5">/ year</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-semibold text-[var(--muted)]">Selected Paycheck ({payFrequency})</div>
                <div className="text-2xl font-extrabold tabular-nums text-emerald-600 dark:text-emerald-400">
                  {formatMoney(result.netPerPaycheck, 'USD', 2)}
                </div>
              </div>
            </div>

            {/* Period Breakdown Grid (Year, Month, Bi-Weekly, Hour) */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mt-5 pt-4 border-t border-[var(--border)]">
              <div className="p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                <div className="text-[11px] text-[var(--muted)] font-medium">Monthly</div>
                <div className="text-sm font-bold tabular-nums">{formatMoney(result.netMonthly)}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                <div className="text-[11px] text-[var(--muted)] font-medium">Bi-Weekly (26)</div>
                <div className="text-sm font-bold tabular-nums">{formatMoney(result.netBiWeekly)}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                <div className="text-[11px] text-[var(--muted)] font-medium">Semi-Monthly (24)</div>
                <div className="text-sm font-bold tabular-nums">{formatMoney(result.netSemiMonthly)}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                <div className="text-[11px] text-[var(--muted)] font-medium">Weekly (52)</div>
                <div className="text-sm font-bold tabular-nums">{formatMoney(result.netWeekly)}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                <div className="text-[11px] text-[var(--muted)] font-medium">Net Hourly (2,080h)</div>
                <div className="text-sm font-bold tabular-nums">{formatMoney(result.netHourly, 'USD', 2)}/hr</div>
              </div>
            </div>
          </div>

          {/* Stacked Bar of Where the Money Goes */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[var(--text)] flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>Where Your Paycheck Goes (Gross-to-Net Allocation)</span>
              </h3>
              <span className="text-xs font-semibold text-[var(--muted)] tabular-nums">
                Effective Tax Rate: {formatPct(result.effectiveTaxRatePct, 1)}
              </span>
            </div>

            <div className="h-5 w-full rounded-full overflow-hidden flex bg-slate-200 dark:bg-slate-800">
              <div
                style={{ width: `${netPct}%` }}
                className="bg-emerald-500 h-full transition-all"
                title={`Take-Home Net: ${formatPct(netPct)}`}
              />
              <div
                style={{ width: `${fedPct}%` }}
                className="bg-blue-600 h-full transition-all"
                title={`Federal Tax: ${formatPct(fedPct)}`}
              />
              <div
                style={{ width: `${ficaPct}%` }}
                className="bg-amber-500 h-full transition-all"
                title={`FICA (SS + Medicare): ${formatPct(ficaPct)}`}
              />
              <div
                style={{ width: `${statePct}%` }}
                className="bg-rose-500 h-full transition-all"
                title={`State + SDI Payroll: ${formatPct(statePct)}`}
              />
              <div
                style={{ width: `${preTaxPct}%` }}
                className="bg-purple-500 h-full transition-all"
                title={`Pre-Tax 401(k)/HSA: ${formatPct(preTaxPct)}`}
              />
            </div>

            {/* Itemized Paycheck Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border)] text-[var(--muted)] font-bold text-left">
                    <th className="py-2">Paycheck Component</th>
                    <th className="py-2 text-right">Annual</th>
                    <th className="py-2 text-right">Per Paycheck</th>
                    <th className="py-2 text-right">% of Gross</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)] tabular-nums">
                  <tr>
                    <td className="py-2 font-semibold flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Net Take-Home Pay
                    </td>
                    <td className="py-2 text-right font-bold text-emerald-600 dark:text-emerald-400">
                      {formatMoney(result.netAnnual)}
                    </td>
                    <td className="py-2 text-right font-bold">{formatMoney(result.netPerPaycheck, 'USD', 2)}</td>
                    <td className="py-2 text-right">{formatPct(netPct)}</td>
                  </tr>
                  <tr>
                    <td className="py-2 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> US Federal Income Tax (Marginal{' '}
                      {result.federalMarginalRate}%)
                    </td>
                    <td className="py-2 text-right">{formatMoney(result.federalTax)}</td>
                    <td className="py-2 text-right">
                      {formatMoney((result.federalTax / result.grossAnnual) * result.grossPerPaycheck, 'USD', 2)}
                    </td>
                    <td className="py-2 text-right">{formatPct(fedPct)}</td>
                  </tr>
                  <tr>
                    <td className="py-2 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> FICA: Social Security ($
                      {US_FICA_2025.socialSecurityWageBase.toLocaleString()} cap) + Medicare
                    </td>
                    <td className="py-2 text-right">{formatMoney(result.totalFica)}</td>
                    <td className="py-2 text-right">
                      {formatMoney((result.totalFica / result.grossAnnual) * result.grossPerPaycheck, 'USD', 2)}
                    </td>
                    <td className="py-2 text-right">{formatPct(ficaPct)}</td>
                  </tr>
                  <tr>
                    <td className="py-2 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> {result.stateProfile.name} State Income
                      Tax (Marginal {result.stateMarginalRatePct.toFixed(2)}%)
                    </td>
                    <td className="py-2 text-right">{formatMoney(result.stateIncomeTax)}</td>
                    <td className="py-2 text-right">
                      {formatMoney((result.stateIncomeTax / result.grossAnnual) * result.grossPerPaycheck, 'USD', 2)}
                    </td>
                    <td className="py-2 text-right">{formatPct((result.stateIncomeTax / gross) * 100)}</td>
                  </tr>
                  {result.statePayrollBreakdown.map((item) => (
                    <tr key={item.name}>
                      <td className="py-2 pl-4 text-[var(--muted)]">↳ {item.name}</td>
                      <td className="py-2 text-right">{formatMoney(item.amount)}</td>
                      <td className="py-2 text-right">
                        {formatMoney((item.amount / result.grossAnnual) * result.grossPerPaycheck, 'USD', 2)}
                      </td>
                      <td className="py-2 text-right">{formatPct((item.amount / gross) * 100, 2)}</td>
                    </tr>
                  ))}
                  <tr>
                    <td className="py-2 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Pre-Tax Deductions (401k + HSA)
                    </td>
                    <td className="py-2 text-right">{formatMoney(result.totalPreTax)}</td>
                    <td className="py-2 text-right">
                      {formatMoney((result.totalPreTax / result.grossAnnual) * result.grossPerPaycheck, 'USD', 2)}
                    </td>
                    <td className="py-2 text-right">{formatPct(preTaxPct)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/20 text-xs text-[var(--muted)]">
              <strong className="text-[var(--text)]">{result.stateProfile.name} Statutory Note:</strong>{' '}
              {result.stateProfile.uniqueRuleHighlight}
            </div>
          </div>

          {/* Priority States Comparison Matrix (CA, NY, TX, FL, WA) */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-5 space-y-3">
            <h3 className="text-sm font-bold text-[var(--text)]">
              How {formatMoney(annualSalary)} Compares Across Top 5 US States (CA, NY, TX, FL, WA)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
              {priorityComparison.map((stRes) => (
                <button
                  key={stRes.stateProfile.code}
                  type="button"
                  onClick={() => setStateCode(stRes.stateProfile.code)}
                  className={`p-3 rounded-xl border text-left transition ${
                    stRes.stateProfile.code === stateCode
                      ? 'border-blue-600 bg-blue-500/10'
                      : 'border-[var(--border)] bg-[var(--surface)] hover:border-blue-500/40'
                  }`}
                >
                  <div className="text-xs font-bold text-[var(--text)]">{stRes.stateProfile.name}</div>
                  <div className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums mt-0.5">
                    {formatMoney(stRes.netAnnual)}
                  </div>
                  <div className="text-[10px] text-[var(--muted)] tabular-nums">
                    State + SDI: {formatMoney(stRes.stateIncomeTax + stRes.statePayrollTotal)}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <RelatedCalculatorsStrip
        links={[
          {
            title: 'US Federal Income Tax Calculator',
            path: '/finance/us-federal-income-tax-calculator',
            desc: 'Full 2025 IRS progressive bracket breakdown, standard vs itemized deductions, and tax credits.',
          },
          {
            title: '401(k) Retirement Calculator',
            path: '/finance/401k-calculator',
            desc: 'Model pre-tax 401(k) contributions, employer matching, and SECURE 2.0 catch-up limits.',
          },
          {
            title: 'Salary to Hourly Calculator',
            path: '/finance/salary-to-hourly-calculator',
            desc: 'Convert annual salary into hourly, daily, weekly, and bi-weekly pay rates.',
          },
        ]}
      />
    </div>
  );
}
