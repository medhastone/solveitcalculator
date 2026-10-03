import React from 'react';
import type { Metadata } from 'next';
import GlobalTaxCalculatorClient from '@/app/global-tax-calculator/GlobalTaxCalculatorClient';

export const metadata: Metadata = {
  title: 'Income Tax & Statutory Calculators | Brackets, Withholdings & GST/VAT',
  description:
    'Free income tax and statutory deduction calculators. Estimate federal, state, and local income tax brackets, FICA withholdings, GST, and value-added tax (VAT).',
  alternates: {
    canonical: 'https://solveitcalculator.com/finance/taxes',
  },
  openGraph: {
    title: 'Income Tax & Statutory Calculators – SolveIt Calculator',
    description:
      'Model marginal vs effective tax rates, standard deductions, and statutory withholdings with updated tax curves.',
    url: 'https://solveitcalculator.com/finance/taxes',
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
        { '@type': 'ListItem', position: 3, name: 'Tax Engines', item: 'https://solveitcalculator.com/finance/taxes' },
      ],
    },
    {
      '@type': 'CollectionPage',
      name: 'Tax Engines & Statutory Calculators',
      url: 'https://solveitcalculator.com/finance/taxes',
      description: 'Transparent computational tax engines for personal income tax, marginal brackets, and indirect sales taxes.',
    },
  ],
};

export default function TaxesSubcategoryPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <GlobalTaxCalculatorClient />
    </>
  );
}
