import React from 'react';
import { SplitCheckpoint, SplitViewUnit } from '../types';
import { formatPace, formatTime, KM_TO_MILES, MILES_TO_KM } from '../utils';

interface SplitMatrixSectionProps {
  splits: SplitCheckpoint[];
  splitView: SplitViewUnit;
  onSetSplitView: (unit: SplitViewUnit) => void;
  onPrint: () => void;
  onCopyPlan?: () => void;
  copied?: boolean;
  distanceKm?: number;
  totalSeconds?: number;
  paceSecPerKm?: number;
  splitStrategy?: string;
  vdot?: number;
}

export default function SplitMatrixSection({
  splits,
  splitView,
  onSetSplitView,
  onPrint,
  onCopyPlan,
  copied = false,
  distanceKm = 10,
  totalSeconds = 3000,
  paceSecPerKm = 300,
  splitStrategy = 'even',
  vdot = 42,
}: SplitMatrixSectionProps) {
  const isKm = splitView === 'km';
  const paceKmFormatted = formatPace(paceSecPerKm);
  const paceMileFormatted = formatPace(paceSecPerKm * MILES_TO_KM);
  const distanceMiles = (distanceKm * KM_TO_MILES).toFixed(2);

  return (
    <section id="splitMatrixSection" className="w-full py-space-lg bg-surface border-t border-surface-container print:border-none print:py-0 print:bg-white">
      <div className="max-w-[1280px] mx-auto px-gutter-mobile lg:px-gutter-desktop print:px-0 print:max-w-none">
        
        {/* Printable Official Header & Watermark (Visible ONLY when printing) */}
        <div className="hidden print:block mb-5 pb-4 border-b-2 border-slate-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-black text-white flex items-center justify-center font-black text-base tracking-wider">
                SI
              </div>
              <div>
                <div className="text-xl font-black tracking-tight text-black flex items-center gap-2">
                  <span>Solveitcalculator.com</span>
                  <span className="text-[11px] font-normal px-2 py-0.5 rounded border border-slate-400 text-slate-700 uppercase tracking-wider">
                    Official Pace Sheet
                  </span>
                </div>
                <div className="text-xs text-slate-600 font-medium">
                  Running Pace &amp; Lap Split Calculator • Precision Split Matrix
                </div>
              </div>
            </div>
            <div className="text-right text-[11px] text-slate-600">
              <div className="font-semibold text-black">Watermark: Solveitcalculator.com</div>
              <div>https://solveitcalculator.com/running-pace-calculator/</div>
            </div>
          </div>

          {/* Race Summary Metric Badges for Print */}
          <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-slate-200 text-center">
            <div className="p-2 bg-slate-50 border border-slate-300 rounded">
              <div className="text-[10px] uppercase font-bold text-slate-500">Race Distance</div>
              <div className="text-sm font-black text-black">{distanceKm.toFixed(2)} km ({distanceMiles} mi)</div>
            </div>
            <div className="p-2 bg-slate-50 border border-slate-300 rounded">
              <div className="text-[10px] uppercase font-bold text-slate-500">Finish Clock</div>
              <div className="text-sm font-black text-black">{formatTime(totalSeconds)}</div>
            </div>
            <div className="p-2 bg-slate-50 border border-slate-300 rounded">
              <div className="text-[10px] uppercase font-bold text-slate-500">Target Pace</div>
              <div className="text-sm font-black text-black">{paceKmFormatted}/km • {paceMileFormatted}/mi</div>
            </div>
            <div className="p-2 bg-slate-50 border border-slate-300 rounded">
              <div className="text-[10px] uppercase font-bold text-slate-500">Strategy &amp; VDOT</div>
              <div className="text-sm font-black text-black">{splitStrategy.toUpperCase()} • VDOT {vdot.toFixed(1)}</div>
            </div>
          </div>
        </div>

        {/* Screen View Controls & Header (Hidden on Print) */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-space-sm mb-space-md print:hidden">
          <div>
            <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
              Split Table Generator &amp; Printable Race-Day Wristband
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
              Granular checkpoint-by-checkpoint elapsed splits and delta pace variations.
            </p>
          </div>

          <div className="flex items-center gap-space-xs flex-wrap">
            <div className="flex rounded-lg border border-outline-variant p-0.5 bg-surface-container">
              <button
                type="button"
                id="btnSplitKm"
                onClick={() => onSetSplitView('km')}
                className={`px-3 py-1 rounded-md text-label-md font-medium transition-all cursor-pointer ${
                  isKm
                    ? 'bg-surface-container-lowest text-primary shadow-xs font-semibold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Kilometers (/km)
              </button>
              <button
                type="button"
                id="btnSplitMile"
                onClick={() => onSetSplitView('miles')}
                className={`px-3 py-1 rounded-md text-label-md font-medium transition-all cursor-pointer ${
                  !isKm
                    ? 'bg-surface-container-lowest text-primary shadow-xs font-semibold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Miles (/mi)
              </button>
            </div>

            {onCopyPlan && (
              <button
                type="button"
                onClick={onCopyPlan}
                title="Copy plan to clipboard with Solveitcalculator.com watermark"
                className="px-3 py-1.5 rounded-lg border border-outline-variant bg-surface-container-lowest hover:bg-surface-container text-on-surface text-body-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {copied ? 'check' : 'content_copy'}
                </span>
                <span>{copied ? 'Copied with Watermark!' : 'Copy Plan'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onPrint}
              title="Print pace sheet and wristband with Solveitcalculator.com watermark"
              className="px-3 py-1.5 rounded-lg border border-outline-variant bg-surface-container-lowest hover:bg-surface-container text-on-surface text-body-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Print Pace Band</span>
            </button>
          </div>
        </div>

        {/* Printable Wristband Container & Table */}
        <div className="relative bg-surface-container-lowest rounded-xl border border-surface-container shadow-xs overflow-hidden print:border print:border-slate-300 print:shadow-none print:overflow-visible">
          
          {/* Subtle Repeating Watermark Overlay across Print Area */}
          <div
            aria-hidden="true"
            className="hidden print:flex absolute inset-0 pointer-events-none items-center justify-center overflow-hidden z-0 select-none"
          >
            <div className="text-slate-300 font-black text-6xl tracking-widest uppercase transform -rotate-25 opacity-20 whitespace-nowrap">
              Solveitcalculator.com • Solveitcalculator.com
            </div>
          </div>

          <div className="relative z-10 overflow-x-auto max-h-[480px] overflow-y-auto print:max-h-none print:overflow-visible">
            <table className="w-full text-left border-collapse print:text-black print:text-[12px]" id="splitTable">
              <thead className="bg-surface-container sticky top-0 z-10 text-on-surface-variant font-label-md text-label-md uppercase tracking-wider print:bg-slate-100 print:text-black print:border-b-2 print:border-slate-300">
                <tr>
                  <th className="py-2.5 px-4 font-semibold print:py-1.5 print:px-2">Checkpoint</th>
                  <th className="py-2.5 px-4 font-semibold print:py-1.5 print:px-2">Interval Distance</th>
                  <th className="py-2.5 px-4 font-semibold print:py-1.5 print:px-2">Split Duration</th>
                  <th className="py-2.5 px-4 font-semibold print:py-1.5 print:px-2">Split Pace</th>
                  <th className="py-2.5 px-4 font-semibold print:py-1.5 print:px-2 print:hidden">Strategy Delta</th>
                  <th className="py-2.5 px-4 font-semibold text-right print:py-1.5 print:px-2">Cumulative Elapsed Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container text-body-sm font-body-sm print:divide-slate-200">
                {splits.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-on-surface-variant print:text-slate-600">
                      Enter distance and time parameters to generate race-day lap splits.
                    </td>
                  </tr>
                ) : (
                  splits.map((s, idx) => (
                    <tr
                      key={idx}
                      className={`print:bg-white ${
                        idx % 2 === 0 ? 'bg-surface-container-lowest print:bg-slate-50/50' : 'bg-surface-container/30'
                      }`}
                    >
                      <td className="py-2.5 px-4 font-medium text-on-surface flex items-center gap-2 print:py-1.5 print:px-2 print:text-black">
                        <span className="w-5 h-5 rounded-full bg-surface-container flex items-center justify-center text-[11px] font-semibold text-on-surface-variant print:bg-slate-200 print:text-black">
                          {idx + 1}
                        </span>
                        {s.label}
                      </td>
                      <td className="py-2.5 px-4 text-on-surface-variant font-mono text-[13px] print:py-1.5 print:px-2 print:text-slate-800">
                        {s.intervalDistanceText || (isKm ? '1.00 km' : '1.00 mi')}
                      </td>
                      <td className="py-2.5 px-4 font-mono font-medium text-on-surface print:py-1.5 print:px-2 print:text-black">
                        {s.splitDurationFormatted || formatTime(s.splitDurationSec)}
                      </td>
                      <td className="py-2.5 px-4 font-mono font-medium text-on-surface print:py-1.5 print:px-2 print:text-black">
                        {formatPace(s.splitPaceSec)} /{isKm ? 'km' : 'mi'}
                      </td>
                      <td className={`py-2.5 px-4 font-mono text-[13px] font-semibold ${s.deltaColorClass} print:hidden`}>
                        {s.deltaText}
                      </td>
                      <td className="py-2.5 px-4 font-mono font-bold text-on-surface text-right print:py-1.5 print:px-2 print:text-black">
                        {formatTime(s.cumulativeSec)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Printable Race Wristband Cut-Out Strip (Visible ONLY when printing) */}
        {splits.length > 0 && (
          <div className="hidden print:block mt-6 pt-4 border-t-2 border-dashed border-slate-400">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-800 mb-2 flex items-center justify-between">
              <span>✂ Race-Day Wristband (Cut along dashed line &amp; wrap around forearm)</span>
              <span className="font-mono text-[10px] text-slate-500">Watermark: Solveitcalculator.com</span>
            </div>
            
            <div className="border-2 border-slate-900 rounded bg-white overflow-hidden flex items-stretch">
              <div className="bg-slate-900 text-white font-bold text-[8px] px-2 py-1 flex items-center justify-center uppercase tracking-widest select-none">
                Solveitcalculator.com
              </div>
              <div className="flex flex-wrap divide-x divide-slate-300 flex-1">
                {splits.map((s, idx) => (
                  <div key={idx} className="px-2 py-1 text-center min-w-[50px] flex-1">
                    <div className="text-[8px] text-slate-500 font-semibold">{s.label}</div>
                    <div className="font-mono font-bold text-slate-900 text-[10px]">{formatTime(s.cumulativeSec)}</div>
                    <div className="text-[7px] font-mono text-slate-600">{formatPace(s.splitPaceSec)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Printable Watermark Footer (Visible ONLY when printing) */}
        <div className="hidden print:flex items-center justify-between pt-3 mt-4 border-t border-slate-300 text-[10px] text-slate-500">
          <div>
            Watermark: <strong className="text-black">Solveitcalculator.com</strong> • Running Pace &amp; Lap Split Calculator
          </div>
          <div>
            Verified Algorithmic Engine • https://solveitcalculator.com/running-pace-calculator/
          </div>
        </div>

      </div>
    </section>
  );
}
