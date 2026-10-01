'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { CalculationMode, DistanceUnit, PaceUnit, SplitStrategy, SplitViewUnit } from './types';
import {
  calculateVDOT,
  formatPace,
  formatTime,
  fromKilometers,
  generateSplits,
  KM_TO_MILES,
  MILES_TO_KM,
  OFFICIAL_DISTANCES_KM,
  toKilometers,
} from './utils';

import HeaderSection from './components/HeaderSection';
import ModeNavRail from './components/ModeNavRail';
import WorkbenchSection from './components/WorkbenchSection';
import SplitMatrixSection from './components/SplitMatrixSection';
import PaceSimulatorSection from './components/PaceSimulatorSection';
import TrainingZonesSection from './components/TrainingZonesSection';
import StrategyVisualSection from './components/StrategyVisualSection';
import ProblemSolversSection from './components/ProblemSolversSection';
import PaceTableMatrix from './components/PaceTableMatrix';
import RunningScienceSection from './components/RunningScienceSection';
import FaqSection from './components/FaqSection';
import ConnectedWorkbenches from './components/ConnectedWorkbenches';

export default function RunningPaceCalculatorClient() {
  const [mode, setMode] = useState<CalculationMode>('pace');

  // Distance input state
  const [distanceVal, setDistanceVal] = useState<string>('10');
  const [distanceUnit, setDistanceUnit] = useState<DistanceUnit>('km');

  // Time input state
  const [timeHours, setTimeHours] = useState<string>('0');
  const [timeMinutes, setTimeMinutes] = useState<string>('50');
  const [timeSeconds, setTimeSeconds] = useState<string>('0');

  // Pace input state
  const [paceMinutes, setPaceMinutes] = useState<string>('5');
  const [paceSeconds, setPaceSeconds] = useState<string>('0');
  const [paceUnit, setPaceUnit] = useState<PaceUnit>('km');

  // Strategy and View
  const [splitStrategy, setSplitStrategy] = useState<SplitStrategy>('even');
  const [splitView, setSplitView] = useState<SplitViewUnit>('km');

  // Environmental calibrations
  const [envElevation, setEnvElevation] = useState<string>('0');
  const [envTerrain, setEnvTerrain] = useState<string>('road');
  const [runnerWeight, setRunnerWeight] = useState<string>('70');

  const [copied, setCopied] = useState<boolean>(false);

  // Derived Distance, Time, and Pace with mathematically rigorous 3-way synchronization
  const { distanceKm, totalSeconds, paceSecPerKm } = useMemo(() => {
    // Parse raw time
    const h = Math.max(0, parseInt(timeHours, 10) || 0);
    const m = Math.max(0, parseInt(timeMinutes, 10) || 0);
    const s = Math.max(0, parseInt(timeSeconds, 10) || 0);
    const parsedTimeSec = h * 3600 + m * 60 + s;

    // Parse raw pace
    const pm = Math.max(0, parseInt(paceMinutes, 10) || 0);
    const ps = Math.max(0, parseInt(paceSeconds, 10) || 0);
    const parsedPaceRaw = pm * 60 + ps;
    const parsedPaceKm = paceUnit === 'mile' ? parsedPaceRaw / MILES_TO_KM : parsedPaceRaw;

    // Parse raw distance
    const parsedDistRaw = parseFloat(distanceVal) || 0;
    const parsedDistKm = toKilometers(parsedDistRaw, distanceUnit);

    if (mode === 'time') {
      // Input: Distance & Pace -> Output: Total Time
      const effectiveDistKm = parsedDistKm > 0 ? parsedDistKm : 10;
      const effectivePaceKm = parsedPaceKm > 0 ? parsedPaceKm : 300; // 5:00/km default
      const calculatedSec = Math.round(effectiveDistKm * effectivePaceKm);
      return {
        distanceKm: effectiveDistKm,
        totalSeconds: calculatedSec,
        paceSecPerKm: effectivePaceKm,
      };
    }

    if (mode === 'distance') {
      // Input: Time & Pace -> Output: Distance
      const effectiveTimeSec = parsedTimeSec > 0 ? parsedTimeSec : 3000; // 50m default
      const effectivePaceKm = parsedPaceKm > 0 ? parsedPaceKm : 300; // 5:00/km default
      const calculatedDistKm = effectivePaceKm > 0 ? effectiveTimeSec / effectivePaceKm : 10;
      return {
        distanceKm: calculatedDistKm,
        totalSeconds: effectiveTimeSec,
        paceSecPerKm: effectivePaceKm,
      };
    }

    // Default 'pace' mode or race target presets
    // Input: Distance & Time -> Output: Pace
    const effectiveDistKm = parsedDistKm > 0 ? parsedDistKm : 10;
    const effectiveTimeSec = parsedTimeSec > 0 ? parsedTimeSec : 3000;
    const calculatedPaceKm = effectiveDistKm > 0 ? effectiveTimeSec / effectiveDistKm : 300;

    return {
      distanceKm: effectiveDistKm,
      totalSeconds: effectiveTimeSec,
      paceSecPerKm: calculatedPaceKm,
    };
  }, [
    mode,
    distanceVal,
    distanceUnit,
    timeHours,
    timeMinutes,
    timeSeconds,
    paceMinutes,
    paceSeconds,
    paceUnit,
  ]);

  // Derived splits with 100% cumulative time normalization
  const splits = useMemo(() => {
    return generateSplits(distanceKm, totalSeconds, paceSecPerKm, splitStrategy, splitView);
  }, [distanceKm, totalSeconds, paceSecPerKm, splitStrategy, splitView]);

  // Calculated VDOT for exports and previews
  const vdot = useMemo(() => {
    return calculateVDOT(distanceKm, totalSeconds);
  }, [distanceKm, totalSeconds]);

  // Mode switching
  const handleSelectMode = useCallback((newMode: CalculationMode) => {
    setMode(newMode);

    if (newMode === '5k') {
      setDistanceVal(OFFICIAL_DISTANCES_KM.fiveK.toString());
      setDistanceUnit('km');
      setTimeHours('0');
      setTimeMinutes('25');
      setTimeSeconds('0');
    } else if (newMode === '10k') {
      setDistanceVal(OFFICIAL_DISTANCES_KM.tenK.toString());
      setDistanceUnit('km');
      setTimeHours('0');
      setTimeMinutes('50');
      setTimeSeconds('0');
    } else if (newMode === 'half') {
      setDistanceVal(OFFICIAL_DISTANCES_KM.halfMarathon.toString());
      setDistanceUnit('km');
      setTimeHours('1');
      setTimeMinutes('45');
      setTimeSeconds('0');
    } else if (newMode === 'marathon') {
      setDistanceVal(OFFICIAL_DISTANCES_KM.marathon.toString());
      setDistanceUnit('km');
      setTimeHours('3');
      setTimeMinutes('30');
      setTimeSeconds('0');
    } else if (newMode === 'splits') {
      const el = document.getElementById('splitMatrixSection');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (newMode === 'zones') {
      const el = document.getElementById('trainingZonesGrid');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleApplyPreset = useCallback((distKm: number, unit: DistanceUnit) => {
    const converted = fromKilometers(distKm, unit);
    setDistanceVal(converted.toFixed(unit === 'meters' || unit === 'yards' ? 0 : 2));
    setDistanceUnit(unit);
  }, []);

  const handleReset = useCallback(() => {
    setDistanceVal('10');
    setDistanceUnit('km');
    setTimeHours('0');
    setTimeMinutes('50');
    setTimeSeconds('0');
    setPaceMinutes('5');
    setPaceSeconds('0');
    setPaceUnit('km');
    setSplitStrategy('even');
    setMode('pace');
  }, []);

  const handleSelectQuery = useCallback(
    (distKm: number, hours: number, mins: number, secs: number) => {
      setDistanceVal(distKm.toString());
      setDistanceUnit('km');
      setTimeHours(hours.toString());
      setTimeMinutes(mins.toString());
      setTimeSeconds(secs.toString());
      setMode('pace');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    []
  );

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleCopyPlan = useCallback(() => {
    const paceKm = formatPace(paceSecPerKm);
    const paceMile = formatPace(paceSecPerKm * MILES_TO_KM);
    const isKm = splitView === 'km';
    const distanceMiles = (distanceKm * KM_TO_MILES).toFixed(2);

    // Format top checkpoints (first 15 checkpoints)
    const checkpointsList = splits
      .slice(0, 15)
      .map(
        (s) =>
          `  • ${s.label}: Split ${s.splitDurationFormatted || formatTime(s.splitDurationSec)} (${formatPace(
            s.splitPaceSec
          )}/${isKm ? 'km' : 'mi'}) | Cumulative ${formatTime(s.cumulativeSec)}`
      )
      .join('\n');
    const remainingCount = splits.length > 15 ? `\n  ... and ${splits.length - 15} additional checkpoints.` : '';

    const planText = `=====================================================
🏃 RUNNING PACE & RACE SPLIT PLAN
Watermark: Solveitcalculator.com
Source: https://solveitcalculator.com/running-pace-calculator/
=====================================================
Target Distance: ${distanceKm.toFixed(2)} km (${distanceMiles} mi)
Target Finish Time: ${formatTime(totalSeconds)}
Target Average Pace: ${paceKm} min/km | ${paceMile} min/mile
Split Strategy: ${splitStrategy.toUpperCase()}
Daniels VDOT Fitness Score: ${vdot.toFixed(1)}

Checkpoints Breakdown:
${checkpointsList || '  (No checkpoints generated)'}${remainingCount}

=====================================================
Watermark: Solveitcalculator.com
Every Calculation. One Place.
Precision Sports Physiology & Metrological Pace Engine
https://solveitcalculator.com/running-pace-calculator/
=====================================================`;

    const copySuccess = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    };

    const fallbackCopy = (text: string) => {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '-9999px';
        textarea.setAttribute('readonly', '');
        document.body.appendChild(textarea);
        textarea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textarea);
        if (successful) copySuccess();
      } catch (err) {
        console.error('Fallback clipboard copy failed:', err);
      }
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(planText)
        .then(copySuccess)
        .catch(() => {
          fallbackCopy(planText);
        });
    } else {
      fallbackCopy(planText);
    }
  }, [distanceKm, paceSecPerKm, totalSeconds, splitStrategy, vdot, splits, splitView]);

  const handleExportCSV = useCallback(() => {
    const isKm = splitView === 'km';
    let csv = 'Checkpoint,IntervalDistance,SplitDuration,SplitPace,CumulativeElapsedClock\n';

    splits.forEach((s) => {
      csv += `"${s.label}","${s.intervalDistanceText}","${s.splitDurationFormatted}","${formatPace(
        s.splitPaceSec
      )}/${isKm ? 'km' : 'mi'}","${formatTime(s.cumulativeSec)}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `running_splits_${isKm ? 'km' : 'mi'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [splits, splitView]);

  return (
    <main className="w-full pt-0 bg-surface min-h-screen">
      <div className="flex flex-col w-full">
        {/* Section 1: Breadcrumbs & Header Canvas */}
        <HeaderSection
          onPrint={handlePrint}
          onExportCSV={handleExportCSV}
          onCopyPlan={handleCopyPlan}
          copied={copied}
        />

        {/* Section 2: Mode Navigation Rail & Quick Target Shortcuts (Hidden on Print) */}
        <div className="print:hidden">
          <ModeNavRail activeMode={mode} onSelectMode={handleSelectMode} />
        </div>

        {/* Section 3: Dual Column Interactive Workbench Canvas (Hidden on Print) */}
        <div className="print:hidden">
          <WorkbenchSection
            activeMode={mode}
            distanceVal={distanceVal}
            distanceUnit={distanceUnit}
            timeHours={timeHours}
            timeMinutes={timeMinutes}
            timeSeconds={timeSeconds}
            paceMinutes={paceMinutes}
            paceSeconds={paceSeconds}
            paceUnit={paceUnit}
            splitStrategy={splitStrategy}
            envElevation={envElevation}
            envTerrain={envTerrain}
            runnerWeight={runnerWeight}
            distanceKm={distanceKm}
            totalSeconds={totalSeconds}
            paceSecPerKm={paceSecPerKm}
            onDistanceValChange={setDistanceVal}
            onDistanceUnitChange={setDistanceUnit}
            onTimeHoursChange={setTimeHours}
            onTimeMinutesChange={setTimeMinutes}
            onTimeSecondsChange={setTimeSeconds}
            onPaceMinutesChange={setPaceMinutes}
            onPaceSecondsChange={setPaceSeconds}
            onPaceUnitChange={setPaceUnit}
            onSplitStrategyChange={setSplitStrategy}
            onEnvElevationChange={setEnvElevation}
            onEnvTerrainChange={setEnvTerrain}
            onRunnerWeightChange={setRunnerWeight}
            onApplyPreset={handleApplyPreset}
            onReset={handleReset}
            onSelectMode={handleSelectMode}
          />
        </div>

        {/* Section 4: Split Table Generator & Printable Race Day Wristband */}
        <SplitMatrixSection
          splits={splits}
          splitView={splitView}
          onSetSplitView={setSplitView}
          onPrint={handlePrint}
          onCopyPlan={handleCopyPlan}
          copied={copied}
          distanceKm={distanceKm}
          totalSeconds={totalSeconds}
          paceSecPerKm={paceSecPerKm}
          splitStrategy={splitStrategy}
          vdot={vdot}
        />

        {/* Section 5: Interactive Pace Improvement Simulator (Hidden on Print) */}
        <div className="print:hidden">
          <PaceSimulatorSection />
        </div>

        {/* Section 6: Physiological Training Zones (Jack Daniels VDOT Model) (Hidden on Print) */}
        <div className="print:hidden">
          <TrainingZonesSection
            distanceKm={distanceKm}
            totalSeconds={totalSeconds}
            paceSecPerKm={paceSecPerKm}
          />
        </div>

        {/* Section 7: Split Strategy Visualization & Pace Velocity Gauge (Hidden on Print) */}
        <div className="print:hidden">
          <StrategyVisualSection />
        </div>

        {/* Section 8: Real-World Runner Problem Solvers (Hidden on Print) */}
        <div className="print:hidden">
          <ProblemSolversSection onSelectQuery={handleSelectQuery} />
        </div>

        {/* Section 9: Universal Master Running Pace Chart (Hidden on Print) */}
        <div className="print:hidden">
          <PaceTableMatrix />
        </div>

        {/* Section 10: Exercise Physiology & Pacing Mathematical Science (Hidden on Print) */}
        <div className="print:hidden">
          <RunningScienceSection />
        </div>

        {/* Section 11: Frequently Asked Questions & Expert Guidance (Hidden on Print) */}
        <div className="print:hidden">
          <FaqSection />
        </div>

        {/* Section 12: Connected Athletic & Timing Workbenches (Hidden on Print) */}
        <div className="print:hidden">
          <ConnectedWorkbenches />
        </div>

        {/* Copy Toast Notification */}
        {copied && (
          <div
            role="status"
            aria-live="polite"
            className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-body-sm font-medium border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200"
          >
            <span className="material-symbols-outlined text-emerald-400 text-[20px]">
              check_circle
            </span>
            <span>
              Plan copied with <strong className="text-emerald-400">Solveitcalculator.com</strong> watermark!
            </span>
          </div>
        )}
      </div>
    </main>
  );
}
