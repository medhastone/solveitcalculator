import React from 'react';
import type { Metadata } from 'next';
import FinanceSubcategoryHub from '@/components/finance/FinanceSubcategoryHub';
import { getFinanceSubcategoryCluster } from '@/lib/financeClustersData';

export const metadata: Metadata = {
  title: 'Compound Interest & Growth Calculators | SolveItCalculator',
  description:
    'Calculate exponential compound interest growth, daily and monthly compounding frequency effects, Rule of 72 doubling timelines, and future portfolio balance schedules.',
  alternates: {
    canonical: 'https://solveitcalculator.com/finance/compound-interest',
  },
  openGraph: {
    title: 'Compound Interest & Growth Calculators | SolveItCalculator',
    description:
      'High-precision compound interest models with flexible deposit intervals, APY conversions, and exponential growth simulations.',
    url: 'https://solveitcalculator.com/finance/compound-interest',
    type: 'website',
    images: [{ url: 'https://solveitcalculator.com/og-home.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Compound Interest & Growth Calculators | SolveItCalculator',
    description: 'Calculate compound interest growth, APY rates, and investment doubling schedules.',
    images: ['https://solveitcalculator.com/og-home.png'],
  },
};

export default function CompoundInterestHubPage() {
  const cluster = getFinanceSubcategoryCluster('compound-interest');
  if (!cluster) return null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://solveitcalculator.com/finance/compound-interest#collection',
        url: 'https://solveitcalculator.com/finance/compound-interest',
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
          { '@type': 'ListItem', position: 3, name: 'Compound Interest', item: 'https://solveitcalculator.com/finance/compound-interest' },
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
