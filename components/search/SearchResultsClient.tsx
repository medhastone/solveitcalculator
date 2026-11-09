'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Search,
  X,
  ArrowRight,
  Calculator,
  BookOpen,
  LayoutGrid,
  Percent,
  BarChart3,
  ArrowLeftRight,
  Lightbulb,
  CheckCircle2,
  Coins,
  Calendar,
  Heart,
  Home,
  FlaskConical,
  SearchX,
  ChevronRight,
  History,
} from 'lucide-react';
import {
  SearchEntryType,
  searchInventory,
  normalizeSearchQuery,
  getRelatedCategoriesForQuery,
} from '@/lib/searchIndex';

const SEARCH_STATE_STORAGE_KEY = 'solveit_search_browsing_state';

const RELATED_CATEGORIES = [
  {
    name: 'Math Calculators',
    href: '/math',
    icon: Percent,
    iconBg: 'bg-[#FFF0EE]',
    iconColor: 'text-[#E54D37]',
  },
  {
    name: 'Finance Calculators',
    href: '/finance',
    icon: Coins,
    iconBg: 'bg-[#FFF6E5]',
    iconColor: 'text-[#D97706]',
  },
  {
    name: 'Home & Construction',
    href: '/home-construction',
    icon: Home,
    iconBg: 'bg-[#E6F6F1]',
    iconColor: 'text-[#16856B]',
  },
  {
    name: 'Unit Conversion',
    href: '/conversions',
    icon: ArrowLeftRight,
    iconBg: 'bg-[#F3EEFF]',
    iconColor: 'text-[#7C3AED]',
  },
  {
    name: 'Date & Time Calculators',
    href: '/date-time',
    icon: Calendar,
    iconBg: 'bg-[#E6F6F1]',
    iconColor: 'text-[#16856B]',
  },
  {
    name: 'Health & Fitness',
    href: '/health-fitness',
    icon: Heart,
    iconBg: 'bg-[#FFF0EE]',
    iconColor: 'text-[#E11D48]',
  },
  {
    name: 'Business Calculators',
    href: '/finance/business',
    icon: BarChart3,
    iconBg: 'bg-[#EBF2FF]',
    iconColor: 'text-[#2457D6]',
  },
  {
    name: 'Science Calculators',
    href: '/science',
    icon: FlaskConical,
    iconBg: 'bg-[#EBF2FF]',
    iconColor: 'text-[#2457D6]',
  },
];

function CategoryIcon({
  category,
  type,
  className = 'w-5 h-5',
}: {
  category: string;
  type: SearchEntryType;
  className?: string;
}) {
  if (type === 'Guide') return <BookOpen className={className} aria-hidden="true" />;
  if (type === 'Category') return <LayoutGrid className={className} aria-hidden="true" />;

  const catLower = category.toLowerCase();
  if (catLower.includes('finance') || catLower.includes('retirement')) {
    return <Coins className={className} aria-hidden="true" />;
  }
  if (catLower.includes('home')) {
    return <Home className={className} aria-hidden="true" />;
  }
  if (catLower.includes('unit')) {
    return <ArrowLeftRight className={className} aria-hidden="true" />;
  }
  if (catLower.includes('date')) {
    return <Calendar className={className} aria-hidden="true" />;
  }
  if (catLower.includes('health')) {
    return <Heart className={className} aria-hidden="true" />;
  }
  if (catLower.includes('business')) {
    return <BarChart3 className={className} aria-hidden="true" />;
  }
  if (catLower.includes('science')) {
    return <FlaskConical className={className} aria-hidden="true" />;
  }
  return <Calculator className={className} aria-hidden="true" />;
}

function HighlightedText({
  text,
  highlightTerm,
  variant = 'title',
}: {
  text: string;
  highlightTerm: string;
  variant?: 'title' | 'body';
}) {
  const cleanTerm = highlightTerm.trim();
  if (!cleanTerm || cleanTerm.length < 2) {
    return <>{text}</>;
  }

  const escaped = cleanTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === cleanTerm.toLowerCase() ? (
          <mark
            key={i}
            className={
              variant === 'title'
                ? 'bg-transparent text-[#2457D6] font-extrabold p-0'
                : 'bg-transparent text-[#152238] font-bold p-0'
            }
          >
            {part}
          </mark>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      )}
    </>
  );
}

