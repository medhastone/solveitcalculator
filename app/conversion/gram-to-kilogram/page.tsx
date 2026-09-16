import React from 'react';
import type { Metadata } from 'next';
import GramToKilogramClient from './GramToKilogramClient';

export const metadata: Metadata = {
  title: 'Gram to Kilogram Converter (g to kg) – Instant Conversion Calculator',
  description:
    'Convert grams to kilograms instantly with our free Gram to Kilogram Converter. Enter any value in grams and get accurate kilogram conversions, formulas, conversion tables, and FAQs.',
  keywords: [
    'gram to kilogram',
    'grams to kilograms',
    'g to kg',
    'convert grams to kilograms',
    'how many kilograms in a gram',
    '100 grams to kilograms',
    '500 grams to kilograms',
    '1000 grams to kilograms',
    'gram to kilogram conversion formula',
    'metric mass converter'
  ],
  alternates: {
    canonical: 'https://solveitcalculator.com/conversion/gram-to-kilogram'
  },
  openGraph: {
    title: 'Gram to Kilogram Converter (g to kg) – Instant Conversion Calculator',
    description:
      'Convert grams to kilograms instantly with our free Gram to Kilogram Converter. Enter any value in grams and get accurate kilogram conversions, formulas, conversion tables, and FAQs.',
    url: 'https://solveitcalculator.com/conversion/gram-to-kilogram',
    siteName: 'SolveIt Calculator',
    type: 'website'
  }
};

export default function GramToKilogramPage() {
  return <GramToKilogramClient />;
}
