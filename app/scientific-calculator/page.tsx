import React from 'react';
import { Metadata } from 'next';
import ScientificCalculatorClient from './ScientificCalculatorClient';

export const metadata: Metadata = {
  title: 'Scientific Calculator & Equation Solver | SolveIt Calculator Mathematical Workbench',
  description:
    'High-precision client-side scientific calculator with arbitrary-precision trigonometric routines, logarithms, factorials, permutations, unit circle visualizer, and live LaTeX typesetting. IEEE 754 precision.',
  openGraph: {
    title: 'Scientific Calculator & Equation Solver | SolveIt Calculator Mathematical Workbench',
    description:
      'High-precision client-side scientific calculator with arbitrary-precision trigonometric routines, logarithms, factorials, permutations, unit circle visualizer, and live LaTeX typesetting.',
    type: 'website',
  },
};

export default function ScientificCalculatorPage() {
  return <ScientificCalculatorClient />;
}
