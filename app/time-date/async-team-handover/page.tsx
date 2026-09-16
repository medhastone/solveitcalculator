import React from 'react';
import type { Metadata } from 'next';
import AsyncteamhandoverClient from './AsyncteamhandoverClient';

export const metadata: Metadata = {
  title: 'Async Team Handover Protocol & Templates | SolveIt',
  description: 'Standardize remote work communication. Generate async handover templates and rules of engagement for zero-latency cross-timezone collaboration.',
};

export default function AsyncteamhandoverPage() {
  return (
    <div className="bg-background font-body-md text-on-surface antialiased min-h-screen flex flex-col">
      <main className="w-full pt-16 bg-background flex-grow">
        <AsyncteamhandoverClient />
      </main>
    </div>
  );
}
