'use client';

import React, { useMemo } from 'react';
import { UnitDefinition, CategoryDefinition } from '@/lib/conversions';

interface CategoryVisualizerProps {
  category: CategoryDefinition;
  fromUnit: UnitDefinition;
  toUnit: UnitDefinition;
  inputValue: number;
  resultValue: number;
  formattedResult: string;
}

export default function CategoryVisualizer({
  category,
  fromUnit,
  toUnit,
  inputValue,
  resultValue,
  formattedResult
}: CategoryVisualizerProps) {
  const catId = category.id;

  // Safe numerical parsing
  const safeInput = isNaN(inputValue) ? 0 : inputValue;
  const safeResult = isNaN(resultValue) ? 0 : resultValue;

  // Render specific visualizer based on category
  switch (catId) {
    case 'length':
      return (
        <LengthVisualizer
          fromUnit={fromUnit}
          toUnit={toUnit}
          inputValue={safeInput}
          resultValue={safeResult}
          formattedResult={formattedResult}
        />
      );

    case 'weight':
      return (
        <WeightVisualizer
          fromUnit={fromUnit}
          toUnit={toUnit}
          inputValue={safeInput}
          resultValue={safeResult}
          formattedResult={formattedResult}
        />
      );

    case 'temperature':
      return (
        <TemperatureVisualizer
          fromUnit={fromUnit}
          toUnit={toUnit}
          inputValue={safeInput}
          resultValue={safeResult}
          formattedResult={formattedResult}
        />
      );

    case 'area':
      return (
        <AreaVisualizer
          fromUnit={fromUnit}
          toUnit={toUnit}
          inputValue={safeInput}
          resultValue={safeResult}
          formattedResult={formattedResult}
        />
      );

    case 'speed':
      return (
        <SpeedVisualizer
          fromUnit={fromUnit}
          toUnit={toUnit}
          inputValue={safeInput}
          resultValue={safeResult}
          formattedResult={formattedResult}
        />
      );

    case 'pressure':
      return (
        <PressureVisualizer
          fromUnit={fromUnit}
          toUnit={toUnit}
          inputValue={safeInput}
          resultValue={safeResult}
          formattedResult={formattedResult}
        />
      );

    case 'number_systems':
      return (
        <NumberSystemsVisualizer
          fromUnit={fromUnit}
          toUnit={toUnit}
          inputValue={safeInput}
          resultValue={safeResult}
          formattedResult={formattedResult}
        />
      );

    case 'data_storage':
    case 'data_transfer':
      return (
        <DataStorageVisualizer
          category={category}
          fromUnit={fromUnit}
          toUnit={toUnit}
          inputValue={safeInput}
          resultValue={safeResult}
          formattedResult={formattedResult}
        />
      );

    case 'energy':
    case 'power':
      return (
        <EnergyPowerVisualizer
          category={category}
          fromUnit={fromUnit}
          toUnit={toUnit}
          inputValue={safeInput}
          resultValue={safeResult}
          formattedResult={formattedResult}
        />
      );

    default:
      return (
        <GeneralDialVisualizer
          category={category}
          fromUnit={fromUnit}
          toUnit={toUnit}
          inputValue={safeInput}
          resultValue={safeResult}
          formattedResult={formattedResult}
        />
      );
  }
}

