import type { Metadata } from 'next';
import AboutMethodologyClient from '@/components/about/AboutMethodologyClient';

export const metadata: Metadata = {
  title: 'Calculation Methodology, Formulas & Change Log | SolveItCalculator',
  description:
    'Formulas, IEEE 754 rounding rules, default assumptions, category testing procedures, and visible change log for SolveItCalculator tools.',
  alternates: {
    canonical: 'https://solveitcalculator.com/calculation-methodology',
  },
  openGraph: {
    title: 'Calculation Methodology, Formulas & Change Log | SolveItCalculator',
    description:
      'Formulas, rounding rules, default assumptions, category testing procedures, and change log on SolveItCalculator.com.',
    url: 'https://solveitcalculator.com/calculation-methodology',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Calculation Methodology, Formulas & Change Log | SolveItCalculator',
    description:
      'Formulas, rounding rules, default assumptions, category testing procedures, and change log on SolveItCalculator.com.',
  },
};

export default function CalculationMethodologyPage() {
  return <AboutMethodologyClient pageVariant="methodology" />;
}
