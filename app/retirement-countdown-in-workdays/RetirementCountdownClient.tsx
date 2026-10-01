'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';

// Pre-defined schedule profiles
interface SchedulePreset {
  id: string;
  name: string;
  label: string;
  hours: number[]; // [Sun, Mon, Tue, Wed, Thu, Fri, Sat]
}

const SCHEDULE_PRESETS: SchedulePreset[] = [
  { id: 'standard', name: 'Standard (M-F 8h)', label: 'Mon–Fri (8h/day)', hours: [0, 8, 8, 8, 8, 8, 0] },
  { id: 'mon-sat', name: 'Mon–Sat (6 Days)', label: 'Mon–Sat (8h/day)', hours: [0, 8, 8, 8, 8, 8, 8] },
  { id: '4-10', name: '4x10 Schedule', label: '4x10 (Mon-Thu 10h)', hours: [0, 10, 10, 10, 10, 0, 0] },
  { id: 'rotating-4-4', name: '4-on / 4-off (12h)', label: '4-on / 4-off (12h)', hours: [12, 12, 12, 12, 0, 0, 0] },
  { id: '3-12', name: '3x12 Healthcare', label: '3x12 (36h/week)', hours: [0, 12, 12, 12, 0, 0, 0] },
  { id: 'phased', name: 'Phased 3-Day (24h)', label: 'Phased 3-Day (24h/week)', hours: [0, 8, 8, 8, 0, 0, 0] },
];

const DEFAULT_HOLIDAYS = [
  { id: 'nyd', name: "New Year's Day (Jan 1)", checked: true },
  { id: 'mlk', name: 'MLK Jr. Day (3rd Mon Jan)', checked: true },
  { id: 'memorial', name: 'Memorial Day (Last Mon May)', checked: true },
  { id: 'juneteenth', name: 'Juneteenth (June 19)', checked: true },
  { id: 'independence', name: 'Independence Day (July 4)', checked: true },
  { id: 'labor', name: 'Labor Day (1st Mon Sep)', checked: true },
  { id: 'veterans', name: 'Veterans Day (Nov 11)', checked: true },
  { id: 'thanksgiving', name: 'Thanksgiving Day (4th Thu Nov)', checked: true },
  { id: 'day_after_tg', name: 'Day after Thanksgiving', checked: true },
  { id: 'xmas_eve', name: 'Christmas Eve (Dec 24)', checked: true },
  { id: 'xmas_day', name: 'Christmas Day (Dec 25)', checked: true },
  { id: 'nye', name: "New Year's Eve (Dec 31)", checked: false },
];

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function formatDateFriendly(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });
}

function parseDateInput(str: string): Date {
  if (!str) return new Date();
  const parts = str.split('-').map(Number);
  return new Date(parts[0], parts[1] - 1, parts[2], 0, 0, 0);
}

