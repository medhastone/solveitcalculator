import React from 'react';
import type { Metadata } from 'next';
import AllCalculatorsDirectoryClient from '@/components/directory/AllCalculatorsDirectoryClient';

export const metadata: Metadata = {
  title: 'All Calculators Directory: Math, Finance & Units | SolveIt',
  description:
    'Browse 91 verified online calculators grouped by category across Math, Finance & Tax, Unit Conversion, Date & Time, Health & Fitness, Construction, and Science.',
  alternates: {
    canonical: 'https://solveitcalculator.com/calculators',
  },
  openGraph: {
    title: 'All Calculators Directory: Math, Finance & Units | SolveIt',
    description:
      'Explore all verified calculators grouped by category with step-by-step equations, worked examples, and instant browser calculations.',
    url: 'https://solveitcalculator.com/calculators',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All Calculators Directory: Math, Finance & Units | SolveIt',
    description:
      'Browse 91 verified online calculators grouped by category across Math, Finance & Tax, Unit Conversion, Date & Time, Health & Fitness, Construction, and Science.',
  },
};

export default function AllCalculatorsPage() {
  return <AllCalculatorsDirectoryClient />;
}
