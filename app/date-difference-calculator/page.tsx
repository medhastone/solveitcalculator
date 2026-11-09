import type { Metadata } from 'next';
import DateDifferencePageClient from '@/components/calculators/DateDifferencePageClient';

export const metadata: Metadata = {
  title: 'Date Difference Calculator — Days & Weeks Between Two Dates | SolveItCalculator',
  description:
    'Calculate the exact number of calendar days, weeks, and estimated workdays between any two dates with leap-year accuracy and optional inclusive end-date counting.',
  alternates: {
    canonical: 'https://solveitcalculator.com/date-difference-calculator',
  },
  openGraph: {
    title: 'Date Difference Calculator — Days & Weeks Between Two Dates | SolveItCalculator',
    description:
      'Find exact calendar days, weeks, and weekdays between any start date and end date.',
    url: 'https://solveitcalculator.com/date-difference-calculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Date Difference Calculator — Days & Weeks Between Two Dates | SolveItCalculator',
    description:
      'Find exact calendar days, weeks, and weekdays between any start date and end date.',
  },
};

export default function DateDifferenceCalculatorPage() {
  return <DateDifferencePageClient />;
}
