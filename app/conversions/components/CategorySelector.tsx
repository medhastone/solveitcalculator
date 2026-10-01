'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CATEGORY_GROUPS } from '../conversionsData';

export default function CategorySelector() {
  const [activeGroupIndex, setActiveGroupIndex] = useState<number>(0);

  return (
    <section className="w-full py-14 px-4 sm:px-6 lg:px-8 bg-surface-container-lowest border-y border-outline-variant/15">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs uppercase font-bold tracking-wider text-primary">
            Explore Categories
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            Browse Conversion Tools by Category
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant">
            Find the exact tool you need, with simple explanations, instant conversions, and helpful examples.
          </p>
        </div>

        {/* Group Tabs */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar pb-2">
          {CATEGORY_GROUPS.map((group, idx) => {
            const isActive = activeGroupIndex === idx;
            return (
              <button
                key={group.groupName}
                type="button"
                onClick={() => setActiveGroupIndex(idx)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-surface border border-outline-variant/30 text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                }`}
              >
                {group.groupName}
              </button>
            );
          })}
        </div>

        {/* Active Group Description */}
        <div className="text-center max-w-xl mx-auto">
          <p className="text-xs text-on-surface-variant font-medium">
            {CATEGORY_GROUPS[activeGroupIndex].description}
          </p>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORY_GROUPS[activeGroupIndex].categories.map((cat) => (
            <div
              key={cat.id}
              className="p-4 rounded-xl bg-surface border border-outline-variant/30 hover:border-primary/50 hover:shadow-sm transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-xl">{cat.icon}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-on-surface-variant px-2.5 py-1 rounded bg-surface-container-low">
                    {cat.unitCount} Units
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-on-surface text-lg group-hover:text-primary transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed mt-1">
                    {cat.description}
                  </p>
                </div>

                {/* Popular Examples */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-on-surface-variant">
                    Popular:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.popularExamples.map((ex) => {
                      const cleanSlug = ex
                        .replace(/[°·]/g, '')
                        .replace(/\s*→\s*/g, '-to-')
                        .replace(/\//g, '-')
                        .replace(/\s+/g, '-')
                        .toLowerCase();

                      return (
                        <Link
                          key={ex}
                          href={`/conversion/${cleanSlug}`}
                          title={`Open ${ex} converter`}
                          className="px-2 py-1 rounded-lg bg-surface-container-low hover:bg-primary/10 hover:border-primary/40 hover:text-primary text-[11px] font-mono text-on-surface border border-outline-variant/15 transition-colors inline-flex items-center gap-1"
                        >
                          <span>{ex}</span>
                          <span className="material-symbols-outlined text-[12px] opacity-0 group-hover:opacity-100 transition-opacity">
                            open_in_new
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-outline-variant/15">
                <Link
                  href={cat.path}
                  className="w-full py-2.5 px-4 rounded-xl bg-surface-container text-primary font-bold text-xs hover:bg-primary hover:text-white transition-all flex items-center justify-between group-hover:bg-primary group-hover:text-white"
                >
                  <span>Explore {cat.name.replace(' Converter', '')}</span>
                  <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

