import React from 'react';

export default function StrategyVisualSection() {
  return (
    <section className="w-full py-space-lg bg-surface border-t border-surface-container">
      <div className="max-w-[1280px] mx-auto px-gutter-mobile lg:px-gutter-desktop">
        <div className="mb-space-md">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">insights</span>
            <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
              Split Strategy &amp; Pacing Velocity Profiles
            </h2>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Understanding the biomechanical and physiological impact of pace distribution across
            endurance races.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
          {/* Even Pacing */}
          <div className="bg-surface-container-lowest rounded-xl border border-surface-container p-space-md shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-primary/10 text-primary">
                  Metabolically Optimal
                </span>
                <span className="material-symbols-outlined text-primary text-[20px]">horizontal_rule</span>
              </div>
              <h3 className="font-title-md text-title-md font-bold text-on-surface mb-2">
                Even Pacing Strategy
              </h3>
              <p className="text-body-sm text-on-surface-variant leading-relaxed">
                Minimizes glycogen depletion rate by keeping metabolic power constant. Prevents spikes
                in blood lactate and allows near-linear oxygen uptake throughout the entire course.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-surface-container">
              <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider block mb-1">
                Ideal For:
              </span>
              <span className="text-body-sm text-on-surface font-medium">
                Flat courses, track trials, and 10K to Half Marathon events.
              </span>
            </div>
          </div>

          {/* Negative Split */}
          <div className="bg-surface-container-lowest rounded-xl border border-surface-container p-space-md shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-secondary/10 text-secondary">
                  World Record Standard
                </span>
                <span className="material-symbols-outlined text-secondary text-[20px]">trending_up</span>
              </div>
              <h3 className="font-title-md text-title-md font-bold text-on-surface mb-2">
                Negative Split Strategy
              </h3>
              <p className="text-body-sm text-on-surface-variant leading-relaxed">
                Running the second half 1-3% faster than the first. Conserves muscle glycogen during
                early stages when adrenaline is elevated, ensuring muscular power in final kilometers.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-surface-container">
              <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider block mb-1">
                Ideal For:
              </span>
              <span className="text-body-sm text-on-surface font-medium">
                Full Marathons, congested start lines, and breaking personal records.
              </span>
            </div>
          </div>

          {/* Positive Split */}
          <div className="bg-surface-container-lowest rounded-xl border border-surface-container p-space-md shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800">
                  High Risk / Tactical
                </span>
                <span className="material-symbols-outlined text-amber-600 text-[20px]">trending_down</span>
              </div>
              <h3 className="font-title-md text-title-md font-bold text-on-surface mb-2">
                Positive Split Strategy
              </h3>
              <p className="text-body-sm text-on-surface-variant leading-relaxed">
                Starting aggressively ahead of target pace and decelerating as muscular fatigue sets in.
                Higher cardiovascular strain and greater risk of hitting the physiological wall.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-surface-container">
              <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider block mb-1">
                Ideal For:
              </span>
              <span className="text-body-sm text-on-surface font-medium">
                Short 800m-1500m events or courses with early tailwinds/downhills.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
