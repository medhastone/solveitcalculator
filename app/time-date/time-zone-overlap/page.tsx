import React from 'react';
import type { Metadata } from 'next';
import TimeZoneOverlapClient from './TimeZoneOverlapClient';

export const metadata: Metadata = {
  title: 'Time Zone Overlap Planner | Working Hours | SolveItCalculator',
  description:
    'Find overlapping working hours across multiple locations. Compare business hours, daylight saving rules, and shift handoffs for remote teams.',
  alternates: {
    canonical: 'https://solveitcalculator.com/time-date/time-zone-overlap',
  },
};

export default function TimeZoneOverlapPage() {
  return (
    <div className="bg-background font-body-md text-on-surface antialiased min-h-screen flex flex-col">
      <main className="w-full pt-0 bg-background flex-grow">
        <TimeZoneOverlapClient />
      </main>
    </div>
  );
}
