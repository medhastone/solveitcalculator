import type { Metadata } from 'next';
import RetirementAndSuperClient from './RetirementAndSuperClient';

export const metadata: Metadata = {
  title: 'Retirement & Super Calculators — 401(k), Roth, RMD & FIRE | SolveItCalculator',
  description:
    'Plan your retirement with free 401(k), Roth vs. Traditional, Required Minimum Distribution (RMD), FIRE, and Safe Withdrawal Rate calculators.',
  alternates: {
    canonical: 'https://solveitcalculator.com/retirement-and-super',
  },
  openGraph: {
    title: 'Retirement & Super Calculators — 401(k), Roth, RMD & FIRE | SolveItCalculator',
    description:
      'Plan your retirement with free 401(k), Roth vs. Traditional, RMD, FIRE, and Safe Withdrawal Rate calculators.',
    url: 'https://solveitcalculator.com/retirement-and-super',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Retirement & Super Calculators — 401(k), Roth, RMD & FIRE | SolveItCalculator',
    description:
      'Plan your retirement with free 401(k), Roth vs. Traditional, RMD, FIRE, and Safe Withdrawal Rate calculators.',
  },
};

export default function RetirementAndSuperPage() {
  return <RetirementAndSuperClient />;
}
