import GramsToTablespoonsClient from '../grams-to-tablespoons/GramsToTablespoonsClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gram to Tablespoon Calculator | SolveIt Precision Metrology',
  description: 'Convert gram to tablespoon with culinary precision across pantry staples and certified densities.',
};

export default function GramToTablespoonPage() {
  return <GramsToTablespoonsClient />;
}
