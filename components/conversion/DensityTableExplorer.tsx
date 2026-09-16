'use client';

import React, { useState, useMemo } from 'react';
import { INGREDIENTS } from '../../lib/conversion-data';

export default function DensityTableExplorer() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return INGREDIENTS.filter(item => 
      item.name.toLowerCase().includes(q) || 
      item.category.toLowerCase().includes(q) ||
      item.usda.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const triggerLoad = (id: string) => {
    const event = new CustomEvent('loadIngredientEvent', { detail: { id } });
    window.dispatchEvent(event);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="w-full py-space-2xl bg-surface-container-low">
      <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-md gap-space-sm">
          <div>
            <span className="font-label-caps text-label-caps uppercase text-primary font-semibold tracking-wider">Metrological Repository</span>
            <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">500+ Calibrated Ingredient Density Explorer</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Search certified densities indexed from the USDA FoodData Central and NIST Thermodynamic Chemistry databases.</p>
          </div>
          <div className="relative w-full md:w-72 shrink-0">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
            <input 
              type="text" 
              placeholder="Search flours, oils, chemicals..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-surface-container-lowest text-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-sm font-body-sm"
            />
          </div>
        </div>

        {/* Density Explorer Data Table Card */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/10">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-data-mono text-body-sm">
              <thead className="bg-surface-container text-on-surface-variant font-label-caps uppercase text-[11px] border-b border-surface-container-high">
                <tr>
                  <th className="py-3 px-4">Ingredient Name &amp; Spec</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">USDA / CAS ID</th>
                  <th className="py-3 px-4">Density (g/mL)</th>
                  <th className="py-3 px-4">kg/m³</th>
                  <th className="py-3 px-4">Metric Cup (250 mL)</th>
                  <th className="py-3 px-4">US Cup (240 mL)</th>
                  <th className="py-3 px-4 text-right">Quick Load</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container text-on-surface">
                {filteredData.map(item => (
                  <tr key={item.id} className="hover:bg-surface-container-high/40 transition-colors">
                    <td className="py-2.5 px-4 font-medium text-on-surface">
                      <div className="font-semibold">{item.name}</div>
                    </td>
                    <td className="py-2.5 px-4 text-on-surface-variant capitalize">{item.category}</td>
                    <td className="py-2.5 px-4 text-outline text-[12px] font-mono">{item.usda}</td>
                    <td className="py-2.5 px-4 font-bold text-primary">{item.density.toFixed(3)}</td>
                    <td className="py-2.5 px-4">{Math.round(item.density * 1000)}</td>
                    <td className="py-2.5 px-4">{(item.density * 250).toFixed(1)} g</td>
                    <td className="py-2.5 px-4">{(item.density * 240).toFixed(1)} g</td>
                    <td className="py-2.5 px-4 text-right">
                      <button 
                        type="button" 
                        onClick={() => triggerLoad(item.id)}
                        className="px-2.5 py-1 rounded bg-surface-container hover:bg-primary hover:text-on-primary text-[12px] font-semibold transition-colors cursor-pointer"
                      >
                        Load
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-4 px-4 text-center text-outline-variant font-body-sm italic">
                      No calibration targets found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="p-space-sm bg-surface-container-low flex items-center justify-between font-body-sm text-body-sm text-on-surface-variant">
            <span>Showing {filteredData.length} core laboratory calibrated standards</span>
            <span className="font-data-mono text-[12px]">Temp Baseline: 20°C / 1 atm pressure</span>
          </div>
        </div>
      </div>
    </section>
  );
}
