import React from 'react';

export default function DensitySpectrum() {
  return (
    <section className="w-full py-space-xl bg-surface-container-low">
      <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-lg gap-space-xs">
          <div>
            <span className="font-label-caps text-label-caps uppercase text-primary font-semibold tracking-wider">Comparative Metrology</span>
            <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">The Density Spectrum: 100 Grams in Volume</h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
              Because volume inversely correlates with density (V = m/ρ), 100 grams of an aerated powder requires a colossal volume compared to the compact space required by viscous syrups.
            </p>
          </div>
          <span className="font-data-mono text-body-sm text-secondary bg-surface-container-lowest px-3 py-1 rounded-md shrink-0 border border-outline-variant/10">Baseline: Pure Water = 100.0 mL</span>
        </div>

        {/* Horizontal Comparative Bars */}
        <div className="bg-surface-container-lowest p-space-md md:p-space-lg rounded-xl shadow-sm space-y-space-sm border border-outline-variant/10">
          
          {/* Item 1: Cocoa Powder */}
          <div className="space-y-1">
            <div className="flex items-center justify-between font-data-mono text-body-sm">
              <span className="font-medium text-on-surface flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-700"></span>
                Cocoa Powder (Aerated)
              </span>
              <span className="text-on-surface font-semibold">250.0 mL <span className="text-outline text-[12px] font-normal">(ρ = 0.400 g/mL)</span></span>
            </div>
            <div className="w-full bg-surface-container h-3 rounded-full overflow-hidden">
              <div className="bg-amber-700 h-full rounded-full transition-all duration-700" style={{ width: '100%' }}></div>
            </div>
          </div>

          {/* Item 2: All-Purpose Flour */}
          <div className="space-y-1">
            <div className="flex items-center justify-between font-data-mono text-body-sm">
              <span className="font-medium text-on-surface flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                All-Purpose Flour (Unbleached)
              </span>
              <span className="text-on-surface font-semibold">189.4 mL <span className="text-outline text-[12px] font-normal">(ρ = 0.528 g/mL)</span></span>
            </div>
            <div className="w-full bg-surface-container h-3 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full transition-all duration-700" style={{ width: '75.7%' }}></div>
            </div>
          </div>

          {/* Item 3: Granulated Sugar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between font-data-mono text-body-sm">
              <span className="font-medium text-on-surface flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-300"></span>
                Granulated White Sugar
              </span>
              <span className="text-on-surface font-semibold">117.8 mL <span className="text-outline text-[12px] font-normal">(ρ = 0.849 g/mL)</span></span>
            </div>
            <div className="w-full bg-surface-container h-3 rounded-full overflow-hidden">
              <div className="bg-sky-400 h-full rounded-full transition-all duration-700" style={{ width: '47.1%' }}></div>
            </div>
          </div>

          {/* Item 4: Olive Oil */}
          <div className="space-y-1">
            <div className="flex items-center justify-between font-data-mono text-body-sm">
              <span className="font-medium text-on-surface flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-lime-600"></span>
                Extra Virgin Olive Oil
              </span>
              <span className="text-on-surface font-semibold">108.9 mL <span className="text-outline text-[12px] font-normal">(ρ = 0.918 g/mL)</span></span>
            </div>
            <div className="w-full bg-surface-container h-3 rounded-full overflow-hidden">
              <div className="bg-lime-500 h-full rounded-full transition-all duration-700" style={{ width: '43.5%' }}></div>
            </div>
          </div>

          {/* Item 5: Pure Water */}
          <div className="space-y-1">
            <div className="flex items-center justify-between font-data-mono text-body-sm">
              <span className="font-medium text-on-surface flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                Pure Distilled Water (4°C Reference)
              </span>
              <span className="text-primary font-bold">100.0 mL <span className="text-outline text-[12px] font-normal">(ρ = 1.000 g/mL)</span></span>
            </div>
            <div className="w-full bg-surface-container h-3 rounded-full overflow-hidden">
              <div className="bg-primary h-full rounded-full transition-all duration-700" style={{ width: '40.0%' }}></div>
            </div>
          </div>

          {/* Item 6: Whole Milk */}
          <div className="space-y-1">
            <div className="flex items-center justify-between font-data-mono text-body-sm">
              <span className="font-medium text-on-surface flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-400"></span>
                Whole Milk (3.25% Butterfat)
              </span>
              <span className="text-on-surface font-semibold">96.9 mL <span className="text-outline text-[12px] font-normal">(ρ = 1.032 g/mL)</span></span>
            </div>
            <div className="w-full bg-surface-container h-3 rounded-full overflow-hidden">
              <div className="bg-indigo-400 h-full rounded-full transition-all duration-700" style={{ width: '38.7%' }}></div>
            </div>
          </div>

          {/* Item 7: Pure Honey */}
          <div className="space-y-1">
            <div className="flex items-center justify-between font-data-mono text-body-sm">
              <span className="font-medium text-on-surface flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-tertiary"></span>
                Natural Clover Honey
              </span>
              <span className="text-on-surface font-semibold">70.4 mL <span className="text-outline text-[12px] font-normal">(ρ = 1.420 g/mL)</span></span>
            </div>
            <div className="w-full bg-surface-container h-3 rounded-full overflow-hidden">
              <div className="bg-tertiary-container h-full rounded-full transition-all duration-700" style={{ width: '28.1%' }}></div>
            </div>
          </div>
        </div>

        {/* Critical Metrology Takeaway Callout */}
        <div className="mt-space-md p-space-md rounded-xl bg-surface-container-high/70 flex items-start gap-space-sm border border-outline-variant/10">
          <span className="material-symbols-outlined text-primary text-[28px] shrink-0">lightbulb</span>
          <div className="space-y-1">
            <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Why 100g of Flour is NOT 100mL</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Because all-purpose flour has an average bulk density of <strong>0.528 g/mL</strong>, it contains significant inter-particle air volume. Thus, 100 grams of flour demands <strong>189.4 mL</strong>—nearly double the volume of water. In contrast, 100 grams of dense honey (ρ = 1.42 g/mL) fills only <strong>70.4 mL</strong>. Treating 1 gram as 1 mL for non-aqueous ingredients introduces up to <strong>89% recipe and formulation error</strong>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
