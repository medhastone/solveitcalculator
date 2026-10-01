import React from 'react';
import type { Metadata } from 'next';
import MulticitycorridorClient from './MulticitycorridorClient';

export const metadata: Metadata = {
  title: 'Multi-City Corridor Planner | Multi-City Schedules | SolveItCalculator',
  description:
    'Coordinate schedules across multiple global hubs. Align business hours, flight windows, and team availability across major international corridors.',
  alternates: {
    canonical: 'https://solveitcalculator.com/time-date/multi-city-corridor',
  },
};

export default function MulticitycorridorPage() {
  return (
    <div className="bg-background font-body-md text-on-surface antialiased min-h-screen flex flex-col">
      <main className="w-full pt-0 bg-background flex-grow">
        <MulticitycorridorClient />
      </main>
    </div>
  );
}
