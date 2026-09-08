'use client';

/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCurrentTheme, toggleTheme } from '../lib/theme';

interface CategoryItem {
  name: string;
  href: string;
  icon: string;
  tag: string;
}

const allCategories: CategoryItem[] = [
  { name: 'Technology & Dev', href: '/technology', icon: 'terminal', tag: 'Subnet, RAID, Crypto' },
  { name: 'Science & Physics', href: '/science', icon: 'science', tag: 'Density, Molarity' },
  { name: 'Electrical & Wire', href: '/electrical', icon: 'electric_bolt', tag: 'AWG, FLA, Solar' },
  { name: 'Business & Startup', href: '/business', icon: 'domain', tag: 'Runway, Margins, SaaS' },
  { name: 'Education & GPA', href: '/education', icon: 'school', tag: 'GPA, Final Exam' },
  { name: 'Finance & Loans', href: '/finance', icon: 'payments', tag: 'Mortgages, FIRE' },
  { name: 'Health & Fitness', href: '/health', icon: 'favorite', tag: 'BMI, BMR, TDEE' },
  { name: 'Time & Date', href: '/time-date', icon: 'schedule', tag: 'Age, Clock, Timers' },
  { name: 'Construction', href: '/home-construction', icon: 'construction', tag: 'Concrete, Framing' },
  { name: 'Math & Stats', href: '/math', icon: 'calculate', tag: 'Algebra, Geometry' },
  { name: 'Conversions', href: '/conversions', icon: 'sync_alt', tag: 'Metric, Data, Units' },
  { name: 'Automotive', href: '/automotive', icon: 'directions_car', tag: 'MPG, EV Range' },
];

