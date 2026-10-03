import React from 'react';
import type { Metadata } from 'next';
import CalculatorPageSystem from '@/components/calculator/CalculatorPageSystem';
import PercentageCalculatorClient from './PercentageCalculatorClient';
import { getCalculatorSystemData } from '@/lib/calculatorSystemData';

export const metadata: Metadata = {
  title: 'Percentage Calculator | Increase, Decrease, Difference & Step-by-Step Solver | SolveItCalculator',
  description:
    'Free percentage calculator to solve percentage of a number, percentage increase and decrease, percentage difference, and reverse percentage formulas with clear arithmetic steps.',
  alternates: {
    canonical: 'https://solveitcalculator.com/math/percentage-calculator',
  },
  openGraph: {
    title: 'Percentage Calculator | SolveItCalculator',
    description:
      'Solve percentage change, proportion, and discount calculations with step-by-step mathematical proofs.',
    url: 'https://solveitcalculator.com/math/percentage-calculator',
    type: 'website',
    images: [{ url: 'https://solveitcalculator.com/og-home.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Percentage Calculator | SolveItCalculator',
    description: 'Calculate percentage of a number, percentage increase/decrease, and ratios.',
    images: ['https://solveitcalculator.com/og-home.png'],
  },
};

export default function PercentageCalculatorPage() {
  const data = getCalculatorSystemData('percentage-calculator');
  if (!data) return null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': 'https://solveitcalculator.com/math/percentage-calculator#app',
        url: 'https://solveitcalculator.com/math/percentage-calculator',
        name: data.h1,
        applicationCategory: 'EducationalApplication',
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
          { '@type': 'ListItem', position: 2, name: 'Math', item: 'https://solveitcalculator.com/math' },
          { '@type': 'ListItem', position: 3, name: 'Percentage Calculator', item: 'https://solveitcalculator.com/math/percentage-calculator' },
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
        <PercentageCalculatorClient />
      </CalculatorPageSystem>
    </>
  );
}
