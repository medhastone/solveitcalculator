import React from 'react';
import { Metadata } from 'next';
import MathHubClient from './MathHubClient';

export const metadata: Metadata = {
  title: 'Math Calculators & Step-by-Step Problem Solvers | SolveIt',
  description: 'Deterministic math solvers, step-by-step formula derivations, interactive geometric visualizers, and curated exam prep suites for students, educators, and researchers. Free, private, and calculated in-browser.',
};

export default function MathPage() {
  return <MathHubClient />;
}
