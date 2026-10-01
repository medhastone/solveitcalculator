'use client';

import React from 'react';
import Link from 'next/link';
import { REGIONAL_HUBS, TAX_TRUST_DATA, RECENTLY_UPDATED_TOOLS } from '../financeData';

export default function RegionalAndTaxTrust() {
  return (
    <div className="w-full">
      {/* 1. Regional Calculators */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-left mb-6 sm:mb-8">
          <div className="flex items-center gap-2 text-primary text-xs sm:text-sm font-bold uppercase tracking-wider mb-1">
            <span className="material-symbols-outlined text-[18px]">public</span>
            <span>Jurisdiction-Specific Tools</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            Finance Calculators by Country &amp; Region
          </h2>
          <p className="text-sm sm:text-base text-on-surface-variant mt-1 max-w-2xl">
            Explore calculators that use jurisdiction-specific rules, tax rates, or assumptions where available.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {REGIONAL_HUBS.map((hub) => (
            <div
              key={hub.country}
              className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{hub.flag}</span>
                  <h3 className="font-bold text-base sm:text-lg text-on-surface">{hub.country}</h3>
                </div>
                <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
                  {hub.description}
                </p>

                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-outline block mb-1">
                    Available tools:
                  </span>
                  {hub.links.map((link) => (
                    <Link
                      key={link.name}
                      href={link.path}
                      className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-xs text-on-surface hover:text-primary transition-colors font-medium"
                    >
                      <span>{link.name}</span>
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Tax Trust Architecture & Sources */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="p-6 sm:p-8 rounded-3xl bg-surface-container-low border border-outline-variant/30">
          <div className="text-left mb-6">
            <div className="flex items-center gap-2 text-primary text-xs sm:text-sm font-bold uppercase tracking-wider mb-1">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>Regulatory Grounding</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
              Tax Calculator Trust &amp; Source Architecture
            </h2>
            <p className="text-sm sm:text-base text-on-surface-variant mt-1 max-w-2xl">
              Our tax computation engines are built against published statutory schedules and inflation-indexed tax brackets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TAX_TRUST_DATA.map((item) => (
              <div
                key={item.jurisdiction}
                className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-on-surface">{item.jurisdiction}</span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary font-semibold">
                      {item.taxYear}
                    </span>
                  </div>
                  <div className="text-xs text-primary font-semibold mt-1">
                    Source: {item.primarySource}
                  </div>
                  <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                    {item.keyAssumption}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-outline-variant/15">
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-on-surface-variant hover:text-primary transition-colors"
                  >
                    <span>View Official Authority</span>
                    <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Recently Updated Finance Calculators */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-left mb-6 sm:mb-8">
          <div className="flex items-center gap-2 text-primary text-xs sm:text-sm font-bold uppercase tracking-wider mb-1">
            <span className="material-symbols-outlined text-[18px]">update</span>
            <span>Maintenance &amp; Verification</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            Recently Updated Finance Calculators
          </h2>
          <p className="text-sm sm:text-base text-on-surface-variant mt-1 max-w-2xl">
            See tools that have recently received calculation, rule, methodology, or content updates.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {RECENTLY_UPDATED_TOOLS.map((tool) => (
            <div
              key={tool.name}
              className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono text-outline">{tool.lastUpdated}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <h3 className="font-bold text-sm text-on-surface">{tool.name}</h3>
                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                  {tool.description}
                </p>
              </div>
              <div className="mt-3 pt-2">
                <Link
                  href={tool.path}
                  className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                >
                  <span>Open Tool</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
