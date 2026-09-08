import React from 'react';
import type { Metadata } from 'next';
import TimeDateClient from './TimeDateClient';

export const metadata: Metadata = {
  title: 'Time & Date Calculators | Temporal Intelligence Workbench | SolveIt',
  description: 'High-precision computational suite for chronological age, working day intervals, timesheets, countdowns, and global time zone shifts.',
  alternates: {
    canonical: 'https://solveitcalculator.com/time-date/',
  },
  openGraph: {
    title: 'Time & Date Calculators | Temporal Intelligence Workbench',
    description: 'High-precision computational suite for chronological age, working day intervals, timesheets, countdowns, and global time zone shifts.',
    url: 'https://solveitcalculator.com/time-date/',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Time & Date Calculators | Temporal Intelligence Workbench',
    description: 'High-precision computational suite for chronological age, working day intervals, timesheets, countdowns, and global time zone shifts.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      '@id': 'https://solveitcalculator.com/time-date/',
      url: 'https://solveitcalculator.com/time-date/',
      name: 'Time & Date Calculators | Temporal Intelligence Workbench',
      description: 'High-precision computational suite for chronological age, working day intervals, timesheets, countdowns, and global time zone shifts.',
      inLanguage: 'en-US',
      isPartOf: {
        '@type': 'WebSite',
        '@id': 'https://solveitcalculator.com/#website',
        url: 'https://solveitcalculator.com/',
        name: 'SolveIt Calculator',
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
            item: 'https://solveitcalculator.com/time-date/',
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
            text: 'SolveIt engines evaluate calendar spans using codified United States Federal Reserve holiday schedules (5 U.S.C. 6103) as well as UK Banking calendars. Fixed holidays falling on Saturdays are observed on Friday; Sunday holidays roll to Monday.',
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
