import { Metadata } from 'next';
import BankingAndCashAccountsClient from '../banking-and-cash-accounts/BankingAndCashAccountsClient';

export const metadata: Metadata = {
  title: 'Banking & Cash Accounts Calculators Directory – SolveIt Calculator',
  description:
    'Compare checking accounts, savings accounts, cash management tools, APR earnings, banking fees, overdraft costs, account yields, and cash optimization strategies with simple, free calculators.',
};

export default function BankingCalculatorsAliasPage() {
  return <BankingAndCashAccountsClient />;
}
