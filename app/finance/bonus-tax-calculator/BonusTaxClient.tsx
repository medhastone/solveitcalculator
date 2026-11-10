'use client';

import React, { useState, useMemo } from 'react';
import { calculateBonusTax } from '@/lib/finance-core/tax-payroll-business-engines';
import { US_STATE_TAX_PROFILES_2025 } from '@/lib/finance-core/tax-payroll-business-data';
import { UsFilingStatus, FILING_STATUS_LABELS } from '@/lib/finance-core/us-federal-tax';
import {
  UnboxedSlider,
  VerifiedSourceBadge,
  RelatedCalculatorsStrip,
  formatMoney,
  formatPct,
} from '@/components/calculator/CleanFinanceControls';
import { RotateCcw, Sparkles, Info } from 'lucide-react';
import { useCurrency } from '@/lib/currency';

export default function BonusTaxClient() {
  useCurrency();
  const [bonusAmount, setBonusAmount] = useState<number>(20000);
  const [annualSalary, setAnnualSalary] = useState<number>(115000);
  const [filingStatus, setFilingStatus] = useState<UsFilingStatus>('single');
  const [stateCode, setStateCode] = useState<string>('CA');
  const [withholdingMethod, setWithholdingMethod] = useState<'flat_supplemental' | 'aggregate'>('flat_supplemental');
  const [bonus401kDeferralPct, setBonus401kDeferralPct] = useState<number>(6);

  const result = useMemo(
    () =>
      calculateBonusTax({
        bonusAmount,
        annualSalary,
        filingStatus,
        stateCode,
        withholdingMethod,
        bonus401kDeferralPct,
      }),
    [bonusAmount, annualSalary, filingStatus, stateCode, withholdingMethod, bonus401kDeferralPct]
  );

  const handleReset = () => {
    setBonusAmount(20000);
    setAnnualSalary(115000);
    setFilingStatus('single');
    setStateCode('CA');
    setWithholdingMethod('flat_supplemental');
    setBonus401kDeferralPct(6);
  };

  return (
    <div className="space-y-6">
      <VerifiedSourceBadge
        authority={result.source.authority}
        document="IRS Publication 15 (Circular E) — Section 7 Supplemental Wages (22% / 37%)"
        verifiedDate={result.source.verifiedDate}
        url={result.source.url}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* INPUTS */}
        <div className="lg:col-span-5 space-y-4 bg-[var(--bg)] border border-[var(--border)] rounded-2xl p-5">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
            <div className="flex items-center gap-2 font-bold text-sm text-[var(--text)]">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Bonus &amp; Withholding Parameters</span>
            </div>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--muted)] hover:text-blue-600 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                Gross Bonus Amount ($)
              </label>
              <input
                type="number"
                value={bonusAmount}
                onChange={(e) => setBonusAmount(Math.max(0, Number(e.target.value)))}
                className="w-32 text-right rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-sm font-bold tabular-nums"
              />
            </div>
            <UnboxedSlider
              ariaLabel="Gross Bonus Amount"
              min={1000}
              max={250000}
              step={1000}
              value={bonusAmount}
              onChange={setBonusAmount}
              minLabel="$1k"
              midLabel="$125k"
              maxLabel="$250k"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                Base Annual Salary ($/yr)
              </label>
              <input
                type="number"
                value={annualSalary}
                onChange={(e) => setAnnualSalary(Math.max(0, Number(e.target.value)))}
                className="w-32 text-right rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-sm font-bold tabular-nums"
              />
            </div>
            <UnboxedSlider
              ariaLabel="Base Annual Salary"
              min={25000}
              max={400000}
              step={5000}
              value={annualSalary}
              onChange={setAnnualSalary}
              minLabel="$25k"
              midLabel="$176.1k SS Cap"
              maxLabel="$400k"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
                US State
              </label>
              <select
                aria-label="US State"
                value={stateCode}
                onChange={(e) => setStateCode(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold"
              >
                {Object.values(US_STATE_TAX_PROFILES_2025).map((st) => (
                  <option key={st.code} value={st.code}>
                    {st.name} ({(st.supplementalBonusRate * 100).toFixed(2)}% Supp.)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
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
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
              IRS Payroll Withholding Method
            </label>
            <select
              aria-label="IRS Payroll Withholding Method"
              value={withholdingMethod}
              onChange={(e) => setWithholdingMethod(e.target.value as 'flat_supplemental' | 'aggregate')}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold"
            >
              <option value="flat_supplemental">Flat Supplemental Rate (22% up to $1M; 37% above $1M)</option>
              <option value="aggregate">Aggregate Method (Marginal Bracket on Combined Pay)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                Pre-Tax 401(k) Deferral from Bonus: {bonus401kDeferralPct}%
              </label>
              <span className="text-xs font-bold text-blue-600 tabular-nums">
                {formatMoney(result.deferral401k)}
              </span>
            </div>
            <UnboxedSlider
              ariaLabel="401k Deferral Percentage from Bonus"
              min={0}
              max={50}
              step={1}
              value={bonus401kDeferralPct}
              onChange={setBonus401kDeferralPct}
              minLabel="0%"
              midLabel="25%"
              maxLabel="50%"
            />
          </div>
        </div>

        {/* OUTPUTS */}
        <div className="lg:col-span-7 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5">
              <div className="text-[11px] font-bold uppercase text-emerald-600 dark:text-emerald-400">
                Net Bonus Check In-Hand
              </div>
              <div className="text-2xl font-extrabold tabular-nums text-emerald-600 dark:text-emerald-400 mt-1">
                {formatMoney(result.netBonusCheck, 'USD', 2)}
              </div>
              <div className="text-xs text-[var(--muted)] mt-1">
                From {formatMoney(bonusAmount)} gross bonus
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-blue-500/30 bg-blue-500/5">
              <div className="text-[11px] font-bold uppercase text-blue-600 dark:text-blue-400">
                Federal Withheld Today
              </div>
              <div className="text-2xl font-extrabold tabular-nums mt-1">
                {formatMoney(result.federalWithheldOnPaycheck)}
              </div>
              <div className="text-xs text-[var(--muted)] mt-1">
                Actual Marginal Tax: {formatMoney(result.actualFederalLiabilityOnBonus)}
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg)]">
              <div className="text-[11px] font-bold uppercase text-[var(--muted)]">
                Total Tax Withholding Rate
              </div>
              <div className="text-2xl font-extrabold tabular-nums mt-1">
                {formatPct(result.effectiveWithholdingRatePct, 1)}
              </div>
              <div className="text-xs text-[var(--muted)] mt-1">
                Fed + FICA + {result.stateProfile.code} State
              </div>
            </div>
          </div>

          {/* Withholding vs Actual Liability Reconciliation Box */}
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 space-y-2 text-xs">
            <div className="font-bold text-sm text-amber-800 dark:text-amber-300 flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0" />
              <span>Why Bonuses Feel &quot;Taxed Higher&quot;: Withholding vs. Actual Liability at Filing</span>
            </div>
            <p className="text-[var(--muted)] leading-relaxed">
              Bonuses are <strong>not taxed at a special penalty rate</strong> on your April Form 1040 return—they are
              simply added to your ordinary taxable income. However, under IRS Publication 15, employers usually
              withhold a flat <strong>22%</strong> on supplemental wages up to $1M ({formatMoney(result.flatFederalWithholding)}).
              Based on your {formatMoney(annualSalary)} base salary, the actual federal tax owed on this bonus at your
              marginal bracket is <strong>{formatMoney(result.actualFederalLiabilityOnBonus)}</strong>.
              {Math.abs(result.withholdingMinusActualFederal) > 10 && (
                <>
                  {' '}
                  This means your paycheck withholding{' '}
                  <strong>
                    {result.withholdingMinusActualFederal > 0
                      ? `over-withholds by ${formatMoney(result.withholdingMinusActualFederal)} (which increases your April tax refund)`
                      : `under-withholds by ${formatMoney(Math.abs(result.withholdingMinusActualFederal))} (which reduces your refund or adds to your balance due at filing)`}
                  </strong>
                  .
                </>
              )}
            </p>
          </div>

          {/* Itemized Bonus Paycheck Table */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-5">
            <h3 className="text-sm font-bold text-[var(--text)] mb-3">
              Itemized Bonus Paycheck Withholding Breakdown
            </h3>
            <table className="w-full text-xs border-collapse tabular-nums">
              <tbody className="divide-y divide-[var(--border)]">
                <tr>
                  <td className="py-2 font-semibold">Gross Bonus Amount</td>
                  <td className="py-2 text-right font-bold">{formatMoney(result.bonus, 'USD', 2)}</td>
                </tr>
                <tr>
                  <td className="py-2">Pre-Tax 401(k) Deferral ({bonus401kDeferralPct}%)</td>
                  <td className="py-2 text-right">−{formatMoney(result.deferral401k, 'USD', 2)}</td>
                </tr>
                <tr>
                  <td className="py-2">Federal Supplemental Tax Withholding</td>
                  <td className="py-2 text-right text-rose-500">
                    −{formatMoney(result.federalWithheldOnPaycheck, 'USD', 2)}
                  </td>
                </tr>
                <tr>
                  <td className="py-2">Social Security (6.2% up to remaining $176,100 cap) + Medicare</td>
                  <td className="py-2 text-right">−{formatMoney(result.totalFica, 'USD', 2)}</td>
                </tr>
                <tr>
                  <td className="py-2">{result.stateProfile.name} State Supplemental &amp; SDI Withholding</td>
                  <td className="py-2 text-right">−{formatMoney(result.stateWithholding, 'USD', 2)}</td>
                </tr>
                <tr className="font-bold text-[var(--text)]">
                  <td className="py-2">Net Bonus Paycheck In-Hand</td>
                  <td className="py-2 text-right text-emerald-600 dark:text-emerald-400">
                    {formatMoney(result.netBonusCheck, 'USD', 2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <RelatedCalculatorsStrip
        links={[
          {
            title: 'US Federal Income Tax Calculator',
            path: '/finance/us-federal-income-tax-calculator',
            desc: 'See how your bonus stacks into your 2025 IRS progressive brackets.',
          },
          {
            title: 'US State Take-Home Calculator',
            path: '/finance/us-state-take-home-calculator',
            desc: 'Calculate your regular bi-weekly and monthly paycheck by state.',
          },
          {
            title: '401(k) Calculator',
            path: '/finance/401k-calculator',
            desc: 'See how deferring part of your bonus into your 401(k) compounds by retirement.',
          },
        ]}
      />
    </div>
  );
}
