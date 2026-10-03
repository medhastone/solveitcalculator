import React from 'react';
import type { Metadata } from 'next';
import CategoryTopicHub from '@/components/CategoryTopicHub';
import { getCategoryHubConfig } from '@/lib/categoryHubConfigs';

export const metadata: Metadata = {
  title: 'Finance Calculators | Easy Loans, Mortgages, Investing & Taxes | SolveItCalculator',
  description:
    'Free and easy finance calculators for home mortgages, loan payments, compound interest, retirement targets, income taxes, and debt payoff with clear step-by-step results.',
  alternates: {
    canonical: 'https://solveitcalculator.com/finance',
  },
  openGraph: {
    title: 'Finance Calculators | Easy Loans, Mortgages, Investing & Taxes | SolveItCalculator',
    description:
      'Simple, accurate financial calculators for mortgage payments, compound interest growth, retirement planning, loans, and income taxes.',
    url: 'https://solveitcalculator.com/finance',
    type: 'website',
    images: [{ url: 'https://solveitcalculator.com/og-home.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Finance Calculators | SolveItCalculator',
    description: 'Free finance calculators for mortgages, investments, retirement, taxes, and loans.',
    images: ['https://solveitcalculator.com/og-home.png'],
  },
};

export default function FinancePage() {
  const config = getCategoryHubConfig('finance');
  if (!config) return null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://solveitcalculator.com/finance#collection',
        url: 'https://solveitcalculator.com/finance',
        name: 'Finance Calculators',
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
          { '@type': 'ListItem', position: 2, name: 'Finance Calculators', item: 'https://solveitcalculator.com/finance' },
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
