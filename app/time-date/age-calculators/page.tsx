import React from 'react';
import type { Metadata } from 'next';
import CategoryHubShell from '@/components/time-date/CategoryHubShell';

export const metadata: Metadata = {
  title: 'Age & Chronological Calculators | Exact Age, Gap & Milestones',
  description: 'Calculate your exact age in years, months, and days, compare age differences between two people, and find your age on historical dates.',
  alternates: {
    canonical: 'https://solveitcalculator.com/time-date/age-calculators',
  },
};

export default function AgeCalculatorsCategoryPage() {
  return (
    <CategoryHubShell
      category="age-calculators"
      title="Age & Chronological Calculators"
      description="Exact chronological calculations with leap year accuracy. Measure age in years, months, days, total hours, compute age gaps, and discover your age on historical milestone dates."
      canonicalPath="/time-date/age-calculators"
    />
  );
}
