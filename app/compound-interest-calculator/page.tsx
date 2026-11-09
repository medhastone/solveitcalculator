import type { Metadata } from 'next';
import CompoundInterestCalculator from '@/components/calculators/CompoundInterestCalculator';

export const metadata: Metadata = {
  title: 'Compound Interest Calculator — Investment & Savings Growth | SolveItCalculator',
  description:
    'Calculate compound investment growth with recurring monthly deposits, daily/monthly/annual compounding frequencies, and year-by-year breakdowns.',
  alternates: {
    canonical: 'https://solveitcalculator.com/compound-interest-calculator',
  },
  openGraph: {
    title: 'Compound Interest Calculator — Investment & Savings Growth | SolveItCalculator',
    description:
      'Calculate compound investment growth with regular deposits and compounding return rates.',
    url: 'https://solveitcalculator.com/compound-interest-calculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Compound Interest Calculator — Investment & Savings Growth | SolveItCalculator',
    description:
      'Calculate compound investment growth with regular deposits and compounding return rates.',
  },
};

export default function CompoundInterestPage() {
  return <CompoundInterestCalculator />;
}
