import React from 'react';
import { Sigma, Calculator, HelpCircle } from 'lucide-react';

export interface ServerReferenceFaq {
  question: string;
  answer: string;
}

export interface ServerCalculatorReferenceProps {
  title: string;
  formulaHeading?: string;
  formulaExpression: string;
  formulaExplanation: string;
  exampleHeading?: string;
  exampleSummary: string;
  exampleSteps: string[];
  faqs?: ServerReferenceFaq[];
}

/**
 * Pure React Server Component (no 'use client') that guarantees the formula
 * explanation, worked example, and FAQ answers are emitted directly into raw
 * SSR HTML for search crawlers and non-JavaScript clients.
 */
export default function ServerCalculatorReferenceSection({
  title,
  formulaHeading = 'Formula Explanation',
  formulaExpression,
  formulaExplanation,
  exampleHeading = 'Worked Example',
  exampleSummary,
  exampleSteps,
  faqs,
}: ServerCalculatorReferenceProps) {
  return (
    <section
      aria-label={`${title} formula explanation and worked example`}
      className="bg-[#F5F7FA] text-[#152238] border-t border-[#E2E8F0]"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formula Explanation */}
          <div
            id="formula-explanation"
            className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-2xs space-y-3"
          >
            <div className="flex items-center gap-2.5">
              <div
                aria-hidden="true"
                className="w-7 h-7 rounded-lg bg-[#EBF2FF] text-[#2457D6] flex items-center justify-center shrink-0"
              >
                <Sigma className="w-4 h-4" />
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-[#152238]">
                {formulaHeading}
              </h2>
            </div>

            <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] px-4 py-3 font-mono text-xs sm:text-sm font-bold text-[#152238] overflow-x-auto">
              {formulaExpression}
            </div>

            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
              {formulaExplanation}
            </p>
          </div>

          {/* Worked Example */}
          <div
            id="worked-example"
            className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-2xs space-y-3"
          >
            <div className="flex items-center gap-2.5">
              <div
                aria-hidden="true"
                className="w-7 h-7 rounded-lg bg-[#ECFDF5] text-[#15803D] flex items-center justify-center shrink-0"
              >
                <Calculator className="w-4 h-4" />
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-[#152238]">
                {exampleHeading}
              </h2>
            </div>

            <p className="text-xs sm:text-sm font-semibold text-[#152238] leading-relaxed">
              {exampleSummary}
            </p>

            <ol className="list-decimal pl-5 space-y-1.5 text-xs sm:text-sm text-[#475569] leading-relaxed">
              {exampleSteps.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </div>
        </div>

        {/* Optional Server-Rendered FAQs */}
        {faqs && faqs.length > 0 && (
          <div
            id="server-faq"
            className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-2xs space-y-4"
          >
            <div className="flex items-center gap-2.5">
              <div
                aria-hidden="true"
                className="w-7 h-7 rounded-full bg-[#2457D6] text-white flex items-center justify-center shrink-0"
              >
                <HelpCircle className="w-4 h-4" />
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-[#152238]">
                Frequently Asked Questions
              </h2>
            </div>

            <dl className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-4 space-y-1.5"
                >
                  <dt className="text-sm font-extrabold text-[#152238] leading-snug">
                    {faq.question}
                  </dt>
                  <dd className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                    {faq.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>
    </section>
  );
}
