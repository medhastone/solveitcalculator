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

const PRESETS = [10, 50, 100, 250, 500, 750, 1000, 2000, 2500, 5000, 10000];

const TABLE_DATA = [
  { mass: 1, water: '0.0010 L', milk: '0.00097 L', oil: '0.00109 L', honey: '0.00070 L', gas: '0.00134 L' },
  { mass: 10, water: '0.0100 L', milk: '0.00971 L', oil: '0.01087 L', honey: '0.00704 L', gas: '0.01342 L' },
  { mass: 50, water: '0.0500 L', milk: '0.04854 L', oil: '0.05435 L', honey: '0.03521 L', gas: '0.06711 L' },
  { mass: 100, water: '0.1000 L', milk: '0.09709 L', oil: '0.10870 L', honey: '0.07042 L', gas: '0.13423 L' },
  { mass: 250, water: '0.2500 L', milk: '0.24272 L', oil: '0.27174 L', honey: '0.17606 L', gas: '0.33557 L' },
  { mass: 500, water: '0.5000 L', milk: '0.48544 L', oil: '0.54348 L', honey: '0.35211 L', gas: '0.67114 L' },
  { mass: 1000, water: '1.0000 L', milk: '0.97087 L', oil: '1.08696 L', honey: '0.70423 L', gas: '1.34228 L' },
  { mass: 2000, water: '2.0000 L', milk: '1.94175 L', oil: '2.17391 L', honey: '1.40845 L', gas: '2.68456 L' },
  { mass: 2500, water: '2.5000 L', milk: '2.42718 L', oil: '2.71739 L', honey: '1.76056 L', gas: '3.35570 L' },
  { mass: 5000, water: '5.0000 L', milk: '4.85437 L', oil: '5.43478 L', honey: '3.52113 L', gas: '6.71141 L' },
  { mass: 10000, water: '10.0000 L', milk: '9.70874 L', oil: '10.86957 L', honey: '7.04225 L', gas: '13.42282 L' },
];

const FAQS = [
  {
    q: '1. How many liters are in 1 gram?',
    a: 'For pure water at 4°C with a standard reference density of 1.000 g/mL, exactly 1 gram occupies 0.001 liters (1 milliliter). For any other substance, the volume in liters equals 1 ÷ (density × 1000). For instance, 1 gram of honey (ρ = 1.42 g/mL) is approximately 0.000704 liters.',
  },
  {
    q: '2. Can grams be directly converted to liters?',
    a: 'No. Direct conversion without specifying the substance is physically impossible because grams quantify physical mass (inertia) while liters quantify geometric volume (spatial occupancy). You must know the substance’s volumetric density (ρ) to relate the two properties.',
  },
  {
    q: '3. How many liters is 1,000 grams of water?',
    a: '1,000 grams of pure water equals exactly 1.000 liter (1 L). This one-to-one equivalence is not a coincidence: the original 1795 metric system specifically defined one kilogram (1,000 g) as the mass of one liter (1 dm³) of pure water at the freezing/melting point of ice.',
  },
  {
    q: '4. Why does density affect the conversion?',
    a: 'Density (ρ = m/V) describes how tightly mass particles are packed into space. High-density materials (like honey, mercury, or molasses) contain tremendous mass in a tiny physical volume, resulting in fewer liters per 1,000g. Low-density materials (like motor fuel, liquid propane, or flour) spread mass across a wider space, producing far more liters per 1,000g.',
  },
  {
    q: '5. Is gram a weight unit?',
    a: 'Under strict physics and metrology guidelines (BIPM / NIST), the gram is a unit of mass, which does not change regardless of gravitational environment. Weight is the gravitational force exerted upon mass (F = mg), measured in Newtons. However, in commerce, law, and domestic cooking, mass measured on scales is conventionally termed “weight.”',
  },
  {
    q: '6. Is liter a volume unit?',
    a: 'Yes. The liter is an internationally recognized metric unit of volume equal to 1 cubic decimeter (1 dm³, 1,000 cm³, or 0.001 m³). While the SI base unit of volume is the cubic meter (m³), the liter is universally accepted for daily and scientific volumetric reporting.',
  },
  {
    q: '7. Can I use this converter for cooking ingredients?',
    a: 'Yes. SolveIt includes specialized culinary density presets for whole milk (1.030 g/mL), culinary vegetable oil (0.920 g/mL), pure honey (1.420 g/mL), melted butter (0.911 g/mL), granulated sugar (0.845 g/mL), and all-purpose flour (0.528 g/mL). You can also type any custom ingredient density.',
  },
  {
    q: '8. Can I convert fuel weights to liters?',
    a: 'Yes. SolveIt contains density coefficients for automotive unleaded gasoline (0.745 g/mL) and industrial ethanol (0.789 g/mL). This is ideal for motor racers, pilots, and marine operators converting fuel scale readings to onboard tank volumes.',
  },
  {
    q: '9. How accurate is this converter?',
    a: 'The converter uses double-precision IEEE 754 64-bit floating point arithmetic with zero server latency or network round-trips. Calculations are traceable to NIST SP 811 standards and can be configured from 2 to 6 decimal digits of exact precision.',
  },
  {
    q: '10. What is the formula for converting grams to liters?',
    a: 'The universal formula is: Volume in Liters = Mass in Grams / (Density in g/mL × 1,000). For water where density equals 1.000 g/mL, the equation simplifies to: Liters = Grams ÷ 1000.',
  },
];

