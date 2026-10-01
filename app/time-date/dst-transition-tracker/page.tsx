import React from 'react';
import type { Metadata } from 'next';
import DsttransitiontrackerClient from './DsttransitiontrackerClient';

export const metadata: Metadata = {
  title: 'DST Transition Tracker | Clock Changes & Offsets | SolveItCalculator',
  description:
    'Track upcoming daylight saving time (DST) clock changes worldwide. Review spring-forward and fall-back dates to avoid scheduling confusion.',
  alternates: {
    canonical: 'https://solveitcalculator.com/time-date/dst-transition-tracker',
  },
};

export default function DsttransitiontrackerPage() {
  return (
    <div className="bg-background font-body-md text-on-surface antialiased min-h-screen flex flex-col">
      <main className="w-full pt-0 bg-background flex-grow">
        <DsttransitiontrackerClient />
      </main>
    </div>
  );
}
