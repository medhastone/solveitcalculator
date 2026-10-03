import GramsToTablespoonsClient from '../grams-to-tablespoons/GramsToTablespoonsClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gram to Tablespoon Calculator | SolveIt Precision Metrology',
  description: 'Convert grams to tablespoons with culinary precision across pantry staples and USDA FoodData Central bulk densities.',
  alternates: {
    canonical: 'https://solveitcalculator.com/conversions/grams-to-tablespoons',
  },
};

export default function GramToTablespoonPage() {
  return <GramsToTablespoonsClient />;
}
