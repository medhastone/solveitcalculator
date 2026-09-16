'use client';
import React, { useState } from 'react';
import QuickModeWrapper from './QuickModeWrapper';

export default function QuickModeKeto({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [tdee, setTdee] = useState<number>(2500);
  const [netCarb, setNetCarb] = useState<number>(20);
  
  const protein = tdee * 0.2 / 4;
  const fat = (tdee - (netCarb * 4) - (protein * 4)) / 9;

  return (
    <QuickModeWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Keto Net Carb & Fat Matrix"
      icon="water_drop"
      fullPageUrl="/health-fitness-calculators/keto"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-on-surface-variant mb-1">TDEE (kcal)</label>
            <input type="number" value={tdee} onChange={(e) => setTdee(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-on-surface-variant mb-1">Net Carbs Target (g)</label>
            <input type="number" value={netCarb} onChange={(e) => setNetCarb(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>
        <div className="p-4 bg-primary-container rounded-2xl border border-outline-variant/30 text-center">
          <div className="text-sm font-medium text-on-primary-container mb-3">Keto Macros</div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <div className="text-xl font-bold text-on-surface">{netCarb}g</div>
              <div className="text-xs text-on-surface-variant">Carbs</div>
            </div>
            <div>
              <div className="text-xl font-bold text-on-surface">{protein.toFixed(0)}g</div>
              <div className="text-xs text-on-surface-variant">Protein</div>
            </div>
            <div>
              <div className="text-xl font-bold text-on-surface">{Math.max(0, fat).toFixed(0)}g</div>
              <div className="text-xs text-on-surface-variant">Fat</div>
            </div>
          </div>
        </div>
      </div>
    </QuickModeWrapper>
  );
}
