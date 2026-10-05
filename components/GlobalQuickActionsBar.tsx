'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Repeat,
  Clock,
  Wrench,
  HeartPulse,
  Briefcase,
  Sparkles,
  Search,
  Bookmark,
  History,
  Percent,
} from 'lucide-react';

interface GlobalQuickActionsBarProps {
  onOpenSearch?: () => void;
  onOpenHistory?: () => void;
  onOpenSaved?: () => void;
}

const QUICK_LINKS = [
  { name: 'EMI Calculator', href: '/loans-and-amortization', icon: TrendingUp, color: 'text-emerald-400' },
  { name: 'Unit Converter', href: '/conversions', icon: Repeat, color: 'text-amber-400' },
  { name: 'Time & Date', href: '/time-date', icon: Clock, color: 'text-cyan-400' },
  { name: 'Scientific', href: '/scientific-calculator', icon: Wrench, color: 'text-purple-400' },
  { name: 'Health & BMI', href: '/bmi-calculator', icon: HeartPulse, color: 'text-rose-400' },
  { name: 'Payroll & Wages', href: '/work-hours-payroll-calculator', icon: Briefcase, color: 'text-blue-400' },
  { name: 'Percentage', href: '/percentage-calculator', icon: Percent, color: 'text-teal-400' },
];

export default function GlobalQuickActionsBar({
  onOpenSearch,
  onOpenHistory,
  onOpenSaved,
}: GlobalQuickActionsBarProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Check scroll position to dynamically show/hide edge fade indicators
  const checkScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    // Allow small 4px threshold for subpixel rounding on high-DPI displays
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    checkScroll();

    // Check after slight delay to ensure fonts and layout dimensions are fully calculated
    const initialTimer = setTimeout(checkScroll, 120);

    const handleScroll = () => {
      checkScroll();
    };

    el.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', checkScroll, { passive: true });

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        checkScroll();
      });
      resizeObserver.observe(el);
    }

    return () => {
      clearTimeout(initialTimer);
      el.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkScroll);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [checkScroll]);

  return (
    <nav
      aria-label="Quick Access and Action Bar"
      className="w-full bg-surface-container-lowest/90 border-b border-outline-variant/30 backdrop-blur-sm px-2.5 sm:px-4 py-1.5 transition-colors relative z-20"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-1.5 sm:gap-3">
        {/* Scrollable Quick Links Track with Dynamic Edge Fades */}
        <div className="relative min-w-0 flex-1 overflow-hidden flex items-center">
          {/* Left Edge Fade Indicator */}
          <div
            className={`pointer-events-none absolute left-0 top-0 bottom-0 w-6 sm:w-8 bg-gradient-to-r from-surface-container-lowest via-surface-container-lowest/90 to-transparent z-10 transition-opacity duration-200 ${
              canScrollLeft ? 'opacity-100' : 'opacity-0'
            }`}
            aria-hidden="true"
          />

          {/* Touch-Friendly Horizontal Scroll Container */}
          <div
            ref={scrollContainerRef}
            className="flex items-center gap-1.5 sm:gap-2 text-xs flex-nowrap overflow-x-auto no-scrollbar scroll-smooth touch-pan-x overscroll-x-contain py-1 px-0.5"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {/* Quick Tag */}
            <span className="text-[11px] font-semibold text-on-surface-variant flex items-center gap-1 uppercase tracking-wider shrink-0 select-none mr-0.5 pl-0.5">
              <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>Quick:</span>
            </span>

            {/* Quick Links Pills */}
            {QUICK_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center gap-1.5 px-3 py-1.5 sm:py-1 rounded-full bg-surface-container-high/60 hover:bg-surface-container-high active:scale-95 border border-outline-variant/40 text-on-surface hover:text-primary transition-all whitespace-nowrap text-xs font-medium shrink-0 cursor-pointer shadow-2xs hover:shadow-xs"
                >
                  <Icon className={`w-3.5 h-3.5 sm:w-3 sm:h-3 ${link.color} shrink-0`} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Edge Fade Indicator */}
          <div
            className={`pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-l from-surface-container-lowest via-surface-container-lowest/90 to-transparent z-10 transition-opacity duration-200 ${
              canScrollRight ? 'opacity-100' : 'opacity-0'
            }`}
            aria-hidden="true"
          />
        </div>

        {/* Docked Action Shortcuts on Right (Always Accessible on Mobile) */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 pl-1.5 sm:pl-2.5 border-l border-outline-variant/40 bg-surface-container-lowest/95 backdrop-blur-sm z-20">
          <button
            type="button"
            onClick={onOpenSearch}
            className="p-1.5 sm:p-2 rounded-lg bg-surface-container-high/60 hover:bg-surface-container-high active:scale-90 text-on-surface-variant hover:text-primary border border-outline-variant/40 transition-all cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-primary/40"
            title="Search Calculators (⌘K)"
            aria-label="Search Calculators"
          >
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            type="button"
            onClick={onOpenSaved}
            className="p-1.5 sm:p-2 rounded-lg bg-surface-container-high/60 hover:bg-surface-container-high active:scale-90 text-on-surface-variant hover:text-primary border border-outline-variant/40 transition-all cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-primary/40"
            title="Saved Calculators"
            aria-label="Saved Calculators"
          >
            <Bookmark className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            type="button"
            onClick={onOpenHistory}
            className="p-1.5 sm:p-2 rounded-lg bg-surface-container-high/60 hover:bg-surface-container-high active:scale-90 text-on-surface-variant hover:text-primary border border-outline-variant/40 transition-all cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-primary/40"
            title="Calculation History"
            aria-label="Calculation History"
          >
            <History className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </nav>
  );
}
