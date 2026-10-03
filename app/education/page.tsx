import React from 'react';
import type { Metadata } from 'next';
import CategoryTopicHub from '@/components/CategoryTopicHub';
import { getCategoryHubConfig } from '@/lib/categoryHubConfigs';

export const metadata: Metadata = {
  title: 'Education Calculators | GPA, Honor Points & Final Grade Solvers | SolveItCalculator',
  description:
    'Free academic calculators for unweighted (4.0) and weighted (5.0) cumulative GPA, required final exam target scores, and course assignment weightings.',
  alternates: {
    canonical: 'https://solveitcalculator.com/education',
  },
  openGraph: {
    title: 'Education Calculators | SolveItCalculator',
    description:
      'Academic performance models for cumulative GPA, AP/Honors quality points, and final exam target grade solvers.',
    url: 'https://solveitcalculator.com/education',
    type: 'website',
    images: [{ url: 'https://solveitcalculator.com/og-home.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Education Calculators | SolveItCalculator',
    description: 'Calculate GPA, honor points, and final exam score requirements with academic tools.',
    images: ['https://solveitcalculator.com/og-home.png'],
  },
};

export default function EducationPage() {
  const config = getCategoryHubConfig('education');
  if (!config) return null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://solveitcalculator.com/education#collection',
        url: 'https://solveitcalculator.com/education',
        name: 'Education Calculators',
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
          { '@type': 'ListItem', position: 2, name: 'Education Calculators', item: 'https://solveitcalculator.com/education' },
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
