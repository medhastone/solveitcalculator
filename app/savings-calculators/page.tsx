import { Metadata } from 'next';
import SavingsAndLiquidityClient from '../savings-and-liquidity/SavingsAndLiquidityClient';

export const metadata: Metadata = {
  title: 'Savings & Liquidity Calculators Directory – SolveIt Calculator',
  description:
    'Calculate savings growth, high-yield APY, emergency funds, CD returns, and cash goals with simple, free calculators.',
};

export default function SavingsCalculatorsAliasPage() {
  return <SavingsAndLiquidityClient />;
}
