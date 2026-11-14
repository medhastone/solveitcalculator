'use client';

import React, { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  Calculator,
  Search,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  Check,
  CheckCircle2,
  Settings,
  Info,
  Copy,
  Printer,
  RotateCcw,
  Ruler,
  Package,
  Hammer,
  ArrowLeftRight,
  FileCheck2,
  HelpCircle,
} from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';

type LengthUnit = 'm' | 'cm' | 'ft' | 'in';
type AreaDisplayUnit = 'm2' | 'sqft';
type CurrencyCode = 'INR' | 'USD' | 'GBP' | 'EUR';

interface CurrencyOption {
  code: CurrencyCode;
  symbol: string;
  label: string;
  locale: string;
}

const CURRENCIES: Record<CurrencyCode, CurrencyOption> = {
  INR: { code: 'INR', symbol: '₹', label: '₹ (INR)', locale: 'en-IN' },
  USD: { code: 'USD', symbol: '$', label: '$ (USD)', locale: 'en-US' },
  GBP: { code: 'GBP', symbol: '£', label: '£ (GBP)', locale: 'en-GB' },
  EUR: { code: 'EUR', symbol: '€', label: '€ (EUR)', locale: 'de-DE' },
};

const FLOORING_MATERIALS = [
  {
    id: 'laminate',
    name: 'Laminate Flooring',
    recommendedWaste: 10,
    note: 'Standard plank layout typically needs 8%–10% waste allowance.',
    defaultBoxCoverageM2: '2.2',
  },
  {
    id: 'hardwood',
    name: 'Solid / Engineered Hardwood',
    recommendedWaste: 10,
    note: 'Add 10% for standard plank cuts and board grading selection.',
    defaultBoxCoverageM2: '1.8',
  },
  {
    id: 'vinyl',
    name: 'Luxury Vinyl Plank (LVP)',
    recommendedWaste: 10,
    note: 'Click-lock vinyl planks usually require 8%–10% cutting waste.',
    defaultBoxCoverageM2: '2.4',
  },
  {
    id: 'tile',
    name: 'Ceramic / Porcelain Tile',
    recommendedWaste: 12,
    note: 'Tiles require 10%–15% extra for perimeter cuts and breakage.',
    defaultBoxCoverageM2: '1.44',
  },
  {
    id: 'carpet',
    name: 'Broadloom / Carpet Tiles',
    recommendedWaste: 8,
    note: 'Carpet tiles need ~5%–8% extra; roll carpet depends on roll width.',
    defaultBoxCoverageM2: '5.0',
  },
];

const HELP_TOPICS = [
  {
    id: 'measure',
    question: 'How to measure a room?',
    answer:
      'Measure the longest wall-to-wall distance for Length and the widest wall-to-wall distance for Width. Measure into doorways so your flooring extends neatly under doors. For L-shaped rooms, split the space into two rectangles and add their areas together.',
  },
  {
    id: 'waste',
    question: 'What is waste allowance?',
    answer:
      'Waste allowance is extra flooring added to your exact room area to cover end-of-row board cuts, fitting around obstacles, damaged planks, and keeping 1–2 spare boards for future repairs. A 10% buffer is standard for rectangular rooms.',
  },
  {
    id: 'cost',
    question: 'How is the cost estimated?',
    answer:
      'We multiply your Total Material Needed (room area plus waste allowance) by the price per unit area you enter. If you enable box rounding or underlayment/installation in Advanced Settings, those costs are itemized separately.',
  },
  {
    id: 'materials',
    question: 'Common flooring materials',
    answer:
      'Laminate and Luxury Vinyl Plank (LVP) are durable, cost-effective floating floors. Hardwood offers long-term value and can be refinished. Ceramic or porcelain tile is ideal for kitchens, hallways, and humid climates.',
  },
];

function toMetres(value: number, unit: LengthUnit): number {
  switch (unit) {
    case 'm':
      return value;
    case 'cm':
      return value / 100;
    case 'ft':
      return value * 0.3048;
    case 'in':
      return value * 0.0254;
  }
}

function toFeet(value: number, unit: LengthUnit): number {
  switch (unit) {
    case 'm':
      return value / 0.3048;
    case 'cm':
      return value / 30.48;
    case 'ft':
      return value;
    case 'in':
      return value / 12;
  }
}

