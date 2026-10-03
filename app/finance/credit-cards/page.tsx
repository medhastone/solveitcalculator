import React from 'react';
import type { Metadata } from 'next';
import CreditCardsAndRevolvingClient from '@/app/credit-cards-and-revolving/CreditCardsAndRevolvingClient';

export const metadata: Metadata = {
  title: 'Credit Card & Revolving Debt Calculators | Payoff Timelines & Interest Savings',
  description:
    'Calculate the true cost of credit card minimum payments, fixed monthly payoff timelines, balance transfer savings, and revolving interest charges.',
  alternates: {
    canonical: 'https://solveitcalculator.com/finance/credit-cards',
  },
  openGraph: {
    title: 'Credit Card & Revolving Debt Calculators – SolveIt Calculator',
    description:
      'Compare minimum payments vs. accelerated payoff schedules and escape compounding credit card interest.',
    url: 'https://solveitcalculator.com/finance/credit-cards',
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
        { '@type': 'ListItem', position: 3, name: 'Credit Cards & Revolving Debt', item: 'https://solveitcalculator.com/finance/credit-cards' },
      ],
    },
    {
      '@type': 'CollectionPage',
      name: 'Credit Card & Revolving Debt Calculators',
      url: 'https://solveitcalculator.com/finance/credit-cards',
      description: 'Calculators to model credit card payoff schedules, balance transfers, and interest amortization.',
    },
  ],
};

export default function CreditCardsSubcategoryPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CreditCardsAndRevolvingClient />
    </>
  );
}
