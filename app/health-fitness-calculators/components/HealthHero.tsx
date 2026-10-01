'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { HEALTH_CATALOG, HealthTool } from '../healthCategoryData';

const POPULAR_SEARCH_SHORTCUTS = [
  { label: 'BMI', query: 'BMI', path: '/health-fitness-calculators/bmi' },
  { label: 'Calories', query: 'Calories', path: '/health-fitness-calculators/deficit' },
  { label: 'BMR', query: 'BMR', path: '/health-fitness-calculators/bmr' },
  { label: 'TDEE', query: 'TDEE', path: '/health-fitness-calculators/tdee' },
  { label: 'Body Fat', query: 'Body Fat', path: '/health-fitness-calculators/navy-fat' },
  { label: 'Protein', query: 'Protein', path: '/health-fitness-calculators/protein-rda' },
  { label: 'Water Intake', query: 'Water Intake', path: '/health-fitness-calculators/water-matrix' },
  { label: 'Running Pace', query: 'Running Pace', path: '/health-fitness-calculators/running-pace' },
  { label: 'Due Date', query: 'Due Date', path: '/health-fitness-calculators/due-date' },
  { label: 'Heart Rate', query: 'Heart Rate', path: '/health-fitness-calculators/thr' },
];

export default function HealthHero() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Global keyboard shortcut: / or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === '/' || (e.key === 'k' && (e.metaKey || e.ctrlKey))) && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === 'Escape' && document.activeElement === searchInputRef.current) {
        searchInputRef.current?.blur();
        setIsFocused(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter calculators by query
  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];

    return HEALTH_CATALOG.filter((tool) => {
      const matchName = tool.name.toLowerCase().includes(query);
      const matchDesc = tool.shortDesc.toLowerCase().includes(query);
      const matchCat = tool.category.toLowerCase().includes(query);
      const matchKeyword = tool.keywords.some((kw) => kw.toLowerCase().includes(query));
      return matchName || matchDesc || matchCat || matchKeyword;
    }).slice(0, 8);
  }, [searchQuery]);

  return (
    <section className="relative w-full bg-gradient-to-b from-surface-container-lowest via-surface to-surface-container-low/40 border-b border-outline-variant/15 pt-8 pb-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-on-surface-variant/80">
            <li>
              <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
                <span className="material-symbols-outlined text-base">home</span>
                Home
              </Link>
            </li>
            <li className="text-outline-variant/60">/</li>
            <li className="text-on-surface font-medium" aria-current="page">
              Health &amp; Fitness Calculators
            </li>
          </ol>
        </nav>

        {/* Hero Content */}
        <div className="text-center max-w-4xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
            <span className="material-symbols-outlined text-sm">health_metrics</span>
            Evidence-Based Wellness Planning
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-on-surface tracking-tight leading-tight mb-4">
            Health &amp; Fitness Calculators for Smarter Wellness Planning
          </h1>

          <p className="text-lg sm:text-xl text-on-surface-variant leading-relaxed max-w-3xl mx-auto">
            Explore health and fitness calculators for body measurements, calories, nutrition, exercise, sleep, and pregnancy dates with clear explanations and stated assumptions.
          </p>
        </div>

        {/* Hero Search Box */}
        <div className="max-w-2xl mx-auto relative mb-6">
          <div className="text-center mb-2.5">
            <label htmlFor="health-search-input" className="text-xs uppercase tracking-wider font-semibold text-on-surface-variant/90">
              What Do You Want to Calculate?
            </label>
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-on-surface-variant">
              <span className="material-symbols-outlined text-2xl group-focus-within:text-primary transition-colors">
                search
              </span>
            </div>

            <input
              ref={searchInputRef}
              id="health-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              placeholder="Try “BMI”, “calories”, “BMR”, “TDEE”, “body fat”, “protein”, or “due date”"
              className="w-full pl-12 pr-24 py-3.5 sm:py-4 bg-surface-container-lowest border border-outline-variant/40 rounded-2xl text-on-surface placeholder:text-on-surface-variant/60 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-base transition-all"
            />

            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center gap-1.5 pointer-events-none text-xs text-on-surface-variant/60 font-mono">
              <kbd className="hidden sm:inline-block px-2 py-0.5 rounded bg-surface-container border border-outline-variant/40 text-[11px]">
                /
              </kbd>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="pointer-events-auto p-1 text-on-surface-variant hover:text-on-surface"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              )}
            </div>
          </div>

          {/* Real-time search dropdown */}
          {isFocused && searchQuery.trim().length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-xl z-50 overflow-hidden divide-y divide-outline-variant/10">
              {searchResults.length > 0 ? (
                <div>
                  <div className="px-4 py-2 bg-surface-container-low/60 text-xs font-semibold text-on-surface-variant uppercase tracking-wider flex justify-between">
                    <span>Matching Health Calculators</span>
                    <span>{searchResults.length} found</span>
                  </div>
                  {searchResults.map((tool) => (
                    <Link
                      key={tool.id}
                      href={tool.path}
                      className="flex items-center justify-between px-4 py-3 hover:bg-surface-container transition-colors group"
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-4">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-xl">{tool.icon}</span>
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-on-surface group-hover:text-primary transition-colors text-sm truncate">
                            {tool.name}
                          </div>
                          <div className="text-xs text-on-surface-variant truncate">
                            {tool.shortDesc}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="hidden sm:inline-block text-[11px] px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-medium">
                          {tool.category}
                        </span>
                        <span className="text-xs font-semibold text-primary flex items-center group-hover:translate-x-0.5 transition-transform">
                          Calculate <span className="material-symbols-outlined text-sm ml-0.5">arrow_forward</span>
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-sm text-on-surface-variant">
                  <span className="material-symbols-outlined text-3xl text-outline-variant mb-1 block">search_off</span>
                  No health calculators matched &ldquo;<span className="font-medium text-on-surface">{searchQuery}</span>&rdquo;.
                  <div className="text-xs mt-1 text-on-surface-variant/80">
                    Try searching for “BMI”, “calories”, “heart rate”, or browse categories below.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Popular Search Shortcuts */}
        <div className="max-w-3xl mx-auto flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs font-medium text-on-surface-variant/80 mr-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">trending_up</span>
            Popular:
          </span>
          {POPULAR_SEARCH_SHORTCUTS.map((item) => (
            <Link
              key={item.label}
              href={item.path}
              className="px-3 py-1 text-xs font-medium rounded-full bg-surface-container-low hover:bg-primary/10 hover:text-primary text-on-surface border border-outline-variant/30 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
