import React from 'react';
import type { Metadata } from 'next';
import PetAgeConverterClient from '@/app/pet-age-converter/PetAgeConverterClient';

export const metadata: Metadata = {
  title: 'Pet Age Calculator | Dog, Cat & Pet Years | SolveItCalculator',
  description:
    'Estimate a pet\'s human-age equivalent using species, size, and life-stage assumptions. Compare results for dogs, cats, and other common pets.',
  alternates: {
    canonical: 'https://solveitcalculator.com/pet-age-converter',
  },
};

export default function TimeDatePetAgeConverterPage() {
  return <PetAgeConverterClient />;
}
