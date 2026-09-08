import React from 'react';
import type { Metadata } from 'next';
import AsyncteamhandoverClient from './AsyncteamhandoverClient';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

export const metadata: Metadata = {
  title: 'Async Team Handover Protocol & Templates | SolveIt',
  description: 'Standardize remote work communication. Generate async handover templates and rules of engagement for zero-latency cross-timezone collaboration.',
};

export default function AsyncteamhandoverPage() {
  return (
    <div className="bg-background font-body-md text-on-surface antialiased min-h-screen flex flex-col">
      <Header />
      <main className="w-full pt-[98px] bg-background flex-grow">
        <AsyncteamhandoverClient />
      </main>
      <Footer />
    </div>
  );
}
