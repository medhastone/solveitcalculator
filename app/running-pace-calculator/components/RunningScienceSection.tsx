import React from 'react';

export default function RunningScienceSection() {
  return (
    <section className="w-full py-space-lg bg-surface border-t border-surface-container">
      <div className="max-w-[1280px] mx-auto px-gutter-mobile lg:px-gutter-desktop">
        <div className="mb-space-md">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">menu_book</span>
            <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
              Exercise Physiology &amp; Pacing Mathematical Science
            </h2>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            In-depth metrological formulas, metabolic energetics, and scientific research citations.
          </p>
        </div>

        {/* 4 Core Physiological Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md mb-space-lg">
          {/* Box 1: Core Mathematical Formulas */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl border border-surface-container shadow-xs">
            <h3 className="font-title-md text-title-md font-bold text-on-surface mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">functions</span>
              Fundamental Mathematical Formulas
            </h3>
            <p className="text-body-sm text-on-surface-variant leading-relaxed mb-3">
              Running pace is the inverse velocity expressed as elapsed duration per unit of linear distance.
              Unlike cycling or automotive calculations that rely on speed (distance ÷ time), runners rely on
              exact pace to calculate split targets and prevent premature glycogen depletion:
            </p>
            <div className="bg-surface-container p-3 rounded-lg font-mono text-body-sm text-on-surface space-y-1.5 mb-3">
              <div>Pace (sec/km) = Total Time (seconds) ÷ Distance (km)</div>
              <div>Pace (/mile) = Pace (sec/km) × 1.609344</div>
              <div>Velocity (km/h) = 3600 ÷ Pace (sec/km)</div>
              <div>Velocity (mph) = Velocity (km/h) ÷ 1.609344</div>
            </div>
            <p className="text-body-sm text-on-surface-variant leading-relaxed">
              When targeting a specific finish time, the required pace is obtained by dividing total
              elapsed seconds by exact course distance measured along the shortest possible tangent (the
              USATF / World Athletics SPR calibration rule).
            </p>
          </div>

          {/* Box 2: Riegel's Endurance Formula */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl border border-surface-container shadow-xs">
            <h3 className="font-title-md text-title-md font-bold text-on-surface mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">biotech</span>
              Riegel's Endurance Prediction Model
            </h3>
            <p className="text-body-sm text-on-surface-variant leading-relaxed mb-3">
              Formulated by research engineer Peter Riegel in 1977 and published across peer-reviewed athletic literature,
              this power-law model predicts performance at target distances based on an established baseline race result:
            </p>
            <div className="bg-surface-container p-3 rounded-lg font-mono text-body-sm text-on-surface mb-3">
              T₂ = T₁ × (D₂ ÷ D₁)^1.06
            </div>
            <p className="text-body-sm text-on-surface-variant leading-relaxed">
              Where <strong>T₁</strong> is known race time, <strong>D₁</strong> is known distance,{' '}
              <strong>D₂</strong> is target distance, and <strong>1.06</strong> is the universal fatigue
              exponent for well-conditioned endurance runners. Untrained athletes with lower aerobic base
              development typically exhibit higher fatigue exponents between 1.08 and 1.12.
            </p>
          </div>

          {/* Box 3: Jack Daniels VDOT Model */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl border border-surface-container shadow-xs">
            <h3 className="font-title-md text-title-md font-bold text-on-surface mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">fitness_center</span>
              Jack Daniels' VDOT &amp; Metabolic Adaptations
            </h3>
            <p className="text-body-sm text-on-surface-variant leading-relaxed mb-3">
              Exercise physiologist Dr. Jack Daniels developed the <strong>VDOT</strong> metric (Oxygen
              Consumption per unit time normalized to running economy). Instead of requiring an invasive
              laboratory treadmill mask, VDOT calculates pseudo-VO2max directly from race performances:
            </p>
            <ul className="text-body-sm text-on-surface-variant list-disc pl-5 space-y-1.5 leading-relaxed">
              <li>
                <strong>Easy / Aerobic (62%–74% VDOT):</strong> Builds mitochondrial enzyme density and capillary beds
                without musculoskeletal stress.
              </li>
              <li>
                <strong>Threshold / Tempo (86%–88% VDOT):</strong> Trains cellular lactate shuttling, delaying the onset of
                blood lactate accumulation (OBLA).
              </li>
              <li>
                <strong>VO2 Max Intervals (95%–100% VDOT):</strong> Expands maximum stroke volume, cardiac output, and
                aerobic engine through 3–5 minute intervals.
              </li>
            </ul>
          </div>

          {/* Box 4: Environmental & Elevation Physics */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl border border-surface-container shadow-xs">
            <h3 className="font-title-md text-title-md font-bold text-on-surface mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">terrain</span>
              Elevation, Terrain &amp; Caloric Expenditure
            </h3>
            <p className="text-body-sm text-on-surface-variant leading-relaxed mb-3">
              Road courses rarely match flat indoor environments. Energetic calibrations based on ACSM and Margaria et al.
              research incorporate real-world variables:
            </p>
            <ul className="text-body-sm text-on-surface-variant list-disc pl-5 space-y-1.5 leading-relaxed">
              <li>
                <strong>Energy Cost of Flat Running:</strong> Approximately 1.036 gross kcal per kg of body mass per
                kilometer traversed.
              </li>
              <li>
                <strong>Elevation Incline Cost:</strong> Adds approximately +0.9 kcal per kg per 100 meters of vertical
                gain, translating to a 12–15s/km effort penalty per 1% grade.
              </li>
              <li>
                <strong>Surface Deformation:</strong> Soft surfaces like gravel or technical dirt trails require 6% to 10%
                more metabolic energy than synthetic rubber tracks or paved asphalt.
              </li>
            </ul>
          </div>
        </div>

        {/* Dedicated Trusted Scientific Sources Section (Exactly 3 Trusted Links) */}
        <div className="bg-surface-container-lowest rounded-xl border border-primary/20 p-space-md shadow-xs">
          <div className="flex items-center gap-2 pb-space-xs border-b border-surface-container mb-space-sm">
            <span className="material-symbols-outlined text-primary text-[22px]">verified</span>
            <h3 className="font-title-md text-title-md font-bold text-on-surface">
              Trusted Scientific Sources &amp; Verification References
            </h3>
          </div>
          <p className="text-body-sm text-on-surface-variant mb-space-md leading-relaxed">
            The mathematical and physiological equations in this calculator are strictly derived from peer-reviewed sports science,
            standardized governing body measurement rules, and empirical exercise physiology models:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-sm">
            {/* Trusted Link 1: Jack Daniels VDOT */}
            <a
              href="https://vdoto2.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-space-sm rounded-lg border border-surface-container bg-surface-container-low hover:bg-surface-container hover:border-primary/40 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                    Physiology Model
                  </span>
                  <span className="material-symbols-outlined text-primary text-[18px] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                    open_in_new
                  </span>
                </div>
                <h4 className="font-title-sm font-semibold text-on-surface group-hover:text-primary transition-colors mb-1">
                  Jack Daniels VDOT Running Formula
                </h4>
                <p className="text-[12px] text-on-surface-variant leading-relaxed">
                  Dr. Jack Daniels' validated oxygen consumption and training zone equations (*Daniels' Running Formula*).
                </p>
              </div>
              <span className="text-[11px] font-mono text-primary font-medium mt-3 block">
                vdoto2.com →
              </span>
            </a>

            {/* Trusted Link 2: Peter Riegel Formula on Runner's World */}
            <a
              href="https://www.runnersworld.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-space-sm rounded-lg border border-surface-container bg-surface-container-low hover:bg-surface-container hover:border-primary/40 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                    Fatigue Model
                  </span>
                  <span className="material-symbols-outlined text-primary text-[18px] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                    open_in_new
                  </span>
                </div>
                <h4 className="font-title-sm font-semibold text-on-surface group-hover:text-primary transition-colors mb-1">
                  Peter Riegel Endurance Formula
                </h4>
                <p className="text-[12px] text-on-surface-variant leading-relaxed">
                  Published by Peter Riegel and standardized by *Runner's World* for race distance predictions ($T_2 = T_1 \times (D_2/D_1)^{1.06}$).
                </p>
              </div>
              <span className="text-[11px] font-mono text-primary font-medium mt-3 block">
                runnersworld.com →
              </span>
            </a>

            {/* Trusted Link 3: USATF Road Race Standards */}
            <a
              href="https://www.usatf.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-space-sm rounded-lg border border-surface-container bg-surface-container-low hover:bg-surface-container hover:border-primary/40 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                    Distance Standards
                  </span>
                  <span className="material-symbols-outlined text-primary text-[18px] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                    open_in_new
                  </span>
                </div>
                <h4 className="font-title-sm font-semibold text-on-surface group-hover:text-primary transition-colors mb-1">
                  USA Track &amp; Field (USATF) Standards
                </h4>
                <p className="text-[12px] text-on-surface-variant leading-relaxed">
                  Official road course calibration guidelines, calibrated bicycle method, and Shortest Possible Route (SPR) tangent standards.
                </p>
              </div>
              <span className="text-[11px] font-mono text-primary font-medium mt-3 block">
                usatf.org →
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
