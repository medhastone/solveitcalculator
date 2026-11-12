'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Calculator,
  RotateCcw,
  Calendar,
  Clock,
  Timer,
  ArrowLeftRight,
  Play,
  Pause,
} from 'lucide-react';
import SingleCalculatorPageShell, {
  RelatedCalculatorLink,
} from '@/components/calculator-page/SingleCalculatorPageShell';

export type RestoredDateTimeVariant =
  | 'days-from-today'
  | 'business-days'
  | 'countdown'
  | 'work-hours'
  | 'timer-stopwatch'
  | 'military-time'
  | 'time-unit';

const DATE_TIME_RELATED: RelatedCalculatorLink[] = [
  {
    name: 'Date Difference Calculator',
    description: 'Count exact calendar days and weeks between any two dates.',
    href: '/date-difference-calculator',
    iconVariant: 'clock-indigo',
  },
  {
    name: 'Days From Today Calculator',
    description: 'Add or subtract days, weeks, months, or years from any date.',
    href: '/days-from-today-calculator',
    iconVariant: 'arrows-blue',
  },
  {
    name: 'Business Days Calculator',
    description: 'Calculate working weekdays between dates or add business days.',
    href: '/business-days-calculator',
    iconVariant: 'chart-green',
  },
  {
    name: 'Age Calculator',
    description: 'Find exact chronological age in years, months, and days.',
    href: '/age-calculator',
    iconVariant: 'tag-amber',
  },
  {
    name: 'Time Duration Calculator',
    description: 'Calculate hours, minutes, and decimal payroll hours between times.',
    href: '/time-duration-calculator',
    iconVariant: 'scale-teal',
  },
];

