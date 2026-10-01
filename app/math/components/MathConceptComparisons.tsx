'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CONCEPT_COMPARISONS } from '../mathCategoryData';

export default function MathConceptComparisons() {
  const [selectedTopic, setSelectedTopic] = useState('All');

  const topics = ['All', 'Statistics', 'Fractions & Factors', 'Percentages', 'Geometry'];

  const filtered = selectedTopic === 'All'
    ? CONCEPT_COMPARISONS
    : CONCEPT_COMPARISONS.filter((item) => {
        if (selectedTopic === 'Statistics') return item.id.includes('mean') || item.id.includes('var') || item.id.includes('perm') || item.id.includes('prob');
        if (selectedTopic === 'Fractions & Factors') return item.id.includes('gcf') || item.id.includes('seq');
        if (selectedTopic === 'Percentages') return item.id.includes('change');
        if (selectedTopic === 'Geometry') return item.id.includes('area') || item.id.includes('radius') || item.id.includes('slope');
        return true;
      });

  return (
    <section className="w-full py-14 px-4 sm:px-6 lg:px-8 bg-surface-container-lowest border-y border-outline-variant/15">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="text-xs uppercase tracking-wider font-semibold text-primary mb-1">
            Conceptual Comparisons
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
            What&apos;s the Difference?
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-2">
            Clear, side-by-side distinctions between easily confused mathematical terms, formulas, and statistical metrics.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {topics.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setSelectedTopic(t)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedTopic === t
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'bg-surface text-on-surface hover:bg-surface-container-high border border-outline-variant/20'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Comparison Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-2xl bg-surface border border-outline-variant/30 flex flex-col justify-between shadow-xs hover:border-primary/40 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-on-surface text-base sm:text-lg">
                    {item.title}
                  </h3>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-surface-container text-primary">
                    Comparison
                  </span>
                </div>

                {/* Side-by-Side Term Definitions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 text-xs">
                    <div className="font-bold text-on-surface mb-1 text-primary">
                      {item.termA}
                    </div>
                    <p className="text-on-surface-variant leading-relaxed">
                      {item.definitionA}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 text-xs">
                    <div className="font-bold text-on-surface mb-1 text-secondary">
                      {item.termB}
                    </div>
                    <p className="text-on-surface-variant leading-relaxed">
                      {item.definitionB}
                    </p>
                  </div>
                </div>

                {/* Key Difference & Example */}
                <div className="space-y-2 text-xs text-on-surface-variant mb-4">
                  <div>
                    <span className="font-semibold text-on-surface">Key Difference: </span>
                    {item.keyDifference}
                  </div>
                  <div className="p-2.5 rounded-lg bg-surface-container-lowest font-mono text-[11px] text-on-surface border border-outline-variant/15">
                    <span className="font-bold text-primary">Example: </span>
                    {item.example}
                  </div>
                  <div>
                    <span className="font-semibold text-on-surface">When to Use: </span>
                    {item.whenToUse}
                  </div>
                </div>
              </div>

              {/* Calculator Link */}
              <div className="pt-3 border-t border-outline-variant/15 flex items-center justify-between text-xs">
                <span className="text-on-surface-variant/70 font-medium">Calculation Tool</span>
                <Link
                  href={item.calculatorPath}
                  className="font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  <span>Open {item.calculatorName}</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
