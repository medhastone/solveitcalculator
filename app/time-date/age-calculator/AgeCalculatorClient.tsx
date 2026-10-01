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

  const [birthDate, setBirthDate] = useState('1999-10-24');
  const [birthTime, setBirthTime] = useState('14:35');
  const [targetDate, setTargetDate] = useState('2025-02-27');
  const [liveTickingClock, setLiveTickingClock] = useState('');
  const [copyBtnText, setCopyBtnText] = useState('Copy Summary');
  const [copyCodeText, setCopyCodeText] = useState('Copy Code');

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      const d = new Date();
      const h = String(d.getHours()).padStart(2, '0');
      const m = String(d.getMinutes()).padStart(2, '0');
      const s = String(d.getSeconds()).padStart(2, '0');
      setLiveTickingClock(`${h}:${m}:${s} live`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const data = useMemo(() => {
    const startTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
    
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
      alert(`Age Saved:\n${data.yDiff} Years, ${data.mDiff} Months, ${data.dDiff} Days`);
    }
  }, [data]);

  const copySummary = useCallback(() => {
    if (data && !('error' in data)) {
      const summary = `Exact Age: ${data.yDiff} Years, ${data.mDiff} Months, ${data.dDiff} Days (${data.totalDays.toLocaleString()} Total Days lived). Calculated on SolveIt.`;
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
      a.setAttribute('download', `age-calculation-${birthDate}.csv`);
      a.click();
    }
  }, [birthDate, targetDate, data]);

  const shareLink = useCallback(() => {
    const url = `${window.location.origin}${window.location.pathname}?dob=${birthDate}`;
    navigator.clipboard.writeText(url).then(() => {
      alert("Link copied to clipboard:\n" + url);
    });
  }, [birthDate]);

  const copyAlgorithmCode = useCallback(() => {
    const code = `function calculateAge(birthDate, targetDate) {
  let years = targetDate.getFullYear() - birthDate.getFullYear();
  let months = targetDate.getMonth() - birthDate.getMonth();
  let days = targetDate.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    const prevMonthDays = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0).getDate();
    days += prevMonthDays;
  }
  if (months < 0) {
    years--;
    months += 12;
  }
  return { years, months, days };
}`;
    navigator.clipboard.writeText(code).then(() => {
      setCopyCodeText("Copied!");
      setTimeout(() => { setCopyCodeText("Copy Code"); }, 2000);
    });
  }, []);

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface">
      
      <main className="w-full pt-0 bg-surface min-h-[calc(100vh-64px)]">
        <div className="flex flex-col w-full">
          
          {/* SECTION 1: HEADER & OVERVIEW */}
          <section className="w-full bg-surface-container-low/40 border-b border-surface-container/60 pb-space-2xl pt-space-lg">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
              <div className="flex flex-wrap items-center justify-between gap-space-sm mb-space-md">
                <nav aria-label="Breadcrumb" className="flex items-center gap-space-2xs font-body-sm text-body-sm text-on-surface-variant">
                  <Link className="hover:text-primary transition-colors" href="/">Home</Link>
                  <span className="text-outline-variant">/</span>
                  <Link className="hover:text-primary transition-colors" href="/time-date">Time &amp; Date</Link>
                  <span className="text-outline-variant">/</span>
                  <span className="text-on-surface font-medium">Age Calculator</span>
                </nav>
                <div className="flex items-center gap-space-xs font-data-mono text-[11px] text-on-surface-variant bg-surface-container border border-outline-variant/30 px-3 py-1 rounded-full shadow-sm">
                  <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                  <span>100% Free</span>
                  <span className="text-outline-variant">|</span>
                  <span>Instant Results</span>
                  <span className="text-outline-variant">|</span>
                  <span>Leap Year Accurate</span>
                </div>
              </div>
              <div className="max-w-4xl mb-space-lg">
                <div className="inline-flex items-center gap-space-xs bg-primary/10 border border-primary/20 text-primary font-label-caps text-label-caps px-3 py-1 rounded-full uppercase tracking-wider mb-space-sm font-semibold">
                  <span className="material-symbols-outlined text-[15px]">cake</span>
                  Exact Age &amp; Birthday Calculator
                </div>
                <h1 className="font-headline-lg text-headline-lg md:text-[42px] md:leading-[50px] text-on-surface tracking-tight font-bold mb-space-sm">
                  Age Calculator
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl">
                  Calculate your exact age in years, months, weeks, days, hours, and seconds. Find your next birthday countdown, zodiac sign, birthstone, life milestones, and fun facts.
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-space-sm mb-space-xl">
                <div className="bg-surface-container-lowest border border-outline-variant/30 p-3.5 rounded-xl shadow-sm flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-[24px]">bolt</span>
                  <div>
                    <div className="font-label-caps text-[11px] text-on-surface font-semibold">Instant Results</div>
                    <div className="font-body-sm text-[12px] text-on-surface-variant">Calculated immediately</div>
                  </div>
                </div>
                <div className="bg-surface-container-lowest border border-outline-variant/30 p-3.5 rounded-xl shadow-sm flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary text-[24px]">event_repeat</span>
                  <div>
                    <div className="font-label-caps text-[11px] text-on-surface font-semibold">Leap Year Accurate</div>
                    <div className="font-body-sm text-[12px] text-on-surface-variant">Handles leap days precisely</div>
                  </div>
                </div>
                <div className="bg-surface-container-lowest border border-outline-variant/30 p-3.5 rounded-xl shadow-sm flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-[24px]">lock</span>
                  <div>
                    <div className="font-label-caps text-[11px] text-on-surface font-semibold">100% Private</div>
                    <div className="font-body-sm text-[12px] text-on-surface-variant">No data leaves your device</div>
                  </div>
                </div>
                <div className="bg-surface-container-lowest border border-outline-variant/30 p-3.5 rounded-xl shadow-sm flex items-center gap-3">
                  <span className="material-symbols-outlined text-tertiary text-[24px]">stars</span>
                  <div>
                    <div className="font-label-caps text-[11px] text-on-surface font-semibold">Birthday Fun Facts</div>
                    <div className="font-body-sm text-[12px] text-on-surface-variant">Zodiac, stones &amp; planets</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 -mb-2 no-scrollbar">
                <a className="bg-primary text-on-primary font-label-caps text-label-caps px-4 py-2 rounded-lg shadow-sm whitespace-nowrap flex items-center gap-1.5 hover:opacity-95 transition-opacity" href="#calculator">
                  <span className="material-symbols-outlined text-[16px]">schedule</span> Age Calculator
                </a>
                <a className="bg-surface-container-lowest border border-outline-variant/30 text-on-surface-variant hover:text-on-surface font-label-caps text-label-caps px-4 py-2 rounded-lg shadow-sm whitespace-nowrap transition-colors flex items-center gap-1.5" href="#countdown">
                  <span className="material-symbols-outlined text-[16px]">cake</span> Next Birthday
                </a>
                <a className="bg-surface-container-lowest border border-outline-variant/30 text-on-surface-variant hover:text-on-surface font-label-caps text-label-caps px-4 py-2 rounded-lg shadow-sm whitespace-nowrap transition-colors flex items-center gap-1.5" href="#profile">
                  <span className="material-symbols-outlined text-[16px]">auto_awesome</span> Birthday Facts &amp; Zodiac
                </a>
                <a className="bg-surface-container-lowest border border-outline-variant/30 text-on-surface-variant hover:text-on-surface font-label-caps text-label-caps px-4 py-2 rounded-lg shadow-sm whitespace-nowrap transition-colors flex items-center gap-1.5" href="#breakdown">
                  <span className="material-symbols-outlined text-[16px]">view_list</span> Time Breakdown
                </a>
                <a className="bg-surface-container-lowest border border-outline-variant/30 text-on-surface-variant hover:text-on-surface font-label-caps text-label-caps px-4 py-2 rounded-lg shadow-sm whitespace-nowrap transition-colors flex items-center gap-1.5" href="#timeline">
                  <span className="material-symbols-outlined text-[16px]">timeline</span> Life Milestones
                </a>
                <a className="bg-surface-container-lowest border border-outline-variant/30 text-on-surface-variant hover:text-on-surface font-label-caps text-label-caps px-4 py-2 rounded-lg shadow-sm whitespace-nowrap transition-colors flex items-center gap-1.5" href="#planets">
                  <span className="material-symbols-outlined text-[16px]">public</span> Age on Planets
                </a>
              </div>
            </div>
          </section>

          {/* SECTION 2 & 3: INPUT CONTROLS PANEL + RESULTS DASHBOARD */}
          <section className="w-full py-space-2xl bg-surface" id="calculator">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
                
                {/* SECTION 2: INPUT CONTROLS PANEL */}
                <div className="lg:col-span-5 bg-surface-container-lowest border border-outline-variant/30 p-space-lg rounded-2xl shadow-xl flex flex-col gap-space-md">
                  <div className="flex items-center justify-between pb-space-xs border-b border-surface-container/60">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[22px]">tune</span>
                      <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">Enter Your Details</h2>
                    </div>
                    <span className="font-data-mono text-[12px] text-on-surface-variant bg-surface-container border border-outline-variant/30 px-2 py-0.5 rounded">Local Time</span>
                  </div>
                  <form className="flex flex-col gap-space-md" onSubmit={(e) => e.preventDefault()}>
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center">
                        <label className="font-label-caps text-label-caps text-on-surface font-semibold uppercase" htmlFor="birthDateInput">Date of Birth</label>
                        <span className="font-body-sm text-[12px] text-on-surface-variant">Day, Month &amp; Year</span>
                      </div>
                      <div className="relative flex items-center bg-surface-container-low border border-outline-variant/40 rounded-xl p-1.5 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary">
                        <span className="material-symbols-outlined text-outline px-2 text-[20px]">calendar_today</span>
                        <input className="w-full bg-transparent text-on-surface font-data-mono text-[16px] font-semibold focus:outline-none pr-2 [color-scheme:light] dark:[color-scheme:dark]" id="birthDateInput" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} required />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <button className="font-label-caps text-[10px] px-2.5 py-1 rounded bg-surface-container border border-outline-variant/30 text-on-surface hover:bg-surface-container-high transition-colors" onClick={() => setBirthDate('2000-01-01')} type="button">2000-01-01 (Gen Z)</button>
                      <button className="font-label-caps text-[10px] px-2.5 py-1 rounded bg-surface-container border border-outline-variant/30 text-on-surface hover:bg-surface-container-high transition-colors" onClick={() => setBirthDate('1995-07-15')} type="button">1995-07-15 (Millennial)</button>
                      <button className="font-label-caps text-[10px] px-2.5 py-1 rounded bg-surface-container border border-outline-variant/30 text-on-surface hover:bg-surface-container-high transition-colors" onClick={() => setBirthDate('1985-12-25')} type="button">1985-12-25</button>
                      <button className="font-label-caps text-[10px] px-2.5 py-1 rounded bg-surface-container border border-outline-variant/30 text-on-surface hover:bg-surface-container-high transition-colors" onClick={() => setBirthDate('1970-03-12')} type="button">1970-03-12 (Gen X)</button>
                    </div>
                    <div className="flex flex-col gap-1.5 pt-1">
                      <div className="flex justify-between items-center">
                        <label className="font-label-caps text-label-caps text-on-surface font-semibold uppercase" htmlFor="birthTimeInput">Time of Birth (Optional)</label>
                        <span className="font-data-mono text-[11px] text-primary">Accurate to the minute</span>
                      </div>
                      <div className="flex items-center bg-surface-container-low border border-outline-variant/40 rounded-xl p-1.5 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary">
                        <span className="material-symbols-outlined text-outline px-2 text-[20px]">access_time</span>
                        <input className="w-full bg-transparent text-on-surface font-data-mono text-[15px] focus:outline-none [color-scheme:light] dark:[color-scheme:dark]" id="birthTimeInput" step="1" type="time" value={birthTime} onChange={(e) => setBirthTime(e.target.value)} />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5 pt-1">
                      <div className="flex justify-between items-center">
                        <label className="font-label-caps text-label-caps text-on-surface font-semibold uppercase" htmlFor="targetDateInput">Calculate Age As Of</label>
                        <span className="font-body-sm text-[12px] text-on-surface-variant">Default is today</span>
                      </div>
                      <div className="relative flex items-center bg-surface-container-low border border-outline-variant/40 rounded-xl p-1.5 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary">
                        <span className="material-symbols-outlined text-outline px-2 text-[20px]">history</span>
                        <input className="w-full bg-transparent text-on-surface font-data-mono text-[16px] font-semibold focus:outline-none pr-2 [color-scheme:light] dark:[color-scheme:dark]" id="targetDateInput" type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} required />
                      </div>
                      <div className="grid grid-cols-4 gap-1.5 mt-1">
                        <button className="font-label-caps text-[10px] py-1 text-center rounded bg-primary text-on-primary hover:opacity-90 transition-opacity font-semibold shadow-xs" onClick={() => setTargetPreset('today')} type="button">Today</button>
                        <button className="font-label-caps text-[10px] py-1 text-center rounded bg-surface-container border border-outline-variant/30 text-on-surface hover:bg-surface-container-high transition-colors" onClick={() => setTargetPreset('yesterday')} type="button">Yesterday</button>
                        <button className="font-label-caps text-[10px] py-1 text-center rounded bg-surface-container border border-outline-variant/30 text-on-surface hover:bg-surface-container-high transition-colors" onClick={() => setTargetPreset('endOfYear')} type="button">End of Year</button>
                        <button className="font-label-caps text-[10px] py-1 text-center rounded bg-surface-container border border-outline-variant/30 text-on-surface hover:bg-surface-container-high transition-colors" onClick={() => setTargetPreset('decade2030')} type="button">Jan 1, 2030</button>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 pt-2">
                      <button className="w-full py-3 px-4 rounded-xl bg-primary text-on-primary font-headline-md text-[16px] font-semibold flex items-center justify-center gap-2 shadow-md hover:opacity-90 transition-transform active:scale-[0.99]" type="button">
                        <span className="material-symbols-outlined text-[20px]">calculate</span>
                        Calculate Age
                      </button>
                      <div className="grid grid-cols-3 gap-2">
                        <button className="py-2 px-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-on-surface font-label-caps text-[11px] flex items-center justify-center gap-1 transition-colors" onClick={swapDates} type="button">
                          <span className="material-symbols-outlined text-[16px]">swap_horiz</span> Swap
                        </button>
                        <button className="py-2 px-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-on-surface font-label-caps text-[11px] flex items-center justify-center gap-1 transition-colors" onClick={resetDefaults} type="button">
                          <span className="material-symbols-outlined text-[16px]">restart_alt</span> Reset
                        </button>
                        <button className="py-2 px-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-on-surface font-label-caps text-[11px] flex items-center justify-center gap-1 transition-colors" onClick={saveSnapshot} type="button">
                          <span className="material-symbols-outlined text-[16px]">bookmark_add</span> Save
                        </button>
                      </div>
                    </div>
                  </form>
                  <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-3 flex items-center justify-between text-on-surface-variant font-data-mono text-[11px]">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                      Browser Calculation Active
                    </span>
                    <span>Calculated in {data ? data.microCalcSpeed : '0.00'} ms</span>
                  </div>
                </div>

                {/* SECTION 3: RESULTS DASHBOARD */}
                <div className="lg:col-span-7 flex flex-col gap-space-md">
                  <div className="bg-surface-container-lowest border border-outline-variant/30 p-space-lg rounded-2xl shadow-xl relative overflow-hidden">
                    <div className="absolute -right-8 -top-8 w-40 h-40 bg-primary/10 rounded-full blur-2xl pointer-events-none"></div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-space-xs">
                      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
                        Your Exact Age
                      </span>
                      <span className="bg-surface-container border border-outline-variant/30 text-on-surface font-data-mono text-[12px] px-2.5 py-1 rounded-full flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                        <span suppressHydrationWarning>{liveTickingClock || '00:00:00 live'}</span>
                      </span>
                    </div>
                    {data && !('error' in data) ? (
                      <>
                        <div className="my-space-xs">
                          <div className="font-numerical-display text-[32px] sm:text-[42px] md:text-[48px] leading-tight text-on-surface font-bold tracking-tight">
                            {data.yDiff} Years, {data.mDiff} Months, {data.dDiff} Days
                          </div>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="font-body-md text-on-surface-variant text-[15px]">Total Days Lived:</span>
                            <span className="font-data-mono text-primary font-bold text-[17px]">{data.totalDays.toLocaleString()} Days</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 pt-space-sm border-t border-surface-container/80">
                          <button className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-on-surface font-body-sm text-[13px] flex items-center gap-1.5 transition-colors" onClick={copySummary}>
                            <span className="material-symbols-outlined text-[16px]">content_copy</span> <span>{copyBtnText}</span>
                          </button>
                          <button className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-on-surface font-body-sm text-[13px] flex items-center gap-1.5 transition-colors" onClick={() => window.print()}>
                            <span className="material-symbols-outlined text-[16px]">print</span> Print Summary
                          </button>
                          <button className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-on-surface font-body-sm text-[13px] flex items-center gap-1.5 transition-colors" onClick={exportCSV}>
                            <span className="material-symbols-outlined text-[16px]">download</span> Export CSV
                          </button>
                          <button className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-on-surface font-body-sm text-[13px] flex items-center gap-1.5 transition-colors" onClick={shareLink}>
                            <span className="material-symbols-outlined text-[16px]">share</span> Share Link
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="my-space-xs text-error font-body-md">{data && 'error' in data ? data.error : 'Please enter valid dates'}</div>
                    )}
                  </div>
                  {data && !('error' in data) && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm">
                      <div className="bg-surface-container-lowest border border-outline-variant/30 p-3.5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="font-label-caps text-[11px] text-on-surface-variant uppercase">Months Lived</div>
                        <div className="font-data-mono text-[18px] font-bold text-on-surface mt-1">{data.totalMonthsApprox.toLocaleString()} Mos</div>
                        <div className="font-body-sm text-[11px] text-on-surface-variant mt-0.5">+{data.dDiff} days</div>
                      </div>
                      <div className="bg-surface-container-lowest border border-outline-variant/30 p-3.5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="font-label-caps text-[11px] text-on-surface-variant uppercase">Weeks Elapsed</div>
                        <div className="font-data-mono text-[18px] font-bold text-on-surface mt-1">{data.totalWeeks.toLocaleString()} Wks</div>
                        <div className="font-body-sm text-[11px] text-on-surface-variant mt-0.5">{(data.totalWeeks / 52).toFixed(1)} years</div>
                      </div>
                      <div className="bg-surface-container-lowest border border-outline-variant/30 p-3.5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="font-label-caps text-[11px] text-on-surface-variant uppercase">Total Days</div>
                        <div className="font-data-mono text-[18px] font-bold text-primary mt-1">{data.totalDays.toLocaleString()} Days</div>
                        <div className="font-body-sm text-[11px] text-on-surface-variant mt-0.5">{Math.floor(data.totalDays / 365.25)} leap days lived</div>
                      </div>
                      <div className="bg-surface-container-lowest border border-outline-variant/30 p-3.5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="font-label-caps text-[11px] text-on-surface-variant uppercase">Total Hours</div>
                        <div className="font-data-mono text-[18px] font-bold text-on-surface mt-1">{data.totalHours.toLocaleString()} hrs</div>
                        <div className="font-body-sm text-[11px] text-on-surface-variant mt-0.5">Total elapsed hours</div>
                      </div>
                      <div className="bg-surface-container-lowest border border-outline-variant/30 p-3.5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="font-label-caps text-[11px] text-on-surface-variant uppercase">Total Minutes</div>
                        <div className="font-data-mono text-[17px] font-bold text-on-surface mt-1 truncate">{data.totalMinutes.toLocaleString()}</div>
                        <div className="font-body-sm text-[11px] text-on-surface-variant mt-0.5">Minutes lived</div>
                      </div>
                      <div className="bg-surface-container-lowest border border-outline-variant/30 p-3.5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="font-label-caps text-[11px] text-on-surface-variant uppercase">Total Seconds</div>
                        <div className="font-data-mono text-[17px] font-bold text-on-surface mt-1 truncate">{data.totalSeconds.toLocaleString()}</div>
                        <div className="font-body-sm text-[11px] text-on-surface-variant mt-0.5">Seconds lived</div>
                      </div>
                      <div className="bg-surface-container-lowest border border-outline-variant/30 p-3.5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="font-label-caps text-[11px] text-on-surface-variant uppercase">Heartbeats (~70 BPM)</div>
                        <div className="font-data-mono text-[17px] font-bold text-tertiary mt-1 truncate">~{(data.heartbeats / 1000000).toFixed(1)} Million</div>
                        <div className="font-body-sm text-[11px] text-on-surface-variant mt-0.5">Estimated heartbeats</div>
                      </div>
                      <div className="bg-surface-container-lowest border border-outline-variant/30 p-3.5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="font-label-caps text-[11px] text-on-surface-variant uppercase">Total Breaths (~17/m)</div>
                        <div className="font-data-mono text-[17px] font-bold text-secondary mt-1 truncate">~{(data.breaths / 1000000).toFixed(1)} Million</div>
                        <div className="font-body-sm text-[11px] text-on-surface-variant mt-0.5">Estimated breaths</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {data && !('error' in data) && (
            <>
              {/* SECTION 4: NEXT BIRTHDAY COUNTDOWN */}
              <section className="w-full py-space-xl bg-surface-container-low/30 border-t border-b border-surface-container/60" id="countdown">
                <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
                  <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-space-lg shadow-md">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-space-md border-b border-surface-container/60">
                      <div>
                        <div className="inline-flex items-center gap-1.5 font-label-caps text-[11px] text-primary font-semibold uppercase tracking-wider">
                          <span className="material-symbols-outlined text-[16px]">celebration</span>
                          Birthday Countdown
                        </div>
                        <h3 className="font-headline-md text-headline-md text-on-surface font-bold mt-0.5">Next Birthday &amp; Upcoming Milestones</h3>
                      </div>
                      <div className="bg-primary/10 border border-primary/20 text-primary px-3.5 py-1.5 rounded-full font-data-mono text-[13px] font-semibold self-start md:self-auto">
                        Turning <span>{data.turningAge}</span> Years Old
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-space-md pt-space-md">
                      <div className="bg-surface-container-low border border-outline-variant/30 p-4 rounded-xl">
                        <div className="font-label-caps text-label-caps text-on-surface-variant uppercase">Next Birthday Date</div>
                        <div className="font-body-lg text-[17px] font-semibold text-on-surface mt-1">{data.radarTargetDateStr}</div>
                        <div className="font-body-sm text-[12px] text-primary font-medium mt-0.5">{data.nextBirthdayDayOfWeek}</div>
                      </div>
                      <div className="bg-surface-container-low border border-outline-variant/30 p-4 rounded-xl">
                        <div className="font-label-caps text-label-caps text-on-surface-variant uppercase">Days Remaining</div>
                        <div className="font-data-mono text-[22px] font-bold text-on-surface mt-1">{data.daysToNextBday} Days</div>
                        <div className="font-body-sm text-[12px] text-on-surface-variant mt-0.5">{(data.daysToNextBday / 7).toFixed(1)} weeks away</div>
                      </div>
                      <div className="bg-surface-container-low border border-outline-variant/30 p-4 rounded-xl">
                        <div className="font-label-caps text-label-caps text-on-surface-variant uppercase">Half-Birthday</div>
                        <div className="font-body-lg text-[17px] font-semibold text-on-surface mt-1">{data.radarHalfBirthdayStr}</div>
                        <div className="font-body-sm text-[12px] text-on-surface-variant mt-0.5">{data.daysToHalf} days remaining</div>
                      </div>
                      <div className="bg-surface-container-low border border-outline-variant/30 p-4 rounded-xl flex flex-col justify-center">
                        <div className="flex justify-between items-center text-[12px] font-label-caps mb-2">
                          <span className="text-on-surface-variant font-medium">Year Progress</span>
                          <span className="font-data-mono font-bold text-primary">{data.progressPercentNum}% Done</span>
                        </div>
                        <div className="w-full bg-surface-container-high h-3 rounded-full overflow-hidden">
                          <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${data.progressPercentNum}%` }}></div>
                        </div>
                        <div className="font-body-sm text-[11px] text-on-surface-variant mt-2 text-center">
                          {data.daysSinceLastBday} days since last birthday • {data.daysToNextBday} days to go
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 4th: RELATED DATE & TIME TOOLS DIRECTORY */}
              <section className="w-full py-space-xl bg-surface-container-low/30 border-t border-b border-surface-container/60">
                <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
                  <div className="mb-space-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-primary">
                        Time &amp; Date Tools Category
                      </div>
                      <h2 className="font-headline-md text-headline-md text-on-surface font-bold">Explore Related Date &amp; Time Tools</h2>
                      <p className="font-body-md text-body-md text-on-surface-variant">Switch calculation modes for work, retirement, pet age, or exact date differences.</p>
                    </div>
                    <Link
                      href="/time-date"
                      className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 self-start sm:self-auto"
                    >
                      <span>All 37 Time &amp; Date Tools</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-md">
                    <Link href="/time-date/days-between-dates" className="bg-surface-container-lowest border border-outline-variant/30 p-5 rounded-xl shadow-sm hover:shadow-md hover:border-primary/40 transition-all cursor-pointer">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary border border-primary/20 flex items-center justify-center mb-3">
                        <span className="material-symbols-outlined text-[20px]">pin</span>
                      </div>
                      <h3 className="font-body-lg font-bold text-on-surface text-[17px]">Age in Days Calculator</h3>
                      <p className="font-body-sm text-[13px] text-on-surface-variant mt-1">Get your exact total age in days for official forms, passport renewals, or baby milestones.</p>
                    </Link>
                    <Link href="/time-date/birthday-tracker" className="bg-surface-container-lowest border border-outline-variant/30 p-5 rounded-xl shadow-sm hover:shadow-md hover:border-secondary/40 transition-all cursor-pointer">
                      <div className="w-10 h-10 rounded-lg bg-secondary/10 text-secondary border border-secondary/20 flex items-center justify-center mb-3">
                        <span className="material-symbols-outlined text-[20px]">calendar_view_month</span>
                      </div>
                      <h3 className="font-body-lg font-bold text-on-surface text-[17px]">Birthday Countdown</h3>
                      <p className="font-body-sm text-[13px] text-on-surface-variant mt-1">Track upcoming family birthdays, plan celebrations, and send reminders on time.</p>
                    </Link>
                    <Link href="/time-date/days-between-dates" className="bg-surface-container-lowest border border-outline-variant/30 p-5 rounded-xl shadow-sm hover:shadow-md hover:border-tertiary/40 transition-all cursor-pointer">
                      <div className="w-10 h-10 rounded-lg bg-tertiary/10 text-tertiary border border-tertiary/20 flex items-center justify-center mb-3">
                        <span className="material-symbols-outlined text-[20px]">history_edu</span>
                      </div>
                      <h3 className="font-body-lg font-bold text-on-surface text-[17px]">Age on a Specific Date</h3>
                      <p className="font-body-sm text-[13px] text-on-surface-variant mt-1">Find out how old you were or will be during any historical event or future milestone.</p>
                    </Link>
                    <Link href="/time-date/work-hours" className="bg-surface-container-lowest border border-outline-variant/30 p-5 rounded-xl shadow-sm hover:shadow-md hover:border-primary/40 transition-all cursor-pointer">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary border border-primary/20 flex items-center justify-center mb-3">
                        <span className="material-symbols-outlined text-[20px]">savings</span>
                      </div>
                      <h3 className="font-body-lg font-bold text-on-surface text-[17px]">Retirement Age Calculator</h3>
                      <p className="font-body-sm text-[13px] text-on-surface-variant mt-1">Check your official Social Security retirement age and see how many working years remain.</p>
                    </Link>
                    <Link href="/health-fitness-calculators" className="bg-surface-container-lowest border border-outline-variant/30 p-5 rounded-xl shadow-sm hover:shadow-md hover:border-secondary/40 transition-all cursor-pointer">
                      <div className="w-10 h-10 rounded-lg bg-secondary/10 text-secondary border border-secondary/20 flex items-center justify-center mb-3">
                        <span className="material-symbols-outlined text-[20px]">pets</span>
                      </div>
                      <h3 className="font-body-lg font-bold text-on-surface text-[17px]">Dog &amp; Cat Age Converter</h3>
                      <p className="font-body-sm text-[13px] text-on-surface-variant mt-1">Convert your pet's age into human years using accurate biological aging curves.</p>
                    </Link>
                    <Link href="/health-fitness-calculators" className="bg-surface-container-lowest border border-outline-variant/30 p-5 rounded-xl shadow-sm hover:shadow-md hover:border-tertiary/40 transition-all cursor-pointer">
                      <div className="w-10 h-10 rounded-lg bg-tertiary/10 text-tertiary border border-tertiary/20 flex items-center justify-center mb-3">
                        <span className="material-symbols-outlined text-[20px]">favorite</span>
                      </div>
                      <h3 className="font-body-lg font-bold text-on-surface text-[17px]">Biological vs. Calendar Age</h3>
                      <p className="font-body-sm text-[13px] text-on-surface-variant mt-1">Estimate your body's biological fitness age based on heart rate, activity, and sleep habits.</p>
                    </Link>
                  </div>
                </div>
              </section>

              {/* SECTION 5: BIRTHDAY FACTS & ZODIAC PROFILE */}
              <section className="w-full py-space-xl bg-surface" id="profile">
                <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
                  <div className="mb-space-lg">
                    <h2 className="font-headline-md text-headline-md text-on-surface font-bold">Birthday Facts &amp; Zodiac Profile</h2>
                    <p className="font-body-md text-body-md text-on-surface-variant">Discover your day of birth, astrological signs, birthstone, and generational cohort.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-md">
                    <div className="bg-surface-container-lowest border border-outline-variant/30 p-space-md rounded-2xl shadow-sm flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                        <span className="material-symbols-outlined text-[26px]">calendar_today</span>
                      </div>
                      <div>
                        <div className="font-label-caps text-label-caps text-on-surface-variant uppercase">Born Day of Week</div>
                        <div className="font-body-lg text-[18px] font-bold text-on-surface mt-0.5">{data.dayOfWeekBorn}</div>
                        <div className="font-body-sm text-body-sm text-on-surface-variant mt-1">The exact day of the week you entered the world.</div>
                      </div>
                    </div>
                    <div className="bg-surface-container-lowest border border-outline-variant/30 p-space-md rounded-2xl shadow-sm flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0 border border-secondary/20">
                        <span className="material-symbols-outlined text-[26px]">stars</span>
                      </div>
                      <div>
                        <div className="font-label-caps text-label-caps text-on-surface-variant uppercase">Western Zodiac Sign</div>
                        <div className="font-body-lg text-[18px] font-bold text-on-surface mt-0.5">{data.zodiacInfo}</div>
                        <div className="font-body-sm text-body-sm text-on-surface-variant mt-1">Your Western astrological sun sign based on birth date.</div>
                      </div>
                    </div>
                    <div className="bg-surface-container-lowest border border-outline-variant/30 p-space-md rounded-2xl shadow-sm flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-tertiary/10 text-tertiary flex items-center justify-center shrink-0 border border-tertiary/20">
                        <span className="material-symbols-outlined text-[26px]">diamond</span>
                      </div>
                      <div>
                        <div className="font-label-caps text-label-caps text-on-surface-variant uppercase">Birthstone</div>
                        <div className="font-body-lg text-[18px] font-bold text-on-surface mt-0.5">{data.birthstone}</div>
                        <div className="font-body-sm text-body-sm text-on-surface-variant mt-1">The traditional gemstone associated with your birth month.</div>
                      </div>
                    </div>
                    <div className="bg-surface-container-lowest border border-outline-variant/30 p-space-md rounded-2xl shadow-sm flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                        <span className="material-symbols-outlined text-[26px]">local_florist</span>
                      </div>
                      <div>
                        <div className="font-label-caps text-label-caps text-on-surface-variant uppercase">Birth Flower</div>
                        <div className="font-body-lg text-[18px] font-bold text-on-surface mt-0.5">{data.flower}</div>
                        <div className="font-body-sm text-body-sm text-on-surface-variant mt-1">The traditional flower symbolizing your birth month.</div>
                      </div>
                    </div>
                    <div className="bg-surface-container-lowest border border-outline-variant/30 p-space-md rounded-2xl shadow-sm flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0 border border-secondary/20">
                        <span className="material-symbols-outlined text-[26px]">pets</span>
                      </div>
                      <div>
                        <div className="font-label-caps text-label-caps text-on-surface-variant uppercase">Chinese Zodiac</div>
                        <div className="font-body-lg text-[18px] font-bold text-on-surface mt-0.5">{data.chineseZodiac}</div>
                        <div className="font-body-sm text-body-sm text-on-surface-variant mt-1">Lunar animal sign assigned by your birth year.</div>
                      </div>
                    </div>
                    <div className="bg-surface-container-lowest border border-outline-variant/30 p-space-md rounded-2xl shadow-sm flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-tertiary/10 text-tertiary flex items-center justify-center shrink-0 border border-tertiary/20">
                        <span className="material-symbols-outlined text-[26px]">groups</span>
                      </div>
                      <div>
                        <div className="font-label-caps text-label-caps text-on-surface-variant uppercase">Generation</div>
                        <div className="font-body-lg text-[18px] font-bold text-on-surface mt-0.5">{data.cohort}</div>
                        <div className="font-body-sm text-body-sm text-on-surface-variant mt-1">Demographic generation classification for your age group.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 6: AGE BREAKDOWN IN DIFFERENT UNITS */}
              <section className="w-full py-space-xl bg-surface-container-low/30 border-t border-b border-surface-container/60" id="breakdown">
                <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
                  <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-space-lg shadow-md">
                    <div className="mb-space-md">
                      <span className="font-label-caps text-label-caps text-primary uppercase font-semibold">Time Breakdown</span>
                      <h2 className="font-headline-md text-headline-md text-on-surface font-bold mt-1">Age in Different Units of Time</h2>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">See how your lifespan compares across work days, moon cycles, sleep, and space travel.</p>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left font-body-sm text-body-sm border-collapse">
                        <thead>
                          <tr className="bg-surface-container border-b border-outline-variant/30 text-on-surface font-label-caps text-[11px] uppercase tracking-wider">
                            <th className="p-3.5 rounded-l-lg">Measurement Unit</th>
                            <th className="p-3.5">Time Lived</th>
                            <th className="p-3.5">% of 100 Years</th>
                            <th className="p-3.5">How It is Calculated</th>
                            <th className="p-3.5 rounded-r-lg">Category</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-container">
                          <tr className="hover:bg-surface-container-low/50 transition-colors">
                            <td className="p-3.5 font-medium text-on-surface flex items-center gap-2">
                              <span className="material-symbols-outlined text-primary text-[18px]">sunny</span> Exact Calendar Years
                            </td>
                            <td className="p-3.5 font-data-mono font-semibold text-on-surface">{data.solarYearsExact} Years</td>
                            <td className="p-3.5 font-data-mono text-on-surface-variant">{data.yDiff}%</td>
                            <td className="p-3.5 font-data-mono text-[12px] text-on-surface-variant">Years + Months/12 + Days/365.25</td>
                            <td className="p-3.5"><span className="bg-primary/10 text-primary border border-primary/20 font-data-mono text-[11px] px-2 py-0.5 rounded font-medium">Exact</span></td>
                          </tr>
                          <tr className="hover:bg-surface-container-low/50 transition-colors">
                            <td className="p-3.5 font-medium text-on-surface flex items-center gap-2">
                              <span className="material-symbols-outlined text-secondary text-[18px]">bedtime</span> Full Moon Cycles
                            </td>
                            <td className="p-3.5 font-data-mono font-semibold text-on-surface">{data.lunarCycles} Moons</td>
                            <td className="p-3.5 font-data-mono text-on-surface-variant">--</td>
                            <td className="p-3.5 font-data-mono text-[12px] text-on-surface-variant">Total Days / 29.53 days per cycle</td>
                            <td className="p-3.5"><span className="bg-surface-container border border-outline-variant/30 text-on-surface-variant font-data-mono text-[11px] px-2 py-0.5 rounded">Astronomy</span></td>
                          </tr>
                          <tr className="hover:bg-surface-container-low/50 transition-colors">
                            <td className="p-3.5 font-medium text-on-surface flex items-center gap-2">
                              <span className="material-symbols-outlined text-tertiary text-[18px]">work</span> Working Business Days
                            </td>
                            <td className="p-3.5 font-data-mono font-semibold text-on-surface">{data.businessDays} Days</td>
                            <td className="p-3.5 font-data-mono text-on-surface-variant">71.4% of total</td>
                            <td className="p-3.5 font-data-mono text-[12px] text-on-surface-variant">Total Days * (5 business days / 7)</td>
                            <td className="p-3.5"><span className="bg-surface-container border border-outline-variant/30 text-on-surface-variant font-data-mono text-[11px] px-2 py-0.5 rounded">Career</span></td>
                          </tr>
                          <tr className="hover:bg-surface-container-low/50 transition-colors">
                            <td className="p-3.5 font-medium text-on-surface flex items-center gap-2">
                              <span className="material-symbols-outlined text-secondary text-[18px]">bed</span> Estimated Time Asleep
                            </td>
                            <td className="p-3.5 font-data-mono font-semibold text-on-surface">~{data.sleepYears} Years</td>
                            <td className="p-3.5 font-data-mono text-on-surface-variant">33.3%</td>
                            <td className="p-3.5 font-data-mono text-[12px] text-on-surface-variant">{(data.totalHours / 3).toLocaleString()} Hours (assuming 8h/night)</td>
                            <td className="p-3.5"><span className="bg-surface-container border border-outline-variant/30 text-on-surface-variant font-data-mono text-[11px] px-2 py-0.5 rounded">Health &amp; Sleep</span></td>
                          </tr>
                          <tr className="hover:bg-surface-container-low/50 transition-colors">
                            <td className="p-3.5 font-medium text-on-surface flex items-center gap-2">
                              <span className="material-symbols-outlined text-primary text-[18px]">public</span> Travel Around the Sun
                            </td>
                            <td className="p-3.5 font-data-mono font-semibold text-on-surface">~{data.orbitalKm} Billion km</td>
                            <td className="p-3.5 font-data-mono text-on-surface-variant">--</td>
                            <td className="p-3.5 font-data-mono text-[12px] text-on-surface-variant">Earth orbital speed of 29.78 km/sec</td>
                            <td className="p-3.5"><span className="bg-surface-container border border-outline-variant/30 text-on-surface-variant font-data-mono text-[11px] px-2 py-0.5 rounded">Earth &amp; Space</span></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 7: KEY LIFE MILESTONES */}
              <section className="w-full py-space-xl bg-surface" id="timeline">
                <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
                  <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-space-lg shadow-md">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-space-md">
                      <div>
                        <span className="font-label-caps text-label-caps text-primary uppercase font-semibold">Life Timeline</span>
                        <h2 className="font-headline-md text-headline-md text-on-surface font-bold mt-1">Key Life Milestones &amp; Goals</h2>
                      </div>
                      <div className="text-right">
                        <span className="font-body-sm text-[12px] text-on-surface-variant">Average Life Journey (78.5 years benchmark):</span>
                        <div className="font-data-mono text-primary font-bold text-[15px]">{data.lifeExpPercent}% Reached</div>
                      </div>
                    </div>
                    <div className="w-full bg-surface-container-high h-3 rounded-full mb-space-lg overflow-hidden">
                      <div className="bg-primary h-full rounded-full transition-all duration-700" style={{ width: `${data.lifeExpPercent}%` }}></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                      <div className="bg-surface-container-low border border-outline-variant/30 p-3.5 rounded-xl border-l-4 border-l-primary">
                        <div className="font-label-caps text-[10px] text-primary uppercase font-bold">Start</div>
                        <div className="font-body-lg font-bold text-on-surface text-[15px] mt-0.5">Birth (Age 0)</div>
                        <div className="font-data-mono text-[12px] text-on-surface-variant mt-1">{data.tileBirthDate}</div>
                        <div className="font-body-sm text-[11px] text-primary font-medium mt-1">✓ Day Born</div>
                      </div>
                      <div className="bg-surface-container-low border border-outline-variant/30 p-3.5 rounded-xl border-l-4 border-l-primary">
                        <div className="font-label-caps text-[10px] text-primary uppercase font-bold">Adulthood</div>
                        <div className="font-body-lg font-bold text-on-surface text-[15px] mt-0.5">Age 18</div>
                        <div className="font-data-mono text-[12px] text-on-surface-variant mt-1">{data.tileAge18}</div>
                        <div className="font-body-sm text-[11px] text-primary font-medium mt-1">✓ Age of Majority</div>
                      </div>
                      <div className="bg-surface-container-low border border-outline-variant/30 p-3.5 rounded-xl border-l-4 border-l-secondary">
                        <div className="font-label-caps text-[10px] text-secondary uppercase font-bold">Legal Rights</div>
                        <div className="font-body-lg font-bold text-on-surface text-[15px] mt-0.5">Age 21</div>
                        <div className="font-data-mono text-[12px] text-on-surface-variant mt-1">{data.tileAge21}</div>
                        <div className="font-body-sm text-[11px] text-secondary font-medium mt-1">✓ Full Legal Rights</div>
                      </div>
                      <div className="bg-primary/10 border border-primary/30 p-3.5 rounded-xl border-l-4 border-l-primary shadow-sm">
                        <div className="font-label-caps text-[10px] text-primary uppercase font-bold">Current Age</div>
                        <div className="font-body-lg font-bold text-on-surface text-[15px] mt-0.5">Today</div>
                        <div className="font-data-mono text-[12px] text-primary font-bold mt-1">Age {data.yDiff}</div>
                        <div className="font-body-sm text-[11px] text-primary font-semibold mt-1">★ Where You Are</div>
                      </div>
                      <div className="bg-surface-container-low border border-outline-variant/30 p-3.5 rounded-xl border-l-4 border-l-outline">
                        <div className="font-label-caps text-[10px] text-on-surface-variant uppercase font-bold">Milestone</div>
                        <div className="font-body-lg font-bold text-on-surface text-[15px] mt-0.5">Age 30</div>
                        <div className="font-data-mono text-[12px] text-on-surface-variant mt-1">{data.tileAge30}</div>
                        <div className="font-body-sm text-[11px] text-on-surface-variant mt-1">{data.yearsTo30 > '0.0' ? `${data.yearsTo30} Years Away` : 'Achieved'}</div>
                      </div>
                      <div className="bg-surface-container-low border border-outline-variant/30 p-3.5 rounded-xl border-l-4 border-l-outline">
                        <div className="font-label-caps text-[10px] text-on-surface-variant uppercase font-bold">Retirement</div>
                        <div className="font-body-lg font-bold text-on-surface text-[15px] mt-0.5">Age 67</div>
                        <div className="font-data-mono text-[12px] text-on-surface-variant mt-1">{data.tileAge67}</div>
                        <div className="font-body-sm text-[11px] text-on-surface-variant mt-1">{data.yearsTo67 > '0.0' ? `${data.yearsTo67} Years Away` : 'Achieved'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 8: AGE ON OTHER PLANETS */}
              <section className="w-full py-space-xl bg-surface-container-low/30 border-t border-b border-surface-container/60" id="planets">
                <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
                  <div className="mb-space-lg">
                    <h2 className="font-headline-md text-headline-md text-on-surface font-bold">Your Age on Other Planets</h2>
                    <p className="font-body-md text-body-md text-on-surface-variant">Because each planet orbits the sun at a different speed, your age would be different on each one!</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
                    <div className="bg-surface-container-lowest border border-outline-variant/30 p-space-md rounded-2xl shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-label-caps text-label-caps text-outline uppercase font-semibold">Mercury: 88-Day Year</span>
                          <span className="material-symbols-outlined text-primary text-[20px]">circle</span>
                        </div>
                        <div className="font-body-lg font-bold text-on-surface text-[17px] mt-2">Age on Mercury</div>
                        <div className="font-data-mono text-[28px] font-bold text-primary mt-1">{data.mercury} Years</div>
                      </div>
                      <div className="font-body-sm text-[12px] text-on-surface-variant mt-3">You would celebrate a birthday on Mercury every 2.9 Earth months!</div>
                    </div>
                    <div className="bg-surface-container-lowest border border-outline-variant/30 p-space-md rounded-2xl shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-label-caps text-label-caps text-outline uppercase font-semibold">Venus: 225-Day Year</span>
                          <span className="material-symbols-outlined text-secondary text-[20px]">flare</span>
                        </div>
                        <div className="font-body-lg font-bold text-on-surface text-[17px] mt-2">Age on Venus</div>
                        <div className="font-data-mono text-[28px] font-bold text-secondary mt-1">{data.venus} Years</div>
                      </div>
                      <div className="font-body-sm text-[12px] text-on-surface-variant mt-3">One year on Venus takes about 7.4 Earth months.</div>
                    </div>
                    <div className="bg-surface-container-lowest border border-outline-variant/30 p-space-md rounded-2xl shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-label-caps text-label-caps text-outline uppercase font-semibold">Mars: 687-Day Year</span>
                          <span className="material-symbols-outlined text-tertiary text-[20px]">public</span>
                        </div>
                        <div className="font-body-lg font-bold text-on-surface text-[17px] mt-2">Age on Mars</div>
                        <div className="font-data-mono text-[28px] font-bold text-tertiary mt-1">{data.mars} Years</div>
                      </div>
                      <div className="font-body-sm text-[12px] text-on-surface-variant mt-3">Because a Martian year is nearly two Earth years, your age is cut in half.</div>
                    </div>
                    <div className="bg-surface-container-lowest border border-outline-variant/30 p-space-md rounded-2xl shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-label-caps text-label-caps text-outline uppercase font-semibold">Global Comparison</span>
                          <span className="material-symbols-outlined text-primary text-[20px]">groups</span>
                        </div>
                        <div className="font-body-lg font-bold text-on-surface text-[17px] mt-2">Worldwide Rank</div>
                        <div className="font-data-mono text-[28px] font-bold text-primary mt-1">Top 51%</div>
                      </div>
                      <div className="font-body-sm text-[12px] text-on-surface-variant mt-3">Around half of the 8+ billion people on Earth are younger than you.</div>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 9: HOW YOUR AGE IS CALCULATED */}
              <section className="w-full py-space-xl bg-surface">
                <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
                  <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-space-lg shadow-md">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-space-md">
                      <div>
                        <div className="inline-flex items-center gap-1.5 font-label-caps text-label-caps text-primary uppercase font-semibold">
                          <span className="material-symbols-outlined text-[16px]">code</span>
                          Step-by-Step Logic
                        </div>
                        <h2 className="font-headline-md text-headline-md text-on-surface font-bold mt-0.5">How Your Age is Calculated</h2>
                      </div>
                      <button className="px-3.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-on-surface font-label-caps text-[11px] uppercase tracking-wider flex items-center gap-1.5 self-start md:self-auto transition-colors" onClick={copyAlgorithmCode}>
                        <span className="material-symbols-outlined text-[16px]">content_copy</span> <span>{copyCodeText}</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md mb-space-md">
                      <div className="bg-surface-container-low border border-outline-variant/30 p-4 rounded-xl">
                        <div className="font-label-caps text-[11px] text-primary uppercase font-bold">Step 1: Calculate Years</div>
                        <p className="font-body-sm text-[13px] text-on-surface mt-1">
                          Subtract birth year from target year. If your birthday has not occurred yet this year, subtract 1 year and add 12 months.
                        </p>
                        <div className="font-data-mono text-[12px] text-on-surface-variant bg-surface-container-lowest border border-outline-variant/30 p-2 rounded mt-2">
                          Years = TargetYear - BirthYear (-1 if birthday not yet reached)
                        </div>
                      </div>
                      <div className="bg-surface-container-low border border-outline-variant/30 p-4 rounded-xl">
                        <div className="font-label-caps text-[11px] text-primary uppercase font-bold">Step 2: Calculate Months &amp; Days</div>
                        <p className="font-body-sm text-[13px] text-on-surface mt-1">
                          Calculate month difference. If target day is less than birth day, borrow the exact days in the previous month (28, 29, 30, or 31).
                        </p>
                        <div className="font-data-mono text-[12px] text-on-surface-variant bg-surface-container-lowest border border-outline-variant/30 p-2 rounded mt-2">
                          Days borrowed = Days in preceding month
                        </div>
                      </div>
                      <div className="bg-surface-container-low border border-outline-variant/30 p-4 rounded-xl">
                        <div className="font-label-caps text-[11px] text-primary uppercase font-bold">Step 3: Account for Leap Years</div>
                        <p className="font-body-sm text-[13px] text-on-surface mt-1">
                          Calculates actual days elapsed, including leap year days (years divisible by 4, except centuries unless divisible by 400).
                        </p>
                        <div className="font-data-mono text-[12px] text-on-surface-variant bg-surface-container-lowest border border-outline-variant/30 p-2 rounded mt-2">
                          Leap Days Lived: {Math.floor(data.totalDays / 365.25)}
                        </div>
                      </div>
                    </div>
                    <div className="bg-surface-container-low dark:bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-4 text-on-surface font-data-mono text-[13px] overflow-x-auto">
<pre className="text-on-surface"><code>{`function calculateAge(birthDate, targetDate) {
  let years = targetDate.getFullYear() - birthDate.getFullYear();
  let months = targetDate.getMonth() - birthDate.getMonth();
  let days = targetDate.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    const prevMonthDays = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0).getDate();
    days += prevMonthDays;
  }
  if (months < 0) {
    years--;
    months += 12;
  }
  const totalMs = targetDate.getTime() - birthDate.getTime();
  const totalDays = Math.floor(totalMs / (1000 * 60 * 60 * 24));
  return { years, months, days, totalDays };
}`}</code></pre>
                    </div>
                  </div>
                </div>
              </section>



              {/* SECTION 11: EXAMPLE BIRTHDAY SCENARIOS */}
              <section className="w-full py-space-xl bg-surface">
                <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
                  <div className="mb-space-lg">
                    <h2 className="font-headline-md text-headline-md text-on-surface font-bold">Example Birthday Scenarios</h2>
                    <p className="font-body-md text-body-md text-on-surface-variant">Try out these popular birth date examples with one click to see how the calculator works.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
                    <div className="bg-surface-container-lowest border border-outline-variant/30 p-5 rounded-xl shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-label-caps text-[10px] bg-primary/10 border border-primary/20 text-primary px-2 py-0.5 rounded font-semibold">Example 1</span>
                          <span className="font-data-mono text-[12px] text-on-surface-variant">DOB: 2000-01-01</span>
                        </div>
                        <h3 className="font-body-lg font-bold text-on-surface text-[17px] mt-2">Born New Year 2000</h3>
                        <div className="font-body-sm text-[13px] text-on-surface-variant mt-2">Born at the start of the new millennium. Great for calculating 21st-century milestones.</div>
                      </div>
                      <button className="mt-4 w-full py-2 rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-on-surface font-label-caps text-[11px] font-semibold transition-colors" onClick={() => setBirthDate('2000-01-01')}>Try This Date</button>
                    </div>
                    <div className="bg-surface-container-lowest border border-outline-variant/30 p-5 rounded-xl shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-label-caps text-[10px] bg-secondary/10 border border-secondary/20 text-secondary px-2 py-0.5 rounded font-semibold">Example 2</span>
                          <span className="font-data-mono text-[12px] text-on-surface-variant">DOB: 1995-07-15</span>
                        </div>
                        <h3 className="font-body-lg font-bold text-on-surface text-[17px] mt-2">Mid-90s Millennial</h3>
                        <div className="font-body-sm text-[13px] text-on-surface-variant mt-2">Born in mid-1995, reaching the 30-year milestone in the mid-2020s.</div>
                      </div>
                      <button className="mt-4 w-full py-2 rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-on-surface font-label-caps text-[11px] font-semibold transition-colors" onClick={() => setBirthDate('1995-07-15')}>Try This Date</button>
                    </div>
                    <div className="bg-surface-container-lowest border border-outline-variant/30 p-5 rounded-xl shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-label-caps text-[10px] bg-tertiary/10 border border-tertiary/20 text-tertiary px-2 py-0.5 rounded font-semibold">Example 3</span>
                          <span className="font-data-mono text-[12px] text-on-surface-variant">DOB: 1960-03-10</span>
                        </div>
                        <h3 className="font-body-lg font-bold text-on-surface text-[17px] mt-2">Born in 1960</h3>
                        <div className="font-body-sm text-[13px] text-on-surface-variant mt-2">Reaching the milestone for standard Social Security full retirement age (Age 67).</div>
                      </div>
                      <button className="mt-4 w-full py-2 rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-on-surface font-label-caps text-[11px] font-semibold transition-colors" onClick={() => setBirthDate('1960-03-10')}>Try This Date</button>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 12: EDUCATIONAL GUIDE */}
              <section className="w-full py-space-xl bg-surface-container-low/30 border-t border-b border-surface-container/60">
                <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
                  <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-space-lg shadow-md">
                    <div className="mb-space-md">
                      <span className="font-label-caps text-label-caps text-primary uppercase font-semibold">Understanding Calendars</span>
                      <h2 className="font-headline-md text-headline-md text-on-surface font-bold mt-1">How Human Age is Measured Around the World</h2>
                      <p className="font-body-md text-body-md text-on-surface-variant">From ancient calendar systems to modern birth date standards.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg font-body-md text-body-md text-on-surface-variant">
                      <div>
                        <h3 className="font-headline-md text-[18px] text-on-surface font-bold mb-2">Western vs. Traditional Asian Age</h3>
                        <p className="mb-3">
                          In the Western world, your age starts at zero at birth and increments by one year on each birthday anniversary. In contrast, traditional East Asian systems counted a baby as one year old at birth and added an extra year to everyone on New Year's Day.
                        </p>
                        <p>
                          In June 2023, South Korea officially adopted the international Western age calculation method for all administrative and legal documents, making age counts standard worldwide.
                        </p>
                      </div>
                      <div>
                        <h3 className="font-headline-md text-[18px] text-on-surface font-bold mb-2">How Leap Years Are Counted</h3>
                        <p className="mb-3">
                          A regular calendar year has 365 days, but Earth takes approximately 365.2425 days to orbit the sun. To keep seasons aligned, we add an extra leap day (February 29) every four years, except for century years not divisible by 400.
                        </p>
                        <p>
                          If you were born on February 29, our calculator accurately tracks your exact days lived, and your non-leap year birthday is observed on March 1.
                        </p>
                      </div>
                      <div>
                        <h3 className="font-headline-md text-[18px] text-on-surface font-bold mb-2">Accurate to the Minute &amp; Second</h3>
                        <p className="mb-3">
                          By adding an optional birth time, you can find out the exact number of hours and minutes you have been alive.
                        </p>
                        <p>
                          Our calculator computes all numbers in real-time right inside your browser, so you can watch your total seconds of life tick up continuously.
                        </p>
                      </div>
                      <div>
                        <h3 className="font-headline-md text-[18px] text-on-surface font-bold mb-2">Important Milestone Ages</h3>
                        <p className="mb-3">
                          Different ages unlock legal and financial milestones: Age 16 (driving permits), Age 18 (voting rights and legal adulthood), Age 21 (full adult rights).
                        </p>
                        <p>
                          Later in life, Age 59½ allows penalty-free retirement withdrawals, Age 65 provides Medicare healthcare eligibility, and Age 67 is the standard full retirement age for Social Security.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 13: FAQ ACCORDION */}
              <section className="w-full py-space-xl bg-surface">
                <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
                  <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-space-lg">
                      <span className="font-label-caps text-label-caps text-primary uppercase font-semibold">Help &amp; Answers</span>
                      <h2 className="font-headline-md text-headline-md text-on-surface font-bold mt-1">Frequently Asked Questions</h2>
                      <p className="font-body-md text-body-md text-on-surface-variant">Common questions about age calculations, leap years, and privacy.</p>
                    </div>
                    <div className="flex flex-col gap-space-sm">
                      <details className="group bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-sm overflow-hidden" open>
                        <summary className="flex items-center justify-between p-4 cursor-pointer font-body-lg font-semibold text-on-surface select-none hover:bg-surface-container-low/50 transition-colors">
                          <span>How does this calculator handle leap years and February 29 birthdays?</span>
                          <span className="material-symbols-outlined text-outline group-open:rotate-180 transition-transform">expand_more</span>
                        </summary>
                        <div className="p-4 pt-0 font-body-md text-body-md text-on-surface-variant border-t border-surface-container/60">
                          The calculator includes complete leap year rules. If you were born on February 29, the calculator tracks your exact days lived, and during common (non-leap) years your birthday is celebrated on March 1.
                        </div>
                      </details>
                      <details className="group bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-sm overflow-hidden">
                        <summary className="flex items-center justify-between p-4 cursor-pointer font-body-lg font-semibold text-on-surface select-none hover:bg-surface-container-low/50 transition-colors">
                          <span>What is the difference between Western age and traditional Korean age?</span>
                          <span className="material-symbols-outlined text-outline group-open:rotate-180 transition-transform">expand_more</span>
                        </summary>
                        <div className="p-4 pt-0 font-body-md text-body-md text-on-surface-variant border-t border-surface-container/60">
                          In Western age reckoning, your age starts at zero at birth and increases by one year on each birthday anniversary. In traditional East Asian systems, babies were counted as 1 year old at birth and gained another year every New Year. In June 2023, South Korea officially unified its laws with the international standard Western method used here.
                        </div>
                      </details>
                      <details className="group bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-sm overflow-hidden">
                        <summary className="flex items-center justify-between p-4 cursor-pointer font-body-lg font-semibold text-on-surface select-none hover:bg-surface-container-low/50 transition-colors">
                          <span>Can I calculate my exact age on a specific future or past date?</span>
                          <span className="material-symbols-outlined text-outline group-open:rotate-180 transition-transform">expand_more</span>
                        </summary>
                        <div className="p-4 pt-0 font-body-md text-body-md text-on-surface-variant border-t border-surface-container/60">
                          Yes! Simply change the &ldquo;Calculate Age As Of&rdquo; field to any past date (for example, to see how old you were when a historical event happened) or any future date (to see how old you will be when you retire).
                        </div>
                      </details>
                      <details className="group bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-sm overflow-hidden">
                        <summary className="flex items-center justify-between p-4 cursor-pointer font-body-lg font-semibold text-on-surface select-none hover:bg-surface-container-low/50 transition-colors">
                          <span>Does SolveIt save or store my birth date?</span>
                          <span className="material-symbols-outlined text-outline group-open:rotate-180 transition-transform">expand_more</span>
                        </summary>
                        <div className="p-4 pt-0 font-body-md text-body-md text-on-surface-variant border-t border-surface-container/60">
                          No. All calculations run strictly inside your own browser window. None of your personal dates are sent to any remote server or stored in any database. Your privacy is 100% protected.
                        </div>
                      </details>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 14: INTERCONNECTED TIME TOOLS */}
              <section className="w-full py-space-xl bg-surface-container-low/30 border-t border-b border-surface-container/60">
                <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
                  <div className="mb-space-md">
                    <h2 className="font-headline-md text-headline-md text-on-surface font-bold">Related Date &amp; Time Calculators</h2>
                    <p className="font-body-md text-body-md text-on-surface-variant">Check out other helpful date, time, and scheduling tools.</p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-space-sm">
                    <Link href="/time-date/days-between-dates" className="bg-surface-container-lowest border border-outline-variant/30 p-3.5 rounded-xl shadow-sm hover:shadow-md hover:border-primary/40 transition-all flex flex-col items-center text-center">
                      <span className="material-symbols-outlined text-primary text-[24px] mb-2">date_range</span>
                      <span className="font-body-sm font-semibold text-on-surface text-[13px]">Date Difference</span>
                      <span className="font-label-caps text-[10px] text-on-surface-variant mt-0.5">Days Between Dates</span>
                    </Link>
                    <Link href="/time-date/birthday-tracker" className="bg-surface-container-lowest border border-outline-variant/30 p-3.5 rounded-xl shadow-sm hover:shadow-md hover:border-secondary/40 transition-all flex flex-col items-center text-center">
                      <span className="material-symbols-outlined text-secondary text-[24px] mb-2">cake</span>
                      <span className="font-body-sm font-semibold text-on-surface text-[13px]">Birthday Tracker</span>
                      <span className="font-label-caps text-[10px] text-on-surface-variant mt-0.5">Countdown &amp; Gifts</span>
                    </Link>
                    <Link href="/time-date/work-hours" className="bg-surface-container-lowest border border-outline-variant/30 p-3.5 rounded-xl shadow-sm hover:shadow-md hover:border-tertiary/40 transition-all flex flex-col items-center text-center">
                      <span className="material-symbols-outlined text-tertiary text-[24px] mb-2">business_center</span>
                      <span className="font-body-sm font-semibold text-on-surface text-[13px]">Work Hours</span>
                      <span className="font-label-caps text-[10px] text-on-surface-variant mt-0.5">Shifts &amp; Timesheets</span>
                    </Link>
                    <Link href="/" className="bg-surface-container-lowest border border-outline-variant/30 p-3.5 rounded-xl shadow-sm hover:shadow-md hover:border-primary/40 transition-all flex flex-col items-center text-center">
                      <span className="material-symbols-outlined text-primary text-[24px] mb-2">savings</span>
                      <span className="font-body-sm font-semibold text-on-surface text-[13px]">Retirement</span>
                      <span className="font-label-caps text-[10px] text-on-surface-variant mt-0.5">Financial Freedom</span>
                    </Link>
                    <Link href="/health-fitness-calculators" className="bg-surface-container-lowest border border-outline-variant/30 p-3.5 rounded-xl shadow-sm hover:shadow-md hover:border-secondary/40 transition-all flex flex-col items-center text-center">
                      <span className="material-symbols-outlined text-secondary text-[24px] mb-2">monitor_heart</span>
                      <span className="font-body-sm font-semibold text-on-surface text-[13px]">Health &amp; Age</span>
                      <span className="font-label-caps text-[10px] text-on-surface-variant mt-0.5">Fitness &amp; BMI</span>
                    </Link>
                    <Link href="/" className="bg-surface-container-lowest border border-outline-variant/30 p-3.5 rounded-xl shadow-sm hover:shadow-md hover:border-primary/40 transition-all flex flex-col items-center text-center">
                      <span className="material-symbols-outlined text-outline text-[24px] mb-2">calculate</span>
                      <span className="font-body-sm font-semibold text-on-surface text-[13px]">All Calculators</span>
                      <span className="font-label-caps text-[10px] text-on-surface-variant mt-0.5">Browse 50+ Tools</span>
                    </Link>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* SECTION 15: PRIVACY & ACCURACY GUARANTEE */}
          <section className="w-full py-space-lg bg-surface border-t border-surface-container/80 mt-auto">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-[28px]">lock</span>
                  <div>
                    <div className="font-body-md font-semibold text-on-surface">100% Private &amp; Secure</div>
                    <div className="font-body-sm text-[12px] text-on-surface-variant">All dates and calculations stay strictly on your device. Nothing is saved or sent to any server.</div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <span className="font-data-mono text-[11px] bg-surface-container border border-outline-variant/30 px-2.5 py-1 rounded text-on-surface-variant">Instant Results</span>
                  <span className="font-data-mono text-[11px] bg-surface-container border border-outline-variant/30 px-2.5 py-1 rounded text-on-surface-variant">Leap Year Accurate</span>
                  <span className="font-data-mono text-[11px] bg-surface-container border border-outline-variant/30 px-2.5 py-1 rounded text-on-surface-variant">Private in Your Browser</span>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
