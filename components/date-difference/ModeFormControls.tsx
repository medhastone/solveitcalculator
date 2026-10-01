'use client';

import React, { useState } from 'react';
import { ModeType, WorkWeekSchedule, WorkHoursMode, MatchedHoliday } from './types';

interface ModeFormControlsProps {
  activeMode: ModeType;
  handleSetMode: (mode: ModeType) => void;
  startDate: string;
  setStartDate: (val: string) => void;
  endDate: string;
  setEndDate: (val: string) => void;
  startDayName: string;
  endDayName: string;
  startWeekInfo: { week: number; year: number } | null;
  endWeekInfo: { week: number; year: number } | null;
  quickStartDate: (type: 'today' | 'start-year') => void;
  quickEndDate: (days: number) => void;
  swapDates: () => void;
  isReverse?: boolean;
  includeEndDate: boolean;
  setIncludeEndDate: (val: boolean) => void;
  excludeWeekends: boolean;
  setExcludeWeekends: (val: boolean) => void;
  excludeHolidays: boolean;
  setExcludeHolidays: (val: boolean) => void;
  country: string;
  setCountry: (val: string) => void;
  workWeekSchedule: WorkWeekSchedule;
  setWorkWeekSchedule: (val: WorkWeekSchedule) => void;
  customWeekendDays: number[];
  toggleCustomWeekendDay: (day: number) => void;
  matchedHolidays: MatchedHoliday[];
  workHoursMode: WorkHoursMode;
  setWorkHoursMode: (val: WorkHoursMode) => void;
  workHoursPerDay: number;
  setWorkHoursPerDay: (val: number) => void;
  shiftStartTime: string;
  setShiftStartTime: (val: string) => void;
  shiftEndTime: string;
  setShiftEndTime: (val: string) => void;
  lunchBreakMins: number;
  setLunchBreakMins: (val: number) => void;
  effectiveDailyHours: number;
  hourlyRate: number;
  setHourlyRate: (val: number) => void;
  fteWeeklyHours: number;
  setFteWeeklyHours: (val: number) => void;
  eventName: string;
  setEventName: (val: string) => void;
  countdownTargetDate: string;
  setCountdownTargetDate: (val: string) => void;
  countdownTargetTime: string;
  setCountdownTargetTime: (val: string) => void;
  applyPreset: (preset: string) => void;
  resetForm: () => void;
  copyShareableUrl: () => void;
  shareFeedback: boolean;
}

const DAY_NAMES = [
  { day: 0, label: 'Sun', full: 'Sunday' },
  { day: 1, label: 'Mon', full: 'Monday' },
  { day: 2, label: 'Tue', full: 'Tuesday' },
  { day: 3, label: 'Wed', full: 'Wednesday' },
  { day: 4, label: 'Thu', full: 'Thursday' },
  { day: 5, label: 'Fri', full: 'Friday' },
  { day: 6, label: 'Sat', full: 'Saturday' },
];

