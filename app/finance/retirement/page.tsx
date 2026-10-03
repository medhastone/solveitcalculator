import React from 'react';
import type { Metadata } from 'next';
import RetirementAndSuperClient from '@/app/retirement-and-super/RetirementAndSuperClient';

export const metadata: Metadata = {
  title: 'Retirement & Superannuation Calculators | 401(k), FIRE & Pension Planning',
  description:
    'Plan your retirement with confidence. Calculate 401(k) accumulation, superannuation balances, pension replacement rates, and safe withdrawal schedules.',
  alternates: {
    canonical: 'https://solveitcalculator.com/finance/retirement',
  },
  openGraph: {
    title: 'Retirement & Superannuation Calculators – SolveIt Calculator',
    description:
      'Plan your retirement nest egg, employer contributions, and lifetime withdrawal sustainability.',
    url: 'https://solveitcalculator.com/finance/retirement',
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
        { '@type': 'ListItem', position: 3, name: 'Retirement & Pension', item: 'https://solveitcalculator.com/finance/retirement' },
      ],
    },
    {
      '@type': 'CollectionPage',
      name: 'Retirement & Superannuation Calculators',
      url: 'https://solveitcalculator.com/finance/retirement',
      description: 'Comprehensive retirement calculators for 401(k), IRA, superannuation, and pension projections.',
    },
  ],
};

export default function RetirementSubcategoryPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <RetirementAndSuperClient />
    </>
  );
}
