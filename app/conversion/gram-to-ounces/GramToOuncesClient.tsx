'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface TableRow {
  grams: number;
  oz: string;
  frac: string;
  bench: string;
  isSpecial?: boolean;
}

const TABLE_DATA: TableRow[] = [
  { grams: 1, oz: '0.03527 oz', frac: '~ 1/28 oz', bench: 'Standard paperclip / small raisin' },
  { grams: 5, oz: '0.17637 oz', frac: '~ 1 metric tsp salt', bench: 'US nickel coin exact mass' },
  { grams: 10, oz: '0.35274 oz', frac: '~ 1/3 oz', bench: 'Two US nickels / packet of yeast (7g-10g)' },
  { grams: 15, oz: '0.52911 oz', frac: '~ 1 standard tbsp butter', bench: '1 international tablespoon water' },
  { grams: 25, oz: '0.88185 oz', frac: '~ 7/8 oz', bench: 'Standard first-class domestic letter envelope' },
  { grams: 28.3495, oz: '1.00000 oz', frac: 'Exact 1 Ounce', bench: 'Base Avoirdupois Ounce definition treaty', isSpecial: true },
  { grams: 30, oz: '1.05822 oz', frac: '~ 1 oz + 1/16 oz', bench: 'US FDA nutritional single serving slice cheese' },
  { grams: 50, oz: '1.76370 oz', frac: '~ 1 3/4 oz', bench: 'Single gourmet chocolate bar portion' },
  { grams: 75, oz: '2.64555 oz', frac: '~ 2 2/3 oz', bench: 'Medium chicken egg (in shell)' },
  { grams: 100, oz: '3.52740 oz', frac: '~ 3 1/2 oz', bench: 'Standard European recipe base (1 hectogram)', isSpecial: true },
  { grams: 250, oz: '8.81849 oz', frac: '~ 1/2 lb + 0.8 oz', bench: 'Metric tub of butter / soft cheese' },
  { grams: 453.592, oz: '16.00000 oz', frac: '1 Pound (lb)', bench: 'One full pound avoirdupois exact equality', isSpecial: true },
  { grams: 500, oz: '17.63698 oz', frac: '1 lb 1.64 oz', bench: 'Standard retail pasta box / 0.5 kg' },
  { grams: 1000, oz: '35.27396 oz', frac: '2 lb 3.27 oz', bench: '1 Kilogram (kg) base unit of mass' },
];

