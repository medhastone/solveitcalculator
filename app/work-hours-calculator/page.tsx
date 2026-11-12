import type { Metadata } from 'next';
import RestoredDateTimeCalculatorsClient from '@/components/calculators/RestoredDateTimeCalculatorsClient';

export const metadata: Metadata = {
  title: 'Work Hours Calculator: Weekly Timesheet Pay | SolveIt',
  description:
    'Sum weekly work hours, separate regular and 1.5x overtime hours over 40 hours, and calculate gross weekly paycheck earnings.',
  alternates: {
    canonical: 'https://solveitcalculator.com/work-hours-calculator',
  },
  openGraph: {
    title: 'Work Hours Calculator: Weekly Timesheet Pay | SolveIt',
    description:
      'Calculate weekly timesheet hours, overtime hours, and gross hourly pay.',
    url: 'https://solveitcalculator.com/work-hours-calculator',
    type: 'website',
  },
};

export default function WorkHoursCalculatorPage() {
  return <RestoredDateTimeCalculatorsClient variant="work-hours" />;
}
