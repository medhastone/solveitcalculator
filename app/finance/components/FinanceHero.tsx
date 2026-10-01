'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { FinanceTool, WORLD_CURRENCIES } from '../financeData';

interface FinanceHeroProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCurrency: string;
  setSelectedCurrency: (c: string) => void;
  filteredTools: FinanceTool[];
}

const POPULAR_SEARCH_TERMS = [
  'Mortgage',
  'Loan',
  'EMI',
  'SIP',
  'Compound Interest',
  'Investment',
  'Retirement',
  'Tax',
  'Salary',
  'Credit Card',
  'Savings',
  'Inflation',
];

export default function FinanceHero({
  searchQuery,
  setSearchQuery,
  selectedCurrency,
  setSelectedCurrency,
  filteredTools,
}: FinanceHeroProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener: Cmd+K / Ctrl+K or /
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const hasSearch = searchQuery.trim().length > 0;

  return (
    <div className="w-full">
      {/* Top Utility Bar with Breadcrumb and Currency Switcher */}
      <div className="w-full bg-surface-container-lowest border-b border-outline-variant/30 py-2.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-on-surface-variant font-medium">
            <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">home</span>
              <span>Home</span>
            </Link>
            <span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
            <span className="text-on-surface font-semibold">Finance Calculators</span>
          </nav>

          <div className="flex items-center gap-2">
            <label htmlFor="currency-switcher" className="text-on-surface-variant font-medium flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-primary">payments</span>
              <span>Display Currency:</span>
            </label>
            <select
              id="currency-switcher"
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="bg-surface-container-low hover:bg-surface-container border border-outline-variant/40 rounded-lg px-2.5 py-1 text-on-surface font-semibold text-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40"
              aria-label="Select display currency"
            >
              {WORLD_CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.code} ({c.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Hero Section */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 sm:pt-14 sm:pb-16 text-center">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 max-w-3xl h-64 bg-gradient-to-tr from-primary/10 via-secondary/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-on-surface tracking-tight">
            Finance Calculators for Smarter Money Decisions
          </h1>

          <p className="text-base sm:text-lg text-on-surface-variant max-w-3xl mx-auto leading-relaxed">
            Calculate loans, mortgages, investments, savings, retirement, taxes, debt, and more. Compare scenarios,
            understand the math, and see what changes your result.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 pb-4">
            <a
              href="#finance-search"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary font-semibold text-sm shadow-sm hover:opacity-95 active:scale-[0.98] transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">search</span>
              <span>Find a Finance Calculator</span>
            </a>
            <a
              href="#scenario-comparison"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/40 text-on-surface font-semibold text-sm shadow-xs transition-all"
            >
              <span className="material-symbols-outlined text-[18px] text-primary">compare_arrows</span>
              <span>Compare Financial Scenarios</span>
            </a>
          </div>

          {/* Interactive Search Bar Section */}
          <div id="finance-search" className="w-full max-w-2xl mx-auto pt-2 text-left scroll-mt-20">
            <label
              htmlFor="calculator-search-input"
              className="block text-sm sm:text-base font-bold text-on-surface text-center mb-2"
            >
              What do you want to calculate?
            </label>

            <div className="relative flex items-center bg-surface-container-lowest rounded-2xl p-2 shadow-lg border border-outline-variant/30 focus-within:ring-2 focus-within:ring-primary/40 transition-all">
              <span className="material-symbols-outlined text-primary text-[22px] ml-2 mr-1">search</span>
              <input
                ref={searchInputRef}
                id="calculator-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setSearchQuery('');
                }}
                placeholder="Try “mortgage payment”, “SIP”, “loan payoff”, “retirement”, “tax”, or “salary”"
                className="w-full bg-transparent border-0 outline-none text-sm sm:text-base text-on-surface placeholder:text-outline py-2 px-2"
                autoComplete="off"
              />
              {hasSearch && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1 mr-1 text-on-surface-variant hover:text-on-surface rounded-full hover:bg-surface-container transition-colors"
                  title="Clear search"
                  aria-label="Clear search"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              )}
              <div className="hidden sm:flex items-center gap-1 pr-2">
                <kbd className="text-[11px] font-mono px-2 py-1 rounded bg-surface-container text-on-surface-variant">
                  ⌘K
                </kbd>
              </div>
            </div>

            {/* Popular Searches */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3 text-xs">
              <span className="text-on-surface-variant font-medium mr-1">Popular searches:</span>
              {POPULAR_SEARCH_TERMS.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setSearchQuery(term)}
                  className={`px-2.5 py-1 rounded-lg transition-colors font-medium ${
                    searchQuery.toLowerCase() === term.toLowerCase()
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Search Results (When Typing) */}
        {hasSearch && (
          <div className="max-w-4xl mx-auto mt-8 text-left bg-surface-container-lowest rounded-2xl p-5 sm:p-6 shadow-xl border border-primary/20 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">manage_search</span>
                <span className="font-bold text-on-surface text-base">
                  Search results for &ldquo;{searchQuery}&rdquo;
                </span>
                <span className="text-xs text-on-surface-variant">({filteredTools.length} found)</span>
              </div>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs font-semibold text-on-surface-variant hover:text-on-surface hover:underline"
              >
                Clear
              </button>
            </div>

            {filteredTools.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
                {filteredTools.map((tool) => (
                  <div
                    key={tool.id}
                    className="p-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/20 hover:border-primary/40 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[11px] font-semibold text-primary uppercase tracking-wider">
                          {tool.category}
                        </span>
                        {tool.badge && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-bold">
                            {tool.badge}
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-sm text-on-surface">{tool.name}</h3>
                      <p className="text-xs text-on-surface-variant mt-1 line-clamp-2 leading-relaxed">
                        {tool.description}
                      </p>
                    </div>
                    <Link
                      href={tool.path}
                      className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline mt-3"
                    >
                      <span>Calculate</span>
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-sm text-on-surface-variant">
                <p>No calculators matched &ldquo;{searchQuery}&rdquo;.</p>
                <p className="text-xs mt-1">Try searching for &ldquo;mortgage&rdquo;, &ldquo;loan&rdquo;, &ldquo;tax&rdquo;, or &ldquo;savings&rdquo;.</p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
