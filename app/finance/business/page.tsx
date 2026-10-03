import React from 'react';
import type { Metadata } from 'next';
import FinanceSubcategoryHub from '@/components/finance/FinanceSubcategoryHub';
import { getFinanceSubcategoryCluster } from '@/lib/financeClustersData';

export const metadata: Metadata = {
  title: 'Business Finance, Margin & Break-Even Calculators | SolveItCalculator',
  description:
    'Calculate gross and net profit margins, break-even unit volumes, markup conversions, commercial equipment loans, and operating cash flow metrics.',
  alternates: {
    canonical: 'https://solveitcalculator.com/finance/business',
  },
  openGraph: {
    title: 'Business Finance & Margin Calculators | SolveItCalculator',
    description:
      'High-precision financial modeling tools for business owners: break-even volume, profit margins, markup multipliers, and commercial financing.',
    url: 'https://solveitcalculator.com/finance/business',
    type: 'website',
    images: [{ url: 'https://solveitcalculator.com/og-home.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Business Finance Calculators | SolveItCalculator',
    description: 'Calculate break-even units, profit margins, markup rates, and commercial loan schedules.',
    images: ['https://solveitcalculator.com/og-home.png'],
  },
};

export default function BusinessHubPage() {
  const cluster = getFinanceSubcategoryCluster('business');
  if (!cluster) return null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://solveitcalculator.com/finance/business#collection',
        url: 'https://solveitcalculator.com/finance/business',
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
          { '@type': 'ListItem', position: 3, name: 'Business Finance', item: 'https://solveitcalculator.com/finance/business' },
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
