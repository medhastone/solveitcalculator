import { Metadata } from 'next';
import RetirementAndSuperClient from './RetirementAndSuperClient';

export const metadata: Metadata = {
  title: 'Retirement & Super Calculators | SolveIt',
  description: 'Precision retirement planning, 401(k) matching, Australian Superannuation, pension modeling, Social Security, and FIRE decumulation with instant mathematical projections.',
};

export default function RetirementAndSuperPage() {
  return <RetirementAndSuperClient />;
}
