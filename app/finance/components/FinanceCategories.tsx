'use client';

import React from 'react';
import Link from 'next/link';
import { FINANCE_CATEGORIES } from '../financeData';

export default function FinanceCategories() {
  return (
    <section id="finance-categories" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-left mb-6 sm:mb-8">
        <div className="flex items-center gap-2 text-primary text-xs sm:text-sm font-bold uppercase tracking-wider mb-1">
          <span className="material-symbols-outlined text-[18px]">category</span>
          <span>Category Directory</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
          Finance Calculators by Category
        </h2>
        <p className="text-sm sm:text-base text-on-surface-variant mt-1 max-w-2xl">
          Browse our calculators organized by financial domain and decision area.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {FINANCE_CATEGORIES.map((cat) => (
          <div
            key={cat.id}
            className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs hover:border-primary/40 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-lg">{cat.icon}</span>
                </div>
                <h3 className="font-bold text-sm text-on-surface truncate">{cat.name}</h3>
              </div>

              <p className="text-xs text-on-surface-variant mb-3 leading-relaxed line-clamp-2">
                {cat.description}
              </p>

              <div className="space-y-1 mb-3">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant/70 block mb-0.5">
                  Popular in this category:
                </span>
                {cat.popularTools.slice(0, 3).map((t) => (
                  <Link
                    key={t.name}
                    href={t.path}
                    className="block text-[11px] text-on-surface hover:text-primary transition-colors truncate py-0.5"
                  >
                    • {t.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-2.5 border-t border-outline-variant/20">
              <Link
                href={cat.categoryLink}
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                <span>Explore {cat.name}</span>
                <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
