import type { Metadata } from 'next';
import TimeDurationPageClient from '@/components/calculators/TimeDurationPageClient';

export const metadata: Metadata = {
  title: 'Time Duration Calculator — Hours, Minutes & Decimal Payroll Hours | SolveItCalculator',
  description:
    'Calculate exact hours, minutes, and decimal hours for payroll between two clock times with automatic overnight shift rollover and break deductions.',
  alternates: {
    canonical: 'https://solveitcalculator.com/time-duration-calculator',
  },
  openGraph: {
    title: 'Time Duration Calculator — Hours, Minutes & Decimal Payroll Hours | SolveItCalculator',
    description:
      'Compute net worked hours, minutes, and decimal payroll hours between start and end times.',
    url: 'https://solveitcalculator.com/time-duration-calculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Time Duration Calculator — Hours, Minutes & Decimal Payroll Hours | SolveItCalculator',
    description:
      'Compute net worked hours, minutes, and decimal payroll hours between start and end times.',
  },
};

export default function TimeDurationCalculatorPage() {
  return <TimeDurationPageClient />;
}
