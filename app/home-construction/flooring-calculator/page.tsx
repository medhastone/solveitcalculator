import type { Metadata } from 'next';
import FlooringProjectCalculatorClient from '@/components/calculators/FlooringProjectCalculatorClient';

export const metadata: Metadata = {
  title: 'Flooring & Vinyl Plank Calculator (sq ft & Boxes) | SolveIt',
  description:
    'Estimate room square footage, vinyl plank or hardwood box counts, linear feet to square feet coverage, waste allowance, and material cost in 3 steps.',
  alternates: {
    canonical: 'https://solveitcalculator.com/home-construction/flooring-calculator',
  },
  openGraph: {
    title: 'Flooring & Vinyl Plank Calculator (sq ft & Boxes) | SolveIt',
    description:
      'Estimate room square footage, vinyl plank or hardwood box counts, linear feet to square feet coverage, waste allowance, and material cost in 3 steps.',
    url: 'https://solveitcalculator.com/home-construction/flooring-calculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Flooring & Vinyl Plank Calculator (sq ft & Boxes) | SolveIt',
    description: 'Estimate room square footage, vinyl plank or hardwood box counts, linear feet to square feet coverage, waste allowance, and material cost in 3 steps.',
  },
};

export default function FlooringCalculatorPage() {
  return <FlooringProjectCalculatorClient />;
}
