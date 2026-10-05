import React from 'react';
import type { Metadata } from 'next';
import AppreciationCalculator from '@/components/AppreciationCalculator';

export const metadata: Metadata = {
  title: 'Appreciation Calculator | Free Home & Asset Growth Calculator | SolveIt',
  description:
    'Calculate the future value, total appreciation gain, and growth percentage of real estate, homes, collectibles, or investments over time. Includes formula, schedule, and inflation adjustments.',
  alternates: {
    canonical: 'https://solveitcalculator.com/appreciation-calculator',
  },
  openGraph: {
    title: 'Appreciation Calculator | Free Home & Asset Growth Calculator',
    description:
      'Calculate the future value, total appreciation gain, and growth percentage of real estate, homes, collectibles, or investments over time with step-by-step formulas.',
    url: 'https://solveitcalculator.com/appreciation-calculator',
    type: 'website',
  },
};

export default function AppreciationCalculatorPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Appreciation Calculator',
    operatingSystem: 'Any',
    applicationCategory: 'FinanceApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description:
      'Online calculator to project asset and home appreciation, future value, compounding returns, and cumulative capital gains.',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen px-4 sm:px-6 lg:px-8 py-6">
        <AppreciationCalculator />
      </main>
    </>
  );
}
