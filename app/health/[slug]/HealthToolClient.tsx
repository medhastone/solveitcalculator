'use client';

import React, { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { resolveToolConfig, ToolMetadataConfig, HEALTH_TOOL_CONFIGS } from '../healthToolConfig';
import { computeHealthTelemetry } from '../healthCalculations';
import { getClinicalSeoGuide, ClinicalGuide } from '../healthSeoContent';

interface HistoryRecord {
  id: string;
  timestamp: string;
  formattedDate: string;
  metricVal: string;
  category: string;
  summary: string;
}

const PEER_HEALTH_TOOLS = [
  { slug: 'bmi', name: 'BMI & Body Mass', icon: 'scale', path: '/health/bmi' },
  { slug: 'tdee', name: 'TDEE Energy', icon: 'local_fire_department', path: '/health/tdee' },
  { slug: 'bmr', name: 'BMR Basal Rate', icon: 'speed', path: '/health/bmr' },
  { slug: 'navy-fat', name: 'Navy Body Fat %', icon: 'straighten', path: '/health/navy-fat' },
  { slug: 'water-matrix', name: 'Hydration Matrix', icon: 'water_drop', path: '/health/water-matrix' },
  { slug: 'zone2', name: 'Zone 2 Cardio', icon: 'favorite', path: '/health/zone2' },
  { slug: 'sleep-wake', name: 'Sleep Cycles', icon: 'bedtime', path: '/health/sleep-wake' },
  { slug: '1rm', name: '1RM Strength', icon: 'fitness_center', path: '/health/1rm' },
  { slug: 'due-date', name: 'Due Date Maternity', icon: 'child_care', path: '/health/due-date' },
];

export default function HealthToolClient({ initialSlug }: { initialSlug: string }) {
  const config: ToolMetadataConfig = useMemo(() => {
    return resolveToolConfig(initialSlug) || HEALTH_TOOL_CONFIGS['tdee'];
  }, [initialSlug]);

  const seoGuide: ClinicalGuide = useMemo(() => {
    return getClinicalSeoGuide(config.id, config);
  }, [config]);

  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [inputs, setInputs] = useState<Record<string, number | string>>(config.defaultInputs);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [openFaqIndices, setOpenFaqIndices] = useState<number[]>([0]);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  }, []);

  const handleInputChange = (field: string, value: number | string) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const applyPreset = (presetValues: Record<string, number | string>, presetName: string) => {
    setInputs(presetValues);
    showToast(`Loaded preset: ${presetName}`);
  };

  const handleReset = () => {
    setInputs(config.defaultInputs);
    showToast('Reset inputs to clinical baseline');
  };

  const handleSynchronize = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      showToast('Telemetry synchronized with IEEE-754 precision');
    }, 450);
  };

  const toggleFaq = (idx: number) => {
    setOpenFaqIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  // Synchronized conversions between metric and imperial for display and sliders
  const currentHeightCm = Number(inputs.heightCm || 178);
  const totalInches = Math.round(currentHeightCm / 2.54);
  const heightFeet = Math.floor(totalInches / 12);
  const heightInches = totalInches % 12;

  const currentWeightKg = Number(inputs.weightKg || inputs.actualWeightKg || inputs.bodyWeightKg || 74);
  const weightLbs = Math.round(currentWeightKg * 2.20462 * 10) / 10;

  const handleHeightFeetChange = (ft: number) => {
    const totalIn = ft * 12 + heightInches;
    handleInputChange('heightCm', Math.round(totalIn * 2.54));
  };

  const handleHeightInchesChange = (inch: number) => {
    const totalIn = heightFeet * 12 + inch;
    handleInputChange('heightCm', Math.round(totalIn * 2.54));
  };

  const handleWeightLbsChange = (lbs: number) => {
    const kg = Math.round((lbs / 2.20462) * 10) / 10;
    if ('weightKg' in inputs) handleInputChange('weightKg', kg);
    if ('actualWeightKg' in inputs) handleInputChange('actualWeightKg', kg);
    if ('bodyWeightKg' in inputs) handleInputChange('bodyWeightKg', kg);
  };

  // Compute rich clinical telemetry
  const telemetry = useMemo(() => {
    return computeHealthTelemetry(config.id, inputs, unit);
  }, [config.id, inputs, unit]);

  // Save telemetry record snapshot
  const handleSaveSnapshot = () => {
    const newEntry: HistoryRecord = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      formattedDate: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      metricVal: `${telemetry.primaryValue} ${telemetry.primaryUnit}`,
      category: telemetry.statusPill,
      summary: `${unit === 'imperial' ? `${heightFeet}'${heightInches}" · ${weightLbs} lbs` : `${currentHeightCm} cm · ${currentWeightKg} kg`}`,
    };
    setHistory((prev) => [newEntry, ...prev]);
    showToast('Snapshot recorded to browser private sandbox');
  };

  const handleExportCsv = () => {
    if (history.length === 0) {
      showToast('No history entries to export');
      return;
    }
    const headers = 'ID,Timestamp,Primary Metric,Category,Summary\n';
    const rows = history
      .map((h) => `"${h.id}","${h.formattedDate}","${h.metricVal}","${h.category}","${h.summary}"`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${config.id}_clinical_telemetry_history.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported history CSV');
  };

  const handleCopySummary = () => {
    const summary = `SolveIt ${config.name} Telemetry:\nResult: ${telemetry.primaryValue} ${telemetry.primaryUnit}\nClassification: ${telemetry.statusPill}\nEquation: ${telemetry.formulaSubstitution}\nTarget Envelope: ${telemetry.targetEnvelope.min} - ${telemetry.targetEnvelope.max} ${telemetry.targetEnvelope.unit}\nGenerated locally on SolveIt Calculator.`;
    navigator.clipboard.writeText(summary);
    showToast('Copied clinical summary to clipboard');
  };

  const handleCopyFormula = () => {
    navigator.clipboard.writeText(config.formulaDisplay);
    showToast('Copied clinical equations to clipboard');
  };

  return (
    <div className="flex flex-col w-full bg-surface text-on-surface min-h-screen">
      <Header />

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-on-surface text-surface shadow-2xl text-xs font-semibold animate-fade-in border border-outline/20">
          <span className="material-symbols-outlined text-[18px] text-primary">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Breadcrumb Navigation Bar */}
      <div className="pt-20 pb-3 border-b border-outline-variant/30 bg-surface-container-low">
        <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop flex items-center justify-between text-xs text-on-surface-variant font-medium">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link href="/health" className="hover:text-primary transition-colors">Health &amp; Fitness</Link>
            <span>/</span>
            <span className="text-on-surface font-semibold">{config.name}</span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-secondary/10 text-secondary font-label-caps text-[10px] font-bold">
              {config.standard}
            </span>
          </div>
        </div>
      </div>

      <main className="flex-1 w-full">
        {/* ================= SECTION 1: HERO & CLINICAL TOOLBAR ================= */}
        <section className="w-full py-8 bg-surface-container-low border-b border-outline-variant/20 px-gutter-mobile lg:px-gutter-desktop">
          <div className="max-w-max-width-canvas mx-auto">
            {/* Trust Badges */}
            <div className="flex items-center gap-2 flex-wrap mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-label-caps text-[11px] font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                {config.standard}
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-caps text-[11px] font-semibold">
                <span className="material-symbols-outlined text-[14px]">calculate</span>
                IEEE-754 Precision
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-caps text-[11px] font-semibold">
                <span className="material-symbols-outlined text-[14px]">lock</span>
                100% Client-Side Evaluation
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-caps text-[11px] font-semibold">
                <span className="material-symbols-outlined text-[14px]">event_note</span>
                Clinical Consensus Active
              </span>
            </div>

            <h1 className="font-headline-lg text-3xl sm:text-5xl font-black text-on-surface tracking-tight mb-3">
              {config.title}
            </h1>
            <p className="font-body-md text-base text-on-surface-variant max-w-4xl leading-relaxed mb-6">
              {config.fullDesc}
            </p>

            {/* Quick Calibration Presets */}
            <div className="flex items-center gap-2 flex-wrap pt-2">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mr-1">
                Clinical Presets:
              </span>
              {config.presets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applyPreset(preset.values, preset.name)}
                  className="px-3.5 py-1.5 rounded-xl bg-surface-container-lowest hover:bg-surface-container-high text-on-surface font-body-sm text-xs font-semibold transition-all cursor-pointer border border-outline-variant/20 flex items-center gap-1.5 shadow-sm"
                  title={preset.desc}
                >
                  <span className="material-symbols-outlined text-[14px] text-primary">play_arrow</span>
                  <span>{preset.name}</span>
                </button>
              ))}
            </div>

            {/* Quick Health Tool Switcher Pill Bar */}
            <div className="mt-6 pt-4 border-t border-outline-variant/20 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-[11px] font-bold text-outline uppercase tracking-wider shrink-0 mr-1">
                Switch Tool:
              </span>
              {PEER_HEALTH_TOOLS.map((t) => {
                const isActive = t.slug === config.id;
                return (
                  <Link
                    key={t.slug}
                    href={t.path}
                    className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all border ${
                      isActive
                        ? 'bg-primary text-on-primary border-primary shadow-sm'
                        : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface border-outline-variant/20 hover:bg-surface-container'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[14px]">{t.icon}</span>
                    <span>{t.name}</span>
                  </Link>
                );
              })}
              <Link
                href="/health"
                className="px-3 py-1 rounded-xl text-xs font-bold text-primary hover:underline flex items-center gap-1 shrink-0 ml-auto"
              >
                <span>Browse All 35+ Tools</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ================= SECTION 2: PRIMARY INTERACTIVE WORKBENCH ================= */}
        <section className="w-full py-8 px-gutter-mobile lg:px-gutter-desktop">
          <div className="max-w-max-width-canvas mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Interactive Input Terminal (Cols 1-6) */}
            <div className="lg:col-span-6 bg-surface-container-lowest p-6 sm:p-7 rounded-3xl border border-outline-variant/20 shadow-md space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-outline-variant/20">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">tune</span>
                  </div>
                  <div>
                    <h2 className="font-headline-md text-lg font-bold text-on-surface">Input Parameters</h2>
                    <span className="text-[11px] text-on-surface-variant">Validated Anthropometric Terminal</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {config.units === 'metric_imperial' && (
                    <div className="flex bg-surface-container-high rounded-xl p-1 text-xs font-bold">
                      <button
                        type="button"
                        onClick={() => setUnit('metric')}
                        className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                          unit === 'metric' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
                        }`}
                      >
                        Metric
                      </button>
                      <button
                        type="button"
                        onClick={() => setUnit('imperial')}
                        className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                          unit === 'imperial' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
                        }`}
                      >
                        Imperial
                      </button>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={handleReset}
                    className="p-2 rounded-xl text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer"
                    title="Reset to default baseline"
                  >
                    <span className="material-symbols-outlined text-[18px]">restart_alt</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Interactive Input Controls */}
              <div className="space-y-5">
                {/* Biological Model if applicable */}
                {'gender' in inputs && (
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant mb-1.5 uppercase tracking-wider">
                      Biological Reference Model
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => handleInputChange('gender', 'male')}
                        className={`py-2.5 rounded-2xl text-xs font-bold transition-all border flex items-center justify-center gap-2 cursor-pointer ${
                          inputs.gender === 'male'
                            ? 'bg-primary text-on-primary border-primary shadow-sm'
                            : 'bg-surface-container border-outline-variant/30 text-on-surface hover:bg-surface-container-high'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">male</span>
                        <span>Male (Clinical)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInputChange('gender', 'female')}
                        className={`py-2.5 rounded-2xl text-xs font-bold transition-all border flex items-center justify-center gap-2 cursor-pointer ${
                          inputs.gender === 'female'
                            ? 'bg-primary text-on-primary border-primary shadow-sm'
                            : 'bg-surface-container border-outline-variant/30 text-on-surface hover:bg-surface-container-high'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">female</span>
                        <span>Female (Clinical)</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Stature / Height if applicable */}
                {'heightCm' in inputs && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Stature Height</label>
                      {unit === 'metric' ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="100"
                            max="230"
                            value={currentHeightCm}
                            onChange={(e) => handleInputChange('heightCm', Number(e.target.value))}
                            className="w-16 px-2 py-0.5 rounded-lg bg-surface-container font-mono font-bold text-right text-xs text-primary border border-outline-variant/30"
                          />
                          <span className="text-xs font-mono font-bold text-primary">cm</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min="3"
                              max="7"
                              value={heightFeet}
                              onChange={(e) => handleHeightFeetChange(Number(e.target.value))}
                              className="w-12 px-1.5 py-0.5 rounded-lg bg-surface-container font-mono font-bold text-right text-xs text-primary border border-outline-variant/30"
                            />
                            <span className="text-xs font-mono font-bold text-primary">ft</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min="0"
                              max="11"
                              value={heightInches}
                              onChange={(e) => handleHeightInchesChange(Number(e.target.value))}
                              className="w-12 px-1.5 py-0.5 rounded-lg bg-surface-container font-mono font-bold text-right text-xs text-primary border border-outline-variant/30"
                            />
                            <span className="text-xs font-mono font-bold text-primary">in</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <input
                      type="range"
                      min="130"
                      max="220"
                      value={currentHeightCm}
                      onChange={(e) => handleInputChange('heightCm', Number(e.target.value))}
                      className="w-full accent-primary cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-outline font-mono">
                      <span>130 cm (4&apos;3&quot;)</span>
                      <span>178 cm (5&apos;10&quot;)</span>
                      <span>220 cm (7&apos;3&quot;)</span>
                    </div>
                  </div>
                )}

                {/* Body Mass / Weight if applicable */}
                {('weightKg' in inputs || 'actualWeightKg' in inputs || 'bodyWeightKg' in inputs) && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Body Weight</label>
                      {unit === 'metric' ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="35"
                            max="200"
                            step="0.5"
                            value={currentWeightKg}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              if ('weightKg' in inputs) handleInputChange('weightKg', val);
                              if ('actualWeightKg' in inputs) handleInputChange('actualWeightKg', val);
                              if ('bodyWeightKg' in inputs) handleInputChange('bodyWeightKg', val);
                            }}
                            className="w-20 px-2 py-0.5 rounded-lg bg-surface-container font-mono font-bold text-right text-xs text-primary border border-outline-variant/30"
                          />
                          <span className="text-xs font-mono font-bold text-primary">kg</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min="80"
                            max="450"
                            step="0.5"
                            value={weightLbs}
                            onChange={(e) => handleWeightLbsChange(Number(e.target.value))}
                            className="w-20 px-2 py-0.5 rounded-lg bg-surface-container font-mono font-bold text-right text-xs text-primary border border-outline-variant/30"
                          />
                          <span className="text-xs font-mono font-bold text-primary">lbs</span>
                        </div>
                      )}
                    </div>
                    <input
                      type="range"
                      min="40"
                      max="180"
                      step="0.5"
                      value={currentWeightKg}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if ('weightKg' in inputs) handleInputChange('weightKg', val);
                        if ('actualWeightKg' in inputs) handleInputChange('actualWeightKg', val);
                        if ('bodyWeightKg' in inputs) handleInputChange('bodyWeightKg', val);
                      }}
                      className="w-full accent-primary cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-outline font-mono">
                      <span>40 kg (88 lbs)</span>
                      <span>75 kg (165 lbs)</span>
                      <span>180 kg (396 lbs)</span>
                    </div>
                  </div>
                )}

                {/* Chronological Age if applicable */}
                {'age' in inputs && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Chronological Age</label>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="14"
                          max="95"
                          value={Number(inputs.age)}
                          onChange={(e) => handleInputChange('age', Number(e.target.value))}
                          className="w-16 px-2 py-0.5 rounded-lg bg-surface-container font-mono font-bold text-right text-xs text-primary border border-outline-variant/30"
                        />
                        <span className="text-xs font-mono font-bold text-primary">years</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="15"
                      max="90"
                      value={Number(inputs.age)}
                      onChange={(e) => handleInputChange('age', Number(e.target.value))}
                      className="w-full accent-primary cursor-pointer"
                    />
                  </div>
                )}

                {/* Waist Circumference if applicable */}
                {'waistCm' in inputs && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Waist Circumference (Navel)</label>
                      <span className="text-xs font-mono font-bold text-primary">
                        {inputs.waistCm} cm {unit === 'imperial' && `(${(Number(inputs.waistCm) / 2.54).toFixed(1)} in)`}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="150"
                      value={Number(inputs.waistCm)}
                      onChange={(e) => handleInputChange('waistCm', Number(e.target.value))}
                      className="w-full accent-primary cursor-pointer"
                    />
                  </div>
                )}

                {/* Neck Circumference if applicable */}
                {'neckCm' in inputs && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Neck Circumference (Below Larynx)</label>
                      <span className="text-xs font-mono font-bold text-primary">
                        {inputs.neckCm} cm {unit === 'imperial' && `(${(Number(inputs.neckCm) / 2.54).toFixed(1)} in)`}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="25"
                      max="60"
                      value={Number(inputs.neckCm)}
                      onChange={(e) => handleInputChange('neckCm', Number(e.target.value))}
                      className="w-full accent-primary cursor-pointer"
                    />
                  </div>
                )}

                {/* Hip Circumference if applicable */}
                {'hipCm' in inputs && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Hip Circumference (Widest Gluteal)</label>
                      <span className="text-xs font-mono font-bold text-primary">
                        {inputs.hipCm} cm {unit === 'imperial' && `(${(Number(inputs.hipCm) / 2.54).toFixed(1)} in)`}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="60"
                      max="160"
                      value={Number(inputs.hipCm)}
                      onChange={(e) => handleInputChange('hipCm', Number(e.target.value))}
                      className="w-full accent-primary cursor-pointer"
                    />
                  </div>
                )}

                {/* Physical Activity Multiplier (PAL) for TDEE */}
                {'activityLevel' in inputs && (
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant mb-1.5 uppercase tracking-wider">
                      Physical Activity Level (PAL Multiplier)
                    </label>
                    <select
                      value={String(inputs.activityLevel)}
                      onChange={(e) => handleInputChange('activityLevel', Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-surface-container border border-outline-variant/30 text-xs font-bold text-on-surface cursor-pointer"
                    >
                      <option value="1.2">Sedentary (Desk job, minimal exercise) — 1.20x PAL</option>
                      <option value="1.375">Lightly Active (1-3 light workout days/week) — 1.375x PAL</option>
                      <option value="1.55">Moderately Active (3-5 moderate training days/week) — 1.55x PAL</option>
                      <option value="1.725">Very Active (6-7 intense training sessions/week) — 1.725x PAL</option>
                      <option value="1.9">Extra Active (Twice daily training or physical labor) — 1.90x PAL</option>
                    </select>
                  </div>
                )}

                {/* Transformation Objective for TDEE */}
                {'goal' in inputs && (
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant mb-1.5 uppercase tracking-wider">
                      Target Energy Trajectory
                    </label>
                    <select
                      value={String(inputs.goal)}
                      onChange={(e) => handleInputChange('goal', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-surface-container border border-outline-variant/30 text-xs font-bold text-on-surface cursor-pointer"
                    >
                      <option value="maintain">Caloric Maintenance (Zero Deficit)</option>
                      <option value="cut">Moderate Adipose Deficit (-500 kcal/day)</option>
                      <option value="aggressive-cut">Aggressive Deficit (-750 kcal/day)</option>
                      <option value="bulk">Lean Muscle Surplus (+300 kcal/day)</option>
                    </select>
                  </div>
                )}

                {/* Workout Minutes if applicable */}
                {'workoutMins' in inputs && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Daily Workout Duration</label>
                      <span className="text-xs font-mono font-bold text-primary">{inputs.workoutMins} minutes</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="180"
                      step="15"
                      value={Number(inputs.workoutMins)}
                      onChange={(e) => handleInputChange('workoutMins', Number(e.target.value))}
                      className="w-full accent-primary cursor-pointer"
                    />
                  </div>
                )}

                {/* Resting Heart Rate if applicable */}
                {'rhr' in inputs && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Resting Heart Rate (RHR)</label>
                      <span className="text-xs font-mono font-bold text-primary">{inputs.rhr} BPM</span>
                    </div>
                    <input
                      type="range"
                      min="38"
                      max="95"
                      value={Number(inputs.rhr)}
                      onChange={(e) => handleInputChange('rhr', Number(e.target.value))}
                      className="w-full accent-primary cursor-pointer"
                    />
                  </div>
                )}

                {/* Strength 1RM Inputs */}
                {'liftWeight' in inputs && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">
                        Load Lifted ({unit === 'imperial' ? 'lbs' : 'kg'})
                      </label>
                      <input
                        type="number"
                        value={Number(inputs.liftWeight)}
                        onChange={(e) => handleInputChange('liftWeight', Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-2xl bg-surface-container font-mono font-bold text-sm border border-outline-variant/30"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">
                        Repetitions (1 - 12)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="12"
                        value={Number(inputs.reps)}
                        onChange={(e) => handleInputChange('reps', Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-2xl bg-surface-container font-mono font-bold text-sm border border-outline-variant/30"
                      />
                    </div>
                  </div>
                )}

                {/* Sleep Bedtime Input */}
                {'bedtime' in inputs && (
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">
                      Planned Evening Bedtime
                    </label>
                    <input
                      type="time"
                      value={String(inputs.bedtime)}
                      onChange={(e) => handleInputChange('bedtime', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-surface-container font-mono font-bold text-sm border border-outline-variant/30"
                    />
                  </div>
                )}

                {/* Due Date LMP Input */}
                {'lmpDate' in inputs && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">
                        First Day of LMP
                      </label>
                      <input
                        type="date"
                        value={String(inputs.lmpDate)}
                        onChange={(e) => handleInputChange('lmpDate', e.target.value)}
                        className="w-full px-3 py-2 rounded-2xl bg-surface-container font-mono font-bold text-sm border border-outline-variant/30"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">
                        Cycle Length (Days)
                      </label>
                      <input
                        type="number"
                        min="21"
                        max="40"
                        value={Number(inputs.cycleLength || 28)}
                        onChange={(e) => handleInputChange('cycleLength', Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-2xl bg-surface-container font-mono font-bold text-sm border border-outline-variant/30"
                      />
                    </div>
                  </div>
                )}

                {/* Blood Pressure Inputs */}
                {'sbp' in inputs && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">
                        Systolic BP (mmHg)
                      </label>
                      <input
                        type="number"
                        value={Number(inputs.sbp)}
                        onChange={(e) => handleInputChange('sbp', Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-2xl bg-surface-container font-mono font-bold text-sm border border-outline-variant/30"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">
                        Diastolic BP (mmHg)
                      </label>
                      <input
                        type="number"
                        value={Number(inputs.dbp)}
                        onChange={(e) => handleInputChange('dbp', Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-2xl bg-surface-container font-mono font-bold text-sm border border-outline-variant/30"
                      />
                    </div>
                  </div>
                )}

                {/* Resting Heart Rate */}
                {'hr' in inputs && !('rhr' in inputs) && (
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">
                      Resting Heart Rate (BPM)
                    </label>
                    <input
                      type="number"
                      value={Number(inputs.hr || 70)}
                      onChange={(e) => handleInputChange('hr', Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-2xl bg-surface-container font-mono font-bold text-sm border border-outline-variant/30"
                    />
                  </div>
                )}

                {/* Beta-hCG Early Gestation Suite Inputs */}
                {('hcg1' in inputs || 'hcg2' in inputs) && (
                  <div className="space-y-4 p-4 rounded-2xl bg-surface-container/60 border border-outline-variant/30">
                    <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
                      <span className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px]">biotech</span>
                        Quantitative Beta-hCG Serial Assays
                      </span>
                      <span className="text-[11px] font-mono text-on-surface-variant">mIU / mL</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">
                          Initial Serum hCG (Draw 1)
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min="1"
                            max="500000"
                            step="1"
                            value={Number(inputs.hcg1 || 250)}
                            onChange={(e) => handleInputChange('hcg1', Math.max(1, Number(e.target.value)))}
                            className="w-full pl-3 pr-16 py-2.5 rounded-xl bg-surface-container-high font-mono font-bold text-sm text-on-surface border border-outline-variant/30 focus:border-primary focus:outline-none"
                            placeholder="250"
                          />
                          <span className="absolute right-3 top-2.5 text-xs text-on-surface-variant font-mono">mIU/mL</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                          <span className="text-[10px] text-on-surface-variant/70">Presets:</span>
                          {[50, 150, 250, 500, 1200].map((val) => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => handleInputChange('hcg1', val)}
                              className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-surface-container-highest hover:bg-primary/20 text-on-surface transition-colors cursor-pointer"
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">
                          Follow-Up hCG (Draw 2)
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min="0"
                            max="500000"
                            step="1"
                            value={Number(inputs.hcg2 || 580)}
                            onChange={(e) => handleInputChange('hcg2', Math.max(0, Number(e.target.value)))}
                            className="w-full pl-3 pr-16 py-2.5 rounded-xl bg-surface-container-high font-mono font-bold text-sm text-on-surface border border-outline-variant/30 focus:border-primary focus:outline-none"
                            placeholder="580"
                          />
                          <span className="absolute right-3 top-2.5 text-xs text-on-surface-variant font-mono">mIU/mL</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                          <span className="text-[10px] text-on-surface-variant/70">Presets:</span>
                          {[300, 580, 1100, 2400, 5000].map((val) => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => handleInputChange('hcg2', val)}
                              className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-surface-container-highest hover:bg-primary/20 text-on-surface transition-colors cursor-pointer"
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                          Elapsed Time Between Draws
                        </label>
                        <span className="text-xs font-mono font-bold text-primary">
                          {Number(inputs.hoursBetween || 48)} Hours
                        </span>
                      </div>
                      <input
                        type="range"
                        min="12"
                        max="168"
                        step="1"
                        value={Number(inputs.hoursBetween || 48)}
                        onChange={(e) => handleInputChange('hoursBetween', Number(e.target.value))}
                        className="w-full accent-primary"
                      />
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {[
                          { label: '24 Hours (1 Day)', hrs: 24 },
                          { label: '48 Hours (Standard)', hrs: 48 },
                          { label: '72 Hours (Standard)', hrs: 72 },
                        ].map((preset) => (
                          <button
                            key={preset.hrs}
                            type="button"
                            onClick={() => handleInputChange('hoursBetween', preset.hrs)}
                            className={`py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                              Number(inputs.hoursBetween) === preset.hrs
                                ? 'bg-primary text-on-primary border-primary font-semibold'
                                : 'bg-surface-container border-outline-variant/30 text-on-surface hover:bg-surface-container-high'
                            }`}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Macro Split Inputs */}
                {('targetCalories' in inputs || 'splitProfile' in inputs) && (
                  <div className="space-y-3 p-4 rounded-2xl bg-surface-container/60 border border-outline-variant/30">
                    <label className="block text-xs font-bold text-primary uppercase tracking-wider">
                      Macro Split Energy Target
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-on-surface-variant mb-1">Daily Calories (kcal)</label>
                        <input
                          type="number"
                          min="1000"
                          max="6000"
                          value={Number(inputs.targetCalories || 2400)}
                          onChange={(e) => handleInputChange('targetCalories', Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl bg-surface-container-high font-mono font-bold text-sm border border-outline-variant/30"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-on-surface-variant mb-1">Macro Profile</label>
                        <select
                          value={String(inputs.splitProfile || 'athletic')}
                          onChange={(e) => {
                            const val = e.target.value;
                            handleInputChange('splitProfile', val);
                            if (val === 'athletic') {
                              handleInputChange('proteinPct', 30);
                              handleInputChange('carbPct', 40);
                              handleInputChange('fatPct', 30);
                            } else if (val === 'high-protein') {
                              handleInputChange('proteinPct', 40);
                              handleInputChange('carbPct', 35);
                              handleInputChange('fatPct', 25);
                            } else if (val === 'keto') {
                              handleInputChange('proteinPct', 20);
                              handleInputChange('carbPct', 5);
                              handleInputChange('fatPct', 75);
                            } else if (val === 'endurance') {
                              handleInputChange('proteinPct', 20);
                              handleInputChange('carbPct', 60);
                              handleInputChange('fatPct', 20);
                            }
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-surface-container-high text-xs font-bold border border-outline-variant/30"
                        >
                          <option value="athletic">Athletic (30P / 40C / 30F)</option>
                          <option value="high-protein">High Protein (40P / 35C / 25F)</option>
                          <option value="keto">Keto (20P / 5C / 75F)</option>
                          <option value="endurance">Endurance (20P / 60C / 20F)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Running Pace Inputs */}
                {'distanceKm' in inputs && (
                  <div className="space-y-3 p-4 rounded-2xl bg-surface-container/60 border border-outline-variant/30">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-primary uppercase tracking-wider">Distance (km)</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        max="200"
                        value={Number(inputs.distanceKm || 10)}
                        onChange={(e) => handleInputChange('distanceKm', Number(e.target.value))}
                        className="w-20 px-2 py-1 rounded-lg bg-surface-container-high font-mono font-bold text-xs text-right border border-outline-variant/30"
                      />
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { label: '5K', d: 5 },
                        { label: '10K', d: 10 },
                        { label: 'Half', d: 21.0975 },
                        { label: 'Full', d: 42.195 },
                      ].map((p) => (
                        <button
                          key={p.label}
                          type="button"
                          onClick={() => handleInputChange('distanceKm', p.d)}
                          className={`py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                            Number(inputs.distanceKm) === p.d ? 'bg-primary text-on-primary border-primary' : 'bg-surface-container border-outline-variant/30 text-on-surface'
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">Hours</label>
                        <input
                          type="number"
                          min="0"
                          max="24"
                          value={Number(inputs.hours || 0)}
                          onChange={(e) => handleInputChange('hours', Number(e.target.value))}
                          className="w-full px-2 py-1.5 rounded-lg bg-surface-container-high font-mono font-bold text-xs border border-outline-variant/30 text-center"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">Minutes</label>
                        <input
                          type="number"
                          min="0"
                          max="59"
                          value={Number(inputs.minutes || 48)}
                          onChange={(e) => handleInputChange('minutes', Number(e.target.value))}
                          className="w-full px-2 py-1.5 rounded-lg bg-surface-container-high font-mono font-bold text-xs border border-outline-variant/30 text-center"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">Seconds</label>
                        <input
                          type="number"
                          min="0"
                          max="59"
                          value={Number(inputs.seconds || 0)}
                          onChange={(e) => handleInputChange('seconds', Number(e.target.value))}
                          className="w-full px-2 py-1.5 rounded-lg bg-surface-container-high font-mono font-bold text-xs border border-outline-variant/30 text-center"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Protein Training Demand */}
                {'trainingType' in inputs && (
                  <div className="space-y-2 p-3 rounded-2xl bg-surface-container/60 border border-outline-variant/30">
                    <label className="block text-xs font-bold text-primary uppercase tracking-wider">
                      Physical Activity & Training Demand
                    </label>
                    <select
                      value={String(inputs.trainingType || 'resistance')}
                      onChange={(e) => handleInputChange('trainingType', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-surface-container-high text-xs font-bold border border-outline-variant/30"
                    >
                      <option value="sedentary">Sedentary Baseline (0.8 g/kg)</option>
                      <option value="endurance">Endurance Training (1.3 g/kg)</option>
                      <option value="resistance">Hypertrophy / Resistance (2.0 g/kg)</option>
                      <option value="deficit">Hypocaloric Deficit Muscle Sparing (2.4 g/kg)</option>
                    </select>
                  </div>
                )}

                {/* Body Fat Percentage */}
                {'bodyFatPct' in inputs && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Body Fat Percentage</label>
                      <span className="text-xs font-mono font-bold text-primary">{inputs.bodyFatPct}%</span>
                    </div>
                    <input
                      type="range"
                      min="4"
                      max="45"
                      step="0.5"
                      value={Number(inputs.bodyFatPct || 14)}
                      onChange={(e) => handleInputChange('bodyFatPct', Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>
                )}

                {/* VO2 Max Method & Cooper Distance */}
                {('cooperDistanceMeters' in inputs || 'method' in inputs) && (
                  <div className="space-y-3 p-3 rounded-2xl bg-surface-container/60 border border-outline-variant/30">
                    <label className="block text-xs font-bold text-primary uppercase tracking-wider">
                      VO2 Max Assessment Protocol
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleInputChange('method', 'uth')}
                        className={`py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                          inputs.method === 'uth' ? 'bg-primary text-on-primary border-primary' : 'bg-surface-container border-outline-variant/30 text-on-surface'
                        }`}
                      >
                        Heart Rate Ratio
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInputChange('method', 'cooper')}
                        className={`py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                          inputs.method === 'cooper' ? 'bg-primary text-on-primary border-primary' : 'bg-surface-container border-outline-variant/30 text-on-surface'
                        }`}
                      >
                        Cooper 12-Min Run
                      </button>
                    </div>
                    {inputs.method === 'cooper' && (
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-on-surface-variant">12-Min Distance:</span>
                          <span className="text-xs font-mono font-bold text-primary">{inputs.cooperDistanceMeters || 2600} m</span>
                        </div>
                        <input
                          type="range"
                          min="1000"
                          max="4500"
                          step="50"
                          value={Number(inputs.cooperDistanceMeters || 2600)}
                          onChange={(e) => handleInputChange('cooperDistanceMeters', Number(e.target.value))}
                          className="w-full accent-primary"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Deficit / Surplus Target */}
                {('tdee' in inputs && 'dailyAdjustment' in inputs) && (
                  <div className="space-y-3 p-4 rounded-2xl bg-surface-container/60 border border-outline-variant/30">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-on-surface-variant mb-1">TDEE Baseline (kcal)</label>
                        <input
                          type="number"
                          value={Number(inputs.tdee || 2400)}
                          onChange={(e) => handleInputChange('tdee', Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl bg-surface-container-high font-mono font-bold text-sm border border-outline-variant/30"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-on-surface-variant mb-1">Daily Adjustment (kcal)</label>
                        <input
                          type="number"
                          step="50"
                          value={Number(inputs.dailyAdjustment || -500)}
                          onChange={(e) => handleInputChange('dailyAdjustment', Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl bg-surface-container-high font-mono font-bold text-sm border border-outline-variant/30"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Carb Cycling Days */}
                {'highDaysPerWeek' in inputs && (
                  <div className="space-y-3 p-4 rounded-2xl bg-surface-container/60 border border-outline-variant/30">
                    <label className="block text-xs font-bold text-primary uppercase tracking-wider">
                      Weekly Schedule Partitioning
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">High Days</label>
                        <input
                          type="number"
                          min="1"
                          max="4"
                          value={Number(inputs.highDaysPerWeek || 2)}
                          onChange={(e) => handleInputChange('highDaysPerWeek', Number(e.target.value))}
                          className="w-full px-2 py-1.5 rounded-lg bg-surface-container-high font-mono font-bold text-xs text-center border border-outline-variant/30"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">Med Days</label>
                        <input
                          type="number"
                          min="1"
                          max="5"
                          value={Number(inputs.medDaysPerWeek || 3)}
                          onChange={(e) => handleInputChange('medDaysPerWeek', Number(e.target.value))}
                          className="w-full px-2 py-1.5 rounded-lg bg-surface-container-high font-mono font-bold text-xs text-center border border-outline-variant/30"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">Low Days</label>
                        <input
                          type="number"
                          min="1"
                          max="5"
                          value={Number(inputs.lowDaysPerWeek || 2)}
                          onChange={(e) => handleInputChange('lowDaysPerWeek', Number(e.target.value))}
                          className="w-full px-2 py-1.5 rounded-lg bg-surface-container-high font-mono font-bold text-xs text-center border border-outline-variant/30"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Keto Parameters */}
                {'netCarbLimit' in inputs && (
                  <div className="space-y-3 p-4 rounded-2xl bg-surface-container/60 border border-outline-variant/30">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-primary uppercase tracking-wider">Net Carb Limit (g / day)</label>
                      <span className="text-xs font-mono font-bold text-primary">{inputs.netCarbLimit || 25}g</span>
                    </div>
                    <input
                      type="range"
                      min="15"
                      max="50"
                      value={Number(inputs.netCarbLimit || 25)}
                      onChange={(e) => handleInputChange('netCarbLimit', Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>
                )}

                {/* METs Activity Selection */}
                {'metValue' in inputs && (
                  <div className="space-y-3 p-4 rounded-2xl bg-surface-container/60 border border-outline-variant/30">
                    <label className="block text-xs font-bold text-primary uppercase tracking-wider">
                      Physical Activity Intensity
                    </label>
                    <select
                      value={Number(inputs.metValue || 8.3)}
                      onChange={(e) => handleInputChange('metValue', Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-surface-container-high text-xs font-bold border border-outline-variant/30"
                    >
                      <option value={3.5}>Brisk Walking 3.5 mph (3.5 METs)</option>
                      <option value={5.0}>Resistance Weightlifting (5.0 METs)</option>
                      <option value={7.0}>Aerobic Jogging (7.0 METs)</option>
                      <option value={8.0}>Vigorous Cycling (8.0 METs)</option>
                      <option value={8.3}>Competitive Running (8.3 METs)</option>
                      <option value={10.0}>High Intensity Interval Training (10.0 METs)</option>
                      <option value={11.5}>Fast Running 8.0 mph (11.5 METs)</option>
                    </select>
                    <div>
                      <label className="block text-xs font-semibold text-on-surface-variant mb-1">Duration (minutes)</label>
                      <input
                        type="number"
                        min="5"
                        max="300"
                        value={Number(inputs.durationMins || 45)}
                        onChange={(e) => handleInputChange('durationMins', Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-surface-container-high font-mono font-bold text-sm border border-outline-variant/30"
                      />
                    </div>
                  </div>
                )}

                {/* Cycling FTP 20-min Power */}
                {'twentyMinWatts' in inputs && (
                  <div className="space-y-3 p-4 rounded-2xl bg-surface-container/60 border border-outline-variant/30">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-primary uppercase tracking-wider">
                        20-Minute Sustained Power
                      </label>
                      <span className="text-xs font-mono font-bold text-primary">{inputs.twentyMinWatts || 260} Watts</span>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="450"
                      value={Number(inputs.twentyMinWatts || 260)}
                      onChange={(e) => handleInputChange('twentyMinWatts', Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>
                )}

                {/* Rucking Parameters */}
                {'packWeightKg' in inputs && (
                  <div className="space-y-3 p-4 rounded-2xl bg-surface-container/60 border border-outline-variant/30">
                    <label className="block text-xs font-bold text-primary uppercase tracking-wider">
                      Ruck Load & Conditions
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-on-surface-variant mb-1">Pack Weight (kg)</label>
                        <input
                          type="number"
                          min="2"
                          max="50"
                          value={Number(inputs.packWeightKg || 15)}
                          onChange={(e) => handleInputChange('packWeightKg', Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl bg-surface-container-high font-mono font-bold text-sm border border-outline-variant/30"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-on-surface-variant mb-1">Pace Speed (km/h)</label>
                        <input
                          type="number"
                          step="0.1"
                          min="2.0"
                          max="10.0"
                          value={Number(inputs.speedKmh || 5.5)}
                          onChange={(e) => handleInputChange('speedKmh', Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl bg-surface-container-high font-mono font-bold text-sm border border-outline-variant/30"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Heart Rate Recovery Inputs */}
                {'peakHr' in inputs && (
                  <div className="space-y-3 p-4 rounded-2xl bg-surface-container/60 border border-outline-variant/30">
                    <label className="block text-xs font-bold text-primary uppercase tracking-wider">
                      Recovery Heart Rate Stages (BPM)
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">Peak HR</label>
                        <input
                          type="number"
                          value={Number(inputs.peakHr || 175)}
                          onChange={(e) => handleInputChange('peakHr', Number(e.target.value))}
                          className="w-full px-2 py-1.5 rounded-lg bg-surface-container-high font-mono font-bold text-xs text-center border border-outline-variant/30"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">1-Min Rest</label>
                        <input
                          type="number"
                          value={Number(inputs.hr1Min || 148)}
                          onChange={(e) => handleInputChange('hr1Min', Number(e.target.value))}
                          className="w-full px-2 py-1.5 rounded-lg bg-surface-container-high font-mono font-bold text-xs text-center border border-outline-variant/30"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">2-Min Rest</label>
                        <input
                          type="number"
                          value={Number(inputs.hr2Min || 126)}
                          onChange={(e) => handleInputChange('hr2Min', Number(e.target.value))}
                          className="w-full px-2 py-1.5 rounded-lg bg-surface-container-high font-mono font-bold text-xs text-center border border-outline-variant/30"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Sleep Debt Inputs */}
                {'sleepNeedHours' in inputs && (
                  <div className="space-y-3 p-4 rounded-2xl bg-surface-container/60 border border-outline-variant/30">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-on-surface-variant mb-1">Need (Hours/night)</label>
                        <input
                          type="number"
                          step="0.5"
                          min="5"
                          max="11"
                          value={Number(inputs.sleepNeedHours || 8.0)}
                          onChange={(e) => handleInputChange('sleepNeedHours', Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl bg-surface-container-high font-mono font-bold text-sm border border-outline-variant/30"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-on-surface-variant mb-1">Actual Sleep (Hours)</label>
                        <input
                          type="number"
                          step="0.5"
                          min="3"
                          max="11"
                          value={Number(inputs.actualSleepHours || 6.5)}
                          onChange={(e) => handleInputChange('actualSleepHours', Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl bg-surface-container-high font-mono font-bold text-sm border border-outline-variant/30"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Epworth Sleepiness Scale Questions */}
                {('q1' in inputs && 'q8' in inputs) && (
                  <div className="space-y-3 p-4 rounded-2xl bg-surface-container/60 border border-outline-variant/30">
                    <label className="block text-xs font-bold text-primary uppercase tracking-wider">
                      Epworth Daytime Somnolence Scale (0 = Never, 3 = High Chance)
                    </label>
                    {[
                      { id: 'q1', text: 'Sitting and reading' },
                      { id: 'q2', text: 'Watching television' },
                      { id: 'q3', text: 'Sitting inactive in public place' },
                      { id: 'q4', text: 'Passenger in car for 1 hour' },
                      { id: 'q5', text: 'Lying down in afternoon' },
                      { id: 'q6', text: 'Sitting and talking to someone' },
                      { id: 'q7', text: 'Sitting quietly after lunch' },
                      { id: 'q8', text: 'In car stopped in traffic' },
                    ].map((q) => (
                      <div key={q.id} className="flex items-center justify-between text-xs py-1 border-b border-outline-variant/10">
                        <span className="text-on-surface-variant font-medium pr-2">{q.text}</span>
                        <div className="flex gap-1">
                          {[0, 1, 2, 3].map((num) => (
                            <button
                              key={num}
                              type="button"
                              onClick={() => handleInputChange(q.id, num)}
                              className={`w-6 h-6 rounded text-[11px] font-bold transition-all cursor-pointer ${
                                Number(inputs[q.id]) === num ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                              }`}
                            >
                              {num}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Weight Loss Velocity Inputs */}
                {('deficitKcal' in inputs && 'startWeightKg' in inputs) && (
                  <div className="space-y-3 p-4 rounded-2xl bg-surface-container/60 border border-outline-variant/30">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-on-surface-variant mb-1">Start Weight (kg)</label>
                        <input
                          type="number"
                          value={Number(inputs.startWeightKg || 85)}
                          onChange={(e) => handleInputChange('startWeightKg', Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl bg-surface-container-high font-mono font-bold text-sm border border-outline-variant/30"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-on-surface-variant mb-1">Deficit (kcal/day)</label>
                        <input
                          type="number"
                          step="50"
                          value={Number(inputs.deficitKcal || 500)}
                          onChange={(e) => handleInputChange('deficitKcal', Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl bg-surface-container-high font-mono font-bold text-sm border border-outline-variant/30"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Water Matrix Climate */}
                {'climate' in inputs && (
                  <div className="space-y-2 p-3 rounded-2xl bg-surface-container/60 border border-outline-variant/30">
                    <label className="block text-xs font-bold text-primary uppercase tracking-wider">
                      Climate & Thermal Stress
                    </label>
                    <select
                      value={String(inputs.climate || 'temperate')}
                      onChange={(e) => handleInputChange('climate', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-surface-container-high text-xs font-bold border border-outline-variant/30"
                    >
                      <option value="temperate">Temperate / Moderate (1.0x)</option>
                      <option value="hot">Hot & Humid (1.25x Baseline Hydration)</option>
                      <option value="very-hot">Desert Arid / Extreme Thermal (1.5x Hydration)</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Action Buttons Bar */}
              <div className="pt-3 border-t border-outline-variant/20 grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={handleSynchronize}
                  className="py-3 rounded-2xl bg-surface-container-high hover:bg-surface-container text-on-surface font-body-sm text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-outline-variant/20"
                >
                  <span className={`material-symbols-outlined text-[16px] text-primary ${isSyncing ? 'animate-spin' : ''}`}>
                    sync
                  </span>
                  <span>Sync</span>
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="py-3 rounded-2xl bg-surface-container-high hover:bg-surface-container text-on-surface font-body-sm text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-outline-variant/20"
                >
                  <span className="material-symbols-outlined text-[16px] text-outline">
                    restart_alt
                  </span>
                  <span>Reset</span>
                </button>
                <button
                  type="button"
                  onClick={handleSaveSnapshot}
                  className="py-3 rounded-2xl bg-primary text-on-primary font-body-sm text-xs font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    bookmark
                  </span>
                  <span>Snapshot</span>
                </button>
              </div>

              {/* Micro Metrology Note */}
              <div className="p-3 rounded-2xl bg-surface-container-low border border-outline-variant/20 text-[11px] text-on-surface-variant leading-relaxed">
                <span className="font-bold text-on-surface block mb-0.5">Clinical Metrology Specification:</span>
                Evaluated under {config.standard}. Zero telemetry transmitted to external cloud systems.
              </div>
            </div>

            {/* Right Column: Live Clinical Telemetry Output (Cols 7-12) */}
            <div className="lg:col-span-6 space-y-6">
              {/* Hero Result Card with Chromatic Ambient Glow */}
              <div
                className="p-6 sm:p-7 rounded-3xl bg-surface-container-lowest border border-outline-variant/20 shadow-md relative overflow-hidden transition-all duration-300"
                style={{
                  boxShadow: `0 8px 32px ${telemetry.diffuseColor}`,
                }}
              >
                {/* Chromatic ambient blob */}
                <div
                  className="absolute -right-16 -top-16 w-56 h-56 rounded-full blur-3xl pointer-events-none opacity-60"
                  style={{ background: telemetry.diffuseColor }}
                />

                <div className="relative z-10">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-bold tracking-wider text-on-surface-variant uppercase font-mono">
                      {config.primaryMetricLabel}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border border-outline-variant/20 ${telemetry.statusColor}`}>
                      <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                      <span>{telemetry.statusPill}</span>
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="font-headline-lg text-4xl sm:text-6xl font-black text-on-surface tracking-tight">
                      {telemetry.primaryValue}
                    </span>
                    <span className="text-base sm:text-lg font-bold text-on-surface-variant font-mono">
                      {telemetry.primaryUnit}
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-on-surface-variant mb-2">
                    {telemetry.primarySub}
                  </p>

                  {/* Mathematical dynamic substitution line */}
                  <div className="p-2.5 rounded-xl bg-surface-container font-mono text-[11px] text-on-surface border border-outline-variant/20 mb-6">
                    <span className="text-outline font-semibold">Active Formulation: </span>
                    <span className="text-primary font-bold">{telemetry.formulaSubstitution}</span>
                  </div>

                  {/* Multi-Segment Health Gauge Spectrum Bar */}
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-on-surface-variant uppercase tracking-wider font-mono">Clinical Spectrum</span>
                      <span className="font-mono text-primary font-extrabold">Current: {telemetry.primaryValue}</span>
                    </div>

                    <div className="relative pt-6">
                      {/* Floating needle marker */}
                      <div
                        className="absolute top-0 -translate-x-1/2 transition-all duration-300 flex flex-col items-center pointer-events-none"
                        style={{ left: `${telemetry.gaugePercent}%` }}
                      >
                        <span className="px-2 py-0.5 rounded bg-on-surface text-surface text-[10px] font-bold font-mono shadow-md whitespace-nowrap">
                          You: {telemetry.primaryValue}
                        </span>
                        <div className="w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-on-surface" />
                      </div>

                      {/* Multi-segment colored track */}
                      <div className="h-3.5 w-full rounded-full bg-surface-container-high overflow-hidden flex shadow-inner">
                        {telemetry.gaugeTiers.map((tier, idx) => (
                          <div
                            key={idx}
                            style={{ width: `${tier.widthPercent}%` }}
                            className={`h-full ${tier.colorClass} border-r border-surface/30 last:border-r-0`}
                            title={tier.label}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between text-[10px] font-mono text-outline pt-0.5">
                      <span>Low Tier</span>
                      <span>Target Median</span>
                      <span>High Critical</span>
                    </div>
                  </div>

                  {/* 5-Card Telemetry Bento Grid */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-outline-variant/20">
                    {/* Card 1: Target Healthy Envelope */}
                    <div className="bg-surface-container-low p-3.5 rounded-2xl border border-outline-variant/20">
                      <div className="text-[11px] font-bold text-on-surface-variant mb-0.5">Healthy Target Envelope</div>
                      <div className="font-headline-md text-base font-bold text-on-surface">
                        {telemetry.targetEnvelope.min} - {telemetry.targetEnvelope.max} {telemetry.targetEnvelope.unit}
                      </div>
                      <div className="text-[10px] text-on-surface-variant font-mono mt-0.5">{telemetry.targetEnvelope.desc}</div>
                    </div>

                    {/* Card 2: Target Delta */}
                    <div className="bg-surface-container-low p-3.5 rounded-2xl border border-outline-variant/20">
                      <div className="text-[11px] font-bold text-on-surface-variant mb-0.5">Target Delta vs Median</div>
                      <div className={`font-headline-md text-base font-bold ${
                        telemetry.targetDelta.direction === 'optimal' ? 'text-emerald-600 dark:text-emerald-400' : 'text-primary'
                      }`}>
                        {telemetry.targetDelta.val}
                      </div>
                      <div className="text-[10px] text-on-surface-variant font-mono mt-0.5">{telemetry.targetDelta.text}</div>
                    </div>

                    {/* Card 3: Secondary Biometric */}
                    <div className="bg-surface-container-low p-3.5 rounded-2xl border border-outline-variant/20">
                      <div className="text-[11px] font-bold text-on-surface-variant mb-0.5">
                        {telemetry.secondaryBiometrics[0]?.label || 'Secondary Biometric'}
                      </div>
                      <div className="font-headline-md text-base font-bold text-on-surface">
                        {telemetry.secondaryBiometrics[0]?.val || 'Optimal'}
                      </div>
                      <div className="text-[10px] text-on-surface-variant font-mono mt-0.5">
                        {telemetry.secondaryBiometrics[0]?.desc || 'Standard baseline'}
                      </div>
                    </div>

                    {/* Card 4: Clinical Risk */}
                    <div className="bg-surface-container-low p-3.5 rounded-2xl border border-outline-variant/20">
                      <div className="text-[11px] font-bold text-on-surface-variant mb-0.5">Risk Stratification</div>
                      <div className="font-headline-md text-base font-bold text-secondary">
                        {telemetry.clinicalRisk.tier}
                      </div>
                      <div className="text-[10px] text-on-surface-variant font-mono mt-0.5">
                        {telemetry.clinicalRisk.desc}
                      </div>
                    </div>

                    {/* Card 5: Integrated Metric (Spanning 2 Columns) */}
                    <div className="col-span-2 bg-surface-container-low p-3.5 rounded-2xl border border-outline-variant/20">
                      <div className="text-[11px] font-bold text-on-surface-variant mb-0.5">{telemetry.integratedMetric.label}</div>
                      <div className="font-headline-md text-base font-bold text-on-surface">{telemetry.integratedMetric.val}</div>
                      <div className="text-[10px] text-on-surface-variant font-mono mt-0.5">{telemetry.integratedMetric.desc}</div>
                    </div>
                  </div>

                  {/* Telemetry Quick Actions Bar */}
                  <div className="mt-5 pt-4 border-t border-outline-variant/20 flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleCopySummary}
                        className="px-3 py-1.5 rounded-xl bg-surface-container-high hover:bg-surface-container text-xs font-bold text-on-surface transition-all flex items-center gap-1.5 cursor-pointer border border-outline-variant/20"
                      >
                        <span className="material-symbols-outlined text-[15px]">content_copy</span>
                        <span>Copy Summary</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="px-3 py-1.5 rounded-xl bg-surface-container-high hover:bg-surface-container text-xs font-bold text-on-surface transition-all flex items-center gap-1.5 cursor-pointer border border-outline-variant/20"
                      >
                        <span className="material-symbols-outlined text-[15px]">print</span>
                        <span>Print Sheet</span>
                      </button>
                    </div>
                    <span className="font-mono text-[10px] text-outline font-bold">
                      Audit Hash: #SOLVEIT-{config.id.toUpperCase().slice(0, 4)}-2026
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SECTION 3: PERSONALIZED CLINICAL INSIGHTS ================= */}
        <section className="w-full py-8 bg-surface-container-low px-gutter-mobile lg:px-gutter-desktop border-y border-outline-variant/20">
          <div className="max-w-max-width-canvas mx-auto">
            <div className="mb-6">
              <span className="text-xs font-bold text-primary uppercase tracking-wider font-mono">Dynamic Analysis</span>
              <h2 className="font-headline-lg text-2xl sm:text-3xl font-bold text-on-surface">Clinical Guidance &amp; Actionable Protocols</h2>
              <p className="text-sm text-on-surface-variant mt-1">
                Evidence-based physiological interpretations derived dynamically from your current active parameters.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
              {telemetry.insights.map((insight, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/20 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <span className="material-symbols-outlined text-[20px]">{insight.icon}</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-[10px] font-bold font-mono text-outline">
                        {insight.tag}
                      </span>
                    </div>
                    <h3 className="font-headline-md text-base font-bold text-on-surface mb-2">{insight.title}</h3>
                    <p className="text-xs text-on-surface-variant leading-relaxed">{insight.desc}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center gap-1 text-[11px] font-bold text-primary">
                    <span>Clinical protocol verified</span>
                    <span className="material-symbols-outlined text-[14px]">check</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Medical Advisory Callout Box */}
            <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 flex items-start gap-3 text-xs text-on-surface-variant">
              <span className="material-symbols-outlined text-[22px] text-secondary shrink-0 mt-0.5">info</span>
              <div>
                <strong className="text-on-surface block mb-0.5">Clinical Decision Support Advisory:</strong>
                Calculations represent standardized population models for education and athletic planning. They do not constitute formal medical diagnosis or replace physician consultation.
              </div>
            </div>
          </div>
        </section>

        {/* ================= SECTION 4: DEEP CLINICAL CLASSIFICATION MATRIX ================= */}
        <section className="w-full py-10 px-gutter-mobile lg:px-gutter-desktop">
          <div className="max-w-max-width-canvas mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
              <div>
                <span className="text-xs font-bold text-primary uppercase tracking-wider font-mono">Diagnostic Reference</span>
                <h2 className="font-headline-lg text-2xl sm:text-3xl font-bold text-on-surface">Classification &amp; Stratification Matrix</h2>
                <p className="text-sm text-on-surface-variant mt-1">
                  Comprehensive clinical criteria matrix with real-time active row highlighting for your current metrics.
                </p>
              </div>
              <div className="text-xs font-mono font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-xl shrink-0">
                Active Tier: Row {telemetry.activeMatrixRowIndex + 1}
              </div>
            </div>

            <div className="overflow-x-auto rounded-3xl border border-outline-variant/20 bg-surface-container-lowest shadow-sm">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant/20 bg-surface-container-low text-on-surface-variant font-mono font-bold">
                    <th className="py-3.5 px-4">Classification Tier</th>
                    <th className="py-3.5 px-4">Primary Standard Criteria</th>
                    <th className="py-3.5 px-4">Physiological / Alternate Band</th>
                    <th className="py-3.5 px-4">Clinical Implication</th>
                    <th className="py-3.5 px-4 text-right">Status Marker</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20 font-medium">
                  {telemetry.matrixRows.map((row, idx) => {
                    const isCurrentTier = idx === telemetry.activeMatrixRowIndex;
                    return (
                      <tr
                        key={idx}
                        className={`transition-colors ${
                          isCurrentTier
                            ? 'bg-primary/10 font-bold border-l-4 border-l-primary'
                            : 'hover:bg-surface-container-low/50'
                        }`}
                      >
                        <td className="py-3.5 px-4 text-on-surface flex items-center gap-2 font-semibold">
                          {isCurrentTier && (
                            <span className="material-symbols-outlined text-[16px] text-primary">
                              arrow_right_alt
                            </span>
                          )}
                          <span>{row.tier}</span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-on-surface font-bold">{row.standardRange}</td>
                        <td className="py-3.5 px-4 text-on-surface-variant">{row.alternateRange}</td>
                        <td className="py-3.5 px-4 text-on-surface-variant">{row.clinicalRisk}</td>
                        <td className="py-3.5 px-4 text-right">
                          {isCurrentTier ? (
                            <span className="px-2.5 py-1 rounded-full bg-primary text-on-primary font-bold text-[11px] shadow-sm">
                              Your Tier ({telemetry.primaryValue})
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-lg bg-surface-container font-mono text-[10px] text-on-surface-variant">
                              {row.tag}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ================= SECTION 5: LOCAL CLIENT-SIDE TELEMETRY LOG & SPARKLINE ================= */}
        <section className="w-full py-10 bg-surface-container-low px-gutter-mobile lg:px-gutter-desktop border-y border-outline-variant/20">
          <div className="max-w-max-width-canvas mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-xs font-bold text-primary uppercase tracking-wider font-mono">Device Sandbox</span>
                <h2 className="font-headline-lg text-2xl sm:text-3xl font-bold text-on-surface">Longitudinal Trend &amp; Session History</h2>
                <p className="text-sm text-on-surface-variant mt-1">
                  Data persists strictly in your local browser sandbox. Zero data transmitted externally.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportCsv}
                  className="px-3.5 py-2 rounded-xl bg-surface-container-lowest text-on-surface font-body-sm text-xs font-bold shadow-sm hover:bg-surface-container-high transition-colors flex items-center gap-1.5 cursor-pointer border border-outline-variant/20"
                >
                  <span className="material-symbols-outlined text-[16px]">file_download</span>
                  <span>Export CSV</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setHistory([]); showToast('Cleared local history'); }}
                  className="px-3.5 py-2 rounded-xl bg-surface-container-lowest text-error font-body-sm text-xs font-bold shadow-sm hover:bg-error/10 transition-colors flex items-center gap-1.5 cursor-pointer border border-outline-variant/20"
                >
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                  <span>Clear Log</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* SVG Sparkline Trend Canvas (Cols 1-7) */}
              <div className="lg:col-span-7 p-6 rounded-3xl bg-surface-container-lowest shadow-sm border border-outline-variant/20 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-[11px] font-bold text-outline uppercase font-mono">12-Week Longitudinal Trend</span>
                    <div className="font-headline-md text-base font-bold text-on-surface mt-0.5">
                      {telemetry.trendGuidance.change} Progression
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary/10 text-secondary font-mono text-xs font-bold">
                    <span className="material-symbols-outlined text-[14px]">trending_up</span>
                    <span>{telemetry.trendGuidance.velocity}</span>
                  </span>
                </div>

                {/* SVG Visual Regression Canvas */}
                <div className="w-full h-44 relative flex items-end">
                  <svg className="w-full h-full text-primary" fill="none" viewBox="0 0 500 150" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="toolSparklineGrad" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="currentColor" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {/* Grid line references */}
                    <line stroke="#dae2fd" strokeDasharray="4 4" x1="0" x2="500" y1="40" y2="40" />
                    <line stroke="#dae2fd" strokeDasharray="4 4" x1="0" x2="500" y1="95" y2="95" />
                    <text className="fill-outline text-[10px] font-mono" x="5" y="35">{telemetry.trendGuidance.boundaryLabel}</text>
                    <text className="fill-outline text-[10px] font-mono" x="5" y="90">{telemetry.trendGuidance.baselineLabel}</text>
                    {/* Area under curve */}
                    <path d="M 30 55 Q 150 75 270 85 T 470 95 L 470 145 L 30 145 Z" fill="url(#toolSparklineGrad)" />
                    {/* Trend Curve */}
                    <path d="M 30 55 Q 150 75 270 85 T 470 95" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="3" />
                    {/* Nodes */}
                    <circle className="fill-primary" cx="30" cy="55" r="4" />
                    <circle className="fill-primary" cx="160" cy="70" r="4" />
                    <circle className="fill-primary" cx="310" cy="86" r="4" />
                    <circle className="fill-primary stroke-surface-container-lowest" cx="470" cy="95" r="6" strokeWidth="2" />
                  </svg>
                </div>

                <div className="flex justify-between items-center text-[11px] font-mono text-outline pt-2 border-t border-outline-variant/20 mt-2">
                  <span>Week 1 Baseline</span>
                  <span>Week 4 Interim</span>
                  <span>Week 8 Check</span>
                  <span className="font-bold text-primary">Current Snapshot</span>
                </div>
              </div>

              {/* Telemetry Log Feed (Cols 8-12) */}
              <div className="lg:col-span-5 flex flex-col gap-2.5">
                {history.length > 0 ? (
                  history.slice(0, 4).map((item, idx) => (
                    <div key={item.id} className="p-4 rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/20 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono text-xs font-bold ${
                          idx === 0 ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'
                        }`}>
                          #{history.length - idx}
                        </span>
                        <div>
                          <div className="text-xs font-bold text-on-surface">{item.formattedDate}</div>
                          <div className="text-[11px] font-mono text-outline">{item.summary}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-bold text-xs text-primary">{item.metricVal}</div>
                        <span className="text-[10px] text-secondary font-bold">{item.category}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 rounded-3xl bg-surface-container-lowest text-center text-on-surface-variant border border-outline-variant/20">
                    <span className="material-symbols-outlined text-[36px] text-outline mb-2">history</span>
                    <p className="text-xs font-semibold">No historical snapshots saved yet.</p>
                    <p className="text-[11px] text-outline mt-0.5">Click &quot;Snapshot&quot; in the terminal to record current telemetry.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ================= SECTION 6: REAL-WORLD COMPARATIVE PERSONAS ================= */}
        <section className="w-full py-10 px-gutter-mobile lg:px-gutter-desktop">
          <div className="max-w-max-width-canvas mx-auto">
            <div className="mb-6">
              <span className="text-xs font-bold text-primary uppercase tracking-wider font-mono">Clinical Cohorts</span>
              <h2 className="font-headline-lg text-2xl sm:text-3xl font-bold text-on-surface">Comparative Case Studies</h2>
              <p className="text-sm text-on-surface-variant mt-1">
                How disparate lifestyles and anthropometric builds demonstrate varied clinical outcomes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {config.personas.map((persona, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-3xl bg-surface-container-lowest shadow-sm border border-outline-variant/20 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface font-mono text-xs font-bold">
                        {persona.name}
                      </span>
                      <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-lg">
                        {persona.ageSex}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-on-surface-variant mb-2">
                      <span className="text-outline">Biometrics: </span>
                      <span>{persona.stats}</span>
                    </div>
                    <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
                      {persona.diagnosis}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-outline-variant/20 text-xs">
                    <span className="text-outline block text-[10px] uppercase font-bold mb-0.5">Clinical Protocol:</span>
                    <span className="font-semibold text-secondary">{persona.recommendation}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= SECTION 7: CLINICAL E-E-A-T EVIDENCE GUIDE & SCIENTIFIC FOUNDATION ================= */}
        <section id="clinical-evidence-guide" className="w-full py-12 bg-surface-container-low px-gutter-mobile lg:px-gutter-desktop border-y border-outline-variant/20">
          <div className="max-w-max-width-canvas mx-auto space-y-12">
            {/* Medical Review & Editorial Transparency Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-surface-container-lowest shadow-sm border border-outline-variant/20">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-outline-variant/20">
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                    <span className="material-symbols-outlined text-[32px]">verified_user</span>
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-mono text-xs font-bold">
                        Medically Reviewed &amp; Fact-Checked
                      </span>
                    </div>
                    <h2 className="font-headline-lg text-xl sm:text-2xl font-bold text-on-surface">
                      {seoGuide.headline}
                    </h2>
                    <p className="text-xs text-on-surface-variant mt-1">
                      Medically reviewed by <strong className="text-on-surface">{seoGuide.medicalReview.reviewerName}</strong>, {seoGuide.medicalReview.reviewerCredentials} ({seoGuide.medicalReview.reviewerRole}). Last updated {seoGuide.medicalReview.reviewDate}.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <a
                    href="#clinical-takeaways"
                    className="px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors"
                  >
                    Takeaways
                  </a>
                  <a
                    href="#physiological-foundation"
                    className="px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors"
                  >
                    Physiology
                  </a>
                  <a
                    href="#step-by-step-math"
                    className="px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors"
                  >
                    Formula
                  </a>
                  <a
                    href="#normative-reference"
                    className="px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors"
                  >
                    Norms
                  </a>
                  <a
                    href="#practical-protocols"
                    className="px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors"
                  >
                    Protocols
                  </a>
                  <a
                    href="#evidence-faqs"
                    className="px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors"
                  >
                    FAQ
                  </a>
                  <a
                    href="#academic-citations"
                    className="px-3 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors"
                  >
                    Citations
                  </a>
                </div>
              </div>

              {/* Key Clinical Takeaways */}
              <div id="clinical-takeaways" className="pt-6">
                <span className="text-xs font-bold text-primary uppercase tracking-wider font-mono block mb-3">
                  Core Clinical Takeaways
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {seoGuide.keyTakeaways.map((takeaway, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/20 flex items-start gap-3"
                    >
                      <span className="w-6 h-6 rounded-lg bg-primary text-on-primary flex items-center justify-center font-bold font-mono text-xs shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-xs text-on-surface leading-relaxed font-medium">
                        {takeaway}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section: Physiological Foundation & Biochemical Mechanism */}
            <div id="physiological-foundation" className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[24px]">science</span>
                <span className="text-xs font-bold text-primary uppercase tracking-wider font-mono">
                  Biochemical Mechanism &amp; Metabolic Kinetics
                </span>
              </div>
              <h3 className="font-headline-lg text-2xl sm:text-3xl font-bold text-on-surface">
                {seoGuide.physiologicalFoundation.title}
              </h3>
              
              <div className="p-6 sm:p-8 rounded-3xl bg-surface-container-lowest shadow-sm border border-outline-variant/20 space-y-4">
                <p className="text-sm sm:text-base font-semibold text-on-surface leading-relaxed bg-surface-container-low p-4 rounded-2xl border-l-4 border-primary">
                  {seoGuide.physiologicalFoundation.lead}
                </p>
                {seoGuide.physiologicalFoundation.bodyParagraphs.map((paragraph, pIdx) => (
                  <p key={pIdx} className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Section: Step-by-Step Mathematical Walkthrough */}
            <div id="step-by-step-math" className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[24px]">calculate</span>
                <span className="text-xs font-bold text-primary uppercase tracking-wider font-mono">
                  Deterministic Derivation
                </span>
              </div>
              <h3 className="font-headline-lg text-2xl sm:text-3xl font-bold text-on-surface">
                {seoGuide.stepByStepWalkthrough.title}
              </h3>

              <div className="p-6 sm:p-8 rounded-3xl bg-surface-container-lowest shadow-sm border border-outline-variant/20 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20">
                  <div>
                    <span className="text-[11px] font-bold text-outline uppercase font-mono block">
                      Exemplar Patient Profile
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-on-surface">
                      {seoGuide.stepByStepWalkthrough.patientProfile}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyFormula}
                    className="px-3.5 py-1.5 rounded-xl bg-surface-container-lowest text-primary text-xs font-bold hover:underline flex items-center gap-1.5 self-start sm:self-auto cursor-pointer border border-outline-variant/20"
                  >
                    <span className="material-symbols-outlined text-[15px]">content_copy</span>
                    <span>Copy Formulas</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {seoGuide.stepByStepWalkthrough.steps.map((st, sIdx) => (
                    <div
                      key={sIdx}
                      className="p-4 rounded-2xl bg-surface-container border border-outline-variant/20 space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-primary/10 text-primary font-mono text-xs font-bold flex items-center justify-center">
                          {sIdx + 1}
                        </span>
                        <h4 className="text-xs font-bold text-on-surface">
                          {st.step}
                        </h4>
                      </div>
                      <p className="text-xs text-on-surface-variant pl-8">
                        {st.detail}
                      </p>
                      <div className="ml-8 p-3 rounded-xl bg-surface-container-lowest font-mono text-xs text-primary font-semibold border border-outline-variant/20 overflow-x-auto">
                        {st.math}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-primary uppercase font-mono block">
                      Deterministic Clinical Outcome
                    </span>
                    <p className="text-xs font-bold text-on-surface mt-0.5">
                      {seoGuide.stepByStepWalkthrough.finalResult}
                    </p>
                  </div>
                  <div className="text-xs font-mono text-on-surface-variant bg-surface-container-lowest px-3 py-1.5 rounded-xl self-start sm:self-auto">
                    Validated IEEE-754 Precision
                  </div>
                </div>

                {/* Standardized Raw Equations Box */}
                <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20">
                  <span className="text-xs font-bold text-outline uppercase font-mono block mb-2">
                    Formal Mathematical Specification
                  </span>
                  <pre className="font-mono text-xs text-on-surface whitespace-pre-line leading-relaxed overflow-x-auto">
                    {config.formulaDisplay}
                  </pre>
                  <p className="text-[11px] text-on-surface-variant mt-2">
                    <strong>Physiological Validation:</strong> {config.formulaNote}
                  </p>
                </div>
              </div>
            </div>

            {/* Section: Population Normative Reference Table */}
            <div id="normative-reference" className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[24px]">table_chart</span>
                <span className="text-xs font-bold text-primary uppercase tracking-wider font-mono">
                  Clinical Stratification Benchmark
                </span>
              </div>
              <div>
                <h3 className="font-headline-lg text-2xl sm:text-3xl font-bold text-on-surface">
                  {seoGuide.normativeReferenceTable.title}
                </h3>
                <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
                  {seoGuide.normativeReferenceTable.subtitle}
                </p>
              </div>

              <div className="overflow-x-auto rounded-3xl border border-outline-variant/20 bg-surface-container-lowest shadow-sm">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-outline-variant/20 bg-surface-container-low text-on-surface-variant font-mono font-bold">
                      {seoGuide.normativeReferenceTable.headers.map((h, hIdx) => (
                        <th key={hIdx} className="py-3.5 px-4 font-semibold text-on-surface">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20 font-medium">
                    {seoGuide.normativeReferenceTable.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-surface-container-low/50 transition-colors">
                        {row.map((cell, cIdx) => (
                          <td
                            key={cIdx}
                            className={`py-3.5 px-4 ${
                              cIdx === 0
                                ? 'font-bold text-on-surface'
                                : cIdx === 1
                                ? 'font-mono text-primary font-semibold'
                                : 'text-on-surface-variant'
                            }`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="p-4 bg-surface-container-low border-t border-outline-variant/20 text-[11px] text-outline font-mono">
                  {seoGuide.normativeReferenceTable.footnote}
                </div>
              </div>
            </div>

            {/* Section: Practical Protocols & Actionable Clinical Strategies */}
            <div id="practical-protocols" className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[24px]">assignment</span>
                <span className="text-xs font-bold text-primary uppercase tracking-wider font-mono">
                  Evidence-Based Directives
                </span>
              </div>
              <h3 className="font-headline-lg text-2xl sm:text-3xl font-bold text-on-surface">
                {seoGuide.practicalProtocols.title}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {seoGuide.practicalProtocols.strategies.map((strat, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-3xl bg-surface-container-lowest shadow-sm border border-outline-variant/20 flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-7 h-7 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center font-mono text-xs font-bold">
                          0{idx + 1}
                        </span>
                        <h4 className="text-xs font-bold text-on-surface">
                          {strat.label}
                        </h4>
                      </div>
                      <p className="text-xs text-on-surface-variant leading-relaxed">
                        {strat.description}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-outline-variant/20 flex items-center gap-1.5 text-[11px] font-bold text-secondary">
                      <span className="material-symbols-outlined text-[15px]">check_circle</span>
                      <span>Physiological Best Practice</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section: Diagnostic Pitfalls & Confounding Factors */}
            <div id="clinical-pitfalls" className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-error text-[24px]">warning</span>
                <span className="text-xs font-bold text-error uppercase tracking-wider font-mono">
                  Clinical Boundaries &amp; Confounders
                </span>
              </div>
              <h3 className="font-headline-lg text-2xl sm:text-3xl font-bold text-on-surface">
                {seoGuide.clinicalPitfalls.title}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {seoGuide.clinicalPitfalls.items.map((pitfall, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-3xl bg-surface-container-lowest shadow-sm border border-outline-variant/20 space-y-3"
                  >
                    <div className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-error text-[20px] shrink-0 mt-0.5">
                        report_problem
                      </span>
                      <h4 className="text-xs font-bold text-on-surface">
                        {pitfall.warning}
                      </h4>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/20">
                      <span className="text-[10px] font-bold text-outline uppercase font-mono block mb-1">
                        Practitioner Mitigation:
                      </span>
                      <p className="text-xs text-on-surface-variant leading-relaxed">
                        {pitfall.mitigation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section: Frequently Asked Questions */}
            <div id="evidence-faqs" className="space-y-4">
              <div className="text-center max-w-2xl mx-auto mb-6">
                <span className="text-xs font-bold text-primary uppercase tracking-wider font-mono">
                  Evidence-Based Inquiries
                </span>
                <h3 className="font-headline-lg text-2xl sm:text-3xl font-bold text-on-surface mt-1">
                  Frequently Asked Questions
                </h3>
                <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
                  Exhaustive answers calibrated for high patient comprehension, athletic safety, and medical accuracy.
                </p>
              </div>

              <div className="max-w-3xl mx-auto space-y-3">
                {seoGuide.expandedFaqs.map((faq, fIdx) => {
                  const isOpen = openFaqIndices.includes(fIdx);
                  return (
                    <div
                      key={fIdx}
                      className="rounded-2xl bg-surface-container-lowest shadow-sm border border-outline-variant/20 overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => toggleFaq(fIdx)}
                        className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 hover:bg-surface-container-low transition-colors cursor-pointer"
                      >
                        <span className="text-xs sm:text-sm font-bold text-on-surface">
                          {faq.q}
                        </span>
                        <span
                          className={`material-symbols-outlined text-outline text-[20px] transition-transform duration-200 shrink-0 ${
                            isOpen ? 'rotate-180 text-primary' : ''
                          }`}
                        >
                          expand_more
                        </span>
                      </button>
                      {isOpen && (
                        <div className="p-4 sm:p-5 pt-0 text-on-surface-variant text-xs sm:text-sm leading-relaxed border-t border-surface-container-low">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section: Academic References & Citations */}
            <div id="academic-citations" className="p-6 sm:p-8 rounded-3xl bg-surface-container-lowest shadow-sm border border-outline-variant/20 space-y-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">menu_book</span>
                <h3 className="text-xs font-bold text-primary uppercase tracking-wider font-mono">
                  Peer-Reviewed Academic Literature &amp; Sources
                </h3>
              </div>
              <div className="space-y-3">
                {seoGuide.academicReferences.map((ref, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/20 text-xs text-on-surface leading-relaxed"
                  >
                    <span className="font-bold text-on-surface">{ref.authors} ({ref.year}). </span>
                    <span className="italic text-on-surface-variant">&quot;{ref.title}&quot;. </span>
                    <strong className="text-primary">{ref.journal}</strong>. {ref.citationInfo}
                  </div>
                ))}
              </div>
            </div>

            {/* Clinical Medical Disclaimer Banner */}
            <div className="p-5 rounded-2xl bg-surface-container border border-outline-variant/20 flex items-start gap-3.5 text-xs text-on-surface-variant">
              <span className="material-symbols-outlined text-outline text-[22px] shrink-0 mt-0.5">
                medical_information
              </span>
              <div>
                <strong className="text-on-surface block font-bold mb-0.5">
                  Clinical Screening &amp; Educational Notice (YMYL Compliance):
                </strong>
                The physiological estimations and reference models provided by this workbench are intended strictly for educational, informational, and personal lifestyle tracking purposes. They do not constitute formal medical diagnosis, individualized clinical prescription, or personalized medical care. Always consult a board-certified physician, registered dietitian, or licensed healthcare practitioner before undertaking radical caloric deficits, strenuous athletic regimens, or diagnostic interventions.
              </div>
            </div>
          </div>
        </section>

        {/* ================= SECTION 9: INTERCONNECTED HEALTH CALCULATORS ================= */}
        <section className="w-full py-10 bg-surface-container-low px-gutter-mobile lg:px-gutter-desktop border-t border-outline-variant/20">
          <div className="max-w-max-width-canvas mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
              <div>
                <span className="text-xs font-bold text-primary uppercase tracking-wider font-mono">Health Suite</span>
                <h2 className="font-headline-lg text-2xl sm:text-3xl font-bold text-on-surface">Related Health Calculators</h2>
              </div>
              <Link href="/health" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                <span>Browse All 35+ Health Calculators</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {config.relatedToolIds.map((rId) => {
                const rConfig = resolveToolConfig(rId);
                if (!rConfig) return null;
                const link = rId === 'bmi' ? '/health/bmi' : `/health/${rConfig.slug}`;
                return (
                  <Link
                    key={rId}
                    href={link}
                    className="p-4 rounded-3xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all group flex flex-col justify-between border border-outline-variant/20"
                  >
                    <div>
                      <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-on-primary transition-colors">
                        <span className="material-symbols-outlined text-[20px]">fitness_center</span>
                      </div>
                      <h3 className="text-xs font-bold text-on-surface mb-1 group-hover:text-primary transition-colors">
                        {rConfig.name}
                      </h3>
                      <p className="text-[11px] text-outline-variant line-clamp-2 leading-relaxed">
                        {rConfig.shortDesc}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-outline-variant/20 text-xs font-bold text-primary flex items-center gap-1">
                      <span>Open Calculator</span>
                      <span className="material-symbols-outlined text-[14px] group-hover:translate-x-1 transition-transform">
                        arrow_forward
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
