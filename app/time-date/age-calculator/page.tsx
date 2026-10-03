import React from 'react';
import type { Metadata } from 'next';
import CalculatorPageSystem from '@/components/calculator/CalculatorPageSystem';
import AgeCalculatorClient from './AgeCalculatorClient';
import { getCalculatorSystemData } from '@/lib/calculatorSystemData';

export const metadata: Metadata = {
  title: 'Age Calculator | Exact Chronological Age & Birthday Countdown | SolveItCalculator',
  description:
    'Calculate exact chronological age in years, months, days, hours, and minutes with leap year adjustment and birthday milestone countdowns. ISO 8601 calendar standard.',
  alternates: {
    canonical: 'https://solveitcalculator.com/time-date/age-calculator',
  },
  openGraph: {
    title: 'Age Calculator | SolveItCalculator',
    description:
      'Exact chronological age calculation in years, months, and days with total solar days lived and milestone trackers.',
    url: 'https://solveitcalculator.com/time-date/age-calculator',
    type: 'website',
    images: [{ url: 'https://solveitcalculator.com/og-home.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Age Calculator | SolveItCalculator',
    description: 'Calculate your exact age in years, months, days, and hours with leap year precision.',
    images: ['https://solveitcalculator.com/og-home.png'],
  },
};

export default function AgeCalculatorPage() {
  const data = getCalculatorSystemData('age-calculator');
  if (!data) return null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': 'https://solveitcalculator.com/time-date/age-calculator#app',
        url: 'https://solveitcalculator.com/time-date/age-calculator',
        name: data.h1,
        applicationCategory: 'UtilityApplication',
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
          { '@type': 'ListItem', position: 3, name: 'Age Calculator', item: 'https://solveitcalculator.com/time-date/age-calculator' },
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
        <AgeCalculatorClient />
      </CalculatorPageSystem>
    </>
  );
}
