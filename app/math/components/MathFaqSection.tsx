'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MATH_FAQS } from '../mathCategoryData';

export default function MathFaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full py-14 px-4 sm:px-6 lg:px-8 bg-surface-container-lowest border-y border-outline-variant/15">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center">
          <div className="text-xs uppercase tracking-wider font-semibold text-primary mb-1">
            Common Questions
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
            Frequently Asked Questions About Math Calculators
          </h2>
          <p className="text-sm sm:text-base text-on-surface-variant mt-2">
            Clear information about calculator functionality, step-by-step solutions, accuracy, and homework use.
          </p>
        </div>

        {/* FAQs Accordion */}
        <div className="space-y-3">
          {MATH_FAQS.map((faq, index) => {
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

        {/* Homework & Academic Integrity Notice */}
        <div className="p-6 rounded-2xl bg-surface border border-outline-variant/30 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-xl">auto_stories</span>
          </div>
          <div>
            <h3 className="font-bold text-on-surface text-sm sm:text-base mb-1">
              Homework &amp; Learning Philosophy
            </h3>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              Use these calculators to check your work, explore worked examples, and understand the solution process. We design our tools to foster true mathematical understanding rather than simply providing answers without conceptual context.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
