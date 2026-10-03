import React from 'react';
import type { Metadata } from 'next';
import SavingsAndLiquidityClient from '@/app/savings-and-liquidity/SavingsAndLiquidityClient';

export const metadata: Metadata = {
  title: 'Savings & Liquidity Calculators | Emergency Funds & Target Goals',
  description:
    'Plan emergency savings cushions, monthly savings contributions, sinking funds, and target date cash accumulation with transparent financial formulas.',
  alternates: {
    canonical: 'https://solveitcalculator.com/finance/savings',
  },
  openGraph: {
    title: 'Savings & Liquidity Calculators – SolveIt Calculator',
    description:
      'Plan your emergency fund, target savings milestones, and regular deposits with clear financial growth curves.',
    url: 'https://solveitcalculator.com/finance/savings',
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
        { '@type': 'ListItem', position: 3, name: 'Savings & Liquidity', item: 'https://solveitcalculator.com/finance/savings' },
      ],
    },
    {
      '@type': 'CollectionPage',
      name: 'Savings & Liquidity Calculators',
      url: 'https://solveitcalculator.com/finance/savings',
      description: 'Calculators for personal liquidity, emergency funds, and recurring savings plans.',
    },
  ],
};

export default function SavingsSubcategoryPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SavingsAndLiquidityClient />
    </>
  );
}
