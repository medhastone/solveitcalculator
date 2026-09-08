import type { Metadata } from 'next';
import CategoryConverterView from '@/components/CategoryConverterView';

export const metadata: Metadata = {
  title: 'Length Converter — Instant Distance & Metric Imperial Tool | SolveIt',
  description: 'Convert meters, feet, inches, centimeters, kilometers, miles, yards, millimeters, and nautical miles with certified high-precision metrology.',
  alternates: {
    canonical: 'https://solveitcalculator.com/length-converter'
  }
};

export default function LengthConverterPage() {
  return <CategoryConverterView categoryId="length" />;
}