export default function Header() {
  const [isDark, setIsDark] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [mobileSearch, setMobileSearch] = useState<string>('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      setIsDark(getCurrentTheme() === 'dark');
    }, 0);

    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        setIsDark(customEvent.detail === 'dark');
      } else {
        setIsDark(getCurrentTheme() === 'dark');
      }
    };

    window.addEventListener('solveit-theme-change', handleThemeChange);
    window.addEventListener('storage', handleThemeChange);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('solveit-theme-change', handleThemeChange);
      window.removeEventListener('storage', handleThemeChange);
    };
  }, []);

  // Close mobile menu on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggle = () => {
    const next = toggleTheme();
    setIsDark(next === 'dark');
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex flex-col">
      {/* Main Header bar */}
      <header className="w-full bg-surface/90 backdrop-blur-xl border-b border-outline-variant/40 shadow-[0_1px_8px_rgba(0,0,0,0.04)] transition-colors duration-150">
        <div className="h-16 max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Brand Logo & Desktop Navigation */}
          <div className="flex items-center gap-3 xl:gap-5 min-w-0">
            {/* Logo - Protected with shrink-0 so it is NEVER hidden or compressed */}
            <Link
              href="/"
              onClick={closeMobileMenu}
              className="shrink-0 flex items-center focus:outline-none group select-none"
              aria-label="SolveIt Calculator Homepage"
            >
              <div className="p-1 rounded-xl bg-surface-container-low border border-outline-variant/30 group-hover:border-primary/40 transition-all shadow-xs">
                <img
                  alt="SolveIt Calculator Brand Logo"
                  className="h-9 sm:h-10 w-auto object-contain block"
                  src="/logo.png"
                />
              </div>
            </Link>

            {/* Desktop Navigation - Clean, curated, and uncluttered */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 p-0.5" aria-label="Main Navigation">
              <Link
                href="/technology"
                className="px-2.5 xl:px-3 py-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors font-body-sm text-body-sm whitespace-nowrap"
              >
                Technology
              </Link>
              <Link
                href="/science"
                className="px-2.5 xl:px-3 py-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors font-body-sm text-body-sm whitespace-nowrap"
              >
                Science
              </Link>
              <Link
                href="/finance"
                className="px-2.5 xl:px-3 py-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors font-body-sm text-body-sm whitespace-nowrap"
              >
                Finance
              </Link>
              <Link
                href="/business"
                className="px-2.5 xl:px-3 py-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors font-body-sm text-body-sm whitespace-nowrap"
              >
                Business
              </Link>
              <Link
                href="/health"
                className="px-2.5 xl:px-3 py-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors font-body-sm text-body-sm whitespace-nowrap"
              >
                Health
              </Link>

              {/* All Categories Dropdown Menu */}
              <div className="relative group">
                <button
                  type="button"
                  aria-haspopup="true"
                  className="px-2.5 xl:px-3 py-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors font-body-sm text-body-sm flex items-center gap-1 cursor-pointer select-none"
                >
                  <span className="material-symbols-outlined text-[17px] text-primary">widgets</span>
                  <span>Categories</span>
                  <span className="material-symbols-outlined text-[15px] transition-transform duration-200 group-hover:rotate-180">
                    expand_more
                  </span>
                </button>

                {/* Mega Dropdown Panel */}
                <div className="absolute top-full left-0 mt-1.5 w-96 bg-surface-container-lowest/95 backdrop-blur-2xl rounded-2xl shadow-xl border border-outline-variant/30 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 p-3 z-50">
                  <div className="px-2 py-1.5 mb-2 border-b border-outline-variant/20 flex items-center justify-between">
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider font-semibold">
                      Explore All Categories
                    </span>
                    <span className="font-data-mono text-[11px] text-primary font-medium">
                      500+ Calculators
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1 max-h-[380px] overflow-y-auto">
                    {allCategories.map((cat) => (
                      <Link
                        key={cat.name}
                        href={cat.href}
                        className="flex items-center gap-2 p-2 rounded-xl hover:bg-surface-container-high text-on-surface transition-colors group/item"
                      >
                        <div className="w-8 h-8 rounded-lg bg-surface-container-low group-hover/item:bg-primary group-hover/item:text-on-primary flex items-center justify-center shrink-0 transition-colors">
                          <span className="material-symbols-outlined text-[18px]">{cat.icon}</span>
                        </div>
                        <div className="min-w-0">
                          <div className="font-body-sm text-body-sm font-medium text-on-surface truncate group-hover/item:text-primary transition-colors">
                            {cat.name}
                          </div>
                          <div className="font-label-caps text-[10px] text-on-surface-variant truncate">
                            {cat.tag}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <div className="mt-2 pt-2 border-t border-outline-variant/20 flex items-center justify-between px-2 text-body-sm">
                    <Link
                      href="/"
                      className="font-label-caps text-label-caps text-primary hover:underline flex items-center gap-1 font-semibold"
                    >
                      Browse Complete Catalog →
                    </Link>
                  </div>
                </div>
              </div>
            </nav>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Desktop Search Bar */}
            <Link
              href="/conversions"
              className="hidden md:flex items-center justify-between w-36 lg:w-44 xl:w-52 px-3 py-1.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all focus:outline-none"
            >
              <span className="flex items-center gap-1.5 text-body-sm font-body-sm truncate">
                <span className="material-symbols-outlined text-[17px] text-primary">search</span>
                <span>Quick search...</span>
              </span>
              <kbd className="hidden lg:inline-block font-data-mono text-[10px] bg-surface-container-highest text-on-surface px-1.5 py-0.5 rounded border border-outline-variant/40 shadow-xs">
                ⌘K
              </kbd>
            </Link>

            {/* Mobile Quick Search Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(prev => !prev)}
              aria-label="Search tools"
              title="Search tools"
              className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors border border-outline-variant/30 bg-surface-container-low"
            >
              <span className="material-symbols-outlined text-[20px]">search</span>
            </button>

            {/* Bookmark button */}
            <Link
              href="/conversions#favorites-section"
              aria-label="Saved Favorites"
              className="w-9 h-9 rounded-xl hidden sm:flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors border border-transparent hover:border-outline-variant/40"
              title="Saved Favorites"
            >
              <span className="material-symbols-outlined text-[20px]">bookmark</span>
            </Link>

            {/* Global Theme Toggle Button */}
            <button
              aria-label={mounted && isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              title={mounted && isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              type="button"
              onClick={handleToggle}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors border border-outline-variant/40 cursor-pointer bg-surface-container-low hover:border-primary/40 shadow-xs"
            >
              <span className="material-symbols-outlined text-[19px] transition-transform duration-200">
                {mounted && isDark ? 'light_mode' : 'dark_mode'}
              </span>
            </button>

            {/* Mobile Hamburger Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(prev => !prev)}
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              title={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors border border-outline-variant/40 bg-surface-container-low cursor-pointer"
            >
              <span className="material-symbols-outlined text-[22px]">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden w-full bg-surface-container-lowest/98 backdrop-blur-2xl border-b border-outline-variant/30 shadow-2xl p-4 max-h-[calc(100vh-64px)] overflow-y-auto animate-in slide-in-from-top-2 duration-200">
            {/* Mobile Search Input */}
            <div className="mb-4">
              <div className="flex items-center gap-2 bg-surface-container-low px-3 py-2 rounded-xl border border-outline-variant/40">
                <span className="material-symbols-outlined text-primary text-[20px]">search</span>
                <input
                  type="text"
                  value={mobileSearch}
                  onChange={(e) => setMobileSearch(e.target.value)}
                  placeholder="Search 500+ calculators..."
                  className="w-full bg-transparent font-body-sm text-body-sm text-on-surface outline-none placeholder:text-on-surface-variant"
                />
                {mobileSearch && (
                  <button
                    type="button"
                    onClick={() => setMobileSearch('')}
                    className="text-on-surface-variant hover:text-on-surface"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Categories Grid */}
            <div className="mb-3">
              <div className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider font-semibold mb-2 px-1">
                Calculator Categories
              </div>
              <div className="grid grid-cols-2 gap-2">
                {allCategories
                  .filter(cat => !mobileSearch || cat.name.toLowerCase().includes(mobileSearch.toLowerCase()) || cat.tag.toLowerCase().includes(mobileSearch.toLowerCase()))
                  .map((cat) => (
                    <Link
                      key={cat.name}
                      href={cat.href}
                      onClick={closeMobileMenu}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/20 transition-all text-on-surface"
                    >
                      <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center shrink-0 text-primary">
                        <span className="material-symbols-outlined text-[18px]">{cat.icon}</span>
                      </div>
                      <div className="min-w-0">
                        <div className="font-body-sm text-body-sm font-semibold text-on-surface truncate">
                          {cat.name.split('&')[0].trim()}
                        </div>
                        <div className="font-label-caps text-[10px] text-on-surface-variant truncate">
                          {cat.tag}
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>

            {/* Mobile Footer Quick Actions */}
            <div className="pt-3 border-t border-outline-variant/20 flex flex-col gap-2">
              <Link
                href="/conversions#favorites-section"
                onClick={closeMobileMenu}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-container-low text-on-surface font-body-sm hover:bg-surface-container-high transition-colors"
              >
                <span className="material-symbols-outlined text-[18px] text-primary">bookmark</span>
                <span>Saved Favorites &amp; Recent Tools</span>
              </Link>
              <Link
                href="/"
                onClick={closeMobileMenu}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-container-low text-on-surface font-body-sm hover:bg-surface-container-high transition-colors"
              >
                <span className="material-symbols-outlined text-[18px] text-secondary">apps</span>
                <span>All 500+ Calculators &amp; Categories</span>
              </Link>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}
