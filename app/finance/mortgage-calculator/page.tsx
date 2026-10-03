import React from 'react';
import type { Metadata } from 'next';
import CalculatorPageSystem from '@/components/calculator/CalculatorPageSystem';
import MortgageCalculatorClient from './MortgageCalculatorClient';
import { getCalculatorSystemData } from '@/lib/calculatorSystemData';

export const metadata: Metadata = {
  title: 'Mortgage Calculator | Monthly Payment, PITI & Amortization | SolveItCalculator',
  description:
    'Calculate exact monthly mortgage payments (PITI: Principal, Interest, Taxes, Insurance & PMI) with full 30-year amortization tables. CFPB standard fixed-rate model.',
  alternates: {
    canonical: 'https://solveitcalculator.com/finance/mortgage-calculator',
  },
  openGraph: {
    title: 'Mortgage Calculator | Payment & Amortization | SolveItCalculator',
    description:
      'Calculate monthly mortgage payments, property taxes, home insurance, PMI, and amortization schedules with precision financial equations.',
    url: 'https://solveitcalculator.com/finance/mortgage-calculator',
    type: 'website',
    images: [{ url: 'https://solveitcalculator.com/og-home.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mortgage Calculator | SolveItCalculator',
    description: 'Calculate monthly mortgage payments and 30-year amortization schedules.',
    images: ['https://solveitcalculator.com/og-home.png'],
  },
};

export default function MortgageCalculatorPage() {
  const data = getCalculatorSystemData('mortgage-calculator');
  if (!data) return null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': 'https://solveitcalculator.com/finance/mortgage-calculator#app',
        url: 'https://solveitcalculator.com/finance/mortgage-calculator',
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
          { '@type': 'ListItem', position: 3, name: 'Mortgage Calculator', item: 'https://solveitcalculator.com/finance/mortgage-calculator' },
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
        <MortgageCalculatorClient />
      </CalculatorPageSystem>
    </>
  );
}
