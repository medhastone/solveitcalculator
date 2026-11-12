import type { Metadata } from 'next';
import RestoredDateTimeCalculatorsClient from '@/components/calculators/RestoredDateTimeCalculatorsClient';

export const metadata: Metadata = {
  title: 'Business Days Calculator: Working Weekdays | SolveIt',
  description:
    'Count exact Monday-through-Friday business days between two calendar dates while excluding weekends and public holidays.',
  alternates: {
    canonical: 'https://solveitcalculator.com/business-days-calculator',
  },
  openGraph: {
    title: 'Business Days Calculator: Working Weekdays | SolveIt',
    description:
      'Count exact Monday-through-Friday working days between two dates excluding weekends and holidays.',
    url: 'https://solveitcalculator.com/business-days-calculator',
    type: 'website',
  },
};

export default function BusinessDaysPage() {
  return <RestoredDateTimeCalculatorsClient variant="business-days" />;
}
