'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { QUICK_ANSWER_EXAMPLES } from '../mathCategoryData';

export default function QuickMathAnswers() {
  const [expandedId, setExpandedId] = useState<string | null>('percent-example');

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="quick-answers" className="w-full py-14 px-4 sm:px-6 lg:px-8 bg-surface">
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="text-xs uppercase tracking-wider font-semibold text-primary mb-1">
            Worked Calculations
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
            Quick Math Answers
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-2">
            See immediate answers to common math questions and explore the transparent 5-step solution process behind each calculation.
          </p>
        </div>

        <div className="space-y-4">
          {QUICK_ANSWER_EXAMPLES.map((example) => {
            const isExpanded = expandedId === example.id;

            return (
              <div
                key={example.id}
                className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest overflow-hidden transition-all shadow-xs"
              >
                {/* Header / Summary Bar */}
                <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 font-mono font-bold text-sm">
                      ?
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">
                          {example.topic}
                        </span>
                      </div>
                      <h3 className="font-bold text-on-surface text-base sm:text-lg mt-0.5">
                        {example.question}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 self-stretch sm:self-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-outline-variant/15">
                    <div className="flex items-baseline gap-1.5 font-mono">
                      <span className="text-xs text-on-surface-variant">Answer:</span>
                      <span className="text-xl font-bold text-primary">{example.answer}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleExpand(example.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold flex items-center gap-1.5 border border-outline-variant/20 transition-colors"
                      aria-expanded={isExpanded}
                    >
                      <span>{isExpanded ? 'Hide Steps' : 'Show Steps'}</span>
                      <span
                        className={`material-symbols-outlined text-base transition-transform duration-200 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      >
                        expand_more
                      </span>
                    </button>
                  </div>
                </div>

                {/* 5-Step Solution Expansion */}
                {isExpanded && (
                  <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-outline-variant/15 bg-surface/50 space-y-4">
                    <div className="text-xs uppercase tracking-wider font-semibold text-primary flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">format_list_numbered</span>
                      <span>Step-by-Step Solution Breakdown</span>
                    </div>

                    <div className="space-y-3">
                      {example.steps.map((st) => (
                        <div
                          key={st.stepNumber}
                          className="p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant/20 flex items-start gap-3"
                        >
                          <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                            {st.stepNumber}
                          </span>
                          <div className="flex-1">
                            <h4 className="text-xs font-bold text-on-surface mb-0.5">
                              {st.title}
                            </h4>
                            <p className="text-xs text-on-surface-variant leading-relaxed">
                              {st.content}
                            </p>
                            {st.mathExpression && (
                              <div className="mt-1.5 px-2.5 py-1 rounded bg-surface-container-low font-mono text-xs text-primary inline-block">
                                {st.mathExpression}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 flex items-center justify-between text-xs">
                      <span className="text-on-surface-variant/70">Need to solve another problem with different numbers?</span>
                      <Link
                        href={example.calculatorPath}
                        className="font-semibold text-primary hover:underline flex items-center gap-1"
                      >
                        <span>Open {example.calculatorName}</span>
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
