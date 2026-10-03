import React from 'react';
import type { Metadata } from 'next';
import CategoryTopicHub from '@/components/CategoryTopicHub';
import { getCategoryHubConfig } from '@/lib/categoryHubConfigs';

export const metadata: Metadata = {
  title: 'Business Calculators | Profit Margins, Break-Even & ROI | SolveItCalculator',
  description:
    'Free business calculators for profit margins, markups, break-even unit sales, ROI yields, freelance billable hourly rates, and meeting costs. Managerial finance formulas.',
  alternates: {
    canonical: 'https://solveitcalculator.com/business',
  },
  openGraph: {
    title: 'Business Calculators | Profit Margins, Break-Even & ROI | SolveItCalculator',
    description:
      'Managerial cost accounting, margin solvers, break-even analysis, and freelance pricing calculators.',
    url: 'https://solveitcalculator.com/business',
    type: 'website',
    images: [{ url: 'https://solveitcalculator.com/og-home.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Business Calculators | SolveItCalculator',
    description: 'Calculate profit margins, break-even points, and ROI with free managerial tools.',
    images: ['https://solveitcalculator.com/og-home.png'],
  },
};

export default function BusinessPage() {
  const config = getCategoryHubConfig('business');
  if (!config) return null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://solveitcalculator.com/business#collection',
        url: 'https://solveitcalculator.com/business',
        name: 'Business Calculators',
        description: config.intro,
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
          { '@type': 'ListItem', position: 2, name: 'Business Calculators', item: 'https://solveitcalculator.com/business' },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: config.faqs.map((f) => ({
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
      <CategoryTopicHub config={config} />
    </>
  );
}
