'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

export default function MoonPhaseClient() {
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);

  // High precision Moon Phase & Illumination computation
  const moonInfo = useMemo(() => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    if (!y || !m || !d) return null;

    const date = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));

    // Julian Date
    const time = date.getTime();
    const julianDate = time / 86400000 + 2440587.5;

    // Days since known new moon on Jan 6, 2000, 18:14 UTC (JD 2451549.26)
    const synodicMonth = 29.53058867;
    const daysSinceNew = julianDate - 2451549.26;
    const newMoons = daysSinceNew / synodicMonth;
    const currentPhaseFraction = newMoons - Math.floor(newMoons);
    const ageInDays = currentPhaseFraction * synodicMonth;

    // Illumination fraction (1 - cos(phase_angle))/2
    const phaseAngle = currentPhaseFraction * 2 * Math.PI;
    const illuminationPct = Math.round(((1 - Math.cos(phaseAngle)) / 2) * 100);

    // Phase identification
    let phaseName = 'New Moon';
    let phaseIcon = '🌑';
    let phaseDescription = 'The moon is situated between the Earth and Sun, with its illuminated side facing away from Earth.';

    if (ageInDays < 1.84) {
      phaseName = 'New Moon';
      phaseIcon = '🌑';
      phaseDescription = 'The moon is directly between the Earth and Sun with 0% illumination visible.';
    } else if (ageInDays < 5.53) {
      phaseName = 'Waxing Crescent';
      phaseIcon = '🌒';
      phaseDescription = 'A sliver of the moon becomes visible in the western evening sky as illumination increases.';
    } else if (ageInDays < 9.22) {
      phaseName = 'First Quarter';
      phaseIcon = '🌓';
      phaseDescription = 'Half of the lunar disc is illuminated, rising around noon and setting around midnight.';
    } else if (ageInDays < 12.91) {
      phaseName = 'Waxing Gibbous';
      phaseIcon = '🌔';
      phaseDescription = 'More than half of the moon is lit as it approaches full illumination.';
    } else if (ageInDays < 16.61) {
      phaseName = 'Full Moon';
      phaseIcon = '🌕';
      phaseDescription = 'The entire face of the moon is fully illuminated by direct sunlight.';
    } else if (ageInDays < 20.30) {
      phaseName = 'Waning Gibbous';
      phaseIcon = '🌖';
      phaseDescription = 'The illuminated area gradually decreases after the peak full moon phase.';
    } else if (ageInDays < 23.99) {
      phaseName = 'Last Quarter';
      phaseIcon = '🌗';
      phaseDescription = 'Half of the moon is illuminated on the opposite side, visible during early morning hours.';
    } else if (ageInDays < 27.68) {
      phaseName = 'Waning Crescent';
      phaseIcon = '🌘';
      phaseDescription = 'A slender sliver visible before dawn as the cycle nears completion.';
    } else {
      phaseName = 'New Moon';
      phaseIcon = '🌑';
      phaseDescription = 'Completing the 29.53-day synodic cycle.';
    }

    // Days to key upcoming events
    const daysToNextFull = ageInDays <= 14.765 ? 14.765 - ageInDays : synodicMonth - ageInDays + 14.765;
    const daysToNextNew = synodicMonth - ageInDays;

    const nextFullDate = new Date(date.getTime() + daysToNextFull * 86400000);
    const nextNewDate = new Date(date.getTime() + daysToNextNew * 86400000);

    return {
      ageInDays: ageInDays.toFixed(1),
      illuminationPct,
      phaseName,
      phaseIcon,
      phaseDescription,
      daysToNextFull: Math.round(daysToNextFull),
      daysToNextNew: Math.round(daysToNextNew),
      nextFullDateStr: nextFullDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
      nextNewDateStr: nextNewDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
      julianDate: julianDate.toFixed(2),
    };
  }, [selectedDate]);

  return (
    <div className="bg-surface text-on-surface min-h-screen pt-0 pb-16 font-body-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-on-surface-variant mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/time-date" className="hover:text-primary transition-colors">Time &amp; Date</Link>
          <span>/</span>
          <span className="text-on-surface font-medium">Moon Phase &amp; Lunar Calendar Calculator</span>
        </nav>

        {/* Hero Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 font-mono text-xs font-semibold uppercase tracking-wider mb-3">
            Lunar Astronomy &amp; Synodic Metrology
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-on-surface mb-3">
            Moon Phase &amp; Lunar Calendar Calculator
          </h1>
          <p className="text-base sm:text-lg text-on-surface-variant max-w-3xl">
            Calculate current moon phase, illumination percentage, lunar age, and upcoming full/new moon dates with high astronomical precision.
          </p>
        </div>

        {/* Interactive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Date Selector & Quick Navigation */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-sm">
              <h2 className="text-base font-semibold text-on-surface mb-4">
                Select Date for Lunar Ephemeris
              </h2>

              <div className="mb-4">
                <label className="block text-xs font-medium uppercase tracking-wider text-on-surface-variant mb-1.5">
                  Calendar Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-on-surface font-mono"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                  className="flex-1 py-2 px-3 bg-surface-container hover:bg-surface-container-high rounded-lg text-xs font-semibold border border-outline-variant/30 transition-colors"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const d = new Date(selectedDate);
                    d.setDate(d.getDate() - 1);
                    setSelectedDate(d.toISOString().split('T')[0]);
                  }}
                  className="py-2 px-3 bg-surface-container hover:bg-surface-container-high rounded-lg text-xs font-semibold border border-outline-variant/30 transition-colors"
                >
                  ← Day Before
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const d = new Date(selectedDate);
                    d.setDate(d.getDate() + 1);
                    setSelectedDate(d.toISOString().split('T')[0]);
                  }}
                  className="py-2 px-3 bg-surface-container hover:bg-surface-container-high rounded-lg text-xs font-semibold border border-outline-variant/30 transition-colors"
                >
                  Day After →
                </button>
              </div>
            </div>

            {/* Upcoming Milestones Card */}
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
              <h3 className="text-base font-semibold text-on-surface mb-1">
                Upcoming Primary Lunar Events
              </h3>

              <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-on-surface">Next Full Moon 🌕</div>
                  <div className="text-[11px] text-on-surface-variant font-mono mt-0.5">
                    {moonInfo?.nextFullDateStr} ({moonInfo?.daysToNextFull} days)
                  </div>
                </div>
                <span className="text-xs font-mono font-bold bg-amber-500/10 text-amber-700 px-2.5 py-1 rounded-full">
                  100% Light
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-on-surface">Next New Moon 🌑</div>
                  <div className="text-[11px] text-on-surface-variant font-mono mt-0.5">
                    {moonInfo?.nextNewDateStr} ({moonInfo?.daysToNextNew} days)
                  </div>
                </div>
                <span className="text-xs font-mono font-bold bg-surface-container-high text-on-surface-variant px-2.5 py-1 rounded-full">
                  0% Light
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Moon Visual & Astronomical Properties */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Visual Phase Display */}
            <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white border border-indigo-500/30 rounded-2xl p-6 shadow-lg">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                {/* Visual Moon Orb */}
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-slate-800 border-2 border-indigo-400/40 flex items-center justify-center text-6xl sm:text-7xl shadow-inner shrink-0">
                  {moonInfo?.phaseIcon}
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 font-mono block mb-1">
                    Current Synodic Phase
                  </span>
                  <div className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white mb-1.5">
                    {moonInfo?.phaseName}
                  </div>
                  <div className="text-xs text-slate-300 leading-relaxed mb-4">
                    {moonInfo?.phaseDescription}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center sm:text-left">
                      <div className="text-[11px] text-slate-400">Illumination</div>
                      <div className="text-xl font-bold font-mono text-indigo-300 mt-0.5">
                        {moonInfo?.illuminationPct}%
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center sm:text-left">
                      <div className="text-[11px] text-slate-400">Moon Age</div>
                      <div className="text-xl font-bold font-mono text-indigo-300 mt-0.5">
                        {moonInfo?.ageInDays} days
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Astronomical Constants & Ephemeris Table */}
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-semibold text-on-surface mb-3">
                Astronomical Constants &amp; Orbit Parameters
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/20 flex justify-between items-center">
                  <span className="text-on-surface-variant">Synodic Period</span>
                  <span className="font-mono font-semibold text-on-surface">29.53059 Days</span>
                </div>
                <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/20 flex justify-between items-center">
                  <span className="text-on-surface-variant">Sidereal Period</span>
                  <span className="font-mono font-semibold text-on-surface">27.32166 Days</span>
                </div>
                <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/20 flex justify-between items-center">
                  <span className="text-on-surface-variant">Julian Date (JD)</span>
                  <span className="font-mono font-semibold text-on-surface">{moonInfo?.julianDate}</span>
                </div>
                <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/20 flex justify-between items-center">
                  <span className="text-on-surface-variant">Average Distance</span>
                  <span className="font-mono font-semibold text-on-surface">384,400 km</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
