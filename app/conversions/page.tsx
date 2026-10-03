import React from 'react';
import type { Metadata } from 'next';
import CategoryTopicHub from '@/components/CategoryTopicHub';
import { getCategoryHubConfig } from '@/lib/categoryHubConfigs';

export const metadata: Metadata = {
  title: 'Unit Conversion Calculators | Length, Weight, Volume & Temperature | SolveItCalculator',
  description:
    'Free unit converters for length, mass, volume, temperature, speed, energy, pressure, and digital storage. Verified NIST SP 811 and ISO 80000 conversion factors.',
  alternates: {
    canonical: 'https://solveitcalculator.com/conversions',
  },
  openGraph: {
    title: 'Unit Conversion Calculators | SolveItCalculator',
    description:
      'Standardized unit conversions across length, mass, volume, temperature, and engineering dimensions.',
    url: 'https://solveitcalculator.com/conversions',
    type: 'website',
    images: [{ url: 'https://solveitcalculator.com/og-home.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Unit Conversion Calculators | SolveItCalculator',
    description: 'Convert length, weight, temperature, volume, and data with exact scientific ratios.',
    images: ['https://solveitcalculator.com/og-home.png'],
  },
};

export default function ConversionsPage() {
  const config = getCategoryHubConfig('conversions');
  if (!config) return null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://solveitcalculator.com/conversions#collection',
        url: 'https://solveitcalculator.com/conversions',
        name: 'Unit Conversion Calculators',
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
          { '@type': 'ListItem', position: 2, name: 'Unit Conversion Calculators', item: 'https://solveitcalculator.com/conversions' },
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
