'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Clock,
  Calendar,
  ArrowRightLeft,
  Hourglass,
  Timer,
  BookOpen,
  Search,
  Sparkles,
  ArrowRight,
  Calculator,
  Flame,
  ShieldCheck,
} from 'lucide-react';
import { TIME_CATEGORIES, getAllTimeTools, TimeToolCategory } from '@/lib/time-date/data';

export default function TimeDateClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const allTools = useMemo(() => getAllTimeTools(), []);

  // Filter tools based on search and category
  const filteredTools = useMemo(() => {
    return allTools.filter((tool) => {
      const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.metaDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [allTools, selectedCategory, searchQuery]);

  const categoryIcons: Record<TimeToolCategory, React.ReactNode> = {
    core: <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
    'date-calculators': <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
    'age-calculators': <Calculator className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
    'time-conversion': <ArrowRightLeft className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
    countdown: <Hourglass className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
    timers: <Timer className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
    calendar: <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
    'time-zones': <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
    guides: <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
  };

  const featuredTools = useMemo(
    () => [
      allTools.find((t) => t.slug === 'time-calculator'),
      allTools.find((t) => t.slug === 'age-calculator'),
      allTools.find((t) => t.slug === 'days-between-dates-calculator'),
      allTools.find((t) => t.slug === 'business-day-calculator'),
      allTools.find((t) => t.slug === 'time-converter'),
      allTools.find((t) => t.slug === 'countdown-timer'),
      allTools.find((t) => t.slug === '25-minute-timer'),
      allTools.find((t) => t.slug === 'todays-date'),
    ].filter(Boolean),
    [allTools]
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Hero Section */}
      <section className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-3">
            <Sparkles className="w-4 h-4" />
            <span>Time & Date Calculation Ecosystem</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mb-4 max-w-3xl">
            Time & Date Calculators
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-3xl mb-8 leading-relaxed">
            High-precision calculators, bidirectional unit converters, live countdown timers, and calendar intelligence tools. Designed for exact chronological math, payroll shifts, and project milestones.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search 50+ time calculators (e.g. age, work hours, countdown, military time)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm shadow-sm"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 border border-slate-200 dark:border-slate-800'
            }`}
          >
            All Tools ({allTools.length})
          </button>
          {TIME_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {cat.name} ({cat.count})
            </button>
          ))}
        </div>

        {/* Popular Tools Showcase (when not searching and 'all' selected) */}
        {selectedCategory === 'all' && searchQuery.trim() === '' && (
          <div className="mb-14">
            <div className="flex items-center gap-2 mb-6">
              <Flame className="w-5 h-5 text-amber-500" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Popular Time & Date Tools
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredTools.map((tool) => tool && (
                <Link
                  key={tool.slug}
                  href={tool.canonicalPath}
                  className="group p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-indigo-500 dark:hover:border-indigo-500 shadow-sm transition-all"
                >
                  <div className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-1.5">
                    {tool.subcategoryTitle}
                  </div>
                  <div className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2">
                    {tool.name}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {tool.metaDescription}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Directory Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {selectedCategory === 'all'
                ? 'All Time & Date Tools'
                : TIME_CATEGORIES.find((c) => c.id === selectedCategory)?.name}
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Showing {filteredTools.length} {filteredTools.length === 1 ? 'tool' : 'tools'}
            </span>
          </div>

          {filteredTools.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <Clock className="w-8 h-8 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                No calculators found matching &ldquo;{searchQuery}&rdquo;.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                Reset Search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredTools.map((tool) => (
                <Link
                  key={tool.slug}
                  href={tool.canonicalPath}
                  className="group p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-indigo-500 dark:hover:border-indigo-500 shadow-sm transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {tool.subcategoryTitle}
                      </span>
                      <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium capitalize">
                        {tool.searchIntent}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2">
                      {tool.name}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3 mb-4">
                      {tool.metaDescription}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    <span>Open Calculator</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Topic Hub Guides & Standards */}
        <section className="mt-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Timekeeping & Calendar Knowledge Base
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <Link
              href="/time-date/guides/gregorian-leap-year-guide"
              className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60 hover:border-indigo-500 transition-all"
            >
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-1">
                Leap Year Mathematics
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3">
                How the Gregorian 400-year cycle eliminates calendar drift and preserves seasonal alignment.
              </p>
            </Link>

            <Link
              href="/time-date/guides/military-time-24-hour-clock-guide"
              className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60 hover:border-indigo-500 transition-all"
            >
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-1">
                24-Hour & Military Time
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3">
                Reading 4-digit military timestamps and spoken phonetics across aviation and medicine.
              </p>
            </Link>

            <Link
              href="/time-date/guides/decimal-hours-vs-clock-time-guide"
              className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/60 hover:border-indigo-500 transition-all"
            >
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-1">
                Decimal Hours for Payroll
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3">
                Converting base-60 clock minutes into base-10 decimal fractions for accurate timesheet billing.
              </p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
