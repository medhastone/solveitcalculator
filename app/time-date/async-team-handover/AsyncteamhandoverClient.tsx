'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AsyncteamhandoverClient() {
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
              <span className="material-symbols-outlined text-[16px] text-primary">forum</span>
              Async Team Handover
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
            <Link href="/time-date/multi-city-corridor" className={`px-3 py-1.5 rounded-lg font-body-sm text-body-sm flex items-center gap-1.5 whitespace-nowrap transition-all text-on-surface-variant hover:bg-surface-container hover:text-on-surface`}>
              <span className="material-symbols-outlined text-[16px]">flight_takeoff</span>
              Multi-City Corridor
            </Link>
            <Link href="/time-date/async-team-handover" className={`px-3 py-1.5 rounded-lg font-body-sm text-body-sm flex items-center gap-1.5 whitespace-nowrap transition-all bg-primary text-on-primary font-medium shadow-sm`}>
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
              Async Team Handover
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              Protocol designer and schedule generator for zero-latency engineering baton passes.
            </p>
          </div>
        </div>
      </section>

      
      {/* Async Team Handover Implementation */}
      <section className="w-full px-gutter-mobile md:px-gutter-desktop py-space-xl mb-space-3xl">
        <div className="max-w-max-width-canvas mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-md">
            <div className="lg:col-span-1 space-y-space-md">
              <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/30">
                <h3 className="font-headline-md font-semibold text-on-surface flex items-center gap-2"><span className="material-symbols-outlined text-primary">description</span> Default Handover Template</h3>
                <p className="font-body-sm text-on-surface-variant mt-2">Standardized format for passing context across time zones without synchronous meetings.</p>
                <div className="mt-4 space-y-2 font-data-mono text-[12px] text-on-surface bg-surface-container-low p-3 rounded-lg border border-surface-container-high">
                  <p><strong>[Status]</strong> Green / Yellow / Red</p>
                  <p><strong>[Completed]</strong> Bulleted list of PRs.</p>
                  <p><strong>[Blockers]</strong> What is stopping progress?</p>
                  <p><strong>[Next Shift Action]</strong> Explicit request for the incoming team.</p>
                </div>
                <button className="w-full mt-4 py-2 rounded bg-primary text-on-primary font-body-sm font-medium">Copy Template</button>
              </div>
            </div>
            
            <div className="lg:col-span-2">
              <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm border border-outline-variant/30 h-full">
                <h2 className="font-headline-md text-headline-md text-on-surface mb-space-md">Rules of Engagement</h2>
                
                <div className="space-y-4">
                  <div className="flex gap-4 p-4 rounded-xl bg-surface-container-low">
                    <span className="material-symbols-outlined text-[24px] text-emerald-600">forum</span>
                    <div>
                      <h4 className="font-body-md font-bold text-on-surface">No Hello Messages</h4>
                      <p className="font-body-sm text-on-surface-variant mt-1">Send complete thoughts. "Hello, are you there?" forces the recipient to wait. Just ask the question immediately.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 p-4 rounded-xl bg-surface-container-low">
                    <span className="material-symbols-outlined text-[24px] text-amber-600">schedule</span>
                    <div>
                      <h4 className="font-body-md font-bold text-on-surface">24-Hour Review SLA</h4>
                      <p className="font-body-sm text-on-surface-variant mt-1">All PRs must receive at least one review or comment within 24 hours to prevent cross-timezone stalling.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 p-4 rounded-xl bg-surface-container-low">
                    <span className="material-symbols-outlined text-[24px] text-indigo-600">videocam</span>
                    <div>
                      <h4 className="font-body-md font-bold text-on-surface">Record Everything</h4>
                      <p className="font-body-sm text-on-surface-variant mt-1">If a decision is made in a synchronous meeting, it does not exist until it is recorded or summarized in writing for the other time zones.</p>
                    </div>
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
            <h2 className="font-headline-md text-headline-md text-on-surface mb-space-sm">Mastering Asynchronous Remote Work</h2>
            <p className="font-body-md text-on-surface-variant mb-space-sm">When time zone overlap is less than 3 hours, relying on synchronous video meetings becomes a bottleneck. The Async Team Handover protocol shifts the organizational culture from "meeting-first" to "documentation-first".</p>
            <p className="font-body-md text-on-surface-variant">By utilizing standardized written templates, Loom video recordings, and strict SLAs (Service Level Agreements) for code reviews, distributed engineering squads can execute complex architectures without ever being in the same virtual room at the same time.</p>
          </div>
          
          <div className="mb-space-md">
            <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">help_outline</span>
              Async Protocol FAQ
            </h2>
          </div>
          <div className="space-y-space-xs">
            <details className="group bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden" open>
              <summary className="flex items-center justify-between p-space-md font-body-sm text-body-sm font-semibold text-on-surface cursor-pointer select-none">
                <span>Why is the "No Hello" rule so critical?</span>
                <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="px-space-md pb-space-md text-body-sm font-body-sm text-on-surface-variant border-t border-surface-container pt-space-xs">
                Sending a standalone "Hi" or "Are you there?" over Slack creates a synchronous dependency. If the recipient is asleep, they will reply 8 hours later with "Yes, I'm here." You have just wasted a full business day exchanging greetings. The "No Hello" rule mandates that you send your complete question, context, and requested action in the very first message.
              </div>
            </details>
            <details className="group bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
              <summary className="flex items-center justify-between p-space-md font-body-sm text-body-sm font-semibold text-on-surface cursor-pointer select-none">
                <span>How do we handle urgent incidents in an async setup?</span>
                <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="px-space-md pb-space-md text-body-sm font-body-sm text-on-surface-variant border-t border-surface-container pt-space-xs">
                Async protocols are for standard operational development. Urgent incidents (Sev 1 outages) bypass these rules and trigger dedicated paging systems (like PagerDuty) that immediately wake on-call engineers. However, the post-mortem incident report must still be written asynchronously for global review.
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