export default function GramToLiterClient() {
  const [massInput, setMassInput] = useState<string>('1000');
  const [currentDensity, setCurrentDensity] = useState<number>(1.000);
  const [currentSubstanceName, setCurrentSubstanceName] = useState<string>('Pure Water');
  const [currentDecimals, setCurrentDecimals] = useState<number>(4);
  const [customDensityValue, setCustomDensityValue] = useState<string>('');
  const [isCustomOpen, setIsCustomOpen] = useState<boolean>(false);
  const [copyStatus, setCopyStatus] = useState<boolean>(false);
  const [tableFilter, setTableFilter] = useState<string>('');
  const [openFaqs, setOpenFaqs] = useState<{ [key: number]: boolean }>({ 0: true });

  const inputRef = useRef<HTMLInputElement>(null);

  // Calculations
  const mass = parseFloat(massInput) || 0;
  const safeMass = mass < 0 ? 0 : mass;
  const liters = safeMass > 0 && currentDensity > 0 ? safeMass / (currentDensity * 1000) : 0;

  const formattedLiters = liters.toLocaleString('en-US', {
    minimumFractionDigits: currentDecimals,
    maximumFractionDigits: currentDecimals,
  });

  // Secondary volumetric equivalents
  const ml = liters * 1000;
  const floz = liters * 33.8140226;
  const impfloz = liters * 35.1950797;
  const cups = liters * 4.22675284;
  const gal = liters * 0.264172052;
  const cm3 = ml;

  // Substance selection
  const handleSelectSubstance = (sub: Substance) => {
    setCurrentDensity(sub.density);
    setCurrentSubstanceName(sub.name);
  };

  // Custom density apply
  const handleApplyCustomDensity = () => {
    const val = parseFloat(customDensityValue);
    if (!isNaN(val) && val > 0) {
      setCurrentDensity(val);
      setCurrentSubstanceName(`Custom (ρ ${val.toFixed(3)})`);
    }
  };

  // Copy result
  const handleCopy = () => {
    const textToCopy = `${massInput} g of ${currentSubstanceName} = ${formattedLiters} L (SolveIt Calculator)`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopyStatus(true);
      setTimeout(() => setCopyStatus(false), 2000);
    });
  };

  // Reset
  const handleReset = () => {
    setMassInput('1000');
    setCurrentDensity(1.000);
    setCurrentSubstanceName('Pure Water');
    setCurrentDecimals(4);
    setCustomDensityValue('');
    setIsCustomOpen(false);
  };

  // Table load
  const handleLoadRow = (m: number) => {
    setMassInput(m.toString());
    if (inputRef.current) {
      inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const toggleFaq = (idx: number) => {
    setOpenFaqs((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Filtered table rows
  const filteredRows = TABLE_DATA.filter((row) =>
    tableFilter === '' || row.mass.toString().includes(tableFilter.trim())
  );

  return (
    <div className="min-h-screen flex flex-col bg-background font-body-md text-on-surface antialiased">
      

      <main className="w-full pt-16 bg-background min-h-screen flex-1">
        {/* Top Hero & Context Header */}
        <section className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-xl">
          {/* Breadcrumb & Metrology Indicators */}
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
              <Link className="hover:text-primary transition-colors" href="/weight-mass-converter">
                Weight &amp; Mass
              </Link>
              <span className="text-outline/40 select-none">/</span>
              <Link className="hover:text-primary transition-colors" href="/conversion/gram">
                Gram
              </Link>
              <span className="text-outline/40 select-none">/</span>
              <span className="text-primary font-semibold" aria-current="page">Gram to Liter</span>
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

          {/* Title & Subtitle Block */}
          <div className="max-w-4xl space-y-space-xs">
            <div className="flex items-center gap-space-xs text-primary">
              <span className="material-symbols-outlined text-[20px]">swap_horizontal_circle</span>
              <span className="text-label-caps font-label-caps uppercase tracking-widest font-semibold">Metrology Precision Engine</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
              Gram to Liter Converter <span className="text-primary font-normal">(g to L)</span>
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              Use this free Gram to Liter converter to quickly convert grams (g) into liters (L). Because grams measure weight and liters measure volume, the conversion depends on the density of the substance being measured. Select an ingredient or substance to get the most accurate result.
            </p>
          </div>

          {/* Metrological Distinction Notice Banner */}
          <div className="mt-space-lg p-space-md lg:p-space-lg rounded-xl bg-surface-container-low shadow-sm flex flex-col sm:flex-row items-start gap-space-md">
            <div className="w-10 h-10 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px]">info</span>
            </div>
            <div className="space-y-space-2xs">
              <span className="font-headline-md text-body-md font-bold text-on-surface flex items-center gap-space-xs">
                Crucial Metrology Notice: Mass vs. Spatial Volume Distinction
              </span>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Grams measure physical mass/weight (<span className="font-data-mono text-data-mono font-medium">m</span>), whereas liters measure spatial geometric volume (<span className="font-data-mono text-data-mono font-medium">V</span>). Because <span className="font-data-mono text-data-mono font-medium">V = m / ρ</span>, the exact volume depends strictly on the substance density (<span className="font-data-mono text-data-mono font-medium">ρ</span> in g/mL or g/cm³). 1,000 g of pure water equals exactly 1.000 L, whereas 1,000 g of dense honey is only ~0.704 L, and 1,000 g of volatile automotive gasoline expands to ~1.342 L.
              </p>
            </div>
          </div>
        </section>

        {/* Interactive Converter Workbench Section */}
        <section className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop pb-space-3xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
            
            {/* Left 7 Cols: Active Interactive Controls */}
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

                {/* Custom Density Accordion Toggle */}
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

              {/* Mass Input & Quick Chips */}
              <div className="space-y-space-xs">
                <div className="flex items-center justify-between">
                  <label htmlFor="mass-input-field" className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider font-semibold">
                    Step 2: Mass in Grams (g)
                  </label>
                  {/* Precision Decimals Toggle */}
                  <div className="flex items-center gap-space-2xs bg-surface-container-low p-1 rounded-lg">
                    {[2, 4, 6].map((d) => (
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
                        {d === 2 ? '.00' : d === 4 ? '.0000' : '.000000'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <input
                    ref={inputRef}
                    id="mass-input-field"
                    type="number"
                    step="any"
                    min="0"
                    value={massInput}
                    onChange={(e) => setMassInput(e.target.value)}
                    className="w-full bg-surface-container-low px-space-md py-space-md rounded-xl font-numerical-display text-numerical-display text-on-surface focus:outline-none focus:bg-surface-container transition-colors tracking-tight font-bold"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-headline-md text-headline-md text-on-surface-variant font-medium pointer-events-none">
                    grams (g)
                  </span>
                </div>

                {/* Quick Presets */}
                <div className="flex flex-wrap items-center gap-space-2xs pt-space-2xs">
                  <span className="text-label-caps font-label-caps text-on-surface-variant uppercase mr-space-2xs">
                    Presets:
                  </span>
                  {PRESETS.map((p) => {
                    const isSelected = parseFloat(massInput) === p;
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setMassInput(p.toString())}
                        className={`px-space-xs py-space-2xs rounded-md text-body-sm font-data-mono transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-primary-container text-on-primary-container font-bold'
                            : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                        }`}
                      >
                        {p.toLocaleString('en-US')}g
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Calculated Output Display Card */}
              <div className="rounded-xl bg-surface-container p-space-md sm:p-space-lg space-y-space-xs shadow-inner">
                <div className="flex items-center justify-between text-on-surface-variant">
                  <span className="font-label-caps text-label-caps uppercase tracking-wider font-semibold">
                    Calculated Spatial Volume
                  </span>
                  <span className="flex items-center gap-space-2xs text-label-caps font-label-caps text-secondary font-medium">
                    <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse"></span>
                    Deterministic Local Sandbox
                  </span>
                </div>
                <div className="flex items-baseline gap-space-xs flex-wrap">
                  <span className="font-numerical-display text-numerical-display text-primary font-bold tracking-tight">
                    {formattedLiters}
                  </span>
                  <span className="font-headline-lg text-headline-lg text-on-surface font-semibold">
                    Liters (L)
                  </span>
                </div>
                {/* Mathematical Trace Strip */}
                <div className="pt-space-2xs flex items-center justify-between flex-wrap gap-space-2xs">
                  <p className="font-data-mono text-body-sm text-on-surface-variant">
                    {safeMass.toLocaleString('en-US')}&nbsp;g &divide; ({currentDensity.toFixed(3)}&nbsp;g/mL &times; 1,000) = <strong className="text-on-surface">{formattedLiters}&nbsp;L</strong>
                  </p>
                  <span className="font-data-mono text-label-caps bg-surface-container-highest px-space-xs py-1 rounded text-on-surface font-medium">
                    {currentSubstanceName}
                  </span>
                </div>
              </div>

              {/* Interactive Workbench Control Action Buttons */}
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
                  href="/conversion/liter-to-gram"
                  className="px-space-md py-space-xs rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-container-highest transition-colors font-body-sm font-medium flex items-center gap-space-2xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">swap_vert</span>
                  Swap (L to g)
                </Link>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-space-md py-space-xs rounded-lg bg-surface-container-low text-on-surface-variant hover:text-on-surface transition-colors font-body-sm font-medium flex items-center gap-space-2xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">restart_alt</span>
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-space-md py-space-xs rounded-lg bg-surface-container-low text-on-surface-variant hover:text-on-surface transition-colors font-body-sm font-medium flex items-center gap-space-2xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">print</span>
                  Print Specs
                </button>
              </div>

              {/* Simultaneous Multi-Unit Equivalents Drawer */}
              <div className="space-y-space-xs pt-space-xs">
                <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider font-semibold block">
                  Simultaneous Volumetric Equivalents (Based on Current Mass &amp; Density)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-space-xs">
                  <div className="p-space-xs rounded-lg bg-surface-container-low">
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase block">Milliliters</span>
                    <span className="font-data-mono text-body-md font-bold text-on-surface">
                      {ml.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} mL
                    </span>
                  </div>
                  <div className="p-space-xs rounded-lg bg-surface-container-low">
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase block">US Fluid Ounces</span>
                    <span className="font-data-mono text-body-md font-bold text-on-surface">
                      {floz.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })} fl oz
                    </span>
                  </div>
                  <div className="p-space-xs rounded-lg bg-surface-container-low">
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase block">Imperial Fluid Oz</span>
                    <span className="font-data-mono text-body-md font-bold text-on-surface">
                      {impfloz.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })} fl oz
                    </span>
                  </div>
                  <div className="p-space-xs rounded-lg bg-surface-container-low">
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase block">US Legal Cups</span>
                    <span className="font-data-mono text-body-md font-bold text-on-surface">
                      {cups.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })} cups
                    </span>
                  </div>
                  <div className="p-space-xs rounded-lg bg-surface-container-low">
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase block">US Liquid Gallons</span>
                    <span className="font-data-mono text-body-md font-bold text-on-surface">
                      {gal.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })} gal
                    </span>
                  </div>
                  <div className="p-space-xs rounded-lg bg-surface-container-low">
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase block">Cubic Centimeters</span>
                    <span className="font-data-mono text-body-md font-bold text-on-surface">
                      {cm3.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} cm³
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 5 Cols: Substance Metrology & Visual Displacement Card */}
            <div className="lg:col-span-5 space-y-space-lg">
              {/* Volumetric Displacement Benchmark Graphic */}
              <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-md space-y-space-md">
                <div className="flex items-center justify-between">
                  <span className="font-label-caps text-label-caps uppercase text-secondary font-semibold tracking-wider">
                    Metrology Reference Model
                  </span>
                  <span className="font-data-mono text-body-sm text-on-surface-variant">Constant Mass = 1,000g</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
                    Density Displacement Matrix
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Notice how the physical footprint changes across substances at an identical 1,000 g mass:
                  </p>
                </div>

                {/* Comparative SVG Bar Chart Graphic */}
                <div className="space-y-space-xs pt-space-2xs">
                  {/* Gasoline */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-body-sm font-data-mono">
                      <span className="text-on-surface font-medium">Automotive Fuel (ρ 0.745)</span>
                      <span className="font-bold text-primary">1.342 L</span>
                    </div>
                    <div className="w-full bg-surface-container-low h-3 rounded-full overflow-hidden">
                      <div className="bg-secondary h-full rounded-full transition-all duration-500" style={{ width: '89%' }}></div>
                    </div>
                  </div>

                  {/* Cooking Oil */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-body-sm font-data-mono">
                      <span className="text-on-surface font-medium">Cooking Oil (ρ 0.920)</span>
                      <span className="font-bold text-primary">1.087 L</span>
                    </div>
                    <div className="w-full bg-surface-container-low h-3 rounded-full overflow-hidden">
                      <div className="bg-secondary h-full rounded-full transition-all duration-500" style={{ width: '72%' }}></div>
                    </div>
                  </div>

                  {/* Pure Water */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-body-sm font-data-mono">
                      <span className="text-on-surface font-semibold">Pure Water Baseline (ρ 1.000)</span>
                      <span className="font-bold text-primary">1.000 L</span>
                    </div>
                    <div className="w-full bg-surface-container-low h-3 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: '66%' }}></div>
                    </div>
                  </div>

                  {/* Whole Milk */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-body-sm font-data-mono">
                      <span className="text-on-surface font-medium">Whole Milk (ρ 1.030)</span>
                      <span className="font-bold text-primary">0.971 L</span>
                    </div>
                    <div className="w-full bg-surface-container-low h-3 rounded-full overflow-hidden">
                      <div className="bg-secondary-container h-full rounded-full transition-all duration-500" style={{ width: '64%' }}></div>
                    </div>
                  </div>

                  {/* Honey */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-body-sm font-data-mono">
                      <span className="text-on-surface font-medium">Pure Honey (ρ 1.420)</span>
                      <span className="font-bold text-primary">0.704 L</span>
                    </div>
                    <div className="w-full bg-surface-container-low h-3 rounded-full overflow-hidden">
                      <div className="bg-tertiary-container h-full rounded-full transition-all duration-500" style={{ width: '47%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="pt-space-xs p-space-xs rounded-lg bg-surface-container-low text-label-caps font-data-mono text-on-surface-variant flex items-center justify-between">
                  <span>&Delta; Volume Spread = +90.6%</span>
                  <span>Ref: CODATA 2022 / NIST</span>
                </div>
              </div>

              {/* Metrology Calibration Specs */}
              <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-md space-y-space-sm">
                <h3 className="font-headline-md text-headline-md font-bold text-on-surface flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-[22px]">square_foot</span>
                  Standardized Metrological Baseline
                </h3>
                <ul className="space-y-space-xs font-body-sm text-body-sm text-on-surface-variant">
                  <li className="flex items-start gap-space-2xs">
                    <span className="material-symbols-outlined text-secondary text-[16px] shrink-0 mt-0.5">check_circle</span>
                    <span><strong>1 Liter Definition:</strong> Exactly 1 cubic decimeter (1 dm³), equivalent to 10⁻³ m³ or 1,000 cm³ under BIPM SI metric definitions.</span>
                  </li>
                  <li className="flex items-start gap-space-2xs">
                    <span className="material-symbols-outlined text-secondary text-[16px] shrink-0 mt-0.5">check_circle</span>
                    <span><strong>Universal Mass-to-Volume Equation:</strong> V = m / (ρ &times; 1000), where m is grams, ρ is density in g/mL, and V is liters.</span>
                  </li>
                  <li className="flex items-start gap-space-2xs">
                    <span className="material-symbols-outlined text-secondary text-[16px] shrink-0 mt-0.5">check_circle</span>
                    <span><strong>NIST STP Calibration:</strong> Calibrated at 20°C (68°F) at standard atmospheric pressure of 101.325 kPa (1 atm).</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </section>

        {/* Formula & Mathematical Derivation Section */}
        <section className="w-full bg-surface-container-low py-space-3xl">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop space-y-space-xl">
            <div className="max-w-3xl space-y-space-xs">
              <span className="font-label-caps text-label-caps uppercase text-secondary font-semibold tracking-wider">
                Metrology Proof &amp; Mechanics
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                Gram to Liter Formula &amp; Mathematical Derivation
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Converting mass to geometric volume requires bridging inertial resistance (mass) and spatial dimensions through the physical property of volumetric density.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg items-stretch">
              {/* Universal Equation Box */}
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm space-y-space-md flex flex-col justify-between">
                <div className="space-y-space-xs">
                  <span className="font-label-caps text-label-caps text-primary uppercase font-bold tracking-widest">
                    Universal Volumetric Derivation
                  </span>
                  <h3 className="font-headline-md text-headline-md font-semibold text-on-surface">
                    General Formula with Density
                  </h3>
                  <div className="my-space-md p-space-md rounded-lg bg-surface-container font-data-mono text-body-lg text-primary font-bold text-center">
                    Liters (L) = Grams (g) &divide; (Density (g/mL) &times; 1000)
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Because 1 Liter = 1,000 mL, multiplying density (in g/mL) by 1,000 yields grams per liter (g/L). Dividing the total mass in grams by g/L results in spatial volume in liters.
                  </p>
                </div>
                <div className="p-space-xs rounded bg-surface-container-low font-data-mono text-label-caps text-on-surface-variant">
                  Metrology Unit Identity: [g] &divide; ([g/mL] &times; 1000) = [mL &divide; 1000] = [L]
                </div>
              </div>

              {/* Water Special Case Box */}
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm space-y-space-md flex flex-col justify-between">
                <div className="space-y-space-xs">
                  <span className="font-label-caps text-label-caps text-secondary uppercase font-bold tracking-widest">
                    Standard Water Case
                  </span>
                  <h3 className="font-headline-md text-headline-md font-semibold text-on-surface">
                    Substance-Specific Calibration: Pure Water
                  </h3>
                  <div className="my-space-md p-space-md rounded-lg bg-surface-container font-data-mono text-body-lg text-secondary font-bold text-center">
                    Liters (L) = Grams (g) &divide; 1000
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Pure liquid water at 4°C has a calibrated density of exactly 1.000 g/mL (1,000 g/L). For water and near-water aqueous solutions, volume in liters is simply mass in grams divided by one thousand.
                  </p>
                </div>
                <div className="p-space-xs rounded bg-surface-container-low font-data-mono text-label-caps text-on-surface-variant">
                  Proof: 1,000 g &divide; (1.000 &times; 1000) = 1.000 L
                </div>
              </div>
            </div>

            {/* Worked Numerical Examples Matrix */}
            <div className="space-y-space-md">
              <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
                Step-by-Step Numerical Verification Examples
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-space-sm">
                <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-xs space-y-space-2xs">
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Example 01 • Water</span>
                  <div className="font-data-mono text-body-md font-bold text-primary">1,000g Water</div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">1,000 &divide; (1.0 &times; 1000) =</p>
                  <div className="font-data-mono text-body-lg font-bold text-on-surface">1.000 Liters</div>
                </div>
                <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-xs space-y-space-2xs">
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Example 02 • Water</span>
                  <div className="font-data-mono text-body-md font-bold text-primary">500g Water</div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">500 &divide; (1.0 &times; 1000) =</p>
                  <div className="font-data-mono text-body-lg font-bold text-on-surface">0.500 Liters</div>
                </div>
                <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-xs space-y-space-2xs">
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Example 03 • Water</span>
                  <div className="font-data-mono text-body-md font-bold text-primary">2,500g Water</div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">2,500 &divide; (1.0 &times; 1000) =</p>
                  <div className="font-data-mono text-body-lg font-bold text-on-surface">2.500 Liters</div>
                </div>
                <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-xs space-y-space-2xs">
                  <span className="font-label-caps text-label-caps text-tertiary-container uppercase">Example 04 • Honey</span>
                  <div className="font-data-mono text-body-md font-bold text-tertiary-container">1,000g Honey</div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">1,000 &divide; (1.42 &times; 1000) =</p>
                  <div className="font-data-mono text-body-lg font-bold text-on-surface">0.704 Liters</div>
                </div>
                <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-xs space-y-space-2xs">
                  <span className="font-label-caps text-label-caps text-secondary uppercase">Example 05 • Fuel</span>
                  <div className="font-data-mono text-body-md font-bold text-secondary">1,000g Gasoline</div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">1,000 &divide; (0.745 &times; 1000) =</p>
                  <div className="font-data-mono text-body-lg font-bold text-on-surface">1.342 Liters</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Searchable & Interactive Multi-Substance Matrix Table Section */}
        <section className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-3xl space-y-space-xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
            <div className="space-y-space-xs max-w-2xl">
              <span className="font-label-caps text-label-caps uppercase text-secondary font-semibold tracking-wider">
                Rapid Metrological Lookup
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                Gram to Liter Conversion Table
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Cross-reference mass in grams against 5 standard substances. Click “Load” to instantly calibrate the interactive workbench above to any preset row.
              </p>
            </div>
            <div className="flex items-center gap-space-xs">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Filter mass value..."
                  value={tableFilter}
                  onChange={(e) => setTableFilter(e.target.value)}
                  className="bg-surface-container-low px-space-sm py-space-xs pl-8 rounded-lg text-body-sm font-data-mono text-on-surface focus:outline-none focus:bg-surface-container"
                />
                <span className="material-symbols-outlined absolute left-2 top-2 text-[16px] text-on-surface-variant pointer-events-none">
                  search
                </span>
              </div>
            </div>
          </div>

          {/* Table Canvas */}
          <div className="overflow-x-auto bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20">
            <table className="w-full text-left font-data-mono text-body-sm">
              <thead className="bg-surface-container text-on-surface font-semibold text-label-caps uppercase tracking-wider">
                <tr>
                  <th className="py-space-sm px-space-md">Mass (Grams)</th>
                  <th className="py-space-sm px-space-md">Pure Water (ρ 1.000)</th>
                  <th className="py-space-sm px-space-md">Whole Milk (ρ 1.030)</th>
                  <th className="py-space-sm px-space-md">Cooking Oil (ρ 0.920)</th>
                  <th className="py-space-sm px-space-md">Honey (ρ 1.420)</th>
                  <th className="py-space-sm px-space-md">Gasoline (ρ 0.745)</th>
                  <th className="py-space-sm px-space-md text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-on-surface-variant">
                {filteredRows.map((row) => {
                  const isLoaded = parseFloat(massInput) === row.mass;
                  return (
                    <tr
                      key={row.mass}
                      className={`hover:bg-surface-container-low/50 transition-colors border-t border-outline-variant/10 ${
                        isLoaded ? 'bg-surface-container-low/30' : ''
                      }`}
                    >
                      <td className={`py-space-sm px-space-md font-bold ${isLoaded ? 'text-primary' : 'text-on-surface'}`}>
                        {row.mass.toLocaleString('en-US')} g
                      </td>
                      <td className={`py-space-sm px-space-md font-semibold ${isLoaded ? 'text-primary' : 'text-primary'}`}>
                        {row.water}
                      </td>
                      <td className="py-space-sm px-space-md">{row.milk}</td>
                      <td className="py-space-sm px-space-md">{row.oil}</td>
                      <td className="py-space-sm px-space-md">{row.honey}</td>
                      <td className="py-space-sm px-space-md">{row.gas}</td>
                      <td className="py-space-sm px-space-md text-right">
                        <button
                          type="button"
                          onClick={() => handleLoadRow(row.mass)}
                          className={`px-space-xs py-1 rounded text-label-caps font-body-sm transition-colors cursor-pointer ${
                            isLoaded
                              ? 'bg-primary text-on-primary font-bold'
                              : 'bg-surface-container text-primary hover:bg-primary hover:text-on-primary'
                          }`}
                        >
                          {isLoaded ? 'Loaded' : 'Load'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Deep Explanatory Sections: Mass vs. Volume & Fundamental Definitions */}
        <section className="w-full bg-surface-container-low py-space-3xl">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop space-y-space-2xl">
            {/* H2 Section Explaining Governing Dynamics */}
            <div className="space-y-space-md max-w-3xl">
              <span className="font-label-caps text-label-caps uppercase text-secondary font-semibold tracking-wider">
                Metrology Principles
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                Why Density Strictly Governs Mass-to-Volume Conversions
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                Mass is an intrinsic measure of the quantity of matter and inertial resistance contained within an object, independent of gravitational fields or ambient pressure. Volume, conversely, is an extrinsic measure of three-dimensional geometric space occupied by matter.
              </p>
            </div>

            {/* Why 1000g Water != 1000g Honey Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm space-y-space-xs">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">water_drop</span>
                </div>
                <h3 className="font-headline-md text-headline-md font-bold text-on-surface">1,000g Water &ne; 1,000g Honey</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  Honey molecules (fructose and glucose) are packed densely with tight intermolecular bonding (&rho; &approx; 1.420 g/mL). Therefore, 1,000 grams of honey occupies only 0.704 liters of space, whereas 1,000 grams of water fills exactly 1.000 liter.
                </p>
              </div>

              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm space-y-space-xs">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">oil_barrel</span>
                </div>
                <h3 className="font-headline-md text-headline-md font-bold text-on-surface">1,000g Oil &ne; 1,000g Milk</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  Lipids in culinary vegetable oil possess lower molecular mass density (&rho; &approx; 0.920 g/mL) than water, floating on top. As a result, 1,000 grams of cooking oil expands to 1.087 liters, while 1,000 grams of denser whole milk sits at 0.971 liters.
                </p>
              </div>

              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm space-y-space-xs">
                <div className="w-10 h-10 rounded-lg bg-tertiary-container/10 text-tertiary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">local_gas_station</span>
                </div>
                <h3 className="font-headline-md text-headline-md font-bold text-on-surface">1,000g Fuel &ne; 1,000g Butter</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  Volatile hydrocarbons in automotive motor fuels exhibit significant molecular expansion (&rho; &approx; 0.745 g/mL). An identical 1,000g weight of fuel requires a 1.342-liter container, requiring over 47% more tank capacity than butter (&rho; &approx; 0.911 g/mL).
                </p>
              </div>
            </div>

            {/* Two-Column Metric Definitions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
              <div className="p-space-xl rounded-xl bg-surface-container-lowest shadow-sm space-y-space-sm">
                <span className="font-label-caps text-label-caps uppercase text-primary font-bold tracking-widest">
                  SI Mass Standard
                </span>
                <h3 className="font-headline-lg text-headline-lg font-bold text-on-surface">
                  What Is a Gram (g)?
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  A <strong>gram</strong> is a unit of mass in the International System of Units (SI), defined as exactly 1/1,000th of a kilogram (10⁻³ kg). Following the 2019 redefinition of the SI base units, the gram is calibrated directly against the fundamental quantum Planck constant (<em>h</em> = 6.62607015 &times; 10⁻³⁴ kg&middot;m&sup2;&middot;s⁻¹).
                </p>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  Grams are universally employed as the standard metric unit across pharmaceuticals, culinary recipe development, analytical chemical synthesis, and international commodity trading.
                </p>
                <div className="p-space-xs rounded bg-surface-container-low font-data-mono text-label-caps text-on-surface">
                  Standard Symbol: g &bull; 1,000 g = 1 kg &bull; Defined via Planck constant (h)
                </div>
              </div>

              <div className="p-space-xl rounded-xl bg-surface-container-lowest shadow-sm space-y-space-sm">
                <span className="font-label-caps text-label-caps uppercase text-secondary font-bold tracking-widest">
                  Accepted Metric Volume
                </span>
                <h3 className="font-headline-lg text-headline-lg font-bold text-on-surface">
                  What Is a Liter (L)?
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  A <strong>liter</strong> (symbol: L or l) is a metric unit of volumetric capacity accepted for use with the SI. It is defined as exactly 1 cubic decimeter (1 dm³), which corresponds to a cube measuring 10 cm &times; 10 cm &times; 10 cm (1,000 cm³ or 10⁻³ m³).
                </p>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  Originally created in revolutionary France in 1795 as the base measure of liquid capacity, the liter is the worldwide standard for retail beverages, engine displacements, chemical reagent storage, and industrial pipeline transport.
                </p>
                <div className="p-space-xs rounded bg-surface-container-low font-data-mono text-label-caps text-on-surface">
                  Standard Symbol: L &bull; 1 L = 1,000 mL = 1 dm³ &bull; BIPM Accepted Unit
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Step-by-Step SOP & Real-World Use Cases Section */}
        <section className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-3xl space-y-space-2xl">
          <div className="max-w-3xl space-y-space-xs">
            <span className="font-label-caps text-label-caps uppercase text-secondary font-semibold tracking-wider">
              Operational Protocol
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
              How to Convert Grams to Liters in 4 Simple Steps
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Follow this standard metrology operational procedure (SOP) to calculate volume from mass in any laboratory, kitchen, or production environment.
            </p>
          </div>

          {/* 4 Step Flow Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
            <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm space-y-space-xs relative overflow-hidden">
              <span className="font-display-hero text-display-hero text-surface-container-high/60 font-black absolute -top-3 -right-1 select-none pointer-events-none">01</span>
              <span className="w-8 h-8 rounded-full bg-primary text-on-primary font-data-mono text-body-sm font-bold flex items-center justify-center">1</span>
              <h3 className="font-headline-md text-body-lg font-bold text-on-surface pt-space-xs">Record Mass in Grams</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Weigh the substance on a tared scale to obtain the net mass (<span className="font-data-mono">m</span>) in grams, eliminating container tare.
              </p>
            </div>

            <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm space-y-space-xs relative overflow-hidden">
              <span className="font-display-hero text-display-hero text-surface-container-high/60 font-black absolute -top-3 -right-1 select-none pointer-events-none">02</span>
              <span className="w-8 h-8 rounded-full bg-secondary text-on-secondary font-data-mono text-body-sm font-bold flex items-center justify-center">2</span>
              <h3 className="font-headline-md text-body-lg font-bold text-on-surface pt-space-xs">Identify Density (&rho;)</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Reference the substance’s density at 20°C in g/mL (or g/cm³) using our table or a laboratory hydrometer.
              </p>
            </div>

            <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm space-y-space-xs relative overflow-hidden">
              <span className="font-display-hero text-display-hero text-surface-container-high/60 font-black absolute -top-3 -right-1 select-none pointer-events-none">03</span>
              <span className="w-8 h-8 rounded-full bg-primary text-on-primary font-data-mono text-body-sm font-bold flex items-center justify-center">3</span>
              <h3 className="font-headline-md text-body-lg font-bold text-on-surface pt-space-xs">Execute Division Formula</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Compute Liters = Grams &divide; (&rho; &times; 1000). For water where &rho; = 1.0, simply divide mass by 1,000.
              </p>
            </div>

            <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm space-y-space-xs relative overflow-hidden">
              <span className="font-display-hero text-display-hero text-surface-container-high/60 font-black absolute -top-3 -right-1 select-none pointer-events-none">04</span>
              <span className="w-8 h-8 rounded-full bg-secondary text-on-secondary font-data-mono text-body-sm font-bold flex items-center justify-center">4</span>
              <h3 className="font-headline-md text-body-lg font-bold text-on-surface pt-space-xs">Extract Volume Result</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Read spatial volume directly in liters (L), or review simultaneous secondary measures (cups, fluid ounces, gallons).
              </p>
            </div>
          </div>

          {/* Common Quick Conversions Matrix Cards */}
          <div className="space-y-space-md pt-space-md">
            <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
              Common Quick Reference Cards (Water &bull; &rho; = 1.000 g/mL)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-space-xs">
              <div className="p-space-sm rounded-xl bg-surface-container-lowest shadow-xs text-center space-y-1">
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">100g Mass</span>
                <span className="font-data-mono text-headline-md font-bold text-primary block">0.1 L</span>
                <span className="text-label-caps text-on-surface-variant">100 mL</span>
              </div>
              <div className="p-space-sm rounded-xl bg-surface-container-lowest shadow-xs text-center space-y-1">
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">250g Mass</span>
                <span className="font-data-mono text-headline-md font-bold text-primary block">0.25 L</span>
                <span className="text-label-caps text-on-surface-variant">250 mL</span>
              </div>
              <div className="p-space-sm rounded-xl bg-surface-container-lowest shadow-xs text-center space-y-1">
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">500g Mass</span>
                <span className="font-data-mono text-headline-md font-bold text-primary block">0.5 L</span>
                <span className="text-label-caps text-on-surface-variant">500 mL</span>
              </div>
              <div className="p-space-sm rounded-xl bg-surface-container-lowest shadow-xs text-center space-y-1 bg-surface-container-low/40">
                <span className="font-label-caps text-label-caps text-primary uppercase font-bold">1,000g Mass</span>
                <span className="font-data-mono text-headline-md font-bold text-primary block">1.0 L</span>
                <span className="text-label-caps text-primary font-medium">1,000 mL</span>
              </div>
              <div className="p-space-sm rounded-xl bg-surface-container-lowest shadow-xs text-center space-y-1">
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">2,000g Mass</span>
                <span className="font-data-mono text-headline-md font-bold text-primary block">2.0 L</span>
                <span className="text-label-caps text-on-surface-variant">2,000 mL</span>
              </div>
              <div className="p-space-sm rounded-xl bg-surface-container-lowest shadow-xs text-center space-y-1">
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">5,000g Mass</span>
                <span className="font-data-mono text-headline-md font-bold text-primary block">5.0 L</span>
                <span className="text-label-caps text-on-surface-variant">5,000 mL</span>
              </div>
              <div className="p-space-sm rounded-xl bg-surface-container-lowest shadow-xs text-center space-y-1">
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">10,000g Mass</span>
                <span className="font-data-mono text-headline-md font-bold text-primary block">10.0 L</span>
                <span className="text-label-caps text-on-surface-variant">10,000 mL</span>
              </div>
            </div>
          </div>

          {/* 6 Real-World Application Cards */}
          <div className="space-y-space-md pt-space-lg">
            <div className="space-y-space-2xs">
              <span className="font-label-caps text-label-caps uppercase text-secondary font-semibold tracking-wider">
                Industrial &amp; Applied Sciences
              </span>
              <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
                Real-World Applications of Gram-to-Liter Calculations
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
              <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm space-y-space-xs">
                <div className="flex items-center gap-space-xs text-primary">
                  <span className="material-symbols-outlined text-[22px]">restaurant</span>
                  <h4 className="font-headline-md text-body-lg font-bold text-on-surface">Cooking &amp; Food Production</h4>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  Professional bakery formulations and commercial food processing recipes often list syrups, oils, and pastes in grams to eliminate volumetric cup packing errors. Converting to liters establishes accurate kettle batch volumes.
                </p>
              </div>

              <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm space-y-space-xs">
                <div className="flex items-center gap-space-xs text-primary">
                  <span className="material-symbols-outlined text-[22px]">biotech</span>
                  <h4 className="font-headline-md text-body-lg font-bold text-on-surface">Chemical &amp; Reagent Prep</h4>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  In chemistry laboratories, stoichiometric calculations determine reactants by molar mass in grams. Titration protocols and molarity calculations (M = mol/L) require exact volumetric dilution into volumetric flasks.
                </p>
              </div>

              <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm space-y-space-xs">
                <div className="flex items-center gap-space-xs text-primary">
                  <span className="material-symbols-outlined text-[22px]">precision_manufacturing</span>
                  <h4 className="font-headline-md text-body-lg font-bold text-on-surface">Manufacturing &amp; Packaging</h4>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  Automated bottling lines dispense cosmetics, liquid soaps, and lubricants by liter volume, while raw bulk materials are procured by net metric weight. Exact density matching prevents costly overflow or packaging underfill.
                </p>
              </div>

              <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm space-y-space-xs">
                <div className="flex items-center gap-space-xs text-primary">
                  <span className="material-symbols-outlined text-[22px]">flight</span>
                  <h4 className="font-headline-md text-body-lg font-bold text-on-surface">Automotive &amp; Aviation Fuel</h4>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  Aviation flight plans calculate fuel burn weight in kilograms and grams to ensure structural balance. Ground crews re-fuel tanks measured in spatial liters, requiring temperature-adjusted fuel density conversions.
                </p>
              </div>

              <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm space-y-space-xs">
                <div className="flex items-center gap-space-xs text-primary">
                  <span className="material-symbols-outlined text-[22px]">science</span>
                  <h4 className="font-headline-md text-body-lg font-bold text-on-surface">Scientific Experiments &amp; SOPs</h4>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  Academic and industrial metrology experiments demand peer-reviewable precision. SolveIt’s ISO/IEC 80000 metrological algorithms guarantee zero telemetry and zero computational drift during research executions.
                </p>
              </div>

              <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm space-y-space-xs">
                <div className="flex items-center gap-space-xs text-primary">
                  <span className="material-symbols-outlined text-[22px]">water_damage</span>
                  <h4 className="font-headline-md text-body-lg font-bold text-on-surface">Industrial Fluid Processing</h4>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  Wastewater treatment, municipal reservoir chlorine dosing, and beverage fermentation facilities calibrate high-capacity pumps in liters per hour while dosing chemicals stored as solid dry mass in grams and kilograms.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Comprehensive FAQ Section (Accordion) */}
        <section className="w-full bg-surface-container-low py-space-3xl">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop space-y-space-xl">
            <div className="max-w-3xl space-y-space-xs">
              <span className="font-label-caps text-label-caps uppercase text-secondary font-semibold tracking-wider">
                Metrology Inquiries
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                Frequently Asked Questions (FAQ)
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Authoritative answers to the 10 most common questions regarding gram-to-liter conversions, density physics, and SI measurement standards.
              </p>
            </div>

            <div className="space-y-space-xs max-w-4xl">
              {FAQS.map((faq, idx) => {
                const isOpen = !!openFaqs[idx];
                return (
                  <div
                    key={idx}
                    className="rounded-xl bg-surface-container-lowest p-space-md shadow-xs transition-all border border-outline-variant/10"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      className="w-full text-left font-headline-md text-body-lg font-bold text-on-surface flex items-center justify-between select-none cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <span className={`material-symbols-outlined text-[20px] transition-transform text-secondary ${isOpen ? 'rotate-180' : ''}`}>
                        expand_more
                      </span>
                    </button>
                    {isOpen && (
                      <div className="pt-space-xs font-body-md text-body-md text-on-surface-variant leading-relaxed">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Related Mass, Volume & Density Converters */}
        <section className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-3xl space-y-space-xl">
          <div className="max-w-3xl space-y-space-xs">
            <span className="font-label-caps text-label-caps uppercase text-secondary font-semibold tracking-wider">
              Interconnected Metrology Suite
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
              Related Mass, Volume &amp; Density Converters
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Explore SolveIt’s deterministic, client-side conversion workbenches for complementary mass, volumetric, and fluid density equations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-md">
            <Link
              href="/conversion/grams-to-milliliters"
              className="p-space-md rounded-xl bg-surface-container-lowest hover:bg-surface-container-low transition-all shadow-xs flex items-center justify-between group border border-outline-variant/20 cursor-pointer"
            >
              <div className="space-y-1">
                <span className="font-headline-md text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">
                  Gram to Milliliter (g to mL)
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant block">
                  Direct culinary &amp; chemical micro-displacement
                </span>
              </div>
              <span className="material-symbols-outlined text-secondary group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>

            <Link
              href="/conversion/gram-to-fluid-ounce"
              className="p-space-md rounded-xl bg-surface-container-lowest hover:bg-surface-container-low transition-all shadow-xs flex items-center justify-between group border border-outline-variant/20 cursor-pointer"
            >
              <div className="space-y-1">
                <span className="font-headline-md text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">
                  Gram to Fluid Ounce (g to fl oz)
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant block">
                  US &amp; Imperial fluid volume calibration
                </span>
              </div>
              <span className="material-symbols-outlined text-secondary group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>

            <Link
              href="/conversion/gram-to-cup"
              className="p-space-md rounded-xl bg-surface-container-lowest hover:bg-surface-container-low transition-all shadow-xs flex items-center justify-between group border border-outline-variant/20 cursor-pointer"
            >
              <div className="space-y-1">
                <span className="font-headline-md text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">
                  Gram to Cup (g to cups)
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant block">
                  Flour, sugar, and liquid recipe normalization
                </span>
              </div>
              <span className="material-symbols-outlined text-secondary group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>

            <Link
              href="/conversion/gram-to-kilogram"
              className="p-space-md rounded-xl bg-surface-container-lowest hover:bg-surface-container-low transition-all shadow-xs flex items-center justify-between group border border-outline-variant/20 cursor-pointer"
            >
              <div className="space-y-1">
                <span className="font-headline-md text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">
                  Gram to Kilogram (g to kg)
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant block">
                  Pure SI mass-to-mass deterministic conversion
                </span>
              </div>
              <span className="material-symbols-outlined text-secondary group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>

            <Link
              href="/conversion/liter-to-gram"
              className="p-space-md rounded-xl bg-surface-container-lowest hover:bg-surface-container-low transition-all shadow-xs flex items-center justify-between group border border-outline-variant/20 cursor-pointer"
            >
              <div className="space-y-1">
                <span className="font-headline-md text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">
                  Liter to Gram (L to g)
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant block">
                  Inverse volumetric fluid tank to weight analyzer
                </span>
              </div>
              <span className="material-symbols-outlined text-secondary group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>

            <Link
              href="/conversion/liter-to-milliliter"
              className="p-space-md rounded-xl bg-surface-container-lowest hover:bg-surface-container-low transition-all shadow-xs flex items-center justify-between group border border-outline-variant/20 cursor-pointer"
            >
              <div className="space-y-1">
                <span className="font-headline-md text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">
                  Liter to Milliliter (L to mL)
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant block">
                  Standard metric prefix shifting (1 L = 1,000 mL)
                </span>
              </div>
              <span className="material-symbols-outlined text-secondary group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>

            <Link
              href="/conversion/milliliter-to-gram"
              className="p-space-md rounded-xl bg-surface-container-lowest hover:bg-surface-container-low transition-all shadow-xs flex items-center justify-between group border border-outline-variant/20 cursor-pointer"
            >
              <div className="space-y-1">
                <span className="font-headline-md text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">
                  Milliliter to Gram (mL to g)
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant block">
                  Liquid dose weight verification calculator
                </span>
              </div>
              <span className="material-symbols-outlined text-secondary group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>

            <Link
              href="/conversion/cup-to-gram"
              className="p-space-md rounded-xl bg-surface-container-lowest hover:bg-surface-container-low transition-all shadow-xs flex items-center justify-between group border border-outline-variant/20 cursor-pointer"
            >
              <div className="space-y-1">
                <span className="font-headline-md text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">
                  Cup to Gram (cups to g)
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant block">
                  Baking volume to digital kitchen scale weight
                </span>
              </div>
              <span className="material-symbols-outlined text-secondary group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>

            <Link
              href="/conversion/fluid-ounce-to-gram"
              className="p-space-md rounded-xl bg-surface-container-lowest hover:bg-surface-container-low transition-all shadow-xs flex items-center justify-between group border border-outline-variant/20 cursor-pointer"
            >
              <div className="space-y-1">
                <span className="font-headline-md text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">
                  Fluid Ounce to Gram (fl oz to g)
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant block">
                  US liquid measure to net mass equivalent
                </span>
              </div>
              <span className="material-symbols-outlined text-secondary group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
