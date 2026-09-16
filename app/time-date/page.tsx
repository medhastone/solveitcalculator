import React from 'react';
import type { Metadata } from 'next';
import TimeDateClient from './TimeDateClient';

export const metadata: Metadata = {
  title: 'Time & Date Calculators – Age, Duration, Date Difference & More | SolveItCalculator',
  description: 'Use free time and date calculators to calculate age, date differences, countdowns, business days, time duration, deadlines, and more. Fast and accurate tools.',
  keywords: [
    'Time and Date Calculators',
    'Age Calculator',
    'Date Calculator',
    'Date Difference Calculator',
    'Time Calculator',
    'Duration Calculator',
    'Business Days Calculator',
    'Work Hours Calculator',
    'Countdown Calculator',
    'Days Between Dates Calculator',
    'Time Zone Calculator',
    'Week Calculator',
    'Deadline Calculator',
    'Date Countdown Tool',
    'Online Time Calculator',
  ],
  alternates: {
    canonical: 'https://solveitcalculator.com/time-date-calculators/',
  },
  openGraph: {
    title: 'Time & Date Calculators | Free Age, Duration & Date Tools',
    description: 'Calculate age, time differences, countdowns, business days, deadlines, and schedules with free Time & Date Calculators from SolveItCalculator.',
    url: 'https://solveitcalculator.com/time-date-calculators/',
    siteName: 'SolveItCalculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Time & Date Calculators | Free Age, Duration & Date Tools',
    description: 'Calculate age, date differences, time duration, workdays, countdowns, deadlines, and schedules with free calculators from SolveItCalculator.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      '@id': 'https://solveitcalculator.com/time-date-calculators/',
      url: 'https://solveitcalculator.com/time-date-calculators/',
      name: 'Time & Date Calculators – Age, Duration, Date Difference & More | SolveItCalculator',
      description: 'Use free time and date calculators to calculate age, date differences, countdowns, business days, time duration, deadlines, and more. Fast and accurate tools.',
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
        description: 'Find free Time & Date Calculators for age calculations, date differences, countdowns, work hours, business days, deadlines, schedules, and productivity planning. Accurate, fast, and easy to use.',
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
            name: 'Time & Date',
            item: 'https://solveitcalculator.com/time-date-calculators/',
          },
        ],
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How do business day calculators handle federal bank holidays?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'SolveIt calculators evaluate calendar spans using official United States Federal Reserve holiday schedules as well as UK Banking calendars. Fixed holidays falling on Saturdays are observed on Friday; Sunday holidays roll to Monday.',
          },
        },
        {
          '@type': 'Question',
          name: 'What algorithm determines leap years (the 100/400 year rule)?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Under the Gregorian calendar, a year is a leap year (366 days) if: (Year % 4 == 0 AND Year % 100 != 0) OR (Year % 400 == 0). This means years like 2000 and 2024 are leap years, but 1900 and 2100 are common years (365 days).',
          },
        },
        {
          '@type': 'Question',
          name: 'How does UTC Daylight Saving Time (DST) affect meeting calculations?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Because regions transition to DST on disparate dates (e.g., US in early March vs UK/EU in late March), timezone deltas fluctuate temporarily. SolveIt\'s Meeting Overlap Planner dynamically references the official IANA Time Zone Database (TZDB).',
          },
        },
        {
          '@type': 'Question',
          name: 'Are entered dates, birthdays, and work schedules saved or tracked remotely?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. All computations occur entirely client-side inside your browser sandbox. No date strings, personal names, hourly wage rates, or timesheets are transmitted to external servers.',
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

