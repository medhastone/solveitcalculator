import React from 'react';
import { CalculationMode, DistanceUnit, PaceUnit, SplitStrategy } from '../types';
import {
  calculateCaloricExpenditure,
  calculateRiegelProjection,
  calculateVDOT,
  formatPace,
  formatTime,
  KM_TO_MILES,
  MILES_TO_KM,
  OFFICIAL_DISTANCES_KM,
  secondsToHms,
} from '../utils';

interface WorkbenchSectionProps {
  activeMode: CalculationMode;
  distanceVal: string;
  distanceUnit: DistanceUnit;
  timeHours: string;
  timeMinutes: string;
  timeSeconds: string;
  paceMinutes: string;
  paceSeconds: string;
  paceUnit: PaceUnit;
  splitStrategy: SplitStrategy;
  envElevation: string;
  envTerrain: string;
  runnerWeight: string;
  distanceKm: number;
  totalSeconds: number;
  paceSecPerKm: number;
  onDistanceValChange: (v: string) => void;
  onDistanceUnitChange: (u: DistanceUnit) => void;
  onTimeHoursChange: (v: string) => void;
  onTimeMinutesChange: (v: string) => void;
  onTimeSecondsChange: (v: string) => void;
  onPaceMinutesChange: (v: string) => void;
  onPaceSecondsChange: (v: string) => void;
  onPaceUnitChange: (u: PaceUnit) => void;
  onSplitStrategyChange: (s: SplitStrategy) => void;
  onEnvElevationChange: (v: string) => void;
  onEnvTerrainChange: (v: string) => void;
  onRunnerWeightChange: (v: string) => void;
  onApplyPreset: (dist: number, unit: DistanceUnit) => void;
  onReset: () => void;
  onRecalculate?: () => void;
  onSelectMode?: (mode: CalculationMode) => void;
}

