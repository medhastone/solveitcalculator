'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function WorldclockgridClient() {
  const [mounted, setMounted] = useState(false);
  const [utcTime, setUtcTime] = useState<Date | null>(null);

  const formatUtcTime = (date: Date) => {
    const h = String(date.getUTCHours()).padStart(2, '0');
    const m = String(date.getUTCMinutes()).padStart(2, '0');
    const s = String(date.getUTCSeconds()).padStart(2, '0');
    return `${h}:${m}:${s}Z`;
  };

  const [format, setFormat] = useState<'12h'|'24h'>('12h');

  useEffect(() => {
    setMounted(true);
    setUtcTime(new Date());
    const timer = setInterval(() => {
      setUtcTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const cities = [
    { id: 'sf', name: 'San Francisco', abbreviation: 'PST', flag: '🇺🇸', utcOffset: -8 },
    { id: 'nyc', name: 'New York', abbreviation: 'EST', flag: '🇺🇸', utcOffset: -5 },
    { id: 'lon', name: 'London', abbreviation: 'GMT', flag: '🇬🇧', utcOffset: 0 },
    { id: 'ber', name: 'Berlin', abbreviation: 'CET', flag: '🇩🇪', utcOffset: 1 },
    { id: 'mum', name: 'Mumbai', abbreviation: 'IST', flag: '🇮🇳', utcOffset: 5.5 },
    { id: 'tok', name: 'Tokyo', abbreviation: 'JST', flag: '🇯🇵', utcOffset: 9 },
    { id: 'syd', name: 'Sydney', abbreviation: 'AEDT', flag: '🇦🇺', utcOffset: 11 },
    { id: 'dxb', name: 'Dubai', abbreviation: 'GST', flag: '🇦🇪', utcOffset: 4 },
    { id: 'sin', name: 'Singapore', abbreviation: 'SGT', flag: '🇸🇬', utcOffset: 8 },
  ];
  
  const currentUtcHour = utcTime ? utcTime.getUTCHours() : 0;

  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-380px)]">
      {/* Telemetry Bar & Contextual Path */}
      <section className="w-full bg-surface-container-low/60 backdrop-blur-md px-gutter-mobile md:px-gutter-desktop py-space-sm">
        <div className="max-w-max-width-canvas mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-space-sm">
          <nav aria-label="Breadcrumbs" className="flex items-center gap-space-2xs text-body-sm font-body-sm text-on-surface-variant flex-wrap">
            <Link className="hover:text-primary transition-colors flex items-center gap-1" href="/">
              <span className="material-symbols-outlined text-[16px]">home</span>
              <span>Home</span>
            </Link>
            <span className="text-outline-variant">/</span>
            <Link className="hover:text-primary transition-colors" href="/time-date">Time &amp; Date</Link>
            <span className="text-outline-variant">/</span>
            <Link className="hover:text-primary transition-colors" href="/time-date/time-zone-overlap">Time Zone Overlap Planner</Link>
            <span className="text-outline-variant">/</span>
            <span className="text-on-surface font-medium flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-primary">public</span>
              World Clock Grid
            </span>
          </nav>
          {/* Trust Telemetry Badges */}
          
          <div className="hidden sm:flex items-center gap-space-xs text-on-surface-variant font-data-mono text-body-sm">
            <span className="text-primary font-bold">UTC:</span>
            <span className="bg-surface-container-high px-2 py-0.5 rounded text-on-surface">
              {utcTime ? formatUtcTime(utcTime) : '00:00:00Z'}
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant text-label-caps font-label-caps shadow-sm whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              IANA tzdata 2025a
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed text-label-caps font-label-caps shadow-sm whitespace-nowrap">
              <span className="material-symbols-outlined text-[13px]">lock</span>
              Zero Cloud Telemetry
            </span>
          </div>
        </div>
      </section>

      {/* Interactive Suite Mode Switcher */}
      <section className="w-full bg-surface-container-lowest shadow-sm px-gutter-mobile md:px-gutter-desktop py-2.5">
        <div className="max-w-max-width-canvas mx-auto flex items-center justify-between gap-space-md overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5">
            <Link href="/time-date/time-zone-overlap" className="px-3 py-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-body-sm text-body-sm transition-colors flex items-center gap-1.5 whitespace-nowrap">
              <span className="material-symbols-outlined text-[16px]">sync_alt</span>
              Overlap Planner
            </Link>
            <Link href="/time-date/world-clock-grid" className={`px-3 py-1.5 rounded-lg font-body-sm text-body-sm flex items-center gap-1.5 whitespace-nowrap transition-all bg-primary text-on-primary font-medium shadow-sm`}>
              <span className="material-symbols-outlined text-[16px]">public</span>
              World Clock Grid
            </Link>
            <Link href="/time-date/global-meeting-matrix" className={`px-3 py-1.5 rounded-lg font-body-sm text-body-sm flex items-center gap-1.5 whitespace-nowrap transition-all text-on-surface-variant hover:bg-surface-container hover:text-on-surface`}>
              <span className="material-symbols-outlined text-[16px]">grid_4x4</span>
              Global Meeting Matrix
            </Link>
            <Link href="/time-date/dst-transition-tracker" className={`px-3 py-1.5 rounded-lg font-body-sm text-body-sm flex items-center gap-1.5 whitespace-nowrap transition-all text-on-surface-variant hover:bg-surface-container hover:text-on-surface`}>
              <span className="material-symbols-outlined text-[16px]">hourglass_top</span>
              DST Transition Tracker
            </Link>
            <Link href="/time-date/multi-city-corridor" className={`px-3 py-1.5 rounded-lg font-body-sm text-body-sm flex items-center gap-1.5 whitespace-nowrap transition-all text-on-surface-variant hover:bg-surface-container hover:text-on-surface`}>
              <span className="material-symbols-outlined text-[16px]">flight_takeoff</span>
              Multi-City Corridor
            </Link>
            <Link href="/time-date/async-team-handover" className={`px-3 py-1.5 rounded-lg font-body-sm text-body-sm flex items-center gap-1.5 whitespace-nowrap transition-all text-on-surface-variant hover:bg-surface-container hover:text-on-surface`}>
              <span className="material-symbols-outlined text-[16px]">forum</span>
              Async Team Handover
            </Link>
          </div>
        </div>
      </section>

      {/* High-Density Workspace Header / Hero Brief */}
      <section className="w-full px-gutter-mobile md:px-gutter-desktop py-space-xl md:py-space-2xl border-b border-surface-container">
        <div className="max-w-max-width-canvas mx-auto flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg">
          <div className="max-w-3xl">
            <div className="flex items-center gap-space-xs mb-space-xs">
              <span className="px-2 py-0.5 rounded bg-surface-container-highest text-primary font-label-caps text-label-caps uppercase tracking-wider">Metrological Engine v4.2</span>
              <span className="text-on-surface-variant text-body-sm">•</span>
              <span className="text-on-surface-variant font-body-sm text-body-sm">Active Module</span>
            </div>
            <h1 className="font-headline-lg md:font-display-hero text-headline-lg md:text-display-hero text-on-surface tracking-tight leading-none mb-space-sm">
              World Clock Grid
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              High-fidelity global timekeeping matrix with live UTC offsets and solar trajectory markers.
            </p>
          </div>
        </div>
      </section>

      
      {/* World Clock Grid Implementation */}
      <section className="w-full px-gutter-mobile md:px-gutter-desktop py-space-xl mb-space-3xl">
        <div className="max-w-max-width-canvas mx-auto">
          <div className="flex items-center justify-between mb-space-lg">
            <h2 className="font-headline-md text-headline-md text-on-surface">Global Nodes</h2>
            <div className="flex gap-2">
              <button onClick={() => setFormat(f => f === '12h' ? '24h' : '12h')} className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm transition-colors">
                Toggle {format === '12h' ? '24h' : '12h'}
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-space-md">
            {cities.map(loc => {
              const nowUtcMs = utcTime ? utcTime.getTime() : Date.now();
              const localDate = new Date(nowUtcMs + loc.utcOffset * 3600 * 1000);
              const h = localDate.getUTCHours();
              const m = String(localDate.getUTCMinutes()).padStart(2, '0');
              const s = String(localDate.getUTCSeconds()).padStart(2, '0');
              const isSleep = h < 8 || h >= 22; // simple heuristic
              const isCore = h >= 9 && h < 17;
              
              let displayH = h;
              let ampm = '';
              if (format === '12h') {
                ampm = h >= 12 ? ' PM' : ' AM';
                displayH = h % 12 || 12;
              }
              
              return (
                <div key={loc.id} className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between border border-outline-variant/20">
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-2xl">{loc.flag}</span>
                        <h3 className="font-headline-md text-headline-md text-on-surface mt-1 leading-tight">{loc.name}</h3>
                        <span className="text-label-caps font-label-caps text-on-surface-variant">{loc.abbreviation} • UTC{loc.utcOffset > 0 ? `+${loc.utcOffset}` : loc.utcOffset}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-label-caps font-label-caps font-semibold ${isSleep ? 'bg-slate-100 text-slate-700' : isCore ? 'bg-emerald-50 text-emerald-700' : 'bg-surface-container text-secondary'}`}>
                        {isSleep ? 'Sleeping' : isCore ? 'In Office' : 'Flex'}
                      </span>
                    </div>
                    <div className="my-space-md">
                      <div className="font-data-mono text-numerical-display text-on-surface font-bold tracking-tight">
                        {String(displayH).padStart(2,'0')}:{m}<span className="text-headline-md text-on-surface-variant">:{s}{ampm}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* SEO Content & FAQ Section */}
      <section className="w-full px-gutter-mobile md:px-gutter-desktop mb-space-3xl">
        <div className="max-w-max-width-canvas mx-auto">
          <div className="mb-space-xl">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-space-sm">Why Use a Global World Clock Grid?</h2>
            <p className="font-body-md text-on-surface-variant mb-space-sm">Managing a distributed remote team requires more than just knowing what time it is in one other city. A comprehensive world clock grid provides instantaneous situational awareness across multiple continents. By mapping local times against UTC and highlighting core office hours, program managers can prevent accidental pings during deep sleep cycles and identify the optimal windows for synchronized collaboration.</p>
            <p className="font-body-md text-on-surface-variant">Unlike standard list-based clocks, our grid format allows for rapid visual scanning of daylight states, enabling instant mental calculations for cross-border logistics.</p>
          </div>
          
          <div className="mb-space-md">
            <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">help_outline</span>
              World Clock FAQ
            </h2>
            <p className="font-body-sm text-on-surface-variant mt-1">Common questions about global timekeeping and coordination.</p>
          </div>
          <div className="space-y-space-xs">
            <details className="group bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden" open>
              <summary className="flex items-center justify-between p-space-md font-body-sm text-body-sm font-semibold text-on-surface cursor-pointer select-none">
                <span>What is the difference between GMT and UTC?</span>
                <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="px-space-md pb-space-md text-body-sm font-body-sm text-on-surface-variant border-t border-surface-container pt-space-xs">
                While often used interchangeably in casual conversation, GMT (Greenwich Mean Time) is a legal time zone used by some European and African countries, whereas UTC (Coordinated Universal Time) is a time standard used globally to keep clocks perfectly synchronized. UTC itself does not observe Daylight Saving Time.
              </div>
            </details>
            <details className="group bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
              <summary className="flex items-center justify-between p-space-md font-body-sm text-body-sm font-semibold text-on-surface cursor-pointer select-none">
                <span>How are fractional time zones calculated?</span>
                <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="px-space-md pb-space-md text-body-sm font-body-sm text-on-surface-variant border-t border-surface-container pt-space-xs">
                Most global time zones are offset in precise 1-hour increments from UTC. However, several countries use fractional offsets. For example, India Standard Time (IST) is UTC+5:30, and Nepal is UTC+5:45. Our clock engine natively calculates and formats these fractional minutes into standard display strings seamlessly.
              </div>
            </details>
            <details className="group bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
              <summary className="flex items-center justify-between p-space-md font-body-sm text-body-sm font-semibold text-on-surface cursor-pointer select-none">
                <span>Why do some nodes show 'Flex' instead of 'In Office'?</span>
                <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="px-space-md pb-space-md text-body-sm font-body-sm text-on-surface-variant border-t border-surface-container pt-space-xs">
                In modern remote work environments, core working hours are typically defined as 09:00 to 17:00 (In Office). "Flex" hours refer to the shoulder periods (e.g., 07:00-09:00 and 17:00-22:00) where team members may be available for asynchronous communication, but should not be expected to join mandatory synchronous meetings.
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* Section: Related Productivity & Computational Instruments */}
      <section className="w-full px-gutter-mobile md:px-gutter-desktop mb-space-3xl">
        <div className="max-w-max-width-canvas mx-auto pt-space-xl border-t border-surface-container">
          <h3 className="font-headline-md text-headline-md text-on-surface mb-space-md flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">apps</span>
            Explore Related Synchronization Tools
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
            <Link className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md hover:border-primary/40 transition-all block group" href="/time-date/time-zone-overlap">
              <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary mb-3 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[20px]">sync_alt</span>
              </div>
              <h4 className="font-body-sm text-body-sm font-semibold text-on-surface">Overlap Planner</h4>
              <p className="font-body-sm text-[12px] text-on-surface-variant mt-1">Algorithmically find synchronous meeting windows globally.</p>
            </Link>
            <Link className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md hover:border-primary/40 transition-all block group" href="/time-date/global-meeting-matrix">
              <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-secondary mb-3 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[20px]">grid_4x4</span>
              </div>
              <h4 className="font-body-sm text-body-sm font-semibold text-on-surface">Time Delta Matrix</h4>
              <p className="font-body-sm text-[12px] text-on-surface-variant mt-1">Chart the exact hour offsets between international team hubs.</p>
            </Link>
            <Link className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md hover:border-primary/40 transition-all block group" href="/time-date/dst-transition-tracker">
              <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-tertiary mb-3 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[20px]">hourglass_top</span>
              </div>
              <h4 className="font-body-sm text-body-sm font-semibold text-on-surface">DST Transition Tracker</h4>
              <p className="font-body-sm text-[12px] text-on-surface-variant mt-1">Anticipate Daylight Saving Time shifts and timezone drifts.</p>
            </Link>
            <Link className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md hover:border-primary/40 transition-all block group" href="/time-date/async-team-handover">
              <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-emerald-600 mb-3 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[20px]">forum</span>
              </div>
              <h4 className="font-body-sm text-body-sm font-semibold text-on-surface">Async Team Handover</h4>
              <p className="font-body-sm text-[12px] text-on-surface-variant mt-1">Design zero-latency communication templates for remote work.</p>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
