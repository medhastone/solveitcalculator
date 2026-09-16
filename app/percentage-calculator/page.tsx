import React from 'react';
import { Metadata } from 'next';
import PercentageCalculatorClient from './PercentageCalculatorClient';

export const metadata: Metadata = {
  title: 'Universal Percentage Calculator | SolveIt Calculator Precision Engine',
  description:
    'Compute direct percentages, symmetric relative variance, compounding markups, statutory VAT/GST, and reverse discounts with step-by-step deductive proofs. 100% Client-Side IEEE 754 precision.',
  openGraph: {
    title: 'Universal Percentage Calculator | SolveIt Calculator Precision Engine',
    description:
      'Compute direct percentages, symmetric relative variance, compounding markups, statutory VAT/GST, and reverse discounts with step-by-step deductive proofs.',
    type: 'website',
  },
};

export default function PercentageCalculatorPage() {
  return <PercentageCalculatorClient />;
}
