'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MATH_FORMULAS } from '../mathCategoryData';

export default function MathFormulaLibrary() {
  const [copiedName, setCopiedName] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const categories = ['All', 'Algebra', 'Geometry', 'Trigonometry', 'Statistics', 'Applied Math'];

  const filteredFormulas = filterCategory === 'All'
    ? MATH_FORMULAS
    : MATH_FORMULAS.filter((f) => f.category.toLowerCase().includes(filterCategory.toLowerCase()));

  const handleCopyLatex = (latex: string, name: string) => {
    navigator.clipboard.writeText(latex);
    setCopiedName(name);
    setTimeout(() => setCopiedName(null), 2500);
  };

  return (
    <section id="formula-library" className="w-full py-14 px-4 sm:px-6 lg:px-8 bg-surface-container-lowest border-y border-outline-variant/15">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="text-xs uppercase tracking-wider font-semibold text-primary mb-1">
            Standard Mathematical Reference
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
            Math Formula Library
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-2">
            Understand common formulas, what each variable means, and when to use them. Includes plain-text, LaTeX notation, and formula derivations.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilterCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterCategory === cat
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'bg-surface text-on-surface hover:bg-surface-container-high border border-outline-variant/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Formulas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredFormulas.map((item) => (
            <div
              key={item.name}
              className="p-6 rounded-2xl bg-surface border border-outline-variant/30 flex flex-col justify-between shadow-xs hover:border-primary/40 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-on-surface text-base sm:text-lg">
                    {item.name}
                  </h3>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">
                    {item.category}
                  </span>
                </div>

                {/* Display Formula Box */}
                <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20 font-mono text-sm sm:text-base font-semibold text-primary mb-4 flex items-center justify-between gap-3">
                  <span className="overflow-x-auto py-0.5">{item.formula}</span>
                  <button
                    type="button"
                    onClick={() => handleCopyLatex(item.latex, item.name)}
                    className="p-1.5 rounded-lg bg-surface hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors shrink-0 text-xs flex items-center gap-1 border border-outline-variant/20"
                    title="Copy LaTeX formula"
                  >
                    <span className="material-symbols-outlined text-sm">
                      {copiedName === item.name ? 'check' : 'content_copy'}
                    </span>
                    <span className="hidden sm:inline">
                      {copiedName === item.name ? 'Copied' : 'LaTeX'}
                    </span>
                  </button>
                </div>

                {/* When To Use */}
                <div className="mb-3 text-xs text-on-surface-variant">
                  <span className="font-semibold text-on-surface">When to use: </span>
                  {item.whenToUse}
                </div>

                {/* Formula Derivation / Explanation */}
                <div className="mb-4 text-xs text-on-surface-variant leading-relaxed p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/15">
                  <div className="font-semibold text-on-surface mb-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-primary">school</span>
                    <span>Formula Explanation &amp; Derivation:</span>
                  </div>
                  <p>{item.explanation}</p>
                </div>

                {/* Variables List */}
                <div className="space-y-1 text-xs text-on-surface-variant border-t border-outline-variant/15 pt-3 mb-4">
                  <span className="font-semibold text-on-surface block mb-1">Variables &amp; Meaning:</span>
                  {item.variables.map((v) => (
                    <div key={v.symbol} className="flex items-start gap-2">
                      <span className="font-mono font-bold text-primary shrink-0">{v.symbol}:</span>
                      <span>{v.meaning}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Calculator Link */}
              <div className="pt-3 border-t border-outline-variant/15 flex items-center justify-between text-xs">
                <span className="text-on-surface-variant/70 font-medium">Standard Formula</span>
                <Link
                  href={item.calculatorPath}
                  className="font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  <span>Use {item.calculatorName}</span>
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
