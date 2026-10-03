import React from 'react';
import type { Metadata } from 'next';
import HomePageClient from './HomePageClient';
import HomePageSeoSections from './HomePageSeoSections';

export const metadata: Metadata = {
  title: 'SolveIt Calculator | Professional Free Online Calculators & Converters',
  description:
    'Every Calculation. One Place. High-precision computational engines for finance, business, engineering, conversions, health, math, and daily productivity. 100% free, private, client-side execution.',
  alternates: {
    canonical: 'https://solveitcalculator.com',
  },
  openGraph: {
    title: 'SolveIt Calculator | Professional Free Online Calculators & Converters',
    description:
      'Every Calculation. One Place. High-precision computational engines for finance, business, engineering, conversions, health, math, and daily productivity.',
    url: 'https://solveitcalculator.com',
    siteName: 'SolveItCalculator',
    images: [
      {
        url: '/solveit-1.webp',
        alt: 'SolveIt Calculator Logo',
      },
    ],
    type: 'website',
  },
};

export default function HomePage() {
  return (
    <main className="w-full">
      <HomePageClient />
      <HomePageSeoSections />
    </main>
  );
}
