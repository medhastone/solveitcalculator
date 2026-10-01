import React from 'react';
import type { Metadata } from 'next';
import FocusAndBreakTimerClient from '../../focus-and-break-timer/FocusAndBreakTimerClient';

export const metadata: Metadata = {
  title: 'Focus & Break Timers – Pomodoro, 52/17 & Deep Work Intervals | SolveIt',
  description:
    'Boost concentration and avoid burnout with SolveIt Focus & Break Timers. Free online Pomodoro (25/5), 52/17 desk rhythm, and 90-minute deep work intervals with distraction logging and zero ads.',
  keywords: [
    'focus timer',
    'break timer',
    'focus and break timers',
    'pomodoro timer',
  ],
  alternates: {
    canonical: 'https://solveitcalculator.com/time-date/focus-and-break-timer/',
  },
};

export default function TimeDateFocusTimersPage() {
  return <FocusAndBreakTimerClient />;
}
