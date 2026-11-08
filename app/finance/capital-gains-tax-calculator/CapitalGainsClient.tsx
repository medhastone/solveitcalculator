'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { calculateUsCapitalGains } from '@/lib/finance-core/tax-payroll-business-engines';
import { UsFilingStatus, FILING_STATUS_LABELS } from '@/lib/finance-core/us-federal-tax';
import {
  UnboxedSlider,
  VerifiedSourceBadge,
  RelatedCalculatorsStrip,
  formatMoney,
  formatPct,
} from '@/components/calculator/CleanFinanceControls';
import { RotateCcw, TrendingUp, Calendar, ArrowUpRight, AlertCircle } from 'lucide-react';

export default function CapitalGainsClient() {
  const [assetType, setAssetType] = useState<'stocks_crypto' | 'real_estate' | 'collectibles'>('stocks_crypto');
  const [purchasePrice, setPurchasePrice] = useState<number>(40000);
  const [salePrice, setSalePrice] = useState<number>(95000);
  const [sellingFees, setSellingFees] = useState<number>(500);
  const [purchaseDate, setPurchaseDate] = useState<string>('2023-05-15');
  const [saleDate, setSaleDate] = useState<string>('2025-08-20');
  const [filingStatus, setFilingStatus] = useState<UsFilingStatus>('single');
  const [otherTaxableIncome, setOtherTaxableIncome] = useState<number>(85000);

  const result = useMemo(
    () =>
      calculateUsCapitalGains({
        assetType,
        purchasePrice,
        salePrice,
        sellingFees,
        purchaseDate,
        saleDate,
        filingStatus,
        otherTaxableIncome,
      }),
    [assetType, purchasePrice, salePrice, sellingFees, purchaseDate, saleDate, filingStatus, otherTaxableIncome]
  );

  const handleReset = () => {
    setAssetType('stocks_crypto');
    setPurchasePrice(40000);
    setSalePrice(95000);
    setSellingFees(500);
    setPurchaseDate('2023-05-15');
    setSaleDate('2025-08-20');
    setFilingStatus('single');
    setOtherTaxableIncome(85000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex-1 min-w-[280px]">
          <VerifiedSourceBadge
            authority={result.source.authority}
            document={result.source.document}
            verifiedDate={result.source.verifiedDate}
            url={result.source.url}
          />
        </div>
        <Link
          href="/finance/india-capital-gains-tax-calculator"
          className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 transition"
        >
          <span>Looking for India LTCG / STCG (Sec 112A / 111A)?</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* INPUTS */}
        <div className="lg:col-span-5 space-y-4 bg-[var(--bg)] border border-[var(--border)] rounded-2xl p-5">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
            <div className="flex items-center gap-2 font-bold text-sm text-[var(--text)]">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span>US Asset &amp; Holding Parameters</span>
            </div>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--muted)] hover:text-blue-600 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>

          {/* Asset Type & Filing Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
                Asset Class
              </label>
              <select
                aria-label="Asset Class"
                value={assetType}
                onChange={(e) => setAssetType(e.target.value as 'stocks_crypto' | 'real_estate' | 'collectibles')}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold"
              >
                <option value="stocks_crypto">Stocks, ETFs, Bonds &amp; Crypto</option>
                <option value="real_estate">Investment Real Estate</option>
                <option value="collectibles">Collectibles / Physical Gold (28% Max LTCG)</option>
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

          {/* Purchase Price */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                Purchase Price (Cost Basis)
              </label>
              <input
                type="number"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(Math.max(0, Number(e.target.value)))}
                className="w-32 text-right rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-sm font-bold tabular-nums"
              />
            </div>
            <UnboxedSlider
              ariaLabel="Purchase Price"
              min={0}
              max={500000}
              step={2500}
              value={purchasePrice}
              onChange={setPurchasePrice}
              minLabel="$0"
              midLabel="$250k"
              maxLabel="$500k"
            />
          </div>

          {/* Sale Price */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                Gross Sale Price
              </label>
              <input
                type="number"
                value={salePrice}
                onChange={(e) => setSalePrice(Math.max(0, Number(e.target.value)))}
                className="w-32 text-right rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-sm font-bold tabular-nums"
              />
            </div>
            <UnboxedSlider
              ariaLabel="Sale Price"
              min={0}
              max={500000}
              step={2500}
              value={salePrice}
              onChange={setSalePrice}
              minLabel="$0"
              midLabel="$250k"
              maxLabel="$500k"
            />
          </div>

          {/* Selling Fees & Commissions */}
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
              Selling Fees / Commissions ($)
            </label>
            <input
              type="number"
              value={sellingFees}
              onChange={(e) => setSellingFees(Math.max(0, Number(e.target.value)))}
              className="w-32 text-right rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-sm font-bold tabular-nums"
            />
          </div>

          {/* Purchase & Sale Dates */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
                Purchase Date
              </label>
              <input
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
                Sale Date
              </label>
              <input
                type="date"
                value={saleDate}
                onChange={(e) => setSaleDate(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold"
              />
            </div>
          </div>

          {/* Other Taxable Income */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                Other Taxable Ordinary Income ($/yr)
              </label>
              <input
                type="number"
                value={otherTaxableIncome}
                onChange={(e) => setOtherTaxableIncome(Math.max(0, Number(e.target.value)))}
                className="w-32 text-right rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-sm font-bold tabular-nums"
              />
            </div>
            <UnboxedSlider
              ariaLabel="Other Taxable Income"
              min={0}
              max={600000}
              step={5000}
              value={otherTaxableIncome}
              onChange={setOtherTaxableIncome}
              minLabel="$0"
              midLabel="$300k"
              maxLabel="$600k"
            />
          </div>
        </div>

        {/* OUTPUTS */}
        <div className="lg:col-span-7 space-y-5">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg)]">
              <div className="text-[11px] font-bold uppercase text-[var(--muted)]">
                {result.rawGain >= 0 ? 'Net Capital Gain' : 'Net Capital Loss'}
              </div>
              <div
                className={`text-xl font-extrabold tabular-nums mt-1 ${
                  result.rawGain >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'
                }`}
              >
                {formatMoney(result.rawGain)}
              </div>
              <div className="text-[11px] text-[var(--muted)] mt-0.5">After {formatMoney(sellingFees)} fees</div>
            </div>

            <div className="p-4 rounded-2xl border border-blue-500/30 bg-blue-500/5">
              <div className="text-[11px] font-bold uppercase text-blue-600 dark:text-blue-400">
                Total Capital Gains Tax
              </div>
              <div className="text-xl font-extrabold tabular-nums mt-1">{formatMoney(result.totalTax)}</div>
              <div className="text-[11px] text-[var(--muted)] mt-0.5">
                Effective: {formatPct(result.effectiveTaxRatePct, 1)}
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5">
              <div className="text-[11px] font-bold uppercase text-emerald-600 dark:text-emerald-400">
                Net Cash Proceeds
              </div>
              <div className="text-xl font-extrabold tabular-nums mt-1">{formatMoney(result.netProceeds)}</div>
              <div className="text-[11px] text-[var(--muted)] mt-0.5">Sale minus fees &amp; tax</div>
            </div>

            <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg)]">
              <div className="text-[11px] font-bold uppercase text-[var(--muted)]">Holding Period</div>
              <div className="text-lg font-extrabold tabular-nums mt-1">
                {result.isLongTerm ? 'Long-Term' : 'Short-Term'}
              </div>
              <div className="text-[11px] text-[var(--muted)] mt-0.5">
                {result.holdingDays.toLocaleString()} days ({result.isLongTerm ? '> 365 days' : '≤ 365 days'})
              </div>
            </div>
          </div>

          {/* Loss Offset Card OR Bracket Stacking Breakdown */}
          {result.rawGain < 0 ? (
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 space-y-2 text-xs">
              <div className="font-bold text-sm text-amber-800 dark:text-amber-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>IRS Capital Loss Offset &amp; Carryforward (IRC § 1211(b))</span>
              </div>
              <p className="text-[var(--muted)] leading-relaxed">
                Your net capital loss of <strong>{formatMoney(Math.abs(result.rawGain))}</strong> first offsets any
                other capital gains realized this tax year. Up to{' '}
                <strong>{formatMoney(result.deductibleLossThisYear)}</strong> ($3,000 limit, or $1,500 if Married
                Filing Separately) can be deducted directly against your ordinary W-2/business income this year, and
                the remaining <strong>{formatMoney(result.carryforwardLoss)}</strong> carries forward indefinitely to
                future tax years on Schedule D.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-5 space-y-4">
              <h3 className="text-sm font-bold text-[var(--text)]">
                2025 IRS Capital Gains Bracket Stacking &amp; 3.8% NIIT Breakdown
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[var(--border)] text-[var(--muted)] text-left font-bold">
                      <th className="py-2">Tax Layer</th>
                      <th className="py-2 text-right">Gain Subject to Rate</th>
                      <th className="py-2 text-right">Statutory Rate</th>
                      <th className="py-2 text-right">Tax Liability</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)] tabular-nums">
                    {result.bracketBreakdown.map((b, i) => (
                      <tr key={i}>
                        <td className="py-2 font-semibold">
                          {result.isLongTerm ? `Long-Term Bracket (${b.ratePct}%)` : 'Short-Term Ordinary Income Rate'}
                        </td>
                        <td className="py-2 text-right">{formatMoney(b.amount)}</td>
                        <td className="py-2 text-right">{formatPct(b.ratePct, 1)}</td>
                        <td className="py-2 text-right font-bold">{formatMoney(b.tax)}</td>
                      </tr>
                    ))}
                    <tr>
                      <td className="py-2 font-semibold">
                        Net Investment Income Tax (NIIT — IRC § 1411 above $200k/$250k MAGI)
                      </td>
                      <td className="py-2 text-right">
                        {result.niitTax > 0 ? formatMoney(result.niitTax / 0.038) : '$0'}
                      </td>
                      <td className="py-2 text-right">3.8%</td>
                      <td className="py-2 text-right font-bold">{formatMoney(result.niitTax)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      <RelatedCalculatorsStrip
        links={[
          {
            title: 'India Capital Gains Tax Calculator',
            path: '/finance/india-capital-gains-tax-calculator',
            desc: 'Dedicated India LTCG (12.5% above ₹1.25L u/s 112A) & STCG (20% u/s 111A) calculator.',
          },
          {
            title: 'ROI Calculator',
            path: '/finance/roi-calculator',
            desc: 'Calculate total and annualized return on investment across multi-year holdings.',
          },
          {
            title: 'CAGR Calculator',
            path: '/finance/cagr-calculator',
            desc: 'Compute Compound Annual Growth Rate and volatility drag.',
          },
        ]}
      />
    </div>
  );
}
