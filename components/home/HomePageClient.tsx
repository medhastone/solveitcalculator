'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  X,
  Percent,
  Calendar,
  Home,
  ArrowLeftRight,
  Tag,
  Heart,
  Calculator,
  Coins,
  BarChart3,
  FlaskConical,
  PiggyBank,
  Flame,
  LayoutGrid,
  History,
  Settings,
  ArrowRight,
  Check,
  ShieldCheck,
  Zap,
  Users,
  ChevronRight,
  BookOpen,
  Lock,
} from 'lucide-react';
import {
  searchInventory,
  getRelatedCategoriesForQuery,
} from '@/lib/searchIndex';

const HOME_SEARCH_STORAGE_KEY = 'solveit_home_search_state';

const QUICK_TRY_LINKS = [
  { label: 'Percentage', href: '/math/percentage-calculator' },
  { label: 'Calculation Workspace', href: '/calculation-workspace' },
  { label: 'Construction Project', href: '/construction-project-calculator' },
  { label: 'Flooring', href: '/home-construction/flooring-calculator' },
  { label: 'Loan', href: '/loan-calculator' },
  { label: 'Age', href: '/age-calculator' },
  { label: 'BMI', href: '/bmi-calculator' },
  { label: 'Unit Converter', href: '/conversions/length' },
];

const POPULAR_CALCULATORS = [
  {
    name: 'Percentage Calculator',
    description: 'Calculate percentages, increases, decreases, and proportions.',
    href: '/math/percentage-calculator',
    icon: Percent,
    iconBg: 'bg-[#FFF0EE]',
    iconColor: 'text-[#E54D37]',
  },
  {
    name: 'Calculation Workspace',
    description: 'Multi-step expressions, running totals, and reusable history.',
    href: '/calculation-workspace',
    icon: History,
    iconBg: 'bg-[#EBF2FF]',
    iconColor: 'text-[#2457D6]',
  },
  {
    name: 'Construction Project Calculator',
    description: 'Guided 4-step estimator for area, concrete slabs, post holes, waste & cost.',
    href: '/construction-project-calculator',
    icon: Home,
    iconBg: 'bg-[#E6F6F1]',
    iconColor: 'text-[#16856B]',
  },
  {
    name: 'Loan Payment Calculator',
    description: 'Estimate monthly loan payments and total interest.',
    href: '/loan-calculator',
    icon: Coins,
    iconBg: 'bg-[#EBF2FF]',
    iconColor: 'text-[#2457D6]',
  },
  {
    name: 'Unit Conversion Calculator',
    description: 'Convert length, weight, volume, area, and temperature.',
    href: '/conversions/length',
    icon: ArrowLeftRight,
    iconBg: 'bg-[#F3EEFF]',
    iconColor: 'text-[#7C3AED]',
  },
  {
    name: 'Discount Calculator',
    description: 'Find the final sale price and total money saved.',
    href: '/math/discount-calculator',
    icon: Tag,
    iconBg: 'bg-[#FFF6E5]',
    iconColor: 'text-[#D97706]',
  },
  {
    name: 'Age Calculator',
    description: 'Find your exact age in years, months, weeks, and days.',
    href: '/age-calculator',
    icon: Calendar,
    iconBg: 'bg-[#E6F6F1]',
    iconColor: 'text-[#16856B]',
  },
  {
    name: 'BMI Calculator',
    description: 'Check your body mass index, daily calories, and healthy weight.',
    href: '/bmi-calculator',
    icon: Heart,
    iconBg: 'bg-[#E6F6F1]',
    iconColor: 'text-[#16856B]',
  },
];

