import React from 'react';
import type { Metadata } from 'next';
import DsttransitiontrackerClient from './DsttransitiontrackerClient';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

export const metadata: Metadata = {
  title: 'Daylight Saving Time (DST) Transition Tracker | SolveIt',
  description: 'Anticipate DST clock changes globally. Avoid missed meetings during the desynchronized transition weeks between North America, Europe, and Australia.',
};

export default function DsttransitiontrackerPage() {
  return (
    <div className="bg-background font-body-md text-on-surface antialiased min-h-screen flex flex-col">
      <Header />
      <main className="w-full pt-[98px] bg-background flex-grow">
        <DsttransitiontrackerClient />
      </main>
      <Footer />
    </div>
  );
}
