'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowRight } from 'lucide-react';
import type { SearchInventoryItem } from '@/lib/searchIndex';

const HOME_SEARCH_STORAGE_KEY = 'solveit_home_search_state';

type SearchModule = typeof import('@/lib/searchIndex');

export default function HomeSearchBar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [searchMod, setSearchMod] = useState<SearchModule | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const loadingRef = useRef(false);

  const ensureSearchModule = () => {
    if (searchMod || loadingRef.current) return;
    loadingRef.current = true;
    import('@/lib/searchIndex')
      .then((mod) => {
        setSearchMod(mod);
      })
      .catch(() => {
        loadingRef.current = false;
      });
  };

  useEffect(() => {
    try {
      const saved = window.sessionStorage.getItem(HOME_SEARCH_STORAGE_KEY);
      if (saved) {
        setSearchQuery(saved);
        ensureSearchModule();
      }
    } catch {
      // Ignore sessionStorage errors
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateSearchQuery = (nextValue: string) => {
    setSearchQuery(nextValue);
    setActiveIndex(-1);
    if (nextValue.trim()) {
      ensureSearchModule();
    }
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

  const filteredTools: SearchInventoryItem[] = useMemo(() => {
    const q = searchQuery.trim();
    if (!q || !searchMod) return [];
    return searchMod.searchInventory(q, 'All', 7);
  }, [searchQuery, searchMod]);

  const suggestedCategories = useMemo(() => {
    if (!searchMod) return [];
    return searchMod.getRelatedCategoriesForQuery(searchQuery);
  }, [searchQuery, searchMod]);

  const isDropdownVisible = isSearchFocused && searchQuery.trim().length > 0;
  const hasListbox = isDropdownVisible && filteredTools.length > 0;

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
    } else if (
      e.key === 'Enter' &&
      activeIndex >= 0 &&
      filteredTools[activeIndex]
    ) {
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
          <Search className="w-5 h-5 text-[#152238]" aria-hidden="true" />
        </div>
        <input
          ref={searchInputRef}
          id="homepage-calculator-search"
          type="text"
          role="combobox"
          value={searchQuery}
          onChange={(e) => {
            updateSearchQuery(e.target.value);
            setIsSearchFocused(true);
          }}
          onFocus={() => {
            ensureSearchModule();
            setIsSearchFocused(true);
          }}
          onBlur={() => setTimeout(() => setIsSearchFocused(false), 180)}
          onKeyDown={handleSearchKeyDown}
          aria-autocomplete="list"
          aria-haspopup="listbox"
          aria-expanded={hasListbox}
          aria-controls={hasListbox ? 'homepage-search-listbox' : undefined}
          aria-activedescendant={
            hasListbox && activeIndex >= 0 && filteredTools[activeIndex]
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
      {isDropdownVisible && searchMod && (
        <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden z-30 text-left">
          {filteredTools.length > 0 ? (
            <ul
              id="homepage-search-listbox"
              role="listbox"
              aria-label="Matching calculators"
              className="divide-y divide-slate-100"
            >
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
            <div
              role="status"
              aria-live="polite"
              className="p-4 text-sm text-slate-600"
            >
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
  );
}
