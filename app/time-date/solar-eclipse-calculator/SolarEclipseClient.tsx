'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface EclipseEvent {
  id: string;
  date: string;
  isoDate: string;
  type: 'Total' | 'Annular' | 'Partial' | 'Hybrid';
  maxDurationTotality: string;
  pathOfTotality: string;
  primaryRegions: string[];
  magnitude: number;
}

const UPCOMING_ECLIPSES: EclipseEvent[] = [
  {
    id: '2026-aug-12',
    date: 'August 12, 2026',
    isoDate: '2026-08-12T17:47:06Z',
    type: 'Total',
    maxDurationTotality: '2m 18s',
    pathOfTotality: 'Greenland, Iceland, Spain (Northern & Eastern)',
    primaryRegions: ['North America (Partial)', 'Europe (Partial/Total)', 'Africa (Partial)'],
    magnitude: 1.039,
  },
  {
    id: '2027-aug-02',
    date: 'August 2, 2027',
    isoDate: '2027-08-02T10:07:50Z',
    type: 'Total',
    maxDurationTotality: '6m 23s (Great Eclipse of Egypt)',
    pathOfTotality: 'Spain, Morocco, Algeria, Tunisia, Libya, Egypt, Saudi Arabia, Yemen, Somalia',
    primaryRegions: ['Europe', 'Middle East', 'North Africa'],
    magnitude: 1.079,
  },
  {
    id: '2028-jul-22',
    date: 'July 22, 2028',
    isoDate: '2028-07-22T02:56:40Z',
    type: 'Total',
    maxDurationTotality: '5m 10s',
    pathOfTotality: 'Australia (Kimberley, Sydney Harbour), New Zealand (South Island)',
    primaryRegions: ['Australia', 'New Zealand', 'Southeast Asia'],
    magnitude: 1.056,
  },
  {
    id: '2030-nov-25',
    date: 'November 25, 2030',
    isoDate: '2030-11-25T06:51:37Z',
    type: 'Total',
    maxDurationTotality: '3m 44s',
    pathOfTotality: 'Namibia, Botswana, South Africa, Australia',
    primaryRegions: ['Southern Africa', 'Australia', 'Indian Ocean'],
    magnitude: 1.047,
  },
  {
    id: '2033-mar-30',
    date: 'March 30, 2033',
    isoDate: '2033-03-30T18:02:36Z',
    type: 'Total',
    maxDurationTotality: '2m 37s',
    pathOfTotality: 'Eastern Russia, Alaska (Utqiaġvik/Barrow, Nome, Kotzebue)',
    primaryRegions: ['Alaska', 'Arctic', 'Eastern Siberia'],
    magnitude: 1.046,
  },
];

