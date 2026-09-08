import React from 'react';
import { Metadata } from 'next';
import TechnologyClient from './TechnologyClient';

export const metadata: Metadata = {
  title: 'Technology Calculators & Developer Tools | SolveIt',
  description: '500+ free, deterministic networking calculators, cloud cost estimators, cryptographic tools, and infrastructure sizing workbenches. Computed 100% in-browser with zero telemetry.',
};

export default function TechnologyPage() {
  return <TechnologyClient />;
}
