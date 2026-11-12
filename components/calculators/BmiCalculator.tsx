'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Calculator, RotateCcw, AlertCircle, Activity, Flame, Scale, Heart } from 'lucide-react';
import SingleCalculatorPageShell, {
  RelatedCalculatorLink,
} from '@/components/calculator-page/SingleCalculatorPageShell';

export type HealthCalcMode = 'bmi' | 'tdee' | 'bmr' | 'ideal-weight' | 'body-fat';

const HEALTH_MODES: { id: HealthCalcMode; label: string; shortLabel: string }[] = [
  { id: 'bmi', label: 'BMI (Body Mass Index)', shortLabel: 'BMI' },
  { id: 'tdee', label: 'Daily Calorie & TDEE', shortLabel: 'TDEE & Calories' },
  { id: 'bmr', label: 'Basal Metabolic Rate (BMR)', shortLabel: 'BMR' },
  { id: 'ideal-weight', label: 'Ideal & Healthy Weight', shortLabel: 'Ideal Weight' },
  { id: 'body-fat', label: 'Body Fat % (U.S. Navy)', shortLabel: 'Body Fat %' },
];

const ACTIVITY_LEVELS = [
  { value: 1.2, label: 'Sedentary (desk job, little or no exercise)' },
  { value: 1.375, label: 'Lightly Active (light exercise 1–3 days/week)' },
  { value: 1.55, label: 'Moderately Active (moderate exercise 3–5 days/week)' },
  { value: 1.725, label: 'Very Active (hard training 6–7 days/week)' },
  { value: 1.9, label: 'Extra Active (intense daily training or physical job)' },
];

const HEALTH_RELATED_LINKS: RelatedCalculatorLink[] = [
  {
    name: 'BMI Calculator (Body Mass Index)',
    description: 'Check your adult BMI score and WHO healthy weight classification.',
    href: '/bmi-calculator',
    iconVariant: 'scale-teal',
  },
  {
    name: 'TDEE & Daily Calorie Calculator',
    description: 'Calculate Total Daily Energy Expenditure for maintenance, fat loss, or muscle gain.',
    href: '/tdee-calculator',
    iconVariant: 'percent-coral',
  },
  {
    name: 'BMR Calculator (Basal Metabolic Rate)',
    description: 'Find your daily resting calorie burn via Mifflin-St Jeor and Harris-Benedict formulas.',
    href: '/bmr-calculator',
    iconVariant: 'clock-indigo',
  },
  {
    name: 'Body Fat Percentage Calculator',
    description: 'Estimate body fat percentage and lean mass using the U.S. Navy circumference method.',
    href: '/body-fat-calculator',
    iconVariant: 'arrows-blue',
  },
  {
    name: 'Ideal Weight Calculator',
    description: 'Compare healthy target weight ranges using Devine, Robinson, Miller, and WHO formulas.',
    href: '/ideal-weight-calculator',
    iconVariant: 'chart-green',
  },
];

export interface BmiCalculatorProps {
  initialMode?: HealthCalcMode;
  customTitle?: string;
  customSubtitle?: string;
  customHeroSymbol?: string;
}

