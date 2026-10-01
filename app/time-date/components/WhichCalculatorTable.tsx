'use client';

import React from 'react';
import Link from 'next/link';
import { HelpCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { WHICH_CALCULATOR_ITEMS } from '../data/timeDateData';

export default function WhichCalculatorTable() {
  return (
    <section className="w-full bg-surface py-12 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Decision Matrix</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            Which Time &amp; Date Calculator Do I Need?
          </h2>
          <p className="text-sm sm:text-base text-on-surface-variant mt-2">
            Match your common question to the exact calculation tool designed for it.
          </p>
        </div>

        {/* Table / Cards */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 shadow-sm overflow-hidden">
          <div className="divide-y divide-outline-variant/20">
            {WHICH_CALCULATOR_ITEMS.map((item, index) => (
              <div
                key={item.question}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-surface-container-low transition-colors"
              >
                <div className="flex items-start gap-3 sm:max-w-md">
                  <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-on-surface">
                      {item.question}
                    </h3>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-surface-container text-on-surface">
                    {item.toolName}
                  </span>
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:bg-primary/90 transition-all shadow-xs"
                  >
                    <span>Calculate</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
