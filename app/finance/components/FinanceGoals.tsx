'use client';

import React from 'react';
import Link from 'next/link';
import { FINANCE_GOALS } from '../financeData';

export default function FinanceGoals() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-left mb-6 sm:mb-8">
        <div className="flex items-center gap-2 text-primary text-xs sm:text-sm font-bold uppercase tracking-wider mb-1">
          <span className="material-symbols-outlined text-[18px]">target</span>
          <span>Goal-Based Navigation</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
          What Are You Trying to Do With Your Money?
        </h2>
        <p className="text-sm sm:text-base text-on-surface-variant mt-1 max-w-2xl">
          Start with your financial goal instead of searching through dozens of calculators.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {FINANCE_GOALS.map((goal) => (
          <div
            key={goal.id}
            className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">{goal.icon}</span>
                </div>
                <div>
                  <h3 className="font-bold text-base text-on-surface">{goal.title}</h3>
                </div>
              </div>
              <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
                {goal.subtitle}
              </p>

              <div className="space-y-2">
                {goal.tools.map((t) => (
                  <Link
                    key={t.name}
                    href={t.path}
                    className="group block p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/20 hover:border-primary/40 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-on-surface group-hover:text-primary transition-colors">
                        {t.name}
                      </span>
                      <span className="material-symbols-outlined text-[14px] text-on-surface-variant group-hover:text-primary group-hover:translate-x-0.5 transition-transform">
                        arrow_forward
                      </span>
                    </div>
                    <p className="text-[11px] text-on-surface-variant mt-0.5 leading-snug">
                      {t.desc}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
