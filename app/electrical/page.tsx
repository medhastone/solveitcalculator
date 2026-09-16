import React from 'react';
import { Metadata } from 'next';
import ElectricalClient from './ElectricalClient';

export const metadata: Metadata = {
  title: 'Electrical Calculators & Sizing Tools | Free Online Tools',
  description: 'Calculate wire size, voltage drop, breaker ratings, electrical loads, power usage, solar capacity, and more with free electrical calculators and sizing tools.',
  alternates: {
    canonical: 'https://solveitcalculator.com/electrical-calculators-sizing-tools',
  },
  openGraph: {
    title: 'Electrical Calculators & Sizing Tools | Free Online Tools',
    description: 'Calculate wire size, voltage drop, breaker ratings, electrical loads, power usage, solar capacity, and more with free electrical calculators and sizing tools.',
    url: 'https://solveitcalculator.com/electrical-calculators-sizing-tools',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Electrical Calculators & Sizing Tools | Free Online Tools',
    description: 'Calculate wire size, voltage drop, breaker ratings, electrical loads, power usage, solar capacity, and more with free electrical calculators and sizing tools.',
  },
};

export default function ElectricalPage() {
  return <ElectricalClient />;
}
