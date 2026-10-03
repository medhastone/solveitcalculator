import React from 'react';
import type { Metadata } from 'next';
import FinanceSubcategoryHub from '@/components/finance/FinanceSubcategoryHub';
import { getFinanceSubcategoryCluster } from '@/lib/financeClustersData';

export const metadata: Metadata = {
  title: 'Mortgage & Home Financing Calculators | SolveItCalculator',
  description:
    'Calculate monthly mortgage payments (PITI: Principal, Interest, Taxes & Insurance), private mortgage insurance (PMI), down payments, and 15 vs 30 year amortization.',
  alternates: {
    canonical: 'https://solveitcalculator.com/finance/mortgages',
  },
  openGraph: {
    title: 'Mortgage & Home Financing Calculators | SolveItCalculator',
    description:
      'Home loan amortization models, PITI payment estimators, and down payment calculators.',
    url: 'https://solveitcalculator.com/finance/mortgages',
    type: 'website',
    images: [{ url: 'https://solveitcalculator.com/og-home.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mortgage & Home Financing Calculators | SolveItCalculator',
    description: 'Calculate mortgage payments, property taxes, home insurance, and PMI.',
    images: ['https://solveitcalculator.com/og-home.png'],
  },
};

export default function MortgagesHubPage() {
  const cluster = getFinanceSubcategoryCluster('mortgages');
  if (!cluster) return null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://solveitcalculator.com/finance/mortgages#collection',
        url: 'https://solveitcalculator.com/finance/mortgages',
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
          { '@type': 'ListItem', position: 3, name: 'Mortgages & Real Estate', item: 'https://solveitcalculator.com/finance/mortgages' },
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
