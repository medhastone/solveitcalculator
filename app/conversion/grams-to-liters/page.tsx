import React from 'react';
import type { Metadata } from 'next';
import GramToLiterClient from '../gram-to-liter/GramToLiterClient';

export const metadata: Metadata = {
  title: 'SolveIt Calculator — Gram to Liter Converter (g to L) – Instant Conversion Calculator',
  description:
    'Convert grams to liters instantly with our free Gram to Liter Converter. Calculate accurate volume conversions based on ingredient density, formulas, conversion charts, and FAQs.',
  alternates: {
    canonical: 'https://solveitcalculator.com/conversion/gram-to-liter',
  },
};

export default function GramsToLitersPage() {
  return <GramToLiterClient />;
}

