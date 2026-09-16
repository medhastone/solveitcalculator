'use client';
import React, { useState } from 'react';
import QuickModeWrapper from './QuickModeWrapper';

export default function QuickModeWHtR({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [waist, setWaist] = useState<number>(82);
  const [height, setHeight] = useState<number>(178);

  const whtr = waist / height;

  return (
    <QuickModeWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Waist-to-Height Ratio (WHtR)"
      icon="accessibility_new"
      fullPageUrl="/health-fitness-calculators/whtr"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-on-surface-variant mb-1">Waist (cm)</label>
            <input type="number" value={waist} onChange={(e) => setWaist(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-on-surface-variant mb-1">Height (cm)</label>
            <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>
        <div className="p-4 bg-primary-container rounded-2xl border border-outline-variant/30 text-center">
          <div className="text-sm font-medium text-on-primary-container mb-1">Ratio</div>
          <div className="text-3xl font-bold text-on-surface">{whtr.toFixed(2)}</div>
        </div>
      </div>
    </QuickModeWrapper>
  );
}
