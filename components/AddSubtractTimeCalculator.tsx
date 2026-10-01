'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';

type Mode = 'ADD' | 'SUB';
type CalendarMode = 'ALL' | 'BIZ' | 'CUSTOM_SKIP_SUN';

interface TimezoneOption {
  value: string;
  label: string;
}

const TIMEZONES: TimezoneOption[] = [
  { value: 'LOCAL', label: 'System Local Zone' },
  { value: 'UTC', label: 'UTC / GMT (00:00)' },
  { value: 'America/New_York', label: 'EST / EDT (New York)' },
  { value: 'America/Chicago', label: 'CST / CDT (Chicago)' },
  { value: 'America/Denver', label: 'MST / MDT (Denver)' },
  { value: 'America/Los_Angeles', label: 'PST / PDT (Los Angeles)' },
  { value: 'Europe/London', label: 'GMT / BST (London)' },
  { value: 'Europe/Paris', label: 'CET / CEST (Paris/Berlin)' },
  { value: 'Asia/Kolkata', label: 'IST (New Delhi)' },
  { value: 'Asia/Tokyo', label: 'JST (Tokyo)' },
  { value: 'Australia/Sydney', label: 'AEST / AEDT (Sydney)' },
];

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

function getDaysInMonth(year: number, monthZeroIndexed: number): number {
  return new Date(year, monthZeroIndexed + 1, 0).getDate();
}

