import React from 'react';
import type { Metadata } from 'next';
import AllCalculatorsDirectoryClient from '@/components/directory/AllCalculatorsDirectoryClient';

export const metadata: Metadata = {
  title: 'All Calculators Directory | SolveItCalculator',
  description:
    'Browse all available calculators grouped by Math, Finance, Unit Conversion, Date and Time, Health and Fitness, Home and Construction, Business, and Science.',
};

export default function AllCalculatorsAliasPage() {
  return <AllCalculatorsDirectoryClient />;
}
