import React from 'react';
import type { Metadata } from 'next';
import MathCategoryPageClient from '@/components/math/MathCategoryPageClient';
import CalculatorJsonLd from '@/components/calculator-page/CalculatorJsonLd';
import { MATH_FAQS } from '@/lib/mathCalculatorsData';

export const metadata: Metadata = {
  title: 'Math Calculators — Percentages, Fractions, Ratios & Algebra | SolveItCalculator',
  description:
    'Calculate everyday percentages, percentage increases and decreases, fractions, ratios, averages, and algebraic equations with clear step-by-step explanations.',
  alternates: {
    canonical: 'https://solveitcalculator.com/math',
  },
  openGraph: {
    title: 'Math Calculators — Percentages, Fractions, Ratios & Algebra | SolveItCalculator',
    description: 'Calculate everyday percentages, percentage increases and decreases, fractions, ratios, averages, and algebraic equations with clear step-by-step explanations.',
    url: 'https://solveitcalculator.com/math',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Math Calculators — Percentages, Fractions, Ratios & Algebra | SolveItCalculator',
    description: 'Calculate everyday percentages, percentage increases and decreases, fractions, ratios, averages, and algebraic equations with clear step-by-step explanations.',
  },
};

export default function MathCategoryPage() {
  return (
    <>
      <CalculatorJsonLd
        name="Math Calculators — SolveItCalculator"
        description="Free math calculators for percentages, percentage change, fractions, ratios, averages, and scientific calculations with step-by-step explanations."
        url="https://solveitcalculator.com/math"
        category="EducationalApplication"
        breadcrumbs={[
          { name: 'Home', url: 'https://solveitcalculator.com/' },
          { name: 'Math', url: 'https://solveitcalculator.com/math' },
        ]}
        faqs={MATH_FAQS}
      />
      <MathCategoryPageClient />
    </>
  );
}
