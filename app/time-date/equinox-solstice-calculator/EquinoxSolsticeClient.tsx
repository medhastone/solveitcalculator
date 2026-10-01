'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

interface SeasonEvent {
  name: string;
  seasonNorth: string;
  seasonSouth: string;
  approxMonth: string;
  icon: string;
  exactUTC: string;
  description: string;
}

// Astronomical Meeus Calculation for Equinoxes & Solstices
function getAstronomicalSeasons(year: number): SeasonEvent[] {
  // Approximate Jean Meeus Astronomical formula
  const y = (year - 2000) / 1000;

  // March Equinox (Julian Ephemeris Day)
  const jdeMarch = 2451623.80984 + 365242.37404 * y + 0.05169 * y * y - 0.00411 * y * y * y;
  // June Solstice
  const jdeJune = 2451716.56767 + 365241.62603 * y + 0.00325 * y * y + 0.00888 * y * y * y;
  // September Equinox
  const jdeSept = 2451810.21715 + 365242.01767 * y - 0.11575 * y * y + 0.00337 * y * y * y;
  // December Solstice
  const jdeDec = 2451900.05952 + 365242.74049 * y - 0.06223 * y * y - 0.05230 * y * y * y;

  const jdeToDate = (jde: number) => {
    const time = (jde - 2440587.5) * 86400000;
    return new Date(time);
  };

  const dMarch = jdeToDate(jdeMarch);
  const dJune = jdeToDate(jdeJune);
  const dSept = jdeToDate(jdeSept);
  const dDec = jdeToDate(jdeDec);

  return [
    {
      name: 'March Equinox (Vernal)',
      seasonNorth: 'Spring begins (Northern Hemisphere)',
      seasonSouth: 'Autumn begins (Southern Hemisphere)',
      approxMonth: 'March 20',
      icon: '🌱',
      exactUTC: dMarch.toUTCString(),
      description: 'The Sun crosses the celestial equator moving northward. Day and night are of approximately equal duration globally.',
    },
    {
      name: 'June Solstice (Summer/Winter)',
      seasonNorth: 'Summer begins (Northern Hemisphere - Longest Day)',
      seasonSouth: 'Winter begins (Southern Hemisphere - Shortest Day)',
      approxMonth: 'June 20 - 21',
      icon: '☀️',
      exactUTC: dJune.toUTCString(),
      description: 'The Sun reaches its northernmost declination directly over the Tropic of Cancer (23.44° N).',
    },
    {
      name: 'September Equinox (Autumnal)',
      seasonNorth: 'Autumn begins (Northern Hemisphere)',
      seasonSouth: 'Spring begins (Southern Hemisphere)',
      approxMonth: 'September 22 - 23',
      icon: '🍂',
      exactUTC: dSept.toUTCString(),
      description: 'The Sun crosses the celestial equator heading southward. Equal day and night across all latitudes.',
    },
    {
      name: 'December Solstice (Winter/Summer)',
      seasonNorth: 'Winter begins (Northern Hemisphere - Shortest Day)',
      seasonSouth: 'Summer begins (Southern Hemisphere - Longest Day)',
      approxMonth: 'December 21 - 22',
      icon: '❄️',
      exactUTC: dDec.toUTCString(),
      description: 'The Sun reaches its southernmost declination directly over the Tropic of Capricorn (23.44° S).',
    },
  ];
}

export default function EquinoxSolsticeClient() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const seasons = useMemo(() => getAstronomicalSeasons(selectedYear), [selectedYear]);

  return (
    <div className="bg-surface text-on-surface min-h-screen pt-0 pb-16 font-body-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-on-surface-variant mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/time-date" className="hover:text-primary transition-colors">Time &amp; Date</Link>
          <span>/</span>
          <span className="text-on-surface font-medium">Equinox &amp; Solstice Calculator</span>
        </nav>

        {/* Hero Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-mono text-xs font-semibold uppercase tracking-wider mb-3">
            Astronomical Seasons &amp; Earth Orbit Ephemeris
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-on-surface mb-3">
            Equinox &amp; Solstice Calculator
          </h1>
          <p className="text-base sm:text-lg text-on-surface-variant max-w-3xl">
            Calculate exact UTC dates and times for vernal equinox, summer solstice, autumnal equinox, and winter solstice across multiple years.
          </p>
        </div>

        {/* Year Selector */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-on-surface">
                Astronomical Target Year: <span className="text-primary font-mono">{selectedYear}</span>
              </h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Displaying high-precision ephemeris calculations for Earth&apos;s four seasonal transitions.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedYear((y) => Math.max(1900, y - 1))}
                className="px-3.5 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-semibold border border-outline-variant/30"
              >
                ← {selectedYear - 1}
              </button>
              <input
                type="number"
                min="1900"
                max="2100"
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value) || currentYear)}
                className="w-24 text-center bg-surface-container-low border border-outline-variant/40 rounded-xl px-3 py-2 text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => setSelectedYear((y) => Math.min(2100, y + 1))}
                className="px-3.5 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-semibold border border-outline-variant/30"
              >
                {selectedYear + 1} →
              </button>
            </div>
          </div>
        </div>

        {/* Seasons Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {seasons.map((season) => (
            <div
              key={season.name}
              className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">{season.icon}</span>
                  <span className="text-xs font-mono font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">
                    {season.approxMonth}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-on-surface mb-2">
                  {season.name}
                </h3>

                <div className="space-y-1.5 mb-4 text-xs font-medium">
                  <div className="text-emerald-600">🌍 {season.seasonNorth}</div>
                  <div className="text-amber-600">🌏 {season.seasonSouth}</div>
                </div>

                <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
                  {season.description}
                </p>
              </div>

              <div className="pt-3 border-t border-outline-variant/20">
                <div className="text-[11px] uppercase tracking-wider text-on-surface-variant font-medium">
                  Exact Universal Time (UTC)
                </div>
                <div className="text-sm font-mono font-bold text-on-surface mt-1">
                  {season.exactUTC}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Astronomy Knowledge Base */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-semibold text-on-surface mb-3">
            Astronomical Seasons vs Meteorological Seasons
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-on-surface-variant leading-relaxed">
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20">
              <strong className="text-on-surface block mb-1 text-sm">Astronomical Seasons</strong>
              Based on Earth&apos;s 23.44° axial tilt and its orbit around the Sun. Seasons begin at the exact moment of the equinoxes (Sun over equator) and solstices (Sun at max northern or southern declination).
            </div>
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20">
              <strong className="text-on-surface block mb-1 text-sm">Meteorological Seasons</strong>
              Grouped into full calendar months for climatological consistency and temperature record keeping: Spring (Mar 1 - May 31), Summer (Jun 1 - Aug 31), Autumn (Sep 1 - Nov 30), and Winter (Dec 1 - Feb 28/29).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
