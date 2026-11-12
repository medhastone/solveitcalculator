import type { Metadata } from 'next';
import BmiCalculator from '@/components/calculators/BmiCalculator';

export const metadata: Metadata = {
  title: 'Body Fat Percentage Calculator: US Navy Method | SolveIt',
  description:
    'Estimate your body fat percentage, fat mass, and lean body mass from waist, neck, and hip measurements using the official U.S. Navy circumference formula.',
  alternates: {
    canonical: 'https://solveitcalculator.com/body-fat-calculator',
  },
  openGraph: {
    title: 'Body Fat Percentage Calculator: US Navy Method | SolveIt',
    description:
      'Estimate your body fat percentage, fat mass, and lean body mass using the U.S. Navy circumference method.',
    url: 'https://solveitcalculator.com/body-fat-calculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Body Fat Percentage Calculator: US Navy Method | SolveIt',
    description:
      'Estimate your body fat percentage, fat mass, and lean body mass using the U.S. Navy circumference method.',
  },
};

export default function BodyFatCalculatorPage() {
  return (
    <BmiCalculator
      initialMode="body-fat"
      customTitle="U.S. Navy Body Fat Percentage Calculator"
      customSubtitle="Estimate your body fat percentage, fat mass, and lean body mass from waist, neck, and hip measurements using the U.S. Navy formula."
      customHeroSymbol="BF%"
    />
  );
}
