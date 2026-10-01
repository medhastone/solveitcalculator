'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

// --- NATO Nautical Zones Data ---
interface NatoZone {
  letter: string;
  name: string;
  offset: number; // hours from UTC
  meridian: string;
  regions: string;
}

const NATO_ZONES: NatoZone[] = [
  { letter: 'Z', name: 'Zulu', offset: 0, meridian: '0° (Prime)', regions: 'Greenwich, UK, Iceland, Ghana, Portugal (WET)' },
  { letter: 'A', name: 'Alpha', offset: 1, meridian: '15° E', regions: 'France, Germany, Italy, Nigeria, Norway (CET)' },
  { letter: 'B', name: 'Bravo', offset: 2, meridian: '30° E', regions: 'Greece, Egypt, South Africa, Finland, Israel (EET)' },
  { letter: 'C', name: 'Charlie', offset: 3, meridian: '45° E', regions: 'Saudi Arabia, Iraq, Kenya, Moscow (MSK)' },
  { letter: 'D', name: 'Delta', offset: 4, meridian: '60° E', regions: 'UAE, Oman, Azerbaijan, Mauritius, Seychelles' },
  { letter: 'E', name: 'Echo', offset: 5, meridian: '75° E', regions: 'Pakistan, Uzbekistan, Maldives, Kazakhstan (West)' },
  { letter: 'F', name: 'Foxtrot', offset: 6, meridian: '90° E', regions: 'Bangladesh, Bhutan, Kazakhstan (East)' },
  { letter: 'G', name: 'Golf', offset: 7, meridian: '105° E', regions: 'Thailand, Vietnam, Indonesia (West), Cambodia' },
  { letter: 'H', name: 'Hotel', offset: 8, meridian: '120° E', regions: 'China, Singapore, Western Australia, Philippines' },
  { letter: 'I', name: 'India', offset: 9, meridian: '135° E', regions: 'Japan, South Korea, Indonesia (East), Palau' },
  { letter: 'K', name: 'Kilo', offset: 10, meridian: '150° E', regions: 'Eastern Australia (AEST), Guam, Vladivostok' },
  { letter: 'L', name: 'Lima', offset: 11, meridian: '165° E', regions: 'Solomon Islands, Vanuatu, New Caledonia' },
  { letter: 'M', name: 'Mike', offset: 12, meridian: '180°', regions: 'New Zealand, Fiji, Tuvalu, Kamchatka' },
  { letter: 'N', name: 'November', offset: -1, meridian: '15° W', regions: 'Azores (Portugal), Cape Verde' },
  { letter: 'O', name: 'Oscar', offset: -2, meridian: '30° W', regions: 'South Georgia, Fernando de Noronha (Brazil)' },
  { letter: 'P', name: 'Papa', offset: -3, meridian: '45° W', regions: 'Eastern Brazil, Argentina, Uruguay, Greenland' },
  { letter: 'Q', name: 'Quebec', offset: -4, meridian: '60° W', regions: 'US Eastern (EDT), Atlantic Canada, Venezuela' },
  { letter: 'R', name: 'Romeo', offset: -5, meridian: '75° W', regions: 'US Eastern (EST), Colombia, Peru, Panama' },
  { letter: 'S', name: 'Sierra', offset: -6, meridian: '90° W', regions: 'US Central (CST), Mexico City, Guatemala' },
  { letter: 'T', name: 'Tango', offset: -7, meridian: '105° W', regions: 'US Mountain (MST), Calgary, Arizona' },
  { letter: 'U', name: 'Uniform', offset: -8, meridian: '120° W', regions: 'US Pacific (PST), Vancouver, Baja California' },
  { letter: 'V', name: 'Victor', offset: -9, meridian: '135° W', regions: 'Alaska (AKST), Gambier Islands' },
  { letter: 'W', name: 'Whiskey', offset: -10, meridian: '150° W', regions: 'Hawaii (HST), Tahiti, Cook Islands' },
  { letter: 'X', name: 'X-ray', offset: -11, meridian: '165° W', regions: 'American Samoa, Niue, Midway Atoll' },
  { letter: 'Y', name: 'Yankee', offset: -12, meridian: '180°', regions: 'Baker Island, Howland Island (IDLW)' },
];

const NATO_DIGITS: Record<string, string> = {
  '0': 'ZE-RO',
  '1': 'WUN',
  '2': 'TOO',
  '3': 'TREE',
  '4': 'FOW-ER',
  '5': 'FIFE',
  '6': 'SIX',
  '7': 'SEV-EN',
  '8': 'AIT',
  '9': 'NIN-ER',
};

const NUMBER_WORDS: Record<number, string> = {
  0: 'Zero', 1: 'One', 2: 'Two', 3: 'Three', 4: 'Four', 5: 'Five',
  6: 'Six', 7: 'Seven', 8: 'Eight', 9: 'Nine', 10: 'Ten',
  11: 'Eleven', 12: 'Twelve', 13: 'Thirteen', 14: 'Fourteen', 15: 'Fifteen',
  16: 'Sixteen', 17: 'Seventeen', 18: 'Eighteen', 19: 'Nineteen', 20: 'Twenty',
  21: 'Twenty-One', 22: 'Twenty-Two', 23: 'Twenty-Three', 24: 'Twenty-Four',
  30: 'Thirty', 40: 'Forty', 50: 'Fifty',
};

function getNumberWord(n: number): string {
  if (NUMBER_WORDS[n]) return NUMBER_WORDS[n];
  if (n < 60) {
    const tens = Math.floor(n / 10) * 10;
    const ones = n % 10;
    return `${NUMBER_WORDS[tens]}-${NUMBER_WORDS[ones]}`;
  }
  return n.toString();
}

function getMilitarySpoken(h: number, m: number): string {
  if (h === 0 && m === 0) return 'Zero Hundred Hours (Zero Zero Zero Zero)';
  if (m === 0) {
    if (h < 10) return `Zero ${getNumberWord(h)} Hundred Hours`;
    return `${getNumberWord(h)} Hundred Hours`;
  }
  let hStr = '';
  if (h === 0) hStr = 'Zero Zero';
  else if (h < 10) hStr = `Zero ${getNumberWord(h)}`;
  else hStr = getNumberWord(h);

  let mStr = '';
  if (m < 10) mStr = `Zero ${getNumberWord(m)}`;
  else mStr = getNumberWord(m);

  return `${hStr} ${mStr}`;
}

// --- Real-World Operational Scenarios ---
export interface RealWorldScenario {
  id: string;
  title: string;
  sector: string;
  icon: string;
  desc: string;
  h24: number;
  m: number;
  sourceZone: string;
  targetZone: string;
  tag: string;
  realWorldImpact: string;
}

export const REAL_WORLD_SCENARIOS: RealWorldScenario[] = [
  {
    id: 'aviation',
    title: 'Transatlantic Oceanic Clearance',
    sector: 'Aviation Dispatch (FAA / ICAO)',
    icon: 'flight_takeoff',
    desc: 'Flight departure clearances and oceanic waypoint timings must align strictly on Zulu time across multiple air navigation jurisdictions.',
    h24: 19,
    m: 30,
    sourceZone: 'Z',
    targetZone: 'A',
    tag: 'FLIGHT-BA178-OCEANIC',
    realWorldImpact: 'Eliminates altitude and route conflicts between London Shanwick and Gander Oceanic Air Traffic Control centers.',
  },
  {
    id: 'healthcare',
    title: 'ICU Critical Medication Titration',
    sector: 'Clinical Nursing & Pharmacy (WHO / TJC)',
    icon: 'local_hospital',
    desc: 'High-risk intravenous infusions (e.g. heparin or insulin) require unambiguous 24-hour charting during 12-hour nursing shift handoffs.',
    h24: 21,
    m: 45,
    sourceZone: 'R',
    targetZone: 'Z',
    tag: 'HEPARIN-TITR-Q4H',
    realWorldImpact: 'Prevents lethal 12-hour dosing delays or fatal overdoses caused by misreading 9:45 AM versus 9:45 PM in Electronic Health Records.',
  },
  {
    id: 'maritime',
    title: 'Maritime TSS Corridor Transit',
    sector: 'Nautical Shipping & Coast Guard (IMO / USCG)',
    icon: 'sailing',
    desc: 'Vessel watch officers entering congested international straits synchronize with vessel traffic services (VTS) and tidal height forecasts.',
    h24: 4,
    m: 15,
    sourceZone: 'H',
    targetZone: 'Z',
    tag: 'NAV-STRAIT-TSS-IN',
    realWorldImpact: 'Ensures safe navigation through high-density shipping lanes where tidal windows and pilot boarding schedules are non-negotiable.',
  },
  {
    id: 'cyber',
    title: 'Cloud Security Incident Response (SIEM)',
    sector: 'Cybersecurity & Distributed Systems (RFC 3339)',
    icon: 'security',
    desc: 'SOC analysts correlating distributed brute-force attacks across AWS, GCP, and Azure server farms align all intrusion logs to UTC.',
    h24: 2,
    m: 22,
    sourceZone: 'Z',
    targetZone: 'Q',
    tag: 'SOC-INCIDENT-9941',
    realWorldImpact: 'Enables precise millisecond forensic reconstruction of attack vectors across geographically distributed microservice clusters.',
  },
  {
    id: 'tactical',
    title: 'Multinational Coalition Joint OPORD',
    sector: 'Defense Tactical Operations (NATO STANAG 2211)',
    icon: 'shield',
    desc: 'Synchronizing naval gunfire, tactical close air support, and ground forces during a multinational coalition exercise.',
    h24: 5,
    m: 30,
    sourceZone: 'A',
    targetZone: 'Z',
    tag: 'OP-ALLIED-STRIKE',
    realWorldImpact: 'Eliminates fatal friendly fire or desynchronized artillery barrages across allied forces operating in different local time zones.',
  },
  {
    id: 'space',
    title: 'Orbital Spacecraft Rendezvous & Docking',
    sector: 'Aerospace & Ground Control (NASA / ESA)',
    icon: 'rocket_launch',
    desc: 'Ground tracking networks in Goldstone, Madrid, and Canberra execute mission maneuvers relative to a universal Greenwich epoch.',
    h24: 11,
    m: 15,
    sourceZone: 'Z',
    targetZone: 'U',
    tag: 'EVA-DOCK-BURN-2',
    realWorldImpact: 'Prevents orbital insertion errors where communication blackouts and line-of-sight acquisition are counted to the second.',
  },
];

