import React from 'react';
import type { Metadata } from 'next';
import HealthClient from '../health-fitness-calculators/HealthClient';

export const metadata: Metadata = {
  title: 'Health & Fitness Calculators | Evidence-Based Clinical Tools | SolveIt',
  description: 'Track body composition, athletic performance, metabolic expenditure (TDEE, BMR), cardiovascular vitals (Zone 2), hydration, circadian recovery, and maternity milestones with peer-reviewed clinical algorithms.',
  alternates: {
    canonical: 'https://solveitcalculator.com/health-fitness',
  },
};

export default function HealthFitnessPage() {
  return <HealthClient />;
}
