'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { calculateIndiaCapitalGains } from '@/lib/finance-core/tax-payroll-business-engines';
import {
  UnboxedSlider,
  VerifiedSourceBadge,
  RelatedCalculatorsStrip,
  formatMoney,
  formatPct,
} from '@/components/calculator/CleanFinanceControls';
import { RotateCcw, TrendingUp, ArrowUpRight } from 'lucide-react';
import { useCurrency } from '@/lib/currency';

export default function IndiaCapitalGainsClient() {
  useCurrency();
  const [assetCategory, setAssetCategory] = useState<'listed_equity_mf' | 'unlisted_real_estate_gold' | 'debt_mf'>(
    'listed_equity_mf'
  );
  const [purchasePrice, setPurchasePrice] = useState<number>(500000);
  const [salePrice, setSalePrice] = useState<number>(1250000);
  const [transferExpenses, setTransferExpenses] = useState<number>(5000);
  const [holdingMonths, setHoldingMonths] = useState<number>(18);
  const [slabRatePct, setSlabRatePct] = useState<number>(30);

  const result = useMemo(
    () =>
      calculateIndiaCapitalGains({
        assetCategory,
        purchasePrice,
        salePrice,
        transferExpenses,
        holdingMonths,
        slabRatePct,
      }),
    [assetCategory, purchasePrice, salePrice, transferExpenses, holdingMonths, slabRatePct]
  );

  const handleReset = () => {
    setAssetCategory('listed_equity_mf');
    setPurchasePrice(500000);
    setSalePrice(1250000);
    setTransferExpenses(5000);
    setHoldingMonths(18);
    setSlabRatePct(30);
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
          href="/finance/capital-gains-tax-calculator"
          className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 transition"
        >
          <span>Switch to US Capital Gains Calculator</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 lg:items-stretch gap-6">
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4 bg-[var(--bg)] border border-[var(--border)] rounded-2xl p-5">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
            <div className="flex items-center gap-2 font-bold text-sm text-[var(--text)]">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span>India Capital Gains Inputs (Sec 112A / 111A)</span>
            </div>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--muted)] hover:text-blue-600 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
              Asset Category (Finance Act 2024/25)
            </label>
            <select
              aria-label="Asset Category"
              value={assetCategory}
              onChange={(e) => setAssetCategory(e.target.value as 'listed_equity_mf' | 'unlisted_real_estate_gold' | 'debt_mf')}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-xs font-semibold"
            >
              <option value="listed_equity_mf">
                Listed Equity Shares &amp; Equity Mutual Funds (STT Paid — Sec 112A / 111A)
              </option>
              <option value="unlisted_real_estate_gold">
                Real Estate, Physical Gold &amp; Unlisted Shares (24-Mo LTCG @ 12.5%)
              </option>
              <option value="debt_mf">Specified Debt Mutual Funds (Sec 50AA — Taxed at Slab Rate)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                Purchase Cost (₹)
              </label>
              <input
                type="number"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(Math.max(0, Number(e.target.value)))}
                className="w-36 text-right rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-sm font-bold tabular-nums"
              />
            </div>
            <UnboxedSlider
              ariaLabel="Purchase Cost"
              min={10000}
              max={10000000}
              step={25000}
              value={purchasePrice}
              onChange={setPurchasePrice}
              minLabel="₹10k"
              midLabel="₹50L"
              maxLabel="₹1Cr"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                Sale Value (₹)
              </label>
              <input
                type="number"
                value={salePrice}
                onChange={(e) => setSalePrice(Math.max(0, Number(e.target.value)))}
                className="w-36 text-right rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-sm font-bold tabular-nums"
              />
            </div>
            <UnboxedSlider
              ariaLabel="Sale Value"
              min={10000}
              max={15000000}
              step={25000}
              value={salePrice}
              onChange={setSalePrice}
              minLabel="₹10k"
              midLabel="₹75L"
              maxLabel="₹1.5Cr"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                Holding Period: {holdingMonths} Months
              </label>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                {result.isLongTerm ? 'Long-Term (LTCG)' : 'Short-Term (STCG)'}
              </span>
            </div>
            <UnboxedSlider
              ariaLabel="Holding Period Months"
              min={1}
              max={60}
              step={1}
              value={holdingMonths}
              onChange={setHoldingMonths}
              minLabel="1 mo"
              midLabel={`${result.ltcgThresholdMonths} mo cutoff`}
              maxLabel="60 mo"
            />
          </div>
        </div>

        <div className="lg:col-span-7 space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg)]">
              <div className="text-[11px] font-bold uppercase text-[var(--muted)]">Total Capital Gain</div>
              <div className="text-xl font-extrabold tabular-nums text-emerald-600 dark:text-emerald-400 mt-1">
                {formatMoney(result.gain, 'INR')}
              </div>
              <div className="text-[11px] text-[var(--muted)] mt-0.5">
                {result.isLongTerm ? 'Long-Term Gain' : 'Short-Term Gain'}
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5">
              <div className="text-[11px] font-bold uppercase text-emerald-600 dark:text-emerald-400">
                Sec 112A Exemption
              </div>
              <div className="text-xl font-extrabold tabular-nums mt-1">
                {formatMoney(result.exemptionApplied, 'INR')}
              </div>
              <div className="text-[11px] text-[var(--muted)] mt-0.5">Up to ₹1,25,000/FY</div>
            </div>

            <div className="p-4 rounded-2xl border border-blue-500/30 bg-blue-500/5">
              <div className="text-[11px] font-bold uppercase text-blue-600 dark:text-blue-400">
                Total Tax + 4% Cess
              </div>
              <div className="text-xl font-extrabold tabular-nums mt-1">{formatMoney(result.totalTax, 'INR')}</div>
              <div className="text-[11px] text-[var(--muted)] mt-0.5">Base Rate: {result.baseTaxRatePct}%</div>
            </div>

            <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg)]">
              <div className="text-[11px] font-bold uppercase text-[var(--muted)]">Net Post-Tax Proceeds</div>
              <div className="text-xl font-extrabold tabular-nums mt-1">{formatMoney(result.netProceeds, 'INR')}</div>
              <div className="text-[11px] text-[var(--muted)] mt-0.5">In-hand realization</div>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-5 space-y-3 text-xs">
            <h3 className="text-sm font-bold text-[var(--text)]">
              India Capital Gains Tax Computation (Finance (No. 2) Act, 2024 Rules)
            </h3>
            <div className="divide-y divide-[var(--border)] tabular-nums">
              <div className="py-2 flex justify-between">
                <span>Net Realized Capital Gain (Sale minus Purchase &amp; Brokerage)</span>
                <span className="font-bold">{formatMoney(result.gain, 'INR')}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span>Less: Section 112A Annual LTCG Exemption (₹1,25,000 limit for Listed Equity/MF)</span>
                <span className="font-bold text-emerald-600">−{formatMoney(result.exemptionApplied, 'INR')}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span>Net Taxable Capital Gain</span>
                <span className="font-bold">{formatMoney(result.taxableGain, 'INR')}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span>Base Capital Gains Tax ({result.baseTaxRatePct}%)</span>
                <span className="font-semibold">{formatMoney(result.baseTax, 'INR')}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span>Health &amp; Education Cess (4% on Base Tax)</span>
                <span className="font-semibold">{formatMoney(result.cessAmount, 'INR')}</span>
              </div>
              <div className="py-2 flex justify-between font-bold text-sm text-[var(--text)]">
                <span>Total Capital Gains Tax Payable</span>
                <span>{formatMoney(result.totalTax, 'INR')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <RelatedCalculatorsStrip
        links={[
          {
            title: 'India Income Tax Calculator',
            path: '/finance/india-income-tax-calculator',
            desc: 'Compare FY 2025-26 & 2024-25 New vs Old Regime slabs, Section 87A rebate, and take-home pay.',
          },
          {
            title: 'SIP Calculator',
            path: '/compound-interest-calculator',
            desc: 'Model systematic equity mutual fund compounding and step-up returns.',
          },
          {
            title: 'US Capital Gains Calculator',
            path: '/finance/capital-gains-tax-calculator',
            desc: 'Calculate US IRS short-term/long-term capital gains and 3.8% NIIT.',
          },
        ]}
      />
    </div>
  );
}
