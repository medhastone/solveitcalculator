import type { Metadata } from 'next';
import RestoredDateTimeCalculatorsClient from '@/components/calculators/RestoredDateTimeCalculatorsClient';

export const metadata: Metadata = {
  title: 'Time Unit Converter: Hours, Minutes & Days | SolveIt',
  description:
    'Convert hours, minutes, and seconds into decimal hours, total minutes, total seconds, and days with base-60 step-by-step formulas.',
  alternates: {
    canonical: 'https://solveitcalculator.com/time-unit-converter',
  },
  openGraph: {
    title: 'Time Unit Converter: Hours, Minutes & Days | SolveIt',
    description:
      'Convert hours, minutes, and seconds into decimal hours, total minutes, seconds, and days.',
    url: 'https://solveitcalculator.com/time-unit-converter',
    type: 'website',
  },
};

export default function TimeUnitConverterPage() {
  return <RestoredDateTimeCalculatorsClient variant="time-unit" />;
}
