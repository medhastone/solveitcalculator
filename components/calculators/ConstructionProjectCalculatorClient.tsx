'use client';

import React, { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  calculateConstructionProject,
  switchMeasurementSystemPreservingDimensions,
  convertLinearValue,
  formatConvertedDimension,
  parseDimensionString,
  LINEAR_UNIT_LABELS,
  AREA_UNIT_LABELS,
  VOLUME_UNIT_LABELS,
  type ConstructionShapeType,
  type MeasurementSystem,
  type LinearUnit,
  type AreaUnit,
  type VolumeUnit,
  type CostPricingMode,
  type ConstructionProjectInputs,
} from '@/lib/constructionProjectEngine';
import {
  ChevronRight,
  Layers,
  Box,
  CircleDot,
  Ruler,
  Calculator,
  Percent,
  DollarSign,
  Check,
  AlertCircle,
  Info,
  Copy,
  Printer,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  ArrowLeftRight,
  Package,
  FileText,
} from 'lucide-react';

type CurrencyCode = 'USD' | 'INR' | 'GBP' | 'EUR';

interface CurrencyOption {
  code: CurrencyCode;
  symbol: string;
  label: string;
}

const CURRENCIES: Record<CurrencyCode, CurrencyOption> = {
  USD: { code: 'USD', symbol: '$', label: '$ (USD)' },
  INR: { code: 'INR', symbol: '₹', label: '₹ (INR)' },
  GBP: { code: 'GBP', symbol: '£', label: '£ (GBP)' },
  EUR: { code: 'EUR', symbol: '€', label: '€ (EUR)' },
};

const SHAPE_OPTIONS: {
  id: ConstructionShapeType;
  name: string;
  shortDesc: string;
  formulaLabel: string;
  quantityTypeLabel: string;
}[] = [
  {
    id: 'rectangular-area',
    name: 'Flooring or Rectangular Area',
    shortDesc: 'Rooms, floors, patios, lawns, walls, or rectangular surfaces.',
    formulaLabel: 'Area = Length × Width',
    quantityTypeLabel: 'Surface Area',
  },
  {
    id: 'concrete-slab',
    name: 'Concrete Slabs',
    shortDesc: 'Driveways, garage floors, shed pads, patios, and sidewalks.',
    formulaLabel: 'Volume = Length × Width × Thickness',
    quantityTypeLabel: 'Cubic Volume',
  },
  {
    id: 'cylindrical-holes',
    name: 'Cylindrical Post Holes',
    shortDesc: 'Fence posts, deck footings, piers, and cylindrical columns.',
    formulaLabel: 'Volume = π × (Diameter ÷ 2)² × Depth × Holes',
    quantityTypeLabel: 'Cubic Volume',
  },
];

const INITIAL_INPUTS: ConstructionProjectInputs = {
  shape: 'rectangular-area',
  system: 'imperial',
  useFeetInches: false,
  length: '15',
  lengthUnit: 'ft',
  lengthFtIn: { feet: '15', inches: '0' },
  width: '12',
  widthUnit: 'ft',
  widthFtIn: { feet: '12', inches: '0' },
  thickness: '4',
  thicknessUnit: 'in',
  diameter: '12',
  diameterUnit: 'in',
  depth: '3',
  depthUnit: 'ft',
  depthFtIn: { feet: '3', inches: '0' },
  numberOfHoles: '4',
  wastePercent: '10',
  pricingMode: 'package',
  packageYield: '',
  packageYieldUnit: 'sqft',
  unitOrPackagePrice: '',
  priceUnit: 'sqft',
};

