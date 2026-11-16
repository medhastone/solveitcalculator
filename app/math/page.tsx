import type { Metadata } from 'next';
import MathCategoryPageClient from '@/components/math/MathCategoryPageClient';

export const metadata: Metadata = {
  title: 'Math Calculators: Percentages, Fractions & Algebra | SolveIt',
  description:
    'Solve everyday and academic math problems with step-by-step formulas for percentages, percentage change, fractions, ratios, averages, square roots, logarithms, and algebra.',
  alternates: {
    canonical: 'https://solveitcalculator.com/math',
  },
  openGraph: {
    title: 'Math Calculators: Percentages, Fractions & Algebra | SolveIt',
    description:
      'Calculate percentages, fractions, ratios, averages, roots, and algebraic equations with step-by-step formulas.',
    url: 'https://solveitcalculator.com/math',
    type: 'website',
  },
};

const MATH_HUB_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      '@id': 'https://solveitcalculator.com/math#collection',
      url: 'https://solveitcalculator.com/math',
      name: 'Math Calculators: Percentages, Fractions & Algebra | SolveItCalculator',
      description:
        'Solve everyday and academic math problems with step-by-step formulas for percentages, percentage change, fractions, ratios, averages, square roots, logarithms, and algebra.',
      isPartOf: {
        '@id': 'https://solveitcalculator.com/#website',
      },
      dateModified: '2026-11-16',
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
          name: 'Math Calculators',
          item: 'https://solveitcalculator.com/math',
        },
      ],
    },
  ],
};

export default function MathCategoryPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(MATH_HUB_JSON_LD) }}
      />
      <MathCategoryPageClient />
    </>
  );
}
