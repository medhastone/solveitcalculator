'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';

interface Substance {
  id: string;
  name: string;
  density: number;
  label: string;
  badge: string;
}

const SUBSTANCES: Substance[] = [
  { id: 'water', name: 'Pure Water', density: 1.000, label: 'Water (Pure)', badge: '1.000 g/mL' },
  { id: 'milk', name: 'Whole Milk', density: 1.030, label: 'Whole Milk', badge: '1.030 g/mL' },
  { id: 'oil', name: 'Cooking Oil', density: 0.920, label: 'Cooking Oil', badge: '0.920 g/mL' },
  { id: 'honey', name: 'Pure Honey', density: 1.420, label: 'Pure Honey', badge: '1.420 g/mL' },
  { id: 'flour', name: 'All-Purpose Flour', density: 0.528, label: 'AP Flour (Bulk)', badge: '0.528 g/mL' },
  { id: 'sugar', name: 'Granulated Sugar', density: 0.845, label: 'Granulated Sugar', badge: '0.845 g/mL' },
  { id: 'butter', name: 'Butter', density: 0.911, label: 'Butter (Melted)', badge: '0.911 g/mL' },
  { id: 'gasoline', name: 'Gasoline Fuel', density: 0.745, label: 'Gasoline / Fuel', badge: '0.745 g/mL' },
  { id: 'ethanol', name: 'Ethanol Alcohol', density: 0.789, label: 'Ethanol / Alcohol', badge: '0.789 g/mL' },
];

const PRESETS = [0.1, 0.25, 0.5, 0.75, 1, 1.5, 2, 2.5, 5, 10];

