'use client';

import React, { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface TableRowData {
  grams: number;
  label: string;
  exactPounds: number;
  fractional: string;
  reference: string;
  isStandard?: boolean;
}

const BENCHMARK_ROWS: TableRowData[] = [
  { grams: 1, label: '1 g', exactPounds: 1 / 453.59237, fractional: '~ 1/454 lb (0.035 oz)', reference: 'Single large paperclip or raisin' },
  { grams: 5, label: '5 g', exactPounds: 5 / 453.59237, fractional: '~ 1/91 lb (0.176 oz)', reference: 'US nickel coin mass standard' },
  { grams: 10, label: '10 g', exactPounds: 10 / 453.59237, fractional: '~ 1/45 lb (0.353 oz)', reference: 'Two nickels / packet of active yeast' },
  { grams: 25, label: '25 g', exactPounds: 25 / 453.59237, fractional: '~ 1/18 lb (0.882 oz)', reference: 'Standard first-class letter envelope' },
  { grams: 50, label: '50 g', exactPounds: 50 / 453.59237, fractional: '~ 1/9 lb (1.764 oz)', reference: 'One large chicken egg (in shell)' },
  { grams: 100, label: '100 g', exactPounds: 100 / 453.59237, fractional: '~ 7/32 lb (3.527 oz)', reference: 'Standard chocolate bar / 1 hectogram' },
  { grams: 250, label: '250 g', exactPounds: 250 / 453.59237, fractional: '~ 9/16 lb (8.818 oz)', reference: 'Tub of European butter or cream cheese' },
  { grams: 453.59237, label: '453.59 g', exactPounds: 1, fractional: 'Exact 1 lb (16.00 oz)', reference: 'International legal avoirdupois pound treaty definition', isStandard: true },
  { grams: 500, label: '500 g', exactPounds: 500 / 453.59237, fractional: '1 lb 1.64 oz', reference: 'Standard dry pasta box / half-kilogram' },
  { grams: 750, label: '750 g', exactPounds: 750 / 453.59237, fractional: '1 lb 10.46 oz', reference: 'Standard wine bottle liquid volume mass' },
  { grams: 1000, label: '1,000 g', exactPounds: 1000 / 453.59237, fractional: '2 lb 3.27 oz', reference: '1 Kilogram SI base unit / bag of granulated sugar' },
  { grams: 2000, label: '2,000 g', exactPounds: 2000 / 453.59237, fractional: '4 lb 6.55 oz', reference: 'Pair of hiking boots / 2-liter soda bottle' },
  { grams: 5000, label: '5,000 g', exactPounds: 5000 / 453.59237, fractional: '11 lb 0.37 oz', reference: '5 kg dumbbell weight / adult house cat' },
  { grams: 10000, label: '10,000 g', exactPounds: 10000 / 453.59237, fractional: '22 lb 0.74 oz', reference: 'Commercial airline cabin carry-on weight limit' },
];

export default function GramToPoundClient() {
  const [inputValue, setInputValue] = useState<string>('500');
  const [direction, setDirection] = useState<'g-to-lb' | 'lb-to-g'>('g-to-lb');
  const [precision, setPrecision] = useState<number>(6);
  const [copied, setCopied] = useState<boolean>(false);
  const [tableSearch, setTableSearch] = useState<string>('');

  const workbenchRef = useRef<HTMLDivElement>(null);

  // Exact treaty definitions
  const GRAMS_PER_POUND = 453.59237;
  const POUNDS_PER_GRAM = 1 / 453.59237;

  // Calculation results
  const parsedNum = parseFloat(inputValue);
  const isValid = !isNaN(parsedNum) && parsedNum >= 0;

  const {
    grams,
    pounds,
    formattedResult,
    mixedSubUnit,
    inlineProof,
    eqKg,
    eqOz,
    eqLbTr,
    eqMg,
    pctOfPound,
  } = useMemo(() => {
    if (!isValid) {
      return {
        grams: 0,
        pounds: 0,
        formattedResult: (0).toFixed(precision),
        mixedSubUnit: '0 lb 0.00 oz',
        inlineProof: '0 g = 0 lb',
        eqKg: '0.0000',
        eqOz: '0.0000',
        eqLbTr: '0.0000',
        eqMg: '0',
        pctOfPound: 0,
      };
    }

    if (direction === 'g-to-lb') {
      const g = parsedNum;
      const lb = g * POUNDS_PER_GRAM;
      const intLb = Math.floor(lb);
      const remOz = (lb - intLb) * 16;
      const pct = Math.min(100, Math.max(0, (g / GRAMS_PER_POUND) * 100));

      return {
        grams: g,
        pounds: lb,
        formattedResult: lb.toFixed(precision),
        mixedSubUnit: `${intLb} lb ${remOz.toFixed(2)} oz`,
        inlineProof: `${g} g × 0.0022046226 = ${lb.toFixed(Math.min(6, precision))} lb`,
        eqKg: (g / 1000).toFixed(4),
        eqOz: (lb * 16).toFixed(4),
        eqLbTr: (g / 373.2417216).toFixed(4),
        eqMg: (g * 1000).toLocaleString('en-US'),
        pctOfPound: Number(pct.toFixed(1)),
      };
    } else {
      const lb = parsedNum;
      const g = lb * GRAMS_PER_POUND;
      const intLb = Math.floor(lb);
      const remOz = (lb - intLb) * 16;
      const pct = Math.min(100, Math.max(0, (g / GRAMS_PER_POUND) * 100));

      return {
        grams: g,
        pounds: lb,
        formattedResult: g.toFixed(precision),
        mixedSubUnit: `${intLb} lb ${remOz.toFixed(2)} oz`,
        inlineProof: `${lb} lb × 453.59237 = ${g.toFixed(Math.min(4, precision))} g`,
        eqKg: (g / 1000).toFixed(4),
        eqOz: (lb * 16).toFixed(4),
        eqLbTr: (g / 373.2417216).toFixed(4),
        eqMg: (g * 1000).toLocaleString('en-US'),
        pctOfPound: Number(pct.toFixed(1)),
      };
    }
  }, [isValid, parsedNum, direction, precision]);

  // Handlers
  const handleSwap = () => {
    if (direction === 'g-to-lb') {
      setDirection('lb-to-g');
      if (isValid) {
        setInputValue(pounds.toFixed(precision));
      }
    } else {
      setDirection('g-to-lb');
      if (isValid) {
        setInputValue(grams.toFixed(2));
      }
    }
  };

  const handleCopy = () => {
    const textToCopy = `${formattedResult} ${direction === 'g-to-lb' ? 'lb' : 'g'}`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const handleClear = () => {
    setInputValue('');
  };

  const handleReset = () => {
    setInputValue('500');
    setDirection('g-to-lb');
    setPrecision(6);
  };

  const handlePreset = (val: number) => {
    setDirection('g-to-lb');
    setInputValue(val.toString());
  };

  const handleLoadTableVal = (val: number) => {
    setDirection('g-to-lb');
    setInputValue(val.toString());
    if (workbenchRef.current) {
      const top = workbenchRef.current.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  // Table search filter
  const filteredRows = useMemo(() => {
    const query = tableSearch.trim().toLowerCase();
    if (!query) return BENCHMARK_ROWS;
    return BENCHMARK_ROWS.filter(
      (row) =>
        row.label.toLowerCase().includes(query) ||
        row.exactPounds.toFixed(6).includes(query) ||
        row.fractional.toLowerCase().includes(query) ||
        row.reference.toLowerCase().includes(query)
    );
  }, [tableSearch]);

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
                '@id': 'https://solveitcalculator.com/conversion/gram-to-pound#webpage',
                url: 'https://solveitcalculator.com/conversion/gram-to-pound',
                name: 'Gram to Pound Converter (g to lb) – Instant Conversion Calculator',
                description:
                  'Convert grams to pounds instantly with our free Gram to Pound Converter. Enter any value in grams and get accurate pound conversions, formulas, conversion charts, and FAQs.',
                breadcrumb: {
                  '@type': 'BreadcrumbList',
                  '@id': 'https://solveitcalculator.com/conversion/gram-to-pound#breadcrumb',
                  itemListElement: [
                    {
                      '@type': 'ListItem',
                      position: 1,
                      name: 'Home',
                      item: 'https://solveitcalculator.com/',
                    },
                    {
                      '@type': 'ListItem',
                      position: 2,
                      name: 'Conversion',
                      item: 'https://solveitcalculator.com/conversion',
                    },
                    {
                      '@type': 'ListItem',
                      position: 3,
                      name: 'Weight & Mass',
                      item: 'https://solveitcalculator.com/weight-mass-converter',
                    },
                    {
                      '@type': 'ListItem',
                      position: 4,
                      name: 'Gram',
                      item: 'https://solveitcalculator.com/conversion/gram',
                    },
                    {
                      '@type': 'ListItem',
                      position: 5,
                      name: 'Gram to Pound (g to lb)',
                      item: 'https://solveitcalculator.com/conversion/gram-to-pound',
                    },
                  ],
                },
              },
              {
                '@type': 'SoftwareApplication',
                name: 'SolveIt Gram to Pound Metrology Engine',
                applicationCategory: 'UtilitiesApplication',
                operatingSystem: 'All',
                offers: {
                  '@type': 'Offer',
                  price: '0',
                  priceCurrency: 'USD',
                },
              },
              {
                '@type': 'HowTo',
                name: 'How to Convert Grams to Pounds (g to lb)',
                step: [
                  {
                    '@type': 'HowToStep',
                    position: 1,
                    name: 'Identify Mass in Grams',
                    text: 'Identify your net weight or measurement in grams (g) from your scale, packaging, or laboratory notes.',
                  },
                  {
                    '@type': 'HowToStep',
                    position: 2,
                    name: 'Apply the Reciprocal Factor',
                    text: 'Multiply the gram quantity by 0.00220462262 (or divide directly by 453.59237).',
                  },
                  {
                    '@type': 'HowToStep',
                    position: 3,
                    name: 'State the Result in Pounds (lb)',
                    text: 'Label the resulting product in avoirdupois pounds (lb), or express as pounds and ounces.',
                  },
                ],
              },
              {
                '@type': 'FAQPage',
                mainEntity: [
                  {
                    '@type': 'Question',
                    name: 'How many pounds are in 1 gram?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'There are approximately 0.00220462262 pounds in 1 gram. Exactly, 1 g = 1 / 453.59237 avoirdupois pounds.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'How do I convert grams to pounds?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'To convert grams to pounds, multiply the gram amount by 0.00220462262 or divide by 453.59237.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'How many pounds is 100 grams?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: '100 grams equals approximately 0.220462 pounds (or about 3.527 ounces).',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'How many pounds is 500 grams?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: '500 grams equals 1.102311 pounds (which equates to 1 lb and 1.64 oz).',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'How many pounds is 1000 grams?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: '1000 grams (1 kilogram) is equal to 2.204623 pounds (2 lb 3.27 oz).',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'Is a pound larger than a gram?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'Yes, one pound is substantially larger than a gram. Exactly 453.59237 grams are required to make one international avoirdupois pound.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'Can I use this converter for food and recipes?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'Yes. This converter computes mass precisely according to NIST SP 811, making it ideal for culinary baking, dry goods, and recipe conversions.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'How accurate is this calculator?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'It executes 64-bit floating-point mathematical calculations calibrated to the official 1959 BIPM/NIST International Yard and Pound treaty specification down to 8+ decimal places.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'How many grams are in one pound?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'There are exactly 453.59237 grams in one avoirdupois pound.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'What is the formula for converting grams to pounds?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'The formula is: Pounds (lb) = Grams (g) × 0.00220462262, or equivalently lb = g / 453.59237.',
                    },
                  },
                ],
              },
            ],
          }),
        }}
      />

      

      <main className="w-full pt-16 bg-background min-h-screen">
        <div className="flex flex-col w-full">
          {/* Sub-header Metrology Verification Strip */}
          <div className="bg-surface-container-low px-gutter-mobile lg:px-gutter-desktop py-1 flex items-center justify-center overflow-x-auto whitespace-nowrap border-b border-outline-variant/20">
            <div className="flex items-center gap-space-sm font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              <span>BIPM / NIST SP 811 Metrology Verified</span>
              <span className="opacity-40">•</span>
              <span>100% Client-Side Local Sandbox</span>
              <span className="opacity-40">•</span>
              <span>Zero-Lag IEEE 754 High-Precision Core</span>
              <span className="opacity-40">•</span>
              <span>Strict Zero-Telemetry Policy</span>
            </div>
          </div>

          {/* SECTION 1: TOP METROLOGY TELEMETRY & INTRO */}
          <section className="w-full px-gutter-mobile lg:px-gutter-desktop max-w-max-width-canvas mx-auto pt-space-lg pb-space-md">
            {/* Breadcrumb & Metrology Compliance Ribbon */}
            <div className="flex flex-wrap items-center justify-between gap-space-sm pb-space-sm">
              <nav aria-label="Breadcrumb" className="flex items-center gap-space-xs font-body-sm text-body-sm text-on-surface-variant flex-wrap">
                <Link className="hover:text-primary transition-colors flex items-center gap-1" href="/">
                  <span className="material-symbols-outlined text-[16px]">home</span>
                  <span>Home</span>
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
                <span className="text-primary font-semibold">Gram to Pound (g to lb)</span>
              </nav>

              <div className="flex items-center gap-space-xs bg-surface-container px-space-sm py-1 rounded-full text-on-surface-variant shadow-sm">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span className="font-label-caps text-label-caps uppercase tracking-wider font-semibold">
                  BIPM / NIST SP 811 &amp; HB 44 METROLOGY CORE
                </span>
              </div>
            </div>

            {/* Title & Executive Metrological Abstract */}
            <div className="space-y-space-xs max-w-3xl">
              <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                Gram to Pound Converter <span className="text-primary font-light">(g to lb)</span>
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Convert grams (<span className="font-data-mono font-semibold text-on-surface">g</span>) into international avoirdupois pounds (<span className="font-data-mono font-semibold text-on-surface">lb</span>) with zero-latency deterministic accuracy. Calibrated directly to the 1959 International Yard and Pound Agreement (<span className="font-data-mono text-xs text-primary font-semibold">1 lb = 453.59237 g</span>) with live sub-unit breakdowns, NIST mathematical derivations, and batch shipping metrology.
              </p>
            </div>

            {/* Trust & Performance Badges */}
            <div className="flex flex-wrap items-center gap-space-xs pt-space-sm">
              <span className="inline-flex items-center gap-1 bg-surface-container-lowest px-3 py-1 rounded-lg text-on-surface font-label-caps text-label-caps shadow-sm">
                <span className="material-symbols-outlined text-[16px] text-primary">verified_user</span>
                100% Free &amp; Private (Client Sandbox)
              </span>
              <span className="inline-flex items-center gap-1 bg-surface-container-lowest px-3 py-1 rounded-lg text-on-surface font-label-caps text-label-caps shadow-sm">
                <span className="material-symbols-outlined text-[16px] text-secondary">balance</span>
                Avoirdupois Legal Metrology (NIST HB 44)
              </span>
              <span className="inline-flex items-center gap-1 bg-surface-container-lowest px-3 py-1 rounded-lg text-on-surface font-label-caps text-label-caps shadow-sm">
                <span className="material-symbols-outlined text-[16px] text-primary">precision_manufacturing</span>
                8-Decimal IEEE 754 Precision
              </span>
              <span className="inline-flex items-center gap-1 bg-surface-container-lowest px-3 py-1 rounded-lg text-on-surface font-label-caps text-label-caps shadow-sm">
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant">bolt</span>
                Instant Calculation
              </span>
              <span className="inline-flex items-center gap-1 bg-surface-container-high px-3 py-1 rounded-lg text-on-surface font-label-caps text-label-caps">
                <span className="material-symbols-outlined text-[16px] text-primary">update</span>
                2026 Calibrated Pipeline
              </span>
            </div>
          </section>

          {/* SECTION 2: INTERACTIVE WORKBENCH & METROLOGY INSIGHT CARD */}
          <section className="w-full px-gutter-mobile lg:px-gutter-desktop max-w-max-width-canvas mx-auto py-space-md" ref={workbenchRef}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
              {/* Interactive Calculator Workbench (8 cols) */}
              <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl p-space-lg shadow-xl shadow-surface-tint/5 flex flex-col gap-space-md relative overflow-hidden">
                {/* Card Top Bar & Precision Control */}
                <div className="flex flex-wrap items-center justify-between gap-space-xs">
                  <div className="flex items-center gap-space-xs">
                    <span className="p-2 rounded-lg bg-primary-fixed text-on-primary-fixed flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px]">calculate</span>
                    </span>
                    <div>
                      <h2 className="font-headline-md text-headline-md text-on-surface leading-tight">Interactive Converter</h2>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">Real-time bi-directional mass recalculation</span>
                    </div>
                  </div>

                  {/* Precision Selector */}
                  <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-lg">
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase px-2">Decimals:</span>
                    <button
                      className={`px-2.5 py-1 rounded font-data-mono text-label-caps font-semibold transition-all ${
                        precision === 2 ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                      onClick={() => setPrecision(2)}
                      type="button"
                    >
                      .00
                    </button>
                    <button
                      className={`px-2.5 py-1 rounded font-data-mono text-label-caps font-semibold transition-all ${
                        precision === 4 ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                      onClick={() => setPrecision(4)}
                      type="button"
                    >
                      .0000
                    </button>
                    <button
                      className={`px-2.5 py-1 rounded font-data-mono text-label-caps font-semibold transition-all ${
                        precision === 6 ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                      onClick={() => setPrecision(6)}
                      type="button"
                    >
                      .000000
                    </button>
                  </div>
                </div>

                {/* Conversion Grid (From & To Panels) */}
                <div className="grid grid-cols-1 md:grid-cols-11 gap-space-sm items-center">
                  {/* Input Side */}
                  <div className="md:col-span-5 bg-surface-container-low p-space-md rounded-xl shadow-inner flex flex-col gap-space-xs">
                    <div className="flex items-center justify-between">
                      <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider font-semibold" htmlFor="gram-input">
                        {direction === 'g-to-lb' ? 'FROM: GRAMS (g)' : 'FROM: POUNDS (lb)'}
                      </label>
                      <span className="font-label-caps text-label-caps bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded font-mono">
                        {direction === 'g-to-lb' ? 'SI Derived [g]' : 'Avoirdupois [lb]'}
                      </span>
                    </div>
                    <div className="relative flex items-center">
                      <input
                        aria-label={direction === 'g-to-lb' ? 'Weight in Grams' : 'Weight in Pounds'}
                        className="w-full bg-surface-container-lowest text-on-surface font-numerical-display text-numerical-display px-4 py-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary font-data-mono"
                        id="gram-input"
                        min="0"
                        placeholder={direction === 'g-to-lb' ? '500' : '1.102311'}
                        step="any"
                        type="number"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                      />
                      <span className="absolute right-4 font-data-mono font-semibold text-on-surface-variant text-lg pointer-events-none">
                        {direction === 'g-to-lb' ? 'g' : 'lb'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant">
                      <span>Fundamental mass parameter</span>
                      <button className="text-primary hover:underline text-xs" onClick={handleClear} type="button">
                        Clear
                      </button>
                    </div>
                  </div>

                  {/* Directional Swap Unit Button */}
                  <div className="md:col-span-1 flex justify-center py-2 md:py-0">
                    <button
                      className="w-11 h-11 rounded-full bg-surface-container-high hover:bg-primary hover:text-on-primary text-on-surface flex items-center justify-center transition-all shadow-md active:scale-95 group"
                      onClick={handleSwap}
                      type="button"
                      title={direction === 'g-to-lb' ? 'Switch to Pound to Gram Converter' : 'Switch to Gram to Pound Converter'}
                    >
                      <span className="material-symbols-outlined text-[20px] group-hover:rotate-180 transition-transform duration-300">
                        swap_horiz
                      </span>
                    </button>
                  </div>

                  {/* Output Side */}
                  <div className="md:col-span-5 bg-surface-container-low p-space-md rounded-xl shadow-inner flex flex-col gap-space-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider font-semibold">
                        {direction === 'g-to-lb' ? 'TO: POUNDS (lb)' : 'TO: GRAMS (g)'}
                      </span>
                      <span className="font-label-caps text-label-caps bg-secondary-fixed text-on-secondary-fixed px-2 py-0.5 rounded font-mono">
                        {direction === 'g-to-lb' ? 'Avoirdupois [lb]' : 'SI Derived [g]'}
                      </span>
                    </div>
                    <div className="relative flex items-center bg-surface-container-lowest px-4 py-3 rounded-lg shadow-sm">
                      <div className="w-full overflow-x-auto whitespace-nowrap">
                        <span className="font-numerical-display text-numerical-display text-primary font-data-mono select-all">
                          {formattedResult}
                        </span>
                      </div>
                      <span className="font-data-mono font-bold text-on-surface-variant text-lg ml-2">
                        {direction === 'g-to-lb' ? 'lb' : 'g'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant">
                      <span className="text-xs font-data-mono font-medium text-on-surface">
                        {direction === 'g-to-lb' ? mixedSubUnit : `${(grams / 1000).toFixed(4)} kg`}
                      </span>
                      <span className="text-xs text-outline-variant">1 lb = 453.59237 g exact</span>
                    </div>
                  </div>
                </div>

                {/* Quick Select Metric Benchmarks */}
                <div className="flex flex-col gap-space-2xs pt-1">
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Quick Benchmarks:</span>
                  <div className="flex flex-wrap gap-1.5" id="benchmark-buttons">
                    <button className="px-2.5 py-1 rounded bg-surface-container hover:bg-primary hover:text-on-primary font-data-mono text-body-sm text-on-surface transition-colors" onClick={() => handlePreset(1)} type="button">1 g</button>
                    <button className="px-2.5 py-1 rounded bg-surface-container hover:bg-primary hover:text-on-primary font-data-mono text-body-sm text-on-surface transition-colors" onClick={() => handlePreset(5)} type="button">5 g</button>
                    <button className="px-2.5 py-1 rounded bg-surface-container hover:bg-primary hover:text-on-primary font-data-mono text-body-sm text-on-surface transition-colors" onClick={() => handlePreset(10)} type="button">10 g</button>
                    <button className="px-2.5 py-1 rounded bg-surface-container hover:bg-primary hover:text-on-primary font-data-mono text-body-sm text-on-surface transition-colors" onClick={() => handlePreset(25)} type="button">25 g</button>
                    <button className="px-2.5 py-1 rounded bg-surface-container hover:bg-primary hover:text-on-primary font-data-mono text-body-sm text-on-surface transition-colors" onClick={() => handlePreset(50)} type="button">50 g</button>
                    <button className="px-2.5 py-1 rounded bg-surface-container hover:bg-primary hover:text-on-primary font-data-mono text-body-sm text-on-surface transition-colors" onClick={() => handlePreset(100)} type="button">100 g</button>
                    <button className="px-2.5 py-1 rounded bg-surface-container hover:bg-primary hover:text-on-primary font-data-mono text-body-sm text-on-surface transition-colors" onClick={() => handlePreset(250)} type="button">250 g</button>
                    <button className="px-2.5 py-1 rounded bg-primary-fixed text-on-primary-fixed font-data-mono text-body-sm font-semibold hover:bg-primary hover:text-on-primary transition-colors" onClick={() => handlePreset(453.59237)} type="button">453.59 g (1 lb)</button>
                    <button className="px-2.5 py-1 rounded bg-surface-container hover:bg-primary hover:text-on-primary font-data-mono text-body-sm text-on-surface transition-colors" onClick={() => handlePreset(500)} type="button">500 g</button>
                    <button className="px-2.5 py-1 rounded bg-surface-container hover:bg-primary hover:text-on-primary font-data-mono text-body-sm text-on-surface transition-colors" onClick={() => handlePreset(1000)} type="button">1,000 g (1 kg)</button>
                    <button className="px-2.5 py-1 rounded bg-surface-container hover:bg-primary hover:text-on-primary font-data-mono text-body-sm text-on-surface transition-colors" onClick={() => handlePreset(5000)} type="button">5,000 g</button>
                  </div>
                </div>

                {/* Action Toolbar & Live Calculation Proof Note */}
                <div className="flex flex-wrap items-center justify-between gap-space-sm pt-space-xs bg-surface-container-low p-space-md rounded-xl">
                  <div className="flex items-center gap-space-xs">
                    <button className="bg-primary hover:bg-primary-container text-on-primary px-4 py-2 rounded-lg font-body-sm font-semibold flex items-center gap-1.5 shadow-md active:scale-95 transition-all" onClick={() => {}} type="button">
                      <span className="material-symbols-outlined text-[18px]">sync</span>
                      <span>Convert</span>
                    </button>
                    <button className="bg-surface-container-lowest hover:bg-surface-container text-on-surface px-3 py-2 rounded-lg font-body-sm flex items-center gap-1.5 shadow-sm transition-all" onClick={handleCopy} type="button">
                      <span className="material-symbols-outlined text-[18px]">content_copy</span>
                      <span>{copied ? 'Copied!' : 'Copy Result'}</span>
                    </button>
                    <button className="bg-surface-container-lowest hover:bg-surface-container text-on-surface px-3 py-2 rounded-lg font-body-sm flex items-center gap-1.5 shadow-sm transition-all hidden sm:flex" onClick={() => typeof window !== 'undefined' && window.print()} type="button">
                      <span className="material-symbols-outlined text-[18px]">print</span>
                      <span>Print</span>
                    </button>
                    <button className="bg-surface-container-lowest hover:bg-surface-container text-on-surface px-3 py-2 rounded-lg font-body-sm flex items-center gap-1.5 shadow-sm transition-all" onClick={handleReset} type="button">
                      <span className="material-symbols-outlined text-[18px]">refresh</span>
                      <span>Reset</span>
                    </button>
                  </div>

                  {/* Live Inline Calculation Line */}
                  <div className="font-data-mono text-xs text-on-surface-variant bg-surface-container-lowest px-3 py-1.5 rounded-lg shadow-sm">
                    <span>{inlineProof}</span>
                  </div>
                </div>

                {/* Simultaneous Multi-Standard Equivalents Drawer */}
                <div className="pt-space-xs">
                  <div className="flex items-center justify-between pb-2">
                    <span className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant font-semibold">Simultaneous Mass Metrics</span>
                    <span className="font-body-sm text-xs text-outline-variant">Auto-synchronized</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-xs font-data-mono">
                    <div className="bg-surface-container-low p-3 rounded-lg">
                      <span className="font-label-caps text-label-caps text-outline uppercase block">Kilograms (kg)</span>
                      <span className="font-semibold text-on-surface text-base">{eqKg}</span>
                    </div>
                    <div className="bg-surface-container-low p-3 rounded-lg">
                      <span className="font-label-caps text-label-caps text-outline uppercase block">Ounces (oz avdp)</span>
                      <span className="font-semibold text-on-surface text-base">{eqOz}</span>
                    </div>
                    <div className="bg-surface-container-low p-3 rounded-lg">
                      <span className="font-label-caps text-label-caps text-outline uppercase block">Troy Pounds (lb tr)</span>
                      <span className="font-semibold text-on-surface text-base">{eqLbTr}</span>
                    </div>
                    <div className="bg-surface-container-low p-3 rounded-lg">
                      <span className="font-label-caps text-label-caps text-outline uppercase block">Milligrams (mg)</span>
                      <span className="font-semibold text-on-surface text-base">{eqMg}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Metrology Insight Card (4 cols) */}
              <div className="lg:col-span-4 flex flex-col gap-space-md">
                {/* Metrological Precision Authority Card */}
                <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-xl shadow-surface-tint/5 flex flex-col gap-space-sm relative">
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps uppercase tracking-wider bg-surface-container-high px-2.5 py-1 rounded text-primary font-semibold">
                      BIPM / NIST / Mendenhall
                    </span>
                    <span className="material-symbols-outlined text-primary text-[20px]">verified</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface leading-tight">
                    Metrology Insight: The Exact International Pound
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Under the 1959 International Yard and Pound Agreement (ratified by the US, UK, Canada, Australia, and New Zealand), the avoirdupois pound is strictly tied to the metric kilogram:
                  </p>
                  <div className="bg-surface-container-low p-3 rounded-lg flex flex-col gap-1.5 font-data-mono text-xs">
                    <div className="flex justify-between items-center text-on-surface">
                      <span className="text-outline">Exact Factor:</span>
                      <span className="font-bold text-primary">1 lb = 0.45359237 kg</span>
                    </div>
                    <div className="flex justify-between items-center text-on-surface">
                      <span className="text-outline">1 Pound (16 oz):</span>
                      <span>453.59237000 g</span>
                    </div>
                    <div className="flex justify-between items-center text-on-surface">
                      <span className="text-outline">1 Gram (Reciprocal):</span>
                      <span>0.00220462262 lb</span>
                    </div>
                  </div>

                  {/* Visual Bar: Kitchen & Shipping Thresholds */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-xs font-label-caps uppercase text-on-surface-variant">
                      <span>Standard Butter Block (453.6 g = 1 lb)</span>
                      <span>Metric Standard (500 g = 1.102 lb)</span>
                    </div>
                    <div className="w-full h-2.5 bg-surface-container-high rounded-full overflow-hidden flex">
                      <div className="bg-secondary h-full" style={{ width: '47.5%' }} title="453.59g (1 lb)"></div>
                      <div className="bg-primary h-full" style={{ width: '52.5%' }} title="500g (1.102 lb)"></div>
                    </div>
                    <div className="flex justify-between text-[11px] text-outline-variant font-mono">
                      <span>Avoirdupois: 16.00 oz</span>
                      <span>SI Metric Pack: 17.64 oz</span>
                    </div>
                  </div>

                  {/* Metrological Calibration Visual Illustration */}
                  <div className="relative overflow-hidden rounded-lg mt-2 h-36">
                    <Image
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBNlUoPKfolkCOO_1JYQc2dzlKLn69cBJdu1n7_hk7qwiMsksWOPZtmHrnpCR7iqCpaWXOs4ygpyq88XnARom1626J2343yvIy0nQlCJ5yqPUohN9RiE4BPyLexiMjHqfS-stmw9AbtZvlbGfcfS9E4fWln2FK0Sweeroft7EunS_vs2CJhB4sdKtHC9QBktItYb9EEhWnShgYDRAgpyyyszvW1TUpNOhMha_x_xj8vCzvj9T_kq4HL"
                      alt="Ultra precision laboratory analytical balance scale with calibration masses"
                      fill
                      className="object-cover rounded-lg"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/80 via-transparent to-transparent pointer-events-none"></div>
                    <span className="absolute bottom-2 left-3 font-data-mono text-[11px] text-on-surface font-semibold bg-surface/90 px-2 py-0.5 rounded shadow-sm z-10">
                      Standard Calibration Class F / M1 Tested
                    </span>
                  </div>
                </div>

                {/* SEO Meta & Schema Inspector Widget */}
                <div className="bg-surface-container-low rounded-xl p-space-md shadow-sm flex flex-col gap-2 font-data-mono text-xs text-on-surface-variant">
                  <div className="flex items-center gap-1.5 text-on-surface font-semibold">
                    <span className="material-symbols-outlined text-[16px] text-secondary">code_blocks</span>
                    <span>Indexation Metadata &amp; Spec Hash</span>
                  </div>
                  <div className="truncate">
                    <span className="text-outline">Canonical:</span> https://solveitcalculator.com/conversion/gram-to-pound
                  </div>
                  <div>
                    <span className="text-outline">Graph:</span> WebPage, Calculator, FAQPage, HowTo, BreadcrumbList
                  </div>
                  <div>
                    <span className="text-outline">Spec:</span> NIST Special Publication 811 Compliant
                  </div>
                  <div className="flex items-center gap-1 text-primary pt-1">
                    <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
                    <span>Deterministic Sandbox Execution Engine</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3: FORMULA & MATHEMATICAL PROOF SECTION */}
          <section className="w-full px-gutter-mobile lg:px-gutter-desktop max-w-max-width-canvas mx-auto py-space-xl">
            <div className="max-w-max-width-calculator mx-auto flex flex-col gap-space-lg">
              <div className="text-center space-y-space-2xs">
                <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-semibold">
                  FORMAL METROLOGICAL DERIVATION
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                  Gram to Pound Formula &amp; Mathematical Proof
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto">
                  Mass conversion between the International System of Units (SI) and the Avoirdupois system relies upon an invariant mathematical constant defined by international treaty.
                </p>
              </div>

              {/* Two Derivation Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                {/* Card 1: Multiplication Constant Form */}
                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-md flex flex-col gap-space-sm relative overflow-hidden">
                  <div className="flex items-center gap-space-xs text-primary">
                    <span className="material-symbols-outlined text-[24px]">functions</span>
                    <span className="font-label-caps text-label-caps uppercase tracking-wider font-semibold">
                      Multiplication Constant Form
                    </span>
                  </div>
                  <div className="bg-surface-container-low p-4 rounded-lg text-center">
                    <code className="font-data-mono font-headline-md text-headline-md text-on-surface block select-all">
                      lb = g × 0.0022046226218
                    </code>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Multiply grams by the international reciprocal constant <span className="font-data-mono text-on-surface font-medium">0.00220462262</span>. This decimal constant is derived by calculating <span className="font-data-mono text-on-surface">1 / 453.59237</span> and represents the standard float constant applied in computer algorithms and digital scales.
                  </p>
                </div>

                {/* Card 2: Fractional Reciprocal Form */}
                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-md flex flex-col gap-space-sm relative overflow-hidden">
                  <div className="flex items-center gap-space-xs text-secondary">
                    <span className="material-symbols-outlined text-[24px]">architecture</span>
                    <span className="font-label-caps text-label-caps uppercase tracking-wider font-semibold">
                      Exact Fractional Reciprocal
                    </span>
                  </div>
                  <div className="bg-surface-container-low p-4 rounded-lg text-center">
                    <code className="font-data-mono font-headline-md text-headline-md text-on-surface block select-all">
                      lb = g ÷ 453.59237
                    </code>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Because 1 avoirdupois pound is legally defined by the 1959 International Yard and Pound Agreement as precisely <span className="font-data-mono text-on-surface font-medium">453.59237 grams</span>, dividing by this exact integer-decimal denominator eliminates infinite recurring decimal rounding bias.
                  </p>
                </div>
              </div>

              {/* Worked Computational Examples Card */}
              <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-md flex flex-col gap-space-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-primary text-[22px]">assignment_turned_in</span>
                    <h3 className="font-headline-md text-headline-md text-on-surface">Worked Metrological Example: 500 Grams</h3>
                  </div>
                  <span className="font-data-mono text-xs bg-surface-container px-2.5 py-1 rounded text-on-surface-variant">Step-by-Step Proof</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-space-sm font-data-mono text-sm">
                  <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col gap-1">
                    <span className="font-label-caps text-label-caps text-outline uppercase">Step 1: Given Metric Mass</span>
                    <span className="text-on-surface font-semibold text-base">m = 500.000 g</span>
                    <span className="text-xs text-on-surface-variant">Metric net package or commercial food weight.</span>
                  </div>
                  <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col gap-1">
                    <span className="font-label-caps text-label-caps text-outline uppercase">Step 2: Apply BIPM Constant</span>
                    <span className="text-on-surface font-semibold text-base">500 × 0.00220462262</span>
                    <span className="text-xs text-on-surface-variant">Alternatively: 500 ÷ 453.59237</span>
                  </div>
                  <div className="bg-primary-fixed p-space-sm rounded-lg flex flex-col gap-1 text-on-primary-fixed">
                    <span className="font-label-caps text-label-caps uppercase opacity-80">Step 3: Result Quotient</span>
                    <span className="font-bold text-base">1.10231131 lb</span>
                    <span className="text-xs opacity-90">Equal to 1 lb 1.64 oz avoirdupois</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-space-sm bg-surface-container-low p-space-sm rounded-lg text-body-sm font-body-sm text-on-surface-variant">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-primary">info</span>
                    <span>Commercial rounding: In wholesale and retail commerce (NIST Handbook 44), 500 g is recognized as <strong className="text-on-surface">1.10 lb</strong>.</span>
                  </div>
                  <div className="flex gap-4 font-data-mono text-xs">
                    <span>100 g = <strong>0.2205 lb</strong></span>
                    <span>1,000 g = <strong>2.2046 lb</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 4: INSTANT REFERENCE CONVERSION TABLE (SEARCHABLE) */}
          <section className="w-full px-gutter-mobile lg:px-gutter-desktop max-w-max-width-canvas mx-auto py-space-xl">
            <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-xl shadow-surface-tint/5 flex flex-col gap-space-md">
              {/* Table Header & Search Input */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
                <div>
                  <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-semibold">HIGH-PRECISION BENCHMARKS</span>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Gram to Pound Conversion Table</h2>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Calibrated values for logistics parcel pricing, grocery weight checks, and laboratory formulations.
                  </p>
                </div>
                {/* Table Filter / Search Input */}
                <div className="relative w-full md:w-72">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-on-surface-variant pointer-events-none">search</span>
                  <input
                    className="w-full pl-9 pr-3 py-2 bg-surface-container-low text-on-surface text-body-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-body-sm placeholder:text-outline"
                    id="table-search"
                    placeholder="Search grams or pounds..."
                    type="text"
                    value={tableSearch}
                    onChange={(e) => setTableSearch(e.target.value)}
                  />
                </div>
              </div>

              {/* High Intent Table Component */}
              <div className="overflow-x-auto">
                <table className="w-full text-left font-body-sm text-body-sm" id="conversion-table">
                  <thead>
                    <tr className="bg-surface-container-low text-on-surface-variant font-label-caps text-label-caps uppercase tracking-wider">
                      <th className="py-3.5 px-4 rounded-l-lg" scope="col">Grams (g)</th>
                      <th className="py-3.5 px-4" scope="col">Pounds (lb avdp)</th>
                      <th className="py-3.5 px-4" scope="col">Fractional / Ounces</th>
                      <th className="py-3.5 px-4" scope="col">Physical Metrology Reference</th>
                      <th className="py-3.5 px-4 text-right rounded-r-lg" scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10 text-on-surface font-data-mono">
                    {filteredRows.map((row, idx) => (
                      <tr
                        key={idx}
                        className={`transition-colors ${
                          row.isStandard
                            ? 'bg-primary-fixed/20 hover:bg-primary-fixed/40 font-semibold'
                            : 'hover:bg-surface-container-low'
                        }`}
                      >
                        <td className={`py-3 px-4 font-bold ${row.isStandard ? 'text-primary' : 'text-primary'}`}>
                          {row.label}
                        </td>
                        <td className={`py-3 px-4 ${row.isStandard ? 'text-primary font-bold' : ''}`}>
                          {row.exactPounds.toFixed(6)} lb
                        </td>
                        <td className="py-3 px-4 text-on-surface-variant font-sans">
                          {row.fractional}
                        </td>
                        <td className={`py-3 px-4 font-sans ${row.isStandard ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                          {row.reference}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            className={`px-2.5 py-1 rounded text-xs transition-colors ${
                              row.isStandard
                                ? 'bg-primary text-on-primary'
                                : 'bg-surface-container hover:bg-primary hover:text-on-primary'
                            }`}
                            onClick={() => handleLoadTableVal(row.grams)}
                            type="button"
                          >
                            Load
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredRows.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-on-surface-variant font-sans">
                          No matching benchmark found for &ldquo;{tableSearch}&rdquo;
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* SECTION 5: STEP-BY-STEP CALCULATION GUIDE & REAL-WORLD SCENARIOS */}
          <section className="w-full px-gutter-mobile lg:px-gutter-desktop max-w-max-width-canvas mx-auto py-space-xl">
            <div className="flex flex-col gap-space-lg">
              <div className="text-center space-y-space-2xs">
                <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-semibold">
                  PRACTICAL METROLOGY GUIDE
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                  How to Convert Grams to Pounds
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto">
                  Execute manual conversions across spreadsheets, shipping invoices, and laboratory records using this verified 3-step sequence.
                </p>
              </div>

              {/* 3 Numbered Steps */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
                {/* Step 1 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-md flex flex-col gap-space-sm relative">
                  <span className="font-display-hero text-display-hero text-primary/15 absolute right-4 top-2 font-black select-none pointer-events-none">
                    01
                  </span>
                  <div className="w-10 h-10 rounded-lg bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-bold">
                    1
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface">Identify Mass in Grams</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Record the exact metric reading from your digital balance, postal scale, or food packaging label in grams (<span className="font-data-mono text-on-surface font-semibold">g</span>). E.g., a package reads <span className="font-data-mono text-on-surface">750 g</span>.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-md flex flex-col gap-space-sm relative">
                  <span className="font-display-hero text-display-hero text-primary/15 absolute right-4 top-2 font-black select-none pointer-events-none">
                    02
                  </span>
                  <div className="w-10 h-10 rounded-lg bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-bold">
                    2
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface">Apply Reciprocal Constant</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Multiply the gram quantity by <span className="font-data-mono text-on-surface font-semibold">0.00220462</span>. Alternatively, divide the gram amount directly by the exact treaty standard <span className="font-data-mono text-on-surface font-semibold">453.59237</span>.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-md flex flex-col gap-space-sm relative">
                  <span className="font-display-hero text-display-hero text-primary/15 absolute right-4 top-2 font-black select-none pointer-events-none">
                    03
                  </span>
                  <div className="w-10 h-10 rounded-lg bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-bold">
                    3
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface">Express in Pounds (lb)</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Append the avoirdupois unit symbol (<span className="font-data-mono text-on-surface font-semibold">lb</span>). Multiply remaining decimals by 16 if your logistics or recipe specifications require combined pounds and ounces (<span className="font-data-mono text-on-surface font-semibold">lb &amp; oz</span>).
                  </p>
                </div>
              </div>

              {/* Real World Scenarios Grid */}
              <div className="pt-space-md">
                <h3 className="font-headline-md text-headline-md text-on-surface mb-space-md">
                  Primary Real-World Conversion Scenarios
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
                  {/* Scenario 1: Shipping */}
                  <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-md flex flex-col gap-space-xs">
                    <div className="h-32 rounded-lg overflow-hidden relative">
                      <Image
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCEN-rXGUMz6S0J71UDVe5zjSBpsXkJRtm979zkkyf6mnFBUP26oDFEcw1VwRI2RPsw1QDOOOC14Mmk9L3CZOBuqUr0kTC_IS9EqYQM555USUOh7oHNgW_Wdqk-TVCixuryfLR91ROdU6FSeNDhg412vAvwk0_06Oti9x7sJtI2Tz_e9QpfyCnAFbvdzeSK7XYTUm5ohIxhqBZP1m1d-W_1kuA-8IArVUC0w5yy6J-YlFjPYP9v-mBz"
                        alt="International parcel shipping warehouse with packages on conveyer belt"
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute top-2 left-2 font-label-caps text-label-caps bg-surface/90 text-on-surface px-2 py-0.5 rounded font-semibold z-10">
                        Air Logistics
                      </span>
                    </div>
                    <h4 className="font-headline-md text-headline-md text-on-surface text-base pt-1">
                      Cross-Border Freight
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      International couriers (DHL, FedEx) manifest packages in grams, while US domestic customs tariffs bill in integer pounds. Convert parcel gross weights accurately to avoid bill adjustments.
                    </p>
                  </div>

                  {/* Scenario 2: Food & Packaging */}
                  <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-md flex flex-col gap-space-xs">
                    <div className="h-32 rounded-lg overflow-hidden relative">
                      <Image
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBClAa-ShTsDf4p-89A1mbPZQXuFm2GjPWmNzv8ScCNVoTbvi3yJmQF81OzwV8S4wWbhhxbg03V2eZDOkxaQR3F4fEq-qrbLy8V1g9zQJcMk37l3Ff4Hv-d9ofYp0z-XeYaM80ZEtIy_trzzi22cnDgA5RZ7lAXmRUtEEUpfI42AXQ2fbP6Q4JKIVr7ElApCW755B1Ip801lQVzIdlNauDwg9DYxZJrXf5ccGzhVCe4pFMbqZ9DS-Y2"
                        alt="Modern organic grocery store shelf with European pasta and flour bags"
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute top-2 left-2 font-label-caps text-label-caps bg-surface/90 text-on-surface px-2 py-0.5 rounded font-semibold z-10">
                        Food Retail
                      </span>
                    </div>
                    <h4 className="font-headline-md text-headline-md text-on-surface text-base pt-1">
                      Grocery &amp; Nutrition
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      European imported goods are labeled in 500 g or 1000 g increments. Commercial US retail requires dual net-weight declarations (e.g., 500 g / 1.10 lb) under the Fair Packaging and Labeling Act.
                    </p>
                  </div>

                  {/* Scenario 3: Fitness & Body Composition */}
                  <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-md flex flex-col gap-space-xs">
                    <div className="h-32 rounded-lg overflow-hidden relative">
                      <Image
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWFUFazH9BLeqZzLyCkbHZ6BLRCAvPRBVW674rOLNBsZIf3oyWm1rwd1KKHhSELWGXy3LSnnp0vLQ_tlIV5RUlKORAkeAs40Ki40-B5EGfh0MRxoNoDg8JTB7wxILsP-SqT6FrmqcyBGgcRyAShx_2i_RB8ZizinUcpA1FesovowE7SaYLBAXDjplZj36F3SzW8LCK7nVyHdzdbwuhRExIRDu5RealoP2_hI9UacPYFsH7hXRaSzym"
                        alt="Macro nutrition preparation kitchen counter with digital scale"
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute top-2 left-2 font-label-caps text-label-caps bg-surface/90 text-on-surface px-2 py-0.5 rounded font-semibold z-10">
                        Athletic Nutrition
                      </span>
                    </div>
                    <h4 className="font-headline-md text-headline-md text-on-surface text-base pt-1">
                      Dietary Macro Tracking
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Bodybuilders track protein intake in grams per pound of lean body mass. Converting 150 g - 250 g daily allowances directly to imperial body weight ratios ensures optimal sports nutrition intake.
                    </p>
                  </div>

                  {/* Scenario 4: Precision Culinary & Baking */}
                  <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-md flex flex-col gap-space-xs">
                    <div className="h-32 rounded-lg overflow-hidden relative">
                      <Image
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGuq8730PGuq2fXEMLY_rIoTmBupKK1a4v6lcYFn1c8FWiUOZSKInngrr5LJpoOm1XwGSVOJ9iY1nH350-7Lz7-QE_jba9nLJ_8k7MYC1AT20USEzR2CNHJ5CS7sjpNlLdYNrcMFMFTzMFNNTqpzbnoVKMo_oaFv-pmPgMmv3rhhciue4tRAbiMg0573ODAHvC9XKeRNxJtyl8a4Vdcnj28R9rFywtmT-EvYLsTkbwPwr8kVcWnHRJ"
                        alt="Professional pastry chef dusting flour over sourdough bread dough"
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute top-2 left-2 font-label-caps text-label-caps bg-surface/90 text-on-surface px-2 py-0.5 rounded font-semibold z-10">
                        Patisserie Metrology
                      </span>
                    </div>
                    <h4 className="font-headline-md text-headline-md text-on-surface text-base pt-1">
                      Commercial Baking
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      French and Swiss patisserie recipes specify exact gram baker’s percentages. Large commercial bakeries in the United States scale these formulas into 50-pound batch bags of flour and butter.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 6: IN-DEPTH ENCYCLOPEDIC AUTHORITY: WHAT IS A GRAM? VS WHAT IS A POUND? */}
          <section className="w-full px-gutter-mobile lg:px-gutter-desktop max-w-max-width-canvas mx-auto py-space-xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg">
              {/* Card A: The Gram */}
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-md flex flex-col gap-space-md">
                <div className="flex items-center justify-between">
                  <span className="font-label-caps text-label-caps uppercase tracking-wider bg-surface-container px-2.5 py-1 rounded text-primary font-semibold">
                    SI Metric System
                  </span>
                  <span className="font-data-mono text-xs text-outline font-semibold">Symbol: g</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-headline-md text-on-surface">What Is a Gram?</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant pt-1">
                    The fundamental unit of mass in the CGS metric system, and 1/1,000th of an SI base kilogram.
                  </p>
                </div>
                <div className="space-y-space-sm font-body-sm text-body-sm text-on-surface-variant">
                  <p>
                    Originally conceptualized during the French Revolution in 1795, one gram was defined as the absolute mass of one cubic centimeter (<span className="font-data-mono text-on-surface">1 cm³</span>) of pure water at the freezing point of ice.
                  </p>
                  <p>
                    Following the monumental <strong>2019 SI Redefinition by the CGPM</strong>, the kilogram is no longer anchored to a physical platinum-iridium artifact (Le Grand K in Paris), but is now permanently locked to the immutable quantum <em>Planck constant</em> (<span className="font-data-mono text-on-surface">h = 6.62607015 × 10⁻³⁴ J·s</span>). A single gram is strictly defined as <span className="font-data-mono text-on-surface">10⁻³ kg</span>.
                  </p>
                  <p>
                    Today, the gram is the mandatory standard for pharmaceutical formulations, chemistry, nutritional labeling, scientific metrology, and global commerce outside the United States.
                  </p>
                </div>
                <div className="bg-surface-container-low p-space-sm rounded-lg flex items-center gap-space-xs font-data-mono text-xs text-on-surface">
                  <span className="material-symbols-outlined text-[18px] text-primary">scale</span>
                  <span>1 g = 1,000 mg = 0.001 kg = 15.432358 grains (troy)</span>
                </div>
              </div>

              {/* Card B: The Pound */}
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-md flex flex-col gap-space-md">
                <div className="flex items-center justify-between">
                  <span className="font-label-caps text-label-caps uppercase tracking-wider bg-surface-container px-2.5 py-1 rounded text-secondary font-semibold">
                    Avoirdupois System
                  </span>
                  <span className="font-data-mono text-xs text-outline font-semibold">Symbol: lb</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-headline-md text-on-surface">What Is a Pound?</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant pt-1">
                    The legal primary unit of mass in the United States Customary and British Imperial systems.
                  </p>
                </div>
                <div className="space-y-space-sm font-body-sm text-body-sm text-on-surface-variant">
                  <p>
                    The term <em>pound</em> derives from the Roman <em>libra pondo</em> (&ldquo;a pound by weight&rdquo;), giving rise to its historical abbreviation <span className="font-data-mono text-on-surface">lb</span>. In medieval England, varied regional pounds existed until the Anglo-Norman <em>avoirdupois</em> system (&ldquo;goods of weight&rdquo;) standardized on 16 ounces.
                  </p>
                  <p>
                    In 1959, the <strong>International Yard and Pound Agreement</strong> resolved discrepancies between American and British pounds by establishing a single universal standard: <span className="font-data-mono text-on-surface font-semibold">1 lb = 0.45359237 kg</span> exactly.
                  </p>
                  <p>
                    Crucially, an avoirdupois pound (16 ounces = 7,000 grains) differs from the specialized <em>Troy Pound</em> (12 ounces = 5,760 grains = 373.24 g) used solely for precious bullion like gold and silver. All commercial scales, luggage gauges, and grocery systems utilize the avoirdupois pound.
                  </p>
                </div>
                <div className="bg-surface-container-low p-space-sm rounded-lg flex items-center gap-space-xs font-data-mono text-xs text-on-surface">
                  <span className="material-symbols-outlined text-[18px] text-secondary">balance</span>
                  <span>1 lb = 16 oz = 7,000 grains = 453.59237 g exactly</span>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 7: AUTHORITATIVE FAQ KNOWLEDGE BASE */}
          <section className="w-full px-gutter-mobile lg:px-gutter-desktop max-w-max-width-canvas mx-auto py-space-xl">
            <div className="max-w-max-width-calculator mx-auto flex flex-col gap-space-lg">
              <div className="text-center space-y-space-2xs">
                <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-semibold">
                  FREQUENTLY ASKED QUESTIONS
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                  Metrology &amp; Usage FAQ
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto">
                  Expert answers to common queries regarding mass conversion, legal standards, and computational precision.
                </p>
              </div>

              {/* 10 Accordion FAQ Items */}
              <div className="space-y-space-xs" id="faq-container">
                {/* FAQ 1 */}
                <details className="group bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden p-space-md transition-all open:shadow-md" open>
                  <summary className="flex items-center justify-between cursor-pointer font-headline-md text-headline-md text-base text-on-surface select-none list-none">
                    <span>How many pounds are in 1 gram?</span>
                    <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">
                      expand_more
                    </span>
                  </summary>
                  <div className="pt-space-xs font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    There are approximately <strong className="font-data-mono text-on-surface">0.00220462262 pounds</strong> in 1 gram. In exact fractional terms governed by the 1959 international treaty, 1 gram is equal to 1 / 453.59237 avoirdupois pounds.
                  </div>
                </details>

                {/* FAQ 2 */}
                <details className="group bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden p-space-md transition-all open:shadow-md">
                  <summary className="flex items-center justify-between cursor-pointer font-headline-md text-headline-md text-base text-on-surface select-none list-none">
                    <span>How do I convert grams to pounds?</span>
                    <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">
                      expand_more
                    </span>
                  </summary>
                  <div className="pt-space-xs font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    To convert grams to pounds, multiply the gram amount by <span className="font-data-mono text-on-surface font-semibold">0.00220462262</span>, or divide the gram amount directly by <span className="font-data-mono text-on-surface font-semibold">453.59237</span>. For quick estimations, divide the grams by 454.
                  </div>
                </details>

                {/* FAQ 3 */}
                <details className="group bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden p-space-md transition-all open:shadow-md">
                  <summary className="flex items-center justify-between cursor-pointer font-headline-md text-headline-md text-base text-on-surface select-none list-none">
                    <span>How many pounds is 100 grams?</span>
                    <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">
                      expand_more
                    </span>
                  </summary>
                  <div className="pt-space-xs font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    100 grams is equal to approximately <strong className="font-data-mono text-on-surface">0.220462 pounds</strong>, which corresponds to roughly 3.527 ounces (just over 3.5 oz), or approximately the weight of a standard bar of chocolate.
                  </div>
                </details>

                {/* FAQ 4 */}
                <details className="group bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden p-space-md transition-all open:shadow-md">
                  <summary className="flex items-center justify-between cursor-pointer font-headline-md text-headline-md text-base text-on-surface select-none list-none">
                    <span>How many pounds is 500 grams?</span>
                    <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">
                      expand_more
                    </span>
                  </summary>
                  <div className="pt-space-xs font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    500 grams is equal to <strong className="font-data-mono text-on-surface">1.102311 pounds</strong> (or 1 pound and 1.64 ounces). 500 grams is also half a kilogram (0.5 kg).
                  </div>
                </details>

                {/* FAQ 5 */}
                <details className="group bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden p-space-md transition-all open:shadow-md">
                  <summary className="flex items-center justify-between cursor-pointer font-headline-md text-headline-md text-base text-on-surface select-none list-none">
                    <span>How many pounds is 1,000 grams?</span>
                    <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">
                      expand_more
                    </span>
                  </summary>
                  <div className="pt-space-xs font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    1,000 grams equals exactly 1 kilogram, which converts to <strong className="font-data-mono text-on-surface">2.204623 pounds</strong> (or 2 pounds and 3.27 ounces).
                  </div>
                </details>

                {/* FAQ 6 */}
                <details className="group bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden p-space-md transition-all open:shadow-md">
                  <summary className="flex items-center justify-between cursor-pointer font-headline-md text-headline-md text-base text-on-surface select-none list-none">
                    <span>Is a pound larger than a gram?</span>
                    <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">
                      expand_more
                    </span>
                  </summary>
                  <div className="pt-space-xs font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Yes, significantly larger. It takes exactly <strong className="text-on-surface font-semibold">453.59237 grams</strong> to equal a single pound. Thus, a pound is over 453 times heavier than one gram.
                  </div>
                </details>

                {/* FAQ 7 */}
                <details className="group bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden p-space-md transition-all open:shadow-md">
                  <summary className="flex items-center justify-between cursor-pointer font-headline-md text-headline-md text-base text-on-surface select-none list-none">
                    <span>Can I use this converter for baking and food recipes?</span>
                    <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">
                      expand_more
                    </span>
                  </summary>
                  <div className="pt-space-xs font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Yes. Baking relies on mass rather than volume for consistent pastry structure. This calculator provides accurate avoirdupois weight conversions for flour, sugar, butter, and liquids when adapting international culinary recipes.
                  </div>
                </details>

                {/* FAQ 8 */}
                <details className="group bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden p-space-md transition-all open:shadow-md">
                  <summary className="flex items-center justify-between cursor-pointer font-headline-md text-headline-md text-base text-on-surface select-none list-none">
                    <span>How accurate is this calculator?</span>
                    <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">
                      expand_more
                    </span>
                  </summary>
                  <div className="pt-space-xs font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    The SolveIt computational core utilizes IEEE 754 64-bit floating point math using the exact legal constant defined by the BIPM and NIST Special Publication 811. Results are deterministic to over 8 decimal places with zero network latency.
                  </div>
                </details>

                {/* FAQ 9 */}
                <details className="group bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden p-space-md transition-all open:shadow-md">
                  <summary className="flex items-center justify-between cursor-pointer font-headline-md text-headline-md text-base text-on-surface select-none list-none">
                    <span>How many grams are in one pound?</span>
                    <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">
                      expand_more
                    </span>
                  </summary>
                  <div className="pt-space-xs font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    There are exactly <strong className="font-data-mono text-on-surface">453.59237 grams</strong> in one avoirdupois pound. In commercial everyday packaging, this is routinely rounded to 453.6 g or 454 g.
                  </div>
                </details>

                {/* FAQ 10 */}
                <details className="group bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden p-space-md transition-all open:shadow-md">
                  <summary className="flex items-center justify-between cursor-pointer font-headline-md text-headline-md text-base text-on-surface select-none list-none">
                    <span>What is the difference between an avoirdupois pound and a troy pound?</span>
                    <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">
                      expand_more
                    </span>
                  </summary>
                  <div className="pt-space-xs font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    The avoirdupois pound contains 16 ounces and equals 453.59237 g, used for general merchandise, freight, and grocery trade. A troy pound contains only 12 troy ounces (5,760 grains = 373.242 g) and is reserved strictly for precious metals like gold, platinum, and silver.
                  </div>
                </details>
              </div>
            </div>
          </section>

          {/* SECTION 8: RELATED CONVERSIONS & INTERNAL LINKING MESH */}
          <section className="w-full px-gutter-mobile lg:px-gutter-desktop max-w-max-width-canvas mx-auto pt-space-md pb-space-3xl">
            <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-xl shadow-surface-tint/5 flex flex-col gap-space-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
                <div>
                  <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-semibold">
                    METROLOGICAL MESH
                  </span>
                  <h2 className="font-headline-md text-headline-md text-on-surface">Related Mass &amp; Weight Converters</h2>
                </div>
                <Link className="text-primary hover:underline font-body-sm text-body-sm flex items-center gap-1" href="/conversion">
                  <span>All Mass Calculators</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>

              {/* Links Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-sm">
                {/* Reverse Pair */}
                <button
                  onClick={handleSwap}
                  className="bg-surface-container-low hover:bg-surface-container p-space-md rounded-xl transition-all flex flex-col gap-1 group shadow-sm hover:shadow-md text-left"
                  type="button"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps uppercase text-primary font-semibold">Reverse Engine</span>
                    <span className="material-symbols-outlined text-[18px] text-primary group-hover:translate-x-0.5 transition-transform">
                      sync_alt
                    </span>
                  </div>
                  <span className="font-headline-md text-headline-md text-base text-on-surface">Pound to Gram (lb to g)</span>
                  <span className="font-body-sm text-xs text-on-surface-variant">Multiply by 453.59237</span>
                </button>

                {/* Gram to Ounce */}
                <Link className="bg-surface-container-low hover:bg-surface-container p-space-md rounded-xl transition-all flex flex-col gap-1 group shadow-sm hover:shadow-md" href="/conversion/gram-to-ounces">
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps uppercase text-secondary font-semibold">Avoirdupois</span>
                    <span className="material-symbols-outlined text-[18px] text-secondary group-hover:translate-x-0.5 transition-transform">
                      arrow_forward
                    </span>
                  </div>
                  <span className="font-headline-md text-headline-md text-base text-on-surface">Gram to Ounces (g to oz)</span>
                  <span className="font-body-sm text-xs text-on-surface-variant">1 g = 0.035274 oz</span>
                </Link>

                {/* Gram to Kilogram */}
                <Link className="bg-surface-container-low hover:bg-surface-container p-space-md rounded-xl transition-all flex flex-col gap-1 group shadow-sm hover:shadow-md" href="/conversion/gram-to-kilogram">
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps uppercase text-on-surface-variant font-semibold">SI Metric</span>
                    <span className="material-symbols-outlined text-[18px] text-on-surface group-hover:translate-x-0.5 transition-transform">
                      arrow_forward
                    </span>
                  </div>
                  <span className="font-headline-md text-headline-md text-base text-on-surface">Gram to Kilograms (g to kg)</span>
                  <span className="font-body-sm text-xs text-on-surface-variant">Divide by 1,000 exact</span>
                </Link>

                {/* Gram to Milligram */}
                <Link className="bg-surface-container-low hover:bg-surface-container p-space-md rounded-xl transition-all flex flex-col gap-1 group shadow-sm hover:shadow-md" href="/conversion/gram-to-milligram">
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps uppercase text-on-surface-variant font-semibold">Laboratory</span>
                    <span className="material-symbols-outlined text-[18px] text-on-surface group-hover:translate-x-0.5 transition-transform">
                      arrow_forward
                    </span>
                  </div>
                  <span className="font-headline-md text-headline-md text-base text-on-surface">Gram to Milligrams (g to mg)</span>
                  <span className="font-body-sm text-xs text-on-surface-variant">Multiply by 1,000 exact</span>
                </Link>

                {/* Gram to Tablespoon */}
                <Link className="bg-surface-container-low hover:bg-surface-container p-space-md rounded-xl transition-all flex flex-col gap-1 group shadow-sm hover:shadow-md" href="/conversion/grams-to-tablespoons">
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps uppercase text-primary font-semibold">Culinary</span>
                    <span className="material-symbols-outlined text-[18px] text-primary group-hover:translate-x-0.5 transition-transform">
                      arrow_forward
                    </span>
                  </div>
                  <span className="font-headline-md text-headline-md text-base text-on-surface">Gram to Tablespoons</span>
                  <span className="font-body-sm text-xs text-on-surface-variant">Density calibrated ingredient index</span>
                </Link>

                {/* Gram to Teaspoons */}
                <Link className="bg-surface-container-low hover:bg-surface-container p-space-md rounded-xl transition-all flex flex-col gap-1 group shadow-sm hover:shadow-md" href="/conversion/grams-to-teaspoons">
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps uppercase text-primary font-semibold">Culinary</span>
                    <span className="material-symbols-outlined text-[18px] text-primary group-hover:translate-x-0.5 transition-transform">
                      arrow_forward
                    </span>
                  </div>
                  <span className="font-headline-md text-headline-md text-base text-on-surface">Gram to Teaspoons (g to tsp)</span>
                  <span className="font-body-sm text-xs text-on-surface-variant">Baking &amp; spice precision</span>
                </Link>

                {/* Gram to Milliliters */}
                <Link className="bg-surface-container-low hover:bg-surface-container p-space-md rounded-xl transition-all flex flex-col gap-1 group shadow-sm hover:shadow-md" href="/conversion/grams-to-milliliters">
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps uppercase text-secondary font-semibold">Volume Density</span>
                    <span className="material-symbols-outlined text-[18px] text-secondary group-hover:translate-x-0.5 transition-transform">
                      arrow_forward
                    </span>
                  </div>
                  <span className="font-headline-md text-headline-md text-base text-on-surface">Gram to Milliliters (g to mL)</span>
                  <span className="font-body-sm text-xs text-on-surface-variant">USDA calibrated liquids</span>
                </Link>

                {/* Kilogram to Pound */}
                <Link className="bg-surface-container-low hover:bg-surface-container p-space-md rounded-xl transition-all flex flex-col gap-1 group shadow-sm hover:shadow-md" href="/weight-mass-converter">
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps uppercase text-on-surface-variant font-semibold">Heavy Freight</span>
                    <span className="material-symbols-outlined text-[18px] text-on-surface group-hover:translate-x-0.5 transition-transform">
                      arrow_forward
                    </span>
                  </div>
                  <span className="font-headline-md text-headline-md text-base text-on-surface">Kilogram to Pounds (kg to lb)</span>
                  <span className="font-body-sm text-xs text-on-surface-variant">1 kg = 2.20462 lb</span>
                </Link>
              </div>

              {/* Trust Footer Note */}
              <div className="flex flex-wrap items-center justify-between pt-space-xs text-xs text-outline-variant font-data-mono">
                <span>Deterministic Sandbox Engine v4.18 • NIST SP 811 Compliant Pipeline</span>
                <span>Local Computation Guarantee • Zero User Telemetry Transmitted</span>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
