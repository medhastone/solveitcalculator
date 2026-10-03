import React from 'react';
import type { Metadata } from 'next';
import FinanceSubcategoryHub from '@/components/finance/FinanceSubcategoryHub';
import { getFinanceSubcategoryCluster } from '@/lib/financeClustersData';

export const metadata: Metadata = {
  title: 'Real Estate Investment, Cap Rate & Rental Yield Calculators | SolveItCalculator',
  description:
    'Calculate Capitalization Rates (Cap Rate), Cash-on-Cash Return, Net Operating Income (NOI), Gross Rent Multipliers (GRM), and rental property cash flows.',
  alternates: {
    canonical: 'https://solveitcalculator.com/finance/real-estate',
  },
  openGraph: {
    title: 'Real Estate Finance & Cap Rate Calculators | SolveItCalculator',
    description:
      'Evaluate real estate rental property investments with NOI, Cap Rate, Cash-on-Cash yield, and mortgage amortization analysis.',
    url: 'https://solveitcalculator.com/finance/real-estate',
    type: 'website',
    images: [{ url: 'https://solveitcalculator.com/og-home.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Real Estate Investment Calculators | SolveItCalculator',
    description: 'Calculate Cap Rate, Cash-on-Cash yield, NOI, and rental cash flows.',
    images: ['https://solveitcalculator.com/og-home.png'],
  },
};

export default function RealEstateHubPage() {
  const cluster = getFinanceSubcategoryCluster('real-estate');
  if (!cluster) return null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://solveitcalculator.com/finance/real-estate#collection',
        url: 'https://solveitcalculator.com/finance/real-estate',
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
          { '@type': 'ListItem', position: 3, name: 'Real Estate', item: 'https://solveitcalculator.com/finance/real-estate' },
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
