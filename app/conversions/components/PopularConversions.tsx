'use client';

import React from 'react';
import Link from 'next/link';
import { POPULAR_CONVERSION_PAIRS, PopularPair } from '../conversionsData';

interface PopularConversionsProps {
  onSelectPair?: (categoryId: string, fromId: string, toId: string, value?: number) => void;
}

export default function PopularConversions({ onSelectPair }: PopularConversionsProps) {
  return (
    <section className="w-full py-12 px-4 sm:px-6 lg:px-8 bg-surface">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs uppercase font-bold tracking-wider text-primary">
            Quick Conversion Pairs
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            Popular Unit Conversions
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant">
            Frequently calculated conversions across length, weight, temperature, volume, and speed with exact definitions and instant calculations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {POPULAR_CONVERSION_PAIRS.map((pair) => (
            <div
              key={pair.id}
              className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/50 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
                    {pair.categoryName}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      pair.isExact
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                    }`}
                  >
                    {pair.isExact ? 'Exact' : 'Rounded'}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-on-surface text-base group-hover:text-primary transition-colors flex items-center gap-1.5">
                    <span>{pair.fromName}</span>
                    <span className="material-symbols-outlined text-sm text-primary">
                      arrow_forward
                    </span>
                    <span>{pair.toName}</span>
                  </h3>
                  <div className="text-xs font-mono text-on-surface-variant mt-1">
                    {pair.fromSymbol} → {pair.toSymbol}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/15 text-xs">
                  <div className="text-on-surface-variant text-[11px]">Example:</div>
                  <div className="font-bold text-on-surface">
                    {pair.sampleInput} {pair.fromSymbol} = {pair.sampleResult}
                  </div>
                  <div className="text-[10px] text-on-surface-variant/80 mt-0.5 font-mono">
                    {pair.factorText}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-outline-variant/15 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    if (onSelectPair) {
                      onSelectPair(pair.categoryId, pair.fromId, pair.toId, pair.sampleInput);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  <span>Quick Calculate</span>
                  <span className="material-symbols-outlined text-sm">bolt</span>
                </button>

                <Link
                  href={`/conversion/${pair.slug}`}
                  className="text-xs text-on-surface-variant hover:text-primary transition-colors flex items-center gap-0.5"
                  title={`View dedicated ${pair.fromName} to ${pair.toName} converter`}
                >
                  <span>Dedicated Page</span>
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
