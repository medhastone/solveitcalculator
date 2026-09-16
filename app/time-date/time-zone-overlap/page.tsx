import React from 'react';
import type { Metadata } from 'next';
import TimeZoneOverlapClient from './TimeZoneOverlapClient';

export const metadata: Metadata = {
  title: 'Time Zone Overlap Meeting Scheduler | Global Sync & World Clock | SolveIt',
  description:
    'Find the perfect overlapping meeting window across multiple world time zones. Compare UTC/GMT offsets, visualize 24-hour business hours, and coordinate distributed remote teams without jet lag.',
};

export default function TimeZoneOverlapPage() {
  return (
    <div className="bg-background font-body-md text-on-surface antialiased min-h-screen flex flex-col">
      <main className="w-full pt-16 bg-background flex-grow">
        <TimeZoneOverlapClient />
      </main>
    </div>
  );
}
