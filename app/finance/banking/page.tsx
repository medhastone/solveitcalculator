import React from 'react';
import type { Metadata } from 'next';
import BankingAndCashAccountsClient from '@/app/banking-and-cash-accounts/BankingAndCashAccountsClient';

export const metadata: Metadata = {
  title: 'Banking & Cash Account Calculators | APY, High-Yield Savings & CDs',
  description:
    'Calculate Annual Percentage Yield (APY), certificate of deposit (CD) maturity values, checking account fees, and liquid cash reserve yields.',
  alternates: {
    canonical: 'https://solveitcalculator.com/finance/banking',
  },
  openGraph: {
    title: 'Banking & Cash Account Calculators – SolveIt Calculator',
    description:
      'Compare APY vs APR, CD compounding, and cash interest returns with instant mathematical accuracy.',
    url: 'https://solveitcalculator.com/finance/banking',
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
        { '@type': 'ListItem', position: 3, name: 'Banking & Cash Accounts', item: 'https://solveitcalculator.com/finance/banking' },
      ],
    },
    {
      '@type': 'CollectionPage',
      name: 'Banking & Cash Account Calculators',
      url: 'https://solveitcalculator.com/finance/banking',
      description: 'Calculators for APY yield, certificate of deposit compounding, and liquid banking reserves.',
    },
  ],
};

export default function BankingSubcategoryPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BankingAndCashAccountsClient />
    </>
  );
}
