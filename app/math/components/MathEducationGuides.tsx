import React from 'react';
import Link from 'next/link';
import { MATH_GUIDES } from '../mathCategoryData';

export default function MathEducationGuides() {
  return (
    <section className="w-full py-14 px-4 sm:px-6 lg:px-8 bg-surface-container-lowest border-y border-outline-variant/15">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto">
          <div className="text-xs uppercase tracking-wider font-semibold text-primary mb-1">
            Conceptual Deep Dives
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
            Learn the Math Behind the Answer
          </h2>
          <p className="text-sm sm:text-base text-on-surface-variant mt-2">
            Educational articles and walkthroughs explaining the derivations, intuition, and real-world applications of core mathematical principles.
          </p>
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {MATH_GUIDES.map((guide) => (
            <div
              key={guide.title}
              className="p-5 rounded-2xl bg-surface border border-outline-variant/25 hover:border-primary/40 hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-on-surface-variant/80 mb-2">
                  <span className="font-semibold text-primary">{guide.topic}</span>
                  <span className="text-[11px] font-mono">{guide.readTime}</span>
                </div>

                <h3 className="font-bold text-on-surface text-sm sm:text-base mb-2 line-clamp-2">
                  {guide.title}
                </h3>

                <p className="text-xs text-on-surface-variant leading-relaxed mb-4 line-clamp-3">
                  {guide.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-outline-variant/15 flex items-center justify-between text-xs">
                <span className="text-on-surface-variant/70">Tool:</span>
                <Link
                  href={guide.calculatorPath}
                  className="font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  <span>{guide.calculatorName}</span>
                  <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