export default function ConstructionProjectCalculatorClient() {
  const [inputs, setInputs] = useState<ConstructionProjectInputs>(INITIAL_INPUTS);
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [unitSwitchNotice, setUnitSwitchNotice] = useState<string | null>(null);

  const step1Ref = useRef<HTMLElement>(null);
  const step2Ref = useRef<HTMLElement>(null);
  const step3Ref = useRef<HTMLElement>(null);
  const step4Ref = useRef<HTMLElement>(null);

  const result = useMemo(() => calculateConstructionProject(inputs), [inputs]);
  const currencyInfo = CURRENCIES[currency];

  const goToStep = (step: 1 | 2 | 3 | 4) => {
    setActiveStep(step);
    const target =
      step === 1
        ? step1Ref.current
        : step === 2
          ? step2Ref.current
          : step === 3
            ? step3Ref.current
            : step4Ref.current;
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleShapeChange = (nextShape: ConstructionShapeType) => {
    const isNextArea = nextShape === 'rectangular-area';
    setInputs((prev) => ({
      ...prev,
      shape: nextShape,
      packageYield: '',
      unitOrPackagePrice: '',
      packageYieldUnit: isNextArea
        ? prev.system === 'imperial'
          ? 'sqft'
          : 'sqm'
        : prev.system === 'imperial'
          ? 'cuft'
          : 'cum',
      priceUnit: isNextArea
        ? prev.system === 'imperial'
          ? 'sqft'
          : 'sqm'
        : prev.system === 'imperial'
          ? 'cuyd'
          : 'cum',
    }));
  };

  const handleSystemSwitch = (targetSystem: MeasurementSystem) => {
    if (inputs.system === targetSystem) return;
    setInputs((prev) =>
      switchMeasurementSystemPreservingDimensions(prev, targetSystem)
    );
    setUnitSwitchNotice(
      targetSystem === 'metric'
        ? 'Converted dimensions to Metric units while keeping physical measurements identical.'
        : 'Converted dimensions to Imperial units while keeping physical measurements identical.'
    );
    setTimeout(() => setUnitSwitchNotice(null), 4000);
  };

  const handleSingleFieldUnitChange = (
    field: 'length' | 'width' | 'thickness' | 'diameter' | 'depth',
    unitField:
      | 'lengthUnit'
      | 'widthUnit'
      | 'thicknessUnit'
      | 'diameterUnit'
      | 'depthUnit',
    nextUnit: LinearUnit
  ) => {
    setInputs((prev) => {
      const currentUnit = prev[unitField];
      if (currentUnit === nextUnit) return prev;
      const rawNumber = parseDimensionString(prev[field]);
      if (!Number.isNaN(rawNumber) && rawNumber > 0) {
        const converted = convertLinearValue(rawNumber, currentUnit, nextUnit);
        return {
          ...prev,
          [field]: formatConvertedDimension(converted),
          [unitField]: nextUnit,
        };
      }
      return {
        ...prev,
        [unitField]: nextUnit,
      };
    });
  };

  const handleReset = () => {
    setInputs(INITIAL_INPUTS);
    setActiveStep(1);
    setUnitSwitchNotice(null);
  };

  const formatNum = (val: number, maxDecimals = 2) => {
    if (!Number.isFinite(val)) return '—';
    return val.toLocaleString('en-US', {
      minimumFractionDigits: val % 1 === 0 ? 0 : Math.min(2, maxDecimals),
      maximumFractionDigits: maxDecimals,
    });
  };

  const formatCurrency = (val: number) => {
    if (!Number.isFinite(val)) return '—';
    return `${currencyInfo.symbol}${val.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const handleCopySummary = () => {
    if (!result.isValid) return;
    const shapeMeta = SHAPE_OPTIONS.find((s) => s.id === inputs.shape)!;
    const lines = [
      `SolveItCalculator — Construction Project Estimate`,
      `Project Type: ${shapeMeta.name}`,
      `Formula: ${result.formulaText} (${result.formulaSubstitutionText})`,
      `Base Quantity: ${formatNum(result.basePrimaryValue, 3)} ${result.primaryUnitLabel}`,
      `Waste Allowance (${result.wastePercent}%): +${formatNum(result.wasteAmountPrimary, 3)} ${result.primaryUnitLabel}`,
      `Waste-Adjusted Quantity: ${formatNum(result.adjustedPrimaryValue, 3)} ${result.primaryUnitLabel}`,
    ];

    if (result.packageCount !== null && result.packageYieldValue !== null) {
      const yieldLabel =
        result.quantityKind === 'area'
          ? AREA_UNIT_LABELS[result.packageYieldUnit as AreaUnit]
          : VOLUME_UNIT_LABELS[result.packageYieldUnit as VolumeUnit];
      lines.push(
        `Packages / Bags Needed: ${result.packageCount} units (at ${result.packageYieldValue} ${yieldLabel} per unit)`
      );
    }

    if (result.estimatedTotalCost !== null) {
      lines.push(
        `Estimated Material Cost: ${formatCurrency(result.estimatedTotalCost)}`
      );
    }

    lines.push(
      `Note: Estimate based on user-entered dimensions, waste percentage, and material pricing.`
    );

    navigator.clipboard.writeText(lines.join('\n'));
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-slate-950 text-[#0F172A] dark:text-slate-100 transition-colors">
      <Navbar />

      {/* Page Header & Breadcrumb */}
      <section className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-3"
          >
            <Link
              href="/"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link
              href="/home-construction"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Home &amp; Construction
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-900 dark:text-white">
              Construction Project Calculator
            </span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="max-w-3xl">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Construction Project Calculator
              </h1>
              <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Estimate material quantities, adjustable waste allowances, package
                or bag counts, and optional material costs in one guided workflow—using
                your own project measurements and product prices without re-entering
                dimensions across separate tools.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 transition-colors min-h-[44px]"
              >
                <RotateCcw className="w-4 h-4" />
                Reset Workflow
              </button>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 space-y-6">
        {/* Workflow Shape Selector */}
        <section
          aria-labelledby="project-type-heading"
          className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-2xs"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <div>
              <h2
                id="project-type-heading"
                className="text-base sm:text-lg font-bold text-slate-900 dark:text-white"
              >
                Choose Your Construction Workflow
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Select a project shape below. Your measurements flow automatically
                through all four calculation stages.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {SHAPE_OPTIONS.map((option) => {
              const selected = inputs.shape === option.id;
              const Icon =
                option.id === 'rectangular-area'
                  ? Layers
                  : option.id === 'concrete-slab'
                    ? Box
                    : CircleDot;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleShapeChange(option.id)}
                  aria-pressed={selected}
                  className={`text-left p-4 rounded-xl border transition-all flex flex-col justify-between min-h-[112px] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                    selected
                      ? 'border-blue-600 dark:border-blue-500 bg-blue-50/70 dark:bg-blue-950/40 ring-1 ring-blue-600/30'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                        selected
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                        {option.name}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                        {option.shortDesc}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-slate-200/80 dark:border-slate-700/70 flex items-center justify-between text-[11px] font-mono text-slate-600 dark:text-slate-300">
                    <span>{option.formulaLabel}</span>
                    <span className="font-sans font-semibold text-blue-700 dark:text-blue-400">
                      {option.quantityTypeLabel}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* 4-Stage Step Indicator */}
        <nav
          aria-label="Construction Calculation Stages"
          className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 dark:divide-slate-800"
        >
          {[
            {
              step: 1 as const,
              title: '1. Measurements',
              subtitle: 'Dimensions & units',
              icon: Ruler,
            },
            {
              step: 2 as const,
              title: '2. Quantity',
              subtitle: 'Area or volume output',
              icon: Calculator,
            },
            {
              step: 3 as const,
              title: '3. Waste Allowance',
              subtitle: 'Adjustable buffer %',
              icon: Percent,
            },
            {
              step: 4 as const,
              title: '4. Estimated Cost',
              subtitle: 'Packages & pricing',
              icon: DollarSign,
            },
          ].map((item) => {
            const isCurrent = activeStep === item.step;
            const isCompleted = activeStep > item.step && result.isValid;
            return (
              <button
                key={item.step}
                type="button"
                onClick={() => goToStep(item.step)}
                aria-current={isCurrent ? 'step' : undefined}
                className={`px-4 py-3.5 text-left flex items-center gap-3 transition-colors min-h-[60px] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 ${
                  isCurrent
                    ? 'bg-blue-50/90 dark:bg-blue-950/50 border-b-2 lg:border-b-0 border-blue-600'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    isCurrent
                      ? 'bg-blue-600 text-white'
                      : isCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : item.step}
                </span>
                <div className="min-w-0">
                  <div
                    className={`text-xs sm:text-sm font-bold truncate ${
                      isCurrent
                        ? 'text-blue-700 dark:text-blue-400'
                        : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {item.title}
                  </div>
                  <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">
                    {item.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Main Two-Column Grid: Left 8 Cols (4 Guided Stages) + Right 4 Cols (Sticky Live Project Estimate & Summary) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 space-y-6">
            {/* STAGE 1: MEASUREMENTS */}
            <section
              ref={step1Ref}
              onClick={() => setActiveStep(1)}
              aria-labelledby="stage-1-heading"
              className={`bg-white dark:bg-slate-900 rounded-xl border p-5 sm:p-6 shadow-2xs transition-all ${
                activeStep === 1
                  ? 'border-blue-600 dark:border-blue-500 ring-1 ring-blue-600/20'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 mb-5 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    Stage 1 of 4
                  </span>
                  <h2
                    id="stage-1-heading"
                    className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mt-0.5"
                  >
                    Enter Project Measurements
                  </h2>
                </div>

                {/* Measurement System Toggle (Preserves Physical Meaning) */}
                <div className="flex flex-wrap items-center gap-2">
                  <div
                    role="group"
                    aria-label="Measurement System"
                    className="inline-flex rounded-lg bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700"
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSystemSwitch('imperial');
                      }}
                      className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors min-h-[36px] ${
                        inputs.system === 'imperial'
                          ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Imperial (ft, in)
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSystemSwitch('metric');
                      }}
                      className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors min-h-[36px] ${
                        inputs.system === 'metric'
                          ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Metric (m, cm)
                    </button>
                  </div>

                  {inputs.system === 'imperial' && (
                    <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer min-h-[36px]">
                      <input
                        type="checkbox"
                        checked={inputs.useFeetInches}
                        onChange={(e) =>
                          setInputs((prev) => ({
                            ...prev,
                            useFeetInches: e.target.checked,
                          }))
                        }
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span>Use Feet + Inches fields</span>
                    </label>
                  )}
                </div>
              </div>

              {unitSwitchNotice && (
                <div
                  role="status"
                  className="mb-4 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 px-3.5 py-2.5 text-xs font-medium text-blue-800 dark:text-blue-200 flex items-center gap-2"
                >
                  <ArrowLeftRight className="w-4 h-4 shrink-0 text-blue-600 dark:text-blue-400" />
                  <span>{unitSwitchNotice}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                {/* Dimension Fields */}
                <div className="md:col-span-7 space-y-4">
                  {(inputs.shape === 'rectangular-area' ||
                    inputs.shape === 'concrete-slab') && (
                    <>
                      {/* LENGTH */}
                      <div>
                        <label
                          htmlFor="dimension-length"
                          className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1.5"
                        >
                          Length{' '}
                          <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                            (decimals or fractions like 12.5 or 12 1/2)
                          </span>
                        </label>
                        {inputs.system === 'imperial' && inputs.useFeetInches ? (
                          <div className="grid grid-cols-2 gap-2.5">
                            <div>
                              <label
                                htmlFor="length-feet"
                                className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1"
                              >
                                Feet (ft)
                              </label>
                              <input
                                id="length-feet"
                                type="text"
                                inputMode="decimal"
                                value={inputs.lengthFtIn?.feet ?? ''}
                                onChange={(e) =>
                                  setInputs((prev) => ({
                                    ...prev,
                                    lengthFtIn: {
                                      feet: e.target.value,
                                      inches: prev.lengthFtIn?.inches ?? '0',
                                    },
                                  }))
                                }
                                placeholder="15"
                                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 min-h-[44px]"
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="length-inches"
                                className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1"
                              >
                                Inches (in)
                              </label>
                              <input
                                id="length-inches"
                                type="text"
                                inputMode="decimal"
                                value={inputs.lengthFtIn?.inches ?? ''}
                                onChange={(e) =>
                                  setInputs((prev) => ({
                                    ...prev,
                                    lengthFtIn: {
                                      feet: prev.lengthFtIn?.feet ?? '0',
                                      inches: e.target.value,
                                    },
                                  }))
                                }
                                placeholder="6"
                                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 min-h-[44px]"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-stretch gap-2">
                            <input
                              id="dimension-length"
                              type="text"
                              inputMode="decimal"
                              value={inputs.length}
                              onChange={(e) =>
                                setInputs((prev) => ({
                                  ...prev,
                                  length: e.target.value,
                                }))
                              }
                              aria-invalid={Boolean(result.fieldErrors.length)}
                              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 min-h-[44px]"
                            />
                            <select
                              aria-label="Length measurement unit"
                              value={inputs.lengthUnit}
                              onChange={(e) =>
                                handleSingleFieldUnitChange(
                                  'length',
                                  'lengthUnit',
                                  e.target.value as LinearUnit
                                )
                              }
                              className="rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 min-h-[44px]"
                            >
                              {Object.entries(LINEAR_UNIT_LABELS).map(
                                ([u, label]) => (
                                  <option key={u} value={u}>
                                    {label}
                                  </option>
                                )
                              )}
                            </select>
                          </div>
                        )}
                        {result.fieldErrors.length && (
                          <p className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">
                            {result.fieldErrors.length}
                          </p>
                        )}
                      </div>

                      {/* WIDTH */}
                      <div>
                        <label
                          htmlFor="dimension-width"
                          className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1.5"
                        >
                          Width
                        </label>
                        {inputs.system === 'imperial' && inputs.useFeetInches ? (
                          <div className="grid grid-cols-2 gap-2.5">
                            <div>
                              <label
                                htmlFor="width-feet"
                                className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1"
                              >
                                Feet (ft)
                              </label>
                              <input
                                id="width-feet"
                                type="text"
                                inputMode="decimal"
                                value={inputs.widthFtIn?.feet ?? ''}
                                onChange={(e) =>
                                  setInputs((prev) => ({
                                    ...prev,
                                    widthFtIn: {
                                      feet: e.target.value,
                                      inches: prev.widthFtIn?.inches ?? '0',
                                    },
                                  }))
                                }
                                placeholder="12"
                                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 min-h-[44px]"
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="width-inches"
                                className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1"
                              >
                                Inches (in)
                              </label>
                              <input
                                id="width-inches"
                                type="text"
                                inputMode="decimal"
                                value={inputs.widthFtIn?.inches ?? ''}
                                onChange={(e) =>
                                  setInputs((prev) => ({
                                    ...prev,
                                    widthFtIn: {
                                      feet: prev.widthFtIn?.feet ?? '0',
                                      inches: e.target.value,
                                    },
                                  }))
                                }
                                placeholder="0"
                                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 min-h-[44px]"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-stretch gap-2">
                            <input
                              id="dimension-width"
                              type="text"
                              inputMode="decimal"
                              value={inputs.width}
                              onChange={(e) =>
                                setInputs((prev) => ({
                                  ...prev,
                                  width: e.target.value,
                                }))
                              }
                              aria-invalid={Boolean(result.fieldErrors.width)}
                              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 min-h-[44px]"
                            />
                            <select
                              aria-label="Width measurement unit"
                              value={inputs.widthUnit}
                              onChange={(e) =>
                                handleSingleFieldUnitChange(
                                  'width',
                                  'widthUnit',
                                  e.target.value as LinearUnit
                                )
                              }
                              className="rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 min-h-[44px]"
                            >
                              {Object.entries(LINEAR_UNIT_LABELS).map(
                                ([u, label]) => (
                                  <option key={u} value={u}>
                                    {label}
                                  </option>
                                )
                              )}
                            </select>
                          </div>
                        )}
                        {result.fieldErrors.width && (
                          <p className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">
                            {result.fieldErrors.width}
                          </p>
                        )}
                      </div>
                    </>
                  )}

                  {/* CONCRETE SLAB THICKNESS */}
                  {inputs.shape === 'concrete-slab' && (
                    <div>
                      <label
                        htmlFor="dimension-thickness"
                        className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1.5"
                      >
                        Slab Thickness / Depth{' '}
                        <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                          (e.g., 4 in or 10 cm)
                        </span>
                      </label>
                      <div className="flex items-stretch gap-2">
                        <input
                          id="dimension-thickness"
                          type="text"
                          inputMode="decimal"
                          value={inputs.thickness}
                          onChange={(e) =>
                            setInputs((prev) => ({
                              ...prev,
                              thickness: e.target.value,
                            }))
                          }
                          aria-invalid={Boolean(result.fieldErrors.thickness)}
                          className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 min-h-[44px]"
                        />
                        <select
                          aria-label="Slab thickness measurement unit"
                          value={inputs.thicknessUnit}
                          onChange={(e) =>
                            handleSingleFieldUnitChange(
                              'thickness',
                              'thicknessUnit',
                              e.target.value as LinearUnit
                            )
                          }
                          className="rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 min-h-[44px]"
                        >
                          {Object.entries(LINEAR_UNIT_LABELS).map(
                            ([u, label]) => (
                              <option key={u} value={u}>
                                {label}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                      {result.fieldErrors.thickness && (
                        <p className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">
                          {result.fieldErrors.thickness}
                        </p>
                      )}
                    </div>
                  )}

                  {/* CYLINDRICAL POST HOLES FIELDS */}
                  {inputs.shape === 'cylindrical-holes' && (
                    <>
                      <div>
                        <label
                          htmlFor="dimension-diameter"
                          className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1.5"
                        >
                          Hole Diameter{' '}
                          <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                            (full width across circular hole)
                          </span>
                        </label>
                        <div className="flex items-stretch gap-2">
                          <input
                            id="dimension-diameter"
                            type="text"
                            inputMode="decimal"
                            value={inputs.diameter}
                            onChange={(e) =>
                              setInputs((prev) => ({
                                ...prev,
                                diameter: e.target.value,
                              }))
                            }
                            aria-invalid={Boolean(result.fieldErrors.diameter)}
                            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 min-h-[44px]"
                          />
                          <select
                            aria-label="Hole diameter unit"
                            value={inputs.diameterUnit}
                            onChange={(e) =>
                              handleSingleFieldUnitChange(
                                'diameter',
                                'diameterUnit',
                                e.target.value as LinearUnit
                              )
                            }
                            className="rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 min-h-[44px]"
                          >
                            {Object.entries(LINEAR_UNIT_LABELS).map(
                              ([u, label]) => (
                                <option key={u} value={u}>
                                  {label}
                                </option>
                              )
                            )}
                          </select>
                        </div>
                        {result.fieldErrors.diameter && (
                          <p className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">
                            {result.fieldErrors.diameter}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="dimension-depth"
                          className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1.5"
                        >
                          Hole Depth
                        </label>
                        {inputs.system === 'imperial' && inputs.useFeetInches ? (
                          <div className="grid grid-cols-2 gap-2.5">
                            <div>
                              <label
                                htmlFor="depth-feet"
                                className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1"
                              >
                                Feet (ft)
                              </label>
                              <input
                                id="depth-feet"
                                type="text"
                                inputMode="decimal"
                                value={inputs.depthFtIn?.feet ?? ''}
                                onChange={(e) =>
                                  setInputs((prev) => ({
                                    ...prev,
                                    depthFtIn: {
                                      feet: e.target.value,
                                      inches: prev.depthFtIn?.inches ?? '0',
                                    },
                                  }))
                                }
                                placeholder="3"
                                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 min-h-[44px]"
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="depth-inches"
                                className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1"
                              >
                                Inches (in)
                              </label>
                              <input
                                id="depth-inches"
                                type="text"
                                inputMode="decimal"
                                value={inputs.depthFtIn?.inches ?? ''}
                                onChange={(e) =>
                                  setInputs((prev) => ({
                                    ...prev,
                                    depthFtIn: {
                                      feet: prev.depthFtIn?.feet ?? '0',
                                      inches: e.target.value,
                                    },
                                  }))
                                }
                                placeholder="6"
                                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 min-h-[44px]"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-stretch gap-2">
                            <input
                              id="dimension-depth"
                              type="text"
                              inputMode="decimal"
                              value={inputs.depth}
                              onChange={(e) =>
                                setInputs((prev) => ({
                                  ...prev,
                                  depth: e.target.value,
                                }))
                              }
                              aria-invalid={Boolean(result.fieldErrors.depth)}
                              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 min-h-[44px]"
                            />
                            <select
                              aria-label="Hole depth unit"
                              value={inputs.depthUnit}
                              onChange={(e) =>
                                handleSingleFieldUnitChange(
                                  'depth',
                                  'depthUnit',
                                  e.target.value as LinearUnit
                                )
                              }
                              className="rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 min-h-[44px]"
                            >
                              {Object.entries(LINEAR_UNIT_LABELS).map(
                                ([u, label]) => (
                                  <option key={u} value={u}>
                                    {label}
                                  </option>
                                )
                              )}
                            </select>
                          </div>
                        )}
                        {result.fieldErrors.depth && (
                          <p className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">
                            {result.fieldErrors.depth}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="dimension-holes-count"
                          className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1.5"
                        >
                          Number of Holes
                        </label>
                        <input
                          id="dimension-holes-count"
                          type="number"
                          min="1"
                          max="10000"
                          step="1"
                          value={inputs.numberOfHoles}
                          onChange={(e) =>
                            setInputs((prev) => ({
                              ...prev,
                              numberOfHoles: e.target.value,
                            }))
                          }
                          aria-invalid={Boolean(result.fieldErrors.numberOfHoles)}
                          className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 min-h-[44px]"
                        />
                        {result.fieldErrors.numberOfHoles && (
                          <p className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">
                            {result.fieldErrors.numberOfHoles}
                          </p>
                        )}
                      </div>
                    </>
                  )}

                  {/* Immediate Live Output Summary Right After Dimension Inputs */}
                  {result.isValid && (
                    <div
                      role="status"
                      aria-live="polite"
                      className="rounded-xl bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/70 p-4 space-y-2.5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-md">
                          Verified Live Output
                        </span>
                        <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300 tabular-nums">
                          {result.formulaSubstitutionText}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-0.5">
                        <div>
                          <div className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                            Base Quantity
                          </div>
                          <div className="text-base sm:text-lg font-extrabold text-emerald-700 dark:text-emerald-400 tabular-nums">
                            {formatNum(result.basePrimaryValue, 2)}{' '}
                            {result.primaryUnitLabel}
                          </div>
                        </div>
                        <div>
                          <div className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                            With {result.wastePercent}% Waste
                          </div>
                          <div className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tabular-nums">
                            {formatNum(result.adjustedPrimaryValue, 2)}{' '}
                            {result.primaryUnitLabel}
                          </div>
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                          <div className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                            {result.estimatedTotalCost !== null
                              ? 'Est. Material Cost'
                              : 'Packages / Bags'}
                          </div>
                          <div className="text-base sm:text-lg font-extrabold text-blue-700 dark:text-blue-400 tabular-nums">
                            {result.estimatedTotalCost !== null
                              ? formatCurrency(result.estimatedTotalCost)
                              : result.packageCount !== null
                                ? `${result.packageCount} units`
                                : `${formatNum(result.adjustedPrimaryValue, 2)} ${result.primaryUnitLabel}`}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Normalized Measurement Preview Card */}
                <div className="md:col-span-5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80 p-4 space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Normalized Dimensions
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Before calculating area or volume, all inputs are normalized to
                    a common base unit so mixed units (like feet for length and
                    inches for slab thickness) compute accurately.
                  </p>

                  {result.isValid ? (
                    <dl className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700 text-xs">
                      {result.normalized.lengthFeet !== undefined && (
                        <div className="flex justify-between">
                          <dt className="text-slate-500 dark:text-slate-400">
                            Normalized Length:
                          </dt>
                          <dd className="font-mono font-semibold text-slate-900 dark:text-white">
                            {formatNum(result.normalized.lengthFeet, 2)} ft (
                            {formatNum(result.normalized.lengthMeters!, 2)} m)
                          </dd>
                        </div>
                      )}
                      {result.normalized.widthFeet !== undefined && (
                        <div className="flex justify-between">
                          <dt className="text-slate-500 dark:text-slate-400">
                            Normalized Width:
                          </dt>
                          <dd className="font-mono font-semibold text-slate-900 dark:text-white">
                            {formatNum(result.normalized.widthFeet, 2)} ft (
                            {formatNum(result.normalized.widthMeters!, 2)} m)
                          </dd>
                        </div>
                      )}
                      {result.normalized.thicknessFeet !== undefined && (
                        <div className="flex justify-between">
                          <dt className="text-slate-500 dark:text-slate-400">
                            Normalized Thickness:
                          </dt>
                          <dd className="font-mono font-semibold text-slate-900 dark:text-white">
                            {formatNum(result.normalized.thicknessFeet, 3)} ft (
                            {formatNum(result.normalized.thicknessMeters!, 3)} m)
                          </dd>
                        </div>
                      )}
                      {result.normalized.diameterFeet !== undefined && (
                        <div className="flex justify-between">
                          <dt className="text-slate-500 dark:text-slate-400">
                            Normalized Diameter:
                          </dt>
                          <dd className="font-mono font-semibold text-slate-900 dark:text-white">
                            {formatNum(result.normalized.diameterFeet, 3)} ft (
                            {formatNum(result.normalized.diameterMeters!, 3)} m)
                          </dd>
                        </div>
                      )}
                      {result.normalized.depthFeet !== undefined && (
                        <div className="flex justify-between">
                          <dt className="text-slate-500 dark:text-slate-400">
                            Normalized Depth:
                          </dt>
                          <dd className="font-mono font-semibold text-slate-900 dark:text-white">
                            {formatNum(result.normalized.depthFeet, 2)} ft (
                            {formatNum(result.normalized.depthMeters!, 2)} m)
                          </dd>
                        </div>
                      )}
                      {result.normalized.numberOfHoles !== undefined && (
                        <div className="flex justify-between">
                          <dt className="text-slate-500 dark:text-slate-400">
                            Hole Count:
                          </dt>
                          <dd className="font-mono font-semibold text-slate-900 dark:text-white">
                            {result.normalized.numberOfHoles} holes
                          </dd>
                        </div>
                      )}
                    </dl>
                  ) : (
                    <div className="rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 p-3 text-xs text-red-700 dark:text-red-300 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>
                        Please fix the highlighted measurement fields above to
                        compute quantities.
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToStep(2);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-colors min-h-[44px]"
                >
                  <span>Next: Review Base Quantity</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </section>

            {/* STAGE 2: QUANTITY CALCULATIONS */}
            <section
              ref={step2Ref}
              onClick={() => setActiveStep(2)}
              aria-labelledby="stage-2-heading"
              className={`bg-white dark:bg-slate-900 rounded-xl border p-5 sm:p-6 shadow-2xs transition-all ${
                activeStep === 2
                  ? 'border-blue-600 dark:border-blue-500 ring-1 ring-blue-600/20'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="pb-4 mb-5 border-b border-slate-200 dark:border-slate-800">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Stage 2 of 4
                </span>
                <h2
                  id="stage-2-heading"
                  className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mt-0.5"
                >
                  Base Material Quantity (Before Waste)
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Exact geometric area or volume calculated from your normalized
                  Stage 1 measurements.
                </p>
              </div>

              {result.isValid ? (
                <div className="space-y-4">
                  {/* Formula Banner */}
                  <div className="rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 p-4">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Applied Formula
                    </div>
                    <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-1 font-mono">
                      {result.formulaText}
                    </div>
                    <div className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 mt-1 font-mono">
                      {result.formulaSubstitutionText}
                    </div>
                  </div>

                  {/* Converted Unit Cards */}
                  {result.quantityKind === 'area' && result.baseArea && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                      <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/30 p-4">
                        <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                          Square Feet (ft²)
                        </div>
                        <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                          {formatNum(result.baseArea.sqft, 2)} sq ft
                        </div>
                      </div>
                      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 p-4">
                        <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                          Square Meters (m²)
                        </div>
                        <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                          {formatNum(result.baseArea.sqm, 2)} sq m
                        </div>
                      </div>
                      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 p-4">
                        <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                          Square Yards (yd²)
                        </div>
                        <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                          {formatNum(result.baseArea.sqyd, 2)} sq yd
                        </div>
                      </div>
                    </div>
                  )}

                  {result.quantityKind === 'volume' && result.baseVolume && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/30 p-3.5">
                          <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                            Cubic Yards (yd³)
                          </div>
                          <div className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                            {formatNum(result.baseVolume.cuyd, 3)} cu yd
                          </div>
                        </div>
                        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 p-3.5">
                          <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                            Cubic Feet (ft³)
                          </div>
                          <div className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                            {formatNum(result.baseVolume.cuft, 2)} cu ft
                          </div>
                        </div>
                        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 p-3.5">
                          <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                            Cubic Meters (m³)
                          </div>
                          <div className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                            {formatNum(result.baseVolume.cum, 3)} cu m
                          </div>
                        </div>
                        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 p-3.5">
                          <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                            Liters (L)
                          </div>
                          <div className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                            {formatNum(result.baseVolume.liters, 1)} L
                          </div>
                        </div>
                      </div>

                      {result.slabSurfaceArea && (
                        <div className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 rounded-lg px-3.5 py-2 border border-slate-200 dark:border-slate-700">
                          <strong>Top Slab Surface Area:</strong>{' '}
                          {formatNum(result.slabSurfaceArea.sqft, 2)} sq ft (
                          {formatNum(result.slabSurfaceArea.sqm, 2)} sq m)
                        </div>
                      )}

                      {result.singleHoleVolume && (
                        <div className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 rounded-lg px-3.5 py-2 border border-slate-200 dark:border-slate-700">
                          <strong>Single Post Hole Volume:</strong>{' '}
                          {formatNum(result.singleHoleVolume.cuft, 3)} cu ft (
                          {formatNum(result.singleHoleVolume.cum, 4)} cu m) per hole
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-red-600 dark:text-red-400">
                  Enter valid positive measurements in Stage 1 to view base
                  quantities.
                </p>
              )}

              <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToStep(1);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 min-h-[44px]"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous: Measurements</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToStep(3);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-colors min-h-[44px]"
                >
                  <span>Next: Waste Allowance</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </section>

            {/* STAGE 3: WASTE ALLOWANCE */}
            <section
              ref={step3Ref}
              onClick={() => setActiveStep(3)}
              aria-labelledby="stage-3-heading"
              className={`bg-white dark:bg-slate-900 rounded-xl border p-5 sm:p-6 shadow-2xs transition-all ${
                activeStep === 3
                  ? 'border-blue-600 dark:border-blue-500 ring-1 ring-blue-600/20'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="pb-4 mb-5 border-b border-slate-200 dark:border-slate-800">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Stage 3 of 4
                </span>
                <h2
                  id="stage-3-heading"
                  className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mt-0.5"
                >
                  Adjust Material Waste Allowance
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Formula:{' '}
                  <code className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                    Adjusted Quantity = Base Quantity × (1 + Waste Percentage ÷ 100)
                  </code>
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                <div className="md:col-span-7 space-y-4">
                  <div>
                    <label
                      htmlFor="waste-percentage-input"
                      className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1.5"
                    >
                      Waste Allowance Percentage (%)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        id="waste-percentage-input"
                        type="number"
                        min="0"
                        max="100"
                        step="0.5"
                        value={inputs.wastePercent}
                        onChange={(e) =>
                          setInputs((prev) => ({
                            ...prev,
                            wastePercent: e.target.value,
                          }))
                        }
                        aria-invalid={Boolean(result.fieldErrors.wastePercent)}
                        className="w-32 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 min-h-[44px]"
                      />
                      <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
                        %
                      </span>
                    </div>
                    {result.fieldErrors.wastePercent && (
                      <p className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">
                        {result.fieldErrors.wastePercent}
                      </p>
                    )}

                    {/* Quick Preset Buttons */}
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1">
                        Quick presets:
                      </span>
                      {['0', '5', '10', '15', '20'].map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() =>
                            setInputs((prev) => ({
                              ...prev,
                              wastePercent: pct,
                            }))
                          }
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors min-h-[36px] ${
                            inputs.wastePercent === pct
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:border-blue-500'
                          }`}
                        >
                          {pct}%
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-lg bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 p-3.5 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5 leading-relaxed">
                    <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                    <div>
                      <strong>Important Note on Waste Allowance:</strong> Waste
                      allowance is an adjustable planning estimate—not a universal
                      construction recommendation. Actual overage depends on your
                      room geometry, diagonal vs. straight layout, subgrade
                      unevenness, and cutting skill. Set to <strong>0%</strong> if
                      you only want the exact geometric measurement.
                    </div>
                  </div>
                </div>

                {/* Waste-Adjusted Output Comparison */}
                <div className="md:col-span-5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Waste-Adjusted Quantity
                  </div>
                  {result.isValid ? (
                    <dl className="space-y-2 text-xs sm:text-sm">
                      <div className="flex justify-between">
                        <dt className="text-slate-600 dark:text-slate-400">
                          Base Quantity:
                        </dt>
                        <dd className="font-mono font-semibold text-slate-900 dark:text-white">
                          {formatNum(result.basePrimaryValue, 3)}{' '}
                          {result.primaryUnitLabel}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-slate-600 dark:text-slate-400">
                          +{result.wastePercent}% Waste Buffer:
                        </dt>
                        <dd className="font-mono font-semibold text-blue-600 dark:text-blue-400">
                          +{formatNum(result.wasteAmountPrimary, 3)}{' '}
                          {result.primaryUnitLabel}
                        </dd>
                      </div>
                      <div className="pt-2.5 border-t border-slate-200 dark:border-slate-700 flex justify-between items-baseline">
                        <dt className="font-bold text-slate-900 dark:text-white">
                          Adjusted Total:
                        </dt>
                        <dd className="text-base sm:text-lg font-extrabold font-mono text-emerald-700 dark:text-emerald-400">
                          {formatNum(result.adjustedPrimaryValue, 3)}{' '}
                          {result.primaryUnitLabel}
                        </dd>
                      </div>
                      {result.adjustedVolume && (
                        <div className="pt-2 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                          Also equals {formatNum(result.adjustedVolume.cuft, 2)} cu
                          ft • {formatNum(result.adjustedVolume.cum, 3)} cu m •{' '}
                          {formatNum(result.adjustedVolume.liters, 1)} L
                        </div>
                      )}
                      {result.adjustedArea && (
                        <div className="pt-2 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                          Also equals {formatNum(result.adjustedArea.sqft, 2)} sq ft
                          • {formatNum(result.adjustedArea.sqm, 2)} sq m •{' '}
                          {formatNum(result.adjustedArea.sqyd, 2)} sq yd
                        </div>
                      )}
                    </dl>
                  ) : (
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Complete Stage 1 measurements to see waste-adjusted quantities.
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToStep(2);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 min-h-[44px]"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous: Quantity</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToStep(4);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-colors min-h-[44px]"
                >
                  <span>Next: Estimated Cost</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </section>

            {/* STAGE 4: ESTIMATED COST */}
            <section
              ref={step4Ref}
              onClick={() => setActiveStep(4)}
              aria-labelledby="stage-4-heading"
              className={`bg-white dark:bg-slate-900 rounded-xl border p-5 sm:p-6 shadow-2xs transition-all ${
                activeStep === 4
                  ? 'border-blue-600 dark:border-blue-500 ring-1 ring-blue-600/20'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 mb-5 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    Stage 4 of 4 (Optional Pricing)
                  </span>
                  <h2
                    id="stage-4-heading"
                    className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mt-0.5"
                  >
                    Package Count &amp; Estimated Material Cost
                  </h2>
                </div>

                {/* Currency Selector */}
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="currency-select"
                    className="text-xs font-semibold text-slate-600 dark:text-slate-300"
                  >
                    Currency:
                  </label>
                  <select
                    id="currency-select"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                    className="rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-bold text-slate-900 dark:text-white min-h-[38px]"
                  >
                    {Object.values(CURRENCIES).map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pricing Mode Switcher: By Package/Bag vs By Direct Unit Price */}
              <div className="mb-5">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  How is your material sold?
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setInputs((prev) => ({ ...prev, pricingMode: 'package' }))
                    }
                    className={`p-3.5 rounded-xl border text-left transition-all min-h-[64px] ${
                      inputs.pricingMode === 'package'
                        ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 text-slate-900 dark:text-white'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="text-sm font-bold flex items-center gap-2">
                      <Package className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>
                        {result.quantityKind === 'area'
                          ? 'By Box / Package Coverage'
                          : 'By Pre-Mixed Bag / Container Yield'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      {result.quantityKind === 'area'
                        ? 'Rounds up using Math.ceil(Adjusted Area ÷ Coverage Per Box).'
                        : 'Rounds up using Math.ceil(Adjusted Volume ÷ Yield Per Bag).'}
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setInputs((prev) => ({ ...prev, pricingMode: 'unit' }))
                    }
                    className={`p-3.5 rounded-xl border text-left transition-all min-h-[64px] ${
                      inputs.pricingMode === 'unit'
                        ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 text-slate-900 dark:text-white'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="text-sm font-bold flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>
                        {result.quantityKind === 'area'
                          ? 'By Direct Unit Area Price (per sq ft / sq m)'
                          : 'By Bulk / Ready-Mix Unit Price (per cu yd / cu m)'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      Multiplies your waste-adjusted quantity directly by your unit
                      rate.
                    </p>
                  </button>
                </div>
              </div>

              {inputs.pricingMode === 'package' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Coverage or Yield per Package/Bag */}
                  <div>
                    <label
                      htmlFor="package-yield-input"
                      className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1.5"
                    >
                      {result.quantityKind === 'area'
                        ? 'Coverage per Box / Package'
                        : 'Actual Yield per Bag / Container'}
                    </label>
                    <div className="flex items-stretch gap-2">
                      <input
                        id="package-yield-input"
                        type="text"
                        inputMode="decimal"
                        value={inputs.packageYield}
                        onChange={(e) =>
                          setInputs((prev) => ({
                            ...prev,
                            packageYield: e.target.value,
                          }))
                        }
                        placeholder={
                          result.quantityKind === 'area'
                            ? 'e.g. 20'
                            : 'Enter yield from bag label'
                        }
                        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 min-h-[44px]"
                      />
                      <select
                        aria-label="Package coverage or bag yield unit"
                        value={inputs.packageYieldUnit}
                        onChange={(e) =>
                          setInputs((prev) => ({
                            ...prev,
                            packageYieldUnit: e.target.value as
                              | AreaUnit
                              | VolumeUnit,
                          }))
                        }
                        className="rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white min-h-[44px]"
                      >
                        {result.quantityKind === 'area'
                          ? Object.entries(AREA_UNIT_LABELS).map(
                              ([u, label]) => (
                                <option key={u} value={u}>
                                  per {label}
                                </option>
                              )
                            )
                          : Object.entries(VOLUME_UNIT_LABELS).map(
                              ([u, label]) => (
                                <option key={u} value={u}>
                                  {label}
                                </option>
                              )
                            )}
                      </select>
                    </div>
                    {result.fieldErrors.packageYield && (
                      <p className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">
                        {result.fieldErrors.packageYield}
                      </p>
                    )}

                    {/* Helpful label yield examples without inventing a mandatory universal default */}
                    {result.quantityKind === 'volume' && (
                      <div className="mt-2">
                        <span className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                          Check your bag label for exact yield. Optional example
                          bag yields:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            { label: '0.30 cu ft (typical 40 lb)', val: '0.30', unit: 'cuft' as const },
                            { label: '0.45 cu ft (typical 60 lb)', val: '0.45', unit: 'cuft' as const },
                            { label: '0.60 cu ft (typical 80 lb)', val: '0.60', unit: 'cuft' as const },
                            { label: '12 L (typical 25 kg)', val: '12', unit: 'liters' as const },
                          ].map((preset) => (
                            <button
                              key={preset.label}
                              type="button"
                              onClick={() =>
                                setInputs((prev) => ({
                                  ...prev,
                                  packageYield: preset.val,
                                  packageYieldUnit: preset.unit,
                                }))
                              }
                              className="px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-blue-500 text-[11px] font-medium text-slate-700 dark:text-slate-300"
                            >
                              {preset.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Price per Package/Bag */}
                  <div>
                    <label
                      htmlFor="package-price-input"
                      className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1.5"
                    >
                      {result.quantityKind === 'area'
                        ? `Price per Box / Package (${currencyInfo.symbol})`
                        : `Price per Bag / Container (${currencyInfo.symbol})`}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">
                        {currencyInfo.symbol}
                      </span>
                      <input
                        id="package-price-input"
                        type="text"
                        inputMode="decimal"
                        value={inputs.unitOrPackagePrice}
                        onChange={(e) =>
                          setInputs((prev) => ({
                            ...prev,
                            unitOrPackagePrice: e.target.value,
                          }))
                        }
                        placeholder="Enter price per package"
                        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 pl-8 pr-3.5 py-2.5 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 min-h-[44px]"
                      />
                    </div>
                    {result.fieldErrors.unitOrPackagePrice && (
                      <p className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">
                        {result.fieldErrors.unitOrPackagePrice}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="direct-unit-price-input"
                      className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-1.5"
                    >
                      Price per Unit ({currencyInfo.symbol})
                    </label>
                    <div className="flex items-stretch gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">
                          {currencyInfo.symbol}
                        </span>
                        <input
                          id="direct-unit-price-input"
                          type="text"
                          inputMode="decimal"
                          value={inputs.unitOrPackagePrice}
                          onChange={(e) =>
                            setInputs((prev) => ({
                              ...prev,
                              unitOrPackagePrice: e.target.value,
                            }))
                          }
                          placeholder="Enter unit price"
                          className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 pl-8 pr-3.5 py-2.5 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 min-h-[44px]"
                        />
                      </div>
                      <select
                        aria-label="Unit for direct pricing"
                        value={inputs.priceUnit}
                        onChange={(e) =>
                          setInputs((prev) => ({
                            ...prev,
                            priceUnit: e.target.value as AreaUnit | VolumeUnit,
                          }))
                        }
                        className="rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white min-h-[44px]"
                      >
                        {result.quantityKind === 'area'
                          ? Object.entries(AREA_UNIT_LABELS).map(
                              ([u, label]) => (
                                <option key={u} value={u}>
                                  per {label}
                                </option>
                              )
                            )
                          : Object.entries(VOLUME_UNIT_LABELS).map(
                              ([u, label]) => (
                                <option key={u} value={u}>
                                  per {label}
                                </option>
                              )
                            )}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Prompts when optional yield or price is not yet entered */}
              {result.isValid && result.missingCostPrompts.length > 0 && (
                <div className="mt-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 p-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-1.5">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span>
                      Your quantities are ready ({formatNum(result.adjustedPrimaryValue, 2)}{' '}
                      {result.primaryUnitLabel} with waste). Optional cost inputs:
                    </span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 dark:text-slate-300">
                    {result.missingCostPrompts.map((prompt, idx) => (
                      <li key={idx}>{prompt}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToStep(3);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 min-h-[44px]"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous: Waste Allowance</span>
                </button>
              </div>
            </section>
          </div>

          {/* RIGHT 4 COLS: LIVE FINAL SUMMARY & ASSUMPTIONS */}
          <aside className="lg:col-span-4 lg:sticky lg:top-20 space-y-5">
            <div className="bg-white dark:bg-slate-900 rounded-xl border-2 border-blue-600 dark:border-blue-500 p-5 shadow-sm">
              <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                    Project Summary
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Updates automatically as you edit any stage
                  </p>
                </div>
                {result.isEstimate && (
                  <span className="px-2.5 py-1 rounded-md bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700 text-[11px] font-bold text-amber-900 dark:text-amber-200">
                    Estimate
                  </span>
                )}
              </div>

              {result.isValid ? (
                <div className="space-y-4">
                  {/* 1. Calculated Base Quantity */}
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">
                      1. Base Quantity:
                    </span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {formatNum(result.basePrimaryValue, 2)}{' '}
                      {result.primaryUnitLabel}
                    </span>
                  </div>

                  {/* 2. Waste-Adjusted Quantity */}
                  <div className="rounded-lg bg-slate-50 dark:bg-slate-800/70 p-3 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-baseline justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>Waste Allowance ({result.wastePercent}%):</span>
                      <span className="font-mono">
                        +{formatNum(result.wasteAmountPrimary, 2)}{' '}
                        {result.primaryUnitLabel}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between mt-1">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        2. Waste-Adjusted Quantity:
                      </span>
                      <span className="text-base font-extrabold font-mono text-blue-600 dark:text-blue-400">
                        {formatNum(result.adjustedPrimaryValue, 2)}{' '}
                        {result.primaryUnitLabel}
                      </span>
                    </div>
                  </div>

                  {/* 3. Package / Bag Count */}
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">
                      3. Packages / Bags:
                    </span>
                    {result.packageCount !== null ? (
                      <span className="font-mono font-extrabold text-slate-900 dark:text-white">
                        {result.packageCount} units
                      </span>
                    ) : (
                      <span className="text-xs italic text-slate-400 dark:text-slate-500">
                        Enter yield in Stage 4
                      </span>
                    )}
                  </div>

                  {/* 4. User-Entered Price */}
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">
                      4. Entered Material Price:
                    </span>
                    {result.hasPriceInput && result.enteredPriceValue !== null ? (
                      <span className="font-mono font-semibold text-slate-900 dark:text-white">
                        {formatCurrency(result.enteredPriceValue)}{' '}
                        {inputs.pricingMode === 'package'
                          ? '/ unit'
                          : `/ ${
                              result.quantityKind === 'area'
                                ? AREA_UNIT_LABELS[inputs.priceUnit as AreaUnit]
                                : VOLUME_UNIT_LABELS[
                                    inputs.priceUnit as VolumeUnit
                                  ]
                            }`}
                      </span>
                    ) : (
                      <span className="text-xs italic text-slate-400 dark:text-slate-500">
                        Not entered (optional)
                      </span>
                    )}
                  </div>

                  {/* 5. Estimated Total Cost */}
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        5. Estimated Total Cost:
                      </span>
                      {result.estimatedTotalCost !== null ? (
                        <span className="text-2xl font-extrabold font-mono text-emerald-700 dark:text-emerald-400">
                          {formatCurrency(result.estimatedTotalCost)}
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          Awaiting price input
                        </span>
                      )}
                    </div>
                    {result.isEstimate && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        Labeled as an <strong>estimate</strong> because waste
                        allowance, package rounding, or material prices depend on
                        your entered assumptions.
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={handleCopySummary}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors min-h-[42px]"
                    >
                      {copiedSummary ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Summary</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors min-h-[42px]"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-red-600 dark:text-red-400 py-2">
                  Please enter valid positive project dimensions in Stage 1 to
                  generate your summary.
                </div>
              )}
            </div>

            {/* Calculation Assumptions Disclosure Card */}
            {result.isValid && result.assumptions.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-2xs">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-2.5">
                  <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Assumptions Used in This Calculation</span>
                </h3>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed list-disc list-inside">
                  {result.assumptions.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>

        {/* Formula Reference & Related Construction Tools */}
        <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-2xs space-y-5">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Construction Formulas, Figuring Yards of Concrete &amp; Material Reference
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Every stage of this workflow uses standard geometric formulas after
              normalizing all measurements to a single base unit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
              <div className="font-bold text-slate-900 dark:text-white">
                Rectangular Area, Linear Feet &amp; Flooring
              </div>
              <p className="font-mono text-xs text-blue-600 dark:text-blue-400 mt-1">
                Area = Length × Width (Sq Ft = Linear Ft × Width in ft)
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5">
                1 square yard = 9 sq ft. 1 square meter ≈ 10.7639 sq ft. A standard 4×8 plywood sheet covers 32 sq ft.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
              <div className="font-bold text-slate-900 dark:text-white">
                Concrete Slab &amp; 1,000 Sq Ft to Cubic Yards
              </div>
              <p className="font-mono text-xs text-blue-600 dark:text-blue-400 mt-1">
                Cubic Yards (yd³) = (Sq Ft × Depth in ft) ÷ 27
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5">
                For <strong>1,000 sq ft</strong>: at <strong>4 in</strong> slab thickness, volume is <strong>12.35 yd³</strong> (<code className="font-mono">1,000 × 4/12 ÷ 27</code>); at <strong>3 in</strong> mulch depth, <strong>9.26 yd³</strong>. 1 yd³ of crushed gravel weighs ≈ <strong>1.35–1.42 US tons</strong>.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
              <div className="font-bold text-slate-900 dark:text-white">
                Fence Post Holes &amp; Cylindrical Footings
              </div>
              <p className="font-mono text-xs text-blue-600 dark:text-blue-400 mt-1">
                Volume = π × (Diameter ÷ 2)² × Depth × Holes
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5">
                An 80-lb bag of premixed concrete yields about <strong>0.60 ft³</strong> (<code className="font-mono">45 bags per yd³</code>), and a 60-lb bag yields <strong>0.45 ft³</strong> (<code className="font-mono">60 bags per yd³</code>).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-4 space-y-1">
              <div className="font-extrabold text-amber-900 dark:text-amber-200 uppercase tracking-wide text-xs">
                Calculation Note · Why a &quot;4-Inch Slab&quot; Often Needs a 5%–10% Subgrade Buffer
              </div>
              <p className="text-amber-950/80 dark:text-amber-100/80 leading-relaxed text-xs">
                Compacted gravel subgrades are rarely laser-flat: if your excavation dips from 4.0 inches to just 4.5 inches in the center of the patio, your concrete volume increases by 12.5% across that zone. Including a 5% to 10% subgrade waste buffer helps prevent running short on a ready-mix pour.
              </p>
            </div>
            <div className="rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 p-4 space-y-1">
              <div className="font-extrabold text-emerald-900 dark:text-emerald-200 uppercase tracking-wide text-xs">
                Ordering Note · Bagged Mix vs. Ready-Mix Truck Volume Comparison
              </div>
              <p className="text-emerald-950/80 dark:text-emerald-100/80 leading-relaxed text-xs">
                One cubic yard (27 ft³) requires 45 bags of 80-lb concrete (at 0.60 ft³ yield per bag, totaling 3,600 lbs). For pours under 1.0 yd³, bagged concrete is commonly used because ready-mix suppliers often apply minimum load fees below 3 to 4 cubic yards.
              </p>
            </div>
          </div>

          {/* Frequently Asked Questions (Google Search Queries) */}
          <div id="faq" className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Frequently Asked Questions About Concrete, Cubic Yards &amp; Bags
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {[
                {
                  q: 'How do I calculate cubic yards of concrete for a slab?',
                  a: 'Multiply Slab Length (ft) × Width (ft) × Thickness in feet (Inches ÷ 12) to get cubic feet, then divide by 27 to convert to cubic yards. For a 10 ft × 10 ft slab at 4 inches thick: 10 × 10 × (4 ÷ 12) ÷ 27 = 1.23 cubic yards.',
                },
                {
                  q: 'How many 80-lb or 60-lb bags of concrete are in 1 cubic yard?',
                  a: 'One cubic yard (27 ft³) requires forty-five 80-lb bags (0.60 ft³ each), sixty 60-lb bags (0.45 ft³ each), or ninety 40-lb bags (0.30 ft³ each).',
                },
                {
                  q: 'How many cubic yards of concrete do I need for 1,000 square feet at 4 inches thick?',
                  a: 'At 4 inches (0.333 ft) thick, 1,000 sq ft requires 1,000 × (4 ÷ 12) ÷ 27 = 12.35 cubic yards net, or about 13.5 cubic yards after adding a 10% subgrade waste buffer.',
                },
                {
                  q: 'How many tons is 1 cubic yard of crushed gravel, sand, or topsoil?',
                  a: 'One cubic yard of compacted crushed gravel or driveway stone weighs about 1.35 to 1.45 US tons (2,700–2,900 lbs). Dry sand weighs ~1.35 tons/yd³, and screened topsoil weighs ~1.05 to 1.20 tons/yd³.',
                },
                {
                  q: 'How many bags of concrete do I need for a fence post hole?',
                  a: 'A standard 10-inch diameter hole dug 30 inches (2.5 ft) deep has a cylinder volume of 1.36 ft³, which takes about two and a half 80-lb bags or three 60-lb bags per post.',
                },
                {
                  q: 'How many 2-cubic-foot bags of mulch are in a cubic yard?',
                  a: 'Because 1 cubic yard equals 27 cubic feet, divide 27 by 2 ft³ per bag = 13.5 bags (round up to 14 bags per cubic yard).',
                },
                {
                  q: 'Why should I add 5% to 10% extra concrete when ordering a ready-mix truck?',
                  a: 'Excavated dirt and gravel subgrades often dip by 0.25 to 0.5 inches across a span, and wooden forms bow slightly under wet concrete pressure. Ordering 10% extra prevents a costly short-load callback.',
                },
              ].map((faq) => (
                <div
                  key={faq.q}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1"
                >
                  <div className="font-bold text-slate-900 dark:text-white">
                    {faq.q}
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-3 text-xs sm:text-sm">
            <span className="font-bold text-slate-700 dark:text-slate-300">
              Related Tools:
            </span>
            <Link
              href="/home-construction/flooring-calculator"
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              Flooring &amp; Vinyl Plank Calculator
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link
              href="/conversions/volume"
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              Cubic Yards &amp; Volume Converter
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link
              href="/conversions/area"
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              Square Feet &amp; Area Converter
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link
              href="/conversions/weight"
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              Tons &amp; Weight Converter
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link
              href="/calculation-methodology"
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              Calculation Methodology
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link
              href="/contact"
              className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              Contact
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link
              href="/contact#report-error"
              className="text-rose-600 dark:text-rose-400 hover:underline font-semibold"
            >
              Report an error
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
