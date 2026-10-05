import React from 'react';
import type { Metadata } from 'next';
import AppreciationCalculator from '@/components/AppreciationCalculator';

export const metadata: Metadata = {
  title: 'Appreciation Calculator | Real Estate & Asset Growth | SolveIt Finance',
  description:
    'Calculate the future value, total appreciation gain, and growth percentage of homes, properties, and investments over time. Includes compounding schedules and inflation adjustments.',
  alternates: {
    canonical: 'https://solveitcalculator.com/finance/appreciation-calculator',
  },
  openGraph: {
    title: 'Appreciation Calculator | Real Estate & Asset Growth',
    description:
      'Calculate the future value, total appreciation gain, and growth percentage of homes, properties, and investments over time.',
    url: 'https://solveitcalculator.com/finance/appreciation-calculator',
    type: 'website',
  },
};

export default function FinanceAppreciationCalculatorPage() {
  return (
    <main className="min-h-screen px-4 sm:px-6 lg:px-8 py-6">
      <AppreciationCalculator />
    </main>
  );
}
