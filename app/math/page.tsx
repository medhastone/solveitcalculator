import React from 'react';
import type { Metadata } from 'next';
import CategoryTopicHub from '@/components/CategoryTopicHub';
import { getCategoryHubConfig } from '@/lib/categoryHubConfigs';

export const metadata: Metadata = {
  title: 'Math Calculators & Step-by-Step Solvers | SolveItCalculator',
  description:
    'Free math calculators for percentages, statistics, standard deviation, algebra, geometry, trigonometry, and scientific expressions. Real formulas with step-by-step proofs.',
  alternates: {
    canonical: 'https://solveitcalculator.com/math',
  },
  openGraph: {
    title: 'Math Calculators & Step-by-Step Solvers | SolveItCalculator',
    description:
      'Exact mathematical engines for percentage changes, statistical distributions, standard deviations, and scientific expressions.',
    url: 'https://solveitcalculator.com/math',
    type: 'website',
    images: [{ url: 'https://solveitcalculator.com/og-home.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Math Calculators | SolveItCalculator',
    description: 'Free math solvers for percentages, statistics, standard deviation, and algebra.',
    images: ['https://solveitcalculator.com/og-home.png'],
  },
};

export default function MathPage() {
  const config = getCategoryHubConfig('math');
  if (!config) return null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://solveitcalculator.com/math#collection',
        url: 'https://solveitcalculator.com/math',
        name: 'Math Calculators',
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
          { '@type': 'ListItem', position: 2, name: 'Math Calculators', item: 'https://solveitcalculator.com/math' },
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
