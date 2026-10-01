'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Calendar, Clock, Briefcase, Globe, ArrowRight, RefreshCw } from 'lucide-react';

export default function InteractiveWorkbench() {
  const [activeTab, setActiveTab] = useState<'age' | 'days' | 'work' | 'timezone'>('age');

  // Tool 1: Age
  const [birthDate, setBirthDate] = useState('1996-05-14');
  const [targetDate, setTargetDate] = useState(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  });

  // Tool 2: Days Between
  const [startDate, setStartDate] = useState('2026-01-01');
  const [endDate, setEndDate] = useState('2026-12-31');
  const [isInclusive, setIsInclusive] = useState(false);

  // Tool 3: Work Hours
  const [workStart, setWorkStart] = useState('09:00');
  const [workEnd, setWorkEnd] = useState('17:30');
  const [unpaidBreak, setUnpaidBreak] = useState('30');

  // Tool 4: Time Zone Slider (UTC hour 0-23)
  const [utcHour, setUtcHour] = useState(13); // 13:00 UTC = 9:00 AM EDT, 2:00 PM BST, 10:00 PM JST

  // Calculations:
  const ageResult = useMemo(() => {
    if (!birthDate || !targetDate) return null;
    const b = new Date(birthDate + 'T00:00:00');
    const t = new Date(targetDate + 'T00:00:00');
    if (isNaN(b.getTime()) || isNaN(t.getTime()) || b > t) return null;

    let years = t.getFullYear() - b.getFullYear();
    let months = t.getMonth() - b.getMonth();
    let days = t.getDate() - b.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(t.getFullYear(), t.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const diffMs = t.getTime() - b.getTime();
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    // Next birthday
    const thisYearBday = new Date(t.getFullYear(), b.getMonth(), b.getDate());
    let nextBday = thisYearBday;
    if (thisYearBday < t) {
      nextBday = new Date(t.getFullYear() + 1, b.getMonth(), b.getDate());
    }
    const daysToNextBday = Math.ceil((nextBday.getTime() - t.getTime()) / (1000 * 60 * 60 * 24));

    return { years, months, days, totalDays, daysToNextBday };
  }, [birthDate, targetDate]);

  const daysResult = useMemo(() => {
    if (!startDate || !endDate) return null;
    const s = new Date(startDate + 'T00:00:00');
    const e = new Date(endDate + 'T00:00:00');
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return null;

    const diffTime = e.getTime() - s.getTime();
    let totalDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    if (isInclusive && totalDays >= 0) totalDays += 1;

    const weeks = Math.floor(Math.abs(totalDays) / 7);
    const remDays = Math.abs(totalDays) % 7;

    return { totalDays, weeks, remDays };
  }, [startDate, endDate, isInclusive]);

  const workResult = useMemo(() => {
    const [startH, startM] = workStart.split(':').map(Number);
    const [endH, endM] = workEnd.split(':').map(Number);
    const breakMin = parseInt(unpaidBreak, 10) || 0;

    let startTotal = startH * 60 + startM;
    let endTotal = endH * 60 + endM;

    // Overnight shift handling
    if (endTotal < startTotal) {
      endTotal += 24 * 60;
    }

    const grossMins = Math.max(0, endTotal - startTotal);
    const netMins = Math.max(0, grossMins - breakMin);

    const hours = Math.floor(netMins / 60);
    const mins = netMins % 60;
    const decimalHours = (netMins / 60).toFixed(2);

    return { hours, mins, decimalHours, grossHours: (grossMins / 60).toFixed(2) };
  }, [workStart, workEnd, unpaidBreak]);

  const tzCities = useMemo(() => {
    const formatHour = (utcH: number, offset: number) => {
      let localH = (utcH + offset + 24) % 24;
      const period = localH >= 12 ? 'PM' : 'AM';
      let displayH = localH % 12;
      if (displayH === 0) displayH = 12;
      const isWorking = localH >= 9 && localH < 17;
      return { localH, displayH: `${displayH}:00 ${period}`, isWorking };
    };

    return [
      { name: 'San Francisco (PT)', offset: -7, ...formatHour(utcHour, -7) },
      { name: 'New York (ET)', offset: -4, ...formatHour(utcHour, -4) },
      { name: 'London (BST/GMT)', offset: 1, ...formatHour(utcHour, 1) },
      { name: 'Tokyo (JST)', offset: 9, ...formatHour(utcHour, 9) },
      { name: 'Sydney (AEST)', offset: 10, ...formatHour(utcHour, 10) },
    ];
  }, [utcHour]);

  return (
    <section className="w-full bg-surface-container-low py-12 sm:py-16 border-b border-outline-variant/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Quick Interactive Calculators
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight mt-1">
            Calculate Instantly Right Here
          </h2>
          <p className="text-sm sm:text-base text-on-surface-variant mt-1">
            Perform everyday calculations immediately or click through to our dedicated full-feature tools.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <button
            onClick={() => setActiveTab('age')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'age'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Age Calculator</span>
          </button>
          <button
            onClick={() => setActiveTab('days')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'days'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Days Between Dates</span>
          </button>
          <button
            onClick={() => setActiveTab('work')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'work'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Work Hours</span>
          </button>
          <button
            onClick={() => setActiveTab('timezone')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'timezone'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Time Zone Overlap</span>
          </button>
        </div>

        {/* Tab Panels */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 sm:p-8 border border-outline-variant/40 shadow-sm">
          {/* TAB 1: AGE */}
          {activeTab === 'age' && (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-surface-container-low border border-outline-variant/50 rounded-xl text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">
                    Age at Target Date
                  </label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-surface-container-low border border-outline-variant/50 rounded-xl text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {ageResult && (
                <div className="p-5 rounded-xl bg-primary/5 border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-primary font-bold">
                      Calculated Chronological Age
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-on-surface mt-1">
                      {ageResult.years} <span className="text-base font-normal text-on-surface-variant">years,</span>{' '}
                      {ageResult.months} <span className="text-base font-normal text-on-surface-variant">months,</span>{' '}
                      {ageResult.days} <span className="text-base font-normal text-on-surface-variant">days</span>
                    </div>
                    <div className="text-xs text-on-surface-variant mt-1.5 flex flex-wrap gap-x-4">
                      <span>Total days lived: <strong>{ageResult.totalDays.toLocaleString()} days</strong></span>
                      <span>Next birthday: <strong>{ageResult.daysToNextBday} days away</strong></span>
                    </div>
                  </div>
                  <Link
                    href="/time-date/age-calculator"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-on-primary text-xs font-semibold shrink-0 hover:bg-primary/90 transition-all"
                  >
                    <span>Full Age Breakdown</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DAYS BETWEEN */}
          {activeTab === 'days' && (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-surface-container-low border border-outline-variant/50 rounded-xl text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-surface-container-low border border-outline-variant/50 rounded-xl text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="mb-6 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="inclusive-check"
                  checked={isInclusive}
                  onChange={(e) => setIsInclusive(e.target.checked)}
                  className="rounded border-outline-variant text-primary focus:ring-primary"
                />
                <label htmlFor="inclusive-check" className="text-xs font-medium text-on-surface cursor-pointer">
                  Include end date in calculation (Inclusive count)
                </label>
              </div>

              {daysResult && (
                <div className="p-5 rounded-xl bg-primary/5 border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-primary font-bold">
                      Calculated Calendar Interval
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-on-surface mt-1">
                      {daysResult.totalDays} <span className="text-base font-normal text-on-surface-variant">days</span>
                    </div>
                    <div className="text-xs text-on-surface-variant mt-1.5">
                      Equivalent to {daysResult.weeks} weeks and {daysResult.remDays} days
                      ({isInclusive ? 'Both start and end dates included' : 'Exclusive of start date'})
                    </div>
                  </div>
                  <Link
                    href="/time-date/days-between-dates"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-on-primary text-xs font-semibold shrink-0 hover:bg-primary/90 transition-all"
                  >
                    <span>Full Interval &amp; Workdays</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: WORK HOURS */}
          {activeTab === 'work' && (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">
                    Shift Start Time
                  </label>
                  <input
                    type="time"
                    value={workStart}
                    onChange={(e) => setWorkStart(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-surface-container-low border border-outline-variant/50 rounded-xl text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">
                    Shift End Time
                  </label>
                  <input
                    type="time"
                    value={workEnd}
                    onChange={(e) => setWorkEnd(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-surface-container-low border border-outline-variant/50 rounded-xl text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">
                    Unpaid Break (Minutes)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="5"
                    value={unpaidBreak}
                    onChange={(e) => setUnpaidBreak(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-surface-container-low border border-outline-variant/50 rounded-xl text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {workResult && (
                <div className="p-5 rounded-xl bg-primary/5 border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-primary font-bold">
                      Calculated Payable Work Time
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-on-surface mt-1">
                      {workResult.hours}h {workResult.mins}m{' '}
                      <span className="text-base font-normal text-on-surface-variant">
                        ({workResult.decimalHours} decimal hours)
                      </span>
                    </div>
                    <div className="text-xs text-on-surface-variant mt-1.5">
                      Gross elapsed shift: {workResult.grossHours} hours with {unpaidBreak || 0}m deducted lunch
                    </div>
                  </div>
                  <Link
                    href="/time-date/work-hours"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-on-primary text-xs font-semibold shrink-0 hover:bg-primary/90 transition-all"
                  >
                    <span>Full Overtime &amp; Pay Calculator</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: TIME ZONE */}
          {activeTab === 'timezone' && (
            <div>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-on-surface">
                    Adjust Universal Reference Time (UTC)
                  </label>
                  <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                    {utcHour.toString().padStart(2, '0')}:00 UTC
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="23"
                  value={utcHour}
                  onChange={(e) => setUtcHour(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-on-surface-variant mt-1 font-mono">
                  <span>00:00</span>
                  <span>06:00</span>
                  <span>12:00</span>
                  <span>18:00</span>
                  <span>23:00</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4">
                {tzCities.map((city) => (
                  <div
                    key={city.name}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      city.isWorking
                        ? 'bg-primary/10 border-primary/40 text-on-surface'
                        : 'bg-surface-container-low border-outline-variant/30 text-on-surface-variant'
                    }`}
                  >
                    <div className="text-[11px] font-semibold truncate mb-1">
                      {city.name}
                    </div>
                    <div className="text-base font-extrabold text-on-surface">
                      {city.displayH}
                    </div>
                    <div className="text-[10px] mt-1 font-medium">
                      {city.isWorking ? (
                        <span className="text-primary font-bold">● Work Hours</span>
                      ) : (
                        <span className="text-on-surface-variant/70">○ Off Hours</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-outline-variant/20">
                <span className="text-xs text-on-surface-variant">
                  Green indicates standard working window (9:00 AM – 5:00 PM local time).
                </span>
                <Link
                  href="/time-date/time-zone-overlap"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-on-primary text-xs font-semibold shrink-0 hover:bg-primary/90 transition-all"
                >
                  <span>Open Meeting Scheduler</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
