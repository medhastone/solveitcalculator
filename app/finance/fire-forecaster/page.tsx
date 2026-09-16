import React from 'react';
import { Metadata } from 'next';
import FireForecasterClient from '../../fire-forecaster/FireForecasterClient';

export const metadata: Metadata = {
  title: 'FIRE Forecaster & Financial Independence Engine | SolveIt Calculator',
  description: 'Simulate deterministic paths to financial independence, stress-test withdrawal rates against empirical century returns, and project capital accumulation trajectories across Lean, Coast, Traditional, and Fat FIRE paradigms.',
};

export default function FinanceFireForecasterPage() {
  return <FireForecasterClient />;
}