const BROWSE_TOPICS = [
  {
    name: 'Math Calculators',
    description: 'Percentages, fractions, ratios, algebra, and workspace.',
    href: '/math',
    icon: Calculator,
    iconBg: 'bg-[#EBF2FF]',
    iconColor: 'text-[#2457D6]',
  },
  {
    name: 'Finance Calculators',
    description: 'Loans, mortgages, interest, salary, tax, and savings.',
    href: '/finance',
    icon: Coins,
    iconBg: 'bg-[#FFF6E5]',
    iconColor: 'text-[#D97706]',
  },
  {
    name: 'Home & Construction',
    description: 'Construction workflow, flooring estimator, room area & concrete.',
    href: '/home-construction',
    icon: Home,
    iconBg: 'bg-[#E6F6F1]',
    iconColor: 'text-[#16856B]',
  },
  {
    name: 'Unit Conversion',
    description: 'Length, weight, area, volume, temperature, and speed.',
    href: '/conversions',
    icon: ArrowLeftRight,
    iconBg: 'bg-[#EBF2FF]',
    iconColor: 'text-[#2457D6]',
  },
  {
    name: 'Date & Time',
    description: 'Exact age, date difference, workdays, and shift duration.',
    href: '/date-time',
    icon: Calendar,
    iconBg: 'bg-[#FFF0F0]',
    iconColor: 'text-[#E11D48]',
  },
  {
    name: 'Health & Fitness',
    description: 'BMI, daily calorie needs (TDEE), BMR, and body fat.',
    href: '/health-fitness',
    icon: Heart,
    iconBg: 'bg-[#E6F6F1]',
    iconColor: 'text-[#16856B]',
  },
  {
    name: 'Business Calculators',
    description: 'Profit margin, gross margin, markup, break-even, and ROI.',
    href: '/finance/business',
    icon: BarChart3,
    iconBg: 'bg-[#F3EEFF]',
    iconColor: 'text-[#7C3AED]',
  },
  {
    name: 'Science Calculators',
    description: "Density, force, Ohm's law, molarity, and percent error.",
    href: '/science',
    icon: FlaskConical,
    iconBg: 'bg-[#EBF2FF]',
    iconColor: 'text-[#2457D6]',
  },
  {
    name: 'Retirement & Super',
    description: '401(k) match, Roth vs. Traditional, RMD, and FIRE planning.',
    href: '/retirement-and-super',
    icon: PiggyBank,
    iconBg: 'bg-[#E6F6F1]',
    iconColor: 'text-[#16856B]',
  },
];

const GOAL_DISCOVERY_CARDS = [
  {
    title: 'Shopping, Discounts & Running Totals',
    description:
      'Compare store markdowns, calculate tax, or add up multiple items with a live running subtotal.',
    icon: Tag,
    iconBg: 'bg-[#FFF6E5]',
    iconColor: 'text-[#D97706]',
    links: [
      { label: 'Discount Calculator', href: '/math/discount-calculator' },
      { label: 'Calculation Workspace', href: '/calculation-workspace' },
      { label: 'Percentage Change', href: '/math/percentage-change-calculator' },
    ],
  },
  {
    title: 'Home Renovation & Construction Measurements',
    description:
      'Calculate rectangular areas, concrete slabs, or post holes, add waste allowance, and estimate costs.',
    icon: Home,
    iconBg: 'bg-[#E6F6F1]',
    iconColor: 'text-[#16856B]',
    links: [
      { label: 'Construction Project Calculator', href: '/construction-project-calculator' },
      { label: 'Flooring Project Calculator', href: '/home-construction/flooring-calculator' },
      { label: 'How to Measure Room Area (Guide)', href: '/guides/how-to-measure-room-area-and-flooring' },
    ],
  },
  {
    title: 'Loans, Mortgages & Take-Home Pay',
    description:
      'Check monthly PITI house payments, compare loan amortization, or estimate net paycheck income.',
    icon: Coins,
    iconBg: 'bg-[#EBF2FF]',
    iconColor: 'text-[#2457D6]',
    links: [
      { label: 'Mortgage Calculator', href: '/mortgage-calculator' },
      { label: 'Loan Payment Calculator', href: '/loan-calculator' },
      { label: 'Salary & Take-Home Pay', href: '/finance/take-home-pay-calculator' },
    ],
  },
  {
    title: 'Homework, Algebra & Science Labs',
    description:
      'Check step-by-step fraction arithmetic, scientific expressions, or lab percent error.',
    icon: FlaskConical,
    iconBg: 'bg-[#F3EEFF]',
    iconColor: 'text-[#7C3AED]',
    links: [
      { label: 'Fraction Calculator', href: '/math/fraction-calculator' },
      { label: 'Scientific & PEMDAS Calculator', href: '/math/scientific-calculator' },
      { label: 'Percent Error Calculator', href: '/math/percent-error-calculator' },
    ],
  },
];

