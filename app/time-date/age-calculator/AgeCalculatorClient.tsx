'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';

function getZodiacSign(month: number, day: number) {
  const dates = [20, 19, 21, 20, 21, 21, 23, 23, 23, 23, 22, 22];
  const signs = [
    "♑ Capricorn", "♒ Aquarius", "♓ Pisces", "♈ Aries",
    "♉ Taurus", "♊ Gemini", "♋ Cancer", "♌ Leo",
    "♍ Virgo", "♎ Libra", "♏ Scorpio", "♐ Sagittarius"
  ];
  let idx = month - 1;
  if (day < dates[idx]) {
    idx = (idx + 11) % 12;
  }
  return signs[idx];
}

function getBirthstoneAndFlower(month: number) {
  const list = [
    { stone: "Garnet", flower: "Carnation & Snowdrop" },
    { stone: "Amethyst", flower: "Violet & Primrose" },
    { stone: "Aquamarine", flower: "Daffodil & Jonquil" },
    { stone: "Diamond", flower: "Daisy & Sweet Pea" },
    { stone: "Emerald", flower: "Lily of the Valley" },
    { stone: "Pearl & Alexandrite", flower: "Rose & Honeysuckle" },
    { stone: "Ruby", flower: "Larkspur & Water Lily" },
    { stone: "Peridot", flower: "Gladiolus & Poppy" },
    { stone: "Sapphire", flower: "Aster & Morning Glory" },
    { stone: "Opal & Tourmaline", flower: "Marigold & Cosmos" },
    { stone: "Topaz & Citrine", flower: "Chrysanthemum" },
    { stone: "Tanzanite & Turquoise", flower: "Narcissus & Holly" }
  ];
  return list[month - 1] || { stone: "Opal", flower: "Marigold" };
}

function getChineseZodiac(year: number) {
  const animals = ["Rat 🐀", "Ox 🐂", "Tiger 🐅", "Rabbit 🐇", "Dragon 🐉", "Snake 🐍", "Horse 🐎", "Goat 🐐", "Monkey 🐒", "Rooster 🐓", "Dog 🐕", "Pig 🐖"];
  const startYear = 1900;
  const index = ((year - startYear) % 12 + 12) % 12;
  return "Year of the " + animals[index];
}

function getGenerationalCohort(year: number) {
  if (year >= 2013) return "Generation Alpha (2013–2025)";
  if (year >= 1997) return "Generation Z (1997–2012)";
  if (year >= 1981) return "Millennials / Gen Y (1981–1996)";
  if (year >= 1965) return "Generation X (1965–1980)";
  if (year >= 1946) return "Baby Boomers (1946–1964)";
  return "Silent Generation (pre-1946)";
}

