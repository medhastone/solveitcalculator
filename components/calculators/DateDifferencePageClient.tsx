'use client';

import React, { useState, useMemo } from 'react';
import { Calculator, RotateCcw } from 'lucide-react';
import SingleCalculatorPageShell, {
  RelatedCalculatorLink,
} from '@/components/calculator-page/SingleCalculatorPageShell';

const DATE_DIFF_RELATED: RelatedCalculatorLink[] = [
  {
    name: 'Age Calculator',
    description: 'Find exact age in years, months, and days from birth date.',
    href: '/age-calculator',
    iconVariant: 'clock-indigo',
  },
  {
    name: 'Time Duration Calculator',
    description: 'Calculate hours and minutes between two clock times.',
    href: '/time-duration-calculator',
    iconVariant: 'arrows-blue',
  },
  {
    name: 'Loan Payment Calculator',
    description: 'Calculate monthly payments over any loan duration.',
    href: '/loan-calculator',
    iconVariant: 'coins-gold',
  },
  {
    name: 'Percentage Calculator',
    description: 'Calculate project completion percentages and milestones.',
    href: '/math/percentage-calculator',
    iconVariant: 'percent-coral',
  },
  {
    name: 'Salary to Hourly Calculator',
    description: 'Convert annual pay across working days and weeks.',
    href: '/finance/salary-to-hourly-calculator',
    iconVariant: 'chart-green',
  },
];

