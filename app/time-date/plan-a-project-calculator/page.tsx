import React from 'react';
import type { Metadata } from 'next';
import PlanAProjectCalculator from '../../../components/PlanAProjectCalculator';

export const metadata: Metadata = {
  title: 'Plan a Project Calculator | SolveIt',
  description: 'Plan your projects by calculating milestone deadlines, skipping weekends and bank holidays, and scheduling working days.',
};

export default function PlanAProjectCalculatorPage() {
  return (
    <div className="min-h-screen bg-surface">
      <PlanAProjectCalculator />
    </div>
  );
}
