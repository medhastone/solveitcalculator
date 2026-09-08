import React from 'react';
import { Metadata } from 'next';
import FinanceHubClient from './FinanceHubClient';

export const metadata: Metadata = {
  title: 'Financial Calculators & Wealth Planning Hub | SolveIt',
  description: 'Deterministic financial calculators and forecasting models for debt servicing, yield curves, statutory tax brackets, early retirement, and capital preservation. Executed strictly client-side with sub-millisecond latency.',
};

export default function FinancePage() {
  return <FinanceHubClient />;
}