export default function SearchResultsClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const urlQuery = searchParams.get('q') ?? '';
  const urlType = searchParams.get('type') as 'All' | SearchEntryType | null;

  const [inputValue, setInputValue] = useState(urlQuery);
  const [submittedQuery, setSubmittedQuery] = useState(urlQuery);
  const [activeFilter, setActiveFilter] = useState<'All' | SearchEntryType>(
    urlType && ['All', 'Calculator', 'Guide', 'Category'].includes(urlType)
      ? urlType
      : 'All'
  );
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  // Sync from URL params or sessionStorage on back navigation
  useEffect(() => {
    const paramQ = searchParams.get('q');
    const paramType = searchParams.get('type') as 'All' | SearchEntryType | null;

    if (paramQ !== null) {
      setInputValue(paramQ);
      setSubmittedQuery(paramQ);
    } else {
      try {
        const raw = window.sessionStorage.getItem(SEARCH_STATE_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (typeof parsed.q === 'string' && parsed.q) {
            setInputValue(parsed.q);
            setSubmittedQuery(parsed.q);
          }
          if (
            parsed.type &&
            ['All', 'Calculator', 'Guide', 'Category'].includes(parsed.type)
          ) {
            setActiveFilter(parsed.type);
          }
          if (typeof parsed.scrollY === 'number' && parsed.scrollY > 0) {
            setTimeout(() => {
              window.scrollTo({ top: parsed.scrollY, behavior: 'auto' });
            }, 40);
          }
        }
      } catch {
        // Ignore storage errors
      }
    }

    if (
      paramType &&
      ['All', 'Calculator', 'Guide', 'Category'].includes(paramType)
    ) {
      setActiveFilter(paramType);
    }
  }, [searchParams]);

  const syncUrlAndStorage = (
    nextQ: string,
    nextType: 'All' | SearchEntryType,
    saveScroll = false
  ) => {
    try {
      const statePayload = {
        q: nextQ,
        type: nextType,
        scrollY: saveScroll ? window.scrollY : 0,
      };
      window.sessionStorage.setItem(
        SEARCH_STATE_STORAGE_KEY,
        JSON.stringify(statePayload)
      );
    } catch {
      // Ignore storage errors
    }

    const params = new URLSearchParams();
    if (nextQ.trim()) params.set('q', nextQ.trim());
    if (nextType !== 'All') params.set('type', nextType);
    const qs = params.toString();
    window.history.replaceState(null, '', `/search${qs ? `?${qs}` : ''}`);
  };

  const { normalizedQuery, correctedFrom } = useMemo(
    () => normalizeSearchQuery(submittedQuery),
    [submittedQuery]
  );

  const matchingItems = useMemo(
    () => searchInventory(submittedQuery, activeFilter),
    [submittedQuery, activeFilter]
  );

  const suggestedCategories = useMemo(
    () => getRelatedCategoriesForQuery(submittedQuery),
    [submittedQuery]
  );

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeIndex >= 0 && matchingItems[activeIndex]) {
      syncUrlAndStorage(inputValue.trim(), activeFilter, true);
      router.push(matchingItems[activeIndex].href);
      return;
    }
    const nextQ = inputValue.trim();
    setSubmittedQuery(nextQ);
    setActiveIndex(-1);
    syncUrlAndStorage(nextQ, activeFilter, false);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (matchingItems.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev < Math.min(matchingItems.length - 1, 15) ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev > 0 ? prev - 1 : Math.min(matchingItems.length - 1, 15)
      );
    } else if (e.key === 'Escape') {
      setActiveIndex(-1);
    }
  };

  const handleClearInput = () => {
    setInputValue('');
    setSubmittedQuery('');
    setActiveIndex(-1);
    syncUrlAndStorage('', activeFilter, false);
    inputRef.current?.focus();
  };

  const applyQuickQuery = (term: string) => {
    setInputValue(term);
    setSubmittedQuery(term);
    setActiveFilter('All');
    setActiveIndex(-1);
    syncUrlAndStorage(term, 'All', false);
  };

  const handleFilterChange = (nextType: 'All' | SearchEntryType) => {
    setActiveFilter(nextType);
    setActiveIndex(-1);
    syncUrlAndStorage(submittedQuery, nextType, false);
  };

  const displayQueryLabel = submittedQuery.trim() || 'all calculators & guides';
  const highlightWord = normalizedQuery || submittedQuery.trim();

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#152238]">
      {/* Top Search Hero Section */}
      <section
        aria-labelledby="search-page-heading"
        className="relative overflow-hidden border-b border-[#E2E8F0] bg-gradient-to-b from-[#E8F1FF] via-[#F1F6FF] to-[#F5F7FA] pt-7 pb-8"
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1
              id="search-page-heading"
              className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold tracking-tight text-[#152238]"
            >
              Search <span className="text-[#2457D6]">Calculators</span>
            </h1>
            <p className="mt-2 text-base sm:text-[17px] text-[#475569] leading-relaxed">
              Search by calculator name, alias, formula topic, or category.
            </p>

            {/* Wide Centered Search Box */}
            <form
              onSubmit={handleFormSubmit}
              role="search"
              aria-label="Search calculators"
              className="mt-5 flex items-center bg-white rounded-xl border-2 border-[#C7D7FE] shadow-sm p-1.5 focus-within:border-[#2457D6] focus-within:ring-3 focus-within:ring-[#2457D6]/20 transition-all"
            >
              <label htmlFor="search-results-input" className="sr-only">
                Search calculators by keyword
              </label>
              <div className="pl-3.5 pr-2.5 text-[#2457D6] flex items-center pointer-events-none">
                <Search className="w-5 h-5" aria-hidden="true" />
              </div>

              <input
                ref={inputRef}
                id="search-results-input"
                type="text"
                value={inputValue}
                onChange={(e) => {
                  const val = e.target.value;
                  setInputValue(val);
                  setSubmittedQuery(val);
                  setActiveIndex(-1);
                  syncUrlAndStorage(val, activeFilter, false);
                }}
                onKeyDown={handleInputKeyDown}
                placeholder="Search calculators (e.g. percentage, flooring, workspace, loan, BMI)..."
                aria-describedby="search-helper-hint"
                aria-activedescendant={
                  activeIndex >= 0 && matchingItems[activeIndex]
                    ? `search-result-item-${matchingItems[activeIndex].id}`
                    : undefined
                }
                className="w-full py-2.5 px-1 text-base sm:text-[17px] font-medium text-[#152238] placeholder:text-[#64748B] placeholder:font-normal bg-transparent focus:outline-none"
              />

              {/* Visible Clear-Field Icon Button */}
              {inputValue.length > 0 && (
                <button
                  type="button"
                  data-compact="true"
                  onClick={handleClearInput}
                  aria-label="Clear search field"
                  title="Clear search field"
                  className="compact-control mr-2 w-8 h-8 rounded-full flex items-center justify-center text-[#475569] bg-[#F1F5F9] hover:bg-[#E2E8F0] hover:text-[#152238] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] shrink-0"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              )}

              <button
                type="submit"
                className="shrink-0 bg-[#2457D6] hover:bg-[#1D47B0] text-white font-semibold text-sm sm:text-base px-5 sm:px-7 py-2.5 rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2457D6]"
              >
                Search
              </button>
            </form>
            <p id="search-helper-hint" className="sr-only">
              Type a keyword such as percentage, flooring, workspace, discount, ratio, or fraction. Use Up and Down arrow keys to navigate results.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <main className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Search Results Header + Vertical List */}
          <div className="lg:col-span-8">
            {/* Heading + Filter Pills */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-[#152238]">
                  Showing {matchingItems.length} result{matchingItems.length === 1 ? '' : 's'} for{' '}
                  <span className="text-[#2457D6]">{displayQueryLabel}</span>
                </h2>
                {correctedFrom && (
                  <p className="text-xs text-[#475569] mt-1">
                    Matched{' '}
                    <span className="font-semibold text-[#152238]">
                      {normalizedQuery}
                    </span>{' '}
                    for &ldquo;{correctedFrom}&rdquo;.
                  </p>
                )}
              </div>

              {/* Filters for Calculator, Guide, and Category */}
              <div
                role="group"
                aria-label="Filter search results by content type"
                className="flex flex-wrap items-center gap-1.5"
              >
                {(
                  [
                    { id: 'All', label: 'All', icon: null },
                    { id: 'Calculator', label: 'Calculator', icon: Calculator },
                    { id: 'Guide', label: 'Guide', icon: BookOpen },
                    { id: 'Category', label: 'Category', icon: LayoutGrid },
                  ] as const
                ).map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => handleFilterChange(tab.id)}
                      aria-pressed={isActive}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] ${
                        isActive
                          ? 'bg-[#2457D6] text-white border-[#2457D6]'
                          : 'bg-white text-[#152238] border-[#CBD5E1] hover:bg-[#EEF4FF] hover:border-[#2457D6]/40'
                      }`}
                    >
                      {Icon && <Icon className="w-3.5 h-3.5" aria-hidden="true" />}
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Search Results List or Live Empty State */}
            {matchingItems.length > 0 ? (
              <div
                role="listbox"
                aria-label="Search results"
                className="mt-4 bg-white rounded-2xl border border-[#E2E8F0] shadow-xs divide-y divide-[#E2E8F0] overflow-hidden"
              >
                {matchingItems.map((item, idx) => {
                  const isHighlighted = idx === activeIndex;
                  const actionLabel =
                    item.type === 'Guide'
                      ? 'Read guide'
                      : item.type === 'Category'
                      ? 'Browse category'
                      : 'Open calculator';

                  return (
                    <article
                      key={item.id}
                      id={`search-result-item-${item.id}`}
                      role="option"
                      aria-selected={isHighlighted}
                      onMouseEnter={() => setActiveIndex(idx)}
                      className={`p-4 sm:px-6 sm:py-4.5 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isHighlighted ? 'bg-[#EEF4FF]' : 'hover:bg-[#F8FAFC]'
                      }`}
                    >
                      <div className="flex items-start gap-3.5 min-w-0">
                        <div className="w-10 h-10 rounded-xl border border-[#D0E1FD] bg-[#EBF2FF] text-[#2457D6] flex items-center justify-center shrink-0 mt-0.5">
                          <CategoryIcon
                            category={item.category}
                            type={item.type}
                            className="w-5 h-5"
                          />
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base sm:text-[17px] font-bold text-[#152238] leading-snug">
                              <Link
                                href={item.href}
                                onClick={() =>
                                  syncUrlAndStorage(
                                    submittedQuery,
                                    activeFilter,
                                    true
                                  )
                                }
                                className="hover:text-[#2457D6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] rounded"
                              >
                                <HighlightedText
                                  text={item.title}
                                  highlightTerm={highlightWord}
                                  variant="title"
                                />
                              </Link>
                            </h3>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]">
                              {item.type} • {item.category}
                            </span>
                          </div>

                          <p className="mt-1 text-sm text-[#475569] leading-relaxed">
                            <HighlightedText
                              text={item.description}
                              highlightTerm={highlightWord}
                              variant="body"
                            />
                          </p>
                        </div>
                      </div>

                      <div className="sm:shrink-0 pl-13.5 sm:pl-0">
                        <Link
                          href={item.href}
                          onClick={() =>
                            syncUrlAndStorage(submittedQuery, activeFilter, true)
                          }
                          aria-label={`${actionLabel}: ${item.title}`}
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2457D6] hover:text-[#1D47B0] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] rounded px-1 py-0.5"
                        >
                          <span>{actionLabel}</span>
                          <ArrowRight className="w-4 h-4" aria-hidden="true" />
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              /* Interactive Empty State with Direct Links to Related Categories */
              <div
                role="status"
                aria-live="polite"
                className="mt-4 bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-6 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#EEF4FF] border border-[#D0E1FD] text-[#2457D6] flex items-center justify-center shrink-0">
                      <SearchX className="w-6 h-6" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#152238]">
                        No exact calculators found
                      </h3>
                      <p className="mt-1 text-sm sm:text-base text-[#475569]">
                        We couldn&apos;t find an exact match for &ldquo;
                        <span className="font-semibold text-[#152238]">
                          {submittedQuery}
                        </span>
                        &rdquo;.
                      </p>
                      <div className="mt-4">
                        <p className="text-sm font-semibold text-[#152238]">
                          Try these suggestions:
                        </p>
                        <ul className="mt-2 space-y-1.5 text-sm text-[#475569]">
                          <li className="flex items-center gap-2">
                            <CheckCircle2
                              className="w-4 h-4 text-[#2457D6] shrink-0"
                              aria-hidden="true"
                            />
                            <span>
                              Try a popular term:{' '}
                              <button
                                type="button"
                                onClick={() => applyQuickQuery('percentage')}
                                className="text-[#2457D6] font-semibold underline cursor-pointer"
                              >
                                percentage
                              </button>
                              ,{' '}
                              <button
                                type="button"
                                onClick={() => applyQuickQuery('flooring')}
                                className="text-[#2457D6] font-semibold underline cursor-pointer"
                              >
                                flooring
                              </button>
                              ,{' '}
                              <button
                                type="button"
                                onClick={() => applyQuickQuery('workspace')}
                                className="text-[#2457D6] font-semibold underline cursor-pointer"
                              >
                                workspace
                              </button>
                              , or{' '}
                              <button
                                type="button"
                                onClick={() => applyQuickQuery('loan')}
                                className="text-[#2457D6] font-semibold underline cursor-pointer"
                              >
                                loan
                              </button>
                              .
                            </span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle2
                              className="w-4 h-4 text-[#2457D6] shrink-0"
                              aria-hidden="true"
                            />
                            <span>
                              Open the{' '}
                              <Link
                                href="/calculation-workspace"
                                className="text-[#2457D6] font-semibold underline"
                              >
                                Calculation Workspace
                              </Link>{' '}
                              for custom expressions.
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Related Categories Links */}
                  <div className="lg:col-span-6 lg:border-l lg:border-[#E2E8F0] lg:pl-7">
                    <h4 className="text-sm font-bold text-[#152238] mb-3">
                      Browse Related Categories
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {suggestedCategories.map((cat) => (
                        <Link
                          key={cat.href}
                          href={cat.href}
                          className="flex items-center justify-between p-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-white hover:border-[#2457D6] transition-all group"
                        >
                          <div className="min-w-0 pr-2">
                            <span className="block text-sm font-bold text-[#152238] group-hover:text-[#2457D6]">
                              {cat.name}
                            </span>
                            <span className="block text-xs text-[#475569] mt-0.5 line-clamp-1">
                              {cat.subtitle}
                            </span>
                          </div>
                          <ArrowRight
                            className="w-4 h-4 text-[#2457D6] shrink-0"
                            aria-hidden="true"
                          />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Inline Contextual Suggestion Bar under results */}
            <div className="mt-4 bg-[#EEF4FF] border border-[#D0E1FD] rounded-xl px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 text-sm text-[#152238]">
                <Lightbulb
                  className="w-4 h-4 text-[#2457D6] shrink-0"
                  aria-hidden="true"
                />
                <span>
                  <strong className="font-semibold">Quick searches:</strong>{' '}
                  <button
                    type="button"
                    onClick={() => applyQuickQuery('percentage')}
                    className="text-[#2457D6] font-semibold hover:underline cursor-pointer"
                  >
                    percentage
                  </button>
                  ,{' '}
                  <button
                    type="button"
                    onClick={() => applyQuickQuery('flooring')}
                    className="text-[#2457D6] font-semibold hover:underline cursor-pointer"
                  >
                    flooring
                  </button>
                  ,{' '}
                  <button
                    type="button"
                    onClick={() => applyQuickQuery('discount')}
                    className="text-[#2457D6] font-semibold hover:underline cursor-pointer"
                  >
                    discount
                  </button>
                  ,{' '}
                  <button
                    type="button"
                    onClick={() => applyQuickQuery('ratio')}
                    className="text-[#2457D6] font-semibold hover:underline cursor-pointer"
                  >
                    ratio
                  </button>{' '}
                  or{' '}
                  <button
                    type="button"
                    onClick={() => applyQuickQuery('fraction')}
                    className="text-[#2457D6] font-semibold hover:underline cursor-pointer"
                  >
                    fraction
                  </button>
                  .
                </span>
              </div>
              {submittedQuery.trim() !== '' && (
                <button
                  type="button"
                  onClick={handleClearInput}
                  className="text-xs font-semibold text-[#2457D6] hover:underline cursor-pointer shrink-0 self-start sm:self-auto"
                >
                  Show all tools
                </button>
              )}
            </div>
          </div>

          {/* Right Sidebar: Quick Filters, Calculation Workspace Promo, Related Categories */}
          <aside
            aria-label="Search filters and related categories"
            className="lg:col-span-4 space-y-5"
          >
            {/* Quick Filters Card */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs">
              <h2 className="text-base font-bold text-[#152238] pb-3 border-b border-[#E2E8F0]">
                Filter by Content Type
              </h2>
              <div className="mt-3 space-y-1.5">
                {(
                  [
                    { id: 'All', label: 'All Results', icon: LayoutGrid },
                    { id: 'Calculator', label: 'Calculators', icon: Calculator },
                    { id: 'Guide', label: 'Guides', icon: BookOpen },
                    { id: 'Category', label: 'Categories', icon: LayoutGrid },
                  ] as const
                ).map((item) => {
                  const Icon = item.icon;
                  const isActive = activeFilter === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleFilterChange(item.id)}
                      aria-pressed={isActive}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] ${
                        isActive
                          ? 'bg-[#EEF4FF] text-[#2457D6]'
                          : 'text-[#152238] hover:bg-[#F5F7FA]'
                      }`}
                    >
                      <span className="inline-flex items-center gap-2.5">
                        <Icon
                          className={`w-4 h-4 ${
                            isActive ? 'text-[#2457D6]' : 'text-[#475569]'
                          }`}
                          aria-hidden="true"
                        />
                        <span>{item.label}</span>
                      </span>
                      <ChevronRight
                        className={`w-4 h-4 ${
                          isActive ? 'text-[#2457D6]' : 'text-[#94A3B8]'
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Calculation Workspace Callout Card */}
            <div className="bg-[#EEF4FF] rounded-2xl border border-[#D0E1FD] p-5">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-[#D0E1FD] text-[#2457D6] flex items-center justify-center shrink-0">
                  <History className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#152238]">
                    Need multi-step calculations?
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-[#475569] leading-relaxed">
                    Use the Calculation Workspace to evaluate expressions, keep running subtotals, and reuse previous results.
                  </p>
                  <Link
                    href="/calculation-workspace"
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#2457D6] hover:underline"
                  >
                    <span>Open Calculation Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Related Categories Card */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs">
              <h2 className="text-base font-bold text-[#152238] pb-3 border-b border-[#E2E8F0]">
                Browse Categories
              </h2>
              <ul className="mt-3 divide-y divide-[#F1F5F9]">
                {RELATED_CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <li key={cat.href}>
                      <Link
                        href={cat.href}
                        className="flex items-center justify-between py-2.5 px-2 rounded-lg hover:bg-[#F5F7FA] transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6]"
                      >
                        <span className="inline-flex items-center gap-3">
                          <span
                            className={`w-8 h-8 rounded-lg ${cat.iconBg} ${cat.iconColor} flex items-center justify-center shrink-0`}
                          >
                            <Icon className="w-4 h-4" aria-hidden="true" />
                          </span>
                          <span className="text-sm font-semibold text-[#152238] group-hover:text-[#2457D6]">
                            {cat.name}
                          </span>
                        </span>
                        <ChevronRight
                          className="w-4 h-4 text-[#94A3B8] group-hover:text-[#2457D6]"
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
