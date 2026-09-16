import { Metadata } from 'next';
import GlobalTaxCalculatorClient from '../global-tax-calculator/GlobalTaxCalculatorClient';

export const metadata: Metadata = {
  title: 'Global Tax Calculators | SolveIt',
  description:
    'Statutory tax evaluation engines calibrated for 140+ sovereign jurisdictions. Real-time modeling for individual PAYE salary, federal & state multi-tier brackets, 1099 contractor self-employment, corporate profits, cross-border digital VAT/GST, and tiered capital asset gains.',
};

export default function TaxEnginesGlobalPage() {
  return <GlobalTaxCalculatorClient />;
}
