'use client';

import React from 'react';
import {
  type ModeType,
  type WorkWeekSchedule,
  type WorkHoursMethod,
  type HolidayDetail,
  COUNTRY_NAMES,
} from '../dateDifferenceUtils';

interface Props {
  activeMode: ModeType;
  handleSetMode: (mode: ModeType) => void;
  // Dates
  startDate: string;
  setStartDate: (val: string) => void;
  endDate: string;
  setEndDate: (val: string) => void;
  startDayName: string;
  endDayName: string;
  startWeekInfo: { week: number; year: number } | null;
  endWeekInfo: { week: number; year: number } | null;
  quickStartDate: (type: 'today' | 'start-year') => void;
  quickEndDate: (addDays: number) => void;
  swapDates: () => void;
  isReverse?: boolean;
  // Common options
  includeEndDate: boolean;
  setIncludeEndDate: (val: boolean) => void;
  excludeWeekends: boolean;
  setExcludeWeekends: (val: boolean) => void;
  excludeHolidays: boolean;
  setExcludeHolidays: (val: boolean) => void;
  country: string;
  setCountry: (val: string) => void;
  // Business Days options
  workWeekSchedule: WorkWeekSchedule;
  setWorkWeekSchedule: (val: WorkWeekSchedule) => void;
  customWeekendDays: number[];
  toggleCustomWeekendDay: (dayIndex: number) => void;
  matchedHolidays: HolidayDetail[];
  // Work Hours options
  workHoursMode: WorkHoursMethod;
  setWorkHoursMode: (val: WorkHoursMethod) => void;
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
  // Countdown options
  eventName: string;
  setEventName: (val: string) => void;
  countdownTargetDate: string;
  setCountdownTargetDate: (val: string) => void;
  countdownTargetTime: string;
  setCountdownTargetTime: (val: string) => void;
  applyPreset: (preset: string) => void;
  // Action bar
  resetForm: () => void;
  copyShareableUrl: () => void;
  shareFeedback: boolean;
}

