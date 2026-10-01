import React from 'react';
import type { Metadata } from 'next';
import TimeDateClient from './TimeDateClient';

export const metadata: Metadata = {
  title: 'Time & Date Calculators: Free & Easy Tools for Age, Days, Hours & Calendar | SolveItCalculator',
  description:
    'Easy and free online calculators to find your exact age, count days between dates, calculate work hours and overtime pay, and check world time zones instantly.',
  keywords: [
    'Time and Date Calculators',
    'Age Calculator',
    'Days Between Dates',
    'Days Calculator',
    'Business Days Calculator',
    'Work Hours Calculator',
    'Time Calculator',
    'Add and Subtract Time',
    'Time Zone Converter',
    'Event Countdown',
    'Birthday Countdown',
    'Retirement Countdown',
    'Leap Year Calculator',
    'Unix Timestamp Converter',
    'SolveItCalculator',
  ],
  alternates: {
    canonical: 'https://solveitcalculator.com/time-date/',
  },
  openGraph: {
    title: 'Time & Date Calculators: Free & Easy Tools for Age, Days, Hours & Calendar | SolveItCalculator',
    description:
      'Easy and free online calculators to find your exact age, count days between dates, calculate work hours and overtime pay, and check world time zones instantly.',
    url: 'https://solveitcalculator.com/time-date/',
    siteName: 'SolveItCalculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Time & Date Calculators: Free & Easy Tools for Age, Days, Hours & Calendar | SolveItCalculator',
    description:
      'Easy and free online calculators to find your exact age, count days between dates, calculate work hours and overtime pay, and check world time zones instantly.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      '@id': 'https://solveitcalculator.com/time-date/',
      url: 'https://solveitcalculator.com/time-date/',
      name: 'Time & Date Calculators: Free & Easy Tools for Age, Days, Hours & Calendar | SolveItCalculator',
      description:
        'Use free time and date calculators for age, date differences, business days, countdowns, time duration, time zones, work hours, and calendar calculations.',
      inLanguage: 'en-US',
      isPartOf: {
        '@type': 'WebSite',
        '@id': 'https://solveitcalculator.com/#website',
        url: 'https://solveitcalculator.com/',
        name: 'SolveItCalculator',
      },
      about: {
        '@type': 'Thing',
        name: 'Time and Date Calculators',
        description:
          'Easy-to-use tools for calculating age, days between dates, working days, work hours and overtime, world time zones, and event countdowns.',
      },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://solveitcalculator.com/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Time & Date Calculators',
            item: 'https://solveitcalculator.com/time-date/',
          },
        ],
      },
    },
    {
      '@type': 'ItemList',
      name: 'Popular Time & Date Calculators',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Age Calculator',
          url: 'https://solveitcalculator.com/time-date/age-calculator',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Days Between Dates',
          url: 'https://solveitcalculator.com/time-date/days-between-dates',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Days Calculator',
          url: 'https://solveitcalculator.com/time-date/days-calculator',
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: 'Business Days Calculator',
          url: 'https://solveitcalculator.com/business-days-calculator',
        },
        {
          '@type': 'ListItem',
          position: 5,
          name: 'Time Calculator',
          url: 'https://solveitcalculator.com/time-date/time-calculator',
        },
        {
          '@type': 'ListItem',
          position: 6,
          name: 'Add & Subtract Time',
          url: 'https://solveitcalculator.com/time-date/add-subtract-time',
        },
        {
          '@type': 'ListItem',
          position: 7,
          name: 'Time Zone Converter',
          url: 'https://solveitcalculator.com/time-date/time-zone-converter',
        },
        {
          '@type': 'ListItem',
          position: 8,
          name: 'Event Countdown',
          url: 'https://solveitcalculator.com/time-date/event-countdown',
        },
        {
          '@type': 'ListItem',
          position: 9,
          name: 'Work Hours Calculator',
          url: 'https://solveitcalculator.com/time-date/work-hours',
        },
        {
          '@type': 'ListItem',
          position: 10,
          name: 'Birthday Countdown',
          url: 'https://solveitcalculator.com/time-date/birthday-tracker',
        },
        {
          '@type': 'ListItem',
          position: 11,
          name: 'Retirement Countdown',
          url: 'https://solveitcalculator.com/time-date/retirement-countdown-in-workdays',
        },
        {
          '@type': 'ListItem',
          position: 12,
          name: 'Duration Calculator',
          url: 'https://solveitcalculator.com/time-date/date-difference',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What time and date calculators are available on SolveItCalculator?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'SolveItCalculator provides practical tools across chronological age, date differences, adding/subtracting dates, business days and workdays, shift and payroll hours, global time zones, event countdowns, leap years, and advanced calendar formats like Unix timestamp and Julian days.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do I calculate my exact age?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Our Age Calculator uses exact calendar-aware arithmetic rather than approximating 365 days per year. It counts full completed calendar years, remaining months, and remaining days between your date of birth and the target date, while accounting for leap years.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the difference between inclusive and exclusive date counting?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'In exclusive counting (standard calendar difference), the start date is omitted (e.g., from Monday to Tuesday is 1 day). In inclusive counting, both the start date and end date are included (e.g., Monday through Tuesday is 2 days). You can toggle between both methods on our date calculators.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do business-day calculators work?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Business day tools iterate day-by-day across your chosen date range to evaluate each calendar date against your configured workweek (such as Monday–Friday or Monday–Saturday) and exclude designated public or bank holidays.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I exclude holidays from date calculations?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Our Business Days tools allow you to toggle holiday exclusions, define custom non-working dates, and select regional calendars rather than forcing a single jurisdiction on global users.',
          },
        },
        {
          '@type': 'Question',
          name: 'How are months handled when adding or subtracting dates?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Because months vary from 28 to 31 days, adding a month is calendar-dependent. For example, adding 1 month to January 31 lands on February 28 (or February 29 in a leap year) using the standard end-of-month pinning convention.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do leap years affect date calculations?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Under the Gregorian calendar, years divisible by 4 are leap years (366 days), except century years unless divisible by 400. For instance, 2000 and 2024 are leap years, but 1900 and 2100 are common years (365 days). All our date engines honor these rules.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do time zones affect date and time calculations?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Time zones determine local clock times relative to Coordinated Universal Time (UTC). Crossing the International Date Line or timezone boundaries can advance or retard the local calendar date, which our time zone converters account for automatically.',
          },
        },
        {
          '@type': 'Question',
          name: 'What happens during daylight-saving changes?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'When regions transition to Daylight Saving Time (spring forward) or standard time (fall back), local clock offsets shift by one hour. Because different countries switch on different calendar dates, meeting overlaps change temporarily.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is a Unix timestamp?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A Unix timestamp is the total number of non-leap seconds elapsed since 00:00:00 UTC on January 1, 1970 (the Unix epoch). It provides a standardized, timezone-independent numeric representation of a moment in time.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is ISO 8601?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'ISO 8601 is an international standard for formatting dates and times, represented as YYYY-MM-DD (e.g., 2026-09-24) or YYYY-MM-DDTHH:MM:SSZ for UTC timestamps, eliminating ambiguity between month-first and day-first notations.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I calculate time between two times?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Our Time Calculator and Work Hours Calculator determine the exact elapsed hours, minutes, and seconds between two clock times, including cross-midnight shifts and optional lunch break deductions.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I count workdays using a custom schedule?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. You can customize the working week (such as 4-day workweeks, 6-day retail shifts, or standard 5-day schedules) to calculate accurate deadline and project spans.',
          },
        },
        {
          '@type': 'Question',
          name: 'Why does my result differ from another date calculator?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Different tools may use different counting conventions (inclusive vs. exclusive), month-end rollover rules, regional holiday lists, or time-zone shifts. SolveItCalculator clearly displays all counting assumptions alongside your result.',
          },
        },
      ],
    },
  ],
};

export default function TimeDatePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TimeDateClient />
    </>
  );
}
