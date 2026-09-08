import React from 'react';
import type { Metadata } from 'next';
import DateDifferenceClient from './DateDifferenceClient';

export const metadata: Metadata = {
  title: 'Date Difference Calculator | SolveIt',
  description:
    'Calculate exact elapsed calendar days, working business days, fractional months, astronomical seconds, and chronological intervals with millisecond determinism.',
  keywords: [
    'date difference calculator',
    'days between dates',
    'calculate days between two dates',
    'business days between dates',
    'date duration calculator',
    'how many days between',
    'time between two dates',
    'working days calculator',
    'calendar duration'
  ],
  alternates: {
    canonical: 'https://solveitcalculator.com/time-date/date-difference/',
  },
  openGraph: {
    title: 'Date Difference Calculator | SolveIt',
    description:
      'Calculate exact elapsed calendar days, working business days, fractional months, astronomical seconds, and chronological intervals with millisecond determinism.',
    url: 'https://solveitcalculator.com/time-date/date-difference/',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Date Difference Calculator | SolveIt',
    description:
      'Calculate exact elapsed calendar days, working business days, fractional months, astronomical seconds, and chronological intervals with millisecond determinism.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      '@id': 'https://solveitcalculator.com/time-date/date-difference/#app',
      name: 'Date Difference & Duration Calculator',
      url: 'https://solveitcalculator.com/time-date/date-difference/',
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'All',
      description:
        'Precision metrology tool for calculating exact calendar days, working business days, standard weeks, billable sprint hours, and fractional month intervals.',
      offers: {
        '@type': 'Offer',
        price: '0.00',
        priceCurrency: 'USD',
      },
    },
    {
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
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Date Difference Calculator',
          item: 'https://solveitcalculator.com/time-date/date-difference/',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How do you calculate the exact number of days between two dates?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Subtract the start timestamp (in UTC milliseconds) from the end timestamp, and divide by 86,400,000 milliseconds (the number of milliseconds in a standard solar day).',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the difference between including vs excluding the end date?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Standard calendar duration excludes the end date (counting nights or 24-hour elapsed spans). Inclusive calculation adds +1 to include both the start and final calendar days, which is standard in hotel bookings, lease tenancies, and statutory notice periods.',
          },
        },
        {
          '@type': 'Question',
          name: 'How are business working days counted between two dates?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Working business days iterate across the elapsed calendar span, deducting every Saturday and Sunday. Optional bank holiday filtering also excludes recognized statutory holidays.',
          },
        },
      ],
    },
  ],
};

export default function DateDifferencePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DateDifferenceClient />
    </>
  );
}
