'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function GlobalmeetingmatrixClient() {
  const [mounted, setMounted] = useState(false);
  const [utcTime, setUtcTime] = useState<Date | null>(null);

  const formatUtcTime = (date: Date) => {
    const h = String(date.getUTCHours()).padStart(2, '0');
    const m = String(date.getUTCMinutes()).padStart(2, '0');
    const s = String(date.getUTCSeconds()).padStart(2, '0');
    return `${h}:${m}:${s}Z`;
  };

  const cities = [
    { id: 'sf', name: 'San Francisco', abbreviation: 'PST', flag: '🇺🇸', utcOffset: -8 },
    { id: 'nyc', name: 'New York', abbreviation: 'EST', flag: '🇺🇸', utcOffset: -5 },
    { id: 'lon', name: 'London', abbreviation: 'GMT', flag: '🇬🇧', utcOffset: 0 },
    { id: 'ber', name: 'Berlin', abbreviation: 'CET', flag: '🇩🇪', utcOffset: 1 },
    { id: 'mum', name: 'Mumbai', abbreviation: 'IST', flag: '🇮🇳', utcOffset: 5.5 },
    { id: 'tok', name: 'Tokyo', abbreviation: 'JST', flag: '🇯🇵', utcOffset: 9 },
    { id: 'syd', name: 'Sydney', abbreviation: 'AEDT', flag: '🇦🇺', utcOffset: 11 },
  ];

  
  useEffect(() => {
    setMounted(true);
    setUtcTime(new Date());
    const timer = setInterval(() => {
      setUtcTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
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
              <span className="material-symbols-outlined text-[16px] text-primary">grid_4x4</span>
              Global Meeting Matrix
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
            <Link href="/time-date/world-clock-grid" className={`px-3 py-1.5 rounded-lg font-body-sm text-body-sm flex items-center gap-1.5 whitespace-nowrap transition-all text-on-surface-variant hover:bg-surface-container hover:text-on-surface`}>
              <span className="material-symbols-outlined text-[16px]">public</span>
              World Clock Grid
            </Link>
            <Link href="/time-date/global-meeting-matrix" className={`px-3 py-1.5 rounded-lg font-body-sm text-body-sm flex items-center gap-1.5 whitespace-nowrap transition-all bg-primary text-on-primary font-medium shadow-sm`}>
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
              Global Meeting Matrix
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              Pairwise latency and availability grid for cross-border enterprise teams.
            </p>
          </div>
        </div>
      </section>

      
      {/* Matrix Implementation */}
      <section className="w-full px-gutter-mobile md:px-gutter-desktop py-space-xl mb-space-3xl">
        <div className="max-w-max-width-canvas mx-auto">
          <div className="bg-surface-container-lowest rounded-2xl shadow-md p-space-lg md:p-space-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm mb-space-md">
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">table_chart</span>
                  Pairwise Time Delta Matrix
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Hour offset variance between distributed engineering squads.</p>
              </div>
            </div>
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left font-body-sm text-body-sm border-collapse">
                <thead>
                  <tr className="border-b border-surface-container-high text-on-surface-variant font-label-caps text-label-caps">
                    <th className="py-3 px-3">Location</th>
                    {cities.map(loc => (
                      <th key={`th-${loc.id}`} className="py-3 px-3 text-center whitespace-nowrap">{loc.flag} {loc.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container font-data-mono text-[13px]">
                  {cities.map(rowLoc => (
                    <tr key={`tr-${rowLoc.id}`}>
                      <td className="py-2.5 px-3 font-sans font-semibold text-on-surface flex items-center gap-1.5 whitespace-nowrap">
                        <span>{rowLoc.flag}</span> {rowLoc.name}
                      </td>
                      {cities.map(colLoc => {
                        let diff = colLoc.utcOffset - rowLoc.utcOffset;
                        let colorClass = 'text-primary font-medium';
                        if (diff === 0) colorClass = 'text-outline-variant';
                        else if (Math.abs(diff) > 12) colorClass = 'text-tertiary font-bold';
                        else if (Math.abs(diff) > 8) colorClass = 'text-secondary font-medium';
                        else if (diff < 0) colorClass = 'text-on-surface-variant';
                        
                        const sign = diff > 0 ? '+' : '';
                        return (
                          <td key={`td-${rowLoc.id}-${colLoc.id}`} className={`py-2.5 px-3 text-center ${colorClass}`}>
                            {diff === 0 ? '0h' : `${sign}${diff}h`}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>


      {/* SEO Content & FAQ Section */}
      <section className="w-full px-gutter-mobile md:px-gutter-desktop mb-space-3xl">
        <div className="max-w-max-width-canvas mx-auto">
          <div className="mb-space-xl">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-space-sm">Understanding the Pairwise Time Delta Matrix</h2>
            <p className="font-body-md text-on-surface-variant mb-space-sm">The Global Meeting Matrix is a computational tool designed to reveal the exact chronological distance between any two geographical nodes in your organization. By mapping locations on both the X and Y axes, program managers can instantly visualize latency gaps.</p>
            <p className="font-body-md text-on-surface-variant">A delta of 0-3 hours indicates highly synchronous potential, whereas a delta of 9-12 hours signifies severe latency that requires strictly asynchronous (Follow-The-Sun) handover protocols.</p>
          </div>
          
          <div className="mb-space-md">
            <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">help_outline</span>
              Matrix & Alignment FAQ
            </h2>
          </div>
          <div className="space-y-space-xs">
            <details className="group bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden" open>
              <summary className="flex items-center justify-between p-space-md font-body-sm text-body-sm font-semibold text-on-surface cursor-pointer select-none">
                <span>How do I interpret the color coding?</span>
                <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="px-space-md pb-space-md text-body-sm font-body-sm text-on-surface-variant border-t border-surface-container pt-space-xs">
                Light neutral text indicates low friction (under 4 hours difference). Bold primary blue signifies moderate latency (4-8 hours). Secondary and tertiary warning colors (orange/red) trigger when the time gap exceeds 8 to 12 hours, alerting you that synchronous meetings will likely intrude on someone's sleep cycle.
              </div>
            </details>
            <details className="group bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
              <summary className="flex items-center justify-between p-space-md font-body-sm text-body-sm font-semibold text-on-surface cursor-pointer select-none">
                <span>Can I export this matrix for my team's wiki?</span>
                <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="px-space-md pb-space-md text-body-sm font-body-sm text-on-surface-variant border-t border-surface-container pt-space-xs">
                While direct image export is currently in development, the matrix is designed to be highly responsive. You can safely take a screenshot of the grid to embed in Confluence, Notion, or internal documentation handbooks to align expectations.
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
