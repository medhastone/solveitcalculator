import React from 'react';
import { Metadata } from 'next';
import EducationClient from './EducationClient';

export const metadata: Metadata = {
  title: 'Education Calculators & Academic Planning Tools | SolveIt',
  description: 'Deterministic grade estimators, weighted GPA models, final exam target solvers, attendance buffers, study schedule optimizers, and citation generators. 100% free and private.',
};

export default function EducationPage() {
  return <EducationClient />;
}
