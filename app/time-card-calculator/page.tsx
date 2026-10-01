import React from 'react';
import type { Metadata } from 'next';
import WorkHoursPayrollCalculator from '@/components/WorkHoursPayrollCalculator';

export const metadata: Metadata = {
  title: 'Time Card Calculator | Hours, Overtime & Gross Pay | SolveItCalculator',
  description:
    'Calculate daily and weekly hours, breaks, overtime, and gross pay. Build printable timecards and export timesheet data to CSV from your browser.',
  keywords: [
    'time card calculator',
    'timecard calculator',
    'timesheet calculator',
    'hours and minutes calculator',
    'work hours calculator',
    'overtime calculator',
    'gross pay calculator',
    'free time card calculator'
  ],
  alternates: {
    canonical: 'https://solveitcalculator.com/time-card-calculator',
  },
  openGraph: {
    title: 'Time Card Calculator | Hours, Overtime & Gross Pay | SolveItCalculator',
    description:
      'Calculate daily and weekly hours, breaks, overtime, and gross pay. Build printable timecards and export timesheet data to CSV from your browser.',
    url: 'https://solveitcalculator.com/time-card-calculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Time Card Calculator | Hours, Overtime & Gross Pay | SolveItCalculator',
    description:
      'Calculate daily and weekly hours, breaks, overtime, and gross pay. Build printable timecards and export timesheet data to CSV from your browser.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      '@id': 'https://solveitcalculator.com/time-card-calculator/#app',
      name: 'Time Card Calculator',
      url: 'https://solveitcalculator.com/time-card-calculator',
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'All',
      description:
        'Calculate daily and weekly hours, breaks, overtime, and gross pay. Build printable timecards and export timesheet data to CSV from your browser.',
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
          name: 'Time Card Calculator',
          item: 'https://solveitcalculator.com/time-card-calculator',
        },
      ],
    },
  ],
};

export default function TimeCardCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <WorkHoursPayrollCalculator />
    </>
  );
}
