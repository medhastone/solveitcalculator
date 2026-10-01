import React from 'react';
import type { Metadata } from 'next';
import GlobalmeetingmatrixClient from './GlobalmeetingmatrixClient';

export const metadata: Metadata = {
  title: 'Global Meeting Planner | Time Zones & Overlap | SolveItCalculator',
  description:
    'Coordinate international meetings across time zones. Visualise overlapping work hours, daylight saving changes, and green scheduling windows.',
  alternates: {
    canonical: 'https://solveitcalculator.com/time-date/global-meeting-matrix',
  },
};

export default function GlobalmeetingmatrixPage() {
  return (
    <div className="bg-background font-body-md text-on-surface antialiased min-h-screen flex flex-col">
      <main className="w-full pt-0 bg-background flex-grow">
        <GlobalmeetingmatrixClient />
      </main>
    </div>
  );
}