export default function ModeFormControls({
  activeMode,
  handleSetMode,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  startDayName,
  endDayName,
  startWeekInfo,
  endWeekInfo,
  quickStartDate,
  quickEndDate,
  swapDates,
  isReverse,
  includeEndDate,
  setIncludeEndDate,
  excludeWeekends,
  setExcludeWeekends,
  excludeHolidays,
  setExcludeHolidays,
  country,
  setCountry,
  workWeekSchedule,
  setWorkWeekSchedule,
  customWeekendDays,
  toggleCustomWeekendDay,
  matchedHolidays,
  workHoursMode,
  setWorkHoursMode,
  workHoursPerDay,
  setWorkHoursPerDay,
  shiftStartTime,
  setShiftStartTime,
  shiftEndTime,
  setShiftEndTime,
  lunchBreakMins,
  setLunchBreakMins,
  effectiveDailyHours,
  hourlyRate,
  setHourlyRate,
  fteWeeklyHours,
  setFteWeeklyHours,
  eventName,
  setEventName,
  countdownTargetDate,
  setCountdownTargetDate,
  countdownTargetTime,
  setCountdownTargetTime,
  applyPreset,
  resetForm,
  copyShareableUrl,
  shareFeedback,
}: ModeFormControlsProps) {
  const [showHolidayDetails, setShowHolidayDetails] = useState(false);

  return (
    <div className="lg:col-span-7 flex flex-col gap-space-lg bg-surface-container-lowest p-space-md lg:p-space-xl rounded-xl shadow-md border border-outline-variant/30">
      {/* Mode Selector Tabs */}
      <div className="flex flex-wrap gap-1 p-1 bg-surface-container-low rounded-lg" id="modeSelector">
        <button
          className={`mode-tab-btn flex-1 min-w-[100px] py-2.5 px-3 rounded-lg text-center font-label-caps text-label-caps uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeMode === 'all-days'
              ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container/50'
          }`}
          onClick={() => handleSetMode('all-days')}
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">calendar_today</span>
          <span>All Days</span>
        </button>
        <button
          className={`mode-tab-btn flex-1 min-w-[100px] py-2.5 px-3 rounded-lg text-center font-label-caps text-label-caps uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeMode === 'business-days'
              ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container/50'
          }`}
          onClick={() => handleSetMode('business-days')}
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">business_center</span>
          <span>Business Days</span>
        </button>
        <button
          className={`mode-tab-btn flex-1 min-w-[100px] py-2.5 px-3 rounded-lg text-center font-label-caps text-label-caps uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeMode === 'work-hours'
              ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container/50'
          }`}
          onClick={() => handleSetMode('work-hours')}
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">schedule</span>
          <span>Work Hours</span>
        </button>
        <button
          className={`mode-tab-btn flex-1 min-w-[100px] py-2.5 px-3 rounded-lg text-center font-label-caps text-label-caps uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeMode === 'event-countdown'
              ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container/50'
          }`}
          onClick={() => handleSetMode('event-countdown')}
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">alarm</span>
          <span>Countdown</span>
        </button>
      </div>

      {/* Mode-Specific Context Banner */}
      <div className="p-3 rounded-lg bg-surface border border-outline-variant/20 flex items-center justify-between text-body-sm">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          <span className="text-on-surface font-medium">
            {activeMode === 'all-days' && 'Standard Calendar Duration (Days, Weeks, Months, Hours)'}
            {activeMode === 'business-days' && 'Business Working Days (Net Working Days, Excluded Weekends & Holidays)'}
            {activeMode === 'work-hours' && 'Operational & Billable Hours (Daily Shifts, Lunch Breaks & Earnings)'}
            {activeMode === 'event-countdown' && 'Live Event Countdown (Real-time clock with remaining working days)'}
          </span>
        </div>
        <span className="text-[11px] uppercase tracking-wider font-semibold text-primary/80 bg-primary/10 px-2 py-0.5 rounded">
          {activeMode === 'all-days' ? 'Calendar' : activeMode === 'business-days' ? 'Workdays' : activeMode === 'work-hours' ? 'Payroll' : 'Live'}
        </span>
      </div>

      {/* Main Input Form: If in Event Countdown Mode, show Event & Target controls */}
      {activeMode === 'event-countdown' ? (
        <div className="flex flex-col gap-space-md">
          {/* Event Title Card */}
          <div className="flex flex-col gap-space-xs p-space-md bg-surface rounded-xl shadow-sm border border-outline-variant/20">
            <label className="font-headline-md text-headline-md text-on-surface font-semibold flex items-center gap-1.5" htmlFor="eventNameInput">
              <span className="material-symbols-outlined text-primary text-[20px]">flag</span> Event / Milestone Name
            </label>
            <input
              className="w-full bg-surface-container-lowest px-space-sm py-2.5 rounded-lg text-on-surface text-body-md border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/40"
              id="eventNameInput"
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="e.g. Product Launch, Year End 2026, Summer Vacation"
            />
          </div>

          {/* Target Date & Time Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
            <div className="flex flex-col gap-space-xs p-space-md bg-surface rounded-xl shadow-sm border border-outline-variant/20">
              <label className="font-headline-md text-headline-md text-on-surface font-semibold flex items-center gap-1.5" htmlFor="targetDateInput">
                <span className="material-symbols-outlined text-primary text-[20px]">event</span> Target Date
              </label>
              <input
                className="w-full bg-surface-container-lowest px-space-sm py-2.5 rounded-lg text-on-surface font-data-mono text-data-mono border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
                id="targetDateInput"
                type="date"
                value={countdownTargetDate}
                onChange={(e) => setCountdownTargetDate(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-space-xs p-space-md bg-surface rounded-xl shadow-sm border border-outline-variant/20">
              <label className="font-headline-md text-headline-md text-on-surface font-semibold flex items-center gap-1.5" htmlFor="targetTimeInput">
                <span className="material-symbols-outlined text-secondary text-[20px]">schedule</span> Target Time (24h)
              </label>
              <input
                className="w-full bg-surface-container-lowest px-space-sm py-2.5 rounded-lg text-on-surface font-data-mono text-data-mono border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
                id="targetTimeInput"
                type="time"
                step="1"
                value={countdownTargetTime}
                onChange={(e) => setCountdownTargetTime(e.target.value)}
              />
            </div>
          </div>

          {/* Quick Countdown Presets Bar */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[12px] text-on-surface-variant font-medium">Quick Countdown Shortcuts:</span>
            <div className="flex flex-wrap gap-1.5">
              <button
                className="px-2.5 py-1 rounded-md bg-surface-container hover:bg-surface-container-high text-on-surface text-body-sm font-medium transition-colors cursor-pointer border border-outline-variant/20"
                onClick={() => applyPreset('cd-newyear')}
                type="button"
              >
                🎉 New Year 2027
              </button>
              <button
                className="px-2.5 py-1 rounded-md bg-surface-container hover:bg-surface-container-high text-on-surface text-body-sm font-medium transition-colors cursor-pointer border border-outline-variant/20"
                onClick={() => applyPreset('cd-eoy')}
                type="button"
              >
                📅 End of Year 2026
              </button>
              <button
                className="px-2.5 py-1 rounded-md bg-surface-container hover:bg-surface-container-high text-on-surface text-body-sm font-medium transition-colors cursor-pointer border border-outline-variant/20"
                onClick={() => applyPreset('cd-friday')}
                type="button"
              >
                💼 This Friday 5 PM
              </button>
              <button
                className="px-2.5 py-1 rounded-md bg-surface-container hover:bg-surface-container-high text-on-surface text-body-sm font-medium transition-colors cursor-pointer border border-outline-variant/20"
                onClick={() => applyPreset('cd-30days')}
                type="button"
              >
                ⏳ +30 Days
              </button>
              <button
                className="px-2.5 py-1 rounded-md bg-surface-container hover:bg-surface-container-high text-on-surface text-body-sm font-medium transition-colors cursor-pointer border border-outline-variant/20"
                onClick={() => applyPreset('cd-100days')}
                type="button"
              >
                🎯 +100 Days
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Standard Date Range Grid for All Days, Business Days, & Work Hours */
        <div className="flex flex-col gap-space-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
            {/* Start Date Card */}
            <div className="flex flex-col gap-space-xs p-space-md bg-surface rounded-xl shadow-sm border border-outline-variant/20">
              <div className="flex items-center justify-between">
                <label className="font-headline-md text-headline-md text-on-surface font-semibold flex items-center gap-1.5" htmlFor="startDateInput">
                  <span className="material-symbols-outlined text-primary text-[20px]">calendar_today</span> Start Date
                </label>
                <div className="flex items-center gap-1">
                  <button
                    className="px-2 py-0.5 rounded bg-surface-container-high hover:bg-primary hover:text-on-primary text-[11px] font-medium transition-colors cursor-pointer"
                    onClick={() => quickStartDate('today')}
                    type="button"
                  >
                    Today
                  </button>
                  <button
                    className="px-2 py-0.5 rounded bg-surface-container-high hover:bg-primary hover:text-on-primary text-[11px] font-medium transition-colors cursor-pointer"
                    onClick={() => quickStartDate('start-year')}
                    type="button"
                  >
                    Jan 1
                  </button>
                </div>
              </div>
              <input
                className="w-full bg-surface-container-lowest px-space-sm py-2.5 rounded-lg text-on-surface font-data-mono text-data-mono border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
                id="startDateInput"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <div className="flex items-center justify-between pt-1">
                <span className="text-on-surface-variant font-body-sm text-body-sm" id="startDayOfWeek">
                  {startDayName}
                </span>
                <span className="text-on-surface-variant font-body-sm text-[12px]">
                  {startWeekInfo ? `Week ${startWeekInfo.week}` : ''}
                </span>
              </div>
            </div>

            {/* End Date Card */}
            <div className="flex flex-col gap-space-xs p-space-md bg-surface rounded-xl shadow-sm border border-outline-variant/20">
              <div className="flex items-center justify-between">
                <label className="font-headline-md text-headline-md text-on-surface font-semibold flex items-center gap-1.5" htmlFor="endDateInput">
                  <span className="material-symbols-outlined text-secondary text-[20px]">flag</span> End Date
                </label>
                <div className="flex items-center gap-1">
                  <button
                    className="px-1.5 py-0.5 rounded bg-surface-container-high hover:bg-primary hover:text-on-primary text-[11px] font-medium transition-colors cursor-pointer"
                    onClick={() => quickEndDate(30)}
                    type="button"
                  >
                    +30d
                  </button>
                  <button
                    className="px-1.5 py-0.5 rounded bg-surface-container-high hover:bg-primary hover:text-on-primary text-[11px] font-medium transition-colors cursor-pointer"
                    onClick={() => quickEndDate(90)}
                    type="button"
                  >
                    +90d
                  </button>
                  <button
                    className="px-1.5 py-0.5 rounded bg-surface-container-high hover:bg-primary hover:text-on-primary text-[11px] font-medium transition-colors cursor-pointer"
                    onClick={() => quickEndDate(365)}
                    type="button"
                  >
                    +1yr
                  </button>
                </div>
              </div>
              <input
                className="w-full bg-surface-container-lowest px-space-sm py-2.5 rounded-lg text-on-surface font-data-mono text-data-mono border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
                id="endDateInput"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
              <div className="flex items-center justify-between pt-1">
                <span className="text-on-surface-variant font-body-sm text-body-sm" id="endDayOfWeek">
                  {endDayName}
                </span>
                <span className="text-on-surface-variant font-body-sm text-[12px]">
                  {endWeekInfo ? `Week ${endWeekInfo.week}` : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Swap & Validation Strip */}
          <div className="flex items-center justify-between px-space-xs">
            <button
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm transition-colors border border-outline-variant/30 cursor-pointer"
              onClick={swapDates}
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">swap_horiz</span> Swap Dates
            </button>
            <span className="text-on-surface-variant font-body-sm text-body-sm" id="validationFeedback">
              {isReverse ? 'Note: Dates swapped automatically for forward count' : 'Valid date range'}
            </span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE SPECIFIC CONTROLS SECTION */}
      {/* ========================================================================= */}

      {/* 1. BUSINESS DAYS SETTINGS */}
      {activeMode === 'business-days' && (
        <div className="flex flex-col gap-space-sm p-space-md bg-surface rounded-xl border border-primary/20 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-headline-md text-headline-md text-on-surface font-semibold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[20px]">calendar_month</span> Work Week &amp; Weekend Rules
            </h3>
            <span className="text-[12px] text-primary font-medium bg-primary/10 px-2 py-0.5 rounded">Working Days Settings</span>
          </div>

          {/* Work Week Schedule Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            <button
              className={`p-2 rounded-lg text-center font-body-sm border transition-all cursor-pointer ${
                workWeekSchedule === '5-day'
                  ? 'bg-primary text-on-primary border-primary font-semibold shadow-sm'
                  : 'bg-surface-container-lowest text-on-surface border-outline-variant/30 hover:bg-surface-container'
              }`}
              onClick={() => setWorkWeekSchedule('5-day')}
              type="button"
            >
              <span className="block font-medium">5-Day Week</span>
              <span className="text-[11px] opacity-80 block">Mon – Fri</span>
            </button>
            <button
              className={`p-2 rounded-lg text-center font-body-sm border transition-all cursor-pointer ${
                workWeekSchedule === '6-day'
                  ? 'bg-primary text-on-primary border-primary font-semibold shadow-sm'
                  : 'bg-surface-container-lowest text-on-surface border-outline-variant/30 hover:bg-surface-container'
              }`}
              onClick={() => setWorkWeekSchedule('6-day')}
              type="button"
            >
              <span className="block font-medium">6-Day Week</span>
              <span className="text-[11px] opacity-80 block">Mon – Sat</span>
            </button>
            <button
              className={`p-2 rounded-lg text-center font-body-sm border transition-all cursor-pointer ${
                workWeekSchedule === '4-day'
                  ? 'bg-primary text-on-primary border-primary font-semibold shadow-sm'
                  : 'bg-surface-container-lowest text-on-surface border-outline-variant/30 hover:bg-surface-container'
              }`}
              onClick={() => setWorkWeekSchedule('4-day')}
              type="button"
            >
              <span className="block font-medium">4-Day Week</span>
              <span className="text-[11px] opacity-80 block">Mon – Thu</span>
            </button>
            <button
              className={`p-2 rounded-lg text-center font-body-sm border transition-all cursor-pointer ${
                workWeekSchedule === 'sun-thu'
                  ? 'bg-primary text-on-primary border-primary font-semibold shadow-sm'
                  : 'bg-surface-container-lowest text-on-surface border-outline-variant/30 hover:bg-surface-container'
              }`}
              onClick={() => setWorkWeekSchedule('sun-thu')}
              type="button"
            >
              <span className="block font-medium">Sun – Thu</span>
              <span className="text-[11px] opacity-80 block">Gulf / Middle East</span>
            </button>
          </div>

          {/* Custom Weekend Days Pill Toggles */}
          <div className="pt-2 flex flex-col gap-1.5">
            <span className="text-[12px] text-on-surface-variant font-medium">Non-working weekend days:</span>
            <div className="flex flex-wrap gap-1.5">
              {DAY_NAMES.map((d) => {
                const isNonWorking = customWeekendDays.includes(d.day);
                return (
                  <button
                    key={d.day}
                    className={`px-3 py-1.5 rounded-lg text-body-sm font-medium border transition-colors cursor-pointer ${
                      isNonWorking
                        ? 'bg-secondary/15 text-secondary border-secondary/40 font-semibold'
                        : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant/30 hover:bg-surface-container'
                    }`}
                    onClick={() => toggleCustomWeekendDay(d.day)}
                    title={`Click to toggle ${d.full} as working/non-working`}
                    type="button"
                  >
                    {d.label} {isNonWorking ? '(Weekend)' : '(Work)'}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 2. WORK HOURS SETTINGS */}
      {activeMode === 'work-hours' && (
        <div className="flex flex-col gap-space-sm p-space-md bg-surface rounded-xl border border-primary/20 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-headline-md text-headline-md text-on-surface font-semibold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[20px]">badge</span> Shift &amp; Hourly Capacity
            </h3>
            <span className="text-[12px] text-primary font-medium bg-primary/10 px-2 py-0.5 rounded">Work Hours Settings</span>
          </div>

          {/* Hours Input Mode Switcher */}
          <div className="flex gap-2 p-1 bg-surface-container-lowest rounded-lg border border-outline-variant/30">
            <button
              className={`flex-1 py-1.5 px-3 rounded text-center text-body-sm font-medium transition-all cursor-pointer ${
                workHoursMode === 'daily-hours'
                  ? 'bg-primary text-on-primary font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              onClick={() => setWorkHoursMode('daily-hours')}
              type="button"
            >
              Direct Hours / Day
            </button>
            <button
              className={`flex-1 py-1.5 px-3 rounded text-center text-body-sm font-medium transition-all cursor-pointer ${
                workHoursMode === 'shift-time'
                  ? 'bg-primary text-on-primary font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              onClick={() => setWorkHoursMode('shift-time')}
              type="button"
            >
              Shift Schedule &amp; Lunch Break
            </button>
          </div>

          {workHoursMode === 'daily-hours' ? (
            <div className="flex flex-col gap-2 pt-1">
              <div className="flex items-center gap-2">
                <input
                  className="w-32 bg-surface-container-lowest px-3 py-2 rounded-lg text-body-md font-bold text-primary border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 text-center"
                  id="directWorkHoursInput"
                  max="24"
                  min="0.5"
                  step="0.5"
                  type="number"
                  value={workHoursPerDay}
                  onChange={(e) => setWorkHoursPerDay(parseFloat(e.target.value) || 8.0)}
                />
                <span className="text-on-surface-variant text-body-sm">hours per work day</span>
              </div>
              {/* Quick Hours Presets */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[6, 7, 7.5, 8, 8.5, 10, 12].map((h) => (
                  <button
                    key={h}
                    className={`px-2.5 py-1 rounded text-[12px] font-medium border cursor-pointer ${
                      workHoursPerDay === h
                        ? 'bg-primary text-on-primary border-primary'
                        : 'bg-surface-container-lowest text-on-surface border-outline-variant/30 hover:bg-surface-container'
                    }`}
                    onClick={() => setWorkHoursPerDay(h)}
                    type="button"
                  >
                    {h} hrs
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm pt-1">
              <div>
                <label className="text-[12px] text-on-surface-variant font-medium block mb-1" htmlFor="shiftStartInput">
                  Shift Start
                </label>
                <input
                  className="w-full bg-surface-container-lowest px-3 py-2 rounded-lg text-body-sm font-data-mono border border-outline-variant/40"
                  id="shiftStartInput"
                  type="time"
                  value={shiftStartTime}
                  onChange={(e) => setShiftStartTime(e.target.value)}
                />
              </div>
              <div>
                <label className="text-[12px] text-on-surface-variant font-medium block mb-1" htmlFor="shiftEndInput">
                  Shift End
                </label>
                <input
                  className="w-full bg-surface-container-lowest px-3 py-2 rounded-lg text-body-sm font-data-mono border border-outline-variant/40"
                  id="shiftEndInput"
                  type="time"
                  value={shiftEndTime}
                  onChange={(e) => setShiftEndTime(e.target.value)}
                />
              </div>
              <div>
                <label className="text-[12px] text-on-surface-variant font-medium block mb-1" htmlFor="lunchBreakInput">
                  Unpaid Lunch Break
                </label>
                <select
                  className="w-full bg-surface-container-lowest px-3 py-2 rounded-lg text-body-sm border border-outline-variant/40"
                  id="lunchBreakInput"
                  value={lunchBreakMins}
                  onChange={(e) => setLunchBreakMins(parseInt(e.target.value, 10))}
                >
                  <option value={0}>0 mins (No break)</option>
                  <option value={30}>30 mins</option>
                  <option value={45}>45 mins</option>
                  <option value={60}>60 mins (1 hour)</option>
                </select>
              </div>
              <div className="sm:col-span-3 p-2 rounded bg-primary/10 text-primary text-body-sm font-medium flex items-center justify-between">
                <span>Calculated Effective Shift:</span>
                <span className="font-bold">{effectiveDailyHours.toFixed(1)} net work hours / day</span>
              </div>
            </div>
          )}

          {/* Optional Billing Rate & Full-Time Equivalent (FTE) Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm pt-2 border-t border-outline-variant/20">
            <div>
              <label className="text-[12px] text-on-surface-variant font-medium block mb-1" htmlFor="hourlyRateInput">
                Hourly Pay / Billing Rate (Optional)
              </label>
              <div className="flex items-center gap-1.5">
                <span className="text-on-surface-variant font-bold">$</span>
                <input
                  className="w-full bg-surface-container-lowest px-3 py-2 rounded-lg text-body-sm font-data-mono border border-outline-variant/40"
                  id="hourlyRateInput"
                  min="0"
                  placeholder="e.g. 45"
                  step="1"
                  type="number"
                  value={hourlyRate || ''}
                  onChange={(e) => setHourlyRate(parseFloat(e.target.value) || 0)}
                />
                <span className="text-on-surface-variant text-[12px] shrink-0">/ hr</span>
              </div>
            </div>
            <div>
              <label className="text-[12px] text-on-surface-variant font-medium block mb-1" htmlFor="fteWeeklyHoursInput">
                Full-Time Equivalent (FTE) Basis
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  className="w-full bg-surface-container-lowest px-3 py-2 rounded-lg text-body-sm font-data-mono border border-outline-variant/40"
                  id="fteWeeklyHoursInput"
                  max="60"
                  min="20"
                  step="1"
                  type="number"
                  value={fteWeeklyHours}
                  onChange={(e) => setFteWeeklyHours(parseFloat(e.target.value) || 40)}
                />
                <span className="text-on-surface-variant text-[12px] shrink-0">hrs / wk</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PUBLIC HOLIDAYS & CALCULATION OPTIONS */}
      {/* ========================================================================= */}
      <div className="flex flex-col gap-space-sm pt-space-xs">
        <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">Exclusions &amp; Options</h3>

        {/* Option 1: Include End Date */}
        <label className="flex items-start gap-space-sm p-space-sm rounded-lg bg-surface hover:bg-surface-container-low cursor-pointer transition-colors border border-outline-variant/20">
          <input
            className="mt-1 h-4 w-4 text-primary rounded focus:ring-primary border-outline cursor-pointer"
            id="includeEndDayCheck"
            checked={includeEndDate}
            onChange={(e) => setIncludeEndDate(e.target.checked)}
            type="checkbox"
          />
          <div className="flex flex-col">
            <span className="font-body-md text-body-md text-on-surface font-medium">Include end date in count (+1 day)</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">Counts both the start date and the end date.</span>
          </div>
        </label>

        {/* Option 2: Skip Weekends (Relevant if in All Days mode) */}
        {activeMode === 'all-days' && (
          <label className="flex items-start gap-space-sm p-space-sm rounded-lg bg-surface hover:bg-surface-container-low cursor-pointer transition-colors border border-outline-variant/20">
            <input
              className="mt-1 h-4 w-4 text-primary rounded focus:ring-primary border-outline cursor-pointer"
              id="excludeWeekendsCheck"
              checked={excludeWeekends}
              onChange={(e) => setExcludeWeekends(e.target.checked)}
              type="checkbox"
            />
            <div className="flex flex-col">
              <span className="font-body-md text-body-md text-on-surface font-medium">Skip weekends</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">Excludes Saturdays and Sundays from the primary count.</span>
            </div>
          </label>
        )}

        {/* Option 3: Skip Public Holidays & Jurisdiction Dropdown */}
        <div className="p-space-sm rounded-lg bg-surface flex flex-col gap-space-xs border border-outline-variant/20">
          <label className="flex items-start gap-space-sm cursor-pointer">
            <input
              className="mt-1 h-4 w-4 text-primary rounded focus:ring-primary border-outline cursor-pointer"
              id="excludeHolidaysCheck"
              checked={excludeHolidays}
              onChange={(e) => setExcludeHolidays(e.target.checked)}
              type="checkbox"
            />
            <div className="flex flex-col">
              <span className="font-body-md text-body-md text-on-surface font-medium">Skip recognized public holidays</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">Excludes official statutory national holidays.</span>
            </div>
          </label>

          {/* Country Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm pt-space-xs pl-7">
            <div>
              <label className="font-body-sm text-body-sm font-medium text-on-surface-variant block mb-1" htmlFor="holidayJurisdiction">
                Country / Public Holiday Schedule
              </label>
              <select
                className="w-full bg-surface-container-lowest px-3 py-2 rounded-lg text-body-sm font-body-sm text-on-surface border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
                id="holidayJurisdiction"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option value="US">United States (Federal)</option>
                <option value="UK">United Kingdom (Bank Holidays)</option>
                <option value="CA">Canada (Statutory)</option>
                <option value="AU">Australia (National)</option>
                <option value="IN">India (Gazetted)</option>
                <option value="DE">Germany (Federal)</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                className="w-full py-2 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm border border-outline-variant/30 flex items-center justify-between transition-colors cursor-pointer"
                onClick={() => setShowHolidayDetails(!showHolidayDetails)}
                type="button"
              >
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-tertiary">celebration</span>
                  <span>{matchedHolidays.length} Holidays in Range</span>
                </span>
                <span className="material-symbols-outlined text-[18px]">
                  {showHolidayDetails ? 'expand_less' : 'expand_more'}
                </span>
              </button>
            </div>
          </div>

          {/* Collapsible Matched Holidays Detail Box */}
          {showHolidayDetails && (
            <div className="mt-2 pl-7 flex flex-col gap-1.5 text-body-sm">
              {matchedHolidays.length === 0 ? (
                <div className="p-2.5 rounded bg-surface-container-lowest text-on-surface-variant text-[13px]">
                  No official public holidays fall within the selected date span.
                </div>
              ) : (
                <div className="max-h-48 overflow-y-auto pr-1 flex flex-col gap-1">
                  {matchedHolidays.map((h, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded bg-surface-container-lowest flex items-center justify-between border border-outline-variant/20 text-[13px]"
                    >
                      <span className="text-on-surface font-medium">{h.name}</span>
                      <span className="text-on-surface-variant font-data-mono text-[12px]">
                        {h.date} ({h.dayOfWeek})
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons Bar */}
      <div className="flex flex-wrap items-center gap-space-sm pt-space-xs">
        <button
          className="flex-1 min-w-[180px] py-3 px-space-md rounded-xl bg-primary text-on-primary font-headline-md text-[18px] font-semibold text-center hover:bg-primary-container shadow-md transition-all cursor-pointer"
          onClick={() => {
            const banner = document.getElementById('primaryHighlightBanner');
            if (banner) banner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }}
          type="button"
        >
          {activeMode === 'all-days' && 'Calculate Days'}
          {activeMode === 'business-days' && 'Calculate Business Days'}
          {activeMode === 'work-hours' && 'Calculate Work Hours'}
          {activeMode === 'event-countdown' && 'Update Countdown'}
        </button>
        <button
          className="px-5 py-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-body-md text-body-md transition-colors border border-outline-variant/30 cursor-pointer"
          onClick={resetForm}
          type="button"
        >
          Reset
        </button>
        <button
          className="px-5 py-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-body-md text-body-md flex items-center gap-1.5 transition-colors border border-outline-variant/30 cursor-pointer"
          onClick={copyShareableUrl}
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">share</span>
          <span>{shareFeedback ? 'Copied Link!' : 'Share'}</span>
        </button>
      </div>
    </div>
  );
}
