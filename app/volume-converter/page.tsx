import React from 'react';
import type { Metadata } from 'next';
import VolumeConverterClient from './VolumeConverterClient';

export const metadata: Metadata = {
  title: 'Volume Converter - Convert Gallons, Liters, Cups, mL & Ounces | SolveIt',
  description: 'Free online volume converter. Easily convert gallons to liters, milliliters (mL) to cups, fluid ounces, pints, quarts, and cubic meters with exact conversion ratios.',
  alternates: {
    canonical: 'https://solveitcalculator.com/volume-converter'
  },
  openGraph: {
    title: 'Volume Converter - Convert Gallons, Liters, Cups, mL & Ounces | SolveIt',
    description: 'Free online volume converter. Easily convert gallons to liters, milliliters (mL) to cups, fluid ounces, pints, quarts, and cubic meters with exact conversion ratios.',
    url: 'https://solveitcalculator.com/volume-converter',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Volume Converter - Convert Gallons, Liters, Cups, mL & Ounces | SolveIt',
    description: 'Free online volume converter. Easily convert gallons to liters, milliliters (mL) to cups, fluid ounces, pints, quarts, and cubic meters.'
  }
};

export default function VolumeConverterPage() {
  return <VolumeConverterClient />;
}
