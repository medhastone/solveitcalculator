import type { Metadata } from 'next';
import CategoryConverterView from '@/components/CategoryConverterView';

export const metadata: Metadata = {
  title: 'Electrical Units Converter — Volts, Amps, Ohms, Watts, Coulombs | SolveIt',
  description: 'Convert electrical charge, current, potential, and resistance across Volts (V), Amperes (A), Ohms (Ω), Coulombs (C), Farads (F), and Henries (H).',
  alternates: {
    canonical: 'https://solveitcalculator.com/electrical-converter'
  }
};

export default function ElectricalConverterPage() {
  return <CategoryConverterView categoryId="electrical" />;
}
