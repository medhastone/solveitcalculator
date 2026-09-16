'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';

// Federal holidays generator
function getFederalHolidaysForYear(year: number) {
  const holidays: { name: string; dateStr: string }[] = [];

  const getNthDayOfWeek = (month: number, dayOfWeek: number, n: number) => {
    let count = 0;
    for (let day = 1; day <= 31; day++) {
      const d = new Date(year, month, day);
      if (d.getMonth() !== month) break;
      if (d.getDay() === dayOfWeek) {
        count++;
        if (count === n) return day;
      }
    }
    return 1;
  };

  const getLastDayOfWeek = (month: number, dayOfWeek: number) => {
    let last = 1;
    for (let day = 1; day <= 31; day++) {
      const d = new Date(year, month, day);
      if (d.getMonth() !== month) break;
      if (d.getDay() === dayOfWeek) {
        last = day;
      }
    }
    return last;
  };

  const add = (name: string, month: number, day: number) => {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    holidays.push({ name, dateStr: `${year}-${mm}-${dd}` });
  };

  add("New Year's Day", 0, 1);
  add('Martin Luther King Jr. Day', 0, getNthDayOfWeek(0, 1, 3));
  add("Washington's Birthday (Presidents' Day)", 1, getNthDayOfWeek(1, 1, 3));
  add('Memorial Day', 4, getLastDayOfWeek(4, 1));
  add('Juneteenth National Independence Day', 5, 19);
  add('Independence Day', 6, 4);
  add('Labor Day', 8, getNthDayOfWeek(8, 1, 1));
  add('Columbus Day / Indigenous Peoples Day', 9, getNthDayOfWeek(9, 1, 2));
  add('Veterans Day', 10, 11);
  add('Thanksgiving Day', 10, getNthDayOfWeek(10, 4, 4));
  add('Christmas Day', 11, 25);

  return holidays;
}

