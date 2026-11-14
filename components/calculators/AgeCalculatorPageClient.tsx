'use client';

import React, { useState, useMemo } from 'react';
import { Calculator, RotateCcw, AlertCircle } from 'lucide-react';
import SingleCalculatorPageShell, {
  RelatedCalculatorLink,
  ReferenceTableRow,
} from '@/components/calculator-page/SingleCalculatorPageShell';

const DATE_RELATED_LINKS: RelatedCalculatorLink[] = [
  {
    name: 'Date Difference Calculator',
    description: 'Find exact calendar days, weekdays, and weeks between any two dates.',
    href: '/date-difference-calculator',
    iconVariant: 'clock-indigo',
  },
  {
    name: 'Time Duration Calculator',
    description: 'Calculate elapsed shift hours, minutes, and payroll decimal hours.',
    href: '/time-duration-calculator',
    iconVariant: 'arrows-blue',
  },
  {
    name: 'Days From Today Calculator',
    description: 'Add or subtract days from any calendar date for project deadlines.',
    href: '/days-from-today',
    iconVariant: 'tag-amber',
  },
  {
    name: '401(k) Retirement Calculator',
    description: 'Project retirement savings growth by current age and target age.',
    href: '/finance/401k-calculator',
    iconVariant: 'coins-gold',
  },
  {
    name: 'RMD Withdrawal Calculator',
    description: 'Check Required Minimum Distributions at age 73 or 75.',
    href: '/finance/rmd-calculator',
    iconVariant: 'chart-green',
  },
];

