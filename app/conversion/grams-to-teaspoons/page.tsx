import React from 'react';
import type { Metadata } from 'next';
import GramsToTeaspoonsClient from './GramsToTeaspoonsClient';

export const metadata: Metadata = {
  title: 'Grams to Teaspoons Calculator (g to tsp) — Precision Culinary Metrology',
  description: 'Convert grams to teaspoons instantly with high accuracy. Calibrated for fine table salt, kosher salt, baking powder, baking soda, dry yeast, spices, sugar, vanilla extract, and supplements with USDA density datasets.',
  keywords: [
    'grams to teaspoons',
    'g to tsp',
    'convert grams to teaspoons',
    'teaspoons to grams',
    'grams to tsp salt',
    'grams to tsp baking powder',
    'grams to tsp yeast',
    'grams to tsp sugar',
    'culinary grams to teaspoons calculator',
    'how many teaspoons in 5 grams'
  ],
  alternates: {
    canonical: 'https://solveitcalculator.com/conversion/grams-to-teaspoons'
  }
};

export default function GramsToTeaspoonsPage() {
  return <GramsToTeaspoonsClient />;
}
