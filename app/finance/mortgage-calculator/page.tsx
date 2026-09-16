import React from 'react';
import { Metadata } from 'next';
import MortgageCalculatorClient from './MortgageCalculatorClient';

export const metadata: Metadata = {
  title: 'Mortgage Calculator & Amortization Workbench | SolveIt',
  description: 'Calculate exact monthly payments, multi-tier amortization, taxes, private mortgage insurance (PMI), DTI affordability, refinance thresholds, and early payoff trajectories with client-side mathematical certainty.',
};

export default function MortgageCalculatorPage() {
  return <MortgageCalculatorClient />;
}
