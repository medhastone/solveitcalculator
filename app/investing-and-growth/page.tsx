import { Metadata } from 'next';
import InvestingAndGrowthClient from './InvestingAndGrowthClient';

export const metadata: Metadata = {
  title: 'Investing & Growth Calculators | SolveIt Calculator',
  description: 'Precision wealth projection, compound interest, CAGR, dividends, FIRE modeling, and dynamic portfolio analytics.',
};

export default function InvestingAndGrowthPage() {
  return <InvestingAndGrowthClient />;
}