export default function WorkbenchSection({
  activeMode,
  distanceVal,
  distanceUnit,
  timeHours,
  timeMinutes,
  timeSeconds,
  paceMinutes,
  paceSeconds,
  paceUnit,
  splitStrategy,
  envElevation,
  envTerrain,
  runnerWeight,
  distanceKm,
  totalSeconds,
  paceSecPerKm,
  onDistanceValChange,
  onDistanceUnitChange,
  onTimeHoursChange,
  onTimeMinutesChange,
  onTimeSecondsChange,
  onPaceMinutesChange,
  onPaceSecondsChange,
  onPaceUnitChange,
  onSplitStrategyChange,
  onEnvElevationChange,
  onEnvTerrainChange,
  onRunnerWeightChange,
  onApplyPreset,
  onReset,
  onSelectMode,
}: WorkbenchSectionProps) {
  // Calculated secondary metrics
  const pacePerMileSec = paceSecPerKm * MILES_TO_KM;
  const speedKmh = paceSecPerKm > 0 ? 3600 / paceSecPerKm : 0;
  const speedMph = speedKmh * KM_TO_MILES;
  const track400mSec = paceSecPerKm * 0.4;
  const track100mSec = paceSecPerKm * 0.1;

  // Calorie estimation based on ACSM and Margaria formulas
  const weightKg = parseFloat(runnerWeight) || 70;
  const elevationM = parseFloat(envElevation) || 0;
  const estCalories = calculateCaloricExpenditure(distanceKm, weightKg, elevationM, envTerrain);

  // Jack Daniels VDOT Score
  const vdotScore = calculateVDOT(distanceKm, totalSeconds);

  // Which variable is the primary output?
  const isPaceOutput = activeMode === 'pace' || activeMode === '5k' || activeMode === '10k' || activeMode === 'half' || activeMode === 'marathon';
  const isTimeOutput = activeMode === 'time';
  const isDistOutput = activeMode === 'distance';

  // Formatted calculated values for display
  const calculatedTimeHms = secondsToHms(totalSeconds);
  const calculatedDistanceMiles = (distanceKm * KM_TO_MILES).toFixed(2);

  // Equivalent projections based on Peter Riegel formula
  const riegel5K = calculateRiegelProjection(distanceKm, totalSeconds, OFFICIAL_DISTANCES_KM.fiveK);
  const riegel10K = calculateRiegelProjection(distanceKm, totalSeconds, OFFICIAL_DISTANCES_KM.tenK);
  const riegelHalf = calculateRiegelProjection(distanceKm, totalSeconds, OFFICIAL_DISTANCES_KM.halfMarathon);
  const riegelFull = calculateRiegelProjection(distanceKm, totalSeconds, OFFICIAL_DISTANCES_KM.marathon);

  return (
    <section className="w-full py-space-lg bg-surface">
      <div className="max-w-[1280px] mx-auto px-gutter-mobile lg:px-gutter-desktop">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md items-start">
          {/* LEFT COLUMN: Input Matrix & Workbench */}
          <div className="lg:col-span-7 flex flex-col gap-space-md">
            <div className="bg-surface-container-lowest rounded-xl border border-surface-container p-space-md shadow-xs">
              {/* Header with Mode indicator */}
              <div className="flex items-center justify-between pb-space-sm border-b border-surface-container mb-space-md">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[22px]">tune</span>
                  <div>
                    <h2 className="font-title-md text-title-md text-on-surface font-semibold">
                      Running Pacing &amp; Split Workbench
                    </h2>
                    <span className="text-[12px] text-on-surface-variant">
                      {isPaceOutput && 'Solving for: Target Pace per Km & Mile'}
                      {isTimeOutput && 'Solving for: Target Finish Time'}
                      {isDistOutput && 'Solving for: Traversed Distance'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {onSelectMode && (
                    <div className="hidden sm:flex items-center gap-1 bg-surface-container p-0.5 rounded-lg border border-outline-variant">
                      <button
                        type="button"
                        onClick={() => onSelectMode('pace')}
                        className={`px-2 py-1 rounded text-[11px] font-medium transition-all cursor-pointer ${
                          isPaceOutput
                            ? 'bg-surface-container-lowest text-primary shadow-xs font-semibold'
                            : 'text-on-surface-variant hover:text-on-surface'
                        }`}
                      >
                        Pace
                      </button>
                      <button
                        type="button"
                        onClick={() => onSelectMode('time')}
                        className={`px-2 py-1 rounded text-[11px] font-medium transition-all cursor-pointer ${
                          isTimeOutput
                            ? 'bg-surface-container-lowest text-primary shadow-xs font-semibold'
                            : 'text-on-surface-variant hover:text-on-surface'
                        }`}
                      >
                        Time
                      </button>
                      <button
                        type="button"
                        onClick={() => onSelectMode('distance')}
                        className={`px-2 py-1 rounded text-[11px] font-medium transition-all cursor-pointer ${
                          isDistOutput
                            ? 'bg-surface-container-lowest text-primary shadow-xs font-semibold'
                            : 'text-on-surface-variant hover:text-on-surface'
                        }`}
                      >
                        Distance
                      </button>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={onReset}
                    className="text-body-sm text-on-surface-variant hover:text-primary flex items-center gap-1 cursor-pointer transition-colors px-2 py-1 rounded-md hover:bg-surface-container"
                    title="Reset to 10K in 50:00"
                  >
                    <span className="material-symbols-outlined text-[16px]">refresh</span>
                    <span className="hidden sm:inline">Reset</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-space-md">
                {/* 1. DISTANCE FIELD */}
                <div
                  className={`p-3 rounded-lg border transition-all ${
                    isDistOutput
                      ? 'border-primary/50 bg-primary/5'
                      : 'border-surface-container bg-surface-container-lowest'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="inputDistance"
                      className="font-label-md text-label-md text-on-surface font-medium flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-primary text-[18px]">straighten</span>
                      <span>Race / Workout Distance</span>
                      {isDistOutput && (
                        <span className="text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                          Calculated Result
                        </span>
                      )}
                    </label>
                    <span className="text-[12px] text-on-surface-variant">
                      {isDistOutput ? 'Computed from Time & Pace' : 'Enter distance or select preset'}
                    </span>
                  </div>

                  {isDistOutput ? (
                    <div className="py-2 px-3 rounded-lg bg-surface-container-low border border-primary/20 flex items-baseline justify-between">
                      <div>
                        <span className="font-mono text-title-lg font-extrabold text-primary">
                          {distanceKm.toFixed(2)} km
                        </span>
                        <span className="text-body-sm font-mono text-on-surface-variant ml-2">
                          ({calculatedDistanceMiles} miles)
                        </span>
                      </div>
                      <span className="text-[12px] text-on-surface-variant">
                        {(distanceKm * 1000).toFixed(0)} meters
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <input
                            type="number"
                            id="inputDistance"
                            step="any"
                            min="0.01"
                            value={distanceVal}
                            onChange={(e) => onDistanceValChange(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                            placeholder="e.g. 10"
                          />
                        </div>
                        <select
                          id="selectDistanceUnit"
                          value={distanceUnit}
                          onChange={(e) => onDistanceUnitChange(e.target.value as DistanceUnit)}
                          aria-label="Distance unit"
                          className="px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
                        >
                          <option value="km">Kilometers (km)</option>
                          <option value="miles">Miles (mi)</option>
                          <option value="meters">Meters (m)</option>
                          <option value="yards">Yards (yd)</option>
                        </select>
                      </div>

                      {/* Distance Quick Pills */}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        <button
                          type="button"
                          onClick={() => onApplyPreset(OFFICIAL_DISTANCES_KM.fiveK, 'km')}
                          className="px-2.5 py-1 rounded-md bg-surface-container hover:bg-surface-container-high text-on-surface text-[12px] font-medium transition-colors cursor-pointer"
                        >
                          5K (5.0 km)
                        </button>
                        <button
                          type="button"
                          onClick={() => onApplyPreset(OFFICIAL_DISTANCES_KM.tenK, 'km')}
                          className="px-2.5 py-1 rounded-md bg-surface-container hover:bg-surface-container-high text-on-surface text-[12px] font-medium transition-colors cursor-pointer"
                        >
                          10K (10.0 km)
                        </button>
                        <button
                          type="button"
                          onClick={() => onApplyPreset(OFFICIAL_DISTANCES_KM.halfMarathon, 'km')}
                          className="px-2.5 py-1 rounded-md bg-surface-container hover:bg-surface-container-high text-on-surface text-[12px] font-medium transition-colors cursor-pointer"
                        >
                          Half Marathon (21.1 km)
                        </button>
                        <button
                          type="button"
                          onClick={() => onApplyPreset(OFFICIAL_DISTANCES_KM.marathon, 'km')}
                          className="px-2.5 py-1 rounded-md bg-surface-container hover:bg-surface-container-high text-on-surface text-[12px] font-medium transition-colors cursor-pointer"
                        >
                          Marathon (42.2 km)
                        </button>
                        <button
                          type="button"
                          onClick={() => onApplyPreset(OFFICIAL_DISTANCES_KM.fiftyK, 'km')}
                          className="px-2.5 py-1 rounded-md bg-surface-container hover:bg-surface-container-high text-on-surface text-[12px] font-medium transition-colors cursor-pointer"
                        >
                          50K Ultra
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* 2. TIME FIELD */}
                <div
                  className={`p-3 rounded-lg border transition-all ${
                    isTimeOutput
                      ? 'border-primary/50 bg-primary/5'
                      : 'border-surface-container bg-surface-container-lowest'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-label-md text-label-md text-on-surface font-medium flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-primary text-[18px]">timer</span>
                      <span>Target / Finish Time</span>
                      {isTimeOutput && (
                        <span className="text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                          Calculated Result
                        </span>
                      )}
                    </label>
                    <span className="text-[12px] text-on-surface-variant font-mono">
                      {isTimeOutput ? 'HH : MM : SS' : 'Hours : Minutes : Seconds'}
                    </span>
                  </div>

                  {isTimeOutput ? (
                    <div className="py-2 px-3 rounded-lg bg-surface-container-low border border-primary/20 flex items-baseline justify-between">
                      <span className="font-mono text-display-xs font-extrabold text-primary" id="dispCalculatedTime">
                        {formatTime(totalSeconds)}
                      </span>
                      <span className="text-[12px] text-on-surface-variant">
                        {calculatedTimeHms.h > 0 ? `${calculatedTimeHms.h}h ` : ''}
                        {calculatedTimeHms.m}m {calculatedTimeHms.s}s total duration
                      </span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      <div className="relative">
                        <input
                          type="number"
                          id="inputTimeHours"
                          min="0"
                          max="99"
                          value={timeHours}
                          onChange={(e) => onTimeHoursChange(e.target.value)}
                          aria-label="Hours"
                          className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface font-body-md text-center focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                          placeholder="00"
                        />
                        <span className="absolute right-2 top-2.5 text-[11px] font-semibold text-on-surface-variant pointer-events-none">
                          HR
                        </span>
                      </div>
                      <div className="relative">
                        <input
                          type="number"
                          id="inputTimeMinutes"
                          min="0"
                          max="59"
                          value={timeMinutes}
                          onChange={(e) => onTimeMinutesChange(e.target.value)}
                          aria-label="Minutes"
                          className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface font-body-md text-center focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                          placeholder="50"
                        />
                        <span className="absolute right-2 top-2.5 text-[11px] font-semibold text-on-surface-variant pointer-events-none">
                          MIN
                        </span>
                      </div>
                      <div className="relative">
                        <input
                          type="number"
                          id="inputTimeSeconds"
                          min="0"
                          max="59"
                          value={timeSeconds}
                          onChange={(e) => onTimeSecondsChange(e.target.value)}
                          aria-label="Seconds"
                          className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface font-body-md text-center focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                          placeholder="00"
                        />
                        <span className="absolute right-2 top-2.5 text-[11px] font-semibold text-on-surface-variant pointer-events-none">
                          SEC
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. PACE FIELD */}
                <div
                  className={`p-3 rounded-lg border transition-all ${
                    isPaceOutput
                      ? 'border-primary/50 bg-primary/5'
                      : 'border-surface-container bg-surface-container-lowest'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-label-md text-label-md text-on-surface font-medium flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-primary text-[18px]">speed</span>
                      <span>Target Pace Rate</span>
                      {isPaceOutput && (
                        <span className="text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                          Calculated Result
                        </span>
                      )}
                    </label>
                    <span className="text-[12px] text-on-surface-variant">
                      {isPaceOutput ? 'Calculated from Distance & Time' : 'Minutes : Seconds per unit'}
                    </span>
                  </div>

                  {isPaceOutput ? (
                    <div className="py-2 px-3 rounded-lg bg-surface-container-low border border-primary/20 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono text-display-xs font-extrabold text-primary" id="dispCalculatedPaceKm">
                          {formatPace(paceSecPerKm)}
                        </span>
                        <span className="text-body-sm font-medium text-on-surface">min/km</span>
                        <span className="text-on-surface-variant">|</span>
                        <span className="font-mono text-title-md font-bold text-on-surface" id="dispCalculatedPaceMile">
                          {formatPace(pacePerMileSec)}
                        </span>
                        <span className="text-body-sm text-on-surface-variant">min/mile</span>
                      </div>
                      <span className="text-[12px] font-mono text-on-surface-variant">
                        Velocity: {speedKmh.toFixed(2)} km/h ({speedMph.toFixed(2)} mph)
                      </span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                      <div className="sm:col-span-4 relative">
                        <input
                          type="number"
                          id="inputPaceMinutes"
                          min="0"
                          max="59"
                          value={paceMinutes}
                          onChange={(e) => onPaceMinutesChange(e.target.value)}
                          aria-label="Pace Minutes"
                          className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface font-body-md text-center focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                          placeholder="5"
                        />
                        <span className="absolute right-2 top-2.5 text-[11px] font-semibold text-on-surface-variant pointer-events-none">
                          MIN
                        </span>
                      </div>
                      <div className="sm:col-span-4 relative">
                        <input
                          type="number"
                          id="inputPaceSeconds"
                          min="0"
                          max="59"
                          value={paceSeconds}
                          onChange={(e) => onPaceSecondsChange(e.target.value)}
                          aria-label="Pace Seconds"
                          className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface font-body-md text-center focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                          placeholder="00"
                        />
                        <span className="absolute right-2 top-2.5 text-[11px] font-semibold text-on-surface-variant pointer-events-none">
                          SEC
                        </span>
                      </div>
                      <div className="sm:col-span-4">
                        <select
                          id="selectPaceUnit"
                          value={paceUnit}
                          onChange={(e) => onPaceUnitChange(e.target.value as PaceUnit)}
                          aria-label="Pace Unit"
                          className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
                        >
                          <option value="km">/ Kilometer</option>
                          <option value="mile">/ Mile</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. SPLIT STRATEGY SELECTOR */}
                <div>
                  <label className="block font-label-md text-label-md text-on-surface font-medium mb-1.5">
                    Race Day Split Execution Strategy
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      id="strategy-even"
                      onClick={() => onSplitStrategyChange('even')}
                      className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                        splitStrategy === 'even'
                          ? 'border-primary bg-primary/10 text-primary font-semibold shadow-xs'
                          : 'border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-container'
                      }`}
                    >
                      <span className="block text-body-sm font-medium">Even Pace</span>
                      <span className="text-[11px] text-on-surface-variant block mt-0.5">Optimal glycogen economy</span>
                    </button>
                    <button
                      type="button"
                      id="strategy-negative"
                      onClick={() => onSplitStrategyChange('negative')}
                      className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                        splitStrategy === 'negative'
                          ? 'border-secondary bg-secondary/10 text-secondary font-semibold shadow-xs'
                          : 'border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-container'
                      }`}
                    >
                      <span className="block text-body-sm font-medium">Negative Split</span>
                      <span className="text-[11px] text-on-surface-variant block mt-0.5">Conservative start, fast finish</span>
                    </button>
                    <button
                      type="button"
                      id="strategy-positive"
                      onClick={() => onSplitStrategyChange('positive')}
                      className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                        splitStrategy === 'positive'
                          ? 'border-amber-600 bg-amber-50 text-amber-800 font-semibold shadow-xs'
                          : 'border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-container'
                      }`}
                    >
                      <span className="block text-body-sm font-medium">Positive Split</span>
                      <span className="text-[11px] text-on-surface-variant block mt-0.5">Aggressive bank start</span>
                    </button>
                  </div>
                </div>

                {/* 5. ENVIRONMENTAL & CALORIC CALIBRATION */}
                <div className="pt-space-xs border-t border-surface-container">
                  <span className="block text-[12px] font-semibold uppercase tracking-wider text-on-surface-variant mb-2">
                    Environmental &amp; Physiological Parameters
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label htmlFor="inputElevation" className="block text-[12px] font-medium text-on-surface-variant mb-1">
                        Elevation Gain (m)
                      </label>
                      <input
                        type="number"
                        id="inputElevation"
                        min="0"
                        value={envElevation}
                        onChange={(e) => onEnvElevationChange(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-body-sm focus:outline-none focus:border-primary"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label htmlFor="selectTerrain" className="block text-[12px] font-medium text-on-surface-variant mb-1">
                        Terrain Surface
                      </label>
                      <select
                        id="selectTerrain"
                        value={envTerrain}
                        onChange={(e) => onEnvTerrainChange(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-body-sm focus:outline-none focus:border-primary cursor-pointer"
                      >
                        <option value="road">Road / Asphalt (1.00x)</option>
                        <option value="track">Synthetic Track (0.99x)</option>
                        <option value="treadmill">Treadmill (0.96x)</option>
                        <option value="trail">Gravel / Trail (1.08x)</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="inputRunnerWeight" className="block text-[12px] font-medium text-on-surface-variant mb-1">
                        Body Weight (kg)
                      </label>
                      <input
                        type="number"
                        id="inputRunnerWeight"
                        min="30"
                        max="250"
                        value={runnerWeight}
                        onChange={(e) => onRunnerWeightChange(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-body-sm focus:outline-none focus:border-primary"
                        placeholder="70"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Output Dashboard & Scientific Equivalencies */}
          <div className="lg:col-span-5 flex flex-col gap-space-md">
            {/* Primary Metrics Card */}
            <div className="bg-surface-container-lowest rounded-xl border border-surface-container p-space-md shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between pb-space-xs border-b border-surface-container mb-space-sm">
                <span className="text-label-md font-semibold uppercase tracking-wider text-primary flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px]">analytics</span>
                  <span>Calculated Performance Metrics</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-primary/10 text-primary">
                  USATF Tangent Rule
                </span>
              </div>

              {/* Main Stat Callouts */}
              <div className="grid grid-cols-2 gap-space-sm mb-space-md">
                <div className="p-space-sm rounded-lg bg-surface-container-low border border-surface-container">
                  <span className="block text-[12px] font-medium text-on-surface-variant">
                    Target Pace (/km)
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="font-display-md text-display-md font-extrabold text-on-surface tracking-tight" id="dispPaceKm">
                      {formatPace(paceSecPerKm)}
                    </span>
                    <span className="text-body-sm text-on-surface-variant font-medium">/km</span>
                  </div>
                  <span className="block text-[12px] text-on-surface-variant mt-1 font-mono" id="dispPaceMile">
                    {formatPace(pacePerMileSec)} /mile
                  </span>
                </div>

                <div className="p-space-sm rounded-lg bg-surface-container-low border border-surface-container">
                  <span className="block text-[12px] font-medium text-on-surface-variant">
                    Total Finish Time
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="font-display-md text-display-md font-extrabold text-primary tracking-tight" id="dispTotalTime">
                      {formatTime(totalSeconds)}
                    </span>
                  </div>
                  <span className="block text-[12px] text-on-surface-variant mt-1">
                    for {distanceKm.toFixed(2)} km ({calculatedDistanceMiles} mi)
                  </span>
                </div>
              </div>

              {/* Velocity & Track Split Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-space-md text-center">
                <div className="p-2 rounded-md bg-surface-container">
                  <span className="block text-[11px] text-on-surface-variant">Speed (km/h)</span>
                  <span className="font-title-md text-title-md font-bold text-on-surface" id="dispSpeedKmh">
                    {speedKmh.toFixed(2)}
                  </span>
                </div>
                <div className="p-2 rounded-md bg-surface-container">
                  <span className="block text-[11px] text-on-surface-variant">Speed (mph)</span>
                  <span className="font-title-md text-title-md font-bold text-on-surface" id="dispSpeedMph">
                    {speedMph.toFixed(2)}
                  </span>
                </div>
                <div className="p-2 rounded-md bg-surface-container">
                  <span className="block text-[11px] text-on-surface-variant">400m Track Lap</span>
                  <span className="font-title-md text-title-md font-bold text-on-surface" id="dispLap400m">
                    {formatPace(track400mSec)}
                  </span>
                </div>
                <div className="p-2 rounded-md bg-surface-container">
                  <span className="block text-[11px] text-on-surface-variant">100m Sprint</span>
                  <span className="font-title-md text-title-md font-bold text-on-surface" id="dispSprint100m">
                    {track100mSec.toFixed(1)}s
                  </span>
                </div>
              </div>

              {/* Energy Expenditure & VDOT Score */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-space-md">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container border border-surface-container">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-amber-600 text-[18px]">
                      local_fire_department
                    </span>
                    <span className="text-[12px] font-medium text-on-surface">Calorie Burn</span>
                  </div>
                  <span className="font-mono text-title-sm font-bold text-on-surface" id="dispCalories">
                    ~{estCalories} kcal
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container border border-surface-container">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-[18px]">
                      vital_signs
                    </span>
                    <span className="text-[12px] font-medium text-on-surface">Daniels VDOT</span>
                  </div>
                  <a
                    href="#trainingZonesGrid"
                    className="font-mono text-title-sm font-bold text-primary hover:underline"
                    title="View Jack Daniels training zones"
                  >
                    {vdotScore.toFixed(1)} score →
                  </a>
                </div>
              </div>

              {/* Race Distance Equivalence Projections (Peter Riegel Formula) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[12px] font-semibold uppercase tracking-wider text-on-surface-variant">
                    Race Projections (Peter Riegel Formula)
                  </span>
                  <span className="text-[11px] font-mono text-on-surface-variant">Exponent: 1.06</span>
                </div>
                <div className="divide-y divide-surface-container border border-surface-container rounded-lg overflow-hidden text-body-sm">
                  <div className="flex items-center justify-between px-3 py-2 bg-surface-container-lowest">
                    <span className="font-medium text-on-surface">5K Road Race</span>
                    <div className="text-right">
                      <span className="font-mono font-semibold text-on-surface">{riegel5K.formattedTime}</span>
                      <span className="text-[11px] font-mono text-on-surface-variant ml-2">
                        ({formatPace(riegel5K.paceSecKm)}/km)
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between px-3 py-2 bg-surface-container-lowest">
                    <span className="font-medium text-on-surface">10K Road Race</span>
                    <div className="text-right">
                      <span className="font-mono font-semibold text-on-surface">{riegel10K.formattedTime}</span>
                      <span className="text-[11px] font-mono text-on-surface-variant ml-2">
                        ({formatPace(riegel10K.paceSecKm)}/km)
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between px-3 py-2 bg-surface-container-lowest">
                    <span className="font-medium text-on-surface">Half Marathon (21.1 km)</span>
                    <div className="text-right">
                      <span className="font-mono font-semibold text-on-surface">{riegelHalf.formattedTime}</span>
                      <span className="text-[11px] font-mono text-on-surface-variant ml-2">
                        ({formatPace(riegelHalf.paceSecKm)}/km)
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between px-3 py-2 bg-surface-container-lowest">
                    <span className="font-medium text-on-surface">Full Marathon (42.2 km)</span>
                    <div className="text-right">
                      <span className="font-mono font-semibold text-primary">{riegelFull.formattedTime}</span>
                      <span className="text-[11px] font-mono text-primary/80 ml-2">
                        ({formatPace(riegelFull.paceSecKm)}/km)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scientific Sources Badge */}
              <div className="mt-space-sm pt-space-xs border-t border-surface-container flex items-center justify-between text-[11px] text-on-surface-variant">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-primary">verified</span>
                  <span>Scientific sources: VDOT (Daniels), Riegel (1.06), USATF SPR</span>
                </span>
                <a href="#trainingZonesGrid" className="text-primary hover:underline font-medium">
                  Scientific Details ↓
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
