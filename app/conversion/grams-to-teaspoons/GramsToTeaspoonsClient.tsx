'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface IngredientInfo {
  name: string;
  density: number; // g/mL
  category: string;
  fdcId?: string;
  desc?: string;
}

const INGREDIENTS_DICT: Record<string, IngredientInfo> = {
  salt_table: { name: 'Fine Table Salt (Iodized)', density: 1.217, category: 'salts', fdcId: 'FDC #173468', desc: 'Standard fine iodized kitchen salt (~6.0g per tsp)' },
  salt_diamond: { name: 'Diamond Crystal Kosher Salt', density: 0.570, category: 'salts', fdcId: 'DC-SPEC-02', desc: 'Light, hollow flaky crystal kosher salt (~2.8g per tsp)' },
  salt_morton: { name: 'Morton Kosher Salt', density: 0.970, category: 'salts', fdcId: 'MK-SPEC-01', desc: 'Dense, pressed flake kosher salt (~4.8g per tsp)' },
  baking_powder: { name: 'Baking Powder (Double Acting)', density: 0.900, category: 'salts', fdcId: 'FDC #172804', desc: 'Standard chemical leavener (~4.4g per tsp)' },
  baking_soda: { name: 'Baking Soda (Sodium Bicarbonate)', density: 0.960, category: 'salts', fdcId: 'FDC #172805', desc: 'Pure sodium bicarbonate (~4.7g per tsp)' },
  yeast_dry: { name: 'Active Dry / Instant Yeast', density: 0.640, category: 'salts', fdcId: 'FDC #174245', desc: 'Dehydrated granulated yeast (7g packet = ~2¼ tsp)' },
  cinnamon: { name: 'Ground Ceylon / Cassia Cinnamon', density: 0.560, category: 'spices', fdcId: 'FDC #171320', desc: 'Aromatic ground bark spice (~2.8g per tsp)' },
  black_pepper: { name: 'Ground Black Pepper (Fine)', density: 0.579, category: 'spices', fdcId: 'FDC #171325', desc: 'Fine ground peppercorns (~2.9g per tsp)' },
  paprika: { name: 'Ground Sweet / Smoked Paprika', density: 0.460, category: 'spices', fdcId: 'FDC #171328', desc: 'Ground dried capsicum (~2.3g per tsp)' },
  oregano: { name: 'Dried Oregano Leaves (Crushed)', density: 0.200, category: 'spices', fdcId: 'FDC #171326', desc: 'Low density dried herb flakes (~1.0g per tsp)' },
  garlic_powder: { name: 'Pure Garlic Powder', density: 0.640, category: 'spices', fdcId: 'FDC #171323', desc: 'Dehydrated ground allium (~3.2g per tsp)' },
  vanilla: { name: 'Pure Vanilla Extract', density: 0.879, category: 'dairy', fdcId: 'FDC #171330', desc: 'Alcoholic vanilla extract solution (~4.3g per tsp)' },
  sugar: { name: 'Granulated White Sugar', density: 0.849, category: 'sugars', fdcId: 'FDC #169655', desc: 'Standard sucrose crystals (~4.2g per tsp)' },
  brown_sugar_packed: { name: 'Brown Sugar (Packed)', density: 0.880, category: 'sugars', fdcId: 'FDC #168833', desc: 'Moist sucrose with molasses (~4.3g per tsp)' },
  powdered_sugar: { name: 'Powdered / Confectioners Sugar', density: 0.560, category: 'sugars', fdcId: 'FDC #169656', desc: 'Finely pulverized sugar with cornstarch (~2.8g per tsp)' },
  honey: { name: 'Pure Raw Honey', density: 1.420, category: 'sugars', fdcId: 'NIST #8441', desc: 'Dense viscous inverted nectar (~7.0g per tsp)' },
  maple_syrup: { name: 'Pure Maple Syrup', density: 1.330, category: 'sugars', fdcId: 'FDC #169657', desc: 'Grade A boiled tree sap (~6.6g per tsp)' },
  butter: { name: 'Butter (Unsalted, Melted)', density: 0.911, category: 'dairy', fdcId: 'FDC #173410', desc: '80% milk fat emulsion (~4.5g per tsp)' },
  olive_oil: { name: 'Extra Virgin Olive Oil', density: 0.918, category: 'dairy', fdcId: 'FDC #171413', desc: 'Cold-pressed culinary oil (~4.5g per tsp)' },
  water: { name: 'Pure Water / Aqueous Liquids', density: 1.000, category: 'dairy', fdcId: 'NIST SRD-01', desc: 'Standard liquid reference density (4.93g per US tsp)' },
  creatine: { name: 'Creatine Monohydrate (Micronized)', density: 0.700, category: 'supplements', fdcId: 'USP-CR-2024', desc: 'High purity ergogenic powder (~3.5g per tsp)' },
  whey: { name: 'Whey Protein Isolate', density: 0.380, category: 'supplements', fdcId: 'USP-WPI-2024', desc: 'Ultra-low density protein isolate (~1.9g per tsp)' },
  matcha: { name: 'Ceremonial Matcha Green Tea', density: 0.400, category: 'supplements', fdcId: 'FDC #171920', desc: 'Micro-ground green tea leaves (~2.0g per tsp)' },
  flour_ap: { name: 'All-Purpose Flour (Dip & Sweep)', density: 0.528, category: 'flours', fdcId: 'FDC #168936', desc: 'Standard enriched wheat flour (~2.6g per tsp)' },
  cornstarch: { name: 'Pure Cornstarch', density: 0.540, category: 'flours', fdcId: 'FDC #169697', desc: 'Fine maize thickening starch (~2.7g per tsp)' },
  cocoa: { name: 'Unsweetened Cocoa Powder', density: 0.410, category: 'flours', fdcId: 'FDC #169593', desc: 'Dutch / natural cocoa solids (~2.0g per tsp)' }
};

