'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import QuickModeIBW from './components/QuickModeIBW';
import QuickModeLeanMass from './components/QuickModeLeanMass';
import QuickModeCaloriePlanner from './components/QuickModeCaloriePlanner';

import QuickModeABSI from './components/QuickModeABSI';
import QuickModeBSA from './components/QuickModeBSA';
import QuickModeWHtR from './components/QuickModeWHtR';
import QuickModeFFMI from './components/QuickModeFFMI';
import QuickModeWHR from './components/QuickModeWHR';
import QuickModeProteinRDA from './components/QuickModeProteinRDA';
import QuickModeCarbCycling from './components/QuickModeCarbCycling';
import QuickModeKeto from './components/QuickModeKeto';
import QuickModeVelocity from './components/QuickModeVelocity';

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

  // Macros
  const [macroCalories, setMacroCalories] = useState<number>(2500);
  // Lean Mass
  const [lmWeight, setLmWeight] = useState<number>(75);
  const [lmFat, setLmFat] = useState<number>(15);
  // METs
  const [metsWeight, setMetsWeight] = useState<number>(75);
  const [metsValue, setMetsValue] = useState<number>(8);
  const [metsDuration, setMetsDuration] = useState<number>(30);
  // Pace
  const [paceDist, setPaceDist] = useState<number>(5);
  const [paceTime, setPaceTime] = useState<number>(25);
  // FTP
  const [ftpPower, setFtpPower] = useState<number>(200);
  // Rucking
  const [ruckWeight, setRuckWeight] = useState<number>(75);
  const [ruckPack, setRuckPack] = useState<number>(15);
  // THR
  const [thrAge, setThrAge] = useState<number>(30);
  const [thrRhr, setThrRhr] = useState<number>(60);
  const [thrIntensity, setThrIntensity] = useState<number>(70);
  // BP
  const [bpSys, setBpSys] = useState<number>(120);
  const [bpDia, setBpDia] = useState<number>(80);
  // HRR
  const [hrrPeak, setHrrPeak] = useState<number>(170);
  const [hrr1Min, setHrr1Min] = useState<number>(140);
  // Max HR
  const [maxHrAge, setMaxHrAge] = useState<number>(30);
  // Sleep Debt
  const [sleepReq, setSleepReq] = useState<number>(8);
  const [sleepAct, setSleepAct] = useState<number>(6);
  // ESS
  const [essScore, setEssScore] = useState<number>(8);
  // Ovulation
  const [ovuLmp, setOvuLmp] = useState<string>('2026-05-15');
  const [ovuCycle, setOvuCycle] = useState<number>(28);
  // hCG
  const [hcg1, setHcg1] = useState<number>(150);
  const [hcg2, setHcg2] = useState<number>(320);
  const [hcgHours, setHcgHours] = useState<number>(48);
  const [ibwHeight, setIbwHeight] = useState<number>(178);
  const [ibwGender, setIbwGender] = useState<'male' | 'female'>('male');
  const [ffmiWeight, setFfmiWeight] = useState<number>(75);
  const [ffmiFat, setFfmiFat] = useState<number>(15);
  const [ffmiHeight, setFfmiHeight] = useState<number>(178);
  const [whrWaist, setWhrWaist] = useState<number>(82);
  const [whrHip, setWhrHip] = useState<number>(95);
  const [whrGender, setWhrGender] = useState<'male' | 'female'>('male');
  const [whtrWaist, setWhtrWaist] = useState<number>(82);
  const [whtrHeight, setWhtrHeight] = useState<number>(178);
  const [bsaHeight, setBsaHeight] = useState<number>(178);
  const [bsaWeight, setBsaWeight] = useState<number>(75);
  const [absiWaist, setAbsiWaist] = useState<number>(82);
  const [absiWeight, setAbsiWeight] = useState<number>(75);
  const [absiHeight, setAbsiHeight] = useState<number>(178);
  const [deficitTdee, setDeficitTdee] = useState<number>(2500);
  const [deficitGoal, setDeficitGoal] = useState<'loss' | 'gain'>('loss');
  const [deficitRate, setDeficitRate] = useState<number>(0.5);
  const [proteinWeight, setProteinWeight] = useState<number>(75);
  const [proteinGoal, setProteinGoal] = useState<'maintenance' | 'muscle'>('muscle');
  const [carbTdee, setCarbTdee] = useState<number>(2500);
  const [carbType, setCarbType] = useState<'high' | 'low'>('high');
  const [ketoTdee, setKetoTdee] = useState<number>(2000);
  const [ketoNetCarb, setKetoNetCarb] = useState<number>(25);
  const [velocityWeight, setVelocityWeight] = useState<number>(80);
  const [velocityGoal, setVelocityGoal] = useState<number>(75);
  const [velocityWeeks, setVelocityWeeks] = useState<number>(12);


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

  const calculatedMacros = useMemo(() => {
    const p = Math.round((macroCalories * 0.3) / 4);
    const c = Math.round((macroCalories * 0.35) / 4);
    const f = Math.round((macroCalories * 0.35) / 9);
    return { p, c, f };
  }, [macroCalories]);
  const calculatedLeanMass = useMemo(() => {
    return parseFloat((lmWeight * (1 - lmFat / 100)).toFixed(1));
  }, [lmWeight, lmFat]);
  const calculatedMets = useMemo(() => {
    return Math.round(metsWeight * metsValue * (metsDuration / 60));
  }, [metsWeight, metsValue, metsDuration]);
  const calculatedPace = useMemo(() => {
    const minsPerKm = paceTime / paceDist;
    const m = Math.floor(minsPerKm);
    const s = Math.round((minsPerKm - m) * 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }, [paceDist, paceTime]);
  const calculatedFtp = useMemo(() => {
    return Math.round(ftpPower * 0.95);
  }, [ftpPower]);
  const calculatedRucking = useMemo(() => {
    return Math.round((ruckWeight + ruckPack) * 6 * (30 / 60));
  }, [ruckWeight, ruckPack]);
  const calculatedThr = useMemo(() => {
    const max = 208 - 0.7 * thrAge;
    return Math.round(((max - thrRhr) * (thrIntensity / 100)) + thrRhr);
  }, [thrAge, thrRhr, thrIntensity]);
  const calculatedMap = useMemo(() => {
    return Math.round(bpDia + (1 / 3) * (bpSys - bpDia));
  }, [bpSys, bpDia]);
  const calculatedPulsePressure = useMemo(() => {
    return bpSys - bpDia;
  }, [bpSys, bpDia]);
  const calculatedHrr = useMemo(() => {
    return hrrPeak - hrr1Min;
  }, [hrrPeak, hrr1Min]);
  const calculatedMaxHr = useMemo(() => {
    return Math.round(208 - 0.7 * maxHrAge);
  }, [maxHrAge]);
  const calculatedSleepDebt = useMemo(() => {
    return parseFloat((sleepReq - sleepAct).toFixed(1));
  }, [sleepReq, sleepAct]);
  const calculatedOvu = useMemo(() => {
    const d = new Date(ovuLmp || '2026-05-15');
    d.setDate(d.getDate() + (ovuCycle - 14));
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }, [ovuLmp, ovuCycle]);
  const calculatedHcg = useMemo(() => {
    if (hcg1 <= 0 || hcg2 <= 0 || hcg1 >= hcg2) return 0;
    return parseFloat(((hcgHours * Math.log(2)) / Math.log(hcg2 / hcg1)).toFixed(1));
  }, [hcg1, hcg2, hcgHours]);

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
              <span className="text-on-surface font-medium">Health &amp; Fitness Hub</span>
            </nav>
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
              <h2 className="font-headline-md text-headline-md text-on-surface tracking-tight mb-space-sm mt-2">
                Health & Fitness Calculators for Better Wellness Decisions
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-space-lg leading-relaxed">
                Track your health goals with free calculators for BMI, calories, body fat, weight loss, nutrition, fitness, pregnancy, and overall wellness.
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
                  Over 100K+ biometrics computed monthly
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
                    <Link href="/health-fitness-calculators/bmi" className="hover:text-primary transition-colors">
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
                  <div className="flex items-center justify-end text-body-sm font-body-sm text-on-surface-variant mb-3">
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
                      href="/health-fitness-calculators/bmi"
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
                    <Link href="/health-fitness-calculators/tdee" className="hover:text-primary transition-colors">
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
                  <div className="flex items-center justify-end text-body-sm font-body-sm text-on-surface-variant mb-3">
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
                      href="/health-fitness-calculators/tdee"
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
                    <Link href="/health-fitness-calculators/navy-fat" className="hover:text-primary transition-colors">
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
                  <div className="flex items-center justify-end text-body-sm font-body-sm text-on-surface-variant mb-3">
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
                      href="/health-fitness-calculators/navy-fat"
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
                    <Link href="/health-fitness-calculators/bmr" className="hover:text-primary transition-colors">
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
                  <div className="flex items-center justify-end text-body-sm font-body-sm text-on-surface-variant mb-3">
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
                      href="/health-fitness-calculators/bmr"
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
                    <Link href="/health-fitness-calculators/water-matrix" className="hover:text-primary transition-colors">
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
                  <div className="flex items-center justify-end text-body-sm font-body-sm text-on-surface-variant mb-3">
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
                      href="/health-fitness-calculators/water-matrix"
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
                    <Link href="/health-fitness-calculators/zone2" className="hover:text-primary transition-colors">
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
                  <div className="flex items-center justify-end text-body-sm font-body-sm text-on-surface-variant mb-3">
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
                      href="/health-fitness-calculators/zone2"
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
                    <Link href="/health-fitness-calculators/sleep-wake" className="hover:text-primary transition-colors">
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
                  <div className="flex items-center justify-end text-body-sm font-body-sm text-on-surface-variant mb-3">
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
                      href="/health-fitness-calculators/sleep-wake"
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
                    <Link href="/health-fitness-calculators/due-date" className="hover:text-primary transition-colors">
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
                  <div className="flex items-center justify-end text-body-sm font-body-sm text-on-surface-variant mb-3">
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
                      href="/health-fitness-calculators/due-date"
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
                  href="/health-fitness-calculators/tdee"
                  className="bg-surface-container-low hover:bg-surface-container p-space-sm rounded-xl flex items-center justify-between transition-colors border border-outline-variant/20 group"
                >
                  <div>
                    <div className="text-[11px] font-bold text-outline uppercase tracking-wider">#1 RANK</div>
                    <div className="font-body-sm font-bold text-on-surface group-hover:text-primary transition-colors mt-0.5">TDEE Calorie Surplus</div>
                  </div>
                  <span className="text-emerald-600 font-data-mono text-body-sm font-bold">+18% ↗</span>
                </Link>
                <Link
                  href="/health-fitness-calculators/navy-fat"
                  className="bg-surface-container-low hover:bg-surface-container p-space-sm rounded-xl flex items-center justify-between transition-colors border border-outline-variant/20 group"
                >
                  <div>
                    <div className="text-[11px] font-bold text-outline uppercase tracking-wider">#2 RANK</div>
                    <div className="font-body-sm font-bold text-on-surface group-hover:text-primary transition-colors mt-0.5">Navy Body Fat %</div>
                  </div>
                  <span className="text-emerald-600 font-data-mono text-body-sm font-bold">+24% ↗</span>
                </Link>
                <Link
                  href="/health-fitness-calculators/zone2"
                  className="bg-surface-container-low hover:bg-surface-container p-space-sm rounded-xl flex items-center justify-between transition-colors border border-outline-variant/20 group"
                >
                  <div>
                    <div className="text-[11px] font-bold text-outline uppercase tracking-wider">#3 RANK</div>
                    <div className="font-body-sm font-bold text-on-surface group-hover:text-primary transition-colors mt-0.5">Zone 2 Aerobic Heart</div>
                  </div>
                  <span className="text-emerald-600 font-data-mono text-body-sm font-bold">+42% ↗</span>
                </Link>
                <Link
                  href="/health-fitness-calculators/sleep-wake"
                  className="bg-surface-container-low hover:bg-surface-container p-space-sm rounded-xl flex items-center justify-between transition-colors border border-outline-variant/20 group"
                >
                  <div>
                    <div className="text-[11px] font-bold text-outline uppercase tracking-wider">#4 RANK</div>
                    <div className="font-body-sm font-bold text-on-surface group-hover:text-primary transition-colors mt-0.5">Sleep Debt REM Matrix</div>
                  </div>
                  <span className="text-emerald-600 font-data-mono text-body-sm font-bold">+12% ↗</span>
                </Link>
                <Link
                  href="/health-fitness-calculators/1rm"
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
                    const toolHref = tool.id === 'bmi' ? '/health-fitness-calculators/bmi' : `/health-fitness-calculators/${tool.id}`;
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
              <Link className="text-body-sm font-body-sm font-semibold text-primary hover:underline flex items-center gap-1" href="/article">
                Explore all clinical whitepapers <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
              {/* Article 1 */}
              <Link 
                href="/article/fallacy-of-bmi-vs-ffmi"
                className="group bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm flex flex-col border border-outline-variant/20 hover:border-primary/40 transition-all block"
              >
                <div className="h-44 w-full bg-slate-900 relative overflow-hidden flex items-center justify-center">
                  <svg viewBox="0 0 400 200" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" role="img" aria-label="BMI vs FFMI Infographic Thumbnail">
                    <rect width="400" height="200" fill="#0f172a" />
                    <circle cx="120" cy="80" r="45" fill="#0284c7" fillOpacity="0.2" />
                    <circle cx="280" cy="80" r="45" fill="#f59e0b" fillOpacity="0.2" />
                    {/* Athlete bar */}
                    <rect x="70" y="70" width="100" height="20" rx="4" fill="#0284c7" />
                    <rect x="170" y="70" width="15" height="20" rx="0 4 4 0" fill="#f59e0b" />
                    <text x="120" y="110" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">ATHLETE (12% Fat)</text>
                    <text x="120" y="130" fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="monospace">FFMI: 24.4 (Elite)</text>
                    {/* Sedentary bar */}
                    <rect x="230" y="70" width="70" height="20" rx="4" fill="#0284c7" />
                    <rect x="300" y="70" width="45" height="20" rx="0 4 4 0" fill="#f59e0b" />
                    <text x="280" y="110" fill="#fbbf24" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">SEDENTARY (32% Fat)</text>
                    <text x="280" y="130" fill="#94a3b8" fontSize="10" textAnchor="middle" fontFamily="monospace">FFMI: 18.9 (Avg)</text>
                    {/* Common BMI badge */}
                    <rect x="130" y="155" width="140" height="26" rx="13" fill="#1e293b" stroke="#475569" />
                    <text x="200" y="172" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">Both BMI 27.8 kg/m²</text>
                  </svg>
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md bg-surface/90 text-on-surface font-label-caps text-[10px] shadow-sm">
                    Body Composition
                  </span>
                </div>
                <div className="p-space-md flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-headline-md text-[17px] font-bold text-on-surface mb-2 group-hover:text-primary transition-colors">
                      The Fallacy of BMI vs. FFMI: Why Muscle Mass Misleads Standard Tables
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-3">
                      Standard BMI treats muscular mass and visceral adipose identically. Learn how the Fat-Free Mass Index provides clinical resolution for athletes and weightlifters.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-surface-container flex items-center justify-between text-[12px] text-on-surface-variant">
                    <span>9 min read</span>
                    <span className="font-semibold text-primary group-hover:translate-x-0.5 transition-transform">Read Guide →</span>
                  </div>
                </div>
              </Link>

              {/* Article 2 */}
              <Link 
                href="/article/zone-2-cardio-training"
                className="group bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm flex flex-col border border-outline-variant/20 hover:border-secondary/40 transition-all block"
              >
                <div className="h-44 w-full bg-slate-900 relative overflow-hidden flex items-center justify-center">
                  <svg viewBox="0 0 400 200" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" role="img" aria-label="Zone 2 Cardio Kinetics Thumbnail">
                    <rect width="400" height="200" fill="#0f172a" />
                    {/* Zone 2 Highlight Box */}
                    <rect x="130" y="25" width="90" height="150" fill="#0d9488" fillOpacity="0.2" rx="4" />
                    <line x1="40" y1="165" x2="360" y2="165" stroke="#334155" strokeWidth="1.5" />
                    {/* Fat Oxidation Curve */}
                    <path d="M 50 120 Q 120 70 175 55 T 260 130 Q 320 160 360 162" fill="none" stroke="#2dd4bf" strokeWidth="3" />
                    {/* Carb Oxidation Curve */}
                    <path d="M 50 160 Q 150 155 220 125 T 320 50 L 360 45" fill="none" stroke="#fb923c" strokeWidth="2" />
                    {/* Lactate Point */}
                    <circle cx="175" cy="55" r="5" fill="#14b8a6" stroke="#ffffff" strokeWidth="1.5" />
                    <text x="175" y="42" fill="#2dd4bf" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">FatMax Peak</text>
                    <text x="175" y="150" fill="#2dd4bf" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">ZONE 2</text>
                    <text x="175" y="162" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="monospace">1.5–2.0 mmol/L</text>
                    <text x="80" y="180" fill="#64748b" fontSize="9" textAnchor="middle" fontFamily="sans-serif">Zone 1</text>
                    <text x="260" y="180" fill="#64748b" fontSize="9" textAnchor="middle" fontFamily="sans-serif">Zone 3</text>
                    <text x="330" y="180" fill="#64748b" fontSize="9" textAnchor="middle" fontFamily="sans-serif">Zone 4/5</text>
                  </svg>
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md bg-surface/90 text-on-surface font-label-caps text-[10px] shadow-sm">
                    Cardiology
                  </span>
                </div>
                <div className="p-space-md flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-headline-md text-[17px] font-bold text-on-surface mb-2 group-hover:text-secondary transition-colors">
                      Zone 2 Cardio Training: Mitochondrial Density &amp; Fat Oxidation Rates
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-3">
                      Why training at blood lactate levels between 1.5–2.0 mmol/L stimulates maximal lipid clearance and reduces chronic cardiovascular risks.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-surface-container flex items-center justify-between text-[12px] text-on-surface-variant">
                    <span>10 min read</span>
                    <span className="font-semibold text-secondary group-hover:translate-x-0.5 transition-transform">Read Guide →</span>
                  </div>
                </div>
              </Link>

              {/* Article 3 */}
              <Link 
                href="/article/science-of-90-minute-sleep-cycles"
                className="group bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm flex flex-col border border-outline-variant/20 hover:border-tertiary/40 transition-all block"
              >
                <div className="h-44 w-full bg-slate-900 relative overflow-hidden flex items-center justify-center">
                  <svg viewBox="0 0 400 200" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" role="img" aria-label="90-Minute Sleep Cycle Hypnogram Thumbnail">
                    <rect width="400" height="200" fill="#090d16" />
                    {/* Stage horizontal guides */}
                    <line x1="30" y1="45" x2="370" y2="45" stroke="#1e293b" strokeDasharray="2,2" />
                    <line x1="30" y1="85" x2="370" y2="85" stroke="#1e293b" strokeDasharray="2,2" />
                    <line x1="30" y1="125" x2="370" y2="125" stroke="#1e293b" strokeDasharray="2,2" />
                    <line x1="30" y1="165" x2="370" y2="165" stroke="#334155" />
                    {/* Hypnogram Wave */}
                    <path 
                      d="M 40 50 L 55 110 L 70 145 L 90 145 L 105 110 L 115 80 L 130 145 L 155 145 L 175 105 L 185 80 L 205 130 L 230 100 L 245 75 L 265 110 L 285 100 L 300 75 L 315 50 L 335 125 L 350 145" 
                      fill="none" 
                      stroke="#60a5fa" 
                      strokeWidth="2.5" 
                    />
                    {/* 7.5h Sweet spot marker */}
                    <circle cx="315" cy="50" r="5" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
                    <text x="315" y="38" fill="#34d399" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">7.5h (5 Cycles)</text>
                    {/* 8.0h Inertia Trap marker */}
                    <circle cx="350" cy="145" r="5" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
                    <text x="350" y="178" fill="#f87171" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">8h Deep Sleep</text>
                    {/* Badges */}
                    <text x="45" y="180" fill="#64748b" fontSize="9" fontFamily="monospace">Cycle 1</text>
                    <text x="115" y="180" fill="#64748b" fontSize="9" fontFamily="monospace">Cycle 2</text>
                    <text x="185" y="180" fill="#64748b" fontSize="9" fontFamily="monospace">Cycle 3</text>
                    <text x="250" y="180" fill="#64748b" fontSize="9" fontFamily="monospace">Cycle 4</text>
                  </svg>
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md bg-surface/90 text-on-surface font-label-caps text-[10px] shadow-sm">
                    Circadian Science
                  </span>
                </div>
                <div className="p-space-md flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-headline-md text-[17px] font-bold text-on-surface mb-2 group-hover:text-tertiary transition-colors">
                      The Science of 90-Minute Sleep Cycles: How to Awaken Without Inertia
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-3">
                      Waking up midway through slow-wave deep sleep triggers profound grogginess. Explore how aligning alarm clocks with ultradian rhythms restores morning alertness.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-surface-container flex items-center justify-between text-[12px] text-on-surface-variant">
                    <span>8 min read</span>
                    <span className="font-semibold text-tertiary group-hover:translate-x-0.5 transition-transform">Read Guide →</span>
                  </div>
                </div>
              </Link>
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
                href="/automotive-calculators-estimators"
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
      {/* 4. INTERACTIVE MODAL ENGINES                                     */}
      {/* ================================================================= */}
      {(activeModal && !['ibw', 'ffmi', 'whr', 'whtr', 'bsa', 'absi', 'deficit', 'protein-rda', 'carb-cycling', 'keto', 'velocity', 'lbm', 'lean-mass'].includes(activeModal)) && (
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
                  {(activeModal === 'macro-split' || activeModal === 'macros') && 'Macro Splitter'}
                  {(activeModal === 'lbm' || activeModal === 'lean-mass') && 'Lean Body Mass'}
                  {activeModal === 'mets' && 'METs Calories Burned'}
                  {activeModal === 'running-pace' && 'Running Pace'}
                  {activeModal === 'ftp' && 'Cycling FTP'}
                  {activeModal === 'rucking' && 'Rucking Calorie Burn'}
                  {activeModal === 'thr' && 'Target Heart Rate'}
                  {activeModal === 'map' && 'Mean Arterial Pressure (MAP)'}
                  {activeModal === 'hrr' && 'Heart Rate Recovery (HRR)'}
                  {activeModal === 'pulse-pressure' && 'Pulse Pressure'}
                  {activeModal === 'max-hr' && 'Maximum Heart Rate'}
                  {activeModal === 'sleep-debt' && 'Sleep Debt Accumulator'}
                  {activeModal === 'ess' && 'Daytime Sleepiness Scale (ESS)'}
                  {activeModal === 'ovulation' && 'Ovulation Window'}
                  {activeModal === 'hcg' && 'Beta hCG Doubling Time'}
                  {activeModal === 'ibw' && 'Ideal Body Weight (IBW)'}
                  {activeModal === 'ffmi' && 'Fat-Free Mass Index (FFMI)'}
                  {activeModal === 'whr' && 'Waist-to-Hip Ratio'}
                  {activeModal === 'whtr' && 'Waist-to-Height Ratio'}
                  {activeModal === 'bsa' && 'Body Surface Area (BSA)'}
                  {activeModal === 'absi' && 'A Body Shape Index (ABSI)'}
                  {activeModal === 'deficit' && 'Calorie Deficit & Surplus Planner'}
                  {activeModal === 'protein-rda' && 'Protein RDA & Hypertrophy'}
                  {activeModal === 'carb-cycling' && 'Carbohydrate Cycling'}
                  {activeModal === 'keto' && 'Keto Net Carb & Fat Matrix'}
                  {activeModal === 'velocity' && 'Weight Loss Velocity Simulator'}
                  {!['bmi', 'tdee', 'bmr', 'navy', 'navy-fat', 'body-fat', 'water', 'water-matrix', 'zone2', 'vo2max', 'sleep', 'sleep-wake', 'pregnancy', 'due-date', '1rm', 'macros', 'macro-split', 'mets', 'running-pace', 'ftp', 'rucking', 'thr', 'map', 'hrr', 'pulse-pressure', 'max-hr', 'sleep-debt', 'ess', 'ovulation', 'hcg'].includes(activeModal) && 'Health Quick Mode Calculator'}
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
                  href="/health-fitness-calculators/bmi"
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
                  href={activeModal === 'bmr' ? '/health-fitness-calculators/bmr' : '/health-fitness-calculators/tdee'}
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
                  href="/health-fitness-calculators/navy-fat"
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
                  href="/health-fitness-calculators/water-matrix"
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
                  href="/health-fitness-calculators/zone2"
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
                  href="/health-fitness-calculators/sleep-wake"
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
                  href="/health-fitness-calculators/due-date"
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
                  href="/health-fitness-calculators/1rm"
                  className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-body-sm text-body-sm font-semibold hover:bg-primary-container transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span>Open Full Page Strength Workbench</span>
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                </Link>
              </div>
            )}

            {/* Macros */}
            {(activeModal === 'macro-split' || activeModal === 'macros') && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">Daily Target Calories</label>
                  <input type="number" value={macroCalories} onChange={(e) => setMacroCalories(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold" />
                </div>
                <div className="p-4 rounded-2xl bg-surface-container-low flex items-center justify-between">
                  <div className="flex gap-4">
                    <div>
                      <span className="text-xs text-on-surface-variant">Protein</span>
                      <div className="text-xl font-bold text-primary">{calculatedMacros.p}g</div>
                    </div>
                    <div>
                      <span className="text-xs text-on-surface-variant">Carbs</span>
                      <div className="text-xl font-bold text-primary">{calculatedMacros.c}g</div>
                    </div>
                    <div>
                      <span className="text-xs text-on-surface-variant">Fat</span>
                      <div className="text-xl font-bold text-primary">{calculatedMacros.f}g</div>
                    </div>
                  </div>
                </div>
                <Link href="/health-fitness-calculators/macros" className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-body-sm font-semibold hover:bg-primary-container transition-all flex items-center justify-center gap-1.5 shadow-sm">
                  <span>Open Full Page Workbench</span>
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                </Link>
              </div>
            )}

            {/* Lean Mass */}
            {(activeModal === 'lbm' || activeModal === 'lean-mass') && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">Weight</label>
                    <input type="number" value={lmWeight} onChange={(e) => setLmWeight(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">Body Fat %</label>
                    <input type="number" value={lmFat} onChange={(e) => setLmFat(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold" />
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-surface-container-low flex items-center justify-between">
                  <div>
                    <span className="text-xs text-on-surface-variant">Lean Body Mass</span>
                    <div className="text-2xl font-bold text-primary">{calculatedLeanMass} kg</div>
                  </div>
                </div>
                <Link href="/health-fitness-calculators/lean-mass" className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-body-sm font-semibold hover:bg-primary-container transition-all flex items-center justify-center gap-1.5 shadow-sm">
                  <span>Open Full Page Workbench</span>
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                </Link>
              </div>
            )}

            {/* METs */}
            {activeModal === 'mets' && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">Weight</label>
                    <input type="number" value={metsWeight} onChange={(e) => setMetsWeight(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">MET</label>
                    <input type="number" value={metsValue} onChange={(e) => setMetsValue(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">Minutes</label>
                    <input type="number" value={metsDuration} onChange={(e) => setMetsDuration(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold" />
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-surface-container-low flex items-center justify-between">
                  <div>
                    <span className="text-xs text-on-surface-variant">Calories Burned</span>
                    <div className="text-2xl font-bold text-primary">{calculatedMets} kcal</div>
                  </div>
                </div>
                <Link href="/health-fitness-calculators/mets" className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-body-sm font-semibold hover:bg-primary-container transition-all flex items-center justify-center gap-1.5 shadow-sm">
                  <span>Open Full Page Workbench</span>
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                </Link>
              </div>
            )}

            {/* Running Pace */}
            {activeModal === 'running-pace' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">Distance (km)</label>
                    <input type="number" value={paceDist} onChange={(e) => setPaceDist(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">Time (mins)</label>
                    <input type="number" value={paceTime} onChange={(e) => setPaceTime(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold" />
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-surface-container-low flex items-center justify-between">
                  <div>
                    <span className="text-xs text-on-surface-variant">Pace</span>
                    <div className="text-2xl font-bold text-primary">{calculatedPace} /km</div>
                  </div>
                </div>
                <Link href="/health-fitness-calculators/running-pace" className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-body-sm font-semibold hover:bg-primary-container transition-all flex items-center justify-center gap-1.5 shadow-sm">
                  <span>Open Full Page Workbench</span>
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                </Link>
              </div>
            )}

            {/* FTP */}
            {activeModal === 'ftp' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">20-Min Avg Power (W)</label>
                  <input type="number" value={ftpPower} onChange={(e) => setFtpPower(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold" />
                </div>
                <div className="p-4 rounded-2xl bg-surface-container-low flex items-center justify-between">
                  <div>
                    <span className="text-xs text-on-surface-variant">Estimated FTP</span>
                    <div className="text-2xl font-bold text-primary">{calculatedFtp} W</div>
                  </div>
                </div>
                <Link href="/health-fitness-calculators/ftp" className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-body-sm font-semibold hover:bg-primary-container transition-all flex items-center justify-center gap-1.5 shadow-sm">
                  <span>Open Full Page Workbench</span>
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                </Link>
              </div>
            )}

            {/* Rucking */}
            {activeModal === 'rucking' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">Body Weight (kg)</label>
                    <input type="number" value={ruckWeight} onChange={(e) => setRuckWeight(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">Pack Weight (kg)</label>
                    <input type="number" value={ruckPack} onChange={(e) => setRuckPack(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold" />
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-surface-container-low flex items-center justify-between">
                  <div>
                    <span className="text-xs text-on-surface-variant">Est. Calories Burned (30 min flat)</span>
                    <div className="text-2xl font-bold text-primary">{calculatedRucking} kcal</div>
                  </div>
                </div>
                <Link href="/health-fitness-calculators/rucking" className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-body-sm font-semibold hover:bg-primary-container transition-all flex items-center justify-center gap-1.5 shadow-sm">
                  <span>Open Full Page Workbench</span>
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                </Link>
              </div>
            )}

            {/* THR */}
            {activeModal === 'thr' && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">Age</label>
                    <input type="number" value={thrAge} onChange={(e) => setThrAge(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">Resting HR</label>
                    <input type="number" value={thrRhr} onChange={(e) => setThrRhr(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">Intensity %</label>
                    <input type="number" value={thrIntensity} onChange={(e) => setThrIntensity(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold" />
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-surface-container-low flex items-center justify-between">
                  <div>
                    <span className="text-xs text-on-surface-variant">Target Heart Rate</span>
                    <div className="text-2xl font-bold text-primary">{calculatedThr} BPM</div>
                  </div>
                </div>
                <Link href="/health-fitness-calculators/thr" className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-body-sm font-semibold hover:bg-primary-container transition-all flex items-center justify-center gap-1.5 shadow-sm">
                  <span>Open Full Page Workbench</span>
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                </Link>
              </div>
            )}

            {/* MAP & Pulse Pressure */}
            {(activeModal === 'map' || activeModal === 'pulse-pressure') && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">Systolic</label>
                    <input type="number" value={bpSys} onChange={(e) => setBpSys(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">Diastolic</label>
                    <input type="number" value={bpDia} onChange={(e) => setBpDia(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold" />
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-surface-container-low flex items-center justify-between">
                  <div>
                    <span className="text-xs text-on-surface-variant">
                      {activeModal === 'map' ? 'Mean Arterial Pressure' : 'Pulse Pressure'}
                    </span>
                    <div className="text-2xl font-bold text-primary">
                      {activeModal === 'map' ? calculatedMap : calculatedPulsePressure} mmHg
                    </div>
                  </div>
                </div>
                <Link href={`/health-fitness-calculators/${activeModal}`} className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-body-sm font-semibold hover:bg-primary-container transition-all flex items-center justify-center gap-1.5 shadow-sm">
                  <span>Open Full Page Workbench</span>
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                </Link>
              </div>
            )}

            {/* HRR */}
            {activeModal === 'hrr' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">Peak HR (End of Exercise)</label>
                    <input type="number" value={hrrPeak} onChange={(e) => setHrrPeak(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">HR at 1-Min Post</label>
                    <input type="number" value={hrr1Min} onChange={(e) => setHrr1Min(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold" />
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-surface-container-low flex items-center justify-between">
                  <div>
                    <span className="text-xs text-on-surface-variant">Heart Rate Recovery</span>
                    <div className="text-2xl font-bold text-primary">{calculatedHrr} BPM Drop</div>
                  </div>
                </div>
                <Link href="/health-fitness-calculators/hrr" className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-body-sm font-semibold hover:bg-primary-container transition-all flex items-center justify-center gap-1.5 shadow-sm">
                  <span>Open Full Page Workbench</span>
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                </Link>
              </div>
            )}

            {/* Max HR */}
            {activeModal === 'max-hr' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">Age</label>
                  <input type="number" value={maxHrAge} onChange={(e) => setMaxHrAge(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold" />
                </div>
                <div className="p-4 rounded-2xl bg-surface-container-low flex items-center justify-between">
                  <div>
                    <span className="text-xs text-on-surface-variant">Est. Max Heart Rate</span>
                    <div className="text-2xl font-bold text-primary">{calculatedMaxHr} BPM</div>
                  </div>
                </div>
                <Link href="/health-fitness-calculators/max-hr" className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-body-sm font-semibold hover:bg-primary-container transition-all flex items-center justify-center gap-1.5 shadow-sm">
                  <span>Open Full Page Workbench</span>
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                </Link>
              </div>
            )}

            {/* Sleep Debt */}
            {activeModal === 'sleep-debt' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">Required Sleep (hrs)</label>
                    <input type="number" step="0.5" value={sleepReq} onChange={(e) => setSleepReq(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">Actual Sleep (hrs)</label>
                    <input type="number" step="0.5" value={sleepAct} onChange={(e) => setSleepAct(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold" />
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-surface-container-low flex items-center justify-between">
                  <div>
                    <span className="text-xs text-on-surface-variant">Daily Sleep Debt</span>
                    <div className="text-2xl font-bold text-primary">{calculatedSleepDebt} hrs</div>
                  </div>
                </div>
                <Link href="/health-fitness-calculators/sleep-debt" className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-body-sm font-semibold hover:bg-primary-container transition-all flex items-center justify-center gap-1.5 shadow-sm">
                  <span>Open Full Page Workbench</span>
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                </Link>
              </div>
            )}

            {/* ESS */}
            {activeModal === 'ess' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">Total ESS Score (0-24)</label>
                  <input type="number" min="0" max="24" value={essScore} onChange={(e) => setEssScore(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold" />
                </div>
                <div className="p-4 rounded-2xl bg-surface-container-low flex items-center justify-between">
                  <div>
                    <span className="text-xs text-on-surface-variant">Result</span>
                    <div className="text-xl font-bold text-primary">
                      {essScore <= 5 ? 'Lower Normal' : essScore <= 10 ? 'Higher Normal' : essScore <= 12 ? 'Mild Sleepiness' : essScore <= 15 ? 'Moderate' : 'Severe Sleepiness'}
                    </div>
                  </div>
                </div>
                <Link href="/health-fitness-calculators/ess" className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-body-sm font-semibold hover:bg-primary-container transition-all flex items-center justify-center gap-1.5 shadow-sm">
                  <span>Open Full Page Workbench</span>
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                </Link>
              </div>
            )}

            {/* Ovulation */}
            {activeModal === 'ovulation' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">Last Period (LMP)</label>
                    <input type="date" value={ovuLmp} onChange={(e) => setOvuLmp(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">Cycle Length</label>
                    <input type="number" value={ovuCycle} onChange={(e) => setOvuCycle(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold" />
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-surface-container-low flex items-center justify-between">
                  <div>
                    <span className="text-xs text-on-surface-variant">Est. Ovulation</span>
                    <div className="text-2xl font-bold text-primary">{calculatedOvu}</div>
                  </div>
                </div>
                <Link href="/health-fitness-calculators/ovulation" className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-body-sm font-semibold hover:bg-primary-container transition-all flex items-center justify-center gap-1.5 shadow-sm">
                  <span>Open Full Page Workbench</span>
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                </Link>
              </div>
            )}

            {/* hCG */}
            
            {activeModal === 'hcg' && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">hCG 1</label>
                    <input type="number" value={hcg1} onChange={(e) => setHcg1(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">hCG 2</label>
                    <input type="number" value={hcg2} onChange={(e) => setHcg2(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">Hours Diff</label>
                    <input type="number" value={hcgHours} onChange={(e) => setHcgHours(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl bg-surface-container text-sm font-bold" />
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-surface-container-low flex items-center justify-between">
                  <div>
                    <span className="text-xs text-on-surface-variant">Doubling Time</span>
                    <div className="text-2xl font-bold text-primary">{calculatedHcg} hours</div>
                  </div>
                </div>
                <Link href="/health-fitness-calculators/hcg" className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-body-sm font-semibold hover:bg-primary-container transition-all flex items-center justify-center gap-1.5 shadow-sm">
                  <span>Open Full Page Workbench</span>
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                </Link>
              </div>
            )}


            {/* General Tool Quick Mode Fallback */}
            {!['bmi', 'tdee', 'bmr', 'navy', 'navy-fat', 'body-fat', 'water', 'water-matrix', 'zone2', 'vo2max', 'sleep', 'sleep-wake', 'pregnancy', 'due-date', '1rm', 'macros', 'macro-split', 'mets', 'running-pace', 'ftp', 'rucking', 'thr', 'map', 'hrr', 'pulse-pressure', 'max-hr', 'sleep-debt', 'ess', 'ovulation', 'hcg'].includes(activeModal) && (
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
                  href={activeModal === 'bmi' ? '/health-fitness-calculators/bmi' : `/health-fitness-calculators/${activeModal}`}
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
                '@id': 'https://solveitcalculator.com/health-fitness-calculators/#webpage',
                url: 'https://solveitcalculator.com/health-fitness-calculators',
                name: 'Health & Fitness Calculators – BMI, Calories, Weight Loss & More | SolveItCalculator',
                description: 'Use free health and fitness calculators for BMI, calorie needs, body fat, weight loss, BMR, TDEE, heart rate, pregnancy, and nutrition planning. Fast and accurate.',
                breadcrumb: {
                  '@id': 'https://solveitcalculator.com/health-fitness-calculators/#breadcrumb'
                }
              },
              {
                '@type': 'CollectionPage',
                '@id': 'https://solveitcalculator.com/health-fitness-calculators/#collection',
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
                '@id': 'https://solveitcalculator.com/health-fitness-calculators/#breadcrumb',
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
                    name: 'Health & Fitness',
                    item: 'https://solveitcalculator.com/health-fitness-calculators'
                  }
                ]
              },
              {
                '@type': 'FAQPage',
                '@id': 'https://solveitcalculator.com/health-fitness-calculators/#faq',
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

      <QuickModeIBW isOpen={activeModal === 'ibw'} onClose={() => setActiveModal(null)} />
      <QuickModeLeanMass isOpen={activeModal === 'lbm' || activeModal === 'lean-mass'} onClose={() => setActiveModal(null)} />
      <QuickModeCaloriePlanner isOpen={activeModal === 'deficit'} onClose={() => setActiveModal(null)} />

      <QuickModeABSI isOpen={activeModal === 'absi'} onClose={() => setActiveModal(null)} />
      <QuickModeBSA isOpen={activeModal === 'bsa'} onClose={() => setActiveModal(null)} />
      <QuickModeWHtR isOpen={activeModal === 'whtr'} onClose={() => setActiveModal(null)} />
      <QuickModeFFMI isOpen={activeModal === 'ffmi'} onClose={() => setActiveModal(null)} />
      <QuickModeWHR isOpen={activeModal === 'whr'} onClose={() => setActiveModal(null)} />
      <QuickModeProteinRDA isOpen={activeModal === 'protein-rda'} onClose={() => setActiveModal(null)} />
      <QuickModeCarbCycling isOpen={activeModal === 'carb-cycling'} onClose={() => setActiveModal(null)} />
      <QuickModeKeto isOpen={activeModal === 'keto'} onClose={() => setActiveModal(null)} />
      <QuickModeVelocity isOpen={activeModal === 'velocity'} onClose={() => setActiveModal(null)} />

    </div>
  );
}
