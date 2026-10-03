import React from 'react';
import Link from 'next/link';
import { TimeToolDefinition } from '@/lib/time-date/types';
import { getRelatedTools } from '@/lib/time-date/data';
import { BookOpen, CheckCircle, HelpCircle, ArrowRight, Table, AlertCircle, Sparkles } from 'lucide-react';

interface Props {
  tool: TimeToolDefinition;
}

export default function EducationalSections({ tool }: Props) {
  const relatedTools = getRelatedTools(tool.relatedSlugs);

  return (
    <div className="space-y-12 text-slate-800 dark:text-slate-200">
      {/* Formula & Method Section */}
      {tool.formula && (
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Calculation Formula & Mathematical Model
            </h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
            The mathematical formula governing {tool.name.toLowerCase()} calculations standardizes chronological intervals and handles non-linear calendar boundary variations:
          </p>

          <div className="bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 rounded-xl border border-slate-200 dark:border-slate-800 text-center font-mono text-base sm:text-lg text-indigo-700 dark:text-indigo-300 mb-6 overflow-x-auto">
            {tool.formula}
          </div>

          {tool.variableDefinitions && tool.variableDefinitions.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-200 mb-3">
                Variable Definitions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tool.variableDefinitions.map((v, i) => (
                  <div
                    key={i}
                    className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700/60"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-1.5 py-0.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-mono text-xs font-bold rounded">
                        {v.symbol}
                      </span>
                      <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">{v.label}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{v.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Step-by-Step Worked Example */}
      {tool.workedExample && (
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Step-by-Step Practical Example
            </h2>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-xl p-4 mb-6 text-sm text-emerald-900 dark:text-emerald-300 font-medium">
            <strong>Scenario:</strong> {tool.workedExample.scenario}
          </div>

          <div className="space-y-3 mb-6">
            {tool.workedExample.steps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3 text-sm">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xs font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{step}</p>
              </div>
            ))}
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-slate-100">
            <strong>Final Conclusion:</strong> {tool.workedExample.conclusion}
          </div>
        </section>
      )}

      {/* Guide Content if Educational Guide */}
      {tool.guideContent && (
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="p-4 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/50 rounded-xl text-sm text-indigo-950 dark:text-indigo-200 leading-relaxed">
            {tool.guideContent.summary}
          </div>

          {tool.guideContent.sections.map((sec, i) => (
            <div key={i} className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {sec.heading}
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {sec.body}
              </p>
            </div>
          ))}
        </section>
      )}

      {/* Reference Data Table */}
      {tool.referenceTable && (
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4">
            <Table className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {tool.referenceTable.title}
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                  {tool.referenceTable.headers.map((h, i) => (
                    <th key={i} className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-200">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tool.referenceTable.rows.map((row, rIdx) => (
                  <tr
                    key={rIdx}
                    className="border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/30"
                  >
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300 text-xs sm:text-sm">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Assumptions & Edge Cases */}
      {tool.assumptions && tool.assumptions.length > 0 && (
        <section className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Calculation Assumptions & Standards
            </h3>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 list-disc list-inside">
            {tool.assumptions.map((asm, i) => (
              <li key={i}>{asm}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Related Tools Matrix */}
      {relatedTools.length > 0 && (
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Related Time & Date Tools
              </h2>
            </div>
            <Link
              href="/time-date"
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>Explore All Tools</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedTools.map((rel) => (
              <Link
                key={rel.slug}
                href={rel.canonicalPath}
                className="group p-4 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl transition-all"
              >
                <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mb-1">
                  {rel.subcategoryTitle}
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-1">
                  {rel.name}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {rel.metaDescription}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FAQ Accordion */}
      {tool.faqs && tool.faqs.length > 0 && (
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {tool.faqs.map((faq, i) => (
              <details
                key={i}
                className="group bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700/60 p-4 transition-all"
              >
                <summary className="font-semibold text-sm text-slate-900 dark:text-slate-100 cursor-pointer list-none flex items-center justify-between gap-3">
                  <span>{faq.question}</span>
                  <span className="text-xs text-indigo-600 dark:text-indigo-400 group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
