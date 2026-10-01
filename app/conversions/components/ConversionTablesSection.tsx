'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CONVERSION_REFERENCE_TABLES } from '../conversionsData';

export default function ConversionTablesSection() {
  const tableKeys = Object.keys(CONVERSION_REFERENCE_TABLES);
  const [activeTableKey, setActiveTableKey] = useState<string>(tableKeys[0]);

  const activeTable = CONVERSION_REFERENCE_TABLES[activeTableKey];

  return (
    <section className="w-full py-14 px-4 sm:px-6 lg:px-8 bg-surface-container-lowest border-y border-outline-variant/15">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs uppercase font-bold tracking-wider text-primary">
            Quick Reference Standards
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            Common Conversion Tables
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant">
            Verified factor definitions for standard measurement pairs. Exact legal and physical definitions are distinguished from rounded working decimals.
          </p>
        </div>

        {/* Table Selector Tabs */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar pb-2">
          {tableKeys.map((key) => {
            const tbl = CONVERSION_REFERENCE_TABLES[key];
            const isActive = activeTableKey === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTableKey(key)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-surface border border-outline-variant/30 text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                }`}
              >
                {tbl.title}
              </button>
            );
          })}
        </div>

        {/* Reference Table Card */}
        <div className="rounded-2xl border border-outline-variant/30 bg-surface overflow-hidden shadow-sm">
          <div className="p-4 sm:p-5 border-b border-outline-variant/15 flex items-center justify-between flex-wrap gap-2 bg-surface-container-low">
            <h3 className="font-bold text-on-surface text-base">
              {activeTable.title} Reference Table
            </h3>
            <span className="text-xs text-on-surface-variant">
              {activeTable.rows.length} standard reference factors
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm divide-y divide-outline-variant/15">
              <thead className="bg-surface-container-lowest text-[11px] uppercase font-bold text-on-surface-variant">
                <tr>
                  <th scope="col" className="px-5 py-3.5">From</th>
                  <th scope="col" className="px-5 py-3.5">To Equivalent</th>
                  <th scope="col" className="px-5 py-3.5">Factor</th>
                  <th scope="col" className="px-5 py-3.5">Relationship</th>
                  <th scope="col" className="px-5 py-3.5">Historical &amp; Legal Standard</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {activeTable.rows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-5 py-3.5 font-semibold text-on-surface whitespace-nowrap">
                      {row.from}
                    </td>
                    <td className="px-5 py-3.5 text-primary font-bold whitespace-nowrap">
                      {row.to}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-on-surface whitespace-nowrap">
                      {row.factorText}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          row.isExact
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                        }`}
                      >
                        {row.isExact ? 'Exact' : 'Rounded'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-on-surface-variant">
                      {row.notes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
