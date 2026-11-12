import type { Metadata } from 'next';
import RestoredDateTimeCalculatorsClient from '@/components/calculators/RestoredDateTimeCalculatorsClient';

export const metadata: Metadata = {
  title: 'Days From Today Calculator: Add or Subtract | SolveIt',
  description:
    'Add or subtract days and weeks from today or any calendar date to find the exact future or past date, automatically accounting for month lengths and leap years.',
  alternates: {
    canonical: 'https://solveitcalculator.com/days-from-today-calculator',
  },
  openGraph: {
    title: 'Days From Today Calculator: Add or Subtract | SolveIt',
    description:
      'Add or subtract days and weeks from any calendar date with automatic leap-year handling.',
    url: 'https://solveitcalculator.com/days-from-today-calculator',
    type: 'website',
  },
};

export default function DaysFromTodayPage() {
  return <RestoredDateTimeCalculatorsClient variant="days-from-today" />;
}
