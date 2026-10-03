import React from 'react';
import type { Metadata } from 'next';
import CategoryTopicHub from '@/components/CategoryTopicHub';
import { getCategoryHubConfig } from '@/lib/categoryHubConfigs';

export const metadata: Metadata = {
  title: 'Time & Date Calculators | Age, Work Hours, Timers & Countdowns | SolveItCalculator',
  description:
    'Free time and date calculators for chronological age, timesheets, FLSA overtime, business days between dates, and Pomodoro focus timers. ISO 8601 calendar precision.',
  alternates: {
    canonical: 'https://solveitcalculator.com/time-date',
  },
  openGraph: {
    title: 'Time & Date Calculators | SolveItCalculator',
    description:
      'Chronological engines, payroll timesheets, astronomical ephemeris, and productivity countdowns.',
    url: 'https://solveitcalculator.com/time-date',
    type: 'website',
    images: [{ url: 'https://solveitcalculator.com/og-home.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Time & Date Calculators | SolveItCalculator',
    description: 'Calculate age, timesheets, days between dates, and countdowns with ISO 8601 precision.',
    images: ['https://solveitcalculator.com/og-home.png'],
  },
};

export default function TimeDatePage() {
  const config = getCategoryHubConfig('time-date');
  if (!config) return null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://solveitcalculator.com/time-date#collection',
        url: 'https://solveitcalculator.com/time-date',
        name: 'Time & Date Calculators',
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
          { '@type': 'ListItem', position: 2, name: 'Time & Date Calculators', item: 'https://solveitcalculator.com/time-date' },
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
