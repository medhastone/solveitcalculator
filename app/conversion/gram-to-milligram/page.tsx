import React from 'react';
import type { Metadata } from 'next';
import GramToMilligramClient from './GramToMilligramClient';

export const metadata: Metadata = {
  title: 'Gram to Milligram Converter (g to mg) – Instant Conversion Calculator',
  description:
    'Convert grams to milligrams instantly with our free Gram to Milligram Converter. Enter any value in grams and get accurate milligram conversions, formulas, conversion tables, and FAQs.',
  keywords: [
    'gram to milligram',
    'grams to milligrams',
    'g to mg',
    'convert grams to milligrams',
    'how many milligrams in a gram',
    '1 gram to mg',
    '5 grams to mg',
    '10 grams to mg',
    '100 grams to mg',
    'gram to milligram conversion formula',
    'mass and weight converter',
    'medical dosage converter'
  ],
  alternates: {
    canonical: 'https://solveit.io/conversion/gram-to-milligram'
  },
  openGraph: {
    title: 'Gram to Milligram Converter (g to mg) – Instant Conversion Calculator',
    description:
      'Convert grams to milligrams instantly with our free Gram to Milligram Converter. Enter any value in grams and get accurate milligram conversions, formulas, conversion tables, and FAQs.',
    url: 'https://solveit.io/conversion/gram-to-milligram',
    siteName: 'SolveIt Precision Metrology Core',
    type: 'website'
  }
};

export default function GramToMilligramPage() {
  return <GramToMilligramClient />;
}
