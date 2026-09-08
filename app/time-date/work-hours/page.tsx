import React from 'react';
import type { Metadata } from 'next';
import WorkHoursClient from './WorkHoursClient';

export const metadata: Metadata = {
  title: 'Work Hours Calculator & Timesheet Engine | Overtime & Gross Pay | SolveIt',
  description:
    'Free work hours calculator and weekly timesheet engine. Calculate regular hours, 1.5x/2.0x overtime, unpaid breaks, 6-min/15-min billable rounding, and gross payroll with CSV export.',
  keywords: [
    'work hours calculator',
    'timesheet calculator',
    'time card calculator',
    'overtime pay calculator',
    'calculate work hours and minutes',
    'decimal hours calculator',
    'punch card calculator',
    'shift hours calculator',
    'billable hours calculator',
    'payroll hours calculator'
  ],
  alternates: {
    canonical: 'https://solveitcalculator.com/time-date/work-hours/',
  },
  openGraph: {
    title: 'Work Hours Calculator & Timesheet Engine | Overtime & Gross Pay | SolveIt',
    description:
      'Calculate total work hours, regular time, and overtime pay with break deductions. Perfect for timesheets, payroll estimation, and shift scheduling.',
    url: 'https://solveitcalculator.com/time-date/work-hours/',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Work Hours Calculator & Timesheet Engine | Overtime & Gross Pay | SolveIt',
    description:
      'Calculate total work hours, regular time, and overtime pay with break deductions. Perfect for timesheets, payroll estimation, and shift scheduling.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      '@id': 'https://solveitcalculator.com/time-date/work-hours/#app',
      name: 'Work Hours & Timesheet Payroll Calculator',
      url: 'https://solveitcalculator.com/time-date/work-hours/',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'All',
      description:
        'A comprehensive weekly timesheet calculator to determine regular hours, FLSA overtime pay, break deductions, and billable time rounding.',
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
          name: 'How do you calculate decimal work hours from hours and minutes?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'To convert minutes to decimal hours, divide the total minutes by 60. For example, 7 hours and 45 minutes equals 7 + (45 / 60) = 7.75 decimal hours. This decimal number is then multiplied by your hourly wage for payroll.',
          },
        },
        {
          '@type': 'Question',
          name: 'How is overtime calculated under Fair Labor Standards Act (FLSA) rules?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Under federal FLSA regulations, non-exempt employees must receive overtime pay at a rate not less than one and one-half times (1.5x) their regular rate of pay for all hours worked exceeding 40 hours in a 7-day workweek.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the 7/8-minute rounding rule (29 CFR § 785.48)?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Under 29 CFR § 785.48(b), employers may round employee punch times to the nearest 15-minute quarter hour (0.25h). Time between 1 and 7 minutes is rounded down, while time between 8 and 14 minutes is rounded up, provided the practice averages out fairly over time.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does the calculator handle night shifts crossing midnight?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'When a clock-out time is earlier on the clock than the clock-in time (e.g., 22:00 to 06:00), our engine automatically adds 24 hours (1,440 minutes) to the checkout time to compute the true 8-hour overnight duration before subtracting meal breaks.',
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
