import React from 'react';
import { Metadata } from 'next';
import HomeConstructionClient from './HomeConstructionClient';

export const metadata: Metadata = {
  title: 'Home & Construction Calculators & Estimating Platform | SolveIt',
  description: 'Deterministic material estimators, structural load formulas, project cost models, and trade-grade calculators for builders, architects, and homeowners. Calculate concrete, roofing, lumber, drywall, and renovations.',
};

export default function HomeConstructionPage() {
  return <HomeConstructionClient />;
}
