import React from 'react';
import type { Metadata } from 'next';
import MulticitycorridorClient from './MulticitycorridorClient';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

export const metadata: Metadata = {
  title: 'Follow The Sun Model & Multi-City Corridors | SolveIt',
  description: 'Design 24-hour continuous development cycles. Visualize multi-city handoff corridors for global software engineering teams.',
};

export default function MulticitycorridorPage() {
  return (
    <div className="bg-background font-body-md text-on-surface antialiased min-h-screen flex flex-col">
      <Header />
      <main className="w-full pt-[98px] bg-background flex-grow">
        <MulticitycorridorClient />
      </main>
      <Footer />
    </div>
  );
}
