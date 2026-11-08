import type { Metadata } from 'next';
import RecipeConverterClient from '@/components/calculators/RecipeConverterClient';

export const metadata: Metadata = {
  title: 'Recipe Converters — Cups to Grams, Recipe Scaler & Cooking Units | SolveIt',
  description:
    'Convert cooking measurements, scale ingredients, and adjust recipes with simple, accurate calculations for flour, sugar, butter, milk, cups, grams, and spoons.',
  alternates: {
    canonical: 'https://solveitcalculator.com/recipe-converter',
  },
  openGraph: {
    title: 'Recipe Converters — Cups to Grams, Recipe Scaler & Cooking Units | SolveIt',
    description:
      'Convert cooking measurements, scale ingredients, and adjust recipes with simple, accurate calculations for flour, sugar, butter, milk, cups, grams, and spoons.',
    url: 'https://solveitcalculator.com/recipe-converter',
    type: 'website',
  },
};

export default function RecipeConvertersCategoryPage() {
  return <RecipeConverterClient />;
}
