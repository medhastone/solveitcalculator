'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function MulticitycorridorClient() {
  const [mounted, setMounted] = useState(false);
  const [utcTime, setUtcTime] = useState<Date | null>(null);

  const formatUtcTime = (date: Date) => {
    const h = String(date.getUTCHours()).padStart(2, '0');
    const m = String(date.getUTCMinutes()).padStart(2, '0');
    const s = String(date.getUTCSeconds()).padStart(2, '0');
    return `${h}:${m}:${s}Z`;
  };

  
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
              <span className="material-symbols-outlined text-[16px] text-primary">flight_takeoff</span>
              Multi-City Corridor
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
            <Link href="/time-date/global-meeting-matrix" className={`px-3 py-1.5 rounded-lg font-body-sm text-body-sm flex items-center gap-1.5 whitespace-nowrap transition-all text-on-surface-variant hover:bg-surface-container hover:text-on-surface`}>
              <span className="material-symbols-outlined text-[16px]">grid_4x4</span>
              Global Meeting Matrix
            </Link>
            <Link href="/time-date/dst-transition-tracker" className={`px-3 py-1.5 rounded-lg font-body-sm text-body-sm flex items-center gap-1.5 whitespace-nowrap transition-all text-on-surface-variant hover:bg-surface-container hover:text-on-surface`}>
              <span className="material-symbols-outlined text-[16px]">hourglass_top</span>
              DST Transition Tracker
            </Link>
            <Link href="/time-date/multi-city-corridor" className={`px-3 py-1.5 rounded-lg font-body-sm text-body-sm flex items-center gap-1.5 whitespace-nowrap transition-all bg-primary text-on-primary font-medium shadow-sm`}>
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
              Multi-City Corridor
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              Visualize travel and meeting corridors across multiple international hops.
            </p>
          </div>
        </div>
      </section>

      
      {/* Multi-City Corridor Implementation */}
      <section className="w-full px-gutter-mobile md:px-gutter-desktop py-space-xl mb-space-3xl">
        <div className="max-w-max-width-canvas mx-auto">
          <div className="bg-surface-container-lowest rounded-2xl shadow-md p-space-lg md:p-space-xl border border-outline-variant/30">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-space-lg">Around The World Handoff Sequence</h2>
            <div className="relative">
              <div className="absolute left-[39px] top-4 bottom-4 w-1 bg-surface-container-high rounded-full"></div>
              
              <div className="space-y-space-lg">
                <div className="relative flex items-start gap-space-md">
                  <div className="w-20 h-20 bg-primary-fixed rounded-full flex items-center justify-center border-4 border-surface-container-lowest shadow-sm z-10 shrink-0">
                    <span className="text-3xl">🇺🇸</span>
                  </div>
                  <div className="bg-surface-container-low p-space-md rounded-xl flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-body-lg font-semibold text-on-surface">San Francisco (PST)</h3>
                        <p className="font-body-sm text-on-surface-variant">UTC-8 • End of Day</p>
                      </div>
                      <div className="font-data-mono font-bold text-primary bg-primary-fixed/30 px-2 py-1 rounded">17:00 PST</div>
                    </div>
                    <p className="font-body-sm text-on-surface-variant mt-2 border-t border-surface-container pt-2">Commits code and writes daily handover RFC. Ping Tokyo counterpart.</p>
                  </div>
                </div>

                <div className="relative flex items-start gap-space-md">
                  <div className="w-20 h-20 bg-secondary-fixed rounded-full flex items-center justify-center border-4 border-surface-container-lowest shadow-sm z-10 shrink-0">
                    <span className="text-3xl">🇯🇵</span>
                  </div>
                  <div className="bg-surface-container-low p-space-md rounded-xl flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-body-lg font-semibold text-on-surface">Tokyo (JST)</h3>
                        <p className="font-body-sm text-on-surface-variant">UTC+9 • Start of Day (Next Day)</p>
                      </div>
                      <div className="font-data-mono font-bold text-secondary bg-secondary-fixed/30 px-2 py-1 rounded">10:00 JST</div>
                    </div>
                    <p className="font-body-sm text-on-surface-variant mt-2 border-t border-surface-container pt-2">Reviews SF PRs. Begins Asia-Pacific development sprint.</p>
                  </div>
                </div>

                <div className="relative flex items-start gap-space-md">
                  <div className="w-20 h-20 bg-tertiary-fixed rounded-full flex items-center justify-center border-4 border-surface-container-lowest shadow-sm z-10 shrink-0">
                    <span className="text-3xl">🇮🇳</span>
                  </div>
                  <div className="bg-surface-container-low p-space-md rounded-xl flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-body-lg font-semibold text-on-surface">Mumbai (IST)</h3>
                        <p className="font-body-sm text-on-surface-variant">UTC+5.5 • Mid Day</p>
                      </div>
                      <div className="font-data-mono font-bold text-tertiary bg-tertiary-fixed/30 px-2 py-1 rounded">13:30 IST</div>
                    </div>
                    <p className="font-body-sm text-on-surface-variant mt-2 border-t border-surface-container pt-2">Syncs with Tokyo before their end of day. Prepares handover for London.</p>
                  </div>
                </div>

                <div className="relative flex items-start gap-space-md">
                  <div className="w-20 h-20 bg-primary-fixed rounded-full flex items-center justify-center border-4 border-surface-container-lowest shadow-sm z-10 shrink-0">
                    <span className="text-3xl">🇬🇧</span>
                  </div>
                  <div className="bg-surface-container-low p-space-md rounded-xl flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-body-lg font-semibold text-on-surface">London (GMT)</h3>
                        <p className="font-body-sm text-on-surface-variant">UTC+0 • Morning</p>
                      </div>
                      <div className="font-data-mono font-bold text-primary bg-primary-fixed/30 px-2 py-1 rounded">08:00 GMT</div>
                    </div>
                    <p className="font-body-sm text-on-surface-variant mt-2 border-t border-surface-container pt-2">Reviews India PRs. Passes baton back to US East Coast (NYC at 09:00 EST / 14:00 GMT).</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* SEO Content & FAQ Section */}
      <section className="w-full px-gutter-mobile md:px-gutter-desktop mb-space-3xl">
        <div className="max-w-max-width-canvas mx-auto">
          <div className="mb-space-xl">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-space-sm">The Follow-The-Sun Development Model</h2>
            <p className="font-body-md text-on-surface-variant mb-space-sm">The Multi-City Corridor visualizes the gold standard of global software engineering: the Follow-The-Sun model. By strategically positioning team hubs across the Americas, Asia-Pacific, and Europe, an enterprise can achieve a continuous 24-hour development and support cycle.</p>
            <p className="font-body-md text-on-surface-variant">As one team finishes their day, they pass the baton (via automated CI/CD pipelines and written handover protocols) to the next team just coming online, ensuring zero downtime in product velocity or incident resolution.</p>
          </div>
          
          <div className="mb-space-md">
            <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">help_outline</span>
              Corridor Optimization FAQ
            </h2>
          </div>
          <div className="space-y-space-xs">
            <details className="group bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden" open>
              <summary className="flex items-center justify-between p-space-md font-body-sm text-body-sm font-semibold text-on-surface cursor-pointer select-none">
                <span>How many regional hubs are required for a true 24-hour cycle?</span>
                <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="px-space-md pb-space-md text-body-sm font-body-sm text-on-surface-variant border-t border-surface-container pt-space-xs">
                While it is possible to achieve continuous coverage with 2 locations spaced exactly 12 hours apart, this forces brutal 12-hour shifts. The optimal enterprise setup requires 3 primary hubs spaced roughly 8 hours apart (e.g., San Francisco, Tokyo/Singapore, and London/Berlin) to allow for comfortable 8-hour shifts with 1-2 hours of natural overlap for handovers.
              </div>
            </details>
            <details className="group bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
              <summary className="flex items-center justify-between p-space-md font-body-sm text-body-sm font-semibold text-on-surface cursor-pointer select-none">
                <span>What is the biggest risk in a Follow-The-Sun model?</span>
                <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="px-space-md pb-space-md text-body-sm font-body-sm text-on-surface-variant border-t border-surface-container pt-space-xs">
                Information silos and poorly executed handovers. If the Asia-Pacific team is blocked by missing documentation from the US team, they cannot proceed and must wait 12 hours for the US team to wake up. This turns a 24-hour velocity advantage into a 24-hour delay penalty.
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
