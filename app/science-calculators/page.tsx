import React from 'react';
import { Metadata } from 'next';
import ScienceClient from '../science/ScienceClient';

export const metadata: Metadata = {
  title: 'Science Calculators & Scientific Tools | SolveIt',
  description: '500+ free interactive science calculators across physics, chemistry, biology, earth science, and laboratory work.',
};

export default function ScienceCalculatorsPage() {
  return <ScienceClient />;
}
