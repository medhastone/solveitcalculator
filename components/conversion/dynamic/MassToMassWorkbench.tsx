'use client';

import React, { useState, useEffect } from 'react';
import type { ConversionUnit } from '../../../lib/conversion-units';

interface MassToMassWorkbenchProps {
  unit: ConversionUnit;
}

export default function MassToMassWorkbench({ unit }: MassToMassWorkbenchProps) {
  const [mode, setMode] = useState<'g-to-target' | 'target-to-g'>('g-to-target');
  const [inputValueStr, setInputValueStr] = useState<string>('100');

  const rawInput = parseFloat(inputValueStr) || 0;
  
  // Calculations
  const outputValue = mode === 'g-to-target' 
    ? rawInput * unit.multiplierFromBase 
    : rawInput / unit.multiplierFromBase;

  const leftLabel = mode === 'g-to-target' ? 'Grams (g)' : `${unit.name} (${unit.symbol})`;
  const rightLabel = mode === 'g-to-target' ? `${unit.name} (${unit.symbol})` : 'Grams (g)';

  return (
    <section className="w-full bg-surface-container-low py-space-xl border-y border-outline-variant/10">
      <div className="max-w-3xl mx-auto px-gutter-mobile lg:px-gutter-desktop">
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/10 overflow-hidden">
          {/* Header Switcher */}
          <div className="flex items-center p-2 bg-surface-container-low border-b border-surface-container gap-2">
            <button
              type="button"
              onClick={() => setMode('g-to-target')}
              className={`flex-1 py-2 rounded-xl text-body-sm font-semibold transition-all ${mode === 'g-to-target' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface hover:bg-surface-container'}`}
            >
              Grams to {unit.name}
            </button>
            <button
              type="button"
              onClick={() => setMode('target-to-g')}
              className={`flex-1 py-2 rounded-xl text-body-sm font-semibold transition-all ${mode === 'target-to-g' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface hover:bg-surface-container'}`}
            >
              {unit.name} to Grams
            </button>
          </div>

          <div className="p-space-xl space-y-space-lg">
            {/* IO Area */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-space-md items-center">
              {/* Input */}
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
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 font-label-caps text-outline font-bold">
                    {mode === 'g-to-target' ? 'g' : unit.symbol}
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center md:pt-6">
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[24px]">arrow_forward</span>
                </div>
              </div>

              {/* Output */}
              <div className="flex flex-col gap-2">
                <label className="font-label-caps text-label-caps uppercase text-primary font-bold">{rightLabel}</label>
                <div className="w-full bg-primary-fixed/20 px-4 py-4 rounded-xl font-data-mono text-[32px] text-on-surface border border-primary/20 relative">
                  {outputValue.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 font-label-caps text-primary font-bold">
                    {mode === 'g-to-target' ? unit.symbol : 'g'}
                  </div>
                </div>
              </div>
            </div>

            {/* Math Proof */}
            <div className="pt-space-md border-t border-surface-container">
              <div className="flex items-center justify-between font-data-mono text-body-sm">
                <span className="text-on-surface-variant">Calculation Proof:</span>
                <span className="text-on-surface">
                  {mode === 'g-to-target' 
                    ? `${rawInput} g × ${unit.multiplierFromBase.toExponential(4)} = ${outputValue.toFixed(4)} ${unit.symbol}`
                    : `${rawInput} ${unit.symbol} ÷ ${unit.multiplierFromBase.toExponential(4)} = ${outputValue.toFixed(4)} g`
                  }
                </span>
              </div>
              <div className="flex items-center justify-between font-data-mono text-[12px] text-outline mt-1">
                <span>Conversion Factor:</span>
                <span>1 g = {unit.multiplierFromBase} {unit.symbol}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
