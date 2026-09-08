import type { Metadata } from 'next';
import CategoryConverterView from '@/components/CategoryConverterView';

export const metadata: Metadata = {
  title: 'Scientific & Photometry Converter — Radiation, Luminous Flux, Lux | SolveIt',
  description: 'Convert scientific and photometric units across Lumens (lm), Lux (lx), Candelas (cd), radiation Becquerel, Sieverts, and Grays with SI precision.',
  alternates: {
    canonical: 'https://solveitcalculator.com/scientific-converter'
  }
};

export default function ScientificConverterPage() {
  return <CategoryConverterView categoryId="scientific" />;
}
