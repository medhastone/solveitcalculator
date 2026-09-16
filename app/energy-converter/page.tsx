import type { Metadata } from 'next';
import CategoryConverterView from '@/components/CategoryConverterView';

export const metadata: Metadata = {
  title: 'Energy & Work Converter — Joules, Kilowatt-Hours, Calories, BTU | SolveIt Calculator',
  description: 'Convert energy and work across Joules (J), Kilowatt-hours (kWh), Calories (cal), Kilocalories (kcal), BTU, electron-volts, and foot-pounds.',
  alternates: {
    canonical: 'https://solveitcalculator.com/energy-converter'
  }
};

export default function EnergyConverterPage() {
  return <CategoryConverterView categoryId="energy" />;
}
