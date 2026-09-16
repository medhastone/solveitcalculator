import type { Metadata } from 'next';
import CategoryConverterView from '@/components/CategoryConverterView';

export const metadata: Metadata = {
  title: 'Cooking & Culinary Converter — Cups, Tablespoons, Teaspoons, mL | SolveIt Calculator',
  description: 'Convert kitchen recipe measures between US Cups, Tablespoons, Teaspoons, Fluid Ounces, Milliliters, Pints, and Quarts with recipe scaling.',
  alternates: {
    canonical: 'https://solveitcalculator.com/cooking-converter'
  }
};

export default function CookingConverterPage() {
  return <CategoryConverterView categoryId="cooking" />;
}
