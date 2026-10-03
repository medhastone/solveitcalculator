import React from 'react';
import type { Metadata } from 'next';
import CategoryHubShell from '@/components/time-date/CategoryHubShell';

export const metadata: Metadata = {
  title: 'Timekeeping, Payroll & Calendar Guides | SolveItCalculator',
  description: 'In-depth educational guides on leap years, Gregorian reform, military time 24-hour clocks, and decimal hours for payroll calculations.',
  alternates: {
    canonical: 'https://solveitcalculator.com/time-date/guides',
  },
};

export default function GuidesCategoryPage() {
  return (
    <CategoryHubShell
      category="guides"
      title="Time & Calendar Guides"
      description="Authoritative, step-by-step educational resources explaining the astronomical, mathematical, and regulatory standards behind modern timekeeping systems."
      canonicalPath="/time-date/guides"
    />
  );
}
