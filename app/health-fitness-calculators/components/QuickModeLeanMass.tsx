'use client';

import React, { useState } from 'react';
import QuickModeWrapper from './QuickModeWrapper';

interface QuickModeLeanMassProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickModeLeanMass({
  isOpen,
  onClose,
}: QuickModeLeanMassProps) {
  const [lmWeight, setLmWeight] = useState<number>(75);
  const [lmFat, setLmFat] = useState<number>(20);

  const calculatedLeanMass = (lmWeight * (1 - lmFat / 100)).toFixed(1);

  return (
    <QuickModeWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Lean Body Mass (LBM)"
      icon="accessibility_new"
      fullPageUrl="/health-fitness-calculators/lean-mass"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-on-surface-variant mb-1">
              Weight (kg)
            </label>
            <input
              type="number"
              value={lmWeight}
              onChange={(e) => setLmWeight(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-on-surface-variant mb-1">
              Body Fat %
            </label>
            <input
              type="number"
              value={lmFat}
              onChange={(e) => setLmFat(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-primary-container border border-outline-variant/30 text-center">
          <div className="text-sm font-medium text-on-primary-container mb-1">
            Lean Body Mass
          </div>
          <div className="text-3xl font-bold text-on-surface">
            {calculatedLeanMass} kg
          </div>
        </div>
      </div>
    </QuickModeWrapper>
  );
}
