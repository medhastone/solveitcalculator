import React from 'react';
import Link from 'next/link';
import { BookOpen, HelpCircle, ArrowUp } from 'lucide-react';
import {
  buildCoreCalculatorJsonLd,
  getCoreCalculatorSeoBySlug,
  type CoreCalculatorSeoEntry,
} from '@/lib/coreCalculatorSeoContent';

interface CoreCalculatorSeoSectionProps {
  slug: CoreCalculatorSeoEntry['slug'];
}

export default function CoreCalculatorSeoSection({
  slug,
}: CoreCalculatorSeoSectionProps) {
  const entry = getCoreCalculatorSeoBySlug(slug);
  if (!entry) return null;

  const isStaticExport =
    process.env.GITHUB_PAGES === 'true' || process.env.STATIC_EXPORT === 'true';

  return (
    <div className="bg-[#F5F7FA] text-[#152238] border-t border-[#E2E8F0]/80">
      {isStaticExport && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildCoreCalculatorJsonLd(entry)),
          }}
        />
      )}

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-14 space-y-6">
        {/* Plain-English Editorial Guide: How to Use This Calculator & Why It Matters */}
        <section
          id="how-to-use-guide"
          aria-labelledby="how-to-use-guide-heading"
          className="scroll-mt-24 bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-2xs space-y-4"
        >
          <div className="flex items-center gap-2.5">
            <div
              aria-hidden="true"
              className="w-7 h-7 rounded-lg bg-[#EBF2FF] text-[#2457D6] flex items-center justify-center shrink-0"
            >
              <BookOpen className="w-4 h-4" />
            </div>
            <h2
              id="how-to-use-guide-heading"
              className="text-lg sm:text-xl font-extrabold text-[#152238] tracking-tight"
            >
              {entry.guideTitle}
            </h2>
          </div>

          <div className="space-y-3.5 text-sm sm:text-[15px] text-[#334155] leading-relaxed">
            {entry.guideParagraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </section>

        {/* Server-Rendered FAQ Block Above the Footer */}
        <section
          id="faq"
          aria-labelledby="core-faq-heading"
          className="scroll-mt-24 bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-2xs space-y-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div
                aria-hidden="true"
                className="w-7 h-7 rounded-full bg-[#2457D6] text-white flex items-center justify-center shrink-0"
              >
                <HelpCircle className="w-4 h-4" />
              </div>
              <h2
                id="core-faq-heading"
                className="text-lg sm:text-xl font-extrabold text-[#152238] tracking-tight"
              >
                Frequently Asked Questions
              </h2>
            </div>

            <a
              href="#workbench"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#2457D6] hover:underline"
            >
              <span>Back to Calculator</span>
              <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>

          <dl className="grid grid-cols-1 gap-3.5">
            {entry.faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-4 sm:p-5 space-y-2"
              >
                <dt className="text-sm sm:text-[15px] font-extrabold text-[#152238] leading-snug">
                  {faq.question}
                </dt>
                <dd className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                  {faq.answer}
                </dd>
              </div>
            ))}
          </dl>

          <div className="pt-3 border-t border-[#F1F5F9] flex flex-wrap items-center justify-between gap-2 text-xs text-[#64748B]">
            <span>
              All formulas and worked examples follow published standards (see{' '}
              <Link
                href="/calculation-methodology"
                className="font-bold text-[#0A58ED] hover:underline"
              >
                Methodology
              </Link>
              ).
            </span>
            <Link
              href="/contact"
              className="font-bold text-[#0A58ED] hover:underline"
            >
              Report a formula question
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
