import React from 'react';
import type { Metadata } from 'next';
import VolumeConverterClient from '@/app/volume-converter/VolumeConverterClient';

export const metadata: Metadata = {
  title: 'Volume Converter & Capacity Calculator — SolveIt',
  description: 'Convert liters, gallons, milliliters, cups, fluid ounces, pints, quarts, cubic feet, and cubic meters instantly with IEEE-754 precision.',
  alternates: {
    canonical: 'https://solveitcalculator.com/unit-converters/volume'
  },
  openGraph: {
    title: 'Volume Converter & Capacity Calculator — SolveIt',
    description: 'Convert liters, gallons, milliliters, cups, fluid ounces, pints, quarts, cubic feet, and cubic meters instantly with IEEE-754 precision.',
    url: 'https://solveitcalculator.com/unit-converters/volume',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Volume Converter & Capacity Calculator — SolveIt',
    description: 'Convert liters, gallons, milliliters, cups, fluid ounces, pints, quarts, cubic feet, and cubic meters instantly with IEEE-754 precision.'
  }
};

export default function UnitConvertersVolumePage() {
  return <VolumeConverterClient />;
}
