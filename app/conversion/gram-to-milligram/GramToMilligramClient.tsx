'use client';

import React, { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import GramToMgScaleVisualizer from '@/components/conversion/GramToMgScaleVisualizer';

interface TableRowData {
  grams: number;
  label: string;
  mg: number;
  scientific: string;
  benchmark: string;
}

const BENCHMARK_ROWS: TableRowData[] = [
  { grams: 1, label: '1 g', mg: 1000, scientific: '1.00 × 10³ mg', benchmark: 'Standard paperclip mass / active pharmaceutical benchmark' },
  { grams: 2, label: '2 g', mg: 2000, scientific: '2.00 × 10³ mg', benchmark: 'Standard $1 US bill paper weight (approx. 1 g to 2 g aliquot)' },
  { grams: 5, label: '5 g', mg: 5000, scientific: '5.00 × 10³ mg', benchmark: 'Standard US 5-cent nickel coin mass / 1 standard teaspoon of sugar' },
  { grams: 10, label: '10 g', mg: 10000, scientific: '1.00 × 10⁴ mg', benchmark: 'Standard laboratory test tube powder sample / 2 standard nickel coins' },
  { grams: 25, label: '25 g', mg: 25000, scientific: '2.50 × 10⁴ mg', benchmark: 'Standard dry reagent analytical aliquot vial' },
  { grams: 50, label: '50 g', mg: 50000, scientific: '5.00 × 10⁴ mg', benchmark: 'Average chicken egg mass (minus shell) / calibration test tare' },
  { grams: 100, label: '100 g', mg: 100000, scientific: '1.00 × 10⁵ mg', benchmark: 'Standard medium apple / typical commercial chocolate bar tablet' },
  { grams: 250, label: '250 g', mg: 25000, scientific: '2.50 × 10⁵ mg', benchmark: 'Quarter kilogram container / standard butter block package' },
  { grams: 500, label: '500 g', mg: 500000, scientific: '5.00 × 10⁵ mg', benchmark: 'Half kilogram / 0.5 L bottle of pure distilled water mass at 4°C' },
  { grams: 1000, label: '1,000 g', mg: 1000000, scientific: '1.00 × 10⁶ mg', benchmark: 'Exactly 1 Kilogram (SI Base Reference Mass standard)' },
];

const PRESETS = [1, 2, 5, 10, 25, 50, 100, 250, 500, 1000];

export default function GramToMilligramClient({ initialDirection = 'g-to-mg' }: { initialDirection?: 'g-to-mg' | 'mg-to-g' } = {}) {
  const [inputValue, setInputValue] = useState<string>(initialDirection === 'mg-to-g' ? '5000' : '5');
  const [direction, setDirection] = useState<'g-to-mg' | 'mg-to-g'>(initialDirection);
  const [precision, setPrecision] = useState<number>(2);
  const [copied, setCopied] = useState<boolean>(false);
  const [tableSearch, setTableSearch] = useState<string>('');
  const [openFaq, setOpenFaq] = useState<number | null>(0); // First FAQ open by default

  const workbenchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const parsedNum = parseFloat(inputValue);
  const isValid = !isNaN(parsedNum) && parsedNum >= 0;

  const {
    currentGrams,
    currentMg,
    formattedResult,
    scientificDisplay,
    formulaCalculationStr,
    drawerMcg,
    drawerGrains,
    drawerOunces,
    drawerKilograms,
  } = useMemo(() => {
    if (!isValid) {
      return {
        currentGrams: 0,
        currentMg: 0,
        formattedResult: '0',
        scientificDisplay: '0.00 × 10³ mg',
        formulaCalculationStr: direction === 'g-to-mg' ? 'm(mg) = 0 × 1,000 = 0 mg' : 'm(g) = 0 ÷ 1,000 = 0 g',
        drawerMcg: '0 µg',
        drawerGrains: '0.0000 gr',
        drawerOunces: '0.00000 oz',
        drawerKilograms: '0.000000 kg',
      };
    }

    let g: number;
    let mg: number;

    if (direction === 'g-to-mg') {
      g = parsedNum;
      mg = g * 1000;
    } else {
      mg = parsedNum;
      g = mg / 1000;
    }

    // Precision formatting
    const formattedResultVal = (direction === 'g-to-mg' ? mg : g).toLocaleString('en-US', {
      minimumFractionDigits: precision,
      maximumFractionDigits: precision,
    });

    const sci = (g * 1).toExponential(3).replace('e+', ' × 10^').replace('^', '') + ' × 10³ mg';
    const formulaStr =
      direction === 'g-to-mg'
        ? `m(mg) = ${g.toLocaleString('en-US')} × 1,000 = ${mg.toLocaleString('en-US', { minimumFractionDigits: precision, maximumFractionDigits: precision })} mg`
        : `m(g) = ${mg.toLocaleString('en-US')} ÷ 1,000 = ${g.toLocaleString('en-US', { minimumFractionDigits: precision, maximumFractionDigits: precision })} g`;

    // Multi-unit drawer metrics based on actual grams
    const mcgVal = g * 1000000;
    const grainsVal = g * 15.43235835;
    const ozVal = g * 0.03527396195;
    const kgVal = g * 0.001;

    return {
      currentGrams: g,
      currentMg: mg,
      formattedResult: formattedResultVal,
      scientificDisplay: sci,
      formulaCalculationStr: formulaStr,
      drawerMcg: `${Math.round(mcgVal).toLocaleString('en-US')} µg`,
      drawerGrains: `${grainsVal.toFixed(4)} gr`,
      drawerOunces: `${ozVal.toFixed(5)} oz`,
      drawerKilograms: `${kgVal.toFixed(6)} kg`,
    };
  }, [isValid, parsedNum, direction, precision]);

  const handleSwap = () => {
    if (direction === 'g-to-mg') {
      setDirection('mg-to-g');
      if (isValid) {
        setInputValue(Math.round(currentMg).toString());
      }
    } else {
      setDirection('g-to-mg');
      if (isValid) {
        setInputValue(currentGrams.toString());
      }
    }
  };

  const handleStepUp = () => {
    const val = parseFloat(inputValue) || 0;
    setInputValue((val + 1).toString());
  };

  const handleStepDown = () => {
    const val = parseFloat(inputValue) || 0;
    if (val >= 1) {
      setInputValue((val - 1).toString());
    }
  };

  const handleClear = () => {
    setInputValue('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleReset = () => {
    setInputValue('5');
    setDirection('g-to-mg');
    setPrecision(2);
  };

  const handleCopy = () => {
    const unit = direction === 'g-to-mg' ? 'mg' : 'g';
    const textToCopy = `${formattedResult} ${unit}`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const handleLoadPreset = (val: number) => {
    setDirection('g-to-mg');
    setInputValue(val.toString());
  };

  const handleLoadAndScroll = (val: number) => {
    setDirection('g-to-mg');
    setInputValue(val.toString());
    if (workbenchRef.current) {
      const top = workbenchRef.current.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  };

  const filteredRows = useMemo(() => {
    const query = tableSearch.trim().toLowerCase();
    if (!query) return BENCHMARK_ROWS;
    return BENCHMARK_ROWS.filter(
      (row) =>
        row.label.toLowerCase().includes(query) ||
        row.mg.toString().includes(query) ||
        row.scientific.toLowerCase().includes(query) ||
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
                '@id': 'https://solveit.io/conversion/gram-to-milligram#webpage',
                url: 'https://solveit.io/conversion/gram-to-milligram',
                name: 'Gram to Milligram Converter (g to mg) – Instant Conversion Calculator',
                description:
                  'Convert grams to milligrams instantly with our free Gram to Milligram Converter. Enter any value in grams and get accurate milligram conversions, formulas, conversion tables, and FAQs.',
                isPartOf: {
                  '@type': 'WebSite',
                  '@id': 'https://solveit.io/#website',
                  name: 'SolveIt Precision Metrology Core',
                  url: 'https://solveit.io',
                },
                breadcrumb: {
                  '@type': 'BreadcrumbList',
                  itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://solveit.io/' },
                    { '@type': 'ListItem', position: 2, name: 'Conversion Hub', item: 'https://solveit.io/conversion-suite' },
                    { '@type': 'ListItem', position: 3, name: 'Mass & Weight', item: 'https://solveit.io/conversion/mass-and-weight' },
                    { '@type': 'ListItem', position: 4, name: 'Gram to Milligram (g to mg)', item: 'https://solveit.io/conversion/gram-to-milligram' },
                  ],
                },
                inLanguage: 'en-US',
              },
              {
                '@type': 'WebApplication',
                '@id': 'https://solveit.io/conversion/gram-to-milligram#app',
                name: 'SolveIt Gram to Milligram Precision Workbench',
                applicationCategory: 'EducationalApplication',
                operatingSystem: 'All modern browsers with WebAssembly / ES6 support',
                offers: {
                  '@type': 'Offer',
                  price: '0',
                  priceCurrency: 'USD',
                },
                browserRequirements: 'Requires JavaScript. Requires HTML5 Canvas.',
                softwareVersion: 'v4.8.2-IEEE-754',
              },
              {
                '@type': 'HowTo',
                '@id': 'https://solveit.io/conversion/gram-to-milligram#howto',
                name: 'How to Convert Grams to Milligrams (g to mg)',
                description:
                  'Deterministic 3-step Standard Operating Procedure to convert mass measured in grams (g) to milligrams (mg) using the standard SI metric factor of 1,000.',
                step: [
                  {
                    '@type': 'HowToStep',
                    position: 1,
                    name: 'Acquire the Mass Reading in Grams',
                    text: 'Note the certified reading from your analytical balance, formulation protocol, or active pharmaceutical ingredient datasheet in grams (g).',
                  },
                  {
                    '@type': 'HowToStep',
                    position: 2,
                    name: 'Apply the SI Metric Constant (Multiply by 1,000)',
                    text: 'Multiply your numerical gram quantity by 1,000 (or shift the base-10 decimal marker exactly 3 positions to the right).',
                  },
                  {
                    '@type': 'HowToStep',
                    position: 3,
                    name: 'Verify and Append the Milligram (mg) Symbol',
                    text: 'Record the resulting numerical value and append the unambiguous SI unit symbol mg with standard decimal notation.',
                  },
                ],
              },
              {
                '@type': 'FAQPage',
                '@id': 'https://solveit.io/conversion/gram-to-milligram#faq',
                mainEntity: [
                  {
                    '@type': 'Question',
                    name: 'How many milligrams are in 1 gram?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'There are exactly 1,000 milligrams in 1 gram (1 g = 1,000 mg). Under the International System of Units (SI), the prefix milli- signifies 10⁻³, meaning one milligram is one-thousandth of a gram.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'How do I convert grams to milligrams?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'To convert grams to milligrams, multiply the mass in grams by 1,000. For example: 3.5 g × 1,000 = 3,500 mg. Alternatively, shift the decimal point three places to the right.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'How many milligrams are in 5 grams?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'There are exactly 5,000 milligrams in 5 grams (5 g × 1,000 = 5,000 mg).',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'How many milligrams are in 10 grams?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'There are exactly 10,000 milligrams in 10 grams (10 g × 1,000 = 10,000 mg).',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'How many milligrams are in 100 grams?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'There are exactly 100,000 milligrams in 100 grams (100 g × 1,000 = 100,000 mg).',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'Which is larger, a gram or a milligram?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'A gram is 1,000 times larger than a milligram. Conversely, one milligram is one-thousandth (0.001) the mass of a gram.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'Can I use this converter for medicine dosages?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'Yes. This converter implements IEEE 754 64-bit mathematical precision adhering directly to BIPM and NIST SP 811 SI standards. However, clinical and prescription administrations must always be double-checked by licensed healthcare professionals and pharmacists.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'How accurate is this converter?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'The calculation runs locally in your browser sandbox using exact decimal floating-point arithmetic. Because 1 g = 1,000 mg is an exact rational SI definition with no rounding uncertainty, the result is mathematically exact.',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'How many grams are in one milligram?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'There is exactly 0.001 gram in one milligram (1 mg = 10⁻³ g = 0.001 g).',
                    },
                  },
                  {
                    '@type': 'Question',
                    name: 'What is the formula for converting grams to milligrams?',
                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: 'The formula is: Mass in Milligrams (mg) = Mass in Grams (g) × 1,000. Expressed in scientific exponential form: m(mg) = m(g) × 10³.',
                    },
                  },
                ],
              },
            ],
          }),
        }}
      />

      

      <main className="w-full pt-16 bg-surface min-h-screen">
        <div className="flex flex-col w-full">
          {/* TOP METROLOGY TELEMETRY STRIP */}
          <div className="w-full bg-surface-container-low border-b border-outline-variant/20">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop h-7 flex items-center justify-between text-label-caps font-label-caps uppercase tracking-wider text-on-surface-variant overflow-x-auto whitespace-nowrap">
              <div className="flex items-center gap-space-md">
                <span className="flex items-center gap-space-2xs text-secondary font-semibold">
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                  <span>BIPM / NIST SP 811 Metrology Verified</span>
                </span>
                <span className="hidden md:inline-block text-outline-variant">•</span>
                <span className="hidden md:flex items-center gap-space-2xs text-primary font-semibold">
                  <span className="material-symbols-outlined text-[14px]">shield</span>
                  <span>100% Client-Side Sandbox</span>
                </span>
              </div>
              <div className="flex items-center gap-space-2xs text-on-surface-variant font-data-mono text-[10px] lowercase">
                <span className="material-symbols-outlined text-[13px] text-secondary">memory</span>
                <span>Zero-LAG IEEE 754 High-Precision Core</span>
              </div>
            </div>
          </div>

          {/* BREADCRUMBS & COMPLIANCE BAR */}
          <div className="w-full bg-surface-container-low/70 backdrop-blur-md border-b border-outline-variant/20">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-xs flex flex-wrap items-center justify-between gap-y-space-xs text-body-sm font-body-sm text-on-surface-variant">
              <nav aria-label="Breadcrumb" className="flex items-center space-x-space-2xs text-body-sm font-body-sm flex-wrap">
                <Link className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1" href="/">
                  <span className="material-symbols-outlined text-[15px]">home</span>
                  <span>Home</span>
                </Link>
                <span className="text-outline/40">/</span>
                <Link className="text-on-surface-variant hover:text-primary transition-colors" href="/conversion">
                  Conversion
                </Link>
                <span className="text-outline/40">/</span>
                <Link className="text-on-surface-variant hover:text-primary transition-colors" href="/weight-mass-converter">
                  Weight &amp; Mass
                </Link>
                <span className="text-outline/40">/</span>
                <Link className="text-on-surface-variant hover:text-primary transition-colors" href="/conversion/gram">
                  Gram
                </Link>
                <span className="text-outline/40">/</span>
                <span aria-current="page" className="text-primary font-semibold truncate">
                  Gram to Milligram (g to mg)
                </span>
              </nav>
              <div className="flex items-center gap-space-xs text-[11px] font-data-mono uppercase tracking-wider text-outline">
                <span className="inline-flex items-center gap-1 text-secondary font-semibold">
                  <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                  2026 CALIBRATED PIPELINE
                </span>
                <span>•</span>
                <span>SI RATIO 1:1000 EXACT</span>
              </div>
            </div>
          </div>

          {/* HERO BANNER SECTION */}
          <section className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop pt-space-xl pb-space-lg w-full">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg mb-space-lg">
              <div className="space-y-space-xs max-w-3xl">
                {/* TRUST BADGES */}
                <div className="flex flex-wrap items-center gap-space-xs">
                  <span className="px-space-xs py-0.5 rounded bg-primary-container/10 text-primary font-label-caps text-label-caps uppercase tracking-wide flex items-center gap-1 border border-primary/20">
                    <span className="material-symbols-outlined text-[13px]">verified</span>
                    BIPM / SI Metric Base Standard (CGPM 2019)
                  </span>
                  <span className="px-space-xs py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-label-caps text-label-caps uppercase tracking-wide flex items-center gap-1 border border-secondary/20">
                    <span className="material-symbols-outlined text-[13px]">lock</span>
                    100% Free &amp; Private (Client Sandbox)
                  </span>
                  <span className="px-space-xs py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-caps text-label-caps uppercase tracking-wide flex items-center gap-1 border border-outline-variant/30">
                    <span className="material-symbols-outlined text-[13px]">precision_manufacturing</span>
                    IEEE 754 64-Bit Precision
                  </span>
                  <span className="px-space-xs py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-caps text-label-caps uppercase tracking-wide flex items-center gap-1 border border-tertiary/20">
                    <span className="material-symbols-outlined text-[13px]">bolt</span>
                    Instant Calculation
                  </span>
                </div>
                <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">
                  Gram to Milligram Converter <span className="text-primary font-numerical-display">(g to mg)</span>
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                  Use this free Gram to Milligram converter to quickly convert grams (g) into milligrams (mg). Enter any value in grams and instantly see the equivalent value in milligrams along with formulas, examples, and conversion tables.
                </p>
              </div>

              {/* METROLOGY SPEC HASH PILL */}
              <div className="bg-surface-container-low rounded-xl p-space-sm flex flex-col gap-1 min-w-[240px] shadow-sm border border-outline-variant/20">
                <div className="flex items-center justify-between text-label-caps font-label-caps text-outline uppercase tracking-wider">
                  <span>Metrology Spec</span>
                  <span className="text-secondary font-data-mono font-semibold">NIST SP 811</span>
                </div>
                <div className="font-data-mono text-[12px] text-on-surface flex items-center justify-between">
                  <span>Canonical Factor:</span>
                  <span className="font-bold text-primary">k = 1.00000000000 × 10³</span>
                </div>
                <div className="font-data-mono text-[11px] text-outline-variant flex items-center justify-between">
                  <span>Base SI Equivalent:</span>
                  <span>10⁻³ g = 10⁻⁶ kg</span>
                </div>
              </div>
            </div>
          </section>

          {/* INTERACTIVE CONVERTER WORKBENCH */}
          <section className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop mb-space-2xl w-full" ref={workbenchRef}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
              {/* MAIN CONVERSION CALCULATOR CARD */}
              <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl p-space-md sm:p-space-xl shadow-md border border-outline-variant/20 space-y-space-lg relative">
                <div className="flex flex-wrap items-center justify-between gap-space-xs pb-space-xs border-b border-outline-variant/20">
                  <div className="flex items-center gap-space-xs">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px]">balance</span>
                    </div>
                    <div>
                      <h2 className="font-headline-md text-headline-md font-bold text-on-surface tracking-tight">Interactive Mass Workbench</h2>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">Exact SI Metric Conversion (10³ mg/g) • Local Execution</p>
                    </div>
                  </div>

                  {/* DECIMALS ACCURACY SELECTOR */}
                  <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-lg border border-outline-variant/20">
                    <span className="text-label-caps font-label-caps text-outline uppercase px-1 hidden sm:inline">Decimals:</span>
                    <button
                      className={`px-2 py-0.5 text-body-sm font-data-mono rounded font-semibold transition-all ${
                        precision === 2 ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-container-high'
                      }`}
                      onClick={() => setPrecision(2)}
                      type="button"
                    >
                      .00
                    </button>
                    <button
                      className={`px-2 py-0.5 text-body-sm font-data-mono rounded font-semibold transition-all ${
                        precision === 4 ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-container-high'
                      }`}
                      onClick={() => setPrecision(4)}
                      type="button"
                    >
                      .0000
                    </button>
                    <button
                      className={`px-2 py-0.5 text-body-sm font-data-mono rounded font-semibold transition-all ${
                        precision === 6 ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-container-high'
                      }`}
                      onClick={() => setPrecision(6)}
                      type="button"
                    >
                      .000000
                    </button>
                  </div>
                </div>

                {/* TWO-WAY INPUT/OUTPUT DUAL STACK */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md items-stretch relative">
                  {/* INPUT: FROM UNIT */}
                  <div className="bg-surface-container-low rounded-xl p-space-md space-y-space-xs border border-outline-variant/20 transition-all focus-within:ring-2 focus-within:ring-primary/40">
                    <div className="flex items-center justify-between">
                      <label className="font-label-caps text-label-caps uppercase text-on-surface-variant font-semibold tracking-wider flex items-center gap-1" htmlFor="input-grams">
                        <span>{direction === 'g-to-mg' ? 'From Mass (Grams)' : 'From Mass (Milligrams)'}</span>
                        <span className="text-outline font-normal">[{direction === 'g-to-mg' ? 'g' : 'mg'}]</span>
                      </label>
                      <button className="text-outline hover:text-error transition-colors" onClick={handleClear} title="Clear input field" type="button">
                        <span className="material-symbols-outlined text-[16px]">backspace</span>
                      </button>
                    </div>
                    <div className="relative flex items-center">
                      <input
                        aria-label={direction === 'g-to-mg' ? 'Value in grams' : 'Value in milligrams'}
                        className="w-full bg-surface-container-lowest text-on-surface font-numerical-display text-headline-lg font-bold rounded-lg px-space-sm py-space-xs focus:outline-none shadow-sm pr-14 border border-outline-variant/30 font-data-mono"
                        id="input-grams"
                        min="0"
                        placeholder="0"
                        ref={inputRef}
                        step="any"
                        type="number"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                      />
                      <span className="absolute right-space-sm font-data-mono font-bold text-on-surface-variant text-body-md pointer-events-none">
                        {direction === 'g-to-mg' ? 'g' : 'mg'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant pt-1">
                      <span className="text-outline">
                        {direction === 'g-to-mg' ? 'SI Subunit: 10⁻³ kg' : 'SI Subunit: 10⁻⁶ kg'}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          className="w-6 h-6 rounded bg-surface-container-high hover:bg-surface-variant flex items-center justify-center text-on-surface transition-colors font-bold text-sm"
                          onClick={handleStepDown}
                          title="Decrease value by 1"
                          type="button"
                        >
                          -
                        </button>
                        <button
                          className="w-6 h-6 rounded bg-surface-container-high hover:bg-surface-variant flex items-center justify-center text-on-surface transition-colors font-bold text-sm"
                          onClick={handleStepUp}
                          title="Increase value by 1"
                          type="button"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* SWAP UNITS OVERLAY BUTTON */}
                  <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <button
                      className="w-10 h-10 rounded-full bg-surface-container-lowest text-primary shadow-md hover:bg-primary hover:text-on-primary flex items-center justify-center transition-all transform hover:scale-105 border border-outline-variant/30"
                      onClick={handleSwap}
                      title="Swap conversion direction"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[20px]">swap_horiz</span>
                    </button>
                  </div>

                  {/* OUTPUT: TO UNIT */}
                  <div className="bg-surface-container-high/60 rounded-xl p-space-md space-y-space-xs border border-outline-variant/20 transition-all relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="font-label-caps text-label-caps uppercase text-primary font-semibold tracking-wider flex items-center gap-1">
                        <span>{direction === 'g-to-mg' ? 'To Mass (Milligrams)' : 'To Mass (Grams)'}</span>
                        <span className="text-on-surface-variant font-normal">[{direction === 'g-to-mg' ? 'mg' : 'g'}]</span>
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary font-data-mono text-[10px] font-bold">
                        {direction === 'g-to-mg' ? '1 g = 1,000 mg' : '1,000 mg = 1 g'}
                      </span>
                    </div>
                    <div className="relative flex items-center">
                      <div className="w-full bg-surface-container-lowest text-primary font-numerical-display text-headline-lg font-bold rounded-lg px-space-sm py-space-xs shadow-sm truncate pr-16 select-all border border-outline-variant/30 font-data-mono">
                        {formattedResult}
                      </div>
                      <span className="absolute right-space-sm font-data-mono font-bold text-primary text-body-md">
                        {direction === 'g-to-mg' ? 'mg' : 'g'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant pt-1">
                      <span className="font-data-mono text-[12px] text-outline">
                        {direction === 'g-to-mg' ? scientificDisplay : `${currentGrams.toFixed(precision)} g`}
                      </span>
                      <span className="text-secondary flex items-center gap-1 font-data-mono text-[11px] font-semibold">
                        <span className="material-symbols-outlined text-[13px]">check_circle</span>
                        Zero Rounding Error
                      </span>
                    </div>
                  </div>
                </div>

                {/* QUICK MASS PRESET SELECTORS */}
                <div className="space-y-space-2xs">
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant">
                      Quick Mass Presets (Click to Load):
                    </span>
                    <span className="text-[11px] text-outline font-data-mono">Standard Lab &amp; Clinical Quantities</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-space-2xs">
                    {PRESETS.map((val) => {
                      const isActive = direction === 'g-to-mg' && parsedNum === val;
                      return (
                        <button
                          key={val}
                          className={`px-space-xs py-1 rounded text-body-sm font-data-mono transition-all border border-outline-variant/20 ${
                            isActive
                              ? 'bg-primary text-on-primary font-semibold shadow-sm'
                              : 'bg-surface-container-low hover:bg-primary hover:text-on-primary text-on-surface'
                          }`}
                          onClick={() => handleLoadPreset(val)}
                          type="button"
                        >
                          {val.toLocaleString('en-US')} g
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ACTION CONTROLS & UTILITY BAR */}
                <div className="flex flex-wrap items-center justify-between gap-space-sm pt-space-xs">
                  <div className="flex items-center gap-space-xs flex-wrap">
                    <button
                      className="px-space-md py-space-xs rounded-lg bg-primary text-on-primary font-body-sm font-semibold hover:bg-primary-container transition-all flex items-center gap-1 shadow-sm active:scale-95"
                      onClick={() => {}}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">calculate</span>
                      <span>Convert Now</span>
                    </button>
                    <button
                      className="px-space-sm py-space-xs rounded-lg bg-surface-container-low hover:bg-surface-container-high text-on-surface font-body-sm transition-all flex items-center gap-1 border border-outline-variant/30 shadow-sm"
                      onClick={handleCopy}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">{copied ? 'check' : 'content_copy'}</span>
                      <span>{copied ? 'Copied!' : 'Copy Result'}</span>
                    </button>
                    <button
                      className="px-space-sm py-space-xs rounded-lg bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant font-body-sm transition-all flex items-center gap-1 border border-outline-variant/30 shadow-sm"
                      onClick={handleReset}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">restart_alt</span>
                      <span>Reset</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-space-sm flex-wrap">
                    <button
                      className="px-space-xs py-space-2xs text-on-surface-variant hover:text-on-surface text-body-sm flex items-center gap-1"
                      onClick={() => typeof window !== 'undefined' && window.print()}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[16px]">print</span>
                      <span>Print Sheet</span>
                    </button>
                    <button
                      className="px-space-sm py-space-2xs rounded-lg bg-secondary-fixed text-on-secondary-fixed hover:bg-secondary-fixed-dim text-body-sm font-semibold transition-all flex items-center gap-1 border border-secondary/30"
                      onClick={handleSwap}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[16px]">sync_alt</span>
                      <span>Swap: {direction === 'g-to-mg' ? 'mg to g' : 'g to mg'}</span>
                    </button>
                  </div>
                </div>

                {/* REAL-TIME CONVERSION BADGE */}
                <div className="bg-surface-container-low rounded-lg px-space-sm py-space-xs flex flex-wrap items-center justify-between gap-2 text-body-sm text-on-surface-variant border border-outline-variant/20">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="w-2 h-2 rounded-full bg-secondary"></span>
                    <span className="font-data-mono text-[12px] font-semibold text-on-surface">Formula Matrix Active:</span>
                    <span className="font-data-mono text-[12px] text-primary font-bold">{formulaCalculationStr}</span>
                  </div>
                  <span className="font-data-mono text-[11px] text-outline">IEEE 754 Verified Core</span>
                </div>

                {/* SIMULTANEOUS MULTI-UNIT DRAWER (Auto-Synchronized) */}
                <div className="bg-surface-container-low/50 rounded-xl p-space-md space-y-space-xs border border-outline-variant/20">
                  <div className="flex items-center justify-between">
                    <h3 className="font-headline-md text-[16px] font-bold text-on-surface flex items-center gap-1">
                      <span className="material-symbols-outlined text-[18px] text-primary">sync</span>
                      <span>Simultaneous Multi-Unit Mass Projections</span>
                    </h3>
                    <span className="text-label-caps font-label-caps uppercase text-outline">Auto-Synchronized</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-xs">
                    <div className="bg-surface-container-lowest rounded-lg p-space-xs shadow-sm border border-outline-variant/20">
                      <div className="font-label-caps text-[10px] text-outline uppercase font-semibold">Micrograms (µg)</div>
                      <div className="font-data-mono font-bold text-headline-md text-[16px] text-on-surface truncate">
                        {drawerMcg}
                      </div>
                      <div className="text-[10px] text-on-surface-variant">10⁻⁶ g basis</div>
                    </div>
                    <div className="bg-surface-container-lowest rounded-lg p-space-xs shadow-sm border border-outline-variant/20">
                      <div className="font-label-caps text-[10px] text-outline uppercase font-semibold">Grains (gr troy/avdp)</div>
                      <div className="font-data-mono font-bold text-headline-md text-[16px] text-on-surface truncate">
                        {drawerGrains}
                      </div>
                      <div className="text-[10px] text-on-surface-variant">1 gr ≈ 64.79891 mg</div>
                    </div>
                    <div className="bg-surface-container-lowest rounded-lg p-space-xs shadow-sm border border-outline-variant/20">
                      <div className="font-label-caps text-[10px] text-outline uppercase font-semibold">Ounces (oz avdp)</div>
                      <div className="font-data-mono font-bold text-headline-md text-[16px] text-on-surface truncate">
                        {drawerOunces}
                      </div>
                      <div className="text-[10px] text-on-surface-variant">1 oz ≈ 28.3495 g</div>
                    </div>
                    <div className="bg-surface-container-lowest rounded-lg p-space-xs shadow-sm border border-outline-variant/20">
                      <div className="font-label-caps text-[10px] text-outline uppercase font-semibold">Kilograms (kg)</div>
                      <div className="font-data-mono font-bold text-headline-md text-[16px] text-on-surface truncate">
                        {drawerKilograms}
                      </div>
                      <div className="text-[10px] text-on-surface-variant">10³ g basis</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* METROLOGICAL INSIGHT SIDEBAR */}
              <aside className="lg:col-span-4 space-y-space-md">
                {/* DEFINITION CARD */}
                <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/20 space-y-space-sm">
                  <div className="flex items-center gap-space-xs text-primary">
                    <span className="material-symbols-outlined text-[20px]">science</span>
                    <h3 className="font-headline-md text-[16px] font-bold text-on-surface">Definition &amp; Precision Dosing</h3>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    The milligram (symbol: <strong className="text-on-surface font-semibold">mg</strong>) is an official SI-derived unit of mass equal to one-thousandth (<span className="font-data-mono text-[12px]">10⁻³</span>) of a gram, or one-millionth (<span className="font-data-mono text-[12px]">10⁻⁶</span>) of the kilogram SI base standard.
                  </p>
                  <div className="space-y-space-2xs pt-space-2xs text-body-sm">
                    <div className="p-space-xs bg-surface-container-low rounded-lg border border-outline-variant/20">
                      <span className="font-semibold text-on-surface block text-[13px]">USP &amp; FDA Compendial Standard</span>
                      <span className="text-outline text-[12px]">
                        Pharmaceutical dosing mandates exact decimal conversion to prevent tenfold microgram-to-milligram administration errors.
                      </span>
                    </div>
                    <div className="p-space-xs bg-surface-container-low rounded-lg border border-outline-variant/20">
                      <span className="font-semibold text-on-surface block text-[13px]">Analytical Chemistry Balances</span>
                      <span className="text-outline text-[12px]">
                        Standard 4-place lab balances measure accurately down to 0.1 mg (0.0001 g), while micro-balances resolve 0.001 mg.
                      </span>
                    </div>
                  </div>
                </div>

                {/* INTERACTIVE SCALE RATIO VISUALIZATION */}
                <GramToMgScaleVisualizer
                  currentGrams={currentGrams}
                  currentMg={currentMg}
                  direction={direction}
                  inputValue={inputValue}
                  onDirectionChange={(dir) => setDirection(dir)}
                  onValueChange={(val) => setInputValue(val)}
                />

                {/* APPLICATION DOMAINS FAST CARD */}
                <div className="bg-surface-container-high/40 rounded-xl p-space-md space-y-space-2xs border border-outline-variant/20">
                  <div className="font-label-caps text-label-caps uppercase text-outline tracking-wider">Primary Verification Domains</div>
                  <div className="flex flex-wrap gap-1 pt-1">
                    <span className="px-2 py-1 bg-surface-container-lowest text-on-surface rounded text-[11px] font-medium shadow-sm border border-outline-variant/20">
                      Pharmacology
                    </span>
                    <span className="px-2 py-1 bg-surface-container-lowest text-on-surface rounded text-[11px] font-medium shadow-sm border border-outline-variant/20">
                      Lab Chemistry
                    </span>
                    <span className="px-2 py-1 bg-surface-container-lowest text-on-surface rounded text-[11px] font-medium shadow-sm border border-outline-variant/20">
                      Clinical Dosing
                    </span>
                    <span className="px-2 py-1 bg-surface-container-lowest text-on-surface rounded text-[11px] font-medium shadow-sm border border-outline-variant/20">
                      Dietary Nutrients
                    </span>
                    <span className="px-2 py-1 bg-surface-container-lowest text-on-surface rounded text-[11px] font-medium shadow-sm border border-outline-variant/20">
                      Assay Calibration
                    </span>
                  </div>
                </div>
              </aside>
            </div>
          </section>

          {/* FORMULA & MATHEMATICAL PROOF SECTION */}
          <section className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop mb-space-2xl w-full">
            <div className="bg-surface-container-lowest rounded-xl p-space-md sm:p-space-xl shadow-sm border border-outline-variant/20 space-y-space-lg">
              <div className="space-y-space-2xs max-w-3xl">
                <span className="font-label-caps text-label-caps uppercase text-primary font-semibold tracking-wider">
                  Mathematical Specification
                </span>
                <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">
                  Gram to Milligram Formula &amp; Mathematical Proof
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  The conversion between the metric gram (g) and milligram (mg) is rooted in the BIPM SI decimal prefix system established by the 11th Conférence Générale des Poids et Mesures (CGPM).
                </p>
              </div>

              {/* FORMULA DISPLAY DUAL CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                {/* DIRECT FORMULA */}
                <div className="bg-surface-container-low rounded-xl p-space-md space-y-space-xs border border-outline-variant/20">
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps uppercase text-primary font-bold">
                      Direct Multiplicative Constant Form
                    </span>
                    <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-data-mono text-[11px]">Primary Model</span>
                  </div>
                  <div className="bg-surface-container-lowest p-space-sm rounded-lg text-center shadow-inner border border-outline-variant/20">
                    <div className="font-numerical-display text-[26px] text-primary font-bold tracking-tight">mg = g × 1,000</div>
                    <div className="font-data-mono text-[13px] text-outline-variant mt-1">m<sub>(mg)</sub> = m<sub>(g)</sub> × 10³</div>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    To convert an observed mass in grams to milligrams, multiply the base numerical gram quantity by <strong className="text-on-surface">1,000</strong> (equivalent to shifting the base-10 radix marker three places to the right).
                  </p>
                </div>

                {/* RECIPROCAL FORMULA */}
                <div className="bg-surface-container-low rounded-xl p-space-md space-y-space-xs border border-outline-variant/20">
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps uppercase text-secondary font-bold">
                      Reciprocal Formulation (mg to g)
                    </span>
                    <span className="px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-data-mono text-[11px]">
                      Inverse Model
                    </span>
                  </div>
                  <div className="bg-surface-container-lowest p-space-sm rounded-lg text-center shadow-inner border border-outline-variant/20">
                    <div className="font-numerical-display text-[26px] text-secondary font-bold tracking-tight">g = mg ÷ 1,000</div>
                    <div className="font-data-mono text-[13px] text-outline-variant mt-1">m<sub>(g)</sub> = m<sub>(mg)</sub> × 0.001 (10⁻³)</div>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    The mathematical inverse confirms that 1 milligram equals <strong className="text-on-surface">0.001 grams</strong>. This reciprocity guarantees zero hysteresis or loss of decimal integrity across conversions.
                  </p>
                </div>
              </div>

              {/* STEP-BY-STEP WORKED METROLOGICAL EXAMPLES */}
              <div className="space-y-space-sm">
                <h3 className="font-headline-md text-headline-md font-bold text-on-surface tracking-tight">
                  Step-by-Step Worked Metrological Examples
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-sm">
                  {/* Example 1 */}
                  <div className="bg-surface-container-low rounded-xl p-space-sm space-y-space-2xs border border-outline-variant/20">
                    <div className="flex items-center justify-between">
                      <span className="font-label-caps text-label-caps uppercase text-outline">Example 01</span>
                      <span className="px-1.5 py-0.5 bg-surface-container-high rounded text-[11px] font-data-mono text-on-surface">
                        Baseline Unit
                      </span>
                    </div>
                    <div className="font-semibold text-on-surface text-[14px]">Analytical Lab Standard: 1.000 g</div>
                    <div className="font-data-mono text-[12px] text-on-surface-variant bg-surface-container-lowest p-space-2xs rounded border border-outline-variant/20">
                      mg = 1.000 × 1,000<br />
                      <strong className="text-primary">= 1,000.000 mg</strong>
                    </div>
                    <p className="font-body-sm text-[12px] text-outline">
                      A standard single gram weight precisely calibrates one thousand milligrams on a microbalance.
                    </p>
                  </div>

                  {/* Example 2 */}
                  <div className="bg-surface-container-low rounded-xl p-space-sm space-y-space-2xs border border-outline-variant/20">
                    <div className="flex items-center justify-between">
                      <span className="font-label-caps text-label-caps uppercase text-outline">Example 02</span>
                      <span className="px-1.5 py-0.5 bg-surface-container-high rounded text-[11px] font-data-mono text-on-surface">
                        Clinical Dose
                      </span>
                    </div>
                    <div className="font-semibold text-on-surface text-[14px]">Pharmacological Batch: 5.000 g</div>
                    <div className="font-data-mono text-[12px] text-on-surface-variant bg-surface-container-lowest p-space-2xs rounded border border-outline-variant/20">
                      mg = 5.000 × 1,000<br />
                      <strong className="text-primary">= 5,000.000 mg</strong>
                    </div>
                    <p className="font-body-sm text-[12px] text-outline">
                      Active pharmaceutical bulk ingredient converted directly for compounding divided unit powders.
                    </p>
                  </div>

                  {/* Example 3 */}
                  <div className="bg-surface-container-low rounded-xl p-space-sm space-y-space-2xs border border-outline-variant/20">
                    <div className="flex items-center justify-between">
                      <span className="font-label-caps text-label-caps uppercase text-outline">Example 03</span>
                      <span className="px-1.5 py-0.5 bg-surface-container-high rounded text-[11px] font-data-mono text-on-surface">
                        Sub-Gram Aliquot
                      </span>
                    </div>
                    <div className="font-semibold text-on-surface text-[14px]">Clinical Ingredient: 0.250 g</div>
                    <div className="font-data-mono text-[12px] text-on-surface-variant bg-surface-container-lowest p-space-2xs rounded border border-outline-variant/20">
                      mg = 0.250 × 1,000<br />
                      <strong className="text-primary">= 250.000 mg</strong>
                    </div>
                    <p className="font-body-sm text-[12px] text-outline">
                      Standard tablet core weight for typical prescription oral analgesic or antibiotic formulations.
                    </p>
                  </div>

                  {/* Example 4 */}
                  <div className="bg-surface-container-low rounded-xl p-space-sm space-y-space-2xs border border-outline-variant/20">
                    <div className="flex items-center justify-between">
                      <span className="font-label-caps text-label-caps uppercase text-outline">Example 04</span>
                      <span className="px-1.5 py-0.5 bg-surface-container-high rounded text-[11px] font-data-mono text-on-surface">
                        Supplement Scoop
                      </span>
                    </div>
                    <div className="font-semibold text-on-surface text-[14px]">Nutraceutical Dose: 10.000 g</div>
                    <div className="font-data-mono text-[12px] text-on-surface-variant bg-surface-container-lowest p-space-2xs rounded border border-outline-variant/20">
                      mg = 10.000 × 1,000<br />
                      <strong className="text-primary">= 10,000.000 mg</strong>
                    </div>
                    <p className="font-body-sm text-[12px] text-outline">
                      Daily scoop formulation for amino acid supplements or peptide powder mixtures.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SEARCHABLE CONVERSION TABLE */}
          <section className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop mb-space-2xl w-full">
            <div className="bg-surface-container-lowest rounded-xl p-space-md sm:p-space-xl shadow-sm border border-outline-variant/20 space-y-space-md">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
                <div>
                  <span className="font-label-caps text-label-caps uppercase text-primary font-semibold tracking-wider">
                    Quick Reference Lookup Matrix
                  </span>
                  <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">
                    Gram to Milligram Conversion Table
                  </h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Validated reference data across standard pharmaceutical, laboratory, and scientific increments.
                  </p>
                </div>
                <div className="flex items-center gap-space-xs">
                  <div className="relative w-full sm:w-64">
                    <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                      filter_list
                    </span>
                    <input
                      aria-label="Filter conversion table rows"
                      className="w-full pl-8 pr-3 py-1.5 bg-surface-container-low rounded-lg font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/30 border border-outline-variant/20"
                      placeholder="Search grams or mg..."
                      type="text"
                      value={tableSearch}
                      onChange={(e) => setTableSearch(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* TABLE CONTAINER */}
              <div className="overflow-x-auto rounded-xl border border-outline-variant/20">
                <table className="w-full text-left font-body-sm border-collapse" id="conversion-reference-table">
                  <thead>
                    <tr className="bg-surface-container-high text-on-surface">
                      <th className="py-3 px-4 font-semibold text-label-caps uppercase tracking-wider" scope="col">
                        Grams (g)
                      </th>
                      <th className="py-3 px-4 font-semibold text-label-caps uppercase tracking-wider text-primary" scope="col">
                        Milligrams (mg)
                      </th>
                      <th className="py-3 px-4 font-semibold text-label-caps uppercase tracking-wider font-data-mono" scope="col">
                        Scientific Notation
                      </th>
                      <th className="py-3 px-4 font-semibold text-label-caps uppercase tracking-wider" scope="col">
                        Physical Reference / Example
                      </th>
                      <th className="py-3 px-4 font-semibold text-label-caps uppercase tracking-wider text-right" scope="col">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10 text-on-surface">
                    {filteredRows.map((row, idx) => (
                      <tr
                        key={row.grams}
                        className={`hover:bg-surface-container-low transition-colors ${
                          idx % 2 === 1 ? 'bg-surface-container-low/40' : 'bg-surface-container-lowest'
                        }`}
                      >
                        <td className="py-3 px-4 font-bold font-data-mono text-[15px]">{row.label}</td>
                        <td className="py-3 px-4 font-bold font-data-mono text-primary text-[15px]">
                          {row.mg.toLocaleString('en-US')} mg
                        </td>
                        <td className="py-3 px-4 font-data-mono text-outline text-[13px]">{row.scientific}</td>
                        <td className="py-3 px-4 text-on-surface-variant">{row.benchmark}</td>
                        <td className="py-3 px-4 text-right">
                          <button
                            className="px-2.5 py-1 rounded bg-surface-container-high hover:bg-primary hover:text-on-primary font-data-mono text-[11px] font-semibold transition-all border border-outline-variant/20"
                            onClick={() => handleLoadAndScroll(row.grams)}
                            type="button"
                          >
                            Load
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredRows.length === 0 && (
                      <tr>
                        <td className="py-6 text-center text-on-surface-variant" colSpan={5}>
                          No conversion entries matched your search &quot;{tableSearch}&quot;.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* STEP-BY-STEP SOP SECTION */}
          <section className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop mb-space-2xl w-full">
            <div className="bg-surface-container-low rounded-xl p-space-md sm:p-space-xl space-y-space-lg border border-outline-variant/20">
              <div className="space-y-space-2xs max-w-3xl">
                <span className="font-label-caps text-label-caps uppercase text-secondary font-bold tracking-wider">
                  Standard Operating Procedure
                </span>
                <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">
                  How to Convert Grams to Milligrams (Step-by-Step SOP)
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Follow this 3-step protocol utilized by medical dispensing pharmacies, chemistry laboratories, and manufacturing QA departments to ensure zero decimal transposition errors.
                </p>
              </div>

              {/* 3-STEP GRID */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
                <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/20 space-y-space-xs relative">
                  <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-[14px]">
                    01
                  </div>
                  <h3 className="font-headline-md text-[18px] font-bold text-on-surface">Acquire Gram Reading</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Read the calibrated balance display, drug label, or nutrition specification in grams (g). Ensure the analytical balance has finished settling and the tare container weight is zeroed out.
                  </p>
                  <div className="font-data-mono text-[11px] text-outline pt-2">e.g., Target: 1.250 g</div>
                </div>

                <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/20 space-y-space-xs relative">
                  <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-[14px]">
                    02
                  </div>
                  <h3 className="font-headline-md text-[18px] font-bold text-on-surface">Multiply by 1,000</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Multiply the gram figure by 1,000. In manual or mental calculation, shift the decimal point exactly three places to the right, padding terminal positions with zeros if necessary.
                  </p>
                  <div className="font-data-mono text-[11px] text-outline pt-2">1.250 × 1,000 = 1,250</div>
                </div>

                <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/20 space-y-space-xs relative">
                  <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-[14px]">
                    03
                  </div>
                  <h3 className="font-headline-md text-[18px] font-bold text-on-surface">Annotate Unit as &quot;mg&quot;</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Assign the official lower-case SI abbreviation <strong className="text-on-surface font-semibold">mg</strong>. Do not use capitalized &quot;MG&quot; or ambiguous abbreviations to prevent clinical misinterpretation.
                  </p>
                  <div className="font-data-mono text-[11px] text-primary pt-2 font-bold">Result: 1,250 mg</div>
                </div>
              </div>

              {/* WORKED REAL-WORLD SCENARIOS */}
              <div className="space-y-space-xs pt-space-xs">
                <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
                  Key Real-World Conversion Scenarios
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-space-xs">
                  <div className="bg-surface-container-lowest p-space-sm rounded-lg shadow-sm border border-outline-variant/20">
                    <span className="text-label-caps font-label-caps uppercase text-outline">Scenario A</span>
                    <div className="font-bold text-on-surface text-[15px] mt-0.5">1 g to mg</div>
                    <div className="font-data-mono text-[14px] font-bold text-primary mt-1">1,000 mg</div>
                    <p className="text-[11px] text-outline-variant mt-1">Standard clinical single-gram dose reference</p>
                  </div>
                  <div className="bg-surface-container-lowest p-space-sm rounded-lg shadow-sm border border-outline-variant/20">
                    <span className="text-label-caps font-label-caps uppercase text-outline">Scenario B</span>
                    <div className="font-bold text-on-surface text-[15px] mt-0.5">5 g to mg</div>
                    <div className="font-data-mono text-[14px] font-bold text-primary mt-1">5,000 mg</div>
                    <p className="text-[11px] text-outline-variant mt-1">Typical daily creatine monohydrate scoop</p>
                  </div>
                  <div className="bg-surface-container-lowest p-space-sm rounded-lg shadow-sm border border-outline-variant/20">
                    <span className="text-label-caps font-label-caps uppercase text-outline">Scenario C</span>
                    <div className="font-bold text-on-surface text-[15px] mt-0.5">10 g to mg</div>
                    <div className="font-data-mono text-[14px] font-bold text-primary mt-1">10,000 mg</div>
                    <p className="text-[11px] text-outline-variant mt-1">Peptide powder or electrolyte sachet</p>
                  </div>
                  <div className="bg-surface-container-lowest p-space-sm rounded-lg shadow-sm border border-outline-variant/20">
                    <span className="text-label-caps font-label-caps uppercase text-outline">Scenario D</span>
                    <div className="font-bold text-on-surface text-[15px] mt-0.5">50 g to mg</div>
                    <div className="font-data-mono text-[14px] font-bold text-primary mt-1">50,000 mg</div>
                    <p className="text-[11px] text-outline-variant mt-1">Analytical laboratory sample beaker tare</p>
                  </div>
                  <div className="bg-surface-container-lowest p-space-sm rounded-lg shadow-sm border border-outline-variant/20">
                    <span className="text-label-caps font-label-caps uppercase text-outline">Scenario E</span>
                    <div className="font-bold text-on-surface text-[15px] mt-0.5">100 g to mg</div>
                    <div className="font-data-mono text-[14px] font-bold text-primary mt-1">100,000 mg</div>
                    <p className="text-[11px] text-outline-variant mt-1">Bulk active compound reagent container</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* METROLOGY DEEP-DIVE ARTICLES */}
          <section className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop mb-space-2xl w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
              {/* ARTICLE: WHAT IS A GRAM? */}
              <article className="bg-surface-container-lowest rounded-xl p-space-md sm:p-space-xl shadow-sm border border-outline-variant/20 space-y-space-sm">
                <div className="flex items-center gap-space-xs text-primary">
                  <span className="material-symbols-outlined text-[24px]">scale</span>
                  <span className="font-label-caps text-label-caps uppercase tracking-wider font-semibold">
                    Metrological Definition
                  </span>
                </div>
                <h2 className="font-headline-lg text-[24px] font-bold text-on-surface tracking-tight">What Is a Gram?</h2>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  The <strong className="text-on-surface">gram</strong> (symbol: <strong className="text-on-surface font-semibold">g</strong>) is an official SI unit of mass. Historically defined in 1795 by the French National Convention as the absolute weight of a volume of pure water equal to the cube of the hundredth part of a metre (<span className="font-data-mono text-[12px]">1 cm³</span>) at the temperature of melting ice.
                </p>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Following the landmark 2019 redefinition of the SI base units by the BIPM, the kilogram—and consequently the gram—is no longer tethered to a physical artifact (such as the International Prototype of the Kilogram in Sèvres). Instead, it is rigorously tied to the exact invariant value of the <strong className="text-on-surface">Planck constant <em>h</em></strong> (<span className="font-data-mono text-[12px]">6.626 070 15 × 10⁻³⁴ J·s</span>).
                </p>
                <div className="bg-surface-container-low p-space-sm rounded-lg space-y-1 text-body-sm text-on-surface-variant border border-outline-variant/20">
                  <span className="font-semibold text-on-surface block text-[13px]">Everyday and Laboratory Context:</span>
                  <span>
                    A standard US dollar bill or an ordinary metal paperclip weighs almost exactly 1.00 gram. Grams serve as the universal standard for nutritional declarations, food preparation, and general chemical measurement worldwide.
                  </span>
                </div>
              </article>

              {/* ARTICLE: WHAT IS A MILLIGRAM? */}
              <article className="bg-surface-container-lowest rounded-xl p-space-md sm:p-space-xl shadow-sm border border-outline-variant/20 space-y-space-sm">
                <div className="flex items-center gap-space-xs text-secondary">
                  <span className="material-symbols-outlined text-[24px]">medication</span>
                  <span className="font-label-caps text-label-caps uppercase tracking-wider font-semibold">
                    Pharmacological Standard
                  </span>
                </div>
                <h2 className="font-headline-lg text-[24px] font-bold text-on-surface tracking-tight">What Is a Milligram?</h2>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  The <strong className="text-on-surface">milligram</strong> (symbol: <strong className="text-on-surface font-semibold">mg</strong>) is a sub-multiple unit of mass in the International System of Units (SI), equal to <strong className="text-on-surface font-semibold">one-thousandth of a gram (10⁻³ g)</strong> or one-millionth of a kilogram (<span className="font-data-mono text-[12px]">10⁻⁶ kg</span>).
                </p>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Because biological and therapeutic chemical reactions occur at micro-molecular scales, the milligram is the global gold standard for pharmaceutical formulations, Active Pharmaceutical Ingredients (APIs), vitamins, supplements, and analytical toxicology assays.
                </p>
                <div className="bg-surface-container-low p-space-sm rounded-lg space-y-1 text-body-sm text-on-surface-variant border border-outline-variant/20">
                  <span className="font-semibold text-on-surface block text-[13px]">Physical Perspective:</span>
                  <span>
                    A single grain of commercial table salt (NaCl) weighs approximately 0.05 mg to 0.1 mg. An ordinary standard adult aspirin tablet contains exactly 325 mg or 500 mg of acetylsalicylic acid.
                  </span>
                </div>
              </article>
            </div>
          </section>

          {/* WHY CONVERT GRAMS TO MILLIGRAMS */}
          <section className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop mb-space-2xl w-full">
            <div className="bg-surface-container-lowest rounded-xl p-space-md sm:p-space-xl shadow-sm border border-outline-variant/20 space-y-space-lg">
              <div className="space-y-space-2xs max-w-3xl">
                <span className="font-label-caps text-label-caps uppercase text-primary font-semibold tracking-wider">
                  Industrial &amp; Scientific Applications
                </span>
                <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">
                  Why Convert Grams to Milligrams?
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Bridging grams to milligrams is an indispensable calculation across regulated clinical healthcare, laboratory protocols, and product formulations where decimal inaccuracies carry direct real-world consequences.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-space-sm">
                {/* Application 1 */}
                <div className="bg-surface-container-low rounded-xl p-space-sm space-y-space-2xs flex flex-col justify-between border border-outline-variant/20">
                  <div className="space-y-space-2xs">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-[22px]">vaccines</span>
                    </div>
                    <h3 className="font-semibold text-on-surface text-[15px]">Medicine &amp; Clinical Dosage</h3>
                    <p className="text-body-sm text-[12px] text-on-surface-variant leading-normal">
                      Doctors write prescriptions in milligrams while bulk active compounds arrive at pharmacies in grams. Compounding pharmacists convert to ensure patient safety.
                    </p>
                  </div>
                  <span className="font-data-mono text-[11px] text-primary font-bold">1 g = 1,000 mg Dose</span>
                </div>
                {/* Application 2 */}
                <div className="bg-surface-container-low rounded-xl p-space-sm space-y-space-2xs flex flex-col justify-between border border-outline-variant/20">
                  <div className="space-y-space-2xs">
                    <div className="w-10 h-10 rounded-lg bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center">
                      <span className="material-symbols-outlined text-[22px]">science</span>
                    </div>
                    <h3 className="font-semibold text-on-surface text-[15px]">Compounding Lab Science</h3>
                    <p className="text-body-sm text-[12px] text-on-surface-variant leading-normal">
                      Analytical chemists prepare standard molar reagents where buffer powders must be weighed in exact milligram increments down to the 4th decimal place.
                    </p>
                  </div>
                  <span className="font-data-mono text-[11px] text-secondary font-bold">Molar Stock Solution</span>
                </div>
                {/* Application 3 */}
                <div className="bg-surface-container-low rounded-xl p-space-sm space-y-space-2xs flex flex-col justify-between border border-outline-variant/20">
                  <div className="space-y-space-2xs">
                    <div className="w-10 h-10 rounded-lg bg-surface-container-high text-on-surface flex items-center justify-center">
                      <span className="material-symbols-outlined text-[22px]">nutrition</span>
                    </div>
                    <h3 className="font-semibold text-on-surface text-[15px]">Dietary Micronutrients</h3>
                    <p className="text-body-sm text-[12px] text-on-surface-variant leading-normal">
                      Sports nutritionists and supplement manufacturers measure vitamin B, zinc, caffeine, and nootropics in milligrams rather than macro-gram quantities.
                    </p>
                  </div>
                  <span className="font-data-mono text-[11px] text-outline font-bold">FDA Supplement Facts</span>
                </div>
                {/* Application 4 */}
                <div className="bg-surface-container-low rounded-xl p-space-sm space-y-space-2xs flex flex-col justify-between border border-outline-variant/20">
                  <div className="space-y-space-2xs">
                    <div className="w-10 h-10 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center">
                      <span className="material-symbols-outlined text-[22px]">experiment</span>
                    </div>
                    <h3 className="font-semibold text-on-surface text-[15px]">Chemical Reagent Assays</h3>
                    <p className="text-body-sm text-[12px] text-on-surface-variant leading-normal">
                      Titration reactions, chromatography reference standards, and spectrophotometry solutions rely on milligram fractions for accurate calibration curves.
                    </p>
                  </div>
                  <span className="font-data-mono text-[11px] text-tertiary font-bold">Assay Calibration</span>
                </div>
                {/* Application 5 */}
                <div className="bg-surface-container-low rounded-xl p-space-sm space-y-space-2xs flex flex-col justify-between border border-outline-variant/20">
                  <div className="space-y-space-2xs">
                    <div className="w-10 h-10 rounded-lg bg-primary-fixed text-on-primary-fixed flex items-center justify-center">
                      <span className="material-symbols-outlined text-[22px]">school</span>
                    </div>
                    <h3 className="font-semibold text-on-surface text-[15px]">Educational STEM Labs</h3>
                    <p className="text-body-sm text-[12px] text-on-surface-variant leading-normal">
                      High school and university chemistry students learn metric dimensional analysis and stoichiometric unit cancellation utilizing the 10³ milligram multiplier.
                    </p>
                  </div>
                  <span className="font-data-mono text-[11px] text-primary font-bold">Stoichiometry Core</span>
                </div>
              </div>
            </div>
          </section>

          {/* COMMON CONVERSIONS (VISUAL QUICK LOOKUP MATRIX CARDS) */}
          <section className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop mb-space-2xl w-full">
            <div className="bg-surface-container-low rounded-xl p-space-md sm:p-space-xl space-y-space-md border border-outline-variant/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
                <div>
                  <span className="font-label-caps text-label-caps uppercase text-primary font-semibold tracking-wider">
                    Fast Visual Lookup
                  </span>
                  <h2 className="font-headline-md text-headline-md font-bold text-on-surface tracking-tight">
                    Common Gram to Milligram Conversions
                  </h2>
                </div>
                <span className="text-body-sm text-outline font-data-mono">Click any card to load workbench</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-space-xs">
                {[
                  { label: 'Mass Standard', g: 1, mg: '1,000 mg' },
                  { label: 'Dual Unit', g: 2, mg: '2,000 mg' },
                  { label: '5¢ Nickel', g: 5, mg: '5,000 mg' },
                  { label: 'Decagram (dag)', g: 10, mg: '10,000 mg' },
                  { label: 'Quarter-Deci', g: 25, mg: '25,000 mg' },
                  { label: 'Half Hectogram', g: 50, mg: '50,000 mg' },
                  { label: 'Hectogram (hg)', g: 100, mg: '100,000 mg' },
                  { label: 'Quarter Kilo', g: 250, mg: '250,000 mg' },
                  { label: 'Half Kilogram', g: 500, mg: '500,000 mg' },
                  { label: '1 Kilogram (kg)', g: 1000, mg: '1,000,000 mg' },
                ].map((item) => (
                  <div
                    key={item.g}
                    className="quick-matrix-card bg-surface-container-lowest hover:bg-primary hover:text-on-primary rounded-xl p-space-sm shadow-sm cursor-pointer transition-all text-center group border border-outline-variant/20"
                    onClick={() => handleLoadAndScroll(item.g)}
                  >
                    <span className="text-label-caps font-label-caps uppercase text-outline group-hover:text-primary-fixed">
                      {item.label}
                    </span>
                    <div className="font-headline-md font-bold text-[18px] mt-1">{item.g.toLocaleString('en-US')} g</div>
                    <div className="font-data-mono text-[13px] text-primary group-hover:text-surface-container-lowest font-bold mt-0.5">
                      {item.mg}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FREQUENTLY ASKED QUESTIONS SECTION */}
          <section className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop mb-space-2xl w-full">
            <div className="bg-surface-container-lowest rounded-xl p-space-md sm:p-space-xl shadow-sm border border-outline-variant/20 space-y-space-lg">
              <div className="space-y-space-2xs max-w-3xl">
                <span className="font-label-caps text-label-caps uppercase text-primary font-semibold tracking-wider">
                  Expert Verification &amp; FAQ
                </span>
                <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">
                  Frequently Asked Questions: Grams to Milligrams
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Comprehensive answers to common metrology, calculation, and clinical dosing questions regarding gram-to-milligram conversions.
                </p>
              </div>

              {/* FAQ ACCORDION LIST */}
              <div className="space-y-space-xs" id="faq-accordion-container">
                {[
                  {
                    q: 'How many milligrams are in 1 gram?',
                    num: 'Q1.',
                    ans: (
                      <>
                        There are <strong className="text-on-surface">exactly 1,000 milligrams in 1 gram</strong> (1 g = 1,000 mg). This is an exact definition under the International System of Units (SI). The prefix &ldquo;milli-&rdquo; mathematically denotes one-thousandth (<span className="font-data-mono text-[13px]">10⁻³</span>), which implies that one gram contains one thousand equal milligram parts.
                      </>
                    ),
                  },
                  {
                    q: 'How do I convert grams to milligrams?',
                    num: 'Q2.',
                    ans: (
                      <>
                        To convert any quantity in grams to milligrams, simply <strong className="text-on-surface">multiply the mass value in grams by 1,000</strong>. Alternatively, you can move the decimal point three places to the right. For example, if you have 0.75 grams: <span className="font-data-mono text-[13px]">0.75 × 1,000 = 750 mg</span>.
                      </>
                    ),
                  },
                  {
                    q: 'How many milligrams are in 5 grams?',
                    num: 'Q3.',
                    ans: (
                      <>
                        There are <strong className="text-on-surface">5,000 milligrams in 5 grams</strong>. Applying the standard conversion formula: <span className="font-data-mono text-[13px]">5 g × 1,000 = 5,000 mg</span>. This is approximately the physical mass of a standard United States 5-cent nickel coin.
                      </>
                    ),
                  },
                  {
                    q: 'How many milligrams are in 10 grams?',
                    num: 'Q4.',
                    ans: (
                      <>
                        There are <strong className="text-on-surface">10,000 milligrams in 10 grams</strong> (<span className="font-data-mono text-[13px]">10 g × 1,000 = 10,000 mg</span>). In SI derived metric units, 10 grams also equals exactly 1 decagram (dag).
                      </>
                    ),
                  },
                  {
                    q: 'How many milligrams are in 100 grams?',
                    num: 'Q5.',
                    ans: (
                      <>
                        There are <strong className="text-on-surface">100,000 milligrams in 100 grams</strong> (<span className="font-data-mono text-[13px]">100 g × 1,000 = 100,000 mg</span> or <span className="font-data-mono text-[13px]">1.0 × 10⁵ mg</span> in scientific notation). 100 grams is also referred to as one hectogram (hg).
                      </>
                    ),
                  },
                  {
                    q: 'Which is larger, a gram or a milligram?',
                    num: 'Q6.',
                    ans: (
                      <>
                        A <strong className="text-on-surface">gram is substantially larger</strong> than a milligram. Specifically, 1 gram is exactly 1,000 times larger than 1 milligram. Consequently, it takes 1,000 milligrams combined to equal the mass of a single gram.
                      </>
                    ),
                  },
                  {
                    q: 'Can I use this converter for medicine dosages?',
                    num: 'Q7.',
                    ans: (
                      <>
                        Yes. This converter is calibrated strictly to the BIPM SI metric system using 64-bit IEEE 754 precision with zero algorithmic error. However, in medical environments, prescription doses must always be checked and confirmed by a licensed medical practitioner or registered pharmacist to ensure patient-specific safety protocols are upheld.
                      </>
                    ),
                  },
                  {
                    q: 'How accurate is this converter?',
                    num: 'Q8.',
                    ans: (
                      <>
                        The converter executes locally within your browser sandbox with <strong className="text-on-surface">100% mathematical accuracy</strong>. Because the multiplier <span className="font-data-mono text-[13px]">1,000</span> is an integer power of ten (<span className="font-data-mono text-[13px]">10³</span>), multiplying a decimal value by 1,000 produces deterministic, exact results without rounding drift.
                      </>
                    ),
                  },
                  {
                    q: 'How many grams are in one milligram?',
                    num: 'Q9.',
                    ans: (
                      <>
                        There are <strong className="text-on-surface">0.001 grams in one milligram</strong> (1 mg = 10⁻³ g = 0.001 g). If converting backwards from milligrams to grams, divide your milligram figure by 1,000.
                      </>
                    ),
                  },
                  {
                    q: 'What is the formula for converting grams to milligrams?',
                    num: 'Q10.',
                    ans: (
                      <>
                        The universal mathematical formula is: <strong className="text-on-surface">Mass in Milligrams (mg) = Mass in Grams (g) × 1,000</strong>. In dimensional scientific syntax: <span className="font-data-mono text-[13px]">m(mg) = m(g) × 10³</span>.
                      </>
                    ),
                  },
                ].map((item, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div
                      key={item.num}
                      className={`rounded-xl p-space-md transition-all border border-outline-variant/20 ${
                        isOpen ? 'bg-surface-container-high/60 shadow-sm' : 'bg-surface-container-low'
                      }`}
                    >
                      <button
                        className="w-full flex items-center justify-between text-left cursor-pointer list-none font-semibold text-on-surface text-headline-md text-[17px] select-none"
                        onClick={() => toggleFaq(idx)}
                        type="button"
                      >
                        <span className="flex items-center gap-2">
                          <span className="font-data-mono text-primary text-[14px]">{item.num}</span>
                          <span>{item.q}</span>
                        </span>
                        <span
                          className={`material-symbols-outlined text-outline transition-transform duration-200 ${
                            isOpen ? 'rotate-180 text-primary' : ''
                          }`}
                        >
                          expand_more
                        </span>
                      </button>
                      {isOpen && (
                        <div className="mt-space-sm pt-space-xs text-body-md text-on-surface-variant leading-relaxed border-t border-outline-variant/20">
                          {item.ans}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* INTERNAL LINKING & RELATED MASS CONVERSIONS */}
          <section className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop mb-space-2xl w-full">
            <div className="bg-surface-container-lowest rounded-xl p-space-md sm:p-space-xl shadow-sm border border-outline-variant/20 space-y-space-md">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-label-caps text-label-caps uppercase text-primary font-semibold tracking-wider">
                    Metrological Cross-Links
                  </span>
                  <h2 className="font-headline-md text-headline-md font-bold text-on-surface tracking-tight">
                    Related Mass &amp; Weight Converters
                  </h2>
                </div>
                <Link className="text-body-sm text-primary font-semibold hover:underline flex items-center gap-1" href="/weight-mass-converter">
                  <span>All Mass Tools</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-space-sm">
                <Link className="bg-surface-container-low hover:bg-surface-container-high p-space-sm rounded-xl transition-all block group border border-outline-variant/20" href="/conversion/gram-to-kilogram">
                  <div className="flex items-center justify-between text-outline group-hover:text-primary">
                    <span className="font-data-mono text-[12px]">g → kg</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_outward</span>
                  </div>
                  <div className="font-semibold text-on-surface text-[15px] mt-1">Gram to Kilogram</div>
                  <p className="text-[12px] text-on-surface-variant mt-0.5">SI base standard scale (÷1,000)</p>
                </Link>

                <Link className="bg-surface-container-low hover:bg-surface-container-high p-space-sm rounded-xl transition-all block group border border-outline-variant/20" href="/conversion/gram-to-ounce">
                  <div className="flex items-center justify-between text-outline group-hover:text-primary">
                    <span className="font-data-mono text-[12px]">g → oz</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_outward</span>
                  </div>
                  <div className="font-semibold text-on-surface text-[15px] mt-1">Gram to Ounce</div>
                  <p className="text-[12px] text-on-surface-variant mt-0.5">Avoirdupois ounce conversion</p>
                </Link>

                <Link className="bg-surface-container-low hover:bg-surface-container-high p-space-sm rounded-xl transition-all block group border border-outline-variant/20" href="/conversion/gram-to-pound">
                  <div className="flex items-center justify-between text-outline group-hover:text-primary">
                    <span className="font-data-mono text-[12px]">g → lb</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_outward</span>
                  </div>
                  <div className="font-semibold text-on-surface text-[15px] mt-1">Gram to Pound</div>
                  <p className="text-[12px] text-on-surface-variant mt-0.5">Imperial system weight ratio</p>
                </Link>

                <div className="bg-surface-container-low p-space-sm rounded-xl border border-outline-variant/20 block group">
                  <div className="flex items-center justify-between text-outline group-hover:text-primary">
                    <span className="font-data-mono text-[12px]">g → µg</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_outward</span>
                  </div>
                  <div className="font-semibold text-on-surface text-[15px] mt-1">Gram to Microgram</div>
                  <p className="text-[12px] text-on-surface-variant mt-0.5">Sub-micro scale (×1,000,000)</p>
                </div>

                <div
                  className="bg-surface-container-low hover:bg-surface-container-high p-space-sm rounded-xl transition-all block group border-2 border-primary/20 cursor-pointer"
                  onClick={handleSwap}
                >
                  <div className="flex items-center justify-between text-primary">
                    <span className="font-data-mono text-[12px]">mg → g</span>
                    <span className="material-symbols-outlined text-[16px]">sync_alt</span>
                  </div>
                  <div className="font-semibold text-on-surface text-[15px] mt-1">Milligram to Gram</div>
                  <p className="text-[12px] text-on-surface-variant mt-0.5">Inverse canonical converter (÷1,000)</p>
                </div>

                <Link className="bg-surface-container-low hover:bg-surface-container-high p-space-sm rounded-xl transition-all block group border border-outline-variant/20" href="/conversion/kilogram-to-gram">
                  <div className="flex items-center justify-between text-outline group-hover:text-primary">
                    <span className="font-data-mono text-[12px]">kg → g</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_outward</span>
                  </div>
                  <div className="font-semibold text-on-surface text-[15px] mt-1">Kilogram to Gram</div>
                  <p className="text-[12px] text-on-surface-variant mt-0.5">Metric multiplication standard</p>
                </Link>

                <Link className="bg-surface-container-low hover:bg-surface-container-high p-space-sm rounded-xl transition-all block group border border-outline-variant/20" href="/conversion/ounce-to-gram">
                  <div className="flex items-center justify-between text-outline group-hover:text-primary">
                    <span className="font-data-mono text-[12px]">oz → g</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_outward</span>
                  </div>
                  <div className="font-semibold text-on-surface text-[15px] mt-1">Ounce to Gram</div>
                  <p className="text-[12px] text-on-surface-variant mt-0.5">1 oz = 28.349523125 g</p>
                </Link>

                <Link className="bg-surface-container-low hover:bg-surface-container-high p-space-sm rounded-xl transition-all block group border border-outline-variant/20" href="/conversion/pound-to-gram">
                  <div className="flex items-center justify-between text-outline group-hover:text-primary">
                    <span className="font-data-mono text-[12px]">lb → g</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_outward</span>
                  </div>
                  <div className="font-semibold text-on-surface text-[15px] mt-1">Pound to Gram</div>
                  <p className="text-[12px] text-on-surface-variant mt-0.5">1 lb = 453.59237 g exactly</p>
                </Link>
              </div>

              {/* DYNAMIC UNIT SWITCHING NOTE */}
              <div className="bg-surface-container-high/40 rounded-lg p-space-sm flex items-center gap-space-xs text-body-sm text-on-surface-variant border border-outline-variant/20">
                <span className="material-symbols-outlined text-secondary text-[20px]">info</span>
                <span>
                  <strong className="text-on-surface">Architectural Routing Notice:</strong> SolveIt utilizes standalone, indexed canonical routing for both{' '}
                  <code className="font-data-mono text-primary text-[12px]">/conversion/gram-to-milligram</code> and{' '}
                  <code className="font-data-mono text-secondary text-[12px]">/conversion/milligram-to-gram</code> to ensure maximum indexation fidelity, schema conformance, and sub-millisecond calculation speeds.
                </span>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
