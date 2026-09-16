import React from 'react';
import type { Metadata } from 'next';
import GramToCupClient from './GramToCupClient';

export const metadata: Metadata = {
  title: 'Gram to Cups Converter (g to cups) – Instant Conversion Calculator',
  description:
    'Deterministic culinary metrology tool converting grams (g) to US customary, legal, and metric cups calibrated with USDA FoodData Central ingredient bulk densities.',
  keywords: [
    'gram to cup',
    'grams to cups',
    'g to cups',
    'convert grams to cups',
    'grams to cups flour',
    'grams to cups sugar',
    'grams to cups butter',
    'culinary mass to volume converter',
    'ingredient density conversion',
  ],
  alternates: {
    canonical: 'https://solveitcalculator.com/conversion/gram-to-cup',
  },
  openGraph: {
    title: 'Gram to Cups Converter (g to cups) – Instant Conversion Calculator',
    description:
      'Deterministic culinary metrology tool converting grams (g) to US customary, legal, and metric cups calibrated with USDA FoodData Central ingredient bulk densities.',
    url: 'https://solveitcalculator.com/conversion/gram-to-cup',
    type: 'website',
  },
};

export default function GramToCupPage() {
  return <GramToCupClient />;
}