// Convert date to Julian Day Number (JDN)
function getJulianDayNumber(year: number, month: number, day: number): number {
  let a = Math.floor((14 - month) / 12);
  let y = year + 4800 - a;
  let m = month + 12 * a - 3;
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

export default function DaysCalculatorClient() {
  const [mounted, setMounted] = useState(false);
  const [utcTime, setUtcTime] = useState<Date | null>(null);

  const formatUtcTime = (date: Date) => {
    const h = String(date.getUTCHours()).padStart(2, '0');
    const m = String(date.getUTCMinutes()).padStart(2, '0');
    const s = String(date.getUTCSeconds()).padStart(2, '0');
    return `${h}:${m}:${s}Z`;
  };

  const [startDate, setStartDate] = useState('2025-02-27');
  const [operation, setOperation] = useState<'add' | 'subtract'>('add');
  const [unitType, setUnitType] = useState<'days' | 'business_days' | 'weeks' | 'months' | 'years'>('days');
  const [quantity, setQuantity] = useState<number>(30);
  const [excludeHolidays, setExcludeHolidays] = useState<boolean>(true);

  // FAQ Accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      setStartDate(new Date().toISOString().split('T')[0]);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Calculation Engine
  const result = useMemo(() => {
    if (!startDate || quantity === undefined || isNaN(quantity)) return null;

    const [sY, sM, sD] = startDate.split('-').map(Number);
    if (!sY || !sM || !sD) return null;

    const start = new Date(Date.UTC(sY, sM - 1, sD, 0, 0, 0));
    let target = new Date(start.getTime());

    const direction = operation === 'add' ? 1 : -1;
    let daysSkippedWeekends = 0;
    let holidaysEncountered: { name: string; dateStr: string }[] = [];

    if (unitType === 'business_days') {
      let remaining = Math.abs(quantity);
      let curr = new Date(start.getTime());

      // Pre-cache holiday set
      const holidayCache = new Map<string, string>();
      for (let y = sY - 5; y <= sY + 5; y++) {
        getFederalHolidaysForYear(y).forEach((h) => holidayCache.set(h.dateStr, h.name));
      }

      while (remaining > 0) {
        curr.setUTCDate(curr.getUTCDate() + direction);
        const dayOfWeek = curr.getUTCDay();
        const iso = curr.toISOString().split('T')[0];

        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const holidayName = excludeHolidays ? holidayCache.get(iso) : undefined;

        if (isWeekend) {
          daysSkippedWeekends++;
        } else if (holidayName) {
          holidaysEncountered.push({ name: holidayName, dateStr: iso });
        } else {
          remaining--;
        }
      }
      target = curr;
    } else if (unitType === 'days') {
      target.setUTCDate(target.getUTCDate() + direction * quantity);
    } else if (unitType === 'weeks') {
      target.setUTCDate(target.getUTCDate() + direction * quantity * 7);
    } else if (unitType === 'months') {
      target.setUTCMonth(target.getUTCMonth() + direction * quantity);
    } else if (unitType === 'years') {
      target.setUTCFullYear(target.getUTCFullYear() + direction * quantity);
    }

    const tY = target.getUTCFullYear();
    const tM = target.getUTCMonth() + 1;
    const tD = target.getUTCDate();
    const targetDateStr = target.toISOString().split('T')[0];

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = dayNames[target.getUTCDay()];

    // Formatted readable date (e.g. Thursday, March 29, 2025)
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const formattedLong = `${dayOfWeek}, ${monthNames[tM - 1]} ${tD}, ${tY}`;

    // Julian calculations
    const jdn = getJulianDayNumber(tY, tM, tD);
    const mjd = jdn - 2400000.5;

    // ISO Week number
    const d = new Date(Date.UTC(tY, tM - 1, tD));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const isoWeek = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);

    // Quarter
    const quarter = Math.floor((tM - 1) / 3) + 1;

    // Calendar difference from today
    const nowUtc = new Date();
    const todayZero = new Date(Date.UTC(nowUtc.getFullYear(), nowUtc.getMonth(), nowUtc.getDate()));
    const daysFromNow = Math.round((target.getTime() - todayZero.getTime()) / 86400000);

    return {
      targetDateStr,
      formattedLong,
      dayOfWeek,
      jdn,
      mjd,
      isoWeek,
      quarter,
      daysFromNow,
      daysSkippedWeekends,
      holidaysEncountered,
      totalCalendarDeltaDays: Math.round(Math.abs(target.getTime() - start.getTime()) / 86400000),
    };
  }, [startDate, operation, unitType, quantity, excludeHolidays]);

  const applyPreset = (qty: number, unit: 'days' | 'business_days' | 'months' | 'years', op: 'add' | 'subtract' = 'add') => {
    setQuantity(qty);
    setUnitType(unit);
    setOperation(op);
    showToast(`Projected ${op === 'add' ? '+' : '-'}${qty} ${unit.replace('_', ' ')}`);
  };

  const handleCopy = () => {
    if (!result) return;
    const text = `SolveIt Days Calculator Projection:
Start Date: ${startDate}
Action: ${operation === 'add' ? 'Added' : 'Subtracted'} ${quantity} ${unitType.replace('_', ' ')}
Result Date: ${result.formattedLong} (${result.targetDateStr})
Quarter: Q${result.quarter} ${result.targetDateStr.slice(0, 4)} | ISO Week: ${result.isoWeek}
Julian Day Number (JDN): ${result.jdn}`;

    navigator.clipboard.writeText(text);
    showToast('Result copied to clipboard!');
  };

  const faqs = [
    {
      q: 'How does the business days calculation skip weekends and holidays?',
      a: 'When "Business Days" is selected, the engine iterates date by date from your starting point. Every Saturday and Sunday is bypassed automatically. If holiday exclusion is enabled, all official US Federal Reserve statutory holidays are evaluated and skipped as non-working days.',
    },
    {
      q: 'What is the "Next Business Day" rule for legal and financial deadlines?',
      a: 'In contract law (and under US Federal Rule of Civil Procedure 6(a)(1)(C)), if an agreed statutory deadline falls on a Saturday, Sunday, or legal bank holiday, the deadline is automatically extended to the close of business on the immediate following non-holiday weekday.',
    },
    {
      q: 'What is the Julian Day Number (JDN) and why is it displayed?',
      a: 'The Julian Day Number is a continuous count of days elapsed since noon on January 1, 4713 BCE. It is widely used by astronomers, satellite geodesists, and software historians to measure long-term epoch intervals without navigating leap-year abnormalities.',
    },
    {
      q: 'What date will it be 30, 60, or 90 days from today?',
      a: 'Adding 30 calendar days advances the date by approximately one month. 60 days projects two months forward, while 90 days represents a standard commercial business quarter. Click any of the quick milestone preset buttons to see the exact day of the week and target date.',
    },
  ];

  if (!mounted) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center font-body-md text-on-surface">
        <div className="animate-pulse font-label-caps text-label-caps text-outline">
          Initializing Date Projection Engine...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col font-body-md selection:bg-primary/20">
      

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-space-md py-space-sm rounded-xl shadow-lg font-body-sm flex items-center gap-2 border border-outline-variant/30 animate-fade-in">
          <span className="material-symbols-outlined text-[18px] text-primary">check_circle</span>
          {toastMessage}
        </div>
      )}

      {/* Header Banner */}
      <section className="w-full bg-surface-container-lowest border-b border-outline-variant/30 pt-space-xl pb-space-lg">
        <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
          <div className="flex items-center gap-2 mb-2">
            <Link
              href="/time-date"
              className="font-label-caps text-label-caps text-outline hover:text-primary transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              Time & Date Suite
            </Link>
            <span className="text-outline-variant text-[12px]">•</span>
            <span className="font-label-caps text-label-caps text-primary font-semibold">Date Projection</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="font-headline-xl text-headline-xl tracking-tight text-on-surface font-bold">
                Days Calculator: Add or Subtract Days from Date
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl mt-1">
                Project past and future milestone dates with mathematical precision. Add or subtract calendar days, business working days (skipping weekends & federal holidays), weeks, or months.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => applyPreset(30, 'days', 'add')}
                className="px-3 py-1.5 rounded-lg bg-surface-container font-label-caps text-[12px] font-semibold text-on-surface hover:bg-surface-container-high transition-colors border border-outline-variant/30"
              >
                +30 Days (Net 30)
              </button>
              <button
                onClick={() => applyPreset(90, 'days', 'add')}
                className="px-3 py-1.5 rounded-lg bg-surface-container font-label-caps text-[12px] font-semibold text-on-surface hover:bg-surface-container-high transition-colors border border-outline-variant/30"
              >
                +90 Days (Quarter)
              </button>
              <button
                onClick={() => applyPreset(10, 'business_days', 'add')}
                className="px-3 py-1.5 rounded-lg bg-surface-container font-label-caps text-[12px] font-semibold text-on-surface hover:bg-surface-container-high transition-colors border border-outline-variant/30"
              >
                +10 Business Days
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Work Area */}
      <main className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-xl space-y-space-xl flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
          {/* Left Control Panel */}
          <div className="lg:col-span-5 bg-surface-container-lowest p-space-lg rounded-2xl border border-outline-variant/30 shadow-sm space-y-space-md sticky top-[100px]">
            <h2 className="font-headline-sm text-headline-sm font-semibold text-on-surface flex items-center gap-2 border-b border-outline-variant/20 pb-space-sm">
              <span className="material-symbols-outlined text-primary text-[20px]">tune</span>
              Calculation Parameters
            </h2>

            {/* Start Date */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="font-label-caps text-label-caps text-on-surface uppercase font-semibold">
                  Starting Date
                </label>
                <button
                  onClick={() => setStartDate(new Date().toISOString().split('T')[0])}
                  className="font-label-caps text-[11px] text-primary hover:underline font-semibold"
                >
                  Set Today
                </button>
              </div>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-surface-container-low text-on-surface font-data-mono text-data-mono p-space-sm rounded-xl border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            {/* Operation: Add vs Subtract */}
            <div>
              <label className="font-label-caps text-label-caps text-on-surface uppercase block mb-1.5 font-semibold">
                Operation
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setOperation('add')}
                  className={`py-2 rounded-xl font-label-caps text-[12px] font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                    operation === 'add'
                      ? 'bg-primary text-on-primary border-primary shadow-sm'
                      : 'bg-surface-container text-on-surface border-outline-variant/30 hover:bg-surface-container-high'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  Add (Future Date)
                </button>
                <button
                  onClick={() => setOperation('subtract')}
                  className={`py-2 rounded-xl font-label-caps text-[12px] font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                    operation === 'subtract'
                      ? 'bg-primary text-on-primary border-primary shadow-sm'
                      : 'bg-surface-container text-on-surface border-outline-variant/30 hover:bg-surface-container-high'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">remove</span>
                  Subtract (Past Date)
                </button>
              </div>
            </div>

            {/* Unit Type & Quantity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="font-label-caps text-[11px] text-on-surface uppercase block mb-1 font-semibold">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  className="w-full p-2 bg-surface-container-low text-on-surface font-data-mono text-data-mono rounded-xl border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/40 text-center"
                />
              </div>

              <div>
                <label className="font-label-caps text-[11px] text-on-surface uppercase block mb-1 font-semibold">
                  Unit Type
                </label>
                <select
                  value={unitType}
                  onChange={(e) => setUnitType(e.target.value as any)}
                  className="w-full p-2 bg-surface-container-low text-on-surface font-body-sm text-body-sm rounded-xl border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="days">Calendar Days</option>
                  <option value="business_days">Business Days (M-F)</option>
                  <option value="weeks">Weeks (7 days)</option>
                  <option value="months">Months</option>
                  <option value="years">Years</option>
                </select>
              </div>
            </div>

            {/* Business Day Holiday Exclusions */}
            {unitType === 'business_days' && (
              <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between">
                <div>
                  <span className="font-body-sm text-[13px] text-on-surface font-medium block">
                    Skip US Federal Bank Holidays
                  </span>
                  <span className="text-[11px] text-outline">5 U.S.C. 6103 statutory calendar</span>
                </div>
                <input
                  type="checkbox"
                  checked={excludeHolidays}
                  onChange={(e) => setExcludeHolidays(e.target.checked)}
                  className="w-4 h-4 text-primary rounded focus:ring-primary"
                />
              </div>
            )}

            {/* Preset Palette */}
            <div className="pt-2 border-t border-outline-variant/20">
              <span className="font-label-caps text-[11px] text-outline uppercase block mb-1.5 font-semibold">
                Common Projections
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => applyPreset(60, 'days', 'add')}
                  className="p-1.5 rounded-lg bg-surface-container text-on-surface font-body-sm text-[11px] hover:bg-surface-container-high transition-colors text-center"
                >
                  +60 Days
                </button>
                <button
                  onClick={() => applyPreset(180, 'days', 'add')}
                  className="p-1.5 rounded-lg bg-surface-container text-on-surface font-body-sm text-[11px] hover:bg-surface-container-high transition-colors text-center"
                >
                  +180 Days
                </button>
                <button
                  onClick={() => applyPreset(1, 'years', 'add')}
                  className="p-1.5 rounded-lg bg-surface-container text-on-surface font-body-sm text-[11px] hover:bg-surface-container-high transition-colors text-center"
                >
                  +1 Year
                </button>
                <button
                  onClick={() => applyPreset(30, 'days', 'subtract')}
                  className="p-1.5 rounded-lg bg-surface-container text-on-surface font-body-sm text-[11px] hover:bg-surface-container-high transition-colors text-center"
                >
                  -30 Days
                </button>
                <button
                  onClick={() => applyPreset(90, 'days', 'subtract')}
                  className="p-1.5 rounded-lg bg-surface-container text-on-surface font-body-sm text-[11px] hover:bg-surface-container-high transition-colors text-center"
                >
                  -90 Days
                </button>
                <button
                  onClick={() => applyPreset(20, 'business_days', 'add')}
                  className="p-1.5 rounded-lg bg-surface-container text-on-surface font-body-sm text-[11px] hover:bg-surface-container-high transition-colors text-center"
                >
                  +20 Biz Days
                </button>
              </div>
            </div>

            {/* Action Bar */}
            <button
              onClick={handleCopy}
              className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-label-caps text-[12px] font-bold flex items-center justify-center gap-1.5 shadow-sm hover:bg-primary/90 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">content_copy</span>
              Copy Result Summary
            </button>
          </div>

          {/* Right Output Panel */}
          <div className="lg:col-span-7 space-y-space-md">
            {result && (
              <>
                {/* Result Display Card */}
                <div className="bg-surface-container-lowest p-space-lg sm:p-space-xl rounded-2xl border border-outline-variant/30 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-primary text-on-primary font-label-caps text-[11px] px-3.5 py-1 rounded-bl-xl font-bold uppercase tracking-wider">
                    Calculated Milestone
                  </div>

                  <span className="font-label-caps text-label-caps text-outline uppercase tracking-wider">
                    Target Output Date
                  </span>

                  <div className="mt-2 pb-space-lg border-b border-outline-variant/20">
                    <div className="font-headline-xl text-[36px] sm:text-[46px] font-bold text-on-surface tracking-tight leading-tight">
                      {result.formattedLong}
                    </div>
                    <div className="font-data-mono text-[16px] text-primary font-bold mt-1">
                      ISO: {result.targetDateStr}
                    </div>
                  </div>

                  {/* Context Metrics Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm pt-space-md">
                    <div className="bg-surface-container p-3 rounded-xl text-center">
                      <span className="font-label-caps text-[10px] text-outline uppercase block font-semibold">Day of Week</span>
                      <span className="font-data-mono text-[15px] font-bold text-on-surface mt-0.5 block">{result.dayOfWeek}</span>
                    </div>
                    <div className="bg-surface-container p-3 rounded-xl text-center">
                      <span className="font-label-caps text-[10px] text-outline uppercase block font-semibold">Quarter</span>
                      <span className="font-data-mono text-[15px] font-bold text-secondary mt-0.5 block">Q{result.quarter}</span>
                    </div>
                    <div className="bg-surface-container p-3 rounded-xl text-center">
                      <span className="font-label-caps text-[10px] text-outline uppercase block font-semibold">ISO Week</span>
                      <span className="font-data-mono text-[15px] font-bold text-tertiary mt-0.5 block">Week {result.isoWeek}</span>
                    </div>
                    <div className="bg-surface-container p-3 rounded-xl text-center">
                      <span className="font-label-caps text-[10px] text-outline uppercase block font-semibold">Days from Today</span>
                      <span className="font-data-mono text-[15px] font-bold text-primary mt-0.5 block">
                        {result.daysFromNow > 0 ? `+${result.daysFromNow}d` : `${result.daysFromNow}d`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Astronomical & Ephemeris Card */}
                <div className="bg-surface-container-lowest p-space-lg rounded-2xl border border-outline-variant/30 shadow-sm space-y-3">
                  <h3 className="font-headline-sm text-headline-sm font-semibold flex items-center gap-2 text-on-surface">
                    <span className="material-symbols-outlined text-tertiary text-[20px]">stars</span>
                    Astronomical Epoch & Julian Day Data
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm text-[13px]">
                    <div className="bg-surface-container-low p-space-sm rounded-xl flex justify-between items-center">
                      <span className="text-on-surface-variant font-medium">Julian Day Number (JDN)</span>
                      <span className="font-data-mono font-bold text-on-surface">{result.jdn.toLocaleString()}</span>
                    </div>
                    <div className="bg-surface-container-low p-space-sm rounded-xl flex justify-between items-center">
                      <span className="text-on-surface-variant font-medium">Modified Julian Date (MJD)</span>
                      <span className="font-data-mono font-bold text-on-surface">{result.mjd.toLocaleString()}</span>
                    </div>
                    <div className="bg-surface-container-low p-space-sm rounded-xl flex justify-between items-center">
                      <span className="text-on-surface-variant font-medium">Total Calendar Span</span>
                      <span className="font-data-mono font-bold text-primary">{result.totalCalendarDeltaDays} Days</span>
                    </div>
                    {unitType === 'business_days' && (
                      <div className="bg-surface-container-low p-space-sm rounded-xl flex justify-between items-center">
                        <span className="text-on-surface-variant font-medium">Weekend Days Bypassed</span>
                        <span className="font-data-mono font-bold text-secondary">{result.daysSkippedWeekends} Days</span>
                      </div>
                    )}
                  </div>

                  {/* Holidays Encountered */}
                  {result.holidaysEncountered.length > 0 && (
                    <div className="mt-2 bg-surface-container-low p-3 rounded-xl border border-outline-variant/20">
                      <span className="font-label-caps text-[11px] text-outline uppercase block mb-1 font-semibold">
                        Federal Holidays Skipped During Interval:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {result.holidaysEncountered.map((h, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-lg bg-surface-container text-on-surface font-body-sm text-[12px]">
                            🏛️ {h.name} ({h.dateStr})
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Deep Google E-E-A-T Editorial Guides */}
      <section className="bg-surface-container-low border-t border-outline-variant/30 py-space-2xl">
        <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop space-y-space-xl">
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">
              Comprehensive Guide to Date Arithmetic, Business Days, & Statutory Deadlines
            </h2>
            <p className="font-body-md text-on-surface-variant leading-relaxed">
              Date projection is a fundamental temporal operation across commercial contracting (e.g. Net 30/60 invoice payment schedules), court filings, supply chain lead times, and regulatory compliance. Accurately projecting future dates requires distinguishing between elapsed calendar intervals and working business days.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg mt-space-lg">
              <div className="bg-surface-container-lowest p-space-lg rounded-2xl border border-outline-variant/30">
                <h3 className="font-headline-sm font-semibold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">gavel</span>
                  Rule 6 Next Business Day Computation
                </h3>
                <p className="font-body-sm text-on-surface-variant mt-2">
                  Under federal and state legal rules (e.g., US Federal Rules of Civil Procedure Rule 6(a)):
                </p>
                <ul className="list-disc pl-5 space-y-1 font-body-sm text-on-surface-variant mt-2">
                  <li>The day of the triggering event is excluded from the count.</li>
                  <li>Every day is counted, but if the last day of the period lands on a Saturday, Sunday, or legal holiday, the period automatically extends to the end of the next day that is not a weekend or holiday.</li>
                </ul>
              </div>

              <div className="bg-surface-container-lowest p-space-lg rounded-2xl border border-outline-variant/30">
                <h3 className="font-headline-sm font-semibold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">public</span>
                  Astronomical Ephemeris & Julian Day Numbers
                </h3>
                <p className="font-body-sm text-on-surface-variant mt-2">
                  Created by French scholar Joseph Scaliger in 1583, the Julian Day system provides an unbroken linear index of elapsed days. By removing calendar discontinuities (such as the 1582 switch from the Julian to Gregorian calendar that skipped 10 days), scientific systems can perform date subtraction with pure integer arithmetic.
                </p>
              </div>
            </div>

            {/* Interactive FAQ Accordion */}
            <div className="mt-space-xl">
              <h3 className="font-headline-md font-bold text-on-surface mb-space-md">
                Frequently Asked Questions (FAQ)
              </h3>
              <div className="space-y-space-sm">
                {faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full text-left p-space-md flex justify-between items-center font-headline-sm text-[16px] font-semibold text-on-surface hover:bg-surface-container-low transition-colors"
                    >
                      <span>{faq.q}</span>
                      <span className="material-symbols-outlined text-outline transition-transform duration-200">
                        {openFaq === idx ? 'expand_less' : 'expand_more'}
                      </span>
                    </button>
                    {openFaq === idx && (
                      <div className="p-space-md pt-0 text-on-surface-variant font-body-md border-t border-outline-variant/15 text-[14px] leading-relaxed">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