export default function BmiCalculator({
  initialMode = 'bmi',
  customTitle,
  customSubtitle,
  customHeroSymbol,
}: BmiCalculatorProps = {}) {
  const [mode, setMode] = useState<HealthCalcMode>(initialMode);
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');
  const [sex, setSex] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<number>(30);

  // Metric inputs
  const [weightKg, setWeightKg] = useState<number>(70);
  const [heightCm, setHeightCm] = useState<number>(175);
  const [neckCm, setNeckCm] = useState<number>(38);
  const [waistCm, setWaistCm] = useState<number>(84);
  const [hipCm, setHipCm] = useState<number>(96);

  // Imperial inputs
  const [weightLbs, setWeightLbs] = useState<number>(165);
  const [heightInchesTotal, setHeightInchesTotal] = useState<number>(70);
  const [neckIn, setNeckIn] = useState<number>(15);
  const [waistIn, setWaistIn] = useState<number>(33);
  const [hipIn, setHipIn] = useState<number>(38);

  // Activity multiplier for TDEE
  const [activityFactor, setActivityFactor] = useState<number>(1.55);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const modeParam = params.get('mode') as HealthCalcMode | null;
    if (modeParam && HEALTH_MODES.some((m) => m.id === modeParam)) {
      setMode(modeParam);
    }
  }, []);

  const handleModeChange = (nextMode: HealthCalcMode) => {
    setMode(nextMode);
  };

  // Standardized metric conversions for shared formulas
  const effectiveKg = unitSystem === 'metric' ? Math.max(20, weightKg) : Math.max(20, weightLbs * 0.45359237);
  const effectiveCm = unitSystem === 'metric' ? Math.max(80, heightCm) : Math.max(80, heightInchesTotal * 2.54);
  const effectiveIn = effectiveCm / 2.54;
  const safeAge = Math.min(120, Math.max(15, age));

  const calculation = useMemo(() => {
    const hMeters = effectiveCm / 100;
    const bmi = effectiveKg / (hMeters * hMeters);
    const minKg = 18.5 * hMeters * hMeters;
    const maxKg = 24.9 * hMeters * hMeters;
    const minLbs = minKg * 2.20462262;
    const maxLbs = maxKg * 2.20462262;

    const healthyRange =
      unitSystem === 'metric'
        ? `${minKg.toFixed(1)} kg – ${maxKg.toFixed(1)} kg`
        : `${minLbs.toFixed(0)} lbs – ${maxLbs.toFixed(0)} lbs`;

    let bmiCategory = 'Normal weight';
    if (bmi < 18.5) bmiCategory = 'Underweight';
    else if (bmi < 25) bmiCategory = 'Normal weight';
    else if (bmi < 30) bmiCategory = 'Overweight';
    else bmiCategory = 'Obesity';

    // Mifflin-St Jeor BMR
    const s = sex === 'male' ? 5 : -161;
    const bmrMifflin = 10 * effectiveKg + 6.25 * effectiveCm - 5 * safeAge + s;

    // Revised Harris-Benedict BMR (1984)
    const bmrHarris =
      sex === 'male'
        ? 88.362 + 13.397 * effectiveKg + 4.799 * effectiveCm - 5.677 * safeAge
        : 447.593 + 9.247 * effectiveKg + 3.098 * effectiveCm - 4.33 * safeAge;

    const tdee = bmrMifflin * activityFactor;

    // Ideal Body Weight formulas (for heights >= 60 inches / 5 feet)
    const inchesOver5Ft = Math.max(0, effectiveIn - 60);
    const devineKg = (sex === 'male' ? 50 : 45.5) + 2.3 * inchesOver5Ft;
    const robinsonKg = (sex === 'male' ? 52 : 49) + (sex === 'male' ? 1.9 : 1.7) * inchesOver5Ft;
    const millerKg = (sex === 'male' ? 56.2 : 53.1) + (sex === 'male' ? 1.41 : 1.36) * inchesOver5Ft;

    const formatWeight = (kgVal: number) =>
      unitSystem === 'metric'
        ? `${kgVal.toFixed(1)} kg`
        : `${(kgVal * 2.20462262).toFixed(0)} lbs`;

    // U.S. Navy Body Fat Percentage
    const effNeckCm = unitSystem === 'metric' ? Math.max(20, neckCm) : Math.max(20, neckIn * 2.54);
    const effWaistCm = unitSystem === 'metric' ? Math.max(40, waistCm) : Math.max(40, waistIn * 2.54);
    const effHipCm = unitSystem === 'metric' ? Math.max(40, hipCm) : Math.max(40, hipIn * 2.54);

    let bodyFatPct = 0;
    let bodyFatError: string | null = null;

    if (sex === 'male') {
      const diff = effWaistCm - effNeckCm;
      if (diff <= 2) {
        bodyFatError = 'Waist circumference must be greater than neck circumference for the U.S. Navy formula.';
      } else {
        const denom = 1.0324 - 0.19077 * Math.log10(diff) + 0.15456 * Math.log10(effectiveCm);
        bodyFatPct = Math.max(2, Math.min(65, 495 / denom - 450));
      }
    } else {
      const diff = effWaistCm + effHipCm - effNeckCm;
      if (diff <= 5) {
        bodyFatError = 'Waist + hip circumference must exceed neck circumference for the U.S. Navy formula.';
      } else {
        const denom = 1.29579 - 0.35004 * Math.log10(diff) + 0.221 * Math.log10(effectiveCm);
        bodyFatPct = Math.max(5, Math.min(65, 495 / denom - 450));
      }
    }

    const fatMassKg = effectiveKg * (bodyFatPct / 100);
    const leanMassKg = Math.max(0, effectiveKg - fatMassKg);

    let bfCategory = 'Fitness';
    if (sex === 'male') {
      if (bodyFatPct < 6) bfCategory = 'Essential Fat';
      else if (bodyFatPct < 14) bfCategory = 'Athletes';
      else if (bodyFatPct < 18) bfCategory = 'Fitness';
      else if (bodyFatPct < 25) bfCategory = 'Average / Acceptable';
      else bfCategory = 'Obesity Range';
    } else {
      if (bodyFatPct < 14) bfCategory = 'Essential Fat';
      else if (bodyFatPct < 21) bfCategory = 'Athletes';
      else if (bodyFatPct < 25) bfCategory = 'Fitness';
      else if (bodyFatPct < 32) bfCategory = 'Average / Acceptable';
      else bfCategory = 'Obesity Range';
    }

    return {
      bmi: Number(bmi.toFixed(1)),
      bmiCategory,
      healthyRange,
      bmiEquation:
        unitSystem === 'metric'
          ? `${bmi.toFixed(1)} = ${weightKg} ÷ (${hMeters.toFixed(2)} × ${hMeters.toFixed(2)})`
          : `${bmi.toFixed(1)} = 703 × ${weightLbs} ÷ (${heightInchesTotal} × ${heightInchesTotal})`,
      bmrMifflin: Math.round(bmrMifflin),
      bmrHarris: Math.round(bmrHarris),
      tdee: Math.round(tdee),
      loseMild: Math.max(1200, Math.round(tdee - 250)),
      loseStandard: Math.max(1200, Math.round(tdee - 500)),
      gainMild: Math.round(tdee + 300),
      devineFormatted: formatWeight(devineKg),
      robinsonFormatted: formatWeight(robinsonKg),
      millerFormatted: formatWeight(millerKg),
      bodyFatPct: Number(bodyFatPct.toFixed(1)),
      bodyFatError,
      bfCategory,
      fatMassFormatted: formatWeight(fatMassKg),
      leanMassFormatted: formatWeight(leanMassKg),
    };
  }, [
    unitSystem,
    sex,
    safeAge,
    effectiveKg,
    effectiveCm,
    effectiveIn,
    weightKg,
    weightLbs,
    heightInchesTotal,
    activityFactor,
    neckCm,
    waistCm,
    hipCm,
    neckIn,
    waistIn,
    hipIn,
  ]);

  const handleReset = () => {
    setUnitSystem('metric');
    setSex('male');
    setAge(30);
    setWeightKg(70);
    setHeightCm(175);
    setWeightLbs(165);
    setHeightInchesTotal(70);
    setActivityFactor(1.55);
    setNeckCm(38);
    setWaistCm(84);
    setHipCm(96);
    setNeckIn(15);
    setWaistIn(33);
    setHipIn(38);
  };

  const activeResultCard = useMemo(() => {
    if (mode === 'tdee') {
      return {
        promptSummary: 'Maintenance Calories (TDEE)',
        promptSuffix: 'per day:',
        mainValue: `${calculation.tdee.toLocaleString()} kcal / day`,
        equation: `TDEE = ${calculation.bmrMifflin} kcal (BMR) × ${activityFactor} (Activity Multiplier)`,
        secondaryNote: `Weight Loss (-500 kcal): ${calculation.loseStandard.toLocaleString()} kcal/day | Lean Gain (+300 kcal): ${calculation.gainMild.toLocaleString()} kcal/day`,
      };
    }
    if (mode === 'bmr') {
      return {
        promptSummary: 'Basal Metabolic Rate (Mifflin-St Jeor)',
        promptSuffix: 'at rest:',
        mainValue: `${calculation.bmrMifflin.toLocaleString()} kcal / day`,
        equation: `10×${effectiveKg.toFixed(1)}kg + 6.25×${effectiveCm.toFixed(0)}cm - 5×${safeAge}y ${sex === 'male' ? '+ 5' : '- 161'} = ${calculation.bmrMifflin} kcal`,
        secondaryNote: `Revised Harris-Benedict BMR comparison: ${calculation.bmrHarris.toLocaleString()} kcal/day`,
      };
    }
    if (mode === 'ideal-weight') {
      return {
        promptSummary: 'WHO Healthy Weight Range (BMI 18.5–24.9)',
        promptSuffix: 'is:',
        mainValue: calculation.healthyRange,
        equation: `Devine Formula: ${calculation.devineFormatted} | Robinson: ${calculation.robinsonFormatted} | Miller: ${calculation.millerFormatted}`,
        secondaryNote: `Your current BMI is ${calculation.bmi} kg/m² (${calculation.bmiCategory}).`,
      };
    }
    if (mode === 'body-fat') {
      if (calculation.bodyFatError) {
        return {
          promptSummary: 'Input Check Required',
          promptSuffix: '',
          mainValue: 'Check Measurements',
          equation: calculation.bodyFatError,
          secondaryNote: 'Please verify waist and neck circumference values.',
        };
      }
      return {
        promptSummary: `Estimated Body Fat (${calculation.bfCategory})`,
        promptSuffix: 'is:',
        mainValue: `${calculation.bodyFatPct}%`,
        equation: `Lean Body Mass: ${calculation.leanMassFormatted} | Fat Mass: ${calculation.fatMassFormatted}`,
        secondaryNote: `Calculated via U.S. Navy Circumference Method for ${sex === 'male' ? 'adult men' : 'adult women'}.`,
      };
    }
    return {
      promptSummary: `BMI (${calculation.bmiCategory})`,
      promptSuffix: 'is:',
      mainValue: `${calculation.bmi} kg/m²`,
      equation: calculation.bmiEquation,
      secondaryNote: `Healthy weight range for your height: ${calculation.healthyRange}`,
    };
  }, [mode, calculation, activityFactor, effectiveKg, effectiveCm, safeAge, sex]);

  const calculatorCard = (
    <section
      id="calculator"
      aria-label="Health & Fitness Calculator input panel"
      className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-7 shadow-2xs space-y-6"
    >
      {/* Mode Selector Tabs */}
      <div>
        <label className="block text-xs font-extrabold uppercase tracking-wider text-[#64748B] mb-2">
          Select Health & Fitness Calculator Mode
        </label>
        <div
          role="tablist"
          aria-label="Health calculator modes"
          className="grid grid-cols-2 sm:grid-cols-5 gap-2"
        >
          {HEALTH_MODES.map((m) => {
            const active = mode === m.id;
            return (
              <button
                key={m.id}
                role="tab"
                aria-selected={active}
                type="button"
                onClick={() => handleModeChange(m.id)}
                className={`px-3 py-2.5 rounded-xl text-xs font-extrabold border transition-all cursor-pointer text-center ${
                  active
                    ? 'bg-[#2457D6] text-white border-[#2457D6] shadow-2xs'
                    : 'bg-[#F8FAFC] text-[#334155] border-[#CBD5E1] hover:border-[#2457D6]'
                }`}
              >
                {m.shortLabel}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 pt-1 border-t border-[#E2E8F0]">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#EBF2FF] text-[#2457D6] flex items-center justify-center shrink-0 mt-0.5">
            {mode === 'tdee' ? (
              <Flame className="w-5 h-5" />
            ) : mode === 'bmr' ? (
              <Activity className="w-5 h-5" />
            ) : mode === 'ideal-weight' ? (
              <Scale className="w-5 h-5" />
            ) : mode === 'body-fat' ? (
              <Heart className="w-5 h-5" />
            ) : (
              <Calculator className="w-5 h-5" />
            )}
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#152238]">
              {HEALTH_MODES.find((m) => m.id === mode)?.label}
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
              All calculations run locally in your browser using clinical formulas.
            </p>
          </div>
        </div>

        {/* Unit Toggle */}
        <div className="inline-flex rounded-xl bg-[#F1F5F9] p-1 border border-[#CBD5E1]">
          <button
            type="button"
            onClick={() => setUnitSystem('metric')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-colors cursor-pointer ${
              unitSystem === 'metric'
                ? 'bg-[#2457D6] text-white shadow-2xs'
                : 'text-[#475569] hover:text-[#152238]'
            }`}
          >
            Metric (kg / cm)
          </button>
          <button
            type="button"
            onClick={() => setUnitSystem('imperial')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-colors cursor-pointer ${
              unitSystem === 'imperial'
                ? 'bg-[#2457D6] text-white shadow-2xs'
                : 'text-[#475569] hover:text-[#152238]'
            }`}
          >
            US / Imperial (lbs / in)
          </button>
        </div>
      </div>

      {/* Sex & Age Row (shown for TDEE, BMR, Ideal Weight, Body Fat) */}
      {mode !== 'bmi' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <span className="block text-sm font-extrabold text-[#152238] mb-2">
              Biological Sex (for formula constants)
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setSex('male')}
                className={`py-2.5 px-4 rounded-xl text-xs font-extrabold border transition-colors cursor-pointer ${
                  sex === 'male'
                    ? 'bg-[#EBF2FF] border-[#2457D6] text-[#2457D6]'
                    : 'bg-white border-[#CBD5E1] text-[#475569]'
                }`}
              >
                Male
              </button>
              <button
                type="button"
                onClick={() => setSex('female')}
                className={`py-2.5 px-4 rounded-xl text-xs font-extrabold border transition-colors cursor-pointer ${
                  sex === 'female'
                    ? 'bg-[#EBF2FF] border-[#2457D6] text-[#2457D6]'
                    : 'bg-white border-[#CBD5E1] text-[#475569]'
                }`}
              >
                Female
              </button>
            </div>
          </div>

          {(mode === 'tdee' || mode === 'bmr') && (
            <div>
              <label htmlFor="health-age" className="block text-sm font-extrabold text-[#152238] mb-2">
                Age (years) <span className="text-[#E11D48]">*</span>
              </label>
              <div className="flex items-stretch rounded-xl border border-[#CBD5E1] bg-white overflow-hidden focus-within:border-[#2457D6]">
                <input
                  id="health-age"
                  type="number"
                  min={15}
                  max={110}
                  step="1"
                  value={age}
                  onChange={(e) => setAge(Math.max(15, Number(e.target.value)))}
                  className="w-full px-4 py-2.5 bg-white text-base font-bold text-[#152238] tabular-nums focus:outline-none"
                />
                <span className="px-3.5 bg-[#F1F5F9] border-l border-[#CBD5E1] text-xs font-bold text-[#475569] flex items-center">
                  years
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Weight & Height Inputs */}
      {unitSystem === 'metric' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="bmi-kg" className="block text-sm font-extrabold text-[#152238] mb-2">
              Weight (kg) <span className="text-[#E11D48]">*</span>
            </label>
            <div className="flex items-stretch rounded-xl border border-[#CBD5E1] bg-white overflow-hidden focus-within:border-[#2457D6] focus-within:ring-3 focus-within:ring-[#2457D6]/15">
              <input
                id="bmi-kg"
                type="number"
                min={20}
                max={350}
                step="0.5"
                value={weightKg}
                onChange={(e) => setWeightKg(Math.max(1, Number(e.target.value)))}
                className="w-full px-4 py-3 bg-white text-base font-bold text-[#152238] tabular-nums focus:outline-none"
              />
              <span className="px-3.5 bg-[#F1F5F9] border-l border-[#CBD5E1] text-xs font-bold text-[#475569] flex items-center">
                kg
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-1.5">Enter your weight in kilograms (e.g. 70)</p>
          </div>

          <div>
            <label htmlFor="bmi-cm" className="block text-sm font-extrabold text-[#152238] mb-2">
              Height (cm) <span className="text-[#E11D48]">*</span>
            </label>
            <div className="flex items-stretch rounded-xl border border-[#CBD5E1] bg-white overflow-hidden focus-within:border-[#2457D6] focus-within:ring-3 focus-within:ring-[#2457D6]/15">
              <input
                id="bmi-cm"
                type="number"
                min={80}
                max={250}
                step="0.5"
                value={heightCm}
                onChange={(e) => setHeightCm(Math.max(50, Number(e.target.value)))}
                className="w-full px-4 py-3 bg-white text-base font-bold text-[#152238] tabular-nums focus:outline-none"
              />
              <span className="px-3.5 bg-[#F1F5F9] border-l border-[#CBD5E1] text-xs font-bold text-[#475569] flex items-center">
                cm
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-1.5">Enter your height in centimeters (e.g. 175)</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="bmi-lbs" className="block text-sm font-extrabold text-[#152238] mb-2">
              Weight (lbs) <span className="text-[#E11D48]">*</span>
            </label>
            <div className="flex items-stretch rounded-xl border border-[#CBD5E1] bg-white overflow-hidden focus-within:border-[#2457D6] focus-within:ring-3 focus-within:ring-[#2457D6]/15">
              <input
                id="bmi-lbs"
                type="number"
                min={45}
                max={750}
                step="1"
                value={weightLbs}
                onChange={(e) => setWeightLbs(Math.max(1, Number(e.target.value)))}
                className="w-full px-4 py-3 bg-white text-base font-bold text-[#152238] tabular-nums focus:outline-none"
              />
              <span className="px-3.5 bg-[#F1F5F9] border-l border-[#CBD5E1] text-xs font-bold text-[#475569] flex items-center">
                lbs
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-1.5">Enter your weight in pounds (e.g. 165)</p>
          </div>

          <div>
            <label htmlFor="bmi-in" className="block text-sm font-extrabold text-[#152238] mb-2">
              Total Height (inches) <span className="text-[#E11D48]">*</span>
            </label>
            <div className="flex items-stretch rounded-xl border border-[#CBD5E1] bg-white overflow-hidden focus-within:border-[#2457D6] focus-within:ring-3 focus-within:ring-[#2457D6]/15">
              <input
                id="bmi-in"
                type="number"
                min={36}
                max={96}
                step="0.5"
                value={heightInchesTotal}
                onChange={(e) => setHeightInchesTotal(Math.max(24, Number(e.target.value)))}
                className="w-full px-4 py-3 bg-white text-base font-bold text-[#152238] tabular-nums focus:outline-none"
              />
              <span className="px-3.5 bg-[#F1F5F9] border-l border-[#CBD5E1] text-xs font-bold text-[#475569] flex items-center">
                inches
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-1.5">e.g. 70 inches = 5 ft 10 in</p>
          </div>
        </div>
      )}

      {/* Activity Level Selector for TDEE */}
      {mode === 'tdee' && (
        <div>
          <label htmlFor="activity-level" className="block text-sm font-extrabold text-[#152238] mb-2">
            Weekly Activity Level
          </label>
          <select
            id="activity-level"
            value={activityFactor}
            onChange={(e) => setActivityFactor(Number(e.target.value))}
            className="w-full px-4 py-3 rounded-xl border border-[#CBD5E1] bg-white text-sm font-bold text-[#152238] focus:outline-none focus:border-[#2457D6]"
          >
            {ACTIVITY_LEVELS.map((lvl) => (
              <option key={lvl.value} value={lvl.value}>
                {lvl.label} (×{lvl.value})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Circumference Inputs for U.S. Navy Body Fat */}
      {mode === 'body-fat' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-[#E2E8F0]">
          <div>
            <label htmlFor="bf-neck" className="block text-xs font-extrabold text-[#152238] mb-1.5">
              Neck Circumference ({unitSystem === 'metric' ? 'cm' : 'in'})
            </label>
            <input
              id="bf-neck"
              type="number"
              step="0.5"
              value={unitSystem === 'metric' ? neckCm : neckIn}
              onChange={(e) =>
                unitSystem === 'metric'
                  ? setNeckCm(Math.max(15, Number(e.target.value)))
                  : setNeckIn(Math.max(6, Number(e.target.value)))
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] bg-white text-sm font-bold text-[#152238]"
            />
          </div>
          <div>
            <label htmlFor="bf-waist" className="block text-xs font-extrabold text-[#152238] mb-1.5">
              Waist Circumference ({unitSystem === 'metric' ? 'cm' : 'in'})
            </label>
            <input
              id="bf-waist"
              type="number"
              step="0.5"
              value={unitSystem === 'metric' ? waistCm : waistIn}
              onChange={(e) =>
                unitSystem === 'metric'
                  ? setWaistCm(Math.max(35, Number(e.target.value)))
                  : setWaistIn(Math.max(14, Number(e.target.value)))
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] bg-white text-sm font-bold text-[#152238]"
            />
          </div>
          {sex === 'female' && (
            <div>
              <label htmlFor="bf-hip" className="block text-xs font-extrabold text-[#152238] mb-1.5">
                Hip Circumference ({unitSystem === 'metric' ? 'cm' : 'in'})
              </label>
              <input
                id="bf-hip"
                type="number"
                step="0.5"
                value={unitSystem === 'metric' ? hipCm : hipIn}
                onChange={(e) =>
                  unitSystem === 'metric'
                    ? setHipCm(Math.max(40, Number(e.target.value)))
                    : setHipIn(Math.max(16, Number(e.target.value)))
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] bg-white text-sm font-bold text-[#152238]"
              />
            </div>
          )}
        </div>
      )}

      {mode === 'body-fat' && calculation.bodyFatError && (
        <div
          role="alert"
          className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#FFF1F2] border border-[#FECDD3] text-xs font-bold text-[#BE123C]"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{calculation.bodyFatError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 pt-1">
        <button
          type="button"
          onClick={() => {
            if (typeof window !== 'undefined' && window.innerWidth < 1024) {
              document
                .getElementById('live-result-card')
                ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
          }}
          className="sm:col-span-8 inline-flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl bg-[#0B5CFF] hover:bg-[#1D46B0] text-white text-base font-extrabold shadow-xs transition-colors cursor-pointer"
        >
          <Calculator className="w-5 h-5" />
          <span>Calculate</span>
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="sm:col-span-4 inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-[#F1F5F9] hover:bg-[#E2E8F0] border border-[#CBD5E1] text-[#152238] text-base font-extrabold transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>
      </div>
    </section>
  );

  const bmiRightSupplement = (
    <section
      aria-label="Complete body metrics summary"
      className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 shadow-2xs space-y-4"
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-extrabold text-[#152238]">
          All-in-One Health &amp; Metabolic Snapshot
        </h3>
        <span className="text-xs font-bold text-[#16856B] bg-[#ECFDF5] border border-[#A7F3D0] px-2.5 py-0.5 rounded-md">
          {calculation.bmiCategory}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
          <div className="text-[11px] font-bold text-[#64748B]">BMI Score</div>
          <div className="text-sm font-extrabold text-[#152238] tabular-nums mt-0.5">
            {calculation.bmi} kg/m²
          </div>
        </div>
        <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
          <div className="text-[11px] font-bold text-[#64748B]">Resting BMR</div>
          <div className="text-sm font-extrabold text-[#152238] tabular-nums mt-0.5">
            {calculation.bmrMifflin.toLocaleString()} kcal
          </div>
        </div>
        <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
          <div className="text-[11px] font-bold text-[#64748B]">Daily TDEE</div>
          <div className="text-sm font-extrabold text-[#16856B] tabular-nums mt-0.5">
            {calculation.tdee.toLocaleString()} kcal
          </div>
        </div>
        <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
          <div className="text-[11px] font-bold text-[#64748B]">Healthy Weight</div>
          <div className="text-sm font-extrabold text-[#2457D6] tabular-nums mt-0.5">
            {calculation.healthyRange}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
        <div className="rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] px-2.5 py-1.5">
          <div className="font-bold text-[#475569]">Underweight</div>
          <div className="font-mono font-extrabold text-[#152238] tabular-nums">&lt; 18.5</div>
        </div>
        <div className="rounded-lg bg-[#ECFDF5] border border-[#A7F3D0] px-2.5 py-1.5">
          <div className="font-bold text-[#065F46]">Normal</div>
          <div className="font-mono font-extrabold text-[#15803D] tabular-nums">18.5 – 24.9</div>
        </div>
        <div className="rounded-lg bg-[#FFFBEB] border border-[#FDE68A] px-2.5 py-1.5">
          <div className="font-bold text-[#B45309]">Overweight</div>
          <div className="font-mono font-extrabold text-[#92400E] tabular-nums">25.0 – 29.9</div>
        </div>
        <div className="rounded-lg bg-[#FFF1F2] border border-[#FECDD3] px-2.5 py-1.5">
          <div className="font-bold text-[#BE123C]">Obesity</div>
          <div className="font-mono font-extrabold text-[#9F1239] tabular-nums">≥ 30.0</div>
        </div>
      </div>
    </section>
  );

  return (
    <SingleCalculatorPageShell
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Health & Fitness', href: '/health-fitness' },
        {
          label:
            customTitle ||
            HEALTH_MODES.find((m) => m.id === mode)?.label ||
            'BMI Calculator',
        },
      ]}
      title={customTitle || 'BMI Calculator (Body Mass Index)'}
      subtitle={
        customSubtitle ||
        'Calculate your Body Mass Index (BMI) and WHO healthy weight range in Metric (kg/cm) or US Imperial (lbs/in) units.'
      }
      heroSymbol={customHeroSymbol || 'BMI'}
      heroBadgeBg="bg-[#FFE4E6]"
      heroBadgeColor="text-[#E11D48]"
      categoryName="Health & Fitness"
      categoryHref="/health-fitness"
      otherCalculatorsTitle="Other Health & Fitness Calculators"
      otherCalculators={HEALTH_RELATED_LINKS}
      relatedCalculators={HEALTH_RELATED_LINKS.slice(0, 4)}
      calculatorCard={calculatorCard}
      rightColumnSupplement={bmiRightSupplement}
      resultCard={activeResultCard}
      formulaCard={{
        introText: 'Clinical formulas used by this calculator suite:',
        formulaText:
          mode === 'tdee' || mode === 'bmr'
            ? 'Mifflin-St Jeor BMR = 10×Weight(kg) + 6.25×Height(cm) − 5×Age(y) + s (s = +5 male, −161 female)'
            : mode === 'ideal-weight'
            ? 'Devine IBW = 50 kg (male) or 45.5 kg (female) + 2.3 kg × (Height in inches − 60)'
            : mode === 'body-fat'
            ? 'U.S. Navy Body Fat % = 495 ÷ [1.0324 − 0.19077×log10(waist−neck) + 0.15456×log10(height)] − 450'
            : 'BMI = Weight (kg) ÷ [Height (m)]²',
        exampleTitle: 'Example for 70 kg and 1.75 m (175 cm), Age 30:',
        exampleSteps: [
          'BMI = 70 ÷ (1.75 × 1.75) = 22.9 kg/m² (Normal weight)',
          'Resting BMR (Male) = 10(70) + 6.25(175) − 5(30) + 5 = 1,649 kcal/day',
          'Moderate Activity TDEE (×1.55) = 1,649 × 1.55 = 2,556 kcal/day',
        ],
      }}
      howToUseSteps={[
        'Select your desired calculator mode at the top: BMI, TDEE Calories, BMR, Ideal Weight, or Body Fat %.',
        'Choose Metric (kg / cm) or US Imperial (lbs / inches) units.',
        'Enter your weight, height, and (for BMR/TDEE/Body Fat) your age, sex, or circumference measurements.',
        'Review your primary result and the 4-metric summary strip showing BMI, BMR, TDEE, and Healthy Weight simultaneously.',
      ]}
      howItWorks={{
        paragraph:
          'Body Mass Index (BMI) screens weight relative to height. Basal Metabolic Rate (BMR) uses the Mifflin-St Jeor equation recommended by the Academy of Nutrition and Dietetics to estimate resting energy expenditure, while Total Daily Energy Expenditure (TDEE) scales BMR by physical activity.',
        formulaBox: 'BMI = kg/m²   |   TDEE = BMR × Activity Factor',
        closingNote:
          'Standard adult WHO BMI ranges: Underweight (<18.5), Normal weight (18.5–24.9), Overweight (25.0–29.9), and Obesity (30.0+). Note: these formulas are informational screening tools and do not replace medical advice.',
      }}
      understandingResult={{
        paragraph: (
          <>
            A BMI between <strong className="font-bold text-[#152238]">18.5 and 24.9</strong> is classified as a normal healthy weight for most adults. For your entered height, that corresponds to a weight between <strong className="font-bold text-[#152238]">{calculation.healthyRange}</strong>, with an estimated resting metabolic burn of <strong className="font-bold text-[#152238]">{calculation.bmrMifflin.toLocaleString()} kcal/day</strong>.
          </>
        ),
      }}
      faqs={[
        {
          question: 'What is a healthy BMI range for adults?',
          answer:
            'According to the World Health Organization (WHO), a normal healthy BMI for adults is between 18.5 and 24.9 kg/m².',
        },
        {
          question: 'How does the Mifflin-St Jeor BMR formula work?',
          answer:
            'The Mifflin-St Jeor equation multiplies weight in kg by 10, adds 6.25 times height in cm, subtracts 5 times age in years, and adds 5 for men or subtracts 161 for women.',
        },
        {
          question: 'How many calories should I subtract from TDEE to lose weight?',
          answer:
            'A daily deficit of 250 to 500 kcal below your maintenance TDEE is commonly used for steady weight loss of roughly 0.25 to 0.5 kg (0.5 to 1 lb) per week.',
        },
        {
          question: 'Does BMI account for muscle mass?',
          answer:
            'No. Muscular athletes may have a BMI above 25.0 without carrying excess body fat. Switching to the Body Fat % (U.S. Navy) tab provides a circumference-based body composition estimate.',
        },
      ]}
    />
  );
}
