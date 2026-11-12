import type { Metadata } from 'next';
import RestoredDateTimeCalculatorsClient from '@/components/calculators/RestoredDateTimeCalculatorsClient';

export const metadata: Metadata = {
  title: 'Online Timer & Stopwatch: Focus Intervals | SolveIt',
  description:
    'Run a free online countdown timer with 5, 10, 15, 25 (Pomodoro), 45, and 60-minute presets for study blocks, cooking, and workouts.',
  alternates: {
    canonical: 'https://solveitcalculator.com/timer-stopwatch',
  },
  openGraph: {
    title: 'Online Timer & Stopwatch: Focus Intervals | SolveIt',
    description:
      'Run a countdown timer with Pomodoro and workout presets.',
    url: 'https://solveitcalculator.com/timer-stopwatch',
    type: 'website',
  },
};

export default function TimerStopwatchPage() {
  return <RestoredDateTimeCalculatorsClient variant="timer-stopwatch" />;
}
