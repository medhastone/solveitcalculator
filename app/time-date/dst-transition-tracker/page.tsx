import React from 'react';
import type { Metadata } from 'next';
import DsttransitiontrackerClient from './DsttransitiontrackerClient';

export const metadata: Metadata = {
  title: 'Daylight Saving Time (DST) Transition Tracker | SolveIt',
  description: 'Anticipate DST clock changes globally. Avoid missed meetings during the desynchronized transition weeks between North America, Europe, and Australia.',
};

export default function DsttransitiontrackerPage() {
  return (
    <div className="bg-background font-body-md text-on-surface antialiased min-h-screen flex flex-col">
      <main className="w-full pt-16 bg-background flex-grow">
        <DsttransitiontrackerClient />
      </main>
    </div>
  );
}
