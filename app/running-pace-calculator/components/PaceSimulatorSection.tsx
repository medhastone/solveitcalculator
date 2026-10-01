import React, { useState, useMemo } from 'react';
import { formatTime } from '../utils';

export default function PaceSimulatorSection() {
  const [secondsPerKmDrop, setSecondsPerKmDrop] = useState<number>(10);
  const [cadenceGainSpm, setCadenceGainSpm] = useState<number>(5);

  // Time saved over distances for secondsPerKmDrop:
  const simSavings = useMemo(() => {
    return {
      fiveK: secondsPerKmDrop * 5,
      tenK: secondsPerKmDrop * 10,
      halfM: Math.round(secondsPerKmDrop * 21.0975),
      fullM: Math.round(secondsPerKmDrop * 42.195),
    };
  }, [secondsPerKmDrop]);

  return (
    <section className="w-full py-space-lg bg-surface border-t border-surface-container">
      <div className="max-w-[1280px] mx-auto px-gutter-mobile lg:px-gutter-desktop">
        <div className="mb-space-md">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">trending_up</span>
            <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
              Interactive Pace Improvement Simulator
            </h2>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Simulate how shaving seconds off your kilometer pace or increasing biomechanical step
            cadence transforms your race finishes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md">
          {/* Controls */}
          <div className="lg:col-span-5 bg-surface-container-lowest p-space-md rounded-xl border border-surface-container shadow-xs flex flex-col gap-space-md">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label
                  htmlFor="sliderSecDrop"
                  className="font-label-md text-label-md text-on-surface font-semibold"
                >
                  Pace Reduction per Kilometer
                </label>
                <span className="font-mono text-title-md font-bold text-primary">
                  -{secondsPerKmDrop}s /km
                </span>
              </div>
              <input
                type="range"
                id="sliderSecDrop"
                min="1"
                max="60"
                value={secondsPerKmDrop}
                onChange={(e) => setSecondsPerKmDrop(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[11px] text-on-surface-variant mt-1 font-mono">
                <span>-1s (Micro)</span>
                <span>-30s (Mid)</span>
                <span>-60s (Macro)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label
                  htmlFor="sliderCadence"
                  className="font-label-md text-label-md text-on-surface font-semibold"
                >
                  Cadence Increase (Steps/Minute)
                </label>
                <span className="font-mono text-title-md font-bold text-secondary">
                  +{cadenceGainSpm} spm
                </span>
              </div>
              <input
                type="range"
                id="sliderCadence"
                min="0"
                max="20"
                value={cadenceGainSpm}
                onChange={(e) => setCadenceGainSpm(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-surface-container rounded-lg appearance-none cursor-pointer accent-secondary"
              />
              <div className="flex justify-between text-[11px] text-on-surface-variant mt-1 font-mono">
                <span>+0 spm</span>
                <span>+10 spm</span>
                <span>+20 spm</span>
              </div>
            </div>

            <div className="p-space-xs rounded-lg bg-surface-container text-body-sm text-on-surface-variant flex items-start gap-2">
              <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">
                tips_and_updates
              </span>
              <span>
                <strong>Physiology Rule:</strong> A 5-10% step rate increase significantly decreases
                impact loading on knees and hip joints without elevating oxygen consumption.
              </span>
            </div>
          </div>

          {/* Results Grid */}
          <div className="lg:col-span-7 grid grid-cols-2 gap-space-sm">
            <div className="bg-surface-container-lowest p-space-md rounded-xl border border-surface-container shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-[12px] font-semibold uppercase tracking-wider text-on-surface-variant">
                  5K Total Time Saved
                </span>
                <div className="font-display-md text-display-md font-extrabold text-primary tracking-tight mt-1">
                  -{formatTime(simSavings.fiveK).slice(3)}
                </div>
              </div>
              <p className="text-[12px] text-on-surface-variant mt-2">
                Gain of {(secondsPerKmDrop * 5)} seconds over standard 5000m road courses.
              </p>
            </div>

            <div className="bg-surface-container-lowest p-space-md rounded-xl border border-surface-container shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-[12px] font-semibold uppercase tracking-wider text-on-surface-variant">
                  10K Total Time Saved
                </span>
                <div className="font-display-md text-display-md font-extrabold text-primary tracking-tight mt-1">
                  -{formatTime(simSavings.tenK).slice(3)}
                </div>
              </div>
              <p className="text-[12px] text-on-surface-variant mt-2">
                Equivalent to {((secondsPerKmDrop * 10) / 60).toFixed(1)} minutes faster over 10km.
              </p>
            </div>

            <div className="bg-surface-container-lowest p-space-md rounded-xl border border-surface-container shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-[12px] font-semibold uppercase tracking-wider text-on-surface-variant">
                  Half Marathon Saved
                </span>
                <div className="font-display-md text-display-md font-extrabold text-primary tracking-tight mt-1">
                  -{formatTime(simSavings.halfM)}
                </div>
              </div>
              <p className="text-[12px] text-on-surface-variant mt-2">
                Shaves {(simSavings.halfM / 60).toFixed(1)} mins over 21.0975km.
              </p>
            </div>

            <div className="bg-surface-container-lowest p-space-md rounded-xl border border-surface-container shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-[12px] font-semibold uppercase tracking-wider text-on-surface-variant">
                  Marathon Total Saved
                </span>
                <div className="font-display-md text-display-md font-extrabold text-primary tracking-tight mt-1">
                  -{formatTime(simSavings.fullM)}
                </div>
              </div>
              <p className="text-[12px] text-on-surface-variant mt-2">
                Crucial for breaking Boston Qualifying or Sub-3 / Sub-4 thresholds.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
