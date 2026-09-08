import type { Metadata } from 'next';
import CategoryConverterView from '@/components/CategoryConverterView';

export const metadata: Metadata = {
  title: 'Area Converter — Square Feet, Meters, Acres, Hectares | SolveIt',
  description: 'Convert square feet, square meters, acres, hectares, square inches, square yards, and square kilometers with 2D blueprint plot visualizers.',
  alternates: {
    canonical: 'https://solveitcalculator.com/area-converter'
  }
};

export default function AreaConverterPage() {
  return <CategoryConverterView categoryId="area" />;
}
