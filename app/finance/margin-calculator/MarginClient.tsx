'use client';

import React, { useState, useMemo } from 'react';
import { calculateMargin } from '@/lib/finance-core/tax-payroll-business-engines';
import {
  UnboxedSlider,
  RelatedCalculatorsStrip,
  formatMoney,
  formatPct,
} from '@/components/calculator/CleanFinanceControls';
import { RotateCcw, Percent } from 'lucide-react';

export default function MarginClient() {
  const [mode, setMode] = useState<'cost_and_price' | 'cost_and_margin' | 'revenue_and_margin'>('cost_and_price');
  const [cost, setCost] = useState<number>(60);
  const [priceOrRevenue, setPriceOrRevenue] = useState<number>(100);
  const [targetMarginPct, setTargetMarginPct] = useState<number>(40);

  const result = useMemo(
    () =>
      calculateMargin({
        mode,
        cost,
        priceOrRevenue,
        targetMarginPct,
      }),
    [mode, cost, priceOrRevenue, targetMarginPct]
  );

  const handleReset = () => {
    setMode('cost_and_price');
    setCost(60);
    setPriceOrRevenue(100);
    setTargetMarginPct(40);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* INPUTS */}
        <div className="lg:col-span-5 space-y-4 bg-[var(--bg)] border border-[var(--border)] rounded-2xl p-5">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
            <div className="flex items-center gap-2 font-bold text-sm text-[var(--text)]">
              <Percent className="w-4 h-4 text-blue-600" />
              <span>Solve Any Two Variables</span>
            </div>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--muted)] hover:text-blue-600 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>

          <div className="grid grid-cols-1 gap-1.5">
            {(
              [
                { id: 'cost_and_price', label: 'Enter Cost & Selling Price → Solve Margin %' },
                { id: 'cost_and_margin', label: 'Enter Cost & Target Margin % → Solve Selling Price' },
                { id: 'revenue_and_margin', label: 'Enter Selling Price & Margin % → Solve Max Cost' },
              ] as const
            ).map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMode(m.id)}
                className={`py-2 px-3 rounded-xl text-xs font-bold text-left border transition ${
                  mode === m.id
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-[var(--surface)] text-[var(--text)] border-[var(--border)]'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {mode !== 'revenue_and_margin' && (
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                  Unit Cost / COGS ($)
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
          )}

          {mode !== 'cost_and_margin' && (
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                  Selling Price / Revenue ($)
                </label>
                <input
                  type="number"
                  value={priceOrRevenue}
                  onChange={(e) => setPriceOrRevenue(Math.max(0, Number(e.target.value)))}
                  className="w-28 text-right rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-sm font-bold tabular-nums"
                />
              </div>
              <UnboxedSlider
                ariaLabel="Selling Price"
                min={1}
                max={2000}
                step={5}
                value={priceOrRevenue}
                onChange={setPriceOrRevenue}
                minLabel="$1"
                midLabel="$1,000"
                maxLabel="$2,000"
              />
            </div>
          )}

          {mode !== 'cost_and_price' && (
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                  Target Gross Margin (%): {targetMarginPct}%
                </label>
                <input
                  type="number"
                  value={targetMarginPct}
                  onChange={(e) => setTargetMarginPct(Math.min(99.9, Number(e.target.value)))}
                  className="w-24 text-right rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-sm font-bold tabular-nums"
                />
              </div>
              <UnboxedSlider
                ariaLabel="Target Gross Margin Percentage"
                min={1}
                max={95}
                step={0.5}
                value={targetMarginPct}
                onChange={setTargetMarginPct}
                minLabel="1%"
                midLabel="50%"
                maxLabel="95%"
              />
            </div>
          )}
        </div>

        {/* OUTPUTS */}
        <div className="lg:col-span-7 space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl border border-blue-500/30 bg-blue-500/5">
              <div className="text-[11px] font-bold uppercase text-blue-600 dark:text-blue-400">Gross Margin %</div>
              <div className="text-2xl font-extrabold tabular-nums mt-1">{formatPct(result.marginPct, 2)}</div>
              <div className="text-[11px] text-[var(--muted)] mt-0.5">(Price − Cost) ÷ Price</div>
            </div>

            <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5">
              <div className="text-[11px] font-bold uppercase text-emerald-600 dark:text-emerald-400">Gross Profit</div>
              <div className="text-2xl font-extrabold tabular-nums text-emerald-600 dark:text-emerald-400 mt-1">
                {formatMoney(result.grossProfit, 'USD', 2)}
              </div>
              <div className="text-[11px] text-[var(--muted)] mt-0.5">Per unit / transaction</div>
            </div>

            <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg)]">
              <div className="text-[11px] font-bold uppercase text-[var(--muted)]">Equivalent Markup %</div>
              <div className="text-2xl font-extrabold tabular-nums mt-1">{formatPct(result.markupPct, 2)}</div>
              <div className="text-[11px] text-[var(--muted)] mt-0.5">(Price − Cost) ÷ Cost</div>
            </div>

            <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg)]">
              <div className="text-[11px] font-bold uppercase text-[var(--muted)]">Selling Price / Cost</div>
              <div className="text-sm font-extrabold tabular-nums mt-1">
                {formatMoney(result.price, 'USD', 2)} / {formatMoney(result.cost, 'USD', 2)}
              </div>
              <div className="text-[11px] text-[var(--muted)] mt-0.5">Revenue vs COGS</div>
            </div>
          </div>

          {/* Margin vs Markup Reference Table */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-5">
            <h3 className="text-sm font-bold text-[var(--text)] mb-3">
              Margin vs. Markup Reference Conversion Table (On a $100 Cost Basis)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse tabular-nums">
                <thead>
                  <tr className="border-b border-[var(--border)] text-[var(--muted)] text-left font-bold">
                    <th className="py-2">Markup % on Cost</th>
                    <th className="py-2">Equivalent Gross Margin %</th>
                    <th className="py-2 text-right">Unit Cost</th>
                    <th className="py-2 text-right">Selling Price</th>
                    <th className="py-2 text-right">Gross Profit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {result.conversionTable.map((row) => (
                    <tr key={row.markupPct}>
                      <td className="py-1.5 font-semibold">{row.markupPct.toFixed(1)}% Markup</td>
                      <td className="py-1.5 font-bold text-blue-600 dark:text-blue-400">
                        {row.marginPct.toFixed(2)}% Margin
                      </td>
                      <td className="py-1.5 text-right">${row.sampleCost.toFixed(2)}</td>
                      <td className="py-1.5 text-right">${row.samplePrice.toFixed(2)}</td>
                      <td className="py-1.5 text-right text-emerald-600">+${row.sampleProfit.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <RelatedCalculatorsStrip
        links={[
          {
            title: 'Markup Calculator',
            path: '/finance/markup-calculator',
            desc: 'Calculate selling price from cost and markup % with discount and tax options.',
          },
          {
            title: 'Profit Margin Calculator',
            path: '/finance/profit-margin-calculator',
            desc: 'Full P&L waterfall (Gross, EBITDA, Operating, Net) with Damodaran sector benchmarks.',
          },
          {
            title: 'Break-Even Calculator',
            path: '/finance/break-even-calculator',
            desc: 'Compute break-even units, revenue, contribution margin, and margin of safety.',
          },
        ]}
      />
    </div>
  );
}
