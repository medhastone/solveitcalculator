import React from 'react';
import type { Metadata } from 'next';
import GramToKilogramClient from '../gram-to-kilogram/GramToKilogramClient';

export const metadata: Metadata = {
  title: 'Grams to Kilogram Converter (g to kg) – Instant Conversion Calculator',
  description:
    'Convert grams to kilograms instantly with our free Grams to Kilogram Converter. Enter any value in grams and get accurate kilogram conversions, formulas, conversion tables, and FAQs.',
  alternates: {
    canonical: 'https://solveitcalculator.com/conversion/gram-to-kilogram'
  }
};

export default function GramsToKilogramPage() {
  return <GramToKilogramClient />;
}
