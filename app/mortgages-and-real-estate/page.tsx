import { Metadata } from 'next';
import MortgagesAndRealEstateDebtClient from '../mortgages-and-real-estate-debt/MortgagesAndRealEstateDebtClient';

export const metadata: Metadata = {
  title: 'Mortgage & Real Estate Calculators – SolveIt Calculator',
  description:
    'Comprehensive directory of 106 mortgage, PITI, amortization, refinance, affordability, and real estate debt calculators.',
};

export default function MortgagesPage() {
  return <MortgagesAndRealEstateDebtClient />;
}
