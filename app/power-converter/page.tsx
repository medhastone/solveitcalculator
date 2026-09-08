import type { Metadata } from 'next';
import CategoryConverterView from '@/components/CategoryConverterView';

export const metadata: Metadata = {
  title: 'Power Converter — Horsepower, Kilowatts, Watts, BTU/hr | SolveIt',
  description: 'Convert power ratings between mechanical horsepower (hp), metric horsepower (PS), kilowatts (kW), Watts (W), and BTU/hour with dyno readouts.',
  alternates: {
    canonical: 'https://solveitcalculator.com/power-converter'
  }
};

export default function PowerConverterPage() {
  return <CategoryConverterView categoryId="power" />;
}
