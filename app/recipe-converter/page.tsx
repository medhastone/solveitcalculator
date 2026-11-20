import type { Metadata } from 'next';
import RecipeConverterClient from '@/components/calculators/RecipeConverterClient';
import ServerCalculatorReferenceSection from '@/components/calculator-page/ServerCalculatorReferenceSection';
import CalculatorInternalLinksBand from '@/components/calculator-page/CalculatorInternalLinksBand';

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
  twitter: {
    card: 'summary_large_image',
    title: 'Ingredient Measurement & Recipe Converter (Cups to Grams) | SolveIt',
    description: 'Convert recipe ingredients between cups, tablespoons, gallons, grams, and pounds using verified USDA densities. Includes gallon of milk weight (8.6 lbs) and oven to air fryer tables.',
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
            item: 'https://solveitcalculator.com/conversions',
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
      <ServerCalculatorReferenceSection
        title="Recipe Converter"
        formulaHeading="Ingredient Density & Scaling Formula Explanation"
        formulaExpression="Mass (g) = Volume (mL) × Ingredient Density (g/mL)  |  Scaled Quantity = Original Quantity × (Target Servings ÷ Original Servings)"
        formulaExplanation="Because dry and liquid baking ingredients have different densities, converting cups to grams requires multiplying volume in milliliters (1 US cup = 236.588 mL) by the ingredient's verified USDA or King Arthur Baking density factor rather than using water's 1:1 ratio."
        exampleHeading="Worked Recipe Conversion Example"
        exampleSummary="Example: Converting 2 US cups of all-purpose flour (120 g per cup) to grams and scaling a 12-muffin recipe up to 18 muffins."
        exampleSteps={[
          'Convert flour volume to weight: 2 cups × 120 g/cup = 240 grams of all-purpose flour.',
          'Find the batch scale factor: 18 target muffins ÷ 12 original muffins = 1.5×.',
          'Multiply every ingredient by 1.5: 240 g × 1.5 = 360 grams of flour for 18 muffins.',
        ]}
      />
      <CalculatorInternalLinksBand calculatorPath="/recipe-converter" />
    </>
  );
}
