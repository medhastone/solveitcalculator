'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';

export default function BirthdayTrackerClient() {
  const [mounted, setMounted] = useState(false);
  const [dob, setDob] = useState('1998-05-18');
  const [tob, setTob] = useState('08:42');
  const [targetDate, setTargetDate] = useState('');
  const [copyFeedback, setCopyFeedback] = useState('');

  // Live real-time clock pulse
  const [liveNow, setLiveNow] = useState<Date | null>(null);

  useEffect(() => {
    setMounted(true);
    const now = new Date();
    setLiveNow(now);
    setTargetDate(now.toISOString().split('T')[0]);

    const intv = setInterval(() => {
      setLiveNow(new Date());
    }, 1000);

    return () => clearInterval(intv);
  }, []);

  // Quick Preset handler
  const loadPreset = useCallback((presetDob: string, presetTob: string = '00:00') => {
    setDob(presetDob);
    setTob(presetTob);
    if (!targetDate) {
      setTargetDate(new Date().toISOString().split('T')[0]);
    }
  }, [targetDate]);

  const resetForm = useCallback(() => {
    setDob('1998-05-18');
    setTob('08:42');
    setTargetDate(new Date().toISOString().split('T')[0]);
  }, []);

  // Compute all chronological & astronomical metrics
  const telemetry = useMemo(() => {
    if (!mounted) {
      return null;
    }

    const d1 = new Date(`${dob}T${tob || '00:00'}:00`);
    const currentClock = liveNow || new Date();
    
    // If targetDate is empty or matches today, evaluate against live current time. Otherwise evaluate at targetDate at specified time
    const todayStr = currentClock.toISOString().split('T')[0];
    let d2: Date;
    if (!targetDate || targetDate === todayStr) {
      d2 = currentClock;
    } else {
      d2 = new Date(`${targetDate}T${tob || '12:00'}:00`);
    }

    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
      return null;
    }

    const diffMs = Math.max(0, d2.getTime() - d1.getTime());
    const tDays = Math.floor(diffMs / 86400000);
    const totalHours = Math.floor(diffMs / 3600000);

    // Tropical Solar orbits (365.24219 days per orbit)
    const orbits = diffMs / (365.24219 * 86400000);
    const completedOrbits = Math.floor(orbits);
    const orbitProgressPct = Math.max(0, Math.min(100, (orbits - completedOrbits) * 100));

    // Exact Age calculation (Years, Months, Days, Hours, Minutes, Seconds)
    let y = d2.getFullYear() - d1.getFullYear();
    let m = d2.getMonth() - d1.getMonth();
    let d = d2.getDate() - d1.getDate();

    if (d < 0) {
      m--;
      const prevMonthDays = new Date(d2.getFullYear(), d2.getMonth(), 0).getDate();
      d += prevMonthDays;
    }
    if (m < 0) {
      y--;
      m += 12;
    }

    const exactAgeStr = `${Math.max(0, y)}y ${Math.max(0, m)}m ${Math.max(0, d)}d`;

    // Next Birthday Calculation
    let nextBday = new Date(d2.getFullYear(), d1.getMonth(), d1.getDate(), d1.getHours(), d1.getMinutes(), 0);
    if (nextBday.getTime() <= d2.getTime()) {
      nextBday.setFullYear(d2.getFullYear() + 1);
    }
    const lastBday = new Date(nextBday.getFullYear() - 1, d1.getMonth(), d1.getDate());

    const msLeft = Math.max(0, nextBday.getTime() - d2.getTime());
    const dLeft = Math.floor(msLeft / 86400000);
    const hLeft = Math.floor((msLeft % 86400000) / 3600000);
    const mLeft = Math.floor((msLeft % 3600000) / 60000);
    const sLeft = Math.floor((msLeft % 60000) / 1000);

    const tickerStr = `${dLeft}d : ${String(hLeft).padStart(2, '0')}h : ${String(mLeft).padStart(2, '0')}m : ${String(sLeft).padStart(2, '0')}s`;
    const remWeeks = (dLeft / 7).toFixed(1);
    const remMonths = (dLeft / 30.437).toFixed(1);

    // Half-birthday
    const halfB = new Date(d1.getFullYear(), d1.getMonth() + 6, d1.getDate());
    const halfBdayStr = halfB.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    // Next Ingress text formats
    const nextBdayDateStr = nextBday.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const nextBdayWeekday = nextBday.toLocaleDateString('en-US', { weekday: 'long' });
    const turningAge = nextBday.getFullYear() - d1.getFullYear();

    const lastBdayFormatted = lastBday.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const nextBdayFormatted = nextBday.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    // Formatted DOB string
    const birthWeekday = d1.toLocaleDateString('en-US', { weekday: 'long' });
    const birthDateFormatted = d1.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const birthTimeFormatted = d1.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const dobMonthYear = d1.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    // Distance in Space (~29.78 km/s orbital speed)
    const distKm = (diffMs / 1000) * 29.78;
    const distanceTraversed = (distKm / 1000000000).toFixed(2) + 'B';

    // Heartbeats & Respiration
    const heartBeats = ((diffMs / 60000) * 70 / 1000000).toFixed(1) + 'M';
    const breaths = ((diffMs / 60000) * 17 / 1000000).toFixed(1) + 'M';
    const sleepDays = Math.floor(tDays / 3).toLocaleString();
    const moons = (tDays / 29.53059).toFixed(1);

    // Actuarial life expectancy (78.5 years benchmark)
    const currentYearsAge = tDays / 365.2425;
    const lifePct = Math.min(100, Math.max(0, (currentYearsAge / 78.5) * 100));

    // Western Zodiac
    const month = d1.getMonth() + 1;
    const day = d1.getDate();
    let zName = "", zIcon = "", zDesc = "";
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) { zName="Aries"; zIcon="♈"; zDesc="Cardinal Fire sign. Ruled by Mars. Action-oriented, pioneering, and dynamic initiative."; }
    else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) { zName="Taurus"; zIcon="♉"; zDesc="Fixed Earth sign. Ruled by Venus. Grounded, sensorial, deterministic stability and perseverance."; }
    else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) { zName="Gemini"; zIcon="♊"; zDesc="Mutable Air sign. Ruled by Mercury. Adaptable, communicative, cerebral, and curious."; }
    else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) { zName="Cancer"; zIcon="♋"; zDesc="Cardinal Water sign. Ruled by the Moon. Nurturing, intuitive, protective, and empathic."; }
    else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) { zName="Leo"; zIcon="♌"; zDesc="Fixed Fire sign. Ruled by the Sun. Bold, charismatic, luminous, and creative."; }
    else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) { zName="Virgo"; zIcon="♍"; zDesc="Mutable Earth sign. Ruled by Mercury. Analytical, practical, precise, and methodical."; }
    else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) { zName="Libra"; zIcon="♎"; zDesc="Cardinal Air sign. Ruled by Venus. Diplomatic, harmonious, aesthetic, and balanced."; }
    else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) { zName="Scorpio"; zIcon="♏"; zDesc="Fixed Water sign. Ruled by Pluto/Mars. Intense, transformative, acute, and magnetic."; }
    else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) { zName="Sagittarius"; zIcon="♐"; zDesc="Mutable Fire sign. Ruled by Jupiter. Adventurous, philosophical, expansive, and optimistic."; }
    else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) { zName="Capricorn"; zIcon="♑"; zDesc="Cardinal Earth sign. Ruled by Saturn. Disciplined, ambitious, structured, and enduring."; }
    else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) { zName="Aquarius"; zIcon="♒"; zDesc="Fixed Air sign. Ruled by Uranus/Saturn. Innovative, eccentric, visionary, and humanitarian."; }
    else { zName="Pisces"; zIcon="♓"; zDesc="Mutable Water sign. Ruled by Neptune/Jupiter. Empathetic, artistic, mystical, and boundless."; }

    // Chinese Zodiac
    const chineseAnimals = ["Monkey", "Rooster", "Dog", "Pig", "Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat"];
    const cZodiac = chineseAnimals[d1.getFullYear() % 12];

    // Birthstone & Flower
    const birthstones = ["Garnet", "Amethyst", "Aquamarine", "Diamond", "Emerald", "Pearl", "Ruby", "Peridot", "Sapphire", "Opal", "Topaz", "Turquoise"];
    const bStone = birthstones[d1.getMonth()];

    const flowers = ["Carnation", "Violet", "Daffodil", "Daisy", "Lily of the Valley", "Rose", "Larkspur", "Gladiolus", "Aster", "Marigold", "Chrysanthemum", "Narcissus"];
    const bFlower = flowers[d1.getMonth()];

    const seasons = ["Winter", "Winter", "Spring", "Spring", "Spring", "Summer", "Summer", "Summer", "Autumn", "Autumn", "Autumn", "Winter"];
    const bSeason = seasons[d1.getMonth()];

    // Generation
    const birthYear = d1.getFullYear();
    let genName = 'Generation Z';
    let genSpan = '1997–2012';
    if (birthYear >= 2013) { genName = 'Generation Alpha'; genSpan = '2013–Present'; }
    else if (birthYear >= 1997) { genName = 'Generation Z'; genSpan = '1997–2012'; }
    else if (birthYear >= 1981) { genName = 'Millennials (Gen Y)'; genSpan = '1981–1996'; }
    else if (birthYear >= 1965) { genName = 'Generation X'; genSpan = '1965–1980'; }
    else if (birthYear >= 1946) { genName = 'Baby Boomers'; genSpan = '1946–1964'; }
    else if (birthYear >= 1928) { genName = 'Silent Generation'; genSpan = '1928–1945'; }
    else { genName = 'Greatest Generation'; genSpan = '1901–1927'; }

    // Coordinates on orbital diagram
    const getCoords = (date: Date) => {
      const year = date.getFullYear();
      let mar20 = new Date(year, 2, 20);
      if (date < mar20) mar20 = new Date(year - 1, 2, 20);
      const diffDays = (date.getTime() - mar20.getTime()) / 86400000;
      const fraction = (diffDays % 365.2425) / 365.2425;
      const angle = fraction * 2 * Math.PI;
      const cx = 250, cy = 250, rx = 190, ry = 160;
      const x = cx + rx * Math.cos(angle);
      const y = cy - ry * Math.sin(angle);
      return { x, y, angle };
    };

    const birthCoords = getCoords(d1);
    const targetCoords = getCoords(d2);

    // Milestones List
    const milestones = [
      {
        title: '10,000 Days on Earth',
        targetDays: 10000,
        reached: tDays >= 10000,
        date: new Date(d1.getTime() + 10000 * 86400000),
        daysRemaining: Math.max(0, 10000 - tDays),
      },
      {
        title: '1 Billion Seconds Lived',
        targetDays: Math.floor(1000000000 / 86400),
        reached: diffMs >= 1000000000000,
        date: new Date(d1.getTime() + 1000000000000),
        daysRemaining: Math.max(0, Math.floor((1000000000000 - diffMs) / 86400000)),
      },
      {
        title: '15,000 Days on Earth',
        targetDays: 15000,
        reached: tDays >= 15000,
        date: new Date(d1.getTime() + 15000 * 86400000),
        daysRemaining: Math.max(0, 15000 - tDays),
      },
      {
        title: '30th Solar Orbit (Saturn Return)',
        targetDays: Math.floor(30 * 365.24219),
        reached: completedOrbits >= 30,
        date: new Date(d1.getFullYear() + 30, d1.getMonth(), d1.getDate()),
        daysRemaining: Math.max(0, Math.ceil((new Date(d1.getFullYear() + 30, d1.getMonth(), d1.getDate()).getTime() - d2.getTime()) / 86400000)),
      },
      {
        title: '20,000 Days on Earth',
        targetDays: 20000,
        reached: tDays >= 20000,
        date: new Date(d1.getTime() + 20000 * 86400000),
        daysRemaining: Math.max(0, 20000 - tDays),
      },
      {
        title: '50th Solar Orbit (Golden Jubilee)',
        targetDays: Math.floor(50 * 365.24219),
        reached: completedOrbits >= 50,
        date: new Date(d1.getFullYear() + 50, d1.getMonth(), d1.getDate()),
        daysRemaining: Math.max(0, Math.ceil((new Date(d1.getFullYear() + 50, d1.getMonth(), d1.getDate()).getTime() - d2.getTime()) / 86400000)),
      },
    ];

    // Protocol Countdown Sequence
    const protocols = [
      { stage: 'T-30 Days', title: 'Conceptual Calibration', desc: `Lock in birthday themes, wishlists, and travel itineraries for ${nextBdayFormatted}.`, icon: 'palette' },
      { stage: 'T-14 Days', title: 'Cohort Ingress Invitations', desc: 'Distribute event invitations and confirm reservation parameters.', icon: 'forward_to_inbox' },
      { stage: 'T-7 Days', title: 'Solar Return Preparations', desc: 'Secure catering, celebratory provisions, and reflective journaling.', icon: 'celebration' },
      { stage: 'T-1 Day', title: 'Pre-Ingress Eve Solstice', desc: 'Quiet reflection on the closing hours of your current solar orbit.', icon: 'nightlight' },
      { stage: 'T-0 Day', title: `Solar Orbit ${completedOrbits + 1} Nexus`, desc: `Celebrate the exact moment of solar return! Welcome to orbit ${completedOrbits + 1}!`, icon: 'cake' },
    ];

    return {
      tDays,
      totalHours,
      completedOrbits,
      orbitProgressPct,
      exactAgeStr,
      tickerStr,
      dLeft,
      remWeeks,
      remMonths,
      halfBdayStr,
      nextBdayDateStr,
      nextBdayWeekday,
      turningAge,
      lastBdayFormatted,
      nextBdayFormatted,
      birthWeekday,
      birthDateFormatted,
      birthTimeFormatted,
      dobMonthYear,
      distanceTraversed,
      heartBeats,
      breaths,
      sleepDays,
      moons,
      lifePct,
      currentYearsAge,
      zName,
      zIcon,
      zDesc,
      cZodiac,
      bStone,
      bFlower,
      bSeason,
      genName,
      genSpan,
      birthCoords,
      targetCoords,
      milestones,
      protocols,
    };
  }, [mounted, dob, tob, targetDate, liveNow]);

  const copyTelemetry = useCallback(() => {
    if (!telemetry) return;
    const text = `🌟 Solar Orbit & Birthday Telemetry 🌟
• Exact Age: ${telemetry.exactAgeStr}
• Born: ${telemetry.birthWeekday}, ${telemetry.birthDateFormatted} at ${telemetry.birthTimeFormatted}
• Solar Orbits Completed: ${telemetry.completedOrbits} (${telemetry.orbitProgressPct.toFixed(1)}% along orbit #${telemetry.completedOrbits + 1})
• Next Birthday: ${telemetry.nextBdayDateStr} (${telemetry.nextBdayWeekday} - Turning ${telemetry.turningAge})
• Countdown: ${telemetry.tickerStr}
• Total Space Traversed: ~${telemetry.distanceTraversed} km
• Synodic Moons: ${telemetry.moons} | Heartbeats: ~${telemetry.heartBeats}`;

    navigator.clipboard.writeText(text).then(() => {
      setCopyFeedback('Telemetry Copied!');
      setTimeout(() => setCopyFeedback(''), 3000);
    });
  }, [telemetry]);

  if (!mounted || !telemetry) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-on-surface-variant font-data-mono">
        <span className="material-symbols-outlined text-[36px] animate-spin text-primary mb-3">progress_activity</span>
        <span>Initializing Heliocentric Telemetry...</span>
      </div>
    );
  }

  const largeArc = telemetry.orbitProgressPct > 50 ? 1 : 0;
  const orbitArcPath = `M ${telemetry.birthCoords.x} ${telemetry.birthCoords.y} A 190 160 0 ${largeArc} 0 ${telemetry.targetCoords.x} ${telemetry.targetCoords.y}`;
  const earthTransform = `translate(${telemetry.targetCoords.x}, ${telemetry.targetCoords.y})`;

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface min-h-screen flex flex-col">
      
      <main className="w-full pt-16 bg-surface flex-1">
        <div className="flex flex-col w-full">
          {/* SECTION 1: Breadcrumbs & Meta bar */}
          <div className="w-full bg-surface-container-lowest/80 backdrop-blur-md shadow-sm border-b border-outline-variant/15">
        <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-sm text-on-surface-variant text-body-sm">
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 flex-wrap">
              <Link className="hover:text-primary transition-colors" href="/">Home</Link>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <Link className="hover:text-primary transition-colors" href="/time-date">Time &amp; Date</Link>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="font-semibold text-on-surface">Birthday Tracker &amp; Solar Orbit</span>
            </nav>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container font-label-caps text-label-caps text-on-surface-variant">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
                Astronomical Ephemeris J2000.0
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container font-label-caps text-label-caps text-on-surface-variant">
                ☀️ 1 Orbit = 365.24219d
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-high font-label-caps text-label-caps text-secondary font-semibold">
                <span className="material-symbols-outlined text-[13px]">lock</span>
                100% In-Browser Private
              </span>
            </div>
          </div>
          {/* Module Switcher Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-space-sm no-scrollbar">
            <a className="shrink-0 px-3.5 py-1.5 rounded-lg bg-primary-container text-on-primary-container font-semibold text-body-sm shadow-sm" href="#workbench">Birthday Tracker</a>
            <a className="shrink-0 px-3.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant text-body-sm transition-colors" href="#engine-age">Age Engine</a>
            <a className="shrink-0 px-3.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant text-body-sm transition-colors" href="#orbit-viz">Solar Orbit Matrix</a>
            <a className="shrink-0 px-3.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant text-body-sm transition-colors" href="#bio-insights">Biometric Insights</a>
            <a className="shrink-0 px-3.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant text-body-sm transition-colors" href="#celestial-grid">Zodiac &amp; Celestial</a>
            <a className="shrink-0 px-3.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant text-body-sm transition-colors" href="#milestones-radar">Milestone Radar</a>
          </div>
        </div>
      </div>

      {/* SECTION 2: Hero Header */}
      <div className="w-full relative overflow-hidden py-space-xl lg:py-space-2xl">
        <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface-container-high text-primary font-label-caps text-label-caps mb-space-sm shadow-sm">
              <span className="material-symbols-outlined text-[16px] text-primary">all_inclusive</span>
              HELIOCENTRIC TEMPORAL METROLOGY V4.2
            </div>
            <h1 className="font-display-hero text-display-hero text-on-surface tracking-tight mb-space-sm">
              Birthday Tracker &amp; <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Solar Orbit</span> Countdown
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mb-space-lg">
              Track deterministic countdowns to your next birthday, calculate completed solar orbits around the Sun, and unveil biological, astronomical, and generational milestones with sub-second accuracy.
            </p>
            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-x-space-md gap-y-space-xs text-body-sm text-on-surface-variant">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                <span>Accurate Leap-Year Aware</span>
              </div>
              <span className="text-outline-variant">•</span>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary text-[18px]">shield</span>
                <span>100% In-Browser Private</span>
              </div>
              <span className="text-outline-variant">•</span>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[18px]">bolt</span>
                <span>Sub-0.02s Calculation</span>
              </div>
              <span className="text-outline-variant">•</span>
              <div className="flex items-center gap-1.5 font-data-mono text-[12px] text-outline">
                IAU &amp; RFC 3339 Compliant
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: Main Calculator Workbench */}
      <section className="w-full pb-space-2xl" id="workbench">
        <div className="max-w-max-width-calculator mx-auto px-gutter-mobile lg:px-gutter-desktop">
          <div className="bg-surface-container-lowest rounded-xl p-space-md md:p-space-xl shadow-xl relative overflow-hidden border border-outline-variant/20">
            <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-primary/5 blur-3xl pointer-events-none"></div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm mb-space-lg">
              <div>
                <span className="font-label-caps text-label-caps text-primary tracking-wider uppercase font-bold">Chrono Parameters</span>
                <h2 className="font-headline-md text-headline-md text-on-surface">Input Natal Coordinates</h2>
              </div>
              {/* Quick Presets */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <button onClick={() => loadPreset('1995-06-15', '14:30')} className="px-2.5 py-1 text-body-sm rounded bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors cursor-pointer" type="button">Millennial (1995)</button>
                <button onClick={() => loadPreset('2000-01-01', '00:00')} className="px-2.5 py-1 text-body-sm rounded bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors cursor-pointer" type="button">Gen Z (2000)</button>
                <button onClick={() => loadPreset('1975-10-12', '06:15')} className="px-2.5 py-1 text-body-sm rounded bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors cursor-pointer" type="button">Gen X (1975)</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md mb-space-lg">
              {/* Date of Birth */}
              <div className="flex flex-col gap-1.5">
                <label className="font-label-caps text-label-caps text-on-surface-variant flex items-center justify-between" htmlFor="input-dob">
                  <span>Date of Birth</span>
                  <span className="text-primary font-bold">*REQUIRED</span>
                </label>
                <div className="relative">
                  <input
                    className="w-full bg-surface-container-low text-on-surface font-data-mono text-data-mono px-3 py-2.5 rounded-lg shadow-sm focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 transition-all border border-outline-variant/20"
                    id="input-dob"
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                  />
                </div>
                <span className="text-[12px] text-outline">Gregorian standard (YYYY-MM-DD)</span>
              </div>

              {/* Time of Birth */}
              <div className="flex flex-col gap-1.5">
                <label className="font-label-caps text-label-caps text-on-surface-variant flex items-center justify-between" htmlFor="input-tob">
                  <span>Time of Birth</span>
                  <span className="text-outline">Sub-hour precision</span>
                </label>
                <input
                  className="w-full bg-surface-container-low text-on-surface font-data-mono text-data-mono px-3 py-2.5 rounded-lg shadow-sm focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 transition-all border border-outline-variant/20"
                  id="input-tob"
                  type="time"
                  value={tob}
                  onChange={(e) => setTob(e.target.value)}
                />
                <span className="text-[12px] text-outline">Local solar orbital time</span>
              </div>

              {/* Target Epoch */}
              <div className="flex flex-col gap-1.5">
                <label className="font-label-caps text-label-caps text-on-surface-variant flex items-center justify-between" htmlFor="input-target">
                  <span>Evaluation Epoch</span>
                  <span className="text-secondary font-semibold">Today (Live)</span>
                </label>
                <input
                  className="w-full bg-surface-container-low text-on-surface font-data-mono text-data-mono px-3 py-2.5 rounded-lg shadow-sm focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 transition-all border border-outline-variant/20"
                  id="input-target"
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                />
                <span className="text-[12px] text-outline">Reference comparison frame</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-space-sm pt-space-sm border-t border-outline-variant/15">
              <div className="flex items-center gap-space-xs">
                <button
                  onClick={() => {
                    const el = document.getElementById('engine-age');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-5 py-2.5 rounded-lg bg-primary-container text-on-primary-container hover:bg-primary font-semibold text-body-md shadow-md active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
                  id="btn-compute"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">bolt</span>
                  Compute Solar Telemetry
                </button>
                <button
                  onClick={resetForm}
                  className="px-4 py-2.5 rounded-lg bg-surface-container text-on-surface-variant hover:bg-surface-container-high font-medium text-body-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">restart_alt</span>
                  Reset
                </button>
              </div>
              <div className="flex items-center gap-space-xs">
                <button
                  onClick={copyTelemetry}
                  className="px-3.5 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface-variant text-body-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">share</span>
                  {copyFeedback || 'Share Matrix'}
                </button>
                <button
                  onClick={() => {
                    const json = JSON.stringify({ dob, tob, targetDate }, null, 2);
                    const blob = new Blob([json], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `natal-profile-${dob}.json`;
                    a.click();
                  }}
                  className="px-3.5 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface-variant text-body-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">bookmark_add</span>
                  Save Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: Solar Orbit & Core Chronological Dashboard */}
      <section className="w-full py-space-xl bg-surface-container-low" id="engine-age">
        <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-sm mb-space-lg">
            <div>
              <span className="font-label-caps text-label-caps text-primary tracking-widest uppercase font-bold">Chronological Telemetry</span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface">Orbital Journey &amp; Exact Age</h2>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={copyTelemetry} className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface-variant hover:text-primary font-medium text-body-sm shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-[16px]">content_copy</span>
                {copyFeedback || 'Copy Output'}
              </button>
              <button onClick={() => window.print()} className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface-variant hover:text-primary font-medium text-body-sm shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-[16px]">print</span>
                Print Card
              </button>
            </div>
          </div>

          {/* Bento Grid for Results */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md">
            {/* Main Primary Card (7 cols) */}
            <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl p-space-lg shadow-md flex flex-col justify-between relative overflow-hidden border border-outline-variant/15">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-label-caps text-label-caps text-outline uppercase tracking-wider">Exact Current Age</span>
                  <div className="font-numerical-display text-[36px] md:text-[44px] text-primary font-bold mt-1.5 tracking-tight" id="stat-age-exact">
                    {telemetry.exactAgeStr}
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-3.5 md:mt-4" id="stat-age-born-text">
                    Born {telemetry.birthWeekday}, {telemetry.birthDateFormatted} at {telemetry.birthTimeFormatted}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary-container/20 flex items-center justify-center text-primary shrink-0">
                  <span className="material-symbols-outlined text-[28px]">public</span>
                </div>
              </div>

              {/* Progress Bar for Current Solar Year */}
              <div className="my-space-lg bg-surface-container-low rounded-xl p-space-md border border-outline-variant/15">
                <div className="flex items-center justify-between text-body-sm mb-2">
                  <span className="font-medium text-on-surface" id="stat-orbit-label">{telemetry.completedOrbits} Completed Solar Orbits</span>
                  <span className="font-data-mono text-primary font-bold" id="stat-orbit-pct">{telemetry.orbitProgressPct.toFixed(1)}% along {telemetry.completedOrbits + 1}th Orbit</span>
                </div>
                <div className="w-full bg-surface-container-highest rounded-full h-3 overflow-hidden">
                  <div className="bg-primary h-full rounded-full transition-all duration-700" id="bar-orbit-progress" style={{ width: `${telemetry.orbitProgressPct}%` }}></div>
                </div>
                <div className="flex items-center justify-between text-[12px] text-outline mt-2 font-data-mono">
                  <span id="stat-orbit-start">{telemetry.lastBdayFormatted} (Last Ingress)</span>
                  <span id="stat-orbit-end">{telemetry.nextBdayFormatted} (Next Ingress)</span>
                </div>
              </div>

              {/* Granular metric grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-space-sm pt-space-xs">
                <div className="bg-surface-container-low rounded-lg p-3 border border-outline-variant/15">
                  <span className="font-label-caps text-label-caps text-outline uppercase">Total Days</span>
                  <div className="font-data-mono text-[20px] font-bold text-on-surface mt-0.5" id="stat-days">{telemetry.tDays.toLocaleString()} d</div>
                  <span className="text-[11px] text-outline-variant font-data-mono" id="stat-hours">{telemetry.totalHours.toLocaleString()} hours</span>
                </div>
                <div className="bg-surface-container-low rounded-lg p-3 border border-outline-variant/15">
                  <span className="font-label-caps text-label-caps text-outline uppercase">Solar Distance</span>
                  <div className="font-data-mono text-[20px] font-bold text-on-surface mt-0.5" id="stat-distance">~{telemetry.distanceTraversed} km</div>
                  <span className="text-[11px] text-outline-variant">@ ~29.78 km/s</span>
                </div>
                <div className="bg-surface-container-low rounded-lg p-3 border border-outline-variant/15">
                  <span className="font-label-caps text-label-caps text-outline uppercase">Synodic Moons</span>
                  <div className="font-data-mono text-[20px] font-bold text-on-surface mt-0.5" id="stat-moons">{telemetry.moons}</div>
                  <span className="text-[11px] text-outline-variant">Full lunar cycles</span>
                </div>
              </div>
            </div>

            {/* Next Birthday Live Radar (5 cols) */}
            <div className="lg:col-span-5 bg-surface-container-lowest rounded-xl p-space-lg shadow-md flex flex-col justify-between border border-outline-variant/15">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-label-caps text-label-caps text-secondary uppercase tracking-wider font-bold">Next Orbital Ingress</span>
                  <h3 className="font-headline-md text-headline-md text-on-surface mt-0.5" id="stat-next-bday-date">{telemetry.nextBdayDateStr}</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant" id="stat-next-bday-turn">Turning {telemetry.turningAge} Years Old</p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2.5 py-1 rounded-md bg-secondary-container text-on-secondary-container font-data-mono text-[12px] font-semibold" id="stat-next-bday-weekday">
                    {telemetry.nextBdayWeekday}
                  </span>
                </div>
              </div>

              {/* Circular Orbit Visualizer Badge */}
              <div className="flex items-center justify-center my-space-md">
                <div className="relative flex items-center justify-center">
                  <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 120 120">
                    <circle className="text-surface-container-high" cx="60" cy="60" fill="transparent" r="50" stroke="currentColor" strokeWidth="8"></circle>
                    <circle
                      className="stroke-primary transition-all duration-700"
                      cx="60"
                      cy="60"
                      fill="transparent"
                      id="svg-countdown-ring"
                      r="50"
                      stroke="currentColor"
                      strokeDasharray="314.159"
                      strokeDashoffset={314.159 - (314.159 * (telemetry.orbitProgressPct / 100))}
                      strokeLinecap="round"
                      strokeWidth="8"
                    ></circle>
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="font-numerical-display text-[32px] text-on-surface leading-none font-bold" id="stat-countdown-days">{telemetry.dLeft}</span>
                    <span className="font-label-caps text-label-caps text-outline uppercase text-[10px] mt-1">Days Remaining</span>
                  </div>
                </div>
              </div>

              {/* Precision Ticker */}
              <div className="bg-surface-container-low rounded-xl p-space-sm text-center border border-outline-variant/15">
                <span className="font-label-caps text-label-caps text-outline uppercase tracking-wide text-[11px]">Live High-Precision Countdown</span>
                <div className="font-data-mono text-[20px] font-bold text-primary mt-1 tracking-wider" id="live-ticker">
                  {telemetry.tickerStr}
                </div>
                <div className="flex justify-around text-[11px] text-outline mt-1.5 font-data-mono">
                  <span id="stat-rem-weeks">{telemetry.remWeeks} Weeks</span>
                  <span>•</span>
                  <span id="stat-rem-months">{telemetry.remMonths} Months</span>
                  <span>•</span>
                  <span id="stat-half-bday">Half-Bday: {telemetry.halfBdayStr}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: Interactive Heliocentric Solar Orbit Visualization */}
      <section className="w-full py-space-2xl" id="orbit-viz">
        <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
          <div className="text-center max-w-2xl mx-auto mb-space-xl">
            <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider font-bold">Keplerian Orbital Telemetry</span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface mt-1">Interactive Heliocentric Trajectory</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-2">
              Your current coordinates along Earth’s 940-million-kilometer annual elliptical circuit around Sol.
            </p>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-space-md lg:p-space-xl shadow-lg grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center border border-outline-variant/15">
            {/* SVG Heliocentric Map (7 cols) */}
            <div className="lg:col-span-7 flex items-center justify-center p-space-sm bg-surface-container-low rounded-xl relative overflow-hidden border border-outline-variant/15">
              <svg className="w-full max-w-[480px] aspect-square" fill="none" viewBox="0 0 500 500">
                {/* Background Constellation Stars */}
                <circle cx="80" cy="90" fill="#c3c6d7" opacity="0.6" r="1.5"></circle>
                <circle cx="410" cy="120" fill="#c3c6d7" opacity="0.5" r="2"></circle>
                <circle cx="390" cy="430" fill="#c3c6d7" opacity="0.8" r="1"></circle>
                <circle cx="120" cy="400" fill="#c3c6d7" opacity="0.4" r="1.5"></circle>
                <circle cx="70" cy="280" fill="#c3c6d7" opacity="0.7" r="2"></circle>
                
                {/* Orbit Ellipse */}
                <ellipse cx="250" cy="250" rx="190" ry="160" stroke="#dae2fd" strokeDasharray="6 4" strokeWidth="2"></ellipse>
                
                {/* Seasonal Markers */}
                {/* Vernal Equinox (March 20) ~ 0 deg Right */}
                <circle cx="440" cy="250" fill="#006591" r="4"></circle>
                <text fill="#434655" fontFamily="Inter" fontSize="10" fontWeight="600" x="445" y="245">Spring Equinox (Mar 20)</text>
                
                {/* Summer Solstice (June 21) ~ Top */}
                <circle cx="250" cy="90" fill="#bc4800" r="4"></circle>
                <text fill="#434655" fontFamily="Inter" fontSize="10" fontWeight="600" textAnchor="middle" x="250" y="78">Summer Solstice (Jun 21)</text>
                
                {/* Autumnal Equinox (Sept 22) ~ Left */}
                <circle cx="60" cy="250" fill="#006591" r="4"></circle>
                <text fill="#434655" fontFamily="Inter" fontSize="10" fontWeight="600" textAnchor="end" x="55" y="265">Autumnal Equinox (Sep 22)</text>
                
                {/* Winter Solstice (Dec 21) ~ Bottom */}
                <circle cx="250" cy="410" fill="#2563eb" r="4"></circle>
                <text fill="#434655" fontFamily="Inter" fontSize="10" fontWeight="600" textAnchor="middle" x="250" y="428">Winter Solstice (Dec 21)</text>
                
                {/* Sun in center with glow */}
                <circle cx="250" cy="250" fill="#ffdbcd" opacity="0.4" r="42"></circle>
                <circle cx="250" cy="250" fill="#bc4800" opacity="0.85" r="28"></circle>
                <circle cx="250" cy="250" fill="#ffd54f" r="20"></circle>
                <text fill="#7d2d00" fontFamily="Inter" fontSize="11" fontWeight="700" textAnchor="middle" x="250" y="254">SOL</text>
                
                {/* Trajectory Path Arcs */}
                <path id="svg-orbit-path" d={orbitArcPath} fill="transparent" stroke="#2563eb" strokeLinecap="round" strokeWidth="4"></path>
                
                {/* Current Earth Location */}
                <g id="svg-earth-group" transform={earthTransform}>
                  <circle className="animate-ping" cx="0" cy="0" fill="#39b8fd" opacity="0.3" r="14"></circle>
                  <circle cx="0" cy="0" fill="#2563eb" r="8"></circle>
                  <circle cx="0" cy="0" fill="#faf8ff" r="4"></circle>
                </g>
                <text id="svg-earth-text" fill="#004ac6" fontFamily="Inter" fontSize="11" fontWeight="700" x={telemetry.targetCoords.x + 10} y={telemetry.targetCoords.y + 20}>EARTH TODAY</text>
                
                {/* Birth Ingress Marker */}
                <circle id="svg-birth-circle-1" cx={telemetry.birthCoords.x} cy={telemetry.birthCoords.y} fill="#bc4800" r="7"></circle>
                <circle id="svg-birth-circle-2" cx={telemetry.birthCoords.x} cy={telemetry.birthCoords.y} fill="#ffffff" r="3"></circle>
                <text id="svg-birth-text" fill="#943700" fontFamily="Inter" fontSize="11" fontWeight="700" x={telemetry.birthCoords.x + 10} y={telemetry.birthCoords.y - 3}>BIRTHDAY</text>
              </svg>
            </div>

            {/* Telemetry Breakdown (5 cols) */}
            <div className="lg:col-span-5 space-y-space-md">
              <div className="bg-surface-container-low p-space-md rounded-xl border border-outline-variant/15">
                <span className="font-label-caps text-label-caps text-outline uppercase">Orbital Sweep Angle</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-numerical-display text-[32px] text-on-surface font-bold" id="stat-sweep-angle">{(telemetry.orbitProgressPct * 3.6).toFixed(1)}°</span>
                  <span className="font-body-sm text-body-sm text-outline">/ 360.0° Completed</span>
                </div>
                <div className="w-full bg-surface-container-highest h-2 rounded-full mt-2 overflow-hidden">
                  <div className="bg-primary h-full rounded-full transition-all duration-500" id="bar-sweep-progress" style={{ width: `${telemetry.orbitProgressPct}%` }}></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-space-sm">
                <div className="bg-surface-container-low p-space-sm rounded-lg border border-outline-variant/15">
                  <span className="text-[11px] font-label-caps text-outline uppercase">Velocity</span>
                  <div className="font-data-mono text-[16px] font-bold text-on-surface mt-1" id="stat-velocity">107,226 km/h</div>
                  <span className="text-[11px] text-outline" id="stat-velocity-sec">29.78 km/sec relative</span>
                </div>
                <div className="bg-surface-container-low p-space-sm rounded-lg border border-outline-variant/15">
                  <span className="text-[11px] font-label-caps text-outline uppercase">Current Distance</span>
                  <div className="font-data-mono text-[16px] font-bold text-on-surface mt-1">148.9M km</div>
                  <span className="text-[11px] text-outline">0.995 AU (Near Perihelion)</span>
                </div>
                <div className="bg-surface-container-low p-space-sm rounded-lg border border-outline-variant/15">
                  <span className="text-[11px] font-label-caps text-outline uppercase">Annual Arc Left</span>
                  <div className="font-data-mono text-[16px] font-bold text-secondary mt-1" id="stat-arc-left">
                    {((100 - telemetry.orbitProgressPct) * 3.6).toFixed(1)}° ({(100 - telemetry.orbitProgressPct).toFixed(1)}%)
                  </div>
                  <span className="text-[11px] text-outline" id="stat-arc-days">{telemetry.dLeft} solar days to nexus</span>
                </div>
                <div className="bg-surface-container-low p-space-sm rounded-lg border border-outline-variant/15">
                  <span className="text-[11px] font-label-caps text-outline uppercase">Lifetime Orbits</span>
                  <div className="font-data-mono text-[16px] font-bold text-primary mt-1" id="stat-lifetime-orbits">
                    {(telemetry.completedOrbits + telemetry.orbitProgressPct / 100).toFixed(2)} Revs
                  </div>
                  <span className="text-[11px] text-outline">Vernal equinox baseline</span>
                </div>
              </div>

              <div className="p-space-sm rounded-lg bg-surface-container text-body-sm text-on-surface-variant flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[20px]">explore</span>
                <span id="stat-diurnal-rotations">You have completed {telemetry.tDays.toLocaleString()} diurnal axis rotations since birth.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: Life Progress & Generational Horizon */}
      <section className="w-full py-space-xl bg-surface-container-low">
        <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-sm mb-space-lg">
            <div>
              <span className="font-label-caps text-label-caps text-primary tracking-widest uppercase font-bold">Demographic Chronometry</span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface">Generational Horizon &amp; Life Arc</h2>
            </div>
            <div className="text-body-sm text-on-surface-variant" id="stat-generation">
              Cohort: <span className="font-bold text-on-surface">{telemetry.genName}</span> ({telemetry.genSpan})
            </div>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-md space-y-space-lg border border-outline-variant/15">
            {/* Global Expectancy Gauge */}
            <div>
              <div className="flex items-center justify-between text-body-sm mb-2">
                <span className="font-medium text-on-surface">Statistical Life Trajectory (78.5-Year Actuarial Index)</span>
                <span className="font-data-mono text-primary font-bold" id="stat-life-pct">{telemetry.lifePct.toFixed(1)}% Traversed</span>
              </div>
              <div className="w-full bg-surface-container-high h-4 rounded-full overflow-hidden flex">
                <div className="bg-primary h-full transition-all duration-700" id="bar-life-pct" style={{ width: `${telemetry.lifePct}%` }}></div>
                <div className="bg-surface-container-highest h-full flex-1"></div>
              </div>
              <div className="flex items-center justify-between text-[12px] text-outline mt-1.5 font-data-mono">
                <span>Birth (0 yr)</span>
                <span id="stat-life-current">Current: {telemetry.currentYearsAge.toFixed(1)} yr</span>
                <span>Target Benchmark (78.5 yr)</span>
              </div>
            </div>

            {/* Milestones Step Track */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-space-sm pt-space-xs" id="milestones-steps-container">
              {[
                { age: 0, label: 'Birth Ingress' },
                { age: 18, label: 'Civil Adulthood' },
                { age: 25, label: 'Prefrontal Cortex' },
                { age: 30, label: 'Saturn Return' },
                { age: 50, label: 'Half Century' },
                { age: 65, label: 'Retirement Arc' },
              ].map((step, idx) => {
                const isPassed = telemetry.currentYearsAge >= step.age;
                return (
                  <div key={idx} className={`p-3 rounded-lg border text-center transition-all ${isPassed ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-surface-container-low border-outline-variant/20 text-on-surface-variant'}`}>
                    <div className="font-numerical-display text-[20px] font-bold">{step.age}y</div>
                    <div className="text-[11px] font-medium truncate mt-0.5">{step.label}</div>
                    <div className="text-[10px] mt-1 uppercase font-bold tracking-wider">
                      {isPassed ? '✓ Achieved' : 'Upcoming'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: Spotify Wrapped-Style Birthday Insights */}
      <section className="w-full py-space-2xl" id="bio-insights">
        <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-sm mb-space-xl">
            <div>
              <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider font-bold">Bio-Cosmic Metrics</span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface">Your Solar Life In Perspective</h2>
            </div>
            <span className="text-body-sm text-outline font-data-mono">Recalculated in real time</span>
          </div>

          {/* Vibrant 4-Card Wrapped Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md mb-space-2xl">
            {/* Card 1 */}
            <div className="rounded-xl p-space-lg bg-surface-container-lowest shadow-md flex flex-col justify-between hover:shadow-lg transition-all duration-300 border border-outline-variant/15">
              <div>
                <div className="w-10 h-10 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center mb-space-md">
                  <span className="material-symbols-outlined text-[24px]">rocket_launch</span>
                </div>
                <span className="font-label-caps text-label-caps text-outline uppercase">Cosmic Journey</span>
                <div className="font-numerical-display text-[32px] text-on-surface font-bold mt-1" id="card-distance">{telemetry.distanceTraversed} km</div>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-md" id="card-distance-desc">
                Distance you&apos;ve ridden through the solar system along Earth&apos;s gravitational well since {telemetry.dobMonthYear}.
              </p>
            </div>

            {/* Card 2 */}
            <div className="rounded-xl p-space-lg bg-surface-container-lowest shadow-md flex flex-col justify-between hover:shadow-lg transition-all duration-300 border border-outline-variant/15">
              <div>
                <div className="w-10 h-10 rounded-lg bg-error-container text-on-error-container flex items-center justify-center mb-space-md">
                  <span className="material-symbols-outlined text-[24px]">favorite</span>
                </div>
                <span className="font-label-caps text-label-caps text-outline uppercase">Heart Beats</span>
                <div className="font-numerical-display text-[32px] text-on-surface font-bold mt-1" id="card-heartbeats">~{telemetry.heartBeats}</div>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-md">
                Calculated at a baseline resting pulse of 70 BPM without skipping a single ventricular stroke.
              </p>
            </div>

            {/* Card 3 */}
            <div className="rounded-xl p-space-lg bg-surface-container-lowest shadow-md flex flex-col justify-between hover:shadow-lg transition-all duration-300 border border-outline-variant/15">
              <div>
                <div className="w-10 h-10 rounded-lg bg-surface-container-highest text-primary flex items-center justify-center mb-space-md">
                  <span className="material-symbols-outlined text-[24px]">air</span>
                </div>
                <span className="font-label-caps text-label-caps text-outline uppercase">Atmospheric Cycles</span>
                <div className="font-numerical-display text-[32px] text-on-surface font-bold mt-1" id="card-breaths">~{telemetry.breaths}</div>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-md">
                Breaths of Earth&apos;s oxygen-nitrogen envelope cycled through your alveolar capillaries.
              </p>
            </div>

            {/* Card 4 */}
            <div className="rounded-xl p-space-lg bg-surface-container-lowest shadow-md flex flex-col justify-between hover:shadow-lg transition-all duration-300 border border-outline-variant/15">
              <div>
                <div className="w-10 h-10 rounded-lg bg-tertiary-container text-on-tertiary-container flex items-center justify-center mb-space-md">
                  <span className="material-symbols-outlined text-[24px]">bedtime</span>
                </div>
                <span className="font-label-caps text-label-caps text-outline uppercase">Circadian Sleep</span>
                <div className="font-numerical-display text-[32px] text-on-surface font-bold mt-1" id="card-sleep">~{telemetry.sleepDays} Days</div>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-md" id="card-sleep-desc">
                Equivalent to ~{(Math.floor(telemetry.tDays / 3) / 365.2425).toFixed(1)} continuous solar orbits spent processing memories and cellular repair in REM.
              </p>
            </div>
          </div>

          {/* Upcoming Chronological Milestones Radar */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md lg:p-space-xl shadow-md border border-outline-variant/15" id="milestones-radar">
            <div className="flex items-center justify-between mb-space-md">
              <div>
                <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider font-bold">Precision Radar</span>
                <h3 className="font-headline-md text-headline-md text-on-surface">Upcoming Chronological Benchmarks</h3>
              </div>
              <span className="inline-flex items-center gap-1 text-[12px] font-medium text-secondary">
                <span className="material-symbols-outlined text-[14px]">notifications_active</span>
                Next threshold alerts active
              </span>
            </div>
            <div className="space-y-space-xs" id="radar-container">
              {telemetry.milestones.map((m, idx) => (
                <div key={idx} className="p-3.5 rounded-lg bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-outline-variant/10">
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-[14px] font-bold ${m.reached ? 'bg-primary/10 text-primary' : 'bg-surface-container-highest text-on-surface-variant'}`}>
                      {m.reached ? '✓' : idx + 1}
                    </span>
                    <div>
                      <div className="font-medium text-on-surface text-body-sm">{m.title}</div>
                      <div className="text-[12px] text-outline font-data-mono">
                        Date: {m.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                  <div className="font-data-mono text-[13px] font-semibold text-right">
                    {m.reached ? (
                      <span className="text-primary">Achieved</span>
                    ) : (
                      <span className="text-secondary">{m.daysRemaining.toLocaleString()} Days Remaining</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9: Natal Ephemeris Matrix */}
      <section className="w-full py-space-2xl bg-surface-container-low" id="celestial-grid">
        <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
          <div className="text-center max-w-2xl mx-auto mb-space-xl">
            <span className="font-label-caps text-label-caps text-secondary uppercase tracking-wider font-bold">Natal Ephemeris Matrix</span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface mt-1">Celestial Coordinates of Your Ingress</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-2" id="celestial-subtitle">
              Astronomical positions and cultural calendar indices configured for {telemetry.birthDateFormatted}.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-md">
            {/* Item 1: Western Zodiac */}
            <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/15">
              <div className="flex items-center justify-between mb-2">
                <span className="font-label-caps text-label-caps text-outline uppercase">Western Constellation</span>
                <span className="font-headline-md text-primary text-[28px]" id="zodiac-icon">{telemetry.zIcon}</span>
              </div>
              <div className="font-headline-md text-headline-md text-on-surface" id="zodiac-name">{telemetry.zName}</div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1" id="zodiac-desc">{telemetry.zDesc}</p>
            </div>

            {/* Item 2: Chinese Zodiac */}
            <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/15">
              <div className="flex items-center justify-between mb-2">
                <span className="font-label-caps text-label-caps text-outline uppercase">Lunar Zodiac</span>
                <span className="material-symbols-outlined text-secondary text-[24px]">pets</span>
              </div>
              <div className="font-headline-md text-headline-md text-on-surface" id="chinese-zodiac-name">Year of the {telemetry.cZodiac}</div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1" id="chinese-zodiac-desc">
                Archetype representing resilience, celestial rhythm, and historical cyclical balance.
              </p>
            </div>

            {/* Item 3: Day of the Week */}
            <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/15">
              <div className="flex items-center justify-between mb-2">
                <span className="font-label-caps text-label-caps text-outline uppercase">Weekday Ingress</span>
                <span className="material-symbols-outlined text-outline text-[24px]">calendar_today</span>
              </div>
              <div className="font-headline-md text-headline-md text-on-surface" id="weekday-name">{telemetry.birthWeekday}</div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1" id="weekday-desc">
                Exact perpetual weekday recorded upon initial planetary ingress.
              </p>
            </div>

            {/* Item 4: Birthstone */}
            <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/15">
              <div className="flex items-center justify-between mb-2">
                <span className="font-label-caps text-label-caps text-outline uppercase">Mineral Ingress</span>
                <span className="material-symbols-outlined text-primary text-[24px]">diamond</span>
              </div>
              <div className="font-headline-md text-headline-md text-on-surface" id="birthstone-name">{telemetry.bStone}</div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1" id="birthstone-desc">
                Traditional mineral cohort aligned with month of arrival.
              </p>
            </div>

            {/* Item 5: Birth Flower */}
            <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/15">
              <div className="flex items-center justify-between mb-2">
                <span className="font-label-caps text-label-caps text-outline uppercase">Botanical Cohort</span>
                <span className="material-symbols-outlined text-secondary text-[24px]">local_florist</span>
              </div>
              <div className="font-headline-md text-headline-md text-on-surface" id="flower-name">{telemetry.bFlower}</div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1" id="flower-desc">
                Botanical signature in seasonal resonance with your birth period.
              </p>
            </div>

            {/* Item 6: Seasonal Ingress */}
            <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/15">
              <div className="flex items-center justify-between mb-2">
                <span className="font-label-caps text-label-caps text-outline uppercase">Seasonal Ingress</span>
                <span className="material-symbols-outlined text-tertiary text-[24px]">wb_sunny</span>
              </div>
              <div className="font-headline-md text-headline-md text-on-surface" id="season-name">{telemetry.bSeason}</div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1" id="season-desc">
                Earth&apos;s axial tilt station and seasonal ambient quadrant during ingress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 10: Birthday Celebration Planning Timeline */}
      <section className="w-full py-space-2xl">
        <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
            {/* Planning Timeline (6 cols) */}
            <div className="lg:col-span-6 space-y-space-md">
              <div>
                <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider font-bold">Protocol Sequence</span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface mt-1">Celebration Countdown Schedule</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1" id="protocol-subtitle">
                  Deterministic preparation roadmap tailored for your upcoming {telemetry.nextBdayDateStr} ingress.
                </p>
              </div>
              <div className="space-y-space-sm" id="protocol-container">
                {telemetry.protocols.map((p, idx) => (
                  <div key={idx} className="p-space-sm rounded-lg bg-surface-container-low border border-outline-variant/15 flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[20px]">{p.icon}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-data-mono text-[12px] font-bold text-primary">{p.stage}</span>
                        <span className="font-medium text-on-surface text-body-sm">{p.title}</span>
                      </div>
                      <p className="font-body-sm text-[13px] text-on-surface-variant mt-0.5">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Verified Cohorts & Benchmarks (6 cols) */}
            <div className="lg:col-span-6 bg-surface-container-lowest rounded-xl p-space-lg shadow-md space-y-space-md flex flex-col justify-between border border-outline-variant/15">
              <div>
                <div className="flex items-center justify-between mb-space-sm">
                  <span className="font-label-caps text-label-caps text-secondary uppercase tracking-wider font-bold">Reference Epochs</span>
                  <span className="font-data-mono text-[12px] text-outline">RFC 3339 Verified</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface">Comparative Natal Cohorts</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Select an archetype to instantly evaluate alternative historical and generational orbital parameters:
                </p>
              </div>
              <div className="space-y-space-xs">
                <div className="p-space-sm rounded-lg bg-surface-container-low flex items-center justify-between border border-outline-variant/10">
                  <div>
                    <div className="font-medium text-on-surface text-body-sm">Albert Einstein (March 14, 1879)</div>
                    <div className="text-[12px] text-outline">General Relativity Epoch • Pisces Ingress</div>
                  </div>
                  <button onClick={() => loadPreset('1879-03-14', '11:30')} className="px-3 py-1 rounded bg-surface-container-highest text-primary font-body-sm hover:bg-primary hover:text-on-primary transition-colors cursor-pointer" type="button">Load</button>
                </div>
                <div className="p-space-sm rounded-lg bg-surface-container-low flex items-center justify-between border border-outline-variant/10">
                  <div>
                    <div className="font-medium text-on-surface text-body-sm">Apollo 11 Moon Landing (July 20, 1969)</div>
                    <div className="text-[12px] text-outline">Lunar Landing Event • Cancer Ingress</div>
                  </div>
                  <button onClick={() => loadPreset('1969-07-20', '20:17')} className="px-3 py-1 rounded bg-surface-container-highest text-primary font-body-sm hover:bg-primary hover:text-on-primary transition-colors cursor-pointer" type="button">Load</button>
                </div>
                <div className="p-space-sm rounded-lg bg-surface-container-low flex items-center justify-between border border-outline-variant/10">
                  <div>
                    <div className="font-medium text-on-surface text-body-sm">Turn of the Millennium (January 1, 2000)</div>
                    <div className="text-[12px] text-outline">Y2K Epoch Standard • Capricorn Ingress</div>
                  </div>
                  <button onClick={() => loadPreset('2000-01-01', '00:00')} className="px-3 py-1 rounded bg-surface-container-highest text-primary font-body-sm hover:bg-primary hover:text-on-primary transition-colors cursor-pointer" type="button">Load</button>
                </div>
              </div>
              <div className="p-space-sm rounded bg-surface-container-high text-on-surface-variant text-[12px] flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-primary">info</span>
                <span>All leap seconds and Julian intercalary cycles are resolved purely inside your browser.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 11: Scientific Metrology & Code Box */}
      <section className="w-full py-space-2xl bg-surface-container-low">
        <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
          <div className="max-w-3xl mb-space-xl">
            <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider font-bold">Astrophysical Calibration</span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface mt-1">How Solar Orbit Metrology Operates</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-2">
              Understanding the mathematical precision between the astronomical tropical year and conventional civil calendars.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md mb-space-xl">
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm space-y-2 border border-outline-variant/15">
              <div className="w-8 h-8 rounded-lg bg-surface-container font-data-mono font-bold text-primary flex items-center justify-center">01</div>
              <h3 className="font-headline-md text-[18px] text-on-surface font-semibold">The Tropical Year</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                A true solar orbit is calibrated against the Vernal Equinox (365.24219 days), not an even 365 days. Fractional Julian day integration preserves true orbital angular momentum.
              </p>
            </div>
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm space-y-2 border border-outline-variant/15">
              <div className="w-8 h-8 rounded-lg bg-surface-container font-data-mono font-bold text-primary flex items-center justify-center">02</div>
              <h3 className="font-headline-md text-[18px] text-on-surface font-semibold">Gregorian Intercalary Rules</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Years divisible by 4 are leap years, except centennial years unless they are also divisible by 400. This maintains alignment with astronomical seasons over centuries.
              </p>
            </div>
            <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm space-y-2 border border-outline-variant/15">
              <div className="w-8 h-8 rounded-lg bg-surface-container font-data-mono font-bold text-primary flex items-center justify-center">03</div>
              <h3 className="font-headline-md text-[18px] text-on-surface font-semibold">Kepler&apos;s Second Law</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Earth&apos;s orbital speed varies from 30.29 km/s at perihelion (early January) to 29.29 km/s at aphelion (early July). Your velocity continuously oscillates throughout your annual circuit.
              </p>
            </div>
          </div>

          {/* Code Snippet Box with Copy JS Action */}
          <div className="bg-neutral-900 rounded-xl p-space-lg text-neutral-100 shadow-xl border border-neutral-800">
            <div className="flex items-center justify-between mb-space-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <span className="font-data-mono text-[12px] text-neutral-400 ml-2">heliocentric-calc.js</span>
              </div>
              <button
                onClick={() => {
                  const code = `// SolveIt High-Precision Solar Orbit & Countdown Algorithm
function computeSolarOrbit(birthDate, targetDate = new Date()) {
  const TROPICAL_YEAR_DAYS = 365.24219;
  const MS_PER_DAY = 86400000;
  
  const diffMs = targetDate.getTime() - birthDate.getTime();
  const totalDays = diffMs / MS_PER_DAY;
  const completedOrbits = Math.floor(totalDays / TROPICAL_YEAR_DAYS);
  const currentOrbitProgress = (totalDays % TROPICAL_YEAR_DAYS) / TROPICAL_YEAR_DAYS;
  
  return {
    completedOrbits,
    progressPercent: (currentOrbitProgress * 100).toFixed(2),
    totalDistanceTraversedKm: (totalDays * 86400 * 29.78).toLocaleString()
  };
}`;
                  navigator.clipboard.writeText(code);
                }}
                className="px-3 py-1 rounded bg-neutral-800 hover:bg-neutral-700 font-data-mono text-[12px] text-neutral-200 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">content_copy</span>
                Copy Algorithm
              </button>
            </div>
            <pre className="font-data-mono text-[13px] text-neutral-300 overflow-x-auto p-space-sm bg-neutral-950/70 rounded leading-relaxed border border-neutral-800/60">
              <code>{`// SolveIt High-Precision Solar Orbit & Countdown Algorithm
function computeSolarOrbit(birthDate, targetDate = new Date()) {
  const TROPICAL_YEAR_DAYS = 365.24219;
  const MS_PER_DAY = 86400000;
  
  const diffMs = targetDate.getTime() - birthDate.getTime();
  const totalDays = diffMs / MS_PER_DAY;
  const completedOrbits = Math.floor(totalDays / TROPICAL_YEAR_DAYS);
  const currentOrbitProgress = (totalDays % TROPICAL_YEAR_DAYS) / TROPICAL_YEAR_DAYS;
  
  return {
    completedOrbits,
    progressPercent: (currentOrbitProgress * 100).toFixed(2),
    totalDistanceTraversedKm: (totalDays * 86400 * 29.78).toLocaleString()
  };
}`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* SECTION 9: TIME & DATE ECOSYSTEM NAVIGATION */}
      <section className="w-full py-space-xl bg-surface-container-low/30 border-t border-outline-variant/15">
        <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-space-lg">
            <div>
              <span className="font-label-caps text-label-caps text-primary uppercase font-bold tracking-wider">SolveIt Chronometry Suite</span>
              <h2 className="font-headline-md text-headline-md text-on-surface font-semibold mt-1">
                Explore More Time &amp; Date Calculators
              </h2>
            </div>
            <Link
              href="/time-date"
              className="inline-flex items-center gap-1.5 font-body-sm font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              <span>View All 20+ Date Tools</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
            <Link
              href="/time-date/age-calculator"
              className="group bg-surface-container-lowest p-space-md rounded-xl border border-outline-variant/15 hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[22px]">calculate</span>
                </div>
                <h3 className="font-body-md font-semibold text-on-surface group-hover:text-primary transition-colors">Exact Age Calculator</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  High-precision Gregorian age down to years, months, days, hours, and perpetual leap years.
                </p>
              </div>
              <div className="mt-4 flex items-center text-label-caps text-primary font-bold">
                <span>Calculate Age</span>
                <span className="material-symbols-outlined text-[16px] ml-1 group-hover:translate-x-1 transition-transform">chevron_right</span>
              </div>
            </Link>

            <Link
              href="/time-date/date-difference"
              className="group bg-surface-container-lowest p-space-md rounded-xl border border-outline-variant/15 hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[22px]">date_range</span>
                </div>
                <h3 className="font-body-md font-semibold text-on-surface group-hover:text-primary transition-colors">Date Difference &amp; Delta</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Calculate calendar day deltas, work weeks, and sprint cycles between two arbitrary timestamps.
                </p>
              </div>
              <div className="mt-4 flex items-center text-label-caps text-secondary font-bold">
                <span>Compute Delta</span>
                <span className="material-symbols-outlined text-[16px] ml-1 group-hover:translate-x-1 transition-transform">chevron_right</span>
              </div>
            </Link>

            <Link
              href="/time-date/days-calculator"
              className="group bg-surface-container-lowest p-space-md rounded-xl border border-outline-variant/15 hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-tertiary/10 text-tertiary flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[22px]">event_available</span>
                </div>
                <h3 className="font-body-md font-semibold text-on-surface group-hover:text-primary transition-colors">Business Days &amp; Holidays</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Add/subtract business days, evaluate federal holidays, and calculate Julian epoch days.
                </p>
              </div>
              <div className="mt-4 flex items-center text-label-caps text-tertiary font-bold">
                <span>Calculate Workdays</span>
                <span className="material-symbols-outlined text-[16px] ml-1 group-hover:translate-x-1 transition-transform">chevron_right</span>
              </div>
            </Link>

            <Link
              href="/time-date/world-clock-grid"
              className="group bg-surface-container-lowest p-space-md rounded-xl border border-outline-variant/15 hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-primary-container/20 text-primary flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[22px]">public</span>
                </div>
                <h3 className="font-body-md font-semibold text-on-surface group-hover:text-primary transition-colors">World Clock Matrix</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Multi-city solar time corridor with DST shift warnings and IANA timezone offsets.
                </p>
              </div>
              <div className="mt-4 flex items-center text-label-caps text-primary font-bold">
                <span>View World Clock</span>
                <span className="material-symbols-outlined text-[16px] ml-1 group-hover:translate-x-1 transition-transform">chevron_right</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 10: METROLOGY & PRIVACY GUARANTEE */}
      <section className="w-full py-space-md bg-surface border-t border-outline-variant/15">
        <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-[28px]">lock</span>
              <div>
                <div className="font-body-md font-semibold text-on-surface">100% Client-Side Computational Privacy</div>
                <div className="font-body-sm text-[12px] text-on-surface-variant">Your date of birth, time, and coordinates never leave your browser. Zero telemetry transmitted.</div>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="font-data-mono text-[11px] bg-surface-container px-2.5 py-1 rounded text-on-surface-variant">Astronomical J2000.0</span>
              <span className="font-data-mono text-[11px] bg-surface-container px-2.5 py-1 rounded text-on-surface-variant">ISO 8601 Deterministic</span>
              <span className="font-data-mono text-[11px] bg-surface-container px-2.5 py-1 rounded text-on-surface-variant">Tropical Solar Year 365.24219d</span>
            </div>
          </div>
        </div>
      </section>

        </div>
      </main>
    </div>
  );
}
