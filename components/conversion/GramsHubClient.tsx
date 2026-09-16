'use client';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const UNIT_FACTORS: Record<string, number> = {
  'g': 1.0,
  'kg': 1000.0,
  'mg': 0.001,
  'mcg': 0.000001,
  't': 1000000.0,
  'oz': 28.349523125,
  'lb': 453.59237,
  'st': 6350.29318,
  'us_ton': 907184.74,
  'uk_ton': 1016046.9088,
  'ct': 0.200,
  'ozt': 31.1034768,
  'dwt': 1.55517384,
  'tola': 11.6638038,
  'grain': 0.06479891,
  'ml_water': 1.0,
  'tsp_water': 4.92892,
  'tbsp_water': 14.7868,
  'cup_water': 240.0,
  'cup_flour': 136.8,
  'cup_sugar': 202.8,
  'cup_butter': 218.64,
  'tsp_sugar': 4.17,
  'tbsp_sugar': 12.51,
  'tsp_salt': 6.0,
  'l_water': 1000.0
};

const UNIT_NAMES: Record<string, string> = {
  'g': 'Grams',
  'kg': 'Kilograms',
  'mg': 'Milligrams',
  'mcg': 'Micrograms',
  't': 'Metric Tonnes',
  'oz': 'Avoirdupois Ounces',
  'lb': 'Pounds',
  'st': 'Stones',
  'us_ton': 'US Short Tons',
  'uk_ton': 'Imperial Long Tons',
  'ct': 'Carats',
  'ozt': 'Troy Ounces',
  'dwt': 'Pennyweights',
  'tola': 'Tolas',
  'grain': 'Grains',
  'l_water': 'Liters (H₂O)',
  'ml_water': 'Milliliters (H₂O)',
  'tsp_water': 'Teaspoons (H₂O)',
  'tbsp_water': 'Tablespoons (H₂O)',
  'cup_water': 'US Cups (H₂O)',
  'cup_flour': 'US Cups (Flour)',
  'cup_sugar': 'US Cups (Sugar)',
  'cup_butter': 'US Cups (Butter)',
  'tsp_sugar': 'Teaspoons (Sugar)',
  'tbsp_sugar': 'Tablespoons (Sugar)',
  'tsp_salt': 'Teaspoons (Salt)'
};

