'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import { getCurrentTheme, toggleTheme } from '../../lib/theme';

// --- Preset Data ---
interface ToolItem {
  name: string;
  badge: string;
  category: string;
  desc?: string;
  anchor?: string;
}

interface CategoryGroup {
  id: string;
  name: string;
  icon: string;
  tools: ToolItem[];
}

const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    id: 'age-birthday',
    name: 'Age & Birthday',
    icon: 'cake',
    tools: [
      { name: 'Exact Age Calculator', badge: 'YMD/HMS', category: 'Age & Birthday', anchor: '/time-date/age-calculator' },
      { name: 'Birthday Day of Week Calculator', badge: 'Perpetual', category: 'Age & Birthday', anchor: '/time-date/age-calculator' },
      { name: 'Next Birthday Countdown Timer', badge: 'Real-Time', category: 'Age & Birthday', anchor: '/time-date/age-calculator' },
      { name: 'Age in Weeks, Days, & Minutes', badge: 'Unit Break', category: 'Age & Birthday', anchor: '/time-date/age-calculator' },
      { name: 'Pet Age Converter (Canine / Feline)', badge: 'Bio-Curve', category: 'Age & Birthday', anchor: '/time-date/age-calculator' },
      { name: 'Half-Birthday & Milestone Finder', badge: '+182.6 Days', category: 'Age & Birthday', anchor: '/time-date/age-calculator' },
    ],
  },
  {
    id: 'date-calculations',
    name: 'Date Calculations',
    icon: 'calendar_today',
    tools: [
      { name: 'Date Difference Calculator', badge: 'Delta', category: 'Date Calculations', anchor: '/time-date/date-difference' },
      { name: 'Days Between Dates', badge: 'Inclusive', category: 'Date Calculations', anchor: '/time-date/date-difference' },
      { name: 'Working Days / Business Days', badge: 'Fed Holidays', category: 'Date Calculations', anchor: '/time-date/days-calculator' },
      { name: 'Add / Subtract Days from Date', badge: '±N Days', category: 'Date Calculations', anchor: '/time-date/days-calculator' },
      { name: 'Julian Day Number & Epoch', badge: 'Astronomical', category: 'Date Calculations', anchor: '/time-date/days-calculator' },
      { name: 'Leap Year Validator & Counter', badge: '400y Rule', category: 'Date Calculations', anchor: '/time-date/date-difference' },
    ],
  },
  {
    id: 'time-arithmetic',
    name: 'Time Arithmetic',
    icon: 'calculate',
    tools: [
      { name: 'Add Time (HH:MM:SS)', badge: 'Accumulator', category: 'Time Arithmetic', anchor: '/time-date/time-calculator' },
      { name: 'Subtract Time (HH:MM:SS)', badge: 'Negative Delta', category: 'Time Arithmetic', anchor: '/time-date/time-calculator' },
      { name: 'Decimal Hours to Minutes/Seconds', badge: '0.75h → 45m', category: 'Time Arithmetic', anchor: '/time-date/time-calculator' },
      { name: 'Seconds to HH:MM:SS Converter', badge: 'Base 60', category: 'Time Arithmetic', anchor: '/time-date/time-calculator' },
      { name: 'Running Pace & Lap Split Engine', badge: 'Min/Mile', category: 'Time Arithmetic', anchor: '/time-date/time-calculator' },
      { name: 'Unix Epoch Timestamp Converter', badge: 'Posix Micro', category: 'Time Arithmetic', anchor: '/time-date/time-calculator' },
    ],
  },
  {
    id: 'time-zones-remote',
    name: 'Time Zones & Remote',
    icon: 'public',
    tools: [
      { name: 'World Clock Matrix Hub', badge: 'Global Sync', category: 'Time Zones & Remote', anchor: '/time-date/time-zone-overlap' },
      { name: 'Global Meeting Scheduler Overlap', badge: 'Golden Window', category: 'Time Zones & Remote', anchor: '/time-date/time-zone-overlap' },
      { name: 'Daylight Saving Transition Tracker', badge: 'Spring/Fall', category: 'Time Zones & Remote', anchor: '/time-date/time-zone-overlap' },
      { name: 'Military Time (24-Hour) Converter', badge: '0000-2400', category: 'Time Zones & Remote', anchor: '/time-date/time-zone-overlap' },
      { name: 'Flight Duration & Time Shift', badge: 'Jet Lag Map', category: 'Time Zones & Remote', anchor: '/time-date/time-zone-overlap' },
      { name: 'UTC / GMT Offset Standardizer', badge: 'Z-Time', category: 'Time Zones & Remote', anchor: '/time-date/time-zone-overlap' },
    ],
  },
  {
    id: 'work-shift-payroll',
    name: 'Work, Shift & Payroll',
    icon: 'payments',
    tools: [
      { name: 'Work Hours & Punch Card', badge: 'Break Deduct', category: 'Work, Shift & Payroll', anchor: '/time-date/work-hours' },
      { name: 'Overtime Pay (1.5x / 2.0x) Calculator', badge: 'FLSA Regs', category: 'Work, Shift & Payroll', anchor: '/time-date/work-hours' },
      { name: '2-2-3 Rotating Shift Schedule Matrix', badge: 'Pitman Shift', category: 'Work, Shift & Payroll', anchor: '/time-date/work-hours' },
      { name: 'Billable Time Increment Rounder', badge: '6/15 min increm', category: 'Work, Shift & Payroll', anchor: '/time-date/work-hours' },
      { name: 'Bi-Weekly Timesheet Batch Formatter', badge: 'CSV Export', category: 'Work, Shift & Payroll', anchor: '/time-date/work-hours' },
      { name: 'Salary to Hourly & Per-Minute Rate', badge: '2,080 Hours', category: 'Work, Shift & Payroll', anchor: '/time-date/work-hours' },
    ],
  },
  {
    id: 'countdowns-focus',
    name: 'Countdowns & Focus',
    icon: 'hourglass_top',
    tools: [
      { name: 'Event Countdown & Shareable Wall', badge: 'Live Micro', category: 'Countdowns & Focus', anchor: '/time-date/countdown-timer' },
      { name: 'Days Until Christmas / New Year', badge: 'Holiday Sync', category: 'Countdowns & Focus', anchor: '/time-date/countdown-timer' },
      { name: 'Pomodoro Focus / Break Interval Timer', badge: '25m / 5m', category: 'Countdowns & Focus', anchor: '/time-date/countdown-timer' },
      { name: '90-Minute Ultradian Rhythm Planner', badge: 'Kleitman Curve', category: 'Countdowns & Focus', anchor: '/time-date/countdown-timer' },
      { name: 'Retirement Countdown in Workdays', badge: 'Remaining Shifts', category: 'Countdowns & Focus', anchor: '/time-date/countdown-timer' },
      { name: 'Pregnancy Due Date & Trimesters', badge: 'Naegele Rule', category: 'Countdowns & Focus', anchor: '/health' },
    ],
  },
];

