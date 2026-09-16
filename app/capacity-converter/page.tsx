import React from 'react';
import type { Metadata } from 'next';
import VolumeConverterClient from '@/app/volume-converter/VolumeConverterClient';

export const metadata: Metadata = {
  title: 'Capacity Converter — Instant Volume & Fluid Calculator | SolveIt Calculator',
  description: 'Convert liters, gallons, milliliters, cups, fluid ounces, pints, quarts, cubic meters, and industrial units instantly with sub-0.01s client-side mathematical authority.',
  alternates: {
    canonical: 'https://solveitcalculator.com/capacity-converter'
  },
  openGraph: {
    title: 'Capacity Converter & Volume Calculator | SolveIt Calculator',
    description: 'Convert liters, gallons, cups, mL, pints, and cubic feet with interactive liquid simulation and instant accuracy.',
    url: 'https://solveitcalculator.com/capacity-converter',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Capacity Converter & Volume Calculator | SolveIt Calculator',
    description: 'Convert liters, gallons, cups, mL, pints, and cubic feet with interactive liquid simulation and instant accuracy.'
  }
};

export default function CapacityConverterPage() {
  return <VolumeConverterClient />;
}
