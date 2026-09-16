import React from 'react';
import type { Metadata } from 'next';
import GramToOuncesClient from '../gram-to-ounces/GramToOuncesClient';

export const metadata: Metadata = {
  title: 'Gram to Ounce Converter (g to oz) – Instant Conversion Calculator',
  description:
    'Convert grams to ounces instantly with our free Gram to Ounce Converter. Enter any value in grams and get accurate ounce conversions, formulas, conversion charts, and FAQs.',
  alternates: {
    canonical: 'https://solveitcalculator.com/conversion/gram-to-ounces'
  }
};

export default function GramToOuncePage() {
  return <GramToOuncesClient />;
}
