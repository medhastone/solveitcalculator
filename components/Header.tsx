'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Calculator,
  Search,
  History,
  Bookmark,
  ChevronDown,
  Menu,
  X,
  Layers,
  ArrowRight,
  TrendingUp,
  HeartPulse,
  Clock,
  Repeat,
  Wrench,
  GraduationCap,
  Sparkles,
  Sun,
  Moon,
} from 'lucide-react';
import { getSavedTools } from '../lib/bookmarks';
import { getCurrentTheme, toggleTheme as switchTheme } from '../lib/theme';
import CurrencyUnitSearchCard from './CurrencyUnitSearchCard';
import SolveItLogo from './SolveItLogo';

interface HeaderProps {
  onOpenSearch?: () => void;
  onOpenHistory?: () => void;
  onOpenSaved?: () => void;
}

const CATEGORY_GROUPS = [
  {
    name: 'Finance & Banking',
    icon: TrendingUp,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10 border-emerald-500/20',
    href: '/finance',
    tools: [
      { name: 'Mortgage Calculator', href: '/finance/mortgage-calculator' },
      { name: 'EMI Loan Repayment', href: '/finance/emi-calculator' },
      { name: 'Compound Interest & SIP', href: '/finance/compound-interest-calculator' },
      { name: 'Income Tax Estimator', href: '/finance/taxes' },
      { name: 'Salary & Payroll', href: '/finance/salary' },
    ],
  },
  {
    name: 'Health & Physiology',
    icon: HeartPulse,
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/10 border-rose-500/20',
    href: '/health-fitness',
    tools: [
      { name: 'BMI & Body Composition', href: '/health-fitness/bmi-calculator' },
      { name: 'Running Pace & Splits', href: '/time-date/running-pace-calculator' },
      { name: '90-Min Ultradian Cycles', href: '/time-date/90-minute-ultradian-rhythm-planner' },
    ],
  },
  {
    name: 'Date, Time & Work',
    icon: Clock,
    color: 'text-sky-400',
    bgColor: 'bg-sky-500/10 border-sky-500/20',
    href: '/time-date',
    tools: [
      { name: 'Date Difference Counter', href: '/time-date/date-difference-calculator' },
      { name: 'Add/Subtract Time Tool', href: '/time-date/add-subtract-time-calculator' },
      { name: 'Work Hours & Timesheets', href: '/time-date/work-hours' },
      { name: 'Age Calculator', href: '/time-date/age-calculator' },
    ],
  },
  {
    name: 'Universal Conversions',
    icon: Repeat,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10 border-amber-500/20',
    href: '/conversions',
    tools: [
      { name: 'Length & Distance', href: '/conversions/length' },
      { name: 'Weight & Mass', href: '/conversions/mass' },
      { name: 'Temperature & Heat', href: '/conversions/temperature' },
      { name: 'Volume & Capacity', href: '/conversions/volume' },
    ],
  },
  {
    name: 'Engineering & Science',
    icon: Wrench,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10 border-purple-500/20',
    href: '/science',
    tools: [
      { name: 'Full Scientific Solver', href: '/math/scientific-calculator' },
      { name: 'Electrical Sizing', href: '/electrical' },
    ],
  },
  {
    name: 'Business & Academic',
    icon: GraduationCap,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10 border-blue-500/20',
    href: '/business',
    tools: [
      { name: 'Percentage Calculator', href: '/math/percentage-calculator' },
      { name: 'Standard Deviation', href: '/math/standard-deviation-calculator' },
      { name: 'Salary & Wage Breakdown', href: '/finance/salary' },
    ],
  },
];

