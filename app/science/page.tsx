import React from 'react';
import { Metadata } from 'next';
import ScienceClient from './ScienceClient';

export const metadata: Metadata = {
  title: 'Science Calculators & Scientific Tools | SolveIt',
  description: '500+ free interactive science calculators across physics, chemistry, biology, earth science, and laboratory work. 100% private, instant calculations.',
};

export default function SciencePage() {
  return <ScienceClient />;
}