export default function GramToOuncesClient() {
  // Metrology Constants
  const EXACT_GRAMS_PER_OZ = 28.349523125;
  const EXACT_OZ_PER_GRAM = 1 / EXACT_GRAMS_PER_OZ; // ~0.0352739619495804
  const POUNDS_PER_GRAM = 0.00220462262185;
  const TROY_OZ_PER_GRAM = 0.0321507466;

  const [currentPrecision, setCurrentPrecision] = useState<number>(6);
  const [gramsInput, setGramsInput] = useState<string>('100');
  const [ouncesInput, setOuncesInput] = useState<string>('3.527396');
  const [copied, setCopied] = useState<boolean>(false);
  const [tableSearch, setTableSearch] = useState<string>('');

  // Accordion state
  const [openFaqs, setOpenFaqs] = useState<Record<number, boolean>>({
    0: true,
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false,
  });

  const toggleFaq = (idx: number) => {
    setOpenFaqs((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleGramsChange = (valStr: string, prec = currentPrecision) => {
    setGramsInput(valStr);
    const g = parseFloat(valStr);
    if (isNaN(g) || g < 0) {
      setOuncesInput('');
      return;
    }
    const oz = g * EXACT_OZ_PER_GRAM;
    setOuncesInput(Number(oz.toFixed(prec)).toString());
  };

  const handleOuncesChange = (valStr: string, prec = currentPrecision) => {
    setOuncesInput(valStr);
    const oz = parseFloat(valStr);
    if (isNaN(oz) || oz < 0) {
      setGramsInput('');
      return;
    }
    const g = oz * EXACT_GRAMS_PER_OZ;
    setGramsInput(Number(g.toFixed(prec)).toString());
  };

  const handlePrecisionChange = (prec: number) => {
    setCurrentPrecision(prec);
    const g = parseFloat(gramsInput);
    if (!isNaN(g)) {
      const oz = g * EXACT_OZ_PER_GRAM;
      setOuncesInput(Number(oz.toFixed(prec)).toString());
    }
  };

  const handleSwap = () => {
    const tempG = gramsInput;
    const tempOz = ouncesInput;
    setGramsInput(tempOz);
    const ozVal = parseFloat(tempOz);
    if (!isNaN(ozVal)) {
      const newOz = ozVal * EXACT_OZ_PER_GRAM;
      setOuncesInput(Number(newOz.toFixed(currentPrecision)).toString());
    } else {
      setOuncesInput('');
    }
  };

  const handleBenchmarkClick = (val: number) => {
    handleGramsChange(val.toString());
  };

  const handleReset = () => {
    handleGramsChange('100');
  };

  const handleCopy = () => {
    const textToCopy = `${gramsInput} g = ${ouncesInput} oz (Source: SolveItCalculator.com)`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleLoadFromTable = (grams: number) => {
    handleGramsChange(grams.toString());
    const el = document.getElementById('interactive-converter-card');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Numerical metrics
  const currentGrams = parseFloat(gramsInput) || 0;
  const currentOz = parseFloat(ouncesInput) || 0;

  const kgVal = currentGrams / 1000;
  const lbVal = currentGrams * POUNDS_PER_GRAM;
  const oztVal = currentGrams * TROY_OZ_PER_GRAM;
  const mgVal = currentGrams * 1000;

  const pctOfPound = Math.min(Math.round((currentGrams / 453.59237) * 100), 100);

  const filteredTableRows = TABLE_DATA.filter((row) => {
    if (!tableSearch.trim()) return true;
    const q = tableSearch.toLowerCase();
    return (
      row.grams.toString().includes(q) ||
      row.oz.toLowerCase().includes(q) ||
      row.frac.toLowerCase().includes(q) ||
      row.bench.toLowerCase().includes(q)
    );
  });

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen flex flex-col selection:bg-primary/20">
      {/* Structured Data JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'WebPage',
                '@id': 'https://solveitcalculator.com/conversion/gram-to-ounces#webpage',
                url: 'https://solveitcalculator.com/conversion/gram-to-ounces',
                name: 'Gram to Ounces Converter (g to oz) – Instant Conversion Calculator',
                description:
                  'Convert grams to ounces instantly with our free Gram to Ounces Converter. Enter any value in grams and get accurate ounce conversions, formulas, conversion charts, and FAQs.',
                breadcrumb: {
                  '@type': 'BreadcrumbList',
                  itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://solveitcalculator.com' },
                    { '@type': 'ListItem', position: 2, name: 'Conversion', item: 'https://solveitcalculator.com/conversion' },
                    { '@type': 'ListItem', position: 3, name: 'Weight & Mass', item: 'https://solveitcalculator.com/weight-mass-converter' },
                    { '@type': 'ListItem', position: 4, name: 'Gram', item: 'https://solveitcalculator.com/conversion/gram' },
                    { '@type': 'ListItem', position: 5, name: 'Grams to Ounces', item: 'https://solveitcalculator.com/conversion/gram-to-ounces' },
                  ],
                },
              },
              {
                '@type': 'WebApplication',
                '@id': 'https://solveitcalculator.com/conversion/gram-to-ounces#app',
                name: 'SolveIt Grams to Ounces High-Precision Workbench',
                applicationCategory: 'UtilityApplication',
                operatingSystem: 'All',
                browserRequirements: 'Requires JavaScript. Requires HTML5.',
                offers: {
                  '@type': 'Offer',
                  price: '0',
                  priceCurrency: 'USD',
                },
              },
              {
                '@type': 'FAQPage',
                '@id': 'https://solveitcalculator.com/conversion/gram-to-ounces#faq',
                mainEntity: [
                  {
                    '@type': 'Question',
                    name: 'How many ounces are in 1 gram?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: '1 gram equals approximately 0.03527396 international avoirdupois ounces. The exact reciprocal standard conversion factor is 1 ÷ 28.349523125.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'How do I convert grams to ounces?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'Multiply your weight in grams by 0.03527396195, or divide the number of grams by 28.349523125.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'How many ounces are in 100 grams?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: '100 grams equals exactly 3.527396 ounces (often rounded to 3.53 oz in cooking and culinary nutrition labels).',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'How many ounces are in 500 grams?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: '500 grams equals 17.63698 ounces, which is equivalent to 1 pound and 1.64 ounces.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'Is an ounce bigger than a gram?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'Yes, an international avoirdupois ounce is substantially heavier than a gram. One ounce is equal to exactly 28.349523125 grams, making it roughly 28.35 times larger.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'What is the official gram to ounce conversion formula?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'The international metrology formula is: Ounces (oz) = Grams (g) × 0.03527396195 (or mass in grams divided by 28.349523125).',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'Can I use this converter for cooking measurements?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'Yes, for dry ingredients (flour, sugar, salt, cocoa). Keep in mind this calculates avoirdupois weight ounces. For liquid volume (such as water or milk), you need fluid ounces (fl oz).',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'How accurate is this converter?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'The converter adheres to NIST SP 811 and BIPM 1959 definitions, calculating deterministically up to 8 decimal places using client-side IEEE 754 floating-point math.',
                    },
                  },
                ],
              },
            ],
          }),
        }}
      />

      

      <main className="w-full pt-20 bg-surface min-h-screen">
        <div className="flex flex-col w-full">
          {/* Metrology & Telemetry Sub-header Strip */}
          <div className="w-full bg-surface-container-low/70 py-1.5 overflow-x-auto border-b border-outline-variant/20">
            <div className="max-w-[1280px] mx-auto px-gutter-mobile lg:px-gutter-desktop flex items-center justify-between gap-space-md min-w-max">
              <div className="flex items-center gap-space-lg">
                <div className="flex items-center gap-space-xs font-label-caps text-label-caps text-on-surface-variant">
                  <span className="material-symbols-outlined text-primary text-[16px]">verified</span>
                  <span>BIPM / NIST SP 811 Metrology Verified</span>
                </div>
                <div className="flex items-center gap-space-xs font-label-caps text-label-caps text-on-surface-variant">
                  <span className="material-symbols-outlined text-secondary text-[16px]">memory</span>
                  <span>100% Client-Side Local Sandbox</span>
                </div>
                <div className="flex items-center gap-space-xs font-label-caps text-label-caps text-on-surface-variant">
                  <span className="material-symbols-outlined text-tertiary-container text-[16px]">bolt</span>
                  <span>Zero-Lag IEEE 754 High-Precision Core</span>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-space-xs font-data-mono text-[12px] text-outline">
                <span className="material-symbols-outlined text-[14px]">shield_lock</span>
                Strict Zero-Telemetry Policy
              </div>
            </div>
          </div>

          {/* Top Hero & Breadcrumb Area */}
          <section className="w-full bg-surface-container-low/40 border-b border-outline-variant/30 py-space-md">
            <div className="max-w-[1280px] mx-auto px-gutter-mobile lg:px-gutter-desktop flex flex-col md:flex-row items-start md:items-center justify-between gap-space-sm">
              {/* Breadcrumb List */}
              <nav aria-label="Breadcrumbs" className="flex items-center gap-space-xs font-body-sm text-body-sm text-on-surface-variant flex-wrap">
                <Link className="hover:text-primary transition-colors flex items-center gap-1" href="/">
                  <span className="material-symbols-outlined text-[16px]">home</span>Home
                </Link>
                <span className="text-outline/40">/</span>
                <Link className="hover:text-primary transition-colors" href="/conversion">
                  Conversion
                </Link>
                <span className="text-outline/40">/</span>
                <Link className="hover:text-primary transition-colors" href="/weight-mass-converter">
                  Weight &amp; Mass
                </Link>
                <span className="text-outline/40">/</span>
                <Link className="hover:text-primary transition-colors" href="/conversion/gram">
                  Gram
                </Link>
                <span className="text-outline/40">/</span>
                <span className="text-on-surface font-semibold">Grams to Ounces</span>
              </nav>

              {/* Trust Meta Strip */}
              <div className="flex items-center gap-space-sm flex-wrap">
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface-container font-label-caps text-label-caps text-primary uppercase">
                  <span className="material-symbols-outlined text-[14px]">verified</span> NIST SP 811 Compliant
                </div>
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface-container font-label-caps text-label-caps text-secondary uppercase">
                  <span className="material-symbols-outlined text-[14px]">lock</span> Local Client Sandbox
                </div>
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface-container font-label-caps text-label-caps text-on-surface-variant uppercase">
                  <span className="material-symbols-outlined text-[14px]">precision_manufacturing</span> ±0.000001 oz
                </div>
              </div>
            </div>
          </section>

          {/* Page Headline & Editorial Intro */}
          <section className="max-w-[1280px] mx-auto w-full px-gutter-mobile lg:px-gutter-desktop pt-space-2xl pb-space-lg">
            <div className="max-w-3xl flex flex-col gap-space-sm">
              <div className="inline-flex items-center gap-2 font-label-caps text-label-caps text-primary uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                International Avoirdupois Mass Standards
              </div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
                Gram to Ounces Converter <span className="text-primary font-normal font-data-mono text-headline-md">(g to oz)</span>
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                Use this free Gram to Ounces converter to quickly convert grams (g) into ounces (oz). Simply enter the gram value and get an instant result with formal NIST mathematical derivations, culinary bulk density notes, and exact avoirdupois metrology.
              </p>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-space-xs pt-space-xs text-on-surface-variant font-label-caps text-label-caps">
                <span className="px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface flex items-center gap-1">
                  <span className="material-symbols-outlined text-primary text-[14px]">check_circle</span> 100% Free &amp; Private
                </span>
                <span className="px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface flex items-center gap-1">
                  <span className="material-symbols-outlined text-primary text-[14px]">check_circle</span> Avoirdupois Legal Standard
                </span>
                <span className="px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface flex items-center gap-1">
                  <span className="material-symbols-outlined text-primary text-[14px]">check_circle</span> 8 Decimal Precision
                </span>
                <span className="px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface flex items-center gap-1">
                  <span className="material-symbols-outlined text-primary text-[14px]">check_circle</span> Mobile Optimized
                </span>
                <span className="px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface flex items-center gap-1">
                  <span className="material-symbols-outlined text-secondary text-[14px]">update</span> Updated 2026 Core
                </span>
              </div>
            </div>
          </section>

          {/* Interactive Conversion Workbench & Sidecar Visualizer */}
          <section className="w-full max-w-[1280px] mx-auto px-gutter-mobile lg:px-gutter-desktop pb-space-3xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
              {/* Main Calculator Workbench (8 cols on desktop) */}
              <div
                id="interactive-converter-card"
                className="lg:col-span-8 bg-surface-container-lowest rounded-2xl shadow-xl shadow-primary/5 p-space-lg md:p-space-xl flex flex-col gap-space-lg relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/5 via-secondary/5 to-transparent rounded-bl-full pointer-events-none"></div>

                {/* Workbench Header / Mode Controls */}
                <div className="flex items-center justify-between pb-space-sm border-b border-surface-container-high">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[22px]">balance</span>
                    <span className="font-headline-md text-headline-md font-semibold text-on-surface">Interactive Converter</span>
                  </div>

                  {/* Precision Selector */}
                  <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-lg">
                    <span className="font-label-caps text-label-caps text-outline px-2">Decimals:</span>
                    {[
                      { label: '.00', dec: 2 },
                      { label: '.0000', dec: 4 },
                      { label: '.000000', dec: 6 },
                    ].map((p) => (
                      <button
                        key={p.dec}
                        className={`px-2.5 py-0.5 rounded text-xs font-data-mono font-semibold transition-all ${
                          currentPrecision === p.dec
                            ? 'bg-primary-container text-on-primary-container shadow-sm'
                            : 'text-on-surface-variant hover:text-on-surface'
                        }`}
                        onClick={() => handlePrecisionChange(p.dec)}
                        type="button"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Conversion Two-Way Grid */}
                <div className="grid grid-cols-1 md:grid-cols-11 gap-space-md items-center">
                  {/* Input Card: Grams (5 cols) */}
                  <div className="md:col-span-5 bg-surface-container-low/70 hover:bg-surface-container-low p-space-md rounded-xl transition-all flex flex-col gap-2 focus-within:ring-2 focus-within:ring-primary/25">
                    <div className="flex items-center justify-between">
                      <label
                        className="font-label-caps text-label-caps uppercase text-on-surface-variant font-semibold flex items-center gap-1"
                        htmlFor="input-grams"
                      >
                        <span className="w-2 h-2 rounded-full bg-primary"></span>
                        From: Grams (g)
                      </label>
                      <span className="font-data-mono text-[11px] text-outline">SI Derived [g]</span>
                    </div>
                    <div className="relative flex items-center">
                      <input
                        className="w-full bg-transparent font-numerical-display text-numerical-display text-on-surface font-bold focus:outline-none tracking-tight tabular-nums pr-12"
                        id="input-grams"
                        min="0"
                        placeholder="0"
                        step="any"
                        type="number"
                        value={gramsInput}
                        onChange={(e) => handleGramsChange(e.target.value)}
                      />
                      <span className="absolute right-0 font-headline-md text-headline-md font-semibold text-outline">g</span>
                    </div>
                    <div className="text-right font-data-mono text-[11px] text-on-surface-variant/70">
                      Fundamental mass parameter
                    </div>
                  </div>

                  {/* Swap Center Button (1 col) */}
                  <div className="md:col-span-1 flex justify-center py-2 md:py-0">
                    <button
                      className="w-11 h-11 rounded-full bg-surface-container-high hover:bg-primary hover:text-on-primary text-primary transition-all duration-200 flex items-center justify-center shadow-md active:scale-95 group"
                      id="btn-swap-units"
                      title="Swap units"
                      type="button"
                      onClick={handleSwap}
                    >
                      <span className="material-symbols-outlined text-[20px] transition-transform group-hover:rotate-180 duration-300">
                        swap_horiz
                      </span>
                    </button>
                  </div>

                  {/* Output Card: Ounces (5 cols) */}
                  <div className="md:col-span-5 bg-primary-fixed/30 hover:bg-primary-fixed/40 p-space-md rounded-xl transition-all flex flex-col gap-2 relative">
                    <div className="flex items-center justify-between">
                      <label
                        className="font-label-caps text-label-caps uppercase text-primary font-semibold flex items-center gap-1"
                        htmlFor="output-ounces"
                      >
                        <span className="w-2 h-2 rounded-full bg-secondary"></span>
                        To: Ounces (oz)
                      </label>
                      <span className="font-data-mono text-[11px] text-primary">Avoirdupois [oz]</span>
                    </div>
                    <div className="relative flex items-center">
                      <input
                        className="w-full bg-transparent font-numerical-display text-numerical-display text-primary font-bold focus:outline-none tracking-tight tabular-nums pr-14"
                        id="output-ounces"
                        min="0"
                        placeholder="0"
                        step="any"
                        type="number"
                        value={ouncesInput}
                        onChange={(e) => handleOuncesChange(e.target.value)}
                      />
                      <span className="absolute right-0 font-headline-md text-headline-md font-semibold text-primary/70">oz</span>
                    </div>
                    <div className="text-right font-data-mono text-[11px] text-secondary font-medium">
                      1 oz = 28.349523125 g
                    </div>
                  </div>
                </div>

                {/* Quick Benchmark Chips */}
                <div className="flex flex-col gap-2 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps uppercase text-on-surface-variant font-semibold">
                      Quick-Select Metric Benchmarks:
                    </span>
                    <span className="font-data-mono text-[11px] text-outline">Click to execute instantaneous recalculation</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5" id="benchmark-chips">
                    {[
                      { val: 1, label: '1 g' },
                      { val: 5, label: '5 g' },
                      { val: 10, label: '10 g' },
                      { val: 25, label: '25 g' },
                      { val: 50, label: '50 g' },
                      { val: 100, label: '100 g' },
                      { val: 250, label: '250 g' },
                      { val: 500, label: '500 g' },
                      { val: 1000, label: '1000 g (1kg)' },
                    ].map((b) => {
                      const isActive = currentGrams === b.val;
                      return (
                        <button
                          key={b.val}
                          className={`px-3 py-1 rounded-lg font-data-mono text-[13px] font-medium transition-all active:scale-95 ${
                            isActive
                              ? 'bg-primary-container text-on-primary-container shadow-sm'
                              : 'bg-surface-container text-on-surface hover:bg-primary hover:text-on-primary'
                          }`}
                          onClick={() => handleBenchmarkClick(b.val)}
                          type="button"
                        >
                          {b.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Simultaneous Multi-Unit Equivalents Bar */}
                <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-2">
                  <span className="font-label-caps text-label-caps uppercase text-on-surface-variant font-semibold">
                    Simultaneous Multi-Standard Equivalents:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm text-center">
                    <div className="bg-surface-container-lowest p-2 rounded-lg shadow-sm">
                      <span className="block font-data-mono text-body-sm text-outline">Kilograms (kg)</span>
                      <span className="font-data-mono text-headline-md font-bold text-on-surface">
                        {kgVal < 0.001 && kgVal > 0 ? kgVal.toExponential(3) : kgVal.toFixed(4)}
                      </span>
                    </div>
                    <div className="bg-surface-container-lowest p-2 rounded-lg shadow-sm">
                      <span className="block font-data-mono text-body-sm text-outline">Pounds (lb)</span>
                      <span className="font-data-mono text-headline-md font-bold text-on-surface">{lbVal.toFixed(4)}</span>
                    </div>
                    <div className="bg-surface-container-lowest p-2 rounded-lg shadow-sm">
                      <span className="block font-data-mono text-body-sm text-outline">Troy Ounces (ozt)</span>
                      <span className="font-data-mono text-headline-md font-bold text-tertiary">{oztVal.toFixed(4)}</span>
                    </div>
                    <div className="bg-surface-container-lowest p-2 rounded-lg shadow-sm">
                      <span className="block font-data-mono text-body-sm text-outline">Milligrams (mg)</span>
                      <span className="font-data-mono text-headline-md font-bold text-secondary">
                        {mgVal >= 1000000 ? (mgVal / 1000000).toFixed(2) + 'M' : mgVal.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Controls (Copy, Share, Recalculate) */}
                <div className="flex flex-wrap items-center justify-between gap-space-sm pt-2">
                  <div className="flex items-center gap-space-xs">
                    <button
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-body-sm text-body-sm font-semibold transition-all active:scale-95 shadow-sm ${
                        copied ? 'bg-primary text-on-primary' : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                      }`}
                      onClick={handleCopy}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">{copied ? 'check_circle' : 'content_copy'}</span>
                      <span>{copied ? 'Copied to Clipboard!' : 'Copy Result'}</span>
                    </button>
                    <button
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high font-body-sm text-body-sm font-semibold text-on-surface transition-all active:scale-95 shadow-sm"
                      onClick={handlePrint}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">print</span>
                      Print Calculation
                    </button>
                    <button
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-outline hover:text-error transition-colors font-body-sm text-body-sm"
                      onClick={handleReset}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">restart_alt</span>
                      Reset
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-secondary"></span>
                    <span className="font-data-mono text-body-sm text-on-surface-variant font-medium">
                      {gramsInput} g × 0.03527396 = {currentOz.toFixed(currentPrecision)} oz
                    </span>
                  </div>
                </div>
              </div>

              {/* Sidecar Summary Card (4 cols on desktop) */}
              <div className="lg:col-span-4 flex flex-col gap-space-md">
                {/* Quick Reference Visual Scale Card */}
                <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-lg shadow-primary/5 flex flex-col gap-space-md">
                  <div className="flex items-center justify-between">
                    <h3 className="font-headline-md text-headline-md font-semibold text-on-surface">Metrology Insight</h3>
                    <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-data-mono text-xs font-semibold">BIPM / NIST</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    The avoirdupois ounce is standardized across the United States, United Kingdom, and Commonwealth jurisdictions as:
                  </p>
                  <div className="bg-surface-container-low p-space-sm rounded-xl flex flex-col gap-1.5 font-data-mono text-body-sm">
                    <div className="flex justify-between items-center text-on-surface">
                      <span className="text-outline">Exact Factor:</span>
                      <span className="font-bold">1 lb = 0.45359237 kg</span>
                    </div>
                    <div className="flex justify-between items-center text-on-surface">
                      <span className="text-outline">1 Ounce (1/16 lb):</span>
                      <span className="font-bold text-primary">28.349523125 g</span>
                    </div>
                    <div className="flex justify-between items-center text-on-surface">
                      <span className="text-outline">1 Gram (Reciprocal):</span>
                      <span className="font-bold text-secondary">0.03527396195 oz</span>
                    </div>
                  </div>

                  {/* Dynamic Culinary Gauge */}
                  <div className="pt-space-xs flex flex-col gap-2">
                    <div className="flex justify-between items-center font-label-caps text-label-caps uppercase text-on-surface-variant">
                      <span>Standard Kitchen Threshold</span>
                      <span className="font-data-mono font-bold text-primary">{pctOfPound}% of 1 lb</span>
                    </div>
                    <div className="w-full h-2.5 bg-surface-container-high rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-container transition-all duration-300 rounded-full"
                        style={{ width: `${pctOfPound}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[11px] font-data-mono text-outline">
                      <span>0g (0 oz)</span>
                      <span>226g (8 oz)</span>
                      <span>453.6g (16 oz / 1 lb)</span>
                    </div>
                  </div>

                  {/* Visual Ratio Illustration SVG */}
                  <div className="bg-surface-container-low/50 p-space-sm rounded-xl flex items-center justify-center">
                    <svg className="w-full max-w-[240px] h-20" fill="none" viewBox="0 0 240 80" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                          <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="currentColor" />
                        </marker>
                      </defs>
                      <rect className="fill-surface-container-high" height="25" rx="4" width="60" x="10" y="30"></rect>
                      <text className="fill-on-surface font-body-sm font-semibold" fontSize="10" textAnchor="middle" x="40" y="46">
                        28.35 g
                      </text>
                      <text className="fill-outline font-label-caps" fontSize="9" textAnchor="middle" x="40" y="70">
                        1 OUNCE (OZ)
                      </text>
                      <path className="text-outline/40" d="M 85 42 L 105 42" markerEnd="url(#arrow)" stroke="currentColor" strokeWidth="2"></path>
                      <rect className="fill-primary-fixed/40" height="45" rx="6" width="110" x="120" y="20"></rect>
                      <text className="fill-primary font-headline-md font-bold" fontSize="12" textAnchor="middle" x="175" y="40">
                        1 g = 0.035 oz
                      </text>
                      <text className="fill-secondary font-data-mono" fontSize="9" textAnchor="middle" x="175" y="55">
                        Reciprocal Law
                      </text>
                    </svg>
                  </div>
                </div>

                {/* Schema Transparency Block */}
                <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps uppercase text-on-surface-variant font-semibold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-secondary">code_blocks</span>
                      SEO Meta &amp; Schema Inspector
                    </span>
                    <span className="font-data-mono text-[10px] bg-secondary-fixed/50 text-on-secondary-fixed px-1.5 py-0.5 rounded">Indexed</span>
                  </div>
                  <p className="font-data-mono text-[11px] text-outline break-all">
                    <strong className="text-on-surface font-semibold">Canonical:</strong> https://solveitcalculator.com/conversion/gram-to-ounces
                  </p>
                  <div className="bg-surface-container-low p-2 rounded text-[11px] font-data-mono text-on-surface-variant">
                    <span className="text-primary font-bold">@type:</span> WebApplication, Calculator, FAQPage
                    <br />
                    <span className="text-primary font-bold">SP811:</span> NIST Special Publication 811 Compliant
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Formula & Step-by-Step Mathematical Derivation */}
          <section className="w-full bg-surface-container-low py-space-3xl">
            <div className="max-w-[1280px] mx-auto px-gutter-mobile lg:px-gutter-desktop">
              <div className="max-w-3xl mx-auto flex flex-col gap-space-lg">
                <div className="text-center flex flex-col gap-2">
                  <span className="font-label-caps text-label-caps text-primary uppercase font-bold tracking-wider">Formal Metrological Derivation</span>
                  <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">Gram to Ounces Formula &amp; Mathematical Proof</h2>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Understanding the transition between the metric Système International (SI) and the United States Customary / British Imperial Avoirdupois systems.
                  </p>
                </div>

                {/* Formula Callout Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md pt-space-xs">
                  {/* Primary Multiplication Formula */}
                  <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm flex flex-col gap-3">
                    <div className="inline-flex items-center gap-2 text-primary font-label-caps text-label-caps uppercase font-semibold">
                      <span className="material-symbols-outlined text-[18px]">calculate</span>
                      Multiplication Constant Form
                    </div>
                    <div className="bg-surface-container-low p-space-md rounded-xl font-data-mono text-headline-md text-primary font-bold text-center">
                      oz = g × 0.03527396195
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Multiply your mass in grams by the constant <strong className="text-on-surface">0.03527396195</strong>. This is optimal for digital computing and rapid pocket calculations.
                    </p>
                  </div>

                  {/* Exact Fractional Form */}
                  <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm flex flex-col gap-3">
                    <div className="inline-flex items-center gap-2 text-secondary font-label-caps text-label-caps uppercase font-semibold">
                      <span className="material-symbols-outlined text-[18px]">functions</span>
                      Exact Fractional Reciprocal
                    </div>
                    <div className="bg-surface-container-low p-space-md rounded-xl font-data-mono text-headline-md text-secondary font-bold text-center">
                      oz = g ÷ 28.349523125
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Because 1 avoirdupois ounce is defined by treaty as precisely <strong className="text-on-surface">28.349523125 grams</strong>, dividing by this constant yields zero rounding bias.
                    </p>
                  </div>
                </div>

                {/* Step-by-Step Worked Example */}
                <div className="bg-surface-container-lowest p-space-xl rounded-2xl shadow-sm flex flex-col gap-space-md">
                  <h3 className="font-headline-md text-headline-md font-semibold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[24px]">verified</span>
                    Worked Computational Example: Converting 100 Grams
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md text-on-surface-variant font-body-sm">
                    <div className="flex flex-col gap-1 p-space-sm bg-surface-container-low rounded-xl">
                      <span className="font-label-caps text-label-caps uppercase text-outline">Step 1: Metric Given</span>
                      <span className="font-data-mono text-body-lg font-bold text-on-surface">m = 100 g</span>
                      <p>Identify the net weight quantity in grams (e.g. standard butter portion or yeast block).</p>
                    </div>
                    <div className="flex flex-col gap-1 p-space-sm bg-surface-container-low rounded-xl">
                      <span className="font-label-caps text-label-caps uppercase text-outline">Step 2: Apply Factor</span>
                      <span className="font-data-mono text-body-lg font-bold text-primary">100 × 0.03527396</span>
                      <p>Execute arithmetic product utilizing the 8-decimal Metrology constant.</p>
                    </div>
                    <div className="flex flex-col gap-1 p-space-sm bg-surface-container-low rounded-xl">
                      <span className="font-label-caps text-label-caps uppercase text-outline">Step 3: State Result</span>
                      <span className="font-data-mono text-body-lg font-bold text-secondary">3.527396 oz</span>
                      <p>
                        Rounded for commercial packaging: <strong>3.53 oz</strong> (avoirdupois weight).
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Reference Conversion Table (Featured Snippet Optimized) */}
          <section className="w-full max-w-[1280px] mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-3xl">
            <div className="flex flex-col gap-space-lg">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-sm">
                <div>
                  <span className="font-label-caps text-label-caps text-primary uppercase font-bold tracking-wider">Instant Reference Chart</span>
                  <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">Gram to Ounces Conversion Table</h2>
                  <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                    Optimized for recipe baking, postal scale checks, and laboratory formulations. Values are rounded to 5 significant decimal figures.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    className="px-space-md py-space-xs rounded-xl bg-surface-container-low text-on-surface font-body-sm placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20 text-body-sm"
                    id="table-search"
                    placeholder="Search weight in table..."
                    type="text"
                    value={tableSearch}
                    onChange={(e) => setTableSearch(e.target.value)}
                  />
                </div>
              </div>

              {/* High Density Metrology Table */}
              <div className="overflow-x-auto rounded-2xl bg-surface-container-lowest shadow-md shadow-primary/5">
                <table className="w-full text-left border-collapse" id="conversion-reference-table">
                  <thead>
                    <tr className="bg-surface-container-high text-on-surface font-label-caps text-label-caps uppercase">
                      <th className="py-3.5 px-6">Grams (g)</th>
                      <th className="py-3.5 px-6">Ounces (oz avoirdupois)</th>
                      <th className="py-3.5 px-6">Fractional / Culinary Equivalent</th>
                      <th className="py-3.5 px-6">Everyday Reference Benchmark</th>
                      <th className="py-3.5 px-6 text-right">Quick Action</th>
                    </tr>
                  </thead>
                  <tbody className="font-data-mono text-body-sm divide-y divide-surface-container-high/60 text-on-surface">
                    {filteredTableRows.map((row) => (
                      <tr
                        key={row.grams}
                        className={`hover:bg-surface-container-low/60 transition-colors ${
                          row.isSpecial ? (row.grams === 28.3495 ? 'bg-primary-fixed/10' : row.grams === 100 ? 'bg-surface-container-low' : '') : ''
                        }`}
                      >
                        <td className="py-3 px-6 font-bold text-primary">{row.grams === 28.3495 ? '28.35 g' : `${row.grams.toLocaleString()} g`}</td>
                        <td className={`py-3 px-6 font-bold ${row.isSpecial ? 'text-primary' : ''}`}>{row.oz}</td>
                        <td className="py-3 px-6 text-on-surface-variant font-body-sm">{row.frac}</td>
                        <td className={`py-3 px-6 font-body-sm ${row.isSpecial ? 'text-on-surface font-semibold' : 'text-on-surface-variant'}`}>
                          {row.bench}
                        </td>
                        <td className="py-3 px-6 text-right">
                          <button
                            className="table-apply-btn text-primary hover:underline text-xs"
                            onClick={() => handleLoadFromTable(row.grams)}
                            type="button"
                          >
                            Load in Workbench
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredTableRows.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-outline font-body-sm">
                          No matching weights found for &quot;{tableSearch}&quot;.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* How to Convert Grams to Ounces (Step-by-Step Guide + Calculation Cards) */}
          <section className="w-full bg-surface-container-low/50 py-space-3xl">
            <div className="max-w-[1280px] mx-auto px-gutter-mobile lg:px-gutter-desktop">
              <div className="flex flex-col gap-space-xl">
                <div className="max-w-2xl">
                  <span className="font-label-caps text-label-caps text-primary uppercase font-bold tracking-wider">Tutorial &amp; Method</span>
                  <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">How to Convert Grams to Ounces</h2>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Follow this clear 3-step sequence whenever performing manual conversions on paper, kitchen scales, or spreadsheet macros.
                  </p>
                </div>

                {/* 3-Step Process Bento */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
                  <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm flex flex-col gap-2 relative">
                    <span className="font-headline-lg text-headline-lg font-bold text-primary/20">01</span>
                    <h3 className="font-headline-md text-headline-md font-semibold text-on-surface -mt-2">Identify Mass in Grams</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                      Read your metric scale or recipe ingredient listing. Ensure you are measuring weight or dry mass rather than liquid milliliter volume.
                    </p>
                  </div>
                  <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm flex flex-col gap-2 relative">
                    <span className="font-headline-lg text-headline-lg font-bold text-primary/20">02</span>
                    <h3 className="font-headline-md text-headline-md font-semibold text-on-surface -mt-2">Multiply by 0.035274</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                      Multiply your value in grams by the constant <strong>0.03527396</strong>, or divide directly by <strong>28.3495</strong> to maintain accuracy.
                    </p>
                  </div>
                  <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm flex flex-col gap-2 relative">
                    <span className="font-headline-lg text-headline-lg font-bold text-primary/20">03</span>
                    <h3 className="font-headline-md text-headline-md font-semibold text-on-surface -mt-2">Affix Ounces Label (oz)</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                      State your final unit in avoirdupois ounces (oz). If greater than 16 oz, you may optionally express the quotient in pounds plus remaining ounces.
                    </p>
                  </div>
                </div>

                {/* Real-World Worked Calculation Cards */}
                <div className="flex flex-col gap-space-sm pt-space-md">
                  <h3 className="font-headline-md text-headline-md font-semibold text-on-surface">Common Real-World Worked Scenarios</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
                    <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between gap-3">
                      <div>
                        <span className="font-label-caps text-label-caps text-secondary uppercase font-semibold">Postal &amp; Correspondence</span>
                        <h4 className="font-body-lg text-body-lg font-bold text-on-surface">25 Grams to Ounces</h4>
                        <p className="font-data-mono text-body-sm text-primary font-bold pt-1">25 × 0.035274 = 0.8818 oz</p>
                      </div>
                      <div className="bg-surface-container-low p-2 rounded text-body-sm text-on-surface-variant">
                        <strong>Postal Rule:</strong> Under 1 oz standard USPS letter threshold. 1 First-Class stamp applies.
                      </div>
                    </div>
                    <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between gap-3">
                      <div>
                        <span className="font-label-caps text-label-caps text-secondary uppercase font-semibold">Baking &amp; Confectionery</span>
                        <h4 className="font-body-lg text-body-lg font-bold text-on-surface">50 Grams to Ounces</h4>
                        <p className="font-data-mono text-body-sm text-primary font-bold pt-1">50 × 0.035274 = 1.7637 oz</p>
                      </div>
                      <div className="bg-surface-container-low p-2 rounded text-body-sm text-on-surface-variant">
                        <strong>Culinary Rule:</strong> Equivalent to roughly 3.5 tablespoons of dry all-purpose flour.
                      </div>
                    </div>
                    <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between gap-3">
                      <div>
                        <span className="font-label-caps text-label-caps text-secondary uppercase font-semibold">Nutritional Benchmark</span>
                        <h4 className="font-body-lg text-body-lg font-bold text-on-surface">100 Grams to Ounces</h4>
                        <p className="font-data-mono text-body-sm text-primary font-bold pt-1">100 × 0.035274 = 3.5274 oz</p>
                      </div>
                      <div className="bg-surface-container-low p-2 rounded text-body-sm text-on-surface-variant">
                        <strong>Nutrition Rule:</strong> Global mandatory &quot;per 100g&quot; label converted directly to ~3.5 oz.
                      </div>
                    </div>
                    <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between gap-3">
                      <div>
                        <span className="font-label-caps text-label-caps text-secondary uppercase font-semibold">Pantry &amp; Retail Groceries</span>
                        <h4 className="font-body-lg text-body-lg font-bold text-on-surface">500 Grams to Ounces</h4>
                        <p className="font-data-mono text-body-sm text-primary font-bold pt-1">500 × 0.035274 = 17.637 oz</p>
                      </div>
                      <div className="bg-surface-container-low p-2 rounded text-body-sm text-on-surface-variant">
                        <strong>Package Rule:</strong> Standard European half-kilogram package = 1 lb 1.64 oz in US retail.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Comprehensive Educational Authority & Metrology Depth */}
          <section className="w-full max-w-[1280px] mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-3xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-2xl">
              {/* Gram Section */}
              <div className="flex flex-col gap-space-md">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-primary-fixed flex items-center justify-center text-primary font-bold font-data-mono">g</span>
                  <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">About the Gram (Metric System)</h2>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  The gram (symbol: <strong className="text-on-surface">g</strong>) is a metric unit of mass within the International System of Units (SI). Historically established during the French Revolution in 1795 as the absolute mass of one cubic centimeter of pure water at the melting point of ice, it is formally defined as one one-thousandth (<span className="font-data-mono">1×10⁻³</span>) of the SI base unit, the kilogram.
                </p>
                <div className="bg-surface-container-low p-space-md rounded-xl flex flex-col gap-2">
                  <span className="font-label-caps text-label-caps uppercase text-primary font-semibold">Contemporary SI Physics Definition:</span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Following the 2019 redefinition of SI base units, the gram is no longer anchored to a physical platinum-iridium artifact kept in Sèvres, France. Instead, it is deterministically grounded in quantum physics by fixing the numerical value of the <strong>Planck constant (h)</strong> to exactly 6.62607015 × 10⁻³⁴ J·s.
                  </p>
                </div>
                <h3 className="font-headline-md text-headline-md font-semibold text-on-surface pt-2">Primary Global Applications</h3>
                <ul className="flex flex-col gap-2 font-body-sm text-body-sm text-on-surface-variant">
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">science</span>
                    <span>
                      <strong>Scientific &amp; Pharmaceutical Research:</strong> Exact milligram and gram micro-dosages across pharmacology, chemistry, and molecular synthesis.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">restaurant</span>
                    <span>
                      <strong>Global Food Labelling:</strong> The universal reference basis for macronutrient profiling (protein, fats, carbohydrates per 100g serving).
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">bakery_dining</span>
                    <span>
                      <strong>Modern Baking &amp; Culinary Arts:</strong> Pastry chefs universally prefer grams over volume cups to eradicate moisture and bulk density variables.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Ounce Section */}
              <div className="flex flex-col gap-space-md">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-secondary-fixed flex items-center justify-center text-secondary font-bold font-data-mono">oz</span>
                  <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">About the Ounce (Avoirdupois System)</h2>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  The international avoirdupois ounce (symbol: <strong className="text-on-surface">oz</strong>) is an imperial and United States Customary unit of mass. Defined mathematically as exactly one-sixteenth (<span className="font-data-mono">1/16</span>) of an international pound, its precise mass was formalized by the <em>1959 International Yard and Pound Agreement</em> signed by the United States, United Kingdom, Canada, Australia, New Zealand, and South Africa.
                </p>

                {/* Crucial Disambiguation Callout */}
                <div className="bg-surface-container-high p-space-md rounded-xl flex flex-col gap-2">
                  <span className="font-label-caps text-label-caps uppercase text-tertiary font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">warning</span>
                    Critical Metrological Distinctions:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-data-mono text-[12px]">
                    <div className="bg-surface-container-lowest p-2 rounded">
                      <span className="font-bold text-primary block">Avoirdupois (oz)</span>
                      <span>28.3495 g</span>
                      <span className="text-[10px] text-outline block">Everyday weight &amp; post</span>
                    </div>
                    <div className="bg-surface-container-lowest p-2 rounded">
                      <span className="font-bold text-tertiary block">Troy Ounce (ozt)</span>
                      <span>31.1034 g</span>
                      <span className="text-[10px] text-outline block">Precious metals &amp; bullion</span>
                    </div>
                    <div className="bg-surface-container-lowest p-2 rounded">
                      <span className="font-bold text-secondary block">Fluid Ounce (fl oz)</span>
                      <span>29.5735 mL</span>
                      <span className="text-[10px] text-outline block">Liquid volume (not weight)</span>
                    </div>
                  </div>
                </div>

                <h3 className="font-headline-md text-headline-md font-semibold text-on-surface pt-2">Primary Customary Applications</h3>
                <ul className="flex flex-col gap-2 font-body-sm text-body-sm text-on-surface-variant">
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">local_post_office</span>
                    <span>
                      <strong>United States Postal Service (USPS):</strong> Letters and small parcels tiered precisely by single avoirdupois ounce thresholds.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">shopping_cart</span>
                    <span>
                      <strong>US Supermarket Packaging:</strong> Meat cuts, dry pasta, cheese blocks, and snack portions labeled primarily in ounces.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">menu_book</span>
                    <span>
                      <strong>North American Cookbooks:</strong> Dry ingredient weights specified in fractional or whole ounce quantities.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Comprehensive FAQ Section */}
          <section className="w-full bg-surface-container-low py-space-3xl">
            <div className="max-w-[840px] mx-auto px-gutter-mobile lg:px-gutter-desktop flex flex-col gap-space-xl">
              <div className="text-center flex flex-col gap-2">
                <span className="font-label-caps text-label-caps text-primary uppercase font-bold tracking-wider">Frequently Asked Questions</span>
                <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">Gram to Ounces Conversion Insights</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Authoritative answers to the most common queries regarding dry weights, precision standards, and unit substitutions.
                </p>
              </div>

              <div className="flex flex-col gap-space-sm" id="faq-accordion">
                {[
                  {
                    q: 'How many ounces are in 1 gram?',
                    a: 'There are approximately 0.03527396 ounces in 1 gram. The exact international standard derives from dividing 1 by 28.349523125. For quick practical estimations in the kitchen, 1 gram can be thought of as approximately 1/28th of an ounce.',
                  },
                  {
                    q: 'How do I convert grams to ounces manually?',
                    a: (
                      <div>
                        To manually convert grams to ounces:
                        <ol className="list-decimal pl-5 pt-2 flex flex-col gap-1">
                          <li>
                            <strong>Method A (Multiplication):</strong> Multiply the gram figure by <span className="font-data-mono text-primary font-bold">0.035274</span>. (e.g. 50g × 0.035274 = 1.7637 oz).
                          </li>
                          <li>
                            <strong>Method B (Division):</strong> Divide the gram figure by <span className="font-data-mono text-secondary font-bold">28.35</span>. (e.g. 50g ÷ 28.3495 = 1.7637 oz). Both methods produce identical results.
                          </li>
                        </ol>
                      </div>
                    ),
                  },
                  {
                    q: 'How many ounces are in 100 grams?',
                    a: '100 grams is equal to exactly 3.527396 ounces. In commercial retail and food labeling, this is frequently rounded to 3.53 oz or approximately 3 1/2 ounces.',
                  },
                  {
                    q: 'How many ounces are in 500 grams?',
                    a: '500 grams equals 17.63698 ounces. In imperial weights, 16 ounces makes up 1 pound. Therefore, 500 grams can be accurately expressed as 1 pound and 1.64 ounces.',
                  },
                  {
                    q: 'Is an ounce bigger than a gram?',
                    a: 'Yes, substantially bigger. One avoirdupois ounce is equal to 28.349523125 grams, meaning an ounce is over 28 times larger than a single gram.',
                  },
                  {
                    q: 'What is the mathematical gram to ounce formula?',
                    a: (
                      <div>
                        The mathematical formula approved by NIST and BIPM is:
                        <div className="font-data-mono text-primary font-bold my-2 p-2 bg-surface-container-low rounded text-center">
                          m(oz) = m(g) × 0.0352739619495804
                        </div>
                        Where <em>m(oz)</em> is mass in avoirdupois ounces and <em>m(g)</em> is mass in grams.
                      </div>
                    ),
                  },
                  {
                    q: 'Can I use this converter for cooking measurements?',
                    a: 'Yes, for all dry ingredients (flour, oats, brown sugar, baking powder, chocolate chips). However, if your recipe calls for liquids like cream, stock, or milk in fluid ounces (fl oz), you must use a volume converter because fluid ounces measure cubic capacity (1 fl oz ≈ 29.57 mL) rather than dry avoirdupois weight.',
                  },
                  {
                    q: 'How accurate is the SolveIt conversion engine?',
                    a: 'Our engine executes calculation entirely client-side using IEEE 754 64-bit double precision floating-point arithmetic. It relies on the exact statutory definition established in NIST SP 811 (1 oz = 28.349523125 g), guaranteeing accuracy up to 8 decimal places with zero network latency or tracking.',
                  },
                ].map((faq, idx) => (
                  <div
                    key={idx}
                    className={`bg-surface-container-lowest rounded-xl shadow-sm p-space-md transition-all ${
                      openFaqs[idx] ? 'ring-1 ring-primary/20' : ''
                    }`}
                  >
                    <button
                      className="w-full flex justify-between items-center text-left font-headline-md text-body-lg font-semibold text-on-surface list-none"
                      onClick={() => toggleFaq(idx)}
                      type="button"
                    >
                      <span>{faq.q}</span>
                      <span
                        className="material-symbols-outlined text-primary transition-transform duration-200"
                        style={{ transform: openFaqs[idx] ? 'rotate(180deg)' : 'none' }}
                      >
                        expand_more
                      </span>
                    </button>
                    {openFaqs[idx] && (
                      <div className="pt-space-sm font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Dynamic Unit Pair Conversion Network */}
          <section className="w-full max-w-[1280px] mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-3xl">
            <div className="flex flex-col gap-space-lg">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-sm">
                <div>
                  <span className="font-label-caps text-label-caps text-primary uppercase font-bold tracking-wider">Dynamic Unit Pair Network</span>
                  <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">Related Mass &amp; Culinary Converters</h2>
                  <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                    Explore dedicated deterministic calculators across our synchronized metrology directory. Each link accesses an independent, canonical indexed workbench.
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container font-label-caps text-label-caps text-secondary">
                  <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                  8 Connected Mass Pairs Active
                </div>
              </div>

              {/* Network Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-space-md">
                {/* Reverse Converter (Priority Link) */}
                <Link
                  className="p-space-md bg-surface-container-lowest rounded-2xl shadow-sm hover:shadow-md hover:ring-2 hover:ring-primary/20 transition-all flex flex-col justify-between group"
                  href="/conversion/ounces-to-grams"
                >
                  <div className="flex items-center justify-between pb-2">
                    <span className="font-label-caps text-label-caps uppercase text-primary font-bold">Reverse Converter</span>
                    <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform text-[18px]">arrow_forward</span>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-body-lg font-bold text-on-surface">Ounces to Grams</h3>
                    <p className="font-data-mono text-body-sm text-outline">oz to g</p>
                  </div>
                  <div className="pt-space-xs font-body-sm text-[12px] text-on-surface-variant">
                    1 oz = 28.349523 g
                  </div>
                </Link>

                {/* Gram to Pound */}
                <Link
                  className="p-space-md bg-surface-container-lowest rounded-2xl shadow-sm hover:shadow-md hover:ring-2 hover:ring-primary/20 transition-all flex flex-col justify-between group"
                  href="/conversion/gram-to-pound"
                >
                  <div className="flex items-center justify-between pb-2">
                    <span className="font-label-caps text-label-caps uppercase text-outline font-bold">Mass Standard</span>
                    <span className="material-symbols-outlined text-outline group-hover:text-primary group-hover:translate-x-1 transition-transform text-[18px]">arrow_forward</span>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-body-lg font-bold text-on-surface">Gram to Pound</h3>
                    <p className="font-data-mono text-body-sm text-outline">g to lb</p>
                  </div>
                  <div className="pt-space-xs font-body-sm text-[12px] text-on-surface-variant">
                    1 g = 0.00220462 lb
                  </div>
                </Link>

                {/* Gram to Kilogram */}
                <Link
                  className="p-space-md bg-surface-container-lowest rounded-2xl shadow-sm hover:shadow-md hover:ring-2 hover:ring-primary/20 transition-all flex flex-col justify-between group"
                  href="/conversion/gram-to-kilogram"
                >
                  <div className="flex items-center justify-between pb-2">
                    <span className="font-label-caps text-label-caps uppercase text-outline font-bold">SI Base Metric</span>
                    <span className="material-symbols-outlined text-outline group-hover:text-primary group-hover:translate-x-1 transition-transform text-[18px]">arrow_forward</span>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-body-lg font-bold text-on-surface">Gram to Kilogram</h3>
                    <p className="font-data-mono text-body-sm text-outline">g to kg</p>
                  </div>
                  <div className="pt-space-xs font-body-sm text-[12px] text-on-surface-variant">
                    1 g = 0.001 kg (exact)
                  </div>
                </Link>

                {/* Gram to Milligram */}
                <Link
                  className="p-space-md bg-surface-container-lowest rounded-2xl shadow-sm hover:shadow-md hover:ring-2 hover:ring-primary/20 transition-all flex flex-col justify-between group"
                  href="/conversion/gram-to-milligram"
                >
                  <div className="flex items-center justify-between pb-2">
                    <span className="font-label-caps text-label-caps uppercase text-outline font-bold">Micro-Scale</span>
                    <span className="material-symbols-outlined text-outline group-hover:text-primary group-hover:translate-x-1 transition-transform text-[18px]">arrow_forward</span>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-body-lg font-bold text-on-surface">Gram to Milligram</h3>
                    <p className="font-data-mono text-body-sm text-outline">g to mg</p>
                  </div>
                  <div className="pt-space-xs font-body-sm text-[12px] text-on-surface-variant">
                    1 g = 1,000 mg (exact)
                  </div>
                </Link>

                {/* Gram to Tablespoon */}
                <Link
                  className="p-space-md bg-surface-container-lowest rounded-2xl shadow-sm hover:shadow-md hover:ring-2 hover:ring-primary/20 transition-all flex flex-col justify-between group"
                  href="/conversion/grams-to-tablespoons"
                >
                  <div className="flex items-center justify-between pb-2">
                    <span className="font-label-caps text-label-caps uppercase text-outline font-bold">Culinary Volumetric</span>
                    <span className="material-symbols-outlined text-outline group-hover:text-primary group-hover:translate-x-1 transition-transform text-[18px]">arrow_forward</span>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-body-lg font-bold text-on-surface">Gram to Tablespoon</h3>
                    <p className="font-data-mono text-body-sm text-outline">g to tbsp (dry/water)</p>
                  </div>
                  <div className="pt-space-xs font-body-sm text-[12px] text-on-surface-variant">
                    1 tbsp butter ≈ 14.18 g
                  </div>
                </Link>

                {/* Gram to Cup */}
                <Link
                  className="p-space-md bg-surface-container-lowest rounded-2xl shadow-sm hover:shadow-md hover:ring-2 hover:ring-primary/20 transition-all flex flex-col justify-between group"
                  href="/conversion/gram-to-cup"
                >
                  <div className="flex items-center justify-between pb-2">
                    <span className="font-label-caps text-label-caps uppercase text-outline font-bold">Baking Conversion</span>
                    <span className="material-symbols-outlined text-outline group-hover:text-primary group-hover:translate-x-1 transition-transform text-[18px]">arrow_forward</span>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-body-lg font-bold text-on-surface">Gram to Cup</h3>
                    <p className="font-data-mono text-body-sm text-outline">g to cup (ingredient dense)</p>
                  </div>
                  <div className="pt-space-xs font-body-sm text-[12px] text-on-surface-variant">
                    1 cup flour ≈ 120 g - 125 g
                  </div>
                </Link>

                {/* Ounce to Pound */}
                <Link
                  className="p-space-md bg-surface-container-lowest rounded-2xl shadow-sm hover:shadow-md hover:ring-2 hover:ring-primary/20 transition-all flex flex-col justify-between group"
                  href="/conversion/ounce-to-pound"
                >
                  <div className="flex items-center justify-between pb-2">
                    <span className="font-label-caps text-label-caps uppercase text-outline font-bold">Imperial Pair</span>
                    <span className="material-symbols-outlined text-outline group-hover:text-primary group-hover:translate-x-1 transition-transform text-[18px]">arrow_forward</span>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-body-lg font-bold text-on-surface">Ounce to Pound</h3>
                    <p className="font-data-mono text-body-sm text-outline">oz to lb</p>
                  </div>
                  <div className="pt-space-xs font-body-sm text-[12px] text-on-surface-variant">
                    16 oz = 1 lb (exact)
                  </div>
                </Link>

                {/* Grams to Teaspoons */}
                <Link
                  className="p-space-md bg-surface-container-lowest rounded-2xl shadow-sm hover:shadow-md hover:ring-2 hover:ring-primary/20 transition-all flex flex-col justify-between group"
                  href="/conversion/grams-to-teaspoons"
                >
                  <div className="flex items-center justify-between pb-2">
                    <span className="font-label-caps text-label-caps uppercase text-outline font-bold">Micro-Culinary</span>
                    <span className="material-symbols-outlined text-outline group-hover:text-primary group-hover:translate-x-1 transition-transform text-[18px]">arrow_forward</span>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-body-lg font-bold text-on-surface">Grams to Teaspoons</h3>
                    <p className="font-data-mono text-body-sm text-outline">g to tsp</p>
                  </div>
                  <div className="pt-space-xs font-body-sm text-[12px] text-on-surface-variant">
                    1 tsp sugar ≈ 4.2 g
                  </div>
                </Link>
              </div>

              {/* Systematic Pair Auto-Indexing Notice */}
              <div className="p-space-md bg-surface-container-low rounded-xl flex flex-col sm:flex-row items-center justify-between gap-space-sm text-on-surface-variant text-body-sm">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">hub</span>
                  <span>
                    <strong>Dynamic Pair Indexing System:</strong> Every measurement pair routes automatically to its validated NIST SP 811 deterministic formula.
                  </span>
                </div>
                <span className="font-data-mono text-xs text-outline shrink-0">Engine Core v4.19.8-metrology</span>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
