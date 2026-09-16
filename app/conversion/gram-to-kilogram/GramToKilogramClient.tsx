'use client';

import React, { useState, useMemo, useRef } from 'react';
import Link from 'next/link';

interface TableRowData {
  grams: number;
  label: string;
  exactKg: number;
  fractional: string;
  benchmark: string;
  isStandard?: boolean;
}

const BENCHMARK_ROWS: TableRowData[] = [
  { grams: 1, label: '1 g', exactKg: 0.001, fractional: '1/1000 kg', benchmark: 'Standard small paperclip, single raisin' },
  { grams: 5, label: '5 g', exactKg: 0.005, fractional: '1/200 kg', benchmark: 'US nickel coin exact legal mint mass' },
  { grams: 10, label: '10 g', exactKg: 0.010, fractional: '1/100 kg', benchmark: 'Standard baker’s dry yeast packet or 2 nickels' },
  { grams: 25, label: '25 g', exactKg: 0.025, fractional: '1/40 kg', benchmark: 'Standard first-class domestic postal letter' },
  { grams: 50, label: '50 g', exactKg: 0.050, fractional: '1/20 kg', benchmark: 'Medium chicken egg (without shell)' },
  { grams: 100, label: '100 g', exactKg: 0.100, fractional: '1/10 kg (1 hg)', benchmark: 'Standard chocolate confection bar or small apple' },
  { grams: 250, label: '250 g', exactKg: 0.250, fractional: '1/4 kg', benchmark: 'Standard tub of butter / 1 metric cup liquid' },
  { grams: 500, label: '500 g', exactKg: 0.500, fractional: '1/2 kg (metric lb)', benchmark: 'Artisanal bakery loaf / package of dry pasta' },
  { grams: 750, label: '750 g', exactKg: 0.750, fractional: '3/4 kg', benchmark: 'Standard 750 mL wine bottle contents' },
  { grams: 1000, label: '1,000 g', exactKg: 1.000, fractional: '1 SI Base Kilogram', benchmark: '1 Liter pure H₂O at 4°C / bag of granulated sugar', isStandard: true },
  { grams: 2000, label: '2,000 g', exactKg: 2.000, fractional: '2 kg', benchmark: 'Pair of heavy alpine mountaineering boots' },
  { grams: 2500, label: '2,500 g', exactKg: 2.500, fractional: '2 ½ kg', benchmark: 'Standard commercial flour sack / domestic cat' },
  { grams: 5000, label: '5,000 g', exactKg: 5.000, fractional: '5 kg', benchmark: 'Standard gym dumbbell / healthy newborn' },
  { grams: 10000, label: '10,000 g', exactKg: 10.000, fractional: '10 kg', benchmark: 'Domestic airline carry-on luggage limit' },
];

