'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  ChevronRight,
  ArrowRight,
  Calculator,
  Search,
  X,
  CheckCircle2,
  UserCheck,
} from 'lucide-react';
import {
  GUIDES_DATA,
  GUIDE_CATEGORIES,
  GuideCategory,
  GuideArticleData,
} from '@/lib/guidesData';

const QUICK_GUIDE_QUERIES = [
  { label: 'Percentage', query: 'percentage' },
  { label: 'Percentage change', query: 'percentage change' },
  { label: 'Fractions', query: 'fractions' },
  { label: 'Compound interest', query: 'compound interest' },
  { label: 'Loan payment', query: 'loan' },
  { label: 'Discounts & margin', query: 'margin' },
  { label: 'Flooring area', query: 'flooring' },
  { label: 'BMI & calories', query: 'bmi' },
  { label: '401(k) & tax', query: 'tax' },
];

export default function GuidesHubClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<
    'All' | GuideCategory
  >('All');

  const featuredGuide = GUIDES_DATA[0];

  const filteredGuides = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return GUIDES_DATA.filter((guide) => {
      const matchesCategory =
        selectedCategory === 'All' || guide.category === selectedCategory;
      if (!matchesCategory) return false;
      if (!q) return true;

      const haystack = [
        guide.title,
        guide.shortTitle,
        guide.category,
        guide.heroIntro,
        guide.section2.fullFormulaText,
        guide.section3.exampleTask,
        ...guide.keywords,
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [searchQuery, selectedCategory]);

  const groupedByCategory = useMemo(() => {
    const categoriesToShow =
      selectedCategory === 'All' ? GUIDE_CATEGORIES : [selectedCategory];

    return categoriesToShow
      .map((cat) => ({
        category: cat,
        guides: filteredGuides.filter((g) => g.category === cat),
      }))
      .filter((group) => group.guides.length > 0);
  }, [filteredGuides, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#152238]">
      {/* Hero Banner with Search & Category Filter Tabs */}
      <section className="border-b border-[#E2E8F0] bg-gradient-to-b from-[#EDF3FF] via-[#F3F7FF] to-[#F5F7FA] pt-6 pb-8">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <nav
            aria-label="Breadcrumb"
            className="mb-4 flex items-center gap-1.5 text-xs sm:text-sm text-[#475569]"
          >
            <Link
              href="/"
              className="hover:text-[#2457D6] transition-colors font-medium"
            >
              Home
            </Link>
            <ChevronRight
              className="w-3.5 h-3.5 text-[#94A3B8]"
              aria-hidden="true"
            />
            <span className="font-semibold text-[#152238]" aria-current="page">
              Math &amp; Calculation Guides
            </span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="flex items-start gap-3.5 max-w-3xl">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#2457D6] text-white flex items-center justify-center shadow-xs shrink-0 mt-0.5">
                <BookOpen className="w-6 h-6 sm:w-7 sm:h-7" aria-hidden="true" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#152238]">
                  Educational Guides &amp; Formula Tutorials
                </h1>
                <p className="mt-2 text-sm sm:text-base text-[#334155] leading-relaxed">
                  Step-by-step explanations, clear mathematical formulas, worked
                  examples, and reference tables for everyday math, finance,
                  home projects, and tax calculations.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/calculators"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#DCE5F2] hover:border-[#2457D6] text-xs sm:text-sm font-bold text-[#152238] hover:text-[#2457D6] shadow-2xs transition-colors whitespace-nowrap"
              >
                <Calculator className="w-4 h-4 text-[#2457D6]" aria-hidden="true" />
                <span>Browse All Calculators</span>
              </Link>
            </div>
          </div>

          {/* Search Bar + Quick Query Suggestions */}
          <div className="mt-6 bg-white rounded-2xl border border-[#DCE5F2] p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search
                  className="w-5 h-5 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search guides by topic or formula (e.g., percentage, compound interest, fractions, flooring, BMI)..."
                  aria-label="Search educational guides"
                  className="w-full pl-11 pr-10 py-3 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] focus:bg-white text-sm sm:text-base text-[#152238] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#2457D6] focus:border-[#2457D6] transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search query"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#E2E8F0] hover:bg-[#CBD5E1] text-[#152238] flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>

            {/* Quick Query Buttons & Category Filter Tabs */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 pt-1 border-t border-[#F1F5F9]">
              {/* Category Filter Segmented Controls */}
              <div
                role="tablist"
                aria-label="Filter guides by category"
                className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0"
              >
                {(['All', ...GUIDE_CATEGORIES] as const).map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] ${
                        isActive
                          ? 'bg-[#2457D6] text-white shadow-2xs'
                          : 'bg-[#F1F5F9] text-[#334155] hover:bg-[#E2E8F0] hover:text-[#152238]'
                      }`}
                    >
                      {cat === 'All' ? 'All Guides' : cat}
                    </button>
                  );
                })}
              </div>

              {/* Popular Guide Queries */}
              <div className="flex items-center flex-wrap gap-1.5 text-xs">
                <span className="font-semibold text-[#64748B] mr-1">
                  Quick topics:
                </span>
                {QUICK_GUIDE_QUERIES.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      setSelectedCategory('All');
                      setSearchQuery(item.query);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-[#F8FAFC] hover:bg-[#EAF1FF] text-[#2457D6] border border-[#E2E8F0] font-semibold transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Featured Flagship Guide Banner (shown when browsing All without an active search filter) */}
        {selectedCategory === 'All' && !searchQuery.trim() && (
          <section aria-labelledby="featured-guide-heading">
            <div className="bg-white rounded-2xl border-2 border-[#C7DCFE] shadow-xs p-6 sm:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-8 space-y-3.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#2457D6]">
                    <span>Featured Step-by-Step Guide</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-[#475569]">Math &amp; Percentages</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#EF5350] to-[#D32F2F] text-white font-extrabold text-xl flex items-center justify-center shrink-0 shadow-2xs"
                    >
                      %
                    </span>
                    <h2
                      id="featured-guide-heading"
                      className="text-2xl sm:text-3xl font-extrabold text-[#152238]"
                    >
                      <Link
                        href={`/guides/${featuredGuide.slug}`}
                        className="hover:text-[#2457D6] transition-colors"
                      >
                        {featuredGuide.title}
                      </Link>
                    </h2>
                  </div>

                  <p className="text-sm sm:text-base text-[#334155] leading-relaxed max-w-2xl">
                    {featuredGuide.heroIntro}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <div className="bg-[#F2F7FF] border border-[#CFE0FC] rounded-xl px-4 py-2 text-sm font-extrabold text-[#152238] tabular-nums">
                      Formula: Result = Percentage × Number ÷ 100
                    </div>
                    <div className="bg-[#EBF7F4] border border-[#BDE5D7] rounded-xl px-3.5 py-2 text-sm font-bold text-[#16856B] tabular-nums flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>Worked Example: 15% of 250 = 37.5</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
                  <Link
                    href={`/guides/${featuredGuide.slug}`}
                    className="inline-flex items-center justify-center gap-2 bg-[#2457D6] hover:bg-[#1D47B0] text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-xs transition-colors whitespace-nowrap"
                  >
                    <span>Read Full Percentage Guide</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                  <Link
                    href={featuredGuide.sidebar.ctaHref}
                    className="inline-flex items-center justify-center gap-2 bg-[#F5F9FF] hover:bg-[#E8F1FF] text-[#2457D6] border border-[#C7DCFE] font-bold text-sm px-5 py-3 rounded-xl transition-colors whitespace-nowrap"
                  >
                    <Calculator className="w-4 h-4" aria-hidden="true" />
                    <span>{featuredGuide.sidebar.ctaButtonLabel}</span>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Grouped Category Sections */}
        {groupedByCategory.length > 0 ? (
          groupedByCategory.map((group) => (
            <section
              key={group.category}
              aria-labelledby={`heading-${group.category}`}
              className="space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#DCE5F2] pb-3">
                <div>
                  <h2
                    id={`heading-${group.category}`}
                    className="text-xl sm:text-2xl font-extrabold text-[#152238]"
                  >
                    {group.category} Guides
                  </h2>
                  <p className="text-xs sm:text-sm text-[#475569] mt-0.5">
                    Complete worked examples, formulas, reference tables, and
                    common pitfalls to avoid.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {group.guides.map((guide: GuideArticleData) => (
                  <article
                    key={guide.slug}
                    className="bg-white rounded-2xl border border-[#DCE5F2] p-5 sm:p-6 shadow-xs flex flex-col justify-between hover:border-[#2457D6]/60 transition-colors"
                  >
                    <div className="space-y-3.5">
                      {/* Unboxed Metadata Line */}
                      <div className="flex items-center justify-between gap-2 text-xs text-[#64748B]">
                        <div className="flex items-center gap-1.5 font-semibold text-[#2457D6]">
                          <span>{guide.breadcrumbCategory}</span>
                          <span aria-hidden="true">·</span>
                          <span className="text-[#64748B] font-medium">
                            9-Section Worked Guide
                          </span>
                        </div>
                        <span
                          aria-hidden="true"
                          className={`px-2.5 py-1 rounded-lg bg-gradient-to-br ${guide.badgeGradient} text-white font-extrabold text-xs shadow-2xs`}
                        >
                          {guide.badgeSymbol}
                        </span>
                      </div>

                      <h3 className="text-lg sm:text-xl font-extrabold text-[#152238] leading-snug">
                        <Link
                          href={`/guides/${guide.slug}`}
                          className="hover:text-[#2457D6] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] rounded"
                        >
                          {guide.title}
                        </Link>
                      </h3>

                      <p className="text-sm text-[#334155] leading-relaxed">
                        {guide.heroIntro}
                      </p>

                      {/* Formula & Worked Example Preview Box */}
                      <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3.5 space-y-2">
                        <div className="flex items-center justify-between gap-2 text-xs">
                          <span className="font-bold text-[#475569]">
                            Core Formula:
                          </span>
                          <span className="font-bold text-[#16856B] tabular-nums">
                            Example: {guide.section3.resultBigValue}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm font-extrabold text-[#152238] tabular-nums truncate">
                          {guide.section2.fullFormulaText}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-[#F1F5F9] flex flex-wrap items-center justify-between gap-3">
                      <Link
                        href={`/guides/${guide.slug}`}
                        className="inline-flex items-center gap-1.5 text-sm font-extrabold text-[#2457D6] hover:text-[#1D47B0] group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] rounded"
                      >
                        <span>Read Full Guide</span>
                        <ArrowRight
                          className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                          aria-hidden="true"
                        />
                      </Link>

                      <Link
                        href={guide.sidebar.ctaHref}
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#475569] hover:text-[#2457D6] underline underline-offset-2"
                      >
                        <Calculator className="w-3.5 h-3.5 text-[#2457D6]" aria-hidden="true" />
                        <span>{guide.sidebar.ctaButtonLabel}</span>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))
        ) : (
          /* Friendly Empty Search State */
          <section
            aria-labelledby="no-guides-heading"
            className="bg-white rounded-2xl border border-[#DCE5F2] p-8 text-center max-w-xl mx-auto space-y-4"
          >
            <h2
              id="no-guides-heading"
              className="text-xl font-extrabold text-[#152238]"
            >
              No guides found matching &ldquo;{searchQuery}&rdquo;
            </h2>
            <p className="text-sm text-[#475569]">
              Try a shorter keyword like{' '}
              <button
                type="button"
                onClick={() => setSearchQuery('percentage')}
                className="text-[#2457D6] font-bold underline cursor-pointer"
              >
                percentage
              </button>
              ,{' '}
              <button
                type="button"
                onClick={() => setSearchQuery('interest')}
                className="text-[#2457D6] font-bold underline cursor-pointer"
              >
                interest
              </button>
              ,{' '}
              <button
                type="button"
                onClick={() => setSearchQuery('fraction')}
                className="text-[#2457D6] font-bold underline cursor-pointer"
              >
                fraction
              </button>
              , or{' '}
              <button
                type="button"
                onClick={() => setSearchQuery('flooring')}
                className="text-[#2457D6] font-bold underline cursor-pointer"
              >
                flooring
              </button>
              , or reset the category filter below.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="px-5 py-2.5 rounded-xl bg-[#2457D6] hover:bg-[#1D47B0] text-white text-sm font-bold transition-colors cursor-pointer"
              >
                Show All {GUIDES_DATA.length} Guides
              </button>
            </div>
          </section>
        )}

        {/* Editorial Standards & Author Note Footer Card */}
        <section
          aria-labelledby="editorial-note-heading"
          className="bg-white rounded-2xl border border-[#DCE5F2] p-6 sm:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        >
          <div className="flex items-start gap-4 max-w-2xl">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2457D6] to-[#152238] text-white flex items-center justify-center font-extrabold text-lg shrink-0 mt-0.5">
              K
            </div>
            <div className="space-y-1.5">
              <h2
                id="editorial-note-heading"
                className="text-base font-extrabold text-[#152238] flex items-center gap-2"
              >
                <span>Written &amp; Reviewed by Krchandan</span>
                <UserCheck className="w-4 h-4 text-[#16856B]" aria-hidden="true" />
              </h2>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                Every SolveItCalculator guide is written in plain English with
                transparent formulas, step-by-step arithmetic, and zero
                clutter—so students, homeowners, and professionals can verify
                every calculation with confidence.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/guides/how-to-calculate-a-percentage"
              className="px-4 py-2.5 rounded-xl bg-[#EAF1FF] hover:bg-[#DCE8FF] text-[#2457D6] text-xs sm:text-sm font-bold transition-colors whitespace-nowrap"
            >
              How to Calculate a Percentage →
            </Link>
            <Link
              href="/calculators"
              className="px-4 py-2.5 rounded-xl border border-[#DCE5F2] hover:border-[#2457D6] text-[#152238] text-xs sm:text-sm font-bold transition-colors whitespace-nowrap"
            >
              All Calculators Directory
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
