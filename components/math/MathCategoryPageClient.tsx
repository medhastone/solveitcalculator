'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  X,
  Percent,
  BarChart2,
  Calculator,
  Grid,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  Flame,
  FolderOpen,
  Lightbulb,
  Settings,
  HelpCircle,
  LayoutGrid,
  Coins,
  ArrowLeftRight,
  Calendar,
  Heart,
  BarChart3,
  FlaskConical,
  Share2,
} from 'lucide-react';
import {
  MATH_CALCULATORS,
  MATH_FILTER_CATEGORIES,
  MathFilterCategory,
  MathCalculatorItem,
  MathSymbolBadgeType,
  MATH_CHOOSE_STEPS,
  MATH_FAQS,
} from '@/lib/mathCalculatorsData';

export function MathSymbolBadge({
  type,
  size = 'md',
}: {
  type: MathSymbolBadgeType;
  size?: 'sm' | 'md';
}) {
  const boxSize = size === 'sm' ? 'w-8 h-8 rounded-lg' : 'w-12 h-12 rounded-xl';
  const textSize = size === 'sm' ? 'text-xs' : 'text-lg';

  switch (type) {
    case 'percent':
      return (
        <div
          className={`${boxSize} bg-[#FFF0EE] text-[#E54D37] flex items-center justify-center shrink-0 font-extrabold ${textSize}`}
          aria-hidden="true"
        >
          <Percent className={size === 'sm' ? 'w-4 h-4 stroke-[2.5]' : 'w-6 h-6 stroke-[2.5]'} />
        </div>
      );
    case 'bar-chart-green':
      return (
        <div
          className={`${boxSize} bg-[#E6F6F1] text-[#16856B] flex items-center justify-center shrink-0`}
          aria-hidden="true"
        >
          <BarChart2 className={size === 'sm' ? 'w-4 h-4 stroke-[2.5]' : 'w-6 h-6 stroke-[2.5]'} />
        </div>
      );
    case 'fraction-half':
      return (
        <div
          className={`${boxSize} bg-[#F3EEFF] text-[#6D28D9] flex items-center justify-center shrink-0 font-extrabold ${
            size === 'sm' ? 'text-sm' : 'text-xl'
          }`}
          aria-hidden="true"
        >
          ½
        </div>
      );
    case 'ratio-nodes':
      return (
        <div
          className={`${boxSize} bg-[#FFF6E5] text-[#D97706] flex items-center justify-center shrink-0`}
          aria-hidden="true"
        >
          <Share2 className={size === 'sm' ? 'w-4 h-4 stroke-[2.5]' : 'w-5 h-5 stroke-[2.5]'} />
        </div>
      );
    case 'sigma':
      return (
        <div
          className={`${boxSize} bg-[#EBF2FF] text-[#2457D6] flex items-center justify-center shrink-0 font-extrabold ${
            size === 'sm' ? 'text-sm' : 'text-xl'
          }`}
          aria-hidden="true"
        >
          ∑
        </div>
      );
    case 'scientific-calc':
      return (
        <div
          className={`${boxSize} bg-[#F3EEFF] text-[#7C3AED] flex items-center justify-center shrink-0`}
          aria-hidden="true"
        >
          <Calculator className={size === 'sm' ? 'w-4 h-4' : 'w-6 h-6'} />
        </div>
      );
    case 'sqrt-x':
      return (
        <div
          className={`${boxSize} bg-[#FFF0F0] text-[#E11D48] flex items-center justify-center shrink-0 font-extrabold tracking-tighter ${
            size === 'sm' ? 'text-xs' : 'text-base'
          }`}
          aria-hidden="true"
        >
          √x
        </div>
      );
    case 'exponent-x2':
      return (
        <div
          className={`${boxSize} bg-[#E6F6F1] text-[#16856B] flex items-center justify-center shrink-0 font-extrabold ${
            size === 'sm' ? 'text-xs' : 'text-base'
          }`}
          aria-hidden="true"
        >
          x<sup className="text-[10px] -top-1.5">2</sup>
        </div>
      );
    case 'abs-x':
      return (
        <div
          className={`${boxSize} bg-[#FFF6E5] text-[#D97706] flex items-center justify-center shrink-0 font-extrabold tracking-tight ${
            size === 'sm' ? 'text-xs' : 'text-base'
          }`}
          aria-hidden="true"
        >
          |x|
        </div>
      );
    case 'lcm-gcd':
      return (
        <div
          className={`${boxSize} bg-[#EBF2FF] text-[#2457D6] flex flex-col items-center justify-center shrink-0 font-extrabold leading-none ${
            size === 'sm' ? 'text-[8px]' : 'text-[10px]'
          }`}
          aria-hidden="true"
        >
          <span>LCM</span>
          <span className="mt-0.5">GCD</span>
        </div>
      );
    case 'matrix-grid':
      return (
        <div
          className={`${boxSize} bg-[#FFF0F0] text-[#E11D48] flex items-center justify-center shrink-0`}
          aria-hidden="true"
        >
          <Grid className={size === 'sm' ? 'w-4 h-4' : 'w-6 h-6'} />
        </div>
      );
    case 'equation-x':
    default:
      return (
        <div
          className={`${boxSize} bg-[#F3EEFF] text-[#7C3AED] flex items-center justify-center shrink-0 font-extrabold ${
            size === 'sm' ? 'text-xs' : 'text-base'
          }`}
          aria-hidden="true"
        >
          x=
        </div>
      );
  }
}

