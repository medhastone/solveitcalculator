import React from 'react';
import type { Metadata } from 'next';
import AllCalculatorsDirectoryClient from '@/components/directory/AllCalculatorsDirectoryClient';

export const metadata: Metadata = {
  title:
    'All Calculators Directory — Math, Finance, Construction, Conversion & Health Tools | SolveItCalculator',
  description:
    'Browse 100+ free online calculators with instant live results, step-by-step formulas, and quick-reference charts across Math, Finance & Tax, Home & Construction, Unit Conversion, Date & Time, Health, and Science.',
  alternates: {
    canonical: 'https://solveitcalculator.com/calculators',
  },
  openGraph: {
    title:
      'All Calculators Directory — Free Online Calculators & Formula Charts | SolveItCalculator',
    description:
      'Explore all verified calculators grouped by category with step-by-step equations, worked examples, and instant browser calculations.',
    url: 'https://solveitcalculator.com/calculators',
    type: 'website',
  },
};

export default function AllCalculatorsPage() {
  return <AllCalculatorsDirectoryClient />;
}
