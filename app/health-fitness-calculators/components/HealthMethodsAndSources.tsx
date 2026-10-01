import React from 'react';
import { HEALTH_FORMULAS, HEALTH_SOURCES_TRUST } from '../healthCategoryData';

export default function HealthMethodsAndSources() {
  return (
    <section className="w-full py-14 px-4 sm:px-6 lg:px-8 bg-surface-container-lowest border-y border-outline-variant/15">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section 1: Health Calculator Methods & Formulas */}
        <div>
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="text-xs uppercase tracking-wider font-semibold text-primary mb-1">
              Transparent Mathematics
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
              Health Calculator Methods &amp; Formulas
            </h2>
            <p className="text-sm sm:text-base text-on-surface-variant mt-2">
              Every calculator on SolveItCalculator implements documented, peer-reviewed mathematical equations. We do not use proprietary black-box algorithms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {HEALTH_FORMULAS.map((spec) => (
              <div
                key={spec.name}
                className="p-5 sm:p-6 rounded-2xl bg-surface border border-outline-variant/30 flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className="font-bold text-on-surface text-base">
                      {spec.name}
                    </h3>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-surface-container text-on-surface-variant shrink-0">
                      {spec.year}
                    </span>
                  </div>

                  <p className="text-xs text-on-surface-variant mb-3">
                    <span className="font-semibold text-on-surface">Calculates: </span>
                    {spec.whatItCalculates}
                  </p>

                  {/* Formula box */}
                  <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 font-mono text-xs text-on-surface whitespace-pre-wrap leading-relaxed mb-3">
                    {spec.formula}
                  </div>

                  <div className="space-y-1.5 text-xs text-on-surface-variant">
                    <div>
                      <span className="font-semibold text-on-surface">Inputs: </span>
                      {spec.inputs}
                    </div>
                    <div>
                      <span className="font-semibold text-on-surface">Units: </span>
                      {spec.units}
                    </div>
                    <div>
                      <span className="font-semibold text-on-surface">Assumptions: </span>
                      {spec.assumptions}
                    </div>
                    <div>
                      <span className="font-semibold text-on-surface text-amber-700 dark:text-amber-400">
                        Limitations:{' '}
                      </span>
                      {spec.limitations}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-outline-variant/15 text-[11px] text-on-surface-variant/70 flex items-center justify-between">
                  <span>Literature Reference:</span>
                  <span className="font-medium text-on-surface truncate ml-2 max-w-[240px]">
                    {spec.source}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Sources & Last Reviewed */}
        <div className="pt-12 border-t border-outline-variant/20">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <span className="material-symbols-outlined text-sm">verified</span>
              Clinical &amp; Evidence Review: September 29, 2026
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
              Sources &amp; Last Reviewed
            </h2>
            <p className="text-sm sm:text-base text-on-surface-variant mt-2">
              Calculators reference standardized guidelines and clinical literature published by established international and national public health bodies. All guidelines, formulas, and references were verified on September 29, 2026.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {HEALTH_SOURCES_TRUST.map((source) => (
              <div
                key={source.organization}
                className="p-5 rounded-2xl bg-surface border border-outline-variant/25 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-base font-bold text-primary">
                      {source.organization}
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant">
                      Rev. {source.lastReviewed}
                    </span>
                  </div>
                  <h3 className="font-bold text-on-surface text-sm mb-1">
                    {source.fullName}
                  </h3>
                  <div className="text-xs text-primary font-medium mb-2">
                    {source.scope}
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    {source.guideline}
                  </p>
                </div>

                <div className="mt-4 pt-2.5 border-t border-outline-variant/15 text-[11px]">
                  <a
                    href={source.referenceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    <span>View Reference Documentation</span>
                    <span className="material-symbols-outlined text-xs">open_in_new</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
