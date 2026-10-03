import React from 'react';
import type { Metadata } from 'next';
import CalculatorPageSystem from '@/components/calculator/CalculatorPageSystem';
import WorkHoursClient from './WorkHoursClient';
import { getCalculatorSystemData } from '@/lib/calculatorSystemData';

export const metadata: Metadata = {
  title: 'Work Hours Calculator | Timesheet, Breaks & Overtime Pay | SolveItCalculator',
  description:
    'Free work hours and timesheet calculator. Calculate daily shifts, unpaid lunch break deductions, weekly decimal payroll hours, and 1.5× FLSA overtime compensation.',
  alternates: {
    canonical: 'https://solveitcalculator.com/time-date/work-hours',
  },
  openGraph: {
    title: 'Work Hours Calculator | SolveItCalculator',
    description:
      'Timesheet and gross pay calculator with break deductions, weekly overtime calculations, and decimal payroll summaries.',
    url: 'https://solveitcalculator.com/time-date/work-hours',
    type: 'website',
    images: [{ url: 'https://solveitcalculator.com/og-home.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Work Hours Calculator | SolveItCalculator',
    description: 'Calculate shift hours, lunch deductions, and overtime pay with FLSA standards.',
    images: ['https://solveitcalculator.com/og-home.png'],
  },
};

export default function WorkHoursPage() {
  const data = getCalculatorSystemData('work-hours');
  if (!data) return null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': 'https://solveitcalculator.com/time-date/work-hours#app',
        url: 'https://solveitcalculator.com/time-date/work-hours',
        name: data.h1,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'All',
        description: data.shortAnswer,
        offers: {
          '@type': 'Offer',
          price: '0.00',
          priceCurrency: 'USD',
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://solveitcalculator.com' },
          { '@type': 'ListItem', position: 2, name: 'Time & Date', item: 'https://solveitcalculator.com/time-date' },
          { '@type': 'ListItem', position: 3, name: 'Work Hours Calculator', item: 'https://solveitcalculator.com/time-date/work-hours' },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: data.faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.answer,
          },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CalculatorPageSystem data={data}>
        <WorkHoursClient />
      </CalculatorPageSystem>
    </>
  );
}