export default function RestoredDateTimeCalculatorsClient({
  variant,
}: {
  variant: RestoredDateTimeVariant;
}) {
  // 1. Days From Today / Add-Subtract Days state
  const [baseDate, setBaseDate] = useState('2026-11-12');
  const [operation, setOperation] = useState<'add' | 'subtract'>('add');
  const [offsetDays, setOffsetDays] = useState<number>(30);
  const [offsetWeeks, setOffsetWeeks] = useState<number>(0);

  // 2. Business Days state
  const [bizStart, setBizStart] = useState('2026-11-02');
  const [bizEnd, setBizEnd] = useState('2026-11-30');
  const [holidaysCount, setHolidaysCount] = useState<number>(1);

  // 3. Countdown state
  const [eventName, setEventName] = useState('New Year 2027');
  const [targetDate, setTargetDate] = useState('2027-01-01');
  const [fromDate, setFromDate] = useState('2026-11-12');

  // 4. Work Hours / Weekly Timesheet state
  const [dailyHours, setDailyHours] = useState<number[]>([8, 8, 8, 8, 8]);
  const [hourlyWage, setHourlyWage] = useState<number>(32);

  // 5. Timer & Stopwatch state
  const [timerMinutes, setTimerMinutes] = useState<number>(25);
  const [secondsLeft, setSecondsLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // 6. Military Time Converter state
  const [time24, setTime24] = useState('17:45');

  // 7. Time Unit Converter state
  const [inputHours, setInputHours] = useState<number>(8);
  const [inputMinutes, setInputMinutes] = useState<number>(45);
  const [inputSeconds, setInputSeconds] = useState<number>(0);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  // Computations
  const daysFromTodayResult = useMemo(() => {
    const start = new Date(`${baseDate}T00:00:00Z`);
    if (isNaN(start.getTime())) return null;
    const totalDaysDelta = (offsetDays || 0) + (offsetWeeks || 0) * 7;
    const signedDelta = operation === 'add' ? totalDaysDelta : -totalDaysDelta;
    const target = new Date(start.getTime() + signedDelta * 86400000);
    const formatted = target.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    });
    const iso = target.toISOString().slice(0, 10);
    return { formatted, iso, totalDaysDelta, signedDelta };
  }, [baseDate, operation, offsetDays, offsetWeeks]);

  const businessDaysResult = useMemo(() => {
    const d1 = new Date(`${bizStart}T00:00:00Z`);
    const d2 = new Date(`${bizEnd}T00:00:00Z`);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return null;
    const startMs = Math.min(d1.getTime(), d2.getTime());
    const endMs = Math.max(d1.getTime(), d2.getTime());
    let weekdays = 0;
    let weekendDays = 0;
    let totalCalendarDays = 0;
    for (let ms = startMs; ms <= endMs; ms += 86400000) {
      totalCalendarDays++;
      const dayOfWeek = new Date(ms).getUTCDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        weekendDays++;
      } else {
        weekdays++;
      }
    }
    const netBusinessDays = Math.max(0, weekdays - Math.max(0, holidaysCount));
    return { netBusinessDays, weekdays, weekendDays, totalCalendarDays };
  }, [bizStart, bizEnd, holidaysCount]);

  const countdownResult = useMemo(() => {
    const dFrom = new Date(`${fromDate}T00:00:00Z`);
    const dTo = new Date(`${targetDate}T00:00:00Z`);
    if (isNaN(dFrom.getTime()) || isNaN(dTo.getTime())) return null;
    const diffDays = Math.round((dTo.getTime() - dFrom.getTime()) / 86400000);
    const absDays = Math.abs(diffDays);
    const weeks = Math.floor(absDays / 7);
    const remDays = absDays % 7;
    const totalHours = absDays * 24;
    return { diffDays, absDays, weeks, remDays, totalHours };
  }, [fromDate, targetDate]);

  const workHoursResult = useMemo(() => {
    const totalHours = dailyHours.reduce((acc, h) => acc + Math.max(0, h || 0), 0);
    const regularHours = Math.min(40, totalHours);
    const overtimeHours = Math.max(0, totalHours - 40);
    const grossPay =
      regularHours * hourlyWage + overtimeHours * hourlyWage * 1.5;
    return {
      totalHours: Number(totalHours.toFixed(2)),
      regularHours: Number(regularHours.toFixed(2)),
      overtimeHours: Number(overtimeHours.toFixed(2)),
      grossPay: Number(grossPay.toFixed(2)),
    };
  }, [dailyHours, hourlyWage]);

  const militaryTimeResult = useMemo(() => {
    const [hStr, mStr] = time24.split(':');
    const h = Math.min(23, Math.max(0, Number(hStr) || 0));
    const m = Math.min(59, Math.max(0, Number(mStr) || 0));
    const milCode = `${String(h).padStart(2, '0')}${String(m).padStart(2, '0')} hrs`;
    const period = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 === 0 ? 12 : h % 12;
    const std12 = `${h12}:${String(m).padStart(2, '0')} ${period}`;
    return { milCode, std12, h, m };
  }, [time24]);

  const timeUnitResult = useMemo(() => {
    const totalSeconds =
      (inputHours || 0) * 3600 + (inputMinutes || 0) * 60 + (inputSeconds || 0);
    const decimalHours = totalSeconds / 3600;
    const totalMinutes = totalSeconds / 60;
    const days = totalSeconds / 86400;
    return {
      totalSeconds: Math.round(totalSeconds),
      decimalHours: Number(decimalHours.toFixed(4)),
      totalMinutes: Number(totalMinutes.toFixed(2)),
      days: Number(days.toFixed(4)),
    };
  }, [inputHours, inputMinutes, inputSeconds]);

  // Render specific calculator card & metadata per variant
  if (variant === 'days-from-today') {
    return (
      <SingleCalculatorPageShell
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Date & Time', href: '/date-time' },
          { label: 'Days From Today Calculator' },
        ]}
        title="Days From Today & Date Add/Subtract Calculator"
        subtitle="Add or subtract any number of days and weeks from a starting calendar date to find the exact future or past target date."
        heroSymbol="+30d"
        heroBadgeBg="bg-[#EBF2FF]"
        heroBadgeColor="text-[#2457D6]"
        categoryName="Date & Time"
        categoryHref="/date-time"
        otherCalculatorsTitle="Other Date & Time Calculators"
        otherCalculators={DATE_TIME_RELATED}
        relatedCalculators={DATE_TIME_RELATED.slice(0, 4)}
        calculatorCard={
          <section className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-7 shadow-2xs space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#EBF2FF] text-[#2457D6] flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-[#152238]">
                  Add or Subtract Days &amp; Weeks From a Date
                </h2>
                <p className="text-xs text-[#64748B]">
                  Automatically adjusts for 28, 30, and 31-day months and leap years.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="dft-base" className="block text-sm font-extrabold text-[#152238] mb-1.5">
                  Start Date
                </label>
                <input
                  id="dft-base"
                  type="date"
                  value={baseDate}
                  onChange={(e) => setBaseDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] bg-white text-sm font-bold text-[#152238]"
                />
              </div>
              <div>
                <span className="block text-sm font-extrabold text-[#152238] mb-1.5">
                  Operation
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setOperation('add')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-extrabold border cursor-pointer ${
                      operation === 'add'
                        ? 'bg-[#2457D6] text-white border-[#2457D6]'
                        : 'bg-[#F8FAFC] text-[#152238] border-[#CBD5E1]'
                    }`}
                  >
                    + Add Future Days
                  </button>
                  <button
                    type="button"
                    onClick={() => setOperation('subtract')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-extrabold border cursor-pointer ${
                      operation === 'subtract'
                        ? 'bg-[#2457D6] text-white border-[#2457D6]'
                        : 'bg-[#F8FAFC] text-[#152238] border-[#CBD5E1]'
                    }`}
                  >
                    − Subtract Past Days
                  </button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="dft-days" className="block text-sm font-extrabold text-[#152238] mb-1.5">
                  Days to {operation === 'add' ? 'Add' : 'Subtract'}
                </label>
                <input
                  id="dft-days"
                  type="number"
                  min={0}
                  max={36500}
                  value={offsetDays}
                  onChange={(e) => setOffsetDays(Math.max(0, Number(e.target.value)))}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] bg-white text-sm font-bold text-[#152238]"
                />
              </div>
              <div>
                <label htmlFor="dft-weeks" className="block text-sm font-extrabold text-[#152238] mb-1.5">
                  Additional Weeks
                </label>
                <input
                  id="dft-weeks"
                  type="number"
                  min={0}
                  max={5200}
                  value={offsetWeeks}
                  onChange={(e) => setOffsetWeeks(Math.max(0, Number(e.target.value)))}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] bg-white text-sm font-bold text-[#152238]"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {[30, 45, 60, 90, 120, 180].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    setOffsetDays(preset);
                    setOffsetWeeks(0);
                  }}
                  className="px-3 py-1 rounded-lg text-xs font-bold bg-[#EEF3FF] text-[#2457D6] hover:bg-[#DCE7FF] cursor-pointer"
                >
                  {preset} Days
                </button>
              ))}
            </div>
          </section>
        }
        resultCard={
          daysFromTodayResult
            ? {
                promptSummary: `${daysFromTodayResult.totalDaysDelta} days ${
                  operation === 'add' ? 'after' : 'before'
                } ${baseDate}`,
                promptSuffix: 'is:',
                mainValue: daysFromTodayResult.formatted,
                equation: `ISO Calendar Date: ${daysFromTodayResult.iso} (${
                  daysFromTodayResult.signedDelta >= 0 ? '+' : ''
                }${daysFromTodayResult.signedDelta} days)`,
              }
            : undefined
        }
        formulaCard={{
          introText: 'Date offset calculation formula:',
          formulaText: 'Target Date = Start Date (UTC) ± (Days + 7 × Weeks) × 86,400,000 ms',
          exampleTitle: 'Example: 30 days after November 12, 2026:',
          exampleSteps: [
            'November has 30 days (18 days remaining in November)',
            '30 − 18 = 12 days into December 2026',
            'Target Date = Saturday, December 12, 2026',
          ],
        }}
        howToUseSteps={[
          'Select your starting calendar date (defaults to today).',
          'Choose whether to Add future days or Subtract past days.',
          'Enter the number of days and optional weeks, or click a quick preset (30, 60, 90, or 180 days).',
          'Read the resulting day of the week and full calendar date.',
        ]}
        howItWorks={{
          paragraph:
            'Adding or subtracting calendar days requires accounting for varying month lengths (28, 29, 30, or 31 days). This calculator uses UTC date arithmetic to step across month and year boundaries accurately.',
          formulaBox: 'Target Date = Start Date ± Total Days',
          closingNote: 'Ideal for 30/60/90-day notice periods, net-30 invoices, visa expirations, and medication schedules.',
        }}
        understandingResult={{
          paragraph: daysFromTodayResult ? (
            <>
              Moving <strong className="font-bold text-[#152238]">{daysFromTodayResult.totalDaysDelta} days</strong>{' '}
              {operation === 'add' ? 'forward' : 'backward'} from{' '}
              <strong className="font-bold text-[#152238]">{baseDate}</strong> lands on{' '}
              <strong className="font-bold text-[#152238]">{daysFromTodayResult.formatted}</strong>.
            </>
          ) : (
            <>Enter a valid start date to see your target date.</>
          ),
        }}
        faqs={[
          {
            question: 'Does 30 days from today mean one calendar month?',
            answer:
              'Not always. Months have 28, 29, 30, or 31 days, so adding exactly 30 days across a 31-day month lands one day earlier in the next month.',
          },
          {
            question: 'Are weekends included when adding days from today?',
            answer:
              'Yes, this tool counts all calendar days including Saturdays and Sundays. If you need to skip weekends, use our Business Days Calculator.',
          },
        ]}
      />
    );
  }

  if (variant === 'business-days') {
    return (
      <SingleCalculatorPageShell
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Date & Time', href: '/date-time' },
          { label: 'Business Days Calculator' },
        ]}
        title="Business Days & Working Days Calculator"
        subtitle="Count exact Monday-through-Friday working days between two dates while excluding weekends and public holidays."
        heroSymbol="Mon–Fri"
        heroBadgeBg="bg-[#E6F6F1]"
        heroBadgeColor="text-[#16856B]"
        categoryName="Date & Time"
        categoryHref="/date-time"
        otherCalculatorsTitle="Other Date & Time Calculators"
        otherCalculators={DATE_TIME_RELATED}
        relatedCalculators={DATE_TIME_RELATED.slice(0, 4)}
        calculatorCard={
          <section className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-7 shadow-2xs space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="biz-start" className="block text-sm font-extrabold text-[#152238] mb-1.5">
                  Start Date
                </label>
                <input
                  id="biz-start"
                  type="date"
                  value={bizStart}
                  onChange={(e) => setBizStart(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] bg-white text-sm font-bold text-[#152238]"
                />
              </div>
              <div>
                <label htmlFor="biz-end" className="block text-sm font-extrabold text-[#152238] mb-1.5">
                  End Date
                </label>
                <input
                  id="biz-end"
                  type="date"
                  value={bizEnd}
                  onChange={(e) => setBizEnd(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] bg-white text-sm font-bold text-[#152238]"
                />
              </div>
              <div>
                <label htmlFor="biz-hol" className="block text-sm font-extrabold text-[#152238] mb-1.5">
                  Public Holidays in Span
                </label>
                <input
                  id="biz-hol"
                  type="number"
                  min={0}
                  max={100}
                  value={holidaysCount}
                  onChange={(e) => setHolidaysCount(Math.max(0, Number(e.target.value)))}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] bg-white text-sm font-bold text-[#152238]"
                />
              </div>
            </div>
          </section>
        }
        resultCard={
          businessDaysResult
            ? {
                promptSummary: `Working days from ${bizStart} to ${bizEnd}`,
                promptSuffix: 'is:',
                mainValue: `${businessDaysResult.netBusinessDays} Business Days`,
                equation: `${businessDaysResult.totalCalendarDays} Calendar Days − ${businessDaysResult.weekendDays} Weekend Days − ${holidaysCount} Holidays = ${businessDaysResult.netBusinessDays} Working Days`,
              }
            : undefined
        }
        formulaCard={{
          introText: 'Working days calculation formula:',
          formulaText: 'Business Days = Total Calendar Days − Saturdays − Sundays − Public Holidays',
          exampleTitle: 'Example for a 29-day November project with 1 holiday:',
          exampleSteps: [
            'Total Calendar Span = 29 days (8 weekend days)',
            'Weekdays (Mon–Fri) = 21 days',
            'Subtract 1 Holiday = 20 Net Business Days',
          ],
        }}
        howToUseSteps={[
          'Select your project or shipping Start Date and End Date.',
          'Enter the number of weekday public holidays that fall within the period.',
          'Review net business days, total weekdays, and excluded weekend days.',
        ]}
        howItWorks={{
          paragraph:
            'The calculator iterates through every calendar date in your range, inspects the UTC day of the week (0 = Sunday, 6 = Saturday), counts Monday–Friday weekdays, and subtracts any specified holidays.',
          formulaBox: 'Net Workdays = Mon–Fri Count − Holidays',
          closingNote: 'Used for SLA turnaround times, escrow closings, payroll cycles, and shipping estimates.',
        }}
        understandingResult={{
          paragraph: businessDaysResult ? (
            <>
              Between <strong className="font-bold text-[#152238]">{bizStart}</strong> and{' '}
              <strong className="font-bold text-[#152238]">{bizEnd}</strong>, there are{' '}
              <strong className="font-bold text-[#152238]">{businessDaysResult.netBusinessDays} net working days</strong>{' '}
              and <strong className="font-bold text-[#152238]">{businessDaysResult.weekendDays} weekend days</strong>.
            </>
          ) : (
            <>Enter valid start and end dates above.</>
          ),
        }}
        faqs={[
          {
            question: 'What counts as a business day?',
            answer:
              'A standard business day is any Monday, Tuesday, Wednesday, Thursday, or Friday that is not an official public or bank holiday.',
          },
          {
            question: 'How many business days are in a typical year?',
            answer:
              'A standard 365-day year has 260 or 261 weekdays (Monday–Friday). After subtracting 10 to 11 federal holidays, most full-time schedules have 250 working days per year.',
          },
        ]}
      />
    );
  }

  if (variant === 'countdown') {
    return (
      <SingleCalculatorPageShell
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Date & Time', href: '/date-time' },
          { label: 'Countdown Calculator' },
        ]}
        title="Event & Birthday Countdown Calculator"
        subtitle="Count down the exact days, weeks, and hours remaining until a future wedding, vacation, birthday, exam, or launch date."
        heroSymbol="⏳"
        heroBadgeBg="bg-[#FFF6E5]"
        heroBadgeColor="text-[#D97706]"
        categoryName="Date & Time"
        categoryHref="/date-time"
        otherCalculatorsTitle="Other Date & Time Calculators"
        otherCalculators={DATE_TIME_RELATED}
        relatedCalculators={DATE_TIME_RELATED.slice(0, 4)}
        calculatorCard={
          <section className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-7 shadow-2xs space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="cd-name" className="block text-sm font-extrabold text-[#152238] mb-1.5">
                  Event or Milestone Name
                </label>
                <input
                  id="cd-name"
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] bg-white text-sm font-bold text-[#152238]"
                />
              </div>
              <div>
                <label htmlFor="cd-from" className="block text-sm font-extrabold text-[#152238] mb-1.5">
                  Current / Starting Date
                </label>
                <input
                  id="cd-from"
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] bg-white text-sm font-bold text-[#152238]"
                />
              </div>
              <div>
                <label htmlFor="cd-target" className="block text-sm font-extrabold text-[#152238] mb-1.5">
                  Target Event Date
                </label>
                <input
                  id="cd-target"
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] bg-white text-sm font-bold text-[#152238]"
                />
              </div>
            </div>
          </section>
        }
        resultCard={
          countdownResult
            ? {
                promptSummary: `Countdown to ${eventName || 'Event'} (${targetDate})`,
                promptSuffix: 'is:',
                mainValue: `${countdownResult.absDays.toLocaleString()} Days ${
                  countdownResult.diffDays >= 0 ? 'Remaining' : 'Ago'
                }`,
                equation: `${countdownResult.weeks} Weeks + ${countdownResult.remDays} Days (${countdownResult.totalHours.toLocaleString()} Total Hours)`,
              }
            : undefined
        }
        formulaCard={{
          introText: 'Countdown calculation formula:',
          formulaText: 'Remaining Days = (Target Date UTC − Current Date UTC) ÷ 86,400,000 ms',
          exampleTitle: 'Countdown breakdown:',
          exampleSteps: [
            'Total Remaining Days divided by 7 gives whole weeks and leftover days',
            'Multiply Remaining Days by 24 to express in total hours',
          ],
        }}
        howToUseSteps={[
          'Enter an optional name for your upcoming event, holiday, or deadline.',
          'Confirm the starting date and select your Target Event Date.',
          'View the remaining days, weeks + days, and total hours.',
        ]}
        howItWorks={{
          paragraph:
            'The countdown calculator computes the exact calendar difference between your reference date and target milestone date, breaking the span into weeks, days, and hours.',
          formulaBox: 'Weeks = floor(Days ÷ 7) · Extra Days = Days mod 7',
          closingNote: 'Works for both upcoming milestones and past anniversaries.',
        }}
        understandingResult={{
          paragraph: countdownResult ? (
            <>
              There are <strong className="font-bold text-[#152238]">{countdownResult.absDays} days</strong> (
              <strong className="font-bold text-[#152238]">
                {countdownResult.weeks} weeks and {countdownResult.remDays} days
              </strong>
              ) between {fromDate} and {targetDate}.
            </>
          ) : (
            <>Select valid dates above.</>
          ),
        }}
        faqs={[
          {
            question: 'How do I count down to my next birthday?',
            answer:
              'Set the Target Event Date to your upcoming birthday this year (or next year if your birthday has already passed) to see the exact weeks and days remaining.',
          },
          {
            question: 'Does the countdown include leap day?',
            answer:
              'Yes. If February 29 falls between your start date and target event date, it is automatically included in the day count.',
          },
        ]}
      />
    );
  }

  if (variant === 'work-hours') {
    const dayLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    return (
      <SingleCalculatorPageShell
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Date & Time', href: '/date-time' },
          { label: 'Work Hours & Timesheet Calculator' },
        ]}
        title="Work Hours & Weekly Timesheet Calculator"
        subtitle="Total your weekly work hours, separate regular and 1.5x overtime hours over 40 hours, and estimate gross weekly pay."
        heroSymbol="40h"
        heroBadgeBg="bg-[#E6F6F1]"
        heroBadgeColor="text-[#16856B]"
        categoryName="Date & Time"
        categoryHref="/date-time"
        otherCalculatorsTitle="Other Date & Time Calculators"
        otherCalculators={DATE_TIME_RELATED}
        relatedCalculators={DATE_TIME_RELATED.slice(0, 4)}
        calculatorCard={
          <section className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-7 shadow-2xs space-y-5">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {dayLabels.map((label, idx) => (
                <div key={label}>
                  <label
                    htmlFor={`wh-day-${idx}`}
                    className="block text-xs font-extrabold text-[#152238] mb-1"
                  >
                    {label} (hrs)
                  </label>
                  <input
                    id={`wh-day-${idx}`}
                    type="number"
                    step="0.25"
                    min={0}
                    max={24}
                    value={dailyHours[idx]}
                    onChange={(e) => {
                      const next = [...dailyHours];
                      next[idx] = Math.max(0, Number(e.target.value));
                      setDailyHours(next);
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-[#CBD5E1] bg-white text-sm font-bold text-[#152238]"
                  />
                </div>
              ))}
            </div>
            <div className="max-w-xs">
              <label htmlFor="wh-wage" className="block text-xs font-extrabold text-[#152238] mb-1">
                Hourly Base Rate ($/hr)
              </label>
              <input
                id="wh-wage"
                type="number"
                step="0.5"
                min={0}
                value={hourlyWage}
                onChange={(e) => setHourlyWage(Math.max(0, Number(e.target.value)))}
                className="w-full px-3.5 py-2 rounded-xl border border-[#CBD5E1] bg-white text-sm font-bold text-[#152238]"
              />
            </div>
          </section>
        }
        resultCard={{
          promptSummary: 'Weekly Timesheet Total',
          promptSuffix: 'is:',
          mainValue: `${workHoursResult.totalHours} Total Hours ($${workHoursResult.grossPay.toLocaleString()})`,
          equation: `Regular: ${workHoursResult.regularHours} hrs · Overtime (1.5×): ${workHoursResult.overtimeHours} hrs · Gross Pay: $${workHoursResult.grossPay.toLocaleString()}`,
        }}
        formulaCard={{
          introText: 'Weekly timesheet and FLSA overtime formula:',
          formulaText: 'Gross Pay = (Regular Hours × Rate) + (Overtime Hours × Rate × 1.5)',
          exampleTitle: 'Example for 44 hours worked at $30/hr:',
          exampleSteps: [
            'Regular Hours = 40 hrs × $30 = $1,200',
            'Overtime Hours = 4 hrs × $45 (1.5×) = $180',
            'Total Weekly Gross Pay = $1,380',
          ],
        }}
        howToUseSteps={[
          'Enter net hours worked for each day of the workweek (use decimals like 7.5 for 7h 30m).',
          'Enter your hourly pay rate to see estimated gross pay.',
          'Review total weekly hours, regular hours (up to 40), and 1.5x overtime hours.',
        ]}
        howItWorks={{
          paragraph:
            'This weekly timesheet calculator sums daily decimal hours, caps standard hours at 40 per week, and applies the 1.5x overtime multiplier to hours worked above 40.',
          formulaBox: 'Overtime Hours = max(0, Total Weekly Hours − 40)',
          closingNote: 'Need to convert start/end clock times for a single shift? Use the Time Duration Calculator.',
        }}
        understandingResult={{
          paragraph: (
            <>
              You logged <strong className="font-bold text-[#152238]">{workHoursResult.totalHours} hours</strong>{' '}
              this week ({workHoursResult.regularHours} regular hours and {workHoursResult.overtimeHours} overtime
              hours), totaling <strong className="font-bold text-[#152238]">${workHoursResult.grossPay.toLocaleString()}</strong> in gross pay.
            </>
          ),
        }}
        faqs={[
          {
            question: 'How do I enter 15, 30, or 45 minutes on a decimal timesheet?',
            answer:
              '15 minutes is 0.25 hours, 30 minutes is 0.50 hours, and 45 minutes is 0.75 hours.',
          },
          {
            question: 'When does 1.5x overtime start?',
            answer:
              'Under US FLSA standards, non-exempt employees earn 1.5x time-and-a-half pay for hours worked beyond 40 in a single workweek.',
          },
        ]}
      />
    );
  }

  if (variant === 'timer-stopwatch') {
    const mins = Math.floor(secondsLeft / 60);
    const secs = secondsLeft % 60;
    const displayClock = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    return (
      <SingleCalculatorPageShell
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Date & Time', href: '/date-time' },
          { label: 'Online Timer & Stopwatch' },
        ]}
        title="Online Timer & Focus Stopwatch"
        subtitle="Set a countdown timer for study blocks (Pomodoro 25m), workouts, cooking, or exams with instant preset intervals."
        heroSymbol="25:00"
        heroBadgeBg="bg-[#F3EEFF]"
        heroBadgeColor="text-[#7C3AED]"
        categoryName="Date & Time"
        categoryHref="/date-time"
        otherCalculatorsTitle="Other Date & Time Calculators"
        otherCalculators={DATE_TIME_RELATED}
        relatedCalculators={DATE_TIME_RELATED.slice(0, 4)}
        calculatorCard={
          <section className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-7 shadow-2xs space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <label htmlFor="tm-mins" className="block text-sm font-extrabold text-[#152238] mb-1.5">
                  Timer Duration (Minutes)
                </label>
                <input
                  id="tm-mins"
                  type="number"
                  min={1}
                  max={360}
                  value={timerMinutes}
                  onChange={(e) => {
                    const m = Math.max(1, Number(e.target.value));
                    setTimerMinutes(m);
                    setIsRunning(false);
                    setSecondsLeft(m * 60);
                  }}
                  className="w-40 px-4 py-2.5 rounded-xl border border-[#CBD5E1] bg-white text-base font-bold text-[#152238]"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {[5, 10, 15, 25, 45, 60].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      setTimerMinutes(m);
                      setIsRunning(false);
                      setSecondsLeft(m * 60);
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-extrabold bg-[#EEF3FF] text-[#2457D6] hover:bg-[#DCE7FF] cursor-pointer"
                  >
                    {m} min
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsRunning(!isRunning)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0B5CFF] hover:bg-[#1D46B0] text-white text-sm font-extrabold cursor-pointer"
              >
                {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isRunning ? 'Pause Timer' : 'Start Timer'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsRunning(false);
                  setSecondsLeft(timerMinutes * 60);
                }}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#152238] text-sm font-extrabold cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </div>
          </section>
        }
        resultCard={{
          promptSummary: `Active Countdown (${timerMinutes} min preset)`,
          promptSuffix: 'remaining:',
          mainValue: displayClock,
          equation: `Total Preset: ${timerMinutes * 60} seconds · Remaining: ${secondsLeft} seconds`,
        }}
        formulaCard={{
          introText: 'Timer conversion formula:',
          formulaText: 'Total Seconds = Minutes × 60 · Remaining MM:SS = floor(s ÷ 60) : (s mod 60)',
          exampleTitle: 'Pomodoro 25-minute focus session:',
          exampleSteps: [
            '25 minutes × 60 seconds = 1,500 total seconds',
            'Four 25-minute focus blocks + three 5-minute breaks = 115 minutes',
          ],
        }}
        howToUseSteps={[
          'Enter any number of minutes or click a quick preset (5, 10, 15, 25, 45, or 60 min).',
          'Click Start Timer to begin the live second-by-second countdown.',
          'Use Pause or Reset at any time.',
        ]}
        howItWorks={{
          paragraph:
            'Converts minutes into total seconds and ticks down every 1,000 milliseconds in your browser.',
          formulaBox: 'Seconds = Minutes × 60',
          closingNote: 'Great for 25-minute Pomodoro sprints, kitchen timing, and interval workouts.',
        }}
        understandingResult={{
          paragraph: (
            <>
              Your timer is set for <strong className="font-bold text-[#152238]">{timerMinutes} minutes</strong> (
              {timerMinutes * 60} seconds), with <strong className="font-bold text-[#152238]">{displayClock}</strong>{' '}
              currently remaining.
            </>
          ),
        }}
        faqs={[
          {
            question: 'What is the 25-minute Pomodoro timer method?',
            answer:
              'The Pomodoro Technique breaks focused work into 25-minute intervals separated by 5-minute rest breaks to prevent mental fatigue.',
          },
          {
            question: 'How many seconds are in 45 minutes?',
            answer: '45 minutes × 60 seconds/minute = 2,700 seconds.',
          },
        ]}
      />
    );
  }

  if (variant === 'military-time') {
    return (
      <SingleCalculatorPageShell
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Date & Time', href: '/date-time' },
          { label: 'Military Time Converter' },
        ]}
        title="Military Time & 24-Hour Clock Converter"
        subtitle="Convert between 24-hour military time (0000–2359 hrs) and standard 12-hour AM/PM clock time with a complete reference chart."
        heroSymbol="24h"
        heroBadgeBg="bg-[#EBF2FF]"
        heroBadgeColor="text-[#2457D6]"
        categoryName="Date & Time"
        categoryHref="/date-time"
        otherCalculatorsTitle="Other Date & Time Calculators"
        otherCalculators={DATE_TIME_RELATED}
        relatedCalculators={DATE_TIME_RELATED.slice(0, 4)}
        calculatorCard={
          <section className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-7 shadow-2xs space-y-5">
            <div>
              <label htmlFor="mil-time" className="block text-sm font-extrabold text-[#152238] mb-2">
                Select or Enter Time (24-Hour / 12-Hour)
              </label>
              <input
                id="mil-time"
                type="time"
                value={time24}
                onChange={(e) => setTime24(e.target.value)}
                className="w-full max-w-xs px-4 py-3 rounded-xl border border-[#CBD5E1] bg-white text-base font-bold text-[#152238]"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {['00:00', '06:30', '12:00', '13:30', '17:45', '21:15'].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setTime24(preset)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#EEF3FF] text-[#2457D6] hover:bg-[#DCE7FF] cursor-pointer"
                >
                  {preset.replace(':', '')} hrs
                </button>
              ))}
            </div>
          </section>
        }
        resultCard={{
          promptSummary: `Conversion for ${time24}`,
          promptSuffix: 'is:',
          mainValue: `${militaryTimeResult.std12}  ↔  ${militaryTimeResult.milCode}`,
          equation: `24-Hour Clock: ${time24}  ·  Military Format: ${militaryTimeResult.milCode}  ·  12-Hour Format: ${militaryTimeResult.std12}`,
        }}
        formulaCard={{
          introText: '24-hour to 12-hour AM/PM rule:',
          formulaText: 'If Hour ≥ 13, subtract 12 and append PM (e.g. 17:45 → 17 − 12 = 5:45 PM)',
          exampleTitle: 'Standard Military Time Conversions:',
          exampleSteps: [
            '0000 hrs = 12:00 AM (Midnight)',
            '1200 hrs = 12:00 PM (Noon)',
            '1745 hrs = 5:45 PM (17 − 12 = 5 PM)',
          ],
        }}
        howToUseSteps={[
          'Enter any time or pick a military preset button.',
          'Read both the 12-hour AM/PM equivalent and the 4-digit military time code.',
        ]}
        howItWorks={{
          paragraph:
            'Military and aviation time runs from 0000 (midnight) to 2359, eliminating AM/PM ambiguity. Hours 01 through 11 match AM; hours 13 through 23 subtract 12 to yield 1:00 PM through 11:00 PM.',
          formulaBox: 'PM Hour + 12 = Military Hour',
          closingNote: 'Used in hospitals, airlines, emergency services, logistics, and ISO 8601 timestamps.',
        }}
        understandingResult={{
          paragraph: (
            <>
              <strong className="font-bold text-[#152238]">{militaryTimeResult.milCode}</strong> in military time
              equals <strong className="font-bold text-[#152238]">{militaryTimeResult.std12}</strong> on a standard
              12-hour clock.
            </>
          ),
        }}
        faqs={[
          {
            question: 'What is 1700 in regular 12-hour time?',
            answer: 'Subtract 12 from 17 to get 5:00 PM.',
          },
          {
            question: 'Is midnight 0000 or 2400 in military time?',
            answer:
              '0000 marks the start of a new day at midnight (12:00 AM), while 2400 is occasionally used to denote the exact end of a day.',
          },
        ]}
      />
    );
  }

  // Default: variant === 'time-unit'
  return (
    <SingleCalculatorPageShell
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Date & Time', href: '/date-time' },
        { label: 'Time Unit Converter' },
      ]}
      title="Time Unit & Decimal Hours Converter"
      subtitle="Convert hours, minutes, and seconds into decimal hours, total minutes, total seconds, and days."
      heroSymbol="h↔s"
      heroBadgeBg="bg-[#FFF6E5]"
      heroBadgeColor="text-[#D97706]"
      categoryName="Date & Time"
      categoryHref="/date-time"
      otherCalculatorsTitle="Other Date & Time Calculators"
      otherCalculators={DATE_TIME_RELATED}
      relatedCalculators={DATE_TIME_RELATED.slice(0, 4)}
      calculatorCard={
        <section className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-7 shadow-2xs space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="tu-h" className="block text-sm font-extrabold text-[#152238] mb-1.5">
                Hours (hr)
              </label>
              <input
                id="tu-h"
                type="number"
                min={0}
                value={inputHours}
                onChange={(e) => setInputHours(Math.max(0, Number(e.target.value)))}
                className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] bg-white text-sm font-bold text-[#152238]"
              />
            </div>
            <div>
              <label htmlFor="tu-m" className="block text-sm font-extrabold text-[#152238] mb-1.5">
                Minutes (min)
              </label>
              <input
                id="tu-m"
                type="number"
                min={0}
                value={inputMinutes}
                onChange={(e) => setInputMinutes(Math.max(0, Number(e.target.value)))}
                className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] bg-white text-sm font-bold text-[#152238]"
              />
            </div>
            <div>
              <label htmlFor="tu-s" className="block text-sm font-extrabold text-[#152238] mb-1.5">
                Seconds (sec)
              </label>
              <input
                id="tu-s"
                type="number"
                min={0}
                value={inputSeconds}
                onChange={(e) => setInputSeconds(Math.max(0, Number(e.target.value)))}
                className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] bg-white text-sm font-bold text-[#152238]"
              />
            </div>
          </div>
        </section>
      }
      resultCard={{
        promptSummary: `${inputHours}h ${inputMinutes}m ${inputSeconds}s converted`,
        promptSuffix: 'equals:',
        mainValue: `${timeUnitResult.decimalHours} Decimal Hours`,
        equation: `${timeUnitResult.totalMinutes.toLocaleString()} Minutes  ·  ${timeUnitResult.totalSeconds.toLocaleString()} Seconds  ·  ${timeUnitResult.days} Days`,
      }}
      formulaCard={{
        introText: 'Time unit conversion formulas:',
        formulaText: 'Decimal Hours = Hours + (Minutes ÷ 60) + (Seconds ÷ 3,600)',
        exampleTitle: 'Example for 8 hours 45 minutes:',
        exampleSteps: [
          'Decimal Hours = 8 + (45 ÷ 60) = 8.75 hours',
          'Total Minutes = (8 × 60) + 45 = 525 minutes',
          'Total Seconds = 525 × 60 = 31,500 seconds',
        ],
      }}
      howToUseSteps={[
        'Enter hours, minutes, and seconds in the fields above.',
        'View the exact equivalent in decimal hours, total minutes, total seconds, and days.',
      ]}
      howItWorks={{
        paragraph:
          'Since time uses base-60 (60 seconds per minute, 60 minutes per hour) and 24 hours per day, this converter normalizes your input to total seconds first, then divides by 3,600 for decimal hours and 86,400 for days.',
        formulaBox: '1 Day = 24 Hours = 1,440 Minutes = 86,400 Seconds',
        closingNote: 'Ideal for converting HH:MM:SS durations into decimal numbers for payroll or physics formulas.',
      }}
      understandingResult={{
        paragraph: (
          <>
            <strong className="font-bold text-[#152238]">
              {inputHours}h {inputMinutes}m {inputSeconds}s
            </strong>{' '}
            equals <strong className="font-bold text-[#152238]">{timeUnitResult.decimalHours} hours</strong>,{' '}
            <strong className="font-bold text-[#152238]">{timeUnitResult.totalMinutes.toLocaleString()} minutes</strong>, or{' '}
            <strong className="font-bold text-[#152238]">{timeUnitResult.totalSeconds.toLocaleString()} seconds</strong>.
          </>
        ),
      }}
      faqs={[
        {
          question: 'How many seconds are in a day?',
          answer: '24 hours × 60 minutes × 60 seconds = 86,400 seconds per day.',
        },
        {
          question: 'How do I convert minutes into decimal hours?',
          answer: 'Divide minutes by 60. For example, 45 minutes ÷ 60 = 0.75 hours.',
        },
      ]}
    />
  );
}
