import React from 'react';
import type { Metadata } from 'next';
import AsyncteamhandoverClient from './AsyncteamhandoverClient';

export const metadata: Metadata = {
  title: 'Async Team Handover Planner | Shift Transitions | SolveItCalculator',
  description:
    'Plan asynchronous team handovers across global time zones. Map overlapping shift windows and minimize delay in cross-border handoffs.',
  alternates: {
    canonical: 'https://solveitcalculator.com/time-date/async-team-handover',
  },
};

export default function AsyncteamhandoverPage() {
  return (
    <div className="bg-background font-body-md text-on-surface antialiased min-h-screen flex flex-col">
      <main className="w-full pt-0 bg-background flex-grow">
        <AsyncteamhandoverClient />
      </main>
    </div>
  );
}
