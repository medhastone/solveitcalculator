import React from 'react';
import type { Metadata } from 'next';
import FinanceSubcategoryHub from '@/components/finance/FinanceSubcategoryHub';
import { getFinanceSubcategoryCluster } from '@/lib/financeClustersData';

export const metadata: Metadata = {
  title: 'Loan, EMI & Debt Payoff Calculators | SolveItCalculator',
  description:
    'Free loan and debt calculators for equated monthly installments (EMI), personal loans, auto loans, interest reduction, and debt avalanche vs snowball payoff strategies.',
  alternates: {
    canonical: 'https://solveitcalculator.com/finance/loans',
  },
  openGraph: {
    title: 'Loan, EMI & Debt Payoff Calculators | SolveItCalculator',
    description:
      'High-precision loan calculators for personal, car, student, and commercial debt amortization and accelerated payoff models.',
    url: 'https://solveitcalculator.com/finance/loans',
    type: 'website',
    images: [{ url: 'https://solveitcalculator.com/og-home.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Loan, EMI & Debt Calculators | SolveItCalculator',
    description: 'Calculate loan installments, total interest, and debt payoff timelines.',
    images: ['https://solveitcalculator.com/og-home.png'],
  },
};

export default function LoansHubPage() {
  const cluster = getFinanceSubcategoryCluster('loans');
  if (!cluster) return null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://solveitcalculator.com/finance/loans#collection',
        url: 'https://solveitcalculator.com/finance/loans',
        name: cluster.h1,
        description: cluster.description,
        isPartOf: {
          '@type': 'WebSite',
          '@id': 'https://solveitcalculator.com/#website',
          url: 'https://solveitcalculator.com/',
          name: 'SolveItCalculator',
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://solveitcalculator.com' },
          { '@type': 'ListItem', position: 2, name: 'Finance', item: 'https://solveitcalculator.com/finance' },
          { '@type': 'ListItem', position: 3, name: 'Loans & Debt', item: 'https://solveitcalculator.com/finance/loans' },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: cluster.faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.answer,
          },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FinanceSubcategoryHub cluster={cluster} />
    </>
  );
}
