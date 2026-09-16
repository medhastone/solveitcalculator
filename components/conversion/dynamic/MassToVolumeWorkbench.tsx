'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { INGREDIENTS } from '../../../lib/conversion-data';
import type { ConversionUnit } from '../../../lib/conversion-units';

interface MassToVolumeWorkbenchProps {
  unit: ConversionUnit;
}

export default function MassToVolumeWorkbench({ unit }: MassToVolumeWorkbenchProps) {
  const [mode, setMode] = useState<'g-to-vol' | 'vol-to-g'>('g-to-vol');
  const [inputValueStr, setInputValueStr] = useState<string>('100');
  
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedIngredient, setSelectedIngredient] = useState(INGREDIENTS[0]);
  const [customDensityStr, setCustomDensityStr] = useState<string>(INGREDIENTS[0].density.toString());

  const filteredIngredients = useMemo(() => {
    if (categoryFilter === 'all') return INGREDIENTS;
    return INGREDIENTS.filter(i => i.category === categoryFilter);
  }, [categoryFilter]);

  useEffect(() => {
    const handleLoad = (e: CustomEvent) => {
      const found = INGREDIENTS.find(i => i.id === e.detail.id);
      if (found) {
        setCategoryFilter('all');
        setSelectedIngredient(found);
        setCustomDensityStr(found.density.toString());
        const el = document.getElementById('workbench-anchor');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    };
    window.addEventListener('loadIngredientEvent', handleLoad as EventListener);
    return () => window.removeEventListener('loadIngredientEvent', handleLoad as EventListener);
  }, []);

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

  const rawInput = parseFloat(inputValueStr) || 0;
  const activeDensity = parseFloat(customDensityStr) || selectedIngredient.density;

  // Math
  let targetVolume = 0;
  let targetMass = 0;

  if (mode === 'g-to-vol') {
    targetMass = rawInput;
    // Volume (mL) = mass / density
    const volML = targetMass / activeDensity;
    targetVolume = volML * unit.multiplierFromBase;
  } else {
    targetVolume = rawInput;
    // Volume (mL) = Target Vol / multiplier
    const volML = targetVolume / unit.multiplierFromBase;
    targetMass = volML * activeDensity;
  }

  const outputValue = mode === 'g-to-vol' ? targetVolume : targetMass;
  
  // Dynamic labels
  const leftLabel = mode === 'g-to-vol' ? 'Grams (g)' : `${unit.name} (${unit.symbol})`;
  const rightLabel = mode === 'g-to-vol' ? `${unit.name} (${unit.symbol})` : 'Grams (g)';

  // Rendering
  return (
    <section id="workbench-anchor" className="w-full bg-surface-container-low py-space-xl border-y border-outline-variant/10">
      <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
          
          {/* Settings Panel */}
          <div className="lg:col-span-4 space-y-space-md">
            <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-outline-variant/10">
              <h3 className="font-headline-md text-headline-md font-bold text-on-surface flex items-center gap-2 mb-space-sm">
                <span className="material-symbols-outlined text-primary">scale</span>
                Substance Metrology
              </h3>
              
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <label htmlFor="categoryFilter" className="font-label-caps text-label-caps uppercase text-on-surface-variant">Filter Domain</label>
                  <select 
                    id="categoryFilter" 
                    value={categoryFilter}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-surface-container text-body-sm text-on-surface focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary font-body-sm transition-all"
                  >
                    <option value="all">All Disciplines</option>
                    <option value="baking">Baking &amp; Pastry</option>
                    <option value="sweeteners">Sugars &amp; Syrups</option>
                    <option value="oils">Lipids &amp; Oils</option>
                    <option value="dairy">Dairy &amp; Milks</option>
                    <option value="flours">Grains &amp; Flours</option>
                    <option value="chemistry">Laboratory &amp; Aqueous</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="ingredientSelector" className="font-label-caps text-label-caps uppercase text-on-surface-variant">Calibrated Ingredient</label>
                  <select 
                    id="ingredientSelector" 
                    value={selectedIngredient.id}
                    onChange={(e) => handleIngredientChange(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-surface-container text-body-sm text-on-surface focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary font-body-sm transition-all"
                  >
                    {filteredIngredients.map(item => (
                      <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                  </select>
                </div>

                <div className="pt-2 border-t border-outline-variant/20">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="customDensity" className="font-label-caps text-label-caps uppercase flex justify-between items-center text-on-surface-variant">
                      <span>Specific Gravity / Density (ρ)</span>
                      <span className="text-[10px] text-outline">g/mL</span>
                    </label>
                    <input 
                      id="customDensity"
                      type="number"
                      step="0.001"
                      value={customDensityStr}
                      onChange={(e) => setCustomDensityStr(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-surface-container text-body-sm font-data-mono text-primary font-semibold focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary transition-all"
                    />
                  </div>
                  <p className="text-[12px] text-outline mt-1 font-body-sm">
                    Modify if using non-standard temp (default 20°C).
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Calculator Output */}
          <div className="lg:col-span-8">
            <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/10 overflow-hidden flex flex-col h-full">
              
              <div className="flex items-center p-2 bg-surface-container-low border-b border-surface-container gap-2">
                <button
                  type="button"
                  onClick={() => setMode('g-to-vol')}
                  className={`flex-1 py-2 rounded-xl text-body-sm font-semibold transition-all ${mode === 'g-to-vol' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface hover:bg-surface-container'}`}
                >
                  Grams to {unit.name}
                </button>
                <button
                  type="button"
                  onClick={() => setMode('vol-to-g')}
                  className={`flex-1 py-2 rounded-xl text-body-sm font-semibold transition-all ${mode === 'vol-to-g' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface hover:bg-surface-container'}`}
                >
                  {unit.name} to Grams
                </button>
              </div>

              <div className="p-space-xl flex-1 flex flex-col">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-space-md items-center mb-auto">
                  <div className="flex flex-col gap-2 relative group">
                    <label className="font-label-caps text-label-caps uppercase text-on-surface-variant font-medium">{leftLabel}</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={inputValueStr}
                        onChange={(e) => setInputValueStr(e.target.value)}
                        className="w-full bg-surface-container px-4 py-4 rounded-xl font-data-mono text-[32px] text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="flex justify-center md:pt-6">
                    <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[24px]">arrow_forward</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-label-caps text-label-caps uppercase text-primary font-bold">{rightLabel}</label>
                    <div className="w-full bg-primary-fixed/20 px-4 py-4 rounded-xl font-data-mono text-[32px] text-on-surface border border-primary/20 relative">
                      {outputValue.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 font-label-caps text-primary font-bold">
                        {mode === 'g-to-vol' ? unit.symbol : 'g'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-space-xl pt-space-md border-t border-surface-container text-body-sm font-data-mono text-on-surface-variant flex flex-col gap-1">
                  <div className="flex justify-between">
                    <span>Algorithm proof:</span>
                    <span>
                      {mode === 'g-to-vol' 
                        ? `V = (${rawInput}g ÷ ${activeDensity}g/mL) × ${unit.multiplierFromBase.toExponential(3)}`
                        : `M = (${rawInput}${unit.symbol} ÷ ${unit.multiplierFromBase.toExponential(3)}) × ${activeDensity}g/mL`
                      }
                    </span>
                  </div>
                  <div className="flex justify-between text-outline text-[11px]">
                    <span>Substance ρ:</span>
                    <span>{activeDensity} g/mL</span>
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
