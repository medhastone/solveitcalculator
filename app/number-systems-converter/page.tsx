import type { Metadata } from 'next';
import CategoryConverterView from '@/components/CategoryConverterView';

export const metadata: Metadata = {
  title: 'Number Systems Converter — Decimal, Binary, Hexadecimal, Octal | SolveIt',
  description: 'Convert numbers across Decimal (base-10), Binary (base-2), Hexadecimal (base-16), Octal (base-8), and Roman Numerals with live 8-bit registers.',
  alternates: {
    canonical: 'https://solveitcalculator.com/number-systems-converter'
  }
};

export default function NumberSystemsConverterPage() {
  return <CategoryConverterView categoryId="number_systems" />;
}
