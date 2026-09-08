import type { Metadata } from 'next';
import CategoryConverterView from '@/components/CategoryConverterView';

export const metadata: Metadata = {
  title: 'Fuel Economy Converter — MPG (US), L/100km, MPG (UK), km/L | SolveIt',
  description: 'Convert fuel efficiency and vehicle consumption rates across US MPG, Liters per 100km (L/100km), Imperial UK MPG, and kilometers per liter.',
  alternates: {
    canonical: 'https://solveitcalculator.com/fuel-economy-converter'
  }
};

export default function FuelEconomyConverterPage() {
  return <CategoryConverterView categoryId="fuel_economy" />;
}
