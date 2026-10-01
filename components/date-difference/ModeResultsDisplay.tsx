'use client';

import React from 'react';
import { ModeType, CalculationResults, CountdownResults } from './types';

interface ModeResultsDisplayProps {
  activeMode: ModeType;
  startDate: string;
  endDate: string;
  calc: CalculationResults;
  countdown: CountdownResults;
  eventName: string;
  countdownTargetDate: string;
  countdownTargetTime: string;
  copyResultsToClipboard: () => void;
  copyFeedback: boolean;
  exportCsv: () => void;
  hourlyRate: number;
}

export default function ModeResultsDisplay({
  activeMode,
  startDate,
  endDate,
  calc,
  countdown,
  eventName,
  countdownTargetDate,
  countdownTargetTime,
  copyResultsToClipboard,
  copyFeedback,
  exportCsv,
  hourlyRate,
}: ModeResultsDisplayProps) {
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="lg:col-span-5 flex flex-col gap-space-lg">
      {/* ========================================================================= */}
      {/* 1. HERO RESULT BANNER (Dynamic per Mode) */}
      {/* ========================================================================= */}

      {/* A) ALL DAYS HERO */}
      {activeMode === 'all-days' && (
        <div
          className="p-space-lg lg:p-space-xl bg-surface-container-lowest rounded-xl shadow-md border-t-4 border-primary border border-outline-variant/30 flex flex-col gap-space-md"
          id="primaryHighlightBanner"
        >
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-label-caps uppercase text-primary tracking-wider font-semibold">
              TOTAL TIME SPAN
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-[12px] font-medium text-on-surface-variant font-data-mono">
              {calc.yearPercent}% of a year
            </span>
          </div>

          <div className="flex items-baseline gap-space-xs">
            <span
              className="font-headline-lg text-[56px] lg:text-[68px] leading-none text-primary font-bold tracking-tight font-data-mono"
              id="heroDaysNumber"
            >
              {calc.totalCalendarDays.toLocaleString()}
            </span>
            <span className="font-headline-md text-headline-md text-on-surface font-semibold">
              {calc.totalCalendarDays === 1 ? 'Day' : 'Days'}
            </span>
          </div>

          <div className="p-space-sm bg-surface-container-low rounded-lg flex items-center justify-between">
            <span className="font-body-md text-body-md text-on-surface-variant font-medium">Exact Calendar Breakdown:</span>
            <span className="font-headline-md text-headline-md text-on-surface font-bold text-right" id="heroHumanDuration">
              {calc.humanDuration}
            </span>
          </div>

          {/* Mini Timeline Strip */}
          <div className="flex flex-col gap-1 pt-1">
            <div className="flex justify-between text-[11px] text-on-surface-variant font-data-mono">
              <span>{startDate}</span>
              <span>Mid: {calc.midTime.toISOString().slice(5, 10)}</span>
              <span>{endDate}</span>
            </div>
            <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden flex">
              <div className="bg-primary h-full rounded-full w-full"></div>
            </div>
          </div>
        </div>
      )}

      {/* B) BUSINESS DAYS HERO */}
      {activeMode === 'business-days' && (
        <div
          className="p-space-lg lg:p-space-xl bg-surface-container-lowest rounded-xl shadow-md border-t-4 border-primary border border-outline-variant/30 flex flex-col gap-space-md"
          id="primaryHighlightBanner"
        >
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-label-caps uppercase text-primary tracking-wider font-semibold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">business_center</span> NET WORKING DAYS
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-[12px] font-bold text-primary">
              {calc.workdayPercent}% Working Days
            </span>
          </div>

          <div className="flex items-baseline gap-space-xs">
            <span
              className="font-headline-lg text-[56px] lg:text-[68px] leading-none text-primary font-bold tracking-tight font-data-mono"
              id="heroDaysNumber"
            >
              {calc.businessDays.toLocaleString()}
            </span>
            <span className="font-headline-md text-headline-md text-on-surface font-semibold">
              Business {calc.businessDays === 1 ? 'Day' : 'Days'}
            </span>
          </div>

          <div className="p-space-sm bg-surface-container-low rounded-lg flex items-center justify-between">
            <span className="font-body-md text-body-md text-on-surface-variant font-medium">Work Weeks Equivalent:</span>
            <span className="font-headline-md text-headline-md text-primary font-bold text-right">
              {calc.totalWeeks} Weeks
            </span>
          </div>

          {/* Excluded Breakdown Badges */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="p-2.5 rounded-lg bg-surface border border-outline-variant/20 flex flex-col">
              <span className="text-[11px] text-on-surface-variant uppercase font-medium">Weekend Days Skipped</span>
              <span className="text-body-md font-bold text-on-surface font-data-mono">{calc.weekendDays} Days</span>
            </div>
            <div className="p-2.5 rounded-lg bg-surface border border-outline-variant/20 flex flex-col">
              <span className="text-[11px] text-on-surface-variant uppercase font-medium">Public Holidays Skipped</span>
              <span className="text-body-md font-bold text-tertiary font-data-mono">{calc.holidaysCount} Days</span>
            </div>
          </div>

          {/* Working Days Capacity Bar */}
          <div className="flex flex-col gap-1 pt-1">
            <div className="flex justify-between text-[11px] text-on-surface-variant">
              <span>{calc.businessDays} Working Days ({calc.workdayPercent}%)</span>
              <span>{calc.weekendDays + calc.holidaysCount} Off-Days</span>
            </div>
            <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden flex">
              <div
                className="bg-primary h-full transition-all"
                style={{ width: `${Math.min(100, Math.max(0, parseFloat(calc.workdayPercent) || 0))}%` }}
              ></div>
              <div className="bg-secondary/40 h-full flex-grow"></div>
            </div>
          </div>
        </div>
      )}

      {/* C) WORK HOURS HERO */}
      {activeMode === 'work-hours' && (
        <div
          className="p-space-lg lg:p-space-xl bg-surface-container-lowest rounded-xl shadow-md border-t-4 border-primary border border-outline-variant/30 flex flex-col gap-space-md"
          id="primaryHighlightBanner"
        >
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-label-caps uppercase text-primary tracking-wider font-semibold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">schedule</span> TOTAL WORKING HOURS
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-[12px] font-bold text-primary">
              {calc.fteWeeks} FTE Weeks
            </span>
          </div>

          <div className="flex items-baseline gap-space-xs">
            <span
              className="font-headline-lg text-[56px] lg:text-[68px] leading-none text-primary font-bold tracking-tight font-data-mono"
              id="heroDaysNumber"
            >
              {calc.calculatedWorkHours.toLocaleString()}
            </span>
            <span className="font-headline-md text-headline-md text-on-surface font-semibold">
              Work Hours
            </span>
          </div>

          <div className="p-space-sm bg-surface-container-low rounded-lg flex items-center justify-between">
            <span className="font-body-md text-body-md text-on-surface-variant font-medium">Daily Schedule Basis:</span>
            <span className="font-headline-md text-headline-md text-on-surface font-bold text-right">
              {calc.businessDays} days × {calc.effectiveDailyHours.toFixed(1)}h/day
            </span>
          </div>

          {/* Gross Billing / Earnings Box (if rate provided) */}
          {hourlyRate > 0 && (
            <div className="p-space-sm bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-between">
              <span className="font-body-md text-body-md text-primary font-medium">Projected Gross Earnings:</span>
              <span className="font-headline-md text-headline-md text-primary font-bold text-right font-data-mono">
                ${calc.grossEarnings.toLocaleString()}
              </span>
            </div>
          )}

          {/* Work Hours Ratio Bar */}
          <div className="flex flex-col gap-1 pt-1">
            <div className="flex justify-between text-[11px] text-on-surface-variant">
              <span>Productive Work: {calc.calculatedWorkHours} hrs</span>
              <span>Total Calendar: {calc.totalHours} hrs</span>
            </div>
            <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden flex">
              <div
                className="bg-primary h-full transition-all"
                style={{
                  width: `${Math.min(100, Math.max(0, (calc.calculatedWorkHours / (calc.totalHours || 1)) * 100))}%`,
                }}
              ></div>
              <div className="bg-surface-container-highest h-full flex-grow"></div>
            </div>
          </div>
        </div>
      )}

      {/* D) EVENT COUNTDOWN HERO */}
      {activeMode === 'event-countdown' && (
        <div
          className="p-space-lg lg:p-space-xl bg-surface-container-lowest rounded-xl shadow-md border-t-4 border-error border border-outline-variant/30 flex flex-col gap-space-md"
          id="primaryHighlightBanner"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-error animate-ping"></span>
              <span className="font-label-caps text-label-caps uppercase text-error tracking-wider font-bold">
                LIVE EVENT COUNTDOWN
              </span>
            </div>
            <span className="px-2 py-0.5 rounded bg-surface-container text-[12px] font-data-mono text-on-surface-variant">
              {countdownTargetDate} {countdownTargetTime}
            </span>
          </div>

          <div>
            <h3 className="text-headline-md font-bold text-on-surface">
              {eventName || 'Upcoming Milestone'}
            </h3>
            <span className="text-[12px] text-on-surface-variant">
              Target: {countdown.targetDateFormatted}
            </span>
          </div>

          {countdown.isPassed ? (
            <div className="p-4 rounded-xl bg-error/10 border border-error/30 text-error text-center font-bold">
              Event has already occurred! ({Math.abs(countdown.days)} days ago)
            </div>
          ) : (
            /* 4 Digital Clock Cards */
            <div className="grid grid-cols-4 gap-2 pt-1">
              <div className="p-3 bg-surface rounded-xl border border-outline-variant/30 text-center flex flex-col items-center">
                <span className="font-headline-lg text-3xl sm:text-4xl font-bold text-primary font-data-mono leading-tight">
                  {countdown.days}
                </span>
                <span className="text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold mt-1">
                  Days
                </span>
              </div>
              <div className="p-3 bg-surface rounded-xl border border-outline-variant/30 text-center flex flex-col items-center">
                <span className="font-headline-lg text-3xl sm:text-4xl font-bold text-primary font-data-mono leading-tight">
                  {String(countdown.hours).padStart(2, '0')}
                </span>
                <span className="text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold mt-1">
                  Hours
                </span>
              </div>
              <div className="p-3 bg-surface rounded-xl border border-outline-variant/30 text-center flex flex-col items-center">
                <span className="font-headline-lg text-3xl sm:text-4xl font-bold text-primary font-data-mono leading-tight">
                  {String(countdown.minutes).padStart(2, '0')}
                </span>
                <span className="text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold mt-1">
                  Mins
                </span>
              </div>
              <div className="p-3 bg-surface rounded-xl border border-outline-variant/30 text-center flex flex-col items-center">
                <span className="font-headline-lg text-3xl sm:text-4xl font-bold text-error font-data-mono leading-tight">
                  {String(countdown.seconds).padStart(2, '0')}
                </span>
                <span className="text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold mt-1">
                  Secs
                </span>
              </div>
            </div>
          )}

          {/* Working Days & Work Hours Remaining Strip */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="p-2.5 rounded-lg bg-surface border border-outline-variant/20 flex flex-col">
              <span className="text-[11px] text-on-surface-variant uppercase font-medium">Work Days Left</span>
              <span className="text-body-md font-bold text-primary font-data-mono">
                {countdown.businessDaysRemaining} Days
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-surface border border-outline-variant/20 flex flex-col">
              <span className="text-[11px] text-on-surface-variant uppercase font-medium">Work Hours Left</span>
              <span className="text-body-md font-bold text-secondary font-data-mono">
                {countdown.workHoursRemaining} Hours
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. SIX-BOX BREAKDOWN MATRIX (Dynamic per Mode) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-space-sm" id="breakdownMatrix">
        {activeMode === 'all-days' && (
          <>
            <div className="p-space-sm bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 flex flex-col">
              <span className="font-body-sm text-body-sm text-on-surface-variant">Business Days</span>
              <span className="font-headline-md text-headline-md text-on-surface font-bold font-data-mono mt-1">
                {calc.businessDays}
              </span>
              <span className="text-[11px] text-on-surface-variant mt-0.5">Working days</span>
            </div>
            <div className="p-space-sm bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 flex flex-col">
              <span className="font-body-sm text-body-sm text-on-surface-variant">Weekend Days</span>
              <span className="font-headline-md text-headline-md text-on-surface font-bold font-data-mono mt-1">
                {calc.weekendDays}
              </span>
              <span className="text-[11px] text-on-surface-variant mt-0.5">Saturdays &amp; Sundays</span>
            </div>
            <div className="p-space-sm bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 flex flex-col">
              <span className="font-body-sm text-body-sm text-on-surface-variant">Public Holidays</span>
              <span className="font-headline-md text-headline-md text-tertiary font-bold font-data-mono mt-1">
                {calc.holidaysCount}
              </span>
              <span className="text-[11px] text-on-surface-variant mt-0.5">Recognized holidays</span>
            </div>
            <div className="p-space-sm bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 flex flex-col">
              <span className="font-body-sm text-body-sm text-on-surface-variant">Total Weeks</span>
              <span className="font-headline-md text-headline-md text-on-surface font-bold font-data-mono mt-1">
                {calc.totalWeeks}
              </span>
              <span className="text-[11px] text-on-surface-variant mt-0.5">7-day blocks</span>
            </div>
            <div className="p-space-sm bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 flex flex-col">
              <span className="font-body-sm text-body-sm text-on-surface-variant">Total Hours</span>
              <span className="font-headline-md text-headline-md text-on-surface font-bold font-data-mono mt-1">
                {calc.totalHours.toLocaleString()}
              </span>
              <span className="text-[11px] text-on-surface-variant mt-0.5">Calendar hours</span>
            </div>
            <div className="p-space-sm bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 flex flex-col">
              <span className="font-body-sm text-body-sm text-on-surface-variant">Total Minutes</span>
              <span className="font-headline-md text-headline-md text-on-surface font-bold font-data-mono mt-1">
                {calc.totalMinutes.toLocaleString()}
              </span>
              <span className="text-[11px] text-on-surface-variant mt-0.5">Exact duration</span>
            </div>
          </>
        )}

        {activeMode === 'business-days' && (
          <>
            <div className="p-space-sm bg-surface-container-lowest rounded-xl shadow-sm border border-primary/30 flex flex-col">
              <span className="font-body-sm text-body-sm text-primary font-medium">Business Days</span>
              <span className="font-headline-md text-headline-md text-primary font-bold font-data-mono mt-1">
                {calc.businessDays}
              </span>
              <span className="text-[11px] text-on-surface-variant mt-0.5">Net working days</span>
            </div>
            <div className="p-space-sm bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 flex flex-col">
              <span className="font-body-sm text-body-sm text-on-surface-variant">Calendar Days</span>
              <span className="font-headline-md text-headline-md text-on-surface font-bold font-data-mono mt-1">
                {calc.totalCalendarDays}
              </span>
              <span className="text-[11px] text-on-surface-variant mt-0.5">Full date span</span>
            </div>
            <div className="p-space-sm bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 flex flex-col">
              <span className="font-body-sm text-body-sm text-on-surface-variant">Weekend Days</span>
              <span className="font-headline-md text-headline-md text-secondary font-bold font-data-mono mt-1">
                {calc.weekendDays}
              </span>
              <span className="text-[11px] text-on-surface-variant mt-0.5">Days skipped</span>
            </div>
            <div className="p-space-sm bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 flex flex-col">
              <span className="font-body-sm text-body-sm text-on-surface-variant">Public Holidays</span>
              <span className="font-headline-md text-headline-md text-tertiary font-bold font-data-mono mt-1">
                {calc.holidaysCount}
              </span>
              <span className="text-[11px] text-on-surface-variant mt-0.5">Holidays skipped</span>
            </div>
            <div className="p-space-sm bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 flex flex-col">
              <span className="font-body-sm text-body-sm text-on-surface-variant">Work Weeks</span>
              <span className="font-headline-md text-headline-md text-on-surface font-bold font-data-mono mt-1">
                {calc.totalWeeks}
              </span>
              <span className="text-[11px] text-on-surface-variant mt-0.5">5-day working blocks</span>
            </div>
            <div className="p-space-sm bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 flex flex-col">
              <span className="font-body-sm text-body-sm text-on-surface-variant">Work Hours</span>
              <span className="font-headline-md text-headline-md text-on-surface font-bold font-data-mono mt-1">
                {calc.calculatedWorkHours}
              </span>
              <span className="text-[11px] text-on-surface-variant mt-0.5">At {calc.effectiveDailyHours}h / day</span>
            </div>
          </>
        )}

        {activeMode === 'work-hours' && (
          <>
            <div className="p-space-sm bg-surface-container-lowest rounded-xl shadow-sm border border-primary/30 flex flex-col">
              <span className="font-body-sm text-body-sm text-primary font-medium">Work Hours</span>
              <span className="font-headline-md text-headline-md text-primary font-bold font-data-mono mt-1">
                {calc.calculatedWorkHours.toLocaleString()}
              </span>
              <span className="text-[11px] text-on-surface-variant mt-0.5">Net billable hours</span>
            </div>
            <div className="p-space-sm bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 flex flex-col">
              <span className="font-body-sm text-body-sm text-on-surface-variant">Working Days</span>
              <span className="font-headline-md text-headline-md text-on-surface font-bold font-data-mono mt-1">
                {calc.businessDays}
              </span>
              <span className="text-[11px] text-on-surface-variant mt-0.5">Shifts worked</span>
            </div>
            <div className="p-space-sm bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 flex flex-col">
              <span className="font-body-sm text-body-sm text-on-surface-variant">FTE Weeks</span>
              <span className="font-headline-md text-headline-md text-on-surface font-bold font-data-mono mt-1">
                {calc.fteWeeks}
              </span>
              <span className="text-[11px] text-on-surface-variant mt-0.5">Full-time capacity</span>
            </div>
            <div className="p-space-sm bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 flex flex-col">
              <span className="font-body-sm text-body-sm text-on-surface-variant">Gross Value</span>
              <span className="font-headline-md text-headline-md text-secondary font-bold font-data-mono mt-1">
                ${calc.grossEarnings ? calc.grossEarnings.toLocaleString() : (calc.calculatedWorkHours * 35).toLocaleString()}
              </span>
              <span className="text-[11px] text-on-surface-variant mt-0.5">
                {hourlyRate > 0 ? `@ $${hourlyRate}/hr` : 'Est @ $35/hr'}
              </span>
            </div>
            <div className="p-space-sm bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 flex flex-col">
              <span className="font-body-sm text-body-sm text-on-surface-variant">Calendar Hours</span>
              <span className="font-headline-md text-headline-md text-on-surface font-bold font-data-mono mt-1">
                {calc.totalHours.toLocaleString()}
              </span>
              <span className="text-[11px] text-on-surface-variant mt-0.5">Total period</span>
            </div>
            <div className="p-space-sm bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 flex flex-col">
              <span className="font-body-sm text-body-sm text-on-surface-variant">Off / Rest Hours</span>
              <span className="font-headline-md text-headline-md text-on-surface font-bold font-data-mono mt-1">
                {Math.max(0, calc.totalHours - calc.calculatedWorkHours).toLocaleString()}
              </span>
              <span className="text-[11px] text-on-surface-variant mt-0.5">Non-work duration</span>
            </div>
          </>
        )}

        {activeMode === 'event-countdown' && (
          <>
            <div className="p-space-sm bg-surface-container-lowest rounded-xl shadow-sm border border-error/30 flex flex-col">
              <span className="font-body-sm text-body-sm text-error font-medium">Days Remaining</span>
              <span className="font-headline-md text-headline-md text-error font-bold font-data-mono mt-1">
                {countdown.days}
              </span>
              <span className="text-[11px] text-on-surface-variant mt-0.5">Calendar days</span>
            </div>
            <div className="p-space-sm bg-surface-container-lowest rounded-xl shadow-sm border border-primary/30 flex flex-col">
              <span className="font-body-sm text-body-sm text-primary font-medium">Workdays Remaining</span>
              <span className="font-headline-md text-headline-md text-primary font-bold font-data-mono mt-1">
                {countdown.businessDaysRemaining}
              </span>
              <span className="text-[11px] text-on-surface-variant mt-0.5">Weekdays only</span>
            </div>
            <div className="p-space-sm bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 flex flex-col">
              <span className="font-body-sm text-body-sm text-on-surface-variant">Work Hours Left</span>
              <span className="font-headline-md text-headline-md text-on-surface font-bold font-data-mono mt-1">
                {countdown.workHoursRemaining}
              </span>
              <span className="text-[11px] text-on-surface-variant mt-0.5">Working capacity</span>
            </div>
            <div className="p-space-sm bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 flex flex-col">
              <span className="font-body-sm text-body-sm text-on-surface-variant">Weeks Remaining</span>
              <span className="font-headline-md text-headline-md text-on-surface font-bold font-data-mono mt-1">
                {countdown.totalWeeksRemaining}
              </span>
              <span className="text-[11px] text-on-surface-variant mt-0.5">Full weeks</span>
            </div>
            <div className="p-space-sm bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 flex flex-col">
              <span className="font-body-sm text-body-sm text-on-surface-variant">Hours Remaining</span>
              <span className="font-headline-md text-headline-md text-on-surface font-bold font-data-mono mt-1">
                {countdown.totalHoursRemaining.toLocaleString()}
              </span>
              <span className="text-[11px] text-on-surface-variant mt-0.5">Total hours</span>
            </div>
            <div className="p-space-sm bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 flex flex-col">
              <span className="font-body-sm text-body-sm text-on-surface-variant">Minutes Remaining</span>
              <span className="font-headline-md text-headline-md text-on-surface font-bold font-data-mono mt-1">
                {countdown.totalMinutesRemaining.toLocaleString()}
              </span>
              <span className="text-[11px] text-on-surface-variant mt-0.5">Total minutes</span>
            </div>
          </>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. ADDITIONAL PLANNING METRICS */}
      {/* ========================================================================= */}
      <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 flex flex-col gap-space-sm">
        <h4 className="font-headline-md text-headline-md text-on-surface font-semibold flex items-center gap-1.5">
          <span className="material-symbols-outlined text-primary text-[18px]">analytics</span> Planning Insights
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-space-sm text-body-sm">
          <div className="p-2 rounded-lg bg-surface border border-outline-variant/10">
            <span className="text-on-surface-variant block text-[11px]">Agile 2-Week Sprints</span>
            <span className="font-bold text-on-surface font-data-mono">{calc.agileSprints} Sprints</span>
          </div>
          <div className="p-2 rounded-lg bg-surface border border-outline-variant/10">
            <span className="text-on-surface-variant block text-[11px]">Total Fridays</span>
            <span className="font-bold text-on-surface font-data-mono">{calc.totalFridays} Fridays</span>
          </div>
          <div className="p-2 rounded-lg bg-surface border border-outline-variant/10">
            <span className="text-on-surface-variant block text-[11px]">Calendar Quarters</span>
            <span className="font-bold text-on-surface font-data-mono">{calc.quartersSpanned} Qtrs</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. UTILITY ACTIONS (Copy, Export CSV, Print) */}
      {/* ========================================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-space-xs pt-space-xs border-t border-outline-variant/30">
        <div className="flex items-center gap-2">
          <button
            className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm flex items-center gap-1.5 transition-colors border border-outline-variant/30 cursor-pointer"
            onClick={copyResultsToClipboard}
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">content_copy</span>
            <span>{copyFeedback ? 'Copied!' : 'Copy Summary'}</span>
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm flex items-center gap-1.5 transition-colors border border-outline-variant/30 cursor-pointer"
            onClick={exportCsv}
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">download</span> Export CSV
          </button>
        </div>
        <button
          className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm flex items-center gap-1.5 transition-colors border border-outline-variant/30 cursor-pointer"
          onClick={handlePrint}
          type="button"
        >
          <span className="material-symbols-outlined text-[16px]">print</span> Print
        </button>
      </div>
    </div>
  );
}
