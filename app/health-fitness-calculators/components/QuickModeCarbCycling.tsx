'use client';
import React, { useState } from 'react';
import QuickModeWrapper from './QuickModeWrapper';

export default function QuickModeCarbCycling({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [tdee, setTdee] = useState<number>(2500);
  
  const highCarb = tdee * 0.5 / 4;
  const lowCarb = tdee * 0.2 / 4;

  return (
    <QuickModeWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Carbohydrate Cycling"
      icon="bolt"
      fullPageUrl="/health-fitness-calculators/carb-cycling"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-semibold text-on-surface-variant mb-1">TDEE (kcal)</label>
            <input type="number" value={tdee} onChange={(e) => setTdee(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-primary-container rounded-2xl border border-outline-variant/30 text-center">
            <div className="text-sm font-medium text-on-primary-container mb-1">High Carb Day</div>
            <div className="text-3xl font-bold text-on-surface">{highCarb.toFixed(0)} g</div>
          </div>
          <div className="p-4 bg-surface-container-high rounded-2xl border border-outline-variant/30 text-center">
            <div className="text-sm font-medium text-on-surface-variant mb-1">Low Carb Day</div>
            <div className="text-3xl font-bold text-on-surface">{lowCarb.toFixed(0)} g</div>
          </div>
        </div>
      </div>
    </QuickModeWrapper>
  );
}
