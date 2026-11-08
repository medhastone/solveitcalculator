import type { Metadata } from 'next';
import CategoryHubPageClient from '@/components/CategoryHubPageClient';
import { CONVERSIONS_HUB_CONFIG } from '@/app/conversions/page';

export const metadata: Metadata = {
  title: 'Unit Conversion Calculators (mm to in, kg to lbs, °C to °F) | SolveIt',
  description:
    'Convert length (mm to inches, cm to in), weight (kg to lbs, grams to oz), temperature (°C to °F), cooking volume (tbsp to cups), fuel economy, and torque.',
  alternates: {
    canonical: 'https://solveitcalculator.com/conversions',
  },
  openGraph: {
    title: 'Unit Conversion Calculators (mm to in, kg to lbs, °C to °F) | SolveIt',
    description:
      'Convert length (mm to inches, cm to in), weight (kg to lbs, grams to oz), temperature (°C to °F), cooking volume (tbsp to cups), fuel economy, and torque.',
    url: 'https://solveitcalculator.com/conversions',
    type: 'website',
  },
};

export default function UnitConversionCategoryPage() {
  return <CategoryHubPageClient config={CONVERSIONS_HUB_CONFIG} />;
}
