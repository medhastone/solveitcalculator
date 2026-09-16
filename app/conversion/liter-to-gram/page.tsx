import React from 'react';
import type { Metadata } from 'next';
import LiterToGramClient from './LiterToGramClient';

export const metadata: Metadata = {
  title: 'SolveIt Calculator — Liter to Gram Converter (L to g)',
  description:
    'Convert volume in liters (L) to mass in grams (g) instantly using substance density calibration.',
  alternates: {
    canonical: 'https://solveitcalculator.com/conversion/liter-to-gram',
  },
};

export default function LiterToGramPage() {
  return <LiterToGramClient />;
}
