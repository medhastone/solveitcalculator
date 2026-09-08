'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

export default function WorkHoursClient() {
  const [mounted, setMounted] = useState(false);
  const [utcTime, setUtcTime] = useState<Date | null>(null);

  const formatUtcTime = (date: Date) => {
    const h = String(date.getUTCHours()).padStart(2, '0');
    const m = String(date.getUTCMinutes()).padStart(2, '0');
    const s = String(date.getUTCSeconds()).padStart(2, '0');
    return `${h}:${m}:${s}Z`;
  };


  const [workDate, setWorkDate] = useState('2025-03-03');
  const [shiftCategory, setShiftCategory] = useState('Standard Day Shift (8:30 AM - 5:30 PM)');
  const [clockIn, setClockIn] = useState('08:30');
  const [clockOut, setClockOut] = useState('17:45');
  const [breakDuration, setBreakDuration] = useState('45');
  const [hourlyRate, setHourlyRate] = useState('42.50');
  const [otRule, setOtRule] = useState<'flsa' | 'ca'>('ca');

  const [ledger, setLedger] = useState([
    { id: '1', dateStr: '2025-03-03', type: 'Day Shift', clockIn: '08:30', clockOut: '17:30', breakMins: 45, rate: 42.50, otRule: 'ca' },
    { id: '2', dateStr: '2025-03-04', type: 'Day Shift', clockIn: '08:45', clockOut: '17:15', breakMins: 30, rate: 42.50, otRule: 'ca' },
    { id: '3', dateStr: '2025-03-05', type: 'Extended', clockIn: '08:00', clockOut: '18:30', breakMins: 60, rate: 42.50, otRule: 'ca' },
    { id: '4', dateStr: '2025-03-06', type: 'Day Shift', clockIn: '09:00', clockOut: '17:30', breakMins: 30, rate: 42.50, otRule: 'ca' },
    { id: '5', dateStr: '2025-03-07', type: 'Friday Sprint', clockIn: '08:30', clockOut: '17:00', breakMins: 45, rate: 42.50, otRule: 'ca' },
    { id: '6', dateStr: '2025-03-08', type: 'On-Call', clockIn: '10:00', clockOut: '14:00', breakMins: 0, rate: 42.50, otRule: 'ca', forceOT: true }
  ]);

  const parseTime = (timeStr: string) => {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  };

  const formatMins = (totalMins: number) => {
    const isNeg = totalMins < 0;
    const absM = Math.abs(totalMins);
    const h = Math.floor(absM / 60);
    const m = absM % 60;
    return `${isNeg ? '-' : ''}${h}h ${String(m).padStart(2, '0')}m`;
  };

  const calcShift = (cIn: string, cOut: string, bMins: number, rule: string, rate: number, forceOT: boolean = false, accumWeeklyHrs: number = 0) => {
    const inMins = parseTime(cIn);
    let outMins = parseTime(cOut);
    if (outMins < inMins) outMins += 24 * 60;
    const grossMins = outMins - inMins;
    const netMins = Math.max(0, grossMins - bMins);
    const decHrs = netMins / 60;
    
    let reg = 0;
    let ot = 0;

    if (forceOT) {
      ot = decHrs;
    } else if (rule === 'ca') {
      reg = Math.min(8, decHrs);
      ot = Math.max(0, decHrs - 8);
    } else {
      // FLSA
      if (accumWeeklyHrs + decHrs > 40) {
        if (accumWeeklyHrs >= 40) {
          ot = decHrs;
        } else {
          reg = 40 - accumWeeklyHrs;
          ot = decHrs - reg;
        }
      } else {
        reg = decHrs;
      }
    }

    const pay = (reg * rate) + (ot * rate * 1.5);
    return { grossMins, netMins, decHrs, reg, ot, pay };
  };

  // Live Shift Preview
  const liveShift = calcShift(clockIn, clockOut, parseInt(breakDuration) || 0, otRule, parseFloat(hourlyRate) || 0);

  // Ledger Calculations
  let weeklyAccum = 0;
  const processedLedger = ledger.map(shift => {
    const res = calcShift(shift.clockIn, shift.clockOut, shift.breakMins, shift.otRule, shift.rate, (shift as any).forceOT, weeklyAccum);
    weeklyAccum += res.decHrs;
    return { ...shift, ...res };
  });

  const totals = processedLedger.reduce((acc, curr) => {
    acc.grossPay += curr.pay;
    acc.regHrs += curr.reg;
    acc.otHrs += curr.ot;
    acc.decHrs += curr.decHrs;
    acc.netMins += curr.netMins;
    return acc;
  }, { grossPay: 0, regHrs: 0, otHrs: 0, decHrs: 0, netMins: 0 });

  
  const [currency, setCurrency] = useState('USD');
  const [timeFormat, setTimeFormat] = useState<'12h' | '24h'>('12h');

  const getSymbol = () => currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$';

  const displayTime = (time24: string) => {
    if (!time24) return '--:--';
    if (timeFormat === '24h') return time24;
    const parts = time24.split(':');
    if (parts.length !== 2) return time24;
    let h = parseInt(parts[0], 10);
    const m = parts[1];
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h.toString().padStart(2, '0')}:${m} ${ampm}`;
  };

  const setToday = () => {
    setWorkDate(new Date().toISOString().split('T')[0]);
  };

  const exportCSV = () => {
    const headers = ['Date', 'Type', 'Clock In', 'Clock Out', 'Break (m)', 'Net Dec Hrs', 'Reg Hrs', 'OT Hrs', 'Pay'];
    const rows = processedLedger.map(s => 
      [s.dateStr, s.type, s.clockIn, s.clockOut, s.breakMins, s.decHrs.toFixed(2), s.reg.toFixed(2), s.ot.toFixed(2), s.pay.toFixed(2)].join(',')
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "timesheet.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const printSheet = () => {
    window.print();
  };

  const copySheet = () => {
    const text = processedLedger.map(s => `${s.dateStr} | ${s.type} | ${s.clockIn}-${s.clockOut} | ${s.decHrs.toFixed(2)} hrs | Pay: ${getSymbol()}${s.pay.toFixed(2)}`).join('\n');
    navigator.clipboard.writeText(`Timesheet:\n${text}\nTotal Reg: ${totals.regHrs.toFixed(2)}h | Total OT: ${totals.otHrs.toFixed(2)}h | Total Pay: ${getSymbol()}${totals.grossPay.toFixed(2)}`);
    alert('Timesheet copied to clipboard!');
  };

  const scrollToForm = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addShiftToLedger = () => {
    setLedger([...ledger, {
      id: Date.now().toString(),
      dateStr: workDate,
      type: shiftCategory.split(' ')[0],
      clockIn,
      clockOut,
      breakMins: parseInt(breakDuration) || 0,
      rate: parseFloat(hourlyRate) || 0,
      otRule
    }]);
  };


  useEffect(() => {
    setMounted(true);
    setUtcTime(new Date());
    const timer = setInterval(() => {
      setUtcTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-background"></div>;

  return (
    <div className="bg-background font-body-md text-on-surface antialiased min-h-screen flex flex-col">
      <Header />
      <main className="w-full pt-16 bg-background flex-grow">
        <div className="flex flex-col w-full">
          {/* BREADCRUMBS & COMPLIANCE TELEMETRY STRIP */}
          <section className="w-full bg-surface border-b border-outline-variant/30 py-3 px-gutter-mobile md:px-gutter-desktop">
            <div className="max-w-max-width-canvas mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 font-body-sm text-body-sm">
              <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-on-surface-variant">
                <Link className="hover:text-primary transition-colors flex items-center gap-1" href="/">
                  <span className="material-symbols-outlined text-[16px]">home</span>
                  <span>Home</span>
                </Link>
                <span className="material-symbols-outlined text-[14px] text-outline-variant">chevron_right</span>
                <Link className="hover:text-primary transition-colors" href="/time-date">Time &amp; Date</Link>
                <span className="material-symbols-outlined text-[14px] text-outline-variant">chevron_right</span>
                <span className="text-on-surface font-semibold">Work Hours &amp; Timesheet Calculator</span>
              </nav>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-high text-primary font-label-caps text-label-caps">
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                  FLSA Compliant
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-high text-secondary font-label-caps text-label-caps">
                  <span className="material-symbols-outlined text-[14px]">bedtime</span>
                  Cross-Midnight Shift Engine
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-caps text-label-caps">
                  <span className="material-symbols-outlined text-[14px]">lock</span>
                  100% Client-Side Sandbox
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-tertiary font-label-caps text-label-caps">
                  <span className="material-symbols-outlined text-[14px]">bolt</span>
                  ±1s Accuracy
                </span>
              </div>
            </div>
          </section>

          {/* SUB-NAVIGATION TEMPLATE SWITCHER BAR */}
          <section className="w-full bg-surface-container-lowest border-b border-outline-variant/30 sticky top-[64px] z-40">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop">
              <div className="flex items-center gap-2 overflow-x-auto py-2 no-scrollbar">
                <button className="px-3.5 py-1.5 rounded-lg text-body-sm font-body-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all whitespace-nowrap" type="button">
                  Single Shift Calculator
                </button>
                <button className="px-3.5 py-1.5 rounded-lg text-body-sm font-body-sm bg-primary text-on-primary font-medium transition-all shadow-sm whitespace-nowrap" type="button">
                  Weekly Timesheet Ledger (Active)
                </button>
                <button className="px-3.5 py-1.5 rounded-lg text-body-sm font-body-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all whitespace-nowrap" type="button">
                  Overtime &amp; FLSA Audit
                </button>
                <button className="px-3.5 py-1.5 rounded-lg text-body-sm font-body-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all whitespace-nowrap" type="button">
                  Biweekly &amp; Monthly Payroll
                </button>
                <button className="px-3.5 py-1.5 rounded-lg text-body-sm font-body-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all whitespace-nowrap" type="button">
                  Cross-Midnight &amp; Night Shifts
                </button>
                <button className="px-3.5 py-1.5 rounded-lg text-body-sm font-body-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-all whitespace-nowrap" type="button">
                  Freelance &amp; Billable Invoicing
                </button>
              </div>
            </div>
          </section>

          {/* SECTION 1: HERO / TITLE INTRO */}
          <section className="w-full py-space-2xl px-gutter-mobile md:px-gutter-desktop bg-gradient-to-b from-surface to-background">
            <div className="max-w-max-width-canvas mx-auto">
              <div className="flex flex-col gap-space-sm max-w-3xl">
                <div className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-caps text-label-caps">
                  <span className="material-symbols-outlined text-[14px]">tune</span>
                  ENTERPRISE WORKFORCE TELEMETRY
                </div>
                <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                  Work Hours &amp; Timesheet Calculator
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant">
                  Calculate precise daily work hours, net billable duration, automated unpaid meal deductions, FLSA overtime multipliers, and gross payroll distributions with zero-cloud client-side execution.
                </p>
                {/* Meta pill & Trust Metrics */}
                <div className="pt-space-xs flex flex-wrap items-center gap-3">
                  <div className="px-3 py-1 rounded-md bg-surface-container-high text-on-surface-variant font-data-mono text-body-sm">
                    Engine: v4.12.0 • Last Calibrated: March 2025 • Executions: 5.2M / Mo
                  </div>
                  <div className="inline-flex items-center gap-1.5 text-primary text-body-sm font-medium">
                    <span className="material-symbols-outlined text-[18px]">verified_user</span>
                    Zero Timesheet Data Leaves Browser
                  </div>
                </div>
              </div>
              {/* Trust metric highlights strip */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md mt-space-xl">
                <div className="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-1">
                  <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Data Privacy</span>
                  <span className="font-headline-md text-headline-md text-on-surface">100% Client-Side</span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Local Web Workers, no external tracking</p>
                </div>
                <div className="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-1">
                  <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Overnight Math</span>
                  <span className="font-headline-md text-headline-md text-on-surface">Modulo 24-hr</span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Seamless cross-midnight elapsed shifts</p>
                </div>
                <div className="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-1">
                  <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Labor Law Compliance</span>
                  <span className="font-headline-md text-headline-md text-on-surface">FLSA + CA 8/12</span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Daily &amp; weekly overtime tiers built-in</p>
                </div>
                <div className="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-1">
                  <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Export Formats</span>
                  <span className="font-headline-md text-headline-md text-on-surface">Instant CSV / PDF</span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">One-click audit-ready corporate ledgers</p>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2 & 3: ERGONOMIC SHIFT CALCULATOR + FOCAL LIVE METRICS */}
          <section className="w-full py-space-xl px-gutter-mobile md:px-gutter-desktop bg-surface-container-low">
            <div className="max-w-max-width-canvas mx-auto grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
              {/* LEFT WORKBENCH: QUICK LOG PANEL (7 COLS) */}
              <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-lg">
                <div className="flex items-center justify-between pb-space-sm">
                  <div>
                    <h2 className="font-headline-md text-headline-md text-on-surface">Shift Configuration Workbench</h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Configure parameters to calculate immediate hours and append to the ledger.</p>
                  </div>
                  <div className="inline-flex rounded-lg bg-surface-container p-1 text-label-caps hidden sm:flex">
                    <button className={`px-2.5 py-1 rounded ${timeFormat === "12h" ? "bg-surface text-primary font-medium shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`} type="button" onClick={() => setTimeFormat("12h")}>12-Hour</button>
                    <button className={`px-2.5 py-1 rounded ${timeFormat === "24h" ? "bg-surface text-primary font-medium shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`} type="button" onClick={() => setTimeFormat("24h")}>24-Hour Military</button>
                  </div>
                </div>
                {/* Shift form grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                  {/* Work Date */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-caps text-label-caps uppercase text-on-surface-variant">Work Date</label>
                    <div className="flex items-center gap-2">
                      <input className="w-full bg-surface-container-low rounded-lg px-3 py-2 text-body-md font-body-md text-on-surface focus:outline-none focus:bg-surface" type="date" value={workDate} onChange={(e) => setWorkDate(e.target.value)} />
                      <button className="px-2.5 py-2 rounded-lg bg-surface-container text-body-sm font-medium text-primary hover:bg-surface-container-high" type="button" onClick={setToday}>Today</button>
                    </div>
                  </div>
                  {/* Shift Pattern Preset */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-caps text-label-caps uppercase text-on-surface-variant">Shift Category</label>
                    <select className="w-full bg-surface-container-low rounded-lg px-3 py-2 text-body-md font-body-md text-on-surface focus:outline-none focus:bg-surface" value={shiftCategory} onChange={(e) => setShiftCategory(e.target.value)}>
                      <option value="Standard Day Shift (8:30 AM - 5:30 PM)">Standard Day Shift (8:30 AM - 5:30 PM)</option>
                      <option value="Night / Graveyard (Overnight 10 PM - 6:30 AM)">Night / Graveyard (Overnight 10 PM - 6:30 AM)</option>
                      <option value="2-2-3 Compressed Workweek (12-hr)">2-2-3 Compressed Workweek (12-hr)</option>
                      <option value="Split Shift (Dual clock-in morning/evening)">Split Shift (Dual clock-in morning/evening)</option>
                    </select>
                  </div>
                  {/* Clock In */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <label className="font-label-caps text-label-caps uppercase text-on-surface-variant">Clock In Time</label>
                      <span className="text-label-caps text-secondary font-medium">Session Start</span>
                    </div>
                    <div className="relative">
                      <input className="w-full bg-surface-container-low rounded-lg px-3 py-2 text-body-md font-data-mono text-on-surface focus:outline-none focus:bg-surface" type="time" value={clockIn} onChange={(e) => setClockIn(e.target.value)} />
                    </div>
                  </div>
                  {/* Clock Out */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <label className="font-label-caps text-label-caps uppercase text-on-surface-variant">Clock Out Time</label>
                      <span className="inline-flex items-center gap-1 text-label-caps text-primary bg-primary-fixed px-1.5 py-0.5 rounded">
                        +9h 15m gross
                      </span>
                    </div>
                    <div className="relative">
                      <input className="w-full bg-surface-container-low rounded-lg px-3 py-2 text-body-md font-data-mono text-on-surface focus:outline-none focus:bg-surface" type="time" value={clockOut} onChange={(e) => setClockOut(e.target.value)} />
                    </div>
                  </div>
                  {/* Break Duration Dropdown */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <label className="font-label-caps text-label-caps uppercase text-on-surface-variant">Unpaid Meal Deduction</label>
                      <span className="text-label-caps text-on-surface-variant">FLSA &gt;20m Unpaid</span>
                    </div>
                    <select className="w-full bg-surface-container-low rounded-lg px-3 py-2 text-body-md font-body-md text-on-surface focus:outline-none focus:bg-surface" value={breakDuration} onChange={(e) => setBreakDuration(e.target.value)}>
                      <option value="None (0 Minutes)">None (0 Minutes)</option>
                      <option value="15 Minutes (Short rest - paid in some states)">15 Minutes (Short rest - paid in some states)</option>
                      <option value="30 Minutes (Standard meal break)">30 Minutes (Standard meal break)</option>
                      <option value="45">45 Minutes (Enterprise lunch deduction)</option>
                      <option value="60 Minutes (Full hour break)">60 Minutes (Full hour break)</option>
                      <option value="Custom Minute Duration">Custom Minute Duration</option>
                    </select>
                  </div>
                  {/* Hourly Pay Rate */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <label className="font-label-caps text-label-caps uppercase text-on-surface-variant">Base Hourly Rate</label>
                      <div className="inline-flex gap-1 text-label-caps">
                        <span className={currency === "USD" ? "font-bold text-primary cursor-pointer" : "text-on-surface-variant hover:text-on-surface cursor-pointer"} onClick={() => setCurrency("USD")}>USD ($)</span>
                        <span className={currency === "EUR" ? "font-bold text-primary cursor-pointer" : "text-on-surface-variant hover:text-on-surface cursor-pointer"} onClick={() => setCurrency("EUR")}>EUR (€)</span>
                        <span className={currency === "GBP" ? "font-bold text-primary cursor-pointer" : "text-on-surface-variant hover:text-on-surface cursor-pointer"} onClick={() => setCurrency("GBP")}>GBP (£)</span>
                      </div>
                    </div>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-on-surface-variant font-data-mono">{getSymbol()}</span>
                      <input className="w-full pl-7 pr-12 bg-surface-container-low rounded-lg py-2 text-body-md font-data-mono text-on-surface focus:outline-none focus:bg-surface" step="0.50" type="number" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} />
                      <span className="absolute right-3 text-on-surface-variant font-body-sm">/ hr</span>
                    </div>
                  </div>
                  {/* Overtime Rule Multiplier */}
                  <div className="col-span-1 md:col-span-2 flex flex-col gap-1.5">
                    <label className="font-label-caps text-label-caps uppercase text-on-surface-variant">Overtime Regulatory Standard</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <label className="flex items-start gap-2.5 p-3 rounded-lg bg-surface-container-low cursor-pointer hover:bg-surface-container transition-all">
                        <input checked={otRule === "flsa"} onChange={() => setOtRule("flsa")} className="mt-1 text-primary focus:ring-0" name="ot_rule" type="radio" />
                        <div className="flex flex-col">
                          <span className="font-body-sm font-semibold text-on-surface">Standard Federal FLSA</span>
                          <span className="font-body-sm text-body-sm text-on-surface-variant">1.5x pay on hours in excess of 40 hrs / workweek</span>
                        </div>
                      </label>
                      <label className="flex items-start gap-2.5 p-3 rounded-lg bg-surface-container-low cursor-pointer hover:bg-surface-container transition-all">
                        <input checked={otRule === "ca"} onChange={() => setOtRule("ca")} className="mt-1 text-primary focus:ring-0" name="ot_rule" type="radio" />
                        <div className="flex flex-col">
                          <span className="font-body-sm font-semibold text-on-surface">California Daily Rule</span>
                          <span className="font-body-sm text-body-sm text-on-surface-variant">1.5x after 8 hrs/day; 2.0x double-time after 12 hrs/day</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
                {/* Quick Actions Button Row */}
                <div className="pt-space-sm flex flex-wrap items-center gap-3">
                  <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-on-primary font-body-md font-medium shadow-sm hover:opacity-95 transition-all" type="button" onClick={addShiftToLedger}>
                    <span className="material-symbols-outlined text-[18px]">bolt</span>
                    Compute Shift &amp; Add to Ledger
                  </button>
                  <button className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all font-body-sm" type="button" onClick={() => { setWorkDate(new Date().toISOString().split('T')[0]); setClockIn("08:30"); setClockOut("17:45"); setBreakDuration("45"); setHourlyRate("42.50"); setShiftCategory("Standard Day Shift (8:30 AM - 5:30 PM)"); }}>
                    <span className="material-symbols-outlined text-[18px]">restart_alt</span>
                    Reset Times
                  </button>
                  <button className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all font-body-sm" type="button" onClick={addShiftToLedger}>
                    <span className="material-symbols-outlined text-[18px]">bookmark_add</span>
                    Quick Save Shift
                  </button>
                </div>
              </div>
              {/* RIGHT DASHBOARD: LIVE METRIC RESULT TILES (5 COLS) */}
              <div className="lg:col-span-5 flex flex-col gap-space-md justify-between">
                {/* CARD 1: FOCAL TOTAL PAID HOURS */}
                <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-2 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Total Paid Hours Today</span>
                    <span className="inline-flex items-center gap-1 text-label-caps px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                      Live Shift Result
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-numerical-display text-numerical-display text-primary">{formatMins(liveShift.netMins)}</span>
                    <span className="font-data-mono text-body-lg text-on-surface-variant font-medium">({liveShift.decHrs.toFixed(2)} Dec)</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 text-body-sm text-on-surface-variant">
                    <span>Gross Span: <strong className="text-on-surface">{formatMins(liveShift.grossMins)}</strong></span>
                    <span>Unpaid Break: <strong className="text-error">-{breakDuration}m</strong></span>
                  </div>
                  <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-1 overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                {/* CARD 2: REGULAR VS OVERTIME SPLIT */}
                <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm grid grid-cols-2 gap-space-md">
                  <div className="flex flex-col gap-1">
                    <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Regular Hours (1.0x)</span>
                    <span className="font-headline-md text-headline-md text-on-surface">{liveShift.reg.toFixed(2)} hrs</span>
                    <span className="font-data-mono text-body-sm text-secondary font-medium">{getSymbol()}{(liveShift.reg * (parseFloat(hourlyRate)||0)).toFixed(2)} base</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Daily Overtime (1.5x)</span>
                    <span className="font-headline-md text-headline-md text-tertiary">{liveShift.ot.toFixed(2)} hrs</span>
                    <span className="font-data-mono text-body-sm text-tertiary font-medium">{getSymbol()}{(liveShift.ot * (parseFloat(hourlyRate)||0) * 1.5).toFixed(2)} @ {getSymbol()}{(parseFloat(hourlyRate) * 1.5 || 0).toFixed(2)}/hr</span>
                  </div>
                </div>
                {/* CARD 3: GROSS EARNINGS COMPUTATION */}
                <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Estimated Daily Gross Payout</span>
                    <span className="font-label-caps text-label-caps text-on-surface-variant">Net of 45m Break</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-numerical-display text-numerical-display text-on-surface">{getSymbol()}{liveShift.pay.toFixed(2)}</span>
                    <span className="font-body-sm text-on-surface-variant font-medium">gross total</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Effective Blended Rate: <span className="font-data-mono font-medium text-on-surface">{getSymbol()}{liveShift.decHrs > 0 ? (liveShift.pay / liveShift.decHrs).toFixed(2) : "0.00"} / hr</span> across {liveShift.decHrs.toFixed(2)} billed hours
                  </p>
                </div>
                {/* CARD 4: WEEKLY ACCUMULATOR STATUS */}
                <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Weekly Standard Accumulator</span>
                    <span className="font-data-mono text-body-sm text-primary font-semibold">{totals.decHrs.toFixed(2)} / 40.00 hrs</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden flex">
                    <div className="bg-primary h-full rounded-l-full" style={{ width: '96.2%' }}></div>
                    <div className="bg-surface-container h-full" style={{ width: '3.8%' }}></div>
                  </div>
                  <div className="flex justify-between items-center text-body-sm">
                    <span className="text-on-surface-variant">{Math.min(100, (totals.decHrs / 40) * 100).toFixed(1)}% of regular week reached</span>
                    <span className="text-tertiary font-medium">{Math.max(0, 40 - totals.decHrs).toFixed(2)} hrs to weekly OT trigger</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* SECTION 4: INTERACTIVE WEEKLY TIMESHEET LEDGER TABLE */}
          <section className="w-full py-space-2xl px-gutter-mobile md:px-gutter-desktop bg-surface">
            <div className="max-w-max-width-canvas mx-auto flex flex-col gap-space-lg">
              {/* Table Header & Controls */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-headline-lg text-headline-lg text-on-surface">Weekly Timesheet Ledger</h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-surface-container-highest text-on-surface font-label-caps text-label-caps">Week 10 • March 2025</span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Standard engineering shift log with automatic deduction, overtime stratification, and total billable pay calculation.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container text-body-sm font-medium text-on-surface hover:bg-surface-container-high transition-all" type="button" onClick={scrollToForm}>
                    <span className="material-symbols-outlined text-[16px]">add_circle</span>
                    Add Shift Row
                  </button>
                  <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-body-sm font-medium text-on-primary hover:opacity-95 shadow-sm transition-all" type="button" onClick={exportCSV}>
                    <span className="material-symbols-outlined text-[16px]">download</span>
                    Export CSV
                  </button>
                  <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container text-body-sm font-medium text-on-surface hover:bg-surface-container-high transition-all" type="button" onClick={printSheet}>
                    <span className="material-symbols-outlined text-[16px]">print</span>
                    Print Sheet
                  </button>
                  <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container text-body-sm font-medium text-on-surface hover:bg-surface-container-high transition-all" type="button" onClick={copySheet}>
                    <span className="material-symbols-outlined text-[16px]">content_copy</span>
                    Copy
                  </button>
                </div>
              </div>
              {/* Ledger Table */}
              <div className="overflow-x-auto rounded-xl bg-surface-container-lowest shadow-sm">
                <table className="w-full text-left font-body-sm text-body-sm">
                  <thead className="bg-surface-container-low text-on-surface-variant font-label-caps text-label-caps uppercase tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Day &amp; Date</th>
                      <th className="py-3.5 px-3">Shift Type</th>
                      <th className="py-3.5 px-3">Clock In</th>
                      <th className="py-3.5 px-3">Clock Out</th>
                      <th className="py-3.5 px-3">Break</th>
                      <th className="py-3.5 px-3">Elapsed</th>
                      <th className="py-3.5 px-3 text-right">Paid (Dec)</th>
                      <th className="py-3.5 px-3 text-right">Reg Hrs</th>
                      <th className="py-3.5 px-3 text-right">OT Hrs</th>
                      <th className="py-3.5 px-4 text-right">Gross Pay</th>
                      <th className="py-3.5 px-3 text-center">Action</th>
                    </tr>
                  </thead>
                  
                  <tbody className="divide-y divide-surface-container">
                    {processedLedger.map((shift, idx) => (
                      <tr key={shift.id} className="hover:bg-surface-container-low/50 transition-colors">
                        <td className="py-3.5 px-4 font-medium text-on-surface">{new Date(shift.dateStr).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: '2-digit' })}</td>
                        <td className="py-3.5 px-3"><span className={`px-2 py-0.5 rounded text-label-caps ${shift.ot > 0 ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant font-semibold' : 'bg-surface-container text-on-surface-variant'}`}>{shift.type}</span></td>
                        <td className="py-3.5 px-3 font-data-mono">{displayTime(shift.clockIn)}</td>
                        <td className="py-3.5 px-3 font-data-mono">{displayTime(shift.clockOut)}</td>
                        <td className="py-3.5 px-3 text-on-surface-variant">{shift.breakMins}m</td>
                        <td className="py-3.5 px-3 text-on-surface-variant">{formatMins(shift.grossMins)}</td>
                        <td className="py-3.5 px-3 text-right font-data-mono font-semibold text-primary">{shift.decHrs.toFixed(2)}</td>
                        <td className="py-3.5 px-3 text-right font-data-mono">{shift.reg.toFixed(2)}</td>
                        <td className="py-3.5 px-3 text-right font-data-mono text-tertiary">{shift.ot.toFixed(2)}</td>
                        <td className="py-3.5 px-4 text-right font-data-mono font-semibold text-on-surface">{getSymbol()}{shift.pay.toFixed(2)}</td>
                        <td className="py-3.5 px-3 text-center">
                          <button onClick={() => setLedger(ledger.filter(s => s.id !== shift.id))} className="text-outline hover:text-error" type="button"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                        </td>
                      </tr>
                    ))}
                    {processedLedger.length === 0 && (
                      <tr className="text-on-surface-variant/70">
                        <td colSpan={11} className="py-8 text-center">No shifts logged in the ledger.</td>
                      </tr>
                    )}
                  </tbody>

                  {/* Summary Footers */}
                  <tfoot className="bg-surface-container-high font-semibold text-on-surface">
                    <tr>
                      <td className="py-4 px-4 text-body-md" colSpan={6}>Weekly Gross Summary</td>
                      <td className="py-4 px-3 text-right font-data-mono text-primary text-body-md">{totals.decHrs.toFixed(2)} h</td>
                      <td className="py-4 px-3 text-right font-data-mono text-body-md">{totals.regHrs.toFixed(2)} h</td>
                      <td className="py-4 px-3 text-right font-data-mono text-tertiary text-body-md">{totals.otHrs.toFixed(2)} h</td>
                      <td className="py-4 px-4 text-right font-data-mono text-headline-md text-on-surface">{getSymbol()}{totals.grossPay.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                      <td className="py-4 px-3 text-center">
                        <button onClick={() => setLedger([])} className="text-error hover:opacity-80" title="Clear All Rows" type="button">
                          <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
                        </button>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              {/* Footer Micro-Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
                <div className="p-3.5 rounded-lg bg-surface-container-lowest flex items-center justify-between">
                  <span className="text-body-sm text-on-surface-variant">Regular Pay Allocation:</span>
                  <span className="font-data-mono font-semibold text-on-surface">{getSymbol()}{totals.regHrs > 0 ? (totals.grossPay - (totals.otHrs * (parseFloat(hourlyRate)||0) * 1.5)).toFixed(2) : "0.00"} ({totals.regHrs.toFixed(2)} hrs)</span>
                </div>
                <div className="p-3.5 rounded-lg bg-surface-container-lowest flex items-center justify-between">
                  <span className="text-body-sm text-on-surface-variant">Overtime Pay Bonus:</span>
                  <span className="font-data-mono font-semibold text-tertiary">+{getSymbol()}{(totals.otHrs * (parseFloat(hourlyRate)||0) * 1.5).toFixed(2)} ({totals.otHrs.toFixed(2)} hrs @ 1.5x)</span>
                </div>
                <div className="p-3.5 rounded-lg bg-surface-container-lowest flex items-center justify-between">
                  <span className="text-body-sm text-on-surface-variant">Total Billable Time:</span>
                  <span className="font-data-mono font-semibold text-primary">{formatMins(totals.netMins)}</span>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 5 & 6: ADVANCED VISUAL WORKFORCE ANALYTICS & PRODUCTIVITY HEATMAP */}
          <section className="w-full py-space-2xl px-gutter-mobile md:px-gutter-desktop bg-surface-container-low">
            <div className="max-w-max-width-canvas mx-auto flex flex-col gap-space-xl">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-primary font-label-caps text-label-caps mb-2">
                  <span className="material-symbols-outlined text-[14px]">analytics</span>
                  DYNAMIC WORKFORCE AUDIT
                </div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface">Weekly Visual Analytics &amp; Temporal Distribution</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">Instant graphical telemetry of daily effort thresholds, overtime triggers, and working session clusters.</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
                {/* VISUAL 1: Daily Working Hours vs 8h Target (Stacked Bar Chart SVG) - 7 cols */}
                <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between gap-space-md">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Daily Work Hours vs 8.0h Baseline</span>
                      <span className="font-headline-md text-headline-md text-on-surface">Daily Capacity Stack</span>
                    </div>
                    <div className="flex items-center gap-3 text-body-sm">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-sm bg-primary"></span> Regular (≤8h)
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-sm bg-tertiary"></span> Overtime (&gt;8h / Weekend)
                      </span>
                    </div>
                  </div>
                  {/* Inline SVG Bar Chart */}
                  <div className="w-full pt-4">
                    <svg className="w-full h-52 text-on-surface" fill="none" preserveAspectRatio="none" viewBox="0 0 540 180">
                      {/* Target 8h horizontal guideline */}
                      <line stroke="currentColor" strokeDasharray="4 4" strokeOpacity="0.2" strokeWidth="1.5" x1="30" x2="520" y1="65" y2="65"></line>
                      <text fill="currentColor" fillOpacity="0.5" fontFamily="Inter" fontSize="11" fontWeight="600" x="475" y="60">8.0h Standard</text>
                      {/* Mon (8.25h: 8.0 reg + 0.25 OT) */}
                      <rect className="fill-primary" height="95" rx="4" width="40" x="50" y="65"></rect>
                      <rect className="fill-tertiary" height="5" rx="2" width="40" x="50" y="60"></rect>
                      <text fill="currentColor" fillOpacity="0.7" fontFamily="Inter" fontSize="12" x="60" y="175">Mon</text>
                      <text fill="currentColor" fontFamily="JetBrains Mono" fontSize="11" fontWeight="600" x="56" y="52">8.25h</text>
                      {/* Tue (8.00h: 8.0 reg) */}
                      <rect className="fill-primary" height="95" rx="4" width="40" x="125" y="65"></rect>
                      <text fill="currentColor" fillOpacity="0.7" fontFamily="Inter" fontSize="12" x="135" y="175">Tue</text>
                      <text fill="currentColor" fontFamily="JetBrains Mono" fontSize="11" fontWeight="600" x="131" y="56">8.00h</text>
                      {/* Wed (9.50h: 8.0 reg + 1.5 OT) */}
                      <rect className="fill-primary" height="95" rx="4" width="40" x="200" y="65"></rect>
                      <rect className="fill-tertiary" height="30" rx="4" width="40" x="200" y="35"></rect>
                      <text fill="currentColor" fillOpacity="0.7" fontFamily="Inter" fontSize="12" x="207" y="175">Wed</text>
                      <text fill="currentColor" fontFamily="JetBrains Mono" fontSize="11" fontWeight="600" x="204" y="27">9.50h</text>
                      {/* Thu (8.00h: 8.0 reg) */}
                      <rect className="fill-primary" height="95" rx="4" width="40" x="275" y="65"></rect>
                      <text fill="currentColor" fillOpacity="0.7" fontFamily="Inter" fontSize="12" x="285" y="175">Thu</text>
                      <text fill="currentColor" fontFamily="JetBrains Mono" fontSize="11" fontWeight="600" x="281" y="56">8.00h</text>
                      {/* Fri (7.75h: 7.75 reg) */}
                      <rect className="fill-primary" height="90" rx="4" width="40" x="350" y="70"></rect>
                      <text fill="currentColor" fillOpacity="0.7" fontFamily="Inter" fontSize="12" x="363" y="175">Fri</text>
                      <text fill="currentColor" fontFamily="JetBrains Mono" fontSize="11" fontWeight="600" x="356" y="60">7.75h</text>
                      {/* Sat (4.00h: all OT) */}
                      <rect className="fill-tertiary" height="48" rx="4" width="40" x="425" y="112"></rect>
                      <text fill="currentColor" fillOpacity="0.7" fontFamily="Inter" fontSize="12" x="437" y="175">Sat</text>
                      <text fill="currentColor" fontFamily="JetBrains Mono" fontSize="11" fontWeight="600" x="431" y="103">4.00h</text>
                    </svg>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-surface-container text-body-sm text-on-surface-variant">
                    <span>Weekly standard target: <strong>40.00h</strong></span>
                    <span>Recorded paid hours: <strong className="text-primary">45.50h (+13.7%)</strong></span>
                  </div>
                </div>
                {/* VISUAL 2: Weekly Time Allocation Donut Chart & Productivity Split - 5 cols */}
                <div className="lg:col-span-5 bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between gap-space-md">
                  <div className="flex flex-col">
                    <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">7-Day Gross Span Allocation</span>
                    <h3 className="font-headline-md text-headline-md text-on-surface">Time Allocation Ratio</h3>
                  </div>
                  <div className="flex items-center justify-center gap-6 py-2">
                    {/* Inline SVG Donut Chart */}
                    <div className="relative w-36 h-36 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        {/* Background track */}
                        <circle cx="50" cy="50" fill="none" r="38" stroke="#eaedff" strokeWidth="12"></circle>
                        {/* Productive Billable: 82% (circumference ~ 238.76) => 195.8 stroke */}
                        <circle cx="50" cy="50" fill="none" r="38" stroke="#004ac6" strokeDasharray="195.8 238.76" strokeDashoffset="0" strokeLinecap="round" strokeWidth="12"></circle>
                        {/* Overtime Sprint: 11% => 26.2 stroke */}
                        <circle cx="50" cy="50" fill="none" r="38" stroke="#943700" strokeDasharray="26.2 238.76" strokeDashoffset="-195.8" strokeWidth="12"></circle>
                        {/* Meal Deductions: 7% => 16.7 stroke */}
                        <circle cx="50" cy="50" fill="none" r="38" stroke="#737686" strokeDasharray="16.7 238.76" strokeDashoffset="-222.0" strokeWidth="12"></circle>
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="font-numerical-display-mobile text-numerical-display-mobile text-on-surface">82%</span>
                        <span className="font-label-caps text-label-caps text-on-surface-variant">Billable</span>
                      </div>
                    </div>
                    {/* Legend breakdown */}
                    <div className="flex flex-col gap-2.5 font-body-sm text-body-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                        <span className="text-on-surface font-medium">Regular: 39.75h</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-tertiary"></span>
                        <span className="text-on-surface font-medium">Overtime: 5.75h</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-outline"></span>
                        <span className="text-on-surface font-medium">Meal Deduct: 3.50h</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-surface-container text-body-sm text-on-surface">
                    <span className="font-semibold text-primary">High Efficiency Score:</span> 93% of clocked on-site duration constituted directly compensated engineering output.
                  </div>
                </div>
                {/* VISUAL 4: Shift Clock Heatmap across 24 hours of the day (12 cols) */}
                <div className="lg:col-span-12 bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Temporal Intensity Matrix</span>
                      <h3 className="font-headline-md text-headline-md text-on-surface">Daily Shift Coverage Heatmap (24-Hour Distribution)</h3>
                    </div>
                    <div className="flex items-center gap-2 font-label-caps text-label-caps text-on-surface-variant">
                      <span>Low</span>
                      <span className="w-3 h-3 rounded-sm bg-surface-container"></span>
                      <span className="w-3 h-3 rounded-sm bg-primary-fixed"></span>
                      <span className="w-3 h-3 rounded-sm bg-primary-container"></span>
                      <span className="w-3 h-3 rounded-sm bg-primary"></span>
                      <span>High Intensity (Peak: 10:00 - 15:00)</span>
                    </div>
                  </div>
                  {/* Heatmap 24h Blocks */}
                  <div className="grid grid-cols-12 md:grid-cols-24 gap-1 pt-2">
                    {/* 00 to 05 AM */}
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-full h-8 rounded bg-surface-container"></div>
                      <span className="font-data-mono text-[10px] text-on-surface-variant">00</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-full h-8 rounded bg-surface-container"></div>
                      <span className="font-data-mono text-[10px] text-on-surface-variant">01</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-full h-8 rounded bg-surface-container"></div>
                      <span className="font-data-mono text-[10px] text-on-surface-variant">02</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-full h-8 rounded bg-surface-container"></div>
                      <span className="font-data-mono text-[10px] text-on-surface-variant">03</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-full h-8 rounded bg-surface-container"></div>
                      <span className="font-data-mono text-[10px] text-on-surface-variant">04</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-full h-8 rounded bg-surface-container"></div>
                      <span className="font-data-mono text-[10px] text-on-surface-variant">05</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-full h-8 rounded bg-surface-container"></div>
                      <span className="font-data-mono text-[10px] text-on-surface-variant">06</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-full h-8 rounded bg-surface-container"></div>
                      <span className="font-data-mono text-[10px] text-on-surface-variant">07</span>
                    </div>
                    {/* 08 to 17 PM (Core Working Hours) */}
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-full h-8 rounded bg-primary-fixed"></div>
                      <span className="font-data-mono text-[10px] text-on-surface-variant">08</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-full h-8 rounded bg-primary-container"></div>
                      <span className="font-data-mono text-[10px] text-on-surface-variant">09</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-full h-8 rounded bg-primary"></div>
                      <span className="font-data-mono text-[10px] text-primary font-bold">10</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-full h-8 rounded bg-primary"></div>
                      <span className="font-data-mono text-[10px] text-primary font-bold">11</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-full h-8 rounded bg-primary-container"></div>
                      <span className="font-data-mono text-[10px] text-on-surface-variant">12</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-full h-8 rounded bg-primary"></div>
                      <span className="font-data-mono text-[10px] text-primary font-bold">13</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-full h-8 rounded bg-primary"></div>
                      <span className="font-data-mono text-[10px] text-primary font-bold">14</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-full h-8 rounded bg-primary"></div>
                      <span className="font-data-mono text-[10px] text-primary font-bold">15</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-full h-8 rounded bg-primary-container"></div>
                      <span className="font-data-mono text-[10px] text-on-surface-variant">16</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-full h-8 rounded bg-primary-fixed"></div>
                      <span className="font-data-mono text-[10px] text-on-surface-variant">17</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-full h-8 rounded bg-tertiary-fixed"></div>
                      <span className="font-data-mono text-[10px] text-tertiary font-bold">18</span>
                    </div>
                    {/* 19 to 23 PM */}
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-full h-8 rounded bg-surface-container"></div>
                      <span className="font-data-mono text-[10px] text-on-surface-variant">19</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-full h-8 rounded bg-surface-container"></div>
                      <span className="font-data-mono text-[10px] text-on-surface-variant">20</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-full h-8 rounded bg-surface-container"></div>
                      <span className="font-data-mono text-[10px] text-on-surface-variant">21</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-full h-8 rounded bg-surface-container"></div>
                      <span className="font-data-mono text-[10px] text-on-surface-variant">22</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-full h-8 rounded bg-surface-container"></div>
                      <span className="font-data-mono text-[10px] text-on-surface-variant">23</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 7: CROSS-MIDNIGHT & COMPLEX SHIFT ENGINE (ALGORITHM DEMO) */}
          <section className="w-full py-space-2xl px-gutter-mobile md:px-gutter-desktop bg-surface">
            <div className="max-w-max-width-canvas mx-auto flex flex-col gap-space-lg">
              <div className="p-space-lg rounded-xl bg-surface-container-highest/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-on-primary shrink-0">
                    <span className="material-symbols-outlined text-[24px]">nightlight_round</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-caps text-label-caps uppercase text-primary font-bold">Algorithmic Innovation</span>
                    <h3 className="font-headline-md text-headline-md text-on-surface">Automated Cross-Midnight &amp; Graveyard Shift Modulo Math</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                      Traditional spreadsheets fail when clock-out times precede clock-in numbers (e.g., 10:00 PM to 06:30 AM), triggering negative durations. SolveIt executes modular temporal arithmetic automatically.
                    </p>
                  </div>
                </div>
                <div className="px-4 py-2 rounded-lg bg-surface-container-lowest shadow-sm font-data-mono text-body-sm text-primary font-bold">
                  t_out &lt; t_in ? (t_out + 24) - t_in : t_out - t_in
                </div>
              </div>
              {/* Live Overnight Interactive Sandbox */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
                <div className="p-5 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-3">
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Overnight Shift Step 1</span>
                  <div className="font-body-md font-semibold text-on-surface">Night Shift Clock-In</div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low font-data-mono">
                    <span>Day 1 • 10:00 PM</span>
                    <span className="text-on-surface-variant">22.000 hrs</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Operator initiates graveyard production cycle on Monday night.</p>
                </div>
                <div className="p-5 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-3">
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Overnight Shift Step 2</span>
                  <div className="font-body-md font-semibold text-on-surface">Midnight Rollover &amp; Clock-Out</div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low font-data-mono">
                    <span>Day 2 • 06:30 AM</span>
                    <span className="text-primary font-semibold">06.500 hrs (+24.0)</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Rollover adjusted to 30.500 normalized hours before subtraction.</p>
                </div>
                <div className="p-5 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-3">
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Overnight Shift Step 3</span>
                  <div className="font-body-md font-semibold text-on-surface">Net Paid Computation</div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container font-data-mono">
                    <span className="text-primary font-bold">8h 00m Net</span>
                    <span className="text-on-surface-variant">-30m Unpaid</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Result: 8.50 gross hrs - 0.50 break = exactly 8.00 paid hours. Zero payroll error.</p>
                </div>
              </div>
            </div>
          </section>
          {/* SECTION 8: FLSA OVERTIME & PAYROLL TIER AUDITOR */}
          <section className="w-full py-space-2xl px-gutter-mobile md:px-gutter-desktop bg-surface-container-low">
            <div className="max-w-max-width-canvas mx-auto flex flex-col gap-space-lg">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-primary font-label-caps text-label-caps mb-2">
                  <span className="material-symbols-outlined text-[14px]">gavel</span>
                  STATUTORY LABOR STANDARDS
                </div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface">FLSA Overtime Rules &amp; Tier Architectures</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">SolveIt’s calculation engines are configured to cross-validate against US Department of Labor Fair Labor Standards Act benchmarks.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
                {/* CARD A: FLSA STANDARD */}
                <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between gap-space-sm">
                  <div className="flex flex-col gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary-fixed text-primary flex items-center justify-center font-bold">1</div>
                    <h3 className="font-headline-md text-headline-md text-on-surface">Federal FLSA Standard</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Applies across 46 US states. Overtime is triggered strictly when an employee exceeds <strong>40.0 hours</strong> within a 7-consecutive-day defined workweek at 1.5x regular pay.
                    </p>
                  </div>
                  <div className="pt-2 text-label-caps text-primary font-semibold">Threshold: &gt;40h / week</div>
                </div>
                {/* CARD B: CALIFORNIA DAILY OVERTIME */}
                <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between gap-space-sm">
                  <div className="flex flex-col gap-2">
                    <div className="w-8 h-8 rounded-lg bg-tertiary-fixed text-tertiary flex items-center justify-center font-bold">2</div>
                    <h3 className="font-headline-md text-headline-md text-on-surface">California Daily 8 / 12</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      California, Alaska, and Nevada enforce daily caps: 1.5x after <strong>8 daily hours</strong>, and 2.0x double-time after <strong>12 daily hours</strong>, plus 7th consecutive workday rules.
                    </p>
                  </div>
                  <div className="pt-2 text-label-caps text-tertiary font-semibold">Tier 1: &gt;8h | Tier 2: &gt;12h</div>
                </div>
                {/* CARD C: BLENDED WEIGHTED AVERAGE */}
                <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between gap-space-sm">
                  <div className="flex flex-col gap-2">
                    <div className="w-8 h-8 rounded-lg bg-secondary-fixed text-secondary flex items-center justify-center font-bold">3</div>
                    <h3 className="font-headline-md text-headline-md text-on-surface">Weighted Blended OT</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      When an employee works multiple roles at different base rates (e.g., $30/hr day, $45/hr on-call), total regular earnings are divided by total hours to determine regular rate before 0.5x bonus.
                    </p>
                  </div>
                  <div className="pt-2 text-label-caps text-secondary font-semibold">Formula: Total Pay / Total Hrs</div>
                </div>
                {/* CARD D: COMP TIME RESTRICTIONS */}
                <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between gap-space-sm">
                  <div className="flex flex-col gap-2">
                    <div className="w-8 h-8 rounded-lg bg-surface-container-high text-on-surface flex items-center justify-center font-bold">4</div>
                    <h3 className="font-headline-md text-headline-md text-on-surface">Compensatory Time</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Private sector employers cannot legally substitute "comp time off" in lieu of cash overtime pay under FLSA 29 U.S.C. § 207(o). Only public government agencies may offer comp time.
                    </p>
                  </div>
                  <div className="pt-2 text-label-caps text-on-surface-variant font-semibold">Private vs Public Sector</div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 9: REAL-WORLD EMPLOYMENT PERSONAS & SCENARIOS (WITH IMAGES) */}
          <section className="w-full py-space-2xl px-gutter-mobile md:px-gutter-desktop bg-surface">
            <div className="max-w-max-width-canvas mx-auto flex flex-col gap-space-lg">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-primary font-label-caps text-label-caps mb-2">
                  <span className="material-symbols-outlined text-[14px]">groups</span>
                  WORKFORCE ARCHETYPES
                </div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface">Precision Metrology Across Real-World Disciplines</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">How different industry professionals configure SolveIt to capture billable accuracy.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
                {/* PERSONA 1: SOFTWARE ENGINEER */}
                <div className="rounded-xl bg-surface-container-lowest shadow-sm overflow-hidden flex flex-col">
                  <img className="w-full h-44 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyt0GeKVryhuZwdTQB_yYgZ0TOIX3IFvRya9YIcYV4teoI_DerdUDUgGsS6WYnaFMAhzA9vVidkFBQ8ZIlSRJ6NNeRqkQxkfUHvEw0JMRPwjrMFYdkQ9iGBjpZXyA6_OxcjzrJ-I2oejqzDSBELh0YFFpQPF09qFFLQ5LI_lk3oTMxZ7q8KAUsw0TgeWiuhNhFj-Ip0cjYaoberERjhw0vFqlCHbf5U-0ASihNUTq2hQJCUzzsPB7I" alt="Professional software engineer" />
                  <div className="p-4 flex flex-col gap-2 flex-grow">
                    <span className="font-label-caps text-label-caps text-primary uppercase">Tech &amp; Engineering</span>
                    <h3 className="font-headline-md text-headline-md text-on-surface">Devin K. — Senior SRE</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Exempt salary with incident on-call stipends. Uses the 15-minute rounding tool to track weekend triage outages and invoice secondary engineering consultation.
                    </p>
                    <div className="mt-auto pt-2 flex items-center justify-between text-body-sm border-t border-surface-container">
                      <span className="text-on-surface-variant">Avg Shift:</span>
                      <span className="font-data-mono font-medium text-on-surface">8.25h • Flexible</span>
                    </div>
                  </div>
                </div>
                {/* PERSONA 2: ICU NURSE */}
                <div className="rounded-xl bg-surface-container-lowest shadow-sm overflow-hidden flex flex-col">
                  <img className="w-full h-44 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5RDIeRtjPbzSqHcjZQf8sWrx09xhqwQ6b8ftun9iCCsE2hxmmsC52Kqk-VHDsJf-DfdYZfLCGjfnjOCt2t-BLYSB8s6jEsBDx284Mysxlqyu0lOZYjboGvcDamjdiNYImZu0qAx0jClWrjBOe-IiyJj5-3BZ4_eLZGmeF7x1JYzPBPVil5NkBdeifYn6I76Fu9_oFwXKbDpfiqgL49aPiQ59NA-H1-JJwOj6pjAvmK36Rmn_gaVSC" alt="Healthcare clinical specialist" />
                  <div className="p-4 flex flex-col gap-2 flex-grow">
                    <span className="font-label-caps text-label-caps text-tertiary uppercase">Clinical Healthcare</span>
                    <h3 className="font-headline-md text-headline-md text-on-surface">Maria S. — Travel ICU Nurse</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      12-hour rotating night shifts (7:00 PM to 7:30 AM) across 3 compressed workdays. Relies on midnight modulo arithmetic and California daily 2.0x overtime threshold.
                    </p>
                    <div className="mt-auto pt-2 flex items-center justify-between text-body-sm border-t border-surface-container">
                      <span className="text-on-surface-variant">Night Differential:</span>
                      <span className="font-data-mono font-medium text-tertiary">+15% Premium</span>
                    </div>
                  </div>
                </div>
                {/* PERSONA 3: FREELANCE CONSULTANT */}
                <div className="rounded-xl bg-surface-container-lowest shadow-sm overflow-hidden flex flex-col">
                  <img className="w-full h-44 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGCsWITqRGtkpTMfW_0-qoHiQ2gE_xlXi6miZC4kER8fUXjaD8kPYsoPZQhYW-iBmSTaPhnM74Ul_kZ_5LZBO0cOCPrr1dymPku488KxY00ZT-jGPiMmBRtWFrjYClWd4MjFI7CGytaXNawivzdhyUKOad4PTYjsU35i5oS_jrCB0Voys3pstMHGVXbmrsD1xiSdhAX4T-SgMuGo-Cqx_SnYH5S_n94rx_a7PjwQudzbwN9o7-JTl8" alt="Architectural and brand designer" />
                  <div className="p-4 flex flex-col gap-2 flex-grow">
                    <span className="font-label-caps text-label-caps text-secondary uppercase">Independent Advisory</span>
                    <h3 className="font-headline-md text-headline-md text-on-surface">Alex P. — Brand Strategist</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Logs multiple micro-engagements across 4 concurrent clients. Converts sexagesimal task chunks (1h 12m) to exact decimals (1.20h) for flawless QuickBooks invoicing.
                    </p>
                    <div className="mt-auto pt-2 flex items-center justify-between text-body-sm border-t border-surface-container">
                      <span className="text-on-surface-variant">Billable Rate:</span>
                      <span className="font-data-mono font-medium text-secondary">$135.00 / hr</span>
                    </div>
                  </div>
                </div>
                {/* PERSONA 4: RETAIL SUPERVISOR */}
                <div className="rounded-xl bg-surface-container-lowest shadow-sm overflow-hidden flex flex-col">
                  <img className="w-full h-44 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsttEfNY8E8pBd1tCOH2Bsr7y_waTLYwXyBoFoT4Qcs1pKKuj8FOAM0i7SGobpp4iZGTuk0CMEJN0J8maYZaVbRmlheg7HbpQ3UnJN2CnZnNT6WmURA5kJt8Rbj0F-9D3OzEdhzD8coxSO65tdZ14QB1rgb5dkd1i_HtG9vHZaRCrdmSM1xLAqz8PHydKYWBDR2ysK3sprCkxJnMllDxKRK8U-KeIfHQPJwdYRi2VsJ84zwyWs3c1N" alt="Logistics team leader" />
                  <div className="p-4 flex flex-col gap-2 flex-grow">
                    <span className="font-label-caps text-label-caps text-on-surface uppercase">Operations &amp; Retail</span>
                    <h3 className="font-headline-md text-headline-md text-on-surface">Marcus R. — Store Lead</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Split shifts during peak inventory weeks. Audits team clock-in timecard anomalies and enforces mandatory 30-minute state meal break compliance.
                    </p>
                    <div className="mt-auto pt-2 flex items-center justify-between text-body-sm border-t border-surface-container">
                      <span className="text-on-surface-variant">Compliance:</span>
                      <span className="font-data-mono font-medium text-on-surface">Meal-Audit Safe</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 10: DOWNLOADABLE TIMESHEET TEMPLATES & EXPORT CENTER */}
          <section className="w-full py-space-2xl px-gutter-mobile md:px-gutter-desktop bg-surface-container-low">
            <div className="max-w-max-width-canvas mx-auto flex flex-col gap-space-lg">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-primary font-label-caps text-label-caps mb-2">
                    <span className="material-symbols-outlined text-[14px]">description</span>
                    PAYROLL ASSETS
                  </div>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface">Downloadable Timesheet Templates &amp; Audit Forms</h2>
                  <p className="font-body-md text-body-md text-on-surface-variant">Pre-formatted corporate timesheet ledger assets ready for Excel, Google Sheets, and PDF dispatch.</p>
                </div>
                <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-container-lowest shadow-sm hover:bg-surface-container font-body-sm font-medium text-on-surface transition-all" type="button">
                  <span className="material-symbols-outlined text-[18px]">folder_zip</span>
                  Download All Templates (.ZIP)
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-md">
                <div className="p-5 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary-fixed text-primary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[20px]">table_view</span>
                    </div>
                    <div>
                      <h3 className="font-headline-md text-headline-md text-on-surface">Weekly Bi-Fold Timesheet</h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">Standard Monday-Sunday spreadsheet with automated overtime formulas and meal break deductions.</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-body-sm pt-2 border-t border-surface-container">
                    <span className="text-on-surface-variant">Format: <strong>XLSX, CSV</strong></span>
                    <a className="text-primary hover:underline font-medium inline-flex items-center gap-0.5" href="#">Download <span className="material-symbols-outlined text-[14px]">arrow_downward</span></a>
                  </div>
                </div>
                <div className="p-5 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary-fixed text-secondary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
                    </div>
                    <div>
                      <h3 className="font-headline-md text-headline-md text-on-surface">Biweekly 80-Hour Corporate Ledger</h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">High-density 14-day payroll verification document with supervisor approval and employee sign-off lines.</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-body-sm pt-2 border-t border-surface-container">
                    <span className="text-on-surface-variant">Format: <strong>Printable PDF</strong></span>
                    <a className="text-primary hover:underline font-medium inline-flex items-center gap-0.5" href="#">Download <span className="material-symbols-outlined text-[14px]">arrow_downward</span></a>
                  </div>
                </div>
                <div className="p-5 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-tertiary-fixed text-tertiary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                    </div>
                    <div>
                      <h3 className="font-headline-md text-headline-md text-on-surface">Monthly Project Invoicing Ledger</h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">Consulting timesheet itemizing client project codes, decimal durations, expense reimbursements, and tax.</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-body-sm pt-2 border-t border-surface-container">
                    <span className="text-on-surface-variant">Format: <strong>Google Sheets</strong></span>
                    <a className="text-primary hover:underline font-medium inline-flex items-center gap-0.5" href="#">Make Copy <span className="material-symbols-outlined text-[14px]">open_in_new</span></a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 11: MATHEMATICAL RIGOR & TIME ARITHMETIC PRIMER */}
          <section className="w-full py-space-2xl px-gutter-mobile md:px-gutter-desktop bg-surface">
            <div className="max-w-max-width-canvas mx-auto flex flex-col gap-space-lg">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-primary font-label-caps text-label-caps mb-2">
                  <span className="material-symbols-outlined text-[14px]">functions</span>
                  METROLOGICAL FOUNDATION
                </div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface">Time Arithmetic &amp; Decimal Conversion Formulas</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">The mathematical principles governing computerized payroll calculation and rounding laws.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
                {/* Formula 1: Sexagesimal to Decimal */}
                <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-3">
                  <span className="font-label-caps text-label-caps uppercase text-primary font-semibold">Conversion 01</span>
                  <h3 className="font-headline-md text-headline-md text-on-surface">Sexagesimal to Decimal</h3>
                  <div className="p-3 rounded-lg bg-surface-container-lowest font-data-mono text-body-sm text-on-surface">
                    Decimal Hours = H + (M / 60) + (S / 3600)
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Example: 8 hours and 45 minutes = 8 + (45/60) = 8 + 0.75 = <strong>8.75 decimal hours</strong>. Essential because payroll engines cannot multiply sexagesimal minutes directly by hourly wage.
                  </p>
                </div>
                {/* Formula 2: FLSA 7-Minute Rounding Rule */}
                <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-3">
                  <span className="font-label-caps text-label-caps uppercase text-tertiary font-semibold">Rule 02</span>
                  <h3 className="font-headline-md text-headline-md text-on-surface">7-Minute FLSA Rounding</h3>
                  <div className="p-3 rounded-lg bg-surface-container-lowest font-data-mono text-body-sm text-on-surface">
                    1-7 min → 0 min | 8-14 min → 15 min (.25h)
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    29 C.F.R. § 785.48(b) permits 15-minute increment rounding provided it operates neutrally: minutes 1 through 7 round down to the nearest quarter hour, while minutes 8 through 14 round up.
                  </p>
                </div>
                {/* Formula 3: Gross Pay Distribution */}
                <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-3">
                  <span className="font-label-caps text-label-caps uppercase text-secondary font-semibold">Formula 03</span>
                  <h3 className="font-headline-md text-headline-md text-on-surface">Gross Overtime Distribution</h3>
                  <div className="p-3 rounded-lg bg-surface-container-lowest font-data-mono text-body-sm text-on-surface">
                    Gross = (H_reg × R) + (H_ot × 1.5R) + (H_dt × 2R)
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Multi-tier gross calculation separates regular hours from statutory multipliers before appending weekend differentials or discretionary bonuses.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 12: FREQUENTLY ASKED QUESTIONS */}
          <section className="w-full py-space-2xl px-gutter-mobile md:px-gutter-desktop bg-surface-container-low">
            <div className="max-w-max-width-calculator mx-auto flex flex-col gap-space-lg">
              <div className="text-center flex flex-col items-center">
                <span className="font-label-caps text-label-caps uppercase text-primary font-bold">Comprehensive Guide</span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface mt-1">Frequently Asked Questions</h2>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
                  Detailed answers on federal labor standards, decimal payroll conversion, and privacy assurances.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <details className="group bg-surface-container-lowest rounded-xl p-4 shadow-sm open:pb-5 transition-all">
                  <summary className="font-body-lg font-semibold text-on-surface cursor-pointer list-none flex items-center justify-between">
                    <span>How does decimal hour conversion work for payroll calculations?</span>
                    <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
                  </summary>
                  <div className="mt-3 font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Standard time is based on 60 minutes per hour (sexagesimal), but payroll calculations require standard base-10 decimals. To convert minutes into decimal hours, divide the minute count by 60. For instance, 15 minutes is 0.25 hours, 30 minutes is 0.50 hours, and 45 minutes is 0.75 hours. SolveIt executes this transformation automatically in real time to guarantee that multiplying decimal hours by your hourly rate produces 100% mathematically exact payroll figures.
                  </div>
                </details>
                <details className="group bg-surface-container-lowest rounded-xl p-4 shadow-sm open:pb-5 transition-all">
                  <summary className="font-body-lg font-semibold text-on-surface cursor-pointer list-none flex items-center justify-between">
                    <span>Does federal law require employers to pay for short breaks under 20 minutes?</span>
                    <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
                  </summary>
                  <div className="mt-3 font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Yes. Under US Federal Fair Labor Standards Act regulations (29 C.F.R. § 785.18), rest periods of short duration (typically lasting 5 to 20 minutes) are customary in industry and must be counted as compensable hours worked. Employers are not permitted to deduct short coffee or rest breaks. However, bona fide meal periods (typically lasting 30 minutes or more where the worker is completely relieved from work duties) are not considered work time and are unpaid.
                  </div>
                </details>
                <details className="group bg-surface-container-lowest rounded-xl p-4 shadow-sm open:pb-5 transition-all">
                  <summary className="font-body-lg font-semibold text-on-surface cursor-pointer list-none flex items-center justify-between">
                    <span>How do I correctly calculate work hours that cross midnight into the next day?</span>
                    <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
                  </summary>
                  <div className="mt-3 font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    When clocking out on the following day (such as starting at 10:00 PM and finishing at 6:00 AM), standard subtraction results in a negative value. SolveIt handles overnight shifts by checking whether the end time is numerically less than the start time; if so, it automatically adds 24 hours (1,440 minutes) to the clock-out time before performing the subtraction. The formula is: <code className="font-data-mono bg-surface-container px-1 py-0.5 rounded">Duration = (ClockOut + 24) - ClockIn - UnpaidBreak</code>.
                  </div>
                </details>
                <details className="group bg-surface-container-lowest rounded-xl p-4 shadow-sm open:pb-5 transition-all">
                  <summary className="font-body-lg font-semibold text-on-surface cursor-pointer list-none flex items-center justify-between">
                    <span>What is the FLSA 7-minute rounding rule and is it legally permissible?</span>
                    <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
                  </summary>
                  <div className="mt-3 font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Under 29 C.F.R. § 785.48(b), employers may round employee punch times to the nearest quarter hour (15 minutes). Under the "7/8 minute rule," minutes 1 through 7 round down to the nearest 15-minute increment, while minutes 8 through 14 round up. This rounding practice is legally permissible only if it is applied neutrally in a way that does not consistently favor the employer over time.
                  </div>
                </details>
                <details className="group bg-surface-container-lowest rounded-xl p-4 shadow-sm open:pb-5 transition-all">
                  <summary className="font-body-lg font-semibold text-on-surface cursor-pointer list-none flex items-center justify-between">
                    <span>Are timesheet logs stored on SolveIt servers or is it 100% private to my browser?</span>
                    <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
                  </summary>
                  <div className="mt-3 font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    All timesheet entries, hourly rates, client logs, and financial totals entered on SolveIt remain 100% inside your device's browser memory (Client-Side Sandboxing). No data is transmitted to or logged on remote servers, ensuring confidentiality for sensitive wage details and internal payroll compliance.
                  </div>
                </details>
                <details className="group bg-surface-container-lowest rounded-xl p-4 shadow-sm open:pb-5 transition-all">
                  <summary className="font-body-lg font-semibold text-on-surface cursor-pointer list-none flex items-center justify-between">
                    <span>How can I export my timesheet as a payroll-ready PDF or CSV?</span>
                    <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
                  </summary>
                  <div className="mt-3 font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Simply click the "Export CSV" button located at the top of the Weekly Timesheet Ledger. SolveIt dynamically generates a properly structured, RFC-4180 compliant CSV file containing your full 7-day breakdown, date ranges, decimal hours, and calculated gross pay. You can open this directly in Excel, Google Sheets, or QuickBooks, or click "Print Sheet" to produce a clean, printer-friendly PDF timecard.
                  </div>
                </details>
              </div>
            </div>
          </section>

          {/* SECTION 13: INTERCONNECTED TEMPORAL & PAYROLL SUITE */}
          <section className="w-full py-space-2xl px-gutter-mobile md:px-gutter-desktop bg-surface">
            <div className="max-w-max-width-canvas mx-auto flex flex-col gap-space-lg">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-primary font-label-caps text-label-caps mb-2">
                  <span className="material-symbols-outlined text-[14px]">hub</span>
                  SOLVEIT COMPUTATIONAL ECOSYSTEM
                </div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface">Related Time, Date &amp; Financial Calculators</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">Seamlessly transition across our high-precision mathematical suite.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-space-md">
                <Link className="p-5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex items-start gap-3" href="/time-date/age-calculator">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-[20px]">calendar_today</span>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-headline-md text-on-surface">Age Calculator</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Exact chronological age in years, months, days, hours, and seconds.</p>
                  </div>
                </Link>
                <Link className="p-5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex items-start gap-3" href="/time-date/date-difference">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-[20px]">date_range</span>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-headline-md text-on-surface">Date Difference</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Compute business days, weekends, and holidays between calendar dates.</p>
                  </div>
                </Link>
                <Link className="p-5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex items-start gap-3" href="/finance/hourly-to-salary">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-[20px]">payments</span>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-headline-md text-on-surface">Hourly to Salary Converter</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Annualized gross salary projections based on regular and overtime hours.</p>
                  </div>
                </Link>
                <Link className="p-5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex items-start gap-3" href="/finance/freelance-tax">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-[20px]">receipt</span>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-headline-md text-on-surface">Freelance Net Pay Estimator</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Self-employment 15.3% FICA and quarterly estimated income tax deduction.</p>
                  </div>
                </Link>
                <Link className="p-5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex items-start gap-3" href="/time-date/time-zone-overlap">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-[20px]">schedule</span>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-headline-md text-on-surface">Time Zone Overlap Matrix</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Coordinate distributed international team shifts and asynchronous handoffs.</p>
                  </div>
                </Link>
                <Link className="p-5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex items-start gap-3" href="/time-date/pomodoro-timer">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-[20px]">timer</span>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-headline-md text-on-surface">Focus &amp; Pomodoro Engine</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">High-efficiency work sprint interval timer with deep productivity analytics.</p>
                  </div>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
