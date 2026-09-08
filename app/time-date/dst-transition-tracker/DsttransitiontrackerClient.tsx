'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DsttransitiontrackerClient() {
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
              <span className="material-symbols-outlined text-[16px] text-primary">hourglass_top</span>
              DST Transition Tracker
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
            <Link href="/time-date/dst-transition-tracker" className={`px-3 py-1.5 rounded-lg font-body-sm text-body-sm flex items-center gap-1.5 whitespace-nowrap transition-all bg-primary text-on-primary font-medium shadow-sm`}>
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
              DST Transition Tracker
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              Anticipate daylight saving shifts across hemispheres to prevent schedule collisions.
            </p>
          </div>
        </div>
      </section>

      
      {/* DST Tracker Implementation */}
      <section className="w-full px-gutter-mobile md:px-gutter-desktop py-space-xl mb-space-3xl">
        <div className="max-w-max-width-canvas mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg">
            <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-md border border-outline-variant/30">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-space-md">Upcoming Transitions (Next 6 Months)</h2>
              <div className="space-y-space-md">
                <div className="flex items-start gap-3 p-space-sm rounded-xl bg-surface-container-low border-l-4 border-primary">
                  <div className="bg-surface-container p-2 rounded-lg text-center min-w-[60px]">
                    <div className="font-label-caps text-label-caps text-on-surface-variant uppercase">Mar</div>
                    <div className="font-numerical-display text-[24px] font-bold text-primary">08</div>
                  </div>
                  <div>
                    <h3 className="font-body-md font-semibold text-on-surface">United States & Canada (Spring Forward)</h3>
                    <p className="font-body-sm text-on-surface-variant mt-1">Clocks move forward 1 hour at 2:00 AM local time. Pacific becomes UTC-7, Eastern becomes UTC-4.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-space-sm rounded-xl bg-surface-container-low border-l-4 border-secondary">
                  <div className="bg-surface-container p-2 rounded-lg text-center min-w-[60px]">
                    <div className="font-label-caps text-label-caps text-on-surface-variant uppercase">Mar</div>
                    <div className="font-numerical-display text-[24px] font-bold text-secondary">29</div>
                  </div>
                  <div>
                    <h3 className="font-body-md font-semibold text-on-surface">European Union & UK (Spring Forward)</h3>
                    <p className="font-body-sm text-on-surface-variant mt-1">Clocks move forward 1 hour. London becomes UTC+1 (BST), Berlin becomes UTC+2 (CEST).</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-space-sm rounded-xl bg-surface-container-low border-l-4 border-tertiary">
                  <div className="bg-surface-container p-2 rounded-lg text-center min-w-[60px]">
                    <div className="font-label-caps text-label-caps text-on-surface-variant uppercase">Apr</div>
                    <div className="font-numerical-display text-[24px] font-bold text-tertiary">05</div>
                  </div>
                  <div>
                    <h3 className="font-body-md font-semibold text-on-surface">Australia & New Zealand (Fall Back)</h3>
                    <p className="font-body-sm text-on-surface-variant mt-1">Clocks move backward 1 hour. Sydney shifts from UTC+11 to UTC+10.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-md border border-outline-variant/30">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-space-md">Impact Zones</h2>
              <p className="font-body-sm text-on-surface-variant mb-space-md">Regions that do not observe Daylight Saving Time will experience an effective shift in overlap with observing regions.</p>
              
              <ul className="space-y-2">
                <li className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low">
                  <span className="font-body-sm font-semibold">🇮🇳 India (IST)</span>
                  <span className="font-label-caps text-on-surface-variant">No DST Observed</span>
                </li>
                <li className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low">
                  <span className="font-body-sm font-semibold">🇯🇵 Japan (JST)</span>
                  <span className="font-label-caps text-on-surface-variant">No DST Observed</span>
                </li>
                <li className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low">
                  <span className="font-body-sm font-semibold">🇦🇪 UAE (GST)</span>
                  <span className="font-label-caps text-on-surface-variant">No DST Observed</span>
                </li>
                <li className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low">
                  <span className="font-body-sm font-semibold">🇸🇬 Singapore (SGT)</span>
                  <span className="font-label-caps text-on-surface-variant">No DST Observed</span>
                </li>
              </ul>
              
              <div className="mt-space-lg p-space-md bg-amber-50 border border-amber-200 rounded-xl">
                <h4 className="font-body-sm font-semibold text-amber-800 flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">warning</span> Warning Period</h4>
                <p className="font-body-sm text-amber-700 mt-1">Between March 8 and March 29, the US-Europe overlap window changes temporarily because the US shifts 3 weeks before Europe.</p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* SEO Content & FAQ Section */}
      <section className="w-full px-gutter-mobile md:px-gutter-desktop mb-space-3xl">
        <div className="max-w-max-width-canvas mx-auto">
          <div className="mb-space-xl">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-space-sm">Why Track DST Transitions?</h2>
            <p className="font-body-md text-on-surface-variant mb-space-sm">Daylight Saving Time (DST) is not globally synchronized. The United States and Canada typically shift their clocks in early March and early November, whereas the European Union shifts in late March and late October. Furthermore, the Southern Hemisphere (Australia, New Zealand) operates on an inverted calendar.</p>
            <p className="font-body-md text-on-surface-variant">This creates "Danger Zones"—multi-week periods where the standard time gap between your international offices shrinks or expands unexpectedly, often causing scheduled recurring calendar invites to break or overlap with sleep cycles.</p>
          </div>
          
          <div className="mb-space-md">
            <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">help_outline</span>
              DST Impact FAQ
            </h2>
          </div>
          <div className="space-y-space-xs">
            <details className="group bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden" open>
              <summary className="flex items-center justify-between p-space-md font-body-sm text-body-sm font-semibold text-on-surface cursor-pointer select-none">
                <span>What happens during the US-Europe "Danger Zone" in March?</span>
                <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="px-space-md pb-space-md text-body-sm font-body-sm text-on-surface-variant border-t border-surface-container pt-space-xs">
                In early March, the US "springs forward," but Europe does not shift until late March. During this 2-3 week window, the time difference between New York and London shrinks from 5 hours to just 4 hours. A recurring meeting scheduled at 9:00 AM EST will suddenly ring at 1:00 PM GMT instead of 2:00 PM GMT, potentially causing scheduling conflicts for European participants.
              </div>
            </details>
            <details className="group bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
              <summary className="flex items-center justify-between p-space-md font-body-sm text-body-sm font-semibold text-on-surface cursor-pointer select-none">
                <span>Do Asian countries observe Daylight Saving Time?</span>
                <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="px-space-md pb-space-md text-body-sm font-body-sm text-on-surface-variant border-t border-surface-container pt-space-xs">
                The vast majority of countries in Asia (including India, China, Japan, and Singapore) do not observe DST. This means their UTC offset remains static year-round. However, their effective time difference with the US and Europe will still shift twice a year when Western countries change their clocks.
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
