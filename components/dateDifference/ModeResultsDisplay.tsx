'use client';

import React from 'react';
import {
  type ModeType,
  type HolidayDetail,
  formatReadableDate,
} from '../dateDifferenceUtils';

interface CalcResultsType {
  isReverse: boolean;
  d1: Date;
  d2: Date;
  msDiff: number;
  totalCalendarDays: number;
  businessDays: number;
  weekendDays: number;
  holidaysCount: number;
  matchedHolidays: HolidayDetail[];
  totalWeeks: string;
  totalHours: number;
  totalMinutes: number;
  daysPerWorkWeek: number;
  businessWeeks: string;
  businessDaysPercent: string;
  effectiveDailyHours: number;
  calculatedWorkHours: number;
  totalWorkMinutes: number;
  grossNumericPay: number;
  estimatedGrossPay: string | null;
  fteWeeks: string;
  workHoursPercent: string;
  humanDuration: string;
  yearPercent: string;
  midTime: Date;
  quarter25Time: Date;
  quarter75Time: Date;
  totalFridays: number;
  agileSprints: string;
  quartersSpanned: string;
}

interface CountdownResultsType {
  targetDateTime: Date;
  diffMs: number;
  isPast: boolean;
  cDays: number;
  cHours: number;
  cMinutes: number;
  cSeconds: number;
  countdownBusinessDays: number;
  countdownWorkHours: number;
}

interface Props {
  activeMode: ModeType;
  calcResults: CalcResultsType | null;
  countdownResults: CountdownResultsType;
  eventName: string;
  countdownTargetDate: string;
  countdownTargetTime: string;
  country: string;
  copyResults: () => void;
  copyFeedback: string;
  exportCSV: () => void;
}

