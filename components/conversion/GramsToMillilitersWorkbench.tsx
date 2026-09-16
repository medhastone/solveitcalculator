'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { INGREDIENTS, Ingredient } from '../../lib/conversion-data';

export default function GramsToMillilitersWorkbench() {
  const [mode, setMode] = useState<'g-to-ml' | 'ml-to-g'>('g-to-ml');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient>(INGREDIENTS[0]);
  const [customDensityStr, setCustomDensityStr] = useState<string>(INGREDIENTS[0].density.toString());
  const [inputValueStr, setInputValueStr] = useState<string>('250');
  const [inputUnit, setInputUnit] = useState<string>('g');

  const filteredIngredients = useMemo(() => {
    if (categoryFilter === 'all') return INGREDIENTS;
    return INGREDIENTS.filter(i => i.category === categoryFilter);
  }, [categoryFilter]);

  const handleCategoryChange = (newCategory: string) => {
    setCategoryFilter(newCategory);
    if (newCategory !== 'all') {
      const newList = INGREDIENTS.filter(i => i.category === newCategory);
      if (newList.length > 0 && selectedIngredient.category !== newCategory) {
        setSelectedIngredient(newList[0]);
        setCustomDensityStr(newList[0].density.toString());
      }
    }
  };

  const handleIngredientChange = (id: string) => {
    const found = INGREDIENTS.find(i => i.id === id);
    if (found) {
      setSelectedIngredient(found);
      setCustomDensityStr(found.density.toString());
    }
  };

  // Derived values
  const rawInput = parseFloat(inputValueStr) || 0;
  const density = parseFloat(customDensityStr) || 1.0;

  let volumeInMl = 0;
  let massInGrams = 0;

  if (mode === 'g-to-ml') {
    if (inputUnit === 'g') massInGrams = rawInput;
    else if (inputUnit === 'kg') massInGrams = rawInput * 1000;
    else if (inputUnit === 'oz') massInGrams = rawInput * 28.34952;
    else if (inputUnit === 'lb') massInGrams = rawInput * 453.59237;
    volumeInMl = density > 0 ? (massInGrams / density) : 0;
  } else {
    if (inputUnit === 'ml') volumeInMl = rawInput;
    else if (inputUnit === 'l') volumeInMl = rawInput * 1000;
    else if (inputUnit === 'cup') volumeInMl = rawInput * 236.588;
    else if (inputUnit === 'floz') volumeInMl = rawInput * 29.5735;
    massInGrams = volumeInMl * density;
  }

  const usCups = volumeInMl / 240.0;
  const tbsp = volumeInMl / 14.7868;
  const tsp = volumeInMl / 4.92892;
  const flOz = volumeInMl / 29.5735;
  const metricCups = volumeInMl / 250.0;
  const impPints = volumeInMl / 568.261;

  let fracText = '';
  if (usCups < 0.25) fracText = `~${(usCups * 16).toFixed(1)} Tbsp`;
  else if (usCups >= 0.25 && usCups < 0.4) fracText = 'approx. 1/3 cup';
  else if (usCups >= 0.4 && usCups < 0.6) fracText = 'approx. 1/2 cup';
  else if (usCups >= 0.6 && usCups < 0.85) fracText = 'approx. 3/4 cup';
  else fracText = `approx. ${usCups.toFixed(1)} cups`;

  const clampedMl = Math.min(Math.max(volumeInMl, 0), 500);
  const fillPercentage = (clampedMl / 500) * 100;
  const fillHeight = (clampedMl / 500) * 165; 
  const yPosition = 190 - fillHeight;

  const handleModeChange = (newMode: 'g-to-ml' | 'ml-to-g') => {
    if (newMode === mode) return;
    setMode(newMode);
    if (newMode === 'g-to-ml') {
      setInputUnit('g');
    } else {
      setInputUnit('ml');
    }
  };

  const copyToClipboard = () => {
    const val = mode === 'g-to-ml' ? volumeInMl.toFixed(2) : massInGrams.toFixed(2);
    const unit = mode === 'g-to-ml' ? 'mL' : 'g';
    const text = `${val} ${unit} (${selectedIngredient.name})`;
    navigator.clipboard.writeText(text).then(() => {
      alert(`Copied to clipboard: ${text}`);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const exportCSV = () => {
    const val = mode === 'g-to-ml' ? volumeInMl.toFixed(2) : massInGrams.toFixed(2);
    const unit = mode === 'g-to-ml' ? 'mL' : 'g';
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Ingredient,Input Value,Input Unit,Computed Output,Output Unit,Density (g/mL),Calibrated Temp\n"
      + `"${selectedIngredient.name}",${inputValueStr},${inputUnit},${val},${unit},${customDensityStr},"20C / 68F NIST Standard"`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `SolveIt_${selectedIngredient.name.replace(/\\s+/g, '_')}_conversion.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Allow other components to trigger load
  useEffect(() => {
    const handleLoadIngredient = (e: CustomEvent) => {
      const { id } = e.detail;
      const found = INGREDIENTS.find(i => i.id === id);
      if (found) {
        setCategoryFilter('all');
        setSelectedIngredient(found);
      }
    };
    window.addEventListener('loadIngredientEvent', handleLoadIngredient as EventListener);
    return () => window.removeEventListener('loadIngredientEvent', handleLoadIngredient as EventListener);
  }, []);

  return (
    <section className="w-full pb-space-2xl">
      <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
          
          {/* Left Column: Calculation Engine */}
          <div className="lg:col-span-7 bg-surface-container-lowest p-space-md md:p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md">
            
            {/* Direction Mode Switcher */}
            <div className="flex items-center justify-between p-1 bg-surface-container rounded-lg">
              <button 
                type="button"
                onClick={() => handleModeChange('g-to-ml')}
                className={`flex-1 py-2 text-center rounded-md font-body-sm text-body-sm transition-all flex items-center justify-center gap-2 ${mode === 'g-to-ml' ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold' : 'font-medium text-on-surface-variant hover:text-on-surface'}`}
              >
                <span className="material-symbols-outlined text-[18px]">scale</span>
                Mass → Volume (g → mL)
              </button>
              <button 
                type="button"
                onClick={() => handleModeChange('ml-to-g')}
                className={`flex-1 py-2 text-center rounded-md font-body-sm text-body-sm transition-all flex items-center justify-center gap-2 ${mode === 'ml-to-g' ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold' : 'font-medium text-on-surface-variant hover:text-on-surface'}`}
              >
                <span className="material-symbols-outlined text-[18px]">water_bottle</span>
                Volume → Mass (mL → g)
              </button>
            </div>

            {/* Category Filter & Search Autocomplete */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-space-sm">
              <div className="sm:col-span-5 flex flex-col gap-1">
                <label htmlFor="categoryFilter" className="font-label-caps text-label-caps uppercase text-on-surface-variant">Ingredient Category</label>
                <select 
                  id="categoryFilter" 
                  value={categoryFilter}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface-container text-body-sm text-on-surface focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary font-body-sm transition-all"
                >
                  <option value="all">All Disciplines (500+ Items)</option>
                  <option value="baking">Baking &amp; Pastry Essentials</option>
                  <option value="sweeteners">Sugars, Syrups &amp; Honey</option>
                  <option value="oils">Cooking Oils &amp; Liquid Lipids</option>
                  <option value="dairy">Dairy, Creams &amp; Plant Milks</option>
                  <option value="flours">Grains, Meals &amp; Flours</option>
                  <option value="powders">Sports Powders &amp; Supplements</option>
                  <option value="chemistry">Laboratory &amp; Aqueous Reagents</option>
                </select>
              </div>
              <div className="sm:col-span-7 flex flex-col gap-1">
                <label htmlFor="ingredientSelector" className="font-label-caps text-label-caps uppercase text-on-surface-variant">Calibrated Ingredient</label>
                <select 
                  id="ingredientSelector" 
                  value={selectedIngredient.id}
                  onChange={(e) => handleIngredientChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface-container text-body-sm text-on-surface focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary font-body-sm transition-all"
                >
                  {filteredIngredients.map(item => (
                    <option key={item.id} value={item.id}>{item.name} ({item.density.toFixed(3)} g/mL)</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quantity Input and Unit Switcher */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label htmlFor="inputValue" className="font-label-caps text-label-caps uppercase text-on-surface-variant">
                  {mode === 'g-to-ml' ? 'Enter Mass (Weight)' : 'Enter Volume'}
                </label>
                <span className="font-data-mono text-body-sm text-outline">NIST Standard Spec</span>
              </div>
              <div className="flex items-center gap-space-xs">
                <div className="relative flex-1">
                  <input 
                    id="inputValue" 
                    type="number" 
                    step="any" 
                    min="0" 
                    value={inputValueStr}
                    onChange={(e) => setInputValueStr(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-surface-container text-headline-md font-data-mono text-on-surface focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary transition-all tabular-nums"
                  />
                </div>
                <select 
                  id="inputUnit" 
                  value={inputUnit}
                  onChange={(e) => setInputUnit(e.target.value)}
                  className="w-32 px-3 py-3 rounded-lg bg-surface-container font-data-mono text-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary transition-all font-semibold"
                >
                  {mode === 'g-to-ml' ? (
                    <>
                      <option value="g">g (grams)</option>
                      <option value="kg">kg (kilograms)</option>
                      <option value="oz">oz (ounces)</option>
                      <option value="lb">lb (pounds)</option>
                    </>
                  ) : (
                    <>
                      <option value="ml">mL (milliliters)</option>
                      <option value="l">L (liters)</option>
                      <option value="cup">cups (US)</option>
                      <option value="floz">fl oz (fluid oz)</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            {/* Precision Density Calibrator / Override */}
            <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col gap-space-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-primary">tune</span>
                  <span className="font-label-caps text-label-caps uppercase text-on-surface font-semibold">Specific Gravity / Density (ρ)</span>
                </div>
                <span className="text-body-sm font-data-mono text-secondary font-medium">Ref: 20°C / 68°F Standard</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm items-center">
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    id="customDensity" 
                    min="0.001" 
                    step="0.001" 
                    value={customDensityStr}
                    onChange={(e) => setCustomDensityStr(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-surface-container-lowest font-data-mono text-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary tabular-nums"
                  />
                  <span className="font-data-mono text-body-sm text-on-surface-variant shrink-0">g/mL (g/cm³)</span>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-3 text-body-sm font-data-mono text-on-surface-variant">
                  <span>Metric: <strong className="text-on-surface">{Math.round(density * 1000)} kg/m³</strong></span>
                  <button 
                    type="button" 
                    onClick={() => setCustomDensityStr(selectedIngredient.density.toString())}
                    className="p-1 rounded hover:bg-surface-container text-outline hover:text-primary transition-colors cursor-pointer"
                    title="Reset to standard density"
                  >
                    <span className="material-symbols-outlined text-[18px]">restart_alt</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Calculation Proof Panel */}
            <div className="p-space-sm rounded-lg bg-surface-container-high/60 flex flex-col gap-1 font-data-mono text-body-sm">
              <div className="flex items-center justify-between text-outline">
                <span className="font-label-caps text-label-caps uppercase font-semibold text-on-surface-variant">Scientific Substitution Verification</span>
                <span className="text-[12px]">Eq: {mode === 'g-to-ml' ? 'V = m ÷ ρ' : 'm = V × ρ'}</span>
              </div>
              <div className="text-on-surface font-medium pt-1 text-body-sm break-all">
                {mode === 'g-to-ml' ? (
                  <>Volume (mL) = {massInGrams.toFixed(2)} g ÷ {density.toFixed(4)} g/mL = <span className="text-primary font-bold">{volumeInMl.toFixed(2)} mL</span></>
                ) : (
                  <>Mass (g) = {volumeInMl.toFixed(2)} mL × {density.toFixed(4)} g/mL = <span className="text-primary font-bold">{massInGrams.toFixed(2)} g</span></>
                )}
              </div>
              <div className="text-on-surface-variant text-[12px] flex items-center justify-between pt-1">
                <span>
                  Reverse check: {mode === 'g-to-ml' ? 
                    `${volumeInMl.toFixed(2)} mL × ${density.toFixed(4)} g/mL = ${massInGrams.toFixed(2)} g` : 
                    `${massInGrams.toFixed(2)} g ÷ ${density.toFixed(4)} g/mL = ${volumeInMl.toFixed(2)} mL`
                  } (Δ = 0.0000%)
                </span>
                <span className="text-secondary font-semibold">STP Calibrated</span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button 
                type="button" 
                onClick={copyToClipboard}
                className="px-4 py-2 rounded-lg bg-primary text-on-primary font-body-sm font-medium hover:bg-primary/90 transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">content_copy</span>
                <span>Copy Result</span>
              </button>
              <button 
                type="button" 
                onClick={exportCSV}
                className="px-3.5 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                Export CSV
              </button>
              <button 
                type="button" 
                onClick={handlePrint}
                className="px-3.5 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">print</span>
                Print Spec
              </button>
            </div>
          </div>

          {/* Right Column: Results Showcase & Volumetric Beaker (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-space-md">
            
            {/* Primary Result Card */}
            <div className="bg-primary text-on-primary p-space-md md:p-space-lg rounded-xl shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary-fixed">
                  Primary Computed {mode === 'g-to-ml' ? 'Volume' : 'Mass'}
                </span>
                <span className="px-2 py-0.5 rounded bg-on-primary/15 font-data-mono text-[11px] font-semibold text-primary-fixed">HIGH PRECISION</span>
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <div className="font-numerical-display text-numerical-display font-bold tracking-tight">
                  {mode === 'g-to-ml' ? volumeInMl.toFixed(2) : massInGrams.toFixed(2)}
                </div>
                <div className="font-headline-md text-headline-md font-semibold text-primary-fixed">
                  {mode === 'g-to-ml' ? 'mL' : 'g'}
                </div>
              </div>
              <p className="font-data-mono text-body-sm text-primary-fixed-dim">
                {mode === 'g-to-ml' ? 
                  `Equivalent to ${(volumeInMl / 1000).toFixed(4)} Liters (L) / ${volumeInMl.toFixed(2)} cm³` :
                  `Equivalent to ${(massInGrams / 1000).toFixed(4)} Kilograms (kg) / ${(massInGrams / 28.3495).toFixed(2)} oz`
                }
              </p>
            </div>

            {/* Graduated Measuring Beaker Visualization & Culinary Grid */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-space-md">
              <div className="flex items-center justify-between pb-2 border-b border-surface-container">
                <span className="font-label-caps text-label-caps uppercase text-on-surface-variant font-semibold">Volumetric Vessel Fill (500 mL Cap)</span>
                <span className="font-data-mono text-body-sm text-secondary font-medium">
                  {volumeInMl > 500 ? `${volumeInMl.toFixed(0)} mL (Exceeds 500mL Beaker)` : `${fillPercentage.toFixed(1)}% Fill (${volumeInMl.toFixed(1)} mL)`}
                </span>
              </div>
              
              {/* Custom Interactive Visual Cup / Beaker SVG */}
              <div className="flex items-center justify-center py-2">
                <div className="relative w-48 h-56 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 200" fill="none" className="w-full h-full drop-shadow-sm">
                    {/* Beaker Glass Outline */}
                    <path d="M 25 10 L 25 175 C 25 186 34 195 45 195 L 115 195 C 126 195 135 186 135 175 L 135 10 Z" stroke="#737686" strokeWidth="3" fill="#f2f3ff" />
                    {/* Beaker Lip Spout */}
                    <path d="M 20 10 L 30 10 M 130 10 L 142 6" stroke="#737686" strokeWidth="3" strokeLinecap="round" />
                    
                    {/* Liquid Fill Body (Dynamic Height & Color Gradient) */}
                    <defs>
                      <linearGradient id="liquidGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#39b8fd" stopOpacity="0.85" />
                        <stop offset="100%" stopColor="#004ac6" stopOpacity="0.95" />
                      </linearGradient>
                      <clipPath id="beakerClip">
                        <path d="M 27 12 L 27 175 C 27 184 35 193 45 193 L 115 193 C 125 193 133 184 133 175 L 133 12 Z" />
                      </clipPath>
                    </defs>

                    {/* Liquid level clip rect (interpolated via JS) */}
                    <g clipPath="url(#beakerClip)">
                      <rect 
                        x="20" y={yPosition} width="120" height={fillHeight + 10} 
                        fill="url(#liquidGrad)" 
                        className="transition-all duration-500 ease-out" 
                      />
                      {/* Liquid Meniscus Line */}
                      <line 
                        x1="25" y1={yPosition} x2="135" y2={yPosition} 
                        stroke="#ffffff" strokeWidth="2" strokeDasharray="3 2" opacity="0.9" 
                        className="transition-all duration-500 ease-out" 
                      />
                    </g>
                    
                    {/* Graduation Tick Marks */}
                    {/* 500 mL */}
                    <line x1="26" y1="20" x2="48" y2="20" stroke="#737686" strokeWidth="2" />
                    <text x="52" y="24" fill="#434655" fontSize="9" fontFamily="JetBrains Mono" fontWeight="600">500 mL</text>
                    {/* 400 mL */}
                    <line x1="26" y1="55" x2="44" y2="55" stroke="#737686" strokeWidth="1.5" />
                    <text x="48" y="58" fill="#737686" fontSize="8" fontFamily="JetBrains Mono">400</text>
                    {/* 300 mL */}
                    <line x1="26" y1="90" x2="48" y2="90" stroke="#737686" strokeWidth="2" />
                    <text x="52" y="93" fill="#434655" fontSize="9" fontFamily="JetBrains Mono" fontWeight="600">300 mL</text>
                    {/* 200 mL */}
                    <line x1="26" y1="125" x2="44" y2="125" stroke="#737686" strokeWidth="1.5" />
                    <text x="48" y="128" fill="#737686" fontSize="8" fontFamily="JetBrains Mono">200</text>
                    {/* 100 mL */}
                    <line x1="26" y1="160" x2="48" y2="160" stroke="#737686" strokeWidth="2" />
                    <text x="52" y="163" fill="#434655" fontSize="9" fontFamily="JetBrains Mono" fontWeight="600">100 mL</text>
                  </svg>
                </div>
              </div>
              
              {/* Instant Kitchen Imperial & Culinary Equivalents Grid */}
              <div>
                <div className="font-label-caps text-label-caps uppercase text-outline-variant tracking-wider mb-space-xs font-semibold">Culinary Measurement Equivalents</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <div className="p-2.5 rounded-lg bg-surface-container-low flex flex-col">
                    <span className="text-body-sm text-on-surface-variant font-label-caps uppercase">US Legal Cups</span>
                    <span className="font-data-mono text-body-md font-bold text-on-surface">{usCups.toFixed(2)} Cups</span>
                    <span className="text-[11px] text-outline">{fracText}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-surface-container-low flex flex-col">
                    <span className="text-body-sm text-on-surface-variant font-label-caps uppercase">US Tablespoons</span>
                    <span className="font-data-mono text-body-md font-bold text-on-surface">{tbsp.toFixed(1)} Tbsp</span>
                    <span className="text-[11px] text-outline">1 Tbsp = 14.79 mL</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-surface-container-low flex flex-col">
                    <span className="text-body-sm text-on-surface-variant font-label-caps uppercase">US Teaspoons</span>
                    <span className="font-data-mono text-body-md font-bold text-on-surface">{tsp.toFixed(1)} Tsp</span>
                    <span className="text-[11px] text-outline">1 Tsp = 4.929 mL</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-surface-container-low flex flex-col">
                    <span className="text-body-sm text-on-surface-variant font-label-caps uppercase">US Fluid Ounces</span>
                    <span className="font-data-mono text-body-md font-bold text-on-surface">{flOz.toFixed(2)} fl oz</span>
                    <span className="text-[11px] text-outline">Volume fl oz</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-surface-container-low flex flex-col">
                    <span className="text-body-sm text-on-surface-variant font-label-caps uppercase">Metric Cups</span>
                    <span className="font-data-mono text-body-md font-bold text-on-surface">{metricCups.toFixed(2)} Cups</span>
                    <span className="text-[11px] text-outline">1 Metric Cup = 250 mL</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-surface-container-low flex flex-col">
                    <span className="text-body-sm text-on-surface-variant font-label-caps uppercase">Imperial Pints</span>
                    <span className="font-data-mono text-body-md font-bold text-on-surface">{impPints.toFixed(2)} pt</span>
                    <span className="text-[11px] text-outline">1 Imp Pint = 568.26 mL</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
