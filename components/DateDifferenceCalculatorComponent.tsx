'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import { getHolidayMap } from '@/lib/holiday-database';
import {
  ModeType,
  WorkWeekSchedule,
  WorkHoursMode,
  CalculationResults,
  CountdownResults,
  MatchedHoliday,
} from './date-difference/types';
import ModeFormControls from './date-difference/ModeFormControls';
import ModeResultsDisplay from './date-difference/ModeResultsDisplay';
import DateDifferenceGuideSections from './date-difference/DateDifferenceGuideSections';

function parseISODate(dateStr: string): Date | null {
  if (!dateStr) return null;
  const parts = dateStr.split('-');
  if (parts.length < 3) return null;
  return new Date(Date.UTC(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10)));
}

function getWeekInfo(d: Date): { week: number; year: number } {
  const target = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dayNr = (target.getUTCDay() + 6) % 7;
  target.setUTCDate(target.getUTCDate() - dayNr + 3);
  const firstThursday = target.getTime();
  target.setUTCMonth(0, 1);
  if (target.getUTCDay() !== 4) {
    target.setUTCMonth(0, 1 + ((4 - target.getUTCDay() + 7) % 7));
  }
  const week = 1 + Math.ceil((firstThursday - target.getTime()) / 604800000);
  return { week, year: target.getUTCFullYear() };
}

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface Props {
  pageTitle?: string;
  breadcrumbName?: string;
}

