'use client';

import React from 'react';
import Link from 'next/link';
import { EVERYDAY_WORK_CASES } from '../conversionsData';

export default function EverydayWorkCases() {
  return (
    <section className="w-full py-14 px-4 sm:px-6 lg:px-8 bg-surface">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs uppercase font-bold tracking-wider text-primary">
            Real-Life Uses
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            Conversions for Everyday Projects
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant">
            Quick conversions designed for everyday tasks: home remodeling, road trips, kitchen baking, computer files, and DIY projects.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {EVERYDAY_WORK_CASES.map((item) => (
            <div
              key={item.title}
              className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/50 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">
                    {item.tag}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-on-surface text-lg group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed mt-1">
                    {item.description}
                  </p>
                </div>

                {/* Practical Examples */}
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-on-surface-variant block">
                    Common Conversions:
                  </span>
                  <div className="space-y-1.5">
                    {item.examples.map((ex, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded-lg bg-surface-container-low border border-outline-variant/15 flex items-center justify-between text-xs"
                      >
                        <span className="font-medium text-on-surface">
                          {ex.from} ↔ {ex.to}
                        </span>
                        <span className="font-mono text-[10px] text-on-surface-variant">
                          {ex.formula}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-outline-variant/15">
                <Link
                  href={item.primaryPath}
                  className="w-full py-2.5 px-4 rounded-xl bg-surface-container text-primary font-bold text-xs hover:bg-primary hover:text-white transition-all flex items-center justify-between group-hover:bg-primary group-hover:text-white"
                >
                  <span>Open {item.title} Tools</span>
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
