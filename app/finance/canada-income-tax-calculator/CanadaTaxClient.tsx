'use client';

import React, { useState, useMemo } from 'react';
import { calculateCanadaIncomeTax } from '@/lib/finance-core/tax-payroll-business-engines';
import { CANADA_TAX_DATA_2025 } from '@/lib/finance-core/tax-payroll-business-data';
import {
  UnboxedSlider,
  VerifiedSourceBadge,
  RelatedCalculatorsStrip,
  formatMoney,
  formatPct,
} from '@/components/calculator/CleanFinanceControls';
import { RotateCcw, Landmark, Info } from 'lucide-react';
import { useCurrency } from '@/lib/currency';

export default function CanadaTaxClient() {
  useCurrency();
  const [province, setProvince] = useState<'ON' | 'BC' | 'AB'>('ON');
  const [grossIncome, setGrossIncome] = useState<number>(95000);
  const [rrspDeduction, setRrspDeduction] = useState<number>(5000);

  const result = useMemo(
    () =>
      calculateCanadaIncomeTax({
        province,
        grossIncome,
        rrspDeduction,
      }),
    [province, grossIncome, rrspDeduction]
  );

  const handleReset = () => {
    setProvince('ON');
    setGrossIncome(95000);
    setRrspDeduction(5000);
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
              <span>Canada CRA 2025 Parameters</span>
            </div>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--muted)] hover:text-blue-600 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1.5">
              Province (Ontario, BC, Alberta Verified)
            </label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {(['ON', 'BC', 'AB'] as const).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setProvince(code)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                    province === code
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-[var(--surface)] text-[var(--text)] border-[var(--border)]'
                  }`}
                >
                  {CANADA_TAX_DATA_2025.provinces[code].name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                Annual Gross Income (CA$)
              </label>
              <input
                type="number"
                value={grossIncome}
                onChange={(e) => setGrossIncome(Math.max(0, Number(e.target.value)))}
                className="w-32 text-right rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-sm font-bold tabular-nums"
              />
            </div>
            <UnboxedSlider
              ariaLabel="Annual Gross Income CAD"
              min={20000}
              max={350000}
              step={2500}
              value={grossIncome}
              onChange={setGrossIncome}
              minLabel="CA$20k"
              midLabel="CA$185k"
              maxLabel="CA$350k"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                RRSP Deduction (CA$/yr)
              </label>
              <input
                type="number"
                value={rrspDeduction}
                onChange={(e) => setRrspDeduction(Math.max(0, Number(e.target.value)))}
                className="w-32 text-right rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-sm font-bold tabular-nums"
              />
            </div>
            <UnboxedSlider
              ariaLabel="RRSP Deduction CAD"
              min={0}
              max={32490}
              step={500}
              value={rrspDeduction}
              onChange={setRrspDeduction}
              minLabel="CA$0"
              midLabel="CA$16k"
              maxLabel="CA$32,490 Cap"
            />
          </div>

          <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/20 text-xs text-[var(--muted)] flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <span>
              Note: Quebec operates a separate tax return (Revenu Québec), QPP pension, and QPIP parental insurance
              system with a 16.5% federal tax abatement.
            </span>
          </div>
        </div>

        {/* OUTPUTS */}
        <div className="lg:col-span-7 space-y-5">
          <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-600/10 via-transparent to-emerald-500/5 p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  {result.provinceProfile.name} Net Take-Home Income (2025)
                </div>
                <div className="text-3xl font-extrabold tabular-nums text-[var(--text)] mt-1">
                  CA{formatMoney(result.netAnnual)}
                  <span className="text-sm font-semibold text-[var(--muted)] ml-1.5">/ year</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-semibold text-[var(--muted)]">
                  Combined Marginal / Average Rate
                </div>
                <div className="text-xl font-extrabold tabular-nums text-emerald-600 dark:text-emerald-400">
                  {formatPct(result.combinedMarginalRatePct, 2)} / {formatPct(result.averageTaxRatePct, 1)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 pt-4 border-t border-[var(--border)]">
              <div className="p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                <div className="text-[11px] text-[var(--muted)]">Monthly Net</div>
                <div className="text-sm font-bold tabular-nums">CA{formatMoney(result.netMonthly)}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                <div className="text-[11px] text-[var(--muted)]">Bi-Weekly Net</div>
                <div className="text-sm font-bold tabular-nums">CA{formatMoney(result.netBiWeekly)}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                <div className="text-[11px] text-[var(--muted)]">Total CPP (CPP1 + CPP2)</div>
                <div className="text-sm font-bold tabular-nums">CA{formatMoney(result.totalCpp, 'USD', 2)}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                <div className="text-[11px] text-[var(--muted)]">EI Premium</div>
                <div className="text-sm font-bold tabular-nums">CA{formatMoney(result.eiContribution, 'USD', 2)}</div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-5">
            <h3 className="text-sm font-bold text-[var(--text)] mb-3">
              2025 CRA Federal, {result.provinceProfile.name} Provincial, CPP/CPP2 &amp; EI Breakdown
            </h3>
            <table className="w-full text-xs border-collapse tabular-nums">
              <thead>
                <tr className="border-b border-[var(--border)] text-[var(--muted)] text-left font-bold">
                  <th className="py-2">Component</th>
                  <th className="py-2 text-right">Annual (CA$)</th>
                  <th className="py-2 text-right">Monthly (CA$)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                <tr>
                  <td className="py-2 font-semibold">Gross Annual Income</td>
                  <td className="py-2 text-right font-bold">CA{formatMoney(result.gross)}</td>
                  <td className="py-2 text-right">CA{formatMoney(result.gross / 12)}</td>
                </tr>
                <tr>
                  <td className="py-2">Federal Income Tax (after CA$16,129 Federal BPA credit)</td>
                  <td className="py-2 text-right text-rose-500">−CA{formatMoney(result.federalTax)}</td>
                  <td className="py-2 text-right">−CA{formatMoney(result.federalTax / 12)}</td>
                </tr>
                <tr>
                  <td className="py-2">
                    {result.provinceProfile.name} Provincial Tax (after CA${result.provinceProfile.bpa.toLocaleString()}{' '}
                    BPA)
                  </td>
                  <td className="py-2 text-right text-rose-500">−CA{formatMoney(result.provincialTax)}</td>
                  <td className="py-2 text-right">−CA{formatMoney(result.provincialTax / 12)}</td>
                </tr>
                <tr>
                  <td className="py-2">
                    CPP Tier 1 (5.95% up to CA$71,300 YMPE) + CPP2 (4% up to CA$81,200 YAMPE)
                  </td>
                  <td className="py-2 text-right">
                    −CA{formatMoney(result.cpp1Contribution, 'USD', 2)} / −CA
                    {formatMoney(result.cpp2Contribution, 'USD', 2)}
                  </td>
                  <td className="py-2 text-right">−CA{formatMoney(result.totalCpp / 12, 'USD', 2)}</td>
                </tr>
                <tr>
                  <td className="py-2">Employment Insurance (EI — 1.64% up to CA$65,700)</td>
                  <td className="py-2 text-right">−CA{formatMoney(result.eiContribution, 'USD', 2)}</td>
                  <td className="py-2 text-right">−CA{formatMoney(result.eiContribution / 12, 'USD', 2)}</td>
                </tr>
                <tr className="font-bold text-[var(--text)]">
                  <td className="py-2">Net Take-Home Pay (After RRSP &amp; Taxes)</td>
                  <td className="py-2 text-right text-emerald-600 dark:text-emerald-400">
                    CA{formatMoney(result.netAnnual)}
                  </td>
                  <td className="py-2 text-right">CA{formatMoney(result.netMonthly)}</td>
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
            desc: 'Convert annual compensation to hourly, bi-weekly, and weekly rates.',
          },
          {
            title: 'Savings Goal Calculator',
            path: '/compound-interest-calculator',
            desc: 'Plan monthly contributions and compound growth toward your savings target.',
          },
          {
            title: 'US State Take-Home Calculator',
            path: '/finance/us-state-take-home-calculator',
            desc: 'Compare Canadian take-home pay with US states.',
          },
        ]}
      />
    </div>
  );
}
