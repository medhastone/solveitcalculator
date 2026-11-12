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

export default function MathCategoryPage() {
  return <MathCategoryPageClient />;
}
