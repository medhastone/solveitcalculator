import React from 'react';
import type { Metadata } from 'next';
import CategoryHubShell from '@/components/time-date/CategoryHubShell';

export const metadata: Metadata = {
  title: 'Calendar & Planetary Reference Tools | Today’s Date & Week Number',
  description: 'Live dynamic calendar tools. Check today’s date in multiple formats, current ISO week number, day of the year, days remaining in the year, and leap years.',
  alternates: {
    canonical: 'https://solveitcalculator.com/time-date/calendar',
  },
};

export default function CalendarCategoryPage() {
  return (
    <CategoryHubShell
      category="calendar"
      title="Calendar & Date Reference Tools"
      description="Live dynamic calendar resources synchronized to your local timezone. View current date formats, ISO week numbers, ordinal days of the year, leap year validators, and relative future date offsets."
      canonicalPath="/time-date/calendar"
    />
  );
}
