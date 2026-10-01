import React from 'react';
import type { Metadata } from 'next';
import BillableHoursClient from './BillableHoursClient';

export const metadata: Metadata = {
  title: 'Billable Hours Calculator | Rate, Utilization & Revenue | SolveItCalculator',
  description:
    'Calculate billable hours, effective hourly rate, utilization, target revenue, and capacity. Built for freelancers, consultants, agencies, and service teams.',
  keywords: [
    'billable hours calculator',
    'utilization rate calculator',
    'effective hourly rate calculator',
    'freelance capacity calculator',
    'consulting rate calculator',
    'agency billable target'
  ],
  alternates: {
    canonical: 'https://solveitcalculator.com/billable-hours-calculator',
  },
  openGraph: {
    title: 'Billable Hours Calculator | Rate, Utilization & Revenue | SolveItCalculator',
    description:
      'Calculate billable hours, effective hourly rate, utilization, target revenue, and capacity. Built for freelancers, consultants, agencies, and service teams.',
    url: 'https://solveitcalculator.com/billable-hours-calculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Billable Hours Calculator | Rate, Utilization & Revenue | SolveItCalculator',
    description:
      'Calculate billable hours, effective hourly rate, utilization, target revenue, and capacity. Built for freelancers, consultants, agencies, and service teams.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      '@id': 'https://solveitcalculator.com/billable-hours-calculator/#app',
      name: 'Billable Hours Calculator',
      url: 'https://solveitcalculator.com/billable-hours-calculator',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'All',
      description:
        'Calculate billable hours, effective hourly rate, utilization, target revenue, and capacity. Built for freelancers, consultants, agencies, and service teams.',
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
          name: 'Billable Hours Calculator',
          item: 'https://solveitcalculator.com/billable-hours-calculator',
        },
      ],
    },
  ],
};

export default function BillableHoursCalculatorPage() {
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
