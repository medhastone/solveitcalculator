import React from 'react';
import type { Metadata } from 'next';
import CalculatorPageSystem from '@/components/calculator/CalculatorPageSystem';
import CompoundInterestClient from './CompoundInterestClient';
import { getCalculatorSystemData } from '@/lib/calculatorSystemData';

export const metadata: Metadata = {
  title: 'Compound Interest Calculator | Future Value & Growth Forecasting | SolveItCalculator',
  description:
    'Forecast investment growth with daily, monthly, or annual compound interest and recurring deposits. View visual milestone charts and complete accumulation tables.',
  alternates: {
    canonical: 'https://solveitcalculator.com/finance/compound-interest-calculator',
  },
  openGraph: {
    title: 'Compound Interest Calculator | SolveItCalculator',
    description:
      'Forecast compound investment returns over time with regular contributions, variable frequencies, and visual accumulation schedules.',
    url: 'https://solveitcalculator.com/finance/compound-interest-calculator',
    type: 'website',
    images: [{ url: 'https://solveitcalculator.com/og-home.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Compound Interest Calculator | SolveItCalculator',
    description: 'Calculate future investment growth with monthly contributions and compound interest.',
    images: ['https://solveitcalculator.com/og-home.png'],
  },
};

export default function CompoundInterestPage() {
  const data = getCalculatorSystemData('compound-interest-calculator');
  if (!data) return null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': 'https://solveitcalculator.com/finance/compound-interest-calculator#app',
        url: 'https://solveitcalculator.com/finance/compound-interest-calculator',
        name: data.h1,
        applicationCategory: 'FinanceApplication',
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
          { '@type': 'ListItem', position: 2, name: 'Finance', item: 'https://solveitcalculator.com/finance' },
          { '@type': 'ListItem', position: 3, name: 'Compound Interest Calculator', item: 'https://solveitcalculator.com/finance/compound-interest-calculator' },
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
        <CompoundInterestClient />
      </CalculatorPageSystem>
    </>
  );
}
