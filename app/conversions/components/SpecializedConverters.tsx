'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { COOKING_INGREDIENTS, CookingIngredient } from '../conversionsData';

export default function SpecializedConverters() {
  const [activeTab, setActiveTab] = useState<'cooking' | 'data' | 'fuel'>('cooking');

  // --- Cooking State ---
  const [cookingIngredientId, setCookingIngredientId] = useState<string>('flour_ap');
  const [cookingMode, setCookingMode] = useState<'mass_to_vol' | 'vol_to_mass'>('mass_to_vol');
  const [cookingInputValue, setCookingInputValue] = useState<number>(250); // e.g. 250 grams
  const [cookingVolUnit, setCookingVolUnit] = useState<'cup' | 'tbsp' | 'tsp' | 'ml'>('cup');

  const selectedIngredient = useMemo<CookingIngredient>(() => {
    return COOKING_INGREDIENTS.find((ing) => ing.id === cookingIngredientId) || COOKING_INGREDIENTS[0];
  }, [cookingIngredientId]);

  // Mass to Volume calculation: Volume (mL) = Mass (g) / density (g/mL)
  const cookingResult = useMemo(() => {
    if (cookingMode === 'mass_to_vol') {
      const ml = cookingInputValue / selectedIngredient.densityGPerMl;
      if (cookingVolUnit === 'ml') return { val: ml.toFixed(1), unit: 'mL' };
      if (cookingVolUnit === 'cup') return { val: (ml / 240).toFixed(2), unit: 'US Legal Cups' };
      if (cookingVolUnit === 'tbsp') return { val: (ml / 15).toFixed(1), unit: 'Tablespoons' };
      if (cookingVolUnit === 'tsp') return { val: (ml / 5).toFixed(1), unit: 'Teaspoons' };
    } else {
      // Volume to Mass: Mass (g) = Volume (mL) * density
      let ml = cookingInputValue;
      if (cookingVolUnit === 'cup') ml = cookingInputValue * 240;
      if (cookingVolUnit === 'tbsp') ml = cookingInputValue * 15;
      if (cookingVolUnit === 'tsp') ml = cookingInputValue * 5;
      const grams = ml * selectedIngredient.densityGPerMl;
      const ounces = grams / 28.3495;
      return { val: `${grams.toFixed(1)} g (${ounces.toFixed(2)} oz)`, unit: 'Weight' };
    }
    return { val: '0', unit: '' };
  }, [cookingMode, cookingInputValue, selectedIngredient, cookingVolUnit]);

  // --- Data Storage State ---
  const [dataInput, setDataInput] = useState<number>(1000);
  const [dataStandard, setDataStandard] = useState<'decimal' | 'binary'>('decimal'); // decimal (GB) or binary (GiB)
  const [dataUnit, setDataUnit] = useState<'GB' | 'TB' | 'MB'>('GB');

  const dataConversions = useMemo(() => {
    let bytes = 0;
    if (dataStandard === 'decimal') {
      if (dataUnit === 'MB') bytes = dataInput * 1e6;
      if (dataUnit === 'GB') bytes = dataInput * 1e9;
      if (dataUnit === 'TB') bytes = dataInput * 1e12;
    } else {
      if (dataUnit === 'MB') bytes = dataInput * 1048576;
      if (dataUnit === 'GB') bytes = dataInput * 1073741824;
      if (dataUnit === 'TB') bytes = dataInput * 1099511627776;
    }

    return {
      bytes: bytes.toLocaleString(),
      decimalKB: (bytes / 1e3).toLocaleString(undefined, { maximumFractionDigits: 2 }) + ' KB',
      decimalMB: (bytes / 1e6).toLocaleString(undefined, { maximumFractionDigits: 2 }) + ' MB',
      decimalGB: (bytes / 1e9).toLocaleString(undefined, { maximumFractionDigits: 3 }) + ' GB',
      decimalTB: (bytes / 1e12).toLocaleString(undefined, { maximumFractionDigits: 4 }) + ' TB',
      binaryKiB: (bytes / 1024).toLocaleString(undefined, { maximumFractionDigits: 2 }) + ' KiB',
      binaryMiB: (bytes / 1048576).toLocaleString(undefined, { maximumFractionDigits: 2 }) + ' MiB',
      binaryGiB: (bytes / 1073741824).toLocaleString(undefined, { maximumFractionDigits: 3 }) + ' GiB',
      binaryTiB: (bytes / 1099511627776).toLocaleString(undefined, { maximumFractionDigits: 4 }) + ' TiB',
    };
  }, [dataInput, dataStandard, dataUnit]);

  // --- Fuel Economy State ---
  const [fuelMpgUS, setFuelMpgUS] = useState<number>(30);
  const fuelResults = useMemo(() => {
    if (fuelMpgUS <= 0) return { l100km: '0', mpgUK: '0', kml: '0' };
    const l100km = 235.215 / fuelMpgUS;
    const mpgUK = fuelMpgUS * 1.20095;
    const kml = fuelMpgUS * 0.425144;
    return {
      l100km: l100km.toFixed(2),
      mpgUK: mpgUK.toFixed(2),
      kml: kml.toFixed(2),
    };
  }, [fuelMpgUS]);

  return (
    <section className="w-full py-14 px-4 sm:px-6 lg:px-8 bg-surface">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs uppercase font-bold tracking-wider text-primary">
            Everyday Helpers
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
            Helpful Everyday Converters
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant">
            Easy interactive tools for conversions that need a little extra care: kitchen cooking amounts, phone &amp; computer storage, and car fuel economy.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex justify-center gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('cooking')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'cooking'
                ? 'bg-primary text-white shadow-xs'
                : 'bg-surface-container border border-outline-variant/30 text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-lg">soup_kitchen</span>
            <span>Kitchen Cooking (Grams ↔ Cups)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('data')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'data'
                ? 'bg-primary text-white shadow-xs'
                : 'bg-surface-container border border-outline-variant/30 text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-lg">sd_storage</span>
            <span>Drive Space (GB vs. GiB)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('fuel')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'fuel'
                ? 'bg-primary text-white shadow-xs'
                : 'bg-surface-container border border-outline-variant/30 text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-lg">local_gas_station</span>
            <span>Car Fuel Mileage (MPG ↔ L/100km)</span>
          </button>
        </div>

        {/* 1. COOKING & KITCHEN CONVERTER */}
        {activeTab === 'cooking' && (
          <div className="p-6 sm:p-8 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-md space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-lg sm:text-xl font-bold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">cookie</span>
                  <span>Kitchen Recipe &amp; Ingredient Converter</span>
                </h3>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                  Ingredient Aware
                </span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Converting kitchen weight (grams) into volume (cups or spoons) depends on what you are measuring. For example, 1 cup of honey weighs around 340 grams, while 1 cup of light flour weighs only about 127 grams.
              </p>
            </div>

            {/* Mass vs Volume Warning Notice */}
            <div className="p-4 rounded-xl bg-surface border border-outline-variant/20 flex items-start gap-3">
              <span className="material-symbols-outlined text-amber-500 text-xl shrink-0 mt-0.5">
                info
              </span>
              <div className="text-xs text-on-surface-variant leading-relaxed">
                <span className="font-bold text-on-surface">Kitchen Tip: </span>
                Different foods have different weights in the same cup. Pick your ingredient below to get the exact weight or volume for your recipe.
              </div>
            </div>

            {/* Interactive Cooking Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-on-surface uppercase tracking-wider block mb-1.5">
                  Ingredient
                </label>
                <select
                  value={cookingIngredientId}
                  onChange={(e) => setCookingIngredientId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-outline-variant/40 bg-surface text-on-surface text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {COOKING_INGREDIENTS.map((ing) => (
                    <option key={ing.id} value={ing.id}>
                      {ing.name} (~{ing.densityGPerMl} g/mL)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-on-surface uppercase tracking-wider block mb-1.5">
                  Direction
                </label>
                <select
                  value={cookingMode}
                  onChange={(e) => setCookingMode(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl border border-outline-variant/40 bg-surface text-on-surface text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="mass_to_vol">Weighed Grams → Volume Measure</option>
                  <option value="vol_to_mass">Volume Measure → Weighed Grams</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-on-surface uppercase tracking-wider block mb-1.5">
                  Target / Source Unit
                </label>
                <select
                  value={cookingVolUnit}
                  onChange={(e) => setCookingVolUnit(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl border border-outline-variant/40 bg-surface text-on-surface text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="cup">US Legal Cup (240 mL)</option>
                  <option value="tbsp">Tablespoon (15 mL)</option>
                  <option value="tsp">Teaspoon (5 mL)</option>
                  <option value="ml">Milliliters (mL)</option>
                </select>
              </div>
            </div>

            {/* Input & Output */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-2">
              <div className="p-4 rounded-xl bg-surface border border-outline-variant/20 space-y-1">
                <span className="text-[11px] font-semibold text-on-surface-variant uppercase">
                  {cookingMode === 'mass_to_vol' ? 'Mass Input (Grams)' : `Volume Input (${cookingVolUnit})`}
                </span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={cookingInputValue}
                  onChange={(e) => setCookingInputValue(parseFloat(e.target.value) || 0)}
                  className="w-full text-xl font-bold bg-transparent text-on-surface focus:outline-none"
                />
              </div>

              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-1">
                <span className="text-[11px] font-semibold text-primary uppercase">
                  Calculated Equivalent
                </span>
                <div className="text-xl font-extrabold text-primary">
                  {cookingResult.val} {cookingResult.unit}
                </div>
                <div className="text-[11px] text-on-surface-variant font-mono">
                  Density: {selectedIngredient.densityGPerMl} g/mL (1 cup ≈ {selectedIngredient.cupWeightG} g)
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Link
                href="/cooking-converter"
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                <span>Full Recipe &amp; Baking Calculator</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
        )}

        {/* 2. DATA STORAGE CONVERTER */}
        {activeTab === 'data' && (
          <div className="p-6 sm:p-8 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-md space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-lg sm:text-xl font-bold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">storage</span>
                  <span>MB vs MiB &amp; Decimal vs Binary Storage</span>
                </h3>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20">
                  SI (1000) vs IEC (1024)
                </span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Decimal prefixes (KB, MB, GB) use powers of 10 (10³, 10⁶, 10⁹). Binary prefixes (KiB, MiB, GiB) use powers of 2 (2¹⁰, 2²⁰, 2³⁰). Operating systems often display GiB but write &quot;GB&quot;.
              </p>
            </div>

            {/* Input Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-on-surface uppercase tracking-wider block mb-1.5">
                  Input Value
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={dataInput}
                  onChange={(e) => setDataInput(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2.5 rounded-xl border border-outline-variant/40 bg-surface text-on-surface text-base font-bold focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-on-surface uppercase tracking-wider block mb-1.5">
                  Prefix System
                </label>
                <select
                  value={dataStandard}
                  onChange={(e) => setDataStandard(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl border border-outline-variant/40 bg-surface text-on-surface text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="decimal">SI Decimal (powers of 10: 1000)</option>
                  <option value="binary">IEC Binary (powers of 2: 1024)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-on-surface uppercase tracking-wider block mb-1.5">
                  Magnitude Unit
                </label>
                <select
                  value={dataUnit}
                  onChange={(e) => setDataUnit(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl border border-outline-variant/40 bg-surface text-on-surface text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="MB">{dataStandard === 'decimal' ? 'MB (Megabyte)' : 'MiB (Mebibyte)'}</option>
                  <option value="GB">{dataStandard === 'decimal' ? 'GB (Gigabyte)' : 'GiB (Gibibyte)'}</option>
                  <option value="TB">{dataStandard === 'decimal' ? 'TB (Terabyte)' : 'TiB (Tebibyte)'}</option>
                </select>
              </div>
            </div>

            {/* Comparison Side-by-Side Table */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-surface border border-outline-variant/20 space-y-2">
                <div className="text-xs font-bold text-primary uppercase tracking-wider flex items-center justify-between">
                  <span>Decimal Representation (SI)</span>
                  <span className="text-[10px] font-mono text-on-surface-variant">Base 10</span>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between py-1 border-b border-outline-variant/10">
                    <span className="text-on-surface-variant">Kilobytes (KB):</span>
                    <span className="font-mono font-bold text-on-surface">{dataConversions.decimalKB}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-outline-variant/10">
                    <span className="text-on-surface-variant">Megabytes (MB):</span>
                    <span className="font-mono font-bold text-on-surface">{dataConversions.decimalMB}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-outline-variant/10">
                    <span className="text-on-surface-variant">Gigabytes (GB):</span>
                    <span className="font-mono font-bold text-on-surface">{dataConversions.decimalGB}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-on-surface-variant">Terabytes (TB):</span>
                    <span className="font-mono font-bold text-on-surface">{dataConversions.decimalTB}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-surface border border-outline-variant/20 space-y-2">
                <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Binary Representation (IEC)</span>
                  <span className="text-[10px] font-mono text-on-surface-variant">Base 2</span>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between py-1 border-b border-outline-variant/10">
                    <span className="text-on-surface-variant">Kibibytes (KiB):</span>
                    <span className="font-mono font-bold text-on-surface">{dataConversions.binaryKiB}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-outline-variant/10">
                    <span className="text-on-surface-variant">Mebibytes (MiB):</span>
                    <span className="font-mono font-bold text-on-surface">{dataConversions.binaryMiB}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-outline-variant/10">
                    <span className="text-on-surface-variant">Gibibytes (GiB):</span>
                    <span className="font-mono font-bold text-on-surface">{dataConversions.binaryGiB}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-on-surface-variant">Tebibytes (TiB):</span>
                    <span className="font-mono font-bold text-on-surface">{dataConversions.binaryTiB}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-on-surface-variant italic">
              Total Raw Bytes: <span className="font-mono font-bold text-on-surface">{dataConversions.bytes}</span> bytes.
            </div>

            <div className="pt-2 flex justify-end">
              <Link
                href="/data-storage-converter"
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                <span>Full Data Storage Calculator</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
        )}

        {/* 3. FUEL ECONOMY CONVERTER */}
        {activeTab === 'fuel' && (
          <div className="p-6 sm:p-8 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-md space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-lg sm:text-xl font-bold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">local_gas_station</span>
                  <span>Fuel Economy Conversion</span>
                </h3>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-500/20">
                  Reciprocal Math Formula
                </span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Fuel economy equations are inverse: MPG measures distance per volume of fuel (higher is better), whereas L/100 km measures volume per distance (lower is better). US and Imperial MPG are also distinct units.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div className="p-5 rounded-xl bg-surface border border-outline-variant/20 space-y-2">
                <label className="text-xs font-bold text-on-surface uppercase tracking-wider block">
                  US Fuel Economy (MPG)
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.1"
                  value={fuelMpgUS}
                  onChange={(e) => setFuelMpgUS(parseFloat(e.target.value) || 1)}
                  className="w-full text-2xl font-extrabold bg-transparent text-primary focus:outline-none"
                />
                <div className="text-[11px] text-on-surface-variant font-mono">
                  Formula: L/100 km = 235.215 / US MPG
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="p-3.5 rounded-xl bg-surface border border-outline-variant/20 flex justify-between items-center">
                  <span className="text-xs font-semibold text-on-surface-variant">Metric Consumption:</span>
                  <span className="text-base font-extrabold text-on-surface font-mono">
                    {fuelResults.l100km} L/100 km
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-surface border border-outline-variant/20 flex justify-between items-center">
                  <span className="text-xs font-semibold text-on-surface-variant">British Imperial MPG:</span>
                  <span className="text-base font-extrabold text-on-surface font-mono">
                    {fuelResults.mpgUK} UK MPG
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-surface border border-outline-variant/20 flex justify-between items-center">
                  <span className="text-xs font-semibold text-on-surface-variant">Kilometers per Liter:</span>
                  <span className="text-base font-extrabold text-on-surface font-mono">
                    {fuelResults.kml} km/L
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Link
                href="/fuel-economy-converter"
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                <span>Full Fuel Economy Calculator</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
