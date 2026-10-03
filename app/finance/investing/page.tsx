import React from 'react';
import type { Metadata } from 'next';
import InvestingAndGrowthClient from '@/app/investing-and-growth/InvestingAndGrowthClient';

export const metadata: Metadata = {
  title: 'Investing & Wealth Growth Calculators | SIP, CAGR & Dividend Trajectory',
  description:
    'Model investment portfolio growth, dollar-cost averaging (DCA), systematic investment plans (SIP), compound annual growth rates (CAGR), and dividend reinvestment.',
  alternates: {
    canonical: 'https://solveitcalculator.com/finance/investing',
  },
  openGraph: {
    title: 'Investing & Wealth Growth Calculators – SolveIt Calculator',
    description:
      'Forecast portfolio returns, SIP compounding curves, and long-term asset accumulation with mathematical precision.',
    url: 'https://solveitcalculator.com/finance/investing',
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://solveitcalculator.com' },
        { '@type': 'ListItem', position: 2, name: 'Finance', item: 'https://solveitcalculator.com/finance' },
        { '@type': 'ListItem', position: 3, name: 'Investing & Growth', item: 'https://solveitcalculator.com/finance/investing' },
      ],
    },
    {
      '@type': 'CollectionPage',
      name: 'Investing & Wealth Growth Calculators',
      url: 'https://solveitcalculator.com/finance/investing',
      description: 'Calculators for SIP, CAGR, dividend reinvestment, and index fund compounding.',
    },
  ],
};

export default function InvestingSubcategoryPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <InvestingAndGrowthClient />
    </>
  );
}
