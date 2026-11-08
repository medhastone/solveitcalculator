'use client';

import React, { useState, useMemo } from 'react';
import { calculateBreakEven } from '@/lib/finance-core/tax-payroll-business-engines';
import {
  UnboxedSlider,
  RelatedCalculatorsStrip,
  formatMoney,
  formatPct,
} from '@/components/calculator/CleanFinanceControls';
import { RotateCcw, Target, TrendingUp } from 'lucide-react';

export default function BreakEvenClient() {
  const [fixedCosts, setFixedCosts] = useState<number>(24000);
  const [variableCostPerUnit, setVariableCostPerUnit] = useState<number>(35);
  const [pricePerUnit, setPricePerUnit] = useState<number>(85);
  const [targetProfit, setTargetProfit] = useState<number>(15000);
  const [expectedActualUnits, setExpectedActualUnits] = useState<number>(750);

  const result = useMemo(
    () =>
      calculateBreakEven({
        fixedCosts,
        variableCostPerUnit,
        pricePerUnit,
        targetProfit,
        expectedActualUnits,
      }),
    [fixedCosts, variableCostPerUnit, pricePerUnit, targetProfit, expectedActualUnits]
  );

  const handleReset = () => {
    setFixedCosts(24000);
    setVariableCostPerUnit(35);
    setPricePerUnit(85);
    setTargetProfit(15000);
    setExpectedActualUnits(750);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* INPUTS */}
        <div className="lg:col-span-5 space-y-4 bg-[var(--bg)] border border-[var(--border)] rounded-2xl p-5">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
            <div className="flex items-center gap-2 font-bold text-sm text-[var(--text)]">
              <Target className="w-4 h-4 text-blue-600" />
              <span>Fixed &amp; Unit Cost Parameters</span>
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
                Total Fixed Costs ($)
              </label>
              <input
                type="number"
                value={fixedCosts}
                onChange={(e) => setFixedCosts(Math.max(0, Number(e.target.value)))}
                className="w-32 text-right rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-sm font-bold tabular-nums"
              />
            </div>
            <UnboxedSlider
              ariaLabel="Total Fixed Costs"
              min={1000}
              max={250000}
              step={1000}
              value={fixedCosts}
              onChange={setFixedCosts}
              minLabel="$1k"
              midLabel="$125k"
              maxLabel="$250k"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                Variable Cost per Unit ($/unit)
              </label>
              <input
                type="number"
                value={variableCostPerUnit}
                onChange={(e) => setVariableCostPerUnit(Math.max(0, Number(e.target.value)))}
                className="w-28 text-right rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-sm font-bold tabular-nums"
              />
            </div>
            <UnboxedSlider
              ariaLabel="Variable Cost per Unit"
              min={0}
              max={500}
              step={1}
              value={variableCostPerUnit}
              onChange={setVariableCostPerUnit}
              minLabel="$0"
              midLabel="$250"
              maxLabel="$500"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                Selling Price per Unit ($/unit)
              </label>
              <input
                type="number"
                value={pricePerUnit}
                onChange={(e) => setPricePerUnit(Math.max(0, Number(e.target.value)))}
                className="w-28 text-right rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-sm font-bold tabular-nums"
              />
            </div>
            <UnboxedSlider
              ariaLabel="Selling Price per Unit"
              min={1}
              max={1000}
              step={1}
              value={pricePerUnit}
              onChange={setPricePerUnit}
              minLabel="$1"
              midLabel="$500"
              maxLabel="$1,000"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
                Target Profit ($)
              </label>
              <input
                type="number"
                value={targetProfit}
                onChange={(e) => setTargetProfit(Math.max(0, Number(e.target.value)))}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-bold tabular-nums"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
                Forecast Sales (Units)
              </label>
              <input
                type="number"
                value={expectedActualUnits}
                onChange={(e) => setExpectedActualUnits(Math.max(0, Number(e.target.value)))}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-bold tabular-nums"
              />
            </div>
          </div>
        </div>

        {/* OUTPUTS */}
        <div className="lg:col-span-7 space-y-5">
          {!result.isViable ? (
            <div className="p-5 rounded-2xl border border-rose-500/30 bg-rose-500/10 text-sm font-bold text-rose-600">
              Selling price (${pricePerUnit}) must exceed variable cost per unit (${variableCostPerUnit}) to generate a
              positive contribution margin and reach break-even.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl border border-blue-500/30 bg-blue-500/5">
                  <div className="text-[11px] font-bold uppercase text-blue-600 dark:text-blue-400">
                    Break-Even Units
                  </div>
                  <div className="text-2xl font-extrabold tabular-nums mt-1">
                    {Math.ceil(result.bepUnits).toLocaleString()}
                  </div>
                  <div className="text-[11px] text-[var(--muted)] mt-0.5">
                    Revenue: {formatMoney(result.bepRevenue)}
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5">
                  <div className="text-[11px] font-bold uppercase text-emerald-600 dark:text-emerald-400">
                    Target Profit Units
                  </div>
                  <div className="text-2xl font-extrabold tabular-nums mt-1">
                    {Math.ceil(result.targetUnits).toLocaleString()}
                  </div>
                  <div className="text-[11px] text-[var(--muted)] mt-0.5">
                    Revenue: {formatMoney(result.targetRevenue)}
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg)]">
                  <div className="text-[11px] font-bold uppercase text-[var(--muted)]">Contribution Margin</div>
                  <div className="text-2xl font-extrabold tabular-nums mt-1">
                    {formatMoney(result.contributionMargin, 'USD', 2)}
                  </div>
                  <div className="text-[11px] text-[var(--muted)] mt-0.5">
                    CM Ratio: {formatPct(result.contributionMarginRatioPct, 1)}
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg)]">
                  <div className="text-[11px] font-bold uppercase text-[var(--muted)]">Margin of Safety</div>
                  <div
                    className={`text-2xl font-extrabold tabular-nums mt-1 ${
                      result.marginOfSafetyPct >= 0 ? 'text-emerald-600' : 'text-rose-500'
                    }`}
                  >
                    {formatPct(result.marginOfSafetyPct, 1)}
                  </div>
                  <div className="text-[11px] text-[var(--muted)] mt-0.5">
                    {Math.round(result.marginOfSafetyUnits).toLocaleString()} units buffer
                  </div>
                </div>
              </div>

              {/* Price ±10% Sensitivity Table */}
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-5">
                <h3 className="text-sm font-bold text-[var(--text)] mb-3">
                  Price ±10% Break-Even Sensitivity Analysis
                </h3>
                <table className="w-full text-xs border-collapse tabular-nums">
                  <thead>
                    <tr className="border-b border-[var(--border)] text-[var(--muted)] text-left font-bold">
                      <th className="py-2">Scenario</th>
                      <th className="py-2 text-right">Unit Price</th>
                      <th className="py-2 text-right">Contribution Margin</th>
                      <th className="py-2 text-right">Break-Even Units</th>
                      <th className="py-2 text-right">Break-Even Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {result.scenarios.map((s) => (
                      <tr key={s.label}>
                        <td className="py-2 font-semibold">{s.label}</td>
                        <td className="py-2 text-right">{formatMoney(s.price, 'USD', 2)}</td>
                        <td className="py-2 text-right">{formatMoney(s.cm, 'USD', 2)}</td>
                        <td className="py-2 text-right font-bold">
                          {Number.isFinite(s.bepUnits) ? Math.ceil(s.bepUnits).toLocaleString() : 'N/A'}
                        </td>
                        <td className="py-2 text-right font-bold">
                          {Number.isFinite(s.bepRevenue) ? formatMoney(s.bepRevenue) : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Revenue vs Total Cost Crossover Schedule */}
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-5">
                <h3 className="text-sm font-bold text-[var(--text)] mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span>Revenue vs. Total Cost Crossover Schedule</span>
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse tabular-nums">
                    <thead>
                      <tr className="border-b border-[var(--border)] text-[var(--muted)] text-left font-bold">
                        <th className="py-1.5">Units Sold</th>
                        <th className="py-1.5 text-right">Total Cost (Fixed + Var)</th>
                        <th className="py-1.5 text-right">Total Revenue</th>
                        <th className="py-1.5 text-right">Operating Net Profit / (Loss)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)]">
                      {result.chartPoints.map((pt) => (
                        <tr key={pt.units}>
                          <td className="py-1.5 font-semibold">{pt.units.toLocaleString()} units</td>
                          <td className="py-1.5 text-right">{formatMoney(pt.totalCost)}</td>
                          <td className="py-1.5 text-right">{formatMoney(pt.totalRevenue)}</td>
                          <td
                            className={`py-1.5 text-right font-bold ${
                              pt.netProfit >= 0 ? 'text-emerald-600' : 'text-rose-500'
                            }`}
                          >
                            {pt.netProfit >= 0 ? '+' : ''}
                            {formatMoney(pt.netProfit)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <RelatedCalculatorsStrip
        links={[
          {
            title: 'Margin Calculator',
            path: '/finance/margin-calculator',
            desc: 'Compute unit gross margin % and markup %.',
          },
          {
            title: 'Profit Margin Calculator',
            path: '/finance/profit-margin-calculator',
            desc: 'Model full income statement margins and Damodaran sector benchmarks.',
          },
          {
            title: 'ROI Calculator',
            path: '/finance/roi-calculator',
            desc: 'Calculate return on capital invested in equipment or product launches.',
          },
        ]}
      />
    </div>
  );
}
