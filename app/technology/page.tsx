import React from 'react';
import type { Metadata } from 'next';
import TechnologyCategoryHub from '@/components/TechnologyCategoryHub';
import { getCategoryHubConfig } from '@/lib/categoryHubConfigs';

export const metadata: Metadata = {
  title: 'Technology Calculators | Download Time, Storage GB to GiB & Passwords | SolveItCalculator',
  description:
    'Free beginner-friendly technology calculators: estimate download time, convert drive storage from GB to GiB, test password cracking time, calculate power costs, and convert REM to PX.',
  alternates: {
    canonical: 'https://solveitcalculator.com/technology',
  },
  openGraph: {
    title: 'Technology Calculators | SolveItCalculator',
    description:
      'Easy-to-use tech tools: download time estimator, binary storage converter, password entropy checker, and everyday guides.',
    url: 'https://solveitcalculator.com/technology',
    type: 'website',
    images: [{ url: 'https://solveitcalculator.com/og-home.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Technology Calculators | SolveItCalculator',
    description: 'Interactive download estimators, storage converters, and password safety checkers in simple everyday words.',
    images: ['https://solveitcalculator.com/og-home.png'],
  },
};

export default function TechnologyPage() {
  const config = getCategoryHubConfig('technology');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://solveitcalculator.com/technology#collection',
        url: 'https://solveitcalculator.com/technology',
        name: 'Technology Calculators',
        description: config?.intro || 'Clear, simple technology and computing calculators.',
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
          { '@type': 'ListItem', position: 2, name: 'Technology Calculators', item: 'https://solveitcalculator.com/technology' },
        ],
      },
      ...(config?.faqs
        ? [
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
          ]
        : []),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TechnologyCategoryHub />
    </>
  );
}
