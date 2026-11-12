import type { Metadata } from 'next';
import RestoredDateTimeCalculatorsClient from '@/components/calculators/RestoredDateTimeCalculatorsClient';

export const metadata: Metadata = {
  title: 'Countdown Calculator: Days Until Any Event | SolveIt',
  description:
    'Count down the exact calendar days, weeks, and hours remaining until a birthday, wedding, vacation, holiday, or project deadline.',
  alternates: {
    canonical: 'https://solveitcalculator.com/countdown-calculator',
  },
  openGraph: {
    title: 'Countdown Calculator: Days Until Any Event | SolveIt',
    description:
      'Count down the exact days, weeks, and hours remaining until any upcoming event or date.',
    url: 'https://solveitcalculator.com/countdown-calculator',
    type: 'website',
  },
};

export default function CountdownCalculatorPage() {
  return <RestoredDateTimeCalculatorsClient variant="countdown" />;
}
