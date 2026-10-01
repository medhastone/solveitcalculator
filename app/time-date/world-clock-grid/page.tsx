import React from 'react';
import type { Metadata } from 'next';
import WorldclockgridClient from './WorldclockgridClient';

export const metadata: Metadata = {
  title: 'Time Zone Converter | Compare Cities & Offsets | SolveItCalculator',
  description:
    'Convert times across global time zones, compare daylight saving offsets, and find overlapping hours. Plan international calls and meetings with ease.',
  alternates: {
    canonical: 'https://solveitcalculator.com/time-date/time-zone-converter',
  },
};

export default function WorldclockgridPage() {
  return (
    <div className="bg-background font-body-md text-on-surface antialiased min-h-screen flex flex-col">
      <main className="w-full pt-0 bg-background flex-grow">
        <WorldclockgridClient />
      </main>
    </div>
  );
}
