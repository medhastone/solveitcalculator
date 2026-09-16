import React from 'react';
import type { Metadata } from 'next';
import GramToOuncesClient from './GramToOuncesClient';

export const metadata: Metadata = {
  title: 'Gram to Ounces Converter (g to oz) – Instant Conversion Calculator',
  description:
    'Convert grams to ounces instantly with our free Gram to Ounces Converter. Enter any value in grams and get accurate ounce conversions, formulas, conversion charts, and FAQs.',
  keywords: [
    'gram to ounces',
    'grams to ounces',
    'g to oz',
    'convert grams to ounces',
    'how many ounces in a gram',
    '100 grams to ounces',
    '500 grams to ounces',
    'gram to ounce conversion formula',
    'avoirdupois ounce converter'
  ],
  alternates: {
    canonical: 'https://solveitcalculator.com/conversion/gram-to-ounces'
  },
  openGraph: {
    title: 'Gram to Ounces Converter (g to oz) – Instant Conversion Calculator',
    description:
      'Convert grams to ounces instantly with our free Gram to Ounces Converter. Accurate NIST SP 811 conversions, formula breakdown, and conversion tables.',
    url: 'https://solveitcalculator.com/conversion/gram-to-ounces',
    siteName: 'SolveIt Calculator',
    type: 'website'
  }
};

export default function GramToOuncesPage() {
  return <GramToOuncesClient />;
}
