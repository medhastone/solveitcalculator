import React from 'react';
import type { Metadata } from 'next';
import GramsToTeaspoonsClient from '../grams-to-teaspoons/GramsToTeaspoonsClient';

export const metadata: Metadata = {
  title: 'Gram to Teaspoon Converter (g to tsp) — Precision Culinary Metrology',
  description: 'Convert gram to teaspoon measurements with USDA density datasets. Free interactive culinary mass to volume calculator for salts, leaveners, spices, sugars, and extracts.',
  alternates: {
    canonical: 'https://solveitcalculator.com/conversion/grams-to-teaspoons'
  }
};

export default function GramToTeaspoonPage() {
  return <GramsToTeaspoonsClient />;
}
