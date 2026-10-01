'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';

// Fliegel-Van Flandern Algorithm for Gregorian JDN
function gregorianToJDN(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
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

// Pure Julian Calendar JDN
function julianCalendarToJDN(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    32083
  );
}

// Calculate JD from Date and Time
function computeJD(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number,
  calendarRule: string
) {
  let jdn: number;
  if (calendarRule === 'julian') {
    jdn = julianCalendarToJDN(year, month, day);
  } else if (calendarRule === 'gregorian') {
    jdn = gregorianToJDN(year, month, day);
  } else {
    // Automatic: Cutover at 1582-10-15
    if (year < 1582 || (year === 1582 && (month < 10 || (month === 10 && day < 15)))) {
      jdn = julianCalendarToJDN(year, month, day);
    } else {
      jdn = gregorianToJDN(year, month, day);
    }
  }
  const fraction = (hour - 12) / 24 + minute / 1440 + second / 86400;
  return { jd: jdn + fraction, jdn, fraction };
}

// Reverse: JD to Calendar Date
function jdToCalendar(jd: number) {
  const z = Math.floor(jd + 0.5);
  const f = jd + 0.5 - z;
  let a = z;
  if (z >= 2299161) {
    const alpha = Math.floor((z - 1867216.25) / 36524.25);
    a = z + 1 + alpha - Math.floor(alpha / 4);
  }
  const b = a + 1524;
  const c = Math.floor((b - 122.1) / 365.25);
  const d = Math.floor(365.25 * c);
  const e = Math.floor((b - d) / 30.6001);
  const day = b - d - Math.floor(30.6001 * e) + f;
  const month = e < 14 ? e - 1 : e - 13;
  const year = month > 2 ? c - 4716 : c - 4715;
  const dayInt = Math.floor(day);
  const dayFrac = day - dayInt;
  const totalSecs = Math.round(dayFrac * 86400);
  const hour = Math.floor(totalSecs / 3600);
  const min = Math.floor((totalSecs % 3600) / 60);
  const sec = totalSecs % 60;
  return { year, month, day: dayInt, hour, min, sec };
}

