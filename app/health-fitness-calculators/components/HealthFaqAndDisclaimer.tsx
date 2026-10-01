'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { HEALTH_FAQS } from '../healthCategoryData';

export default function HealthFaqAndDisclaimer() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <section className="w-full py-14 px-4 sm:px-6 lg:px-8 bg-surface">
      <div className="max-w-4xl mx-auto space-y-16">
        {/* FAQs */}
        <div>
          <div className="text-center mb-10">
            <div className="text-xs uppercase tracking-wider font-semibold text-primary mb-1">
              Common Questions
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
              Frequently Asked Questions About Health Calculators
            </h2>
            <p className="text-sm sm:text-base text-on-surface-variant mt-2">
              Clear answers regarding mathematical accuracy, data privacy, formula differences, and medical context.
            </p>
          </div>

          <div className="space-y-3">
            {HEALTH_FAQS.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={faq.q}
                  className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest overflow-hidden transition-all shadow-xs"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="w-full py-4 px-5 sm:px-6 flex items-center justify-between text-left gap-4 hover:bg-surface-container-low/40 transition-colors"
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

        {/* Privacy-Conscious Calculations */}
        <div className="p-6 sm:p-7 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-2xl">lock</span>
            </div>
            <div>
              <h3 className="font-bold text-on-surface text-base mb-1">
                Privacy-Conscious Calculations
              </h3>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                Where supported, calculator inputs are processed locally in your browser. Review our{' '}
                <Link href="/privacy" className="text-primary hover:underline font-medium">
                  Privacy Policy
                </Link>{' '}
                for information about cookies, analytics, and other site data.
              </p>
            </div>
          </div>
          <Link
            href="/privacy"
            className="shrink-0 text-xs font-semibold px-4 py-2 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high border border-outline-variant/30 transition-colors"
          >
            Review Privacy Policy
          </Link>
        </div>

        {/* Important Health Information (Mandatory Health Disclaimer) */}
        <div className="p-6 sm:p-7 rounded-2xl bg-amber-500/10 border border-amber-500/25">
          <div className="flex items-start gap-3.5 mb-3">
            <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-2xl shrink-0 mt-0.5">
              medical_information
            </span>
            <div>
              <h3 className="text-base font-bold text-on-surface">
                Important Health Information
              </h3>
              <p className="text-xs uppercase tracking-wider font-semibold text-amber-700 dark:text-amber-300">
                Informational and Educational Estimates Only
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            Health and fitness calculator results are mathematical or informational estimates based on the inputs and methods described. They are not a diagnosis or a substitute for professional medical advice, examination, treatment, or emergency care. Always seek the advice of a qualified physician, registered dietitian, or licensed healthcare provider with any questions you may have regarding a medical condition, diet change, or exercise routine. Never disregard professional medical advice or delay seeking it because of something you have read or calculated on this website.
          </p>
        </div>
      </div>
    </section>
  );
}