const SIDEBAR_RELATED_CATEGORIES = [
  {
    name: 'Finance Calculators',
    href: '/finance',
    icon: Coins,
    iconBg: 'bg-[#FFF6E5]',
    iconColor: 'text-[#D97706]',
  },
  {
    name: 'Unit Conversion',
    href: '/conversions',
    icon: ArrowLeftRight,
    iconBg: 'bg-[#EBF2FF]',
    iconColor: 'text-[#2457D6]',
  },
  {
    name: 'Date & Time Calculators',
    href: '/date-time',
    icon: Calendar,
    iconBg: 'bg-[#FFF0F0]',
    iconColor: 'text-[#E11D48]',
  },
  {
    name: 'Health & Fitness Calculators',
    href: '/health-fitness',
    icon: Heart,
    iconBg: 'bg-[#E6F6F1]',
    iconColor: 'text-[#16856B]',
  },
  {
    name: 'Business Calculators',
    href: '/finance/business',
    icon: BarChart3,
    iconBg: 'bg-[#F3EEFF]',
    iconColor: 'text-[#7C3AED]',
  },
  {
    name: 'Science Calculators',
    href: '/science',
    icon: FlaskConical,
    iconBg: 'bg-[#EBF2FF]',
    iconColor: 'text-[#2457D6]',
  },
];

const MATH_CATEGORY_STATE_KEY = 'solveit_math_category_browsing_state';

