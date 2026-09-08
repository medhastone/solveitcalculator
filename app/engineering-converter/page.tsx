import type { Metadata } from 'next';
import CategoryConverterView from '@/components/CategoryConverterView';

export const metadata: Metadata = {
  title: 'Engineering Units Converter — Mechanics, Stress, Viscosity, Flow | SolveIt',
  description: 'Convert engineering and mechanics units across dynamic viscosity, kinematic viscosity, material stress, thermal conductivity, and volumetric flow.',
  alternates: {
    canonical: 'https://solveitcalculator.com/engineering-converter'
  }
};

export default function EngineeringConverterPage() {
  return <CategoryConverterView categoryId="engineering" />;
}
