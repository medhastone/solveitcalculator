import React from 'react';
import type { Metadata } from 'next';
import GlobalmeetingmatrixClient from './GlobalmeetingmatrixClient';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

export const metadata: Metadata = {
  title: 'Global Meeting Matrix & Time Zone Delta Chart | SolveIt',
  description: 'Calculate exact time differences between international teams with our pairwise time delta matrix. Optimize cross-border meeting schedules and async handoffs.',
};

export default function GlobalmeetingmatrixPage() {
  return (
    <div className="bg-background font-body-md text-on-surface antialiased min-h-screen flex flex-col">
      <Header />
      <main className="w-full pt-[98px] bg-background flex-grow">
        <GlobalmeetingmatrixClient />
      </main>
      <Footer />
    </div>
  );
}
