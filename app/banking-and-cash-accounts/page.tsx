import { Metadata } from 'next';
import BankingAndCashAccountsClient from './BankingAndCashAccountsClient';

export const metadata: Metadata = {
  title: 'Banking & Cash Accounts Calculators – SolveIt Calculator',
  description:
    'Compare checking accounts, savings accounts, cash management tools, APR earnings, banking fees, overdraft costs, account yields, and cash optimization strategies with simple, free calculators.',
  keywords: [
    'banking calculators',
    'checking account calculator',
    'savings account calculator',
    'bank fee calculator',
    'overdraft APR calculator',
    'account yield calculator',
    'cash management account calculator',
    'bank interest calculator',
    'fee impact calculator',
    'cash flow calculator',
    'APR to APY calculator',
  ],
  openGraph: {
    title: 'Banking & Cash Accounts Calculators – SolveIt Calculator',
    description:
      'Compare checking accounts, savings accounts, cash management tools, APR earnings, banking fees, overdraft costs, account yields, and cash optimization strategies with simple, free calculators.',
    type: 'website',
  },
};

export default function BankingAndCashAccountsPage() {
  return <BankingAndCashAccountsClient />;
}