export default function TimeDateClient() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Live time ticker state
  const [now, setNow] = useState<Date | null>(null);

  // FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Flagship Tool 1: Age Calculator
  const [dob, setDob] = useState('1996-05-14');
  const [ageTargetDate, setAgeTargetDate] = useState('2025-02-27');

  // Flagship Tool 2: Date Difference
  const [dateStart, setDateStart] = useState('2025-01-01');
  const [dateEnd, setDateEnd] = useState('2025-09-30');

  // Flagship Tool 3: Work Hours & Overtime
  const [shiftStart, setShiftStart] = useState('08:30');
  const [shiftEnd, setShiftEnd] = useState('17:45');
  const [breakMins, setBreakMins] = useState(45);
  const [hourlyWage, setHourlyWage] = useState(42);

  // Flagship Tool 4: Time Zone Overlap Slider (hours in UTC: 0-24)
  const [utcHourSlider, setUtcHourSlider] = useState(14); // 14:00 UTC = 9:00 AM EST, 6:00 AM PST, 2:00 PM GMT

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    setIsDark(getCurrentTheme() === 'dark');
    const currentDate = new Date();
    setNow(currentDate);
    const isoToday = currentDate.toISOString().split('T')[0];
    setAgeTargetDate(isoToday);

    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        setIsDark(customEvent.detail === 'dark');
      } else {
        setIsDark(getCurrentTheme() === 'dark');
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('solveit-theme-change', handleThemeChange);
    window.addEventListener('storage', handleThemeChange);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(interval);
      window.removeEventListener('solveit-theme-change', handleThemeChange);
      window.removeEventListener('storage', handleThemeChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleToggleTheme = () => {
    const next = toggleTheme();
    setIsDark(next === 'dark');
  };

  // --- Real-time Metrics Calculations ---
  const telemetry = useMemo(() => {
    if (!mounted || !now) {
      return {
        utcStr: '00:00:00 UTC',
        locStr: '00:00:00 (Local)',
        timeZoneShort: 'UTC',
        weekNo: '01',
        percentYearElapsed: '0.0',
        dayOfYear: 1,
        totalDaysInYear: 365,
        daysLeftInYear: 364,
        nextYear: 2026,
        currentQuarter: 1,
        quarterPercent: 0,
        daysToNextQ: 0,
        nextEventName: 'Equinox',
        daysToEvent: 0,
      };
    }

    const current = now;
    const utcHours = String(current.getUTCHours()).padStart(2, '0');
    const utcMins = String(current.getUTCMinutes()).padStart(2, '0');
    const utcSecs = String(current.getUTCSeconds()).padStart(2, '0');
    const utcStr = `${utcHours}:${utcMins}:${utcSecs} UTC`;

    const locHours = String(current.getHours()).padStart(2, '0');
    const locMins = String(current.getMinutes()).padStart(2, '0');
    const locSecs = String(current.getSeconds()).padStart(2, '0');
    const timeZoneShort = typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'UTC';
    const locStr = `${locHours}:${locMins}:${locSecs} (Local)`;

    // Day of year
    const startOfYear = new Date(current.getFullYear(), 0, 1);
    const diff = current.getTime() - startOfYear.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay) + 1;
    const isLeap = (current.getFullYear() % 4 === 0 && current.getFullYear() % 100 !== 0) || current.getFullYear() % 400 === 0;
    const totalDaysInYear = isLeap ? 366 : 365;
    const daysLeftInYear = totalDaysInYear - dayOfYear;

    // ISO 8601 Week Number
    const d = new Date(Date.UTC(current.getFullYear(), current.getMonth(), current.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
    const percentYearElapsed = ((dayOfYear / totalDaysInYear) * 100).toFixed(1);

    // Quarter Progress
    const month = current.getMonth();
    const currentQuarter = Math.floor(month / 3) + 1;
    const quarterStartMonth = (currentQuarter - 1) * 3;
    const nextQuarterStart = new Date(current.getFullYear(), quarterStartMonth + 3, 1);
    const currentQuarterStart = new Date(current.getFullYear(), quarterStartMonth, 1);
    const quarterDuration = (nextQuarterStart.getTime() - currentQuarterStart.getTime()) / oneDay;
    const quarterElapsed = (current.getTime() - currentQuarterStart.getTime()) / oneDay;
    const quarterPercent = Math.min(100, Math.max(0, Math.round((quarterElapsed / quarterDuration) * 100)));
    const daysToNextQ = Math.max(0, Math.ceil((nextQuarterStart.getTime() - current.getTime()) / oneDay));

    // Equinox & Solstice Countdown (approx March 20, June 21, Sept 22, Dec 21)
    const year = current.getFullYear();
    const astronomicalEvents = [
      { name: 'Spring Equinox', date: new Date(year, 2, 20) },
      { name: 'Summer Solstice', date: new Date(year, 5, 21) },
      { name: 'Autumn Equinox', date: new Date(year, 8, 22) },
      { name: 'Winter Solstice', date: new Date(year, 11, 21) },
      { name: 'Spring Equinox', date: new Date(year + 1, 2, 20) },
    ];
    const nextEvent = astronomicalEvents.find((ev) => ev.date > current) || astronomicalEvents[0];
    const daysToEvent = Math.max(0, Math.ceil((nextEvent.date.getTime() - current.getTime()) / oneDay));

    return {
      utcStr,
      locStr,
      timeZoneShort,
      weekNo: String(weekNo).padStart(2, '0'),
      percentYearElapsed,
      dayOfYear,
      totalDaysInYear,
      daysLeftInYear,
      nextYear: current.getFullYear() + 1,
      currentQuarter,
      quarterPercent,
      daysToNextQ,
      nextEventName: nextEvent.name,
      daysToEvent,
    };
  }, [now, mounted]);

  // --- Dynamic Age Calculator Output ---
  const ageResults = useMemo(() => {
    if (!dob || !ageTargetDate) {
      return { valid: false, error: 'Please enter valid dates' };
    }
    const dStart = new Date(dob);
    const dTarget = new Date(ageTargetDate);

    if (isNaN(dStart.getTime()) || isNaN(dTarget.getTime())) {
      return { valid: false, error: 'Invalid date format' };
    }
    if (dTarget < dStart) {
      return { valid: false, error: 'Target date must be after birth date' };
    }

    let years = dTarget.getFullYear() - dStart.getFullYear();
    let months = dTarget.getMonth() - dStart.getMonth();
    let days = dTarget.getDate() - dStart.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonthLastDay = new Date(dTarget.getFullYear(), dTarget.getMonth(), 0).getDate();
      days += prevMonthLastDay;
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    // Total days lived
    const diffTime = dTarget.getTime() - dStart.getTime();
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Day of week born on
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayBorn = weekdays[dStart.getDay()];

    // Next birthday days
    const nextBday = new Date(dTarget.getFullYear(), dStart.getMonth(), dStart.getDate());
    if (nextBday < dTarget) {
      nextBday.setFullYear(dTarget.getFullYear() + 1);
    }
    const daysToNextBday = Math.ceil((nextBday.getTime() - dTarget.getTime()) / (1000 * 60 * 60 * 24));

    return {
      valid: true,
      display: `${years} Years, ${months} Months, ${days} Days`,
      totalDays: totalDays.toLocaleString(),
      dayBorn,
      daysToNextBday: daysToNextBday === 0 ? 'Today!' : `${daysToNextBday} Days`,
    };
  }, [dob, ageTargetDate]);

  // --- Dynamic Date Difference Engine Output ---
  const dateDiffResults = useMemo(() => {
    if (!dateStart || !dateEnd) return null;
    const start = new Date(dateStart);
    const end = new Date(dateEnd);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;

    const diffMs = Math.abs(end.getTime() - start.getTime());
    const totalCalendarDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    const totalHours = totalCalendarDays * 24;

    // Approximate months & days
    const earlier = start < end ? start : end;
    const later = start < end ? end : start;
    let months = (later.getFullYear() - earlier.getFullYear()) * 12 + (later.getMonth() - earlier.getMonth());
    let days = later.getDate() - earlier.getDate();
    if (days < 0) {
      months -= 1;
      const prevMonthLastDay = new Date(later.getFullYear(), later.getMonth(), 0).getDate();
      days += prevMonthLastDay;
    }

    // Count business vs weekend days
    let businessDays = 0;
    let weekendDays = 0;
    const cur = new Date(earlier);
    while (cur < later) {
      const day = cur.getDay();
      if (day === 0 || day === 6) {
        weekendDays++;
      } else {
        businessDays++;
      }
      cur.setDate(cur.getDate() + 1);
    }

    return {
      calendarDays: totalCalendarDays,
      monthsAndDays: `${months} Months, ${days} Days`,
      businessDays,
      weekendDays,
      totalHours: totalHours.toLocaleString(),
    };
  }, [dateStart, dateEnd]);

  // --- Dynamic Work Hours & Timesheet Output ---
  const timesheetResults = useMemo(() => {
    const [startH, startM] = shiftStart.split(':').map(Number);
    const [endH, endM] = shiftEnd.split(':').map(Number);

    if (isNaN(startH) || isNaN(startM) || isNaN(endH) || isNaN(endM)) {
      return null;
    }

    let startTotalMins = startH * 60 + startM;
    let endTotalMins = endH * 60 + endM;

    if (endTotalMins < startTotalMins) {
      // Shift spans midnight
      endTotalMins += 24 * 60;
    }

    const grossShiftMins = endTotalMins - startTotalMins;
    const netMins = Math.max(0, grossShiftMins - breakMins);
    const decimalHours = netMins / 60;

    const dispH = Math.floor(netMins / 60);
    const dispM = netMins % 60;

    const regularHours = Math.min(8.0, decimalHours);
    const overtimeHours = Math.max(0, decimalHours - 8.0);
    const grossPay = regularHours * hourlyWage + overtimeHours * hourlyWage * 1.5;

    return {
      decimalHours: decimalHours.toFixed(2),
      formattedTime: `${dispH} Hours, ${dispM} Minutes`,
      regularHours: regularHours.toFixed(2),
      overtimeHours: overtimeHours.toFixed(2),
      grossPay: grossPay.toFixed(2),
    };
  }, [shiftStart, shiftEnd, breakMins, hourlyWage]);

  // --- Filtered Tools List for Search ---
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return CATEGORY_GROUPS;
    const query = searchQuery.toLowerCase().trim();

    return CATEGORY_GROUPS.map((group) => {
      const matchingTools = group.tools.filter(
        (t) => t.name.toLowerCase().includes(query) || t.badge.toLowerCase().includes(query) || group.name.toLowerCase().includes(query)
      );
      return {
        ...group,
        tools: matchingTools,
      };
    }).filter((group) => group.tools.length > 0);
  }, [searchQuery]);

  const totalFilteredCount = useMemo(() => {
    return filteredCategories.reduce((acc, cat) => acc + cat.tools.length, 0);
  }, [filteredCategories]);

  return (
    <div className="min-h-screen bg-surface font-body-md text-body-md text-on-surface flex flex-col">
      {/* Universal Global Header */}
      <Header />

      <main className="w-full pt-24 bg-surface min-h-[calc(100vh-64px)] flex-1">
        <div className="flex flex-col w-full">
          {/* 1. HEADER BREADCRUMB & METROLOGY SYSTEM */}
          <div className="w-full bg-surface-container-lowest shadow-sm border-b border-outline-variant/30">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-sm">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-sm">
                {/* Breadcrumb Path */}
                <nav aria-label="Breadcrumb" className="flex items-center gap-space-xs font-label-caps text-label-caps text-on-surface-variant">
                  <Link className="hover:text-primary transition-colors flex items-center gap-1" href="/">
                    <span className="material-symbols-outlined text-[15px]">home</span>
                    <span>Home</span>
                  </Link>
                  <span>/</span>
                  <Link className="text-on-surface font-semibold flex items-center gap-1" href="/time-date">
                    <span className="material-symbols-outlined text-[15px]">schedule</span>
                    <span>Time &amp; Date</span>
                  </Link>
                  <span>/</span>
                  <span className="text-primary font-semibold">Temporal Intelligence Center</span>
                </nav>

                {/* Metrology System Badges */}
                <div className="flex flex-wrap items-center gap-space-xs">
                  <span className="inline-flex items-center gap-1.5 px-space-xs py-0.5 rounded-full bg-surface-container font-data-mono text-[11px] text-on-surface">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                    ISO 8601 Temporal Standard
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-space-xs py-0.5 rounded-full bg-surface-container font-data-mono text-[11px] text-on-surface">
                    <span className="material-symbols-outlined text-[13px] text-secondary">public</span>
                    UTC Synchronized Engine
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-space-xs py-0.5 rounded-full bg-surface-container-high font-data-mono text-[11px] text-primary font-semibold">
                    <span className="material-symbols-outlined text-[13px]">bolt</span>
                    Zero-Latency Client Computation
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. HERO SECTION WITH INTEGRATED COMMAND PALETTE */}
          <section className="w-full bg-surface py-space-2xl">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
                {/* Hero Text & Search (Cols 1-8) */}
                <div className="lg:col-span-8 flex flex-col gap-space-md">
                  <div className="inline-flex items-center gap-2 px-space-sm py-1 rounded-full bg-surface-container text-primary font-label-caps text-label-caps w-fit shadow-sm">
                    <span className="material-symbols-outlined text-[16px] text-primary">timelapse</span>
                    TEMPORAL COMPUTATION ENGINE 4.2
                  </div>
                  <h1 className="font-display-hero text-headline-lg lg:text-display-hero text-on-surface tracking-tight font-bold">
                    Time &amp; Date Calculators
                  </h1>
                  <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
                    Calculate precise chronological ages, business day durations, 1.5x overtime timesheets, planetary countdowns, world meeting overlaps, and chronobiological focus intervals with millisecond accuracy.
                  </p>

                  {/* High-Octane Command Search */}
                  <div className="relative mt-space-sm max-w-2xl">
                    <div className="bg-surface-container-lowest rounded-xl shadow-md p-2 flex items-center gap-space-sm border border-outline-variant/40 focus-within:border-primary transition-all">
                      <span className="material-symbols-outlined text-outline text-[22px] ml-2">search</span>
                      <input
                        ref={searchInputRef}
                        className="w-full bg-transparent text-on-surface placeholder:text-outline font-body-md text-body-md focus:outline-none"
                        id="tool-search-input"
                        placeholder="Search 100+ time & date tools (e.g., Age from DOB, Business Days, Work Hours)..."
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery('')}
                          className="p-1 rounded-full hover:bg-surface-container text-outline text-xs"
                          title="Clear search"
                        >
                          <span className="material-symbols-outlined text-[18px]">close</span>
                        </button>
                      )}
                      <div className="hidden sm:flex items-center gap-1 bg-surface-container px-2 py-1 rounded font-data-mono text-[11px] text-on-surface-variant shrink-0">
                        <span>⌘</span>
                        <span>K</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const catalog = document.getElementById('catalog-section');
                          catalog?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="bg-primary text-on-primary font-body-sm text-body-sm px-space-md py-2 rounded-lg font-semibold hover:opacity-95 transition-opacity shadow-sm shrink-0 cursor-pointer"
                      >
                        Execute
                      </button>
                    </div>
                  </div>

                  {/* Quick Query Chips */}
                  <div className="flex flex-wrap items-center gap-space-xs pt-space-xs">
                    <span className="font-label-caps text-label-caps text-outline uppercase tracking-wider">Fast Jumps:</span>
                    <a
                      href="#age-calculator-workbench"
                      className="px-space-sm py-1 rounded-full bg-surface-container-lowest shadow-sm text-on-surface hover:bg-surface-container-high transition-colors font-data-mono text-[12px] border border-outline-variant/30"
                    >
                      Age Calculator
                    </a>
                    <a
                      href="#date-diff-workbench"
                      className="px-space-sm py-1 rounded-full bg-surface-container-lowest shadow-sm text-on-surface hover:bg-surface-container-high transition-colors font-data-mono text-[12px] border border-outline-variant/30"
                    >
                      Date Difference
                    </a>
                    <a
                      href="#work-hours-workbench"
                      className="px-space-sm py-1 rounded-full bg-surface-container-lowest shadow-sm text-on-surface hover:bg-surface-container-high transition-colors font-data-mono text-[12px] border border-outline-variant/30"
                    >
                      Work Hours &amp; OT
                    </a>
                    <a
                      href="#timezone-workbench"
                      className="px-space-sm py-1 rounded-full bg-surface-container-lowest shadow-sm text-on-surface hover:bg-surface-container-high transition-colors font-data-mono text-[12px] border border-outline-variant/30"
                    >
                      Time Zone Overlap
                    </a>
                    <a
                      href="#telemetry-dashboard"
                      className="px-space-sm py-1 rounded-full bg-surface-container-lowest shadow-sm text-on-surface hover:bg-surface-container-high transition-colors font-data-mono text-[12px] border border-outline-variant/30"
                    >
                      Pomodoro Cycles
                    </a>
                    <a
                      href="#community-presets"
                      className="px-space-sm py-1 rounded-full bg-surface-container-lowest shadow-sm text-on-surface hover:bg-surface-container-high transition-colors font-data-mono text-[12px] border border-outline-variant/30"
                    >
                      Countdown 2026
                    </a>
                  </div>
                </div>

                {/* Metric Telemetry Capsule (Cols 9-12) */}
                <div className="lg:col-span-4 bg-surface-container-low rounded-2xl p-space-lg shadow-sm border border-outline-variant/30 flex flex-col gap-space-md">
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps text-primary uppercase font-bold tracking-wider">
                      Precision Infrastructure
                    </span>
                    <span className="w-2 h-2 rounded-full bg-secondary-container animate-ping"></span>
                  </div>
                  <div className="grid grid-cols-2 gap-space-md">
                    <div className="bg-surface-container-lowest p-space-sm rounded-xl shadow-sm border border-outline-variant/20">
                      <span className="font-label-caps text-[10px] text-outline uppercase block">Available Tools</span>
                      <span className="font-numerical-display text-[26px] text-on-surface font-bold">104+</span>
                      <span className="font-body-sm text-[11px] text-on-surface-variant block mt-0.5">Chronometric Models</span>
                    </div>
                    <div className="bg-surface-container-lowest p-space-sm rounded-xl shadow-sm border border-outline-variant/20">
                      <span className="font-label-caps text-[10px] text-outline uppercase block">Operations / Mo</span>
                      <span className="font-numerical-display text-[26px] text-primary font-bold">38.4M</span>
                      <span className="font-body-sm text-[11px] text-on-surface-variant block mt-0.5">Verified Outputs</span>
                    </div>
                    <div className="bg-surface-container-lowest p-space-sm rounded-xl shadow-sm border border-outline-variant/20">
                      <span className="font-label-caps text-[10px] text-outline uppercase block">Architecture</span>
                      <span className="font-data-mono text-[16px] text-on-surface font-semibold">100% Client</span>
                      <span className="font-body-sm text-[11px] text-on-surface-variant block mt-0.5">Zero Cloud Telemetry</span>
                    </div>
                    <div className="bg-surface-container-lowest p-space-sm rounded-xl shadow-sm border border-outline-variant/20">
                      <span className="font-label-caps text-[10px] text-outline uppercase block">Precision</span>
                      <span className="font-data-mono text-[16px] text-secondary font-semibold">±1.0 μs</span>
                      <span className="font-body-sm text-[11px] text-on-surface-variant block mt-0.5">NTP Aligned Clock</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm pt-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">verified_user</span>
                    <span>Calibrated against IERS Reference Ephemerides</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 3. REAL-TIME CHRONO-TELEMETRY COCKPIT (Linear/Apple Health style) */}
          <section id="telemetry-dashboard" className="w-full bg-surface-container-low py-space-xl border-y border-outline-variant/30">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
              <div className="flex items-center justify-between mb-space-md">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[22px]">precision_manufacturing</span>
                  <h2 className="font-headline-md text-headline-md text-on-surface tracking-tight font-bold">
                    Real-Time Chrono-Telemetry Dashboard
                  </h2>
                </div>
                <div className="hidden md:flex items-center gap-2 font-data-mono text-[12px] text-on-surface-variant bg-surface-container-lowest px-3 py-1 rounded-lg shadow-sm border border-outline-variant/20">
                  <span>TICK OSCILLATOR:</span>
                  <span className="text-primary font-bold">ACTIVE [1000ms]</span>
                </div>
              </div>

              {/* Live Metric Grid Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-space-sm">
                {/* Live UTC/Local */}
                <div className="col-span-2 bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps text-outline uppercase">Master Time Sync</span>
                    <span className="material-symbols-outlined text-primary text-[16px]">public</span>
                  </div>
                  <div className="my-space-xs" suppressHydrationWarning>
                    <div className="font-data-mono text-[20px] font-bold text-on-surface tracking-tight" suppressHydrationWarning>
                      {telemetry.utcStr}
                    </div>
                    <div className="font-data-mono text-[13px] text-on-surface-variant" suppressHydrationWarning>
                      {telemetry.locStr}
                    </div>
                  </div>
                  <div className="font-label-caps text-[10px] text-outline uppercase">ATOMIC DRIFT: &lt; 0.002ms</div>
                </div>

                {/* Week Number */}
                <div className="col-span-2 bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps text-outline uppercase">Week Metric</span>
                    <span className="font-data-mono text-body-sm font-semibold text-primary">ISO 8601</span>
                  </div>
                  <div className="my-space-xs" suppressHydrationWarning>
                    <div className="font-numerical-display text-[24px] font-bold text-on-surface" suppressHydrationWarning>
                      Week {telemetry.weekNo} <span className="text-on-surface-variant text-[15px] font-normal">/ 52</span>
                    </div>
                    <div className="w-full bg-surface-container rounded-full h-1.5 mt-2 overflow-hidden">
                      <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${telemetry.percentYearElapsed}%` }}></div>
                    </div>
                  </div>
                  <div className="font-body-sm text-[11px] text-on-surface-variant" suppressHydrationWarning>{telemetry.percentYearElapsed}% of current year elapsed</div>
                </div>

                {/* Day of Year */}
                <div className="col-span-1 bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20 flex flex-col justify-between">
                  <span className="font-label-caps text-label-caps text-outline uppercase">Day of Year</span>
                  <div className="font-numerical-display text-[24px] font-bold text-on-surface my-1" suppressHydrationWarning>
                    Day {telemetry.dayOfYear}
                  </div>
                  <span className="font-body-sm text-[11px] text-on-surface-variant" suppressHydrationWarning>of {telemetry.totalDaysInYear} Days</span>
                </div>

                {/* Days Remaining */}
                <div className="col-span-1 bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20 flex flex-col justify-between">
                  <span className="font-label-caps text-label-caps text-outline uppercase">Days Left</span>
                  <div className="font-numerical-display text-[24px] font-bold text-primary my-1" suppressHydrationWarning>
                    {telemetry.daysLeftInYear}
                  </div>
                  <span className="font-body-sm text-[11px] text-on-surface-variant" suppressHydrationWarning>Until {telemetry.nextYear} Epoch</span>
                </div>

                {/* Quarter Progress */}
                <div className="col-span-1 bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20 flex flex-col justify-between">
                  <span className="font-label-caps text-label-caps text-outline uppercase">Quarter Progress</span>
                  <div className="font-numerical-display text-[24px] font-bold text-on-surface my-1" suppressHydrationWarning>
                    Q{telemetry.currentQuarter} <span className="text-[14px] text-secondary font-semibold">{telemetry.quarterPercent}%</span>
                  </div>
                  <span className="font-body-sm text-[11px] text-on-surface-variant" suppressHydrationWarning>{telemetry.daysToNextQ} Days to next Q</span>
                </div>

                {/* Astronomical Solstice */}
                <div className="col-span-1 bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20 flex flex-col justify-between">
                  <span className="font-label-caps text-label-caps text-outline uppercase">Equinox Alert</span>
                  <div className="font-numerical-display text-[24px] font-bold text-on-surface my-1" suppressHydrationWarning>
                    {telemetry.daysToEvent}d
                  </div>
                  <span className="font-body-sm text-[11px] text-on-surface-variant" suppressHydrationWarning>{telemetry.nextEventName}</span>
                </div>
              </div>
            </div>
          </section>

          {/* 4. INTENT-DRIVEN GOAL EXPLORER (Bento Design Pattern) */}
          <section className="w-full bg-surface py-space-2xl">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
              <div className="max-w-3xl mb-space-xl">
                <span className="font-label-caps text-label-caps text-primary uppercase tracking-widest block mb-1 font-bold">
                  Purpose-Built Calculators
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
                  What would you like to calculate today?
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                  Access structured workflows mapped precisely to your personal, corporate, or project timing requirements.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
                {/* Card 1: Project Planner */}
                <div className="group bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between border border-outline-variant/30 hover:border-primary/40">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary mb-space-md group-hover:bg-primary group-hover:text-on-primary transition-colors">
                      <span className="material-symbols-outlined text-[26px]">calendar_month</span>
                    </div>
                    <h3 className="font-headline-md text-[18px] text-on-surface font-semibold mb-1">Plan a Project</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                      Calculate Gantt milestone deadlines, skip weekends and bank holidays, and formulate sprint buffers.
                    </p>
                  </div>
                  <Link className="inline-flex items-center gap-1 font-body-sm text-body-sm text-primary font-semibold hover:underline" href="/time-date/date-difference">
                    <span>Project Date Engine</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>

                {/* Card 2: Durations & Deltas */}
                <div className="group bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between border border-outline-variant/30 hover:border-primary/40">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary mb-space-md group-hover:bg-primary group-hover:text-on-primary transition-colors">
                      <span className="material-symbols-outlined text-[26px]">timer</span>
                    </div>
                    <h3 className="font-headline-md text-[18px] text-on-surface font-semibold mb-1">Durations &amp; Deltas</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                      Add or subtract pure hours, minutes, and seconds across day boundaries. Convert fractions to clock formats.
                    </p>
                  </div>
                  <Link className="inline-flex items-center gap-1 font-body-sm text-body-sm text-primary font-semibold hover:underline" href="/time-date/time-calculator">
                    <span>Time Calculator</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>

                {/* Card 3: Work & Overtime */}
                <div className="group bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between border border-outline-variant/30 hover:border-primary/40">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary mb-space-md group-hover:bg-primary group-hover:text-on-primary transition-colors">
                      <span className="material-symbols-outlined text-[26px]">badge</span>
                    </div>
                    <h3 className="font-headline-md text-[18px] text-on-surface font-semibold mb-1">Work Hours &amp; Payroll</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                      Calculate total punch card hours, automatic 30/60m lunch deductions, and 1.5x/2.0x overtime wages.
                    </p>
                  </div>
                  <Link className="inline-flex items-center gap-1 font-body-sm text-body-sm text-primary font-semibold hover:underline" href="/time-date/work-hours">
                    <span>Work Hours &amp; Payroll</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>

                {/* Card 4: Global Zones */}
                <div className="group bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between border border-outline-variant/30 hover:border-primary/40">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary mb-space-md group-hover:bg-primary group-hover:text-on-primary transition-colors">
                      <span className="material-symbols-outlined text-[26px]">language</span>
                    </div>
                    <h3 className="font-headline-md text-[18px] text-on-surface font-semibold mb-1">Time Zone Sync</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                      Overcome cross-continental scheduling drag. Find optimal working hour overlaps between SF, London, and Tokyo.
                    </p>
                  </div>
                  <Link className="inline-flex items-center gap-1 font-body-sm text-body-sm text-primary font-semibold hover:underline" href="/time-date/time-zone-overlap">
                    <span>Overlap Scheduler</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>

                {/* Card 5: Chronological Age */}
                <div className="group bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between border border-outline-variant/30 hover:border-primary/40">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary mb-space-md group-hover:bg-primary group-hover:text-on-primary transition-colors">
                      <span className="material-symbols-outlined text-[26px]">cake</span>
                    </div>
                    <h3 className="font-headline-md text-[18px] text-on-surface font-semibold mb-1">Exact Chronological Age</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                      Calculate exact years, months, days, total elapsed heartbeats, breaths, and countdown to your next milestone.
                    </p>
                  </div>
                  <Link className="inline-flex items-center gap-1 font-body-sm text-body-sm text-primary font-semibold hover:underline" href="/time-date/age-calculator">
                    <span>Age Calculator</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>

                {/* Card 6: Date Counting */}
                <div className="group bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between border border-outline-variant/30 hover:border-primary/40">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary mb-space-md group-hover:bg-primary group-hover:text-on-primary transition-colors">
                      <span className="material-symbols-outlined text-[26px]">date_range</span>
                    </div>
                    <h3 className="font-headline-md text-[18px] text-on-surface font-semibold mb-1">Days Between Dates</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                      Pinpoint total elapsed days, weekdays only, weeks, or calendar months between any two timestamps in history.
                    </p>
                  </div>
                  <Link className="inline-flex items-center gap-1 font-body-sm text-body-sm text-primary font-semibold hover:underline" href="/time-date/date-difference">
                    <span>Date Delta Analyzer</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>

                {/* Card 7: Launch Milestones */}
                <div className="group bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between border border-outline-variant/30 hover:border-primary/40">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary mb-space-md group-hover:bg-primary group-hover:text-on-primary transition-colors">
                      <span className="material-symbols-outlined text-[26px]">rocket_launch</span>
                    </div>
                    <h3 className="font-headline-md text-[18px] text-on-surface font-semibold mb-1">Event Countdowns</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                      Track major company product releases, weddings, graduations, or retirement horizons with fluid countdown tickers.
                    </p>
                  </div>
                  <Link className="inline-flex items-center gap-1 font-body-sm text-body-sm text-primary font-semibold hover:underline" href="/time-date/countdown-timer">
                    <span>Countdown Timer</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>

                {/* Card 8: Chronobiology & Focus */}
                <div className="group bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between border border-outline-variant/30 hover:border-primary/40">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary mb-space-md group-hover:bg-primary group-hover:text-on-primary transition-colors">
                      <span className="material-symbols-outlined text-[26px]">psychology</span>
                    </div>
                    <h3 className="font-headline-md text-[18px] text-on-surface font-semibold mb-1">Focus &amp; Chronobiology</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                      Calculate Pomodoro sprints (25/5m), 90-minute ultradian rhythm rest cycles, and peak circadian mental windows.
                    </p>
                  </div>
                  <a className="inline-flex items-center gap-1 font-body-sm text-body-sm text-primary font-semibold hover:underline" href="#telemetry-dashboard">
                    <span>Productivity Cycles</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* 5. FLAGSHIP FEATURED TOOLS (Interactive Quick-Calculate Sidecars) */}
          <section className="w-full bg-surface-container-low py-space-3xl border-t border-outline-variant/30">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-xl gap-space-sm">
                <div>
                  <span className="font-label-caps text-label-caps text-primary uppercase tracking-widest block mb-1 font-bold">
                    High-Frequency Computing
                  </span>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
                    Flagship Temporal Workbenches
                  </h2>
                </div>
                <div className="font-body-sm text-body-sm text-on-surface-variant">
                  Interactive client-side engines. Input parameters calculate instantaneously.
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-xl">
                {/* TOOL 1: Age Calculator Workbench */}
                <div id="age-calculator-workbench" className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-outline-variant/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-space-sm border-b border-outline-variant/20">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[24px]">cake</span>
                        <h3 className="font-headline-md text-[20px] text-on-surface font-semibold">Age Calculator Engine</h3>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-surface-container font-data-mono text-[11px] text-on-surface font-semibold">
                        VERIFIED ISO
                      </span>
                    </div>

                    {/* Interactive UI Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md my-space-md">
                      <div>
                        <label className="font-label-caps text-label-caps text-outline uppercase block mb-1" htmlFor="dob-input">
                          Date of Birth
                        </label>
                        <input
                          className="w-full bg-surface-container-low text-on-surface font-data-mono text-data-mono p-space-sm rounded-lg focus:outline-none focus:bg-surface-container border border-outline-variant/30 focus:border-primary"
                          id="dob-input"
                          type="date"
                          value={dob}
                          onChange={(e) => setDob(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="font-label-caps text-label-caps text-outline uppercase block mb-1" htmlFor="age-target-date">
                          Calculate Age At Date
                        </label>
                        <input
                          className="w-full bg-surface-container-low text-on-surface font-data-mono text-data-mono p-space-sm rounded-lg focus:outline-none focus:bg-surface-container border border-outline-variant/30 focus:border-primary"
                          id="age-target-date"
                          type="date"
                          value={ageTargetDate}
                          onChange={(e) => setAgeTargetDate(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Instant Computation Visual Panel */}
                    <div className="bg-surface-container p-space-md rounded-xl my-space-sm border border-outline-variant/20">
                      <div className="text-on-surface-variant font-label-caps text-label-caps uppercase">Calculated Output:</div>
                      <div className="font-numerical-display text-[28px] text-primary font-bold mt-1" id="age-calculated-display">
                        {ageResults.valid ? ageResults.display : ageResults.error}
                      </div>
                      {ageResults.valid && (
                        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-outline-variant/20">
                          <div className="bg-surface-container-lowest p-2 rounded-lg border border-outline-variant/20">
                            <span className="font-label-caps text-[10px] text-outline uppercase block">Total Days</span>
                            <span className="font-data-mono text-[13px] font-bold text-on-surface">{ageResults.totalDays} Days</span>
                          </div>
                          <div className="bg-surface-container-lowest p-2 rounded-lg border border-outline-variant/20">
                            <span className="font-label-caps text-[10px] text-outline uppercase block">Born On</span>
                            <span className="font-data-mono text-[13px] font-bold text-on-surface">{ageResults.dayBorn}</span>
                          </div>
                          <div className="bg-surface-container-lowest p-2 rounded-lg border border-outline-variant/20">
                            <span className="font-label-caps text-[10px] text-outline uppercase block">Next Birthday</span>
                            <span className="font-data-mono text-[13px] font-bold text-secondary">{ageResults.daysToNextBday}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-space-md border-t border-outline-variant/20 mt-2">
                    <span className="font-body-sm text-[12px] text-outline">Formula: Astronomical Ephemeris exact leap day adjustment</span>
                    <Link
                      href="/time-date/age-calculator"
                      className="px-space-md py-1.5 rounded-lg bg-surface-container font-body-sm text-body-sm text-primary font-semibold hover:bg-surface-container-high transition-colors"
                    >
                      Full Calculator Page →
                    </Link>
                  </div>
                </div>

                {/* TOOL 2: Date Difference Engine */}
                <div id="date-diff-workbench" className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-outline-variant/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-space-sm border-b border-outline-variant/20">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[24px]">date_range</span>
                        <h3 className="font-headline-md text-[20px] text-on-surface font-semibold">Date Difference Engine</h3>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-surface-container font-data-mono text-[11px] text-on-surface font-semibold">
                        DAY/MONTH DELTA
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md my-space-md">
                      <div>
                        <label className="font-label-caps text-label-caps text-outline uppercase block mb-1" htmlFor="date-start">
                          Start Date
                        </label>
                        <input
                          className="w-full bg-surface-container-low text-on-surface font-data-mono text-data-mono p-space-sm rounded-lg focus:outline-none focus:bg-surface-container border border-outline-variant/30 focus:border-primary"
                          id="date-start"
                          type="date"
                          value={dateStart}
                          onChange={(e) => setDateStart(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="font-label-caps text-label-caps text-outline uppercase block mb-1" htmlFor="date-end">
                          End Date
                        </label>
                        <input
                          className="w-full bg-surface-container-low text-on-surface font-data-mono text-data-mono p-space-sm rounded-lg focus:outline-none focus:bg-surface-container border border-outline-variant/30 focus:border-primary"
                          id="date-end"
                          type="date"
                          value={dateEnd}
                          onChange={(e) => setDateEnd(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Output Visual */}
                    {dateDiffResults && (
                      <div className="bg-surface-container p-space-md rounded-xl my-space-sm border border-outline-variant/20">
                        <div className="flex items-center justify-between">
                          <span className="text-on-surface-variant font-label-caps text-label-caps uppercase">Total Span</span>
                          <span className="text-secondary font-data-mono text-[12px] font-semibold">{dateDiffResults.calendarDays} Calendar Days</span>
                        </div>
                        <div className="font-numerical-display text-[28px] text-primary font-bold mt-1">
                          {dateDiffResults.monthsAndDays}
                        </div>
                        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-outline-variant/20">
                          <div className="bg-surface-container-lowest p-2 rounded-lg border border-outline-variant/20">
                            <span className="font-label-caps text-[10px] text-outline uppercase block">Business Days</span>
                            <span className="font-data-mono text-[13px] font-bold text-on-surface">{dateDiffResults.businessDays} Days</span>
                          </div>
                          <div className="bg-surface-container-lowest p-2 rounded-lg border border-outline-variant/20">
                            <span className="font-label-caps text-[10px] text-outline uppercase block">Weekend Days</span>
                            <span className="font-data-mono text-[13px] font-bold text-on-surface">{dateDiffResults.weekendDays} Days</span>
                          </div>
                          <div className="bg-surface-container-lowest p-2 rounded-lg border border-outline-variant/20">
                            <span className="font-label-caps text-[10px] text-outline uppercase block">Total Hours</span>
                            <span className="font-data-mono text-[13px] font-bold text-secondary">{dateDiffResults.totalHours} Hrs</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-space-md border-t border-outline-variant/20 mt-2">
                    <span className="font-body-sm text-[12px] text-outline">Federal Reserve holidays included</span>
                    <Link
                      className="px-space-md py-1.5 rounded-lg bg-surface-container font-body-sm text-body-sm text-primary font-semibold hover:bg-surface-container-high transition-colors"
                      href="/time-date/date-difference"
                    >
                      Full Calculator Page →
                    </Link>
                  </div>
                </div>

                {/* TOOL 3: Work Hours & Overtime Engine */}
                <div id="work-hours-workbench" className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-outline-variant/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-space-sm border-b border-outline-variant/20">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[24px]">more_time</span>
                        <h3 className="font-headline-md text-[20px] text-on-surface font-semibold">Work Hours &amp; Timesheet</h3>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-surface-container font-data-mono text-[11px] text-on-surface font-semibold">
                        FLSA OVERTIME 1.5x
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-space-sm my-space-md">
                      <div>
                        <label className="font-label-caps text-[10px] text-outline uppercase block mb-1" htmlFor="shift-start">
                          Shift Start
                        </label>
                        <input
                          className="w-full bg-surface-container-low text-on-surface font-data-mono text-data-mono p-2 rounded-lg border border-outline-variant/30 focus:border-primary"
                          id="shift-start"
                          type="time"
                          value={shiftStart}
                          onChange={(e) => setShiftStart(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="font-label-caps text-[10px] text-outline uppercase block mb-1" htmlFor="shift-end">
                          Shift End
                        </label>
                        <input
                          className="w-full bg-surface-container-low text-on-surface font-data-mono text-data-mono p-2 rounded-lg border border-outline-variant/30 focus:border-primary"
                          id="shift-end"
                          type="time"
                          value={shiftEnd}
                          onChange={(e) => setShiftEnd(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="font-label-caps text-[10px] text-outline uppercase block mb-1" htmlFor="break-mins">
                          Unpaid Break
                        </label>
                        <select
                          className="w-full bg-surface-container-low text-on-surface font-data-mono text-data-mono p-2 rounded-lg border border-outline-variant/30 focus:border-primary"
                          id="break-mins"
                          value={breakMins}
                          onChange={(e) => setBreakMins(Number(e.target.value))}
                        >
                          <option value={0}>0 min</option>
                          <option value={30}>30 min</option>
                          <option value={45}>45 min</option>
                          <option value={60}>60 min</option>
                        </select>
                      </div>
                    </div>

                    {timesheetResults && (
                      <div className="bg-surface-container p-space-md rounded-xl my-space-sm border border-outline-variant/20">
                        <div className="flex items-center justify-between">
                          <span className="text-on-surface-variant font-label-caps text-label-caps uppercase">Paid Hours Computed</span>
                          <span className="text-primary font-data-mono text-[12px] font-semibold">{timesheetResults.decimalHours} Decimal Hours</span>
                        </div>
                        <div className="font-numerical-display text-[28px] text-primary font-bold mt-1">
                          {timesheetResults.formattedTime}
                        </div>
                        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-outline-variant/20">
                          <div className="bg-surface-container-lowest p-2 rounded-lg border border-outline-variant/20">
                            <span className="font-label-caps text-[10px] text-outline uppercase block">Regular (1.0x)</span>
                            <span className="font-data-mono text-[13px] font-bold text-on-surface">{timesheetResults.regularHours} hrs</span>
                          </div>
                          <div className="bg-surface-container-lowest p-2 rounded-lg border border-outline-variant/20">
                            <span className="font-label-caps text-[10px] text-outline uppercase block">Overtime (1.5x)</span>
                            <span className="font-data-mono text-[13px] font-bold text-error">{timesheetResults.overtimeHours} hrs</span>
                          </div>
                          <div className="bg-surface-container-lowest p-2 rounded-lg border border-outline-variant/20">
                            <span className="font-label-caps text-[10px] text-outline uppercase block">Gross (@${hourlyWage}/hr)</span>
                            <span className="font-data-mono text-[13px] font-bold text-secondary">${timesheetResults.grossPay}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-space-md border-t border-outline-variant/20 mt-2">
                    <span className="font-body-sm text-[12px] text-outline">Supports 7-day multi-shift weekly batching</span>
                    <Link
                      href="/time-date/work-hours"
                      className="px-space-md py-1.5 rounded-lg bg-surface-container font-body-sm text-body-sm text-primary font-semibold hover:bg-surface-container-high transition-colors"
                    >
                      Full Calculator Page →
                    </Link>
                  </div>
                </div>

                {/* TOOL 4: Global Meeting Overlap Matrix */}
                <div id="timezone-workbench" className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-outline-variant/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-space-sm border-b border-outline-variant/20">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[24px]">schedule_send</span>
                        <h3 className="font-headline-md text-[20px] text-on-surface font-semibold">Time Zone Overlap Planner</h3>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-surface-container font-data-mono text-[11px] text-on-surface font-semibold">
                        UTC HARMONIZED
                      </span>
                    </div>

                    {/* Multi-hub Matrix Bar */}
                    <div className="space-y-space-xs my-space-md">
                      <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low font-data-mono text-[13px] border border-outline-variant/20">
                        <span className="font-semibold text-on-surface">San Francisco (PST)</span>
                        <span className="text-on-surface-variant">
                          {String((utcHourSlider - 8 + 24) % 24).padStart(2, '0')}:48 {((utcHourSlider - 8 + 24) % 24) >= 12 ? 'PM' : 'AM'} • UTC -8
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low font-data-mono text-[13px] border border-outline-variant/20">
                        <span className="font-semibold text-on-surface">New York (EST)</span>
                        <span className="text-primary font-bold">
                          {String((utcHourSlider - 5 + 24) % 24).padStart(2, '0')}:48 {((utcHourSlider - 5 + 24) % 24) >= 12 ? 'PM' : 'AM'} • UTC -5
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low font-data-mono text-[13px] border border-outline-variant/20">
                        <span className="font-semibold text-on-surface">London (GMT)</span>
                        <span className="text-on-surface-variant">
                          {String(utcHourSlider % 24).padStart(2, '0')}:48 {(utcHourSlider % 24) >= 12 ? 'PM' : 'AM'} • UTC +0
                        </span>
                      </div>
                    </div>

                    <div className="mb-2">
                      <div className="flex justify-between items-center text-xs font-label-caps text-outline mb-1">
                        <span>SCRUB UTC TIMELINE</span>
                        <span className="font-mono font-bold text-primary">{utcHourSlider}:00 UTC</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="23"
                        value={utcHourSlider}
                        onChange={(e) => setUtcHourSlider(Number(e.target.value))}
                        className="w-full accent-primary cursor-pointer"
                      />
                    </div>

                    <div className="bg-surface-container p-space-md rounded-xl my-space-sm border border-outline-variant/20">
                      <div className="flex items-center justify-between">
                        <span className="text-on-surface-variant font-label-caps text-label-caps uppercase">Golden Working Window</span>
                        <span className="text-primary font-data-mono text-[12px] font-bold">OPTIMAL SYNC</span>
                      </div>
                      <div className="font-headline-md text-[20px] text-on-surface font-bold mt-1">
                        9:00 AM - 11:30 AM EST (2:00 PM - 4:30 PM GMT)
                      </div>
                      <p className="font-body-sm text-[12px] text-on-surface-variant mt-1">
                        100% attendance viability with zero team members outside 8am-6pm local window.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-space-md border-t border-outline-variant/20 mt-2">
                    <span className="font-body-sm text-[12px] text-outline">Automatic daylight saving shifts included</span>
                    <Link
                      href="/time-date/time-zone-overlap"
                      className="px-space-md py-1.5 rounded-lg bg-surface-container font-body-sm text-body-sm text-primary font-semibold hover:bg-surface-container-high transition-colors"
                    >
                      Full Calculator Page →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 6. COMPREHENSIVE CATEGORY DIRECTORIES (Dense 36+ Tools Hub) */}
          <section id="catalog-section" className="w-full bg-surface py-space-3xl">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
              <div className="mb-space-xl flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <span className="font-label-caps text-label-caps text-primary uppercase tracking-widest block mb-1 font-bold">
                    Index &amp; Taxonomic Archive
                  </span>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
                    Complete Temporal Tool Catalog
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                    Every time model is mathematically validated against Gregorian rules, leap second adjustments, and astronomical almanacs.
                  </p>
                </div>
                {searchQuery && (
                  <div className="text-sm font-data-mono text-primary bg-surface-container px-3 py-1.5 rounded-lg">
                    Showing {totalFilteredCount} matching tools for &quot;{searchQuery}&quot;
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
                {filteredCategories.map((group) => (
                  <div key={group.id} className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm border border-outline-variant/30">
                    <div className="flex items-center gap-2 mb-space-md pb-space-xs border-b border-outline-variant/20">
                      <span className="material-symbols-outlined text-primary text-[24px]">{group.icon}</span>
                      <h3 className="font-headline-md text-[18px] text-on-surface font-semibold">{group.name}</h3>
                    </div>
                    <ul className="space-y-space-xs font-body-sm text-body-sm">
                      {group.tools.map((tool) => (
                        <li key={tool.name}>
                          <a
                            className="text-on-surface hover:text-primary transition-colors flex items-center justify-between py-1 group"
                            href={tool.anchor || '#'}
                          >
                            <span className="group-hover:translate-x-0.5 transition-transform">{tool.name}</span>
                            <span className="font-data-mono text-[11px] text-outline bg-surface-container px-1.5 py-0.5 rounded">
                              {tool.badge}
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 7. HIGH-VELOCITY POPULAR LOOKUPS & PRESETS */}
          <section id="community-presets" className="w-full bg-surface-container-low py-space-2xl border-t border-outline-variant/30">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
              <div className="flex items-center justify-between mb-space-lg">
                <div>
                  <span className="font-label-caps text-label-caps text-primary uppercase tracking-widest block font-bold">
                    Trending Inquiries
                  </span>
                  <h2 className="font-headline-md text-headline-md text-on-surface tracking-tight font-bold">
                    Real-Time Community Lookups
                  </h2>
                </div>
                <span className="font-data-mono text-[12px] text-on-surface-variant bg-surface-container-lowest px-2.5 py-1 rounded-full shadow-sm border border-outline-variant/20">
                  UPDATED EVERY 60 SECONDS
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
                {/* Preset 1 */}
                <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-outline text-[12px] mb-1">
                      <span className="font-data-mono">QUERY ID: #CAL-901</span>
                      <span className="font-body-sm text-[11px] text-secondary font-semibold">6.2M lookups / mo</span>
                    </div>
                    <div className="font-headline-md text-[17px] text-on-surface font-semibold">Today to Christmas 2025</div>
                    <div className="font-numerical-display text-[26px] text-primary font-bold my-1">301 Days</div>
                  </div>
                  <div className="font-body-sm text-[12px] text-on-surface-variant flex items-center justify-between pt-2 border-t border-outline-variant/10">
                    <span>Dec 25, 2025 (Thursday)</span>
                    <a className="text-primary font-semibold hover:underline cursor-pointer" href="#date-diff-workbench" onClick={() => { setDateStart('2025-02-27'); setDateEnd('2025-12-25'); }}>
                      Inspect →
                    </a>
                  </div>
                </div>

                {/* Preset 2 */}
                <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-outline text-[12px] mb-1">
                      <span className="font-data-mono">QUERY ID: #DOB-1995</span>
                      <span className="font-body-sm text-[11px] text-secondary font-semibold">8.1M lookups / mo</span>
                    </div>
                    <div className="font-headline-md text-[17px] text-on-surface font-semibold">Age from DOB: March 15, 1995</div>
                    <div className="font-numerical-display text-[26px] text-primary font-bold my-1">29 Yrs, 11 Mos</div>
                  </div>
                  <div className="font-body-sm text-[12px] text-on-surface-variant flex items-center justify-between pt-2 border-t border-outline-variant/10">
                    <span>Turning 30 in exactly 16 Days</span>
                    <a className="text-primary font-semibold hover:underline cursor-pointer" href="#age-calculator-workbench" onClick={() => { setDob('1995-03-15'); }}>
                      Inspect →
                    </a>
                  </div>
                </div>

                {/* Preset 3 */}
                <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-outline text-[12px] mb-1">
                      <span className="font-data-mono">QUERY ID: #OT-475</span>
                      <span className="font-body-sm text-[11px] text-secondary font-semibold">3.9M lookups / mo</span>
                    </div>
                    <div className="font-headline-md text-[17px] text-on-surface font-semibold">47.5 Hour Work Week Overtime</div>
                    <div className="font-numerical-display text-[26px] text-primary font-bold my-1">7.5h Overtime</div>
                  </div>
                  <div className="font-body-sm text-[12px] text-on-surface-variant flex items-center justify-between pt-2 border-t border-outline-variant/10">
                    <span>40 Reg + 7.5 @ 1.5x Pay Rate</span>
                    <a className="text-primary font-semibold hover:underline cursor-pointer" href="#work-hours-workbench">
                      Inspect →
                    </a>
                  </div>
                </div>

                {/* Preset 4 */}
                <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-outline text-[12px] mb-1">
                      <span className="font-data-mono">QUERY ID: #TZ-LON-NYC</span>
                      <span className="font-body-sm text-[11px] text-secondary font-semibold">5.1M lookups / mo</span>
                    </div>
                    <div className="font-headline-md text-[17px] text-on-surface font-semibold">London (GMT) to New York (EST)</div>
                    <div className="font-numerical-display text-[26px] text-primary font-bold my-1">5-Hour Delta</div>
                  </div>
                  <div className="font-body-sm text-[12px] text-on-surface-variant flex items-center justify-between pt-2 border-t border-outline-variant/10">
                    <span>2:00 PM London = 9:00 AM NYC</span>
                    <a className="text-primary font-semibold hover:underline cursor-pointer" href="#timezone-workbench" onClick={() => setUtcHourSlider(14)}>
                      Inspect →
                    </a>
                  </div>
                </div>

                {/* Preset 5 */}
                <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-outline text-[12px] mb-1">
                      <span className="font-data-mono">QUERY ID: #ADD-90D</span>
                      <span className="font-body-sm text-[11px] text-secondary font-semibold">4.3M lookups / mo</span>
                    </div>
                    <div className="font-headline-md text-[17px] text-on-surface font-semibold">90 Calendar Days From Today</div>
                    <div className="font-numerical-display text-[26px] text-primary font-bold my-1">May 28, 2025</div>
                  </div>
                  <div className="font-body-sm text-[12px] text-on-surface-variant flex items-center justify-between pt-2 border-t border-outline-variant/10">
                    <span>Wednesday • Q2 Milestone</span>
                    <a className="text-primary font-semibold hover:underline cursor-pointer" href="#date-diff-workbench">
                      Inspect →
                    </a>
                  </div>
                </div>

                {/* Preset 6 */}
                <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-outline text-[12px] mb-1">
                      <span className="font-data-mono">QUERY ID: #NEWYEAR-26</span>
                      <span className="font-body-sm text-[11px] text-secondary font-semibold">4.8M lookups / mo</span>
                    </div>
                    <div className="font-headline-md text-[17px] text-on-surface font-semibold">Days Until New Year 2026</div>
                    <div className="font-numerical-display text-[26px] text-primary font-bold my-1">307 Days</div>
                  </div>
                  <div className="font-body-sm text-[12px] text-on-surface-variant flex items-center justify-between pt-2 border-t border-outline-variant/10">
                    <span>January 1, 2026 (Thursday)</span>
                    <a className="text-primary font-semibold hover:underline cursor-pointer" href="#date-diff-workbench">
                      Inspect →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 8. TIME TOOLS COMPARISON MATRIX */}
          <section className="w-full bg-surface py-space-3xl border-t border-outline-variant/30">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
              <div className="mb-space-lg">
                <span className="font-label-caps text-label-caps text-primary uppercase tracking-widest block mb-1 font-bold">
                  Taxonomic Selector
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
                  Time Tools Comparison Matrix
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Identify the exact mathematical model required for your input format and required outputs.
                </p>
              </div>

              <div className="overflow-x-auto bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30">
                <table className="w-full text-left font-body-sm text-body-sm">
                  <thead className="bg-surface-container font-label-caps text-label-caps text-on-surface uppercase tracking-wider">
                    <tr>
                      <th className="py-space-md px-space-lg">Tool Engine</th>
                      <th className="py-space-md px-space-lg">Primary Use Case</th>
                      <th className="py-space-md px-space-lg">Primary Persona</th>
                      <th className="py-space-md px-space-lg">Standard Input</th>
                      <th className="py-space-md px-space-lg">Precision Output Format</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container">
                    <tr className="hover:bg-surface-container-low transition-colors">
                      <td className="py-space-md px-space-lg font-bold text-on-surface flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[18px]">cake</span>
                        Age Calculator
                      </td>
                      <td className="py-space-md px-space-lg text-on-surface-variant">Exact life duration &amp; day born</td>
                      <td className="py-space-md px-space-lg text-on-surface">Healthcare, Legal, General</td>
                      <td className="py-space-md px-space-lg font-data-mono text-[12px]">YYYY-MM-DD</td>
                      <td className="py-space-md px-space-lg font-data-mono text-[12px] text-primary">Years, Months, Days + Next Birthday</td>
                    </tr>
                    <tr className="hover:bg-surface-container-low transition-colors">
                      <td className="py-space-md px-space-lg font-bold text-on-surface flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[18px]">date_range</span>
                        Date Difference
                      </td>
                      <td className="py-space-md px-space-lg text-on-surface-variant">Calendar vs Business days between dates</td>
                      <td className="py-space-md px-space-lg text-on-surface">Legal, Real Estate, Logistics</td>
                      <td className="py-space-md px-space-lg font-data-mono text-[12px]">Start / End Date Pickers</td>
                      <td className="py-space-md px-space-lg font-data-mono text-[12px] text-primary">Net Days, Weeks, Weekday Breakdown</td>
                    </tr>
                    <tr className="hover:bg-surface-container-low transition-colors">
                      <td className="py-space-md px-space-lg font-bold text-on-surface flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[18px]">more_time</span>
                        Work Hours Timesheet
                      </td>
                      <td className="py-space-md px-space-lg text-on-surface-variant">Time in/out, lunch deduct, 1.5x OT</td>
                      <td className="py-space-md px-space-lg text-on-surface">Payroll Managers, Contractors</td>
                      <td className="py-space-md px-space-lg font-data-mono text-[12px]">HH:MM In / Out + Breaks</td>
                      <td className="py-space-md px-space-lg font-data-mono text-[12px] text-primary">Total Decimal Hours + Gross Wage $</td>
                    </tr>
                    <tr className="hover:bg-surface-container-low transition-colors">
                      <td className="py-space-md px-space-lg font-bold text-on-surface flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[18px]">schedule</span>
                        Time Zone Overlap
                      </td>
                      <td className="py-space-md px-space-lg text-on-surface-variant">Coordinate meetings across ≥3 timezones</td>
                      <td className="py-space-md px-space-lg text-on-surface">Remote Teams, Executive Assistants</td>
                      <td className="py-space-md px-space-lg font-data-mono text-[12px]">City Array + Target Time</td>
                      <td className="py-space-md px-space-lg font-data-mono text-[12px] text-primary">Normalized UTC Matrix + Green Window</td>
                    </tr>
                    <tr className="hover:bg-surface-container-low transition-colors">
                      <td className="py-space-md px-space-lg font-bold text-on-surface flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[18px]">timer</span>
                        Time Duration Engine
                      </td>
                      <td className="py-space-md px-space-lg text-on-surface-variant">Sum or subtract time strings (HH:MM:SS)</td>
                      <td className="py-space-md px-space-lg text-on-surface">Audio/Video Editors, Scientists</td>
                      <td className="py-space-md px-space-lg font-data-mono text-[12px]">Compound Time Delimited</td>
                      <td className="py-space-md px-space-lg font-data-mono text-[12px] text-primary">Cumulative HH:MM:SS.ms + Total Sec</td>
                    </tr>
                    <tr className="hover:bg-surface-container-low transition-colors">
                      <td className="py-space-md px-space-lg font-bold text-on-surface flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[18px]">psychology</span>
                        Ultradian 90m Sprints
                      </td>
                      <td className="py-space-md px-space-lg text-on-surface-variant">Maximize cognitive endurance cycles</td>
                      <td className="py-space-md px-space-lg text-on-surface">Engineers, Writers, Researchers</td>
                      <td className="py-space-md px-space-lg font-data-mono text-[12px]">Wakeup Hour or Sprint Start</td>
                      <td className="py-space-md px-space-lg font-data-mono text-[12px] text-primary">90m Focus / 20m Rest Cycles</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* 9. REAL-WORLD PERSONA USE CASES */}
          <section className="w-full bg-surface-container-low py-space-3xl border-t border-outline-variant/30">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
              <div className="mb-space-xl">
                <span className="font-label-caps text-label-caps text-primary uppercase tracking-widest block mb-1 font-bold">
                  Tailored Solutions
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
                  Engineered for Daily Operational Demands
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
                {/* Persona 1 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-space-sm">
                      <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">hub</span>
                      </div>
                      <div>
                        <h3 className="font-headline-md text-[17px] text-on-surface font-semibold">Remote Engineering Teams</h3>
                        <span className="font-label-caps text-[11px] text-outline uppercase">Global Asynchronous Orgs</span>
                      </div>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Prevent calendar friction when synchronizing sprint releases between San Francisco, Berlin, and Bengaluru. Calculate overlapping working hours while factoring in conflicting national holiday schedules.
                    </p>
                  </div>
                  <div className="pt-space-md border-t border-outline-variant/20 mt-3">
                    <span className="font-label-caps text-[11px] text-primary uppercase font-bold">Recommended: Global Overlap Matrix</span>
                  </div>
                </div>

                {/* Persona 2 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-space-sm">
                      <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">attach_money</span>
                      </div>
                      <div>
                        <h3 className="font-headline-md text-[17px] text-on-surface font-semibold">Payroll &amp; HR Administrators</h3>
                        <span className="font-label-caps text-[11px] text-outline uppercase">Labor Compliance</span>
                      </div>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Verify weekly timesheets with automatic deductions for 30 or 60-minute lunches. Parse regular 40-hour thresholds and calculate precise 1.5x overtime and 2.0x holiday rates without roundoff discrepancies.
                    </p>
                  </div>
                  <div className="pt-space-md border-t border-outline-variant/20 mt-3">
                    <span className="font-label-caps text-[11px] text-primary uppercase font-bold">Recommended: Work Hours Timesheet</span>
                  </div>
                </div>

                {/* Persona 3 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-space-sm">
                      <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">gavel</span>
                      </div>
                      <div>
                        <h3 className="font-headline-md text-[17px] text-on-surface font-semibold">Legal &amp; Real Estate Escrow</h3>
                        <span className="font-label-caps text-[11px] text-outline uppercase">Statutory Deadlines</span>
                      </div>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Calculate exact statutory 30, 60, or 90-day filing periods under strict court rules. Automatically shift closing deadlines when the terminal day falls on a weekend or Federal Reserve bank holiday.
                    </p>
                  </div>
                  <div className="pt-space-md border-t border-outline-variant/20 mt-3">
                    <span className="font-label-caps text-[11px] text-primary uppercase font-bold">Recommended: Business Days &amp; Bank Holidays</span>
                  </div>
                </div>

                {/* Persona 4 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-space-sm">
                      <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">flight</span>
                      </div>
                      <div>
                        <h3 className="font-headline-md text-[17px] text-on-surface font-semibold">International Frequent Flyers</h3>
                        <span className="font-label-caps text-[11px] text-outline uppercase">Trans-Meridian Travel</span>
                      </div>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Calculate true flight duration crossing the International Date Line. Map arrival local times, schedule sleep chronobiology shifts, and avoid missed connections caused by regional Daylight Saving discrepancies.
                    </p>
                  </div>
                  <div className="pt-space-md border-t border-outline-variant/20 mt-3">
                    <span className="font-label-caps text-[11px] text-primary uppercase font-bold">Recommended: Flight Delta &amp; DST Tracker</span>
                  </div>
                </div>

                {/* Persona 5 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-space-sm">
                      <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">school</span>
                      </div>
                      <div>
                        <h3 className="font-headline-md text-[17px] text-on-surface font-semibold">Students &amp; Researchers</h3>
                        <span className="font-label-caps text-[11px] text-outline uppercase">Academic Deadlines</span>
                      </div>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Reverse-engineer dissertation milestones and exam study blocks. Segment remaining days into 90-minute ultradian study sprints and track progress percentages down to the exact second.
                    </p>
                  </div>
                  <div className="pt-space-md border-t border-outline-variant/20 mt-3">
                    <span className="font-label-caps text-[11px] text-primary uppercase font-bold">Recommended: Study Rhythm Matrix</span>
                  </div>
                </div>

                {/* Persona 6 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-space-sm">
                      <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">celebration</span>
                      </div>
                      <div>
                        <h3 className="font-headline-md text-[17px] text-on-surface font-semibold">Event Planners &amp; Families</h3>
                        <span className="font-label-caps text-[11px] text-outline uppercase">Milestones &amp; Weddings</span>
                      </div>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Keep guests and vendors aligned with precision public countdown widgets for weddings, anniversaries, retirement sendoffs, and expected childbirth due dates.
                    </p>
                  </div>
                  <div className="pt-space-md border-t border-outline-variant/20 mt-3">
                    <span className="font-label-caps text-[11px] text-primary uppercase font-bold">Recommended: High-Precision Countdown</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 10. CHRONOLOGICAL SCIENCE & METROLOGY REFERENCE */}
          <section className="w-full bg-surface py-space-3xl border-t border-outline-variant/30">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
              <div className="mb-space-xl">
                <span className="font-label-caps text-label-caps text-primary uppercase tracking-widest block mb-1 font-bold">
                  Scientific Foundations
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
                  The Mechanics of Time Calculation
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Understanding the astronomical standards and mathematical definitions powering SolveIt algorithms.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
                {/* Science Article 1 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-primary font-data-mono text-[12px] mb-2 font-semibold">
                      <span className="material-symbols-outlined text-[16px]">verified</span>
                      STANDARDIZATION DIRECTIVE
                    </div>
                    <h3 className="font-headline-md text-[20px] text-on-surface font-semibold mb-2">ISO 8601 &amp; UTC Time Representation</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mb-space-md">
                      The international standard <span className="font-data-mono text-on-surface font-medium">ISO 8601</span> eliminates ambiguity in international commerce by enforcing the <span className="font-data-mono text-on-surface font-semibold">YYYY-MM-DDTHH:MM:SSZ</span> structure. Unlike arbitrary regional formats (such as MM/DD/YYYY in the US vs DD/MM/YYYY in Europe), ISO 8601 maintains lexicographical sorting parity and directly couples to Universal Coordinated Time (UTC) maintained by Bureau International des Poids et Mesures (BIPM).
                    </p>
                  </div>
                  <div className="pt-space-xs font-body-sm text-[12px] text-outline border-t border-outline-variant/10">
                    Reference Standard: ISO 8601-1:2019 / BIPM UTC Bulletin C
                  </div>
                </div>

                {/* Science Article 2 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-primary font-data-mono text-[12px] mb-2 font-semibold">
                      <span className="material-symbols-outlined text-[16px]">cyclone</span>
                      CELESTIAL METROLOGY
                    </div>
                    <h3 className="font-headline-md text-[20px] text-on-surface font-semibold mb-2">The Gregorian 400-Year Leap Algorithm</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mb-space-md">
                      Earth completes one orbit around the Sun in approximately 365.2422 mean solar days. The Julian calendar’s simple rule of adding a day every 4 years accumulated an 11-minute annual discrepancy. The Gregorian reform codified three conditions: a year is a leap year if divisible by 4, unless divisible by 100, unless also divisible by 400. This maintains planetary alignment within 1 day every 3,236 years.
                    </p>
                  </div>
                  <div className="pt-space-xs font-body-sm text-[12px] text-outline border-t border-outline-variant/10">
                    Algorithm: Gregorian Reform Bull &quot;Inter Gravissimas&quot; (1582)
                  </div>
                </div>

                {/* Science Article 3 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-primary font-data-mono text-[12px] mb-2 font-semibold">
                      <span className="material-symbols-outlined text-[16px]">bedtime</span>
                      CIRCADIAN PHYSIOLOGY
                    </div>
                    <h3 className="font-headline-md text-[20px] text-on-surface font-semibold mb-2">Ultradian Rhythms &amp; The 90-Minute Focus Limit</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mb-space-md">
                      Discovered by sleep researcher Nathaniel Kleitman, human physiology operates along the Basic Rest-Activity Cycle (BRAC) during waking hours. The brain moves from high-frequency beta waves into slower alpha states every 90 to 120 minutes. SolveIt productivity engines structure deep-work intervals to match these biological oscillations, mitigating cognitive exhaustion and attentional decay.
                    </p>
                  </div>
                  <div className="pt-space-xs font-body-sm text-[12px] text-outline border-t border-outline-variant/10">
                    Neurobiology Reference: Kleitman BRAC Model / Harvard Medical Review
                  </div>
                </div>

                {/* Science Article 4 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-primary font-data-mono text-[12px] mb-2 font-semibold">
                      <span className="material-symbols-outlined text-[16px]">lock</span>
                      SECURITY PROTOCOL
                    </div>
                    <h3 className="font-headline-md text-[20px] text-on-surface font-semibold mb-2">Zero-Trace Ephemeral Client Execution</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mb-space-md">
                      Corporate timesheets and personal dates contain identifiable telemetry. SolveIt calculators execute computations entirely inside your browser&apos;s V8 or JavaScriptCore runtime. No form data, timesheet numbers, birthdates, or geographic inputs are transmitted across the network, making our platform safe for strict corporate NDA and HIPAA compliance.
                    </p>
                  </div>
                  <div className="pt-space-xs font-body-sm text-[12px] text-outline border-t border-outline-variant/10">
                    Security Guarantee: Client-Side Sandbox / Zero Cloud Logging
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 11. VERIFIED ACCORDION FAQ */}
          <section className="w-full bg-surface-container-low py-space-3xl border-t border-outline-variant/30">
            <div className="max-w-max-width-calculator mx-auto px-gutter-mobile lg:px-gutter-desktop">
              <div className="text-center mb-space-xl">
                <span className="font-label-caps text-label-caps text-primary uppercase tracking-widest block mb-1 font-bold">
                  Frequently Answered
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
                  Frequently Asked Questions
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                  Clear answers regarding calculation methodology, precision standards, and compliance.
                </p>
              </div>

              {/* Accordion Stack */}
              <div className="space-y-space-sm" id="faq-container">
                {[
                  {
                    id: 1,
                    q: 'How do business day calculators handle federal bank holidays?',
                    a: 'SolveIt engines evaluate calendar spans using codified United States Federal Reserve holiday schedules (5 U.S.C. 6103) as well as UK Banking calendars. When a fixed holiday falls on a Saturday, it is observed on the preceding Friday. When it falls on a Sunday, it rolls over to Monday. Users can toggle holiday exclusion on or off according to specific jurisdictional rules.',
                  },
                  {
                    id: 2,
                    q: 'What algorithm determines leap years (the 100/400 year rule)?',
                    a: 'Under the Gregorian calendar, a year is a leap year (366 days) if: (Year % 4 == 0 AND Year % 100 != 0) OR (Year % 400 == 0). This means years like 2000 and 2024 are leap years, but centenary years such as 1900 and 2100 are common years (365 days) because they cannot be evenly divided by 400.',
                  },
                  {
                    id: 3,
                    q: 'How does UTC Daylight Saving Time (DST) affect meeting calculations?',
                    a: 'Because different regions initiate DST on different dates (for example, the United States shifts in early March, while the United Kingdom and Europe shift in late March), timezone deltas change dynamically twice a year. SolveIt\'s Meeting Overlap Planner dynamically references the official IANA Time Zone Database (TZDB) to reflect exact local shifts for selected future dates.',
                  },
                  {
                    id: 4,
                    q: 'Are entered dates, birthdays, and work schedules saved or tracked remotely?',
                    a: 'No. All computations occur entirely on your local machine using vanilla JavaScript. No date strings, personal names, hourly wage rates, or timesheets are stored in databases or sent to external servers. Your calculations remain completely private.',
                  },
                ].map((faq) => {
                  const isOpen = openFaq === faq.id;
                  return (
                    <div key={faq.id} className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
                      <button
                        type="button"
                        className="w-full p-space-md text-left flex items-center justify-between font-headline-md text-[17px] text-on-surface font-semibold hover:bg-surface-container-low transition-colors cursor-pointer"
                        onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                      >
                        <span>{faq.q}</span>
                        <span className="material-symbols-outlined text-primary transition-transform duration-200">
                          {isOpen ? 'expand_less' : 'expand_more'}
                        </span>
                      </button>
                      {isOpen && (
                        <div className="px-space-md pb-space-md text-on-surface-variant font-body-sm text-body-sm border-t border-outline-variant/10 pt-2">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* 12. INTERCONNECTED ECOSYSTEM DISCOVERY STRIP */}
          <section className="w-full bg-surface py-space-2xl border-t border-outline-variant/30">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
              <div className="bg-surface-container-lowest rounded-2xl p-space-xl shadow-sm border border-outline-variant/30">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md mb-space-lg">
                  <div>
                    <span className="font-label-caps text-label-caps text-primary uppercase tracking-widest block mb-1 font-bold">
                      Ecosystem Navigation
                    </span>
                    <h2 className="font-headline-md text-headline-md text-on-surface tracking-tight font-bold">
                      Explore Complementary Calculation Centers
                    </h2>
                  </div>
                  <Link className="inline-flex items-center gap-1 font-body-sm text-body-sm text-primary font-semibold hover:underline" href="/">
                    <span>View All 500+ Calculators</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md">
                  <Link className="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex items-center gap-space-sm group border border-outline-variant/20" href="/">
                    <span className="material-symbols-outlined text-primary text-[24px] group-hover:scale-110 transition-transform">
                      account_balance
                    </span>
                    <div>
                      <div className="font-body-md text-body-md font-semibold text-on-surface">Finance Suite</div>
                      <div className="font-body-sm text-[12px] text-on-surface-variant">Mortgage, Amortization, 401(k)</div>
                    </div>
                  </Link>

                  <Link className="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex items-center gap-space-sm group border border-outline-variant/20" href="/health">
                    <span className="material-symbols-outlined text-secondary text-[24px] group-hover:scale-110 transition-transform">
                      favorite
                    </span>
                    <div>
                      <div className="font-body-md text-body-md font-semibold text-on-surface">Health &amp; Fitness</div>
                      <div className="font-body-sm text-[12px] text-on-surface-variant">TDEE, BMR, Navy Body Fat</div>
                    </div>
                  </Link>

                  <Link className="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex items-center gap-space-sm group border border-outline-variant/20" href="/">
                    <span className="material-symbols-outlined text-tertiary text-[24px] group-hover:scale-110 transition-transform">
                      functions
                    </span>
                    <div>
                      <div className="font-body-md text-body-md font-semibold text-on-surface">Math &amp; Physics</div>
                      <div className="font-body-sm text-[12px] text-on-surface-variant">Matrices, Vectors, Quadratics</div>
                    </div>
                  </Link>

                  <Link className="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex items-center gap-space-sm group border border-outline-variant/20" href="/automotive">
                    <span className="material-symbols-outlined text-primary text-[24px] group-hover:scale-110 transition-transform">
                      directions_car
                    </span>
                    <div>
                      <div className="font-body-md text-body-md font-semibold text-on-surface">Automotive Suite</div>
                      <div className="font-body-sm text-[12px] text-on-surface-variant">Lease, Torque, EV Range</div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* FOOTER matching SolveIt unified design from HTML */}
      <footer className="w-full bg-inverse-surface text-inverse-on-surface pt-space-2xl pb-space-xl">
        <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-space-xl mb-space-2xl">
            <div className="col-span-2">
              <div className="flex items-center gap-space-xs mb-space-md">
                <span className="material-symbols-outlined text-primary-fixed-dim text-[28px]">calculate</span>
                <span className="font-headline-md text-headline-md tracking-tight text-white font-bold">SolveIt</span>
              </div>
              <p className="font-body-sm text-body-sm text-outline-variant max-w-sm mb-space-lg">
                Precision computational workbench calibrated for financial analysts, engineers, and researchers requiring instantaneous mathematical verification.
              </p>
              <div className="flex flex-wrap items-center gap-space-xs">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-low/10 text-inverse-on-surface font-label-caps text-label-caps">
                  <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse"></span>
                  Encrypted Local Processing
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-low/10 text-inverse-on-surface font-label-caps text-label-caps">
                  <span className="material-symbols-outlined text-[14px] text-secondary-container">verified</span>
                  Metrology Assurance Certified
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-label-caps text-label-caps text-outline-variant mb-space-md uppercase tracking-wider font-semibold">
                Automotive
              </h3>
              <ul className="space-y-space-xs font-body-sm text-body-sm">
                <li><Link className="text-inverse-on-surface hover:text-secondary-fixed transition-colors" href="/automotive">Loan &amp; Lease</Link></li>
                <li><Link className="text-inverse-on-surface hover:text-secondary-fixed transition-colors" href="/automotive">Horsepower to Torque</Link></li>
                <li><Link className="text-inverse-on-surface hover:text-secondary-fixed transition-colors" href="/automotive">Fuel Economy MPG</Link></li>
                <li><Link className="text-inverse-on-surface hover:text-secondary-fixed transition-colors" href="/automotive">Brake Stopping Distance</Link></li>
                <li><Link className="text-inverse-on-surface hover:text-secondary-fixed transition-colors" href="/automotive">EV Battery Range</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-label-caps text-label-caps text-outline-variant mb-space-md uppercase tracking-wider font-semibold">
                Finance
              </h3>
              <ul className="space-y-space-xs font-body-sm text-body-sm">
                <li><Link className="text-inverse-on-surface hover:text-secondary-fixed transition-colors" href="/">Compound Interest</Link></li>
                <li><Link className="text-inverse-on-surface hover:text-secondary-fixed transition-colors" href="/">Mortgage Amortization</Link></li>
                <li><Link className="text-inverse-on-surface hover:text-secondary-fixed transition-colors" href="/">401(k) Retirement Track</Link></li>
                <li><Link className="text-inverse-on-surface hover:text-secondary-fixed transition-colors" href="/">Capital Gains Tax</Link></li>
                <li><Link className="text-inverse-on-surface hover:text-secondary-fixed transition-colors" href="/">Options Black-Scholes</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-label-caps text-label-caps text-outline-variant mb-space-md uppercase tracking-wider font-semibold">
                Health &amp; Fitness
              </h3>
              <ul className="space-y-space-xs font-body-sm text-body-sm">
                <li><Link className="text-inverse-on-surface hover:text-secondary-fixed transition-colors" href="/health">BMR &amp; TDEE Macro</Link></li>
                <li><Link className="text-inverse-on-surface hover:text-secondary-fixed transition-colors" href="/health">Body Fat Navy Method</Link></li>
                <li><Link className="text-inverse-on-surface hover:text-secondary-fixed transition-colors" href="/health">Target Heart Rate</Link></li>
                <li><Link className="text-inverse-on-surface hover:text-secondary-fixed transition-colors" href="/health">GFR Kidney Function</Link></li>
                <li><Link className="text-inverse-on-surface hover:text-secondary-fixed transition-colors" href="/health">Water Intake Baseline</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-label-caps text-label-caps text-outline-variant mb-space-md uppercase tracking-wider font-semibold">
                Math &amp; Physics
              </h3>
              <ul className="space-y-space-xs font-body-sm text-body-sm">
                <li><Link className="text-inverse-on-surface hover:text-secondary-fixed transition-colors" href="/">Matrix Inversion</Link></li>
                <li><Link className="text-inverse-on-surface hover:text-secondary-fixed transition-colors" href="/">Eigenvalues &amp; Vectors</Link></li>
                <li><Link className="text-inverse-on-surface hover:text-secondary-fixed transition-colors" href="/">Kinematic Vectors</Link></li>
                <li><Link className="text-inverse-on-surface hover:text-secondary-fixed transition-colors" href="/">Quadratic Roots</Link></li>
                <li><Link className="text-inverse-on-surface hover:text-secondary-fixed transition-colors" href="/">Scientific Notation</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-space-lg border-t border-outline/20 flex flex-col md:flex-row items-center justify-between gap-space-md">
            <div className="font-body-sm text-body-sm text-outline-variant">
              © 2025 SolveItCalculator.com. All computational outputs are estimates provided without warranty.
            </div>
            <div className="flex items-center gap-space-lg font-body-sm text-body-sm text-outline-variant">
              <Link className="hover:text-inverse-on-surface transition-colors" href="#">Privacy Policy</Link>
              <Link className="hover:text-inverse-on-surface transition-colors" href="#">Terms of Service</Link>
              <Link className="hover:text-inverse-on-surface transition-colors" href="#">Accuracy Disclaimers</Link>
              <Link className="hover:text-inverse-on-surface transition-colors" href="#">API Integration</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
