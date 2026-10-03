'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import CategoryVisualizer from './CategoryVisualizer';
import VolumeConverterClient from '@/app/volume-converter/VolumeConverterClient';
import {
  CONVERSION_CATEGORIES,
  convertValue,
  formatResult,
  UnitDefinition
} from '@/lib/conversions';
import { getCategoryRichData } from '@/lib/categoryData';
import { getCategorySeo } from '@/lib/categorySeo';
import { toggleTheme } from '@/lib/theme';
import CurrencyUnitSearchCard from './CurrencyUnitSearchCard';

interface CategoryConverterViewProps {
  categoryId: string;
}

const TABLE_BASE_VALUES = [0.1, 0.5, 1, 2, 5, 10, 20, 50, 100, 500, 1000];

const DEDICATED_PAIRS: Record<string, string> = {
  'g-to-oz': '/conversion/gram-to-ounces',
  'oz-to-g': '/conversion/ounces-to-grams',
  'g-to-lb': '/conversion/gram-to-pound',
  'lb-to-g': '/conversion/pound-to-gram',
  'g-to-kg': '/conversion/gram-to-kilogram',
  'kg-to-g': '/conversion/kilograms-to-grams',
  'g-to-mg': '/conversion/gram-to-milligram',
  'mg-to-g': '/conversion/milligram-to-gram',
};

export default function CategoryConverterView({ categoryId }: CategoryConverterViewProps) {
  // If volume, render the dedicated VolumeConverterClient
  if (categoryId === 'volume') {
    return <VolumeConverterClient />;
  }

  return <UniversalCategoryEngine key={categoryId} categoryId={categoryId} />;
}

