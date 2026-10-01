import {
  LeapYearEvaluation,
  CycleYearItem,
  SpanCalculationResult,
  QuizQuestion,
  LeapYearFact,
  HistoricalCenturyRow,
  RelatedToolItem,
} from './types';

/**
 * Core Gregorian Leap Year Checker according to ISO 8601 & Proleptic Gregorian standards
 */
export function checkLeap(year: number): LeapYearEvaluation {
  const y = Math.trunc(year);
  const isDiv400 = y % 400 === 0;
  const isDiv100 = y % 100 === 0;
  const isDiv4 = y % 4 === 0;
  const isLeap = isDiv400 || (isDiv4 && !isDiv100);

  let ruleIndex = 4;
  let reason = '';

  if (isDiv400) {
    ruleIndex = 1;
    reason = `${y} is divisible by 400, making it an exceptional century leap year with February 29th.`;
  } else if (isDiv100) {
    ruleIndex = 2;
    reason = `${y} is divisible by 100 but not by 400, so it is an exempted common century year (365 days).`;
  } else if (isDiv4) {
    ruleIndex = 3;
    reason = `${y} divides evenly by 4 and is not a special century year. This makes ${y} a standard quadrennial leap year (every 4 years).`;
  } else {
    ruleIndex = 4;
    reason = `${y} is not divisible by 4, making it a regular 365-day common calendar year.`;
  }

  const febDays = isLeap ? 29 : 28;
  const totalDays = isLeap ? 366 : 365;
  const totalHours = totalDays * 24;
  const solarDrift = isLeap ? '+0.7575 d' : '-0.2422 d';

  // Calculate prior leap year
  let prevLeap = y - 1;
  while (!isPureLeap(prevLeap)) {
    prevLeap--;
  }

  // Calculate subsequent leap year
  let nextLeap = y + 1;
  while (!isPureLeap(nextLeap)) {
    nextLeap++;
  }

  return {
    year: y,
    isLeap,
    isDiv400,
    isDiv100,
    isDiv4,
    ruleIndex,
    reason,
    febDays,
    totalDays,
    totalHours,
    solarDrift,
    prevLeap,
    nextLeap,
  };
}

export function isPureLeap(y: number): boolean {
  return y % 400 === 0 || (y % 4 === 0 && y % 100 !== 0);
}

/**
 * Generates 400 consecutive years for a given Gregorian cycle epoch
 */
export function generateCycleYears(baseYear: number): CycleYearItem[] {
  const items: CycleYearItem[] = [];
  for (let i = 0; i < 400; i++) {
    const y = baseYear + i;
    const isDiv400 = y % 400 === 0;
    const isDiv100 = y % 100 === 0;
    const isDiv4 = y % 4 === 0;
    const isLeap = isDiv400 || (isDiv4 && !isDiv100);

    let reason = '';
    if (isDiv400) {
      reason = 'Century Leap Year (÷400)';
    } else if (isDiv100) {
      reason = 'Century Common Year (÷100)';
    } else if (isLeap) {
      reason = 'Quadrennial Leap Year (÷4)';
    } else {
      reason = 'Common Year (365d)';
    }

    items.push({
      year: y,
      isLeap,
      isDiv400,
      isDiv100,
      febDays: isLeap ? 29 : 28,
      totalDays: isLeap ? 366 : 365,
      reason,
    });
  }
  return items;
}

/**
 * Calculates all leap years and statistics between two years inclusive
 */
export function calculateRange(start: number, end: number): SpanCalculationResult {
  const minYear = Math.min(start, end);
  const maxYear = Math.max(start, end);
  const totalYears = maxYear - minYear + 1;

  const leapYears: number[] = [];
  for (let y = minYear; y <= maxYear; y++) {
    if (isPureLeap(y)) {
      leapYears.push(y);
    }
  }

  const leapCount = leapYears.length;
  const commonCount = totalYears - leapCount;
  const extraDaysAdded = leapCount;

  return {
    startYear: minYear,
    endYear: maxYear,
    totalYears,
    leapCount,
    commonCount,
    extraDaysAdded,
    leapYears,
  };
}

