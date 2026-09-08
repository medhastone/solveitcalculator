import type { Metadata } from 'next';
import CategoryConverterView from '@/components/CategoryConverterView';

export const metadata: Metadata = {
  title: 'Time Converter — Seconds, Minutes, Hours, Days, Years | SolveIt',
  description: 'Convert time intervals between seconds, milliseconds, microseconds, minutes, hours, days, weeks, months, and years with astronomical precision.',
  alternates: {
    canonical: 'https://solveitcalculator.com/time-converter'
  }
};

export default function TimeConverterPage() {
  return <CategoryConverterView categoryId="time" />;
}
