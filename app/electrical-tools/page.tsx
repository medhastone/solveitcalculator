import React from 'react';
import { Metadata } from 'next';
import ElectricalClient from '../electrical/ElectricalClient';

export const metadata: Metadata = {
  title: 'Electrical Calculators & Engineering Tools | SolveIt',
  description: 'Easy-to-use electrical calculators, wire gauge sizing tools, transformer capacity planners, motor current estimators, solar setup designers, and circuit breaker tools.',
};

export default function ElectricalToolsPage() {
  return <ElectricalClient />;
}
