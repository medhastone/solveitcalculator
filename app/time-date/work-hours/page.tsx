import React from 'react';
import type { Metadata } from 'next';
import WorkHoursClient from './WorkHoursClient';

export const metadata: Metadata = {
  title: 'Work Hours & Timesheet Calculator | Overtime & Pay | SolveItCalculator',
  description:
    'Calculate regular hours, overtime, breaks, and gross pay from your work schedule. Build weekly timesheets and export your results for payroll or records.',
  keywords: [
    'work hours calculator',
    'timesheet calculator',
    'payroll calculator',
    'time card calculator',
    'overtime pay calculator',
    'gross to net pay calculator',
    'hourly wage calculator',
    'meal break deduction calculator'
  ],
  alternates: {
    canonical: 'https://solveitcalculator.com/time-date/work-hours',
  },
  openGraph: {
    title: 'Work Hours & Timesheet Calculator | Overtime & Pay | SolveItCalculator',
    description:
      'Calculate regular hours, overtime, breaks, and gross pay from your work schedule. Build weekly timesheets and export your results for payroll or records.',
    url: 'https://solveitcalculator.com/time-date/work-hours',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Work Hours & Timesheet Calculator | Overtime & Pay | SolveItCalculator',
    description:
      'Calculate regular hours, overtime, breaks, and gross pay from your work schedule. Build weekly timesheets and export your results for payroll or records.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      '@id': 'https://solveitcalculator.com/time-date/work-hours/#app',
      name: 'Work Hours & Timesheet Calculator',
      url: 'https://solveitcalculator.com/time-date/work-hours',
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'All',
      description:
        'A high-precision work hours, overtime, and timesheet calculator supporting FLSA and California daily overtime tiers, meal break deductions, and cross-midnight shift math.',
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
          name: 'Work Hours Calculator',
          item: 'https://solveitcalculator.com/time-date/work-hours/',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How does decimal hour conversion work for payroll calculations?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Standard time uses 60 minutes per hour, but payroll calculations require standard base-10 decimals. To convert minutes into decimal hours, divide the minute count by 60: 15 minutes is 0.25h, 30 minutes is 0.50h, and 45 minutes is 0.75h.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do you calculate overnight shifts that cross midnight?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'When clocking out on the next day (e.g., 10:00 PM to 06:30 AM), standard subtraction produces negative numbers. The engine applies 24-hour modulo math by adding 24 hours to the end time before deducting start time and unpaid meal breaks.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the FLSA 7-minute rounding rule?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Under 29 C.F.R. § 785.48(b), employers may round clock punch times to the nearest quarter hour (15 minutes). Minutes 1 through 7 round down, while minutes 8 through 14 round up.',
          },
        },
      ],
    },
  ],
};

export default function WorkHoursPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <WorkHoursClient />
    </>
  );
}

