import type { Metadata } from 'next';
import { MATH_CALCULATORS } from '@/lib/mathCalculatorsData';
import MathToolDetailClient from '@/components/math/MathToolDetailClient';

export const metadata: Metadata = {
  title: 'Percentage Calculator | SolveItCalculator.com',
  description:
    'Calculate the percentage of a number, find percentage increase or decrease, and get clear results with step-by-step explanation.',
};

export default function PercentageCalculatorRootPage() {
  const tool =
    MATH_CALCULATORS.find((item) => item.slug === 'percentage-calculator') ||
    MATH_CALCULATORS[0];

  return <MathToolDetailClient tool={tool} />;
}
