import React from 'react';
import type { Metadata } from 'next';
import AutomotiveClient from '../automotive/AutomotiveClient';

export const metadata: Metadata = {
  title: 'Automotive Calculators & Estimators | Free Vehicle Tools',
  description: 'Calculate fuel costs, mileage, car loans, vehicle expenses, depreciation, EV charging costs, and more with free automotive calculators and estimators.',
  alternates: {
    canonical: 'https://solveitcalculator.com/automotive-calculators-estimators',
  },
  openGraph: {
    title: 'Automotive Calculators & Estimators | Free Vehicle Tools',
    description: 'Calculate fuel costs, gas mileage, car loans, vehicle depreciation, EV charging expenses, and tire sizes with free automotive calculators.',
    url: 'https://solveitcalculator.com/automotive-calculators-estimators',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Automotive Calculators & Estimators | Free Vehicle Tools',
    description: 'Free automotive tools to calculate car loan payments, fuel costs, EV charging speeds, tire size changes, and total vehicle cost of ownership.',
  },
};

export default function AutomotiveCalculatorsPage() {
  return <AutomotiveClient />;
}