export const HISTORICAL_CENTURY_ROWS: HistoricalCenturyRow[] = [
  {
    year: 1600,
    gregorianRule: 'Leap Year (366d)',
    julianRule: 'Leap Year (366d)',
    daysDrifted: '10 Days Ahead',
    whatHappened: 'Gregorian Papal Bull in 1582 cut 10 days',
    isCenturyLeap: true,
  },
  {
    year: 1700,
    gregorianRule: 'Common (365d)',
    julianRule: 'Leap Year (366d)',
    daysDrifted: '11 Days Drift',
    whatHappened: 'Julian fell 1 additional day behind equinox',
    isCenturyLeap: false,
  },
  {
    year: 1800,
    gregorianRule: 'Common (365d)',
    julianRule: 'Leap Year (366d)',
    daysDrifted: '12 Days Drift',
    whatHappened: 'Britain adopted Gregorian in 1752 (lost 11 days)',
    isCenturyLeap: false,
  },
  {
    year: 1900,
    gregorianRule: 'Common (365d)',
    julianRule: 'Leap Year (366d)',
    daysDrifted: '13 Days Drift',
    whatHappened: 'Russian Empire ran 13 days behind Europe',
    isCenturyLeap: false,
  },
  {
    year: 2000,
    gregorianRule: 'Leap Year (366d)',
    julianRule: 'Leap Year (366d)',
    daysDrifted: '13 Days Drift',
    whatHappened: 'Rare century alignment; both added Feb 29',
    isCenturyLeap: true,
  },
  {
    year: 2100,
    gregorianRule: 'Common (365d)',
    julianRule: 'Leap Year (366d)',
    daysDrifted: '14 Days Drift',
    whatHappened: 'Next century anomaly; 2100 will NOT be leap',
    isCenturyLeap: false,
  },
  {
    year: 2400,
    gregorianRule: 'Leap Year (366d)',
    julianRule: 'Leap Year (366d)',
    daysDrifted: '16 Days Drift',
    whatHappened: 'Next century year divisible by 400',
    isCenturyLeap: true,
  },
];

export const LEAP_YEAR_FACTS: LeapYearFact[] = [
  {
    title: 'Leaplings & Leap Day Babies',
    description: 'About 5 million people worldwide are born on Feb 29. Odds: 1 in 1,461.',
    icon: 'cake',
  },
  {
    title: 'Legal Birthday Rules',
    description:
      'In the UK and Taiwan, leaplings turn 18 on March 1. In the US, it is legally deemed February 28 or March 1 based on state statutes.',
    icon: 'gavel',
  },
  {
    title: "Bachelor's Day Tradition",
    description:
      '5th-century Irish folklore allowed women to initiate marriage proposals on Feb 29 to balance patriarchal tradition.',
    icon: 'favorite',
  },
  {
    title: 'Software Y2K Leap Bug',
    description:
      'Many older algorithms in 2000 crashed because programmers forgot the ÷400 rule, falsely assuming 2000 was a non-leap century.',
    icon: 'bug_report',
  },
  {
    title: 'Salaried Work Paradox',
    description:
      'Salaried employees work an extra day in leap years without additional contractual compensation, saving employers billions.',
    icon: 'payments',
  },
  {
    title: "Sweden's February 30th (1712)",
    description:
      'When transitioning calendars, Sweden added a double leap day in 1712, creating history’s only documented February 30th.',
    icon: 'travel_explore',
  },
  {
    title: 'Leap Seconds Distinction',
    description:
      'Leap years fix orbital geometry. Leap seconds fix Earth’s irregular rotational deceleration (UTC vs TAI).',
    icon: 'update',
  },
  {
    title: 'Summer Olympics & Elections',
    description:
      'US Presidential elections and Summer Olympic Games traditionally coincide with leap years, tracing ancient Greek Olympiads.',
    icon: 'military_tech',
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: '1. Was the year 1900 a Leap Year?',
    options: [
      { label: 'Yes (Divisible by 4)', value: 'yes' },
      { label: 'No (Not ÷ 400)', value: 'no' },
    ],
    correctAnswer: 'no',
    explanationCorrect: '✓ Correct! 1900 was divisible by 100 but NOT 400, so it was an exempted common year.',
    explanationIncorrect: '✕ Incorrect. 1900 is divisible by 4, but turn-of-the-century years must also divide by 400!',
  },
  {
    id: 2,
    question: '2. Will the year 2100 be a Leap Year?',
    options: [
      { label: 'No (Century Common)', value: 'no' },
      { label: 'Yes (Divisible by 4)', value: 'yes' },
    ],
    correctAnswer: 'no',
    explanationCorrect: '✓ Spot on! 2100 ÷ 400 = 5.25. It will NOT be a leap year! February 2100 has 28 days.',
    explanationIncorrect: '✕ Incorrect. 2100 is not divisible by 400. February 2100 will have only 28 days.',
  },
  {
    id: 3,
    question: '3. How many leap years exist in 400 years?',
    options: [
      { label: '100 Leap Years', value: '100' },
      { label: 'Exactly 97', value: '97' },
    ],
    correctAnswer: '97',
    explanationCorrect: '✓ Brilliant! 100 quadrennial years minus 3 omitted century days = exactly 97 leap years.',
    explanationIncorrect: '✕ Incorrect. Under Julian rules it was 100, but Gregorian rules drop 3 century years, leaving 97.',
  },
];