export default function LiterToGramClient() {
  const [literInput, setLiterInput] = useState<string>('1');
  const [currentDensity, setCurrentDensity] = useState<number>(1.000);
  const [currentSubstanceName, setCurrentSubstanceName] = useState<string>('Pure Water');
  const [currentDecimals, setCurrentDecimals] = useState<number>(2);
  const [customDensityValue, setCustomDensityValue] = useState<string>('');
  const [isCustomOpen, setIsCustomOpen] = useState<boolean>(false);
  const [copyStatus, setCopyStatus] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const liters = parseFloat(literInput) || 0;
  const safeLiters = liters < 0 ? 0 : liters;
  // Grams = Liters * Density * 1000
  const grams = safeLiters > 0 && currentDensity > 0 ? safeLiters * currentDensity * 1000 : 0;

  const formattedGrams = grams.toLocaleString('en-US', {
    minimumFractionDigits: currentDecimals,
    maximumFractionDigits: currentDecimals,
  });

  const kg = grams / 1000;
  const oz = grams / 28.349523125;
  const lb = grams / 453.59237;
  const ml = safeLiters * 1000;

  const handleSelectSubstance = (sub: Substance) => {
    setCurrentDensity(sub.density);
    setCurrentSubstanceName(sub.name);
  };

  const handleApplyCustomDensity = () => {
    const val = parseFloat(customDensityValue);
    if (!isNaN(val) && val > 0) {
      setCurrentDensity(val);
      setCurrentSubstanceName(`Custom (ρ ${val.toFixed(3)})`);
    }
  };

  const handleCopy = () => {
    const textToCopy = `${literInput} L of ${currentSubstanceName} = ${formattedGrams} g (SolveIt Calculator)`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopyStatus(true);
      setTimeout(() => setCopyStatus(false), 2000);
    });
  };

  const handleReset = () => {
    setLiterInput('1');
    setCurrentDensity(1.000);
    setCurrentSubstanceName('Pure Water');
    setCurrentDecimals(2);
    setCustomDensityValue('');
    setIsCustomOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-body-md text-on-surface antialiased">
      

      <main className="w-full pt-16 bg-background min-h-screen flex-1">
        <section className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm pb-space-lg">
            <nav aria-label="Breadcrumb" className="flex items-center gap-space-xs text-body-sm font-body-sm text-on-surface-variant flex-wrap">
              <Link className="hover:text-primary transition-colors flex items-center gap-1" href="/">
                <span className="material-symbols-outlined text-[16px]">home</span>
                <span>Home</span>
              </Link>
              <span className="text-outline/40 select-none">/</span>
              <Link className="hover:text-primary transition-colors" href="/conversion">
                Conversion
              </Link>
              <span className="text-outline/40 select-none">/</span>
              <Link className="hover:text-primary transition-colors" href="/volume-converter">
                Volume
              </Link>
              <span className="text-outline/40 select-none">/</span>
              <span className="hover:text-primary transition-colors cursor-pointer">
                Liter
              </span>
              <span className="text-outline/40 select-none">/</span>
              <span className="text-primary font-semibold" aria-current="page">Liter to Gram</span>
            </nav>
            <div className="flex items-center gap-space-xs flex-wrap">
              <span className="px-space-sm py-space-2xs rounded-full bg-surface-container-high text-secondary text-label-caps font-label-caps uppercase flex items-center gap-space-2xs">
                <span className="material-symbols-outlined text-[14px]">format_image_left</span>
                100% Client-Side Private
              </span>
              <span className="px-space-sm py-space-2xs rounded-full bg-surface-container-low text-on-surface-variant text-label-caps font-label-caps uppercase hidden sm:flex items-center gap-space-2xs">
                <span className="material-symbols-outlined text-[14px]">science</span>
                NIST SP 811 Standard
              </span>
            </div>
          </div>

          <div className="max-w-4xl space-y-space-xs">
            <div className="flex items-center gap-space-xs text-primary">
              <span className="material-symbols-outlined text-[20px]">swap_horizontal_circle</span>
              <span className="text-label-caps font-label-caps uppercase tracking-widest font-semibold">Metrology Precision Engine</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
              Liter to Gram Converter <span className="text-primary font-normal">(L to g)</span>
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              Use this free Liter to Gram converter to convert volume in liters (L) into weight in grams (g) based on the density of the target substance.
            </p>
          </div>

          <div className="mt-space-lg p-space-md lg:p-space-lg rounded-xl bg-surface-container-low shadow-sm flex flex-col sm:flex-row items-start gap-space-md">
            <div className="w-10 h-10 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px]">info</span>
            </div>
            <div className="space-y-space-2xs">
              <span className="font-headline-md text-body-md font-bold text-on-surface flex items-center gap-space-xs">
                Mass vs Volume Conversion Equation
              </span>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Mass (g) = Liters (L) &times; Density (g/mL) &times; 1,000. For water where &rho; = 1.000 g/mL, exactly 1 Liter equals 1,000 grams.
              </p>
            </div>
          </div>
        </section>

        {/* Interactive Converter Workbench */}
        <section className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop pb-space-3xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
            <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl p-space-lg shadow-md space-y-space-lg">
              {/* Substance Matrix Pills */}
              <div className="space-y-space-xs">
                <div className="flex items-center justify-between">
                  <label className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider font-semibold">
                    Step 1: Select Substance &amp; Density (ρ)
                  </label>
                  <span className="font-data-mono text-body-sm text-secondary bg-surface-container-high px-space-xs py-space-2xs rounded">
                    ρ = {currentDensity.toFixed(3)} g/mL
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-space-2xs pt-space-2xs">
                  {SUBSTANCES.map((sub) => {
                    const isActive = currentSubstanceName === sub.name;
                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => handleSelectSubstance(sub)}
                        className={`text-left px-space-sm py-space-xs rounded-lg font-medium text-body-sm transition-all flex flex-col cursor-pointer ${
                          isActive
                            ? 'bg-primary-container text-on-primary-container shadow-sm font-semibold'
                            : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                        }`}
                      >
                        <span className="font-semibold">{sub.label}</span>
                        <span className={`text-label-caps font-data-mono ${isActive ? 'opacity-90' : 'text-on-surface-variant'}`}>
                          {sub.badge}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-space-xs">
                  <details
                    className="group rounded-lg bg-surface-container-low p-space-xs"
                    open={isCustomOpen}
                    onToggle={(e) => setIsCustomOpen((e.target as HTMLDetailsElement).open)}
                  >
                    <summary className="cursor-pointer text-body-sm font-body-sm text-secondary flex items-center justify-between font-medium select-none">
                      <span className="flex items-center gap-space-2xs">
                        <span className="material-symbols-outlined text-[18px]">tune</span>
                        Input Custom Density Value
                      </span>
                      <span className="material-symbols-outlined text-[18px] group-open:rotate-180 transition-transform">
                        expand_more
                      </span>
                    </summary>
                    <div className="pt-space-xs flex items-center gap-space-sm">
                      <div className="relative flex-1">
                        <input
                          type="number"
                          step="0.001"
                          min="0.001"
                          max="25.000"
                          placeholder="e.g. 1.250"
                          value={customDensityValue}
                          onChange={(e) => setCustomDensityValue(e.target.value)}
                          className="w-full bg-surface-container-lowest px-space-sm py-space-xs rounded-lg text-body-md font-data-mono text-on-surface focus:outline-none focus:bg-surface-container-high"
                        />
                        <span className="absolute right-3 top-2.5 font-label-caps text-label-caps text-on-surface-variant pointer-events-none">
                          g/mL
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleApplyCustomDensity}
                        className="px-space-md py-space-xs bg-secondary text-on-secondary rounded-lg font-body-sm text-body-sm font-semibold hover:opacity-95 transition-opacity cursor-pointer"
                      >
                        Apply Custom
                      </button>
                    </div>
                  </details>
                </div>
              </div>

              {/* Volume Input */}
              <div className="space-y-space-xs">
                <div className="flex items-center justify-between">
                  <label htmlFor="liter-input-field" className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider font-semibold">
                    Step 2: Volume in Liters (L)
                  </label>
                  <div className="flex items-center gap-space-2xs bg-surface-container-low p-1 rounded-lg">
                    {[0, 2, 4].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setCurrentDecimals(d)}
                        className={`px-space-xs py-space-2xs rounded font-data-mono text-body-sm transition-colors cursor-pointer ${
                          currentDecimals === d
                            ? 'bg-surface-container-lowest text-primary shadow-xs font-semibold'
                            : 'text-on-surface-variant hover:text-on-surface font-medium'
                        }`}
                      >
                        {d === 0 ? 'Integer' : d === 2 ? '.00' : '.0000'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <input
                    ref={inputRef}
                    id="liter-input-field"
                    type="number"
                    step="any"
                    min="0"
                    value={literInput}
                    onChange={(e) => setLiterInput(e.target.value)}
                    className="w-full bg-surface-container-low px-space-md py-space-md rounded-xl font-numerical-display text-numerical-display text-on-surface focus:outline-none focus:bg-surface-container transition-colors tracking-tight font-bold"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-headline-md text-headline-md text-on-surface-variant font-medium pointer-events-none">
                    liters (L)
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-space-2xs pt-space-2xs">
                  <span className="text-label-caps font-label-caps text-on-surface-variant uppercase mr-space-2xs">
                    Presets:
                  </span>
                  {PRESETS.map((p) => {
                    const isSelected = parseFloat(literInput) === p;
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setLiterInput(p.toString())}
                        className={`px-space-xs py-space-2xs rounded-md text-body-sm font-data-mono transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-primary-container text-on-primary-container font-bold'
                            : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                        }`}
                      >
                        {p}L
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Calculated Output Card */}
              <div className="rounded-xl bg-surface-container p-space-md sm:p-space-lg space-y-space-xs shadow-inner">
                <div className="flex items-center justify-between text-on-surface-variant">
                  <span className="font-label-caps text-label-caps uppercase tracking-wider font-semibold">
                    Calculated Physical Mass
                  </span>
                  <span className="flex items-center gap-space-2xs text-label-caps font-label-caps text-secondary font-medium">
                    <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse"></span>
                    Deterministic Local Sandbox
                  </span>
                </div>
                <div className="flex items-baseline gap-space-xs flex-wrap">
                  <span className="font-numerical-display text-numerical-display text-primary font-bold tracking-tight">
                    {formattedGrams}
                  </span>
                  <span className="font-headline-lg text-headline-lg text-on-surface font-semibold">
                    Grams (g)
                  </span>
                </div>
                <div className="pt-space-2xs flex items-center justify-between flex-wrap gap-space-2xs">
                  <p className="font-data-mono text-body-sm text-on-surface-variant">
                    {safeLiters}&nbsp;L &times; ({currentDensity.toFixed(3)}&nbsp;g/mL &times; 1,000) = <strong className="text-on-surface">{formattedGrams}&nbsp;g</strong>
                  </p>
                  <span className="font-data-mono text-label-caps bg-surface-container-highest px-space-xs py-1 rounded text-on-surface font-medium">
                    {currentSubstanceName}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-space-xs pt-space-2xs">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex-1 min-w-[140px] px-space-md py-space-xs rounded-lg bg-primary text-on-primary font-body-sm font-semibold hover:opacity-95 transition-all flex items-center justify-center gap-space-2xs shadow-sm active:scale-98 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {copyStatus ? 'check' : 'content_copy'}
                  </span>
                  <span>{copyStatus ? 'Copied!' : 'Copy Result'}</span>
                </button>
                <Link
                  href="/conversion/gram-to-liter"
                  className="px-space-md py-space-xs rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-container-highest transition-colors font-body-sm font-medium flex items-center gap-space-2xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">swap_vert</span>
                  Swap (g to L)
                </Link>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-space-md py-space-xs rounded-lg bg-surface-container-low text-on-surface-variant hover:text-on-surface transition-colors font-body-sm font-medium flex items-center gap-space-2xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">restart_alt</span>
                  Reset
                </button>
              </div>

              {/* Multi-unit equivalents */}
              <div className="space-y-space-xs pt-space-xs">
                <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider font-semibold block">
                  Secondary Mass Equivalents
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-xs">
                  <div className="p-space-xs rounded-lg bg-surface-container-low">
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase block">Kilograms</span>
                    <span className="font-data-mono text-body-md font-bold text-on-surface">
                      {kg.toFixed(4)} kg
                    </span>
                  </div>
                  <div className="p-space-xs rounded-lg bg-surface-container-low">
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase block">Pounds (lb)</span>
                    <span className="font-data-mono text-body-md font-bold text-on-surface">
                      {lb.toFixed(3)} lb
                    </span>
                  </div>
                  <div className="p-space-xs rounded-lg bg-surface-container-low">
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase block">Ounces (oz)</span>
                    <span className="font-data-mono text-body-md font-bold text-on-surface">
                      {oz.toFixed(2)} oz
                    </span>
                  </div>
                  <div className="p-space-xs rounded-lg bg-surface-container-low">
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase block">Milliliters</span>
                    <span className="font-data-mono text-body-md font-bold text-on-surface">
                      {ml.toLocaleString('en-US')} mL
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-space-lg">
              <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-md space-y-space-sm">
                <h3 className="font-headline-md text-headline-md font-bold text-on-surface flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-[22px]">functions</span>
                  Liter to Gram Formula
                </h3>
                <div className="p-space-md rounded-lg bg-surface-container font-data-mono text-body-lg text-primary font-bold text-center">
                  Grams (g) = Liters (L) &times; Density (g/mL) &times; 1000
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  Because 1 Liter contains 1,000 mL, multiplying the volume in liters by 1,000 gives volume in milliliters. Multiplying volume in mL by density in g/mL yields net mass in grams.
                </p>
              </div>

              <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-md space-y-space-sm">
                <h3 className="font-headline-md text-headline-md font-bold text-on-surface flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-[22px]">link</span>
                  Direct Inverse Navigation
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Need to calculate volume from weight instead? Visit our dedicated Gram to Liter converter workbench.
                </p>
                <Link
                  href="/conversion/gram-to-liter"
                  className="inline-flex items-center gap-space-2xs px-space-md py-space-xs rounded-lg bg-primary text-on-primary font-body-sm font-semibold hover:opacity-95 transition-opacity"
                >
                  Go to Gram to Liter (g to L)
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
