'use client';

import React, { useState, useMemo } from 'react';
import { calculateSalaryToHourly } from '@/lib/finance-core/tax-payroll-business-engines';
import {
  UnboxedSlider,
  RelatedCalculatorsStrip,
  formatMoney,
} from '@/components/calculator/CleanFinanceControls';
import { RotateCcw, Clock, Copy, Check } from 'lucide-react';
import { useCurrency } from '@/lib/currency';

export default function SalaryToHourlyClient() {
  useCurrency();
  const [inputMode, setInputMode] = useState<'annual' | 'hourly'>('annual');
  const [amount, setAmount] = useState<number>(85000);
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(40);
  const [weeksPerYear, setWeeksPerYear] = useState<number>(52);
  const [unpaidLeaveWeeks, setUnpaidLeaveWeeks] = useState<number>(0);
  const [paidHolidayDays, setPaidHolidayDays] = useState<number>(15);
  const [adjustForPaidHolidays, setAdjustForPaidHolidays] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const result = useMemo(
    () =>
      calculateSalaryToHourly({
        inputMode,
        amount,
        hoursPerWeek,
        weeksPerYear,
        unpaidLeaveWeeks,
        paidHolidayDays,
        adjustForPaidHolidays,
      }),
    [inputMode, amount, hoursPerWeek, weeksPerYear, unpaidLeaveWeeks, paidHolidayDays, adjustForPaidHolidays]
  );

  const handleCopyTable = () => {
    const text = [
      `Annual Salary: ${formatMoney(result.annualSalary, 'USD', 2)}`,
      `Monthly (12): ${formatMoney(result.monthly, 'USD', 2)}`,
      `Semi-Monthly (24): ${formatMoney(result.semiMonthly, 'USD', 2)}`,
      `Bi-Weekly (26): ${formatMoney(result.biWeekly, 'USD', 2)}`,
      `Weekly (${weeksPerYear}): ${formatMoney(result.weekly, 'USD', 2)}`,
      `Daily (8h): ${formatMoney(result.daily, 'USD', 2)}`,
      `Nominal Hourly (${result.scheduledHoursPerYear}h): ${formatMoney(result.nominalHourly, 'USD', 2)}/hr`,
      `Effective Worked Hourly (${result.actualWorkedHoursPerYear}h): ${formatMoney(result.effectiveWorkedHourly, 'USD', 2)}/hr`,
    ].join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setInputMode('annual');
    setAmount(85000);
    setHoursPerWeek(40);
    setWeeksPerYear(52);
    setUnpaidLeaveWeeks(0);
    setPaidHolidayDays(15);
    setAdjustForPaidHolidays(true);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* INPUTS */}
        <div className="lg:col-span-5 space-y-4 bg-[var(--bg)] border border-[var(--border)] rounded-2xl p-5">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
            <div className="flex items-center gap-2 font-bold text-sm text-[var(--text)]">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Schedule &amp; Pay Parameters</span>
            </div>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--muted)] hover:text-blue-600 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>

          {/* Bidirectional Mode Toggle */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setInputMode('annual');
                setAmount(85000);
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                inputMode === 'annual'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-[var(--surface)] text-[var(--text)] border-[var(--border)]'
              }`}
            >
              Annual Salary → Hourly
            </button>
            <button
              type="button"
              onClick={() => {
                setInputMode('hourly');
                setAmount(45);
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                inputMode === 'hourly'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-[var(--surface)] text-[var(--text)] border-[var(--border)]'
              }`}
            >
              Hourly Rate → Salary
            </button>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                {inputMode === 'annual' ? 'Annual Gross Salary ($)' : 'Hourly Wage ($/hr)'}
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
                className="w-32 text-right rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-sm font-bold tabular-nums"
              />
            </div>
            <UnboxedSlider
              ariaLabel={inputMode === 'annual' ? 'Annual Salary' : 'Hourly Wage'}
              min={inputMode === 'annual' ? 20000 : 10}
              max={inputMode === 'annual' ? 350000 : 200}
              step={inputMode === 'annual' ? 2500 : 1}
              value={amount}
              onChange={setAmount}
              minLabel={inputMode === 'annual' ? '$20k' : '$10/hr'}
              midLabel={inputMode === 'annual' ? '$185k' : '$100/hr'}
              maxLabel={inputMode === 'annual' ? '$350k' : '$200/hr'}
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                Hours per Week: {hoursPerWeek} hrs
              </label>
              <span className="text-xs font-semibold text-[var(--muted)]">Standard = 40h</span>
            </div>
            <UnboxedSlider
              ariaLabel="Hours per Week"
              min={10}
              max={70}
              step={1}
              value={hoursPerWeek}
              onChange={setHoursPerWeek}
              minLabel="10h"
              midLabel="40h Full-Time"
              maxLabel="70h"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
                Scheduled Weeks / Yr
              </label>
              <input
                type="number"
                min={1}
                max={52}
                value={weeksPerYear}
                onChange={(e) => setWeeksPerYear(Math.max(1, Math.min(52, Number(e.target.value))))}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1.5 text-xs font-bold tabular-nums"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
                Unpaid Leave (Weeks)
              </label>
              <input
                type="number"
                min={0}
                max={51}
                value={unpaidLeaveWeeks}
                onChange={(e) => setUnpaidLeaveWeeks(Math.max(0, Number(e.target.value)))}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1.5 text-xs font-bold tabular-nums"
              />
            </div>
          </div>

          <div className="pt-1 space-y-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-[var(--text)] cursor-pointer">
              <input
                type="checkbox"
                checked={adjustForPaidHolidays}
                onChange={(e) => setAdjustForPaidHolidays(e.target.checked)}
                className="rounded border-[var(--border)] text-blue-600"
              />
              <span>Calculate Effective Worked Hourly Rate (After Paid PTO / Holidays)</span>
            </label>
            {adjustForPaidHolidays && (
              <div className="flex justify-between items-center">
                <span className="text-xs text-[var(--muted)]">Paid Holidays + PTO Days / Yr:</span>
                <input
                  type="number"
                  min={0}
                  max={60}
                  value={paidHolidayDays}
                  onChange={(e) => setPaidHolidayDays(Math.max(0, Number(e.target.value)))}
                  className="w-20 text-right rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2 py-1 text-xs font-bold tabular-nums"
                />
              </div>
            )}
          </div>
        </div>

        {/* OUTPUTS */}
        <div className="lg:col-span-7 space-y-5">
          <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-600/10 via-transparent to-emerald-500/5 p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Nominal Hourly Rate ({result.scheduledHoursPerYear.toLocaleString()} hrs/yr)
                </div>
                <div className="text-3xl font-extrabold tabular-nums text-[var(--text)] mt-1">
                  {formatMoney(result.nominalHourly, 'USD', 2)}
                  <span className="text-sm font-semibold text-[var(--muted)] ml-1.5">/ hour</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-semibold text-[var(--muted)]">
                  Effective Worked Hourly ({result.actualWorkedHoursPerYear.toLocaleString()} hrs)
                </div>
                <div className="text-2xl font-extrabold tabular-nums text-emerald-600 dark:text-emerald-400">
                  {formatMoney(result.effectiveWorkedHourly, 'USD', 2)}/hr
                </div>
              </div>
            </div>
          </div>

          {/* All Pay Periods in One Table with Copy Button */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[var(--text)]">
                Complete Pay Period Conversion Table (Standard 2,080 Hours = 40 × 52)
              </h3>
              <button
                type="button"
                onClick={handleCopyTable}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Table'}</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse tabular-nums">
                <thead>
                  <tr className="border-b border-[var(--border)] text-[var(--muted)] text-left font-bold">
                    <th className="py-2">Pay Period</th>
                    <th className="py-2">Divisor / Basis</th>
                    <th className="py-2 text-right">Gross Equivalent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  <tr>
                    <td className="py-2.5 font-semibold">Annual Salary</td>
                    <td className="py-2.5 text-[var(--muted)]">1 Year ({result.scheduledHoursPerYear} scheduled hrs)</td>
                    <td className="py-2.5 text-right font-bold">{formatMoney(result.annualSalary, 'USD', 2)}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-semibold">Monthly Paycheck</td>
                    <td className="py-2.5 text-[var(--muted)]">12 pay periods / year</td>
                    <td className="py-2.5 text-right font-bold">{formatMoney(result.monthly, 'USD', 2)}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-semibold">Semi-Monthly Paycheck</td>
                    <td className="py-2.5 text-[var(--muted)]">24 pay periods / year (1st &amp; 15th)</td>
                    <td className="py-2.5 text-right font-bold">{formatMoney(result.semiMonthly, 'USD', 2)}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-semibold">Bi-Weekly Paycheck</td>
                    <td className="py-2.5 text-[var(--muted)]">26 pay periods / year (every 2 weeks)</td>
                    <td className="py-2.5 text-right font-bold">{formatMoney(result.biWeekly, 'USD', 2)}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-semibold">Weekly Paycheck</td>
                    <td className="py-2.5 text-[var(--muted)]">{weeksPerYear} weeks / year</td>
                    <td className="py-2.5 text-right font-bold">{formatMoney(result.weekly, 'USD', 2)}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-semibold">Daily Wage</td>
                    <td className="py-2.5 text-[var(--muted)]">5 days / week ({hoursPerWeek / 5} hrs/day)</td>
                    <td className="py-2.5 text-right font-bold">{formatMoney(result.daily, 'USD', 2)}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-semibold text-blue-600 dark:text-blue-400">Nominal Hourly Wage</td>
                    <td className="py-2.5 text-[var(--muted)]">Salary ÷ {result.scheduledHoursPerYear} hrs</td>
                    <td className="py-2.5 text-right font-extrabold text-blue-600 dark:text-blue-400">
                      {formatMoney(result.nominalHourly, 'USD', 2)}/hr
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <RelatedCalculatorsStrip
        links={[
          {
            title: 'Overtime Pay Calculator',
            path: '/finance/overtime-pay-calculator',
            desc: 'Calculate 1.5x time-and-a-half and 2.0x double-time pay under FLSA rules.',
          },
          {
            title: 'Take-Home Pay Calculator',
            path: '/finance/take-home-pay-calculator',
            desc: 'Estimate net paycheck after federal, state, and FICA tax withholdings.',
          },
          {
            title: 'Pay Raise Calculator',
            path: '/finance/pay-raise-calculator',
            desc: 'See how a percentage or dollar raise impacts every pay period.',
          },
        ]}
      />
    </div>
  );
}
