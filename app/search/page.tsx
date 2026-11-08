import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import SearchResultsClient from '@/components/search/SearchResultsClient';

export const metadata: Metadata = {
  title: 'Search Calculators | SolveItCalculator',
  description:
    'Search percentage, math, finance, unit conversion, date & time, and health calculators on SolveItCalculator.com.',
};

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F5F7FA] py-16 text-center text-[#152238] font-medium">
          Loading search results...
        </div>
      }
    >
      <SearchResultsClient />
    </Suspense>
  );
}
