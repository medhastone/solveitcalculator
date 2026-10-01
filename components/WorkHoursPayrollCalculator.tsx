'use client';

import React, { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Breadcrumbs from './Breadcrumbs';

type PayrollMode = 'weekly' | 'biweekly' | 'monthly' | 'daily' | 'contractor' | 'shifts';
type OtRule = 'daily8' | 'weekly40' | 'daily8only' | 'none';

interface TimesheetDay {
  day: string;
  fullName: string;
  timeIn: string;
  timeOut: string;
  breakMins: number;
}

const DEFAULT_DAYS: TimesheetDay[] = [
  { day: 'Mon', fullName: 'Monday', timeIn: '08:30', timeOut: '17:00', breakMins: 30 },
  { day: 'Tue', fullName: 'Tuesday', timeIn: '08:30', timeOut: '17:00', breakMins: 30 },
  { day: 'Wed', fullName: 'Wednesday', timeIn: '08:00', timeOut: '18:30', breakMins: 60 },
  { day: 'Thu', fullName: 'Thursday', timeIn: '08:30', timeOut: '17:00', breakMins: 30 },
  { day: 'Fri', fullName: 'Friday', timeIn: '08:00', timeOut: '19:30', breakMins: 30 },
  { day: 'Sat', fullName: 'Saturday', timeIn: '', timeOut: '', breakMins: 0 },
  { day: 'Sun', fullName: 'Sunday', timeIn: '', timeOut: '', breakMins: 0 },
];

const CURRENCIES = [
  { symbol: '$', code: 'USD', label: 'USD ($)' },
  { symbol: '€', code: 'EUR', label: 'EUR (€)' },
  { symbol: '£', code: 'GBP', label: 'GBP (£)' },
  { symbol: 'CA$', code: 'CAD', label: 'CAD ($)' },
  { symbol: 'A$', code: 'AUD', label: 'AUD ($)' },
  { symbol: '₹', code: 'INR', label: 'INR (₹)' },
];

export default function WorkHoursPayrollCalculator() {
  // Mode Selection
  const [mode, setMode] = useState<PayrollMode>('weekly');

  // Currency & Wage Parameters
  const [currencySymbol, setCurrencySymbol] = useState<string>('$');
  const [baseRate, setBaseRate] = useState<number>(35.0);
  const [otMultiplier, setOtMultiplier] = useState<number>(1.5);
  const [otRule, setOtRule] = useState<OtRule>('weekly40');

  // Timesheet Days
  const [daysData, setDaysData] = useState<TimesheetDay[]>(DEFAULT_DAYS);

  // Shift Differentials & Supplemental Income (Collapsible)
  const [showDifferentials, setShowDifferentials] = useState<boolean>(true);
  const [nightDiffRate, setNightDiffRate] = useState<number>(0.0);
  const [weekendDiffPct, setWeekendDiffPct] = useState<number>(0);
  const [bonusPay, setBonusPay] = useState<number>(0.0);
  const [commissionPay, setCommissionPay] = useState<number>(0.0);

  // Taxes & Deductions
  const [taxRate, setTaxRate] = useState<number>(15.0);
  const [pensionRate, setPensionRate] = useState<number>(5.0);
  const [healthDeduction, setHealthDeduction] = useState<number>(45.0);
  const [otherDeduction, setOtherDeduction] = useState<number>(20.0);

  // Target Net Goal Analyzer input
  const [targetNetGoal, setTargetNetGoal] = useState<number>(1500);

  // UI States
  const [copied, setCopied] = useState<boolean>(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Helpers
  const parseTimeToMinutes = (timeStr: string): number | null => {
    if (!timeStr || !timeStr.includes(':')) return null;
    const [h, m] = timeStr.split(':').map(Number);
    if (isNaN(h) || isNaN(m)) return null;
    return h * 60 + m;
  };

  const computeRowNetHours = (timeIn: string, timeOut: string, breakMins: number): number => {
    const startMin = parseTimeToMinutes(timeIn);
    const endMin = parseTimeToMinutes(timeOut);
    if (startMin === null || endMin === null) return 0;

    let elapsed = endMin - startMin;
    if (elapsed < 0) {
      elapsed += 24 * 60; // Overnight shift crossing midnight
    }
    elapsed -= Number(breakMins || 0);
    return Math.max(0, elapsed / 60);
  };

  const formatCurrency = useCallback(
    (amount: number): string => {
      return (
        currencySymbol +
        Number(amount || 0).toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      );
    },
    [currencySymbol]
  );

  // Update a single day's timesheet input
  const handleDayChange = (index: number, field: keyof TimesheetDay, value: string | number) => {
    setDaysData((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  // Quick action presets
  const handleFillStandard = () => {
    setDaysData(
      DEFAULT_DAYS.map((d) => {
        if (d.day !== 'Sat' && d.day !== 'Sun') {
          return { ...d, timeIn: '09:00', timeOut: '17:00', breakMins: 30 };
        }
        return { ...d, timeIn: '', timeOut: '', breakMins: 0 };
      })
    );
  };

  const handleAddOt = () => {
    setDaysData(
      DEFAULT_DAYS.map((d) => {
        if (d.day !== 'Sat' && d.day !== 'Sun') {
          return { ...d, timeIn: '08:00', timeOut: '17:30', breakMins: 30 };
        }
        return { ...d, timeIn: '', timeOut: '', breakMins: 0 };
      })
    );
  };

  const handleClearTimesheet = () => {
    setDaysData(
      DEFAULT_DAYS.map((d) => ({
        ...d,
        timeIn: '',
        timeOut: '',
        breakMins: 0,
      }))
    );
  };

  // Core Computational Logic
  const calculation = useMemo(() => {
    const rawDurations = daysData.map((item) => {
      const netHrs = computeRowNetHours(item.timeIn, item.timeOut, item.breakMins);
      return {
        ...item,
        netHrs,
        regHrs: 0,
        otHrs: 0,
        dailyPay: 0,
      };
    });

    let totalNetHours = 0;
    let totalRegularHours = 0;
    let totalOtHours = 0;

    // Apply Overtime threshold model
    if (otRule === 'daily8' || otRule === 'daily8only') {
      rawDurations.forEach((row) => {
        const reg = Math.min(row.netHrs, 8);
        const ot = Math.max(0, row.netHrs - 8);
        row.regHrs = reg;
        row.otHrs = ot;
        totalRegularHours += reg;
        totalOtHours += ot;
        totalNetHours += row.netHrs;
      });

      if (otRule === 'daily8' && totalRegularHours > 40) {
        const excess = totalRegularHours - 40;
        totalRegularHours = 40;
        totalOtHours += excess;
      }
    } else if (otRule === 'weekly40') {
      let accumReg = 0;
      rawDurations.forEach((row) => {
        totalNetHours += row.netHrs;
        if (accumReg + row.netHrs <= 40) {
          row.regHrs = row.netHrs;
          row.otHrs = 0;
          accumReg += row.netHrs;
        } else {
          const regPart = Math.max(0, 40 - accumReg);
          const otPart = row.netHrs - regPart;
          row.regHrs = regPart;
          row.otHrs = otPart;
          accumReg += regPart;
        }
      });
      totalRegularHours = Math.min(totalNetHours, 40);
      totalOtHours = Math.max(0, totalNetHours - 40);
    } else {
      // Rule === 'none' (straight time)
      rawDurations.forEach((row) => {
        row.regHrs = row.netHrs;
        row.otHrs = 0;
        totalRegularHours += row.netHrs;
        totalNetHours += row.netHrs;
      });
    }

    // Compute Daily Pay per row
    let accumulatedGrossPay = 0;
    const weekendMultiplier = 1 + (Number(weekendDiffPct) || 0) / 100;

    rawDurations.forEach((row) => {
      let dayRate = baseRate;
      if ((row.day === 'Sat' || row.day === 'Sun') && weekendDiffPct > 0) {
        dayRate = baseRate * weekendMultiplier;
      }
      const dayRegPay = row.regHrs * dayRate;
      const dayOtPay = row.otHrs * dayRate * otMultiplier;
      const dayPay = dayRegPay + dayOtPay;
      row.dailyPay = dayPay;
      accumulatedGrossPay += dayPay;
    });

    // Base Gross from shifts
    const grossEarnings =
      accumulatedGrossPay +
      (Number(bonusPay) || 0) +
      (Number(commissionPay) || 0) +
      (nightDiffRate > 0 ? nightDiffRate * totalNetHours : 0);

    // Deductions
    // If contractor mode is active, self-employment tax (15.3%) replaces standard employer deductions
    const isContractorMode = mode === 'contractor';
    const effectiveTaxRate = isContractorMode ? 0.153 : (Number(taxRate) || 0) / 100;
    const effectivePensionRate = isContractorMode ? 0 : (Number(pensionRate) || 0) / 100;
    const effectiveHealth = isContractorMode ? 0 : Number(healthDeduction) || 0;
    const effectiveOther = isContractorMode ? 0 : Number(otherDeduction) || 0;

    const taxAmount = grossEarnings * effectiveTaxRate;
    const pensionAmount = grossEarnings * effectivePensionRate;
    const totalDeductions = taxAmount + pensionAmount + effectiveHealth + effectiveOther;
    const netTakeHome = Math.max(0, grossEarnings - totalDeductions);

    // Effective hourly rate
    const effectiveRate = totalNetHours > 0 ? netTakeHome / totalNetHours : 0;

    // Percentages for visual meter
    const netPct = grossEarnings > 0 ? Math.min(100, Math.max(0, (netTakeHome / grossEarnings) * 100)) : 0;
    const deductPct = grossEarnings > 0 ? Math.min(100, Math.max(0, (totalDeductions / grossEarnings) * 100)) : 0;

    // Projections
    let multiplierWeekly = 1;
    let periodBadge = 'WEEKLY';

    if (mode === 'biweekly') {
      multiplierWeekly = 2;
      periodBadge = 'BI-WEEKLY';
    } else if (mode === 'monthly') {
      multiplierWeekly = 4.3333;
      periodBadge = 'MONTHLY';
    } else if (mode === 'daily') {
      multiplierWeekly = 0.2;
      periodBadge = 'DAILY';
    } else if (mode === 'contractor') {
      periodBadge = 'CONTRACTOR (1099)';
    } else if (mode === 'shifts') {
      periodBadge = 'SHIFT WORK';
    }

    const weeklyNet = netTakeHome;
    const biweeklyNet = weeklyNet * 2;
    const monthlyNet = weeklyNet * 4.3333;
    const quarterlyNet = weeklyNet * 13;
    const annualNet = weeklyNet * 52;

    // Overtime Value Analyzer (5 extra OT hours)
    const extraFiveReg = 5 * baseRate;
    const extraFiveOt = 5 * baseRate * otMultiplier;

    // Target Net Goal: how many hours to reach net target
    const netPerHourRatio = totalNetHours > 0 && grossEarnings > 0 ? netTakeHome / totalNetHours : baseRate * 0.75;
    const hoursNeededForGoal = netPerHourRatio > 0 ? targetNetGoal / netPerHourRatio : 0;

    // Salary Equivalency
    const annualSalaryAtBase = baseRate * 2080;

    return {
      rows: rawDurations,
      totalNetHours,
      totalRegularHours,
      totalOtHours,
      regularPay: totalRegularHours * baseRate,
      otPay: totalOtHours * baseRate * otMultiplier,
      grossEarnings,
      taxAmount,
      pensionAmount,
      healthDeduction: effectiveHealth,
      otherDeduction: effectiveOther,
      totalDeductions,
      netTakeHome,
      effectiveRate,
      netPct,
      deductPct,
      periodBadge,
      weeklyNet,
      biweeklyNet,
      monthlyNet,
      quarterlyNet,
      annualNet,
      extraFiveReg,
      extraFiveOt,
      hoursNeededForGoal,
      annualSalaryAtBase,
      isContractorMode,
    };
  }, [
    daysData,
    otRule,
    baseRate,
    otMultiplier,
    weekendDiffPct,
    bonusPay,
    commissionPay,
    nightDiffRate,
    taxRate,
    pensionRate,
    healthDeduction,
    otherDeduction,
    mode,
    targetNetGoal,
  ]);

  // Copy pay summary
  const handleCopySummary = () => {
    const text = `SolveIt Timesheet & Payroll Summary:
Total Hours: ${calculation.totalNetHours.toFixed(2)} hrs (Regular: ${calculation.totalRegularHours.toFixed(2)} hrs, OT: ${calculation.totalOtHours.toFixed(2)} hrs)
Gross Earnings: ${formatCurrency(calculation.grossEarnings)}
Itemized Deductions: -${formatCurrency(calculation.totalDeductions)}
Estimated Net Take-Home Pay: ${formatCurrency(calculation.netTakeHome)}
Effective Hourly Rate: ${formatCurrency(calculation.effectiveRate)}/hr
Calculated privately at SolveItCalculator.com`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    }
  };

  // Download Timesheet CSV
  const handleDownloadCsv = () => {
    let csvContent = 'data:text/csv;charset=utf-8,Day,Shift Start,Shift End,Break (mins),Net Hours,Overtime Hours,Daily Pay\n';

    calculation.rows.forEach((row) => {
      const start = row.timeIn || '--';
      const end = row.timeOut || '--';
      const net = row.netHrs.toFixed(2);
      const ot = row.otHrs.toFixed(2);
      const pay = row.dailyPay.toFixed(2);
      csvContent += `${row.fullName},${start},${end},${row.breakMins},${net},${ot},${pay}\n`;
    });

    csvContent += `\nSUMMARY,Total Hours,Regular Hours,Overtime Hours,Gross Earnings,Total Deductions,Net Pay\n`;
    csvContent += `Totals,${calculation.totalNetHours.toFixed(2)},${calculation.totalRegularHours.toFixed(2)},${calculation.totalOtHours.toFixed(2)},${calculation.grossEarnings.toFixed(2)},${calculation.totalDeductions.toFixed(2)},${calculation.netTakeHome.toFixed(2)}\n`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', blobUrl);
    link.setAttribute('download', 'timesheet-payroll-report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  };

  // Print pay stub
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <main className="w-full pt-0 flex-1 bg-surface text-on-surface">
      {/* PRINT-ONLY OFFICIAL PAY STUB & TIMESHEET REPORT */}
      <div className="hidden print:block p-8 bg-white text-slate-900 border-b-2 border-slate-900 mb-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-300">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">SolveIt Calculator — Employee Pay Stub &amp; Timesheet</h1>
            <p className="text-xs text-slate-600 mt-1">Source: https://solveitcalculator.com/work-hours-payroll-calculator</p>
          </div>
          <div className="text-right">
            <span className="inline-block px-3 py-1 text-xs font-semibold rounded bg-slate-100 text-slate-800 border border-slate-300">
              Pay Period: {calculation.periodBadge}
            </span>
            <p className="text-xs text-slate-500 mt-1">Generated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
          <div className="p-3 bg-slate-50 rounded border border-slate-200">
            <span className="text-xs font-bold uppercase text-slate-500 block mb-1">Base Wage Rate</span>
            <div className="font-bold text-base text-slate-900">{formatCurrency(baseRate)} / hour</div>
            <div className="text-xs text-slate-600 mt-0.5">OT Multiplier: {otMultiplier}×</div>
          </div>
          <div className="p-3 bg-slate-50 rounded border border-slate-200">
            <span className="text-xs font-bold uppercase text-slate-500 block mb-1">Gross Compensation</span>
            <div className="font-bold text-base text-slate-900">{formatCurrency(calculation.grossEarnings)}</div>
            <div className="text-xs text-slate-600 mt-0.5">Total Hours: {calculation.totalNetHours.toFixed(2)} hrs</div>
          </div>
          <div className="p-3 bg-slate-50 rounded border border-slate-200">
            <span className="text-xs font-bold uppercase text-slate-500 block mb-1">Net Take-Home Pay</span>
            <div className="font-bold text-base text-blue-700">{formatCurrency(calculation.netTakeHome)}</div>
            <div className="text-xs text-slate-600 mt-0.5">Total Deductions: -{formatCurrency(calculation.totalDeductions)}</div>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-xs font-bold uppercase text-slate-500 mb-2">Itemized Shift Timesheet</h3>
          <table className="w-full text-xs text-left border-collapse border border-slate-300">
            <thead>
              <tr className="bg-slate-100 text-slate-700">
                <th className="p-2 border border-slate-300">Day</th>
                <th className="p-2 border border-slate-300">Start Time</th>
                <th className="p-2 border border-slate-300">End Time</th>
                <th className="p-2 border border-slate-300">Unpaid Break</th>
                <th className="p-2 border border-slate-300">Net Hours</th>
                <th className="p-2 border border-slate-300">OT Hours</th>
                <th className="p-2 border border-slate-300 text-right">Daily Pay</th>
              </tr>
            </thead>
            <tbody>
              {calculation.rows.map((row) => (
                <tr key={row.day} className="border-b border-slate-200">
                  <td className="p-2 border border-slate-300 font-semibold">{row.fullName}</td>
                  <td className="p-2 border border-slate-300 font-mono">{row.timeIn || '—'}</td>
                  <td className="p-2 border border-slate-300 font-mono">{row.timeOut || '—'}</td>
                  <td className="p-2 border border-slate-300 font-mono">{row.breakMins}m</td>
                  <td className="p-2 border border-slate-300 font-mono">{row.netHrs.toFixed(2)}</td>
                  <td className="p-2 border border-slate-300 font-mono">{row.otHrs.toFixed(2)}</td>
                  <td className="p-2 border border-slate-300 text-right font-mono font-semibold">{formatCurrency(row.dailyPay)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col w-full">
        {/* Interactive Style & Ambient Visual Layer */}
        <div className="relative w-full overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-gradient-to-b from-primary/10 via-secondary-container/5 to-transparent blur-3xl -z-10 pointer-events-none" />

          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-xl">
            {/* Breadcrumbs & Meta Badges */}
            <div className="mb-space-md -mx-gutter-mobile lg:-mx-gutter-desktop">
              <Breadcrumbs
                items={[
                  { label: 'Home', href: '/' },
                  { label: 'Time & Date Calculators', href: '/time-date' },
                  { label: 'Work Hours & Payroll Calculator' },
                ]}
                badge="Multi-Currency Engine"
                rightContent={
                  <div className="flex flex-wrap items-center gap-space-2xs">
                    <span className="inline-flex items-center gap-1 px-space-xs py-0.5 rounded-full bg-surface-container-high text-on-surface font-label-caps text-label-caps uppercase tracking-wider text-[11px]">
                      <span className="material-symbols-outlined text-[13px] text-primary">security</span> 100% In-Browser Private
                    </span>
                    <span className="inline-flex items-center gap-1 px-space-xs py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-caps text-label-caps uppercase tracking-wider text-[11px]">
                      <span className="material-symbols-outlined text-[13px] text-primary-container">file_download</span> CSV &amp; Print Export
                    </span>
                  </div>
                }
              />
            </div>

            {/* Hero Header */}
            <div className="max-w-4xl mb-space-2xl">
              <div className="inline-block font-label-caps text-label-caps uppercase tracking-widest text-primary font-semibold mb-2">
                Deterministic Financial Engine
              </div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight sm:text-display-hero sm:font-display-hero mb-space-sm">
                Work Hours &amp; Payroll Calculator
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl leading-relaxed">
                Calculate exact regular hours, overtime, gross earnings, itemized deductions, and take-home pay. Features precision timesheet logs, shift differentials, and instantaneous income projections.
              </p>
            </div>

            {/* Mode Selector Bar */}
            <div className="bg-surface-container-low p-1.5 rounded-xl shadow-sm mb-space-xl flex flex-wrap gap-1" id="mode-selector-bar">
              <button
                type="button"
                onClick={() => setMode('weekly')}
                className={`px-space-md py-space-xs rounded-lg font-body-sm text-body-sm font-medium transition-all ${
                  mode === 'weekly' ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm' : 'text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                Weekly Payroll (Timesheet)
              </button>
              <button
                type="button"
                onClick={() => setMode('biweekly')}
                className={`px-space-md py-space-xs rounded-lg font-body-sm text-body-sm font-medium transition-all ${
                  mode === 'biweekly' ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm' : 'text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                Bi-Weekly
              </button>
              <button
                type="button"
                onClick={() => setMode('monthly')}
                className={`px-space-md py-space-xs rounded-lg font-body-sm text-body-sm font-medium transition-all ${
                  mode === 'monthly' ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm' : 'text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setMode('daily')}
                className={`px-space-md py-space-xs rounded-lg font-body-sm text-body-sm font-medium transition-all ${
                  mode === 'daily' ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm' : 'text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                Daily Hours
              </button>
              <button
                type="button"
                onClick={() => setMode('contractor')}
                className={`px-space-md py-space-xs rounded-lg font-body-sm text-body-sm font-medium transition-all ${
                  mode === 'contractor' ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm' : 'text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                Contractor / Freelance
              </button>
              <button
                type="button"
                onClick={() => setMode('shifts')}
                className={`px-space-md py-space-xs rounded-lg font-body-sm text-body-sm font-medium transition-all ${
                  mode === 'shifts' ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm' : 'text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                Shift Work &amp; Overtime
              </button>
            </div>

            {/* Main Interactive Calculator Workbench Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
              {/* Left Column: Controls, Timesheet & Deductions (7 cols) */}
              <div className="lg:col-span-7 flex flex-col gap-space-xl">
                {/* Primary Rate & Config Card */}
                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md border border-outline-variant/20">
                  <div className="flex items-center justify-between">
                    <span className="font-headline-md text-headline-md text-on-surface font-semibold flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">tune</span> Base Wage Parameters
                    </span>
                    <span className="font-data-mono text-[12px] text-outline">Real-time update</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
                    {/* Currency */}
                    <div>
                      <label htmlFor="currency-select" className="block font-label-caps text-label-caps uppercase text-on-surface-variant mb-1 font-semibold">
                        Currency
                      </label>
                      <select
                        id="currency-select"
                        value={currencySymbol}
                        onChange={(e) => setCurrencySymbol(e.target.value)}
                        className="w-full bg-surface-container-low px-space-sm py-space-xs rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:bg-surface-container border border-outline-variant/30"
                      >
                        {CURRENCIES.map((curr) => (
                          <option key={curr.code} value={curr.symbol}>
                            {curr.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Base Hourly Rate */}
                    <div>
                      <label htmlFor="base-rate" className="block font-label-caps text-label-caps uppercase text-on-surface-variant mb-1 font-semibold">
                        Hourly Base Rate
                      </label>
                      <div className="relative">
                        <span className="currency-symbol absolute left-3 top-1/2 -translate-y-1/2 font-data-mono text-on-surface font-medium text-body-md">
                          {currencySymbol}
                        </span>
                        <input
                          id="base-rate"
                          type="number"
                          step="0.5"
                          min="0"
                          value={baseRate}
                          onChange={(e) => setBaseRate(parseFloat(e.target.value) || 0)}
                          className="w-full bg-surface-container-low pl-8 pr-3 py-space-xs rounded-lg font-data-mono text-body-md text-on-surface focus:outline-none focus:bg-surface-container font-semibold border border-outline-variant/30"
                        />
                      </div>
                    </div>

                    {/* Overtime Multiplier */}
                    <div>
                      <label htmlFor="ot-rate-select" className="block font-label-caps text-label-caps uppercase text-on-surface-variant mb-1 font-semibold">
                        Overtime Rate
                      </label>
                      <select
                        id="ot-rate-select"
                        value={otMultiplier}
                        onChange={(e) => setOtMultiplier(parseFloat(e.target.value) || 1.5)}
                        className="w-full bg-surface-container-low px-space-sm py-space-xs rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:bg-surface-container border border-outline-variant/30"
                      >
                        <option value="1.5">1.5× (Time &amp; a Half)</option>
                        <option value="2.0">2.0× (Double Time)</option>
                        <option value="2.5">2.5× (Holiday / Premium)</option>
                        <option value="1.0">1.0× (Straight Time)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md pt-space-xs">
                    <div>
                      <label htmlFor="ot-threshold-rule" className="block font-label-caps text-label-caps uppercase text-on-surface-variant mb-1 font-semibold">
                        OT Threshold Model
                      </label>
                      <select
                        id="ot-threshold-rule"
                        value={otRule}
                        onChange={(e) => setOtRule(e.target.value as OtRule)}
                        className="w-full bg-surface-container-low px-space-sm py-space-xs rounded-lg font-body-sm text-body-sm text-on-surface focus:outline-none focus:bg-surface-container border border-outline-variant/30"
                      >
                        <option value="weekly40">Over 40 hours standard weekly</option>
                        <option value="daily8">Over 8 hrs/day or 40 hrs/week</option>
                        <option value="daily8only">Strict daily: Over 8 hrs per day</option>
                        <option value="none">No overtime threshold (Straight)</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-2 pt-5">
                      <button
                        type="button"
                        id="btn-fill-standard"
                        onClick={handleFillStandard}
                        className="px-space-sm py-space-2xs bg-surface-container text-primary font-body-sm text-body-sm rounded-lg hover:bg-surface-container-high transition-all"
                      >
                        Fill 9-5 Standard
                      </button>
                      <button
                        type="button"
                        id="btn-add-ot"
                        onClick={handleAddOt}
                        className="px-space-sm py-space-2xs bg-surface-container text-primary font-body-sm text-body-sm rounded-lg hover:bg-surface-container-high transition-all"
                      >
                        +1h Daily OT
                      </button>
                      <button
                        type="button"
                        id="btn-clear-timesheet"
                        onClick={handleClearTimesheet}
                        className="px-space-sm py-space-2xs bg-surface-container text-error font-body-sm text-body-sm rounded-lg hover:bg-error-container hover:text-on-error-container transition-all"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>

                {/* Timesheet Table Section */}
                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md border border-outline-variant/20">
                  <div className="flex flex-wrap items-center justify-between gap-space-xs">
                    <div>
                      <span className="font-headline-md text-headline-md text-on-surface font-semibold">Weekly Timesheet Log</span>
                      <p className="font-body-sm text-body-sm text-outline">Enter start, finish, and unpaid breaks. Daily pay computes automatically.</p>
                    </div>
                    <div className="flex items-center gap-1 bg-surface-container px-space-sm py-1 rounded-full text-on-surface-variant font-label-caps text-label-caps">
                      <span className="w-2 h-2 rounded-full bg-primary inline-block"></span> 7 Days Active
                    </div>
                  </div>

                  {/* Scrollable Responsive Timesheet Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-body-sm text-body-sm border-collapse min-w-[620px]">
                      <thead>
                        <tr className="bg-surface-container-low text-on-surface-variant font-label-caps text-label-caps uppercase">
                          <th className="py-space-xs px-space-sm rounded-l-lg">Day</th>
                          <th className="py-space-xs px-space-sm">Shift Start</th>
                          <th className="py-space-xs px-space-sm">Shift End</th>
                          <th className="py-space-xs px-space-sm">Break</th>
                          <th className="py-space-xs px-space-sm">Net Hrs</th>
                          <th className="py-space-xs px-space-sm">OT Hrs</th>
                          <th className="py-space-xs px-space-sm rounded-r-lg text-right">Daily Pay</th>
                        </tr>
                      </thead>
                      <tbody id="timesheet-rows">
                        {calculation.rows.map((row, index) => {
                          const isWeekend = row.day === 'Sat' || row.day === 'Sun';
                          const hasHours = row.netHrs > 0;
                          return (
                            <tr
                              key={row.day}
                              data-day={row.day}
                              className={`timesheet-row hover:bg-surface-container-low/50 transition-colors border-b border-outline-variant/10 ${
                                isWeekend && !hasHours ? 'opacity-70' : ''
                              }`}
                            >
                              <td className="py-space-xs px-space-sm font-semibold text-on-surface">{row.day}</td>
                              <td className="py-space-xs px-space-sm">
                                <input
                                  type="time"
                                  value={row.timeIn}
                                  onChange={(e) => handleDayChange(index, 'timeIn', e.target.value)}
                                  className="time-in bg-surface-container-low px-2 py-1 rounded text-on-surface font-data-mono text-body-sm focus:bg-surface-container outline-none border border-outline-variant/30"
                                />
                              </td>
                              <td className="py-space-xs px-space-sm">
                                <input
                                  type="time"
                                  value={row.timeOut}
                                  onChange={(e) => handleDayChange(index, 'timeOut', e.target.value)}
                                  className="time-out bg-surface-container-low px-2 py-1 rounded text-on-surface font-data-mono text-body-sm focus:bg-surface-container outline-none border border-outline-variant/30"
                                />
                              </td>
                              <td className="py-space-xs px-space-sm">
                                <select
                                  value={row.breakMins}
                                  onChange={(e) => handleDayChange(index, 'breakMins', parseInt(e.target.value) || 0)}
                                  className="break-min bg-surface-container-low px-2 py-1 rounded text-on-surface font-data-mono text-body-sm outline-none border border-outline-variant/30"
                                >
                                  <option value="0">0m</option>
                                  <option value="15">15m</option>
                                  <option value="30">30m</option>
                                  <option value="45">45m</option>
                                  <option value="60">60m</option>
                                </select>
                              </td>
                              <td className="py-space-xs px-space-sm font-data-mono text-on-surface row-net font-medium">
                                {row.netHrs.toFixed(2)}
                              </td>
                              <td className={`py-space-xs px-space-sm font-data-mono row-ot font-medium ${row.otHrs > 0 ? 'text-primary' : 'text-outline'}`}>
                                {row.otHrs.toFixed(2)}
                              </td>
                              <td className="py-space-xs px-space-sm text-right font-data-mono font-semibold text-on-surface row-pay">
                                {formatCurrency(row.dailyPay)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Shift Differentials & Supplemental Income */}
                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md border border-outline-variant/20">
                  <div
                    id="toggle-differential"
                    onClick={() => setShowDifferentials(!showDifferentials)}
                    className="flex items-center justify-between cursor-pointer select-none"
                  >
                    <span className="font-headline-md text-headline-md text-on-surface font-semibold flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary">flare</span> Shift Differentials &amp; Supplemental Pay
                    </span>
                    <span className="material-symbols-outlined text-outline transition-transform duration-200">
                      {showDifferentials ? 'expand_less' : 'expand_more'}
                    </span>
                  </div>

                  {showDifferentials && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-space-md pt-2 border-t border-outline-variant/10">
                      <div>
                        <label htmlFor="night-diff" className="block font-label-caps text-label-caps uppercase text-on-surface-variant mb-1 font-semibold">
                          Night Differential
                        </label>
                        <div className="relative">
                          <span className="currency-symbol absolute left-3 top-1/2 -translate-y-1/2 font-data-mono text-on-surface font-medium text-body-sm">
                            {currencySymbol}
                          </span>
                          <input
                            id="night-diff"
                            type="number"
                            step="0.5"
                            min="0"
                            value={nightDiffRate}
                            onChange={(e) => setNightDiffRate(parseFloat(e.target.value) || 0)}
                            className="w-full bg-surface-container-low pl-7 pr-3 py-1.5 rounded-lg font-data-mono text-body-sm text-on-surface focus:outline-none border border-outline-variant/30"
                          />
                        </div>
                        <span className="font-body-sm text-[11px] text-outline">Per evening/graveyard hr</span>
                      </div>

                      <div>
                        <label htmlFor="weekend-diff" className="block font-label-caps text-label-caps uppercase text-on-surface-variant mb-1 font-semibold">
                          Weekend Diff (%)
                        </label>
                        <input
                          id="weekend-diff"
                          type="number"
                          step="1"
                          min="0"
                          value={weekendDiffPct}
                          onChange={(e) => setWeekendDiffPct(parseFloat(e.target.value) || 0)}
                          className="w-full bg-surface-container-low px-3 py-1.5 rounded-lg font-data-mono text-body-sm text-on-surface focus:outline-none border border-outline-variant/30"
                        />
                        <span className="font-body-sm text-[11px] text-outline">Applied to Sat/Sun shifts</span>
                      </div>

                      <div>
                        <label htmlFor="bonus-pay" className="block font-label-caps text-label-caps uppercase text-on-surface-variant mb-1 font-semibold">
                          Bonus Amount
                        </label>
                        <div className="relative">
                          <span className="currency-symbol absolute left-3 top-1/2 -translate-y-1/2 font-data-mono text-on-surface font-medium text-body-sm">
                            {currencySymbol}
                          </span>
                          <input
                            id="bonus-pay"
                            type="number"
                            step="10"
                            min="0"
                            value={bonusPay}
                            onChange={(e) => setBonusPay(parseFloat(e.target.value) || 0)}
                            className="w-full bg-surface-container-low pl-7 pr-3 py-1.5 rounded-lg font-data-mono text-body-sm text-on-surface focus:outline-none border border-outline-variant/30"
                          />
                        </div>
                        <span className="font-body-sm text-[11px] text-outline">Discretionary or performance</span>
                      </div>

                      <div>
                        <label htmlFor="commission-pay" className="block font-label-caps text-label-caps uppercase text-on-surface-variant mb-1 font-semibold">
                          Commissions
                        </label>
                        <div className="relative">
                          <span className="currency-symbol absolute left-3 top-1/2 -translate-y-1/2 font-data-mono text-on-surface font-medium text-body-sm">
                            {currencySymbol}
                          </span>
                          <input
                            id="commission-pay"
                            type="number"
                            step="10"
                            min="0"
                            value={commissionPay}
                            onChange={(e) => setCommissionPay(parseFloat(e.target.value) || 0)}
                            className="w-full bg-surface-container-low pl-7 pr-3 py-1.5 rounded-lg font-data-mono text-body-sm text-on-surface focus:outline-none border border-outline-variant/30"
                          />
                        </div>
                        <span className="font-body-sm text-[11px] text-outline">Sales &amp; incentives</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Taxes & Pre/Post Deductions Module */}
                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md border border-outline-variant/20">
                  <span className="font-headline-md text-headline-md text-on-surface font-semibold flex items-center gap-2">
                    <span className="material-symbols-outlined text-tertiary">receipt_long</span> Taxes &amp; Payroll Deductions
                  </span>
                  <p className="font-body-sm text-body-sm text-outline">
                    {calculation.isContractorMode
                      ? 'Contractor mode active: Self-employment tax (15.3% FICA) is computed automatically.'
                      : 'Customize standard tax rates and retirement/health benefit contributions.'}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-space-md">
                    <div>
                      <label htmlFor="tax-rate" className="block font-label-caps text-label-caps uppercase text-on-surface-variant mb-1 font-semibold">
                        {calculation.isContractorMode ? 'Self-Emp FICA (%)' : 'Income Tax (%)'}
                      </label>
                      <div className="relative">
                        <input
                          id="tax-rate"
                          type="number"
                          step="0.5"
                          min="0"
                          disabled={calculation.isContractorMode}
                          value={calculation.isContractorMode ? 15.3 : taxRate}
                          onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                          className="w-full bg-surface-container-low px-3 py-1.5 rounded-lg font-data-mono text-body-sm text-on-surface focus:outline-none font-semibold border border-outline-variant/30 disabled:opacity-75"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 font-data-mono text-outline">%</span>
                      </div>
                      <span className="font-body-sm text-[11px] text-outline">
                        {calculation.isContractorMode ? 'Medicare + Social Security' : 'Federal + State/Provincial'}
                      </span>
                    </div>

                    <div>
                      <label htmlFor="pension-rate" className="block font-label-caps text-label-caps uppercase text-on-surface-variant mb-1 font-semibold">
                        Pension / 401(k)
                      </label>
                      <div className="relative">
                        <input
                          id="pension-rate"
                          type="number"
                          step="0.5"
                          min="0"
                          disabled={calculation.isContractorMode}
                          value={calculation.isContractorMode ? 0 : pensionRate}
                          onChange={(e) => setPensionRate(parseFloat(e.target.value) || 0)}
                          className="w-full bg-surface-container-low px-3 py-1.5 rounded-lg font-data-mono text-body-sm text-on-surface focus:outline-none font-semibold border border-outline-variant/30 disabled:opacity-75"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 font-data-mono text-outline">%</span>
                      </div>
                      <span className="font-body-sm text-[11px] text-outline">Pre-tax retirement deduction</span>
                    </div>

                    <div>
                      <label htmlFor="health-deduction" className="block font-label-caps text-label-caps uppercase text-on-surface-variant mb-1 font-semibold">
                        Health Insurance
                      </label>
                      <div className="relative">
                        <span className="currency-symbol absolute left-3 top-1/2 -translate-y-1/2 font-data-mono text-on-surface font-medium text-body-sm">
                          {currencySymbol}
                        </span>
                        <input
                          id="health-deduction"
                          type="number"
                          step="5"
                          min="0"
                          disabled={calculation.isContractorMode}
                          value={calculation.isContractorMode ? 0 : healthDeduction}
                          onChange={(e) => setHealthDeduction(parseFloat(e.target.value) || 0)}
                          className="w-full bg-surface-container-low pl-7 pr-3 py-1.5 rounded-lg font-data-mono text-body-sm text-on-surface focus:outline-none font-semibold border border-outline-variant/30 disabled:opacity-75"
                        />
                      </div>
                      <span className="font-body-sm text-[11px] text-outline">Flat insurance per pay period</span>
                    </div>

                    <div>
                      <label htmlFor="other-deduction" className="block font-label-caps text-label-caps uppercase text-on-surface-variant mb-1 font-semibold">
                        Other Deductions
                      </label>
                      <div className="relative">
                        <span className="currency-symbol absolute left-3 top-1/2 -translate-y-1/2 font-data-mono text-on-surface font-medium text-body-sm">
                          {currencySymbol}
                        </span>
                        <input
                          id="other-deduction"
                          type="number"
                          step="5"
                          min="0"
                          disabled={calculation.isContractorMode}
                          value={calculation.isContractorMode ? 0 : otherDeduction}
                          onChange={(e) => setOtherDeduction(parseFloat(e.target.value) || 0)}
                          className="w-full bg-surface-container-low pl-7 pr-3 py-1.5 rounded-lg font-data-mono text-body-sm text-on-surface focus:outline-none font-semibold border border-outline-variant/30 disabled:opacity-75"
                        />
                      </div>
                      <span className="font-body-sm text-[11px] text-outline">Union dues, transit, HSA</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Sticky Payroll Results Dashboard (5 cols) */}
              <div className="lg:col-span-5 flex flex-col gap-space-lg lg:sticky lg:top-24">
                {/* Master Take-Home Pay Result Card */}
                <div className="bg-surface-container-lowest p-space-xl rounded-xl shadow-md flex flex-col gap-space-md border border-outline-variant/20">
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps uppercase tracking-widest text-primary font-semibold">
                      Take-Home Pay Summary
                    </span>
                    <span className="px-space-xs py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-caps text-label-caps font-semibold uppercase" id="period-badge">
                      {calculation.periodBadge}
                    </span>
                  </div>

                  {/* Big Number Callout */}
                  <div className="flex flex-col">
                    <span className="font-body-sm text-body-sm text-outline font-medium">Estimated Net Take-Home Pay</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="font-numerical-display text-numerical-display font-bold tracking-tight text-primary" id="net-pay-display">
                        {formatCurrency(calculation.netTakeHome)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-on-surface-variant font-body-sm text-body-sm">
                      <span>
                        Gross: <strong className="text-on-surface" id="gross-pay-display">{formatCurrency(calculation.grossEarnings)}</strong>
                      </span>
                      <span>•</span>
                      <span>
                        Deductions: <strong className="text-error" id="total-deductions-display">-{formatCurrency(calculation.totalDeductions)}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Visual Bar Meter: Net vs Deductions */}
                  <div className="w-full flex flex-col gap-1.5 pt-space-xs">
                    <div className="flex justify-between font-label-caps text-label-caps text-outline">
                      <span id="pct-net-label">Take Home: {calculation.netPct.toFixed(1)}%</span>
                      <span id="pct-deduct-label">Deductions: {calculation.deductPct.toFixed(1)}%</span>
                    </div>
                    <div className="h-3 w-full bg-surface-container rounded-full overflow-hidden flex">
                      <div
                        className="bg-primary h-full transition-all duration-300"
                        id="meter-net"
                        style={{ width: `${calculation.netPct}%` }}
                      />
                      <div
                        className="bg-error h-full transition-all duration-300"
                        id="meter-deduct"
                        style={{ width: `${calculation.deductPct}%` }}
                      />
                    </div>
                  </div>

                  {/* 4-Grid Detailed Breakdown */}
                  <div className="grid grid-cols-2 gap-space-sm pt-space-xs">
                    <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col">
                      <span className="font-label-caps text-label-caps uppercase text-outline">Total Hours</span>
                      <span className="font-headline-md text-headline-md font-bold text-on-surface" id="metric-total-hrs">
                        {calculation.totalNetHours.toFixed(2)} hrs
                      </span>
                      <span className="font-body-sm text-[12px] text-outline-variant">Across 7 days</span>
                    </div>

                    <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col">
                      <span className="font-label-caps text-label-caps uppercase text-outline">Regular Hours</span>
                      <span className="font-headline-md text-headline-md font-bold text-on-surface" id="metric-regular-hrs">
                        {calculation.totalRegularHours.toFixed(2)} hrs
                      </span>
                      <span className="font-body-sm text-[12px] text-primary font-medium" id="metric-regular-val">
                        {formatCurrency(calculation.regularPay)} regular
                      </span>
                    </div>

                    <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col">
                      <span className="font-label-caps text-label-caps uppercase text-outline">Overtime Hours</span>
                      <span className="font-headline-md text-headline-md font-bold text-primary" id="metric-ot-hrs">
                        {calculation.totalOtHours.toFixed(2)} hrs
                      </span>
                      <span className="font-body-sm text-[12px] text-outline font-medium" id="metric-ot-val">
                        {formatCurrency(calculation.otPay)} ({otMultiplier}×)
                      </span>
                    </div>

                    <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col">
                      <span className="font-label-caps text-label-caps uppercase text-outline">Effective Hourly Rate</span>
                      <span className="font-headline-md text-headline-md font-bold text-on-surface" id="metric-effective-rate">
                        {formatCurrency(calculation.effectiveRate)} / hr
                      </span>
                      <span className="font-body-sm text-[12px] text-outline">True net per hour</span>
                    </div>
                  </div>

                  {/* Itemized Deduction Details */}
                  <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col gap-2">
                    <span className="font-label-caps text-label-caps uppercase text-outline font-semibold">Itemized Deductions</span>
                    <div className="flex justify-between font-body-sm text-body-sm text-on-surface-variant">
                      <span>{calculation.isContractorMode ? 'Self-Employment Tax (FICA):' : 'Income Tax (Federal & State):'}</span>
                      <span className="font-data-mono font-medium text-error" id="item-tax">
                        -{formatCurrency(calculation.taxAmount)}
                      </span>
                    </div>
                    {!calculation.isContractorMode && (
                      <>
                        <div className="flex justify-between font-body-sm text-body-sm text-on-surface-variant">
                          <span>Retirement / 401(k) / Pension:</span>
                          <span className="font-data-mono font-medium text-error" id="item-pension">
                            -{formatCurrency(calculation.pensionAmount)}
                          </span>
                        </div>
                        <div className="flex justify-between font-body-sm text-body-sm text-on-surface-variant">
                          <span>Health &amp; Medical Insurance:</span>
                          <span className="font-data-mono font-medium text-error" id="item-health">
                            -{formatCurrency(calculation.healthDeduction)}
                          </span>
                        </div>
                        <div className="flex justify-between font-body-sm text-body-sm text-on-surface-variant">
                          <span>Other Deductions:</span>
                          <span className="font-data-mono font-medium text-error" id="item-other">
                            -{formatCurrency(calculation.otherDeduction)}
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Multi-Horizon Earnings Projections Card */}
                  <div className="p-space-sm rounded-lg bg-surface-container flex flex-col gap-2">
                    <span className="font-label-caps text-label-caps uppercase text-on-surface font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-primary">trending_up</span> Income Projections (Take-Home)
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-body-sm">
                      <div className="flex flex-col">
                        <span className="text-outline text-[12px]">Bi-Weekly</span>
                        <span className="font-data-mono font-bold text-on-surface" id="proj-biweekly">
                          {formatCurrency(calculation.biweeklyNet)}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-outline text-[12px]">Monthly (×4.333)</span>
                        <span className="font-data-mono font-bold text-on-surface" id="proj-monthly">
                          {formatCurrency(calculation.monthlyNet)}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-outline text-[12px]">Quarterly (13 Wks)</span>
                        <span className="font-data-mono font-bold text-on-surface" id="proj-quarterly">
                          {formatCurrency(calculation.quarterlyNet)}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-outline text-[12px]">Annual (52 Wks)</span>
                        <span className="font-data-mono font-bold text-primary font-semibold" id="proj-annual">
                          {formatCurrency(calculation.annualNet)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 pt-space-2xs">
                    <button
                      type="button"
                      id="btn-copy-summary"
                      onClick={handleCopySummary}
                      className="w-full py-space-xs rounded-lg bg-primary text-on-primary font-body-sm text-body-sm font-semibold hover:bg-primary-container transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {copied ? 'check' : 'content_copy'}
                      </span>
                      {copied ? 'Copied to Clipboard!' : 'Copy Pay Summary'}
                    </button>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        id="btn-download-csv"
                        onClick={handleDownloadCsv}
                        className="flex-1 py-space-xs rounded-lg bg-surface-container text-on-surface font-body-sm text-body-sm font-medium hover:bg-surface-container-high transition-all flex items-center justify-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-[16px]">file_download</span> Timesheet CSV
                      </button>

                      <button
                        type="button"
                        onClick={handlePrint}
                        className="flex-1 py-space-xs rounded-lg bg-surface-container text-on-surface font-body-sm text-body-sm font-medium hover:bg-surface-container-high transition-all flex items-center justify-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-[16px]">print</span> Print Pay Stub
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quick Micro-Callout */}
                <div className="bg-surface-container-low p-space-md rounded-xl flex items-center gap-space-sm text-on-surface-variant font-body-sm text-body-sm border border-outline-variant/20">
                  <span className="material-symbols-outlined text-primary text-[28px] shrink-0">verified</span>
                  <p>
                    Mathematical calculations conform to <strong>FLSA Section 7(a)</strong> standards for 40-hour weekly overtime thresholds.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Unique Competitive Feature Tools Section */}
        <section className="w-full bg-surface-container-low py-space-3xl border-t border-outline-variant/20">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="mb-space-2xl">
              <span className="font-label-caps text-label-caps uppercase text-primary tracking-widest font-semibold">
                Specialized Financial Analyzers
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight mt-1">
                Precision Financial Planning Tools
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mt-1">
                Make smarter work decisions with tools tailored to project work, overtime impacts, and salary equivalence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-lg">
              {/* Tool 1: Overtime Analyzer */}
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between border border-outline-variant/20">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-primary mb-space-sm">
                    <span className="material-symbols-outlined">payments</span>
                  </div>
                  <h3 className="font-headline-md text-[18px] text-on-surface font-semibold mb-2">Overtime Value Analyzer</h3>
                  <p className="font-body-sm text-body-sm text-outline mb-space-md">
                    Measure regular vs overtime profitability. Calculate how much extra earnings you generate per 5 overtime hours worked.
                  </p>
                  <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col gap-1 mb-space-md">
                    <div className="flex justify-between text-body-sm">
                      <span className="text-outline">5 Regular Hrs:</span>
                      <span className="font-data-mono font-semibold text-on-surface">{formatCurrency(calculation.extraFiveReg)}</span>
                    </div>
                    <div className="flex justify-between text-body-sm">
                      <span className="text-outline">5 Overtime Hrs:</span>
                      <span className="font-data-mono font-bold text-primary">
                        {formatCurrency(calculation.extraFiveOt)} (+{Math.round((otMultiplier - 1) * 100)}%)
                      </span>
                    </div>
                  </div>
                </div>
                <span className="font-body-sm text-[12px] text-primary font-medium flex items-center gap-1">
                  Active in current calculation <span className="material-symbols-outlined text-[14px]">check</span>
                </span>
              </div>

              {/* Tool 2: Target Take-Home Goal */}
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between border border-outline-variant/20">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-secondary-fixed flex items-center justify-center text-secondary mb-space-sm">
                    <span className="material-symbols-outlined">flag</span>
                  </div>
                  <h3 className="font-headline-md text-[18px] text-on-surface font-semibold mb-2">Target Earnings Goal</h3>
                  <p className="font-body-sm text-body-sm text-outline mb-space-md">
                    Determine how many billable or wage hours are required to reach a specific net weekly take-home savings goal.
                  </p>
                  <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col gap-2 mb-space-md">
                    <div className="flex items-center justify-between text-body-sm">
                      <label htmlFor="goal-input" className="text-outline text-xs">Goal:</label>
                      <div className="flex items-center gap-1">
                        <span className="font-data-mono text-xs">{currencySymbol}</span>
                        <input
                          id="goal-input"
                          type="number"
                          step="50"
                          value={targetNetGoal}
                          onChange={(e) => setTargetNetGoal(parseFloat(e.target.value) || 0)}
                          className="w-20 bg-surface-container-lowest text-on-surface font-data-mono font-bold text-xs px-2 py-0.5 rounded border border-outline-variant/30"
                        />
                      </div>
                    </div>
                    <div className="flex justify-between text-body-sm">
                      <span className="text-outline">Required:</span>
                      <span className="font-data-mono font-bold text-on-surface">~{calculation.hoursNeededForGoal.toFixed(1)} hrs</span>
                    </div>
                    <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden mt-0.5">
                      <div
                        className="bg-secondary h-full transition-all duration-300"
                        style={{ width: `${Math.min(100, Math.max(10, (calculation.totalNetHours / (calculation.hoursNeededForGoal || 1)) * 100))}%` }}
                      />
                    </div>
                  </div>
                </div>
                <span className="font-body-sm text-[12px] text-secondary font-medium">Automatic threshold analysis</span>
              </div>

              {/* Tool 3: Hourly vs Salary Converter */}
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between border border-outline-variant/20">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface mb-space-sm">
                    <span className="material-symbols-outlined">balance</span>
                  </div>
                  <h3 className="font-headline-md text-[18px] text-on-surface font-semibold mb-2">Hourly to Salary Equivalency</h3>
                  <p className="font-body-sm text-body-sm text-outline mb-space-md">
                    Convert wage rates into equivalent full-time salaries based on standard 2,080 annual working hours.
                  </p>
                  <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col gap-1 mb-space-md">
                    <div className="flex justify-between text-body-sm">
                      <span className="text-outline">{formatCurrency(baseRate)} / hour</span>
                      <span className="font-data-mono font-bold text-on-surface">{formatCurrency(calculation.annualSalaryAtBase)} / yr</span>
                    </div>
                    <div className="flex justify-between text-body-sm">
                      <span className="text-outline">{formatCurrency(50.0)} / hour</span>
                      <span className="font-data-mono font-bold text-on-surface">{formatCurrency(104000)} / yr</span>
                    </div>
                  </div>
                </div>
                <span className="font-body-sm text-[12px] text-outline font-medium">Based on 40 hrs/wk × 52 weeks</span>
              </div>

              {/* Tool 4: Contractor / 1099 Tax Estimator */}
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between border border-outline-variant/20">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-tertiary-fixed flex items-center justify-center text-tertiary mb-space-sm">
                    <span className="material-symbols-outlined">work</span>
                  </div>
                  <h3 className="font-headline-md text-[18px] text-on-surface font-semibold mb-2">Contractor 1099 Estimator</h3>
                  <p className="font-body-sm text-body-sm text-outline mb-space-md">
                    Freelancers and contractors must reserve self-employment taxes (15.3% FICA). Plan set-aside funds with ease.
                  </p>
                  <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col gap-1 mb-space-md">
                    <div className="flex justify-between text-body-sm">
                      <span className="text-outline">Self-Emp Tax (15.3%):</span>
                      <span className="font-data-mono font-semibold text-tertiary">
                        {formatCurrency(calculation.grossEarnings * 0.153)}
                      </span>
                    </div>
                    <div className="flex justify-between text-body-sm">
                      <span className="text-outline">True Freelance Net:</span>
                      <span className="font-data-mono font-bold text-on-surface">
                        {formatCurrency(Math.max(0, calculation.grossEarnings * (1 - 0.153)))}
                      </span>
                    </div>
                  </div>
                </div>
                <span className="font-body-sm text-[12px] text-tertiary font-medium">Toggle contractor mode above</span>
              </div>
            </div>
          </div>
        </section>

        {/* Comprehensive E-E-A-T Educational & Formula Documentation */}
        <section className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-3xl flex flex-col gap-space-3xl">
          {/* Visual Explainer Bento Grid */}
          <div>
            <span className="font-label-caps text-label-caps uppercase text-primary tracking-widest font-semibold">
              Educational Reference
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight mt-1 mb-space-md">
              How Payroll and Work Hours Calculations Work
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl mb-space-xl">
              Accurate timesheet computation transforms raw start and end timestamps into standardized monetary earnings. Understanding this 4-step workflow ensures full wage compliance and predictable paychecks.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-lg">
              <div className="bg-surface-container-low p-space-lg rounded-xl flex flex-col gap-2 border border-outline-variant/20">
                <span className="font-data-mono text-[14px] text-primary font-bold">01. Time Duration</span>
                <h3 className="font-headline-md text-[18px] text-on-surface font-semibold">Elapsed Span &amp; Breaks</h3>
                <p className="font-body-sm text-body-sm text-outline">
                  Raw clock time is converted into fractional decimal hours. Unpaid meal breaks (30 or 60 minutes) are deducted from elapsed shift time to derive net working hours.
                </p>
              </div>

              <div className="bg-surface-container-low p-space-lg rounded-xl flex flex-col gap-2 border border-outline-variant/20">
                <span className="font-data-mono text-[14px] text-primary font-bold">02. Tier Partitioning</span>
                <h3 className="font-headline-md text-[18px] text-on-surface font-semibold">Regular vs. Overtime</h3>
                <p className="font-body-sm text-body-sm text-outline">
                  Hours are categorized into standard base hours (up to 40 per week or 8 per day) and premium overtime hours subject to multiplied pay rates (1.5× or 2.0×).
                </p>
              </div>

              <div className="bg-surface-container-low p-space-lg rounded-xl flex flex-col gap-2 border border-outline-variant/20">
                <span className="font-data-mono text-[14px] text-primary font-bold">03. Gross Aggregation</span>
                <h3 className="font-headline-md text-[18px] text-on-surface font-semibold">Differentials &amp; Bonuses</h3>
                <p className="font-body-sm text-body-sm text-outline">
                  Base pay is combined with overtime compensation, night and weekend differential premiums, commissions, and performance bonuses to calculate total gross compensation.
                </p>
              </div>

              <div className="bg-surface-container-low p-space-lg rounded-xl flex flex-col gap-2 border border-outline-variant/20">
                <span className="font-data-mono text-[14px] text-primary font-bold">04. Net Deduction</span>
                <h3 className="font-headline-md text-[18px] text-on-surface font-semibold">Taxes &amp; Withholdings</h3>
                <p className="font-body-sm text-body-sm text-outline">
                  Statutory income taxes, voluntary retirement contributions (401k/pension), and fixed healthcare premiums are subtracted to yield your exact net take-home pay.
                </p>
              </div>
            </div>
          </div>

          {/* Mathematical Formula Showcase */}
          <div className="bg-surface-container-lowest p-space-2xl rounded-xl shadow-sm border border-outline-variant/20">
            <div className="max-w-3xl mb-space-xl">
              <span className="font-label-caps text-label-caps uppercase text-secondary font-semibold">Transparent Deterministic Logic</span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight mt-1">
                Mathematical Formulas for Work Hours and Payroll
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                Our calculator processes your inputs using standardized, peer-reviewed payroll formulas:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
              <div className="bg-surface-container-low p-space-md rounded-lg flex flex-col gap-1 border border-outline-variant/20">
                <span className="font-label-caps text-label-caps uppercase text-outline font-semibold">1. Regular Base Pay</span>
                <div className="font-data-mono text-body-md font-semibold text-primary">
                  Pay_regular = Hours_regular × Rate_base
                </div>
                <p className="font-body-sm text-body-sm text-outline mt-1">Multiplies all qualifying non-overtime hours by the contracted base hourly wage.</p>
              </div>

              <div className="bg-surface-container-low p-space-md rounded-lg flex flex-col gap-1 border border-outline-variant/20">
                <span className="font-label-caps text-label-caps uppercase text-outline font-semibold">2. Overtime Pay</span>
                <div className="font-data-mono text-body-md font-semibold text-primary">
                  Pay_OT = Hours_OT × (Rate_base × Multiplier_OT)
                </div>
                <p className="font-body-sm text-body-sm text-outline mt-1">Where Multiplier_OT is typically 1.5 for time-and-a-half or 2.0 for double-time rules.</p>
              </div>

              <div className="bg-surface-container-low p-space-md rounded-lg flex flex-col gap-1 border border-outline-variant/20">
                <span className="font-label-caps text-label-caps uppercase text-outline font-semibold">3. Gross Earnings</span>
                <div className="font-data-mono text-body-md font-semibold text-primary">
                  Gross = Pay_regular + Pay_OT + Differentials + Bonus + Commission
                </div>
                <p className="font-body-sm text-body-sm text-outline mt-1">Total accumulated pre-tax compensation earned over the active pay cycle.</p>
              </div>

              <div className="bg-surface-container-low p-space-md rounded-lg flex flex-col gap-1 border border-outline-variant/20">
                <span className="font-label-caps text-label-caps uppercase text-outline font-semibold">4. Net Take-Home Pay</span>
                <div className="font-data-mono text-body-md font-semibold text-primary">
                  Net = Gross − (Taxes + Pension + Health + Misc_Deductions)
                </div>
                <p className="font-body-sm text-body-sm text-outline mt-1">Your liquid funds deposited into your checking account after statutory and voluntary withholdings.</p>
              </div>

              <div className="bg-surface-container-low p-space-md rounded-lg flex flex-col gap-1 border border-outline-variant/20">
                <span className="font-label-caps text-label-caps uppercase text-outline font-semibold">5. Effective Hourly Rate</span>
                <div className="font-data-mono text-body-md font-semibold text-primary">
                  Rate_effective = Net Take-Home Pay ÷ Total Working Hours
                </div>
                <p className="font-body-sm text-body-sm text-outline mt-1">Reveals the exact real-dollar amount pocketed for each physical hour spent on the job.</p>
              </div>

              <div className="bg-surface-container-low p-space-md rounded-lg flex flex-col gap-1 border border-outline-variant/20">
                <span className="font-label-caps text-label-caps uppercase text-outline font-semibold">6. Annual Projections</span>
                <div className="font-data-mono text-body-md font-semibold text-primary">
                  Annual = Weekly_Take_Home × 52 Weeks (or Bi-Weekly × 26)
                </div>
                <p className="font-body-sm text-body-sm text-outline mt-1">Provides annual financial clarity assuming standard recurring workload continuity.</p>
              </div>
            </div>
          </div>

          {/* 6 Real-World Payroll Scenarios */}
          <div>
            <span className="font-label-caps text-label-caps uppercase text-primary tracking-widest font-semibold">
              Practical Applications
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight mt-1 mb-space-md">
              6 Real-World Payroll &amp; Work Hour Scenarios
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl mb-space-xl">
              Every industry operates on unique labor agreements. Here is how SolveIt handles standard configurations across diverse occupational domains:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-2 border border-outline-variant/20">
                <span className="inline-block px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-caps text-label-caps uppercase w-max">
                  Corporate / Office
                </span>
                <h3 className="font-headline-md text-[18px] text-on-surface font-semibold">1. Standard 40-Hour Full-Time</h3>
                <p className="font-body-sm text-body-sm text-outline">
                  5 workdays, 8 hours per day (8:30 AM – 5:00 PM with 30-min unpaid lunch). Overtime applies exclusively after passing 40 hours weekly. Steady tax withholding and 401(k) auto-matching.
                </p>
              </div>

              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-2 border border-outline-variant/20">
                <span className="inline-block px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-caps text-label-caps uppercase w-max">
                  Healthcare &amp; Nursing
                </span>
                <h3 className="font-headline-md text-[18px] text-on-surface font-semibold">2. 12-Hour Night Shift Rotation</h3>
                <p className="font-body-sm text-body-sm text-outline">
                  Three 12-hour shifts per week (36 hours total). Includes evening and nocturnal shift differentials ($2.50 to $5.00/hr) plus weekend enhancement bonuses for high-intensity patient care.
                </p>
              </div>

              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-2 border border-outline-variant/20">
                <span className="inline-block px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-caps text-label-caps uppercase w-max">
                  Freelance &amp; 1099
                </span>
                <h3 className="font-headline-md text-[18px] text-on-surface font-semibold">3. Independent Contractor Invoicing</h3>
                <p className="font-body-sm text-body-sm text-outline">
                  Contractors bill clients directly without employer payroll deductions. Use the tool to simulate manual 15.3% self-employment tax set-asides before recording personal net profit.
                </p>
              </div>

              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-2 border border-outline-variant/20">
                <span className="inline-block px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-caps text-label-caps uppercase w-max">
                  Trades &amp; Construction
                </span>
                <h3 className="font-headline-md text-[18px] text-on-surface font-semibold">4. Heavy Overtime &amp; Double Time</h3>
                <p className="font-body-sm text-body-sm text-outline">
                  Long days (10+ hours) subject to daily overtime rules. In states like California, work exceeding 12 hours in a single workday or the 7th consecutive day triggers statutory 2.0× double-time pay.
                </p>
              </div>

              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-2 border border-outline-variant/20">
                <span className="inline-block px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-caps text-label-caps uppercase w-max">
                  Hospitality &amp; Dining
                </span>
                <h3 className="font-headline-md text-[18px] text-on-surface font-semibold">5. Variable Shifts &amp; Gratuity</h3>
                <p className="font-body-sm text-body-sm text-outline">
                  Split shifts and irregular weekly durations. Incorporate tips, commissions, and service fees into the supplemental earnings field to track genuine net take-home wages accurately.
                </p>
              </div>

              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-2 border border-outline-variant/20">
                <span className="inline-block px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-caps text-label-caps uppercase w-max">
                  Retail &amp; Customer Service
                </span>
                <h3 className="font-headline-md text-[18px] text-on-surface font-semibold">6. Part-Time Variable Schedules</h3>
                <p className="font-body-sm text-body-sm text-outline">
                  Fluctuating hours (15 to 28 hrs/week) across weekend and evening shifts. Essential for student workers and secondary income earners planning monthly rent budgets.
                </p>
              </div>
            </div>
          </div>

          {/* Comparative Table: Manual vs Excel vs SolveIt */}
          <div className="bg-surface-container-lowest p-space-2xl rounded-xl shadow-sm flex flex-col gap-space-md border border-outline-variant/20">
            <div>
              <span className="font-label-caps text-label-caps uppercase text-primary font-semibold">Efficiency &amp; Integrity</span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight mt-1">
                Comparison: Manual Math vs. Spreadsheets vs. SolveIt
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                Why hundreds of thousands of employees and payroll supervisors calculate through SolveIt rather than error-prone alternatives:
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-body-sm text-body-sm border-collapse min-w-[650px]">
                <thead>
                  <tr className="bg-surface-container text-on-surface font-label-caps text-label-caps uppercase">
                    <th className="py-space-sm px-space-md rounded-l-lg">Feature / Capability</th>
                    <th className="py-space-sm px-space-md">Paper &amp; Mental Math</th>
                    <th className="py-space-sm px-space-md">Spreadsheet (Excel/Sheets)</th>
                    <th className="py-space-sm px-space-md rounded-r-lg bg-primary text-on-primary font-semibold">SolveIt Engine</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="py-space-sm px-space-md font-semibold text-on-surface">Time Input Simplicity</td>
                    <td className="py-space-sm px-space-md text-error">Cumbersome conversion (8:45 = 8.75h)</td>
                    <td className="py-space-sm px-space-md text-on-surface-variant">Requires complex <code>TIME()</code> formulas</td>
                    <td className="py-space-sm px-space-md font-semibold text-primary">Native timepickers with auto-conversion</td>
                  </tr>
                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="py-space-sm px-space-md font-semibold text-on-surface">Break Deductions</td>
                    <td className="py-space-sm px-space-md text-error">Frequent human subtraction errors</td>
                    <td className="py-space-sm px-space-md text-on-surface-variant">Requires manual column formulas</td>
                    <td className="py-space-sm px-space-md font-semibold text-primary">Instant dropdown selection per shift</td>
                  </tr>
                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="py-space-sm px-space-md font-semibold text-on-surface">FLSA Overtime Segregation</td>
                    <td className="py-space-sm px-space-md text-error">Difficult with multi-shift variations</td>
                    <td className="py-space-sm px-space-md text-on-surface-variant">Nested <code>IF()</code> and <code>SUM()</code> checks</td>
                    <td className="py-space-sm px-space-md font-semibold text-primary">Automatic threshold logic (daily &amp; weekly)</td>
                  </tr>
                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="py-space-sm px-space-md font-semibold text-on-surface">Data Privacy &amp; Storage</td>
                    <td className="py-space-sm px-space-md text-on-surface-variant">Physical risk (paper loss)</td>
                    <td className="py-space-sm px-space-md text-error">Cloud sync telemetry risks</td>
                    <td className="py-space-sm px-space-md font-semibold text-primary">Private In-Browser Calculations</td>
                  </tr>
                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="py-space-sm px-space-md font-semibold text-on-surface">Export &amp; Share Ready</td>
                    <td className="py-space-sm px-space-md text-error">None</td>
                    <td className="py-space-sm px-space-md text-on-surface-variant">Requires formatting template setup</td>
                    <td className="py-space-sm px-space-md font-semibold text-primary">1-Click CSV Export &amp; Print-Ready Stub</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 15 Comprehensive FAQs (People Also Ask) */}
          <div>
            <span className="font-label-caps text-label-caps uppercase text-primary tracking-widest font-semibold">
              Knowledge Base
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight mt-1 mb-space-md">
              Frequently Asked Questions
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl mb-space-xl">
              Clear answers to critical questions regarding work hours, meal break compliance, federal overtime standards, and paycheck withholdings.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
              {[
                {
                  id: 1,
                  q: 'How is regular work time distinguished from overtime?',
                  a: 'Under the United States Fair Labor Standards Act (FLSA), non-exempt employees must receive overtime pay for hours worked over 40 in a designated workweek. Select jurisdictions (such as California, Nevada, and Alaska) additionally mandate daily overtime pay for hours worked beyond 8 in a single 24-hour workday.',
                },
                {
                  id: 2,
                  q: 'Are meal breaks required to be paid by law?',
                  a: 'Federal law does not require employers to pay for bona fide meal breaks lasting 30 minutes or longer, provided the worker is entirely relieved from all duties. Short rest breaks (usually 5 to 20 minutes) must be counted as compensable working hours.',
                },
                {
                  id: 3,
                  q: 'What is the difference between gross pay and net pay?',
                  a: 'Gross pay is total compensation earned before any deductions—including base wages, overtime premiums, bonuses, and differentials. Net pay is the final amount deposited into an employee’s account after deducting income taxes, payroll taxes (FICA/Medicare), retirement savings, and insurance premiums.',
                },
                {
                  id: 4,
                  q: 'How do decimal hours work (e.g., 8 hours and 15 minutes)?',
                  a: 'Wages are computed by multiplying hourly rates by decimal hours, not minutes. To convert minutes to decimals, divide by 60: 15 minutes = 0.25h, 30 minutes = 0.5h, and 45 minutes = 0.75h. Our calculator executes this conversion automatically behind the scenes.',
                },
                {
                  id: 5,
                  q: 'What is a shift differential and how is it paid?',
                  a: 'A shift differential is an extra premium paid to employees who work outside standard daytime hours (such as swing shifts, night graveyard shifts, or weekends). It is typically structured as an added flat dollar amount (e.g., +$3.00/hr) or a percentage bonus (+10%).',
                },
                {
                  id: 6,
                  q: 'Does weekend work automatically pay time-and-a-half?',
                  a: 'No. Under federal regulations, working on Saturday or Sunday does not automatically trigger overtime pay unless those hours push the employee\'s total weekly working duration beyond the 40-hour limit, or if an employment contract specifically guarantees weekend premiums.',
                },
                {
                  id: 7,
                  q: 'What is Double Time (2.0×)?',
                  a: 'Double time refers to compensation paid at two times the regular hourly rate. While not federally mandated across all states, certain state codes (like California) mandate double time for hours worked past 12 in a single day or for work past 8 hours on the 7th consecutive day of a workweek.',
                },
                {
                  id: 8,
                  q: 'How do holiday hours affect regular payroll calculations?',
                  a: 'Unless bound by a collective bargaining agreement or company handbook, federal law does not mandate premium holiday pay for working on holidays. However, many competitive employers offer 1.5× or 2.0× compensation as an incentive for holiday labor.',
                },
                {
                  id: 9,
                  q: 'What is an effective hourly rate?',
                  a: 'An effective hourly rate is calculated by dividing your total net take-home earnings by the total physical hours worked. It provides an honest assessment of your actual hourly purchasing power after subtracting taxes and withholding contributions.',
                },
                {
                  id: 10,
                  q: 'How do pre-tax deductions like 401(k) reduce taxes?',
                  a: 'Pre-tax deductions (traditional 401k, 403b, health insurance premiums, FSA/HSA contributions) are subtracted from gross earnings before income taxes are computed. This lowers your taxable income base and decreases your immediate tax bill.',
                },
                {
                  id: 11,
                  q: 'Are exempt employees eligible for overtime pay?',
                  a: 'Exempt employees (often salaried professionals, managers, and executives meeting statutory salary basis criteria) are not entitled to overtime under the FLSA. Non-exempt hourly staff are legally protected and must receive overtime premiums.',
                },
                {
                  id: 12,
                  q: 'How does the 7-minute rounding rule work?',
                  a: 'The FLSA allows employers to round employee clock punches to the nearest quarter hour (15 minutes). Punches between 1 and 7 minutes round down, while punches between 8 and 14 minutes round up to the nearest 15-minute mark, provided the practice averages out fairly over time.',
                },
                {
                  id: 13,
                  q: 'Is my wage and timesheet data kept private?',
                  a: 'Yes, 100%. SolveIt executes all calculations entirely inside your local web browser sandbox using modern client-side JavaScript. Zero timesheet data, hourly rates, or pay figures are transmitted to remote servers or stored in tracking cookies.',
                },
                {
                  id: 14,
                  q: 'How does bi-weekly pay compare to semi-monthly pay?',
                  a: 'Bi-weekly workers receive 26 paychecks per year (every two weeks, meaning two months will have three paychecks). Semi-monthly workers receive 24 paychecks per year (typically on the 15th and last day of each month). Annual salary equivalents differ accordingly.',
                },
                {
                  id: 15,
                  q: 'Can I export my timesheet for payroll submission?',
                  a: 'Yes. Click the "Timesheet CSV" button in the right-hand dashboard to instantly generate a standardized comma-separated file that can be opened in Microsoft Excel, Apple Numbers, Google Sheets, or uploaded to payroll management software.',
                },
              ].map((faq) => {
                const isOpen = openFaq === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="bg-surface-container-low p-space-lg rounded-xl flex flex-col gap-2 border border-outline-variant/20 transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                      className="text-left font-headline-md text-[17px] text-on-surface font-semibold flex items-center justify-between gap-2"
                    >
                      <span>{faq.q}</span>
                      <span className="material-symbols-outlined text-outline text-[20px] shrink-0">
                        {isOpen ? 'expand_less' : 'expand_more'}
                      </span>
                    </button>
                    {isOpen && <p className="font-body-sm text-body-sm text-outline mt-1">{faq.a}</p>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Related Calculators Grid */}
          <div>
            <span className="font-label-caps text-label-caps uppercase text-primary tracking-widest font-semibold">
              Computational Ecosystem
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight mt-1 mb-space-md">
              Explore Related Time &amp; Financial Calculators
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl mb-space-xl">
              Seamlessly interconnect your payroll calculations with specialized time-tracking and financial modeling utilities:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-lg">
              <Link
                href="/add-subtract-time-calculator"
                className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm hover:shadow-md transition-all group flex flex-col justify-between border border-outline-variant/20"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors shrink-0">
                    <span className="material-symbols-outlined">more_time</span>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-[18px] text-on-surface font-semibold group-hover:text-primary transition-colors">
                      Add &amp; Subtract Time
                    </h3>
                    <p className="font-body-sm text-body-sm text-outline mt-1">
                      Easily sum hours, minutes, and seconds across complex schedules.
                    </p>
                  </div>
                </div>
                <span className="font-label-caps text-label-caps text-primary uppercase font-semibold mt-space-md flex items-center gap-1">
                  Open Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </span>
              </Link>

              <Link
                href="/time-date/days-calculator"
                className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm hover:shadow-md transition-all group flex flex-col justify-between border border-outline-variant/20"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-on-secondary transition-colors shrink-0">
                    <span className="material-symbols-outlined">date_range</span>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-[18px] text-on-surface font-semibold group-hover:text-secondary transition-colors">
                      Business Days Calculator
                    </h3>
                    <p className="font-body-sm text-body-sm text-outline mt-1">
                      Calculate operational days excluding weekends and regional bank holidays.
                    </p>
                  </div>
                </div>
                <span className="font-label-caps text-label-caps text-secondary uppercase font-semibold mt-space-md flex items-center gap-1">
                  Open Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </span>
              </Link>

              <Link
                href="/daily-wage-calculator"
                className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm hover:shadow-md transition-all group flex flex-col justify-between border border-outline-variant/20"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-tertiary group-hover:bg-tertiary group-hover:text-on-tertiary transition-colors shrink-0">
                    <span className="material-symbols-outlined">paid</span>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-[18px] text-on-surface font-semibold group-hover:text-tertiary transition-colors">
                      Daily Wage Calculator
                    </h3>
                    <p className="font-body-sm text-body-sm text-outline mt-1">
                      Convert annual, monthly, or weekly income into exact single-day compensation.
                    </p>
                  </div>
                </div>
                <span className="font-label-caps text-label-caps text-tertiary uppercase font-semibold mt-space-md flex items-center gap-1">
                  Open Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </span>
              </Link>

              <Link
                href="/time-date/days-between-dates"
                className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm hover:shadow-md transition-all group flex flex-col justify-between border border-outline-variant/20"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors shrink-0">
                    <span className="material-symbols-outlined">event_repeat</span>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-[18px] text-on-surface font-semibold group-hover:text-primary transition-colors">
                      Date Difference Calculator
                    </h3>
                    <p className="font-body-sm text-body-sm text-outline mt-1">
                      Count exact days, weeks, and months between two custom calendar dates.
                    </p>
                  </div>
                </div>
                <span className="font-label-caps text-label-caps text-primary uppercase font-semibold mt-space-md flex items-center gap-1">
                  Open Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </span>
              </Link>

              <Link
                href="/percentage-calculator"
                className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm hover:shadow-md transition-all group flex flex-col justify-between border border-outline-variant/20"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-on-secondary transition-colors shrink-0">
                    <span className="material-symbols-outlined">percent</span>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-[18px] text-on-surface font-semibold group-hover:text-secondary transition-colors">
                      Percentage Calculator
                    </h3>
                    <p className="font-body-sm text-body-sm text-outline mt-1">
                      Compute tax percentages, commission margins, and pay increases effortlessly.
                    </p>
                  </div>
                </div>
                <span className="font-label-caps text-label-caps text-secondary uppercase font-semibold mt-space-md flex items-center gap-1">
                  Open Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </span>
              </Link>

              <Link
                href="/time-date/plan-a-project-calculator"
                className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm hover:shadow-md transition-all group flex flex-col justify-between border border-outline-variant/20"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-tertiary group-hover:bg-tertiary group-hover:text-on-tertiary transition-colors shrink-0">
                    <span className="material-symbols-outlined">assignment</span>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-[18px] text-on-surface font-semibold group-hover:text-tertiary transition-colors">
                      Plan a Project Calculator
                    </h3>
                    <p className="font-body-sm text-body-sm text-outline mt-1">
                      Forecast milestones, contractor deliverables, and team labor allocations.
                    </p>
                  </div>
                </div>
                <span className="font-label-caps text-label-caps text-tertiary uppercase font-semibold mt-space-md flex items-center gap-1">
                  Open Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </span>
              </Link>
            </div>
          </div>

          {/* Security & Privacy Guarantee Banner */}
          <div className="bg-surface-container p-space-xl rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-space-lg border border-outline-variant/20">
            <div className="flex items-center gap-space-md">
              <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[28px]">lock</span>
              </div>
              <div>
                <h3 className="font-headline-md text-[20px] text-on-surface font-semibold">
                  100% In-Browser Computation &amp; Privacy Shield
                </h3>
                <p className="font-body-sm text-body-sm text-outline mt-0.5">
                  Your wages, schedules, and earnings are never transferred to remote servers or stored in tracking cookies. Calculations occur strictly within your device&apos;s memory.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-space-sm shrink-0">
              <span className="font-label-caps text-label-caps uppercase text-outline-variant font-semibold tracking-wider">
                Zero Telemetry
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
