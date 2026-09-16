import GramsToTablespoonsClient from './GramsToTablespoonsClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Grams to Tablespoons Calculator | SolveIt Precision Metrology',
  description: 'Convert grams to tablespoons instantly with certified bulk density formulas for flour, sugar, butter, oil, honey, salt, and 1,000+ calibrated culinary ingredients.',
  keywords: [
    'grams to tablespoons',
    'convert grams to tablespoons',
    '15 grams to tablespoons',
    'grams to tbsp',
    'butter grams to tablespoons',
    'sugar grams to tablespoons',
    'flour grams to tablespoons',
    'tablespoon to gram conversion'
  ],
  openGraph: {
    title: 'Grams to Tablespoons Calculator & Precision Culinary Metrology',
    description: 'Convert grams to tablespoons and cook\'s fractions with USDA FoodData Central and NIST calibrated ingredient bulk densities.',
    url: 'https://solveitcalculator.com/conversion/grams-to-tablespoons',
    siteName: 'SolveIt Calculator',
    type: 'website',
  },
};

export default function GramsToTablespoonsPage() {
  return <GramsToTablespoonsClient />;
}
