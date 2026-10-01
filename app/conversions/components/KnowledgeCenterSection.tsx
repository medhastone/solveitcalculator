'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { KNOWLEDGE_GUIDES, KnowledgeGuide } from '../conversionsData';

export default function KnowledgeCenterSection() {
  const [selectedGuide, setSelectedGuide] = useState<KnowledgeGuide>(KNOWLEDGE_GUIDES[0]);

  return (
    <section className="w-full py-14 px-4 sm:px-6 lg:px-8 bg-surface-container-lowest border-y border-outline-variant/15">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs uppercase font-bold tracking-wider text-primary">
            Everyday Guides &amp; Tips
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            Helpful Guides &amp; Measurement Tips
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant">
            Simple, easy-to-read guides explaining how measurements work, where units come from, and why certain calculations differ.
          </p>
        </div>

        {/* 2-Column Layout: Left list of guides / Right active guide viewer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Guide Selector (5 cols) */}
          <div className="lg:col-span-5 space-y-2 max-h-[560px] overflow-y-auto pr-1">
            {KNOWLEDGE_GUIDES.map((guide) => {
              const isActive = selectedGuide.slug === guide.slug;
              return (
                <button
                  key={guide.slug}
                  type="button"
                  onClick={() => setSelectedGuide(guide)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 cursor-pointer ${
                    isActive
                      ? 'bg-surface border-primary shadow-xs ring-1 ring-primary/30'
                      : 'bg-surface/60 border-outline-variant/20 hover:bg-surface hover:border-outline-variant/40'
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                      {guide.category}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-on-surface">
                      {guide.title}
                    </h3>
                  </div>
                  <span
                    className={`material-symbols-outlined text-base mt-1 shrink-0 ${
                      isActive ? 'text-primary' : 'text-on-surface-variant/40'
                    }`}
                  >
                    chevron_right
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Guide Viewer (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-surface border border-outline-variant/30 shadow-sm space-y-5">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary px-2.5 py-1 rounded bg-primary/10 inline-block">
                {selectedGuide.category}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-on-surface">
                {selectedGuide.title}
              </h3>
            </div>

            <p className="text-sm text-on-surface-variant leading-relaxed">
              {selectedGuide.summary}
            </p>

            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 space-y-1.5">
              <div className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-base">lightbulb</span>
                <span>Helpful Takeaway</span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {selectedGuide.keyTakeaway}
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-on-surface-variant">
                Try it out in the converter:
              </span>
              <Link
                href={selectedGuide.relatedToolPath}
                className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-all flex items-center gap-1.5 shadow-xs"
              >
                <span>Open Tool</span>
                <span className="material-symbols-outlined text-sm">open_in_new</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