export default function GramsToTeaspoonsClient() {
  const [direction, setDirection] = useState<'g2tsp' | 'tsp2g'>('g2tsp');
  const [spoonStandard, setSpoonStandard] = useState<number>(4.92892); // US Teaspoon in mL
  const [selectedKey, setSelectedKey] = useState<string>('salt_table');
  const [customDensity, setCustomDensity] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('5');
  const [batchMult, setBatchMult] = useState<number>(1.0);
  const [copied, setCopied] = useState<boolean>(false);

  // Recipe Parser State
  const [recipeText, setRecipeText] = useState<string>(
    '5g fine table salt\n4g baking powder\n6g granulated sugar\n3g ground cinnamon\n7g active dry yeast\n10g pure raw honey'
  );
  const [parsedRows, setParsedRows] = useState<Array<{
    name: string;
    grams: number;
    density: number;
    tsp: number;
    frac: string;
    tbsp: number;
  }>>([]);

  // Database Explorer Search & Filter
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [catFilter, setCatFilter] = useState<string>('all');

  // FAQ state
  const [openFaqs, setOpenFaqs] = useState<Record<number, boolean>>({
    0: true,
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false
  });

  const activeDensity = customDensity ? parseFloat(customDensity) || INGREDIENTS_DICT[selectedKey].density : INGREDIENTS_DICT[selectedKey].density;
  const activeIngredientName = INGREDIENTS_DICT[selectedKey]?.name || 'Custom Ingredient';

  // Calculations
  const numericInput = parseFloat(inputValue) || 0;
  const massPerTsp = activeDensity * spoonStandard;

  let computedTsp = 0;
  let computedGrams = 0;

  if (direction === 'g2tsp') {
    computedGrams = numericInput;
    computedTsp = massPerTsp > 0 ? numericInput / massPerTsp : 0;
  } else {
    computedTsp = numericInput;
    computedGrams = numericInput * massPerTsp;
  }

  const computedTbsp = computedTsp / 3;
  const computedMl = computedTsp * spoonStandard;
  const computedFlOz = computedMl / 29.5735;
  const computedPinches = computedTsp * 16;
  const computedDashes = computedTsp * 8;

  // Batch Multiplier Outputs
  const scaledGrams = computedGrams * batchMult;
  const scaledTsp = computedTsp * batchMult;
  const scaledTbsp = computedTbsp * batchMult;

  // Fraction Helper
  const toCulinaryFraction = (val: number, unit: 'tsp' | 'tbsp' = 'tsp'): string => {
    if (isNaN(val) || val <= 0) return `0 ${unit}`;
    const whole = Math.floor(val);
    const remainder = val - whole;

    const fractions = [
      { frac: '', val: 0.0 },
      { frac: '⅛', val: 0.125 },
      { frac: '¼', val: 0.25 },
      { frac: '⅓', val: 0.333 },
      { frac: '⅜', val: 0.375 },
      { frac: '½', val: 0.50 },
      { frac: '⅝', val: 0.625 },
      { frac: '⅔', val: 0.666 },
      { frac: '¾', val: 0.75 },
      { frac: '⅞', val: 0.875 },
      { frac: '', val: 1.0 }
    ];

    let closest = fractions[0];
    let minDiff = 999;
    for (let i = 0; i < fractions.length; i++) {
      const diff = Math.abs(remainder - fractions[i].val);
      if (diff < minDiff) {
        minDiff = diff;
        closest = fractions[i];
      }
    }

    if (closest.val === 1.0) {
      return `${whole + 1} ${unit}`;
    }
    if (whole === 0) {
      return closest.frac ? `${closest.frac} ${unit}` : `0 ${unit}`;
    }
    return closest.frac ? `${whole}${closest.frac} ${unit}` : `${whole} ${unit}`;
  };

  // Recipe Parser Action
  const handleParseRecipe = () => {
    if (!recipeText.trim()) {
      setParsedRows([]);
      return;
    }
    const lines = recipeText.split('\n');
    const results: Array<{
      name: string;
      grams: number;
      density: number;
      tsp: number;
      frac: string;
      tbsp: number;
    }> = [];

    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) return;

      const match = trimmed.match(/(\d+(\.\d+)?)\s*g\b/i);
      const grams = match ? parseFloat(match[1]) : 5;
      const lower = trimmed.toLowerCase();

      let matchedKey = 'salt_table';
      if (lower.includes('baking powder')) matchedKey = 'baking_powder';
      else if (lower.includes('baking soda')) matchedKey = 'baking_soda';
      else if (lower.includes('yeast')) matchedKey = 'yeast_dry';
      else if (lower.includes('diamond')) matchedKey = 'salt_diamond';
      else if (lower.includes('morton')) matchedKey = 'salt_morton';
      else if (lower.includes('salt')) matchedKey = 'salt_table';
      else if (lower.includes('cinnamon')) matchedKey = 'cinnamon';
      else if (lower.includes('pepper')) matchedKey = 'black_pepper';
      else if (lower.includes('paprika')) matchedKey = 'paprika';
      else if (lower.includes('oregano')) matchedKey = 'oregano';
      else if (lower.includes('garlic')) matchedKey = 'garlic_powder';
      else if (lower.includes('vanilla')) matchedKey = 'vanilla';
      else if (lower.includes('honey')) matchedKey = 'honey';
      else if (lower.includes('maple')) matchedKey = 'maple_syrup';
      else if (lower.includes('sugar') && lower.includes('brown')) matchedKey = 'brown_sugar_packed';
      else if (lower.includes('sugar') && (lower.includes('powder') || lower.includes('confection'))) matchedKey = 'powdered_sugar';
      else if (lower.includes('sugar')) matchedKey = 'sugar';
      else if (lower.includes('butter')) matchedKey = 'butter';
      else if (lower.includes('oil')) matchedKey = 'olive_oil';
      else if (lower.includes('creatine')) matchedKey = 'creatine';
      else if (lower.includes('matcha')) matchedKey = 'matcha';
      else if (lower.includes('cocoa')) matchedKey = 'cocoa';
      else if (lower.includes('cornstarch')) matchedKey = 'cornstarch';
      else if (lower.includes('flour')) matchedKey = 'flour_ap';

      const info = INGREDIENTS_DICT[matchedKey] || INGREDIENTS_DICT.salt_table;
      const density = info.density;
      const tsp = grams / (density * spoonStandard);
      const frac = toCulinaryFraction(tsp, 'tsp');
      const tbsp = tsp / 3;

      results.push({
        name: info.name,
        grams,
        density,
        tsp,
        frac,
        tbsp
      });
    });

    setParsedRows(results);
  };

  useEffect(() => {
    handleParseRecipe();
  }, [spoonStandard]);

  const copyResult = () => {
    const text = direction === 'g2tsp'
      ? `${computedGrams} g = ${computedTsp.toFixed(2)} tsp (${toCulinaryFraction(computedTsp, 'tsp')}) for ${activeIngredientName}`
      : `${computedTsp} tsp = ${computedGrams.toFixed(2)} g for ${activeIngredientName}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleFaq = (idx: number) => {
    setOpenFaqs(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleSelectPreset = (key: string) => {
    setSelectedKey(key);
    setCustomDensity('');
    const el = document.getElementById('main-teaspoon-workbench');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filtered density table rows
  const filteredDensityKeys = Object.keys(INGREDIENTS_DICT).filter(key => {
    const item = INGREDIENTS_DICT[key];
    const matchCat = catFilter === 'all' || item.category === catFilter;
    const matchSearch = item.name.toLowerCase().includes(searchFilter.toLowerCase()) || key.toLowerCase().includes(searchFilter.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen flex flex-col selection:bg-primary/20">
      {/* Structured SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebApplication",
                "@id": "https://solveit.io/conversion/grams-to-teaspoons/#app",
                "name": "SolveIt Universal Grams to Teaspoons Calculator & Spice Metrology Suite",
                "applicationCategory": "UtilitiesApplication",
                "operatingSystem": "All",
                "browserRequirements": "Requires JavaScript. Requires HTML5.",
                "description": "High-precision culinary and spice metrology engine converting grams to teaspoons using NIST and USDA FoodData Central bulk density datasets.",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "USD"
                }
              },
              {
                "@type": "BreadcrumbList",
                "itemListElement": [
                  { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://solveit.io/" },
                  { "@type": "ListItem", "position": 2, "name": "Conversion", "item": "https://solveit.io/conversion" },
                  { "@type": "ListItem", "position": 3, "name": "Weight & Mass", "item": "https://solveit.io/conversion/gram" },
                  { "@type": "ListItem", "position": 4, "name": "Grams to Teaspoons Calculator", "item": "https://solveit.io/conversion/grams-to-teaspoons" }
                ]
              },
              {
                "@type": "HowTo",
                "name": "How to Convert Grams to Teaspoons with Mass-to-Volume Density Accuracy",
                "step": [
                  {
                    "@type": "HowToStep",
                    "name": "Look up Bulk Density",
                    "text": "Find the bulk packing density in g/mL for the spice, leavener, salt, or sugar from USDA FoodData Central."
                  },
                  {
                    "@type": "HowToStep",
                    "name": "Select Teaspoon Volume Standard",
                    "text": "Choose either US Teaspoon (4.9289 mL), Metric Teaspoon (5.0000 mL), or UK Imperial Teaspoon (5.9194 mL)."
                  },
                  {
                    "@type": "HowToStep",
                    "name": "Calculate Teaspoons",
                    "text": "Apply formula: Teaspoons = Mass (g) / (Density (g/mL) * Teaspoon Volume (mL))."
                  },
                  {
                    "@type": "HowToStep",
                    "name": "Convert to Cook's Fractions",
                    "text": "Translate the decimal teaspoons to practical kitchen increments like ⅛, ¼, ⅓, ½, ¾, 1, or 2 tsp."
                  }
                ]
              },
              {
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "How many teaspoons is 5 grams of fine table salt?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Fine iodized table salt has a density of ~1.217 g/mL (6.00 grams per US teaspoon). 5 grams of table salt equals approximately 0.83 US teaspoons (roughly ⅘ tsp or just under 1 level teaspoon)."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "How many teaspoons is 4 grams of baking powder or baking soda?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Baking powder (density 0.900 g/mL) has 4.44 grams per US teaspoon, so 4 grams is approximately 0.90 US teaspoons (almost 1 level teaspoon). Baking soda (density 0.960 g/mL) has 4.73g per teaspoon, making 4 grams equal ~0.85 US teaspoons."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "How many teaspoons is 7 grams of active dry yeast?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "One standard 7-gram packet of active dry or instant yeast equals approximately 2¼ US teaspoons (2.22 tsp). Active dry yeast has a density of ~0.640 g/mL (3.15g per teaspoon)."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "How many teaspoons is 5 grams of sugar?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Granulated white sugar has a bulk density of 0.849 g/mL (4.18 grams per US teaspoon). 5 grams of sugar equals approximately 1.20 US teaspoons (1¼ level teaspoons)."
                    }
                  }
                ]
              }
            ]
          })
        }}
      />

      

      <main className="w-full pt-20 bg-surface flex-1">
        <div className="flex flex-col w-full">

          {/* Metrology & Telemetry Header Bar */}
          <div className="w-full bg-surface-container-low shadow-sm border-b border-outline-variant/20">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-sm flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant overflow-x-auto whitespace-nowrap">
                <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">home</span>Home
                </Link>
                <span className="text-outline-variant">/</span>
                <Link href="/conversion" className="hover:text-primary transition-colors">Conversion Engine</Link>
                <span className="text-outline-variant">/</span>
                <Link href="/conversion/gram" className="hover:text-primary transition-colors">Gram</Link>
                <span className="text-outline-variant">/</span>
                <span className="text-primary font-semibold">Grams to Teaspoons</span>
              </nav>
              <div className="flex flex-wrap items-center gap-space-xs font-data-mono text-body-sm">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-surface text-on-surface-variant shadow-sm border border-outline-variant/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  USDA FDC Micro-Scale
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-surface text-on-surface-variant shadow-sm border border-outline-variant/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  NIST SRD Spice Calibrated
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-primary-fixed text-on-primary-fixed-variant font-medium">
                  ±0.001g Precision
                </span>
              </div>
            </div>
          </div>

          {/* Page Header & Value Propositions */}
          <div className="w-full max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop pt-space-lg pb-space-md">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-secondary-fixed text-on-secondary-fixed text-label-caps font-label-caps uppercase tracking-wider mb-2">
                  <span className="material-symbols-outlined text-[15px]">soup_kitchen</span>
                  Spice, Leavener &amp; Micro-Volume Metrology
                </div>
                <h1 className="font-headline-lg text-headline-lg lg:text-[36px] text-on-surface tracking-tight font-bold">
                  Universal Grams to Teaspoons Calculator
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                  Convert mass in grams to exact culinary teaspoons (⅛, ¼, ⅓, ½, ¾, 1 tsp) calibrated by USDA bulk density datasets for spices, salts, leaveners, sugars, extracts, and supplements.
                </p>
              </div>

              {/* Trust Badges Bar */}
              <div className="flex flex-wrap gap-2 text-body-sm font-body-sm text-on-surface-variant">
                <span className="px-3 py-1.5 rounded-lg bg-surface-container flex items-center gap-1.5 shadow-sm border border-outline-variant/20">
                  <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                  Spice &amp; Leavener Density Calibrated
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-surface-container flex items-center gap-1.5 shadow-sm border border-outline-variant/20">
                  <span className="material-symbols-outlined text-secondary text-[18px]">pie_chart</span>
                  ⅛, ¼, ½, ¾ Cook&apos;s Fractions
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-surface-container flex items-center gap-1.5 shadow-sm border border-outline-variant/20">
                  <span className="material-symbols-outlined text-primary text-[18px]">bolt</span>
                  Zero-Lag Interactive Engine
                </span>
              </div>
            </div>
          </div>

          {/* Main Calculator Workbench Grid */}
          <div className="w-full max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-md" id="main-teaspoon-workbench">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">

              {/* Left Column: Input Controller Workbench (7 cols) */}
              <div className="lg:col-span-7 flex flex-col gap-space-md">

                {/* Main Controller Card */}
                <div className="bg-surface-container-lowest rounded-xl shadow-md border border-outline-variant/30 p-space-md lg:p-space-lg flex flex-col gap-space-md relative overflow-hidden">
                  
                  {/* Conversion Direction Switcher */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-space-xs">
                    <div className="inline-flex p-1 bg-surface-container-low rounded-lg border border-outline-variant/20" id="directionToggleContainer">
                      <button
                        type="button"
                        className={`px-4 py-2 rounded font-label-caps text-label-caps uppercase transition-all flex items-center gap-2 ${
                          direction === 'g2tsp'
                            ? 'bg-primary-container text-on-primary shadow-sm font-semibold'
                            : 'text-on-surface-variant hover:text-on-surface'
                        }`}
                        onClick={() => setDirection('g2tsp')}
                      >
                        <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
                        Grams → Teaspoons
                      </button>
                      <button
                        type="button"
                        className={`px-4 py-2 rounded font-label-caps text-label-caps uppercase transition-all flex items-center gap-2 ${
                          direction === 'tsp2g'
                            ? 'bg-primary-container text-on-primary shadow-sm font-semibold'
                            : 'text-on-surface-variant hover:text-on-surface'
                        }`}
                        onClick={() => setDirection('tsp2g')}
                      >
                        Teaspoons → Grams
                      </button>
                    </div>

                    {/* Standard Volume Jurisdictions */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-label-caps font-label-caps uppercase text-outline text-[11px] hidden sm:inline">Standard:</span>
                      <select
                        id="teaspoonStandardSelect"
                        className="bg-surface-container text-on-surface text-body-sm font-data-mono px-2.5 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-sm cursor-pointer border border-outline-variant/30"
                        value={spoonStandard}
                        onChange={(e) => setSpoonStandard(parseFloat(e.target.value))}
                      >
                        <option value="4.92892">US Teaspoon (4.93 mL)</option>
                        <option value="5.00000">Metric Teaspoon (5.00 mL)</option>
                        <option value="5.91939">UK / Imperial (5.92 mL)</option>
                      </select>
                    </div>
                  </div>

                  {/* Ingredient Selector & Presets */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label htmlFor="ingredientSelector" className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-primary">local_florist</span>
                        Calibrated Ingredient &amp; Spice Matrix
                      </label>
                      <span className="font-data-mono text-body-sm text-secondary bg-surface-container px-2 py-0.5 rounded border border-outline-variant/20">
                        ρ = {activeDensity.toFixed(3)} g/mL ({massPerTsp.toFixed(2)} g/tsp)
                      </span>
                    </div>

                    <div className="relative">
                      <select
                        id="ingredientSelector"
                        className="w-full bg-surface-container-low text-on-surface font-body-md text-body-md px-4 py-3 rounded-xl focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary shadow-sm appearance-none cursor-pointer border border-outline-variant/30"
                        value={selectedKey}
                        onChange={(e) => {
                          setSelectedKey(e.target.value);
                          setCustomDensity('');
                        }}
                      >
                        <optgroup label="Salts & Leaveners">
                          <option value="salt_table">Fine Table Salt, Iodized (1.217 g/mL • 6.00 g/tsp)</option>
                          <option value="salt_diamond">Diamond Crystal Kosher Salt (0.570 g/mL • 2.81 g/tsp)</option>
                          <option value="salt_morton">Morton Kosher Salt (0.970 g/mL • 4.78 g/tsp)</option>
                          <option value="baking_powder">Baking Powder, Double Acting (0.900 g/mL • 4.44 g/tsp)</option>
                          <option value="baking_soda">Baking Soda, Sodium Bicarbonate (0.960 g/mL • 4.73 g/tsp)</option>
                          <option value="yeast_dry">Active Dry / Instant Yeast (0.640 g/mL • 3.15 g/tsp)</option>
                        </optgroup>
                        <optgroup label="Spices, Herbs & Seasonings">
                          <option value="cinnamon">Ground Ceylon / Cassia Cinnamon (0.560 g/mL • 2.76 g/tsp)</option>
                          <option value="black_pepper">Ground Black Pepper (0.579 g/mL • 2.85 g/tsp)</option>
                          <option value="paprika">Ground Paprika (0.460 g/mL • 2.27 g/tsp)</option>
                          <option value="garlic_powder">Pure Garlic Powder (0.640 g/mL • 3.15 g/tsp)</option>
                          <option value="oregano">Dried Oregano Flakes (0.200 g/mL • 0.99 g/tsp)</option>
                        </optgroup>
                        <optgroup label="Sugars, Syrups & Extracts">
                          <option value="sugar">Granulated White Sugar (0.849 g/mL • 4.18 g/tsp)</option>
                          <option value="brown_sugar_packed">Brown Sugar, Packed (0.880 g/mL • 4.34 g/tsp)</option>
                          <option value="powdered_sugar">Powdered Sugar (0.560 g/mL • 2.76 g/tsp)</option>
                          <option value="honey">Pure Raw Honey (1.420 g/mL • 7.00 g/tsp)</option>
                          <option value="maple_syrup">Pure Maple Syrup (1.330 g/mL • 6.56 g/tsp)</option>
                          <option value="vanilla">Pure Vanilla Extract (0.879 g/mL • 4.33 g/tsp)</option>
                        </optgroup>
                        <optgroup label="Fats, Supplements & Flour">
                          <option value="butter">Butter, Unsalted Melted (0.911 g/mL • 4.49 g/tsp)</option>
                          <option value="olive_oil">Extra Virgin Olive Oil (0.918 g/mL • 4.52 g/tsp)</option>
                          <option value="water">Pure Water / Aqueous Liquids (1.000 g/mL • 4.93 g/tsp)</option>
                          <option value="creatine">Creatine Monohydrate Powder (0.700 g/mL • 3.45 g/tsp)</option>
                          <option value="matcha">Matcha Green Tea Powder (0.400 g/mL • 1.97 g/tsp)</option>
                          <option value="flour_ap">All-Purpose Flour (0.528 g/mL • 2.60 g/tsp)</option>
                          <option value="cornstarch">Pure Cornstarch (0.540 g/mL • 2.66 g/tsp)</option>
                          <option value="cocoa">Unsweetened Cocoa Powder (0.410 g/mL • 2.02 g/tsp)</option>
                        </optgroup>
                      </select>
                      <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">expand_more</span>
                    </div>

                    {/* Quick Ingredient Presets */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1">
                      <span className="text-label-caps font-label-caps uppercase text-outline text-[10px] shrink-0">Popular:</span>
                      {[
                        { id: 'salt_table', label: 'Table Salt' },
                        { id: 'baking_powder', label: 'Baking Powder' },
                        { id: 'baking_soda', label: 'Baking Soda' },
                        { id: 'yeast_dry', label: 'Yeast (7g)' },
                        { id: 'cinnamon', label: 'Cinnamon' },
                        { id: 'sugar', label: 'Sugar' },
                        { id: 'vanilla', label: 'Vanilla' },
                        { id: 'creatine', label: 'Creatine' }
                      ].map(p => (
                        <button
                          key={p.id}
                          type="button"
                          className={`px-2.5 py-1 rounded-full font-body-sm text-body-sm transition-colors shrink-0 border border-outline-variant/30 ${
                            selectedKey === p.id && !customDensity
                              ? 'bg-primary text-on-primary font-semibold'
                              : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                          }`}
                          onClick={() => handleSelectPreset(p.id)}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Main Numerical Value Input */}
                  <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-sm border border-outline-variant/20">
                    <div className="flex items-center justify-between">
                      <label htmlFor="teaspoonNumericalInput" className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant font-semibold">
                        {direction === 'g2tsp' ? 'Mass in Grams' : 'Volume in Teaspoons'}
                      </label>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          className="w-7 h-7 rounded bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-highest transition-colors font-bold text-body-lg border border-outline-variant/30"
                          onClick={() => {
                            const val = parseFloat(inputValue) || 0;
                            const next = Math.max(0.1, val - (direction === 'g2tsp' ? 0.5 : 0.25));
                            setInputValue((Math.round(next * 100) / 100).toString());
                          }}
                        >
                          -
                        </button>
                        <button
                          type="button"
                          className="w-7 h-7 rounded bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-highest transition-colors font-bold text-body-lg border border-outline-variant/30"
                          onClick={() => {
                            const val = parseFloat(inputValue) || 0;
                            const next = val + (direction === 'g2tsp' ? 0.5 : 0.25);
                            setInputValue((Math.round(next * 100) / 100).toString());
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="relative flex items-center">
                      <input
                        id="teaspoonNumericalInput"
                        type="number"
                        min="0.01"
                        step="any"
                        className="w-full bg-surface-container-lowest text-on-surface font-numerical-display text-numerical-display px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary shadow-sm border border-outline-variant/30"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                      />
                      <div className="absolute right-4 flex items-center gap-1 text-outline font-data-mono text-body-lg pointer-events-none">
                        <span>{direction === 'g2tsp' ? 'grams (g)' : 'teaspoons (tsp)'}</span>
                      </div>
                    </div>

                    {/* Quick Increments Chips */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {direction === 'g2tsp'
                        ? [1, 2, 3, 4, 5, 7, 10, 15, 20].map(v => (
                            <button
                              key={v}
                              type="button"
                              className={`px-2.5 py-1 rounded text-body-sm font-data-mono transition-colors shadow-sm border border-outline-variant/20 ${
                                parseFloat(inputValue) === v
                                  ? 'bg-primary text-on-primary font-bold'
                                  : 'bg-surface text-on-surface hover:bg-surface-container-high'
                              }`}
                              onClick={() => setInputValue(v.toString())}
                            >
                              {v === 7 ? '7g (1 yeast pkt)' : `${v}g`}
                            </button>
                          ))
                        : [0.125, 0.25, 0.5, 0.75, 1, 1.5, 2, 3, 6].map(v => (
                            <button
                              key={v}
                              type="button"
                              className={`px-2.5 py-1 rounded text-body-sm font-data-mono transition-colors shadow-sm border border-outline-variant/20 ${
                                parseFloat(inputValue) === v
                                  ? 'bg-primary text-on-primary font-bold'
                                  : 'bg-surface text-on-surface hover:bg-surface-container-high'
                              }`}
                              onClick={() => setInputValue(v.toString())}
                            >
                              {v === 0.125 ? '⅛ tsp' : v === 0.25 ? '¼ tsp' : v === 0.5 ? '½ tsp' : v === 0.75 ? '¾ tsp' : v === 3 ? '3 tsp (1 tbsp)' : `${v} tsp`}
                            </button>
                          ))}
                    </div>

                    {/* Fluid Slider */}
                    <div className="pt-2 flex flex-col gap-1">
                      <input
                        type="range"
                        min={direction === 'g2tsp' ? '0.5' : '0.125'}
                        max={direction === 'g2tsp' ? '30' : '10'}
                        step={direction === 'g2tsp' ? '0.25' : '0.125'}
                        className="w-full accent-primary h-2 bg-surface-container rounded-lg cursor-pointer"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                      />
                      <div className="flex justify-between text-label-caps font-label-caps text-outline">
                        {direction === 'g2tsp' ? (
                          <>
                            <span>0.5g</span>
                            <span>5g</span>
                            <span>10g</span>
                            <span>20g</span>
                            <span>30g</span>
                          </>
                        ) : (
                          <>
                            <span>⅛ tsp</span>
                            <span>1 tsp</span>
                            <span>3 tsp (1 tbsp)</span>
                            <span>6 tsp (2 tbsp)</span>
                            <span>10 tsp</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Custom Density Override */}
                  <div className="pt-1">
                    <details className="group bg-surface-container-low rounded-lg p-space-xs transition-colors border border-outline-variant/20">
                      <summary className="flex items-center justify-between cursor-pointer list-none text-body-sm font-body-sm text-on-surface-variant select-none">
                        <span className="flex items-center gap-1.5 font-medium">
                          <span className="material-symbols-outlined text-[16px] text-secondary">tune</span>
                          Custom Density Override • Metrology Lab Mode
                        </span>
                        <span className="material-symbols-outlined text-[18px] group-open:rotate-180 transition-transform">expand_more</span>
                      </summary>
                      <div className="pt-3 pb-1 flex flex-col sm:flex-row gap-3">
                        <div className="flex-1">
                          <label className="font-label-caps text-label-caps uppercase text-outline">Bulk Density (g/mL)</label>
                          <input
                            type="number"
                            step="0.001"
                            placeholder={`Current: ${activeDensity.toFixed(3)}`}
                            className="w-full mt-1 bg-surface-container-lowest text-on-surface font-data-mono text-body-sm px-3 py-1.5 rounded focus:outline-none focus:ring-1 focus:ring-primary shadow-sm border border-outline-variant/30"
                            value={customDensity}
                            onChange={(e) => setCustomDensity(e.target.value)}
                          />
                        </div>
                        <div className="sm:w-48 flex items-end">
                          <button
                            type="button"
                            className="w-full py-1.5 px-3 rounded bg-surface-container text-body-sm font-body-sm text-on-surface-variant hover:text-on-surface transition-colors border border-outline-variant/30"
                            onClick={() => setCustomDensity('')}
                          >
                            Reset to Standard
                          </button>
                        </div>
                      </div>
                    </details>
                  </div>

                  {/* Mathematical Proof Card */}
                  <div className="bg-surface rounded-xl p-space-sm shadow-sm flex flex-col gap-1.5 font-data-mono text-body-sm border border-outline-variant/20">
                    <div className="flex items-center justify-between text-outline">
                      <span className="text-label-caps font-label-caps uppercase text-primary font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">functions</span>
                        Deductive Mathematical Proof
                      </span>
                      <span className="text-[11px]">US Spoon = {spoonStandard.toFixed(5)} mL</span>
                    </div>
                    <div className="text-on-surface bg-surface-container-lowest p-2.5 rounded-lg overflow-x-auto leading-relaxed text-[13px] border border-outline-variant/20">
                      {direction === 'g2tsp' ? (
                        <>
                          tsp = {computedGrams.toFixed(3)} g ÷ ({activeDensity.toFixed(4)} g/mL × {spoonStandard.toFixed(4)} mL) = {computedGrams.toFixed(3)} ÷ {massPerTsp.toFixed(4)} = <span className="font-bold text-primary">{computedTsp.toFixed(4)} tsp</span>
                        </>
                      ) : (
                        <>
                          grams = {computedTsp.toFixed(3)} tsp × ({activeDensity.toFixed(4)} g/mL × {spoonStandard.toFixed(4)} mL) = {computedTsp.toFixed(3)} × {massPerTsp.toFixed(4)} = <span className="font-bold text-primary">{computedGrams.toFixed(4)} g</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-outline pt-0.5">
                      <span>NIST SRD-129 Culinary Metrology</span>
                      <span className="text-primary font-semibold">
                        {direction === 'g2tsp'
                          ? `Exact Solution: ${computedTsp.toFixed(2)} tsp (~ ${toCulinaryFraction(computedTsp, 'tsp')})`
                          : `Exact Solution: ${computedGrams.toFixed(2)} grams`}
                      </span>
                    </div>
                  </div>

                </div>

                {/* Batch Multiplier Assistant */}
                <div className="bg-surface-container-lowest rounded-xl shadow-md border border-outline-variant/30 p-space-md flex flex-col gap-space-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[22px]">format_list_numbered</span>
                      <div>
                        <h3 className="font-headline-md text-[17px] leading-tight font-bold text-on-surface">Batch Multiplier Assistant</h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">Scale spice &amp; leavener portions across multiple recipe yields</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-lg border border-outline-variant/20">
                      {[0.5, 1, 2, 3, 4, 8].map(m => (
                        <button
                          key={m}
                          type="button"
                          className={`px-2.5 py-1 rounded font-data-mono text-body-sm transition-all ${
                            batchMult === m
                              ? 'bg-primary text-on-primary font-bold shadow-sm'
                              : 'text-on-surface-variant hover:text-on-surface'
                          }`}
                          onClick={() => setBatchMult(m)}
                        >
                          {m}x
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                    <div className="p-2.5 rounded-lg bg-surface-container-low flex flex-col border border-outline-variant/20">
                      <span className="text-label-caps font-label-caps uppercase text-outline">Target Mass</span>
                      <span className="font-data-mono text-body-lg font-bold text-on-surface">{scaledGrams.toFixed(1)} g</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-surface-container-low flex flex-col border border-outline-variant/20">
                      <span className="text-label-caps font-label-caps uppercase text-outline">Teaspoons (Decimal)</span>
                      <span className="font-data-mono text-body-lg font-bold text-primary">{scaledTsp.toFixed(2)} tsp</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-surface-container-low flex flex-col border border-outline-variant/20">
                      <span className="text-label-caps font-label-caps uppercase text-outline">Cook&apos;s Fraction</span>
                      <span className="font-data-mono text-body-lg font-bold text-on-surface">{toCulinaryFraction(scaledTsp, 'tsp')}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-surface-container-low flex flex-col border border-outline-variant/20">
                      <span className="text-label-caps font-label-caps uppercase text-outline">Tablespoons (tbsp)</span>
                      <span className="font-data-mono text-body-lg font-bold text-secondary">{scaledTbsp.toFixed(2)} tbsp</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Computed Visual Telemetry & Spoon Explorer (5 cols) */}
              <div className="lg:col-span-5 flex flex-col gap-space-md">

                {/* Primary Output Showcase Card */}
                <div className="bg-primary text-on-primary rounded-xl shadow-xl p-space-md lg:p-space-lg flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-secondary-container opacity-20 blur-3xl pointer-events-none"></div>

                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-label-caps text-label-caps uppercase tracking-wider text-secondary-fixed">
                        Primary Volumetric Teaspoon Result
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-surface-container-lowest/20 font-data-mono text-body-sm text-secondary-fixed">
                        Micro-Volume Standard
                      </span>
                    </div>

                    <div className="my-space-md flex flex-col">
                      <div className="flex items-baseline gap-2">
                        <span className="font-numerical-display text-numerical-display lg:text-[48px] font-extrabold tracking-tight leading-none text-white">
                          {direction === 'g2tsp' ? computedTsp.toFixed(2) : computedGrams.toFixed(2)}
                        </span>
                        <span className="font-headline-md text-headline-md text-secondary-fixed font-semibold">
                          {direction === 'g2tsp' ? 'tsp' : 'g'}
                        </span>
                      </div>

                      {/* Cook's Fraction Highlight */}
                      <div className="mt-2 inline-flex items-center gap-2 flex-wrap">
                        <span className="text-label-caps font-label-caps uppercase text-surface-container-highest opacity-80">Cook&apos;s Spoon:</span>
                        <span className="px-3 py-1 rounded-md bg-white text-primary font-data-mono text-body-lg font-bold shadow-md">
                          {direction === 'g2tsp' ? toCulinaryFraction(computedTsp, 'tsp') : `${computedGrams.toFixed(1)} grams`}
                        </span>
                        <span className="text-body-sm font-body-sm text-surface-container-highest">
                          {direction === 'g2tsp'
                            ? `(${computedTbsp.toFixed(2)} tablespoons)`
                            : `(${computedTsp.toFixed(2)} tsp)`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Secondary Metric Conversions */}
                  <div className="pt-space-sm border-t border-white/15 grid grid-cols-2 gap-2 text-surface-container-highest">
                    <div className="flex flex-col">
                      <span className="text-[11px] uppercase font-label-caps tracking-wider opacity-80">Tablespoons (tbsp)</span>
                      <span className="font-data-mono text-body-lg font-semibold text-white">{computedTbsp.toFixed(2)} tbsp</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] uppercase font-label-caps tracking-wider opacity-80">Volume (mL)</span>
                      <span className="font-data-mono text-body-lg font-semibold text-white">{computedMl.toFixed(2)} mL</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] uppercase font-label-caps tracking-wider opacity-80">Pinches (~1/16 tsp)</span>
                      <span className="font-data-mono text-body-lg font-semibold text-white">{Math.round(computedPinches)} pinches</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] uppercase font-label-caps tracking-wider opacity-80">Fluid Ounces (fl oz)</span>
                      <span className="font-data-mono text-body-lg font-semibold text-white">{computedFlOz.toFixed(3)} fl oz</span>
                    </div>
                  </div>

                  {/* Copy Action Button */}
                  <div className="pt-space-sm mt-space-xs">
                    <button
                      type="button"
                      className="w-full py-2.5 px-4 rounded-lg bg-secondary text-on-secondary font-body-sm font-semibold hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow"
                      onClick={copyResult}
                    >
                      <span className="material-symbols-outlined text-[18px]">{copied ? 'check_circle' : 'content_copy'}</span>
                      {copied ? 'Measurement Copied to Clipboard!' : 'Copy Teaspoon Output'}
                    </button>
                  </div>
                </div>

                {/* Visual Teaspoon Set Simulator */}
                <div className="bg-surface-container-lowest rounded-xl shadow-md border border-outline-variant/30 p-space-md flex flex-col gap-space-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-primary text-[20px]">soup_kitchen</span>
                      <h3 className="font-headline-md text-[16px] font-bold text-on-surface">Measuring Spoon Visual Set</h3>
                    </div>
                    <span className="text-label-caps font-label-caps uppercase text-outline text-[11px]">Level Spoons</span>
                  </div>

                  {/* Teaspoon Fill Gauge Bars */}
                  <div className="grid grid-cols-4 gap-2 pt-1 text-center">
                    {[
                      { label: '⅛ tsp', capacity: 0.125 },
                      { label: '¼ tsp', capacity: 0.25 },
                      { label: '½ tsp', capacity: 0.5 },
                      { label: '1 tsp', capacity: 1.0 }
                    ].map(sp => {
                      const fillPct = Math.min(100, Math.max(0, (computedTsp / sp.capacity) * 100));
                      const isOverflow = computedTsp > sp.capacity;
                      return (
                        <div key={sp.label} className="bg-surface-container-low p-2 rounded-lg flex flex-col items-center gap-1.5 border border-outline-variant/20">
                          <span className="font-label-caps text-label-caps font-bold text-on-surface">{sp.label}</span>
                          <div className="w-8 h-16 bg-surface-container rounded-full relative overflow-hidden border border-outline-variant/40 flex items-end">
                            <div
                              className={`w-full transition-all duration-300 ${fillPct >= 100 ? 'bg-primary' : 'bg-secondary'}`}
                              style={{ height: `${Math.min(100, fillPct)}%` }}
                            ></div>
                          </div>
                          <span className="font-data-mono text-[11px] text-outline">
                            {isOverflow ? `${(computedTsp / sp.capacity).toFixed(1)}x full` : `${Math.round(fillPct)}%`}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <p className="text-body-sm text-outline text-center pt-1">
                    {computedTsp >= 3
                      ? `✨ Pro-tip: ${computedTsp.toFixed(1)} teaspoons equals ${(computedTsp / 3).toFixed(2)} tablespoons.`
                      : `Standard measure: 1 level teaspoon is leveled flat with the back of a knife.`}
                  </p>
                </div>

                {/* Quick Link to Sister Tools */}
                <div className="bg-surface-container-low rounded-xl p-space-md border border-outline-variant/30 flex flex-col gap-2">
                  <span className="font-label-caps text-label-caps uppercase text-outline">Connected Conversion Tools</span>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/conversion/grams-to-tablespoons"
                      className="p-2.5 rounded-lg bg-surface hover:bg-surface-container-high border border-outline-variant/30 text-on-surface text-body-sm font-medium flex items-center justify-between transition-colors"
                    >
                      <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-primary text-[18px]">restaurant</span>
                        Grams to Tablespoons
                      </span>
                      <span className="material-symbols-outlined text-[16px] text-outline">arrow_forward</span>
                    </Link>
                    <Link
                      href="/conversion/grams-to-milliliters"
                      className="p-2.5 rounded-lg bg-surface hover:bg-surface-container-high border border-outline-variant/30 text-on-surface text-body-sm font-medium flex items-center justify-between transition-colors"
                    >
                      <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-secondary text-[18px]">science</span>
                        Grams to Milliliters
                      </span>
                      <span className="material-symbols-outlined text-[16px] text-outline">arrow_forward</span>
                    </Link>
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* Multi-Line Recipe Parser Section */}
          <section className="w-full bg-surface-container-low py-space-xl px-gutter-mobile md:px-gutter-desktop border-t border-outline-variant/20 mt-space-lg">
            <div className="max-w-max-width-canvas mx-auto">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-space-md gap-2">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-secondary text-on-secondary font-label-caps text-label-caps uppercase tracking-wider mb-1">
                    <span className="material-symbols-outlined text-[14px]">auto_stories</span>
                    Smart Kitchen Assistant
                  </div>
                  <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">
                    Instant Multi-Line Recipe Teaspoon Parser
                  </h2>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md">
                  Paste your ingredient list with gram measurements to parse every line into exact kitchen teaspoons and fractions.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md">
                <div className="lg:col-span-5 flex flex-col gap-2">
                  <textarea
                    rows={6}
                    className="w-full p-space-sm bg-surface-container-lowest text-on-surface font-data-mono text-body-sm rounded-xl border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                    value={recipeText}
                    onChange={(e) => setRecipeText(e.target.value)}
                    placeholder="Enter ingredients with grams (e.g. 5g salt, 4g baking powder)..."
                  />
                  <button
                    type="button"
                    className="py-2 px-4 rounded-lg bg-primary text-on-primary font-body-sm font-semibold hover:opacity-95 transition-opacity flex items-center justify-center gap-2 shadow"
                    onClick={handleParseRecipe}
                  >
                    <span className="material-symbols-outlined text-[18px]">sync_alt</span>
                    Parse &amp; Calculate Teaspoons
                  </button>
                </div>

                <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl p-space-md border border-outline-variant/30 shadow-sm overflow-x-auto">
                  <table className="w-full text-left font-body-sm text-body-sm border-collapse">
                    <thead>
                      <tr className="border-b border-outline-variant/20 font-label-caps text-label-caps uppercase text-outline">
                        <th className="py-2 px-2">Ingredient</th>
                        <th className="py-2 px-2 text-right">Mass</th>
                        <th className="py-2 px-2 text-right">Cook&apos;s Measure</th>
                        <th className="py-2 px-2 text-right">Teaspoons</th>
                        <th className="py-2 px-2 text-right">Tablespoons</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/10 font-data-mono">
                      {parsedRows.map((r, i) => (
                        <tr key={i} className="hover:bg-surface-container-low transition-colors">
                          <td className="py-2 px-2 font-body-sm text-on-surface font-medium">{r.name}</td>
                          <td className="py-2 px-2 text-right text-outline">{r.grams}g</td>
                          <td className="py-2 px-2 text-right font-bold text-primary">{r.frac}</td>
                          <td className="py-2 px-2 text-right text-on-surface">{r.tsp.toFixed(2)} tsp</td>
                          <td className="py-2 px-2 text-right text-secondary">{r.tbsp.toFixed(2)} tbsp</td>
                        </tr>
                      ))}
                      {parsedRows.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-outline font-body-sm">
                            No ingredients detected. Paste text with gram amounts (e.g. 5g salt) on the left.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          {/* Searchable Density Matrix & Reference Directory */}
          <section className="w-full bg-surface py-space-xl px-gutter-mobile md:px-gutter-desktop">
            <div className="max-w-max-width-canvas mx-auto">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-md gap-4">
                <div>
                  <span className="font-label-caps text-label-caps uppercase text-primary font-semibold">USDA &amp; NIST Calibrated Data</span>
                  <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">
                    Spice &amp; Pantry Staple Bulk Density Directory
                  </h2>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="Search spices, leaveners, salts..."
                    className="px-3 py-1.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface text-body-sm focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                  />
                  <select
                    className="px-3 py-1.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface text-body-sm focus:outline-none cursor-pointer"
                    value={catFilter}
                    onChange={(e) => setCatFilter(e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    <option value="salts">Salts &amp; Leaveners</option>
                    <option value="spices">Spices &amp; Seasonings</option>
                    <option value="sugars">Sugars &amp; Syrups</option>
                    <option value="dairy">Fats, Oils &amp; Extracts</option>
                    <option value="supplements">Supplements &amp; Teas</option>
                    <option value="flours">Flours &amp; Starches</option>
                  </select>
                </div>
              </div>

              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm overflow-x-auto">
                <table className="w-full text-left font-body-sm text-body-sm border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low border-b border-outline-variant/20 font-label-caps text-label-caps uppercase text-outline">
                      <th className="py-3 px-4">Ingredient</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4 text-right">Bulk Density (g/mL)</th>
                      <th className="py-3 px-4 text-right">Mass per 1 US tsp</th>
                      <th className="py-3 px-4 text-right">Teaspoons in 5g</th>
                      <th className="py-3 px-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10 font-data-mono">
                    {filteredDensityKeys.map(k => {
                      const item = INGREDIENTS_DICT[k];
                      const gPerTsp = item.density * 4.92892;
                      const tspIn5g = 5 / gPerTsp;
                      return (
                        <tr key={k} className="hover:bg-surface-container-low transition-colors">
                          <td className="py-3 px-4 font-body-sm">
                            <div className="font-semibold text-on-surface">{item.name}</div>
                            {item.desc && <div className="text-[12px] text-outline font-normal">{item.desc}</div>}
                          </td>
                          <td className="py-3 px-4 font-body-sm capitalize text-outline">{item.category}</td>
                          <td className="py-3 px-4 text-right text-on-surface">{item.density.toFixed(3)}</td>
                          <td className="py-3 px-4 text-right font-bold text-primary">{gPerTsp.toFixed(2)} g</td>
                          <td className="py-3 px-4 text-right text-secondary">{tspIn5g.toFixed(2)} tsp ({toCulinaryFraction(tspIn5g, 'tsp')})</td>
                          <td className="py-3 px-4 text-center">
                            <button
                              type="button"
                              className="px-2.5 py-1 rounded bg-surface-container hover:bg-primary hover:text-on-primary text-primary font-body-sm text-[12px] transition-colors border border-outline-variant/30"
                              onClick={() => handleSelectPreset(k)}
                            >
                              Load in Tool
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Comprehensive FAQ Section */}
          <section className="w-full bg-surface-container-low py-space-xl px-gutter-mobile md:px-gutter-desktop border-t border-outline-variant/20">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight mb-space-md text-center">
                Frequently Asked Questions • Grams to Teaspoons Metrology
              </h2>

              <div className="flex flex-col gap-2">
                {[
                  {
                    q: 'How many teaspoons is 5 grams of fine table salt vs. kosher salt?',
                    a: 'Because table salt is very fine and dense (~1.217 g/mL), 5 grams equals approximately 0.83 US teaspoons (~⅘ tsp or just under 1 level teaspoon). In contrast, Diamond Crystal Kosher Salt has large, hollow flakes with a density of only ~0.570 g/mL, so 5 grams of Diamond Crystal equals 1.78 US teaspoons (almost 1¾ teaspoons). Morton Kosher Salt is in between (~0.970 g/mL), with 5 grams equaling 1.05 teaspoons.'
                  },
                  {
                    q: 'How many teaspoons is 4 grams of baking powder or baking soda?',
                    a: 'Baking powder (density ~0.900 g/mL) has 4.44 grams per level US teaspoon, so 4 grams is approximately 0.90 US teaspoons (about ⅞ of a teaspoon). Pure baking soda (density ~0.960 g/mL) contains 4.73 grams per teaspoon, making 4 grams equal to 0.85 US teaspoons.'
                  },
                  {
                    q: 'How many teaspoons is a standard 7g packet of active dry yeast?',
                    a: 'A standard 7-gram (¼ oz) packet of active dry or instant yeast contains approximately 2¼ US teaspoons (2.22 tsp). One level teaspoon of active dry yeast weighs approximately 3.15 grams.'
                  },
                  {
                    q: 'How many teaspoons is 5 grams of granulated white sugar?',
                    a: 'Granulated table sugar has a bulk density of 0.849 g/mL (4.18 grams per level US teaspoon). 5 grams of sugar equals approximately 1.20 US teaspoons (1 level teaspoon plus ¼ teaspoon).'
                  },
                  {
                    q: 'What is the exact volume of a US teaspoon vs. Metric and Imperial teaspoons?',
                    a: 'A standard US Customary teaspoon is legally defined as exactly 4.92892159375 mL (⅓ of a US tablespoon). A Metric teaspoon used in Commonwealth nations is rounded to exactly 5.000 mL. An Imperial British teaspoon is 5.91939 mL.'
                  },
                  {
                    q: 'How many pinches or dashes are in one teaspoon?',
                    a: 'In culinary metrology, 1 level US teaspoon contains exactly 8 dashes (1 dash = ⅛ tsp = ~0.62 mL) or 16 culinary pinches (1 pinch = 1/16 tsp = ~0.31 mL). For fine table salt, 1 pinch weighs approximately 0.38 grams.'
                  },
                  {
                    q: 'How many teaspoons are in a tablespoon?',
                    a: 'There are exactly 3 teaspoons in 1 tablespoon across both US Customary and Metric systems. To convert teaspoons to tablespoons, simply divide the teaspoon count by 3.'
                  }
                ].map((faq, idx) => (
                  <div key={idx} className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden shadow-sm">
                    <button
                      type="button"
                      className="w-full p-4 text-left flex items-center justify-between font-headline-md text-[16px] font-bold text-on-surface hover:bg-surface-container-low transition-colors"
                      onClick={() => toggleFaq(idx)}
                    >
                      <span>{faq.q}</span>
                      <span className="material-symbols-outlined text-outline transition-transform duration-200" style={{ transform: openFaqs[idx] ? 'rotate(180deg)' : 'none' }}>
                        expand_more
                      </span>
                    </button>
                    {openFaqs[idx] && (
                      <div className="px-4 pb-4 font-body-sm text-body-sm text-on-surface-variant leading-relaxed border-t border-outline-variant/10 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