export default function FlooringProjectCalculatorClient() {
  // Active step highlight & refs for smooth navigation
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);

  // Step 1: Room dimensions
  const [lengthInput, setLengthInput] = useState<string>('5');
  const [lengthUnit, setLengthUnit] = useState<LengthUnit>('m');
  const [widthInput, setWidthInput] = useState<string>('4');
  const [widthUnit, setWidthUnit] = useState<LengthUnit>('m');
  const [areaUnit, setAreaUnit] = useState<AreaDisplayUnit>('m2');

  // Step 2: Materials & Waste
  const [wasteInput, setWasteInput] = useState<string>('10');
  const [materialId, setMaterialId] = useState<string>('laminate');

  // Step 3: Cost Estimate
  const [currency, setCurrency] = useState<CurrencyCode>('INR');
  const [pricePerUnitInput, setPricePerUnitInput] = useState<string>('500');

  // Advanced settings
  const [advancedOpen, setAdvancedOpen] = useState<boolean>(false);
  const [roundToBoxes, setRoundToBoxes] = useState<boolean>(false);
  const [boxCoverageInput, setBoxCoverageInput] = useState<string>('2.2');
  const [underlaymentCostInput, setUnderlaymentCostInput] = useState<string>('0');
  const [installationCostInput, setInstallationCostInput] = useState<string>('0');

  // Help accordion in right sidebar
  const [openHelpId, setOpenHelpId] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [recalculatedFlash, setRecalculatedFlash] = useState<boolean>(false);

  const handleUnitChange = (newUnit: LengthUnit, target: 'length' | 'width') => {
    if (target === 'length') {
      setLengthUnit(newUnit);
    } else {
      setWidthUnit(newUnit);
    }
    // Automatically align area unit when both units are imperial vs metric
    const nextLengthUnit = target === 'length' ? newUnit : lengthUnit;
    const nextWidthUnit = target === 'width' ? newUnit : widthUnit;
    if (
      (nextLengthUnit === 'ft' || nextLengthUnit === 'in') &&
      (nextWidthUnit === 'ft' || nextWidthUnit === 'in')
    ) {
      setAreaUnit('sqft');
    } else if (
      (nextLengthUnit === 'm' || nextLengthUnit === 'cm') &&
      (nextWidthUnit === 'm' || nextWidthUnit === 'cm')
    ) {
      setAreaUnit('m2');
    }
  };

  const selectedMaterial = useMemo(
    () =>
      FLOORING_MATERIALS.find((m) => m.id === materialId) ||
      FLOORING_MATERIALS[0],
    [materialId]
  );

  const calculation = useMemo(() => {
    const rawLength = parseFloat(lengthInput);
    const rawWidth = parseFloat(widthInput);
    const rawWaste = parseFloat(wasteInput);
    const rawPrice = parseFloat(pricePerUnitInput);

    const lengthValid = !isNaN(rawLength) && rawLength > 0 && rawLength <= 10000;
    const widthValid = !isNaN(rawWidth) && rawWidth > 0 && rawWidth <= 10000;
    const wasteValid = !isNaN(rawWaste) && rawWaste >= 0 && rawWaste <= 100;
    const priceValid = !isNaN(rawPrice) && rawPrice >= 0;

    let errorMessage: string | null = null;
    if (!lengthValid && !widthValid) {
      errorMessage = 'Please enter positive numbers for both room length and width.';
    } else if (!lengthValid) {
      errorMessage = 'Please enter a valid room length greater than 0.';
    } else if (!widthValid) {
      errorMessage = 'Please enter a valid room width greater than 0.';
    } else if (!wasteValid) {
      errorMessage = 'Waste allowance must be between 0% and 100%.';
    }

    const safeLength = lengthValid ? rawLength : 0;
    const safeWidth = widthValid ? rawWidth : 0;
    const safeWastePct = wasteValid ? rawWaste : 0;
    const safePrice = priceValid ? rawPrice : 0;

    const lengthM = toMetres(safeLength, lengthUnit);
    const widthM = toMetres(safeWidth, widthUnit);
    const lengthFt = toFeet(safeLength, lengthUnit);
    const widthFt = toFeet(safeWidth, widthUnit);

    const areaM2 = lengthM * widthM;
    const areaSqFt = lengthFt * widthFt;

    const baseArea = areaUnit === 'm2' ? areaM2 : areaSqFt;
    const wasteArea = baseArea * (safeWastePct / 100);
    const totalAreaNeeded = baseArea + wasteArea;

    // Advanced: Box rounding
    const rawBoxCoverage = parseFloat(boxCoverageInput);
    const validBoxCoverage =
      !isNaN(rawBoxCoverage) && rawBoxCoverage > 0 ? rawBoxCoverage : 2.2;
    const boxesNeeded =
      totalAreaNeeded > 0 ? Math.ceil(totalAreaNeeded / validBoxCoverage) : 0;
    const boxedTotalArea = boxesNeeded * validBoxCoverage;

    const billableMaterialArea =
      advancedOpen && roundToBoxes ? boxedTotalArea : totalAreaNeeded;

    const materialCost = billableMaterialArea * safePrice;

    // Advanced: Underlayment & Installation
    const rawUnderlayment = parseFloat(underlaymentCostInput);
    const rawInstallation = parseFloat(installationCostInput);
    const safeUnderlaymentRate =
      advancedOpen && !isNaN(rawUnderlayment) && rawUnderlayment > 0
        ? rawUnderlayment
        : 0;
    const safeInstallationRate =
      advancedOpen && !isNaN(rawInstallation) && rawInstallation > 0
        ? rawInstallation
        : 0;

    const underlaymentTotalCost = totalAreaNeeded * safeUnderlaymentRate;
    const installationTotalCost = baseArea * safeInstallationRate;
    const grandTotalCost =
      materialCost + underlaymentTotalCost + installationTotalCost;

    return {
      isValid: lengthValid && widthValid && wasteValid,
      lengthValid,
      widthValid,
      wasteValid,
      priceValid,
      errorMessage,
      safeLength,
      safeWidth,
      safeWastePct,
      safePrice,
      baseArea,
      wasteArea,
      totalAreaNeeded,
      boxesNeeded,
      boxedTotalArea,
      validBoxCoverage,
      billableMaterialArea,
      materialCost,
      underlaymentTotalCost,
      installationTotalCost,
      grandTotalCost,
      areaM2,
      areaSqFt,
    };
  }, [
    lengthInput,
    lengthUnit,
    widthInput,
    widthUnit,
    areaUnit,
    wasteInput,
    pricePerUnitInput,
    advancedOpen,
    roundToBoxes,
    boxCoverageInput,
    underlaymentCostInput,
    installationCostInput,
  ]);

  const currentCurrency = CURRENCIES[currency];
  const areaSymbol = areaUnit === 'm2' ? 'm²' : 'sq ft';

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat(currentCurrency.locale, {
      maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatArea = (value: number) => {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const navigateToStep = (step: 1 | 2 | 3) => {
    setActiveStep(step);
    const targetRef =
      step === 1 ? step1Ref : step === 2 ? step2Ref : step3Ref;
    if (targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleReset = () => {
    setLengthInput('5');
    setLengthUnit('m');
    setWidthInput('4');
    setWidthUnit('m');
    setAreaUnit('m2');
    setWasteInput('10');
    setMaterialId('laminate');
    setCurrency('INR');
    setPricePerUnitInput('500');
    setRoundToBoxes(false);
    setBoxCoverageInput('2.2');
    setUnderlaymentCostInput('0');
    setInstallationCostInput('0');
    setActiveStep(1);
  };

  const handleRecalculate = () => {
    setActiveStep(3);
    setRecalculatedFlash(true);
    setTimeout(() => setRecalculatedFlash(false), 900);
  };

  const handleCopyEstimate = () => {
    const summaryText = [
      `SolveItCalculator — Flooring Project Estimate`,
      `Room Dimensions: ${calculation.safeLength} ${lengthUnit} × ${calculation.safeWidth} ${widthUnit}`,
      `Room Area (without waste): ${formatArea(calculation.baseArea)} ${areaSymbol}`,
      `Flooring Material: ${selectedMaterial.name}`,
      `Waste Allowance (${calculation.safeWastePct}%): +${formatArea(calculation.wasteArea)} ${areaSymbol}`,
      `Total Material Needed: ${formatArea(calculation.totalAreaNeeded)} ${areaSymbol}`,
      `Estimated Material Cost: ${currentCurrency.symbol} ${formatMoney(calculation.materialCost)} (${formatArea(calculation.billableMaterialArea)} ${areaSymbol} × ${currentCurrency.symbol} ${calculation.safePrice} per ${areaSymbol})`,
      calculation.grandTotalCost > calculation.materialCost
        ? `Total Project Estimate (with Underlayment/Installation): ${currentCurrency.symbol} ${formatMoney(calculation.grandTotalCost)}`
        : '',
    ]
      .filter(Boolean)
      .join('\n');

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#152238] flex flex-col font-sans">
      {/* Top Website Header */}
      <header className="bg-white border-b border-[#DCE3EE] sticky top-0 z-30">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <BrandLogo variant="compact" />

          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center gap-7 text-[14px] font-semibold text-[#334155]"
          >
            <Link
              href="/math"
              className="hover:text-[#2457D6] transition-colors py-1"
            >
              Math
            </Link>
            <Link
              href="/finance"
              className="hover:text-[#2457D6] transition-colors py-1"
            >
              Finance
            </Link>
            <Link
              href="/conversions"
              className="hover:text-[#2457D6] transition-colors py-1"
            >
              Unit Conversion
            </Link>
            <Link
              href="/date-time"
              className="hover:text-[#2457D6] transition-colors py-1"
            >
              Date and Time
            </Link>
            <Link
              href="/calculators"
              className="inline-flex items-center gap-1 hover:text-[#2457D6] transition-colors py-1"
            >
              <span>All Calculators</span>
              <ChevronDown className="w-4 h-4 text-[#64748B]" />
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/search?q=flooring"
              aria-label="Search calculators"
              className="w-10 h-10 rounded-lg border border-[#DCE3EE] bg-[#F8FAFC] hover:bg-[#EEF4FF] hover:border-[#2457D6] flex items-center justify-center text-[#334155] hover:text-[#2457D6] transition-colors"
            >
              <Search className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Banner with Breadcrumb and Flooring Illustration */}
      <section className="bg-gradient-to-r from-[#EEF3FA] via-[#F3F7FC] to-[#E6EFFB] border-b border-[#DCE5F2] relative overflow-hidden">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-7 relative z-10">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-1.5 text-[13px] font-medium text-[#5A6A85] mb-3"
          >
            <Link
              href="/"
              className="text-[#2457D6] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] rounded"
            >
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
            <Link
              href="/home-construction"
              className="text-[#2457D6] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] rounded"
            >
              Home and Construction
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
            <span className="text-[#334155] font-semibold">
              Flooring Calculator
            </span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-2xl">
              <h1 className="text-[28px] sm:text-[36px] font-extrabold text-[#152238] tracking-tight leading-tight mb-2">
                Estimate Your Flooring Project
              </h1>
              <p className="text-[15px] sm:text-[16px] text-[#475569] leading-relaxed">
                Calculate room area, estimate flooring quantity and get an
                estimated material cost in a few simple steps.
              </p>
            </div>

            {/* Right Decorative Flooring Planks + Tape Measure Graphic */}
            <div
              aria-hidden="true"
              className="hidden md:flex items-center gap-4 select-none pr-2"
            >
              <div className="relative w-[290px] h-[96px] rounded-2xl bg-white/75 border border-[#D5E2F6] shadow-xs p-3 flex items-center justify-between overflow-hidden">
                {/* Isometric Flooring Plank Stack */}
                <div className="flex flex-col gap-1.5 z-10">
                  <div className="flex items-center gap-1.5">
                    <span className="w-24 h-4 rounded-sm bg-[#D69E5C] border border-[#B77D3B] shadow-2xs" />
                    <span className="w-12 h-4 rounded-sm bg-[#C68B49] border border-[#A86E2E]" />
                  </div>
                  <div className="flex items-center gap-1.5 pl-3">
                    <span className="w-16 h-4 rounded-sm bg-[#E0AE70] border border-[#C28A48]" />
                    <span className="w-20 h-4 rounded-sm bg-[#CC9250] border border-[#AC7334]" />
                  </div>
                  <div className="flex items-center gap-1.5 pl-1">
                    <span className="w-28 h-4 rounded-sm bg-[#B97E3E] border border-[#996124]" />
                    <span className="w-10 h-4 rounded-sm bg-[#D69E5C] border border-[#B77D3B]" />
                  </div>
                </div>

                {/* Yellow Tape Measure Badge */}
                <div className="relative z-10 flex flex-col items-end">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FBBF24] to-[#D97706] border-2 border-white shadow-sm flex flex-col items-center justify-center text-[#152238]">
                    <Ruler className="w-6 h-6 text-[#152238]" />
                    <span className="text-[10px] font-extrabold tracking-wider uppercase mt-0.5">
                      {areaSymbol}
                    </span>
                  </div>
                  <div className="mt-1 bg-[#EBF2FF] border border-[#BFDBFE] text-[#2457D6] text-[11px] font-bold px-2 py-0.5 rounded">
                    {formatArea(calculation.baseArea)} {areaSymbol}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <main className="max-w-[1240px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 flex-1">
        {/* Three-Step Top Progress Indicator */}
        <nav
          aria-label="Calculation Workflow Steps"
          className="bg-white rounded-xl border border-[#DCE3EE] shadow-2xs overflow-hidden grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#E2E8F0]"
        >
          {[
            {
              step: 1 as const,
              title: 'Measure the room',
              subtitle: 'Enter room dimensions',
            },
            {
              step: 2 as const,
              title: 'Estimate materials',
              subtitle: 'Add waste and choose material',
            },
            {
              step: 3 as const,
              title: 'Estimate cost',
              subtitle: 'See quantity and cost estimate',
            },
          ].map((item) => {
            const isActive = activeStep === item.step;
            return (
              <button
                key={item.step}
                type="button"
                onClick={() => navigateToStep(item.step)}
                className={`w-full text-left px-5 py-4 flex items-center gap-3.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#2457D6] ${
                  isActive
                    ? 'bg-[#EEF4FF]/90 border-b-2 md:border-b-0 border-[#2457D6]'
                    : 'bg-white hover:bg-[#F8FAFC]'
                }`}
              >
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-[14px] font-bold shrink-0 transition-colors ${
                    isActive
                      ? 'bg-[#2457D6] text-white shadow-2xs'
                      : 'bg-[#E2E8F0] text-[#475569]'
                  }`}
                >
                  {item.step}
                </span>
                <div className="min-w-0">
                  <div
                    className={`text-[15px] font-bold leading-snug ${
                      isActive ? 'text-[#2457D6]' : 'text-[#152238]'
                    }`}
                  >
                    {item.title}
                  </div>
                  <div className="text-[12.5px] text-[#64748B] truncate">
                    {item.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Validation Banner if any input is out of range */}
        {calculation.errorMessage && (
          <div
            role="alert"
            className="bg-[#FFF5F5] border border-[#FEB2B2] text-[#9B1C1C] rounded-xl px-4 py-3 text-[14px] font-medium flex items-center gap-2.5"
          >
            <Info className="w-4 h-4 shrink-0 text-[#E53E3E]" />
            <span>{calculation.errorMessage}</span>
          </div>
        )}

        {/* Row 1: Step 1 (Left 8 cols) + Progress / Summary / Need Help Sidebar (Right 4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Step 1 Card */}
          <section
            ref={step1Ref}
            onClick={() => setActiveStep(1)}
            aria-labelledby="step-1-heading"
            className={`lg:col-span-8 bg-white rounded-xl border transition-all p-5 sm:p-6 shadow-2xs ${
              activeStep === 1
                ? 'border-[#2457D6] ring-1 ring-[#2457D6]/20'
                : 'border-[#DCE3EE]'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-5 border-b border-[#E2E8F0]">
              <div>
                <h2
                  id="step-1-heading"
                  className="text-[20px] font-extrabold text-[#152238]"
                >
                  Step 1: Measure the room
                </h2>
                <p className="text-[14px] text-[#5A6A85] mt-0.5">
                  Enter the length and width of the room you want to floor.
                </p>
              </div>

              {/* Output Area Unit Switcher */}
              <div className="inline-flex items-center rounded-lg bg-[#F1F5F9] p-1 border border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setAreaUnit('m2');
                  }}
                  className={`px-2.5 py-1 rounded-md text-[12px] font-semibold transition-colors ${
                    areaUnit === 'm2'
                      ? 'bg-white text-[#2457D6] shadow-2xs'
                      : 'text-[#475569] hover:text-[#152238]'
                  }`}
                >
                  Area in m²
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setAreaUnit('sqft');
                  }}
                  className={`px-2.5 py-1 rounded-md text-[12px] font-semibold transition-colors ${
                    areaUnit === 'sqft'
                      ? 'bg-white text-[#2457D6] shadow-2xs'
                      : 'text-[#475569] hover:text-[#152238]'
                  }`}
                >
                  Area in sq ft
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* Left Inputs + Visual Room Diagram */}
              <div className="md:col-span-7 space-y-4">
                {/* Length Input Row */}
                <div>
                  <label
                    htmlFor="room-length-input"
                    className="block text-[14px] font-bold text-[#152238] mb-1.5"
                  >
                    Length <span className="text-[#E53E3E]">*</span>
                  </label>
                  <div className="flex items-stretch gap-2">
                    <input
                      id="room-length-input"
                      type="number"
                      inputMode="decimal"
                      min="0.1"
                      step="any"
                      value={lengthInput}
                      onChange={(e) => setLengthInput(e.target.value)}
                      placeholder="5"
                      aria-invalid={!calculation.lengthValid}
                      className={`w-full rounded-lg border px-3.5 py-2.5 text-[16px] font-semibold text-[#152238] bg-white focus:outline-none focus:ring-2 transition-colors ${
                        calculation.lengthValid
                          ? 'border-[#CBD5E1] focus:border-[#2457D6] focus:ring-[#2457D6]/20'
                          : 'border-[#E53E3E] bg-[#FFF5F5] focus:ring-[#E53E3E]/20'
                      }`}
                    />
                    <select
                      aria-label="Room length unit"
                      value={lengthUnit}
                      onChange={(e) =>
                        handleUnitChange(e.target.value as LengthUnit, 'length')
                      }
                      className="rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] px-3 py-2.5 text-[14px] font-semibold text-[#152238] focus:outline-none focus:border-[#2457D6] focus:ring-2 focus:ring-[#2457D6]/20 shrink-0"
                    >
                      <option value="m">Metres (m)</option>
                      <option value="cm">Centimetres (cm)</option>
                      <option value="ft">Feet (ft)</option>
                      <option value="in">Inches (in)</option>
                    </select>
                  </div>
                  <p className="text-[12px] text-[#64748B] mt-1">
                    Example: 4.5 m or 15 ft
                  </p>
                </div>

                {/* Width Input Row */}
                <div>
                  <label
                    htmlFor="room-width-input"
                    className="block text-[14px] font-bold text-[#152238] mb-1.5"
                  >
                    Width <span className="text-[#E53E3E]">*</span>
                  </label>
                  <div className="flex items-stretch gap-2">
                    <input
                      id="room-width-input"
                      type="number"
                      inputMode="decimal"
                      min="0.1"
                      step="any"
                      value={widthInput}
                      onChange={(e) => setWidthInput(e.target.value)}
                      placeholder="4"
                      aria-invalid={!calculation.widthValid}
                      className={`w-full rounded-lg border px-3.5 py-2.5 text-[16px] font-semibold text-[#152238] bg-white focus:outline-none focus:ring-2 transition-colors ${
                        calculation.widthValid
                          ? 'border-[#CBD5E1] focus:border-[#2457D6] focus:ring-[#2457D6]/20'
                          : 'border-[#E53E3E] bg-[#FFF5F5] focus:ring-[#E53E3E]/20'
                      }`}
                    />
                    <select
                      aria-label="Room width unit"
                      value={widthUnit}
                      onChange={(e) =>
                        handleUnitChange(e.target.value as LengthUnit, 'width')
                      }
                      className="rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] px-3 py-2.5 text-[14px] font-semibold text-[#152238] focus:outline-none focus:border-[#2457D6] focus:ring-2 focus:ring-[#2457D6]/20 shrink-0"
                    >
                      <option value="m">Metres (m)</option>
                      <option value="cm">Centimetres (cm)</option>
                      <option value="ft">Feet (ft)</option>
                      <option value="in">Inches (in)</option>
                    </select>
                  </div>
                  <p className="text-[12px] text-[#64748B] mt-1">
                    Example: 3.2 m or 10 ft
                  </p>
                </div>

                {/* Immediate Live Output Summary Right After Inputs */}
                <div
                  role="status"
                  aria-live="polite"
                  className="rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] p-4 space-y-2.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#065F46] bg-[#D1FAE5] px-2 py-0.5 rounded-md">
                      Live Project Output
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateToStep(3);
                      }}
                      className="text-xs font-bold text-[#2457D6] hover:underline cursor-pointer"
                    >
                      Customize Material &amp; Cost ↓
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2.5 pt-0.5">
                    <div>
                      <div className="text-[11px] font-semibold text-[#065F46]">
                        Room Area
                      </div>
                      <div className="text-base sm:text-lg font-extrabold text-[#15803D] tabular-nums">
                        {formatArea(calculation.baseArea)} {areaSymbol}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold text-[#065F46]">
                        With {calculation.safeWastePct}% Waste
                      </div>
                      <div className="text-base sm:text-lg font-extrabold text-[#152238] tabular-nums">
                        {formatArea(calculation.totalAreaNeeded)} {areaSymbol}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold text-[#065F46]">
                        Est. Material Cost
                      </div>
                      <div className="text-base sm:text-lg font-extrabold text-[#2457D6] tabular-nums">
                        {currentCurrency.symbol} {formatMoney(calculation.materialCost)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Visual Room Diagram */}
                <div className="pt-2">
                  <div className="rounded-xl border border-[#DCE5F2] bg-[#F8FAFC] p-4">
                    {/* Top Length Arrow Label */}
                    <div className="flex items-center justify-center gap-2 text-[12.5px] font-bold text-[#2457D6] mb-1.5 pl-8">
                      <span className="h-[1.5px] flex-1 bg-[#2457D6]/50 relative">
                        <span className="absolute -left-1 -top-[3px] w-2 h-2 border-l-2 border-b-2 border-[#2457D6] rotate-45" />
                      </span>
                      <span>
                        Length ({calculation.safeLength} {lengthUnit})
                      </span>
                      <span className="h-[1.5px] flex-1 bg-[#2457D6]/50 relative">
                        <span className="absolute -right-1 -top-[3px] w-2 h-2 border-r-2 border-t-2 border-[#2457D6] rotate-45" />
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      {/* Left Width Vertical Label */}
                      <div className="flex flex-col items-center justify-center text-[12px] font-bold text-[#2457D6] w-7 shrink-0">
                        <span className="w-[1.5px] h-6 bg-[#2457D6]/50" />
                        <span className=" -rotate-90 whitespace-nowrap py-1">
                          Width ({calculation.safeWidth} {widthUnit})
                        </span>
                        <span className="w-[1.5px] h-6 bg-[#2457D6]/50" />
                      </div>

                      {/* Floor Surface Box */}
                      <div className="flex-1 h-[108px] rounded-lg border-2 border-[#2457D6] bg-gradient-to-br from-[#F6E6D2] via-[#F2DEC4] to-[#E9CFAF] flex flex-col items-center justify-center px-3 text-center shadow-inner relative overflow-hidden">
                        {/* Subtle wood plank lines */}
                        <div className="absolute inset-0 opacity-20 pointer-events-none flex flex-col justify-evenly">
                          <div className="border-b border-[#8C5828]" />
                          <div className="border-b border-[#8C5828]" />
                          <div className="border-b border-[#8C5828]" />
                        </div>
                        <div className="relative z-10 bg-white/90 backdrop-blur-xs px-3.5 py-1.5 rounded-md border border-[#D8C2A6] shadow-2xs">
                          <div className="text-[13px] sm:text-[14px] font-bold text-[#152238]">
                            Room Area = Length × Width
                          </div>
                          <div className="text-[12px] font-semibold text-[#16856B]">
                            {calculation.safeLength} {lengthUnit} ×{' '}
                            {calculation.safeWidth} {widthUnit} ={' '}
                            {formatArea(calculation.baseArea)} {areaSymbol}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column inside Step 1: How to measure */}
              <div className="md:col-span-5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-4 sm:p-5 space-y-4">
                <h3 className="text-[15px] font-extrabold text-[#152238]">
                  How to measure
                </h3>
                <ol className="space-y-3.5 text-[13.5px] text-[#334155] leading-relaxed">
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#2457D6] text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </span>
                    <span>
                      Measure the <strong className="text-[#152238]">longest</strong> part
                      of the room for the length.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#2457D6] text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </span>
                    <span>
                      Measure the <strong className="text-[#152238]">widest</strong> part
                      of the room for the width.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#2457D6] text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </span>
                    <span>
                      Use the <strong className="text-[#152238]">same unit</strong> for
                      both measurements (e.g., metres or feet).
                    </span>
                  </li>
                </ol>

                <div className="rounded-lg bg-[#EBF2FF] border border-[#C7DCFF] px-3.5 py-2.5 flex items-start gap-2 text-[12.5px] text-[#1E3A8A]">
                  <CheckCircle2 className="w-4 h-4 text-[#16856B] shrink-0 mt-0.5" />
                  <span>
                    <strong>Tip:</strong> Convert all measurements to the same
                    unit. If you mix units, we convert them automatically.
                  </span>
                </div>
              </div>
            </div>

            {/* Step 1 Footer Actions */}
            <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleReset();
                }}
                className="px-4 py-2.5 rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] hover:bg-[#E2E8F0]/60 text-[14px] font-semibold text-[#475569] transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateToStep(2);
                }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#2457D6] hover:bg-[#1D46B0] text-white text-[14px] font-bold shadow-xs transition-colors cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </section>

          {/* Right Sidebar: Your progress + Summary + Need help? */}
          <aside className="lg:col-span-4 space-y-4">
            {/* Your progress Card */}
            <div className="bg-white rounded-xl border border-[#DCE3EE] p-5 shadow-2xs">
              <div className="flex items-center justify-between mb-3.5">
                <h2 className="text-[16px] font-extrabold text-[#152238]">
                  Your progress
                </h2>
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-[12px] font-semibold text-[#2457D6] hover:underline inline-flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset all
                </button>
              </div>
              <ul className="space-y-2.5">
                {[
                  { step: 1 as const, label: 'Measure the room' },
                  { step: 2 as const, label: 'Estimate materials' },
                  { step: 3 as const, label: 'Estimate cost' },
                ].map((s) => {
                  const isCurrent = activeStep === s.step;
                  const isCompleted = activeStep > s.step;
                  return (
                    <li key={s.step}>
                      <button
                        type="button"
                        onClick={() => navigateToStep(s.step)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                          isCurrent
                            ? 'bg-[#EEF4FF] text-[#2457D6] font-bold'
                            : 'hover:bg-[#F8FAFC] text-[#475569] font-medium'
                        }`}
                      >
                        <span className="flex items-center gap-2.5 text-[14px]">
                          <span
                            className={`w-6 h-6 rounded-full text-[12px] font-bold flex items-center justify-center ${
                              isCurrent
                                ? 'bg-[#2457D6] text-white'
                                : isCompleted
                                  ? 'bg-[#16856B] text-white'
                                  : 'bg-[#E2E8F0] text-[#475569]'
                            }`}
                          >
                            {isCompleted ? (
                              <Check className="w-3.5 h-3.5" />
                            ) : (
                              s.step
                            )}
                          </span>
                          <span>{s.label}</span>
                        </span>
                        <span className="text-[12px] text-[#2457D6] font-semibold">
                          {isCurrent ? 'Active' : 'Edit'}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Summary Card */}
            <div className="bg-white rounded-xl border border-[#DCE3EE] p-5 shadow-2xs">
              <h2 className="text-[16px] font-extrabold text-[#152238] mb-3.5">
                Summary
              </h2>
              <dl className="space-y-2.5 text-[14px]">
                <div className="flex items-center justify-between text-[#475569]">
                  <dt>Room length</dt>
                  <dd className="font-bold text-[#152238]">
                    {calculation.safeLength} {lengthUnit}
                  </dd>
                </div>
                <div className="flex items-center justify-between text-[#475569]">
                  <dt>Room width</dt>
                  <dd className="font-bold text-[#152238]">
                    {calculation.safeWidth} {widthUnit}
                  </dd>
                </div>
                <div className="pt-2.5 border-t border-[#E2E8F0] flex items-center justify-between">
                  <dt className="font-semibold text-[#152238]">Room area</dt>
                  <dd className="text-[18px] font-extrabold text-[#152238]">
                    {formatArea(calculation.baseArea)} {areaSymbol}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Need help? Card */}
            <div className="bg-white rounded-xl border border-[#DCE3EE] p-5 shadow-2xs">
              <h2 className="text-[16px] font-extrabold text-[#152238] mb-2.5">
                Need help?
              </h2>
              <div className="divide-y divide-[#E2E8F0]">
                {HELP_TOPICS.map((topic) => {
                  const isOpen = openHelpId === topic.id;
                  return (
                    <div key={topic.id} className="py-2 first:pt-0 last:pb-0">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenHelpId(isOpen ? null : topic.id)
                        }
                        className="w-full flex items-center justify-between py-1 text-left text-[13.5px] font-semibold text-[#2457D6] hover:text-[#1D46B0] transition-colors"
                      >
                        <span>{topic.question}</span>
                        <ChevronRight
                          className={`w-4 h-4 shrink-0 transition-transform ${
                            isOpen ? 'rotate-90' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <p className="mt-1.5 text-[12.5px] text-[#475569] leading-relaxed bg-[#F8FAFC] p-2.5 rounded-lg border border-[#E2E8F0]">
                          {topic.answer}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>

        {/* Row 2: Step 2 (Estimate materials) & Step 3 (Estimate cost) Side-by-Side */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Step 2: Estimate materials */}
          <section
            ref={step2Ref}
            onClick={() => setActiveStep(2)}
            aria-labelledby="step-2-heading"
            className={`lg:col-span-6 bg-white rounded-xl border transition-all p-5 sm:p-6 shadow-2xs flex flex-col justify-between ${
              activeStep === 2
                ? 'border-[#2457D6] ring-1 ring-[#2457D6]/20'
                : 'border-[#DCE3EE]'
            }`}
          >
            <div>
              <div className="pb-4 mb-5 border-b border-[#E2E8F0]">
                <h2
                  id="step-2-heading"
                  className="text-[20px] font-extrabold text-[#152238]"
                >
                  Step 2: Estimate materials
                </h2>
                <p className="text-[14px] text-[#5A6A85] mt-0.5">
                  Include extra material for cuts, waste and future repairs.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
                {/* Left Inputs */}
                <div className="sm:col-span-7 space-y-4">
                  {/* Waste Allowance Input */}
                  <div>
                    <label
                      htmlFor="waste-allowance-input"
                      className="block text-[14px] font-bold text-[#152238] mb-1.5"
                    >
                      Waste allowance
                    </label>
                    <div className="flex items-stretch gap-2">
                      <input
                        id="waste-allowance-input"
                        type="number"
                        inputMode="decimal"
                        min="0"
                        max="100"
                        step="1"
                        value={wasteInput}
                        onChange={(e) => setWasteInput(e.target.value)}
                        className="w-full rounded-lg border border-[#CBD5E1] px-3.5 py-2.5 text-[16px] font-semibold text-[#152238] bg-white focus:outline-none focus:border-[#2457D6] focus:ring-2 focus:ring-[#2457D6]/20"
                      />
                      <div className="rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] px-4 py-2.5 text-[14px] font-bold text-[#152238] flex items-center justify-center shrink-0">
                        %
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-1.5">
                      <span className="text-[12px] text-[#64748B]">
                        Recommended: 5% to 15% extra
                      </span>
                      <div className="flex items-center gap-1">
                        {[5, 10, 15].map((pct) => (
                          <button
                            key={pct}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setWasteInput(String(pct));
                            }}
                            className={`px-2 py-0.5 rounded text-[11px] font-bold border transition-colors ${
                              Number(wasteInput) === pct
                                ? 'bg-[#2457D6] text-white border-[#2457D6]'
                                : 'bg-[#F8FAFC] text-[#475569] border-[#CBD5E1] hover:border-[#2457D6]'
                            }`}
                          >
                            {pct}%
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Flooring Material Select */}
                  <div>
                    <label
                      htmlFor="flooring-material-select"
                      className="block text-[14px] font-bold text-[#152238] mb-1.5"
                    >
                      Flooring material
                    </label>
                    <select
                      id="flooring-material-select"
                      value={materialId}
                      onChange={(e) => {
                        const nextId = e.target.value;
                        setMaterialId(nextId);
                        const mat = FLOORING_MATERIALS.find(
                          (m) => m.id === nextId
                        );
                        if (mat) {
                          setBoxCoverageInput(mat.defaultBoxCoverageM2);
                        }
                      }}
                      className="w-full rounded-lg border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-[15px] font-semibold text-[#152238] focus:outline-none focus:border-[#2457D6] focus:ring-2 focus:ring-[#2457D6]/20"
                    >
                      {FLOORING_MATERIALS.map((mat) => (
                        <option key={mat.id} value={mat.id}>
                          {mat.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-[12px] text-[#64748B] mt-1">
                      Optional: Select material type
                    </p>
                  </div>
                </div>

                {/* Right Info Box: Recommended waste allowance */}
                <div className="sm:col-span-5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-4 space-y-2.5">
                  <h3 className="text-[14px] font-extrabold text-[#152238]">
                    Recommended waste allowance
                  </h3>
                  <p className="text-[13px] text-[#475569] leading-relaxed">
                    Add <strong className="text-[#152238]">5%–10%</strong> for
                    regular rooms, or{' '}
                    <strong className="text-[#152238]">10%–15%</strong> for
                    complex layouts or diagonal installations.
                  </p>
                  <div className="pt-2 border-t border-[#E2E8F0] text-[12px] text-[#16856B] font-medium">
                    {selectedMaterial.note}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 Footer Actions */}
            <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateToStep(1);
                }}
                className="px-4 py-2.5 rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] hover:bg-[#E2E8F0]/60 text-[14px] font-semibold text-[#475569] transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateToStep(3);
                }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#2457D6] hover:bg-[#1D46B0] text-white text-[14px] font-bold shadow-xs transition-colors cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </section>

          {/* Step 3: Estimate cost */}
          <section
            ref={step3Ref}
            onClick={() => setActiveStep(3)}
            aria-labelledby="step-3-heading"
            className={`lg:col-span-6 bg-white rounded-xl border transition-all p-5 sm:p-6 shadow-2xs flex flex-col justify-between ${
              activeStep === 3
                ? 'border-[#2457D6] ring-1 ring-[#2457D6]/20'
                : 'border-[#DCE3EE]'
            }`}
          >
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-5 border-b border-[#E2E8F0]">
                <div>
                  <h2
                    id="step-3-heading"
                    className="text-[20px] font-extrabold text-[#152238]"
                  >
                    Step 3: Estimate cost
                  </h2>
                  <p className="text-[14px] text-[#5A6A85] mt-0.5">
                    Enter the price per {areaUnit === 'm2' ? 'square metre' : 'square foot'} to calculate the estimated material cost.
                  </p>
                </div>

                {/* Currency Switcher */}
                <div className="inline-flex items-center rounded-lg bg-[#F1F5F9] p-1 border border-[#E2E8F0]">
                  {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrency(code);
                      }}
                      className={`px-2 py-1 rounded text-[12px] font-bold transition-colors ${
                        currency === code
                          ? 'bg-white text-[#2457D6] shadow-2xs'
                          : 'text-[#475569] hover:text-[#152238]'
                      }`}
                      title={`Switch currency to ${CURRENCIES[code].label}`}
                    >
                      {CURRENCIES[code].symbol}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
                {/* Left Price Input */}
                <div className="sm:col-span-5 space-y-3">
                  <div>
                    <label
                      htmlFor="price-per-unit-input"
                      className="block text-[14px] font-bold text-[#152238] mb-1.5"
                    >
                      Price per {areaUnit === 'm2' ? 'square metre' : 'sq ft'}
                    </label>
                    <div className="flex items-stretch rounded-lg border border-[#CBD5E1] bg-white overflow-hidden focus-within:border-[#2457D6] focus-within:ring-2 focus-within:ring-[#2457D6]/20">
                      <span className="bg-[#F8FAFC] border-r border-[#CBD5E1] px-3 py-2.5 text-[15px] font-bold text-[#334155] flex items-center">
                        {currentCurrency.symbol}
                      </span>
                      <input
                        id="price-per-unit-input"
                        type="number"
                        inputMode="decimal"
                        min="0"
                        step="any"
                        value={pricePerUnitInput}
                        onChange={(e) => setPricePerUnitInput(e.target.value)}
                        placeholder="500"
                        className="w-full px-3 py-2.5 text-[16px] font-semibold text-[#152238] focus:outline-none"
                      />
                      <span className="bg-[#F8FAFC] border-l border-[#CBD5E1] px-2.5 py-2.5 text-[12.5px] font-semibold text-[#475569] flex items-center whitespace-nowrap">
                        per {areaSymbol}
                      </span>
                    </div>
                    <p className="text-[12px] text-[#64748B] mt-1">
                      Optional: Enter material price
                    </p>
                  </div>

                  {/* Quick Copy & Print Actions */}
                  <div className="pt-2 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyEstimate();
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] hover:bg-[#EEF4FF] hover:border-[#2457D6] text-[12.5px] font-semibold text-[#334155] hover:text-[#2457D6] transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copied ? 'Copied!' : 'Copy result'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.print();
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] hover:bg-[#EEF4FF] hover:border-[#2457D6] text-[12.5px] font-semibold text-[#334155] hover:text-[#2457D6] transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print</span>
                    </button>
                  </div>
                </div>

                {/* Right Green-Accented Results Panel: Your estimated results */}
                <div
                  className={`sm:col-span-7 rounded-xl border border-[#A7DFC9] bg-[#F3FAF7] overflow-hidden shadow-2xs transition-transform ${
                    recalculatedFlash ? 'scale-[1.01]' : ''
                  }`}
                >
                  <div className="bg-[#16856B] text-white px-4 py-2.5 flex items-center justify-between">
                    <h3 className="text-[14px] font-bold tracking-wide">
                      Your estimated results
                    </h3>
                    <span className="text-[11px] font-semibold bg-white/15 px-2 py-0.5 rounded">
                      {selectedMaterial.name}
                    </span>
                  </div>

                  <div className="p-4 space-y-2.5 text-[13.5px]">
                    <div className="flex items-center justify-between text-[#334155]">
                      <span>Room area (without waste)</span>
                      <span className="font-bold text-[#152238]">
                        {formatArea(calculation.baseArea)} {areaSymbol}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[#334155]">
                      <span>Waste allowance ({calculation.safeWastePct}%)</span>
                      <span className="font-bold text-[#152238]">
                        +{formatArea(calculation.wasteArea)} {areaSymbol}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-[#CDECE0] flex items-center justify-between">
                      <span className="font-bold text-[#152238]">
                        Total material needed
                      </span>
                      <span className="text-[15px] font-extrabold text-[#152238]">
                        {formatArea(calculation.totalAreaNeeded)} {areaSymbol}
                      </span>
                    </div>

                    {advancedOpen && roundToBoxes && (
                      <div className="flex items-center justify-between text-[12.5px] text-[#16856B] bg-white/80 px-2.5 py-1.5 rounded border border-[#B8E6D4]">
                        <span>
                          Rounded to {calculation.boxesNeeded} boxes (
                          {calculation.validBoxCoverage} {areaSymbol}/box)
                        </span>
                        <span className="font-bold">
                          {formatArea(calculation.boxedTotalArea)} {areaSymbol}
                        </span>
                      </div>
                    )}

                    <div className="pt-2.5 border-t border-[#CDECE0]">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="font-bold text-[#152238]">
                          Estimated material cost
                        </span>
                        <span className="text-[22px] font-extrabold text-[#16856B]">
                          {currentCurrency.symbol}{' '}
                          {formatMoney(calculation.materialCost)}
                        </span>
                      </div>
                      <div className="text-right text-[12px] text-[#475569] mt-0.5">
                        ({formatArea(calculation.billableMaterialArea)}{' '}
                        {areaSymbol} × {currentCurrency.symbol}{' '}
                        {calculation.safePrice} per {areaSymbol})
                      </div>
                    </div>

                    {advancedOpen &&
                      (calculation.underlaymentTotalCost > 0 ||
                        calculation.installationTotalCost > 0) && (
                        <div className="pt-2.5 border-t border-[#CDECE0] space-y-1 text-[12.5px]">
                          {calculation.underlaymentTotalCost > 0 && (
                            <div className="flex justify-between text-[#475569]">
                              <span>Underlayment cost</span>
                              <span className="font-semibold text-[#152238]">
                                {currentCurrency.symbol}{' '}
                                {formatMoney(calculation.underlaymentTotalCost)}
                              </span>
                            </div>
                          )}
                          {calculation.installationTotalCost > 0 && (
                            <div className="flex justify-between text-[#475569]">
                              <span>Installation labor cost</span>
                              <span className="font-semibold text-[#152238]">
                                {currentCurrency.symbol}{' '}
                                {formatMoney(calculation.installationTotalCost)}
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between font-extrabold text-[#152238] pt-1">
                            <span>Total project estimate</span>
                            <span className="text-[#16856B]">
                              {currentCurrency.symbol}{' '}
                              {formatMoney(calculation.grandTotalCost)}
                            </span>
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              </div>

              {/* Disclaimer Banner */}
              <div className="mt-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] px-3.5 py-2.5 flex items-start gap-2.5 text-[12.5px] text-[#475569]">
                <Info className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                <span>
                  This is an estimate based on the values you entered. Prices
                  may vary by location and supplier. This is not a quotation.
                </span>
              </div>
            </div>

            {/* Step 3 Footer Actions */}
            <div className="mt-5 pt-4 border-t border-[#E2E8F0] flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateToStep(2);
                }}
                className="px-4 py-2.5 rounded-lg border border-[#CBD5E1] bg-[#F8FAFC] hover:bg-[#E2E8F0]/60 text-[14px] font-semibold text-[#475569] transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRecalculate();
                }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#2457D6] hover:bg-[#1D46B0] text-white text-[14px] font-bold shadow-xs transition-colors cursor-pointer"
              >
                <span>Recalculate</span>
              </button>
            </div>
          </section>
        </div>

        {/* Expandable Advanced Settings (Optional) Bar */}
        <section
          aria-label="Advanced settings"
          className="bg-white rounded-xl border border-[#DCE3EE] shadow-2xs overflow-hidden"
        >
          <button
            type="button"
            onClick={() => setAdvancedOpen((prev) => !prev)}
            aria-expanded={advancedOpen}
            className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left hover:bg-[#F8FAFC] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#2457D6]"
          >
            <div className="flex flex-wrap items-center gap-2.5">
              <Settings className="w-5 h-5 text-[#2457D6]" />
              <span className="text-[15px] font-extrabold text-[#152238]">
                Advanced settings (optional)
              </span>
              <span className="text-[13.5px] text-[#64748B]">
                Adjust additional options for more accurate results
              </span>
            </div>
            <ChevronRight
              className={`w-5 h-5 text-[#64748B] transition-transform ${
                advancedOpen ? 'rotate-90' : ''
              }`}
            />
          </button>

          {advancedOpen && (
            <div className="px-5 pb-6 pt-3 border-t border-[#E2E8F0] bg-[#F8FAFC]/60 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tool 1: Box Coverage & Pack Count Rounding */}
              <div className="bg-white rounded-xl border border-[#DCE3EE] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#2457D6]" />
                    <h3 className="text-[14.5px] font-bold text-[#152238]">
                      Box coverage size & pack count rounding
                    </h3>
                  </div>
                  <label className="inline-flex items-center gap-2 text-[12.5px] font-semibold text-[#2457D6] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={roundToBoxes}
                      onChange={(e) => setRoundToBoxes(e.target.checked)}
                      className="rounded border-[#CBD5E1] text-[#2457D6] focus:ring-[#2457D6]"
                    />
                    <span>Round cost to full boxes</span>
                  </label>
                </div>
                <p className="text-[12.5px] text-[#5A6A85]">
                  Flooring is usually sold in full boxes. Enter the coverage per
                  box to see how many packs to order.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center pt-1">
                  <div>
                    <label
                      htmlFor="box-coverage-input"
                      className="block text-[12.5px] font-bold text-[#334155] mb-1"
                    >
                      Coverage per box ({areaSymbol})
                    </label>
                    <input
                      id="box-coverage-input"
                      type="number"
                      min="0.1"
                      step="0.01"
                      value={boxCoverageInput}
                      onChange={(e) => setBoxCoverageInput(e.target.value)}
                      className="w-full rounded-lg border border-[#CBD5E1] px-3 py-2 text-[14px] font-semibold text-[#152238] bg-white"
                    />
                  </div>
                  <div className="rounded-lg bg-[#EEF4FF] border border-[#C7DCFF] p-3 text-[13px]">
                    <div className="text-[#475569]">Boxes required:</div>
                    <div className="text-[16px] font-extrabold text-[#2457D6]">
                      {calculation.boxesNeeded} boxes (
                      {formatArea(calculation.boxedTotalArea)} {areaSymbol})
                    </div>
                  </div>
                </div>
              </div>

              {/* Tool 2: Underlayment & Installation Cost per Area */}
              <div className="bg-white rounded-xl border border-[#DCE3EE] p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Hammer className="w-4 h-4 text-[#16856B]" />
                  <h3 className="text-[14.5px] font-bold text-[#152238]">
                    Underlayment and installation cost per {areaSymbol}
                  </h3>
                </div>
                <p className="text-[12.5px] text-[#5A6A85]">
                  Include optional subfloor underlayment/adhesive and labor
                  rates to see your complete project estimate.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label
                      htmlFor="underlayment-cost-input"
                      className="block text-[12.5px] font-bold text-[#334155] mb-1"
                    >
                      Underlayment ({currentCurrency.symbol} / {areaSymbol})
                    </label>
                    <input
                      id="underlayment-cost-input"
                      type="number"
                      min="0"
                      step="any"
                      value={underlaymentCostInput}
                      onChange={(e) => setUnderlaymentCostInput(e.target.value)}
                      className="w-full rounded-lg border border-[#CBD5E1] px-3 py-2 text-[14px] font-semibold text-[#152238] bg-white"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="installation-cost-input"
                      className="block text-[12.5px] font-bold text-[#334155] mb-1"
                    >
                      Installation labor ({currentCurrency.symbol} / {areaSymbol})
                    </label>
                    <input
                      id="installation-cost-input"
                      type="number"
                      min="0"
                      step="any"
                      value={installationCostInput}
                      onChange={(e) => setInstallationCostInput(e.target.value)}
                      className="w-full rounded-lg border border-[#CBD5E1] px-3 py-2 text-[14px] font-semibold text-[#152238] bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Bottom 3 Feature Highlight Cards */}
        <section
          aria-label="Key workflow benefits"
          className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-1"
        >
          <div className="bg-white rounded-xl border border-[#DCE3EE] p-5 flex items-start gap-3.5 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-[#E6F6F1] text-[#16856B] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[15px] font-extrabold text-[#152238]">
                Covers common room shapes
              </h3>
              <p className="text-[13px] text-[#5A6A85] mt-1 leading-relaxed">
                Ideal for rectangular or square rooms. For complex spaces,
                divide into sections.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#DCE3EE] p-5 flex items-start gap-3.5 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-[#EEF4FF] text-[#2457D6] flex items-center justify-center shrink-0">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[15px] font-extrabold text-[#152238]">
                Flexible units
              </h3>
              <p className="text-[13px] text-[#5A6A85] mt-1 leading-relaxed">
                Enter measurements in metres, centimetres, feet or inches.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#DCE3EE] p-5 flex items-start gap-3.5 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-[#E6F6F1] text-[#16856B] flex items-center justify-center shrink-0">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[15px] font-extrabold text-[#152238]">
                Clear and simple results
              </h3>
              <p className="text-[13px] text-[#5A6A85] mt-1 leading-relaxed">
                Get room area, total material with waste, and an optional cost
                estimate.
              </p>
            </div>
          </div>
        </section>

        {/* Flooring Conversion & Subfloor Reference (Linear Feet to Sq Ft & Plywood Sheets) */}
        <section
          aria-label="Flooring and Subfloor Reference"
          className="bg-white rounded-xl border border-[#DCE3EE] p-5 sm:p-6 shadow-2xs space-y-4"
        >
          <h2 className="text-[17px] font-extrabold text-[#152238]">
            Flooring &amp; Subfloor Reference: Linear Feet to Square Feet, Vinyl Plank &amp; 4×8 Plywood
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[13px] text-[#475569] leading-relaxed">
            <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-4">
              <h3 className="font-bold text-[#152238] mb-1">
                Linear Feet to Square Feet (and Reverse)
              </h3>
              <p>
                Multiply board length in linear feet by board width in feet:{' '}
                <code className="font-mono text-[#2457D6]">Sq Ft = Linear Feet × (Width in inches ÷ 12)</code>.
                For 6-inch-wide planks (<code className="font-mono">0.5 ft</code>),{' '}
                <strong>100 linear feet covers 50 sq ft</strong>; conversely, divide square feet by board width in feet to get linear feet.
              </p>
            </div>
            <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-4">
              <h3 className="font-bold text-[#152238] mb-1">
                Vinyl Plank (LVP) Box Estimator
              </h3>
              <p>
                Luxury vinyl plank (LVP) and laminate flooring boxes typically cover{' '}
                <strong>20 to 24 sq ft per carton</strong>. Add <strong>10% waste</strong> for straight parallel layouts or <strong>15% waste</strong> for diagonal and herringbone rooms, then round up to full cartons.
              </p>
            </div>
            <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-4">
              <h3 className="font-bold text-[#152238] mb-1">
                4×8 Plywood Subfloor &amp; Actual Thickness
              </h3>
              <p>
                A standard <strong>4 ft × 8 ft plywood or OSB subfloor panel covers 32 sq ft</strong> (<code className="font-mono">2.97 m²</code>). Nominal 1/2-inch plywood has an actual sanded thickness of <strong>15/32 in (0.46875 in / 11.91 mm)</strong>, and 3/4-inch subfloor panels measure <strong>23/32 in (18.26 mm)</strong>.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-[#E2E8F0] grid grid-cols-1 md:grid-cols-2 gap-4 text-[13px]">
            <div className="rounded-xl bg-[#FFFBEB] border border-[#FDE68A] p-4 space-y-1">
              <div className="font-extrabold text-[#B45309] uppercase tracking-wide text-[11.5px]">
                Ordering Note · Accounting for Carton Rounding &amp; Dye Lots
              </div>
              <p className="text-[#78350F] leading-relaxed">
                Porcelain tile and luxury vinyl plank (LVP) are manufactured in production batches (&quot;dye lots&quot;). Rounding up to full cartons and keeping 1 spare carton from the same batch ensures matching shade and milling profiles if future board replacements are needed.
              </p>
            </div>
            <div className="rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] p-4 space-y-1">
              <div className="font-extrabold text-[#065F46] uppercase tracking-wide text-[11.5px]">
                Calculation Note · Waste Allowance by Layout Pattern
              </div>
              <p className="text-[#064E3B] leading-relaxed">
                Straight parallel plank installations typically add 7%–10% for end-of-row cutoffs, whereas 45-degree diagonal or herringbone layouts generally require 12%–15% additional material.
              </p>
            </div>
          </div>
        </section>

        {/* Frequently Asked Questions (Google Search Queries) */}
        <section
          id="faq"
          aria-label="Frequently Asked Flooring Calculator Questions"
          className="bg-white rounded-xl border border-[#DCE3EE] p-5 sm:p-6 shadow-2xs space-y-4"
        >
          <div>
            <h2 className="text-[16px] sm:text-[18px] font-extrabold text-[#152238]">
              Frequently Asked Questions About Flooring &amp; Box Quantities
            </h2>
            <p className="text-[12.5px] text-[#64748B] mt-0.5">
              Common Google search questions on square footage, waste percentages, and carton rounding.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-[13px]">
            {[
              {
                q: 'How do I calculate how much flooring I need for a room?',
                a: 'Measure the room length and width in feet, multiply them together to get net square footage, and add 10% for cutting waste: Required Sq Ft = Length × Width × 1.10. Finally, divide by the square footage per box and round up to the next full carton.',
              },
              {
                q: 'How much extra flooring should I add for waste (7%, 10%, or 15%)?',
                a: 'Add 7%–10% for standard straight-lay luxury vinyl plank (LVP), laminate, or square tile in rectangular rooms. Increase the waste factor to 12%–15% for diagonal (45°) installations, herringbone patterns, or rooms with many closets and alcoves.',
              },
              {
                q: 'How many boxes of flooring do I need for 500 square feet?',
                a: 'With a 10% waste buffer, a 500 sq ft room requires 550 sq ft of gross material. If each box covers 20 sq ft, divide 550 by 20 = 27.5, and round up to 28 full boxes.',
              },
              {
                q: 'How do I calculate square footage for an L-shaped room?',
                a: 'Split the L-shaped room into two separate rectangles (Section A and Section B), measure the length and width of each rectangle individually, and add their square footages together before applying your waste percentage.',
              },
              {
                q: 'How do I convert square meters (m²) to square feet (sq ft) for flooring?',
                a: 'Multiply the area in square meters by 10.76391 to get square feet. For example, a 25 m² living room equals 25 × 10.76391 = 269.10 sq ft (or 296 sq ft including 10% waste).',
              },
              {
                q: 'Do I subtract kitchen cabinets or islands when measuring flooring?',
                a: 'For floating floors (click-lock LVP or laminate), do not install underneath heavy permanent cabinets or stone islands—measure up to the cabinet toe-kick. For glue-down hardwood or tile, many contractors floor wall-to-wall first.',
              },
              {
                q: 'How do I calculate linear feet of baseboard and quarter-round trim?',
                a: 'Add twice the room length plus twice the room width: Perimeter = 2 × (Length + Width), subtract 3 feet for each standard doorway, and add 10% for miter-cut waste.',
              },
            ].map((faq) => (
              <div
                key={faq.q}
                className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1"
              >
                <h3 className="font-bold text-[#152238] text-[13.5px]">
                  {faq.q}
                </h3>
                <p className="text-[#475569] leading-relaxed text-[12.5px]">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Related Home & Construction Calculators Links */}
        <section className="bg-white rounded-xl border border-[#DCE3EE] p-5 sm:p-6 shadow-2xs">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <h2 className="text-[16px] font-extrabold text-[#152238]">
              Related Home &amp; Construction Calculators
            </h2>
            <Link
              href="/home-construction"
              className="text-[13px] font-bold text-[#2457D6] hover:underline inline-flex items-center gap-1"
            >
              <span>View all Home &amp; Construction tools</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-[13.5px]">
            <Link
              href="/conversions/area"
              className="p-3 rounded-lg border border-[#E2E8F0] hover:border-[#2457D6] hover:bg-[#F8FAFC] transition-colors font-semibold text-[#2457D6]"
            >
              Square Meters to Square Feet &amp; Area Converter →
            </Link>
            <Link
              href="/construction-project-calculator"
              className="p-3 rounded-lg border border-[#E2E8F0] hover:border-[#2457D6] hover:bg-[#F8FAFC] transition-colors font-semibold text-[#2457D6]"
            >
              Concrete Slab &amp; Cubic Yard Calculator →
            </Link>
            <Link
              href="/conversions/length"
              className="p-3 rounded-lg border border-[#E2E8F0] hover:border-[#2457D6] hover:bg-[#F8FAFC] transition-colors font-semibold text-[#2457D6]"
            >
              Millimeters to Inches &amp; Linear Foot Converter →
            </Link>
            <Link
              href="/math/discount-calculator"
              className="p-3 rounded-lg border border-[#E2E8F0] hover:border-[#2457D6] hover:bg-[#F8FAFC] transition-colors font-semibold text-[#2457D6]"
            >
              Material Discount Calculator →
            </Link>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-2 text-xs text-[#475569]">
            <span>
              <strong>Last updated:</strong> November 13, 2026 · Geometric area and carton rounding estimates only.
            </span>
            <div className="flex flex-wrap items-center gap-3 font-bold">
              <Link href="/calculation-methodology" className="text-[#2457D6] hover:underline">
                Methodology
              </Link>
              <span>·</span>
              <Link href="/contact" className="text-[#2457D6] hover:underline">
                Contact
              </Link>
              <span>·</span>
              <Link href="/contact#report-error" className="text-[#E11D48] hover:underline">
                Report an error
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
