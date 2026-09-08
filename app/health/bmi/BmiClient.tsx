'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface HistoryRecord {
  id: string;
  timestamp: string;
  formattedDate: string;
  heightCm: number;
  weightKg: number;
  bmi: number;
  category: string;
  unit: 'metric' | 'imperial';
}

const INITIAL_HISTORY: HistoryRecord[] = [
  { id: '1', timestamp: '2024-10-14T09:00:00Z', formattedDate: 'Oct 14, 2024', heightCm: 178, weightKg: 77.8, bmi: 25.1, category: 'Overweight (Edge)', unit: 'metric' },
  { id: '2', timestamp: '2024-11-28T10:15:00Z', formattedDate: 'Nov 28, 2024', heightCm: 178, weightKg: 76.2, bmi: 24.6, category: 'Normal', unit: 'metric' },
  { id: '3', timestamp: '2025-01-15T08:30:00Z', formattedDate: 'Jan 15, 2025', heightCm: 178, weightKg: 75.6, bmi: 24.4, category: 'Normal', unit: 'metric' },
  { id: '4', timestamp: '2025-02-20T09:42:00Z', formattedDate: 'Today, 09:42 AM', heightCm: 178, weightKg: 75.0, bmi: 24.2, category: 'Normal Weight', unit: 'metric' },
];

