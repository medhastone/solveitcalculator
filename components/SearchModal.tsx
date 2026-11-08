'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  X,
  ArrowRight,
  Calculator,
  BookOpen,
  LayoutGrid,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  searchInventory,
  getRelatedCategoriesForQuery,
} from '@/lib/searchIndex';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const results = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      return searchInventory('', 'Calculator', 8);
    }
    return searchInventory(trimmed, 'All', 8);
  }, [query]);

  const relatedCategories = useMemo(
    () => getRelatedCategoriesForQuery(query),
    [query]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (results.length > 0) {
          setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (results.length > 0) {
          setActiveIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
        }
      } else if (e.key === 'Enter' && activeIndex >= 0 && results[activeIndex]) {
        e.preventDefault();
        const target = results[activeIndex];
        onClose();
        router.push(target.href);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, results, activeIndex, router]);

  if (!isOpen) return null;

  const handleClearQuery = () => {
    setQuery('');
    setActiveIndex(-1);
    inputRef.current?.focus();
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeIndex >= 0 && results[activeIndex]) {
      onClose();
      router.push(results[activeIndex].href);
      return;
    }
    const trimmed = query.trim();
    onClose();
    router.push(
      trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : '/search'
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-14 sm:pt-20 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-modal-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#152238]/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#131E32] rounded-2xl shadow-xl border border-[#E2E8F0] dark:border-[#263859] overflow-hidden z-10">
        <h2 id="search-modal-title" className="sr-only">
          Search Calculators
        </h2>

        <form
          onSubmit={handleFormSubmit}
          role="search"
          aria-label="Quick calculator search"
          className="flex items-center px-4 py-3 border-b border-[#E2E8F0] dark:border-[#263859]"
        >
          <Search
            className="w-5 h-5 text-[#2457D6] dark:text-[#60A5FA] mr-3 shrink-0"
            aria-hidden="true"
          />
          <label htmlFor="modal-calculator-search" className="sr-only">
            Search calculators by name, alias, or topic
          </label>
          <input
            ref={inputRef}
            id="modal-calculator-search"
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(-1);
            }}
            placeholder="Search calculators (e.g., percentage, flooring, workspace, loan, BMI)..."
            aria-autocomplete="list"
            aria-controls="modal-search-results-list"
            aria-activedescendant={
              activeIndex >= 0 && results[activeIndex]
                ? `modal-result-${results[activeIndex].id}`
                : undefined
            }
            className="w-full bg-transparent text-[#152238] dark:text-[#F8FAFC] placeholder:text-[#64748B] dark:placeholder:text-[#94A3B8] focus:outline-none text-base"
          />

          {query.length > 0 && (
            <button
              type="button"
              data-compact="true"
              onClick={handleClearQuery}
              aria-label="Clear search query"
              title="Clear search query"
              className="compact-control p-1.5 mr-1 rounded-full text-[#64748B] hover:text-[#152238] hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          )}

          <button
            type="button"
            data-compact="true"
            onClick={onClose}
            aria-label="Close search dialog"
            className="compact-control px-2.5 py-1 text-xs font-semibold text-[#475569] dark:text-[#CBD5E1] bg-[#F1F5F9] dark:bg-[#1E293B] hover:bg-[#E2E8F0] rounded-md transition-colors cursor-pointer shrink-0"
          >
            Esc
          </button>
        </form>

        <div className="max-h-[65vh] overflow-y-auto p-3">
          {results.length > 0 ? (
            <div>
              <div className="px-3 py-1.5 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
                  {query.trim() === ''
                    ? 'Popular & Featured Calculators'
                    : `Matching Tools (${results.length})`}
                </span>
                <span className="hidden sm:inline text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                  Use ↑↓ arrows and Enter to open
                </span>
              </div>
              <ul
                id="modal-search-results-list"
                role="listbox"
                aria-label="Calculator suggestions"
                className="space-y-1 mt-1"
              >
                {results.map((item, idx) => {
                  const isSelected = idx === activeIndex;
                  const TypeIcon =
                    item.type === 'Guide'
                      ? BookOpen
                      : item.type === 'Category'
                      ? LayoutGrid
                      : Calculator;

                  return (
                    <li
                      key={item.id}
                      id={`modal-result-${item.id}`}
                      role="option"
                      aria-selected={isSelected}
                    >
                      <Link
                        href={item.href}
                        onClick={onClose}
                        onMouseEnter={() => setActiveIndex(idx)}
                        className={`flex items-center justify-between px-3.5 py-3 rounded-xl transition-colors group ${
                          isSelected
                            ? 'bg-[#EEF4FF] dark:bg-[#1E3A8A]/50 text-[#2457D6] dark:text-[#93C5FD]'
                            : 'hover:bg-[#F5F7FA] dark:hover:bg-[#192742]'
                        }`}
                      >
                        <div className="flex items-start gap-3 min-w-0 pr-3">
                          <div className="w-9 h-9 rounded-lg bg-[#EBF2FF] dark:bg-[#1E3A8A] text-[#2457D6] dark:text-[#93C5FD] flex items-center justify-center shrink-0 mt-0.5">
                            <TypeIcon className="w-4 h-4" aria-hidden="true" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-sm font-bold text-[#152238] dark:text-[#F8FAFC] group-hover:text-[#2457D6]">
                                {item.title}
                              </span>
                              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#F1F5F9] dark:bg-[#1E293B] text-[#475569] dark:text-[#CBD5E1]">
                                {item.category}
                              </span>
                            </div>
                            <p className="text-xs text-[#475569] dark:text-[#CBD5E1] mt-0.5 line-clamp-1">
                              {item.description}
                            </p>
                          </div>
                        </div>
                        <ArrowRight
                          className="w-4 h-4 text-[#64748B] group-hover:text-[#2457D6] shrink-0 transition-transform group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <div
              role="status"
              aria-live="polite"
              className="py-6 px-4 text-center"
            >
              <p className="text-base font-bold text-[#152238] dark:text-[#F8FAFC]">
                No exact calculator found for &ldquo;{query}&rdquo;
              </p>
              <p className="mt-1 text-xs sm:text-sm text-[#475569] dark:text-[#CBD5E1]">
                Try a simpler keyword or browse one of these related categories:
              </p>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left">
                {relatedCategories.map((cat) => (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    onClick={onClose}
                    className="flex items-center justify-between p-3 rounded-xl border border-[#E2E8F0] dark:border-[#263859] bg-[#F8FAFC] dark:bg-[#192742] hover:border-[#2457D6] transition-colors"
                  >
                    <div className="min-w-0 pr-2">
                      <span className="block text-xs font-bold text-[#152238] dark:text-[#F8FAFC]">
                        {cat.name}
                      </span>
                      <span className="block text-[11px] text-[#475569] dark:text-[#CBD5E1] truncate">
                        {cat.subtitle}
                      </span>
                    </div>
                    <ArrowRight
                      className="w-3.5 h-3.5 text-[#2457D6] shrink-0"
                      aria-hidden="true"
                    />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-4 py-2.5 bg-[#F8FAFC] dark:bg-[#0F172A] border-t border-[#E2E8F0] dark:border-[#263859] flex items-center justify-between text-xs text-[#475569] dark:text-[#CBD5E1]">
          <span>
            Press <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-[#1E293B] border border-[#CBD5E1] font-mono text-[11px]">↑</kbd>{' '}
            <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-[#1E293B] border border-[#CBD5E1] font-mono text-[11px]">↓</kbd> to navigate,{' '}
            <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-[#1E293B] border border-[#CBD5E1] font-mono text-[11px]">Enter</kbd> to open
          </span>
          <Link
            href={
              query.trim()
                ? `/search?q=${encodeURIComponent(query.trim())}`
                : '/calculators'
            }
            onClick={onClose}
            className="font-semibold text-[#2457D6] dark:text-[#60A5FA] hover:underline"
          >
            {query.trim() ? 'View all search results →' : 'Browse All Calculators →'}
          </Link>
        </div>
      </div>
    </div>
  );
}
