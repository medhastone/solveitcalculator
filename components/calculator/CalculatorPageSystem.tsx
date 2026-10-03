'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  Calculator,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ShieldCheck,
  HelpCircle,
  ArrowRight,
  ExternalLink,
  Layers,
  Sparkles,
  RotateCcw,
  Sliders
} from 'lucide-react';
import { CalculatorSystemData } from '@/lib/calculatorSystemData';
import { CANONICAL_TOOLS, CanonicalTool } from '@/lib/registry';

interface CalculatorPageSystemProps {
  data: CalculatorSystemData;
  children: React.ReactNode; // The top-loaded interactive working calculator interface
}

export default function CalculatorPageSystem({ data, children }: CalculatorPageSystemProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Resolved related tools
  const relatedTools = data.relatedToolIds
    .map((id) => CANONICAL_TOOLS.find((t) => t.id === id))
    .filter(Boolean) as CanonicalTool[];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
      {/* 1. BREADCRUMB & 2. SEO H1 & 3. SHORT ANSWER */}
      <header className="border-b border-slate-800 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 pt-6 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* SECTION 1: Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex flex-wrap items-center space-x-2 text-xs sm:text-sm text-slate-400">
              <li>
                <Link href="/" className="hover:text-indigo-400 transition-colors">
                  Home
                </Link>
              </li>
              <li className="flex items-center space-x-2">
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                <Link href={data.categoryPath} className="hover:text-indigo-400 transition-colors">
                  {data.categoryName}
                </Link>
              </li>
              {data.subcategoryName && data.subcategoryPath && (
                <li className="flex items-center space-x-2">
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  <Link href={data.subcategoryPath} className="hover:text-indigo-400 transition-colors">
                    {data.subcategoryName}
                  </Link>
                </li>
              )}
              <li className="flex items-center space-x-2">
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                <span className="text-slate-200 font-medium truncate max-w-[200px] sm:max-w-none" aria-current="page">
                  {data.name}
                </span>
              </li>
            </ol>
          </nav>

          {/* SECTION 2: SEO H1 */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Calculator className="w-3.5 h-3.5" />
            <span>Interactive Verified Calculator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight mb-3">
            {data.h1}
          </h1>

          {/* SECTION 3: Short Answer (1–2 sentences) */}
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal max-w-4xl">
            {data.shortAnswer}
          </p>
        </div>
      </header>

      {/* SECTION 4: WORKING CALCULATOR (Top of Page / Above the Fold) */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        <section aria-label="Calculator Interface" className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xl">
          {children}
        </section>

        {/* SECTION 5: FORMULA & GOVERNING VARIABLES */}
        <section aria-labelledby="formula-heading" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">
            <BookOpen className="w-4 h-4" />
            <span>Mathematical Proof & Formula</span>
          </div>
          <h2 id="formula-heading" className="text-xl sm:text-2xl font-bold text-white mb-3">
            Formula & Governing Equations
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            {data.formula.description}
          </p>

          {/* Formula Display Box */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 mb-6">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Governing Equation
            </div>
            <code className="text-base sm:text-lg text-amber-300 font-mono font-bold block overflow-x-auto pb-1">
              {data.formula.equation}
            </code>
          </div>

          {/* Variables Table */}
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-3">
            Variables & Measurement Units
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-800 rounded-lg overflow-hidden">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Symbol</th>
                  <th className="py-2.5 px-3">Variable Name</th>
                  <th className="py-2.5 px-3">Units</th>
                  <th className="py-2.5 px-3">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {data.formula.variables.map((v, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/50">
                    <td className="py-2.5 px-3 font-mono font-bold text-amber-300">{v.symbol}</td>
                    <td className="py-2.5 px-3 font-medium text-white">{v.name}</td>
                    <td className="py-2.5 px-3 font-mono text-indigo-300">{v.unit}</td>
                    <td className="py-2.5 px-3 text-slate-400">{v.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Assumptions */}
          {data.formula.assumptions.length > 0 && (
            <div className="mt-5 pt-4 border-t border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Calculation Assumptions:
              </h4>
              <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
                {data.formula.assumptions.map((asm, idx) => (
                  <li key={idx}>{asm}</li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* SECTION 6: REALISTIC WORKED EXAMPLE */}
        <section aria-labelledby="example-heading" className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Step-by-Step Proof</span>
          </div>
          <h2 id="example-heading" className="text-xl sm:text-2xl font-bold text-white mb-2">
            Worked Example: {data.workedExample.title}
          </h2>
          <p className="text-sm text-slate-300 mb-5 leading-relaxed">
            {data.workedExample.scenario}
          </p>

          {/* Inputs Grid */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 mb-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Example Numerical Inputs
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              {Object.entries(data.workedExample.inputs).map(([k, v]) => (
                <div key={k} className="bg-slate-950/80 p-2.5 rounded border border-slate-800">
                  <span className="text-slate-500 block text-[11px]">{k}</span>
                  <span className="font-semibold text-white">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Step by step calculations */}
          <div className="space-y-2 mb-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Step-by-Step Calculation Steps:
            </h3>
            <ol className="space-y-2 text-xs sm:text-sm text-slate-300 list-decimal list-inside bg-slate-900/50 p-4 rounded-xl border border-slate-800">
              {data.workedExample.stepByStep.map((step, idx) => (
                <li key={idx} className="leading-relaxed pl-1">
                  {step}
                </li>
              ))}
            </ol>
          </div>

          {/* Final Result & Interpretation */}
          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-xs sm:text-sm">
            <div className="font-bold text-emerald-400 text-sm mb-1">
              Final Output: {data.workedExample.finalResult}
            </div>
            <p className="text-emerald-200/90 leading-relaxed">
              {data.workedExample.interpretation}
            </p>
          </div>
        </section>

        {/* SECTION 7: HOW TO USE & SECTION 8: HOW IT IS CALCULATED */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* SECTION 7: How to Use */}
          <section aria-labelledby="how-to-use-heading" className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 id="how-to-use-heading" className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <span>How to Use This Calculator</span>
            </h2>
            <ol className="space-y-2 text-xs sm:text-sm text-slate-300 list-decimal list-inside">
              {data.howToUse.map((step, idx) => (
                <li key={idx} className="leading-relaxed">
                  {step}
                </li>
              ))}
            </ol>
          </section>

          {/* SECTION 8: How It Is Calculated */}
          <section aria-labelledby="algorithm-heading" className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 id="algorithm-heading" className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-amber-400" />
              <span>How It Is Calculated (Algorithm)</span>
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              {data.howItIsCalculated.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-amber-400 font-bold shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* SECTION 9: WHEN TO USE & SECTION 10: LIMITATIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* SECTION 9: When to Use */}
          <section aria-labelledby="when-to-use-heading" className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 id="when-to-use-heading" className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>When to Use & Practical Applications</span>
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              {data.whenToUse.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-emerald-400 font-bold shrink-0">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* SECTION 10: Limitations */}
          <section aria-labelledby="limitations-heading" className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 id="limitations-heading" className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Limitations & Real-World Caveats</span>
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              {data.limitations.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-rose-400 font-bold shrink-0">!</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* SECTION 11: SOURCE & OFFICIAL REFERENCE */}
        <section aria-labelledby="source-heading" className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Authoritative Source & Standard</span>
          </div>
          <h2 id="source-heading" className="text-lg font-bold text-white mb-2">
            Reference Standard: {data.sourceReference.standardName}
          </h2>
          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-900 p-4 rounded-xl border border-slate-800">
            <div>
              <dt className="text-slate-500 font-medium">Publishing Body</dt>
              <dd className="font-semibold text-white mt-0.5">{data.sourceReference.organization}</dd>
            </div>
            <div>
              <dt className="text-slate-500 font-medium">Standard Citation</dt>
              <dd className="font-mono text-slate-300 mt-0.5">{data.sourceReference.citation}</dd>
            </div>
            <div>
              <dt className="text-slate-500 font-medium">Applicable Version</dt>
              <dd className="font-semibold text-emerald-300 mt-0.5">{data.sourceReference.versionOrDate}</dd>
            </div>
          </dl>
        </section>

        {/* SECTION 12: RELATED TOOLS & SECTION 13: RELATED CONVERSIONS & SECTION 14: GUIDES */}
        <section aria-labelledby="related-heading" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
          <h2 id="related-heading" className="text-xl font-bold text-white mb-6">
            Explore Related Calculators & Reference Tools
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {relatedTools.map((tool) => (
              <Link
                key={tool.id}
                href={tool.canonicalPath}
                className="group p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 mb-2 inline-block">
                    {tool.badge || 'Tool'}
                  </span>
                  <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors mb-1">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {tool.desc}
                  </p>
                </div>
                <div className="mt-3 text-xs text-indigo-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Open Calculator <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            ))}
          </div>

          {/* Conversions & Guides Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-slate-800 text-xs">
            {data.relatedConversionPaths.length > 0 && (
              <div>
                <h3 className="font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Related Unit Converters:
                </h3>
                <ul className="space-y-1.5">
                  {data.relatedConversionPaths.map((conv, idx) => (
                    <li key={idx}>
                      <Link href={conv.path} className="text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                        <span>{conv.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {data.relatedGuidePaths.length > 0 && (
              <div>
                <h3 className="font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Educational Guides & Articles:
                </h3>
                <ul className="space-y-1.5">
                  {data.relatedGuidePaths.map((guide, idx) => (
                    <li key={idx}>
                      <Link href={guide.path} className="text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                        <span>{guide.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* SECTION 15: SEARCH-INTENT FAQ */}
        <section aria-labelledby="faq-heading" className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8">
          <div className="max-w-3xl mb-6">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">
              <HelpCircle className="w-4 h-4" />
              <span>Search-Intent FAQ</span>
            </div>
            <h2 id="faq-heading" className="text-xl sm:text-2xl font-bold text-white mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-400">
              Clear answers to the most common questions about this calculator and its underlying formulas.
            </p>
          </div>

          <div className="space-y-3">
            {data.faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/60"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full text-left px-5 py-3.5 flex items-center justify-between gap-4 text-sm font-semibold text-white hover:text-indigo-300 transition-colors focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span>{faq.question}</span>
                    <ChevronRight
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-90 text-indigo-400' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
