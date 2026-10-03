import React from 'react';
import type { Metadata } from 'next';
import CategoryTopicHub from '@/components/CategoryTopicHub';
import { getCategoryHubConfig } from '@/lib/categoryHubConfigs';

export const metadata: Metadata = {
  title: 'Home & Construction Calculators | Concrete, Framing, Roofing & Paint | SolveItCalculator',
  description:
    'Free construction calculators for concrete slab cubic yards, flooring square footage with cut-waste buffers, roof pitch squares, and wall paint coverage. IRC standard models.',
  alternates: {
    canonical: 'https://solveitcalculator.com/home-construction',
  },
  openGraph: {
    title: 'Home & Construction Calculators | SolveItCalculator',
    description:
      'Residential building material estimators for concrete volumes, framing lumber, roofing pitch, and flooring square footage.',
    url: 'https://solveitcalculator.com/home-construction',
    type: 'website',
    images: [{ url: 'https://solveitcalculator.com/og-home.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Home & Construction Calculators | SolveItCalculator',
    description: 'Calculate concrete cubic yards, roofing squares, and flooring materials with IRC standards.',
    images: ['https://solveitcalculator.com/og-home.png'],
  },
};

export default function HomeConstructionPage() {
  const config = getCategoryHubConfig('home-construction');
  if (!config) return null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://solveitcalculator.com/home-construction#collection',
        url: 'https://solveitcalculator.com/home-construction',
        name: 'Home & Construction Calculators',
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
          { '@type': 'ListItem', position: 2, name: 'Home & Construction Calculators', item: 'https://solveitcalculator.com/home-construction' },
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