export default function MathCategoryPageClient() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<MathFilterCategory>('All');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Restore search query, filter, and scroll position on mount/back navigation
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlQ = params.get('q');
      const urlCat = params.get('category') as MathFilterCategory | null;

      if (urlQ !== null || urlCat !== null) {
        if (urlQ !== null) setSearchQuery(urlQ);
        if (urlCat && MATH_FILTER_CATEGORIES.includes(urlCat)) {
          setSelectedFilter(urlCat);
        }
      } else {
        const raw = window.sessionStorage.getItem(MATH_CATEGORY_STATE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (typeof parsed.q === 'string') setSearchQuery(parsed.q);
          if (
            parsed.category &&
            MATH_FILTER_CATEGORIES.includes(parsed.category)
          ) {
            setSelectedFilter(parsed.category);
          }
          if (typeof parsed.scrollY === 'number' && parsed.scrollY > 0) {
            setTimeout(() => {
              window.scrollTo({ top: parsed.scrollY, behavior: 'auto' });
            }, 40);
          }
        }
      }
    } catch {
      // Ignore storage errors
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      const existingRaw = window.sessionStorage.getItem(MATH_CATEGORY_STATE_KEY);
      const existing = existingRaw ? JSON.parse(existingRaw) : {};
      window.sessionStorage.setItem(
        MATH_CATEGORY_STATE_KEY,
        JSON.stringify({
          ...existing,
          q: searchQuery,
          category: selectedFilter,
        })
      );

      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set('q', searchQuery.trim());
      if (selectedFilter !== 'All') params.set('category', selectedFilter);
      const qs = params.toString();
      window.history.replaceState(
        null,
        '',
        `${window.location.pathname}${qs ? `?${qs}` : ''}`
      );
    } catch {
      // Ignore storage errors
    }
  }, [searchQuery, selectedFilter, isHydrated]);

  const recordScrollPosition = () => {
    try {
      window.sessionStorage.setItem(
        MATH_CATEGORY_STATE_KEY,
        JSON.stringify({
          q: searchQuery,
          category: selectedFilter,
          scrollY: window.scrollY,
        })
      );
    } catch {
      // Ignore storage errors
    }
  };

  const directoryCalculators = useMemo(
    () => MATH_CALCULATORS.filter((item) => item.showInDirectory !== false),
    []
  );

  const filteredTools = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return directoryCalculators.filter((tool) => {
      const matchesCategory =
        selectedFilter === 'All' || tool.category === selectedFilter;
      const matchesQuery =
        !q ||
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q) ||
        (tool.displayBadge && tool.displayBadge.toLowerCase().includes(q)) ||
        tool.commonUseCase.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [directoryCalculators, searchQuery, selectedFilter]);

  const popularMathTools = useMemo(
    () => directoryCalculators.filter((t) => t.isPopular),
    [directoryCalculators]
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (filteredTools.length === 1) {
      router.push(`/math/${filteredTools[0].slug}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#152238]">
      {/* Category Header / Hero Section */}
      <section
        aria-labelledby="math-category-heading"
        className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-b from-[#EAF2FF] via-[#F1F6FF] to-[#F5F7FA] pt-5 pb-6"
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb: Home / Math */}
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-1.5 text-xs sm:text-sm font-medium">
              <li>
                <Link
                  href="/"
                  className="text-[#2457D6] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] rounded-xs"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="text-slate-400">
                <ChevronRight className="w-3.5 h-3.5" />
              </li>
              <li aria-current="page" className="text-[#2457D6] font-semibold">
                Math
              </li>
            </ol>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Left: Icon + H1 + Intro + Search + Filters */}
            <div className="flex-1 max-w-4xl">
              <div className="flex items-start gap-4">
                <div
                  className="w-16 h-16 rounded-2xl bg-[#DCE8FF] border border-[#C6DBFF] text-[#2457D6] flex items-center justify-center shrink-0 shadow-2xs"
                  aria-hidden="true"
                >
                  <Calculator className="w-8 h-8 stroke-[2.2]" />
                </div>
                <div>
                  <h1
                    id="math-category-heading"
                    className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#152238]"
                  >
                    Math Calculators
                  </h1>
                  <p className="mt-1.5 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
                    Solve everyday math problems with ease. Calculate
                    percentages, fractions, ratios, averages, algebra and more
                    with clear results and simple explanations.
                  </p>
                </div>
              </div>

              {/* Prominent Search Field */}
              <form
                onSubmit={handleSearchSubmit}
                role="search"
                aria-label="Find a math calculator"
                className="mt-5 flex items-center bg-white rounded-xl border border-slate-200/90 shadow-xs p-1.5 focus-within:ring-2 focus-within:ring-[#2457D6] focus-within:border-[#2457D6] transition-all"
              >
                <label htmlFor="math-category-search" className="sr-only">
                  Find a math calculator
                </label>
                <div className="pl-3 pr-2 text-[#152238] flex items-center pointer-events-none">
                  <Search className="w-5 h-5" aria-hidden="true" />
                </div>
                <input
                  id="math-category-search"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Find a math calculator (e.g. percentage, fraction, ratio...)"
                  className="w-full py-2 px-2 text-sm sm:text-base text-[#152238] placeholder:text-slate-400 bg-transparent focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    data-compact="true"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search query"
                    className="compact-control p-1.5 mr-1 rounded-full text-slate-500 hover:text-[#152238] hover:bg-slate-100 cursor-pointer"
                  >
                    <X className="w-4 h-4" aria-hidden="true" />
                  </button>
                )}
                <button
                  type="submit"
                  className="shrink-0 bg-[#2457D6] hover:bg-[#1d47b0] text-white font-semibold text-sm px-6 py-2.5 rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2457D6]"
                >
                  Search
                </button>
              </form>

              {/* Filter Controls: All, Basic Math, Percentages, Fractions, Ratios, Algebra */}
              <div
                role="group"
                aria-label="Filter math calculators by topic"
                className="mt-3.5 flex flex-wrap items-center gap-2"
              >
                {MATH_FILTER_CATEGORIES.map((category) => {
                  const isActive = selectedFilter === category;
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setSelectedFilter(category)}
                      aria-pressed={isActive}
                      className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] ${
                        isActive
                          ? 'bg-[#2457D6] text-white border-[#2457D6] shadow-2xs'
                          : 'bg-[#E2ECFC] hover:bg-[#D2E2FA] text-[#152238] border-[#C6DBFF] dark:bg-[#1E325C] dark:border-[#33528E] dark:text-[#F8FAFC] dark:hover:bg-[#284278]'
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Decorative Math Illustration on Desktop */}
            <div
              aria-hidden="true"
              className="hidden xl:flex items-center justify-center relative w-64 h-44 shrink-0 select-none"
            >
              <div className="w-44 h-44 rounded-full bg-[#DCE8FF]/70 flex items-center justify-center relative">
                {/* Floating Pi badge */}
                <div className="absolute -left-2 top-3 w-11 h-11 rounded-xl bg-[#60A5FA] text-white font-serif font-bold text-2xl flex items-center justify-center shadow-sm -rotate-12">
                  π
                </div>
                {/* Floating Sqrt badge */}
                <div className="absolute -left-5 bottom-8 w-11 h-10 rounded-xl bg-[#D1FAE5] text-[#16856B] font-extrabold text-base flex items-center justify-center shadow-sm -rotate-6">
                  √x
                </div>
                {/* Tilted Calculator graphic */}
                <div className="w-24 h-32 rounded-2xl bg-[#2457D6] p-2.5 shadow-md rotate-12 flex flex-col justify-between border-2 border-[#3B82F6]">
                  <div className="h-6 rounded-md bg-[#93C5FD]/90 w-full" />
                  <div className="grid grid-cols-3 gap-1.5">
                    <div className="h-3.5 rounded-xs bg-white/90" />
                    <div className="h-3.5 rounded-xs bg-white/90" />
                    <div className="h-3.5 rounded-xs bg-[#60A5FA]" />
                    <div className="h-3.5 rounded-xs bg-white/90" />
                    <div className="h-3.5 rounded-xs bg-white/90" />
                    <div className="h-3.5 rounded-xs bg-[#60A5FA]" />
                    <div className="h-3.5 rounded-xs bg-white/90" />
                    <div className="h-3.5 rounded-xs bg-white/90" />
                    <div className="h-3.5 rounded-xs bg-[#FBBF24]" />
                  </div>
                </div>
                {/* Floating % badge */}
                <div className="absolute -right-3 top-12 w-11 h-11 rounded-xl bg-[#FBBF24] text-white font-extrabold text-xl flex items-center justify-center shadow-sm rotate-12">
                  %
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <main className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-7">
        {/* Two-Column Desktop Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
          {/* Left Main Column: Calculator Row Directory */}
          <div className="lg:col-span-8">
            <div className="mb-4">
              <div className="flex items-center gap-2">
                <LayoutGrid
                  className="w-5 h-5 text-[#2457D6]"
                  aria-hidden="true"
                />
                <h2 className="text-xl font-extrabold text-[#152238] tracking-tight">
                  {selectedFilter === 'All'
                    ? 'All Math Calculators'
                    : `${selectedFilter} Calculators`}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5 pl-7">
                Choose a calculator below to get started.
              </p>
            </div>

            {filteredTools.length > 0 ? (
              <div className="space-y-3" role="list">
                {filteredTools.map((tool: MathCalculatorItem) => (
                  <div
                    key={tool.id}
                    role="listitem"
                    className="group rounded-xl bg-white border border-slate-200/90 px-4 py-3.5 hover:border-[#2457D6] hover:shadow-xs transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
                      {/* Left: Icon + Title + 1-sentence description */}
                      <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                        <MathSymbolBadge type={tool.symbolType} size="md" />
                        <div className="min-w-0">
                          <Link
                            href={`/math/${tool.slug}`}
                            onClick={recordScrollPosition}
                            className="text-base font-bold text-[#152238] group-hover:text-[#2457D6] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] rounded-xs"
                          >
                            {tool.name}
                          </Link>
                          <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-snug">
                            {tool.description}
                          </p>
                        </div>
                      </div>

                      {/* Right: Sub-topic label + Open calculator link */}
                      <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pl-15 sm:pl-0">
                        <span className="text-[11px] font-semibold text-slate-700 bg-[#EEF3FA] border border-slate-200/80 dark:bg-[#1E2E4F] dark:text-[#E2E8F0] dark:border-[#334E7D] px-2.5 py-1 rounded-md">
                          {tool.displayBadge || tool.category}
                        </span>
                        <Link
                          href={`/math/${tool.slug}`}
                          onClick={recordScrollPosition}
                          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#2457D6] hover:text-[#1d47b0] whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] rounded-md py-1 px-1.5"
                        >
                          <span>Open calculator</span>
                          <ArrowRight
                            className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                            aria-hidden="true"
                          />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl bg-white border border-slate-200 p-8 text-center">
                <p className="text-base font-bold text-[#152238]">
                  No matching math calculators found
                </p>
                <p className="text-sm text-slate-600 mt-1">
                  Try clearing your search query or switching the filter back to
                  &ldquo;All&rdquo;.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedFilter('All');
                  }}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2457D6] text-white text-xs sm:text-sm font-semibold hover:bg-[#1d47b0] transition-colors cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>

          {/* Right Sidebar Column */}
          <aside
            aria-label="Popular and related calculators"
            className="lg:col-span-4 space-y-5"
          >
            {/* Popular in Math Group */}
            <div className="rounded-2xl bg-white border border-slate-200/90 p-5 shadow-2xs">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Flame
                  className="w-5 h-5 text-[#EA580C] fill-[#EA580C]"
                  aria-hidden="true"
                />
                <h2 className="text-base font-extrabold text-[#152238]">
                  Popular in Math
                </h2>
              </div>

              <ul className="divide-y divide-slate-100 mt-1">
                {popularMathTools.map((tool) => (
                  <li key={tool.id}>
                    <Link
                      href={`/math/${tool.slug}`}
                      className="group flex items-center justify-between gap-3 py-2.5 hover:text-[#2457D6] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] rounded-md"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <MathSymbolBadge type={tool.symbolType} size="sm" />
                        <span className="text-xs sm:text-sm font-bold text-[#152238] group-hover:text-[#2457D6] truncate transition-colors">
                          {tool.name}
                        </span>
                      </div>
                      <ChevronRight
                        className="w-4 h-4 text-slate-400 group-hover:text-[#2457D6] group-hover:translate-x-0.5 transition-all shrink-0"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Related Calculator Categories Group */}
            <div className="rounded-2xl bg-white border border-slate-200/90 p-5 shadow-2xs">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <FolderOpen
                  className="w-5 h-5 text-[#2457D6]"
                  aria-hidden="true"
                />
                <h2 className="text-base font-extrabold text-[#152238]">
                  Related Calculator Categories
                </h2>
              </div>

              <ul className="divide-y divide-slate-100 mt-1">
                {SIDEBAR_RELATED_CATEGORIES.map((cat) => {
                  const IconComponent = cat.icon;
                  return (
                    <li key={cat.name}>
                      <Link
                        href={cat.href}
                        className="group flex items-center justify-between gap-3 py-2.5 hover:text-[#2457D6] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] rounded-md"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-8 h-8 rounded-lg ${cat.iconBg} ${cat.iconColor} flex items-center justify-center shrink-0`}
                          >
                            <IconComponent
                              className="w-4 h-4"
                              aria-hidden="true"
                            />
                          </div>
                          <span className="text-xs sm:text-sm font-bold text-[#152238] group-hover:text-[#2457D6] truncate transition-colors">
                            {cat.name}
                          </span>
                        </div>
                        <ChevronRight
                          className="w-4 h-4 text-slate-400 group-hover:text-[#2457D6] group-hover:translate-x-0.5 transition-all shrink-0"
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Need a different calculator? CTA Box */}
            <div className="rounded-2xl bg-[#EAF2FF] border border-[#CFE0FF] p-5">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white text-[#D97706] flex items-center justify-center shrink-0 shadow-2xs">
                  <Lightbulb className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-[#152238]">
                    Need a different calculator?
                  </h2>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Browse all calculators to find the right tool for your
                    needs.
                  </p>
                </div>
              </div>

              <Link
                href="/calculators"
                className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-[#2457D6] hover:bg-[#1d47b0] text-white text-xs sm:text-sm font-semibold py-2.5 px-4 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2457D6]"
              >
                <span>View All Calculators</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </aside>
        </div>

        {/* Bottom Two-Column Row: How to Choose Guide (Left) + FAQs (Right) */}
        <section
          aria-label="Calculator selection guide and FAQs"
          className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
        >
          {/* Left: How to choose the right math calculator */}
          <div className="lg:col-span-7 rounded-2xl bg-[#EBF7F3] border border-[#BDE5D7] p-6">
            <div className="flex items-center gap-2.5">
              <Settings
                className="w-5 h-5 text-[#16856B]"
                aria-hidden="true"
              />
              <h2 className="text-lg font-extrabold text-[#152238]">
                How to choose the right math calculator
              </h2>
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
              {MATH_CHOOSE_STEPS.map((item) => (
                <div key={item.step} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#D2EFE6] border border-[#BDE5D7] text-[#16856B] dark:bg-[#184239] dark:border-[#286658] dark:text-[#6EE7B7] font-extrabold text-sm flex items-center justify-center shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-[#152238]">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Frequently Asked Questions */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-2 mb-3">
              <HelpCircle
                className="w-5 h-5 text-[#2457D6] fill-[#2457D6]/10"
                aria-hidden="true"
              />
              <h2 className="text-lg font-extrabold text-[#152238]">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-2">
              {MATH_FAQS.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={faq.question}
                    className="rounded-xl bg-white border border-slate-200/90 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpenFaqIndex(isOpen ? null : index)
                      }
                      aria-expanded={isOpen}
                      className="w-full flex items-center justify-between gap-3 px-4 py-2.5 text-left text-xs sm:text-sm font-semibold text-[#152238] hover:text-[#2457D6] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#2457D6]"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#2457D6] shrink-0 transition-transform ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-3 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
