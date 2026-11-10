'use client';

import React, { useState, useMemo } from 'react';
import { calculateMarkup } from '@/lib/finance-core/tax-payroll-business-engines';
import {
  UnboxedSlider,
  RelatedCalculatorsStrip,
  formatMoney,
  formatPct,
} from '@/components/calculator/CleanFinanceControls';
import { RotateCcw, Tag } from 'lucide-react';
import { useCurrency } from '@/lib/currency';

export default function MarkupClient() {
  useCurrency();
  const [mode, setMode] = useState<'cost_and_markup' | 'cost_and_price'>('cost_and_markup');
  const [cost, setCost] = useState<number>(80);
  const [markupPct, setMarkupPct] = useState<number>(50);
  const [sellingPrice, setSellingPrice] = useState<number>(120);
  const [discountPct, setDiscountPct] = useState<number>(0);
  const [taxGstVatPct, setTaxGstVatPct] = useState<number>(8.25);

  const result = useMemo(
    () =>
      calculateMarkup({
        mode,
        cost,
        markupPct,
        sellingPrice,
        discountPct,
        taxGstVatPct,
      }),
    [mode, cost, markupPct, sellingPrice, discountPct, taxGstVatPct]
  );

  const handleReset = () => {
    setMode('cost_and_markup');
    setCost(80);
    setMarkupPct(50);
    setSellingPrice(120);
    setDiscountPct(0);
    setTaxGstVatPct(8.25);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* INPUTS */}
        <div className="lg:col-span-5 space-y-4 bg-[var(--bg)] border border-[var(--border)] rounded-2xl p-5">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
            <div className="flex items-center gap-2 font-bold text-sm text-[var(--text)]">
              <Tag className="w-4 h-4 text-blue-600" />
              <span>Cost, Markup, Discount &amp; Tax</span>
            </div>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--muted)] hover:text-blue-600 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setMode('cost_and_markup')}
              className={`py-2 px-2 rounded-xl text-xs font-bold border transition ${
                mode === 'cost_and_markup'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-[var(--surface)] text-[var(--text)] border-[var(--border)]'
              }`}
            >
              Cost + Markup %
            </button>
            <button
              type="button"
              onClick={() => setMode('cost_and_price')}
              className={`py-2 px-2 rounded-xl text-xs font-bold border transition ${
                mode === 'cost_and_price'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-[var(--surface)] text-[var(--text)] border-[var(--border)]'
              }`}
            >
              Cost + List Price
            </button>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                Unit Cost ($)
              </label>
              <input
                type="number"
                value={cost}
                onChange={(e) => setCost(Math.max(0, Number(e.target.value)))}
                className="w-28 text-right rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-sm font-bold tabular-nums"
              />
            </div>
            <UnboxedSlider
              ariaLabel="Unit Cost"
              min={1}
              max={1000}
              step={1}
              value={cost}
              onChange={setCost}
              minLabel="$1"
              midLabel="$500"
              maxLabel="$1,000"
            />
          </div>

          {mode === 'cost_and_markup' ? (
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                  Markup Percentage: {markupPct}%
                </label>
                <input
                  type="number"
                  value={markupPct}
                  onChange={(e) => setMarkupPct(Number(e.target.value))}
                  className="w-24 text-right rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-sm font-bold tabular-nums"
                />
              </div>
              <UnboxedSlider
                ariaLabel="Markup Percentage"
                min={0}
                max={300}
                step={5}
                value={markupPct}
                onChange={setMarkupPct}
                minLabel="0%"
                midLabel="100% Keystone"
                maxLabel="300%"
              />
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                  List Selling Price ($)
                </label>
                <input
                  type="number"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(Math.max(0, Number(e.target.value)))}
                  className="w-28 text-right rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-sm font-bold tabular-nums"
                />
              </div>
            </div>
          )}

          {/* Optional Promotional Discount & Sales Tax / GST / VAT */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
                Promo Discount (%)
              </label>
              <input
                type="number"
                min={0}
                max={95}
                value={discountPct}
                onChange={(e) => setDiscountPct(Math.max(0, Math.min(95, Number(e.target.value))))}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-bold tabular-nums"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
                Sales Tax / GST / VAT (%)
              </label>
              <input
                type="number"
                min={0}
                max={50}
                step={0.25}
                value={taxGstVatPct}
                onChange={(e) => setTaxGstVatPct(Math.max(0, Number(e.target.value)))}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-bold tabular-nums"
              />
            </div>
          </div>
        </div>

        {/* OUTPUTS */}
        <div className="lg:col-span-7 space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl border border-blue-500/30 bg-blue-500/5">
              <div className="text-[11px] font-bold uppercase text-blue-600 dark:text-blue-400">
                Net Pre-Tax Price
              </div>
              <div className="text-2xl font-extrabold tabular-nums mt-1">
                {formatMoney(result.netSellingPricePreTax, 'USD', 2)}
              </div>
              <div className="text-[11px] text-[var(--muted)] mt-0.5">
                List: {formatMoney(result.listPrice, 'USD', 2)}
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5">
              <div className="text-[11px] font-bold uppercase text-emerald-600 dark:text-emerald-400">
                Gross Profit
              </div>
              <div className="text-2xl font-extrabold tabular-nums text-emerald-600 dark:text-emerald-400 mt-1">
                {formatMoney(result.profit, 'USD', 2)}
              </div>
              <div className="text-[11px] text-[var(--muted)] mt-0.5">
                Effective Markup: {formatPct(result.effectiveMarkupPct, 1)}
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg)]">
              <div className="text-[11px] font-bold uppercase text-[var(--muted)]">Equivalent Margin %</div>
              <div className="text-2xl font-extrabold tabular-nums mt-1">{formatPct(result.grossMarginPct, 2)}</div>
              <div className="text-[11px] text-[var(--muted)] mt-0.5">Profit ÷ Net Selling Price</div>
            </div>

            <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg)]">
              <div className="text-[11px] font-bold uppercase text-[var(--muted)]">Customer Total (+Tax)</div>
              <div className="text-2xl font-extrabold tabular-nums mt-1">
                {formatMoney(result.finalCustomerPriceWithTax, 'USD', 2)}
              </div>
              <div className="text-[11px] text-[var(--muted)] mt-0.5">
                Includes {formatMoney(result.taxAmount, 'USD', 2)} tax
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-5 space-y-2 text-xs">
            <h3 className="text-sm font-bold text-[var(--text)]">
              Pricing Breakdown &amp; Promotional Discount Impact
            </h3>
            <div className="divide-y divide-[var(--border)] tabular-nums">
              <div className="py-2 flex justify-between">
                <span>1. Base Unit Cost (COGS)</span>
                <span className="font-bold">{formatMoney(result.cost, 'USD', 2)}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span>2. Initial List Price (Before Promo Discount)</span>
                <span className="font-bold">{formatMoney(result.listPrice, 'USD', 2)}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span>3. Net Selling Price After {discountPct}% Discount</span>
                <span className="font-bold text-blue-600">{formatMoney(result.netSellingPricePreTax, 'USD', 2)}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span>4. Sales Tax / GST / VAT ({taxGstVatPct}%)</span>
                <span>+{formatMoney(result.taxAmount, 'USD', 2)}</span>
              </div>
              <div className="py-2 flex justify-between font-bold text-[var(--text)]">
                <span>5. Final Tax-Inclusive Checkout Price</span>
                <span>{formatMoney(result.finalCustomerPriceWithTax, 'USD', 2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <RelatedCalculatorsStrip
        links={[
          {
            title: 'Margin Calculator',
            path: '/finance/margin-calculator',
            desc: 'Solve for Gross Margin %, Selling Price, or Cost from any two values.',
          },
          {
            title: 'Break-Even Calculator',
            path: '/finance/break-even-calculator',
            desc: 'Calculate break-even units and revenue from fixed and variable costs.',
          },
          {
            title: 'Profit Margin Calculator',
            path: '/finance/profit-margin-calculator',
            desc: 'Compare Gross, EBITDA, Operating, and Net Margins against industry benchmarks.',
          },
        ]}
      />
    </div>
  );
}
