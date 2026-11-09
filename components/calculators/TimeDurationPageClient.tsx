'use client';

import React, { useState, useMemo } from 'react';
import { Calculator, RotateCcw } from 'lucide-react';
import SingleCalculatorPageShell, {
  RelatedCalculatorLink,
} from '@/components/calculator-page/SingleCalculatorPageShell';

const TIME_DURATION_RELATED: RelatedCalculatorLink[] = [
  {
    name: 'Date Difference Calculator',
    description: 'Count calendar days and weeks between any two dates.',
    href: '/date-difference-calculator',
    iconVariant: 'clock-indigo',
  },
  {
    name: 'Age Calculator',
    description: 'Calculate exact chronological age in years, months, and days.',
    href: '/age-calculator',
    iconVariant: 'arrows-blue',
  },
  {
    name: 'Salary to Hourly Calculator',
    description: 'Convert hourly wage and worked hours into annual pay.',
    href: '/finance/salary-to-hourly-calculator',
    iconVariant: 'coins-gold',
  },
  {
    name: 'Overtime Pay Calculator',
    description: 'Calculate 1.5x and 2.0x overtime earnings for hourly shifts.',
    href: '/finance/overtime-pay-calculator',
    iconVariant: 'chart-green',
  },
  {
    name: 'Speed & Velocity Converter',
    description: 'Convert mph, km/h, and m/s for travel time planning.',
    href: '/conversions/speed',
    iconVariant: 'tag-amber',
  },
];

