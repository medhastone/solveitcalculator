import React from 'react';
import type { Metadata } from 'next';
import GramToPoundClient from './GramToPoundClient';

export const metadata: Metadata = {
  title: 'Gram to Pound Converter (g to lb) – Instant Conversion Calculator',
  description:
    'Convert grams to pounds instantly with our free Gram to Pound Converter. Enter any value in grams and get accurate pound conversions, formulas, conversion charts, and FAQs.',
  keywords: [
    'gram to pound',
    'grams to pounds',
    'g to lb',
    'convert grams to pounds',
    'how many pounds in a gram',
    '500 grams to pounds',
    '1000 grams to pounds',
    'gram to pound conversion formula',
    'avoirdupois pound converter'
  ],
  alternates: {
    canonical: 'https://solveitcalculator.com/conversion/gram-to-pound'
  },
  openGraph: {
    title: 'Gram to Pound Converter (g to lb) – Instant Conversion Calculator',
    description:
      'Convert grams to pounds instantly with our free Gram to Pound Converter. Accurate NIST SP 811 conversions, formula breakdown, and conversion tables.',
    url: 'https://solveitcalculator.com/conversion/gram-to-pound',
    siteName: 'SolveIt Calculator',
    type: 'website'
  }
};

export default function GramToPoundPage() {
  return <GramToPoundClient />;
}
