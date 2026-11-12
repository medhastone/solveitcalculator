import type { Metadata } from 'next';
import BmiCalculator from '@/components/calculators/BmiCalculator';

export const metadata: Metadata = {
  title: 'TDEE Calculator: Daily Calorie Burn & Macros | SolveIt',
  description:
    'Estimate your Total Daily Energy Expenditure (TDEE) and daily calorie targets for maintenance, fat loss, or lean muscle gain using the Mifflin-St Jeor formula.',
  alternates: {
    canonical: 'https://solveitcalculator.com/tdee-calculator',
  },
  openGraph: {
    title: 'TDEE Calculator: Daily Calorie Burn & Macros | SolveIt',
    description:
      'Estimate your Total Daily Energy Expenditure (TDEE) and daily calorie targets for weight loss, maintenance, or muscle gain.',
    url: 'https://solveitcalculator.com/tdee-calculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TDEE Calculator: Daily Calorie Burn & Macros | SolveIt',
    description:
      'Estimate your Total Daily Energy Expenditure (TDEE) and daily calorie targets for weight loss, maintenance, or muscle gain.',
  },
};

export default function TdeeCalculatorPage() {
  return (
    <BmiCalculator
      initialMode="tdee"
      customTitle="TDEE & Daily Calorie Calculator"
      customSubtitle="Estimate your Total Daily Energy Expenditure (TDEE) and target daily calorie intake for weight loss, maintenance, or lean muscle gain."
      customHeroSymbol="kcal"
    />
  );
}
