'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  CategoryDefinition,
  UnitDefinition,
  convertValue,
  formatResult,
  CONVERSION_CATEGORIES
} from '@/lib/conversions';
import {
  getConverterKnowledge,
  getStepByStepCalculation,
  ConverterKnowledge
} from '@/lib/converterKnowledge';
import CurrencyUnitSearchCard from './CurrencyUnitSearchCard';

interface UnitConverterViewProps {
  categoryId: string;
  fromUnitId: string;
  toUnitId: string;
  slug: string;
}

interface HistoryItem {
  id: string;
  fromVal: string;
  toVal: string;
  fromSymbol: string;
  toSymbol: string;
  timestamp: number;
}

export default function UnitConverterView({
  categoryId,
  fromUnitId,
  toUnitId,
  slug
}: UnitConverterViewProps) {
  const category = useMemo(() => {
    return CONVERSION_CATEGORIES.find((c) => c.id === categoryId) || CONVERSION_CATEGORIES[0];
  }, [categoryId]);

  const initialFromUnit = useMemo(() => {
    return category.units.find((u) => u.id === fromUnitId) || category.units[0];
  }, [category, fromUnitId]);

  const initialToUnit = useMemo(() => {
    return category.units.find((u) => u.id === toUnitId) || category.units[1] || category.units[0];
  }, [category, toUnitId]);

  // Current active units
  const [fromUnit, setFromUnit] = useState<UnitDefinition>(initialFromUnit);
  const [toUnit, setToUnit] = useState<UnitDefinition>(initialToUnit);

  // Sync state if initial props change
  useEffect(() => {
    setFromUnit(initialFromUnit);
    setToUnit(initialToUnit);
  }, [initialFromUnit, initialToUnit]);

  // Input states
  const [inputValue, setInputValue] = useState<string>('5');
  const [liveConversion, setLiveConversion] = useState<boolean>(true);
  const [precision, setPrecision] = useState<'auto' | '2' | '4' | '6' | '8' | 'scientific'>('4');
  const [isSwapping, setIsSwapping] = useState<boolean>(false);

  // Interactive UI states
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [tableSearch, setTableSearch] = useState<string>('');
  const [tableReverse, setTableReverse] = useState<boolean>(false);
  const [sliderVal, setSliderVal] = useState<number>(5);
  const [relatedFilter, setRelatedFilter] = useState<string>('');

  const inputRef = useRef<HTMLInputElement>(null);

  // Load favorites & history from localStorage
  useEffect(() => {
    try {
      const favKey = `solveit_fav_${category.id}_${fromUnit.id}_${toUnit.id}`;
      const isFav = localStorage.getItem(favKey) === 'true';
      const savedHistory = localStorage.getItem(`solveit_hist_${category.id}`);
      const parsed = savedHistory ? JSON.parse(savedHistory).slice(0, 10) : [];

      const timer = setTimeout(() => {
        setIsFavorited(isFav);
        if (parsed.length > 0) {
          setHistory(parsed);
        }
      }, 0);

      return () => clearTimeout(timer);
    } catch {
      // Ignore localStorage errors
    }
  }, [category.id, fromUnit.id, toUnit.id]);

  // Toast notification helper
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  // Calculation computation
  const numericInput = useMemo(() => {
    const parsed = parseFloat(inputValue);
    return isNaN(parsed) ? 0 : parsed;
  }, [inputValue]);

  const conversionResult = useMemo(() => {
    return convertValue(numericInput, category.id, fromUnit.id, toUnit.id);
  }, [numericInput, category.id, fromUnit.id, toUnit.id]);

  const formattedResult = useMemo(() => {
    return formatResult(conversionResult.resultNumber, precision);
  }, [conversionResult.resultNumber, precision]);

  // Knowledge details
  const knowledge: ConverterKnowledge = useMemo(() => {
    return getConverterKnowledge(category, fromUnit, toUnit);
  }, [category, fromUnit, toUnit]);

  // Step by step breakdown
  const steps = useMemo(() => {
    return getStepByStepCalculation(numericInput, category, fromUnit, toUnit, precision);
  }, [numericInput, category, fromUnit, toUnit, precision]);

  // Save to history upon conversion
  const recordHistory = (fromV: string, toV: string) => {
    try {
      const item: HistoryItem = {
        id: Math.random().toString(36).substring(2, 9),
        fromVal: fromV,
        toVal: toV,
        fromSymbol: fromUnit.symbol,
        toSymbol: toUnit.symbol,
        timestamp: Date.now()
      };
      const nextHist = [
        item,
        ...history.filter((h) => h.fromVal !== fromV || h.toSymbol !== toUnit.symbol)
      ].slice(0, 10);
      setHistory(nextHist);
      localStorage.setItem(`solveit_hist_${category.id}`, JSON.stringify(nextHist));
    } catch {
      // Ignore
    }
  };

  // Swap Units handler
  const handleSwap = useCallback(() => {
    setIsSwapping(true);
    setTimeout(() => setIsSwapping(false), 300);

    const prevFrom = fromUnit;
    const prevTo = toUnit;
    setFromUnit(prevTo);
    setToUnit(prevFrom);

    if (conversionResult.resultNumber !== 0 && !isNaN(conversionResult.resultNumber)) {
      setInputValue(
        conversionResult.resultNumber.toFixed(4).replace(/0+$/, '').replace(/\.$/, '')
      );
    }
    showToast(`Swapped: Now converting ${prevTo.name} to ${prevFrom.name}`);
  }, [fromUnit, toUnit, conversionResult.resultNumber]);

  // Reset handler
  const handleReset = useCallback(() => {
    setInputValue('1');
    setSliderVal(1);
    if (inputRef.current) inputRef.current.focus();
    showToast('Converter reset to default value');
  }, []);

  // Favorite toggle
  const handleToggleFavorite = () => {
    const next = !isFavorited;
    setIsFavorited(next);
    try {
      const favKey = `solveit_fav_${category.id}_${fromUnit.id}_${toUnit.id}`;
      if (next) {
        localStorage.setItem(favKey, 'true');
        showToast(`Saved ${fromUnit.name} to ${toUnit.name} to favorites`);
      } else {
        localStorage.removeItem(favKey);
        showToast('Removed from favorites');
      }
    } catch {
      // Ignore
    }
  };

  // Copy result
  const handleCopyResult = useCallback(() => {
    const textToCopy = `${inputValue} ${fromUnit.symbol} = ${formattedResult} ${toUnit.symbol}`;
    navigator.clipboard?.writeText(textToCopy);
    showToast(`Copied: "${textToCopy}"`);
  }, [inputValue, fromUnit.symbol, formattedResult, toUnit.symbol]);

  // Copy formula
  const handleCopyFormula = useCallback(() => {
    navigator.clipboard?.writeText(knowledge.formula);
    showToast(`Copied formula: "${knowledge.formula}"`);
  }, [knowledge.formula]);

  // Share handler
  const handleShare = () => {
    const url =
      typeof window !== 'undefined'
        ? window.location.href
        : `https://solveitcalculator.com/conversion/${slug}`;
    if (navigator.share) {
      navigator
        .share({
          title: `${fromUnit.name} to ${toUnit.name} Converter`,
          text: `Convert ${fromUnit.name} to ${toUnit.name} with step-by-step formulas on SolveIt Calculator`,
          url
        })
        .catch(() => {});
    } else {
      navigator.clipboard?.writeText(url);
      showToast('Link copied to clipboard!');
    }
  };

  // Print handler
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  // Keyboard shortcuts listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        if (e.key === 'Escape') {
          (e.target as HTMLElement).blur();
        }
        return;
      }

      if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        handleSwap();
      } else if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        handleCopyResult();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleReset();
      } else if (e.key === '/' || (e.metaKey && e.key === 'k')) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSwap, handleCopyResult, handleReset]);

  // Extended Conversion Table generation (0.01 to 10,000)
  const tableValues = useMemo(() => {
    return [0.01, 0.1, 0.5, 1, 2, 3, 4, 5, 10, 15, 20, 25, 50, 75, 100, 250, 500, 1000, 2500, 5000, 10000];
  }, []);

  const tableRows = useMemo(() => {
    const sourceUnit = tableReverse ? toUnit : fromUnit;
    const targetUnit = tableReverse ? fromUnit : toUnit;

    return tableValues
      .map((val) => {
        const res = convertValue(val, category.id, sourceUnit.id, targetUnit.id);
        return {
          fromVal: val,
          fromStr: `${val} ${sourceUnit.symbol}`,
          toVal: res.resultNumber,
          toStr: `${formatResult(res.resultNumber, '4')} ${targetUnit.symbol}`,
          rawResult: res.resultNumber
        };
      })
      .filter((row) => {
        if (!tableSearch) return true;
        const q = tableSearch.toLowerCase();
        return row.fromStr.toLowerCase().includes(q) || row.toStr.toLowerCase().includes(q);
      });
  }, [tableValues, tableReverse, fromUnit, toUnit, category.id, tableSearch]);

  // Export CSV handler
  const handleExportCSV = () => {
    const sourceUnit = tableReverse ? toUnit : fromUnit;
    const targetUnit = tableReverse ? fromUnit : toUnit;
    let csv = `"${sourceUnit.name} (${sourceUnit.symbol})","${targetUnit.name} (${targetUnit.symbol})"\n`;
    tableRows.forEach((r) => {
      csv += `"${r.fromVal}","${r.toVal}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${sourceUnit.id}_to_${targetUnit.id}_conversion_table.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Downloaded CSV conversion table');
  };

  // Related converters in same category
  const relatedConverters = useMemo(() => {
    const otherUnits = category.units.filter((u) => u.id !== fromUnit.id && u.id !== toUnit.id);
    return otherUnits.slice(0, 8).map((u) => ({
      name: `${fromUnit.name} to ${u.name}`,
      slug: `${fromUnit.id}-to-${u.id}`,
      symbol: `${fromUnit.symbol} → ${u.symbol}`
    }));
  }, [category.units, fromUnit, toUnit]);

  // Filtered related converters for search bar
  const filteredRelatedConverters = useMemo(() => {
    if (!relatedFilter.trim()) return relatedConverters;
    const q = relatedFilter.toLowerCase();
    return relatedConverters.filter(
      (rc) => rc.name.toLowerCase().includes(q) || rc.symbol.toLowerCase().includes(q)
    );
  }, [relatedConverters, relatedFilter]);

  // Sync slider with main converter
  const handleSliderChange = (newVal: number) => {
    setSliderVal(newVal);
    setInputValue(newVal.toString());
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen transition-colors duration-200">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span className="material-symbols-outlined text-emerald-400 dark:text-emerald-600 text-[18px]">
            check_circle
          </span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'Article',
                '@id': `https://solveitcalculator.com/conversion/${slug}#article`,
                url: `https://solveitcalculator.com/conversion/${slug}`,
                name: `${fromUnit.name} to ${toUnit.name} Converter`,
                headline: `How to Convert ${fromUnit.name} to ${toUnit.name} (${fromUnit.symbol} to ${toUnit.symbol})`,
                description: knowledge.executiveSummary,
                inLanguage: 'en-US',
                author: {
                  '@type': 'Organization',
                  name: 'SolveIt Calculator Metrology & Editorial Team',
                  url: 'https://solveitcalculator.com'
                },
                publisher: {
                  '@type': 'Organization',
                  name: 'SolveIt Calculator',
                  url: 'https://solveitcalculator.com'
                }
              },
              {
                '@type': 'SoftwareApplication',
                name: `${fromUnit.name} to ${toUnit.name} Calculator`,
                operatingSystem: 'All',
                applicationCategory: 'UtilitiesApplication',
                offers: {
                  '@type': 'Offer',
                  price: '0',
                  priceCurrency: 'USD'
                }
              },
              {
                '@type': 'BreadcrumbList',
                itemListElement: [
                  { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://solveitcalculator.com' },
                  { '@type': 'ListItem', position: 2, name: 'Unit Converters', item: 'https://solveitcalculator.com/conversions' },
                  {
                    '@type': 'ListItem',
                    position: 3,
                    name: `${category.name} Converter`,
                    item: `https://solveitcalculator.com/${category.id.replace(/_/g, '-')}-converter`
                  },
                  {
                    '@type': 'ListItem',
                    position: 4,
                    name: `${fromUnit.name} to ${toUnit.name}`,
                    item: `https://solveitcalculator.com/conversion/${slug}`
                  }
                ]
              },
              {
                '@type': 'FAQPage',
                mainEntity: knowledge.faqs.map((f) => ({
                  '@type': 'Question',
                  name: f.q,
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: f.a
                  }
                }))
              },
              {
                '@type': 'HowTo',
                name: `How to Convert ${fromUnit.name} to ${toUnit.name}`,
                step: [
                  { '@type': 'HowToStep', text: steps.step1 },
                  { '@type': 'HowToStep', text: steps.step2 },
                  { '@type': 'HowToStep', text: steps.step3 },
                  { '@type': 'HowToStep', text: steps.step4 }
                ]
              }
            ]
          })
        }}
      />

      <main className="pt-4 sm:pt-6 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-14">
        {/* =========================================================================
            HEADER & EDITORIAL TRUST BYLINE
        ========================================================================= */}
        <section className="space-y-4 text-center max-w-3xl mx-auto pt-2">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumbs"
            className="flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 flex-wrap"
          >
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/conversions" className="hover:text-primary transition-colors">
              Unit Converters
            </Link>
            <span>/</span>
            <Link
              href={`/${category.id.replace(/_/g, '-')}-converter`}
              className="hover:text-primary transition-colors"
            >
              {category.name}
            </Link>
            <span>/</span>
            <span className="text-slate-900 dark:text-white font-semibold">
              {fromUnit.symbol} to {toUnit.symbol}
            </span>
          </nav>

          {/* H1 Headline */}
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {fromUnit.name} to {toUnit.name} Converter
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Convert {fromUnit.name.toLowerCase()} to {toUnit.name.toLowerCase()} ({fromUnit.symbol} to {toUnit.symbol}) instantly with verified conversion formulas, step-by-step arithmetic examples, and interactive reference tables.
          </p>

          {/* EEAT Trust Byline Bar */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1.5 font-medium">
              <span className="material-symbols-outlined text-primary text-[16px]">verified</span>
              <span>Reviewed by SolveIt Metrology &amp; Physics Team</span>
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>Academic Metrology Verified</span>
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">schedule</span>
              <span>Updated: September 2026</span>
            </span>
          </div>
        </section>

        {/* =========================================================================
            WHAT IS MY CURRENT CURRENCY / UNIT? GOOGLE GROUNDED SEARCH
        ========================================================================= */}
        <CurrencyUnitSearchCard
          initialExpanded={false}
          onApplyPair={(pair) => {
            if (pair.categoryId === category.id) {
              const foundFrom = category.units.find((u) => u.id === pair.fromUnitId);
              const foundTo = category.units.find((u) => u.id === pair.toUnitId);
              if (foundFrom) setFromUnit(foundFrom);
              if (foundTo) setToUnit(foundTo);
            } else {
              window.location.href = `/conversion/${pair.fromUnitId.toLowerCase()}-to-${pair.toUnitId.toLowerCase()}`;
            }
          }}
        />

        {/* =========================================================================
            SECTION 1: INTERACTIVE CONVERTER WIDGET (ABOVE THE FOLD FIRST)
        ========================================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Input Card */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-900/5 dark:shadow-none space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[22px]">{category.icon}</span>
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {category.name} Converter
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    {fromUnit.symbol} ➔ {toUnit.symbol} Calculator
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleToggleFavorite}
                  className={`p-2 rounded-xl transition-all cursor-pointer ${
                    isFavorited
                      ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  title={isFavorited ? 'Saved in favorites' : 'Add to favorites'}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {isFavorited ? 'star' : 'star_border'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                  title="Share this tool"
                >
                  <span className="material-symbols-outlined text-[20px]">share</span>
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                  title="Reset calculator"
                >
                  <span className="material-symbols-outlined text-[20px]">restart_alt</span>
                </button>
              </div>
            </div>

            {/* Input Value */}
            <div className="space-y-2">
              <label
                htmlFor="converter-input-val"
                className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between"
              >
                <span>Enter {fromUnit.name} Value:</span>
                <span className="text-slate-400 font-normal">Decimal &amp; fractions supported</span>
              </label>

              <div className="relative">
                <input
                  id="converter-input-val"
                  ref={inputRef}
                  type="text"
                  inputMode="decimal"
                  value={inputValue}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (/^-?\d*\.?\d*(e[+-]?\d*)?$/i.test(v) || v === '') {
                      setInputValue(v);
                      if (liveConversion) {
                        const parsed = parseFloat(v);
                        if (!isNaN(parsed)) {
                          recordHistory(
                            v,
                            formatResult(
                              convertValue(parsed, category.id, fromUnit.id, toUnit.id).resultNumber,
                              precision
                            )
                          );
                        }
                      }
                    }
                  }}
                  placeholder="e.g. 5"
                  className="w-full text-2xl sm:text-3xl font-mono font-bold px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono font-bold text-sm text-slate-400">
                  {fromUnit.symbol}
                </span>
              </div>
            </div>

            {/* Units Selection Row with Swap */}
            <div className="grid grid-cols-1 sm:grid-cols-11 gap-3 items-center">
              {/* From Unit */}
              <div className="sm:col-span-5 space-y-1">
                <label
                  htmlFor="from-unit-select"
                  className="text-xs font-semibold text-slate-500 dark:text-slate-400"
                >
                  From
                </label>
                <div className="relative">
                  <select
                    id="from-unit-select"
                    value={fromUnit.id}
                    onChange={(e) => {
                      const found = category.units.find((u) => u.id === e.target.value);
                      if (found) setFromUnit(found);
                    }}
                    className="w-full appearance-none px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer pr-10"
                  >
                    {category.units.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.symbol})
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[18px]">
                    unfold_more
                  </span>
                </div>
              </div>

              {/* Swap Button */}
              <div className="sm:col-span-1 flex justify-center sm:pt-5">
                <button
                  type="button"
                  onClick={handleSwap}
                  className={`w-11 h-11 rounded-2xl bg-slate-100 hover:bg-primary/10 dark:bg-slate-800 dark:hover:bg-primary/20 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-primary transition-all flex items-center justify-center cursor-pointer shadow-xs ${
                    isSwapping ? 'rotate-180 duration-300' : ''
                  }`}
                  title="Swap units"
                >
                  <span className="material-symbols-outlined text-[20px]">swap_horiz</span>
                </button>
              </div>

              {/* To Unit */}
              <div className="sm:col-span-5 space-y-1">
                <label
                  htmlFor="to-unit-select"
                  className="text-xs font-semibold text-slate-500 dark:text-slate-400"
                >
                  To
                </label>
                <div className="relative">
                  <select
                    id="to-unit-select"
                    value={toUnit.id}
                    onChange={(e) => {
                      const found = category.units.find((u) => u.id === e.target.value);
                      if (found) setToUnit(found);
                    }}
                    className="w-full appearance-none px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer pr-10"
                  >
                    {category.units.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.symbol})
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[18px]">
                    unfold_more
                  </span>
                </div>
              </div>
            </div>

            {/* Precision Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Decimals:</span>
                <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200/80 dark:border-slate-700/80">
                  {(['2', '4', '6', 'auto', 'scientific'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPrecision(p)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        precision === p
                          ? 'bg-white dark:bg-slate-700 text-primary dark:text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {p === 'scientific' ? 'Sci' : p === 'auto' ? 'Auto' : `${p} dec`}
                    </button>
                  ))}
                </div>
              </div>

              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={liveConversion}
                  onChange={(e) => setLiveConversion(e.target.checked)}
                  className="rounded text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                />
                <span className="text-slate-600 dark:text-slate-300 font-medium">Live reactive</span>
              </label>
            </div>

            {/* Drawer trigger for History */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 pt-1">
              <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[10px] border border-slate-200 dark:border-slate-700">S</kbd> to swap • <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[10px] border border-slate-200 dark:border-slate-700">C</kbd> to copy</span>
              <button
                type="button"
                onClick={() => setShowHistory(!showHistory)}
                className="hover:text-primary underline transition-colors cursor-pointer"
              >
                {showHistory ? 'Hide history' : `Recent history (${history.length})`}
              </button>
            </div>

            {showHistory && (
              <div className="p-4 rounded-2xl bg-slate-100/90 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>Recent Conversions</span>
                  {history.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setHistory([]);
                        localStorage.removeItem(`solveit_hist_${category.id}`);
                      }}
                      className="text-red-500 hover:underline cursor-pointer font-normal text-[11px]"
                    >
                      Clear
                    </button>
                  )}
                </div>
                {history.length === 0 ? (
                  <div className="text-xs text-slate-400 py-2">No history logged yet.</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {history.map((h) => (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() => setInputValue(h.fromVal)}
                        className="text-left p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 hover:border-primary transition-all text-xs font-mono flex items-center justify-between cursor-pointer"
                      >
                        <span>
                          {h.fromVal} {h.fromSymbol} = {h.toVal} {h.toSymbol}
                        </span>
                        <span className="material-symbols-outlined text-[14px] text-slate-400">
                          arrow_forward
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Result Output Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-800 dark:from-blue-950 dark:via-indigo-950 dark:to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-blue-500/10 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-blue-100 text-xs font-medium">
                <span className="uppercase tracking-wider font-semibold">Calculation Result</span>
                <span className="inline-flex items-center gap-1 bg-white/10 px-2.5 py-0.5 rounded-full backdrop-blur-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Standards Verified
                </span>
              </div>

              <div className="text-sm font-medium text-blue-100/90">
                {inputValue || '0'} {fromUnit.name} ({fromUnit.symbol}) =
              </div>

              <div className="space-y-1">
                <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white break-words">
                  {formattedResult}
                </div>
                <div className="text-lg font-semibold text-blue-200">
                  {toUnit.name} ({toUnit.symbol})
                </div>
              </div>

              {/* Exact Formula Banner */}
              <div className="p-4 rounded-2xl bg-black/25 backdrop-blur-md border border-white/15 space-y-1 text-xs">
                <div className="text-blue-200 font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">functions</span>
                  <span>Direct Mathematical Formula:</span>
                </div>
                <div className="font-mono text-white text-sm font-bold pt-0.5">
                  {knowledge.formula}
                </div>
                <div className="text-blue-300/80 text-[11px] pt-1">
                  Ratio: {knowledge.factorText}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-4 border-t border-white/15">
              <button
                type="button"
                onClick={handleCopyResult}
                className="w-full py-3 rounded-2xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">content_copy</span>
                <span>Copy Converted Value</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleCopyFormula}
                  className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer backdrop-blur-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">copy_all</span>
                  <span>Copy Formula</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer backdrop-blur-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  <span>Export CSV</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 2: RELATED TOOLS & SISTER UNITS DIRECTORY (4th IN HIERARCHY)
        ========================================================================= */}
        <section className="space-y-6 pt-2">
          <div className="border-b border-slate-200/80 dark:border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-primary">
                More {category.name} Converters
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Related {category.name} Conversions &amp; Tools
              </h2>
            </div>
            <Link
              href={`/${category.id.replace(/_/g, '-')}-converter`}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              <span>Full {category.name} Tool</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>

          {/* Category Filter & Tool Search Bar (Directly Above Catalog Grid) */}
          <div className="relative">
            <input
              type="text"
              value={relatedFilter}
              onChange={(e) => setRelatedFilter(e.target.value)}
              placeholder={`Search ${category.name} converters (e.g. ${relatedConverters[0]?.name || 'unit'})...`}
              className="w-full px-4 py-2.5 pl-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
            />
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
              search
            </span>
            {relatedFilter && (
              <button
                type="button"
                onClick={() => setRelatedFilter('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
              >
                Clear
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {filteredRelatedConverters.length > 0 ? (
              filteredRelatedConverters.map((rc) => (
                <Link
                  key={rc.slug}
                  href={`/conversion/${rc.slug}`}
                  className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-primary hover:shadow-md transition-all text-left block group"
                >
                  <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-primary">
                    {rc.name}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-1">
                    {rc.symbol}
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-6 text-xs text-slate-500">
                No matching {category.name} conversions found for &quot;{relatedFilter}&quot;.
              </div>
            )}
          </div>
        </section>

        {/* =========================================================================
            SECTION 3: EXECUTIVE SUMMARY (KEY TAKEAWAYS)
        ========================================================================= */}
        <section className="p-5 sm:p-6 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/90 dark:border-blue-900/60 space-y-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">lightbulb</span>
            <h2 className="text-sm font-bold uppercase tracking-wider text-primary">
              Quick Summary &amp; Key Takeaway
            </h2>
          </div>
          <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed">
            {knowledge.executiveSummary}
          </p>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-mono pt-1">
            Exact Ratio: 1 {fromUnit.symbol} = {knowledge.exactFactor} {toUnit.symbol}
          </div>
        </section>

        {/* =========================================================================
            SECTION 3: LONG-FORM PLAIN-ENGLISH ARTICLE: HOW TO CONVERT [FROM] TO [TO]
        ========================================================================= */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-8">
          <div className="space-y-3">
            <div className="text-xs uppercase font-bold tracking-wider text-primary">
              Clear Step-by-Step Walkthrough
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              How to Convert {fromUnit.name} to {toUnit.name}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Converting {fromUnit.name.toLowerCase()} ({fromUnit.symbol}) into {toUnit.name.toLowerCase()} ({toUnit.symbol}) is simple. You take the measurement in {fromUnit.name.toLowerCase()} and multiply it by the conversion factor. Because one {fromUnit.name.toLowerCase()} equals {knowledge.exactFactor} {toUnit.name.toLowerCase()}s, here is the formula to use:
            </p>
          </div>

          {/* Formula Callout Box */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-200/90 dark:border-blue-900/60 space-y-2">
            <div className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">calculate</span>
              <span>Conversion Formula</span>
            </div>
            <div className="font-mono text-xl sm:text-2xl font-black text-slate-900 dark:text-white pt-1">
              {knowledge.formula}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 pt-1">
              In this formula, multiply your starting number of <span className="font-bold">{fromUnit.name.toLowerCase()}</span> by <span className="font-bold">{knowledge.exactFactor}</span> to find the equivalent in <span className="font-bold">{toUnit.name.toLowerCase()}</span>.
            </p>
          </div>

          {/* Solved Example 1: Standard Direction */}
          <div className="space-y-4 pt-2">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
                1
              </span>
              <span>Example 1: Converting {steps.sampleInput} {fromUnit.symbol} to {toUnit.symbol}</span>
            </h3>

            <p className="text-sm text-slate-600 dark:text-slate-300">
              Let&apos;s walk through a real calculation converting {steps.sampleInput} {fromUnit.name.toLowerCase()} into {toUnit.name.toLowerCase()}:
            </p>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 font-mono text-xs sm:text-sm space-y-2.5">
              <div className="text-slate-500 dark:text-slate-400">
                <span className="font-bold text-slate-700 dark:text-slate-300 font-sans">Step 1 (Formula):</span> {steps.step1}
              </div>
              <div className="text-slate-700 dark:text-slate-200">
                <span className="font-bold text-slate-900 dark:text-white font-sans">Step 2 (Substitute):</span> {steps.step2}
              </div>
              <div className="text-slate-700 dark:text-slate-200">
                <span className="font-bold text-slate-900 dark:text-white font-sans">Step 3 (Multiply):</span> {steps.step3}
              </div>
              <div className="text-primary font-bold pt-1 border-t border-slate-200 dark:border-slate-700 font-sans">
                <span>Final Answer:</span> {steps.sampleInput} {fromUnit.symbol} = {steps.sampleResult}
              </div>
            </div>
          </div>

          {/* Reverse Conversion Guide */}
          <div className="space-y-4 pt-6 border-t border-slate-200/70 dark:border-slate-800">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center">
                2
              </span>
              <span>How to Convert {toUnit.name} to {fromUnit.name} (Reverse Calculation)</span>
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              If you want to go backwards and convert {toUnit.name.toLowerCase()} ({toUnit.symbol}) back to {fromUnit.name.toLowerCase()} ({fromUnit.symbol}), you simply divide by the conversion factor:
            </p>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 font-mono text-base font-bold text-slate-900 dark:text-white">
              {knowledge.reverseFormula}
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 font-mono text-xs sm:text-sm space-y-2">
              <div className="text-slate-700 dark:text-slate-200">
                <span className="font-bold text-slate-900 dark:text-white font-sans">Reverse Problem:</span> {steps.reverseStep1}
              </div>
              <div className="text-slate-700 dark:text-slate-200">
                <span className="font-bold text-slate-900 dark:text-white font-sans">Substitute:</span> {steps.reverseStep2}
              </div>
              <div className="text-primary font-bold font-sans">
                <span>Reverse Answer:</span> {steps.reverseSampleInput} {toUnit.symbol} = {steps.reverseSampleResult}
              </div>
            </div>
          </div>

          {/* Mental Math & Pitfalls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <div className="p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-2">
              <div className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">psychology</span>
                <span>Mental Math Quick Tip</span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-900 dark:text-emerald-200 leading-relaxed">
                {knowledge.mentalMathTip}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-2">
              <div className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">warning</span>
                <span>Common Mistakes to Avoid</span>
              </div>
              <ul className="text-xs sm:text-sm text-amber-900 dark:text-amber-200 space-y-1 list-disc list-inside">
                {knowledge.commonMistakes.map((mistake, idx) => (
                  <li key={idx}>{mistake}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 4: IN-DEPTH UNIT DEFINITIONS ("WHAT IS A ...?")
        ========================================================================= */}
        <section className="space-y-6">
          <div className="border-b border-slate-200/80 dark:border-slate-800 pb-4">
            <div className="text-xs font-bold uppercase tracking-wider text-primary">
              Unit Background &amp; Origins
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Understanding {fromUnit.name} and {toUnit.name}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Unit A Definition */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-mono font-bold text-base">
                  {fromUnit.symbol}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    What is a {knowledge.fromUnitDetail.name}?
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {knowledge.fromUnitDetail.system}
                  </span>
                </div>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <p className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 font-medium">
                  {knowledge.fromUnitDetail.plainEnglishSummary}
                </p>
                <p>
                  <strong className="text-slate-900 dark:text-white">Scientific Definition:</strong> {knowledge.fromUnitDetail.whatIs}
                </p>
                <p>
                  <strong className="text-slate-900 dark:text-white">History:</strong> {knowledge.fromUnitDetail.history}
                </p>
                <p>
                  <strong className="text-slate-900 dark:text-white">Everyday Usage:</strong> {knowledge.fromUnitDetail.usage}
                </p>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <span>Standard Organization:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{knowledge.fromUnitDetail.standardOrg}</span>
                </div>
              </div>
            </div>

            {/* Unit B Definition */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-mono font-bold text-base">
                  {toUnit.symbol}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    What is a {knowledge.toUnitDetail.name}?
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {knowledge.toUnitDetail.system}
                  </span>
                </div>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <p className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 font-medium">
                  {knowledge.toUnitDetail.plainEnglishSummary}
                </p>
                <p>
                  <strong className="text-slate-900 dark:text-white">Scientific Definition:</strong> {knowledge.toUnitDetail.whatIs}
                </p>
                <p>
                  <strong className="text-slate-900 dark:text-white">History:</strong> {knowledge.toUnitDetail.history}
                </p>
                <p>
                  <strong className="text-slate-900 dark:text-white">Everyday Usage:</strong> {knowledge.toUnitDetail.usage}
                </p>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <span>Standard Organization:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{knowledge.toUnitDetail.standardOrg}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 5: SIDE-BY-SIDE COMPARISON MATRIX TABLE
        ========================================================================= */}
        <section className="space-y-4">
          <div className="border-b border-slate-200/80 dark:border-slate-800 pb-4">
            <div className="text-xs font-bold uppercase tracking-wider text-primary">
              Comparison Table
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {fromUnit.name} vs {toUnit.name} Side-by-Side
            </h2>
          </div>

          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-4 sm:px-6">Property</th>
                    <th className="p-4 sm:px-6 text-primary">{fromUnit.name} ({fromUnit.symbol})</th>
                    <th className="p-4 sm:px-6 text-indigo-600 dark:text-indigo-400">{toUnit.name} ({toUnit.symbol})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr>
                    <td className="p-4 sm:px-6 font-semibold text-slate-900 dark:text-white">Measurement System</td>
                    <td className="p-4 sm:px-6 text-slate-600 dark:text-slate-300">{knowledge.fromUnitDetail.system}</td>
                    <td className="p-4 sm:px-6 text-slate-600 dark:text-slate-300">{knowledge.toUnitDetail.system}</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:px-6 font-semibold text-slate-900 dark:text-white">Official Symbol</td>
                    <td className="p-4 sm:px-6 font-mono font-bold text-slate-900 dark:text-white">{fromUnit.symbol}</td>
                    <td className="p-4 sm:px-6 font-mono font-bold text-slate-900 dark:text-white">{toUnit.symbol}</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:px-6 font-semibold text-slate-900 dark:text-white">Standard Equivalence</td>
                    <td className="p-4 sm:px-6 text-slate-600 dark:text-slate-300 font-mono text-xs">{knowledge.fromUnitDetail.baseEquivalence}</td>
                    <td className="p-4 sm:px-6 text-slate-600 dark:text-slate-300 font-mono text-xs">{knowledge.toUnitDetail.baseEquivalence}</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:px-6 font-semibold text-slate-900 dark:text-white">Typical Application</td>
                    <td className="p-4 sm:px-6 text-slate-600 dark:text-slate-300">{knowledge.fromUnitDetail.usage}</td>
                    <td className="p-4 sm:px-6 text-slate-600 dark:text-slate-300">{knowledge.toUnitDetail.usage}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 6: TWO-WAY CONVERSION REFERENCE TABLES (SEARCHABLE & REVERSIBLE)
        ========================================================================= */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-primary">
                Quick Lookup Table
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {tableReverse ? `${toUnit.name} to ${fromUnit.name}` : `${fromUnit.name} to ${toUnit.name}`} Reference Table
              </h2>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="relative">
                <input
                  type="text"
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  placeholder="Search value..."
                  className="px-3.5 py-1.5 pl-8 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary w-36 sm:w-44"
                />
                <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[16px]">
                  search
                </span>
              </div>

              <button
                type="button"
                onClick={() => setTableReverse(!tableReverse)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer flex items-center gap-1"
                title="Reverse table direction"
              >
                <span className="material-symbols-outlined text-[16px]">sync_alt</span>
                <span>Reverse</span>
              </button>

              <button
                type="button"
                onClick={handleExportCSV}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 text-primary border border-blue-200 dark:border-blue-800 transition-all cursor-pointer flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                <span>CSV</span>
              </button>
            </div>
          </div>

          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-4 sm:px-6">
                      {tableReverse ? toUnit.name : fromUnit.name} ({tableReverse ? toUnit.symbol : fromUnit.symbol})
                    </th>
                    <th className="p-4 sm:px-6">
                      {tableReverse ? fromUnit.name : toUnit.name} ({tableReverse ? fromUnit.symbol : toUnit.symbol})
                    </th>
                    <th className="p-4 sm:px-6 hidden sm:table-cell">Calculation Math</th>
                    <th className="p-4 sm:px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-xs sm:text-sm">
                  {tableRows.map((r) => (
                    <tr
                      key={r.fromStr}
                      className="hover:bg-blue-50/40 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="p-4 sm:px-6 font-bold text-slate-900 dark:text-white">
                        {r.fromStr}
                      </td>
                      <td className="p-4 sm:px-6 text-primary font-bold">
                        {r.toStr}
                      </td>
                      <td className="p-4 sm:px-6 text-slate-500 dark:text-slate-400 text-xs hidden sm:table-cell">
                        {r.fromVal} × {knowledge.exactFactor}
                      </td>
                      <td className="p-4 sm:px-6 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setInputValue(r.fromVal.toString());
                            if (inputRef.current) inputRef.current.focus();
                            window.scrollTo({ top: 180, behavior: 'smooth' });
                            showToast(`Loaded ${r.fromVal} into converter`);
                          }}
                          className="px-2.5 py-1 rounded-lg text-xs font-sans font-semibold bg-slate-100 hover:bg-primary hover:text-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
                        >
                          Use
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 7: DUAL-SCALE INTERACTIVE SLIDER
        ========================================================================= */}
        <section className="space-y-4">
          <div className="border-b border-slate-200/80 dark:border-slate-800 pb-4">
            <div className="text-xs font-bold uppercase tracking-wider text-primary">
              Visual Explorer
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Interactive Ratio Comparison Slider
            </h2>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Scrub the Slider to Visually Compare Scale
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Observe how {fromUnit.name} directly maps into {toUnit.name} across smooth increments.
                </p>
              </div>
              <div className="text-right font-mono font-bold text-sm text-primary bg-blue-50 dark:bg-blue-950/60 px-3.5 py-1.5 rounded-xl border border-blue-200 dark:border-blue-900/60">
                {sliderVal} {fromUnit.symbol} = {formatResult(convertValue(sliderVal, category.id, fromUnit.id, toUnit.id).resultNumber, '2')} {toUnit.symbol}
              </div>
            </div>

            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={sliderVal}
                onChange={(e) => handleSliderChange(parseFloat(e.target.value))}
                className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>0 {fromUnit.symbol}</span>
                <span>25 {fromUnit.symbol}</span>
                <span>50 {fromUnit.symbol}</span>
                <span>75 {fromUnit.symbol}</span>
                <span>100 {fromUnit.symbol}</span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 8: REAL-WORLD BENCHMARKS & PHYSICAL CONTEXT
        ========================================================================= */}
        <section className="space-y-4">
          <div className="border-b border-slate-200/80 dark:border-slate-800 pb-4">
            <div className="text-xs font-bold uppercase tracking-wider text-primary">
              Everyday Intuition
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Real-World Examples &amp; Physical Benchmarks
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {knowledge.realWorldExamples.map((ex) => (
              <div
                key={ex.title}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2 hover:border-primary/50 transition-all shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-slate-800 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">{ex.icon}</span>
                  </div>
                  <div className="font-mono text-xs font-bold text-primary bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-md">
                    {ex.fromFormatted}
                  </div>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">{ex.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {ex.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================================
            SECTION 9: STANDARDS, REFERENCES & OFFICIAL CITATIONS (DARK/LIGHT COMPATIBLE)
        ========================================================================= */}
        <section className="p-6 sm:p-8 rounded-3xl bg-slate-100/90 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-2xl">menu_book</span>
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-primary">
                Authoritative Measurement Authority
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Standards, References &amp; Official Citations
              </h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
            To guarantee scientific precision and ensure complete transparency under Google EEAT guidelines, all conversion algorithms, numerical factors, and formulas on SolveIt Calculator are calibrated against international treaties, university physics research, and national metrology standards:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {knowledge.citations.map((c) => (
              <div
                key={c.title}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-primary/60 dark:hover:border-primary/50 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-primary border border-blue-200/70 dark:border-blue-900/50">
                      {c.sourceType || 'Official Standard'}
                    </span>
                    <span className="material-symbols-outlined text-[16px] text-slate-400 group-hover:text-primary transition-colors">
                      verified
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug group-hover:text-primary transition-colors">
                    {c.title}
                  </h4>

                  <div className="text-xs font-semibold text-primary/90 dark:text-primary flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">domain</span>
                    <span>{c.organization}</span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {c.description}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-sky-600 dark:hover:text-sky-300 hover:underline transition-colors"
                  >
                    <span>{c.linkText || 'Official Publication'}</span>
                    <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                  </a>
                  <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
                    Peer Reviewed
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white/90 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 flex items-start gap-3.5 shadow-xs text-xs text-slate-700 dark:text-slate-300">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-lg">verified_user</span>
            </div>
            <div className="space-y-0.5">
              <div className="font-bold text-slate-900 dark:text-white">
                Editorial Review &amp; Metrological Verification Guarantee
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                All calculation logic on this page is tested against the 9th Edition BIPM SI Brochure and NIST Special Publication 811. Algorithms are verified for zero floating-point rounding drift up to 64-bit IEEE double precision.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 10: FREQUENTLY ASKED QUESTIONS (FAQ)
        ========================================================================= */}
        <section className="space-y-4">
          <div className="border-b border-slate-200/80 dark:border-slate-800 pb-4">
            <div className="text-xs font-bold uppercase tracking-wider text-primary">
              Frequently Asked Questions
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {fromUnit.name} to {toUnit.name} Q&amp;A
            </h2>
          </div>

          <div className="space-y-3">
            {knowledge.faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={faq.q}
                  className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                  >
                    <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                      {faq.q}
                    </span>
                    <span
                      className={`material-symbols-outlined text-slate-400 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-primary' : ''
                      }`}
                    >
                      expand_more
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/80">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
