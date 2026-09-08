import React from 'react';
import type { Metadata } from 'next';
import DaysCalculatorClient from './DaysCalculatorClient';

export const metadata: Metadata = {
  title: 'Days Calculator | Add or Subtract Days from Date & Business Days | SolveIt',
  description:
    'Calculate the exact future or past date by adding or subtracting days, weeks, months, or business days (excluding weekends & federal holidays). Includes Julian day conversion.',
  keywords: [
    'days calculator',
    'add days to date',
    'subtract days from date',
    'date plus days calculator',
    'business days calculator',
    'calculate future date',
    'working days from today',
    'days from today calculator',
    'julian day calculator',
    'add 90 days to date'
  ],
  alternates: {
    canonical: 'https://solveitcalculator.com/time-date/days-calculator/',
  },
  openGraph: {
    title: 'Days Calculator | Add or Subtract Days from Date & Business Days | SolveIt',
    description:
      'Calculate the exact future or past date by adding or subtracting days, weeks, months, or business days (excluding weekends & federal holidays). Includes Julian day conversion.',
    url: 'https://solveitcalculator.com/time-date/days-calculator/',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Days Calculator | Add or Subtract Days from Date & Business Days | SolveIt',
    description:
      'Calculate the exact future or past date by adding or subtracting days, weeks, months, or business days (excluding weekends & federal holidays). Includes Julian day conversion.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      '@id': 'https://solveitcalculator.com/time-date/days-calculator/#app',
      name: 'Days Calculator - Add or Subtract Days from Date',
      url: 'https://solveitcalculator.com/time-date/days-calculator/',
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'All',
      description:
        'A high-precision date projection calculator to add or subtract calendar days, business working days, and statutory holidays to pinpoint past or future milestone dates.',
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
          name: 'Days Calculator',
          item: 'https://solveitcalculator.com/time-date/days-calculator/',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How do you calculate business days when adding days to a date?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'When adding business days, each incremental step skips Saturdays, Sundays, and optionally recognized Federal Bank Holidays (such as New Year\'s Day, Memorial Day, Labor Day, Thanksgiving, Christmas). For example, adding 5 business days to a Monday results in the following Monday.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is a Julian Day Number (JDN)?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The Julian Day Number is a continuous count of days elapsed since the beginning of the Julian Period on January 1, 4713 BCE. Astronomers and satellite engineers use it to calculate long-term ephemeris intervals without irregular month and leap-year arithmetic.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do legal and financial deadlines handle weekends?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Under Rule 6 of the US Federal Rules of Civil Procedure and standard commercial banking contracts, if a statutory deadline lands on a Saturday, Sunday, or legal holiday, the period continues to run until the end of the next day that is not a weekend or legal holiday (the "Next Business Day" convention).',
          },
        },
        {
          '@type': 'Question',
          name: 'What date is 90 days from today or 180 days from today?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'You can instantly project 30, 60, 90, or 180 days forward using our quick preset buttons. The engine recalculates target calendar dates, days of the week, and remaining quarter spans instantaneously.',
          },
        },
      ],
    },
  ],
};

export default function DaysCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DaysCalculatorClient />
    </>
  );
}
