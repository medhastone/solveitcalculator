'use client';

import React, { useState } from 'react';
import { UnitDefinition } from '@/lib/conversions';

interface VolumeVisualizerProps {
  fromUnit: UnitDefinition;
  toUnit: UnitDefinition;
  inputValue: number;
  resultValue: number;
  volumeInLiters: number;
}

type ContainerShape = 'flask' | 'bottle' | 'jug' | 'cup' | 'drum';

interface HouseholdEquivalent {
  name: string;
  icon: string;
  litersEach: number;
  description: string;
  unitLabel: string;
}

const HOUSEHOLD_ITEMS: HouseholdEquivalent[] = [
  { name: 'Standard Water Bottle', icon: 'local_drink', litersEach: 0.5, description: '500 mL PET beverage bottle', unitLabel: 'bottles' },
  { name: 'Coffee Cup / Mug', icon: 'coffee', litersEach: 0.24, description: 'Standard 8 fl oz cup', unitLabel: 'cups' },
  { name: 'US Milk / Water Gallon', icon: 'water_bottle', litersEach: 3.78541, description: '1 Gallon plastic jug', unitLabel: 'gallon jugs' },
  { name: 'Soda Can', icon: 'takeout_dining', litersEach: 0.355, description: '12 fl oz aluminum beverage can', unitLabel: 'cans' },
  { name: 'Kitchen Tablespoon', icon: 'restaurant', litersEach: 0.0147868, description: 'Standard 1 tbsp culinary measure', unitLabel: 'tbsp' },
  { name: 'Bath Tub', icon: 'bathtub', litersEach: 150, description: 'Average household bathtub fill', unitLabel: 'bathtubs' }
];

