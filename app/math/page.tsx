import React from 'react';
import type { Metadata } from 'next';
import MathHubClient from './MathHubClient';
import { POPULAR_MATH_TOOLS, MATH_CATEGORIES, MATH_FAQS } from './mathCategoryData';

export const metadata: Metadata = {
  title: 'Math & Statistics Calculators & Solvers with Steps | SolveItCalculator',
  description:
    'Free math calculators for algebra, trigonometry, geometry, fractions, percentages, standard deviation, and scientific expressions. Real formulas with step-by-step proofs.',
  alternates: {
    canonical: 'https://solveitcalculator.com/math',
  },
  openGraph: {
    title: 'Math & Statistics Calculators & Step-by-Step Solvers | SolveItCalculator',
    description:
      'Exact computational math engines for quadratic equations, statistical variance, trigonometry, fractions, and percentage changes with transparent proofs.',
    url: 'https://solveitcalculator.com/math',
    type: 'website',
    images: [{ url: 'https://solveitcalculator.com/og-home.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Math & Statistics Calculators | SolveItCalculator',
    description:
      'Free math solvers for percentages, statistics, standard deviation, trigonometry, and algebra with step-by-step explanations.',
    images: ['https://solveitcalculator.com/og-home.png'],
  },
};

export default function MathPage() {
  // Flatten all tools across all 11 categories for Schema.org ItemList
  const allTools = MATH_CATEGORIES.flatMap((c) => c.tools);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://solveitcalculator.com/math#collection',
        url: 'https://solveitcalculator.com/math',
        name: 'Math & Statistics Calculators',
        description:
          'Comprehensive suite of step-by-step math problem solvers, algebraic factorization, fraction arithmetic, descriptive statistics, and formula references.',
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
          { '@type': 'ListItem', position: 2, name: 'Math & Statistics', item: 'https://solveitcalculator.com/math' },
        ],
      },
      {
        '@type': 'ItemList',
        name: 'Math & Statistics Calculators Catalog',
        numberOfItems: allTools.length,
        itemListElement: allTools.map((tool, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: tool.name,
          description: tool.desc,
          url: tool.path.startsWith('http')
            ? tool.path
            : `https://solveitcalculator.com${tool.path.startsWith('/') ? tool.path : `/${tool.path}`}`,
        })),
      },
      {
        '@type': 'FAQPage',
        mainEntity: MATH_FAQS.map((faq) => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.a,
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
      <MathHubClient />
    </>
  );
}
