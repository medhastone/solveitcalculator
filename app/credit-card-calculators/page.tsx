import { Metadata } from 'next';
import CreditCardsAndRevolvingClient from '../credit-cards-and-revolving/CreditCardsAndRevolvingClient';

export const metadata: Metadata = {
  title: 'Credit Cards & Revolving Credit Calculators Directory – SolveIt Calculator',
  description:
    'Calculate credit card interest, payoff timelines, minimum payment costs, balance transfer savings, utilization ratios, debt reduction strategies, and revolving credit expenses with simple, free calculators.',
};

export default function CreditCardCalculatorsAliasPage() {
  return <CreditCardsAndRevolvingClient />;
}
