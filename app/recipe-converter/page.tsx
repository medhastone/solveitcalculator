import type { Metadata } from 'next';
import RecipeConverterClient from '@/components/calculators/RecipeConverterClient';

export const metadata: Metadata = {
  title: 'Ingredient Measurement & Recipe Converter (Cups to Grams) | SolveIt',
  description:
    'Convert recipe ingredients between cups, tablespoons, gallons, grams, and pounds using verified USDA densities. Includes gallon of milk weight (8.6 lbs) and oven to air fryer tables.',
  alternates: {
    canonical: 'https://solveitcalculator.com/recipe-converter',
  },
  openGraph: {
    title: 'Ingredient Measurement & Recipe Converter (Cups to Grams) | SolveIt',
    description:
      'Convert recipe ingredients between cups, tablespoons, gallons, grams, and pounds using verified USDA densities. Includes gallon of milk weight (8.6 lbs) and oven to air fryer tables.',
    url: 'https://solveitcalculator.com/recipe-converter',
    type: 'website',
  },
};

export default function RecipeConverterPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Recipe Converter — Scale Servings & Convert Cups to Grams',
        url: 'https://solveitcalculator.com/recipe-converter',
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'All',
        description:
          'Interactive ingredient-aware recipe converter and batch scaler using verified USDA and King Arthur Baking ingredient density datasets.',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://solveitcalculator.com/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Unit Conversion',
            item: 'https://solveitcalculator.com/unit-conversion',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Recipe Converter',
            item: 'https://solveitcalculator.com/recipe-converter',
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <RecipeConverterClient />
    </>
  );
}
