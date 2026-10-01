'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { MathToolData } from './data';
import { getToolConfig } from './mathEngine';
import { POPULAR_MATH_TOOLS } from '../mathCategoryData';

interface Props {
  data: MathToolData;
  slug: string;
}

export default function MathToolClient({ data, slug }: Props) {
  const config = getToolConfig(slug);
  const [inputs, setInputs] = useState<Record<string, string>>(
    config.inputs.reduce((acc, input) => {
      acc[input.id] = input.defaultValue || '';
      return acc;
    }, {} as Record<string, string>)
  );

  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<React.ReactNode | null>(null);
  const [toolSearch, setToolSearch] = useState('');

  const handleCalculate = () => {
    setIsCalculating(true);
    setTimeout(() => {
      try {
        const res = config.solve(inputs);
        setResult(res);
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : String(err);
        setResult(<div className="text-error font-semibold">Error: {errMsg}</div>);
      }
      setIsCalculating(false);
    }, 400);
  };

  // Sibling math tools filtered for Category 4th section
  const relatedTools = useMemo(() => {
    const others = POPULAR_MATH_TOOLS.filter((t) => !t.path.includes(slug));
    if (!toolSearch.trim()) return others.slice(0, 8);
    const q = toolSearch.toLowerCase();
    return others.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.shortDesc.toLowerCase().includes(q) ||
        t.keywords.some((k) => k.toLowerCase().includes(q))
    );
  }, [slug, toolSearch]);

  return (
    <main className="flex-1 w-full max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-xl flex flex-col gap-space-xl">
      {/* =========================================================================
          1st: BREADCRUMB NAVIGATION
      ========================================================================= */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant flex-wrap">
        <Link className="hover:text-primary transition-colors flex items-center gap-1" href="/">
          <span className="material-symbols-outlined text-[16px]">home</span>
          <span>Home</span>
        </Link>
        <span className="text-outline-variant">/</span>
        <Link className="hover:text-primary transition-colors" href="/math">
          Math Calculators
        </Link>
        <span className="text-outline-variant">/</span>
        <span className="text-on-surface font-semibold">{data.h1}</span>
      </nav>

      {/* =========================================================================
          2nd: H1 TITLE & SHORT SUBHEADING SUMMARY
      ========================================================================= */}
      <div className="max-w-4xl">
        <h1 className="font-display text-display-sm lg:text-display-md font-bold text-on-surface mb-space-sm tracking-tight">
          {data.h1}
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
          {data.description}
        </p>
      </div>

      {/* =========================================================================
          3rd: LIVE INTERACTIVE DASHBOARD / CALCULATOR WORKBENCH
      ========================================================================= */}
      <section className="bg-surface-container rounded-3xl p-6 sm:p-8 shadow-sm border border-outline-variant/30 flex flex-col gap-space-md">
        <div className="flex items-center justify-between border-b border-outline-variant/20 pb-space-sm">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
            <span className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface font-bold">
              Interactive {data.h1} Workbench
            </span>
          </div>
          <span className="font-data-mono text-[11px] text-on-surface-variant bg-surface-container-highest px-2.5 py-1 rounded-md">
            Client-Side Computation
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md pt-2">
          {config.inputs.map((input) => (
            <div key={input.id} className="flex flex-col gap-space-2xs">
              <label className="font-label-sm text-label-sm font-semibold text-on-surface-variant">
                {input.label}
              </label>
              {input.type === 'select' ? (
                <select
                  value={inputs[input.id]}
                  onChange={(e) => setInputs({ ...inputs, [input.id]: e.target.value })}
                  className="px-space-md py-space-sm bg-surface rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-body-md text-on-surface transition-all cursor-pointer h-[46px]"
                >
                  {input.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={input.type === 'number' ? 'number' : 'text'}
                  step={input.type === 'number' ? 'any' : undefined}
                  value={inputs[input.id]}
                  onChange={(e) => setInputs({ ...inputs, [input.id]: e.target.value })}
                  placeholder={input.placeholder}
                  className="px-space-md py-space-sm bg-surface rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none font-data-mono text-body-lg text-on-surface transition-all h-[46px]"
                />
              )}
            </div>
          ))}
        </div>

        <div className="pt-2">
          <button
            onClick={handleCalculate}
            disabled={isCalculating}
            className="w-full sm:w-auto bg-primary text-on-primary px-8 py-3 rounded-full font-label-lg text-label-lg font-semibold shadow-sm hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {isCalculating ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                <span>Computing Solution...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">calculate</span>
                <span>Calculate Result</span>
              </>
            )}
          </button>
        </div>

        {result && (
          <div className="mt-space-md bg-surface-container-highest p-space-lg rounded-2xl border border-outline-variant/40 animate-fade-in space-y-2">
            <h3 className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-bold">Computed Result &amp; Steps:</h3>
            <div className="font-body-md text-on-surface break-words leading-relaxed">{result}</div>
          </div>
        )}
      </section>

      {/* =========================================================================
          4th: RELATED MATH CALCULATORS (TOOLS CATEGORY & SEARCH)
      ========================================================================= */}
      <section className="space-y-6 pt-4 border-t border-outline-variant/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-primary">
              Math Calculation Tools
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-on-surface">
              Related Math Calculators &amp; Solvers
            </h2>
          </div>
          <Link
            href="/math"
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>All Math Categories</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>

        {/* Category Tool Search Bar directly above the catalog grid */}
        <div className="relative">
          <input
            type="text"
            value={toolSearch}
            onChange={(e) => setToolSearch(e.target.value)}
            placeholder="Search related math calculators by topic, formula, or problem type..."
            className="w-full px-4 py-2.5 pl-10 rounded-2xl bg-surface-container-low border border-outline-variant/40 text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
          />
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
            search
          </span>
          {toolSearch && (
            <button
              type="button"
              onClick={() => setToolSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface text-xs"
            >
              Clear
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {relatedTools.length > 0 ? (
            relatedTools.map((t) => (
              <Link
                key={t.id}
                href={t.path}
                className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/50 hover:shadow-md transition-all text-left block group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">{t.icon}</span>
                  <div className="text-xs font-semibold text-outline uppercase tracking-wider">{t.category}</div>
                </div>
                <div className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                  {t.name}
                </div>
                <div className="text-xs text-on-surface-variant line-clamp-2 mt-1">
                  {t.shortDesc}
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-6 text-xs text-on-surface-variant">
              No matching calculators found for &quot;{toolSearch}&quot;.
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          5th: EDUCATIONAL DOCUMENTATION, HOW-TO-USE, FORMULAS & FAQS
      ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl pt-6 border-t border-outline-variant/30">
        {/* Left Column: Mathematical Overview, Formulas & Worked Examples */}
        <div className="lg:col-span-8 flex flex-col gap-space-lg">
          <section>
            <h2 className="font-headline-md text-headline-md font-bold text-on-surface mb-space-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">info</span>
              Mathematical Foundations &amp; Overview
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              {data.overview}
            </p>
          </section>

          {data.formula && (
            <section className="bg-surface-container-low p-space-md rounded-2xl border-l-4 border-primary">
              <h3 className="font-label-lg text-label-lg font-bold text-on-surface mb-space-xs">Primary Formula</h3>
              <code className="font-data-mono text-body-lg text-primary block bg-surface-container-lowest p-space-sm rounded-xl border border-outline-variant/20 mt-space-xs">
                {data.formula}
              </code>
            </section>
          )}

          {data.example && (
            <section>
              <h2 className="font-headline-md text-headline-md font-bold text-on-surface mb-space-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">school</span>
                Step-by-Step Worked Example
              </h2>
              <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-space-md space-y-space-sm">
                <p className="font-body-md text-body-md font-semibold text-on-surface">
                  {data.example.question}
                </p>
                <ol className="list-decimal list-inside space-y-space-xs font-body-md text-body-md text-on-surface-variant">
                  {data.example.steps.map((step, idx) => (
                    <li key={idx} className="pl-2">{step}</li>
                  ))}
                </ol>
                <div className="bg-primary/10 text-primary px-space-md py-space-xs rounded-xl font-semibold text-body-md border border-primary/20 mt-space-sm">
                  {data.example.answer}
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Right Column: How to Use & FAQs */}
        <div className="lg:col-span-4 flex flex-col gap-space-lg">
          {/* How to Use */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-space-lg">
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-space-md flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">help</span>
              How to Use
            </h3>
            <ul className="space-y-space-sm">
              {data.howToUse.map((step, idx) => (
                <li key={idx} className="flex items-start gap-space-sm">
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[12px] shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    {step}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* FAQs */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-space-lg">
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-space-md flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">forum</span>
              Frequently Asked Questions
            </h3>
            <div className="space-y-space-md">
              {data.faqs.map((faq, idx) => (
                <div key={idx} className="border-b border-outline-variant/20 pb-space-sm last:border-0 last:pb-0">
                  <h4 className="font-label-lg text-label-lg font-semibold text-on-surface mb-space-2xs">
                    {faq.q}
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
