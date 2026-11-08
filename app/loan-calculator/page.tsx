import LoanCalculator from '@/components/calculators/LoanCalculator';

export const metadata = {
  title: 'Loan Calculator - Monthly Payments & Early Payoff Savings',
  description: 'Determine monthly payments, total interest, and payoff dates with extra payments for auto and personal loans.',
};

export default function LoanPage() {
  return <LoanCalculator />;
}
