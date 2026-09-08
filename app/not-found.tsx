import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const dynamic = 'force-static';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <Header />
      <main className="flex-1 flex items-center justify-center pt-24 pb-16 px-4">
        <div className="max-w-md w-full text-center p-8 rounded-3xl bg-surface-container-low border border-outline-variant/40 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-[36px]">search_off</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg font-bold mb-2">404 - Calculator Not Found</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mb-6">
            The calculator or conversion tool you requested could not be located in our directory.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-primary text-on-primary font-semibold hover:opacity-90 transition-opacity"
            >
              Explore All Calculators
            </Link>
            <Link
              href="/conversions"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors"
            >
              Conversion Center
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
