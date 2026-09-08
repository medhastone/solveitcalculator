import React from 'react';
import type { Metadata } from 'next';
import VolumeConverterClient from '@/app/volume-converter/VolumeConverterClient';

export const metadata: Metadata = {
  title: 'Volume & Capacity Converter - Convert Gallons, Liters, Cups & Ounces | SolveIt',
  description: 'Free online volume and capacity conversion calculator. Instantly convert between gallons, liters, milliliters (mL), cups, pints, quarts, and cubic meters.',
  alternates: {
    canonical: 'https://solveitcalculator.com/volume-and-capacity-converter'
  },
  openGraph: {
    title: 'Volume & Capacity Converter - Convert Gallons, Liters, Cups & Ounces | SolveIt',
    description: 'Free online volume and capacity conversion calculator. Instantly convert between gallons, liters, milliliters (mL), cups, pints, quarts, and cubic meters.',
    url: 'https://solveitcalculator.com/volume-and-capacity-converter',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Volume & Capacity Converter - Convert Gallons, Liters, Cups & Ounces | SolveIt',
    description: 'Free online volume and capacity conversion calculator. Instantly convert between gallons, liters, milliliters (mL), cups, pints, quarts, and cubic meters.'
  }
};

export default function VolumeAndCapacityConverterPage() {
  return <VolumeConverterClient />;
}
