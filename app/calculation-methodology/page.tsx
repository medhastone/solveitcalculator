import type { Metadata } from 'next';
import AboutMethodologyClient from '@/components/about/AboutMethodologyClient';

export const metadata: Metadata = {
  title: 'Calculation Methodology & Accuracy Testing | SolveItCalculator',
  description:
    'Discover how SolveItCalculator tests calculation accuracy, documents formulas and default assumptions, handles user feedback, and protects your privacy.',
  alternates: {
    canonical: 'https://solveitcalculator.com/calculation-methodology',
  },
  openGraph: {
    title: 'Calculation Methodology & Accuracy Testing | SolveItCalculator',
    description:
      'Transparent formulas, edge-case testing, editable assumptions, and clear correction policies on SolveItCalculator.com.',
    url: 'https://solveitcalculator.com/calculation-methodology',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Calculation Methodology & Accuracy Testing | SolveItCalculator',
    description:
      'Transparent formulas, edge-case testing, editable assumptions, and clear correction policies on SolveItCalculator.com.',
  },
};

export default function CalculationMethodologyPage() {
  return <AboutMethodologyClient pageVariant="methodology" />;
}
