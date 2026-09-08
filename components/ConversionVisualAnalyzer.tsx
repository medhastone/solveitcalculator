'use client';

import React, { useMemo } from 'react';
import { UnitDefinition, CategoryDefinition, convertValue, formatResult } from '@/lib/conversions';

interface ConversionVisualAnalyzerProps {
  category: CategoryDefinition;
  fromUnit: UnitDefinition;
  toUnit: UnitDefinition;
  inputValue: number;
  resultValue: number;
  formattedResult: string;
  onSelectValue?: (val: number) => void;
}

export default function ConversionVisualAnalyzer({
  category,
  fromUnit,
  toUnit,
  inputValue,
  resultValue,
  formattedResult,
  onSelectValue
}: ConversionVisualAnalyzerProps) {
  // Determine scale range [xMin, xMax]
  const { xMin, xMax } = useMemo(() => {
    if (category.id === 'temperature') {
      if (fromUnit.id === 'c') return { xMin: -40, xMax: 120 };
      if (fromUnit.id === 'f') return { xMin: -40, xMax: 250 };
      if (fromUnit.id === 'k') return { xMin: 200, xMax: 400 };
      return { xMin: -40, xMax: 150 };
    }
    const val = Math.abs(inputValue) || 1;
    let max = 100;
    if (val > 50) {
      const exp = Math.ceil(Math.log10(val * 1.5));
      max = Math.pow(10, exp);
    } else if (val <= 5) {
      max = 10;
    } else if (val <= 20) {
      max = 30;
    } else {
      max = 100;
    }
    return { xMin: 0, xMax: max };
  }, [category.id, fromUnit.id, inputValue]);

  // Normalized gauge percentage (0 to 100%)
  const gaugePct = useMemo(() => {
    const range = xMax - xMin;
    if (range <= 0) return 50;
    const clamped = Math.max(xMin, Math.min(xMax, inputValue));
    return ((clamped - xMin) / range) * 100;
  }, [inputValue, xMin, xMax]);

  // Needle angle (-140deg to +140deg)
  const needleDeg = useMemo(() => {
    return -140 + (gaugePct / 100) * 280;
  }, [gaugePct]);

  // Operational Scale Band
  const scaleBand = useMemo(() => {
    if (gaugePct < 20) {
      return { name: 'Micro / Sub-Nominal', color: 'text-sky-500', dot: 'bg-sky-500', desc: 'Precision low-magnitude band' };
    } else if (gaugePct <= 60) {
      return { name: 'Everyday Human Scale', color: 'text-primary', dot: 'bg-primary', desc: 'Standard operating sweetspot' };
    } else if (gaugePct <= 85) {
      return { name: 'Elevated / Industrial', color: 'text-emerald-500', dot: 'bg-emerald-500', desc: 'Heavy engineering magnitude' };
    } else {
      return { name: 'Extreme Scale', color: 'text-error', dot: 'bg-error', desc: 'High-magnitude upper boundary' };
    }
  }, [gaugePct]);

  // Generate 16 curve sample points for the 2D graph
  const graphData = useMemo(() => {
    const pointsCount = 16;
    const pts: { x: number; y: number }[] = [];
    const step = (xMax - xMin) / (pointsCount - 1);

    for (let i = 0; i < pointsCount; i++) {
      const x = xMin + i * step;
      // Avoid 0 in inverse fuel economy
      const evalX = category.id === 'fuel_economy' && x <= 0 ? 0.01 : x;
      const res = convertValue(evalX, category.id, fromUnit.id, toUnit.id);
      pts.push({ x: Number(evalX.toFixed(2)), y: isNaN(res.resultNumber) ? 0 : res.resultNumber });
    }

    const yVals = pts.map((p) => p.y);
    const yMin = Math.min(...yVals);
    const yMax = Math.max(...yVals);

    return { pts, yMin, yMax };
  }, [category.id, fromUnit.id, toUnit.id, xMin, xMax]);

  // SVG Chart Dimensions
  const svgWidth = 340;
  const svgHeight = 150;
  const padL = 42;
  const padR = 20;
  const padT = 20;
  const padB = 28;

  const chartW = svgWidth - padL - padR;
  const chartH = svgHeight - padT - padB;

  // Transform coordinates to SVG space
  const svgPoints = useMemo(() => {
    const { pts, yMin, yMax } = graphData;
    const yRange = yMax - yMin || 1;
    const xRange = xMax - xMin || 1;

    return pts.map((p) => {
      const sx = padL + ((p.x - xMin) / xRange) * chartW;
      const sy = padT + chartH - ((p.y - yMin) / yRange) * chartH;
      return { ...p, sx, sy };
    });
  }, [graphData, xMin, xMax, chartW, chartH, padL, padT]);

  // SVG Path strings
  const { linePath, areaPath } = useMemo(() => {
    if (svgPoints.length === 0) return { linePath: '', areaPath: '' };
    const first = svgPoints[0];
    const pathCommands = svgPoints.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.sx.toFixed(1)} ${p.sy.toFixed(1)}`).join(' ');
    const last = svgPoints[svgPoints.length - 1];
    const baselineY = padT + chartH;
    const area = `${pathCommands} L ${last.sx.toFixed(1)} ${baselineY} L ${first.sx.toFixed(1)} ${baselineY} Z`;
    return { linePath: pathCommands, areaPath: area };
  }, [svgPoints, padT, chartH]);

  // Current active cursor position on the SVG graph
  const activeCursor = useMemo(() => {
    const { yMin, yMax } = graphData;
    const yRange = yMax - yMin || 1;
    const xRange = xMax - xMin || 1;
    const clampedX = Math.max(xMin, Math.min(xMax, inputValue));
    const sx = padL + ((clampedX - xMin) / xRange) * chartW;
    const sy = padT + chartH - ((resultValue - yMin) / yRange) * chartH;
    return {
      sx: Math.max(padL, Math.min(padL + chartW, sx)),
      sy: Math.max(padT, Math.min(padT + chartH, isNaN(sy) ? padT + chartH / 2 : sy))
    };
  }, [graphData, inputValue, resultValue, xMin, xMax, chartW, chartH, padL, padT]);

  // Handle clicking on the SVG graph to set input value
  const handleGraphClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!onSelectValue) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const svgRelX = (clickX / rect.width) * svgWidth;
    if (svgRelX < padL || svgRelX > padL + chartW) return;
    const ratio = (svgRelX - padL) / chartW;
    const newVal = xMin + ratio * (xMax - xMin);
    onSelectValue(parseFloat(newVal.toFixed(category.id === 'temperature' ? 1 : 2)));
  };

  return (
    <div className="p-space-md rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-md flex flex-col gap-space-md">
      {/* Header */}
      <div className="w-full flex items-center justify-between pb-1 border-b border-outline-variant/20">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[22px]">query_stats</span>
          <h3 className="font-headline-md text-headline-md text-on-surface">Visual Live Analyser</h3>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container font-data-mono text-[11px] text-primary font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span> Live Curve Active
        </span>
      </div>

      {/* SUB-SECTION 1: CIRCULAR TACHOMETER-STYLE GAUGE */}
      <div className="flex flex-col items-center justify-center pt-2">
        <div className="w-full flex items-center justify-between text-xs text-on-surface-variant font-medium px-2 mb-1">
          <span className="font-label-caps uppercase tracking-wider">Dimensional Radial Gauge</span>
          <span className="font-data-mono text-[11px] text-primary">
            {xMin} → {xMax} {fromUnit.symbol} Range
          </span>
        </div>

        <div className="relative w-64 h-38 flex items-end justify-center">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 240 140">
            {/* Zone 1: 0 - 25% (Cyan) */}
            <path d="M 30 130 A 90 90 0 0 1 48 71" fill="none" stroke="#38bdf8" strokeLinecap="round" strokeWidth="12" />
            {/* Zone 2: 25 - 60% (Blue / Primary) */}
            <path d="M 51 68 A 90 90 0 0 1 120 40" fill="none" stroke="#2563eb" strokeWidth="12" />
            {/* Zone 3: 60 - 85% (Green / Optimum) */}
            <path d="M 124 40 A 90 90 0 0 1 185 68" fill="none" stroke="#10b981" strokeWidth="12" />
            {/* Zone 4: 85 - 100% (Red / Elevated) */}
            <path d="M 188 71 A 90 90 0 0 1 210 130" fill="none" stroke="#ef4444" strokeLinecap="round" strokeWidth="12" />

            {/* Central Pin */}
            <circle cx="120" cy="130" fill="#004ac6" r="14" />
            <circle cx="120" cy="130" fill="#ffffff" r="6" />

            {/* Rotating Indicator Needle */}
            <g
              style={{
                transformOrigin: '120px 130px',
                transform: `rotate(${needleDeg}deg)`,
                transition: 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              <line stroke="#ef4444" strokeLinecap="round" strokeWidth="3.5" x1="120" x2="120" y1="130" y2="46" />
              <polygon fill="#ef4444" points="116,56 124,56 120,36" />
            </g>
          </svg>

          {/* Central Digital Readout */}
          <div className="absolute bottom-0 text-center pb-0.5">
            <span className="font-numerical-display text-[22px] font-bold text-on-surface tracking-tight block">
              {formattedResult}
            </span>
            <span className="text-[10px] font-label-caps text-on-surface-variant uppercase tracking-wider block -mt-1 font-semibold">
              {toUnit.name} ({toUnit.symbol})
            </span>
          </div>
        </div>

        {/* Operating Band Callout Pill */}
        <div className="mt-2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-body-sm font-medium">
          <span className={`w-2 h-2 rounded-full ${scaleBand.dot}`}></span>
          <span className={`font-semibold ${scaleBand.color}`}>{scaleBand.name}</span>
          <span className="text-on-surface-variant text-[11px]">• {scaleBand.desc}</span>
        </div>
      </div>

      {/* SUB-SECTION 2: DUAL SCALE BARS */}
      <div className="w-full flex flex-col gap-2 pt-2 border-t border-outline-variant/20">
        <div>
          <div className="flex justify-between text-body-sm mb-1 text-on-surface-variant font-medium">
            <span>Input Magnitude ({fromUnit.symbol})</span>
            <span className="font-data-mono text-primary font-semibold">
              {inputValue} / {xMax} ({Math.round(gaugePct)}%)
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300 rounded-full"
              style={{ width: `${Math.min(100, Math.max(4, gaugePct))}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-body-sm mb-1 text-on-surface-variant font-medium">
            <span>Output Magnitude ({toUnit.symbol})</span>
            <span className="font-data-mono text-emerald-600 dark:text-emerald-400 font-semibold">
              {formattedResult} {toUnit.symbol}
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
              style={{ width: `${Math.min(100, Math.max(4, gaugePct))}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* SUB-SECTION 3: INTERACTIVE 2D CURVE GRAPH */}
      <div className="w-full flex flex-col gap-1.5 pt-2 border-t border-outline-variant/20">
        <div className="flex items-center justify-between text-xs text-on-surface-variant">
          <span className="font-label-caps uppercase tracking-wider font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px] text-primary">show_chart</span>
            <span>Real-time Response Curve</span>
          </span>
          <span className="text-[10px] text-outline font-data-mono">Click graph to scrub</span>
        </div>

        <div className="relative w-full rounded-xl bg-surface-container/50 border border-outline-variant/25 p-2 overflow-hidden">
          <svg
            className="w-full h-auto cursor-crosshair select-none"
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            onClick={handleGraphClick}
          >
            <defs>
              <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563eb" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((r, i) => {
              const y = padT + chartH * r;
              return (
                <line
                  key={i}
                  x1={padL}
                  y1={y}
                  x2={padL + chartW}
                  y2={y}
                  stroke="currentColor"
                  className="text-outline-variant/20"
                  strokeDasharray="3 3"
                />
              );
            })}

            {/* Vertical Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((r, i) => {
              const x = padL + chartW * r;
              return (
                <line
                  key={i}
                  x1={x}
                  y1={padT}
                  x2={x}
                  y2={padT + chartH}
                  stroke="currentColor"
                  className="text-outline-variant/20"
                  strokeDasharray="3 3"
                />
              );
            })}

            {/* Y-Axis tick labels */}
            <text x={padL - 6} y={padT + 10} textAnchor="end" className="fill-on-surface-variant font-data-mono text-[9px]">
              {formatResult(graphData.yMax, 'auto')}
            </text>
            <text x={padL - 6} y={padT + chartH} textAnchor="end" className="fill-on-surface-variant font-data-mono text-[9px]">
              {formatResult(graphData.yMin, 'auto')}
            </text>

            {/* X-Axis tick labels */}
            <text x={padL} y={svgHeight - 8} textAnchor="start" className="fill-on-surface-variant font-data-mono text-[9px]">
              {xMin} {fromUnit.symbol}
            </text>
            <text x={padL + chartW} y={svgHeight - 8} textAnchor="end" className="fill-on-surface-variant font-data-mono text-[9px]">
              {xMax} {fromUnit.symbol}
            </text>

            {/* Area Fill */}
            <path d={areaPath} fill="url(#curveGradient)" />

            {/* Curve Line */}
            <path
              d={linePath}
              fill="none"
              stroke="#2563eb"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Pulsing Active Cursor Marker */}
            <circle
              cx={activeCursor.sx}
              cy={activeCursor.sy}
              r="10"
              className="fill-primary/25 animate-ping"
            />
            <circle
              cx={activeCursor.sx}
              cy={activeCursor.sy}
              r="5"
              fill="#2563eb"
              stroke="#ffffff"
              strokeWidth="2"
            />

            {/* Value tooltip tag */}
            <g transform={`translate(${Math.min(padL + chartW - 70, Math.max(padL + 10, activeCursor.sx - 35))}, ${Math.max(16, activeCursor.sy - 18)})`}>
              <rect width="70" height="16" rx="4" fill="#0f172a" opacity="0.85" />
              <text x="35" y="11" textAnchor="middle" fill="#ffffff" className="font-data-mono text-[8.5px] font-semibold">
                {inputValue} {fromUnit.symbol} → {formattedResult}
              </text>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
