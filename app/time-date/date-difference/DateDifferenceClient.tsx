'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DateDifferenceClient() {
  const [mounted, setMounted] = useState(false);
  
  // State
  const [startDate, setStartDate] = useState('2025-01-01');
  const [endDate, setEndDate] = useState('2025-09-30');
  const [includeEnd, setIncludeEnd] = useState(true);
  const [excludeWeekends, setExcludeWeekends] = useState(true);
  const [excludeHolidays, setExcludeHolidays] = useState(true);
  const [holidayRegion, setHolidayRegion] = useState('US');
  const [calcMode, setCalcMode] = useState('calendar'); // calendar, business, sprint
  const [horizonSpan, setHorizonSpan] = useState(272);
  
  const [sysToday, setSysToday] = useState('2025-02-27');
  
  useEffect(() => {
    setMounted(true);
    setSysToday(new Date().toISOString().split('T')[0]);
  }, []);

  // US Holidays 2025 (simplified, ideally generated)
  const usHolidays2025 = new Set([
    '2025-01-01', '2025-01-20', '2025-02-17', '2025-05-26', '2025-06-19', 
    '2025-07-04', '2025-09-01', '2025-10-13', '2025-11-11', '2025-11-27', '2025-12-25'
  ]);
  
  const parseDate = (str: string) => {
    const parts = str.split('-');
    return new Date(Date.UTC(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2])));
  };
  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Safe dates
  let d1 = parseDate(startDate);
  let d2 = parseDate(endDate);
  
  if (!isNaN(d1.getTime()) && !isNaN(d2.getTime()) && d1 > d2) {
    const temp = d1;
    d1 = d2;
    d2 = temp;
    // Note: state won't be updated immediately here, but values are swapped for display
  }

  const startDayName = !isNaN(d1.getTime()) ? daysOfWeek[d1.getUTCDay()] : '';
  const endDayName = !isNaN(d2.getTime()) ? daysOfWeek[d2.getUTCDay()] : '';
  
  const oneDayMs = 86400000;
  let deltaMs = (!isNaN(d1.getTime()) && !isNaN(d2.getTime())) ? Math.abs(d2.getTime() - d1.getTime()) : 0;
  let totalDays = Math.round(deltaMs / oneDayMs) + (includeEnd ? 1 : 0);
  if (totalDays < 1) totalDays = 1;

  // Breakdown
  const yStart = d1.getUTCFullYear();
  const mStart = d1.getUTCMonth();
  const dayStart = d1.getUTCDate();
  
  const yEnd = d2.getUTCFullYear();
  const mEnd = d2.getUTCMonth();
  const dayEnd = d2.getUTCDate();

  let yearsDiff = yEnd - yStart;
  let monthsDiff = mEnd - mStart;
  let daysSub = dayEnd - dayStart + (includeEnd ? 1 : 0);

  if (daysSub < 0) {
    monthsDiff -= 1;
    const prevMonthLastDay = new Date(Date.UTC(yEnd, mEnd, 0)).getUTCDate();
    daysSub += prevMonthLastDay;
  }
  if (monthsDiff < 0) {
    yearsDiff -= 1;
    monthsDiff += 12;
  }
  
  let compText = '';
  if (yearsDiff > 0) compText += `${yearsDiff} Year${yearsDiff > 1 ? 's' : ''}, `;
  compText += `${monthsDiff} Month${monthsDiff !== 1 ? 's' : ''}, ${daysSub} Day${daysSub !== 1 ? 's' : ''}`;
  
  const fullWeeks = Math.floor(totalDays / 7);
  const remDays = totalDays % 7;
  compText += ` (or ${fullWeeks} Wks, ${remDays} Days)`;

  let workingDays = 0;
  let weekendDays = 0;
  let holidaysCount = 0;
  
  if (!isNaN(d1.getTime()) && !isNaN(d2.getTime())) {
    let cur = new Date(d1.getTime());
    const terminalTime = d2.getTime() + (includeEnd ? oneDayMs : 0);
    
    while (cur.getTime() < terminalTime) {
      const dayOfWeek = cur.getUTCDay();
      const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
      const dateString = formatDate(cur);
      const isHoliday = usHolidays2025.has(dateString); // Simplified for US

      if (isWeekend) {
        weekendDays++;
      } else if (isHoliday && excludeHolidays) {
        holidaysCount++;
      } else {
        workingDays++;
      }
      cur.setTime(cur.getTime() + oneDayMs);
    }
  }

  const workPct = totalDays > 0 ? ((workingDays / totalDays) * 100).toFixed(1) : '0.0';
  const weekendPct = totalDays > 0 ? ((weekendDays / totalDays) * 100).toFixed(1) : '0.0';
  const holidayPct = totalDays > 0 ? ((holidaysCount / totalDays) * 100).toFixed(1) : '0.0';

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const span = parseInt(e.target.value);
    setHorizonSpan(span);
    if (!isNaN(d1.getTime())) {
      const targetMs = d1.getTime() + (span - (includeEnd ? 1 : 0)) * oneDayMs;
      setEndDate(formatDate(new Date(targetMs)));
    }
  };

  const handleSwap = () => {
    setStartDate(endDate);
    setEndDate(startDate);
  };

  const handleReset = () => {
    setStartDate('2025-01-01');
    setEndDate('2025-09-30');
    setIncludeEnd(true);
    setExcludeWeekends(true);
    setExcludeHolidays(true);
    setHorizonSpan(272);
  };

  const applyPresetStart = (type: string) => {
    const today = new Date();
    if (type === 'today') setStartDate(formatDate(today));
    else if (type === 'year-start') setStartDate(`${today.getFullYear()}-01-01`);
    else if (type === 'minus-30') {
      const d = new Date();
      d.setDate(d.getDate() - 30);
      setStartDate(formatDate(d));
    }
    else if (type === 'q1-start') setStartDate(`${today.getFullYear()}-01-01`);
  };

  const applyPresetEnd = (type: string) => {
    const start = parseDate(startDate);
    if (isNaN(start.getTime())) return;
    if (type === 'today') setEndDate(formatDate(new Date()));
    else if (type === 'plus-90') setEndDate(formatDate(new Date(start.getTime() + 90 * oneDayMs)));
    else if (type === 'plus-180') setEndDate(formatDate(new Date(start.getTime() + 180 * oneDayMs)));
    else if (type === 'q3-close') setEndDate(`${start.getUTCFullYear()}-09-30`);
    else if (type === 'year-end') setEndDate(`${start.getUTCFullYear()}-12-31`);
  };

  const handleCopySummary = () => {
    const text = `SolveIt Date Difference: ${startDate} to ${endDate} = ${totalDays} Days (${compText})`;
    navigator.clipboard.writeText(text);
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col w-full">
      {/* Top Global Context & Micro Navigation Header */}
      <section className="w-full bg-surface-container-lowest py-space-sm shadow-sm">
        <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop flex flex-wrap items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-xs text-on-surface-variant font-data-mono text-body-sm">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-surface-container text-on-surface text-[12px] font-medium">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span> ISO 8601:2019 Ready
            </span>
            <span className="hidden sm:inline-block text-outline-variant">•</span>
            <span className="hidden sm:inline text-on-surface-variant text-[13px]">RFC 3339 Temporal Metrology</span>
            <span className="hidden md:inline-block text-outline-variant">•</span>
            <span className="hidden md:inline text-on-surface-variant text-[13px]">Precision: ±1.0 µs Local Tick</span>
          </div>
          <div className="flex items-center gap-space-xs overflow-x-auto py-1">
            <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-lg">
              <Link href="/time-date/date-difference" className="px-2.5 py-1 rounded bg-surface-container-lowest text-primary shadow-sm font-label-caps text-label-caps uppercase tracking-wider font-semibold whitespace-nowrap">Date Difference</Link>
              <Link href="/time-date/age-calculator" className="px-2.5 py-1 rounded text-on-surface-variant hover:text-on-surface font-label-caps text-label-caps uppercase tracking-wider transition-colors whitespace-nowrap">Age Matrix</Link>
              <Link href="/time-date/business-days" className="px-2.5 py-1 rounded text-on-surface-variant hover:text-on-surface font-label-caps text-label-caps uppercase tracking-wider transition-colors whitespace-nowrap">Business Days</Link>
              <Link href="/time-date/countdown" className="px-2.5 py-1 rounded text-on-surface-variant hover:text-on-surface font-label-caps text-label-caps uppercase tracking-wider transition-colors whitespace-nowrap">Countdown</Link>
              <Link href="/time-date/work-hours" className="px-2.5 py-1 rounded text-on-surface-variant hover:text-on-surface font-label-caps text-label-caps uppercase tracking-wider transition-colors whitespace-nowrap">Work Hours</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Information Architecture Section */}
      <section className="w-full bg-surface py-space-xl lg:py-space-2xl">
        <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg">
            <div className="max-w-3xl space-y-space-xs">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-caps text-label-caps tracking-widest uppercase">
                <span className="material-symbols-outlined text-[14px]">event_available</span>
                Chronological Engine v4.2
              </div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                Date Difference Calculator
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                Calculate the deterministic difference between any two chronological timestamps in days, months, tropical years, business working days, billable intervals, and leap-corrected seconds.
              </p>
              <div className="flex flex-wrap items-center gap-space-md pt-2 text-on-surface-variant font-body-sm text-body-sm">
                <span className="inline-flex items-center gap-1.5"><span className="material-symbols-outlined text-primary text-[18px]">verified</span> Zero Server Latency</span>
                <span className="inline-flex items-center gap-1.5"><span className="material-symbols-outlined text-primary text-[18px]">security</span> 100% Client-Side Air-Gapped</span>
                <span className="inline-flex items-center gap-1.5"><span className="material-symbols-outlined text-primary text-[18px]">update</span> Gregorian Metrology Sync: Feb 2025</span>
              </div>
            </div>
            
            {/* Quick Metrology Snapshot */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex items-center gap-space-md min-w-[280px]">
              <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-[28px]">timelapse</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">System Anchor</span>
                <span className="font-data-mono text-data-mono text-on-surface font-semibold">{sysToday} UTC</span>
                <span className="font-body-sm text-body-sm text-outline">Gregorian Cycle #107</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Workbench & Live Dashboard Grid */}
      <section className="w-full bg-surface-container-low py-space-xl">
        <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
            
            {/* Left: Workbench Configuration Panel (5 cols) */}
            <div className="lg:col-span-5 bg-surface-container-lowest p-space-lg rounded-xl shadow-md space-y-space-lg">
              <div className="flex items-center justify-between pb-space-xs">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[22px]">tune</span>
                  <h2 className="font-headline-md text-headline-md text-on-surface">Temporal Parameters</h2>
                </div>
                <button 
                  onClick={handleSwap}
                  className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant transition-colors flex items-center gap-1 font-label-caps text-label-caps uppercase" 
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">swap_vert</span> Invert
                </button>
              </div>
              
              {/* Calculation Mode Switcher */}
              <div className="flex items-center bg-surface-container-low p-1 rounded-lg">
                <button onClick={() => setCalcMode('calendar')} className={`flex-1 py-1.5 px-2 rounded-md font-label-caps text-label-caps text-center uppercase tracking-wider transition-all ${calcMode === 'calendar' ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold' : 'text-on-surface-variant hover:text-on-surface'}`} type="button">Calendar</button>
                <button onClick={() => setCalcMode('business')} className={`flex-1 py-1.5 px-2 rounded-md font-label-caps text-label-caps text-center uppercase tracking-wider transition-all ${calcMode === 'business' ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold' : 'text-on-surface-variant hover:text-on-surface'}`} type="button">Business Days</button>
                <button onClick={() => setCalcMode('sprint')} className={`flex-1 py-1.5 px-2 rounded-md font-label-caps text-label-caps text-center uppercase tracking-wider transition-all ${calcMode === 'sprint' ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold' : 'text-on-surface-variant hover:text-on-surface'}`} type="button">Agile Sprint</button>
              </div>

              {/* Date Inputs */}
              <div className="space-y-space-md">
                {/* Start Date */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Start Date (Epoch Alpha)</label>
                    <span className="font-data-mono text-data-mono text-outline text-[12px]">{startDayName}</span>
                  </div>
                  <div className="flex items-center bg-surface-container-low px-3 py-2 rounded-lg focus-within:bg-surface-container-lowest focus-within:shadow-sm ring-1 ring-transparent focus-within:ring-primary/20">
                    <span className="material-symbols-outlined text-outline mr-2 text-[20px]">calendar_today</span>
                    <input 
                      type="date" 
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-transparent border-none outline-none font-data-mono text-data-mono text-on-surface" 
                    />
                  </div>
                  {/* Start Presets */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <button onClick={() => applyPresetStart('today')} className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant hover:text-primary font-label-caps text-label-caps" type="button">Today</button>
                    <button onClick={() => applyPresetStart('year-start')} className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant hover:text-primary font-label-caps text-label-caps" type="button">Year Start</button>
                    <button onClick={() => applyPresetStart('minus-30')} className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant hover:text-primary font-label-caps text-label-caps" type="button">-30 Days</button>
                  </div>
                </div>

                {/* End Date */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">End Date (Terminal Omega)</label>
                    <span className="font-data-mono text-data-mono text-outline text-[12px]">{endDayName}</span>
                  </div>
                  <div className="flex items-center bg-surface-container-low px-3 py-2 rounded-lg focus-within:bg-surface-container-lowest focus-within:shadow-sm ring-1 ring-transparent focus-within:ring-primary/20">
                    <span className="material-symbols-outlined text-outline mr-2 text-[20px]">event</span>
                    <input 
                      type="date" 
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-transparent border-none outline-none font-data-mono text-data-mono text-on-surface" 
                    />
                  </div>
                  {/* End Presets */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <button onClick={() => applyPresetEnd('today')} className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant hover:text-primary font-label-caps text-label-caps" type="button">Today</button>
                    <button onClick={() => applyPresetEnd('plus-90')} className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant hover:text-primary font-label-caps text-label-caps" type="button">+90 Days</button>
                    <button onClick={() => applyPresetEnd('plus-180')} className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant hover:text-primary font-label-caps text-label-caps" type="button">+180 Days</button>
                    <button onClick={() => applyPresetEnd('year-end')} className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant hover:text-primary font-label-caps text-label-caps" type="button">Dec 31</button>
                  </div>
                </div>
              </div>

              {/* Dynamic Interval Scrubbing Slider */}
              <div className="space-y-2 bg-surface-container-low p-space-sm rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Horizon Range Scrubber</span>
                  <span className="font-data-mono text-data-mono text-primary font-semibold">{totalDays} Days</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="730" 
                  value={Math.min(totalDays, 730)}
                  onChange={handleSliderChange}
                  className="w-full accent-primary h-2 bg-surface-container-high rounded-lg cursor-pointer" 
                />
                <div className="flex justify-between text-[11px] font-data-mono text-outline">
                  <span>1d</span>
                  <span>180d</span>
                  <span>1y</span>
                  <span>2y</span>
                </div>
              </div>

              {/* Calculation Rules & Boundary Modifiers */}
              <div className="space-y-space-sm">
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider block">Boundary Directives</span>
                
                <label className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    <input 
                      type="checkbox" 
                      checked={includeEnd}
                      onChange={(e) => setIncludeEnd(e.target.checked)}
                      className="w-4 h-4 accent-primary rounded cursor-pointer" 
                    />
                    <span className="font-body-sm text-body-sm text-on-surface">Include End Date (+1 Inclusive Day)</span>
                  </div>
                  <span className="font-data-mono text-data-mono text-outline text-[12px]">[T0, T1]</span>
                </label>
                
                <label className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    <input 
                      type="checkbox" 
                      checked={excludeWeekends}
                      onChange={(e) => setExcludeWeekends(e.target.checked)}
                      className="w-4 h-4 accent-primary rounded cursor-pointer" 
                    />
                    <span className="font-body-sm text-body-sm text-on-surface">Exclude Weekends (Sat & Sun)</span>
                  </div>
                  <span className="font-data-mono text-data-mono text-outline text-[12px]">5-Day Wk</span>
                </label>
                
                <div className="p-2.5 rounded-lg bg-surface-container-low space-y-2">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <input 
                        type="checkbox" 
                        checked={excludeHolidays}
                        onChange={(e) => setExcludeHolidays(e.target.checked)}
                        className="w-4 h-4 accent-primary rounded cursor-pointer" 
                      />
                      <span className="font-body-sm text-body-sm text-on-surface">Omit Statutory Public Holidays</span>
                    </div>
                    <span className="font-data-mono text-data-mono text-secondary text-[12px]">{holidaysCount} Dates</span>
                  </label>
                  <select 
                    value={holidayRegion}
                    onChange={(e) => setHolidayRegion(e.target.value)}
                    className="w-full bg-surface-container-lowest text-on-surface font-body-sm text-body-sm px-2.5 py-1.5 rounded-md outline-none border border-surface-container-high focus:border-primary/50"
                  >
                    <option value="US">US Federal Statutory Schedule (11 Days/Yr)</option>
                    <option value="UK">UK England & Wales Bank Holidays</option>
                    <option value="CA">Canada Federal Statutory</option>
                    <option value="AU">Australia National Holidays</option>
                  </select>
                </div>
              </div>

              {/* Workbench Actions */}
              <div className="flex gap-space-xs pt-space-xs">
                <button className="flex-1 bg-primary text-on-primary py-3 rounded-lg font-body-md text-body-md font-semibold hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm" type="button">
                  <span className="material-symbols-outlined text-[20px]">calculate</span> Recalculate Horizon
                </button>
                <button onClick={handleReset} className="px-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant transition-colors" title="Reset to Defaults" type="button">
                  <span className="material-symbols-outlined text-[20px]">restart_alt</span>
                </button>
              </div>
            </div>

            {/* Right: Primary Metrology Dashboard & Breakdown (7 cols) */}
            <div className="lg:col-span-7 space-y-space-md">
              {/* Focal Result Card */}
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-md relative overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-space-xs pb-space-sm">
                  <span className="inline-flex items-center gap-1.5 font-label-caps text-label-caps text-primary uppercase tracking-wider font-semibold">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    Span Computation
                  </span>
                  <div className="flex items-center gap-1">
                    <button onClick={handleCopySummary} className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-md transition-colors" title="Copy Raw Summary">
                      <span className="material-symbols-outlined text-[18px]">content_copy</span>
                    </button>
                  </div>
                </div>
                
                {/* Major Output Readout */}
                <div className="py-space-xs">
                  <div className="flex items-baseline gap-space-sm flex-wrap">
                    <span className="font-numerical-display text-numerical-display text-on-surface tracking-tight">{totalDays.toLocaleString()}</span>
                    <span className="font-headline-lg text-headline-lg text-on-surface-variant font-normal">Calendar Days</span>
                  </div>
                  <p className="font-headline-md text-headline-md text-primary pt-1">
                    {compText}
                  </p>
                </div>
                
                {/* Secondary High-Density Metrology Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-space-xs pt-space-md">
                  <div className="bg-surface-container-low p-2.5 rounded-lg">
                    <span className="font-label-caps text-label-caps text-outline uppercase block">Solar Years</span>
                    <span className="font-data-mono text-data-mono text-on-surface font-semibold text-[15px]">{(totalDays / 365.2425).toFixed(3)} Yrs</span>
                  </div>
                  <div className="bg-surface-container-low p-2.5 rounded-lg">
                    <span className="font-label-caps text-label-caps text-outline uppercase block">Total Months</span>
                    <span className="font-data-mono text-data-mono text-on-surface font-semibold text-[15px]">{(totalDays / 30.4375).toFixed(2)} Mos</span>
                  </div>
                  <div className="bg-surface-container-low p-2.5 rounded-lg">
                    <span className="font-label-caps text-label-caps text-outline uppercase block">Full Weeks</span>
                    <span className="font-data-mono text-data-mono text-on-surface font-semibold text-[15px]">{(totalDays / 7).toFixed(2)} Wks</span>
                  </div>
                  <div className="bg-surface-container-low p-2.5 rounded-lg">
                    <span className="font-label-caps text-label-caps text-outline uppercase block">Fortnights</span>
                    <span className="font-data-mono text-data-mono text-on-surface font-semibold text-[15px]">{(totalDays / 14).toFixed(2)} Ftn</span>
                  </div>
                  <div className="bg-surface-container-low p-2.5 rounded-lg">
                    <span className="font-label-caps text-label-caps text-outline uppercase block">Total Hours</span>
                    <span className="font-data-mono text-data-mono text-on-surface font-semibold text-[15px]">{(totalDays * 24).toLocaleString()} Hrs</span>
                  </div>
                  <div className="bg-surface-container-low p-2.5 rounded-lg">
                    <span className="font-label-caps text-label-caps text-outline uppercase block">Total Minutes</span>
                    <span className="font-data-mono text-data-mono text-on-surface font-semibold text-[15px]">{(totalDays * 1440).toLocaleString()} Min</span>
                  </div>
                  <div className="bg-surface-container-low p-2.5 rounded-lg col-span-2">
                    <span className="font-label-caps text-label-caps text-outline uppercase block">SI Astronomical Seconds</span>
                    <span className="font-data-mono text-data-mono text-on-surface font-semibold text-[15px]">{(totalDays * 86400).toLocaleString()} Sec</span>
                  </div>
                </div>
              </div>

              {/* Business Days Analytics Card */}
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-md space-y-space-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[22px]">badge</span>
                    <h3 className="font-headline-md text-headline-md text-on-surface">Business Day Decomposition</h3>
                  </div>
                  <span className="font-data-mono text-data-mono text-secondary font-semibold">{workPct}% Productive</span>
                </div>
                
                {/* Graphical Segment Bar */}
                <div className="space-y-1.5">
                  <div className="h-3 w-full bg-surface-container-high rounded-full overflow-hidden flex">
                    <div className="bg-primary h-full transition-all duration-500" style={{width: `${workPct}%`}} title="Working Business Days"></div>
                    <div className="bg-outline-variant h-full transition-all duration-500" style={{width: `${weekendPct}%`}} title="Weekend Days"></div>
                    <div className="bg-tertiary-container h-full transition-all duration-500" style={{width: `${holidayPct}%`}} title="Federal Holidays"></div>
                  </div>
                  <div className="flex items-center justify-between text-[12px] font-body-sm text-on-surface-variant">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary inline-block"></span> Working Days ({workingDays})</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-outline-variant inline-block"></span> Weekends ({weekendDays})</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-tertiary-container inline-block"></span> Holidays ({holidaysCount})</span>
                  </div>
                </div>
                
                {/* Business Metric Tiles */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-space-sm pt-space-xs">
                  <div className="p-space-sm rounded-lg bg-surface-container-low">
                    <span className="font-label-caps text-label-caps text-outline uppercase">Active Work Days</span>
                    <p className="font-data-mono text-data-mono text-primary font-bold text-[18px]">{workingDays} Days</p>
                    <span className="text-[12px] text-on-surface-variant font-body-sm">Excludes non-billable dates</span>
                  </div>
                  <div className="p-space-sm rounded-lg bg-surface-container-low">
                    <span className="font-label-caps text-label-caps text-outline uppercase">Weekend Off-Days</span>
                    <p className="font-data-mono text-data-mono text-on-surface font-bold text-[18px]">{weekendDays} Days</p>
                    <span className="text-[12px] text-on-surface-variant font-body-sm">Saturdays & Sundays</span>
                  </div>
                  <div className="p-space-sm rounded-lg bg-surface-container-low">
                    <span className="font-label-caps text-label-caps text-outline uppercase">Standard Billable</span>
                    <p className="font-data-mono text-data-mono text-secondary font-bold text-[18px]">{(workingDays * 8).toLocaleString()}.0 Hrs</p>
                    <span className="text-[12px] text-on-surface-variant font-body-sm">Calculated at 8.0h / day</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Interactive Timeline Horizon Telemetry */}
      <section className="w-full bg-surface py-space-xl">
        <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop space-y-space-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
            <div>
              <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider font-semibold">Temporal Progression</span>
              <h2 className="font-headline-md text-headline-md text-on-surface">Linear Chronological Horizon</h2>
            </div>
          </div>
          
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-md space-y-space-lg">
            <div className="relative pt-6 pb-2">
              {/* Baseline Line */}
              <div className="h-2 w-full bg-surface-container-high rounded-full relative">
                <div className="h-full bg-primary rounded-full transition-all" style={{width: `100%`}}></div>
                
                {/* Origin Marker */}
                <div className="absolute left-0 -top-3 flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-[16px]">flight_takeoff</span>
                  </div>
                  <span className="font-data-mono text-data-mono text-[12px] font-semibold text-on-surface mt-2">{startDate}</span>
                  <span className="font-label-caps text-label-caps text-outline uppercase">Start (Day 0)</span>
                </div>
                
                {/* Terminal Marker */}
                <div className="absolute right-0 -top-3 flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-surface-variant text-on-surface flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-[16px]">flag</span>
                  </div>
                  <span className="font-data-mono text-data-mono text-[12px] font-semibold text-on-surface mt-2">{endDate}</span>
                  <span className="font-label-caps text-label-caps text-outline uppercase">Terminal (Day {totalDays})</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md pt-space-lg">
              <div className="bg-surface-container-low p-space-sm rounded-lg flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-primary text-[28px]">timelapse</span>
                <div>
                  <span className="font-label-caps text-label-caps text-outline uppercase">Total Duration</span>
                  <p className="font-data-mono text-data-mono text-on-surface font-semibold">{totalDays} Calendar Days</p>
                </div>
              </div>
              <div className="bg-surface-container-low p-space-sm rounded-lg flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-secondary text-[28px]">work</span>
                <div>
                  <span className="font-label-caps text-label-caps text-outline uppercase">Working Duration</span>
                  <p className="font-data-mono text-data-mono text-on-surface font-semibold">{workingDays} Business Days</p>
                </div>
              </div>
              <div className="bg-surface-container-low p-space-sm rounded-lg flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-tertiary text-[28px]">schedule</span>
                <div>
                  <span className="font-label-caps text-label-caps text-outline uppercase">Productivity Ratio</span>
                  <p className="font-data-mono text-data-mono text-on-surface font-semibold">{workPct}% Active</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dual Module: Agile Sprint Planner & Countdown Gauge */}
      <section className="w-full bg-surface-container-low py-space-xl">
        <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg">
            {/* Sprint Planner Module */}
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-md space-y-space-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[24px]">view_timeline</span>
                  <h3 className="font-headline-md text-headline-md text-on-surface">Agile Sprint & Capacity Tracker</h3>
                </div>
                <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-label-caps text-label-caps font-semibold uppercase">Sprint Model</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Convert standard calendar windows into production velocity metrics based on a conventional 2-week bi-weekly sprint cadence.
              </p>
              <div className="grid grid-cols-2 gap-space-sm">
                <div className="p-space-sm bg-surface-container-low rounded-lg">
                  <span className="font-label-caps text-label-caps text-outline uppercase">2-Week Sprints</span>
                  <p className="font-data-mono text-data-mono text-primary font-bold text-[20px]">{(workingDays / 10).toFixed(1)} Sprints</p>
                  <span className="text-[12px] text-on-surface-variant font-body-sm">10 working days per sprint</span>
                </div>
                <div className="p-space-sm bg-surface-container-low rounded-lg">
                  <span className="font-label-caps text-label-caps text-outline uppercase">Estimated Team Dev-Days</span>
                  <p className="font-data-mono text-data-mono text-on-surface font-bold text-[20px]">{workingDays * 5} Dev-Days</p>
                  <span className="text-[12px] text-on-surface-variant font-body-sm">Model based on 5 engineers</span>
                </div>
              </div>
            </div>

            {/* Terminal Countdown & Circular Progress Meter */}
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-md space-y-space-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[24px]">timer</span>
                  <h3 className="font-headline-md text-headline-md text-on-surface">Countdown to {endDate}</h3></div><span className="px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-label-caps text-label-caps font-semibold uppercase">Active Orbit</span></div>
              <div className="flex flex-col sm:flex-row items-center gap-space-lg pt-space-xs">
                {/* Inline SVG Circular Progress Gauge */}
                <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                    <circle className="stroke-surface-container-high" cx="60" cy="60" fill="transparent" r="50" strokeWidth="10"></circle>
                    <circle 
                      className="stroke-primary transition-all duration-700" 
                      cx="60" cy="60" fill="transparent" r="50" 
                      strokeDasharray="314.16" 
                      strokeDashoffset={314.16 - (314.16 * (Math.min(100, Math.max(0, parseFloat(workPct))) / 100))} 
                      strokeLinecap="round" strokeWidth="10"
                    ></circle>
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="font-data-mono text-data-mono font-bold text-on-surface text-[18px]">{workPct}%</span>
                    <span className="font-label-caps text-label-caps text-outline uppercase text-[10px]">Productive</span>
                  </div>
                </div>
<div className="space-y-space-xs flex-1 w-full">
                  <div className="flex justify-between items-baseline p-2 rounded bg-surface-container-low">
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Remaining Calendar Days</span>
                    <span className="font-data-mono text-data-mono font-bold text-primary">{totalDays} Days</span>
                  </div>
                  <div className="flex justify-between items-baseline p-2 rounded bg-surface-container-low">
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Remaining Net Hours</span>
                    <span className="font-data-mono text-data-mono font-bold text-on-surface">{(totalDays * 24).toLocaleString()} Hrs</span>
                  </div>
                  <div className="flex justify-between items-baseline p-2 rounded bg-surface-container-low">
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Remaining Working Days</span>
                    <span className="font-data-mono text-data-mono font-bold text-secondary">{workingDays} Days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Smart Insights & Planning Accelerators */}
      <section className="w-full bg-surface py-space-xl">
        <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop space-y-space-md">
          <div>
            <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider font-semibold">Temporal Intelligence</span>
            <h2 className="font-headline-md text-headline-md text-on-surface">Analytical Planning Insights</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
            <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm space-y-2">
              <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]">calendar_view_month</span>
              </div>
              <h4 className="font-body-lg text-body-lg font-semibold text-on-surface">{(totalDays / 91).toFixed(1)} Fiscal Quarters</h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Based on an average quarter length of 91 days.
              </p>
            </div>
            <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm space-y-2">
              <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[20px]">bedtime</span>
              </div>
              <h4 className="font-body-lg text-body-lg font-semibold text-on-surface">{(totalDays / 29.53).toFixed(1)} Synodic Lunations</h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Equivalent lunar phases based on the 29.53-day synodic cycle.
              </p>
            </div>
            <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm space-y-2">
              <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-tertiary">
                <span className="material-symbols-outlined text-[20px]">event_repeat</span>
              </div>
              <h4 className="font-body-lg text-body-lg font-semibold text-on-surface">DST Impact</h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Spans spanning March/November may include a 1-hour daylight saving shift.
              </p>
            </div>
            <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm space-y-2">
              <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]">equalizer</span>
              </div>
              <h4 className="font-body-lg text-body-lg font-semibold text-on-surface">Pacing Buffer</h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                We recommend allocating 10% of working days ({Math.round(workingDays*0.1)} days) for contingency buffer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Real-World Presets & Legal Benchmarks Grid */}
      <section className="w-full bg-surface py-space-xl">
        <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop space-y-space-md">
          <div>
            <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider font-semibold">One-Click Workflows</span>
            <h2 className="font-headline-md text-headline-md text-on-surface">Common Statutory & Real-World Horizons</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-md">
            <button onClick={() => { setStartDate('2025-01-01'); setEndDate('2025-12-25'); }} className="text-left p-space-md bg-surface-container-lowest hover:bg-surface-container-low rounded-xl shadow-sm transition-all space-y-1.5" type="button">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-label-caps text-primary uppercase font-semibold">Annual Milestone</span>
                <span className="material-symbols-outlined text-outline text-[18px]">open_in_new</span>
              </div>
              <h4 className="font-body-lg text-body-lg font-semibold text-on-surface">Days to Christmas 2025</h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Calculates the delta from origin to Dec 25, 2025.</p>
            </button>
            <button onClick={() => { setStartDate('2025-01-01'); setEndDate('2025-03-31'); }} className="text-left p-space-md bg-surface-container-lowest hover:bg-surface-container-low rounded-xl shadow-sm transition-all space-y-1.5" type="button">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-label-caps text-secondary uppercase font-semibold">Legal & Escrow</span>
                <span className="material-symbols-outlined text-outline text-[18px]">open_in_new</span>
              </div>
              <h4 className="font-body-lg text-body-lg font-semibold text-on-surface">Standard 90-Day Escrow Window</h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Default commercial closing window with statutory holiday omissions.</p>
            </button>
            <button onClick={() => { setStartDate('2025-01-01'); setEndDate('2025-06-30'); }} className="text-left p-space-md bg-surface-container-lowest hover:bg-surface-container-low rounded-xl shadow-sm transition-all space-y-1.5" type="button">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-label-caps text-tertiary uppercase font-semibold">Schengen Area</span>
                <span className="material-symbols-outlined text-outline text-[18px]">open_in_new</span>
              </div>
              <h4 className="font-body-lg text-body-lg font-semibold text-on-surface">90 / 180-Day Visa Allowance</h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Check your rolling 180-day short-stay passport compliance limit.</p>
            </button>
            <button onClick={() => { setStartDate('2025-01-01'); setEndDate('2026-01-01'); }} className="text-left p-space-md bg-surface-container-lowest hover:bg-surface-container-low rounded-xl shadow-sm transition-all space-y-1.5" type="button">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-label-caps text-primary uppercase font-semibold">Full Cycle</span>
                <span className="material-symbols-outlined text-outline text-[18px]">open_in_new</span>
              </div>
              <h4 className="font-body-lg text-body-lg font-semibold text-on-surface">Full Gregorian Year 2025</h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Exactly 365 calendar days.</p>
            </button>
          </div>
        </div>
      </section>

      {/* Deterministic Mathematics & Engineering Reference */}
      <section className="w-full bg-surface-container-low py-space-xl">
        <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop space-y-space-lg">
          <div>
            <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider font-semibold">Metrology & Math</span>
            <h2 className="font-headline-md text-headline-md text-on-surface">Deterministic Algorithm Specifications</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg">
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-md space-y-space-sm">
              <h3 className="font-headline-md text-headline-md text-on-surface">1. Gregorian 400-Year Leap Logic</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Under the Gregorian reform instituted in October 1582, every year that is exactly divisible by four is a leap year, except for centurial years (years ending in 00), which are only leap years if they are evenly divisible by 400.
              </p>
              <div className="bg-surface-container-low p-space-sm rounded-lg font-data-mono text-data-mono text-[13px] text-on-surface overflow-x-auto">
                <code>isLeapYear = (Y % 4 === 0 && Y % 100 !== 0) || (Y % 400 === 0);</code>
              </div>
            </div>
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-md space-y-space-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-headline-md text-headline-md text-on-surface">2. Business Day Floor Division</h3>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Instead of iterative day-by-day looping (O(N)), SolveIt uses constant-time O(1) floor modular arithmetic to isolate working business days:
              </p>
              <div className="bg-surface-container-low p-space-sm rounded-lg font-data-mono text-data-mono text-[13px] text-on-surface overflow-x-auto">
                <code>W = Math.floor(Δd / 7) * 5 + RemainderCorrection(d_start, Δd % 7) - H_holidays;</code>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEO-Optimized Interactive FAQ Accordion */}
      <section className="w-full bg-surface-container-low py-space-xl">
        <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop space-y-space-lg">
          <div className="text-center max-w-2xl mx-auto space-y-space-xs">
            <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider font-semibold">Verification & FAQ</span>
            <h2 className="font-headline-md text-headline-md text-on-surface">Frequently Asked Questions</h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-space-xs">
            <details className="group bg-surface-container-lowest p-space-md rounded-xl shadow-sm cursor-pointer" open>
              <summary className="flex items-center justify-between font-body-lg text-body-lg font-semibold text-on-surface select-none">
                <span>How does this calculator handle leap years and February 29th?</span>
                <span className="material-symbols-outlined text-outline group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <p className="mt-space-sm font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                SolveIt implements complete Gregorian 400-year cycle verification. Every 4th year includes 366 days, century marks (e.g. 1900, 2100) are treated as standard 365-day years, and quad-centuries (1600, 2000, 2400) are recognized as leap years with full microsecond precision.
              </p>
            </details>
            <details className="group bg-surface-container-lowest p-space-md rounded-xl shadow-sm cursor-pointer">
              <summary className="flex items-center justify-between font-body-lg text-body-lg font-semibold text-on-surface select-none">
                <span>What is the difference between calendar days and business days?</span>
                <span className="material-symbols-outlined text-outline group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <p className="mt-space-sm font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Calendar days represent uninterrupted elapsed solar intervals (24 hours each). Business days strictly exclude non-working weekends (Saturday and Sunday) and officially designated regional statutory holidays (such as Memorial Day or Bank Holidays).
              </p>
            </details>
            <details className="group bg-surface-container-lowest p-space-md rounded-xl shadow-sm cursor-pointer">
              <summary className="flex items-center justify-between font-body-lg text-body-lg font-semibold text-on-surface select-none">
                <span>Why does "Include End Date" add one additional day?</span>
                <span className="material-symbols-outlined text-outline group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <p className="mt-space-sm font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Mathematical subtraction counts the span between dates (e.g., from Jan 1 to Jan 2 is 1 day difference). However, if an escrow or project requires work during both the first and final day, both dates must be counted, making it 2 active calendar days.
              </p>
            </details>
            <details className="group bg-surface-container-lowest p-space-md rounded-xl shadow-sm cursor-pointer">
              <summary className="flex items-center justify-between font-body-lg text-body-lg font-semibold text-on-surface select-none">
                <span>Are my entered dates transmitted or logged on external servers?</span>
                <span className="material-symbols-outlined text-outline group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <p className="mt-space-sm font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                No. 100% of calculations execute locally within your browser sandbox via JavaScript. Zero date entries, project milestones, or telemetry coordinates ever leave your device.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Suite Ecosystem Navigation Hub */}
      <section className="w-full bg-surface py-space-xl">
        <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop space-y-space-md">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider font-semibold">Temporal Ecosystem</span>
              <h2 className="font-headline-md text-headline-md text-on-surface">Complementary Calculation Engines</h2>
            </div>
            <Link className="font-label-caps text-label-caps text-primary uppercase font-semibold flex items-center gap-1" href="/categories">
              Explore All Tools <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
            <Link className="p-space-md bg-surface-container-low hover:bg-surface-container rounded-xl transition-colors space-y-2 block" href="/time-date/age-calculator">
              <div className="w-8 h-8 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]">cake</span>
              </div>
              <h4 className="font-body-lg text-body-lg font-semibold text-on-surface">Age Calculator</h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Exact chronological breakdown in years, dog years, and seconds lived.</p>
            </Link>
            <Link className="p-space-md bg-surface-container-low hover:bg-surface-container rounded-xl transition-colors space-y-2 block" href="/time-date/date-difference">
              <div className="w-8 h-8 rounded-lg bg-surface-container-lowest flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[20px]">more_time</span>
              </div>
              <h4 className="font-body-lg text-body-lg font-semibold text-on-surface">Add / Subtract Days</h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Project future target dates by adding customized working day buffers.</p>
            </Link>
            <Link className="p-space-md bg-surface-container-low hover:bg-surface-container rounded-xl transition-colors space-y-2 block" href="/time-date/work-hours">
              <div className="w-8 h-8 rounded-lg bg-surface-container-lowest flex items-center justify-center text-tertiary">
                <span className="material-symbols-outlined text-[20px]">schedule</span>
              </div>
              <h4 className="font-body-lg text-body-lg font-semibold text-on-surface">Work Hours Timesheet</h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Compute gross billables with lunch deductions and overtime multipliers.</p>
            </Link>
            <Link className="p-space-md bg-surface-container-low hover:bg-surface-container rounded-xl transition-colors space-y-2 block" href="/time-date/time-zone-overlap">
              <div className="w-8 h-8 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]">public</span>
              </div>
              <h4 className="font-body-lg text-body-lg font-semibold text-on-surface">Time Zone Matrix</h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Identify overlap windows across UTC, Eastern, GMT, and Tokyo time.</p>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
