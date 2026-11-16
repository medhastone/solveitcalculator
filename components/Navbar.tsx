'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search,
  Menu,
  X,
  Globe,
  Coins,
  ChevronDown,
  RefreshCw,
  ArrowLeftRight,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import BrandLogo from './BrandLogo';
import ThemeSwitcher from './ThemeSwitcher';

const SearchModal = dynamic(() => import('./SearchModal'), {
  ssr: false,
});
import { SUPPORTED_LANGUAGES, useLanguage } from '@/lib/i18n';
import {
  GLOBAL_CURRENCIES,
  formatExchangeRate,
  useCurrency,
  type GlobalCurrencyCode,
} from '@/lib/currency';

const STORAGE_KEY = 'solveit_a11y_prefs';

const PRIMARY_NAV_LINKS = [
  { name: 'All Calculators', href: '/calculators', exact: true },
  { name: 'Finance', href: '/finance', exact: false },
  { name: 'Math', href: '/math', exact: false },
  { name: 'Conversions', href: '/conversions', exact: false },
  { name: 'Health', href: '/health-fitness', exact: false },
];

const MORE_MENU_LINKS = [
  { name: 'Date & Time', href: '/date-time' },
  { name: 'Home & Construction', href: '/home-construction' },
  { name: 'Science', href: '/science' },
  { name: 'Guides', href: '/guides' },
];

