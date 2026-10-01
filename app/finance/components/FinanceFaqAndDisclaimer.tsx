'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FINANCE_FAQS, FINANCE_CATALOG, FINANCE_CATEGORIES } from '../financeData';

export default function FinanceFaqAndDisclaimer() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="w-full">
      {/* 1. Explore All Finance Calculators Directory */}
      <section id="all-finance-calculators" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 scroll-mt-16">
        <div className="text-left mb-6 sm:mb-8">
          <div className="flex items-center gap-2 text-primary text-xs sm:text-sm font-bold uppercase tracking-wider mb-1">
            <span className="material-symbols-outlined text-[18px]">list_alt</span>
            <span>Complete Directory</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            Explore All Finance Calculators
          </h2>
          <p className="text-sm sm:text-base text-on-surface-variant mt-1 max-w-2xl">
            A comprehensive directory of our tools categorized for borrowing, saving, investing, retirement, and business planning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FINANCE_CATEGORIES.map((cat) => {
            const catTools = FINANCE_CATALOG.filter(
              (t) => t.category.toLowerCase().includes(cat.name.split('&')[0].trim().toLowerCase())
            );

            return (
              <div
                key={cat.id}
                className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs"
              >
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-outline-variant/20">
                  <span className="material-symbols-outlined text-primary text-[20px]">{cat.icon}</span>
                  <h3 className="font-bold text-sm sm:text-base text-on-surface">{cat.name}</h3>
                </div>

                <ul className="space-y-2 text-xs">
                  {cat.popularTools.map((tool) => (
                    <li key={tool.name}>
                      <Link
                        href={tool.path}
                        className="text-on-surface hover:text-primary transition-colors flex items-center justify-between py-1 group"
                      >
                        <span className="font-medium group-hover:underline">{tool.name}</span>
                        <span className="material-symbols-outlined text-[14px] text-outline group-hover:text-primary transition-colors">
                          arrow_forward
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="mt-3 pt-2">
                  <Link
                    href={cat.categoryLink}
                    className="text-[11px] font-bold text-primary hover:underline inline-flex items-center gap-1"
                  >
                    <span>View Category Hub</span>
                    <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. Privacy-Conscious Calculations */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="p-5 sm:p-6 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">lock</span>
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-on-surface">
                Privacy-Conscious Calculations
              </h3>
              <p className="text-xs text-on-surface-variant mt-1 leading-relaxed max-w-3xl">
                Where supported, calculator inputs are processed locally in your browser rather than being sent to a calculation server.
                Review our Privacy Policy for information about website data, analytics, cookies, and third-party services.
              </p>
            </div>
          </div>
          <Link
            href="/privacy"
            className="px-4 py-2 rounded-xl bg-surface-container-lowest hover:bg-surface-container border border-outline-variant/30 text-xs font-semibold text-on-surface whitespace-nowrap transition-colors"
          >
            Privacy Policy
          </Link>
        </div>
      </section>

      {/* 3. Frequently Asked Questions */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-left mb-6 sm:mb-8">
          <div className="flex items-center gap-2 text-primary text-xs sm:text-sm font-bold uppercase tracking-wider mb-1">
            <span className="material-symbols-outlined text-[18px]">quiz</span>
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            Frequently Asked Questions About Finance Calculators
          </h2>
          <p className="text-sm sm:text-base text-on-surface-variant mt-1 max-w-2xl">
            Everything you need to know about using our free financial calculation tools.
          </p>
        </div>

        <div className="space-y-3 max-w-4xl">
          {FINANCE_FAQS.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-surface-container-low transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="font-bold text-sm sm:text-base text-on-surface">
                    {faq.q}
                  </span>
                  <span className="material-symbols-outlined text-[20px] text-on-surface-variant shrink-0 transition-transform duration-200">
                    {isOpen ? 'expand_less' : 'expand_more'}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-on-surface-variant leading-relaxed border-t border-outline-variant/15 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Financial Disclaimer */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        <div className="p-5 sm:p-6 rounded-2xl bg-surface-container-low/70 border border-outline-variant/30 text-xs text-on-surface-variant leading-relaxed">
          <div className="flex items-center gap-1.5 font-bold text-on-surface uppercase tracking-wider text-[11px] mb-2">
            <span className="material-symbols-outlined text-[16px] text-outline">info</span>
            <span>Important Financial Disclaimer</span>
          </div>
          <p>
            Calculator results are for informational and planning purposes and depend on the inputs and assumptions provided. They are not financial, tax, legal, or investment advice. Rules, rates, eligibility requirements, and tax treatment may vary by jurisdiction, plan, lender, employer, or individual circumstances. Verify important decisions with the relevant official source, plan administrator, lender, tax professional, or qualified financial professional.
          </p>
        </div>
      </section>
    </div>
  );
}
