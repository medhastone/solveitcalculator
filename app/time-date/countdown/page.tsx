import React from 'react';
import type { Metadata } from 'next';
import CategoryHubShell from '@/components/time-date/CategoryHubShell';

export const metadata: Metadata = {
  title: 'Online Countdown Timers | Event, Holiday & Daily Countdowns',
  description: 'Free live countdown clocks for holidays, birthdays, weddings, project deadlines, and intra-day milestones with chime alerts and calendar export.',
  alternates: {
    canonical: 'https://solveitcalculator.com/time-date/countdown',
  },
};

export default function CountdownCategoryPage() {
  return (
    <CategoryHubShell
      category="countdown"
      title="Online Countdown Timers"
      description="Live real-time countdown timers for major holidays, life milestones, exam study deadlines, and daily clock targets. Includes Web Audio chime bells and 1-click .ics calendar export."
      canonicalPath="/time-date/countdown"
    />
  );
}
