import React from 'react';
import type { Metadata } from 'next';
import FinanceSubcategoryHub from '@/components/finance/FinanceSubcategoryHub';
import { getFinanceSubcategoryCluster } from '@/lib/financeClustersData';

export const metadata: Metadata = {
  title: 'FIRE (Financial Independence, Retire Early) Calculators | SolveItCalculator',
  description:
    'Calculate your FIRE Number, savings rate impact on years to financial freedom, LeanFIRE vs FatFIRE expense models, and CoastFIRE milestone trajectories.',
  alternates: {
    canonical: 'https://solveitcalculator.com/finance/fire',
  },
  openGraph: {
    title: 'FIRE Calculators & Early Retirement Forecasters | SolveItCalculator',
    description:
      'Model your path to Financial Independence (FIRE) with real math, safe withdrawal rate (SWR) simulations, and savings rate accelerators.',
    url: 'https://solveitcalculator.com/finance/fire',
    type: 'website',
    images: [{ url: 'https://solveitcalculator.com/og-home.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FIRE Calculators | SolveItCalculator',
    description: 'Calculate your FIRE number, savings rate timeline, and early retirement milestones.',
    images: ['https://solveitcalculator.com/og-home.png'],
  },
};

export default function FireHubPage() {
  const cluster = getFinanceSubcategoryCluster('fire');
  if (!cluster) return null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://solveitcalculator.com/finance/fire#collection',
        url: 'https://solveitcalculator.com/finance/fire',
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
          { '@type': 'ListItem', position: 3, name: 'FIRE Planning', item: 'https://solveitcalculator.com/finance/fire' },
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