export default function DateDifferenceCalculatorComponent({
  pageTitle = 'Days Between Dates Calculator',
  breadcrumbName = 'Days Between Dates Calculator',
}: Props) {
  // Primary Date Range State
  const [startDate, setStartDate] = useState('2025-08-15');
  const [endDate, setEndDate] = useState('2026-01-04');
  const [activeMode, setActiveMode] = useState<ModeType>('all-days');
  const [includeEndDate, setIncludeEndDate] = useState(false);
  const [excludeWeekends, setExcludeWeekends] = useState(true);
  const [excludeHolidays, setExcludeHolidays] = useState(true);
  const [country, setCountry] = useState('US');

  // Business Days & Work Week Schedules
  const [workWeekSchedule, setWorkWeekSchedule] = useState<WorkWeekSchedule>('5-day');
  const [customWeekendDays, setCustomWeekendDays] = useState<number[]>([0, 6]); // Sun=0, Sat=6

  // Work Hours & Shift State
  const [workHoursMode, setWorkHoursMode] = useState<WorkHoursMode>('daily-hours');
  const [workHoursPerDay, setWorkHoursPerDay] = useState(8.0);
  const [shiftStartTime, setShiftStartTime] = useState('09:00');
  const [shiftEndTime, setShiftEndTime] = useState('17:00');
  const [lunchBreakMins, setLunchBreakMins] = useState(60);
  const [hourlyRate, setHourlyRate] = useState(0);
  const [fteWeeklyHours, setFteWeeklyHours] = useState(40);

  // Countdown State
  const [eventName, setEventName] = useState('New Year 2027');
  const [countdownTargetDate, setCountdownTargetDate] = useState('2027-01-01');
  const [countdownTargetTime, setCountdownTargetTime] = useState('00:00:00');
  const [currentTime, setCurrentTime] = useState<Date>(() => new Date());

  // Feedback State
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [shareFeedback, setShareFeedback] = useState(false);

  // Live Timer Interval (updates every second for real-time Countdown clock)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Update custom weekend days when preset schedule changes
  const handleSetWorkWeekSchedule = (schedule: WorkWeekSchedule) => {
    setWorkWeekSchedule(schedule);
    if (schedule === '5-day') {
      setCustomWeekendDays([0, 6]); // Sun & Sat
    } else if (schedule === '6-day') {
      setCustomWeekendDays([0]); // Sun only
    } else if (schedule === '4-day') {
      setCustomWeekendDays([0, 5, 6]); // Fri, Sat, Sun off
    } else if (schedule === 'sun-thu') {
      setCustomWeekendDays([5, 6]); // Fri & Sat off
    }
  };

  const toggleCustomWeekendDay = (day: number) => {
    setWorkWeekSchedule('custom');
    setCustomWeekendDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  // Start & End parsed
  const startD = useMemo(() => parseISODate(startDate), [startDate]);
  const endD = useMemo(() => parseISODate(endDate), [endDate]);

  const startDayName = startD ? DAYS_OF_WEEK[startD.getUTCDay()] : '';
  const endDayName = endD ? DAYS_OF_WEEK[endD.getUTCDay()] : '';

  const startWeekInfo = useMemo(() => (startD ? getWeekInfo(startD) : null), [startD]);
  const endWeekInfo = useMemo(() => (endD ? getWeekInfo(endD) : null), [endD]);

  // Compute effective daily hours based on mode & shift times
  const effectiveDailyHours = useMemo(() => {
    if (workHoursMode === 'daily-hours') {
      return workHoursPerDay;
    }
    const [sH, sM] = shiftStartTime.split(':').map((v) => parseInt(v, 10) || 0);
    const [eH, eM] = shiftEndTime.split(':').map((v) => parseInt(v, 10) || 0);
    let totalShiftMins = eH * 60 + eM - (sH * 60 + sM);
    if (totalShiftMins <= 0) {
      totalShiftMins += 24 * 60; // Overnight shift
    }
    const netMins = Math.max(0, totalShiftMins - lunchBreakMins);
    return Math.round((netMins / 60) * 10) / 10;
  }, [workHoursMode, workHoursPerDay, shiftStartTime, shiftEndTime, lunchBreakMins]);

  // Core Calendar & Business Calculation
  const calcResults = useMemo<CalculationResults | null>(() => {
    if (!startD || !endD) return null;

    let d1 = new Date(startD.getTime());
    let d2 = new Date(endD.getTime());
    const isReverse = d2 < d1;

    if (isReverse) {
      const tmp = d1;
      d1 = d2;
      d2 = tmp;
    }

    const msDiff = d2.getTime() - d1.getTime();
    let totalCalendarDays = Math.round(msDiff / 86400000);
    if (includeEndDate) {
      totalCalendarDays += 1;
    }
    if (totalCalendarDays < 0) totalCalendarDays = 0;

    const holidayMap = getHolidayMap(country);
    const weekendSet = new Set(customWeekendDays);

    let businessDays = 0;
    let weekendDays = 0;
    let holidaysCount = 0;
    let totalFridays = 0;
    const matchedHolidays: MatchedHoliday[] = [];

    const curr = new Date(d1.getTime());
    const endTarget = new Date(d2.getTime());
    if (includeEndDate) {
      endTarget.setUTCDate(endTarget.getUTCDate() + 1);
    }

    while (curr < endTarget) {
      const dayOfWeek = curr.getUTCDay();
      const isoString = curr.toISOString().split('T')[0];

      if (dayOfWeek === 5) {
        totalFridays++;
      }

      const isHoliday = holidayMap.has(isoString);
      const isWeekend = weekendSet.has(dayOfWeek);

      if (isHoliday) {
        matchedHolidays.push({
          date: isoString,
          name: holidayMap.get(isoString)!,
          dayOfWeek: DAYS_OF_WEEK[dayOfWeek],
        });
      }

      if (isWeekend) {
        weekendDays++;
      } else if (excludeHolidays && isHoliday) {
        holidaysCount++;
      } else {
        businessDays++;
      }

      curr.setUTCDate(curr.getUTCDate() + 1);
    }

    const totalWeeks = (totalCalendarDays / 7).toFixed(1);
    const totalHours = totalCalendarDays * 24;
    const totalMinutes = totalCalendarDays * 1440;
    const calculatedWorkHours = Math.round(businessDays * effectiveDailyHours);
    const grossEarnings = hourlyRate > 0 ? Math.round(calculatedWorkHours * hourlyRate) : 0;
    const fteWeeks = (calculatedWorkHours / (fteWeeklyHours || 40)).toFixed(1);

    const workdayPercent =
      totalCalendarDays > 0 ? ((businessDays / totalCalendarDays) * 100).toFixed(1) : '0.0';

    const approxMonths = Math.floor(totalCalendarDays / 30.4375);
    const remainingDays = Math.round(totalCalendarDays % 30.4375);
    const humanDuration = `${approxMonths} Months, ${remainingDays} Days`;

    const yearPercent = Math.min(100, Math.max(0, (totalCalendarDays / 365.25) * 100)).toFixed(1);

    const midTime = new Date(d1.getTime() + msDiff / 2);
    const quarter25Time = new Date(d1.getTime() + msDiff * 0.25);
    const quarter75Time = new Date(d1.getTime() + msDiff * 0.75);

    const agileSprints = (businessDays / 10).toFixed(1);

    const qStart = Math.floor(d1.getUTCMonth() / 3) + 1;
    const qEnd = Math.floor(d2.getUTCMonth() / 3) + 1;
    const quartersSpanned = qStart === qEnd ? `Q${qStart}` : `Q${qStart} & Q${qEnd}`;

    return {
      isReverse,
      d1,
      d2,
      msDiff,
      totalCalendarDays,
      businessDays,
      weekendDays,
      holidaysCount,
      matchedHolidays,
      totalWeeks,
      totalHours,
      totalMinutes,
      effectiveDailyHours,
      calculatedWorkHours,
      grossEarnings,
      fteWeeks,
      workdayPercent,
      humanDuration,
      yearPercent,
      midTime,
      quarter25Time,
      quarter75Time,
      totalFridays,
      agileSprints,
      quartersSpanned,
    };
  }, [
    startD,
    endD,
    includeEndDate,
    customWeekendDays,
    excludeHolidays,
    country,
    effectiveDailyHours,
    hourlyRate,
    fteWeeklyHours,
  ]);

  // Real-Time Countdown Results
  const countdownResults = useMemo<CountdownResults>(() => {
    const targetDateObj = new Date(`${countdownTargetDate}T${countdownTargetTime || '00:00:00'}`);
    const targetMs = targetDateObj.getTime();
    const currentMs = currentTime.getTime();
    const diffMs = targetMs - currentMs;
    const isPassed = diffMs <= 0;

    const totalSeconds = isPassed ? 0 : Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    // Working days countdown until target date
    let businessDaysRemaining = 0;
    if (!isPassed) {
      const holidayMap = getHolidayMap(country);
      const weekendSet = new Set(customWeekendDays);
      const cur = new Date(currentTime.getTime());
      cur.setUTCHours(0, 0, 0, 0);
      const targetEnd = new Date(targetDateObj.getTime());
      targetEnd.setUTCHours(0, 0, 0, 0);

      while (cur <= targetEnd) {
        const dayOfWeek = cur.getUTCDay();
        const isoStr = cur.toISOString().split('T')[0];
        if (!weekendSet.has(dayOfWeek) && (!excludeHolidays || !holidayMap.has(isoStr))) {
          businessDaysRemaining++;
        }
        cur.setUTCDate(cur.getUTCDate() + 1);
      }
    }

    const workHoursRemaining = Math.round(businessDaysRemaining * effectiveDailyHours);
    const totalWeeksRemaining = (days / 7).toFixed(1);
    const totalHoursRemaining = Math.floor(totalSeconds / 3600);
    const totalMinutesRemaining = Math.floor(totalSeconds / 60);

    const targetDateFormatted = isNaN(targetMs)
      ? countdownTargetDate
      : targetDateObj.toLocaleString('en-US', {
          dateStyle: 'medium',
          timeStyle: 'short',
        });

    return {
      isPassed,
      totalSecondsRemaining: totalSeconds,
      days,
      hours,
      minutes,
      seconds,
      businessDaysRemaining,
      workHoursRemaining,
      totalWeeksRemaining,
      totalHoursRemaining,
      totalMinutesRemaining,
      targetDateFormatted,
    };
  }, [
    countdownTargetDate,
    countdownTargetTime,
    currentTime,
    country,
    customWeekendDays,
    excludeHolidays,
    effectiveDailyHours,
  ]);

  // Mode Switching Logic
  const handleSetMode = (mode: ModeType) => {
    setActiveMode(mode);
    const now = new Date();
    const curYear = now.getFullYear();
    const todayStr = now.toISOString().split('T')[0];

    if (mode === 'all-days') {
      setExcludeWeekends(false);
      setExcludeHolidays(false);
    } else if (mode === 'business-days') {
      setExcludeWeekends(true);
      setExcludeHolidays(true);
      if (customWeekendDays.length === 0) {
        setCustomWeekendDays([0, 6]);
      }
    } else if (mode === 'work-hours') {
      setExcludeWeekends(true);
      setExcludeHolidays(true);
    } else if (mode === 'event-countdown') {
      // Set default countdown target if target has already passed
      setStartDate(todayStr);
      if (!countdownTargetDate || countdownTargetDate <= todayStr) {
        setCountdownTargetDate(`${curYear + 1}-01-01`);
        setCountdownTargetTime('00:00:00');
        setEventName(`New Year ${curYear + 1}`);
      }
    }
  };

  // Quick Start Date
  const quickStartDate = (type: 'today' | 'start-year') => {
    const today = new Date();
    if (type === 'today') {
      setStartDate(today.toISOString().split('T')[0]);
    } else if (type === 'start-year') {
      setStartDate(`${today.getFullYear()}-01-01`);
    }
  };

  // Quick End Date
  const quickEndDate = (addDays: number) => {
    const base = startD ? new Date(startD.getTime()) : new Date();
    base.setUTCDate(base.getUTCDate() + addDays);
    setEndDate(base.toISOString().split('T')[0]);
  };

  // Presets Bar (Context aware)
  const applyPreset = (preset: string) => {
    const now = new Date();
    const curYear = now.getFullYear();
    const todayStr = now.toISOString().split('T')[0];

    if (preset === 'today-eoy') {
      setStartDate(todayStr);
      setEndDate(`${curYear}-12-31`);
    } else if (preset === 'summer-vacation') {
      setStartDate(`${curYear}-06-01`);
      setEndDate(`${curYear}-08-31`);
    } else if (preset === 'fiscal-quarter') {
      setStartDate(`${curYear}-10-01`);
      setEndDate(`${curYear}-12-31`);
    } else if (preset === '90-days') {
      setStartDate(todayStr);
      const future = new Date(now.getTime() + 90 * 86400000);
      setEndDate(future.toISOString().split('T')[0]);
    } else if (preset === 'one-year') {
      setStartDate(todayStr);
      const nextYr = new Date(now.getTime() + 365 * 86400000);
      setEndDate(nextYr.toISOString().split('T')[0]);
    } else if (preset === 'cd-newyear') {
      setCountdownTargetDate(`${curYear + 1}-01-01`);
      setCountdownTargetTime('00:00:00');
      setEventName(`New Year ${curYear + 1}`);
    } else if (preset === 'cd-eoy') {
      setCountdownTargetDate(`${curYear}-12-31`);
      setCountdownTargetTime('23:59:59');
      setEventName(`End of Year ${curYear}`);
    } else if (preset === 'cd-friday') {
      // Find upcoming Friday
      const friday = new Date(now);
      const day = friday.getDay();
      const diffToFriday = (5 - day + 7) % 7 || 7;
      friday.setDate(friday.getDate() + diffToFriday);
      setCountdownTargetDate(friday.toISOString().split('T')[0]);
      setCountdownTargetTime('17:00:00');
      setEventName('Friday 5 PM Weekend');
    } else if (preset === 'cd-30days') {
      const f30 = new Date(now.getTime() + 30 * 86400000);
      setCountdownTargetDate(f30.toISOString().split('T')[0]);
      setCountdownTargetTime('12:00:00');
      setEventName('30-Day Milestone');
    } else if (preset === 'cd-100days') {
      const f100 = new Date(now.getTime() + 100 * 86400000);
      setCountdownTargetDate(f100.toISOString().split('T')[0]);
      setCountdownTargetTime('12:00:00');
      setEventName('100-Day Goal');
    }
  };

  // Swap dates
  const swapDates = () => {
    const s = startDate;
    const e = endDate;
    setStartDate(e);
    setEndDate(s);
  };

  // Reset form
  const resetForm = () => {
    setStartDate('2025-08-15');
    setEndDate('2026-01-04');
    setIncludeEndDate(false);
    setExcludeWeekends(true);
    setExcludeHolidays(true);
    setWorkHoursPerDay(8.0);
    setWorkWeekSchedule('5-day');
    setCustomWeekendDays([0, 6]);
    setHourlyRate(0);
    setActiveMode('all-days');
  };

  // Copy Results to Clipboard (tailored per mode)
  const copyResults = useCallback(() => {
    if (!calcResults) return;
    let text = '';
    if (activeMode === 'all-days') {
      text = `SolveIt Calendar Days Calculation:\nStart Date: ${startDate}\nEnd Date: ${endDate}\nTotal Days: ${calcResults.totalCalendarDays.toLocaleString()}\nBreakdown: ${calcResults.humanDuration}\nTotal Weeks: ${calcResults.totalWeeks}\nTotal Hours: ${calcResults.totalHours.toLocaleString()}\nCalculated at SolveItCalculator.com`;
    } else if (activeMode === 'business-days') {
      text = `SolveIt Business Days Calculation:\nStart Date: ${startDate}\nEnd Date: ${endDate}\nNet Working Days: ${calcResults.businessDays}\nWeekend Days Skipped: ${calcResults.weekendDays}\nPublic Holidays Skipped: ${calcResults.holidaysCount}\nWork Weeks Equivalent: ${calcResults.totalWeeks}\nCalculated at SolveItCalculator.com`;
    } else if (activeMode === 'work-hours') {
      text = `SolveIt Work Hours Calculation:\nStart Date: ${startDate}\nEnd Date: ${endDate}\nTotal Work Hours: ${calcResults.calculatedWorkHours} hours\nDaily Schedule: ${calcResults.businessDays} days × ${calcResults.effectiveDailyHours} hrs/day\nGross Earnings: $${calcResults.grossEarnings.toLocaleString()}\nFTE Weeks: ${calcResults.fteWeeks} weeks\nCalculated at SolveItCalculator.com`;
    } else if (activeMode === 'event-countdown') {
      text = `SolveIt Countdown to ${eventName}:\nTarget: ${countdownResults.targetDateFormatted}\nRemaining: ${countdownResults.days} Days, ${countdownResults.hours} Hours, ${countdownResults.minutes} Mins, ${countdownResults.seconds} Secs\nBusiness Days Left: ${countdownResults.businessDaysRemaining}\nWork Hours Left: ${countdownResults.workHoursRemaining}\nCalculated at SolveItCalculator.com`;
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopyFeedback(true);
        setTimeout(() => setCopyFeedback(false), 2000);
      });
    }
  }, [calcResults, countdownResults, activeMode, startDate, endDate, eventName]);

  // Export CSV (tailored per mode)
  const exportCSV = useCallback(() => {
    if (!calcResults) return;
    let csv = '';
    if (activeMode === 'all-days') {
      csv = `Metric,Value\nStart Date,${startDate}\nEnd Date,${endDate}\nTotal Days,${calcResults.totalCalendarDays}\nExact Breakdown,"${calcResults.humanDuration}"\nTotal Weeks,${calcResults.totalWeeks}\nTotal Hours,${calcResults.totalHours}\nTotal Minutes,${calcResults.totalMinutes}\n`;
    } else if (activeMode === 'business-days') {
      csv = `Metric,Value\nStart Date,${startDate}\nEnd Date,${endDate}\nBusiness Days,${calcResults.businessDays}\nTotal Calendar Days,${calcResults.totalCalendarDays}\nWeekend Days Skipped,${calcResults.weekendDays}\nPublic Holidays Skipped,${calcResults.holidaysCount}\nWork Weeks,${calcResults.totalWeeks}\nWork Hours (8h/day),${calcResults.calculatedWorkHours}\n`;
    } else if (activeMode === 'work-hours') {
      csv = `Metric,Value\nStart Date,${startDate}\nEnd Date,${endDate}\nTotal Work Hours,${calcResults.calculatedWorkHours}\nEffective Daily Hours,${calcResults.effectiveDailyHours}\nNet Working Days,${calcResults.businessDays}\nHourly Rate,$${hourlyRate}\nGross Earnings,$${calcResults.grossEarnings}\nFTE Weeks,${calcResults.fteWeeks}\n`;
    } else if (activeMode === 'event-countdown') {
      csv = `Metric,Value\nEvent Name,"${eventName}"\nTarget Date,${countdownTargetDate}\nTarget Time,${countdownTargetTime}\nDays Remaining,${countdownResults.days}\nHours Remaining,${countdownResults.hours}\nMinutes Remaining,${countdownResults.minutes}\nSeconds Remaining,${countdownResults.seconds}\nBusiness Days Left,${countdownResults.businessDaysRemaining}\nWork Hours Left,${countdownResults.workHoursRemaining}\n`;
    }

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `date-calc-${activeMode}.csv`);
    a.click();
    window.URL.revokeObjectURL(url);
  }, [
    calcResults,
    countdownResults,
    activeMode,
    startDate,
    endDate,
    eventName,
    countdownTargetDate,
    countdownTargetTime,
    hourlyRate,
  ]);

  // Share Link
  const copyShareableUrl = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setShareFeedback(true);
      setTimeout(() => setShareFeedback(false), 2500);
    }
  };

  return (
    <main className="w-full pt-0 bg-background min-h-screen">
      <div className="flex flex-col w-full">
        {/* Top Utilities & Trust Strip */}
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Time & Date Calculators', href: '/time-date' },
            { label: breadcrumbName },
          ]}
          badge="Accurate Calendar Rules"
          rightContent={
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 text-on-surface-variant font-label-caps text-label-caps uppercase bg-surface-container px-2.5 py-0.5 rounded-full text-[11px]">
                <span className="material-symbols-outlined text-[13px] text-primary">verified_user</span> 100% Private
              </span>
            </div>
          }
        />

        {/* Hero Header Block */}
        <section className="w-full py-space-xl lg:py-space-2xl bg-surface">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="max-w-3xl flex flex-col gap-space-sm">
              <div className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-primary/10 text-primary font-label-caps text-label-caps uppercase tracking-wider">
                <span className="material-symbols-outlined text-[16px]">calendar_month</span> Easy Date Calculator
              </div>
              <h1 className="font-headline-lg lg:font-display-hero text-headline-lg lg:text-display-hero text-on-surface tracking-tight">
                {pageTitle.includes('Calculator') ? (
                  <>
                    {pageTitle.replace('Calculator', '')} <span className="text-primary">Calculator</span>
                  </>
                ) : (
                  pageTitle
                )}
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                Quickly calculate the exact days, business days, work hours, and live countdowns between any two dates.
              </p>

              {/* Quick Mode-Aware Presets Bar */}
              <div className="flex flex-wrap items-center gap-space-xs pt-space-xs">
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase mr-1">
                  {activeMode === 'event-countdown' ? 'Countdown Presets:' : 'Quick Presets:'}
                </span>
                {activeMode === 'event-countdown' ? (
                  <>
                    <button
                      className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm transition-all shadow-sm cursor-pointer"
                      onClick={() => applyPreset('cd-newyear')}
                      type="button"
                    >
                      🎉 New Year 2027
                    </button>
                    <button
                      className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm transition-all shadow-sm cursor-pointer"
                      onClick={() => applyPreset('cd-eoy')}
                      type="button"
                    >
                      📅 End of Year
                    </button>
                    <button
                      className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm transition-all shadow-sm cursor-pointer"
                      onClick={() => applyPreset('cd-friday')}
                      type="button"
                    >
                      💼 Friday 5 PM
                    </button>
                    <button
                      className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm transition-all shadow-sm cursor-pointer"
                      onClick={() => applyPreset('cd-30days')}
                      type="button"
                    >
                      ⏳ 30 Days
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm transition-all shadow-sm cursor-pointer"
                      onClick={() => applyPreset('today-eoy')}
                      type="button"
                    >
                      Today to Year End
                    </button>
                    <button
                      className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm transition-all shadow-sm cursor-pointer"
                      onClick={() => applyPreset('summer-vacation')}
                      type="button"
                    >
                      Summer Break
                    </button>
                    <button
                      className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm transition-all shadow-sm cursor-pointer"
                      onClick={() => applyPreset('fiscal-quarter')}
                      type="button"
                    >
                      Next Quarter
                    </button>
                    <button
                      className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm transition-all shadow-sm cursor-pointer"
                      onClick={() => applyPreset('90-days')}
                      type="button"
                    >
                      90 Days
                    </button>
                    <button
                      className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm transition-all shadow-sm cursor-pointer"
                      onClick={() => applyPreset('one-year')}
                      type="button"
                    >
                      365 Days
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Interactive 2-Column Application Section */}
        <section className="w-full pb-space-3xl">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
              {/* Left Column: Form & Mode Controls */}
              <ModeFormControls
                activeMode={activeMode}
                handleSetMode={handleSetMode}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                startDayName={startDayName}
                endDayName={endDayName}
                startWeekInfo={startWeekInfo}
                endWeekInfo={endWeekInfo}
                quickStartDate={quickStartDate}
                quickEndDate={quickEndDate}
                swapDates={swapDates}
                isReverse={calcResults?.isReverse}
                includeEndDate={includeEndDate}
                setIncludeEndDate={setIncludeEndDate}
                excludeWeekends={excludeWeekends}
                setExcludeWeekends={setExcludeWeekends}
                excludeHolidays={excludeHolidays}
                setExcludeHolidays={setExcludeHolidays}
                country={country}
                setCountry={setCountry}
                workWeekSchedule={workWeekSchedule}
                setWorkWeekSchedule={handleSetWorkWeekSchedule}
                customWeekendDays={customWeekendDays}
                toggleCustomWeekendDay={toggleCustomWeekendDay}
                matchedHolidays={calcResults?.matchedHolidays || []}
                workHoursMode={workHoursMode}
                setWorkHoursMode={setWorkHoursMode}
                workHoursPerDay={workHoursPerDay}
                setWorkHoursPerDay={setWorkHoursPerDay}
                shiftStartTime={shiftStartTime}
                setShiftStartTime={setShiftStartTime}
                shiftEndTime={shiftEndTime}
                setShiftEndTime={setShiftEndTime}
                lunchBreakMins={lunchBreakMins}
                setLunchBreakMins={setLunchBreakMins}
                effectiveDailyHours={effectiveDailyHours}
                hourlyRate={hourlyRate}
                setHourlyRate={setHourlyRate}
                fteWeeklyHours={fteWeeklyHours}
                setFteWeeklyHours={setFteWeeklyHours}
                eventName={eventName}
                setEventName={setEventName}
                countdownTargetDate={countdownTargetDate}
                setCountdownTargetDate={setCountdownTargetDate}
                countdownTargetTime={countdownTargetTime}
                setCountdownTargetTime={setCountdownTargetTime}
                applyPreset={applyPreset}
                resetForm={resetForm}
                copyShareableUrl={copyShareableUrl}
                shareFeedback={shareFeedback}
              />

              {/* Right Column: Dynamic Results Display */}
              {calcResults && (
                <ModeResultsDisplay
                  activeMode={activeMode}
                  startDate={startDate}
                  endDate={endDate}
                  calc={calcResults}
                  countdown={countdownResults}
                  eventName={eventName}
                  countdownTargetDate={countdownTargetDate}
                  countdownTargetTime={countdownTargetTime}
                  copyResultsToClipboard={copyResults}
                  copyFeedback={copyFeedback}
                  exportCsv={exportCSV}
                  hourlyRate={hourlyRate}
                />
              )}
            </div>
          </div>
        </section>

        {/* Informational Guides, Comparison Tables, Use Cases, FAQs & Related Calculators */}
        <DateDifferenceGuideSections />
      </div>
    </main>
  );
}