const TRUST_MENU_LINKS = [
  { name: 'Methodology', href: '/calculation-methodology' },
  { name: 'About', href: '/about' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { lang, currentLanguage, setLang } = useLanguage();
  const {
    currency,
    symbol: currencySymbol,
    rates: currencyRates,
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
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const currRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);

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
          applyDocumentTheme(
            dark,
            parsed.textSize || 'medium',
            Boolean(parsed.reduceMotion)
          );
        }
      } catch {
        // Ignore storage read errors
      }
    };

    syncFromStorage();

    const handleThemeEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ isDark?: boolean }>;
      if (
        customEvent.detail &&
        typeof customEvent.detail.isDark === 'boolean'
      ) {
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

  // Global Ctrl+K / Cmd+K shortcut to open search modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false);
      }
      if (currRef.current && !currRef.current.contains(e.target as Node)) {
        setCurrencyMenuOpen(false);
      }
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isMoreActive =
    pathname?.startsWith('/date-time') ||
    pathname?.startsWith('/home-construction') ||
    pathname?.startsWith('/science') ||
    pathname?.startsWith('/guides') ||
    pathname?.startsWith('/calculation-methodology') ||
    pathname?.startsWith('/about');

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 sm:gap-8 h-14 sm:h-16">
            {/* Zone 1: Brand Lockup */}
            <BrandLogo variant="navbar" />

            {/* Zone 2: Streamlined Desktop Navigation (lg and up) */}
            <nav
              aria-label="Primary navigation"
              className="hidden lg:flex items-center gap-2 xl:gap-4 h-full"
            >
              {PRIMARY_NAV_LINKS.map((item) => {
                const isActive = item.exact
                  ? pathname === item.href || pathname === '/all-calculators'
                  : pathname?.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative inline-flex items-center px-2.5 h-full text-sm whitespace-nowrap shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] rounded-md ${
                      isActive
                        ? 'text-[#2457D6] dark:text-blue-400 font-semibold'
                        : 'text-slate-600 dark:text-slate-300 font-medium hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span>{item.name}</span>
                    {isActive && (
                      <span
                        aria-hidden="true"
                        className="absolute bottom-0 left-2.5 right-2.5 h-[2px] bg-[#2457D6] dark:bg-blue-400 rounded-full"
                      />
                    )}
                  </Link>
                );
              })}

              {/* Compact, Clean "More" Dropdown */}
              <div className="relative h-full flex items-center" ref={moreRef}>
                <button
                  type="button"
                  data-compact="true"
                  onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                  aria-expanded={moreMenuOpen}
                  className={`compact-control relative inline-flex items-center gap-1 px-2.5 py-1.5 text-sm whitespace-nowrap shrink-0 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] rounded-md ${
                    isMoreActive || moreMenuOpen
                      ? 'text-[#2457D6] dark:text-blue-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 font-medium hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>More</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-150 ${
                      moreMenuOpen ? 'rotate-180 text-[#2457D6]' : 'text-slate-400'
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {moreMenuOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-52 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg py-1.5 z-50">
                    {MORE_MENU_LINKS.map((item) => {
                      const active = pathname?.startsWith(item.href);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMoreMenuOpen(false)}
                          className={`block px-3.5 py-2 text-sm transition-colors ${
                            active
                              ? 'bg-blue-50/80 dark:bg-blue-950/50 text-[#2457D6] dark:text-blue-400 font-semibold'
                              : 'text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-[#2457D6] dark:hover:text-blue-400'
                          }`}
                        >
                          {item.name}
                        </Link>
                      );
                    })}

                    <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                    {TRUST_MENU_LINKS.map((item) => {
                      const active = pathname?.startsWith(item.href);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMoreMenuOpen(false)}
                          className={`block px-3.5 py-1.5 text-xs transition-colors ${
                            active
                              ? 'text-[#2457D6] dark:text-blue-400 font-semibold'
                              : 'text-slate-500 dark:text-slate-400 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                          }`}
                        >
                          {item.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </nav>

            {/* Zone 3: Clean Utility Controls */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Search Trigger */}
              <button
                type="button"
                data-compact="true"
                onClick={() => setSearchOpen(true)}
                aria-label="Search calculators (Ctrl+K)"
                title="Search calculators (Ctrl+K)"
                className="compact-control inline-flex items-center gap-2 h-9 px-2.5 sm:px-3 rounded-lg bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/70 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6]"
              >
                <Search
                  className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0"
                  aria-hidden="true"
                />
                <span className="hidden md:inline text-xs font-medium text-slate-500 dark:text-slate-400">
                  Search...
                </span>
                <kbd className="hidden xl:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700">
                  Ctrl K
                </kbd>
              </button>

              {/* Unified Currency & Language Control Group */}
              <div
                className="inline-flex items-center h-9 rounded-lg border border-slate-200/80 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 p-0.5"
                data-no-translate="true"
              >
                {/* Currency Selector */}
                <div className="relative h-full" ref={currRef}>
                  <button
                    type="button"
                    data-compact="true"
                    onClick={() => {
                      setCurrencyMenuOpen(!currencyMenuOpen);
                      setLangMenuOpen(false);
                    }}
                    aria-expanded={currencyMenuOpen}
                    aria-label={`Select display currency (currently ${currency})`}
                    title={`Active Currency: ${currency} (${currencySymbol})`}
                    className="compact-control inline-flex items-center gap-1 h-full px-2 sm:px-2.5 rounded-md text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 hover:text-[#2457D6] dark:hover:text-blue-400 transition-colors cursor-pointer tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6]"
                  >
                    <span className="font-mono font-bold text-[#2457D6] dark:text-blue-400">
                      {currencySymbol}
                    </span>
                    <span>{currency}</span>
                    <ChevronDown
                      className="w-3 h-3 text-slate-400"
                      aria-hidden="true"
                    />
                  </button>

                  {currencyMenuOpen && (
                    <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2.5 z-50">
                      <div className="px-3.5 pb-2 mb-1 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                        <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">
                          Currency &amp; FX Rates
                        </span>
                        <button
                          type="button"
                          data-compact="true"
                          onClick={() => refreshLiveRates()}
                          disabled={isLoadingRates}
                          title={
                            lastUpdatedUtc
                              ? `Updated: ${lastUpdatedUtc}`
                              : 'Refresh exchange rates'
                          }
                          className="compact-control inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[10px] font-semibold hover:bg-slate-200/70 cursor-pointer"
                        >
                          <RefreshCw
                            className={`w-2.5 h-2.5 ${
                              isLoadingRates ? 'animate-spin' : ''
                            }`}
                          />
                          <span>{isLoadingRates ? 'Updating' : 'Refresh'}</span>
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
                                ? 'bg-blue-50/80 dark:bg-blue-950/50 text-[#2457D6] dark:text-blue-400 font-semibold'
                                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <span>{c.flag}</span>
                              <span>
                                {c.code} ({c.symbol})
                              </span>
                            </span>
                            <span className="text-[11px] font-mono tabular-nums text-slate-500 dark:text-slate-400">
                              1 USD = {c.symbol}
                              {formatExchangeRate(c.code, rateVal)}
                            </span>
                          </button>
                        );
                      })}

                      {/* Inline Quick Currency Converter */}
                      <div className="mt-2 pt-2.5 px-3.5 border-t border-slate-100 dark:border-slate-800 space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                          <span className="inline-flex items-center gap-1">
                            <ArrowLeftRight className="w-3 h-3 text-[#2457D6] dark:text-blue-400" />
                            Quick Convert
                          </span>
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
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono tabular-nums font-semibold text-slate-800 dark:text-slate-100"
                          />
                          <select
                            aria-label="Quick currency converter source"
                            value={quickFromCode}
                            onChange={(e) =>
                              setQuickFromCode(
                                e.target.value as GlobalCurrencyCode
                              )
                            }
                            className="px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-100"
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
                                    ? 'bg-[#2457D6] text-white border-[#2457D6] font-semibold'
                                    : 'bg-slate-50 dark:bg-slate-800/70 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-[#2457D6]'
                                }`}
                              >
                                <div className="text-[10px] opacity-80">
                                  {c.flag} {c.code}
                                </div>
                                <div className="font-mono tabular-nums font-semibold truncate">
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

                {/* Hairline Divider & Compact Language Selector (md and up) */}
                <span
                  aria-hidden="true"
                  className="hidden md:block w-px h-4 bg-slate-200 dark:bg-slate-700"
                />
                <div className="relative hidden md:block h-full" ref={langRef}>
                  <button
                    type="button"
                    data-compact="true"
                    onClick={() => {
                      setLangMenuOpen(!langMenuOpen);
                      setCurrencyMenuOpen(false);
                    }}
                    aria-expanded={langMenuOpen}
                    aria-label={`Select language (currently ${currentLanguage.label})`}
                    title={`Language: ${currentLanguage.label}`}
                    className="compact-control inline-flex items-center gap-1 h-full px-2 rounded-md text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 hover:text-[#2457D6] dark:hover:text-blue-400 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6]"
                  >
                    <Globe
                      className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400"
                      aria-hidden="true"
                    />
                    <span className="uppercase">{currentLanguage.code}</span>
                    <ChevronDown
                      className="w-3 h-3 text-slate-400"
                      aria-hidden="true"
                    />
                  </button>

                  {langMenuOpen && (
                    <div className="absolute right-0 mt-2 w-40 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-1.5 z-50">
                      {SUPPORTED_LANGUAGES.map((l) => (
                        <button
                          key={l.code}
                          type="button"
                          data-compact="true"
                          onClick={() => {
                            setLang(l.code);
                            setLangMenuOpen(false);
                          }}
                          className={`compact-control w-full text-left px-3.5 py-1.5 text-xs font-medium cursor-pointer flex items-center justify-between ${
                            lang === l.code
                              ? 'bg-blue-50/80 dark:bg-blue-950/50 text-[#2457D6] dark:text-blue-400 font-semibold'
                              : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          <span>{l.label}</span>
                          <span className="text-[10px] font-mono uppercase text-slate-400">
                            {l.code}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Single Responsive Theme Switcher */}
              <div className="inline-flex items-center shrink-0">
                <ThemeSwitcher size="md" />
              </div>

              {/* Mobile & Tablet Navigation Toggle (< lg) */}
              <button
                type="button"
                data-compact="true"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="compact-control lg:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/70 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6]"
                aria-expanded={mobileMenuOpen}
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-4 h-4 text-[#2457D6] dark:text-blue-400" aria-hidden="true" />
                ) : (
                  <Menu className="w-4 h-4 text-slate-700 dark:text-slate-200" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Clean, Simplified Mobile & Tablet Navigation Drawer (< lg) */}
        {mobileMenuOpen && (
          <nav
            aria-label="Mobile navigation drawer"
            className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-4 max-h-[calc(100vh-3.5rem)] overflow-y-auto shadow-lg"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {[...PRIMARY_NAV_LINKS, ...MORE_MENU_LINKS].map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== '/calculators' && pathname?.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                      active
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-[#2457D6] dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                        : 'bg-slate-50 dark:bg-slate-800/70 text-slate-800 dark:text-slate-200 border border-slate-200/70 dark:border-slate-800 hover:border-[#2457D6]'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 px-1">
              <div className="flex items-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-400">
                {TRUST_MENU_LINKS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-[#2457D6] dark:hover:text-blue-400"
                  >
                    {item.name}
                  </Link>
                ))}
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-[#2457D6] dark:hover:text-blue-400"
                >
                  Contact
                </Link>
              </div>

              <div
                className="flex flex-wrap items-center gap-1.5"
                data-no-translate="true"
              >
                <Coins className="w-3.5 h-3.5 text-slate-400 mr-0.5" aria-hidden="true" />
                {GLOBAL_CURRENCIES.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    data-compact="true"
                    onClick={() => setCurrency(c.code)}
                    className={`compact-control px-2 py-1 rounded text-xs font-semibold tabular-nums cursor-pointer ${
                      currency === c.code
                        ? 'bg-[#2457D6] text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {c.code}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Language Selector */}
            <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 px-1">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
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
                    className={`compact-control px-2 py-1 rounded text-xs font-semibold cursor-pointer ${
                      lang === l.code
                        ? 'bg-[#2457D6] text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
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

      {searchOpen && (
        <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      )}
    </>
  );
}
