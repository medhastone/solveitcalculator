'use client';

import React from 'react';
import Link from 'next/link';
import { POPULAR_FINANCE_TOOLS } from '../financeData';

export default function PopularFinanceCalculators() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-left mb-6 sm:mb-8">
        <div className="flex items-center gap-2 text-primary text-xs sm:text-sm font-bold uppercase tracking-wider mb-1">
          <span className="material-symbols-outlined text-[18px]">star</span>
          <span>Frequently Used Tools</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
          Popular Finance Calculators
        </h2>
        <p className="text-sm sm:text-base text-on-surface-variant mt-1 max-w-2xl">
          Start with the tools people commonly use for everyday financial calculations.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {POPULAR_FINANCE_TOOLS.map((tool) => (
          <div
            key={tool.id}
            className="group p-4 rounded-2xl bg-surface-container-lowest hover:bg-surface-container-low border border-outline-variant/30 hover:border-primary/40 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-primary uppercase tracking-wider">
                  {tool.category}
                </span>
                <span className="material-symbols-outlined text-[20px] text-on-surface-variant group-hover:text-primary transition-colors">
                  {tool.icon}
                </span>
              </div>
              <h3 className="font-bold text-base text-on-surface group-hover:text-primary transition-colors">
                {tool.name}
              </h3>
              <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed line-clamp-3">
                {tool.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between">
              <Link
                href={tool.path}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary group-hover:translate-x-0.5 transition-transform"
              >
                <span>Calculate</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
