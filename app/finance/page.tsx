import React from 'react';
import { Metadata } from 'next';
import FinanceHubClient from './FinanceHubClient';

export const metadata: Metadata = {
  title: 'SolveIt Calculator - Financial Intelligence & Calculators Hub',
  description: "The world's most comprehensive and rigorous financial calculators ecosystem. Accurately model mortgages, project retirement portfolios, simulate taxes, compute daily wages, and optimize investments—engineered with zero tracking and institutional precision.",
};

export default function FinancePage() {
  return <FinanceHubClient />;
}

