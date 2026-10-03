import React from 'react';
import type { Metadata } from 'next';
import CategoryTopicHub from '@/components/CategoryTopicHub';
import { getCategoryHubConfig } from '@/lib/categoryHubConfigs';

export const metadata: Metadata = {
  title: 'Health & Fitness Calculators | BMI, BMR, TDEE & Running Pace | SolveItCalculator',
  description:
    'Free health and physiology calculators for BMI, Mifflin-St Jeor BMR, TDEE maintenance calories, target heart rate zones, and running race pace splits. Evidence-based formulas.',
  alternates: {
    canonical: 'https://solveitcalculator.com/health-fitness-calculators',
  },
  openGraph: {
    title: 'Health & Fitness Calculators | SolveItCalculator',
    description:
      'Evidence-based physiological estimators for BMI, BMR, TDEE, body composition, and cardiac training zones.',
    url: 'https://solveitcalculator.com/health-fitness-calculators',
    type: 'website',
    images: [{ url: 'https://solveitcalculator.com/og-home.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Health & Fitness Calculators | SolveItCalculator',
    description: 'Evidence-based tools for BMI, BMR, TDEE, and cardiovascular exercise planning.',
    images: ['https://solveitcalculator.com/og-home.png'],
  },
};

export default function HealthFitnessPage() {
  const config = getCategoryHubConfig('health-fitness');
  if (!config) return null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://solveitcalculator.com/health-fitness-calculators#collection',
        url: 'https://solveitcalculator.com/health-fitness-calculators',
        name: 'Health & Fitness Calculators',
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
          { '@type': 'ListItem', position: 2, name: 'Health & Fitness Calculators', item: 'https://solveitcalculator.com/health-fitness-calculators' },
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
