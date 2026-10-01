'use client';

import React, { useState } from 'react';
import { FAQ_ITEMS } from '../utils';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="max-w-max-width-calculator mx-auto w-full flex flex-col gap-space-md" id="leap-year-faqs">
      <div className="text-center">
        <span className="font-label-caps text-label-caps uppercase text-primary tracking-wider font-semibold">
          Help &amp; Documentation
        </span>
        <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
          Frequently Asked Questions
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Everything you ever wanted to know about intercalary calculations, calendar history, and century rules.
        </p>
      </div>

      <div className="flex flex-col gap-space-xs" id="faqAccordion">
        {FAQ_ITEMS.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-xl bg-surface-container-lowest shadow-sm overflow-hidden border border-outline-variant/15 transition-colors"
            >
              <button
                className="faq-toggle w-full p-space-md flex items-center justify-between text-left font-headline-md text-body-lg font-bold text-on-surface hover:text-primary transition-colors cursor-pointer"
                type="button"
                onClick={() => toggleFaq(idx)}
                aria-expanded={isOpen}
              >
                <span>{item.question}</span>
                <span
                  className={`material-symbols-outlined text-[20px] transition-transform duration-200 shrink-0 ml-2 ${
                    isOpen ? 'rotate-180 text-primary' : 'text-outline'
                  }`}
                >
                  expand_more
                </span>
              </button>
              {isOpen && (
                <div className="faq-content px-space-md pb-space-md text-body-md text-on-surface-variant leading-relaxed border-t border-outline-variant/10 pt-2">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
