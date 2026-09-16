'use client';
import React, { useState } from 'react';
import QuickModeWrapper from './QuickModeWrapper';

export default function QuickModeFFMI({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [height, setHeight] = useState<number>(178);
  const [weight, setWeight] = useState<number>(75);
  const [bodyFat, setBodyFat] = useState<number>(15);

  const leanWeight = weight * (1 - bodyFat / 100);
  const ffmi = leanWeight / Math.pow(height / 100, 2);
  const normalizedFfmi = ffmi + 6.1 * (1.8 - height / 100);

  return (
    <QuickModeWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Fat-Free Mass Index (FFMI)"
      icon="fitness_center"
      fullPageUrl="/health-fitness-calculators/ffmi"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-on-surface-variant mb-1">Weight (kg)</label>
            <input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-on-surface-variant mb-1">Body Fat (%)</label>
            <input type="number" value={bodyFat} onChange={(e) => setBodyFat(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-on-surface-variant mb-1">Height (cm)</label>
            <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>
        <div className="p-4 bg-primary-container rounded-2xl border border-outline-variant/30 text-center">
          <div className="text-sm font-medium text-on-primary-container mb-1">Normalized FFMI</div>
          <div className="text-3xl font-bold text-on-surface">{normalizedFfmi.toFixed(1)}</div>
        </div>
      </div>
    </QuickModeWrapper>
  );
}
