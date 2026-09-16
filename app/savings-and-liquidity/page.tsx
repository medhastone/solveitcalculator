import { Metadata } from 'next';
import SavingsAndLiquidityClient from './SavingsAndLiquidityClient';

export const metadata: Metadata = {
  title: 'Savings & Liquidity Calculators – SolveIt Calculator',
  description:
    'Calculate savings growth, high-yield APY, emergency funds, CD returns, and cash goals with simple, free calculators.',
  keywords: [
    'savings calculator',
    'APY calculator',
    'high yield savings account calculator',
    'CD ladder calculator',
    'emergency fund calculator',
    'cash runway calculator',
    'liquidity ratio calculator',
    'sinking fund calculator',
    'savings goal calculator',
    'compound interest calculator',
  ],
  openGraph: {
    title: 'Savings & Liquidity Calculators – SolveIt Calculator',
    description:
      'Calculate savings growth, high-yield APY, emergency funds, CD returns, and cash goals with simple, free calculators.',
    type: 'website',
  },
};

export default function SavingsAndLiquidityPage() {
  return <SavingsAndLiquidityClient />;
}
