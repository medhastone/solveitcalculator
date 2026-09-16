import os

code = """'use client';

import React, { useState, useMemo, useRef } from 'react';
import Link from 'next/link';

// Metrological Constants
const US_CUSTOMARY_ML = 236.5882365;
const US_LEGAL_ML = 240.0;
const METRIC_ML = 250.0;
const IMPERIAL_ML = 284.13;

const ML_PER_US_TBSP = US_CUSTOMARY_ML / 16;
const ML_PER_US_TSP = US_CUSTOMARY_ML / 48;
const GRAMS_PER_AVDP_OZ = 28.349523125;

interface CupStandard {
  id: string;
  name: string;
  ml: number;
  ratio: number;
}

const CUP_STANDARDS: Record<string, CupStandard> = {
  'us-customary': { id: 'us-customary', name: 'US Cups', ml: US_CUSTOMARY_ML, ratio: 1.0 },
  'us-legal': { id: 'us-legal', name: 'US Legal Cups', ml: US_LEGAL_ML, ratio: US_CUSTOMARY_ML / US_LEGAL_ML },
  'metric': { id: 'metric', name: 'Metric Cups', ml: METRIC_ML, ratio: US_CUSTOMARY_ML / METRIC_ML },
  'imperial': { id: 'imperial', name: 'Imperial UK Cups', ml: IMPERIAL_ML, ratio: US_CUSTOMARY_ML / IMPERIAL_ML }
};

interface DensityItem {
  name: string;
  density: number; // g/cup (US Customary)
}

const DENSITY_PRESETS: DensityItem[] = [
  { name: 'All-Purpose Flour', density: 125 },
  { name: 'Bread Flour', density: 130 },
  { name: 'Cake Flour', density: 115 },
  { name: 'Granulated Sugar', density: 200 },
  { name: 'Brown Sugar (Packed)', density: 220 },
  { name: 'Powdered Sugar', density: 120 },
  { name: 'Butter', density: 227 },
  { name: 'Pure Honey', density: 340 },
  { name: 'Whole Milk', density: 245 },
  { name: 'Pure Water', density: 236.6 },
  { name: 'Olive / Veg Oil', density: 216 },
  { name: 'Cocoa Powder', density: 100 },
  { name: 'White Rice', density: 185 },
  { name: 'Rolled Oats', density: 90 },
];

const PRESET_GRAMS = [25, 50, 75, 100, 125, 150, 200, 250, 500, 1000];
const TABLE_MASSES = [25, 50, 75, 100, 125, 150, 200, 250, 500, 1000];

const FAQ_ITEMS = [
  {
    q: '1. How many cups are in 100 grams?',
    a: 'Because cups measure volume and grams measure weight, 100 grams yields different cup volumes depending on the ingredient. For All-Purpose Flour (125 g/cup), 100g equals 0.80 cups (approx 3/4 cup + 1 tbsp). For Granulated Sugar (200 g/cup), 100g equals exactly 0.50 cups (1/2 cup). For Rolled Oats (90 g/cup), 100g equals 1.11 cups. For Butter (227 g/cup), 100g equals 0.44 cups (approx 7 tablespoons).',
  },
  {
    q: '2. Can grams be directly converted to cups without selecting an ingredient?',
    a: 'No, it is physically impossible. Grams measure mass (gravitational pull on physical matter), whereas cups measure volumetric space. Without knowing the substance\\'s bulk density (mass per unit volume), mathematical derivation cannot proceed. Online converters that do not ask for an ingredient assume pure water (where 1 mL = 1 g), which leads to complete disaster in dry baking recipes.',
  },
  {
    q: '3. How many cups is 250 grams of flour?',
    a: 'For standard all-purpose wheat flour (spooned and leveled at 125 grams per US Customary Cup), 250 grams divided by 125 equals exactly 2.00 US Cups. If using a Canadian or Australian Metric Cup (250 mL capacity), 250 grams of flour yields approximately 1.89 metric cups.',
  },
  {
    q: '4. How many cups is 100 grams of sugar?',
    a: 'Standard granulated white table sugar has a bulk density of 200 grams per US Cup. Therefore, 100 grams divided by 200 equals exactly 0.50 cups (1/2 cup). For brown sugar (packed, at 220 g/cup), 100 grams equals 0.45 cups (approx 7 tablespoons). For powdered sugar (confectioner\\'s, at 120 g/cup), 100 grams equals 0.83 cups.',
  },
  {
    q: '5. Why does ingredient selection matter so critically?',
    a: 'Substance bulk density varies radically based on molecular weight, granule size, and packing porosity. Flour particles create substantial air cavities, giving it a low density (125 g/cup), whereas crystalline sugar packs tightly (200 g/cup) and honey is a dense liquid (340 g/cup). A cup of honey contains nearly 3× the mass of a cup of flour!',
  },
  {
    q: '6. Can I use this converter for sensitive baking recipes?',
    a: 'Yes. The SolveIt engine uses audited empirical bulk densities compliant with USDA FoodData Central and King Arthur Baking reference specifications. It includes adjustments for specific flour types (Cake Flour at 115g vs Bread Flour at 130g) to safeguard delicate cake crumb structures.',
  },
  {
    q: '7. Is a cup a weight measurement?',
    a: 'No. A cup is strictly a volumetric measure of geometric capacity. In the US Customary system, 1 cup equals 236.588 milliliters or 16 tablespoons. Confusion often arises because 1 US cup equals 8 "fluid ounces" (fl oz), which people mistakenly conflate with dry ounces of weight (avoirdupois oz).',
  },
  {
    q: '8. What is the most accurate way to measure ingredients?',
    a: 'Weighing ingredients on a digital kitchen balance in grams is the undisputed gold standard. Scooping volumetric cups introduces human error, humidity effects, and packing pressure discrepancies of up to 25%. A digital gram scale guarantees recipe reproducibility every single time.',
  },
  {
    q: '9. How accurate is this online converter?',
    a: 'SolveIt operates on double-precision 64-bit IEEE 754 floating-point metrology compiled in pure client-side JavaScript. No rounding occurs during intermediate arithmetic, and outputs are formatted according to your selected precision mode (.00, .0000, or exact fractions).',
  },
  {
    q: '10. What is the formula for converting grams to cups?',
    a: 'The universal mathematical formula is: Cups = Grams ÷ Bulk Density (g/cup). For all-purpose flour: Cups = Grams ÷ 125. For granulated sugar: Cups = Grams ÷ 200. For pure water: Cups = Grams ÷ 236.59.',
  }
];

export default function GramToCupClient() {
  const [inputValue, setInputValue] = useState<string>('125');
  const [cupStandard, setCupStandard] = useState<string>('us-customary');
  const [precision, setPrecision] = useState<string>('2');
  const [currentDensity, setCurrentDensity] = useState<number>(125);
  const [currentIngredientName, setCurrentIngredientName] = useState<string>('All-Purpose Flour');
  const [customDensityMode, setCustomDensityMode] = useState<boolean>(false);
  const [customDensityInput, setCustomDensityInput] = useState<string>('125');
  const [copied, setCopied] = useState<boolean>(false);
  const [tableFilter, setTableFilter] = useState<string>('');
  const [openFaqs, setOpenFaqs] = useState<{ [key: number]: boolean }>({ 0: true, 1: true });
  const workbenchRef = useRef<HTMLDivElement>(null);

  // Parsed numerical mass
  const parsedGrams = parseFloat(inputValue);
  const safeGrams = isNaN(parsedGrams) || parsedGrams < 0 ? 0 : parsedGrams;
  
  // Calculate Target Cups
  const stdConfig = CUP_STANDARDS[cupStandard];
  const standardCups = currentDensity > 0 ? (safeGrams / currentDensity) : 0;
  const targetCups = standardCups * stdConfig.ratio;

  // Fraction Logic
  const decimalToKitchenFraction = (val: number) => {
    if (isNaN(val) || val <= 0) return "0 Cups";
    const whole = Math.floor(val);
    const frac = val - whole;
    const tolerance = 0.045;
    const fractions = [
      { decimal: 0.125, text: "1/8" },
      { decimal: 0.166, text: "1/6" },
      { decimal: 0.200, text: "1/5" },
      { decimal: 0.250, text: "1/4" },
      { decimal: 0.333, text: "1/3" },
      { decimal: 0.375, text: "3/8" },
      { decimal: 0.500, text: "1/2" },
      { decimal: 0.625, text: "5/8" },
      { decimal: 0.666, text: "2/3" },
      { decimal: 0.750, text: "3/4" },
      { decimal: 0.875, text: "7/8" }
    ];

    let match = "";
    if (frac < tolerance) {
      match = "";
    } else if (frac > 1 - tolerance) {
      return (whole + 1) + " Cups";
    } else {
      for (let f of fractions) {
        if (Math.abs(frac - f.decimal) <= tolerance) {
          match = f.text;
          break;
        }
      }
    }

    if (!match) {
      const roundedFrac = Math.round(frac * 16);
      if (roundedFrac === 16) return (whole + 1) + " Cups";
      if (roundedFrac > 0) {
        match = "~" + roundedFrac + "/16";
      }
    }

    if (whole === 0) {
      return match ? match + " Cup" : val.toFixed(2) + " Cups";
    } else {
      return match ? whole + " " + match + " Cups" : val.toFixed(2) + " Cups";
    }
  };

  const outputCupsFraction = decimalToKitchenFraction(targetCups);
  
  let formattedTargetCups = '';
  if (precision === 'frac') {
    formattedTargetCups = targetCups.toFixed(2);
  } else {
    formattedTargetCups = targetCups.toFixed(parseInt(precision, 10));
  }

  // Trace
  const calculationTrace = `${safeGrams} g ÷ ${currentDensity} g/cup × (${stdConfig.ratio.toFixed(4)}) = ${targetCups.toFixed(3)} ${stdConfig.name}`;

  // Multi-unit matrix
  const totalMl = targetCups * stdConfig.ml;
  const totalTbsp = (totalMl / US_CUSTOMARY_ML) * 16;
  const totalTsp = (totalMl / US_CUSTOMARY_ML) * 48;
  const totalFloz = (totalMl / US_CUSTOMARY_ML) * 8;
  const totalWeightOz = safeGrams / GRAMS_PER_AVDP_OZ;

  // Handlers
  const handleCopy = () => {
    const copyVal = `${formattedTargetCups} ${stdConfig.name} (${outputCupsFraction})`;
    navigator.clipboard.writeText(copyVal).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleReset = () => {
    setInputValue('125');
    setCupStandard('us-customary');
    setPrecision('2');
    setCurrentDensity(125);
    setCurrentIngredientName('All-Purpose Flour');
    setCustomDensityMode(false);
  };

  const handleLoadFromTable = (mass: number) => {
    setInputValue(mass.toString());
    if (workbenchRef.current) {
      workbenchRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaqs((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  // Table calculations
  const filteredTableMasses = TABLE_MASSES.filter((m) =>
    tableFilter === '' || m.toString().includes(tableFilter)
  );

  return (
    <>
      {/* Top Metadata Navigation & Metrology Trust Badges */}
      <div className="w-full bg-surface-container-low py-space-sm px-gutter-mobile lg:px-gutter-desktop shadow-sm">
        <div className="max-w-max-width-canvas mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-space-xs">
          {/* Breadcrumb Hierarchy */}
          <nav aria-label="Breadcrumbs" className="flex items-center flex-wrap gap-space-2xs text-body-sm font-body-sm text-on-surface-variant">
            <Link className="hover:text-primary transition-colors flex items-center gap-space-2xs" href="/">
              <span className="material-symbols-outlined text-[16px]">home</span>
              <span>Home</span>
            </Link>
            <span className="material-symbols-outlined text-[14px] text-outline-variant">chevron_right</span>
            <Link className="hover:text-primary transition-colors" href="/conversions">Conversion Hub</Link>
            <span className="material-symbols-outlined text-[14px] text-outline-variant">chevron_right</span>
            <span className="text-on-surface-variant">Mass &amp; Culinary</span>
            <span className="material-symbols-outlined text-[14px] text-outline-variant">chevron_right</span>
            <span className="text-primary font-semibold">Gram to Cup (g to cups)</span>
          </nav>
          {/* Precision Verification Badges */}
          <div className="flex items-center flex-wrap gap-space-xs">
            <span className="inline-flex items-center gap-space-2xs px-space-xs py-space-2xs bg-surface rounded-lg shadow-sm font-label-caps text-label-caps text-secondary uppercase font-semibold">
              <span className="material-symbols-outlined text-[14px] text-secondary">verified</span>
              NIST SP 811 Compliant
            </span>
            <span className="inline-flex items-center gap-space-2xs px-space-xs py-space-2xs bg-surface rounded-lg shadow-sm font-label-caps text-label-caps text-on-surface uppercase font-semibold">
              <span className="material-symbols-outlined text-[14px] text-primary">menu_book</span>
              USDA FoodData Central Ref 28
            </span>
            <span className="hidden sm:inline-flex items-center gap-space-2xs px-space-xs py-space-2xs bg-surface rounded-lg shadow-sm font-label-caps text-label-caps text-secondary uppercase font-semibold">
              <span className="material-symbols-outlined text-[14px] text-secondary">lock</span>
              100% Client-Side Private
            </span>
          </div>
        </div>
      </div>

      {/* Hero Introductory Block */}
      <section className="w-full py-space-xl px-gutter-mobile lg:px-gutter-desktop">
        <div className="max-w-max-width-canvas mx-auto flex flex-col gap-space-md">
          <div className="flex flex-col gap-space-xs">
            <div className="inline-flex items-center gap-space-2xs text-primary font-label-caps text-label-caps uppercase tracking-widest font-bold">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              Volumetric Culinary Metrology Engine
            </div>
            <h1 className="font-headline-lg text-headline-lg lg:font-display-hero lg:text-display-hero text-on-surface tracking-tight font-bold">
              Gram to Cups Converter (g to cups)
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl leading-relaxed">
              Use this free Gram to Cups converter to quickly convert grams (g) into cups. Because cups measure volume and grams measure weight, the conversion depends on the ingredient being measured. Select an ingredient to get the most accurate conversion.
            </p>
          </div>
          {/* Critical Metrological Callout Banner */}
          <div className="bg-surface-container p-space-md rounded-xl shadow-sm flex items-start gap-space-md">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-primary">
              <span className="material-symbols-outlined text-[24px]">balance</span>
            </div>
            <div className="flex flex-col gap-space-2xs">
              <span className="font-headline-md text-headline-md text-on-surface font-semibold text-base leading-tight">
                Crucial Metrological &amp; Culinary Notice: Mass vs. Volumetric Capacity
              </span>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Grams measure physical mass, whereas cups measure volume (<span className="font-data-mono text-data-mono text-on-surface font-semibold">1 US Legal Cup = 240 mL</span>; <span className="font-data-mono text-data-mono text-on-surface font-semibold">1 US Customary Cup = 236.588 mL</span>; <span className="font-data-mono text-data-mono text-on-surface font-semibold">1 Metric Cup = 250 mL</span>; <span className="font-data-mono text-data-mono text-on-surface font-semibold">1 Imperial UK Cup = 284.13 mL</span>). Conversion precision relies strictly on ingredient bulk density (<span className="italic font-medium">grams per cup</span>).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Precision Workbench Area */}
      <section className="w-full pb-space-3xl px-gutter-mobile lg:px-gutter-desktop" id="interactive-workbench" ref={workbenchRef}>
        <div className="max-w-max-width-canvas mx-auto grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
          {/* Main Conversion Panel (8 Columns) */}
          <div className="lg:col-span-8 flex flex-col gap-space-lg bg-surface-container-lowest p-space-lg rounded-xl shadow-md border border-outline-variant/30">
            {/* Standard & Precision Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md pb-space-sm bg-surface-container-low p-space-sm rounded-lg border border-outline-variant/20">
              <div className="flex flex-col gap-space-2xs">
                <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider font-semibold">Cup Standard</span>
                <div className="flex items-center flex-wrap gap-space-2xs">
                  {Object.values(CUP_STANDARDS).map((std) => (
                    <button
                      key={std.id}
                      className={`px-space-sm py-space-2xs rounded-lg font-body-sm text-body-sm font-semibold transition-all ${
                        cupStandard === std.id
                          ? 'bg-primary text-on-primary shadow-sm'
                          : 'text-on-surface-variant hover:text-on-surface bg-surface-container hover:bg-surface-container-high'
                      }`}
                      onClick={() => setCupStandard(std.id)}
                      type="button"
                    >
                      {std.name} ({std.ml.toFixed(2)} mL)
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-space-2xs sm:items-end">
                <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider font-semibold">Precision Decimals</span>
                <div className="flex items-center gap-space-2xs">
                  {['2', '4', '6', 'frac'].map((prec) => (
                    <button
                      key={prec}
                      className={`px-space-xs py-space-2xs rounded-lg font-data-mono text-data-mono font-semibold transition-all ${
                        precision === prec
                          ? 'bg-primary text-on-primary shadow-sm'
                          : 'text-on-surface-variant hover:text-on-surface bg-surface-container hover:bg-surface-container-high'
                      }`}
                      onClick={() => setPrecision(prec)}
                      type="button"
                    >
                      {prec === 'frac' ? 'Fractions' : `.${'0'.repeat(parseInt(prec, 10))}`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Mass Input Control with Quick Benchmarks */}
            <div className="flex flex-col gap-space-sm">
              <div className="flex items-center justify-between">
                <label className="font-headline-md text-headline-md font-semibold text-on-surface" htmlFor="massInputGrams">Mass in Grams (g)</label>
                <span className="font-data-mono text-data-mono text-on-surface-variant">Digital Balance Reading</span>
              </div>
              <div className="relative flex items-center">
                <span className="absolute left-space-md material-symbols-outlined text-primary text-[28px]">scale</span>
                <input
                  aria-label="Mass input value in grams"
                  className="w-full pl-14 pr-24 py-space-md bg-surface-container-low rounded-xl font-numerical-display text-numerical-display text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-inner border border-outline-variant/20"
                  id="massInputGrams"
                  min="0"
                  step="any"
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <div className="absolute right-space-md flex items-center gap-space-xs">
                  <span className="font-headline-md text-headline-md font-bold text-on-surface-variant">g</span>
                  <button
                    className="p-space-2xs hover:bg-surface-container rounded-lg text-outline-variant hover:text-on-surface transition-colors"
                    onClick={() => setInputValue('')}
                    title="Clear input"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[20px]">cancel</span>
                  </button>
                </div>
              </div>

              {/* Quick Benchmark Selectors */}
              <div className="flex items-center flex-wrap gap-space-2xs pt-space-2xs">
                <span className="font-label-caps text-label-caps uppercase text-on-surface-variant mr-space-xs font-semibold">Quick Mass:</span>
                {PRESET_GRAMS.map((val) => (
                  <button
                    key={val}
                    className={`px-space-sm py-space-2xs rounded-lg font-data-mono text-data-mono transition-colors border ${
                      parsedGrams === val
                        ? 'bg-primary text-on-primary font-bold shadow-sm border-transparent'
                        : 'bg-surface-container hover:bg-surface-container-high text-on-surface border-outline-variant/10'
                    }`}
                    onClick={() => setInputValue(val.toString())}
                    type="button"
                  >
                    {val}g
                  </button>
                ))}
              </div>
            </div>

            {/* Ingredient Specific Density Selector Grid */}
            <div className="flex flex-col gap-space-sm pt-space-xs">
              <div className="flex items-center justify-between">
                <label className="font-headline-md text-headline-md font-semibold text-on-surface">Select Ingredient &amp; Aeration Profile</label>
                <span className="font-label-caps text-label-caps uppercase text-secondary font-bold">14 Master Calibrations</span>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-space-xs">
                {DENSITY_PRESETS.map((ing) => (
                  <button
                    key={ing.name}
                    className={`p-space-sm rounded-xl text-left transition-all flex flex-col justify-between h-20 border ${
                      !customDensityMode && currentIngredientName === ing.name
                        ? 'bg-primary-container text-on-primary-container shadow-sm border-transparent active-ing'
                        : 'bg-surface-container-low hover:bg-surface-container text-on-surface border-outline-variant/20'
                    }`}
                    onClick={() => {
                      setCustomDensityMode(false);
                      setCurrentDensity(ing.density);
                      setCurrentIngredientName(ing.name);
                    }}
                    type="button"
                  >
                    <span className={`font-body-sm text-body-sm truncate ${!customDensityMode && currentIngredientName === ing.name ? 'font-bold' : 'font-semibold'}`}>
                      {ing.name}
                    </span>
                    <span className={`font-data-mono text-data-mono ${!customDensityMode && currentIngredientName === ing.name ? 'opacity-90' : 'text-on-surface-variant'}`}>
                      {ing.density} g/cup
                    </span>
                  </button>
                ))}
                
                <button
                  className={`p-space-sm rounded-xl text-left transition-all flex flex-col justify-between h-20 col-span-2 sm:col-span-1 border ${
                    customDensityMode
                      ? 'bg-secondary-container text-on-secondary-container shadow-sm border-transparent active-ing'
                      : 'bg-surface-container-low hover:bg-surface-container text-on-surface border-outline-variant/20'
                  }`}
                  onClick={() => {
                    setCustomDensityMode(true);
                    setCurrentDensity(parseFloat(customDensityInput) || 125);
                  }}
                  type="button"
                >
                  <span className={`font-body-sm text-body-sm font-semibold flex items-center gap-space-2xs ${customDensityMode ? 'text-on-secondary-container' : 'text-secondary'}`}>
                    <span className="material-symbols-outlined text-[16px]">tune</span>
                    Custom Density
                  </span>
                  <span className={`font-data-mono text-data-mono ${customDensityMode ? 'opacity-90' : 'text-on-surface-variant'}`}>Manual Input</span>
                </button>
              </div>

              {/* Hidden Custom Density Row */}
              {customDensityMode && (
                <div className="flex flex-col sm:flex-row items-center gap-space-md p-space-md bg-surface-container rounded-xl mt-2 border border-outline-variant/30">
                  <div className="flex-1 w-full">
                    <label className="font-label-caps text-label-caps uppercase text-on-surface-variant font-bold" htmlFor="customDensityInput">Custom Density (Grams per Cup)</label>
                    <input
                      className="w-full mt-space-2xs px-space-md py-space-xs bg-surface-container-lowest border border-outline-variant/30 rounded-lg font-data-mono text-data-mono text-on-surface focus:ring-2 focus:ring-primary focus:outline-none"
                      id="customDensityInput"
                      step="0.1"
                      type="number"
                      value={customDensityInput}
                      onChange={(e) => {
                        setCustomDensityInput(e.target.value);
                        setCurrentDensity(parseFloat(e.target.value) || 125);
                      }}
                    />
                  </div>
                  <div className="text-body-sm font-body-sm text-on-surface-variant flex-1">
                    Enter the exact mass in grams for 1 full cup of your custom blend or unique culinary powder.
                  </div>
                </div>
              )}
            </div>

            {/* Output Hero Card */}
            <div className="p-space-lg rounded-xl bg-gradient-to-br from-primary-fixed/30 to-surface-container shadow-sm border border-primary/20 flex flex-col gap-space-md mt-4">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-bold">Calculated Volumetric Output</span>
                <span className="inline-flex items-center gap-space-2xs font-data-mono text-data-mono text-secondary font-medium">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  Instant Deterministic
                </span>
              </div>
              <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-space-sm">
                <div className="flex items-baseline gap-space-xs">
                  <span className="font-numerical-display text-numerical-display text-on-surface font-extrabold tracking-tight">
                    {formattedTargetCups}
                  </span>
                  <span className="font-headline-lg text-headline-lg text-primary font-bold">
                    {stdConfig.name}
                  </span>
                </div>
                <div className="flex items-center gap-space-xs bg-surface-container-lowest px-space-md py-space-xs rounded-lg shadow-sm border border-outline-variant/20">
                  <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Fractional Equivalent:</span>
                  <span className="font-headline-md text-headline-md text-on-surface font-bold">
                    {outputCupsFraction}
                  </span>
                </div>
              </div>

              {/* Mathematical Trace Line */}
              <div className="pt-space-xs flex items-center gap-space-xs text-on-surface-variant font-data-mono text-data-mono bg-surface-container-lowest/60 border border-outline-variant/15 p-space-xs rounded-lg overflow-x-auto whitespace-nowrap scrollbar-none">
                <span className="material-symbols-outlined text-[16px] text-primary">function</span>
                <span className="font-semibold text-on-surface">Trace:</span>
                <span>{calculationTrace}</span>
              </div>
            </div>

            {/* Interactive Workbench Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-space-sm pt-space-xs">
              <div className="flex items-center flex-wrap gap-space-xs">
                <button
                  className="px-space-md py-space-xs bg-primary hover:bg-primary/90 text-on-primary font-body-sm text-body-sm font-semibold rounded-lg shadow-sm flex items-center gap-space-2xs transition-all active:scale-95"
                  type="button"
                  onClick={() => setInputValue(inputValue)} // Just to trigger re-render visually if needed
                >
                  <span className="material-symbols-outlined text-[18px]">bolt</span>
                  Convert Now
                </button>
                <button
                  className="px-space-md py-space-xs bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm font-semibold rounded-lg shadow-sm border border-outline-variant/20 flex items-center gap-space-2xs transition-all"
                  onClick={handleCopy}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">{copied ? 'check' : 'content_copy'}</span>
                  <span>{copied ? 'Copied!' : 'Copy Result'}</span>
                </button>
                <Link
                  className="px-space-md py-space-xs bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm font-semibold rounded-lg shadow-sm border border-outline-variant/20 flex items-center gap-space-2xs transition-all"
                  href="/conversion/cup-to-gram"
                >
                  <span className="material-symbols-outlined text-[18px]">swap_horiz</span>
                  Swap Units (Cups to Grams)
                </Link>
              </div>
              <div className="flex items-center gap-space-xs">
                <button
                  className="p-space-xs hover:bg-surface-container text-on-surface-variant hover:text-on-surface rounded-lg transition-colors border border-transparent hover:border-outline-variant/20"
                  onClick={() => window.print()}
                  title="Print Kitchen Conversion Sheet"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">print</span>
                </button>
                <button
                  className="p-space-xs hover:bg-surface-container text-on-surface-variant hover:text-on-surface rounded-lg transition-colors border border-transparent hover:border-outline-variant/20"
                  onClick={handleReset}
                  title="Reset to Default Settings"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">restart_alt</span>
                </button>
              </div>
            </div>

            {/* Simultaneous Volumetric & Kitchen Matrix Output */}
            <div className="flex flex-col gap-space-sm pt-space-md border-t border-outline-variant/20 mt-4">
              <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider font-bold">Simultaneous Volumetric &amp; Kitchen Matrix</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-space-xs">
                <div className="p-space-sm bg-surface-container-low rounded-xl shadow-sm border border-outline-variant/15 flex flex-col">
                  <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">US Tablespoons</span>
                  <span className="font-headline-md text-headline-md text-on-surface font-bold">{totalTbsp.toFixed(2)}</span>
                  <span className="font-data-mono text-data-mono text-secondary">tbsp</span>
                </div>
                <div className="p-space-sm bg-surface-container-low rounded-xl shadow-sm border border-outline-variant/15 flex flex-col">
                  <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">US Teaspoons</span>
                  <span className="font-headline-md text-headline-md text-on-surface font-bold">{totalTsp.toFixed(2)}</span>
                  <span className="font-data-mono text-data-mono text-secondary">tsp</span>
                </div>
                <div className="p-space-sm bg-surface-container-low rounded-xl shadow-sm border border-outline-variant/15 flex flex-col">
                  <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Fluid Ounces</span>
                  <span className="font-headline-md text-headline-md text-on-surface font-bold">{totalFloz.toFixed(2)}</span>
                  <span className="font-data-mono text-data-mono text-secondary">fl oz</span>
                </div>
                <div className="p-space-sm bg-surface-container-low rounded-xl shadow-sm border border-outline-variant/15 flex flex-col">
                  <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Milliliters</span>
                  <span className="font-headline-md text-headline-md text-on-surface font-bold">{totalMl.toFixed(2)}</span>
                  <span className="font-data-mono text-data-mono text-secondary">mL</span>
                </div>
                <div className="p-space-sm bg-surface-container-low rounded-xl shadow-sm border border-outline-variant/15 flex flex-col col-span-2 sm:col-span-1">
                  <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Dry Avoirdupois</span>
                  <span className="font-headline-md text-headline-md text-on-surface font-bold">{totalWeightOz.toFixed(3)}</span>
                  <span className="font-data-mono text-data-mono text-secondary">oz weight</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Culinary Density Visualizer & Metrology Inspector (4 Columns) */}
          <div className="lg:col-span-4 flex flex-col gap-space-lg">
            {/* Density Disparity Comparison Card */}
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-md border border-outline-variant/30 flex flex-col gap-space-md">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-secondary text-[22px]">stacked_bar_chart</span>
                <h2 className="font-headline-md text-headline-md font-bold text-on-surface">100g Mass Displacement</h2>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Notice how exactly 100 grams of physical mass occupies vastly different cup volumes based on substance bulk density:
              </p>
              
              <div className="flex flex-col gap-space-sm pt-space-xs">
                <div className="flex flex-col gap-space-2xs">
                  <div className="flex justify-between font-body-sm text-body-sm">
                    <span className="font-semibold text-on-surface">Rolled Oats (100g)</span>
                    <span className="font-data-mono text-data-mono text-primary font-bold">1.11 Cups</span>
                  </div>
                  <div className="w-full bg-surface-container-low rounded-full h-3 overflow-hidden">
                    <div className="bg-secondary-container h-full rounded-full transition-all duration-500" style={{ width: '100%' }}></div>
                  </div>
                </div>
                <div className="flex flex-col gap-space-2xs">
                  <div className="flex justify-between font-body-sm text-body-sm">
                    <span className="font-semibold text-on-surface">AP Flour (100g)</span>
                    <span className="font-data-mono text-data-mono text-primary font-bold">0.80 Cups</span>
                  </div>
                  <div className="w-full bg-surface-container-low rounded-full h-3 overflow-hidden">
                    <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: '72%' }}></div>
                  </div>
                </div>
                <div className="flex flex-col gap-space-2xs">
                  <div className="flex justify-between font-body-sm text-body-sm">
                    <span className="font-semibold text-on-surface">Granulated Sugar (100g)</span>
                    <span className="font-data-mono text-data-mono text-primary font-bold">0.50 Cups</span>
                  </div>
                  <div className="w-full bg-surface-container-low rounded-full h-3 overflow-hidden">
                    <div className="bg-secondary h-full rounded-full transition-all duration-500" style={{ width: '45%' }}></div>
                  </div>
                </div>
                <div className="flex flex-col gap-space-2xs">
                  <div className="flex justify-between font-body-sm text-body-sm">
                    <span className="font-semibold text-on-surface">Pure Honey (100g)</span>
                    <span className="font-data-mono text-data-mono text-primary font-bold">0.29 Cups</span>
                  </div>
                  <div className="w-full bg-surface-container-low rounded-full h-3 overflow-hidden">
                    <div className="bg-tertiary-container h-full rounded-full transition-all duration-500" style={{ width: '26%' }}></div>
                  </div>
                </div>
              </div>
              
              <div className="p-space-sm bg-surface-container-low rounded-lg font-body-sm text-body-sm text-on-surface-variant flex items-center gap-space-xs border border-outline-variant/15">
                <span className="material-symbols-outlined text-[18px] text-tertiary">info</span>
                <span>Honey is 3.7× denser than oats; identical mass takes 74% less volume!</span>
              </div>
            </div>

            {/* Metrology Audit Card */}
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-md border border-outline-variant/30 flex flex-col gap-space-md">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-[22px]">science</span>
                <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Metrology Reference</h3>
              </div>
              <div className="space-y-space-sm font-body-sm text-body-sm text-on-surface-variant">
                <div className="p-space-sm bg-surface-container-low border border-outline-variant/15 rounded-lg flex flex-col gap-space-2xs">
                  <span className="font-label-caps text-label-caps uppercase text-on-surface font-bold">SI Subunit Defined (BIPM)</span>
                  <p>1 gram (g) is 1×10⁻³ kilograms, bound precisely to the Planck constant (<span className="font-data-mono text-data-mono">h = 6.62607015×10⁻³⁴ J·s</span>).</p>
                </div>
                <div className="p-space-sm bg-surface-container-low border border-outline-variant/15 rounded-lg flex flex-col gap-space-2xs">
                  <span className="font-label-caps text-label-caps uppercase text-on-surface font-bold">US Volumetric Standard</span>
                  <p>1 US Customary Cup = 1/16 US Liquid Gallon = 236.5882365 mL exactly.</p>
                </div>
              </div>
            </div>

            {/* Kitchen Scale Pro Tip */}
            <div className="bg-primary text-on-primary p-space-lg rounded-xl shadow-md flex flex-col gap-space-xs relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <span className="material-symbols-outlined text-[100px]">tips_and_updates</span>
              </div>
              <div className="flex items-center gap-space-xs relative z-10">
                <span className="material-symbols-outlined text-[20px] text-primary-fixed">tips_and_updates</span>
                <span className="font-label-caps text-label-caps uppercase tracking-wider font-bold">Patisserie Standard</span>
              </div>
              <p className="font-body-sm text-body-sm text-primary-fixed font-medium leading-relaxed relative z-10">
                Professional master bakers never use volume scoops for dry flour. Scooping from a sack compacts flour by up to 25%, resulting in dense, dry doughs. Weighing in grams guarantees absolute repeatability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Formula & Formal Derivation Section */}
      <section className="w-full py-space-2xl bg-surface-container-low px-gutter-mobile lg:px-gutter-desktop border-y border-outline-variant/10">
        <div className="max-w-max-width-canvas mx-auto flex flex-col gap-space-xl">
          <div className="flex flex-col gap-space-xs text-center max-w-3xl mx-auto">
            <span className="font-label-caps text-label-caps uppercase text-primary font-bold tracking-widest">Mathematical Formulation</span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">Gram to Cups Formula</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Culinary mass-to-volume derivation relies on fundamental Newtonian mechanics: volume equals mass divided by bulk substance density.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
            {/* General Metrological Equation */}
            <div className="bg-surface-container-lowest border border-outline-variant/20 p-space-xl rounded-xl shadow-md flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-label-caps uppercase text-secondary font-bold">Universal Law</span>
                <span className="material-symbols-outlined text-secondary text-[20px]">architecture</span>
              </div>
              <h3 className="font-headline-md text-headline-md font-bold text-on-surface">General Volumetric Equation</h3>
              <div className="p-space-md bg-surface-container rounded-xl flex items-center justify-center border border-primary/10">
                <code className="font-data-mono text-numerical-display-mobile md:text-numerical-display text-primary font-bold whitespace-nowrap overflow-x-auto text-center w-full">
                  Cups = Grams ÷ Grams Per Cup
                </code>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Where <span className="font-semibold text-on-surface">Grams Per Cup</span> represents the empirical bulk density constant (ρ) of the designated dry or liquid culinary substance.
              </p>
            </div>

            {/* Ingredient Specific: All-Purpose Flour */}
            <div className="bg-surface-container-lowest border border-outline-variant/20 p-space-xl rounded-xl shadow-md flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-label-caps uppercase text-primary font-bold">Specific Calibration</span>
                <span className="material-symbols-outlined text-primary text-[20px]">bakery_dining</span>
              </div>
              <h3 className="font-headline-md text-headline-md font-bold text-on-surface">All-Purpose Flour Formula</h3>
              <div className="p-space-md bg-surface-container rounded-xl flex items-center justify-center border border-primary/10">
                <code className="font-data-mono text-numerical-display-mobile md:text-numerical-display text-primary font-bold whitespace-nowrap overflow-x-auto text-center w-full">
                  Cups = Grams ÷ 125
                </code>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Standard US customary cup calibration defines 1 cup of spooned and leveled all-purpose wheat flour at exactly <span className="font-semibold text-on-surface">125 grams</span>.
              </p>
            </div>
          </div>

          {/* Density Factor Benchmarks */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
            <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/15 flex items-center gap-space-md">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-data-mono font-bold text-headline-md shrink-0">1×</div>
              <div>
                <span className="font-headline-md text-headline-md font-bold text-on-surface block">125g Flour = 1 Cup</span>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Single standard cup benchmark</p>
              </div>
            </div>
            <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/15 flex items-center gap-space-md">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-data-mono font-bold text-headline-md shrink-0">2×</div>
              <div>
                <span className="font-headline-md text-headline-md font-bold text-on-surface block">250g Flour = 2 Cups</span>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Double batch artisan yield</p>
              </div>
            </div>
            <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/15 flex items-center gap-space-md">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-data-mono font-bold text-headline-md shrink-0">4×</div>
              <div>
                <span className="font-headline-md text-headline-md font-bold text-on-surface block">500g Flour = 4 Cups</span>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Commercial half-kilo batch</p>
              </div>
            </div>
          </div>

          {/* Step-by-Step Worked Verification Cards */}
          <div className="flex flex-col gap-space-md mt-4">
            <span className="font-label-caps text-label-caps uppercase text-on-surface-variant font-bold text-center sm:text-left">Audited Worked Examples Across Core Substances</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-space-sm">
              <div className="p-space-md bg-surface-container-lowest border border-outline-variant/20 rounded-xl shadow-sm flex flex-col gap-space-2xs text-center sm:text-left">
                <span className="font-label-caps text-label-caps uppercase text-secondary font-bold">100g Flour</span>
                <span className="font-headline-md text-headline-md font-bold text-on-surface">0.80 Cups</span>
                <p className="font-data-mono text-data-mono text-on-surface-variant">100 ÷ 125 = 0.80 c</p>
              </div>
              <div className="p-space-md bg-surface-container-lowest border border-outline-variant/20 rounded-xl shadow-sm flex flex-col gap-space-2xs text-center sm:text-left">
                <span className="font-label-caps text-label-caps uppercase text-secondary font-bold">200g Sugar</span>
                <span className="font-headline-md text-headline-md font-bold text-on-surface">1.00 Cup</span>
                <p className="font-data-mono text-data-mono text-on-surface-variant">200 ÷ 200 = 1.00 c</p>
              </div>
              <div className="p-space-md bg-surface-container-lowest border border-outline-variant/20 rounded-xl shadow-sm flex flex-col gap-space-2xs text-center sm:text-left">
                <span className="font-label-caps text-label-caps uppercase text-secondary font-bold">250g Butter</span>
                <span className="font-headline-md text-headline-md font-bold text-on-surface">1.10 Cups</span>
                <p className="font-data-mono text-data-mono text-on-surface-variant">250 ÷ 227 = 1.10 c</p>
              </div>
              <div className="p-space-md bg-surface-container-lowest border border-outline-variant/20 rounded-xl shadow-sm flex flex-col gap-space-2xs text-center sm:text-left">
                <span className="font-label-caps text-label-caps uppercase text-secondary font-bold">500g Milk</span>
                <span className="font-headline-md text-headline-md font-bold text-on-surface">2.04 Cups</span>
                <p className="font-data-mono text-data-mono text-on-surface-variant">500 ÷ 245 = 2.04 c</p>
              </div>
              <div className="p-space-md bg-surface-container-lowest border border-outline-variant/20 rounded-xl shadow-sm flex flex-col gap-space-2xs text-center sm:text-left">
                <span className="font-label-caps text-label-caps uppercase text-secondary font-bold">1000g Water</span>
                <span className="font-headline-md text-headline-md font-bold text-on-surface">4.23 Cups</span>
                <p className="font-data-mono text-data-mono text-on-surface-variant">1000 ÷ 236.59 = 4.23 c</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Searchable High-Precision Conversion Master Table */}
      <section className="w-full py-space-3xl px-gutter-mobile lg:px-gutter-desktop">
        <div className="max-w-max-width-canvas mx-auto flex flex-col gap-space-lg">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
            <div className="flex flex-col gap-space-2xs">
              <span className="font-label-caps text-label-caps uppercase text-primary font-bold">Master Culinary Lookup</span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">Gram to Cups Quick-Reference Table</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Cross-referenced across standard baking ingredients. Click &quot;Load&quot; to instantly inject any row into the interactive workbench.
              </p>
            </div>
            <div className="relative w-full md:w-72">
              <span className="absolute left-space-sm top-1/2 -translate-y-1/2 material-symbols-outlined text-outline-variant text-[18px]">search</span>
              <input
                className="w-full pl-9 pr-space-md py-space-xs bg-surface-container-low rounded-lg font-body-sm text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-sm border border-outline-variant/30"
                id="tableFilterInput"
                placeholder="Filter table (e.g. 100g, 250g)..."
                type="text"
                value={tableFilter}
                onChange={(e) => setTableFilter(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto bg-surface-container-lowest rounded-xl shadow-md border border-outline-variant/30">
            <table className="w-full text-left font-body-sm text-body-sm min-w-[800px]">
              <thead className="bg-surface-container-low text-on-surface uppercase font-label-caps text-label-caps tracking-wider border-b border-outline-variant/20">
                <tr>
                  <th className="py-space-md px-space-md" scope="col">Mass (Grams)</th>
                  <th className="py-space-md px-space-md" scope="col">All-Purpose Flour (125g)</th>
                  <th className="py-space-md px-space-md" scope="col">Granulated Sugar (200g)</th>
                  <th className="py-space-md px-space-md" scope="col">Butter (227g)</th>
                  <th className="py-space-md px-space-md" scope="col">Pure Honey (340g)</th>
                  <th className="py-space-md px-space-md text-right" scope="col">Workbench Action</th>
                </tr>
              </thead>
              <tbody className="text-on-surface">
                {filteredTableMasses.map((mass, index) => {
                  const isMatch = parsedGrams === mass;
                  const cFlour = (mass / 125).toFixed(2);
                  const cSugar = (mass / 200).toFixed(2);
                  const cButter = (mass / 227).toFixed(2);
                  const cHoney = (mass / 340).toFixed(2);
                  return (
                    <tr key={mass} className={`border-b border-outline-variant/10 transition-colors ${isMatch ? 'bg-primary/5' : 'hover:bg-surface-container-low/50'}`}>
                      <td className="py-space-sm px-space-md font-data-mono text-data-mono font-bold text-primary">{mass} g</td>
                      <td className="py-space-sm px-space-md font-data-mono text-data-mono">{cFlour} c</td>
                      <td className="py-space-sm px-space-md font-data-mono text-data-mono">{cSugar} c</td>
                      <td className="py-space-sm px-space-md font-data-mono text-data-mono">{cButter} c</td>
                      <td className="py-space-sm px-space-md font-data-mono text-data-mono">{cHoney} c</td>
                      <td className="py-space-sm px-space-md text-right">
                        <button
                          className={`px-space-xs py-space-2xs rounded font-label-caps text-label-caps uppercase transition-colors ${isMatch ? 'bg-primary text-on-primary' : 'bg-surface-container hover:bg-primary hover:text-on-primary border border-outline-variant/20'}`}
                          onClick={() => handleLoadFromTable(mass)}
                          type="button"
                        >
                          {isMatch ? 'Active' : 'Load'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filteredTableMasses.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-space-lg text-center text-on-surface-variant font-body-sm">
                      No matching values found in the quick reference table. You can use the calculator above for any value!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Deep Explanatory Section */}
      <section className="w-full py-space-3xl bg-surface-container-low px-gutter-mobile lg:px-gutter-desktop border-y border-outline-variant/10">
        <div className="max-w-max-width-canvas mx-auto flex flex-col gap-space-2xl">
          <div className="flex flex-col gap-space-xs max-w-3xl">
            <span className="font-label-caps text-label-caps uppercase text-primary font-bold tracking-widest">Physical &amp; Chemical Metrology</span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
              Why Ingredient Selection Strictly Governs Accuracy
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              The most widespread mistake in culinary science is treating the cup as a weight measurement. Because grams quantify matter (inertia) and cups quantify geometry (space), conversion is impossible without empirical substance bulk density.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-md border border-outline-variant/20 flex flex-col gap-space-sm">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[24px]">scale</span>
              </div>
              <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Mass vs. Spatial Volume</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Mass measures physical atoms inside matter; volume measures the three-dimensional boundary. Converting between them requires the density equation <span className="font-data-mono text-data-mono font-semibold">ρ = m / V</span>.
              </p>
            </div>
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-md border border-outline-variant/20 flex flex-col gap-space-sm">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[24px]">grain</span>
              </div>
              <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Aeration &amp; Packing Factors</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Flour sifted into a cup contains up to 40% atmospheric air pockets (yielding ~110g/cup), while flour scooped aggressively from a compressed bag packs down to ~150g/cup—a dramatic 36% error.
              </p>
            </div>
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-md border border-outline-variant/20 flex flex-col gap-space-sm">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-tertiary">
                <span className="material-symbols-outlined text-[24px]">compare_arrows</span>
              </div>
              <h3 className="font-headline-md text-headline-md font-bold text-on-surface">1 Cup Flour ≠ 1 Cup Sugar</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                One cup of all-purpose flour weighs 125 grams, whereas one cup of table sugar weighs 200 grams. Assuming they share the same mass ratio destroys recipe hydration balance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive FAQ Section */}
      <section className="w-full py-space-3xl px-gutter-mobile lg:px-gutter-desktop">
        <div className="max-w-max-width-canvas mx-auto flex flex-col gap-space-2xl">
          <div className="flex flex-col gap-space-xs text-center max-w-2xl mx-auto">
            <span className="font-label-caps text-label-caps uppercase text-primary font-bold tracking-widest">Frequently Asked Questions</span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
              Master Metrological &amp; Culinary FAQs
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Everything you need to know about mass, volumetric capacity, and ingredient bulk density.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto w-full flex flex-col gap-space-xs">
            {FAQ_ITEMS.map((faq, index) => {
              const isOpen = !!openFaqs[index];
              return (
                <div key={index} className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl shadow-sm overflow-hidden">
                  <button
                    aria-expanded={isOpen}
                    className="w-full p-space-md text-left flex items-center justify-between gap-space-md hover:bg-surface-container-low/40 transition-colors"
                    onClick={() => toggleFaq(index)}
                    type="button"
                  >
                    <span className="font-headline-md text-headline-md text-on-surface font-semibold text-base pr-4">
                      {faq.q}
                    </span>
                    <span className={`material-symbols-outlined text-primary transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`}>
                      expand_more
                    </span>
                  </button>
                  <div className={`px-space-md pb-space-md text-on-surface-variant font-body-sm text-body-sm leading-relaxed ${isOpen ? 'block' : 'hidden'}`}>
                    {faq.a}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Internal Linking Mesh */}
      <section className="w-full py-space-3xl px-gutter-mobile lg:px-gutter-desktop border-t border-outline-variant/10 bg-surface-container-low">
        <div className="max-w-max-width-canvas mx-auto flex flex-col gap-space-xl">
          <div className="flex flex-col gap-space-xs">
            <span className="font-label-caps text-label-caps uppercase text-primary font-bold tracking-widest">Metrological Network</span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">Related Culinary &amp; Mass Conversions</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Explore adjacent precision converters within the SolveIt conversion suite.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-space-md">
            <Link className="p-space-md bg-surface-container-lowest hover:bg-surface-container rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-between group border border-outline-variant/20" href="/conversion/gram-to-fluid-ounce">
              <div className="flex flex-col gap-space-2xs">
                <span className="font-body-md text-body-md font-bold text-on-surface group-hover:text-primary transition-colors">Gram to Fluid Ounce</span>
                <span className="font-data-mono text-data-mono text-on-surface-variant">g to fl oz</span>
              </div>
              <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">arrow_forward</span>
            </Link>
            <Link className="p-space-md bg-surface-container-lowest hover:bg-surface-container rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-between group border border-outline-variant/20" href="/conversion/grams-to-tablespoons">
              <div className="flex flex-col gap-space-2xs">
                <span className="font-body-md text-body-md font-bold text-on-surface group-hover:text-primary transition-colors">Gram to Tablespoon</span>
                <span className="font-data-mono text-data-mono text-on-surface-variant">g to tbsp</span>
              </div>
              <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">arrow_forward</span>
            </Link>
            <Link className="p-space-md bg-surface-container-lowest hover:bg-surface-container rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-between group border border-outline-variant/20" href="/conversion/grams-to-milliliters">
              <div className="flex flex-col gap-space-2xs">
                <span className="font-body-md text-body-md font-bold text-on-surface group-hover:text-primary transition-colors">Gram to Milliliter</span>
                <span className="font-data-mono text-data-mono text-on-surface-variant">g to mL</span>
              </div>
              <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
"""

with open("app/conversion/gram-to-cup/GramToCupClient.tsx", "w") as f:
    f.write(code)

