'use client';
import React, { useState } from 'react';
import QuickModeWrapper from './QuickModeWrapper';

export default function QuickModeVelocity({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [weight, setWeight] = useState<number>(85);
  const [goal, setGoal] = useState<number>(75);
  const [weeks, setWeeks] = useState<number>(12);

  const deficit = ((weight - goal) * 7700) / (weeks * 7);

  return (
    <QuickModeWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Weight Loss Velocity Simulator"
      icon="speed"
      fullPageUrl="/health-fitness-calculators/velocity"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-on-surface-variant mb-1">Current (kg)</label>
            <input type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-on-surface-variant mb-1">Target (kg)</label>
            <input type="number" value={goal} onChange={(e) => setGoal(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-on-surface-variant mb-1">Weeks</label>
            <input type="number" value={weeks} onChange={(e) => setWeeks(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>
        <div className="p-4 bg-primary-container rounded-2xl border border-outline-variant/30 text-center">
          <div className="text-sm font-medium text-on-primary-container mb-1">Required Daily Caloric Deficit</div>
          <div className="text-3xl font-bold text-on-surface">{Math.max(0, deficit).toFixed(0)} kcal</div>
        </div>
      </div>
    </QuickModeWrapper>
  );
}
