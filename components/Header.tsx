'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search,
  Bookmark,
  ChevronDown,
  ChevronRight,
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
  ShieldCheck,
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
    color: 'text-emerald-500 dark:text-emerald-400',
    bgColor: 'bg-emerald-500/10 border-emerald-500/20',
    href: '/finance',
    tools: [
      { name: 'Appreciation Calculator', href: '/appreciation-calculator' },
      { name: 'Mortgage & Amortization', href: '/finance/mortgage-calculator' },
      { name: 'EMI Loan Repayment', href: '/finance/emi-calculator' },
      { name: 'Compound Interest & SIP', href: '/finance/compound-interest-calculator' },
      { name: 'Income Tax Estimator', href: '/finance/taxes' },
      { name: 'Salary & Payroll', href: '/finance/salary' },
    ],
  },
  {
    name: 'Universal Conversions',
    icon: Repeat,
    color: 'text-amber-500 dark:text-amber-400',
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
    name: 'Health & Physiology',
    icon: HeartPulse,
    color: 'text-rose-500 dark:text-rose-400',
    bgColor: 'bg-rose-500/10 border-rose-500/20',
    href: '/health-fitness-calculators',
    tools: [
      { name: 'BMI & Body Composition', href: '/health-fitness/bmi-calculator' },
      { name: 'Running Pace & Splits', href: '/time-date/running-pace-calculator' },
      { name: '90-Min Ultradian Cycles', href: '/time-date/90-minute-ultradian-rhythm-planner' },
    ],
  },
  {
    name: 'Date, Time & Work',
    icon: Clock,
    color: 'text-sky-500 dark:text-sky-400',
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
    name: 'Engineering & Science',
    icon: Wrench,
    color: 'text-purple-500 dark:text-purple-400',
    bgColor: 'bg-purple-500/10 border-purple-500/20',
    href: '/science',
    tools: [
      { name: 'Scientific Solver', href: '/math/scientific-calculator' },
      { name: 'Electrical Sizing', href: '/electrical' },
    ],
  },
  {
    name: 'Business & Academic',
    icon: GraduationCap,
    color: 'text-blue-500 dark:text-blue-400',
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
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>(null);
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

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setShowCurrencySearch(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 border-b ${
        scrolled
          ? 'bg-surface-container-lowest/95 backdrop-blur-md border-outline-variant/60 shadow-md shadow-black/10 dark:shadow-black/40'
          : 'bg-surface/95 backdrop-blur-sm border-outline-variant/40'
      }`}
    >
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-18 lg:h-20 gap-1.5 sm:gap-2">
          {/* Logo & Brand Identity */}
          <Link
            href="/"
            className="flex items-center gap-1.5 sm:gap-2.5 group shrink-0 min-w-0"
            aria-label="SolveIt Calculator Homepage"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-11 lg:h-11 flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shrink-0">
              <SolveItLogo className="w-8 h-8 sm:w-10 sm:h-10 lg:w-11 lg:h-11" />
            </div>
            <div className="flex items-baseline">
              <span className="font-extrabold text-[15px] sm:text-xl lg:text-2xl tracking-tight text-on-surface leading-none whitespace-nowrap">
                SolveIt<span className="text-primary font-bold ml-0.5">Calculator</span>
              </span>
            </div>
          </Link>

          {/* Desktop Center Navigation: Categories Mega-Menu & Primary Cluster Links */}
          <nav className="hidden lg:flex items-center gap-1.5 text-sm font-medium">
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${
                  categoriesOpen
                    ? 'text-primary bg-surface-container-high border border-outline-variant'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/60'
                }`}
                aria-expanded={categoriesOpen}
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
                <div className="absolute top-full left-0 mt-2.5 w-[760px] -translate-x-12 p-6 bg-surface-container-lowest/98 backdrop-blur-xl border border-outline-variant/60 rounded-2xl shadow-2xl grid grid-cols-3 gap-6 animate-in fade-in-50 zoom-in-95 duration-150 z-50">
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
              className={`px-3 py-2 rounded-lg transition-colors ${
                pathname.startsWith('/finance') || pathname === '/appreciation-calculator'
                  ? 'text-primary font-semibold bg-surface-container-high'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/60'
              }`}
            >
              Finance
            </Link>
            <Link
              href="/conversions"
              className={`px-3 py-2 rounded-lg transition-colors ${
                pathname.startsWith('/conversions')
                  ? 'text-primary font-semibold bg-surface-container-high'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/60'
              }`}
            >
              Conversion
            </Link>
            <Link
              href="/health-fitness-calculators"
              className={`px-3 py-2 rounded-lg transition-colors ${
                pathname.startsWith('/health-fitness-calculators')
                  ? 'text-primary font-semibold bg-surface-container-high'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/60'
              }`}
            >
              Health
            </Link>
            <Link
              href="/time-date"
              className={`px-3 py-2 rounded-lg transition-colors ${
                pathname.startsWith('/time-date')
                  ? 'text-primary font-semibold bg-surface-container-high'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/60'
              }`}
            >
              Time &amp; Date
            </Link>
          </nav>

          {/* Right Action Bar (Responsive) */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Search Trigger Button */}
            <button
              type="button"
              onClick={onOpenSearch}
              className="w-9 h-9 sm:w-auto sm:min-w-[44px] sm:min-h-[44px] p-2 sm:px-3 sm:py-2 rounded-xl bg-surface-container-high/60 hover:bg-surface-container-high text-on-surface-variant hover:text-primary border border-outline-variant/40 transition-all cursor-pointer shadow-xs flex items-center justify-center gap-2 shrink-0"
              title="Search calculators (⌘K)"
              aria-label="Search calculators"
            >
              <Search className="w-4 h-4 text-primary shrink-0" />
              <span className="hidden md:inline text-xs font-medium text-slate-400">Search</span>
              <kbd className="hidden md:inline-flex items-center text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface border border-outline-variant/40 text-slate-400">
                ⌘K
              </kbd>
            </button>

            {/* Saved Tools Trigger (Desktop & Tablet) */}
            <button
              type="button"
              onClick={onOpenSaved}
              className="hidden sm:flex relative min-w-[44px] min-h-[44px] p-2.5 rounded-xl bg-surface-container-high/60 hover:bg-surface-container-high text-on-surface-variant hover:text-primary border border-outline-variant/40 transition-all cursor-pointer shadow-xs items-center justify-center"
              title="Saved Calculators"
              aria-label="Saved Calculators"
            >
              <Bookmark className="w-4 h-4 text-blue-500" />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-on-primary text-[10px] font-bold flex items-center justify-center">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Live Rates Trigger (Desktop & Tablet) */}
            <button
              type="button"
              onClick={() => setShowCurrencySearch(!showCurrencySearch)}
              className={`hidden md:flex min-h-[44px] px-3 py-2 rounded-xl border transition-all cursor-pointer items-center gap-1.5 ${
                showCurrencySearch
                  ? 'bg-primary text-white border-primary shadow-xs'
                  : 'bg-surface-container-high/60 hover:bg-surface-container-high text-on-surface-variant hover:text-emerald-500 border-outline-variant/40'
              }`}
              title="Live Rates (Real-time Google Grounding)"
              aria-label="Live Rates"
            >
              <span className="material-symbols-outlined text-[18px] text-emerald-500">currency_exchange</span>
              <span className="text-xs font-semibold">Live Rates</span>
            </button>

            {/* Light / Dark Mode Toggle Button */}
            <button
              type="button"
              onClick={handleToggleTheme}
              className="w-9 h-9 sm:w-auto sm:min-w-[44px] sm:min-h-[44px] p-2 rounded-xl bg-surface-container-high/60 hover:bg-surface-container-high text-amber-500 hover:text-amber-400 border border-outline-variant/40 transition-all cursor-pointer flex items-center justify-center shadow-xs shrink-0"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400 transition-transform duration-200 hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 text-sky-500 transition-transform duration-200 -rotate-12" />
              )}
            </button>

            {/* Mobile Hamburger / Close Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-9 h-9 sm:w-auto sm:min-w-[44px] sm:min-h-[44px] p-2 rounded-xl bg-surface-container-high/60 hover:bg-surface-container-high text-on-surface border border-outline-variant/40 transition-all cursor-pointer flex items-center justify-center shrink-0"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-primary" /> : <Menu className="w-5 h-5" />}
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
              className="absolute right-3 top-3 z-10 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
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

      {/* Mobile Menu Drawer (Responsive, Accessible, High Contrast) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface-container-lowest/98 backdrop-blur-xl border-b border-outline-variant/50 shadow-2xl max-h-[calc(100vh-4rem)] overflow-y-auto px-4 pt-3 pb-8 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Quick Search Bar Shortcut inside Mobile Menu */}
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenSearch?.();
            }}
            className="w-full min-h-[46px] px-3.5 py-2.5 rounded-xl bg-surface-container border border-outline-variant/50 text-left flex items-center justify-between text-on-surface-variant hover:text-primary transition-colors cursor-pointer shadow-xs"
          >
            <span className="flex items-center gap-2.5 text-sm font-medium">
              <Search className="w-4 h-4 text-primary" />
              <span>Search 100+ calculators...</span>
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-surface text-primary font-semibold">
              Find Tool
            </span>
          </button>

          {/* Quick Utility Actions Row on Mobile */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {/* Saved Calculators */}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSaved?.();
              }}
              className="min-h-[44px] p-2.5 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high border border-outline-variant/40 flex items-center justify-between transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-1.5 font-medium">
                <Bookmark className="w-4 h-4 text-blue-500" />
                <span>Saved Tools</span>
              </span>
              <span className="px-1.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 font-bold text-[11px]">
                {savedCount}
              </span>
            </button>

            {/* Live Market Rates */}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setShowCurrencySearch(true);
              }}
              className="min-h-[44px] p-2.5 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high border border-outline-variant/40 flex items-center justify-between transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-1.5 font-medium">
                <span className="material-symbols-outlined text-base text-emerald-500">currency_exchange</span>
                <span>Live Rates</span>
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </button>
          </div>

          {/* Primary Category Hub Navigation Grid */}
          <div className="space-y-1.5 pt-1">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1">
              Popular Categories
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Link
                href="/finance"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/40 text-on-surface font-semibold flex items-center gap-2.5 transition-colors"
              >
                <div className="p-1 rounded-md bg-emerald-500/10 text-emerald-500">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <span>Finance</span>
              </Link>

              <Link
                href="/conversions"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/40 text-on-surface font-semibold flex items-center gap-2.5 transition-colors"
              >
                <div className="p-1 rounded-md bg-amber-500/10 text-amber-500">
                  <Repeat className="w-4 h-4" />
                </div>
                <span>Conversions</span>
              </Link>

              <Link
                href="/health-fitness-calculators"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/40 text-on-surface font-semibold flex items-center gap-2.5 transition-colors"
              >
                <div className="p-1 rounded-md bg-rose-500/10 text-rose-500">
                  <HeartPulse className="w-4 h-4" />
                </div>
                <span>Health</span>
              </Link>

              <Link
                href="/time-date"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/40 text-on-surface font-semibold flex items-center gap-2.5 transition-colors"
              >
                <div className="p-1 rounded-md bg-sky-500/10 text-sky-500">
                  <Clock className="w-4 h-4" />
                </div>
                <span>Time &amp; Date</span>
              </Link>

              <Link
                href="/science"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/40 text-on-surface font-semibold flex items-center gap-2.5 transition-colors"
              >
                <div className="p-1 rounded-md bg-purple-500/10 text-purple-500">
                  <Wrench className="w-4 h-4" />
                </div>
                <span>Science</span>
              </Link>

              <Link
                href="/business"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/40 text-on-surface font-semibold flex items-center gap-2.5 transition-colors"
              >
                <div className="p-1 rounded-md bg-blue-500/10 text-blue-500">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <span>Business</span>
              </Link>
            </div>
          </div>

          {/* Expandable Category Accordions with Tools (Solves Mobile Dropdown Access) */}
          <div className="pt-2 border-t border-outline-variant/40 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1">
              Browse Tools by Group
            </div>

            <div className="space-y-1.5">
              {CATEGORY_GROUPS.map((group) => {
                const Icon = group.icon;
                const isExpanded = expandedMobileCategory === group.name;

                return (
                  <div
                    key={group.name}
                    className="rounded-xl border border-outline-variant/40 bg-surface-container overflow-hidden transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedMobileCategory(isExpanded ? null : group.name)}
                      className="w-full min-h-[44px] px-3.5 py-2.5 flex items-center justify-between text-left text-sm font-semibold text-on-surface hover:text-primary transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2.5">
                        <div className={`p-1 rounded-md ${group.bgColor}`}>
                          <Icon className={`w-3.5 h-3.5 ${group.color}`} />
                        </div>
                        <span>{group.name}</span>
                      </span>
                      <ChevronRight
                        className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                          isExpanded ? 'rotate-90 text-primary' : ''
                        }`}
                      />
                    </button>

                    {isExpanded && (
                      <div className="px-3 pb-3 pt-1 border-t border-outline-variant/30 space-y-1 bg-surface-container-low">
                        {group.tools.map((t) => (
                          <Link
                            key={t.name}
                            href={t.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block py-2 px-3 text-sm font-medium text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg transition-colors"
                          >
                            {t.name}
                          </Link>
                        ))}
                        <Link
                          href={group.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="inline-flex items-center gap-1.5 pt-2 px-3 text-sm font-bold text-primary hover:underline"
                        >
                          <span>View all {group.name} calculators</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile Footer Trust Statement */}
          <div className="pt-3 border-t border-outline-variant/30 flex items-center justify-between text-xs text-on-surface-variant px-1">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              Private In-Browser Calculations
            </span>
            <button
              type="button"
              onClick={handleToggleTheme}
              className="text-primary font-semibold hover:underline cursor-pointer"
            >
              {isDark ? 'Switch to Light' : 'Switch to Dark'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