export default function MilitaryTimeConverterClient() {
  const [conversionMode, setConversionMode] = useState<'12to24' | '24to12'>('12to24');
  
  // 12h Mode inputs
  const [hour12, setHour12] = useState<number>(2);
  const [minute12, setMinute12] = useState<number>(45);
  const [meridiem, setMeridiem] = useState<'AM' | 'PM'>('PM');

  // 24h Mode input
  const [militaryInput, setMilitaryInput] = useState<string>('1445');
  const [militaryError, setMilitaryError] = useState<string>('');

  // Active Real-World Scenario
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);

  // Zones & Projection
  const [sourceZone, setSourceZone] = useState<string>('Z');
  const [targetZone, setTargetZone] = useState<string>('R');
  
  // DTG Date & Mission Tag
  const [dtgDate, setDtgDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [missionTag, setMissionTag] = useState<string>('');

  // Live Chronometer
  const [utcClock, setUtcClock] = useState<string>('0000:00 Z');
  const [utcDateStr, setUtcDateStr] = useState<string>('');

  // Copy feedback
  const [copiedKey, setCopiedKey] = useState<string>('');

  // Search & Filter in Directory
  const [zoneSearch, setZoneSearch] = useState<string>('');
  const [zoneFilter, setZoneFilter] = useState<'ALL' | 'EAST' | 'WEST'>('ALL');

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Live UTC ticking effect
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = String(now.getUTCHours()).padStart(2, '0');
      const m = String(now.getUTCMinutes()).padStart(2, '0');
      const s = String(now.getUTCSeconds()).padStart(2, '0');
      setUtcClock(`${h}${m}:${s} Z`);

      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      const day = String(now.getUTCDate()).padStart(2, '0');
      const mon = months[now.getUTCMonth()];
      const yr = now.getUTCFullYear();
      setUtcDateStr(`${day} ${mon} ${yr}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Compute military hour and minute (0 - 23, 0 - 59)
  const { hour24, minute24 } = useMemo(() => {
    if (conversionMode === '12to24') {
      let h = hour12 % 12;
      if (meridiem === 'PM') h += 12;
      return { hour24: h, minute24: minute12 };
    } else {
      const clean = militaryInput.replace(/[^0-9]/g, '');
      if (clean.length === 0) return { hour24: 0, minute24: 0 };
      
      let h = 0;
      let m = 0;
      if (clean.length <= 2) {
        h = parseInt(clean, 10);
        m = 0;
      } else if (clean.length === 3) {
        h = parseInt(clean.slice(0, 1), 10);
        m = parseInt(clean.slice(1), 10);
      } else {
        h = parseInt(clean.slice(0, 2), 10);
        m = parseInt(clean.slice(2, 4), 10);
      }

      if (h > 24 || (h === 24 && m > 0) || m > 59) {
        return { hour24: 0, minute24: 0 };
      }
      if (h === 24 && m === 0) h = 0;
      return { hour24: h, minute24: m };
    }
  }, [conversionMode, hour12, minute12, meridiem, militaryInput]);

  const syncToMilitary = () => {
    let h = hour12 % 12;
    if (meridiem === 'PM') h += 12;
    const str = `${String(h).padStart(2, '0')}${String(minute12).padStart(2, '0')}`;
    setMilitaryInput(str);
  };

  const syncToCivilian = (h: number, m: number) => {
    const med = h >= 12 ? 'PM' : 'AM';
    let h12 = h % 12;
    if (h12 === 0) h12 = 12;
    setHour12(h12);
    setMinute12(m);
    setMeridiem(med);
  };

  const milString = useMemo(() => {
    return `${String(hour24).padStart(2, '0')}${String(minute24).padStart(2, '0')}`;
  }, [hour24, minute24]);

  const civilEquivalent = useMemo(() => {
    const med = hour24 >= 12 ? 'PM' : 'AM';
    let h12 = hour24 % 12;
    if (h12 === 0) h12 = 12;
    return `${h12}:${String(minute24).padStart(2, '0')} ${med}`;
  }, [hour24, minute24]);

  const radioPhonetic = useMemo(() => {
    return milString
      .split('')
      .map((ch) => NATO_DIGITS[ch] || ch)
      .join(' - ');
  }, [milString]);

  const spokenVerbal = useMemo(() => {
    return getMilitarySpoken(hour24, minute24);
  }, [hour24, minute24]);

  const srcNato = useMemo(() => NATO_ZONES.find((z) => z.letter === sourceZone) || NATO_ZONES[0], [sourceZone]);
  const tgtNato = useMemo(() => NATO_ZONES.find((z) => z.letter === targetZone) || NATO_ZONES[17], [targetZone]);

  const utcTotalMinutes = useMemo(() => {
    const localMins = hour24 * 60 + minute24;
    let utcMins = localMins - srcNato.offset * 60;
    utcMins = ((utcMins % 1440) + 1440) % 1440;
    return utcMins;
  }, [hour24, minute24, srcNato]);

  const zuluString = useMemo(() => {
    const zh = Math.floor(utcTotalMinutes / 60);
    const zm = utcTotalMinutes % 60;
    return `${String(zh).padStart(2, '0')}${String(zm).padStart(2, '0')}Z`;
  }, [utcTotalMinutes]);

  const targetProjection = useMemo(() => {
    let tgtMins = utcTotalMinutes + tgtNato.offset * 60;
    tgtMins = ((tgtMins % 1440) + 1440) % 1440;
    const th = Math.floor(tgtMins / 60);
    const tm = tgtMins % 60;
    return `${String(th).padStart(2, '0')}${String(tm).padStart(2, '0')}${tgtNato.letter}`;
  }, [utcTotalMinutes, tgtNato]);

  const dtgString = useMemo(() => {
    let day = '01';
    let mon = 'JAN';
    let yr = '26';
    if (dtgDate) {
      const parts = dtgDate.split('-');
      if (parts.length === 3) {
        day = parts[2];
        const monthNum = parseInt(parts[1], 10) - 1;
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        mon = months[monthNum] || 'JAN';
        yr = parts[0].slice(-2);
      }
    }
    const tag = missionTag.trim() ? ` // ${missionTag.trim().toUpperCase()}` : '';
    return `${day}${milString}${sourceZone} ${mon} ${yr}${tag}`;
  }, [dtgDate, milString, sourceZone, missionTag]);

  const dialAngle = useMemo(() => {
    const totalMinutes = hour24 * 60 + minute24;
    return (totalMinutes / 1440) * 360;
  }, [hour24, minute24]);

  const handleCopy = (text: string, key: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(''), 2200);
    }
  };

  const applyPreset = (h24: number, m: number) => {
    setActiveScenarioId(null);
    if (conversionMode === '12to24') {
      syncToCivilian(h24, m);
    } else {
      setMilitaryInput(`${String(h24).padStart(2, '0')}${String(m).padStart(2, '0')}`);
      setMilitaryError('');
    }
  };

  const applyScenario = (sc: RealWorldScenario) => {
    setActiveScenarioId(sc.id);
    if (conversionMode === '12to24') {
      syncToCivilian(sc.h24, sc.m);
    } else {
      setMilitaryInput(`${String(sc.h24).padStart(2, '0')}${String(sc.m).padStart(2, '0')}`);
      setMilitaryError('');
    }
    setSourceZone(sc.sourceZone);
    setTargetZone(sc.targetZone);
    setMissionTag(sc.tag);
  };

  const loadCurrentLocalTime = () => {
    setActiveScenarioId(null);
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes();
    applyPreset(h, m);
    setDtgDate(now.toISOString().split('T')[0]);
  };

  const theaterTimes = useMemo(() => {
    const theaters = [
      { id: 'ZULU', code: 'Z', offset: 0, title: 'ZULU • UTC+0', loc: 'Greenwich / London Naval HQ', tag: 'REFERENCE MERIDIAN, 0°' },
      { id: 'ALPHA', code: 'A', offset: 1, title: 'ALPHA • UTC+1', loc: 'Central European Cmd / Brussels / Berlin', tag: 'NATO HQ THEATER, +15° E' },
      { id: 'CHARLIE', code: 'C', offset: 3, title: 'CHARLIE • UTC+3', loc: 'Middle East Sector / Arabian Gulf / CENTCOM', tag: 'ARABIAN THEATER, +45° E' },
      { id: 'ROMEO', code: 'R', offset: -5, title: 'ROMEO • UTC-5', loc: 'US Eastern Defense / Washington / Norfolk', tag: 'PENTAGON SECTOR, -75° W' },
      { id: 'UNIFORM', code: 'U', offset: -8, title: 'UNIFORM • UTC-8', loc: 'US Pacific Naval Fleet / San Diego / Seattle', tag: 'PACIFIC CORRIDOR, -120° W' },
      { id: 'KILO', code: 'K', offset: 10, title: 'KILO • UTC+10', loc: 'Western Pacific Rim / Sydney / Guam Support', tag: 'OCEANIA SECTOR, +150° E' },
    ];

    return theaters.map((t) => {
      let tMins = utcTotalMinutes + t.offset * 60;
      tMins = ((tMins % 1440) + 1440) % 1440;
      const th = Math.floor(tMins / 60);
      const tm = tMins % 60;
      const mil = `${String(th).padStart(2, '0')}${String(tm).padStart(2, '0')}${t.code}`;
      const med = th >= 12 ? 'PM' : 'AM';
      let civH = th % 12;
      if (civH === 0) civH = 12;
      const civ = `${civH}:${String(tm).padStart(2, '0')} ${med}`;
      return { ...t, mil, civ };
    });
  }, [utcTotalMinutes]);

  const filteredZones = useMemo(() => {
    return NATO_ZONES.filter((z) => {
      if (zoneFilter === 'EAST' && (z.offset < 1 || z.offset > 12)) return false;
      if (zoneFilter === 'WEST' && (z.offset > -1 || z.offset < -12)) return false;
      if (!zoneSearch.trim()) return true;
      const q = zoneSearch.toLowerCase();
      return (
        z.letter.toLowerCase().includes(q) ||
        z.name.toLowerCase().includes(q) ||
        z.meridian.toLowerCase().includes(q) ||
        z.regions.toLowerCase().includes(q) ||
        `utc${z.offset >= 0 ? '+' : ''}${z.offset}`.toLowerCase().includes(q)
      );
    });
  }, [zoneFilter, zoneSearch]);

  return (
    <main className="w-full pt-0 pb-20 bg-background min-h-screen text-on-surface">
      {/* Top Banner */}
      <div className="border-b border-outline-variant/30 bg-surface-container-lowest/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
            </span>
            <span className="font-data-mono font-semibold tracking-wide text-primary">
              SYSTEM READY • UTC / STANAG 2211 ACCURATE
            </span>
          </div>
          <div className="flex items-center gap-4 text-on-surface-variant">
            <span className="hidden sm:inline font-data-mono">
              Universal Date: <strong className="text-on-surface">{utcDateStr || '19 SEP 2026'}</strong>
            </span>
            <span className="inline-flex items-center gap-1 font-data-mono bg-surface-container-high px-2.5 py-0.5 rounded text-on-surface">
              <span className="material-symbols-outlined text-sm text-primary">public</span>
              Zulu Clock: <strong className="text-primary">{utcClock}</strong>
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">
        {/* Breadcrumb Navigation Bar */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-on-surface-variant flex-wrap font-medium">
          <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">home</span>
            <span>Home</span>
          </Link>
          <span className="text-outline-variant/60">/</span>
          <Link href="/time-date" className="hover:text-primary transition-colors">
            Time &amp; Date Calculators
          </Link>
          <span className="text-outline-variant/60">/</span>
          <span className="font-semibold text-on-surface" aria-current="page">
            Military Time Converter
          </span>
        </nav>

        {/* Hero Section */}
        <section className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary-container/15 text-primary border border-primary/20">
            <span className="material-symbols-outlined text-base">radar</span>
            TACTICAL & CIVILIAN TIME SYNCHRONIZATION
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-on-surface font-headline-lg">
                Military Time Converter
              </h1>
              <p className="mt-2 text-base sm:text-lg text-on-surface-variant max-w-3xl leading-relaxed">
                Convert smoothly between 12-hour civilian clocks, 24-hour notation, and international defense time zones. Built for flight operations, medical teams, logistics specialists, and global coordinators.
              </p>
            </div>

            {/* Live Chronometer Card */}
            <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-4 shadow-sm flex items-center gap-4 min-w-[280px]">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-2xl">schedule</span>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider font-semibold text-on-surface-variant">
                  Live Greenwich Chronometer
                </div>
                <div className="text-2xl font-bold font-data-mono text-primary tracking-tight">
                  {utcClock}
                </div>
                <div className="text-xs text-on-surface-variant flex items-center gap-1">
                  <span>NATO Sector: <strong>Zulu (UTC+0)</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Presets Strip */}
          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-on-surface-variant uppercase tracking-wider text-[11px] mr-1">
              Quick Mission Presets:
            </span>
            {[
              { label: '0800 Morning', h: 8, m: 0 },
              { label: '1300 Afternoon', h: 13, m: 0 },
              { label: '1830 Shift Change', h: 18, m: 30 },
              { label: '2359 Day End', h: 23, m: 59 },
              { label: '0000 Midnight', h: 0, m: 0 },
            ].map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => applyPreset(p.h, p.m)}
                className="px-2.5 py-1 rounded-md bg-surface-container-lowest hover:bg-surface-container-high border border-outline-variant/30 text-on-surface transition-colors font-data-mono"
              >
                {p.label}
              </button>
            ))}
            <button
              type="button"
              onClick={loadCurrentLocalTime}
              className="px-2.5 py-1 rounded-md bg-primary-container/20 hover:bg-primary-container/30 border border-primary/30 text-primary font-medium transition-colors inline-flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-xs">my_location</span>
              Current Local Time
            </button>
          </div>

          {/* Real-World Mission Scenarios Strip */}
          <div className="pt-3 border-t border-outline-variant/20">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">hub</span>
                Real-World Operational Scenarios (Click to Load Scenario):
              </span>
              {activeScenarioId && (
                <button
                  type="button"
                  onClick={() => setActiveScenarioId(null)}
                  className="text-[11px] text-on-surface-variant hover:text-primary transition-colors underline"
                >
                  Clear Scenario
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {REAL_WORLD_SCENARIOS.map((sc) => {
                const isSelected = activeScenarioId === sc.id;
                return (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => applyScenario(sc)}
                    className={`p-2.5 rounded-lg border text-left transition-all flex flex-col justify-between gap-1.5 ${
                      isSelected
                        ? 'bg-primary-container/20 border-primary shadow-xs ring-1 ring-primary'
                        : 'bg-surface-container-lowest border-outline-variant/30 hover:border-primary/50 hover:bg-surface-container-low'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="material-symbols-outlined text-base text-primary">
                        {sc.icon}
                      </span>
                      <span className="font-data-mono font-bold text-[11px] text-primary">
                        {String(sc.h24).padStart(2, '0')}{String(sc.m).padStart(2, '0')}{sc.sourceZone}
                      </span>
                    </div>
                    <div>
                      <div className="font-bold text-[11px] text-on-surface line-clamp-1">
                        {sc.title}
                      </div>
                      <div className="text-[10px] text-on-surface-variant line-clamp-1">
                        {sc.sector}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Real-World Need Context Banner */}
            {activeScenarioId && (() => {
              const currentSc = REAL_WORLD_SCENARIOS.find((s) => s.id === activeScenarioId);
              if (!currentSc) return null;
              return (
                <div className="mt-3 p-3.5 rounded-xl bg-primary-container/15 border border-primary/30 flex items-start gap-3 animate-fade-in text-xs">
                  <span className="material-symbols-outlined text-primary text-xl mt-0.5">
                    verified
                  </span>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <strong className="text-on-surface font-semibold">
                        Active Mission Profile: {currentSc.title}
                      </strong>
                      <span className="px-2 py-0.5 rounded bg-primary text-on-primary text-[10px] font-bold">
                        {currentSc.sector}
                      </span>
                    </div>
                    <p className="text-on-surface-variant leading-relaxed">
                      {currentSc.desc}
                    </p>
                    <div className="pt-0.5 text-primary font-medium flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">shield</span>
                      <span><strong>Real-World Critical Need:</strong> {currentSc.realWorldImpact}</span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </section>

        {/* Main Workbench Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Form Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 sm:p-7 shadow-sm space-y-6">
              {/* Header & Mode Switch */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-outline-variant/30">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-xl">tune</span>
                  <h2 className="text-lg font-bold text-on-surface">Input Parameters</h2>
                </div>
                {/* Mode Tabs */}
                <div className="inline-flex rounded-lg bg-surface-container p-1 border border-outline-variant/30">
                  <button
                    type="button"
                    onClick={() => {
                      if (conversionMode !== '12to24') {
                        syncToCivilian(hour24, minute24);
                        setConversionMode('12to24');
                      }
                    }}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                      conversionMode === '12to24'
                        ? 'bg-primary text-on-primary shadow-sm'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    12h Civil → 24h Military
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (conversionMode !== '24to12') {
                        syncToMilitary();
                        setConversionMode('24to12');
                      }
                    }}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                      conversionMode === '24to12'
                        ? 'bg-primary text-on-primary shadow-sm'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    24h Military → 12h Civil
                  </button>
                </div>
              </div>

              {/* Conditional Form Inputs */}
              {conversionMode === '12to24' ? (
                <div className="space-y-4">
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                    Standard 12-Hour Civilian Time (HH : MM + Phase)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Hour Select */}
                    <div>
                      <span className="block text-[11px] text-on-surface-variant mb-1 font-medium">Hour (1 - 12)</span>
                      <select
                        value={hour12}
                        onChange={(e) => setHour12(parseInt(e.target.value, 10))}
                        className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-2.5 font-data-mono font-semibold text-base text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
                      >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                          <option key={h} value={h}>
                            {String(h).padStart(2, '0')}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Minute Select */}
                    <div>
                      <span className="block text-[11px] text-on-surface-variant mb-1 font-medium">Minute (00 - 59)</span>
                      <select
                        value={minute12}
                        onChange={(e) => setMinute12(parseInt(e.target.value, 10))}
                        className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-2.5 font-data-mono font-semibold text-base text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
                      >
                        {Array.from({ length: 60 }, (_, i) => i).map((m) => (
                          <option key={m} value={m}>
                            {String(m).padStart(2, '0')}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* AM / PM Toggle */}
                    <div>
                      <span className="block text-[11px] text-on-surface-variant mb-1 font-medium">Meridiem Phase</span>
                      <div className="grid grid-cols-2 gap-1.5 h-[46px] p-1 bg-surface-container-low border border-outline-variant/50 rounded-lg">
                        <button
                          type="button"
                          onClick={() => setMeridiem('AM')}
                          className={`rounded-md text-xs font-bold transition-colors ${
                            meridiem === 'AM'
                              ? 'bg-primary text-on-primary shadow-xs'
                              : 'text-on-surface-variant hover:text-on-surface'
                          }`}
                        >
                          AM (Ante)
                        </button>
                        <button
                          type="button"
                          onClick={() => setMeridiem('PM')}
                          className={`rounded-md text-xs font-bold transition-colors ${
                            meridiem === 'PM'
                              ? 'bg-primary text-on-primary shadow-xs'
                              : 'text-on-surface-variant hover:text-on-surface'
                          }`}
                        >
                          PM (Post)
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Browser sync input */}
                  <div className="pt-2 flex items-center justify-between gap-4 p-3 bg-surface-container-low/60 rounded-lg border border-outline-variant/20 text-xs">
                    <span className="text-on-surface-variant">
                      Syncs with standard browser time pickers:
                    </span>
                    <input
                      type="time"
                      value={`${String(hour24).padStart(2, '0')}:${String(minute24).padStart(2, '0')}`}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val) {
                          const [hStr, mStr] = val.split(':');
                          syncToCivilian(parseInt(hStr, 10), parseInt(mStr, 10));
                        }
                      }}
                      className="bg-surface-container-lowest border border-outline-variant/40 rounded px-2 py-1 font-data-mono text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">
                      Enter 24-Hour / Military Notation (e.g. 1445 or 14:45)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        maxLength={5}
                        value={militaryInput}
                        onChange={(e) => {
                          setMilitaryInput(e.target.value);
                          setMilitaryError('');
                        }}
                        placeholder="1445"
                        className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg pl-4 pr-24 py-3 font-data-mono font-bold text-2xl text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40 tracking-wider"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold font-data-mono px-2 py-1 bg-surface-container rounded text-on-surface-variant">
                        HRS / 24H
                      </span>
                    </div>
                    {militaryError && (
                      <p className="mt-1.5 text-xs text-error font-medium">{militaryError}</p>
                    )}
                    <p className="mt-1.5 text-xs text-on-surface-variant">
                      Accepts colon-separated 14:45 or raw military 4-digit 1445 string with instantaneous enunciation update.
                    </p>
                  </div>
                </div>
              )}

              {/* Time Zone & Meridian Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-outline-variant/30">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
                    Source NATO Meridian / Time Zone
                  </label>
                  <select
                    value={sourceZone}
                    onChange={(e) => setSourceZone(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-2.5 text-xs font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    {NATO_ZONES.map((z) => (
                      <option key={z.letter} value={z.letter}>
                        {z.letter} - {z.name} (UTC{z.offset >= 0 ? '+' : ''}{z.offset})
                      </option>
                    ))}
                  </select>
                  <span className="text-[11px] text-on-surface-variant mt-1 block">
                    Defines DTG zone suffix (e.g., Z for Zulu / Greenwich).
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
                    Target Projection Meridian
                  </label>
                  <select
                    value={targetZone}
                    onChange={(e) => setTargetZone(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-2.5 text-xs font-semibold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    {NATO_ZONES.map((z) => (
                      <option key={z.letter} value={z.letter}>
                        {z.letter} - {z.name} (UTC{z.offset >= 0 ? '+' : ''}{z.offset})
                      </option>
                    ))}
                  </select>
                  <span className="text-[11px] text-on-surface-variant mt-1 block">
                    Instantly projects time into remote operational theater.
                  </span>
                </div>
              </div>

              {/* Date & Mission Tag */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-outline-variant/30">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
                    Date for Date-Time Group (DTG)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={dtgDate}
                      onChange={(e) => setDtgDate(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-2 text-xs font-data-mono text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                    <button
                      type="button"
                      onClick={() => setDtgDate(new Date().toISOString().split('T')[0])}
                      className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline-variant/40 transition-colors"
                    >
                      Today
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
                    Mission Tag / Log Identifier (Optional)
                  </label>
                  <input
                    type="text"
                    value={missionTag}
                    onChange={(e) => setMissionTag(e.target.value)}
                    placeholder="EVAC_SORTIE_ALPHA_09"
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-2 text-xs font-data-mono uppercase text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (conversionMode === '12to24') syncToMilitary();
                      else syncToCivilian(hour24, minute24);
                    }}
                    className="px-4 py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-semibold text-xs tracking-wide transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-base">sync</span>
                    Convert Time
                  </button>
                  <button
                    type="button"
                    onClick={loadCurrentLocalTime}
                    className="px-3 py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-on-surface text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-base">restart_alt</span>
                    Reset to Now
                  </button>
                </div>

                <div className="text-[11px] text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-primary">lock</span>
                  WASM In-Browser Engine • Zero Logs
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Telemetry Sidecar (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 sm:p-7 shadow-sm space-y-6">
              {/* Output Header */}
              <div className="flex items-center justify-between pb-4 border-b border-outline-variant/30">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-xl">satellite_alt</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                    Converted Output
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(milString + sourceZone, '24h')}
                  className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors inline-flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-xs">
                    {copiedKey === '24h' ? 'check' : 'content_copy'}
                  </span>
                  {copiedKey === '24h' ? 'Copied!' : 'Copy 24h'}
                </button>
              </div>

              {/* Big Digital Display */}
              <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/30 text-center relative overflow-hidden">
                <div className="text-[11px] uppercase tracking-widest font-semibold text-primary mb-1">
                  Standard 24-Hour Military Format
                </div>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl sm:text-6xl font-black font-data-mono text-on-surface tracking-tight">
                    {milString}
                  </span>
                  <span className="text-2xl sm:text-3xl font-bold font-data-mono text-primary">
                    {sourceZone}
                  </span>
                  <span className="text-xs font-bold font-data-mono text-on-surface-variant">
                    HOURS
                  </span>
                </div>

                {/* Phonetic & Spoken Guides */}
                <div className="mt-4 pt-3 border-t border-outline-variant/20 space-y-1.5 text-left">
                  <div className="flex items-start gap-2 text-xs">
                    <span className="font-semibold text-on-surface-variant min-w-[100px]">
                      Spoken Phrasing:
                    </span>
                    <span className="font-medium text-on-surface">&ldquo;{spokenVerbal}&rdquo;</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs">
                    <span className="font-semibold text-on-surface-variant min-w-[100px]">
                      Radio Phonetic:
                    </span>
                    <span className="font-data-mono text-primary font-semibold tracking-wide">
                      {radioPhonetic}
                    </span>
                  </div>
                </div>
              </div>

              {/* Secondary Equivalents Bento */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-surface-container-low rounded-lg p-3 border border-outline-variant/20">
                  <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider block">
                    12-Hour Civil Equivalent
                  </span>
                  <span className="text-lg font-bold font-data-mono text-on-surface mt-0.5 block">
                    {civilEquivalent}
                  </span>
                </div>
                <div className="bg-surface-container-low rounded-lg p-3 border border-outline-variant/20">
                  <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider block">
                    Greenwich UTC (Zulu)
                  </span>
                  <span className="text-lg font-bold font-data-mono text-primary mt-0.5 block">
                    {zuluString}
                  </span>
                </div>
              </div>

              {/* Target Zone Projection */}
              <div className="bg-surface-container-low rounded-lg p-3 border border-outline-variant/20 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider block">
                    Target: {tgtNato.letter} - {tgtNato.name} (UTC{tgtNato.offset >= 0 ? '+' : ''}{tgtNato.offset})
                  </span>
                  <span className="text-xs text-on-surface-variant line-clamp-1">
                    {tgtNato.regions}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold font-data-mono text-primary">
                    {targetProjection}
                  </span>
                </div>
              </div>

              {/* Standard Defense DTG Format */}
              <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-primary">badge</span>
                    Defense Date-Time Group (DTG)
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(dtgString, 'dtg')}
                    className="px-2 py-0.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface text-[11px] font-semibold transition-colors inline-flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-xs">
                      {copiedKey === 'dtg' ? 'check' : 'content_copy'}
                    </span>
                    {copiedKey === 'dtg' ? 'Copied!' : 'Copy DTG'}
                  </button>
                </div>
                <div className="bg-surface-container-lowest p-2.5 rounded-lg border border-outline-variant/40 font-data-mono font-bold text-sm text-primary tracking-wide break-all">
                  {dtgString}
                </div>
                <p className="text-[11px] text-on-surface-variant">
                  STANAG 2211 conforming message preamble string.
                </p>
              </div>

              {/* Radial 24-Hour Dial Visualization */}
              <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/30 text-center">
                <span className="text-xs font-bold text-on-surface uppercase tracking-wider block mb-3">
                  24-Hour Chrono Vector Dial
                </span>
                <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      className="stroke-outline-variant/30 fill-none"
                      strokeWidth="6"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      className="stroke-primary fill-none transition-all duration-300"
                      strokeWidth="6"
                      strokeDasharray="263.89"
                      strokeDashoffset={263.89 - (dialAngle / 360) * 263.89}
                      strokeLinecap="round"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="30"
                      className="stroke-outline-variant/20 fill-none"
                      strokeWidth="3"
                    />
                    <circle cx="50" cy="50" r="4" className="fill-primary" />
                    <line
                      x1="50"
                      y1="50"
                      x2={50 + 38 * Math.cos((dialAngle * Math.PI) / 180)}
                      y2={50 + 38 * Math.sin((dialAngle * Math.PI) / 180)}
                      className="stroke-primary"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xs font-bold font-data-mono text-on-surface">
                      {milString}
                    </span>
                    <span className="text-[10px] font-data-mono text-on-surface-variant">
                      {dialAngle.toFixed(1)}°
                    </span>
                  </div>
                </div>
                <div className="mt-2 flex justify-center items-center gap-4 text-[11px] text-on-surface-variant">
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-primary inline-block"></span> Outer: 13-24h
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-outline inline-block"></span> Inner: 01-12h
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Operational Theaters Grid */}
        <section className="space-y-4 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-1 text-xs font-bold text-primary uppercase tracking-wider">
                <span className="material-symbols-outlined text-sm">public</span>
                Real-Time Theater Command Synch
              </div>
              <h2 className="text-2xl font-bold text-on-surface font-headline-md">
                Global Operational Theaters
              </h2>
            </div>
            <p className="text-xs text-on-surface-variant max-w-md">
              Synchronous tactical timeline projection calculated across primary strategic defense corridors.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {theaterTimes.map((t) => (
              <div
                key={t.id}
                className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-4 shadow-xs hover:border-primary/40 transition-colors space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-primary font-data-mono tracking-wide">
                    {t.title}
                  </span>
                  <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">
                    {t.tag}
                  </span>
                </div>
                <div className="flex items-baseline justify-between pt-1">
                  <span className="text-2xl font-extrabold font-data-mono text-on-surface">
                    {t.mil}
                  </span>
                  <span className="text-xs font-semibold text-on-surface-variant font-data-mono">
                    {t.civ}
                  </span>
                </div>
                <div className="text-xs text-on-surface-variant border-t border-outline-variant/20 pt-2 line-clamp-1">
                  {t.loc}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* NATO 25-Letter Meridian Zone Directory */}
        <section className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider">
                <span className="material-symbols-outlined text-sm">explore</span>
                Nautical Longitudinal Sectors
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-on-surface">
                NATO 25-Letter Meridian Zone Directory
              </h2>
              <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
                Global nautical time divides the Earth into 24 standard 15° sectors. Note: <strong>Juliet (J)</strong> is intentionally omitted to represent local observer time (standardized under USNO &amp; DoD ACP 121 doctrine).
              </p>
            </div>

            {/* Search & Filter Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative min-w-[220px]">
                <input
                  type="text"
                  value={zoneSearch}
                  onChange={(e) => setZoneSearch(e.target.value)}
                  placeholder="Search zone, city, offset..."
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg pl-8 pr-3 py-2 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <span className="material-symbols-outlined text-sm text-on-surface-variant absolute left-2.5 top-1/2 -translate-y-1/2">
                  search
                </span>
              </div>
              <div className="inline-flex rounded-lg bg-surface-container p-1 border border-outline-variant/30 text-xs">
                {(['ALL', 'EAST', 'WEST'] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setZoneFilter(f)}
                    className={`px-2.5 py-1 rounded font-semibold transition-colors ${
                      zoneFilter === f
                        ? 'bg-primary text-on-primary shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {f === 'ALL' ? 'All 25' : f === 'EAST' ? 'East (A-M)' : 'West (N-Y)'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/40 text-on-surface-variant bg-surface-container-low/50">
                  <th className="py-2.5 px-3 font-semibold">Designator</th>
                  <th className="py-2.5 px-3 font-semibold">Phonetic Name</th>
                  <th className="py-2.5 px-3 font-semibold">UTC Offset</th>
                  <th className="py-2.5 px-3 font-semibold">Meridian Sector</th>
                  <th className="py-2.5 px-3 font-semibold">Key Global Installations & Cities</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 font-data-mono">
                {filteredZones.map((z) => (
                  <tr
                    key={z.letter}
                    className="hover:bg-surface-container-low/40 transition-colors"
                  >
                    <td className="py-2.5 px-3 font-bold text-primary text-sm">
                      {z.letter}
                    </td>
                    <td className="py-2.5 px-3 font-medium font-body-md text-on-surface">
                      {z.name}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-on-surface">
                      UTC{z.offset >= 0 ? `+${z.offset}` : z.offset}
                    </td>
                    <td className="py-2.5 px-3 text-on-surface-variant">
                      {z.meridian}
                    </td>
                    <td className="py-2.5 px-3 font-body-sm text-on-surface-variant max-w-xs">
                      {z.regions}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setTargetZone(z.letter);
                          window.scrollTo({ top: 180, behavior: 'smooth' });
                        }}
                        className="px-2 py-1 rounded bg-surface-container hover:bg-primary hover:text-on-primary text-[11px] font-semibold transition-colors font-body-md"
                      >
                        Project
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Hourly Correspondence Reference */}
        <section className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-on-surface">
              24-Hour Conversion Matrix &amp; Verbal Phrasing
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
              Standardized comparison table between 24-hour military notation, 12-hour civilian clocks, colloquial spoken terms, and tactical radio phonetics conforming to ISO 8601 and FAA AIM standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Morning Half (0000 to 1100) */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-primary border-b border-outline-variant/30 pb-1.5 flex items-center justify-between">
                <span>Morning Operations (0000 - 1100 Hours)</span>
                <span className="text-[10px] text-on-surface-variant font-normal">Ante Meridiem</span>
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="text-on-surface-variant font-semibold border-b border-outline-variant/20">
                      <th className="pb-1">24h Military</th>
                      <th className="pb-1">12h Civil</th>
                      <th className="pb-1">Verbal Readout</th>
                      <th className="pb-1">Radio Phonetic</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/15 font-data-mono">
                    {[
                      { m: '0000', c: '12:00 AM', v: 'Zero Hundred Hours', p: 'ZE-RO ZE-RO ZE-RO ZE-RO' },
                      { m: '0100', c: '1:00 AM', v: 'Zero One Hundred', p: 'ZE-RO WUN ZE-RO ZE-RO' },
                      { m: '0200', c: '2:00 AM', v: 'Zero Two Hundred', p: 'ZE-RO TOO ZE-RO ZE-RO' },
                      { m: '0300', c: '3:00 AM', v: 'Zero Three Hundred', p: 'ZE-RO TREE ZE-RO ZE-RO' },
                      { m: '0400', c: '4:00 AM', v: 'Zero Four Hundred', p: 'ZE-RO FOW-ER ZE-RO ZE-RO' },
                      { m: '0500', c: '5:00 AM', v: 'Zero Five Hundred', p: 'ZE-RO FIFE ZE-RO ZE-RO' },
                      { m: '0600', c: '6:00 AM', v: 'Zero Six Hundred', p: 'ZE-RO SIX ZE-RO ZE-RO' },
                      { m: '0700', c: '7:00 AM', v: 'Zero Seven Hundred', p: 'ZE-RO SEV-EN ZE-RO ZE-RO' },
                      { m: '0800', c: '8:00 AM', v: 'Zero Eight Hundred', p: 'ZE-RO AIT ZE-RO ZE-RO' },
                      { m: '0900', c: '9:00 AM', v: 'Zero Nine Hundred', p: 'ZE-RO NIN-ER ZE-RO ZE-RO' },
                      { m: '1000', c: '10:00 AM', v: 'Ten Hundred Hours', p: 'WUN ZE-RO ZE-RO ZE-RO' },
                      { m: '1100', c: '11:00 AM', v: 'Eleven Hundred', p: 'WUN WUN ZE-RO ZE-RO' },
                    ].map((row) => (
                      <tr key={row.m} className="hover:bg-surface-container-low/40">
                        <td className="py-1.5 font-bold text-primary">{row.m}</td>
                        <td className="py-1.5 text-on-surface">{row.c}</td>
                        <td className="py-1.5 font-body-sm text-on-surface">{row.v}</td>
                        <td className="py-1.5 text-[11px] text-on-surface-variant">{row.p}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Afternoon & Evening Half (1200 to 2300) */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-primary border-b border-outline-variant/30 pb-1.5 flex items-center justify-between">
                <span>Afternoon & Evening (1200 - 2300 Hours)</span>
                <span className="text-[10px] text-on-surface-variant font-normal">Post Meridiem (+12)</span>
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="text-on-surface-variant font-semibold border-b border-outline-variant/20">
                      <th className="pb-1">24h Military</th>
                      <th className="pb-1">12h Civil</th>
                      <th className="pb-1">Verbal Readout</th>
                      <th className="pb-1">Radio Phonetic</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/15 font-data-mono">
                    {[
                      { m: '1200', c: '12:00 PM', v: 'Twelve Hundred (Noon)', p: 'WUN TOO ZE-RO ZE-RO' },
                      { m: '1300', c: '1:00 PM', v: 'Thirteen Hundred', p: 'WUN TREE ZE-RO ZE-RO' },
                      { m: '1400', c: '2:00 PM', v: 'Fourteen Hundred', p: 'WUN FOW-ER ZE-RO ZE-RO' },
                      { m: '1500', c: '3:00 PM', v: 'Fifteen Hundred', p: 'WUN FIFE ZE-RO ZE-RO' },
                      { m: '1600', c: '4:00 PM', v: 'Sixteen Hundred', p: 'WUN SIX ZE-RO ZE-RO' },
                      { m: '1700', c: '5:00 PM', v: 'Seventeen Hundred', p: 'WUN SEV-EN ZE-RO ZE-RO' },
                      { m: '1800', c: '6:00 PM', v: 'Eighteen Hundred', p: 'WUN AIT ZE-RO ZE-RO' },
                      { m: '1900', c: '7:00 PM', v: 'Nineteen Hundred', p: 'WUN NIN-ER ZE-RO ZE-RO' },
                      { m: '2000', c: '8:00 PM', v: 'Twenty Hundred Hours', p: 'TOO ZE-RO ZE-RO ZE-RO' },
                      { m: '2100', c: '9:00 PM', v: 'Twenty-One Hundred', p: 'TOO WUN ZE-RO ZE-RO' },
                      { m: '2200', c: '10:00 PM', v: 'Twenty-Two Hundred', p: 'TOO TOO ZE-RO ZE-RO' },
                      { m: '2300', c: '11:00 PM', v: 'Twenty-Three Hundred', p: 'TOO TREE ZE-RO ZE-RO' },
                    ].map((row) => (
                      <tr key={row.m} className="hover:bg-surface-container-low/40">
                        <td className="py-1.5 font-bold text-primary">{row.m}</td>
                        <td className="py-1.5 text-on-surface">{row.c}</td>
                        <td className="py-1.5 font-body-sm text-on-surface">{row.v}</td>
                        <td className="py-1.5 text-[11px] text-on-surface-variant">{row.p}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Callout box */}
          <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 flex items-start gap-3">
            <span className="material-symbols-outlined text-primary text-xl mt-0.5">info</span>
            <div className="text-xs space-y-1">
              <strong className="text-on-surface font-semibold">The Mathematical Distinction: 0000 vs 2400</strong>
              <p className="text-on-surface-variant leading-relaxed">
                Under ISO 8601 and military operations, <strong>0000</strong> designates the very start of a calendar day (00:00:00), whereas <strong>2400</strong> is strictly used to designate the terminal instant of that day. In operational flight planning, logistics dispatch, and NATO message preambles, <strong>0000</strong> is always preferred to avoid scheduling rollover ambiguities.
              </p>
            </div>
          </div>
        </section>

        {/* Rules of 24-Hour & Defense Conversion */}
        <section className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-on-surface">
              Core Principles of Military &amp; Defense Timekeeping
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
              Master the foundational algorithms governing 24-hour conversion, leading zeros, and NATO Date-Time Groups (DTG).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/25 space-y-2">
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                <span className="material-symbols-outlined text-base">format_shapes</span>
                Rule #01: The 4-Digit String
              </div>
              <h3 className="font-bold text-on-surface text-sm">Eliminate Colons &amp; AM/PM</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Civilian time relies on colons and AM/PM indicators (e.g., 7:30 AM vs 7:30 PM). Military time collapses this into a single unambiguous 4-digit integer without punctuation (0730 vs 1930).
              </p>
              <div className="pt-2 border-t border-outline-variant/20 text-[11px] text-on-surface-variant font-medium">
                Standard: ISO 8601:2019 Specification
              </div>
            </div>

            <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/25 space-y-2">
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                <span className="material-symbols-outlined text-base">add_circle</span>
                Rule #02: The +12 Math for PM
              </div>
              <h3 className="font-bold text-on-surface text-sm">Add 12 to Post-Meridiem Hours</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                For any civilian time from 1:00 PM through 11:59 PM, add 12 to the hour value. For example, 4:15 PM becomes (4 + 12 = 16) → <strong>1615</strong>. Noon (12:00 PM) remains <strong>1200</strong>.
              </p>
              <div className="pt-2 border-t border-outline-variant/20 text-[11px] text-on-surface-variant font-medium">
                Standard: NIST Time Arithmetic Guidelines
              </div>
            </div>

            <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/25 space-y-2">
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                <span className="material-symbols-outlined text-base">remove_circle</span>
                Rule #03: The -12 Math for 24h &gt; 1200
              </div>
              <h3 className="font-bold text-on-surface text-sm">Reverse Subtract for Civilian PM</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                To reverse-engineer military notation greater than 1200 back into civilian time, subtract 12 from the first two digits. For instance, <strong>2145</strong> → 21 - 12 = 9 → <strong>9:45 PM</strong>.
              </p>
              <div className="pt-2 border-t border-outline-variant/20 text-[11px] text-on-surface-variant font-medium">
                Standard: NIST Civilian Time Translation
              </div>
            </div>

            <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/25 space-y-2">
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                <span className="material-symbols-outlined text-base">exposure_zero</span>
                Rule #04: Mandatory Leading Zeros
              </div>
              <h3 className="font-bold text-on-surface text-sm">Always Pad Morning Single Digits</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Single-digit morning hours from 1:00 AM to 9:59 AM must be preceded by a zero (e.g., 0530, 0915). A three-digit military time does not exist in defense or aviation registries.
              </p>
              <div className="pt-2 border-t border-outline-variant/20 text-[11px] text-on-surface-variant font-medium">
                Standard: USNO Astronomical Time Standard
              </div>
            </div>

            <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/25 space-y-2 lg:col-span-2">
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                <span className="material-symbols-outlined text-base">feed</span>
                Rule #05: STANAG 2211 DTG Anatomy
              </div>
              <h3 className="font-bold text-on-surface text-sm">Breakdown of the Date-Time Group String</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-data-mono text-center text-xs">
                <div className="bg-surface-container-lowest p-2 rounded border border-outline-variant/30">
                  <span className="text-primary font-bold block text-sm">19</span>
                  <span className="text-[10px] text-on-surface-variant">Day of Month</span>
                </div>
                <div className="bg-surface-container-lowest p-2 rounded border border-outline-variant/30">
                  <span className="text-primary font-bold block text-sm">1445</span>
                  <span className="text-[10px] text-on-surface-variant">4-Digit Time</span>
                </div>
                <div className="bg-surface-container-lowest p-2 rounded border border-outline-variant/30">
                  <span className="text-primary font-bold block text-sm">Z</span>
                  <span className="text-[10px] text-on-surface-variant">Zone Suffix</span>
                </div>
                <div className="bg-surface-container-lowest p-2 rounded border border-outline-variant/30">
                  <span className="text-primary font-bold block text-sm">SEP 26</span>
                  <span className="text-[10px] text-on-surface-variant">Month &amp; Year</span>
                </div>
              </div>
              <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between flex-wrap gap-2 text-[11px]">
                <span className="text-on-surface-variant">Conforms to ACP 121(I) communication orders across multinational coalition networks.</span>
                <span className="text-[11px] font-semibold text-primary">NATO STANAG 2211 &bull; DoD ACP 121(I)</span>
              </div>
            </div>
          </div>
        </section>

        {/* Real-World Applications */}
        <section className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-on-surface">
              Why Zero-Ambiguity Timekeeping Saves Lives
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
              Critical industries where eliminating AM/PM confusion prevents catastrophic operational failures.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: 'flight_takeoff',
                title: 'Commercial & Military Aviation',
                desc: 'Air traffic controllers, flight dispatchers, and pilots operate solely on Zulu time (UTC). Flight paths crossing multiple time zones require unanimous clearance times to prevent runway incursions and mid-air collisions.',
                source: 'FAA AIM § 4-2 & ICAO Annex 5',
              },
              {
                icon: 'local_hospital',
                title: 'Intensive Care & Trauma Nursing',
                desc: 'Medication administration schedules, intravenous titration rates, and surgical charting require 24-hour time to prevent lethal overdoses caused by misinterpreting 8:00 AM vs 8:00 PM orders.',
                source: 'WHO Patient Safety & TJC EHR Standards',
              },
              {
                icon: 'sailing',
                title: 'Maritime Shipping & Tidal Locks',
                desc: 'Container vessels navigating canal locks, port berths, and open waters rely on nautical GMT/UTC logs to synchronize with tidal tables, pilot boarding schedules, and GPS navigational beacons.',
                source: 'IMO SOLAS & USCG NAVCEN',
              },
              {
                icon: 'e911_emergency',
                title: '911 Dispatch & Emergency Response',
                desc: 'Computer-Aided Dispatch (CAD) systems record every emergency call, ambulance departure, and police response in 24-hour time to ensure legally binding, auditable court records.',
                source: 'APCO International CAD Telephony',
              },
              {
                icon: 'cloud_sync',
                title: 'Cloud Infrastructure & Cyber Defense',
                desc: 'Distributed server clusters, intrusion detection logs, and SIEM platforms align timestamp entries to UTC Zulu to trace cross-border cyber attacks, data breaches, and database transactions.',
                source: 'IETF RFC 3339 Date-Time Protocol',
              },
              {
                icon: 'rocket_launch',
                title: 'Orbital Launch & Deep Space Tracking',
                desc: 'NASA, ESA, and commercial space operators synchronize ground telemetry, satellite orbital passes, and payload deployment countdowns to fractional second UTC chronometers.',
                source: 'NASA Deep Space Network Standards',
              },
            ].map((card) => (
              <div
                key={card.title}
                className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/25 space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-xl">{card.icon}</span>
                  </div>
                  <h3 className="font-bold text-on-surface text-sm">{card.title}</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">{card.desc}</p>
                </div>
                <div className="pt-2 border-t border-outline-variant/20 text-[11px] font-semibold text-primary/80">
                  {card.source}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Technical Specifications Matrix */}
        <section className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-on-surface">
              System Comparison Matrix: 12h vs 24h vs Military vs Zulu
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
              Detailed technical specification differences between civilian, standard ISO, defense, and astronomical chronometry.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/40 bg-surface-container-low/50 text-on-surface-variant">
                  <th className="py-2.5 px-3 font-semibold">Parameter</th>
                  <th className="py-2.5 px-3 font-semibold">Civilian 12-Hour</th>
                  <th className="py-2.5 px-3 font-semibold">ISO 8601 (24-Hour)</th>
                  <th className="py-2.5 px-3 font-semibold">Military Standard (DoD)</th>
                  <th className="py-2.5 px-3 font-semibold">Universal (Zulu)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                <tr>
                  <td className="py-2.5 px-3 font-bold text-on-surface">Colon Separator</td>
                  <td className="py-2.5 px-3 font-data-mono">Required (e.g. 2:45)</td>
                  <td className="py-2.5 px-3 font-data-mono">Required (e.g. 14:45:00)</td>
                  <td className="py-2.5 px-3 font-data-mono text-primary font-bold">Omitted (e.g. 1445)</td>
                  <td className="py-2.5 px-3 font-data-mono">Omitted (e.g. 1445Z)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold text-on-surface">Morning Leading Zero</td>
                  <td className="py-2.5 px-3 text-on-surface-variant">Optional (8:00 AM)</td>
                  <td className="py-2.5 px-3 font-data-mono">Mandatory (08:00)</td>
                  <td className="py-2.5 px-3 font-data-mono text-primary font-bold">Mandatory (0800)</td>
                  <td className="py-2.5 px-3 font-data-mono">Mandatory (0800Z)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold text-on-surface">Meridiem Indicator</td>
                  <td className="py-2.5 px-3 text-primary font-semibold">AM / PM suffix</td>
                  <td className="py-2.5 px-3 text-on-surface-variant">None (24-hour cycle)</td>
                  <td className="py-2.5 px-3 text-on-surface-variant">None (24-hour cycle)</td>
                  <td className="py-2.5 px-3 text-on-surface-variant">None (24-hour cycle)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold text-on-surface">Time Zone Affix</td>
                  <td className="py-2.5 px-3 text-on-surface-variant">EST, PST, BST</td>
                  <td className="py-2.5 px-3 font-data-mono">+00:00 / -05:00</td>
                  <td className="py-2.5 px-3 font-data-mono text-primary font-bold">NATO Letter (A-Y, Z)</td>
                  <td className="py-2.5 px-3 font-data-mono text-primary font-bold">Strictly &apos;Z&apos;</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold text-on-surface">Midnight Representation</td>
                  <td className="py-2.5 px-3 font-data-mono">12:00 AM</td>
                  <td className="py-2.5 px-3 font-data-mono">00:00 (or 24:00 end)</td>
                  <td className="py-2.5 px-3 font-data-mono text-primary font-bold">0000 Hours</td>
                  <td className="py-2.5 px-3 font-data-mono">0000Z</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold text-on-surface">Radio Spoken Style</td>
                  <td className="py-2.5 px-3 text-on-surface-variant">&ldquo;Two forty-five PM&rdquo;</td>
                  <td className="py-2.5 px-3 text-on-surface-variant">&ldquo;Fourteen forty-five&rdquo;</td>
                  <td className="py-2.5 px-3 text-primary font-bold">&ldquo;Fourteen Forty-Five Hours&rdquo;</td>
                  <td className="py-2.5 px-3 font-data-mono">&ldquo;WUN FOW-ER FOW-ER FIFE ZULU&rdquo;</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Trusted Scientific Sources & Defense References - Exactly 4 Verified External Links */}
        <section className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl">verified_user</span>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-on-surface">
                Authoritative Standards &amp; Timekeeping References
              </h2>
              <p className="text-xs sm:text-sm text-on-surface-variant">
                Verified public documentation and educational reference guides governing 24-hour, atomic, and military chronometry.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {[
              {
                pub: 'National Institute of Standards and Technology (NIST)',
                doc: 'NIST Time and Frequency Division (Official US Time & UTC)',
                href: 'https://www.nist.gov/pml/time-and-frequency-division',
                desc: 'Official United States civilian time reference maintaining synchronization with atomic clocks, UTC time broadcasts, and international metrology standards.',
              },
              {
                pub: 'International Standards Reference',
                doc: 'ISO 8601: Date and Time Representation (24-Hour Standard)',
                href: 'https://en.wikipedia.org/wiki/ISO_8601',
                desc: 'Comprehensive public reference for the global 24-hour time format, zero-padded integers, UTC designators, and ISO digital timestamps.',
              },
              {
                pub: 'Military Chronometry Guide',
                doc: '24-Hour Clock & Military Timekeeping Operational Conventions',
                href: 'https://en.wikipedia.org/wiki/24-hour_clock',
                desc: 'Detailed breakdown of military time history, conversion algorithms, midnight notations (0000 vs 2400), and civilian comparisons.',
              },
              {
                pub: 'NATO & Tactical Communications',
                doc: 'Directory of Military Time Zones & Phonetic DTG Descriptors',
                href: 'https://en.wikipedia.org/wiki/List_of_military_time_zones',
                desc: 'Complete directory of 25 nautical letter time zones from Alpha to Zulu, longitudinal offsets, and Date-Time Group (DTG) military protocol.',
              },
            ].map((ref) => (
              <a
                key={ref.doc}
                href={ref.href}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/25 hover:border-primary/40 hover:bg-surface-container transition-all group flex flex-col justify-between space-y-2"
              >
                <div>
                  <span className="text-[11px] font-bold text-primary block">{ref.pub}</span>
                  <strong className="text-on-surface font-semibold group-hover:text-primary transition-colors block mt-0.5">
                    {ref.doc}
                  </strong>
                  <p className="text-on-surface-variant text-[11px] mt-1 leading-relaxed">
                    {ref.desc}
                  </p>
                </div>
                <div className="pt-2 flex items-center gap-1 text-[11px] font-semibold text-primary">
                  <span>Open Reference Page</span>
                  <span className="material-symbols-outlined text-xs">arrow_outward</span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Knowledge Base: FAQ */}
        <section className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-on-surface">
              Frequently Asked Questions: Tactical & 24-Hour Time
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
              Authoritative answers to common questions about military notation, phonetic enunciation, and Date-Time Groups.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: 'What is the difference between military time and 24-hour time?',
                a: 'Both systems operate on a 24-hour cycle starting at 00:00 midnight and ending at 23:59. However, military time strips out the colon separator and uses a solid 4-digit number (e.g., 0830 or 1745), often accompanied by a NATO zone suffix (such as 1745Z for Greenwich Zulu). Standard international 24-hour time (ISO 8601) utilizes a colon delimiter (e.g., 17:45:00) without zone letters.',
              },
              {
                q: 'Why do armed forces, aviators, and space agencies use "Zulu" time?',
                a: 'Zulu designates Greenwich Coordinated Universal Time (UTC+0), identified by the nautical letter suffix "Z" (Zulu in the NATO phonetic alphabet). Operating on a unified reference meridian eliminates life-threatening errors caused by local daylight saving shifts, provincial time boundaries, and cross-border tactical operations.',
              },
              {
                q: 'Why is the letter "J" (Juliet) skipped in the NATO time zone sequence?',
                a: 'In the international 25-letter nautical time zone system, the 24 longitudinal 15-degree sectors are assigned letters A through M (omitting J) for positive east offsets, and N through Y for negative west offsets. The letter J (Juliet) is intentionally excluded from fixed longitudinal assignments and is reserved strictly to designate the local observer’s current civil time.',
              },
              {
                q: 'How do you pronounce military numbers over tactical two-way radio?',
                a: 'NATO and ICAO communication standards prescribe specific acoustic pronunciations to avoid misunderstandings through static and noise: 0 is ZE-RO, 1 is WUN, 2 is TOO, 3 is TREE, 4 is FOW-ER, 5 is FIFE, 6 is SIX, 7 is SEV-EN, 8 is AIT, and 9 is NIN-ER. For example, 1445 is spoken as "WUN - FOW-ER - FOW-ER - FIFE".',
              },
              {
                q: 'Is midnight written as 0000 or 2400?',
                a: 'In military operations and strict time arithmetic, 0000 indicates the exact beginning of the calendar day, while 2400 designates the theoretical termination of that day. In current DoD message handling and ISO 8601:2019 standards, 0000 is strongly preferred for operational clarity to eliminate ambiguous cross-day scheduling.',
              },
              {
                q: 'What is a Date-Time Group (DTG) and how is it constructed?',
                a: 'A Date-Time Group (DTG) is an international military standard (STANAG 2211 / ACP 121) used as a message header. It consists of six digits (two for the day of the month, four for the 24-hour time), followed by the single-letter time zone indicator, a three-letter month abbreviation, and two digits for the year (e.g., 191445Z SEP 26).',
              },
              {
                q: 'What is the quickest mental math trick to convert PM civilian hours?',
                a: 'Simply add 12 to any afternoon or evening hour: 1:00 PM becomes (1 + 12 = 13) → 1300; 6:30 PM becomes (6 + 12 = 18) → 1830. To convert military back to civilian, subtract 12 from any value 1300 or greater (e.g., 2000 - 1200 = 8:00 PM).',
              },
              {
                q: 'Do civilian hospitals and health networks mandate 24-hour time?',
                a: 'Yes. The Joint Commission and the World Health Organization strongly encourage 24-hour timekeeping in electronic health records (EHR) and medication administration records (MAR) because mistaking "8:00 AM" for "8:00 PM" on insulin, anticoagulant, or opioid orders has historically caused catastrophic medical errors.',
              },
            ].map((faq, idx) => (
              <div
                key={faq.q}
                className="bg-surface-container-low rounded-xl border border-outline-variant/30 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-semibold text-sm text-on-surface hover:text-primary transition-colors"
                >
                  <span>{faq.q}</span>
                  <span
                    className="material-symbols-outlined text-primary transition-transform duration-200"
                    style={{ transform: openFaq === idx ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  >
                    expand_more
                  </span>
                </button>
                {openFaq === idx && (
                  <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-on-surface-variant leading-relaxed border-t border-outline-variant/15 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Complementary Time & Chronology Tools */}
        <section className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-on-surface">
                Complementary Time & Chronology Tools
              </h2>
              <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
                Explore more high-precision time, date, and schedule calculation utilities from SolveIt.
              </p>
            </div>
            <Link
              href="/time-date"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              All Time Tools
              <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: 'Time & Date Hub',
                badge: 'Directory',
                desc: 'Complete suite of age, duration, business day, and holiday tools.',
                href: '/time-date',
                icon: 'schedule',
              },
              {
                title: 'Days Between Dates',
                badge: 'Delta Calc',
                desc: 'Calculate exact elapsed days, weeks, months, and leap days.',
                href: '/time-date/days-between-dates',
                icon: 'calendar_today',
              },
              {
                title: 'Add & Subtract Time',
                badge: 'Offset Matrix',
                desc: 'Add or subtract hours, minutes, and work shifts from dates.',
                href: '/time-date/add-subtract-time',
                icon: 'more_time',
              },
              {
                title: 'Work Hours & Timesheet',
                badge: 'Payroll',
                desc: 'Track shift punches, overtime, and break deductions cleanly.',
                href: '/time-date/work-hours',
                icon: 'punch_clock',
              },
            ].map((tool) => (
              <Link
                key={tool.title}
                href={tool.href}
                className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/30 hover:border-primary/40 hover:shadow-xs transition-all space-y-2 block group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                    <span className="material-symbols-outlined text-base">{tool.icon}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-data-mono">
                    {tool.badge}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors">
                  {tool.title}
                </h3>
                <p className="text-xs text-on-surface-variant line-clamp-2">
                  {tool.desc}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
