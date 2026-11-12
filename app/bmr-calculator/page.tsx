import type { Metadata } from 'next';
import BmiCalculator from '@/components/calculators/BmiCalculator';

export const metadata: Metadata = {
  title: 'BMR Calculator: Basal Metabolic Rate at Rest | SolveIt',
  description:
    'Calculate the exact calories your body burns at complete rest using the Mifflin-St Jeor and Revised Harris-Benedict Basal Metabolic Rate (BMR) equations.',
  alternates: {
    canonical: 'https://solveitcalculator.com/bmr-calculator',
  },
  openGraph: {
    title: 'BMR Calculator: Basal Metabolic Rate at Rest | SolveIt',
    description:
      'Calculate your resting Basal Metabolic Rate (BMR) using the clinical Mifflin-St Jeor and Harris-Benedict formulas.',
    url: 'https://solveitcalculator.com/bmr-calculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BMR Calculator: Basal Metabolic Rate at Rest | SolveIt',
    description:
      'Calculate your resting Basal Metabolic Rate (BMR) using the clinical Mifflin-St Jeor and Harris-Benedict formulas.',
  },
};

export default function BmrCalculatorPage() {
  return (
    <BmiCalculator
      initialMode="bmr"
      customTitle="BMR Calculator (Basal Metabolic Rate)"
      customSubtitle="Calculate the exact calories your body burns at complete rest using the Mifflin-St Jeor and Revised Harris-Benedict equations."
      customHeroSymbol="BMR"
    />
  );
}