export default function VolumeVisualizer({
  fromUnit,
  toUnit,
  inputValue,
  resultValue,
  volumeInLiters
}: VolumeVisualizerProps) {
  const [selectedShape, setSelectedShape] = useState<ContainerShape>('flask');
  const [activeTab, setActiveTab] = useState<'container' | 'equivalents'>('container');

  // Normalize volume for fill percentage
  // Reference max volume depends on container shape
  const containerCapacities: Record<ContainerShape, { maxLiters: number; label: string; name: string }> = {
    cup: { maxLiters: 0.5, label: '500 mL Max', name: 'Graduated Measuring Cup' },
    flask: { maxLiters: 2.0, label: '2.0 L Max', name: 'Laboratory Flask' },
    bottle: { maxLiters: 1.0, label: '1.0 L Max', name: 'Sports Bottle' },
    jug: { maxLiters: 5.0, label: '5.0 L Max', name: 'Household Gallon Jug' },
    drum: { maxLiters: 200, label: '200 L Max', name: 'Industrial Steel Drum' }
  };

  const currentCapacity = containerCapacities[selectedShape];
  const clampedLiters = Math.max(0, volumeInLiters);
  const fillFraction = Math.min(1, Math.max(0.04, clampedLiters / currentCapacity.maxLiters));
  const fillPercentage = Math.round(fillFraction * 100);

  // SVG dimensions for the container
  const width = 240;
  const height = 240;
  const liquidY = height - (fillFraction * (height - 50)) - 20;

  return (
    <div className="rounded-3xl bg-surface-container-lowest border border-outline-variant/30 p-5 sm:p-6 shadow-sm flex flex-col gap-5">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-outline-variant/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">science</span>
            <h3 className="font-bold text-base sm:text-lg text-on-surface">
              Interactive Volume Visualizer
            </h3>
          </div>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Real-time liquid level and real-world physical container scaling
          </p>
        </div>

        {/* Tab pills */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-surface-container-low border border-outline-variant/20 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('container')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'container'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Liquid Container
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('equivalents')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'equivalents'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Real-World Objects
          </button>
        </div>
      </div>

      {activeTab === 'container' ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Visual Container Graphic (7 Cols) */}
          <div className="md:col-span-7 flex flex-col items-center justify-center p-4 rounded-2xl bg-surface-container-low/40 border border-outline-variant/25 relative overflow-hidden min-h-[300px]">
            {/* Background subtle grid lines */}
            <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none"></div>

            {/* Vessel Selector Pills */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 mb-4 z-10">
              {(
                [
                  { id: 'cup', label: 'Measuring Cup', icon: 'local_cafe' },
                  { id: 'flask', label: 'Lab Flask', icon: 'science' },
                  { id: 'bottle', label: 'Bottle (1L)', icon: 'local_drink' },
                  { id: 'jug', label: 'Gallon Jug', icon: 'water_bottle' },
                  { id: 'drum', label: 'Industrial Drum', icon: 'propane_tank' }
                ] as const
              ).map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedShape(v.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1 transition-all ${
                    selectedShape === v.id
                      ? 'bg-primary text-on-primary font-semibold shadow-xs'
                      : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant/25 hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">{v.icon}</span>
                  <span>{v.label}</span>
                </button>
              ))}
            </div>

            {/* Dynamic Animated Liquid Vessel SVG */}
            <div className="relative w-[240px] h-[240px] flex items-center justify-center">
              <svg
                viewBox="0 0 240 240"
                className="w-full h-full drop-shadow-md overflow-visible"
                aria-label="Liquid Volume Container"
              >
                <defs>
                  {/* Liquid Gradient */}
                  <linearGradient id="liquidBlueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="60%" stopColor="#2563eb" />
                    <stop offset="100%" stopColor="#1d4ed8" />
                  </linearGradient>

                  {/* Surface Meniscus highlight */}
                  <linearGradient id="meniscusGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3" />
                  </linearGradient>

                  {/* Glass Reflection Highlight */}
                  <linearGradient id="glassReflection" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
                    <stop offset="25%" stopColor="#ffffff" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
                  </linearGradient>

                  {/* Vessel Clip Paths based on shape */}
                  <clipPath id="flaskClip">
                    <path d="M 100 20 L 140 20 L 140 70 L 205 195 C 210 205 200 215 190 215 L 50 215 C 40 215 30 205 35 195 L 100 70 Z" />
                  </clipPath>

                  <clipPath id="cupClip">
                    <path d="M 55 35 L 185 35 L 170 215 C 168 220 160 220 155 220 L 85 220 C 80 220 72 220 70 215 Z" />
                  </clipPath>

                  <clipPath id="bottleClip">
                    <path d="M 105 20 L 135 20 L 135 50 L 165 75 L 165 210 C 165 218 158 220 150 220 L 90 220 C 82 220 75 218 75 210 L 75 75 L 105 50 Z" />
                  </clipPath>

                  <clipPath id="jugClip">
                    <path d="M 100 25 L 140 25 L 140 55 L 180 75 L 180 210 C 180 220 170 220 160 220 L 80 220 C 70 220 60 220 60 210 L 60 75 L 100 55 Z" />
                  </clipPath>

                  <clipPath id="drumClip">
                    <rect x="55" y="30" width="130" height="190" rx="20" />
                  </clipPath>
                </defs>

                {/* Container Outer Glass Vessel Shell */}
                {selectedShape === 'flask' && (
                  <path
                    d="M 100 20 L 140 20 L 140 70 L 205 195 C 210 205 200 215 190 215 L 50 215 C 40 215 30 205 35 195 L 100 70 Z"
                    className="fill-surface-container/60 stroke-outline-variant/60 dark:stroke-slate-600"
                    strokeWidth="3"
                  />
                )}
                {selectedShape === 'cup' && (
                  <g>
                    {/* Cup Handle */}
                    <path
                      d="M 180 65 C 215 75 215 160 170 175"
                      fill="none"
                      className="stroke-outline-variant/70 dark:stroke-slate-600"
                      strokeWidth="10"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 55 35 L 185 35 L 170 215 C 168 220 160 220 155 220 L 85 220 C 80 220 72 220 70 215 Z"
                      className="fill-surface-container/60 stroke-outline-variant/60 dark:stroke-slate-600"
                      strokeWidth="3"
                    />
                  </g>
                )}
                {selectedShape === 'bottle' && (
                  <path
                    d="M 105 20 L 135 20 L 135 50 L 165 75 L 165 210 C 165 218 158 220 150 220 L 90 220 C 82 220 75 218 75 210 L 75 75 L 105 50 Z"
                    className="fill-surface-container/60 stroke-outline-variant/60 dark:stroke-slate-600"
                    strokeWidth="3"
                  />
                )}
                {selectedShape === 'jug' && (
                  <g>
                    {/* Jug Handle Hole */}
                    <path
                      d="M 100 25 L 140 25 L 140 55 L 180 75 L 180 210 C 180 220 170 220 160 220 L 80 220 C 70 220 60 220 60 210 L 60 75 L 100 55 Z"
                      className="fill-surface-container/60 stroke-outline-variant/60 dark:stroke-slate-600"
                      strokeWidth="3"
                    />
                    <path
                      d="M 145 85 C 160 85 160 145 145 145"
                      fill="none"
                      className="stroke-outline-variant/60 dark:stroke-slate-600"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                  </g>
                )}
                {selectedShape === 'drum' && (
                  <g>
                    <rect
                      x="55"
                      y="30"
                      width="130"
                      height="190"
                      rx="20"
                      className="fill-surface-container/60 stroke-outline-variant/60 dark:stroke-slate-600"
                      strokeWidth="3"
                    />
                    {/* Industrial Ribs */}
                    <line x1="55" y1="85" x2="185" y2="85" className="stroke-outline-variant/40" strokeWidth="2" />
                    <line x1="55" y1="140" x2="185" y2="140" className="stroke-outline-variant/40" strokeWidth="2" />
                  </g>
                )}

                {/* Liquid Fill Element clipped to vessel contour */}
                <g
                  clipPath={`url(#${
                    selectedShape === 'flask'
                      ? 'flaskClip'
                      : selectedShape === 'cup'
                      ? 'cupClip'
                      : selectedShape === 'bottle'
                      ? 'bottleClip'
                      : selectedShape === 'jug'
                      ? 'jugClip'
                      : 'drumClip'
                  })`}
                >
                  {/* Liquid Base Body */}
                  <rect
                    x="0"
                    y={liquidY}
                    width="240"
                    height={240 - liquidY}
                    fill="url(#liquidBlueGradient)"
                    className="transition-all duration-500 ease-out"
                  />

                  {/* Surface Meniscus Ellipse with Wave */}
                  <ellipse
                    cx="120"
                    cy={liquidY}
                    rx="65"
                    ry="6"
                    fill="url(#meniscusGlow)"
                    className="transition-all duration-500 ease-out opacity-80"
                  />

                  {/* Animated Liquid Bubbles */}
                  {fillPercentage > 15 && (
                    <g className="animate-pulse opacity-70">
                      <circle cx="105" cy={liquidY + 30} r="3" fill="#ffffff" opacity="0.6" />
                      <circle cx="130" cy={liquidY + 60} r="4" fill="#ffffff" opacity="0.5" />
                      <circle cx="115" cy={liquidY + 90} r="2.5" fill="#ffffff" opacity="0.6" />
                      <circle cx="140" cy={liquidY + 45} r="2" fill="#ffffff" opacity="0.4" />
                    </g>
                  )}

                  {/* Glass Reflection Highlight overlay */}
                  <rect x="0" y="0" width="240" height="240" fill="url(#glassReflection)" pointerEvents="none" />
                </g>

                {/* Measurement Graduation Ticks on Side */}
                <g className="stroke-on-surface-variant/50 font-data-mono text-[9px] fill-on-surface-variant select-none">
                  <line x1="60" y1="60" x2="72" y2="60" strokeWidth="1.5" />
                  <text x="76" y="63" stroke="none">100%</text>

                  <line x1="65" y1="100" x2="75" y2="100" strokeWidth="1.5" />
                  <text x="79" y="103" stroke="none">75%</text>

                  <line x1="68" y1="140" x2="78" y2="140" strokeWidth="1.5" />
                  <text x="82" y="143" stroke="none">50%</text>

                  <line x1="72" y1="180" x2="82" y2="180" strokeWidth="1.5" />
                  <text x="86" y="183" stroke="none">25%</text>
                </g>
              </svg>

              {/* Live Fill Badge in Center Overlay */}
              <div className="absolute bottom-3 right-3 px-2 py-1 rounded-lg bg-surface-container-highest/90 border border-outline-variant/30 text-[11px] font-data-mono font-bold text-primary shadow-xs">
                {fillPercentage}% Full
              </div>
            </div>

            {/* Container Name & Capacity Subtitle */}
            <div className="text-center mt-2">
              <div className="text-xs font-semibold text-on-surface">{currentCapacity.name}</div>
              <div className="text-[11px] text-on-surface-variant font-data-mono">{currentCapacity.label}</div>
            </div>
          </div>

          {/* Liquid Telemetry & Scale Details (5 Cols) */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/25 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs text-on-surface-variant">
                <span className="font-label-caps uppercase font-semibold">Active Liquid Fill</span>
                <span className="font-data-mono font-semibold text-primary">{clampedLiters.toFixed(3)} Liters</span>
              </div>

              <div className="w-full bg-surface-container rounded-full h-3 overflow-hidden p-0.5 border border-outline-variant/20">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(2, fillPercentage))}%` }}
                ></div>
              </div>

              <div className="flex justify-between text-[11px] text-on-surface-variant font-data-mono pt-1">
                <span>0 L</span>
                <span>Vessel: {currentCapacity.label}</span>
              </div>
            </div>

            {/* Dimensional Context Readouts */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-1">
                <span className="text-[10px] font-label-caps uppercase text-on-surface-variant font-semibold">Input</span>
                <span className="font-data-mono font-bold text-sm text-on-surface truncate">
                  {inputValue} {fromUnit.symbol}
                </span>
                <span className="text-[10px] text-on-surface-variant truncate">{fromUnit.name}</span>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-1">
                <span className="text-[10px] font-label-caps uppercase text-on-surface-variant font-semibold">Equivalent</span>
                <span className="font-data-mono font-bold text-sm text-primary truncate">
                  {resultValue.toLocaleString(undefined, { maximumFractionDigits: 4 })} {toUnit.symbol}
                </span>
                <span className="text-[10px] text-on-surface-variant truncate">{toUnit.name}</span>
              </div>
            </div>

            {/* Quick Capacity Alert Note */}
            <div className="p-3 rounded-xl bg-surface-container-low/60 border border-outline-variant/20 text-xs text-on-surface-variant flex items-start gap-2">
              <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">info</span>
              <p className="leading-relaxed">
                {fillPercentage >= 100 ? (
                  <span>
                    Volume exceeds this {currentCapacity.name.toLowerCase()} capacity. Switch to the <strong>Gallon Jug</strong> or <strong>Industrial Drum</strong> above.
                  </span>
                ) : (
                  <span>
                    A volume of <strong>{inputValue} {fromUnit.symbol}</strong> fills approximately <strong>{fillPercentage}%</strong> of a standard {currentCapacity.name.toLowerCase()}.
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Real-World Household Physical Equivalents Tab */
        <div className="space-y-4">
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Understanding {inputValue} {fromUnit.name} ({clampedLiters.toFixed(3)} L) in terms of common household and commercial volume references:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {HOUSEHOLD_ITEMS.map((item) => {
              const count = clampedLiters / item.litersEach;
              const formattedCount =
                count < 0.01
                  ? count.toExponential(2)
                  : count < 10
                  ? count.toFixed(2)
                  : count.toLocaleString(undefined, { maximumFractionDigits: 1 });

              return (
                <div
                  key={item.name}
                  className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/25 hover:border-primary/40 transition-all flex items-start gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-on-surface truncate">{item.name}</div>
                    <div className="text-[11px] text-on-surface-variant truncate">{item.description}</div>
                    <div className="mt-1 flex items-baseline gap-1 font-data-mono">
                      <span className="text-base font-bold text-primary">{formattedCount}</span>
                      <span className="text-xs text-on-surface-variant">{item.unitLabel}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
