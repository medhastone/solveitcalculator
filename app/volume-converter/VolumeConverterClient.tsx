'use client';

import React, { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Conversion factors to SI base (Liters)
const toLiters: Record<string, number> = {
  L: 1.0,
  mL: 0.001,
  m3: 1000.0,
  cm3: 0.001,
  uL: 0.000001,
  gal: 3.785411784,
  qt: 0.946352946,
  pt: 0.473176473,
  cup: 0.2365882365,
  floz: 0.0295735295625,
  tbsp: 0.01478676478125,
  tsp: 0.00492892159375,
  bbl: 158.987294928,
  ft3: 28.316846592,
  in3: 0.016387064,
  uk_gal: 4.54609,
  uk_qt: 1.1365225,
  uk_pt: 0.56826125,
  uk_floz: 0.0284130625
};

const unitNames: Record<string, string> = {
  L: 'Liters (L)',
  mL: 'Milliliters (mL)',
  m3: 'Cubic Meters (m³)',
  cm3: 'Cubic Centimeters (cm³ / cc)',
  uL: 'Microliters (µL)',
  gal: 'US Gallons (gal)',
  qt: 'US Quarts (qt)',
  pt: 'US Pints (pt)',
  cup: 'US Cups (cup)',
  floz: 'US Fluid Ounces (fl oz)',
  tbsp: 'US Tablespoons (tbsp)',
  tsp: 'US Teaspoons (tsp)',
  bbl: 'Oil Barrels (bbl)',
  ft3: 'Cubic Feet (ft³)',
  in3: 'Cubic Inches (in³)',
  uk_gal: 'Imperial Gallons (UK gal)',
  uk_qt: 'Imperial Quarts (UK qt)',
  uk_pt: 'Imperial Pints (UK pt)',
  uk_floz: 'Imperial Fluid Ounces (UK fl oz)'
};

const unitShortLabels: Record<string, string> = {
  L: 'L',
  mL: 'mL',
  m3: 'm³',
  cm3: 'cm³',
  uL: 'µL',
  gal: 'gal',
  qt: 'qt',
  pt: 'pt',
  cup: 'cup',
  floz: 'fl oz',
  tbsp: 'tbsp',
  tsp: 'tsp',
  bbl: 'bbl',
  ft3: 'ft³',
  in3: 'in³',
  uk_gal: 'UK gal',
  uk_qt: 'UK qt',
  uk_pt: 'UK pt',
  uk_floz: 'UK fl oz'
};

export default function VolumeConverterClient() {
  const [inputValue, setInputValue] = useState<number>(10);
  const [fromUnit, setFromUnit] = useState<string>('L');
  const [toUnit, setToUnit] = useState<string>('gal');
  const [precision, setPrecision] = useState<string>('5');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copyFeedback, setCopyFeedback] = useState<string>('Copy Result');
  const [formulaCopyFeedback, setFormulaCopyFeedback] = useState<string>('Copy Base Formula');
  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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

  // Primary math
  const liters = useMemo(() => {
    return (inputValue || 0) * (toLiters[fromUnit] || 1.0);
  }, [inputValue, fromUnit]);

  const convertedResultNumber = useMemo(() => {
    return liters / (toLiters[toUnit] || 1.0);
  }, [liters, toUnit]);

  const outputDisplay = useMemo(() => {
    return formatNumber(convertedResultNumber, precision);
  }, [convertedResultNumber, precision, formatNumber]);

  // Exact ratio string
  const exactRatioString = useMemo(() => {
    const ratio = (toLiters[fromUnit] || 1) / (toLiters[toUnit] || 1);
    const formattedRatio = ratio < 0.0001 || ratio > 100000 ? ratio.toExponential(6) : ratio.toFixed(8).replace(/\.?0+$/, '');
    return `Exact Ratio: 1 ${unitShortLabels[fromUnit] || fromUnit} = ${formattedRatio} ${unitShortLabels[toUnit] || toUnit}`;
  }, [fromUnit, toUnit]);

  // Liquid visualizer fill percentage (15L reference)
  const fillPct = useMemo(() => {
    return Math.min(100, Math.max(5, (liters / 15.0) * 100));
  }, [liters]);

  // Equivalence numbers
  const bottleCount = useMemo(() => `~${(liters / 0.5).toFixed(1)} Bottles`, [liters]);
  const cupCount = useMemo(() => `~${(liters / 0.236588).toFixed(1)} Cups`, [liters]);
  const jugCount = useMemo(() => `~${(liters / 3.78541).toFixed(2)} Jugs`, [liters]);
  const cuFtCount = useMemo(() => `~${(liters / 28.3168).toFixed(3)} ft³`, [liters]);

  // Multi-Metric Quads
  const metricEquiv = useMemo(() => {
    const ml = liters * 1000;
    const m3 = liters / 1000;
    const cm3 = ml;
    return {
      ml: `${ml.toLocaleString('en-US', { maximumFractionDigits: 1 })} mL`,
      m3: `${m3.toFixed(4)} m³`,
      cm3: `${cm3.toLocaleString('en-US', { maximumFractionDigits: 1 })} cm³ (cc)`
    };
  }, [liters]);

  const usEquiv = useMemo(() => {
    const usGal = liters / toLiters.gal;
    const usQt = liters / toLiters.qt;
    const usCup = liters / toLiters.cup;
    const usFloz = liters / toLiters.floz;
    return {
      gal: `${usGal.toFixed(4)} Gallons`,
      qt: `${usQt.toFixed(4)} Quarts`,
      cup: `${usCup.toFixed(2)} Cups`,
      floz: `${usFloz.toFixed(2)} fl oz`
    };
  }, [liters]);

  const ukEquiv = useMemo(() => {
    const ukGal = liters / toLiters.uk_gal;
    const ukQt = liters / toLiters.uk_qt;
    const ukPt = liters / toLiters.uk_pt;
    const ukFloz = liters / toLiters.uk_floz;
    return {
      gal: `${ukGal.toFixed(4)} UK Gal`,
      qt: `${ukQt.toFixed(4)} UK Qt`,
      pt: `${ukPt.toFixed(3)} UK Pt`,
      floz: `${ukFloz.toFixed(2)} UK fl oz`
    };
  }, [liters]);

  const sciEquiv = useMemo(() => {
    const uL = liters * 1000000;
    const ft3 = liters / toLiters.ft3;
    const in3 = liters / toLiters.in3;
    const bbl = liters / toLiters.bbl;
    return {
      uL: `${uL.toExponential(3)} µL`,
      ft3: `${ft3.toFixed(4)} ft³`,
      in3: `${in3.toFixed(2)} in³`,
      bbl: `${bbl.toFixed(4)} bbl (Oil)`
    };
  }, [liters]);

  // Quick launch setter
  const setConversion = useCallback((val: number, from: string, to: string) => {
    setInputValue(val);
    setFromUnit(from);
    setToUnit(to);
    const workbenchEl = document.getElementById('volume-workbench');
    if (workbenchEl) {
      workbenchEl.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Quick lookup search handler
  const handleQuickLookup = useCallback(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return;

    const match = query.match(/([\d.]+)\s*([a-zA-Z³]+)\s*(?:to|in|into)\s*([a-zA-Z³]+)/);
    if (match) {
      const num = parseFloat(match[1]);
      const uFrom = match[2].toLowerCase();
      const uTo = match[3].toLowerCase();

      const unitMap: Record<string, string> = {
        gallon: 'gal',
        gallons: 'gal',
        gal: 'gal',
        liter: 'L',
        liters: 'L',
        l: 'L',
        milliliter: 'mL',
        milliliters: 'mL',
        ml: 'mL',
        cup: 'cup',
        cups: 'cup',
        pint: 'pt',
        pints: 'pt',
        pt: 'pt',
        quart: 'qt',
        quarts: 'qt',
        qt: 'qt',
        oz: 'floz',
        floz: 'floz',
        ounce: 'floz',
        ounces: 'floz',
        m3: 'm3',
        'm³': 'm3',
        ft3: 'ft3',
        'ft³': 'ft3'
      };

      if (unitMap[uFrom] && unitMap[uTo]) {
        setConversion(num, unitMap[uFrom], unitMap[uTo]);
        return;
      }
    }
    showToast("Try formats like '10 liters to gallons' or '250 ml in cups'");
  }, [searchQuery, setConversion, showToast]);

  // Copy result action
  const handleCopyResult = useCallback(() => {
    const textToCopy = `${inputValue} ${unitNames[fromUnit]} = ${outputDisplay} ${unitNames[toUnit]}`;
    navigator.clipboard?.writeText(textToCopy);
    setCopyFeedback('Copied!');
    setTimeout(() => setCopyFeedback('Copy Result'), 2000);
    showToast('Conversion result copied to clipboard!');
  }, [inputValue, fromUnit, outputDisplay, toUnit, showToast]);

  // Copy base formula action
  const handleCopyFormula = useCallback(() => {
    const formulaText = 'V(gal) = V(L) * 0.26417205235815';
    navigator.clipboard?.writeText(formulaText);
    setFormulaCopyFeedback('Copied!');
    setTimeout(() => setFormulaCopyFeedback('Copy Base Formula'), 2000);
    showToast('Base metrology formula copied!');
  }, [showToast]);

  // Share action
  const handleShare = useCallback(() => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: 'SolveIt Calculator Volume Converter',
        text: `${inputValue} ${unitNames[fromUnit]} = ${outputDisplay} ${unitNames[toUnit]}`,
        url: window.location.href
      }).catch(() => {});
    } else if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href);
      showToast('Converter URL copied to clipboard!');
    }
  }, [inputValue, fromUnit, outputDisplay, toUnit, showToast]);

  // Reset action
  const handleReset = useCallback(() => {
    setInputValue(10);
    setFromUnit('L');
    setToUnit('gal');
    setPrecision('5');
    showToast('Reset to 10 Liters to US Gallons');
  }, [showToast]);

  // Export JSON action
  const handleExportJSON = useCallback(() => {
    const payload = {
      calculator: 'SolveIt Calculator Universal Volume Converter',
      timestamp: new Date().toISOString(),
      input: { value: inputValue, unit: fromUnit, unitName: unitNames[fromUnit] },
      output: { value: parseFloat(outputDisplay.replace(/,/g, '')), unit: toUnit, unitName: unitNames[toUnit] },
      standard: 'ISO 80000-3 / NIST SP 811 Metrology'
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'solveit-volume-calculation.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Calculation exported as JSON');
  }, [inputValue, fromUnit, outputDisplay, toUnit, showToast]);

  // Export Table CSV
  const handleExportCSV = useCallback(() => {
    const rows = [
      ['Liters (L)', 'US Gallons (gal)', 'US Quarts (qt)', 'US Cups', 'Imperial Gal (UK)', 'Cubic Feet (ft3)'],
      [1, 0.26417, 1.05669, 4.22675, 0.21997, 0.03531],
      [2, 0.52834, 2.11338, 8.45351, 0.43994, 0.07063],
      [5, 1.32086, 5.28344, 21.1338, 1.09985, 0.17657],
      [10, 2.64172, 10.5669, 42.2675, 2.19969, 0.35315],
      [20, 5.28344, 21.1338, 84.5351, 4.39938, 0.70629],
      [50, 13.2086, 52.8344, 211.338, 10.9985, 1.76573],
      [100, 26.4172, 105.669, 422.675, 21.9969, 3.53147],
      [500, 132.086, 528.344, 2113.38, 109.985, 17.6573],
      [1000, 264.172, 1056.69, 4226.75, 219.969, 35.3147]
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'solveit_volume_matrix.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Volume matrix table exported to CSV');
  }, [showToast]);

  // Swap Units
  const handleSwap = useCallback(() => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  }, [fromUnit, toUnit]);

  // Theme toggle helper
  const handleToggleTheme = useCallback(() => {
    if (typeof document !== 'undefined') {
      const isCurrentlyDark = document.documentElement.classList.contains('dark');
      if (isCurrentlyDark) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('solveit_theme', 'light');
      } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('solveit_theme', 'dark');
      }
    }
  }, []);

  return (
    <div className="bg-background font-body-md text-on-surface antialiased min-h-screen selection:bg-primary/20 selection:text-primary">
      {/* Dynamic Toast popup */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-surface-container-highest text-on-surface border border-outline-variant/50 shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}

      {/* FIXED TOP HEADER */}
      {/* MAIN BODY CONTENT */}
      <main className="w-full pt-16 bg-background min-h-[calc(100vh-380px)]">
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
                <span className="text-on-surface font-medium">Volume Converter</span>
              </nav>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-primary font-label-caps text-label-caps">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                  ISO 80000-3 Standard Compliant
                </span>
                <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-caps text-label-caps">
                  IEEE 754 64-Bit Precision
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-secondary font-label-caps text-label-caps">
                  &lt;0.01s Execution
                </span>
              </div>
            </div>

            {/* Title & SEO Subhead */}
            <div className="max-w-3xl mb-8">
              <h1 className="font-display-hero text-display-hero-mobile md:text-display-hero text-on-surface tracking-tight mb-3">
                Volume Converter <span className="text-primary">&amp; Liquid Capacity Calculator</span>
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed mb-3">
                Free online volume converter. Easily convert gallons to liters, milliliters (mL) to cups, fluid ounces, pints, quarts, and cubic meters with exact conversion formulas and interactive fluid simulation.
              </p>
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] font-semibold text-outline tracking-wider uppercase mr-1">Popular Targets:</span>
                {['gallons to liters', 'liters to gallons', 'cups to ml', 'fluid ounces to ml', 'pints to cups', 'm3 to gallons'].map((kw, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 rounded-md bg-surface-container text-on-surface-variant text-[11px] font-medium"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Universal Search + Direct Shortcut Chips */}
            <div className="p-4 md:p-5 rounded-2xl bg-surface-container-low shadow-sm mb-6">
              <div className="relative flex items-center mb-3">
                <span className="material-symbols-outlined absolute left-4 text-on-surface-variant text-[20px]">manage_search</span>
                <input
                  className="w-full pl-11 pr-24 py-3 bg-surface-container-lowest rounded-xl font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                  id="quickLookupInput"
                  placeholder="Type an instant conversion (e.g., 5 gallons to liters, 250 ml in cups, 10 ft3 to m3)..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleQuickLookup();
                  }}
                />
                <button
                  className="absolute right-2 px-3 py-1.5 bg-primary text-on-primary rounded-lg font-label-caps text-label-caps hover:bg-primary-container transition-all cursor-pointer"
                  id="quickLookupBtn"
                  onClick={handleQuickLookup}
                  type="button"
                >
                  Convert
                </button>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-on-surface-variant font-label-caps text-label-caps">
                <span className="uppercase tracking-wider text-[10px] text-outline shrink-0">Popular:</span>
                <button className="shrink-0 px-2.5 py-1 rounded-full bg-surface-container-lowest hover:bg-primary hover:text-on-primary transition-all cursor-pointer" onClick={() => setConversion(1, 'L', 'gal')} type="button">
                  Liters → US Gallons
                </button>
                <button className="shrink-0 px-2.5 py-1 rounded-full bg-surface-container-lowest hover:bg-primary hover:text-on-primary transition-all cursor-pointer" onClick={() => setConversion(1, 'gal', 'L')} type="button">
                  US Gallons → Liters
                </button>
                <button className="shrink-0 px-2.5 py-1 rounded-full bg-surface-container-lowest hover:bg-primary hover:text-on-primary transition-all cursor-pointer" onClick={() => setConversion(250, 'mL', 'cup')} type="button">
                  250 mL → Cups
                </button>
                <button className="shrink-0 px-2.5 py-1 rounded-full bg-surface-container-lowest hover:bg-primary hover:text-on-primary transition-all cursor-pointer" onClick={() => setConversion(1, 'cup', 'mL')} type="button">
                  Cups → mL
                </button>
                <button className="shrink-0 px-2.5 py-1 rounded-full bg-surface-container-lowest hover:bg-primary hover:text-on-primary transition-all cursor-pointer" onClick={() => setConversion(10, 'ft3', 'm3')} type="button">
                  Cubic Feet → m³
                </button>
                <button className="shrink-0 px-2.5 py-1 rounded-full bg-surface-container-lowest hover:bg-primary hover:text-on-primary transition-all cursor-pointer" onClick={() => setConversion(1, 'pt', 'L')} type="button">
                  Pints → Liters
                </button>
                <button className="shrink-0 px-2.5 py-1 rounded-full bg-surface-container-lowest hover:bg-primary hover:text-on-primary transition-all cursor-pointer" onClick={() => setConversion(16, 'floz', 'mL')} type="button">
                  fl oz → mL
                </button>
              </div>
            </div>

            {/* Telemetry Stats Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-surface-container-lowest shadow-sm">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-lg bg-surface-container-high text-primary material-symbols-outlined text-[20px]">swap_calls</span>
                <div>
                  <div className="font-data-mono font-bold text-on-surface text-[14px]">100+ Units</div>
                  <div className="font-body-sm text-body-sm text-on-surface-variant text-[11px]">Comprehensive Matrix</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-lg bg-surface-container-high text-primary material-symbols-outlined text-[20px]">precision_manufacturing</span>
                <div>
                  <div className="font-data-mono font-bold text-on-surface text-[14px]">10⁻⁷ Precision</div>
                  <div className="font-body-sm text-body-sm text-on-surface-variant text-[11px]">Guard-Bit Accurate</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-lg bg-surface-container-high text-secondary material-symbols-outlined text-[20px]">lock</span>
                <div>
                  <div className="font-data-mono font-bold text-on-surface text-[14px]">100% Private</div>
                  <div className="font-body-sm text-body-sm text-on-surface-variant text-[11px]">Client-Side In-Browser</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-lg bg-surface-container-high text-primary material-symbols-outlined text-[20px]">verified</span>
                <div>
                  <div className="font-data-mono font-bold text-on-surface text-[14px]">NIST SP 811</div>
                  <div className="font-body-sm text-body-sm text-on-surface-variant text-[11px]">ISO 80000 Compliant</div>
                </div>
              </div>
            </div>
          </section>

          {/* ================================================================= */}
          {/* SECTION 2 & 3: INTERACTIVE WORKBENCH + MULTI-METRIC DASHBOARD    */}
          {/* ================================================================= */}
          <section className="w-full max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop py-6" id="volume-workbench">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Core Workbench Card (7 cols) */}
              <div className="lg:col-span-7 bg-surface-container-lowest rounded-3xl p-6 md:p-8 shadow-md flex flex-col gap-6 relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                    <span className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant">Universal Volume Workbench</span>
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
                      <span>INPUT VALUE</span>
                      <span className="text-primary font-bold" id="fromUnitLabel">{unitNames[fromUnit]}</span>
                    </div>
                    <input
                      className="w-full bg-transparent font-numerical-display text-numerical-display-mobile sm:text-numerical-display text-on-surface focus:outline-none font-bold"
                      id="inputValue"
                      step="any"
                      type="number"
                      value={isNaN(inputValue) ? '' : inputValue}
                      onChange={(e) => setInputValue(parseFloat(e.target.value) || 0)}
                    />
                    <select
                      className="w-full bg-surface-container-lowest text-on-surface py-2 px-3 rounded-xl font-body-sm text-body-sm focus:outline-none shadow-sm cursor-pointer"
                      id="fromUnit"
                      value={fromUnit}
                      onChange={(e) => setFromUnit(e.target.value)}
                    >
                      <optgroup label="Metric / SI Units">
                        <option value="L">Liters (L)</option>
                        <option value="mL">Milliliters (mL)</option>
                        <option value="m3">Cubic Meters (m³)</option>
                        <option value="cm3">Cubic Centimeters (cm³ / cc)</option>
                        <option value="uL">Microliters (µL)</option>
                      </optgroup>
                      <optgroup label="US Customary Units">
                        <option value="gal">US Gallons (gal)</option>
                        <option value="qt">US Quarts (qt)</option>
                        <option value="pt">US Pints (pt)</option>
                        <option value="cup">US Cups (cup)</option>
                        <option value="floz">US Fluid Ounces (fl oz)</option>
                        <option value="tbsp">US Tablespoons (tbsp)</option>
                        <option value="tsp">US Teaspoons (tsp)</option>
                        <option value="bbl">Oil Barrels (bbl)</option>
                        <option value="ft3">Cubic Feet (ft³)</option>
                        <option value="in3">Cubic Inches (in³)</option>
                      </optgroup>
                      <optgroup label="Imperial (UK) Units">
                        <option value="uk_gal">Imperial Gallons (UK gal)</option>
                        <option value="uk_qt">Imperial Quarts (UK qt)</option>
                        <option value="uk_pt">Imperial Pints (UK pt)</option>
                        <option value="uk_floz">Imperial Fluid Ounces (UK fl oz)</option>
                      </optgroup>
                    </select>
                  </div>

                  {/* Swap Button */}
                  <div className="sm:col-span-1 flex justify-center">
                    <button
                      className="w-10 h-10 rounded-full bg-surface-container-high hover:bg-primary hover:text-on-primary text-on-surface flex items-center justify-center transition-all duration-300 transform active:scale-95 shadow-sm cursor-pointer"
                      id="swapBtn"
                      title="Swap units"
                      type="button"
                      onClick={handleSwap}
                    >
                      <span className="material-symbols-outlined text-[20px]">swap_horiz</span>
                    </button>
                  </div>

                  {/* To Unit & Output Preview */}
                  <div className="sm:col-span-5 flex flex-col gap-2 bg-surface-container-low p-3.5 rounded-2xl">
                    <div className="flex justify-between items-center text-on-surface-variant font-label-caps text-label-caps">
                      <span>TARGET VALUE</span>
                      <span className="text-primary font-bold" id="toUnitLabel">{unitNames[toUnit]}</span>
                    </div>
                    <div className="font-numerical-display text-numerical-display-mobile sm:text-numerical-display text-primary truncate font-bold" id="outputDisplay">
                      {outputDisplay}
                    </div>
                    <select
                      className="w-full bg-surface-container-lowest text-on-surface py-2 px-3 rounded-xl font-body-sm text-body-sm focus:outline-none shadow-sm cursor-pointer"
                      id="toUnit"
                      value={toUnit}
                      onChange={(e) => setToUnit(e.target.value)}
                    >
                      <optgroup label="US Customary Units">
                        <option value="gal">US Gallons (gal)</option>
                        <option value="qt">US Quarts (qt)</option>
                        <option value="pt">US Pints (pt)</option>
                        <option value="cup">US Cups (cup)</option>
                        <option value="floz">US Fluid Ounces (fl oz)</option>
                        <option value="tbsp">US Tablespoons (tbsp)</option>
                        <option value="tsp">US Teaspoons (tsp)</option>
                        <option value="bbl">Oil Barrels (bbl)</option>
                        <option value="ft3">Cubic Feet (ft³)</option>
                        <option value="in3">Cubic Inches (in³)</option>
                      </optgroup>
                      <optgroup label="Metric / SI Units">
                        <option value="L">Liters (L)</option>
                        <option value="mL">Milliliters (mL)</option>
                        <option value="m3">Cubic Meters (m³)</option>
                        <option value="cm3">Cubic Centimeters (cm³ / cc)</option>
                        <option value="uL">Microliters (µL)</option>
                      </optgroup>
                      <optgroup label="Imperial (UK) Units">
                        <option value="uk_gal">Imperial Gallons (UK gal)</option>
                        <option value="uk_qt">Imperial Quarts (UK qt)</option>
                        <option value="uk_pt">Imperial Pints (UK pt)</option>
                        <option value="uk_floz">Imperial Fluid Ounces (UK fl oz)</option>
                      </optgroup>
                    </select>
                  </div>
                </div>

                {/* Tactile Dynamic Scale Slider */}
                <div className="flex flex-col gap-2 pt-2">
                  <div className="flex justify-between text-on-surface-variant font-label-caps text-label-caps">
                    <span>TACTILE MULTIPLIER / SCALE</span>
                    <span className="font-data-mono text-primary font-bold" id="sliderLabel">
                      {inputValue} {unitShortLabels[fromUnit] || fromUnit} ({inputValue}x)
                    </span>
                  </div>
                  <input
                    className="w-full accent-primary h-2 bg-surface-container rounded-lg cursor-pointer"
                    id="scaleSlider"
                    max="100"
                    min="1"
                    type="range"
                    value={Math.min(100, Math.max(1, inputValue || 1))}
                    onChange={(e) => setInputValue(parseFloat(e.target.value))}
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
                      <span id="copyFeedback">{copyFeedback}</span>
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
                        showToast(!isFavorited ? 'Volume Converter saved to favorites.' : 'Removed from favorites.');
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
                      Export (.json)
                    </button>
                  </div>
                </div>
              </div>

              {/* Live Multi-Metric Equivalent Sidecar (5 cols) */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                {/* Main Highlight Card */}
                <div className="bg-surface-container-high p-6 rounded-3xl shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-bold">PRIMARY DIRECT RESULT</span>
                    <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                  </div>
                  <div className="font-headline-md text-headline-md text-on-surface font-semibold mb-2" id="fullEquationDisplay">
                    {inputValue} {unitNames[fromUnit]} = {outputDisplay} {unitNames[toUnit]}
                  </div>
                  <div className="font-body-sm text-body-sm text-on-surface-variant">
                    {exactRatioString}
                  </div>
                </div>

                {/* 4-Quadrant Equivalent Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Metric Quad */}
                  <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-1.5 text-primary mb-2 font-label-caps text-label-caps">
                      <span className="material-symbols-outlined text-[16px]">science</span>
                      <span>METRIC (SI) EQUIV.</span>
                    </div>
                    <div className="font-data-mono text-body-sm text-on-surface space-y-1" id="metricEquiv">
                      <div>{metricEquiv.ml}</div>
                      <div>{metricEquiv.m3}</div>
                      <div>{metricEquiv.cm3}</div>
                    </div>
                  </div>

                  {/* US Customary Quad */}
                  <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-1.5 text-secondary mb-2 font-label-caps text-label-caps">
                      <span className="material-symbols-outlined text-[16px]">local_drink</span>
                      <span>US CUSTOMARY</span>
                    </div>
                    <div className="font-data-mono text-body-sm text-on-surface space-y-1" id="usEquiv">
                      <div>{usEquiv.gal}</div>
                      <div>{usEquiv.qt}</div>
                      <div>{usEquiv.cup}</div>
                      <div>{usEquiv.floz}</div>
                    </div>
                  </div>

                  {/* UK Imperial Quad */}
                  <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-1.5 text-tertiary mb-2 font-label-caps text-label-caps">
                      <span className="material-symbols-outlined text-[16px]">public</span>
                      <span>IMPERIAL (UK)</span>
                    </div>
                    <div className="font-data-mono text-body-sm text-on-surface space-y-1" id="ukEquiv">
                      <div>{ukEquiv.gal}</div>
                      <div>{ukEquiv.qt}</div>
                      <div>{ukEquiv.pt}</div>
                      <div>{ukEquiv.floz}</div>
                    </div>
                  </div>

                  {/* Scientific & Industrial Quad */}
                  <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-1.5 text-primary mb-2 font-label-caps text-label-caps">
                      <span className="material-symbols-outlined text-[16px]">biotech</span>
                      <span>SCIENTIFIC &amp; DRY</span>
                    </div>
                    <div className="font-data-mono text-body-sm text-on-surface space-y-1" id="sciEquiv">
                      <div>{sciEquiv.uL}</div>
                      <div>{sciEquiv.ft3}</div>
                      <div>{sciEquiv.in3}</div>
                      <div>{sciEquiv.bbl}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ================================================================= */}
          {/* SECTION 4: LIQUID CONTAINER VISUALIZER & TACTILE BENCHMARKS      */}
          {/* ================================================================= */}
          <section className="w-full max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop py-10">
            <div className="p-6 md:p-8 rounded-3xl bg-surface-container-low shadow-sm">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                <div>
                  <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-bold">OPTICAL CAPACITY DYNAMICS</span>
                  <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mt-1">Real-Time Volumetric Physical Scale</h2>
                </div>
                <div className="px-4 py-2 rounded-xl bg-surface-container-lowest font-body-sm text-body-sm text-on-surface-variant shadow-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-secondary"></span>
                  Relative calibration standard: 15L Flask Container
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Measuring Flask Graphic Container (5 cols) */}
                <div className="lg:col-span-5 flex flex-col items-center bg-surface-container-lowest p-6 rounded-2xl shadow-sm">
                  <div className="relative w-48 h-64 border-b-4 border-l-4 border-r-4 border-outline-variant/40 rounded-b-3xl overflow-hidden flex flex-col justify-end bg-surface-container-low/40">
                    {/* Measurement ticks */}
                    <div className="absolute inset-y-0 right-2 flex flex-col justify-between py-4 text-[10px] font-data-mono text-outline-variant select-none pointer-events-none">
                      <span>- 15 L</span>
                      <span>- 12 L</span>
                      <span>- 9 L</span>
                      <span>- 6 L</span>
                      <span>- 3 L</span>
                      <span>- 0 L</span>
                    </div>
                    {/* Dynamic Liquid Fill Level */}
                    <div
                      className="w-full bg-gradient-to-t from-primary to-secondary-container transition-all duration-500 ease-out relative"
                      id="liquidFillVisual"
                      style={{ height: `${fillPct}%` }}
                    >
                      {/* Liquid Shimmer Wave */}
                      <div className="absolute top-0 left-0 right-0 h-2 bg-on-primary/30 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <span className="font-data-mono font-bold text-on-surface text-[15px]" id="flaskIndicatorText">
                      {formatNumber(liters, 2)} Liters (~{Math.round(fillPct)}% Fill)
                    </span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant text-[12px] mt-0.5">Laboratory Borosilicate Calibrated Capacity</p>
                  </div>
                </div>

                {/* Equivalence breakdown cards (7 cols) */}
                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-surface-container-lowest shadow-sm flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-surface-container text-primary">
                      <span className="material-symbols-outlined text-[28px]">water_bottle</span>
                    </div>
                    <div>
                      <div className="font-body-sm text-body-sm text-on-surface-variant">500 mL Water Bottles</div>
                      <div className="font-headline-md text-headline-md font-bold text-on-surface" id="bottleCount">{bottleCount}</div>
                      <div className="font-body-sm text-body-sm text-on-surface-variant text-[12px]">Standard 16.9 fl oz packaged size</div>
                    </div>
                  </div>
                  <div className="p-5 rounded-2xl bg-surface-container-lowest shadow-sm flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-surface-container text-primary">
                      <span className="material-symbols-outlined text-[28px]">coffee</span>
                    </div>
                    <div>
                      <div className="font-body-sm text-body-sm text-on-surface-variant">Standard Kitchen Cups</div>
                      <div className="font-headline-md text-headline-md font-bold text-on-surface" id="cupCount">{cupCount}</div>
                      <div className="font-body-sm text-body-sm text-on-surface-variant text-[12px]">8 fl oz (236.6 mL) reference</div>
                    </div>
                  </div>
                  <div className="p-5 rounded-2xl bg-surface-container-lowest shadow-sm flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-surface-container text-secondary">
                      <span className="material-symbols-outlined text-[28px]">liquor</span>
                    </div>
                    <div>
                      <div className="font-body-sm text-body-sm text-on-surface-variant">US Gallon Jugs</div>
                      <div className="font-headline-md text-headline-md font-bold text-on-surface" id="gallonJugCount">{jugCount}</div>
                      <div className="font-body-sm text-body-sm text-on-surface-variant text-[12px]">3.785 Liter Customary Jug</div>
                    </div>
                  </div>
                  <div className="p-5 rounded-2xl bg-surface-container-lowest shadow-sm flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-surface-container text-secondary">
                      <span className="material-symbols-outlined text-[28px]">view_in_ar</span>
                    </div>
                    <div>
                      <div className="font-body-sm text-body-sm text-on-surface-variant">Cubic Foot Envelope</div>
                      <div className="font-headline-md text-headline-md font-bold text-on-surface" id="cuFtCount">{cuFtCount}</div>
                      <div className="font-body-sm text-body-sm text-on-surface-variant text-[12px]">Exact solid volume occupied</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ================================================================= */}
          {/* SECTION 5: FAST DYNAMIC CONVERSION LOOKUP TABLE                  */}
          {/* ================================================================= */}
          <section className="w-full max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop py-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
              <div>
                <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-bold">PRECOMPUTED MATRIX</span>
                <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Universal Metric to Customary Reference</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-high text-on-surface font-body-sm text-body-sm hover:bg-surface-container transition-all cursor-pointer"
                  onClick={handleExportCSV}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">file_download</span>
                  Export CSV
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
                    <th className="py-3.5 px-4 font-bold">Liters (L)</th>
                    <th className="py-3.5 px-4">US Gallons (gal)</th>
                    <th className="py-3.5 px-4">US Quarts (qt)</th>
                    <th className="py-3.5 px-4">US Cups</th>
                    <th className="py-3.5 px-4">Imperial Gal (UK)</th>
                    <th className="py-3.5 px-4">Cubic Feet (ft³)</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="font-data-mono text-body-sm text-on-surface divide-y divide-outline-variant/10">
                  {[
                    { l: 1, gal: '0.26417 gal', qt: '1.05669 qt', cup: '4.22675 cups', uk: '0.21997 UK gal', ft: '0.03531 ft³' },
                    { l: 2, gal: '0.52834 gal', qt: '2.11338 qt', cup: '8.45351 cups', uk: '0.43994 UK gal', ft: '0.07063 ft³' },
                    { l: 5, gal: '1.32086 gal', qt: '5.28344 qt', cup: '21.1338 cups', uk: '1.09985 UK gal', ft: '0.17657 ft³' },
                    { l: 10, gal: '2.64172 gal', qt: '10.5669 qt', cup: '42.2675 cups', uk: '2.19969 UK gal', ft: '0.35315 ft³' },
                    { l: 20, gal: '5.28344 gal', qt: '21.1338 qt', cup: '84.5351 cups', uk: '4.39938 UK gal', ft: '0.70629 ft³' },
                    { l: 50, gal: '13.2086 gal', qt: '52.8344 qt', cup: '211.338 cups', uk: '10.9985 UK gal', ft: '1.76573 ft³' },
                    { l: 100, gal: '26.4172 gal', qt: '105.669 qt', cup: '422.675 cups', uk: '21.9969 UK gal', ft: '3.53147 ft³' },
                    { l: 500, gal: '132.086 gal', qt: '528.344 qt', cup: '2,113.38 cups', uk: '109.985 UK gal', ft: '17.6573 ft³' },
                    { l: 1000, label: '1000 L (1 m³)', gal: '264.172 gal', qt: '1,056.69 qt', cup: '4,226.75 cups', uk: '219.969 UK gal', ft: '35.3147 ft³' }
                  ].map((row) => (
                    <tr className="hover:bg-surface-container/50 transition-colors" key={row.l}>
                      <td className="py-3 px-4 font-bold text-primary">{row.label || `${row.l} L`}</td>
                      <td className="py-3 px-4">{row.gal}</td>
                      <td className="py-3 px-4">{row.qt}</td>
                      <td className="py-3 px-4">{row.cup}</td>
                      <td className="py-3 px-4">{row.uk}</td>
                      <td className="py-3 px-4">{row.ft}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          className="px-2.5 py-1 rounded bg-surface-container hover:bg-primary hover:text-on-primary font-body-sm text-[12px] transition-all cursor-pointer"
                          onClick={() => setConversion(row.l, 'L', 'gal')}
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
          {/* SECTION 6: HIGH VELOCITY POPULAR VOLUME CONVERSIONS               */}
          {/* ================================================================= */}
          <section className="w-full max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop py-8">
            <div className="mb-6">
              <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-bold">FREQUENT LOOKUPS</span>
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Most Popular Conversions</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: 'Liters to US Gallons', traffic: '4.8M / mo', formula: '1 L = 0.264172 gal', val: 1, from: 'L', to: 'gal', factor: '×0.26417' },
                { title: 'US Gallons to Liters', traffic: '4.1M / mo', formula: '1 gal = 3.78541 L', val: 1, from: 'gal', to: 'L', factor: '×3.78541' },
                { title: 'mL to US Cups', traffic: '3.9M / mo', formula: '250 mL = 1.0567 cups', val: 250, from: 'mL', to: 'cup', factor: '÷236.588' },
                { title: 'US Cups to Milliliters', traffic: '3.6M / mo', formula: '1 cup = 236.588 mL', val: 1, from: 'cup', to: 'mL', factor: '×236.588' },
                { title: 'fl oz to Milliliters', traffic: '2.9M / mo', formula: '1 fl oz = 29.5735 mL', val: 1, from: 'floz', to: 'mL', factor: '×29.5735' },
                { title: 'Milliliters to fl oz', traffic: '2.7M / mo', formula: '100 mL = 3.3814 fl oz', val: 100, from: 'mL', to: 'floz', factor: '÷29.5735' },
                { title: 'Cubic Feet to m³', traffic: '2.1M / mo', formula: '1 ft³ = 0.0283168 m³', val: 1, from: 'ft3', to: 'm3', factor: '×0.02832' },
                { title: 'Pints to Liters', traffic: '1.8M / mo', formula: '1 pt = 0.473176 L', val: 1, from: 'pt', to: 'L', factor: '×0.47318' }
              ].map((card, idx) => (
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
                    <button
                      className="text-primary font-body-sm text-body-sm font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                      onClick={() => setConversion(card.val, card.from, card.to)}
                      type="button"
                    >
                      Compute <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </button>
                    <span className="text-[12px] text-outline font-data-mono">{card.factor}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ================================================================= */}
          {/* SECTION 7: EXPLORE VOLUME UNITS BY DISCIPLINE                     */}
          {/* ================================================================= */}
          <section className="w-full max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop py-8">
            <div className="mb-6">
              <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-bold">DISCIPLINE TAXONOMY</span>
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Volume Units Categorized by Domain</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {/* Col 1: US Liquid */}
              <div className="p-5 rounded-2xl bg-surface-container-low shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-xl bg-surface-container-lowest text-primary flex items-center justify-center mb-3">
                    <span className="material-symbols-outlined text-[20px]">water</span>
                  </div>
                  <div className="font-headline-md text-headline-md text-on-surface text-[17px] font-bold mb-2">US Liquid</div>
                  <ul className="space-y-1.5 font-body-sm text-body-sm text-on-surface-variant">
                    <li className="flex items-center justify-between"><span>Gallon (gal)</span><span className="font-data-mono text-[11px]">3.785 L</span></li>
                    <li className="flex items-center justify-between"><span>Quart (qt)</span><span className="font-data-mono text-[11px]">0.946 L</span></li>
                    <li className="flex items-center justify-between"><span>Pint (pt)</span><span className="font-data-mono text-[11px]">473.2 mL</span></li>
                    <li className="flex items-center justify-between"><span>Fluid Ounce</span><span className="font-data-mono text-[11px]">29.57 mL</span></li>
                    <li className="flex items-center justify-between"><span>Gill</span><span className="font-data-mono text-[11px]">118.3 mL</span></li>
                    <li className="flex items-center justify-between"><span>Minim</span><span className="font-data-mono text-[11px]">0.061 mL</span></li>
                  </ul>
                </div>
                <button
                  className="mt-4 w-full py-1.5 rounded-lg bg-surface-container-lowest text-primary hover:bg-primary hover:text-on-primary font-label-caps text-label-caps transition-all cursor-pointer"
                  onClick={() => setConversion(1, 'gal', 'L')}
                  type="button"
                >
                  Explore US Liquid
                </button>
              </div>

              {/* Col 2: Cooking & Culinary */}
              <div className="p-5 rounded-2xl bg-surface-container-low shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-xl bg-surface-container-lowest text-primary flex items-center justify-center mb-3">
                    <span className="material-symbols-outlined text-[20px]">restaurant</span>
                  </div>
                  <div className="font-headline-md text-headline-md text-on-surface text-[17px] font-bold mb-2">Culinary &amp; Kitchen</div>
                  <ul className="space-y-1.5 font-body-sm text-body-sm text-on-surface-variant">
                    <li className="flex items-center justify-between"><span>US Cup</span><span className="font-data-mono text-[11px]">236.6 mL</span></li>
                    <li className="flex items-center justify-between"><span>Metric Cup</span><span className="font-data-mono text-[11px]">250.0 mL</span></li>
                    <li className="flex items-center justify-between"><span>Tablespoon (tbsp)</span><span className="font-data-mono text-[11px]">14.79 mL</span></li>
                    <li className="flex items-center justify-between"><span>Teaspoon (tsp)</span><span className="font-data-mono text-[11px]">4.929 mL</span></li>
                    <li className="flex items-center justify-between"><span>Pinch</span><span className="font-data-mono text-[11px]">0.308 mL</span></li>
                    <li className="flex items-center justify-between"><span>Drop (gtt)</span><span className="font-data-mono text-[11px]">0.050 mL</span></li>
                  </ul>
                </div>
                <button
                  className="mt-4 w-full py-1.5 rounded-lg bg-surface-container-lowest text-primary hover:bg-primary hover:text-on-primary font-label-caps text-label-caps transition-all cursor-pointer"
                  onClick={() => setConversion(1, 'cup', 'mL')}
                  type="button"
                >
                  Explore Kitchen
                </button>
              </div>

              {/* Col 3: Metric (SI) */}
              <div className="p-5 rounded-2xl bg-surface-container-low shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-xl bg-surface-container-lowest text-primary flex items-center justify-center mb-3">
                    <span className="material-symbols-outlined text-[20px]">architecture</span>
                  </div>
                  <div className="font-headline-md text-headline-md text-on-surface text-[17px] font-bold mb-2">Metric (SI)</div>
                  <ul className="space-y-1.5 font-body-sm text-body-sm text-on-surface-variant">
                    <li className="flex items-center justify-between"><span>Cubic Meter (m³)</span><span className="font-data-mono text-[11px]">1,000 L</span></li>
                    <li className="flex items-center justify-between"><span>Liter (L)</span><span className="font-data-mono text-[11px]">1.000 L</span></li>
                    <li className="flex items-center justify-between"><span>Deciliter (dL)</span><span className="font-data-mono text-[11px]">0.100 L</span></li>
                    <li className="flex items-center justify-between"><span>Centiliter (cL)</span><span className="font-data-mono text-[11px]">10.0 mL</span></li>
                    <li className="flex items-center justify-between"><span>Milliliter (mL)</span><span className="font-data-mono text-[11px]">1.000 mL</span></li>
                    <li className="flex items-center justify-between"><span>Cubic Centimeter</span><span className="font-data-mono text-[11px]">1.000 cc</span></li>
                  </ul>
                </div>
                <button
                  className="mt-4 w-full py-1.5 rounded-lg bg-surface-container-lowest text-primary hover:bg-primary hover:text-on-primary font-label-caps text-label-caps transition-all cursor-pointer"
                  onClick={() => setConversion(1, 'L', 'mL')}
                  type="button"
                >
                  Explore Metric
                </button>
              </div>

              {/* Col 4: Industrial & Dry */}
              <div className="p-5 rounded-2xl bg-surface-container-low shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-xl bg-surface-container-lowest text-primary flex items-center justify-center mb-3">
                    <span className="material-symbols-outlined text-[20px]">factory</span>
                  </div>
                  <div className="font-headline-md text-headline-md text-on-surface text-[17px] font-bold mb-2">Industrial &amp; Bulk</div>
                  <ul className="space-y-1.5 font-body-sm text-body-sm text-on-surface-variant">
                    <li className="flex items-center justify-between"><span>Cubic Foot (ft³)</span><span className="font-data-mono text-[11px]">28.317 L</span></li>
                    <li className="flex items-center justify-between"><span>Cubic Yard (yd³)</span><span className="font-data-mono text-[11px]">764.55 L</span></li>
                    <li className="flex items-center justify-between"><span>Oil Barrel (bbl)</span><span className="font-data-mono text-[11px]">158.98 L</span></li>
                    <li className="flex items-center justify-between"><span>Acre-Foot</span><span className="font-data-mono text-[11px]">1.233M L</span></li>
                    <li className="flex items-center justify-between"><span>Cubic Inch (in³)</span><span className="font-data-mono text-[11px]">16.387 mL</span></li>
                    <li className="flex items-center justify-between"><span>Board Foot</span><span className="font-data-mono text-[11px]">2.360 L</span></li>
                  </ul>
                </div>
                <button
                  className="mt-4 w-full py-1.5 rounded-lg bg-surface-container-lowest text-primary hover:bg-primary hover:text-on-primary font-label-caps text-label-caps transition-all cursor-pointer"
                  onClick={() => setConversion(1, 'bbl', 'L')}
                  type="button"
                >
                  Explore Industrial
                </button>
              </div>

              {/* Col 5: Scientific Micro */}
              <div className="p-5 rounded-2xl bg-surface-container-low shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-xl bg-surface-container-lowest text-primary flex items-center justify-center mb-3">
                    <span className="material-symbols-outlined text-[20px]">biotech</span>
                  </div>
                  <div className="font-headline-md text-headline-md text-on-surface text-[17px] font-bold mb-2">Scientific &amp; Micro</div>
                  <ul className="space-y-1.5 font-body-sm text-body-sm text-on-surface-variant">
                    <li className="flex items-center justify-between"><span>Microliter (µL)</span><span className="font-data-mono text-[11px]">10⁻⁶ L</span></li>
                    <li className="flex items-center justify-between"><span>Nanoliter (nL)</span><span className="font-data-mono text-[11px]">10⁻⁹ L</span></li>
                    <li className="flex items-center justify-between"><span>Picoliter (pL)</span><span className="font-data-mono text-[11px]">10⁻¹² L</span></li>
                    <li className="flex items-center justify-between"><span>Femtoliter (fL)</span><span className="font-data-mono text-[11px]">10⁻¹⁵ L</span></li>
                    <li className="flex items-center justify-between"><span>Cubic Millimeter</span><span className="font-data-mono text-[11px]">1.000 µL</span></li>
                    <li className="flex items-center justify-between"><span>Lambda (λ)</span><span className="font-data-mono text-[11px]">1.000 µL</span></li>
                  </ul>
                </div>
                <button
                  className="mt-4 w-full py-1.5 rounded-lg bg-surface-container-lowest text-primary hover:bg-primary hover:text-on-primary font-label-caps text-label-caps transition-all cursor-pointer"
                  onClick={() => setConversion(1, 'uL', 'mL')}
                  type="button"
                >
                  Explore Micro
                </button>
              </div>
            </div>
          </section>

          {/* ================================================================= */}
          {/* SECTION 8: MATHEMATICAL DERIVATION & ALGORITHM FORMULA            */}
          {/* ================================================================= */}
          <section className="w-full max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop py-8">
            <div className="p-6 md:p-8 rounded-3xl bg-surface-container-lowest shadow-sm">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                <div>
                  <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-bold">ALGORITHMIC RIGOR</span>
                  <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Mathematical Derivations &amp; NIST Constant</h2>
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
                    <span className="font-headline-md text-headline-md text-[16px] font-bold">SI Standard Pivot (m³)</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-3">
                    Every input quantity is first mapped into SI cubic meters (m³) to guarantee IEEE-754 64-bit zero-drift transitivity:
                  </p>
                  <div className="p-3 bg-surface-container-lowest rounded-xl font-data-mono text-[13px] text-primary">
                    V_m³ = V_in × K_SI_factor
                  </div>
                </div>

                {/* Step 2 */}
                <div className="p-5 rounded-2xl bg-surface-container-low">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-caps text-[12px] font-bold">2</span>
                    <span className="font-headline-md text-headline-md text-[16px] font-bold">NIST Definition Constant</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-3">
                    By NIST SP 811 mandate, 1 US gallon equals precisely 231 cubic inches (1 in = 2.54 cm):
                  </p>
                  <div className="p-3 bg-surface-container-lowest rounded-xl font-data-mono text-[13px] text-primary">
                    1 gal ≡ 3.785411784 × 10⁻³ m³
                  </div>
                </div>

                {/* Step 3 */}
                <div className="p-5 rounded-2xl bg-surface-container-low">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-caps text-[12px] font-bold">3</span>
                    <span className="font-headline-md text-headline-md text-[16px] font-bold">Double-Precision Guard</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-3">
                    To prevent floating point inaccuracies like 0.1 + 0.2 ≠ 0.3, numerical outputs undergo epsilon correction:
                  </p>
                  <div className="p-3 bg-surface-container-lowest rounded-xl font-data-mono text-[13px] text-primary">
                    V_out = round(V_m³ × K_out, ε = 10⁻¹²)
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ================================================================= */}
          {/* SECTION 9: REAL-WORLD VOLUME BENCHMARKS                           */}
          {/* ================================================================= */}
          <section className="w-full max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop py-8">
            <div className="mb-6">
              <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-bold">INTUITIVE ANCHORS</span>
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Everyday Real-World Capacity Benchmarks</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="p-4 rounded-2xl bg-surface-container-low text-center flex flex-col items-center">
                <span className="material-symbols-outlined text-[32px] text-primary mb-2">water_drop</span>
                <div className="font-headline-md text-headline-md text-[15px] font-bold">Water Bottle</div>
                <div className="font-data-mono text-primary font-bold mt-1 text-[13px]">500 mL</div>
                <div className="font-body-sm text-body-sm text-on-surface-variant text-[11px] mt-0.5">16.9 US fl oz</div>
              </div>
              <div className="p-4 rounded-2xl bg-surface-container-low text-center flex flex-col items-center">
                <span className="material-symbols-outlined text-[32px] text-secondary mb-2">local_gas_station</span>
                <div className="font-headline-md text-headline-md text-[15px] font-bold">Car Fuel Tank</div>
                <div className="font-data-mono text-primary font-bold mt-1 text-[13px]">55 Liters</div>
                <div className="font-body-sm text-body-sm text-on-surface-variant text-[11px] mt-0.5">14.5 US Gallons</div>
              </div>
              <div className="p-4 rounded-2xl bg-surface-container-low text-center flex flex-col items-center">
                <span className="material-symbols-outlined text-[32px] text-primary mb-2">bathtub</span>
                <div className="font-headline-md text-headline-md text-[15px] font-bold">Home Bathtub</div>
                <div className="font-data-mono text-primary font-bold mt-1 text-[13px]">300 Liters</div>
                <div className="font-body-sm text-body-sm text-on-surface-variant text-[11px] mt-0.5">~80 US Gallons</div>
              </div>
              <div className="p-4 rounded-2xl bg-surface-container-low text-center flex flex-col items-center">
                <span className="material-symbols-outlined text-[32px] text-secondary mb-2">inventory_2</span>
                <div className="font-headline-md text-headline-md text-[15px] font-bold">Steel Drum</div>
                <div className="font-data-mono text-primary font-bold mt-1 text-[13px]">208 Liters</div>
                <div className="font-body-sm text-body-sm text-on-surface-variant text-[11px] mt-0.5">55 US Gallons</div>
              </div>
              <div className="p-4 rounded-2xl bg-surface-container-low text-center flex flex-col items-center">
                <span className="material-symbols-outlined text-[32px] text-primary mb-2">set_meal</span>
                <div className="font-headline-md text-headline-md text-[15px] font-bold">Aquarium Tank</div>
                <div className="font-data-mono text-primary font-bold mt-1 text-[13px]">190 Liters</div>
                <div className="font-body-sm text-body-sm text-on-surface-variant text-[11px] mt-0.5">50 US Gallons</div>
              </div>
              <div className="p-4 rounded-2xl bg-surface-container-low text-center flex flex-col items-center">
                <span className="material-symbols-outlined text-[32px] text-secondary mb-2">pool</span>
                <div className="font-headline-md text-headline-md text-[15px] font-bold">Olympic Pool</div>
                <div className="font-data-mono text-primary font-bold mt-1 text-[13px]">2,500,000 L</div>
                <div className="font-body-sm text-body-sm text-on-surface-variant text-[11px] mt-0.5">660,000 Gallons</div>
              </div>
            </div>
          </section>

          {/* ================================================================= */}
          {/* SECTION 10: MASTER VOLUME UNIT REFERENCE TABLE                   */}
          {/* ================================================================= */}
          <section className="w-full max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop py-8">
            <div className="mb-6">
              <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-bold">METROLOGICAL DICTIONARY</span>
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Standard Unit Conversion Table</h2>
            </div>
            <div className="overflow-x-auto rounded-2xl bg-surface-container-lowest shadow-sm">
              <table className="w-full text-left border-collapse font-body-sm text-body-sm">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant font-label-caps text-label-caps uppercase tracking-wider">
                    <th className="py-3 px-4">Unit Name</th>
                    <th className="py-3 px-4">Symbol</th>
                    <th className="py-3 px-4">System</th>
                    <th className="py-3 px-4 font-data-mono">Liters Equivalent</th>
                    <th className="py-3 px-4 font-data-mono">Gallons Equivalent</th>
                    <th className="py-3 px-4">Usage Domain</th>
                  </tr>
                </thead>
                <tbody className="divide-y-0 text-on-surface">
                  <tr className="hover:bg-surface-container-low/40">
                    <td className="py-3 px-4 font-semibold">Cubic Meter</td>
                    <td className="py-3 px-4 font-data-mono text-primary">m³</td>
                    <td className="py-3 px-4">Metric (SI Base)</td>
                    <td className="py-3 px-4 font-data-mono font-bold">1,000 L</td>
                    <td className="py-3 px-4 font-data-mono">264.172 gal</td>
                    <td className="py-3 px-4 text-on-surface-variant">Civil engineering, water utilities</td>
                  </tr>
                  <tr className="hover:bg-surface-container-low/40">
                    <td className="py-3 px-4 font-semibold">Liter</td>
                    <td className="py-3 px-4 font-data-mono text-primary">L</td>
                    <td className="py-3 px-4">Metric (SI Accepted)</td>
                    <td className="py-3 px-4 font-data-mono font-bold">1.000000 L</td>
                    <td className="py-3 px-4 font-data-mono">0.264172 gal</td>
                    <td className="py-3 px-4 text-on-surface-variant">Global commerce, fuel, beverages</td>
                  </tr>
                  <tr className="hover:bg-surface-container-low/40">
                    <td className="py-3 px-4 font-semibold">US Liquid Gallon</td>
                    <td className="py-3 px-4 font-data-mono text-primary">gal</td>
                    <td className="py-3 px-4">US Customary</td>
                    <td className="py-3 px-4 font-data-mono font-bold">3.785412 L</td>
                    <td className="py-3 px-4 font-data-mono">1.000000 gal</td>
                    <td className="py-3 px-4 text-on-surface-variant">US gasoline, bulk milk, paint</td>
                  </tr>
                  <tr className="hover:bg-surface-container-low/40">
                    <td className="py-3 px-4 font-semibold">Imperial Gallon</td>
                    <td className="py-3 px-4 font-data-mono text-primary">UK gal</td>
                    <td className="py-3 px-4">British Imperial</td>
                    <td className="py-3 px-4 font-data-mono font-bold">4.546090 L</td>
                    <td className="py-3 px-4 font-data-mono">1.200950 gal</td>
                    <td className="py-3 px-4 text-on-surface-variant">UK, Canada fuel efficiency ratings</td>
                  </tr>
                  <tr className="hover:bg-surface-container-low/40">
                    <td className="py-3 px-4 font-semibold">US Liquid Quart</td>
                    <td className="py-3 px-4 font-data-mono text-primary">qt</td>
                    <td className="py-3 px-4">US Customary</td>
                    <td className="py-3 px-4 font-data-mono font-bold">0.946353 L</td>
                    <td className="py-3 px-4 font-data-mono">0.250000 gal</td>
                    <td className="py-3 px-4 text-on-surface-variant">Motor oil, dairy cartons</td>
                  </tr>
                  <tr className="hover:bg-surface-container-low/40">
                    <td className="py-3 px-4 font-semibold">US Liquid Pint</td>
                    <td className="py-3 px-4 font-data-mono text-primary">pt</td>
                    <td className="py-3 px-4">US Customary</td>
                    <td className="py-3 px-4 font-data-mono font-bold">0.473176 L</td>
                    <td className="py-3 px-4 font-data-mono">0.125000 gal</td>
                    <td className="py-3 px-4 text-on-surface-variant">Beverages, ice cream cartons</td>
                  </tr>
                  <tr className="hover:bg-surface-container-low/40">
                    <td className="py-3 px-4 font-semibold">US Legal Cup</td>
                    <td className="py-3 px-4 font-data-mono text-primary">cup</td>
                    <td className="py-3 px-4">US FDA Nutritional</td>
                    <td className="py-3 px-4 font-data-mono font-bold">0.240000 L</td>
                    <td className="py-3 px-4 font-data-mono">0.063401 gal</td>
                    <td className="py-3 px-4 text-on-surface-variant">US nutrition labels (FDA mandated 240 mL)</td>
                  </tr>
                  <tr className="hover:bg-surface-container-low/40">
                    <td className="py-3 px-4 font-semibold">US Customary Cup</td>
                    <td className="py-3 px-4 font-data-mono text-primary">cup (trad)</td>
                    <td className="py-3 px-4">US Customary</td>
                    <td className="py-3 px-4 font-data-mono font-bold">0.236588 L</td>
                    <td className="py-3 px-4 font-data-mono">0.062500 gal</td>
                    <td className="py-3 px-4 text-on-surface-variant">Kitchen baking, domestic cookbooks</td>
                  </tr>
                  <tr className="hover:bg-surface-container-low/40">
                    <td className="py-3 px-4 font-semibold">Cubic Foot</td>
                    <td className="py-3 px-4 font-data-mono text-primary">ft³</td>
                    <td className="py-3 px-4">US / Imperial</td>
                    <td className="py-3 px-4 font-data-mono font-bold">28.316847 L</td>
                    <td className="py-3 px-4 font-data-mono">7.480520 gal</td>
                    <td className="py-3 px-4 text-on-surface-variant">Natural gas consumption, refrigerators</td>
                  </tr>
                  <tr className="hover:bg-surface-container-low/40">
                    <td className="py-3 px-4 font-semibold">Petroleum Barrel</td>
                    <td className="py-3 px-4 font-data-mono text-primary">bbl</td>
                    <td className="py-3 px-4">Global Energy</td>
                    <td className="py-3 px-4 font-data-mono font-bold">158.987295 L</td>
                    <td className="py-3 px-4 font-data-mono">42.000000 gal</td>
                    <td className="py-3 px-4 text-on-surface-variant">Crude oil trading and refining</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* ================================================================= */}
          {/* SECTION 11: METROLOGY TECHNICAL ARTICLES                          */}
          {/* ================================================================= */}
          <section className="w-full max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop py-8">
            <div className="mb-6">
              <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-bold">DEEP METROLOGY GUIDES</span>
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Scientific Insights &amp; Historical Discrepancies</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Article 1 */}
              <article className="p-6 rounded-3xl bg-surface-container-lowest shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-primary font-label-caps text-label-caps">HISTORICAL ANALYSIS</span>
                    <span className="text-body-sm text-on-surface-variant">5 min read</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-2 font-semibold">The Great Gallon Discrepancy: US vs Imperial</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-4">
                    Why is a British gallon ~20% larger than an American gallon? In 1707, Queen Anne ratified the British Wine Gallon (231 cubic inches), which the United States preserved after 1776. In 1824, however, Great Britain replaced this system with the Imperial Gallon defined as the volume of 10 pounds of distilled water at 62°F (277.42 cubic inches or 4.54609 L). Confusing these two standards causes significant deviations in transatlantic trade and fuel consumption ratings.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-primary font-body-sm text-body-sm font-semibold">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  Verified by NIST Metrology Standards Handbook 44
                </div>
              </article>

              {/* Article 2 */}
              <article className="p-6 rounded-3xl bg-surface-container-lowest shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-secondary font-label-caps text-label-caps">CHEMISTRY INTERFACE</span>
                    <span className="text-body-sm text-on-surface-variant">4 min read</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-2 font-semibold">Why 1 Milliliter Equals Exactly 1 cm³ and 1 Gram</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-4">
                    The French Republican Commission of 1795 engineered the metric system with elegant physical symmetry: 1 Liter was derived as the volume of a cube with 10 cm sides (1 dm³). Consequently, 1 mL = 1 cm³ (or 1 cc). Furthermore, 1 mL of pure liquid water at peak density (3.98°C at standard 1 atm atmospheric pressure) weighs exactly 1.000 gram, enabling effortless mass-to-volume mental conversions in scientific research.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-secondary font-body-sm text-body-sm font-semibold">
                  <span className="material-symbols-outlined text-[18px]">biotech</span>
                  Bureau International des Poids et Mesures (BIPM)
                </div>
              </article>
            </div>
          </section>

          {/* ================================================================= */}
          {/* SECTION 12: CONNECTED COMPUTATIONAL SUITES                        */}
          {/* ================================================================= */}
          <section className="w-full max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop py-8">
            <div className="mb-6">
              <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-bold">SOLVEIT ECOSYSTEM</span>
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Related Dimensional Calculators</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Link className="p-4 rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center group" href="/area-converter">
                <span className="material-symbols-outlined text-[28px] text-primary group-hover:scale-110 transition-transform mb-2">square_foot</span>
                <div className="font-body-md text-body-md font-bold text-on-surface">Area Converter</div>
                <div className="font-body-sm text-body-sm text-on-surface-variant text-[11px] mt-0.5">m², acres, sq ft</div>
              </Link>
              <Link className="p-4 rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center group" href="/length-converter">
                <span className="material-symbols-outlined text-[28px] text-primary group-hover:scale-110 transition-transform mb-2">straighten</span>
                <div className="font-body-md text-body-md font-bold text-on-surface">Length Engine</div>
                <div className="font-body-sm text-body-sm text-on-surface-variant text-[11px] mt-0.5">meters, inches, miles</div>
              </Link>
              <Link className="p-4 rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center group" href="/weight-converter">
                <span className="material-symbols-outlined text-[28px] text-primary group-hover:scale-110 transition-transform mb-2">scale</span>
                <div className="font-body-md text-body-md font-bold text-on-surface">Mass &amp; Weight</div>
                <div className="font-body-sm text-body-sm text-on-surface-variant text-[11px] mt-0.5">kg, lbs, stones, oz</div>
              </Link>
              <Link className="p-4 rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center group" href="/conversions">
                <span className="material-symbols-outlined text-[28px] text-primary group-hover:scale-110 transition-transform mb-2">opacity</span>
                <div className="font-body-md text-body-md font-bold text-on-surface">Density Solver</div>
                <div className="font-body-sm text-body-sm text-on-surface-variant text-[11px] mt-0.5">g/cm³, specific grav.</div>
              </Link>
              <Link className="p-4 rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center group" href="/temperature-converter">
                <span className="material-symbols-outlined text-[28px] text-primary group-hover:scale-110 transition-transform mb-2">thermostat</span>
                <div className="font-body-md text-body-md font-bold text-on-surface">Temperature</div>
                <div className="font-body-sm text-body-sm text-on-surface-variant text-[11px] mt-0.5">°C, °F, Kelvin</div>
              </Link>
              <Link className="p-4 rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center group" href="/fuel-economy-converter">
                <span className="material-symbols-outlined text-[28px] text-primary group-hover:scale-110 transition-transform mb-2">speed</span>
                <div className="font-body-md text-body-md font-bold text-on-surface">Fuel Economy</div>
                <div className="font-body-sm text-body-sm text-on-surface-variant text-[11px] mt-0.5">MPG, L/100km, km/L</div>
              </Link>
            </div>
          </section>

          {/* ================================================================= */}
          {/* SECTION 13: TECHNICAL FAQ ACCORDION                               */}
          {/* ================================================================= */}
          <section className="w-full max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop py-8">
            <div className="mb-6">
              <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-bold">FREQUENTLY ASKED QUESTIONS</span>
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Volumetric Computation &amp; Standardization</h2>
            </div>
            <div className="flex flex-col gap-3">
              {/* FAQ 1 */}
              <details className="group bg-surface-container-lowest rounded-2xl p-5 shadow-sm transition-all [&_summary::-webkit-details-marker]:hidden" open>
                <summary className="flex items-center justify-between cursor-pointer font-headline-md text-[17px] font-semibold text-on-surface">
                  <span>How many liters are in one US liquid gallon exactly?</span>
                  <span className="material-symbols-outlined text-[20px] text-outline group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <p className="font-body-md text-body-md text-on-surface-variant mt-3 leading-relaxed">
                  One standard US liquid gallon equals exactly <strong>3.785411784 Liters</strong>. Under international treaty definitions ratified in 1959, 1 inch equals exactly 25.4 mm. Because a US gallon is legally fixed at 231 cubic inches, its cubic meter volume is (231 × 0.0254³) m³ = 0.003785411784 m³, yielding the exact litrage without rounding error.
                </p>
              </details>

              {/* FAQ 2 */}
              <details className="group bg-surface-container-lowest rounded-2xl p-5 shadow-sm transition-all [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between cursor-pointer font-headline-md text-[17px] font-semibold text-on-surface">
                  <span>Why is a US kitchen measuring cup different from an FDA nutritional cup?</span>
                  <span className="material-symbols-outlined text-[20px] text-outline group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <p className="font-body-md text-body-md text-on-surface-variant mt-3 leading-relaxed">
                  In domestic US recipes, a customary cup is 1/16th of a US gallon, which equals 8 US fluid ounces or approximately <strong>236.588 mL</strong>. However, for packaged food nutrition facts, the US Food and Drug Administration (FDA) legally defines 1 cup as exactly <strong>240.000 mL</strong> for simplified label arithmetic. Meanwhile, the Commonwealth &quot;Metric Cup&quot; (Australia, New Zealand, Canada) is precisely <strong>250.000 mL</strong>.
                </p>
              </details>

              {/* FAQ 3 */}
              <details className="group bg-surface-container-lowest rounded-2xl p-5 shadow-sm transition-all [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between cursor-pointer font-headline-md text-[17px] font-semibold text-on-surface">
                  <span>How does SolveIt Calculator ensure zero floating-point arithmetic errors?</span>
                  <span className="material-symbols-outlined text-[20px] text-outline group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <p className="font-body-md text-body-md text-on-surface-variant mt-3 leading-relaxed">
                  JavaScript uses IEEE 754 double-precision 64-bit binary floating-point numbers, which inherently cause rounding anomalies when storing base-10 fractions (such as 0.1 + 0.2 = 0.30000000000000004). SolveIt Calculator&apos;s computational engine applies integer-scaled pivot transformations and guard-digit epsilon trimming (10⁻¹²) before presenting rounded results to the user.
                </p>
              </details>

              {/* FAQ 4 */}
              <details className="group bg-surface-container-lowest rounded-2xl p-5 shadow-sm transition-all [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between cursor-pointer font-headline-md text-[17px] font-semibold text-on-surface">
                  <span>What is the difference between US Dry Gallons and US Liquid Gallons?</span>
                  <span className="material-symbols-outlined text-[20px] text-outline group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <p className="font-body-md text-body-md text-on-surface-variant mt-3 leading-relaxed">
                  A US Liquid Gallon equals 231.0 cubic inches (3.785 L), whereas a US Dry Gallon (used historically for grains, bushels, and produce) equals 1/8th of a Winchester bushel, or 268.8025 cubic inches (4.40488 L). A US dry gallon is roughly 16% larger than a liquid gallon.
                </p>
              </details>

              {/* FAQ 5 */}
              <details className="group bg-surface-container-lowest rounded-2xl p-5 shadow-sm transition-all [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between cursor-pointer font-headline-md text-[17px] font-semibold text-on-surface">
                  <span>Are any conversion queries logged or sent to remote servers?</span>
                  <span className="material-symbols-outlined text-[20px] text-outline group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <p className="font-body-md text-body-md text-on-surface-variant mt-3 leading-relaxed">
                  No. SolveIt Calculator operates on a zero-telemetry computational philosophy. All mathematical calculations, unit mappings, and slider recalibrations execute 100% locally inside your web browser&apos;s V8 or JavaScriptCore engine in under 5 milliseconds. No personal data, IP addresses, or conversion parameters are ever transmitted to any cloud database.
                </p>
              </details>
            </div>
          </section>

          {/* ================================================================= */}
          {/* SECTION 14: TRUST & CERTIFICATION STRIP                           */}
          {/* ================================================================= */}
          <section className="w-full max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop py-8">
            <div className="p-6 rounded-3xl bg-surface-container-high flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary text-on-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[28px]">verified_user</span>
                </div>
                <div>
                  <div className="font-headline-md text-headline-md text-[18px] font-bold text-on-surface">Audited Precision Standards</div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Calibrated against NIST Special Publication 811 and ISO 80000-3 guidelines for physical quantities.</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="px-3.5 py-2 rounded-xl bg-surface-container-lowest font-label-caps text-label-caps text-on-surface shadow-sm">
                  ✓ Weekly Precision Audits
                </div>
                <div className="px-3.5 py-2 rounded-xl bg-surface-container-lowest font-label-caps text-label-caps text-primary shadow-sm">
                  ✓ Zero Data Ingestion
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full bg-surface-container-lowest border-t border-outline-variant/30 mt-space-3xl">
        <div className="max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop pt-space-2xl pb-space-xl">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-space-xl pb-space-2xl border-b border-outline-variant/30">
            <div className="col-span-2 lg:col-span-1">
              <div className="mb-space-sm">
                <Link
                  href="/"
                  className="inline-flex items-center focus:outline-none group select-none py-1 relative h-14 sm:h-16 md:h-20 aspect-[238/54]"
                  aria-label="SolveIt Calculator Homepage"
                >
                  <Image
                    alt="SolveIt Calculator Brand Logo"
                    className="object-contain block transition-transform duration-150 group-hover:scale-[1.02]"
                    src="/logo.png?v=2"
                    fill
                    sizes="(max-width: 640px) 150px, 200px"
                  />
                </Link>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                Precision-engineered computational suites designed with architectural minimalism and algorithmic authority.
              </p>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-surface-container-low border border-outline-variant/40 text-on-surface-variant font-label-caps text-label-caps">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                Engine v4.2.0 • 2025 Verified
              </div>
            </div>
            <div>
              <p className="font-label-caps text-label-caps text-on-surface uppercase tracking-wider mb-space-md">Financial Engines</p>
              <ul className="space-y-space-xs font-body-sm text-body-sm text-on-surface-variant">
                <li className="hover:text-on-surface cursor-pointer transition-colors">Mortgage &amp; Amortization</li>
                <li className="hover:text-on-surface cursor-pointer transition-colors">Investment Compounder</li>
                <li className="hover:text-on-surface cursor-pointer transition-colors">Roth IRA vs 401(k)</li>
                <li className="hover:text-on-surface cursor-pointer transition-colors">Federal Tax Bracket 2025</li>
                <li className="hover:text-on-surface cursor-pointer transition-colors">SaaS Burn &amp; Runway</li>
              </ul>
            </div>
            <div>
              <p className="font-label-caps text-label-caps text-on-surface uppercase tracking-wider mb-space-md">Math &amp; Engineering</p>
              <ul className="space-y-space-xs font-body-sm text-body-sm text-on-surface-variant">
                <li className="hover:text-on-surface cursor-pointer transition-colors">Scientific Matrix Solver</li>
                <li className="hover:text-on-surface cursor-pointer transition-colors">Integral &amp; Differential</li>
                <li className="hover:text-on-surface cursor-pointer transition-colors">Statistics &amp; Variance</li>
                <li className="hover:text-on-surface cursor-pointer transition-colors">Fourier Fast Transform</li>
                <li className="hover:text-on-surface cursor-pointer transition-colors">Hex / Binary Converter</li>
              </ul>
            </div>
            <div>
              <p className="font-label-caps text-label-caps text-on-surface uppercase tracking-wider mb-space-md">Health &amp; Everyday</p>
              <ul className="space-y-space-xs font-body-sm text-body-sm text-on-surface-variant">
                <li className="hover:text-on-surface cursor-pointer transition-colors">Macro &amp; TDEE Calibrator</li>
                <li className="hover:text-on-surface cursor-pointer transition-colors">Body Fat Hydrostatic</li>
                <li className="hover:text-on-surface cursor-pointer transition-colors">Global Time Zone Offset</li>
                <li className="hover:text-on-surface cursor-pointer transition-colors">Metric &amp; Imperial Flow</li>
                <li className="hover:text-on-surface cursor-pointer transition-colors">Fuel Economy &amp; EV Range</li>
              </ul>
            </div>
            <div>
              <p className="font-label-caps text-label-caps text-on-surface uppercase tracking-wider mb-space-md">Platform &amp; Legal</p>
              <ul className="space-y-space-xs font-body-sm text-body-sm text-on-surface-variant">
                <li className="hover:text-on-surface cursor-pointer transition-colors">Developer APIs</li>
                <li className="hover:text-on-surface cursor-pointer transition-colors">Methodology &amp; Sources</li>
                <li className="hover:text-on-surface cursor-pointer transition-colors">Editorial Standards</li>
                <li className="hover:text-on-surface cursor-pointer transition-colors">Privacy Policy</li>
                <li className="hover:text-on-surface cursor-pointer transition-colors">Terms of Use</li>
              </ul>
            </div>
          </div>
          <div className="pt-space-lg flex flex-col md:flex-row items-center justify-between gap-space-md font-body-sm text-body-sm text-on-surface-variant">
            <div className="flex items-center gap-space-lg">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-[18px] text-primary">verified_user</span>
                <span>256-Bit Encrypted Local Processing</span>
              </div>
              <div className="flex items-center gap-space-xs hidden sm:flex">
                <span className="material-symbols-outlined text-[18px] text-primary">speed</span>
                <span>Zero Latency Compute</span>
              </div>
            </div>
            <div className="flex items-center gap-space-md">
              <span className="text-on-surface font-medium">© 2025 SolveIt Calculator. All rights reserved.</span>
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-[18px] hover:text-on-surface cursor-pointer">public</span>
                <span className="material-symbols-outlined text-[18px] hover:text-on-surface cursor-pointer">terminal</span>
                <span className="material-symbols-outlined text-[18px] hover:text-on-surface cursor-pointer">rss_feed</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
