import React from 'react';
import type { Metadata } from 'next';
import CategoryHubShell from '@/components/time-date/CategoryHubShell';

export const metadata: Metadata = {
  title: 'Online Timers & Stopwatch Suite | Free Preset Alarms',
  description: '1-click quick-start preset timers from 5 seconds to 2 hours, Pomodoro focus timer, and millisecond lap stopwatch with audio chime alarms.',
  alternates: {
    canonical: 'https://solveitcalculator.com/time-date/timers',
  },
};

export default function TimersCategoryPage() {
  return (
    <CategoryHubShell
      category="timers"
      title="Online Timers & Stopwatch"
      description="Clean, distraction-free timers with 1-click presets, customizable countdowns, interval timer settings, and high-precision stopwatch with lap splits."
      canonicalPath="/time-date/timers"
    />
  );
}
