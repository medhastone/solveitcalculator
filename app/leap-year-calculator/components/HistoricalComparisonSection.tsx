'use client';

import React from 'react';
import { HISTORICAL_CENTURY_ROWS } from '../utils';

export default function HistoricalComparisonSection() {
  return (
    <section className="max-w-max-width-canvas mx-auto w-full flex flex-col gap-space-md" id="historical-chronology">
      <div>
        <span className="font-label-caps text-label-caps uppercase text-primary tracking-wider font-semibold">
          Historical Chronology
        </span>
        <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
          Gregorian vs. Julian Calendar Systems
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Julius Caesar introduced leap years in 45 BCE with a simple rule: every 4th year without exception. Over 16 centuries, this caused a 10-day discrepancy against the seasons.
        </p>
      </div>

      {/* Comparative Benchmark Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-md overflow-hidden flex flex-col border border-outline-variant/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body-sm text-body-sm">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant font-label-caps text-label-caps uppercase border-b border-outline-variant/15">
                <th className="py-space-sm px-space-md">Century Year</th>
                <th className="py-space-sm px-space-md">Gregorian Rule (÷400)</th>
                <th className="py-space-sm px-space-md">Old Julian Rule (÷4)</th>
                <th className="py-space-sm px-space-md">DAYS DRIFTED</th>
                <th className="py-space-sm px-space-md">WHAT HAPPENED</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low text-on-surface font-data-mono">
              {HISTORICAL_CENTURY_ROWS.map((row) => (
                <tr key={row.year} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-space-sm px-space-md font-bold">{row.year}</td>
                  <td
                    className={`py-space-sm px-space-md font-bold ${
                      row.isCenturyLeap ? 'text-primary' : 'text-outline'
                    }`}
                  >
                    {row.gregorianRule}
                  </td>
                  <td className="py-space-sm px-space-md text-secondary">{row.julianRule}</td>
                  <td
                    className={`py-space-sm px-space-md ${
                      row.isCenturyLeap ? 'text-on-surface-variant' : 'text-primary font-bold'
                    }`}
                  >
                    {row.daysDrifted}
                  </td>
                  <td className="py-space-sm px-space-md font-sans text-body-sm text-on-surface-variant">
                    {row.whatHappened}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Proleptic Warning Callout Card */}
      <div className="p-space-md rounded-xl bg-surface-container-high flex items-start gap-space-sm border border-outline-variant/20">
        <span className="material-symbols-outlined text-secondary shrink-0 mt-0.5 text-[24px]">info</span>
        <div className="flex flex-col gap-1">
          <span className="font-headline-md text-body-lg font-bold text-on-surface">
            What is the Proleptic Gregorian Calendar?
          </span>
          <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
            The Gregorian calendar was legislated on <strong>October 15, 1582</strong>. When calculating dates prior to 1582 (such as the year 1200 or 44 BCE), computer science and the ISO 8601 specification apply the modern Gregorian rules retrospectively. This mathematical projection is termed the <em>Proleptic Gregorian Calendar</em>. If modeling historical records in England before 1752 or Russia before 1918, Julian dates must be reconciled.
          </p>
        </div>
      </div>
    </section>
  );
}