export default function DateDifferencePageClient() {
  const [startDate, setStartDate] = useState('2026-01-01');
  const [endDate, setEndDate] = useState('2026-10-26');
  const [includeEndDay, setIncludeEndDay] = useState(false);

  const result = useMemo(() => {
    const d1 = new Date(startDate);
    const d2 = new Date(endDate);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return null;

    const diffMs = Math.abs(d2.getTime() - d1.getTime());
    const rawDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    const totalDays = includeEndDay ? rawDays + 1 : rawDays;
    const weeks = Math.floor(totalDays / 7);
    const remainingDays = totalDays % 7;
    const approxWorkdays = Math.round(totalDays * (5 / 7));

    return {
      totalDays,
      weeks,
      remainingDays,
      approxWorkdays,
    };
  }, [startDate, endDate, includeEndDay]);

  const handleReset = () => {
    setStartDate('2026-01-01');
    setEndDate('2026-10-26');
    setIncludeEndDay(false);
  };

  const calculatorCard = (
    <section
      id="calculator"
      aria-label="Date Difference Calculator input panel"
      className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-7 shadow-2xs space-y-6"
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#EBF2FF] text-[#2457D6] flex items-center justify-center shrink-0 mt-0.5">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-[#152238]">
            Calculate Days Between Two Dates
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Select a start date and an end date to find total calendar days, weeks, and weekdays.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="start-date" className="block text-sm font-extrabold text-[#152238] mb-2">
            Start Date <span className="text-[#E11D48]">*</span>
          </label>
          <input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] bg-white text-base font-bold text-[#152238] focus:border-[#2457D6] focus:outline-none focus:ring-3 focus:ring-[#2457D6]/15"
          />
          <p className="text-xs text-[#64748B] mt-1.5">Beginning calendar date</p>
        </div>

        <div>
          <label htmlFor="end-date" className="block text-sm font-extrabold text-[#152238] mb-2">
            End Date <span className="text-[#E11D48]">*</span>
          </label>
          <input
            id="end-date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] bg-white text-base font-bold text-[#152238] focus:border-[#2457D6] focus:outline-none focus:ring-3 focus:ring-[#2457D6]/15"
          />
          <p className="text-xs text-[#64748B] mt-1.5">Ending calendar date</p>
        </div>
      </div>

      <label className="inline-flex items-center gap-2.5 text-sm font-bold text-[#152238] cursor-pointer select-none">
        <input
          type="checkbox"
          checked={includeEndDay}
          onChange={(e) => setIncludeEndDay(e.target.checked)}
          className="w-4 h-4 rounded border-[#CBD5E1] text-[#2457D6]"
        />
        <span>Include end date in calculation (+1 day)</span>
      </label>

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
        { label: 'Date Difference Calculator' },
      ]}
      title="Date Difference Calculator"
      subtitle="Calculate the exact number of calendar days, weeks, and approximate workdays between any two dates."
      heroSymbol="📅"
      heroBadgeBg="bg-[#EBF2FF]"
      heroBadgeColor="text-[#2457D6]"
      categoryName="Date & Time"
      categoryHref="/date-time"
      otherCalculatorsTitle="Other Date & Time Calculators"
      otherCalculators={DATE_DIFF_RELATED}
      relatedCalculators={DATE_DIFF_RELATED.slice(0, 4)}
      calculatorCard={calculatorCard}
      resultCard={
        result
          ? {
              promptSummary: `Days between ${startDate} and ${endDate}`,
              promptSuffix: 'is:',
              mainValue: `${result.totalDays.toLocaleString()} Days`,
              equation: `${result.totalDays} Days = ${result.weeks} Weeks + ${result.remainingDays} Days (≈ ${result.approxWorkdays} Weekdays)`,
            }
          : undefined
      }
      formulaCard={{
        introText: 'The formula to calculate the number of days between two dates is:',
        formulaText: 'Total Days = |End Date − Start Date| (+ 1 if end date included)',
        exampleTitle: 'From Jan 1, 2026 to Oct 26, 2026:',
        exampleSteps: [
          'Elapsed Calendar Days = 298 Days',
          'Weeks Breakdown = 42 Weeks and 4 Days',
          'Approximate Weekdays = 213 Workdays',
        ],
      }}
      howToUseSteps={[
        'Select your Start Date in the first field.',
        'Select your End Date in the second field.',
        'Check "Include end date" if you want inclusive day counting (+1 day).',
        'View the total calendar days, weeks, and estimated workdays.',
      ]}
      howItWorks={{
        paragraph:
          'The calculator converts both calendar dates to UTC midnight timestamps, subtracts them, and divides by 86,400,000 milliseconds per day so Daylight Saving Time shifts never distort the day count.',
        formulaBox: 'Days = |UTC(End Date) − UTC(Start Date)| ÷ (24 × 60 × 60 × 1000)',
        closingNote:
          'Works for past, present, and future dates across any year.',
      }}
      understandingResult={{
        paragraph: result ? (
          <>
            The span between <strong className="font-bold text-[#152238]">{startDate}</strong> and{' '}
            <strong className="font-bold text-[#152238]">{endDate}</strong> is{' '}
            <strong className="font-bold text-[#152238]">{result.totalDays.toLocaleString()} days</strong>, which breaks down into{' '}
            <strong className="font-bold text-[#152238]">
              {result.weeks} weeks and {result.remainingDays} days
            </strong>
            . Use this tool for project timelines, travel itineraries, contract notice periods, and visa stays.
          </>
        ) : (
          <>Select two valid dates above to compute the exact calendar span.</>
        ),
      }}
      faqs={[
        {
          question: 'Should I check "Include end date in calculation"?',
          answer:
            'Leave it unchecked if you are measuring elapsed time (for example, hotel nights). Check it if both the first and last day count as full active days (for example, a vacation from Monday through Friday = 5 days).',
        },
        {
          question: 'Does this calculator account for leap years?',
          answer:
            'Yes. February 29 is automatically counted whenever your date span crosses a leap year.',
        },
        {
          question: 'How are weekdays estimated?',
          answer:
            'Approximate workdays are calculated as 5/7ths of the total calendar span (excluding Saturdays and Sundays).',
        },
        {
          question: 'Can I put an earlier date in the End Date field?',
          answer:
            'Yes. The calculator takes the absolute difference between the two dates, so the order does not cause an error.',
        },
      ]}
    />
  );
}
