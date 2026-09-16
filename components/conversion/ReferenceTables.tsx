import React from 'react';

export default function ReferenceTables() {
  return (
    <section className="w-full py-space-2xl">
      <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
        <div className="mb-space-lg">
          <span className="font-label-caps text-label-caps uppercase text-primary font-semibold tracking-wider">High-Speed Lookup</span>
          <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">Staple Ingredient Quick Reference Tables</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Pre-calculated mass-to-volume equivalents for laboratory and baking staples calibrated at standard room temperature (20°C).</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-space-md">
          {/* Table 1: All-Purpose Flour */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col border border-outline-variant/10">
            <div className="flex items-center justify-between pb-space-xs mb-space-xs border-b border-surface-container">
              <div>
                <h4 className="font-headline-md text-headline-md font-bold text-on-surface">All-Purpose Flour</h4>
                <span className="text-outline text-[12px] font-data-mono">Bulk Density ρ = 0.528 g/mL</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-surface-container font-data-mono text-[11px] text-primary font-semibold">FLOUR</span>
            </div>
            <table className="w-full font-data-mono text-body-sm text-left">
              <thead>
                <tr className="text-outline font-label-caps uppercase text-[11px] border-b border-surface-container">
                  <th className="py-1.5">Weight (g)</th>
                  <th className="py-1.5 text-right">Volume (mL)</th>
                  <th className="py-1.5 text-right">US Cups</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container text-on-surface">
                <tr><td className="py-1.5 font-medium">10 g</td><td className="py-1.5 text-right">18.9 mL</td><td className="py-1.5 text-right text-outline">1.3 Tbsp</td></tr>
                <tr><td className="py-1.5 font-medium">50 g</td><td className="py-1.5 text-right">94.7 mL</td><td className="py-1.5 text-right text-outline">0.39 cup</td></tr>
                <tr><td className="py-1.5 font-medium">100 g</td><td className="py-1.5 text-right font-semibold text-primary">189.4 mL</td><td className="py-1.5 text-right text-outline">0.79 cup</td></tr>
                <tr><td className="py-1.5 font-medium">125 g</td><td className="py-1.5 text-right">236.7 mL</td><td className="py-1.5 text-right font-semibold text-secondary">0.99 cup (~1)</td></tr>
                <tr><td className="py-1.5 font-medium">250 g</td><td className="py-1.5 text-right">473.5 mL</td><td className="py-1.5 text-right text-outline">1.97 cups</td></tr>
                <tr><td className="py-1.5 font-medium">500 g</td><td className="py-1.5 text-right">947.0 mL</td><td className="py-1.5 text-right text-outline">3.95 cups</td></tr>
                <tr><td className="py-1.5 font-medium">1,000 g</td><td className="py-1.5 text-right">1,893.9 mL</td><td className="py-1.5 text-right text-outline">7.89 cups</td></tr>
              </tbody>
            </table>
          </div>

          {/* Table 2: Granulated Sugar */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col border border-outline-variant/10">
            <div className="flex items-center justify-between pb-space-xs mb-space-xs border-b border-surface-container">
              <div>
                <h4 className="font-headline-md text-headline-md font-bold text-on-surface">Granulated White Sugar</h4>
                <span className="text-outline text-[12px] font-data-mono">Crystal Density ρ = 0.849 g/mL</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-surface-container font-data-mono text-[11px] text-primary font-semibold">SUGAR</span>
            </div>
            <table className="w-full font-data-mono text-body-sm text-left">
              <thead>
                <tr className="text-outline font-label-caps uppercase text-[11px] border-b border-surface-container">
                  <th className="py-1.5">Weight (g)</th>
                  <th className="py-1.5 text-right">Volume (mL)</th>
                  <th className="py-1.5 text-right">US Cups / Tbsp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container text-on-surface">
                <tr><td className="py-1.5 font-medium">10 g</td><td className="py-1.5 text-right">11.8 mL</td><td className="py-1.5 text-right text-outline">0.8 Tbsp</td></tr>
                <tr><td className="py-1.5 font-medium">50 g</td><td className="py-1.5 text-right">58.9 mL</td><td className="py-1.5 text-right text-outline">0.25 cup</td></tr>
                <tr><td className="py-1.5 font-medium">100 g</td><td className="py-1.5 text-right font-semibold text-primary">117.8 mL</td><td className="py-1.5 text-right text-outline">0.49 cup</td></tr>
                <tr><td className="py-1.5 font-medium">200 g</td><td className="py-1.5 text-right">235.6 mL</td><td className="py-1.5 text-right font-semibold text-secondary">0.98 cup (~1)</td></tr>
                <tr><td className="py-1.5 font-medium">250 g</td><td className="py-1.5 text-right">294.5 mL</td><td className="py-1.5 text-right text-outline">1.23 cups</td></tr>
                <tr><td className="py-1.5 font-medium">500 g</td><td className="py-1.5 text-right">588.9 mL</td><td className="py-1.5 text-right text-outline">2.45 cups</td></tr>
                <tr><td className="py-1.5 font-medium">1,000 g</td><td className="py-1.5 text-right">1,177.9 mL</td><td className="py-1.5 text-right text-outline">4.91 cups</td></tr>
              </tbody>
            </table>
          </div>

          {/* Table 3: Extra Virgin Olive Oil */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col border border-outline-variant/10">
            <div className="flex items-center justify-between pb-space-xs mb-space-xs border-b border-surface-container">
              <div>
                <h4 className="font-headline-md text-headline-md font-bold text-on-surface">Extra Virgin Olive Oil</h4>
                <span className="text-outline text-[12px] font-data-mono">Lipid Density ρ = 0.918 g/mL</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-surface-container font-data-mono text-[11px] text-primary font-semibold">OIL</span>
            </div>
            <table className="w-full font-data-mono text-body-sm text-left">
              <thead>
                <tr className="text-outline font-label-caps uppercase text-[11px] border-b border-surface-container">
                  <th className="py-1.5">Weight (g)</th>
                  <th className="py-1.5 text-right">Volume (mL)</th>
                  <th className="py-1.5 text-right">US Fl Oz / Tbsp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container text-on-surface">
                <tr><td className="py-1.5 font-medium">14 g</td><td className="py-1.5 text-right font-semibold text-secondary">15.2 mL</td><td className="py-1.5 text-right text-outline">1.03 Tbsp</td></tr>
                <tr><td className="py-1.5 font-medium">50 g</td><td className="py-1.5 text-right">54.5 mL</td><td className="py-1.5 text-right text-outline">1.84 fl oz</td></tr>
                <tr><td className="py-1.5 font-medium">100 g</td><td className="py-1.5 text-right font-semibold text-primary">108.9 mL</td><td className="py-1.5 text-right text-outline">3.68 fl oz</td></tr>
                <tr><td className="py-1.5 font-medium">200 g</td><td className="py-1.5 text-right">217.9 mL</td><td className="py-1.5 text-right text-outline">7.37 fl oz</td></tr>
                <tr><td className="py-1.5 font-medium">250 g</td><td className="py-1.5 text-right">272.3 mL</td><td className="py-1.5 text-right text-outline">1.13 cups</td></tr>
                <tr><td className="py-1.5 font-medium">500 g</td><td className="py-1.5 text-right">544.7 mL</td><td className="py-1.5 text-right text-outline">2.27 cups</td></tr>
                <tr><td className="py-1.5 font-medium">1,000 g</td><td className="py-1.5 text-right">1,089.3 mL</td><td className="py-1.5 text-right text-outline">4.54 cups</td></tr>
              </tbody>
            </table>
          </div>

          {/* Table 4: Pure Honey */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col border border-outline-variant/10">
            <div className="flex items-center justify-between pb-space-xs mb-space-xs border-b border-surface-container">
              <div>
                <h4 className="font-headline-md text-headline-md font-bold text-on-surface">Pure Clover Honey</h4>
                <span className="text-outline text-[12px] font-data-mono">Viscous Syrup ρ = 1.420 g/mL</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-surface-container font-data-mono text-[11px] text-tertiary font-semibold">HONEY</span>
            </div>
            <table className="w-full font-data-mono text-body-sm text-left">
              <thead>
                <tr className="text-outline font-label-caps uppercase text-[11px] border-b border-surface-container">
                  <th className="py-1.5">Weight (g)</th>
                  <th className="py-1.5 text-right">Volume (mL)</th>
                  <th className="py-1.5 text-right">US Fl Oz / Cups</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container text-on-surface">
                <tr><td className="py-1.5 font-medium">21 g (1 Tbsp)</td><td className="py-1.5 text-right font-semibold text-secondary">14.8 mL</td><td className="py-1.5 text-right text-outline">1.0 Tbsp</td></tr>
                <tr><td className="py-1.5 font-medium">50 g</td><td className="py-1.5 text-right">35.2 mL</td><td className="py-1.5 text-right text-outline">1.19 fl oz</td></tr>
                <tr><td className="py-1.5 font-medium">100 g</td><td className="py-1.5 text-right font-semibold text-primary">70.4 mL</td><td className="py-1.5 text-right text-outline">2.38 fl oz</td></tr>
                <tr><td className="py-1.5 font-medium">250 g</td><td className="py-1.5 text-right">176.1 mL</td><td className="py-1.5 text-right text-outline">0.73 cup</td></tr>
                <tr><td className="py-1.5 font-medium">340 g (12 oz)</td><td className="py-1.5 text-right">239.4 mL</td><td className="py-1.5 text-right text-outline">1.00 cup</td></tr>
                <tr><td className="py-1.5 font-medium">500 g</td><td className="py-1.5 text-right">352.1 mL</td><td className="py-1.5 text-right text-outline">1.47 cups</td></tr>
                <tr><td className="py-1.5 font-medium">1,000 g</td><td className="py-1.5 text-right">704.2 mL</td><td className="py-1.5 text-right text-outline">2.93 cups</td></tr>
              </tbody>
            </table>
          </div>

          {/* Table 5: Whole Milk */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col border border-outline-variant/10">
            <div className="flex items-center justify-between pb-space-xs mb-space-xs border-b border-surface-container">
              <div>
                <h4 className="font-headline-md text-headline-md font-bold text-on-surface">Whole Milk (3.25%)</h4>
                <span className="text-outline text-[12px] font-data-mono">Aqueous Fluid ρ = 1.032 g/mL</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-surface-container font-data-mono text-[11px] text-primary font-semibold">DAIRY</span>
            </div>
            <table className="w-full font-data-mono text-body-sm text-left">
              <thead>
                <tr className="text-outline font-label-caps uppercase text-[11px] border-b border-surface-container">
                  <th className="py-1.5">Weight (g)</th>
                  <th className="py-1.5 text-right">Volume (mL)</th>
                  <th className="py-1.5 text-right">US Fl Oz / Cups</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container text-on-surface">
                <tr><td className="py-1.5 font-medium">50 g</td><td className="py-1.5 text-right">48.4 mL</td><td className="py-1.5 text-right text-outline">1.64 fl oz</td></tr>
                <tr><td className="py-1.5 font-medium">100 g</td><td className="py-1.5 text-right font-semibold text-primary">96.9 mL</td><td className="py-1.5 text-right text-outline">3.28 fl oz</td></tr>
                <tr><td className="py-1.5 font-medium">245 g</td><td className="py-1.5 text-right">237.4 mL</td><td className="py-1.5 text-right font-semibold text-secondary">0.99 cup (~1)</td></tr>
                <tr><td className="py-1.5 font-medium">500 g</td><td className="py-1.5 text-right">484.5 mL</td><td className="py-1.5 text-right text-outline">2.02 cups</td></tr>
                <tr><td className="py-1.5 font-medium">976 g (1 Qt)</td><td className="py-1.5 text-right">945.7 mL</td><td className="py-1.5 text-right text-outline">3.94 cups</td></tr>
                <tr><td className="py-1.5 font-medium">1,000 g</td><td className="py-1.5 text-right">968.9 mL</td><td className="py-1.5 text-right text-outline">4.04 cups</td></tr>
                <tr><td className="py-1.5 font-medium">3,900 g (Gal)</td><td className="py-1.5 text-right">3,779.1 mL</td><td className="py-1.5 text-right text-outline">1.00 Gallon</td></tr>
              </tbody>
            </table>
          </div>

          {/* Table 6: Unsalted Butter */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col border border-outline-variant/10">
            <div className="flex items-center justify-between pb-space-xs mb-space-xs border-b border-surface-container">
              <div>
                <h4 className="font-headline-md text-headline-md font-bold text-on-surface">Unsalted Butter</h4>
                <span className="text-outline text-[12px] font-data-mono">Fat Emulsion ρ = 0.911 g/mL</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-surface-container font-data-mono text-[11px] text-tertiary font-semibold">BUTTER</span>
            </div>
            <table className="w-full font-data-mono text-body-sm text-left">
              <thead>
                <tr className="text-outline font-label-caps uppercase text-[11px] border-b border-surface-container">
                  <th className="py-1.5">Weight (g)</th>
                  <th className="py-1.5 text-right">Volume (mL)</th>
                  <th className="py-1.5 text-right">Standard Portion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container text-on-surface">
                <tr><td className="py-1.5 font-medium">14.2 g</td><td className="py-1.5 text-right">15.6 mL</td><td className="py-1.5 text-right text-outline">1 Tbsp</td></tr>
                <tr><td className="py-1.5 font-medium">50 g</td><td className="py-1.5 text-right">54.9 mL</td><td className="py-1.5 text-right text-outline">3.5 Tbsp</td></tr>
                <tr><td className="py-1.5 font-medium">100 g</td><td className="py-1.5 text-right font-semibold text-primary">109.8 mL</td><td className="py-1.5 text-right text-outline">0.46 cup</td></tr>
                <tr><td className="py-1.5 font-medium">113.4 g</td><td className="py-1.5 text-right font-semibold text-secondary">124.5 mL</td><td className="py-1.5 text-right font-semibold text-secondary">1 Stick (1/2 c)</td></tr>
                <tr><td className="py-1.5 font-medium">226.8 g</td><td className="py-1.5 text-right">248.9 mL</td><td className="py-1.5 text-right text-outline">2 Sticks (1 cup)</td></tr>
                <tr><td className="py-1.5 font-medium">453.6 g</td><td className="py-1.5 text-right">497.9 mL</td><td className="py-1.5 text-right text-outline">1 Pound (2 cups)</td></tr>
                <tr><td className="py-1.5 font-medium">1,000 g</td><td className="py-1.5 text-right">1,097.7 mL</td><td className="py-1.5 text-right text-outline">4.41 cups</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
