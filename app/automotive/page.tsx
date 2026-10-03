import React from 'react';
import type { Metadata } from 'next';
import AutomotiveCategoryHub from '@/components/AutomotiveCategoryHub';
import { getCategoryHubConfig } from '@/lib/categoryHubConfigs';

export const metadata: Metadata = {
  title: 'Automotive Calculators | Tire Size, Engine Displacement, Speedometer & Auto Loans | SolveItCalculator',
  description:
    'Free automotive calculators for tire size comparison, speedometer calibration error, engine displacement & compression ratio, horsepower, torque, fuel economy, and auto loan financing.',
  alternates: {
    canonical: 'https://solveitcalculator.com/automotive',
  },
  openGraph: {
    title: 'Automotive Calculators & Sizing Tools | SolveItCalculator',
    description:
      'Precision vehicle engineering calculators for tire comparison, speedometer calibration, engine displacement, gear ratios, fuel trip costs, and auto loans.',
    url: 'https://solveitcalculator.com/automotive',
    type: 'website',
    images: [{ url: 'https://solveitcalculator.com/og-home.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Automotive Calculators | SolveItCalculator',
    description: 'Calculate tire sizes, speedometer error, engine displacement, and auto financing with SAE standards.',
    images: ['https://solveitcalculator.com/og-home.png'],
  },
};

export default function AutomotivePage() {
  const config = getCategoryHubConfig('automotive');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://solveitcalculator.com/automotive#collection',
        url: 'https://solveitcalculator.com/automotive',
        name: 'Automotive Calculators',
        description: config?.intro || 'Free automotive calculators for tire size, engine displacement, and vehicle dynamics.',
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
          { '@type': 'ListItem', position: 2, name: 'Automotive Calculators', item: 'https://solveitcalculator.com/automotive' },
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
      <AutomotiveCategoryHub />
    </>
  );
}