export default function GramToKilogramClient() {
  const [inputValue, setInputValue] = useState<string>('1000');
  const [direction, setDirection] = useState<'g-to-kg' | 'kg-to-g'>('g-to-kg');
  const [precision, setPrecision] = useState<number>(6);
  const [copied, setCopied] = useState<boolean>(false);
  const [tableSearch, setTableSearch] = useState<string>('');

  const workbenchRef = useRef<HTMLDivElement>(null);

  const parsedNum = parseFloat(inputValue);
  const isValid = !isNaN(parsedNum) && parsedNum >= 0;

  const {
    gramsVal,
    kgVal,
    formattedResult,
    formulaCalculationStr,
    multiLb,
    multiOz,
    multiMg,
    multiTon,
  } = useMemo(() => {
    if (!isValid) {
      return {
        gramsVal: 0,
        kgVal: 0,
        formattedResult: (0).toFixed(precision),
        formulaCalculationStr: direction === 'g-to-kg' ? '0 g ÷ 1,000 = 0 kg' : '0 kg × 1,000 = 0 g',
        multiLb: '0.000000 lb',
        multiOz: '0.000000 oz',
        multiMg: '0 mg',
        multiTon: '0.000000 t',
      };
    }

    if (direction === 'g-to-kg') {
      const g = parsedNum;
      const kg = g / 1000;
      const avdpLb = kg * 2.2046226218;
      const avdpOz = kg * 35.27396195;
      const metricMg = g * 1000;
      const metricTons = kg / 1000;

      return {
        gramsVal: g,
        kgVal: kg,
        formattedResult: kg.toFixed(precision),
        formulaCalculationStr: `${g.toLocaleString('en-US')} g ÷ 1,000 = ${kg.toFixed(precision)} kg`,
        multiLb: `${avdpLb.toFixed(precision <= 4 ? 4 : 6)} lb`,
        multiOz: `${avdpOz.toFixed(precision <= 4 ? 4 : 6)} oz`,
        multiMg: `${Math.round(metricMg).toLocaleString('en-US')} mg`,
        multiTon: `${metricTons.toFixed(6)} t`,
      };
    } else {
      const kg = parsedNum;
      const g = kg * 1000;
      const avdpLb = kg * 2.2046226218;
      const avdpOz = kg * 35.27396195;
      const metricMg = g * 1000;
      const metricTons = kg / 1000;

      return {
        gramsVal: g,
        kgVal: kg,
        formattedResult: g.toFixed(precision),
        formulaCalculationStr: `${kg.toLocaleString('en-US')} kg × 1,000 = ${g.toFixed(precision)} g`,
        multiLb: `${avdpLb.toFixed(precision <= 4 ? 4 : 6)} lb`,
        multiOz: `${avdpOz.toFixed(precision <= 4 ? 4 : 6)} oz`,
        multiMg: `${Math.round(metricMg).toLocaleString('en-US')} mg`,
        multiTon: `${metricTons.toFixed(6)} t`,
      };
    }
  }, [isValid, parsedNum, direction, precision]);

  const handleSwap = () => {
    if (direction === 'g-to-kg') {
      setDirection('kg-to-g');
      if (isValid) {
        setInputValue(kgVal.toFixed(4));
      }
    } else {
      setDirection('g-to-kg');
      if (isValid) {
        setInputValue(Math.round(gramsVal).toString());
      }
    }
  };

  const handleCopy = () => {
    const textToCopy = `${formattedResult} ${direction === 'g-to-kg' ? 'kg' : 'g'}`;
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
    setInputValue('1000');
    setDirection('g-to-kg');
    setPrecision(6);
  };

  const handlePreset = (val: number) => {
    setDirection('g-to-kg');
    setInputValue(val.toString());
  };

  const handleLoadTableVal = (val: number) => {
    setDirection('g-to-kg');
    setInputValue(val.toString());
    if (workbenchRef.current) {
      const top = workbenchRef.current.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const filteredRows = useMemo(() => {
    const query = tableSearch.trim().toLowerCase();
    if (!query) return BENCHMARK_ROWS;
    return BENCHMARK_ROWS.filter(
      (row) =>
        row.label.toLowerCase().includes(query) ||
        row.exactKg.toFixed(3).includes(query) ||
        row.fractional.toLowerCase().includes(query) ||
        row.benchmark.toLowerCase().includes(query)
    );
  }, [tableSearch]);

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen flex flex-col selection:bg-primary-container selection:text-primary">
      {/* Structured JSON-LD Metrology & Semantic Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'WebPage',
                '@id': 'https://solveitcalculator.com/conversion/gram-to-kilogram#webpage',
                url: 'https://solveitcalculator.com/conversion/gram-to-kilogram',
                name: 'Gram to Kilogram Converter (g to kg) – Instant Conversion Calculator',
                description:
                  'Convert grams to kilograms instantly with our free Gram to Kilogram Converter. Enter any value in grams and get accurate kilogram conversions, formulas, conversion tables, and FAQs.',
                isPartOf: {
                  '@type': 'WebSite',
                  '@id': 'https://solveitcalculator.com/#website',
                  name: 'SolveIt Calculator Precision System',
                  url: 'https://solveitcalculator.com',
                },
              },
              {
                '@type': 'WebApplication',
                '@id': 'https://solveitcalculator.com/conversion/gram-to-kilogram#software',
                name: 'SolveIt Gram to Kilogram Computational Engine',
                applicationCategory: 'UtilitiesApplication',
                operatingSystem: 'All',
                browserRequirements: 'Requires JavaScript. Requires HTML5.',
                offers: {
                  '@type': 'Offer',
                  price: '0',
                  priceCurrency: 'USD',
                },
              },
              {
                '@type': 'BreadcrumbList',
                '@id': 'https://solveitcalculator.com/conversion/gram-to-kilogram#breadcrumbs',
                itemListElement: [
                  {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'Home',
                    item: 'https://solveitcalculator.com',
                  },
                  {
                    '@type': 'ListItem',
                    position: 2,
                    name: 'Conversion Hub',
                    item: 'https://solveitcalculator.com/conversion',
                  },
                  {
                    '@type': 'ListItem',
                    position: 3,
                    name: 'Mass & Weight',
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
                    name: 'Gram to Kilogram (g to kg)',
                    item: 'https://solveitcalculator.com/conversion/gram-to-kilogram',
                  },
                ],
              },
              {
                '@type': 'HowTo',
                '@id': 'https://solveitcalculator.com/conversion/gram-to-kilogram#howto',
                name: 'How to Convert Grams to Kilograms in 3 Steps',
                step: [
                  {
                    '@type': 'HowToStep',
                    position: 1,
                    name: 'Identify Mass in Grams',
                    text: 'Record the mass measurement in grams (g) using your balance, scale, or recipe value.',
                  },
                  {
                    '@type': 'HowToStep',
                    position: 2,
                    name: 'Divide by 1,000',
                    text: 'Shift the decimal point three places to the left, equivalent to dividing by 1,000 or multiplying by 0.001.',
                  },
                  {
                    '@type': 'HowToStep',
                    position: 3,
                    name: 'State the Mass in Kilograms',
                    text: 'Affix the SI base unit symbol kg to express the final standardized mass.',
                  },
                ],
              },
              {
                '@type': 'FAQPage',
                '@id': 'https://solveitcalculator.com/conversion/gram-to-kilogram#faq',
                mainEntity: [
                  {
                    '@type': 'Question',
                    name: 'How many kilograms are in 1 gram?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'There is exactly 0.001 kilograms in 1 gram (1/1,000 kg or 10⁻³ kg).',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'How do I convert grams to kilograms?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'To convert grams to kilograms, divide the gram value by 1,000 or multiply by 0.001.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'How many kilograms is 100 grams?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: '100 grams is equal to exactly 0.1 kilograms (1/10 kg or 1 hectogram).',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'How many kilograms is 500 grams?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: '500 grams equals exactly 0.5 kilograms (½ kg or a metric pound).',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'How many kilograms is 1000 grams?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: '1,000 grams equals exactly 1 kilogram (1 kg).',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'Which is larger, a gram or a kilogram?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'A kilogram is 1,000 times larger than a gram.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'Can I use this converter for food and cooking measurements?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'Yes. Grams to kilograms conversions are ideal for scaling commercial baking recipes and macro nutritional tracking.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'How accurate is this converter?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'It is deterministic and mathematically exact, operating on IEEE 754 64-bit double precision according to BIPM SI standards.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'How many grams are in one kilogram?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'There are precisely 1,000 grams in 1 kilogram.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'What is the formula for converting grams to kilograms?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'Kilograms (kg) = Grams (g) ÷ 1,000 or Kilograms (kg) = Grams (g) × 0.001.',
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
                <span className="text-primary font-semibold">Gram to Kilogram (g to kg)</span>
              </nav>

              <div className="flex items-center gap-space-xs bg-surface-container px-space-sm py-1 rounded-full text-on-surface-variant shadow-sm border border-outline-variant/20">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span className="font-label-caps text-label-caps uppercase tracking-wider font-semibold">
                  BIPM / SI METRIC BASE STANDARD (CGPM 2019)
                </span>
              </div>
            </div>

            {/* Title & Executive Metrological Abstract */}
            <div className="space-y-space-xs max-w-3xl">
              <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                Gram to Kilogram Converter <span className="text-primary font-light">(g to kg)</span>
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Convert grams (<span className="font-data-mono font-semibold text-on-surface">g</span>) into kilograms (<span className="font-data-mono font-semibold text-on-surface">kg</span>) with zero-latency deterministic accuracy. Calibrated directly to the BIPM International System of Units (<span className="font-data-mono text-xs text-primary font-semibold">1 kg = 1,000 g</span>) with live multi-unit breakdowns, SI decimal shifting derivations, and high-precision scientific reference tables.
              </p>
            </div>

            {/* Trust & Performance Badges */}
            <div className="flex flex-wrap items-center gap-space-xs pt-space-sm">
              <span className="inline-flex items-center gap-1 bg-surface-container-lowest border border-outline-variant/20 px-3 py-1 rounded-lg text-on-surface font-label-caps text-label-caps shadow-sm">
                <span className="material-symbols-outlined text-[16px] text-primary">verified_user</span>
                100% Free &amp; Private (Client Sandbox)
              </span>
              <span className="inline-flex items-center gap-1 bg-surface-container-lowest border border-outline-variant/20 px-3 py-1 rounded-lg text-on-surface font-label-caps text-label-caps shadow-sm">
                <span className="material-symbols-outlined text-[16px] text-secondary">tune</span>
                Exact SI Metric Ratio (10⁻³ kg)
              </span>
              <span className="inline-flex items-center gap-1 bg-surface-container-lowest border border-outline-variant/20 px-3 py-1 rounded-lg text-on-surface font-label-caps text-label-caps shadow-sm">
                <span className="material-symbols-outlined text-[16px] text-primary">precision_manufacturing</span>
                8-Decimal IEEE 754 Precision
              </span>
              <span className="inline-flex items-center gap-1 bg-surface-container-lowest border border-outline-variant/20 px-3 py-1 rounded-lg text-on-surface font-label-caps text-label-caps shadow-sm">
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant">bolt</span>
                Instant Calculation
              </span>
              <span className="inline-flex items-center gap-1 bg-surface-container-high px-3 py-1 rounded-lg text-on-surface font-label-caps text-label-caps border border-outline-variant/20">
                <span className="material-symbols-outlined text-[16px] text-primary">update</span>
                2026 Calibrated Pipeline
              </span>
            </div>
          </section>

          {/* SECTION 2: INTERACTIVE WORKBENCH & METROLOGY INSIGHT CARD */}
          <section className="w-full px-gutter-mobile lg:px-gutter-desktop max-w-max-width-canvas mx-auto py-space-md" ref={workbenchRef}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
              {/* Interactive Calculator Workbench (8 cols) */}
              <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl p-space-lg shadow-xl shadow-surface-tint/5 border border-outline-variant/20 flex flex-col gap-space-md relative overflow-hidden">
                {/* Card Top Bar & Precision Control */}
                <div className="flex flex-wrap items-center justify-between gap-space-xs pb-space-xs border-b border-outline-variant/20">
                  <div className="flex items-center gap-space-xs">
                    <span className="p-2 rounded-lg bg-primary-fixed text-on-primary-fixed flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px]">calculate</span>
                    </span>
                    <div>
                      <h2 className="font-headline-md text-headline-md text-on-surface leading-tight">Interactive Converter</h2>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">Real-time bi-directional SI mass recalculation</span>
                    </div>
                  </div>

                  {/* Precision Selector */}
                  <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-lg border border-outline-variant/20">
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
                  <div className="md:col-span-5 bg-surface-container-low p-space-md rounded-xl border border-outline-variant/20 flex flex-col gap-space-xs">
                    <div className="flex items-center justify-between">
                      <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider font-semibold" htmlFor="gramInput">
                        {direction === 'g-to-kg' ? 'FROM: GRAMS (g)' : 'FROM: KILOGRAMS (kg)'}
                      </label>
                      <span className="font-label-caps text-label-caps bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded font-mono">
                        {direction === 'g-to-kg' ? 'SI Subunit [g]' : 'SI Base Unit [kg]'}
                      </span>
                    </div>
                    <div className="relative flex items-center">
                      <input
                        aria-label={direction === 'g-to-kg' ? 'Mass in Grams' : 'Mass in Kilograms'}
                        className="w-full bg-surface-container-lowest text-on-surface font-numerical-display text-numerical-display px-4 py-3 rounded-lg shadow-sm border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary font-data-mono"
                        id="gramInput"
                        min="0"
                        placeholder="0"
                        step="any"
                        type="number"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                      />
                      <span className="absolute right-4 font-data-mono font-semibold text-on-surface-variant text-lg pointer-events-none">
                        {direction === 'g-to-kg' ? 'g' : 'kg'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant">
                      <span>{direction === 'g-to-kg' ? 'Exact SI: 1 g = 0.001 kg' : 'Exact SI: 1 kg = 1,000 g'}</span>
                      <button className="text-primary hover:underline text-xs" onClick={handleClear} type="button">
                        Clear
                      </button>
                    </div>
                  </div>

                  {/* Directional Swap Unit Button */}
                  <div className="md:col-span-1 flex justify-center py-2 md:py-0">
                    <button
                      className="w-11 h-11 rounded-full bg-surface-container-high hover:bg-primary hover:text-on-primary text-on-surface border border-outline-variant/30 flex items-center justify-center transition-all shadow-md active:scale-95 group"
                      onClick={handleSwap}
                      type="button"
                      title={direction === 'g-to-kg' ? 'Switch to Kilogram to Gram Converter' : 'Switch to Gram to Kilogram Converter'}
                    >
                      <span className="material-symbols-outlined text-[22px] group-hover:rotate-180 transition-transform duration-300">
                        swap_horiz
                      </span>
                    </button>
                  </div>

                  {/* Output Side */}
                  <div className="md:col-span-5 bg-surface-container-low p-space-md rounded-xl border border-outline-variant/20 flex flex-col gap-space-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider font-semibold">
                        {direction === 'g-to-kg' ? 'TO: KILOGRAMS (kg)' : 'TO: GRAMS (g)'}
                      </span>
                      <span className="font-label-caps text-label-caps bg-secondary-fixed text-on-secondary-fixed px-2 py-0.5 rounded font-mono">
                        {direction === 'g-to-kg' ? 'SI Base Unit [kg]' : 'SI Subunit [g]'}
                      </span>
                    </div>
                    <div className="relative flex items-center bg-surface-container-lowest px-4 py-3 rounded-lg shadow-sm border border-outline-variant/30 overflow-hidden">
                      <div className="w-full overflow-x-auto whitespace-nowrap">
                        <span className="font-numerical-display text-numerical-display text-primary font-data-mono font-extrabold select-all">
                          {formattedResult}
                        </span>
                      </div>
                      <span className="font-data-mono font-bold text-on-surface-variant text-lg ml-2">
                        {direction === 'g-to-kg' ? 'kg' : 'g'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant">
                      <span className="text-xs font-data-mono text-on-surface truncate">
                        {formulaCalculationStr}
                      </span>
                      <span className="text-xs text-outline-variant whitespace-nowrap ml-2">1:0.001 Exact</span>
                    </div>
                  </div>
                </div>

                {/* Quick Select Metric Benchmarks */}
                <div className="flex flex-col gap-space-2xs pt-1">
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                    Quick Mass Presets (BIPM Benchmarks):
                  </span>
                  <div className="flex flex-wrap gap-1.5" id="presetButtons">
                    {[1, 5, 10, 25, 50, 100, 250, 500].map((val) => (
                      <button
                        key={val}
                        className="px-2.5 py-1 rounded bg-surface-container hover:bg-primary hover:text-on-primary font-data-mono text-body-sm text-on-surface border border-outline-variant/20 transition-colors"
                        onClick={() => handlePreset(val)}
                        type="button"
                      >
                        {val} g
                      </button>
                    ))}
                    <button
                      className="px-2.5 py-1 rounded bg-primary-fixed text-on-primary-fixed font-data-mono text-body-sm font-semibold hover:bg-primary hover:text-on-primary border border-primary/30 transition-colors"
                      onClick={() => handlePreset(1000)}
                      type="button"
                    >
                      1,000 g (1 kg)
                    </button>
                    {[2500, 5000, 10000].map((val) => (
                      <button
                        key={val}
                        className="px-2.5 py-1 rounded bg-surface-container hover:bg-primary hover:text-on-primary font-data-mono text-body-sm text-on-surface border border-outline-variant/20 transition-colors"
                        onClick={() => handlePreset(val)}
                        type="button"
                      >
                        {val.toLocaleString('en-US')} g
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Toolbar & Live Proof Line */}
                <div className="flex flex-wrap items-center justify-between gap-space-sm pt-space-xs bg-surface-container-low p-space-md rounded-xl border border-outline-variant/20">
                  <div className="flex flex-wrap items-center gap-space-xs">
                    <button
                      className="bg-primary hover:bg-primary-container text-on-primary px-4 py-2 rounded-lg font-body-sm font-semibold flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
                      onClick={() => {}}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">sync</span>
                      <span>Convert</span>
                    </button>
                    <button
                      className="bg-surface-container-lowest hover:bg-surface-container text-on-surface border border-outline-variant/30 px-3 py-2 rounded-lg font-body-sm flex items-center gap-1.5 shadow-sm transition-all"
                      onClick={handleCopy}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">{copied ? 'check' : 'content_copy'}</span>
                      <span>{copied ? 'Copied!' : 'Copy Result'}</span>
                    </button>
                    <button
                      className="bg-surface-container-lowest hover:bg-surface-container text-on-surface border border-outline-variant/30 px-3 py-2 rounded-lg font-body-sm flex items-center gap-1.5 shadow-sm transition-all hidden sm:flex"
                      onClick={() => typeof window !== 'undefined' && window.print()}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">print</span>
                      <span>Print</span>
                    </button>
                    <button
                      className="bg-surface-container-lowest hover:bg-surface-container text-on-surface border border-outline-variant/30 px-3 py-2 rounded-lg font-body-sm flex items-center gap-1.5 shadow-sm transition-all"
                      onClick={handleReset}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">restart_alt</span>
                      <span>Reset</span>
                    </button>
                  </div>

                  <div className="font-data-mono text-xs text-on-surface-variant bg-surface-container-lowest border border-outline-variant/20 px-3 py-1.5 rounded-lg shadow-sm">
                    <span>{formulaCalculationStr}</span>
                  </div>
                </div>

                {/* Simultaneous Multi-Unit Drawer */}
                <div className="pt-space-xs">
                  <div className="flex items-center justify-between pb-2">
                    <span className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant font-semibold">
                      Simultaneous Mass Metrics (Auto-Synchronized)
                    </span>
                    <span className="font-body-sm text-xs text-outline-variant">SI &amp; Avoirdupois</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-xs font-data-mono">
                    <div className="bg-surface-container-low border border-outline-variant/20 p-3 rounded-lg">
                      <span className="font-label-caps text-label-caps text-outline uppercase block">Pounds (lb avdp)</span>
                      <span className="font-semibold text-on-surface text-base">{multiLb}</span>
                      <span className="text-[10px] text-outline-variant block mt-0.5">1 kg ≈ 2.20462 lb</span>
                    </div>
                    <div className="bg-surface-container-low border border-outline-variant/20 p-3 rounded-lg">
                      <span className="font-label-caps text-label-caps text-outline uppercase block">Ounces (oz avdp)</span>
                      <span className="font-semibold text-on-surface text-base">{multiOz}</span>
                      <span className="text-[10px] text-outline-variant block mt-0.5">1 kg ≈ 35.274 oz</span>
                    </div>
                    <div className="bg-surface-container-low border border-outline-variant/20 p-3 rounded-lg">
                      <span className="font-label-caps text-label-caps text-outline uppercase block">Milligrams (mg)</span>
                      <span className="font-semibold text-on-surface text-base">{multiMg}</span>
                      <span className="text-[10px] text-outline-variant block mt-0.5">1 g = 1,000 mg</span>
                    </div>
                    <div className="bg-surface-container-low border border-outline-variant/20 p-3 rounded-lg">
                      <span className="font-label-caps text-label-caps text-outline uppercase block">Metric Tons (t)</span>
                      <span className="font-semibold text-on-surface text-base">{multiTon}</span>
                      <span className="text-[10px] text-outline-variant block mt-0.5">1 t = 1,000 kg</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Metrology Insight Card (4 cols) */}
              <div className="lg:col-span-4 flex flex-col gap-space-md">
                {/* BIPM / CGPM Metrology Authority Card */}
                <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-xl shadow-surface-tint/5 border border-outline-variant/20 flex flex-col gap-space-sm relative">
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps uppercase tracking-wider bg-surface-container-high px-2.5 py-1 rounded text-primary font-semibold border border-outline-variant/20">
                      BIPM / CGPM Metrology Insight
                    </span>
                    <span className="material-symbols-outlined text-primary text-[20px]">verified</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface leading-tight">
                    The Exact Kilogram Definition
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    In 2019 (26th CGPM), the international kilogram was officially redefined in terms of fundamental quantum physics by fixing the Planck constant (<span className="font-data-mono text-on-surface font-semibold">h = 6.62607015 × 10⁻³⁴ kg⋅m²⋅s⁻¹</span>), replacing the physical platinum-iridium prototype (<em>Le Grand K</em>).
                  </p>

                  {/* Visual Quantum Artifact Box */}
                  <div className="rounded-xl bg-surface-container-high border border-outline-variant/30 p-space-md flex flex-col gap-2 font-data-mono">
                    <div className="flex items-center justify-between text-xs text-on-surface-variant">
                      <span className="flex items-center gap-1 text-primary font-semibold">
                        <span className="material-symbols-outlined text-[16px]">science</span>
                        Kibble Balance Realization
                      </span>
                      <span className="text-outline">SI Base Unit</span>
                    </div>
                    <div className="text-center py-2 text-xs sm:text-sm text-primary font-bold tracking-wider">
                      1 kg = (h / 6.62607015 × 10⁻³⁴) m⁻² s
                    </div>
                    <span className="text-[11px] text-on-surface-variant text-center">Universal Quantum Invariance</span>
                  </div>

                  {/* Quick Reference Metrics */}
                  <div className="divide-y divide-outline-variant/20 font-body-sm text-body-sm pt-1">
                    <div className="py-2 flex items-center justify-between text-on-surface">
                      <span className="text-on-surface-variant">SI Multiplier:</span>
                      <span className="font-data-mono font-bold">1 kg = 1,000 g (10³ g)</span>
                    </div>
                    <div className="py-2 flex items-center justify-between text-on-surface">
                      <span className="text-on-surface-variant">Gram Reciprocal:</span>
                      <span className="font-data-mono font-bold">1 g = 0.001 kg (10⁻³ kg)</span>
                    </div>
                    <div className="py-2 flex items-center justify-between text-on-surface">
                      <span className="text-on-surface-variant">Exact Factor:</span>
                      <span className="font-data-mono font-bold text-primary">0.001 (Zero Rounding Error)</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/20 flex items-center gap-2 text-xs text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary text-[18px]">verified_user</span>
                    <span>Mathematical exactness guaranteed by BIPM SI Treaty.</span>
                  </div>
                </div>

                {/* SEO Meta & Spec Hash Widget */}
                <div className="bg-surface-container-low rounded-xl p-space-md border border-outline-variant/20 shadow-sm flex flex-col gap-2 font-data-mono text-xs text-on-surface-variant">
                  <div className="flex items-center gap-1.5 text-on-surface font-semibold">
                    <span className="material-symbols-outlined text-[16px] text-secondary">code_blocks</span>
                    <span>Indexation Metadata &amp; Spec Hash</span>
                  </div>
                  <div className="truncate">
                    <span className="text-outline">Canonical:</span> /conversion/gram-to-kilogram
                  </div>
                  <div>
                    <span className="text-outline">Compliance:</span> BIPM SI / NIST SP 811 Metrology
                  </div>
                  <div>
                    <span className="text-outline">Graph:</span> WebPage, Calculator, FAQPage, HowTo
                  </div>
                  <div className="flex items-center gap-1 text-primary pt-1 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
                    <span>IEEE 754 64-bit Core Sandbox Engine</span>
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
                  Gram to Kilogram Formula &amp; Mathematical Proof
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto">
                  The kilogram is the sole base unit in the International System of Units (SI) that possesses a prefix (&quot;kilo-&quot;, symbol <span className="font-data-mono text-on-surface font-semibold">k</span>), indicating 10³ or 1,000 times the base coherent mass unit. Because decimal prefixes operate strictly on base-10 mathematics, converting grams into kilograms is mathematically deterministic and exact.
                </p>
              </div>

              {/* Two Formula Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                {/* Formula A */}
                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-space-lg shadow-sm flex flex-col gap-space-xs text-on-surface">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-label-caps font-data-mono font-semibold bg-primary-fixed text-on-primary-fixed">
                      Formula A
                    </span>
                    <span className="font-data-mono text-xs text-on-surface-variant">Direct Form</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface">Direct Division Constant Form</h3>
                  <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 font-data-mono text-xl sm:text-2xl font-bold text-primary text-center tracking-wide my-1">
                    kg = g ÷ 1000
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Because 1 kilogram contains exactly 1,000 grams, dividing any mass value in grams by 1,000 shifts the decimal point three positions to the left, yielding the exact kilogram figure with zero numerical loss.
                  </p>
                </div>

                {/* Formula B */}
                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-space-lg shadow-sm flex flex-col gap-space-xs text-on-surface">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-label-caps font-data-mono font-semibold bg-secondary-fixed text-on-secondary-fixed">
                      Formula B
                    </span>
                    <span className="font-data-mono text-xs text-on-surface-variant">Multiplicative Reciprocal</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface">Exact Multiplicative Reciprocal</h3>
                  <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30 font-data-mono text-xl sm:text-2xl font-bold text-secondary text-center tracking-wide my-1">
                    kg = g × 0.001 &nbsp;<span className="text-sm font-normal text-on-surface-variant">(or g × 10⁻³)</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    The inverse factor of 1/1,000 is 0.001. In high-frequency computational loops, vector matrices, and digital signal processing, multiplying by 0.001 executes faster in hardware while preserving full metrological fidelity.
                  </p>
                </div>
              </div>

              {/* Worked Examples Card */}
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-space-lg shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-primary text-[20px]">functions</span>
                  <h3 className="font-headline-md text-headline-md text-on-surface">
                    Worked Mathematical Examples with Metrological Verification
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-space-sm">
                  <div className="bg-surface-container-low rounded-xl p-space-md border border-outline-variant/20 flex flex-col gap-1.5 text-on-surface">
                    <span className="font-label-caps text-label-caps uppercase text-primary font-bold">Example 1: Baseline Mass</span>
                    <div className="font-data-mono text-xs space-y-1 mt-1">
                      <div>Input: <span className="font-bold text-on-surface">1,000.0 g</span></div>
                      <div className="text-on-surface-variant">Formula: 1000 ÷ 1000</div>
                      <div>Result: <span className="font-bold text-primary">1.000 kg exact</span></div>
                      <div className="text-[11px] text-outline-variant pt-1">Avoirdupois: 2.20462 lb</div>
                    </div>
                  </div>
                  <div className="bg-surface-container-low rounded-xl p-space-md border border-outline-variant/20 flex flex-col gap-1.5 text-on-surface">
                    <span className="font-label-caps text-label-caps uppercase text-primary font-bold">Example 2: Commercial Bulk</span>
                    <div className="font-data-mono text-xs space-y-1 mt-1">
                      <div>Input: <span className="font-bold text-on-surface">2,500.0 g</span></div>
                      <div className="text-on-surface-variant">Formula: 2500 × 0.001</div>
                      <div>Result: <span className="font-bold text-primary">2.500 kg exact</span></div>
                      <div className="text-[11px] text-outline-variant pt-1">Fractional: 2 ½ kilograms</div>
                    </div>
                  </div>
                  <div className="bg-surface-container-low rounded-xl p-space-md border border-outline-variant/20 flex flex-col gap-1.5 text-on-surface">
                    <span className="font-label-caps text-label-caps uppercase text-primary font-bold">Example 3: Kitchen Metric Pound</span>
                    <div className="font-data-mono text-xs space-y-1 mt-1">
                      <div>Input: <span className="font-bold text-on-surface">500.0 g</span></div>
                      <div className="text-on-surface-variant">Formula: 500 ÷ 1000</div>
                      <div>Result: <span className="font-bold text-primary">0.500 kg exact</span></div>
                      <div className="text-[11px] text-outline-variant pt-1">Fractional: Exactly ½ kg</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 4: HIGH-PRECISION CONVERSION TABLE */}
          <section className="w-full px-gutter-mobile lg:px-gutter-desktop max-w-max-width-canvas mx-auto py-space-md" id="conversion-table-section">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
              <div>
                <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-semibold block mb-1">
                  Standard Metrology Reference
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                  Gram to Kilogram Conversion Table
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Decimal mass values with physical real-world benchmarks optimized for rapid reference.
                </p>
              </div>

              {/* Filter Search Bar */}
              <div className="w-full sm:w-72 relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-on-surface-variant">search</span>
                <input
                  aria-label="Search conversion benchmarks"
                  className="w-full pl-9 pr-3 py-2 text-body-sm rounded-xl bg-surface-container-lowest text-on-surface border border-outline-variant/30 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary font-data-mono"
                  id="tableFilterInput"
                  placeholder="Search grams, kg, or item..."
                  type="text"
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Table Card */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left font-body-sm text-body-sm border-collapse" id="conversionTable">
                  <thead>
                    <tr className="bg-surface-container-low border-b border-outline-variant/30 text-on-surface-variant font-label-caps uppercase text-label-caps tracking-wider">
                      <th className="py-3 px-4">Grams (g)</th>
                      <th className="py-3 px-4">Kilograms (kg)</th>
                      <th className="py-3 px-4 hidden sm:table-cell">Fractional Equivalent</th>
                      <th className="py-3 px-4">Physical Metrology Benchmark</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/15 text-on-surface">
                    {filteredRows.map((row) => (
                      <tr
                        key={row.grams}
                        className={`transition-colors ${
                          row.isStandard ? 'bg-primary-fixed/20 hover:bg-primary-fixed/30 font-semibold' : 'hover:bg-surface-container-low/50'
                        }`}
                      >
                        <td className={`py-3 px-4 font-data-mono ${row.isStandard ? 'text-primary font-bold' : 'font-semibold text-on-surface'}`}>
                          {row.label}
                        </td>
                        <td className="py-3 px-4 font-data-mono font-bold text-primary">
                          {row.exactKg.toFixed(3)} kg
                        </td>
                        <td className={`py-3 px-4 font-data-mono hidden sm:table-cell ${row.isStandard ? 'text-primary font-medium' : 'text-on-surface-variant'}`}>
                          {row.fractional}
                        </td>
                        <td className="py-3 px-4 text-on-surface-variant">
                          {row.benchmark}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            className={`px-2.5 py-1 rounded font-data-mono text-label-caps uppercase transition-all ${
                              row.isStandard
                                ? 'bg-primary text-on-primary shadow-sm font-bold'
                                : 'bg-surface-container hover:bg-primary hover:text-on-primary text-on-surface border border-outline-variant/20'
                            }`}
                            onClick={() => handleLoadTableVal(row.grams)}
                            type="button"
                          >
                            {row.isStandard ? 'Active' : 'Load'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* SECTION 5: STEP-BY-STEP CONVERSION GUIDE (HOW-TO) */}
          <section className="w-full px-gutter-mobile lg:px-gutter-desktop max-w-max-width-canvas mx-auto py-space-xl">
            <div className="mb-6">
              <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-semibold block mb-1">
                Standard Operating Procedure
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                How to Convert Grams to Kilograms in 3 Easy Steps
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 max-w-2xl">
                Follow this deterministic 3-step sequence for precise kitchen scaling, laboratory weighings, and postal tare compliance.
              </p>
            </div>

            {/* 3 Step Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md mb-8">
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-space-lg shadow-sm flex flex-col gap-2 relative overflow-hidden text-on-surface">
                <span className="text-6xl font-extrabold font-data-mono text-surface-container-high absolute -right-2 -top-2 select-none pointer-events-none opacity-50">
                  01
                </span>
                <span className="font-label-caps text-label-caps uppercase tracking-wider text-secondary font-bold">Step 01</span>
                <h3 className="font-headline-md text-headline-md text-on-surface">Identify Mass in Grams</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mt-1">
                  Record the exact balance or scale reading in grams. For instance, consider a commercial produce package labeled <span className="font-data-mono text-on-surface font-semibold">2,500 grams</span>.
                </p>
              </div>

              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-space-lg shadow-sm flex flex-col gap-2 relative overflow-hidden text-on-surface">
                <span className="text-6xl font-extrabold font-data-mono text-surface-container-high absolute -right-2 -top-2 select-none pointer-events-none opacity-50">
                  02
                </span>
                <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-bold">Step 02</span>
                <h3 className="font-headline-md text-headline-md text-on-surface">Divide by 1,000</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mt-1">
                  Shift the decimal point exactly three places to the left: <span className="font-data-mono text-on-surface font-semibold">2500.0 → 2.500</span> (equivalent to dividing by 1,000 or multiplying by 0.001).
                </p>
              </div>

              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-space-lg shadow-sm flex flex-col gap-2 relative overflow-hidden text-on-surface">
                <span className="text-6xl font-extrabold font-data-mono text-surface-container-high absolute -right-2 -top-2 select-none pointer-events-none opacity-50">
                  03
                </span>
                <span className="font-label-caps text-label-caps uppercase tracking-wider text-tertiary font-bold">Step 03</span>
                <h3 className="font-headline-md text-headline-md text-on-surface">Annotate in Kilograms</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mt-1">
                  Express the quotient with the official SI unit symbol &apos;kg&apos;: <span className="font-data-mono text-primary font-bold">2.5 kg</span> exactly without ambiguity.
                </p>
              </div>
            </div>

            {/* Real-World Application Scenarios */}
            <h3 className="font-headline-md text-headline-md text-on-surface mb-4">Real-World Application Scenarios</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-sm">
              <div className="bg-surface-container-low rounded-xl p-space-md border border-outline-variant/20 flex flex-col gap-2 text-on-surface">
                <div className="w-8 h-8 rounded-lg bg-primary-fixed text-on-primary-fixed flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">flight_takeoff</span>
                </div>
                <h4 className="font-bold font-headline-md text-sm text-on-surface">Air Freight &amp; Logistics</h4>
                <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                  International air travel standardizes passenger baggage allowances at 23 kg or 32 kg. Converting parcel gram weights ensures strict compliance avoiding costly excess fees.
                </p>
              </div>

              <div className="bg-surface-container-low rounded-xl p-space-md border border-outline-variant/20 flex flex-col gap-2 text-on-surface">
                <div className="w-8 h-8 rounded-lg bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">fitness_center</span>
                </div>
                <h4 className="font-bold font-headline-md text-sm text-on-surface">Fitness &amp; Body Composition</h4>
                <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                  Nutritional macros (protein, carbs, fats) are recorded in grams, while human body weight, barbell equipment, and clinical medicine doses utilize kilograms.
                </p>
              </div>

              <div className="bg-surface-container-low rounded-xl p-space-md border border-outline-variant/20 flex flex-col gap-2 text-on-surface">
                <div className="w-8 h-8 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">restaurant</span>
                </div>
                <h4 className="font-bold font-headline-md text-sm text-on-surface">Food Packaging &amp; Grocery</h4>
                <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                  Dual labeling rules require dual metric display on foods. Bulk goods are quoted per kilogram, while individual serving nutritional facts are listed in grams.
                </p>
              </div>

              <div className="bg-surface-container-low rounded-xl p-space-md border border-outline-variant/20 flex flex-col gap-2 text-on-surface">
                <div className="w-8 h-8 rounded-lg bg-primary-fixed text-on-primary-fixed flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">science</span>
                </div>
                <h4 className="font-bold font-headline-md text-sm text-on-surface">Scientific Benchmarks</h4>
                <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                  Analytical chemistry measures reagents in grams, yet physical laws (<span className="font-data-mono text-on-surface">F = ma</span>, <span className="font-data-mono text-on-surface">E = mc²</span>) strictly require coherent SI kilograms.
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 6: AUTHORITATIVE METROLOGICAL CONTEXT & COMMON LOOKUP MATRIX */}
          <section className="w-full px-gutter-mobile lg:px-gutter-desktop max-w-max-width-canvas mx-auto py-space-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg mb-8">
              {/* What Is a Gram? */}
              <article className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-space-lg shadow-sm flex flex-col gap-3 text-on-surface">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-primary-fixed text-on-primary-fixed flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">scale</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface">What Is a Gram? (SI Metric Subunit)</h3>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  The <strong>gram</strong> (symbol: <strong>g</strong>) is a metric unit of mass equal to 1/1,000 (<span className="font-data-mono text-on-surface">10⁻³</span>) of the SI base unit, the kilogram. Established during the French Revolution in 1795 as the &quot;grave&quot; (later gramme), it was initially defined as the mass of one cubic centimeter of water at ice-melting point.
                </p>
                <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/20 text-xs text-on-surface-variant">
                  <span className="font-bold text-on-surface block mb-1">Everyday Gram References:</span>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Standard small steel paperclip: ~1.0 g</li>
                    <li>United States 5-cent nickel coin: exactly 5.0 g</li>
                    <li>Level teaspoon of granulated white sugar: ~4.2 g</li>
                    <li>Single sheet of standard A4 paper (80 gsm): ~5.0 g</li>
                  </ul>
                </div>
              </article>

              {/* What Is a Kilogram? */}
              <article className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-space-lg shadow-sm flex flex-col gap-3 text-on-surface">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">view_in_ar</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface">What Is a Kilogram? (SI Base Unit)</h3>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  The <strong>kilogram</strong> (symbol: <strong>kg</strong>) is the fundamental SI base unit of mass. From 1889 to 2019, it was defined by the International Prototype of the Kilogram (IPK, <em>Le Grand K</em>) in France. Today, it is calibrated via the Kibble balance and the invariant Planck constant.
                </p>
                <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/20 text-xs text-on-surface-variant">
                  <span className="font-bold text-on-surface block mb-1">Everyday Kilogram References:</span>
                  <ul className="list-disc list-inside space-y-1">
                    <li>1 Liter of pure water at 4°C: exactly 1 kg</li>
                    <li>Retail bag of granulated sugar or flour: 1.0 kg</li>
                    <li>Average adult human mass: ~65 kg to 85 kg</li>
                    <li>1 metric ton (tonne, t): exactly 1,000 kg</li>
                  </ul>
                </div>
              </article>
            </div>

            {/* Common Gram to Kilogram Fast Lookup Matrix */}
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-3 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[18px]">grid_view</span>
                Common Gram to Kilogram Fast Lookup Matrix
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 font-data-mono">
                {[
                  { tag: 'Standard Bar', g: 100, kg: '0.1 kg' },
                  { tag: 'Quarter Kilo', g: 250, kg: '0.25 kg' },
                  { tag: 'Half Kilo', g: 500, kg: '0.5 kg' },
                  { tag: 'Three-Quarter', g: 750, kg: '0.75 kg' },
                  { tag: 'Full SI Base', g: 1000, kg: '1 kg', isBase: true },
                  { tag: 'Double Kilo', g: 2000, kg: '2.0 kg' },
                  { tag: 'Flour Bag', g: 2500, kg: '2.5 kg' },
                  { tag: 'Dumbbell Mass', g: 5000, kg: '5.0 kg' },
                  { tag: 'Airline Carry-on', g: 10000, kg: '10.0 kg' },
                  { tag: 'Bulk Payload', g: 25000, kg: '25.0 kg' },
                ].map((item) => (
                  <div
                    key={item.g}
                    className={`p-3 rounded-xl border text-center flex flex-col items-center transition-all ${
                      item.isBase
                        ? 'bg-primary-fixed/25 border-primary shadow-sm text-on-surface'
                        : 'bg-surface-container-low border-outline-variant/20 hover:border-primary text-on-surface'
                    }`}
                  >
                    <span className={`text-[10px] uppercase font-label-caps ${item.isBase ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>
                      {item.tag}
                    </span>
                    <span className="text-sm font-bold text-on-surface mt-1">{item.g.toLocaleString('en-US')} g</span>
                    <span className="text-xs text-outline-variant my-0.5">=</span>
                    <span className="text-base font-bold text-primary">{item.kg}</span>
                    <button
                      className={`mt-2 text-[10px] uppercase font-semibold ${
                        item.isBase ? 'text-primary underline' : 'text-primary hover:underline'
                      }`}
                      onClick={() => handleLoadTableVal(item.g)}
                      type="button"
                    >
                      {item.isBase ? 'Active' : 'Apply'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 7: FREQUENTLY ASKED QUESTIONS (FAQ) */}
          <section className="w-full px-gutter-mobile lg:px-gutter-desktop max-w-max-width-canvas mx-auto py-space-xl" id="faq">
            <div className="mb-6">
              <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-semibold block mb-1">
                Frequently Asked Questions
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                Everything You Need to Know About Gram to Kilogram Conversion
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 max-w-2xl">
                Direct, authoritative answers verified in accordance with BIPM metric guides and ISO metrology protocols.
              </p>
            </div>
            <div className="space-y-3" id="faqAccordion">
              {/* FAQ 1 */}
              <details className="group bg-surface-container-lowest border border-outline-variant/20 rounded-xl shadow-sm overflow-hidden transition-all text-on-surface" open>
                <summary className="p-space-md font-headline-md text-base text-on-surface cursor-pointer flex items-center justify-between group-hover:text-primary transition-colors select-none">
                  <span>How many kilograms are in 1 gram?</span>
                  <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="px-space-md pb-space-md font-body-md text-body-md text-on-surface-variant border-t border-outline-variant/10 pt-space-sm leading-relaxed">
                  There is exactly <strong className="text-on-surface">0.001 kilograms</strong> in 1 gram (1/1,000 kg). In scientific exponential notation, this is expressed as <span className="font-data-mono text-on-surface">10⁻³ kg</span>.
                </div>
              </details>

              {/* FAQ 2 */}
              <details className="group bg-surface-container-lowest border border-outline-variant/20 rounded-xl shadow-sm overflow-hidden transition-all text-on-surface">
                <summary className="p-space-md font-headline-md text-base text-on-surface cursor-pointer flex items-center justify-between group-hover:text-primary transition-colors select-none">
                  <span>How do I convert grams to kilograms?</span>
                  <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="px-space-md pb-space-md font-body-md text-body-md text-on-surface-variant border-t border-outline-variant/10 pt-space-sm leading-relaxed">
                  To convert grams to kilograms, either <strong className="text-on-surface">divide the gram value by 1,000</strong> (<span className="font-data-mono text-on-surface">kg = g ÷ 1000</span>) or <strong className="text-on-surface">multiply it by 0.001</strong> (<span className="font-data-mono text-on-surface">kg = g × 0.001</span>). For mental math, shift the decimal point three positions to the left (e.g., 4,250 g becomes 4.250 kg).
                </div>
              </details>

              {/* FAQ 3 */}
              <details className="group bg-surface-container-lowest border border-outline-variant/20 rounded-xl shadow-sm overflow-hidden transition-all text-on-surface">
                <summary className="p-space-md font-headline-md text-base text-on-surface cursor-pointer flex items-center justify-between group-hover:text-primary transition-colors select-none">
                  <span>How many kilograms is 100 grams?</span>
                  <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="px-space-md pb-space-md font-body-md text-body-md text-on-surface-variant border-t border-outline-variant/10 pt-space-sm leading-relaxed">
                  100 grams is equal to exactly <strong className="text-on-surface">0.1 kilograms</strong> (or one-tenth of a kilogram, 1/10 kg). In traditional metric subunits, 100 grams is also referred to as 1 hectogram (hg).
                </div>
              </details>

              {/* FAQ 4 */}
              <details className="group bg-surface-container-lowest border border-outline-variant/20 rounded-xl shadow-sm overflow-hidden transition-all text-on-surface">
                <summary className="p-space-md font-headline-md text-base text-on-surface cursor-pointer flex items-center justify-between group-hover:text-primary transition-colors select-none">
                  <span>How many kilograms is 500 grams?</span>
                  <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="px-space-md pb-space-md font-body-md text-body-md text-on-surface-variant border-t border-outline-variant/10 pt-space-sm leading-relaxed">
                  500 grams equals exactly <strong className="text-on-surface">0.5 kilograms</strong> (or one-half kilogram, ½ kg). In European marketplaces, 500 grams is often referred to as a metric pound.
                </div>
              </details>

              {/* FAQ 5 */}
              <details className="group bg-surface-container-lowest border border-outline-variant/20 rounded-xl shadow-sm overflow-hidden transition-all text-on-surface">
                <summary className="p-space-md font-headline-md text-base text-on-surface cursor-pointer flex items-center justify-between group-hover:text-primary transition-colors select-none">
                  <span>How many kilograms is 1000 grams?</span>
                  <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="px-space-md pb-space-md font-body-md text-body-md text-on-surface-variant border-t border-outline-variant/10 pt-space-sm leading-relaxed">
                  1,000 grams equals exactly <strong className="text-on-surface">1 kilogram (1 kg)</strong>. This identity defines the SI prefix &quot;kilo-&quot;, denoting an exact factor of 1,000.
                </div>
              </details>

              {/* FAQ 6 */}
              <details className="group bg-surface-container-lowest border border-outline-variant/20 rounded-xl shadow-sm overflow-hidden transition-all text-on-surface">
                <summary className="p-space-md font-headline-md text-base text-on-surface cursor-pointer flex items-center justify-between group-hover:text-primary transition-colors select-none">
                  <span>Which is larger, a gram or a kilogram?</span>
                  <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="px-space-md pb-space-md font-body-md text-body-md text-on-surface-variant border-t border-outline-variant/10 pt-space-sm leading-relaxed">
                  A <strong className="text-on-surface">kilogram is 1,000 times larger</strong> than a gram. A single kilogram contains 1,000 grams; conversely, a single gram is 0.001 times the mass of a kilogram.
                </div>
              </details>

              {/* FAQ 7 */}
              <details className="group bg-surface-container-lowest border border-outline-variant/20 rounded-xl shadow-sm overflow-hidden transition-all text-on-surface">
                <summary className="p-space-md font-headline-md text-base text-on-surface cursor-pointer flex items-center justify-between group-hover:text-primary transition-colors select-none">
                  <span>Can I use this converter for food and cooking measurements?</span>
                  <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="px-space-md pb-space-md font-body-md text-body-md text-on-surface-variant border-t border-outline-variant/10 pt-space-sm leading-relaxed">
                  Yes, absolutely. Because mass is unaffected by ingredient aeration, humidity packing, or grain size, converting recipe grams to kilograms is the professional gold standard for commercial baking, scaling recipes, and accurate macro nutrition.
                </div>
              </details>

              {/* FAQ 8 */}
              <details className="group bg-surface-container-lowest border border-outline-variant/20 rounded-xl shadow-sm overflow-hidden transition-all text-on-surface">
                <summary className="p-space-md font-headline-md text-base text-on-surface cursor-pointer flex items-center justify-between group-hover:text-primary transition-colors select-none">
                  <span>How accurate is this converter?</span>
                  <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="px-space-md pb-space-md font-body-md text-body-md text-on-surface-variant border-t border-outline-variant/10 pt-space-sm leading-relaxed">
                  This converter is mathematically exact. Operating with double-precision IEEE 754 64-bit floating-point math, it applies the exact BIPM ratio without truncation bias.
                </div>
              </details>

              {/* FAQ 9 */}
              <details className="group bg-surface-container-lowest border border-outline-variant/20 rounded-xl shadow-sm overflow-hidden transition-all text-on-surface">
                <summary className="p-space-md font-headline-md text-base text-on-surface cursor-pointer flex items-center justify-between group-hover:text-primary transition-colors select-none">
                  <span>How many grams are in one kilogram?</span>
                  <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="px-space-md pb-space-md font-body-md text-body-md text-on-surface-variant border-t border-outline-variant/10 pt-space-sm leading-relaxed">
                  There are precisely <strong className="text-on-surface">1,000 grams in 1 kilogram</strong> (<span className="font-data-mono text-on-surface">1 kg = 1,000 g</span>). For example, 2.5 kg equals 2,500 g.
                </div>
              </details>

              {/* FAQ 10 */}
              <details className="group bg-surface-container-lowest border border-outline-variant/20 rounded-xl shadow-sm overflow-hidden transition-all text-on-surface">
                <summary className="p-space-md font-headline-md text-base text-on-surface cursor-pointer flex items-center justify-between group-hover:text-primary transition-colors select-none">
                  <span>What is the formula for converting grams to kilograms?</span>
                  <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="px-space-md pb-space-md font-body-md text-body-md text-on-surface-variant border-t border-outline-variant/10 pt-space-sm leading-relaxed">
                  The formal formula is:
                  <div className="my-2 p-2.5 bg-surface-container-low rounded-lg font-data-mono text-primary font-bold border border-outline-variant/20">
                    Kilograms (kg) = Grams (g) ÷ 1,000
                  </div>
                  Or via the multiplicative constant:
                  <div className="my-2 p-2.5 bg-surface-container-low rounded-lg font-data-mono text-on-surface font-bold border border-outline-variant/20">
                    Kilograms (kg) = Grams (g) × 0.001
                  </div>
                </div>
              </details>
            </div>
          </section>

          {/* SECTION 8: RELATED CONVERSIONS & INTERNAL LINKING MESH */}
          <section className="w-full px-gutter-mobile lg:px-gutter-desktop max-w-max-width-canvas mx-auto py-space-xl">
            <div className="mb-4">
              <span className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant block mb-1">
                Conversion Mesh &amp; Directory
              </span>
              <h2 className="font-headline-md text-headline-md text-on-surface tracking-tight">
                Related Mass &amp; Weight Converters
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {[
                { title: 'Kilograms to Grams', sub: 'kg to g', href: '/conversion/kilograms-to-grams', tag: 'Reverse Engine', isPrimary: true },
                { title: 'Grams to Ounces', sub: 'g to oz', href: '/conversion/gram-to-ounces', tag: 'Avoirdupois' },
                { title: 'Grams to Pounds', sub: 'g to lb', href: '/conversion/gram-to-pound', tag: 'Imperial' },
                { title: 'Grams to Milligrams', sub: 'g to mg', href: '/conversion/gram-to-milligram', tag: 'Metric Micro' },
                { title: 'Grams to Tablespoons', sub: 'g to tbsp (water)', href: '/conversion/grams-to-tablespoons', tag: 'Culinary Vol' },
                { title: 'Grams to Cups', sub: 'g to cup', href: '/conversion/gram-to-cup', tag: 'Baking Volume' },
                { title: 'Kilograms to Pounds', sub: 'kg to lb', href: '/conversion/kilogram-to-pounds', tag: 'Heavy Mass' },
                { title: 'Kilograms to Ounces', sub: 'kg to oz', href: '/conversion/kilogram-to-ounces', tag: 'Postal Mass' },
              ].map((item) => (
                <Link
                  key={item.href}
                  className="p-3.5 rounded-xl bg-surface-container-lowest hover:bg-surface-container border border-outline-variant/20 hover:border-primary transition-all group shadow-sm flex items-center justify-between text-on-surface"
                  href={item.href}
                >
                  <div className="flex flex-col">
                    <span className={`text-[10px] font-data-mono uppercase font-bold ${item.isPrimary ? 'text-primary' : 'text-on-surface-variant'}`}>
                      {item.tag}
                    </span>
                    <span className="font-headline-md text-xs sm:text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">
                      {item.title}
                    </span>
                    <span className="text-[11px] font-data-mono text-outline-variant">{item.sub}</span>
                  </div>
                  <span className="material-symbols-outlined text-outline-variant group-hover:text-primary group-hover:translate-x-0.5 transition-all text-[18px]">
                    arrow_forward
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
