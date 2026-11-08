import type { Metadata } from 'next';
import UnitConverter from '@/components/calculators/UnitConverter';

export const metadata: Metadata = {
  title: 'Millimeters to Inches Converter (mm to in) | Length | SolveIt',
  description:
    'Convert millimeters to inches (mm to in), centimeters to inches (cm to in), kilograms to pounds (kg to lbs), and Celsius to Fahrenheit (°C to °F).',
  alternates: {
    canonical: 'https://solveitcalculator.com/conversions/length',
  },
  openGraph: {
    title: 'Millimeters to Inches Converter (mm to in) | Length | SolveIt',
    description:
      'Convert millimeters to inches (mm to in), centimeters to inches (cm to in), kilograms to pounds (kg to lbs), and Celsius to Fahrenheit (°C to °F).',
    url: 'https://solveitcalculator.com/conversions/length',
    type: 'website',
    siteName: 'SolveIt Calculator',
  },
};

export default function UnitConverterPage() {
  return <UnitConverter initialCategory="length" />;
}