function dateToString(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export default function RetirementCountdownClient() {
  const [mounted, setMounted] = useState(false);
  const [startDateStr, setStartDateStr] = useState<string>('2026-05-18');
  const [retireDateStr, setRetireDateStr] = useState<string>('2030-12-31');
  const [ptoDays, setPtoDays] = useState<number>(28);
  const [holidaysPerYear, setHolidaysPerYear] = useState<number>(11);
  const [activePreset, setActivePreset] = useState<string>('standard');
  const [dailyHours, setDailyHours] = useState<number[]>([0, 8, 8, 8, 8, 8, 0]);
  const [shiftAnchorDate, setShiftAnchorDate] = useState<string>('2026-05-18');
  const [activeTab, setActiveTab] = useState<string>('tab-schedule');
  const [ptoStrategy, setPtoStrategy] = useState<'terminal' | 'spread'>('terminal');
  const [holidaysList, setHolidaysList] = useState(DEFAULT_HOLIDAYS);
  const [copyFeedback, setCopyFeedback] = useState<boolean>(false);
  const [careerStartYear, setCareerStartYear] = useState<number>(2000);

  // Active Suite Mode: allows instant in-place switching without leaving the page
  const [activeSuiteTool, setActiveSuiteTool] = useState<
    'countdown' | 'pension' | 'growth' | 'social-security' | 'monte-carlo'
  >('countdown');

  // Interactive Slider State: 1. Pension Estimator & Savings
  const [pensionSalary, setPensionSalary] = useState<number>(85000);
  const [pensionYears, setPensionYears] = useState<number>(25);
  const [pensionMultiplier, setPensionMultiplier] = useState<number>(1.8);
  const [pensionDiscountRate, setPensionDiscountRate] = useState<number>(4.5);

  // Interactive Slider State: 2. 401(k) & Growth Planner
  const [growthBalance, setGrowthBalance] = useState<number>(150000);
  const [growthMonthlyContrib, setGrowthMonthlyContrib] = useState<number>(800);
  const [growthEmployerMatchPct, setGrowthEmployerMatchPct] = useState<number>(50);
  const [growthReturnRate, setGrowthReturnRate] = useState<number>(7.5);
  const [growthYears, setGrowthYears] = useState<number>(12);

  // Interactive Slider State: 3. Social Security Calculator
  const [ssClaimAge, setSsClaimAge] = useState<number>(67);
  const [ssPia, setSsPia] = useState<number>(2400);
  const [ssCola, setSsCola] = useState<number>(2.5);

  // Interactive Slider State: 4. Monte Carlo Simulator
  const [mcPortfolio, setMcPortfolio] = useState<number>(750000);
  const [mcWithdrawalRate, setMcWithdrawalRate] = useState<number>(4.0);
  const [mcEquityPct, setMcEquityPct] = useState<number>(70);
  const [mcHorizon, setMcHorizon] = useState<number>(30);

  // Set today on client mount
  useEffect(() => {
    setMounted(true);
    const today = new Date();
    const todayStr = dateToString(today);
    // If today is after 2026-05-18, initialize with today
    if (today > new Date('2026-05-18')) {
      setStartDateStr(todayStr);
      setShiftAnchorDate(todayStr);
    }
  }, []);

  const handleUseToday = () => {
    const todayStr = dateToString(new Date());
    setStartDateStr(todayStr);
  };

  const handleApplyPreset = (presetId: string) => {
    setActivePreset(presetId);
    const preset = SCHEDULE_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setDailyHours([...preset.hours]);
    }
  };

  const handleDailyHourChange = (dayIndex: number, val: number) => {
    const newHours = [...dailyHours];
    newHours[dayIndex] = Math.max(0, Math.min(24, val || 0));
    setDailyHours(newHours);
    setActivePreset('custom');
  };

  const handleQuickTargetYears = (years: number) => {
    const start = parseDateInput(startDateStr);
    const target = new Date(start.getTime());
    if (years === 0.5) {
      target.setMonth(11);
      target.setDate(31);
    } else {
      target.setFullYear(target.getFullYear() + Math.floor(years));
    }
    setRetireDateStr(dateToString(target));
  };

  const handleQuickTargetFixed = (dateStr: string) => {
    setRetireDateStr(dateStr);
  };

  const handleToggleAllHolidays = () => {
    const allChecked = holidaysList.every((h) => h.checked);
    const nextList = holidaysList.map((h) => ({ ...h, checked: !allChecked }));
    setHolidaysList(nextList);
    const checkedCount = nextList.filter((h) => h.checked).length;
    setHolidaysPerYear(checkedCount);
  };

  const handleToggleHolidayItem = (id: string) => {
    const nextList = holidaysList.map((h) => (h.id === id ? { ...h, checked: !h.checked } : h));
    setHolidaysList(nextList);
    const checkedCount = nextList.filter((h) => h.checked).length;
    setHolidaysPerYear(checkedCount);
  };

  const handleResetDefaults = () => {
    setStartDateStr('2026-05-18');
    setRetireDateStr('2030-12-31');
    setPtoDays(28);
    setHolidaysPerYear(11);
    setActivePreset('standard');
    setDailyHours([0, 8, 8, 8, 8, 8, 0]);
    setHolidaysList(DEFAULT_HOLIDAYS);
    setPtoStrategy('terminal');
    setActiveTab('tab-schedule');
  };

  // Primary Calculation Logic
  const calc = useMemo(() => {
    const start = parseDateInput(startDateStr);
    const end = parseDateInput(retireDateStr);

    if (end <= start) {
      return {
        isValid: false,
        error: 'Target retirement date must be after the start date.',
        targetDayName: DAY_NAMES[end.getDay()],
        years: 0,
        months: 0,
        days: 0,
        ymdStr: '0y 0m 0d',
        totalCalendarDays: 0,
        totalWeeks: '0.0',
        totalClockHours: 0,
        scheduledWorkdays: 0,
        rawWorkingHours: 0,
        totalHolidaysInPeriod: 0,
        netWorkdays: 0,
        netHours: 0,
        finalDay: end,
        finalDayFormatted: formatDateFriendly(end),
        freedomDays: 0,
        isEndWorkday: false,
        workPercent: 100,
        weekendDaysCount: 0,
      };
    }

    const diffMs = end.getTime() - start.getTime();
    const totalCalendarDays = Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)));
    const totalWeeks = (totalCalendarDays / 7).toFixed(1);
    const totalClockHours = totalCalendarDays * 24;

    // Y-M-D Breakdown
    const y1 = start.getFullYear();
    const m1 = start.getMonth();
    const d1 = start.getDate();
    const y2 = end.getFullYear();
    const m2 = end.getMonth();
    const d2 = end.getDate();

    let years = y2 - y1;
    let months = m2 - m1;
    let days = d2 - d1;

    if (days < 0) {
      months--;
      const prevMonthLastDay = new Date(y2, m2, 0).getDate();
      days += prevMonthLastDay;
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    // Workday and shift counting
    let scheduledWorkdays = 0;
    let rawWorkingHours = 0;
    let weekendDaysCount = 0;
    const cur = new Date(start.getTime());

    while (cur < end) {
      cur.setDate(cur.getDate() + 1);
      const dow = cur.getDay();
      const hrs = dailyHours[dow] || 0;
      if (hrs > 0) {
        scheduledWorkdays++;
        rawWorkingHours += hrs;
      }
      if (dow === 0 || dow === 6) {
        weekendDaysCount++;
      }
    }

    const validPto = Math.max(0, ptoDays);
    const validHolidaysAnnual = Math.max(0, holidaysPerYear);
    const yearsSpan = totalCalendarDays / 365.25;
    const totalHolidaysInPeriod = Math.round(validHolidaysAnnual * yearsSpan);

    const totalDeductions = validPto + totalHolidaysInPeriod;
    const netWorkdays = Math.max(0, scheduledWorkdays - totalDeductions);
    const avgShiftLength = scheduledWorkdays > 0 ? rawWorkingHours / scheduledWorkdays : 8;
    const netHours = Math.round(netWorkdays * avgShiftLength);

    // Estimated Last Working Day (Count backward by PTO working days)
    const finalDay = new Date(end.getTime());
    let ptoDeducted = 0;
    while (ptoDeducted < validPto) {
      finalDay.setDate(finalDay.getDate() - 1);
      const dow = finalDay.getDay();
      if ((dailyHours[dow] || 0) > 0) {
        ptoDeducted++;
      }
    }

    const freedomDiffMs = end.getTime() - finalDay.getTime();
    const freedomDays = Math.max(0, Math.round(freedomDiffMs / (1000 * 60 * 60 * 24)));
    const isEndWorkday = (dailyHours[end.getDay()] || 0) > 0;
    const workPercent = scheduledWorkdays > 0 ? Math.min(100, Math.round((netWorkdays / scheduledWorkdays) * 100)) : 100;

    return {
      isValid: true,
      error: null,
      targetDayName: DAY_NAMES[end.getDay()],
      years,
      months,
      days,
      ymdStr: `${years}y ${months}m ${days}d`,
      totalCalendarDays,
      totalWeeks,
      totalClockHours,
      scheduledWorkdays,
      rawWorkingHours,
      totalHolidaysInPeriod,
      netWorkdays,
      netHours,
      finalDay,
      finalDayFormatted: formatDateFriendly(finalDay),
      freedomDays,
      isEndWorkday,
      workPercent,
      weekendDaysCount,
    };
  }, [startDateStr, retireDateStr, dailyHours, ptoDays, holidaysPerYear]);

  // Career Progress Calculation
  const careerProgress = useMemo(() => {
    const startYear = careerStartYear;
    const currentYear = new Date().getFullYear();
    const retireYear = parseDateInput(retireDateStr).getFullYear();
    const totalSpan = Math.max(1, retireYear - startYear);
    const elapsed = Math.max(0, currentYear - startYear);
    const pct = Math.min(100, Math.max(0, (elapsed / totalSpan) * 100));
    return {
      percent: pct.toFixed(1),
      startYear,
      currentYear,
      retireYear,
    };
  }, [careerStartYear, retireDateStr]);

  // Tool 1 Calc: Pension Estimator & Savings
  const pensionCalc = useMemo(() => {
    const annualPension = pensionSalary * (pensionYears * (pensionMultiplier / 100));
    const monthlyPension = annualPension / 12;
    const replacementRate = pensionSalary > 0 ? (annualPension / pensionSalary) * 100 : 0;
    const r = pensionDiscountRate / 100;
    const lumpSumEstimate =
      r > 0
        ? annualPension * ((1 - Math.pow(1 + r, -25)) / r)
        : annualPension * 25;
    const lifetime25Yr = annualPension * 25;

    return {
      annualPension: Math.round(annualPension),
      monthlyPension: Math.round(monthlyPension),
      replacementRate: replacementRate.toFixed(1),
      lumpSumEstimate: Math.round(lumpSumEstimate),
      lifetime25Yr: Math.round(lifetime25Yr),
    };
  }, [pensionSalary, pensionYears, pensionMultiplier, pensionDiscountRate]);

  // Tool 2 Calc: 401(k) & Growth Planner
  const growthCalc = useMemo(() => {
    const monthlyRate = growthReturnRate / 100 / 12;
    const totalMonths = growthYears * 12;
    const monthlyMatch = growthMonthlyContrib * (growthEmployerMatchPct / 100);
    const totalMonthlyDeposit = growthMonthlyContrib + monthlyMatch;

    const fvInitial = growthBalance * Math.pow(1 + monthlyRate, totalMonths);
    const fvDeposits =
      monthlyRate > 0
        ? totalMonthlyDeposit * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate)
        : totalMonthlyDeposit * totalMonths;

    const totalNestEgg = Math.round(fvInitial + fvDeposits);
    const totalPersonalContrib = Math.round(growthMonthlyContrib * totalMonths);
    const totalEmployerMatch = Math.round(monthlyMatch * totalMonths);
    const totalGrowth = Math.max(
      0,
      totalNestEgg - (growthBalance + totalPersonalContrib + totalEmployerMatch)
    );
    const safeMonthlyDrawdown = Math.round((totalNestEgg * 0.04) / 12);

    return {
      totalNestEgg,
      totalPersonalContrib,
      totalEmployerMatch,
      totalGrowth,
      safeMonthlyDrawdown,
      totalDeposited: growthBalance + totalPersonalContrib + totalEmployerMatch,
    };
  }, [
    growthBalance,
    growthMonthlyContrib,
    growthEmployerMatchPct,
    growthReturnRate,
    growthYears,
  ]);

  // Tool 3 Calc: Social Security Calculator
  const ssCalc = useMemo(() => {
    // Relative benefit factor curve compared to FRA 67 (1.00)
    const factorMap: Record<number, number> = {
      62: 0.7,
      63: 0.75,
      64: 0.8,
      65: 0.867,
      66: 0.933,
      67: 1.0,
      68: 1.08,
      69: 1.16,
      70: 1.24,
    };

    const factor = factorMap[ssClaimAge] || 1.0;
    const monthlyAtChosenAge = Math.round(ssPia * factor);
    const annualAtChosenAge = monthlyAtChosenAge * 12;
    const monthlyAt62 = Math.round(ssPia * 0.7);
    const monthlyAt67 = Math.round(ssPia * 1.0);
    const monthlyAt70 = Math.round(ssPia * 1.24);

    const cumulativeAge85 = Math.max(0, (85 - ssClaimAge) * 12 * monthlyAtChosenAge);
    const cumulative62At85 = (85 - 62) * 12 * monthlyAt62;
    const cumulative70At85 = (85 - 70) * 12 * monthlyAt70;

    return {
      factorPct: Math.round(factor * 100),
      monthlyAtChosenAge,
      annualAtChosenAge,
      monthlyAt62,
      monthlyAt67,
      monthlyAt70,
      cumulativeAge85,
      cumulative62At85,
      cumulative70At85,
    };
  }, [ssClaimAge, ssPia]);

  // Tool 4 Calc: Monte Carlo Simulator
  const mcCalc = useMemo(() => {
    const expectedReturn = (mcEquityPct * 0.085 + (100 - mcEquityPct) * 0.042) / 100;
    const volatility = (mcEquityPct * 0.165 + (100 - mcEquityPct) * 0.055) / 100;
    const withdrawalDecimal = mcWithdrawalRate / 100;

    // Approximated analytical Monte Carlo probability for retirement drawdown
    const netGrowth = expectedReturn - withdrawalDecimal;
    const zScore = (netGrowth - 0.012) / (volatility / Math.sqrt(Math.max(1, mcHorizon)));
    const successRate = Math.min(
      99,
      Math.max(12, Math.round(50 + 50 * Math.tanh(zScore * 1.4)))
    );

    const medianEnding = Math.round(
      mcPortfolio * Math.max(0, Math.pow(1 + netGrowth, mcHorizon))
    );
    const stressEnding = Math.round(
      mcPortfolio *
        Math.max(0, Math.pow(1 + (netGrowth - 1.28 * volatility), mcHorizon))
    );
    const bullEnding = Math.round(
      mcPortfolio * Math.pow(1 + (netGrowth + 1.28 * volatility), mcHorizon)
    );

    const annualWithdrawal = Math.round(mcPortfolio * withdrawalDecimal);
    const monthlyWithdrawal = Math.round(annualWithdrawal / 12);

    return {
      successRate,
      medianEnding,
      stressEnding,
      bullEnding,
      annualWithdrawal,
      monthlyWithdrawal,
      equityMixStr: `${mcEquityPct}% Stocks / ${100 - mcEquityPct}% Bonds`,
    };
  }, [mcPortfolio, mcWithdrawalRate, mcEquityPct, mcHorizon]);

  // Copy Summary Handler
  const handleCopySummary = () => {
    const text = `SolveItCalculator.com • Retirement Countdown Snapshot\n=========================================\nHorizon: ${calc.ymdStr} remaining until ${retireDateStr}\nTarget Date: ${retireDateStr} (${calc.targetDayName})\nTotal Calendar Days: ${calc.totalCalendarDays.toLocaleString()} days (${calc.totalWeeks} weeks)\nScheduled Workdays: ${calc.scheduledWorkdays.toLocaleString()}\nNet Actual Workdays: ${calc.netWorkdays.toLocaleString()} shifts\nRequired Working Hours: ${calc.netHours.toLocaleString()} hours\nEstimated Last Working Day: ${calc.finalDayFormatted}\nEarly Freedom Gained: ${calc.freedomDays} calendar days\n=========================================\nCalculated 100% privately via https://solveitcalculator.com/retirement-countdown-in-workdays/`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          setCopyFeedback(true);
          setTimeout(() => setCopyFeedback(false), 2500);
        })
        .catch(() => fallbackCopy(text));
    } else {
      fallbackCopy(text);
    }
  };

  const fallbackCopy = (text: string) => {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2500);
    } catch {
      // ignore
    }
    document.body.removeChild(ta);
  };

  // Download CSV Handler
  const handleDownloadCsv = () => {
    const csvContent =
      `Metric,Value\n` +
      `Start Date,${startDateStr}\n` +
      `Target Retirement Date,${retireDateStr}\n` +
      `Target Day of Week,${calc.targetDayName}\n` +
      `Calendar Horizon,${calc.ymdStr}\n` +
      `Total Calendar Days,${calc.totalCalendarDays}\n` +
      `Total Calendar Weeks,${calc.totalWeeks}\n` +
      `Total Clock Hours,${calc.totalClockHours}\n` +
      `Scheduled Workdays,${calc.scheduledWorkdays}\n` +
      `Weekend Days Deducted,${calc.weekendDaysCount}\n` +
      `Estimated Company Holidays,${calc.totalHolidaysInPeriod}\n` +
      `Accrued PTO Days Deducted,${ptoDays}\n` +
      `Net Actual Workdays (Shifts),${calc.netWorkdays}\n` +
      `Net Required Work Hours,${calc.netHours}\n` +
      `Estimated Last Working Day,${calc.finalDayFormatted}\n` +
      `Early Freedom Gained (Days),${calc.freedomDays}\n` +
      `Calculation Tool,SolveIt In-Browser Calculator\n`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `retirement_countdown_${retireDateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print Handler
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  // Active schedule label display
  const currentScheduleLabel = useMemo(() => {
    const found = SCHEDULE_PRESETS.find((p) => p.id === activePreset);
    return found ? found.label : 'Custom Weekly Schedule';
  }, [activePreset]);

  return (
    <div className="flex flex-col w-full pb-space-3xl max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
      {/* Breadcrumbs & Badges with Schema Microdata */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm pt-space-md mb-space-md">
        <nav aria-label="Breadcrumb">
          <ol
            itemScope
            itemType="https://schema.org/BreadcrumbList"
            className="flex flex-wrap items-center gap-1.5 text-body-sm font-body-sm text-on-surface-variant"
          >
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem" className="flex items-center gap-1.5">
              <Link
                href="/"
                itemProp="item"
                className="hover:text-primary transition-colors flex items-center gap-1 text-on-surface-variant hover:underline"
              >
                <span className="material-symbols-outlined text-[16px]">home</span>
                <span itemProp="name">Home</span>
              </Link>
              <meta itemProp="position" content="1" />
              <span className="text-outline-variant/60" aria-hidden="true">/</span>
            </li>
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem" className="flex items-center gap-1.5">
              <Link
                href="/time-date"
                itemProp="item"
                className="hover:text-primary transition-colors text-on-surface-variant hover:underline"
              >
                <span itemProp="name">Time &amp; Date</span>
              </Link>
              <meta itemProp="position" content="2" />
              <span className="text-outline-variant/60" aria-hidden="true">/</span>
            </li>
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem" className="flex items-center gap-1.5">
              <span itemProp="name" className="text-on-surface font-semibold">
                Retirement Countdown in Workdays
              </span>
              <meta itemProp="position" content="3" />
            </li>
          </ol>
        </nav>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-space-xs py-1 rounded-full bg-surface-container-high text-primary font-label-caps text-label-caps uppercase tracking-wider border border-outline-variant/10">
            <span className="material-symbols-outlined text-[14px]">verified_user</span> 100% Free &amp; Private
          </span>
          <span className="inline-flex items-center gap-1.5 px-space-xs py-1 rounded-full bg-surface-container-high text-secondary font-label-caps text-label-caps uppercase tracking-wider border border-outline-variant/10">
            <span className="material-symbols-outlined text-[14px]">calendar_today</span> Exact Workday Counter
          </span>
          <span className="inline-flex items-center gap-1.5 px-space-xs py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-caps text-label-caps uppercase tracking-wider border border-outline-variant/10">
            <span className="material-symbols-outlined text-[14px]">lock</span> In-Browser Sandbox
          </span>
        </div>
      </div>

      {/* Header Intro Banner */}
      <div className="mb-space-xl">
        <div className="inline-flex items-center gap-2 px-space-sm py-1 rounded-lg bg-primary-fixed text-on-primary-fixed font-label-caps text-label-caps uppercase mb-space-xs">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          <span>Retirement Planning Suite</span>
        </div>
        <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mb-space-xs font-bold">
          Retirement Countdown Calculator
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl leading-relaxed">
          How much work do you really have left? Count the exact calendar time, working shifts, and real hours remaining
          until your retirement date — with vacation balances, company holidays, and custom schedules fully calculated.
        </p>
      </div>

      {/* Retirement Planning Suite Navigation Pills Bar */}
      <div className="w-full mb-space-lg">
        <div className="p-1.5 rounded-xl bg-surface-container-low shadow-xs flex items-center gap-1 overflow-x-auto no-scrollbar border border-outline-variant/15">
          <button
            type="button"
            onClick={() => setActiveSuiteTool('countdown')}
            className={`flex items-center gap-2 px-space-md py-2 rounded-lg font-body-sm font-semibold shadow-xs flex-shrink-0 transition-all ${
              activeSuiteTool === 'countdown'
                ? 'bg-primary text-on-primary'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">hourglass_top</span>
            <span>Retirement Countdown</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSuiteTool('pension')}
            className={`flex items-center gap-2 px-space-md py-2 rounded-lg font-body-sm font-semibold shadow-xs flex-shrink-0 transition-all ${
              activeSuiteTool === 'pension'
                ? 'bg-primary text-on-primary'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">account_balance</span>
            <span>Pension Estimator &amp; Savings</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSuiteTool('growth')}
            className={`flex items-center gap-2 px-space-md py-2 rounded-lg font-body-sm font-semibold shadow-xs flex-shrink-0 transition-all ${
              activeSuiteTool === 'growth'
                ? 'bg-primary text-on-primary'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">savings</span>
            <span>401(k) &amp; Growth Planner</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSuiteTool('social-security')}
            className={`flex items-center gap-2 px-space-md py-2 rounded-lg font-body-sm font-semibold shadow-xs flex-shrink-0 transition-all ${
              activeSuiteTool === 'social-security'
                ? 'bg-primary text-on-primary'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
            <span>Social Security Calculator</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSuiteTool('monte-carlo')}
            className={`flex items-center gap-2 px-space-md py-2 rounded-lg font-body-sm font-semibold shadow-xs flex-shrink-0 transition-all ${
              activeSuiteTool === 'monte-carlo'
                ? 'bg-primary text-on-primary'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">ssid_chart</span>
            <span>Monte Carlo Simulator</span>
          </button>
        </div>
      </div>

      {/* 1. PENSION ESTIMATOR & SAVINGS PLANNER */}
      {activeSuiteTool === 'pension' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start mb-space-2xl">
          {/* Left Column: Sliders */}
          <div className="lg:col-span-7 p-space-lg rounded-xl bg-surface-container-lowest shadow-md space-y-space-lg border border-outline-variant/20">
            <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-high">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">account_balance</span>
                <span className="font-headline-md text-headline-md text-on-surface font-semibold">
                  Pension Settings &amp; Sliders
                </span>
              </div>
              <span className="text-label-caps font-label-caps text-outline uppercase">Interactive Sliders</span>
            </div>

            {/* Slider 1: Final Average Salary */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-body-sm font-semibold text-on-surface block">Final Average Salary (FAS)</label>
                  <span className="text-[12px] text-on-surface-variant">Highest consecutive salary average</span>
                </div>
                <span className="font-data-mono font-bold text-blue-700 dark:text-blue-300 px-3 py-1 rounded-md bg-blue-100 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800/60 text-[15px]">
                  ${pensionSalary.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="30000"
                max="300000"
                step="2500"
                value={pensionSalary}
                onChange={(e) => setPensionSalary(Number(e.target.value))}
                className="w-full h-2.5 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[11px] font-data-mono text-outline">
                <span>$30,000</span>
                <span>$150,000</span>
                <span>$300,000</span>
              </div>
            </div>

            {/* Slider 2: Years of Credited Service */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-body-sm font-semibold text-on-surface block">Years of Credited Service</label>
                  <span className="text-[12px] text-on-surface-variant">Total vested pension service years</span>
                </div>
                <span className="font-data-mono font-bold text-sky-700 dark:text-sky-300 px-3 py-1 rounded-md bg-sky-100 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800/60 text-[15px]">
                  {pensionYears} Years
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="45"
                step="1"
                value={pensionYears}
                onChange={(e) => setPensionYears(Number(e.target.value))}
                className="w-full h-2.5 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-secondary"
              />
              <div className="flex justify-between text-[11px] font-data-mono text-outline">
                <span>1 Year</span>
                <span>25 Years</span>
                <span>45 Years</span>
              </div>
            </div>

            {/* Slider 3: Multiplier % */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-body-sm font-semibold text-on-surface block">Formula Multiplier (% per year)</label>
                  <span className="text-[12px] text-on-surface-variant">Standard public/private plan formula factor</span>
                </div>
                <span className="font-data-mono font-bold text-blue-700 dark:text-blue-300 px-3 py-1 rounded-md bg-blue-100 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800/60 text-[15px]">
                  {pensionMultiplier.toFixed(1)}% / yr
                </span>
              </div>
              <input
                type="range"
                min="1.0"
                max="3.0"
                step="0.1"
                value={pensionMultiplier}
                onChange={(e) => setPensionMultiplier(Number(e.target.value))}
                className="w-full h-2.5 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[11px] font-data-mono text-outline">
                <span>1.0% (FERS Basic)</span>
                <span>1.8% (Typical State)</span>
                <span>3.0% (Safety/Police)</span>
              </div>
            </div>

            {/* Slider 4: Lump Sum Discount Rate % */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-body-sm font-semibold text-on-surface block">Lump-Sum Discount / Annuity Rate</label>
                  <span className="text-[12px] text-on-surface-variant">Present value rate to evaluate cash-out vs monthly</span>
                </div>
                <span className="font-data-mono font-bold text-slate-700 dark:text-slate-200 px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[15px]">
                  {pensionDiscountRate.toFixed(2)}%
                </span>
              </div>
              <input
                type="range"
                min="2.0"
                max="8.0"
                step="0.25"
                value={pensionDiscountRate}
                onChange={(e) => setPensionDiscountRate(Number(e.target.value))}
                className="w-full h-2.5 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[11px] font-data-mono text-outline">
                <span>2.0% (Low rate = higher lump sum)</span>
                <span>5.0% (Normal)</span>
                <span>8.0% (High rate)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Pension Results Card */}
          <div className="lg:col-span-5 space-y-space-lg">
            <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-lg space-y-space-md border border-primary/20">
              <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-high">
                <span className="font-headline-md text-headline-md text-on-surface font-bold">
                  Estimated Pension Payout
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 dark:border dark:border-blue-800/60 font-label-caps text-[11px] font-bold uppercase">
                  Guaranteed Income
                </span>
              </div>

              {/* Monthly Benefit Hero */}
              <div className="p-space-md rounded-xl bg-blue-600 text-white space-y-1 text-center shadow-sm">
                <span className="text-label-caps font-label-caps uppercase tracking-wider text-blue-100">
                  Estimated Monthly Lifetime Pension
                </span>
                <div className="font-headline-lg text-[34px] font-bold leading-none text-white">
                  ${pensionCalc.monthlyPension.toLocaleString()}
                  <span className="text-[16px] font-normal text-blue-100"> / month</span>
                </div>
                <span className="text-body-sm text-blue-100 block pt-1">
                  Equals <strong className="text-white">${pensionCalc.annualPension.toLocaleString()}</strong> per year ({pensionCalc.replacementRate}% salary replacement)
                </span>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-space-sm rounded-lg bg-surface-container-low border border-outline-variant/10">
                  <span className="text-[11px] uppercase font-label-caps text-outline block">Salary Replacement</span>
                  <div className="font-data-mono font-bold text-on-surface text-[18px]">
                    {pensionCalc.replacementRate}%
                  </div>
                </div>
                <div className="p-space-sm rounded-lg bg-surface-container-low border border-outline-variant/10">
                  <span className="text-[11px] uppercase font-label-caps text-outline block">25-Yr Cumulative Value</span>
                  <div className="font-data-mono font-bold text-secondary text-[18px]">
                    ${pensionCalc.lifetime25Yr.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Lump Sum Comparison */}
              <div className="p-space-sm rounded-lg bg-surface-container border border-outline-variant/15 space-y-1">
                <div className="flex items-center justify-between text-body-sm">
                  <span className="font-semibold text-on-surface">Equivalent Lump-Sum Cash Value:</span>
                  <span className="font-data-mono font-bold text-primary text-[16px]">
                    ${pensionCalc.lumpSumEstimate.toLocaleString()}
                  </span>
                </div>
                <p className="text-[12px] text-on-surface-variant">
                  Present value annuity calculation at {pensionDiscountRate}% discount rate over 25 years.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. 401(k) & GROWTH PLANNER WORKBENCH */}
      {activeSuiteTool === 'growth' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start mb-space-2xl">
          {/* Left Column: Sliders */}
          <div className="lg:col-span-7 p-space-lg rounded-xl bg-surface-container-lowest shadow-md space-y-space-lg border border-outline-variant/20">
            <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-high">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">savings</span>
                <span className="font-headline-md text-headline-md text-on-surface font-semibold">
                  401(k) Contribution &amp; Growth Sliders
                </span>
              </div>
              <span className="text-label-caps font-label-caps text-outline uppercase">Compound Interest</span>
            </div>

            {/* Slider 1: Current Balance */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-body-sm font-semibold text-on-surface block">Current 401(k) / IRA Balance</label>
                  <span className="text-[12px] text-on-surface-variant">Existing starting portfolio balance</span>
                </div>
                <span className="font-data-mono font-bold text-blue-700 dark:text-blue-300 px-3 py-1 rounded-md bg-blue-100 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800/60 text-[15px]">
                  ${growthBalance.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1500000"
                step="5000"
                value={growthBalance}
                onChange={(e) => setGrowthBalance(Number(e.target.value))}
                className="w-full h-2.5 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[11px] font-data-mono text-outline">
                <span>$0</span>
                <span>$750,000</span>
                <span>$1,500,000</span>
              </div>
            </div>

            {/* Slider 2: Monthly Contribution */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-body-sm font-semibold text-on-surface block">Your Monthly Contribution</label>
                  <span className="text-[12px] text-on-surface-variant">Personal payroll deferral amount</span>
                </div>
                <span className="font-data-mono font-bold text-sky-700 dark:text-sky-300 px-3 py-1 rounded-md bg-sky-100 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800/60 text-[15px]">
                  ${growthMonthlyContrib.toLocaleString()} / mo
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="3000"
                step="25"
                value={growthMonthlyContrib}
                onChange={(e) => setGrowthMonthlyContrib(Number(e.target.value))}
                className="w-full h-2.5 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-secondary"
              />
              <div className="flex justify-between text-[11px] font-data-mono text-outline">
                <span>$50/mo</span>
                <span>$1,500/mo</span>
                <span>$3,000/mo</span>
              </div>
            </div>

            {/* Slider 3: Employer Match % */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-body-sm font-semibold text-on-surface block">Employer Match Ratio (%)</label>
                  <span className="text-[12px] text-on-surface-variant">Company matching percentage</span>
                </div>
                <span className="font-data-mono font-bold text-blue-700 dark:text-blue-300 px-3 py-1 rounded-md bg-blue-100 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800/60 text-[15px]">
                  {growthEmployerMatchPct}% match
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={growthEmployerMatchPct}
                onChange={(e) => setGrowthEmployerMatchPct(Number(e.target.value))}
                className="w-full h-2.5 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[11px] font-data-mono text-outline">
                <span>0% (No match)</span>
                <span>50% (Standard 50c per $1)</span>
                <span>100% (Dollar-for-dollar)</span>
              </div>
            </div>

            {/* Slider 4: Expected Annual Return */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-body-sm font-semibold text-on-surface block">Expected Annual Rate of Return</label>
                  <span className="text-[12px] text-on-surface-variant">Long-term average market return</span>
                </div>
                <span className="font-data-mono font-bold text-sky-700 dark:text-sky-300 px-3 py-1 rounded-md bg-sky-100 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800/60 text-[15px]">
                  {growthReturnRate.toFixed(1)}% p.a.
                </span>
              </div>
              <input
                type="range"
                min="2.0"
                max="14.0"
                step="0.5"
                value={growthReturnRate}
                onChange={(e) => setGrowthReturnRate(Number(e.target.value))}
                className="w-full h-2.5 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-secondary"
              />
              <div className="flex justify-between text-[11px] font-data-mono text-outline">
                <span>2% (Conservative)</span>
                <span>7.5% (Balanced)</span>
                <span>14% (Aggressive)</span>
              </div>
            </div>

            {/* Slider 5: Years to Compound */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-body-sm font-semibold text-on-surface block">Years Until Retirement</label>
                  <span className="text-[12px] text-on-surface-variant">Time horizon to build compound interest</span>
                </div>
                <span className="font-data-mono font-bold text-blue-700 dark:text-blue-300 px-3 py-1 rounded-md bg-blue-100 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800/60 text-[15px]">
                  {growthYears} Years
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="40"
                step="1"
                value={growthYears}
                onChange={(e) => setGrowthYears(Number(e.target.value))}
                className="w-full h-2.5 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[11px] font-data-mono text-outline">
                <span>1 Year</span>
                <span>20 Years</span>
                <span>40 Years</span>
              </div>
            </div>
          </div>

          {/* Right Column: Growth Results Card */}
          <div className="lg:col-span-5 space-y-space-lg">
            <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-lg space-y-space-md border border-primary/20">
              <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-high">
                <span className="font-headline-md text-headline-md text-on-surface font-bold">
                  Projected Nest Egg
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300 dark:border dark:border-sky-800/60 font-label-caps text-[11px] font-bold uppercase">
                  Growth Model
                </span>
              </div>

              {/* Total Balance Hero */}
              <div className="p-space-md rounded-xl bg-sky-700 text-white space-y-1 text-center shadow-sm">
                <span className="text-label-caps font-label-caps uppercase tracking-wider text-sky-100">
                  Total Projected Nest Egg at Retirement
                </span>
                <div className="font-headline-lg text-[34px] font-bold leading-none text-white">
                  ${growthCalc.totalNestEgg.toLocaleString()}
                </div>
                <span className="text-body-sm text-sky-100 block pt-1">
                  Yields approx. <strong className="text-white">${growthCalc.safeMonthlyDrawdown.toLocaleString()}/mo</strong> via 4% safe withdrawal rule
                </span>
              </div>

              {/* Visual Breakdown Stacked Bar */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-body-sm font-semibold text-on-surface">
                  <span>Balance Breakdown</span>
                  <span className="text-outline text-[12px] font-data-mono">
                    Compound Interest: {((growthCalc.totalGrowth / Math.max(1, growthCalc.totalNestEgg)) * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full h-4 rounded-full bg-surface-container-high flex overflow-hidden">
                  <div
                    style={{
                      width: `${(growthBalance / Math.max(1, growthCalc.totalNestEgg)) * 100}%`,
                    }}
                    className="h-full bg-outline"
                    title="Starting Principal"
                  />
                  <div
                    style={{
                      width: `${(growthCalc.totalPersonalContrib / Math.max(1, growthCalc.totalNestEgg)) * 100}%`,
                    }}
                    className="h-full bg-primary"
                    title="Your Contributions"
                  />
                  <div
                    style={{
                      width: `${(growthCalc.totalEmployerMatch / Math.max(1, growthCalc.totalNestEgg)) * 100}%`,
                    }}
                    className="h-full bg-secondary"
                    title="Employer Match"
                  />
                  <div
                    style={{
                      width: `${(growthCalc.totalGrowth / Math.max(1, growthCalc.totalNestEgg)) * 100}%`,
                    }}
                    className="h-full bg-emerald-600"
                    title="Compound Growth"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 text-[12px] text-on-surface-variant pt-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary flex-shrink-0"></span>
                    <span>Your Deposits: <strong>${growthCalc.totalPersonalContrib.toLocaleString()}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary flex-shrink-0"></span>
                    <span>Match: <strong>${growthCalc.totalEmployerMatch.toLocaleString()}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-outline flex-shrink-0"></span>
                    <span>Starting: <strong>${growthBalance.toLocaleString()}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 flex-shrink-0"></span>
                    <span>Growth: <strong>${growthCalc.totalGrowth.toLocaleString()}</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. SOCIAL SECURITY CALCULATOR WORKBENCH */}
      {activeSuiteTool === 'social-security' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start mb-space-2xl">
          {/* Left Column: Sliders */}
          <div className="lg:col-span-7 p-space-lg rounded-xl bg-surface-container-lowest shadow-md space-y-space-lg border border-outline-variant/20">
            <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-high">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">verified_user</span>
                <span className="font-headline-md text-headline-md text-on-surface font-semibold">
                  Social Security Claiming Age &amp; Earnings
                </span>
              </div>
              <span className="text-label-caps font-label-caps text-outline uppercase">SSA Benchmarks</span>
            </div>

            {/* Slider 1: Claiming Age */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-body-sm font-semibold text-on-surface block">Target Claiming Age</label>
                  <span className="text-[12px] text-on-surface-variant">From earliest age 62 to maximum delayed age 70</span>
                </div>
                <span className="font-data-mono font-bold text-blue-700 dark:text-blue-300 px-3 py-1 rounded-md bg-blue-100 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800/60 text-[15px]">
                  Age {ssClaimAge} ({ssCalc.factorPct}% of full benefit)
                </span>
              </div>
              <input
                type="range"
                min="62"
                max="70"
                step="1"
                value={ssClaimAge}
                onChange={(e) => setSsClaimAge(Number(e.target.value))}
                className="w-full h-2.5 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[11px] font-data-mono text-outline">
                <span>Age 62 (-30%)</span>
                <span>Age 67 (Full FRA 100%)</span>
                <span>Age 70 (+24% Max)</span>
              </div>
            </div>

            {/* Slider 2: Primary Insurance Amount (PIA) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-body-sm font-semibold text-on-surface block">Full Retirement Age Benefit (PIA at 67)</label>
                  <span className="text-[12px] text-on-surface-variant">Estimated monthly benefit on your SSA statement</span>
                </div>
                <span className="font-data-mono font-bold text-sky-700 dark:text-sky-300 px-3 py-1 rounded-md bg-sky-100 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800/60 text-[15px]">
                  ${ssPia.toLocaleString()} / mo
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="4500"
                step="50"
                value={ssPia}
                onChange={(e) => setSsPia(Number(e.target.value))}
                className="w-full h-2.5 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-secondary"
              />
              <div className="flex justify-between text-[11px] font-data-mono text-outline">
                <span>$1,000/mo</span>
                <span>$2,500/mo</span>
                <span>$4,500/mo</span>
              </div>
            </div>

            {/* Slider 3: Annual COLA Inflation */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-body-sm font-semibold text-on-surface block">Expected Annual COLA (%)</label>
                  <span className="text-[12px] text-on-surface-variant">Cost-of-Living Adjustment inflation factor</span>
                </div>
                <span className="font-data-mono font-bold text-slate-700 dark:text-slate-200 px-3 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[15px]">
                  {ssCola.toFixed(1)}% / yr
                </span>
              </div>
              <input
                type="range"
                min="0.0"
                max="5.0"
                step="0.25"
                value={ssCola}
                onChange={(e) => setSsCola(Number(e.target.value))}
                className="w-full h-2.5 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[11px] font-data-mono text-outline">
                <span>0.0% (Zero inflation)</span>
                <span>2.5% (Historical average)</span>
                <span>5.0% (High inflation)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Social Security Results Card */}
          <div className="lg:col-span-5 space-y-space-lg">
            <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-lg space-y-space-md border border-primary/20">
              <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-high">
                <span className="font-headline-md text-headline-md text-on-surface font-bold">
                  Claiming Comparison
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 dark:border dark:border-blue-800/60 font-label-caps text-[11px] font-bold uppercase">
                  Age {ssClaimAge} Selected
                </span>
              </div>

              {/* Monthly Benefit Hero */}
              <div className="p-space-md rounded-xl bg-blue-600 text-white space-y-1 text-center shadow-sm">
                <span className="text-label-caps font-label-caps uppercase tracking-wider text-blue-100">
                  Estimated Monthly Benefit at Age {ssClaimAge}
                </span>
                <div className="font-headline-lg text-[34px] font-bold leading-none text-white">
                  ${ssCalc.monthlyAtChosenAge.toLocaleString()}
                  <span className="text-[16px] font-normal text-blue-100"> / mo</span>
                </div>
                <span className="text-body-sm text-blue-100 block pt-1">
                  <strong className="text-white">${ssCalc.annualAtChosenAge.toLocaleString()}</strong> per year guaranteed for life
                </span>
              </div>

              {/* 3-Age Comparison Grid */}
              <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                <div className={`p-2.5 rounded-lg border ${ssClaimAge === 62 ? 'bg-blue-100 dark:bg-blue-950/80 border-blue-500 text-on-surface' : 'bg-surface-container-low border-outline-variant/10'}`}>
                  <span className="text-[11px] uppercase font-bold text-outline block">Age 62 Early</span>
                  <div className="font-data-mono font-bold text-[15px] text-on-surface">${ssCalc.monthlyAt62.toLocaleString()}</div>
                  <span className="text-[10px] text-error font-bold">-30% Penalty</span>
                </div>
                <div className={`p-2.5 rounded-lg border ${ssClaimAge === 67 ? 'bg-blue-100 dark:bg-blue-950/80 border-blue-500 text-on-surface' : 'bg-surface-container-low border-outline-variant/10'}`}>
                  <span className="text-[11px] uppercase font-bold text-outline block">Age 67 FRA</span>
                  <div className="font-data-mono font-bold text-[15px] text-on-surface">${ssCalc.monthlyAt67.toLocaleString()}</div>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">100% Base</span>
                </div>
                <div className={`p-2.5 rounded-lg border ${ssClaimAge === 70 ? 'bg-blue-100 dark:bg-blue-950/80 border-blue-500 text-on-surface' : 'bg-surface-container-low border-outline-variant/10'}`}>
                  <span className="text-[11px] uppercase font-bold text-outline block">Age 70 Max</span>
                  <div className="font-data-mono font-bold text-[15px] text-on-surface">${ssCalc.monthlyAt70.toLocaleString()}</div>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">+24% Bonus</span>
                </div>
              </div>

              {/* Cumulative Value by Age 85 */}
              <div className="p-space-sm rounded-lg bg-surface-container border border-outline-variant/15 space-y-1">
                <div className="flex items-center justify-between text-body-sm">
                  <span className="font-semibold text-on-surface">Cumulative Payout by Age 85:</span>
                  <span className="font-data-mono font-bold text-secondary text-[16px]">
                    ${ssCalc.cumulativeAge85.toLocaleString()}
                  </span>
                </div>
                <p className="text-[12px] text-on-surface-variant">
                  Claiming at age 70 breaks even with age 62 around age 80.5, maximizing lifetime income if you live past 81.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. MONTE CARLO SIMULATOR */}
      {activeSuiteTool === 'monte-carlo' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start mb-space-2xl">
          {/* Left Column: Sliders */}
          <div className="lg:col-span-7 p-space-lg rounded-xl bg-surface-container-lowest shadow-md space-y-space-lg border border-outline-variant/20">
            <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-high">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">ssid_chart</span>
                <span className="font-headline-md text-headline-md text-on-surface font-semibold">
                  Portfolio Stress Test &amp; Sliders
                </span>
              </div>
              <span className="text-label-caps font-label-caps text-outline uppercase">Market Stress Test</span>
            </div>

            {/* Slider 1: Portfolio Balance */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-body-sm font-semibold text-on-surface block">Starting Retirement Portfolio</label>
                  <span className="text-[12px] text-on-surface-variant">Liquid investable assets at retirement</span>
                </div>
                <span className="font-data-mono font-bold text-blue-700 dark:text-blue-300 px-3 py-1 rounded-md bg-blue-100 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800/60 text-[15px]">
                  ${mcPortfolio.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="100000"
                max="5000000"
                step="25000"
                value={mcPortfolio}
                onChange={(e) => setMcPortfolio(Number(e.target.value))}
                className="w-full h-2.5 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[11px] font-data-mono text-outline">
                <span>$100k</span>
                <span>$2.5M</span>
                <span>$5M</span>
              </div>
            </div>

            {/* Slider 2: Annual Withdrawal Rate */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-body-sm font-semibold text-on-surface block">Initial Annual Withdrawal Rate (%)</label>
                  <span className="text-[12px] text-on-surface-variant">Bengen Trinity Study safe withdrawal rate</span>
                </div>
                <span className="font-data-mono font-bold text-sky-700 dark:text-sky-300 px-3 py-1 rounded-md bg-sky-100 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800/60 text-[15px]">
                  {mcWithdrawalRate.toFixed(1)}% (${mcCalc.annualWithdrawal.toLocaleString()}/yr)
                </span>
              </div>
              <input
                type="range"
                min="2.0"
                max="8.0"
                step="0.1"
                value={mcWithdrawalRate}
                onChange={(e) => setMcWithdrawalRate(Number(e.target.value))}
                className="w-full h-2.5 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-secondary"
              />
              <div className="flex justify-between text-[11px] font-data-mono text-outline">
                <span>2.0% (Ultra Safe)</span>
                <span>4.0% (Rule of Thumb)</span>
                <span>8.0% (High Risk)</span>
              </div>
            </div>

            {/* Slider 3: Stock / Equity Mix */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-body-sm font-semibold text-on-surface block">Asset Allocation ({mcCalc.equityMixStr})</label>
                  <span className="text-[12px] text-on-surface-variant">Percentage allocated to diversified equities vs fixed income</span>
                </div>
                <span className="font-data-mono font-bold text-blue-700 dark:text-blue-300 px-3 py-1 rounded-md bg-blue-100 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800/60 text-[15px]">
                  {mcEquityPct}% Stocks
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={mcEquityPct}
                onChange={(e) => setMcEquityPct(Number(e.target.value))}
                className="w-full h-2.5 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[11px] font-data-mono text-outline">
                <span>0% Stocks / 100% Bonds</span>
                <span>60/40 Classic</span>
                <span>100% Equities</span>
              </div>
            </div>

            {/* Slider 4: Horizon Years */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-body-sm font-semibold text-on-surface block">Retirement Horizon (Years in Retirement)</label>
                  <span className="text-[12px] text-on-surface-variant">Number of years your nest egg must sustain you</span>
                </div>
                <span className="font-data-mono font-bold text-sky-700 dark:text-sky-300 px-3 py-1 rounded-md bg-sky-100 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800/60 text-[15px]">
                  {mcHorizon} Years
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="45"
                step="1"
                value={mcHorizon}
                onChange={(e) => setMcHorizon(Number(e.target.value))}
                className="w-full h-2.5 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-secondary"
              />
              <div className="flex justify-between text-[11px] font-data-mono text-outline">
                <span>10 Years</span>
                <span>30 Years (Standard)</span>
                <span>45 Years (Early FIRE)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Monte Carlo Results Card */}
          <div className="lg:col-span-5 space-y-space-lg">
            <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-lg space-y-space-md border border-primary/20">
              <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-high">
                <span className="font-headline-md text-headline-md text-on-surface font-bold">
                  Simulation Outcome
                </span>
                <span className={`px-2.5 py-0.5 rounded-full font-label-caps text-[11px] font-bold uppercase ${
                  mcCalc.successRate >= 85
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border dark:border-emerald-800/60'
                    : mcCalc.successRate >= 70
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 dark:border dark:border-amber-800/60'
                    : 'bg-red-100 text-red-800 dark:bg-red-950/80 dark:text-red-300 dark:border dark:border-red-800/60'
                }`}>
                  {mcCalc.successRate >= 85 ? 'High Confidence' : mcCalc.successRate >= 70 ? 'Moderate Risk' : 'High Failure Risk'}
                </span>
              </div>

              {/* Success Probability Hero */}
              <div className={`p-space-md rounded-xl space-y-1 text-center shadow-sm ${
                mcCalc.successRate >= 85 ? 'bg-emerald-600 text-white' : mcCalc.successRate >= 70 ? 'bg-amber-500 text-white' : 'bg-red-600 text-white'
              }`}>
                <span className="text-label-caps font-label-caps uppercase tracking-wider text-white/90">
                  Chance of Sustained Spending
                </span>
                <div className="font-headline-lg text-[38px] font-bold leading-none text-white">
                  {mcCalc.successRate}%
                </div>
                <span className="text-body-sm text-white/95 block pt-1">
                  Supports <strong>${mcCalc.monthlyWithdrawal.toLocaleString()}/mo</strong> (${mcCalc.annualWithdrawal.toLocaleString()}/yr) in retirement spending
                </span>
              </div>

              {/* Scenario Outcomes */}
              <div className="space-y-2 pt-1">
                <span className="text-body-sm font-semibold text-on-surface block">Projected Balance After {mcHorizon} Years</span>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-lg bg-surface-container-low border border-outline-variant/10">
                    <span className="text-[10px] uppercase font-bold text-error block">Stress (10th)</span>
                    <div className="font-data-mono font-bold text-[13px] text-on-surface">${mcCalc.stressEnding.toLocaleString()}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-surface-container-low border border-outline-variant/10">
                    <span className="text-[10px] uppercase font-bold text-primary block">Median (50th)</span>
                    <div className="font-data-mono font-bold text-[13px] text-on-surface">${mcCalc.medianEnding.toLocaleString()}</div>
                  </div>
                  <div className="p-2 rounded-lg bg-surface-container-low border border-outline-variant/10">
                    <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block">Bull (90th)</span>
                    <div className="font-data-mono font-bold text-[13px] text-on-surface">${mcCalc.bullEnding.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CALCULATOR CONTAINER (12-Col Grid) - Rendered when activeSuiteTool is 'countdown' */}
      {activeSuiteTool === 'countdown' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start mb-space-2xl">
        {/* LEFT COLUMN: Settings & Controls (7 Cols on desktop) */}
        <div className="lg:col-span-7 flex flex-col gap-space-lg">
          {/* Input Control Card */}
          <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-md space-y-space-md border border-outline-variant/20">
            <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-high">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">event_repeat</span>
                <span className="font-headline-md text-headline-md text-on-surface font-semibold">
                  Countdown Settings
                </span>
              </div>
              <span className="text-label-caps font-label-caps text-outline uppercase">Instant Calculator</span>
            </div>

            {/* Start & Target Date Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label
                    className="font-label-caps text-label-caps text-on-surface-variant uppercase font-semibold"
                    htmlFor="start-date-input"
                  >
                    Start Date
                  </label>
                  <button
                    onClick={handleUseToday}
                    className="text-primary hover:underline font-body-sm text-body-sm flex items-center gap-1 font-medium"
                    id="btn-use-today"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[14px]">today</span> Today
                  </button>
                </div>
                <div className="relative">
                  <input
                    className="w-full px-space-sm py-2 rounded-lg bg-surface-container text-on-surface font-data-mono text-data-mono focus:outline-none focus:ring-2 focus:ring-primary shadow-xs border border-outline-variant/20"
                    id="start-date-input"
                    type="date"
                    value={startDateStr}
                    onChange={(e) => setStartDateStr(e.target.value)}
                  />
                </div>
                <p className="text-body-sm font-body-sm text-outline">Calculation origin date</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label
                    className="font-label-caps text-label-caps text-on-surface-variant uppercase font-semibold"
                    htmlFor="retire-date-input"
                  >
                    Target Retirement Date
                  </label>
                  <span className="font-body-sm text-body-sm text-secondary font-medium" id="target-day-name">
                    {calc.targetDayName}
                  </span>
                </div>
                <div className="relative">
                  <input
                    className="w-full px-space-sm py-2 rounded-lg bg-surface-container text-on-surface font-data-mono text-data-mono focus:outline-none focus:ring-2 focus:ring-primary shadow-xs border border-outline-variant/20"
                    id="retire-date-input"
                    type="date"
                    value={retireDateStr}
                    onChange={(e) => setRetireDateStr(e.target.value)}
                  />
                </div>
                <p className="text-body-sm font-body-sm text-outline">Official retirement paperwork date</p>
              </div>
            </div>

            {/* Quick Retirement Target Pills */}
            <div className="space-y-2">
              <label className="font-label-caps text-label-caps text-on-surface-variant uppercase font-semibold">
                Quick Target Presets
              </label>
              <div className="flex flex-wrap gap-2" id="quick-target-buttons">
                <button
                  onClick={() => handleQuickTargetYears(0.5)}
                  className="px-space-sm py-1 rounded-full bg-surface-container-high hover:bg-primary hover:text-on-primary transition-all text-body-sm font-body-sm text-on-surface border border-outline-variant/10 shadow-xs"
                  type="button"
                >
                  End of Year
                </button>
                <button
                  onClick={() => handleQuickTargetYears(1)}
                  className="px-space-sm py-1 rounded-full bg-surface-container-high hover:bg-primary hover:text-on-primary transition-all text-body-sm font-body-sm text-on-surface border border-outline-variant/10 shadow-xs"
                  type="button"
                >
                  In 1 Year
                </button>
                <button
                  onClick={() => handleQuickTargetYears(3)}
                  className="px-space-sm py-1 rounded-full bg-surface-container-high hover:bg-primary hover:text-on-primary transition-all text-body-sm font-body-sm text-on-surface border border-outline-variant/10 shadow-xs"
                  type="button"
                >
                  In 3 Years
                </button>
                <button
                  onClick={() => handleQuickTargetYears(5)}
                  className="px-space-sm py-1 rounded-full bg-surface-container-high hover:bg-primary hover:text-on-primary transition-all text-body-sm font-body-sm text-on-surface border border-outline-variant/10 shadow-xs"
                  type="button"
                >
                  In 5 Years
                </button>
                <button
                  onClick={() => handleQuickTargetFixed('2032-06-30')}
                  className="px-space-sm py-1 rounded-full bg-surface-container-high hover:bg-primary hover:text-on-primary transition-all text-body-sm font-body-sm text-on-surface border border-outline-variant/10 shadow-xs"
                  type="button"
                >
                  At Age 62
                </button>
                <button
                  onClick={() => handleQuickTargetFixed('2035-12-31')}
                  className="px-space-sm py-1 rounded-full bg-surface-container-high hover:bg-primary hover:text-on-primary transition-all text-body-sm font-body-sm text-on-surface border border-outline-variant/10 shadow-xs"
                  type="button"
                >
                  At Age 65
                </button>
              </div>
            </div>

            {/* Schedule Model Presets */}
            <div className="space-y-2 pt-space-xs">
              <div className="flex items-center justify-between">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase font-semibold">
                  Work Schedule Model
                </label>
                <span className="text-body-sm font-body-sm text-primary font-medium" id="schedule-badge-label">
                  {currentScheduleLabel}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2" id="preset-schedule-selector">
                {SCHEDULE_PRESETS.map((preset) => {
                  const isActive = activePreset === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => handleApplyPreset(preset.id)}
                      className={`px-space-xs py-2 rounded-lg text-body-sm font-body-sm text-center font-medium shadow-xs transition-all border ${
                        isActive
                          ? 'bg-primary text-on-primary border-primary'
                          : 'bg-surface-container text-on-surface hover:bg-surface-container-high border-outline-variant/10'
                      }`}
                      type="button"
                    >
                      {preset.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick PTO Balance & Holidays Deductions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md pt-space-xs">
              <div className="space-y-1">
                <label
                  className="font-label-caps text-label-caps text-on-surface-variant uppercase font-semibold"
                  htmlFor="pto-balance-input"
                >
                  Remaining PTO Days
                </label>
                <div className="flex items-center rounded-lg bg-surface-container px-space-sm py-2 shadow-xs border border-outline-variant/15">
                  <span className="material-symbols-outlined text-outline text-[18px] mr-2">beach_access</span>
                  <input
                    className="w-full bg-transparent text-on-surface font-data-mono text-data-mono focus:outline-none"
                    id="pto-balance-input"
                    max="365"
                    min="0"
                    type="number"
                    value={ptoDays}
                    onChange={(e) => setPtoDays(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  />
                  <span className="font-body-sm text-body-sm text-outline font-medium">Days</span>
                </div>
                <p className="text-body-sm font-body-sm text-outline">Accrued vacation &amp; personal time</p>
              </div>

              <div className="space-y-1">
                <label
                  className="font-label-caps text-label-caps text-on-surface-variant uppercase font-semibold"
                  htmlFor="holidays-per-year-input"
                >
                  Paid Holidays / Year
                </label>
                <div className="flex items-center rounded-lg bg-surface-container px-space-sm py-2 shadow-xs border border-outline-variant/15">
                  <span className="material-symbols-outlined text-outline text-[18px] mr-2">flag</span>
                  <input
                    className="w-full bg-transparent text-on-surface font-data-mono text-data-mono focus:outline-none"
                    id="holidays-per-year-input"
                    max="30"
                    min="0"
                    type="number"
                    value={holidaysPerYear}
                    onChange={(e) => setHolidaysPerYear(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  />
                  <span className="font-body-sm text-body-sm text-outline font-medium">Days/Yr</span>
                </div>
                <p className="text-body-sm font-body-sm text-outline">Company observed holidays</p>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-space-sm pt-space-xs">
              <button
                className="flex-1 px-space-lg py-3 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-headline-md text-[16px] font-semibold flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
                id="btn-recalculate"
                type="button"
                onClick={() => {
                  // Trigger state re-render confirmation toast
                }}
              >
                <span className="material-symbols-outlined text-[20px]">calculate</span>
                <span>Update Retirement Countdown</span>
              </button>
              <button
                onClick={handleResetDefaults}
                className="px-space-md py-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-md text-body-md transition-all flex items-center gap-1.5 border border-outline-variant/20"
                id="btn-reset-defaults"
                title="Reset to standard defaults"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">restart_alt</span>
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Weekend Warning / Smart Validation Callout */}
          <div
            className="p-space-md rounded-xl bg-surface-container text-on-surface flex items-start gap-space-sm shadow-xs border border-outline-variant/20"
            id="smart-validation-banner"
          >
            <div className="p-2 rounded-lg bg-secondary-fixed text-on-secondary-fixed mt-0.5 shrink-0">
              <span className="material-symbols-outlined text-[20px]">info</span>
            </div>
            <div className="flex-1 space-y-1">
              <div className="font-headline-md text-[15px] font-semibold text-on-surface flex items-center justify-between">
                <span>Schedule Intelligence Note</span>
                <span className="text-label-caps font-label-caps text-secondary uppercase font-semibold">
                  Personalized Note
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed" id="smart-validation-text">
                Your selected retirement date (<strong className="text-on-surface">{retireDateStr}</strong>) is a{' '}
                <strong>
                  {calc.targetDayName} ({calc.isEndWorkday ? 'Scheduled Workday' : 'Non-Working Weekend'})
                </strong>
                . With your {ptoDays} accrued PTO days taken consecutively prior to retirement, your{' '}
                <strong className="text-primary">Estimated Last Working Day is {calc.finalDayFormatted}</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Summary & Metric Cards (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-space-md">
          {/* Primary Countdown Display Card */}
          <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-xl relative overflow-hidden border border-outline-variant/20">
            <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-primary/5 pointer-events-none"></div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-label-caps text-label-caps uppercase text-primary font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary"></span> Official Calendar Horizon
              </span>
              <span className="font-data-mono text-body-sm text-outline" id="countdown-ticker-badge">
                Real-Time Clock
              </span>
            </div>
            <div className="space-y-1 mb-space-md">
              <div
                className="font-headline-lg text-headline-lg md:text-[38px] md:leading-[44px] text-on-surface tracking-tight font-bold"
                id="display-ymd"
              >
                {calc.ymdStr}
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Total calendar span from your start date to official retirement.
              </p>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-surface-container-high text-center">
              <div className="p-2 rounded-lg bg-surface-container-low border border-outline-variant/10">
                <div className="font-data-mono text-[16px] font-bold text-on-surface" id="stat-calendar-days">
                  {calc.totalCalendarDays.toLocaleString()}
                </div>
                <div className="font-label-caps text-[10px] uppercase text-outline">Total Days</div>
              </div>
              <div className="p-2 rounded-lg bg-surface-container-low border border-outline-variant/10">
                <div className="font-data-mono text-[16px] font-bold text-on-surface" id="stat-calendar-weeks">
                  {calc.totalWeeks}
                </div>
                <div className="font-label-caps text-[10px] uppercase text-outline">Weeks</div>
              </div>
              <div className="p-2 rounded-lg bg-surface-container-low border border-outline-variant/10">
                <div className="font-data-mono text-[16px] font-bold text-on-surface" id="stat-calendar-hours">
                  {calc.totalClockHours.toLocaleString()}
                </div>
                <div className="font-label-caps text-[10px] uppercase text-outline">Clock Hours</div>
              </div>
            </div>
          </div>

          {/* CORE WORK TIME VS CALENDAR TIME CARDS (2x2 Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
            {/* Card 1: Scheduled Workdays */}
            <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between space-y-2 border border-outline-variant/15">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-label-caps uppercase text-outline">Scheduled Days</span>
                <span className="material-symbols-outlined text-secondary text-[20px]">calendar_today</span>
              </div>
              <div>
                <div
                  className="font-data-mono text-numerical-display-mobile font-bold text-on-surface text-[26px]"
                  id="stat-scheduled-workdays"
                >
                  {calc.scheduledWorkdays.toLocaleString()}
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Standard shifts before PTO &amp; holidays</p>
              </div>
              <div className="text-[11px] text-outline font-data-mono">
                Excludes {calc.weekendDaysCount.toLocaleString()} weekends
              </div>
            </div>

            {/* Card 2: PTO & Holiday Adjusted */}
            <div className="p-space-md rounded-xl bg-primary-fixed text-on-primary-fixed shadow-sm flex flex-col justify-between space-y-2 relative overflow-hidden border border-primary/20">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-label-caps uppercase text-on-primary-fixed-variant font-semibold">
                  Net Working Days
                </span>
                <span className="material-symbols-outlined text-primary text-[20px]">verified</span>
              </div>
              <div>
                <div
                  className="font-data-mono text-numerical-display-mobile font-bold text-primary text-[26px]"
                  id="stat-adjusted-workdays"
                >
                  {calc.netWorkdays.toLocaleString()}
                </div>
                <p className="font-body-sm text-body-sm text-on-primary-fixed-variant font-medium">
                  Actual required presence on the job
                </p>
              </div>
              <div className="text-[11px] text-on-primary-fixed-variant font-data-mono">
                -{ptoDays} PTO -{calc.totalHolidaysInPeriod} Holidays
              </div>
            </div>

            {/* Card 3: Remaining Shifts */}
            <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between space-y-2 border border-outline-variant/15">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-label-caps uppercase text-outline">Remaining Shifts</span>
                <span className="material-symbols-outlined text-tertiary-container text-[20px]">badge</span>
              </div>
              <div>
                <div
                  className="font-data-mono text-numerical-display-mobile font-bold text-on-surface text-[26px]"
                  id="stat-remaining-shifts"
                >
                  {calc.netWorkdays.toLocaleString()}
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Individual work punches left</p>
              </div>
              <div className="text-[11px] text-outline font-data-mono">
                Based on {dailyHours.find((h) => h > 0) || 8}.0 hr/shift
              </div>
            </div>

            {/* Card 4: Actual Working Hours */}
            <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between space-y-2 border border-outline-variant/15">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-label-caps uppercase text-outline">Real Work Hours</span>
                <span className="material-symbols-outlined text-secondary text-[20px]">timelapse</span>
              </div>
              <div>
                <div
                  className="font-data-mono text-numerical-display-mobile font-bold text-secondary text-[26px]"
                  id="stat-working-hours"
                >
                  {calc.netHours.toLocaleString()}
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Cumulative hours on the clock</p>
              </div>
              <div className="text-[11px] text-outline font-data-mono">
                Only {calc.totalClockHours > 0 ? ((calc.netHours / calc.totalClockHours) * 100).toFixed(1) : 22.3}% of total time
              </div>
            </div>
          </div>

          {/* Card 5: Estimated Last Working Day Banner */}
          <div className="p-space-md rounded-xl bg-surface-container-highest text-on-surface flex items-center justify-between shadow-sm border border-outline-variant/20">
            <div className="space-y-0.5">
              <span className="font-label-caps text-label-caps uppercase text-primary font-semibold">
                Estimated Last Working Day
              </span>
              <div className="font-headline-md text-[18px] font-bold text-on-surface" id="stat-final-workday">
                {calc.finalDayFormatted}
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Your last day on the job if vacation time is taken right before retirement.
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
              <span className="material-symbols-outlined text-[24px]">celebration</span>
            </div>
          </div>
        </div>
      </div>

      {/* MULTI-MODE DEEP DIVE FEATURE TABS SECTION */}
      <div className="mb-space-2xl">
        {/* Tab Navigation Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-space-lg no-scrollbar border-b border-surface-container-high">
          {[
            { id: 'tab-schedule', label: 'Work Schedule & Shifts', icon: 'calendar_view_week' },
            { id: 'tab-pto', label: 'PTO & Vacation Planner', icon: 'beach_access' },
            { id: 'tab-holidays', label: 'Holiday Manager', icon: 'event_available' },
            { id: 'tab-targets', label: 'Target Comparison', icon: 'compare_arrows' },
            { id: 'tab-milestones', label: 'Milestones & Progress', icon: 'timeline' },
            { id: 'tab-whatif', label: 'What-If Scenarios', icon: 'alt_route' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-btn px-space-md py-2 rounded-lg font-body-sm text-body-sm transition-all flex items-center gap-1.5 flex-shrink-0 ${
                  isActive
                    ? 'font-semibold bg-primary text-on-primary shadow-xs'
                    : 'font-medium text-on-surface-variant hover:bg-surface-container'
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB PANE 1: Work Schedule & Shifts */}
        {activeTab === 'tab-schedule' && (
          <div className="tab-content block" id="tab-schedule">
            <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-md space-y-space-lg border border-outline-variant/20">
              <div>
                <h3 className="font-headline-md text-headline-md text-on-surface tracking-tight mb-1 font-bold">
                  Weekly Hours &amp; Shift Customizer
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Fine-tune the exact hours worked each day. Unlike generic online calculators that assume everyone works 5
                  uniform days, this tool calculates exact daily shifts.
                </p>
              </div>

              {/* Daily Hour Steppers */}
              <div className="grid grid-cols-2 sm:grid-cols-7 gap-space-sm">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((dayName, idx) => {
                  const dayIdx = idx === 6 ? 0 : idx + 1; // Map Mon=1 .. Sun=0
                  const hrs = dailyHours[dayIdx];
                  const isOff = hrs === 0;

                  return (
                    <div
                      key={dayName}
                      className={`p-space-sm rounded-lg text-center space-y-1 border border-outline-variant/15 ${
                        isOff ? 'bg-surface-container-low' : 'bg-surface-container'
                      } ${idx === 6 ? 'col-span-2 sm:col-span-1' : ''}`}
                    >
                      <span
                        className={`font-label-caps text-label-caps uppercase font-semibold ${
                          isOff ? 'text-outline' : 'text-on-surface'
                        }`}
                      >
                        {dayName}
                      </span>
                      <input
                        className="w-full text-center bg-surface-container-lowest rounded py-1 font-data-mono text-data-mono font-bold text-on-surface border border-outline-variant/20"
                        max="24"
                        min="0"
                        type="number"
                        value={hrs}
                        onChange={(e) => handleDailyHourChange(dayIdx, parseFloat(e.target.value) || 0)}
                      />
                      <span className="text-[11px] text-outline block">Hours</span>
                    </div>
                  );
                })}
              </div>

              <div className="p-space-md rounded-lg bg-surface-container-low flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm border border-outline-variant/15">
                <div className="space-y-1">
                  <span className="font-label-caps text-label-caps uppercase text-secondary font-semibold">
                    Rotating Shift Cycle Anchor
                  </span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Working 4-on / 4-off or 2-on / 2-off? Set your shift cycle start day to align cycle accurately.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <label className="font-body-sm text-body-sm text-on-surface font-medium" htmlFor="shift-anchor-date">
                    Cycle Anchor:
                  </label>
                  <input
                    className="px-space-xs py-1 rounded bg-surface-container-lowest font-data-mono text-body-sm text-on-surface border border-outline-variant/20"
                    id="shift-anchor-date"
                    type="date"
                    value={shiftAnchorDate}
                    onChange={(e) => setShiftAnchorDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB PANE 2: PTO & Vacation Planner */}
        {activeTab === 'tab-pto' && (
          <div className="tab-content block" id="tab-pto">
            <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-md space-y-space-lg border border-outline-variant/20">
              <div>
                <h3 className="font-headline-md text-headline-md text-on-surface tracking-tight mb-1 font-bold">
                  Vacation &amp; Paid Time Off (PTO) Planner
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Explore how taking accumulated vacation time advances your last physical day in the office.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
                {/* Placement Strategy */}
                <div className="p-space-md rounded-xl bg-surface-container-low space-y-space-sm border border-outline-variant/15">
                  <span className="font-label-caps text-label-caps uppercase text-primary font-semibold">
                    Vacation Strategy
                  </span>
                  <div className="space-y-2">
                    <label className="flex items-start gap-space-xs cursor-pointer">
                      <input
                        checked={ptoStrategy === 'terminal'}
                        onChange={() => setPtoStrategy('terminal')}
                        className="mt-1 text-primary focus:ring-primary"
                        name="pto-strategy"
                        type="radio"
                        value="terminal"
                      />
                      <div>
                        <div className="font-body-sm text-body-sm font-semibold text-on-surface">
                          Use Vacation Right Before Retirement
                        </div>
                        <p className="text-[12px] text-on-surface-variant">
                          Moves your estimated last working day earlier by the number of workdays in your vacation balance.
                        </p>
                      </div>
                    </label>
                    <label className="flex items-start gap-space-xs cursor-pointer">
                      <input
                        checked={ptoStrategy === 'spread'}
                        onChange={() => setPtoStrategy('spread')}
                        className="mt-1 text-primary focus:ring-primary"
                        name="pto-strategy"
                        type="radio"
                        value="spread"
                      />
                      <div>
                        <div className="font-body-sm text-body-sm font-semibold text-on-surface">
                          Even Distribution (Periodic rest days)
                        </div>
                        <p className="text-[12px] text-on-surface-variant">
                          Keeps your final retirement date identical but reduces total workload and strain each year.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Impact Comparison Metric */}
                <div className="p-space-md rounded-xl bg-surface-container space-y-space-sm border border-outline-variant/15">
                  <span className="font-label-caps text-label-caps uppercase text-outline">
                    Using Vacation Right Before Retirement
                  </span>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-body-sm font-body-sm">
                      <span className="text-on-surface-variant">Scheduled Last Day:</span>
                      <span className="font-data-mono font-bold text-on-surface">{retireDateStr}</span>
                    </div>
                    <div className="flex justify-between items-center text-body-sm font-body-sm">
                      <span className="text-primary font-medium">Estimated Last Working Day:</span>
                      <span className="font-data-mono font-bold text-primary" id="pto-accelerated-date">
                        {calc.finalDayFormatted}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-body-sm font-body-sm border-t border-surface-container-high pt-2">
                      <span className="text-secondary font-medium">Early Freedom Gained:</span>
                      <span className="font-data-mono font-bold text-secondary" id="pto-freedom-days">
                        {calc.freedomDays} Calendar Days
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visual Bar Chart Component (Before vs After PTO) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-body-sm font-body-sm">
                  <span className="font-medium text-on-surface">Workday Burden Reduction</span>
                  <span className="font-data-mono text-outline">
                    <span id="bar-workdays-with-pto" className="font-bold text-on-surface">
                      {calc.netWorkdays.toLocaleString()}
                    </span>{' '}
                    / {calc.scheduledWorkdays.toLocaleString()} Workdays Remaining
                  </span>
                </div>
                <div className="w-full h-4 rounded-full bg-surface-container-high overflow-hidden flex">
                  <div
                    className="bg-primary h-full transition-all duration-500"
                    id="bar-pto-active"
                    style={{ width: `${calc.workPercent}%` }}
                  ></div>
                  <div
                    className="bg-tertiary-fixed h-full transition-all duration-500"
                    id="bar-pto-saved"
                    style={{ width: `${100 - calc.workPercent}%` }}
                  ></div>
                </div>
                <div className="flex items-center gap-4 text-[12px] text-on-surface-variant">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary"></span> Active Shifts Required
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-tertiary-fixed"></span> Paid Days Off (Vacation + Holidays)
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB PANE 3: Holiday Manager */}
        {activeTab === 'tab-holidays' && (
          <div className="tab-content block" id="tab-holidays">
            <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-md space-y-space-md border border-outline-variant/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-headline-md text-headline-md text-on-surface tracking-tight font-bold">
                    Company &amp; Federal Holiday Manager
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Observed holidays falling on standard workdays are omitted so you never overcount shifts.
                  </p>
                </div>
                <button
                  onClick={handleToggleAllHolidays}
                  className="px-space-sm py-1.5 rounded-lg bg-surface-container text-body-sm font-body-sm text-primary font-medium hover:bg-surface-container-high transition-colors border border-outline-variant/15 shrink-0"
                  id="btn-toggle-all-holidays"
                  type="button"
                >
                  Toggle All Default Holidays
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-space-sm pt-2">
                {holidaysList.map((h) => (
                  <label
                    key={h.id}
                    className="flex items-center gap-space-xs p-space-sm rounded-lg bg-surface-container cursor-pointer border border-outline-variant/10 hover:bg-surface-container-high transition-colors"
                  >
                    <input
                      checked={h.checked}
                      onChange={() => handleToggleHolidayItem(h.id)}
                      className="holiday-checkbox text-primary focus:ring-primary rounded"
                      type="checkbox"
                    />
                    <span className="font-body-sm text-body-sm text-on-surface font-medium">{h.name}</span>
                  </label>
                ))}
              </div>
              <div className="pt-space-xs flex items-center gap-2 text-body-sm font-body-sm text-outline">
                <span className="material-symbols-outlined text-[16px]">sync_alt</span>
                <span>
                  Weekend Collision Rule: If a holiday falls on Saturday or Sunday, observed workday shift logic is automatically applied.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB PANE 4: Target Date Comparison Table */}
        {activeTab === 'tab-targets' && (
          <div className="tab-content block" id="tab-targets">
            <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-md space-y-space-md border border-outline-variant/20">
              <div>
                <h3 className="font-headline-md text-headline-md text-on-surface tracking-tight mb-1 font-bold">
                  Retirement Horizon Comparison Matrix
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Compare 4 different retirement dates side-by-side to understand the exact difference in work shifts and hours.
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-body-sm font-body-sm">
                  <thead>
                    <tr className="bg-surface-container text-on-surface border-b border-surface-container-high font-semibold">
                      <th className="py-3 px-4">Target Scenario</th>
                      <th className="py-3 px-4">Target Date</th>
                      <th className="py-3 px-4">Calendar Days</th>
                      <th className="py-3 px-4">Scheduled Workdays</th>
                      <th className="py-3 px-4">Net Shifts Left</th>
                      <th className="py-3 px-4">Work Hours</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container">
                    <tr className="hover:bg-surface-container-low transition-colors">
                      <td className="py-3 px-4 font-semibold text-primary">Scenario A (Aggressive)</td>
                      <td className="py-3 px-4 font-data-mono">Dec 31, 2028</td>
                      <td className="py-3 px-4 font-data-mono">958 days</td>
                      <td className="py-3 px-4 font-data-mono">685 days</td>
                      <td className="py-3 px-4 font-data-mono font-bold text-on-surface">635 shifts</td>
                      <td className="py-3 px-4 font-data-mono text-secondary">5,080 hrs</td>
                    </tr>
                    <tr className="hover:bg-surface-container-low transition-colors">
                      <td className="py-3 px-4 font-semibold text-on-surface">Scenario B (Midpoint)</td>
                      <td className="py-3 px-4 font-data-mono">Jun 30, 2029</td>
                      <td className="py-3 px-4 font-data-mono">1,139 days</td>
                      <td className="py-3 px-4 font-data-mono">814 days</td>
                      <td className="py-3 px-4 font-data-mono font-bold text-on-surface">759 shifts</td>
                      <td className="py-3 px-4 font-data-mono text-secondary">6,072 hrs</td>
                    </tr>
                    <tr className="bg-primary-fixed/20 hover:bg-primary-fixed/30 transition-colors">
                      <td className="py-3 px-4 font-semibold text-primary flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-primary"></span> Current Selection
                      </td>
                      <td className="py-3 px-4 font-data-mono font-bold">{retireDateStr}</td>
                      <td className="py-3 px-4 font-data-mono">{calc.totalCalendarDays.toLocaleString()} days</td>
                      <td className="py-3 px-4 font-data-mono">{calc.scheduledWorkdays.toLocaleString()} days</td>
                      <td className="py-3 px-4 font-data-mono font-bold text-primary">{calc.netWorkdays.toLocaleString()} shifts</td>
                      <td className="py-3 px-4 font-data-mono font-bold text-primary">{calc.netHours.toLocaleString()} hrs</td>
                    </tr>
                    <tr className="hover:bg-surface-container-low transition-colors">
                      <td className="py-3 px-4 font-semibold text-on-surface">Scenario D (Age 65)</td>
                      <td className="py-3 px-4 font-data-mono">Dec 31, 2035</td>
                      <td className="py-3 px-4 font-data-mono">3,514 days</td>
                      <td className="py-3 px-4 font-data-mono">2,510 days</td>
                      <td className="py-3 px-4 font-data-mono font-bold text-on-surface">2,370 shifts</td>
                      <td className="py-3 px-4 font-data-mono text-secondary">18,960 hrs</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB PANE 5: Milestones & Progress Timeline */}
        {activeTab === 'tab-milestones' && (
          <div className="tab-content block" id="tab-milestones">
            <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-md space-y-space-lg border border-outline-variant/20">
              <div>
                <h3 className="font-headline-md text-headline-md text-on-surface tracking-tight mb-1 font-bold">
                  Career Progress &amp; Workday Milestones
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  See the big picture: where you stand across your total career and the next workday milestones ahead.
                </p>
              </div>

              {/* Macro Career Progress Bar */}
              <div className="p-space-md rounded-xl bg-surface-container-low space-y-space-sm border border-outline-variant/15">
                <div className="flex items-center justify-between font-body-sm text-body-sm">
                  <span className="font-medium text-on-surface">
                    Overall Career Journey (Est. {careerStartYear} – {careerProgress.retireYear})
                  </span>
                  <span className="font-data-mono font-bold text-primary">{careerProgress.percent}% Complete</span>
                </div>
                <div className="w-full h-3 rounded-full bg-surface-container-high overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-700"
                    style={{ width: `${careerProgress.percent}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[11px] text-outline font-data-mono">
                  <span>Career Start: Jan {careerStartYear}</span>
                  <span className="text-on-surface font-semibold">Current: {careerProgress.currentYear}</span>
                  <span>Retirement: Dec {careerProgress.retireYear}</span>
                </div>
              </div>

              {/* Countdown Milestones List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-sm">
                <div className="p-space-sm rounded-lg bg-surface-container space-y-1 border border-outline-variant/10">
                  <span className="font-label-caps text-label-caps uppercase text-primary font-semibold">Next Milestone</span>
                  <div className="font-data-mono text-headline-md font-bold text-on-surface">1,000 Shifts</div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    {calc.netWorkdays > 1000
                      ? `${(calc.netWorkdays - 1000).toLocaleString()} shifts away`
                      : 'Milestone reached! 🎉'}
                  </p>
                </div>
                <div className="p-space-sm rounded-lg bg-surface-container space-y-1 border border-outline-variant/10">
                  <span className="font-label-caps text-label-caps uppercase text-outline">Upcoming Target</span>
                  <div className="font-data-mono text-headline-md font-bold text-on-surface">500 Shifts</div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    {calc.netWorkdays > 500
                      ? `${(calc.netWorkdays - 500).toLocaleString()} shifts away`
                      : 'Milestone reached! 🎉'}
                  </p>
                </div>
                <div className="p-space-sm rounded-lg bg-surface-container space-y-1 border border-outline-variant/10">
                  <span className="font-label-caps text-label-caps uppercase text-outline">Double Digits</span>
                  <div className="font-data-mono text-headline-md font-bold text-on-surface">99 Shifts Left</div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    {calc.netWorkdays > 99
                      ? `${(calc.netWorkdays - 99).toLocaleString()} shifts to double digits`
                      : 'In double digits! Home stretch!'}
                  </p>
                </div>
                <div className="p-space-sm rounded-lg bg-surface-container-highest space-y-1 border border-outline-variant/10">
                  <span className="font-label-caps text-label-caps uppercase text-tertiary font-semibold">The Final Ten</span>
                  <div className="font-data-mono text-headline-md font-bold text-tertiary">10 Shifts Left</div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    {calc.netWorkdays > 10
                      ? `${(calc.netWorkdays - 10).toLocaleString()} shifts away`
                      : 'Almost there! Single digits!'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB PANE 6: What-If Scenarios */}
        {activeTab === 'tab-whatif' && (
          <div className="tab-content block" id="tab-whatif">
            <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-md space-y-space-md border border-outline-variant/20">
              <div>
                <h3 className="font-headline-md text-headline-md text-on-surface tracking-tight mb-1 font-bold">
                  What-If Scenario Sandbox
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Evaluate the real work trade-off of adjusting your retirement timeline forward or backward.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                {/* Scenario: Retiring 6 Months Earlier */}
                <div className="p-space-md rounded-xl bg-surface-container border-l-4 border-primary space-y-space-xs shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-headline-md text-[17px] font-semibold text-on-surface">Retire 6 Months Earlier</span>
                    <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-caps text-[11px] font-bold">
                      Saved Workload
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">What you save by pulling your date back 6 months:</p>
                  <div className="grid grid-cols-3 gap-2 pt-2 text-center">
                    <div className="p-2 rounded bg-surface-container-lowest border border-outline-variant/10">
                      <div className="font-data-mono font-bold text-primary">-128</div>
                      <div className="text-[10px] uppercase text-outline">Workdays</div>
                    </div>
                    <div className="p-2 rounded bg-surface-container-lowest border border-outline-variant/10">
                      <div className="font-data-mono font-bold text-primary">-1,024</div>
                      <div className="text-[10px] uppercase text-outline">Work Hours</div>
                    </div>
                    <div className="p-2 rounded bg-surface-container-lowest border border-outline-variant/10">
                      <div className="font-data-mono font-bold text-primary">-26</div>
                      <div className="text-[10px] uppercase text-outline">Weeks Free</div>
                    </div>
                  </div>
                </div>

                {/* Scenario: Retiring 1 Year Later */}
                <div className="p-space-md rounded-xl bg-surface-container border-l-4 border-outline space-y-space-xs shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-headline-md text-[17px] font-semibold text-on-surface">Retire 1 Year Later</span>
                    <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-label-caps text-[11px] font-bold">
                      Extra Commitment
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">The incremental commitment of staying one more year:</p>
                  <div className="grid grid-cols-3 gap-2 pt-2 text-center">
                    <div className="p-2 rounded bg-surface-container-lowest border border-outline-variant/10">
                      <div className="font-data-mono font-bold text-on-surface">+250</div>
                      <div className="text-[10px] uppercase text-outline">Workdays</div>
                    </div>
                    <div className="p-2 rounded bg-surface-container-lowest border border-outline-variant/10">
                      <div className="font-data-mono font-bold text-on-surface">+2,000</div>
                      <div className="text-[10px] uppercase text-outline">Work Hours</div>
                    </div>
                    <div className="p-2 rounded bg-surface-container-lowest border border-outline-variant/10">
                      <div className="font-data-mono font-bold text-on-surface">+52</div>
                      <div className="text-[10px] uppercase text-outline">Weeks Added</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SHAREABLE RESULT CARD, AUDIT BREAKDOWN, & ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg mb-space-3xl items-start">
        {/* Shareable Summary Card (7 cols) */}
        <div className="lg:col-span-7 p-space-lg rounded-xl bg-surface-container-lowest shadow-lg space-y-space-md border border-outline-variant/20">
          <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-high">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">share</span>
              <span className="font-headline-md text-[18px] font-semibold text-on-surface">
                Export &amp; Share Your Countdown
              </span>
            </div>
            <span className="text-label-caps font-label-caps text-outline uppercase">Shareable Snapshot</span>
          </div>

          {/* Clean Summary Badge to Copy/Share */}
          <div className="p-space-md rounded-xl bg-surface-container-low space-y-space-sm border border-outline-variant/15" id="shareable-snippet-card">
            <div className="flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant">
              <span>SolveItCalculator.com Countdown Snapshot</span>
              <span className="font-data-mono text-[12px]">Target: {retireDateStr}</span>
            </div>
            <div className="font-headline-md text-headline-md text-on-surface font-bold">
              {calc.years} Years, {calc.months} Months, {calc.days} Days Left Until Retirement
            </div>
            <div className="text-body-md font-body-md text-on-surface-variant flex flex-wrap gap-x-4 gap-y-1">
              <span>📅 <strong>{calc.netWorkdays.toLocaleString()}</strong> Actual Workdays</span>
              <span>⏰ <strong>{calc.netHours.toLocaleString()}</strong> Working Hours</span>
              <span>🏖️ <strong>{calc.finalDayFormatted}</strong> Estimated Last Day</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-space-xs pt-space-xs">
            <button
              onClick={handleCopySummary}
              className="px-space-md py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm transition-all flex items-center gap-1.5 border border-outline-variant/20 shadow-xs active:scale-95"
              id="btn-copy-result"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">
                {copyFeedback ? 'check' : 'content_copy'}
              </span>
              <span id="copy-btn-label">{copyFeedback ? 'Copied to Clipboard!' : 'Copy Summary'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-space-md py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm transition-all flex items-center gap-1.5 border border-outline-variant/20 shadow-xs"
              id="btn-print-summary"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Print Friendly Layout</span>
            </button>
            <button
              onClick={handleDownloadCsv}
              className="px-space-md py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm transition-all flex items-center gap-1.5 border border-outline-variant/20 shadow-xs"
              id="btn-download-csv"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>Download CSV Report</span>
            </button>
          </div>
        </div>

        {/* Calculation Summary Panel (5 cols) */}
        <div className="lg:col-span-5 p-space-lg rounded-xl bg-surface-container shadow-sm space-y-space-sm border border-outline-variant/20">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-outline text-[18px]">verified_user</span>
            <span className="font-headline-md text-[16px] font-semibold text-on-surface">
              Calculation Summary &amp; Breakdown
            </span>
          </div>
          <p className="text-body-sm font-body-sm text-on-surface-variant">
            Here is the exact step-by-step breakdown of your remaining time:
          </p>
          <div className="space-y-1 text-[13px] font-data-mono text-on-surface-variant">
            <div className="flex justify-between py-1 border-b border-surface-container-high">
              <span>Gross Calendar Days:</span>
              <span className="font-bold text-on-surface">{calc.totalCalendarDays.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-surface-container-high">
              <span>Weekend Days Deducted:</span>
              <span className="text-error">-{calc.weekendDaysCount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-surface-container-high">
              <span>Company Holidays Deducted:</span>
              <span className="text-error">-{calc.totalHolidaysInPeriod.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-surface-container-high">
              <span>Accrued PTO Days Deducted:</span>
              <span className="text-error">-{ptoDays}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-surface-container-high">
              <span>Net Actual Workdays:</span>
              <span className="font-bold text-primary">{calc.netWorkdays.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1 pt-2">
              <span>Net Required Working Hours:</span>
              <span className="font-bold text-secondary">{calc.netHours.toLocaleString()} hrs</span>
            </div>
          </div>
        </div>
      </div>
      </>
      )}

      {/* RICH EDITORIAL & EDUCATIONAL CONTENT SECTION */}
      <div className="space-y-space-2xl mb-space-3xl max-w-4xl">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mb-space-sm font-bold">
            Why Your Retirement Date Is Not the Same as Your Remaining Work Time
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-space-sm leading-relaxed">
            Most people planning for retirement write a single date on their calendar — such as December 31st or their 65th birthday — and assume that marks their remaining commitment. In reality, calendar days give an artificially daunting impression of how much work you have left.
          </p>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            When you remove regular weekend days, company-recognized paid holidays, and earned annual leave (PTO), most full-time employees only work approximately <strong>220 to 240 days per calendar year</strong>. That means out of a 365-day year, over 125 days are already non-working days. Understanding this difference transforms a four-year retirement horizon from 1,460 calendar days into roughly 900 actual workdays.
          </p>
        </div>

        {/* 2-Column Explainer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
          <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm space-y-space-xs border border-outline-variant/15">
            <h3 className="font-headline-md text-[18px] font-semibold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[22px]">event_busy</span>
              <span>How to Find Your Estimated Last Working Day</span>
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Many retirees choose to spend down their remaining accrued paid time off immediately before their official retirement date rather than receiving a taxable lump-sum cash out. This strategy — often referred to as &ldquo;terminal leave&rdquo; — means your actual final day on the job arrives weeks or months ahead of your official retirement paperwork date.
            </p>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Our calculator finds this date by counting backward from your target retirement date, skipping weekends and holidays, to determine the exact calendar date when you hand in your company laptop or tools for good.
            </p>
          </div>

          <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm space-y-space-xs border border-outline-variant/15">
            <h3 className="font-headline-md text-[18px] font-semibold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[22px]">published_with_changes</span>
              <span>Rotating Shifts, 12-Hour Days &amp; Phased Hours</span>
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Not everyone works a Monday-through-Friday 9-to-5 schedule. Healthcare workers, emergency responders, manufacturing technicians, and utility operators frequently work 12-hour shifts or rotating rosters (like 4-on / 4-off or DuPont schedules).
            </p>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Under a 12-hour shift pattern, you work far fewer days per year (often only 182 shifts), meaning your countdown drops rapidly shift-by-shift. Likewise, phased retirement arrangements (such as stepping down to 3 days per week) significantly reduce your working burden while stretching your calendar transition smoothly.
            </p>
          </div>
        </div>

        {/* Official References & Regulatory Benchmarks (Trusted Government Data Sources) */}
        <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm space-y-space-md border border-outline-variant/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-space-xs border-b border-surface-container-high">
            <div className="flex items-center gap-2 text-on-surface">
              <span className="material-symbols-outlined text-primary text-[22px]">account_balance</span>
              <h3 className="font-headline-md text-[18px] font-bold">Official References &amp; Regulatory Benchmarks</h3>
            </div>
            <span className="inline-flex items-center gap-1 font-data-mono text-[11px] font-bold text-primary bg-primary-fixed px-2.5 py-0.5 rounded-full">
              .gov Data Sources
            </span>
          </div>

          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            For official statutory benefit age guidelines and workplace schedule standards, we recommend consulting these authoritative U.S. government agencies:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
            {/* Reference 1: SSA.gov */}
            <a
              href="https://www.ssa.gov/benefits/retirement/planner/ageincrease.html"
              target="_blank"
              rel="noopener noreferrer"
              className="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex flex-col justify-between group border border-outline-variant/15 hover:border-primary/40 shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-label-caps text-[11px] uppercase font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                    U.S. Social Security Administration
                  </span>
                  <span className="material-symbols-outlined text-[16px] text-outline group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                    open_in_new
                  </span>
                </div>
                <h4 className="font-body-md font-bold text-on-surface group-hover:text-primary transition-colors">
                  SSA Full Retirement Age (FRA) Schedule ↗
                </h4>
                <p className="font-body-sm text-[13px] text-on-surface-variant mt-1 leading-relaxed">
                  Verify your official statutory Full Retirement Age (age 67 for births 1960 and later) and evaluate early vs. delayed claiming credit rules.
                </p>
              </div>
              <div className="pt-2 mt-2 border-t border-outline-variant/10 flex items-center justify-between text-[12px] font-data-mono text-outline">
                <span>ssa.gov/benefits/retirement</span>
                <span className="text-primary font-semibold">Visit Official Guide →</span>
              </div>
            </a>

            {/* Reference 2: BLS.gov */}
            <a
              href="https://www.bls.gov/ebs/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex flex-col justify-between group border border-outline-variant/15 hover:border-secondary/40 shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-label-caps text-[11px] uppercase font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded">
                    U.S. Bureau of Labor Statistics
                  </span>
                  <span className="material-symbols-outlined text-[16px] text-outline group-hover:text-secondary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                    open_in_new
                  </span>
                </div>
                <h4 className="font-body-md font-bold text-on-surface group-hover:text-secondary transition-colors">
                  BLS National Compensation Survey: Paid Leave ↗
                </h4>
                <p className="font-body-sm text-[13px] text-on-surface-variant mt-1 leading-relaxed">
                  Review civilian workforce benchmarks for average paid holidays (11 days) and annual PTO accrual across career tenure brackets.
                </p>
              </div>
              <div className="pt-2 mt-2 border-t border-outline-variant/10 flex items-center justify-between text-[12px] font-data-mono text-outline">
                <span>bls.gov/ebs</span>
                <span className="text-secondary font-semibold">Visit Official Survey →</span>
              </div>
            </a>
          </div>
        </div>

        {/* Calculation Methodology & Trust Disclosure */}
        <div className="p-space-lg rounded-xl bg-surface-container-low space-y-space-xs border border-outline-variant/15">
          <div className="flex items-center gap-2 text-primary font-semibold">
            <span className="material-symbols-outlined text-[20px]">verified</span>
            <span className="font-label-caps text-label-caps uppercase">How We Calculate Your Results</span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
            This tool computes calendar days, scheduled work shifts, and total hours on the job based on your chosen weekly schedule. Official holidays are adjusted automatically if they land on a weekend. Your inputs stay 100% private on your device. For official pension formulas and Social Security claiming decisions, refer to <a href="https://www.ssa.gov" target="_blank" rel="noopener noreferrer" className="text-primary font-semibold underline underline-offset-2">Social Security (SSA.gov)</a> and your employer plan administrator.
          </p>
        </div>
      </div>

      {/* 20+ EXPANDABLE SEARCH-INTENT FAQ SECTION */}
      <div className="space-y-space-lg mb-space-3xl max-w-4xl">
        <div>
          <div className="inline-flex items-center gap-2 px-space-sm py-1 rounded-lg bg-surface-container-high text-on-surface-variant font-label-caps text-label-caps uppercase mb-space-xs">
            Frequently Asked Questions
          </div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mb-space-xs font-bold">
            Retirement Countdown Questions Answered
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Explore detailed answers on workday calculations, taking vacation early, rotating shifts, and retirement date timing.
          </p>
        </div>

        <div className="space-y-space-xs" id="faq-accordion-group">
          {[
            {
              q: 'What is the difference between calendar days and scheduled workdays?',
              a: 'Calendar days measure the continuous timeline including all Saturdays, Sundays, and holidays (365 days per standard year). Scheduled workdays include only the days you are rostered to work (typically around 250 days per year for a standard Monday–Friday worker).',
            },
            {
              q: 'What is an "Estimated Last Working Day"?',
              a: 'Your Estimated Last Working Day is the last date you physically perform job duties if you apply your remaining accrued paid time off (PTO) immediately before your official retirement date.',
            },
            {
              q: 'How does the calculator handle holidays falling on weekends?',
              a: 'The calculator applies standard observed shift rules: if a fixed holiday (like July 4th or Christmas) lands on a Saturday, the preceding Friday is counted as the observed day off. If it falls on Sunday, the following Monday is credited.',
            },
            {
              q: 'Can I calculate countdowns for 12-hour shifts or 4-on / 4-off schedules?',
              a: 'Yes. Under the Work Schedule tab, you can select the 4-on / 4-off preset or adjust individual daily hours to 12 hours. The calculator will accurately compute your remaining shifts and hours rather than assuming a standard 8-hour day.',
            },
            {
              q: 'Is it better to take PTO before retirement or cash it out?',
              a: 'Using PTO as "terminal leave" allows you to stop working earlier while continuing to accrue employee benefits and pension service credit. Cashing out provides a single lump sum, but is often taxed at bonus supplemental withholding rates. Consult your HR policy.',
            },
            {
              q: 'What happens if my planned retirement date lands on a Saturday or Sunday?',
              a: 'The Smart Validation banner will highlight that your chosen date is a non-scheduled weekend day. Your last active working day will automatically adjust to the Friday immediately preceding that weekend.',
            },
            {
              q: 'Does this tool store or transmit my retirement dates?',
              a: 'No. All calculations run strictly inside your browser session. Zero tracking or date storage takes place.',
            },
            {
              q: 'How does phased retirement change my remaining working hours?',
              a: 'In a phased retirement (e.g., dropping from 5 days to 3 days per week), you work approximately 40% fewer hours over the same calendar timespan. You can test this using our Phased Hours preset.',
            },
            {
              q: 'How many working hours are in an average American work year?',
              a: 'A standard full-time year (40 hours/week × 52 weeks) equals 2,080 gross hours. After subtracting roughly 10 paid holidays and 15 days of PTO, actual working time is typically between 1,840 and 1,880 hours.',
            },
            {
              q: 'Does this countdown account for leap years?',
              a: 'Yes. The calendar calculator accurately handles February 29th in all applicable leap years (e.g., 2028, 2032) across calendar and workday counts.',
            },
            {
              q: 'Why is counting shifts more motivating than counting calendar years?',
              a: 'A calendar year can feel distant and static. Counting individual shifts gives you an actionable, diminishing number that decreases every single day you clock out, providing a tangible sense of accomplishment.',
            },
            {
              q: 'Can I compare multiple retirement target dates simultaneously?',
              a: 'Yes, simply click the "Target Comparison" tab above to view a comparison matrix contrasting 4 different retirement dates, their calendar spans, and remaining working shifts.',
            },
            {
              q: 'What if my company observes floating holidays?',
              a: 'If your employer grants floating holidays, simply add those days directly into your Remaining PTO balance or increase your "Paid Holidays / Year" setting by that number.',
            },
            {
              q: 'How does Social Security Full Retirement Age (FRA) relate to this countdown?',
              a: 'For anyone born in 1960 or later, FRA is 67. You can use our Quick Target buttons or manually set your retirement date to your 67th birthday to see the exact workdays remaining until full benefits begin.',
            },
            {
              q: 'Can I print or save a copy of my countdown results?',
              a: 'Yes, use the "Print Friendly Layout", "Copy Summary", or "Download CSV Report" buttons in the Export section to archive or share your retirement milestone timeline.',
            },
            {
              q: 'Does the calculator support 6-day work weeks?',
              a: 'Yes. Select the "Mon–Sat (6 Days)" preset button or manually enter hours for Saturday in the Work Schedule tab.',
            },
            {
              q: 'How are partial hours handled?',
              a: 'Daily hours support numerical input up to 24 hours. If you work half-days on Fridays (e.g., 4 hours), simply enter 4 in the Friday slot.',
            },
            {
              q: 'Can I count down from a past date to measure career progress?',
              a: 'Yes, you can adjust the Start Date to whenever your career began or whenever you started your current job to track overall percentage progress.',
            },
            {
              q: 'What is the "Last 100 Shifts Countdown"?',
              a: 'It is a psychological milestone tracker popularized by retirees who cross off their final 100 shifts. Once you hit 99 shifts, you enter double digits, making your remaining commitment feel immediate.',
            },
            {
              q: 'Does taking unpaid leave change my countdown?',
              a: 'Any planned unpaid time off will reduce the number of shifts you physically work, though it may alter your target date if your pension requires a set number of credited hours.',
            },
          ].map((faq, index) => (
            <details
              key={index}
              className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm group border border-outline-variant/15"
            >
              <summary className="font-headline-md text-[16px] font-semibold text-on-surface cursor-pointer list-none flex items-center justify-between">
                <span>{faq.q}</span>
                <span className="material-symbols-outlined text-outline group-open:rotate-180 transition-transform">
                  expand_more
                </span>
              </summary>
              <p className="font-body-md text-body-md text-on-surface-variant mt-2 pt-2 border-t border-surface-container leading-relaxed">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </div>

      {/* RELATED RETIREMENT & FINANCIAL CALCULATORS HUB */}
      <div className="space-y-space-md mb-space-3xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-headline-md text-headline-md text-on-surface tracking-tight font-bold">
              Related Retirement &amp; Career Planning Tools
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Pair your workday countdown with actuarial modeling, portfolio decumulation, and payroll calculators.
            </p>
          </div>
          <Link
            className="text-primary hover:underline font-body-sm text-body-sm flex items-center gap-1 font-semibold self-start sm:self-auto"
            href="/retirement-and-super"
          >
            <span>Retirement &amp; Super Hub</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-md">
          {/* Pension Estimator */}
          <div className="p-space-md rounded-xl bg-surface-container-lowest hover:bg-surface-container transition-all shadow-sm flex flex-col justify-between group border border-outline-variant/15">
            <div className="flex items-start gap-space-sm">
              <div className="p-2 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 shrink-0">
                <span className="material-symbols-outlined text-[22px]">account_balance</span>
              </div>
              <div className="space-y-1">
                <div className="font-body-md font-semibold text-on-surface group-hover:text-primary transition-colors flex items-center gap-1.5">
                  <span>Pension Estimator</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold uppercase bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">In-Page</span>
                </div>
                <p className="text-body-sm font-body-sm text-on-surface-variant">
                  Calculate monthly defined benefit payouts from salary history, multiplier %, and vested service.
                </p>
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-outline-variant/10 flex items-center justify-between text-body-sm font-semibold">
              <button
                type="button"
                onClick={() => {
                  setActiveSuiteTool('pension');
                  window.scrollTo({ top: 400, behavior: 'smooth' });
                }}
                className="text-primary hover:underline flex items-center gap-1"
              >
                <span>Use on this page</span>
                <span className="material-symbols-outlined text-[15px]">north</span>
              </button>
              <Link href="/retirement-and-super" className="text-on-surface-variant hover:text-on-surface text-[12px] flex items-center gap-0.5">
                <span>Full Hub</span>
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </Link>
            </div>
          </div>

          {/* 401(k) Growth Planner */}
          <div className="p-space-md rounded-xl bg-surface-container-lowest hover:bg-surface-container transition-all shadow-sm flex flex-col justify-between group border border-outline-variant/15">
            <div className="flex items-start gap-space-sm">
              <div className="p-2 rounded-lg bg-sky-100 text-sky-700 dark:bg-sky-950/80 dark:text-sky-300 shrink-0">
                <span className="material-symbols-outlined text-[22px]">savings</span>
              </div>
              <div className="space-y-1">
                <div className="font-body-md font-semibold text-on-surface group-hover:text-primary transition-colors flex items-center gap-1.5">
                  <span>401(k) Growth Planner</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold uppercase bg-sky-50 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300">In-Page</span>
                </div>
                <p className="text-body-sm font-body-sm text-on-surface-variant">
                  Forecast compound portfolio wealth with employer matching up to your retirement countdown date.
                </p>
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-outline-variant/10 flex items-center justify-between text-body-sm font-semibold">
              <button
                type="button"
                onClick={() => {
                  setActiveSuiteTool('growth');
                  window.scrollTo({ top: 400, behavior: 'smooth' });
                }}
                className="text-primary hover:underline flex items-center gap-1"
              >
                <span>Use on this page</span>
                <span className="material-symbols-outlined text-[15px]">north</span>
              </button>
              <Link href="/savings" className="text-on-surface-variant hover:text-on-surface text-[12px] flex items-center gap-0.5">
                <span>Savings Hub</span>
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </Link>
            </div>
          </div>

          {/* Monte Carlo & FIRE Simulator */}
          <div className="p-space-md rounded-xl bg-surface-container-lowest hover:bg-surface-container transition-all shadow-sm flex flex-col justify-between group border border-outline-variant/15">
            <div className="flex items-start gap-space-sm">
              <div className="p-2 rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 shrink-0">
                <span className="material-symbols-outlined text-[22px]">ssid_chart</span>
              </div>
              <div className="space-y-1">
                <div className="font-body-md font-semibold text-on-surface group-hover:text-primary transition-colors">
                  FIRE &amp; Monte Carlo Forecaster
                </div>
                <p className="text-body-sm font-body-sm text-on-surface-variant">
                  Stress-test sequence-of-returns risk and safe withdrawal survival across 10,000 market simulations.
                </p>
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-outline-variant/10 flex items-center justify-between text-body-sm font-semibold">
              <button
                type="button"
                onClick={() => {
                  setActiveSuiteTool('monte-carlo');
                  window.scrollTo({ top: 400, behavior: 'smooth' });
                }}
                className="text-primary hover:underline flex items-center gap-1"
              >
                <span>Quick Sim</span>
                <span className="material-symbols-outlined text-[15px]">north</span>
              </button>
              <Link href="/fire-forecaster" className="text-primary hover:underline flex items-center gap-0.5">
                <span>Open Dedicated App</span>
                <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
              </Link>
            </div>
          </div>

          {/* Social Security & Super Optimizer */}
          <div className="p-space-md rounded-xl bg-surface-container-lowest hover:bg-surface-container transition-all shadow-sm flex flex-col justify-between group border border-outline-variant/15">
            <div className="flex items-start gap-space-sm">
              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 shrink-0">
                <span className="material-symbols-outlined text-[22px]">verified_user</span>
              </div>
              <div className="space-y-1">
                <div className="font-body-md font-semibold text-on-surface group-hover:text-primary transition-colors">
                  Social Security &amp; Super
                </div>
                <p className="text-body-sm font-body-sm text-on-surface-variant">
                  Evaluate monthly payouts comparing early age 62 claiming, FRA 67 base, and age 70 maximums.
                </p>
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-outline-variant/10 flex items-center justify-between text-body-sm font-semibold">
              <button
                type="button"
                onClick={() => {
                  setActiveSuiteTool('social-security');
                  window.scrollTo({ top: 400, behavior: 'smooth' });
                }}
                className="text-primary hover:underline flex items-center gap-1"
              >
                <span>Use on this page</span>
                <span className="material-symbols-outlined text-[15px]">north</span>
              </button>
              <Link href="/retirement-and-super" className="text-primary hover:underline flex items-center gap-0.5">
                <span>Super Suite</span>
                <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
              </Link>
            </div>
          </div>

          {/* Work Hours & Payroll */}
          <Link
            className="p-space-md rounded-xl bg-surface-container-lowest hover:bg-surface-container transition-all shadow-sm flex flex-col justify-between group border border-outline-variant/15"
            href="/work-hours-payroll-calculator"
          >
            <div className="flex items-start gap-space-sm">
              <div className="p-2 rounded-lg bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 shrink-0">
                <span className="material-symbols-outlined text-[22px]">hourglass_top</span>
              </div>
              <div className="space-y-1">
                <div className="font-body-md font-semibold text-on-surface group-hover:text-primary transition-colors">
                  Work Hours &amp; Payroll
                </div>
                <p className="text-body-sm font-body-sm text-on-surface-variant">
                  Calculate total remaining shifts, overtime thresholds, and bi-weekly wage earnings.
                </p>
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-outline-variant/10 flex items-center justify-between text-body-sm font-semibold text-primary">
              <span>Open Tool</span>
              <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
            </div>
          </Link>

          {/* Days Between Dates */}
          <Link
            className="p-space-md rounded-xl bg-surface-container-lowest hover:bg-surface-container transition-all shadow-sm flex flex-col justify-between group border border-outline-variant/15"
            href="/date-difference-calculator"
          >
            <div className="flex items-start gap-space-sm">
              <div className="p-2 rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 shrink-0">
                <span className="material-symbols-outlined text-[22px]">date_range</span>
              </div>
              <div className="space-y-1">
                <div className="font-body-md font-semibold text-on-surface group-hover:text-primary transition-colors">
                  Days Between Dates
                </div>
                <p className="text-body-sm font-body-sm text-on-surface-variant">
                  Count exact calendar days, weekends, and holidays between any custom start and end dates.
                </p>
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-outline-variant/10 flex items-center justify-between text-body-sm font-semibold text-primary">
              <span>Open Tool</span>
              <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
            </div>
          </Link>

          {/* Daily Wage & Pay Rate Converter */}
          <Link
            className="p-space-md rounded-xl bg-surface-container-lowest hover:bg-surface-container transition-all shadow-sm flex flex-col justify-between group border border-outline-variant/15"
            href="/daily-wage-calculator"
          >
            <div className="flex items-start gap-space-sm">
              <div className="p-2 rounded-lg bg-teal-100 text-teal-700 dark:bg-teal-950/80 dark:text-teal-300 shrink-0">
                <span className="material-symbols-outlined text-[22px]">payments</span>
              </div>
              <div className="space-y-1">
                <div className="font-body-md font-semibold text-on-surface group-hover:text-primary transition-colors">
                  Daily Wage Calculator
                </div>
                <p className="text-body-sm font-body-sm text-on-surface-variant">
                  Convert annual salary to daily rate and see exactly how much money each remaining workday earns.
                </p>
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-outline-variant/10 flex items-center justify-between text-body-sm font-semibold text-primary">
              <span>Open Tool</span>
              <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
            </div>
          </Link>

          {/* Event & Milestone Countdown */}
          <Link
            className="p-space-md rounded-xl bg-surface-container-lowest hover:bg-surface-container transition-all shadow-sm flex flex-col justify-between group border border-outline-variant/15"
            href="/countdown-timer"
          >
            <div className="flex items-start gap-space-sm">
              <div className="p-2 rounded-lg bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 shrink-0">
                <span className="material-symbols-outlined text-[22px]">timer</span>
              </div>
              <div className="space-y-1">
                <div className="font-body-md font-semibold text-on-surface group-hover:text-primary transition-colors">
                  Event &amp; Target Countdown
                </div>
                <p className="text-body-sm font-body-sm text-on-surface-variant">
                  Set live millisecond and second countdown timers for target celebration events and milestones.
                </p>
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-outline-variant/10 flex items-center justify-between text-body-sm font-semibold text-primary">
              <span>Open Tool</span>
              <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
            </div>
          </Link>

          {/* Comprehensive Tax & Net Income */}
          <Link
            className="p-space-md rounded-xl bg-surface-container-lowest hover:bg-surface-container transition-all shadow-sm flex flex-col justify-between group border border-outline-variant/15"
            href="/global-tax-calculator"
          >
            <div className="flex items-start gap-space-sm">
              <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 shrink-0">
                <span className="material-symbols-outlined text-[22px]">receipt_long</span>
              </div>
              <div className="space-y-1">
                <div className="font-body-md font-semibold text-on-surface group-hover:text-primary transition-colors">
                  Global Tax &amp; Withholding
                </div>
                <p className="text-body-sm font-body-sm text-on-surface-variant">
                  Estimate net take-home pay, state/federal income brackets, and terminal leave lump-sum taxation.
                </p>
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-outline-variant/10 flex items-center justify-between text-body-sm font-semibold text-primary">
              <span>Open Tool</span>
              <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