export default function SolarEclipseClient() {
  const [selectedEclipse, setSelectedEclipse] = useState<EclipseEvent>(UPCOMING_ECLIPSES[0]);
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    const updateCountdown = () => {
      const targetTime = new Date(selectedEclipse.isoDate).getTime();
      const now = new Date().getTime();
      const diff = targetTime - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [selectedEclipse]);

  return (
    <div className="bg-surface text-on-surface min-h-screen pt-0 pb-16 font-body-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-on-surface-variant mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/time-date" className="hover:text-primary transition-colors">Time &amp; Date</Link>
          <span>/</span>
          <span className="text-on-surface font-medium">Solar Eclipse Countdown &amp; Path Planner</span>
        </nav>

        {/* Hero Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 font-mono text-xs font-semibold uppercase tracking-wider mb-3">
            Solar Eclipse Ephemeris &amp; Totality Countdown
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-on-surface mb-3">
            Solar Eclipse Countdown &amp; Path Planner
          </h1>
          <p className="text-base sm:text-lg text-on-surface-variant max-w-3xl">
            Countdown to upcoming total, annular, and partial solar eclipses. Explore eclipse dates, paths of totality, durations, and viewing locations.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Live Countdown & Active Details */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Live Hero Countdown Box */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-amber-950 text-white border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
                  {selectedEclipse.type} Eclipse Event
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Magnitude: {selectedEclipse.magnitude}
                </span>
              </div>

              <div className="text-2xl sm:text-3xl font-bold font-display text-white mb-2">
                {selectedEclipse.date}
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mb-6">
                Path of Totality: <strong className="text-amber-300">{selectedEclipse.pathOfTotality}</strong>
              </p>

              {/* Countdown Digits */}
              <div className="grid grid-cols-4 gap-2 sm:gap-4 mb-6">
                <div className="bg-white/10 rounded-xl p-3 sm:p-4 text-center border border-white/10 backdrop-blur-sm">
                  <div className="text-2xl sm:text-4xl font-extrabold font-mono text-amber-400">
                    {timeLeft?.days ?? '--'}
                  </div>
                  <div className="text-[10px] sm:text-xs text-slate-300 font-semibold uppercase tracking-wider mt-1">
                    Days
                  </div>
                </div>

                <div className="bg-white/10 rounded-xl p-3 sm:p-4 text-center border border-white/10 backdrop-blur-sm">
                  <div className="text-2xl sm:text-4xl font-extrabold font-mono text-white">
                    {timeLeft?.hours ?? '--'}
                  </div>
                  <div className="text-[10px] sm:text-xs text-slate-300 font-semibold uppercase tracking-wider mt-1">
                    Hours
                  </div>
                </div>

                <div className="bg-white/10 rounded-xl p-3 sm:p-4 text-center border border-white/10 backdrop-blur-sm">
                  <div className="text-2xl sm:text-4xl font-extrabold font-mono text-white">
                    {timeLeft?.minutes ?? '--'}
                  </div>
                  <div className="text-[10px] sm:text-xs text-slate-300 font-semibold uppercase tracking-wider mt-1">
                    Minutes
                  </div>
                </div>

                <div className="bg-white/10 rounded-xl p-3 sm:p-4 text-center border border-white/10 backdrop-blur-sm">
                  <div className="text-2xl sm:text-4xl font-extrabold font-mono text-amber-400">
                    {timeLeft?.seconds ?? '--'}
                  </div>
                  <div className="text-[10px] sm:text-xs text-slate-300 font-semibold uppercase tracking-wider mt-1">
                    Seconds
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-xs text-amber-200 flex items-center justify-between">
                <span>Maximum Totality Duration:</span>
                <span className="font-mono font-bold text-amber-300 text-sm">{selectedEclipse.maxDurationTotality}</span>
              </div>
            </div>

            {/* Observation Safety & Equipment Card */}
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-semibold text-on-surface mb-3 flex items-center gap-2">
                <span>🛡️</span> Eye Safety &amp; Filter Protocols
              </h3>
              <div className="space-y-3 text-xs text-on-surface-variant leading-relaxed">
                <p>
                  <strong>ISO 12312-2 Certified Filters:</strong> Direct solar viewing requires compliant solar eclipse glasses. Never look directly at the uneclipsed or partially eclipsed sun with naked eyes, standard sunglasses, or unfiltered optical viewfinders.
                </p>
                <p>
                  <strong>During 100% Totality Only:</strong> When the moon completely obscures the solar disc (totality), viewers in the path may briefly observe the solar corona with naked eyes until the diamond-ring flash reappears.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Next Major Eclipses Selection */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <h2 className="text-base font-semibold text-on-surface mb-1">
              Select Upcoming Major Eclipse
            </h2>

            <div className="space-y-3">
              {UPCOMING_ECLIPSES.map((eclipse) => (
                <button
                  key={eclipse.id}
                  type="button"
                  onClick={() => setSelectedEclipse(eclipse)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all ${
                    selectedEclipse.id === eclipse.id
                      ? 'bg-amber-500/10 border-amber-500/50 shadow-sm'
                      : 'bg-surface-container-lowest hover:bg-surface-container-low border-outline-variant/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-amber-700 uppercase tracking-wider font-mono">
                      {eclipse.type} Eclipse
                    </span>
                    <span className="text-xs font-mono font-semibold text-on-surface-variant">
                      {eclipse.maxDurationTotality}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-on-surface mb-1">
                    {eclipse.date}
                  </div>
                  <div className="text-xs text-on-surface-variant line-clamp-2">
                    {eclipse.pathOfTotality}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
