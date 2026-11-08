'use client';

import React, { useState, useMemo } from 'react';
import { Calculator, RotateCcw, AlertCircle } from 'lucide-react';
import SingleCalculatorPageShell, {
  RelatedCalculatorLink,
} from '@/components/calculator-page/SingleCalculatorPageShell';

const DATE_RELATED_LINKS: RelatedCalculatorLink[] = [
  {
    name: 'Date Difference Calculator',
    description: 'Find exact calendar days and weeks between any two dates.',
    href: '/date-difference-calculator',
    iconVariant: 'clock-indigo',
  },
  {
    name: 'Time Duration Calculator',
    description: 'Calculate hours, minutes, and payroll decimal hours.',
    href: '/time-duration-calculator',
    iconVariant: 'arrows-blue',
  },
  {
    name: 'BMI Calculator',
    description: 'Calculate Body Mass Index and healthy weight range.',
    href: '/bmi-calculator',
    iconVariant: 'heart-rose',
  },
  {
    name: '401(k) Retirement Calculator',
    description: 'Project retirement savings by age and target retirement date.',
    href: '/finance/401k-calculator',
    iconVariant: 'coins-gold',
  },
  {
    name: 'RMD Calculator',
    description: 'Check Required Minimum Distributions by age (73 or 75).',
    href: '/finance/rmd-calculator',
    iconVariant: 'chart-green',
  },
];

export default function AgeCalculatorPage() {
  const [birthDate, setBirthDate] = useState('1995-06-15');
  const [targetDate, setTargetDate] = useState('2026-10-26');

  const result = useMemo(() => {
    const start = new Date(birthDate);
    const end = new Date(targetDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) {
      return null;
    }

    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const totalDays = Math.floor(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;

    return {
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      totalMonths,
    };
  }, [birthDate, targetDate]);

  const handleReset = () => {
    setBirthDate('1995-06-15');
    setTargetDate('2026-10-26');
  };

  const calculatorCard = (
    <section
      id="calculator"
      aria-label="Age Calculator input panel"
      className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-7 shadow-2xs space-y-6"
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#EBF2FF] text-[#2457D6] flex items-center justify-center shrink-0 mt-0.5">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-[#152238]">
            Calculate Exact Chronological Age
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Enter your date of birth and the target date to find your exact age in years, months, and days.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="birth-date" className="block text-sm font-extrabold text-[#152238] mb-2">
            Date of Birth <span className="text-[#E11D48]">*</span>
          </label>
          <input
            id="birth-date"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] bg-white text-base font-bold text-[#152238] focus:border-[#2457D6] focus:outline-none focus:ring-3 focus:ring-[#2457D6]/15"
          />
          <p className="text-xs text-[#64748B] mt-1.5">Select birth year, month, and day</p>
        </div>

        <div>
          <label htmlFor="target-date" className="block text-sm font-extrabold text-[#152238] mb-2">
            Age at the Date of <span className="text-[#E11D48]">*</span>
          </label>
          <input
            id="target-date"
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] bg-white text-base font-bold text-[#152238] focus:border-[#2457D6] focus:outline-none focus:ring-3 focus:ring-[#2457D6]/15"
          />
          <p className="text-xs text-[#64748B] mt-1.5">Defaults to current date or future milestone</p>
        </div>
      </div>

      {!result && (
        <div
          role="alert"
          className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#FFF1F2] border border-[#FECDD3] text-xs sm:text-sm font-bold text-[#BE123C]"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Please ensure the target date is on or after the date of birth.</span>
        </div>
      )}

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
        { label: 'Age Calculator' },
      ]}
      title="Age Calculator"
      subtitle="Find your exact chronological age in years, months, weeks, and days between your date of birth and any target date."
      heroSymbol="🎂"
      heroBadgeBg="bg-[#EEF2FF]"
      heroBadgeColor="text-[#4F46E5]"
      categoryName="Date & Time"
      categoryHref="/date-time"
      otherCalculatorsTitle="Other Date & Time Calculators"
      otherCalculators={DATE_RELATED_LINKS}
      relatedCalculators={DATE_RELATED_LINKS.slice(0, 4)}
      calculatorCard={calculatorCard}
      resultCard={
        result
          ? {
              promptSummary: `Age from ${birthDate} to ${targetDate}`,
              promptSuffix: 'is:',
              mainValue: `${result.years} yrs, ${result.months} mos, ${result.days} days`,
              equation: `${result.totalMonths.toLocaleString()} total months  ·  ${result.totalWeeks.toLocaleString()} total weeks  ·  ${result.totalDays.toLocaleString()} total days`,
            }
          : undefined
      }
      formulaCard={{
        introText: 'The calendar formula to compute exact chronological age is:',
        formulaText: 'Age = (Target Year − Birth Year) adjusted for Month & Day borrows',
        exampleTitle: 'Born June 15, 1995 to October 26, 2026:',
        exampleSteps: [
          'Years = 2026 − 1995 = 31 years',
          'Months = October (10) − June (6) = 4 months',
          'Days = 26 − 15 = 11 days (31 yrs, 4 mos, 11 days)',
        ],
      }}
      howToUseSteps={[
        'Select or type your Date of Birth in the first field.',
        'Select the Target Date (today or any past/future date) in the second field.',
        'Click the Calculate button to compute your chronological age.',
        'View your age in years, months, and days, plus total weeks and total days.',
      ]}
      howItWorks={{
        paragraph:
          'The calculator compares calendar years, months, and days between the two dates, automatically accounting for 28-, 30-, and 31-day months as well as leap years (February 29).',
        formulaBox: 'Total Days = (Target Date − Birth Date) ÷ 86,400,000 ms',
        closingNote:
          'Follows the universal Western chronological age system where age increments on your birthday each year.',
      }}
      understandingResult={{
        paragraph: result ? (
          <>
            Between <strong className="font-bold text-[#152238]">{birthDate}</strong> and{' '}
            <strong className="font-bold text-[#152238]">{targetDate}</strong>, the exact elapsed age is{' '}
            <strong className="font-bold text-[#152238]">
              {result.years} years, {result.months} months, and {result.days} days
            </strong>
            , which equals <strong className="font-bold text-[#152238]">{result.totalDays.toLocaleString()} total calendar days</strong>.
          </>
        ) : (
          <>Enter a valid birth date and target date above to see your complete age breakdown.</>
        ),
      }}
      faqs={[
        {
          question: 'Does the Age Calculator account for leap years?',
          answer:
            'Yes. Every leap year (such as 2000, 2004, 2008, 2012, 2016, 2020, and 2024) and exact month length is automatically included in the calculation.',
        },
        {
          question: 'Can I calculate my age on a future date?',
          answer:
            'Yes. Set the "Age at the Date of" field to any future year to verify retirement eligibility, milestone birthdays, or school enrollment cutoffs.',
        },
        {
          question: 'How are months with different lengths handled?',
          answer:
            'When the target day of the month is earlier than the birth day, the calculator borrows the exact number of days from the preceding calendar month.',
        },
        {
          question: 'How do I copy or print my age result?',
          answer:
            'Click the Copy result or Print button in the green result card above to copy the full summary or print a clean copy.',
        },
      ]}
    />
  );
}
