'use client';

import React, { useState, useMemo } from 'react';

export default function InteractiveMathVisuals() {
  const [activeVisual, setActiveVisual] = useState<'unit-circle' | 'function-graph' | 'normal-dist' | 'coordinate' | 'triangle'>('unit-circle');

  // --- 1. Unit Circle State ---
  const [angleDeg, setAngleDeg] = useState(45);
  const angleRad = (angleDeg * Math.PI) / 180;
  const unitCos = Math.cos(angleRad);
  const unitSin = Math.sin(angleRad);
  const unitTan = Math.abs(unitCos) > 0.0001 ? (unitSin / unitCos).toFixed(3) : 'Undefined';

  // --- 2. Function Graph State (Parabola: y = ax² + bx + c) ---
  const [parabolaA, setParabolaA] = useState(1);
  const [parabolaB, setParabolaB] = useState(0);
  const [parabolaC, setParabolaC] = useState(-4);

  const vertexX = parabolaA !== 0 ? -parabolaB / (2 * parabolaA) : 0;
  const vertexY = parabolaA * vertexX * vertexX + parabolaB * vertexX + parabolaC;
  const discriminant = parabolaB * parabolaB - 4 * parabolaA * parabolaC;

  // --- 3. Normal Distribution State ---
  const [normMean, setNormMean] = useState(100);
  const [normStd, setNormStd] = useState(15);
  const [normZValue, setNormZValue] = useState(115);
  const calculatedZ = normStd !== 0 ? ((normZValue - normMean) / normStd).toFixed(2) : '0';

  // --- 4. Coordinate Geometry State ---
  const [p1X, setP1X] = useState(2);
  const [p1Y, setP1Y] = useState(3);
  const [p2X, setP2X] = useState(8);
  const [p2Y, setP2Y] = useState(11);

  const coordDistance = Math.sqrt(Math.pow(p2X - p1X, 2) + Math.pow(p2Y - p1Y, 2)).toFixed(2);
  const coordMidX = ((p1X + p2X) / 2).toFixed(1);
  const coordMidY = ((p1Y + p2Y) / 2).toFixed(1);
  const coordSlope = p2X !== p1X ? ((p2Y - p1Y) / (p2X - p1X)).toFixed(2) : 'Undefined (Vertical)';

  // --- 5. Triangle Explorer State (Right Triangle: a, b) ---
  const [triA, setTriA] = useState(6);
  const [triB, setTriB] = useState(8);
  const triHyp = Math.sqrt(triA * triA + triB * triB).toFixed(2);
  const triArea = ((triA * triB) / 2).toFixed(1);
  const triAngleA = ((Math.atan(triA / triB) * 180) / Math.PI).toFixed(1);
  const triAngleB = ((Math.atan(triB / triA) * 180) / Math.PI).toFixed(1);

  return (
    <section id="interactive-visuals" className="w-full py-14 px-4 sm:px-6 lg:px-8 bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="text-xs uppercase tracking-wider font-semibold text-primary mb-1">
            Dynamic Explorations
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
            Interactive Math Visuals
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-2">
            Explore geometric coordinates, trigonometric vectors, parabolas, and probability curves with real-time visual feedback.
          </p>
        </div>

        {/* Visualizer Mode Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {[
            { id: 'unit-circle', label: 'Unit Circle', icon: 'incomplete_circle' },
            { id: 'function-graph', label: 'Function Graphs', icon: 'show_chart' },
            { id: 'normal-dist', label: 'Normal Distribution', icon: 'bar_chart' },
            { id: 'coordinate', label: 'Coordinate Geometry', icon: 'grid_4x4' },
            { id: 'triangle', label: 'Triangle Explorer', icon: 'change_history' },
          ].map((tab) => {
            const isSelected = activeVisual === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveVisual(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'bg-surface-container-low text-on-surface hover:bg-surface-container border border-outline-variant/20'
                }`}
              >
                <span className="material-symbols-outlined text-base">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Visualizer Workbench */}
        <div className="p-6 sm:p-8 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm">
          {/* 1. UNIT CIRCLE */}
          {activeVisual === 'unit-circle' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 flex flex-col items-center justify-center">
                <svg viewBox="-140 -140 280 280" className="w-64 h-64 sm:w-80 sm:h-80 drop-shadow-sm">
                  {/* Axes */}
                  <line x1="-130" y1="0" x2="130" y2="0" stroke="currentColor" strokeWidth="1.5" className="text-outline-variant/40" />
                  <line x1="0" y1="-130" x2="0" y2="130" stroke="currentColor" strokeWidth="1.5" className="text-outline-variant/40" />
                  
                  {/* Unit Circle */}
                  <circle cx="0" cy="0" r="100" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary/30" />
                  
                  {/* Angle Arc */}
                  <path
                    d={`M 25 0 A 25 25 0 ${angleDeg > 180 ? 1 : 0} 0 ${25 * Math.cos(-angleRad)} ${25 * Math.sin(-angleRad)}`}
                    fill="none"
                    stroke="#4f46e5"
                    strokeWidth="2"
                  />

                  {/* Radius vector */}
                  <line
                    x1="0"
                    y1="0"
                    x2={100 * unitCos}
                    y2={-100 * unitSin}
                    stroke="#4f46e5"
                    strokeWidth="2.5"
                  />

                  {/* Component lines: cos and sin */}
                  <line
                    x1="0"
                    y1="0"
                    x2={100 * unitCos}
                    y2="0"
                    stroke="#0284c7"
                    strokeWidth="2"
                    strokeDasharray="3 3"
                  />
                  <line
                    x1={100 * unitCos}
                    y1="0"
                    x2={100 * unitCos}
                    y2={-100 * unitSin}
                    stroke="#16a34a"
                    strokeWidth="2"
                    strokeDasharray="3 3"
                  />

                  {/* Terminal Point */}
                  <circle cx={100 * unitCos} cy={-100 * unitSin} r="5" fill="#4f46e5" />
                </svg>
              </div>

              <div className="lg:col-span-6 space-y-5">
                <div>
                  <h3 className="text-xl font-bold text-on-surface">Unit Circle Angle Explorer</h3>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Rotate the terminal ray to observe how sine (vertical), cosine (horizontal), and tangent vary across all four quadrants.
                  </p>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-on-surface mb-1">
                    <span>Angle (θ): {angleDeg}°</span>
                    <span className="font-mono">{(angleRad / Math.PI).toFixed(2)}π rad</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={angleDeg}
                    onChange={(e) => setAngleDeg(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-surface border border-outline-variant/20 text-center">
                    <div className="text-[10px] font-semibold text-sky-600 dark:text-sky-400 uppercase">cos(θ) [x]</div>
                    <div className="font-mono font-bold text-sm sm:text-base text-on-surface mt-0.5">{unitCos.toFixed(3)}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-surface border border-outline-variant/20 text-center">
                    <div className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase">sin(θ) [y]</div>
                    <div className="font-mono font-bold text-sm sm:text-base text-on-surface mt-0.5">{unitSin.toFixed(3)}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-surface border border-outline-variant/20 text-center">
                    <div className="text-[10px] font-semibold text-primary uppercase">tan(θ) [y/x]</div>
                    <div className="font-mono font-bold text-sm sm:text-base text-on-surface mt-0.5">{unitTan}</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  <span className="text-xs font-semibold text-on-surface-variant mr-1">Common angles:</span>
                  {[0, 30, 45, 60, 90, 180, 270].map((deg) => (
                    <button
                      key={deg}
                      type="button"
                      onClick={() => setAngleDeg(deg)}
                      className="px-2 py-0.5 rounded bg-surface-container text-xs font-mono hover:bg-primary hover:text-on-primary transition-colors"
                    >
                      {deg}°
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. FUNCTION GRAPHS (Parabola) */}
          {activeVisual === 'function-graph' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 flex flex-col items-center justify-center">
                <svg viewBox="-100 -100 200 200" className="w-64 h-64 sm:w-80 sm:h-80 drop-shadow-sm bg-surface rounded-2xl border border-outline-variant/20 p-2">
                  {/* Grid lines */}
                  <line x1="-90" y1="0" x2="90" y2="0" stroke="currentColor" strokeWidth="1" className="text-outline-variant/40" />
                  <line x1="0" y1="-90" x2="0" y2="90" stroke="currentColor" strokeWidth="1" className="text-outline-variant/40" />

                  {/* Parabola curve */}
                  {(() => {
                    const points: string[] = [];
                    for (let x = -8; x <= 8; x += 0.25) {
                      const y = parabolaA * x * x + parabolaB * x + parabolaC;
                      // map x to svg: x * 10, y to -y * 5
                      const sx = x * 10;
                      const sy = -y * 5;
                      if (sy >= -90 && sy <= 90) {
                        points.push(`${sx.toFixed(1)},${sy.toFixed(1)}`);
                      }
                    }
                    return (
                      <polyline
                        fill="none"
                        stroke="#4f46e5"
                        strokeWidth="2.5"
                        points={points.join(' ')}
                      />
                    );
                  })()}

                  {/* Vertex marker */}
                  {vertexY * -5 >= -90 && vertexY * -5 <= 90 && (
                    <circle cx={vertexX * 10} cy={-vertexY * 5} r="4" fill="#dc2626" />
                  )}
                </svg>
              </div>

              <div className="lg:col-span-6 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-on-surface">Parabola Function Grapher</h3>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Adjust coefficients in the quadratic equation <span className="font-mono font-semibold">y = ax² + bx + c</span> to see real-time shifts in concavity, vertex, and roots.
                  </p>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>a (concavity): {parabolaA}</span>
                    </div>
                    <input
                      type="range"
                      min="-3"
                      max="3"
                      step="0.5"
                      value={parabolaA}
                      onChange={(e) => setParabolaA(Number(e.target.value) || 1)}
                      className="w-full accent-primary"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span>b (horizontal shift): {parabolaB}</span>
                    </div>
                    <input
                      type="range"
                      min="-6"
                      max="6"
                      step="1"
                      value={parabolaB}
                      onChange={(e) => setParabolaB(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span>c (y-intercept): {parabolaC}</span>
                    </div>
                    <input
                      type="range"
                      min="-8"
                      max="8"
                      step="1"
                      value={parabolaC}
                      onChange={(e) => setParabolaC(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-surface border border-outline-variant/20 space-y-1.5 text-xs">
                  <div className="font-mono text-primary font-bold text-sm">
                    y = {parabolaA}x² {parabolaB >= 0 ? `+ ${parabolaB}` : `- ${Math.abs(parabolaB)}`}x {parabolaC >= 0 ? `+ ${parabolaC}` : `- ${Math.abs(parabolaC)}`}
                  </div>
                  <div>
                    <span className="font-semibold text-on-surface">Vertex Coordinates: </span>
                    <span className="font-mono">({vertexX.toFixed(2)}, {vertexY.toFixed(2)})</span>
                  </div>
                  <div>
                    <span className="font-semibold text-on-surface">Discriminant (Δ): </span>
                    <span className="font-mono">{discriminant.toFixed(1)}</span>{' '}
                    <span className="text-[11px] text-on-surface-variant">
                      ({discriminant > 0 ? '2 Real Roots' : discriminant === 0 ? '1 Real Root' : 'Complex Conjugate Roots'})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. NORMAL DISTRIBUTION */}
          {activeVisual === 'normal-dist' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 flex flex-col items-center justify-center">
                <svg viewBox="0 0 300 160" className="w-full max-w-sm drop-shadow-sm bg-surface rounded-2xl border border-outline-variant/20 p-2">
                  {/* Axis */}
                  <line x1="20" y1="130" x2="280" y2="130" stroke="currentColor" strokeWidth="1.5" className="text-outline-variant/40" />

                  {/* Bell Curve */}
                  {(() => {
                    const pts: string[] = [];
                    for (let x = -3; x <= 3; x += 0.1) {
                      const y = Math.exp(-0.5 * x * x);
                      const sx = 150 + x * 40;
                      const sy = 130 - y * 100;
                      pts.push(`${sx.toFixed(1)},${sy.toFixed(1)}`);
                    }
                    return (
                      <polyline
                        fill="none"
                        stroke="#4f46e5"
                        strokeWidth="2.5"
                        points={pts.join(' ')}
                      />
                    );
                  })()}

                  {/* Center mean mark */}
                  <line x1="150" y1="20" x2="150" y2="130" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="3 3" />
                  <text x="150" y="145" textAnchor="middle" fontSize="10" fill="currentColor">μ = {normMean}</text>

                  {/* Z point */}
                  {(() => {
                    const z = parseFloat(calculatedZ);
                    const clampedZ = Math.max(-3, Math.min(3, z));
                    const sx = 150 + clampedZ * 40;
                    return (
                      <>
                        <line x1={sx} y1="30" x2={sx} y2="130" stroke="#dc2626" strokeWidth="2" />
                        <circle cx={sx} cy="30" r="4" fill="#dc2626" />
                        <text x={sx} y="20" textAnchor="middle" fontSize="10" fill="#dc2626" fontWeight="bold">X = {normZValue}</text>
                      </>
                    );
                  })()}
                </svg>
              </div>

              <div className="lg:col-span-6 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-on-surface">Gaussian Normal Curve Visualizer</h3>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Calculate standardized z-scores: <span className="font-mono">z = (X - μ) / σ</span>. Explore standard deviations from the arithmetic center.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-on-surface-variant">Mean (μ)</label>
                    <input
                      type="number"
                      value={normMean}
                      onChange={(e) => setNormMean(Number(e.target.value))}
                      className="w-full mt-1 p-2 rounded-lg bg-surface border border-outline-variant/30 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-on-surface-variant">Std Dev (σ)</label>
                    <input
                      type="number"
                      value={normStd}
                      onChange={(e) => setNormStd(Number(e.target.value) || 1)}
                      className="w-full mt-1 p-2 rounded-lg bg-surface border border-outline-variant/30 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-on-surface-variant">Value (X)</label>
                    <input
                      type="number"
                      value={normZValue}
                      onChange={(e) => setNormZValue(Number(e.target.value))}
                      className="w-full mt-1 p-2 rounded-lg bg-surface border border-outline-variant/30 text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-surface border border-outline-variant/20 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-on-surface">Computed Z-Score:</span>
                    <span className="font-mono font-bold text-primary text-base">z = {calculatedZ}</span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant leading-relaxed">
                    A z-score of {calculatedZ} indicates that the value {normZValue} lies {calculatedZ} standard deviations {parseFloat(calculatedZ) >= 0 ? 'above' : 'below'} the mean ({normMean}).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 4. COORDINATE GEOMETRY */}
          {activeVisual === 'coordinate' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 flex flex-col items-center justify-center">
                <svg viewBox="0 0 200 200" className="w-64 h-64 sm:w-80 sm:h-80 drop-shadow-sm bg-surface rounded-2xl border border-outline-variant/20 p-2">
                  {/* Grid Lines */}
                  <line x1="10" y1="190" x2="190" y2="190" stroke="currentColor" strokeWidth="1" className="text-outline-variant/40" />
                  <line x1="10" y1="10" x2="10" y2="190" stroke="currentColor" strokeWidth="1" className="text-outline-variant/40" />

                  {/* Line between p1 and p2 */}
                  {/* Scale: coord 0-14 -> svg 10 to 180 */}
                  {(() => {
                    const x1 = 10 + p1X * 12;
                    const y1 = 190 - p1Y * 12;
                    const x2 = 10 + p2X * 12;
                    const y2 = 190 - p2Y * 12;
                    const mx = 10 + parseFloat(coordMidX) * 12;
                    const my = 190 - parseFloat(coordMidY) * 12;

                    return (
                      <>
                        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#4f46e5" strokeWidth="2.5" />
                        <circle cx={x1} cy={y1} r="5" fill="#0284c7" />
                        <circle cx={x2} cy={y2} r="5" fill="#0284c7" />
                        <circle cx={mx} cy={my} r="4" fill="#dc2626" />
                        <text x={x1 - 5} y={y1 - 8} fontSize="9" fill="currentColor" fontWeight="bold">P₁({p1X},{p1Y})</text>
                        <text x={x2 - 5} y={y2 - 8} fontSize="9" fill="currentColor" fontWeight="bold">P₂({p2X},{p2Y})</text>
                        <text x={mx + 5} y={my + 4} fontSize="8" fill="#dc2626">Midpoint</text>
                      </>
                    );
                  })()}
                </svg>
              </div>

              <div className="lg:col-span-6 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-on-surface">2D Coordinate Geometry Solver</h3>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Calculate straight-line Euclidean distance, segment midpoint, and slope rate between two Cartesian coordinate points.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="space-y-2 p-3 rounded-xl bg-surface border border-outline-variant/20">
                    <div className="font-semibold text-primary">Point 1 (x₁, y₁)</div>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={p1X}
                        onChange={(e) => setP1X(Number(e.target.value))}
                        className="w-1/2 p-2 rounded bg-surface-container border border-outline-variant/20 font-mono"
                        placeholder="x₁"
                      />
                      <input
                        type="number"
                        value={p1Y}
                        onChange={(e) => setP1Y(Number(e.target.value))}
                        className="w-1/2 p-2 rounded bg-surface-container border border-outline-variant/20 font-mono"
                        placeholder="y₁"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 p-3 rounded-xl bg-surface border border-outline-variant/20">
                    <div className="font-semibold text-primary">Point 2 (x₂, y₂)</div>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={p2X}
                        onChange={(e) => setP2X(Number(e.target.value))}
                        className="w-1/2 p-2 rounded bg-surface-container border border-outline-variant/20 font-mono"
                        placeholder="x₂"
                      />
                      <input
                        type="number"
                        value={p2Y}
                        onChange={(e) => setP2Y(Number(e.target.value))}
                        className="w-1/2 p-2 rounded bg-surface-container border border-outline-variant/20 font-mono"
                        placeholder="y₂"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center text-xs">
                  <div className="p-3 rounded-xl bg-surface border border-outline-variant/20">
                    <div className="text-[10px] text-on-surface-variant font-semibold">Distance (d)</div>
                    <div className="font-mono font-bold text-primary text-sm mt-0.5">{coordDistance}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-surface border border-outline-variant/20">
                    <div className="text-[10px] text-on-surface-variant font-semibold">Midpoint (M)</div>
                    <div className="font-mono font-bold text-on-surface text-sm mt-0.5">({coordMidX}, {coordMidY})</div>
                  </div>
                  <div className="p-3 rounded-xl bg-surface border border-outline-variant/20">
                    <div className="text-[10px] text-on-surface-variant font-semibold">Slope (m)</div>
                    <div className="font-mono font-bold text-on-surface text-sm mt-0.5">{coordSlope}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 5. TRIANGLE EXPLORER */}
          {activeVisual === 'triangle' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 flex flex-col items-center justify-center">
                <svg viewBox="0 0 200 200" className="w-64 h-64 sm:w-80 sm:h-80 drop-shadow-sm bg-surface rounded-2xl border border-outline-variant/20 p-2">
                  {/* Triangle points: (30, 170) to (30 + b*12, 170) to (30, 170 - a*12) */}
                  {(() => {
                    const ox = 30;
                    const oy = 170;
                    const bx = Math.min(180, ox + triB * 14);
                    const ay = Math.max(20, oy - triA * 14);

                    return (
                      <>
                        <polygon
                          points={`${ox},${oy} ${bx},${oy} ${ox},${ay}`}
                          fill="rgba(79, 70, 229, 0.1)"
                          stroke="#4f46e5"
                          strokeWidth="2.5"
                        />
                        {/* Right angle square indicator */}
                        <polyline
                          points={`${ox},${oy - 12} ${ox + 12},${oy - 12} ${ox + 12},${oy}`}
                          fill="none"
                          stroke="#4f46e5"
                          strokeWidth="1.5"
                        />
                        <text x={ox - 18} y={(oy + ay) / 2} fontSize="11" fill="currentColor" fontWeight="bold">a={triA}</text>
                        <text x={(ox + bx) / 2} y={oy + 16} fontSize="11" fill="currentColor" fontWeight="bold">b={triB}</text>
                        <text x={(ox + bx) / 2 + 6} y={(oy + ay) / 2 - 6} fontSize="11" fill="#4f46e5" fontWeight="bold">c={triHyp}</text>
                      </>
                    );
                  })()}
                </svg>
              </div>

              <div className="lg:col-span-6 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-on-surface">Right Triangle &amp; Pythagorean Explorer</h3>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Apply <span className="font-mono font-semibold">a² + b² = c²</span> to dynamically determine the hypotenuse, enclosed area, and acute angles.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-semibold text-on-surface">Leg a (height): {triA}</label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={triA}
                      onChange={(e) => setTriA(Number(e.target.value))}
                      className="w-full accent-primary mt-1"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-on-surface">Leg b (base): {triB}</label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={triB}
                      onChange={(e) => setTriB(Number(e.target.value))}
                      className="w-full accent-primary mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center text-xs">
                  <div className="p-3 rounded-xl bg-surface border border-outline-variant/20">
                    <div className="text-[10px] text-on-surface-variant font-semibold">Hypotenuse (c)</div>
                    <div className="font-mono font-bold text-primary text-sm mt-0.5">{triHyp}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-surface border border-outline-variant/20">
                    <div className="text-[10px] text-on-surface-variant font-semibold">Surface Area</div>
                    <div className="font-mono font-bold text-on-surface text-sm mt-0.5">{triArea}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-surface border border-outline-variant/20">
                    <div className="text-[10px] text-on-surface-variant font-semibold">Acute Angles</div>
                    <div className="font-mono font-bold text-on-surface text-sm mt-0.5">{triAngleA}° / {triAngleB}°</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