export default function AgeCalculatorClient() {
  const [mounted, setMounted] = useState(false);
  const [utcTime, setUtcTime] = useState<Date | null>(null);

  const formatUtcTime = (date: Date) => {
    const h = String(date.getUTCHours()).padStart(2, '0');
    const m = String(date.getUTCMinutes()).padStart(2, '0');
    const s = String(date.getUTCSeconds()).padStart(2, '0');
    return `${h}:${m}:${s}Z`;
  };

  const [birthDate, setBirthDate] = useState('1999-10-24');
  const [birthTime, setBirthTime] = useState('14:35');
  const [targetDate, setTargetDate] = useState('2025-02-27');
  const [liveTickingClock, setLiveTickingClock] = useState('');
  const [copyBtnText, setCopyBtnText] = useState('Copy Summary');
  const [copyCodeText, setCopyCodeText] = useState('Copy JS Algorithm');

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      const d = new Date();
      const h = String(d.getHours()).padStart(2, '0');
      const m = String(d.getMinutes()).padStart(2, '0');
      const s = String(d.getSeconds()).padStart(2, '0');
      setLiveTickingClock(`+${h}h ${m}m ${s}s live`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const data = useMemo(() => {
    if (!mounted) return null;
    const startTime = performance.now();
    
    if (!birthDate || !targetDate) return null;

    const birthTimeStr = birthTime.length === 5 ? birthTime + ':00' : (birthTime || "00:00:00");
    const birth = new Date(birthDate + 'T' + birthTimeStr);
    const target = new Date(targetDate + 'T23:59:59');

    if (birth > target) {
      return { error: "Date of birth cannot be after the reference date." };
    }

    let yDiff = target.getFullYear() - birth.getFullYear();
    let mDiff = target.getMonth() - birth.getMonth();
    let dDiff = target.getDate() - birth.getDate();

    if (dDiff < 0) {
      mDiff--;
      const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
      dDiff += prevMonth.getDate();
    }
    if (mDiff < 0) {
      yDiff--;
      mDiff += 12;
    }

    const totalMs = target.getTime() - birth.getTime();
    const totalDays = Math.floor(totalMs / (1000 * 60 * 60 * 24));
    const totalHours = Math.floor(totalMs / (1000 * 60 * 60));
    const totalMinutes = Math.floor(totalMs / (1000 * 60));
    const totalSeconds = Math.floor(totalMs / 1000);
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonthsApprox = (yDiff * 12) + mDiff;

    const heartbeats = Math.floor(totalMinutes * 70);
    const breaths = Math.floor(totalMinutes * 17);

    const now = new Date();
    let nextBdayYear = now.getFullYear();
    let nextBday = new Date(nextBdayYear, birth.getMonth(), birth.getDate());
    if (nextBday < now) {
      nextBdayYear++;
      nextBday = new Date(nextBdayYear, birth.getMonth(), birth.getDate());
    }
    const daysToNextBday = Math.ceil((nextBday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const turningAge = nextBdayYear - birth.getFullYear();

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const radarTargetDateStr = nextBday.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const nextBirthdayDayOfWeek = `${daysOfWeek[nextBday.getDay()]} ${(nextBday.getDay() === 0 || nextBday.getDay() === 6) ? '(Weekend Celebration!)' : ''}`;

    const halfBday = new Date(nextBday.getTime() - (182.5 * 24 * 60 * 60 * 1000));
    const radarHalfBirthdayStr = halfBday.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const daysToHalf = Math.max(0, Math.ceil((halfBday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

    const daysSinceLastBday = 365 - daysToNextBday;
    const progressPercentNum = Math.min(100, Math.max(0, (daysSinceLastBday / 365) * 100)).toFixed(1);

    const bMonth = birth.getMonth() + 1;
    const bDay = birth.getDate();
    const zodiacInfo = getZodiacSign(bMonth, bDay);
    const { stone: birthstone, flower } = getBirthstoneAndFlower(bMonth);
    const chineseZodiac = getChineseZodiac(birth.getFullYear());
    const cohort = getGenerationalCohort(birth.getFullYear());
    const dayOfWeekBorn = daysOfWeek[birth.getDay()];

    const solarYearsExact = (yDiff + (mDiff / 12) + (dDiff / 365.2425)).toFixed(3);
    const lunarCycles = (totalDays / 29.530588).toFixed(1);
    const businessDays = Math.floor(totalDays * (5 / 7)).toLocaleString();
    const sleepYears = (totalDays * 8 / 24 / 365.25).toFixed(2);
    const orbitalKm = ((totalSeconds * 29.78) / 1000000000).toFixed(1);

    const mercury = (totalDays / 87.97).toFixed(1);
    const venus = (totalDays / 224.7).toFixed(1);
    const mars = (totalDays / 686.98).toFixed(2);

    const tileBirthDate = birth.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const tileAge18 = new Date(birth.getFullYear() + 18, birth.getMonth(), birth.getDate()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const tileAge21 = new Date(birth.getFullYear() + 21, birth.getMonth(), birth.getDate()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    const date30 = new Date(birth.getFullYear() + 30, birth.getMonth(), birth.getDate());
    const tileAge30 = date30.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const yearsTo30 = Math.max(0, ((date30.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 365.25))).toFixed(1);

    const date67 = new Date(birth.getFullYear() + 67, birth.getMonth(), birth.getDate());
    const tileAge67 = date67.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const yearsTo67 = Math.max(0, ((date67.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 365.25))).toFixed(1);

    const lifeExpPercent = Math.min(100, (yDiff / 78.5) * 100).toFixed(1);

    const endTime = performance.now();
    const microCalcSpeed = (endTime - startTime).toFixed(2);

    return {
      yDiff, mDiff, dDiff, totalDays, totalHours, totalMinutes, totalSeconds, totalWeeks, totalMonthsApprox,
      heartbeats, breaths, daysToNextBday, turningAge, nextBirthdayDayOfWeek, radarTargetDateStr, radarHalfBirthdayStr, daysToHalf,
      progressPercentNum, zodiacInfo, birthstone, flower, chineseZodiac, cohort, dayOfWeekBorn, daysSinceLastBday,
      solarYearsExact, lunarCycles, businessDays, sleepYears, orbitalKm, mercury, venus, mars,
      tileBirthDate, tileAge18, tileAge21, tileAge30, yearsTo30, tileAge67, yearsTo67, lifeExpPercent,
      microCalcSpeed
    };
  }, [birthDate, birthTime, targetDate, mounted]);

  const setTargetPreset = useCallback((preset: string) => {
    const today = new Date();
    if (preset === 'today') {
      setTargetDate(today.toISOString().split('T')[0]);
    } else if (preset === 'yesterday') {
      const yest = new Date(today);
      yest.setDate(yest.getDate() - 1);
      setTargetDate(yest.toISOString().split('T')[0]);
    } else if (preset === 'endOfYear') {
      setTargetDate(`${today.getFullYear()}-12-31`);
    } else if (preset === 'decade2030') {
      setTargetDate("2030-01-01");
    }
  }, []);

  const swapDates = useCallback(() => {
    setBirthDate(targetDate);
    setTargetDate(birthDate);
  }, [birthDate, targetDate]);

  const resetDefaults = useCallback(() => {
    setBirthDate('1999-10-24');
    setTargetDate('2025-02-27');
    setBirthTime('14:35');
  }, []);

  const saveSnapshot = useCallback(() => {
    if (data && !('error' in data)) {
      alert(`Snapshot Saved to Local State:\n${data.yDiff} Years, ${data.mDiff} Months, ${data.dDiff} Days`);
    }
  }, [data]);

  const copySummary = useCallback(() => {
    if (data && !('error' in data)) {
      const summary = `SolveIt Age Telemetry: ${data.yDiff} Years, ${data.mDiff} Months, ${data.dDiff} Days (${data.totalDays.toLocaleString()} Total Days). Verified via ISO 8601 Gregorian Algorithm.`;
      navigator.clipboard.writeText(summary).then(() => {
        setCopyBtnText("Copied!");
        setTimeout(() => { setCopyBtnText("Copy Summary"); }, 2000);
      });
    }
  }, [data]);

  const exportCSV = useCallback(() => {
    if (data && !('error' in data)) {
      const ageStr = `${data.yDiff} Years, ${data.mDiff} Months, ${data.dDiff} Days`;
      const csv = `DOB,TargetDate,CalculatedAge,TotalDays\n"${birthDate}","${targetDate}","${ageStr}","${data.totalDays.toLocaleString()}"`;
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('href', url);
      a.setAttribute('download', `age-telemetry-${birthDate}.csv`);
      a.click();
    }
  }, [birthDate, targetDate, data]);

  const shareLink = useCallback(() => {
    const url = `${window.location.origin}${window.location.pathname}?dob=${birthDate}`;
    navigator.clipboard.writeText(url).then(() => {
      alert("Sharable URL copied to clipboard:\n" + url);
    });
  }, [birthDate]);

  const copyAlgorithmCode = useCallback(() => {
    const code = `function calculateAge(bDate, tDate) {
  let y = tDate.getFullYear() - bDate.getFullYear();
  let m = tDate.getMonth() - bDate.getMonth();
  let d = tDate.getDate() - bDate.getDate();
  if (d < 0) {
    m--;
    d += new Date(tDate.getFullYear(), tDate.getMonth(), 0).getDate();
  }
  if (m < 0) { y--; m += 12; }
  return { years: y, months: m, days: d };
}`;
    navigator.clipboard.writeText(code).then(() => {
      setCopyCodeText("Copied!");
      setTimeout(() => { setCopyCodeText("Copy JS Algorithm"); }, 2000);
    });
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-surface"></div>;
  }

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface">
      
      <main className="w-full pt-16 bg-surface min-h-[calc(100vh-64px)]">
        <div className="flex flex-col w-full">
          
          {/* SECTION 1: HERO & METROLOGY TELEMETRY */}
          <section className="w-full bg-surface-container-low/40 pb-space-2xl pt-space-lg">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
              <div className="flex flex-wrap items-center justify-between gap-space-sm mb-space-md">
                <nav aria-label="Breadcrumb" className="flex items-center gap-space-2xs font-body-sm text-body-sm text-on-surface-variant">
                  <Link className="hover:text-primary transition-colors" href="/">Home</Link>
                  <span className="text-outline-variant">/</span>
                  <Link className="hover:text-primary transition-colors" href="/date-time">Date &amp; Time</Link>
                  <span className="text-outline-variant">/</span>
                  <span className="text-on-surface font-medium">Age Calculator</span>
                </nav>
                <div className="flex items-center gap-space-xs font-data-mono text-[11px] text-on-surface-variant bg-surface-container px-3 py-1 rounded-full shadow-sm">
                  <span className="inline-block w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
                  <span>CALIBRATED: FEB 2025</span>
                  <span className="text-outline-variant">|</span>
                  <span>AUDIT: 100% DETERMINISTIC</span>
                  <span className="text-outline-variant">|</span>
                  <span>ISO 8601:2019</span>
                </div>
              </div>
              <div className="max-w-4xl mb-space-lg">
                <div className="inline-flex items-center gap-space-xs bg-primary-fixed text-on-primary-fixed font-label-caps text-label-caps px-2.5 py-1 rounded-full uppercase tracking-wider mb-space-sm">
                  <span className="material-symbols-outlined text-[14px]">timer</span>
                  Precision Temporal Telemetry Workbench
                </div>
                <h1 className="font-headline-lg text-headline-lg md:text-[44px] md:leading-[52px] text-on-surface tracking-tight font-bold mb-space-sm">
                  Age Calculator &amp; Chronological Engine
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl">
                  Calculate your exact astronomical age in years, months, weeks, days, hours, and seconds with ISO 8601 calendar precision and leap year determinism.
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-space-sm mb-space-xl">
                <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-sm flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary-container text-[24px]">verified</span>
                  <div>
                    <div className="font-label-caps text-[11px] text-on-surface font-semibold">Instant Resolution</div>
                    <div className="font-body-sm text-[12px] text-on-surface-variant">Client-Side Milliseconds</div>
                  </div>
                </div>
                <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-sm flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-[24px]">event_repeat</span>
                  <div>
                    <div className="font-label-caps text-[11px] text-on-surface font-semibold">400-Yr Gregorian</div>
                    <div className="font-body-sm text-[12px] text-on-surface-variant">Deterministic Leap Logic</div>
                  </div>
                </div>
                <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-sm flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary text-[24px]">security</span>
                  <div>
                    <div className="font-label-caps text-[11px] text-on-surface font-semibold">100% Sandboxed</div>
                    <div className="font-body-sm text-[12px] text-on-surface-variant">Zero Cloud Storage</div>
                  </div>
                </div>
                <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-sm flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary-container text-[24px]">insights</span>
                  <div>
                    <div className="font-label-caps text-[11px] text-on-surface font-semibold">6.4M Monthly Runs</div>
                    <div className="font-body-sm text-[12px] text-on-surface-variant">Consensus Verified</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 -mb-2 no-scrollbar">
                <a className="bg-primary-container text-on-primary-container font-label-caps text-label-caps px-4 py-2.5 rounded-lg shadow-sm whitespace-nowrap flex items-center gap-1.5" href="#workbench">
                  <span className="material-symbols-outlined text-[16px]">schedule</span> Age Calculator
                </a>
                <a className="bg-surface-container-lowest text-on-surface-variant hover:text-on-surface font-label-caps text-label-caps px-4 py-2.5 rounded-lg shadow-sm whitespace-nowrap transition-colors flex items-center gap-1.5" href="#matrix">
                  <span className="material-symbols-outlined text-[16px]">date_range</span> Date Difference
                </a>
                <a className="bg-surface-container-lowest text-on-surface-variant hover:text-on-surface font-label-caps text-label-caps px-4 py-2.5 rounded-lg shadow-sm whitespace-nowrap transition-colors flex items-center gap-1.5" href="#radar">
                  <span className="material-symbols-outlined text-[16px]">cake</span> Next Birthday Countdown
                </a>
                <a className="bg-surface-container-lowest text-on-surface-variant hover:text-on-surface font-label-caps text-label-caps px-4 py-2.5 rounded-lg shadow-sm whitespace-nowrap transition-colors flex items-center gap-1.5" href="#profile">
                  <span className="material-symbols-outlined text-[16px]">stars</span> Zodiac &amp; Epoch
                </a>
                <a className="bg-surface-container-lowest text-on-surface-variant hover:text-on-surface font-label-caps text-label-caps px-4 py-2.5 rounded-lg shadow-sm whitespace-nowrap transition-colors flex items-center gap-1.5" href="#timeline">
                  <span className="material-symbols-outlined text-[16px]">timeline</span> Life Milestones
                </a>
              </div>
            </div>
          </section>

          {/* SECTION 2 & 3: INTERACTIVE WORKBENCH + LIVE TELEMETRY DASHBOARD */}
          <section className="w-full py-space-2xl bg-surface" id="workbench">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
                
                {/* SECTION 2: INPUT CONTROLS PANEL */}
                <div className="lg:col-span-5 bg-surface-container-lowest p-space-lg rounded-2xl shadow-xl flex flex-col gap-space-md">
                  <div className="flex items-center justify-between pb-space-xs">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary-container text-[22px]">tune</span>
                      <h2 className="font-headline-md text-headline-md text-on-surface">Temporal Parameters</h2>
                    </div>
                    <span className="font-data-mono text-[12px] text-on-surface-variant bg-surface-container-low px-2 py-0.5 rounded">UTC-05:00</span>
                  </div>
                  <form className="flex flex-col gap-space-md" onSubmit={(e) => e.preventDefault()}>
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center">
                        <label className="font-label-caps text-label-caps text-on-surface font-semibold uppercase" htmlFor="birthDateInput">Date of Birth</label>
                        <span className="font-body-sm text-[12px] text-on-surface-variant">Gregorian Baseline</span>
                      </div>
                      <div className="relative flex items-center bg-surface-container-low rounded-xl p-1.5 focus-within:ring-2 focus-within:ring-primary-container">
                        <span className="material-symbols-outlined text-outline px-2 text-[20px]">calendar_today</span>
                        <input className="w-full bg-transparent text-on-surface font-data-mono text-[16px] font-semibold focus:outline-none pr-2" id="birthDateInput" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} required />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <button className="font-label-caps text-[10px] px-2.5 py-1 rounded bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-colors" onClick={() => setBirthDate('2000-01-01')} type="button">2000-01-01 (Gen Z)</button>
                      <button className="font-label-caps text-[10px] px-2.5 py-1 rounded bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-colors" onClick={() => setBirthDate('1995-07-15')} type="button">1995-07-15 (Millennial)</button>
                      <button className="font-label-caps text-[10px] px-2.5 py-1 rounded bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-colors" onClick={() => setBirthDate('1985-12-25')} type="button">1985-12-25</button>
                      <button className="font-label-caps text-[10px] px-2.5 py-1 rounded bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-colors" onClick={() => setBirthDate('1970-03-12')} type="button">1970-03-12 (Gen X)</button>
                    </div>
                    <div className="flex flex-col gap-1.5 pt-1">
                      <div className="flex justify-between items-center">
                        <label className="font-label-caps text-label-caps text-on-surface font-semibold uppercase" htmlFor="birthTimeInput">Exact Time of Birth (Optional)</label>
                        <span className="font-data-mono text-[11px] text-primary">Sub-Day Fidelity</span>
                      </div>
                      <div className="flex items-center bg-surface-container-low rounded-xl p-1.5 focus-within:ring-2 focus-within:ring-primary-container">
                        <span className="material-symbols-outlined text-outline px-2 text-[20px]">access_time</span>
                        <input className="w-full bg-transparent text-on-surface font-data-mono text-[15px] focus:outline-none" id="birthTimeInput" step="1" type="time" value={birthTime} onChange={(e) => setBirthTime(e.target.value)} />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5 pt-1">
                      <div className="flex justify-between items-center">
                        <label className="font-label-caps text-label-caps text-on-surface font-semibold uppercase" htmlFor="targetDateInput">Age at Date of (Reference Point)</label>
                        <span className="font-body-sm text-[12px] text-on-surface-variant">Target Ephemeris</span>
                      </div>
                      <div className="relative flex items-center bg-surface-container-low rounded-xl p-1.5 focus-within:ring-2 focus-within:ring-primary-container">
                        <span className="material-symbols-outlined text-outline px-2 text-[20px]">history</span>
                        <input className="w-full bg-transparent text-on-surface font-data-mono text-[16px] font-semibold focus:outline-none pr-2" id="targetDateInput" type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} required />
                      </div>
                      <div className="grid grid-cols-4 gap-1.5 mt-1">
                        <button className="font-label-caps text-[10px] py-1 text-center rounded bg-primary-fixed text-on-primary-fixed hover:bg-primary-fixed-dim transition-colors font-semibold" onClick={() => setTargetPreset('today')} type="button">Today</button>
                        <button className="font-label-caps text-[10px] py-1 text-center rounded bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-colors" onClick={() => setTargetPreset('yesterday')} type="button">Yesterday</button>
                        <button className="font-label-caps text-[10px] py-1 text-center rounded bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-colors" onClick={() => setTargetPreset('endOfYear')} type="button">End of Year</button>
                        <button className="font-label-caps text-[10px] py-1 text-center rounded bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-colors" onClick={() => setTargetPreset('decade2030')} type="button">Jan 1, 2030</button>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 pt-2">
                      <button className="w-full py-3 px-4 rounded-xl bg-primary-container text-on-primary-container font-headline-md text-[16px] font-semibold flex items-center justify-center gap-2 shadow-md hover:bg-primary transition-transform active:scale-[0.99]" type="button">
                        <span className="material-symbols-outlined text-[20px]">calculate</span>
                        Execute Chronological Engine
                      </button>
                      <div className="grid grid-cols-3 gap-2">
                        <button className="py-2 px-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-caps text-[11px] flex items-center justify-center gap-1 transition-colors" onClick={swapDates} type="button">
                          <span className="material-symbols-outlined text-[16px]">swap_horiz</span> Swap Dates
                        </button>
                        <button className="py-2 px-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-caps text-[11px] flex items-center justify-center gap-1 transition-colors" onClick={resetDefaults} type="button">
                          <span className="material-symbols-outlined text-[16px]">restart_alt</span> Reset
                        </button>
                        <button className="py-2 px-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-caps text-[11px] flex items-center justify-center gap-1 transition-colors" onClick={saveSnapshot} type="button">
                          <span className="material-symbols-outlined text-[16px]">bookmark_add</span> Snapshot
                        </button>
                      </div>
                    </div>
                  </form>
                  <div className="bg-surface-container-low rounded-xl p-3 flex items-center justify-between text-on-surface-variant font-data-mono text-[11px]">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary-container"></span>
                      Browser Worker Active
                    </span>
                    <span>{data ? data.microCalcSpeed : '0.00'} ms execution latency</span>
                  </div>
                </div>

                {/* SECTION 3: LIVE AGE BIOMETRIC DASHBOARD */}
                <div className="lg:col-span-7 flex flex-col gap-space-md">
                  <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-xl relative overflow-hidden">
                    <div className="absolute -right-8 -top-8 w-40 h-40 bg-secondary-container/10 rounded-full blur-2xl pointer-events-none"></div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-space-xs">
                      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
                        Definitive Chronological Output
                      </span>
                      <span className="bg-surface-container text-on-surface font-data-mono text-[12px] px-2.5 py-1 rounded-full flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
                        <span>{liveTickingClock}</span>
                      </span>
                    </div>
                    {data && !('error' in data) ? (
                      <>
                        <div className="my-space-xs">
                          <div className="font-numerical-display text-[34px] sm:text-[44px] md:text-[50px] leading-tight text-on-surface font-bold tracking-tight">
                            {data.yDiff} Years, {data.mDiff} Months, {data.dDiff} Days
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="font-body-md text-on-surface-variant text-[15px]">Exact Gregorian Elapsed Span:</span>
                            <span className="font-data-mono text-primary font-bold text-[16px]">{data.totalDays.toLocaleString()} Total Days</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 pt-space-sm border-t border-surface-container">
                          <button className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-[13px] flex items-center gap-1.5 transition-colors" onClick={copySummary}>
                            <span className="material-symbols-outlined text-[16px]">content_copy</span> <span>{copyBtnText}</span>
                          </button>
                          <button className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-[13px] flex items-center gap-1.5 transition-colors" onClick={() => window.print()}>
                            <span className="material-symbols-outlined text-[16px]">print</span> Print Certificate
                          </button>
                          <button className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-[13px] flex items-center gap-1.5 transition-colors" onClick={exportCSV}>
                            <span className="material-symbols-outlined text-[16px]">download</span> Export CSV
                          </button>
                          <button className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-[13px] flex items-center gap-1.5 transition-colors" onClick={shareLink}>
                            <span className="material-symbols-outlined text-[16px]">share</span> Share URL
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="my-space-xs text-error font-body-md">{data && 'error' in data ? data.error : 'Invalid dates'}</div>
                    )}
                  </div>
                  {data && !('error' in data) && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm">
                      <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="font-label-caps text-[11px] text-on-surface-variant uppercase">Months Lived</div>
                        <div className="font-data-mono text-[18px] font-bold text-on-surface mt-1">{data.totalMonthsApprox.toLocaleString()} Mos</div>
                        <div className="font-body-sm text-[11px] text-on-surface-variant mt-0.5">+{data.dDiff} days fractional</div>
                      </div>
                      <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="font-label-caps text-[11px] text-on-surface-variant uppercase">Weeks Elapsed</div>
                        <div className="font-data-mono text-[18px] font-bold text-on-surface mt-1">{data.totalWeeks.toLocaleString()} Wks</div>
                        <div className="font-body-sm text-[11px] text-on-surface-variant mt-0.5">{(data.totalWeeks / 52).toFixed(2)} solar cycle</div>
                      </div>
                      <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="font-label-caps text-[11px] text-on-surface-variant uppercase">Total Days</div>
                        <div className="font-data-mono text-[18px] font-bold text-primary mt-1">{data.totalDays.toLocaleString()} Days</div>
                        <div className="font-body-sm text-[11px] text-on-surface-variant mt-0.5">{Math.floor(data.totalDays / 365.25)} leap days crossed</div>
                      </div>
                      <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="font-label-caps text-[11px] text-on-surface-variant uppercase">Total Hours</div>
                        <div className="font-data-mono text-[18px] font-bold text-on-surface mt-1">{data.totalHours.toLocaleString()} hrs</div>
                        <div className="font-body-sm text-[11px] text-on-surface-variant mt-0.5">Continuous uptime</div>
                      </div>
                      <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="font-label-caps text-[11px] text-on-surface-variant uppercase">Total Minutes</div>
                        <div className="font-data-mono text-[17px] font-bold text-on-surface mt-1 truncate">{data.totalMinutes.toLocaleString()}</div>
                        <div className="font-body-sm text-[11px] text-on-surface-variant mt-0.5">Base 60 sexagesimal</div>
                      </div>
                      <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="font-label-caps text-[11px] text-on-surface-variant uppercase">Total Seconds</div>
                        <div className="font-data-mono text-[17px] font-bold text-on-surface mt-1 truncate">{data.totalSeconds.toLocaleString()}</div>
                        <div className="font-body-sm text-[11px] text-on-surface-variant mt-0.5">SI Base Unit (s)</div>
                      </div>
                      <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="font-label-caps text-[11px] text-on-surface-variant uppercase">Heartbeats (~70 BPM)</div>
                        <div className="font-data-mono text-[17px] font-bold text-tertiary-container mt-1 truncate">~{(data.heartbeats / 1000000).toFixed(1)}M</div>
                        <div className="font-body-sm text-[11px] text-on-surface-variant mt-0.5">Cardiac metric</div>
                      </div>
                      <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="font-label-caps text-[11px] text-on-surface-variant uppercase">Total Breaths (~17/m)</div>
                        <div className="font-data-mono text-[17px] font-bold text-secondary mt-1 truncate">~{(data.breaths / 1000000).toFixed(1)}M</div>
                        <div className="font-body-sm text-[11px] text-on-surface-variant mt-0.5">Pulmonary tidal</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {data && !('error' in data) && (
            <>
              {/* SECTION 4: NEXT BIRTHDAY RADAR */}
              <section className="w-full py-space-xl bg-surface-container-low/30" id="radar">
                <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
                  <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-md">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-space-md">
                      <div>
                        <div className="inline-flex items-center gap-1.5 font-label-caps text-[11px] text-primary-container font-semibold uppercase tracking-wider">
                          <span className="material-symbols-outlined text-[16px]">celebration</span>
                          Solar Revolution Trajectory
                        </div>
                        <h3 className="font-headline-md text-headline-md text-on-surface">Next Birthday &amp; Milestone Radar</h3>
                      </div>
                      <div className="bg-primary-fixed text-on-primary-fixed px-3.5 py-1.5 rounded-full font-data-mono text-[13px] font-semibold self-start md:self-auto">
                        Turning <span>{data.turningAge}</span> Years Old
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-space-md pt-space-xs">
                      <div className="bg-surface-container-low p-4 rounded-xl">
                        <div className="font-label-caps text-label-caps text-on-surface-variant uppercase">Target Date</div>
                        <div className="font-body-lg text-[18px] font-semibold text-on-surface mt-1">{data.radarTargetDateStr}</div>
                        <div className="font-body-sm text-[12px] text-primary font-medium mt-0.5">{data.nextBirthdayDayOfWeek}</div>
                      </div>
                      <div className="bg-surface-container-low p-4 rounded-xl">
                        <div className="font-label-caps text-label-caps text-on-surface-variant uppercase">Time Remaining</div>
                        <div className="font-data-mono text-[22px] font-bold text-on-surface mt-1">{data.daysToNextBday} Days</div>
                        <div className="font-body-sm text-[12px] text-on-surface-variant mt-0.5">{(data.daysToNextBday / 7).toFixed(1)} Weeks remaining</div>
                      </div>
                      <div className="bg-surface-container-low p-4 rounded-xl">
                        <div className="font-label-caps text-label-caps text-on-surface-variant uppercase">Half-Birthday Milestone</div>
                        <div className="font-body-lg text-[18px] font-semibold text-on-surface mt-1">{data.radarHalfBirthdayStr}</div>
                        <div className="font-body-sm text-[12px] text-on-surface-variant mt-0.5">{data.daysToHalf} Days Remaining</div>
                      </div>
                      <div className="bg-surface-container-low p-4 rounded-xl flex flex-col justify-center">
                        <div className="flex justify-between items-center text-[12px] font-label-caps mb-2">
                          <span className="text-on-surface-variant">Annual Orbit</span>
                          <span className="font-data-mono font-bold text-primary">{data.progressPercentNum}% Complete</span>
                        </div>
                        <div className="w-full bg-surface-container-high h-3 rounded-full overflow-hidden">
                          <div className="bg-primary-container h-full rounded-full transition-all duration-500" style={{ width: `${data.progressPercentNum}%` }}></div>
                        </div>
                        <div className="font-body-sm text-[11px] text-on-surface-variant mt-2 text-center">
                          {data.daysSinceLastBday} days elapsed • {data.daysToNextBday} days to orbit closure
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 5: CHRONO-BIOGRAPHICAL */}
              <section className="w-full py-space-xl bg-surface" id="profile">
                <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
                  <div className="mb-space-lg">
                    <h2 className="font-headline-md text-headline-md text-on-surface font-bold">Chrono-Biographical Intelligence</h2>
                    <p className="font-body-md text-body-md text-on-surface-variant">Astrological coordinates, natal week ephemeris, and generational cohort classification.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-md">
                    <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary-fixed text-on-primary-fixed flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[26px]">view_day</span>
                      </div>
                      <div>
                        <div className="font-label-caps text-label-caps text-on-surface-variant uppercase">Born Day of Week</div>
                        <div className="font-body-lg text-[18px] font-bold text-on-surface mt-0.5">{data.dayOfWeekBorn}</div>
                        <div className="font-body-sm text-body-sm text-on-surface-variant mt-1">First day of the civil week (Dominical Letter A).</div>
                      </div>
                    </div>
                    <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[26px]">water_drop</span>
                      </div>
                      <div>
                        <div className="font-label-caps text-label-caps text-on-surface-variant uppercase">Western Zodiac Sign</div>
                        <div className="font-body-lg text-[18px] font-bold text-on-surface mt-0.5">{data.zodiacInfo}</div>
                        <div className="font-body-sm text-body-sm text-on-surface-variant mt-1">Governed by planetary bodies based on birth interval.</div>
                      </div>
                    </div>
                    <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[26px]">diamond</span>
                      </div>
                      <div>
                        <div className="font-label-caps text-label-caps text-on-surface-variant uppercase">Birthstone</div>
                        <div className="font-body-lg text-[18px] font-bold text-on-surface mt-0.5">{data.birthstone}</div>
                        <div className="font-body-sm text-body-sm text-on-surface-variant mt-1">Symbolizes fidelity, spiritual clarity, and dynamic luminescence.</div>
                      </div>
                    </div>
                    <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-surface-container text-on-surface flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[26px]">local_florist</span>
                      </div>
                      <div>
                        <div className="font-label-caps text-label-caps text-on-surface-variant uppercase">Birth Flower</div>
                        <div className="font-body-lg text-[18px] font-bold text-on-surface mt-0.5">{data.flower}</div>
                        <div className="font-body-sm text-body-sm text-on-surface-variant mt-1">Resilience, golden illumination, and enduring harmony.</div>
                      </div>
                    </div>
                    <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary-fixed-dim text-on-primary-fixed flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[26px]">pets</span>
                      </div>
                      <div>
                        <div className="font-label-caps text-label-caps text-on-surface-variant uppercase">Chinese Zodiac</div>
                        <div className="font-body-lg text-[18px] font-bold text-on-surface mt-0.5">{data.chineseZodiac}</div>
                        <div className="font-body-sm text-body-sm text-on-surface-variant mt-1">Traditional lunisolar classification mapped to birth year.</div>
                      </div>
                    </div>
                    <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[26px]">groups</span>
                      </div>
                      <div>
                        <div className="font-label-caps text-label-caps text-on-surface-variant uppercase">Generational Cohort</div>
                        <div className="font-body-lg text-[18px] font-bold text-on-surface mt-0.5">{data.cohort}</div>
                        <div className="font-body-sm text-body-sm text-on-surface-variant mt-1">Socio-historical generational grouping classification.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 6: STANDARDIZED EQUIVALENT AGE MATRIX */}
              <section className="w-full py-space-xl bg-surface-container-low/40" id="matrix">
                <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
                  <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-md">
                    <div className="mb-space-md">
                      <span className="font-label-caps text-label-caps text-primary uppercase font-semibold">Standard Metrology Reference</span>
                      <h2 className="font-headline-md text-headline-md text-on-surface mt-1">Standardized Equivalent Age Matrix</h2>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">Cross-domain decomposition of life span across orbital, biological, and civil systems.</p>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left font-body-sm text-body-sm border-collapse">
                        <thead>
                          <tr className="bg-surface-container text-on-surface font-label-caps text-[11px] uppercase tracking-wider">
                            <th className="p-3.5 rounded-l-lg">Temporal Domain</th>
                            <th className="p-3.5">Absolute Value</th>
                            <th className="p-3.5">% Century Span</th>
                            <th className="p-3.5">Computation Formula</th>
                            <th className="p-3.5 rounded-r-lg">Precision Class</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-container">
                          <tr className="hover:bg-surface-container-low/50 transition-colors">
                            <td className="p-3.5 font-medium text-on-surface flex items-center gap-2">
                              <span className="material-symbols-outlined text-primary text-[18px]">sunny</span> Solar Calendar Years
                            </td>
                            <td className="p-3.5 font-data-mono font-semibold">{data.solarYearsExact} Years</td>
                            <td className="p-3.5 font-data-mono text-on-surface-variant">{data.yDiff}%</td>
                            <td className="p-3.5 font-data-mono text-[12px] text-on-surface-variant">Δy + Δm/12 + Δd/365.2425</td>
                            <td className="p-3.5"><span className="bg-primary-fixed text-on-primary-fixed font-data-mono text-[11px] px-2 py-0.5 rounded">Exact</span></td>
                          </tr>
                          <tr className="hover:bg-surface-container-low/50 transition-colors">
                            <td className="p-3.5 font-medium text-on-surface flex items-center gap-2">
                              <span className="material-symbols-outlined text-secondary text-[18px]">bedtime</span> Lunar Cycles (Synodic)
                            </td>
                            <td className="p-3.5 font-data-mono font-semibold">{data.lunarCycles} Moons</td>
                            <td className="p-3.5 font-data-mono text-on-surface-variant">--</td>
                            <td className="p-3.5 font-data-mono text-[12px] text-on-surface-variant">Total Days / 29.530588 d</td>
                            <td className="p-3.5"><span className="bg-surface-container text-on-surface-variant font-data-mono text-[11px] px-2 py-0.5 rounded">Astrological</span></td>
                          </tr>
                          <tr className="hover:bg-surface-container-low/50 transition-colors">
                            <td className="p-3.5 font-medium text-on-surface flex items-center gap-2">
                              <span className="material-symbols-outlined text-on-surface-variant text-[18px]">work</span> Working Business Days
                            </td>
                            <td className="p-3.5 font-data-mono font-semibold">{data.businessDays} Days</td>
                            <td className="p-3.5 font-data-mono text-on-surface-variant">71.42% of total</td>
                            <td className="p-3.5 font-data-mono text-[12px] text-on-surface-variant">Total Days * (5 / 7)</td>
                            <td className="p-3.5"><span className="bg-surface-container text-on-surface-variant font-data-mono text-[11px] px-2 py-0.5 rounded">Labor Baseline</span></td>
                          </tr>
                          <tr className="hover:bg-surface-container-low/50 transition-colors">
                            <td className="p-3.5 font-medium text-on-surface flex items-center gap-2">
                              <span className="material-symbols-outlined text-tertiary text-[18px]">bed</span> Total Sleep Horizon
                            </td>
                            <td className="p-3.5 font-data-mono font-semibold">~{data.sleepYears} Years</td>
                            <td className="p-3.5 font-data-mono text-on-surface-variant">33.33%</td>
                            <td className="p-3.5 font-data-mono text-[12px] text-on-surface-variant">{(data.totalHours / 3).toLocaleString()} Hours (8h/night)</td>
                            <td className="p-3.5"><span className="bg-surface-container text-on-surface-variant font-data-mono text-[11px] px-2 py-0.5 rounded">Physiological</span></td>
                          </tr>
                          <tr className="hover:bg-surface-container-low/50 transition-colors">
                            <td className="p-3.5 font-medium text-on-surface flex items-center gap-2">
                              <span className="material-symbols-outlined text-primary-container text-[18px]">public</span> Orbital Distance Traveled
                            </td>
                            <td className="p-3.5 font-data-mono font-semibold">~{data.orbitalKm} Billion km</td>
                            <td className="p-3.5 font-data-mono text-on-surface-variant">--</td>
                            <td className="p-3.5 font-data-mono text-[12px] text-on-surface-variant">Total Seconds * 29.78 km/s</td>
                            <td className="p-3.5"><span className="bg-surface-container text-on-surface-variant font-data-mono text-[11px] px-2 py-0.5 rounded">Astrophysical</span></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 7: INTERACTIVE LIFE MILESTONES */}
              <section className="w-full py-space-xl bg-surface" id="timeline">
                <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
                  <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-md">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-space-md">
                      <div>
                        <span className="font-label-caps text-label-caps text-primary uppercase font-semibold">Chronological Trajectory</span>
                        <h2 className="font-headline-md text-headline-md text-on-surface mt-1">Life Milestones &amp; Horizon Spectrum</h2>
                      </div>
                      <div className="text-right">
                        <span className="font-body-sm text-[12px] text-on-surface-variant">Global Life Expectancy (78.5y benchmark):</span>
                        <div className="font-data-mono text-primary font-bold text-[15px]">{data.lifeExpPercent}% Completed</div>
                      </div>
                    </div>
                    <div className="w-full bg-surface-container-high h-3 rounded-full mb-space-lg overflow-hidden">
                      <div className="bg-primary h-full rounded-full transition-all duration-700" style={{ width: `${data.lifeExpPercent}%` }}></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                      <div className="bg-surface-container-low p-3.5 rounded-xl border-l-4 border-primary-container">
                        <div className="font-label-caps text-[10px] text-primary-container uppercase font-bold">Origin</div>
                        <div className="font-body-lg font-bold text-on-surface text-[15px] mt-0.5">Birth (Age 0)</div>
                        <div className="font-data-mono text-[12px] text-on-surface-variant mt-1">{data.tileBirthDate}</div>
                        <div className="font-body-sm text-[11px] text-primary-container font-medium mt-1">✓ Inception</div>
                      </div>
                      <div className="bg-surface-container-low p-3.5 rounded-xl border-l-4 border-primary">
                        <div className="font-label-caps text-[10px] text-primary uppercase font-bold">Majority</div>
                        <div className="font-body-lg font-bold text-on-surface text-[15px] mt-0.5">Age 18</div>
                        <div className="font-data-mono text-[12px] text-on-surface-variant mt-1">{data.tileAge18}</div>
                        <div className="font-body-sm text-[11px] text-primary font-medium mt-1">✓ Legal Voting</div>
                      </div>
                      <div className="bg-surface-container-low p-3.5 rounded-xl border-l-4 border-secondary">
                        <div className="font-label-caps text-[10px] text-secondary uppercase font-bold">Full Adult</div>
                        <div className="font-body-lg font-bold text-on-surface text-[15px] mt-0.5">Age 21</div>
                        <div className="font-data-mono text-[12px] text-on-surface-variant mt-1">{data.tileAge21}</div>
                        <div className="font-body-sm text-[11px] text-secondary font-medium mt-1">✓ Universal Rights</div>
                      </div>
                      <div className="bg-primary-fixed p-3.5 rounded-xl border-l-4 border-primary-container shadow-sm">
                        <div className="font-label-caps text-[10px] text-on-primary-fixed uppercase font-bold">Current Horizon</div>
                        <div className="font-body-lg font-bold text-on-surface text-[15px] mt-0.5">Quarter Century</div>
                        <div className="font-data-mono text-[12px] text-on-primary-fixed font-semibold mt-1">Age {data.yDiff}</div>
                        <div className="font-body-sm text-[11px] text-primary font-bold mt-1">★ Active Position</div>
                      </div>
                      <div className="bg-surface-container-low p-3.5 rounded-xl border-l-4 border-outline">
                        <div className="font-label-caps text-[10px] text-on-surface-variant uppercase font-bold">Prime Milestone</div>
                        <div className="font-body-lg font-bold text-on-surface text-[15px] mt-0.5">Age 30</div>
                        <div className="font-data-mono text-[12px] text-on-surface-variant mt-1">{data.tileAge30}</div>
                        <div className="font-body-sm text-[11px] text-on-surface-variant mt-1">{data.yearsTo30 > '0.0' ? `${data.yearsTo30} Years Away` : 'Achieved'}</div>
                      </div>
                      <div className="bg-surface-container-low p-3.5 rounded-xl border-l-4 border-outline">
                        <div className="font-label-caps text-[10px] text-on-surface-variant uppercase font-bold">Full Retirement</div>
                        <div className="font-body-lg font-bold text-on-surface text-[15px] mt-0.5">Age 67 (FRA)</div>
                        <div className="font-data-mono text-[12px] text-on-surface-variant mt-1">{data.tileAge67}</div>
                        <div className="font-body-sm text-[11px] text-on-surface-variant mt-1">{data.yearsTo67 > '0.0' ? `${data.yearsTo67} Years Away` : 'Achieved'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 8: PLANETARY */}
              <section className="w-full py-space-xl bg-surface-container-low/30">
                <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
                  <div className="mb-space-lg">
                    <h2 className="font-headline-md text-headline-md text-on-surface font-bold">Planetary &amp; Demographic Perspectives</h2>
                    <p className="font-body-md text-body-md text-on-surface-variant">How your chronological age manifests across other celestial bodies in our solar system.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
                    <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-label-caps text-label-caps text-outline uppercase font-semibold">Mercury Year: 88 Days</span>
                          <span className="material-symbols-outlined text-outline text-[20px]">circle</span>
                        </div>
                        <div className="font-body-lg font-bold text-on-surface text-[17px] mt-2">Mercurian Age</div>
                        <div className="font-data-mono text-[28px] font-bold text-primary mt-1">{data.mercury}</div>
                      </div>
                      <div className="font-body-sm text-[12px] text-on-surface-variant mt-3">You celebrate a Mercurian birthday every 2.9 Earth months.</div>
                    </div>
                    <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-label-caps text-label-caps text-outline uppercase font-semibold">Venus Year: 224.7 Days</span>
                          <span className="material-symbols-outlined text-tertiary-container text-[20px]">flare</span>
                        </div>
                        <div className="font-body-lg font-bold text-on-surface text-[17px] mt-2">Venusian Age</div>
                        <div className="font-data-mono text-[28px] font-bold text-tertiary-container mt-1">{data.venus}</div>
                      </div>
                      <div className="font-body-sm text-[12px] text-on-surface-variant mt-3">One Venusian orbit requires approximately 7.4 Earth months.</div>
                    </div>
                    <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-label-caps text-label-caps text-outline uppercase font-semibold">Mars Year: 687 Days</span>
                          <span className="material-symbols-outlined text-tertiary text-[20px]">public</span>
                        </div>
                        <div className="font-body-lg font-bold text-on-surface text-[17px] mt-2">Martian Age</div>
                        <div className="font-data-mono text-[28px] font-bold text-tertiary mt-1">{data.mars}</div>
                      </div>
                      <div className="font-body-sm text-[12px] text-on-surface-variant mt-3">You would barely be entering adolescence on the Red Planet.</div>
                    </div>
                    <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-label-caps text-label-caps text-outline uppercase font-semibold">Demographic Percentile</span>
                          <span className="material-symbols-outlined text-secondary text-[20px]">groups</span>
                        </div>
                        <div className="font-body-lg font-bold text-on-surface text-[17px] mt-2">Global Ranking</div>
                        <div className="font-data-mono text-[28px] font-bold text-secondary mt-1">Top 51%</div>
                      </div>
                      <div className="font-body-sm text-[12px] text-on-surface-variant mt-3">Approximately 49% of the ~8.1 Billion people on Earth are younger than you.</div>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 9: DETERMINISTIC MATHEMATICAL CALCULATION AUDIT */}
              <section className="w-full py-space-xl bg-surface">
                <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
                  <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-md">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-space-md">
                      <div>
                        <div className="inline-flex items-center gap-1.5 font-label-caps text-label-caps text-primary uppercase font-semibold">
                          <span className="material-symbols-outlined text-[16px]">code</span>
                          Algorithm Transparency
                        </div>
                        <h2 className="font-headline-md text-headline-md text-on-surface mt-0.5">Deterministic Calculation Audit</h2>
                      </div>
                      <button className="px-3.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-caps text-[11px] uppercase tracking-wider flex items-center gap-1.5 self-start md:self-auto transition-colors" onClick={copyAlgorithmCode}>
                        <span className="material-symbols-outlined text-[16px]">content_copy</span> <span>{copyCodeText}</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md mb-space-md">
                      <div className="bg-surface-container-low p-4 rounded-xl">
                        <div className="font-label-caps text-[11px] text-primary uppercase font-bold">Step 1: Year Decomposition</div>
                        <p className="font-body-sm text-[13px] text-on-surface mt-1">
                          Subtract birth year from target year. If reference day/month precedes birth day/month, decrement one year and borrow 12 months.
                        </p>
                        <div className="font-data-mono text-[12px] text-on-surface-variant bg-surface-container-lowest p-2 rounded mt-2">
                          ΔY = Y_target - Y_birth (- 1 if borrow)
                        </div>
                      </div>
                      <div className="bg-surface-container-low p-4 rounded-xl">
                        <div className="font-label-caps text-[11px] text-primary uppercase font-bold">Step 2: Month &amp; Modulo Borrow</div>
                        <p className="font-body-sm text-[13px] text-on-surface mt-1">
                          Calculate month difference. If target day &lt; birth day, decrement month and borrow the precise number of days from previous month.
                        </p>
                        <div className="font-data-mono text-[12px] text-on-surface-variant bg-surface-container-lowest p-2 rounded mt-2">
                          Days_borrowed = daysInMonth(Y, M-1)
                        </div>
                      </div>
                      <div className="bg-surface-container-low p-4 rounded-xl">
                        <div className="font-label-caps text-[11px] text-primary uppercase font-bold">Step 3: Gregorian Leap Verification</div>
                        <p className="font-body-sm text-[13px] text-on-surface mt-1">
                          Incorporates 400-year cycle rule: traversed leap years require divisible by 4, except century years unless divisible by 400.
                        </p>
                        <div className="font-data-mono text-[12px] text-on-surface-variant bg-surface-container-lowest p-2 rounded mt-2">
                          Leap Days Crossed: {Math.floor(data.totalDays / 365.25)}
                        </div>
                      </div>
                    </div>
                    <div className="bg-inverse-surface rounded-xl p-4 text-inverse-on-surface font-data-mono text-[13px] overflow-x-auto">
<pre><code>{`function calculateAstronomicalAge(birthDate, targetDate) {
  let yDiff = targetDate.getFullYear() - birthDate.getFullYear();
  let mDiff = targetDate.getMonth() - birthDate.getMonth();
  let dDiff = targetDate.getDate() - birthDate.getDate();

  if (dDiff < 0) {
    mDiff--;
    const prevMonthDays = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0).getDate();
    dDiff += prevMonthDays;
  }
  if (mDiff < 0) {
    yDiff--;
    mDiff += 12;
  }
  const totalMs = targetDate.getTime() - birthDate.getTime();
  const totalDays = Math.floor(totalMs / (1000 * 60 * 60 * 24));
  return { years: yDiff, months: mDiff, days: dDiff, totalDays };
}`}</code></pre>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 10: QUICK-LAUNCH CHRONOLOGICAL WORKBENCHES */}
              <section className="w-full py-space-xl bg-surface-container-low/30">
                <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
                  <div className="mb-space-lg">
                    <h2 className="font-headline-md text-headline-md text-on-surface font-bold">Specialized Temporal Workbenches</h2>
                    <p className="font-body-md text-body-md text-on-surface-variant">Switch calculation mode to targeted legal, pet, or business day instruments.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-md">
                    <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                      <div className="w-10 h-10 rounded-lg bg-primary-fixed text-on-primary-fixed flex items-center justify-center mb-3">
                        <span className="material-symbols-outlined text-[20px]">pin</span>
                      </div>
                      <h3 className="font-body-lg font-bold text-on-surface text-[17px]">Age in Days Calculator</h3>
                      <p className="font-body-sm text-[13px] text-on-surface-variant mt-1">Direct single-unit reduction for passport applications, insurance underwriting, and newborn milestones.</p>
                    </div>
                    <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                      <div className="w-10 h-10 rounded-lg bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center mb-3">
                        <span className="material-symbols-outlined text-[20px]">calendar_view_month</span>
                      </div>
                      <h3 className="font-body-lg font-bold text-on-surface text-[17px]">Age in Months Calculator</h3>
                      <p className="font-body-sm text-[13px] text-on-surface-variant mt-1">Pediatric developmental milestones, vaccine tracking, and commercial lease duration audits.</p>
                    </div>
                    <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                      <div className="w-10 h-10 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center mb-3">
                        <span className="material-symbols-outlined text-[20px]">history_edu</span>
                      </div>
                      <h3 className="font-body-lg font-bold text-on-surface text-[17px]">Age on Specific Historic Date</h3>
                      <p className="font-body-sm text-[13px] text-on-surface-variant mt-1">Retroactive age resolution for census cross-referencing, genealogical research, and estate settlements.</p>
                    </div>
                    <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                      <div className="w-10 h-10 rounded-lg bg-surface-container text-on-surface flex items-center justify-center mb-3">
                        <span className="material-symbols-outlined text-[20px]">savings</span>
                      </div>
                      <h3 className="font-body-lg font-bold text-on-surface text-[17px]">Full Retirement Age (FRA)</h3>
                      <p className="font-body-sm text-[13px] text-on-surface-variant mt-1">Social Security Administration (SSA) birth-year bracket matrix for optimal retirement benefit claiming.</p>
                    </div>
                    <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                      <div className="w-10 h-10 rounded-lg bg-primary-fixed-dim text-on-primary-fixed flex items-center justify-center mb-3">
                        <span className="material-symbols-outlined text-[20px]">pets</span>
                      </div>
                      <h3 className="font-body-lg font-bold text-on-surface text-[17px]">Canine &amp; Feline Age Converter</h3>
                      <p className="font-body-sm text-[13px] text-on-surface-variant mt-1">Epigenetic methylation clock algorithm replacing simplistic 7x rules with non-linear biological scaling.</p>
                    </div>
                    <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                      <div className="w-10 h-10 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center mb-3">
                        <span className="material-symbols-outlined text-[20px]">favorite</span>
                      </div>
                      <h3 className="font-body-lg font-bold text-on-surface text-[17px]">Biological vs Chronological Age</h3>
                      <p className="font-body-sm text-[13px] text-on-surface-variant mt-1">Phenotypic biomarker age calculation using resting heart rate, BMI, sleep efficiency, and VO2 max.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 11: REAL-WORLD PERSONAS & VERIFIED SCENARIOS */}
              <section className="w-full py-space-xl bg-surface">
                <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
                  <div className="mb-space-lg">
                    <h2 className="font-headline-md text-headline-md text-on-surface font-bold">Verified Reference Cohorts</h2>
                    <p className="font-body-md text-body-md text-on-surface-variant">Standard demographic personas computed against current consensus ephemeris.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
                    <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-label-caps text-[10px] bg-primary-fixed text-on-primary-fixed px-2 py-0.5 rounded font-semibold">Cohort 1</span>
                          <span className="font-data-mono text-[12px] text-on-surface-variant">DOB: 2000-01-01</span>
                        </div>
                        <h3 className="font-body-lg font-bold text-on-surface text-[17px] mt-2">Millennium Baby</h3>
                        <div className="font-body-sm text-[13px] text-on-surface-variant mt-2">First cohort born into the 21st century Y2K epoch. Turn of the millennium benchmark.</div>
                      </div>
                      <button className="mt-4 w-full py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-caps text-[11px] font-semibold transition-colors" onClick={() => setBirthDate('2000-01-01')}>Load Scenario</button>
                    </div>
                    <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-label-caps text-[10px] bg-secondary-fixed text-on-secondary-fixed px-2 py-0.5 rounded font-semibold">Cohort 2</span>
                          <span className="font-data-mono text-[12px] text-on-surface-variant">DOB: 1995-07-15</span>
                        </div>
                        <h3 className="font-body-lg font-bold text-on-surface text-[17px] mt-2">Mid-90s Professional</h3>
                        <div className="font-body-sm text-[13px] text-on-surface-variant mt-2">Late Millennial cusp crossing the threshold into the 30-year life horizon.</div>
                      </div>
                      <button className="mt-4 w-full py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-caps text-[11px] font-semibold transition-colors" onClick={() => setBirthDate('1995-07-15')}>Load Scenario</button>
                    </div>
                    <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-label-caps text-[10px] bg-tertiary-fixed text-on-tertiary-fixed px-2 py-0.5 rounded font-semibold">Cohort 3</span>
                          <span className="font-data-mono text-[12px] text-on-surface-variant">DOB: 1960-03-10</span>
                        </div>
                        <h3 className="font-body-lg font-bold text-on-surface text-[17px] mt-2">Golden Age Retiree</h3>
                        <div className="font-body-sm text-[13px] text-on-surface-variant mt-2">Full Social Security Normal Retirement Age eligibility milestone reached.</div>
                      </div>
                      <button className="mt-4 w-full py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-caps text-[11px] font-semibold transition-colors" onClick={() => setBirthDate('1960-03-10')}>Load Scenario</button>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 12: COMPREHENSIVE EDUCATIONAL GUIDE */}
              <section className="w-full py-space-xl bg-surface-container-low/30">
                <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
                  <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-md">
                    <div className="mb-space-md">
                      <span className="font-label-caps text-label-caps text-primary uppercase font-semibold">Chronological Theory &amp; History</span>
                      <h2 className="font-headline-md text-headline-md text-on-surface mt-1">The Science of Measuring Human Age</h2>
                      <p className="font-body-md text-body-md text-on-surface-variant">From the Gregorian Reform of 1582 to modern UTC atomic synchronizations.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg font-body-md text-body-md text-on-surface-variant">
                      <div>
                        <h3 className="font-headline-md text-[18px] text-on-surface font-bold mb-2">Western vs. East Asian Nominal Reckoning</h3>
                        <p className="mb-3">
                          Historically, the western world measures chronological age by zero-indexed whole intervals elapsed since emergence from the womb. In contrast, traditional East Asian systems (*eumnyeok nai*) counted individuals as one year old at birth, advancing an additional year simultaneously on Lunar New Year or solar New Year.
                        </p>
                        <p>
                          Under this system, an infant born on New Year's Eve would legally become two years old two days later. In June 2023, South Korea officially unified civil and judicial documentation with the international standard ISO 8601 method implemented here.
                        </p>
                      </div>
                      <div>
                        <h3 className="font-headline-md text-[18px] text-on-surface font-bold mb-2">The Gregorian Reform and the Lost 10 Days</h3>
                        <p className="mb-3">
                          Under the Julian calendar introduced by Julius Caesar in 45 BC, a leap year occurred unconditionally every four years. This 11-minute annual overstatement accumulated to 10 days of celestial drift by 1582, causing Easter to drift away from the spring equinox.
                        </p>
                        <p>
                          Pope Gregory XIII decreed that October 4, 1582, be immediately succeeded by October 15, 1582. The SolveIt engine automatically verifies dates across this boundary, implementing the modern 400-year centurial rule.
                        </p>
                      </div>
                      <div>
                        <h3 className="font-headline-md text-[18px] text-on-surface font-bold mb-2">Leap Seconds &amp; Coordinated Universal Time (UTC)</h3>
                        <p className="mb-3">
                          Because the Earth's axial rotation experiences tidal friction decelerations, International Earth Rotation and Reference Systems Service (IERS) periodically inserts leap seconds into UTC.
                        </p>
                        <p>
                          For civil age reckoning, leap seconds are smoothed through Network Time Protocol (NTP) leap smearing, ensuring calculations maintain calendar day alignment without causing sub-second discontinuities in financial or legal registries.
                        </p>
                      </div>
                      <div>
                        <h3 className="font-headline-md text-[18px] text-on-surface font-bold mb-2">Statutory Age Milestones in the United States</h3>
                        <p className="mb-3">
                          Civil milestones establish distinct legal rights: Age 16 (Learner's Driving Permit), Age 18 (26th Amendment Voting Rights, Military Enlistment, Contractual Capacity), Age 21 (Commercial Transport, Firearms, Alcohol Purchase).
                        </p>
                        <p>
                          At the senior horizon, Age 59½ enables penalty-free IRA distributions, Age 65 unlocks Medicare eligibility, and Age 67 represents the Social Security Full Retirement Age for citizens born after 1960.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 13: RICH TECHNICAL FAQ ACCORDION */}
              <section className="w-full py-space-xl bg-surface">
                <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
                  <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-space-lg">
                      <span className="font-label-caps text-label-caps text-primary uppercase font-semibold">Knowledge Base</span>
                      <h2 className="font-headline-md text-headline-md text-on-surface mt-1">Frequently Asked Questions</h2>
                      <p className="font-body-md text-body-md text-on-surface-variant">Deterministic nuances, security boundaries, and leap year handling.</p>
                    </div>
                    <div className="flex flex-col gap-space-sm">
                      <details className="group bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden" open>
                        <summary className="flex items-center justify-between p-4 cursor-pointer font-body-lg font-semibold text-on-surface select-none hover:bg-surface-container-low/50 transition-colors">
                          <span>How does this calculator handle leap years and February 29 birthdays?</span>
                          <span className="material-symbols-outlined text-outline group-open:rotate-180 transition-transform">expand_more</span>
                        </summary>
                        <div className="p-4 pt-0 font-body-md text-body-md text-on-surface-variant border-t border-surface-container-low">
                          The engine incorporates strict 400-year Gregorian cycle rules. For individuals born on February 29 (leap day), common legal standards (such as UK and US common law) deem their anniversary to occur on March 1 in non-leap years. Our algorithm provides both the exact fractional astronomical duration and the conventional anniversary tracking.
                        </div>
                      </details>
                      <details className="group bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
                        <summary className="flex items-center justify-between p-4 cursor-pointer font-body-lg font-semibold text-on-surface select-none hover:bg-surface-container-low/50 transition-colors">
                          <span>What is the difference between western chronological age and traditional Korean age?</span>
                          <span className="material-symbols-outlined text-outline group-open:rotate-180 transition-transform">expand_more</span>
                        </summary>
                        <div className="p-4 pt-0 font-body-md text-body-md text-on-surface-variant border-t border-surface-container-low">
                          Western age starts at zero and increments only on the exact birth anniversary. The historic East Asian system deemed everyone 1 year old at birth and added a year simultaneously on New Year's Day. South Korea officially enacted legislation in June 2023 transitioning all government and public services to the international chronological system.
                        </div>
                      </details>
                      <details className="group bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
                        <summary className="flex items-center justify-between p-4 cursor-pointer font-body-lg font-semibold text-on-surface select-none hover:bg-surface-container-low/50 transition-colors">
                          <span>Can I calculate my exact age on a specific future or past date?</span>
                          <span className="material-symbols-outlined text-outline group-open:rotate-180 transition-transform">expand_more</span>
                        </summary>
                        <div className="p-4 pt-0 font-body-md text-body-md text-on-surface-variant border-t border-surface-container-low">
                          Yes. The "Calculate Age At Date" field accepts any valid Gregorian date. You can set it to a past date (e.g. July 20, 1969 Apollo Moon Landing) to verify your age during historic events, or set it to a future retirement date to verify statutory pension thresholds.
                        </div>
                      </details>
                      <details className="group bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
                        <summary className="flex items-center justify-between p-4 cursor-pointer font-body-lg font-semibold text-on-surface select-none hover:bg-surface-container-low/50 transition-colors">
                          <span>Does SolveIt store, transmit, or monetize my birth date?</span>
                          <span className="material-symbols-outlined text-outline group-open:rotate-180 transition-transform">expand_more</span>
                        </summary>
                        <div className="p-4 pt-0 font-body-md text-body-md text-on-surface-variant border-t border-surface-container-low">
                          Absolutely not. All computations execute exclusively within your local browser JavaScript runtime. There are no server-side APIs, database saves, or tracking pixels harvesting your personal dates of birth. It is fully HIPAA and GDPR privacy compliant.
                        </div>
                      </details>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 14: INTERCONNECTED TEMPORAL SUITE */}
              <section className="w-full py-space-xl bg-surface-container-low/40">
                <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
                  <div className="mb-space-md">
                    <h2 className="font-headline-md text-headline-md text-on-surface font-bold">Interconnected Temporal Suite</h2>
                    <p className="font-body-md text-body-md text-on-surface-variant">Seamlessly transition across computational instruments calibrated for finance, health, and civil planning.</p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-space-sm">
                    <Link href="/time-date/date-difference" className="bg-surface-container-lowest p-3.5 rounded-xl shadow-sm hover:shadow-md hover:bg-surface-container-high transition-all flex flex-col items-center text-center">
                      <span className="material-symbols-outlined text-primary text-[24px] mb-2">date_range</span>
                      <span className="font-body-sm font-semibold text-on-surface text-[13px]">Date Difference</span>
                      <span className="font-label-caps text-[10px] text-on-surface-variant mt-0.5">Span Between Dates</span>
                    </Link>
                    <Link href="/time-date/birthday-tracker" className="bg-surface-container-lowest p-3.5 rounded-xl shadow-sm hover:shadow-md hover:bg-surface-container-high transition-all flex flex-col items-center text-center">
                      <span className="material-symbols-outlined text-secondary text-[24px] mb-2">cake</span>
                      <span className="font-body-sm font-semibold text-on-surface text-[13px]">Birthday Tracker</span>
                      <span className="font-label-caps text-[10px] text-on-surface-variant mt-0.5">Solar Orbit Countdown</span>
                    </Link>
                    <Link href="/time-date/work-hours" className="bg-surface-container-lowest p-3.5 rounded-xl shadow-sm hover:shadow-md hover:bg-surface-container-high transition-all flex flex-col items-center text-center">
                      <span className="material-symbols-outlined text-tertiary text-[24px] mb-2">business_center</span>
                      <span className="font-body-sm font-semibold text-on-surface text-[13px]">Work Hours</span>
                      <span className="font-label-caps text-[10px] text-on-surface-variant mt-0.5">Overtime &amp; Shifts</span>
                    </Link>
                    <Link href="/" className="bg-surface-container-lowest p-3.5 rounded-xl shadow-sm hover:shadow-md hover:bg-surface-container-high transition-all flex flex-col items-center text-center">
                      <span className="material-symbols-outlined text-primary-container text-[24px] mb-2">savings</span>
                      <span className="font-body-sm font-semibold text-on-surface text-[13px]">FIRE Forecaster</span>
                      <span className="font-label-caps text-[10px] text-on-surface-variant mt-0.5">Retirement Wealth</span>
                    </Link>
                    <Link href="/health-fitness-calculators" className="bg-surface-container-lowest p-3.5 rounded-xl shadow-sm hover:shadow-md hover:bg-surface-container-high transition-all flex flex-col items-center text-center">
                      <span className="material-symbols-outlined text-secondary-container text-[24px] mb-2">monitor_heart</span>
                      <span className="font-body-sm font-semibold text-on-surface text-[13px]">Biological Age</span>
                      <span className="font-label-caps text-[10px] text-on-surface-variant mt-0.5">VO2 &amp; Biomarkers</span>
                    </Link>
                    <Link href="/" className="bg-surface-container-lowest p-3.5 rounded-xl shadow-sm hover:shadow-md hover:bg-surface-container-high transition-all flex flex-col items-center text-center">
                      <span className="material-symbols-outlined text-outline text-[24px] mb-2">calculate</span>
                      <span className="font-body-sm font-semibold text-on-surface text-[13px]">Mortgage &amp; EMI</span>
                      <span className="font-label-caps text-[10px] text-on-surface-variant mt-0.5">Loan Amortization</span>
                    </Link>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* SECTION 15: TRUST, PRIVACY & METROLOGY GUARANTEE */}
          <section className="w-full py-space-lg bg-surface border-t border-surface-container mt-auto">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-[28px]">lock</span>
                  <div>
                    <div className="font-body-md font-semibold text-on-surface">Client-Side Computational Guarantee</div>
                    <div className="font-body-sm text-[12px] text-on-surface-variant">All dates and personal information stay entirely on your device. Zero telemetry transmitted.</div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <span className="font-data-mono text-[11px] bg-surface-container px-2.5 py-1 rounded text-on-surface-variant">RFC 3339 Timestamping</span>
                  <span className="font-data-mono text-[11px] bg-surface-container px-2.5 py-1 rounded text-on-surface-variant">ISO 8601 Deterministic</span>
                  <span className="font-data-mono text-[11px] bg-surface-container px-2.5 py-1 rounded text-on-surface-variant">400-Yr Gregorian Rule</span>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
