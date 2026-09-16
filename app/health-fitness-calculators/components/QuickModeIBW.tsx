'use client';

import React, { useState } from 'react';
import QuickModeWrapper from './QuickModeWrapper';

interface QuickModeIBWProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickModeIBW({ isOpen, onClose }: QuickModeIBWProps) {
  const [height, setHeight] = useState<number>(178);
  const [gender, setGender] = useState<'male' | 'female'>('male');

  // Devine formula
  const inchesOver5Feet = height / 2.54 - 60;
  const baseWeight = gender === 'male' ? 50 : 45.5;
  const idealWeight = baseWeight + 2.3 * Math.max(0, inchesOver5Feet);

  return (
    <QuickModeWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Ideal Body Weight (IBW)"
      icon="monitor_weight"
      fullPageUrl="/health-fitness-calculators/ibw"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-on-surface-variant mb-1">
              Height (cm)
            </label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-on-surface-variant mb-1">
              Gender
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as 'male' | 'female')}
              className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>
        <div className="p-4 bg-primary-container rounded-2xl border border-outline-variant/30 text-center">
          <div className="text-sm font-medium text-on-primary-container mb-1">
            Ideal Body Weight (Devine)
          </div>
          <div className="text-3xl font-bold text-on-surface">
            {idealWeight.toFixed(1)} kg
          </div>
        </div>
      </div>
    </QuickModeWrapper>
  );
}
