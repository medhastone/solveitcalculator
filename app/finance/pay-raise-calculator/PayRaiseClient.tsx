'use client';

import React, { useState, useMemo } from 'react';
import { calculatePayRaise } from '@/lib/finance-core/tax-payroll-business-engines';
import {
  UnboxedSlider,
  RelatedCalculatorsStrip,
  formatMoney,
  formatPct,
} from '@/components/calculator/CleanFinanceControls';
import { RotateCcw, TrendingUp } from 'lucide-react';

export default function PayRaiseClient() {
  const [payPeriod, setPayPeriod] = useState<'hourly' | 'monthly' | 'annual'>('annual');
  const [currentPay, setCurrentPay] = useState<number>(85000);
  const [raiseMode, setRaiseMode] = useState<'percentage' | 'new_amount'>('percentage');
  const [raiseValue, setRaiseValue] = useState<number>(6);
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(40);
  const [inflationRatePct, setInflationRatePct] = useState<number>(2.8);
  const [compoundingYears, setCompoundingYears] = useState<number>(5);

  const result = useMemo(
    () =>
      calculatePayRaise({
        payPeriod,
        currentPay,
        raiseMode,
        raiseValue,
        hoursPerWeek,
        inflationRatePct,
        compoundingYears,
      }),
    [payPeriod, currentPay, raiseMode, raiseValue, hoursPerWeek, inflationRatePct, compoundingYears]
  );

  const handleReset = () => {
    setPayPeriod('annual');
    setCurrentPay(85000);
    setRaiseMode('percentage');
    setRaiseValue(6);
    setHoursPerWeek(40);
    setInflationRatePct(2.8);
    setCompoundingYears(5);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* INPUTS */}
        <div className="lg:col-span-5 space-y-4 bg-[var(--bg)] border border-[var(--border)] rounded-2xl p-5">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
            <div className="flex items-center gap-2 font-bold text-sm text-[var(--text)]">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span>Current Pay, Raise &amp; Inflation</span>
            </div>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--muted)] hover:text-blue-600 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {(['annual', 'monthly', 'hourly'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => {
                  setPayPeriod(p);
                  if (p === 'annual') setCurrentPay(85000);
                  if (p === 'monthly') setCurrentPay(7000);
                  if (p === 'hourly') setCurrentPay(40);
                }}
                className={`py-2 px-2 rounded-xl text-xs font-bold capitalize border transition ${
                  payPeriod === p
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-[var(--surface)] text-[var(--text)] border-[var(--border)]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                Current {payPeriod} Pay ($)
              </label>
              <input
                type="number"
                value={currentPay}
                onChange={(e) => setCurrentPay(Math.max(0, Number(e.target.value)))}
                className="w-32 text-right rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-sm font-bold tabular-nums"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setRaiseMode('percentage');
                setRaiseValue(6);
              }}
              className={`py-2 px-2 rounded-xl text-xs font-bold border transition ${
                raiseMode === 'percentage'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-[var(--surface)] text-[var(--text)] border-[var(--border)]'
              }`}
            >
              Raise by %
            </button>
            <button
              type="button"
              onClick={() => {
                setRaiseMode('new_amount');
                setRaiseValue(payPeriod === 'annual' ? 92000 : payPeriod === 'monthly' ? 7600 : 44);
              }}
              className={`py-2 px-2 rounded-xl text-xs font-bold border transition ${
                raiseMode === 'new_amount'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-[var(--surface)] text-[var(--text)] border-[var(--border)]'
              }`}
            >
              Enter New Pay ($)
            </button>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                {raiseMode === 'percentage' ? `Raise Percentage (${raiseValue}%)` : `New ${payPeriod} Pay ($)`}
              </label>
              <input
                type="number"
                step={raiseMode === 'percentage' ? 0.5 : 500}
                value={raiseValue}
                onChange={(e) => setRaiseValue(Number(e.target.value))}
                className="w-28 text-right rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-sm font-bold tabular-nums"
              />
            </div>
            {raiseMode === 'percentage' && (
              <UnboxedSlider
                ariaLabel="Raise Percentage"
                min={0}
                max={35}
                step={0.5}
                value={raiseValue}
                onChange={setRaiseValue}
                minLabel="0%"
                midLabel="15%"
                maxLabel="35%"
              />
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                CPI Inflation Rate: {inflationRatePct}%
              </label>
              <span className="text-xs font-bold text-emerald-600 tabular-nums">
                Real Raise: {formatPct(result.realRaisePct, 2)}
              </span>
            </div>
            <UnboxedSlider
              ariaLabel="CPI Inflation Rate"
              min={0}
              max={10}
              step={0.1}
              value={inflationRatePct}
              onChange={setInflationRatePct}
              minLabel="0%"
              midLabel="3% CPI"
              maxLabel="10%"
            />
          </div>
        </div>

        {/* OUTPUTS */}
        <div className="lg:col-span-7 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="p-4 rounded-2xl border border-blue-500/30 bg-blue-500/5">
              <div className="text-[11px] font-bold uppercase text-blue-600 dark:text-blue-400">New Annual Salary</div>
              <div className="text-2xl font-extrabold tabular-nums mt-1">{formatMoney(result.newAnnual)}</div>
              <div className="text-xs text-emerald-600 font-bold mt-1">
                +{formatMoney(result.annualDiff)}/yr ({formatPct(result.nominalRaisePct, 2)})
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5">
              <div className="text-[11px] font-bold uppercase text-emerald-600 dark:text-emerald-400">
                Real Raise (After {inflationRatePct}% CPI)
              </div>
              <div
                className={`text-2xl font-extrabold tabular-nums mt-1 ${
                  result.realRaisePct >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'
                }`}
              >
                {result.realRaisePct >= 0 ? '+' : ''}
                {formatPct(result.realRaisePct, 2)}
              </div>
              <div className="text-xs text-[var(--muted)] mt-1">
                Real Power: {formatMoney(result.realPurchasingPowerAnnual)}
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg)]">
              <div className="text-[11px] font-bold uppercase text-[var(--muted)]">New Hourly Rate</div>
              <div className="text-2xl font-extrabold tabular-nums mt-1">
                {formatMoney(result.newHourly, 'USD', 2)}/hr
              </div>
              <div className="text-xs text-emerald-600 font-bold mt-1">
                +{formatMoney(result.hourlyDiff, 'USD', 2)}/hr increase
              </div>
            </div>
          </div>

          {/* All Pay Periods Table */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-5">
            <h3 className="text-sm font-bold text-[var(--text)] mb-3">
              Before vs After Pay Raise Across All Pay Periods
            </h3>
            <table className="w-full text-xs border-collapse tabular-nums">
              <thead>
                <tr className="border-b border-[var(--border)] text-[var(--muted)] text-left font-bold">
                  <th className="py-2">Period</th>
                  <th className="py-2 text-right">Current Pay</th>
                  <th className="py-2 text-right">Raise Increase</th>
                  <th className="py-2 text-right">New Pay</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                <tr>
                  <td className="py-2 font-semibold">Annual</td>
                  <td className="py-2 text-right">{formatMoney(result.currentAnnual, 'USD', 2)}</td>
                  <td className="py-2 text-right text-emerald-600 font-bold">
                    +{formatMoney(result.annualDiff, 'USD', 2)}
                  </td>
                  <td className="py-2 text-right font-bold">{formatMoney(result.newAnnual, 'USD', 2)}</td>
                </tr>
                <tr>
                  <td className="py-2 font-semibold">Monthly (12)</td>
                  <td className="py-2 text-right">{formatMoney(result.currentAnnual / 12, 'USD', 2)}</td>
                  <td className="py-2 text-right text-emerald-600 font-bold">
                    +{formatMoney(result.monthlyDiff, 'USD', 2)}
                  </td>
                  <td className="py-2 text-right font-bold">{formatMoney(result.newMonthly, 'USD', 2)}</td>
                </tr>
                <tr>
                  <td className="py-2 font-semibold">Bi-Weekly (26)</td>
                  <td className="py-2 text-right">{formatMoney(result.currentAnnual / 26, 'USD', 2)}</td>
                  <td className="py-2 text-right text-emerald-600 font-bold">
                    +{formatMoney(result.biWeeklyDiff, 'USD', 2)}
                  </td>
                  <td className="py-2 text-right font-bold">{formatMoney(result.newBiWeekly, 'USD', 2)}</td>
                </tr>
                <tr>
                  <td className="py-2 font-semibold">Hourly ({hoursPerWeek * 52} hrs)</td>
                  <td className="py-2 text-right">
                    {formatMoney(result.currentAnnual / (hoursPerWeek * 52), 'USD', 2)}/hr
                  </td>
                  <td className="py-2 text-right text-emerald-600 font-bold">
                    +{formatMoney(result.hourlyDiff, 'USD', 2)}/hr
                  </td>
                  <td className="py-2 text-right font-bold">{formatMoney(result.newHourly, 'USD', 2)}/hr</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Multi-Year Compounding Schedule */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-5">
            <h3 className="text-sm font-bold text-[var(--text)] mb-3">
              Multi-Year Compounding Trajectory (Assuming {formatPct(result.nominalRaisePct, 1)} Annual Raise)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {result.multiYearSchedule.map((row) => (
                <div key={row.year} className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
                  <div className="text-[11px] font-bold text-blue-600 dark:text-blue-400">Year {row.year}</div>
                  <div className="text-sm font-extrabold tabular-nums mt-0.5">{formatMoney(row.projectedSalary)}</div>
                  <div className="text-[10px] text-[var(--muted)] tabular-nums">
                    Real: {formatMoney(row.realSalary)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <RelatedCalculatorsStrip
        links={[
          {
            title: 'Inflation Calculator',
            path: '/finance/real-rate-of-return-calculator',
            desc: 'Model purchasing power erosion and real Fisher equation returns.',
          },
          {
            title: 'Salary to Hourly Calculator',
            path: '/finance/salary-to-hourly-calculator',
            desc: 'Convert annual compensation into hourly, bi-weekly, and semi-monthly rates.',
          },
          {
            title: 'Take-Home Pay Calculator',
            path: '/finance/take-home-pay-calculator',
            desc: 'See how much of your pay raise you keep after marginal income taxes.',
          },
        ]}
      />
    </div>
  );
}
