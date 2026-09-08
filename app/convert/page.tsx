'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CONVERSION_CATEGORIES } from '@/lib/conversions';
import { CANONICAL_POPULAR_PAIRS } from '@/lib/converterSlugs';

export default function ConvertDirectoryPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');

  // Filtered categories
  const filteredCategories = useMemo(() => {
    return CONVERSION_CATEGORIES.filter((cat) => {
      if (activeCategoryFilter !== 'all' && cat.id !== activeCategoryFilter) {
        return false;
      }
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      const inName = cat.name.toLowerCase().includes(q);
      const inDesc = cat.description.toLowerCase().includes(q);
      const inUnits = cat.units.some(
        (u) => u.name.toLowerCase().includes(q) || u.symbol.toLowerCase().includes(q)
      );
      return inName || inDesc || inUnits;
    });
  }, [searchQuery, activeCategoryFilter]);

  // Filtered popular pairs
  const filteredPopularPairs = useMemo(() => {
    if (!searchQuery) return CANONICAL_POPULAR_PAIRS;
    const q = searchQuery.toLowerCase();
    return CANONICAL_POPULAR_PAIRS.filter((p) => p.slug.replace(/-/g, ' ').includes(q));
  }, [searchQuery]);

  return (
    <div className="bg-[#FAF8FF] dark:bg-[#090D16] text-[#131B2E] dark:text-slate-100 min-h-screen transition-colors duration-200">
      <Header />

      <main className="pt-24 sm:pt-28 pb-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        {/* Hub Hero */}
        <section className="text-center max-w-4xl mx-auto space-y-4 pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            Solve It Calculator • Convert Anything. Instantly.
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Unit Converter &amp; Conversion Tools
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Convert length, weight, temperature, area, volume, data, speed, pressure, energy and hundreds of other measurements instantly.
          </p>

          {/* Universal Search Bar */}
          <div className="max-w-xl mx-auto relative pt-2">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversions (e.g. cm to inches, kg to lbs, celsius)..."
                className="w-full px-5 py-4 pl-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-900 dark:text-white shadow-lg shadow-slate-900/5 dark:shadow-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base font-medium"
              />
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[22px]">
                search
              </span>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold"
                >
                  CLEAR
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold">Quick:</span>
              {[
                { label: 'cm to inches', slug: 'cm-to-inches' },
                { label: 'kg to lbs', slug: 'kg-to-lbs' },
                { label: 'celsius to fahrenheit', slug: 'celsius-to-fahrenheit' },
                { label: 'meters to feet', slug: 'meters-to-feet' },
                { label: 'mph to km/h', slug: 'mph-to-kmh' }
              ].map((ex) => (
                <Link
                  key={ex.slug}
                  href={`/convert/${ex.slug}`}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600 transition-colors font-mono"
                >
                  {ex.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Conversions Grid */}
        <section className="space-y-4">
          <div className="border-b border-slate-200/80 dark:border-slate-800 pb-4 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Most Searched Pairs
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Popular Unit Converters
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-semibold">{filteredPopularPairs.length} tools</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {filteredPopularPairs.map((p) => (
              <Link
                key={p.slug}
                href={`/convert/${p.slug}`}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500 hover:shadow-md transition-all block group"
              >
                <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 capitalize">
                  {p.slug.replace(/-/g, ' ')}
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-1">
                  {p.from} → {p.to}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* All Categories Matrix */}
        <section className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Domain Directory
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Explore All 20 Conversion Categories
              </h2>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <button
                type="button"
                onClick={() => setActiveCategoryFilter('all')}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeCategoryFilter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                All
              </button>
              {CONVERSION_CATEGORIES.slice(0, 6).map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    if (c.id === 'volume') {
                      router.push('/volume-converter');
                    } else {
                      setActiveCategoryFilter(c.id);
                    }
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    activeCategoryFilter === c.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {c.name}
                  {c.id === 'volume' && ' ↗'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((cat) => (
              <div
                key={cat.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 hover:border-blue-300 dark:hover:border-blue-800 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Link
                      href={cat.id === 'volume' ? '/volume-converter' : `/${cat.id.replace(/_/g, '-')}-converter`}
                      className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center hover:scale-105 transition-transform"
                    >
                      <span className="material-symbols-outlined text-[24px]">{cat.icon}</span>
                    </Link>
                    <span className="text-xs font-semibold font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                      {cat.countLabel}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      <Link
                        href={cat.id === 'volume' ? '/volume-converter' : `/${cat.id.replace(/_/g, '-')}-converter`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {cat.name}
                      </Link>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                      {cat.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="text-xs text-slate-400">
                    <span className="font-semibold text-slate-600 dark:text-slate-300">Popular: </span>
                    <Link
                      href={`/convert/${cat.popularPair.from}-to-${cat.popularPair.to}`}
                      className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                    >
                      {cat.popularPair.label}
                    </Link>
                  </div>

                  <Link
                    href={cat.id === 'volume' ? '/volume-converter' : `/${cat.id.replace(/_/g, '-')}-converter`}
                    className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-blue-950/60 text-slate-700 dark:text-slate-300 hover:text-blue-600 font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Open {cat.name} Tool</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
