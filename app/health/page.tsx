import React from 'react';
import type { Metadata } from 'next';
import HealthClient from './HealthClient';

export const metadata: Metadata = {
  title: 'Health & Fitness Calculators | Evidence-Based Clinical Tools | SolveIt',
  description: 'Track body composition, athletic performance, metabolic expenditure (TDEE, BMR), cardiovascular vitals (Zone 2), hydration, circadian recovery, and maternity milestones with peer-reviewed clinical algorithms.',
  alternates: {
    canonical: 'https://solveitcalculator.com/health',
  },
  openGraph: {
    title: 'Health & Fitness Calculators | Evidence-Based Clinical Tools | SolveIt',
    description: 'Track body composition, metabolic expenditure, cardiovascular health, hydration, circadian recovery, and maternity milestones with peer-reviewed clinical algorithms.',
    url: 'https://solveitcalculator.com/health',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Health & Fitness Calculators | Evidence-Based Clinical Tools | SolveIt',
    description: 'Track body composition, metabolic expenditure, cardiovascular health, hydration, circadian recovery, and maternity milestones with peer-reviewed clinical algorithms.',
  },
};

export default function HealthPage() {
  return <HealthClient />;
}
