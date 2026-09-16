import { Metadata } from 'next';
import LoansAndAmortizationClient from './LoansAndAmortizationClient';

export const metadata: Metadata = {
  title: 'Loans & Amortization Calculators – SolveIt Calculator',
  description:
    'Calculate loan payments, monthly schedules, early payoff savings, car leases, and debt payoff timelines with instant, accurate results verified under Truth in Lending Act standards.',
  keywords: [
    'loan calculator',
    'amortization schedule',
    'loan payment calculator',
    'EMI calculator',
    'extra payment loan calculator',
    'auto loan calculator',
    'student loan calculator',
    'car lease calculator',
    'refinance calculator',
    'debt payoff calculator',
    'biweekly loan payment',
  ],
  openGraph: {
    title: 'Loans & Amortization Calculators – SolveIt Calculator',
    description:
      'Calculate loan payments, monthly schedules, early payoff savings, car leases, and debt payoff timelines with instant, accurate results.',
    type: 'website',
  },
};

export default function LoansAndAmortizationPage() {
  return <LoansAndAmortizationClient />;
}
