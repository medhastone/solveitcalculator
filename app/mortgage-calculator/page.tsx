import type { Metadata } from 'next';
import MortgageCalculator from '@/components/calculators/MortgageCalculator';

export const metadata: Metadata = {
  title: 'Mortgage Calculator — Monthly PITI Payment & Amortization Schedule | SolveItCalculator',
  description:
    'Estimate monthly mortgage payments including principal, interest, property taxes, homeowners insurance (PITI), HOA, and PMI with full amortization schedule.',
  alternates: {
    canonical: 'https://solveitcalculator.com/mortgage-calculator',
  },
  openGraph: {
    title: 'Mortgage Calculator — Monthly PITI Payment & Amortization Schedule | SolveItCalculator',
    description:
      'Estimate monthly mortgage payments including principal, interest, property taxes, homeowners insurance (PITI), and PMI.',
    url: 'https://solveitcalculator.com/mortgage-calculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mortgage Calculator — Monthly PITI Payment & Amortization Schedule | SolveItCalculator',
    description:
      'Estimate monthly mortgage payments including principal, interest, property taxes, homeowners insurance (PITI), and PMI.',
  },
};

export default function MortgagePage() {
  return <MortgageCalculator />;
}
