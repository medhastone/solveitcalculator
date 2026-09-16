"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { allUniqueTools } from "../lib/searchData";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_SHORTCUTS = [
  { label: "Mortgage", query: "mortgage" },
  { label: "BMI & Body Fat", query: "bmi" },
  { label: "SIP & Growth", query: "investing" },
  { label: "Percentage", query: "percentage" },
  { label: "Exact Age", query: "age" },
  { label: "Salary & Pay", query: "salary" },
  { label: "FIRE Retirement", query: "fire" },
  { label: "Scientific Solver", query: "scientific" },
  { label: "Concrete & Construction", query: "concrete" },
  { label: "GST & Tax", query: "tax" },
  { label: "Unit Conversions", query: "conversion" },
  { label: "Engine RPM", query: "rpm" },
  { label: "Wire Sizing (AWG)", query: "electrical" },
];

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Focus input and reset query on open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => {
        clearTimeout(timer);
      };
    } else {
      document.body.style.overflow = "";
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Ranked search algorithm matching titles, names, keywords, category, and descriptions
  const searchResults = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];

    const searchTerms = trimmed.split(/\s+/).filter(Boolean);

    const scored = allUniqueTools.map((tool) => {
      let score = 0;
      const title = (tool.title || "").toLowerCase();
      const name = (tool.name || "").toLowerCase();
      const desc = (tool.desc || "").toLowerCase();
      const label = (tool.label || "").toLowerCase();
      const keywords = (tool.keywords || []).map((k: string) => k.toLowerCase());

      // Check if all search terms match at least somewhere
      const allTermsMatch = searchTerms.every((term) => {
        return (
          title.includes(term) ||
          name.includes(term) ||
          desc.includes(term) ||
          label.includes(term) ||
          keywords.some((k: string) => k.includes(term))
        );
      });

      if (!allTermsMatch) return { tool, score: -1 };

      // Exact title match gets top priority
      if (title === trimmed || name === trimmed) score += 100;
      else if (title.startsWith(trimmed)) score += 60;
      else if (title.includes(trimmed)) score += 40;

      // Keyword matches
      keywords.forEach((k: string) => {
        if (k === trimmed) score += 50;
        else if (k.startsWith(trimmed)) score += 30;
        else if (k.includes(trimmed)) score += 15;
      });

      // Individual term matches in title
      searchTerms.forEach((term) => {
        if (title.includes(term)) score += 20;
        if (name.includes(term)) score += 15;
        if (keywords.some((k: string) => k.includes(term))) score += 10;
        if (label.includes(term)) score += 8;
        if (desc.includes(term)) score += 5;
      });

      return { tool, score };
    });

    return scored
      .filter((item) => item.score >= 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.tool)
      .slice(0, 10);
  }, [query]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchResults]);

  // Keyboard navigation inside modal
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        searchResults.length > 0 ? (prev + 1) % searchResults.length : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        searchResults.length > 0
          ? (prev - 1 + searchResults.length) % searchResults.length
          : 0
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (searchResults.length > 0 && searchResults[selectedIndex]) {
        const target = searchResults[selectedIndex];
        onClose();
        router.push(target.link);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-16 sm:pt-24 px-3 sm:px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Quick Search Tools"
    >
      {/* Dimmed Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className="relative w-full max-w-2xl bg-surface-container-lowest text-on-surface rounded-2xl shadow-2xl overflow-hidden border border-outline-variant/40 animate-in fade-in zoom-in-95 duration-200 z-10 flex flex-col max-h-[85vh]"
        onKeyDown={handleKeyDown}
      >
        {/* Search Header Bar */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-outline-variant/30 bg-surface-container-low/50">
          <span className="material-symbols-outlined text-primary text-[24px] mr-3 shrink-0">
            search
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search all 100+ calculators by name, keyword or formula..."
            className="w-full bg-transparent font-body-lg text-body-lg text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none"
            aria-autocomplete="list"
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              aria-label="Clear search input"
              className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors mr-1"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          ) : null}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search dialog"
            className="hidden sm:flex items-center gap-1 font-data-mono text-[11px] bg-surface-container text-on-surface-variant px-2 py-1 rounded-lg border border-outline-variant/30 hover:bg-surface-container-high transition-colors"
          >
            <span>ESC</span>
          </button>
        </div>

        {/* Results / Default View Area */}
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto overscroll-contain p-2 sm:p-3 divide-y divide-outline-variant/10"
        >
          {query.trim() === "" ? (
            <div className="py-4 px-2">
              <div className="flex items-center gap-2 mb-3 px-1 text-xs font-label-caps uppercase tracking-wider text-on-surface-variant/70 font-semibold">
                <span className="material-symbols-outlined text-[16px] text-primary">
                  trending_up
                </span>
                <span>Popular &amp; Recommended Searches</span>
              </div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-6">
                {POPULAR_SHORTCUTS.map((sc) => (
                  <button
                    key={sc.label}
                    type="button"
                    onClick={() => {
                      setQuery(sc.query);
                      inputRef.current?.focus();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/30 text-on-surface hover:text-primary transition-all text-body-sm font-body-sm flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[15px] text-primary">
                      search
                    </span>
                    <span>{sc.label}</span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 mb-3 px-1 text-xs font-label-caps uppercase tracking-wider text-on-surface-variant/70 font-semibold">
                <span className="material-symbols-outlined text-[16px] text-secondary">
                  grid_view
                </span>
                <span>Featured Precision Categories</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { name: "Finance & Loans", href: "/finance", icon: "payments" },
                  { name: "Health & Fitness", href: "/health", icon: "vital_signs" },
                  { name: "Math & Scientific", href: "/math", icon: "calculate" },
                  { name: "Universal Units", href: "/conversions", icon: "sync_alt" },
                  { name: "Time & Date", href: "/time-date", icon: "schedule" },
                  { name: "Construction & DIY", href: "/home-construction", icon: "construction" },
                ].map((cat) => (
                  <Link
                    key={cat.name}
                    href={cat.href}
                    onClick={onClose}
                    className="p-2.5 rounded-xl bg-surface-container-low/70 hover:bg-surface-container-high border border-outline-variant/20 flex items-center gap-2.5 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors shrink-0">
                      <span className="material-symbols-outlined text-[18px]">
                        {cat.icon}
                      </span>
                    </div>
                    <span className="text-body-sm font-body-sm font-medium text-on-surface truncate group-hover:text-primary transition-colors">
                      {cat.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-1">
              <div className="px-3 py-1.5 text-xs font-label-caps tracking-wider uppercase text-on-surface-variant/70 font-semibold flex items-center justify-between">
                <span>
                  Calculators ({searchResults.length} Match{searchResults.length > 1 ? "es" : ""})
                </span>
                <span className="text-[11px] font-normal normal-case text-on-surface-variant/60">
                  Use ↑↓ to navigate, Enter to open
                </span>
              </div>
              <div className="flex flex-col gap-1">
                {searchResults.map((tool, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <Link
                      key={`${tool.id}-${idx}`}
                      href={tool.link}
                      onClick={onClose}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl transition-all group ${
                        isSelected
                          ? "bg-primary/10 border border-primary/30"
                          : "hover:bg-surface-container-low border border-transparent"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? "bg-primary text-on-primary"
                            : "bg-surface-container text-on-surface-variant group-hover:text-primary group-hover:bg-surface-container-high"
                        }`}
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          calculate
                        </span>
                      </div>

                      <div className="flex flex-col flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-body-md font-body-md font-semibold truncate ${
                              isSelected ? "text-primary" : "text-on-surface"
                            }`}
                          >
                            {tool.title || tool.name}
                          </span>
                          {tool.label && (
                            <span
                              className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-md shrink-0 ${
                                tool.badgeClass ||
                                "bg-surface-container-high text-on-surface-variant"
                              }`}
                            >
                              {tool.label}
                            </span>
                          )}
                        </div>
                        <p className="text-body-sm font-body-sm text-on-surface-variant/80 truncate mt-0.5">
                          {tool.desc}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isSelected && (
                          <span className="hidden sm:inline-block font-data-mono text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded border border-primary/30">
                            ↵ Enter
                          </span>
                        )}
                        <span
                          className={`material-symbols-outlined text-[20px] transition-transform duration-150 ${
                            isSelected
                              ? "text-primary translate-x-0.5"
                              : "text-on-surface-variant/40 group-hover:text-on-surface"
                          }`}
                        >
                          arrow_forward
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-on-surface-variant">
              <span className="material-symbols-outlined text-[44px] text-on-surface-variant/40 mb-2 block">
                search_off
              </span>
              <p className="font-body-md text-on-surface font-medium">
                No calculators found for &ldquo;{query}&rdquo;
              </p>
              <p className="font-body-sm text-on-surface-variant/70 mt-1">
                Try searching for general keywords like &ldquo;mortgage&rdquo;, &ldquo;loan&rdquo;, &ldquo;percentage&rdquo;, &ldquo;age&rdquo;, or &ldquo;weight&rdquo;.
              </p>
            </div>
          )}
        </div>

        {/* Footer Shortcut Legend */}
        <div className="px-4 py-2.5 bg-surface-container-low/60 border-t border-outline-variant/30 flex items-center justify-between text-xs text-on-surface-variant/70 font-data-mono">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="bg-surface-container-highest px-1.5 py-0.5 rounded border border-outline-variant/40 text-[10px]">
                ↑
              </kbd>
              <kbd className="bg-surface-container-highest px-1.5 py-0.5 rounded border border-outline-variant/40 text-[10px]">
                ↓
              </kbd>
              <span>Navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="bg-surface-container-highest px-1.5 py-0.5 rounded border border-outline-variant/40 text-[10px]">
                ↵
              </kbd>
              <span>Select</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="bg-surface-container-highest px-1.5 py-0.5 rounded border border-outline-variant/40 text-[10px]">
                ESC
              </kbd>
              <span>Close</span>
            </span>
          </div>
          <span className="font-body-sm text-[11px] text-primary font-medium">
            SolveIt Calculator Precision Search
          </span>
        </div>
      </div>
    </div>
  );
}
