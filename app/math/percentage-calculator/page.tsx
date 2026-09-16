import React from 'react';
import { Metadata } from 'next';
import PercentageCalculatorClient from '../../percentage-calculator/PercentageCalculatorClient';

export const metadata: Metadata = {
  title: 'Universal Percentage Calculator | SolveIt Calculator Math Engine',
  description:
    'Compute percentages, symmetric relative variance, compounding markups, statutory VAT/GST, and reverse discounts with step-by-step deductive proofs.',
};

export default function MathPercentageCalculatorPage() {
  return <PercentageCalculatorClient />;
}
