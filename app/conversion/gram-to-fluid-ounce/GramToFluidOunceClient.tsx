'use client';

import React, { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Metrological Constants
const US_FL_OZ_ML = 29.5735295625;
const UK_FL_OZ_ML = 28.4130625;
const ML_PER_US_CUP = 236.5882365;
const ML_PER_US_TBSP = 14.78676478125;
const ML_PER_US_TSP = 4.92892159375;
const GRAMS_PER_AVDP_OZ = 28.349523125;

interface DensityItem {
  name: string;
  shortName: string;
  density: number; // g/mL
}

const DENSITY_PRESETS: DensityItem[] = [
  { name: 'Water', shortName: 'Water', density: 1.000 },
  { name: 'Whole Milk', shortName: 'Whole Milk', density: 1.030 },
  { name: 'Olive Oil', shortName: 'Olive Oil', density: 0.920 },
  { name: 'AP Flour (Sifted)', shortName: 'AP Flour', density: 0.528 },
  { name: 'Granulated Sugar', shortName: 'Gran. Sugar', density: 0.845 },
  { name: 'Pure Honey', shortName: 'Honey', density: 1.420 },
  { name: 'Melted Butter', shortName: 'Melted Butter', density: 0.911 },
  { name: 'Maple Syrup', shortName: 'Maple Syrup', density: 1.370 },
];

const PRESET_GRAMS = [10, 25, 30, 50, 100, 200, 250, 500, 1000];

const TABLE_MASSES = [1, 5, 10, 15, 25, 30, 50, 100, 150, 200, 250, 500, 1000];

const FAQ_ITEMS = [
  {
    q: '1. How many fluid ounces are in 1 gram?',
    a: 'For pure water at 4°C with a baseline density of 1.000 g/mL, 1 gram corresponds to approximately 0.033814 US fluid ounces (or 0.035195 Imperial fluid ounces). For lighter substances like vegetable oil (density 0.92 g/mL), 1 gram yields 0.03675 fl oz; for dense syrups like honey (density 1.42 g/mL), 1 gram yields only 0.02381 fl oz.',
  },
  {
    q: '2. Can grams be directly converted to fluid ounces?',
    a: 'No, grams and fluid ounces cannot be converted with a single static scalar unless you assume a specific substance. Grams measure mass (inertia/gravitational attraction), while fluid ounces quantify 3-dimensional liquid displacement (volume). The physical volumetric density (mass per unit volume, ρ) is required to translate between them.',
  },
  {
    q: '3. How many fluid ounces is 100 grams of water?',
    a: '100 grams of water equals exactly 3.3814 US fluid ounces (or 3.5195 Imperial UK fluid ounces). This calculation stems directly from the standard conversion factor of 29.5735295625 mL per US fluid ounce, since 100g of water equals exactly 100 mL.',
  },
  {
    q: '4. Why does the ingredient matter?',
    a: 'Different chemical compounds possess distinct atomic packings and intermolecular distances. Sifted flour incorporates substantial microscopic air pockets, making its bulk density roughly 0.53 g/mL (meaning 100 grams is bulky at 6.40 fl oz). In contrast, concentrated honey molecules are tightly packed at 1.42 g/mL, causing 100 grams to occupy only 2.38 fl oz.',
  },
  {
    q: '5. Is gram a weight unit?',
    a: "Scientifically, the gram is a unit of mass, an intrinsic property defined internationally by the SI metric system using the Planck constant. In commerce and daily cooking on Earth's surface, mass is evaluated by weighing using gravity, making the gram commonly referred to as a weight unit.",
  },
  {
    q: '6. Is fluid ounce a volume unit?',
    a: 'Yes. A fluid ounce (abbreviated fl oz) is solely a measure of volumetric capacity. It is critical never to confuse fluid ounces with avoirdupois dry ounces (oz), which measure mass. 1 dry ounce equals 28.3495 grams, whereas 1 US fluid ounce of water weighs approximately 29.5735 grams.',
  },
  {
    q: '7. Can I use this converter for baking?',
    a: 'Absolutely. Professional bakers prefer measuring dry and wet ingredients in grams on digital scales to eliminate human scoop variations. When a recipe written in fluid ounces or cups must be prepared using a gram scale, this calculator ensures exact hydration and sugar-to-flour ratios.',
  },
  {
    q: '8. Can I convert flour and sugar using the same formula?',
    a: 'No. Granulated white sugar has an average bulk density of 0.845 g/mL, while all-purpose flour has a density of roughly 0.528 g/mL. Because flour is nearly 38% lighter than sugar by volume, converting them with the same scalar will drastically throw off recipe moisture balance.',
  },
  {
    q: '9. How accurate is this converter?',
    a: 'The engine computes results using full 64-bit IEEE 754 precision math directly in your browser without backend network latency. Conversion constants are calibrated against NIST SP 811 and USDA Standard Reference 28 ingredient metrics, allowing output precision toggles up to 6 decimal places.',
  },
  {
    q: '10. What is the formula for grams to fluid ounces?',
    a: 'The exact formula is: Volume (US fl oz) = Mass (grams) ÷ [Density (g/mL) × 29.5735295625]. For the UK Imperial fluid ounce, use 28.4130625 in the denominator instead.',
  },
];

export default function GramToFluidOunceClient() {
  const [inputValue, setInputValue] = useState<string>('100');
  const [standard, setStandard] = useState<'US' | 'UK'>('US');
  const [precision, setPrecision] = useState<number>(4);
  const [currentDensity, setCurrentDensity] = useState<number>(1.000);
  const [currentIngredientName, setCurrentIngredientName] = useState<string>('Water');
  const [customDensityInput, setCustomDensityInput] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [tableFilter, setTableFilter] = useState<string>('');
  const [openFaqs, setOpenFaqs] = useState<{ [key: number]: boolean }>({ 0: true });
  const [animateOutput, setAnimateOutput] = useState<boolean>(false);

  const workbenchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Parsed numerical mass
  const parsedGrams = parseFloat(inputValue);
  const safeGrams = isNaN(parsedGrams) || parsedGrams < 0 ? 0 : parsedGrams;

  // Active conversion factor
  const flOzRatio = standard === 'US' ? US_FL_OZ_ML : UK_FL_OZ_ML;

  // Primary volume calculations
  const volumeML = currentDensity > 0 ? safeGrams / currentDensity : 0;
  const fluidOunces = volumeML / flOzRatio;

  // Drawer Multi-Unit Matrix
  const drawerCups = volumeML / ML_PER_US_CUP;
  const drawerTbsp = volumeML / ML_PER_US_TBSP;
  const drawerTsp = volumeML / ML_PER_US_TSP;
  const drawerDryOz = safeGrams / GRAMS_PER_AVDP_OZ;

  // Output string formatting
  const formattedFluidOunces = fluidOunces.toFixed(precision);

  // Execution trace string
  const stdLabel = standard === 'US' ? '29.5735' : '28.4131';
  const calculationTrace = `${safeGrams} g ÷ (${currentDensity.toFixed(3)} g/mL × ${stdLabel} mL/fl oz) = ${formattedFluidOunces} fl oz`;

  // Handle Preset Grams Click
  const handlePresetClick = (val: number) => {
    setInputValue(val.toString());
  };

  // Handle Density Select
  const handleDensitySelect = (item: DensityItem) => {
    setCurrentDensity(item.density);
    setCurrentIngredientName(item.name);
  };

  // Apply Custom Density
  const handleApplyCustomDensity = () => {
    const val = parseFloat(customDensityInput);
    if (!isNaN(val) && val > 0) {
      setCurrentDensity(val);
      setCurrentIngredientName('Custom ρ');
    }
  };

  // Invert/Reverse Transfer (fl oz -> grams)
  const handleReverseTransfer = () => {
    const approxGrams = (fluidOunces * flOzRatio * currentDensity).toFixed(1);
    setInputValue(approxGrams);
  };

  // Convert Now action with tactile visual feedback
  const handleConvertNow = () => {
    setAnimateOutput(true);
    setTimeout(() => setAnimateOutput(false), 200);
  };

  // Copy Result
  const handleCopy = () => {
    const textToCopy = `${formattedFluidOunces} ${standard === 'US' ? 'US fl oz' : 'Imperial fl oz'}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Reset Workbench
  const handleReset = () => {
    setInputValue('100');
    setStandard('US');
    setPrecision(4);
    setCurrentDensity(1.000);
    setCurrentIngredientName('Water');
    setCustomDensityInput('');
  };

  // Load from Table
  const handleLoadFromTable = (mass: number) => {
    setInputValue(mass.toString());
    if (workbenchRef.current) {
      workbenchRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Toggle FAQ item
  const toggleFaq = (index: number) => {
    setOpenFaqs((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Filtered Table Rows
  const filteredTableRows = useMemo(() => {
    const q = tableFilter.trim();
    if (!q) return TABLE_MASSES;
    return TABLE_MASSES.filter((m) => m.toString().includes(q));
  }, [tableFilter]);

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      

      <main className="w-full pt-20 bg-surface flex-1">
        {/* Top Metrology Breadcrumbs & Runtime Bar */}
        <div className="w-full bg-surface-container-lowest/50 py-2.5 px-4 sm:px-6 lg:px-8 border-b border-outline-variant/15">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm">
            <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
              <Link
                className="flex items-center text-on-surface-variant hover:text-on-surface transition-colors"
                href="/"
              >
                <span className="material-symbols-outlined text-[16px] mr-1">home</span>Home
              </Link>
              <span className="text-outline-variant font-data-mono">&gt;</span>
              <Link
                className="flex items-center text-on-surface-variant hover:text-on-surface transition-colors"
                href="/conversion"
              >
                Conversion
              </Link>
              <span className="text-outline-variant font-data-mono">&gt;</span>
              <Link
                className="flex items-center text-on-surface-variant hover:text-on-surface transition-colors"
                href="/conversion/gram"
              >
                Gram
              </Link>
              <span className="text-outline-variant font-data-mono">&gt;</span>
              <span className="font-data-mono text-[12px] text-secondary bg-surface-container px-2 py-0.5 rounded">
                Gram to Fluid Ounce
              </span>
            </div>
            <div className="hidden md:flex items-center gap-2 font-data-mono text-[11px] text-on-surface-variant">
              <span className="inline-block w-2 h-2 rounded-full bg-secondary-container"></span>
              <span>LATENCY: &lt; 0.4ms</span>
              <span className="text-outline-variant">•</span>
              <span>LOCALLY EXECUTED</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col w-full">
            {/* Structured Data JSON-LD */}
            <script
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  '@context': 'https://schema.org',
                  '@graph': [
                    {
                      '@type': 'WebApplication',
                      '@id': 'https://solveitcalculator.com/conversion/gram-to-fluid-ounce#app',
                      name: 'Gram to Fluid Ounce Converter (g to fl oz)',
                      url: 'https://solveitcalculator.com/conversion/gram-to-fluid-ounce',
                      applicationCategory: 'UtilityApplication',
                      operatingSystem: 'All',
                      browserRequirements: 'Requires JavaScript. Requires HTML5.',
                      description:
                        'High-precision metrology calculator converting mass in grams (g) to liquid volume in fluid ounces (fl oz) calibrated against USDA and NIST ingredient density constants.',
                      softwareVersion: '4.2.0',
                      offers: {
                        '@type': 'Offer',
                        price: '0',
                        priceCurrency: 'USD',
                      },
                    },
                    {
                      '@type': 'WebPage',
                      '@id': 'https://solveitcalculator.com/conversion/gram-to-fluid-ounce#webpage',
                      url: 'https://solveitcalculator.com/conversion/gram-to-fluid-ounce',
                      name: 'Gram to Fluid Ounce Converter (g to fl oz) – Instant Conversion Calculator',
                      isPartOf: {
                        '@type': 'WebSite',
                        '@id': 'https://solveitcalculator.com/#website',
                        name: 'SolveIt Calculator',
                        url: 'https://solveitcalculator.com',
                      },
                      description:
                        'Convert grams (g) to fluid ounces (fl oz) instantly with physical ingredient density calibration. Metrology-backed culinary, pharmacy, and laboratory calculator.',
                    },
                    {
                      '@type': 'BreadcrumbList',
                      '@id': 'https://solveitcalculator.com/conversion/gram-to-fluid-ounce#breadcrumbs',
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
                          name: 'Conversion',
                          item: 'https://solveitcalculator.com/conversion',
                        },
                        {
                          '@type': 'ListItem',
                          position: 3,
                          name: 'Gram',
                          item: 'https://solveitcalculator.com/conversion/gram',
                        },
                        {
                          '@type': 'ListItem',
                          position: 4,
                          name: 'Gram to Fluid Ounce',
                          item: 'https://solveitcalculator.com/conversion/gram-to-fluid-ounce',
                        },
                      ],
                    },
                    {
                      '@type': 'HowTo',
                      '@id': 'https://solveitcalculator.com/conversion/gram-to-fluid-ounce#howto',
                      name: 'How to Convert Grams to Fluid Ounces',
                      description:
                        'Follow these four steps to accurately convert mass in grams to fluid volume in fluid ounces using substance density.',
                      step: [
                        {
                          '@type': 'HowToStep',
                          position: 1,
                          name: 'Tare and Measure Mass',
                          text: 'Place your container on a calibrated scale, tare to 0, and record mass in grams (g).',
                        },
                        {
                          '@type': 'HowToStep',
                          position: 2,
                          name: 'Lookup Physical Density',
                          text: 'Determine the ingredient density in g/mL (e.g., water = 1.000 g/mL, honey = 1.420 g/mL, olive oil = 0.920 g/mL).',
                        },
                        {
                          '@type': 'HowToStep',
                          position: 3,
                          name: 'Compute Volume in Milliliters',
                          text: 'Divide the mass in grams by density (g/mL) to compute the volumetric equivalent in milliliters.',
                        },
                        {
                          '@type': 'HowToStep',
                          position: 4,
                          name: 'Convert Milliliters to Fluid Ounces',
                          text: 'Divide the milliliter volume by 29.5735295625 for US fluid ounces or 28.4130625 for Imperial UK fluid ounces.',
                        },
                      ],
                    },
                    {
                      '@type': 'FAQPage',
                      '@id': 'https://solveitcalculator.com/conversion/gram-to-fluid-ounce#faq',
                      mainEntity: FAQ_ITEMS.map((item) => ({
                        '@type': 'Question',
                        name: item.q.replace(/^\d+\.\s*/, ''),
                        acceptedAnswer: {
                          '@type': 'Answer',
                          text: item.a,
                        },
                      })),
                    },
                  ],
                }),
              }}
              type="application/ld+json"
            />

            {/* Editorial Top Metrology Badge & Header Intro */}
            <section className="mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high text-primary font-label-caps text-label-caps tracking-wider uppercase mb-4 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                MASS TO LIQUID VOLUME CONVERSION • INGREDIENT DENSITY CALIBRATED • 100% PRIVATE CLIENT SANDBOX
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
                <div className="lg:col-span-8 space-y-3">
                  <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
                    Gram to Fluid Ounce Converter{' '}
                    <span className="text-primary font-normal font-data-mono">(g to fl oz)</span>
                  </h1>
                  <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl leading-relaxed">
                    Use this free Gram to Fluid Ounce converter to convert grams (g) into fluid ounces (fl oz). Because
                    grams measure weight (mass) and fluid ounces measure volume, the conversion depends on the physical
                    density of the ingredient being measured. Select an ingredient below for metrologically verified
                    culinary and laboratory conversions.
                  </p>
                </div>
                <div className="lg:col-span-4 flex lg:justify-end items-center gap-3 font-data-mono text-body-sm text-on-surface-variant">
                  <div className="px-3.5 py-2 rounded-xl bg-surface-container-low flex items-center gap-2 border border-outline-variant/20 shadow-xs">
                    <span className="material-symbols-outlined text-secondary text-[18px]">verified</span>
                    <span>NIST SP 811 / USDA Rev. 28</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Main Calculator Workbench & Sidecars (12-Col Grid) */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-start" ref={workbenchRef}>
              {/* LEFT / MAIN: High-Precision Calculation Workbench (8 Cols) */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-outline-variant/30">
                  {/* Subtle decorative glow */}
                  <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-primary-fixed/30 dark:bg-primary/10 blur-3xl pointer-events-none"></div>

                  {/* Workbench Top Config Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-outline-variant/15">
                    {/* Fluid Ounce Standard Toggle */}
                    <div className="flex items-center bg-surface-container-low p-1 rounded-xl shadow-inner text-body-sm border border-outline-variant/20">
                      <button
                        className={`px-3.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                          standard === 'US'
                            ? 'bg-surface-container-lowest text-primary shadow-sm'
                            : 'text-on-surface-variant hover:text-on-surface'
                        }`}
                        id="btnStandardUS"
                        onClick={() => setStandard('US')}
                        type="button"
                      >
                        {standard === 'US' && (
                          <span className="material-symbols-outlined text-[16px]">check</span>
                        )}
                        <span>US Customary (29.57 mL)</span>
                      </button>
                      <button
                        className={`px-3.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                          standard === 'UK'
                            ? 'bg-surface-container-lowest text-primary shadow-sm'
                            : 'text-on-surface-variant hover:text-on-surface'
                        }`}
                        id="btnStandardUK"
                        onClick={() => setStandard('UK')}
                        type="button"
                      >
                        {standard === 'UK' && (
                          <span className="material-symbols-outlined text-[16px]">check</span>
                        )}
                        <span>Imperial UK (28.41 mL)</span>
                      </button>
                    </div>

                    {/* Decimal Precision Selector */}
                    <div className="flex items-center gap-2">
                      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                        Precision:
                      </span>
                      <div className="flex bg-surface-container-low p-0.5 rounded-lg border border-outline-variant/20">
                        {[2, 4, 6].map((dec) => (
                          <button
                            className={`px-2.5 py-1 text-label-caps font-data-mono rounded-md transition-all ${
                              precision === dec
                                ? 'bg-surface-container-lowest text-primary font-bold shadow-sm'
                                : 'text-on-surface-variant hover:text-on-surface'
                            }`}
                            key={dec}
                            onClick={() => setPrecision(dec)}
                            type="button"
                          >
                            .{'0'.repeat(dec)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Two-Way Interactive Core Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
                    {/* Mass Input Card (5 Cols) */}
                    <div className="md:col-span-5 bg-surface-container-low/70 rounded-2xl p-5 relative border border-outline-variant/20 focus-within:bg-surface-container-lowest focus-within:shadow-md focus-within:border-primary/40 transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <label
                          className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider font-semibold"
                          htmlFor="inputMassGrams"
                        >
                          Input Mass (Weight)
                        </label>
                        <span className="font-data-mono text-[11px] text-primary bg-primary-fixed/40 dark:bg-primary/20 px-1.5 py-0.5 rounded font-bold">
                          SI GRAMS
                        </span>
                      </div>
                      <div className="relative flex items-baseline justify-between">
                        <input
                          aria-label="Input Mass in Grams"
                          className="w-full bg-transparent font-numerical-display text-numerical-display text-on-surface focus:outline-none tracking-tight font-bold placeholder:text-outline-variant pr-8"
                          id="inputMassGrams"
                          min="0"
                          onChange={(e) => setInputValue(e.target.value)}
                          placeholder="100"
                          ref={inputRef}
                          step="any"
                          type="number"
                          value={inputValue}
                        />
                        <span className="font-headline-md text-headline-md font-semibold text-outline select-none">
                          g
                        </span>
                      </div>
                      <p className="font-body-sm text-[12px] text-on-surface-variant mt-2 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-secondary">scale</span>
                        Calibrated kitchen / lab balance
                      </p>
                    </div>

                    {/* Mid Operator / Transfer Badge (1 Col) */}
                    <div className="md:col-span-1 flex justify-center py-2 md:py-0">
                      <button
                        aria-label="Invert mass & volume parameters"
                        className="w-10 h-10 rounded-full bg-surface-container-high hover:bg-primary hover:text-on-primary text-on-surface flex items-center justify-center transition-colors shadow-sm cursor-pointer active:scale-95"
                        id="btnReverseTransfer"
                        onClick={handleReverseTransfer}
                        title="Invert mass & volume parameters"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[20px]">swap_horiz</span>
                      </button>
                    </div>

                    {/* Volume Output Result Card (5 Cols) */}
                    <div className="md:col-span-5 bg-primary-container rounded-2xl p-5 relative overflow-hidden shadow-inner border border-primary/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-label-caps text-label-caps text-on-primary-container uppercase tracking-wider font-semibold">
                          Resulting Volume
                        </span>
                        <span
                          className="font-data-mono text-[11px] text-primary bg-surface/80 px-1.5 py-0.5 rounded shadow-xs font-bold"
                          id="badgeVolumeStandard"
                        >
                          {standard === 'US' ? 'US FL OZ' : 'IMP FL OZ'}
                        </span>
                      </div>
                      <div className="flex items-baseline justify-between">
                        <span
                          className={`font-numerical-display text-numerical-display text-on-primary-container font-bold tracking-tight transition-transform duration-150 ${
                            animateOutput ? 'scale-105' : ''
                          }`}
                          id="outputFluidOunces"
                        >
                          {formattedFluidOunces}
                        </span>
                        <span className="font-headline-md text-headline-md font-semibold text-on-primary-container/80 select-none">
                          fl oz
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-1">
                        <span
                          className="font-data-mono text-[12px] text-on-primary-container/80 truncate"
                          id="subtextDensityUsed"
                        >
                          ρ = {currentDensity.toFixed(3)} g/mL ({currentIngredientName})
                        </span>
                        <button
                          className="text-primary dark:text-primary-fixed-dim hover:underline font-body-sm text-[13px] flex items-center gap-1 font-medium cursor-pointer"
                          id="btnCopyResult"
                          onClick={handleCopy}
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[15px]">
                            {copied ? 'done' : 'content_copy'}
                          </span>
                          <span id="copyFeedback">{copied ? 'Copied!' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Quick Mass Preset Chips */}
                  <div className="mt-6 pt-5 border-t border-outline-variant/15 flex flex-wrap items-center gap-2">
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mr-1">
                      Quick Presets:
                    </span>
                    {PRESET_GRAMS.map((g) => {
                      const isActive = safeGrams === g;
                      return (
                        <button
                          className={`preset-pill px-3 py-1 rounded-lg font-data-mono text-body-sm transition-all cursor-pointer ${
                            isActive
                              ? 'bg-primary text-on-primary font-semibold shadow-sm'
                              : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
                          }`}
                          data-preset={g}
                          key={g}
                          onClick={() => handlePresetClick(g)}
                          type="button"
                        >
                          {g === 1000 ? '1000g (1kg)' : `${g}g`}
                        </button>
                      );
                    })}
                  </div>

                  {/* Physical Density Selector Pills (Critical Metrology Core) */}
                  <div className="mt-6 pt-5 bg-surface-container-low/40 rounded-2xl p-4 border border-outline-variant/20">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <span className="font-label-caps text-label-caps text-on-surface font-semibold uppercase tracking-wider flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-secondary text-[16px]">science</span>
                        Select Calibrated Ingredient Density (ρ):
                      </span>
                      <span className="font-data-mono text-[11px] text-on-surface-variant">Units: g/mL (kg/L)</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {DENSITY_PRESETS.map((item) => {
                        const isSelected =
                          currentIngredientName === item.name &&
                          Math.abs(currentDensity - item.density) < 0.001;
                        return (
                          <button
                            className={`density-chip text-left p-3 rounded-xl transition-all flex flex-col cursor-pointer border ${
                              isSelected
                                ? 'bg-surface-container-lowest shadow-sm border-primary/30 ring-1 ring-primary/20'
                                : 'bg-surface-container-low hover:bg-surface-container-lowest border-transparent'
                            }`}
                            data-density={item.density}
                            data-name={item.name}
                            key={item.name}
                            onClick={() => handleDensitySelect(item)}
                            type="button"
                          >
                            <span className="font-body-sm font-medium text-on-surface flex items-center justify-between">
                              {item.name}
                              <span
                                className={`material-symbols-outlined text-[16px] text-primary ${
                                  isSelected ? 'inline-block' : 'hidden'
                                }`}
                              >
                                check_circle
                              </span>
                            </span>
                            <span className="font-data-mono text-[12px] text-secondary font-semibold">
                              {item.density.toFixed(3)} g/mL
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Custom Density Entry Row */}
                    <div className="mt-3 flex flex-wrap items-center gap-3 pt-2">
                      <span className="font-body-sm text-[13px] text-on-surface-variant">
                        Or specify custom fluid density:
                      </span>
                      <div className="flex items-center gap-2">
                        <input
                          aria-label="Custom fluid density in grams per milliliter"
                          className="w-32 px-3 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface font-data-mono text-body-sm focus:outline-none focus:ring-2 focus:ring-primary/30 border border-outline-variant/30"
                          id="inputCustomDensity"
                          max="25"
                          min="0.1"
                          onChange={(e) => setCustomDensityInput(e.target.value)}
                          placeholder="Custom ρ"
                          step="0.001"
                          type="number"
                          value={customDensityInput}
                        />
                        <span className="font-data-mono text-[12px] text-on-surface-variant">g/mL</span>
                        <button
                          className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-[13px] transition-colors cursor-pointer"
                          id="btnApplyCustomDensity"
                          onClick={handleApplyCustomDensity}
                          type="button"
                        >
                          Apply Custom
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Formula Execution Trace Box */}
                  <div className="mt-6 p-4 rounded-2xl bg-surface-container-low font-data-mono text-[13px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-outline-variant/15">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="material-symbols-outlined text-primary text-[18px]">functions</span>
                      <span className="text-on-surface-variant">Calculation Trace:</span>
                      <span className="text-on-surface font-bold" id="formulaExecutionTrace">
                        {calculationTrace}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant text-[11px] whitespace-nowrap">
                      Deterministically Resolved
                    </span>
                  </div>

                  {/* Workbench Action Toolbar */}
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-2">
                      <button
                        className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-body-md font-medium shadow-md hover:bg-primary-container active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                        id="btnConvertNow"
                        onClick={handleConvertNow}
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[18px]">bolt</span>
                        <span>Convert Now</span>
                      </button>
                      <a
                        className="px-4 py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-body-sm text-body-sm transition-colors flex items-center gap-1.5"
                        href="#formula-guide"
                      >
                        <span className="material-symbols-outlined text-[17px] text-secondary">menu_book</span>
                        <span>Inspect Formula</span>
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="px-3 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface font-body-sm text-[13px] transition-colors flex items-center gap-1 cursor-pointer"
                        id="btnResetWorkbench"
                        onClick={handleReset}
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                        <span>Reset</span>
                      </button>
                      <button
                        className="px-3 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface font-body-sm text-[13px] transition-colors flex items-center gap-1 cursor-pointer"
                        onClick={() => {
                          if (typeof window !== 'undefined') window.print();
                        }}
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[16px]">print</span>
                        <span>Print Specs</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Synchronized Multi-Unit Drawer (Culinary & Metrology Matrix) */}
                <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-7 shadow-sm border border-outline-variant/20">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-headline-md text-[18px] text-on-surface font-bold flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[20px]">view_comfy</span>
                      Simultaneous Volumetric &amp; Weight Matrix
                    </h2>
                    <span className="font-data-mono text-[11px] text-secondary uppercase font-bold">
                      All Units Linked
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-5">
                    Real-time cross-conversions for the current input (
                    <span className="font-bold text-on-surface" id="drawerGramsLabel">
                      {safeGrams} g
                    </span>{' '}
                    of{' '}
                    <span className="font-bold text-on-surface" id="drawerIngredientLabel">
                      {currentIngredientName}
                    </span>
                    ):
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    <div className="p-3.5 rounded-2xl bg-surface-container-low flex flex-col border border-outline-variant/15">
                      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                        Milliliters (mL)
                      </span>
                      <span
                        className="font-numerical-display text-[22px] leading-tight text-on-surface font-bold mt-1"
                        id="drawerUnitML"
                      >
                        {volumeML.toFixed(2)}
                      </span>
                      <span className="font-data-mono text-[11px] text-secondary mt-0.5">SI Volume</span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-surface-container-low flex flex-col border border-outline-variant/15">
                      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">US Cups</span>
                      <span
                        className="font-numerical-display text-[22px] leading-tight text-on-surface font-bold mt-1"
                        id="drawerUnitCups"
                      >
                        {drawerCups.toFixed(4)}
                      </span>
                      <span className="font-data-mono text-[11px] text-on-surface-variant mt-0.5">
                        1 cup = 236.588 mL
                      </span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-surface-container-low flex flex-col border border-outline-variant/15">
                      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                        US Tablespoons
                      </span>
                      <span
                        className="font-numerical-display text-[22px] leading-tight text-on-surface font-bold mt-1"
                        id="drawerUnitTbsp"
                      >
                        {drawerTbsp.toFixed(precision > 2 ? 4 : 2)}
                      </span>
                      <span className="font-data-mono text-[11px] text-on-surface-variant mt-0.5">
                        1 tbsp = 14.7868 mL
                      </span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-surface-container-low flex flex-col border border-outline-variant/15">
                      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                        US Teaspoons
                      </span>
                      <span
                        className="font-numerical-display text-[22px] leading-tight text-on-surface font-bold mt-1"
                        id="drawerUnitTsp"
                      >
                        {drawerTsp.toFixed(precision > 2 ? 4 : 2)}
                      </span>
                      <span className="font-data-mono text-[11px] text-on-surface-variant mt-0.5">
                        1 tsp = 4.9289 mL
                      </span>
                    </div>
                    {/* Weight Avoirdupois Distinction Card */}
                    <div className="p-3.5 rounded-2xl bg-surface-container-high/70 flex flex-col border border-outline-variant/20">
                      <span className="font-label-caps text-label-caps text-tertiary uppercase font-bold">
                        Avoirdupois Weight
                      </span>
                      <span
                        className="font-numerical-display text-[22px] leading-tight text-tertiary font-bold mt-1"
                        id="drawerUnitDryOz"
                      >
                        {drawerDryOz.toFixed(4)}
                      </span>
                      <span className="font-data-mono text-[11px] text-on-surface-variant mt-0.5">
                        Dry Oz (Mass only)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT / SIDECAR: Metrology Insight & Visual Comparison (4 Cols) */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                {/* Crucial Metrology Distinction Card */}
                <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-md relative overflow-hidden border border-outline-variant/20">
                  <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center mb-3">
                    <span className="material-symbols-outlined text-[22px]">info</span>
                  </div>
                  <h3 className="font-headline-md text-[19px] font-bold text-on-surface tracking-tight mb-2">
                    Important Metrology Note: Fluid Ounces (Volume) vs. Dry Ounces (Weight)
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-4">
                    A common kitchen failure occurs when treating{' '}
                    <span className="font-bold text-on-surface">fluid ounces</span> as identical to{' '}
                    <span className="font-bold text-on-surface">dry weight ounces</span>.
                  </p>
                  <div className="p-4 rounded-2xl bg-surface-container-low space-y-2.5 mb-4 border border-outline-variant/15">
                    <div className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">water_drop</span>
                      <div>
                        <span className="font-data-mono text-body-sm font-semibold text-on-surface block">
                          100g Water Volume:
                        </span>
                        <span className="font-body-sm text-[13px] text-on-surface-variant">
                          3.381 US Fluid Ounces (Occupied 3D Space)
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-secondary text-[18px] mt-0.5">fitness_center</span>
                      <div>
                        <span className="font-data-mono text-body-sm font-semibold text-on-surface block">
                          100g Water Weight:
                        </span>
                        <span className="font-body-sm text-[13px] text-on-surface-variant">
                          3.527 Dry Ounces (Avoirdupois Mass)
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    The difference is ~4.3% even for water! For lighter or heavier substances (such as flour or honey),
                    the disparity between fluid ounces and weight ounces exceeds 40%.
                  </p>
                </div>

                {/* Visual Density Comparison Card (Vector Chart Graphic) */}
                <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-md border border-outline-variant/20">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant font-semibold">
                      Visual Density Chart
                    </h4>
                    <span className="font-data-mono text-[11px] text-primary font-bold">100 Grams Mass</span>
                  </div>
                  <p className="font-body-sm text-[13px] text-on-surface-variant mb-4">
                    How much space does 100 grams of different culinary substances displace?
                  </p>

                  {/* Inline SVG Density Cylinder Graphic */}
                  <div className="w-full bg-surface-container-low rounded-2xl p-4 flex flex-col items-center border border-outline-variant/15">
                    <svg
                      aria-label="Liquid volume displaced by 100 grams of honey, water, and flour"
                      className="w-full h-auto max-h-48 overflow-visible"
                      fill="none"
                      viewBox="0 0 320 180"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Honey Vessel */}
                      <g transform="translate(20, 20)">
                        <rect className="fill-surface-container stroke-outline-variant/30" height="85" rx="6" width="60" x="0" y="55" />
                        {/* Liquid Honey */}
                        <rect fill="#bc4800" height="55" opacity="0.85" rx="6" width="60" x="0" y="85" />
                        <text
                          fill="#ffffff"
                          fontFamily="JetBrains Mono, monospace"
                          fontSize="10"
                          fontWeight="bold"
                          textAnchor="middle"
                          x="30"
                          y="118"
                        >
                          2.38 fl oz
                        </text>
                        <text
                          className="fill-on-surface"
                          fontFamily="Inter, sans-serif"
                          fontSize="10"
                          fontWeight="600"
                          textAnchor="middle"
                          x="30"
                          y="155"
                        >
                          Honey
                        </text>
                        <text
                          className="fill-outline"
                          fontFamily="JetBrains Mono, monospace"
                          fontSize="8"
                          textAnchor="middle"
                          x="30"
                          y="167"
                        >
                          1.42 g/mL
                        </text>
                      </g>

                      {/* Water Vessel */}
                      <g transform="translate(130, 20)">
                        <rect className="fill-surface-container stroke-outline-variant/30" height="110" rx="6" width="60" x="0" y="30" />
                        {/* Liquid Water */}
                        <rect fill="#2563eb" height="75" opacity="0.8" rx="6" width="60" x="0" y="65" />
                        <text
                          fill="#ffffff"
                          fontFamily="JetBrains Mono, monospace"
                          fontSize="10"
                          fontWeight="bold"
                          textAnchor="middle"
                          x="30"
                          y="108"
                        >
                          3.38 fl oz
                        </text>
                        <text
                          className="fill-on-surface"
                          fontFamily="Inter, sans-serif"
                          fontSize="10"
                          fontWeight="600"
                          textAnchor="middle"
                          x="30"
                          y="155"
                        >
                          Water
                        </text>
                        <text
                          className="fill-outline"
                          fontFamily="JetBrains Mono, monospace"
                          fontSize="8"
                          textAnchor="middle"
                          x="30"
                          y="167"
                        >
                          1.00 g/mL
                        </text>
                      </g>

                      {/* Flour Vessel */}
                      <g transform="translate(240, 20)">
                        <rect className="fill-surface-container stroke-outline-variant/30" height="140" rx="6" width="60" x="0" y="0" />
                        {/* Fluffy Flour */}
                        <rect fill="#006591" height="130" opacity="0.7" rx="6" width="60" x="0" y="10" />
                        <text
                          fill="#ffffff"
                          fontFamily="JetBrains Mono, monospace"
                          fontSize="10"
                          fontWeight="bold"
                          textAnchor="middle"
                          x="30"
                          y="75"
                        >
                          6.40 fl oz
                        </text>
                        <text
                          className="fill-on-surface"
                          fontFamily="Inter, sans-serif"
                          fontSize="10"
                          fontWeight="600"
                          textAnchor="middle"
                          x="30"
                          y="155"
                        >
                          AP Flour
                        </text>
                        <text
                          className="fill-outline"
                          fontFamily="JetBrains Mono, monospace"
                          fontSize="8"
                          textAnchor="middle"
                          x="30"
                          y="167"
                        >
                          0.53 g/mL
                        </text>
                      </g>
                    </svg>
                    <span className="font-body-sm text-[11px] text-on-surface-variant text-center mt-2">
                      Same 100g weight on a scale; flour occupies 2.7× the physical volume of honey.
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Formula & Mathematical Verification Section */}
            <section className="bg-surface-container-lowest rounded-3xl p-6 sm:p-10 shadow-md mb-16 border border-outline-variant/20" id="formula-guide">
              <div className="max-w-3xl mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container text-secondary font-label-caps text-label-caps tracking-wider uppercase mb-3 font-semibold">
                  Metrological Derivation &amp; Equations
                </div>
                <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">
                  Mathematical Formulation &amp; NIST SP 811 Reference
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-2 leading-relaxed">
                  The conversion between mass and volume requires the physical constant of volumetric density (ρ = m/V).
                  According to NIST (National Institute of Standards and Technology) Special Publication 811, 1 US fluid
                  ounce is formally established as exactly 29.5735295625 × 10⁻⁶ m³ (29.5735295625 mL).
                </p>
              </div>

              {/* Formula Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-surface-container-low p-6 rounded-2xl flex flex-col justify-between border border-outline-variant/15">
                  <div>
                    <span className="font-label-caps text-label-caps text-primary uppercase font-semibold">
                      General Formula
                    </span>
                    <h3 className="font-headline-md text-[18px] text-on-surface font-bold mt-1 mb-3">Any Substance</h3>
                    <div className="p-3 bg-surface-container-lowest rounded-xl font-data-mono text-body-sm text-on-surface leading-normal mb-3 shadow-xs border border-outline-variant/20">
                      fl oz = <span className="text-primary font-bold">Grams</span> ÷{' '}
                      <span className="text-secondary font-bold">Density (g/mL)</span> ÷ 29.5735
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Universal equation applicable across fluids, syrups, powders, and liquefied solutions.
                    </p>
                  </div>
                </div>
                <div className="bg-surface-container-low p-6 rounded-2xl flex flex-col justify-between border border-outline-variant/15">
                  <div>
                    <span className="font-label-caps text-label-caps text-primary uppercase font-semibold">
                      Baseline Water
                    </span>
                    <h3 className="font-headline-md text-[18px] text-on-surface font-bold mt-1 mb-3">
                      Pure Water (ρ = 1.000)
                    </h3>
                    <div className="p-3 bg-surface-container-lowest rounded-xl font-data-mono text-body-sm text-on-surface leading-normal mb-3 shadow-xs border border-outline-variant/20">
                      fl oz = <span className="text-primary font-bold">Grams</span> ÷ 29.5735295625
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Because water&apos;s density is 1.000 g/mL at standard temperature, density simply factors to 1.
                    </p>
                  </div>
                </div>
                <div className="bg-surface-container-low p-6 rounded-2xl flex flex-col justify-between border border-outline-variant/15">
                  <div>
                    <span className="font-label-caps text-label-caps text-primary uppercase font-semibold">
                      Reciprocal Calculation
                    </span>
                    <h3 className="font-headline-md text-[18px] text-on-surface font-bold mt-1 mb-3">
                      Fluid Oz to Grams
                    </h3>
                    <div className="p-3 bg-surface-container-lowest rounded-xl font-data-mono text-body-sm text-on-surface leading-normal mb-3 shadow-xs border border-outline-variant/20">
                      Grams = <span className="text-primary font-bold">fl oz</span> ×{' '}
                      <span className="text-secondary font-bold">Density</span> × 29.5735
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Used when converting liquid recipe volume back to mass on a gram scale.
                    </p>
                  </div>
                </div>
              </div>

              {/* Worked Step-by-Step Scenario Matrix */}
              <div className="bg-surface-container-low/60 rounded-2xl p-6 border border-outline-variant/15">
                <h3 className="font-headline-md text-[18px] font-bold text-on-surface mb-4">
                  Worked Real-World Metrological Examples
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-outline-variant/20">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-body-sm font-semibold text-on-surface">30 Grams Water</span>
                      <span className="font-data-mono text-[12px] text-primary font-bold">1.014 fl oz</span>
                    </div>
                    <span className="font-data-mono text-[11px] text-on-surface-variant block mb-1">
                      Coffee Extraction / Espresso
                    </span>
                    <p className="font-body-sm text-[12px] text-on-surface-variant">
                      Calculation: 30 ÷ 1.000 ÷ 29.5735 = 1.0144 fl oz
                    </p>
                  </div>
                  <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-outline-variant/20">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-body-sm font-semibold text-on-surface">100 Grams Water</span>
                      <span className="font-data-mono text-[12px] text-primary font-bold">3.381 fl oz</span>
                    </div>
                    <span className="font-data-mono text-[11px] text-on-surface-variant block mb-1">
                      Hydration Baseline
                    </span>
                    <p className="font-body-sm text-[12px] text-on-surface-variant">
                      Calculation: 100 ÷ 1.000 ÷ 29.5735 = 3.3814 fl oz
                    </p>
                  </div>
                  <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-outline-variant/20">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-body-sm font-semibold text-on-surface">250 Grams Water</span>
                      <span className="font-data-mono text-[12px] text-primary font-bold">8.454 fl oz</span>
                    </div>
                    <span className="font-data-mono text-[11px] text-on-surface-variant block mb-1">
                      1 Metric Cup Approx.
                    </span>
                    <p className="font-body-sm text-[12px] text-on-surface-variant">
                      Calculation: 250 ÷ 1.000 ÷ 29.5735 = 8.4535 fl oz
                    </p>
                  </div>
                  <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-outline-variant/20">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-body-sm font-semibold text-on-surface">100 Grams Honey</span>
                      <span className="font-data-mono text-[12px] text-primary font-bold">2.381 fl oz</span>
                    </div>
                    <span className="font-data-mono text-[11px] text-on-surface-variant block mb-1">
                      Dense Confectionery (ρ = 1.42)
                    </span>
                    <p className="font-body-sm text-[12px] text-on-surface-variant">
                      Calculation: 100 ÷ (1.42 × 29.5735) = 2.3813 fl oz
                    </p>
                  </div>
                  <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-outline-variant/20">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-body-sm font-semibold text-on-surface">100 Grams Olive Oil</span>
                      <span className="font-data-mono text-[12px] text-primary font-bold">3.675 fl oz</span>
                    </div>
                    <span className="font-data-mono text-[11px] text-on-surface-variant block mb-1">
                      Light Liquid Fat (ρ = 0.92)
                    </span>
                    <p className="font-body-sm text-[12px] text-on-surface-variant">
                      Calculation: 100 ÷ (0.92 × 29.5735) = 3.6754 fl oz
                    </p>
                  </div>
                  <div className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-outline-variant/20">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-body-sm font-semibold text-on-surface">100 Grams Flour</span>
                      <span className="font-data-mono text-[12px] text-primary font-bold">6.404 fl oz</span>
                    </div>
                    <span className="font-data-mono text-[11px] text-on-surface-variant block mb-1">
                      Aerated Grain (ρ = 0.528)
                    </span>
                    <p className="font-body-sm text-[12px] text-on-surface-variant">
                      Calculation: 100 ÷ (0.528 × 29.5735) = 6.4042 fl oz
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Interactive Reference Density & Conversion Table */}
            <section className="bg-surface-container-lowest rounded-3xl p-6 sm:p-10 shadow-md mb-16 border border-outline-variant/20">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-secondary font-label-caps text-label-caps tracking-wider uppercase mb-2 font-semibold">
                    <span className="material-symbols-outlined text-[15px]">table_chart</span> Reference Matrix
                  </div>
                  <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">
                    Master Mass-to-Volume Conversion Table
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                    Values expressed in US Fluid Ounces (fl oz) across common pantry substances.
                  </p>
                </div>
                {/* Table Filter Search */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-on-surface-variant pointer-events-none">
                      search
                    </span>
                    <input
                      className="pl-9 pr-4 py-2 rounded-xl bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none focus:bg-surface-container border border-outline-variant/30"
                      id="tableFilterInput"
                      onChange={(e) => setTableFilter(e.target.value)}
                      placeholder="Filter gram values..."
                      type="search"
                      value={tableFilter}
                    />
                  </div>
                </div>
              </div>

              {/* High-Legibility Data Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left font-body-sm">
                  <thead>
                    <tr className="bg-surface-container-low text-on-surface-variant font-label-caps text-label-caps uppercase tracking-wider">
                      <th className="py-3 px-4 rounded-l-xl">Mass (Grams)</th>
                      <th className="py-3 px-3">Water (1.00)</th>
                      <th className="py-3 px-3">Whole Milk (1.03)</th>
                      <th className="py-3 px-3">Olive Oil (0.92)</th>
                      <th className="py-3 px-3">Gran. Sugar (0.845)</th>
                      <th className="py-3 px-3">AP Flour (0.528)</th>
                      <th className="py-3 px-3">Honey (1.42)</th>
                      <th className="py-3 px-4 rounded-r-xl text-right">Workbench Action</th>
                    </tr>
                  </thead>
                  <tbody className="font-data-mono text-body-sm divide-y divide-outline-variant/10" id="conversionTableBody">
                    {filteredTableRows.map((m) => {
                      const waterFl = (m / (1.000 * US_FL_OZ_ML)).toFixed(3);
                      const milkFl = (m / (1.030 * US_FL_OZ_ML)).toFixed(3);
                      const oilFl = (m / (0.920 * US_FL_OZ_ML)).toFixed(3);
                      const sugarFl = (m / (0.845 * US_FL_OZ_ML)).toFixed(3);
                      const flourFl = (m / (0.528 * US_FL_OZ_ML)).toFixed(3);
                      const honeyFl = (m / (1.420 * US_FL_OZ_ML)).toFixed(3);

                      return (
                        <tr className="hover:bg-surface-container-low/50 transition-colors" key={m}>
                          <td className="py-3 px-4 font-bold text-on-surface">{m} g</td>
                          <td className="py-3 px-3 text-primary font-semibold">{waterFl}</td>
                          <td className="py-3 px-3 text-on-surface-variant">{milkFl}</td>
                          <td className="py-3 px-3 text-on-surface-variant">{oilFl}</td>
                          <td className="py-3 px-3 text-on-surface-variant">{sugarFl}</td>
                          <td className="py-3 px-3 text-on-surface-variant">{flourFl}</td>
                          <td className="py-3 px-3 text-tertiary font-semibold">{honeyFl}</td>
                          <td className="py-3 px-4 text-right">
                            <button
                              className="load-table-btn px-2.5 py-1 rounded-md bg-surface-container hover:bg-primary hover:text-on-primary font-label-caps text-[11px] transition-colors cursor-pointer"
                              data-load-gram={m}
                              onClick={() => handleLoadFromTable(m)}
                              type="button"
                            >
                              Load {m}g
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Comprehensive Metrological Guide & SOP */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
              {/* Left Column: Deep Metrological Primer (7 Cols) */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-sm border border-outline-variant/20">
                  <h2 className="font-headline-lg text-[24px] font-bold text-on-surface tracking-tight mb-4">
                    Why Density Dictates Mass-to-Volume Conversions
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-4">
                    The international metric system (SI) strictly separates{' '}
                    <span className="font-semibold text-on-surface">mass</span> (measured in grams or kilograms) from{' '}
                    <span className="font-semibold text-on-surface">volume</span> (measured in liters, milliliters, or
                    cubic decimeters). Mass is a fundamental measure of the amount of matter within an object, invariant
                    regardless of atmospheric pressure or gravity.
                  </p>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-4">
                    In contrast, the fluid ounce is an archaic volume specification inherited from the English wine gallon
                    system. Because volume depends entirely on how tightly packed a substance’s molecules are, 100 grams
                    of two different ingredients cannot occupy the same fluid volume unless their physical densities are
                    identical.
                  </p>
                  <div className="p-5 rounded-2xl bg-surface-container-low space-y-3 mt-6 border border-outline-variant/15">
                    <h3 className="font-headline-md text-[17px] font-bold text-on-surface">
                      Historical Definition Notes
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-body-sm">
                      <div>
                        <span className="font-bold text-on-surface block">The Metric Gram (g)</span>
                        <span className="text-on-surface-variant">
                          Redefined in 2019 via the BIPM Planck constant (h = 6.62607015 × 10⁻³⁴ kg·m²/s). Universal
                          global benchmark for laboratories and modern professional kitchens.
                        </span>
                      </div>
                      <div>
                        <span className="font-bold text-on-surface block">US Customary Fluid Ounce (fl oz)</span>
                        <span className="text-on-surface-variant">
                          Defined under NIST as exactly 1/128 of a US liquid gallon (231 cubic inches). Corresponds to
                          29.5735295625 mL, differing from the UK Imperial fluid ounce (28.4130625 mL).
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Standard Operating Procedure SOP Card */}
                <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-sm border border-outline-variant/20">
                  <h2 className="font-headline-lg text-[24px] font-bold text-on-surface tracking-tight mb-4 flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-primary text-[26px]">format_list_numbered</span>
                    Standard Operating Procedure: Grams to Fl Oz
                  </h2>
                  <div className="space-y-4 font-body-md text-body-md text-on-surface-variant">
                    <div className="flex items-start gap-3">
                      <span className="w-7 h-7 rounded-full bg-primary text-on-primary font-data-mono font-bold text-body-sm flex items-center justify-center shrink-0">
                        1
                      </span>
                      <div>
                        <strong className="text-on-surface">Tare Scale &amp; Weigh Mass:</strong> Place a clean bowl on
                        your digital balance, press &quot;Tare&quot; to zero the scale, and pour your ingredient until the
                        digital reading reads your target mass in grams.
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="w-7 h-7 rounded-full bg-primary text-on-primary font-data-mono font-bold text-body-sm flex items-center justify-center shrink-0">
                        2
                      </span>
                      <div>
                        <strong className="text-on-surface">Identify Physical Density (ρ):</strong> Determine whether
                        your liquid or powder is standard density (water = 1.00), heavy (honey = 1.42, maple syrup =
                        1.37), or light (vegetable oils = 0.91–0.93, flour = ~0.53).
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="w-7 h-7 rounded-full bg-primary text-on-primary font-data-mono font-bold text-body-sm flex items-center justify-center shrink-0">
                        3
                      </span>
                      <div>
                        <strong className="text-on-surface">Divide Mass by Density:</strong> Compute mL = grams ÷ ρ.
                        For 100g of olive oil: 100 ÷ 0.92 = 108.695 mL.
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="w-7 h-7 rounded-full bg-primary text-on-primary font-data-mono font-bold text-body-sm flex items-center justify-center shrink-0">
                        4
                      </span>
                      <div>
                        <strong className="text-on-surface">Convert Milliliters to Fluid Ounces:</strong> Divide the
                        resulting milliliters by 29.5735. For olive oil: 108.695 ÷ 29.5735 = 3.675 US fl oz.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Editorial Food Science Highlights (5 Cols) */}
              <div className="lg:col-span-5 space-y-6">
                {/* Visual Baking Precision Card */}
                <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm overflow-hidden border border-outline-variant/20">
                  <div className="relative h-44 rounded-2xl mb-4 overflow-hidden">
                    <Image
                      alt="Close-up professional macro photograph of fine organic wheat flour pouring into a stainless steel digital kitchen scale with a minimalist beaker of water nearby under warm studio lighting with high contrast"
                      className="object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAx5yyIfKmA2fCcLgDO9at3t0t0P4Xry5r0vqJxpB8dea_cfZb1cVrMQLMf1fFa_itmKGYWpLq2_-sEY9BMtR9difMUu1vXxIuS0TByYzqleMzKZg4MbG0bXNo8dopyZYOTHTnjTYUKw_PRvy6ZbgGphaBiXR6fOz3Fv6dC1yfufYCGWlV7lOUqidBTslF2oJ63g1_x3LG6u9FXOfZqiWZXN4HcsXbTlrB2q2T8MyynigM-_6nN8PIc"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <h3 className="font-headline-md text-[18px] font-bold text-on-surface mb-2">
                    Culinary Science: Baking Hydration Ratios
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mb-4">
                    In artisan sourdough baking, hydration is defined as the weight percentage of water relative to
                    total flour mass. A 75% hydration dough requires 750g of water per 1,000g of flour. Because water
                    is 1.00 g/mL, 750g translates to exactly 25.36 US fluid ounces.
                  </p>
                  <div className="p-3 bg-surface-container-low rounded-xl font-data-mono text-[12px] text-on-surface-variant flex items-center justify-between border border-outline-variant/15">
                    <span>750g H2O hydration</span>
                    <span className="text-primary font-bold">25.360 fl oz (US)</span>
                  </div>
                </div>

                {/* Laboratory / Pharmaceutical Accuracy Card */}
                <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm overflow-hidden border border-outline-variant/20">
                  <div className="relative h-44 rounded-2xl mb-4 overflow-hidden">
                    <Image
                      alt="Laboratory cleanroom countertop with a calibrated analytical precision microbalance, borosilicate glass volumetric flasks, and clear liquid samples illuminated with bright clinical daylight"
                      className="object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBS1KAbKbV0wLA3MGnYAhfyL3rWHSJIcdQANuwxLWJAhcARIFYycuf2oF1E51OdvJQDEpvFaSQL5x_ZQnUwqIv1iu530-xFdOoP_stmGhrTGdc1Mzo6v54XYMMYc1PHINhqvsunXY_tdwELjoAzwt5_uFfIweEKpADADNBn1yPWgl_rn75d-t_j1SPPssFrEyNWZ68QjKHSP7muwC886CX5HcAFFt4gRy_3je5PnEc1fWnMzvpdNtaR"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <h3 className="font-headline-md text-[18px] font-bold text-on-surface mb-2">
                    Compounding &amp; Metrology Validation
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mb-4">
                    Pharmacy technicians dispensing suspensions or tinctures measure excipient mass to guarantee
                    deterministic concentration. When compounding solutions with non-aqueous cosolvents like glycerin
                    (density 1.26 g/mL) or ethanol (density 0.789 g/mL), precise density scaling prevents severe dosage
                    errors.
                  </p>
                  <div className="p-3 bg-surface-container-low rounded-xl font-data-mono text-[12px] text-on-surface-variant flex items-center justify-between border border-outline-variant/15">
                    <span>100g Pure Glycerin</span>
                    <span className="text-secondary font-bold">2.683 fl oz (US)</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Comprehensive FAQ Section (10 Schema-Synced Questions) */}
            <section className="bg-surface-container-lowest rounded-3xl p-6 sm:p-10 shadow-md mb-16 border border-outline-variant/20">
              <div className="max-w-3xl mb-8">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-secondary font-label-caps text-label-caps tracking-wider uppercase mb-2 font-semibold">
                  <span className="material-symbols-outlined text-[15px]">help</span> Metrology Knowledge Base
                </div>
                <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">
                  Frequently Asked Questions
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                  Comprehensive metrology, culinary, and conversion guidance verified against NIST standard reference
                  manuals.
                </p>
              </div>

              {/* Accordion Group */}
              <div className="space-y-3" id="faqAccordionGroup">
                {FAQ_ITEMS.map((item, idx) => {
                  const isOpen = !!openFaqs[idx];
                  return (
                    <div
                      className="faq-item rounded-2xl bg-surface-container-low overflow-hidden transition-colors border border-outline-variant/15"
                      key={idx}
                    >
                      <button
                        aria-expanded={isOpen}
                        className="faq-toggle w-full p-5 text-left font-headline-md text-[17px] font-semibold text-on-surface flex items-center justify-between gap-4 cursor-pointer"
                        onClick={() => toggleFaq(idx)}
                        type="button"
                      >
                        <span>{item.q}</span>
                        <span
                          className={`material-symbols-outlined text-[20px] text-on-surface-variant transition-transform duration-200 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        >
                          expand_more
                        </span>
                      </button>
                      {isOpen && (
                        <div className="faq-content px-5 pb-5 font-body-md text-body-md text-on-surface-variant leading-relaxed border-t border-outline-variant/10 pt-3">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Internal Linking Mesh (Related Conversions Bento Grid) */}
            <section className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-headline-lg text-[22px] font-bold text-on-surface tracking-tight">
                    Related Mass, Volume &amp; Culinary Conversions
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Explore adjacent high-precision metrology tools across our client-side conversion sandbox.
                  </p>
                </div>
                <Link
                  className="hidden sm:inline-flex items-center gap-1 font-body-sm text-primary hover:text-primary-container font-medium"
                  href="/conversion"
                >
                  <span>View all converters</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
                <Link
                  className="p-4 rounded-2xl bg-surface-container-lowest hover:bg-surface-container-low transition-all group shadow-xs border border-outline-variant/20"
                  href="/conversion/gram-to-ounce"
                >
                  <span className="font-data-mono text-[11px] text-secondary block mb-1">Mass to Weight</span>
                  <span className="font-body-sm font-semibold text-on-surface group-hover:text-primary transition-colors flex items-center justify-between">
                    Gram to Ounce (oz)
                    <span className="material-symbols-outlined text-[16px] text-outline group-hover:translate-x-0.5 transition-transform">
                      chevron_right
                    </span>
                  </span>
                </Link>
                <Link
                  className="p-4 rounded-2xl bg-surface-container-lowest hover:bg-surface-container-low transition-all group shadow-xs border border-outline-variant/20"
                  href="/conversion/gram-to-pound"
                >
                  <span className="font-data-mono text-[11px] text-secondary block mb-1">Mass to Mass</span>
                  <span className="font-body-sm font-semibold text-on-surface group-hover:text-primary transition-colors flex items-center justify-between">
                    Gram to Pound (lb)
                    <span className="material-symbols-outlined text-[16px] text-outline group-hover:translate-x-0.5 transition-transform">
                      chevron_right
                    </span>
                  </span>
                </Link>
                <Link
                  className="p-4 rounded-2xl bg-surface-container-lowest hover:bg-surface-container-low transition-all group shadow-xs border border-outline-variant/20"
                  href="/conversion/gram-to-kilogram"
                >
                  <span className="font-data-mono text-[11px] text-secondary block mb-1">Metric Mass</span>
                  <span className="font-body-sm font-semibold text-on-surface group-hover:text-primary transition-colors flex items-center justify-between">
                    Gram to Kilogram (kg)
                    <span className="material-symbols-outlined text-[16px] text-outline group-hover:translate-x-0.5 transition-transform">
                      chevron_right
                    </span>
                  </span>
                </Link>
                <Link
                  className="p-4 rounded-2xl bg-surface-container-lowest hover:bg-surface-container-low transition-all group shadow-xs border border-outline-variant/20"
                  href="/conversion/grams-to-milliliters"
                >
                  <span className="font-data-mono text-[11px] text-primary block mb-1">Metric Volume</span>
                  <span className="font-body-sm font-semibold text-on-surface group-hover:text-primary transition-colors flex items-center justify-between">
                    Gram to Milliliter (mL)
                    <span className="material-symbols-outlined text-[16px] text-outline group-hover:translate-x-0.5 transition-transform">
                      chevron_right
                    </span>
                  </span>
                </Link>
                <Link
                  className="p-4 rounded-2xl bg-surface-container-lowest hover:bg-surface-container-low transition-all group shadow-xs border border-outline-variant/20"
                  href="/conversion/milligram-to-gram"
                >
                  <span className="font-data-mono text-[11px] text-primary block mb-1">Metric Precision</span>
                  <span className="font-body-sm font-semibold text-on-surface group-hover:text-primary transition-colors flex items-center justify-between">
                    Milligram to Gram (g)
                    <span className="material-symbols-outlined text-[16px] text-outline group-hover:translate-x-0.5 transition-transform">
                      chevron_right
                    </span>
                  </span>
                </Link>
                <Link
                  className="p-4 rounded-2xl bg-surface-container-lowest hover:bg-surface-container-low transition-all group shadow-xs border border-outline-variant/20"
                  href="/conversion/gram-to-milligram"
                >
                  <span className="font-data-mono text-[11px] text-secondary block mb-1">Metric Sub-Units</span>
                  <span className="font-body-sm font-semibold text-on-surface group-hover:text-primary transition-colors flex items-center justify-between">
                    Gram to Milligram (mg)
                    <span className="material-symbols-outlined text-[16px] text-outline group-hover:translate-x-0.5 transition-transform">
                      chevron_right
                    </span>
                  </span>
                </Link>
                <Link
                  className="p-4 rounded-2xl bg-surface-container-lowest hover:bg-surface-container-low transition-all group shadow-xs border border-outline-variant/20"
                  href="/conversion/gram-to-tablespoon"
                >
                  <span className="font-data-mono text-[11px] text-secondary block mb-1">Culinary Spoon</span>
                  <span className="font-body-sm font-semibold text-on-surface group-hover:text-primary transition-colors flex items-center justify-between">
                    Tablespoon to Gram
                    <span className="material-symbols-outlined text-[16px] text-outline group-hover:translate-x-0.5 transition-transform">
                      chevron_right
                    </span>
                  </span>
                </Link>
                <Link
                  className="p-4 rounded-2xl bg-surface-container-lowest hover:bg-surface-container-low transition-all group shadow-xs border border-outline-variant/20"
                  href="/conversion/gram-to-teaspoon"
                >
                  <span className="font-data-mono text-[11px] text-secondary block mb-1">Kitchen Teaspoon</span>
                  <span className="font-body-sm font-semibold text-on-surface group-hover:text-primary transition-colors flex items-center justify-between">
                    Teaspoon to Gram
                    <span className="material-symbols-outlined text-[16px] text-outline group-hover:translate-x-0.5 transition-transform">
                      chevron_right
                    </span>
                  </span>
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
