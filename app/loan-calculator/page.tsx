import type { Metadata } from 'next';
import LoanCalculator from '@/components/calculators/LoanCalculator';

export const metadata: Metadata = {
  title: 'Loan Calculator — Monthly Payments, Interest & Early Payoff | SolveItCalculator',
  description:
    'Determine monthly loan payments, total interest cost, and early payoff savings with extra principal payments for auto, personal, and business loans.',
  alternates: {
    canonical: 'https://solveitcalculator.com/loan-calculator',
  },
  openGraph: {
    title: 'Loan Calculator — Monthly Payments, Interest & Early Payoff | SolveItCalculator',
    description:
      'Determine monthly loan payments, total interest cost, and early payoff dates for auto and personal loans.',
    url: 'https://solveitcalculator.com/loan-calculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Loan Calculator — Monthly Payments, Interest & Early Payoff | SolveItCalculator',
    description:
      'Determine monthly loan payments, total interest cost, and early payoff dates for auto and personal loans.',
  },
};

export default function LoanPage() {
  return <LoanCalculator />;
}
