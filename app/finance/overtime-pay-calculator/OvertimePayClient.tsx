'use client';

import React, { useState, useMemo } from 'react';
import { calculateOvertimePay } from '@/lib/finance-core/tax-payroll-business-engines';
import {
  UnboxedSlider,
  VerifiedSourceBadge,
  RelatedCalculatorsStrip,
  formatMoney,
} from '@/components/calculator/CleanFinanceControls';
import { RotateCcw, Clock, ExternalLink, ShieldCheck } from 'lucide-react';
import { useCurrency } from '@/lib/currency';

export default function OvertimePayClient() {
  useCurrency();
  const [payMode, setPayMode] = useState<'hourly' | 'annual_salary'>('hourly');
  const [baseRateOrSalary, setBaseRateOrSalary] = useState<number>(32);
  const [regularHoursPerWeek, setRegularHoursPerWeek] = useState<number>(40);
  const [overtimeHours15x, setOvertimeHours15x] = useState<number>(10);
  const [doubleTimeHours20x, setDoubleTimeHours20x] = useState<number>(0);
  const [customOvertimeMultiplier, setCustomOvertimeMultiplier] = useState<number>(1.5);

  const result = useMemo(
    () =>
      calculateOvertimePay({
        payMode,
        baseRateOrSalary,
        regularHoursPerWeek,
        overtimeHours15x,
        doubleTimeHours20x,
        customOvertimeMultiplier,
      }),
    [payMode, baseRateOrSalary, regularHoursPerWeek, overtimeHours15x, doubleTimeHours20x, customOvertimeMultiplier]
  );

  const handleReset = () => {
    setPayMode('hourly');
    setBaseRateOrSalary(32);
    setRegularHoursPerWeek(40);
    setOvertimeHours15x(10);
    setDoubleTimeHours20x(0);
    setCustomOvertimeMultiplier(1.5);
  };

  return (
    <div className="space-y-6">
      <VerifiedSourceBadge
        authority="U.S. Department of Labor (WHD) & India Ministry of Labour"
        document="29 U.S.C. § 207 (FLSA 40-Hr Rule), CA Labor Code § 510 & India Factories Act § 59"
        verifiedDate="2025-10-15"
        url="https://www.dol.gov/agencies/whd/overtime"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* INPUTS */}
        <div className="lg:col-span-5 space-y-4 bg-[var(--bg)] border border-[var(--border)] rounded-2xl p-5">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
            <div className="flex items-center gap-2 font-bold text-sm text-[var(--text)]">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Base Pay &amp; Overtime Hours</span>
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
              onClick={() => {
                setPayMode('hourly');
                setBaseRateOrSalary(32);
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                payMode === 'hourly'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-[var(--surface)] text-[var(--text)] border-[var(--border)]'
              }`}
            >
              Hourly Rate ($/hr)
            </button>
            <button
              type="button"
              onClick={() => {
                setPayMode('annual_salary');
                setBaseRateOrSalary(66560);
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                payMode === 'annual_salary'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-[var(--surface)] text-[var(--text)] border-[var(--border)]'
              }`}
            >
              Non-Exempt Salary ($/yr)
            </button>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                {payMode === 'hourly' ? 'Regular Hourly Rate ($/hr)' : 'Annual Base Salary ($/yr)'}
              </label>
              <input
                type="number"
                value={baseRateOrSalary}
                onChange={(e) => setBaseRateOrSalary(Math.max(0, Number(e.target.value)))}
                className="w-28 text-right rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-sm font-bold tabular-nums"
              />
            </div>
            <UnboxedSlider
              ariaLabel="Base Rate or Salary"
              min={payMode === 'hourly' ? 10 : 25000}
              max={payMode === 'hourly' ? 150 : 200000}
              step={payMode === 'hourly' ? 1 : 2500}
              value={baseRateOrSalary}
              onChange={setBaseRateOrSalary}
              minLabel={payMode === 'hourly' ? '$10/hr' : '$25k'}
              midLabel={payMode === 'hourly' ? '$75/hr' : '$100k'}
              maxLabel={payMode === 'hourly' ? '$150/hr' : '$200k'}
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                Regular Hours / Week: {regularHoursPerWeek} hrs
              </label>
              <span className="text-xs text-[var(--muted)]">FLSA Threshold = 40h</span>
            </div>
            <UnboxedSlider
              ariaLabel="Regular Hours per Week"
              min={10}
              max={48}
              step={1}
              value={regularHoursPerWeek}
              onChange={setRegularHoursPerWeek}
              minLabel="10h"
              midLabel="40h US / 48h IN"
              maxLabel="48h"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                Overtime Hours / Week ({customOvertimeMultiplier}x): {overtimeHours15x} hrs
              </label>
              <span className="text-xs font-bold text-blue-600 tabular-nums">
                {formatMoney(result.overtimeRate, 'USD', 2)}/hr
              </span>
            </div>
            <UnboxedSlider
              ariaLabel="Overtime Hours per Week"
              min={0}
              max={40}
              step={1}
              value={overtimeHours15x}
              onChange={setOvertimeHours15x}
              minLabel="0h"
              midLabel="20h"
              maxLabel="40h"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
                OT Multiplier
              </label>
              <select
                aria-label="Overtime Multiplier"
                value={customOvertimeMultiplier}
                onChange={(e) => setCustomOvertimeMultiplier(Number(e.target.value))}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold"
              >
                <option value={1.5}>1.5x (Time-and-a-Half — US FLSA)</option>
                <option value={2.0}>2.0x (Double Time — CA 12h+ / India Factories Act)</option>
                <option value={1.25}>1.25x (Custom Shift Differential)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1">
                Extra 2.0x Double-Time Hrs
              </label>
              <input
                type="number"
                min={0}
                max={40}
                value={doubleTimeHours20x}
                onChange={(e) => setDoubleTimeHours20x(Math.max(0, Number(e.target.value)))}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-bold tabular-nums"
              />
            </div>
          </div>
        </div>

        {/* OUTPUTS */}
        <div className="lg:col-span-7 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="p-4 rounded-2xl border border-blue-500/30 bg-blue-500/5">
              <div className="text-[11px] font-bold uppercase text-blue-600 dark:text-blue-400">
                Total Weekly Gross Pay
              </div>
              <div className="text-2xl font-extrabold tabular-nums mt-1">
                {formatMoney(result.totalGrossWeekly, 'USD', 2)}
              </div>
              <div className="text-xs text-[var(--muted)] mt-1">
                Bi-Weekly: {formatMoney(result.totalGrossBiWeekly, 'USD', 2)}
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5">
              <div className="text-[11px] font-bold uppercase text-emerald-600 dark:text-emerald-400">
                Weekly Overtime Earnings
              </div>
              <div className="text-2xl font-extrabold tabular-nums text-emerald-600 dark:text-emerald-400 mt-1">
                +{formatMoney(result.totalOvertimePayWeekly, 'USD', 2)}
              </div>
              <div className="text-xs text-[var(--muted)] mt-1">
                Regular Pay: {formatMoney(result.regularPayWeekly, 'USD', 2)}
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg)]">
              <div className="text-[11px] font-bold uppercase text-[var(--muted)]">
                Effective Blended Hourly
              </div>
              <div className="text-2xl font-extrabold tabular-nums mt-1">
                {formatMoney(result.effectiveHourlyRate, 'USD', 2)}/hr
              </div>
              <div className="text-xs text-[var(--muted)] mt-1">
                Annualized: {formatMoney(result.totalGrossAnnual)}
              </div>
            </div>
          </div>

          {/* Value-Added: Exempt vs Non-Exempt & Official Labour Authority Links */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-5 space-y-3 text-xs">
            <h3 className="text-sm font-bold text-[var(--text)] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Exempt vs Non-Exempt Rules &amp; Statutory Overtime Thresholds</span>
            </h3>
            <p className="text-[var(--muted)] leading-relaxed">
              <strong className="text-[var(--text)]">US Federal FLSA (29 U.S.C. § 207):</strong> Non-exempt employees
              must receive at least <strong>1.5×</strong> their regular rate of pay for all hours worked over{' '}
              <strong>40 hours in a workweek</strong>. Being paid a salary does not automatically make an employee
              exempt—an employee must meet both the FLSA duties test (Executive, Administrative, or Professional) and the
              statutory federal salary basis threshold ($684/week / $35,568/year under 29 CFR Part 541 following federal
              court vacatur of the 2024 rule).
            </p>
            <p className="text-[var(--muted)] leading-relaxed">
              <strong className="text-[var(--text)]">California Daily Overtime (CA Labor Code § 510):</strong> Requires{' '}
              <strong>1.5×</strong> pay for hours worked beyond <strong>8 hours in a single workday</strong> (and the
              first 8 hours on the 7th consecutive day), plus <strong>2.0× double time</strong> for hours worked beyond{' '}
              <strong>12 hours in a single workday</strong>.
            </p>
            <p className="text-[var(--muted)] leading-relaxed">
              <strong className="text-[var(--text)]">India Factories Act (§ 59) &amp; OSH Code:</strong> Workers
              working more than <strong>9 hours in a day</strong> or <strong>48 hours in a week</strong> are entitled to
              overtime wages at <strong>2.0× (twice)</strong> their ordinary rate of wages.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="https://www.dol.gov/agencies/whd/overtime"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-bold hover:underline"
              >
                US Dept. of Labor (WHD Overtime Portal) <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://labour.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-bold hover:underline"
              >
                India Ministry of Labour &amp; Employment <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <RelatedCalculatorsStrip
        links={[
          {
            title: 'Salary to Hourly Calculator',
            path: '/finance/salary-to-hourly-calculator',
            desc: 'Convert annual salary into hourly, daily, and bi-weekly pay rates.',
          },
          {
            title: 'Work Hours & Payroll Calculator',
            path: '/time-duration-calculator',
            desc: 'Track daily clock-in/out timesheets and break deductions.',
          },
          {
            title: 'Take-Home Pay Calculator',
            path: '/finance/take-home-pay-calculator',
            desc: 'Estimate net pay after income taxes and FICA deductions.',
          },
        ]}
      />
    </div>
  );
}
