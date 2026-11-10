'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Calculator,
  Search,
  Menu,
  X,
  LayoutGrid,
  BookOpen,
  Users,
  Globe,
  Coins,
  ChevronDown,
  Moon,
  Sun,
  RefreshCw,
  ArrowLeftRight,
} from 'lucide-react';
import SearchModal from './SearchModal';
import { SUPPORTED_LANGUAGES, useLanguage } from '@/lib/i18n';
import {
  GLOBAL_CURRENCIES,
  formatExchangeRate,
  useCurrency,
  type GlobalCurrencyCode,
} from '@/lib/currency';

const STORAGE_KEY = 'solveit_a11y_prefs';

const MOBILE_QUICK_LINKS = [
  { name: 'All Calculators', href: '/calculators' },
  { name: 'Math', href: '/math' },
  { name: 'Finance', href: '/finance' },
  { name: 'Salary & Tax', href: '/salary-calculator' },
  { name: 'Workspace', href: '/calculation-workspace' },
  { name: 'Construction', href: '/construction-project-calculator' },
  { name: 'Recipe', href: '/recipe-converter' },
  { name: 'Guides', href: '/guides' },
];

const COMMUNITY_LINKS = [
  { name: 'Calculation Workspace (History & Totals)', href: '/calculation-workspace' },
  { name: 'Country Salary & Net Pay Calculator', href: '/salary-calculator' },
  { name: 'Construction Project Calculator', href: '/construction-project-calculator' },
  { name: 'Recipe Converter (Servings & Grams)', href: '/recipe-converter' },
  { name: 'How SolveItCalculator Works (About)', href: '/about' },
  { name: 'Calculation Methodology', href: '/calculation-methodology' },
  { name: 'Privacy & Accessibility', href: '/privacy-policy' },
  { name: 'Contact & Report an Error', href: '/contact' },
  { name: 'Math & Percentage Calculators', href: '/math' },
  { name: 'Finance & Tax Calculators', href: '/finance' },
  { name: 'Business & Margin Calculators', href: '/finance/business' },
  { name: 'Retirement & Super Calculators', href: '/retirement-and-super' },
  { name: 'Unit & Measurement Converters', href: '/conversions' },
  { name: 'Date & Time Calculators', href: '/date-time' },
  { name: 'Home & Construction Calculators', href: '/home-construction' },
  { name: 'Health & Fitness Calculators', href: '/health-fitness' },
  { name: 'Science & Lab Calculators', href: '/science' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { lang, currentLanguage, setLang } = useLanguage();
  const {
    currency,
    symbol: currencySymbol,
    rates: currencyRates,
    isLiveRates,
    isLoadingRates,
    lastUpdatedUtc,
    setCurrency,
    refreshLiveRates,
    convertBetween,
  } = useCurrency();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [currencyMenuOpen, setCurrencyMenuOpen] = useState(false);
  const [quickConvertAmt, setQuickConvertAmt] = useState<number>(1000);
  const [quickFromCode, setQuickFromCode] = useState<GlobalCurrencyCode>('USD');
  const [communityMenuOpen, setCommunityMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const currRef = useRef<HTMLDivElement>(null);
  const commRef = useRef<HTMLDivElement>(null);

  // Apply theme to <html> element
  const applyDocumentTheme = (
    dark: boolean,
    textSize?: string,
    reduceMotion?: boolean
  ) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.classList.toggle('dark', dark);
    root.classList.toggle('light', !dark);
    root.setAttribute('data-theme', dark ? 'dark' : 'light');
    if (textSize) {
      root.setAttribute('data-a11y-text-size', textSize);
    }
    if (typeof reduceMotion === 'boolean') {
      root.setAttribute(
        'data-a11y-reduce-motion',
        reduceMotion ? 'true' : 'false'
      );
    }
  };

  // Load saved theme & accessibility preferences on mount and listen for sync events
  useEffect(() => {
    const syncFromStorage = () => {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          const dark = parsed.displayMode === 'dark';
          setIsDark(dark);
          applyDocumentTheme(
            dark,
            parsed.textSize || 'medium',
            Boolean(parsed.reduceMotion)
          );
          return;
        }
      } catch {
        // Ignore storage read errors
      }
      const currentlyDark = document.documentElement.classList.contains('dark');
      setIsDark(currentlyDark);
    };

    syncFromStorage();

    const handleThemeEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ isDark?: boolean }>;
      if (
        customEvent.detail &&
        typeof customEvent.detail.isDark === 'boolean'
      ) {
        setIsDark(customEvent.detail.isDark);
        applyDocumentTheme(customEvent.detail.isDark);
      } else {
        syncFromStorage();
      }
    };

    window.addEventListener('solveit-theme-change', handleThemeEvent);
    window.addEventListener('storage', syncFromStorage);
    return () => {
      window.removeEventListener('solveit-theme-change', handleThemeEvent);
      window.removeEventListener('storage', syncFromStorage);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false);
      }
      if (currRef.current && !currRef.current.contains(e.target as Node)) {
        setCurrencyMenuOpen(false);
      }
      if (commRef.current && !commRef.current.contains(e.target as Node)) {
        setCommunityMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = (nextDark: boolean) => {
    setIsDark(nextDark);
    applyDocumentTheme(nextDark);

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const existing = raw ? JSON.parse(raw) : {};
      const updated = {
        textSize: existing.textSize || 'medium',
        reduceMotion: Boolean(existing.reduceMotion),
        displayMode: nextDark ? 'dark' : 'default',
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore storage write errors
    }

    window.dispatchEvent(
      new CustomEvent('solveit-theme-change', {
        detail: { isDark: nextDark },
      })
    );
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white border-b border-[#E2E8F0] shadow-2xs">
        <div className="max-w-[1360px] mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2 sm:gap-4 h-14 sm:h-16">
            {/* Left: SolveItCalculator Wordmark (responsive sizing so it never overflows mobile viewports) */}
            <Link
              href="/"
              className="flex items-center gap-2 sm:gap-2.5 whitespace-nowrap shrink-0 min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] rounded-lg"
            >
              <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#2457D6] flex items-center justify-center text-white shadow-xs shrink-0">
                <Calculator className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
              </span>
              <span
                data-no-translate="true"
                className="text-[17px] sm:text-[22px] font-extrabold tracking-tight text-[#152238]"
              >
                SolveIt<span className="text-[#2457D6]">Calculator</span>
              </span>
            </Link>

            {/* Desktop Primary Navigation (lg and up) */}
            <nav
              aria-label="Primary navigation"
              className="hidden lg:flex items-center gap-5 xl:gap-7 text-sm font-semibold text-[#152238] h-full"
            >
              <Link
                href="/calculators"
                className={`relative inline-flex items-center gap-2 h-full whitespace-nowrap shrink-0 transition-colors hover:text-[#2457D6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] rounded-md ${
                  pathname === '/calculators' || pathname === '/all-calculators'
                    ? 'text-[#2457D6] font-bold'
                    : ''
                }`}
              >
                <LayoutGrid className="w-4 h-4" aria-hidden="true" />
                <span>All Calculators</span>
                {(pathname === '/calculators' ||
                  pathname === '/all-calculators') && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2457D6] rounded-full"
                  />
                )}
              </Link>

              <Link
                href="/math"
                className={`inline-flex items-center gap-1.5 py-1.5 whitespace-nowrap shrink-0 transition-colors hover:text-[#2457D6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] rounded-md ${
                  pathname?.startsWith('/math') ? 'text-[#2457D6] font-bold' : ''
                }`}
              >
                <span>Math</span>
              </Link>

              <Link
                href="/finance"
                className={`inline-flex items-center gap-1.5 py-1.5 whitespace-nowrap shrink-0 transition-colors hover:text-[#2457D6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] rounded-md ${
                  pathname?.startsWith('/finance') ? 'text-[#2457D6] font-bold' : ''
                }`}
              >
                <span>Finance</span>
              </Link>

              <Link
                href="/search"
                className={`inline-flex items-center gap-1.5 py-1.5 whitespace-nowrap shrink-0 transition-colors hover:text-[#2457D6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] rounded-md ${
                  pathname?.startsWith('/search') ? 'text-[#2457D6] font-bold' : ''
                }`}
              >
                <Search className="w-4 h-4" aria-hidden="true" />
                <span>Search</span>
              </Link>

              <Link
                href="/guides"
                className={`relative inline-flex items-center gap-2 h-full whitespace-nowrap shrink-0 transition-colors hover:text-[#2457D6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] rounded-md ${
                  pathname?.startsWith('/guides') ||
                  pathname?.startsWith('/math-guides')
                    ? 'text-[#2457D6] font-bold'
                    : ''
                }`}
              >
                <BookOpen className="w-4 h-4" aria-hidden="true" />
                <span>Guides</span>
                {(pathname?.startsWith('/guides') ||
                  pathname?.startsWith('/math-guides')) && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2457D6] rounded-full"
                  />
                )}
              </Link>

              <div className="relative" ref={commRef}>
                <button
                  type="button"
                  data-compact="true"
                  onClick={() => setCommunityMenuOpen(!communityMenuOpen)}
                  aria-expanded={communityMenuOpen}
                  className="compact-control inline-flex items-center gap-1.5 py-1.5 whitespace-nowrap shrink-0 transition-colors hover:text-[#2457D6] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] rounded-md"
                >
                  <Users className="w-4 h-4" aria-hidden="true" />
                  <span>For Communities</span>
                  <ChevronDown
                    className="w-3.5 h-3.5 text-[#475569]"
                    aria-hidden="true"
                  />
                </button>

                {communityMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white border border-[#E2E8F0] shadow-lg py-2 z-50">
                    {COMMUNITY_LINKS.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setCommunityMenuOpen(false)}
                        className="block px-4 py-2 text-sm font-medium text-[#152238] hover:bg-[#F5F7FA] hover:text-[#2457D6]"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </nav>

            {/* Right: Currency Switcher + Language Selector + Compact Theme Toggle + Search Button + Mobile Menu Button */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Global Finance Currency Switcher (USD, EUR, GBP, INR) */}
              <div
                className="relative"
                ref={currRef}
                data-no-translate="true"
              >
                <button
                  type="button"
                  data-compact="true"
                  onClick={() => setCurrencyMenuOpen(!currencyMenuOpen)}
                  aria-expanded={currencyMenuOpen}
                  aria-label="Select display currency (USD, EUR, GBP, INR)"
                  title={`Active Currency: ${currency} (${currencySymbol}) — Live Rate: 1 USD = ${currencySymbol}${formatExchangeRate(currency, currencyRates[currency] ?? 1.0)}`}
                  className="compact-control inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#EEF3FF] hover:bg-[#DCE7FF] text-xs sm:text-sm font-extrabold text-[#2457D6] border border-[#BFDBFE] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6]"
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isLiveRates ? 'bg-emerald-500' : 'bg-blue-500'
                    }`}
                    aria-hidden="true"
                  />
                  <Coins className="w-3.5 h-3.5 text-[#2457D6]" aria-hidden="true" />
                  <span>{currency}</span>
                  <span className="font-mono text-[11px] bg-white px-1 rounded text-[#152238]">
                    {currencySymbol}
                  </span>
                  <ChevronDown
                    className="w-3 h-3 text-[#2457D6]"
                    aria-hidden="true"
                  />
                </button>

                {currencyMenuOpen && (
                  <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-[#E2E8F0] shadow-xl py-2.5 z-50">
                    <div className="px-3.5 pb-2 mb-1 border-b border-[#F1F5F9] flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isLiveRates
                              ? 'bg-emerald-500 animate-pulse'
                              : 'bg-blue-500'
                          }`}
                        />
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#152238]">
                          Live FX Rates &amp; Currency Changer
                        </span>
                      </div>
                      <button
                        type="button"
                        data-compact="true"
                        onClick={() => refreshLiveRates()}
                        disabled={isLoadingRates}
                        title={
                          lastUpdatedUtc
                            ? `Updated: ${lastUpdatedUtc}`
                            : 'Refresh live FX rates'
                        }
                        className="compact-control inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] text-[10px] font-bold hover:bg-[#D1FAE5] cursor-pointer"
                      >
                        <RefreshCw
                          className={`w-2.5 h-2.5 ${
                            isLoadingRates ? 'animate-spin' : ''
                          }`}
                        />
                        <span>{isLoadingRates ? 'Syncing' : 'Live Sync'}</span>
                      </button>
                    </div>

                    {GLOBAL_CURRENCIES.map((c) => {
                      const rateVal = currencyRates[c.code] ?? 1.0;
                      const isSelected = currency === c.code;
                      return (
                        <button
                          key={c.code}
                          type="button"
                          data-compact="true"
                          onClick={() => {
                            setCurrency(c.code);
                            setCurrencyMenuOpen(false);
                          }}
                          className={`compact-control w-full text-left px-3.5 py-2 text-xs font-medium cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'bg-[#EEF3FF] text-[#2457D6] font-bold'
                              : 'text-[#152238] hover:bg-[#F5F7FA]'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span>{c.flag}</span>
                            <span>
                              {c.code} ({c.symbol})
                            </span>
                          </span>
                          <span className="text-[11px] font-mono text-[#475569]">
                            1 USD = {c.symbol}
                            {formatExchangeRate(c.code, rateVal)}
                          </span>
                        </button>
                      );
                    })}

                    {/* Inline Quick Live Currency Changer */}
                    <div className="mt-2 pt-2.5 px-3.5 border-t border-[#F1F5F9] space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider text-[#64748B]">
                        <span className="inline-flex items-center gap-1">
                          <ArrowLeftRight className="w-3 h-3 text-[#2457D6]" />
                          Quick Live Currency Changer
                        </span>
                        {lastUpdatedUtc && (
                          <span className="font-mono text-[9px] text-emerald-700">
                            Live Mid-Market
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min={0}
                          step="any"
                          aria-label="Quick currency converter amount"
                          value={quickConvertAmt}
                          onChange={(e) =>
                            setQuickConvertAmt(
                              Math.max(0, Number(e.target.value))
                            )
                          }
                          className="w-full px-2.5 py-1.5 rounded-lg border border-[#CBD5E1] text-xs font-mono font-bold text-[#152238]"
                        />
                        <select
                          aria-label="Quick currency converter source"
                          value={quickFromCode}
                          onChange={(e) =>
                            setQuickFromCode(
                              e.target.value as GlobalCurrencyCode
                            )
                          }
                          className="px-2 py-1.5 rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] text-xs font-bold text-[#152238]"
                        >
                          {GLOBAL_CURRENCIES.map((c) => (
                            <option key={c.code} value={c.code}>
                              {c.code}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                        {GLOBAL_CURRENCIES.map((c) => {
                          const val = convertBetween(
                            quickConvertAmt,
                            quickFromCode,
                            c.code
                          );
                          return (
                            <button
                              key={c.code}
                              type="button"
                              data-compact="true"
                              onClick={() => {
                                setCurrency(c.code);
                                setCurrencyMenuOpen(false);
                              }}
                              className={`compact-control px-2 py-1.5 rounded-lg border text-left text-[11px] cursor-pointer ${
                                currency === c.code
                                  ? 'bg-[#2457D6] text-white border-[#2457D6] font-bold'
                                  : 'bg-[#F8FAFC] text-[#152238] border-[#E2E8F0] hover:border-[#2457D6]'
                              }`}
                            >
                              <div className="text-[9px] opacity-80">
                                {c.flag} {c.code}
                              </div>
                              <div className="font-mono font-bold truncate">
                                {c.symbol}
                                {val.toLocaleString(
                                  c.code === 'INR' ? 'en-IN' : 'en-US',
                                  {
                                    maximumFractionDigits: val < 100 ? 2 : 0,
                                  }
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Language Selector */}
              <div
                className="relative"
                ref={langRef}
                data-no-translate="true"
              >
                <button
                  type="button"
                  data-compact="true"
                  onClick={() => setLangMenuOpen(!langMenuOpen)}
                  aria-expanded={langMenuOpen}
                  aria-label="Select language"
                  className="compact-control inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-[#152238] hover:bg-[#F5F7FA] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6]"
                >
                  <Globe className="w-4 h-4 text-[#2457D6]" aria-hidden="true" />
                  <span>{currentLanguage.label}</span>
                  <ChevronDown
                    className="w-3.5 h-3.5 text-[#475569]"
                    aria-hidden="true"
                  />
                </button>

                {langMenuOpen && (
                  <div className="absolute right-0 mt-2 w-40 rounded-xl bg-white border border-[#E2E8F0] shadow-lg py-1.5 z-50">
                    {SUPPORTED_LANGUAGES.map((l) => (
                      <button
                        key={l.code}
                        type="button"
                        data-compact="true"
                        onClick={() => {
                          setLang(l.code);
                          setLangMenuOpen(false);
                        }}
                        className={`compact-control w-full text-left px-3.5 py-1.5 text-sm font-medium cursor-pointer flex items-center justify-between ${
                          lang === l.code
                            ? 'bg-[#EEF3FF] text-[#2457D6] font-bold'
                            : 'text-[#152238] hover:bg-[#F5F7FA]'
                        }`}
                      >
                        <span>{l.label}</span>
                        <span className="text-[11px] uppercase text-[#64748B]">
                          {l.code}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Compact Theme Switcher Pill (Moon / Sun) */}
              <div
                role="group"
                aria-label="Toggle Dark or Light theme"
                className="inline-flex items-center h-7 p-0.5 rounded-full bg-[#0A58ED] border border-[#0A58ED] shadow-2xs shrink-0"
              >
                <button
                  type="button"
                  data-compact="true"
                  onClick={() => toggleTheme(isDark ? false : true)}
                  aria-pressed={isDark}
                  aria-label="Switch to Dark theme"
                  title={isDark ? 'Dark mode active (click for Light mode)' : 'Switch to Dark mode'}
                  className={`compact-control w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                    isDark
                      ? 'bg-white text-[#0A58ED] shadow-2xs'
                      : 'bg-white/95 text-[#152238] hover:bg-white'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  data-compact="true"
                  onClick={() => toggleTheme(!isDark ? true : false)}
                  aria-pressed={!isDark}
                  aria-label="Switch to Light theme"
                  title={!isDark ? 'Light mode active (click for Dark mode)' : 'Switch to Light mode'}
                  className={`compact-control w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                    !isDark
                      ? 'bg-[#0A58ED] text-white'
                      : 'text-white/85 hover:text-white'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>

              {/* Quick Search Modal Button */}
              <button
                type="button"
                data-compact="true"
                onClick={() => setSearchOpen(true)}
                aria-label="Quick search calculators (Ctrl+K)"
                title="Quick search calculators (Ctrl+K)"
                className="compact-control w-8 h-8 rounded-full bg-[#EEF3FF] hover:bg-[#DCE7FF] text-[#152238] flex items-center justify-center transition-colors cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6]"
              >
                <Search className="w-4 h-4" aria-hidden="true" />
              </button>

              {/* Mobile & Tablet Menu Toggle Button (< lg) */}
              <button
                type="button"
                data-compact="true"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="compact-control lg:hidden inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#EEF3FF] hover:bg-[#DCE7FF] text-[#152238] border border-[#CBD5E1] text-xs font-extrabold transition-colors cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6]"
                aria-expanded={mobileMenuOpen}
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? (
                  <>
                    <X className="w-4 h-4 text-[#2457D6]" aria-hidden="true" />
                    <span>Close</span>
                  </>
                ) : (
                  <>
                    <Menu className="w-4 h-4 text-[#2457D6]" aria-hidden="true" />
                    <span>Menu</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Always-Visible Mobile & Tablet Quick Navigation Bar (< lg) */}
        <div className="lg:hidden border-t border-[#E2E8F0] bg-[#F8FAFC]">
          <nav
            aria-label="Mobile quick navigation"
            className="max-w-[1360px] mx-auto px-3 sm:px-6 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar"
          >
            {MOBILE_QUICK_LINKS.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== '/' && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shrink-0 transition-colors ${
                    isActive
                      ? 'bg-[#2457D6] text-white shadow-2xs'
                      : 'bg-white text-[#152238] border border-[#E2E8F0] hover:border-[#2457D6] hover:text-[#2457D6]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Expandable Full Mobile & Tablet Navigation Drawer (< lg) */}
        {mobileMenuOpen && (
          <nav
            aria-label="Mobile navigation drawer"
            className="lg:hidden border-t border-[#E2E8F0] bg-white px-4 py-4 space-y-4 max-h-[calc(100vh-7rem)] overflow-y-auto shadow-lg"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              <Link
                href="/calculators"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold text-[#152238] bg-[#F8FAFC] hover:bg-[#EEF3FF] hover:text-[#2457D6]"
              >
                <LayoutGrid className="w-4 h-4 text-[#2457D6]" aria-hidden="true" />
                <span>All Calculators</span>
              </Link>
              <Link
                href="/search"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold text-[#152238] bg-[#F8FAFC] hover:bg-[#EEF3FF] hover:text-[#2457D6]"
              >
                <Search className="w-4 h-4 text-[#2457D6]" aria-hidden="true" />
                <span>Search Calculators</span>
              </Link>
              <Link
                href="/guides"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold text-[#2457D6] bg-[#EEF3FF] hover:bg-[#DCE7FF]"
              >
                <BookOpen className="w-4 h-4 text-[#2457D6]" aria-hidden="true" />
                <span>Guides &amp; Formulas</span>
              </Link>
              <Link
                href="/calculation-workspace"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold text-[#152238] bg-[#F8FAFC] hover:bg-[#EEF3FF] hover:text-[#2457D6]"
              >
                <Calculator className="w-4 h-4 text-[#2457D6]" aria-hidden="true" />
                <span>Calculation Workspace</span>
              </Link>
            </div>

            <div className="pt-2 border-t border-[#E2E8F0]">
              <div className="px-2 pb-2 text-xs font-extrabold uppercase tracking-wider text-[#64748B]">
                Calculator Categories &amp; Tools
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                {COMMUNITY_LINKS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-semibold text-[#152238] hover:bg-[#F5F7FA] hover:text-[#2457D6]"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile Global Currency Selector */}
            <div className="pt-3 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-2 px-2">
              <span className="text-xs font-bold text-[#64748B] flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5" aria-hidden="true" />
                Currency:
              </span>
              <div
                className="flex flex-wrap items-center gap-1.5"
                data-no-translate="true"
              >
                {GLOBAL_CURRENCIES.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    data-compact="true"
                    onClick={() => setCurrency(c.code)}
                    className={`compact-control px-2.5 py-1 rounded-md text-xs font-bold cursor-pointer ${
                      currency === c.code
                        ? 'bg-[#2457D6] text-white'
                        : 'bg-[#F8FAFC] text-[#152238] border border-[#E2E8F0]'
                    }`}
                  >
                    {c.flag} {c.code} ({c.symbol})
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Language Selector */}
            <div className="pt-3 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-2 px-2">
              <span className="text-xs font-bold text-[#64748B] flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" aria-hidden="true" />
                Language:
              </span>
              <div
                className="flex flex-wrap items-center gap-1.5"
                data-no-translate="true"
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    data-compact="true"
                    onClick={() => setLang(l.code)}
                    className={`compact-control px-2.5 py-1 rounded-md text-xs font-bold cursor-pointer ${
                      lang === l.code
                        ? 'bg-[#2457D6] text-white'
                        : 'bg-[#F8FAFC] text-[#152238] border border-[#E2E8F0]'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
          </nav>
        )}
      </header>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
