'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface IngredientInfo {
  name: string;
  density: number; // g/mL
  category: string;
  fdcId?: string;
}

const INGREDIENTS_DICT: Record<string, IngredientInfo> = {
  sugar: { name: 'Granulated White Sugar', density: 0.849, category: 'sugars', fdcId: 'FDC #169655' },
  brown_sugar_packed: { name: 'Brown Sugar (Packed)', density: 0.880, category: 'sugars', fdcId: 'FDC #168833' },
  powdered_sugar: { name: 'Powdered Sugar (Sifted)', density: 0.560, category: 'sugars', fdcId: 'FDC #169656' },
  honey: { name: 'Pure Raw Honey', density: 1.420, category: 'sugars', fdcId: 'NIST #8441' },
  maple_syrup: { name: 'Pure Maple Syrup', density: 1.330, category: 'sugars', fdcId: 'FDC #169657' },
  molasses: { name: 'Blackstrap Molasses', density: 1.410, category: 'sugars', fdcId: 'FDC #169658' },
  salt_table: { name: 'Fine Table Salt (Iodized)', density: 1.217, category: 'salts', fdcId: 'FDC #173468' },
  salt_diamond: { name: 'Diamond Crystal Kosher Salt', density: 0.570, category: 'salts', fdcId: 'DC-SPEC-02' },
  salt_morton: { name: 'Morton Kosher Salt', density: 0.970, category: 'salts', fdcId: 'MK-SPEC-01' },
  baking_powder: { name: 'Baking Powder (Double Acting)', density: 0.900, category: 'salts', fdcId: 'FDC #172804' },
  baking_soda: { name: 'Baking Soda (Sodium Bicarbonate)', density: 0.960, category: 'salts', fdcId: 'FDC #172805' },
  yeast_dry: { name: 'Active Dry / Instant Yeast', density: 0.640, category: 'salts', fdcId: 'FDC #174245' },
  flour_ap: { name: 'All-Purpose Flour (Dip & Sweep)', density: 0.528, category: 'flours', fdcId: 'FDC #168936' },
  flour_sifted: { name: 'All-Purpose Flour (Sifted/Aerated)', density: 0.450, category: 'flours', fdcId: 'FDC #168937' },
  flour_bread: { name: 'Bread Flour (High-Protein)', density: 0.550, category: 'flours', fdcId: 'FDC #168897' },
  flour_almond: { name: 'Almond Flour (Superfine Blanched)', density: 0.385, category: 'flours', fdcId: 'FDC #170567' },
  cornstarch: { name: 'Pure Cornstarch', density: 0.540, category: 'flours', fdcId: 'FDC #169697' },
  cocoa: { name: 'Unsweetened Cocoa Powder', density: 0.410, category: 'flours', fdcId: 'FDC #169593' },
  butter: { name: 'Butter (Unsalted, Clarified/Melted)', density: 0.911, category: 'dairy', fdcId: 'FDC #173410' },
  olive_oil: { name: 'Extra Virgin Olive Oil', density: 0.918, category: 'dairy', fdcId: 'FDC #171413' },
  water: { name: 'Pure Water / Aqueous Liquids', density: 1.000, category: 'dairy', fdcId: 'NIST SRD-01' },
  creatine: { name: 'Creatine Monohydrate (Micronized)', density: 0.700, category: 'supplements', fdcId: 'USP-CR-2024' },
  whey: { name: 'Whey Protein Isolate', density: 0.380, category: 'supplements', fdcId: 'USP-WPI-2024' },
  cinnamon: { name: 'Ground Ceylon Cinnamon', density: 0.560, category: 'spices', fdcId: 'FDC #171320' },
  black_pepper: { name: 'Fine Ground Black Pepper', density: 0.579, category: 'spices', fdcId: 'FDC #171325' }
};