export default function TimeDurationPageClient() {
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:30');
  const [breakMinutes, setBreakMinutes] = useState(30);

  const result = useMemo(() => {
    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);
    const startTotal = (sh || 0) * 60 + (sm || 0);
    let endTotal = (eh || 0) * 60 + (em || 0);
    if (endTotal < startTotal) {
      endTotal += 24 * 60;
    }
    const rawDiff = Math.max(0, endTotal - startTotal - Math.max(0, breakMinutes));
    const hours = Math.floor(rawDiff / 60);
    const minutes = rawDiff % 60;
    const decimalHours = (rawDiff / 60).toFixed(2);

    return { hours, minutes, decimalHours, totalMinutes: rawDiff };
  }, [startTime, endTime, breakMinutes]);

  const handleReset = () => {
    setStartTime('09:00');
    setEndTime('17:30');
    setBreakMinutes(30);
  };

  const calculatorCard = (
    <section
      id="calculator"
      aria-label="Time Duration Calculator input panel"
      className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-7 shadow-2xs space-y-6"
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#EBF2FF] text-[#2457D6] flex items-center justify-center shrink-0 mt-0.5">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-[#152238]">
            Calculate Hours &amp; Minutes Between Times
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Enter your start time, end time, and unpaid break minutes to find net duration and payroll decimal hours.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div>
          <label htmlFor="start-time" className="block text-sm font-extrabold text-[#152238] mb-2">
            Start Time <span className="text-[#E11D48]">*</span>
          </label>
          <input
            id="start-time"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] bg-white text-base font-bold text-[#152238] focus:border-[#2457D6] focus:outline-none focus:ring-3 focus:ring-[#2457D6]/15"
          />
          <p className="text-xs text-[#64748B] mt-1.5">Shift or event start (e.g. 09:00)</p>
        </div>

        <div>
          <label htmlFor="end-time" className="block text-sm font-extrabold text-[#152238] mb-2">
            End Time <span className="text-[#E11D48]">*</span>
          </label>
          <input
            id="end-time"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] bg-white text-base font-bold text-[#152238] focus:border-[#2457D6] focus:outline-none focus:ring-3 focus:ring-[#2457D6]/15"
          />
          <p className="text-xs text-[#64748B] mt-1.5">Shift or event end (e.g. 17:30)</p>
        </div>

        <div>
          <label htmlFor="break-mins" className="block text-sm font-extrabold text-[#152238] mb-2">
            Break Deduction (Min)
          </label>
          <div className="flex items-stretch rounded-xl border border-[#CBD5E1] bg-white overflow-hidden focus-within:border-[#2457D6] focus-within:ring-3 focus-within:ring-[#2457D6]/15">
            <input
              id="break-mins"
              type="number"
              min={0}
              max={720}
              value={breakMinutes}
              onChange={(e) => setBreakMinutes(Math.max(0, Number(e.target.value)))}
              className="w-full px-4 py-3 bg-white text-base font-bold text-[#152238] tabular-nums focus:outline-none"
            />
            <span className="px-3.5 bg-[#F1F5F9] border-l border-[#CBD5E1] text-xs font-bold text-[#475569] flex items-center">
              min
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-1.5">Unpaid break (e.g. 30 min)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 pt-1">
        <button
          type="button"
          onClick={() => {}}
          className="sm:col-span-8 inline-flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl bg-[#0B5CFF] hover:bg-[#1D46B0] text-white text-base font-extrabold shadow-xs transition-colors cursor-pointer"
        >
          <Calculator className="w-5 h-5" />
          <span>Calculate</span>
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="sm:col-span-4 inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-[#F1F5F9] hover:bg-[#E2E8F0] border border-[#CBD5E1] text-[#152238] text-base font-extrabold transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>
      </div>
    </section>
  );

  return (
    <SingleCalculatorPageShell
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Date & Time', href: '/date-time' },
        { label: 'Time Duration Calculator' },
      ]}
      title="Time Duration Calculator"
      subtitle="Calculate exact hours, minutes, and decimal payroll hours between two clock times."
      heroSymbol="⏱"
      heroBadgeBg="bg-[#E6F6F1]"
      heroBadgeColor="text-[#16856B]"
      categoryName="Date & Time"
      categoryHref="/date-time"
      otherCalculatorsTitle="Other Date & Time Calculators"
      otherCalculators={TIME_DURATION_RELATED}
      relatedCalculators={TIME_DURATION_RELATED.slice(0, 4)}
      calculatorCard={calculatorCard}
      resultCard={{
        promptSummary: `Duration from ${startTime} to ${endTime} (−${breakMinutes}m break)`,
        promptSuffix: 'is:',
        mainValue: `${result.hours} hrs ${result.minutes} mins`,
        equation: `Decimal Hours: ${result.decimalHours} hrs  ·  Total Minutes: ${result.totalMinutes} mins`,
      }}
      formulaCard={{
        introText: 'The formula to calculate net time duration and payroll decimal hours is:',
        formulaText: 'Decimal Hours = (End Minutes − Start Minutes − Break Minutes) ÷ 60',
        exampleTitle: 'Shift from 09:00 to 17:30 with a 30-minute break:',
        exampleSteps: [
          'Gross Span = 8 hours 30 minutes (510 minutes)',
          'Subtract 30-minute break = 8 hours 0 minutes (480 minutes)',
          'Decimal Hours = 480 ÷ 60 = 8.00 hours',
        ],
      }}
      howToUseSteps={[
        'Enter the Start Time in the first field.',
        'Enter the End Time in the second field.',
        'Enter any unpaid Break Deduction in minutes (or 0 for no break).',
        'View your net hours and minutes, decimal hours for payroll, and total minutes.',
      ]}
      howItWorks={{
        paragraph:
          'The calculator converts both clock times into minutes from midnight, handles overnight shifts that cross midnight (adding 24 hours automatically), subtracts break minutes, and divides by 60 for decimal payroll hours.',
        formulaBox: 'Net Minutes = (End Time − Start Time) − Break Minutes',
        closingNote:
          'Decimal hours (e.g., 7.75 hrs for 7 hours 45 minutes) can be multiplied directly by your hourly wage.',
      }}
      understandingResult={{
        paragraph: (
          <>
            Your net duration is{' '}
            <strong className="font-bold text-[#152238]">
              {result.hours} hours and {result.minutes} minutes
            </strong>
            , which equals <strong className="font-bold text-[#152238]">{result.decimalHours} decimal hours</strong> ({' '}
            <strong className="font-bold text-[#152238]">{result.totalMinutes} total minutes</strong>). When entering timesheets into payroll software, use the decimal hours value so minutes are billed accurately.
          </>
        ),
      }}
      faqs={[
        {
          question: 'Why is 8 hours 30 minutes equal to 8.50 decimal hours?',
          answer:
            'Because 30 minutes is half of a 60-minute hour (30 ÷ 60 = 0.50). Similarly, 15 minutes is 0.25 hours and 45 minutes is 0.75 hours.',
        },
        {
          question: 'Does this calculator work for overnight shifts?',
          answer:
            'Yes. If the End Time is earlier than the Start Time (such as 22:00 to 06:00), the calculator automatically treats the end time as the following morning.',
        },
        {
          question: 'How do I calculate gross duration without a break?',
          answer:
            'Simply enter 0 in the Break Deduction (Min) field to see the full uninterrupted time span.',
        },
        {
          question: 'How do I convert minutes to decimal hours manually?',
          answer:
            'Divide the number of minutes by 60. For example, 20 minutes ÷ 60 = 0.3333 hours.',
        },
      ]}
    />
  );
}
