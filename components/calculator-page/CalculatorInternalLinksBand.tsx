import React from 'react';
import Link from 'next/link';
import { BookOpen, Calculator, ArrowRight, LayoutGrid } from 'lucide-react';
import { getCalculatorInternalLinks } from '@/lib/internalLinkingMap';

interface CalculatorInternalLinksBandProps {
  calculatorPath: string;
}

/**
 * Pure React Server Component rendering the "Related Guide" callout box (1–2 guides)
 * and contextual "Related Calculators" section (3 links) for standalone calculator pages.
 */
export default function CalculatorInternalLinksBand({
  calculatorPath,
}: CalculatorInternalLinksBandProps) {
  const entry = getCalculatorInternalLinks(calculatorPath);
  if (!entry) return null;

  return (
    <div className="bg-[#F5F7FA] text-[#152238] border-t border-[#E2E8F0]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Related Guide Callout Box (1–2 guides) */}
        <aside
          aria-label="Related formula guide"
          className="rounded-2xl bg-gradient-to-r from-[#EEF4FF] via-[#F4F8FF] to-white border border-[#BFDBFE] p-5 sm:p-6 shadow-2xs space-y-3.5"
        >
          <div className="flex items-center gap-2.5">
            <div
              aria-hidden="true"
              className="w-7 h-7 rounded-lg bg-[#2457D6] text-white flex items-center justify-center shrink-0"
            >
              <BookOpen className="w-4 h-4" />
            </div>
            <h2 className="text-sm sm:text-base font-extrabold text-[#152238]">
              {entry.guides.length > 1 ? 'Related Formula Guides' : 'Related Guide'}
            </h2>
          </div>

          <div
            className={`grid grid-cols-1 ${
              entry.guides.length > 1 ? 'md:grid-cols-2' : ''
            } gap-3`}
          >
            {entry.guides.map((guide) => (
              <Link
                key={guide.slug}
                href={guide.href}
                className="group flex items-center justify-between gap-3 rounded-xl bg-white hover:bg-[#F8FBFF] border border-[#CFE0FC] hover:border-[#2457D6] p-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6]"
              >
                <div className="min-w-0 space-y-1">
                  <div className="text-sm font-extrabold text-[#152238] group-hover:text-[#2457D6] transition-colors">
                    {guide.title}
                  </div>
                  <p className="text-xs text-[#475569] leading-relaxed">
                    {guide.description}
                  </p>
                </div>
                <ArrowRight
                  className="w-4 h-4 text-[#2457D6] shrink-0 group-hover:translate-x-0.5 transition-transform"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
        </aside>

        {/* Contextual Related Calculators (3 links) */}
        <section
          id="related-tools"
          aria-labelledby="standalone-related-calculators-heading"
          className="rounded-2xl bg-white border border-[#E2E8F0] p-5 sm:p-6 shadow-2xs space-y-4"
        >
          <div className="flex items-center gap-2.5">
            <LayoutGrid
              className="w-5 h-5 text-[#2457D6] shrink-0"
              aria-hidden="true"
            />
            <h2
              id="standalone-related-calculators-heading"
              className="text-base sm:text-lg font-extrabold text-[#152238]"
            >
              Related Calculators
            </h2>
          </div>

          <ul className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {entry.relatedCalculators.map((calc) => (
              <li key={calc.path}>
                <Link
                  href={calc.path}
                  className="group h-full flex flex-col justify-between gap-2.5 rounded-xl bg-[#F8FAFC] hover:bg-[#EEF4FF] border border-[#E2E8F0] hover:border-[#BFDBFE] p-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6]"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 text-sm font-extrabold text-[#152238] group-hover:text-[#2457D6] transition-colors">
                        <Calculator
                          className="w-4 h-4 text-[#2457D6] shrink-0"
                          aria-hidden="true"
                        />
                        <span>{calc.name}</span>
                      </span>
                      <ArrowRight
                        className="w-4 h-4 text-[#2457D6] shrink-0 group-hover:translate-x-0.5 transition-transform"
                        aria-hidden="true"
                      />
                    </div>
                    <p className="text-xs text-[#475569] leading-relaxed">
                      {calc.description}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
