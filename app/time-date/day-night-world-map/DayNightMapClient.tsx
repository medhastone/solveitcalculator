'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';

interface CityPin {
  name: string;
  lat: number;
  lng: number;
  country: string;
}

const GLOBAL_CITIES: CityPin[] = [
  { name: 'London', lat: 51.5, lng: -0.1, country: 'UK' },
  { name: 'New York', lat: 40.7, lng: -74.0, country: 'USA' },
  { name: 'Tokyo', lat: 35.7, lng: 139.7, country: 'Japan' },
  { name: 'Sydney', lat: -33.9, lng: 151.2, country: 'Australia' },
  { name: 'Cairo', lat: 30.0, lng: 31.2, country: 'Egypt' },
  { name: 'São Paulo', lat: -23.5, lng: -46.6, country: 'Brazil' },
  { name: 'San Francisco', lat: 37.8, lng: -122.4, country: 'USA' },
  { name: 'Dubai', lat: 25.2, lng: 55.3, country: 'UAE' },
  { name: 'Singapore', lat: 1.3, lng: 103.8, country: 'Singapore' },
  { name: 'Reykjavik', lat: 64.1, lng: -21.9, country: 'Iceland' },
];

export default function DayNightMapClient() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentDate, setCurrentDate] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute subsolar point (latitude and longitude of Sun zenith)
  const solarPosition = useMemo(() => {
    const now = currentDate;
    const startOfYear = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
    const dayOfYear = Math.floor((now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const gamma = ((2 * Math.PI) / 365) * (dayOfYear - 1);

    // Equation of time (minutes)
    const eqtime =
      229.18 *
      (0.000075 +
        0.001868 * Math.cos(gamma) -
        0.032077 * Math.sin(gamma) -
        0.014615 * Math.cos(2 * gamma) -
        0.040849 * Math.sin(2 * gamma));

    // Solar declination (degrees)
    const declRad =
      0.006918 -
      0.399912 * Math.cos(gamma) +
      0.070257 * Math.sin(gamma) -
      0.006758 * Math.cos(2 * gamma) +
      0.000907 * Math.sin(2 * gamma) -
      0.002697 * Math.cos(3 * gamma) +
      0.00148 * Math.sin(3 * gamma);

    const subsolarLat = (declRad * 180) / Math.PI;

    // Subsolar longitude (Greenwich Hour Angle)
    const utcHours = now.getUTCHours() + now.getUTCMinutes() / 60 + now.getUTCSeconds() / 3600;
    let subsolarLng = -((utcHours - 12) * 15 + eqtime / 4);
    while (subsolarLng > 180) subsolarLng -= 360;
    while (subsolarLng < -180) subsolarLng += 360;

    return { lat: subsolarLat, lng: subsolarLng };
  }, [currentDate]);

  // Render 2D Equirectangular Earth map with Night Shading & Sun Position
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Background Ocean
    ctx.fillStyle = '#0f172a'; // Deep slate blue ocean
    ctx.fillRect(0, 0, width, height);

    // Latitude / Longitude Grid lines
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let lng = -180; lng <= 180; lng += 30) {
      const x = ((lng + 180) / 360) * width;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let lat = -90; lat <= 90; lat += 30) {
      const y = ((90 - lat) / 180) * height;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Equator & Prime Meridian highlight
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();

    // Night Shading Calculation
    const subLatRad = (solarPosition.lat * Math.PI) / 180;
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;

    for (let py = 0; py < height; py += 3) {
      const lat = 90 - (py / height) * 180;
      const latRad = (lat * Math.PI) / 180;

      for (let px = 0; px < width; px += 3) {
        const lng = (px / width) * 360 - 180;
        const deltaLngRad = ((lng - solarPosition.lng) * Math.PI) / 180;

        // Solar zenith angle cosine
        const cosZenith =
          Math.sin(latRad) * Math.sin(subLatRad) +
          Math.cos(latRad) * Math.cos(subLatRad) * Math.cos(deltaLngRad);

        // If cosZenith < 0, sun is below horizon (Night)
        if (cosZenith < 0) {
          // Darken night side with smooth twilight transition
          const darkness = Math.min(0.65, Math.abs(cosZenith) * 0.9);
          for (let dy = 0; dy < 3 && py + dy < height; dy++) {
            for (let dx = 0; dx < 3 && px + dx < width; dx++) {
              const idx = ((py + dy) * width + (px + dx)) * 4;
              data[idx] = Math.max(0, data[idx] * (1 - darkness));
              data[idx + 1] = Math.max(0, data[idx + 1] * (1 - darkness));
              data[idx + 2] = Math.max(0, data[idx + 2] * (1 - darkness) + 15);
            }
          }
        }
      }
    }
    ctx.putImageData(imgData, 0, 0);

    // Draw Sun Zenith position
    const sunX = ((solarPosition.lng + 180) / 360) * width;
    const sunY = ((90 - solarPosition.lat) / 180) * height;

    // Glowing Sun
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(sunX, sunY, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 14, 0, Math.PI * 2);
    ctx.stroke();

    // City Pins
    GLOBAL_CITIES.forEach((city) => {
      const cx = ((city.lng + 180) / 360) * width;
      const cy = ((90 - city.lat) / 180) * height;

      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = '10px Inter, sans-serif';
      ctx.fillStyle = '#e2e8f0';
      ctx.fillText(city.name, cx + 6, cy + 3);
    });
  }, [solarPosition]);

  return (
    <div className="bg-surface text-on-surface min-h-screen pt-0 pb-16 font-body-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-on-surface-variant mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/time-date" className="hover:text-primary transition-colors">Time &amp; Date</Link>
          <span>/</span>
          <span className="text-on-surface font-medium">Day &amp; Night World Map</span>
        </nav>

        {/* Hero Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 text-sky-600 font-mono text-xs font-semibold uppercase tracking-wider mb-3">
            Planetary Solar Terminator &amp; Daylight Projection
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-on-surface mb-3">
            Day and Night World Map
          </h1>
          <p className="text-base sm:text-lg text-on-surface-variant max-w-3xl">
            Visualise the live solar terminator, real-time day/night boundaries across Earth, current sun zenith position, and global daylight distribution.
          </p>
        </div>

        {/* Canvas World Map Container */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4 text-xs font-mono text-slate-300">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-400"></span> Subsolar Zenith Point ({solarPosition.lat.toFixed(1)}°, {solarPosition.lng.toFixed(1)}°)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-sky-400"></span> Major Metros
              </span>
            </div>
            <div>
              UTC: <strong className="text-white">{currentDate.toUTCString()}</strong>
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <canvas
              ref={canvasRef}
              width={900}
              height={450}
              className="w-full max-w-full rounded-xl border border-slate-800/80 aspect-[2/1]"
            />
          </div>
        </div>

        {/* Global Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-semibold text-on-surface mb-2">
              What is the Solar Terminator?
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              The solar terminator is the moving boundary dividing the illuminated day side from the dark night side of Earth. It moves westward across the globe at approximately 1,670 km/h (1,040 mph) at the equator.
            </p>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-semibold text-on-surface mb-2">
              Subsolar Zenith
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              The subsolar point is the exact geographic coordinate where the Sun is directly overhead at an angle of 90 degrees (zenith). Its latitude oscillates between +23.44° (Tropic of Cancer) and -23.44° (Tropic of Capricorn) throughout the year.
            </p>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-semibold text-on-surface mb-2">
              Global Daylight Equilibrium
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              During the March and September Equinoxes, the terminator is completely vertical, aligning with Earth&apos;s rotational axis and yielding exactly 12 hours of day and night everywhere.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
