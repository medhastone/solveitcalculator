import { Metadata } from 'next';
import CreditCardsAndRevolvingClient from './CreditCardsAndRevolvingClient';

export const metadata: Metadata = {
  title: 'Credit Cards & Revolving Credit Calculators – SolveIt Calculator',
  description:
    'Calculate credit card interest, payoff timelines, minimum payment costs, balance transfer savings, utilization ratios, debt reduction strategies, and revolving credit expenses with simple, free calculators.',
  keywords: [
    'credit card payoff calculator',
    'credit card interest calculator',
    'minimum payment calculator',
    'balance transfer calculator',
    '0% APR calculator',
    'credit utilization calculator',
    'APR calculator',
    'debt payoff calculator',
    'rewards calculator',
    'cash back calculator',
    'credit score impact calculator',
    'revolving credit calculator',
  ],
  openGraph: {
    title: 'Credit Cards & Revolving Credit Calculators – SolveIt Calculator',
    description:
      'Calculate credit card interest, payoff timelines, minimum payment costs, balance transfer savings, utilization ratios, debt reduction strategies, and revolving credit expenses with simple, free calculators.',
    type: 'website',
  },
};

export default function CreditCardsAndRevolvingPage() {
  return <CreditCardsAndRevolvingClient />;
}
