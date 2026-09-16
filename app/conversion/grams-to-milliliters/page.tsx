import GramsToMillilitersClient from './GramsToMillilitersClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Grams to Milliliters Calculator | SolveIt Precision Metrology',
  description: 'Convert grams to milliliters instantly with scientific accuracy using NIST and USDA FoodData Central specific gravity formulas.',
};

export default function GramsToMillilitersPage() {
  return <GramsToMillilitersClient />;
}