const DAYS_MAP = [
  { index: 0, label: 'Sun', full: 'Sunday' },
  { index: 1, label: 'Mon', full: 'Monday' },
  { index: 2, label: 'Tue', full: 'Tuesday' },
  { index: 3, label: 'Wed', full: 'Wednesday' },
  { index: 4, label: 'Thu', full: 'Thursday' },
  { index: 5, label: 'Fri', full: 'Friday' },
  { index: 6, label: 'Sat', full: 'Saturday' },
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
}: Props) {
  const [showHolidaysList, setShowHolidaysList] = React.useState(false);

  return (
    <div className="lg:col-span-7 flex flex-col gap-space-lg bg-surface-container-lowest p-space-md lg:p-space-xl rounded-xl shadow-md border border-outline-variant/30">
      {/* Mode Selector Tabs */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-1 p-1 bg-surface-container-low rounded-lg" id="modeSelector">
          <button
            className={`mode-tab-btn flex-1 min-w-[100px] py-2 px-3 rounded-lg text-center font-label-caps text-label-caps uppercase tracking-wider transition-all cursor-pointer ${
              activeMode === 'all-days'
                ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
            onClick={() => handleSetMode('all-days')}
            type="button"
          >
            All Days
          </button>
          <button
            className={`mode-tab-btn flex-1 min-w-[100px] py-2 px-3 rounded-lg text-center font-label-caps text-label-caps uppercase tracking-wider transition-all cursor-pointer ${
              activeMode === 'business-days'
                ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
            onClick={() => handleSetMode('business-days')}
            type="button"
          >
            Business Days
          </button>
          <button
            className={`mode-tab-btn flex-1 min-w-[100px] py-2 px-3 rounded-lg text-center font-label-caps text-label-caps uppercase tracking-wider transition-all cursor-pointer ${
              activeMode === 'work-hours'
                ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
            onClick={() => handleSetMode('work-hours')}
            type="button"
          >
            Work Hours
          </button>
          <button
            className={`mode-tab-btn flex-1 min-w-[100px] py-2 px-3 rounded-lg text-center font-label-caps text-label-caps uppercase tracking-wider transition-all cursor-pointer ${
              activeMode === 'event-countdown'
                ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
            onClick={() => handleSetMode('event-countdown')}
            type="button"
          >
            Countdown
          </button>
        </div>

        {/* Mode Explanatory Subtitle */}
        <p className="text-on-surface-variant font-body-sm text-[13px] px-1">
          {activeMode === 'all-days' && 'Count exact calendar days, weeks, months, and hours between any two calendar dates.'}
          {activeMode === 'business-days' && 'Calculate net working days, excluding weekends (customizable) and recognized public holidays.'}
          {activeMode === 'work-hours' && 'Calculate net billable or operational work hours based on daily shifts, lunch breaks, and wage rates.'}
          {activeMode === 'event-countdown' && 'Live real-time ticking countdown to any target deadline, with remaining business days & work hours.'}
        </p>
      </div>

      {/* Countdown Mode Specific Inputs */}
      {activeMode === 'event-countdown' ? (
        <div className="flex flex-col gap-space-md">
          {/* Event Title & Quick Presets */}
          <div className="p-space-md bg-surface rounded-xl shadow-sm border border-outline-variant/20 flex flex-col gap-space-xs">
            <label className="font-headline-md text-headline-md text-on-surface font-semibold flex items-center gap-1.5" htmlFor="eventNameInput">
              <span className="material-symbols-outlined text-primary text-[20px]">event</span> Event / Milestone Name
            </label>
            <input
              className="w-full bg-surface-container-lowest px-space-sm py-2.5 rounded-lg text-on-surface font-body-md border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/40"
              id="eventNameInput"
              type="text"
              placeholder="e.g. Project Launch, Product Release, Wedding"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />
            {/* Quick Countdown Presets */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2">
              <span className="text-[12px] text-on-surface-variant font-medium mr-1">Quick Events:</span>
              <button
                type="button"
                className="px-2.5 py-1 rounded bg-surface-container-high hover:bg-primary hover:text-on-primary text-[12px] font-medium transition-colors cursor-pointer"
                onClick={() => applyPreset('cd-newyear')}
              >
                New Year
              </button>
              <button
                type="button"
                className="px-2.5 py-1 rounded bg-surface-container-high hover:bg-primary hover:text-on-primary text-[12px] font-medium transition-colors cursor-pointer"
                onClick={() => applyPreset('cd-eoy')}
              >
                End of Year
              </button>
              <button
                type="button"
                className="px-2.5 py-1 rounded bg-surface-container-high hover:bg-primary hover:text-on-primary text-[12px] font-medium transition-colors cursor-pointer"
                onClick={() => applyPreset('cd-friday')}
              >
                Friday 5 PM
              </button>
              <button
                type="button"
                className="px-2.5 py-1 rounded bg-surface-container-high hover:bg-primary hover:text-on-primary text-[12px] font-medium transition-colors cursor-pointer"
                onClick={() => applyPreset('cd-30days')}
              >
                +30 Days
              </button>
              <button
                type="button"
                className="px-2.5 py-1 rounded bg-surface-container-high hover:bg-primary hover:text-on-primary text-[12px] font-medium transition-colors cursor-pointer"
                onClick={() => applyPreset('cd-100days')}
              >
                +100 Days
              </button>
            </div>
          </div>

          {/* Target Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
            <div className="flex flex-col gap-space-xs p-space-md bg-surface rounded-xl shadow-sm border border-outline-variant/20">
              <label className="font-headline-md text-headline-md text-on-surface font-semibold flex items-center gap-1.5" htmlFor="targetDateInput">
                <span className="material-symbols-outlined text-primary text-[20px]">calendar_today</span> Target Date
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
                <span className="material-symbols-outlined text-secondary text-[20px]">schedule</span> Target Time
              </label>
              <input
                className="w-full bg-surface-container-lowest px-space-sm py-2.5 rounded-lg text-on-surface font-data-mono text-data-mono border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-secondary/40 cursor-pointer"
                id="targetTimeInput"
                type="time"
                value={countdownTargetTime}
                onChange={(e) => setCountdownTargetTime(e.target.value)}
              />
            </div>
          </div>

          {/* Countdown Working Settings */}
          <div className="p-space-sm rounded-lg bg-surface flex flex-col gap-space-xs border border-outline-variant/20">
            <span className="font-body-md text-body-md text-on-surface font-semibold">Remaining Work Hours Settings</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm pt-1">
              <div>
                <label className="font-body-sm text-body-sm font-medium text-on-surface-variant block mb-1" htmlFor="cdHoursPerDay">
                  Working hours / day
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    className="w-full bg-surface-container-lowest px-3 py-2 rounded-lg text-body-sm font-body-sm text-on-surface border border-outline-variant/40"
                    id="cdHoursPerDay"
                    type="number"
                    min="1"
                    max="24"
                    step="0.5"
                    value={workHoursPerDay}
                    onChange={(e) => setWorkHoursPerDay(parseFloat(e.target.value) || 8.0)}
                  />
                  <span className="text-on-surface-variant text-[13px] shrink-0">hrs</span>
                </div>
              </div>
              <div>
                <label className="font-body-sm text-body-sm font-medium text-on-surface-variant block mb-1" htmlFor="cdCountry">
                  Public Holidays
                </label>
                <select
                  className="w-full bg-surface-container-lowest px-3 py-2 rounded-lg text-body-sm font-body-sm text-on-surface border border-outline-variant/40"
                  id="cdCountry"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                >
                  {Object.entries(COUNTRY_NAMES).map(([code, name]) => (
                    <option key={code} value={code}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Standard Date Range Inputs for All Days, Business Days, Work Hours */
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
                  {endWeekInfo ? `Week ${endWeekInfo.week}${endWeekInfo.year !== (startWeekInfo?.year ?? endWeekInfo.year) ? ` (${endWeekInfo.year})` : ''}` : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Swap & Status Strip */}
          <div className="flex items-center justify-between px-space-xs">
            <button
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm transition-colors border border-outline-variant/30 cursor-pointer"
              onClick={swapDates}
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">swap_horiz</span> Swap Dates
            </button>
            <span className="text-on-surface-variant font-body-sm text-body-sm" id="validationFeedback">
              {isReverse ? 'Note: Dates swapped chronologically' : 'Valid date range'}
            </span>
          </div>

          {/* MODE SPECIFIC OPTIONS: Business Days Mode */}
          {activeMode === 'business-days' && (
            <div className="flex flex-col gap-space-sm p-space-md rounded-xl bg-surface border border-outline-variant/20 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-headline-md text-headline-md text-on-surface font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-[20px]">business_center</span> Business Days Settings
                </h3>
                <span className="text-[12px] text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-full">
                  Net Working Days
                </span>
              </div>

              {/* Work Week Schedule */}
              <div className="flex flex-col gap-1 pt-1">
                <label className="font-body-sm text-body-sm font-medium text-on-surface-variant" htmlFor="workWeekSelect">
                  Work Week Schedule
                </label>
                <select
                  id="workWeekSelect"
                  className="w-full bg-surface-container-lowest px-3 py-2.5 rounded-lg text-body-sm font-body-sm text-on-surface border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  value={workWeekSchedule}
                  onChange={(e) => setWorkWeekSchedule(e.target.value as WorkWeekSchedule)}
                >
                  <option value="5-day">Standard 5-Day (Monday – Friday, Sat & Sun Off)</option>
                  <option value="6-day">6-Day Work Week (Monday – Saturday, Sunday Off)</option>
                  <option value="4-day">4-Day Work Week (Monday – Thursday, Fri-Sun Off)</option>
                  <option value="sun-thu">Sunday – Thursday (Fri & Sat Off, Middle East)</option>
                  <option value="custom">Custom Weekend Days</option>
                </select>
              </div>

              {/* Custom Weekend Days Selector */}
              {workWeekSchedule === 'custom' && (
                <div className="flex flex-col gap-1.5 p-space-sm bg-surface-container-lowest rounded-lg border border-outline-variant/30">
                  <span className="text-[12px] font-medium text-on-surface-variant">Select Non-Working / Weekend Days:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {DAYS_MAP.map((day) => {
                      const isSelected = customWeekendDays.includes(day.index);
                      return (
                        <button
                          key={day.index}
                          type="button"
                          onClick={() => toggleCustomWeekendDay(day.index)}
                          className={`px-3 py-1 rounded-md text-[13px] font-medium transition-all ${
                            isSelected
                              ? 'bg-primary text-on-primary font-semibold shadow-xs'
                              : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                          }`}
                        >
                          {day.label} {isSelected && '✓'}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Public Holidays Toggle & Country */}
              <div className="flex flex-col gap-2 pt-2 border-t border-outline-variant/20">
                <label className="flex items-start gap-space-sm cursor-pointer">
                  <input
                    className="mt-1 h-4 w-4 text-primary rounded focus:ring-primary border-outline cursor-pointer"
                    checked={excludeHolidays}
                    onChange={(e) => setExcludeHolidays(e.target.checked)}
                    type="checkbox"
                  />
                  <div className="flex flex-col">
                    <span className="font-body-md text-body-md text-on-surface font-medium">Skip Public Holidays</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      Deducts official statutory holidays falling on working days.
                    </span>
                  </div>
                </label>

                {excludeHolidays && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm pl-7 pt-1">
                    <div>
                      <label className="font-body-sm text-body-sm font-medium text-on-surface-variant block mb-1" htmlFor="bizCountry">
                        Country / Jurisdiction
                      </label>
                      <select
                        className="w-full bg-surface-container-lowest px-3 py-2 rounded-lg text-body-sm font-body-sm text-on-surface border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30"
                        id="bizCountry"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                      >
                        {Object.entries(COUNTRY_NAMES).map(([code, name]) => (
                          <option key={code} value={code}>
                            {name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => setShowHolidaysList(!showHolidaysList)}
                        className="w-full py-2 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-body-sm text-[13px] font-medium flex items-center justify-between border border-outline-variant/30"
                      >
                        <span>{matchedHolidays.length} Holidays in Range</span>
                        <span className="material-symbols-outlined text-[18px]">
                          {showHolidaysList ? 'expand_less' : 'expand_more'}
                        </span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Expandable Holidays List */}
                {excludeHolidays && showHolidaysList && (
                  <div className="mt-2 p-3 bg-surface-container-lowest rounded-lg border border-outline-variant/30 text-body-sm">
                    {matchedHolidays.length === 0 ? (
                      <p className="text-on-surface-variant text-[13px]">No official national holidays fall within this date range.</p>
                    ) : (
                      <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto">
                        <span className="text-[12px] font-semibold text-primary uppercase tracking-wide">
                          Holidays Skipped ({COUNTRY_NAMES[country]}):
                        </span>
                        {matchedHolidays.map((h, i) => (
                          <div key={i} className="flex items-center justify-between py-1 border-b border-outline-variant/10 text-[13px]">
                            <span className="font-medium text-on-surface">{h.name}</span>
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

              {/* Include End Date */}
              <label className="flex items-start gap-space-sm pt-2 border-t border-outline-variant/20 cursor-pointer">
                <input
                  className="mt-1 h-4 w-4 text-primary rounded focus:ring-primary border-outline cursor-pointer"
                  checked={includeEndDate}
                  onChange={(e) => setIncludeEndDate(e.target.checked)}
                  type="checkbox"
                />
                <div className="flex flex-col">
                  <span className="font-body-md text-body-md text-on-surface font-medium">Include end date in count (+1 day)</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Treats the final day as a business day if it falls on a work day.</span>
                </div>
              </label>
            </div>
          )}

          {/* MODE SPECIFIC OPTIONS: Work Hours Mode */}
          {activeMode === 'work-hours' && (
            <div className="flex flex-col gap-space-sm p-space-md rounded-xl bg-surface border border-outline-variant/20 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-headline-md text-headline-md text-on-surface font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-secondary text-[20px]">timer</span> Work Hours & Shift Setup
                </h3>
                <span className="text-[12px] text-secondary font-medium bg-secondary/10 px-2 py-0.5 rounded-full">
                  {effectiveDailyHours} hrs/day effective
                </span>
              </div>

              {/* Calculation Method Toggle */}
              <div className="flex gap-1 p-1 bg-surface-container-low rounded-lg">
                <button
                  type="button"
                  onClick={() => setWorkHoursMode('direct')}
                  className={`flex-1 py-1.5 text-center text-[13px] font-medium rounded-md transition-all ${
                    workHoursMode === 'direct'
                      ? 'bg-surface-container-lowest text-secondary font-semibold shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Direct Daily Hours
                </button>
                <button
                  type="button"
                  onClick={() => setWorkHoursMode('shift')}
                  className={`flex-1 py-1.5 text-center text-[13px] font-medium rounded-md transition-all ${
                    workHoursMode === 'shift'
                      ? 'bg-surface-container-lowest text-secondary font-semibold shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Shift Times & Break
                </button>
              </div>

              {/* Direct Daily Hours Input */}
              {workHoursMode === 'direct' ? (
                <div className="flex flex-col gap-2 pt-1">
                  <label className="font-body-sm text-body-sm font-medium text-on-surface-variant block" htmlFor="directHours">
                    Standard Daily Hours
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      id="directHours"
                      type="number"
                      min="0.5"
                      max="24"
                      step="0.25"
                      value={workHoursPerDay}
                      onChange={(e) => setWorkHoursPerDay(parseFloat(e.target.value) || 8.0)}
                      className="w-32 bg-surface-container-lowest px-3 py-2 rounded-lg text-body-sm font-body-sm text-on-surface border border-outline-variant/40"
                    />
                    <div className="flex flex-wrap gap-1">
                      {[7.0, 7.5, 8.0, 8.5, 10.0].map((h) => (
                        <button
                          key={h}
                          type="button"
                          onClick={() => setWorkHoursPerDay(h)}
                          className={`px-2 py-1 rounded text-[12px] font-medium border ${
                            workHoursPerDay === h
                              ? 'bg-secondary text-on-secondary border-secondary'
                              : 'bg-surface-container text-on-surface border-outline-variant/30 hover:bg-surface-container-high'
                          }`}
                        >
                          {h}h
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Shift Start/End + Lunch Break */
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                  <div>
                    <label className="text-[12px] font-medium text-on-surface-variant block mb-1">Shift Start</label>
                    <input
                      type="time"
                      value={shiftStartTime}
                      onChange={(e) => setShiftStartTime(e.target.value)}
                      className="w-full bg-surface-container-lowest px-2 py-1.5 rounded-lg text-body-sm border border-outline-variant/40"
                    />
                  </div>
                  <div>
                    <label className="text-[12px] font-medium text-on-surface-variant block mb-1">Shift End</label>
                    <input
                      type="time"
                      value={shiftEndTime}
                      onChange={(e) => setShiftEndTime(e.target.value)}
                      className="w-full bg-surface-container-lowest px-2 py-1.5 rounded-lg text-body-sm border border-outline-variant/40"
                    />
                  </div>
                  <div>
                    <label className="text-[12px] font-medium text-on-surface-variant block mb-1">Unpaid Break (mins)</label>
                    <input
                      type="number"
                      step="15"
                      min="0"
                      max="180"
                      value={lunchBreakMins}
                      onChange={(e) => setLunchBreakMins(parseInt(e.target.value, 10) || 0)}
                      className="w-full bg-surface-container-lowest px-2 py-1.5 rounded-lg text-body-sm border border-outline-variant/40"
                    />
                  </div>
                </div>
              )}

              {/* Optional Hourly Wage / Billing Rate */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm pt-2 border-t border-outline-variant/20">
                <div>
                  <label className="font-body-sm text-body-sm font-medium text-on-surface-variant block mb-1" htmlFor="hourlyRateInput">
                    Billing / Hourly Rate (Optional)
                  </label>
                  <div className="flex items-center gap-1.5">
                    <span className="text-on-surface-variant font-medium text-[14px]">$</span>
                    <input
                      id="hourlyRateInput"
                      type="number"
                      min="0"
                      step="1"
                      placeholder="e.g. 45"
                      value={hourlyRate || ''}
                      onChange={(e) => setHourlyRate(parseFloat(e.target.value) || 0)}
                      className="w-full bg-surface-container-lowest px-3 py-2 rounded-lg text-body-sm font-body-sm text-on-surface border border-outline-variant/40"
                    />
                    <span className="text-on-surface-variant text-[13px] shrink-0">/hr</span>
                  </div>
                </div>

                <div>
                  <label className="font-body-sm text-body-sm font-medium text-on-surface-variant block mb-1" htmlFor="fteSelect">
                    Full-Time Benchmark (FTE)
                  </label>
                  <select
                    id="fteSelect"
                    value={fteWeeklyHours}
                    onChange={(e) => setFteWeeklyHours(parseFloat(e.target.value) || 40)}
                    className="w-full bg-surface-container-lowest px-3 py-2 rounded-lg text-body-sm font-body-sm text-on-surface border border-outline-variant/40"
                  >
                    <option value="40">40 Hours / Week (Standard)</option>
                    <option value="37.5">37.5 Hours / Week</option>
                    <option value="35">35 Hours / Week</option>
                  </select>
                </div>
              </div>

              {/* Exclude Public Holidays & Weekends toggles */}
              <div className="flex flex-wrap gap-4 pt-2 border-t border-outline-variant/20">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={excludeWeekends}
                    onChange={(e) => setExcludeWeekends(e.target.checked)}
                    className="h-4 w-4 text-secondary rounded focus:ring-secondary border-outline"
                  />
                  <span className="text-body-sm font-medium text-on-surface">Skip Weekends</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={excludeHolidays}
                    onChange={(e) => setExcludeHolidays(e.target.checked)}
                    className="h-4 w-4 text-secondary rounded focus:ring-secondary border-outline"
                  />
                  <span className="text-body-sm font-medium text-on-surface">Skip Public Holidays ({country})</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeEndDate}
                    onChange={(e) => setIncludeEndDate(e.target.checked)}
                    className="h-4 w-4 text-secondary rounded focus:ring-secondary border-outline"
                  />
                  <span className="text-body-sm font-medium text-on-surface">Include End Date</span>
                </label>
              </div>
            </div>
          )}

          {/* MODE SPECIFIC OPTIONS: All Days Mode */}
          {activeMode === 'all-days' && (
            <div className="flex flex-col gap-space-sm pt-space-xs">
              <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">Calculation Options</h3>
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
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Counts both the start and end dates.</span>
                </div>
              </label>
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
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Excludes Saturdays and Sundays.</span>
                </div>
              </label>
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
                    <span className="font-body-md text-body-md text-on-surface font-medium">Skip public holidays</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Excludes recognized national holidays.</span>
                  </div>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm pt-space-xs pl-7">
                  <div>
                    <label className="font-body-sm text-body-sm font-medium text-on-surface-variant block mb-1" htmlFor="allDaysCountry">
                      Country / Region
                    </label>
                    <select
                      className="w-full bg-surface-container-lowest px-3 py-2 rounded-lg text-body-sm font-body-sm text-on-surface border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
                      id="allDaysCountry"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                    >
                      {Object.entries(COUNTRY_NAMES).map(([code, name]) => (
                        <option key={code} value={code}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="font-body-sm text-body-sm font-medium text-on-surface-variant block mb-1" htmlFor="allDaysHoursInput">
                      Work hours per day
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        className="w-full bg-surface-container-lowest px-3 py-2 rounded-lg text-body-sm font-body-sm text-on-surface border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30"
                        id="allDaysHoursInput"
                        max="24"
                        min="1"
                        step="0.5"
                        type="number"
                        value={workHoursPerDay}
                        onChange={(e) => setWorkHoursPerDay(parseFloat(e.target.value) || 8.0)}
                      />
                      <span className="text-on-surface-variant font-body-sm text-[13px] shrink-0">hrs/day</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Buttons Action Bar */}
      <div className="flex flex-wrap items-center gap-space-sm pt-space-xs">
        <button
          className="flex-1 min-w-[180px] py-3 px-space-md rounded-xl bg-primary text-on-primary font-headline-md text-[18px] font-semibold text-center hover:bg-primary-container shadow-md transition-all cursor-pointer"
          onClick={() => {
            const banner = document.getElementById('primaryHighlightBanner');
            if (banner) banner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }}
          type="button"
        >
          {activeMode === 'event-countdown' ? 'Update Countdown' : 'Calculate Duration'}
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