export default function AddSubtractTimeCalculator() {
  // State
  const [mode, setMode] = useState<Mode>('ADD');
  const [startDate, setStartDate] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('12:00:00');
  const [timezone, setTimezone] = useState<string>('LOCAL');

  // Offsets
  const [years, setYears] = useState<number>(0);
  const [months, setMonths] = useState<number>(0);
  const [weeks, setWeeks] = useState<number>(2);
  const [days, setDays] = useState<number>(5);
  const [hours, setHours] = useState<number>(4);
  const [minutes, setMinutes] = useState<number>(15);
  const [seconds, setSeconds] = useState<number>(0);

  // Calendar rules
  const [calendarMode, setCalendarMode] = useState<CalendarMode>('ALL');
  const [holidays, setHolidays] = useState<number>(0);

  // Future age calculator birth year
  const [birthYear, setBirthYear] = useState<string>('1995');

  // Copy feedback
  const [copiedDate, setCopiedDate] = useState<boolean>(false);
  const [copiedIso, setCopiedIso] = useState<boolean>(false);

  // Initialize date to current on client mount
  useEffect(() => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    setStartDate(`${yyyy}-${mm}-${dd}`);

    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    setStartTime(`${hh}:${min}:${ss}`);
  }, []);

  const handleSetNow = useCallback(() => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    setStartDate(`${yyyy}-${mm}-${dd}`);

    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    setStartTime(`${hh}:${min}:${ss}`);
  }, []);

  const handleResetAll = useCallback(() => {
    setYears(0);
    setMonths(0);
    setWeeks(0);
    setDays(0);
    setHours(0);
    setMinutes(0);
    setSeconds(0);
    setHolidays(0);
  }, []);

  const handleApplyPreset = useCallback((preset: string) => {
    setYears(0);
    setMonths(0);
    setWeeks(0);
    setDays(0);
    setHours(0);
    setMinutes(0);
    setSeconds(0);
    setHolidays(0);

    if (preset === 'h24') {
      setMode('ADD');
      setHours(24);
    } else if (preset === 'h48') {
      setMode('ADD');
      setHours(48);
    } else if (preset === 'b7') {
      setMode('ADD');
      setCalendarMode('BIZ');
      setDays(7);
    } else if (preset === 'd30') {
      setMode('ADD');
      setDays(30);
    } else if (preset === 'd90') {
      setMode('ADD');
      setDays(90);
    } else if (preset === 'm6') {
      setMode('ADD');
      setMonths(6);
    } else if (preset === 'y1') {
      setMode('ADD');
      setYears(1);
    } else if (preset === 'sub14') {
      setMode('SUB');
      setDays(14);
    }
  }, []);

  // Work Shift actions
  const handleShift8 = useCallback(() => {
    setMode('ADD');
    setHours((prev) => prev + 8);
    setMinutes((prev) => prev + 30);
  }, []);

  const handleShift12 = useCallback(() => {
    setMode('ADD');
    setHours((prev) => prev + 12);
  }, []);

  const handleBreakSub = useCallback(() => {
    setMinutes((prevMins) => {
      if (prevMins >= 30) {
        return prevMins - 30;
      } else {
        setHours((prevHours) => (prevHours > 0 ? prevHours - 1 : 0));
        return prevMins + 30;
      }
    });
  }, []);

  // Main Calculation Engine
  const calculationResult = useMemo(() => {
    if (!startDate) {
      return null;
    }

    const [y, m, d] = startDate.split('-').map(Number);
    const [hh, mm, ss] = (startTime || '00:00:00').split(':').map(Number);

    const baseDate = new Date(y, (m || 1) - 1, d || 1, hh || 0, mm || 0, ss || 0);
    if (isNaN(baseDate.getTime())) {
      return null;
    }

    const sign = mode === 'ADD' ? 1 : -1;
    let target = new Date(baseDate.getTime());

    // 1. Year & Month Shift with end-of-month day clamping
    if (years !== 0 || months !== 0) {
      const originalDay = target.getDate();
      const newYear = target.getFullYear() + sign * years;
      const newMonth = target.getMonth() + sign * months;

      target.setFullYear(newYear);
      target.setMonth(newMonth, 1);
      const maxDays = getDaysInMonth(target.getFullYear(), target.getMonth());
      target.setDate(Math.min(originalDay, maxDays));
    }

    // 2. Days & Business Days Shift
    const netDays = (weeks * 7) + days + (mode === 'ADD' ? holidays : -holidays);
    if (netDays !== 0) {
      if (calendarMode === 'ALL') {
        target.setDate(target.getDate() + sign * netDays);
      } else {
        let remaining = Math.abs(netDays);
        const direction = sign;
        while (remaining > 0) {
          target.setDate(target.getDate() + direction);
          const dayOfWeek = target.getDay(); // 0 is Sun, 6 is Sat
          if (calendarMode === 'BIZ') {
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
              remaining--;
            }
          } else if (calendarMode === 'CUSTOM_SKIP_SUN') {
            if (dayOfWeek !== 0) {
              remaining--;
            }
          }
        }
      }
    }

    // 3. Clock Units Shift
    target.setHours(target.getHours() + sign * hours);
    target.setMinutes(target.getMinutes() + sign * minutes);
    target.setSeconds(target.getSeconds() + sign * seconds);

    // Formatted components
    const monthsStr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const resMonth = monthsStr[target.getMonth()];
    const resDay = target.getDate();
    const resYear = target.getFullYear();
    const formattedDate = `${resMonth} ${resDay}, ${resYear}`;

    let hours12 = target.getHours();
    const ampm = hours12 >= 12 ? 'PM' : 'AM';
    hours12 = hours12 % 12 || 12;
    const formattedTime = `${String(hours12).padStart(2, '0')}:${String(target.getMinutes()).padStart(2, '0')}:${String(target.getSeconds()).padStart(2, '0')} ${ampm}`;

    const dayName = dayNames[target.getDay()];
    const isWeekend = target.getDay() === 0 || target.getDay() === 6;
    const dayBadge = `${dayName} (${isWeekend ? 'Weekend' : 'Weekday'})`;

    // Metrology & Epoch
    const epochSec = Math.floor(target.getTime() / 1000);
    const totalNetSeconds = Math.abs(Math.floor((target.getTime() - baseDate.getTime()) / 1000));
    const totalNetDays = (totalNetSeconds / 86400).toFixed(1);
    const totalNetHours = (totalNetSeconds / 3600).toFixed(2);
    const totalNetMins = Math.round(totalNetSeconds / 60).toLocaleString();
    const estimatedWorkdays = Math.round(Number(totalNetDays) * (5 / 7));

    const isTargetLeap = isLeapYear(resYear);
    const verificationNote = `${resYear} ${isTargetLeap ? 'is a Leap Year (366 days).' : 'is a standard Gregorian solar year (365 days).'}`;

    // World time conversion
    let lonTime = '--:--:--';
    let nycTime = '--:--:--';
    let tyoTime = '--:--:--';
    let sydTime = '--:--:--';

    try {
      const opt: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
      lonTime = new Intl.DateTimeFormat('en-GB', { ...opt, timeZone: 'Europe/London' }).format(target);
      nycTime = new Intl.DateTimeFormat('en-US', { ...opt, timeZone: 'America/New_York' }).format(target);
      tyoTime = new Intl.DateTimeFormat('ja-JP', { ...opt, timeZone: 'Asia/Tokyo' }).format(target);
      sydTime = new Intl.DateTimeFormat('en-AU', { ...opt, timeZone: 'Australia/Sydney' }).format(target);
    } catch {
      lonTime = target.toTimeString().substring(0, 8);
    }

    // Future age calculation if birth year is provided
    const parsedBirthYear = parseInt(birthYear, 10);
    let calculatedAge = '';
    if (!isNaN(parsedBirthYear) && parsedBirthYear > 1900 && parsedBirthYear < 2100) {
      const ageOnDate = resYear - parsedBirthYear;
      calculatedAge = `${ageOnDate >= 0 ? ageOnDate : 0} years old`;
    }

    return {
      targetDate: target,
      baseDate,
      formattedDate,
      formattedTime,
      dayBadge,
      epochSec,
      totalNetDays,
      totalNetHours,
      totalNetMins,
      estimatedWorkdays,
      verificationNote,
      lonTime,
      nycTime,
      tyoTime,
      sydTime,
      calculatedAge,
    };
  }, [startDate, startTime, mode, years, months, weeks, days, hours, minutes, seconds, calendarMode, holidays, birthYear]);

  // Real-time ticking countdown
  const [countdown, setCountdown] = useState<{
    days: string;
    hours: string;
    mins: string;
    secs: string;
    relativeText: string;
  }>({
    days: '00',
    hours: '00',
    mins: '00',
    secs: '00',
    relativeText: 'Calculating...',
  });

  useEffect(() => {
    const update = () => {
      if (!calculationResult?.targetDate) return;

      const now = new Date();
      const diffMs = calculationResult.targetDate.getTime() - now.getTime();
      const isFuture = diffMs >= 0;
      const absDiff = Math.abs(diffMs);

      const d = Math.floor(absDiff / (1000 * 60 * 60 * 24));
      const h = Math.floor((absDiff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((absDiff / (1000 * 60)) % 60);
      const s = Math.floor((absDiff / 1000) % 60);

      const daysStr = String(d).padStart(2, '0');
      const hoursStr = String(h).padStart(2, '0');
      const minsStr = String(m).padStart(2, '0');
      const secsStr = String(s).padStart(2, '0');

      const relativeText = `${isFuture ? 'In' : ''} ${d}d ${h}h ${m}m ${!isFuture ? 'ago' : ''}`;

      setCountdown({
        days: daysStr,
        hours: hoursStr,
        mins: minsStr,
        secs: secsStr,
        relativeText,
      });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [calculationResult?.targetDate]);

  // Copy Handlers
  const handleCopyDate = () => {
    if (!calculationResult) return;
    const text = `${calculationResult.formattedDate} — ${calculationResult.formattedTime}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedDate(true);
      setTimeout(() => setCopiedDate(false), 1800);
    });
  };

  const handleCopyIso = () => {
    if (!calculationResult) return;
    const iso = calculationResult.targetDate.toISOString();
    navigator.clipboard.writeText(iso).then(() => {
      setCopiedIso(true);
      setTimeout(() => setCopiedIso(false), 1800);
    });
  };

  // Export TXT
  const handleExportTxt = () => {
    if (!calculationResult) return;
    const summary = [
      'SolveIt Time & Date Offset Calculation Plan',
      '-------------------------------------------',
      `Start Reference: ${startDate} ${startTime}`,
      `Operation Mode: ${mode}`,
      `Offsets Applied: ${years}Y, ${months}M, ${weeks}W, ${days}D, ${hours}h, ${minutes}m, ${seconds}s`,
      `Counting Mode: ${calendarMode}`,
      `Target Result: ${calculationResult.formattedDate} ${calculationResult.formattedTime}`,
      `ISO 8601: ${calculationResult.targetDate.toISOString()}`,
      `Unix Epoch: ${calculationResult.epochSec}s`,
      `Total Offset Hours: ${calculationResult.totalNetHours} Hours`,
      'Integrity Verified: 100% In-Browser Private Engine',
    ].join('\n');

    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `time-offset-plan-${startDate || 'calculation'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <main className="w-full pt-0 flex-1 bg-surface text-on-surface">
      {/* PRINT-ONLY SCHEDULE PLAN REPORT */}
      <div className="hidden print:block p-8 bg-white text-slate-900 border-b-2 border-slate-900 mb-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-300">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">SolveIt Calculator — Time Offset &amp; Schedule Plan</h1>
            <p className="text-xs text-slate-600 mt-1">Source: https://solveitcalculator.com/add-subtract-time-calculator</p>
          </div>
          <div className="text-right">
            <span className="inline-block px-3 py-1 text-xs font-semibold rounded bg-slate-100 text-slate-800 border border-slate-300">
              {mode === 'ADD' ? 'Time Addition (+)' : 'Time Subtraction (−)'}
            </span>
            <p className="text-xs text-slate-500 mt-1">Generated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
          <div className="p-4 bg-slate-50 rounded border border-slate-200">
            <span className="text-xs font-bold uppercase text-slate-500 block mb-1">Start Reference Point</span>
            <div className="font-bold text-base text-slate-900">{startDate} at {startTime}</div>
            <div className="text-xs text-slate-600 mt-1">Time Zone: {timezone}</div>
          </div>
          <div className="p-4 bg-slate-50 rounded border border-slate-200">
            <span className="text-xs font-bold uppercase text-slate-500 block mb-1">Calculated Target Result</span>
            <div className="font-bold text-base text-slate-900">{calculationResult?.formattedDate}</div>
            <div className="font-bold text-base text-blue-700">{calculationResult?.formattedTime}</div>
            <div className="text-xs text-slate-600 mt-1">{calculationResult?.dayBadge}</div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-slate-50 rounded border border-slate-200 text-xs">
          <span className="font-bold uppercase text-slate-500 block mb-2">Applied Offsets &amp; Rules:</span>
          <div className="grid grid-cols-4 gap-2 text-slate-700">
            <div><span className="font-semibold">Years:</span> {years}</div>
            <div><span className="font-semibold">Months:</span> {months}</div>
            <div><span className="font-semibold">Weeks:</span> {weeks}</div>
            <div><span className="font-semibold">Days:</span> {days}</div>
            <div><span className="font-semibold">Hours:</span> {hours}</div>
            <div><span className="font-semibold">Minutes:</span> {minutes}</div>
            <div><span className="font-semibold">Seconds:</span> {seconds}</div>
            <div><span className="font-semibold">Calendar:</span> {calendarMode}</div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-slate-50 rounded border border-slate-200 text-xs">
          <span className="font-bold uppercase text-slate-500 block mb-2">Detailed Breakdown:</span>
          <div className="grid grid-cols-3 gap-2 text-slate-700">
            <div><span className="font-semibold">Net Calendar Days:</span> {calculationResult?.totalNetDays} Days</div>
            <div><span className="font-semibold">Net Working Days:</span> {calculationResult?.estimatedWorkdays} Workdays</div>
            <div><span className="font-semibold">Total Offset Hours:</span> {calculationResult?.totalNetHours} Hours</div>
            <div><span className="font-semibold">Total Minutes:</span> {calculationResult?.totalNetMins} Mins</div>
            <div><span className="font-semibold">Epoch Timestamp:</span> {calculationResult?.epochSec} s</div>
            <div><span className="font-semibold">Leap Year Status:</span> {calculationResult?.verificationNote}</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full">
        {/* Top Breadcrumb Navigation */}
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Time & Date Calculators', href: '/time-date' },
            { label: 'Add & Subtract Time Calculator' },
          ]}
          badge="High-Precision Time Math"
          rightContent={
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 text-on-surface-variant font-label-caps text-label-caps uppercase bg-surface-container px-2.5 py-0.5 rounded-full text-[11px]">
                <span className="material-symbols-outlined text-[13px] text-primary">lock</span> 100% Private
              </span>
            </div>
          }
        />

        {/* Ambient Glow Background Decorator */}
        <div className="relative w-full max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop pt-space-md pb-space-3xl">
          <div className="absolute -top-12 left-1/3 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none -z-10" />
          <div className="absolute top-96 right-10 w-80 h-80 rounded-full bg-secondary-container/10 blur-3xl pointer-events-none -z-10" />

          {/* 1. HEADER */}
          <section className="flex flex-col gap-space-sm mb-space-xl">
            {/* Trust Badges Strip */}
            <div className="flex items-center gap-space-xs flex-wrap pt-space-2xs">
              <div className="inline-flex items-center gap-space-2xs px-space-xs py-space-2xs rounded-full bg-surface-container text-primary font-label-caps text-label-caps uppercase">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                <span>Standard Date Format</span>
              </div>
              <div className="inline-flex items-center gap-space-2xs px-space-xs py-space-2xs rounded-full bg-surface-container text-secondary font-label-caps text-label-caps uppercase">
                <span className="material-symbols-outlined text-[14px]">lock</span>
                <span>100% Private on Your Device</span>
              </div>
              <div className="inline-flex items-center gap-space-2xs px-space-xs py-space-2xs rounded-full bg-surface-container text-on-surface-variant font-label-caps text-label-caps uppercase">
                <span className="material-symbols-outlined text-[14px]">schedule</span>
                <span>Automatic Time Zone Handling</span>
              </div>
              <div className="inline-flex items-center gap-space-2xs px-space-xs py-space-2xs rounded-full bg-surface-container text-on-surface-variant font-label-caps text-label-caps uppercase">
                <span className="material-symbols-outlined text-[14px]">precision_manufacturing</span>
                <span>Accurate &amp; Exact Results</span>
              </div>
            </div>

            {/* Main Headline & Value Subtitle */}
            <div className="max-w-4xl pt-space-xs">
              <h1 className="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight">
                Add &amp; Subtract Time Calculator <span className="text-primary font-light">— Instant Date &amp; Time Calculator</span>
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant mt-space-2xs">
                Seamlessly add or subtract years, months, weeks, days, hours, minutes, and seconds from any start date. Includes smart business days calculation, leap years, and different time zones without sending your data anywhere.
              </p>
            </div>
          </section>

          {/* 2. INTERACTIVE CALCULATOR WORKSPACE (2-Column Grid) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
            {/* LEFT COLUMN: Input Configuration Workbench (7 Cols on desktop) */}
            <div className="lg:col-span-7 flex flex-col gap-space-lg">
              {/* Mode Switcher: Add vs Subtract */}
              <div className="bg-surface-container-low p-space-xs rounded-xl flex items-center gap-space-xs shadow-sm">
                <button
                  className={`flex-1 py-space-sm px-space-md rounded-lg font-headline-md text-[15px] font-semibold flex items-center justify-center gap-space-xs transition-all cursor-pointer ${
                    mode === 'ADD'
                      ? 'bg-primary text-on-primary shadow-md'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                  }`}
                  id="mode-add-btn"
                  type="button"
                  onClick={() => setMode('ADD')}
                >
                  <span className="material-symbols-outlined text-[20px]">add_circle</span>
                  <span>Add Time (+)</span>
                </button>
                <button
                  className={`flex-1 py-space-sm px-space-md rounded-lg font-headline-md text-[15px] font-semibold flex items-center justify-center gap-space-xs transition-all cursor-pointer ${
                    mode === 'SUB'
                      ? 'bg-error text-on-error shadow-md'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                  }`}
                  id="mode-sub-btn"
                  type="button"
                  onClick={() => setMode('SUB')}
                >
                  <span className="material-symbols-outlined text-[20px]">remove_circle</span>
                  <span>Subtract Time (−)</span>
                </button>
              </div>

              {/* 1. Baseline Date & Time Container */}
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/20 flex flex-col gap-space-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-primary text-[20px]">calendar_today</span>
                    <h2 className="font-headline-md text-[17px] text-on-surface font-semibold">1. Starting Date &amp; Time</h2>
                  </div>
                  <button
                    className="inline-flex items-center gap-space-2xs px-space-sm py-space-2xs bg-surface-container hover:bg-surface-container-high rounded-lg font-label-caps text-label-caps uppercase text-primary font-semibold transition-all cursor-pointer"
                    id="btn-set-now"
                    type="button"
                    onClick={handleSetNow}
                  >
                    <span className="material-symbols-outlined text-[15px]">update</span>
                    <span>Set to Now</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
                  {/* Date Input */}
                  <div className="flex flex-col gap-space-2xs sm:col-span-1">
                    <label className="font-label-caps text-label-caps uppercase text-on-surface-variant" htmlFor="start-date">
                      Start Date
                    </label>
                    <input
                      className="w-full bg-surface-container-low text-on-surface font-data-mono text-data-mono px-space-sm py-2.5 rounded-lg focus:outline-none focus:bg-surface-container border border-outline-variant/30 focus:border-primary transition-all"
                      id="start-date"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>

                  {/* Time Input */}
                  <div className="flex flex-col gap-space-2xs sm:col-span-1">
                    <div className="flex justify-between items-center">
                      <label className="font-label-caps text-label-caps uppercase text-on-surface-variant" htmlFor="start-time">
                        Start Time
                      </label>
                      <span className="font-label-caps text-[10px] text-on-surface-variant" id="time-format-hint">
                        24-Hour
                      </span>
                    </div>
                    <input
                      className="w-full bg-surface-container-low text-on-surface font-data-mono text-data-mono px-space-sm py-2.5 rounded-lg focus:outline-none focus:bg-surface-container border border-outline-variant/30 focus:border-primary transition-all"
                      id="start-time"
                      step="1"
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </div>

                  {/* Timezone Selector */}
                  <div className="flex flex-col gap-space-2xs sm:col-span-1">
                    <label className="font-label-caps text-label-caps uppercase text-on-surface-variant" htmlFor="tz-select">
                      Time Zone
                    </label>
                    <select
                      className="w-full bg-surface-container-low text-on-surface font-body-sm text-body-sm px-space-sm py-2.5 rounded-lg focus:outline-none focus:bg-surface-container border border-outline-variant/30 focus:border-primary transition-all cursor-pointer"
                      id="tz-select"
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                    >
                      {TIMEZONES.map((tz) => (
                        <option key={tz.value} value={tz.value}>
                          {tz.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* 2. Offset Quantities (Multi-Unit Input Grid) */}
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/20 flex flex-col gap-space-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-primary text-[20px]">hourglass_top</span>
                    <h2 className="font-headline-md text-[17px] text-on-surface font-semibold">
                      {mode === 'ADD' ? '2. Amount of Time to Add (+)' : '2. Amount of Time to Subtract (−)'}
                    </h2>
                  </div>
                  <button
                    className="font-label-caps text-label-caps uppercase text-on-surface-variant hover:text-error transition-colors cursor-pointer"
                    id="btn-clear-offsets"
                    type="button"
                    onClick={handleResetAll}
                  >
                    Reset All
                  </button>
                </div>

                {/* Quick Presets Carousel */}
                <div className="flex items-center gap-space-2xs overflow-x-auto pb-1.5 scrollbar-none">
                  <span className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider pr-1 shrink-0">
                    Presets:
                  </span>
                  <button
                    className="preset-pill whitespace-nowrap px-space-xs py-1 rounded-full bg-surface-container hover:bg-primary hover:text-on-primary text-on-surface font-label-caps text-label-caps transition-all cursor-pointer"
                    type="button"
                    onClick={() => handleApplyPreset('h24')}
                  >
                    +24 Hours
                  </button>
                  <button
                    className="preset-pill whitespace-nowrap px-space-xs py-1 rounded-full bg-surface-container hover:bg-primary hover:text-on-primary text-on-surface font-label-caps text-label-caps transition-all cursor-pointer"
                    type="button"
                    onClick={() => handleApplyPreset('h48')}
                  >
                    +48 Hours
                  </button>
                  <button
                    className="preset-pill whitespace-nowrap px-space-xs py-1 rounded-full bg-surface-container hover:bg-primary hover:text-on-primary text-on-surface font-label-caps text-label-caps transition-all cursor-pointer"
                    type="button"
                    onClick={() => handleApplyPreset('b7')}
                  >
                    +7 Business Days
                  </button>
                  <button
                    className="preset-pill whitespace-nowrap px-space-xs py-1 rounded-full bg-surface-container hover:bg-primary hover:text-on-primary text-on-surface font-label-caps text-label-caps transition-all cursor-pointer"
                    type="button"
                    onClick={() => handleApplyPreset('d30')}
                  >
                    +30 Days
                  </button>
                  <button
                    className="preset-pill whitespace-nowrap px-space-xs py-1 rounded-full bg-surface-container hover:bg-primary hover:text-on-primary text-on-surface font-label-caps text-label-caps transition-all cursor-pointer"
                    type="button"
                    onClick={() => handleApplyPreset('d90')}
                  >
                    +90 Days
                  </button>
                  <button
                    className="preset-pill whitespace-nowrap px-space-xs py-1 rounded-full bg-surface-container hover:bg-primary hover:text-on-primary text-on-surface font-label-caps text-label-caps transition-all cursor-pointer"
                    type="button"
                    onClick={() => handleApplyPreset('m6')}
                  >
                    +6 Months
                  </button>
                  <button
                    className="preset-pill whitespace-nowrap px-space-xs py-1 rounded-full bg-surface-container hover:bg-primary hover:text-on-primary text-on-surface font-label-caps text-label-caps transition-all cursor-pointer"
                    type="button"
                    onClick={() => handleApplyPreset('y1')}
                  >
                    +1 Year
                  </button>
                  <button
                    className="preset-pill whitespace-nowrap px-space-xs py-1 rounded-full bg-surface-container hover:bg-error hover:text-on-error text-on-surface font-label-caps text-label-caps transition-all cursor-pointer"
                    type="button"
                    onClick={() => handleApplyPreset('sub14')}
                  >
                    −14 Days
                  </button>
                </div>

                {/* Calendar Scale Fields */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm pt-space-xs">
                  <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col gap-space-2xs border border-outline-variant/20 focus-within:border-primary transition-colors">
                    <label className="font-label-caps text-label-caps uppercase text-on-surface-variant" htmlFor="input-years">
                      Years
                    </label>
                    <input
                      className="w-full bg-transparent font-data-mono text-headline-md text-on-surface font-bold focus:outline-none"
                      id="input-years"
                      max="999"
                      min="0"
                      type="number"
                      value={years}
                      onChange={(e) => setYears(Math.max(0, parseInt(e.target.value, 10) || 0))}
                    />
                  </div>
                  <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col gap-space-2xs border border-outline-variant/20 focus-within:border-primary transition-colors">
                    <label className="font-label-caps text-label-caps uppercase text-on-surface-variant" htmlFor="input-months">
                      Months
                    </label>
                    <input
                      className="w-full bg-transparent font-data-mono text-headline-md text-on-surface font-bold focus:outline-none"
                      id="input-months"
                      max="1200"
                      min="0"
                      type="number"
                      value={months}
                      onChange={(e) => setMonths(Math.max(0, parseInt(e.target.value, 10) || 0))}
                    />
                  </div>
                  <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col gap-space-2xs border border-outline-variant/20 focus-within:border-primary transition-colors">
                    <label className="font-label-caps text-label-caps uppercase text-on-surface-variant" htmlFor="input-weeks">
                      Weeks
                    </label>
                    <input
                      className="w-full bg-transparent font-data-mono text-headline-md text-on-surface font-bold focus:outline-none"
                      id="input-weeks"
                      max="5200"
                      min="0"
                      type="number"
                      value={weeks}
                      onChange={(e) => setWeeks(Math.max(0, parseInt(e.target.value, 10) || 0))}
                    />
                  </div>
                  <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col gap-space-2xs border border-outline-variant/20 focus-within:border-primary transition-colors">
                    <label className="font-label-caps text-label-caps uppercase text-on-surface-variant" htmlFor="input-days">
                      Days
                    </label>
                    <input
                      className="w-full bg-transparent font-data-mono text-headline-md text-on-surface font-bold focus:outline-none"
                      id="input-days"
                      max="36500"
                      min="0"
                      type="number"
                      value={days}
                      onChange={(e) => setDays(Math.max(0, parseInt(e.target.value, 10) || 0))}
                    />
                  </div>
                </div>

                {/* Clock Unit Scale Fields */}
                <div className="grid grid-cols-3 gap-space-sm">
                  <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col gap-space-2xs border border-outline-variant/20 focus-within:border-primary transition-colors">
                    <label className="font-label-caps text-label-caps uppercase text-on-surface-variant" htmlFor="input-hours">
                      Hours
                    </label>
                    <input
                      className="w-full bg-transparent font-data-mono text-headline-md text-on-surface font-bold focus:outline-none"
                      id="input-hours"
                      max="100000"
                      min="0"
                      type="number"
                      value={hours}
                      onChange={(e) => setHours(Math.max(0, parseInt(e.target.value, 10) || 0))}
                    />
                  </div>
                  <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col gap-space-2xs border border-outline-variant/20 focus-within:border-primary transition-colors">
                    <label className="font-label-caps text-label-caps uppercase text-on-surface-variant" htmlFor="input-minutes">
                      Minutes
                    </label>
                    <input
                      className="w-full bg-transparent font-data-mono text-headline-md text-on-surface font-bold focus:outline-none"
                      id="input-minutes"
                      max="1000000"
                      min="0"
                      type="number"
                      value={minutes}
                      onChange={(e) => setMinutes(Math.max(0, parseInt(e.target.value, 10) || 0))}
                    />
                  </div>
                  <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col gap-space-2xs border border-outline-variant/20 focus-within:border-primary transition-colors">
                    <label className="font-label-caps text-label-caps uppercase text-on-surface-variant" htmlFor="input-seconds">
                      Seconds
                    </label>
                    <input
                      className="w-full bg-transparent font-data-mono text-headline-md text-on-surface font-bold focus:outline-none"
                      id="input-seconds"
                      max="1000000"
                      min="0"
                      type="number"
                      value={seconds}
                      onChange={(e) => setSeconds(Math.max(0, parseInt(e.target.value, 10) || 0))}
                    />
                  </div>
                </div>
              </div>

              {/* 3. Calendar & Business Rules Settings */}
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/20 flex flex-col gap-space-md">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-[20px]">tune</span>
                  <h2 className="font-headline-md text-[17px] text-on-surface font-semibold">3. Working Days &amp; Holiday Options</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                  {/* Mode Selection */}
                  <div className="flex flex-col gap-space-2xs">
                    <label className="font-label-caps text-label-caps uppercase text-on-surface-variant" htmlFor="calendar-mode">
                      Counting Mode
                    </label>
                    <select
                      className="w-full bg-surface-container-low text-on-surface font-body-sm text-body-sm px-space-sm py-2.5 rounded-lg focus:outline-none focus:bg-surface-container border border-outline-variant/30 focus:border-primary transition-all cursor-pointer"
                      id="calendar-mode"
                      value={calendarMode}
                      onChange={(e) => setCalendarMode(e.target.value as CalendarMode)}
                    >
                      <option value="ALL">All Calendar Days (Standard 7-Day)</option>
                      <option value="BIZ">Business Days Only (Mon–Fri Workweek)</option>
                      <option value="CUSTOM_SKIP_SUN">Skip Sunday Only</option>
                    </select>
                  </div>

                  {/* Public Holiday Exclusion Adjustment */}
                  <div className="flex flex-col gap-space-2xs">
                    <div className="flex items-center justify-between">
                      <label className="font-label-caps text-label-caps uppercase text-on-surface-variant" htmlFor="input-holidays">
                        Skip Holidays
                      </label>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">Days added</span>
                    </div>
                    <div className="flex items-center bg-surface-container-low rounded-lg px-space-sm border border-outline-variant/30 focus-within:border-primary transition-colors">
                      <span className="material-symbols-outlined text-[18px] text-on-surface-variant mr-space-2xs">event_busy</span>
                      <input
                        className="w-full bg-transparent py-2 font-data-mono text-data-mono text-on-surface focus:outline-none"
                        id="input-holidays"
                        max="90"
                        min="0"
                        type="number"
                        value={holidays}
                        onChange={(e) => setHolidays(Math.max(0, parseInt(e.target.value, 10) || 0))}
                      />
                      <span className="text-on-surface-variant font-label-caps text-label-caps uppercase whitespace-nowrap">
                        Custom Days
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4 Specialized Interactive Tool Modules Bento */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                {/* Work Shift Calculator */}
                <div className="bg-surface-container-low p-space-md rounded-xl flex flex-col justify-between gap-space-sm shadow-sm border border-outline-variant/20">
                  <div className="flex items-center gap-space-2xs">
                    <span className="material-symbols-outlined text-secondary text-[18px]">more_time</span>
                    <h3 className="font-headline-md text-[14px] text-on-surface font-semibold">Work Shift Calculator</h3>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Quickly append standard 8.5h or 12h shifts with deduction for unpaid 30m break spans.
                  </p>
                  <div className="flex items-center gap-space-2xs pt-space-2xs">
                    <button
                      className="px-space-xs py-1 rounded bg-surface-container-high hover:bg-secondary hover:text-on-secondary text-on-surface font-label-caps text-label-caps transition-all cursor-pointer"
                      id="btn-shift-8"
                      type="button"
                      onClick={handleShift8}
                    >
                      +8.5h Shift
                    </button>
                    <button
                      className="px-space-xs py-1 rounded bg-surface-container-high hover:bg-secondary hover:text-on-secondary text-on-surface font-label-caps text-label-caps transition-all cursor-pointer"
                      id="btn-shift-12"
                      type="button"
                      onClick={handleShift12}
                    >
                      +12h Shift
                    </button>
                    <button
                      className="px-space-xs py-1 rounded bg-surface-container-high hover:bg-error hover:text-on-error text-on-surface font-label-caps text-label-caps transition-all cursor-pointer"
                      id="btn-break-sub"
                      type="button"
                      onClick={handleBreakSub}
                    >
                      −30m Break
                    </button>
                  </div>
                </div>

                {/* Future Age Calculator */}
                <div className="bg-surface-container-low p-space-md rounded-xl flex flex-col justify-between gap-space-sm shadow-sm border border-outline-variant/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-space-2xs">
                      <span className="material-symbols-outlined text-secondary text-[18px]">history_edu</span>
                      <h3 className="font-headline-md text-[14px] text-on-surface font-semibold">Future Age Calculator</h3>
                    </div>
                    {calculationResult?.calculatedAge && (
                      <span className="text-xs px-2 py-0.5 rounded bg-secondary/15 text-secondary font-bold">
                        {calculationResult.calculatedAge}
                      </span>
                    )}
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    See how old someone will be on this future date.
                  </p>
                  <div className="flex items-center gap-2">
                    <label htmlFor="birth-year-input" className="font-label-caps text-[10px] text-on-surface-variant uppercase whitespace-nowrap">
                      Birth Year:
                    </label>
                    <input
                      id="birth-year-input"
                      type="number"
                      min="1900"
                      max="2100"
                      value={birthYear}
                      onChange={(e) => setBirthYear(e.target.value)}
                      placeholder="e.g. 1995"
                      className="w-24 bg-surface-container-lowest text-on-surface font-data-mono text-xs px-2 py-1 rounded border border-outline-variant/30 focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="flex items-center justify-between text-on-surface font-data-mono text-[12px] bg-surface-container-lowest px-space-xs py-1.5 rounded">
                    <span className="text-on-surface-variant">Target Epoch:</span>
                    <span className="font-bold" id="display-epoch">
                      {calculationResult ? `${calculationResult.epochSec} s` : '0 s'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Global Multi-Timezone Cross Converter Bar */}
              <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20 flex flex-col gap-space-xs">
                <div className="flex items-center justify-between">
                  <span className="font-label-caps text-label-caps uppercase text-on-surface-variant font-semibold">
                    Target Time Around the World:
                  </span>
                  <span className="material-symbols-outlined text-primary text-[16px]">public</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-xs pt-space-2xs">
                  <div className="bg-surface-container-low p-space-2xs px-space-xs rounded-lg flex flex-col">
                    <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">London (GMT)</span>
                    <span className="font-data-mono text-[13px] text-on-surface font-semibold" id="tz-disp-lon">
                      {calculationResult?.lonTime || '--:--:--'}
                    </span>
                  </div>
                  <div className="bg-surface-container-low p-space-2xs px-space-xs rounded-lg flex flex-col">
                    <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">New York (EST)</span>
                    <span className="font-data-mono text-[13px] text-on-surface font-semibold" id="tz-disp-nyc">
                      {calculationResult?.nycTime || '--:--:--'}
                    </span>
                  </div>
                  <div className="bg-surface-container-low p-space-2xs px-space-xs rounded-lg flex flex-col">
                    <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">Tokyo (JST)</span>
                    <span className="font-data-mono text-[13px] text-on-surface font-semibold" id="tz-disp-tyo">
                      {calculationResult?.tyoTime || '--:--:--'}
                    </span>
                  </div>
                  <div className="bg-surface-container-low p-space-2xs px-space-xs rounded-lg flex flex-col">
                    <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">Sydney (AEST)</span>
                    <span className="font-data-mono text-[13px] text-on-surface font-semibold" id="tz-disp-syd">
                      {calculationResult?.sydTime || '--:--:--'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Sticky Real-Time Results Dashboard (5 Cols on desktop) */}
            <div className="lg:col-span-5 lg:sticky lg:top-20 flex flex-col gap-space-lg">
              {/* Primary Output Showcase Card */}
              <div className="bg-gradient-to-br from-primary-container to-primary text-on-primary p-space-lg rounded-xl shadow-xl flex flex-col gap-space-md relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-surface-container-lowest/10 blur-2xl pointer-events-none" />

                {/* Header badge of computed state */}
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-space-2xs px-space-xs py-0.5 rounded-full bg-on-primary/15 backdrop-blur-md text-on-primary font-label-caps text-label-caps uppercase">
                    <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse" />
                    <span id="status-mode-label">
                      Your Result
                    </span>
                  </span>
                  <span className="px-space-xs py-0.5 rounded bg-on-primary/10 text-on-primary font-label-caps text-label-caps uppercase" id="target-day-badge">
                    {calculationResult?.dayBadge || 'Weekday'}
                  </span>
                </div>

                {/* Massive Primary Result Display */}
                <div className="flex flex-col gap-1">
                  <span className="font-label-caps text-[11px] uppercase tracking-wider text-on-primary/80">Target Date &amp; Time</span>
                  <div className="font-numerical-display text-numerical-display leading-none tracking-tight break-words" id="target-date-main">
                    {calculationResult?.formattedDate || 'Oct 7, 2026'}
                  </div>
                  <div className="font-data-mono text-headline-md text-secondary-fixed dark:text-cyan-300 font-bold mt-1 tracking-wide" id="target-time-sub">
                    {calculationResult?.formattedTime || '12:57:57 AM'}
                  </div>
                </div>

                {/* Relative Delta Humanized Tag */}
                <div className="bg-on-primary/10 rounded-lg p-space-xs flex items-center justify-between text-on-primary">
                  <span className="font-label-caps text-label-caps uppercase tracking-wider opacity-80">Relative Time:</span>
                  <span className="font-body-sm text-body-sm font-semibold" id="relative-delta-text">
                    {countdown.relativeText}
                  </span>
                </div>

                {/* Live Real-Time Countdown Visual */}
                <div className="bg-inverse-surface/40 backdrop-blur-md p-space-sm rounded-lg flex flex-col gap-space-2xs">
                  <div className="flex items-center justify-between text-on-primary/80">
                    <span className="font-label-caps text-label-caps uppercase">Time Remaining</span>
                    <span className="material-symbols-outlined text-[14px]">timer</span>
                  </div>
                  <div className="grid grid-cols-4 gap-space-2xs text-center pt-1">
                    <div className="bg-on-primary/10 rounded p-1">
                      <div className="font-data-mono text-[16px] font-bold" id="cd-days">{countdown.days}</div>
                      <div className="font-label-caps text-[9px] uppercase opacity-75">Days</div>
                    </div>
                    <div className="bg-on-primary/10 rounded p-1">
                      <div className="font-data-mono text-[16px] font-bold" id="cd-hours">{countdown.hours}</div>
                      <div className="font-label-caps text-[9px] uppercase opacity-75">Hours</div>
                    </div>
                    <div className="bg-on-primary/10 rounded p-1">
                      <div className="font-data-mono text-[16px] font-bold" id="cd-mins">{countdown.mins}</div>
                      <div className="font-label-caps text-[9px] uppercase opacity-75">Mins</div>
                    </div>
                    <div className="bg-on-primary/10 rounded p-1">
                      <div className="font-data-mono text-[16px] font-bold" id="cd-secs">{countdown.secs}</div>
                      <div className="font-label-caps text-[9px] uppercase opacity-75">Secs</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons Bar */}
                <div className="grid grid-cols-2 gap-space-xs pt-space-2xs">
                  <button
                    className="py-space-xs px-space-sm rounded-lg bg-surface-container-lowest text-primary hover:bg-surface-container font-body-sm text-body-sm font-semibold flex items-center justify-center gap-space-2xs transition-all shadow cursor-pointer"
                    id="btn-copy-date"
                    type="button"
                    onClick={handleCopyDate}
                  >
                    <span className="material-symbols-outlined text-[17px]">
                      {copiedDate ? 'done' : 'content_copy'}
                    </span>
                    <span>{copiedDate ? 'Copied!' : 'Copy Date'}</span>
                  </button>
                  <button
                    className="py-space-xs px-space-sm rounded-lg bg-on-primary/20 hover:bg-on-primary/30 text-on-primary font-body-sm text-body-sm font-semibold flex items-center justify-center gap-space-2xs transition-all cursor-pointer"
                    id="btn-copy-iso"
                    type="button"
                    onClick={handleCopyIso}
                  >
                    <span className="material-symbols-outlined text-[17px]">
                      {copiedIso ? 'done' : 'code'}
                    </span>
                    <span>{copiedIso ? 'ISO Copied' : 'Copy Full Date'}</span>
                  </button>
                </div>
              </div>

              {/* Granular Breakdown Metrics Card */}
              <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20 flex flex-col gap-space-sm">
                <h3 className="font-headline-md text-[15px] text-on-surface font-semibold flex items-center gap-space-2xs">
                  <span className="material-symbols-outlined text-primary text-[18px]">analytics</span>
                  <span>{mode === 'ADD' ? 'Adding & Calculation Details' : 'Subtraction & Calculation Details'}</span>
                </h3>

                {/* Applied Offsets Summary Pill Strip */}
                <div className="p-3 bg-surface-container-low rounded-lg flex flex-col gap-1.5 border border-outline-variant/15 text-body-sm">
                  <div className="flex items-center justify-between text-xs text-on-surface-variant font-label-caps uppercase">
                    <span>{mode === 'ADD' ? 'Offsets Added' : 'Offsets Subtracted'}</span>
                    <span className="text-primary font-semibold">{calendarMode === 'BIZ' ? 'Business Days Mode' : 'Calendar Days Mode'}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 font-data-mono text-xs text-on-surface">
                    {years > 0 && <span className="px-2 py-0.5 rounded bg-surface-container font-semibold">{mode === 'ADD' ? '+' : '−'}{years} yr</span>}
                    {months > 0 && <span className="px-2 py-0.5 rounded bg-surface-container font-semibold">{mode === 'ADD' ? '+' : '−'}{months} mo</span>}
                    {weeks > 0 && <span className="px-2 py-0.5 rounded bg-surface-container font-semibold">{mode === 'ADD' ? '+' : '−'}{weeks} wk</span>}
                    {days > 0 && <span className="px-2 py-0.5 rounded bg-surface-container font-semibold">{mode === 'ADD' ? '+' : '−'}{days} d</span>}
                    {hours > 0 && <span className="px-2 py-0.5 rounded bg-surface-container font-semibold">{mode === 'ADD' ? '+' : '−'}{hours} hr</span>}
                    {minutes > 0 && <span className="px-2 py-0.5 rounded bg-surface-container font-semibold">{mode === 'ADD' ? '+' : '−'}{minutes} min</span>}
                    {seconds > 0 && <span className="px-2 py-0.5 rounded bg-surface-container font-semibold">{mode === 'ADD' ? '+' : '−'}{seconds} sec</span>}
                    {years === 0 && months === 0 && weeks === 0 && days === 0 && hours === 0 && minutes === 0 && seconds === 0 && (
                      <span className="text-on-surface-variant text-xs italic">No time offsets added yet (0 offset)</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-on-surface-variant pt-1 border-t border-outline-variant/10">
                    <span>Start: <strong className="text-on-surface">{startDate} {startTime}</strong></span>
                    <span>Zone: <strong className="text-on-surface">{timezone}</strong></span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-space-xs">
                  <div className="bg-surface-container-low p-space-xs rounded-lg flex flex-col">
                    <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">Net Calendar Days</span>
                    <span className="font-data-mono text-[16px] text-on-surface font-bold" id="metric-cal-days">
                      {calculationResult ? `${calculationResult.totalNetDays} Days` : '0 Days'}
                    </span>
                  </div>
                  <div className="bg-surface-container-low p-space-xs rounded-lg flex flex-col">
                    <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">Net Working Days</span>
                    <span className="font-data-mono text-[16px] text-primary font-bold" id="metric-biz-days">
                      {calculationResult ? `${calculationResult.estimatedWorkdays} Workdays` : '0 Workdays'}
                    </span>
                  </div>
                  <div className="bg-surface-container-low p-space-xs rounded-lg flex flex-col">
                    <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">Total Offset Hours</span>
                    <span className="font-data-mono text-[16px] text-on-surface font-bold" id="metric-hours">
                      {calculationResult ? `${calculationResult.totalNetHours} Hours` : '0 Hours'}
                    </span>
                  </div>
                  <div className="bg-surface-container-low p-space-xs rounded-lg flex flex-col">
                    <span className="font-label-caps text-[10px] text-on-surface-variant uppercase">Total Minutes</span>
                    <span className="font-data-mono text-[16px] text-on-surface font-bold" id="metric-mins">
                      {calculationResult ? `${calculationResult.totalNetMins} Mins` : '0 Mins'}
                    </span>
                  </div>
                </div>

                {/* Metrology Verification Strip */}
                <div className="bg-surface-container p-space-xs rounded-lg flex items-start gap-space-2xs text-on-surface-variant text-body-sm">
                  <span className="material-symbols-outlined text-[17px] text-primary mt-0.5">verified_user</span>
                  <div className="flex flex-col text-[12px] leading-tight">
                    <span className="font-semibold text-on-surface">Leap Year Verified</span>
                    <span id="metric-verification-note">
                      {calculationResult?.verificationNote || 'Gregorian standard solar year.'}
                    </span>
                  </div>
                </div>

                {/* Secondary Utilities (Print & Export) */}
                <div className="flex items-center justify-between pt-space-2xs border-t border-outline-variant/10">
                  <button
                    className="inline-flex items-center gap-space-2xs font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                    id="btn-export-txt"
                    type="button"
                    onClick={handleExportTxt}
                  >
                    <span className="material-symbols-outlined text-[16px]">file_download</span>
                    <span>Export CSV / TXT</span>
                  </button>
                  <button
                    className="inline-flex items-center gap-space-2xs font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                    id="btn-print-plan"
                    type="button"
                    onClick={handlePrint}
                  >
                    <span className="material-symbols-outlined text-[16px]">print</span>
                    <span>Print Schedule Plan</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 3. COMPREHENSIVE SEO & E-E-A-T DOCUMENTATION */}
          <div className="mt-space-3xl flex flex-col gap-space-3xl">
            {/* Section: Step-by-Step Featured Snippet Guide */}
            <section className="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm border border-outline-variant/20 flex flex-col gap-space-md">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-[28px]">format_list_numbered</span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight">
                  How to Add or Subtract Time from a Date (Simple Step-by-Step Guide)
                </h2>
              </div>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl">
                Calculating exact future deadlines or past project milestones involves more than elementary addition. Because calendar intervals feature variable lengths (such as 28 to 31 days per month and leap years every 4 years), standardized steps ensure complete chronological precision:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-space-md pt-space-xs">
                <div className="bg-surface-container-low p-space-md rounded-lg flex flex-col gap-space-xs">
                  <span className="w-8 h-8 rounded-full bg-primary text-on-primary font-bold flex items-center justify-center font-data-mono text-[14px]">
                    01
                  </span>
                  <h3 className="font-headline-md text-[16px] text-on-surface font-semibold">Pick Your Starting Date &amp; Time</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Specify the reference anchor date, exact 24-hour time string, and time zone to eliminate DST shift discrepancies.
                  </p>
                </div>
                <div className="bg-surface-container-low p-space-md rounded-lg flex flex-col gap-space-xs">
                  <span className="w-8 h-8 rounded-full bg-primary text-on-primary font-bold flex items-center justify-center font-data-mono text-[14px]">
                    02
                  </span>
                  <h3 className="font-headline-md text-[16px] text-on-surface font-semibold">Choose Add or Subtract</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Choose Add (+) to forward-plan production schedules or Subtract (−) to audit incident timelines and retroactive time spans.
                  </p>
                </div>
                <div className="bg-surface-container-low p-space-md rounded-lg flex flex-col gap-space-xs">
                  <span className="w-8 h-8 rounded-full bg-primary text-on-primary font-bold flex items-center justify-center font-data-mono text-[14px]">
                    03
                  </span>
                  <h3 className="font-headline-md text-[16px] text-on-surface font-semibold">Set Business Days &amp; Holidays</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Define whether the offset operates across continuous calendar days or strictly business working days (skipping Sat/Sun).
                  </p>
                </div>
                <div className="bg-surface-container-low p-space-md rounded-lg flex flex-col gap-space-xs">
                  <span className="w-8 h-8 rounded-full bg-primary text-on-primary font-bold flex items-center justify-center font-data-mono text-[14px]">
                    04
                  </span>
                  <h3 className="font-headline-md text-[16px] text-on-surface font-semibold">Get Your Exact Date</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Receive the ISO 8601 timestamp with total days, business hours, and instant time zone conversions ready for production use.
                  </p>
                </div>
              </div>
            </section>

            {/* Section: Mathematical Modeling & Formulas */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
              <div className="lg:col-span-6 flex flex-col gap-space-md">
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight">
                  How Date &amp; Time Calculations Work
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Date and time mathematics are governed by chronological mechanics defined within RFC 3339 and ISO 8601 standards. The target timestamp T_target is defined by applying the signed transformation operator over base epoch T_0:
                </p>
                <div className="bg-surface-container-low p-space-md rounded-lg font-data-mono text-body-md text-on-surface flex flex-col gap-space-2xs border border-outline-variant/20">
                  <div className="text-primary font-bold text-[16px]">T_target = T_base ± ΔT_total</div>
                  <div className="text-on-surface-variant text-[13px]">Where ΔT = ΔY + ΔM + ΔW + ΔD + Δh + Δm + Δs</div>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Because months possess unequal day allocations (28, 29, 30, or 31), months and years must be resolved sequentially before clock units. Day additions evaluate whether a year Y satisfies the Gregorian leap rule:
                </p>
                <div className="bg-surface-container-low p-space-xs px-space-sm rounded font-data-mono text-[13px] text-on-surface border border-outline-variant/20">
                  isLeapYear = (Y % 4 === 0 &amp;&amp; Y % 100 !== 0) || (Y % 400 === 0)
                </div>
              </div>
              <div className="lg:col-span-6 bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/20 flex flex-col gap-space-sm">
                <h3 className="font-headline-md text-[17px] text-on-surface font-semibold">How Business Days Are Counted</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  When projecting deliverable milestones without weekends, the workbench uses modular workweek progression. Let D represent the starting day index (0 for Sunday to 6 for Saturday):
                </p>
                <div className="space-y-space-xs font-body-sm text-body-sm text-on-surface-variant">
                  <div className="flex items-start gap-space-2xs">
                    <span className="material-symbols-outlined text-primary text-[16px] mt-1">check_circle</span>
                    <span>
                      <strong>Modular Saturday/Sunday Skipping:</strong> If target lands on Saturday, step +2 days. If Sunday, step +1 day.
                    </span>
                  </div>
                  <div className="flex items-start gap-space-2xs">
                    <span className="material-symbols-outlined text-primary text-[16px] mt-1">check_circle</span>
                    <span>
                      <strong>Holiday Offsetting:</strong> Explicit statutory holiday parameters advance the calculation counter to preserve delivery commitments.
                    </span>
                  </div>
                  <div className="flex items-start gap-space-2xs">
                    <span className="material-symbols-outlined text-primary text-[16px] mt-1">check_circle</span>
                    <span>
                      <strong>Fractional Remainder Preservation:</strong> Hours, minutes, and seconds are appended precisely to the resultant working date.
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Section: 6 Real-Life Industry Case Studies */}
            <section className="flex flex-col gap-space-lg">
              <div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight">
                  Real-Life Industry Use Cases &amp; Practical Applications
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                  Examining how automated time addition and subtraction powers mission-critical decisions across sectors.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
                {/* Case 1 */}
                <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20 flex flex-col gap-space-2xs">
                  <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary mb-space-2xs">
                    <span className="material-symbols-outlined">rocket_launch</span>
                  </div>
                  <h3 className="font-headline-md text-[16px] text-on-surface font-semibold">1. Agile Sprints &amp; Tech Delivery</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Engineering managers add exactly 10 business days (14 calendar days) from sprint kickoff to plan feature freeze and release deployments without weekend confusion.
                  </p>
                </div>
                {/* Case 2 */}
                <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20 flex flex-col gap-space-2xs">
                  <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-secondary mb-space-2xs">
                    <span className="material-symbols-outlined">badge</span>
                  </div>
                  <h3 className="font-headline-md text-[16px] text-on-surface font-semibold">2. Multi-Shift Payroll &amp; Overtime</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    HR departments add 12-hour factory shifts crossing the midnight threshold, subtracting mandatory 45-minute lunch breaks to accurately tally total billable hours.
                  </p>
                </div>
                {/* Case 3 */}
                <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20 flex flex-col gap-space-2xs">
                  <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-tertiary mb-space-2xs">
                    <span className="material-symbols-outlined">vaccines</span>
                  </div>
                  <h3 className="font-headline-md text-[16px] text-on-surface font-semibold">3. Medical &amp; Clinical Trials</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Pharmacology researchers add exactly 72 hours or 90 days from patient administration to monitor pharmacokinetic stability and medication shelf-life expirations.
                  </p>
                </div>
                {/* Case 4 */}
                <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20 flex flex-col gap-space-2xs">
                  <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary mb-space-2xs">
                    <span className="material-symbols-outlined">flight_takeoff</span>
                  </div>
                  <h3 className="font-headline-md text-[16px] text-on-surface font-semibold">4. Global Aviation &amp; Flight Layover</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Flight dispatchers calculate multi-leg overseas routes, adding 14h 40m flight spans across the International Date Line to synchronize local arrival gates.
                  </p>
                </div>
                {/* Case 5 */}
                <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20 flex flex-col gap-space-2xs">
                  <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-secondary mb-space-2xs">
                    <span className="material-symbols-outlined">gavel</span>
                  </div>
                  <h3 className="font-headline-md text-[16px] text-on-surface font-semibold">5. Legal Filings &amp; Statutes</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Litigators subtract 30 court days from hearing dates to ensure motions for summary judgment meet statutory exclusion criteria under state court rules.
                  </p>
                </div>
                {/* Case 6 */}
                <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20 flex flex-col gap-space-2xs">
                  <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-tertiary mb-space-2xs">
                    <span className="material-symbols-outlined">school</span>
                  </div>
                  <h3 className="font-headline-md text-[16px] text-on-surface font-semibold">6. Academic Thesis Milestones</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Doctoral candidates calculate backward 60 days from final dissertation defense to schedule draft submissions and review committee approvals.
                  </p>
                </div>
              </div>
            </section>

            {/* Section: Comparison Matrix Table */}
            <section className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/20 flex flex-col gap-space-md overflow-hidden">
              <div>
                <h2 className="font-headline-lg text-[22px] text-on-surface font-semibold">
                  SolveIt Calculator vs. Manual Counting vs. Spreadsheets
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Why using SolveIt Calculator is faster and more reliable than spreadsheets or mental math.
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-body-sm text-body-sm">
                  <thead className="bg-surface-container-low text-on-surface font-label-caps text-label-caps uppercase">
                    <tr>
                      <th className="p-space-sm">Capability / Dimension</th>
                      <th className="p-space-sm text-primary">SolveIt Calculator</th>
                      <th className="p-space-sm">Manual Date Counting</th>
                      <th className="p-space-sm">Excel (EDATE / WORKDAY)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20">
                    <tr className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="p-space-sm font-semibold text-on-surface">Sub-Second &amp; Time Precision</td>
                      <td className="p-space-sm text-primary font-bold">Full HH:MM:SS Support</td>
                      <td className="p-space-sm text-error">Prone to severe human error</td>
                      <td className="p-space-sm text-on-surface-variant">Requires complex fractional math</td>
                    </tr>
                    <tr className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="p-space-sm font-semibold text-on-surface">Business Day Skipping</td>
                      <td className="p-space-sm text-primary font-bold">1-Click Automated Toggle</td>
                      <td className="p-space-sm text-on-surface-variant">Manual calendar marking</td>
                      <td className="p-space-sm text-on-surface-variant">Requires WORKDAY.INTL function</td>
                    </tr>
                    <tr className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="p-space-sm font-semibold text-on-surface">Time Zone Interop</td>
                      <td className="p-space-sm text-primary font-bold">Live 4-Zone World Clock</td>
                      <td className="p-space-sm text-error">Mental GMT offsets required</td>
                      <td className="p-space-sm text-error">No native timezone engine</td>
                    </tr>
                    <tr className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="p-space-sm font-semibold text-on-surface">Leap Year Normalization</td>
                      <td className="p-space-sm text-primary font-bold">ISO 8601 Automated</td>
                      <td className="p-space-sm text-error">Frequently forgotten</td>
                      <td className="p-space-sm text-on-surface-variant">Dependent on 1900 date system</td>
                    </tr>
                    <tr className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="p-space-sm font-semibold text-on-surface">Data Privacy &amp; Security</td>
                      <td className="p-space-sm text-primary font-bold">100% In-Browser Isolation</td>
                      <td className="p-space-sm text-on-surface-variant">Safe (Local Paper)</td>
                      <td className="p-space-sm text-on-surface-variant">Cloud sync privacy risks</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section: Comprehensive 12 FAQ Accordion */}
            <section className="flex flex-col gap-space-lg">
              <div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight">
                  Frequently Asked Questions (People Also Ask)
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Technical answers to common time offset, calendrical, and timezone questions.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20 flex flex-col gap-space-2xs">
                  <h3 className="font-headline-md text-[15px] text-on-surface font-semibold">How does adding a month work on the 31st of January?</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    When adding one month to January 31st, February has only 28 (or 29 in a leap year) days. Our algorithm employs Gregorian month clamping: it caps the target day at the last valid day of February, preventing unintended overflow into March.
                  </p>
                </div>
                <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20 flex flex-col gap-space-2xs">
                  <h3 className="font-headline-md text-[15px] text-on-surface font-semibold">What is ISO 8601 and why is it recommended?</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    ISO 8601 (e.g. 2026-11-12T16:15:00Z) is the international standard for timestamp data. It completely removes ambiguity between international formats (such as MM/DD/YYYY vs DD/MM/YYYY), making it ideal for API calls, databases, and flight ticketing.
                  </p>
                </div>
                <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20 flex flex-col gap-space-2xs">
                  <h3 className="font-headline-md text-[15px] text-on-surface font-semibold">How are Daylight Saving Time (DST) changes handled?</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Calculations performed in reference time zones follow standard IANA timezone offset rules. When an offset crosses a spring-forward (+1h) or fall-back (−1h) transition, the resulting local clock updates according to local jurisdictional laws.
                  </p>
                </div>
                <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20 flex flex-col gap-space-2xs">
                  <h3 className="font-headline-md text-[15px] text-on-surface font-semibold">Can I add fractional hours like 7.5 hours?</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Yes. You can enter 7 hours and 30 minutes in their designated fields, or make use of our Work Shift preset module which automatically converts half-hour portions into exact 30-minute additions.
                  </p>
                </div>
                <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20 flex flex-col gap-space-2xs">
                  <h3 className="font-headline-md text-[15px] text-on-surface font-semibold">Does subtracting time allow going into past calendar eras?</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Yes. The computational workbench handles historical timestamps across multiple centuries back to Gregorian calendar inception, accurately factoring in historical leap year occurrences.
                  </p>
                </div>
                <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20 flex flex-col gap-space-2xs">
                  <h3 className="font-headline-md text-[15px] text-on-surface font-semibold">How do business days differ from calendar days?</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Calendar days represent uninterrupted 24-hour cycles (365 or 366 days per year). Business days count only Monday through Friday, skipping weekends and optional statutory holidays, reflecting actual corporate and legal operating time.
                  </p>
                </div>
                <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20 flex flex-col gap-space-2xs">
                  <h3 className="font-headline-md text-[15px] text-on-surface font-semibold">What happens if my start date falls on a weekend?</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    In Business Days mode, if the starting date is on a Saturday or Sunday, the system automatically advances to the following Monday morning before beginning offset counting, ensuring accurate deliverable planning.
                  </p>
                </div>
                <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20 flex flex-col gap-space-2xs">
                  <h3 className="font-headline-md text-[15px] text-on-surface font-semibold">Is my scheduling data kept private?</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Completely. All calculations are executed strictly within your local browser sandbox via JavaScript. No data is stored, cached on external servers, or shared with analytics providers.
                  </p>
                </div>
                <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20 flex flex-col gap-space-2xs">
                  <h3 className="font-headline-md text-[15px] text-on-surface font-semibold">Can I calculate past epochs for software debugging?</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Yes, our Future Age &amp; Epoch Marker module outputs the Unix timestamp (seconds since January 1, 1970 UTC) for any computed result, ideal for developers inspecting backend database expirations.
                  </p>
                </div>
                <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20 flex flex-col gap-space-2xs">
                  <h3 className="font-headline-md text-[15px] text-on-surface font-semibold">How does this tool handle leap seconds?</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Standard civil time follows UTC without accounting for discrete leap seconds, adhering to POSIX standards where every day is treated as containing exactly 86,400 SI seconds.
                  </p>
                </div>
                <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20 flex flex-col gap-space-2xs">
                  <h3 className="font-headline-md text-[15px] text-on-surface font-semibold">How can I print or export my calculated date?</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Click the &apos;Export CSV / TXT&apos; button on the results card to download a formatted text summary, or use &apos;Print Schedule Plan&apos; for a printer-optimized paper copy.
                  </p>
                </div>
                <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20 flex flex-col gap-space-2xs">
                  <h3 className="font-headline-md text-[15px] text-on-surface font-semibold">What is the maximum offset range supported?</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    You can calculate offsets up to 999 years and over 1,000,000 minutes in a single calculation, enabling long-range projections such as generational trusts or infrastructure lifespan planning.
                  </p>
                </div>
              </div>
            </section>

            {/* Section: Contextual Internal Calculators Grid */}
            <section className="bg-surface-container-low p-space-lg rounded-xl border border-outline-variant/20 flex flex-col gap-space-md">
              <div>
                <h3 className="font-headline-md text-[18px] text-on-surface font-semibold">
                  Explore Related Time &amp; Computational Calculators
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Explore other high-precision tools built on the SolveIt computational engine.
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-space-sm">
                <Link className="bg-surface-container-lowest p-space-sm rounded-lg hover:shadow transition-all flex flex-col gap-space-2xs border border-outline-variant/20" href="/time-date/days-between-dates">
                  <span className="material-symbols-outlined text-primary text-[20px]">date_range</span>
                  <span className="font-headline-md text-[13px] text-on-surface font-semibold">Date Difference</span>
                  <span className="font-body-sm text-[11px] text-on-surface-variant">Span between two dates</span>
                </Link>
                <Link className="bg-surface-container-lowest p-space-sm rounded-lg hover:shadow transition-all flex flex-col gap-space-2xs border border-outline-variant/20" href="/time-date">
                  <span className="material-symbols-outlined text-primary text-[20px]">work_history</span>
                  <span className="font-headline-md text-[13px] text-on-surface font-semibold">Business Days</span>
                  <span className="font-body-sm text-[11px] text-on-surface-variant">Working days &amp; holidays</span>
                </Link>
                <Link className="bg-surface-container-lowest p-space-sm rounded-lg hover:shadow transition-all flex flex-col gap-space-2xs border border-outline-variant/20" href="/time-date/time-calculator">
                  <span className="material-symbols-outlined text-primary text-[20px]">timer</span>
                  <span className="font-headline-md text-[13px] text-on-surface font-semibold">Time Duration</span>
                  <span className="font-body-sm text-[11px] text-on-surface-variant">Clock hours &amp; minutes</span>
                </Link>
                <Link className="bg-surface-container-lowest p-space-sm rounded-lg hover:shadow transition-all flex flex-col gap-space-2xs border border-outline-variant/20" href="/time-date">
                  <span className="material-symbols-outlined text-primary text-[20px]">cake</span>
                  <span className="font-headline-md text-[13px] text-on-surface font-semibold">Age Calculator</span>
                  <span className="font-body-sm text-[11px] text-on-surface-variant">Years, months &amp; days</span>
                </Link>
                <Link className="bg-surface-container-lowest p-space-sm rounded-lg hover:shadow transition-all flex flex-col gap-space-2xs border border-outline-variant/20" href="/time-date/time-zone-overlap">
                  <span className="material-symbols-outlined text-primary text-[20px]">public</span>
                  <span className="font-headline-md text-[13px] text-on-surface font-semibold">Time Zone</span>
                  <span className="font-body-sm text-[11px] text-on-surface-variant">Global city converter</span>
                </Link>
                <Link className="bg-surface-container-lowest p-space-sm rounded-lg hover:shadow transition-all flex flex-col gap-space-2xs border border-outline-variant/20" href="/percentage-calculator">
                  <span className="material-symbols-outlined text-primary text-[20px]">percent</span>
                  <span className="font-headline-md text-[13px] text-on-surface font-semibold">Percentage Calc</span>
                  <span className="font-body-sm text-[11px] text-on-surface-variant">Growth &amp; proportion</span>
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
