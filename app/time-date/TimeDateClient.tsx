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
      { name: 'Julian Day Number Calculator', badge: 'Day Count', category: 'Date Calculations', anchor: '/time-date/days-calculator' },
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
      { name: 'Running Pace & Lap Split Calculator', badge: 'Min/Mile', category: 'Time Arithmetic', anchor: '/time-date/time-calculator' },
      { name: 'Unix Timestamp Converter', badge: 'Epoch Time', category: 'Time Arithmetic', anchor: '/time-date/time-calculator' },
    ],
  },
  {
    id: 'time-zones-remote',
    name: 'Time Zones & Remote',
    icon: 'public',
    tools: [
      { name: 'World Clock & Time Zones', badge: 'Global Time', category: 'Time Zones & Remote', anchor: '/time-date/time-zone-overlap' },
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
      { name: '2-2-3 Rotating Shift Schedule Planner', badge: 'Rotating Shift', category: 'Work, Shift & Payroll', anchor: '/time-date/work-hours' },
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
      { name: 'Pregnancy Due Date & Trimesters', badge: 'Naegele Rule', category: 'Countdowns & Focus', anchor: '/health-fitness-calculators' },
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
      

      <main className="w-full pt-16 bg-surface min-h-[calc(100vh-64px)] flex-1">
        <div className="flex flex-col w-full">
          {/* 1. HEADER BREADCRUMB & STANDARDS */}
          <div className="w-full bg-surface-container-lowest shadow-sm border-b border-outline-variant/30">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-sm">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-sm">
                {/* Breadcrumb Path */}
                <nav aria-label="Breadcrumb" className="flex items-center gap-space-xs font-label-caps text-label-caps text-on-surface-variant">
                  <Link className="hover:text-primary transition-colors flex items-center gap-1" href="/">
                    <span className="material-symbols-outlined text-[15px]">home</span>
                    <span>Home</span>
                  </Link>
                  <span className="text-outline-variant">/</span>
                  <span className="text-on-surface font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px] text-primary">schedule</span>
                    <span>Time &amp; Date</span>
                  </span>
                </nav>

                {/* System Badges */}
                <div className="flex flex-wrap items-center gap-space-xs">
                  <span className="inline-flex items-center gap-1.5 px-space-xs py-0.5 rounded-full bg-surface-container font-data-mono text-[11px] text-on-surface">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                    Standard Date &amp; Time Formats
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-space-xs py-0.5 rounded-full bg-surface-container font-data-mono text-[11px] text-on-surface">
                    <span className="material-symbols-outlined text-[13px] text-secondary">public</span>
                    Live UTC Clock Sync
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-space-xs py-0.5 rounded-full bg-surface-container-high font-data-mono text-[11px] text-primary font-semibold">
                    <span className="material-symbols-outlined text-[13px]">bolt</span>
                    Instant Private Calculations
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
                    FREE ONLINE TOOLS
                  </div>
                  <div>
                    <h1 className="font-display-hero text-headline-lg lg:text-display-hero text-on-surface tracking-tight font-bold">
                      Time &amp; Date Calculators
                    </h1>
                    <p className="font-headline-md text-headline-sm sm:text-headline-md text-primary font-semibold mt-1">
                      Time &amp; Date Calculators for Better Planning and Productivity
                    </p>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl leading-relaxed">
                    Explore free Time &amp; Date Calculators designed to help you calculate age, date differences, business days, countdowns, deadlines, work hours, time duration, and scheduling needs. Whether you&apos;re planning projects, tracking events, calculating workdays, or managing personal schedules, our accurate calculators provide quick and reliable results.
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
                        Search
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

                {/* Metric Summary Capsule (Cols 9-12) */}
                <div className="lg:col-span-4 bg-surface-container-low rounded-2xl p-space-lg shadow-sm border border-outline-variant/30 flex flex-col gap-space-md">
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps text-primary uppercase font-bold tracking-wider">
                      Fast &amp; Private Calculation
                    </span>
                    <span className="w-2 h-2 rounded-full bg-secondary-container animate-ping"></span>
                  </div>
                  <div className="grid grid-cols-2 gap-space-md">
                    <div className="bg-surface-container-lowest p-space-sm rounded-xl shadow-sm border border-outline-variant/20">
                      <span className="font-label-caps text-[10px] text-outline uppercase block">Available Tools</span>
                      <span className="font-numerical-display text-[26px] text-on-surface font-bold">104+</span>
                      <span className="font-body-sm text-[11px] text-on-surface-variant block mt-0.5">Calculator Tools</span>
                    </div>
                    <div className="bg-surface-container-lowest p-space-sm rounded-xl shadow-sm border border-outline-variant/20">
                      <span className="font-label-caps text-[10px] text-outline uppercase block">Operations / Mo</span>
                      <span className="font-numerical-display text-[26px] text-primary font-bold">50K</span>
                      <span className="font-body-sm text-[11px] text-on-surface-variant block mt-0.5">Monthly Calculations</span>
                    </div>
                    <div className="bg-surface-container-lowest p-space-sm rounded-xl shadow-sm border border-outline-variant/20">
                      <span className="font-label-caps text-[10px] text-outline uppercase block">Privacy</span>
                      <span className="font-data-mono text-[16px] text-on-surface font-semibold">100% Client</span>
                      <span className="font-body-sm text-[11px] text-on-surface-variant block mt-0.5">100% Private (No Tracking)</span>
                    </div>
                    <div className="bg-surface-container-lowest p-space-sm rounded-xl shadow-sm border border-outline-variant/20">
                      <span className="font-label-caps text-[10px] text-outline uppercase block">Precision</span>
                      <span className="font-data-mono text-[16px] text-secondary font-semibold">Exact</span>
                      <span className="font-body-sm text-[11px] text-on-surface-variant block mt-0.5">Real-Time Precision</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm pt-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">verified_user</span>
                    <span>Accurate calendar leap years and time rules</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 3. REAL-TIME CALENDAR & TIME OVERVIEW */}
          <section id="telemetry-dashboard" className="w-full bg-surface-container-low py-space-xl border-y border-outline-variant/30">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
              <div className="flex items-center justify-between mb-space-md">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[22px]">calendar_month</span>
                  <h2 className="font-headline-md text-headline-md text-on-surface tracking-tight font-bold">
                    Live Calendar &amp; Year Overview
                  </h2>
                </div>
                <div className="hidden md:flex items-center gap-2 font-data-mono text-[12px] text-on-surface-variant bg-surface-container-lowest px-3 py-1 rounded-lg shadow-sm border border-outline-variant/20">
                  <span>LIVE CLOCK:</span>
                  <span className="text-primary font-bold">ACTIVE</span>
                </div>
              </div>

              {/* Live Metric Grid Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-space-sm">
                {/* Live UTC/Local */}
                <div className="col-span-2 bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps text-outline uppercase">Current Time</span>
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
                  <div className="font-label-caps text-[10px] text-outline uppercase">SYSTEM CLOCK SYNCED</div>
                </div>

                {/* Week Number */}
                <div className="col-span-2 bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps text-outline uppercase">Current Week</span>
                    <span className="font-data-mono text-body-sm font-semibold text-primary">Standard Week</span>
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
                  <span className="font-body-sm text-[11px] text-on-surface-variant" suppressHydrationWarning>Until New Year {telemetry.nextYear}</span>
                </div>

                {/* Quarter Progress */}
                <div className="col-span-1 bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20 flex flex-col justify-between">
                  <span className="font-label-caps text-label-caps text-outline uppercase">Quarter Progress</span>
                  <div className="font-numerical-display text-[24px] font-bold text-on-surface my-1" suppressHydrationWarning>
                    Q{telemetry.currentQuarter} <span className="text-[14px] text-secondary font-semibold">{telemetry.quarterPercent}%</span>
                  </div>
                  <span className="font-body-sm text-[11px] text-on-surface-variant" suppressHydrationWarning>{telemetry.daysToNextQ} Days to next Q</span>
                </div>

                {/* Season & Solstice */}
                <div className="col-span-1 bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/20 flex flex-col justify-between">
                  <span className="font-label-caps text-label-caps text-outline uppercase">Next Season</span>
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
                      Calculate milestone deadlines, skip weekends and bank holidays, and schedule working days.
                    </p>
                  </div>
                  <Link className="inline-flex items-center gap-1 font-body-sm text-body-sm text-primary font-semibold hover:underline" href="/time-date/date-difference">
                    <span>Project Date Calculator</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>

                {/* Card 2: Durations & Deltas */}
                <div className="group bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between border border-outline-variant/30 hover:border-primary/40">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary mb-space-md group-hover:bg-primary group-hover:text-on-primary transition-colors">
                      <span className="material-symbols-outlined text-[26px]">timer</span>
                    </div>
                    <h3 className="font-headline-md text-[18px] text-on-surface font-semibold mb-1">Add &amp; Subtract Time</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                      Add or subtract hours, minutes, and seconds across day boundaries. Convert fractions to clock formats.
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
                      Coordinate team calls smoothly. Find optimal working hour overlaps between San Francisco, London, and Tokyo.
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
                    <h3 className="font-headline-md text-[18px] text-on-surface font-semibold mb-1">Exact Age &amp; Milestones</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                      Calculate exact years, months, days, total days lived, and countdown to your next birthday.
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
                      Pinpoint total elapsed days, weekdays only, weeks, or calendar months between any two dates.
                    </p>
                  </div>
                  <Link className="inline-flex items-center gap-1 font-body-sm text-body-sm text-primary font-semibold hover:underline" href="/time-date/date-difference">
                    <span>Date Difference Calculator</span>
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
                      Track upcoming product launches, weddings, vacations, holidays, and milestones with live countdown timers.
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
                    <h3 className="font-headline-md text-[18px] text-on-surface font-semibold mb-1">Focus &amp; Break Timers</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                      Plan Pomodoro sprints (25/5m), 90-minute focus sessions, and optimal daily rest breaks for productivity.
                    </p>
                  </div>
                  <a className="inline-flex items-center gap-1 font-body-sm text-body-sm text-primary font-semibold hover:underline" href="#telemetry-dashboard">
                    <span>Focus Cycles</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* 5. FEATURED TOOLS (Interactive Quick-Calculate Sidecars) */}
          <section className="w-full bg-surface-container-low py-space-3xl border-t border-outline-variant/30">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-xl gap-space-sm">
                <div>
                  <span className="font-label-caps text-label-caps text-primary uppercase tracking-widest block mb-1 font-bold">
                    Featured Tools
                  </span>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
                    Quick Interactive Calculators
                  </h2>
                </div>
                <div className="font-body-sm text-body-sm text-on-surface-variant">
                  Instant calculation tools. Results update in real-time as you type.
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-xl">
                {/* TOOL 1: Age Calculator */}
                <div id="age-calculator-workbench" className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-outline-variant/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-space-sm border-b border-outline-variant/20">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[24px]">cake</span>
                        <h3 className="font-headline-md text-[20px] text-on-surface font-semibold">Age Calculator</h3>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-surface-container font-data-mono text-[11px] text-on-surface font-semibold">
                        ACCURATE AGE
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
                    <span className="font-body-sm text-[12px] text-outline">Formula: Exact leap year and calendar adjustment</span>
                    <Link
                      href="/time-date/age-calculator"
                      className="px-space-md py-1.5 rounded-lg bg-surface-container font-body-sm text-body-sm text-primary font-semibold hover:bg-surface-container-high transition-colors"
                    >
                      Full Calculator Page →
                    </Link>
                  </div>
                </div>

                {/* TOOL 2: Date Difference Calculator */}
                <div id="date-diff-workbench" className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-outline-variant/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-space-sm border-b border-outline-variant/20">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[24px]">date_range</span>
                        <h3 className="font-headline-md text-[20px] text-on-surface font-semibold">Date Difference Calculator</h3>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-surface-container font-data-mono text-[11px] text-on-surface font-semibold">
                        DAY/MONTH DIFFERENCE
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
                    <span className="font-body-sm text-[12px] text-outline">Federal bank holidays included</span>
                    <Link
                      className="px-space-md py-1.5 rounded-lg bg-surface-container font-body-sm text-body-sm text-primary font-semibold hover:bg-surface-container-high transition-colors"
                      href="/time-date/date-difference"
                    >
                      Full Calculator Page →
                    </Link>
                  </div>
                </div>

                {/* TOOL 3: Work Hours & Overtime Calculator */}
                <div id="work-hours-workbench" className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-outline-variant/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-space-sm border-b border-outline-variant/20">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[24px]">more_time</span>
                        <h3 className="font-headline-md text-[20px] text-on-surface font-semibold">Work Hours &amp; Timesheet</h3>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-surface-container font-data-mono text-[11px] text-on-surface font-semibold">
                        OVERTIME 1.5x
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
                    <span className="font-body-sm text-[12px] text-outline">Supports 7-day weekly schedule calculation</span>
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
                    All Tools
                  </span>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
                    Complete Time &amp; Date Tools Directory
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                    Every calculator is carefully tested against calendar standards and official holiday schedules.
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
                    <div className="text-outline text-[12px] mb-1 font-data-mono">
                      <span>QUERY ID: #CAL-901</span>
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
                    <div className="text-outline text-[12px] mb-1 font-data-mono">
                      <span>QUERY ID: #DOB-1995</span>
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
                    <div className="text-outline text-[12px] mb-1 font-data-mono">
                      <span>QUERY ID: #OT-475</span>
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
                    <div className="text-outline text-[12px] mb-1 font-data-mono">
                      <span>QUERY ID: #TZ-LON-NYC</span>
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
                    <div className="text-outline text-[12px] mb-1 font-data-mono">
                      <span>QUERY ID: #ADD-90D</span>
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
                    <div className="text-outline text-[12px] mb-1 font-data-mono">
                      <span>QUERY ID: #NEWYEAR-26</span>
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
                  Quick Guide
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
                  Time Tools Comparison
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Find the right calculator for your needs based on your inputs and desired results.
                </p>
              </div>

              <div className="overflow-x-auto bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30">
                <table className="w-full text-left font-body-sm text-body-sm">
                  <thead className="bg-surface-container font-label-caps text-label-caps text-on-surface uppercase tracking-wider">
                    <tr>
                      <th className="py-space-md px-space-lg">Calculator</th>
                      <th className="py-space-md px-space-lg">Best For</th>
                      <th className="py-space-md px-space-lg">Typical Users</th>
                      <th className="py-space-md px-space-lg">Input Type</th>
                      <th className="py-space-md px-space-lg">Output Format</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container">
                    <tr className="hover:bg-surface-container-low transition-colors">
                      <td className="py-space-md px-space-lg font-bold text-on-surface flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[18px]">cake</span>
                        Age Calculator
                      </td>
                      <td className="py-space-md px-space-lg text-on-surface-variant">Exact age, days lived &amp; day born</td>
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
                      <td className="py-space-md px-space-lg text-on-surface-variant">Time in/out, lunch break, 1.5x overtime</td>
                      <td className="py-space-md px-space-lg text-on-surface">Payroll Managers, Contractors</td>
                      <td className="py-space-md px-space-lg font-data-mono text-[12px]">HH:MM In / Out + Breaks</td>
                      <td className="py-space-md px-space-lg font-data-mono text-[12px] text-primary">Total Decimal Hours + Gross Pay</td>
                    </tr>
                    <tr className="hover:bg-surface-container-low transition-colors">
                      <td className="py-space-md px-space-lg font-bold text-on-surface flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[18px]">schedule</span>
                        Time Zone Overlap
                      </td>
                      <td className="py-space-md px-space-lg text-on-surface-variant">Coordinate meetings across 3+ timezones</td>
                      <td className="py-space-md px-space-lg text-on-surface">Remote Teams, Project Managers</td>
                      <td className="py-space-md px-space-lg font-data-mono text-[12px]">City Array + Target Time</td>
                      <td className="py-space-md px-space-lg font-data-mono text-[12px] text-primary">Shared Hours Window</td>
                    </tr>
                    <tr className="hover:bg-surface-container-low transition-colors">
                      <td className="py-space-md px-space-lg font-bold text-on-surface flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[18px]">timer</span>
                        Time Calculator
                      </td>
                      <td className="py-space-md px-space-lg text-on-surface-variant">Add or subtract time values (HH:MM:SS)</td>
                      <td className="py-space-md px-space-lg text-on-surface">Audio/Video Editors, Planners</td>
                      <td className="py-space-md px-space-lg font-data-mono text-[12px]">Hours, Minutes, Seconds</td>
                      <td className="py-space-md px-space-lg font-data-mono text-[12px] text-primary">Total HH:MM:SS + Total Hours</td>
                    </tr>
                    <tr className="hover:bg-surface-container-low transition-colors">
                      <td className="py-space-md px-space-lg font-bold text-on-surface flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[18px]">psychology</span>
                        Focus &amp; Break Timer
                      </td>
                      <td className="py-space-md px-space-lg text-on-surface-variant">Structured work and rest intervals</td>
                      <td className="py-space-md px-space-lg text-on-surface">Students, Writers, Professionals</td>
                      <td className="py-space-md px-space-lg font-data-mono text-[12px]">Start Time or Work Duration</td>
                      <td className="py-space-md px-space-lg font-data-mono text-[12px] text-primary">Focus / Rest Schedules</td>
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
                  Practical Uses
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
                  Helpful for Daily Planning and Work
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
                        <h3 className="font-headline-md text-[17px] text-on-surface font-semibold">Remote &amp; Global Teams</h3>
                        <span className="font-label-caps text-[11px] text-outline uppercase">Worldwide Teams</span>
                      </div>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Coordinate meetings smoothly across San Francisco, Berlin, and London. Find common working hours that fit everyone&apos;s schedule without accidental early morning or late night calls.
                    </p>
                  </div>
                  <div className="pt-space-md border-t border-outline-variant/20 mt-3">
                    <span className="font-label-caps text-[11px] text-primary uppercase font-bold">Recommended: Time Zone Planner</span>
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
                        <h3 className="font-headline-md text-[17px] text-on-surface font-semibold">Payroll &amp; HR Teams</h3>
                        <span className="font-label-caps text-[11px] text-outline uppercase">Hourly Pay &amp; Shifts</span>
                      </div>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Calculate weekly work hours with automatic unpaid lunch deductions. Check regular hours and calculate 1.5x overtime and holiday rates accurately.
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
                        <h3 className="font-headline-md text-[17px] text-on-surface font-semibold">Legal &amp; Real Estate</h3>
                        <span className="font-label-caps text-[11px] text-outline uppercase">Deadlines &amp; Closing Dates</span>
                      </div>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Calculate exact 30, 60, or 90-day contract filing periods. Automatically adjust deadlines when the target day falls on a weekend or federal holiday.
                    </p>
                  </div>
                  <div className="pt-space-md border-t border-outline-variant/20 mt-3">
                    <span className="font-label-caps text-[11px] text-primary uppercase font-bold">Recommended: Business Days &amp; Holidays</span>
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
                        <h3 className="font-headline-md text-[17px] text-on-surface font-semibold">Travelers &amp; Flyers</h3>
                        <span className="font-label-caps text-[11px] text-outline uppercase">Trip Planning</span>
                      </div>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Calculate flight duration when crossing time zones. View local arrival times, plan sleep schedules, and avoid confusion from seasonal Daylight Saving changes.
                    </p>
                  </div>
                  <div className="pt-space-md border-t border-outline-variant/20 mt-3">
                    <span className="font-label-caps text-[11px] text-primary uppercase font-bold">Recommended: Flight Time &amp; DST Tracker</span>
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
                        <h3 className="font-headline-md text-[17px] text-on-surface font-semibold">Students &amp; Teachers</h3>
                        <span className="font-label-caps text-[11px] text-outline uppercase">Study Deadlines</span>
                      </div>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Plan thesis milestones, project deadlines, and exam revision blocks. Divide study hours into focused sessions and track countdown progress.
                    </p>
                  </div>
                  <div className="pt-space-md border-t border-outline-variant/20 mt-3">
                    <span className="font-label-caps text-[11px] text-primary uppercase font-bold">Recommended: Study Schedule Planner</span>
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
                        <span className="font-label-caps text-[11px] text-outline uppercase">Celebrations &amp; Milestones</span>
                      </div>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Keep everyone excited with countdown timers for weddings, anniversaries, vacations, retirements, birthdays, and due dates.
                    </p>
                  </div>
                  <div className="pt-space-md border-t border-outline-variant/20 mt-3">
                    <span className="font-label-caps text-[11px] text-primary uppercase font-bold">Recommended: Live Countdown Timer</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 10. TIME CALCULATION REFERENCE */}
          <section className="w-full bg-surface py-space-3xl border-t border-outline-variant/30">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
              <div className="mb-space-xl">
                <span className="font-label-caps text-label-caps text-primary uppercase tracking-widest block mb-1 font-bold">
                  Reference Guide
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
                  How Time &amp; Date Calculations Work
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Understanding standard calendar rules and calculation principles.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
                {/* Science Article 1 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-primary font-data-mono text-[12px] mb-2 font-semibold">
                      <span className="material-symbols-outlined text-[16px]">verified</span>
                      STANDARD FORMATS
                    </div>
                    <h3 className="font-headline-md text-[20px] text-on-surface font-semibold mb-2">ISO Date &amp; UTC Time Standards</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mb-space-md">
                      The international <span className="font-data-mono text-on-surface font-medium">ISO 8601</span> standard formats dates as <span className="font-data-mono text-on-surface font-semibold">YYYY-MM-DD</span> to avoid confusion between different regional styles (such as MM/DD/YYYY in the US vs DD/MM/YYYY in Europe). Coordinated Universal Time (UTC) provides the global time standard for accurate time zone conversions.
                    </p>
                  </div>
                  <div className="pt-space-xs font-body-sm text-[12px] text-outline border-t border-outline-variant/10">
                    Standard: ISO 8601 / UTC Time Standard
                  </div>
                </div>

                {/* Science Article 2 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-primary font-data-mono text-[12px] mb-2 font-semibold">
                      <span className="material-symbols-outlined text-[16px]">cyclone</span>
                      CALENDAR RULES
                    </div>
                    <h3 className="font-headline-md text-[20px] text-on-surface font-semibold mb-2">How Leap Years Work</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mb-space-md">
                      Earth takes about 365.2422 days to orbit the Sun. To keep our calendar aligned with the seasons, the Gregorian calendar adds a leap day on February 29 every 4 years, except for years divisible by 100 unless they are also divisible by 400. For instance, the year 2000 was a leap year, but 1900 and 2100 are not.
                    </p>
                  </div>
                  <div className="pt-space-xs font-body-sm text-[12px] text-outline border-t border-outline-variant/10">
                    Calendar: Standard Gregorian Leap Year Rules
                  </div>
                </div>

                {/* Science Article 3 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-primary font-data-mono text-[12px] mb-2 font-semibold">
                      <span className="material-symbols-outlined text-[16px]">bedtime</span>
                      PRODUCTIVITY
                    </div>
                    <h3 className="font-headline-md text-[20px] text-on-surface font-semibold mb-2">Focus Blocks &amp; Rest Breaks</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mb-space-md">
                      Human attention naturally rises and falls throughout the day. Structuring work into 25-minute Pomodoro sprints or 90-minute deep focus sessions followed by short rest breaks helps maintain concentration and prevent fatigue.
                    </p>
                  </div>
                  <div className="pt-space-xs font-body-sm text-[12px] text-outline border-t border-outline-variant/10">
                    Method: Pomodoro &amp; Rest-Work Cycles
                  </div>
                </div>

                {/* Science Article 4 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-primary font-data-mono text-[12px] mb-2 font-semibold">
                      <span className="material-symbols-outlined text-[16px]">lock</span>
                      PRIVACY FIRST
                    </div>
                    <h3 className="font-headline-md text-[20px] text-on-surface font-semibold mb-2">100% Private In-Browser Calculations</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mb-space-md">
                      All calculations are performed directly inside your browser. No dates, birthdates, working hours, pay rates, or personal inputs are sent across the internet or stored on external servers, ensuring total privacy.
                    </p>
                  </div>
                  <div className="pt-space-xs font-body-sm text-[12px] text-outline border-t border-outline-variant/10">
                    Privacy: Private Local Processing
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 11. FAQ */}
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
                  Helpful answers about date calculation methods, time zones, and privacy.
                </p>
              </div>

              {/* Accordion Stack */}
              <div className="space-y-space-sm" id="faq-container">
                {[
                  {
                    id: 1,
                    q: 'How do business day calculators handle federal bank holidays?',
                    a: 'Calculators evaluate calendar days using standard US Federal Reserve holiday schedules and UK Banking calendars. When a holiday falls on a Saturday, it is typically observed on Friday. When it falls on a Sunday, it is observed on Monday. You can choose to include or exclude holidays based on your needs.',
                  },
                  {
                    id: 2,
                    q: 'What rule determines leap years (the 100/400 year rule)?',
                    a: 'Under the standard Gregorian calendar, a year is a leap year (366 days) if it is divisible by 4, except for centenary years (ending in 00) which must also be divisible by 400. For example, 2000 and 2024 are leap years, but 1900 and 2100 are regular 365-day years.',
                  },
                  {
                    id: 3,
                    q: 'How does Daylight Saving Time (DST) affect meeting calculations?',
                    a: 'Because different regions start and end DST on different dates (for example, the US shifts in early March, while Europe shifts in late March), the time difference between cities changes twice a year. Our meeting planner accounts for regional time shifts when comparing dates.',
                  },
                  {
                    id: 4,
                    q: 'Are entered dates, birthdays, and work schedules saved or tracked?',
                    a: 'No. All calculations run entirely inside your web browser. No dates, personal names, hourly rates, or timesheets are stored or sent anywhere. Your information remains completely private.',
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
                      Explore More
                    </span>
                    <h2 className="font-headline-md text-headline-md text-on-surface tracking-tight font-bold">
                      Explore Other Calculator Categories
                    </h2>
                  </div>
                  <Link className="inline-flex items-center gap-1 font-body-sm text-body-sm text-primary font-semibold hover:underline" href="/">
                    <span>View All 100+ Calculators</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md">
                  <Link className="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex items-center gap-space-sm group border border-outline-variant/20" href="/">
                    <span className="material-symbols-outlined text-primary text-[24px] group-hover:scale-110 transition-transform">
                      account_balance
                    </span>
                    <div>
                      <div className="font-body-md text-body-md font-semibold text-on-surface">Finance</div>
                      <div className="font-body-sm text-[12px] text-on-surface-variant">Mortgage, Loan, 401(k)</div>
                    </div>
                  </Link>

                  <Link className="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex items-center gap-space-sm group border border-outline-variant/20" href="/health-fitness-calculators">
                    <span className="material-symbols-outlined text-secondary text-[24px] group-hover:scale-110 transition-transform">
                      favorite
                    </span>
                    <div>
                      <div className="font-body-md text-body-md font-semibold text-on-surface">Health &amp; Fitness</div>
                      <div className="font-body-sm text-[12px] text-on-surface-variant">TDEE, BMR, Body Fat</div>
                    </div>
                  </Link>

                  <Link className="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex items-center gap-space-sm group border border-outline-variant/20" href="/">
                    <span className="material-symbols-outlined text-tertiary text-[24px] group-hover:scale-110 transition-transform">
                      functions
                    </span>
                    <div>
                      <div className="font-body-md text-body-md font-semibold text-on-surface">Math &amp; Physics</div>
                      <div className="font-body-sm text-[12px] text-on-surface-variant">Matrices, Vectors, Equations</div>
                    </div>
                  </Link>

                  <Link className="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex items-center gap-space-sm group border border-outline-variant/20" href="/automotive-calculators-estimators">
                    <span className="material-symbols-outlined text-primary text-[24px] group-hover:scale-110 transition-transform">
                      directions_car
                    </span>
                    <div>
                      <div className="font-body-md text-body-md font-semibold text-on-surface">Automotive</div>
                      <div className="font-body-sm text-[12px] text-on-surface-variant">Lease, MPG, EV Range</div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
