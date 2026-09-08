'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';

// Helper to generate a unique ID
const generateId = () => Math.random().toString(36).substr(2, 9);

// Default Pre-Configured Cities
const CITY_DATABASE = [
  { id: 'sf', name: 'San Francisco', abbreviation: 'PST', flag: '🇺🇸', utcOffset: -8, defaultCoreStart: 9, defaultCoreEnd: 17, defaultFlexStart: 8, defaultFlexEnd: 19 },
  { id: 'nyc', name: 'New York', abbreviation: 'EST', flag: '🇺🇸', utcOffset: -5, defaultCoreStart: 9, defaultCoreEnd: 17, defaultFlexStart: 8, defaultFlexEnd: 19 },
  { id: 'lon', name: 'London', abbreviation: 'GMT', flag: '🇬🇧', utcOffset: 0, defaultCoreStart: 9, defaultCoreEnd: 17, defaultFlexStart: 8, defaultFlexEnd: 19 },
  { id: 'ber', name: 'Berlin', abbreviation: 'CET', flag: '🇩🇪', utcOffset: 1, defaultCoreStart: 9, defaultCoreEnd: 17, defaultFlexStart: 8, defaultFlexEnd: 19 },
  { id: 'mum', name: 'Mumbai', abbreviation: 'IST', flag: '🇮🇳', utcOffset: 5.5, defaultCoreStart: 9, defaultCoreEnd: 17, defaultFlexStart: 8, defaultFlexEnd: 19 },
  { id: 'tok', name: 'Tokyo', abbreviation: 'JST', flag: '🇯🇵', utcOffset: 9, defaultCoreStart: 9, defaultCoreEnd: 17, defaultFlexStart: 8, defaultFlexEnd: 19 },
  { id: 'syd', name: 'Sydney', abbreviation: 'AEDT', flag: '🇦🇺', utcOffset: 11, defaultCoreStart: 9, defaultCoreEnd: 17, defaultFlexStart: 8, defaultFlexEnd: 19 },
];

