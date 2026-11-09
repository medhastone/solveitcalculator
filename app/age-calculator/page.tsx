import type { Metadata } from 'next';
import AgeCalculatorPageClient from '@/components/calculators/AgeCalculatorPageClient';

export const metadata: Metadata = {
  title: 'Age Calculator — Exact Age in Years, Months, Weeks & Days | SolveItCalculator',
  description:
    'Calculate your exact chronological age in years, months, weeks, days, and hours from your date of birth to today or any past/future target date.',
  alternates: {
    canonical: 'https://solveitcalculator.com/age-calculator',
  },
  openGraph: {
    title: 'Age Calculator — Exact Age in Years, Months & Days | SolveItCalculator',
    description:
      'Find your exact age in years, months, weeks, and total calendar days with automatic leap-year and month-length adjustments.',
    url: 'https://solveitcalculator.com/age-calculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Age Calculator — Exact Age in Years, Months & Days | SolveItCalculator',
    description:
      'Find your exact age in years, months, weeks, and total calendar days with automatic leap-year adjustments.',
  },
};

export default function AgeCalculatorPage() {
  return <AgeCalculatorPageClient />;
}