// -------------------------------------------------------------
// 1. LENGTH VISUALIZER: Interactive Dual-Scale Ruler & Dimension Bar
// -------------------------------------------------------------
function LengthVisualizer({
  fromUnit,
  toUnit,
  inputValue,
  formattedResult
}: {
  fromUnit: UnitDefinition;
  toUnit: UnitDefinition;
  inputValue: number;
  resultValue: number;
  formattedResult: string;
}) {
  // Normalize length to visual percentage bar (0% - 100%)
  const percentage = useMemo(() => {
    if (inputValue <= 0) return 4;
    const logVal = Math.log10(Math.max(0.1, inputValue));
    // Scale smoothly across orders of magnitude
    const pct = ((logVal + 1) / 4) * 100;
    return Math.min(96, Math.max(8, pct));
  }, [inputValue]);

  return (
    <div className="rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 p-6 space-y-6 shadow-sm backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
            📏
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Precision Scale & Dimension Span</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Live dual-standard visual ruler comparison</p>
          </div>
        </div>
        <div className="text-xs font-mono px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-medium">
          {inputValue} {fromUnit.symbol} = {formattedResult} {toUnit.symbol}
        </div>
      </div>

      {/* Visual Dimension Span Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-slate-500 font-mono">
          <span>0 {fromUnit.symbol}</span>
          <span className="text-blue-600 dark:text-blue-400 font-bold">Span: {inputValue} {fromUnit.symbol}</span>
          <span>Max Scale</span>
        </div>

        <div className="relative h-9 bg-slate-100 dark:bg-slate-800/70 rounded-xl overflow-hidden p-1 border border-slate-200 dark:border-slate-700/60">
          <div
            className="h-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-300 flex items-center justify-end pr-2 text-white font-mono text-xs font-bold shadow-sm"
            style={{ width: `${percentage}%` }}
          >
            {percentage > 20 && `${inputValue} ${fromUnit.symbol}`}
          </div>
        </div>
      </div>

      {/* Dual Calibration Ruler Rendering */}
      <div className="space-y-1">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex justify-between">
          <span>Metric Calibrated Axis (mm / cm)</span>
          <span>Imperial Calibrated Axis (in / ft)</span>
        </div>

        <div className="relative h-14 bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 rounded-xl p-2 flex flex-col justify-between select-none">
          {/* Top Ticks (Metric) */}
          <div className="flex justify-between items-start border-b border-amber-300 dark:border-amber-800/60 pb-1">
            {Array.from({ length: 21 }).map((_, i) => (
              <div
                key={`metric-${i}`}
                className={`w-[1px] bg-amber-800/60 dark:bg-amber-400/60 ${
                  i % 5 === 0 ? 'h-3' : 'h-1.5'
                }`}
              />
            ))}
          </div>

          {/* Center Indicator */}
          <div className="text-center text-[10px] font-mono text-amber-900 dark:text-amber-300 font-bold">
            1 INCH = EXACTLY 25.4 MILLIMETERS
          </div>

          {/* Bottom Ticks (Imperial) */}
          <div className="flex justify-between items-end border-t border-amber-300 dark:border-amber-800/60 pt-1">
            {Array.from({ length: 17 }).map((_, i) => (
              <div
                key={`imp-${i}`}
                className={`w-[1px] bg-amber-800/60 dark:bg-amber-400/60 ${
                  i % 4 === 0 ? 'h-3' : 'h-1.5'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 2. WEIGHT VISUALIZER: Interactive Dynamic Balance Scale
// -------------------------------------------------------------
function WeightVisualizer({
  fromUnit,
  toUnit,
  inputValue,
  formattedResult
}: {
  fromUnit: UnitDefinition;
  toUnit: UnitDefinition;
  inputValue: number;
  resultValue: number;
  formattedResult: string;
}) {
  return (
    <div className="rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 p-6 space-y-6 shadow-sm backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
            ⚖️
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Precision Balance Scale</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Gravitational mass equilibrium comparator</p>
          </div>
        </div>
        <div className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-medium">
          Equilibrium Match
        </div>
      </div>

      {/* SVG Balance Scale Visual */}
      <div className="py-2 flex flex-col items-center">
        <svg viewBox="0 0 360 180" className="w-full max-w-[340px] h-44 drop-shadow-sm overflow-visible">
          {/* Fulcrum Stand */}
          <polygon points="180,50 160,165 200,165" className="fill-slate-300 dark:fill-slate-700" />
          <rect x="130" y="165" width="100" height="10" rx="3" className="fill-slate-400 dark:fill-slate-600" />

          {/* Pivot Joint */}
          <circle cx="180" cy="50" r="7" className="fill-amber-500 shadow-md" />

          {/* Balance Beam */}
          <line x1="60" y1="50" x2="300" y2="50" strokeWidth="6" strokeLinecap="round" className="stroke-slate-600 dark:stroke-slate-300" />

          {/* Left Pan (From Unit) */}
          <line x1="60" y1="50" x2="40" y2="100" strokeWidth="1.5" className="stroke-slate-400 dark:stroke-slate-500" />
          <line x1="60" y1="50" x2="80" y2="100" strokeWidth="1.5" className="stroke-slate-400 dark:stroke-slate-500" />
          <path d="M 30,100 Q 60,115 90,100 Z" className="fill-amber-400/90 dark:fill-amber-500/80 stroke-amber-600 stroke-1" />

          {/* Left Pan Mass Box */}
          <rect x="48" y="82" width="24" height="18" rx="2" className="fill-emerald-600 dark:fill-emerald-500" />
          <text x="60" y="95" textAnchor="middle" className="fill-white font-mono text-[9px] font-bold">
            {fromUnit.symbol}
          </text>

          {/* Right Pan (To Unit) */}
          <line x1="300" y1="50" x2="280" y2="100" strokeWidth="1.5" className="stroke-slate-400 dark:stroke-slate-500" />
          <line x1="300" y1="50" x2="320" y2="100" strokeWidth="1.5" className="stroke-slate-400 dark:stroke-slate-500" />
          <path d="M 270,100 Q 300,115 330,100 Z" className="fill-amber-400/90 dark:fill-amber-500/80 stroke-amber-600 stroke-1" />

          {/* Right Pan Mass Box */}
          <rect x="288" y="82" width="24" height="18" rx="2" className="fill-blue-600 dark:fill-blue-500" />
          <text x="300" y="95" textAnchor="middle" className="fill-white font-mono text-[9px] font-bold">
            {toUnit.symbol}
          </text>
        </svg>

        {/* Dual Pan Readout */}
        <div className="grid grid-cols-2 gap-4 w-full mt-2">
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-center">
            <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">Input Mass</span>
            <div className="text-sm font-bold font-mono text-emerald-900 dark:text-emerald-200 mt-0.5">
              {inputValue} {fromUnit.symbol}
            </div>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400">{fromUnit.name}</span>
          </div>

          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/40 text-center">
            <span className="text-[10px] font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wider block">Equivalent Mass</span>
            <div className="text-sm font-bold font-mono text-blue-900 dark:text-blue-200 mt-0.5">
              {formattedResult} {toUnit.symbol}
            </div>
            <span className="text-[11px] text-blue-600 dark:text-blue-400">{toUnit.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 3. TEMPERATURE VISUALIZER: Precision Thermometer & Thermal Glow
// -------------------------------------------------------------
function TemperatureVisualizer({
  fromUnit,
  toUnit,
  inputValue,
  formattedResult
}: {
  fromUnit: UnitDefinition;
  toUnit: UnitDefinition;
  inputValue: number;
  resultValue: number;
  formattedResult: string;
}) {
  // Normalize temperature to standard Celsius for visual level
  const celsius = useMemo(() => {
    if (fromUnit.id === 'c') return inputValue;
    if (fromUnit.id === 'f') return (inputValue - 32) * (5 / 9);
    if (fromUnit.id === 'k') return inputValue - 273.15;
    if (fromUnit.id === 'r') return (inputValue - 491.67) * (5 / 9);
    return inputValue;
  }, [fromUnit.id, inputValue]);

  // Thermometer column height (-20°C to +120°C range)
  const columnPct = useMemo(() => {
    const clamped = Math.max(-20, Math.min(120, celsius));
    return ((clamped - -20) / (120 - -20)) * 100;
  }, [celsius]);

  // Dynamic glow color
  const tempTheme = useMemo(() => {
    if (celsius <= 0) return { label: 'Freezing / Sub-Zero', color: 'from-blue-500 to-cyan-400', badge: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' };
    if (celsius <= 25) return { label: 'Ambient / Cool', color: 'from-emerald-500 to-teal-400', badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' };
    if (celsius <= 45) return { label: 'Warm / Body Temp', color: 'from-amber-500 to-orange-400', badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' };
    return { label: 'Hot / Boiling Zone', color: 'from-red-600 to-orange-500', badge: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300' };
  }, [celsius]);

  return (
    <div className="rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 p-6 space-y-6 shadow-sm backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center font-bold text-sm">
            🌡️
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Calibrated Thermodynamic Column</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Thermal state visualizer with standard phase markers</p>
          </div>
        </div>
        <div className={`text-xs font-semibold px-2.5 py-1 rounded-full ${tempTheme.badge}`}>
          {tempTheme.label}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
        {/* Thermometer Stem & Bulb */}
        <div className="sm:col-span-1 flex justify-center py-2">
          <div className="relative w-12 h-56 bg-slate-100 dark:bg-slate-800/80 border-2 border-slate-300 dark:border-slate-700 rounded-full flex flex-col items-center justify-end p-1.5 shadow-inner">
            {/* Liquid Stem */}
            <div className="relative w-4 h-40 bg-slate-200/80 dark:bg-slate-700/80 rounded-full overflow-hidden flex flex-col justify-end">
              <div
                className={`w-full rounded-full bg-gradient-to-t ${tempTheme.color} transition-all duration-300 shadow-md`}
                style={{ height: `${Math.max(6, columnPct)}%` }}
              />
            </div>
            {/* Liquid Bulb */}
            <div className={`w-8 h-8 -mt-2 rounded-full bg-gradient-to-tr ${tempTheme.color} border-2 border-white dark:border-slate-900 shadow-lg`} />
          </div>
        </div>

        {/* Phase Markers and Scientific Readings */}
        <div className="sm:col-span-2 space-y-3">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">Calculated Celsius:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">{celsius.toFixed(2)} °C</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">Output Result:</span>
              <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{formattedResult} {toUnit.symbol}</span>
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50/70 dark:bg-blue-950/30 text-blue-900 dark:text-blue-300">
              <span>❄️ Water Freezing Point</span>
              <span className="font-mono font-semibold">0 °C / 32 °F</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-300">
              <span>🏡 Room Temperature</span>
              <span className="font-mono font-semibold">21 °C / 69.8 °F</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50/70 dark:bg-amber-950/30 text-amber-900 dark:text-amber-300">
              <span>❤️ Human Body Temp</span>
              <span className="font-mono font-semibold">37 °C / 98.6 °F</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-red-50/70 dark:bg-red-950/30 text-red-900 dark:text-red-300">
              <span>🔥 Water Boiling Point</span>
              <span className="font-mono font-semibold">100 °C / 212 °F</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 4. AREA VISUALIZER: 2D Land Parcel & Blueprint Grid
// -------------------------------------------------------------
function AreaVisualizer({
  fromUnit,
  toUnit,
  inputValue,
  formattedResult
}: {
  fromUnit: UnitDefinition;
  toUnit: UnitDefinition;
  inputValue: number;
  resultValue: number;
  formattedResult: string;
}) {
  return (
    <div className="rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 p-6 space-y-6 shadow-sm backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-sm">
            🗺️
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Architectural Surface Plot</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Two-dimensional spatial footprint matrix</p>
          </div>
        </div>
        <div className="text-xs font-mono px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 font-medium">
          {inputValue} {fromUnit.symbol}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        {/* Blueprint Isometric Square Graphic */}
        <div className="relative h-44 rounded-xl bg-slate-900 border border-slate-800 p-4 flex flex-col items-center justify-center overflow-hidden">
          {/* Subtle Blueprint Grid Pattern */}
          <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:16px_16px]" />

          <div className="relative w-28 h-28 border-2 border-dashed border-purple-400/80 bg-purple-500/20 rounded-lg flex flex-col items-center justify-center text-center p-2 backdrop-blur-xs">
            <span className="text-[10px] text-purple-300 font-mono">Area Surface</span>
            <span className="text-xs font-bold text-white font-mono mt-0.5">{inputValue} {fromUnit.symbol}</span>
          </div>
        </div>

        {/* Spatial Comparison Details */}
        <div className="space-y-2 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1">
            <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] block">Calculated Coverage</span>
            <div className="text-base font-bold font-mono text-purple-600 dark:text-purple-400">
              {formattedResult} {toUnit.symbol}
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-[11px]">
              Equal to a square plot of approximately {Math.sqrt(Math.max(0, inputValue)).toFixed(2)} {fromUnit.symbol} per side.
            </p>
          </div>
          <div className="text-[11px] text-slate-500 space-y-1">
            <div>• 1 Square Meter = 10.7639 Square Feet</div>
            <div>• 1 Hectare = 10,000 m² = 2.471 Acres</div>
            <div>• 1 Acre = 43,560 Square Feet</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 5. SPEED VISUALIZER: High-Performance Speedometer Gauge
// -------------------------------------------------------------
function SpeedVisualizer({
  fromUnit,
  toUnit,
  inputValue,
  formattedResult
}: {
  fromUnit: UnitDefinition;
  toUnit: UnitDefinition;
  inputValue: number;
  resultValue: number;
  formattedResult: string;
}) {
  // Convert input to km/h baseline for speedometer needle
  const kmh = useMemo(() => {
    if (fromUnit.id === 'kmh') return inputValue;
    if (fromUnit.id === 'mph') return inputValue * 1.60934;
    if (fromUnit.id === 'mps') return inputValue * 3.6;
    if (fromUnit.id === 'knot') return inputValue * 1.852;
    if (fromUnit.id === 'mach') return inputValue * 1234.8;
    return inputValue;
  }, [fromUnit.id, inputValue]);

  // Speedometer needle angle (-120deg to +120deg)
  const needleAngle = useMemo(() => {
    const clamped = Math.max(0, Math.min(300, kmh));
    return -120 + (clamped / 300) * 240;
  }, [kmh]);

  return (
    <div className="rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 p-6 space-y-6 shadow-sm backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold text-sm">
            ⚡
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Precision Velocity Instrument</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Analog gauge with Mach sonic barrier indicators</p>
          </div>
        </div>
        <div className="text-xs font-mono px-2.5 py-1 rounded-full bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 font-medium">
          {kmh.toFixed(1)} km/h equiv
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-around gap-4 py-2">
        {/* Speedometer Radial Gauge */}
        <div className="relative w-44 h-44 flex items-center justify-center">
          <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
            {/* Background Track */}
            <circle cx="100" cy="100" r="80" strokeWidth="12" className="stroke-slate-200 dark:stroke-slate-800 fill-none" strokeDasharray="377" strokeDashoffset="126" strokeLinecap="round" />
            {/* Active Gauge Arc */}
            <circle
              cx="100"
              cy="100"
              r="80"
              strokeWidth="12"
              className="stroke-orange-500 fill-none transition-all duration-500"
              strokeDasharray="377"
              strokeDashoffset={Math.max(126, 377 - (Math.min(300, kmh) / 300) * 251)}
              strokeLinecap="round"
            />
          </svg>

          {/* Needle */}
          <div
            className="absolute w-1 h-20 bg-orange-600 dark:bg-orange-400 origin-bottom rounded-full transition-transform duration-500 shadow-md"
            style={{ transform: `rotate(${needleAngle}deg)`, bottom: '50%' }}
          />
          <div className="absolute w-4 h-4 rounded-full bg-slate-900 dark:bg-white z-10 shadow" />

          {/* Center Digital Readout */}
          <div className="absolute bottom-6 text-center">
            <span className="text-sm font-bold font-mono text-slate-900 dark:text-white block">{inputValue}</span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">{fromUnit.symbol}</span>
          </div>
        </div>

        {/* Benchmark Readouts */}
        <div className="space-y-2 w-full max-w-[240px] text-xs">
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex justify-between items-center">
            <span className="text-slate-500">Converted Value:</span>
            <span className="font-mono font-bold text-orange-600 dark:text-orange-400">{formattedResult} {toUnit.symbol}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex justify-between items-center">
            <span className="text-slate-500">Highway Pace:</span>
            <span className="font-mono font-semibold">110 km/h (68 mph)</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex justify-between items-center">
            <span className="text-slate-500">Speed of Sound:</span>
            <span className="font-mono font-semibold">1,235 km/h (Mach 1)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 6. PRESSURE VISUALIZER: Bourdon Tube Manometer Dial
// -------------------------------------------------------------
function PressureVisualizer({
  fromUnit,
  toUnit,
  inputValue,
  formattedResult
}: {
  fromUnit: UnitDefinition;
  toUnit: UnitDefinition;
  inputValue: number;
  resultValue: number;
  formattedResult: string;
}) {
  return (
    <div className="rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 p-6 space-y-6 shadow-sm backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold text-sm">
            🎛️
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Industrial Pressure Manometer</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Pneumatic and hydraulic gauge instrument</p>
          </div>
        </div>
        <div className="text-xs font-mono px-2.5 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 font-medium">
          {inputValue} {fromUnit.symbol}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-center space-y-2">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Pressure Equivalent</span>
          <div className="text-2xl font-black font-mono text-cyan-600 dark:text-cyan-400">
            {formattedResult} {toUnit.symbol}
          </div>
          <span className="text-xs text-slate-500">{toUnit.name}</span>
        </div>

        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
            <span className="text-slate-500">1 Atmosphere (atm)</span>
            <span className="font-mono font-semibold">14.696 PSI = 1.013 Bar</span>
          </div>
          <div className="flex justify-between p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
            <span className="text-slate-500">Car Tire Inflation</span>
            <span className="font-mono font-semibold">32 PSI = 2.2 Bar</span>
          </div>
          <div className="flex justify-between p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
            <span className="text-slate-500">Espresso Extraction</span>
            <span className="font-mono font-semibold">9 Bar = 130.5 PSI</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 7. NUMBER SYSTEMS VISUALIZER: Binary Bits & Hexadecimal
// -------------------------------------------------------------
function NumberSystemsVisualizer({
  fromUnit,
  inputValue,
  formattedResult
}: {
  fromUnit: UnitDefinition;
  toUnit: UnitDefinition;
  inputValue: number;
  resultValue: number;
  formattedResult: string;
}) {
  const intVal = Math.floor(Math.abs(inputValue)) || 0;
  const binary8 = (intVal & 0xff).toString(2).padStart(8, '0');
  const hexVal = intVal.toString(16).toUpperCase();

  return (
    <div className="rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 p-6 space-y-6 shadow-sm backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
            🔢
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Live Computer Architecture Register</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">8-bit hardware binary and hexadecimal breakdown</p>
          </div>
        </div>
        <div className="text-xs font-mono px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-medium">
          Base Conversion
        </div>
      </div>

      {/* 8-Bit Interactive Register Graphic */}
      <div className="space-y-2">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">8-Bit Data Register (0-255)</span>
        <div className="grid grid-cols-8 gap-1.5">
          {binary8.split('').map((bit, idx) => (
            <div
              key={idx}
              className={`h-12 rounded-xl flex flex-col items-center justify-center font-mono font-bold transition-colors ${
                bit === '1'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
              }`}
            >
              <span className="text-sm">{bit}</span>
              <span className="text-[8px] opacity-70">2^{7 - idx}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Multi-Radix Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
          <span className="text-[10px] text-slate-400 font-semibold block">Decimal (10)</span>
          <span className="text-sm font-mono font-bold text-slate-900 dark:text-white">{intVal}</span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
          <span className="text-[10px] text-slate-400 font-semibold block">Hexadecimal (16)</span>
          <span className="text-sm font-mono font-bold text-indigo-600 dark:text-indigo-400">0x{hexVal}</span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
          <span className="text-[10px] text-slate-400 font-semibold block">Octal (8)</span>
          <span className="text-sm font-mono font-bold text-slate-900 dark:text-white">{intVal.toString(8)}</span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
          <span className="text-[10px] text-slate-400 font-semibold block">Output</span>
          <span className="text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400">{formattedResult}</span>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 8. DATA STORAGE / TRANSFER VISUALIZER
// -------------------------------------------------------------
function DataStorageVisualizer({
  category,
  fromUnit,
  toUnit,
  inputValue,
  formattedResult
}: {
  category: CategoryDefinition;
  fromUnit: UnitDefinition;
  toUnit: UnitDefinition;
  inputValue: number;
  resultValue: number;
  formattedResult: string;
}) {
  return (
    <div className="rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 p-6 space-y-6 shadow-sm backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-sm">
            💾
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{category.name} Analysis</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Binary (1024) vs Decimal (1000) capacity</p>
          </div>
        </div>
        <div className="text-xs font-mono px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 font-medium">
          {inputValue} {fromUnit.symbol} = {formattedResult} {toUnit.symbol}
        </div>
      </div>

      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-500 font-medium">Storage Capacity / Rate:</span>
          <span className="font-mono font-bold text-teal-600 dark:text-teal-400 text-sm">{formattedResult} {toUnit.symbol}</span>
        </div>
        <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-teal-500 rounded-full w-3/4" />
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          Remember that 1 Byte equals 8 bits. Storage drives calculate in decimal (1 GB = 1,000,000,000 bytes), while operating systems calculate in binary (1 GiB = 1,073,741,824 bytes).
        </p>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 9. ENERGY / POWER VISUALIZER
// -------------------------------------------------------------
function EnergyPowerVisualizer({
  category,
  fromUnit,
  toUnit,
  inputValue,
  formattedResult
}: {
  category: CategoryDefinition;
  fromUnit: UnitDefinition;
  toUnit: UnitDefinition;
  inputValue: number;
  resultValue: number;
  formattedResult: string;
}) {
  return (
    <div className="rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 p-6 space-y-6 shadow-sm backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 flex items-center justify-center font-bold text-sm">
            ⚡
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{category.name} Reservoir</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Thermodynamic and work output equivalent</p>
          </div>
        </div>
        <div className="text-xs font-mono px-2.5 py-1 rounded-full bg-yellow-50 dark:bg-yellow-950/50 text-yellow-700 dark:text-yellow-400 font-medium">
          {inputValue} {fromUnit.symbol}
        </div>
      </div>

      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Calculated Work Output</span>
          <div className="text-xl font-bold font-mono text-yellow-600 dark:text-yellow-400">
            {formattedResult} {toUnit.symbol}
          </div>
          <span className="text-xs text-slate-500">{toUnit.name}</span>
        </div>
        <div className="text-xs text-slate-500 space-y-1 text-right">
          <div>1 Horsepower = 745.7 Watts</div>
          <div>1 kWh = 3.6 Megajoules</div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 10. GENERAL PRECISION DIAL VISUALIZER (For other categories)
// -------------------------------------------------------------
function GeneralDialVisualizer({
  category,
  fromUnit,
  toUnit,
  inputValue,
  formattedResult
}: {
  category: CategoryDefinition;
  fromUnit: UnitDefinition;
  toUnit: UnitDefinition;
  inputValue: number;
  resultValue: number;
  formattedResult: string;
}) {
  return (
    <div className="rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 p-6 space-y-6 shadow-sm backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
            <span className="material-symbols-outlined text-[20px]">{category.icon}</span>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{category.name} Instrument</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">High-precision laboratory-grade conversion readout</p>
          </div>
        </div>
        <div className="text-xs font-mono px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-medium">
          64-bit Precision
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1 text-center sm:text-left">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Input Specification</span>
          <div className="text-lg font-bold font-mono text-slate-900 dark:text-white">
            {inputValue} {fromUnit.symbol}
          </div>
          <span className="text-xs text-slate-500">{fromUnit.name}</span>
        </div>

        <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-800/40 space-y-1 text-center sm:text-left">
          <span className="text-[10px] text-blue-600 dark:text-blue-400 uppercase font-semibold block">Equivalent Output</span>
          <div className="text-lg font-bold font-mono text-blue-700 dark:text-blue-300">
            {formattedResult} {toUnit.symbol}
          </div>
          <span className="text-xs text-blue-600 dark:text-blue-400">{toUnit.name}</span>
        </div>
      </div>
    </div>
  );
}