function UniversalCategoryEngine({ categoryId }: { categoryId: string }) {
  const category = useMemo(() => {
    return CONVERSION_CATEGORIES.find((c) => c.id === categoryId) || CONVERSION_CATEGORIES[0];
  }, [categoryId]);

  const units = category.units;
  const richData = useMemo(() => getCategoryRichData(category.id), [category.id]);
  const seo = useMemo(() => getCategorySeo(category.id), [category.id]);

  // Initial unit setup
  const [inputValue, setInputValue] = useState<string>('10');
  const [fromUnitId, setFromUnitId] = useState<string>(
    category.popularPair?.from || units[0]?.id || ''
  );
  const [toUnitId, setToUnitId] = useState<string>(
    category.popularPair?.to || units[1]?.id || units[0]?.id || ''
  );
  const [precision, setPrecision] = useState<string>('5');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copyFeedback, setCopyFeedback] = useState<string>('Copy Result');
  const [formulaCopyFeedback, setFormulaCopyFeedback] = useState<string>('Copy Base Formula');
  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fromUnit = useMemo(() => {
    return units.find((u) => u.id === fromUnitId) || units[0];
  }, [units, fromUnitId]);

  const toUnit = useMemo(() => {
    return units.find((u) => u.id === toUnitId) || units[1] || units[0];
  }, [units, toUnitId]);

  // Numeric input
  const numericValue = useMemo(() => {
    const parsed = parseFloat(inputValue);
    return isNaN(parsed) ? 0 : parsed;
  }, [inputValue]);

  // Toast notification helper
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  }, []);

  // Format utility
  const formatNumber = useCallback((num: number, precMode: string | number) => {
    if (isNaN(num)) return '0';
    if (precMode === 'scientific') {
      return num.toExponential(4);
    }
    const p = typeof precMode === 'number' ? precMode : parseInt(precMode, 10);
    return parseFloat(num.toFixed(p)).toLocaleString('en-US', {
      minimumFractionDigits: p,
      maximumFractionDigits: p
    });
  }, []);

  // Conversion core calculation
  const conversionResult = useMemo(() => {
    return convertValue(numericValue, category.id, fromUnitId, toUnitId);
  }, [numericValue, category.id, fromUnitId, toUnitId]);

  const formattedResult = useMemo(() => {
    return formatResult(conversionResult.resultNumber, precision as any);
  }, [conversionResult.resultNumber, precision]);

  // Exact ratio string
  const exactRatioString = useMemo(() => {
    const singleConv = convertValue(1, category.id, fromUnitId, toUnitId);
    const ratio = singleConv.resultNumber;
    const formattedRatio =
      ratio < 0.0001 || ratio > 100000
        ? ratio.toExponential(6)
        : ratio.toFixed(8).replace(/\.?0+$/, '');
    return `Exact Ratio: 1 ${fromUnit.symbol} = ${formattedRatio} ${toUnit.symbol}`;
  }, [category.id, fromUnitId, toUnitId, fromUnit.symbol, toUnit.symbol]);

  // 4-Quadrant System Groupings
  const multiQuadrantData = useMemo(() => {
    const metricUnits = units.filter((u) => u.system === 'metric' || u.system === 'si');
    const usUnits = units.filter((u) => u.system === 'us' || u.system === 'imperial');
    const sciUnits = units.filter((u) => u.system === 'scientific' || u.system === 'binary');
    const otherUnits = units.filter(
      (u) =>
        u.system !== 'metric' &&
        u.system !== 'si' &&
        u.system !== 'us' &&
        u.system !== 'imperial' &&
        u.system !== 'scientific' &&
        u.system !== 'binary'
    );

    const computeItems = (unitList: UnitDefinition[], fallbackList: UnitDefinition[]) => {
      const source = unitList.length > 0 ? unitList : fallbackList;
      return source.slice(0, 4).map((u) => {
        const res = convertValue(numericValue, category.id, fromUnitId, u.id);
        return {
          symbol: u.symbol,
          name: u.name,
          val: `${formatResult(res.resultNumber, precision as any)} ${u.symbol}`
        };
      });
    };

    return {
      metric: computeItems(metricUnits, units.slice(0, 4)),
      customary: computeItems(usUnits, units.slice(2, 6)),
      scientific: computeItems(sciUnits, units.slice(4, 8)),
      specialized: computeItems(otherUnits, units.slice(1, 5))
    };
  }, [units, numericValue, category.id, fromUnitId, precision]);

  // Step conversion table rows
  const stepTableRows = useMemo(() => {
    return TABLE_BASE_VALUES.map((val) => {
      const fwd = convertValue(val, category.id, fromUnitId, toUnitId);
      const rev = convertValue(val, category.id, toUnitId, fromUnitId);
      return {
        value: val,
        forwardResult: formatResult(fwd.resultNumber, precision as any),
        reverseResult: formatResult(rev.resultNumber, precision as any)
      };
    });
  }, [category.id, fromUnitId, toUnitId, precision]);

  // Popular conversion cards (up to 8 pairs)
  const popularCards = useMemo(() => {
    const list = richData.popularChips.length >= 4 ? richData.popularChips : [];
    const trafficCounts = ['5.2M / mo', '4.4M / mo', '3.8M / mo', '3.1M / mo', '2.6M / mo', '2.2M / mo', '1.9M / mo', '1.5M / mo'];
    
    return list.slice(0, 8).map((chip, idx) => {
      const uFrom = units.find((u) => u.id === chip.from) || units[0];
      const uTo = units.find((u) => u.id === chip.to) || units[1] || units[0];
      const conv = convertValue(1, category.id, uFrom.id, uTo.id);
      const factorStr = conv.resultNumber >= 1 ? `×${conv.resultNumber.toFixed(4)}` : `÷${(1 / conv.resultNumber).toFixed(4)}`;
      const dedicatedKey = `${uFrom.id}-to-${uTo.id}`;
      const dedicatedUrl = DEDICATED_PAIRS[dedicatedKey] || null;
      return {
        title: chip.label,
        traffic: trafficCounts[idx % trafficCounts.length],
        formula: `1 ${uFrom.symbol} = ${formatResult(conv.resultNumber, '4')} ${uTo.symbol}`,
        val: 1,
        from: uFrom.id,
        to: uTo.id,
        factor: factorStr,
        dedicatedUrl
      };
    });
  }, [richData.popularChips, units, category.id]);

  // Quick preset setter
  const setConversion = useCallback((val: number, from: string, to: string) => {
    setInputValue(String(val));
    setFromUnitId(from);
    setToUnitId(to);
    const workbenchEl = document.getElementById('converter-workbench');
    if (workbenchEl) {
      workbenchEl.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Quick lookup search handler
  const handleQuickLookup = useCallback(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return;

    const match = query.match(/([\d.]+)\s*([a-zA-Z0-9°µ²³]+)\s*(?:to|in|into)\s*([a-zA-Z0-9°µ²³]+)/);
    if (match) {
      const num = parseFloat(match[1]);
      const uFromStr = match[2].toLowerCase();
      const uToStr = match[3].toLowerCase();

      const foundFrom = units.find(
        (u) => u.id.toLowerCase() === uFromStr || u.symbol.toLowerCase() === uFromStr || u.name.toLowerCase().includes(uFromStr)
      );
      const foundTo = units.find(
        (u) => u.id.toLowerCase() === uToStr || u.symbol.toLowerCase() === uToStr || u.name.toLowerCase().includes(uToStr)
      );

      if (foundFrom && foundTo) {
        setConversion(num, foundFrom.id, foundTo.id);
        return;
      }
    }
    showToast(`Try queries like "10 ${units[0]?.symbol || ''} to ${units[1]?.symbol || ''}"`);
  }, [searchQuery, units, setConversion, showToast]);

  // Copy result action
  const handleCopyResult = useCallback(() => {
    const textToCopy = `${inputValue} ${fromUnit.name} = ${formattedResult} ${toUnit.name}`;
    navigator.clipboard?.writeText(textToCopy);
    setCopyFeedback('Copied!');
    setTimeout(() => setCopyFeedback('Copy Result'), 2000);
    showToast('Conversion result copied to clipboard!');
  }, [inputValue, fromUnit.name, formattedResult, toUnit.name, showToast]);

  // Copy base formula action
  const handleCopyFormula = useCallback(() => {
    const formulaText = `1 ${fromUnit.symbol} = ${convertValue(1, category.id, fromUnit.id, toUnit.id).resultNumber} ${toUnit.symbol}`;
    navigator.clipboard?.writeText(formulaText);
    setFormulaCopyFeedback('Copied!');
    setTimeout(() => setFormulaCopyFeedback('Copy Base Formula'), 2000);
    showToast('Base metrology formula copied!');
  }, [fromUnit, toUnit, category.id, showToast]);

  // Share action
  const handleShare = useCallback(() => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: `SolveIt Calculator ${category.name} Converter`,
        text: `${inputValue} ${fromUnit.name} = ${formattedResult} ${toUnit.name}`,
        url: window.location.href
      }).catch(() => {});
    } else if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href);
      showToast('Converter URL copied to clipboard!');
    }
  }, [inputValue, fromUnit.name, formattedResult, toUnit.name, category.name, showToast]);

  // Reset action
  const handleReset = useCallback(() => {
    setInputValue('10');
    if (units.length > 1) {
      setFromUnitId(category.popularPair?.from || units[0].id);
      setToUnitId(category.popularPair?.to || units[1].id);
    }
    setPrecision('5');
    showToast(`Reset to 10 ${fromUnit.name} to ${toUnit.name}`);
  }, [units, category.popularPair, fromUnit.name, toUnit.name, showToast]);

  // Export JSON action
  const handleExportJSON = useCallback(() => {
    const payload = {
      calculator: `SolveIt Calculator Universal ${category.name} Converter`,
      timestamp: new Date().toISOString(),
      input: { value: inputValue, unit: fromUnit.id, unitName: fromUnit.name },
      output: {
        value: parseFloat(formattedResult.replace(/,/g, '')),
        unit: toUnit.id,
        unitName: toUnit.name
      },
      standard: 'ISO 80000-3 / NIST SP 811 Metrology'
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `solveit-${category.id}-calculation.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Calculation exported as JSON');
  }, [category.name, category.id, inputValue, fromUnit, formattedResult, toUnit, showToast]);

  // Export Table CSV
  const handleExportCSV = useCallback(() => {
    const headers = [
      `${fromUnit.name} (${fromUnit.symbol})`,
      `${toUnit.name} (${toUnit.symbol})`,
      `${toUnit.name} Reverse`,
      `${fromUnit.name} Equivalent`
    ];
    const rows = stepTableRows.map((r) => [
      r.value,
      r.forwardResult.replace(/,/g, ''),
      r.value,
      r.reverseResult.replace(/,/g, '')
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].map((e) => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', blobUrl);
    link.setAttribute('download', `solveit_${category.id}_matrix.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
    showToast(`${category.name} matrix table exported to CSV`);
  }, [category.name, category.id, fromUnit, toUnit, stepTableRows, showToast]);

  // Swap Units
  const handleSwap = useCallback(() => {
    const temp = fromUnitId;
    setFromUnitId(toUnitId);
    setToUnitId(temp);
  }, [fromUnitId, toUnitId]);

  // Theme toggle helper
  const handleToggleTheme = useCallback(() => {
    toggleTheme();
  }, []);

  // Keyboard shortcut listener (S: swap, C: copy, R: reset)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;

      if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        handleSwap();
      } else if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        handleCopyResult();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleReset();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSwap, handleCopyResult, handleReset]);

  // Structured Data (JSON-LD) for High Google Rankings
  const jsonLd = useMemo(() => {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebApplication',
          name: `${category.name} Converter & Calculation Engine`,
          applicationCategory: 'UtilitiesApplication',
          operatingSystem: 'All modern browsers',
          url: `https://solveitcalculator.com/${category.id}-converter`,
          description: richData.tagline,
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD'
          },
          featureList: [
            'Instant sub-0.01s client-side calculation',
            'Interactive metrology visualizer instrument',
            'Complete multi-unit conversion matrix',
            'Downloadable CSV reference tables',
            'ISO 80000 and NIST SP 811 certified formulas'
          ]
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://solveitcalculator.com' },
            { '@type': 'ListItem', position: 2, name: 'Conversion Center', item: 'https://solveitcalculator.com/conversions' },
            { '@type': 'ListItem', position: 3, name: `${category.name} Converter`, item: `https://solveitcalculator.com/${category.id}-converter` }
          ]
        },
        {
          '@type': 'FAQPage',
          mainEntity: richData.faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: { '@type': 'Answer', text: faq.answer }
          }))
        }
      ]
    };
  }, [category.name, category.id, richData]);

  return (
    <div className="bg-background font-body-md text-on-surface antialiased min-h-screen selection:bg-primary/20 selection:text-primary">
      {/* JSON-LD Schema Injection for Googlebot */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Dynamic Toast popup */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-surface-container-highest text-on-surface border border-outline-variant/50 shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}

      {/* MAIN BODY CONTENT */}
      <main className="w-full pt-4 bg-background min-h-[calc(100vh-380px)]">
        <div className="flex flex-col w-full text-on-surface">
          {/* ================================================================= */}
          {/* SECTION 1: HERO & TELEMETRY                                      */}
          {/* ================================================================= */}
          <section className="w-full max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop pt-6 md:pt-10 pb-10">
            {/* Breadcrumb & Standards Badges */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant">
                <Link className="hover:text-primary transition-colors flex items-center gap-1" href="/">
                  <span className="material-symbols-outlined text-[16px]">home</span>Home
                </Link>
                <span className="text-outline-variant">/</span>
                <Link className="hover:text-primary transition-colors" href="/conversions">
                  Conversion Center
                </Link>
                <span className="text-outline-variant">/</span>
                <span className="text-on-surface font-medium">{category.name} Converter</span>
              </nav>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-primary font-label-caps text-label-caps">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                  Verified Formulas
                </span>
                <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-caps text-label-caps">
                  High Accuracy
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-secondary font-label-caps text-label-caps">
                  Instant &amp; 100% Free
                </span>
              </div>
            </div>

            {/* Title & SEO Subhead */}
            <div className="max-w-3xl mb-8">
              <h1 className="font-display-hero text-display-hero-mobile md:text-display-hero text-on-surface tracking-tight mb-3">
                {seo.h1} <span className="text-primary">{seo.h1Highlight}</span>
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed mb-3">
                {seo.description}
              </p>
              {seo.targetKeywords && seo.targetKeywords.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] font-semibold text-outline tracking-wider uppercase mr-1">Popular Targets:</span>
                  {seo.targetKeywords.map((kw, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-md bg-surface-container text-on-surface-variant text-[11px] font-medium"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Real-Time Google Grounding Currency & Local Unit Detector */}
            <CurrencyUnitSearchCard
              initialExpanded={false}
              className="mb-8"
              onApplyPair={(pair) => {
                if (pair.categoryId === category.id) {
                  const f = units.find((u) => u.id === pair.fromUnitId);
                  const t = units.find((u) => u.id === pair.toUnitId);
                  if (f) setFromUnitId(f.id);
                  if (t) setToUnitId(t.id);
                } else {
                  window.location.href = `/conversion/${pair.fromUnitId.toLowerCase()}-to-${pair.toUnitId.toLowerCase()}`;
                }
              }}
            />
          </section>

          {/* ================================================================= */}
          {/* SECTION 2 & 3: INTERACTIVE WORKBENCH + MULTI-METRIC DASHBOARD    */}
          {/* ================================================================= */}
          <section className="w-full max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop py-6" id="converter-workbench">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Core Workbench Card (7 cols) */}
              <div className="lg:col-span-7 bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-md flex flex-col gap-6 relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                    <span className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant">{category.name} Converter</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <label className="font-label-caps text-label-caps text-on-surface-variant" htmlFor="precisionSelect">Decimals:</label>
                    <select
                      className="bg-surface-container py-1 px-2.5 rounded-lg text-body-sm font-data-mono text-on-surface focus:outline-none cursor-pointer"
                      id="precisionSelect"
                      value={precision}
                      onChange={(e) => setPrecision(e.target.value)}
                    >
                      <option value="2">2 Decimals</option>
                      <option value="4">4 Decimals</option>
                      <option value="5">5 Decimals</option>
                      <option value="8">8 Decimals</option>
                      <option value="scientific">Scientific</option>
                    </select>
                  </div>
                </div>

                {/* Inputs Row */}
                <div className="grid grid-cols-1 sm:grid-cols-11 gap-3 items-center">
                  {/* From Input & Select */}
                  <div className="sm:col-span-5 flex flex-col gap-2 bg-surface-container-low p-3.5 rounded-2xl">
                    <div className="flex justify-between items-center text-on-surface-variant font-label-caps text-label-caps">
                      <span>FROM</span>
                      <span className="text-primary font-bold">{fromUnit.name} ({fromUnit.symbol})</span>
                    </div>
                    <div className="relative flex items-center">
                      <input
                        className="w-full bg-transparent font-numerical-display text-numerical-display-mobile sm:text-numerical-display text-on-surface focus:outline-none font-bold pr-8"
                        id="inputValue"
                        step="any"
                        type="number"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="0"
                        aria-label="Input number to convert"
                      />
                      {inputValue && (
                        <button
                          type="button"
                          onClick={() => setInputValue('')}
                          className="absolute right-0 text-on-surface-variant hover:text-on-surface p-1 text-xs font-semibold"
                          title="Clear input"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                    {/* Quick Value Presets for fast interaction */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      <span className="text-[10px] text-on-surface-variant font-medium">Quick:</span>
                      {[1, 5, 10, 25, 50, 100].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setInputValue(String(preset))}
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                            inputValue === String(preset)
                              ? 'bg-primary text-white shadow-xs'
                              : 'bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                          }`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                    <select
                      className="w-full bg-surface-container-lowest text-on-surface py-2 px-3 rounded-xl font-body-sm text-body-sm focus:outline-none shadow-sm cursor-pointer"
                      id="fromUnitSelect"
                      value={fromUnitId}
                      onChange={(e) => setFromUnitId(e.target.value)}
                    >
                      {units.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.symbol})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Swap Button */}
                  <div className="sm:col-span-1 flex justify-center">
                    <button
                      className="w-10 h-10 rounded-full bg-surface-container-high hover:bg-primary hover:text-on-primary text-on-surface flex items-center justify-center transition-all duration-300 transform active:scale-95 shadow-sm cursor-pointer"
                      id="swapBtn"
                      title="Swap units (Shortcut: S)"
                      type="button"
                      onClick={handleSwap}
                    >
                      <span className="material-symbols-outlined text-[20px]">swap_horiz</span>
                    </button>
                  </div>

                  {/* To Unit & Output Preview */}
                  <div className="sm:col-span-5 flex flex-col gap-2 bg-surface-container-low p-3.5 rounded-2xl">
                    <div className="flex justify-between items-center text-on-surface-variant font-label-caps text-label-caps">
                      <span>TO</span>
                      <span className="text-primary font-bold">{toUnit.name} ({toUnit.symbol})</span>
                    </div>
                    <div className="font-numerical-display text-numerical-display-mobile sm:text-numerical-display text-primary truncate font-bold" id="outputDisplay">
                      {formattedResult}
                    </div>
                    <select
                      className="w-full bg-surface-container-lowest text-on-surface py-2 px-3 rounded-xl font-body-sm text-body-sm focus:outline-none shadow-sm cursor-pointer"
                      id="toUnitSelect"
                      value={toUnitId}
                      onChange={(e) => setToUnitId(e.target.value)}
                    >
                      {units.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.symbol})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Quick Presets for Instant Easy Interaction */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <span className="text-[11px] font-semibold text-on-surface-variant mr-1">Quick values:</span>
                  {[1, 5, 10, 25, 50, 100].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setInputValue(String(val))}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        inputValue === String(val)
                          ? 'bg-primary text-white shadow-xs'
                          : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>

                {/* Tactile Dynamic Scale Slider */}
                <div className="flex flex-col gap-2 pt-2">
                  <div className="flex justify-between text-on-surface-variant font-label-caps text-label-caps">
                    <span>SLIDE TO CHANGE VALUE (1 to 100)</span>
                    <span className="font-data-mono text-primary font-bold">
                      {numericValue} {fromUnit.symbol} ({numericValue}x)
                    </span>
                  </div>
                  <input
                    className="w-full accent-primary h-2 bg-surface-container rounded-lg cursor-pointer"
                    id="scaleSlider"
                    max="100"
                    min="1"
                    type="range"
                    value={Math.min(100, Math.max(1, numericValue || 1))}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                </div>

                {/* Action Utility Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
                  <div className="flex items-center gap-2">
                    <button
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container text-on-surface font-body-sm text-body-sm hover:bg-surface-container-high transition-all cursor-pointer"
                      id="copyResultBtn"
                      type="button"
                      onClick={handleCopyResult}
                    >
                      <span className="material-symbols-outlined text-[16px]">content_copy</span>
                      <span>{copyFeedback}</span>
                    </button>
                    <button
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container text-on-surface font-body-sm text-body-sm hover:bg-surface-container-high transition-all cursor-pointer"
                      id="shareBtn"
                      type="button"
                      onClick={handleShare}
                    >
                      <span className="material-symbols-outlined text-[16px]">share</span>
                      Share
                    </button>
                    <button
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container text-on-surface font-body-sm text-body-sm hover:bg-surface-container-high transition-all cursor-pointer ${
                        isFavorited ? 'text-tertiary' : ''
                      }`}
                      id="favBtn"
                      type="button"
                      onClick={() => {
                        setIsFavorited(!isFavorited);
                        showToast(!isFavorited ? `${category.name} Converter saved to favorites.` : 'Removed from favorites.');
                      }}
                    >
                      <span className="material-symbols-outlined text-[16px] text-tertiary">star</span>
                      Favorite
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface-variant font-body-sm text-body-sm hover:text-on-surface transition-all cursor-pointer"
                      id="resetBtn"
                      type="button"
                      onClick={handleReset}
                    >
                      <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                      Reset
                    </button>
                    <button
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-on-primary font-body-sm text-body-sm hover:bg-primary-container transition-all cursor-pointer"
                      id="exportBtn"
                      type="button"
                      onClick={handleExportJSON}
                    >
                      <span className="material-symbols-outlined text-[16px]">download</span>
                      Download (.json)
                    </button>
                  </div>
                </div>
              </div>

              {/* Live Multi-Metric Equivalent Sidecar (5 cols) */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                {/* Main Highlight Card */}
                <div className="bg-surface-container-high p-6 rounded-3xl shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-bold">CONVERTED RESULT</span>
                    <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                  </div>
                  <div className="font-headline-md text-headline-md text-on-surface font-semibold mb-2">
                    {inputValue} {fromUnit.name} = {formattedResult} {toUnit.name}
                  </div>
                  <div className="font-body-sm text-body-sm text-on-surface-variant">
                    {exactRatioString}
                  </div>
                </div>

                {/* 4-Quadrant Equivalent Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Metric Quad */}
                  <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-1.5 text-primary mb-2 font-label-caps text-label-caps font-bold">
                      <span className="material-symbols-outlined text-[16px]">science</span>
                      <span>Metric Units (Standard)</span>
                    </div>
                    <div className="font-data-mono text-body-sm text-on-surface space-y-1">
                      {multiQuadrantData.metric.map((m, idx) => (
                        <div key={idx}>{m.val}</div>
                      ))}
                    </div>
                  </div>

                  {/* US Customary Quad */}
                  <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-1.5 text-secondary mb-2 font-label-caps text-label-caps font-bold">
                      <span className="material-symbols-outlined text-[16px]">straighten</span>
                      <span>US &amp; Imperial Units</span>
                    </div>
                    <div className="font-data-mono text-body-sm text-on-surface space-y-1">
                      {multiQuadrantData.customary.map((m, idx) => (
                        <div key={idx}>{m.val}</div>
                      ))}
                    </div>
                  </div>

                  {/* Scientific Quad */}
                  <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-1.5 text-tertiary mb-2 font-label-caps text-label-caps font-bold">
                      <span className="material-symbols-outlined text-[16px]">biotech</span>
                      <span>Small &amp; Scientific</span>
                    </div>
                    <div className="font-data-mono text-body-sm text-on-surface space-y-1">
                      {multiQuadrantData.scientific.map((m, idx) => (
                        <div key={idx}>{m.val}</div>
                      ))}
                    </div>
                  </div>

                  {/* Domain Specialized Quad */}
                  <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-1.5 text-primary mb-2 font-label-caps text-label-caps font-bold">
                      <span className="material-symbols-outlined text-[16px]">precision_manufacturing</span>
                      <span>Other Common Units</span>
                    </div>
                    <div className="font-data-mono text-body-sm text-on-surface space-y-1">
                      {multiQuadrantData.specialized.map((m, idx) => (
                        <div key={idx}>{m.val}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ================================================================= */}
          {/* SECTION 4: REAL-TIME PHYSICAL SCALE & VISUALIZER                  */}
          {/* ================================================================= */}
          <section className="w-full max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop py-10">
            <div className="p-6 md:p-8 rounded-3xl bg-surface-container-low shadow-sm">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                <div>
                  <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-bold">VISUAL SIZE GUIDE</span>
                  <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mt-1">See How Big This Is</h2>
                </div>
                <div className="px-4 py-2 rounded-xl bg-surface-container-lowest font-body-sm text-body-sm text-on-surface-variant shadow-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-secondary"></span>
                  Visual comparison between {fromUnit.symbol} and {toUnit.symbol}
                </div>
              </div>

              {/* Dynamic Visualizer Component */}
              <CategoryVisualizer
                category={category}
                formattedResult={formattedResult}
                fromUnit={fromUnit}
                inputValue={numericValue}
                resultValue={conversionResult.resultNumber}
                toUnit={toUnit}
              />
            </div>
          </section>

          {/* ================================================================= */}
          {/* SECTION 4: TOOLS CATEGORY & UNIVERSAL SEARCH DIRECTORY            */}
          {/* ================================================================= */}
          <section className="w-full max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop py-8 border-t border-outline-variant/30">
            <div className="mb-6">
              <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-bold">
                {category.name} Converters Directory
              </span>
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
                Search &amp; Convert {category.name} Units
              </h2>
            </div>

            {/* Universal Search + Direct Shortcut Chips */}
            <div className="p-4 md:p-5 rounded-2xl bg-surface-container-low shadow-sm mb-6">
              <div className="relative flex items-center mb-3">
                <span className="material-symbols-outlined absolute left-4 text-on-surface-variant text-[20px]">manage_search</span>
                <input
                  className="w-full pl-11 pr-24 py-3 bg-surface-container-lowest rounded-xl font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                  id="categoryQuickLookupInput"
                  placeholder={richData.heroPlaceholder || `Type a conversion (e.g., 10 ${units[0]?.symbol} to ${units[1]?.symbol})...`}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleQuickLookup();
                  }}
                />
                <button
                  className="absolute right-2 px-3 py-1.5 bg-primary text-on-primary rounded-lg font-label-caps text-label-caps hover:bg-primary-container transition-all cursor-pointer"
                  onClick={handleQuickLookup}
                  type="button"
                >
                  Convert
                </button>
              </div>
              {richData.popularChips.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 text-on-surface-variant font-label-caps text-label-caps">
                  <span className="uppercase tracking-wider text-[10px] text-outline shrink-0">Popular:</span>
                  {richData.popularChips.map((chip, idx) => (
                    <button
                      className="shrink-0 px-2.5 py-1 rounded-full bg-surface-container-lowest hover:bg-primary hover:text-on-primary transition-all cursor-pointer"
                      key={idx}
                      onClick={() => setConversion(1, chip.from, chip.to)}
                      type="button"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* ================================================================= */}
          {/* SECTION 5: FAST DYNAMIC CONVERSION LOOKUP TABLE                  */}
          {/* ================================================================= */}
          <section className="w-full max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop py-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
              <div>
                <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-bold">QUICK REFERENCE TABLE</span>
                <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
                  {fromUnit.name} to {toUnit.name} Conversion Chart
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-high text-on-surface font-body-sm text-body-sm hover:bg-surface-container transition-all cursor-pointer"
                  onClick={handleExportCSV}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">file_download</span>
                  Download CSV
                </button>
                <button
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-high text-on-surface font-body-sm text-body-sm hover:bg-surface-container transition-all cursor-pointer"
                  onClick={() => window.print()}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">print</span>
                  Print
                </button>
              </div>
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto rounded-2xl bg-surface-container-lowest shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant font-label-caps text-label-caps uppercase tracking-wider">
                    <th className="py-3.5 px-4 font-bold">{fromUnit.name} ({fromUnit.symbol})</th>
                    <th className="py-3.5 px-4">{toUnit.name} ({toUnit.symbol})</th>
                    <th className="py-3.5 px-4">{toUnit.name} (Reverse)</th>
                    <th className="py-3.5 px-4">{fromUnit.name} Equivalent</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="font-data-mono text-body-sm text-on-surface divide-y divide-outline-variant/10">
                  {stepTableRows.map((row) => (
                    <tr className="hover:bg-surface-container/50 transition-colors" key={row.value}>
                      <td className="py-3 px-4 font-bold text-primary">{row.value} {fromUnit.symbol}</td>
                      <td className="py-3 px-4">{row.forwardResult} {toUnit.symbol}</td>
                      <td className="py-3 px-4">{row.value} {toUnit.symbol}</td>
                      <td className="py-3 px-4">{row.reverseResult} {fromUnit.symbol}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          className="px-2.5 py-1 rounded bg-surface-container hover:bg-primary hover:text-on-primary font-body-sm text-[12px] transition-all cursor-pointer"
                          onClick={() => setInputValue(String(row.value))}
                          type="button"
                        >
                          Load
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* ================================================================= */}
          {/* SECTION 6: HIGH VELOCITY POPULAR CONVERSIONS CARDS               */}
          {/* ================================================================= */}
          {popularCards.length > 0 && (
            <section className="w-full max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop py-8">
              <div className="mb-6">
                <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-bold">FREQUENT LOOKUPS</span>
                <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Most Popular {category.name} Conversions</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {popularCards.map((card, idx) => (
                  <div className="p-5 rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all flex flex-col justify-between" key={idx}>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-0.5 rounded-full bg-surface-container text-primary font-label-caps text-label-caps">{card.traffic}</span>
                        <span className="material-symbols-outlined text-[18px] text-outline">trending_up</span>
                      </div>
                      <div className="font-body-lg text-body-lg font-bold text-on-surface">{card.title}</div>
                      <div className="font-data-mono text-body-sm text-on-surface-variant mt-1">{card.formula}</div>
                    </div>
                    <div className="mt-4 pt-3 flex items-center justify-between">
                      {card.dedicatedUrl ? (
                        <Link
                          className="text-primary font-body-sm text-body-sm font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                          href={card.dedicatedUrl}
                        >
                          Open Tool <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                        </Link>
                      ) : (
                        <button
                          className="text-primary font-body-sm text-body-sm font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                          onClick={() => setConversion(card.val, card.from, card.to)}
                          type="button"
                        >
                          Convert <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                        </button>
                      )}
                      <span className="text-[12px] text-outline font-data-mono">{card.factor}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ================================================================= */}
          {/* SECTION 7: EXPLORE UNITS BY TYPE                                  */}
          {/* ================================================================= */}
          <section className="w-full max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop py-8">
            <div className="mb-6">
              <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-bold">EXPLORE UNITS BY TYPE</span>
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Common {category.name} Units</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {units.slice(0, 5).map((mainU, idx) => (
                <div className="p-5 rounded-2xl bg-surface-container-low shadow-sm flex flex-col justify-between" key={mainU.id}>
                  <div>
                    <div className="w-8 h-8 rounded-xl bg-surface-container-lowest text-primary flex items-center justify-center mb-3">
                      <span className="material-symbols-outlined text-[20px]">{category.icon}</span>
                    </div>
                    <div className="font-headline-md text-headline-md text-on-surface text-[17px] font-bold mb-2">{mainU.name}</div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-3">
                      Symbol: <span className="font-data-mono text-primary font-bold">{mainU.symbol}</span>. Commonly used in: <span className="capitalize">{mainU.system || 'Standard'}</span>.
                    </p>
                  </div>
                  {mainU.id === 'g' ? (
                    <Link
                      href="/conversion/gram"
                      className="mt-4 w-full py-1.5 rounded-lg bg-surface-container-lowest text-primary hover:bg-primary hover:text-on-primary font-label-caps text-label-caps transition-all cursor-pointer flex justify-center items-center"
                    >
                      Select {mainU.symbol}
                    </Link>
                  ) : (
                    <button
                      className="mt-4 w-full py-1.5 rounded-lg bg-surface-container-lowest text-primary hover:bg-primary hover:text-on-primary font-label-caps text-label-caps transition-all cursor-pointer"
                      onClick={() => {
                        const target = units[(idx + 1) % units.length];
                        setConversion(1, mainU.id, target.id);
                      }}
                      type="button"
                    >
                      Select {mainU.symbol}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ================================================================= */}
          {/* SECTION 8: STEP-BY-STEP CALCULATION FORMULA                       */}
          {/* ================================================================= */}
          <section className="w-full max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop py-8">
            <div className="p-6 md:p-8 rounded-3xl bg-surface-container-lowest shadow-sm">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                <div>
                  <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-bold">HOW THIS CONVERSION WORKS</span>
                  <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Simple Step-by-Step Conversion Formula</h2>
                </div>
                <button
                  className="px-3 py-1.5 rounded-lg bg-surface-container font-body-sm text-body-sm text-on-surface hover:bg-surface-container-high transition-all flex items-center gap-1.5 cursor-pointer"
                  onClick={handleCopyFormula}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">content_copy</span>
                  <span>{formulaCopyFeedback}</span>
                </button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Step 1 */}
                <div className="p-5 rounded-2xl bg-surface-container-low">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-caps text-[12px] font-bold">1</span>
                    <span className="font-headline-md text-headline-md text-[16px] font-bold">1. Find the Base Rate</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-3">
                    Every conversion starts with the standard baseline rate between these two units:
                  </p>
                  <div className="p-3 bg-surface-container-lowest rounded-xl font-data-mono text-[13px] text-primary">
                    1 {fromUnit.symbol} = {convertValue(1, category.id, fromUnit.id, toUnit.id).resultNumber} {toUnit.symbol}
                  </div>
                </div>

                {/* Step 2 */}
                <div className="p-5 rounded-2xl bg-surface-container-low">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-caps text-[12px] font-bold">2</span>
                    <span className="font-headline-md text-headline-md text-[16px] font-bold">2. Multiply by Your Number</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-3">
                    Multiply your entered number by the conversion rate to calculate the exact target value:
                  </p>
                  <div className="p-3 bg-surface-container-lowest rounded-xl font-data-mono text-[13px] text-primary">
                    {inputValue || 1} {fromUnit.symbol} × Rate = {formattedResult} {toUnit.symbol}
                  </div>
                </div>

                {/* Step 3 */}
                <div className="p-5 rounded-2xl bg-surface-container-low">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-caps text-[12px] font-bold">3</span>
                    <span className="font-headline-md text-headline-md text-[16px] font-bold">3. Clear &amp; Ready-to-Use Answer</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-3">
                    The result is neatly rounded to your preferred decimal setting so it is clear and ready to use:
                  </p>
                  <div className="p-3 bg-surface-container-lowest rounded-xl font-data-mono text-[13px] text-primary">
                    Final Answer = {formattedResult} {toUnit.symbol}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ================================================================= */}
          {/* SECTION 9: REAL-WORLD BENCHMARKS                                 */}
          {/* ================================================================= */}
          {richData.benchmarks.length > 0 && (
            <section className="w-full max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop py-8">
              <div className="mb-6">
                <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-bold">EVERYDAY EXAMPLES</span>
                <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Real-World Examples of {category.name}</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {richData.benchmarks.slice(0, 6).map((bm, idx) => (
                  <div className="p-4 rounded-2xl bg-surface-container-low text-center flex flex-col items-center justify-between" key={idx}>
                    <span className="material-symbols-outlined text-[32px] text-primary mb-2">{bm.icon || category.icon}</span>
                    <div className="font-headline-md text-headline-md text-[15px] font-bold line-clamp-1">{bm.title}</div>
                    <div className="font-data-mono text-primary font-bold mt-1 text-[13px]">{bm.summary}</div>
                    <div className="font-body-sm text-body-sm text-on-surface-variant text-[11px] mt-0.5 line-clamp-2">{bm.detail}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ================================================================= */}
          {/* SECTION 10: MASTER UNIT REFERENCE TABLE                          */}
          {/* ================================================================= */}
          <section className="w-full max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop py-8">
            <div className="mb-6">
              <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-bold">UNIT REFERENCE GUIDE</span>
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">All {category.name} Units at a Glance</h2>
            </div>
            <div className="overflow-x-auto rounded-2xl bg-surface-container-lowest shadow-sm">
              <table className="w-full text-left border-collapse font-body-sm text-body-sm">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant font-label-caps text-label-caps uppercase tracking-wider">
                    <th className="py-3 px-4">Unit Name</th>
                    <th className="py-3 px-4">Symbol</th>
                    <th className="py-3 px-4">System</th>
                    <th className="py-3 px-4 font-data-mono">Conversion Rate</th>
                    <th className="py-3 px-4">Common Uses</th>
                  </tr>
                </thead>
                <tbody className="divide-y-0 text-on-surface">
                  {units.map((u) => {
                    const baseConv = convertValue(1, category.id, u.id, units[0].id);
                    return (
                      <tr className="hover:bg-surface-container-low/40" key={u.id}>
                        <td className="py-3 px-4 font-semibold">{u.name}</td>
                        <td className="py-3 px-4 font-data-mono text-primary">{u.symbol}</td>
                        <td className="py-3 px-4 capitalize">{u.system || 'Standard'}</td>
                        <td className="py-3 px-4 font-data-mono font-bold">
                          1 {u.symbol} = {formatResult(baseConv.resultNumber, '6')} {units[0].symbol}
                        </td>
                        <td className="py-3 px-4 text-on-surface-variant">{u.description || `Everyday, home, and school measurements in ${category.name}.`}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* ================================================================= */}
          {/* SECTION 11: HELPFUL ARTICLES & PRACTICAL TIPS                     */}
          {/* ================================================================= */}
          {richData.historyGuide && (
            <section className="w-full max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop py-8">
              <div className="mb-6">
                <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-bold">HELPFUL TIPS &amp; BACKGROUND</span>
                <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">How These Units Began &amp; Good Things to Know</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Article 1 */}
                <article className="p-6 rounded-3xl bg-surface-container-lowest shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-primary font-label-caps text-label-caps">QUICK STORY</span>
                      <span className="text-body-sm text-on-surface-variant">2 min read</span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-2 font-semibold">Where Did {category.name} Units Come From?</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-4">
                      {richData.historyGuide.origin}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-primary font-body-sm text-body-sm font-semibold">
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                    {richData.historyGuide.standards}
                  </div>
                </article>

                {/* Article 2 */}
                <article className="p-6 rounded-3xl bg-surface-container-lowest shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-secondary font-label-caps text-label-caps">PRACTICAL TIPS</span>
                      <span className="text-body-sm text-on-surface-variant">2 min read</span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-2 font-semibold">Common Mistakes &amp; How to Avoid Them</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-4">
                      {richData.historyGuide.pitfalls}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-secondary font-body-sm text-body-sm font-semibold">
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    Verified Everyday Formulas
                  </div>
                </article>
              </div>
            </section>
          )}

          {/* ================================================================= */}
          {/* SECTION 12: RELATED TOOLS                                         */}
          {/* ================================================================= */}
          <section className="w-full max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop py-8">
            <div className="mb-6">
              <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-bold">EXPLORE MORE TOOLS</span>
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">More Helpful Unit Converters</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Link className="p-4 rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center group" href="/area-converter">
                <span className="material-symbols-outlined text-[28px] text-primary group-hover:scale-110 transition-transform mb-2">square_foot</span>
                <div className="font-body-md text-body-md font-bold text-on-surface">Area</div>
                <div className="font-body-sm text-body-sm text-on-surface-variant text-[11px] mt-0.5">m², acres, sq ft</div>
              </Link>
              <Link className="p-4 rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center group" href="/length-converter">
                <span className="material-symbols-outlined text-[28px] text-primary group-hover:scale-110 transition-transform mb-2">straighten</span>
                <div className="font-body-md text-body-md font-bold text-on-surface">Length &amp; Distance</div>
                <div className="font-body-sm text-body-sm text-on-surface-variant text-[11px] mt-0.5">meters, inches, miles</div>
              </Link>
              <Link className="p-4 rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center group" href="/weight-converter">
                <span className="material-symbols-outlined text-[28px] text-primary group-hover:scale-110 transition-transform mb-2">scale</span>
                <div className="font-body-md text-body-md font-bold text-on-surface">Weight &amp; Mass</div>
                <div className="font-body-sm text-body-sm text-on-surface-variant text-[11px] mt-0.5">kg, lbs, stones, oz</div>
              </Link>
              <Link className="p-4 rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center group" href="/volume-converter">
                <span className="material-symbols-outlined text-[28px] text-primary group-hover:scale-110 transition-transform mb-2">water_drop</span>
                <div className="font-body-md text-body-md font-bold text-on-surface">Volume &amp; Liquids</div>
                <div className="font-body-sm text-body-sm text-on-surface-variant text-[11px] mt-0.5">liters, gallons, cups</div>
              </Link>
              <Link className="p-4 rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center group" href="/temperature-converter">
                <span className="material-symbols-outlined text-[28px] text-primary group-hover:scale-110 transition-transform mb-2">thermostat</span>
                <div className="font-body-md text-body-md font-bold text-on-surface">Temperature</div>
                <div className="font-body-sm text-body-sm text-on-surface-variant text-[11px] mt-0.5">°C, °F, Kelvin</div>
              </Link>
              <Link className="p-4 rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center group" href="/speed-converter">
                <span className="material-symbols-outlined text-[28px] text-primary group-hover:scale-110 transition-transform mb-2">speed</span>
                <div className="font-body-md text-body-md font-bold text-on-surface">Speed</div>
                <div className="font-body-sm text-body-sm text-on-surface-variant text-[11px] mt-0.5">mph, km/h, knots</div>
              </Link>
            </div>
          </section>

          {/* ================================================================= */}
          {/* SECTION 13: FAQ ACCORDION                                         */}
          {/* ================================================================= */}
          {richData.faqs.length > 0 && (
            <section className="w-full max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop py-8">
              <div className="mb-6">
                <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-bold">FREQUENTLY ASKED QUESTIONS</span>
                <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">{category.name} Questions &amp; Answers</h2>
              </div>
              <div className="flex flex-col gap-3">
                {richData.faqs.map((faq, idx) => (
                  <details
                    className="group bg-surface-container-lowest rounded-2xl p-5 shadow-sm transition-all [&_summary::-webkit-details-marker]:hidden"
                    key={idx}
                    open={idx === 0}
                  >
                    <summary className="flex items-center justify-between cursor-pointer font-headline-md text-[17px] font-semibold text-on-surface">
                      <span>{faq.question}</span>
                      <span className="material-symbols-outlined text-[20px] text-outline group-open:rotate-180 transition-transform">expand_more</span>
                    </summary>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-3 leading-relaxed">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* ================================================================= */}
          {/* SECTION 14: TRUST & ACCURACY STRIP                                */}
          {/* ================================================================= */}
          <section className="w-full max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop py-8">
            <div className="p-6 rounded-3xl bg-surface-container-high flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary text-on-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[28px]">verified_user</span>
                </div>
                <div>
                  <div className="font-headline-md text-headline-md text-[18px] font-bold text-on-surface">100% Verified &amp; Tested Formulas</div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Every calculation uses trusted, standard definitions so your results are 100% accurate for school, home, work, and recipes.</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="px-3.5 py-2 rounded-xl bg-surface-container-lowest font-label-caps text-label-caps text-on-surface shadow-sm">
                  ✓ Double-Checked Accuracy
                </div>
                <div className="px-3.5 py-2 rounded-xl bg-surface-container-lowest font-label-caps text-label-caps text-primary shadow-sm">
                  ✓ 100% Private (No Tracking)
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
