'use client';

import React, { useState, useMemo } from 'react';
import { TimeToolDefinition } from '@/lib/time-date/types';
import {
  calculateTimeDuration,
  addSubtractTimeDurations,
  calculateBusinessDays,
  calculateDateDifference,
  addSubtractDate,
  calculateDetailedAge,
  isLeapYear,
  getDaysInMonth,
} from '@/lib/time-date/calculations';
import { Copy, Check, RotateCcw, Calendar, Clock, Sparkles } from 'lucide-react';

interface Props {
  tool: TimeToolDefinition;
}

export default function UniversalTimeCalculator({ tool }: Props) {
  const [copied, setCopied] = useState(false);

  // Form states
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:30');
  const [breakMinutes, setBreakMinutes] = useState('30');
  const [hourlyWage, setHourlyWage] = useState('25.00');

  // Multi-entry time durations
  const [timeRows, setTimeRows] = useState([
    { hours: 2, minutes: 45, seconds: 0 },
    { hours: 1, minutes: 30, seconds: 0 },
  ]);
  const [durationOp, setDurationOp] = useState<'add' | 'subtract'>('add');

  // Dates
  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [startDateStr, setStartDateStr] = useState('2026-01-01');
  const [endDateStr, setEndDateStr] = useState(todayStr);
  const [inclusive, setInclusive] = useState(false);
  const [excludeHolidays, setExcludeHolidays] = useState(true);

  // Age / Historical
  const [birthDateStr, setBirthDateStr] = useState('1998-05-15');
  const [targetDateStr, setTargetDateStr] = useState(todayStr);
  const [secondDobStr, setSecondDobStr] = useState('2001-08-20');

  // Year check
  const [checkYear, setCheckYear] = useState(new Date().getFullYear());

  // Month stats
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  // Copy helper
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Perform Calculation based on type
  const result = useMemo(() => {
    switch (tool.calculatorType) {
      case 'time-duration':
      case 'work-hours': {
        const dur = calculateTimeDuration(startTime, endTime, Number(breakMinutes) || 0);
        const wage = parseFloat(hourlyWage) || 0;
        const regHours = Math.min(dur.decimalHours, 8);
        const otHours = Math.max(0, dur.decimalHours - 8);
        const grossPay = regHours * wage + otHours * (wage * 1.5);
        return {
          primary: `${dur.hours} hrs ${dur.minutes} mins`,
          secondary: `${dur.decimalHours.toFixed(2)} decimal hours`,
          details: [
            { label: 'Total Elapsed', value: `${dur.hours}h ${dur.minutes}m ${dur.seconds}s` },
            { label: 'Decimal Hours', value: `${dur.decimalHours} hrs` },
            { label: 'Total Minutes', value: `${dur.totalMinutes} min` },
            { label: 'Total Seconds', value: `${dur.totalSeconds.toLocaleString()} s` },
            ...(wage > 0
              ? [
                  { label: 'Regular Pay (8h)', value: `$${(regHours * wage).toFixed(2)}` },
                  { label: 'Overtime Pay (1.5x)', value: `$${(otHours * wage * 1.5).toFixed(2)}` },
                  { label: 'Estimated Gross Pay', value: `$${grossPay.toFixed(2)}` },
                ]
              : []),
          ],
          copyValue: `${dur.hours} hrs ${dur.minutes} mins (${dur.decimalHours} decimal hours)`,
        };
      }

      case 'add-subtract-time': {
        const res = addSubtractTimeDurations(timeRows, durationOp);
        return {
          primary: res.formatted,
          secondary: `${(Math.abs(res.totalSeconds) / 3600).toFixed(2)} total decimal hours`,
          details: [
            { label: 'Formatted Duration', value: res.formatted },
            { label: 'Total Hours', value: `${res.hours} hrs` },
            { label: 'Total Minutes', value: `${res.minutes} mins` },
            { label: 'Total Seconds', value: `${res.seconds} secs` },
          ],
          copyValue: res.formatted,
        };
      }

      case 'average-time': {
        const totalSec = timeRows.reduce((acc, r) => acc + (r.hours * 3600 + r.minutes * 60 + r.seconds), 0);
        const avgSec = timeRows.length > 0 ? totalSec / timeRows.length : 0;
        const avgH = Math.floor(avgSec / 3600);
        const avgM = Math.floor((avgSec % 3600) / 60);
        const avgS = Math.round(avgSec % 60);
        const formatted = `${String(avgH).padStart(2, '0')}:${String(avgM).padStart(2, '0')}:${String(avgS).padStart(2, '0')}`;
        return {
          primary: formatted,
          secondary: `Average of ${timeRows.length} entries`,
          details: [
            { label: 'Mean Time (HH:MM:SS)', value: formatted },
            { label: 'Total Sum', value: `${(totalSec / 3600).toFixed(2)} hrs` },
            { label: 'Sample Entries', value: `${timeRows.length}` },
          ],
          copyValue: formatted,
        };
      }

      case 'business-days': {
        const d1 = new Date(startDateStr);
        const d2 = new Date(endDateStr);
        const bus = calculateBusinessDays(d1, d2, {
          holidays: excludeHolidays ? ['2026-01-01', '2026-07-04', '2026-12-25'] : [],
        });
        return {
          primary: `${bus.businessDays} Working Days`,
          secondary: `${bus.totalCalendarDays} Total Calendar Days`,
          details: [
            { label: 'Working Business Days', value: `${bus.businessDays} days` },
            { label: 'Weekend Days', value: `${bus.weekendDays} days` },
            { label: 'Holidays Excluded', value: `${bus.holidayDays} days` },
            { label: 'Total Calendar Days', value: `${bus.totalCalendarDays} days` },
          ],
          copyValue: `${bus.businessDays} Business Days`,
        };
      }

      case 'date-diff': {
        const d1 = new Date(startDateStr);
        const d2 = new Date(endDateStr);
        const diff = calculateDateDifference(d1, d2, inclusive);
        return {
          primary: `${diff.years} years, ${diff.months} months, ${diff.days} days`,
          secondary: `${diff.totalDays.toLocaleString()} total days (${diff.totalWeeks} weeks)`,
          details: [
            { label: 'Exact Breakdown', value: `${diff.years}Y ${diff.months}M ${diff.days}D` },
            { label: 'Total Calendar Days', value: `${diff.totalDays.toLocaleString()} days` },
            { label: 'Total Weeks', value: `${diff.totalWeeks} weeks` },
            { label: 'Total Elapsed Hours', value: `${diff.totalHours.toLocaleString()} hours` },
          ],
          copyValue: `${diff.years} years, ${diff.months} months, ${diff.days} days (${diff.totalDays} total days)`,
        };
      }

      case 'age':
      case 'how-old-was-i': {
        const dob = new Date(birthDateStr);
        const tgt = new Date(targetDateStr);
        const age = calculateDetailedAge(dob, tgt);
        return {
          primary: `${age.years} Years, ${age.months} Months, ${age.days} Days`,
          secondary: `Born on a ${age.dayOfWeekBorn} · Zodiac: ${age.zodiacSign}`,
          details: [
            { label: 'Chronological Age', value: `${age.years} yrs, ${age.months} mos, ${age.days} days` },
            { label: 'Total Days Lived', value: `${age.totalDays.toLocaleString()} days` },
            { label: 'Total Hours Lived', value: `${age.totalHours.toLocaleString()} hours` },
            { label: 'Next Birthday In', value: `${age.nextBirthdayDays} days` },
            { label: 'Zodiac Astrological Sign', value: age.zodiacSign },
            { label: 'Day of Week Born', value: age.dayOfWeekBorn },
          ],
          copyValue: `${age.years} Years, ${age.months} Months, ${age.days} Days`,
        };
      }

      case 'age-diff': {
        const dob1 = new Date(birthDateStr);
        const dob2 = new Date(secondDobStr);
        const diff = calculateDateDifference(dob1, dob2);
        const older = dob1 < dob2 ? 'Person 1 is older' : 'Person 2 is older';
        return {
          primary: `${diff.years} Years, ${diff.months} Months, ${diff.days} Days`,
          secondary: `${older} by ${diff.totalDays.toLocaleString()} days`,
          details: [
            { label: 'Age Difference', value: `${diff.years}Y ${diff.months}M ${diff.days}D` },
            { label: 'Total Days Gap', value: `${diff.totalDays.toLocaleString()} days` },
            { label: 'Total Weeks Gap', value: `${diff.totalWeeks} weeks` },
            { label: 'Relative Comparison', value: older },
          ],
          copyValue: `${diff.years} Years, ${diff.months} Months, ${diff.days} Days (${older})`,
        };
      }

      case 'leap-year': {
        const leap = isLeapYear(checkYear);
        const explanation = leap
          ? `${checkYear} is a LEAP YEAR (366 days). February has 29 days.`
          : `${checkYear} is a COMMON YEAR (365 days). February has 28 days.`;
        return {
          primary: leap ? 'Leap Year (366 Days)' : 'Common Year (365 Days)',
          secondary: explanation,
          details: [
            { label: 'Divisible by 4', value: checkYear % 4 === 0 ? 'Yes' : 'No' },
            { label: 'Century Year (/100)', value: checkYear % 100 === 0 ? 'Yes' : 'No' },
            { label: 'Divisible by 400', value: checkYear % 400 === 0 ? 'Yes' : 'No' },
            { label: 'Days in February', value: leap ? '29 days' : '28 days' },
            { label: 'Next Leap Year', value: `${Math.ceil((checkYear + 1) / 4) * 4}` },
          ],
          copyValue: `${checkYear}: ${leap ? 'Leap Year' : 'Common Year'}`,
        };
      }

      case 'month-calc': {
        const days = getDaysInMonth(selectedYear, selectedMonth);
        const d1 = new Date(selectedYear, selectedMonth, 1);
        const d2 = new Date(selectedYear, selectedMonth, days);
        const bus = calculateBusinessDays(d1, d2);
        const monthNames = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return {
          primary: `${days} Days in ${monthNames[selectedMonth]} ${selectedYear}`,
          secondary: `${bus.businessDays} Working Days · ${bus.weekendDays} Weekend Days`,
          details: [
            { label: 'Total Calendar Days', value: `${days} days` },
            { label: 'Standard Working Days', value: `${bus.businessDays} days` },
            { label: 'Weekend Days', value: `${bus.weekendDays} days` },
            { label: 'Standard Work Hours (8h)', value: `${bus.businessDays * 8} hours` },
          ],
          copyValue: `${monthNames[selectedMonth]} ${selectedYear}: ${days} days (${bus.businessDays} working days)`,
        };
      }

      default: {
        return {
          primary: 'Ready',
          secondary: 'Configure inputs below',
          details: [],
          copyValue: '',
        };
      }
    }
  }, [
    tool.calculatorType,
    startTime,
    endTime,
    breakMinutes,
    hourlyWage,
    timeRows,
    durationOp,
    startDateStr,
    endDateStr,
    inclusive,
    excludeHolidays,
    birthDateStr,
    targetDateStr,
    secondDobStr,
    checkYear,
    selectedYear,
    selectedMonth,
  ]);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden mb-10">
      {/* Tool Header */}
      <div className="bg-slate-50 dark:bg-slate-800/60 px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span className="font-semibold text-slate-900 dark:text-slate-100 text-base">
            {tool.name}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span>High Precision</span>
          <span aria-hidden="true">·</span>
          <span>Calendar-Aware</span>
        </div>
      </div>

      <div className="p-6 md:p-8">
        {/* Dynamic Inputs Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {(tool.calculatorType === 'time-duration' || tool.calculatorType === 'work-hours') && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Start Clock Time
                </label>
                <input
                  type="time"
                  step="60"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  End Clock Time
                </label>
                <input
                  type="time"
                  step="60"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Break Deduction (Minutes)
                </label>
                <input
                  type="number"
                  min="0"
                  max="480"
                  value={breakMinutes}
                  onChange={(e) => setBreakMinutes(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Hourly Rate ($/hr, optional)
                </label>
                <input
                  type="number"
                  step="0.50"
                  min="0"
                  value={hourlyWage}
                  onChange={(e) => setHourlyWage(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </>
          )}

          {(tool.calculatorType === 'add-subtract-time' || tool.calculatorType === 'average-time') && (
            <div className="md:col-span-2 space-y-4">
              {tool.calculatorType === 'add-subtract-time' && (
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Operation:</span>
                  <button
                    type="button"
                    onClick={() => setDurationOp('add')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      durationOp === 'add'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Add (+)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDurationOp('subtract')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      durationOp === 'subtract'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    Subtract (-)
                  </button>
                </div>
              )}

              {timeRows.map((row, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-xs font-mono text-slate-500 w-16">Entry #{idx + 1}</span>
                  <div className="grid grid-cols-3 gap-2 flex-1">
                    <input
                      type="number"
                      min="0"
                      placeholder="Hours"
                      value={row.hours}
                      onChange={(e) => {
                        const next = [...timeRows];
                        next[idx].hours = parseInt(e.target.value, 10) || 0;
                        setTimeRows(next);
                      }}
                      className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-mono text-slate-900 dark:text-slate-100"
                    />
                    <input
                      type="number"
                      min="0"
                      max="59"
                      placeholder="Mins"
                      value={row.minutes}
                      onChange={(e) => {
                        const next = [...timeRows];
                        next[idx].minutes = parseInt(e.target.value, 10) || 0;
                        setTimeRows(next);
                      }}
                      className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-mono text-slate-900 dark:text-slate-100"
                    />
                    <input
                      type="number"
                      min="0"
                      max="59"
                      placeholder="Secs"
                      value={row.seconds}
                      onChange={(e) => {
                        const next = [...timeRows];
                        next[idx].seconds = parseInt(e.target.value, 10) || 0;
                        setTimeRows(next);
                      }}
                      className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-mono text-slate-900 dark:text-slate-100"
                    />
                  </div>
                  {timeRows.length > 2 && (
                    <button
                      type="button"
                      onClick={() => setTimeRows(timeRows.filter((_, i) => i !== idx))}
                      className="text-xs text-rose-500 hover:text-rose-600 px-2 py-1"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={() => setTimeRows([...timeRows, { hours: 0, minutes: 30, seconds: 0 }])}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                + Add Another Time Entry
              </button>
            </div>
          )}

          {(tool.calculatorType === 'date-diff' || tool.calculatorType === 'business-days') && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDateStr}
                  onChange={(e) => setStartDateStr(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDateStr}
                  onChange={(e) => setEndDateStr(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div className="md:col-span-2 flex flex-wrap gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={inclusive}
                    onChange={(e) => setInclusive(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Inclusive counting (Include both start and end days)</span>
                </label>
                {tool.calculatorType === 'business-days' && (
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={excludeHolidays}
                      onChange={(e) => setExcludeHolidays(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Exclude recognized public holidays</span>
                  </label>
                )}
              </div>
            </>
          )}

          {(tool.calculatorType === 'age' || tool.calculatorType === 'how-old-was-i') && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={birthDateStr}
                  onChange={(e) => setBirthDateStr(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {tool.calculatorType === 'how-old-was-i' ? 'Target Historical Date' : 'Calculate Age On Date'}
                </label>
                <input
                  type="date"
                  value={targetDateStr}
                  onChange={(e) => setTargetDateStr(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </>
          )}

          {tool.calculatorType === 'age-diff' && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Person 1 Date of Birth
                </label>
                <input
                  type="date"
                  value={birthDateStr}
                  onChange={(e) => setBirthDateStr(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Person 2 Date of Birth
                </label>
                <input
                  type="date"
                  value={secondDobStr}
                  onChange={(e) => setSecondDobStr(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </>
          )}

          {tool.calculatorType === 'leap-year' && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Enter Year to Check
              </label>
              <input
                type="number"
                value={checkYear}
                onChange={(e) => setCheckYear(parseInt(e.target.value, 10) || 0)}
                className="w-full max-w-sm px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono text-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          )}

          {tool.calculatorType === 'month-calc' && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Select Month
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-medium text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  {[
                    'January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'
                  ].map((m, i) => (
                    <option key={m} value={i}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Select Year
                </label>
                <input
                  type="number"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </>
          )}
        </div>

        {/* Highlight Result Card */}
        <div className="bg-slate-950 text-white rounded-xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between gap-4 mb-2">
            <span className="text-xs uppercase tracking-wider text-indigo-400 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Computed Result
            </span>
            <button
              type="button"
              onClick={() => handleCopy(result.copyValue)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-medium text-slate-200 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Result'}</span>
            </button>
          </div>

          <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-white mb-1 tabular-nums">
            {result.primary}
          </div>
          <div className="text-sm text-slate-400 font-medium mb-6">
            {result.secondary}
          </div>

          {/* Detailed breakdowns */}
          {result.details.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-4 border-t border-slate-800">
              {result.details.map((item, i) => (
                <div key={i} className="bg-slate-900/80 p-3 rounded-lg border border-slate-800/80">
                  <div className="text-xs text-slate-400 mb-0.5">{item.label}</div>
                  <div className="text-sm font-semibold font-mono text-slate-100 tabular-nums">{item.value}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
