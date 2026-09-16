'use client';
import React, { useState } from 'react';
import QuickModeWrapper from './QuickModeWrapper';

export default function QuickModeABSI({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [waist, setWaist] = useState<number>(82);
  const [weight, setWeight] = useState<number>(75);
  const [height, setHeight] = useState<number>(178);

  const bmi = weight / Math.pow(height / 100, 2);
  const absi = (waist / 100) / (Math.pow(bmi, 2 / 3) * Math.pow(height / 100, 1 / 2));

  return (
    <QuickModeWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="A Body Shape Index (ABSI)"
      icon="accessibility"
      fullPageUrl="/health-fitness-calculators/absi"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-on-surface-variant mb-1">Waist (cm)</label>
            <input type="number" value={waist} onChange={(e) => setWaist(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-on-surface-variant mb-1">Weight (kg)</label>
            <input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-on-surface-variant mb-1">Height (cm)</label>
            <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>
        <div className="p-4 bg-primary-container rounded-2xl border border-outline-variant/30 text-center">
          <div className="text-sm font-medium text-on-primary-container mb-1">ABSI Value</div>
          <div className="text-3xl font-bold text-on-surface">{absi.toFixed(4)}</div>
        </div>
      </div>
    </QuickModeWrapper>
  );
}
