import React from 'react';
import { Metadata } from 'next';
import TechnologyClient from '../technology/TechnologyClient';

export const metadata: Metadata = {
  title: 'Technology Calculators & Developer Tools | SolveIt',
  description: '500+ free, deterministic networking calculators, cloud cost estimators, cryptographic tools, and infrastructure sizing workbenches.',
};

export default function TechnologyCalculatorsPage() {
  return <TechnologyClient />;
}
