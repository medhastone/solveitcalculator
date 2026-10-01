'use client';

import React, { useState } from 'react';
import { CONVERSION_FAQS } from '../conversionsData';

export default function ConversionsFaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full py-14 px-4 sm:px-6 lg:px-8 bg-surface-container-lowest border-y border-outline-variant/15">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-2">
          <div className="text-xs uppercase font-bold tracking-wider text-primary">
            Got Questions?
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            Frequently Asked Questions About Unit Conversion
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant">
            Clear, technically accurate explanations of how our calculators handle factors, rounding, formulas, and measurement standards.
          </p>
        </div>

        {/* FAQs Accordion */}
        <div className="space-y-3">
          {CONVERSION_FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.q}
                className="rounded-2xl border border-outline-variant/30 bg-surface overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full py-4 px-5 sm:px-6 flex items-center justify-between text-left gap-4 hover:bg-surface-container-low transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-on-surface text-sm sm:text-base">
                    {faq.q}
                  </span>
                  <span
                    className={`material-symbols-outlined text-primary text-xl transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  >
                    keyboard_arrow_down
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-on-surface-variant leading-relaxed border-t border-outline-variant/10">
                    {faq.a}
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
