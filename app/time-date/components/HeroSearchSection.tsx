'use client';

import React, { useState, useRef, useMemo } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, X, Calendar, Clock, Sparkles } from 'lucide-react';
import { ALL_TOOLS_CATALOG, ToolItem } from '../data/timeDateData';

interface HeroSearchSectionProps {
  onSelectTool?: (tool: ToolItem) => void;
}

const SAMPLE_SEARCHES = [
  'my age',
  'days between dates',
  '90 days from today',
  'workdays',
  'time difference',
  'countdown',
  'meeting',
];

export default function HeroSearchSection({ onSelectTool }: HeroSearchSectionProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredTools = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return ALL_TOOLS_CATALOG.filter((tool) => {
      const matchName = tool.name.toLowerCase().includes(q);
      const matchDesc = tool.desc.toLowerCase().includes(q);
      const matchCat = tool.category.toLowerCase().includes(q);
      const matchBadge = tool.badge.toLowerCase().includes(q);

      // Search intent heuristics
      let matchIntent = false;
      if (q === 'age' || q === 'my age' || q === 'birthday') {
        matchIntent = tool.id === 'age-calculator' || tool.id === 'birthday-tracker';
      } else if (q.includes('between') || q.includes('diff')) {
        matchIntent = tool.id === 'days-between-dates' || tool.id === 'date-difference';
      } else if (q.includes('90 days') || q.includes('add') || q.includes('subtract')) {
        matchIntent = tool.id === 'days-calculator' || tool.id === 'add-subtract-time';
      } else if (q.includes('work') || q.includes('business')) {
        matchIntent = tool.id === 'business-days-calculator' || tool.id === 'work-hours';
      } else if (q.includes('count') || q.includes('timer')) {
        matchIntent = tool.id === 'event-countdown' || tool.id === 'birthday-tracker' || tool.id === 'retirement-countdown-in-workdays';
      } else if (q.includes('zone') || q.includes('time') || q.includes('meeting')) {
        matchIntent = tool.id === 'time-zone-converter' || tool.id === 'time-zone-overlap' || tool.id === 'world-clock-grid';
      }

      return matchName || matchDesc || matchCat || matchBadge || matchIntent;
    }).slice(0, 8);
  }, [query]);

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <section className="w-full bg-gradient-to-b from-surface-container-low via-surface to-surface pt-10 pb-16 border-b border-outline-variant/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Category Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase mb-4">
          <Calendar className="w-3.5 h-3.5" />
          <span>SolveItCalculator Time &amp; Date Hub</span>
        </div>

        {/* H1 and Positioning */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-on-surface tracking-tight leading-tight mb-3">
          Time &amp; Date Calculators
        </h1>

        <p className="text-xl sm:text-2xl font-bold text-primary mb-2">
          Time &amp; Date Calculators for Better Planning and Productivity
        </p>

        <p className="text-base sm:text-lg text-on-surface-variant max-w-2xl mx-auto mb-8 leading-relaxed text-center">
          Calculate age, date differences, business days, time duration, time zones, deadlines, and countdowns accurately.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
          <a
            href="#tool-search"
            className="px-6 py-3 rounded-xl bg-primary text-on-primary font-semibold shadow-md hover:bg-primary/90 transition-all flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>Find a Time &amp; Date Calculator</span>
          </a>
          <a
            href="#popular-tools"
            className="px-6 py-3 rounded-xl bg-surface-container-high text-on-surface font-semibold hover:bg-surface-container-highest transition-all flex items-center gap-2 border border-outline-variant/40"
          >
            <Clock className="w-4 h-4" />
            <span>Browse All Time &amp; Date Tools</span>
          </a>
        </div>

        {/* Search Card */}
        <div
          id="tool-search"
          className="max-w-3xl mx-auto bg-surface-container-lowest rounded-2xl p-6 sm:p-8 shadow-xl border border-outline-variant/40 text-left relative"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <Search className="w-5 h-5 text-primary" />
              <span>What Do You Need to Calculate?</span>
            </h2>
            <span className="text-xs text-on-surface-variant hidden sm:inline-block font-mono bg-surface-container px-2 py-0.5 rounded">
              Press ⌘K or / to search
            </span>
          </div>

          {/* Search Input Box */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-on-surface-variant">
              <Search className="w-5 h-5" />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              placeholder="Try “my age”, “days between dates”, “90 days from today”, “workdays”, “time difference”, or “countdown”"
              className="w-full pl-12 pr-10 py-3.5 bg-surface-container-low border border-outline-variant/60 rounded-xl text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base transition-all"
              aria-label="Search Time and Date Calculators"
            />
            {query && (
              <button
                onClick={handleClear}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-on-surface-variant hover:text-on-surface"
                aria-label="Clear search"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Popular Search Suggestions */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-on-surface-variant">
            <span className="font-semibold text-on-surface mr-1">Popular:</span>
            {SAMPLE_SEARCHES.map((chip) => (
              <button
                key={chip}
                onClick={() => {
                  setQuery(chip);
                  inputRef.current?.focus();
                }}
                className="px-2.5 py-1 rounded-md bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors border border-outline-variant/30"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Search Results Display */}
          {query.trim().length > 0 && (
            <div className="mt-4 pt-4 border-t border-outline-variant/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Matching Calculators ({filteredTools.length})
                </span>
                <span className="text-xs text-on-surface-variant">
                  Instant results
                </span>
              </div>

              {filteredTools.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-96 overflow-y-auto pr-1">
                  {filteredTools.map((tool) => (
                    <Link
                      key={tool.id}
                      href={tool.anchor}
                      onClick={() => onSelectTool?.(tool)}
                      className="group p-3 rounded-xl bg-surface-container-low hover:bg-primary/5 hover:border-primary/50 border border-outline-variant/30 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-semibold text-sm text-on-surface group-hover:text-primary transition-colors">
                            {tool.name}
                          </span>
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-medium">
                            {tool.category}
                          </span>
                        </div>
                        <p className="text-xs text-on-surface-variant line-clamp-2 mb-2">
                          {tool.desc}
                        </p>
                      </div>
                      <div className="flex items-center text-xs font-semibold text-primary group-hover:translate-x-0.5 transition-transform">
                        <span>Calculate</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-on-surface-variant text-sm">
                  <p className="font-medium text-on-surface mb-1">No exact calculator found for &ldquo;{query}&rdquo;</p>
                  <p className="text-xs">
                    Try searching for &quot;age&quot;, &quot;days&quot;, &quot;work&quot;, or browse our categories below.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
