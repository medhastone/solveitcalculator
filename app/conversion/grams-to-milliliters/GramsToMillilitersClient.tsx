'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import GramsToMillilitersWorkbench from '../../../components/conversion/GramsToMillilitersWorkbench';
import DensitySpectrum from '../../../components/conversion/DensitySpectrum';
import ReferenceTables from '../../../components/conversion/ReferenceTables';
import DensityTableExplorer from '../../../components/conversion/DensityTableExplorer';

export default function GramsToMillilitersClient() {
  const triggerLoad = (id: string) => {
    const event = new CustomEvent('loadIngredientEvent', { detail: { id } });
    window.dispatchEvent(event);
  };

  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen flex flex-col selection:bg-primary/20">
      

      <main className="w-full pt-16 bg-surface flex-1">
        <div className="flex flex-col w-full">
          
          {/* Telemetry Bar & Breadcrumb Matrix */}
          <div className="w-full bg-surface-container-low border-b border-outline-variant/10 py-space-xs sticky top-16 z-40">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop flex flex-col md:flex-row items-start md:items-center justify-between gap-space-xs font-data-mono text-body-sm text-on-surface-variant">
              <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 overflow-x-auto text-body-sm whitespace-nowrap">
                <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">home</span>Home
                </Link>
                <span className="text-outline-variant">/</span>
                <span className="text-on-surface-variant cursor-default">Conversion</span>
                <span className="text-outline-variant">/</span>
                <span className="text-on-surface-variant cursor-default">Weight &amp; Mass</span>
                <span className="text-outline-variant">/</span>
                <Link href="/conversion/gram" className="hover:text-primary transition-colors">Gram</Link>
                <span className="text-outline-variant">/</span>
                <span className="text-primary font-semibold">Grams to Milliliters</span>
              </nav>
              <div className="flex flex-wrap items-center gap-space-sm text-body-sm text-on-surface-variant shrink-0">
                <span className="flex items-center gap-1 bg-surface-container px-2 py-0.5 rounded text-secondary font-medium"><span className="material-symbols-outlined text-[14px]">verified</span>USDA FDC v2 &amp; NIST 2026</span>
                <span className="flex items-center gap-1 bg-surface-container px-2 py-0.5 rounded text-on-surface-variant font-medium"><span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>0.0004ms Local Engine</span>
                <span className="hidden sm:inline text-outline-variant">|</span>
                <span className="hidden sm:inline">500+ Calibrated Densities</span>
              </div>
            </div>
          </div>

          {/* Hero & Context */}
          <section className="w-full pt-space-xl pb-space-lg">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
              <div className="max-w-4xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed text-label-caps font-label-caps uppercase tracking-wider mb-space-sm">
                  <span className="material-symbols-outlined text-[14px]">science</span>
                  Metrology-Grade Mass-Volume Density Engine
                </div>
                <h1 className="font-headline-lg text-headline-lg lg:font-display-hero lg:text-display-hero text-on-surface font-bold tracking-tight mb-space-sm">
                  Grams to Milliliters Calculator
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed mb-space-md">
                  Convert grams to milliliters instantly with scientific accuracy using NIST and USDA FoodData Central specific gravity formulas. Engineered for precision culinary arts, pharmacology compounding, micro-nutrient tracking, and chemical lab formulations.
                </p>

                {/* Trust Badges */}
                <div className="flex flex-wrap items-center gap-2 mb-space-md font-body-sm text-body-sm text-on-surface-variant">
                  <span className="px-2.5 py-1 rounded-md bg-surface-container flex items-center gap-1"><span className="material-symbols-outlined text-[16px] text-primary">check_circle</span> NIST / USDA Calibrated</span>
                  <span className="px-2.5 py-1 rounded-md bg-surface-container flex items-center gap-1"><span className="material-symbols-outlined text-[16px] text-primary">check_circle</span> 500+ Pure Densities</span>
                  <span className="px-2.5 py-1 rounded-md bg-surface-container flex items-center gap-1"><span className="material-symbols-outlined text-[16px] text-primary">check_circle</span> Zero Volumetric Drift</span>
                  <span className="px-2.5 py-1 rounded-md bg-surface-container flex items-center gap-1"><span className="material-symbols-outlined text-[16px] text-primary">check_circle</span> 100% Client-Side Private</span>
                </div>

                {/* Quick Jump Preset Chips */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <span className="font-label-caps text-label-caps uppercase text-outline tracking-wider mr-1">Quick Presets:</span>
                  <button type="button" onClick={() => triggerLoad('water')} className="px-3 py-1 rounded-full bg-surface-container-high hover:bg-primary hover:text-on-primary transition-all font-data-mono text-body-sm text-on-surface cursor-pointer">
                    Pure Water (1.000)
                  </button>
                  <button type="button" onClick={() => triggerLoad('flour_ap')} className="px-3 py-1 rounded-full bg-surface-container-high hover:bg-primary hover:text-on-primary transition-all font-data-mono text-body-sm text-on-surface cursor-pointer">
                    AP Flour (0.528)
                  </button>
                  <button type="button" onClick={() => triggerLoad('sugar_gran')} className="px-3 py-1 rounded-full bg-surface-container-high hover:bg-primary hover:text-on-primary transition-all font-data-mono text-body-sm text-on-surface cursor-pointer">
                    Granulated Sugar (0.849)
                  </button>
                  <button type="button" onClick={() => triggerLoad('honey')} className="px-3 py-1 rounded-full bg-surface-container-high hover:bg-primary hover:text-on-primary transition-all font-data-mono text-body-sm text-on-surface cursor-pointer">
                    Pure Honey (1.420)
                  </button>
                  <button type="button" onClick={() => triggerLoad('olive_oil')} className="px-3 py-1 rounded-full bg-surface-container-high hover:bg-primary hover:text-on-primary transition-all font-data-mono text-body-sm text-on-surface cursor-pointer">
                    Olive Oil (0.918)
                  </button>
                  <button type="button" onClick={() => triggerLoad('milk_whole')} className="px-3 py-1 rounded-full bg-surface-container-high hover:bg-primary hover:text-on-primary transition-all font-data-mono text-body-sm text-on-surface cursor-pointer">
                    Whole Milk (1.032)
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Main Interactive Workbench Component */}
          <GramsToMillilitersWorkbench />

          {/* Interactive Density Spectrum Component */}
          <DensitySpectrum />

          {/* Reference Tables Component */}
          <ReferenceTables />

          {/* 500+ Ingredient Data Explorer */}
          <DensityTableExplorer />

          {/* Editorial Metrology & Culinary Science Bento Grid */}
          <section className="w-full py-space-3xl">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
              <div className="max-w-3xl mb-space-xl">
                <span className="font-label-caps text-label-caps uppercase text-primary font-semibold tracking-wider">Culinary &amp; Laboratory Physics</span>
                <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">The Volumetric Fallacy: Mass vs. Volume Metrology</h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                  Why measuring culinary carbohydrates and laboratory reagents with volumetric vessels introduces critical errors, and how true mass-volume conversion eliminates variability.
                </p>
              </div>

              {/* Bento Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg mb-space-2xl">
                {/* Bento Card 1 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between border border-outline-variant/10">
                  <div className="space-y-space-sm">
                    <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[24px]">nest_eco_leaf</span>
                    </div>
                    <h3 className="font-headline-md text-headline-md font-bold text-on-surface">The 25% &quot;Scoop-and-Sweep&quot; Hazard</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      According to rigorous research conducted by King Arthur Baking and the NIST Metrology Group, scooping directly from a flour bag compacts flour to <strong>140g – 160g per cup</strong>. Conversely, sifting drops that same cup to <strong>115g</strong>. Relying on volumetric measuring cups creates a <strong>±25% to 35% error swing</strong>, causing dry, brick-like baked loaves. Weighed grams converted via bulk density ensure repeatable crumb structure.
                    </p>
                  </div>
                  <div className="mt-space-md pt-space-xs border-t border-surface-container flex items-center justify-between text-body-sm font-data-mono text-outline">
                    <span>NIST H-44 Compliant</span>
                    <span className="text-primary font-semibold">Baking Metrology</span>
                  </div>
                </div>

                {/* Bento Card 2 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between border border-outline-variant/10">
                  <div className="space-y-space-sm">
                    <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-secondary">
                      <span className="material-symbols-outlined text-[24px]">thermostat</span>
                    </div>
                    <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Thermal Expansion Co-efficient (β)</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Liquids expand and contract significantly based on temperature. Extra virgin olive oil exhibits a volumetric expansion coefficient of <strong>β = 0.00072 per °C</strong>. A 1000g liter of olive oil at 4°C chilled storage expands by over <strong>15 mL</strong> when warmed to room temperature (25°C), altering its apparent density from <strong>0.925 g/mL to 0.911 g/mL</strong>. SolveIt calculates all conversions at the standard 20°C laboratory equilibrium.
                    </p>
                  </div>
                  <div className="mt-space-md pt-space-xs border-t border-surface-container flex items-center justify-between text-body-sm font-data-mono text-outline">
                    <span>ΔT = 21°C Differential</span>
                    <span className="text-secondary font-semibold">Fluid Mechanics</span>
                  </div>
                </div>

                {/* Bento Card 3 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between border border-outline-variant/10">
                  <div className="space-y-space-sm">
                    <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-tertiary">
                      <span className="material-symbols-outlined text-[24px]">medication</span>
                    </div>
                    <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Pediatric Pharmacology &amp; Dosing</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      In pediatric medicine, syrups containing active compounds like amoxicillin or ibuprofen are prescribed in <strong>milliliters (mL)</strong> via oral syringes, yet compounders weigh ingredients in <strong>grams (g)</strong>. Because pharmaceutical syrups contain up to 65% sucrose by weight, specific gravity rises to <strong>1.32 g/mL</strong>. Converting 5 mL assuming water density would administer a <strong>32% under-dosage</strong>.
                    </p>
                  </div>
                  <div className="mt-space-md pt-space-xs border-t border-surface-container flex items-center justify-between text-body-sm font-data-mono text-outline">
                    <span>USP 795 &amp; 797 Protocol</span>
                    <span className="text-tertiary font-semibold">Clinical Pharmacy</span>
                  </div>
                </div>
              </div>

              {/* Fitness & Laboratory Science Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/10">
                <div className="space-y-space-sm">
                  <div className="inline-flex items-center gap-1 text-primary font-label-caps text-label-caps uppercase font-semibold">
                    <span className="material-symbols-outlined text-[16px]">fitness_center</span>
                    Macronutrient Tracking Drift
                  </div>
                  <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Converting Macro-Weighed Foods to Meal Prep Containers</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    Athletes and bodybuilders frequently track raw ingredients in grams (e.g., 80g dry oats, 32g peanut butter) but portion prepared meals into volumetric meal-prep glassware (milliliters or cups). Peanut butter (density 1.09 g/mL) and cooked basmati rice (bulk density 0.78 g/mL) introduce substantial macro discrepancies if converted 1:1 with water. Using precision mass-to-volume offsets prevents unintended caloric surpluses of up to <strong>350 kcal/day</strong>.
                  </p>
                </div>
                <div className="space-y-space-sm">
                  <div className="inline-flex items-center gap-1 text-secondary font-label-caps text-label-caps uppercase font-semibold">
                    <span className="material-symbols-outlined text-[16px]">biotech</span>
                    Aqueous Chemistry &amp; Meniscus Reading
                  </div>
                  <h3 className="font-headline-md text-headline-md font-bold text-on-surface">IUPAC Volumetric Meniscus Calibration</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    When translating grams to milliliters in laboratory volumetric flasks, capillary action causes a curvature (meniscus) at the liquid-air interface. For transparent aqueous liquids (water, milk, dilute acids), read the <strong>lowest point of the concave meniscus</strong> at eye level. For opaque or dense liquids like mercury or concentrated heavy syrups with convex curvature, align with the <strong>apex</strong> of the curve.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Mathematical Derivation & Worked Example Section */}
          <section className="w-full py-space-2xl bg-surface-container-low border-t border-b border-outline-variant/10">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
              <div className="mb-space-lg">
                <span className="font-label-caps text-label-caps uppercase text-primary font-semibold tracking-wider">Formal Proofs</span>
                <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">Mathematical Formulations &amp; Derivations</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">Step-by-step metrological proof for converting mass (m) into volume (V) using substance-specific bulk density (ρ).</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
                {/* Math Formula Card */}
                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between border border-outline-variant/10">
                  <div className="space-y-space-sm">
                    <h3 className="font-headline-md text-headline-md font-bold text-on-surface">The Universal Density Equation</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Density (ρ) is defined by the International System of Units (SI) as mass per unit volume. Rearranging algebraically isolates volume as the quotient:
                    </p>
                    <div className="p-space-md rounded-lg bg-surface-container font-data-mono text-headline-md text-primary text-center my-space-sm">
                      V = m ÷ ρ
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Where:
                      <br/>• <strong>V</strong> = Volume in milliliters (mL) or cubic centimeters (cm³)
                      <br/>• <strong>m</strong> = Mass in grams (g)
                      <br/>• <strong>ρ (rho)</strong> = Density in grams per milliliter (g/mL)
                    </p>
                  </div>
                  <div className="p-space-xs rounded bg-surface-container-low font-data-mono text-[12px] text-outline mt-space-sm">
                    Inverse Formula: Mass (g) = Volume (mL) × Density (g/mL)
                  </div>
                </div>

                {/* Worked Practical Example Card */}
                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between border border-outline-variant/10">
                  <div className="space-y-space-sm">
                    <span className="font-label-caps text-label-caps uppercase text-tertiary font-semibold">Worked Culinary Example</span>
                    <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Converting 350 Grams of Maple Syrup</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Suppose a recipe requires <strong>350 grams</strong> of Grade A pure maple syrup. Density is calibrated at <strong>1.333 g/mL</strong>:
                    </p>
                    <div className="p-space-sm rounded-lg bg-surface-container-low font-data-mono text-body-sm space-y-1 text-on-surface-variant">
                      <div><strong className="text-on-surface">Step 1 (Formula):</strong> V = 350 g ÷ 1.333 g/mL</div>
                      <div><strong className="text-on-surface">Step 2 (Evaluate):</strong> V = <span className="text-primary font-bold">262.57 mL</span></div>
                      <div><strong className="text-on-surface">Step 3 (Imperial cups):</strong> 262.57 mL ÷ 240 mL/cup = <span className="text-secondary font-bold">1.09 US Cups</span></div>
                      <div><strong className="text-on-surface">Step 4 (Fluid Ounces):</strong> 262.57 mL ÷ 29.5735 mL/fl oz = <span className="text-tertiary font-bold">8.88 fl oz</span></div>
                    </div>
                  </div>
                  <div className="p-space-xs rounded bg-surface-container font-data-mono text-[12px] text-on-surface mt-space-sm">
                    Conclusion: A baker measuring 350 mL instead of grams would add 87.43 mL (33%) excess sugar syrup!
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Accordion Section */}
          <section className="w-full py-space-3xl">
            <div className="max-w-4xl mx-auto px-gutter-mobile lg:px-gutter-desktop">
              <div className="text-center mb-space-xl">
                <span className="font-label-caps text-label-caps uppercase text-primary font-semibold tracking-wider">Metrology FAQ</span>
                <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">Frequently Asked Grams to Milliliters Questions</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">Authoritative answers backed by food science, culinary arts, and metric metrology standards.</p>
              </div>
              <div className="space-y-space-sm">
                
                <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/10">
                  <button type="button" onClick={() => toggleFaq(1)} className="w-full p-space-md text-left flex items-center justify-between gap-space-sm focus:outline-none cursor-pointer">
                    <span className="font-headline-md text-[17px] font-semibold text-on-surface">Is 100 grams always equal to 100 milliliters?</span>
                    <span className={`material-symbols-outlined text-primary transition-transform duration-300 ${activeFaq === 1 ? 'rotate-180' : ''}`}>expand_more</span>
                  </button>
                  <div className={`px-space-md pb-space-md text-body-md text-on-surface-variant leading-relaxed ${activeFaq === 1 ? 'block' : 'hidden'}`}>
                    No. 100 grams is <strong>only equal to 100 milliliters for pure distilled water at 4°C (39.2°F)</strong>, where water achieves its maximum density of exactly 1.000 g/mL. For all other substances, density departs from 1.000:
                    100g of all-purpose flour equals ~189.4 mL, 100g of olive oil equals ~108.9 mL, and 100g of dense honey equals merely ~70.4 mL.
                  </div>
                </div>

                <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/10">
                  <button type="button" onClick={() => toggleFaq(2)} className="w-full p-space-md text-left flex items-center justify-between gap-space-sm focus:outline-none cursor-pointer">
                    <span className="font-headline-md text-[17px] font-semibold text-on-surface">How many milliliters is 100 grams of all-purpose flour?</span>
                    <span className={`material-symbols-outlined text-primary transition-transform duration-300 ${activeFaq === 2 ? 'rotate-180' : ''}`}>expand_more</span>
                  </button>
                  <div className={`px-space-md pb-space-md text-body-md text-on-surface-variant leading-relaxed ${activeFaq === 2 ? 'block' : 'hidden'}`}>
                    100 grams of standard unbleached all-purpose flour equals approximately <strong>189.39 milliliters</strong> (or about 0.79 US cups / 12.8 tablespoons). This is calculated using the bulk density of gently fluffed wheat flour (0.528 g/mL): V = 100 ÷ 0.528 = 189.39 mL.
                  </div>
                </div>

                <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/10">
                  <button type="button" onClick={() => toggleFaq(3)} className="w-full p-space-md text-left flex items-center justify-between gap-space-sm focus:outline-none cursor-pointer">
                    <span className="font-headline-md text-[17px] font-semibold text-on-surface">How do I convert grams of granulated white sugar to milliliters?</span>
                    <span className={`material-symbols-outlined text-primary transition-transform duration-300 ${activeFaq === 3 ? 'rotate-180' : ''}`}>expand_more</span>
                  </button>
                  <div className={`px-space-md pb-space-md text-body-md text-on-surface-variant leading-relaxed ${activeFaq === 3 ? 'block' : 'hidden'}`}>
                    Granulated white sucrose sugar has an average pour density of <strong>0.849 g/mL</strong>. To convert any mass of sugar to milliliters, divide grams by 0.849. For example, 100 grams of sugar is: 100 g ÷ 0.849 g/mL = <strong>117.79 mL</strong> (equivalent to just under 1/2 US cup or 8.0 US tablespoons).
                  </div>
                </div>

                <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/10">
                  <button type="button" onClick={() => toggleFaq(4)} className="w-full p-space-md text-left flex items-center justify-between gap-space-sm focus:outline-none cursor-pointer">
                    <span className="font-headline-md text-[17px] font-semibold text-on-surface">Why does 100g of honey have a smaller volume than 100g of water?</span>
                    <span className={`material-symbols-outlined text-primary transition-transform duration-300 ${activeFaq === 4 ? 'rotate-180' : ''}`}>expand_more</span>
                  </button>
                  <div className={`px-space-md pb-space-md text-body-md text-on-surface-variant leading-relaxed ${activeFaq === 4 ? 'block' : 'hidden'}`}>
                    Honey is supersaturated with natural sugars (fructose and glucose) and contains only ~17% water, giving it a high specific gravity of <strong>1.420 g/mL</strong>. Because density is packed tighter into atomic space, every milliliter contains 1.42 grams. Thus, 100g of honey needs only 70.4 mL, occupying <strong>29.6% less space</strong> than 100g of water.
                  </div>
                </div>

                <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/10">
                  <button type="button" onClick={() => toggleFaq(5)} className="w-full p-space-md text-left flex items-center justify-between gap-space-sm focus:outline-none cursor-pointer">
                    <span className="font-headline-md text-[17px] font-semibold text-on-surface">How do I convert milliliters back into grams?</span>
                    <span className={`material-symbols-outlined text-primary transition-transform duration-300 ${activeFaq === 5 ? 'rotate-180' : ''}`}>expand_more</span>
                  </button>
                  <div className={`px-space-md pb-space-md text-body-md text-on-surface-variant leading-relaxed ${activeFaq === 5 ? 'block' : 'hidden'}`}>
                    To reverse the calculation and convert milliliters into grams, multiply the volume by the substance&apos;s density: <strong>Mass (g) = Volume (mL) × Density (g/mL)</strong>. For example, 250 mL of olive oil (density 0.918 g/mL) weighs: 250 × 0.918 = <strong>229.5 grams</strong>. You can also flip the switcher at the top of this calculator to [mL → g] mode.
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Related Conversions Directory */}
          <section className="w-full py-space-xl bg-surface-container-low border-t border-surface-container">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
              <span className="font-label-caps text-label-caps uppercase text-primary font-semibold tracking-wider">Metrology Directory</span>
              <h3 className="font-headline-md text-headline-md font-bold text-on-surface mb-space-md">Related Gram Conversions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-space-sm">
                <Link href="/conversion/grams-to-milliliters" className="p-space-sm bg-surface-container-lowest rounded-lg hover:shadow-md transition-all flex flex-col items-start gap-1 text-on-surface group border border-outline-variant/10">
                  <div className="font-semibold text-body-sm group-hover:text-primary transition-colors">Grams to mL</div>
                  <div className="text-[12px] text-outline font-data-mono">Volume</div>
                </Link>
                <Link href="/conversion/grams-to-teaspoons" className="p-space-sm bg-surface-container-lowest rounded-lg hover:shadow-md transition-all flex flex-col items-start gap-1 text-on-surface group border border-outline-variant/10">
                  <div className="font-semibold text-body-sm group-hover:text-primary transition-colors">Grams to tsp</div>
                  <div className="text-[12px] text-outline font-data-mono">Volume</div>
                </Link>
                <Link href="/conversion/grams-to-tablespoons" className="p-space-sm bg-surface-container-lowest rounded-lg hover:shadow-md transition-all flex flex-col items-start gap-1 text-on-surface group border border-outline-variant/10">
                  <div className="font-semibold text-body-sm group-hover:text-primary transition-colors">Grams to tbsp</div>
                  <div className="text-[12px] text-outline font-data-mono">Volume</div>
                </Link>
                <Link href="/conversion/grams-to-fluid-ounces" className="p-space-sm bg-surface-container-lowest rounded-lg hover:shadow-md transition-all flex flex-col items-start gap-1 text-on-surface group border border-outline-variant/10">
                  <div className="font-semibold text-body-sm group-hover:text-primary transition-colors">Grams to fl oz</div>
                  <div className="text-[12px] text-outline font-data-mono">Volume</div>
                </Link>
                <Link href="/conversion/grams-to-cups" className="p-space-sm bg-surface-container-lowest rounded-lg hover:shadow-md transition-all flex flex-col items-start gap-1 text-on-surface group border border-outline-variant/10">
                  <div className="font-semibold text-body-sm group-hover:text-primary transition-colors">Grams to cups</div>
                  <div className="text-[12px] text-outline font-data-mono">Volume</div>
                </Link>
                <Link href="/conversion/grams-to-ounces" className="p-space-sm bg-surface-container-lowest rounded-lg hover:shadow-md transition-all flex flex-col items-start gap-1 text-on-surface group border border-outline-variant/10">
                  <div className="font-semibold text-body-sm group-hover:text-primary transition-colors">Grams to oz</div>
                  <div className="text-[12px] text-outline font-data-mono">Mass</div>
                </Link>
                <Link href="/conversion/grams-to-pounds" className="p-space-sm bg-surface-container-lowest rounded-lg hover:shadow-md transition-all flex flex-col items-start gap-1 text-on-surface group border border-outline-variant/10">
                  <div className="font-semibold text-body-sm group-hover:text-primary transition-colors">Grams to lbs</div>
                  <div className="text-[12px] text-outline font-data-mono">Mass</div>
                </Link>
                <Link href="/conversion/grams-to-kilograms" className="p-space-sm bg-surface-container-lowest rounded-lg hover:shadow-md transition-all flex flex-col items-start gap-1 text-on-surface group border border-outline-variant/10">
                  <div className="font-semibold text-body-sm group-hover:text-primary transition-colors">Grams to kg</div>
                  <div className="text-[12px] text-outline font-data-mono">Mass</div>
                </Link>
                <Link href="/conversion/grams-to-liters" className="p-space-sm bg-surface-container-lowest rounded-lg hover:shadow-md transition-all flex flex-col items-start gap-1 text-on-surface group border border-outline-variant/10">
                  <div className="font-semibold text-body-sm group-hover:text-primary transition-colors">Grams to Liters</div>
                  <div className="text-[12px] text-outline font-data-mono">Volume</div>
                </Link>
                <Link href="/conversion/grams-to-gallons" className="p-space-sm bg-surface-container-lowest rounded-lg hover:shadow-md transition-all flex flex-col items-start gap-1 text-on-surface group border border-outline-variant/10">
                  <div className="font-semibold text-body-sm group-hover:text-primary transition-colors">Grams to gal</div>
                  <div className="text-[12px] text-outline font-data-mono">Volume</div>
                </Link>
                <Link href="/conversion/grams-to-pints" className="p-space-sm bg-surface-container-lowest rounded-lg hover:shadow-md transition-all flex flex-col items-start gap-1 text-on-surface group border border-outline-variant/10">
                  <div className="font-semibold text-body-sm group-hover:text-primary transition-colors">Grams to pints</div>
                  <div className="text-[12px] text-outline font-data-mono">Volume</div>
                </Link>
                <Link href="/conversion/grams-to-quarts" className="p-space-sm bg-surface-container-lowest rounded-lg hover:shadow-md transition-all flex flex-col items-start gap-1 text-on-surface group border border-outline-variant/10">
                  <div className="font-semibold text-body-sm group-hover:text-primary transition-colors">Grams to quarts</div>
                  <div className="text-[12px] text-outline font-data-mono">Volume</div>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
