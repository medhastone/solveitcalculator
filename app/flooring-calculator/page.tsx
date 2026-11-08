import type { Metadata } from 'next';
import FlooringProjectCalculatorClient from '@/components/calculators/FlooringProjectCalculatorClient';

export const metadata: Metadata = {
  title: 'Estimate Your Flooring Project — Flooring Calculator | SolveItCalculator',
  description:
    'Calculate room area, estimate flooring quantity with waste allowance, and get an estimated material cost in a simple three-step guided workflow.',
};

export default function DirectFlooringCalculatorPage() {
  return <FlooringProjectCalculatorClient />;
}
