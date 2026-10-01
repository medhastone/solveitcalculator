import React from 'react';
import type { Metadata } from 'next';
import DaysCalculatorClient from '@/app/time-date/days-calculator/DaysCalculatorClient';

export const metadata: Metadata = {
  title: 'Business Days | Count, Add & Subtract Workdays | SolveItCalculator',
  description:
    'Count or add and subtract working days between dates while excluding weekends and selected holidays. Use custom workweeks and holiday lists for planning.',
  keywords: [
    'business days calculator',
    'workdays calculator',
    'count business days',
    'add business days to date',
    'working days from today',
    'exclude weekends and holidays calculator',
    'business days between dates'
  ],
  alternates: {
    canonical: 'https://solveitcalculator.com/business-days-calculator',
  },
  openGraph: {
    title: 'Business Days | Count, Add & Subtract Workdays | SolveItCalculator',
    description:
      'Count or add and subtract working days between dates while excluding weekends and selected holidays. Use custom workweeks and holiday lists for planning.',
    url: 'https://solveitcalculator.com/business-days-calculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Business Days | Count, Add & Subtract Workdays | SolveItCalculator',
    description:
      'Count or add and subtract working days between dates while excluding weekends and selected holidays. Use custom workweeks and holiday lists for planning.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      '@id': 'https://solveitcalculator.com/business-days-calculator/#app',
      name: 'Business Days Calculator',
      url: 'https://solveitcalculator.com/business-days-calculator',
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'All',
      description:
        'Count or add and subtract working days between dates while excluding weekends and selected holidays. Use custom workweeks and holiday lists for planning.',
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
          name: 'Business Days Calculator',
          item: 'https://solveitcalculator.com/business-days-calculator',
        },
      ],
    },
  ],
};

export default function BusinessDaysPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DaysCalculatorClient initialUnitType="business_days" pageTitle="Business Days Calculator" />
    </>
  );
}
