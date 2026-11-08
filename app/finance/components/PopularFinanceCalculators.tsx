'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { FINANCE_CATALOG, POPULAR_FINANCE_TOOLS } from '../financeData';

export default function PopularFinanceCalculators() {
  const [filterMode, setFilterMode] = useState<'all' | 'popular' | string>('all');

  const categories = useMemo(() => {
    return Array.from(new Set(FINANCE_CATALOG.map((t) => t.category)));
  }, []);

  const displayedTools = useMemo(() => {
    if (filterMode === 'all') {
      return FINANCE_CATALOG;
    }
    if (filterMode === 'popular') {
      return POPULAR_FINANCE_TOOLS;
    }
    return FINANCE_CATALOG.filter((t) => t.category === filterMode);
  }, [filterMode]);

  return (
    <section id="finance-calculators-directory" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
        <div className="text-left">
          <div className="flex items-center gap-2 text-primary text-xs sm:text-sm font-bold uppercase tracking-wider mb-1">
            <span className="material-symbols-outlined text-[18px]">star</span>
            <span>Finance Tools & Directory</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            Financial Calculators Directory
          </h2>
          <p className="text-sm sm:text-base text-on-surface-variant mt-1 max-w-2xl">
            Explore all 16 specialized financial calculators with instant results and transparent formulas.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center flex-wrap gap-1.5 p-1 bg-surface-container-low rounded-xl border border-outline-variant/30 text-xs font-semibold">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterMode === 'all'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            All Tools ({FINANCE_CATALOG.length})
          </button>
          <button
            onClick={() => setFilterMode('popular')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterMode === 'popular'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
          >
            Popular ({POPULAR_FINANCE_TOOLS.length})
          </button>
        </div>
      </div>

      {/* Category Quick Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-6 no-scrollbar text-xs">
        <button
          onClick={() => setFilterMode('all')}
          className={`px-3 py-1 rounded-full whitespace-nowrap border transition-colors ${
            filterMode === 'all'
              ? 'border-primary/50 bg-primary/10 text-primary font-bold'
              : 'border-outline-variant/30 text-on-surface-variant hover:text-on-surface hover:border-outline'
          }`}
        >
          All Domains
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterMode(cat)}
            className={`px-3 py-1 rounded-full whitespace-nowrap border transition-colors ${
              filterMode === cat
                ? 'border-primary/50 bg-primary/10 text-primary font-bold'
                : 'border-outline-variant/30 text-on-surface-variant hover:text-on-surface hover:border-outline'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {displayedTools.map((tool) => (
          <Link
            key={tool.id}
            href={tool.path}
            className="group p-4 rounded-2xl bg-surface-container-lowest hover:bg-surface-container-low border border-outline-variant/30 hover:border-primary/40 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-primary uppercase tracking-wider">
                  {tool.category}
                </span>
                <div className="flex items-center gap-1.5">
                  {tool.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                      {tool.badge}
                    </span>
                  )}
                  <span className="material-symbols-outlined text-[20px] text-on-surface-variant group-hover:text-primary transition-colors">
                    {tool.icon}
                  </span>
                </div>
              </div>
              <h3 className="font-bold text-base text-on-surface group-hover:text-primary transition-colors">
                {tool.name}
              </h3>
              <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed line-clamp-2">
                {tool.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary group-hover:translate-x-0.5 transition-transform">
                <span>Calculate</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
