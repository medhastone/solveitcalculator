import type { Metadata } from 'next';
import CategoryConverterView from '@/components/CategoryConverterView';

export const metadata: Metadata = {
  title: 'Torque Converter — Newton-Meters, Pound-Feet, Pound-Inches | SolveIt',
  description: 'Convert rotational torque between Newton-meters (N·m), pound-feet (lb·ft), pound-inches, and kilogram-force meters for automotive and industrial specs.',
  alternates: {
    canonical: 'https://solveitcalculator.com/torque-converter'
  }
};

export default function TorqueConverterPage() {
  return <CategoryConverterView categoryId="torque" />;
}