export const CODE_SNIPPETS: Record<string, string> = {
  js: `/**
 * Canonical Gregorian Leap Year Check (ISO 8601)
 * @param {number} year - Astronomical year integer
 * @returns {boolean} True if leap year
 */
function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

// Assertions
console.assert(isLeapYear(2028) === true);
console.assert(isLeapYear(1900) === false);
console.assert(isLeapYear(2000) === true);`,
  python: `def is_leap_year(year: int) -> bool:
    """Determine if a year is a leap year according to Gregorian calendar rules."""
    return (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0)

# Or using standard library
import calendar
assert is_leap_year(2028) == calendar.isleap(2028)`,
  php: `<?php
/**
 * Determine whether a year is a Gregorian leap year.
 */
function isLeapYear(int $year): bool {
    return ($year % 4 === 0 && $year % 100 !== 0) || ($year % 400 === 0);
}

// Using PHP native DateTime
$isLeap = (bool)(new DateTime("$year-01-01"))->format('L');`,
  java: `public class LeapYearValidator {
    /**
     * Returns true if year is a leap year in the Gregorian calendar.
     */
    public static boolean isLeapYear(int year) {
        return (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);
    }

    // Using java.time.Year (Java 8+)
    // boolean isLeap = java.time.Year.of(year).isLeap();
}`,
  sql: `-- PostgreSQL / ANSI SQL Expression
SELECT 
  year,
  CASE 
    WHEN (year % 400 = 0) THEN TRUE
    WHEN (year % 100 = 0) THEN FALSE
    WHEN (year % 4 = 0) THEN TRUE
    ELSE FALSE
  END AS is_leap_year
FROM generate_series(1900, 2100) AS year;`,
};

export const FAQ_ITEMS = [
  {
    question: 'What is the exact mathematical rule for a leap year?',
    answer:
      'Under the international Gregorian calendar, a year is a leap year if it satisfies: (1) The year is divisible by 4, AND (2) The year is NOT divisible by 100, UNLESS (3) The year is also divisible by 400. This three-part check eliminates 3 leap days every 400 years to maintain solar alignment.',
  },
  {
    question: 'Why was 2000 a leap year, but 1900 was not?',
    answer:
      'Both 1900 and 2000 are century years (divisible by 100). The Gregorian rule states that century years must also be evenly divisible by 400 to qualify as leap years. 2000 ÷ 400 = 5 (exact whole integer), making it a leap year. 1900 ÷ 400 = 4.75, which fails the test and makes it a 365-day common year.',
  },
  {
    question: 'Will 2100 be a leap year?',
    answer:
      'No. 2100 is divisible by 4 and 100, but 2100 ÷ 400 = 5.25. Because it is not divisible by 400, the year 2100 will be a common year with only 28 days in February. The 8-year gap between leap years 2096 and 2104 will be the next century jump.',
  },
  {
    question: 'Why do we need leap years at all?',
    answer:
      "Without leap years, our calendar would drift out of sync with the Earth's orbit around the Sun by approximately 0.2422 days (5 hours, 48 minutes, 46 seconds) each year. After 100 years, seasons would shift by 24 days. After 700 years, Northern Hemisphere summer would occur in December.",
  },
  {
    question: 'Why does February get the extra day instead of another month?',
    answer:
      'In the ancient Roman calendar established by King Numa Pompilius (c. 713 BCE), the calendar year began in March. February was the final month of the year before spring. Therefore, any intercalary calendar corrections were naturally appended to the end of the year in February.',
  },
  {
    question: 'What happens to people born on February 29th (Leaplings)?',
    answer:
      "Leaplings celebrate on February 28 or March 1 in non-leap years. For legal documentation (such as driver's licenses and passports), jurisdictions define whether age increments on March 1st (like the UK) or the day following February 28th.",
  },
  {
    question: 'Are leap years and leap seconds the same thing?',
    answer:
      "No. Leap years adjust for Earth's orbital revolution around the sun (heliocentric period). Leap seconds compensate for minor fluctuations in Earth's axial rotation speed (geocentric rotation), aligning atomic clock time (TAI) with mean solar time (UT1).",
  },
  {
    question: 'Is the Gregorian calendar 100% permanently accurate?',
    answer:
      'No calendar is perfectly perpetual. The Gregorian average year is 365.2425 days, while the mean tropical year is approximately 365.24219 days. This creates a tiny excess of about 1 day every 3,236 years. Reform proposals include making the year 4000 a non-leap year.',
  },
];

export const RELATED_TOOLS: RelatedToolItem[] = [
  {
    title: 'Date Difference Calculator',
    desc: 'Calculate exact days, weeks, months, and leap days between two calendar dates.',
    icon: 'date_range',
    href: '/date-difference-calculator',
  },
  {
    title: 'Unix Timestamp Converter',
    desc: 'Convert epoch seconds into ISO 8601 leap-adjusted datetime coordinates.',
    icon: 'schedule',
    href: '/unix-timestamp-converter',
  },
  {
    title: 'Business Days Calculator',
    desc: 'Exclude weekend days and federal holidays with custom working calendars.',
    icon: 'work_history',
    href: '/work-hours-payroll-calculator',
  },
  {
    title: 'Julian Day Number (JDN)',
    desc: 'Astronomical continuous day count independent of calendar reforms.',
    icon: 'public',
    href: '/julian-day-calculator',
  },
  {
    title: 'Add or Subtract Days',
    desc: 'Future and past date projector factoring intercalary Feb 29 days automatically.',
    icon: 'more_time',
    href: '/add-subtract-time-calculator',
  },
  {
    title: 'Military Time & UTC Sync',
    desc: 'Convert 24-hour formats, aviation Zulu time, and coordinate international meetings.',
    icon: 'alarm',
    href: '/military-time-converter',
  },
];
