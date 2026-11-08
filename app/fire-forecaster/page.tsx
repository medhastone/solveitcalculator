import React from 'react';
import type { Metadata } from 'next';
import FireForecasterClient from './FireForecasterClient';

export const metadata: Metadata = {
  title: 'FIRE Forecaster & Financial Independence Calculator | SolveItCalculator',
  description:
    'Calculate your Financial Independence (FIRE) target number, years to retirement, Lean/Regular/Fat/Coast FIRE milestones, and safe withdrawal rate trajectory.',
  alternates: {
    canonical: 'https://solveitcalculator.com/fire-forecaster',
  },
};

export default function FireForecasterPage() {
  return <FireForecasterClient />;
}