function getDayOfYear(year: number, month: number, day: number): number {
  const now = new Date(Date.UTC(year, month - 1, day));
  const start = new Date(Date.UTC(year, 0, 0));
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export default function JulianDayCalculatorClient() {
  // Live Clock State
  const [isTicking, setIsTicking] = useState<boolean>(true);
  const [liveJd, setLiveJd] = useState<number>(2460573.12847);
  const [liveMjd, setLiveMjd] = useState<number>(60572.62847);
  const [liveDoy, setLiveDoy] = useState<number>(263);
  const [liveDoyTotal, setLiveDoyTotal] = useState<number>(365);
  const [liveDoyPct, setLiveDoyPct] = useState<string>('72.05');
  const [liveUtc, setLiveUtc] = useState<string>('15:04:58 UTC');
  const [liveGmst, setLiveGmst] = useState<string>('Star Time: 23h 14m 12s');

  // Workbench Mode State
  const [activeMode, setActiveMode] = useState<'date-to-jd' | 'jd-to-date' | 'date-diff'>('date-to-jd');
  const [currentPrecision, setCurrentPrecision] = useState<number>(6);
  const [copiedKey, setCopiedKey] = useState<string>('');

  // Mode 1: Date to JD inputs
  const [inputYear, setInputYear] = useState<number>(2025);
  const [inputMonth, setInputMonth] = useState<number>(10);
  const [inputDay, setInputDay] = useState<number>(24);
  const [inputHour, setInputHour] = useState<number>(12);
  const [inputMinute, setInputMinute] = useState<number>(0);
  const [inputSecond, setInputSecond] = useState<number>(0);
  const [calendarRule, setCalendarRule] = useState<string>('auto');
  const [timezoneOffset, setTimezoneOffset] = useState<string>('0');

  // Mode 2: JD to Date inputs
  const [reverseJd, setReverseJd] = useState<string>('2451545.0');
  const [reverseMjd, setReverseMjd] = useState<string>('51544.5');

  // Mode 3: Date Diff inputs
  const [diffDate1, setDiffDate1] = useState<string>('2000-01-01');
  const [diffTime1, setDiffTime1] = useState<string>('12:00');
  const [diffDate2, setDiffDate2] = useState<string>('2025-10-24');
  const [diffTime2, setDiffTime2] = useState<string>('12:00');

  // Clipboard copy handler with feedback
  const handleCopy = useCallback((text: string, key: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(''), 2000);
    }
  }, []);

  // Update Live Clock Telemetry
  useEffect(() => {
    if (!isTicking) return;
    const interval = setInterval(() => {
      const now = new Date();
      const y = now.getUTCFullYear();
      const m = now.getUTCMonth() + 1;
      const d = now.getUTCDate();
      const hr = now.getUTCHours();
      const mn = now.getUTCMinutes();
      const sc = now.getUTCSeconds() + now.getUTCMilliseconds() / 1000;

      const res = computeJD(y, m, d, hr, mn, sc, 'gregorian');
      const mjd = res.jd - 2400000.5;

      setLiveJd(res.jd);
      setLiveMjd(mjd);

      const doy = getDayOfYear(y, m, d);
      const totalDays = isLeapYear(y) ? 366 : 365;
      const pct = ((doy / totalDays) * 100).toFixed(2);
      setLiveDoy(doy);
      setLiveDoyTotal(totalDays);
      setLiveDoyPct(pct);

      const zuluStr = `${String(hr).padStart(2, '0')}:${String(mn).padStart(2, '0')}:${String(Math.floor(sc)).padStart(2, '0')} UTC`;
      setLiveUtc(zuluStr);

      // GMST approximate calculation
      const d2000 = res.jd - 2451545.0;
      let gmstHours = (18.697374558 + 24.06570982441908 * d2000) % 24;
      if (gmstHours < 0) gmstHours += 24;
      const gh = Math.floor(gmstHours);
      const gm = Math.floor((gmstHours - gh) * 60);
      const gs = Math.floor(((gmstHours - gh) * 60 - gm) * 60);
      setLiveGmst(`Star Time: ${String(gh).padStart(2, '0')}h ${String(gm).padStart(2, '0')}m ${String(gs).padStart(2, '0')}s`);
    }, 500);

    return () => clearInterval(interval);
  }, [isTicking]);

  // Master Calculation Results Memo
  const calculatedResults = useMemo(() => {
    let effectiveHour = inputHour;
    // Handle timezone adjustment if not UTC
    if (timezoneOffset === 'auto_local') {
      const offsetHours = -new Date().getTimezoneOffset() / 60;
      effectiveHour -= offsetHours;
    } else {
      const numOffset = parseFloat(timezoneOffset);
      if (!isNaN(numOffset)) {
        effectiveHour -= numOffset;
      }
    }

    const res = computeJD(inputYear, inputMonth, inputDay, effectiveHour, inputMinute, inputSecond, calendarRule);
    const jd = res.jd;
    const jdn = res.jdn;
    const mjd = jd - 2400000.5;
    const rjd = jd - 2400000.0;
    const tjd = jd - 2440000.5;

    // Weekday computation: (jdn + 1) mod 7
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let wIndex = (Math.floor(jd + 0.5) + 1) % 7;
    if (wIndex < 0) wIndex += 7;
    const weekday = daysOfWeek[wIndex];

    const doy = getDayOfYear(inputYear, inputMonth, inputDay);
    const leap = isLeapYear(inputYear);

    // Julian Equivalent format
    const jEquiv = jdToCalendar(jd);
    const julianCalStr = `${jEquiv.year}-${String(jEquiv.month).padStart(2, '0')}-${String(jEquiv.day).padStart(2, '0')} Julian`;

    return {
      jd,
      jdn,
      mjd,
      rjd,
      tjd,
      weekday,
      doy,
      leap,
      julianCalStr,
    };
  }, [inputYear, inputMonth, inputDay, inputHour, inputMinute, inputSecond, calendarRule, timezoneOffset]);

  // Delta Date Difference Memo
  const deltaResults = useMemo(() => {
    if (!diffDate1 || !diffDate2) return null;
    const dt1 = new Date(`${diffDate1}T${diffTime1 || '00:00'}:00Z`);
    const dt2 = new Date(`${diffDate2}T${diffTime2 || '00:00'}:00Z`);
    if (isNaN(dt1.getTime()) || isNaN(dt2.getTime())) return null;

    const diffMs = Math.abs(dt2.getTime() - dt1.getTime());
    const days = diffMs / (1000 * 60 * 60 * 24);
    const hours = days * 24;
    const secs = diffMs / 1000;

    return { days, hours, secs };
  }, [diffDate1, diffTime1, diffDate2, diffTime2]);

  // Apply Astronomical Presets
  const applyPreset = (dateStr: string, timeStr: string) => {
    const parts = dateStr.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);
    const timeParts = timeStr.split(':');

    setInputYear(year);
    setInputMonth(month);
    setInputDay(day);
    setInputHour(parseInt(timeParts[0], 10));
    setInputMinute(parseInt(timeParts[1], 10));
    setInputSecond(parseFloat(timeParts[2]));

    if (activeMode !== 'date-to-jd') {
      setActiveMode('date-to-jd');
    }
  };

  // Set Time of Day Presets
  const setTimePreset = (type: 'noon' | 'midnight' | 'now') => {
    if (type === 'noon') {
      setInputHour(12);
      setInputMinute(0);
      setInputSecond(0);
    } else if (type === 'midnight') {
      setInputHour(0);
      setInputMinute(0);
      setInputSecond(0);
    } else if (type === 'now') {
      const n = new Date();
      setInputHour(n.getUTCHours());
      setInputMinute(n.getUTCMinutes());
      setInputSecond(n.getUTCSeconds());
    }
  };

  // Handle Reverse Conversion: JD -> Date
  const handleReverseJdChange = (val: string) => {
    setReverseJd(val);
    const jdNum = parseFloat(val);
    if (!isNaN(jdNum)) {
      setReverseMjd((jdNum - 2400000.5).toFixed(4));
      const d = jdToCalendar(jdNum);
      setInputYear(d.year);
      setInputMonth(d.month);
      setInputDay(d.day);
      setInputHour(d.hour);
      setInputMinute(d.min);
      setInputSecond(d.sec);
    }
  };

  // Handle Reverse Conversion: MJD -> Date
  const handleReverseMjdChange = (val: string) => {
    setReverseMjd(val);
    const mjdNum = parseFloat(val);
    if (!isNaN(mjdNum)) {
      const jdNum = mjdNum + 2400000.5;
      setReverseJd(jdNum.toFixed(4));
      const d = jdToCalendar(jdNum);
      setInputYear(d.year);
      setInputMonth(d.month);
      setInputDay(d.day);
      setInputHour(d.hour);
      setInputMinute(d.min);
      setInputSecond(d.sec);
    }
  };

  // Reset Calculator
  const handleReset = () => {
    const now = new Date();
    setInputYear(now.getUTCFullYear());
    setInputMonth(now.getUTCMonth() + 1);
    setInputDay(now.getUTCDate());
    setInputHour(12);
    setInputMinute(0);
    setInputSecond(0);
    setCalendarRule('auto');
    setTimezoneOffset('0');
  };

  // Copy Full JSON Summary
  const copyFullJson = () => {
    const payload = {
      julianDate: calculatedResults.jd.toFixed(currentPrecision),
      julianDayNumber: calculatedResults.jdn,
      modifiedJulianDate: calculatedResults.mjd.toFixed(currentPrecision),
      reducedJulianDate: calculatedResults.rjd.toFixed(currentPrecision),
      truncatedJulianDate: calculatedResults.tjd.toFixed(currentPrecision),
      dayOfYear: `DOY ${calculatedResults.doy} • ${calculatedResults.weekday}`,
      julianCalendarDate: calculatedResults.julianCalStr,
      leapYear: calculatedResults.leap,
      timestampUtc: new Date().toISOString(),
    };
    handleCopy(JSON.stringify(payload, null, 2), 'copy-json');
  };

  return (
    <main className="w-full pt-0 bg-surface min-h-screen">
      <div className="flex flex-col w-full">
        {/* Top Metrological Status & Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Time & Date Calculators', href: '/time-date' },
            { label: 'Julian Day Calculator' },
          ]}
          badge="Astronomy & History Standards"
          rightContent={
            <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant text-[11px]">
              100% In-Browser &amp; Private
            </span>
          }
        />

        {/* Hero & Live Astronomical Telemetry Hub */}
        <section className="w-full bg-surface py-space-xl relative overflow-hidden">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg pb-space-lg">
              <div className="max-w-3xl flex flex-col gap-space-xs">
                <div className="flex items-center gap-space-xs">
                  <span className="px-2 py-1 rounded-lg bg-surface-container text-primary font-label-caps text-label-caps tracking-wider uppercase font-semibold">
                    Astronomy &amp; History Standards
                  </span>
                  <span className="text-outline text-body-sm">•</span>
                  <span className="text-on-surface-variant font-label-caps text-label-caps uppercase">
                    100% In-Browser &amp; Private
                  </span>
                </div>
                <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
                  Julian Day Calculator
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Easily convert between everyday calendar dates, Julian Day Numbers (JDN), Modified Julian Dates (MJD), and the Day of the Year. Perfect for astronomy, satellite tracking, historical research, and students.
                </p>
              </div>
              {/* Live Clock Controls */}
              <div className="flex items-center gap-space-xs shrink-0 self-start lg:self-end">
                <button
                  onClick={() => setIsTicking((prev) => !prev)}
                  className="px-space-md py-space-xs rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm flex items-center gap-space-2xs shadow-sm transition-all"
                  id="btn-toggle-tick"
                >
                  <span className="material-symbols-outlined text-[18px] text-secondary" id="tick-icon">
                    {isTicking ? 'pause' : 'play_arrow'}
                  </span>
                  <span id="tick-label">{isTicking ? 'Pause Live Clock' : 'Resume Live Clock'}</span>
                </button>
                <button
                  onClick={() => {
                    const summary = `Julian Date: ${liveJd.toFixed(6)}\nMJD: ${liveMjd.toFixed(6)}\nDay ${liveDoy} / ${liveDoyTotal}\n${liveUtc}`;
                    handleCopy(summary, 'copy-live-all');
                  }}
                  className="px-space-md py-space-xs rounded-xl bg-primary text-on-primary font-body-sm text-body-sm flex items-center gap-space-2xs shadow-sm hover:opacity-95 transition-all"
                  id="btn-copy-live-all"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {copiedKey === 'copy-live-all' ? 'check' : 'content_copy'}
                  </span>
                  <span>{copiedKey === 'copy-live-all' ? 'Copied' : 'Copy All Values'}</span>
                </button>
              </div>
            </div>

            {/* 4-Up Live Astronomical Telemetry Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
              {/* Live JD Card */}
              <div className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between pb-space-2xs">
                  <span className="font-label-caps text-label-caps uppercase text-outline tracking-wider">
                    Current Julian Date (JD)
                  </span>
                  <span className="material-symbols-outlined text-primary text-[20px]">calendar_today</span>
                </div>
                <div className="py-space-2xs">
                  <div className="font-data-mono text-[24px] font-bold text-on-surface tracking-tight" id="live-jd">
                    {liveJd.toFixed(6)}
                  </div>
                  <div className="text-body-sm font-body-sm text-on-surface-variant flex items-center gap-1">
                    <span>Counted continuously since Jan 1, 4713 BCE</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-space-2xs">
                  <span className="text-label-caps font-label-caps text-primary uppercase font-semibold">
                    Day Starts at 12:00 Noon
                  </span>
                  <button
                    className="text-outline hover:text-primary transition-colors"
                    onClick={() => handleCopy(liveJd.toFixed(6), 'live-jd')}
                    title="Copy JD"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {copiedKey === 'live-jd' ? 'check' : 'content_copy'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Live MJD Card */}
              <div className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between pb-space-2xs">
                  <span className="font-label-caps text-label-caps uppercase text-outline tracking-wider">
                    Modified Julian Date (MJD)
                  </span>
                  <span className="material-symbols-outlined text-secondary text-[20px]">public</span>
                </div>
                <div className="py-space-2xs">
                  <div className="font-data-mono text-[24px] font-bold text-secondary tracking-tight" id="live-mjd">
                    {liveMjd.toFixed(6)}
                  </div>
                  <div className="text-body-sm font-body-sm text-on-surface-variant flex items-center gap-1">
                    <span>Standard modern space &amp; astronomy count</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-space-2xs">
                  <span className="text-label-caps font-label-caps text-secondary uppercase font-semibold">
                    Starts at Midnight (00:00 UT)
                  </span>
                  <button
                    className="text-outline hover:text-secondary transition-colors"
                    onClick={() => handleCopy(liveMjd.toFixed(6), 'live-mjd')}
                    title="Copy MJD"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {copiedKey === 'live-mjd' ? 'check' : 'content_copy'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Live DOY Card */}
              <div className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between pb-space-2xs">
                  <span className="font-label-caps text-label-caps uppercase text-outline tracking-wider">
                    Day of the Year
                  </span>
                  <span className="material-symbols-outlined text-tertiary text-[20px]">date_range</span>
                </div>
                <div className="py-space-2xs">
                  <div className="font-data-mono text-[24px] font-bold text-on-surface tracking-tight" id="live-doy">
                    Day {liveDoy} / {liveDoyTotal}
                  </div>
                  <div className="text-body-sm font-body-sm text-on-surface-variant" id="live-doy-pct">
                    {liveDoyPct}% of Year Passed
                  </div>
                </div>
                <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-tertiary-container h-full rounded-full transition-all duration-500"
                    id="live-doy-bar"
                    style={{ width: `${liveDoyPct}%` }}
                  ></div>
                </div>
              </div>

              {/* Live Sidereal & UTC Card */}
              <div className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between pb-space-2xs">
                  <span className="font-label-caps text-label-caps uppercase text-outline tracking-wider">
                    Greenwich Star Time (GMST)
                  </span>
                  <span className="material-symbols-outlined text-primary text-[20px]">schedule</span>
                </div>
                <div className="py-space-2xs">
                  <div className="font-data-mono text-[20px] font-semibold text-on-surface" id="live-utc">
                    {liveUtc}
                  </div>
                  <div className="text-body-sm font-body-sm text-on-surface-variant font-data-mono" id="live-gmst">
                    {liveGmst}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-space-2xs">
                  <span className="text-label-caps font-label-caps text-outline uppercase" id="live-j2000-offset">
                    Earth&apos;s rotation relative to distant stars
                  </span>
                  <span className="material-symbols-outlined text-outline text-[16px]">verified</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Astronomical Calculator Workbench */}
        <section className="w-full bg-surface-container-low py-space-2xl">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
            {/* Quick Astronomical Presets Carousel */}
            <div className="mb-space-lg flex flex-col gap-space-2xs">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-label-caps uppercase tracking-wider text-outline flex items-center gap-1 font-semibold">
                  <span className="material-symbols-outlined text-[16px] text-primary">bookmark</span>
                  Quickly jump to famous dates in space &amp; history:
                </span>
                <span className="text-body-sm font-body-sm text-on-surface-variant hidden md:inline">
                  Click any date to load into calculator
                </span>
              </div>
              <div className="flex items-center gap-space-xs overflow-x-auto pb-2 scrollbar-none">
                <button
                  className="preset-pill px-space-sm py-1.5 rounded-xl bg-surface-container-lowest text-on-surface hover:bg-primary hover:text-on-primary font-body-sm text-body-sm shadow-sm transition-all shrink-0 cursor-pointer"
                  onClick={() => applyPreset('2000-01-01', '12:00:00')}
                >
                  <strong>Standard Epoch (J2000.0)</strong> (JD 2451545.0)
                </button>
                <button
                  className="preset-pill px-space-sm py-1.5 rounded-xl bg-surface-container-lowest text-on-surface hover:bg-primary hover:text-on-primary font-body-sm text-body-sm shadow-sm transition-all shrink-0 cursor-pointer"
                  onClick={() => applyPreset('1969-07-20', '20:17:40')}
                >
                  <strong>Apollo 11 Moon Landing</strong> (JD 2440423.3456)
                </button>
                <button
                  className="preset-pill px-space-sm py-1.5 rounded-xl bg-surface-container-lowest text-on-surface hover:bg-primary hover:text-on-primary font-body-sm text-body-sm shadow-sm transition-all shrink-0 cursor-pointer"
                  onClick={() => applyPreset('1970-01-01', '00:00:00')}
                >
                  <strong>Start of Unix Computer Time</strong> (JD 2440587.5)
                </button>
                <button
                  className="preset-pill px-space-sm py-1.5 rounded-xl bg-surface-container-lowest text-on-surface hover:bg-primary hover:text-on-primary font-body-sm text-body-sm shadow-sm transition-all shrink-0 cursor-pointer"
                  onClick={() => applyPreset('1980-01-06', '00:00:00')}
                >
                  <strong>GPS Epoch</strong> (JD 2444244.5)
                </button>
                <button
                  className="preset-pill px-space-sm py-1.5 rounded-xl bg-surface-container-lowest text-on-surface hover:bg-primary hover:text-on-primary font-body-sm text-body-sm shadow-sm transition-all shrink-0 cursor-pointer"
                  onClick={() => applyPreset('1957-10-04', '19:28:34')}
                >
                  <strong>Sputnik 1 Launch</strong> (JD 2436116.3115)
                </button>
              </div>
            </div>

            {/* Main Workbench Layout: 12-col Grid (Inputs: 7 cols, Dynamic Results Sidecar: 5 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
              {/* Left Panel: Mode Switcher & Input Controls (7 Columns) */}
              <div className="lg:col-span-7 flex flex-col gap-space-md">
                {/* Mode Tabs */}
                <div className="p-1 rounded-2xl bg-surface-container flex items-center gap-1 overflow-x-auto">
                  <button
                    className={`mode-tab flex-1 min-w-[140px] py-2 px-space-sm rounded-xl text-body-sm font-body-sm text-center transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      activeMode === 'date-to-jd'
                        ? 'font-semibold bg-surface-container-lowest text-on-surface shadow-sm'
                        : 'font-medium text-on-surface-variant hover:text-on-surface'
                    }`}
                    onClick={() => setActiveMode('date-to-jd')}
                  >
                    <span className="material-symbols-outlined text-[18px] text-primary">event</span> Date to Julian Day
                  </button>
                  <button
                    className={`mode-tab flex-1 min-w-[140px] py-2 px-space-sm rounded-xl text-body-sm font-body-sm text-center transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      activeMode === 'jd-to-date'
                        ? 'font-semibold bg-surface-container-lowest text-on-surface shadow-sm'
                        : 'font-medium text-on-surface-variant hover:text-on-surface'
                    }`}
                    onClick={() => setActiveMode('jd-to-date')}
                  >
                    <span className="material-symbols-outlined text-[18px]">transform</span> Julian Day to Date
                  </button>
                  <button
                    className={`mode-tab flex-1 min-w-[140px] py-2 px-space-sm rounded-xl text-body-sm font-body-sm text-center transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      activeMode === 'date-diff'
                        ? 'font-semibold bg-surface-container-lowest text-on-surface shadow-sm'
                        : 'font-medium text-on-surface-variant hover:text-on-surface'
                    }`}
                    onClick={() => setActiveMode('date-diff')}
                  >
                    <span className="material-symbols-outlined text-[18px]">straighten</span> Days Between Dates (Delta)
                  </button>
                </div>

                {/* Card Wrapper for Active Inputs */}
                <div className="p-space-lg rounded-3xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-lg">
                  {/* MODE 1: Calendar Date -> Julian Day */}
                  {activeMode === 'date-to-jd' && (
                    <div className="flex flex-col gap-space-md" id="panel-date-to-jd">
                      <div className="flex items-center justify-between">
                        <span className="font-label-caps text-label-caps uppercase text-outline tracking-wider font-semibold">
                          Calendar Date &amp; Time
                        </span>
                        <div className="flex items-center gap-1 text-label-caps font-label-caps text-primary font-semibold">
                          <span className="material-symbols-outlined text-[16px]">verified</span> Modern &amp; Historic Calendar Support
                        </div>
                      </div>

                      {/* Date Controls Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
                        <div className="flex flex-col gap-1">
                          <label className="font-label-caps text-label-caps text-on-surface-variant uppercase font-semibold" htmlFor="input-year">
                            Year (CE / BCE)
                          </label>
                          <div className="relative">
                            <input
                              className="w-full p-space-sm rounded-xl bg-surface-container-low focus:bg-surface text-on-surface font-data-mono text-body-lg outline-none transition-all border border-transparent focus:border-primary/40"
                              id="input-year"
                              step="1"
                              type="number"
                              value={inputYear}
                              onChange={(e) => setInputYear(parseInt(e.target.value, 10) || 0)}
                            />
                            <span className="absolute right-3 top-3 text-body-sm font-body-sm text-outline">CE/BC</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-label-caps text-label-caps text-on-surface-variant uppercase font-semibold" htmlFor="input-month">
                            Month
                          </label>
                          <select
                            className="w-full p-space-sm rounded-xl bg-surface-container-low focus:bg-surface text-on-surface font-body-md text-body-md outline-none transition-all cursor-pointer border border-transparent focus:border-primary/40"
                            id="input-month"
                            value={inputMonth}
                            onChange={(e) => setInputMonth(parseInt(e.target.value, 10))}
                          >
                            <option value="1">01 - January</option>
                            <option value="2">02 - February</option>
                            <option value="3">03 - March</option>
                            <option value="4">04 - April</option>
                            <option value="5">05 - May</option>
                            <option value="6">06 - June</option>
                            <option value="7">07 - July</option>
                            <option value="8">08 - August</option>
                            <option value="9">09 - September</option>
                            <option value="10">10 - October</option>
                            <option value="11">11 - November</option>
                            <option value="12">12 - December</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-label-caps text-label-caps text-on-surface-variant uppercase font-semibold" htmlFor="input-day">
                            Day of Month
                          </label>
                          <input
                            className="w-full p-space-sm rounded-xl bg-surface-container-low focus:bg-surface text-on-surface font-data-mono text-body-lg outline-none transition-all border border-transparent focus:border-primary/40"
                            id="input-day"
                            max="31"
                            min="1"
                            type="number"
                            value={inputDay}
                            onChange={(e) => setInputDay(parseInt(e.target.value, 10) || 1)}
                          />
                        </div>
                      </div>

                      {/* Time Controls Grid */}
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <label className="font-label-caps text-label-caps text-on-surface-variant uppercase font-semibold">
                            Time of Day (Hours, Minutes, Seconds)
                          </label>
                          <div className="flex items-center gap-space-xs">
                            <button
                              className="text-body-sm font-body-sm text-primary hover:underline cursor-pointer"
                              onClick={() => setTimePreset('noon')}
                              type="button"
                            >
                              Noon (12:00)
                            </button>
                            <span className="text-outline">•</span>
                            <button
                              className="text-body-sm font-body-sm text-primary hover:underline cursor-pointer"
                              onClick={() => setTimePreset('midnight')}
                              type="button"
                            >
                              Midnight (00:00)
                            </button>
                            <span className="text-outline">•</span>
                            <button
                              className="text-body-sm font-body-sm text-primary hover:underline cursor-pointer"
                              onClick={() => setTimePreset('now')}
                              type="button"
                            >
                              Current Time
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-space-sm">
                          <div className="relative">
                            <input
                              className="w-full p-space-sm rounded-xl bg-surface-container-low focus:bg-surface text-on-surface font-data-mono text-body-lg outline-none transition-all border border-transparent focus:border-primary/40"
                              id="input-hour"
                              max="23"
                              min="0"
                              type="number"
                              value={inputHour}
                              onChange={(e) => setInputHour(parseInt(e.target.value, 10) || 0)}
                            />
                            <span className="absolute right-3 top-3 text-body-sm font-body-sm text-outline">HR</span>
                          </div>
                          <div className="relative">
                            <input
                              className="w-full p-space-sm rounded-xl bg-surface-container-low focus:bg-surface text-on-surface font-data-mono text-body-lg outline-none transition-all border border-transparent focus:border-primary/40"
                              id="input-minute"
                              max="59"
                              min="0"
                              type="number"
                              value={inputMinute}
                              onChange={(e) => setInputMinute(parseInt(e.target.value, 10) || 0)}
                            />
                            <span className="absolute right-3 top-3 text-body-sm font-body-sm text-outline">MIN</span>
                          </div>
                          <div className="relative">
                            <input
                              className="w-full p-space-sm rounded-xl bg-surface-container-low focus:bg-surface text-on-surface font-data-mono text-body-lg outline-none transition-all border border-transparent focus:border-primary/40"
                              id="input-second"
                              max="59.999"
                              min="0"
                              step="any"
                              type="number"
                              value={inputSecond}
                              onChange={(e) => setInputSecond(parseFloat(e.target.value) || 0)}
                            />
                            <span className="absolute right-3 top-3 text-body-sm font-body-sm text-outline">SEC</span>
                          </div>
                        </div>
                      </div>

                      {/* Calendar Transition System & Time Zone */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm pt-space-xs">
                        <div className="flex flex-col gap-1">
                          <label className="font-label-caps text-label-caps text-on-surface-variant uppercase font-semibold" htmlFor="select-calendar-rule">
                            Calendar Rule
                          </label>
                          <select
                            className="w-full p-space-sm rounded-xl bg-surface-container-low focus:bg-surface text-on-surface font-body-sm text-body-sm outline-none transition-all cursor-pointer border border-transparent focus:border-primary/40"
                            id="select-calendar-rule"
                            value={calendarRule}
                            onChange={(e) => setCalendarRule(e.target.value)}
                          >
                            <option value="auto">Automatic (Modern Gregorian &amp; Julian History)</option>
                            <option value="gregorian">Gregorian Calendar</option>
                            <option value="julian">Julian Calendar</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-label-caps text-label-caps text-on-surface-variant uppercase font-semibold" htmlFor="select-timezone">
                            Time Zone
                          </label>
                          <select
                            className="w-full p-space-sm rounded-xl bg-surface-container-low focus:bg-surface text-on-surface font-body-sm text-body-sm outline-none transition-all cursor-pointer border border-transparent focus:border-primary/40"
                            id="select-timezone"
                            value={timezoneOffset}
                            onChange={(e) => setTimezoneOffset(e.target.value)}
                          >
                            <option value="0">UTC +00:00 (Standard Universal Time)</option>
                            <option value="auto_local">My Local Browser Time Zone</option>
                            <option value="-5">UTC -05:00 (US Eastern EST)</option>
                            <option value="-8">UTC -08:00 (US Pacific PST)</option>
                            <option value="1">UTC +01:00 (Central European CET)</option>
                            <option value="9">UTC +09:00 (Japan Standard JST)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* MODE 2: Julian Day -> Calendar Date */}
                  {activeMode === 'jd-to-date' && (
                    <div className="flex flex-col gap-space-md" id="panel-jd-to-date">
                      <div className="flex items-center justify-between">
                        <span className="font-label-caps text-label-caps uppercase text-outline tracking-wider font-semibold">
                          Enter Julian Day Number
                        </span>
                        <span className="text-body-sm font-body-sm text-on-surface-variant">
                          Converts back to everyday calendar date
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                        <div className="flex flex-col gap-1">
                          <label className="font-label-caps text-label-caps text-on-surface-variant uppercase font-semibold" htmlFor="input-reverse-jd">
                            Julian Date (JD)
                          </label>
                          <input
                            className="w-full p-space-sm rounded-xl bg-surface-container-low focus:bg-surface text-on-surface font-data-mono text-body-lg outline-none transition-all border border-transparent focus:border-primary/40"
                            id="input-reverse-jd"
                            placeholder="e.g. 2451545.0"
                            step="any"
                            type="number"
                            value={reverseJd}
                            onChange={(e) => handleReverseJdChange(e.target.value)}
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-label-caps text-label-caps text-on-surface-variant uppercase font-semibold" htmlFor="input-reverse-mjd">
                            Or Modified Julian Date (MJD)
                          </label>
                          <input
                            className="w-full p-space-sm rounded-xl bg-surface-container-low focus:bg-surface text-on-surface font-data-mono text-body-lg outline-none transition-all border border-transparent focus:border-primary/40"
                            id="input-reverse-mjd"
                            placeholder="e.g. 51544.5"
                            step="any"
                            type="number"
                            value={reverseMjd}
                            onChange={(e) => handleReverseMjdChange(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* MODE 3: Date Delta */}
                  {activeMode === 'date-diff' && (
                    <div className="flex flex-col gap-space-md" id="panel-date-diff">
                      <div className="flex items-center justify-between">
                        <span className="font-label-caps text-label-caps uppercase text-outline tracking-wider font-semibold">
                          Days Between Two Dates
                        </span>
                        <span className="text-body-sm font-body-sm text-on-surface-variant">
                          Calculates elapsed days and hours
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                        <div className="p-space-sm rounded-2xl bg-surface-container-low flex flex-col gap-space-xs">
                          <span className="font-label-caps text-label-caps uppercase text-primary font-semibold">
                            First Date
                          </span>
                          <input
                            className="p-space-xs rounded-xl bg-surface-container-lowest text-on-surface font-data-mono text-body-md outline-none border border-outline-variant/30"
                            id="diff-date-1"
                            type="date"
                            value={diffDate1}
                            onChange={(e) => setDiffDate1(e.target.value)}
                          />
                          <input
                            className="p-space-xs rounded-xl bg-surface-container-lowest text-on-surface font-data-mono text-body-md outline-none border border-outline-variant/30"
                            id="diff-time-1"
                            type="time"
                            value={diffTime1}
                            onChange={(e) => setDiffTime1(e.target.value)}
                          />
                        </div>
                        <div className="p-space-sm rounded-2xl bg-surface-container-low flex flex-col gap-space-xs">
                          <span className="font-label-caps text-label-caps uppercase text-secondary font-semibold">
                            Second Date
                          </span>
                          <input
                            className="p-space-xs rounded-xl bg-surface-container-lowest text-on-surface font-data-mono text-body-md outline-none border border-outline-variant/30"
                            id="diff-date-2"
                            type="date"
                            value={diffDate2}
                            onChange={(e) => setDiffDate2(e.target.value)}
                          />
                          <input
                            className="p-space-xs rounded-xl bg-surface-container-lowest text-on-surface font-data-mono text-body-md outline-none border border-outline-variant/30"
                            id="diff-time-2"
                            type="time"
                            value={diffTime2}
                            onChange={(e) => setDiffTime2(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Global Precision Slider & Action Bar */}
                  <div className="pt-space-sm flex flex-wrap items-center justify-between gap-space-sm bg-surface-container-low/50 p-space-sm rounded-2xl">
                    <div className="flex items-center gap-space-sm">
                      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase font-semibold">
                        Decimal Places:
                      </span>
                      <div className="flex items-center gap-1">
                        {[4, 6, 8].map((prec) => (
                          <button
                            key={prec}
                            className={`prec-pill px-2.5 py-1 rounded-lg text-body-sm font-body-sm transition-all cursor-pointer ${
                              currentPrecision === prec
                                ? 'font-semibold bg-primary text-on-primary shadow-sm'
                                : 'font-medium bg-surface-container text-on-surface hover:bg-surface-container-high'
                            }`}
                            onClick={() => setCurrentPrecision(prec)}
                          >
                            {prec}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-space-xs">
                      <button
                        className="px-space-md py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-body-sm text-body-sm transition-all flex items-center gap-1 cursor-pointer"
                        onClick={handleReset}
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[16px]">restart_alt</span> Clear / Reset
                      </button>
                      <button
                        className="px-space-lg py-2 rounded-xl bg-primary hover:opacity-95 text-on-primary font-body-sm text-body-sm font-semibold shadow-md transition-all flex items-center gap-1 cursor-pointer"
                        onClick={() => {}}
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[18px]">calculate</span> Recalculate
                      </button>
                    </div>
                  </div>
                </div>

                {/* Micro Explainer Note */}
                <div className="p-space-md rounded-2xl bg-surface-container/60 text-on-surface-variant text-body-sm font-body-sm flex items-start gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">info</span>
                  <div>
                    <strong className="text-on-surface">Why Julian Days start at 12:00 Noon:</strong> Starting at noon prevents the calendar date from changing in the middle of the night during stargazing observations. That way, a full night of observation stays on the exact same Julian day number.
                  </div>
                </div>
              </div>

              {/* Right Panel: Dynamic Results Deck (5 Columns) */}
              <div className="lg:col-span-5 flex flex-col gap-space-md sticky top-24">
                {/* Master Calculated Output Box */}
                <div className="p-space-lg rounded-3xl bg-surface-container-lowest shadow-md flex flex-col gap-space-md relative overflow-hidden">
                  <div className="flex items-center justify-between pb-space-xs">
                    <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
                      Calculated Date Results
                    </span>
                    <button
                      className="text-body-sm font-body-sm text-primary hover:underline flex items-center gap-1 cursor-pointer"
                      onClick={copyFullJson}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {copiedKey === 'copy-json' ? 'check' : 'copy_all'}
                      </span>
                      {copiedKey === 'copy-json' ? 'Copied' : 'Copy JSON'}
                    </button>
                  </div>

                  {/* Hero Output: Julian Date */}
                  <div className="flex flex-col gap-1 p-space-md rounded-2xl bg-surface-container-low/70">
                    <div className="flex items-center justify-between">
                      <span className="font-label-caps text-label-caps uppercase text-on-surface-variant font-semibold">
                        Julian Date (JD)
                      </span>
                      <span className="text-label-caps font-label-caps text-outline">Continuous Decimal</span>
                    </div>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-data-mono text-numerical-display text-on-surface font-bold tracking-tight" id="res-jd">
                        {calculatedResults.jd.toFixed(currentPrecision)}
                      </span>
                      <button
                        className="text-outline hover:text-primary transition-colors cursor-pointer"
                        onClick={() => handleCopy(calculatedResults.jd.toFixed(currentPrecision), 'res-jd')}
                        title="Copy Julian Date"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {copiedKey === 'res-jd' ? 'check' : 'content_copy'}
                        </span>
                      </button>
                    </div>
                    <span className="text-body-sm font-body-sm text-on-surface-variant">
                      Total days since January 1, 4713 BCE at 12:00 Noon
                    </span>
                  </div>

                  {/* Output Metric Grid */}
                  <div className="grid grid-cols-2 gap-space-sm">
                    <div className="p-space-sm rounded-xl bg-surface-container-low flex flex-col justify-between">
                      <span className="font-label-caps text-label-caps uppercase text-outline font-semibold">
                        Julian Day Number (JDN)
                      </span>
                      <span className="font-data-mono text-headline-md font-bold text-on-surface" id="res-jdn">
                        {calculatedResults.jdn.toLocaleString()}
                      </span>
                      <span className="text-label-caps font-label-caps text-on-surface-variant">Whole integer number</span>
                    </div>
                    <div className="p-space-sm rounded-xl bg-surface-container-low flex flex-col justify-between">
                      <span className="font-label-caps text-label-caps uppercase text-secondary font-semibold">
                        Modified Julian Date (MJD)
                      </span>
                      <span className="font-data-mono text-headline-md font-bold text-secondary" id="res-mjd">
                        {calculatedResults.mjd.toFixed(currentPrecision)}
                      </span>
                      <span className="text-label-caps font-label-caps text-on-surface-variant">
                        JD − 2400000.5 (Starts Midnight)
                      </span>
                    </div>
                  </div>

                  {/* Supplementary Offsets List */}
                  <div className="flex flex-col gap-space-xs text-body-sm font-body-sm">
                    <div className="flex items-center justify-between py-1.5 px-space-xs rounded-lg hover:bg-surface-container-low transition-colors">
                      <span className="text-on-surface-variant">Reduced Julian Date (RJD):</span>
                      <span className="font-data-mono font-medium text-on-surface" id="res-rjd">
                        {calculatedResults.rjd.toFixed(currentPrecision)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1.5 px-space-xs rounded-lg hover:bg-surface-container-low transition-colors">
                      <span className="text-on-surface-variant">Truncated Julian Date (TJD):</span>
                      <span className="font-data-mono font-medium text-on-surface" id="res-tjd">
                        {calculatedResults.tjd.toFixed(currentPrecision)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1.5 px-space-xs rounded-lg hover:bg-surface-container-low transition-colors">
                      <span className="text-on-surface-variant">Day of Year &amp; Weekday:</span>
                      <span className="font-data-mono font-medium text-on-surface" id="res-doy-weekday">
                        DOY {calculatedResults.doy} • {calculatedResults.weekday}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1.5 px-space-xs rounded-lg hover:bg-surface-container-low transition-colors">
                      <span className="text-on-surface-variant">Leap Year Status:</span>
                      <span
                        className={`px-2 py-0.5 rounded-full font-label-caps text-label-caps font-semibold ${
                          calculatedResults.leap
                            ? 'bg-secondary-container/30 text-on-secondary-container'
                            : 'bg-surface-container text-primary'
                        }`}
                        id="res-leap"
                      >
                        {calculatedResults.leap ? 'Leap Year (366 Days)' : 'Common Year (365 Days)'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1.5 px-space-xs rounded-lg hover:bg-surface-container-low transition-colors">
                      <span className="text-on-surface-variant">Historic Julian Calendar Date:</span>
                      <span className="font-data-mono font-medium text-on-surface" id="res-julian-cal">
                        {calculatedResults.julianCalStr}
                      </span>
                    </div>
                  </div>

                  {/* Private browser calculation verify indicator */}
                  <div className="p-space-xs rounded-xl bg-surface-container text-on-surface-variant text-label-caps font-label-caps flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-secondary">verified_user</span> Calculations run 100% privately in your browser.
                    </span>
                    <span className="text-outline">Instant</span>
                  </div>
                </div>

                {/* Delta Result Card (Appears if Mode 3 active) */}
                {activeMode === 'date-diff' && deltaResults && (
                  <div className="p-space-md rounded-2xl bg-secondary-container/20 text-on-surface flex flex-col gap-space-xs" id="card-delta-summary">
                    <span className="font-label-caps text-label-caps uppercase text-secondary font-bold">
                      Elapsed Days &amp; Time
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="font-data-mono text-numerical-display font-bold text-on-surface" id="res-delta-days">
                        {deltaResults.days.toFixed(4)}
                      </span>
                      <span className="text-body-md font-body-md text-on-surface-variant">Total Days</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-body-sm font-body-sm text-on-surface-variant pt-1">
                      <div>
                        Hours: <strong className="text-on-surface font-data-mono">{deltaResults.hours.toLocaleString()}</strong>
                      </div>
                      <div>
                        Seconds: <strong className="text-on-surface font-data-mono">{deltaResults.secs.toLocaleString()}</strong>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Section 1: How Julian Days Are Calculated */}
        <section className="w-full bg-surface py-space-3xl">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="flex flex-col gap-space-xs pb-space-xl">
              <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-semibold">
                Easy Step-by-Step Math
              </span>
              <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">
                How Julian Days Are Calculated (Simple Formulas)
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">
                Julian Day counting turns complicated months, leap years, and leap centuries into a simple, continuous number of days. Here is how scientists and computers calculate it:
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
              {/* Step 1: Converting Calendar Dates to Julian Days */}
              <div className="p-space-lg rounded-3xl bg-surface-container-lowest shadow-sm flex flex-col justify-between gap-space-md hover:shadow-md transition-shadow">
                <div className="flex flex-col gap-space-xs">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold font-data-mono">
                    01
                  </div>
                  <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
                    Converting Calendar Dates to Julian Days
                  </h3>
                  <p className="text-body-sm font-body-sm text-on-surface-variant">
                    Following standard algorithms from the{' '}
                    <a
                      href="https://aa.usno.navy.mil/data/JulianDate"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary font-medium hover:underline inline-flex items-center gap-0.5"
                    >
                      U.S. Naval Observatory (USNO)
                      <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                    </a>
                    , the Fliegel–Van Flandern formula finds the integer Julian Day Number (JDN) for any calendar date:
                  </p>
                  <div className="p-space-sm rounded-xl bg-surface-container font-data-mono text-body-sm text-on-surface overflow-x-auto leading-relaxed">
                    JDN = (1461 × (Year + 4800 + (Month - 14)/12))/4<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ (367 × (Month - 2 - 12 × ((Month - 14)/12)))/12<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- (3 × ((Year + 4900 + (Month - 14)/12)/100))/4<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ Day - 32075
                  </div>
                </div>
                <div className="text-label-caps font-label-caps text-outline uppercase flex items-center justify-between">
                  <span>Standard formula used worldwide</span>
                  <a
                    href="https://aa.usno.navy.mil/data/JulianDate"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-0.5 lowercase text-[11px]"
                  >
                    usno.navy.mil <span className="material-symbols-outlined text-[11px]">open_in_new</span>
                  </a>
                </div>
              </div>

              {/* Step 2: Adding the Time of Day as a Decimal Fraction */}
              <div className="p-space-lg rounded-3xl bg-surface-container-lowest shadow-sm flex flex-col justify-between gap-space-md hover:shadow-md transition-shadow">
                <div className="flex flex-col gap-space-xs">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center font-bold font-data-mono">
                    02
                  </div>
                  <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
                    Adding the Time of Day as a Decimal Fraction
                  </h3>
                  <p className="text-body-sm font-body-sm text-on-surface-variant">
                    Because Julian Days start at 12:00 Noon, 12 hours is subtracted from morning or evening times to find the fraction of the day:
                  </p>
                  <div className="p-space-sm rounded-xl bg-surface-container font-data-mono text-body-sm text-on-surface overflow-x-auto leading-relaxed">
                    Day Fraction = (Hour - 12) / 24<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ Minute / 1440<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ Second / 86400<br />
                    JD = JDN + Day Fraction
                  </div>
                </div>
                <div className="text-label-caps font-label-caps text-outline uppercase">Allows exact second-level precision</div>
              </div>

              {/* Step 3: Modified Julian Date (MJD) */}
              <div className="p-space-lg rounded-3xl bg-surface-container-lowest shadow-sm flex flex-col justify-between gap-space-md hover:shadow-md transition-shadow">
                <div className="flex flex-col gap-space-xs">
                  <div className="w-10 h-10 rounded-xl bg-tertiary-container/10 text-tertiary flex items-center justify-center font-bold font-data-mono">
                    03
                  </div>
                  <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
                    Modified Julian Date (MJD)
                  </h3>
                  <p className="text-body-sm font-body-sm text-on-surface-variant">
                    As defined in satellite tracking standards by{' '}
                    <a
                      href="https://ssd.jpl.nasa.gov/tools/jdc/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary font-medium hover:underline inline-flex items-center gap-0.5"
                    >
                      NASA JPL Solar System Dynamics
                      <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                    </a>
                    , subtracting 2,400,000.5 gives a shorter number that starts at civil midnight:
                  </p>
                  <div className="p-space-sm rounded-xl bg-surface-container font-data-mono text-body-sm text-on-surface overflow-x-auto leading-relaxed">
                    MJD = JD - 2400000.5 (Starts at 00:00 Midnight)<br />
                    RJD = JD - 2400000.0 (Starts at 12:00 Noon)<br />
                    TJD = JD - 2440000.5 (NASA Apollo 1968 count)<br />
                    Unix Epoch = (JD - 2440587.5) × 86,400 s
                  </div>
                </div>
                <div className="text-label-caps font-label-caps text-outline uppercase flex items-center justify-between">
                  <span>Widely used in spaceflight &amp; satellites</span>
                  <a
                    href="https://ssd.jpl.nasa.gov/tools/jdc/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-0.5 lowercase text-[11px]"
                  >
                    ssd.jpl.nasa.gov <span className="material-symbols-outlined text-[11px]">open_in_new</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Comparing Different Astronomical Time Systems */}
        <section className="w-full bg-surface-container-low py-space-3xl">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop flex flex-col gap-space-lg">
            <div className="flex flex-col gap-space-xs">
              <span className="font-label-caps text-label-caps uppercase tracking-wider text-outline font-semibold">
                Reference Table
              </span>
              <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">
                Comparing Different Astronomical Time Systems
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                Here is how Julian Days compare to other common scientific and computer time counting formats:
              </p>
            </div>
            {/* Metrology Table */}
            <div className="w-full rounded-3xl bg-surface-container-lowest shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left font-body-sm text-body-sm text-on-surface">
                  <thead className="bg-surface-container text-on-surface-variant font-label-caps text-label-caps uppercase tracking-wider">
                    <tr>
                      <th className="py-space-sm px-space-md">Time System</th>
                      <th className="py-space-sm px-space-md">Starting Point / Origin</th>
                      <th className="py-space-sm px-space-md">Day Starts At</th>
                      <th className="py-space-sm px-space-md">Formula / Offset</th>
                      <th className="py-space-sm px-space-md">Common Everyday &amp; Science Uses</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container">
                    <tr className="hover:bg-surface-container-low/60 transition-colors">
                      <td className="py-space-sm px-space-md font-semibold text-primary">Julian Date (JD)</td>
                      <td className="py-space-sm px-space-md font-data-mono">Jan 1, 4713 BCE at 12:00 Noon</td>
                      <td className="py-space-sm px-space-md">12:00 (Noon)</td>
                      <td className="py-space-sm px-space-md font-data-mono">Base (0.0)</td>
                      <td className="py-space-sm px-space-md">Astronomy, star charts, tracking variable stars</td>
                    </tr>
                    <tr className="hover:bg-surface-container-low/60 transition-colors">
                      <td className="py-space-sm px-space-md font-semibold text-secondary">Modified Julian Date (MJD)</td>
                      <td className="py-space-sm px-space-md font-data-mono">Nov 17, 1858 at Midnight</td>
                      <td className="py-space-sm px-space-md">00:00 (Midnight)</td>
                      <td className="py-space-sm px-space-md font-data-mono">JD − 2,400,000.5</td>
                      <td className="py-space-sm px-space-md">Spacecraft orbits, satellite telemetry, GPS data</td>
                    </tr>
                    <tr className="hover:bg-surface-container-low/60 transition-colors">
                      <td className="py-space-sm px-space-md font-semibold">Reduced Julian Date (RJD)</td>
                      <td className="py-space-sm px-space-md font-data-mono">Nov 16, 1858 at 12:00 Noon</td>
                      <td className="py-space-sm px-space-md">12:00 (Noon)</td>
                      <td className="py-space-sm px-space-md font-data-mono">JD − 2,400,000.0</td>
                      <td className="py-space-sm px-space-md">Radio astronomy and pulsar timing</td>
                    </tr>
                    <tr className="hover:bg-surface-container-low/60 transition-colors">
                      <td className="py-space-sm px-space-md font-semibold">Truncated Julian Date (TJD)</td>
                      <td className="py-space-sm px-space-md font-data-mono">May 24, 1968 at Midnight</td>
                      <td className="py-space-sm px-space-md">00:00 (Midnight)</td>
                      <td className="py-space-sm px-space-md font-data-mono">JD − 2,440,000.5</td>
                      <td className="py-space-sm px-space-md">NASA Apollo &amp; Space Shuttle flight logs</td>
                    </tr>
                    <tr className="hover:bg-surface-container-low/60 transition-colors">
                      <td className="py-space-sm px-space-md font-semibold">Unix Computer Time</td>
                      <td className="py-space-sm px-space-md font-data-mono">Jan 1, 1970 at Midnight UTC</td>
                      <td className="py-space-sm px-space-md">00:00 (Midnight)</td>
                      <td className="py-space-sm px-space-md font-data-mono">JD − 2,440,587.5</td>
                      <td className="py-space-sm px-space-md">Computers, smartphones, internet timestamps, servers</td>
                    </tr>
                    <tr className="hover:bg-surface-container-low/60 transition-colors">
                      <td className="py-space-sm px-space-md font-semibold">Day of the Year (DOY)</td>
                      <td className="py-space-sm px-space-md font-data-mono">Jan 1 of the current year</td>
                      <td className="py-space-sm px-space-md">00:00 (Midnight)</td>
                      <td className="py-space-sm px-space-md font-data-mono">Day 1 to 365 / 366</td>
                      <td className="py-space-sm px-space-md">Weather tracking, satellite data, school schedules</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: The Story Behind the 7,980-Year Julian Calendar Period */}
        <section className="w-full bg-surface py-space-3xl">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
              <div className="lg:col-span-7 flex flex-col gap-space-md">
                <div className="flex items-center gap-space-xs">
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-label-caps text-label-caps font-semibold">
                    HISTORY &amp; ORIGINS
                  </span>
                  <span className="text-body-sm font-body-sm text-on-surface-variant">• Joseph Justus Scaliger (1583)</span>
                </div>
                <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight leading-tight">
                  The Story Behind the 7,980-Year Julian Calendar Period
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  In 1583, French classical scholar <strong>Joseph Justus Scaliger</strong> wanted to solve a major problem: different kingdoms and cultures counted years completely differently, making it very hard to compare historical dates. He cleverly combined three ancient calendar repeating cycles:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
                  <div className="p-space-sm rounded-2xl bg-surface-container-low flex flex-col gap-1">
                    <span className="font-headline-md text-headline-md font-bold text-primary font-data-mono">28</span>
                    <span className="font-body-md text-body-md font-semibold text-on-surface">Solar Cycle</span>
                    <p className="text-body-sm font-body-sm text-on-surface-variant">
                      The number of years it takes for calendar days of the week to repeat on the exact same dates.
                    </p>
                  </div>
                  <div className="p-space-sm rounded-2xl bg-surface-container-low flex flex-col gap-1">
                    <span className="font-headline-md text-headline-md font-bold text-secondary font-data-mono">19</span>
                    <span className="font-body-md text-body-md font-semibold text-on-surface">Lunar Cycle</span>
                    <p className="text-body-sm font-body-sm text-on-surface-variant">
                      The number of years it takes for moon phases to recur on the exact same days of the year.
                    </p>
                  </div>
                  <div className="p-space-sm rounded-2xl bg-surface-container-low flex flex-col gap-1">
                    <span className="font-headline-md text-headline-md font-bold text-tertiary font-data-mono">15</span>
                    <span className="font-body-md text-body-md font-semibold text-on-surface">Roman Tax Cycle</span>
                    <p className="text-body-sm font-body-sm text-on-surface-variant">
                      A 15-year imperial tax assessment cycle established in ancient Rome under Constantine.
                    </p>
                  </div>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  By multiplying{' '}
                  <code className="font-data-mono bg-surface-container px-1 py-0.5 rounded text-on-surface">
                    28 × 19 × 15 = 7,980 years
                  </code>
                  , he created a grand timeline where every single year has its own unique fingerprint. By counting backward to the last time all three cycles lined up at year 1, he arrived at <strong>January 1, 4713 BCE</strong>. Because this date was before all known recorded human history, historians and scientists could count forward with positive numbers.
                </p>
              </div>
              <div className="lg:col-span-5 flex flex-col gap-space-md">
                <div className="rounded-3xl overflow-hidden shadow-md bg-surface-container-low flex flex-col">
                  <img
                    className="w-full h-72 object-cover"
                    alt="A historical celestial observatory with astrolabes and armillary spheres"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1p9Chnhxkoc3JvtMNl-yGDOKUyW3Hw0Yb1oU7NuLefZulKaFYKNol9MX_XqDkXGMdLCOiYq_s7A4YHzCnayell5eL7K4zreWUXtc3kZ0bOyds5g0VHHrJCS9dxfc5AQ4B0cbNWnJzgzm8JZ3WqqG4RODNueRJO1bjVmJABDaeMOfBmqhPy9SkyEmaO0FftcY0DLiUmYwbtbeeJTwY87P6w7egxUv-6vOkmLjnDCo"
                  />
                  <div className="p-space-md flex flex-col gap-1 bg-surface-container-lowest">
                    <span className="font-label-caps text-label-caps uppercase text-outline">Stargazing Insight</span>
                    <span className="text-body-md font-body-md font-semibold text-on-surface">
                      Why Julian Days Start at Noon
                    </span>
                    <p className="text-body-sm font-body-sm text-on-surface-variant">
                      Unlike standard civil days that roll over at midnight while astronomers are looking through telescopes, Julian days change at noon so an entire night of skywatching stays on one single date without splitting into two separate days.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: The Missing 10 Days in October 1582 */}
        <section className="w-full bg-surface-container py-space-2xl">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="p-space-xl rounded-3xl bg-surface-container-lowest shadow-sm flex flex-col lg:flex-row items-center justify-between gap-space-lg">
              <div className="flex flex-col gap-space-xs max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-tertiary-container/20 text-tertiary font-label-caps text-label-caps font-bold">
                    CALENDAR HISTORY
                  </span>
                  <span className="text-label-caps font-label-caps text-outline">OCTOBER 1582</span>
                </div>
                <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
                  The Missing 10 Days in October 1582
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  To realign the calendar with the Earth&apos;s seasons, Pope Gregory XIII skipped 10 days on the calendar: Thursday, October 4, 1582 was immediately followed the next morning by Friday, October 15, 1582. While the regular calendar jumped forward, the Julian Day count ticked steadily: <strong>JD 2,299,160 was followed directly by JD 2,299,161</strong> without missing a single second.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-space-sm shrink-0">
                <button
                  className="px-space-md py-space-sm rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm transition-all text-center cursor-pointer"
                  onClick={() => applyPreset('1582-10-04', '12:00:00')}
                >
                  Check Oct 4, 1582 (Julian)
                </button>
                <button
                  className="px-space-md py-space-sm rounded-xl bg-primary text-on-primary font-body-sm text-body-sm font-semibold hover:opacity-95 transition-all text-center cursor-pointer"
                  onClick={() => applyPreset('1582-10-15', '12:00:00')}
                >
                  Check Oct 15, 1582 (Gregorian)
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Easy to Explore Date & Time Category Tools */}
        <section className="w-full bg-surface py-space-3xl">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop flex flex-col gap-space-xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="flex flex-col gap-space-xs">
                <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-bold">
                  Date &amp; Time Category
                </span>
                <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">
                  Easy to Explore Date &amp; Time Tools
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                  Hand-picked precision calculators from our Date &amp; Time category. Instant, private in-browser calculations for astronomical dates, epoch time, calendars, and time zones.
                </p>
              </div>
              <Link
                href="/time-date"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-sm shadow-sm hover:opacity-90 transition-all shrink-0 self-start md:self-end"
              >
                <span>Browse All 37 Tools</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-md">
              {/* Tool 1 */}
              <Link
                className="p-space-lg rounded-3xl bg-surface-container-low hover:bg-surface-container hover:shadow-md transition-all flex flex-col justify-between gap-space-sm group border border-outline-variant/20 hover:border-primary/40"
                href="/julian-day-number-calculator"
              >
                <div className="flex items-center justify-between">
                  <span className="w-10 h-10 rounded-2xl bg-surface-container-lowest flex items-center justify-center text-primary shadow-sm">
                    <span className="material-symbols-outlined text-[20px]">history_edu</span>
                  </span>
                  <span className="font-data-mono text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20 uppercase">Astronomical</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-headline-md font-bold text-on-surface group-hover:text-primary transition-colors">
                    Julian Day Number Calculator
                  </h3>
                  <p className="text-body-sm font-body-sm text-on-surface-variant pt-1 leading-relaxed">
                    Calculate continuous Julian Day Numbers (JDN) and Modified Julian Dates (MJD) for any calendar date.
                  </p>
                </div>
                <span className="text-body-sm font-body-sm text-primary font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Open Calculator <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </span>
              </Link>

              {/* Tool 2 */}
              <Link
                className="p-space-lg rounded-3xl bg-surface-container-low hover:bg-surface-container hover:shadow-md transition-all flex flex-col justify-between gap-space-sm group border border-outline-variant/20 hover:border-primary/40"
                href="/unix-timestamp-converter"
              >
                <div className="flex items-center justify-between">
                  <span className="w-10 h-10 rounded-2xl bg-surface-container-lowest flex items-center justify-center text-secondary shadow-sm">
                    <span className="material-symbols-outlined text-[20px]">terminal</span>
                  </span>
                  <span className="font-data-mono text-[11px] font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded-full border border-secondary/20 uppercase">Computer Time</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-headline-md font-bold text-on-surface group-hover:text-primary transition-colors">
                    Unix Timestamp Converter
                  </h3>
                  <p className="text-body-sm font-body-sm text-on-surface-variant pt-1 leading-relaxed">
                    Convert between computer seconds/ms since Jan 1, 1970 and readable human UTC calendar dates.
                  </p>
                </div>
                <span className="text-body-sm font-body-sm text-primary font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Open Calculator <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </span>
              </Link>

              {/* Tool 3 */}
              <Link
                className="p-space-lg rounded-3xl bg-surface-container-low hover:bg-surface-container hover:shadow-md transition-all flex flex-col justify-between gap-space-sm group border border-outline-variant/20 hover:border-primary/40"
                href="/time-date/days-between-dates"
              >
                <div className="flex items-center justify-between">
                  <span className="w-10 h-10 rounded-2xl bg-surface-container-lowest flex items-center justify-center text-tertiary shadow-sm">
                    <span className="material-symbols-outlined text-[20px]">calendar_today</span>
                  </span>
                  <span className="font-data-mono text-[11px] font-bold text-tertiary bg-tertiary/10 px-2 py-0.5 rounded-full border border-tertiary/20 uppercase">Calendar Days</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-headline-md font-bold text-on-surface group-hover:text-primary transition-colors">
                    Days Between Dates Calculator
                  </h3>
                  <p className="text-body-sm font-body-sm text-on-surface-variant pt-1 leading-relaxed">
                    Count exact calendar days, weekdays, and weekend days between any two historical or future dates.
                  </p>
                </div>
                <span className="text-body-sm font-body-sm text-primary font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Open Calculator <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </span>
              </Link>

              {/* Tool 4 */}
              <Link
                className="p-space-lg rounded-3xl bg-surface-container-low hover:bg-surface-container hover:shadow-md transition-all flex flex-col justify-between gap-space-sm group border border-outline-variant/20 hover:border-primary/40"
                href="/time-date/add-subtract-time"
              >
                <div className="flex items-center justify-between">
                  <span className="w-10 h-10 rounded-2xl bg-surface-container-lowest flex items-center justify-center text-primary shadow-sm">
                    <span className="material-symbols-outlined text-[20px]">more_time</span>
                  </span>
                  <span className="font-data-mono text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20 uppercase">Arithmetic</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-headline-md font-bold text-on-surface group-hover:text-primary transition-colors">
                    Add &amp; Subtract Time Calculator
                  </h3>
                  <p className="text-body-sm font-body-sm text-on-surface-variant pt-1 leading-relaxed">
                    Add or subtract years, months, weeks, days, hours, and minutes to calculate future deadlines.
                  </p>
                </div>
                <span className="text-body-sm font-body-sm text-primary font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Open Calculator <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </span>
              </Link>

              {/* Tool 5 */}
              <Link
                className="p-space-lg rounded-3xl bg-surface-container-low hover:bg-surface-container hover:shadow-md transition-all flex flex-col justify-between gap-space-sm group border border-outline-variant/20 hover:border-primary/40"
                href="/time-date/time-zone-overlap"
              >
                <div className="flex items-center justify-between">
                  <span className="w-10 h-10 rounded-2xl bg-surface-container-lowest flex items-center justify-center text-secondary shadow-sm">
                    <span className="material-symbols-outlined text-[20px]">schedule_send</span>
                  </span>
                  <span className="font-data-mono text-[11px] font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded-full border border-secondary/20 uppercase">Time Zones</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-headline-md font-bold text-on-surface group-hover:text-primary transition-colors">
                    Time Zone Overlap Planner
                  </h3>
                  <p className="text-body-sm font-body-sm text-on-surface-variant pt-1 leading-relaxed">
                    Compare global clocks across multiple international cities and find golden working hour windows.
                  </p>
                </div>
                <span className="text-body-sm font-body-sm text-primary font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Open Calculator <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </span>
              </Link>

              {/* Tool 6 */}
              <Link
                className="p-space-lg rounded-3xl bg-surface-container-low hover:bg-surface-container hover:shadow-md transition-all flex flex-col justify-between gap-space-sm group border border-outline-variant/20 hover:border-primary/40"
                href="/military-time-converter"
              >
                <div className="flex items-center justify-between">
                  <span className="w-10 h-10 rounded-2xl bg-surface-container-lowest flex items-center justify-center text-tertiary shadow-sm">
                    <span className="material-symbols-outlined text-[20px]">military_tech</span>
                  </span>
                  <span className="font-data-mono text-[11px] font-bold text-tertiary bg-tertiary/10 px-2 py-0.5 rounded-full border border-tertiary/20 uppercase">24-Hour Time</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-headline-md font-bold text-on-surface group-hover:text-primary transition-colors">
                    Military Time Converter
                  </h3>
                  <p className="text-body-sm font-body-sm text-on-surface-variant pt-1 leading-relaxed">
                    Convert effortlessly between standard 12-hour AM/PM time, 24-hour time, and Zulu timezone clock.
                  </p>
                </div>
                <span className="text-body-sm font-body-sm text-primary font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Open Calculator <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </span>
              </Link>

              {/* Tool 7 */}
              <Link
                className="p-space-lg rounded-3xl bg-surface-container-low hover:bg-surface-container hover:shadow-md transition-all flex flex-col justify-between gap-space-sm group border border-outline-variant/20 hover:border-primary/40"
                href="/time-date/work-hours"
              >
                <div className="flex items-center justify-between">
                  <span className="w-10 h-10 rounded-2xl bg-surface-container-lowest flex items-center justify-center text-primary shadow-sm">
                    <span className="material-symbols-outlined text-[20px]">payments</span>
                  </span>
                  <span className="font-data-mono text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20 uppercase">Work &amp; Payroll</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-headline-md font-bold text-on-surface group-hover:text-primary transition-colors">
                    Work Hours &amp; Timesheet Calculator
                  </h3>
                  <p className="text-body-sm font-body-sm text-on-surface-variant pt-1 leading-relaxed">
                    Calculate daily shift hours, automatic unpaid lunch deductions, and 1.5x overtime wages.
                  </p>
                </div>
                <span className="text-body-sm font-body-sm text-primary font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Open Calculator <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </span>
              </Link>

              {/* Tool 8 */}
              <Link
                className="p-space-lg rounded-3xl bg-surface-container-low hover:bg-surface-container hover:shadow-md transition-all flex flex-col justify-between gap-space-sm group border border-outline-variant/20 hover:border-primary/40"
                href="/focus-and-break-timer"
              >
                <div className="flex items-center justify-between">
                  <span className="w-10 h-10 rounded-2xl bg-surface-container-lowest flex items-center justify-center text-secondary shadow-sm">
                    <span className="material-symbols-outlined text-[20px]">hourglass_top</span>
                  </span>
                  <span className="font-data-mono text-[11px] font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded-full border border-secondary/20 uppercase">Productivity</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-headline-md font-bold text-on-surface group-hover:text-primary transition-colors">
                    Focus &amp; Break Timer (Pomodoro)
                  </h3>
                  <p className="text-body-sm font-body-sm text-on-surface-variant pt-1 leading-relaxed">
                    Structure your workday with classic 25/5 Pomodoro intervals and 90-minute ultradian focus sessions.
                  </p>
                </div>
                <span className="text-body-sm font-body-sm text-primary font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Open Calculator <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </span>
              </Link>

              {/* Tool 9 */}
              <Link
                className="p-space-lg rounded-3xl bg-surface-container-low hover:bg-surface-container hover:shadow-md transition-all flex flex-col justify-between gap-space-sm group border border-outline-variant/20 hover:border-primary/40"
                href="/time-date/age-calculator"
              >
                <div className="flex items-center justify-between">
                  <span className="w-10 h-10 rounded-2xl bg-surface-container-lowest flex items-center justify-center text-tertiary shadow-sm">
                    <span className="material-symbols-outlined text-[20px]">cake</span>
                  </span>
                  <span className="font-data-mono text-[11px] font-bold text-tertiary bg-tertiary/10 px-2 py-0.5 rounded-full border border-tertiary/20 uppercase">Age &amp; Milestones</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-headline-md font-bold text-on-surface group-hover:text-primary transition-colors">
                    Exact Age &amp; Milestone Calculator
                  </h3>
                  <p className="text-body-sm font-body-sm text-on-surface-variant pt-1 leading-relaxed">
                    Calculate chronological age in years, months, days, and seconds lived with birthday countdown.
                  </p>
                </div>
                <span className="text-body-sm font-body-sm text-primary font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Open Calculator <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </span>
              </Link>
            </div>

            {/* Organized Category Explorer Banner */}
            <div className="bg-surface-container-low rounded-3xl p-space-lg sm:p-space-xl border border-outline-variant/30 flex flex-col md:flex-row items-center justify-between gap-space-md">
              <div className="flex items-center gap-4">
                <span className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <span className="material-symbols-outlined text-[28px]">calendar_month</span>
                </span>
                <div>
                  <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
                    Complete Date &amp; Time Category Hub
                  </h3>
                  <p className="text-body-sm font-body-sm text-on-surface-variant mt-0.5">
                    Browse all 37 tools categorized by Age, Calendars, Time Arithmetic, Global Zones, Shift Payroll, and Countdowns.
                  </p>
                </div>
              </div>
              <Link
                href="/time-date"
                className="px-space-lg py-3 rounded-2xl bg-primary text-on-primary font-bold text-sm shadow-sm hover:opacity-90 transition-all flex items-center gap-2 shrink-0"
              >
                <span>Explore Full Category Hub</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Section 6: Frequently Asked Questions */}
        <section className="w-full bg-surface-container-low py-space-3xl">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="flex flex-col gap-space-xs pb-space-xl">
              <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-semibold">
                Help &amp; Answers
              </span>
              <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                Quick, friendly answers to common questions about Julian Days, stargazing time, and calendar history.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-md items-start">
              {/* FAQ 1 */}
              <details className="group p-space-md rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all">
                <summary className="flex items-center justify-between font-headline-md text-[17px] font-semibold text-on-surface cursor-pointer list-none select-none">
                  <span>What is a Julian Day?</span>
                  <span className="material-symbols-outlined text-outline group-open:rotate-180 transition-transform">
                    expand_more
                  </span>
                </summary>
                <div className="pt-space-sm text-body-md font-body-md text-on-surface-variant leading-relaxed border-t border-surface-container/50 mt-2">
                  A Julian Day is a simple, continuous count of days that has been ticking steadily forward since January 1, 4713 BCE. Instead of worrying about months of different lengths or leap years, astronomers simply count: day 1, day 2, day 3... up to today&apos;s count in the millions!
                </div>
              </details>

              {/* FAQ 2 */}
              <details className="group p-space-md rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all">
                <summary className="flex items-center justify-between font-headline-md text-[17px] font-semibold text-on-surface cursor-pointer list-none select-none">
                  <span>Why does a Julian Day start at noon instead of midnight?</span>
                  <span className="material-symbols-outlined text-outline group-open:rotate-180 transition-transform">
                    expand_more
                  </span>
                </summary>
                <div className="pt-space-sm text-body-md font-body-md text-on-surface-variant leading-relaxed border-t border-surface-container/50 mt-2">
                  Because astronomers observe the sky at night! If the day changed at midnight, half of their night&apos;s observing session would be on one date, and the second half would be on the next date. Starting the day at 12:00 noon keeps an entire night of skywatching on one single date.
                </div>
              </details>

              {/* FAQ 3 */}
              <details className="group p-space-md rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all">
                <summary className="flex items-center justify-between font-headline-md text-[17px] font-semibold text-on-surface cursor-pointer list-none select-none">
                  <span>What is Modified Julian Date (MJD)?</span>
                  <span className="material-symbols-outlined text-outline group-open:rotate-180 transition-transform">
                    expand_more
                  </span>
                </summary>
                <div className="pt-space-sm text-body-md font-body-md text-on-surface-variant leading-relaxed border-t border-surface-container/50 mt-2">
                  Modified Julian Date (MJD) was created to make Julian numbers shorter and easier to work with. It is calculated by subtracting 2,400,000.5 from the regular Julian Date. This drops the first two numbers and makes the day start at normal midnight (00:00).
                </div>
              </details>

              {/* FAQ 4 */}
              <details className="group p-space-md rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all">
                <summary className="flex items-center justify-between font-headline-md text-[17px] font-semibold text-on-surface cursor-pointer list-none select-none">
                  <span>Is the Julian Day related to Julius Caesar?</span>
                  <span className="material-symbols-outlined text-outline group-open:rotate-180 transition-transform">
                    expand_more
                  </span>
                </summary>
                <div className="pt-space-sm text-body-md font-body-md text-on-surface-variant leading-relaxed border-t border-surface-container/50 mt-2">
                  Not directly! Joseph Justus Scaliger invented Julian Days in 1583. He named the system in honor of his father, Julius Caesar Scaliger. While it uses the 365.25-day year length of the older Julian calendar, it is a day-counting scale, not a monthly calendar.
                </div>
              </details>

              {/* FAQ 5 */}
              <details className="group p-space-md rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all">
                <summary className="flex items-center justify-between font-headline-md text-[17px] font-semibold text-on-surface cursor-pointer list-none select-none">
                  <span>How does Day of the Year (DOY) work?</span>
                  <span className="material-symbols-outlined text-outline group-open:rotate-180 transition-transform">
                    expand_more
                  </span>
                </summary>
                <div className="pt-space-sm text-body-md font-body-md text-on-surface-variant leading-relaxed border-t border-surface-container/50 mt-2">
                  Day of the Year counts the days from 1 to 365 (or 366 in leap years) starting on January 1. For example, February 1 is Day 32. It is often used in schools, weather stations, farming, and space mission logs.
                </div>
              </details>

              {/* FAQ 6 */}
              <details className="group p-space-md rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all">
                <summary className="flex items-center justify-between font-headline-md text-[17px] font-semibold text-on-surface cursor-pointer list-none select-none">
                  <span>Do my dates get sent to an external server?</span>
                  <span className="material-symbols-outlined text-outline group-open:rotate-180 transition-transform">
                    expand_more
                  </span>
                </summary>
                <div className="pt-space-sm text-body-md font-body-md text-on-surface-variant leading-relaxed border-t border-surface-container/50 mt-2">
                  Never. Every single date calculation and time conversion runs 100% locally inside your web browser. No dates, times, or personal data are ever sent over the internet or saved on our servers.
                </div>
              </details>
            </div>
          </div>
        </section>

        {/* Standards Conformance & Institutional Citation Footer Badge */}
        <section className="w-full bg-surface py-space-xl">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="p-space-lg rounded-3xl bg-surface-container flex flex-col md:flex-row items-center justify-between gap-space-md">
              <div className="flex items-center gap-space-md">
                <span className="w-12 h-12 rounded-2xl bg-primary text-on-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[24px]">verified</span>
                </span>
                <div className="flex flex-col">
                  <span className="font-headline-md text-headline-md font-bold text-on-surface">
                    Trusted Scientific Standards
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Accurate astronomical formulas adhering to IAU and NASA timekeeping standards • 100% Private In-Browser Calculations.
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-space-xs text-label-caps font-label-caps text-on-surface-variant">
                <span className="px-3 py-1.5 rounded-xl bg-surface-container-lowest font-medium">SOFA Standards</span>
                <span className="px-3 py-1.5 rounded-xl bg-surface-container-lowest font-medium">100% Free &amp; Open</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
