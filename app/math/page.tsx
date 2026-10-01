import React from 'react';
import { Metadata } from 'next';
import MathHubClient from './MathHubClient';
import { MATH_FAQS, POPULAR_MATH_TOOLS } from './mathCategoryData';

export const metadata: Metadata = {
  title: 'Math Calculators & Step-by-Step Solvers | SolveItCalculator',
  description:
    'Solve math problems with free calculators for algebra, fractions, geometry, trigonometry, statistics, calculus, percentages, and more. See steps, formulas, examples, and explanations.',
  alternates: {
    canonical: 'https://solveitcalculator.com/math',
  },
  openGraph: {
    title: 'Math Calculators & Step-by-Step Problem Solvers | SolveItCalculator',
    description:
      'Solve equations, fractions, geometry, statistics, trigonometry, calculus, percentages, and everyday math with clear answers, steps, formulas, and examples.',
    url: 'https://solveitcalculator.com/math',
    siteName: 'SolveItCalculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Math Calculators & Step-by-Step Solvers | SolveItCalculator',
    description:
      'Calculate, solve, and understand math with free tools for algebra, fractions, geometry, statistics, trigonometry, calculus, and more.',
  },
};

export default function MathPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': 'https://solveitcalculator.com/math',
        url: 'https://solveitcalculator.com/math',
        name: 'Math Calculators & Step-by-Step Solvers | SolveItCalculator',
        description:
          'Solve math problems with free calculators for algebra, fractions, geometry, trigonometry, statistics, calculus, percentages, and more.',
        breadcrumb: {
          '@id': 'https://solveitcalculator.com/math#breadcrumb',
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://solveitcalculator.com/math#breadcrumb',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://solveitcalculator.com',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Math Calculators & Step-by-Step Solvers',
            item: 'https://solveitcalculator.com/math',
          },
        ],
      },
      {
        '@type': 'ItemList',
        name: 'Popular Math Tools',
        itemListElement: POPULAR_MATH_TOOLS.map((tool, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: tool.name,
          description: tool.shortDesc,
          url: `https://solveitcalculator.com${tool.path}`,
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
