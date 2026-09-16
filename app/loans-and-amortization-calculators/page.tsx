import { Metadata } from 'next';
import LoansAndAmortizationClient from '../loans-and-amortization/LoansAndAmortizationClient';

export const metadata: Metadata = {
  title: 'Loans & Amortization Calculators – SolveIt Calculator',
  description:
    'Calculate loan payments, monthly schedules, early payoff savings, car leases, and debt payoff timelines with instant, accurate results.',
};

export default function LoansAndAmortizationAliasPage() {
  return <LoansAndAmortizationClient />;
}
