import type { Metadata } from 'next';
import BmiCalculator from '@/components/calculators/BmiCalculator';

export const metadata: Metadata = {
  title: 'BMI Calculator — Body Mass Index, TDEE & Healthy Weight Range | SolveItCalculator',
  description:
    'Calculate Body Mass Index (BMI), Basal Metabolic Rate (BMR), and Total Daily Energy Expenditure (TDEE) in Metric or US Imperial units with WHO ranges.',
  alternates: {
    canonical: 'https://solveitcalculator.com/bmi-calculator',
  },
  openGraph: {
    title: 'BMI Calculator — Body Mass Index & Healthy Weight Range | SolveItCalculator',
    description:
      'Calculate Body Mass Index (BMI), daily calorie needs, and healthy weight ranges in Metric or US units.',
    url: 'https://solveitcalculator.com/bmi-calculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BMI Calculator — Body Mass Index & Healthy Weight Range | SolveItCalculator',
    description:
      'Calculate Body Mass Index (BMI), daily calorie needs, and healthy weight ranges in Metric or US units.',
  },
};

export default function BmiPage() {
  return <BmiCalculator />;
}
