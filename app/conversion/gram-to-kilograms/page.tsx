import React from 'react';
import type { Metadata } from 'next';
import GramToKilogramClient from '../gram-to-kilogram/GramToKilogramClient';

export const metadata: Metadata = {
  title: 'Gram to Kilograms Converter (g to kg) – Instant Conversion Calculator',
  description:
    'Convert grams to kilograms instantly with our free Gram to Kilograms Converter. Enter any value in grams and get accurate kilogram conversions, formulas, conversion tables, and FAQs.',
  alternates: {
    canonical: 'https://solveitcalculator.com/conversion/gram-to-kilogram'
  }
};

export default function GramToKilogramsPage() {
  return <GramToKilogramClient />;
}