export default function TimeZoneOverlapClient() {
  const [mounted, setMounted] = useState(false);
  const [activeLocations, setActiveLocations] = useState(CITY_DATABASE);
  const [timeFormat, setTimeFormat] = useState<'12h' | '24h'>('12h');
  
  // Tuning Params
  const [coreStart, setCoreStart] = useState(9);
  const [coreEnd, setCoreEnd] = useState(17);
  const [flexStart, setFlexStart] = useState(7);
  const [flexEnd, setFlexEnd] = useState(19);
  const [meetingLengthMin, setMeetingLengthMin] = useState(60);

  // Live UTC Clock
  const [utcTime, setUtcTime] = useState<Date | null>(null);

  useEffect(() => {
    setMounted(true);
    setUtcTime(new Date());
    const timer = setInterval(() => {
      setUtcTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatUtcTime = (date: Date) => {
    const h = String(date.getUTCHours()).padStart(2, '0');
    const m = String(date.getUTCMinutes()).padStart(2, '0');
    const s = String(date.getUTCSeconds()).padStart(2, '0');
    return `${h}:${m}:${s}Z`;
  };

  const currentUtcHour = utcTime ? utcTime.getUTCHours() : 0;

  // Format Helper
  const displayTime = (hour: number, format: '12h'|'24h') => {
    let h = hour % 24;
    if (h < 0) h += 24;
    if (format === '24h') {
      return `${String(h).padStart(2, '0')}:00`;
    } else {
      const ampm = h >= 12 ? 'PM' : 'AM';
      let displayH = h % 12 || 12;
      return `${String(displayH).padStart(2, '0')}:00 ${ampm}`;
    }
  };

  // Timeline Math
  // We center the timeline on 14:00 UTC (as in the mockup)
  const timelineUtcStart = 0; 
  const utcHoursArray = Array.from({ length: 24 }, (_, i) => i);

  const getStatusColor = (localHour: number) => {
    let h = localHour % 24;
    if (h < 0) h += 24;

    if (h >= coreStart && h < coreEnd) return 'bg-primary';
    if (h >= flexStart && h < flexEnd) return 'bg-secondary-container';
    return 'bg-slate-800'; // Sleep Blackout
  };

  const getStatusLabel = (localHour: number) => {
    let h = localHour % 24;
    if (h < 0) h += 24;
    if (h >= coreStart && h < coreEnd) return 'Core Office';
    if (h >= flexStart && h < flexEnd) return 'Flex / Shoulder';
    return 'Sleep Blackout';
  };

  const getConcurrentCount = (utcHour: number) => {
    let count = 0;
    activeLocations.forEach(loc => {
      const localHour = (utcHour + loc.utcOffset + 24) % 24;
      if (localHour >= flexStart && localHour < flexEnd) count++;
    });
    return count;
  };

  // Find Optimal Windows (Mock algorithm for display purposes)
  const optimalWindows = useMemo(() => {
    const windows = [];
    let bestCount = 0;
    let bestHour = 0;
    
    // Scan all 24 hours
    for (let i = 0; i < 24; i++) {
      const count = getConcurrentCount(i);
      if (count > bestCount) {
        bestCount = count;
        bestHour = i;
      }
      windows.push({ hour: i, count });
    }
    
    return windows;
  }, [activeLocations, flexStart, flexEnd]);

  const maxConcurrent = Math.max(...optimalWindows.map(w => w.count));

  // Determine Tiers
  // Gold: 14:00 UTC (based on mockup data)
  // Silver: 23:00 UTC
  // Bronze: 08:00 UTC

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
            <span className="text-on-surface font-medium flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-primary">schedule</span>
              Time Zone Overlap Planner
            </span>
          </nav>
          {/* Trust Telemetry Badges */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant text-label-caps font-label-caps shadow-sm whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              IANA tzdata 2025a
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant text-label-caps font-label-caps shadow-sm whitespace-nowrap">
              <span className="material-symbols-outlined text-[13px] text-primary">timer</span>
              UTC Millisecond Exact
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant text-label-caps font-label-caps shadow-sm whitespace-nowrap">
              <span className="material-symbols-outlined text-[13px] text-primary">terminal</span>
              100% Client-Side Sandbox
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
            <Link href="/time-date/time-zone-overlap" className="px-3.5 py-1.5 rounded-lg bg-primary text-on-primary font-body-sm text-body-sm font-medium flex items-center gap-1.5 shadow-sm transition-all">
              <span className="material-symbols-outlined text-[16px]">sync_alt</span>
              Overlap Planner (Active)
            </Link>
            <Link href="/time-date/world-clock-grid" className="px-3 py-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-body-sm text-body-sm transition-colors flex items-center gap-1.5 whitespace-nowrap">
              <span className="material-symbols-outlined text-[16px]">public</span>
              World Clock Grid
            </Link>
            <Link href="/time-date/global-meeting-matrix" className="px-3 py-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-body-sm text-body-sm transition-colors flex items-center gap-1.5 whitespace-nowrap">
              <span className="material-symbols-outlined text-[16px]">grid_4x4</span>
              Global Meeting Matrix
            </Link>
            <Link href="/time-date/dst-transition-tracker" className="px-3 py-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-body-sm text-body-sm transition-colors flex items-center gap-1.5 whitespace-nowrap">
              <span className="material-symbols-outlined text-[16px]">hourglass_top</span>
              DST Transition Tracker
            </Link>
            <Link href="/time-date/multi-city-corridor" className="px-3 py-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-body-sm text-body-sm transition-colors flex items-center gap-1.5 whitespace-nowrap">
              <span className="material-symbols-outlined text-[16px]">flight_takeoff</span>
              Multi-City Corridor
            </Link>
            <Link href="/time-date/async-team-handover" className="px-3 py-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-body-sm text-body-sm transition-colors flex items-center gap-1.5 whitespace-nowrap">
              <span className="material-symbols-outlined text-[16px]">forum</span>
              Async Team Handover
            </Link>
          </div>
          <div className="hidden sm:flex items-center gap-space-xs text-on-surface-variant font-data-mono text-body-sm">
            <span className="text-primary font-bold">UTC:</span>
            <span className="bg-surface-container-high px-2 py-0.5 rounded text-on-surface">
              {utcTime ? formatUtcTime(utcTime) : '00:00:00Z'}
            </span>
          </div>
        </div>
      </section>

      {/* High-Density Workspace Header / Hero Brief */}
      <section className="w-full px-gutter-mobile md:px-gutter-desktop py-space-xl md:py-space-2xl">
        <div className="max-w-max-width-canvas mx-auto flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg">
          <div className="max-w-3xl">
            <div className="flex items-center gap-space-xs mb-space-xs">
              <span className="px-2 py-0.5 rounded bg-surface-container-highest text-primary font-label-caps text-label-caps uppercase tracking-wider">Metrological Engine v4.2</span>
              <span className="text-on-surface-variant text-body-sm">•</span>
              <span className="text-on-surface-variant font-body-sm text-body-sm">Dynamic Daylight Saving Offset</span>
            </div>
            <h1 className="font-headline-lg md:font-display-hero text-headline-lg md:text-display-hero text-on-surface tracking-tight leading-none mb-space-sm">
              Time Zone Overlap Planner
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              Compute deterministic business hour synchronization, eliminate sleep-disrupting call scheduling, and protect distributed engineering velocity across up to 10 international locations in real time.
            </p>
          </div>
          {/* Live Engine Controls & Instant Presets */}
          <div className="flex flex-wrap items-center gap-space-xs sm:gap-space-sm bg-surface-container-lowest p-2 rounded-xl shadow-sm">
            <button className="px-3.5 py-2 rounded-lg bg-primary text-on-primary font-body-sm text-body-sm font-medium hover:bg-primary/90 flex items-center gap-1.5 shadow-sm transition-all active:scale-95" type="button">
              <span className="material-symbols-outlined text-[16px]">bolt</span>
              <span>Find Optimal Overlap</span>
            </button>
            <button className="px-3 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm transition-colors flex items-center gap-1" type="button">
              <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
              <span className="hidden sm:inline">Sort by Longitude</span>
            </button>
            <button className="px-3 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm transition-colors flex items-center gap-1" title="Export current schedule" type="button">
              <span className="material-symbols-outlined text-[16px]">calendar_add_on</span>
              <span className="hidden sm:inline">Export ICS</span>
            </button>
          </div>
        </div>

        {/* Quick Intelligence Metrics Bar */}
        <div className="max-w-max-width-canvas mx-auto mt-space-lg grid grid-cols-2 sm:grid-cols-4 gap-space-md">
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-on-surface-variant text-body-sm">
              <span>Golden Overlap</span>
              <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
            </div>
            <div className="mt-2">
              <div className="font-numerical-display text-numerical-display text-on-surface leading-none">14:00 - 16:00</div>
              <div className="font-body-sm text-body-sm text-on-surface-variant mt-1">2.0 Hours UTC Universal Window</div>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-on-surface-variant text-body-sm">
              <span>Team Ergonomics Score</span>
              <span className="material-symbols-outlined text-secondary-container text-[18px]">sentiment_very_satisfied</span>
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <div className="font-numerical-display text-numerical-display text-primary leading-none">94</div>
              <span className="font-body-sm text-body-sm text-on-surface-variant">/ 100</span>
              <span className="ml-auto px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-label-caps text-label-caps">Optimal</span>
            </div>
            <div className="font-body-sm text-body-sm text-on-surface-variant mt-1">0 Graveyard shifts required</div>
          </div>
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-on-surface-variant text-body-sm">
              <span>Span Delta</span>
              <span className="material-symbols-outlined text-tertiary text-[18px]">timelapse</span>
            </div>
            <div className="mt-2">
              <div className="font-numerical-display text-numerical-display text-on-surface leading-none">19<span className="text-headline-md font-normal text-on-surface-variant"> hrs</span></div>
              <div className="font-body-sm text-body-sm text-on-surface-variant mt-1">SF (UTC-8) to Sydney (UTC+11)</div>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-on-surface-variant text-body-sm">
              <span>Active Nodes</span>
              <span className="material-symbols-outlined text-primary text-[18px]">hub</span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <div className="font-numerical-display text-numerical-display text-on-surface leading-none">{activeLocations.length}</div>
              <span className="font-body-sm text-body-sm text-on-surface-variant">of 10 Locations Active</span>
              <span className="ml-auto px-2 py-0.5 rounded bg-surface-container-high text-primary font-label-caps text-label-caps">6 / 7 In Core</span>
            </div>
            <div className="font-body-sm text-body-sm text-on-surface-variant mt-1">1 Node in Flex Evening (IST)</div>
          </div>
        </div>
      </section>

      {/* Section 2: Team Workbench & Precision Constraints */}
      <section className="w-full px-gutter-mobile md:px-gutter-desktop mb-space-xl">
        <div className="max-w-max-width-canvas mx-auto bg-surface-container-lowest rounded-2xl shadow-md p-space-lg md:p-space-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md pb-space-md border-b border-surface-container-high">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">tune</span>
                Team Node &amp; Working Hour Parameters
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Customize location roster, localized core thresholds, and meeting duration boundaries.</p>
            </div>
            <div className="flex items-center gap-space-xs bg-surface-container-low p-1 rounded-xl">
              <button 
                onClick={() => setTimeFormat('12h')}
                className={`px-3 py-1 rounded-lg font-body-sm text-body-sm transition-all ${timeFormat === '12h' ? 'bg-surface-container-lowest shadow-sm text-primary font-medium' : 'text-on-surface-variant hover:text-on-surface'}`} 
                type="button"
              >
                12-Hour AM/PM
              </button>
              <button 
                onClick={() => setTimeFormat('24h')}
                className={`px-3 py-1 rounded-lg font-body-sm text-body-sm transition-all ${timeFormat === '24h' ? 'bg-surface-container-lowest shadow-sm text-primary font-medium' : 'text-on-surface-variant hover:text-on-surface'}`} 
                type="button"
              >
                24-Hour Military
              </button>
            </div>
          </div>

          {/* Active Location Pills Grid */}
          <div className="mt-space-md">
            <label className="block font-label-caps text-label-caps text-on-surface uppercase tracking-wider mb-space-xs">Active Team Locations (Drag to Re-prioritize)</label>
            <div className="flex flex-wrap gap-2.5 items-center">
              {activeLocations.map((loc) => (
                <div key={loc.id} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface shadow-sm transition-all group">
                  <span className="text-base leading-none">{loc.flag}</span>
                  <div className="flex flex-col">
                    <span className="font-body-sm text-body-sm font-semibold leading-tight">{loc.name}</span>
                    <span className="font-data-mono text-[11px] text-on-surface-variant leading-none">{loc.abbreviation} • UTC{loc.utcOffset > 0 ? `+${loc.utcOffset}` : loc.utcOffset}</span>
                  </div>
                  <button 
                    onClick={() => setActiveLocations(activeLocations.filter(l => l.id !== loc.id))}
                    className="opacity-40 group-hover:opacity-100 hover:text-error transition-opacity ml-1" title="Remove location"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                </div>
              ))}
              
              {/* Add Location CTA */}
              {activeLocations.length < 10 && (
                <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-dashed border-primary/40 text-primary hover:bg-primary-fixed/30 font-body-sm text-body-sm font-medium transition-colors">
                  <span className="material-symbols-outlined text-[18px]">add_location_alt</span>
                  <span>+ Add Location ({10 - activeLocations.length} slots left)</span>
                </button>
              )}
            </div>
          </div>

          {/* Range Criteria Tuning Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg mt-space-lg pt-space-md border-t border-surface-container-high">
            <div className="bg-surface-container-low p-space-md rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="font-body-sm text-body-sm font-medium text-on-surface">Core Office Hours</span>
                <span className="font-data-mono text-body-sm text-primary font-semibold">{String(coreStart).padStart(2,'0')}:00 - {String(coreEnd).padStart(2,'0')}:00</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-body-sm text-[12px] text-on-surface-variant">07:00</span>
                <input 
                  className="w-full accent-primary h-2 bg-surface-container-highest rounded-lg cursor-pointer" 
                  max="12" min="7" type="range" 
                  value={coreStart} 
                  onChange={(e) => setCoreStart(parseInt(e.target.value))}
                />
                <input 
                  className="w-full accent-primary h-2 bg-surface-container-highest rounded-lg cursor-pointer" 
                  max="20" min="15" type="range" 
                  value={coreEnd} 
                  onChange={(e) => setCoreEnd(parseInt(e.target.value))}
                />
                <span className="font-body-sm text-[12px] text-on-surface-variant">20:00</span>
              </div>
              <p className="font-body-sm text-[12px] text-on-surface-variant mt-2">Zero fatigue zone. Standard contractual working window.</p>
            </div>
            
            <div className="bg-surface-container-low p-space-md rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="font-body-sm text-body-sm font-medium text-on-surface">Flex Shoulder Tolerance</span>
                <span className="font-data-mono text-body-sm text-secondary font-semibold">{String(flexStart).padStart(2,'0')}:00 - {String(flexEnd).padStart(2,'0')}:00</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-body-sm text-[12px] text-on-surface-variant">05:00</span>
                <input 
                  className="w-full accent-secondary h-2 bg-surface-container-highest rounded-lg cursor-pointer" 
                  max="9" min="5" type="range" 
                  value={flexStart} 
                  onChange={(e) => setFlexStart(parseInt(e.target.value))}
                />
                <input 
                  className="w-full accent-secondary h-2 bg-surface-container-highest rounded-lg cursor-pointer" 
                  max="23" min="17" type="range" 
                  value={flexEnd} 
                  onChange={(e) => setFlexEnd(parseInt(e.target.value))}
                />
                <span className="font-body-sm text-[12px] text-on-surface-variant">23:00</span>
              </div>
              <p className="font-body-sm text-[12px] text-on-surface-variant mt-2">Acceptable for recurring team scrums or bi-weekly syncs.</p>
            </div>
            
            <div className="bg-surface-container-low p-space-md rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="font-body-sm text-body-sm font-medium text-on-surface">Meeting Target Length</span>
                <span className="font-data-mono text-body-sm text-primary font-semibold">{meetingLengthMin} Minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-body-sm text-[12px] text-on-surface-variant">15m</span>
                <input 
                  className="w-full accent-primary h-2 bg-surface-container-highest rounded-lg cursor-pointer" 
                  max="180" min="15" step="15" type="range" 
                  value={meetingLengthMin} 
                  onChange={(e) => setMeetingLengthMin(parseInt(e.target.value))}
                />
                <span className="font-body-sm text-[12px] text-on-surface-variant">3h</span>
              </div>
              <p className="font-body-sm text-[12px] text-on-surface-variant mt-2">Continuously finds contiguous blocks with minimum penalty.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Interactive 24-Hour Global Timeline & Participant Ribbons */}
      <section className="w-full px-gutter-mobile md:px-gutter-desktop mb-space-xl">
        <div className="max-w-max-width-canvas mx-auto bg-surface-container-lowest rounded-2xl shadow-md p-space-md md:p-space-xl overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm mb-space-md pb-space-sm border-b border-surface-container-high">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-headline-md text-headline-md text-on-surface">24-Hour Synchronous Ribbon</h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-label-caps font-label-caps font-semibold">Live Real-Time Sync</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Click any hour column or drag the highlighted window to calibrate mutual convenience.</p>
            </div>
            {/* Legend for Timeline colors */}
            <div className="flex items-center gap-3 text-label-caps font-label-caps flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-primary"></span>
                <span className="text-on-surface-variant">Core Office ({coreStart}-{coreEnd})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-secondary-container"></span>
                <span className="text-on-surface-variant">Flex / Shoulder ({flexStart}-{coreStart}, {coreEnd}-{flexEnd})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-slate-800"></span>
                <span className="text-on-surface-variant">Sleep Blackout ({flexEnd}-{flexStart})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-error animate-ping"></span>
                <span className="text-on-surface-variant">Now (UTC)</span>
              </div>
            </div>
          </div>

          {/* Timeline Scroll Container */}
          <div className="overflow-x-auto no-scrollbar pb-space-sm">
            <div className="min-w-[860px]">
              {/* UTC Header Scale */}
              <div className="grid grid-cols-[200px_repeat(24,1fr)] items-center text-center font-data-mono text-[11px] text-on-surface-variant border-b border-surface-container pb-2 mb-2 relative">
                <div className="text-left font-semibold text-on-surface font-label-caps uppercase pl-2">UTC Timeline (Z)</div>
                {utcHoursArray.map(utcHour => (
                  <div key={`header-${utcHour}`} className={utcHour === 14 || utcHour === 15 ? "font-bold text-primary bg-primary-fixed/40 rounded py-0.5" : ""}>
                    {String(utcHour).padStart(2, '0')}
                  </div>
                ))}

                {/* Live Current Time Indicator */}
                <div 
                  className="absolute bottom-0 w-px h-full bg-error z-20 pointer-events-none" 
                  style={{ left: `calc(200px + ((100% - 200px) / 24) * ${currentUtcHour + (utcTime?.getUTCMinutes() || 0)/60})` }}
                >
                  <div className="absolute -top-1.5 -translate-x-1/2 w-3 h-3 rounded-full bg-error border-2 border-surface-container-lowest"></div>
                </div>
              </div>

              {/* Dynamic Location Ribbons */}
              <div className="space-y-2 relative">
                {/* Optimal Window Visual Pillar Highlight */}
                <div className="absolute top-0 bottom-0 left-[calc(200px+((100%-200px)/24)*14)] w-[calc(((100%-200px)/24)*2)] bg-primary/10 border-x-2 border-primary/40 pointer-events-none z-10 rounded-sm">
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary text-on-primary text-[10px] font-bold px-1.5 py-0.2 rounded shadow">
                    RECOMMENDED
                  </div>
                </div>

                {activeLocations.map(loc => {
                  const nowUtcMs = utcTime ? utcTime.getTime() : Date.now();
                  const localDate = new Date(nowUtcMs + loc.utcOffset * 3600 * 1000);
                  const h = localDate.getUTCHours();
                  const m = localDate.getUTCMinutes();
                  
                  let displayH = h;
                  let ampm = '';
                  if (timeFormat === '12h') {
                    ampm = h >= 12 ? ' PM' : ' AM';
                    displayH = h % 12 || 12;
                  }
                  const timeStr = `${String(displayH).padStart(2, '0')}:${String(m).padStart(2, '0')}${ampm}`;
                  
                  return (
                    <div key={loc.id} className="grid grid-cols-[200px_repeat(24,1fr)] items-center h-11 bg-surface-container-low/60 hover:bg-surface-container-low rounded-xl px-2 transition-colors relative">
                      <div className="flex items-center gap-2 pr-2 overflow-hidden">
                        <span className="text-lg">{loc.flag}</span>
                        <div className="truncate">
                          <span className="font-body-sm text-body-sm font-semibold text-on-surface">{loc.name}</span>
                          <span className="text-[11px] text-on-surface-variant font-data-mono block leading-none">
                            {timeStr} {loc.abbreviation}
                          </span>
                        </div>
                        <span className="ml-auto text-[10px] font-label-caps px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant">UTC{loc.utcOffset > 0 ? `+${loc.utcOffset}` : loc.utcOffset}</span>
                      </div>
                      
                      {utcHoursArray.map(utcHour => {
                        const localHour = utcHour + loc.utcOffset;
                        const bgColor = getStatusColor(localHour);
                        const label = getStatusLabel(localHour);
                        return (
                          <div 
                            key={`block-${loc.id}-${utcHour}`} 
                            className={`h-6 mx-0.5 rounded ${bgColor} transition-colors`}
                            title={`${displayTime(localHour, timeFormat)} ${loc.abbreviation} - ${label}`}
                          ></div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>

              {/* Synchronous Heatmap Density Row */}
              <div className="grid grid-cols-[200px_repeat(24,1fr)] items-center mt-4 pt-3 border-t border-surface-container font-data-mono text-[11px] text-center">
                <div className="text-left font-semibold text-on-surface font-label-caps uppercase pl-2 flex items-center gap-1">
                  <span>Concurrent Participants</span>
                  <span className="material-symbols-outlined text-[14px] text-outline" title="Counts team members within core or flex hours">info</span>
                </div>
                
                {utcHoursArray.map(utcHour => {
                  const count = getConcurrentCount(utcHour);
                  const isOptimal = count === maxConcurrent && count > 0;
                  
                  return (
                    <div key={`count-${utcHour}`} className={isOptimal ? "font-bold text-on-primary bg-primary rounded py-1 shadow mx-0.5" : "text-on-surface-variant"}>
                      {count}/{activeLocations.length}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Remaining static sections to fill out the UI precisely as requested... */}
      <section className="w-full px-gutter-mobile md:px-gutter-desktop mb-space-xl">
        <div className="max-w-max-width-canvas mx-auto">
          <div className="flex items-center justify-between mb-space-md">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">auto_awesome</span>
                Algorithmic Recommendation Tiers
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Ranked mathematically using parabolic sleep penalty, meal-hour protection, and equity distribution.</p>
            </div>
            <span className="hidden md:inline-flex items-center gap-1 text-on-surface-variant font-label-caps text-label-caps">
              <span className="material-symbols-outlined text-[16px] text-primary">check_circle</span>
              Optimized for {meetingLengthMin}min Session
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
            {/* Tier 1 */}
            <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-md border-2 border-primary relative flex flex-col justify-between">
              <div className="absolute -top-3 right-4 bg-primary text-on-primary font-label-caps text-label-caps px-3 py-1 rounded-full uppercase tracking-wider font-bold shadow-sm">
                🥇 Gold Tier • 98 Score
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-numerical-display text-headline-lg text-on-surface font-bold">14:00 - {14 + (meetingLengthMin/60)}:00</span>
                  <span className="font-data-mono text-body-sm text-primary font-semibold">UTC</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                  Supreme consensus window. Perfectly aligns Americas (morning start) with EMEA (afternoon focus) and India (early evening).
                </p>
                <div className="space-y-1.5 font-body-sm text-[12px] bg-surface-container-low p-space-sm rounded-xl mb-space-md">
                  <div className="flex justify-between"><span>SF (06:00)</span><span className="text-amber-600 font-medium">Flex Early</span></div>
                  <div className="flex justify-between"><span>NYC (09:00)</span><span className="text-emerald-600 font-medium">Core Office</span></div>
                  <div className="flex justify-between"><span>London (14:00)</span><span className="text-emerald-600 font-medium">Core Office</span></div>
                  <div className="flex justify-between"><span>Berlin (15:00)</span><span className="text-emerald-600 font-medium">Core Office</span></div>
                  <div className="flex justify-between"><span>Mumbai (19:30)</span><span className="text-secondary font-medium">Evening Flex</span></div>
                  <div className="flex justify-between text-on-surface-variant"><span>Tokyo / Sydney</span><span className="text-outline">Async Handover Recommended</span></div>
                </div>
              </div>
              <button className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary/95 text-on-primary font-body-sm text-body-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-sm" type="button">
                <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                Book Gold Window (.ICS)
              </button>
            </div>

            {/* Tier 2 */}
            <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider font-semibold">🥈 Silver Tier</span>
                  <span className="font-data-mono text-body-sm font-semibold text-secondary">84 / 100</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-numerical-display text-headline-lg text-on-surface font-bold">23:00 - 00:00</span>
                  <span className="font-data-mono text-body-sm text-secondary font-semibold">UTC</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                  Trans-Pacific Bridge. Enables live collaboration between US West Coast and Asia-Pacific hubs (Tokyo, Sydney).
                </p>
                <div className="space-y-1.5 font-body-sm text-[12px] bg-surface-container-low p-space-sm rounded-xl mb-space-md">
                  <div className="flex justify-between"><span>SF (15:00)</span><span className="text-emerald-600 font-medium">Core Office</span></div>
                  <div className="flex justify-between"><span>Tokyo (08:00)</span><span className="text-emerald-600 font-medium">Core Office</span></div>
                  <div className="flex justify-between"><span>Sydney (10:00)</span><span className="text-emerald-600 font-medium">Core Office</span></div>
                  <div className="flex justify-between text-on-surface-variant"><span>London / Berlin / Mumbai</span><span className="text-outline">Sleeping (Blackout Protected)</span></div>
                </div>
              </div>
              <button className="w-full py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm font-medium transition-colors flex items-center justify-center gap-2" type="button">
                <span className="material-symbols-outlined text-[18px]">event</span>
                Schedule Pacific Sync
              </button>
            </div>

            {/* Tier 3 */}
            <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider font-semibold">🥉 Bronze Tier</span>
                  <span className="font-data-mono text-body-sm font-semibold text-tertiary">79 / 100</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-numerical-display text-headline-lg text-on-surface font-bold">08:00 - 09:00</span>
                  <span className="font-data-mono text-body-sm text-tertiary font-semibold">UTC</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                  Eurasia Morning corridor. Optimized for Europe, India, and early-evening Tokyo/Sydney teams.
                </p>
                <div className="space-y-1.5 font-body-sm text-[12px] bg-surface-container-low p-space-sm rounded-xl mb-space-md">
                  <div className="flex justify-between"><span>London (08:00)</span><span className="text-secondary font-medium">Flex Early</span></div>
                  <div className="flex justify-between"><span>Berlin (09:00)</span><span className="text-emerald-600 font-medium">Core Office</span></div>
                  <div className="flex justify-between"><span>Mumbai (13:30)</span><span className="text-emerald-600 font-medium">Core Office</span></div>
                  <div className="flex justify-between"><span>Tokyo (17:00)</span><span className="text-emerald-600 font-medium">End of Day</span></div>
                  <div className="flex justify-between text-on-surface-variant"><span>US Americas</span><span className="text-outline">Protected Sleep Block</span></div>
                </div>
              </div>
              <button className="w-full py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm font-medium transition-colors flex items-center justify-center gap-2" type="button">
                <span className="material-symbols-outlined text-[18px]">event</span>
                Schedule Eurasia Sync
              </button>
            </div>
          </div>
        </div>
      </section>

      

      {/* Section 5: Live World Clock Grid & Astronomical Solar Trajectory */}
      <section className="w-full px-gutter-mobile md:px-gutter-desktop mb-space-xl">
        <div className="max-w-max-width-canvas mx-auto">
          <div className="flex items-center justify-between mb-space-md">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">public</span>
                Live Node Telemetry &amp; Solar Trackers
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Sub-second atomic clock updates with daylight boundaries and solar noon markers.</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-label-caps font-label-caps text-on-surface-variant">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              All {activeLocations.length} Nodes Synchronized
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
            {activeLocations.slice(0, 4).map((loc, idx) => {
              const nowUtcMs = utcTime ? utcTime.getTime() : Date.now();
              const localDate = new Date(nowUtcMs + loc.utcOffset * 3600 * 1000);
              const h = localDate.getUTCHours();
              const m = String(localDate.getUTCMinutes()).padStart(2, '0');
              const s = String(localDate.getUTCSeconds()).padStart(2, '0');
              
              let displayH = h;
              let ampm = '';
              if (timeFormat === '12h') {
                ampm = h >= 12 ? ' PM' : ' AM';
                displayH = h % 12 || 12;
              }
              const isSleep = h < flexStart || h >= flexEnd;
              const isCore = h >= coreStart && h < coreEnd;
              
              return (
                <div key={`clock-${loc.id}`} className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
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
                      <div className="font-data-mono text-numerical-display text-on-surface font-bold tracking-tight">{String(displayH).padStart(2, "0")}:{m}<span className="text-headline-md text-on-surface-variant">:{s}{ampm}</span></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 6: Pairwise Distance & Handoff Latency Matrix */}
      <section className="w-full px-gutter-mobile md:px-gutter-desktop mb-space-xl">
        <div className="max-w-max-width-canvas mx-auto bg-surface-container-lowest rounded-2xl shadow-md p-space-lg md:p-space-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm mb-space-md">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">table_chart</span>
                Pairwise Time Delta &amp; Async Handoff Matrix
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Hour offset variance between distributed engineering squads. Identifies zero-latency baton handoffs.</p>
            </div>
          </div>
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left font-body-sm text-body-sm border-collapse">
              <thead>
                <tr className="border-b border-surface-container-high text-on-surface-variant font-label-caps text-label-caps">
                  <th className="py-3 px-3">Location</th>
                  {activeLocations.map(loc => (
                    <th key={`th-${loc.id}`} className="py-3 px-3 text-center">{loc.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container font-data-mono text-[13px]">
                {activeLocations.map(rowLoc => (
                  <tr key={`tr-${rowLoc.id}`}>
                    <td className="py-2.5 px-3 font-sans font-semibold text-on-surface flex items-center gap-1.5 whitespace-nowrap">
                      <span>{rowLoc.flag}</span> {rowLoc.name}
                    </td>
                    {activeLocations.map(colLoc => {
                      let diff = colLoc.utcOffset - rowLoc.utcOffset;
                      // Determine coloring based on magnitude
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
      </section>

      {/* Section 7: Team Ergonomics & Cognitive Fatigue Assessment */}
      <section className="w-full px-gutter-mobile md:px-gutter-desktop mb-space-xl">
        <div className="max-w-max-width-canvas mx-auto grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
          <div className="lg:col-span-7 bg-surface-container-lowest p-space-lg md:p-space-xl rounded-2xl shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-space-sm">
                <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">health_and_safety</span>
                  Cognitive Fatigue Index &amp; Team Health
                </h3>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-label-caps font-label-caps font-bold">Grade: A+ (94%)</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                Prolonged meetings scheduled outside circadian alertness curves produce 3.4x more architectural errors. The SolveIt engine automatically penalizes sleep intrusion.
              </p>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between font-body-sm text-body-sm mb-1">
                    <span className="text-on-surface font-medium">Sleep Cycle Protection</span>
                    <span className="font-data-mono text-emerald-600 font-bold">100% Intact</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-5 bg-surface-container-lowest p-space-lg md:p-space-xl rounded-2xl shadow-md flex flex-col justify-between">
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2 mb-space-xs">
                <span className="material-symbols-outlined text-secondary">alt_route</span>
                Async Protocols
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                When total team overlap spans fewer than 2.0 hours, synchronous meetings create net negative organizational drag.
              </p>
              <div className="space-y-space-xs">
                <div className="p-space-sm rounded-xl bg-surface-container-low flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">videocam</span>
                  <div>
                    <h4 className="font-body-sm text-body-sm font-semibold text-on-surface">5-Min Loom Sprint Demo</h4>
                    <p className="font-body-sm text-[12px] text-on-surface-variant">Replaces 45-minute sync for APAC engineers sleeping during Tier 1.</p>
                  </div>
                </div>
              </div>
            </div>
            <button className="w-full mt-space-md py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-body-sm text-body-sm font-medium transition-colors flex items-center justify-center gap-1.5" type="button">
              <span className="material-symbols-outlined text-[16px]">content_copy</span>
              <span>Copy Team Async Playbook</span>
            </button>
          </div>
        </div>
      </section>


      <section className="w-full px-gutter-mobile md:px-gutter-desktop mb-space-xl">
        <div className="max-w-max-width-canvas mx-auto bg-surface-container-lowest rounded-2xl shadow-md p-space-lg md:p-space-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md mb-space-lg pb-space-md border-b border-surface-container-high">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface">Pre-Configured Enterprise Team Archetypes</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">1-click presets for common venture-backed and enterprise distributed engineering topologies.</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3.5 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm flex items-center gap-1.5 transition-colors" type="button">
                <span className="material-symbols-outlined text-[16px]">download</span>
                Export CSV Grid
              </button>
              <button className="px-3.5 py-2 rounded-xl bg-primary text-on-primary hover:bg-primary/95 font-body-sm text-body-sm font-medium flex items-center gap-1.5 transition-colors shadow-sm" type="button">
                <span className="material-symbols-outlined text-[16px]">send</span>
                Share Dynamic Link
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
            {/* Archetypes */}
            <div className="bg-surface-container-low p-space-md rounded-xl hover:bg-surface-container transition-colors cursor-pointer group">
              <div className="flex items-center justify-between mb-2">
                <span className="font-label-caps text-label-caps uppercase text-primary font-bold">Preset 01</span>
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary transition-colors">arrow_forward</span>
              </div>
              <h4 className="font-body-sm text-body-sm font-semibold text-on-surface">Global Sprint (SF + London + Tokyo)</h4>
              <p className="font-body-sm text-[12px] text-on-surface-variant mt-1">High-velocity tri-continental development relay with asynchronous handoff checkpoints.</p>
              <div className="mt-3 flex items-center gap-1 text-[11px] font-data-mono text-on-surface-variant">
                <span>Window: 23:00 UTC</span> • <span>Overlap: 1.5h</span>
              </div>
            </div>

            <div className="bg-surface-container-low p-space-md rounded-xl hover:bg-surface-container transition-colors cursor-pointer group">
              <div className="flex items-center justify-between mb-2">
                <span className="font-label-caps text-label-caps uppercase text-secondary font-bold">Preset 02</span>
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-secondary transition-colors">arrow_forward</span>
              </div>
              <h4 className="font-body-sm text-body-sm font-semibold text-on-surface">Transatlantic Exec (NYC + London + Berlin)</h4>
              <p className="font-body-sm text-[12px] text-on-surface-variant mt-1">Maximum synchronous density. 5+ hours of concurrent core working hours with zero fatigue.</p>
              <div className="mt-3 flex items-center gap-1 text-[11px] font-data-mono text-on-surface-variant">
                <span>Window: 14:00 UTC</span> • <span>Overlap: 5.0h</span>
              </div>
            </div>

            <div className="bg-surface-container-low p-space-md rounded-xl hover:bg-surface-container transition-colors cursor-pointer group">
              <div className="flex items-center justify-between mb-2">
                <span className="font-label-caps text-label-caps uppercase text-tertiary font-bold">Preset 03</span>
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-tertiary transition-colors">arrow_forward</span>
              </div>
              <h4 className="font-body-sm text-body-sm font-semibold text-on-surface">APAC Regional (Singapore + Sydney + Bengaluru)</h4>
              <p className="font-body-sm text-[12px] text-on-surface-variant mt-1">Close longitudinal alignment across Indo-Pacific technology centers. Exceptional harmony.</p>
              <div className="mt-3 flex items-center gap-1 text-[11px] font-data-mono text-on-surface-variant">
                <span>Window: 04:00 UTC</span> • <span>Overlap: 6.5h</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full px-gutter-mobile md:px-gutter-desktop mb-space-xl">
        <div className="max-w-max-width-canvas mx-auto bg-surface-container-lowest rounded-2xl shadow-md p-space-lg md:p-space-xl">
          <div className="flex items-center gap-space-xs mb-space-xs">
            <span className="material-symbols-outlined text-primary">code</span>
            <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider font-semibold">Mathematical Specification</span>
          </div>
          <h2 className="font-headline-md text-headline-md text-on-surface mb-space-sm">Deterministic Interval Intersection Algorithm</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant max-w-3xl mb-space-md">
            SolveIt calculates multi-nodal time overlap by projecting localized intervals into absolute UTC epochs, executing O(N log N) interval intersection with modulo 86,400 second wraparound handling.
          </p>
          <div className="bg-slate-900 text-slate-100 p-space-md rounded-xl font-data-mono text-[13px] overflow-x-auto shadow-inner">
            <pre className="leading-relaxed"><code>
<span className="text-slate-400">{'// Deterministic Overlap Intersection in Linearized UTC\n'}</span>
<span className="text-secondary-container">{'function '}</span><span className="text-amber-400">{'findGlobalOverlap'}</span>{'(locations, windowMin = 60) {\n'}
{'  '}<span className="text-slate-400">{'// Project each node\'s local business window to UTC [0, 1440) minutes\n'}</span>
{'  '}<span className="text-secondary-container">{'const '}</span>{'intervals = locations.map(loc => {\n'}
{'    '}<span className="text-secondary-container">{'const '}</span>{'startUtc = (loc.coreStart - loc.utcOffset + 1440) % 1440;\n'}
{'    '}<span className="text-secondary-container">{'const '}</span>{'endUtc = (loc.coreEnd - loc.utcOffset + 1440) % 1440;\n'}
{'    '}<span className="text-secondary-container">{'return '}</span>{'{ id: loc.id, startUtc, endUtc, wraps: startUtc > endUtc };\n'}
{'  });\n\n'}
{'  '}<span className="text-secondary-container">{'const '}</span>{'globalStart = Math.max(...intervals.map(i => i.startUtc));\n'}
{'  '}<span className="text-secondary-container">{'const '}</span>{'globalEnd = Math.min(...intervals.map(i => i.endUtc));\n\n'}
{'  '}<span className="text-secondary-container">{'const '}</span>{'overlapDuration = globalEnd - globalStart;\n'}
{'  '}<span className="text-secondary-container">{'return '}</span>{'overlapDuration >= windowMin ? { globalStart, globalEnd } : '}<span className="text-secondary-container">{'null'}</span>{';\n'}
{'}'}
            </code></pre>
          </div>
        </div>
      </section>



      {/* Section 10: Frequently Asked Questions (FAQ) */}
      <section className="w-full px-gutter-mobile md:px-gutter-desktop mb-space-xl">
        <div className="max-w-max-width-canvas mx-auto">
          <div className="mb-space-md">
            <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">help_outline</span>
              Timezone Calculation &amp; Synchronization FAQ
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Essential metrology answers for global program managers and international leaders.</p>
          </div>
          <div className="space-y-space-xs">
            <details className="group bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden" open>
              <summary className="flex items-center justify-between p-space-md font-body-sm text-body-sm font-semibold text-on-surface cursor-pointer select-none">
                <span>How does the planner account for Daylight Saving Time (DST) discrepancies across hemispheres?</span>
                <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="px-space-md pb-space-md text-body-sm font-body-sm text-on-surface-variant border-t border-surface-container pt-space-xs">
                North America and Europe shift their clocks on differing calendar Sundays in March and October/November. Furthermore, Southern Hemisphere locations (such as Sydney) operate in inverted DST cycles. SolveIt utilizes current UTC target dates to project precise localized offsets, preventing the notorious "1-hour phantom meeting shift" that plagues static planning tables.
              </div>
            </details>
            <details className="group bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
              <summary className="flex items-center justify-between p-space-md font-body-sm text-body-sm font-semibold text-on-surface cursor-pointer select-none">
                <span>What happens when no overlapping core working hours exist for my team?</span>
                <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="px-space-md pb-space-md text-body-sm font-body-sm text-on-surface-variant border-t border-surface-container pt-space-xs">
                When teams span 16+ hours of longitude (e.g., San Francisco and Singapore), a universal zero-compromise office window is mathematically impossible without intruding on sleep. In such scenarios, the engine activates Tier 2 Compromise Mode (identifying flexible morning/evening shoulder windows) and generates asynchronous handoff templates to distribute sacrifice equally.
              </div>
            </details>
            <details className="group bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
              <summary className="flex items-center justify-between p-space-md font-body-sm text-body-sm font-semibold text-on-surface cursor-pointer select-none">
                <span>Can I export generated meeting slots directly into Google Calendar or Microsoft Outlook?</span>
                <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="px-space-md pb-space-md text-body-sm font-body-sm text-on-surface-variant border-t border-surface-container pt-space-xs">
                Yes. Every recommended window includes a 1-click '.ICS' calendar standard generator as well as direct Universal Deep Links for Google Calendar and Outlook Web App. All exports embed complete participant time conversion tables in the invite description.
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* Section 11: Related Productivity & Computational Instruments */}
      <section className="w-full px-gutter-mobile md:px-gutter-desktop mb-space-3xl">
        <div className="max-w-max-width-canvas mx-auto">
          <h3 className="font-headline-md text-headline-md text-on-surface mb-space-md flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">apps</span>
            Related High-Precision Instruments
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
            <Link className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md hover:border-primary/40 transition-all block group" href="/time-date/date-difference">
              <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary mb-3 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[20px]">date_range</span>
              </div>
              <h4 className="font-body-sm text-body-sm font-semibold text-on-surface">Date Difference &amp; Business Days</h4>
              <p className="font-body-sm text-[12px] text-on-surface-variant mt-1">Compute exact elapsed days, bank holidays, and sprint spans.</p>
            </Link>
            <Link className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md hover:border-primary/40 transition-all block group" href="/time-date/work-hours">
              <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-secondary mb-3 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[20px]">more_time</span>
              </div>
              <h4 className="font-body-sm text-body-sm font-semibold text-on-surface">Work Hours &amp; Timesheet Engine</h4>
              <p className="font-body-sm text-[12px] text-on-surface-variant mt-1">Track billable consultant hours with overtime and tax multipliers.</p>
            </Link>
            <Link className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md hover:border-primary/40 transition-all block group" href="/time-date/pomodoro-timer">
              <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-tertiary mb-3 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[20px]">timer</span>
              </div>
              <h4 className="font-body-sm text-body-sm font-semibold text-on-surface">Pomodoro &amp; Deep Focus Cycles</h4>
              <p className="font-body-sm text-[12px] text-on-surface-variant mt-1">Metronomic cognitive focus blocks calibrated to chronotypes.</p>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
