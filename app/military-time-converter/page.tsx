import type { Metadata } from 'next';
import RestoredDateTimeCalculatorsClient from '@/components/calculators/RestoredDateTimeCalculatorsClient';

export const metadata: Metadata = {
  title: 'Military Time Converter: 24-Hour & 12-Hour | SolveIt',
  description:
    'Convert between 24-hour military time (0000 to 2359 hrs) and standard 12-hour AM/PM clock formats instantly.',
  alternates: {
    canonical: 'https://solveitcalculator.com/military-time-converter',
  },
  openGraph: {
    title: 'Military Time Converter: 24-Hour & 12-Hour | SolveIt',
    description:
      'Convert between 24-hour military time and standard 12-hour AM/PM clock time.',
    url: 'https://solveitcalculator.com/military-time-converter',
    type: 'website',
  },
};

export default function MilitaryTimeConverterPage() {
  return <RestoredDateTimeCalculatorsClient variant="military-time" />;
}
