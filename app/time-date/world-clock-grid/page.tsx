import React from 'react';
import type { Metadata } from 'next';
import WorldclockgridClient from './WorldclockgridClient';

export const metadata: Metadata = {
  title: 'Live World Clock Grid & Global Time Converter | SolveIt',
  description: 'Track multiple global time zones in real-time. Use our interactive world clock grid to monitor business hours, UTC offsets, and prevent scheduling conflicts across international teams.',
};

export default function WorldclockgridPage() {
  return (
    <div className="bg-background font-body-md text-on-surface antialiased min-h-screen flex flex-col">
      <main className="w-full pt-16 bg-background flex-grow">
        <WorldclockgridClient />
      </main>
    </div>
  );
}
