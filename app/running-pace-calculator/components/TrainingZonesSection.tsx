import React, { useMemo } from 'react';
import { calculateVDOT, getDanielsTrainingZones } from '../utils';

interface TrainingZonesSectionProps {
  distanceKm: number;
  totalSeconds: number;
  paceSecPerKm: number;
}

export default function TrainingZonesSection({
  distanceKm,
  totalSeconds,
}: TrainingZonesSectionProps) {
  // Scientific VDOT calculation based on Jack Daniels & Jimmy Gilbert (1979)
  const vdot = useMemo(() => {
    return calculateVDOT(distanceKm, totalSeconds);
  }, [distanceKm, totalSeconds]);

  // Derived Jack Daniels training zones calculated directly from inverted oxygen-cost quadratic equations
  const zones = useMemo(() => {
    return getDanielsTrainingZones(vdot);
  }, [vdot]);

  return (
    <section id="trainingZonesGrid" className="w-full py-space-lg bg-surface border-t border-surface-container">
      <div className="max-w-[1280px] mx-auto px-gutter-mobile lg:px-gutter-desktop">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-space-sm mb-space-md">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[24px]">vital_signs</span>
              <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
                Personalized Training Zones (Pace Guide)
              </h2>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              Target paces for your daily easy runs, endurance workouts, and speed intervals based on your fitness.
            </p>
          </div>

          <div className="flex items-center gap-3 px-3.5 py-2 rounded-lg bg-primary/10 text-primary border border-primary/20 dark:bg-primary/20 dark:text-primary-fixed dark:border-primary/40">
            <span className="text-body-sm font-medium text-on-surface-variant dark:text-primary-fixed-dim">Fitness Score:</span>
            <span className="font-mono text-title-md font-extrabold text-primary dark:text-on-primary-fixed">{vdot.toFixed(1)}</span>
          </div>
        </div>

        {/* Zones Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-space-sm">
          {zones.map((z, idx) => (
            <div
              key={idx}
              className={`rounded-xl border p-space-sm shadow-xs flex flex-col justify-between transition-all backdrop-blur-xs ${z.color}`}
            >
              <div>
                <div className="flex items-center justify-between mb-2 gap-1.5">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${z.badgeColor}`}>
                    {z.code}
                  </span>
                  <span className="text-[11px] font-medium opacity-85">{z.pctHr}</span>
                </div>
                <h3 className="font-title-sm text-title-sm font-bold mb-0.5 tracking-tight">
                  {z.name}
                </h3>
                <div className="text-[11px] font-medium opacity-80 mb-2.5">{z.pctVdot}</div>
                <div className="font-mono text-title-sm font-bold tracking-tight mb-0.5">
                  {z.paceRangeKm}
                </div>
                <div className="font-mono text-[12px] opacity-85 mb-3">
                  {z.paceRangeMile}
                </div>
              </div>
              <p className="text-[12px] opacity-90 leading-relaxed border-t border-current/15 pt-2">
                {z.purpose}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
