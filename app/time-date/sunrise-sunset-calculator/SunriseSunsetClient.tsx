'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

// Preset global cities
const PRESET_CITIES = [
  { name: 'New York, USA', lat: 40.7128, lng: -74.006, tz: -5, tzName: 'EST/EDT' },
  { name: 'London, UK', lat: 51.5074, lng: -0.1278, tz: 0, tzName: 'GMT/BST' },
  { name: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503, tz: 9, tzName: 'JST' },
  { name: 'Paris, France', lat: 48.8566, lng: 2.3522, tz: 1, tzName: 'CET/CEST' },
  { name: 'Sydney, Australia', lat: -33.8688, lng: 151.2093, tz: 10, tzName: 'AEST/AEDT' },
  { name: 'San Francisco, USA', lat: 37.7749, lng: -122.4194, tz: -8, tzName: 'PST/PDT' },
  { name: 'Dubai, UAE', lat: 25.2048, lng: 55.2708, tz: 4, tzName: 'GST' },
  { name: 'Singapore', lat: 1.3521, lng: 103.8198, tz: 8, tzName: 'SGT' },
];

export default function SunriseSunsetClient() {
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [latitude, setLatitude] = useState(40.7128);
  const [longitude, setLongitude] = useState(-74.006);
  const [cityName, setCityName] = useState('New York, USA');
  const [timeZoneOffset, setTimeZoneOffset] = useState(-5);

  const handleCitySelect = (city: (typeof PRESET_CITIES)[0]) => {
    setLatitude(city.lat);
    setLongitude(city.lng);
    setCityName(city.name);
    setTimeZoneOffset(city.tz);
  };

  // NOAA Solar Position & Solar Time Approximation Engine
  const solarData = useMemo(() => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    if (!y || !m || !d) return null;

    // Day of Year
    const startOfYear = new Date(Date.UTC(y, 0, 1));
    const targetDate = new Date(Date.UTC(y, m - 1, d));
    const dayOfYear = Math.floor((targetDate.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    // Fractional year in radians
    const gamma = ((2 * Math.PI) / 365) * (dayOfYear - 1);

    // Equation of time in minutes
    const eqtime =
      229.18 *
      (0.000075 +
        0.001868 * Math.cos(gamma) -
        0.032077 * Math.sin(gamma) -
        0.014615 * Math.cos(2 * gamma) -
        0.040849 * Math.sin(2 * gamma));

    // Solar declination angle in radians
    const decl =
      0.006918 -
      0.399912 * Math.cos(gamma) +
      0.070257 * Math.sin(gamma) -
      0.006758 * Math.cos(2 * gamma) +
      0.000907 * Math.sin(2 * gamma) -
      0.002697 * Math.cos(3 * gamma) +
      0.00148 * Math.sin(3 * gamma);

    const latRad = (latitude * Math.PI) / 180;

    const calcHourAngle = (zenithDegrees: number) => {
      const zenithRad = (zenithDegrees * Math.PI) / 180;
      const cosHA = (Math.cos(zenithRad) - Math.sin(latRad) * Math.sin(decl)) / (Math.cos(latRad) * Math.cos(decl));
      if (cosHA > 1) return null; // Polar night
      if (cosHA < -1) return null; // Midnight sun
      return Math.acos(cosHA);
    };

    // Official zenith is 90.833 degrees (accounting for atmospheric refraction and solar disc)
    const haOfficial = calcHourAngle(90.833);
    // Civil twilight: zenith 96 degrees
    const haCivil = calcHourAngle(96);
    // Nautical twilight: zenith 102 degrees
    const haNautical = calcHourAngle(102);
    // Astronomical twilight: zenith 108 degrees
    const haAstronomical = calcHourAngle(108);
    // Golden Hour: Sun is between 6° above horizon (zenith 84°) and 4° below horizon
    const haGoldenEvening = calcHourAngle(84);

    const formatMinutesToTime = (minutesFromMidnightUTC: number | null) => {
      if (minutesFromMidnightUTC === null) return 'N/A';
      // Local time offset
      let localMinutes = minutesFromMidnightUTC + timeZoneOffset * 60;
      while (localMinutes < 0) localMinutes += 1440;
      while (localMinutes >= 1440) localMinutes -= 1440;

      const hh = Math.floor(localMinutes / 60);
      const mm = Math.floor(localMinutes % 60);
      const ss = Math.floor((localMinutes * 60) % 60);
      const period = hh >= 12 ? 'PM' : 'AM';
      const dispH = hh % 12 === 0 ? 12 : hh % 12;

      return {
        time24: `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`,
        time12: `${dispH}:${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')} ${period}`,
        short12: `${dispH}:${String(mm).padStart(2, '0')} ${period}`,
        totalMinutes: localMinutes,
      };
    };

    // Solar noon in UTC minutes
    const solarNoonUTC = 720 - 4 * longitude - eqtime;

    let sunriseMins = null;
    let sunsetMins = null;
    let daylightMinutes = 0;

    if (haOfficial !== null) {
      const haDeg = (haOfficial * 180) / Math.PI;
      sunriseMins = 720 - 4 * (longitude + haDeg) - eqtime;
      sunsetMins = 720 - 4 * (longitude - haDeg) - eqtime;
      daylightMinutes = (haDeg * 8); // 4 minutes per degree * 2
    }

    // Civil Dawn/Dusk
    let civilDawnMins = null;
    let civilDuskMins = null;
    if (haCivil !== null) {
      const haDeg = (haCivil * 180) / Math.PI;
      civilDawnMins = 720 - 4 * (longitude + haDeg) - eqtime;
      civilDuskMins = 720 - 4 * (longitude - haDeg) - eqtime;
    }

    // Nautical Dawn/Dusk
    let nauticalDawnMins = null;
    let nauticalDuskMins = null;
    if (haNautical !== null) {
      const haDeg = (haNautical * 180) / Math.PI;
      nauticalDawnMins = 720 - 4 * (longitude + haDeg) - eqtime;
      nauticalDuskMins = 720 - 4 * (longitude - haDeg) - eqtime;
    }

    // Golden hour start (evening)
    let goldenHourEveStart = null;
    if (haGoldenEvening !== null) {
      const haDeg = (haGoldenEvening * 180) / Math.PI;
      goldenHourEveStart = 720 - 4 * (longitude - haDeg) - eqtime;
    }

    const daylightHours = Math.floor(daylightMinutes / 60);
    const daylightMinsRem = Math.floor(daylightMinutes % 60);

    return {
      dayOfYear,
      solarNoon: formatMinutesToTime(solarNoonUTC),
      sunrise: formatMinutesToTime(sunriseMins),
      sunset: formatMinutesToTime(sunsetMins),
      civilDawn: formatMinutesToTime(civilDawnMins),
      civilDusk: formatMinutesToTime(civilDuskMins),
      nauticalDawn: formatMinutesToTime(nauticalDawnMins),
      nauticalDusk: formatMinutesToTime(nauticalDuskMins),
      goldenHourEveningStart: formatMinutesToTime(goldenHourEveStart),
      daylightHours,
      daylightMinsRem,
      daylightMinutes,
      isPolarPhenomenon: haOfficial === null,
    };
  }, [selectedDate, latitude, longitude, timeZoneOffset]);

  const getShortTime = (val: any, fallback = 'N/A') => {
    if (val && typeof val === 'object' && 'short12' in val) {
      return (val as { short12: string }).short12;
    }
    return fallback;
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen pt-0 pb-16 font-body-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-on-surface-variant mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/time-date" className="hover:text-primary transition-colors">Time &amp; Date</Link>
          <span>/</span>
          <span className="text-on-surface font-medium">Sunrise, Sunset &amp; Golden Hour Calculator</span>
        </nav>

        {/* Hero Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 font-mono text-xs font-semibold uppercase tracking-wider mb-3">
            Astronomical &amp; Solar Ephemeris
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-on-surface mb-3">
            Sunrise, Sunset &amp; Golden Hour Calculator
          </h1>
          <p className="text-base sm:text-lg text-on-surface-variant max-w-3xl">
            Calculate sunrise, sunset, dawn, dusk, and golden hour times for any location and date. View day length, solar noon, and twilight phases.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Column */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            {/* Quick City Presets */}
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-sm">
              <h2 className="text-base font-semibold text-on-surface mb-3">
                Select Major City or Custom Coordinates
              </h2>
              <div className="flex flex-wrap gap-2 mb-5">
                {PRESET_CITIES.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => handleCitySelect(c)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      cityName === c.name
                        ? 'bg-amber-600 text-white font-semibold shadow-sm'
                        : 'bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant/30'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-on-surface-variant mb-1.5">
                    Target Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-on-surface font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-on-surface-variant mb-1.5">
                    UTC Timezone Offset
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="-12"
                    max="14"
                    value={timeZoneOffset}
                    onChange={(e) => setTimeZoneOffset(parseFloat(e.target.value) || 0)}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-on-surface font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-on-surface-variant mb-1.5">
                    Latitude (° N/S)
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    min="-90"
                    max="90"
                    value={latitude}
                    onChange={(e) => {
                      setLatitude(parseFloat(e.target.value) || 0);
                      setCityName('Custom Coordinates');
                    }}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-on-surface font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-on-surface-variant mb-1.5">
                    Longitude (° E/W)
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    min="-180"
                    max="180"
                    value={longitude}
                    onChange={(e) => {
                      setLongitude(parseFloat(e.target.value) || 0);
                      setCityName('Custom Coordinates');
                    }}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-on-surface font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Photography Golden Hour Card */}
            <div className="bg-surface-container-lowest border border-amber-500/20 rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-semibold text-on-surface flex items-center gap-2 mb-3">
                <span className="text-amber-500">📷</span> Golden &amp; Blue Hour Guide
              </h3>
              <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
                Golden hour provides soft, warm, diffuse lighting ideal for landscape and portrait photography.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
                  <div className="text-[11px] text-amber-700 font-medium uppercase tracking-wider">
                    Evening Golden Hour
                  </div>
                  <div className="text-lg font-bold font-mono text-amber-600 mt-1">
                    {solarData?.goldenHourEveningStart !== 'N/A' && solarData?.sunset !== 'N/A'
                      ? `${getShortTime(solarData?.goldenHourEveningStart)} - ${getShortTime(solarData?.sunset)}`
                      : 'N/A'}
                  </div>
                  <span className="text-[10px] text-amber-700/80 mt-0.5 block">Warm directional light</span>
                </div>

                <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30">
                  <div className="text-[11px] text-indigo-700 font-medium uppercase tracking-wider">
                    Dusk Blue Hour
                  </div>
                  <div className="text-lg font-bold font-mono text-indigo-600 mt-1">
                    {solarData?.sunset !== 'N/A' && solarData?.civilDusk !== 'N/A'
                      ? `${getShortTime(solarData?.sunset)} - ${getShortTime(solarData?.civilDusk)}`
                      : 'N/A'}
                  </div>
                  <span className="text-[10px] text-indigo-700/80 mt-0.5 block">Deep blue sky gradient</span>
                </div>
              </div>
            </div>
          </div>

          {/* Results Display */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            {/* Primary Sunrise / Sunset Display */}
            <div className="bg-gradient-to-br from-amber-500/15 via-surface-container-lowest to-surface-container-lowest border border-amber-500/30 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 font-mono">
                  {cityName} Solar Times
                </span>
                <span className="text-xs font-mono text-on-surface-variant">
                  Day #{solarData?.dayOfYear} of 365
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="p-4 rounded-xl bg-surface-container-lowest/80 border border-amber-500/30">
                  <div className="text-xs font-medium text-amber-700 uppercase tracking-wider flex items-center gap-1">
                    <span>🌅</span> Sunrise
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-on-surface mt-1">
                    {getShortTime(solarData?.sunrise, 'Polar Night')}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-surface-container-lowest/80 border border-amber-500/30">
                  <div className="text-xs font-medium text-amber-700 uppercase tracking-wider flex items-center gap-1">
                    <span>🌇</span> Sunset
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-on-surface mt-1">
                    {getShortTime(solarData?.sunset, 'Polar Night')}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-on-surface-variant pt-1 border-t border-amber-500/20">
                <span>Total Daylight: <strong className="text-on-surface">{solarData?.daylightHours}h {solarData?.daylightMinsRem}m</strong></span>
                <span>Solar Noon: <strong className="text-on-surface">{getShortTime(solarData?.solarNoon)}</strong></span>
              </div>
            </div>

            {/* Twilight Phases Detailed Breakdown */}
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
              <h2 className="text-base font-semibold text-on-surface mb-2">
                Twilight &amp; Horizon Phases
              </h2>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
                  <div>
                    <div className="text-xs font-medium text-on-surface">Civil Dawn (Sun 6° below horizon)</div>
                    <div className="text-[11px] text-on-surface-variant">Adequate natural light for outdoor activities</div>
                  </div>
                  <span className="text-sm font-bold font-mono text-on-surface">
                    {getShortTime(solarData?.civilDawn)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
                  <div>
                    <div className="text-xs font-medium text-on-surface">Civil Dusk (Sun 6° below horizon)</div>
                    <div className="text-[11px] text-on-surface-variant">Artificial street lighting becomes required</div>
                  </div>
                  <span className="text-sm font-bold font-mono text-on-surface">
                    {getShortTime(solarData?.civilDusk)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
                  <div>
                    <div className="text-xs font-medium text-on-surface">Nautical Dawn (Sun 12° below horizon)</div>
                    <div className="text-[11px] text-on-surface-variant">General sea horizon visible to navigators</div>
                  </div>
                  <span className="text-sm font-bold font-mono text-on-surface">
                    {getShortTime(solarData?.nauticalDawn)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
                  <div>
                    <div className="text-xs font-medium text-on-surface">Nautical Dusk (Sun 12° below horizon)</div>
                    <div className="text-[11px] text-on-surface-variant">Horizon darkens, primary navigational stars shine</div>
                  </div>
                  <span className="text-sm font-bold font-mono text-on-surface">
                    {getShortTime(solarData?.nauticalDusk)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
