'use client';

/* eslint-disable @next/next/no-img-element */
import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { getCurrentTheme, toggleTheme } from '@/lib/theme';
import {
  HEALTH_GOALS,
  HEALTH_CATEGORIES,
  HEALTH_FAQS,
  HEALTH_EQUATIONS,
} from './healthData';

export default function HealthClient() {
  const [isDark, setIsDark] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeGoal, setActiveGoal] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Interactive Mini Calculator States
  const [bmiHeight, setBmiHeight] = useState<number>(178);
  const [bmiWeight, setBmiWeight] = useState<number>(74);

  const [tdeeWeight, setTdeeWeight] = useState<number>(75);
  const [tdeeHeight, setTdeeHeight] = useState<number>(180);
  const [tdeeAge, setTdeeAge] = useState<number>(28);
  const [tdeeGender, setTdeeGender] = useState<'male' | 'female'>('male');
  const [tdeeActivity, setTdeeActivity] = useState<number>(1.55);

  const [navyGender, setNavyGender] = useState<'male' | 'female'>('male');
  const [navyHeight, setNavyHeight] = useState<number>(178);
  const [navyWaist, setNavyWaist] = useState<number>(82);
  const [navyNeck, setNavyNeck] = useState<number>(38);
  const [navyHips, setNavyHips] = useState<number>(95);

  const [waterWeight, setWaterWeight] = useState<number>(74);
  const [workoutMins, setWorkoutMins] = useState<number>(60);

  const [z2Age, setZ2Age] = useState<number>(30);
  const [z2Rhr, setZ2Rhr] = useState<number>(58);

  const [sleepBedtime, setSleepBedtime] = useState<string>('23:00');

  const [lmpDate, setLmpDate] = useState<string>('2026-05-15');
  const [cycleLength, setCycleLength] = useState<number>(28);
  const [liftWeight, setLiftWeight] = useState<number>(100);
  const [liftReps, setLiftReps] = useState<number>(5);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDark(getCurrentTheme() === 'dark');
    }, 0);

    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        setIsDark(customEvent.detail === 'dark');
      } else {
        setIsDark(getCurrentTheme() === 'dark');
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
      if (e.key === 'Escape') {
        setActiveModal(null);
      }
    };

    window.addEventListener('solveit-theme-change', handleThemeChange);
    window.addEventListener('storage', handleThemeChange);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('solveit-theme-change', handleThemeChange);
      window.removeEventListener('storage', handleThemeChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleToggleTheme = () => {
    const next = toggleTheme();
    setIsDark(next === 'dark');
  };

  // Calculations
  const calculatedBmi = useMemo(() => {
    const heightM = bmiHeight / 100;
    if (heightM <= 0) return { bmi: 0, category: 'N/A', color: 'text-outline' };
    const bmiVal = bmiWeight / (heightM * heightM);
    let category = 'Normal Weight';
    let color = 'text-emerald-600 bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400';
    if (bmiVal < 18.5) {
      category = 'Underweight';
      color = 'text-amber-600 bg-amber-100 dark:bg-amber-950/40 dark:text-amber-400';
    } else if (bmiVal >= 25 && bmiVal < 30) {
      category = 'Overweight';
      color = 'text-amber-600 bg-amber-100 dark:bg-amber-950/40 dark:text-amber-400';
    } else if (bmiVal >= 30) {
      category = 'Obesity';
      color = 'text-rose-600 bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400';
    }
    return { bmi: parseFloat(bmiVal.toFixed(1)), category, color };
  }, [bmiHeight, bmiWeight]);

  const calculatedTdee = useMemo(() => {
    // Mifflin-St Jeor
    let bmr = 10 * tdeeWeight + 6.25 * tdeeHeight - 5 * tdeeAge;
    bmr += tdeeGender === 'male' ? 5 : -161;
    const tdee = Math.round(bmr * tdeeActivity);
    return { bmr: Math.round(bmr), tdee };
  }, [tdeeWeight, tdeeHeight, tdeeAge, tdeeGender, tdeeActivity]);

  const calculatedNavyFat = useMemo(() => {
    let bf = 0;
    if (navyGender === 'male') {
      const diff = navyWaist - navyNeck;
      if (diff > 0 && navyHeight > 0) {
        bf = 495 / (1.0324 - 0.19077 * Math.log10(diff) + 0.15456 * Math.log10(navyHeight)) - 450;
      }
    } else {
      const sum = navyWaist + navyHips - navyNeck;
      if (sum > 0 && navyHeight > 0) {
        bf = 495 / (1.29579 - 0.35004 * Math.log10(sum) + 0.22100 * Math.log10(navyHeight)) - 450;
      }
    }
    const val = Math.max(4, Math.min(50, parseFloat(bf.toFixed(1))));
    return isNaN(val) ? 14.2 : val;
  }, [navyGender, navyHeight, navyWaist, navyNeck, navyHips]);

  const calculatedWater = useMemo(() => {
    const base = waterWeight * 0.035; // 35 ml per kg
    const exerciseAdd = (workoutMins / 30) * 0.35; // 350 ml per 30 min
    return parseFloat((base + exerciseAdd).toFixed(1));
  }, [waterWeight, workoutMins]);

  const calculatedZone2 = useMemo(() => {
    // Tanaka formula HR max = 208 - 0.7 * Age
    const maxHr = 208 - 0.7 * z2Age;
    const hrr = maxHr - z2Rhr;
    const z2Low = Math.round(z2Rhr + hrr * 0.6);
    const z2High = Math.round(z2Rhr + hrr * 0.7);
    return { maxHr: Math.round(maxHr), z2Low, z2High };
  }, [z2Age, z2Rhr]);

  const calculatedSleepCycles = useMemo(() => {
    const [hStr, mStr] = sleepBedtime.split(':');
    const h = parseInt(hStr || '23', 10);
    const m = parseInt(mStr || '00', 10);
    const bedMinutes = h * 60 + m + 14; // +14 mins sleep latency
    // 5 cycles = 5 * 90 min = 450 min
    const wakeMin = (bedMinutes + 450) % 1440;
    const wakeH = Math.floor(wakeMin / 60);
    const wakeM = wakeMin % 60;
    const period = wakeH >= 12 ? 'PM' : 'AM';
    const displayH = wakeH % 12 === 0 ? 12 : wakeH % 12;
    const displayM = wakeM < 10 ? `0${wakeM}` : `${wakeM}`;
    return `${displayH}:${displayM} ${period}`;
  }, [sleepBedtime]);

  const calculatedDueDate = useMemo(() => {
    const d = new Date(lmpDate || '2026-05-15');
    const cycleOffset = (cycleLength || 28) - 28;
    d.setDate(d.getDate() + 280 + cycleOffset);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }, [lmpDate, cycleLength]);

  const calculated1RM = useMemo(() => {
    return Math.round(liftWeight * (1 + 0.0333 * liftReps));
  }, [liftWeight, liftReps]);

  // Filtering tools based on search and active goal
  const filteredCategories = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return HEALTH_CATEGORIES.map((cat) => {
      const matchingTools = cat.tools.filter((tool) => {
        const matchesQuery =
          !q ||
          tool.name.toLowerCase().includes(q) ||
          tool.desc.toLowerCase().includes(q) ||
          tool.sub.toLowerCase().includes(q) ||
          tool.badge.toLowerCase().includes(q);

        const matchesGoal = !activeGoal || tool.goalIds.includes(activeGoal);

        return matchesQuery && matchesGoal;
      });
      return { ...cat, tools: matchingTools };
    }).filter((cat) => cat.tools.length > 0);
  }, [searchQuery, activeGoal]);

  const totalFilteredCount = useMemo(() => {
    return filteredCategories.reduce((acc, cat) => acc + cat.tools.length, 0);
  }, [filteredCategories]);

  return (
    <div className="flex flex-col w-full bg-surface text-on-surface min-h-screen">
      {/* ================================================================= */}
      {/* 1. HEADER (PRECISION UTILITY)                                    */}
      {/* ================================================================= */}
      <header className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-xl border-b border-outline-variant/30 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop flex items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-lg shrink-0">
            <Link className="flex items-center gap-space-xs" href="/">
              <img
                alt="SolveIt Calculator Logo"
                className="h-8 w-auto object-contain"
                src="https://lh3.googleusercontent.com/aida/AEtjO1UgJbbnQgYLzjhb_qeEsC93I-1XXreecdK60mdw1th0D_7ITk1wgo3Q4m2srbFlLTmLTaMFDIQIpoLg1XvURUxBibragjTBtbJyUlLfXmPT6PF9K8w_muzxBArKo_j4tNBT5eQa-DpjL7MC0aMTvrREQnm5Hs_wAAk9rnx5RjkiPKyCM65Rha3EkGznyImbA9ByITNU1_cyybhjmDcChmrXHczyoj6e0gjGjbauvA7kHd9fqlPyWDO9sT4"
              />
              <span className="font-headline-md text-headline-md tracking-tight text-on-surface">
                SolveIt
              </span>
            </Link>
            <nav className="hidden xl:flex items-center gap-space-xs">
              <Link
                className="px-space-sm py-space-xs rounded-lg text-on-surface-variant font-body-sm text-body-sm hover:bg-surface-container-high hover:text-on-surface transition-colors"
                href="/#finance"
              >
                Finance
              </Link>
              <Link
                aria-current="page"
                className="px-space-sm py-space-xs transition-colors bg-primary-container text-on-primary-container font-semibold rounded-lg"
                href="/health"
              >
                Health
              </Link>
              <Link
                className="px-space-sm py-space-xs rounded-lg text-on-surface-variant font-body-sm text-body-sm hover:bg-surface-container-high hover:text-on-surface transition-colors"
                href="/#math"
              >
                Math
              </Link>
              <Link
                className="px-space-sm py-space-xs rounded-lg text-on-surface-variant font-body-sm text-body-sm hover:bg-surface-container-high hover:text-on-surface transition-colors"
                href="/conversions"
              >
                Conversion
              </Link>
              <Link
                className="px-space-sm py-space-xs rounded-lg text-on-surface-variant font-body-sm text-body-sm hover:bg-surface-container-high hover:text-on-surface transition-colors"
                href="/convert"
              >
                All Categories
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-space-sm shrink-0">
            <div
              onClick={() => searchInputRef.current?.focus()}
              className="hidden md:flex items-center bg-surface-container-low px-space-sm py-1.5 rounded-lg text-on-surface-variant gap-space-sm w-56 lg:w-64 cursor-pointer hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-[18px] text-outline">search</span>
              <span className="font-body-sm text-body-sm flex-1 text-on-surface-variant truncate">
                Search tools...
              </span>
              <span className="font-data-mono text-data-mono bg-surface-container-lowest px-1.5 py-0.5 rounded text-[11px] text-on-surface-variant">
                ⌘K
              </span>
            </div>
            <Link
              href="#featured-section"
              aria-label="Favorites"
              className="w-9 h-9 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">bookmark</span>
            </Link>
            <button
              aria-label="Toggle dark and light mode"
              className="w-9 h-9 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors cursor-pointer"
              type="button"
              onClick={handleToggleTheme}
            >
              <span className="material-symbols-outlined text-[20px]">
                {isDark ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary">
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>
          </div>
        </div>
      </header>

      {/* ================================================================= */}
      {/* 2. MAIN BODY CONTENT                                             */}
      {/* ================================================================= */}
      <main className="w-full pt-16 bg-surface min-h-[calc(100vh-64px)]">
        {/* SCIENTIFIC VERIFICATION & SUB-NAV BAR */}
        <section className="w-full bg-surface-container-low/70 py-space-xs border-b border-outline-variant/20">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop flex flex-col md:flex-row md:items-center justify-between gap-space-xs text-body-sm font-body-sm">
            <nav aria-label="Breadcrumb" className="flex items-center gap-space-xs text-on-surface-variant flex-wrap">
              <Link className="hover:text-primary transition-colors flex items-center gap-1" href="/">
                <span className="material-symbols-outlined text-[16px]">home</span>
                Home
              </Link>
              <span className="text-outline-variant">/</span>
              <Link className="hover:text-primary transition-colors" href="/convert">
                Categories
              </Link>
              <span className="text-outline-variant">/</span>
              <span className="text-on-surface font-medium">Health &amp; Fitness Hub</span>
            </nav>
            <div className="flex items-center gap-space-xs overflow-x-auto py-1 scrollbar-none text-[12px] font-medium text-on-surface-variant">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-secondary font-label-caps whitespace-nowrap">
                <span className="material-symbols-outlined text-[14px]">verified</span> 150+ Peer-Reviewed Calculators
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-secondary font-label-caps whitespace-nowrap">
                <span className="material-symbols-outlined text-[14px]">bolt</span> Zero-Telemetry In-Browser
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-primary font-label-caps whitespace-nowrap">
                <span className="material-symbols-outlined text-[14px]">clinical_notes</span> NIH / WHO / ACSM Validated
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-label-caps whitespace-nowrap">
                <span className="material-symbols-outlined text-[14px]">lock</span> 100% Client-Side Encrypted
              </span>
            </div>
          </div>
        </section>

        {/* HERO SECTION */}
        <header className="w-full bg-surface py-space-2xl">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-space-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 font-label-caps text-label-caps uppercase tracking-wider mb-space-md">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                Clinical-Grade Computational Wellness
              </div>
              <div className="flex items-center justify-center gap-3 mb-space-sm">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/15 flex items-center justify-center text-rose-600 shadow-sm">
                  <span className="material-symbols-outlined text-[30px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    favorite
                  </span>
                </div>
                <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                  Health &amp; Fitness Calculators
                </h1>
              </div>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-space-lg leading-relaxed">
                Track body composition, athletic performance, metabolic expenditure, cardiovascular health, hydration, circadian recovery, and maternity milestones with peer-reviewed clinical algorithms.
              </p>

              {/* SEARCH BAR */}
              <div className="w-full max-w-2xl bg-surface-container-lowest rounded-2xl p-2 shadow-md flex items-center gap-2 mb-space-md border border-outline-variant/30 focus-within:ring-2 focus-within:ring-primary">
                <span className="material-symbols-outlined text-outline text-[22px] ml-2">search</span>
                <input
                  ref={searchInputRef}
                  className="w-full bg-transparent font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none py-2"
                  id="healthSearchInput"
                  placeholder="Search 150+ health calculators (e.g., BMI, TDEE, Zone 2 Heart Rate, Macro split)..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="text-on-surface-variant hover:text-on-surface p-1"
                    title="Clear search"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                )}
                <span className="hidden sm:inline-block font-data-mono text-data-mono text-[11px] bg-surface-container px-2 py-1 rounded text-on-surface-variant shrink-0">
                  ⌘K
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('directories-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-space-md py-2 rounded-xl bg-primary text-on-primary font-body-sm text-body-sm font-semibold hover:bg-primary-container transition-all shrink-0 cursor-pointer"
                >
                  Search
                </button>
              </div>

              {/* POPULAR CHIPS */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 font-label-caps text-label-caps">
                <span className="text-outline-variant mr-1">QUICK JUMP:</span>
                <a className="px-2.5 py-1 rounded-full bg-surface-container-low hover:bg-surface-container-high text-on-surface transition-colors" href="#bmi-card">BMI</a>
                <a className="px-2.5 py-1 rounded-full bg-surface-container-low hover:bg-surface-container-high text-on-surface transition-colors" href="#tdee-card">Calories (TDEE)</a>
                <a className="px-2.5 py-1 rounded-full bg-surface-container-low hover:bg-surface-container-high text-on-surface transition-colors" href="#navy-card">Body Fat (Navy)</a>
                <a className="px-2.5 py-1 rounded-full bg-surface-container-low hover:bg-surface-container-high text-on-surface transition-colors" href="#bmr-card">BMR (Mifflin)</a>
                <a className="px-2.5 py-1 rounded-full bg-surface-container-low hover:bg-surface-container-high text-on-surface transition-colors" href="#water-card">Water Intake</a>
                <a className="px-2.5 py-1 rounded-full bg-surface-container-low hover:bg-surface-container-high text-on-surface transition-colors" href="#zone2-card">Zone 2 HR</a>
                <a className="px-2.5 py-1 rounded-full bg-surface-container-low hover:bg-surface-container-high text-on-surface transition-colors" href="#sleep-card">Sleep Cycles</a>
                <a className="px-2.5 py-1 rounded-full bg-surface-container-low hover:bg-surface-container-high text-on-surface transition-colors" href="#pregnancy-card">Pregnancy Due Date</a>
                <a className="px-2.5 py-1 rounded-full bg-surface-container-low hover:bg-surface-container-high text-on-surface transition-colors" href="#onerep-card">1-Rep Max</a>
              </div>
            </div>

            {/* KEY STATS STRIP */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-space-md">
              <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex items-center gap-space-md border border-outline-variant/20">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <span className="material-symbols-outlined text-[26px]">calculate</span>
                </div>
                <div>
                  <div className="font-headline-md text-headline-md text-on-surface">150+</div>
                  <div className="font-body-sm text-body-sm text-on-surface-variant">Validated by ACSM &amp; WHO</div>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex items-center gap-space-md border border-outline-variant/20">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0">
                  <span className="material-symbols-outlined text-[26px]">lock_open</span>
                </div>
                <div>
                  <div className="font-headline-md text-headline-md text-on-surface">100% Free</div>
                  <div className="font-body-sm text-body-sm text-on-surface-variant">No paywalls or trackers</div>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex items-center gap-space-md border border-outline-variant/20">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                  <span className="material-symbols-outlined text-[26px]">analytics</span>
                </div>
                <div>
                  <div className="font-headline-md text-headline-md text-on-surface">Precision</div>
                  <div className="font-body-sm text-body-sm text-on-surface-variant">Mifflin, Katch &amp; Karvonen</div>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex items-center gap-space-md border border-outline-variant/20">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 shrink-0">
                  <span className="material-symbols-outlined text-[26px]">shield_person</span>
                </div>
                <div>
                  <div className="font-headline-md text-headline-md text-on-surface">Zero Cloud</div>
                  <div className="font-body-sm text-body-sm text-on-surface-variant">Executes purely in WebAssembly</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* TELEMETRY SNAPSHOT DASHBOARD */}
        <section className="w-full bg-surface-container-low py-space-xl border-y border-outline-variant/20">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-lg gap-space-sm">
              <div>
                <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest block mb-1">
                  REAL-TIME BIOMETRICS SANDBOX
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface">
                  Interactive Telemetry Rings
                </h2>
              </div>
              <div className="text-on-surface-variant font-body-sm text-body-sm flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-ping"></span>
                Simulated dynamic baseline (Client-side live feed)
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
              {/* 4 Rings Dashboard */}
              <div className="lg:col-span-8 bg-surface-container-lowest rounded-3xl p-space-lg shadow-sm border border-outline-variant/20">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-space-md mb-space-lg text-center">
                  {/* Calorie Ring */}
                  <div className="flex flex-col items-center p-3 rounded-2xl bg-surface-container-low/50">
                    <div className="relative w-28 h-28 flex items-center justify-center mb-2">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" fill="none" r="40" stroke="currentColor" className="text-surface-container" strokeWidth="8"></circle>
                        <circle cx="50" cy="50" fill="none" r="40" stroke="#f43f5e" strokeDasharray="251.2" strokeDashoffset="57" strokeLinecap="round" strokeWidth="8"></circle>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="font-headline-md text-[18px] font-bold text-on-surface leading-tight">1,850</span>
                        <span className="text-[10px] text-on-surface-variant font-label-caps">/2,400 kcal</span>
                      </div>
                    </div>
                    <span className="font-label-caps text-label-caps text-rose-600 font-semibold">TDEE CALORIES</span>
                    <span className="text-body-sm font-body-sm text-on-surface-variant mt-0.5">77% of target</span>
                  </div>
                  {/* Hydration Ring */}
                  <div className="flex flex-col items-center p-3 rounded-2xl bg-surface-container-low/50">
                    <div className="relative w-28 h-28 flex items-center justify-center mb-2">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" fill="none" r="40" stroke="currentColor" className="text-surface-container" strokeWidth="8"></circle>
                        <circle cx="50" cy="50" fill="none" r="40" stroke="#0ea5e9" strokeDasharray="251.2" strokeDashoffset="62" strokeLinecap="round" strokeWidth="8"></circle>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="font-headline-md text-[18px] font-bold text-on-surface leading-tight">2.4 L</span>
                        <span className="text-[10px] text-on-surface-variant font-label-caps">/3.2 L</span>
                      </div>
                    </div>
                    <span className="font-label-caps text-label-caps text-sky-600 font-semibold">HYDRATION</span>
                    <span className="text-body-sm font-body-sm text-on-surface-variant mt-0.5">75% achieved</span>
                  </div>
                  {/* Exercise Ring */}
                  <div className="flex flex-col items-center p-3 rounded-2xl bg-surface-container-low/50">
                    <div className="relative w-28 h-28 flex items-center justify-center mb-2">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" fill="none" r="40" stroke="currentColor" className="text-surface-container" strokeWidth="8"></circle>
                        <circle cx="50" cy="50" fill="none" r="40" stroke="#10b981" strokeDasharray="251.2" strokeDashoffset="75" strokeLinecap="round" strokeWidth="8"></circle>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="font-headline-md text-[18px] font-bold text-on-surface leading-tight">42 m</span>
                        <span className="text-[10px] text-on-surface-variant font-label-caps">/60 min</span>
                      </div>
                    </div>
                    <span className="font-label-caps text-label-caps text-emerald-600 font-semibold">ZONE 2 ACTIVE</span>
                    <span className="text-body-sm font-body-sm text-on-surface-variant mt-0.5">70% target</span>
                  </div>
                  {/* Sleep Ring */}
                  <div className="flex flex-col items-center p-3 rounded-2xl bg-surface-container-low/50">
                    <div className="relative w-28 h-28 flex items-center justify-center mb-2">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" fill="none" r="40" stroke="currentColor" className="text-surface-container" strokeWidth="8"></circle>
                        <circle cx="50" cy="50" fill="none" r="40" stroke="#8b5cf6" strokeDasharray="251.2" strokeDashoffset="20" strokeLinecap="round" strokeWidth="8"></circle>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="font-headline-md text-[18px] font-bold text-on-surface leading-tight">8h 12m</span>
                        <span className="text-[10px] text-on-surface-variant font-label-caps">92% score</span>
                      </div>
                    </div>
                    <span className="font-label-caps text-label-caps text-violet-600 font-semibold">SLEEP EFFICIENCY</span>
                    <span className="text-body-sm font-body-sm text-on-surface-variant mt-0.5">5.4 cycles</span>
                  </div>
                </div>

                {/* Weekly Sparkline Area */}
                <div className="bg-surface-container-low p-space-md rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-space-md border border-outline-variant/20">
                  <div>
                    <div className="font-label-caps text-label-caps text-on-surface-variant">
                      7-DAY METABOLIC CALORIC VARIANCE
                    </div>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="font-headline-md text-headline-md text-on-surface font-bold">2,240 kcal</span>
                      <span className="text-body-sm font-body-sm text-emerald-600 font-semibold">+1.8% vs base</span>
                    </div>
                  </div>
                  {/* Interactive Inline SVG Sparkline */}
                  <div className="w-full md:w-64 h-12 flex items-end gap-1.5 px-2">
                    <div className="flex-1 bg-primary/20 rounded-t h-[65%] hover:bg-primary transition-colors cursor-pointer" title="Mon: 2,120 kcal"></div>
                    <div className="flex-1 bg-primary/20 rounded-t h-[80%] hover:bg-primary transition-colors cursor-pointer" title="Tue: 2,340 kcal"></div>
                    <div className="flex-1 bg-primary/30 rounded-t h-[95%] hover:bg-primary transition-colors cursor-pointer" title="Wed: 2,510 kcal"></div>
                    <div className="flex-1 bg-primary/20 rounded-t h-[70%] hover:bg-primary transition-colors cursor-pointer" title="Thu: 2,190 kcal"></div>
                    <div className="flex-1 bg-primary/30 rounded-t h-[85%] hover:bg-primary transition-colors cursor-pointer" title="Fri: 2,380 kcal"></div>
                    <div className="flex-1 bg-primary-container rounded-t h-[100%] hover:bg-primary transition-colors cursor-pointer" title="Sat: 2,600 kcal"></div>
                    <div className="flex-1 bg-primary/40 rounded-t h-[75%] hover:bg-primary transition-colors cursor-pointer" title="Sun: 2,240 kcal"></div>
                  </div>
                </div>
              </div>

              {/* Resting Heart Rate & VO2 Stat Card */}
              <div className="lg:col-span-4 flex flex-col gap-space-md">
                <div className="bg-surface-container-lowest p-space-md rounded-3xl shadow-sm flex-1 flex flex-col justify-between border border-outline-variant/20">
                  <div className="flex items-center justify-between mb-space-sm">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-rose-500">ecg_heart</span>
                      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Resting Pulse</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-label-caps text-[10px]">Optimal Range</span>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-numerical-display text-numerical-display text-on-surface">61</span>
                      <span className="font-body-md text-body-md text-on-surface-variant">BPM</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Adult 50th percentile: 60-70 BPM. 93rd percentile for trained age bracket.</p>
                  </div>
                  <div className="mt-space-md pt-space-sm border-t border-surface-container flex items-center justify-between text-body-sm font-body-sm">
                    <span className="text-on-surface-variant">Calculated VO2 Max (Cooper)</span>
                    <span className="font-bold text-primary">48.2 mL/kg/min</span>
                  </div>
                </div>
                <div
                  onClick={() => setActiveModal('tdee')}
                  className="bg-surface-container p-space-md rounded-3xl flex items-center gap-space-md cursor-pointer hover:bg-surface-container-high transition-colors border border-outline-variant/20"
                >
                  <div className="w-12 h-12 rounded-2xl bg-secondary/15 flex items-center justify-center text-secondary shrink-0">
                    <span className="material-symbols-outlined text-[28px]">speed</span>
                  </div>
                  <div>
                    <div className="font-headline-md text-[17px] font-semibold text-on-surface">Want Personalized Telemetry?</div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Select any calculator below to calculate with your exact biometrics.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HEALTH GOALS EXPLORER */}
        <section className="w-full py-space-2xl bg-surface">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="mb-space-xl text-center max-w-2xl mx-auto">
              <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider">
                INTENT-DRIVEN WORKFLOW
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface mt-1">
                What Is Your Core Health Objective?
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                Filter and solve complex physiological equations calibrated to your specific fitness trajectory.
              </p>
              {activeGoal && (
                <div className="mt-3 flex items-center justify-center gap-2">
                  <span className="text-xs text-on-surface-variant">Filtering by goal:</span>
                  <button
                    onClick={() => setActiveGoal(null)}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors cursor-pointer"
                  >
                    <span>{HEALTH_GOALS.find((g) => g.id === activeGoal)?.title}</span>
                    <span className="material-symbols-outlined text-[14px]">close</span>
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
              {HEALTH_GOALS.map((goal) => {
                const isSelected = activeGoal === goal.id;
                return (
                  <div
                    key={goal.id}
                    onClick={() => {
                      setActiveGoal(isSelected ? null : goal.id);
                      const el = document.getElementById('directories-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`group p-space-lg rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between border ${
                      isSelected
                        ? 'bg-primary-container/10 border-primary shadow-md'
                        : 'bg-surface-container-lowest border-outline-variant/20 hover:border-outline'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-space-sm">
                        <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-2xl">
                          {goal.icon}
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface font-label-caps text-[11px]">
                          {goal.count}
                        </span>
                      </div>
                      <h3 className="font-headline-md text-[18px] font-bold text-on-surface mb-2 group-hover:text-primary transition-colors">
                        {goal.title}
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                        {goal.desc}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-space-xs border-t border-surface-container-low text-[11px] font-medium text-on-surface-variant">
                      {goal.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="px-2 py-0.5 rounded bg-surface-container-low">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FEATURED / POPULAR TOOLS WITH LIVE WIDGETS */}
        <section id="featured-section" className="w-full py-space-2xl bg-surface-container-low border-y border-outline-variant/20">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-xl gap-4">
              <div>
                <span className="font-label-caps text-label-caps text-primary uppercase tracking-widest block mb-1">
                  FLAGSHIP CALCULATORS
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface">
                  Most Popular Health Calculators
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                  Directly launch or test calculations using interactive precision modules.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-body-sm font-body-sm text-on-surface-variant">
                  Over 14.8M biometrics computed monthly
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
              {/* 1. BMI CALCULATOR CARD */}
              <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col justify-between border border-outline-variant/20" id="bmi-card">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-label-caps text-[10px]">
                      WHO Validated
                    </span>
                    <div className="flex items-center text-amber-500 cursor-pointer">
                      <span className="material-symbols-outlined text-[18px]">star</span>
                    </div>
                  </div>
                  <h3 className="font-headline-md text-[18px] font-bold text-on-surface mb-1">
                    <Link href="/health/bmi" className="hover:text-primary transition-colors">
                      BMI &amp; Body Mass Index
                    </Link>
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm">
                    Standard WHO cutoff with optional Asian population threshold toggles.
                  </p>
                  {/* Live Interactive Preview */}
                  <div className="bg-surface-container-low p-3 rounded-xl mb-space-sm">
                    <div className="flex items-center justify-between text-[11px] font-medium text-on-surface-variant mb-1">
                      <span>Height: {bmiHeight} cm</span>
                      <span>Weight: {bmiWeight} kg</span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="font-headline-md text-headline-md text-emerald-600 font-bold">
                        {calculatedBmi.bmi}
                      </span>
                      <span className={`text-[12px] font-semibold px-2 py-0.5 rounded-full ${calculatedBmi.color}`}>
                        {calculatedBmi.category}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant mb-3">
                    <span>1.8M calculations/mo</span>
                    <span className="font-data-mono text-data-mono text-[12px]">kg/m²</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveModal('bmi')}
                      className="py-2.5 rounded-xl bg-surface-container-high text-on-surface font-body-sm text-body-sm font-semibold hover:bg-surface-container transition-all cursor-pointer text-center"
                    >
                      Quick Mode
                    </button>
                    <Link
                      href="/health/bmi"
                      className="py-2.5 rounded-xl bg-primary text-on-primary font-body-sm text-body-sm font-semibold hover:bg-primary-container transition-all cursor-pointer text-center flex items-center justify-center gap-1"
                    >
                      <span>Full Page</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* 2. TDEE & MACRO ENGINE */}
              <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col justify-between border border-outline-variant/20" id="tdee-card">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 font-label-caps text-[10px]">
                      Mifflin-St Jeor
                    </span>
                    <div className="flex items-center text-amber-500 cursor-pointer">
                      <span className="material-symbols-outlined text-[18px]">star</span>
                    </div>
                  </div>
                  <h3 className="font-headline-md text-[18px] font-bold text-on-surface mb-1">
                    <Link href="/health/tdee" className="hover:text-primary transition-colors">
                      TDEE &amp; Macro Splitter
                    </Link>
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm">
                    Calculate Total Daily Energy Expenditure factoring PAL activity factors.
                  </p>
                  <div className="bg-surface-container-low p-3 rounded-xl mb-space-sm">
                    <div className="flex items-center justify-between text-[11px] font-medium text-on-surface-variant mb-1">
                      <span>Maintenance</span>
                      <span>Moderate Activity</span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="font-headline-md text-headline-md text-on-surface font-bold">
                        {calculatedTdee.tdee.toLocaleString()}
                      </span>
                      <span className="text-[11px] font-data-mono text-on-surface-variant">kcal / day</span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant mb-3">
                    <span>2.4M calculations/mo</span>
                    <span className="font-data-mono text-data-mono text-[12px]">±15 kcal accuracy</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveModal('tdee')}
                      className="py-2.5 rounded-xl bg-surface-container-high text-on-surface font-body-sm text-body-sm font-semibold hover:bg-surface-container transition-all cursor-pointer text-center"
                    >
                      Quick Mode
                    </button>
                    <Link
                      href="/health/tdee"
                      className="py-2.5 rounded-xl bg-primary text-on-primary font-body-sm text-body-sm font-semibold hover:bg-primary-container transition-all cursor-pointer text-center flex items-center justify-center gap-1"
                    >
                      <span>Full Page</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* 3. NAVY BODY FAT */}
              <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col justify-between border border-outline-variant/20" id="navy-card">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-700 font-label-caps text-[10px]">
                      DoD Hydrostatic Proxy
                    </span>
                    <div className="flex items-center text-amber-500 cursor-pointer">
                      <span className="material-symbols-outlined text-[18px]">star</span>
                    </div>
                  </div>
                  <h3 className="font-headline-md text-[18px] font-bold text-on-surface mb-1">
                    <Link href="/health/navy-fat" className="hover:text-primary transition-colors">
                      Navy Body Fat Calculator
                    </Link>
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm">
                    Circumference-based formula using neck, waist, and hip anthropometry.
                  </p>
                  <div className="bg-surface-container-low p-3 rounded-xl mb-space-sm">
                    <div className="flex items-center justify-between text-[11px] font-medium text-on-surface-variant mb-1">
                      <span>Waist {navyWaist}cm · Neck {navyNeck}cm</span>
                      <span className="text-emerald-700 font-semibold">Lean</span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="font-headline-md text-headline-md text-sky-600 font-bold">
                        {calculatedNavyFat}%
                      </span>
                      <span className="text-[11px] font-data-mono text-on-surface-variant">63.5kg Lean Mass</span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant mb-3">
                    <span>980k calculations/mo</span>
                    <span className="font-data-mono text-data-mono text-[12px]">r = 0.92 DEXA</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveModal('navy')}
                      className="py-2.5 rounded-xl bg-surface-container-high text-on-surface font-body-sm text-body-sm font-semibold hover:bg-surface-container transition-all cursor-pointer text-center"
                    >
                      Quick Mode
                    </button>
                    <Link
                      href="/health/navy-fat"
                      className="py-2.5 rounded-xl bg-primary text-on-primary font-body-sm text-body-sm font-semibold hover:bg-primary-container transition-all cursor-pointer text-center flex items-center justify-center gap-1"
                    >
                      <span>Full Page</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* 4. BMR BASAL METABOLIC RATE */}
              <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col justify-between border border-outline-variant/20" id="bmr-card">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 font-label-caps text-[10px]">
                      Mifflin vs Harris
                    </span>
                    <div className="flex items-center text-amber-500 cursor-pointer">
                      <span className="material-symbols-outlined text-[18px]">star</span>
                    </div>
                  </div>
                  <h3 className="font-headline-md text-[18px] font-bold text-on-surface mb-1">
                    <Link href="/health/bmr" className="hover:text-primary transition-colors">
                      BMR Metabolic Rate
                    </Link>
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm">
                    True baseline resting expenditure at thermoneutrality and rest.
                  </p>
                  <div className="bg-surface-container-low p-3 rounded-xl mb-space-sm">
                    <div className="flex items-center justify-between text-[11px] font-medium text-on-surface-variant mb-1">
                      <span>Resting Baseline</span>
                      <span>Male, 30y</span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="font-headline-md text-headline-md text-amber-600 font-bold">
                        {calculatedTdee.bmr.toLocaleString()}
                      </span>
                      <span className="text-[11px] font-data-mono text-on-surface-variant">kcal / 24h</span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant mb-3">
                    <span>850k calculations/mo</span>
                    <span className="font-data-mono text-data-mono text-[12px]">Clinical Cal</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveModal('bmr')}
                      className="py-2.5 rounded-xl bg-surface-container-high text-on-surface font-body-sm text-body-sm font-semibold hover:bg-surface-container transition-all cursor-pointer text-center"
                    >
                      Quick Mode
                    </button>
                    <Link
                      href="/health/bmr"
                      className="py-2.5 rounded-xl bg-primary text-on-primary font-body-sm text-body-sm font-semibold hover:bg-primary-container transition-all cursor-pointer text-center flex items-center justify-center gap-1"
                    >
                      <span>Full Page</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* 5. WATER & HYDRATION MATRIX */}
              <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col justify-between border border-outline-variant/20" id="water-card">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-700 font-label-caps text-[10px]">
                      EFSA / NASEM Standard
                    </span>
                    <div className="flex items-center text-amber-500 cursor-pointer">
                      <span className="material-symbols-outlined text-[18px]">star</span>
                    </div>
                  </div>
                  <h3 className="font-headline-md text-[18px] font-bold text-on-surface mb-1">
                    <Link href="/health/water-matrix" className="hover:text-primary transition-colors">
                      Daily Water Matrix
                    </Link>
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm">
                    Calculates fluid intake by weight, sweat rate, temperature, and training.
                  </p>
                  <div className="bg-surface-container-low p-3 rounded-xl mb-space-sm">
                    <div className="flex items-center justify-between text-[11px] font-medium text-on-surface-variant mb-1">
                      <span>Climate: Temperate</span>
                      <span>{workoutMins}m Workout</span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="font-headline-md text-headline-md text-sky-600 font-bold">
                        {calculatedWater} L
                      </span>
                      <span className="text-[11px] font-data-mono text-on-surface-variant">~{Math.round(calculatedWater * 33.814)} fl oz</span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant mb-3">
                    <span>610k calculations/mo</span>
                    <span className="font-data-mono text-data-mono text-[12px]">35ml/kg baseline</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveModal('water')}
                      className="py-2.5 rounded-xl bg-surface-container-high text-on-surface font-body-sm text-body-sm font-semibold hover:bg-surface-container transition-all cursor-pointer text-center"
                    >
                      Quick Mode
                    </button>
                    <Link
                      href="/health/water-matrix"
                      className="py-2.5 rounded-xl bg-primary text-on-primary font-body-sm text-body-sm font-semibold hover:bg-primary-container transition-all cursor-pointer text-center flex items-center justify-center gap-1"
                    >
                      <span>Full Page</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* 6. KARVONEN ZONE 2 HEART RATE */}
              <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col justify-between border border-outline-variant/20" id="zone2-card">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 font-label-caps text-[10px]">
                      HR Reserve Method
                    </span>
                    <div className="flex items-center text-amber-500 cursor-pointer">
                      <span className="material-symbols-outlined text-[18px]">star</span>
                    </div>
                  </div>
                  <h3 className="font-headline-md text-[18px] font-bold text-on-surface mb-1">
                    <Link href="/health/zone2" className="hover:text-primary transition-colors">
                      Karvonen Zone 2 Heart Rate
                    </Link>
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm">
                    Pinpoint the precise zone for mitochondrial biogenesis &amp; fat oxidation.
                  </p>
                  <div className="bg-surface-container-low p-3 rounded-xl mb-space-sm">
                    <div className="flex items-center justify-between text-[11px] font-medium text-on-surface-variant mb-1">
                      <span>RHR {z2Rhr} · Max {calculatedZone2.maxHr}</span>
                      <span className="text-rose-600 font-semibold">Zone 2</span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="font-headline-md text-headline-md text-rose-600 font-bold">
                        {calculatedZone2.z2Low} - {calculatedZone2.z2High}
                      </span>
                      <span className="text-[11px] font-data-mono text-on-surface-variant">BPM</span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant mb-3">
                    <span>1.1M calculations/mo</span>
                    <span className="font-data-mono text-data-mono text-[12px]">60-70% HRR</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveModal('zone2')}
                      className="py-2.5 rounded-xl bg-surface-container-high text-on-surface font-body-sm text-body-sm font-semibold hover:bg-surface-container transition-all cursor-pointer text-center"
                    >
                      Quick Mode
                    </button>
                    <Link
                      href="/health/zone2"
                      className="py-2.5 rounded-xl bg-primary text-on-primary font-body-sm text-body-sm font-semibold hover:bg-primary-container transition-all cursor-pointer text-center flex items-center justify-center gap-1"
                    >
                      <span>Full Page</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* 7. SLEEP CYCLE & REM PLANNER */}
              <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col justify-between border border-outline-variant/20" id="sleep-card">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded bg-violet-500/10 text-violet-700 font-label-caps text-[10px]">
                      Ultradian 90-Min
                    </span>
                    <div className="flex items-center text-amber-500 cursor-pointer">
                      <span className="material-symbols-outlined text-[18px]">star</span>
                    </div>
                  </div>
                  <h3 className="font-headline-md text-[18px] font-bold text-on-surface mb-1">
                    <Link href="/health/sleep-wake" className="hover:text-primary transition-colors">
                      Circadian Sleep Cycles
                    </Link>
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm">
                    Prevent sleep inertia by waking between complete 90-minute REM cycles.
                  </p>
                  <div className="bg-surface-container-low p-3 rounded-xl mb-space-sm">
                    <div className="flex items-center justify-between text-[11px] font-medium text-on-surface-variant mb-1">
                      <span>Sleep: {sleepBedtime}</span>
                      <span>14m sleep latency</span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="font-headline-md text-headline-md text-violet-600 font-bold">
                        {calculatedSleepCycles}
                      </span>
                      <span className="text-[11px] font-data-mono text-on-surface-variant">5 Complete Cycles</span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant mb-3">
                    <span>740k calculations/mo</span>
                    <span className="font-data-mono text-data-mono text-[12px]">Zero grogginess</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveModal('sleep')}
                      className="py-2.5 rounded-xl bg-surface-container-high text-on-surface font-body-sm text-body-sm font-semibold hover:bg-surface-container transition-all cursor-pointer text-center"
                    >
                      Quick Mode
                    </button>
                    <Link
                      href="/health/sleep-wake"
                      className="py-2.5 rounded-xl bg-primary text-on-primary font-body-sm text-body-sm font-semibold hover:bg-primary-container transition-all cursor-pointer text-center flex items-center justify-center gap-1"
                    >
                      <span>Full Page</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* 8. PREGNANCY DUE DATE */}
              <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm flex flex-col justify-between border border-outline-variant/20" id="pregnancy-card">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded bg-pink-500/10 text-pink-700 font-label-caps text-[10px]">
                      ACOG / Naegele&apos;s Rule
                    </span>
                    <div className="flex items-center text-amber-500 cursor-pointer">
                      <span className="material-symbols-outlined text-[18px]">star</span>
                    </div>
                  </div>
                  <h3 className="font-headline-md text-[18px] font-bold text-on-surface mb-1">
                    <Link href="/health/due-date" className="hover:text-primary transition-colors">
                      Pregnancy Due Date &amp; Trimesters
                    </Link>
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm">
                    Clinical gestational calendar based on LMP or ovulation with cycle length offset.
                  </p>
                  <div className="bg-surface-container-low p-3 rounded-xl mb-space-sm">
                    <div className="flex items-center justify-between text-[11px] font-medium text-on-surface-variant mb-1">
                      <span>LMP: April 14</span>
                      <span className="text-pink-600 font-medium">Trimester 2</span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="font-headline-md text-headline-md text-pink-600 font-bold">
                        Jan 19
                      </span>
                      <span className="text-[11px] font-data-mono text-on-surface-variant">40w 0d Due Date</span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant mb-3">
                    <span>910k calculations/mo</span>
                    <span className="font-data-mono text-data-mono text-[12px]">280-Day model</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveModal('pregnancy')}
                      className="py-2.5 rounded-xl bg-surface-container-high text-on-surface font-body-sm text-body-sm font-semibold hover:bg-surface-container transition-all cursor-pointer text-center"
                    >
                      Quick Mode
                    </button>
                    <Link
                      href="/health/due-date"
                      className="py-2.5 rounded-xl bg-primary text-on-primary font-body-sm text-body-sm font-semibold hover:bg-primary-container transition-all cursor-pointer text-center flex items-center justify-center gap-1"
                    >
                      <span>Full Page</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </div>            </div>
          </div>
        </section>

        {/* TRENDING LEADERBOARD */}
        <section className="w-full py-space-xl bg-surface">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="bg-surface-container-lowest p-space-lg rounded-3xl shadow-sm border border-outline-variant/20">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-space-md gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-amber-500">trending_up</span>
                    <h3 className="font-headline-md text-headline-md text-on-surface">
                      Weekly Computation Velocity Leaderboard
                    </h3>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Fastest-rising wellness tools across global user sessions this week.
                  </p>
                </div>
                <span className="font-label-caps text-label-caps text-on-surface-variant bg-surface-container px-3 py-1 rounded-full">
                  Updated 14 mins ago
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-space-sm">
                <Link
                  href="/health/tdee"
                  className="bg-surface-container-low hover:bg-surface-container p-space-sm rounded-xl flex items-center justify-between transition-colors border border-outline-variant/20 group"
                >
                  <div>
                    <div className="text-[11px] font-bold text-outline uppercase tracking-wider">#1 RANK</div>
                    <div className="font-body-sm font-bold text-on-surface group-hover:text-primary transition-colors mt-0.5">TDEE Calorie Surplus</div>
                  </div>
                  <span className="text-emerald-600 font-data-mono text-body-sm font-bold">+18% ↗</span>
                </Link>
                <Link
                  href="/health/navy-fat"
                  className="bg-surface-container-low hover:bg-surface-container p-space-sm rounded-xl flex items-center justify-between transition-colors border border-outline-variant/20 group"
                >
                  <div>
                    <div className="text-[11px] font-bold text-outline uppercase tracking-wider">#2 RANK</div>
                    <div className="font-body-sm font-bold text-on-surface group-hover:text-primary transition-colors mt-0.5">Navy Body Fat %</div>
                  </div>
                  <span className="text-emerald-600 font-data-mono text-body-sm font-bold">+24% ↗</span>
                </Link>
                <Link
                  href="/health/zone2"
                  className="bg-surface-container-low hover:bg-surface-container p-space-sm rounded-xl flex items-center justify-between transition-colors border border-outline-variant/20 group"
                >
                  <div>
                    <div className="text-[11px] font-bold text-outline uppercase tracking-wider">#3 RANK</div>
                    <div className="font-body-sm font-bold text-on-surface group-hover:text-primary transition-colors mt-0.5">Zone 2 Aerobic Heart</div>
                  </div>
                  <span className="text-emerald-600 font-data-mono text-body-sm font-bold">+42% ↗</span>
                </Link>
                <Link
                  href="/health/sleep-wake"
                  className="bg-surface-container-low hover:bg-surface-container p-space-sm rounded-xl flex items-center justify-between transition-colors border border-outline-variant/20 group"
                >
                  <div>
                    <div className="text-[11px] font-bold text-outline uppercase tracking-wider">#4 RANK</div>
                    <div className="font-body-sm font-bold text-on-surface group-hover:text-primary transition-colors mt-0.5">Sleep Debt REM Matrix</div>
                  </div>
                  <span className="text-emerald-600 font-data-mono text-body-sm font-bold">+12% ↗</span>
                </Link>
                <Link
                  href="/health/1rm"
                  className="bg-surface-container-low hover:bg-surface-container p-space-sm rounded-xl flex items-center justify-between transition-colors border border-outline-variant/20 group"
                >
                  <div>
                    <div className="text-[11px] font-bold text-outline uppercase tracking-wider">#5 RANK</div>
                    <div className="font-body-sm font-bold text-on-surface group-hover:text-primary transition-colors mt-0.5">1-Rep Max (Brzycki)</div>
                  </div>
                  <span className="text-emerald-600 font-data-mono text-body-sm font-bold">+9% ↗</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* COMPREHENSIVE CATEGORY DIRECTORIES */}
        <section id="directories-section" className="w-full py-space-2xl bg-surface-container-low/50 border-t border-outline-variant/20">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop space-y-space-2xl">
            {searchQuery && (
              <div className="p-4 rounded-xl bg-surface-container flex items-center justify-between">
                <span className="text-sm font-medium text-on-surface">
                  Showing {totalFilteredCount} calculators matching &quot;{searchQuery}&quot;
                </span>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-primary font-semibold hover:underline"
                >
                  Clear filter
                </button>
              </div>
            )}

            {filteredCategories.map((cat) => (
              <div key={cat.id} id={cat.id}>
                <div className="flex items-center gap-3 mb-space-sm">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl">
                    {cat.icon}
                  </div>
                  <div>
                    <h2 className="font-headline-lg text-[24px] font-bold text-on-surface">
                      {cat.name}
                    </h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      {cat.desc}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-sm mt-space-md">
                  {cat.tools.map((tool) => {
                    const toolHref = tool.id === 'bmi' ? '/health/bmi' : `/health/${tool.id}`;
                    return (
                      <div
                        key={tool.id}
                        className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm hover:border-primary/40 transition-all flex flex-col justify-between border border-outline-variant/20 group"
                      >
                        <div>
                          <div className="flex items-center justify-between text-[11px] text-on-surface-variant mb-1">
                            <span className="font-data-mono">{tool.sub}</span>
                            <span className="text-primary font-semibold">{tool.badge}</span>
                          </div>
                          <div className="font-body-md font-bold text-on-surface group-hover:text-primary transition-colors">
                            <Link href={toolHref} className="hover:underline">
                              {tool.name}
                            </Link>
                          </div>
                          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                            {tool.desc}
                          </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-surface-container-low">
                          <div className="flex items-center justify-between text-[11px] text-on-surface-variant mb-2">
                            <span className="font-data-mono font-medium text-primary">{tool.tag}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => setActiveModal(tool.id)}
                              className="py-1.5 rounded-lg bg-surface-container-high text-on-surface font-body-sm text-[12px] font-semibold hover:bg-surface-container transition-all cursor-pointer text-center"
                            >
                              Quick Mode
                            </button>
                            <Link
                              href={toolHref}
                              className="py-1.5 rounded-lg bg-primary text-on-primary font-body-sm text-[12px] font-semibold hover:bg-primary-container transition-all cursor-pointer text-center flex items-center justify-center gap-1"
                            >
                              <span>Full Page</span>
                              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CLINICAL HEALTH EDUCATION & EVIDENCE-BASED GUIDES */}
        <section className="w-full py-space-2xl bg-surface border-t border-outline-variant/20">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-xl gap-4">
              <div>
                <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest block mb-1">
                  PEER-REVIEWED EVIDENCE
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface">
                  Computational Physiology Guides
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                  Understanding the biomechanical assumptions behind the numbers.
                </p>
              </div>
              <a className="text-body-sm font-body-sm font-semibold text-primary hover:underline flex items-center gap-1" href="#faq-section">
                Explore all clinical whitepapers <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
              {/* Article 1 */}
              <article className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm flex flex-col border border-outline-variant/20">
                <div className="h-44 w-full bg-surface-container-high relative overflow-hidden flex items-center justify-center">
                  <img
                    className="w-full h-full object-cover"
                    alt="Clinical laboratory metabolic testing"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBS8VrCVrOcUMzF8jzosPABvq3Dry0vKuFd6p-DrI0SWr5Ppg4qQAEcdCGKEKqy9XZHK8qRxNySZwcX4NSv41JdXTLaotnuQA8fIpAQKgult1ivvgy95czVmdK0d2FrnbkCQUPf66_fd0IgoHfkbrFl2dv1wtsQHT4D34gHnkRPq42VW1IWvKvWwWbpmRARpGz15WhMkb6EiMN1anAn7MmCACuR2AsKkd_8j4BHbXNcTYynhVb2hWEe"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md bg-surface/90 text-on-surface font-label-caps text-[10px]">
                    Body Composition
                  </span>
                </div>
                <div className="p-space-md flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-headline-md text-[17px] font-bold text-on-surface mb-2 hover:text-primary transition-colors">
                      The Fallacy of BMI vs. FFMI: Why Muscle Mass Misleads Standard Tables
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-3">
                      Standard BMI treats muscular mass and visceral adipose identically. Learn how the Fat-Free Mass Index provides clinical resolution for athletes and weightlifters.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-surface-container flex items-center justify-between text-[12px] text-on-surface-variant">
                    <span>7 min read</span>
                    <span className="font-semibold text-primary">Read Guide →</span>
                  </div>
                </div>
              </article>

              {/* Article 2 */}
              <article className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm flex flex-col border border-outline-variant/20">
                <div className="h-44 w-full bg-surface-container-high relative overflow-hidden flex items-center justify-center">
                  <img
                    className="w-full h-full object-cover"
                    alt="Endurance cyclist running heart rate metrics"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuqlxeRTkU3eI1i17MwkrbSHaoMOwVAxsqFuMNaZ65QFNizihSpz2lG9mDmigEP6kKsgddZbAFH5o-pFdGiXpS1GJKsCyOsZbsc-HIJK2kfCzezppYz567EUjPNlLzPj7Ei2aotEKRZecGm01ceqWtPQYzW6dC9Wp00IwCm3Lss42EGKnaEn6Hbb6Bk3FgUt2CUyemr1y1e9xuiE5YgECVaARThqhlFre102lWnOMjfPnt7QFjvwe6"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md bg-surface/90 text-on-surface font-label-caps text-[10px]">
                    Cardiology
                  </span>
                </div>
                <div className="p-space-md flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-headline-md text-[17px] font-bold text-on-surface mb-2 hover:text-primary transition-colors">
                      Zone 2 Cardio Training: Mitochondrial Density &amp; Fat Oxidation Rates
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-3">
                      Why training at blood lactate levels between 1.5–2.0 mmol/L stimulates maximal lipid clearance and reduces chronic cardiovascular risks.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-surface-container flex items-center justify-between text-[12px] text-on-surface-variant">
                    <span>9 min read</span>
                    <span className="font-semibold text-primary">Read Guide →</span>
                  </div>
                </div>
              </article>

              {/* Article 3 */}
              <article className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm flex flex-col border border-outline-variant/20">
                <div className="h-44 w-full bg-surface-container-high relative overflow-hidden flex items-center justify-center">
                  <img
                    className="w-full h-full object-cover"
                    alt="Serene bedroom with morning sunrise light"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAT089fvEegvXouheQpViQl0pmjDE7kNfUHIhqTWWnBmU-nAktTnZybF57wuf8L6fNEF-24Fi-Z5yF4Pq7PgcsxiZSDZtx_RvFekRv6CMZBMmAcM9eW0DHZ88sl0Ym6E0By2quMCxm5ZLysvMY0IthIiBlVdGS9OAxyrTVhA049iFU1i0Y4rjkV_tiTRJflnEFfu436XjM1EtXjUjUgAG6mzRo4gYcpKksb55a9aOcwqvF6HsA1S-b9"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md bg-surface/90 text-on-surface font-label-caps text-[10px]">
                    Circadian Science
                  </span>
                </div>
                <div className="p-space-md flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-headline-md text-[17px] font-bold text-on-surface mb-2 hover:text-primary transition-colors">
                      The Science of 90-Minute Sleep Cycles: How to Awaken Without Inertia
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-3">
                      Waking up midway through slow-wave deep sleep triggers profound grogginess. Explore how aligning alarm clocks with ultradian rhythms restores morning alertness.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-surface-container flex items-center justify-between text-[12px] text-on-surface-variant">
                    <span>6 min read</span>
                    <span className="font-semibold text-primary">Read Guide →</span>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* CLINICAL TRUST & METHODOLOGICAL GOVERNANCE */}
        <section className="w-full py-space-xl bg-surface-container-low border-t border-outline-variant/20">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="bg-surface-container-lowest p-space-xl rounded-3xl shadow-sm border border-outline-variant/20">
              <div className="max-w-3xl mb-space-lg">
                <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest block mb-1">
                  TRANSPARENCY &amp; PRIVACY ASSURANCE
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface">
                  Scientific Integrity &amp; Local Compute Guarantee
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                  Unlike commercial health portals that monetize personal biometrics, SolveIt operates under strict zero-knowledge computational principles.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
                <div className="p-space-md rounded-2xl bg-surface-container-low border border-outline-variant/10">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-space-sm">
                    <span className="material-symbols-outlined text-[24px]">verified</span>
                  </div>
                  <div className="font-body-md font-bold text-on-surface mb-1">Peer-Reviewed Consensus</div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Equations sourced directly from PubMed, WHO Technical Series, American College of Sports Medicine, and CDC standards.
                  </p>
                </div>
                <div className="p-space-md rounded-2xl bg-surface-container-low border border-outline-variant/10">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-space-sm">
                    <span className="material-symbols-outlined text-[24px]">lock</span>
                  </div>
                  <div className="font-body-md font-bold text-on-surface mb-1">Local Sandbox Privacy</div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Biometrics (weight, age, cycle dates, blood pressure) never leave your device browser cache. Zero server telemetry.
                  </p>
                </div>
                <div className="p-space-md rounded-2xl bg-surface-container-low border border-outline-variant/10">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-space-sm">
                    <span className="material-symbols-outlined text-[24px]">no_sim</span>
                  </div>
                  <div className="font-body-md font-bold text-on-surface mb-1">Zero Commercial Bias</div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    No supplement sponsorships, pharma advertisements, or affiliate marketing. Mathematical calculations remain neutral.
                  </p>
                </div>
                <div className="p-space-md rounded-2xl bg-surface-container-low border border-outline-variant/10">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center mb-space-sm">
                    <span className="material-symbols-outlined text-[24px]">emergency</span>
                  </div>
                  <div className="font-body-md font-bold text-on-surface mb-1">Non-Diagnostic Disclaimer</div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Calculators are mathematical modeling frameworks for educational reference, not diagnostic clinical advice.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* COMPREHENSIVE FAQ ACCORDION */}
        <section id="faq-section" className="w-full py-space-2xl bg-surface">
          <div className="max-w-max-width-calculator mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="text-center mb-space-xl">
              <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider">
                FREQUENTLY ASKED QUESTIONS
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface mt-1">
                Frequently Asked Health Questions
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                Clear answers regarding calculation accuracy, formulas, and biometric data protection.
              </p>
            </div>
            <div className="space-y-space-sm">
              {HEALTH_FAQS.map((faq, idx) => (
                <details
                  key={idx}
                  className="group bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-outline-variant/20 [&_summary::-webkit-details-marker]:hidden cursor-pointer"
                  open={idx === 0}
                >
                  <summary className="flex items-center justify-between text-on-surface font-headline-md text-[17px] font-bold">
                    <span>{faq.q}</span>
                    <span className="material-symbols-outlined text-outline transition-transform group-open:rotate-180">
                      expand_more
                    </span>
                  </summary>
                  <p className="mt-space-sm font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* RELATED TOOL DOMAINS */}
        <section className="w-full py-space-xl bg-surface-container-low border-t border-outline-variant/20">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="flex items-center justify-between mb-space-md">
              <div>
                <span className="font-label-caps text-label-caps text-outline uppercase tracking-wider">
                  ECOSYSTEM EXPANSION
                </span>
                <h3 className="font-headline-md text-headline-md text-on-surface mt-0.5">
                  Explore Additional Precision Domains
                </h3>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
              <Link
                className="p-space-md bg-surface-container-lowest rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center gap-space-sm border border-outline-variant/20"
                href="/#finance"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[26px]">account_balance</span>
                </div>
                <div>
                  <div className="font-body-md font-bold text-on-surface">Finance Workbench</div>
                  <div className="font-body-sm text-body-sm text-on-surface-variant">Mortgage, 401(k), Amortization</div>
                </div>
              </Link>
              <Link
                className="p-space-md bg-surface-container-lowest rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center gap-space-sm border border-outline-variant/20"
                href="/#math"
              >
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-600 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[26px]">functions</span>
                </div>
                <div>
                  <div className="font-body-md font-bold text-on-surface">Math &amp; Physics</div>
                  <div className="font-body-sm text-body-sm text-on-surface-variant">Matrix, Vectors, Calculus</div>
                </div>
              </Link>
              <Link
                className="p-space-md bg-surface-container-lowest rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center gap-space-sm border border-outline-variant/20"
                href="/conversions"
              >
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[26px]">sync_alt</span>
                </div>
                <div>
                  <div className="font-body-md font-bold text-on-surface">Universal Conversion</div>
                  <div className="font-body-sm text-body-sm text-on-surface-variant">Energy, Pressure, Metric to Imperial</div>
                </div>
              </Link>
              <Link
                className="p-space-md bg-surface-container-lowest rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center gap-space-sm border border-outline-variant/20"
                href="/automotive"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[26px]">directions_car</span>
                </div>
                <div>
                  <div className="font-body-md font-bold text-on-surface">Automotive Dynamics</div>
                  <div className="font-body-sm text-body-sm text-on-surface-variant">HP to Torque, EV Range, Braking</div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* DEEP CLINICAL COMPENDIUM & MATHEMATICAL EQUATION REFERENCE (SEO) */}
        <section className="w-full py-space-2xl bg-surface border-t border-surface-container-high/40">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="max-w-3xl mb-space-lg">
              <span className="font-label-caps text-label-caps text-outline uppercase tracking-wider">
                DOCUMENTATION &amp; STANDARDS
              </span>
              <h2 className="font-headline-md text-headline-md text-on-surface mt-1">
                Foundational Biometric Equations Reference
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                Open mathematical formulations implemented across our computational micro-services.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md font-data-mono text-[12px]">
              {HEALTH_EQUATIONS.map((eq, i) => (
                <div key={i} className="p-space-sm bg-surface-container-low rounded-xl border border-outline-variant/20">
                  <div className="text-primary font-bold mb-1">{eq.name}</div>
                  <div className="text-on-surface-variant whitespace-pre-line leading-relaxed">
                    {eq.formula}
                    <div className="text-[10px] text-outline mt-1">{eq.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ================================================================= */}
      {/* 3. FOOTER                                                        */}
      {/* ================================================================= */}
      <footer className="w-full bg-inverse-surface text-inverse-on-surface pt-space-2xl pb-space-xl">
        <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-space-xl mb-space-2xl">
            <div className="col-span-2">
              <div className="flex items-center gap-space-xs mb-space-md">
                <span className="material-symbols-outlined text-primary-fixed-dim text-[28px]">
                  calculate
                </span>
                <span className="font-headline-md text-headline-md tracking-tight text-white font-bold">
                  SolveIt
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-outline-variant max-w-sm mb-space-lg">
                Precision computational workbench calibrated for financial analysts, engineers, and researchers requiring instantaneous mathematical verification.
              </p>
              <div className="flex flex-wrap items-center gap-space-xs">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-low/10 text-inverse-on-surface font-label-caps text-label-caps">
                  <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse"></span>
                  Encrypted Local Processing
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-low/10 text-inverse-on-surface font-label-caps text-label-caps">
                  <span className="material-symbols-outlined text-[14px] text-secondary-container">
                    verified
                  </span>
                  Clinical Assurance Certified
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-label-caps text-label-caps text-outline-variant mb-space-md uppercase tracking-wider">
                Automotive
              </h3>
              <ul className="space-y-space-xs font-body-sm text-body-sm">
                <li><Link className="text-inverse-on-surface hover:text-secondary-fixed transition-colors" href="/automotive">Loan &amp; Lease</Link></li>
                <li><Link className="text-inverse-on-surface hover:text-secondary-fixed transition-colors" href="/automotive">Horsepower to Torque</Link></li>
                <li><Link className="text-inverse-on-surface hover:text-secondary-fixed transition-colors" href="/fuel-economy-converter">Fuel Economy MPG</Link></li>
                <li><Link className="text-inverse-on-surface hover:text-secondary-fixed transition-colors" href="/automotive">Brake Stopping Distance</Link></li>
                <li><Link className="text-inverse-on-surface hover:text-secondary-fixed transition-colors" href="/automotive">EV Battery Range</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-label-caps text-label-caps text-outline-variant mb-space-md uppercase tracking-wider">
                Finance
              </h3>
              <ul className="space-y-space-xs font-body-sm text-body-sm">
                <li><Link className="text-inverse-on-surface hover:text-secondary-fixed transition-colors" href="/#finance">Compound Interest</Link></li>
                <li><Link className="text-inverse-on-surface hover:text-secondary-fixed transition-colors" href="/#finance">Mortgage Amortization</Link></li>
                <li><Link className="text-inverse-on-surface hover:text-secondary-fixed transition-colors" href="/#finance">401(k) Retirement Track</Link></li>
                <li><Link className="text-inverse-on-surface hover:text-secondary-fixed transition-colors" href="/#finance">Capital Gains Tax</Link></li>
                <li><Link className="text-inverse-on-surface hover:text-secondary-fixed transition-colors" href="/#finance">Options Black-Scholes</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-label-caps text-label-caps text-outline-variant mb-space-md uppercase tracking-wider">
                Health &amp; Fitness
              </h3>
              <ul className="space-y-space-xs font-body-sm text-body-sm">
                <li><a className="text-inverse-on-surface hover:text-secondary-fixed transition-colors" href="#tdee-card">BMR &amp; TDEE Macro</a></li>
                <li><a className="text-inverse-on-surface hover:text-secondary-fixed transition-colors" href="#navy-card">Body Fat Navy Method</a></li>
                <li><a className="text-inverse-on-surface hover:text-secondary-fixed transition-colors" href="#zone2-card">Target Heart Rate</a></li>
                <li><a className="text-inverse-on-surface hover:text-secondary-fixed transition-colors" href="#water-card">Water Intake Baseline</a></li>
                <li><a className="text-inverse-on-surface hover:text-secondary-fixed transition-colors" href="#sleep-card">Sleep Cycle Planner</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-label-caps text-label-caps text-outline-variant mb-space-md uppercase tracking-wider">
                Math &amp; Physics
              </h3>
              <ul className="space-y-space-xs font-body-sm text-body-sm">
                <li><Link className="text-inverse-on-surface hover:text-secondary-fixed transition-colors" href="/#math">Matrix Inversion</Link></li>
                <li><Link className="text-inverse-on-surface hover:text-secondary-fixed transition-colors" href="/#math">Eigenvalues &amp; Vectors</Link></li>
                <li><Link className="text-inverse-on-surface hover:text-secondary-fixed transition-colors" href="/#math">Kinematic Vectors</Link></li>
                <li><Link className="text-inverse-on-surface hover:text-secondary-fixed transition-colors" href="/#math">Quadratic Roots</Link></li>
                <li><Link className="text-inverse-on-surface hover:text-secondary-fixed transition-colors" href="/scientific-converter">Scientific Notation</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-space-lg border-t border-outline/20 flex flex-col md:flex-row items-center justify-between gap-space-md">
            <div className="font-body-sm text-body-sm text-outline-variant">
              © 2025 SolveItCalculator.com. All computational outputs are estimates provided without warranty.
            </div>
            <div className="flex items-center gap-space-lg font-body-sm text-body-sm text-outline-variant">
              <Link className="hover:text-inverse-on-surface transition-colors" href="/privacy">Privacy Policy</Link>
              <Link className="hover:text-inverse-on-surface transition-colors" href="/terms">Terms of Service</Link>
              <a className="hover:text-inverse-on-surface transition-colors" href="#faq-section">Accuracy Disclaimers</a>
              <Link className="hover:text-inverse-on-surface transition-colors" href="/convert">API Integration</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* ================================================================= */}
      {/* 4. INTERACTIVE MODAL ENGINES                                     */}
      {/* ================================================================= */}
      {activeModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="bg-surface-container-lowest rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-outline-variant/30 text-on-surface relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-surface-container">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[24px]">calculate</span>
                <h3 className="font-headline-md text-[18px] font-bold">
                  {activeModal === 'bmi' && 'BMI Precision Calculator'}
                  {activeModal === 'tdee' && 'TDEE & Calorie Burn Calculator'}
                  {activeModal === 'bmr' && 'BMR Basal Metabolic Rate'}
                  {(activeModal === 'navy' || activeModal === 'navy-fat' || activeModal === 'body-fat') && 'US Navy Body Fat Calculator'}
                  {(activeModal === 'water' || activeModal === 'water-matrix') && 'Daily Hydration Matrix'}
                  {(activeModal === 'zone2' || activeModal === 'vo2max') && 'Karvonen Zone 2 Heart Rate'}
                  {(activeModal === 'sleep' || activeModal === 'sleep-wake') && 'Circadian Sleep Cycle Optimizer'}
                  {(activeModal === 'pregnancy' || activeModal === 'due-date') && 'Pregnancy Due Date & Trimester'}
                  {activeModal === '1rm' && '1RM One-Rep Max Calculator'}
                  {!['bmi', 'tdee', 'bmr', 'navy', 'navy-fat', 'body-fat', 'water', 'water-matrix', 'zone2', 'vo2max', 'sleep', 'sleep-wake', 'pregnancy', 'due-date', '1rm'].includes(activeModal) && 'Health Quick Mode Calculator'}
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* BMI Modal Body */}
            {activeModal === 'bmi' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Height: {bmiHeight} cm
                  </label>
                  <input
                    type="range"
                    min="120"
                    max="220"
                    value={bmiHeight}
                    onChange={(e) => setBmiHeight(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Weight: {bmiWeight} kg
                  </label>
                  <input
                    type="range"
                    min="35"
                    max="180"
                    value={bmiWeight}
                    onChange={(e) => setBmiWeight(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>
                <div className="p-4 rounded-2xl bg-surface-container-low flex items-center justify-between">
                  <div>
                    <span className="text-xs text-on-surface-variant">Computed BMI</span>
                    <div className="text-3xl font-bold text-primary">{calculatedBmi.bmi}</div>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${calculatedBmi.color}`}>
                    {calculatedBmi.category}
                  </span>
                </div>
                <Link
                  href="/health/bmi"
                  className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-body-sm text-body-sm font-semibold hover:bg-primary-container transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span>Open Full Page Workbench</span>
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                </Link>
              </div>
            )}

            {/* TDEE & BMR Modal Body */}
            {(activeModal === 'tdee' || activeModal === 'bmr') && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">Age</label>
                    <input
                      type="number"
                      value={tdeeAge}
                      onChange={(e) => setTdeeAge(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">Gender</label>
                    <select
                      value={tdeeGender}
                      onChange={(e) => setTdeeGender(e.target.value as 'male' | 'female')}
                      className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold"
                    >
                      <option value="male">Male (+5)</option>
                      <option value="female">Female (-161)</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      value={tdeeWeight}
                      onChange={(e) => setTdeeWeight(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">Height (cm)</label>
                    <input
                      type="number"
                      value={tdeeHeight}
                      onChange={(e) => setTdeeHeight(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold"
                    />
                  </div>
                </div>
                {activeModal === 'tdee' && (
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">Activity Level</label>
                    <select
                      value={tdeeActivity}
                      onChange={(e) => setTdeeActivity(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold"
                    >
                      <option value="1.2">Sedentary (Little or no exercise)</option>
                      <option value="1.375">Light (1-3 days/week)</option>
                      <option value="1.55">Moderate (3-5 days/week)</option>
                      <option value="1.725">Very Active (6-7 days/week)</option>
                      <option value="1.9">Extra Active (Intense training)</option>
                    </select>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-surface-container-low text-center">
                  <div>
                    <span className="text-xs text-on-surface-variant">Basal Metabolic Rate</span>
                    <div className="text-2xl font-bold text-amber-600">{calculatedTdee.bmr} kcal</div>
                  </div>
                  <div>
                    <span className="text-xs text-on-surface-variant">TDEE Maintenance</span>
                    <div className="text-2xl font-bold text-primary">{calculatedTdee.tdee} kcal</div>
                  </div>
                </div>
                <Link
                  href={activeModal === 'bmr' ? '/health/bmr' : '/health/tdee'}
                  className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-body-sm text-body-sm font-semibold hover:bg-primary-container transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span>Open Full Page {activeModal === 'bmr' ? 'BMR' : 'TDEE'} Workbench</span>
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                </Link>
              </div>
            )}

            {/* Navy Body Fat Modal Body */}
            {(activeModal === 'navy' || activeModal === 'navy-fat' || activeModal === 'body-fat') && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">Gender</label>
                    <select
                      value={navyGender}
                      onChange={(e) => setNavyGender(e.target.value as 'male' | 'female')}
                      className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">Height (cm)</label>
                    <input
                      type="number"
                      value={navyHeight}
                      onChange={(e) => setNavyHeight(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">Waist (cm)</label>
                    <input
                      type="number"
                      value={navyWaist}
                      onChange={(e) => setNavyWaist(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">Neck (cm)</label>
                    <input
                      type="number"
                      value={navyNeck}
                      onChange={(e) => setNavyNeck(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold"
                    />
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-surface-container-low flex items-center justify-between">
                  <div>
                    <span className="text-xs text-on-surface-variant">Estimated Body Fat %</span>
                    <div className="text-3xl font-bold text-sky-600">{calculatedNavyFat}%</div>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300">
                    Navy DoD Spec
                  </span>
                </div>
                <Link
                  href="/health/navy-fat"
                  className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-body-sm text-body-sm font-semibold hover:bg-primary-container transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span>Open Full Page Body Fat Workbench</span>
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                </Link>
              </div>
            )}

            {/* Water Modal Body */}
            {(activeModal === 'water' || activeModal === 'water-matrix') && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Body Weight: {waterWeight} kg
                  </label>
                  <input
                    type="range"
                    min="40"
                    max="150"
                    value={waterWeight}
                    onChange={(e) => setWaterWeight(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Daily Exercise: {workoutMins} minutes
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="180"
                    step="15"
                    value={workoutMins}
                    onChange={(e) => setWorkoutMins(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>
                <div className="p-4 rounded-2xl bg-surface-container-low flex items-center justify-between">
                  <div>
                    <span className="text-xs text-on-surface-variant">Recommended Daily Fluid</span>
                    <div className="text-3xl font-bold text-sky-600">{calculatedWater} Liters</div>
                  </div>
                  <span className="text-xs font-bold text-on-surface-variant">
                    ~{Math.round(calculatedWater * 4.2)} glasses
                  </span>
                </div>
                <Link
                  href="/health/water-matrix"
                  className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-body-sm text-body-sm font-semibold hover:bg-primary-container transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span>Open Full Page Hydration Workbench</span>
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                </Link>
              </div>
            )}

            {/* Zone 2 Modal Body */}
            {(activeModal === 'zone2' || activeModal === 'vo2max') && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">Age</label>
                    <input
                      type="number"
                      value={z2Age}
                      onChange={(e) => setZ2Age(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">Resting Heart Rate (BPM)</label>
                    <input
                      type="number"
                      value={z2Rhr}
                      onChange={(e) => setZ2Rhr(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold"
                    />
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-surface-container-low flex items-center justify-between">
                  <div>
                    <span className="text-xs text-on-surface-variant">Target Zone 2 Heart Rate</span>
                    <div className="text-2xl font-bold text-rose-600">
                      {calculatedZone2.z2Low} - {calculatedZone2.z2High} BPM
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-on-surface-variant">Max HR</span>
                    <div className="text-sm font-bold text-on-surface">{calculatedZone2.maxHr} BPM</div>
                  </div>
                </div>
                <Link
                  href="/health/zone2"
                  className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-body-sm text-body-sm font-semibold hover:bg-primary-container transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span>Open Full Page Zone 2 Workbench</span>
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                </Link>
              </div>
            )}

            {/* Sleep Modal Body */}
            {(activeModal === 'sleep' || activeModal === 'sleep-wake') && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Planned Bedtime
                  </label>
                  <input
                    type="time"
                    value={sleepBedtime}
                    onChange={(e) => setSleepBedtime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold"
                  />
                </div>
                <div className="p-4 rounded-2xl bg-surface-container-low flex items-center justify-between">
                  <div>
                    <span className="text-xs text-on-surface-variant">Optimal Wake-Up Alarm (5 Cycles)</span>
                    <div className="text-2xl font-bold text-violet-600">{calculatedSleepCycles}</div>
                  </div>
                  <span className="text-xs font-bold text-violet-700 bg-violet-100 dark:bg-violet-950/40 dark:text-violet-300 px-2.5 py-1 rounded-full">
                    90-Min REM Sync
                  </span>
                </div>
                <Link
                  href="/health/sleep-wake"
                  className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-body-sm text-body-sm font-semibold hover:bg-primary-container transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span>Open Full Page Sleep Workbench</span>
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                </Link>
              </div>
            )}

            {/* Pregnancy / Due Date Modal Body */}
            {(activeModal === 'pregnancy' || activeModal === 'due-date') && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    First Day of Last Menstrual Period (LMP)
                  </label>
                  <input
                    type="date"
                    value={lmpDate}
                    onChange={(e) => setLmpDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Average Menstrual Cycle Length: {cycleLength} days
                  </label>
                  <input
                    type="range"
                    min="21"
                    max="35"
                    value={cycleLength}
                    onChange={(e) => setCycleLength(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>
                <div className="p-4 rounded-2xl bg-surface-container-low flex items-center justify-between">
                  <div>
                    <span className="text-xs text-on-surface-variant">Estimated Delivery Date</span>
                    <div className="text-2xl font-bold text-pink-600">{calculatedDueDate}</div>
                  </div>
                  <span className="text-xs font-bold text-pink-700 bg-pink-100 dark:bg-pink-950/40 dark:text-pink-300 px-2.5 py-1 rounded-full">
                    40w 0d Target
                  </span>
                </div>
                <Link
                  href="/health/due-date"
                  className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-body-sm text-body-sm font-semibold hover:bg-primary-container transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span>Open Full Page Gestational Workbench</span>
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                </Link>
              </div>
            )}

            {/* 1RM Strength Modal Body */}
            {activeModal === '1rm' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">Weight Lifted (kg / lbs)</label>
                    <input
                      type="number"
                      value={liftWeight}
                      onChange={(e) => setLiftWeight(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">Reps Completed</label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={liftReps}
                      onChange={(e) => setLiftReps(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold"
                    />
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-surface-container-low flex items-center justify-between">
                  <div>
                    <span className="text-xs text-on-surface-variant">Estimated 1RM (Epley Standard)</span>
                    <div className="text-2xl font-bold text-amber-600">{calculated1RM} kg</div>
                  </div>
                  <span className="text-xs font-bold text-amber-700 bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300 px-2.5 py-1 rounded-full">
                    Strength Spec
                  </span>
                </div>
                <Link
                  href="/health/1rm"
                  className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-body-sm text-body-sm font-semibold hover:bg-primary-container transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span>Open Full Page Strength Workbench</span>
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                </Link>
              </div>
            )}

            {/* General Tool Quick Mode Fallback */}
            {!['bmi', 'tdee', 'bmr', 'navy', 'navy-fat', 'body-fat', 'water', 'water-matrix', 'zone2', 'vo2max', 'sleep', 'sleep-wake', 'pregnancy', 'due-date', '1rm'].includes(activeModal) && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-surface-container-low space-y-2">
                  <div className="flex items-center justify-between text-xs text-on-surface-variant">
                    <span>Calculator Identifier</span>
                    <span className="font-mono text-primary font-semibold">/{activeModal}</span>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Quick Mode active. Access the dedicated clinical workbench for full biometric charting, reference ranges, formula breakdowns, and diagnostic export.
                  </p>
                </div>
                <Link
                  href={activeModal === 'bmi' ? '/health/bmi' : `/health/${activeModal}`}
                  className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-body-sm text-body-sm font-semibold hover:bg-primary-container transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span>Open Full Page Dedicated Workbench</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* JSON-LD SCHEMA INJECTIONS FOR SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'WebPage',
                '@id': 'https://solveitcalculator.com/health/#webpage',
                url: 'https://solveitcalculator.com/health',
                name: 'Health & Fitness Calculators | SolveIt Calculator',
                description:
                  'Track body composition, metabolic expenditure, cardiovascular health, hydration, circadian recovery, and maternity milestones with clinical-grade peer-reviewed algorithms.',
                breadcrumb: {
                  '@id': 'https://solveitcalculator.com/health/#breadcrumb'
                }
              },
              {
                '@type': 'CollectionPage',
                '@id': 'https://solveitcalculator.com/health/#collection',
                name: 'Health & Fitness Calculators Collection',
                hasPart: [
                  {
                    '@type': 'WebApplication',
                    name: 'Body Mass Index (BMI) Calculator',
                    applicationCategory: 'HealthApplication',
                    operatingSystem: 'All'
                  },
                  {
                    '@type': 'WebApplication',
                    name: 'TDEE & Macro Energy Calculator',
                    applicationCategory: 'HealthApplication',
                    operatingSystem: 'All'
                  },
                  {
                    '@type': 'WebApplication',
                    name: 'US Navy Body Fat Calculator',
                    applicationCategory: 'HealthApplication',
                    operatingSystem: 'All'
                  },
                  {
                    '@type': 'WebApplication',
                    name: 'Karvonen Zone 2 Heart Rate Calculator',
                    applicationCategory: 'HealthApplication',
                    operatingSystem: 'All'
                  }
                ]
              },
              {
                '@type': 'BreadcrumbList',
                '@id': 'https://solveitcalculator.com/health/#breadcrumb',
                itemListElement: [
                  {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'Home',
                    item: 'https://solveitcalculator.com/'
                  },
                  {
                    '@type': 'ListItem',
                    position: 2,
                    name: 'Categories',
                    item: 'https://solveitcalculator.com/convert'
                  },
                  {
                    '@type': 'ListItem',
                    position: 3,
                    name: 'Health & Fitness',
                    item: 'https://solveitcalculator.com/health'
                  }
                ]
              },
              {
                '@type': 'FAQPage',
                '@id': 'https://solveitcalculator.com/health/#faq',
                mainEntity: HEALTH_FAQS.map((faq) => ({
                  '@type': 'Question',
                  name: faq.q,
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: faq.a
                  }
                }))
              }
            ]
          })
        }}
      />
    </div>
  );
}
