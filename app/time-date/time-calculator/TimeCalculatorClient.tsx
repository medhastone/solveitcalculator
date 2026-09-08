'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import Link from 'next/link';

interface TimeEntry {
  id: string;
  hours: number;
  minutes: number;
  seconds: number;
  operation: 'add' | 'subtract';
}

export default function TimeCalculatorClient() {
  const [mounted, setMounted] = useState(false);
  const [utcTime, setUtcTime] = useState<Date | null>(null);

  const formatUtcTime = (date: Date) => {
    const h = String(date.getUTCHours()).padStart(2, '0');
    const m = String(date.getUTCMinutes()).padStart(2, '0');
    const s = String(date.getUTCSeconds()).padStart(2, '0');
    return `${h}:${m}:${s}Z`;
  };

  const [activeTab, setActiveTab] = useState<'arithmetic' | 'duration' | 'decimal'>('arithmetic');

  // Arithmetic State
  const [entries, setEntries] = useState<TimeEntry[]>([
    { id: '1', hours: 3, minutes: 45, seconds: 0, operation: 'add' },
    { id: '2', hours: 1, minutes: 30, seconds: 0, operation: 'add' },
    { id: '3', hours: 0, minutes: 15, seconds: 0, operation: 'subtract' },
  ]);

  // Duration State
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('17:30');
  const [breakMinutes, setBreakMinutes] = useState(45);

  // Decimal State
  const [decimalInput, setDecimalInput] = useState<string>('7.75');
  const [hourlyRate, setHourlyRate] = useState<string>('25.50');

  useEffect(() => {
    setMounted(true);
    setUtcTime(new Date());
    const timer = setInterval(() => {
      setUtcTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const addEntry = useCallback(() => {
    setEntries(prev => [
      ...prev,
      { id: Date.now().toString(), hours: 0, minutes: 0, seconds: 0, operation: 'add' }
    ]);
  }, []);

  const removeEntry = useCallback((id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  }, []);

  const updateEntry = useCallback((id: string, field: keyof TimeEntry, value: string | number) => {
    setEntries(prev => prev.map(e => {
      if (e.id === id) {
        let parsed = value;
        if (typeof value === 'string' && field !== 'operation') {
          parsed = parseInt(value, 10) || 0;
          if (field === 'minutes' || field === 'seconds') {
            parsed = Math.min(59, Math.max(0, parsed as number));
          } else {
            parsed = Math.max(0, parsed as number);
          }
        }
        return { ...e, [field]: parsed };
      }
      return e;
    }));
  }, []);

  const arithmeticResult = useMemo(() => {
    let totalSeconds = 0;
    entries.forEach(e => {
      const sec = (e.hours * 3600) + (e.minutes * 60) + e.seconds;
      if (e.operation === 'add') totalSeconds += sec;
      else totalSeconds -= sec;
    });
    
    const isNegative = totalSeconds < 0;
    let absSec = Math.abs(totalSeconds);
    
    const hrs = Math.floor(absSec / 3600);
    absSec %= 3600;
    const mins = Math.floor(absSec / 60);
    const secs = absSec % 60;
    
    const decimal = ((isNegative ? -1 : 1) * (hrs + (mins / 60) + (secs / 3600))).toFixed(4);

    return { isNegative, hrs, mins, secs, totalSeconds, decimal };
  }, [entries]);

  const durationResult = useMemo(() => {
    if (!startTime || !endTime) return null;
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    
    let startMins = startH * 60 + startM;
    let endMins = endH * 60 + endM;
    
    if (endMins < startMins) {
      endMins += 24 * 60; // assume crossing midnight
    }
    
    let totalMins = endMins - startMins - (breakMinutes || 0);
    const isNegative = totalMins < 0;
    const absMins = Math.abs(totalMins);
    
    const hrs = Math.floor(absMins / 60);
    const mins = absMins % 60;
    const decimal = (hrs + (mins / 60)).toFixed(3);
    const rate = parseFloat(hourlyRate) || 0;
    const grossPay = ((hrs + (mins / 60)) * rate).toFixed(2);

    return { isNegative, hrs, mins, totalMins, decimal, grossPay };
  }, [startTime, endTime, breakMinutes, hourlyRate]);

  const decimalConversion = useMemo(() => {
    const val = parseFloat(decimalInput) || 0;
    const hrs = Math.floor(val);
    const remainder = val - hrs;
    const mins = Math.floor(remainder * 60);
    const secs = Math.round((remainder * 60 - mins) * 60);
    
    const totalSec = hrs * 3600 + mins * 60 + secs;
    const frames24 = Math.round(totalSec * 24);
    const frames30 = Math.round(totalSec * 30);
    const rate = parseFloat(hourlyRate) || 0;
    const pay = (val * rate).toFixed(2);

    return { hrs, mins, secs, totalSec, frames24, frames30, pay };
  }, [decimalInput, hourlyRate]);

  if (!mounted) return <div className="min-h-screen bg-surface"></div>;

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface">
      <Header />
      <main className="w-full pt-16 bg-surface min-h-[calc(100vh-64px)]">
        
        {/* HERO SECTION */}
        <section className="w-full bg-surface-container-low/40 pb-space-2xl pt-space-lg border-b border-surface-container">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="flex flex-wrap items-center justify-between gap-space-sm mb-space-md">
              <nav aria-label="Breadcrumb" className="flex items-center gap-space-2xs font-body-sm text-body-sm text-on-surface-variant">
                <Link className="hover:text-primary transition-colors" href="/">Home</Link>
                <span className="text-outline-variant">/</span>
                <Link className="hover:text-primary transition-colors" href="/time-date">Time &amp; Date</Link>
                <span className="text-outline-variant">/</span>
                <span className="text-on-surface font-medium">Time Calculator</span>
              </nav>
              <div className="flex items-center gap-space-xs font-data-mono text-[11px] text-on-surface-variant bg-surface-container px-3 py-1 rounded-full shadow-sm">
                <span className="inline-block w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
                <span>SUB-SECOND PRECISION</span>
                <span className="text-outline-variant">|</span>
                <span>PAYROLL OPTIMIZED</span>
              </div>
            </div>
            <div className="max-w-4xl mb-space-lg">
              <div className="inline-flex items-center gap-space-xs bg-primary-fixed text-on-primary-fixed font-label-caps text-label-caps px-2.5 py-1 rounded-full uppercase tracking-wider mb-space-sm">
                <span className="material-symbols-outlined text-[14px]">more_time</span>
                Chronological Arithmetic Engine
              </div>
              <h1 className="font-headline-lg text-headline-lg md:text-[44px] md:leading-[52px] text-on-surface tracking-tight font-bold mb-space-sm">
                Time Math &amp; Timesheet Calculator
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl">
                Execute complex sexagesimal math (Base-60). Add or subtract time durations, compute payroll decimals, and deduce shift work hours across daylight boundaries.
              </p>
            </div>

            {/* TAB NAVIGATION */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 -mb-2 no-scrollbar">
              <button 
                onClick={() => setActiveTab('arithmetic')}
                className={`font-label-caps text-label-caps px-5 py-3 rounded-xl shadow-sm whitespace-nowrap flex items-center gap-2 transition-all ${activeTab === 'arithmetic' ? 'bg-primary-container text-on-primary-container font-bold ring-2 ring-primary' : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'}`}
              >
                <span className="material-symbols-outlined text-[18px]">functions</span> Time Math
              </button>
              <button 
                onClick={() => setActiveTab('duration')}
                className={`font-label-caps text-label-caps px-5 py-3 rounded-xl shadow-sm whitespace-nowrap flex items-center gap-2 transition-all ${activeTab === 'duration' ? 'bg-primary-container text-on-primary-container font-bold ring-2 ring-primary' : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'}`}
              >
                <span className="material-symbols-outlined text-[18px]">timelapse</span> Shift Duration
              </button>
              <button 
                onClick={() => setActiveTab('decimal')}
                className={`font-label-caps text-label-caps px-5 py-3 rounded-xl shadow-sm whitespace-nowrap flex items-center gap-2 transition-all ${activeTab === 'decimal' ? 'bg-primary-container text-on-primary-container font-bold ring-2 ring-primary' : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'}`}
              >
                <span className="material-symbols-outlined text-[18px]">decimal_increase</span> Decimal / Payroll
              </button>
            </div>
          </div>
        </section>

        <section className="w-full py-space-xl bg-surface">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
            
            {/* ARITHMETIC TAB */}
            {activeTab === 'arithmetic' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
                <div className="lg:col-span-7 flex flex-col gap-space-md">
                  <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-xl">
                    <div className="flex items-center justify-between mb-space-md">
                      <h2 className="font-headline-md text-headline-md text-on-surface">Time Operands</h2>
                      <button onClick={addEntry} className="text-primary hover:bg-primary-fixed p-2 rounded-lg transition-colors flex items-center gap-1 font-label-caps text-[11px] uppercase">
                        <span className="material-symbols-outlined text-[18px]">add</span> Add Row
                      </button>
                    </div>
                    
                    <div className="flex flex-col gap-3">
                      {entries.map((entry, index) => (
                        <div key={entry.id} className="flex items-center gap-2 p-3 bg-surface-container-low rounded-xl">
                          <select 
                            className="bg-surface-container font-data-mono font-bold text-on-surface rounded-lg p-2 border-r border-outline-variant focus:outline-none"
                            value={entry.operation}
                            onChange={(e) => updateEntry(entry.id, 'operation', e.target.value)}
                          >
                            <option value="add">+</option>
                            <option value="subtract">-</option>
                          </select>
                          <div className="flex items-center gap-1 flex-1">
                            <input 
                              type="number" min="0" 
                              className="w-full bg-surface-container-lowest text-on-surface font-data-mono text-center rounded-lg p-2 focus:ring-2 focus:ring-primary focus:outline-none" 
                              value={entry.hours || ''} 
                              onChange={(e) => updateEntry(entry.id, 'hours', e.target.value)}
                              placeholder="0"
                            />
                            <span className="font-label-caps text-on-surface-variant text-[10px]">HR</span>
                            <span className="text-on-surface-variant font-data-mono font-bold">:</span>
                            <input 
                              type="number" min="0" max="59" 
                              className="w-full bg-surface-container-lowest text-on-surface font-data-mono text-center rounded-lg p-2 focus:ring-2 focus:ring-primary focus:outline-none" 
                              value={entry.minutes || ''} 
                              onChange={(e) => updateEntry(entry.id, 'minutes', e.target.value)}
                              placeholder="00"
                            />
                            <span className="font-label-caps text-on-surface-variant text-[10px]">MIN</span>
                            <span className="text-on-surface-variant font-data-mono font-bold">:</span>
                            <input 
                              type="number" min="0" max="59" 
                              className="w-full bg-surface-container-lowest text-on-surface font-data-mono text-center rounded-lg p-2 focus:ring-2 focus:ring-primary focus:outline-none" 
                              value={entry.seconds || ''} 
                              onChange={(e) => updateEntry(entry.id, 'seconds', e.target.value)}
                              placeholder="00"
                            />
                            <span className="font-label-caps text-on-surface-variant text-[10px]">SEC</span>
                          </div>
                          <button onClick={() => removeEntry(entry.id)} className="text-error hover:bg-error-container p-2 rounded-lg transition-colors ml-1" aria-label="Remove entry">
                            <span className="material-symbols-outlined text-[20px]">close</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div className="bg-primary-fixed p-space-lg rounded-2xl shadow-lg relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 w-48 h-48 bg-primary opacity-10 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="font-label-caps text-[11px] text-on-primary-fixed uppercase tracking-wider mb-2">Aggregate Result</div>
                    
                    <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm mb-4 text-center">
                      <div className="font-data-mono text-[40px] leading-tight font-bold text-on-surface">
                        {arithmeticResult.isNegative ? '-' : ''}
                        {String(arithmeticResult.hrs).padStart(2, '0')}:
                        {String(arithmeticResult.mins).padStart(2, '0')}:
                        {String(arithmeticResult.secs).padStart(2, '0')}
                      </div>
                      <div className="font-label-caps text-[12px] text-on-surface-variant mt-1">HH:MM:SS format</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-primary-fixed-dim/40 rounded-xl p-4">
                        <div className="font-label-caps text-[10px] text-on-primary-fixed-variant mb-1">Decimal Equivalent</div>
                        <div className="font-data-mono text-[20px] font-bold text-on-primary-fixed">{arithmeticResult.decimal} <span className="text-[12px]">hrs</span></div>
                      </div>
                      <div className="bg-primary-fixed-dim/40 rounded-xl p-4">
                        <div className="font-label-caps text-[10px] text-on-primary-fixed-variant mb-1">Total Seconds</div>
                        <div className="font-data-mono text-[20px] font-bold text-on-primary-fixed">{arithmeticResult.totalSeconds.toLocaleString()} <span className="text-[12px]">sec</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* DURATION TAB */}
            {activeTab === 'duration' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
                <div className="lg:col-span-6 flex flex-col gap-space-md">
                  <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-xl">
                    <h2 className="font-headline-md text-headline-md text-on-surface mb-space-md">Shift / Duration Parameters</h2>
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="font-label-caps text-label-caps text-on-surface font-semibold uppercase">Start Time</label>
                          <div className="flex items-center bg-surface-container-low rounded-xl p-2 focus-within:ring-2 focus-within:ring-primary-container">
                            <span className="material-symbols-outlined text-outline px-2 text-[20px]">login</span>
                            <input className="w-full bg-transparent text-on-surface font-data-mono text-[16px] focus:outline-none" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                          </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="font-label-caps text-label-caps text-on-surface font-semibold uppercase">End Time</label>
                          <div className="flex items-center bg-surface-container-low rounded-xl p-2 focus-within:ring-2 focus-within:ring-primary-container">
                            <span className="material-symbols-outlined text-outline px-2 text-[20px]">logout</span>
                            <input className="w-full bg-transparent text-on-surface font-data-mono text-[16px] focus:outline-none" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5 pt-2">
                        <label className="font-label-caps text-label-caps text-on-surface font-semibold uppercase">Unpaid Break (Minutes)</label>
                        <div className="flex items-center bg-surface-container-low rounded-xl p-2 focus-within:ring-2 focus-within:ring-primary-container">
                          <span className="material-symbols-outlined text-outline px-2 text-[20px]">restaurant</span>
                          <input type="number" min="0" className="w-full bg-transparent text-on-surface font-data-mono text-[16px] focus:outline-none" value={breakMinutes} onChange={(e) => setBreakMinutes(parseInt(e.target.value) || 0)} />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5 pt-2 border-t border-surface-container mt-2">
                        <label className="font-label-caps text-label-caps text-on-surface font-semibold uppercase text-secondary">Hourly Wage (Optional)</label>
                        <div className="flex items-center bg-secondary-fixed rounded-xl p-2 focus-within:ring-2 focus-within:ring-secondary-container">
                          <span className="material-symbols-outlined text-on-secondary-fixed px-2 text-[20px]">attach_money</span>
                          <input type="number" step="0.01" min="0" className="w-full bg-transparent text-on-secondary-fixed font-data-mono text-[16px] focus:outline-none font-bold" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-6">
                  <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-xl h-full border-t-4 border-t-primary">
                    <div className="font-label-caps text-[11px] text-on-surface-variant uppercase tracking-wider mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">receipt_long</span> Timesheet Summary
                    </div>
                    
                    {durationResult ? (
                      <div className="flex flex-col gap-6">
                        <div className="bg-surface-container-low rounded-xl p-5 text-center">
                          <div className="font-data-mono text-[48px] leading-tight font-bold text-primary">
                            {durationResult.isNegative ? '-' : ''}
                            {String(durationResult.hrs).padStart(2, '0')}:{String(durationResult.mins).padStart(2, '0')}
                          </div>
                          <div className="font-label-caps text-[12px] text-on-surface-variant mt-1">Total Billable Time (HH:MM)</div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-surface-container p-4 rounded-xl">
                            <div className="font-label-caps text-[10px] text-on-surface-variant mb-1">Payroll Decimal</div>
                            <div className="font-data-mono text-[24px] font-bold text-on-surface">{durationResult.decimal} <span className="text-[14px] text-on-surface-variant">h</span></div>
                          </div>
                          <div className="bg-surface-container p-4 rounded-xl">
                            <div className="font-label-caps text-[10px] text-on-surface-variant mb-1">Gross Pay Estimate</div>
                            <div className="font-data-mono text-[24px] font-bold text-secondary">${durationResult.grossPay}</div>
                          </div>
                        </div>

                        <div className="bg-secondary-container/20 rounded-xl p-4 flex items-start gap-3">
                          <span className="material-symbols-outlined text-secondary text-[20px]">info</span>
                          <p className="font-body-sm text-[13px] text-on-surface-variant">
                            This calculation assumes a shift occurring within 24 hours. If End Time is strictly smaller than Start Time, the engine automatically calculates crossing midnight. Break time is completely deducted from billable hours.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-error font-body-md">Invalid input parameters.</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* DECIMAL TAB */}
            {activeTab === 'decimal' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
                <div className="lg:col-span-5 flex flex-col gap-space-md">
                  <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-xl">
                    <h2 className="font-headline-md text-headline-md text-on-surface mb-space-md">Industrial Decimal Converter</h2>
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="font-label-caps text-label-caps text-on-surface font-semibold uppercase">Decimal Hours (e.g. 7.75)</label>
                        <div className="flex items-center bg-surface-container-low rounded-xl p-2 focus-within:ring-2 focus-within:ring-primary-container">
                          <span className="material-symbols-outlined text-outline px-2 text-[20px]">money</span>
                          <input type="number" step="0.01" className="w-full bg-transparent text-on-surface font-data-mono text-[16px] focus:outline-none" value={decimalInput} onChange={(e) => setDecimalInput(e.target.value)} />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5 pt-2 border-t border-surface-container mt-2">
                        <label className="font-label-caps text-label-caps text-on-surface font-semibold uppercase text-secondary">Hourly Rate (For Pay Calc)</label>
                        <div className="flex items-center bg-secondary-fixed rounded-xl p-2 focus-within:ring-2 focus-within:ring-secondary-container">
                          <span className="material-symbols-outlined text-on-secondary-fixed px-2 text-[20px]">attach_money</span>
                          <input type="number" step="0.01" min="0" className="w-full bg-transparent text-on-secondary-fixed font-data-mono text-[16px] focus:outline-none font-bold" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7">
                  <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-xl h-full border-t-4 border-t-tertiary">
                    <div className="font-label-caps text-[11px] text-on-surface-variant uppercase tracking-wider mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">transform</span> Chronological Output
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-surface-container-low p-4 rounded-xl">
                        <div className="font-label-caps text-[10px] text-on-surface-variant uppercase">Standard Time (HH:MM:SS)</div>
                        <div className="font-data-mono text-[28px] font-bold text-on-surface mt-1">
                          {String(decimalConversion.hrs).padStart(2, '0')}:
                          {String(decimalConversion.mins).padStart(2, '0')}:
                          {String(decimalConversion.secs).padStart(2, '0')}
                        </div>
                      </div>
                      <div className="bg-secondary-fixed/50 p-4 rounded-xl border border-secondary-fixed">
                        <div className="font-label-caps text-[10px] text-on-secondary-fixed-variant uppercase">Gross Pay</div>
                        <div className="font-data-mono text-[28px] font-bold text-secondary mt-1">
                          ${decimalConversion.pay}
                        </div>
                      </div>
                      <div className="bg-surface-container-low p-4 rounded-xl">
                        <div className="font-label-caps text-[10px] text-on-surface-variant uppercase">Total Minutes</div>
                        <div className="font-data-mono text-[24px] font-bold text-on-surface mt-1">
                          {(decimalConversion.hrs * 60 + decimalConversion.mins).toLocaleString()} <span className="text-[12px] text-on-surface-variant">min</span>
                        </div>
                      </div>
                      <div className="bg-surface-container-low p-4 rounded-xl">
                        <div className="font-label-caps text-[10px] text-on-surface-variant uppercase">Total Seconds</div>
                        <div className="font-data-mono text-[24px] font-bold text-on-surface mt-1">
                          {decimalConversion.totalSec.toLocaleString()} <span className="text-[12px] text-on-surface-variant">sec</span>
                        </div>
                      </div>
                      <div className="bg-surface-container-low p-4 rounded-xl">
                        <div className="font-label-caps text-[10px] text-on-surface-variant uppercase">Film/Video (24 FPS)</div>
                        <div className="font-data-mono text-[24px] font-bold text-tertiary mt-1">
                          {decimalConversion.frames24.toLocaleString()} <span className="text-[12px] text-on-surface-variant">frames</span>
                        </div>
                      </div>
                      <div className="bg-surface-container-low p-4 rounded-xl">
                        <div className="font-label-caps text-[10px] text-on-surface-variant uppercase">TV/Video (30 FPS)</div>
                        <div className="font-data-mono text-[24px] font-bold text-tertiary mt-1">
                          {decimalConversion.frames30.toLocaleString()} <span className="text-[12px] text-on-surface-variant">frames</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
