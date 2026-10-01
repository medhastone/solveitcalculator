import React from 'react';
import { Metadata } from 'next';
import FinanceHubClient from './FinanceHubClient';

export const metadata: Metadata = {
  title: 'Finance Calculators | Loans, Investing, Retirement & Taxes | SolveItCalculator',
  description:
    'Explore free finance calculators for loans, mortgages, investing, savings, retirement, taxes, debt, credit cards, banking, and financial planning.',
  alternates: {
    canonical: 'https://solveitcalculator.com/finance',
  },
  openGraph: {
    title: 'Finance Calculators for Smarter Money Decisions | SolveItCalculator',
    description:
      'Calculate loans, mortgages, investments, savings, retirement, taxes, debt, and more. Compare scenarios, understand assumptions, and explore financial tools.',
    url: 'https://solveitcalculator.com/finance',
    type: 'website',
    images: [
      {
        url: 'https://solveitcalculator.com/og-home.png',
        width: 1200,
        height: 630,
        alt: 'SolveIt Calculator – Finance Calculators for Smarter Money Decisions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Finance Calculators for Smarter Money Decisions | SolveItCalculator',
    description:
      'Free finance calculators for loans, investments, retirement, taxes, savings, mortgages, debt, business finance and more.',
    images: ['https://solveitcalculator.com/og-home.png'],
  },
};

export default function FinancePage() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://solveitcalculator.com/finance#collection',
        url: 'https://solveitcalculator.com/finance',
        name: 'Finance Calculators for Smarter Money Decisions',
        description:
          'A comprehensive collection of transparent financial calculators covering loans, mortgages, investing, retirement planning, savings, debt payoff, credit cards, taxes, and business finance.',
        isPartOf: {
          '@type': 'WebSite',
          '@id': 'https://solveitcalculator.com/#website',
          url: 'https://solveitcalculator.com/',
          name: 'SolveIt Calculator',
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://solveitcalculator.com/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Finance Calculators',
            item: 'https://solveitcalculator.com/finance',
          },
        ],
      },
      {
        '@type': 'Organization',
        '@id': 'https://solveitcalculator.com/#organization',
        name: 'SolveIt Calculator',
        url: 'https://solveitcalculator.com/',
        logo: 'https://solveitcalculator.com/logo.png?v=2',
        email: 'info@solveitcalculator.com',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <FinanceHubClient />
    </>
  );
}

