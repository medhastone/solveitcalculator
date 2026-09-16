import { Metadata } from 'next';
import GlobalTaxCalculatorClient from './GlobalTaxCalculatorClient';

export const metadata: Metadata = {
  title: 'Global Tax Calculators | SolveIt',
  description:
    'Statutory tax evaluation engines calibrated for 140+ sovereign jurisdictions. Real-time modeling for individual PAYE salary, federal & state multi-tier brackets, 1099 contractor self-employment, corporate profits, cross-border digital VAT/GST, and tiered capital asset gains.',
  keywords: [
    'global tax calculator',
    'income tax calculator',
    'cross border tax',
    'IRS tax brackets',
    'HMRC PAYE',
    'CRA Canada tax',
    'ATO Australia tax',
    'capital gains tax',
    'self employment 1099 tax',
    'VAT calculator',
    'GST calculator',
  ],
};

export default function GlobalTaxCalculatorPage() {
  return <GlobalTaxCalculatorClient />;
}
