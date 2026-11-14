import React from 'react';
import Link from 'next/link';
import { Calculator, Home, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="max-w-lg w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 text-center shadow-sm space-y-5">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
          <Calculator className="w-6 h-6" />
        </div>
        <div className="space-y-2">
          <p className="text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            404 · Page Not Found
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            We couldn&apos;t find that calculator page
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            The URL you requested may have moved to a cleaner address. Browse our calculator directory or return to the homepage below.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <Link
            href="/calculators"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-500 text-slate-800 dark:text-slate-200 text-sm font-bold transition-colors"
          >
            <span>Browse All Calculators</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
