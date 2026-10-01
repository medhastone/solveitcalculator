import React from 'react';
import type { Metadata } from 'next';
import BillableHoursClient from '@/app/billable-hours-calculator/BillableHoursClient';

export const metadata: Metadata = {
  title: 'Freelance Rate Calculator | Hourly & Day Rates | SolveItCalculator',
  description:
    'Calculate freelance hourly and daily rates from personal income goals, taxes, expenses, and billable hours. Compare pricing models to protect profitability.',
  keywords: [
    'freelance rate calculator',
    'freelance hourly rate calculator',
    'contractor rate calculator',
    'day rate calculator',
    'freelance pricing calculator',
    'calculate hourly rate freelance'
  ],
  alternates: {
    canonical: 'https://solveitcalculator.com/freelance-hourly-rate-calculator',
  },
  openGraph: {
    title: 'Freelance Rate Calculator | Hourly & Day Rates | SolveItCalculator',
    description:
      'Calculate freelance hourly and daily rates from personal income goals, taxes, expenses, and billable hours. Compare pricing models to protect profitability.',
    url: 'https://solveitcalculator.com/freelance-hourly-rate-calculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Freelance Rate Calculator | Hourly & Day Rates | SolveItCalculator',
    description:
      'Calculate freelance hourly and daily rates from personal income goals, taxes, expenses, and billable hours. Compare pricing models to protect profitability.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      '@id': 'https://solveitcalculator.com/freelance-hourly-rate-calculator/#app',
      name: 'Freelance Rate Calculator',
      url: 'https://solveitcalculator.com/freelance-hourly-rate-calculator',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'All',
      description:
        'Calculate freelance hourly and daily rates from personal income goals, taxes, expenses, and billable hours. Compare pricing models to protect profitability.',
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
          item: 'https://solveitcalculator.com/time-date',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Freelance Rate Calculator',
          item: 'https://solveitcalculator.com/freelance-hourly-rate-calculator',
        },
      ],
    },
  ],
};

export default function FreelanceHourlyRateCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BillableHoursClient />
    </>
  );
}
