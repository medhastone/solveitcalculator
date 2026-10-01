'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export interface GroundingResult {
  locationName: string;
  currency: {
    code: string;
    name: string;
    symbol: string;
    country: string;
  };
  unitSystem: {
    name: string;
    speed: string;
    distance: string;
    mass: string;
    temperature: string;
    fuelEconomy: string;
  };
  exchangeRates: Array<{
    base: string;
    target: string;
    rate: number;
    rateFormatted: string;
    reverseFormatted: string;
    timestamp: string;
  }>;
  summary: string;
  groundingSources?: Array<{
    title: string;
    url: string;
  }>;
  suggestedPairs?: Array<{
    categoryId: string;
    fromUnitId: string;
    toUnitId: string;
    label: string;
  }>;
}

interface CurrencyUnitSearchCardProps {
  initialExpanded?: boolean;
  onApplyPair?: (pair: { categoryId: string; fromUnitId: string; toUnitId: string }) => void;
  className?: string;
}

const POPULAR_SEARCH_PRESETS = [
  'What is currency in Japan & rate to USD?',
  'Current currency & units in UK',
  '100 EUR to USD real-time rate',
  'Units used in Canada for temperature & speed',
  'Currency in Switzerland & live exchange'
];

export default function CurrencyUnitSearchCard({
  initialExpanded = true,
  onApplyPair,
  className = ''
}: CurrencyUnitSearchCardProps) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState<boolean>(initialExpanded);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<GroundingResult | null>(null);
  const [userDetectedLocale, setUserDetectedLocale] = useState<{
    locale: string;
    timeZone: string;
    detectedCode: string;
  } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  // Detect locale heuristics on mount
  useEffect(() => {
    try {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
      const locale = navigator.language || 'en-US';

      let detectedCode = 'USD';
      if (timeZone.includes('London') || locale.toLowerCase().includes('gb')) detectedCode = 'GBP';
      else if (
        timeZone.includes('Berlin') ||
        timeZone.includes('Paris') ||
        timeZone.includes('Rome') ||
        timeZone.includes('Madrid')
      )
        detectedCode = 'EUR';
      else if (timeZone.includes('Tokyo') || locale.toLowerCase().includes('ja')) detectedCode = 'JPY';
      else if (timeZone.includes('Kolkata') || locale.toLowerCase().includes('in')) detectedCode = 'INR';
      else if (timeZone.includes('Toronto') || locale.toLowerCase().includes('ca')) detectedCode = 'CAD';
      else if (timeZone.includes('Sydney') || locale.toLowerCase().includes('au')) detectedCode = 'AUD';

      setUserDetectedLocale({ locale, timeZone, detectedCode });
    } catch {
      setUserDetectedLocale({ locale: 'en-US', timeZone: 'UTC', detectedCode: 'USD' });
    }
  }, []);

  // Fetch grounding query
  const performGroundingSearch = useCallback(
    async (queryText?: string) => {
      setIsLoading(true);
      try {
        const payload = {
          query: queryText !== undefined ? queryText : searchQuery,
          locale: userDetectedLocale?.locale || 'en-US',
          timeZone: userDetectedLocale?.timeZone || 'UTC'
        };

        const res = await fetch('/api/currency-grounding', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          throw new Error('Failed to retrieve live currency grounding');
        }

        const data: GroundingResult = await res.json();
        setResult(data);
        setIsExpanded(true);
      } catch (err: unknown) {
        console.error('Error fetching grounding search:', err);
        showToast('Could not fetch live search data. Showing local estimate.');
      } finally {
        setIsLoading(false);
      }
    },
    [searchQuery, userDetectedLocale]
  );

  // Handle Apply to Converter
  const handleApply = (pair: { categoryId: string; fromUnitId: string; toUnitId: string }) => {
    if (onApplyPair) {
      onApplyPair(pair);
      showToast(`Applied ${pair.fromUnitId.toUpperCase()} ➔ ${pair.toUnitId.toUpperCase()} to calculator!`);
    } else {
      // Map currency or units to standard route
      const slug = `${pair.fromUnitId.toLowerCase()}-to-${pair.toUnitId.toLowerCase()}`;
      router.push(`/conversion/${slug}`);
    }
  };

  return (
    <div
      className={`rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm transition-all overflow-hidden ${className}`}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <span className="material-symbols-outlined text-emerald-400 dark:text-emerald-600 text-base">
            check_circle
          </span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="p-5 sm:p-6 bg-slate-50/70 dark:bg-slate-950/40 border-b border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-primary flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900/40">
            <span className="material-symbols-outlined text-2xl">currency_exchange</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                Google Search Grounding
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Real-Time Rates</span>
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              What is My Current Currency &amp; Unit?
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Auto-Detect Button */}
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              performGroundingSearch('');
            }}
            disabled={isLoading}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-primary font-bold text-xs border border-blue-200/80 dark:border-blue-800/60 transition-colors cursor-pointer disabled:opacity-50"
            title="Auto-detect local currency and unit standards based on browser locale and time zone"
          >
            <span className="material-symbols-outlined text-base">my_location</span>
            <span>Detect My Currency</span>
          </button>

          {/* Toggle Expand/Collapse */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label={isExpanded ? 'Collapse search' : 'Expand search'}
          >
            <span
              className={`material-symbols-outlined text-xl transition-transform duration-200 ${
                isExpanded ? 'rotate-180' : ''
              }`}
            >
              expand_more
            </span>
          </button>
        </div>
      </div>

      {/* Collapsible Search & Content Zone */}
      {isExpanded && (
        <div className="p-5 sm:p-6 space-y-6">
          {/* Natural Language Search Input */}
          <div className="space-y-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                performGroundingSearch(searchQuery);
              }}
              className="relative flex items-center"
            >
              <span className="material-symbols-outlined absolute left-4 text-slate-400 text-xl pointer-events-none">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ask e.g. 'What is the currency in Tokyo and rate to USD?' or 'Units used in Canada'"
                className="w-full pl-11 pr-28 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="absolute right-2 px-4 py-2 rounded-xl bg-primary hover:bg-sky-600 text-white font-bold text-xs transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1"
              >
                {isLoading ? (
                  <>
                    <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <span>Search</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none text-[11px] text-slate-500 dark:text-slate-400">
              <span className="shrink-0 font-medium">Try asking:</span>
              {POPULAR_SEARCH_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    setSearchQuery(preset);
                    performGroundingSearch(preset);
                  }}
                  className="shrink-0 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-colors cursor-pointer"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Loading Skeleton */}
          {isLoading && (
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-850/40 border border-slate-200/80 dark:border-slate-800 space-y-4 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="h-6 w-48 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="h-20 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
                <div className="h-20 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
                <div className="h-20 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
              </div>
              <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
            </div>
          )}

          {/* Result Card */}
          {result && !isLoading && (
            <div className="space-y-5 animate-in fade-in duration-300">
              {/* Primary Identity & Summary Bar */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200/80 dark:border-blue-900/50 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📍</span>
                    <span className="font-bold text-slate-900 dark:text-white text-base">
                      {result.locationName}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-primary">
                      {result.currency.code} ({result.currency.symbol})
                    </span>
                  </div>
                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    System: {result.unitSystem.name}
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {result.summary}
                </p>
              </div>

              {/* Real-Time Exchange Rate Cards */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-base">trending_up</span>
                    <span>Live Market Exchange Rates</span>
                  </span>
                  <span className="text-[11px] font-normal text-slate-400">
                    Google Grounded • Updated Live
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {result.exchangeRates.map((ex, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-primary/50 transition-all space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="font-mono font-bold text-slate-900 dark:text-white">
                          {ex.base} ➔ {ex.target}
                        </span>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded">
                          Live
                        </span>
                      </div>
                      <div className="text-lg font-mono font-black text-primary">
                        {ex.rateFormatted}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">
                        {ex.reverseFormatted}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Regional Unit Standards Matrix */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-base">straighten</span>
                  <span>Standard Regional Measurement Conventions</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 space-y-1">
                    <div className="text-[11px] text-slate-400 font-medium">Road Speed</div>
                    <div className="font-bold text-slate-900 dark:text-white">{result.unitSystem.speed}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 space-y-1">
                    <div className="text-[11px] text-slate-400 font-medium">Distance</div>
                    <div className="font-bold text-slate-900 dark:text-white">{result.unitSystem.distance}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 space-y-1">
                    <div className="text-[11px] text-slate-400 font-medium">Mass &amp; Weight</div>
                    <div className="font-bold text-slate-900 dark:text-white">{result.unitSystem.mass}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 space-y-1">
                    <div className="text-[11px] text-slate-400 font-medium">Temperature</div>
                    <div className="font-bold text-slate-900 dark:text-white">
                      {result.unitSystem.temperature}
                    </div>
                  </div>
                </div>
              </div>

              {/* 1-Click Apply to Converter Row */}
              {result.suggestedPairs && result.suggestedPairs.length > 0 && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      Apply Detected Units to Active Converter
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      Instantly configure your conversion calculator for this regional standard:
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.suggestedPairs.map((pair, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleApply(pair)}
                        className="px-3 py-1.5 rounded-xl bg-primary hover:bg-sky-600 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm">tune</span>
                        <span>Apply {pair.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Google Search Grounding Sources */}
              {result.groundingSources && result.groundingSources.length > 0 && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
                  <div className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-primary">verified</span>
                    <span>Google Search Grounding Verified Sources:</span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    {result.groundingSources.map((source, sIdx) => (
                      <a
                        key={sIdx}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline inline-flex items-center gap-0.5"
                      >
                        <span>{source.title}</span>
                        <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
