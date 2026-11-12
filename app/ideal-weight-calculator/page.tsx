import type { Metadata } from 'next';
import BmiCalculator from '@/components/calculators/BmiCalculator';

export const metadata: Metadata = {
  title: 'Ideal Weight Calculator: Devine & WHO Ranges | SolveIt',
  description:
    'Compare your healthy target body weight range across the Devine, Robinson, Miller, and World Health Organization (WHO) BMI 18.5–24.9 formulas.',
  alternates: {
    canonical: 'https://solveitcalculator.com/ideal-weight-calculator',
  },
  openGraph: {
    title: 'Ideal Weight Calculator: Devine & WHO Ranges | SolveIt',
    description:
      'Compare your healthy target body weight range across the Devine, Robinson, Miller, and WHO formulas.',
    url: 'https://solveitcalculator.com/ideal-weight-calculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ideal Weight Calculator: Devine & WHO Ranges | SolveIt',
    description:
      'Compare your healthy target body weight range across the Devine, Robinson, Miller, and WHO formulas.',
  },
};

export default function IdealWeightCalculatorPage() {
  return (
    <BmiCalculator
      initialMode="ideal-weight"
      customTitle="Ideal Body Weight Calculator"
      customSubtitle="Compare your healthy target weight range across the Devine, Robinson, Miller, and World Health Organization (WHO) formulas."
      customHeroSymbol="IBW"
    />
  );
}
