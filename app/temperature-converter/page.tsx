import type { Metadata } from 'next';
import CategoryConverterView from '@/components/CategoryConverterView';

export const metadata: Metadata = {
  title: 'Temperature Converter — Celsius, Fahrenheit, Kelvin, Rankine | SolveIt',
  description: 'Convert temperatures between Celsius (°C), Fahrenheit (°F), Kelvin (K), and Rankine (°R) with interactive thermodynamic visualizers.',
  alternates: {
    canonical: 'https://solveitcalculator.com/temperature-converter'
  }
};

export default function TemperatureConverterPage() {
  return <CategoryConverterView categoryId="temperature" />;
}