export default function ModeResultsDisplay({
  activeMode,
  calcResults,
  countdownResults,
  eventName,
  countdownTargetDate,
  countdownTargetTime,
  country,
  copyResults,
  copyFeedback,
  exportCSV,
}: Props) {
  return (
    <div className="lg:col-span-5 flex flex-col gap-space-md sticky top-20">
      {/* Primary Highlight Banner */}
      <div
        id="primaryHighlightBanner"
        className="p-space-lg lg:p-space-xl rounded-xl bg-gradient-to-br from-surface-container-lowest via-surface-container-low to-surface-container-high shadow-xl border border-outline-variant/20 relative overflow-hidden"
      >
        {/* EVENT COUNTDOWN HERO */}
        {activeMode === 'event-countdown' ? (
          <div className="flex flex-col gap-space-sm">
            {/* Countdown Header with Pulse */}
            <div className="flex items-center justify-between">
              <span className="font-label-caps text-label-caps uppercase tracking-wider text-secondary font-semibold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">alarm</span> Countdown
              </span>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-secondary/15 text-secondary">
                <span className={`w-2 h-2 rounded-full ${countdownResults.isPast ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`} />
                <span>{countdownResults.isPast ? 'Event Passed' : 'Live Counting'}</span>
              </div>
            </div>

            <h2 className="text-xl lg:text-2xl font-bold text-on-surface tracking-tight line-clamp-1">
              {eventName || 'Upcoming Deadline'}
            </h2>

            <p className="text-[13px] text-on-surface-variant font-medium">
              Target: <span className="text-on-surface font-semibold">{countdownTargetDate}</span> at{' '}
              <span className="text-on-surface font-semibold">{countdownTargetTime || '00:00'}</span>
            </p>

            {/* Large 4-Column Live Digital Timer */}
            <div className="grid grid-cols-4 gap-2 py-2">
              <div className="flex flex-col items-center justify-center p-2.5 bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-xs">
                <span className="font-numerical-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-on-surface">
                  {countdownResults.cDays}
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant mt-0.5">Days</span>
              </div>
              <div className="flex flex-col items-center justify-center p-2.5 bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-xs">
                <span className="font-numerical-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-secondary">
                  {String(countdownResults.cHours).padStart(2, '0')}
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant mt-0.5">Hours</span>
              </div>
              <div className="flex flex-col items-center justify-center p-2.5 bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-xs">
                <span className="font-numerical-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-on-surface">
                  {String(countdownResults.cMinutes).padStart(2, '0')}
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant mt-0.5">Mins</span>
              </div>
              <div className="flex flex-col items-center justify-center p-2.5 bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-xs">
                <span className="font-numerical-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary animate-pulse">
                  {String(countdownResults.cSeconds).padStart(2, '0')}
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant mt-0.5">Secs</span>
              </div>
            </div>

            {/* Countdown Work Metrics */}
            <div className="mt-1 pt-2 border-t border-outline-variant/20 grid grid-cols-2 gap-2">
              <div className="p-2 bg-surface-container-lowest rounded-lg border border-outline-variant/20 flex flex-col">
                <span className="text-[11px] uppercase tracking-wide text-on-surface-variant font-medium">Business Days Left</span>
                <span className="text-lg font-bold text-primary mt-0.5">
                  {countdownResults.countdownBusinessDays} days
                </span>
              </div>
              <div className="p-2 bg-surface-container-lowest rounded-lg border border-outline-variant/20 flex flex-col">
                <span className="text-[11px] uppercase tracking-wide text-on-surface-variant font-medium">Work Hours Left</span>
                <span className="text-lg font-bold text-secondary mt-0.5">
                  {countdownResults.countdownWorkHours} hrs
                </span>
              </div>
            </div>
          </div>
        ) : activeMode === 'business-days' ? (
          /* BUSINESS DAYS HERO */
          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-semibold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">business_center</span> Business Days
              </span>
              <span className="material-symbols-outlined text-primary text-[24px]">verified</span>
            </div>

            <div className="flex items-baseline gap-space-xs">
              <span className="font-numerical-display text-numerical-display text-on-surface tracking-tight" id="primaryDayCount">
                {calcResults ? calcResults.businessDays.toLocaleString() : '95'}
              </span>
              <span className="font-headline-lg text-headline-lg text-primary font-bold">Business Days</span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 mt-1">
              <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-body-sm text-[13px] font-medium">
                {calcResults ? `${calcResults.businessWeeks} Working Weeks` : '19.0 Working Weeks'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-body-sm text-[13px] font-medium">
                {calcResults ? `${calcResults.businessDaysPercent}% of total days` : '66.9%'}
              </span>
            </div>

            {/* Exclusion summary pills */}
            <div className="mt-space-sm pt-space-xs flex flex-wrap gap-1.5 text-[12px]">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container text-on-surface font-medium border border-outline-variant/20">
                <span className="material-symbols-outlined text-[14px] text-on-surface-variant">weekend</span>
                {calcResults ? calcResults.weekendDays : 41} Weekend days skipped
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container text-on-surface font-medium border border-outline-variant/20">
                <span className="material-symbols-outlined text-[14px] text-tertiary">celebration</span>
                {calcResults ? calcResults.holidaysCount : 6} Public holidays skipped ({country})
              </span>
            </div>

            {/* Workday Progress Bar */}
            <div className="mt-space-md pt-space-xs">
              <div className="flex items-center justify-between text-[12px] text-on-surface-variant mb-1.5 font-medium">
                <span>Working Days vs Calendar Days</span>
                <span>{calcResults ? `${calcResults.businessDays} of ${calcResults.totalCalendarDays} days` : '95 of 142 days'}</span>
              </div>
              <div className="w-full bg-surface-dim h-2 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-500"
                  style={{ width: `${calcResults ? calcResults.businessDaysPercent : 66.9}%` }}
                />
              </div>
            </div>

            {/* Visual Timeline Strip */}
            <div className="mt-space-md p-space-sm bg-surface-container-lowest rounded-lg border border-outline-variant/20 shadow-sm">
              <div className="flex justify-between text-[11px] text-on-surface-variant mb-1 font-medium">
                <span>{calcResults?.d1 ? formatReadableDate(calcResults.d1) : 'Aug 15, 2025'}</span>
                <span className="text-primary font-semibold">
                  {calcResults?.midTime ? `${formatReadableDate(calcResults.midTime)} (50%)` : 'Oct 25 (50%)'}
                </span>
                <span>{calcResults?.d2 ? formatReadableDate(calcResults.d2) : 'Jan 4, 2026'}</span>
              </div>
              <div className="relative w-full h-1.5 bg-surface-dim rounded-full">
                <div className="absolute left-0 top-0 bottom-0 bg-primary rounded-full w-full opacity-70" />
                <div className="absolute left-1/2 -top-1 w-3 h-3 bg-primary rounded-full shadow -translate-x-1/2" />
              </div>
            </div>
          </div>
        ) : activeMode === 'work-hours' ? (
          /* WORK HOURS HERO */
          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="font-label-caps text-label-caps uppercase tracking-wider text-secondary font-semibold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">timer</span> Work Hours
              </span>
              <span className="material-symbols-outlined text-secondary text-[24px]">payments</span>
            </div>

            <div className="flex items-baseline gap-space-xs">
              <span className="font-numerical-display text-numerical-display text-on-surface tracking-tight" id="primaryDayCount">
                {calcResults ? calcResults.calculatedWorkHours.toLocaleString() : '760'}
              </span>
              <span className="font-headline-lg text-headline-lg text-secondary font-bold">Hours</span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 mt-1">
              <span className="px-2.5 py-0.5 rounded-full bg-secondary/10 text-secondary font-body-sm text-[13px] font-medium">
                {calcResults ? `${calcResults.businessDays} Working Days × ${calcResults.effectiveDailyHours}h/day` : '95 Days × 8.0h/day'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-body-sm text-[13px] font-medium">
                {calcResults ? `${calcResults.fteWeeks} FTE Weeks` : '19.0 FTE Weeks'}
              </span>
            </div>

            {/* Estimated Value if hourly rate set */}
            {calcResults?.estimatedGrossPay && (
              <div className="mt-2 p-2.5 bg-primary/10 rounded-lg border border-primary/20 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-[18px]">monetization_on</span>
                  <span className="text-[13px] font-medium text-on-surface">Estimated Gross Payroll:</span>
                </div>
                <span className="text-lg font-bold text-primary font-numerical-display">
                  {calcResults.estimatedGrossPay}
                </span>
              </div>
            )}

            {/* Work Hours Capacity Bar */}
            <div className="mt-space-md pt-space-xs">
              <div className="flex items-center justify-between text-[12px] text-on-surface-variant mb-1.5 font-medium">
                <span>Work Hours Capacity of Period</span>
                <span>{calcResults ? `${calcResults.workHoursPercent}% of total time` : '22.3%'}</span>
              </div>
              <div className="w-full bg-surface-dim h-2 rounded-full overflow-hidden">
                <div
                  className="bg-secondary h-full rounded-full transition-all duration-500"
                  style={{ width: `${calcResults ? calcResults.workHoursPercent : 22.3}%` }}
                />
              </div>
            </div>

            {/* Timeline */}
            <div className="mt-space-md p-space-sm bg-surface-container-lowest rounded-lg border border-outline-variant/20 shadow-sm">
              <div className="flex justify-between text-[11px] text-on-surface-variant mb-1 font-medium">
                <span>{calcResults?.d1 ? formatReadableDate(calcResults.d1) : 'Aug 15, 2025'}</span>
                <span className="text-secondary font-semibold">
                  {calcResults?.midTime ? `${formatReadableDate(calcResults.midTime)} (50%)` : 'Oct 25'}
                </span>
                <span>{calcResults?.d2 ? formatReadableDate(calcResults.d2) : 'Jan 4, 2026'}</span>
              </div>
              <div className="relative w-full h-1.5 bg-surface-dim rounded-full">
                <div className="absolute left-0 top-0 bottom-0 bg-secondary rounded-full w-full opacity-70" />
                <div className="absolute left-1/2 -top-1 w-3 h-3 bg-secondary rounded-full shadow -translate-x-1/2" />
              </div>
            </div>
          </div>
        ) : (
          /* ALL DAYS HERO */
          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-semibold">Total Days</span>
              <span className="material-symbols-outlined text-primary text-[24px]">timelapse</span>
            </div>
            <div className="flex items-baseline gap-space-xs">
              <span className="font-numerical-display text-numerical-display text-on-surface tracking-tight" id="primaryDayCount">
                {calcResults ? calcResults.totalCalendarDays.toLocaleString() : '142'}
              </span>
              <span className="font-headline-lg text-headline-lg text-primary font-bold">Days</span>
            </div>
            <div className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-body-sm text-[13px] font-medium self-start" id="secondaryHumanDuration">
              {calcResults ? calcResults.humanDuration : '4 Months, 20 Days'}
            </div>

            {/* Progress Bar */}
            <div className="mt-space-md pt-space-xs">
              <div className="flex items-center justify-between text-[12px] text-on-surface-variant mb-1.5 font-medium">
                <span>Progress of Year</span>
                <span id="yearPercentageLabel">{calcResults ? `${calcResults.yearPercent}% of Year` : '38.9% of Year'}</span>
              </div>
              <div className="w-full bg-surface-dim h-2 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-500"
                  id="yearProgressBar"
                  style={{ width: `${calcResults ? calcResults.yearPercent : 38.9}%` }}
                />
              </div>
            </div>

            {/* Visual Timeline Strip */}
            <div className="mt-space-md p-space-sm bg-surface-container-lowest rounded-lg border border-outline-variant/20 shadow-sm">
              <div className="flex justify-between text-[11px] text-on-surface-variant mb-1 font-medium">
                <span id="timelineStartLabel">{calcResults?.d1 ? formatReadableDate(calcResults.d1) : 'Aug 15, 2025'}</span>
                <span className="text-primary font-semibold" id="timelineMidLabel">
                  {calcResults?.midTime ? `${formatReadableDate(calcResults.midTime)} (50%)` : 'Oct 25 (50%)'}
                </span>
                <span id="timelineEndLabel">{calcResults?.d2 ? formatReadableDate(calcResults.d2) : 'Jan 4, 2026'}</span>
              </div>
              <div className="relative w-full h-1.5 bg-surface-dim rounded-full">
                <div className="absolute left-0 top-0 bottom-0 bg-secondary rounded-full w-full opacity-70" />
                <div className="absolute left-1/2 -top-1 w-3 h-3 bg-primary rounded-full shadow -translate-x-1/2" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Multi-Unit Breakdown Matrix (Clean 2x3 Grid) */}
      <div className="grid grid-cols-2 gap-space-sm">
        <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 flex flex-col">
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Business Days</span>
          <span className="font-headline-lg text-headline-lg text-primary font-bold mt-1" id="businessDaysMetric">
            {activeMode === 'event-countdown'
              ? countdownResults.countdownBusinessDays
              : calcResults ? calcResults.businessDays : '95'}
          </span>
          <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
            {activeMode === 'event-countdown' ? 'Work days until event' : 'Working days'}
          </span>
        </div>

        <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 flex flex-col">
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
            {activeMode === 'event-countdown' ? 'Work Hours Left' : 'Work Hours'}
          </span>
          <span className="font-headline-lg text-headline-lg text-secondary font-bold mt-1" id="workHoursMetric">
            {activeMode === 'event-countdown'
              ? `${countdownResults.countdownWorkHours}h`
              : calcResults ? `${calcResults.calculatedWorkHours}h` : '760h'}
          </span>
          <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
            {activeMode === 'event-countdown'
              ? 'Working hours remaining'
              : calcResults ? `${calcResults.effectiveDailyHours} hrs/workday` : '8 hrs/day'}
          </span>
        </div>

        <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 flex flex-col">
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Weekend Days</span>
          <span className="font-headline-lg text-headline-lg text-on-surface font-bold mt-1" id="weekendDaysMetric">
            {calcResults ? calcResults.weekendDays : '41'}
          </span>
          <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Non-working weekend</span>
        </div>

        <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 flex flex-col">
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Public Holidays</span>
          <span className="font-headline-lg text-headline-lg text-tertiary font-bold mt-1" id="holidaysMetric">
            {calcResults ? calcResults.holidaysCount : '6'}
          </span>
          <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Holidays in range</span>
        </div>

        <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 flex flex-col">
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Total Weeks</span>
          <span className="font-headline-lg text-headline-lg text-on-surface font-bold mt-1" id="totalWeeksMetric">
            {activeMode === 'event-countdown'
              ? (countdownResults.cDays / 7).toFixed(1)
              : calcResults ? calcResults.totalWeeks : '20.3'}
          </span>
          <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Full calendar weeks</span>
        </div>

        <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 flex flex-col">
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Total Hours</span>
          <span className="font-headline-md text-headline-md text-on-surface font-bold mt-1" id="totalHoursMetric">
            {activeMode === 'event-countdown'
              ? (countdownResults.cDays * 24 + countdownResults.cHours).toLocaleString()
              : calcResults ? calcResults.totalHours.toLocaleString() : '3,408'}
          </span>
          <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
            {activeMode === 'event-countdown'
              ? 'Calendar hours remaining'
              : calcResults ? `${calcResults.totalMinutes.toLocaleString()} mins` : '204,480 mins'}
          </span>
        </div>
      </div>

      {/* Quick Output Actions */}
      <div className="flex items-center gap-space-xs">
        <button
          className="flex-1 py-2.5 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm flex items-center justify-center gap-1.5 transition-colors shadow-sm border border-outline-variant/30 cursor-pointer"
          onClick={copyResults}
          type="button"
        >
          <span className="material-symbols-outlined text-[16px]">content_copy</span>
          <span id="copyBtnText">{copyFeedback}</span>
        </button>
        <button
          className="flex-1 py-2.5 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm flex items-center justify-center gap-1.5 transition-colors shadow-sm border border-outline-variant/30 cursor-pointer"
          onClick={exportCSV}
          type="button"
        >
          <span className="material-symbols-outlined text-[16px]">download</span> Export CSV
        </button>
        <button
          className="py-2.5 px-3.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm flex items-center justify-center transition-colors shadow-sm border border-outline-variant/30 cursor-pointer"
          onClick={() => {
            if (typeof window !== 'undefined') window.print();
          }}
          title="Print Summary"
          type="button"
        >
          <span className="material-symbols-outlined text-[16px]">print</span>
        </button>
      </div>
    </div>
  );
}
