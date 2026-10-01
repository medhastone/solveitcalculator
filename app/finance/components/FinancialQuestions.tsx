'use client';

import React from 'react';
import Link from 'next/link';
import { FINANCIAL_QUESTIONS } from '../financeData';

export default function FinancialQuestions() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-left mb-6 sm:mb-8">
        <div className="flex items-center gap-2 text-primary text-xs sm:text-sm font-bold uppercase tracking-wider mb-1">
          <span className="material-symbols-outlined text-[18px]">help_outline</span>
          <span>Practical Solutions</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
          Financial Questions You Can Answer With a Calculator
        </h2>
        <p className="text-sm sm:text-base text-on-surface-variant mt-1 max-w-2xl">
          Find the right calculator for the specific question on your mind.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FINANCIAL_QUESTIONS.map((item, index) => (
          <Link
            key={index}
            href={item.path}
            className="group p-4 sm:p-5 rounded-2xl bg-surface-container-lowest hover:bg-surface-container-low border border-outline-variant/30 hover:border-primary/40 shadow-xs hover:shadow-md transition-all flex items-start justify-between gap-3"
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-on-surface group-hover:text-primary transition-colors">
                  {item.question}
                </h3>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                  {item.hint}
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary mt-2">
                  <span>Use {item.toolName}</span>
                  <span className="material-symbols-outlined text-[14px] group-hover:translate-x-0.5 transition-transform">
                    arrow_forward
                  </span>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