export default function BmiClient() {
  // Input parameters
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [gender, setGender] = useState<'male' | 'female' | 'neutral'>('male');
  
  // Height state: metric (cm), imperial (ft, in)
  const [heightCm, setHeightCm] = useState<number>(178);
  const [heightFt, setHeightFt] = useState<number>(5);
  const [heightIn, setHeightIn] = useState<number>(10);
  
  // Weight state: kg
  const [weightKg, setWeightKg] = useState<number>(75.0);
  
  // Demographics
  const [age, setAge] = useState<number>(32);
  const [activityMult, setActivityMult] = useState<number>(1.55);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // History log
  const [history, setHistory] = useState<HistoryRecord[]>(INITIAL_HISTORY);

  // FAQ Accordion active indices
  const [openFaqIndices, setOpenFaqIndices] = useState<number[]>([0]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  }, []);

  // Sync Height from CM
  const syncFromCm = useCallback((val: number) => {
    const clamped = Math.max(100, Math.min(240, val));
    setHeightCm(clamped);
    const totalInches = clamped / 2.54;
    const ft = Math.floor(totalInches / 12);
    const inch = Math.round(totalInches % 12);
    setHeightFt(ft);
    setHeightIn(inch);
  }, []);

  // Sync Height from FT + IN
  const syncFromFtIn = useCallback((ft: number, inch: number) => {
    const clampedFt = Math.max(3, Math.min(7, ft));
    const clampedIn = Math.max(0, Math.min(11, inch));
    setHeightFt(clampedFt);
    setHeightIn(clampedIn);
    const totalInches = clampedFt * 12 + clampedIn;
    const cm = Math.round(totalInches * 2.54);
    setHeightCm(cm);
  }, []);

  // Recalculated metrics
  const telemetry = useMemo(() => {
    const meters = heightCm / 100;
    const bmi = meters > 0 ? weightKg / (meters * meters) : 0;
    const ponderal = meters > 0 ? weightKg / Math.pow(meters, 3) : 0;

    let category = 'Normal / Healthy Weight';
    let sub = 'Optimal Disease Risk Baseline';
    let risk = 'Low Baseline';
    let pillColorClass = 'bg-secondary-container/30 text-on-secondary-container border border-secondary/30';
    let tierCode: 'under-severe' | 'under' | 'normal' | 'over' | 'obese-1' | 'obese-2' = 'normal';

    if (bmi < 16.0) {
      category = 'Severe Thinness';
      sub = 'High Nutritional Deficiency Risk';
      risk = 'High Relative Risk';
      pillColorClass = 'bg-error-container text-on-error-container border border-error/30';
      tierCode = 'under-severe';
    } else if (bmi < 18.5) {
      category = 'Underweight';
      sub = 'Mildly Low Baseline';
      risk = 'Moderate Risk';
      pillColorClass = 'bg-secondary-fixed text-on-secondary-fixed-variant border border-secondary-fixed-dim';
      tierCode = 'under';
    } else if (bmi < 25.0) {
      category = 'Normal / Healthy Weight';
      sub = 'Optimal Disease Risk Baseline';
      risk = 'Low Baseline';
      pillColorClass = 'bg-secondary-container/30 text-on-secondary-container border border-secondary/30';
      tierCode = 'normal';
    } else if (bmi < 30.0) {
      category = 'Overweight / Pre-Obese';
      sub = 'Elevated Cardiovascular Sensitivity';
      risk = 'Elevated Risk';
      pillColorClass = 'bg-tertiary-fixed text-on-tertiary-fixed-variant border border-tertiary-fixed-dim';
      tierCode = 'over';
    } else if (bmi < 35.0) {
      category = 'Obese Class I';
      sub = 'Moderate Comorbidity Factor';
      risk = 'High Risk';
      pillColorClass = 'bg-tertiary-container text-on-tertiary-container border border-tertiary/40';
      tierCode = 'obese-1';
    } else {
      category = 'Obese Class II / III';
      sub = 'Clinical Intervention Recommended';
      risk = 'Severe Risk';
      pillColorClass = 'bg-error text-on-error border border-error';
      tierCode = 'obese-2';
    }

    // Gauge needle percentage (mapped roughly from 15.0 to 40.0)
    let percent = ((bmi - 15) / (40 - 15)) * 100;
    percent = Math.max(2, Math.min(98, percent));

    // Healthy Weight Envelope (BMI 18.5 to 24.9)
    const minHealthyKg = 18.5 * (meters * meters);
    const maxHealthyKg = 24.9 * (meters * meters);

    // Threshold delta
    let deltaText = '0.0 kg';
    let deltaLabel = 'Directly in Normal Zone';
    let isOptimal = true;

    if (weightKg < minHealthyKg) {
      const deficitKg = minHealthyKg - weightKg;
      deltaText = unit === 'metric' ? `+${deficitKg.toFixed(1)} kg to Normal` : `+${(deficitKg * 2.20462).toFixed(1)} lbs to Normal`;
      deltaLabel = 'Underweight Deficit';
      isOptimal = false;
    } else if (weightKg > maxHealthyKg) {
      const surplusKg = weightKg - maxHealthyKg;
      deltaText = unit === 'metric' ? `-${surplusKg.toFixed(1)} kg to Normal` : `-${(surplusKg * 2.20462).toFixed(1)} lbs to Normal`;
      deltaLabel = 'Overweight Surplus';
      isOptimal = false;
    }

    // Mifflin-St Jeor TDEE estimate
    const genderOffset = gender === 'male' ? 5 : gender === 'female' ? -161 : -78;
    const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + genderOffset;
    const tdee = Math.round(bmr * activityMult);

    return {
      bmi,
      category,
      sub,
      risk,
      pillColorClass,
      tierCode,
      gaugePercent: percent,
      ponderal,
      minHealthyKg,
      maxHealthyKg,
      deltaText,
      deltaLabel,
      isOptimal,
      tdee,
      bmr,
      meters
    };
  }, [heightCm, weightKg, age, activityMult, gender, unit]);

  // Handle Preset Selection
  const applyPreset = (preset: 'male-avg' | 'female-avg' | 'athletic') => {
    if (preset === 'male-avg') {
      setGender('male');
      syncFromCm(178);
      setWeightKg(75.0);
      setAge(32);
      setActivityMult(1.55);
      showToast('Loaded: Average Male (178cm, 75kg)');
    } else if (preset === 'female-avg') {
      setGender('female');
      syncFromCm(165);
      setWeightKg(62.0);
      setAge(30);
      setActivityMult(1.375);
      showToast('Loaded: Average Female (165cm, 62kg)');
    } else if (preset === 'athletic') {
      setGender('male');
      syncFromCm(182);
      setWeightKg(84.0);
      setAge(27);
      setActivityMult(1.725);
      showToast('Loaded: Athletic Build (182cm, 84kg)');
    }
  };

  // Reset to default baseline
  const handleReset = () => {
    setGender('male');
    syncFromCm(178);
    setWeightKg(75.0);
    setAge(32);
    setActivityMult(1.55);
    showToast('Reset biometrics to standard baseline');
  };

  // Save current record snapshot
  const handleSaveSnapshot = () => {
    const newEntry: HistoryRecord = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      formattedDate: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      heightCm,
      weightKg,
      bmi: parseFloat(telemetry.bmi.toFixed(1)),
      category: telemetry.category,
      unit
    };
    setHistory(prev => [newEntry, ...prev.slice(0, 7)]);
    showToast(`Snapshot saved: ${telemetry.bmi.toFixed(1)} kg/m² logged to local history.`);
  };

  // Copy Summary text
  const handleCopySummary = () => {
    const heightStr = unit === 'metric' ? `${heightCm} cm` : `${heightFt} ft ${heightIn} in (${heightCm} cm)`;
    const weightStr = unit === 'metric' ? `${weightKg.toFixed(1)} kg` : `${(weightKg * 2.20462).toFixed(1)} lbs (${weightKg.toFixed(1)} kg)`;
    const text = `SolveIt Biometric Telemetry: BMI ${telemetry.bmi.toFixed(1)} kg/m² (${telemetry.category}) | Stature: ${heightStr}, Mass: ${weightStr} | Estimated TDEE: ${telemetry.tdee.toLocaleString()} kcal/day | Source: solveitcalculator.com/health/bmi`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      showToast('Biometric summary copied to clipboard!');
    }
  };

  // Copy Formulas
  const handleCopyFormulas = () => {
    const text = `METRIC FORMULA:\nBMI = Weight (kg) / [Height (m)]²\n\nUS IMPERIAL FORMULA:\nBMI = 703 × Weight (lbs) / [Height (in)]²\n\nROHRER'S PONDERAL INDEX:\nPI = Weight (kg) / [Height (m)]³\n\nSource: SolveIt Health Metrology Suite`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      showToast('Standardized formulas copied to clipboard!');
    }
  };

  // Export History to CSV
  const handleExportCsv = () => {
    if (history.length === 0) {
      showToast('History is empty.');
      return;
    }
    const headers = 'ID,Date,Height_cm,Weight_kg,BMI_Score,Category\n';
    const rows = history.map(h => `${h.id},"${h.formattedDate}",${h.heightCm},${h.weightKg},${h.bmi},"${h.category}"`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `solveit_bmi_biometrics_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('CSV export downloaded.');
  };

  // Clear Log
  const handleClearLog = () => {
    setHistory([]);
    showToast('Telemetry history log cleared.');
  };

  // Toggle FAQ item
  const toggleFaq = (idx: number) => {
    setOpenFaqIndices(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col font-body-md selection:bg-primary/20 selection:text-primary">
      <Header />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-on-surface text-surface-container-lowest px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-outline-variant/30 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span className="material-symbols-outlined text-secondary text-[20px]">check_circle</span>
          <span className="font-body-sm text-body-sm font-medium">{toastMessage}</span>
        </div>
      )}

      <main className="w-full pt-[98px] bg-surface flex-1">
        {/* ================= SECTION 1: HERO & CLINICAL HEADER ================= */}
        <section className="w-full bg-surface-container-low pt-space-xl pb-space-2xl px-gutter-mobile lg:px-gutter-desktop border-b border-outline-variant/20">
          <div className="max-w-max-width-canvas mx-auto">
            {/* Breadcrumb & Trust Badges */}
            <div className="flex flex-wrap items-center justify-between gap-space-sm mb-space-md">
              <nav aria-label="Breadcrumb" className="flex items-center gap-space-xs font-body-sm text-body-sm text-on-surface-variant">
                <Link className="hover:text-primary transition-colors flex items-center gap-1" href="/">
                  <span className="material-symbols-outlined text-[16px]">home</span>
                  Home
                </Link>
                <span className="text-outline-variant">/</span>
                <Link className="hover:text-primary transition-colors" href="/health">
                  Health &amp; Fitness
                </Link>
                <span className="text-outline-variant">/</span>
                <span className="font-semibold text-on-surface">Universal BMI &amp; Body Composition</span>
              </nav>
              <div className="flex flex-wrap items-center gap-space-xs">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface font-label-caps text-label-caps border border-outline-variant/30">
                  <span className="material-symbols-outlined text-[14px] text-primary">verified</span>
                  WHO / NIH Standard
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface font-label-caps text-label-caps border border-outline-variant/30">
                  <span className="material-symbols-outlined text-[14px] text-secondary">memory</span>
                  IEEE-754 Precision
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-caps text-label-caps border border-outline-variant/30">
                  <span className="material-symbols-outlined text-[14px] text-outline">lock</span>
                  100% Client-Side
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-caps text-label-caps border border-outline-variant/30">
                  Feb 2025 Consensus
                </span>
              </div>
            </div>

            {/* Title & High-Cognition Subtitle */}
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-primary/10 text-primary font-label-caps text-label-caps uppercase tracking-wider mb-space-xs">
                Clinical Telemetry Workbench
              </div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface mb-space-xs tracking-tight">
                Universal BMI &amp; Body Composition Calculator
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                Calculate your clinical Body Mass Index, personalized healthy weight envelope, metabolic risk classification, and anthropometric category using WHO, CDC, and NIH validated epidemiological cutoffs.
              </p>
            </div>

            {/* Reusable Quick Health Tool Switcher */}
            <div className="mt-space-lg overflow-x-auto pb-space-2xs scrollbar-none">
              <div className="flex items-center gap-space-xs min-w-max">
                <Link className="px-space-md py-space-xs rounded-full bg-primary text-on-primary font-label-caps text-label-caps shadow-sm flex items-center gap-1.5 transition-transform hover:scale-[1.02]" href="/health/bmi">
                  <span className="material-symbols-outlined text-[16px]">grade</span>
                  BMI Calculator (Active)
                </Link>
                <Link className="px-space-md py-space-xs rounded-full bg-surface-container-lowest text-on-surface-variant hover:text-on-surface font-label-caps text-label-caps shadow-sm hover:bg-surface-container transition-all" href="/health#tdee-card">
                  Calorie Deficit / TDEE
                </Link>
                <Link className="px-space-md py-space-xs rounded-full bg-surface-container-lowest text-on-surface-variant hover:text-on-surface font-label-caps text-label-caps shadow-sm hover:bg-surface-container transition-all" href="/health#bmr-card">
                  BMR Mifflin-St Jeor
                </Link>
                <Link className="px-space-md py-space-xs rounded-full bg-surface-container-lowest text-on-surface-variant hover:text-on-surface font-label-caps text-label-caps shadow-sm hover:bg-surface-container transition-all" href="/health#navy-card">
                  Navy Body Fat %
                </Link>
                <Link className="px-space-md py-space-xs rounded-full bg-surface-container-lowest text-on-surface-variant hover:text-on-surface font-label-caps text-label-caps shadow-sm hover:bg-surface-container transition-all" href="/health#water-card">
                  Daily Water Hydration
                </Link>
                <Link className="px-space-md py-space-xs rounded-full bg-surface-container-lowest text-on-surface-variant hover:text-on-surface font-label-caps text-label-caps shadow-sm hover:bg-surface-container transition-all" href="/health#zone2-card">
                  Zone 2 Heart Rate
                </Link>
                <Link className="px-space-md py-space-xs rounded-full bg-surface-container-lowest text-on-surface-variant hover:text-on-surface font-label-caps text-label-caps shadow-sm hover:bg-surface-container transition-all" href="/health#tdee-card">
                  Macro &amp; Protein Target
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SECTION 2: MAIN INTERACTIVE CORE (SPLIT WORKBENCH) ================= */}
        <section className="w-full py-space-xl px-gutter-mobile lg:px-gutter-desktop">
          <div className="max-w-max-width-canvas mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
              
              {/* LEFT PANEL: Interactive Clinical Input Terminal (Cols 1-5) */}
              <div className="lg:col-span-5 flex flex-col gap-space-md">
                <div className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-md border border-outline-variant/30 flex flex-col gap-space-lg">
                  {/* Terminal Header & Unit Pill Toggle */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider">Parameters</span>
                      <h2 className="font-headline-md text-headline-md text-on-surface">Input Biometrics</h2>
                    </div>
                    {/* Segmented Unit Switch */}
                    <div className="inline-flex p-1 rounded-xl bg-surface-container-low border border-outline-variant/30">
                      <button
                        onClick={() => setUnit('metric')}
                        className={`px-space-sm py-1 rounded-lg font-label-caps text-label-caps transition-all cursor-pointer ${
                          unit === 'metric'
                            ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold'
                            : 'text-on-surface-variant hover:text-on-surface'
                        }`}
                        type="button"
                      >
                        Metric (cm / kg)
                      </button>
                      <button
                        onClick={() => setUnit('imperial')}
                        className={`px-space-sm py-1 rounded-lg font-label-caps text-label-caps transition-all cursor-pointer ${
                          unit === 'imperial'
                            ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold'
                            : 'text-on-surface-variant hover:text-on-surface'
                        }`}
                        type="button"
                      >
                        US Imperial (ft / lbs)
                      </button>
                    </div>
                  </div>

                  {/* Demographic Quick Select: Gender */}
                  <div className="flex flex-col gap-space-2xs">
                    <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Biological Reference Model</label>
                    <div className="grid grid-cols-3 gap-space-xs">
                      <button
                        onClick={() => setGender('male')}
                        className={`py-2.5 px-space-xs rounded-xl font-body-sm text-body-sm flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer ${
                          gender === 'male'
                            ? 'bg-primary text-on-primary font-semibold'
                            : 'bg-surface-container-low text-on-surface-variant font-medium hover:bg-surface-container'
                        }`}
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[18px]">male</span>
                        Male
                      </button>
                      <button
                        onClick={() => setGender('female')}
                        className={`py-2.5 px-space-xs rounded-xl font-body-sm text-body-sm flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer ${
                          gender === 'female'
                            ? 'bg-primary text-on-primary font-semibold'
                            : 'bg-surface-container-low text-on-surface-variant font-medium hover:bg-surface-container'
                        }`}
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[18px]">female</span>
                        Female
                      </button>
                      <button
                        onClick={() => setGender('neutral')}
                        className={`py-2.5 px-space-xs rounded-xl font-body-sm text-body-sm flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer ${
                          gender === 'neutral'
                            ? 'bg-primary text-on-primary font-semibold'
                            : 'bg-surface-container-low text-on-surface-variant font-medium hover:bg-surface-container'
                        }`}
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[18px]">group</span>
                        Standard
                      </button>
                    </div>
                  </div>

                  {/* Height Input Control */}
                  <div className="flex flex-col gap-space-xs">
                    <div className="flex items-center justify-between">
                      <label className="font-body-sm text-body-sm font-semibold text-on-surface">Stature / Standing Height</label>
                      <span className="font-data-mono text-data-mono text-primary font-semibold">
                        {unit === 'metric' ? `${heightCm} cm` : `${heightFt} ft ${heightIn} in (${heightCm} cm)`}
                      </span>
                    </div>

                    {unit === 'metric' ? (
                      <div className="flex flex-col gap-space-xs">
                        <div className="relative flex items-center">
                          <input
                            className="w-full bg-surface-container-low text-on-surface font-data-mono text-data-mono rounded-xl px-space-md py-3 focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary shadow-sm border border-outline-variant/20"
                            max="240"
                            min="100"
                            step="0.5"
                            type="number"
                            value={heightCm}
                            onChange={e => syncFromCm(parseFloat(e.target.value) || 178)}
                          />
                          <span className="absolute right-4 font-label-caps text-label-caps text-on-surface-variant pointer-events-none">CM</span>
                        </div>
                        <input
                          className="w-full accent-primary h-2 bg-surface-container-high rounded-lg cursor-pointer"
                          max="220"
                          min="120"
                          step="1"
                          type="range"
                          value={heightCm}
                          onChange={e => syncFromCm(parseFloat(e.target.value))}
                        />
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-space-sm">
                        <div className="relative flex items-center">
                          <input
                            className="w-full bg-surface-container-low text-on-surface font-data-mono text-data-mono rounded-xl px-space-md py-3 focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary border border-outline-variant/20"
                            max="7"
                            min="3"
                            type="number"
                            value={heightFt}
                            onChange={e => syncFromFtIn(parseInt(e.target.value) || 5, heightIn)}
                          />
                          <span className="absolute right-4 font-label-caps text-label-caps text-on-surface-variant pointer-events-none">FEET</span>
                        </div>
                        <div className="relative flex items-center">
                          <input
                            className="w-full bg-surface-container-low text-on-surface font-data-mono text-data-mono rounded-xl px-space-md py-3 focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary border border-outline-variant/20"
                            max="11"
                            min="0"
                            type="number"
                            value={heightIn}
                            onChange={e => syncFromFtIn(heightFt, parseInt(e.target.value) || 0)}
                          />
                          <span className="absolute right-4 font-label-caps text-label-caps text-on-surface-variant pointer-events-none">INCHES</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Weight Input Control */}
                  <div className="flex flex-col gap-space-xs">
                    <div className="flex items-center justify-between">
                      <label className="font-body-sm text-body-sm font-semibold text-on-surface">Total Body Weight</label>
                      <span className="font-data-mono text-data-mono text-primary font-semibold">
                        {unit === 'metric'
                          ? `${weightKg.toFixed(1)} kg`
                          : `${(weightKg * 2.20462).toFixed(1)} lbs (${weightKg.toFixed(1)} kg)`}
                      </span>
                    </div>

                    <div className="relative flex items-center">
                      <input
                        className="w-full bg-surface-container-low text-on-surface font-data-mono text-data-mono rounded-xl px-space-md py-3 focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary shadow-sm border border-outline-variant/20"
                        max="250"
                        min="30"
                        step="0.5"
                        type="number"
                        value={unit === 'metric' ? weightKg : parseFloat((weightKg * 2.20462).toFixed(1))}
                        onChange={e => {
                          const val = parseFloat(e.target.value) || 0;
                          setWeightKg(unit === 'metric' ? val : val / 2.20462);
                        }}
                      />
                      <span className="absolute right-4 font-label-caps text-label-caps text-on-surface-variant pointer-events-none">
                        {unit === 'metric' ? 'KG' : 'LBS'}
                      </span>
                    </div>
                    <input
                      className="w-full accent-primary h-2 bg-surface-container-high rounded-lg cursor-pointer"
                      max="180"
                      min="35"
                      step="0.5"
                      type="range"
                      value={weightKg}
                      onChange={e => setWeightKg(parseFloat(e.target.value))}
                    />
                  </div>

                  {/* Age & Activity Level Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                    <div className="flex flex-col gap-space-2xs">
                      <label className="font-body-sm text-body-sm font-semibold text-on-surface">Chronological Age</label>
                      <div className="relative flex items-center">
                        <input
                          className="w-full bg-surface-container-low text-on-surface font-data-mono text-data-mono rounded-xl px-space-md py-2.5 focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary border border-outline-variant/20"
                          max="100"
                          min="18"
                          type="number"
                          value={age}
                          onChange={e => setAge(parseInt(e.target.value) || 32)}
                        />
                        <span className="absolute right-4 font-label-caps text-label-caps text-on-surface-variant pointer-events-none">YRS</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-space-2xs">
                      <label className="font-body-sm text-body-sm font-semibold text-on-surface">Physical Activity</label>
                      <select
                        className="w-full bg-surface-container-low text-on-surface font-body-sm text-body-sm rounded-xl px-space-md py-2.5 focus:outline-none focus:ring-2 focus:ring-primary border border-outline-variant/20 cursor-pointer"
                        value={activityMult}
                        onChange={e => setActivityMult(parseFloat(e.target.value))}
                      >
                        <option value="1.2">Sedentary (Desk Job)</option>
                        <option value="1.375">Light (1-3 days/wk)</option>
                        <option value="1.55">Moderate (3-5 days/wk)</option>
                        <option value="1.725">Very Active (6-7 days/wk)</option>
                        <option value="1.9">Elite Athletics (2x/day)</option>
                      </select>
                    </div>
                  </div>

                  {/* Quick Calibration Presets */}
                  <div className="flex flex-col gap-space-2xs pt-space-xs">
                    <span className="font-label-caps text-label-caps text-outline uppercase">Quick Calibration Presets</span>
                    <div className="flex flex-wrap items-center gap-space-xs">
                      <button
                        onClick={() => applyPreset('male-avg')}
                        className="px-2.5 py-1.5 rounded-lg bg-surface-container-low text-on-surface-variant font-label-caps text-label-caps hover:bg-surface-container-high transition-colors cursor-pointer border border-outline-variant/20"
                        type="button"
                      >
                        Average Male (178cm, 75kg)
                      </button>
                      <button
                        onClick={() => applyPreset('female-avg')}
                        className="px-2.5 py-1.5 rounded-lg bg-surface-container-low text-on-surface-variant font-label-caps text-label-caps hover:bg-surface-container-high transition-colors cursor-pointer border border-outline-variant/20"
                        type="button"
                      >
                        Average Female (165cm, 62kg)
                      </button>
                      <button
                        onClick={() => applyPreset('athletic')}
                        className="px-2.5 py-1.5 rounded-lg bg-surface-container-low text-on-surface-variant font-label-caps text-label-caps hover:bg-surface-container-high transition-colors cursor-pointer border border-outline-variant/20"
                        type="button"
                      >
                        Athletic Build (182cm, 84kg)
                      </button>
                    </div>
                  </div>

                  {/* Terminal Actions */}
                  <div className="pt-space-xs flex items-center justify-between gap-space-sm">
                    <button
                      onClick={() => showToast('Biometrics synchronized')}
                      className="flex-1 py-3 px-space-lg rounded-xl bg-primary text-on-primary font-body-sm text-body-sm font-semibold shadow-md hover:bg-primary-container active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">refresh</span>
                      Live Synchronize
                    </button>
                    <button
                      aria-label="Reset Values"
                      onClick={handleReset}
                      title="Reset Values"
                      className="w-12 h-12 rounded-xl bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container flex items-center justify-center transition-colors cursor-pointer border border-outline-variant/30"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[20px]">restart_alt</span>
                    </button>
                    <button
                      aria-label="Log Snapshot"
                      onClick={handleSaveSnapshot}
                      title="Save to local log"
                      className="w-12 h-12 rounded-xl bg-surface-container-low text-on-surface-variant hover:text-primary hover:bg-surface-container flex items-center justify-center transition-colors cursor-pointer border border-outline-variant/30"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[20px]">bookmark_add</span>
                    </button>
                  </div>
                </div>

                {/* Micro Metrology Note */}
                <div className="p-space-md rounded-2xl bg-surface-container-low text-on-surface-variant font-body-sm text-body-sm flex items-start gap-space-sm border border-outline-variant/20">
                  <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">verified_user</span>
                  <p>
                    Calculations adhere to the Quetelet metric index <code className="font-data-mono text-primary font-bold">W / H²</code>. For adults aged 20+, results apply equally to biological sexes, though adiposity distributions diverge across body frame structures.
                  </p>
                </div>
              </div>

              {/* RIGHT PANEL: Live Health Telemetry Dashboard (Cols 6-12) */}
              <div className="lg:col-span-7 flex flex-col gap-space-md">
                {/* Hero Score Card with Ambient Light Wash */}
                <div className="p-space-xl rounded-2xl bg-surface-container-lowest shadow-md border border-outline-variant/30 relative overflow-hidden flex flex-col gap-space-md">
                  {/* Chromatic Ambient Diffusion */}
                  <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs relative z-10">
                    <div>
                      <span className="font-label-caps text-label-caps text-outline uppercase tracking-wider">Computed Biometric Result</span>
                      <div className="flex items-baseline gap-space-xs mt-1">
                        <span className="font-numerical-display text-numerical-display text-on-surface tracking-tight font-bold">
                          {telemetry.bmi.toFixed(1)}
                        </span>
                        <span className="font-body-lg text-body-lg text-on-surface-variant font-semibold">kg/m²</span>
                      </div>
                    </div>

                    {/* Dynamic Category Pill */}
                    <div className="flex flex-col sm:items-end">
                      <div className={`inline-flex items-center gap-2 px-space-md py-1.5 rounded-full font-body-sm text-body-sm font-semibold shadow-xs ${telemetry.pillColorClass}`}>
                        <span className="w-2.5 h-2.5 rounded-full bg-current animate-pulse"></span>
                        <span>{telemetry.category}</span>
                      </div>
                      <span className="font-label-caps text-label-caps text-outline mt-1">{telemetry.sub}</span>
                    </div>
                  </div>

                  {/* Mathematical ratio subtitle */}
                  <div className="font-data-mono text-data-mono text-on-surface-variant text-[12px] bg-surface-container-low px-space-sm py-1.5 rounded-lg inline-flex items-center gap-2 max-w-fit border border-outline-variant/20">
                    <span className="material-symbols-outlined text-[15px] text-primary">functions</span>
                    <span>
                      WHO Ratio: {weightKg.toFixed(2)} kg ÷ ({telemetry.meters.toFixed(2)} m)² = {telemetry.bmi.toFixed(2)}
                    </span>
                  </div>

                  {/* VISUAL HEALTH GAUGE SPECTRUM BAR */}
                  <div className="mt-space-md flex flex-col gap-space-2xs">
                    <div className="flex items-center justify-between font-label-caps text-label-caps text-on-surface-variant">
                      <span>Clinical Distribution Spectrum</span>
                      <span className="font-data-mono font-semibold text-primary">Marker: {telemetry.bmi.toFixed(1)} kg/m²</span>
                    </div>

                    {/* Segmented Spectrum Bar Container */}
                    <div className="relative w-full pt-7 pb-2">
                      {/* User Floating Needle Indicator */}
                      <div
                        className="absolute top-0 flex flex-col items-center -translate-x-1/2 transition-all duration-500 ease-out z-20"
                        style={{ left: `${telemetry.gaugePercent}%` }}
                      >
                        <span className="px-2 py-0.5 rounded bg-on-surface text-surface-container-lowest font-data-mono text-[11px] font-semibold shadow-md whitespace-nowrap">
                          You: {telemetry.bmi.toFixed(1)}
                        </span>
                        <span className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-on-surface"></span>
                      </div>

                      {/* Color bar segments */}
                      <div className="w-full h-3 rounded-full overflow-hidden flex bg-surface-container-high shadow-inner">
                        {/* Underweight (<18.5) */}
                        <div className="h-full bg-secondary-fixed-dim transition-all" style={{ width: '18.5%' }} title="Underweight (< 18.5)"></div>
                        {/* Normal (18.5 - 24.9) */}
                        <div className="h-full bg-secondary-container transition-all" style={{ width: '25.5%' }} title="Normal Healthy (18.5 - 24.9)"></div>
                        {/* Overweight (25 - 29.9) */}
                        <div className="h-full bg-tertiary-fixed-dim transition-all" style={{ width: '20%' }} title="Overweight (25.0 - 29.9)"></div>
                        {/* Obese I (30 - 34.9) */}
                        <div className="h-full bg-tertiary transition-all" style={{ width: '18%' }} title="Obese Class I (30.0 - 34.9)"></div>
                        {/* Obese II/III (35+) */}
                        <div className="h-full bg-error transition-all" style={{ width: '18%' }} title="Obese Class II+ (≥ 35)"></div>
                      </div>

                      {/* Ticks & Cutoffs Labeling */}
                      <div className="flex justify-between items-center text-[10px] font-data-mono text-outline mt-1.5 px-0.5">
                        <span>16.0</span>
                        <span>18.5</span>
                        <span>25.0</span>
                        <span>30.0</span>
                        <span>35.0</span>
                        <span>40.0+</span>
                      </div>
                    </div>
                  </div>

                  {/* Multi-Card Metric Telemetry Bento Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-sm pt-space-xs">
                    {/* Card 1: Healthy Weight Range */}
                    <div className="p-space-md rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col justify-between gap-space-xs">
                      <span className="font-label-caps text-label-caps text-outline uppercase">Healthy Weight Target</span>
                      <div>
                        <div className="font-headline-md text-headline-md text-on-surface font-bold">
                          {unit === 'metric'
                            ? `${telemetry.minHealthyKg.toFixed(1)} – ${telemetry.maxHealthyKg.toFixed(1)}`
                            : `${(telemetry.minHealthyKg * 2.20462).toFixed(0)} – ${(telemetry.maxHealthyKg * 2.20462).toFixed(0)}`}
                        </div>
                        <div className="font-body-sm text-body-sm text-on-surface-variant">
                          {unit === 'metric' ? `kg at ${heightCm} cm` : `lbs at ${heightFt}'${heightIn}"`}
                        </div>
                      </div>
                      <div className="font-label-caps text-label-caps text-primary flex items-center gap-1 font-semibold">
                        <span className="material-symbols-outlined text-[14px]">tune</span>
                        Normal Envelope
                      </div>
                    </div>

                    {/* Card 2: Distance to Threshold */}
                    <div className="p-space-md rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col justify-between gap-space-xs">
                      <span className="font-label-caps text-label-caps text-outline uppercase">Target Delta</span>
                      <div>
                        <div className="font-headline-md text-headline-md text-on-surface font-bold">
                          {telemetry.deltaText}
                        </div>
                        <div className="font-body-sm text-body-sm text-on-surface-variant">
                          {telemetry.deltaLabel}
                        </div>
                      </div>
                      <div className={`font-label-caps text-label-caps flex items-center gap-1 font-semibold ${telemetry.isOptimal ? 'text-secondary' : 'text-tertiary'}`}>
                        <span className="material-symbols-outlined text-[14px]">
                          {telemetry.isOptimal ? 'check_circle' : 'trending_flat'}
                        </span>
                        {telemetry.isOptimal ? 'Optimal Center' : 'Boundary Shift'}
                      </div>
                    </div>

                    {/* Card 3: Ponderal Index */}
                    <div className="p-space-md rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col justify-between gap-space-xs">
                      <span className="font-label-caps text-label-caps text-outline uppercase">Ponderal Index</span>
                      <div>
                        <div className="font-headline-md text-headline-md text-on-surface font-bold">
                          {telemetry.ponderal.toFixed(1)}
                        </div>
                        <div className="font-body-sm text-body-sm text-on-surface-variant">kg/m³ (Volumetric)</div>
                      </div>
                      <div className="font-label-caps text-label-caps text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">view_in_ar</span>
                        Corpulence Metric
                      </div>
                    </div>

                    {/* Card 4: Metabolic Risk Tier */}
                    <div className="p-space-md rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col justify-between gap-space-xs">
                      <span className="font-label-caps text-label-caps text-outline uppercase">Cardiometabolic Risk</span>
                      <div>
                        <div className="font-headline-md text-headline-md text-on-surface font-bold">
                          {telemetry.risk}
                        </div>
                        <div className="font-body-sm text-body-sm text-on-surface-variant">Framingham Risk Proxy</div>
                      </div>
                      <div className="font-label-caps text-label-caps text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">ecg_heart</span>
                        Cohort Group
                      </div>
                    </div>

                    {/* Card 5: Estimated Maintenance Calories (Mifflin) */}
                    <div className="p-space-md rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col justify-between gap-space-xs sm:col-span-2">
                      <span className="font-label-caps text-label-caps text-outline uppercase">Integrated Maintenance Energy (TDEE Baseline)</span>
                      <div className="flex items-baseline gap-space-sm">
                        <div className="font-headline-md text-headline-md text-primary font-bold">
                          {telemetry.tdee.toLocaleString()}
                        </div>
                        <div className="font-body-sm text-body-sm text-on-surface-variant">
                          kcal / day to sustain present mass at Moderate activity
                        </div>
                      </div>
                      <div className="font-label-caps text-label-caps text-on-surface-variant flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">bolt</span>
                        Coupled with Mifflin-St Jeor Formula ({Math.round(telemetry.bmr)} kcal BMR)
                      </div>
                    </div>
                  </div>

                  {/* Telemetry Quick Actions Bar */}
                  <div className="pt-space-sm flex flex-wrap items-center justify-between gap-space-xs border-t border-surface-container-high">
                    <div className="flex items-center gap-space-xs">
                      <button
                        onClick={handleCopySummary}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-label-caps text-label-caps transition-colors cursor-pointer border border-outline-variant/20"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[16px]">content_copy</span>
                        Copy Summary
                      </button>
                      <button
                        onClick={() => window.print()}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-label-caps text-label-caps transition-colors cursor-pointer border border-outline-variant/20"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[16px]">print</span>
                        Print Clinical Sheet
                      </button>
                    </div>
                    <div className="font-data-mono text-data-mono text-[11px] text-outline">
                      Hash: <span className="text-on-surface">3A9F-2025</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SECTION 3: CLINICAL GUIDANCE & INTERPRETATION ================= */}
        <section className="w-full py-space-xl bg-surface-container-low px-gutter-mobile lg:px-gutter-desktop border-y border-outline-variant/20">
          <div className="max-w-max-width-canvas mx-auto">
            <div className="mb-space-lg">
              <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider">Clinical Guidance</span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface">Personalized Epidemiological Insights</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
              {/* Card 1: Longevity & Composition */}
              <div className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/20 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-secondary-container/20 text-secondary flex items-center justify-center mb-space-md">
                    <span className="material-symbols-outlined text-[22px]">health_and_safety</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-space-xs font-bold">Mortality &amp; Longevity Envelope</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Longitudinal WHO epidemiological meta-analyses observe the lowest all-cause relative mortality curve in the <strong className="text-on-surface font-semibold">22.0 to 24.5 kg/m²</strong> cohort for adults under 65, balancing protective cardiovascular margins against metabolic dysregulation.
                  </p>
                </div>
                <div className="mt-space-md pt-space-xs font-label-caps text-label-caps text-secondary flex items-center gap-1 font-semibold">
                  <span className="material-symbols-outlined text-[14px]">check</span>
                  Low Metabolic Risk Quintile
                </div>
              </div>

              {/* Card 2: Nuance on Lean Mass */}
              <div className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/20 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-tertiary-fixed/30 text-tertiary flex items-center justify-center mb-space-md">
                    <span className="material-symbols-outlined text-[22px]">fitness_center</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-space-xs font-bold">Skeletal Muscle &amp; FFMI Nuance</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Because BMI measures total gross mass rather than tissue quality, individuals engaged in resistance conditioning may register an &quot;Overweight&quot; score despite sustaining a healthy body fat percentage (&lt;15% for males, &lt;23% for females).
                  </p>
                </div>
                <div className="mt-space-md pt-space-xs font-label-caps text-label-caps text-tertiary flex items-center gap-1 font-semibold">
                  <span className="material-symbols-outlined text-[14px]">info</span>
                  Evaluate with Navy Tape Test
                </div>
              </div>

              {/* Card 3: Sustained Lifestyle Recommendations */}
              <div className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/20 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-primary-fixed/50 text-primary flex items-center justify-center mb-space-md">
                    <span className="material-symbols-outlined text-[22px]">directions_run</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-space-xs font-bold">Prescriptive Movement Target</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    To sustain healthy adiposity markers, CDC and ACSM clinical guidelines mandate 150–300 minutes of weekly moderate aerobic activity, supplemented with twice-weekly major muscle group resistance sessions.
                  </p>
                </div>
                <div className="mt-space-md pt-space-xs font-label-caps text-label-caps text-primary flex items-center gap-1 font-semibold">
                  <span className="material-symbols-outlined text-[14px]">bolt</span>
                  Zone 2 Cardio + Resistance
                </div>
              </div>
            </div>

            {/* Formal Disclaimer Callout */}
            <div className="mt-space-md p-space-md rounded-2xl bg-surface-container-high/60 text-on-surface-variant font-body-sm text-body-sm flex items-center gap-space-sm border border-outline-variant/20">
              <span className="material-symbols-outlined text-outline text-[20px] shrink-0">info</span>
              <span>
                <strong>Clinical Disclaimer:</strong> SolveIt calculators deliver deterministic statistical analyses based on published epidemiological studies. They do not constitute personalized diagnostic consultation. Evaluate abnormal findings with a licensed physician or registered dietitian.
              </span>
            </div>
          </div>
        </section>

        {/* ================= SECTION 4: CLASSIFICATION MATRIX ================= */}
        <section className="w-full py-space-xl px-gutter-mobile lg:px-gutter-desktop">
          <div className="max-w-max-width-canvas mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-lg">
              <div>
                <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider">Classification Matrix</span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface">WHO International vs. Asian-Pacific Thresholds</h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                  Ethnic differences in visceral adiposity warrant calibrated diagnostic boundaries.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary animate-pulse"></span>
                <span className="font-label-caps text-label-caps text-on-surface font-semibold">Highlighted: Your Active Classification</span>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto rounded-2xl shadow-md bg-surface-container-lowest border border-outline-variant/30">
              <table className="w-full text-left border-collapse font-body-sm text-body-sm">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface font-semibold border-b border-surface-container-high">
                    <th className="py-3.5 px-space-md">Clinical Category</th>
                    <th className="py-3.5 px-space-md">WHO International Cutoff (kg/m²)</th>
                    <th className="py-3.5 px-space-md">WHO Asian-Pacific Cutoff (kg/m²)</th>
                    <th className="py-3.5 px-space-md">Primary Disease Co-Morbidity Risk</th>
                    <th className="py-3.5 px-space-md text-right">Status Flag</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-low font-data-mono">
                  {/* Severe Thinness */}
                  <tr className={`transition-colors ${telemetry.tierCode === 'under-severe' ? 'bg-primary/10 font-bold' : 'hover:bg-surface-container-low/50'}`}>
                    <td className="py-3 px-space-md font-body-sm font-medium text-on-surface flex items-center gap-2">
                      {telemetry.tierCode === 'under-severe' && <span className="material-symbols-outlined text-[16px] text-primary">arrow_right_alt</span>}
                      Severe Thinness
                    </td>
                    <td className="py-3 px-space-md text-outline">&lt; 16.0</td>
                    <td className="py-3 px-space-md text-outline">&lt; 16.0</td>
                    <td className="py-3 px-space-md font-body-sm text-error">Extreme (Nutritional deficiency, osteopenia)</td>
                    <td className="py-3 px-space-md text-right">
                      {telemetry.tierCode === 'under-severe' ? (
                        <span className="px-2.5 py-1 rounded-full bg-primary text-on-primary font-label-caps text-label-caps shadow-sm">Your Tier ({telemetry.bmi.toFixed(1)})</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-error/10 text-error font-label-caps text-label-caps">Critical</span>
                      )}
                    </td>
                  </tr>

                  {/* Mild / Moderate Underweight */}
                  <tr className={`transition-colors ${telemetry.tierCode === 'under' ? 'bg-primary/10 font-bold' : 'hover:bg-surface-container-low/50'}`}>
                    <td className="py-3 px-space-md font-body-sm font-medium text-on-surface flex items-center gap-2">
                      {telemetry.tierCode === 'under' && <span className="material-symbols-outlined text-[16px] text-primary">arrow_right_alt</span>}
                      Mild / Moderate Underweight
                    </td>
                    <td className="py-3 px-space-md text-outline">16.0 – 18.4</td>
                    <td className="py-3 px-space-md text-outline">16.0 – 18.4</td>
                    <td className="py-3 px-space-md font-body-sm text-on-surface-variant">Elevated (Immune dysfunction)</td>
                    <td className="py-3 px-space-md text-right">
                      {telemetry.tierCode === 'under' ? (
                        <span className="px-2.5 py-1 rounded-full bg-primary text-on-primary font-label-caps text-label-caps shadow-sm">Your Tier ({telemetry.bmi.toFixed(1)})</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-caps text-label-caps">Low Mass</span>
                      )}
                    </td>
                  </tr>

                  {/* Normal / Healthy Weight */}
                  <tr className={`transition-colors ${telemetry.tierCode === 'normal' ? 'bg-primary/10 font-bold' : 'hover:bg-surface-container-low/50'}`}>
                    <td className="py-3.5 px-space-md font-body-sm text-primary flex items-center gap-2">
                      {telemetry.tierCode === 'normal' && <span className="material-symbols-outlined text-[16px] text-primary">arrow_right_alt</span>}
                      Normal / Healthy Weight
                    </td>
                    <td className="py-3.5 px-space-md text-primary">18.5 – 24.9</td>
                    <td className="py-3.5 px-space-md text-primary">18.5 – 22.9</td>
                    <td className="py-3.5 px-space-md font-body-sm text-secondary">Lowest (Epidemiological Reference)</td>
                    <td className="py-3.5 px-space-md text-right">
                      {telemetry.tierCode === 'normal' ? (
                        <span className="px-2.5 py-1 rounded-full bg-primary text-on-primary font-label-caps text-label-caps shadow-sm">Your Tier ({telemetry.bmi.toFixed(1)})</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-secondary-container/40 text-on-secondary-container font-label-caps text-label-caps">Optimal</span>
                      )}
                    </td>
                  </tr>

                  {/* Pre-Obesity / Overweight */}
                  <tr className={`transition-colors ${telemetry.tierCode === 'over' ? 'bg-primary/10 font-bold' : 'hover:bg-surface-container-low/50'}`}>
                    <td className="py-3 px-space-md font-body-sm font-medium text-on-surface flex items-center gap-2">
                      {telemetry.tierCode === 'over' && <span className="material-symbols-outlined text-[16px] text-primary">arrow_right_alt</span>}
                      Pre-Obesity / Overweight
                    </td>
                    <td className="py-3 px-space-md text-outline">25.0 – 29.9</td>
                    <td className="py-3 px-space-md text-outline">23.0 – 27.4</td>
                    <td className="py-3 px-space-md font-body-sm text-tertiary">Increased (Hypertension, hyperlipidemia)</td>
                    <td className="py-3 px-space-md text-right">
                      {telemetry.tierCode === 'over' ? (
                        <span className="px-2.5 py-1 rounded-full bg-primary text-on-primary font-label-caps text-label-caps shadow-sm">Your Tier ({telemetry.bmi.toFixed(1)})</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-tertiary-fixed/40 text-tertiary font-label-caps text-label-caps">Moderate Risk</span>
                      )}
                    </td>
                  </tr>

                  {/* Obesity Class I */}
                  <tr className={`transition-colors ${telemetry.tierCode === 'obese-1' ? 'bg-primary/10 font-bold' : 'hover:bg-surface-container-low/50'}`}>
                    <td className="py-3 px-space-md font-body-sm font-medium text-on-surface flex items-center gap-2">
                      {telemetry.tierCode === 'obese-1' && <span className="material-symbols-outlined text-[16px] text-primary">arrow_right_alt</span>}
                      Obesity Class I
                    </td>
                    <td className="py-3 px-space-md text-outline">30.0 – 34.9</td>
                    <td className="py-3 px-space-md text-outline">27.5 – 32.4</td>
                    <td className="py-3 px-space-md font-body-sm text-error">High (Type-2 diabetes, CAD)</td>
                    <td className="py-3 px-space-md text-right">
                      {telemetry.tierCode === 'obese-1' ? (
                        <span className="px-2.5 py-1 rounded-full bg-primary text-on-primary font-label-caps text-label-caps shadow-sm">Your Tier ({telemetry.bmi.toFixed(1)})</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-error-container text-on-error-container font-label-caps text-label-caps">High Risk</span>
                      )}
                    </td>
                  </tr>

                  {/* Obesity Class II & III */}
                  <tr className={`transition-colors ${telemetry.tierCode === 'obese-2' ? 'bg-primary/10 font-bold' : 'hover:bg-surface-container-low/50'}`}>
                    <td className="py-3 px-space-md font-body-sm font-medium text-on-surface flex items-center gap-2">
                      {telemetry.tierCode === 'obese-2' && <span className="material-symbols-outlined text-[16px] text-primary">arrow_right_alt</span>}
                      Obesity Class II &amp; III
                    </td>
                    <td className="py-3 px-space-md text-outline">≥ 35.0</td>
                    <td className="py-3 px-space-md text-outline">≥ 32.5</td>
                    <td className="py-3 px-space-md font-body-sm text-error">Very Severe / Critical</td>
                    <td className="py-3 px-space-md text-right">
                      {telemetry.tierCode === 'obese-2' ? (
                        <span className="px-2.5 py-1 rounded-full bg-primary text-on-primary font-label-caps text-label-caps shadow-sm">Your Tier ({telemetry.bmi.toFixed(1)})</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-error text-on-error font-label-caps text-label-caps">Class II/III</span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ================= SECTION 5: LOCAL CLIENT-SIDE TELEMETRY LOG & SPARKLINE ================= */}
        <section className="w-full py-space-xl bg-surface-container-low px-gutter-mobile lg:px-gutter-desktop border-y border-outline-variant/20">
          <div className="max-w-max-width-canvas mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md mb-space-lg">
              <div>
                <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider">Device Storage</span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface">Biometric History &amp; Longitudinal Trend</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Data resides strictly in your browser local sandbox. Zero telemetry transmitted externally.
                </p>
              </div>
              <div className="flex items-center gap-space-xs">
                <button
                  onClick={handleExportCsv}
                  className="px-space-md py-2 rounded-xl bg-surface-container-lowest text-on-surface font-label-caps text-label-caps shadow-sm hover:bg-surface-container-high transition-colors flex items-center gap-1.5 cursor-pointer border border-outline-variant/20"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">file_download</span>
                  Export CSV
                </button>
                <button
                  onClick={handleClearLog}
                  className="px-space-md py-2 rounded-xl bg-surface-container-lowest text-error font-label-caps text-label-caps shadow-sm hover:bg-error-container hover:text-on-error-container transition-colors flex items-center gap-1.5 cursor-pointer border border-outline-variant/20"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                  Clear Log
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
              {/* SVG Sparkline Trend Canvas (Cols 1-7) */}
              <div className="lg:col-span-7 p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/20 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-space-md">
                  <div>
                    <span className="font-label-caps text-label-caps text-outline uppercase">12-Week BMI Regression</span>
                    <div className="font-headline-md text-headline-md text-on-surface mt-0.5 font-bold">-0.9 kg/m² Progression</div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary-container/20 text-secondary font-label-caps text-label-caps font-semibold">
                    <span className="material-symbols-outlined text-[14px]">trending_down</span>
                    Favorable Velocity
                  </span>
                </div>

                {/* Inline Vector Sparkline Visualization */}
                <div className="w-full h-44 relative flex items-end">
                  <svg className="w-full h-full text-primary" fill="none" viewBox="0 0 500 150" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="bmiGradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#004ac6" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#004ac6" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {/* Grid line reference */}
                    <line stroke="#dae2fd" strokeDasharray="4 4" x1="0" x2="500" y1="40" y2="40" />
                    <line stroke="#dae2fd" strokeDasharray="4 4" x1="0" x2="500" y1="95" y2="95" />
                    <text className="fill-outline text-[10px] font-mono" x="5" y="35">25.0 (Overweight Boundary)</text>
                    <text className="fill-outline text-[10px] font-mono" x="5" y="90">24.0 (Healthy Baseline)</text>
                    {/* Gradient Fill Area */}
                    <path d="M 30 35 Q 150 70 270 85 T 470 95 L 470 145 L 30 145 Z" fill="url(#bmiGradient)" />
                    {/* Progression Curve */}
                    <path d="M 30 35 Q 150 70 270 85 T 470 95" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="3" />
                    {/* Data Points with pulsing halo */}
                    <circle className="fill-primary" cx="30" cy="35" r="4" />
                    <circle className="fill-primary" cx="160" cy="65" r="4" />
                    <circle className="fill-primary" cx="310" cy="88" r="4" />
                    <circle className="fill-primary stroke-surface-container-lowest" cx="470" cy="95" r="6" strokeWidth="2" />
                  </svg>
                </div>
                <div className="flex justify-between items-center text-[11px] font-data-mono text-outline pt-space-xs">
                  <span>Oct 14 (25.1)</span>
                  <span>Nov 28 (24.6)</span>
                  <span>Jan 15 (24.4)</span>
                  <span className="font-bold text-primary">Today ({telemetry.bmi.toFixed(1)})</span>
                </div>
              </div>

              {/* Telemetry Log Feed (Cols 8-12) */}
              <div className="lg:col-span-5 flex flex-col gap-space-xs">
                {history.length > 0 ? (
                  history.slice(0, 4).map((item, idx) => (
                    <div key={item.id} className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/20 flex items-center justify-between">
                      <div className="flex items-center gap-space-sm">
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-label-caps ${
                          idx === 0 ? 'bg-primary-fixed text-primary font-bold' : 'bg-surface-container text-on-surface-variant'
                        }`}>
                          #{history.length - idx}
                        </span>
                        <div>
                          <div className="font-body-sm text-body-sm font-semibold text-on-surface">{item.formattedDate}</div>
                          <div className="font-label-caps text-label-caps text-outline">
                            {item.heightCm} cm · {item.weightKg.toFixed(1)} kg
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-data-mono text-data-mono font-bold text-primary">{item.bmi} kg/m²</div>
                        <span className="text-[11px] text-secondary font-medium">{item.category}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-space-xl rounded-2xl bg-surface-container-lowest text-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-[36px] text-outline">history</span>
                    <p className="font-body-sm text-body-sm mt-1">No historical logs. Click &quot;Log Snapshot&quot; to begin tracking.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ================= SECTION 6: REAL-WORLD COMPARATIVE PERSONAS ================= */}
        <section className="w-full py-space-xl px-gutter-mobile lg:px-gutter-desktop">
          <div className="max-w-max-width-canvas mx-auto">
            <div className="mb-space-lg">
              <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider">Clinical Cohorts</span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface">Understanding Compositional Diversity</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Why identical numerical BMI scores can signify vastly disparate health realities.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
              {/* Persona A */}
              <div className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-md border border-outline-variant/20 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-space-sm">
                    <span className="px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface font-label-caps text-label-caps">Desk Professional</span>
                    <span className="font-data-mono text-data-mono text-primary font-bold">22.9 BMI</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-space-2xs font-bold">Marcus L. (38)</h3>
                  <p className="font-body-sm text-body-sm text-outline-variant mb-space-md">Height: 175 cm · Weight: 70 kg · Body Fat: 22%</p>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Exhibits classic normative anthropometry. BMI sits comfortably in the optimal longevity band. However, sedentary desk hours mean visceral fat requires monitoring via waist-to-hip ratio despite the green score.
                  </p>
                </div>
                <div className="mt-space-md pt-space-sm border-t border-surface-container-low flex items-center justify-between text-on-surface font-body-sm">
                  <span className="text-on-surface-variant">Diagnosis:</span>
                  <span className="font-semibold text-secondary">Normative Healthy Baseline</span>
                </div>
              </div>

              {/* Persona B */}
              <div className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-md border border-outline-variant/20 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-space-sm">
                    <span className="px-2.5 py-1 rounded-full bg-tertiary-fixed/30 text-tertiary font-label-caps text-label-caps">Strength Athlete</span>
                    <span className="font-data-mono text-data-mono text-tertiary font-bold">29.0 BMI</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-space-2xs font-bold">Elena K. (29)</h3>
                  <p className="font-body-sm text-body-sm text-outline-variant mb-space-md">Height: 180 cm · Weight: 94 kg · Body Fat: 12%</p>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Flags as &quot;Overweight (Near Class I)&quot; on conventional BMI scales due to hypertrophied skeletal muscle mass. Blood lipid panels, VO2 max, and fasting glucose demonstrate elite cardiometabolic fitness.
                  </p>
                </div>
                <div className="mt-space-md pt-space-sm border-t border-surface-container-low flex items-center justify-between text-on-surface font-body-sm">
                  <span className="text-on-surface-variant">Diagnosis:</span>
                  <span className="font-semibold text-tertiary">High FFMI / Non-Adipose Bulk</span>
                </div>
              </div>

              {/* Persona C */}
              <div className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-md border border-outline-variant/20 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-space-sm">
                    <span className="px-2.5 py-1 rounded-full bg-secondary-fixed/40 text-secondary font-label-caps text-label-caps">Marathon Competitor</span>
                    <span className="font-data-mono text-data-mono text-secondary font-bold">18.4 BMI</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-space-2xs font-bold">Sora T. (24)</h3>
                  <p className="font-body-sm text-body-sm text-outline-variant mb-space-md">Height: 168 cm · Weight: 52 kg · Body Fat: 14%</p>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Registers on the cusp of mild underweight. Highly adapted endurance physiology with minimal glycogen and fat stores. Requires clinical screening for bone mineral density and adequate caloric energy availability.
                  </p>
                </div>
                <div className="mt-space-md pt-space-sm border-t border-surface-container-low flex items-center justify-between text-on-surface font-body-sm">
                  <span className="text-on-surface-variant">Diagnosis:</span>
                  <span className="font-semibold text-secondary">Borderline Low / Monitor RED-S</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SECTION 7: MATHEMATICAL DERIVATION & 4 LIMITATIONS ================= */}
        <section className="w-full py-space-xl bg-surface-container-low px-gutter-mobile lg:px-gutter-desktop border-y border-outline-variant/20">
          <div className="max-w-max-width-canvas mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
              
              {/* Left: Mathematical Formulation */}
              <div className="lg:col-span-6 flex flex-col gap-space-md">
                <div>
                  <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider">Formula Verification</span>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface">Mathematical Foundation</h2>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                    Deterministic formulation established by Adolphe Quetelet (1832) and adopted globally by the World Health Organization.
                  </p>
                </div>

                {/* LaTeX / Formula Code Card */}
                <div className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-md border border-outline-variant/20 flex flex-col gap-space-md">
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps text-outline uppercase">Standardized Equations</span>
                    <button
                      onClick={handleCopyFormulas}
                      className="font-label-caps text-label-caps text-primary hover:underline flex items-center gap-1 cursor-pointer font-semibold"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[14px]">content_copy</span>
                      Copy Equations
                    </button>
                  </div>

                  {/* Metric Formula */}
                  <div className="p-space-md rounded-xl bg-surface-container-low font-data-mono text-data-mono text-on-surface flex flex-col gap-1 border border-outline-variant/20">
                    <span className="text-[11px] text-outline font-sans font-semibold">METRIC FORMULA (SI Standard):</span>
                    <span className="text-primary font-bold">BMI = Weight (kg) / [Height (m)]²</span>
                    <span className="text-[12px] text-on-surface-variant mt-1">Example: 75 kg / (1.78 m)² = 75 / 3.1684 = 23.67 kg/m²</span>
                  </div>

                  {/* Imperial Formula */}
                  <div className="p-space-md rounded-xl bg-surface-container-low font-data-mono text-data-mono text-on-surface flex flex-col gap-1 border border-outline-variant/20">
                    <span className="text-[11px] text-outline font-sans font-semibold">US IMPERIAL FORMULA:</span>
                    <span className="text-secondary font-bold">BMI = 703 × Weight (lbs) / [Height (in)]²</span>
                    <span className="text-[12px] text-on-surface-variant mt-1">Multiplier 703 converts lbm/in² to kg/m² (exact scalar: 703.06957964)</span>
                  </div>

                  {/* Ponderal Index Formula */}
                  <div className="p-space-md rounded-xl bg-surface-container-low font-data-mono text-data-mono text-on-surface flex flex-col gap-1 border border-outline-variant/20">
                    <span className="text-[11px] text-outline font-sans font-semibold">ROHRER&apos;S PONDERAL INDEX (Volumetric Corpulence):</span>
                    <span className="text-on-surface font-bold">PI = Weight (kg) / [Height (m)]³</span>
                    <span className="text-[12px] text-on-surface-variant mt-1">Reduces height scaling bias for extremely tall or short statures.</span>
                  </div>
                </div>
              </div>

              {/* Right: The 4 Inherent Limitations of BMI */}
              <div className="lg:col-span-6 flex flex-col gap-space-md">
                <div>
                  <span className="font-label-caps text-label-caps text-outline uppercase tracking-wider">Clinical Context</span>
                  <h3 className="font-headline-lg text-headline-lg text-on-surface">The 4 Major Limitations of BMI</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                    Why high-precision practitioners never rely on BMI as a sole diagnostic criterion.
                  </p>
                </div>

                <div className="space-y-space-sm">
                  <div className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/20 flex items-start gap-space-sm">
                    <span className="w-8 h-8 rounded-full bg-primary-fixed text-primary flex items-center justify-center font-bold text-[13px] shrink-0">1</span>
                    <div>
                      <h4 className="font-body-sm text-body-sm font-semibold text-on-surface">Adiposity Distribution Blindness</h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                        BMI cannot identify whether fat is stored subcutaneously (inert) or viscerally around organs (metabolically damaging). Pair with Waist-to-Hip Ratio.
                      </p>
                    </div>
                  </div>

                  <div className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/20 flex items-start gap-space-sm">
                    <span className="w-8 h-8 rounded-full bg-primary-fixed text-primary flex items-center justify-center font-bold text-[13px] shrink-0">2</span>
                    <div>
                      <h4 className="font-body-sm text-body-sm font-semibold text-on-surface">Musculoskeletal Mass Bias</h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                        Dense lean bone and muscle tissue weight proportionally more than fat per cubic centimeter, leading to false-positive overweight diagnoses in athletic builds.
                      </p>
                    </div>
                  </div>

                  <div className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/20 flex items-start gap-space-sm">
                    <span className="w-8 h-8 rounded-full bg-primary-fixed text-primary flex items-center justify-center font-bold text-[13px] shrink-0">3</span>
                    <div>
                      <h4 className="font-body-sm text-body-sm font-semibold text-on-surface">Sarcopenia in Aging Adults</h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                        As individuals age past 60, muscle loss (sarcopenia) often masks increases in fat tissue, resulting in &quot;normal&quot; BMI scores despite elevated cardiometabolic risk (&quot;skinny-fat&quot;).
                      </p>
                    </div>
                  </div>

                  <div className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/20 flex items-start gap-space-sm">
                    <span className="w-8 h-8 rounded-full bg-primary-fixed text-primary flex items-center justify-center font-bold text-[13px] shrink-0">4</span>
                    <div>
                      <h4 className="font-body-sm text-body-sm font-semibold text-on-surface">Geometric Scaling Discrepancies</h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                        Squaring height (H²) overestimates fatness for tall humans and underestimates it for short individuals. Nick Trefethen&apos;s Oxford formula proposed 1.3 × W / H^2.5 to rectify this geometric drift.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SECTION 8: FAQ ACCORDION ================= */}
        <section className="w-full py-space-xl px-gutter-mobile lg:px-gutter-desktop">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-space-lg">
              <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider">Evidence-Based Inquiries</span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">Frequently Asked Questions</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                Detailed answers calibrated for clinical comprehension and patient self-advocacy.
              </p>
            </div>

            <div className="space-y-space-xs">
              {[
                {
                  q: 'How accurate is BMI as an indicator of actual body fatness?',
                  a: 'BMI exhibits a correlation of roughly 0.70 to 0.80 with actual dual-energy X-ray absorptiometry (DEXA) measured fat mass across broad populations. However, its individual diagnostic accuracy varies. It acts as an outstanding initial screening heuristic rather than an absolute anatomical measurement.'
                },
                {
                  q: 'Why do Asian and South Asian populations have lower BMI cutoffs?',
                  a: 'Epidemiological research led by the WHO Expert Consultation showed that people of Asian descent generally exhibit a higher percentage of body fat, particularly dangerous visceral abdominal fat, at lower BMI levels than populations of European descent. As a result, risks for type-2 diabetes and cardiovascular events rise sharply starting at a BMI of 23.0 kg/m².'
                },
                {
                  q: 'What is the distinction between BMI and FFMI (Fat-Free Mass Index)?',
                  a: 'While BMI calculates gross mass over stature squared, FFMI isolates only fat-free mass (muscle, bone, organs, water) via the equation: FFMI = Fat-Free Mass (kg) / Height (m)². An FFMI of 19–21 is typical for natural males, whereas an FFMI above 25 rarely occurs without superior genetics or anabolic pharmacology.'
                },
                {
                  q: 'Is my health or biometric data sent to any third-party cloud server?',
                  a: 'Absolutely not. SolveIt Calculator is architected on local client-side evaluation principles. Your height, weight, age, and historical logs remain encrypted in your browser\'s private Web Storage API sandbox. We set zero behavioral tracking cookies and perform zero server telemetry pings.'
                },
                {
                  q: 'What should I do if my calculated BMI falls outside the normal range?',
                  a: 'A single metric should never induce panic. If your result is elevated or diminished, obtain an objective waist circumference measurement and schedule an annual metabolic panel (lipid spectrum, HbA1c, and resting blood pressure) with your primary physician to assess your holistic metabolic profile.'
                },
                {
                  q: 'Can you have an "overweight" or "obese" BMI and still be metabolically healthy?',
                  a: 'Yes. Individuals with substantial skeletal muscle mass and high cardiorespiratory fitness (VO2 max) can register a BMI above 25.0 or even 30.0 while exhibiting normal fasting glucose, low visceral fat, optimal lipid profiles, and healthy arterial elasticity. This is why waist-to-height ratio is recommended alongside BMI.'
                },
                {
                  q: 'What is the "New BMI" Oxford formula, and how does it correct for tall or short height?',
                  a: 'Proposed by Oxford mathematician Nick Trefethen, the formula (1.3 × Weight in kg / Height in meters^2.5) accounts for the geometric fact that three-dimensional human volume scales with height cubed rather than height squared. The standard Quetelet formula makes tall people seem fatter than they are and short people seem leaner.'
                },
                {
                  q: 'Why does standard BMI overestimate body fat in athletes and lifters?',
                  a: 'Skeletal muscle is approximately 18% denser than adipose tissue (1.06 g/cm³ for muscle vs. 0.90 g/cm³ for fat). Because standard BMI counts every kilogram of muscle identically to a kilogram of fat, resistance-trained athletes are frequently classified as "overweight" despite having single-digit body fat.'
                },
                {
                  q: 'Why is waist circumference recommended alongside BMI in clinical guidelines?',
                  a: 'Visceral abdominal fat surrounding deep internal organs produces inflammatory cytokines and free fatty acids that drain directly into the liver, driving diabetes and atherosclerosis. Measuring waist circumference detects abdominal visceral adiposity even when total body weight and BMI register in the normal range.'
                },
                {
                  q: 'How does BMI interpretation differ for children, teens, and seniors (65+)?',
                  a: 'For children and adolescents aged 2 to 19, BMI is interpreted using CDC growth chart percentiles specific to age and biological sex (underweight: <5th percentile, healthy: 5th–84th, overweight: 85th–94th, obese: ≥95th). For adults over 65, the "obesity paradox" reveals that a slightly higher BMI (25 to 27) is associated with lower all-cause mortality and protection against fracture risk.'
                }
              ].map((faq, fIdx) => {
                const isOpen = openFaqIndices.includes(fIdx);
                return (
                  <div key={fIdx} className="rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/20 overflow-hidden">
                    <button
                      onClick={() => toggleFaq(fIdx)}
                      className="w-full p-space-md text-left flex items-center justify-between gap-space-sm hover:bg-surface-container-low transition-colors cursor-pointer"
                      type="button"
                    >
                      <span className="font-body-sm text-body-sm font-semibold text-on-surface">{faq.q}</span>
                      <span
                        className={`material-symbols-outlined text-outline text-[20px] transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-primary' : ''
                        }`}
                      >
                        expand_more
                      </span>
                    </button>
                    {isOpen && (
                      <div className="p-space-md pt-0 text-on-surface-variant font-body-sm text-body-sm leading-relaxed border-t border-surface-container-low">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= SECTION 9: INTERCONNECTED HEALTH CALCULATORS (8 TOOLS) ================= */}
        <section className="w-full py-space-xl bg-surface-container-low px-gutter-mobile lg:px-gutter-desktop border-t border-outline-variant/20">
          <div className="max-w-max-width-canvas mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-space-xs mb-space-lg">
              <div>
                <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider">Health Suite</span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">Interconnected Health Calculators</h2>
              </div>
              <Link className="font-label-caps text-label-caps text-primary hover:underline flex items-center gap-1 font-semibold" href="/health">
                Browse All 48 Health Workbenches
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
              {/* Tool 1 */}
              <Link className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all group flex flex-col justify-between border border-outline-variant/20" href="/health#tdee-card">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-space-sm group-hover:bg-primary group-hover:text-on-primary transition-colors">
                    <span className="material-symbols-outlined text-[22px]">local_fire_department</span>
                  </div>
                  <h3 className="font-body-sm text-body-sm font-semibold text-on-surface">Calorie &amp; Macro Deficit</h3>
                  <p className="font-body-sm text-body-sm text-outline-variant mt-1">
                    Precision macronutrient distribution calibrated for safe weekly adipose reduction.
                  </p>
                </div>
                <div className="mt-space-md font-label-caps text-label-caps text-primary flex items-center gap-1 font-semibold">
                  Compute Energy <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                </div>
              </Link>

              {/* Tool 2 */}
              <Link className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all group flex flex-col justify-between border border-outline-variant/20" href="/health#bmr-card">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center mb-space-sm group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
                    <span className="material-symbols-outlined text-[22px]">speed</span>
                  </div>
                  <h3 className="font-body-sm text-body-sm font-semibold text-on-surface">BMR Mifflin-St Jeor</h3>
                  <p className="font-body-sm text-body-sm text-outline-variant mt-1">
                    Basal Metabolic Rate under absolute thermoneutral post-absorptive rest.
                  </p>
                </div>
                <div className="mt-space-md font-label-caps text-label-caps text-secondary flex items-center gap-1 font-semibold">
                  Calculate Basal <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                </div>
              </Link>

              {/* Tool 3 */}
              <Link className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all group flex flex-col justify-between border border-outline-variant/20" href="/health#navy-card">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-primary-fixed/50 text-primary flex items-center justify-center mb-space-sm group-hover:bg-primary group-hover:text-on-primary transition-colors">
                    <span className="material-symbols-outlined text-[22px]">straighten</span>
                  </div>
                  <h3 className="font-body-sm text-body-sm font-semibold text-on-surface">U.S. Navy Body Fat %</h3>
                  <p className="font-body-sm text-body-sm text-outline-variant mt-1">
                    Circumferential measurement algorithm utilizing neck, waist, and hip parameters.
                  </p>
                </div>
                <div className="mt-space-md font-label-caps text-label-caps text-primary flex items-center gap-1 font-semibold">
                  Estimate Body Fat <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                </div>
              </Link>

              {/* Tool 4 */}
              <Link className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all group flex flex-col justify-between border border-outline-variant/20" href="/health#water-card">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-secondary-container/30 text-secondary flex items-center justify-center mb-space-sm group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
                    <span className="material-symbols-outlined text-[22px]">water_drop</span>
                  </div>
                  <h3 className="font-body-sm text-body-sm font-semibold text-on-surface">Hydration Matrix</h3>
                  <p className="font-body-sm text-body-sm text-outline-variant mt-1">
                    Electrolyte and water volume recommendations based on climate and physical load.
                  </p>
                </div>
                <div className="mt-space-md font-label-caps text-label-caps text-secondary flex items-center gap-1 font-semibold">
                  Calculate Liters <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                </div>
              </Link>

              {/* Tool 5 */}
              <Link className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all group flex flex-col justify-between border border-outline-variant/20" href="/health#zone2-card">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-tertiary/10 text-tertiary flex items-center justify-center mb-space-sm group-hover:bg-tertiary group-hover:text-on-tertiary transition-colors">
                    <span className="material-symbols-outlined text-[22px]">favorite</span>
                  </div>
                  <h3 className="font-body-sm text-body-sm font-semibold text-on-surface">Zone 2 Heart Rate</h3>
                  <p className="font-body-sm text-body-sm text-outline-variant mt-1">
                    Mitochondrial density and fat oxidation threshold training bands (Karvonen method).
                  </p>
                </div>
                <div className="mt-space-md font-label-caps text-label-caps text-tertiary flex items-center gap-1 font-semibold">
                  Tune Zones <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                </div>
              </Link>

              {/* Tool 6 */}
              <Link className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all group flex flex-col justify-between border border-outline-variant/20" href="/health#bmi-card">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-surface-container-high text-on-surface flex items-center justify-center mb-space-sm group-hover:bg-on-surface group-hover:text-surface transition-colors">
                    <span className="material-symbols-outlined text-[22px]">balance</span>
                  </div>
                  <h3 className="font-body-sm text-body-sm font-semibold text-on-surface">Ideal Weight (Devine)</h3>
                  <p className="font-body-sm text-body-sm text-outline-variant mt-1">
                    Clinical pharmaceutical dosing baseline using Devine and Robinson formulas.
                  </p>
                </div>
                <div className="mt-space-md font-label-caps text-label-caps text-on-surface flex items-center gap-1 font-semibold">
                  Target Weight <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                </div>
              </Link>

              {/* Tool 7 */}
              <Link className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all group flex flex-col justify-between border border-outline-variant/20" href="/health">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-primary-container/20 text-primary flex items-center justify-center mb-space-sm group-hover:bg-primary group-hover:text-on-primary transition-colors">
                    <span className="material-symbols-outlined text-[22px]">bedtime</span>
                  </div>
                  <h3 className="font-body-sm text-body-sm font-semibold text-on-surface">Sleep Cycle Optimizer</h3>
                  <p className="font-body-sm text-body-sm text-outline-variant mt-1">
                    90-minute ultradian sleep architecture synchronization for circadian vigor.
                  </p>
                </div>
                <div className="mt-space-md font-label-caps text-label-caps text-primary flex items-center gap-1 font-semibold">
                  Find Bedtime <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                </div>
              </Link>

              {/* Tool 8 */}
              <Link className="p-space-md rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all group flex flex-col justify-between border border-outline-variant/20" href="/health#tdee-card">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-secondary-fixed/50 text-secondary flex items-center justify-center mb-space-sm group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
                    <span className="material-symbols-outlined text-[22px]">egg_alt</span>
                  </div>
                  <h3 className="font-body-sm text-body-sm font-semibold text-on-surface">Protein &amp; Amino Target</h3>
                  <p className="font-body-sm text-body-sm text-outline-variant mt-1">
                    Optimal leucine-threshold nitrogen balance targets for muscular synthesis.
                  </p>
                </div>
                <div className="mt-space-md font-label-caps text-label-caps text-secondary flex items-center gap-1 font-semibold">
                  Calculate Grams <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                </div>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
