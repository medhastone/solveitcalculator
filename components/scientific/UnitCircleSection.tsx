'use client';

import React, { useState } from 'react';

interface AnglePreset {
  deg: number;
  radStr: string;
  cosStr: string;
  sinStr: string;
}

const PRESET_ANGLES: AnglePreset[] = [
  { deg: 0, radStr: '0', cosStr: '1', sinStr: '0' },
  { deg: 30, radStr: 'π/6', cosStr: '√3/2', sinStr: '1/2' },
  { deg: 45, radStr: 'π/4', cosStr: '√2/2', sinStr: '√2/2' },
  { deg: 60, radStr: 'π/3', cosStr: '1/2', sinStr: '√3/2' },
  { deg: 90, radStr: 'π/2', cosStr: '0', sinStr: '1' },
  { deg: 120, radStr: '2π/3', cosStr: '-1/2', sinStr: '√3/2' },
  { deg: 135, radStr: '3π/4', cosStr: '-√2/2', sinStr: '√2/2' },
  { deg: 180, radStr: 'π', cosStr: '-1', sinStr: '0' },
  { deg: 270, radStr: '3π/2', cosStr: '0', sinStr: '-1' },
];

export default function UnitCircleSection() {
  const [selectedAngle, setSelectedAngle] = useState<AnglePreset>(PRESET_ANGLES[2]); // 45 deg default

  const rad = selectedAngle.deg * (Math.PI / 180);
  const cosVal = Math.cos(rad);
  const sinVal = Math.sin(rad);
  const isTanUndefined = selectedAngle.deg === 90 || selectedAngle.deg === 270;
  const tanVal = isTanUndefined ? 'Undefined' : Math.tan(rad).toFixed(4);

  // SVG Geometry (320 x 320 canvas, center 160, 160, radius 120)
  const cx = 160;
  const cy = 160;
  const r = 120;
  const px = cx + r * cosVal;
  const py = cy - r * sinVal;

  return (
    <section className="max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop w-full py-space-xl space-y-space-lg">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-label-caps font-label-caps text-primary uppercase tracking-wider font-semibold">
            <span className="material-symbols-outlined text-[15px]">trip_origin</span>
            <span>Analytic Geometry & Trigonometry</span>
          </div>
          <h2 className="text-headline-lg font-headline-lg text-on-surface">
            Interactive Unit Circle & Trigonometric Identities
          </h2>
          <p className="text-body-md font-body-md text-on-surface-variant max-w-2xl">
            Visualizing angular rotation, quadrant sine/cosine projections, and exact radical representations on the cartesian coordinate plane.
          </p>
        </div>

        {/* Live Angle Selection Chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {PRESET_ANGLES.map((angle) => {
            const isSelected = selectedAngle.deg === angle.deg;
            return (
              <button
                key={angle.deg}
                onClick={() => setSelectedAngle(angle)}
                className={`px-2.5 py-1 rounded-lg text-body-sm font-data-mono transition-all ${
                  isSelected
                    ? 'bg-primary text-on-primary shadow-sm font-bold'
                    : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                }`}
              >
                {angle.deg}° ({angle.radStr})
              </button>
            );
          })}
        </div>
      </div>

      {/* Split Visual Unit Circle & Trigonometric Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
        {/* Left: Dynamic SVG Unit Circle Graphic */}
        <div className="lg:col-span-6 bg-surface-container-lowest rounded-xl p-space-lg shadow-md flex flex-col items-center justify-center relative border border-outline-variant/20">
          <div className="w-full max-w-[340px] aspect-square relative flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 320 320">
              {/* Background Radial Grids */}
              <circle
                className="text-surface-container-highest"
                cx="160"
                cy="160"
                fill="none"
                r="120"
                stroke="currentColor"
                strokeWidth="2"
              />
              <circle
                className="text-surface-container"
                cx="160"
                cy="160"
                fill="none"
                r="80"
                stroke="currentColor"
                strokeDasharray="3 3"
                strokeWidth="1"
              />

              {/* Axes */}
              <line className="text-outline-variant" stroke="currentColor" strokeWidth="1.5" x1="20" x2="300" y1="160" y2="160" />
              <line className="text-outline-variant" stroke="currentColor" strokeWidth="1.5" x1="160" x2="160" y1="20" y2="300" />

              {/* Cardinal Degree Ticks */}
              <circle className="fill-primary" cx="280" cy="160" r="3" />
              <circle className="fill-primary" cx="160" cy="40" r="3" />
              <circle className="fill-primary" cx="40" cy="160" r="3" />
              <circle className="fill-primary" cx="160" cy="280" r="3" />

              {/* Dynamic Projection Triangle */}
              <polygon
                className="fill-primary/10 stroke-primary/30"
                points={`${cx},${cy} ${px},${cy} ${px},${py}`}
                strokeWidth="1.5"
              />

              {/* Cosine projection line (X axis) */}
              <line
                className="text-primary"
                stroke="currentColor"
                strokeWidth="3"
                x1={cx}
                x2={px}
                y1={cy}
                y2={cy}
              />

              {/* Sine projection line (Y axis) */}
              <line
                className="text-tertiary"
                stroke="currentColor"
                strokeWidth="3"
                x1={px}
                x2={px}
                y1={cy}
                y2={py}
              />

              {/* Radius Vector */}
              <line
                className="text-secondary"
                stroke="currentColor"
                strokeWidth="2.5"
                x1={cx}
                x2={px}
                y1={cy}
                y2={py}
              />

              {/* Coordinate Point */}
              <circle className="fill-primary" cx={px} cy={py} r="5" />

              {/* Axis Labels */}
              <text className="text-[11px] font-data-mono fill-outline font-semibold" x="302" y="164">
                x (cos)
              </text>
              <text className="text-[11px] font-data-mono fill-outline font-semibold" x="164" y="24">
                y (sin)
              </text>
              <text className="text-[12px] font-data-mono fill-primary font-bold" x="175" y="150">
                {selectedAngle.deg}°
              </text>
            </svg>
          </div>

          <div className="mt-4 flex items-center gap-4 text-body-sm font-data-mono flex-wrap justify-center">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-primary rounded"></span>
              <span className="text-on-surface">cos(θ) = {cosVal.toFixed(4)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-tertiary rounded"></span>
              <span className="text-on-surface">sin(θ) = {sinVal.toFixed(4)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-secondary rounded"></span>
              <span className="text-on-surface">r = 1.0</span>
            </div>
          </div>
        </div>

        {/* Right: Trigonometric Ratios & Core Pythagorean Identities */}
        <div className="lg:col-span-6 space-y-space-sm">
          {/* Live Selected Angle Coordinates Card */}
          <div className="bg-surface-container rounded-xl p-space-md shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-label-caps font-label-caps uppercase text-primary tracking-wider font-bold">
                Active Angle State
              </span>
              <span className="font-data-mono text-body-sm font-bold text-on-surface">
                θ = {selectedAngle.deg}° ({selectedAngle.radStr} rad)
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="p-2 bg-surface-container-lowest rounded-lg shadow-xs">
                <span className="text-label-caps text-outline uppercase block font-medium">Cosine (x)</span>
                <span className="font-data-mono font-bold text-primary text-body-sm">
                  {selectedAngle.cosStr} ≈ {cosVal.toFixed(4)}
                </span>
              </div>
              <div className="p-2 bg-surface-container-lowest rounded-lg shadow-xs">
                <span className="text-label-caps text-outline uppercase block font-medium">Sine (y)</span>
                <span className="font-data-mono font-bold text-tertiary text-body-sm">
                  {selectedAngle.sinStr} ≈ {sinVal.toFixed(4)}
                </span>
              </div>
              <div className="p-2 bg-surface-container-lowest rounded-lg shadow-xs">
                <span className="text-label-caps text-outline uppercase block font-medium">Tangent (y/x)</span>
                <span className="font-data-mono font-bold text-secondary text-body-sm">
                  {tanVal}
                </span>
              </div>
            </div>
          </div>

          {/* SOH CAH TOA Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-surface-container-lowest rounded-xl shadow-xs border border-outline-variant/20">
              <p className="font-label-caps text-label-caps uppercase text-primary font-bold">SOH</p>
              <p className="font-headline-md text-headline-md text-on-surface text-sm mt-0.5">sin θ = O / H</p>
              <p className="text-body-sm text-outline text-[12px]">Opposite over Hypotenuse</p>
            </div>
            <div className="p-3 bg-surface-container-lowest rounded-xl shadow-xs border border-outline-variant/20">
              <p className="font-label-caps text-label-caps uppercase text-primary font-bold">CAH</p>
              <p className="font-headline-md text-headline-md text-on-surface text-sm mt-0.5">cos θ = A / H</p>
              <p className="text-body-sm text-outline text-[12px]">Adjacent over Hypotenuse</p>
            </div>
            <div className="p-3 bg-surface-container-lowest rounded-xl shadow-xs border border-outline-variant/20">
              <p className="font-label-caps text-label-caps uppercase text-primary font-bold">TOA</p>
              <p className="font-headline-md text-headline-md text-on-surface text-sm mt-0.5">tan θ = O / A</p>
              <p className="text-body-sm text-outline text-[12px]">Opposite over Adjacent</p>
            </div>
          </div>

          {/* 3 Fundamental Pythagorean Identities */}
          <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-xs space-y-2 border border-outline-variant/20">
            <span className="text-label-caps font-label-caps uppercase text-outline tracking-wider block font-semibold">
              Pythagorean Trigonometric Invariants
            </span>
            <div className="space-y-1.5 font-data-mono text-body-sm">
              <div className="flex items-center justify-between p-2 rounded bg-surface-container-low">
                <span className="text-on-surface">sin²(θ) + cos²(θ) = 1</span>
                <span className="text-outline text-[11px]">Primary Circle Metric</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-surface-container-low">
                <span className="text-on-surface">1 + tan²(θ) = sec²(θ)</span>
                <span className="text-outline text-[11px]">Secant Equivalence</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-surface-container-low">
                <span className="text-on-surface">1 + cot²(θ) = csc²(θ)</span>
                <span className="text-outline text-[11px]">Cosecant Equivalence</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
