import type { Metadata } from 'next';
import CategoryConverterView from '@/components/CategoryConverterView';

export const metadata: Metadata = {
  title: 'Weight & Mass Converter — Kilograms, Pounds, Ounces, Grams | SolveIt',
  description: 'Convert kilograms, pounds (lbs), ounces, grams, stones, metric tonnes, short tons, and milligrams with laboratory precision.',
  alternates: {
    canonical: 'https://solveitcalculator.com/weight-mass-converter'
  }
};

export default function WeightMassConverterPage() {
  return <CategoryConverterView categoryId="weight" />;
}
