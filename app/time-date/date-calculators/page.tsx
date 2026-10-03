import React from 'react';
import type { Metadata } from 'next';
import CategoryHubShell from '@/components/time-date/CategoryHubShell';

export const metadata: Metadata = {
  title: 'Date & Calendar Calculators | Days Between Dates & Business Days',
  description: 'Calculate days between dates, working business days excluding holidays, future dates from today, and elapsed calendar intervals.',
  alternates: {
    canonical: 'https://solveitcalculator.com/time-date/date-calculators',
  },
};

export default function DateCalculatorsCategoryPage() {
  return (
    <CategoryHubShell
      category="date-calculators"
      title="Date & Calendar Calculators"
      description="Calendar-accurate calculations for days between dates, business day schedules with custom holiday filters, adding/subtracting dates, and day-of-week determinations."
      canonicalPath="/time-date/date-calculators"
    />
  );
}
