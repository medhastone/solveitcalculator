'use client';
import React, { useState } from 'react';
import QuickModeWrapper from './QuickModeWrapper';

export default function QuickModeProteinRDA({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [weight, setWeight] = useState<number>(75);
  const [goal, setGoal] = useState<'maintenance' | 'muscle'>('muscle');

  const protein = goal === 'maintenance' ? weight * 0.8 : weight * 2.0;

  return (
    <QuickModeWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Protein RDA & Hypertrophy"
      icon="fitness_center"
      fullPageUrl="/health-fitness-calculators/protein-rda"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-on-surface-variant mb-1">Weight (kg)</label>
            <input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-on-surface-variant mb-1">Goal</label>
            <select value={goal} onChange={(e) => setGoal(e.target.value as any)} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary appearance-none">
              <option value="maintenance">Maintenance</option>
              <option value="muscle">Muscle Gain</option>
            </select>
          </div>
        </div>
        <div className="p-4 bg-primary-container rounded-2xl border border-outline-variant/30 text-center">
          <div className="text-sm font-medium text-on-primary-container mb-1">Daily Protein Target</div>
          <div className="text-3xl font-bold text-on-surface">{protein.toFixed(0)} g</div>
        </div>
      </div>
    </QuickModeWrapper>
  );
}