export default function HomePageClient() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const saved = window.sessionStorage.getItem(HOME_SEARCH_STORAGE_KEY);
      if (saved) {
        setSearchQuery(saved);
      }
    } catch {
      // Ignore sessionStorage errors
    }
  }, []);

  const updateSearchQuery = (nextValue: string) => {
    setSearchQuery(nextValue);
    setActiveIndex(-1);
    try {
      if (nextValue.trim()) {
        window.sessionStorage.setItem(HOME_SEARCH_STORAGE_KEY, nextValue);
      } else {
        window.sessionStorage.removeItem(HOME_SEARCH_STORAGE_KEY);
      }
    } catch {
      // Ignore sessionStorage errors
    }
  };

  const filteredTools = useMemo(() => {
    const q = searchQuery.trim();
    if (!q) return [];
    return searchInventory(q, 'All', 7);
  }, [searchQuery]);

  const suggestedCategories = useMemo(
    () => getRelatedCategoriesForQuery(searchQuery),
    [searchQuery]
  );

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isSearchFocused || searchQuery.trim().length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (filteredTools.length > 0) {
        setActiveIndex((prev) =>
          prev < filteredTools.length - 1 ? prev + 1 : 0
        );
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (filteredTools.length > 0) {
        setActiveIndex((prev) =>
          prev > 0 ? prev - 1 : filteredTools.length - 1
        );
      }
    } else if (e.key === 'Enter' && activeIndex >= 0 && filteredTools[activeIndex]) {
      e.preventDefault();
      setIsSearchFocused(false);
      router.push(filteredTools[activeIndex].href);
    } else if (e.key === 'Escape') {
      setIsSearchFocused(false);
      setActiveIndex(-1);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeIndex >= 0 && filteredTools[activeIndex]) {
      setIsSearchFocused(false);
      router.push(filteredTools[activeIndex].href);
      return;
    }
    const q = searchQuery.trim();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : '/search');
  };

  const handleClearSearch = () => {
    updateSearchQuery('');
    searchInputRef.current?.focus();
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#152238]">
      {/* Hero Section */}
      <section
        aria-labelledby="hero-heading"
        className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-b from-[#EAF2FF] via-[#F1F6FF] to-[#F5F7FA] pt-8 pb-7"
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1
              id="hero-heading"
              className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-[#152238] leading-tight"
            >
              What would you like to{' '}
              <span className="text-[#2457D6]">calculate?</span>
            </h1>
            <p className="mt-2.5 text-base sm:text-lg text-slate-600 font-normal">
              Free calculators with clear answers, explicit formulas, and simple explanations.
            </p>

            {/* Prominent Accessible Search Bar with Keyboard Navigation & Clear Button */}
            <div className="mt-6 relative max-w-2xl mx-auto">
              <form
                onSubmit={handleSearchSubmit}
                role="search"
                aria-label="Search calculators"
                className="flex items-center bg-white rounded-xl border border-slate-200/90 shadow-sm p-1.5 focus-within:ring-2 focus-within:ring-[#2457D6] focus-within:border-[#2457D6] transition-all"
              >
                <label htmlFor="homepage-calculator-search" className="sr-only">
                  Search calculators by name, alias, or category
                </label>
                <div className="pl-3.5 pr-2 text-slate-400 flex items-center pointer-events-none">
                  <Search
                    className="w-5 h-5 text-[#152238]"
                    aria-hidden="true"
                  />
                </div>
                <input
                  ref={searchInputRef}
                  id="homepage-calculator-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    updateSearchQuery(e.target.value);
                    setIsSearchFocused(true);
                  }}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 180)}
                  onKeyDown={handleSearchKeyDown}
                  aria-autocomplete="list"
                  aria-controls="homepage-search-listbox"
                  aria-activedescendant={
                    activeIndex >= 0 && filteredTools[activeIndex]
                      ? `home-search-opt-${filteredTools[activeIndex].id}`
                      : undefined
                  }
                  placeholder="Search calculators (e.g. percentage, flooring, workspace, loan, BMI)..."
                  className="w-full py-2.5 px-2 text-sm sm:text-base text-[#152238] placeholder:text-slate-400 bg-transparent focus:outline-none"
                />

                {searchQuery.length > 0 && (
                  <button
                    type="button"
                    data-compact="true"
                    onClick={handleClearSearch}
                    aria-label="Clear search query"
                    title="Clear search query"
                    className="compact-control p-1.5 mr-1.5 rounded-full text-slate-500 hover:text-[#152238] hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
                  >
                    <X className="w-4 h-4" aria-hidden="true" />
                  </button>
                )}

                <button
                  type="submit"
                  className="shrink-0 bg-[#2457D6] hover:bg-[#1d47b0] text-white font-semibold text-sm sm:text-base px-5 sm:px-6 py-2.5 rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2457D6]"
                >
                  Search
                </button>
              </form>

              {/* Live Search Suggestions Dropdown */}
              {isSearchFocused && searchQuery.trim().length > 0 && (
                <div
                  id="homepage-search-listbox"
                  role="listbox"
                  aria-label="Matching calculators"
                  className="absolute left-0 right-0 mt-2 bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden z-30 text-left"
                >
                  {filteredTools.length > 0 ? (
                    <ul className="divide-y divide-slate-100">
                      {filteredTools.map((tool, idx) => {
                        const isSelected = idx === activeIndex;
                        return (
                          <li
                            key={tool.id}
                            id={`home-search-opt-${tool.id}`}
                            role="option"
                            aria-selected={isSelected}
                          >
                            <Link
                              href={tool.href}
                              onMouseEnter={() => setActiveIndex(idx)}
                              className={`flex items-center justify-between px-4 py-3 transition-colors ${
                                isSelected
                                  ? 'bg-[#EEF4FF] text-[#2457D6]'
                                  : 'hover:bg-[#F5F7FA] focus:bg-[#F5F7FA]'
                              } focus:outline-none`}
                            >
                              <div className="min-w-0 pr-3">
                                <p className="text-sm font-semibold text-[#152238]">
                                  {tool.title}
                                </p>
                                <p className="text-xs text-slate-500 line-clamp-1">
                                  {tool.description}
                                </p>
                              </div>
                              <span className="ml-3 shrink-0 text-xs font-medium text-[#2457D6] bg-blue-50 px-2.5 py-1 rounded-md">
                                {tool.category}
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <div className="p-4 text-sm text-slate-600">
                      <p className="font-semibold text-[#152238]">
                        No exact calculator match for &ldquo;{searchQuery.trim()}&rdquo;.
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Try a broader keyword or browse related categories:
                      </p>
                      <div className="mt-2.5 flex flex-wrap gap-2">
                        {suggestedCategories.map((cat) => (
                          <Link
                            key={cat.href}
                            href={cat.href}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#EEF4FF] text-[#2457D6] text-xs font-semibold hover:underline"
                          >
                            <span>{cat.name}</span>
                            <ArrowRight className="w-3 h-3" aria-hidden="true" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick "Try:" Links */}
            <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm">
              <span className="font-semibold text-[#152238] mr-1">Try:</span>
              {QUICK_TRY_LINKS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="px-3 py-1 rounded-full bg-[#E3EEFF] hover:bg-[#D2E4FF] text-[#152238] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* 3 Value Pillars inside Hero - Compact & structured on mobile & desktop */}
          <div className="mt-5 pt-4 border-t border-blue-200/50 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3.5">
              <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-white/90 border border-blue-100/90 shadow-2xs hover:border-blue-200 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-[#DCF4EC] text-[#16856B] flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4 fill-current" aria-hidden="true" />
                </div>
                <div className="min-w-0 text-left">
                  <p className="text-xs sm:text-sm font-bold text-[#152238] leading-tight">100% Free</p>
                  <p className="text-[11px] sm:text-xs text-slate-600 leading-normal truncate">No signup or paywall</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-white/90 border border-blue-100/90 shadow-2xs hover:border-blue-200 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-[#DCF4EC] text-[#16856B] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                </div>
                <div className="min-w-0 text-left">
                  <p className="text-xs sm:text-sm font-bold text-[#152238] leading-tight">Transparent Math</p>
                  <p className="text-[11px] sm:text-xs text-slate-600 leading-normal truncate">
                    Explicit formulas &amp; assumptions
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-white/90 border border-blue-100/90 shadow-2xs hover:border-blue-200 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-[#DCF4EC] text-[#16856B] flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" aria-hidden="true" />
                </div>
                <div className="min-w-0 text-left">
                  <p className="text-xs sm:text-sm font-bold text-[#152238] leading-tight">
                    Built for Everyday Use
                  </p>
                  <p className="text-[11px] sm:text-xs text-slate-600 leading-normal truncate">
                    Mobile, desktop &amp; keyboard ready
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Calculators Section */}
      <section
        id="popular-calculators"
        aria-labelledby="popular-calculators-heading"
        className="bg-white border-b border-slate-200/80 py-7 scroll-mt-16"
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
            <div>
              <div className="flex items-center gap-2">
                <Flame
                  className="w-5 h-5 text-[#EA580C] fill-[#EA580C]"
                  aria-hidden="true"
                />
                <h2
                  id="popular-calculators-heading"
                  className="text-xl font-extrabold text-[#152238] tracking-tight"
                >
                  Popular &amp; Frequently Used Calculators
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5 pl-7">
                Direct access to our most frequently used everyday calculation tools.
              </p>
            </div>

            <Link
              href="/calculators"
              className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-[#F5F7FA] text-xs font-semibold text-[#2457D6] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6]"
            >
              <span>View All Calculators</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
            {POPULAR_CALCULATORS.map((calc) => {
              const IconComponent = calc.icon;
              return (
                <Link
                  key={calc.name}
                  href={calc.href}
                  className="group flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-4 hover:border-[#2457D6] hover:shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6]"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <div
                        className={`w-10 h-10 rounded-xl ${calc.iconBg} ${calc.iconColor} flex items-center justify-center shrink-0`}
                      >
                        <IconComponent className="w-5 h-5" aria-hidden="true" />
                      </div>
                      <ArrowRight
                        className="w-4 h-4 text-[#2457D6] group-hover:translate-x-0.5 transition-transform shrink-0"
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="text-sm font-bold text-[#152238] group-hover:text-[#2457D6] leading-snug transition-colors">
                      {calc.name}
                    </h3>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                      {calc.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Consolidated Category Navigation Section */}
      <section
        id="browse-by-topic"
        aria-labelledby="browse-by-topic-heading"
        className="bg-[#F5F7FA] border-b border-slate-200/80 py-7 scroll-mt-16"
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
            <div>
              <div className="flex items-center gap-2">
                <LayoutGrid
                  className="w-5 h-5 text-[#2457D6]"
                  aria-hidden="true"
                />
                <h2
                  id="browse-by-topic-heading"
                  className="text-xl font-extrabold text-[#152238] tracking-tight"
                >
                  Browse by Category
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5 pl-7">
                Explore all 9 calculator categories across math, finance, home projects, units, health, and science.
              </p>
            </div>

            <Link
              href="/calculators"
              className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-[#F5F7FA] text-xs font-semibold text-[#2457D6] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6]"
            >
              <span>Full A–Z Directory</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {BROWSE_TOPICS.map((topic) => {
              const IconComponent = topic.icon;
              return (
                <Link
                  key={topic.name}
                  href={topic.href}
                  className="group flex items-center justify-between gap-3.5 rounded-xl border border-slate-200/90 bg-white p-4 hover:border-[#2457D6] hover:shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6]"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-11 h-11 rounded-xl ${topic.iconBg} ${topic.iconColor} flex items-center justify-center shrink-0`}
                    >
                      <IconComponent className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-[#152238] group-hover:text-[#2457D6] transition-colors">
                        {topic.name}
                      </h3>
                      <p className="text-xs text-slate-600 mt-0.5 leading-snug">
                        {topic.description}
                      </p>
                    </div>
                  </div>
                  <ArrowRight
                    className="w-4 h-4 text-[#2457D6] shrink-0 group-hover:translate-x-0.5 transition-transform"
                    aria-hidden="true"
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Goal-Based Discovery Section */}
      <section
        id="find-by-goal"
        aria-labelledby="find-by-goal-heading"
        className="bg-white border-b border-slate-200/80 py-7 scroll-mt-16"
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-5">
            <div className="flex items-center gap-2">
              <BookOpen
                className="w-5 h-5 text-[#2457D6]"
                aria-hidden="true"
              />
              <h2
                id="find-by-goal-heading"
                className="text-xl font-extrabold text-[#152238] tracking-tight"
              >
                Find by Everyday Goal
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5 pl-7">
              Not sure which calculator you need? Jump straight to tools grouped by common real-world tasks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {GOAL_DISCOVERY_CARDS.map((goal) => {
              const Icon = goal.icon;
              return (
                <div
                  key={goal.title}
                  className="rounded-xl border border-slate-200/90 bg-[#F8FAFC] p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-2.5">
                      <div
                        className={`w-9 h-9 rounded-lg ${goal.iconBg} ${goal.iconColor} flex items-center justify-center shrink-0`}
                      >
                        <Icon className="w-4 h-4" aria-hidden="true" />
                      </div>
                      <h3 className="text-sm font-bold text-[#152238] leading-snug">
                        {goal.title}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mb-3">
                      {goal.description}
                    </p>
                  </div>

                  <ul className="space-y-1.5 pt-2.5 border-t border-slate-200/80">
                    {goal.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="flex items-center justify-between text-xs font-semibold text-[#2457D6] hover:underline py-0.5 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6]"
                        >
                          <span>{link.label}</span>
                          <ChevronRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Brief Information about Formulas, Accuracy, and Privacy */}
      <section
        id="how-it-works"
        aria-labelledby="how-it-works-heading"
        className="bg-[#F5F7FA] py-8 scroll-mt-16"
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Settings
                  className="w-5 h-5 text-[#2457D6]"
                  aria-hidden="true"
                />
                <h2
                  id="how-it-works-heading"
                  className="text-xl font-extrabold text-[#152238] tracking-tight"
                >
                  Formulas, Accuracy &amp; Privacy
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5 pl-7">
                How SolveItCalculator computes results and handles your browser data.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
              <Link
                href="/calculation-methodology"
                className="text-[#2457D6] hover:underline"
              >
                Calculation Methodology →
              </Link>
              <Link
                href="/privacy-policy"
                className="text-[#2457D6] hover:underline"
              >
                Privacy &amp; Accessibility →
              </Link>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl bg-white border border-slate-200/90 p-4">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-lg bg-[#EBF2FF] text-[#2457D6] flex items-center justify-center shrink-0">
                  <Calculator className="w-4 h-4" aria-hidden="true" />
                </div>
                <h3 className="text-sm font-bold text-[#152238]">
                  Standard Mathematical Formulas
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every calculator displays the exact mathematical equation, operator precedence, and unit conversion factors used to produce your result so you can verify steps independently.
              </p>
            </div>

            <div className="rounded-xl bg-white border border-slate-200/90 p-4">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-lg bg-[#E6F6F1] text-[#16856B] flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4 stroke-[2.5]" aria-hidden="true" />
                </div>
                <h3 className="text-sm font-bold text-[#152238]">
                  Documented Assumptions &amp; Rounding
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Where an estimate depends on a convention—such as compounding frequency, pack rounding, or waste percentage—the assumption is stated next to the result.
              </p>
            </div>

            <div className="rounded-xl bg-white border border-slate-200/90 p-4">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-lg bg-[#F3EEFF] text-[#7C3AED] flex items-center justify-center shrink-0">
                  <Lock className="w-4 h-4" aria-hidden="true" />
                </div>
                <h3 className="text-sm font-bold text-[#152238]">
                  In-Browser Calculation &amp; Local History
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Calculations run directly in your browser. Optional features like Calculation Workspace history use local browser storage on your device and can be cleared anytime.
              </p>
            </div>
          </div>

          {/* Green Positive Result / Directory Callout Banner */}
          <div className="mt-6 rounded-2xl bg-[#E8F6F1] border border-[#BDE5D7] px-5 py-4 sm:px-6 sm:py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-9 h-9 rounded-full bg-[#16856B] text-white flex items-center justify-center shrink-0">
                <Check className="w-5 h-5 stroke-[2.5]" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-[#152238]">
                  Accurate. Simple. Useful for Real Life.
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-relaxed">
                  Browse our full directory of calculators or open the Calculation Workspace to chain multiple calculations together.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <Link
                href="/calculation-workspace"
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-[#152238] border border-slate-300 text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6]"
              >
                <History className="w-4 h-4 text-[#2457D6]" aria-hidden="true" />
                <span>Calculation Workspace</span>
              </Link>
              <Link
                href="/calculators"
                className="inline-flex items-center gap-2 bg-[#2457D6] hover:bg-[#1d47b0] text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2457D6]"
              >
                <span>Explore All Calculators</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