export default function AgeCalculatorPageClient({
  initialTodayDate,
}: {
  initialTodayDate?: string;
}) {
  const todayIso = initialTodayDate || new Date().toISOString().slice(0, 10);
  const currentYear = Number(todayIso.slice(0, 4)) || 2026;

  const [birthDate, setBirthDate] = useState('');
  const [targetDate, setTargetDate] = useState(todayIso);

  const isInputEmpty = birthDate.trim() === '' || targetDate.trim() === '';

  const result = useMemo(() => {
    if (birthDate.trim() === '' || targetDate.trim() === '') {
      return null;
    }
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

  const showDateOrderError = !isInputEmpty && result === null;

  const handleLoadSample = () => {
    setBirthDate('1995-06-15');
    setTargetDate(todayIso);
  };

  const handleReset = () => {
    setBirthDate('');
    setTargetDate(todayIso);
  };

  const sampleAge1995 = currentYear - 1995;

  const ageLookupRows: ReferenceTableRow[] = useMemo(
    () => [
      {
        scenarioLabel: `Born ${currentYear - 18}`,
        multiplierLabel: `Turns 18 in ${currentYear}`,
        calculatedOutput: '18 years old',
        formulaNote: `${currentYear} − ${currentYear - 18} = 18`,
      },
      {
        scenarioLabel: `Born ${currentYear - 25}`,
        multiplierLabel: `Turns 25 in ${currentYear}`,
        calculatedOutput: '25 years old',
        formulaNote: `${currentYear} − ${currentYear - 25} = 25`,
      },
      {
        scenarioLabel: `Born ${currentYear - 30}`,
        multiplierLabel: `Turns 30 in ${currentYear}`,
        calculatedOutput: '30 years old',
        formulaNote: `${currentYear} − ${currentYear - 30} = 30`,
      },
      {
        scenarioLabel: `Born ${currentYear - 40}`,
        multiplierLabel: `Turns 40 in ${currentYear}`,
        calculatedOutput: '40 years old',
        formulaNote: `${currentYear} − ${currentYear - 40} = 40`,
      },
      {
        scenarioLabel: `Born ${currentYear - 50}`,
        multiplierLabel: `Turns 50 in ${currentYear}`,
        calculatedOutput: '50 years old',
        formulaNote: `${currentYear} − ${currentYear - 50} = 50`,
      },
      {
        scenarioLabel: `Born ${currentYear - 65}`,
        multiplierLabel: `Turns 65 in ${currentYear}`,
        calculatedOutput: '65 years old',
        formulaNote: `${currentYear} − ${currentYear - 65} = 65`,
      },
    ],
    [currentYear]
  );

  const calculatorCard = (
    <section
      id="calculator"
      aria-label="Age Calculator input panel"
      className="bg-white rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 shadow-2xs space-y-4"
    >
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-start gap-2.5 sm:gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#EBF2FF] text-[#2457D6] flex items-center justify-center shrink-0 mt-0.5">
            <Calculator className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-[#152238] leading-snug">
              Calculate Exact Chronological Age
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleLoadSample}
            className="min-h-[44px] px-3 py-2 rounded-xl bg-[#EBF2FF] hover:bg-[#DCE7FF] text-[#2457D6] text-xs font-extrabold transition-colors cursor-pointer whitespace-nowrap"
          >
            Try Sample
          </button>
          <button
            type="button"
            onClick={handleReset}
            aria-label="Clear birth date input"
            className="min-h-[44px] px-3 py-2 rounded-xl bg-[#F1F5F9] hover:bg-[#E2E8F0] border border-[#CBD5E1] text-[#152238] text-xs font-extrabold inline-flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label htmlFor="birth-date" className="block text-xs sm:text-sm font-extrabold text-[#152238] mb-1.5">
            Date of Birth <span className="text-[#E11D48]">*</span>
          </label>
          <input
            id="birth-date"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] bg-white text-base font-bold text-[#152238] focus:border-[#2457D6] focus:outline-none focus:ring-3 focus:ring-[#2457D6]/15"
          />
        </div>

        <div>
          <label htmlFor="target-date" className="block text-xs sm:text-sm font-extrabold text-[#152238] mb-1.5">
            Age at the Date of <span className="text-[#E11D48]">*</span>
          </label>
          <input
            id="target-date"
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] bg-white text-base font-bold text-[#152238] focus:border-[#2457D6] focus:outline-none focus:ring-3 focus:ring-[#2457D6]/15"
          />
        </div>
      </div>

      {showDateOrderError && (
        <div
          role="alert"
          className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#FFF1F2] border border-[#FECDD3] text-xs sm:text-sm font-bold text-[#BE123C]"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Please ensure the target date is on or after your date of birth.</span>
        </div>
      )}
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
      subtitle="Find your exact chronological age in years, months, weeks, and days between your birth date and today or any target date."
      quickAnswer={{
        question: 'How old is someone born in 1995 right now?',
        answer: `Someone born on June 15, 1995 turns ${sampleAge1995} years old on June 15, ${currentYear}. Enter your birth date below for exact years, months, weeks, and total calendar days.`,
        targetAnchor: '#reference-table',
        targetLabel: 'Birth-Year Age Table ↓',
      }}
      workedExampleCard={{
        title: `Born June 15, 1995 on June 15, ${currentYear}`,
        equation: `${currentYear} − 1995 = ${sampleAge1995} years, 0 months, 0 days`,
        steps: [
          `Target year (${currentYear}) − birth year (1995) = ${sampleAge1995} full calendar years.`,
          `Total days reflect exact month lengths and leap years between both dates.`,
        ],
      }}
      matchingGuide={{
        title: 'How to Calculate Exact Age and Date Differences',
        description:
          'Understand calendar month borrowing, February 29 leap-year birthdays, and legal retirement age cutoffs.',
        href: '/guides/how-to-calculate-exact-age-and-date-difference',
      }}
      layoutVariant="result-below-inputs"
      useCuratedFaqsOnly={true}
      schemaAppCategory="UtilitiesApplication"
      heroSymbol="🎂"
      heroBadgeBg="bg-[#EEF2FF]"
      heroBadgeColor="text-[#4F46E5]"
      categoryName="Date & Time"
      categoryHref="/date-time"
      otherCalculatorsTitle="Other Date & Time Calculators"
      otherCalculators={DATE_RELATED_LINKS}
      relatedCalculators={DATE_RELATED_LINKS}
      calculatorCard={calculatorCard}
      resultCard={
        result
          ? {
              promptSummary: `Age from ${birthDate} to ${targetDate}`,
              promptSuffix: 'is:',
              mainValue: `${result.years} yrs, ${result.months} mos, ${result.days} days`,
              equation: `${result.totalMonths.toLocaleString()} total months  ·  ${result.totalWeeks.toLocaleString()} total weeks  ·  ${result.totalDays.toLocaleString()} total days`,
              isEmpty: false,
            }
          : {
              promptSummary: 'Chronological age',
              promptSuffix: 'is:',
              mainValue: '—',
              equation: 'Age = (Target Date − Birth Date) adjusted for exact calendar months & leap years',
              isEmpty: true,
              placeholderMessage: 'Select your Date of Birth above (or tap Try Sample) to see your exact age:',
            }
      }
      formulaCard={{
        introText: 'The calendar formula to compute exact chronological age is:',
        formulaText: 'Age = (Target Year − Birth Year) adjusted for Month & Day borrows',
        exampleTitle: `Born June 15, 1995 to October 26, ${currentYear}:`,
        exampleSteps: [
          `Years = ${currentYear} − 1995 = ${currentYear - 1995} years`,
          'Months = October (10) − June (6) = 4 months',
          `Days = 26 − 15 = 11 days (${currentYear - 1995} yrs, 4 mos, 11 days)`,
        ],
      }}
      referenceTableRows={ageLookupRows}
      howToUseSteps={[
        'Select or type your Date of Birth in the first date field.',
        `Verify the target date ("Age at the Date of"), which automatically defaults to today (${todayIso}).`,
        'Read your exact age in years, months, and days directly underneath the inputs.',
        'Use Copy or Share to save your age summary or test a future milestone date.',
      ]}
      howItWorks={{
        paragraph:
          'The calculator subtracts birth date from target date right-to-left (days, then months, then years), borrowing the exact day count of the preceding month when needed and counting every leap year.',
        formulaBox: 'Total Days = (Target Date − Birth Date) ÷ 86,400,000 ms',
        closingNote:
          'Follows the international chronological age system where age increments on your annual birthday.',
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
          <>Enter your birth date above to calculate your exact chronological age in years, months, weeks, and total calendar days.</>
        ),
      }}
      faqs={[
        {
          question: 'How does the Age Calculator compute exact years, months, and days?',
          answer:
            'It subtracts your birth date from the target date calendar-by-calendar, borrowing the exact number of days (28, 29, 30, or 31) from the preceding month whenever the target day is earlier than your birth day.',
        },
        {
          question: 'Does the Age Calculator account for leap years and February 29 births?',
          answer:
            'Yes. Every Gregorian leap year (including February 29 in 2000, 2004, 2008, 2012, 2016, 2020, and 2024) is counted in both total days lived and completed calendar years.',
        },
        {
          question: 'Can I calculate my age on a future retirement or school enrollment date?',
          answer:
            'Yes. Change the "Age at the Date of" field to any past or future date to check retirement milestones (such as age 59½, 65, or 73) or school grade cutoffs.',
        },
        {
          question: 'Why does dividing total days by 365 differ from calendar age?',
          answer:
            'Standard years have 365 days while leap years have 366 days, and calendar months vary from 28 to 31 days. Calendar subtraction avoids rough rounding drift across decades.',
        },
        {
          question: 'Does the target date update automatically every day?',
          answer:
            `Yes. The "Age at the Date of" field automatically loads today's current calendar date (${todayIso}) whenever you open the page.`,
        },
        {
          question: 'How many total weeks and months are shown in the result?',
          answer:
            'Alongside your age in years, months, and days, the result card prints your total completed months, full 7-day weeks, and total elapsed calendar days.',
        },
      ]}
    />
  );
}
