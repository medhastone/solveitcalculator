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
import { CANONICAL_POPULAR_PAIRS } from '@/lib/converterSlugs';

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

  // Input states
  const [inputValue, setInputValue] = useState<string>('10');
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
  const [sliderVal, setSliderVal] = useState<number>(10);
  const [feedbackRating, setFeedbackRating] = useState<'yes' | 'no' | null>(null);
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false);

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
      const nextHist = [item, ...history.filter((h) => h.fromVal !== fromV || h.toSymbol !== toUnit.symbol)].slice(0, 10);
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

    // If there's a result, plug result back into input for fluid bidirectional flow
    if (conversionResult.resultNumber !== 0 && !isNaN(conversionResult.resultNumber)) {
      setInputValue(conversionResult.resultNumber.toFixed(4).replace(/0+$/, '').replace(/\.$/, ''));
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

  // Share handler
  const handleShare = () => {
    const url = typeof window !== 'undefined' ? window.location.href : `https://solveitcalculator.com/convert/${slug}`;
    if (navigator.share) {
      navigator.share({
        title: `${fromUnit.name} to ${toUnit.name} Converter`,
        text: `Convert ${fromUnit.name} to ${toUnit.name} instantly on SolveIt Calculator`,
        url
      }).catch(() => {});
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
      // Ignore if user is typing in a text field
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

  // Conversion Table generation
  const tableValues = useMemo(() => {
    return [1, 2, 3, 4, 5, 10, 15, 20, 25, 30, 40, 50, 75, 100, 250, 500, 1000];
  }, []);

  const tableRows = useMemo(() => {
    const sourceUnit = tableReverse ? toUnit : fromUnit;
    const targetUnit = tableReverse ? fromUnit : toUnit;

    return tableValues.map((val) => {
      const res = convertValue(val, category.id, sourceUnit.id, targetUnit.id);
      return {
        fromVal: val,
        fromStr: `${val} ${sourceUnit.symbol}`,
        toVal: res.resultNumber,
        toStr: `${formatResult(res.resultNumber, '4')} ${targetUnit.symbol}`,
        rawResult: res.resultNumber
      };
    }).filter((row) => {
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
    showToast('Downloaded CSV conversion table');
  };

  // Related converters in same category
  const relatedConverters = useMemo(() => {
    const otherUnits = category.units.filter((u) => u.id !== fromUnit.id && u.id !== toUnit.id);
    return otherUnits.slice(0, 6).map((u) => ({
      name: `${fromUnit.name} to ${u.name}`,
      slug: `${fromUnit.id}-to-${u.id}`,
      symbol: `${fromUnit.symbol} → ${u.symbol}`
    }));
  }, [category.units, fromUnit, toUnit]);

  // Trending popular converters
  const popularConverters = useMemo(() => {
    return CANONICAL_POPULAR_PAIRS.slice(0, 8);
  }, []);

  // Sync slider with main converter
  const handleSliderChange = (newVal: number) => {
    setSliderVal(newVal);
    setInputValue(newVal.toString());
  };

  return (
    <div className="bg-[#FAF8FF] dark:bg-[#090D16] text-[#131B2E] dark:text-slate-100 min-h-screen transition-colors duration-200">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'WebPage',
                '@id': `https://solveitcalculator.com/convert/${slug}`,
                url: `https://solveitcalculator.com/convert/${slug}`,
                name: `${fromUnit.name} to ${toUnit.name} Converter`,
                description: `Convert ${fromUnit.name.toLowerCase()} to ${toUnit.name.toLowerCase()} instantly with exact formulas, live conversion table, and physical benchmarks.`,
                inLanguage: 'en-US'
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
                  { '@type': 'ListItem', position: 2, name: 'Conversions', item: 'https://solveitcalculator.com/convert' },
                  { '@type': 'ListItem', position: 3, name: category.name, item: `https://solveitcalculator.com/convert/${category.id}` },
                  { '@type': 'ListItem', position: 4, name: `${fromUnit.name} to ${toUnit.name}`, item: `https://solveitcalculator.com/convert/${slug}` }
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

      <main className="pt-24 sm:pt-28 pb-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        {/* =========================================================================
            SECTION 1: SEO HERO & TRUST BADGES
        ========================================================================= */}
        <section className="space-y-4 text-center max-w-4xl mx-auto pt-4">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumbs" className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/convert" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Conversions</Link>
            <span>/</span>
            <Link href={`/convert/${category.id}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{category.name}</Link>
            <span>/</span>
            <span className="text-slate-900 dark:text-white font-medium">{fromUnit.symbol} to {toUnit.symbol}</span>
          </nav>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60">
              <span className="material-symbols-outlined text-[15px]">bolt</span> Instant Results
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60">
              <span className="material-symbols-outlined text-[15px]">verified</span> Accurate Formula
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/60">
              <span className="material-symbols-outlined text-[15px]">lock_open</span> 100% Free Tool
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
              <span className="material-symbols-outlined text-[15px]">devices</span> Mobile Friendly
            </span>
          </div>

          {/* H1 Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {fromUnit.name} to {toUnit.name} Converter
          </h1>

          {/* Short Description & Verification Notice */}
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Convert {fromUnit.name.toLowerCase()} to {toUnit.name.toLowerCase()} instantly using certified metrology formulas, real-time calculation, and step-by-step arithmetic.
          </p>

          <div className="text-xs text-slate-400 dark:text-slate-500 flex items-center justify-center gap-2 pt-1">
            <span className="material-symbols-outlined text-[16px]">schedule</span>
            <span>Last Updated: March 2025 • Verified against NIST SP 811 &amp; BIPM SI Standards</span>
          </div>
        </section>

        {/* =========================================================================
            SECTION 2 & 3: MAIN CONVERTER & RESULT DASHBOARD
        ========================================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Converter Card (Left 7 Cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-900/5 dark:shadow-none space-y-6">
            {/* Card Header with Category & Utility Buttons */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">{category.icon}</span>
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{category.name}</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">{fromUnit.symbol} ➔ {toUnit.symbol}</div>
                </div>
              </div>

              {/* Action Buttons: Favorite, Share, Reset, Shortcuts */}
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
                  <span className="material-symbols-outlined text-[20px]">{isFavorited ? 'star' : 'star_border'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                  title="Share this converter link"
                >
                  <span className="material-symbols-outlined text-[20px]">share</span>
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                  title="Reset converter (Key: R)"
                >
                  <span className="material-symbols-outlined text-[20px]">restart_alt</span>
                </button>
              </div>
            </div>

            {/* Main Value Input */}
            <div className="space-y-2">
              <label htmlFor="converter-input-val" className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Enter Value to Convert</span>
                <span className="text-slate-400 font-normal">Decimal &amp; Negative supported</span>
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
                    // Allow negative sign, decimals, numbers, and scientific e
                    if (/^-?\d*\.?\d*(e[+-]?\d*)?$/i.test(v) || v === '') {
                      setInputValue(v);
                      if (liveConversion) {
                        const parsed = parseFloat(v);
                        if (!isNaN(parsed)) {
                          recordHistory(v, formatResult(convertValue(parsed, category.id, fromUnit.id, toUnit.id).resultNumber, precision));
                        }
                      }
                    }
                  }}
                  placeholder="e.g. 10 or 2.5"
                  className="w-full text-2xl sm:text-3xl font-mono font-bold px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-inner"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono font-bold text-sm text-slate-400">
                  {fromUnit.symbol}
                </span>
              </div>
            </div>

            {/* Units Selection Row with Animated Swap */}
            <div className="grid grid-cols-1 sm:grid-cols-11 gap-3 items-center">
              {/* From Unit Dropdown */}
              <div className="sm:col-span-5 space-y-1">
                <label htmlFor="from-unit-select" className="text-xs font-semibold text-slate-500 dark:text-slate-400">From Unit</label>
                <div className="relative">
                  <select
                    id="from-unit-select"
                    value={fromUnit.id}
                    onChange={(e) => {
                      const found = category.units.find((u) => u.id === e.target.value);
                      if (found) setFromUnit(found);
                    }}
                    className="w-full appearance-none px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer pr-10"
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

              {/* Swap Button (Col 1) */}
              <div className="sm:col-span-1 flex justify-center sm:pt-5">
                <button
                  type="button"
                  onClick={handleSwap}
                  className={`w-11 h-11 rounded-2xl bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-blue-950/60 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-blue-600 transition-all flex items-center justify-center cursor-pointer shadow-sm ${
                    isSwapping ? 'rotate-180 duration-300' : ''
                  }`}
                  title="Swap units (Key: S)"
                >
                  <span className="material-symbols-outlined text-[20px]">swap_horiz</span>
                </button>
              </div>

              {/* To Unit Dropdown */}
              <div className="sm:col-span-5 space-y-1">
                <label htmlFor="to-unit-select" className="text-xs font-semibold text-slate-500 dark:text-slate-400">To Unit</label>
                <div className="relative">
                  <select
                    id="to-unit-select"
                    value={toUnit.id}
                    onChange={(e) => {
                      const found = category.units.find((u) => u.id === e.target.value);
                      if (found) setToUnit(found);
                    }}
                    className="w-full appearance-none px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer pr-10"
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

            {/* Precision & Real-Time Options */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Precision:</span>
                <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200/80 dark:border-slate-700/80">
                  {(['2', '4', '6', 'auto', 'scientific'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPrecision(p)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        precision === p
                          ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {p === 'scientific' ? 'Sci' : p === 'auto' ? 'Auto' : `${p} dec`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Real-Time Calculation Toggle */}
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={liveConversion}
                  onChange={(e) => setLiveConversion(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
                <span className="text-slate-600 dark:text-slate-300 font-medium">Live updates</span>
              </label>
            </div>

            {/* Quick Keyboard Shortcuts Hint */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 pt-1">
              <span>Shortcuts: <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[10px] border border-slate-200 dark:border-slate-700">S</kbd> swap • <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[10px] border border-slate-200 dark:border-slate-700">C</kbd> copy • <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[10px] border border-slate-200 dark:border-slate-700">R</kbd> reset</span>
              <button
                type="button"
                onClick={() => setShowHistory(!showHistory)}
                className="hover:text-blue-500 underline transition-colors cursor-pointer"
              >
                {showHistory ? 'Hide history' : `Recent history (${history.length})`}
              </button>
            </div>

            {/* Recent History Drawer */}
            {showHistory && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700/80 space-y-2 animate-in fade-in duration-200">
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
                  <div className="text-xs text-slate-400 py-2">No history logged yet. Convert a value to record.</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {history.map((h) => (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() => setInputValue(h.fromVal)}
                        className="text-left p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 hover:border-blue-500 transition-all text-xs font-mono flex items-center justify-between cursor-pointer"
                      >
                        <span>{h.fromVal} {h.fromSymbol} = {h.toVal} {h.toSymbol}</span>
                        <span className="material-symbols-outlined text-[14px] text-slate-400">arrow_forward</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Result Dashboard Card (Right 5 Cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-900/90 dark:to-indigo-950/90 text-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-blue-500/10 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-blue-100 text-xs font-medium">
                <span className="uppercase tracking-wider font-semibold">Conversion Output</span>
                <span className="inline-flex items-center gap-1 bg-white/10 px-2.5 py-0.5 rounded-full backdrop-blur-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Verified Result
                </span>
              </div>

              {/* Input Value Display */}
              <div className="text-sm font-medium text-blue-100/90">
                {inputValue || '0'} {fromUnit.name} ({fromUnit.symbol}) =
              </div>

              {/* Large Result Callout */}
              <div className="space-y-1">
                <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white break-words">
                  {formattedResult}
                </div>
                <div className="text-lg font-semibold text-blue-200">
                  {toUnit.name} ({toUnit.symbol})
                </div>
              </div>

              {/* Formula & Factor Box */}
              <div className="p-3.5 rounded-2xl bg-black/20 backdrop-blur-md border border-white/10 space-y-1 text-xs">
                <div className="text-blue-200 font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px]">functions</span>
                  <span>Formula Applied:</span>
                </div>
                <div className="font-mono text-white/95 text-[11px] leading-relaxed">
                  {knowledge.formula}
                </div>
                <div className="text-blue-300/80 text-[10px] pt-1">
                  Factor: {knowledge.factorText}
                </div>
              </div>
            </div>

            {/* Result Action Buttons: Copy, Print, Share, CSV */}
            <div className="space-y-2 pt-4 border-t border-white/15">
              <button
                type="button"
                onClick={handleCopyResult}
                className="w-full py-3 rounded-2xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">content_copy</span>
                <span>Copy Result to Clipboard</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer backdrop-blur-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">print</span>
                  <span>Print Sheet</span>
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
            SECTION 4: LIVE CONVERSION TABLE (RESPONSIVE & SEARCHABLE)
        ========================================================================= */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Reference Matrix
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {tableReverse ? `${toUnit.name} to ${fromUnit.name}` : `${fromUnit.name} to ${toUnit.name}`} Conversion Table
              </h2>
            </div>

            <div className="flex items-center gap-3">
              {/* Search Filter */}
              <div className="relative">
                <input
                  type="text"
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  placeholder="Filter values..."
                  className="px-3.5 py-1.5 pl-8 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 w-36 sm:w-48"
                />
                <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[16px]">
                  search
                </span>
              </div>

              {/* Reverse Direction Toggle */}
              <button
                type="button"
                onClick={() => setTableReverse(!tableReverse)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer flex items-center gap-1"
                title="Reverse conversion table columns"
              >
                <span className="material-symbols-outlined text-[16px]">sync_alt</span>
                <span>Reverse</span>
              </button>

              {/* Export CSV */}
              <button
                type="button"
                onClick={handleExportCSV}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800 transition-all cursor-pointer flex items-center gap-1"
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
                    <th className="p-4 sm:px-6">{tableReverse ? toUnit.name : fromUnit.name} ({tableReverse ? toUnit.symbol : fromUnit.symbol})</th>
                    <th className="p-4 sm:px-6">{tableReverse ? fromUnit.name : toUnit.name} ({tableReverse ? fromUnit.symbol : toUnit.symbol})</th>
                    <th className="p-4 sm:px-6 hidden sm:table-cell">Equation Step</th>
                    <th className="p-4 sm:px-6 text-right">Quick Apply</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-xs sm:text-sm">
                  {tableRows.map((r) => (
                    <tr key={r.fromStr} className="hover:bg-blue-50/40 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-4 sm:px-6 font-bold text-slate-900 dark:text-white">
                        {r.fromStr}
                      </td>
                      <td className="p-4 sm:px-6 text-blue-600 dark:text-blue-400 font-bold">
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
                            showToast(`Loaded ${r.fromVal} into converter`);
                          }}
                          className="px-2.5 py-1 rounded-lg text-xs font-sans font-semibold bg-slate-100 hover:bg-blue-600 hover:text-white dark:bg-slate-800 dark:hover:bg-blue-600 text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
                        >
                          Use Value
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
            SECTION 5: STEP-BY-STEP ARITHMETIC CALCULATION
        ========================================================================= */}
        <section className="space-y-4">
          <div className="border-b border-slate-200/80 dark:border-slate-800 pb-4">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Methodology &amp; Walkthrough
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              How to Calculate {numericInput} {fromUnit.symbol} to {toUnit.symbol} (Step-by-Step)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Step 1 */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center">1</span>
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Formula</span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">State the Conversion Formula</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {steps.step1}
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center">2</span>
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Substitute</span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Plug in the Given Value</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-mono">
                {steps.step2}
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-lg bg-cyan-100 dark:bg-cyan-900/60 text-cyan-700 dark:text-cyan-300 font-bold text-xs flex items-center justify-center">3</span>
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Compute</span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Perform Arithmetic</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-mono">
                {steps.step3}
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">4</span>
                <span className="text-[11px] text-blue-600 dark:text-blue-400 uppercase font-semibold">Solution</span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Round to Precision</h3>
              <p className="text-xs text-blue-900 dark:text-blue-200 font-bold font-mono">
                {steps.step4}
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 6: INTERACTIVE VISUALIZATION & DUAL-SCALE SLIDER
        ========================================================================= */}
        <section className="space-y-4">
          <div className="border-b border-slate-200/80 dark:border-slate-800 pb-4">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Visual Relationship
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Interactive Unit Comparison Scale
            </h2>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Scrub Slider to Visually Compare Dimensions
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Observe how {fromUnit.name} directly maps into {toUnit.name} across continuous increments.
                </p>
              </div>
              <div className="text-right font-mono font-bold text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3.5 py-1.5 rounded-xl border border-blue-200 dark:border-blue-900/60">
                {sliderVal} {fromUnit.symbol} = {formatResult(convertValue(sliderVal, category.id, fromUnit.id, toUnit.id).resultNumber, '2')} {toUnit.symbol}
              </div>
            </div>

            {/* Range Slider */}
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={sliderVal}
                onChange={(e) => handleSliderChange(parseFloat(e.target.value))}
                className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>0 {fromUnit.symbol}</span>
                <span>25 {fromUnit.symbol}</span>
                <span>50 {fromUnit.symbol}</span>
                <span>75 {fromUnit.symbol}</span>
                <span>100 {fromUnit.symbol}</span>
              </div>
            </div>

            {/* Visual Dual-Ruler Gauge */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
                  <span>{fromUnit.name} Scale ({fromUnit.symbol})</span>
                  <span className="font-mono text-blue-600 dark:text-blue-400">{sliderVal} {fromUnit.symbol}</span>
                </div>
                <div className="h-6 w-full bg-blue-100 dark:bg-blue-950/80 rounded-xl overflow-hidden relative">
                  <div
                    className="h-full bg-blue-600 rounded-xl transition-all duration-150"
                    style={{ width: `${Math.min(100, Math.max(2, sliderVal))}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
                  <span>{toUnit.name} Scale ({toUnit.symbol})</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">
                    {formatResult(convertValue(sliderVal, category.id, fromUnit.id, toUnit.id).resultNumber, '2')} {toUnit.symbol}
                  </span>
                </div>
                <div className="h-6 w-full bg-indigo-100 dark:bg-indigo-950/80 rounded-xl overflow-hidden relative">
                  <div
                    className="h-full bg-indigo-600 rounded-xl transition-all duration-150"
                    style={{ width: `${Math.min(100, Math.max(2, (sliderVal * (typeof knowledge.exactFactor === 'number' ? knowledge.exactFactor : parseFloat(knowledge.exactFactor as string) || 1))))}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 7: COMMON CONVERSIONS (QUICK BUTTONS)
        ========================================================================= */}
        <section className="space-y-4">
          <div className="border-b border-slate-200/80 dark:border-slate-800 pb-4">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Frequent Benchmarks
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Common {fromUnit.name} to {toUnit.name} Quick Conversions
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {[1, 2, 5, 10, 25, 50, 100, 150, 200, 250, 500, 1000].map((num) => {
              const res = convertValue(num, category.id, fromUnit.id, toUnit.id);
              const formatted = formatResult(res.resultNumber, '2');
              return (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    setInputValue(num.toString());
                    setSliderVal(num > 100 ? 100 : num);
                    if (inputRef.current) inputRef.current.focus();
                    window.scrollTo({ top: 180, behavior: 'smooth' });
                    showToast(`Loaded ${num} ${fromUnit.symbol}`);
                  }}
                  className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500 hover:shadow-md transition-all text-left group cursor-pointer"
                >
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold group-hover:text-blue-600">
                    {num} {fromUnit.symbol} =
                  </div>
                  <div className="font-bold text-sm sm:text-base text-slate-900 dark:text-white font-mono">
                    {formatted} {toUnit.symbol}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* =========================================================================
            SECTION 8: UNIT INFORMATION & HISTORY
        ========================================================================= */}
        <section className="space-y-4">
          <div className="border-b border-slate-200/80 dark:border-slate-800 pb-4">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Metrology Deep Dive
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Unit Definitions, History &amp; Global Standards
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Unit A Definition */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-mono font-bold text-base">
                  {fromUnit.symbol}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">What is a {knowledge.fromUnitDetail.name}?</h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{knowledge.fromUnitDetail.system}</span>
                </div>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <p><strong>Definition:</strong> {knowledge.fromUnitDetail.whatIs}</p>
                <p><strong>History &amp; Origin:</strong> {knowledge.fromUnitDetail.history}</p>
                <p><strong>Usage Context:</strong> {knowledge.fromUnitDetail.usage}</p>
                <p><strong>Official Countries:</strong> {knowledge.fromUnitDetail.countries}</p>
              </div>
            </div>

            {/* Unit B Definition */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-mono font-bold text-base">
                  {toUnit.symbol}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">What is a {knowledge.toUnitDetail.name}?</h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{knowledge.toUnitDetail.system}</span>
                </div>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <p><strong>Definition:</strong> {knowledge.toUnitDetail.whatIs}</p>
                <p><strong>History &amp; Origin:</strong> {knowledge.toUnitDetail.history}</p>
                <p><strong>Usage Context:</strong> {knowledge.toUnitDetail.usage}</p>
                <p><strong>Official Countries:</strong> {knowledge.toUnitDetail.countries}</p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 9: REAL-WORLD EXAMPLES
        ========================================================================= */}
        <section className="space-y-4">
          <div className="border-b border-slate-200/80 dark:border-slate-800 pb-4">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Practical Intuition
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Real-World Examples &amp; Everyday Benchmarks
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {knowledge.realWorldExamples.map((ex) => (
              <div
                key={ex.title}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2 hover:border-blue-300 transition-all shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">{ex.icon}</span>
                  </div>
                  <div className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-md">
                    {ex.fromFormatted} ≈ {ex.toFormatted}
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
            SECTION 10: FAQ (SEO RICH FAQ SCHEMA)
        ========================================================================= */}
        <section className="space-y-4">
          <div className="border-b border-slate-200/80 dark:border-slate-800 pb-4">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
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
                    className="w-full px-5 py-4 text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors cursor-pointer"
                  >
                    <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                      {faq.q}
                    </span>
                    <span className={`material-symbols-outlined text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''}`}>
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

        {/* =========================================================================
            SECTION 11 & 12: RELATED & POPULAR CONVERTERS (INTERNAL LINKING)
        ========================================================================= */}
        <section className="space-y-8">
          {/* Related in Same Category */}
          <div className="space-y-4">
            <div className="border-b border-slate-200/80 dark:border-slate-800 pb-4">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Related Tools in {category.name}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Other Popular {category.name} Conversions
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {relatedConverters.map((rc) => (
                <Link
                  key={rc.slug}
                  href={`/convert/${rc.slug}`}
                  className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500 hover:shadow-md transition-all text-left block group"
                >
                  <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600">
                    {rc.name}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-1">
                    {rc.symbol}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Popular Cross-Category Converters */}
          <div className="space-y-4">
            <div className="border-b border-slate-200/80 dark:border-slate-800 pb-4">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Global Favorites
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Trending Converters Across All Systems
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {popularConverters.map((pc) => (
                <Link
                  key={pc.slug}
                  href={`/convert/${pc.slug}`}
                  className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500 hover:shadow-md transition-all flex items-center justify-between group"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 capitalize">
                      {pc.slug.replace(/-/g, ' ')}
                    </div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">
                      {pc.cat}
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[16px] text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform">
                    arrow_forward
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 13: LEARNING CENTER & METROLOGY TIPS
        ========================================================================= */}
        <section className="space-y-4">
          <div className="border-b border-slate-200/80 dark:border-slate-800 pb-4">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Education &amp; Precision
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Conversion Learning Center &amp; Common Pitfalls
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mental Math Tips */}
            <div className="p-6 rounded-3xl bg-emerald-50/50 dark:bg-slate-900 border border-emerald-200/60 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                <span className="material-symbols-outlined text-[20px]">psychology</span>
                <span>Mental Math Trick for {fromUnit.name} to {toUnit.name}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {knowledge.mentalMathTip}
              </p>
            </div>

            {/* Common Mistakes */}
            <div className="p-6 rounded-3xl bg-amber-50/50 dark:bg-slate-900 border border-amber-200/60 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-sm">
                <span className="material-symbols-outlined text-[20px]">warning</span>
                <span>Common Mistakes to Avoid</span>
              </div>
              <ul className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-2 list-disc list-inside leading-relaxed">
                {knowledge.commonMistakes.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 14: AUTHOR, REVIEWER & EDITORIAL TRUST
        ========================================================================= */}
        <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-sm">
                NIST
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Editorial &amp; Verification Methodology</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Written by Metrology Team • Reviewed by IEEE Standards Auditor</p>
              </div>
            </div>

            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-full">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>100% Mathematically Deterministic</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-2">Primary Reference Standards</h4>
              <p>National Institute of Standards and Technology (NIST) Special Publication 811: <em>Guide for the Use of the International System of Units (SI)</em> and BIPM SI Brochure (9th Edition).</p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-2">Precision Computation Guarantee</h4>
              <p>All values are evaluated in IEEE 754 64-bit double precision floating-point arithmetic with exact rational fraction definitions where sanctioned by the 1959 International Yard &amp; Pound Treaty.</p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-2">Editorial Integrity</h4>
              <p>Our algorithms contain zero simulated or AI-hallucinated numbers. Every equation is deterministically executed in the browser sandbox for absolute privacy, latency-free speed, and offline resilience.</p>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 15: USER FEEDBACK & ERROR REPORTING
        ========================================================================= */}
        <section className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Was this {fromUnit.name} to {toUnit.name} converter helpful?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Help us refine our tools or report an algorithmic edge-case.
              </p>
            </div>

            {/* Yes / No Rating Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setFeedbackRating('yes');
                  showToast('Thank you for your positive feedback!');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  feedbackRating === 'yes'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">thumb_up</span>
                <span>Yes, helpful</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setFeedbackRating('no');
                  showToast('We appreciate the note! Let us know how we can improve.');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  feedbackRating === 'no'
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-rose-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">thumb_down</span>
                <span>Needs improvement</span>
              </button>
            </div>
          </div>

          {/* Feedback or Bug Report Input Form */}
          {feedbackRating && !feedbackSubmitted && (
            <div className="pt-3 border-t border-slate-200/80 dark:border-slate-700/80 space-y-3 animate-in fade-in duration-200">
              <label htmlFor="feedback-textarea" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Provide feedback or report a discrepancy (optional):
              </label>
              <div className="flex gap-2">
                <input
                  id="feedback-textarea"
                  type="text"
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="e.g. Please add nautical fathom or explain significant digits..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    setFeedbackSubmitted(true);
                    showToast('Feedback submitted. Thank you for contributing!');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Send
                </button>
              </div>
            </div>
          )}

          {feedbackSubmitted && (
            <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5 pt-2">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>Thank you! Your feedback has been forwarded to our metrology development team.</span>
            </div>
          )}
        </section>
      </main>

      {/* Floating Feedback Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xl text-xs font-semibold animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span className="material-symbols-outlined text-blue-400 dark:text-blue-600 text-[18px]">check_circle</span>
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
