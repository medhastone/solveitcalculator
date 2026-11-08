import MortgageCalculator from '@/components/calculators/MortgageCalculator';

export const metadata = {
  title: 'Mortgage Calculator - Monthly Payment & Amortization Schedule',
  description: 'Estimate monthly mortgage payments including principal, interest, taxes, insurance (PITI), and PMI.',
};

export default function MortgagePage() {
  return <MortgageCalculator />;
}
