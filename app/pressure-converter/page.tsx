import type { Metadata } from 'next';
import CategoryConverterView from '@/components/CategoryConverterView';

export const metadata: Metadata = {
  title: 'Pressure Converter — PSI, Bar, Pascals, kPa, Atmospheres | SolveIt',
  description: 'Convert pressure across PSI, Bar, Kilopascals (kPa), Megapascals (MPa), standard atmospheres (atm), and Torr with industrial manometer dials.',
  alternates: {
    canonical: 'https://solveitcalculator.com/pressure-converter'
  }
};

export default function PressureConverterPage() {
  return <CategoryConverterView categoryId="pressure" />;
}