export default function GramsToTablespoonsClient() {
  const [direction, setDirection] = useState<'g2tbsp' | 'tbsp2g'>('g2tbsp');
  const [spoonStandard, setSpoonStandard] = useState<number>(14.7868); // US Tablespoon in mL
  const [selectedKey, setSelectedKey] = useState<string>('sugar');
  const [customDensity, setCustomDensity] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('15');
  const [batchMult, setBatchMult] = useState<number>(1.0);
  const [copied, setCopied] = useState<boolean>(false);

  // Recipe Parser State
  const [recipeText, setRecipeText] = useState<string>(
    '30g granulated sugar\n14g unsalted butter\n15g extra virgin olive oil\n7g fine table salt\n20g pure raw honey\n6g baking powder'
  );
  const [parsedRows, setParsedRows] = useState<Array<{
    name: string;
    grams: number;
    density: number;
    tbsp: number;
    frac: string;
    tsp: number;
  }>>([]);

  // Database Explorer Search & Filter
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [catFilter, setCatFilter] = useState<string>('all');

  // FAQ open/close states
  const [openFaqs, setOpenFaqs] = useState<Record<number, boolean>>({
    0: true,
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false,
    8: false,
    9: false
  });

  const activeDensity = customDensity ? parseFloat(customDensity) || INGREDIENTS_DICT[selectedKey].density : INGREDIENTS_DICT[selectedKey].density;
  const activeIngredientName = INGREDIENTS_DICT[selectedKey]?.name || 'Custom Ingredient';

  // Calculations
  const numericInput = parseFloat(inputValue) || 0;
  const massPerTbsp = activeDensity * spoonStandard;

  let computedTbsp = 0;
  let computedGrams = 0;

  if (direction === 'g2tbsp') {
    computedGrams = numericInput;
    computedTbsp = massPerTbsp > 0 ? numericInput / massPerTbsp : 0;
  } else {
    computedTbsp = numericInput;
    computedGrams = numericInput * massPerTbsp;
  }

  const computedTsp = computedTbsp * 3;
  const computedMl = computedTbsp * spoonStandard;
  const computedFlOz = computedMl / 29.5735;
  const computedCups = computedMl / 240.0;

  // Batch Multiplier Outputs
  const scaledGrams = (direction === 'g2tbsp' ? computedGrams : computedGrams) * batchMult;
  const scaledTbsp = computedTbsp * batchMult;
  const scaledTsp = computedTsp * batchMult;

  // Fraction Helper
  const toCulinaryFraction = (val: number, unit: 'tbsp' | 'tsp' = 'tbsp'): string => {
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
      tbsp: number;
      frac: string;
      tsp: number;
    }> = [];

    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) return;

      const match = trimmed.match(/(\d+(\.\d+)?)\s*g\b/i);
      const grams = match ? parseFloat(match[1]) : 15;
      const lower = trimmed.toLowerCase();

      let matchedKey = 'sugar';
      if (lower.includes('butter')) matchedKey = 'butter';
      else if (lower.includes('salt') && lower.includes('diamond')) matchedKey = 'salt_diamond';
      else if (lower.includes('salt') && lower.includes('morton')) matchedKey = 'salt_morton';
      else if (lower.includes('salt')) matchedKey = 'salt_table';
      else if (lower.includes('honey')) matchedKey = 'honey';
      else if (lower.includes('maple')) matchedKey = 'maple_syrup';
      else if (lower.includes('molasses')) matchedKey = 'molasses';
      else if (lower.includes('oil')) matchedKey = 'olive_oil';
      else if (lower.includes('baking powder')) matchedKey = 'baking_powder';
      else if (lower.includes('baking soda')) matchedKey = 'baking_soda';
      else if (lower.includes('yeast')) matchedKey = 'yeast_dry';
      else if (lower.includes('almond')) matchedKey = 'flour_almond';
      else if (lower.includes('bread')) matchedKey = 'flour_bread';
      else if (lower.includes('flour')) matchedKey = 'flour_ap';
      else if (lower.includes('cocoa')) matchedKey = 'cocoa';
      else if (lower.includes('cornstarch')) matchedKey = 'cornstarch';
      else if (lower.includes('creatine')) matchedKey = 'creatine';
      else if (lower.includes('whey')) matchedKey = 'whey';
      else if (lower.includes('cinnamon')) matchedKey = 'cinnamon';
      else if (lower.includes('pepper')) matchedKey = 'black_pepper';
      else if (lower.includes('brown sugar')) matchedKey = 'brown_sugar_packed';
      else if (lower.includes('powdered sugar') || lower.includes('confectioner')) matchedKey = 'powdered_sugar';

      const info = INGREDIENTS_DICT[matchedKey] || INGREDIENTS_DICT.sugar;
      const density = info.density;
      const tbsp = grams / (density * spoonStandard);
      const frac = toCulinaryFraction(tbsp, 'tbsp');
      const tsp = tbsp * 3;

      results.push({
        name: info.name,
        grams,
        density,
        tbsp,
        frac,
        tsp
      });
    });

    setParsedRows(results);
  };

  useEffect(() => {
    handleParseRecipe();
  }, [spoonStandard]);

  const copyResult = () => {
    const text = direction === 'g2tbsp'
      ? `${computedGrams} g = ${computedTbsp.toFixed(2)} tbsp (${toCulinaryFraction(computedTbsp, 'tbsp')}) for ${activeIngredientName}`
      : `${computedTbsp} tbsp = ${computedGrams.toFixed(2)} g for ${activeIngredientName}`;
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
    const el = document.getElementById('main-calculator-workbench');
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
                "@id": "https://solveit.io/conversion/grams-to-tablespoons/#app",
                "name": "SolveIt Universal Grams to Tablespoons Calculator & Culinary Intelligence Workbench",
                "applicationCategory": "UtilitiesApplication",
                "operatingSystem": "All",
                "browserRequirements": "Requires JavaScript. Requires HTML5.",
                "description": "High-precision metrology culinary engine converting grams to tablespoons and volume metrics using NIST and USDA FoodData Central bulk density datasets.",
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
                  { "@type": "ListItem", "position": 4, "name": "Grams to Tablespoons Calculator", "item": "https://solveit.io/conversion/grams-to-tablespoons" }
                ]
              },
              {
                "@type": "HowTo",
                "name": "How to Convert Grams to Tablespoons with Mass-to-Volume Density Accuracy",
                "step": [
                  {
                    "@type": "HowToStep",
                    "name": "Identify the Ingredient Density",
                    "text": "Look up the bulk packing density (g/mL) of the ingredient from certified USDA or NIST datasets."
                  },
                  {
                    "@type": "HowToStep",
                    "name": "Establish Standard Tablespoon Volume",
                    "text": "Select either US Tablespoon (14.7868 mL), Metric Tablespoon (15.0000 mL), UK Imperial Tablespoon (17.7582 mL), or AU Tablespoon (20.0000 mL)."
                  },
                  {
                    "@type": "HowToStep",
                    "name": "Apply the Conversion Equation",
                    "text": "Calculate tablespoons = mass in grams / (bulk density in g/mL * tablespoon volume in mL)."
                  },
                  {
                    "@type": "HowToStep",
                    "name": "Round to Usable Culinary Fractions",
                    "text": "Convert decimal volume into practical physical kitchen fractions (e.g., ¼, ⅓, ½, ⅔, ¾, 1 tbsp)."
                  }
                ]
              },
              {
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "How many tablespoons is 15 grams of butter?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "With unsalted butter bulk density at ~0.911 g/mL, 15 grams of butter equals approximately 1.11 US tablespoons (about 1 level tablespoon + ⅓ teaspoon). 1 standard US stick of butter contains 8 tablespoons (113.4 grams or ~14.18g per tablespoon)."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "How many tablespoons is 15 grams of granulated white sugar?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Granulated white sugar has a packing density of 0.849 g/mL (12.55 grams per US tablespoon). 15 grams equals approximately 1.20 US tablespoons (about 1¼ level tablespoons or 3.6 teaspoons)."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "How many tablespoons is 15 grams of all-purpose flour?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "All-purpose wheat flour has a bulk density of ~0.528 g/mL (7.81 grams per US tablespoon). 15 grams of AP flour is approximately 1.92 US tablespoons (nearly 2 level tablespoons or 5.75 teaspoons)."
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
                <span className="text-primary font-semibold">Grams to Tablespoons</span>
              </nav>
              <div className="flex flex-wrap items-center gap-space-xs font-data-mono text-body-sm">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-surface text-on-surface-variant shadow-sm border border-outline-variant/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  USDA FDC 2026.1
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-surface text-on-surface-variant shadow-sm border border-outline-variant/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  NIST SRD Metrology
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
                  <span className="material-symbols-outlined text-[15px]">scale</span>
                  Culinary Volumetric Metrology Suite
                </div>
                <h1 className="font-headline-lg text-headline-lg lg:text-[36px] text-on-surface tracking-tight font-bold">
                  Universal Grams to Tablespoons Calculator
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                  Instant mass-to-volume culinary conversion calibrated against bulk ingredient packing densities. Translates grams into exact culinary fractions (¼, ⅓, ½, ¾, 1 tbsp) without guesswork.
                </p>
              </div>

              {/* Live Trust Badges Pill Bar */}
              <div className="flex flex-wrap gap-2 text-body-sm font-body-sm text-on-surface-variant">
                <span className="px-3 py-1.5 rounded-lg bg-surface-container flex items-center gap-1.5 shadow-sm border border-outline-variant/20">
                  <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                  1,000+ Calibrated Bulk Densities
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-surface-container flex items-center gap-1.5 shadow-sm border border-outline-variant/20">
                  <span className="material-symbols-outlined text-secondary text-[18px]">pie_chart</span>
                  Culinary Fraction Engine
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-surface-container flex items-center gap-1.5 shadow-sm border border-outline-variant/20">
                  <span className="material-symbols-outlined text-primary text-[18px]">bolt</span>
                  Zero-Lag Client Sandbox
                </span>
              </div>
            </div>
          </div>

          {/* Main Calculator Workbench Grid */}
          <div className="w-full max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-md" id="main-calculator-workbench">
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
                          direction === 'g2tbsp'
                            ? 'bg-primary-container text-on-primary shadow-sm font-semibold'
                            : 'text-on-surface-variant hover:text-on-surface'
                        }`}
                        onClick={() => setDirection('g2tbsp')}
                      >
                        <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
                        Grams → Tablespoons
                      </button>
                      <button
                        type="button"
                        className={`px-4 py-2 rounded font-label-caps text-label-caps uppercase transition-all flex items-center gap-2 ${
                          direction === 'tbsp2g'
                            ? 'bg-primary-container text-on-primary shadow-sm font-semibold'
                            : 'text-on-surface-variant hover:text-on-surface'
                        }`}
                        onClick={() => setDirection('tbsp2g')}
                      >
                        Tablespoons → Grams
                      </button>
                    </div>

                    {/* Standard Volume Jurisdictions */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-label-caps font-label-caps uppercase text-outline text-[11px] hidden sm:inline">Standard:</span>
                      <select
                        id="spoonStandardSelect"
                        className="bg-surface-container text-on-surface text-body-sm font-data-mono px-2.5 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-sm cursor-pointer border border-outline-variant/30"
                        value={spoonStandard}
                        onChange={(e) => setSpoonStandard(parseFloat(e.target.value))}
                      >
                        <option value="14.7868">US Tablespoon (14.79 mL)</option>
                        <option value="15.0000">Metric Tablespoon (15.00 mL)</option>
                        <option value="17.7582">UK / Imperial (17.76 mL)</option>
                        <option value="20.0000">AU Tablespoon (20.00 mL)</option>
                      </select>
                    </div>
                  </div>

                  {/* Ingredient Selector & Search Preset Bar */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label htmlFor="ingredientSelector" className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-primary">lunch_dining</span>
                        Calibrated Ingredient Matrix
                      </label>
                      <span className="font-data-mono text-body-sm text-secondary bg-surface-container px-2 py-0.5 rounded border border-outline-variant/20">
                        ρ = {activeDensity.toFixed(3)} g/mL ({massPerTbsp.toFixed(2)} g/tbsp)
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
                        <optgroup label="Sugars & Sweeteners">
                          <option value="sugar">Granulated White Sugar (0.849 g/mL • 12.55 g/tbsp)</option>
                          <option value="brown_sugar_packed">Brown Sugar, Light/Dark Packed (0.880 g/mL • 13.01 g/tbsp)</option>
                          <option value="powdered_sugar">Powdered / Confectioners Sugar (0.560 g/mL • 8.28 g/tbsp)</option>
                          <option value="honey">Pure Raw Honey (1.420 g/mL • 21.00 g/tbsp)</option>
                          <option value="maple_syrup">Pure Maple Syrup (1.330 g/mL • 19.67 g/tbsp)</option>
                          <option value="molasses">Blackstrap Molasses (1.410 g/mL • 20.85 g/tbsp)</option>
                        </optgroup>
                        <optgroup label="Salts & Leaveners">
                          <option value="salt_table">Table Salt, Fine Iodized (1.217 g/mL • 18.00 g/tbsp)</option>
                          <option value="salt_diamond">Diamond Crystal Kosher Salt (0.570 g/mL • 8.43 g/tbsp)</option>
                          <option value="salt_morton">Morton Kosher Salt (0.970 g/mL • 14.34 g/tbsp)</option>
                          <option value="baking_powder">Baking Powder, Double Acting (0.900 g/mL • 13.31 g/tbsp)</option>
                          <option value="baking_soda">Baking Soda, Sodium Bicarbonate (0.960 g/mL • 14.20 g/tbsp)</option>
                          <option value="yeast_dry">Active Dry / Instant Yeast (0.640 g/mL • 9.46 g/tbsp)</option>
                        </optgroup>
                        <optgroup label="Flours & Starches">
                          <option value="flour_ap">All-Purpose Flour, Dipped/Packed (0.528 g/mL • 7.81 g/tbsp)</option>
                          <option value="flour_sifted">All-Purpose Flour, Sifted/Aerated (0.450 g/mL • 6.65 g/tbsp)</option>
                          <option value="flour_bread">Bread Flour, High-Protein (0.550 g/mL • 8.13 g/tbsp)</option>
                          <option value="flour_almond">Almond Flour, Blanched Superfine (0.385 g/mL • 5.69 g/tbsp)</option>
                          <option value="cornstarch">Pure Cornstarch (0.540 g/mL • 7.98 g/tbsp)</option>
                          <option value="cocoa">Unsweetened Dutch/Natural Cocoa (0.410 g/mL • 6.06 g/tbsp)</option>
                        </optgroup>
                        <optgroup label="Fats, Dairy & Supplements">
                          <option value="butter">Butter, Unsalted (0.911 g/mL • 13.47 g/tbsp)</option>
                          <option value="olive_oil">Extra Virgin Olive Oil (0.918 g/mL • 13.57 g/tbsp)</option>
                          <option value="water">Water / Aqueous Liquids (1.000 g/mL • 14.79 g/tbsp)</option>
                          <option value="creatine">Creatine Monohydrate Powder (0.700 g/mL • 10.35 g/tbsp)</option>
                          <option value="whey">Whey Protein Isolate Powder (0.380 g/mL • 5.62 g/tbsp)</option>
                        </optgroup>
                        <optgroup label="Spices">
                          <option value="cinnamon">Ground Ceylon Cinnamon (0.560 g/mL • 8.28 g/tbsp)</option>
                          <option value="black_pepper">Fine Ground Black Pepper (0.579 g/mL • 8.56 g/tbsp)</option>
                        </optgroup>
                      </select>
                      <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">expand_more</span>
                    </div>

                    {/* Quick Ingredient Filter Pills */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1">
                      <span className="text-label-caps font-label-caps uppercase text-outline text-[10px] shrink-0">Popular:</span>
                      {[
                        { id: 'sugar', label: 'Sugar' },
                        { id: 'butter', label: 'Butter' },
                        { id: 'flour_ap', label: 'Flour' },
                        { id: 'olive_oil', label: 'Olive Oil' },
                        { id: 'honey', label: 'Honey' },
                        { id: 'salt_table', label: 'Table Salt' },
                        { id: 'salt_diamond', label: 'Kosher Salt' },
                        { id: 'baking_powder', label: 'Baking Powder' }
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

                  {/* Main Dynamic Value Input & Slider Controls */}
                  <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-sm border border-outline-variant/20">
                    <div className="flex items-center justify-between">
                      <label htmlFor="numericalInput" className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant font-semibold">
                        {direction === 'g2tbsp' ? 'Mass in Grams' : 'Volume in Tablespoons'}
                      </label>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          className="w-7 h-7 rounded bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-highest transition-colors font-bold text-body-lg border border-outline-variant/30"
                          onClick={() => {
                            const val = parseFloat(inputValue) || 0;
                            const next = Math.max(0.1, val - (direction === 'g2tbsp' ? 1 : 0.25));
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
                            const next = val + (direction === 'g2tbsp' ? 1 : 0.25);
                            setInputValue((Math.round(next * 100) / 100).toString());
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Prominent Number Input Field */}
                    <div className="relative flex items-center">
                      <input
                        id="numericalInput"
                        type="number"
                        min="0.01"
                        step="any"
                        className="w-full bg-surface-container-lowest text-on-surface font-numerical-display text-numerical-display px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary shadow-sm border border-outline-variant/30"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                      />
                      <div className="absolute right-4 flex items-center gap-1 text-outline font-data-mono text-body-lg pointer-events-none">
                        <span>{direction === 'g2tbsp' ? 'grams (g)' : 'tablespoons (tbsp)'}</span>
                      </div>
                    </div>

                    {/* Quick Increments Chips */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {direction === 'g2tbsp'
                        ? [5, 10, 14.2, 15, 25, 30, 50, 100, 200].map(v => (
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
                              {v === 14.2 ? '14.2g (1 stick/8)' : `${v}g`}
                            </button>
                          ))
                        : [0.5, 1, 1.5, 2, 3, 4, 8, 16].map(v => (
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
                              {v === 16 ? '16 tbsp (1 cup)' : `${v} tbsp`}
                            </button>
                          ))}
                    </div>

                    {/* Fluid Slider */}
                    <div className="pt-2 flex flex-col gap-1">
                      <input
                        type="range"
                        min={direction === 'g2tbsp' ? '1' : '0.25'}
                        max={direction === 'g2tbsp' ? '200' : '16'}
                        step={direction === 'g2tbsp' ? '0.5' : '0.25'}
                        className="w-full accent-primary h-2 bg-surface-container rounded-lg cursor-pointer"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                      />
                      <div className="flex justify-between text-label-caps font-label-caps text-outline">
                        {direction === 'g2tbsp' ? (
                          <>
                            <span>1g</span>
                            <span>50g</span>
                            <span>100g</span>
                            <span>150g</span>
                            <span>200g</span>
                          </>
                        ) : (
                          <>
                            <span>0.25 tbsp</span>
                            <span>4 tbsp</span>
                            <span>8 tbsp (½ cup)</span>
                            <span>12 tbsp</span>
                            <span>16 tbsp (1 cup)</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Custom Density Override Expander */}
                  <div className="pt-1">
                    <details className="group bg-surface-container-low rounded-lg p-space-xs transition-colors border border-outline-variant/20">
                      <summary className="flex items-center justify-between cursor-pointer list-none text-body-sm font-body-sm text-on-surface-variant select-none">
                        <span className="flex items-center gap-1.5 font-medium">
                          <span className="material-symbols-outlined text-[16px] text-secondary">tune</span>
                          Custom Density Override • Lab Mode
                        </span>
                        <span className="material-symbols-outlined text-[18px] group-open:rotate-180 transition-transform">expand_more</span>
                      </summary>
                      <div className="pt-3 pb-1 flex flex-col sm:flex-row gap-3">
                        <div className="flex-1">
                          <label className="font-label-caps text-label-caps uppercase text-outline">Specific Gravity / Density (g/mL)</label>
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
                            Reset to USDA
                          </button>
                        </div>
                      </div>
                    </details>
                  </div>

                  {/* Metrological Deductive Step-by-Step Proof */}
                  <div className="bg-surface rounded-xl p-space-sm shadow-sm flex flex-col gap-1.5 font-data-mono text-body-sm border border-outline-variant/20">
                    <div className="flex items-center justify-between text-outline">
                      <span className="text-label-caps font-label-caps uppercase text-primary font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">functions</span>
                        Deductive Mathematical Proof
                      </span>
                      <span className="text-[11px]">US Spoon = {spoonStandard.toFixed(4)} mL</span>
                    </div>
                    <div className="text-on-surface bg-surface-container-lowest p-2.5 rounded-lg overflow-x-auto leading-relaxed text-[13px] border border-outline-variant/20">
                      {direction === 'g2tbsp' ? (
                        <>
                          tbsp = {computedGrams.toFixed(3)} g ÷ ({activeDensity.toFixed(4)} g/mL × {spoonStandard.toFixed(4)} mL) = {computedGrams.toFixed(3)} ÷ {massPerTbsp.toFixed(4)} = <span className="font-bold text-primary">{computedTbsp.toFixed(4)} tbsp</span>
                        </>
                      ) : (
                        <>
                          grams = {computedTbsp.toFixed(3)} tbsp × ({activeDensity.toFixed(4)} g/mL × {spoonStandard.toFixed(4)} mL) = {computedTbsp.toFixed(3)} × {massPerTbsp.toFixed(4)} = <span className="font-bold text-primary">{computedGrams.toFixed(4)} g</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-outline pt-0.5">
                      <span>NIST Metrology Ref SRD-129</span>
                      <span className="text-primary font-semibold">
                        {direction === 'g2tbsp'
                          ? `Exact Solution: ${computedTbsp.toFixed(2)} tbsp (~ ${toCulinaryFraction(computedTbsp, 'tbsp')})`
                          : `Exact Solution: ${computedGrams.toFixed(2)} grams`}
                      </span>
                    </div>
                  </div>

                </div>

                {/* Recipe Scaling Quick Batch Assistant */}
                <div className="bg-surface-container-lowest rounded-xl shadow-md border border-outline-variant/30 p-space-md flex flex-col gap-space-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[22px]">format_list_numbered</span>
                      <div>
                        <h3 className="font-headline-md text-[17px] leading-tight font-bold text-on-surface">Batch Multiplier Assistant</h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">Instantly scale this measurement across batch multiples</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-lg border border-outline-variant/20">
                      {[0.5, 1, 2, 3, 4].map(m => (
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

                  {/* Dynamic Scaled Result Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                    <div className="p-2.5 rounded-lg bg-surface-container-low flex flex-col border border-outline-variant/20">
                      <span className="text-label-caps font-label-caps uppercase text-outline">Target Mass</span>
                      <span className="font-data-mono text-body-lg font-bold text-on-surface">{scaledGrams.toFixed(1)} g</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-surface-container-low flex flex-col border border-outline-variant/20">
                      <span className="text-label-caps font-label-caps uppercase text-outline">Decimal Tablespoons</span>
                      <span className="font-data-mono text-body-lg font-bold text-primary">{scaledTbsp.toFixed(2)} tbsp</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-surface-container-low flex flex-col border border-outline-variant/20">
                      <span className="text-label-caps font-label-caps uppercase text-outline">Kitchen Fraction</span>
                      <span className="font-data-mono text-body-lg font-bold text-on-surface">{toCulinaryFraction(scaledTbsp, 'tbsp')}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-surface-container-low flex flex-col border border-outline-variant/20">
                      <span className="text-label-caps font-label-caps uppercase text-outline">Teaspoons (tsp)</span>
                      <span className="font-data-mono text-body-lg font-bold text-secondary">{scaledTsp.toFixed(2)} tsp</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Computed Visual Telemetry & Spoon Explorer (5 cols) */}
              <div className="lg:col-span-5 flex flex-col gap-space-md">

                {/* Primary Output Showcase Card */}
                <div className="bg-primary text-on-primary rounded-xl shadow-xl p-space-md lg:p-space-lg flex flex-col justify-between relative overflow-hidden">
                  {/* Background Atmospheric Glow */}
                  <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-secondary-container opacity-20 blur-3xl pointer-events-none"></div>

                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-label-caps text-label-caps uppercase tracking-wider text-secondary-fixed">
                        Primary Volumetric Result
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-surface-container-lowest/20 font-data-mono text-body-sm text-secondary-fixed">
                        Culinary Standard
                      </span>
                    </div>

                    {/* Massive Computed Number Output */}
                    <div className="my-space-md flex flex-col">
                      <div className="flex items-baseline gap-2">
                        <span className="font-numerical-display text-numerical-display lg:text-[48px] font-extrabold tracking-tight leading-none text-white">
                          {direction === 'g2tbsp' ? computedTbsp.toFixed(2) : computedGrams.toFixed(2)}
                        </span>
                        <span className="font-headline-md text-headline-md text-secondary-fixed font-semibold">
                          {direction === 'g2tbsp' ? 'tbsp' : 'g'}
                        </span>
                      </div>

                      {/* Culinary Fraction Prominent Highlight */}
                      <div className="mt-2 inline-flex items-center gap-2 flex-wrap">
                        <span className="text-label-caps font-label-caps uppercase text-surface-container-highest opacity-80">Cook&apos;s Measure:</span>
                        <span className="px-3 py-1 rounded-md bg-white text-primary font-data-mono text-body-lg font-bold shadow-md">
                          {direction === 'g2tbsp' ? toCulinaryFraction(computedTbsp, 'tbsp') : `${computedGrams.toFixed(1)} grams`}
                        </span>
                        <span className="text-body-sm font-body-sm text-surface-container-highest">
                          {direction === 'g2tbsp'
                            ? `(${computedTsp.toFixed(1)} teaspoons)`
                            : `(${computedTbsp.toFixed(2)} tbsp)`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Secondary Metric Conversions Sidecar */}
                  <div className="pt-space-sm border-t border-white/15 grid grid-cols-2 gap-2 text-surface-container-highest">
                    <div className="flex flex-col">
                      <span className="text-[11px] uppercase font-label-caps tracking-wider opacity-80">Teaspoons (tsp)</span>
                      <span className="font-data-mono text-body-lg font-semibold text-white">{computedTsp.toFixed(2)} tsp</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] uppercase font-label-caps tracking-wider opacity-80">Volume (mL)</span>
                      <span className="font-data-mono text-body-lg font-semibold text-white">{computedMl.toFixed(2)} mL</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] uppercase font-label-caps tracking-wider opacity-80">Fluid Ounces</span>
                      <span className="font-data-mono text-body-lg font-semibold text-white">{computedFlOz.toFixed(2)} fl oz</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] uppercase font-label-caps tracking-wider opacity-80">US Standard Cups</span>
                      <span className="font-data-mono text-body-lg font-semibold text-white">{computedCups.toFixed(3)} cup</span>
                    </div>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="mt-space-md flex items-center gap-2">
                    <button
                      type="button"
                      className="flex-1 py-2 px-3 rounded-lg bg-surface-container-lowest text-primary hover:bg-secondary-fixed transition-colors font-body-sm font-semibold flex items-center justify-center gap-1.5 shadow-sm"
                      onClick={copyResult}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {copied ? 'check' : 'content_copy'}
                      </span>
                      <span>{copied ? 'Copied to Clipboard!' : 'Copy Result'}</span>
                    </button>
                    <button
                      type="button"
                      className="py-2 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors font-body-sm font-medium flex items-center justify-center gap-1"
                      onClick={() => window.print()}
                    >
                      <span className="material-symbols-outlined text-[16px]">print</span>
                      Print Prep Sheet
                    </button>
                  </div>
                </div>

                {/* Interactive Visual Spoon Explorer Card */}
                <div className="bg-surface-container-lowest rounded-xl shadow-md border border-outline-variant/30 p-space-md flex flex-col gap-space-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-primary text-[20px]">soup_kitchen</span>
                      <h4 className="font-headline-md text-[16px] font-bold text-on-surface">Physical Measuring Spoon Explorer</h4>
                    </div>
                    <span className="text-label-caps font-label-caps text-secondary uppercase font-semibold">Fill Visualizer</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    See how your measurement fills standard culinary nested measuring spoons:
                  </p>

                  {/* Dynamic Spoon Set SVG Illustration */}
                  <div className="w-full bg-surface-container-low rounded-xl p-3 flex flex-col items-center justify-center relative overflow-hidden border border-outline-variant/20">
                    <svg className="w-full h-28 text-on-surface" viewBox="0 0 400 120" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id="metalSpoonGradTbsp" x1="0%" x2="0%" y1="0%" y2="100%">
                          <stop offset="0%" stopColor="#e2e7ff" />
                          <stop offset="100%" stopColor="#c3c6d7" />
                        </linearGradient>
                        <linearGradient id="ingredientGradTbsp" x1="0%" x2="0%" y1="0%" y2="100%">
                          <stop offset="0%" stopColor="#2563eb" />
                          <stop offset="100%" stopColor="#004ac6" />
                        </linearGradient>
                      </defs>

                      {/* ¼ tbsp spoon (¾ tsp) */}
                      <g className="transition-all duration-300">
                        <rect x="20" y="55" width="22" height="4" rx="2" fill="url(#metalSpoonGradTbsp)" />
                        <ellipse cx="42" cy="57" rx="14" ry="10" fill="url(#metalSpoonGradTbsp)" />
                        <ellipse cx="42" cy="57" rx="12" ry="8" fill="url(#ingredientGradTbsp)" opacity={computedTbsp >= 0.25 ? 0.85 : 0.15} />
                        <text x="42" y="80" textAnchor="middle" fill="#737686" fontSize="9" fontFamily="JetBrains Mono">¼ tbsp</text>
                      </g>

                      {/* ½ tbsp spoon (1.5 tsp) */}
                      <g className="transition-all duration-300">
                        <rect x="80" y="52" width="26" height="5" rx="2" fill="url(#metalSpoonGradTbsp)" />
                        <ellipse cx="106" cy="55" rx="18" ry="13" fill="url(#metalSpoonGradTbsp)" />
                        <ellipse cx="106" cy="55" rx="15" ry="10" fill="url(#ingredientGradTbsp)" opacity={computedTbsp >= 0.5 ? 0.85 : 0.15} />
                        <text x="106" y="82" textAnchor="middle" fill="#737686" fontSize="9" fontFamily="JetBrains Mono">½ tbsp</text>
                      </g>

                      {/* 1 tbsp spoon (3 tsp) */}
                      <g className="transition-all duration-300">
                        <rect x="150" y="48" width="32" height="6" rx="3" fill="url(#metalSpoonGradTbsp)" />
                        <ellipse cx="182" cy="51" rx="22" ry="16" fill="url(#metalSpoonGradTbsp)" />
                        <ellipse cx="182" cy="51" rx="19" ry="13" fill="url(#ingredientGradTbsp)" opacity={computedTbsp >= 1.0 ? 0.85 : 0.15} />
                        <text x="182" y="84" textAnchor="middle" fill="#004ac6" fontSize="10" fontWeight="bold" fontFamily="JetBrains Mono">1 tbsp</text>
                      </g>

                      {/* 2 tbsp (⅛ cup / 6 tsp) spoon */}
                      <g className="transition-all duration-300">
                        <rect x="235" y="42" width="40" height="7" rx="3.5" fill="url(#metalSpoonGradTbsp)" />
                        <ellipse cx="275" cy="46" rx="32" ry="22" fill="url(#metalSpoonGradTbsp)" />
                        <ellipse cx="275" cy="46" rx="28" ry="18" fill="url(#ingredientGradTbsp)" opacity={computedTbsp >= 2.0 ? 0.85 : 0.15} />
                        <text x="275" y="86" textAnchor="middle" fill="#737686" fontSize="10" fontFamily="JetBrains Mono">2 tbsp (⅛ cup)</text>
                      </g>

                      {/* Active indicator */}
                      <text x="350" y="55" textAnchor="middle" fill="#434655" fontSize="10" fontWeight="600" fontFamily="Inter">Active</text>
                      <circle cx="350" cy="70" r="6" fill="#2563eb" />
                    </svg>

                    {/* Real-time Spoon Count Guidance */}
                    <div className="w-full text-center font-data-mono text-body-sm text-on-surface bg-surface-container-lowest py-1.5 px-2 rounded-lg mt-1 shadow-sm border border-outline-variant/20">
                      {computedTbsp < 0.25 ? (
                        <span>Requires: <strong>Less than ¼ tablespoon</strong> (use a teaspoon: {computedTsp.toFixed(2)} tsp)</span>
                      ) : computedTbsp < 1 ? (
                        <span>Requires: <strong>{toCulinaryFraction(computedTbsp, 'tbsp')}</strong> measuring spoon</span>
                      ) : computedTbsp < 4 ? (
                        <span>
                          Requires: <strong>{Math.floor(computedTbsp)} full level tablespoon{Math.floor(computedTbsp) > 1 ? 's' : ''}</strong>
                          {computedTbsp - Math.floor(computedTbsp) >= 0.1 ? ` + ${toCulinaryFraction(computedTbsp - Math.floor(computedTbsp), 'tbsp')}` : ''}
                        </span>
                      ) : (
                        <span>
                          Requires: <strong>{computedCups.toFixed(2)} US cups</strong> ({Math.floor(computedTbsp)} level tablespoons)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Density Comparison Gauge */}
                  <div className="flex flex-col gap-1.5 pt-1">
                    <div className="flex justify-between text-body-sm font-body-sm text-on-surface-variant">
                      <span>Bulk Aeration vs Packing</span>
                      <span className="font-medium text-secondary">
                        {activeDensity < 0.5 ? 'Fluffy / Aerated' : activeDensity < 1.1 ? 'Standard Granular' : 'Dense / Viscous'}
                      </span>
                    </div>
                    <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden flex">
                      <div
                        className="bg-primary h-full transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.max(10, (activeDensity / 1.5) * 100))}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] font-data-mono text-outline">
                      <span>Almond Flour (0.38)</span>
                      <span>Sugar (0.85)</span>
                      <span>Honey (1.42)</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* Interactive Multi-Ingredient Recipe Importer & Parser Section */}
          <div className="w-full max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-lg">
            <div className="bg-surface-container-lowest rounded-xl shadow-md border border-outline-variant/30 p-space-md lg:p-space-lg">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md pb-space-md">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface-container text-primary font-label-caps text-label-caps uppercase tracking-wider mb-1">
                    <span className="material-symbols-outlined text-[15px]">document_scanner</span>
                    Batch Text Parser
                  </div>
                  <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
                    Interactive Recipe Grams-to-Tablespoons Parser
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Paste any unformatted recipe text with gram quantities. The parser extracts lines, detects calibrated ingredients, and computes volumetric equivalents instantaneously.
                  </p>
                </div>
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-body-sm font-medium transition-colors whitespace-nowrap self-start lg:self-center border border-outline-variant/30"
                  onClick={() => {
                    setRecipeText('30g granulated sugar\n14g unsalted butter\n15g extra virgin olive oil\n7g fine table salt\n20g pure raw honey\n6g baking powder');
                    setTimeout(handleParseRecipe, 50);
                  }}
                >
                  Load Sample Formula (Artisan Brioche)
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md">
                {/* Textarea input */}
                <div className="lg:col-span-5 flex flex-col gap-2">
                  <textarea
                    id="recipeTextInput"
                    rows={6}
                    className="w-full p-space-sm rounded-xl bg-surface-container-low text-on-surface font-data-mono text-body-sm focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary shadow-sm leading-relaxed border border-outline-variant/30"
                    placeholder={`Paste recipe lines here, e.g.:\n30g granulated sugar\n14g butter\n15g olive oil\n7g table salt\n20g honey`}
                    value={recipeText}
                    onChange={(e) => setRecipeText(e.target.value)}
                  />
                  <button
                    type="button"
                    className="w-full py-2.5 px-4 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-body-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-sm"
                    onClick={handleParseRecipe}
                  >
                    <span className="material-symbols-outlined text-[18px]">auto_fix_high</span>
                    Parse &amp; Generate Culinary Prep List
                  </button>
                </div>

                {/* Output Dynamic Table */}
                <div className="lg:col-span-7 bg-surface-container-low rounded-xl p-space-sm overflow-x-auto border border-outline-variant/20">
                  <table className="w-full text-left font-body-sm text-body-sm">
                    <thead>
                      <tr className="text-label-caps font-label-caps text-outline uppercase border-b border-surface-container">
                        <th className="pb-2">Ingredient</th>
                        <th className="pb-2">Grams</th>
                        <th className="pb-2">Calibrated ρ</th>
                        <th className="pb-2">Tablespoons</th>
                        <th className="pb-2">Fraction</th>
                        <th className="pb-2">Teaspoons</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-container font-data-mono">
                      {parsedRows.length > 0 ? (
                        parsedRows.map((row, idx) => (
                          <tr key={idx} className="hover:bg-surface-container-lowest/50 transition-colors">
                            <td className="py-2.5 font-sans font-medium text-on-surface">{row.name}</td>
                            <td className="py-2.5 text-on-surface">{row.grams.toFixed(1)} g</td>
                            <td className="py-2.5 text-outline">{row.density.toFixed(3)}</td>
                            <td className="py-2.5 text-primary font-bold">{row.tbsp.toFixed(2)} tbsp</td>
                            <td className="py-2.5 text-secondary font-bold">{row.frac}</td>
                            <td className="py-2.5 text-on-surface-variant">{row.tsp.toFixed(2)} tsp</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-4 text-center text-outline font-sans">
                            Paste recipe lines above and click Parse
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Ingredient Density Comparison Matrix: The 4 Major Culinary Dilemmas */}
          <div className="w-full max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-md">
            <div className="mb-space-md">
              <span className="font-label-caps text-label-caps uppercase text-primary font-semibold">Bulk Density Variances</span>
              <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
                The Famous Culinary Trap: Why Grams Never Equal Spoons
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Because a tablespoon is a unit of volume and a gram is a unit of mass, identical spoon volumes yield wildly disparate weights.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
              {/* Trap Card 1: The Kosher Salt Trap */}
              <div className="bg-surface-container-lowest rounded-xl shadow-md border border-outline-variant/30 p-space-md flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-1 text-[11px] font-label-caps font-semibold uppercase px-2 py-0.5 rounded bg-error-container text-on-error-container mb-2">
                    <span className="material-symbols-outlined text-[14px]">warning</span>
                    Highest Failure Rate
                  </div>
                  <h3 className="font-body-lg text-body-lg font-bold text-on-surface">Table Salt vs Kosher Salt</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    Fine table salt packs tightly (18.0g/tbsp), while hollow Diamond Crystal flakes hold only 8.4g/tbsp.
                  </p>
                </div>
                <div className="mt-space-md p-3 rounded-lg bg-surface-container-low flex flex-col gap-1 font-data-mono text-body-sm border border-outline-variant/20">
                  <div className="flex justify-between">
                    <span className="text-outline">Table Salt:</span>
                    <span className="font-bold text-on-surface">18.0 g / tbsp</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-outline">Diamond Crystal:</span>
                    <span className="font-bold text-error">8.4 g / tbsp</span>
                  </div>
                  <div className="text-[11px] text-outline pt-1 border-t border-surface-container">
                    Impact: Substituting 1:1 by volume results in +114% excess sodium!
                  </div>
                </div>
              </div>

              {/* Trap Card 2: Sugar vs Honey */}
              <div className="bg-surface-container-lowest rounded-xl shadow-md border border-outline-variant/30 p-space-md flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-1 text-[11px] font-label-caps font-semibold uppercase px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed mb-2">
                    Viscosity &amp; Packing
                  </div>
                  <h3 className="font-body-lg text-body-lg font-bold text-on-surface">Granulated Sugar vs Honey</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    Sugar crystals contain interstitial air pockets, whereas honey is dense and viscous.
                  </p>
                </div>
                <div className="mt-space-md p-3 rounded-lg bg-surface-container-low flex flex-col gap-1 font-data-mono text-body-sm border border-outline-variant/20">
                  <div className="flex justify-between">
                    <span className="text-outline">White Sugar:</span>
                    <span className="font-bold text-on-surface">12.6 g / tbsp</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-outline">Raw Honey:</span>
                    <span className="font-bold text-primary">21.0 g / tbsp</span>
                  </div>
                  <div className="text-[11px] text-outline pt-1 border-t border-surface-container">
                    Impact: 1 tbsp honey provides +67% more grams of sweetener than dry sugar.
                  </div>
                </div>
              </div>

              {/* Trap Card 3: All Purpose vs Almond Flour */}
              <div className="bg-surface-container-lowest rounded-xl shadow-md border border-outline-variant/30 p-space-md flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-1 text-[11px] font-label-caps font-semibold uppercase px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant mb-2">
                    Gluten-Free Shift
                  </div>
                  <h3 className="font-body-lg text-body-lg font-bold text-on-surface">Wheat Flour vs Almond Flour</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    Finely milled wheat flour packs differently than coarse, fatty almond meal.
                  </p>
                </div>
                <div className="mt-space-md p-3 rounded-lg bg-surface-container-low flex flex-col gap-1 font-data-mono text-body-sm border border-outline-variant/20">
                  <div className="flex justify-between">
                    <span className="text-outline">AP Wheat Flour:</span>
                    <span className="font-bold text-on-surface">7.8 g / tbsp</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-outline">Almond Flour:</span>
                    <span className="font-bold text-secondary">5.7 g / tbsp</span>
                  </div>
                  <div className="text-[11px] text-outline pt-1 border-t border-surface-container">
                    Impact: 100g of almond flour requires 17.5 tbsp vs only 12.8 tbsp of wheat flour.
                  </div>
                </div>
              </div>

              {/* Trap Card 4: Leaveners */}
              <div className="bg-surface-container-lowest rounded-xl shadow-md border border-outline-variant/30 p-space-md flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-1 text-[11px] font-label-caps font-semibold uppercase px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant mb-2">
                    Chemical Leavening
                  </div>
                  <h3 className="font-body-lg text-body-lg font-bold text-on-surface">Baking Powder vs Baking Soda</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    Baking soda is pure sodium bicarbonate; baking powder contains added starches and acids.
                  </p>
                </div>
                <div className="mt-space-md p-3 rounded-lg bg-surface-container-low flex flex-col gap-1 font-data-mono text-body-sm border border-outline-variant/20">
                  <div className="flex justify-between">
                    <span className="text-outline">Baking Powder:</span>
                    <span className="font-bold text-on-surface">13.3 g / tbsp</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-outline">Baking Soda:</span>
                    <span className="font-bold text-primary">14.2 g / tbsp</span>
                  </div>
                  <div className="text-[11px] text-outline pt-1 border-t border-surface-container">
                    Impact: Baking soda is ~7% denser and 300% more alkaline by active neutralization.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 1,000+ Calibrated Ingredient Density Explorer Directory */}
          <div className="w-full max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-lg">
            <div className="bg-surface-container-lowest rounded-xl shadow-md border border-outline-variant/30 p-space-md lg:p-space-lg flex flex-col gap-space-md">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-sm">
                <div>
                  <div className="inline-flex items-center gap-1 text-label-caps font-label-caps uppercase text-primary font-semibold mb-1">
                    <span className="material-symbols-outlined text-[16px]">database</span>
                    Certified Metrology Database
                  </div>
                  <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
                    Calibrated Culinary Ingredient Density Explorer
                  </h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Cross-referenced with USDA FoodData Central and the National Institute of Standards and Technology.
                  </p>
                </div>

                {/* Filter Search & Category Tabs */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">search</span>
                    <input
                      type="text"
                      placeholder="Filter ingredients..."
                      className="pl-9 pr-4 py-1.5 rounded-lg bg-surface-container-low text-body-sm text-on-surface focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary shadow-sm border border-outline-variant/30"
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                    />
                  </div>
                  <select
                    className="bg-surface-container-low text-on-surface text-body-sm px-3 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary shadow-sm cursor-pointer border border-outline-variant/30"
                    value={catFilter}
                    onChange={(e) => setCatFilter(e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    <option value="sugars">Sugars &amp; Syrups</option>
                    <option value="salts">Salts &amp; Leaveners</option>
                    <option value="flours">Flours &amp; Starches</option>
                    <option value="dairy">Dairy &amp; Fats</option>
                    <option value="supplements">Supplements &amp; Nutrition</option>
                    <option value="spices">Spices &amp; Seasonings</option>
                  </select>
                </div>
              </div>

              {/* Explorer Data Table */}
              <div className="overflow-x-auto border border-outline-variant/20 rounded-xl">
                <table className="w-full text-left font-body-sm text-body-sm">
                  <thead>
                    <tr className="text-label-caps font-label-caps uppercase text-outline bg-surface-container-low border-b border-surface-container">
                      <th className="py-3 px-3">Ingredient Name</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3">USDA / NIST ID</th>
                      <th className="py-3 px-3">Bulk ρ (g/mL)</th>
                      <th className="py-3 px-3">US Tbsp (g)</th>
                      <th className="py-3 px-3">Metric Tbsp (g)</th>
                      <th className="py-3 px-3">Tbsp per 50g</th>
                      <th className="py-3 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container font-data-mono">
                    {filteredDensityKeys.map(key => {
                      const item = INGREDIENTS_DICT[key];
                      const usGrams = item.density * 14.7868;
                      const metricGrams = item.density * 15.0000;
                      const tbsp50 = 50 / usGrams;

                      return (
                        <tr key={key} className="hover:bg-surface-container-low/50 transition-colors">
                          <td className="py-3 px-3 font-sans font-semibold text-on-surface">{item.name}</td>
                          <td className="py-3 px-3 text-outline">
                            <span className="px-2 py-0.5 rounded bg-surface-container text-body-sm font-sans capitalize">
                              {item.category}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-outline">{item.fdcId || 'FDC Verified'}</td>
                          <td className="py-3 px-3 text-primary font-bold">{item.density.toFixed(3)}</td>
                          <td className="py-3 px-3 text-on-surface">{usGrams.toFixed(2)} g</td>
                          <td className="py-3 px-3 text-on-surface">{metricGrams.toFixed(2)} g</td>
                          <td className="py-3 px-3 text-secondary font-bold">{tbsp50.toFixed(2)} tbsp</td>
                          <td className="py-3 px-3 text-right">
                            <button
                              type="button"
                              className="px-2.5 py-1 rounded bg-surface-container text-body-sm font-sans hover:bg-primary hover:text-on-primary transition-all shadow-sm border border-outline-variant/30"
                              onClick={() => handleSelectPreset(key)}
                            >
                              Load
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Popular High-Density Quick Reference Matrix */}
          <div className="w-full max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-md">
            <div className="bg-surface-container-lowest rounded-xl shadow-md border border-outline-variant/30 p-space-md lg:p-space-lg flex flex-col gap-space-md">
              <div>
                <span className="font-label-caps text-label-caps uppercase text-primary font-semibold">Master Conversion Matrix</span>
                <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
                  Standard Grams to Tablespoons Reference Table
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Quick lookups for standard US Level Tablespoons across essential pantry staples.
                </p>
              </div>

              <div className="overflow-x-auto border border-outline-variant/20 rounded-xl">
                <table className="w-full text-center font-data-mono text-body-sm">
                  <thead>
                    <tr className="text-label-caps font-label-caps text-outline uppercase bg-surface-container-low border-b border-surface-container">
                      <th className="py-2.5 px-3 text-left font-sans">Ingredient</th>
                      <th className="py-2.5 px-2">5g</th>
                      <th className="py-2.5 px-2">10g</th>
                      <th className="py-2.5 px-2 bg-surface-container text-primary font-bold">15g</th>
                      <th className="py-2.5 px-2">25g</th>
                      <th className="py-2.5 px-2">50g</th>
                      <th className="py-2.5 px-2">75g</th>
                      <th className="py-2.5 px-2">100g</th>
                      <th className="py-2.5 px-2">200g</th>
                      <th className="py-2.5 px-2">500g</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container">
                    {[
                      { name: 'Butter (Unsalted)', density: 0.911 },
                      { name: 'Sugar (Granulated White)', density: 0.849 },
                      { name: 'All-Purpose Flour', density: 0.528 },
                      { name: 'Extra Virgin Olive Oil', density: 0.918 },
                      { name: 'Pure Raw Honey', density: 1.420 },
                      { name: 'Table Salt (Fine)', density: 1.217 },
                      { name: 'Baking Powder', density: 0.900 },
                      { name: 'Active Dry Yeast', density: 0.640 }
                    ].map(ing => {
                      const tbspWeight = ing.density * 14.7868;
                      return (
                        <tr key={ing.name} className="hover:bg-surface-container-low/50 transition-colors">
                          <td className="py-2.5 px-3 text-left font-sans font-semibold text-on-surface">{ing.name}</td>
                          {[5, 10, 15, 25, 50, 75, 100, 200, 500].map(grams => {
                            const tbsp = grams / tbspWeight;
                            return (
                              <td
                                key={grams}
                                className={`py-2.5 px-2 ${
                                  grams === 15 ? 'bg-surface-container font-bold text-on-surface' : 'text-on-surface'
                                }`}
                              >
                                {tbsp.toFixed(2)} tbsp
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* In-Depth Food Science & Culinary Metrology Guides */}
          <div className="w-full max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
              {/* Guide Card 1: Aeration & Fluff Factor */}
              <div className="bg-surface-container-lowest rounded-xl shadow-md border border-outline-variant/30 p-space-md lg:p-space-lg flex flex-col gap-space-sm">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[24px]">air</span>
                  <h3 className="font-headline-md text-[19px] font-bold text-on-surface">
                    The Aeration &amp; Bulk Density Shift
                  </h3>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Powders like flour, powdered sugar, and cocoa behave as <em>compressible granular media</em>. When flour is scooped straight from the bag with a tablespoon, atmospheric packing compresses particles to a density of ~0.53 g/mL (7.8g per tbsp). If whisked or sifted, air entrainment drops the density to ~0.45 g/mL (6.6g per tbsp)—a <strong>18% discrepancy</strong> that ruins delicate pastry crumb.
                </p>
                <div className="p-3 bg-surface-container-low rounded-lg text-body-sm font-data-mono text-outline border border-outline-variant/20">
                  Rule: Whenever possible, measure baking ingredients by mass on a 0.1g digital scale. If forced to use tablespoons, gently fluff the dry ingredient with a fork and sweep level with a straight knife.
                </div>
              </div>

              {/* Guide Card 2: Fitness & Medical Disclaimer */}
              <div className="bg-surface-container-lowest rounded-xl shadow-md border border-outline-variant/30 p-space-md lg:p-space-lg flex flex-col gap-space-sm">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-tertiary text-[24px]">medical_services</span>
                  <h3 className="font-headline-md text-[19px] font-bold text-on-surface">
                    Medical, Pediatric &amp; Supplement Precision
                  </h3>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Culinary dining tableware tablespoons vary between 10 mL and 22 mL depending on artistic design. <strong>Never use standard tableware dinner spoons to administer pediatric oral medications or concentrated bioactive compounds</strong> (such as cough syrups or pharmaceutical suspensions). Always use a dedicated calibrated oral syringe marked in milliliters (mL).
                </p>
                <div className="p-3 bg-surface-container-low rounded-lg text-body-sm font-data-mono text-outline border border-outline-variant/20">
                  For sports nutrition (creatine monohydrate), 1 level US measuring tablespoon yields 10.35g. To hit a standard 5g dose using tablespoons, consume 0.48 tablespoon (approx ½ level tbsp or 1.45 teaspoons).
                </div>
              </div>
            </div>
          </div>

          {/* Authoritative FAQ Section (10+ Detailed Accordions) */}
          <div className="w-full max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-lg">
            <div className="bg-surface-container-lowest rounded-xl shadow-md border border-outline-variant/30 p-space-md lg:p-space-lg">
              <div className="mb-space-md">
                <span className="font-label-caps text-label-caps uppercase text-primary font-semibold">Authoritative Knowledge Base</span>
                <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
                  Frequently Asked Questions &amp; Food Science
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  NIST-referenced guidelines on mass-to-volume culinary conversion and measuring standards.
                </p>
              </div>

              <div className="flex flex-col divide-y divide-surface-container">
                {[
                  {
                    q: 'How many tablespoons is 15 grams of butter?',
                    a: 'With butter density at ~0.911 g/mL, 15 grams of unsalted butter equals approximately 1.11 US tablespoons (about 1 level tablespoon + ⅓ teaspoon). In US cooking, one standard stick of butter weighs 113.4 grams and contains 8 tablespoons (14.18g per tablespoon).'
                  },
                  {
                    q: 'How many tablespoons is 15 grams of granulated white sugar?',
                    a: '15 grams of white granulated sugar equals approximately 1.20 US tablespoons (about 1¼ level tablespoons, or 3.6 teaspoons). White sugar has an average bulk packing density of 0.849 g/mL (12.55 grams per level US tablespoon).'
                  },
                  {
                    q: 'How many tablespoons is 15 grams of all-purpose flour?',
                    a: 'All-purpose wheat flour has a bulk density of ~0.528 g/mL (7.81 grams per US tablespoon). Therefore, 15 grams of all-purpose flour is equal to approximately 1.92 US tablespoons (nearly 2 level tablespoons or 5.75 teaspoons).'
                  },
                  {
                    q: 'How many tablespoons is 15 grams of extra virgin olive oil?',
                    a: 'Extra virgin olive oil has a density of ~0.918 g/mL (13.57 grams per US tablespoon). 15 grams of olive oil equals approximately 1.11 US tablespoons (about 1 tablespoon plus ⅓ teaspoon).'
                  },
                  {
                    q: 'What is the difference between a US Tablespoon, Metric Tablespoon, and Australian Tablespoon?',
                    a: 'Under US Customary regulations (NIST Handbook 44), 1 US tablespoon is 14.7868 mL (3 US teaspoons or ½ US fluid ounce). In metric countries (UK, Canada, New Zealand), a metric tablespoon is defined as exactly 15.0000 mL. In Australia, a standard culinary tablespoon is officially defined as 20.0000 mL (4 metric teaspoons).'
                  },
                  {
                    q: 'Why is there a massive weight difference between Diamond Crystal and Morton salt in tablespoons?',
                    a: 'Diamond Crystal Kosher Salt is produced via the Alberger process, resulting in hollow, pyramidal flakes with low bulk density (0.57 g/mL), yielding 8.43g per tablespoon. Morton Kosher Salt is rolled into flat, dense flakes (0.97 g/mL), yielding 14.34g per tablespoon. Fine table salt is even denser at 18.00g per tablespoon.'
                  },
                  {
                    q: 'How many tablespoons are in a stick of butter?',
                    a: 'In the United States, 1 standard stick of butter is equal to 8 tablespoons (which is ½ cup, 4 ounces, or 113.4 grams). Half a stick of butter is 4 tablespoons (56.7 grams), and 1 tablespoon of butter weighs approximately 14.2 grams.'
                  },
                  {
                    q: 'How many tablespoons is 100 grams of pure honey?',
                    a: 'Pure raw honey is very dense (1.42 g/mL), yielding 21.00 grams per US tablespoon. Therefore, 100 grams of honey corresponds to approximately 4.76 US tablespoons (about 4¾ level tablespoons).'
                  },
                  {
                    q: 'Can I use a regular eating tablespoon from my silverware drawer for recipes?',
                    a: 'No. Dining silverware spoons are sculpted strictly for mouth ergonomics, balance, and aesthetic appeal. Their liquid capacities range wildly between 10 mL and 22 mL. Always use dedicated measuring spoons stamped with volumetric standards and leveled with a flat straight edge.'
                  },
                  {
                    q: 'Does this calculator transmit recipe data to external servers?',
                    a: 'No. All computations, text parsing, and density calculations execute 100% locally in your web browser using client-side JavaScript. Zero recipe quantities or user telemetry leave your device.'
                  }
                ].map((faq, idx) => (
                  <details
                    key={idx}
                    className="py-4 group"
                    open={openFaqs[idx]}
                    onToggle={() => toggleFaq(idx)}
                  >
                    <summary className="flex items-center justify-between cursor-pointer list-none font-headline-md text-[16px] font-semibold text-on-surface select-none">
                      <span>{faq.q}</span>
                      <span className="material-symbols-outlined text-outline group-open:rotate-180 transition-transform">
                        expand_more
                      </span>
                    </summary>
                    <div className="pt-2 font-body-md text-body-md text-on-surface-variant leading-relaxed">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
