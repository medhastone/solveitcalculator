'use client';

import React, { useState, useMemo } from 'react';
import { calculateProfitMargin } from '@/lib/finance-core/tax-payroll-business-engines';
import { DAMODARAN_SECTOR_MARGINS_2025 } from '@/lib/finance-core/tax-payroll-business-data';
import {
  UnboxedSlider,
  VerifiedSourceBadge,
  RelatedCalculatorsStrip,
  formatMoney,
  formatPct,
} from '@/components/calculator/CleanFinanceControls';
import { RotateCcw, BarChart3, Layers } from 'lucide-react';
import { useCurrency } from '@/lib/currency';

export default function ProfitMarginClient() {
  useCurrency();
  const [revenue, setRevenue] = useState<number>(500000);
  const [cogs, setCogs] = useState<number>(180000);
  const [operatingExpenses, setOperatingExpenses] = useState<number>(170000);
  const [depreciationAndAmortization, setDepreciationAndAmortization] = useState<number>(20000);
  const [interestExpense, setInterestExpense] = useState<number>(15000);
  const [taxes, setTaxes] = useState<number>(28000);
  const [sectorId, setSectorId] = useState<string>('software_system');

  const result = useMemo(
    () =>
      calculateProfitMargin({
        revenue,
        cogs,
        operatingExpenses,
        depreciationAndAmortization,
        interestExpense,
        taxes,
        sectorId,
      }),
    [revenue, cogs, operatingExpenses, depreciationAndAmortization, interestExpense, taxes, sectorId]
  );

  const handleReset = () => {
    setRevenue(500000);
    setCogs(180000);
    setOperatingExpenses(170000);
    setDepreciationAndAmortization(20000);
    setInterestExpense(15000);
    setTaxes(28000);
    setSectorId('software_system');
  };

  return (
    <div className="space-y-6">
      <VerifiedSourceBadge
        authority={result.benchmarkSource.authority}
        document={result.benchmarkSource.document}
        verifiedDate={result.benchmarkSource.verifiedDate}
        url={result.benchmarkSource.url}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* INPUTS */}
        <div className="lg:col-span-5 space-y-4 bg-[var(--bg)] border border-[var(--border)] rounded-2xl p-5">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
            <div className="flex items-center gap-2 font-bold text-sm text-[var(--text)]">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <span>Income Statement (P&amp;L) Inputs</span>
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
                Total Revenue / Sales ($)
              </label>
              <input
                type="number"
                value={revenue}
                onChange={(e) => setRevenue(Math.max(0, Number(e.target.value)))}
                className="w-32 text-right rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-sm font-bold tabular-nums"
              />
            </div>
            <UnboxedSlider
              ariaLabel="Total Revenue"
              min={10000}
              max={5000000}
              step={25000}
              value={revenue}
              onChange={setRevenue}
              minLabel="$10k"
              midLabel="$2.5M"
              maxLabel="$5M"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                Cost of Goods Sold (COGS $)
              </label>
              <input
                type="number"
                value={cogs}
                onChange={(e) => setCogs(Math.max(0, Number(e.target.value)))}
                className="w-32 text-right rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-sm font-bold tabular-nums"
              />
            </div>
            <UnboxedSlider
              ariaLabel="Cost of Goods Sold"
              min={0}
              max={revenue}
              step={5000}
              value={cogs}
              onChange={setCogs}
              minLabel="$0"
              midLabel={formatMoney(revenue / 2)}
              maxLabel={formatMoney(revenue)}
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                Operating Expenses / SG&amp;A (OPEX $)
              </label>
              <input
                type="number"
                value={operatingExpenses}
                onChange={(e) => setOperatingExpenses(Math.max(0, Number(e.target.value)))}
                className="w-32 text-right rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-sm font-bold tabular-nums"
              />
            </div>
            <UnboxedSlider
              ariaLabel="Operating Expenses"
              min={0}
              max={revenue}
              step={5000}
              value={operatingExpenses}
              onChange={setOperatingExpenses}
              minLabel="$0"
              midLabel={formatMoney(revenue / 2)}
              maxLabel={formatMoney(revenue)}
            />
          </div>

          <div className="grid grid-cols-3 gap-2.5 pt-1">
            <div>
              <label className="block text-[11px] font-bold uppercase text-[var(--muted)] mb-1">
                D&amp;A Included ($)
              </label>
              <input
                type="number"
                value={depreciationAndAmortization}
                onChange={(e) => setDepreciationAndAmortization(Math.max(0, Number(e.target.value)))}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2 py-1.5 text-xs font-bold tabular-nums"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-[var(--muted)] mb-1">
                Interest ($)
              </label>
              <input
                type="number"
                value={interestExpense}
                onChange={(e) => setInterestExpense(Math.max(0, Number(e.target.value)))}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2 py-1.5 text-xs font-bold tabular-nums"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-[var(--muted)] mb-1">
                Taxes ($)
              </label>
              <input
                type="number"
                value={taxes}
                onChange={(e) => setTaxes(Math.max(0, Number(e.target.value)))}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2 py-1.5 text-xs font-bold tabular-nums"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
              Compare Against NYU Stern (Damodaran) Sector Benchmark
            </label>
            <select
              aria-label="Damodaran Industry Sector"
              value={sectorId}
              onChange={(e) => setSectorId(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold"
            >
              {DAMODARAN_SECTOR_MARGINS_2025.sectors.map((sec) => (
                <option key={sec.id} value={sec.id}>
                  {sec.sector} (Gross {sec.grossMarginPct}% | Net {sec.netMarginPct}%)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* OUTPUTS */}
        <div className="lg:col-span-7 space-y-5">
          {/* 4-Tier Margin Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl border border-blue-500/30 bg-blue-500/5">
              <div className="text-[11px] font-bold uppercase text-blue-600 dark:text-blue-400">Gross Margin</div>
              <div className="text-2xl font-extrabold tabular-nums mt-1">{formatPct(result.grossMarginPct, 1)}</div>
              <div className="text-[11px] text-[var(--muted)] mt-0.5">{formatMoney(result.grossProfit)} profit</div>
            </div>

            <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg)]">
              <div className="text-[11px] font-bold uppercase text-[var(--muted)]">EBITDA Margin</div>
              <div className="text-2xl font-extrabold tabular-nums mt-1">{formatPct(result.ebitdaMarginPct, 1)}</div>
              <div className="text-[11px] text-[var(--muted)] mt-0.5">{formatMoney(result.ebitda)} EBITDA</div>
            </div>

            <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg)]">
              <div className="text-[11px] font-bold uppercase text-[var(--muted)]">Operating (EBIT)</div>
              <div className="text-2xl font-extrabold tabular-nums mt-1">{formatPct(result.operatingMarginPct, 1)}</div>
              <div className="text-[11px] text-[var(--muted)] mt-0.5">{formatMoney(result.operatingProfit)} EBIT</div>
            </div>

            <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5">
              <div className="text-[11px] font-bold uppercase text-emerald-600 dark:text-emerald-400">Net Margin</div>
              <div className="text-2xl font-extrabold tabular-nums text-emerald-600 dark:text-emerald-400 mt-1">
                {formatPct(result.netMarginPct, 1)}
              </div>
              <div className="text-[11px] text-[var(--muted)] mt-0.5">{formatMoney(result.netProfit)} Net Profit</div>
            </div>
          </div>

          {/* Revenue to Net Profit P&L Waterfall */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-5 space-y-3">
            <h3 className="text-sm font-bold text-[var(--text)] flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Income Statement Waterfall (Revenue → Gross → Operating → Net Profit)</span>
            </h3>
            <div className="space-y-2 text-xs tabular-nums">
              {result.waterfallSteps.map((step) => {
                const barWidth = Math.min(100, Math.max(2, Math.abs(step.pctOfRevenue)));
                const barColor =
                  step.type === 'revenue'
                    ? 'bg-blue-600'
                    : step.type === 'cost'
                    ? 'bg-rose-500'
                    : step.type === 'subtotal'
                    ? 'bg-indigo-500'
                    : 'bg-emerald-500';
                return (
                  <div key={step.label} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className={step.type !== 'cost' ? 'font-bold text-[var(--text)]' : 'text-[var(--muted)]'}>
                        {step.label}
                      </span>
                      <span className="font-bold">
                        {formatMoney(step.amount)} ({formatPct(step.pctOfRevenue, 1)})
                      </span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div style={{ width: `${barWidth}%` }} className={`h-full rounded-full ${barColor}`} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cited Damodaran NYU Stern Benchmark Comparison */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-[var(--text)]">
                Your Margins vs. Cited Benchmark: {result.benchmark.sector}
              </h3>
              <a
                href="https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/margin.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-mono font-semibold"
              >
                Source: Prof. Aswath Damodaran, NYU Stern (Jan 2025 US Sector Dataset) ↗
              </a>
            </div>

            <table className="w-full text-xs border-collapse tabular-nums">
              <thead>
                <tr className="border-b border-[var(--border)] text-[var(--muted)] text-left font-bold">
                  <th className="py-2">Profitability Tier</th>
                  <th className="py-2 text-right">Your Business</th>
                  <th className="py-2 text-right">{result.benchmark.sector} Avg</th>
                  <th className="py-2 text-right">Variance (bps / %)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {[
                  {
                    name: 'Gross Profit Margin',
                    yours: result.grossMarginPct,
                    bench: result.benchmark.grossMarginPct,
                  },
                  {
                    name: 'Operating (EBIT) Margin',
                    yours: result.operatingMarginPct,
                    bench: result.benchmark.operatingMarginPct,
                  },
                  {
                    name: 'Net Profit Margin',
                    yours: result.netMarginPct,
                    bench: result.benchmark.netMarginPct,
                  },
                ].map((row) => {
                  const diff = row.yours - row.bench;
                  return (
                    <tr key={row.name}>
                      <td className="py-2 font-semibold">{row.name}</td>
                      <td className="py-2 text-right font-bold">{formatPct(row.yours, 1)}</td>
                      <td className="py-2 text-right">{formatPct(row.bench, 1)}</td>
                      <td
                        className={`py-2 text-right font-bold ${
                          diff >= 0 ? 'text-emerald-600' : 'text-rose-500'
                        }`}
                      >
                        {diff >= 0 ? '+' : ''}
                        {diff.toFixed(1)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <RelatedCalculatorsStrip
        links={[
          {
            title: 'Margin Calculator',
            path: '/finance/margin-calculator',
            desc: 'Solve unit gross margin %, selling price, and markup conversions.',
          },
          {
            title: 'Markup Calculator',
            path: '/finance/markup-calculator',
            desc: 'Calculate retail price from cost and markup % with discount and tax.',
          },
          {
            title: 'Break-Even Calculator',
            path: '/finance/break-even-calculator',
            desc: 'Find break-even units and revenue from fixed and variable costs.',
          },
        ]}
      />
    </div>
  );
}