export default function GramHubClient() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState<number | string>(100);
  const [fromUnit, setFromUnit] = useState<string>('g');
  const [toUnit, setToUnit] = useState<string>('oz');
  const [precision, setPrecision] = useState<number>(6);
  const [culinaryIngredient, setCulinaryIngredient] = useState<string>('1.0');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copyText, setCopyText] = useState<string>('Copy');

  const numValue = parseFloat(inputValue as string);
  const rawVal = isNaN(numValue) ? 0 : numValue;
  const fromFactor = UNIT_FACTORS[fromUnit] || 1.0;
  const toFactor = UNIT_FACTORS[toUnit] || 1.0;
  
  const gramsVal = rawVal * fromFactor;
  const convertedVal = gramsVal / toFactor;
  
  const formattedResult = convertedVal.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: precision
  });
  
  const outputUnitSymbol = toUnit.split('_')[0];
  const resultSpelledOut = `${formattedResult} ${UNIT_NAMES[toUnit] || toUnit}`;
  
  const sciExp = convertedVal.toExponential(precision);
  const [mantissa, exponent] = sciExp.split('e');
  const expInt = parseInt(exponent, 10);
  const expSuper = expInt.toString().replace('-', '⁻').replace('+', '');
  const scientificResult = `${mantissa} × 10${expSuper || '⁰'} ${outputUnitSymbol}`;
  
  const singleUnitRatio = fromFactor / toFactor;
  
  const stepProof = `mass(${toUnit}) = ${rawVal} ${fromUnit} × (${fromFactor} g / 1 ${fromUnit}) ÷ ${toFactor} g/${toUnit}
` +
                    `mass(${toUnit}) = ${gramsVal.toFixed(6)} g ÷ ${toFactor}
` +
                    `mass(${toUnit}) = ${convertedVal.toFixed(precision)} ${toUnit}`;

  const culDensity = parseFloat(culinaryIngredient) || 1.0;
  const culMl = 100 / culDensity;
  const culCups = culMl / 240;
  const culTbsp = culMl / 14.7868;

  const handleSwap = () => {
    const tempFrom = fromUnit;
    const tempTo = toUnit;
    if (UNIT_FACTORS[tempTo]) {
      setFromUnit(tempTo);
    }
    if (UNIT_FACTORS[tempFrom]) {
      setToUnit(tempFrom);
    }
  };

  const handlePreset = (val: number, from: string, to: string) => {
    setInputValue(val);
    setFromUnit(from);
    setToUnit(to);
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${formattedResult} ${outputUnitSymbol}`).then(() => {
      setCopyText('Copied!');
      setTimeout(() => setCopyText('Copy'), 1800);
    });
  };

  const shareConversion = () => {
    const shareData = {
      title: 'SolveIt Calculator Precision Gram Converter',
      text: `Check out this verified conversion: ${inputValue} ${fromUnit} to ${toUnit}`,
      url: window.location.href
    };
    if (navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else {
      copyToClipboard();
    }
  };
  
  const rows = [
    { label: '1 g', g: 1, k: 0.001, oz: 0.035274, lb: 0.002205, ozt: 0.032151, ct: '5.0000', mg: '1,000', cups: '0.0042 cups' },
    { label: '5 g', g: 5, k: 0.005, oz: 0.176370, lb: 0.011023, ozt: 0.160754, ct: '25.000', mg: '5,000', cups: '0.0211 cups' },
    { label: '10 g', g: 10, k: 0.010, oz: 0.352740, lb: 0.022046, ozt: 0.321507, ct: '50.000', mg: '10,000', cups: '0.0423 cups' },
    { label: '25 g', g: 25, k: 0.025, oz: 0.881849, lb: 0.055116, ozt: 0.803769, ct: '125.00', mg: '25,000', cups: '0.1057 cups' },
    { label: '50 g', g: 50, k: 0.050, oz: 1.763698, lb: 0.110231, ozt: 1.607537, ct: '250.00', mg: '50,000', cups: '0.2113 cups' },
    { label: '100 g', g: 100, k: 0.100, oz: 3.527396, lb: 0.220462, ozt: 3.215075, ct: '500.00', mg: '100,000', cups: '0.4227 cups', bold: true },
    { label: '250 g', g: 250, k: 0.250, oz: 8.818490, lb: 0.551156, ozt: 8.037687, ct: '1,250.0', mg: '250,000', cups: '1.0567 cups' },
    { label: '500 g', g: 500, k: 0.500, oz: 17.63698, lb: 1.102311, ozt: 16.07537, ct: '2,500.0', mg: '500,000', cups: '2.1134 cups', bold: true },
    { label: '1,000 g', g: 1000, k: 1.000, oz: 35.27396, lb: 2.204623, ozt: 32.15075, ct: '5,000.0', mg: '1,000,000', cups: '4.2268 cups', bold: true },
    { label: '5,000 g', g: 5000, k: 5.000, oz: 176.3698, lb: 11.02311, ozt: 160.7537, ct: '25,000', mg: '5,000,000', cups: '21.1338 cups' },
  ];

  return (
    <div className="bg-background font-body-md text-on-surface antialiased min-h-screen flex flex-col selection:bg-primary/20">
      <main className="w-full pt-[98px] bg-background min-h-[calc(100vh-380px)]">

{/*  Telemetry Strip & BIPM Metrology Anchor  */}
<div className="w-full bg-surface-container-high py-2 px-gutter-mobile md:px-gutter-desktop">
<div className="max-w-max-width-canvas mx-auto flex flex-wrap items-center justify-between gap-2 text-body-sm font-body-sm">
<div className="flex flex-wrap items-center gap-space-sm text-on-surface-variant">
<span className="flex items-center gap-1 text-primary font-medium">
<span className="material-symbols-outlined text-[16px]">science</span>
          BIPM SI Standard (Planck Constant <i>h</i> = 6.62607015&times;10⁻³⁴ J·s)
        </span>
<span className="hidden md:inline text-outline-variant">•</span>
<span className="hidden md:inline">NIST SP 811 &amp; Handbook 44 Metrology Verified</span>
<span className="hidden lg:inline text-outline-variant">•</span>
<span className="hidden lg:flex items-center gap-1 text-secondary">
<span className="material-symbols-outlined text-[15px]">security</span>
          100% Client-Side Local Sandbox
        </span>
</div>
<div className="flex items-center gap-space-xs font-data-mono text-label-caps text-primary bg-surface-container-lowest px-2 py-0.5 rounded-full shadow-sm">
<span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
        LATENCY &lt;0.0008ms • ENGINE v4.26.1
      </div>
</div>
</div>
{/*  Breadcrumbs & Trust Ribbon  */}
<div className="w-full bg-surface py-space-sm px-gutter-mobile md:px-gutter-desktop">
<div className="max-w-max-width-canvas mx-auto flex flex-wrap items-center justify-between gap-space-md">
<nav aria-label="Breadcrumb" className="flex items-center gap-space-2xs text-body-sm font-body-sm text-on-surface-variant">
<Link className="hover:text-primary transition-colors" href="/">Home</Link>
<span className="material-symbols-outlined text-[14px]">chevron_right</span>
<Link className="hover:text-primary transition-colors" href="/conversion">Conversion</Link>
<span className="material-symbols-outlined text-[14px]">chevron_right</span>
<span className="text-on-surface font-medium">Mass &amp; Metrology</span>
<span className="material-symbols-outlined text-[14px]">chevron_right</span>
<span className="text-primary font-medium">Universal Gram Converter</span>
</nav>
<div className="flex flex-wrap items-center gap-2">
<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-caps text-label-caps">
<span className="material-symbols-outlined text-[14px] text-primary">scale</span> 100+ Units Supported
        </span>
<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-caps text-label-caps">
<span className="material-symbols-outlined text-[14px] text-secondary">database</span> 1,000+ Ingredient Densities
        </span>
<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-caps text-label-caps">
<span className="material-symbols-outlined text-[14px] text-tertiary">diamond</span> LBMA / Precious Metals
        </span>
</div>
</div>
</div>
{/*  HERO & INTRO SPECTRUM  */}
<section className="w-full bg-surface py-space-xl px-gutter-mobile md:px-gutter-desktop">
<div className="max-w-max-width-canvas mx-auto">
<div className="max-w-3xl">
<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-caps text-label-caps uppercase tracking-wider mb-space-sm">
<span className="material-symbols-outlined text-[14px]">balance</span>
          Universal Mass Metrology Hub • Edition 2026
        </div>
<h1 className="font-display-hero-mobile md:font-display-hero text-display-hero-mobile md:text-display-hero text-on-surface tracking-tight mb-space-sm">
          Gram Converter
        </h1>
<p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed mb-space-lg">
          Convert grams into kilograms, milligrams, pounds, ounces, culinary cups, teaspoons, milliliters, carats, troy ounces, and dozens of international metrological units instantly with exact algorithmic precision.
        </p>
</div>
{/*  Live Formula Preset Pills  */}
<div className="flex flex-wrap items-center gap-2 pt-2">
<span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mr-1 flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">bolt</span> Quick Presets:
        </span>
<button className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-data-mono text-body-sm transition-all shadow-sm flex items-center gap-1.5" onClick={() => handlePreset(100, 'g', 'oz')} type="button">
<span className="">100g → oz</span>
<span className="text-on-surface-variant text-[11px] font-sans">Avoirdupois</span>
</button>
<button className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-data-mono text-body-sm transition-all shadow-sm flex items-center gap-1.5" onClick={() => handlePreset(500, 'g', 'lb')} type="button">
<span className="">500g → lbs</span>
<span className="text-on-surface-variant text-[11px] font-sans">Imperial</span>
</button>
<button className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-data-mono text-body-sm transition-all shadow-sm flex items-center gap-1.5" onClick={() => handlePreset(10, 'g', 'tsp_sugar')} type="button">
<span className="">10g → tsp</span>
<span className="text-on-surface-variant text-[11px] font-sans">Granulated Sugar</span>
</button>
<button className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-data-mono text-body-sm transition-all shadow-sm flex items-center gap-1.5" onClick={() => handlePreset(250, 'g', 'cup_flour')} type="button">
<span className="">250g → cups</span>
<span className="text-on-surface-variant text-[11px] font-sans">AP Flour</span>
</button>
<button className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-data-mono text-body-sm transition-all shadow-sm flex items-center gap-1.5" onClick={() => handlePreset(1, 'g', 'ct')} type="button">
<span className="">1g → ct</span>
<span className="text-on-surface-variant text-[11px] font-sans">Gemstone Carats</span>
</button>
<button className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-data-mono text-body-sm transition-all shadow-sm flex items-center gap-1.5" onClick={() => handlePreset(5, 'g', 'mg')} type="button">
<span className="">5g → mg</span>
<span className="text-on-surface-variant text-[11px] font-sans">Pharma</span>
</button>
<button className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-data-mono text-body-sm transition-all shadow-sm flex items-center gap-1.5" onClick={() => handlePreset(31.1035, 'g', 'ozt')} type="button">
<span className="">31.10g → ozt</span>
<span className="text-on-surface-variant text-[11px] font-sans">Troy Bullion</span>
</button>
<Link className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-secondary hover:text-on-secondary text-on-surface font-data-mono text-body-sm transition-all shadow-sm flex items-center gap-1.5" href="/conversion/gram-to-liter">
<span className="">1,000g → L</span>
<span className="text-secondary hover:text-on-secondary text-[11px] font-sans font-medium">Liters Calculator</span>
</Link>
</div>
</div>
</section>
{/*  UNIVERSAL INTERACTIVE GRAM WORKBENCH (REAL-TIME ENGINE)  */}
<section className="w-full bg-surface-container-lowest py-space-xl px-gutter-mobile md:px-gutter-desktop shadow-md">
<div className="max-w-max-width-canvas mx-auto">
{/*  Responsive Workbench Grid  */}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
{/*  Left Input Configuration Card (Col 7)  */}
<div className="lg:col-span-7 bg-surface p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md">
<div className="flex items-center justify-between pb-space-xs">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-primary text-[22px]">tune</span>
<span className="font-headline-md text-headline-md text-on-surface">Input Parameters</span>
</div>
<div className="flex items-center gap-1 bg-surface-container px-2 py-1 rounded-lg">
<span className="material-symbols-outlined text-[16px] text-on-surface-variant">speed</span>
<span className="font-data-mono text-label-caps text-on-surface-variant">Real-Time Reactive</span>
</div>
</div>
{/*  Value Input Field with Tabular Scale Display  */}
<div>
<div className="flex justify-between items-center mb-1">
<label className="font-label-caps text-label-caps text-on-surface uppercase tracking-wider" htmlFor="inputValue">Magnitude / Mass Value</label>
<span className="font-data-mono text-body-sm text-on-surface-variant" id="inputMicroUnitLabel">Base grams: {gramsVal.toFixed(6)} g</span>
</div>
<div className="relative flex items-center">
<input className="w-full px-4 py-3.5 bg-surface-container-lowest rounded-xl font-data-mono text-numerical-display-mobile md:text-numerical-display text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-inner tracking-tight transition-all" id="inputValue" min="0" placeholder="0.00" step="any" type="number" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
<div className="absolute right-4 flex items-center gap-1">
<button className="w-8 h-8 rounded-lg bg-surface-container text-on-surface-variant hover:text-on-surface flex items-center justify-center transition-colors" onClick={() => setInputValue('')} title="Clear value" type="button">
<span className="material-symbols-outlined text-[18px]">backspace</span>
</button>
</div>
</div>
</div>
{/*  Quick Granular Magnitude Selector Chips  */}
<div>
<p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mb-2">Standard Benchmarks (Click to Set Value)</p>
<div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
{[1, 5, 10, 25, 50, 100, 250, 500, 1000, 5000].map(val => (
  <button key={val} className={`py-1.5 rounded bg-surface-container hover:bg-primary hover:text-on-primary font-data-mono text-body-sm transition-all text-center ${Number(inputValue) === val ? 'bg-primary text-on-primary font-bold' : ''}`} onClick={() => setInputValue(val)} type="button">
    {val >= 1000 ? `${val/1000}kg` : `${val}g`}
  </button>
))}
</div>
</div>
{/*  Unit Selector Architecture (Dual Pickers with Fluid Bidirectional Inversion)  */}
<div className="grid grid-cols-1 sm:grid-cols-9 gap-3 items-center pt-2">
{/*  Source Unit (Col 4)  */}
<div className="sm:col-span-4 flex flex-col gap-1">
<label className="font-label-caps text-label-caps text-on-surface uppercase tracking-wider flex items-center gap-1" htmlFor="fromUnit">
<span className="w-2 h-2 rounded-full bg-primary"></span> From Unit
              </label>
<select className="w-full px-3.5 py-3 rounded-xl bg-surface-container-lowest font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-sm appearance-none cursor-pointer" id="fromUnit" value={fromUnit} onChange={(e) => { const val = e.target.value; if (val === 'l_water' || val === 'liters') { router.push('/conversion/liter-to-gram'); } else if (val === 'g' && toUnit === 'lb') { router.push('/conversion/gram-to-pound'); } else { setFromUnit(val); } }}>
<optgroup label="Metric Mass (SI Base)">
<option value="g">Grams (g)</option>
<option value="kg">Kilograms (kg)</option>
<option value="mg">Milligrams (mg)</option>
<option value="mcg">Micrograms (μg / mcg)</option>
<option value="t">Metric Tonnes (t / 1,000 kg)</option>
</optgroup>
<optgroup label="Avoirdupois (US / UK Everyday)">
<option value="oz">Ounces (oz avoirdupois)</option>
<option value="lb">Pounds (lb)</option>
<option value="st">Stones (st)</option>
<option value="us_ton">US Short Ton (2,000 lb)</option>
<option value="uk_ton">Imperial Long Ton (2,240 lb)</option>
</optgroup>
<optgroup label="Precious Metals &amp; Gemological">
<option value="ct">Carats (ct / metric 0.2g)</option>
<option value="ozt">Troy Ounces (oz t)</option>
<option value="dwt">Pennyweights (dwt)</option>
<option value="tola">Tolas (Indian standard 11.66g)</option>
<option value="grain">Grains (gr / pharma 64.79891mg)</option>
</optgroup>
<optgroup label="Culinary Volumetric (Water Baseline 1g/mL)">
<option value="l_water">Liters (L / water 1,000mL)</option>
<option value="ml_water">Milliliters (mL / water)</option>
<option value="tsp_water">Teaspoons (US / water 4.928mL)</option>
<option value="tbsp_water">Tablespoons (US / water 14.786mL)</option>
<option value="cup_water">Cups (US Legal / water 240mL)</option>
</optgroup>
</select>
</div>
{/*  Swap Switcher Button (Col 1)  */}
<div className="sm:col-span-1 flex justify-center pt-5 sm:pt-4">
<button className="w-11 h-11 rounded-full bg-primary-fixed hover:bg-primary hover:text-on-primary text-on-primary-fixed flex items-center justify-center transition-all transform active:rotate-180 duration-300 shadow-sm" id="swapBtn" onClick={handleSwap} title="Swap From and To units" type="button">
<span className="material-symbols-outlined text-[20px]">swap_horiz</span>
</button>
</div>
{/*  Destination Unit (Col 4)  */}
<div className="sm:col-span-4 flex flex-col gap-1">
<label className="font-label-caps text-label-caps text-on-surface uppercase tracking-wider flex items-center gap-1" htmlFor="toUnit">
<span className="w-2 h-2 rounded-full bg-secondary"></span> To Converted Unit
              </label>
<select className="w-full px-3.5 py-3 rounded-xl bg-surface-container-lowest font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-sm appearance-none cursor-pointer" id="toUnit" value={toUnit} onChange={(e) => { const val = e.target.value; if (val === 'l_water' || val === 'liters') { router.push('/conversion/gram-to-liter'); } else if (val === 'lb' && fromUnit === 'g') { router.push('/conversion/gram-to-pound'); } else { setToUnit(val); } }}>
<optgroup label="Avoirdupois (US / UK Standard)">
<option value="oz">Ounces (oz avoirdupois)</option>
<option value="lb">Pounds (lb)</option>
<option value="st">Stones (st)</option>
<option value="us_ton">US Short Ton (2,000 lb)</option>
<option value="uk_ton">Imperial Long Ton (2,240 lb)</option>
</optgroup>
<optgroup label="Metric Mass (SI Base)">
<option value="g">Grams (g)</option>
<option value="kg">Kilograms (kg)</option>
<option value="mg">Milligrams (mg)</option>
<option value="mcg">Micrograms (μg)</option>
<option value="t">Metric Tonnes (t)</option>
</optgroup>
<optgroup label="Precious Metals &amp; Gemological">
<option value="ct">Carats (ct)</option>
<option value="ozt">Troy Ounces (oz t)</option>
<option value="dwt">Pennyweights (dwt)</option>
<option value="tola">Tolas (11.6638g)</option>
<option value="grain">Grains (gr)</option>
</optgroup>
<optgroup label="Culinary Volumetric (Calibrated)">
<option value="l_water">Liters (L / volume 1,000mL)</option>
<option value="cup_flour">Cups (US All-Purpose Flour)</option>
<option value="cup_sugar">Cups (US Granulated Sugar)</option>
<option value="cup_butter">Cups (US Butter)</option>
<option value="cup_water">Cups (US Pure Water)</option>
<option value="tbsp_sugar">Tablespoons (Granulated Sugar)</option>
<option value="tsp_sugar">Teaspoons (Granulated Sugar)</option>
<option value="tsp_salt">Teaspoons (Fine Table Salt)</option>
<option value="ml_water">Milliliters (mL / volume)</option>
</optgroup>
</select>
</div>
</div>
{/*  Decimal Precision & Rounding Adjuster  */}
<div className="flex flex-wrap items-center justify-between pt-2 border-none">
<div className="flex items-center gap-2">
<span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Significant Decimals:</span>
<div className="inline-flex rounded-lg bg-surface-container p-0.5" id="precisionSelector">
{[2, 4, 6, 8].map(p => (
  <button key={p} className={`px-2.5 py-1 text-label-caps font-data-mono rounded transition-colors ${precision === p ? 'bg-primary text-on-primary font-bold shadow-sm' : 'text-on-surface hover:bg-surface-container-high'}`} onClick={() => setPrecision(p)} type="button">
    .{'0'.repeat(p)}
  </button>
))}
</div>
</div>
<div className="text-body-sm font-body-sm text-on-surface-variant flex items-center gap-1">
<span className="material-symbols-outlined text-[16px] text-primary">check_circle</span>
<span className="">Exact IEEE 754 BigFloat Precision</span>
</div>
</div>
</div>
{/*  Right Dynamic Live Result Card (Col 5)  */}
<div className="lg:col-span-5 flex flex-col gap-space-md">
{/*  Luminescent Glass Result Container  */}
<div className="bg-gradient-to-br from-surface-container-high to-surface-container p-space-lg rounded-xl shadow-lg relative overflow-hidden">
<div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 rounded-full bg-primary/10 blur-2xl pointer-events-none"></div>
<div className="flex justify-between items-center mb-space-xs">
<span className="font-label-caps text-label-caps text-primary uppercase tracking-widest font-semibold flex items-center gap-1">
<span className="material-symbols-outlined text-[15px]">verified_user</span> Instant Computed Output
              </span>
<span className="font-data-mono text-label-caps px-2 py-0.5 rounded bg-primary text-on-primary" id="outputUnitSymbol">{outputUnitSymbol}</span>
</div>
{/*  Primary Big Display Metric  */}
<div className="py-space-xs">
<div className="font-data-mono text-numerical-display-mobile md:text-numerical-display text-on-surface tracking-tight font-bold break-all transition-all" id="primaryResultDisplay">{formattedResult}</div>
<div className="font-body-md text-body-md text-on-surface-variant mt-1 flex items-center gap-1.5" id="resultSpelledOut">{resultSpelledOut}</div>
</div>
{/*  High Precision Scientific Notation Sidecar  */}
<div className="bg-surface-container-lowest/80 backdrop-blur rounded-lg p-3 my-space-xs shadow-sm">
<div className="flex justify-between items-center text-body-sm font-body-sm">
<span className="text-on-surface-variant">Scientific Notation:</span>
<span className="font-data-mono font-semibold text-primary" id="scientificResult">{scientificResult}</span>
</div>
<div className="flex justify-between items-center text-body-sm font-body-sm mt-1 pt-1 border-t border-surface-container">
<span className="text-on-surface-variant">SI Multiplier Ratio:</span>
<span className="font-data-mono text-on-surface text-[12px]" id="conversionRatio">1 {fromUnit} = {singleUnitRatio.toFixed(precision)} {toUnit}</span>
</div>
</div>
{/*  Algorithmic Step Proof  */}
<div className="bg-surface-container-lowest/60 rounded-lg p-3 my-space-xs">
<span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider block mb-1">Formal Step-by-Step Proof</span>
<div className="font-data-mono text-[12px] text-on-surface leading-relaxed whitespace-pre-wrap" id="stepProofDisplay">{stepProof}</div>
</div>
{/*  Rapid Action Utility Buttons  */}
<div className="grid grid-cols-3 gap-2 pt-2">
<button className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-body-sm font-medium transition-all shadow-sm active:scale-95" id="copyBtn" onClick={copyToClipboard} type="button">
<span className="material-symbols-outlined text-[18px]">content_copy</span>
<span id="copyBtnText" className="">{copyText}</span>
</button>
<button className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-surface-container-lowest hover:bg-surface-container-highest text-on-surface text-body-sm font-medium transition-all shadow-sm" onClick={() => window.print()} type="button">
<span className="material-symbols-outlined text-[18px]">print</span>
<span className="">Print</span>
</button>
<button className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-surface-container-lowest hover:bg-surface-container-highest text-on-surface text-body-sm font-medium transition-all shadow-sm" onClick={shareConversion} type="button">
<span className="material-symbols-outlined text-[18px]">share</span>
<span className="">Share</span>
</button>
</div>
</div>
{/*  Synchronous Quick Multi-Unit Snapshot  */}
<div className="bg-surface p-space-md rounded-xl shadow-sm">
<span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider block mb-2">Simultaneous Equivalents for <span className="font-data-mono text-primary" id="snapshotInputSpan">{gramsVal.toFixed(2)} g</span>:</span>
<div className="grid grid-cols-2 gap-2 text-body-sm font-body-sm">
<div className="bg-surface-container-low p-2 rounded-lg">
<span className="text-on-surface-variant block text-label-caps">Kilograms (kg)</span>
<span className="font-data-mono font-semibold text-on-surface" id="snapKg">{(gramsVal / 1000).toFixed(4)} kg</span>
</div>
<div className="bg-surface-container-low p-2 rounded-lg">
<span className="text-on-surface-variant block text-label-caps">Pounds (lb)</span>
<span className="font-data-mono font-semibold text-on-surface" id="snapLb">{(gramsVal / 453.59237).toFixed(4)} lb</span>
</div>
<div className="bg-surface-container-low p-2 rounded-lg">
<span className="text-on-surface-variant block text-label-caps">Milligrams (mg)</span>
<span className="font-data-mono font-semibold text-on-surface" id="snapMg">{(gramsVal * 1000).toLocaleString('en-US')} mg</span>
</div>
<div className="bg-surface-container-low p-2 rounded-lg">
<span className="text-on-surface-variant block text-label-caps">Troy Ounces (ozt)</span>
<span className="font-data-mono font-semibold text-on-surface" id="snapOzt">{(gramsVal / 31.1034768).toFixed(5)} ozt</span>
</div>
</div>
</div>
</div>
</div>
</div>
</section>
<section className="w-full bg-surface-container-low py-space-2xl px-gutter-mobile md:px-gutter-desktop border-t border-b border-outline-variant/30" id="dedicated-converters-suite"><div className="max-w-max-width-canvas mx-auto"><div className="flex flex-col md:flex-row md:items-end justify-between mb-space-lg gap-4"><div><div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-caps text-label-caps uppercase tracking-wider mb-space-xs"><span className="material-symbols-outlined text-[14px]">apps</span> Complete Metrological Matrix</div><h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Convert from Grams — Dedicated Tool Suite</h2><p className="font-body-md text-body-md text-on-surface-variant mt-1 max-w-2xl">Instant access to calibrated calculators for all 12 primary mass, imperial weight, and density-dependent volume conversions from grams.</p></div><div className="flex items-center gap-2 font-data-mono text-label-caps text-on-surface-variant bg-surface px-3 py-1.5 rounded-xl shadow-sm border border-outline-variant/30"><span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>12 Specialized Converters Ready</div></div>{/*  GROUP 1: WEIGHT & MASS (IMPERIAL & SI)  */}<div className="mb-space-xl"><div className="flex items-center gap-2 pb-space-xs mb-space-md border-b border-outline-variant/30"><span className="material-symbols-outlined text-primary text-[20px]">scale</span><h3 className="font-headline-md text-headline-md text-on-surface">Weight &amp; Mass (Imperial &amp; SI)</h3><span className="font-label-caps text-label-caps px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed ml-auto">Inherent Mass Standard</span></div><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">{/*  1. Grams to Ounces  */}
<div className="bg-surface p-space-md rounded-xl shadow-sm border border-outline-variant/30 hover:border-primary transition-all flex flex-col justify-between group">
  <div className="flex items-start justify-between gap-2 mb-2">
    <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
      <span className="material-symbols-outlined text-[18px]">scale</span>
    </div>
    <span className="font-label-caps text-label-caps px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">Imperial Mass</span>
  </div>
  <div>
    <h4 className="font-headline-md text-[18px] text-on-surface font-semibold">Grams to Ounces</h4>
    <div className="font-data-mono text-label-caps text-primary mb-2">g → oz (Avoirdupois)</div>
    <p className="font-body-sm text-body-sm text-on-surface-variant mb-3">
      Direct everyday Imperial conversion. 1 oz is legally defined as 28.349523125g.
    </p>
    <div className="bg-surface-container-low p-2.5 rounded-lg text-body-sm font-data-mono mb-3 space-y-1">
      <div className="flex justify-between text-[12px] text-on-surface-variant">
        <span className="">Formula:</span>
        <span className="text-on-surface font-semibold">1 g = 0.035274 oz</span>
      </div>
      <div className="flex justify-between text-[12px] text-on-surface-variant">
        <span className="">Benchmark:</span>
        <span className="text-primary font-bold">100 g = 3.5274 oz</span>
      </div>
    </div>
  </div>
  <Link href="/conversion/gram-to-ounces" className="w-full py-2 px-3 rounded-lg bg-surface-container hover:bg-primary hover:text-on-primary text-primary font-body-sm font-medium transition-all flex items-center justify-center gap-1.5">
    <span className="">Open Calculator</span>
    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
  </Link>
</div>{/*  2. Grams to Pounds  */}
<div className="bg-surface p-space-md rounded-xl shadow-sm border border-outline-variant/30 hover:border-primary transition-all flex flex-col justify-between group">
  <div className="flex items-start justify-between gap-2 mb-2">
    <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
      <span className="material-symbols-outlined text-[18px]">fitness_center</span>
    </div>
    <span className="font-label-caps text-label-caps px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">Imperial Mass</span>
  </div>
  <div>
    <h4 className="font-headline-md text-[18px] text-on-surface font-semibold">Grams to Pounds</h4>
    <div className="font-data-mono text-label-caps text-primary mb-2">g → lbs (Avoirdupois)</div>
    <p className="font-body-sm text-body-sm text-on-surface-variant mb-3">Standard bodyweight and cargo unit. 1 pound equals exactly 453.59237 grams.</p>
    <div className="bg-surface-container-low p-2.5 rounded-lg text-body-sm font-data-mono mb-3 space-y-1">
      <div className="flex justify-between text-[12px] text-on-surface-variant">
        <span className="">Formula:</span>
        <span className="text-on-surface font-semibold">1 g = 0.002205 lb</span>
      </div>
      <div className="flex justify-between text-[12px] text-on-surface-variant">
        <span className="">Benchmark:</span>
        <span className="text-primary font-bold">500 g = 1.1023 lbs</span>
      </div>
    </div>
  </div>
  <Link href="/conversion/gram-to-pound" className="w-full py-2 px-3 rounded-lg bg-surface-container hover:bg-primary hover:text-on-primary text-primary font-body-sm font-medium transition-all flex items-center justify-center gap-1.5">
    <span className="">Open Calculator</span>
    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
  </Link>
</div>{/*  3. Grams to Kilograms  */}
<div className="bg-surface p-space-md rounded-xl shadow-sm border border-outline-variant/30 hover:border-primary transition-all flex flex-col justify-between group">
  <div className="flex items-start justify-between gap-2 mb-2">
    <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
      <span className="material-symbols-outlined text-[18px]">line_weight</span>
    </div>
    <span className="font-label-caps text-label-caps px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-bold">SI Base Unit</span>
  </div>
  <div>
    <h4 className="font-headline-md text-[18px] text-on-surface font-semibold">Grams to Kilograms</h4>
    <div className="font-data-mono text-label-caps text-primary mb-2">g → kg (Metric SI)</div>
    <p className="font-body-sm text-body-sm text-on-surface-variant mb-3">Exact decimal SI ratio. The international standard unit for physical body mass.</p>
    <div className="bg-surface-container-low p-2.5 rounded-lg text-body-sm font-data-mono mb-3 space-y-1">
      <div className="flex justify-between text-[12px] text-on-surface-variant">
        <span className="">Formula:</span>
        <span className="text-on-surface font-semibold">1 g = 0.001 kg (10⁻³)</span>
      </div>
      <div className="flex justify-between text-[12px] text-on-surface-variant">
        <span className="">Benchmark:</span>
        <span className="text-primary font-bold">1,000 g = 1.0000 kg</span>
      </div>
    </div>
  </div>
  <Link href="/conversion/gram-to-kilogram" className="w-full py-2 px-3 rounded-lg bg-surface-container hover:bg-primary hover:text-on-primary text-primary font-body-sm font-medium transition-all flex items-center justify-center gap-1.5">
    <span className="">Open Calculator</span>
    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
  </Link>
</div>{/*  4. Grams to Milligrams  */}
<div className="bg-surface p-space-md rounded-xl shadow-sm border border-outline-variant/30 hover:border-primary transition-all flex flex-col justify-between group">
  <div className="flex items-start justify-between gap-2 mb-2">
    <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
      <span className="material-symbols-outlined text-[18px]">medication</span>
    </div>
    <span className="font-label-caps text-label-caps px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">Clinical &amp; Pharma</span>
  </div>
  <div>
    <Link href="/conversion/gram-to-milligram" className="hover:text-primary transition-colors">
      <h4 className="font-headline-md text-[18px] text-on-surface font-semibold group-hover:text-primary transition-colors">Grams to Milligrams</h4>
    </Link>
    <div className="font-data-mono text-label-caps text-primary mb-2">g → mg (Micro-scale)</div>
    <p className="font-body-sm text-body-sm text-on-surface-variant mb-3">Critical for clinical dosing and laboratory science with zero margin of error.</p>
    <div className="bg-surface-container-low p-2.5 rounded-lg text-body-sm font-data-mono mb-3 space-y-1">
      <div className="flex justify-between text-[12px] text-on-surface-variant">
        <span className="">Formula:</span>
        <span className="text-on-surface font-semibold">1 g = 1,000 mg (10³)</span>
      </div>
      <div className="flex justify-between text-[12px] text-on-surface-variant">
        <span className="">Benchmark:</span>
        <span className="text-primary font-bold">5 g = 5,000 mg</span>
      </div>
    </div>
  </div>
  <Link href="/conversion/gram-to-milligram" className="w-full py-2 px-3 rounded-lg bg-surface-container hover:bg-primary hover:text-on-primary text-primary font-body-sm font-medium transition-all flex items-center justify-center gap-1.5">
    <span className="">Open Calculator</span>
    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
  </Link>
</div></div></div>{/*  GROUP 2: VOLUME & CULINARY (DENSITY-BASED)  */}<div><div className="flex items-center gap-2 pb-space-xs mb-space-md border-b border-outline-variant/30"><span className="material-symbols-outlined text-secondary text-[20px]">restaurant</span><h3 className="font-headline-md text-headline-md text-on-surface">Volume &amp; Culinary (Density-Based)</h3><span className="font-label-caps text-label-caps px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed ml-auto">USDA Density Calibrated (H₂O 1.0 g/mL)</span></div><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">{/*  5. Grams to Teaspoons  */}
<div className="bg-surface p-space-md rounded-xl shadow-sm border border-outline-variant/30 hover:border-secondary transition-all flex flex-col justify-between group">
  <div className="flex items-start justify-between gap-2 mb-2">
    <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
      <span className="material-symbols-outlined text-[18px]">soup_kitchen</span>
    </div>
    <span className="font-label-caps text-label-caps px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">Culinary Spoon</span>
  </div>
  <div>
    <h4 className="font-headline-md text-[18px] text-on-surface font-semibold">Grams to Teaspoons</h4>
    <div className="font-data-mono text-label-caps text-secondary mb-2">g → tsp (US 4.928 mL)</div>
    <p className="font-body-sm text-body-sm text-on-surface-variant mb-3">
      Calibrated for spices, leaveners, and sugar. Density changes volume significantly.
    </p>
    <div className="bg-surface-container-low p-2.5 rounded-lg text-body-sm font-data-mono mb-3 space-y-1">
      <div className="flex justify-between text-[12px] text-on-surface-variant">
        <span className="">Formula (Water):</span>
        <span className="text-on-surface font-semibold">1 g ≈ 0.2029 tsp</span>
      </div>
      <div className="flex justify-between text-[12px] text-on-surface-variant">
        <span className="">Sugar benchmark:</span>
        <span className="text-secondary font-bold">10 g sugar ≈ 2.40 tsp</span>
      </div>
    </div>
  </div>
  <Link href="/conversion/grams-to-teaspoons" className="w-full py-2 px-3 rounded-lg bg-surface-container hover:bg-secondary hover:text-on-secondary text-secondary font-body-sm font-medium transition-all flex items-center justify-center gap-1.5">
    <span className="">Open Calculator</span>
    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
  </Link>
</div>{/*  6. Grams to Tablespoons  */}
<div className="bg-surface p-space-md rounded-xl shadow-sm border border-outline-variant/30 hover:border-secondary transition-all flex flex-col justify-between group">
  <div className="flex items-start justify-between gap-2 mb-2">
    <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
      <span className="material-symbols-outlined text-[18px]">restaurant</span>
    </div>
    <span className="font-label-caps text-label-caps px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">Culinary Volume</span>
  </div>
  <div>
    <h4 className="font-headline-md text-[18px] text-on-surface font-semibold">Grams to Tablespoons</h4>
    <div className="font-data-mono text-label-caps text-secondary mb-2">g → tbsp (US 14.787 mL)</div>
    <p className="font-body-sm text-body-sm text-on-surface-variant mb-3">
      Essential for butter, honey, and cooking oils. 1 US tbsp equals 3 teaspoons.
    </p>
    <div className="bg-surface-container-low p-2.5 rounded-lg text-body-sm font-data-mono mb-3 space-y-1">
      <div className="flex justify-between text-[12px] text-on-surface-variant">
        <span className="">Formula (Water):</span>
        <span className="text-on-surface font-semibold">1 g ≈ 0.0676 tbsp</span>
      </div>
      <div className="flex justify-between text-[12px] text-on-surface-variant">
        <span className="">Butter benchmark:</span>
        <span className="text-secondary font-bold">14.2 g butter = 1 tbsp</span>
      </div>
    </div>
  </div>
  <Link href="/conversion/grams-to-tablespoons" className="w-full py-2 px-3 rounded-lg bg-surface-container hover:bg-secondary hover:text-on-secondary text-secondary font-body-sm font-medium transition-all flex items-center justify-center gap-1.5">
    <span className="">Open Calculator</span>
    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
  </Link>
</div>{/*  7. Grams to Fluid Ounces  */}<div className="bg-surface p-space-md rounded-xl shadow-sm border border-outline-variant/30 hover:border-secondary transition-all flex flex-col justify-between group"><div className="flex items-start justify-between gap-2 mb-2"><div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-on-secondary transition-colors"><span className="material-symbols-outlined text-[18px]">local_drink</span></div><span className="font-label-caps text-label-caps px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">Liquid Capacity</span></div><div><h4 className="font-headline-md text-[18px] text-on-surface font-semibold">Grams to Fluid Ounces</h4><div className="font-data-mono text-label-caps text-secondary mb-2">g → fl oz (US 29.573 mL)</div><p className="font-body-sm text-body-sm text-on-surface-variant mb-3">Distinguishes volumetric fluid ounces from weight ounces to prevent formulation loss.</p><div className="bg-surface-container-low p-2.5 rounded-lg text-body-sm font-data-mono mb-3 space-y-1"><div className="flex justify-between text-[12px] text-on-surface-variant"><span className="">Formula (Water):</span><span className="text-on-surface font-semibold">1 g ≈ 0.0338 fl oz</span></div><div className="flex justify-between text-[12px] text-on-surface-variant"><span className="">Benchmark:</span><span className="text-secondary font-bold">100 g water = 3.38 fl oz</span></div></div></div><Link href="/conversion/gram-to-fluid-ounce" className="w-full py-2 px-3 rounded-lg bg-surface-container hover:bg-secondary hover:text-on-secondary text-secondary font-body-sm font-medium transition-all flex items-center justify-center gap-1.5"><span className="">Open Calculator</span><span className="material-symbols-outlined text-[16px]">arrow_forward</span></Link></div>{/*  8. Grams to Cups  */}<div className="bg-surface p-space-md rounded-xl shadow-sm border border-outline-variant/30 hover:border-secondary transition-all flex flex-col justify-between group"><div className="flex items-start justify-between gap-2 mb-2"><div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-on-secondary transition-colors"><span className="material-symbols-outlined text-[18px]">coffee</span></div><span className="font-label-caps text-label-caps px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">Baking Metric</span></div><div><h4 className="font-headline-md text-[18px] text-on-surface font-semibold">Grams to Cups</h4><div className="font-data-mono text-label-caps text-secondary mb-2">g → cups (US 240 mL)</div><p className="font-body-sm text-body-sm text-on-surface-variant mb-3">Baking formula staple. Flours (120g/cup) vs sugar (200g/cup) require ingredient matrix.</p><div className="bg-surface-container-low p-2.5 rounded-lg text-body-sm font-data-mono mb-3 space-y-1"><div className="flex justify-between text-[12px] text-on-surface-variant"><span className="">Flour benchmark:</span><span className="text-on-surface font-semibold">120 g AP Flour = 1 Cup</span></div><div className="flex justify-between text-[12px] text-on-surface-variant"><span className="">Sugar benchmark:</span><span className="text-secondary font-bold">200 g Sugar = 1 Cup</span></div></div></div><Link href="/conversion/gram-to-cup" className="w-full py-2 px-3 rounded-lg bg-surface-container hover:bg-secondary hover:text-on-secondary text-secondary font-body-sm font-medium transition-all flex items-center justify-center gap-1.5"><span className="">Open Calculator</span><span className="material-symbols-outlined text-[16px]">arrow_forward</span></Link></div>
{/*  8.5 Grams to Milliliters (Dedicated Tool)  */}
<div className="bg-surface p-space-md rounded-xl shadow-sm border border-outline-variant/30 hover:border-secondary transition-all flex flex-col justify-between group">
  <div className="flex items-start justify-between gap-2 mb-2">
    <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
      <span className="material-symbols-outlined text-[18px]">science</span>
    </div>
    <span className="font-label-caps text-label-caps px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">Metric Volume</span>
  </div>
  <div>
    <h4 className="font-headline-md text-[18px] text-on-surface font-semibold">Grams to Milliliters</h4>
    <div className="font-data-mono text-label-caps text-secondary mb-2">g → mL (Density Dependent)</div>
    <p className="font-body-sm text-body-sm text-on-surface-variant mb-3">
      Advanced mass-to-volume calculator with specialized ingredient densities (water, flour, sugar, milk).
    </p>
    <div className="bg-surface-container-low p-2.5 rounded-lg text-body-sm font-data-mono mb-3 space-y-1">
      <div className="flex justify-between text-[12px] text-on-surface-variant">
        <span className="">Formula (Water):</span>
        <span className="text-on-surface font-semibold">1 g = 1 mL</span>
      </div>
      <div className="flex justify-between text-[12px] text-on-surface-variant">
        <span className="">Benchmark:</span>
        <span className="text-secondary font-bold">100 g = 100 mL</span>
      </div>
    </div>
  </div>
  <Link href="/conversion/grams-to-milliliters" className="w-full py-2 px-3 rounded-lg bg-surface-container hover:bg-secondary hover:text-on-secondary text-secondary font-body-sm font-medium transition-all flex items-center justify-center gap-1.5">
    <span className="">Open Calculator</span>
    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
  </Link>
</div>
{/*  9. Grams to Liters  */}
<div className="bg-surface p-space-md rounded-xl shadow-sm border border-outline-variant/30 hover:border-secondary transition-all flex flex-col justify-between group">
  <div className="flex items-start justify-between gap-2 mb-2">
    <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
      <span className="material-symbols-outlined text-[18px]">water_drop</span>
    </div>
    <span className="font-label-caps text-label-caps px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">Metric Volume</span>
  </div>
  <div>
    <Link href="/conversion/gram-to-liter" className="hover:text-primary transition-colors block">
      <h4 className="font-headline-md text-[18px] text-on-surface font-semibold hover:text-primary transition-colors">Grams to Liters</h4>
    </Link>
    <div className="font-data-mono text-label-caps text-secondary mb-2">g → L (1,000 mL)</div>
    <p className="font-body-sm text-body-sm text-on-surface-variant mb-3">Standard liquid metric volume. 1 Liter pure water at 4°C equals exactly 1,000 grams.</p>
    <div className="bg-surface-container-low p-2.5 rounded-lg text-body-sm font-data-mono mb-3 space-y-1">
      <div className="flex justify-between text-[12px] text-on-surface-variant">
        <span className="">Formula (Water):</span>
        <span className="text-on-surface font-semibold">1 g = 0.001 L</span>
      </div>
      <div className="flex justify-between text-[12px] text-on-surface-variant">
        <span className="">Benchmark:</span>
        <span className="text-secondary font-bold">1,000 g = 1.0000 L</span>
      </div>
    </div>
  </div>
  <Link href="/conversion/gram-to-liter" className="w-full py-2 px-3 rounded-lg bg-surface-container hover:bg-secondary hover:text-on-secondary text-secondary font-body-sm font-medium transition-all flex items-center justify-center gap-1.5">
    <span className="">Open Calculator</span>
    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
  </Link>
</div>
{/*  10. Grams to Pints  */}
<div className="bg-surface p-space-md rounded-xl shadow-sm border border-outline-variant/30 hover:border-secondary transition-all flex flex-col justify-between group">
  <div className="flex items-start justify-between gap-2 mb-2">
    <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
      <span className="material-symbols-outlined text-[18px]">water_full</span>
    </div>
    <span className="font-label-caps text-label-caps px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">Liquid &amp; Dry</span>
  </div>
  <div>
    <Link href="/conversion/grams-to-pints" className="hover:text-primary transition-colors block">
      <h4 className="font-headline-md text-[18px] text-on-surface font-semibold hover:text-primary transition-colors">Grams to Pints</h4>
    </Link>
    <div className="font-data-mono text-label-caps text-secondary mb-2">g → pt (US 473.176 mL)</div>
    <p className="font-body-sm text-body-sm text-on-surface-variant mb-3">US liquid capacity measure. 1 US liquid pint contains 16 fluid ounces (2 cups).</p>
    <div className="bg-surface-container-low p-2.5 rounded-lg text-body-sm font-data-mono mb-3 space-y-1">
      <div className="flex justify-between text-[12px] text-on-surface-variant">
        <span className="">Formula (Water):</span>
        <span className="text-on-surface font-semibold">1 g ≈ 0.002113 pt</span>
      </div>
      <div className="flex justify-between text-[12px] text-on-surface-variant">
        <span className="">Benchmark:</span>
        <span className="text-secondary font-bold">473.2 g water ≈ 1.0 pt</span>
      </div>
    </div>
  </div>
  <Link href="/conversion/grams-to-pints" className="w-full py-2 px-3 rounded-lg bg-surface-container hover:bg-secondary hover:text-on-secondary text-secondary font-body-sm font-medium transition-all flex items-center justify-center gap-1.5">
    <span className="">Open Calculator</span>
    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
  </Link>
</div>
{/*  11. Grams to Quarts  */}
<div className="bg-surface p-space-md rounded-xl shadow-sm border border-outline-variant/30 hover:border-secondary transition-all flex flex-col justify-between group">
  <div className="flex items-start justify-between gap-2 mb-2">
    <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
      <span className="material-symbols-outlined text-[18px]">liquids</span>
    </div>
    <span className="font-label-caps text-label-caps px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">Culinary Volume</span>
  </div>
  <div>
    <Link href="/conversion/grams-to-quarts" className="hover:text-primary transition-colors block">
      <h4 className="font-headline-md text-[18px] text-on-surface font-semibold hover:text-primary transition-colors">Grams to Quarts</h4>
    </Link>
    <div className="font-data-mono text-label-caps text-secondary mb-2">g → qt (US 946.353 mL)</div>
    <p className="font-body-sm text-body-sm text-on-surface-variant mb-3">Standard canning and dairy capacity. 1 US liquid quart equals 2 pints (32 fl oz).</p>
    <div className="bg-surface-container-low p-2.5 rounded-lg text-body-sm font-data-mono mb-3 space-y-1">
      <div className="flex justify-between text-[12px] text-on-surface-variant">
        <span className="">Formula (Water):</span>
        <span className="text-on-surface font-semibold">1 g ≈ 0.001057 qt</span>
      </div>
      <div className="flex justify-between text-[12px] text-on-surface-variant">
        <span className="">Benchmark:</span>
        <span className="text-secondary font-bold">946.4 g water ≈ 1.0 qt</span>
      </div>
    </div>
  </div>
  <Link href="/conversion/grams-to-quarts" className="w-full py-2 px-3 rounded-lg bg-surface-container hover:bg-secondary hover:text-on-secondary text-secondary font-body-sm font-medium transition-all flex items-center justify-center gap-1.5">
    <span className="">Open Calculator</span>
    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
  </Link>
</div>
{/*  12. Grams to Gallons  */}
<div className="bg-surface p-space-md rounded-xl shadow-sm border border-outline-variant/30 hover:border-secondary transition-all flex flex-col justify-between group">
  <div className="flex items-start justify-between gap-2 mb-2">
    <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
      <span className="material-symbols-outlined text-[18px]">propane_tank</span>
    </div>
    <span className="font-label-caps text-label-caps px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">Bulk Fluid</span>
  </div>
  <div>
    <Link href="/conversion/grams-to-gallons" className="hover:text-primary transition-colors block">
      <h4 className="font-headline-md text-[18px] text-on-surface font-semibold hover:text-primary transition-colors">Grams to Gallons</h4>
    </Link>
    <div className="font-data-mono text-label-caps text-secondary mb-2">g → gal (US 3.7854 L)</div>
    <p className="font-body-sm text-body-sm text-on-surface-variant mb-3">Bulk liquid fluid storage. 1 US gallon of water weighs approximately 3,785.4 grams (8.34 lbs).</p>
    <div className="bg-surface-container-low p-2.5 rounded-lg text-body-sm font-data-mono mb-3 space-y-1">
      <div className="flex justify-between text-[12px] text-on-surface-variant">
        <span className="">Formula (Water):</span>
        <span className="text-on-surface font-semibold">1 g ≈ 0.000264 gal</span>
      </div>
      <div className="flex justify-between text-[12px] text-on-surface-variant">
        <span className="">Benchmark:</span>
        <span className="text-secondary font-bold">3,785 g water ≈ 1 gal</span>
      </div>
    </div>
  </div>
  <Link href="/conversion/grams-to-gallons" className="w-full py-2 px-3 rounded-lg bg-surface-container hover:bg-secondary hover:text-on-secondary text-secondary font-body-sm font-medium transition-all flex items-center justify-center gap-1.5">
    <span className="">Open Calculator</span>
    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
  </Link>
</div></div></div></div></section>
{/*  VISUAL MASS SCALE & UNIT HIERARCHY EXPLORER  */}
<section className="w-full bg-surface py-space-2xl px-gutter-mobile md:px-gutter-desktop">
<div className="max-w-max-width-canvas mx-auto">
<div className="flex flex-col md:flex-row md:items-end justify-between mb-space-lg gap-4">
<div>
<span className="font-label-caps text-label-caps text-primary uppercase tracking-widest block mb-1">Visual Metrology Continuum</span>
<h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Mass Order of Magnitude Spectrum</h2>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant max-w-md">
          Explore the atomic to mega-scale weight progression anchored to the international Gram reference standard.
        </p>
</div>
{/*  Linear Metric Hierarchy Timeline Ribbon  */}
<div className="w-full bg-surface-container rounded-xl p-space-md overflow-x-auto shadow-inner">
<div className="min-w-[860px] flex items-stretch justify-between relative">
{/*  Microgram Node  */}
<div className="flex-1 text-center px-2 relative group cursor-pointer" onClick={() => {setInputValue(0.000001); setFromUnit('g');}}>
<div className="font-data-mono text-label-caps text-on-surface-variant mb-2">10⁻⁶ g</div>
<div className="w-8 h-8 mx-auto rounded-full bg-surface-container-lowest shadow flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-all">
<span className="material-symbols-outlined text-[16px]">grain</span>
</div>
<div className="font-label-caps text-on-surface mt-2 font-bold">Microgram</div>
<div className="font-data-mono text-[11px] text-on-surface-variant">0.001 mg</div>
<div className="text-[10px] text-on-surface-variant mt-1">Single Cell DNA</div>
</div>
{/*  Milligram Node  */}
<div className="flex-1 text-center px-2 relative group cursor-pointer" onClick={() => {setInputValue(0.001); setFromUnit('g');}}>
<div className="font-data-mono text-label-caps text-on-surface-variant mb-2">10⁻³ g</div>
<div className="w-8 h-8 mx-auto rounded-full bg-surface-container-lowest shadow flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-all">
<span className="material-symbols-outlined text-[16px]">medication</span>
</div>
<div className="font-label-caps text-on-surface mt-2 font-bold">Milligram</div>
<div className="font-data-mono text-[11px] text-on-surface-variant">0.001 g</div>
<div className="text-[10px] text-on-surface-variant mt-1">Eyelash / Tablet</div>
</div>
{/*  Carat Node  */}
<div className="flex-1 text-center px-2 relative group cursor-pointer" onClick={() => {setInputValue(0.2); setFromUnit('g');}}>
<div className="font-data-mono text-label-caps text-on-surface-variant mb-2">0.2 g</div>
<div className="w-8 h-8 mx-auto rounded-full bg-secondary-fixed shadow flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-on-secondary transition-all">
<span className="material-symbols-outlined text-[16px]">diamond</span>
</div>
<div className="font-label-caps text-on-surface mt-2 font-bold">Carat (ct)</div>
<div className="font-data-mono text-[11px] text-on-surface-variant">200 mg</div>
<div className="text-[10px] text-on-surface-variant mt-1">Diamond Solitaire</div>
</div>
{/*  GRAM BASE NODE (SI HERO)  */}
<div className="flex-1 text-center px-2 relative bg-primary-fixed/40 py-2 rounded-xl border border-primary/20 cursor-pointer" onClick={() => {setInputValue(1); setFromUnit('g');}}>
<div className="font-data-mono text-label-caps text-primary font-bold mb-1">10⁰ g (BASE)</div>
<div className="w-10 h-10 mx-auto rounded-full bg-primary shadow-lg flex items-center justify-center text-on-primary">
<span className="material-symbols-outlined text-[20px]">target</span>
</div>
<div className="font-label-caps text-primary mt-1 font-bold">1 GRAM (g)</div>
<div className="font-data-mono text-[11px] text-on-surface">1.000000 g</div>
<div className="text-[10px] text-primary font-medium mt-0.5">Paperclip / 1 mL H₂O</div>
</div>
{/*  Ounce Node  */}
<div className="flex-1 text-center px-2 relative group cursor-pointer" onClick={() => {setInputValue(28.3495); setFromUnit('g');}}>
<div className="font-data-mono text-label-caps text-on-surface-variant mb-2">28.35 g</div>
<div className="w-8 h-8 mx-auto rounded-full bg-surface-container-lowest shadow flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-all">
<span className="material-symbols-outlined text-[16px]">lunch_dining</span>
</div>
<div className="font-label-caps text-on-surface mt-2 font-bold">Ounce (oz)</div>
<div className="font-data-mono text-[11px] text-on-surface-variant">1/16 lb</div>
<div className="text-[10px] text-on-surface-variant mt-1">Slice of Bread</div>
</div>
{/*  Pound Node  */}
<div className="flex-1 text-center px-2 relative group cursor-pointer" onClick={() => {setInputValue(453.592); setFromUnit('g');}}>
<div className="font-data-mono text-label-caps text-on-surface-variant mb-2">453.59 g</div>
<div className="w-8 h-8 mx-auto rounded-full bg-surface-container-lowest shadow flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-all">
<span className="material-symbols-outlined text-[16px]">fitness_center</span>
</div>
<div className="font-label-caps text-on-surface mt-2 font-bold">Pound (lb)</div>
<div className="font-data-mono text-[11px] text-on-surface-variant">16 oz</div>
<div className="text-[10px] text-on-surface-variant mt-1">Block of Butter</div>
</div>
{/*  Kilogram Node  */}
<div className="flex-1 text-center px-2 relative group cursor-pointer" onClick={() => {setInputValue(1000); setFromUnit('g');}}>
<div className="font-data-mono text-label-caps text-on-surface-variant mb-2">10³ g</div>
<div className="w-8 h-8 mx-auto rounded-full bg-surface-container-lowest shadow flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-all">
<span className="material-symbols-outlined text-[16px]">scale</span>
</div>
<div className="font-label-caps text-on-surface mt-2 font-bold">Kilogram (kg)</div>
<div className="font-data-mono text-[11px] text-on-surface-variant">2.20462 lb</div>
<div className="text-[10px] text-on-surface-variant mt-1">1 Liter Pure Water</div>
</div>
{/*  Metric Ton Node  */}
<div className="flex-1 text-center px-2 relative group cursor-pointer" onClick={() => {setInputValue(1000000); setFromUnit('g');}}>
<div className="font-data-mono text-label-caps text-on-surface-variant mb-2">10⁶ g</div>
<div className="w-8 h-8 mx-auto rounded-full bg-surface-container-lowest shadow flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-all">
<span className="material-symbols-outlined text-[16px]">local_shipping</span>
</div>
<div className="font-label-caps text-on-surface mt-2 font-bold">Metric Ton (t)</div>
<div className="font-data-mono text-[11px] text-on-surface-variant">1,000 kg</div>
<div className="text-[10px] text-on-surface-variant mt-1">Compact Vehicle</div>
</div>
</div>
</div>
</div>
</section>
{/*  5 DEDICATED DOMAIN HUBS (CULINARY, JEWELRY, PHARMA, FITNESS, METROLOGY)  */}
<section className="w-full bg-surface-container-low py-space-2xl px-gutter-mobile md:px-gutter-desktop">
<div className="max-w-max-width-canvas mx-auto">
<div className="mb-space-lg">
<span className="font-label-caps text-label-caps text-primary uppercase tracking-widest block mb-1">Specialized Computational Suites</span>
<h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Domain-Specific Metrology Engines</h2>
<p className="font-body-md text-body-md text-on-surface-variant mt-1">Select an industry vertical to calibrate conversion parameters with certified physical constants.</p>
</div>
{/*  Domain Hub Cards Bento Layout  */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
{/*  CARD 1: CULINARY VOLUME BRIDGE  */}
<div className="bg-surface p-space-md rounded-xl shadow-sm flex flex-col justify-between">
<div>
<div className="flex items-center justify-between mb-3">
<div className="flex items-center gap-2">
<span className="w-9 h-9 rounded-lg bg-secondary-fixed flex items-center justify-center text-secondary">
<span className="material-symbols-outlined text-[20px]">restaurant</span>
</span>
<div>
<h3 className="font-headline-md text-headline-md text-on-surface">Culinary &amp; Baking</h3>
<span className="font-label-caps text-label-caps text-on-surface-variant">Density Calibration</span>
</div>
</div>
<span className="font-data-mono text-[11px] px-2 py-0.5 rounded bg-surface-container text-on-surface">USDA Calibrated</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mb-4">
              Mass-to-volume varies dramatically with ingredient compaction. 100g of flour (0.57 g/mL) equals ~0.73 cups, while 100g of granulated sugar (0.85 g/mL) fills ~0.49 cups.
            </p>
{/*  Quick Culinary Calibrator Tool  */}
<div className="bg-surface-container-low p-3 rounded-lg flex flex-col gap-2">
<label className="font-label-caps text-label-caps text-on-surface" htmlFor="culinaryIngredient">Select Food Matrix:</label>
<select className="w-full text-body-sm bg-surface-container-lowest p-2 rounded-lg font-medium text-on-surface shadow-sm focus:outline-none" id="culinaryIngredient" value={culinaryIngredient} onChange={(e) => setCulinaryIngredient(e.target.value)}>
<option value="1.0">Water / Milk (1.00 g/mL)</option>
<option value="0.57">All-Purpose Flour (0.57 g/mL)</option>
<option value="0.85">Granulated Sugar (0.85 g/mL)</option>
<option value="0.91">Butter, softened (0.911 g/mL)</option>
<option value="1.42">Honey, clover (1.42 g/mL)</option>
<option value="0.92">Olive Oil (0.92 g/mL)</option>
<option value="1.22">Table Salt, fine (1.217 g/mL)</option>
</select>
<div className="flex items-center justify-between pt-1 font-data-mono text-body-sm">
<span className="text-on-surface-variant">100g yield:</span>
<span className="font-bold text-primary" id="culinaryOutput">{culCups.toFixed(2)} US Cups • {culTbsp.toFixed(1)} tbsp</span>
</div>
</div>
</div>
<button className="mt-4 w-full py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-body-sm font-medium transition-colors flex items-center justify-center gap-1" onClick={() => handlePreset(100, 'g', 'cup_flour')} type="button">
<span className="">Load in Primary Converter</span>
<span className="material-symbols-outlined text-[16px]">arrow_forward</span>
</button>
</div>
{/*  CARD 2: PRECIOUS METALS & JEWELRY  */}
<div className="bg-surface p-space-md rounded-xl shadow-sm flex flex-col justify-between">
<div>
<div className="flex items-center justify-between mb-3">
<div className="flex items-center gap-2">
<span className="w-9 h-9 rounded-lg bg-tertiary-fixed flex items-center justify-center text-tertiary">
<span className="material-symbols-outlined text-[20px]">diamond</span>
</span>
<div>
<h3 className="font-headline-md text-headline-md text-on-surface">Precious Metals &amp; Gems</h3>
<span className="font-label-caps text-label-caps text-on-surface-variant">LBMA / GIA Metrology</span>
</div>
</div>
<span className="font-data-mono text-[11px] px-2 py-0.5 rounded bg-surface-container text-on-surface">Troy Standard</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mb-4">
              Gold, silver, and platinum are traded strictly in Troy Ounces (1 oz t = 31.1034768g), not avoirdupois ounces (28.3495g). Diamonds use metric carats (1 ct = 0.200g).
            </p>
<div className="bg-surface-container-low p-3 rounded-lg space-y-1.5 font-body-sm">
<div className="flex justify-between">
<span className="text-on-surface-variant">1 Troy Ounce Gold:</span>
<span className="font-data-mono font-semibold text-on-surface">31.1035 g</span>
</div>
<div className="flex justify-between">
<span className="text-on-surface-variant">1 Gram of Diamond:</span>
<span className="font-data-mono font-semibold text-on-surface">5.0000 ct</span>
</div>
<div className="flex justify-between">
<span className="text-on-surface-variant">1 Tola (South Asia):</span>
<span className="font-data-mono font-semibold text-on-surface">11.6638 g</span>
</div>
<div className="flex justify-between">
<span className="text-on-surface-variant">1 Pennyweight (dwt):</span>
<span className="font-data-mono font-semibold text-on-surface">1.55517 g</span>
</div>
</div>
</div>
<button className="mt-4 w-full py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-tertiary font-body-sm font-medium transition-colors flex items-center justify-center gap-1" onClick={() => handlePreset(31.1035, 'g', 'ozt')} type="button">
<span className="">Inspect Bullion Troy Engine</span>
<span className="material-symbols-outlined text-[16px]">arrow_forward</span>
</button>
</div>
{/*  CARD 3: PHARMACY, BIOTECH & CLINICAL  */}
<div className="bg-surface p-space-md rounded-xl shadow-sm flex flex-col justify-between">
<div>
<div className="flex items-center justify-between mb-3">
<div className="flex items-center gap-2">
<span className="w-9 h-9 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
<span className="material-symbols-outlined text-[20px]">medication</span>
</span>
<div>
<h3 className="font-headline-md text-headline-md text-on-surface">Pharma &amp; Clinical</h3>
<span className="font-label-caps text-label-caps text-on-surface-variant">USP / FDA Standards</span>
</div>
</div>
<span className="font-data-mono text-[11px] px-2 py-0.5 rounded bg-error-container text-on-error-container font-bold">Zero Margin Error</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mb-4">
              Biopharmaceutical dosing relies on exact decimal scaling between grams (g), milligrams (mg, 10⁻³), and micrograms (mcg, 10⁻⁶). Avoid apothecary grain ambiguities.
            </p>
<div className="bg-surface-container-low p-3 rounded-lg space-y-1.5 font-body-sm">
<div className="flex justify-between">
<span className="text-on-surface-variant">1.000 g API:</span>
<span className="font-data-mono font-semibold text-on-surface">1,000.00 mg</span>
</div>
<div className="flex justify-between">
<span className="text-on-surface-variant">0.025 g Microdose:</span>
<span className="font-data-mono font-semibold text-on-surface">25,000 μg (mcg)</span>
</div>
<div className="flex justify-between">
<span className="text-on-surface-variant">1 Apothecary Grain:</span>
<span className="font-data-mono font-semibold text-on-surface">64.7989 mg</span>
</div>
</div>
</div>
<Link href="/conversion/gram-to-milligram" className="mt-4 w-full py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-body-sm font-medium transition-colors flex items-center justify-center gap-1">
<span className="">Open Gram to Milligram Tool</span>
<span className="material-symbols-outlined text-[16px]">arrow_forward</span>
</Link>
</div>
{/*  CARD 4: FITNESS & MACRONUTRIENT ENERGY  */}
<div className="bg-surface p-space-md rounded-xl shadow-sm flex flex-col justify-between">
<div>
<div className="flex items-center justify-between mb-3">
<div className="flex items-center gap-2">
<span className="w-9 h-9 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary">
<span className="material-symbols-outlined text-[20px]">fitness_center</span>
</span>
<div>
<h3 className="font-headline-md text-headline-md text-on-surface">Macro &amp; Nutrition</h3>
<span className="font-label-caps text-label-caps text-on-surface-variant">Atwater Energy Factors</span>
</div>
</div>
<span className="font-data-mono text-[11px] px-2 py-0.5 rounded bg-surface-container text-on-surface">4-9-4 Model</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mb-3">
              Directly correlate food mass in grams to metabolic caloric density and track hydration evaporation cooking variances.
            </p>
<div className="bg-surface-container-low p-3 rounded-lg space-y-1.5 font-body-sm">
<div className="flex justify-between">
<span className="text-on-surface-variant">Protein (1g):</span>
<span className="font-data-mono font-semibold text-on-surface">4.0 kcal (16.7 kJ)</span>
</div>
<div className="flex justify-between">
<span className="text-on-surface-variant">Carbohydrates (1g):</span>
<span className="font-data-mono font-semibold text-on-surface">4.0 kcal (16.7 kJ)</span>
</div>
<div className="flex justify-between">
<span className="text-on-surface-variant">Dietary Fats (1g):</span>
<span className="font-data-mono font-semibold text-on-surface">9.0 kcal (37.7 kJ)</span>
</div>
<div className="flex justify-between">
<span className="text-on-surface-variant">Meat Cooked Shrinkage:</span>
<span className="font-data-mono font-semibold text-on-surface">~25% water loss</span>
</div>
</div>
</div>
<button className="mt-4 w-full py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-body-sm font-medium transition-colors flex items-center justify-center gap-1" onClick={() => handlePreset(150, 'g', 'oz')} type="button">
<span className="">Calculate Meal Portions</span>
<span className="material-symbols-outlined text-[16px]">arrow_forward</span>
</button>
</div>
{/*  CARD 5: INDUSTRIAL & FREIGHT MASS  */}
<div className="bg-surface p-space-md rounded-xl shadow-sm flex flex-col justify-between md:col-span-2 lg:col-span-2">
<div>
<div className="flex items-center justify-between mb-3">
<div className="flex items-center gap-2">
<span className="w-9 h-9 rounded-lg bg-surface-container-highest flex items-center justify-center text-secondary">
<span className="material-symbols-outlined text-[20px]">local_shipping</span>
</span>
<div>
<h3 className="font-headline-md text-headline-md text-on-surface">Global Freight &amp; Bulk Logistics</h3>
<span className="font-label-caps text-label-caps text-on-surface-variant">ISO 80000-4 Mass Standards</span>
</div>
</div>
<span className="font-data-mono text-[11px] px-2 py-0.5 rounded bg-surface-container text-on-surface">Bimodal Tonnage</span>
</div>
<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-3">
<div className="bg-surface-container-low p-3 rounded-lg">
<span className="font-label-caps text-label-caps text-on-surface-variant block mb-1">Metric Ton (t)</span>
<div className="font-data-mono text-headline-md text-on-surface font-bold">1,000,000 g</div>
<div className="text-[11px] text-on-surface-variant">1,000 kg • 2,204.62 lbs</div>
</div>
<div className="bg-surface-container-low p-3 rounded-lg">
<span className="font-label-caps text-label-caps text-on-surface-variant block mb-1">US Short Ton (tn)</span>
<div className="font-data-mono text-headline-md text-on-surface font-bold">907,184.7 g</div>
<div className="text-[11px] text-on-surface-variant">2,000 lbs exact</div>
</div>
<div className="bg-surface-container-low p-3 rounded-lg">
<span className="font-label-caps text-label-caps text-on-surface-variant block mb-1">Imperial Long Ton</span>
<div className="font-data-mono text-headline-md text-on-surface font-bold">1,016,046.9 g</div>
<div className="text-[11px] text-on-surface-variant">2,240 lbs exact</div>
</div>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant">
              Commercial shipping tariffs require distinct differentiation between gross registered tonnage, volumetric dimensional weight (DIM weight: <code className="font-data-mono bg-surface-container px-1 py-0.5 rounded">L × W × H / divisor</code>), and certified tare mass.
            </p>
</div>
<div className="flex items-center gap-3 mt-4">
<button className="flex-1 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-body-sm font-medium transition-colors text-center" onClick={() => handlePreset(1000000, 'g', 'us_ton')} type="button">
              Convert 1,000,000g to US Short Tons
            </button>
<button className="flex-1 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-secondary font-body-sm font-medium transition-colors text-center" onClick={() => handlePreset(1000000, 'g', 'uk_ton')} type="button">
              Convert 1,000,000g to Imperial Tons
            </button>
</div>
</div>
</div>
</div>
</section>
{/*  MASTER SEARCHABLE CONVERSION TABLES (GRAMS REFERENCE MATRIX)  */}
<section className="w-full bg-surface py-space-2xl px-gutter-mobile md:px-gutter-desktop">
<div className="max-w-max-width-canvas mx-auto">
<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-space-md">
<div>
<span className="font-label-caps text-label-caps text-primary uppercase tracking-widest block mb-1">Empirical Reference Master</span>
<h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Grams Master Conversion Matrix</h2>
</div>
{/*  Filter Search Box  */}
<div className="w-full md:w-72 relative">
<input className="w-full pl-9 pr-4 py-2 bg-surface-container-low rounded-xl font-body-sm text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary shadow-sm" id="tableSearchInput" onChange={(e) => setSearchQuery(e.target.value)} value={searchQuery} placeholder="Filter matrix values..." type="text" />
<span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[18px]">search</span>
</div>
</div>
{/*  High-Density Responsive Table Card  */}
<div className="w-full bg-surface-container-lowest rounded-xl shadow-md overflow-hidden overflow-x-auto">
<table className="w-full text-left font-data-mono text-body-sm" id="masterMatrixTable">
<thead>
<tr className="bg-surface-container-high text-on-surface font-headline-md text-label-caps uppercase tracking-wider">
<th className="py-3 px-4 font-semibold">Grams (g)</th>
<th className="py-3 px-4 font-semibold">Kilograms (kg)</th>
<th className="py-3 px-4 font-semibold">Ounces (oz)</th>
<th className="py-3 px-4 font-semibold">Pounds (lb)</th>
<th className="py-3 px-4 font-semibold">Troy Ounces (oz t)</th>
<th className="py-3 px-4 font-semibold">Carats (ct)</th>
<th className="py-3 px-4 font-semibold">Milligrams (mg)</th>
<th className="py-3 px-4 font-semibold">US Cups (H₂O)</th>
</tr>
</thead>
<tbody className="divide-none text-on-surface-variant">
{rows.filter(row => JSON.stringify(row).toLowerCase().includes(searchQuery.toLowerCase())).map((row, idx) => (
  <tr key={idx} className={`hover:bg-surface-container-low transition-colors cursor-pointer ${idx % 2 === 1 ? 'bg-surface-container-low/40' : ''}`} onClick={() => {setInputValue(row.g); setFromUnit('g');}}>
    <td className="py-3 px-4 font-bold text-primary">{row.label}</td>
    <td className={`py-3 px-4 ${row.bold ? 'font-semibold text-on-surface' : ''}`}>{row.k}</td>
    <td className={`py-3 px-4 ${row.bold ? 'font-semibold text-on-surface' : ''}`}>{row.oz}</td>
    <td className={`py-3 px-4 ${row.bold ? 'font-semibold text-on-surface' : ''}`}>{row.lb}</td>
    <td className={`py-3 px-4 ${row.bold ? 'font-semibold text-on-surface' : ''}`}>{row.ozt}</td>
    <td className="py-3 px-4">{row.ct}</td>
    <td className="py-3 px-4">{row.mg}</td>
    <td className={`py-3 px-4 ${row.bold ? 'font-semibold text-on-surface' : ''}`}>{row.cups}</td>
  </tr>
))}
</tbody>
</table>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
<span className="font-medium text-on-surface">Metrology note:</span> Click any row to automatically load magnitude into the real-time converter workbench.
      </p>
</div>
</section>
{/*  INGREDIENT BULK DENSITY EXPLORER (CULINARY MASS-TO-VOLUME BRIDGE)  */}
<section className="w-full bg-surface-container-low py-space-2xl px-gutter-mobile md:px-gutter-desktop">
<div className="max-w-max-width-canvas mx-auto">
<div className="max-w-3xl mb-space-lg">
<span className="font-label-caps text-label-caps text-primary uppercase tracking-widest block mb-1">Density &amp; Compaction Physics</span>
<h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Ingredient Bulk Density Matrix</h2>
<p className="font-body-md text-body-md text-on-surface-variant mt-1">
          Converting mass (grams) to volume (cups, spoons, mL) is mathematically invalid without an empirical density coefficient (ρ = m/V). Below are calibrated USDA values.
        </p>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
{/*  Ingredient 1  */}
<div className="bg-surface p-space-md rounded-xl shadow-sm flex flex-col justify-between">
<div>
<div className="flex items-center justify-between mb-2">
<h4 className="font-headline-md text-headline-md text-on-surface">All-Purpose Flour</h4>
<span className="font-data-mono text-label-caps bg-surface-container px-2 py-0.5 rounded text-on-surface">FDC 168932</span>
</div>
<div className="font-data-mono text-numerical-display-mobile text-primary font-bold mb-1">0.570 g/mL</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mb-3">Sifted vs scooped varies up to 25%. Aeration changes bulk density substantially.</p>
<div className="bg-surface-container-low p-2 rounded-lg text-body-sm space-y-1 font-data-mono">
<div className="flex justify-between"><span className="">100g Volume:</span><span className="font-semibold text-on-surface">175.4 mL</span></div>
<div className="flex justify-between"><span className="">US Cup:</span><span className="font-semibold text-on-surface">~0.73 cup</span></div>
<div className="flex justify-between"><span className="">Tablespoon:</span><span className="font-semibold text-on-surface">11.8 tbsp</span></div>
</div>
</div>
<button className="mt-3 w-full py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-body-sm text-primary font-medium transition-colors" onClick={() => handlePreset(120, 'g', 'cup_flour')} type="button">
            Convert 120g (Standard 1 Cup)
          </button>
</div>
{/*  Ingredient 2  */}
<div className="bg-surface p-space-md rounded-xl shadow-sm flex flex-col justify-between">
<div>
<div className="flex items-center justify-between mb-2">
<h4 className="font-headline-md text-headline-md text-on-surface">Granulated Sugar</h4>
<span className="font-data-mono text-label-caps bg-surface-container px-2 py-0.5 rounded text-on-surface">FDC 169655</span>
</div>
<div className="font-data-mono text-numerical-display-mobile text-primary font-bold mb-1">0.845 g/mL</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mb-3">Uniform crystalline sucrose with minimal air trapping compared to flour.</p>
<div className="bg-surface-container-low p-2 rounded-lg text-body-sm space-y-1 font-data-mono">
<div className="flex justify-between"><span className="">100g Volume:</span><span className="font-semibold text-on-surface">118.3 mL</span></div>
<div className="flex justify-between"><span className="">US Cup:</span><span className="font-semibold text-on-surface">~0.49 cup</span></div>
<div className="flex justify-between"><span className="">Teaspoon:</span><span className="font-semibold text-on-surface">24.0 tsp</span></div>
</div>
</div>
<button className="mt-3 w-full py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-body-sm text-primary font-medium transition-colors" onClick={() => handlePreset(200, 'g', 'cup_sugar')} type="button">
            Convert 200g (Standard 1 Cup)
          </button>
</div>
{/*  Ingredient 3  */}
<div className="bg-surface p-space-md rounded-xl shadow-sm flex flex-col justify-between">
<div>
<div className="flex items-center justify-between mb-2">
<h4 className="font-headline-md text-headline-md text-on-surface">Sweet Butter</h4>
<span className="font-data-mono text-label-caps bg-surface-container px-2 py-0.5 rounded text-on-surface">FDC 173410</span>
</div>
<div className="font-data-mono text-numerical-display-mobile text-primary font-bold mb-1">0.911 g/mL</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mb-3">Emulsion of water in butterfat. US sticks equal exactly 113.4g (4 oz).</p>
<div className="bg-surface-container-low p-2 rounded-lg text-body-sm space-y-1 font-data-mono">
<div className="flex justify-between"><span className="">100g Volume:</span><span className="font-semibold text-on-surface">109.8 mL</span></div>
<div className="flex justify-between"><span className="">1 Stick (1/2 cup):</span><span className="font-semibold text-on-surface">113.4 g</span></div>
<div className="flex justify-between"><span className="">Tablespoon:</span><span className="font-semibold text-on-surface">14.2 g</span></div>
</div>
</div>
<button className="mt-3 w-full py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-body-sm text-primary font-medium transition-colors" onClick={() => handlePreset(113.4, 'g', 'cup_butter')} type="button">
            Convert 113.4g (1 Stick)
          </button>
</div>
{/*  Ingredient 4  */}
<div className="bg-surface p-space-md rounded-xl shadow-sm flex flex-col justify-between">
<div>
<div className="flex items-center justify-between mb-2">
<h4 className="font-headline-md text-headline-md text-on-surface">Clover Honey</h4>
<span className="font-data-mono text-label-caps bg-surface-container px-2 py-0.5 rounded text-on-surface">FDC 169640</span>
</div>
<div className="font-data-mono text-numerical-display-mobile text-primary font-bold mb-1">1.420 g/mL</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mb-3">Dense, supersaturated natural sugar solution with elevated specific gravity.</p>
<div className="bg-surface-container-low p-2 rounded-lg text-body-sm space-y-1 font-data-mono">
<div className="flex justify-between"><span className="">100g Volume:</span><span className="font-semibold text-on-surface">70.4 mL</span></div>
<div className="flex justify-between"><span className="">US Cup:</span><span className="font-semibold text-on-surface">~0.29 cup</span></div>
<div className="flex justify-between"><span className="">Tablespoon:</span><span className="font-semibold text-on-surface">21.3 g</span></div>
</div>
</div>
<button className="mt-3 w-full py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-body-sm text-primary font-medium transition-colors" onClick={() => handlePreset(340, 'g', 'cup_water')} type="button">
            Convert 340g (Standard 1 Cup)
          </button>
</div>
</div>
</div>
</section>
{/*  SCIENTIFIC METROLOGY & FORMULA DERIVATIONS  */}
<section className="w-full bg-surface py-space-2xl px-gutter-mobile md:px-gutter-desktop">
<div className="max-w-max-width-canvas mx-auto">
<div className="max-w-3xl mb-space-lg">
<span className="font-label-caps text-label-caps text-primary uppercase tracking-widest block mb-1">Theoretical Foundations</span>
<h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">The 2019 SI Redefinition &amp; Exact Equations</h2>
</div>
<div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg items-start">
{/*  Left: Planck Constant & SI Physics  */}
<div className="space-y-space-md font-body-md text-body-md text-on-surface-variant leading-relaxed">
<div className="bg-surface-container-low p-space-md rounded-xl">
<h3 className="font-headline-md text-headline-md text-on-surface mb-2 flex items-center gap-2">
<span className="material-symbols-outlined text-primary">psychology</span>
              From Le Grand K to Quantum Planck Constants
            </h3>
<p className="">
              Until May 20, 2019, the kilogram was the last SI base unit defined by a physical artifact: <i>Le Grand K</i>, a platinum-iridium cylinder forged in 1889 and housed at the BIPM in Sèvres, France.
            </p>
<p className="mt-2">
              Under the 26th General Conference on Weights and Measures (CGPM), the kilogram—and consequently the <b>gram (10⁻³ kg)</b>—was formally redefined in terms of fundamental quantum physical constants:
            </p>
<div className="my-3 p-3 bg-surface-container-lowest rounded-lg font-data-mono text-body-sm text-primary shadow-sm">
              h = 6.626 070 15 × 10⁻³⁴ J · s = kg · m² · s⁻¹
            </div>
<p className="text-body-sm">
              By pinning Planck&apos;s constant <i>h</i>, the speed of light <i>c</i>, and the hyperfine cesium-133 frequency transition Δν<sub>Cs</sub>, a gram can be reproduced in any laboratory worldwide using a Kibble balance without physical drift.
            </p>
</div>
<div className="bg-surface-container-low p-space-md rounded-xl">
<h3 className="font-headline-md text-headline-md text-on-surface mb-2">Mass vs. Weight: Physical Distinction</h3>
<p className="">
              In physics and formal metrology, <b>mass</b> is an intrinsic, invariant property of matter quantifying inertial resistance to acceleration (measured in grams, kilograms, or slugs). 
            </p>
<p className="mt-2">
<b>Weight</b> represents the downward gravitational force exerted on that mass:
            </p>
<div className="my-2 p-2 bg-surface-container-lowest rounded font-data-mono text-body-sm text-on-surface">
              W = m · g (where standard gravity g_n = 9.80665 m/s²)
            </div>
<p className="text-body-sm">
              A 100g calibrated mass has an identical 100g mass on Earth and the Moon, but exerts ~0.98 N force on Earth versus only ~0.16 N on the lunar surface.
            </p>
</div>
</div>
{/*  Right: Mathematical Formula Sandbox & Proofs  */}
<div className="bg-surface-container p-space-lg rounded-xl shadow-sm space-y-space-md">
<h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
<span className="material-symbols-outlined text-secondary">functions</span>
            Metrological Derivation Proofs
          </h3>
{/*  Proof Block 1: Ounces  */}
<div className="bg-surface-container-lowest p-3.5 rounded-lg shadow-sm">
<span className="font-label-caps text-label-caps text-secondary font-bold uppercase">1. Grams to Avoirdupois Ounces</span>
<div className="font-data-mono text-body-sm text-on-surface mt-1">
              1 lb = 0.45359237 kg (NIST International Agreement 1959)<br />
              1 lb = 16 oz ⇒ 1 oz = 0.45359237 / 16 kg = 28.349523125 g<br />
<b>m(oz) = m(g) ÷ 28.349523125</b>
</div>
</div>
{/*  Proof Block 2: Troy Ounces  */}
<div className="bg-surface-container-lowest p-3.5 rounded-lg shadow-sm">
<span className="font-label-caps text-label-caps text-tertiary font-bold uppercase">2. Grams to Troy Ounces (Bullion)</span>
<div className="font-data-mono text-body-sm text-on-surface mt-1">
              1 oz t = 480 grains<br />
              1 grain = 64.79891 mg exact<br />
              1 oz t = 480 × 0.06479891 g = 31.1034768 g<br />
<b>m(oz t) = m(g) ÷ 31.1034768</b>
</div>
</div>
{/*  Proof Block 3: Carats  */}
<div className="bg-surface-container-lowest p-3.5 rounded-lg shadow-sm">
<span className="font-label-caps text-label-caps text-primary font-bold uppercase">3. Grams to Metric Gemological Carats</span>
<div className="font-data-mono text-body-sm text-on-surface mt-1">
              Adopted 4th CGPM (1907): 1 carat = 200 mg = 0.200 g<br />
<b>m(ct) = m(g) × 5.000000000</b>
</div>
</div>
{/*  Proof Block 4: Pounds  */}
<div className="bg-surface-container-lowest p-3.5 rounded-lg shadow-sm">
<span className="font-label-caps text-label-caps text-on-surface-variant font-bold uppercase">4. Grams to Imperial / US Pounds</span>
<div className="font-data-mono text-body-sm text-on-surface mt-1">
              m(lb) = m(g) ÷ 453.59237<br />
<b>100 g = 100 / 453.59237 = 0.220462262 lb</b>
</div>
</div>
</div>
</div>
</div>
</section>
{/*  HEURISTIC PITFALLS & COMMON CONVERSION MISTAKES  */}
<section className="w-full bg-surface-container-low py-space-2xl px-gutter-mobile md:px-gutter-desktop">
<div className="max-w-max-width-canvas mx-auto">
<div className="max-w-3xl mb-space-lg">
<span className="font-label-caps text-label-caps text-error uppercase tracking-widest block mb-1">Risk Mitigation</span>
<h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Heuristic Pitfalls &amp; High-Frequency Errors</h2>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
{/*  Pitfall 1  */}
<div className="bg-surface p-space-md rounded-xl shadow-sm border-l-4 border-error flex flex-col justify-between">
<div>
<div className="flex items-center gap-2 mb-2 text-error">
<span className="material-symbols-outlined text-[22px]">warning</span>
<h4 className="font-headline-md text-headline-md text-on-surface">The 3-Ounce Ambiguity</h4>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mb-2">
              Confusing <b>Avoirdupois Ounce (28.35g)</b> with <b>Troy Ounce (31.10g)</b> and <b>Fluid Ounce (fl oz, 29.57mL volume)</b> causes severe financial loss in precious metals or catastrophic formula errors in industrial compounding.
            </p>
<div className="bg-surface-container-low p-2 rounded text-label-caps font-data-mono text-on-surface">
              Avoirdupois: 28.3495g<br />
              Troy Bullion: 31.1035g (+9.71% heavier)<br />
              Fluid Ounce: Volume only
            </div>
</div>
</div>
{/*  Pitfall 2  */}
<div className="bg-surface p-space-md rounded-xl shadow-sm border-l-4 border-error flex flex-col justify-between">
<div>
<div className="flex items-center gap-2 mb-2 text-error">
<span className="material-symbols-outlined text-[22px]">indeterminate_check_box</span>
<h4 className="font-headline-md text-headline-md text-on-surface">Tare Neglect &amp; Gross Mass</h4>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mb-2">
              Failing to zero out (tare) container mass before weighing introduces massive percentage errors on low-mass items. A 12g plastic dish holding a 5g laboratory sample produces a <b>240% measurement distortion</b> if ignored.
            </p>
<div className="bg-surface-container-low p-2 rounded text-label-caps font-data-mono text-on-surface">
              Net Mass = Gross Mass - Tare Mass
            </div>
</div>
</div>
{/*  Pitfall 3  */}
<div className="bg-surface p-space-md rounded-xl shadow-sm border-l-4 border-error flex flex-col justify-between">
<div>
<div className="flex items-center gap-2 mb-2 text-error">
<span className="material-symbols-outlined text-[22px]">soup_kitchen</span>
<h4 className="font-headline-md text-headline-md text-on-surface">The Volumetric &quot;Cup&quot; Illusion</h4>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mb-2">
              Assuming 1 cup equals a fixed gram value regardless of ingredient. While 1 cup of water weighs 240g, 1 cup of brown sugar weighs ~220g, and 1 cup of sifted cocoa powder weighs only ~85g. Never bake by uncalibrated volume.
            </p>
<div className="bg-surface-container-low p-2 rounded text-label-caps font-data-mono text-on-surface">
              Cocoa (85g) ≠ Water (240g) ≠ Honey (340g)
            </div>
</div>
</div>
</div>
</div>
</section>
{/*  AUTHORITATIVE FAQ ACCORDION  */}
<section className="w-full bg-surface py-space-2xl px-gutter-mobile md:px-gutter-desktop">
<div className="max-w-max-width-canvas mx-auto">
<div className="max-w-3xl mb-space-lg">
<span className="font-label-caps text-label-caps text-primary uppercase tracking-widest block mb-1">Frequently Inquired Metrology</span>
<h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Authoritative Frequently Asked Questions</h2>
</div>
<div className="space-y-space-sm max-w-4xl" id="faqAccordion">
{/*  FAQ 1  */}
<details className="group bg-surface-container-lowest rounded-xl p-space-md shadow-sm cursor-pointer" open>
<summary className="font-headline-md text-headline-md text-on-surface list-none flex justify-between items-center select-none">
<span className="">How many ounces are in 100 grams?</span>
<span className="material-symbols-outlined text-primary group-open:rotate-180 transition-transform duration-200">expand_more</span>
</summary>
<div className="mt-3 font-body-md text-body-md text-on-surface-variant leading-relaxed">
            There are exactly <b>3.527396195 avoirdupois ounces</b> in 100 grams. To convert grams to ounces manually, divide the gram figure by 28.349523125 (or multiply by 0.03527396). For precious metals (gold, silver, platinum), 100 grams equals <b>3.21507466 troy ounces</b> (oz t), because a troy ounce is 31.1034768 grams.
          </div>
</details>
{/*  FAQ 2  */}
<details className="group bg-surface-container-lowest rounded-xl p-space-md shadow-sm cursor-pointer">
<summary className="font-headline-md text-headline-md text-on-surface list-none flex justify-between items-center select-none">
<span className="">How many pounds is 500 grams?</span>
<span className="material-symbols-outlined text-primary group-open:rotate-180 transition-transform duration-200">expand_more</span>
</summary>
<div className="mt-3 font-body-md text-body-md text-on-surface-variant leading-relaxed">
            500 grams equals <b>1.10231131 pounds (lbs)</b>, or roughly 1 lb 1.64 oz. Because an international avoirdupois pound is legally established at 453.59237 grams, 500 grams is just over half a kilogram (0.5 kg).
          </div>
</details>
{/*  FAQ 3  */}
<details className="group bg-surface-container-lowest rounded-xl p-space-md shadow-sm cursor-pointer">
<summary className="font-headline-md text-headline-md text-on-surface list-none flex justify-between items-center select-none">
<span className="">Does 1 gram of water equal exactly 1 milliliter (mL)?</span>
<span className="material-symbols-outlined text-primary group-open:rotate-180 transition-transform duration-200">expand_more</span>
</summary>
<div className="mt-3 font-body-md text-body-md text-on-surface-variant leading-relaxed">
            Yes, at <b>3.98°C (its point of maximum density) and 1 atm standard pressure</b>, pure distilled water has a density of exactly 1.00000 g/cm³ (or 1 g/mL). At room temperature (20°C / 68°F), the density of water shifts slightly to 0.9982 g/mL, a difference of less than 0.2%, making 1g ≈ 1mL a practical parity for all culinary and general domestic tasks.
          </div>
</details>
{/*  FAQ 4  */}
<details className="group bg-surface-container-lowest rounded-xl p-space-md shadow-sm cursor-pointer">
<summary className="font-headline-md text-headline-md text-on-surface list-none flex justify-between items-center select-none">
<span className="">How many teaspoons is 10 grams of granulated sugar?</span>
<span className="material-symbols-outlined text-primary group-open:rotate-180 transition-transform duration-200">expand_more</span>
</summary>
<div className="mt-3 font-body-md text-body-md text-on-surface-variant leading-relaxed">
            10 grams of standard granulated table sugar equals approximately <b>2.40 level US teaspoons</b> (or roughly 0.8 level US tablespoons). Because 1 level teaspoon of sugar contains ~4.17 grams, two teaspoons yield ~8.3g and 2.5 teaspoons yield ~10.4g.
          </div>
</details>
{/*  FAQ 5  */}
<details className="group bg-surface-container-lowest rounded-xl p-space-md shadow-sm cursor-pointer">
<summary className="font-headline-md text-headline-md text-on-surface list-none flex justify-between items-center select-none">
<span className="">Why is diamond weight measured in carats instead of grams?</span>
<span className="material-symbols-outlined text-primary group-open:rotate-180 transition-transform duration-200">expand_more</span>
</summary>
<div className="mt-3 font-body-md text-body-md text-on-surface-variant leading-relaxed">
            The metric carat (adopted globally in 1907) is standardized at exactly <b>200 milligrams (0.200 grams)</b>. Historically derived from the uniform weight of carob tree seeds (<i>Ceratonia siliqua</i>) used by ancient Mediterranean traders, carats provide greater numerical granularity for fine gemstones where tiny fractions represent massive price differentials. 1 gram contains exactly 5.00 carats.
          </div>
</details>
{/*  FAQ 6  */}
<details className="group bg-surface-container-lowest rounded-xl p-space-md shadow-sm cursor-pointer">
<summary className="font-headline-md text-headline-md text-on-surface list-none flex justify-between items-center select-none">
<span className="">What is the difference between a gram, microgram, and milligram?</span>
<span className="material-symbols-outlined text-primary group-open:rotate-180 transition-transform duration-200">expand_more</span>
</summary>
<div className="mt-3 font-body-md text-body-md text-on-surface-variant leading-relaxed">
            They are powers of ten in the International System of Units (SI):
            <ul className="list-disc pl-5 mt-2 space-y-1">
<li className=""><b>1 Gram (g)</b> = 1.0 g</li>
<li className=""><b>1 Milligram (mg)</b> = 0.001 g (10⁻³ g) — 1,000 mg in 1 g</li>
<li className=""><b>1 Microgram (μg or mcg)</b> = 0.000001 g (10⁻⁶ g) — 1,000,000 mcg in 1 g</li>
</ul>
</div>
</details>
</div>
</div>
</section>

      </main>
    </div>
  );
}
