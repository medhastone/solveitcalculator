'use client';
import React, { useState } from 'react';
import QuickModeWrapper from './QuickModeWrapper';

export default function QuickModeBSA({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [height, setHeight] = useState<number>(178);
  const [weight, setWeight] = useState<number>(75);

  const bsa = 0.007184 * Math.pow(height, 0.725) * Math.pow(weight, 0.425);

  return (
    <QuickModeWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Body Surface Area (BSA)"
      icon="straighten"
      fullPageUrl="/health-fitness-calculators/bsa"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-on-surface-variant mb-1">Height (cm)</label>
            <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-on-surface-variant mb-1">Weight (kg)</label>
            <input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>
        <div className="p-4 bg-primary-container rounded-2xl border border-outline-variant/30 text-center">
          <div className="text-sm font-medium text-on-primary-container mb-1">BSA (Du Bois)</div>
          <div className="text-3xl font-bold text-on-surface">{bsa.toFixed(2)} m²</div>
        </div>
      </div>
    </QuickModeWrapper>
  );
}
