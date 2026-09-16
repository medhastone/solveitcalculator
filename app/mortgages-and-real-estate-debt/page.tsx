import { Metadata } from 'next';
import MortgagesAndRealEstateDebtClient from './MortgagesAndRealEstateDebtClient';

export const metadata: Metadata = {
  title: 'Mortgages & Real Estate Debt Calculators – SolveIt Calculator',
  description:
    'Calculate mortgage payments, PITI costs, PMI expenses, ARM scenarios, refinancing savings, affordability limits, home equity growth, and real estate financing costs with advanced, user-friendly mortgage calculators.',
  keywords: [
    'mortgage calculator',
    'PITI calculator',
    'home loan calculator',
    'refinance calculator',
    'PMI calculator',
    '15 vs 30 year mortgage',
    'ARM loan calculator',
    'home affordability calculator',
    'HELOC calculator',
    'rental property calculator',
    'amortization schedule',
  ],
  openGraph: {
    title: 'Mortgages & Real Estate Debt Calculators – SolveIt Calculator',
    description:
      'Calculate mortgage payments, PITI costs, PMI expenses, ARM scenarios, refinancing savings, affordability limits, and home equity growth with instant, verified client-side calculators.',
    type: 'website',
  },
};

export default function MortgagesAndRealEstateDebtPage() {
  return <MortgagesAndRealEstateDebtClient />;
}