export default function Header({
  onOpenSearch,
  onOpenHistory,
  onOpenSaved,
}: HeaderProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [savedCount, setSavedCount] = useState(0);
  const [isDark, setIsDark] = useState(true);
  const [showCurrencySearch, setShowCurrencySearch] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync theme state on mount & change
  useEffect(() => {
    setIsDark(getCurrentTheme() === 'dark');
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
      window.removeEventListener('solveit-theme-change', handleThemeChange);
      window.removeEventListener('storage', handleThemeChange);
    };
  }, []);

  const handleToggleTheme = () => {
    const next = switchTheme();
    setIsDark(next === 'dark');
  };

  // Sync bookmarks count
  useEffect(() => {
    const updateCount = () => {
      setSavedCount(getSavedTools().length);
    };
    updateCount();
    window.addEventListener('solveit-bookmarks-change', updateCount);
    window.addEventListener('storage', updateCount);
    return () => {
      window.removeEventListener('solveit-bookmarks-change', updateCount);
      window.removeEventListener('storage', updateCount);
    };
  }, []);

  // Close mega-menu dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCategoriesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 border-b ${
        scrolled
          ? 'bg-surface-container-lowest/95 backdrop-blur-md border-outline-variant/60 shadow-md shadow-black/10 dark:shadow-black/40'
          : 'bg-surface/95 backdrop-blur-sm border-outline-variant/40'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-24">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2 group">
            <div className="w-[52px] h-[52px] sm:w-[60px] sm:h-[60px] -mr-1 sm:-mr-1.5 flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shrink-0">
              <SolveItLogo className="w-[52px] h-[52px] sm:w-[60px] sm:h-[60px]" />
            </div>
            <div>
              <span className="font-bold text-2xl sm:text-3xl tracking-tight text-on-surface block leading-none">
                SolveIt<span className="text-primary">Calculator</span>
              </span>
            </div>
          </Link>

          {/* Center Navigation: Categories Dropdown & Primary Section Links */}
          <nav className="hidden lg:flex items-center gap-2 text-sm font-medium">
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${
                  categoriesOpen
                    ? 'text-primary bg-surface-container-high border border-outline-variant'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/60'
                }`}
              >
                <Layers className="w-4 h-4 text-primary" />
                <span>Categories</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    categoriesOpen ? 'rotate-180 text-primary' : 'text-on-surface-variant'
                  }`}
                />
              </button>

              {/* Mega-menu dropdown */}
              {categoriesOpen && (
                <div className="absolute top-full left-0 mt-2.5 w-[740px] -translate-x-12 p-6 bg-surface-container-lowest/98 backdrop-blur-xl border border-outline-variant/60 rounded-2xl shadow-2xl grid grid-cols-3 gap-6 animate-in fade-in-50 zoom-in-95 duration-150 z-50">
                  {CATEGORY_GROUPS.map((group) => {
                    const Icon = group.icon;
                    return (
                      <div key={group.name} className="space-y-2">
                        <Link
                          href={group.href}
                          onClick={() => setCategoriesOpen(false)}
                          className="flex items-center gap-2 font-semibold text-xs text-on-surface hover:text-primary transition-colors pb-1.5 border-b border-outline-variant/30"
                        >
                          <div className={`p-1.5 rounded-lg ${group.bgColor}`}>
                            <Icon className={`w-3.5 h-3.5 ${group.color}`} />
                          </div>
                          <span>{group.name}</span>
                        </Link>
                        <ul className="space-y-1">
                          {group.tools.map((t) => (
                            <li key={t.name}>
                              <Link
                                href={t.href}
                                onClick={() => setCategoriesOpen(false)}
                                className="text-xs text-on-surface-variant hover:text-primary hover:translate-x-0.5 transition-all block py-0.5"
                              >
                                {t.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                  <div className="col-span-3 pt-3 mt-1 border-t border-outline-variant/30 flex items-center justify-between text-xs text-on-surface-variant">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-primary" />
                      100% Free Client-Side Mathematical Engines
                    </span>
                    <Link
                      href="/"
                      onClick={() => setCategoriesOpen(false)}
                      className="inline-flex items-center gap-1.5 text-primary hover:underline font-medium"
                    >
                      <span>Explore all calculators &amp; converters</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/finance"
              className={`px-3.5 py-2 rounded-lg transition-colors ${
                pathname.startsWith('/finance')
                  ? 'text-primary font-semibold bg-surface-container-high'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/60'
              }`}
            >
              Finance
            </Link>
            <Link
              href="/health-fitness-calculators"
              className={`px-3.5 py-2 rounded-lg transition-colors ${
                pathname.startsWith('/health-fitness-calculators')
                  ? 'text-primary font-semibold bg-surface-container-high'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/60'
              }`}
            >
              Health
            </Link>
            <Link
              href="/conversions"
              className={`px-3.5 py-2 rounded-lg transition-colors ${
                pathname.startsWith('/conversions')
                  ? 'text-primary font-semibold bg-surface-container-high'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/60'
              }`}
            >
              Conversion
            </Link>
          </nav>

          {/* Right Action Icons & Mobile Hamburger */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Small Search Bar Icon Button */}
            <button
              type="button"
              onClick={onOpenSearch}
              className="p-2.5 rounded-xl bg-surface-container-high/60 hover:bg-surface-container-high text-on-surface-variant hover:text-primary border border-outline-variant/40 transition-all cursor-pointer shadow-xs flex items-center justify-center"
              title="Search all calculators (⌘K)"
              aria-label="Search calculators"
            >
              <Search className="w-4 h-4 text-primary" />
            </button>

            {/* Save Icon (Saved Tools modal trigger) */}
            <button
              type="button"
              onClick={onOpenSaved}
              className="relative p-2.5 rounded-xl bg-surface-container-high/60 hover:bg-surface-container-high text-on-surface-variant hover:text-primary border border-outline-variant/40 transition-all cursor-pointer shadow-xs flex items-center justify-center"
              title="Saved Calculators"
              aria-label="Saved Calculators"
            >
              <Bookmark className="w-4 h-4 text-blue-500" />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-on-primary text-[10px] font-bold flex items-center justify-center">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Live Rates (Currency & Unit Search Grounding Trigger) */}
            <button
              type="button"
              onClick={() => setShowCurrencySearch(!showCurrencySearch)}
              className={`p-2.5 sm:px-3 sm:py-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                showCurrencySearch
                  ? 'bg-primary text-white border-primary shadow-xs'
                  : 'bg-surface-container-high/60 hover:bg-surface-container-high text-on-surface-variant hover:text-emerald-500 border-outline-variant/40'
              }`}
              title="Live Rates (Real-time Google Grounding)"
              aria-label="Live Rates"
            >
              <span className="material-symbols-outlined text-[18px] text-emerald-500">currency_exchange</span>
              <span className="hidden xl:inline text-xs font-semibold">Live Rates</span>
            </button>

            {/* Light and Dark Mode Icon Toggle */}
            <button
              type="button"
              onClick={handleToggleTheme}
              className="p-2.5 rounded-xl bg-surface-container-high/60 hover:bg-surface-container-high text-amber-500 hover:text-amber-400 border border-outline-variant/40 transition-all cursor-pointer flex items-center justify-center shadow-xs"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400 transition-transform duration-200 hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 text-sky-500 transition-transform duration-200 -rotate-12" />
              )}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-surface-container-high/60 hover:bg-surface-container-high text-on-surface border border-outline-variant/40 transition-all cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Real-Time Currency & Unit Search Grounding Drawer */}
      {showCurrencySearch && (
        <div className="border-t border-outline-variant/40 bg-surface-container-lowest/98 backdrop-blur-xl p-4 sm:p-6 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-w-4xl mx-auto relative">
            <button
              type="button"
              onClick={() => setShowCurrencySearch(false)}
              className="absolute right-3 top-3 z-10 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Close currency search"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
            <CurrencyUnitSearchCard
              initialExpanded={true}
              onApplyPair={(pair) => {
                setShowCurrencySearch(false);
                window.location.href = `/conversion/${pair.fromUnitId.toLowerCase()}-to-${pair.toUnitId.toLowerCase()}`;
              }}
            />
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface-container-lowest border-b border-outline-variant/40 px-4 pt-4 pb-6 space-y-4">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setCategoriesOpen(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="p-3 rounded-xl bg-surface-container text-primary font-semibold hover:bg-surface-container-high border border-outline-variant/40 flex items-center justify-between"
            >
              <span>Categories</span>
              <Layers className="w-4 h-4 text-primary" />
            </button>
            <Link
              href="/finance"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-surface-container text-on-surface font-medium hover:bg-surface-container-high border border-outline-variant/40"
            >
              Finance
            </Link>
            <Link
              href="/health-fitness-calculators"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-surface-container text-on-surface font-medium hover:bg-surface-container-high border border-outline-variant/40"
            >
              Health
            </Link>
            <Link
              href="/conversions"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl bg-surface-container text-on-surface font-medium hover:bg-surface-container-high border border-outline-variant/40"
            >
              Conversion
            </Link>
          </div>

          <div className="pt-3 border-t border-outline-variant/30 flex items-center justify-between gap-2 text-xs">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSearch?.();
              }}
              className="flex-1 py-2.5 text-center text-primary font-semibold bg-surface-container hover:bg-surface-container-high rounded-xl flex items-center justify-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search Tools</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSaved?.();
              }}
              className="p-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-blue-500 border border-outline-variant/40 transition-all cursor-pointer flex items-center justify-center shrink-0"
              title="Saved Calculators"
            >
              <Bookmark className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleToggleTheme}
              className="p-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-amber-500 border border-outline-variant/40 transition-all cursor-pointer flex items-center justify-center shrink-0"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-500" />}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
