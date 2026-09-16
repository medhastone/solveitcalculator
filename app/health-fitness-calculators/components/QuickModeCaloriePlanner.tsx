'use client';

import React, { useState } from 'react';
import QuickModeWrapper from './QuickModeWrapper';

interface QuickModeCaloriePlannerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickModeCaloriePlanner({
  isOpen,
  onClose,
}: QuickModeCaloriePlannerProps) {
  const [tdee, setTdee] = useState<number>(2500);
  const [goal, setGoal] = useState<'loss' | 'gain'>('loss');
  const [rate, setRate] = useState<number>(0.5);

  // 1 kg of body tissue is roughly 7700 kcal
  // Rate (kg/wk) * 7700 / 7 days = daily kcal offset
  const dailyOffset = Math.round((rate * 7700) / 7);
  const targetCalories = goal === 'loss' ? tdee - dailyOffset : tdee + dailyOffset;

  return (
    <QuickModeWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Calorie Deficit & Surplus Planner"
      icon="restaurant_menu"
      fullPageUrl="/health-fitness-calculators/deficit"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-on-surface-variant mb-1">
              TDEE (kcal)
            </label>
            <input
              type="number"
              value={tdee}
              onChange={(e) => setTdee(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-on-surface-variant mb-1">
              Goal
            </label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value as 'loss' | 'gain')}
              className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
            >
              <option value="loss">Weight Loss</option>
              <option value="gain">Weight Gain</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-on-surface-variant mb-1">
              Rate (kg/wk)
            </label>
            <select
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
            >
              <option value="0.25">0.25 kg/wk</option>
              <option value="0.5">0.5 kg/wk</option>
              <option value="1">1.0 kg/wk</option>
            </select>
          </div>
        </div>
        <div className="p-4 bg-primary-container rounded-2xl border border-outline-variant/30 text-center">
          <div className="text-sm font-medium text-on-primary-container mb-1">
            Target Daily Calories
          </div>
          <div className="text-3xl font-bold text-on-surface">
            {targetCalories} kcal
          </div>
        </div>
      </div>
    </QuickModeWrapper>
  );
}
