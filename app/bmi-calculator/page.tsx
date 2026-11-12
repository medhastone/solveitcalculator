import type { Metadata } from 'next';
import BmiCalculator from '@/components/calculators/BmiCalculator';

export const metadata: Metadata = {
  title: 'BMI Calculator: Body Mass Index & Weight Range | SolveIt',
  description:
    'Calculate your Body Mass Index (BMI) and WHO healthy weight range in Metric (kg/cm) or US Imperial (lbs/in) units with step-by-step formulas.',
  alternates: {
    canonical: 'https://solveitcalculator.com/bmi-calculator',
  },
  openGraph: {
    title: 'BMI Calculator: Body Mass Index & Weight Range | SolveIt',
    description:
      'Calculate your Body Mass Index (BMI) and WHO healthy weight range in Metric or US Imperial units.',
    url: 'https://solveitcalculator.com/bmi-calculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BMI Calculator: Body Mass Index & Weight Range | SolveIt',
    description:
      'Calculate your Body Mass Index (BMI) and WHO healthy weight range in Metric or US Imperial units.',
  },
};

export default function BmiPage() {
  return (
    <BmiCalculator
      initialMode="bmi"
      customTitle="BMI Calculator (Body Mass Index)"
      customSubtitle="Calculate your Body Mass Index (BMI) and WHO healthy weight range in Metric (kg/cm) or US Imperial (lbs/in) units."
      customHeroSymbol="BMI"
    />
  );
}
