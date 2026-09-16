import React from 'react';
import type { Metadata } from 'next';
import GramToPoundClient from '../gram-to-pound/GramToPoundClient';

export const metadata: Metadata = {
  title: 'Grams to Pounds Converter (g to lb) – Instant Conversion Calculator',
  description:
    'Convert grams to pounds instantly with our free Grams to Pounds Converter. Enter any value in grams and get accurate pound conversions, formulas, conversion charts, and FAQs.',
  alternates: {
    canonical: 'https://solveitcalculator.com/conversion/gram-to-pound'
  }
};

export default function GramsToPoundsPage() {
  return <GramToPoundClient />;
}
