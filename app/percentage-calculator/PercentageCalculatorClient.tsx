'use client';

import React, { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import {
  PERCENTAGE_CURRENCIES,
  PercentageCurrency,
  getPercentageCurrency,
} from './percentage-currencies';

export type PercentageMode =
  | 'percentOf'
  | 'increase'
  | 'decrease'
  | 'change'
  | 'diff'
  | 'reverse'
  | 'discount'
  | 'margin';

interface ModeConfig {
  label: string;
  labelA: string;
  unitA: string;
  labelB: string;
  unitB: string;
  formulaName: string;
  chipsA: number[];
  chipsB: number[];
  defaultA: number;
  defaultB: number;
}

const MODE_CONFIGS: Record<PercentageMode, ModeConfig> = {
  percentOf: {
    label: 'MODE: DIRECT PERCENTAGE RATIO',
    labelA: 'Percentage (X)',
    unitA: '%',
    labelB: 'Base Number / Whole (Y)',
    unitB: 'Whole',
    formulaName: 'P = (X / 100) × Y',
    chipsA: [5, 10, 15, 20, 25, 50, 75],
    chipsB: [50, 100, 250, 500, 1000],
    defaultA: 20,
    defaultB: 500,
  },
  increase: {
    label: 'MODE: PERCENTAGE INCREASE',
    labelA: 'Initial Starting Value (A)',
    unitA: 'Old',
    labelB: 'New Increased Value (B)',
    unitB: 'New',
    formulaName: 'Δ% = ((B - A) / A) × 100',
    chipsA: [50, 100, 200, 500],
    chipsB: [75, 125, 250, 600, 1000],
    defaultA: 100,
    defaultB: 125,
  },
  decrease: {
    label: 'MODE: PERCENTAGE DECREASE',
    labelA: 'Original Value (A)',
    unitA: 'Old',
    labelB: 'Reduced Value (B)',
    unitB: 'New',
    formulaName: '-Δ% = ((A - B) / A) × 100',
    chipsA: [100, 200, 500, 1000],
    chipsB: [50, 80, 150, 400, 750],
    defaultA: 200,
    defaultB: 150,
  },
  change: {
    label: 'MODE: PERCENTAGE CHANGE',
    labelA: 'Initial State (V1)',
    unitA: 'Start',
    labelB: 'Final State (V2)',
    unitB: 'End',
    formulaName: '% Change = ((V2 - V1) / |V1|) × 100',
    chipsA: [50, 100, 150, 200],
    chipsB: [40, 80, 120, 200, 300],
    defaultA: 80,
    defaultB: 120,
  },
  diff: {
    label: 'MODE: PERCENTAGE DIFFERENCE (SYMMETRIC)',
    labelA: 'First Number (A)',
    unitA: 'Val A',
    labelB: 'Second Number (B)',
    unitB: 'Val B',
    formulaName: '% Diff = (|A - B| / ((A + B) / 2)) × 100',
    chipsA: [20, 40, 60, 80, 100],
    chipsB: [50, 90, 100, 150, 200],
    defaultA: 80,
    defaultB: 100,
  },
  reverse: {
    label: 'MODE: REVERSE PERCENTAGE (FIND WHOLE)',
    labelA: 'Percentage Share (P%)',
    unitA: '%',
    labelB: 'Amount Represented',
    unitB: 'Part',
    formulaName: 'Whole = Amount / (P / 100)',
    chipsA: [5, 10, 15, 20, 25, 50],
    chipsB: [25, 50, 100, 115, 500],
    defaultA: 15,
    defaultB: 115,
  },
  discount: {
    label: 'MODE: DISCOUNT & SALE SAVINGS',
    labelA: 'Discount Rate (%)',
    unitA: '% Off',
    labelB: 'Original Sticker Price ($)',
    unitB: 'Price',
    formulaName: 'Final = Price × (1 - (Rate / 100))',
    chipsA: [10, 15, 20, 25, 30, 50, 70],
    chipsB: [60, 100, 150, 240, 500],
    defaultA: 25,
    defaultB: 240,
  },
  margin: {
    label: 'MODE: PROFIT MARGIN ON REVENUE',
    labelA: 'Cost Price (COGS $)',
    unitA: 'Cost',
    labelB: 'Selling Price (Gross $)',
    unitB: 'Sale',
    formulaName: 'Margin % = ((Sale - Cost) / Sale) × 100',
    chipsA: [10, 25, 40, 60, 100],
    chipsB: [50, 100, 150, 200, 500],
    defaultA: 40,
    defaultB: 100,
  },
};

function gcd(a: number, b: number): number {
  return b ? gcd(b, a % b) : a;
}

function formatDecimal(num: number, decimals = 2): string {
  if (!Number.isFinite(num)) return '0.00';
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export default function PercentageCalculatorClient() {
  // Country & Currency Selection
  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState<string>('USD');
  const currentCurrency = useMemo(
    () => getPercentageCurrency(selectedCurrencyCode),
    [selectedCurrencyCode]
  );

  // Primary Interactive Engine State
  const [mode, setMode] = useState<PercentageMode>('percentOf');
  const [valA, setValA] = useState<number>(20);
  const [valB, setValB] = useState<number>(500);
  const [copiedToast, setCopiedToast] = useState<boolean>(false);

  // Specialized Sub-Modules State
  // Module A: Retail Discount
  const [discRetail, setDiscRetail] = useState<number>(150);
  const [discStore, setDiscStore] = useState<number>(30);
  const [discExtra, setDiscExtra] = useState<number>(10);

  // Module B: Margin vs Markup
  const [cogsVal, setCogsVal] = useState<number>(60);
  const [priceVal, setPriceVal] = useState<number>(100);

  // Module C: Academic Grade
  const [marksGot, setMarksGot] = useState<number>(87);
  const [marksTotal, setMarksTotal] = useState<number>(100);

  // Module D: Tax Reverser
  const [taxBase, setTaxBase] = useState<number>(230);
  const [taxRate, setTaxRate] = useState<number>(15);

  // FAQ open states
  const [openFaqs, setOpenFaqs] = useState<Record<number, boolean>>({
    1: false,
    2: false,
    3: false,
    4: false,
  });

  // Localized Money Formatter
  const formatMoney = useCallback(
    (val: number, decimals = 2): string => {
      if (!Number.isFinite(val)) return `${currentCurrency.symbol}0.00`;
      return `${currentCurrency.symbol}${val.toLocaleString(currentCurrency.locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}`;
    },
    [currentCurrency]
  );

  // Country / Currency Change Handler
  const handleCurrencyChange = (newCode: string) => {
    setSelectedCurrencyCode(newCode);
    const curr = getPercentageCurrency(newCode);
    setDiscRetail(curr.defaultRetail);
    setCogsVal(curr.defaultCOGS);
    setPriceVal(curr.defaultPrice);
    setTaxBase(curr.defaultInvoice);
    setTaxRate(curr.vatRate);
    if (mode === 'discount') {
      setValB(curr.defaultRetail);
    } else if (mode === 'margin') {
      setValA(curr.defaultCOGS);
      setValB(curr.defaultPrice);
    }
  };

  // Dynamic Mode Configuration tailored to active currency
  const activeCfg = useMemo(() => {
    const base = MODE_CONFIGS[mode];
    if (mode === 'discount') {
      return {
        ...base,
        labelB: `Original Sticker Price (${currentCurrency.symbol.trim()})`,
        unitB: currentCurrency.symbol.trim() || 'Price',
        chipsB: [
          Math.round(currentCurrency.defaultRetail * 0.25),
          Math.round(currentCurrency.defaultRetail * 0.5),
          currentCurrency.defaultRetail,
          Math.round(currentCurrency.defaultRetail * 1.5),
          Math.round(currentCurrency.defaultRetail * 2.5),
        ],
        defaultB: currentCurrency.defaultRetail,
      };
    }
    if (mode === 'margin') {
      return {
        ...base,
        labelA: `Cost Price (COGS ${currentCurrency.symbol.trim()})`,
        unitA: currentCurrency.symbol.trim() || 'Cost',
        labelB: `Selling Price (Gross ${currentCurrency.symbol.trim()})`,
        unitB: currentCurrency.symbol.trim() || 'Sale',
        chipsA: [
          Math.round(currentCurrency.defaultCOGS * 0.25),
          Math.round(currentCurrency.defaultCOGS * 0.5),
          currentCurrency.defaultCOGS,
          Math.round(currentCurrency.defaultCOGS * 1.5),
        ],
        chipsB: [
          Math.round(currentCurrency.defaultPrice * 0.5),
          currentCurrency.defaultPrice,
          Math.round(currentCurrency.defaultPrice * 1.5),
          Math.round(currentCurrency.defaultPrice * 2),
        ],
        defaultA: currentCurrency.defaultCOGS,
        defaultB: currentCurrency.defaultPrice,
      };
    }
    return base;
  }, [mode, currentCurrency]);

  // Switch Tab handler
  const handleSwitchTab = (newMode: PercentageMode) => {
    setMode(newMode);
    if (newMode === 'discount') {
      setValA(25);
      setValB(currentCurrency.defaultRetail);
    } else if (newMode === 'margin') {
      setValA(currentCurrency.defaultCOGS);
      setValB(currentCurrency.defaultPrice);
    } else {
      setValA(MODE_CONFIGS[newMode].defaultA);
      setValB(MODE_CONFIGS[newMode].defaultB);
    }
  };

  // Preset Jump Handler
  const handlePresetJump = (targetMode: PercentageMode, a: number, b: number) => {
    setMode(targetMode);
    setValA(a);
    setValB(b);
    const el = document.getElementById('workbench');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Reset Primary Inputs
  const handleReset = () => {
    setMode('percentOf');
    setValA(20);
    setValB(500);
  };

  // Slider Synchronizer
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value) || 0;
    setValA(v);
  };

  // Primary Calculation Logic
  const calculation = useMemo(() => {
    const a = valA;
    const b = valB;

    let result = 0;
    let isPercentageResult = false;
    let subtext = '';
    let steps: { step: string; formula: string; value: string; isFinal?: boolean }[] = [];
    let visualPercent = 0;
    let inverseHtml = '';

    switch (mode) {
      case 'percentOf': {
        result = (a / 100) * b;
        visualPercent = Math.min(Math.max(a, 0), 100);
        subtext = `${a}% of ${formatDecimal(b)} equals ${formatDecimal(result)}`;
        steps = [
          { step: '1. Standard Formula:', formula: 'P = (X / 100) × Y', value: '' },
          { step: '2. Input Substitution:', formula: `P = (${a} / 100) × ${b}`, value: '' },
          { step: '3. Decimal Coefficient:', formula: `P = ${(a / 100).toFixed(4)} × ${b}`, value: '' },
          { step: '4. Evaluated Result:', formula: `${formatDecimal(result)}`, value: '', isFinal: true },
        ];
        inverseHtml = `If ${formatDecimal(result)} is ${a}% of ${formatDecimal(b)}, then dividing ${formatDecimal(result)} by ${(a / 100).toFixed(4)} recovers exactly: ${formatDecimal(b)}.`;
        break;
      }
      case 'increase': {
        const diff = b - a;
        result = a !== 0 ? (diff / a) * 100 : 0;
        isPercentageResult = true;
        visualPercent = Math.min(Math.max(result, 0), 100);
        subtext = `${formatDecimal(a)} increased to ${formatDecimal(b)} is an increase of +${formatDecimal(result)}%`;
        steps = [
          { step: '1. Delta Calculation:', formula: `Δ = ${b} - ${a} = ${diff}`, value: '' },
          { step: '2. Fractional Scaling:', formula: `${diff} / ${a} = ${(diff / (a || 1)).toFixed(4)}`, value: '' },
          { step: '3. Percentage Expansion:', formula: `+${formatDecimal(result)}%`, value: '', isFinal: true },
        ];
        inverseHtml = `Increasing ${formatDecimal(a)} by ${formatDecimal(result)}% multiplies it by ${(1 + result / 100).toFixed(4)} to return: ${formatDecimal(b)}.`;
        break;
      }
      case 'decrease': {
        const drop = a - b;
        result = a !== 0 ? (drop / a) * 100 : 0;
        isPercentageResult = true;
        visualPercent = Math.min(Math.max(result, 0), 100);
        subtext = `${formatDecimal(a)} reduced to ${formatDecimal(b)} is a decrease of -${formatDecimal(result)}%`;
        steps = [
          { step: '1. Absolute Drop:', formula: `Drop = ${a} - ${b} = ${drop}`, value: '' },
          { step: '2. Divide by Initial Base:', formula: `${drop} / ${a} = ${(drop / (a || 1)).toFixed(4)}`, value: '' },
          { step: '3. Percentage Reduction:', formula: `-${formatDecimal(result)}%`, value: '', isFinal: true },
        ];
        inverseHtml = `A reduction of ${formatDecimal(result)}% means paying ${(100 - result).toFixed(2)}% of the original seed: ${formatDecimal(b)}.`;
        break;
      }
      case 'change': {
        const change = b - a;
        result = a !== 0 ? (change / Math.abs(a)) * 100 : 0;
        isPercentageResult = true;
        visualPercent = Math.min(Math.abs(result), 100);
        const sign = result >= 0 ? '+' : '';
        subtext = `Net relative variance from ${formatDecimal(a)} to ${formatDecimal(b)}: ${sign}${formatDecimal(result)}%`;
        steps = [
          { step: '1. Raw Difference:', formula: `${b} - ${a} = ${change}`, value: '' },
          { step: '2. Quotient with Base:', formula: `${change} / |${a}|`, value: '' },
          { step: '3. Evaluated Change:', formula: `${sign}${formatDecimal(result)}%`, value: '', isFinal: true },
        ];
        inverseHtml = `Multiplying initial baseline ${formatDecimal(a)} by ${(1 + result / 100).toFixed(4)} yields target: ${formatDecimal(b)}.`;
        break;
      }
      case 'diff': {
        const diffVal = Math.abs(a - b);
        const avg = (a + b) / 2;
        result = avg !== 0 ? (diffVal / avg) * 100 : 0;
        isPercentageResult = true;
        visualPercent = Math.min(Math.max(result, 0), 100);
        subtext = `Symmetric relative difference between ${formatDecimal(a)} and ${formatDecimal(b)}: ${formatDecimal(result)}%`;
        steps = [
          { step: '1. Absolute Difference:', formula: `|${a} - ${b}| = ${diffVal}`, value: '' },
          { step: '2. Midpoint Average:', formula: `(${a} + ${b}) / 2 = ${avg}`, value: '' },
          { step: '3. Symmetric Ratio:', formula: `${formatDecimal(result)}%`, value: '', isFinal: true },
        ];
        inverseHtml = `Because this metric is directionally symmetric, reversing the inputs (${b} and ${a}) returns the exact same: ${formatDecimal(result)}%.`;
        break;
      }
      case 'reverse': {
        result = a !== 0 ? b / (a / 100) : 0;
        visualPercent = Math.min(Math.max(a, 0), 100);
        subtext = `If ${formatDecimal(b)} corresponds to ${a}%, the full 100% totality is ${formatDecimal(result)}`;
        steps = [
          { step: '1. Decimal Multiplier:', formula: `${a} / 100 = ${(a / 100).toFixed(4)}`, value: '' },
          { step: '2. Inverse Division:', formula: `${b} / ${(a / 100).toFixed(4)}`, value: '' },
          { step: '3. Reconstructed Totality:', formula: `${formatDecimal(result)}`, value: '', isFinal: true },
        ];
        inverseHtml = `Proof: Taking ${a}% of ${formatDecimal(result)} yields the input part: ${formatDecimal(b)}.`;
        break;
      }
      case 'discount': {
        const savings = (a / 100) * b;
        result = b - savings;
        visualPercent = Math.min(Math.max(a, 0), 100);
        subtext = `Original ${currentCurrency.symbol}${formatDecimal(b)} with ${a}% discount drops to ${currentCurrency.symbol}${formatDecimal(result)} (Savings: ${currentCurrency.symbol}${formatDecimal(savings)})`;
        steps = [
          { step: '1. Total Savings:', formula: `${b} × (${a} / 100) = ${currentCurrency.symbol}${formatDecimal(savings)}`, value: '' },
          { step: '2. Checkout Price:', formula: `${currentCurrency.symbol}${b} - ${currentCurrency.symbol}${formatDecimal(savings)}`, value: '' },
          { step: '3. Final Bill:', formula: `${currentCurrency.symbol}${formatDecimal(result)}`, value: '', isFinal: true },
        ];
        inverseHtml = `Dividing ${currentCurrency.symbol}${formatDecimal(result)} by (1 - ${(a / 100).toFixed(2)}) reconstitutes the original retail price: ${currentCurrency.symbol}${formatDecimal(b)}.`;
        break;
      }
      case 'margin': {
        const profit = b - a;
        result = b !== 0 ? (profit / b) * 100 : 0;
        isPercentageResult = true;
        visualPercent = Math.min(Math.max(result, 0), 100);
        const markup = a !== 0 ? (profit / a) * 100 : 0;
        subtext = `Cost ${currentCurrency.symbol}${formatDecimal(a)} sold at ${currentCurrency.symbol}${formatDecimal(b)} yields ${formatDecimal(result)}% Margin (Markup: ${markup.toFixed(2)}%)`;
        steps = [
          { step: '1. Gross Profit:', formula: `${currentCurrency.symbol}${b} - ${currentCurrency.symbol}${a} = ${currentCurrency.symbol}${formatDecimal(profit)}`, value: '' },
          { step: '2. Profit over Selling Price:', formula: `${currentCurrency.symbol}${formatDecimal(profit)} / ${currentCurrency.symbol}${b}`, value: '' },
          { step: '3. Profit Margin:', formula: `${formatDecimal(result)}%`, value: '', isFinal: true },
        ];
        inverseHtml = `Formula check: Cost of ${currentCurrency.symbol}${formatDecimal(a)} / (1 - ${(result / 100).toFixed(4)}) returns target price: ${currentCurrency.symbol}${formatDecimal(b)}.`;
        break;
      }
    }

    // Fraction and precision conversions based on input A
    const safeA = Math.max(0, a);
    const scaledNumerator = Math.round(safeA * 10);
    const g = gcd(scaledNumerator, 1000) || 1;
    const fractionNum = scaledNumerator / g;
    const fractionDen = 1000 / g;

    const fractionStr = `${fractionNum} / ${fractionDen}`;
    const decimalStr = (safeA / 100).toFixed(4);
    const ratioStr = `${fractionNum} : ${fractionDen}`;
    const permilleStr = `${(safeA * 10).toFixed(1)} ‰`;

    // Part & Remainder for donut / bars
    const calculatedPart = mode === 'percentOf' ? result : (visualPercent / 100) * b;
    const remainder = Math.max(0, b - calculatedPart);

    return {
      result,
      isPercentageResult,
      subtext,
      steps,
      visualPercent,
      inverseHtml,
      fractionStr,
      decimalStr,
      ratioStr,
      permilleStr,
      calculatedPart,
      remainder,
      formattedResult: isPercentageResult
        ? `${formatDecimal(result)}%`
        : mode === 'discount'
        ? `${currentCurrency.symbol}${formatDecimal(result)}`
        : formatDecimal(result),
    };
  }, [mode, valA, valB, currentCurrency]);

  // Donut SVG circumference calculation (radius = 40 => 2 * pi * 40 = 251.327)
  const donutStrokeOffset = useMemo(() => {
    const circumference = 251.2;
    return circumference - circumference * (calculation.visualPercent / 100);
  }, [calculation.visualPercent]);

  // Copy Result to Clipboard
  const handleCopyResult = useCallback(() => {
    const text = `SolveIt Calculator Result:
${calculation.formattedResult}
${calculation.subtext}
https://solveitcalculator.com/percentage-calculator/`;

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedToast(true);
        setTimeout(() => setCopiedToast(false), 2500);
      });
    }
  }, [calculation]);

  // Export CSV
  const handleExportCSV = useCallback(() => {
    const csvContent =
      'data:text/csv;charset=utf-8,Mode,Param_A,Param_B,Calculated_Result\n' +
      `${mode},${valA},${valB},"${calculation.formattedResult}"\n`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `solveit_percentage_${mode}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [mode, valA, valB, calculation.formattedResult]);

  // Specialized Module Calculations
  // Module A: Retail Discount
  const retailCalc = useMemo(() => {
    const afterStore = discRetail * (1 - discStore / 100);
    const afterExtra = afterStore * (1 - discExtra / 100);
    const totalSaved = discRetail - afterExtra;
    const effectiveRate = discRetail > 0 ? (totalSaved / discRetail) * 100 : 0;
    return {
      final: afterExtra,
      saved: totalSaved,
      effectiveRate,
    };
  }, [discRetail, discStore, discExtra]);

  // Module B: Margin vs Markup
  const marginCalc = useMemo(() => {
    const profit = priceVal - cogsVal;
    const margin = priceVal > 0 ? (profit / priceVal) * 100 : 0;
    const markup = cogsVal > 0 ? (profit / cogsVal) * 100 : 0;
    return {
      profit,
      margin,
      markup,
    };
  }, [cogsVal, priceVal]);

  // Module C: Academic Grade
  const academicCalc = useMemo(() => {
    const total = marksTotal > 0 ? marksTotal : 1;
    const pct = (marksGot / total) * 100;
    let letter = 'F';
    let gpa = '0.0 GPA Failing';
    if (pct >= 93) {
      letter = 'Letter: A+';
      gpa = '4.0 GPA Excellent';
    } else if (pct >= 90) {
      letter = 'Letter: A';
      gpa = '3.8 GPA High Honors';
    } else if (pct >= 85) {
      letter = 'Letter: B+';
      gpa = '3.3 GPA Above Average';
    } else if (pct >= 80) {
      letter = 'Letter: B';
      gpa = '3.0 GPA Standard';
    } else if (pct >= 75) {
      letter = 'Letter: C+';
      gpa = '2.3 GPA Competent';
    } else if (pct >= 70) {
      letter = 'Letter: C';
      gpa = '2.0 GPA Passing';
    } else if (pct >= 60) {
      letter = 'Letter: D';
      gpa = '1.0 GPA Deficient';
    }
    return { pct, letter, gpa };
  }, [marksGot, marksTotal]);

  // Module D: Tax Reverser
  const taxCalc = useMemo(() => {
    const net = taxBase / (1 + taxRate / 100);
    const taxIn = taxBase - net;
    const taxOut = taxBase * (taxRate / 100);
    const gross = taxBase + taxOut;
    return {
      net,
      taxIn,
      taxOut,
      gross,
    };
  }, [taxBase, taxRate]);

  // Toggle FAQ item
  const toggleFaq = (id: number) => {
    setOpenFaqs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="bg-background font-body-md text-on-surface min-h-screen flex flex-col selection:bg-primary selection:text-on-primary">
      

      <main className="w-full pt-16 bg-background flex-1">
        <div className="flex flex-col w-full">
          {/* Telemetry Bar */}
          <section className="w-full bg-surface-container-low py-space-xs border-b border-surface-container">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop flex flex-wrap items-center justify-between gap-space-sm text-body-sm font-body-sm">
              <nav aria-label="Breadcrumb" className="flex items-center gap-space-xs text-on-surface-variant flex-wrap">
                <Link className="hover:text-primary transition-colors flex items-center gap-1" href="/">
                  <span className="material-symbols-outlined text-[15px]">home</span> Home
                </Link>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                <Link className="hover:text-primary transition-colors" href="/math">
                  Math Calculators
                </Link>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                <span className="font-medium text-on-surface">Percentage Calculator</span>
              </nav>
              <div className="flex items-center gap-space-sm flex-wrap">
                <span className="inline-flex items-center gap-1 text-[11px] font-data-mono px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface font-semibold shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span> &lt;0.001ms Latency (Local Core)
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-data-mono px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant">
                  <span className="material-symbols-outlined text-[13px] text-secondary">verified</span> IEEE 754 64-bit
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-data-mono px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant hidden sm:inline-flex">
                  <span className="material-symbols-outlined text-[13px] text-primary">security</span> Zero-Cloud Sandbox
                </span>
              </div>
            </div>
          </section>

          {/* Hero Header & Quick Shortcuts */}
          <section className="w-full py-space-2xl bg-surface">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop">
              <div className="max-w-3xl space-y-space-md">
                <div className="inline-flex items-center gap-space-2xs px-space-sm py-space-2xs rounded-full bg-primary-fixed text-on-primary-fixed font-label-caps text-label-caps uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[15px]">calculate</span>
                  Computational Intelligence Hub
                </div>
                <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">
                  Universal Percentage Calculator
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                  Compute percentages, symmetric relative variance, compounding markups, statutory VAT/GST, and reverse discounts. Powered by pure deterministic IEEE 754 arithmetic with step-by-step deductive proofs.
                </p>
                {/* Trust Badges */}
                <div className="flex flex-wrap items-center gap-x-space-md gap-y-space-2xs text-body-sm font-body-sm text-on-surface-variant pt-space-xs">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span> 100% Free Client-Side
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span> Step-by-Step Proofs
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span> No Registration
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span> Instant Decimal/Fraction Export
                  </span>
                </div>
              </div>

              {/* Quick Search / Hot Shortcuts */}
              <div className="mt-space-xl p-space-md bg-surface-container-lowest rounded-xl shadow-md space-y-space-sm border border-outline-variant/20">
                <div className="flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant">
                  <span className="font-medium text-on-surface flex items-center gap-1">
                    <span className="material-symbols-outlined text-primary text-[18px]">bolt</span> Quick Formula Jump
                  </span>
                  <span className="font-data-mono text-[11px] text-outline">Click any preset to load workbench</span>
                </div>
                <div className="flex flex-wrap gap-space-xs" id="quickPills">
                  <button
                    className="px-space-sm py-1 rounded-lg bg-surface-container-low text-on-surface hover:bg-primary-fixed hover:text-on-primary-fixed transition-colors font-data-mono text-[12px] cursor-pointer"
                    onClick={() => handlePresetJump('percentOf', 20, 500)}
                    type="button"
                  >
                    What is 20% of 500?
                  </button>
                  <button
                    className="px-space-sm py-1 rounded-lg bg-surface-container-low text-on-surface hover:bg-primary-fixed hover:text-on-primary-fixed transition-colors font-data-mono text-[12px] cursor-pointer"
                    onClick={() => handlePresetJump('increase', 100, 125)}
                    type="button"
                  >
                    100 to 125 (+25%)
                  </button>
                  <button
                    className="px-space-sm py-1 rounded-lg bg-surface-container-low text-on-surface hover:bg-primary-fixed hover:text-on-primary-fixed transition-colors font-data-mono text-[12px] cursor-pointer"
                    onClick={() => handlePresetJump('discount', 25, currentCurrency.defaultRetail)}
                    type="button"
                  >
                    25% Off {currentCurrency.symbol}{currentCurrency.defaultRetail} Retail
                  </button>
                  <button
                    className="px-space-sm py-1 rounded-lg bg-surface-container-low text-on-surface hover:bg-primary-fixed hover:text-on-primary-fixed transition-colors font-data-mono text-[12px] cursor-pointer"
                    onClick={() => handlePresetJump('margin', currentCurrency.defaultCOGS, currentCurrency.defaultPrice)}
                    type="button"
                  >
                    Cost {currentCurrency.symbol}{currentCurrency.defaultCOGS} → Price {currentCurrency.symbol}{currentCurrency.defaultPrice} (Margin)
                  </button>
                  <button
                    className="px-space-sm py-1 rounded-lg bg-surface-container-low text-on-surface hover:bg-primary-fixed hover:text-on-primary-fixed transition-colors font-data-mono text-[12px] cursor-pointer"
                    onClick={() => handlePresetJump('reverse', 15, currentCurrency.defaultInvoice)}
                    type="button"
                  >
                    Reverse 15% Tax from {currentCurrency.symbol}{currentCurrency.defaultInvoice}
                  </button>
                  <button
                    className="px-space-sm py-1 rounded-lg bg-surface-container-low text-on-surface hover:bg-primary-fixed hover:text-on-primary-fixed transition-colors font-data-mono text-[12px] cursor-pointer"
                    onClick={() => handlePresetJump('diff', 80, 100)}
                    type="button"
                  >
                    Variance: 80 vs 100
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* FLAGSHIP INTERACTIVE ENGINE */}
          <section className="w-full py-space-xl bg-background" id="workbench">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop">
              {/* Multi-Country & Currency Standard Selector Bar */}
              <div className="mb-space-md p-space-md rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[24px]">payments</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-label-caps text-label-caps text-on-surface font-semibold uppercase tracking-wider">
                        Country &amp; Currency Standard
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-data-mono font-bold bg-secondary/15 text-secondary">
                        {currentCurrency.flag} {currentCurrency.code} ({currentCurrency.symbol.trim()})
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant">
                      Auto-calibrates commercial discounts, gross margins, price anchors, and tax rates.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Select Dropdown with all countries */}
                  <div className="relative flex items-center">
                    <select
                      id="currencySelectorDropdown"
                      value={selectedCurrencyCode}
                      onChange={(e) => handleCurrencyChange(e.target.value)}
                      className="pl-9 pr-8 py-2 rounded-xl bg-surface-container-low text-on-surface font-body-sm text-body-sm font-semibold border border-outline-variant/40 shadow-xs focus:ring-2 focus:ring-primary focus:outline-none cursor-pointer"
                    >
                      {PERCENTAGE_CURRENCIES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.name} — {c.code} ({c.symbol.trim()})
                        </option>
                      ))}
                    </select>
                    <span className="absolute left-2.5 text-base pointer-events-none select-none">
                      {currentCurrency.flag}
                    </span>
                    <span className="material-symbols-outlined absolute right-2 text-outline text-[18px] pointer-events-none">
                      arrow_drop_down
                    </span>
                  </div>

                  {/* Fast Quick-Switch Pills for Key Global Currencies */}
                  <div className="hidden sm:flex items-center gap-1">
                    {['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD', 'JPY', 'AED'].map((code) => {
                      const item = getPercentageCurrency(code);
                      const isSelected = selectedCurrencyCode === code;
                      return (
                        <button
                          key={code}
                          onClick={() => handleCurrencyChange(code)}
                          type="button"
                          className={`px-2.5 py-1.5 rounded-lg text-[12px] font-data-mono font-medium transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-primary text-on-primary font-bold shadow-xs'
                              : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                          }`}
                        >
                          {item.flag} {item.code}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Mode Selection Grid */}
              <div
                className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-space-2xs bg-surface-container-low p-space-xs rounded-xl shadow-inner mb-space-lg border border-surface-container"
                id="modeTabs"
              >
                {[
                  { id: 'percentOf', label: 'X% of Y' },
                  { id: 'increase', label: '% Increase' },
                  { id: 'decrease', label: '% Decrease' },
                  { id: 'change', label: '% Change' },
                  { id: 'diff', label: '% Difference' },
                  { id: 'reverse', label: 'Reverse %' },
                  { id: 'discount', label: 'Discount & Sale' },
                  { id: 'margin', label: 'Profit / Margin' },
                ].map((tab) => {
                  const isActive = mode === tab.id;
                  return (
                    <button
                      key={tab.id}
                      className={`mode-btn px-2 py-2.5 rounded-lg text-center font-body-sm text-body-sm font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-primary-container text-on-primary-container shadow-xs font-bold'
                          : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-medium'
                      }`}
                      data-mode={tab.id}
                      onClick={() => handleSwitchTab(tab.id as PercentageMode)}
                      type="button"
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Main Workbench Split-Pane */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
                {/* Input & Interactive Configuration Panel (7 Cols) */}
                <div className="lg:col-span-7 space-y-space-md">
                  <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-md space-y-space-md border border-outline-variant/20">
                    <div className="flex items-center justify-between border-b pb-3 border-surface-container">
                      <span className="font-label-caps text-label-caps uppercase text-primary font-bold tracking-wider" id="activeModeLabel">
                        {activeCfg.label}
                      </span>
                      <button
                        className="text-body-sm font-body-sm text-on-surface-variant hover:text-error flex items-center gap-1 transition-colors cursor-pointer"
                        onClick={handleReset}
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[16px]">restart_alt</span> Reset
                      </button>
                    </div>

                    {/* Interactive Inputs Container */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md" id="inputContainer">
                      {/* Dynamic Slot 1 */}
                      <div className="space-y-space-2xs">
                        <label className="font-body-sm text-body-sm font-medium text-on-surface" id="labelA">
                          {activeCfg.labelA}
                        </label>
                        <div className="relative flex items-center">
                          <input
                            className="w-full bg-surface-container-low text-on-surface font-data-mono text-[20px] font-semibold pl-4 pr-20 py-space-sm rounded-lg focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary shadow-inner [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            id="inputValA"
                            step="any"
                            type="number"
                            value={valA}
                            onChange={(e) => setValA(parseFloat(e.target.value) || 0)}
                          />
                          <span
                            className="absolute right-3 pointer-events-none select-none font-data-mono text-[13px] font-bold text-primary bg-surface-container-high/90 px-2.5 py-1 rounded-md border border-outline-variant/30 shadow-xs z-10"
                            id="unitA"
                          >
                            {activeCfg.unitA}
                          </span>
                        </div>
                        {/* Quick Preset Chips for Input A */}
                        <div className="flex flex-wrap gap-1 pt-1" id="chipsContainer">
                          {activeCfg.chipsA.map((chipVal) => {
                            const displayLabel =
                              activeCfg.unitA === '%' || activeCfg.unitA === '% Off'
                                ? `${chipVal}%`
                                : activeCfg.unitA === currentCurrency.symbol.trim()
                                ? `${currentCurrency.symbol}${chipVal}`
                                : chipVal;
                            return (
                              <button
                                key={chipVal}
                                className={`text-[11px] font-data-mono px-2 py-0.5 rounded transition-colors cursor-pointer ${
                                  valA === chipVal
                                    ? 'bg-primary-fixed text-on-primary-fixed font-bold'
                                    : 'bg-surface-container text-on-surface hover:bg-primary-fixed'
                                }`}
                                onClick={() => setValA(chipVal)}
                                type="button"
                              >
                                {displayLabel}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Dynamic Slot 2 */}
                      <div className="space-y-space-2xs">
                        <label className="font-body-sm text-body-sm font-medium text-on-surface" id="labelB">
                          {activeCfg.labelB}
                        </label>
                        <div className="relative flex items-center">
                          <input
                            className="w-full bg-surface-container-low text-on-surface font-data-mono text-[20px] font-semibold pl-4 pr-20 py-space-sm rounded-lg focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary shadow-inner [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            id="inputValB"
                            step="any"
                            type="number"
                            value={valB}
                            onChange={(e) => setValB(parseFloat(e.target.value) || 0)}
                          />
                          <span
                            className="absolute right-3 pointer-events-none select-none font-data-mono text-[13px] font-bold text-primary bg-surface-container-high/90 px-2.5 py-1 rounded-md border border-outline-variant/30 shadow-xs z-10"
                            id="unitB"
                          >
                            {activeCfg.unitB}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {activeCfg.chipsB.map((chipVal) => {
                            const displayLabel =
                              activeCfg.unitB === '%' || activeCfg.unitB === '% Off'
                                ? `${chipVal}%`
                                : activeCfg.unitB === currentCurrency.symbol.trim()
                                ? `${currentCurrency.symbol}${chipVal}`
                                : chipVal.toLocaleString();
                            return (
                              <button
                                key={chipVal}
                                className={`text-[11px] font-data-mono px-2 py-0.5 rounded transition-colors cursor-pointer ${
                                  valB === chipVal
                                    ? 'bg-primary-fixed text-on-primary-fixed font-bold'
                                    : 'bg-surface-container text-on-surface hover:bg-primary-fixed'
                                }`}
                                onClick={() => setValB(chipVal)}
                                type="button"
                              >
                                {displayLabel}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Dynamic Interactive Slider */}
                    <div className="pt-space-xs space-y-space-2xs">
                      <div className="flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant">
                        <span>Direct Parameter Micro-Dial</span>
                        <span className="font-data-mono text-on-surface font-semibold" id="sliderDisplay">
                          {valA}%
                        </span>
                      </div>
                      <input
                        className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary"
                        id="paramSlider"
                        max="100"
                        min="0"
                        step="0.5"
                        type="range"
                        value={Math.min(Math.max(valA, 0), 100)}
                        onChange={handleSliderChange}
                      />
                      <div className="flex justify-between text-[11px] font-data-mono text-outline">
                        <span>0%</span>
                        <span>25%</span>
                        <span>50%</span>
                        <span>75%</span>
                        <span>100%</span>
                      </div>
                    </div>

                    {/* Precision Metric Pills */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-xs pt-space-xs">
                      <div className="bg-surface-container-low p-space-xs rounded-lg text-center">
                        <div className="font-label-caps text-label-caps text-outline uppercase">Fraction</div>
                        <div className="font-data-mono text-body-sm font-bold text-on-surface" id="metricFraction">
                          {calculation.fractionStr}
                        </div>
                      </div>
                      <div className="bg-surface-container-low p-space-xs rounded-lg text-center">
                        <div className="font-label-caps text-label-caps text-outline uppercase">Decimal Coeff</div>
                        <div className="font-data-mono text-body-sm font-bold text-on-surface" id="metricDecimal">
                          {calculation.decimalStr}
                        </div>
                      </div>
                      <div className="bg-surface-container-low p-space-xs rounded-lg text-center">
                        <div className="font-label-caps text-label-caps text-outline uppercase">Ratio Equiv</div>
                        <div className="font-data-mono text-body-sm font-bold text-on-surface" id="metricRatio">
                          {calculation.ratioStr}
                        </div>
                      </div>
                      <div className="bg-surface-container-low p-space-xs rounded-lg text-center">
                        <div className="font-label-caps text-label-caps text-outline uppercase">Permille (‰)</div>
                        <div className="font-data-mono text-body-sm font-bold text-on-surface" id="metricPermille">
                          {calculation.permilleStr}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step-by-Step Formal Mathematical Proof Box */}
                  <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-md space-y-space-sm border border-outline-variant/20">
                    <div className="flex items-center justify-between">
                      <h2 className="font-headline-md text-headline-md font-bold text-on-surface flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary text-[22px]">functions</span>
                        Deductive Mathematical Proof
                      </h2>
                      <span className="font-label-caps text-label-caps px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-mono">
                        Formal Step-Through
                      </span>
                    </div>

                    <div className="bg-surface-container p-space-md rounded-lg font-data-mono text-body-sm space-y-space-xs" id="proofSteps">
                      {calculation.steps.map((item, idx) => (
                        <div
                          key={idx}
                          className={
                            item.isFinal
                              ? 'text-on-surface font-bold text-[16px] pt-1'
                              : 'text-on-surface-variant'
                          }
                        >
                          {item.step}{' '}
                          <span
                            className={
                              item.isFinal
                                ? 'text-primary'
                                : idx === 0
                                ? 'text-primary font-bold'
                                : 'text-on-surface font-semibold'
                            }
                          >
                            {item.formula}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Utility Action Strip */}
                    <div className="flex flex-wrap items-center justify-between gap-space-xs pt-space-xs">
                      <div className="flex items-center gap-space-xs">
                        <button
                          className="px-space-sm py-1.5 rounded-lg bg-surface-container-high text-on-surface hover:bg-primary hover:text-on-primary transition-all font-body-sm text-body-sm font-medium flex items-center gap-1 cursor-pointer"
                          id="copyBtn"
                          onClick={handleCopyResult}
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[16px]">content_copy</span> Copy Solution
                        </button>
                        <button
                          className="px-space-sm py-1.5 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-container-highest transition-all font-body-sm text-body-sm font-medium flex items-center gap-1 cursor-pointer"
                          onClick={handleExportCSV}
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[16px]">download</span> CSV
                        </button>
                        <button
                          className="px-space-sm py-1.5 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-container-highest transition-all font-body-sm text-body-sm font-medium flex items-center gap-1 cursor-pointer"
                          onClick={() => window.print()}
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[16px]">print</span> Print Sheet
                        </button>
                      </div>
                      {copiedToast && (
                        <span className="font-data-mono text-[12px] text-primary inline-flex items-center gap-1 font-semibold" id="copiedToast">
                          <span className="material-symbols-outlined text-[14px]">check</span> Copied to clipboard!
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Real-Time Dynamic Sticky Output Sidecar (5 Cols) */}
                <div className="lg:col-span-5 space-y-space-md lg:sticky lg:top-24">
                  {/* Big Output Card */}
                  <div className="bg-gradient-to-br from-surface-container to-surface-container-high p-space-lg rounded-xl shadow-lg relative overflow-hidden space-y-space-md border border-outline-variant/30">
                    <div className="flex items-center justify-between">
                      <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-bold">
                        CALCULATED RESULT
                      </span>
                      <span className="material-symbols-outlined text-primary text-[20px]">electric_bolt</span>
                    </div>
                    <div className="space-y-1">
                      <div className="font-numerical-display text-numerical-display font-bold text-on-surface tracking-tight" id="mainOutput">
                        {calculation.formattedResult}
                      </div>
                      <div className="font-body-md text-body-md text-on-surface-variant font-medium" id="outputSubtext">
                        {calculation.subtext}
                      </div>
                    </div>

                    {/* Dynamic Visualizer: Ring / Donut SVG & Segmented Bars */}
                    <div className="bg-surface-container-lowest/80 backdrop-blur-md p-space-md rounded-xl space-y-space-md shadow-xs">
                      <div className="font-label-caps text-label-caps uppercase text-outline font-bold tracking-wider">
                        Spatial Geometry Breakdown
                      </div>
                      <div className="flex items-center justify-around gap-space-md">
                        {/* SVG Progress Donut */}
                        <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                          <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 100 100">
                            <circle
                              className="text-surface-container-high"
                              cx="50"
                              cy="50"
                              fill="transparent"
                              r="40"
                              stroke="currentColor"
                              strokeWidth="12"
                            />
                            <circle
                              className="text-primary transition-all duration-300"
                              cx="50"
                              cy="50"
                              fill="transparent"
                              id="donutCircle"
                              r="40"
                              stroke="currentColor"
                              strokeDasharray="251.2"
                              strokeDashoffset={donutStrokeOffset}
                              strokeLinecap="round"
                              strokeWidth="12"
                            />
                          </svg>
                          <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                            <span className="font-data-mono text-[16px] font-bold text-on-surface" id="donutPercent">
                              {Math.round(calculation.visualPercent)}%
                            </span>
                            <span className="font-label-caps text-[9px] uppercase text-outline">Slice</span>
                          </div>
                        </div>

                        {/* Numerical Part vs Remainder Matrix */}
                        <div className="space-y-2 flex-1">
                          <div className="space-y-1">
                            <div className="flex justify-between text-body-sm font-body-sm">
                              <span className="text-on-surface font-medium flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block"></span> Part (Calculated)
                              </span>
                              <span className="font-data-mono font-bold text-on-surface" id="donutPartVal">
                                {formatDecimal(calculation.calculatedPart)}
                              </span>
                            </div>
                            <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-primary h-full transition-all duration-300"
                                id="barPart"
                                style={{ width: `${calculation.visualPercent}%` }}
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-body-sm font-body-sm">
                              <span className="text-on-surface-variant flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-surface-container-highest inline-block"></span> Remainder / Base
                              </span>
                              <span className="font-data-mono font-medium text-on-surface-variant" id="donutRemainderVal">
                                {formatDecimal(calculation.remainder)}
                              </span>
                            </div>
                            <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-secondary-container h-full transition-all duration-300"
                                id="barRemainder"
                                style={{ width: `${Math.max(100 - calculation.visualPercent, 0)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contextual Quick Comparative Pill */}
                    <div className="p-space-sm rounded-lg bg-surface-container-lowest/60 text-body-sm font-body-sm text-on-surface-variant flex items-center justify-between">
                      <span>Whole Baseline:</span>
                      <span className="font-data-mono font-bold text-on-surface" id="metricBase">
                        {formatDecimal(valB)}
                      </span>
                    </div>
                  </div>

                  {/* Quick Actions & Reverse Calculation Prompt */}
                  <div className="bg-surface-container-low p-space-md rounded-xl space-y-space-xs text-body-sm font-body-sm border border-surface-container">
                    <span className="font-label-caps text-label-caps uppercase text-secondary font-bold">Inverse Relationship</span>
                    <p className="text-on-surface-variant" id="inverseProofText">
                      {calculation.inverseHtml}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* QUICK 1-CLICK PERCENTAGE LOOKUP BENCHMARKS MATRIX */}
          <section className="w-full py-space-2xl bg-surface">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop space-y-space-lg">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-space-sm">
                <div>
                  <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-bold">Instant Mental Benchmarks</span>
                  <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">Common Percentage Heuristics</h2>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md">
                  Standardized operational multipliers applied instantaneously against sample base <span className="font-data-mono font-bold text-on-surface">N = 500</span>.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
                {/* 10% */}
                <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs hover:shadow-md transition-shadow space-y-space-xs border border-outline-variant/20">
                  <div className="flex items-center justify-between">
                    <span className="font-data-mono text-headline-md font-bold text-primary">10%</span>
                    <span className="font-label-caps text-[10px] px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-bold">÷ 10</span>
                  </div>
                  <div className="font-body-sm text-body-sm font-semibold text-on-surface">Shift Decimal One Left</div>
                  <p className="text-body-sm font-body-sm text-on-surface-variant">Multiply by 0.10. Move radix point left by 1 digit.</p>
                  <div className="p-2 rounded bg-surface-container-low font-data-mono text-[13px] text-on-surface">
                    10% of 500 = <span className="text-primary font-bold">50.00</span>
                  </div>
                </div>

                {/* 15% */}
                <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs hover:shadow-md transition-shadow space-y-space-xs border border-outline-variant/20">
                  <div className="flex items-center justify-between">
                    <span className="font-data-mono text-headline-md font-bold text-primary">15%</span>
                    <span className="font-label-caps text-[10px] px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-bold">10% + Half</span>
                  </div>
                  <div className="font-body-sm text-body-sm font-semibold text-on-surface">Standard Gratuity Split</div>
                  <p className="text-body-sm font-body-sm text-on-surface-variant">Find 10% first, then add half of that 10%.</p>
                  <div className="p-2 rounded bg-surface-container-low font-data-mono text-[13px] text-on-surface">
                    15% of 500 = (50 + 25) = <span className="text-primary font-bold">75.00</span>
                  </div>
                </div>

                {/* 20% */}
                <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs hover:shadow-md transition-shadow space-y-space-xs border border-outline-variant/20">
                  <div className="flex items-center justify-between">
                    <span className="font-data-mono text-headline-md font-bold text-primary">20%</span>
                    <span className="font-label-caps text-[10px] px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-bold">÷ 5</span>
                  </div>
                  <div className="font-body-sm text-body-sm font-semibold text-on-surface">Exact Fifth Fraction</div>
                  <p className="text-body-sm font-body-sm text-on-surface-variant">Multiply by 2 then divide by 10, or divide directly by 5.</p>
                  <div className="p-2 rounded bg-surface-container-low font-data-mono text-[13px] text-on-surface">
                    20% of 500 = 500 / 5 = <span className="text-primary font-bold">100.00</span>
                  </div>
                </div>

                {/* 25% */}
                <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs hover:shadow-md transition-shadow space-y-space-xs border border-outline-variant/20">
                  <div className="flex items-center justify-between">
                    <span className="font-data-mono text-headline-md font-bold text-primary">25%</span>
                    <span className="font-label-caps text-[10px] px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-bold">÷ 4</span>
                  </div>
                  <div className="font-body-sm text-body-sm font-semibold text-on-surface">Quarter Division</div>
                  <p className="text-body-sm font-body-sm text-on-surface-variant">Half of a half. Divide number twice by 2.</p>
                  <div className="p-2 rounded bg-surface-container-low font-data-mono text-[13px] text-on-surface">
                    25% of 500 = 250 / 2 = <span className="text-primary font-bold">125.00</span>
                  </div>
                </div>

                {/* 33.3% */}
                <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs hover:shadow-md transition-shadow space-y-space-xs border border-outline-variant/20">
                  <div className="flex items-center justify-between">
                    <span className="font-data-mono text-headline-md font-bold text-secondary">33.3̄%</span>
                    <span className="font-label-caps text-[10px] px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-bold">÷ 3</span>
                  </div>
                  <div className="font-body-sm text-body-sm font-semibold text-on-surface">One-Third Integer</div>
                  <p className="text-body-sm font-body-sm text-on-surface-variant">Exact infinite repeating fraction 1/3 (0.3333...).</p>
                  <div className="p-2 rounded bg-surface-container-low font-data-mono text-[13px] text-on-surface">
                    33.33% of 500 = <span className="text-secondary font-bold">166.67</span>
                  </div>
                </div>

                {/* 50% */}
                <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs hover:shadow-md transition-shadow space-y-space-xs border border-outline-variant/20">
                  <div className="flex items-center justify-between">
                    <span className="font-data-mono text-headline-md font-bold text-secondary">50%</span>
                    <span className="font-label-caps text-[10px] px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-bold">÷ 2</span>
                  </div>
                  <div className="font-body-sm text-body-sm font-semibold text-on-surface">Symmetric Bisection</div>
                  <p className="text-body-sm font-body-sm text-on-surface-variant">Exact median split. Divide whole in half.</p>
                  <div className="p-2 rounded bg-surface-container-low font-data-mono text-[13px] text-on-surface">
                    50% of 500 = 500 / 2 = <span className="text-secondary font-bold">250.00</span>
                  </div>
                </div>

                {/* 75% */}
                <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs hover:shadow-md transition-shadow space-y-space-xs border border-outline-variant/20">
                  <div className="flex items-center justify-between">
                    <span className="font-data-mono text-headline-md font-bold text-secondary">75%</span>
                    <span className="font-label-caps text-[10px] px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-bold">50% + 25%</span>
                  </div>
                  <div className="font-body-sm text-body-sm font-semibold text-on-surface">Three Quarters (3/4)</div>
                  <p className="text-body-sm font-body-sm text-on-surface-variant">Subtract 25% from the original or add half + quarter.</p>
                  <div className="p-2 rounded bg-surface-container-low font-data-mono text-[13px] text-on-surface">
                    75% of 500 = 500 - 125 = <span className="text-secondary font-bold">375.00</span>
                  </div>
                </div>

                {/* 100% & Beyond */}
                <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs hover:shadow-md transition-shadow space-y-space-xs border border-outline-variant/20">
                  <div className="flex items-center justify-between">
                    <span className="font-data-mono text-headline-md font-bold text-secondary">100%</span>
                    <span className="font-label-caps text-[10px] px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-bold">× 1.0</span>
                  </div>
                  <div className="font-body-sm text-body-sm font-semibold text-on-surface">Full Identity Parity</div>
                  <p className="text-body-sm font-body-sm text-on-surface-variant">The totality of the quantity itself without transformation.</p>
                  <div className="p-2 rounded bg-surface-container-low font-data-mono text-[13px] text-on-surface">
                    100% of 500 = <span className="text-secondary font-bold">500.00</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* DEDICATED DEEP-DIVE WORKBENCH MODULES (Bento Architecture) */}
          <section className="w-full py-space-3xl bg-surface-container-low border-y border-surface-container">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop space-y-space-2xl">
              <div className="max-w-2xl space-y-space-xs">
                <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-bold">Specialized Operational Engines</span>
                <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">Domain-Specific Calculation Suites</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">Interactive micro-engines purpose-built for retail trade, academic credentials, corporate margins, and statutory taxation.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg">
                {/* MODULE A: Retail Shopping & Stackable Discount Engine */}
                <div className="bg-surface-container-lowest p-space-xl rounded-xl shadow-md space-y-space-md border border-outline-variant/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-space-sm">
                      <span className="p-2 rounded-lg bg-primary-fixed text-primary material-symbols-outlined">shopping_cart</span>
                      <div>
                        <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Discount &amp; Sale Price Studio</h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">Includes optional secondary stackable coupon discount</p>
                      </div>
                    </div>
                    <span className="font-label-caps text-label-caps bg-surface-container px-2 py-1 rounded text-on-surface-variant font-mono">Retail Mode</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
                    <div>
                      <label className="font-body-sm text-body-sm text-on-surface font-medium" htmlFor="discRetailInput">
                        Original Retail ({currentCurrency.symbol.trim()})
                      </label>
                      <input
                        id="discRetailInput"
                        className="w-full mt-1 bg-surface-container-low text-on-surface font-data-mono font-semibold p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
                        type="number"
                        value={discRetail}
                        onChange={(e) => setDiscRetail(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <label className="font-body-sm text-body-sm text-on-surface font-medium" htmlFor="discStoreInput">Store Discount (%)</label>
                      <input
                        id="discStoreInput"
                        className="w-full mt-1 bg-surface-container-low text-on-surface font-data-mono font-semibold p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
                        type="number"
                        value={discStore}
                        onChange={(e) => setDiscStore(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <label className="font-body-sm text-body-sm text-on-surface font-medium" htmlFor="discExtraInput">Stackable Promo (%)</label>
                      <input
                        id="discExtraInput"
                        className="w-full mt-1 bg-surface-container-low text-on-surface font-data-mono font-semibold p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
                        type="number"
                        value={discExtra}
                        onChange={(e) => setDiscExtra(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                  <div className="p-space-md rounded-lg bg-surface-container flex flex-wrap items-center justify-between gap-space-md">
                    <div>
                      <div className="font-label-caps text-label-caps uppercase text-outline">Final Checkout Total</div>
                      <div className="font-numerical-display text-[32px] font-bold text-primary" id="retailFinal">
                        {currentCurrency.symbol}{formatDecimal(retailCalc.final)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-label-caps text-label-caps uppercase text-outline">Total Pocket Savings</div>
                      <div className="font-data-mono text-[20px] font-bold text-on-surface" id="retailSaved">
                        {currentCurrency.symbol}{formatDecimal(retailCalc.saved)} ({retailCalc.effectiveRate.toFixed(1)}%)
                      </div>
                    </div>
                  </div>
                  <div className="text-[12px] font-data-mono text-outline leading-tight">
                    *Note: Stackable discounts are multiplicative: {currentCurrency.symbol}{discRetail} × (1 - {(discStore / 100).toFixed(2)}) × (1 - {(discExtra / 100).toFixed(2)}) = {currentCurrency.symbol}{formatDecimal(retailCalc.final)}. Not additive {discStore + discExtra}%.
                  </div>
                </div>

                {/* MODULE B: Business Profit Margin vs Markup Workbench */}
                <div className="bg-surface-container-lowest p-space-xl rounded-xl shadow-md space-y-space-md border border-outline-variant/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-space-sm">
                      <span className="p-2 rounded-lg bg-primary-fixed text-primary material-symbols-outlined">trending_up</span>
                      <div>
                        <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Margin vs Markup Demystifier</h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">Eliminate the #1 error in business pricing models</p>
                      </div>
                    </div>
                    <span className="font-label-caps text-label-caps bg-surface-container px-2 py-1 rounded text-on-surface-variant font-mono">Commerce</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                    <div>
                      <label className="font-body-sm text-body-sm text-on-surface font-medium" htmlFor="cogsValInput">
                        Cost of Goods (COGS {currentCurrency.symbol.trim()})
                      </label>
                      <input
                        id="cogsValInput"
                        className="w-full mt-1 bg-surface-container-low text-on-surface font-data-mono font-semibold p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
                        type="number"
                        value={cogsVal}
                        onChange={(e) => setCogsVal(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <label className="font-body-sm text-body-sm text-on-surface font-medium" htmlFor="priceValInput">
                        Target Selling Price ({currentCurrency.symbol.trim()})
                      </label>
                      <input
                        id="priceValInput"
                        className="w-full mt-1 bg-surface-container-low text-on-surface font-data-mono font-semibold p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
                        type="number"
                        value={priceVal}
                        onChange={(e) => setPriceVal(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-space-sm">
                    <div className="p-space-sm rounded-lg bg-surface-container-low text-center">
                      <div className="font-label-caps text-label-caps uppercase text-outline">Gross Profit Margin</div>
                      <div className="font-data-mono text-[22px] font-bold text-primary" id="marginRes">
                        {formatDecimal(marginCalc.margin)}%
                      </div>
                      <div className="text-[11px] font-data-mono text-outline-variant mt-1">Profit / Revenue</div>
                    </div>
                    <div className="p-space-sm rounded-lg bg-surface-container-low text-center">
                      <div className="font-label-caps text-label-caps uppercase text-outline">Markup on Cost</div>
                      <div className="font-data-mono text-[22px] font-bold text-secondary" id="markupRes">
                        {formatDecimal(marginCalc.markup)}%
                      </div>
                      <div className="text-[11px] font-data-mono text-outline-variant mt-1">Profit / COGS</div>
                    </div>
                  </div>
                  <div className="p-2 rounded bg-surface-container text-body-sm font-body-sm text-on-surface-variant">
                    Net Profit: <strong className="text-on-surface font-data-mono" id="dollarProfit">{currentCurrency.symbol}{formatDecimal(marginCalc.profit)}</strong> per unit sold.
                  </div>
                </div>

                {/* MODULE C: Academic Marks, Exam Grade & GPA Metric */}
                <div className="bg-surface-container-lowest p-space-xl rounded-xl shadow-md space-y-space-md border border-outline-variant/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-space-sm">
                      <span className="p-2 rounded-lg bg-secondary-fixed text-secondary material-symbols-outlined">school</span>
                      <div>
                        <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Academic Grade &amp; Test Score</h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">Percentage yield, letter tier, and 4.0 GPA equivalence</p>
                      </div>
                    </div>
                    <span className="font-label-caps text-label-caps bg-surface-container px-2 py-1 rounded text-on-surface-variant font-mono">Academic</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                    <div>
                      <label className="font-body-sm text-body-sm text-on-surface font-medium" htmlFor="marksGotInput">Marks Obtained / Score</label>
                      <input
                        id="marksGotInput"
                        className="w-full mt-1 bg-surface-container-low text-on-surface font-data-mono font-semibold p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
                        type="number"
                        value={marksGot}
                        onChange={(e) => setMarksGot(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <label className="font-body-sm text-body-sm text-on-surface font-medium" htmlFor="marksTotalInput">Total Maximum Marks</label>
                      <input
                        id="marksTotalInput"
                        className="w-full mt-1 bg-surface-container-low text-on-surface font-data-mono font-semibold p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
                        type="number"
                        value={marksTotal}
                        onChange={(e) => setMarksTotal(parseFloat(e.target.value) || 1)}
                      />
                    </div>
                  </div>
                  <div className="p-space-md rounded-lg bg-surface-container flex items-center justify-between">
                    <div>
                      <div className="font-label-caps text-label-caps uppercase text-outline">Percent Standing</div>
                      <div className="font-numerical-display text-[28px] font-bold text-on-surface" id="gradePercent">
                        {formatDecimal(academicCalc.pct)}%
                      </div>
                    </div>
                    <div className="text-right space-y-0.5">
                      <div className="font-label-caps text-label-caps uppercase text-outline">Scale Standing</div>
                      <div className="font-headline-md text-headline-md font-bold text-primary" id="gradeLetter">
                        {academicCalc.letter}
                      </div>
                      <div className="font-data-mono text-[13px] text-on-surface-variant" id="gradeGpa">
                        {academicCalc.gpa}
                      </div>
                    </div>
                  </div>
                </div>

                {/* MODULE D: GST, VAT & Sales Tax Reversal Engine */}
                <div className="bg-surface-container-lowest p-space-xl rounded-xl shadow-md space-y-space-md border border-outline-variant/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-space-sm">
                      <span className="p-2 rounded-lg bg-primary-fixed text-primary material-symbols-outlined">receipt_long</span>
                      <div>
                        <h3 className="font-headline-md text-headline-md font-bold text-on-surface">VAT, GST &amp; Tax Reverser</h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Deconstruct gross invoice values or compute forward gross ({currentCurrency.flag} {currentCurrency.name}: {currentCurrency.vatName})
                        </p>
                      </div>
                    </div>
                    <span className="font-label-caps text-label-caps bg-surface-container px-2 py-1 rounded text-on-surface-variant font-mono">
                      {currentCurrency.code} Fiscal
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                    <div>
                      <label className="font-body-sm text-body-sm text-on-surface font-medium" htmlFor="taxBaseInput">
                        Invoice Amount ({currentCurrency.symbol.trim()})
                      </label>
                      <input
                        id="taxBaseInput"
                        className="w-full mt-1 bg-surface-container-low text-on-surface font-data-mono font-semibold p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
                        type="number"
                        value={taxBase}
                        onChange={(e) => setTaxBase(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <label className="font-body-sm text-body-sm text-on-surface font-medium" htmlFor="taxRateInput">
                        Tax Rate (%) — {currentCurrency.vatName}
                      </label>
                      <input
                        id="taxRateInput"
                        className="w-full mt-1 bg-surface-container-low text-on-surface font-data-mono font-semibold p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
                        type="number"
                        value={taxRate}
                        onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                      />
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        <button
                          type="button"
                          onClick={() => setTaxRate(currentCurrency.vatRate)}
                          className={`text-[11px] font-data-mono px-2 py-0.5 rounded cursor-pointer ${
                            taxRate === currentCurrency.vatRate
                              ? 'bg-primary-fixed text-on-primary-fixed font-bold'
                              : 'bg-surface-container text-on-surface hover:bg-primary-fixed'
                          }`}
                        >
                          {currentCurrency.vatRate}% ({currentCurrency.vatName})
                        </button>
                        {[5, 10, 15, 20].filter(r => r !== currentCurrency.vatRate).map((r) => (
                          <button
                            key={r}
                            type="button"
                            onClick={() => setTaxRate(r)}
                            className={`text-[11px] font-data-mono px-2 py-0.5 rounded cursor-pointer ${
                              taxRate === r
                                ? 'bg-primary-fixed text-on-primary-fixed font-bold'
                                : 'bg-surface-container text-on-surface hover:bg-primary-fixed'
                            }`}
                          >
                            {r}%
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-space-sm">
                    <div className="p-space-sm rounded-lg bg-surface-container-low">
                      <div className="font-label-caps text-label-caps uppercase text-outline">If Tax is INCLUSIVE:</div>
                      <div className="font-body-sm font-semibold text-on-surface mt-1">
                        Pre-Tax: <span className="font-data-mono text-primary" id="taxExclNet">{currentCurrency.symbol}{formatDecimal(taxCalc.net)}</span>
                      </div>
                      <div className="font-body-sm text-on-surface-variant">
                        Tax Paid: <span className="font-data-mono" id="taxExclPortion">{currentCurrency.symbol}{formatDecimal(taxCalc.taxIn)}</span>
                      </div>
                    </div>
                    <div className="p-space-sm rounded-lg bg-surface-container-low">
                      <div className="font-label-caps text-label-caps uppercase text-outline">If Tax is EXCLUSIVE:</div>
                      <div className="font-body-sm font-semibold text-on-surface mt-1">
                        Gross: <span className="font-data-mono text-secondary" id="taxInclGross">{currentCurrency.symbol}{formatDecimal(taxCalc.gross)}</span>
                      </div>
                      <div className="font-body-sm text-on-surface-variant">
                        Added Tax: <span className="font-data-mono" id="taxInclPortion">{currentCurrency.symbol}{formatDecimal(taxCalc.taxOut)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FORMULA & PROOF CARDS SECTION */}
          <section className="w-full py-space-3xl bg-surface">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop space-y-space-xl">
              <div className="max-w-3xl space-y-space-xs">
                <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-bold">Rigorous Mathematical Standards</span>
                <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">Mathematical Formulations &amp; Axioms</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">Every equation underlying SolveIt Calculator percentage mechanics formatted in precise algebraic notation.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
                {/* Card 1 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-md space-y-space-sm border border-outline-variant/20">
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps text-primary font-bold">DIRECT RATIO</span>
                    <span className="font-data-mono text-[11px] text-outline">Form 01</span>
                  </div>
                  <div className="p-space-sm bg-surface-container rounded-lg font-data-mono text-center text-body-md font-bold text-on-surface">
                    P = (X / 100) × Y
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Calculates the isolated share of a base number when scaled by hundredths.</p>
                  <div className="text-[12px] font-data-mono text-outline-variant bg-surface-container-low p-2 rounded">
                    Example: 20% of 500 = (20/100) × 500 = 100
                  </div>
                </div>

                {/* Card 2 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-md space-y-space-sm border border-outline-variant/20">
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps text-primary font-bold">PERCENT INCREASE</span>
                    <span className="font-data-mono text-[11px] text-outline">Form 02</span>
                  </div>
                  <div className="p-space-sm bg-surface-container rounded-lg font-data-mono text-center text-body-md font-bold text-on-surface">
                    Δ% = ((New - Old) / Old) × 100
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Measures directional upward scaling relative to the initial seed state.</p>
                  <div className="text-[12px] font-data-mono text-outline-variant bg-surface-container-low p-2 rounded">
                    Example: 100 to 130 = ((130-100)/100) × 100 = +30%
                  </div>
                </div>

                {/* Card 3 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-md space-y-space-sm border border-outline-variant/20">
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps text-primary font-bold">PERCENT DECREASE</span>
                    <span className="font-data-mono text-[11px] text-outline">Form 03</span>
                  </div>
                  <div className="p-space-sm bg-surface-container rounded-lg font-data-mono text-center text-body-md font-bold text-on-surface">
                    -Δ% = ((Old - New) / Old) × 100
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Quantifies downward shrinkage against the starting baseline.</p>
                  <div className="text-[12px] font-data-mono text-outline-variant bg-surface-container-low p-2 rounded">
                    Example: 200 to 150 = ((200-150)/200) × 100 = 25% drop
                  </div>
                </div>

                {/* Card 4 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-md space-y-space-sm border border-outline-variant/20">
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps text-secondary font-bold">SYMMETRIC VARIANCE</span>
                    <span className="font-data-mono text-[11px] text-outline">Form 04</span>
                  </div>
                  <div className="p-space-sm bg-surface-container rounded-lg font-data-mono text-center text-body-md font-bold text-on-surface">
                    % Diff = (|A - B| / ((A + B) / 2)) × 100
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Non-directional comparison using the midpoint average as reference anchor.</p>
                  <div className="text-[12px] font-data-mono text-outline-variant bg-surface-container-low p-2 rounded">
                    Example: 80 vs 100 = (20 / 90) × 100 = 22.22%
                  </div>
                </div>

                {/* Card 5 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-md space-y-space-sm border border-outline-variant/20">
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps text-secondary font-bold">REVERSE TAX / DISCOUNT</span>
                    <span className="font-data-mono text-[11px] text-outline">Form 05</span>
                  </div>
                  <div className="p-space-sm bg-surface-container rounded-lg font-data-mono text-center text-body-md font-bold text-on-surface">
                    Original = Final / (1 ± (R / 100))
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Reverses statutory levies or commercial discounts to recover starting amounts.</p>
                  <div className="text-[12px] font-data-mono text-outline-variant bg-surface-container-low p-2 rounded">
                    Example: $115 with 15% tax = 115 / 1.15 = $100.00
                  </div>
                </div>

                {/* Card 6 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-md space-y-space-sm border border-outline-variant/20">
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps text-secondary font-bold">PROFIT MARGIN</span>
                    <span className="font-data-mono text-[11px] text-outline">Form 06</span>
                  </div>
                  <div className="p-space-sm bg-surface-container rounded-lg font-data-mono text-center text-body-md font-bold text-on-surface">
                    Margin % = ((Rev - COGS) / Rev) × 100
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Expresses residual gross profit as a percentage of total top-line revenue.</p>
                  <div className="text-[12px] font-data-mono text-outline-variant bg-surface-container-low p-2 rounded">
                    Example: ($100 - $60)/$100 = 40% Margin
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* COMMON PERCENTAGES REFERENCE TABLE MATRIX */}
          <section className="w-full py-space-2xl bg-surface-container-low border-y border-surface-container">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop space-y-space-lg">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-space-sm">
                <div>
                  <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-bold">Standard Conversion Chart</span>
                  <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">Comprehensive Percentage Equivalent Matrix</h2>
                </div>
                <span className="font-data-mono text-[12px] text-outline">Direct mental math lookup</span>
              </div>

              <div className="bg-surface-container-lowest rounded-xl shadow-md overflow-x-auto border border-outline-variant/20">
                <table className="w-full text-left font-body-sm text-body-sm">
                  <thead className="bg-surface-container font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                    <tr>
                      <th className="py-space-sm px-space-md">Percentage</th>
                      <th className="py-space-sm px-space-md">Decimal Factor</th>
                      <th className="py-space-sm px-space-md">Simplified Fraction</th>
                      <th className="py-space-sm px-space-md">Mental Math Shortcut</th>
                      <th className="py-space-sm px-space-md">Standard Real-World Use</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container-high font-data-mono text-[13px] text-on-surface">
                    <tr className="hover:bg-surface-container-low transition-colors">
                      <td className="py-3 px-space-md font-bold text-primary">1%</td>
                      <td className="py-3 px-space-md">0.01</td>
                      <td className="py-3 px-space-md font-sans">1 / 100</td>
                      <td className="py-3 px-space-md font-sans text-on-surface-variant">Shift radix 2 places left</td>
                      <td className="py-3 px-space-md font-sans text-on-surface-variant">Basis point conversion (100 bps)</td>
                    </tr>
                    <tr className="hover:bg-surface-container-low transition-colors">
                      <td className="py-3 px-space-md font-bold text-primary">5%</td>
                      <td className="py-3 px-space-md">0.05</td>
                      <td className="py-3 px-space-md font-sans">1 / 20</td>
                      <td className="py-3 px-space-md font-sans text-on-surface-variant">Find 10% and divide by 2</td>
                      <td className="py-3 px-space-md font-sans text-on-surface-variant">Municipal retail sales taxes</td>
                    </tr>
                    <tr className="hover:bg-surface-container-low transition-colors">
                      <td className="py-3 px-space-md font-bold text-primary">10%</td>
                      <td className="py-3 px-space-md">0.10</td>
                      <td className="py-3 px-space-md font-sans">1 / 10</td>
                      <td className="py-3 px-space-md font-sans text-on-surface-variant">Shift radix 1 place left</td>
                      <td className="py-3 px-space-md font-sans text-on-surface-variant">Tithes, fast tipping calculations</td>
                    </tr>
                    <tr className="hover:bg-surface-container-low transition-colors">
                      <td className="py-3 px-space-md font-bold text-primary">12.5%</td>
                      <td className="py-3 px-space-md">0.125</td>
                      <td className="py-3 px-space-md font-sans">1 / 8</td>
                      <td className="py-3 px-space-md font-sans text-on-surface-variant">Divide by 2 three times (1/8th)</td>
                      <td className="py-3 px-space-md font-sans text-on-surface-variant">UK VAT (historic) / Stock eighths</td>
                    </tr>
                    <tr className="hover:bg-surface-container-low transition-colors">
                      <td className="py-3 px-space-md font-bold text-primary">15%</td>
                      <td className="py-3 px-space-md">0.15</td>
                      <td className="py-3 px-space-md font-sans">3 / 20</td>
                      <td className="py-3 px-space-md font-sans text-on-surface-variant">10% + half of that 10%</td>
                      <td className="py-3 px-space-md font-sans text-on-surface-variant">Standard restaurant tip, GST rates</td>
                    </tr>
                    <tr className="hover:bg-surface-container-low transition-colors">
                      <td className="py-3 px-space-md font-bold text-primary">20%</td>
                      <td className="py-3 px-space-md">0.20</td>
                      <td className="py-3 px-space-md font-sans">1 / 5</td>
                      <td className="py-3 px-space-md font-sans text-on-surface-variant">Divide whole by 5</td>
                      <td className="py-3 px-space-md font-sans text-on-surface-variant">UK standard VAT, premium tipping</td>
                    </tr>
                    <tr className="hover:bg-surface-container-low transition-colors">
                      <td className="py-3 px-space-md font-bold text-primary">25%</td>
                      <td className="py-3 px-space-md">0.25</td>
                      <td className="py-3 px-space-md font-sans">1 / 4</td>
                      <td className="py-3 px-space-md font-sans text-on-surface-variant">Divide whole by 4</td>
                      <td className="py-3 px-space-md font-sans text-on-surface-variant">Quarterly clearance discount, corporate tax</td>
                    </tr>
                    <tr className="hover:bg-surface-container-low transition-colors">
                      <td className="py-3 px-space-md font-bold text-primary">33.33%</td>
                      <td className="py-3 px-space-md">0.3333̄</td>
                      <td className="py-3 px-space-md font-sans">1 / 3</td>
                      <td className="py-3 px-space-md font-sans text-on-surface-variant">Divide whole by 3</td>
                      <td className="py-3 px-space-md font-sans text-on-surface-variant">Buy 2 Get 1 Free equivalence</td>
                    </tr>
                    <tr className="hover:bg-surface-container-low transition-colors">
                      <td className="py-3 px-space-md font-bold text-primary">50%</td>
                      <td className="py-3 px-space-md">0.50</td>
                      <td className="py-3 px-space-md font-sans">1 / 2</td>
                      <td className="py-3 px-space-md font-sans text-on-surface-variant">Divide whole by 2</td>
                      <td className="py-3 px-space-md font-sans text-on-surface-variant">Half price flash sales, bisection</td>
                    </tr>
                    <tr className="hover:bg-surface-container-low transition-colors">
                      <td className="py-3 px-space-md font-bold text-primary">66.67%</td>
                      <td className="py-3 px-space-md">0.6667̄</td>
                      <td className="py-3 px-space-md font-sans">2 / 3</td>
                      <td className="py-3 px-space-md font-sans text-on-surface-variant">Multiply by 2 and divide by 3</td>
                      <td className="py-3 px-space-md font-sans text-on-surface-variant">Supermajority voting in constitutional law</td>
                    </tr>
                    <tr className="hover:bg-surface-container-low transition-colors">
                      <td className="py-3 px-space-md font-bold text-primary">75%</td>
                      <td className="py-3 px-space-md">0.75</td>
                      <td className="py-3 px-space-md font-sans">3 / 4</td>
                      <td className="py-3 px-space-md font-sans text-on-surface-variant">Subtract 25% from totality</td>
                      <td className="py-3 px-space-md font-sans text-on-surface-variant">Heavy inventory liquidation</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* INDUSTRY APPLICATIONS & REAL-WORLD USE CASES */}
          <section className="w-full py-space-3xl bg-surface">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop space-y-space-xl">
              <div className="max-w-2xl space-y-space-xs">
                <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-bold">Applied Mathematical Systems</span>
                <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">Real-World Case Studies</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">How accurate percentage arithmetic governs mission-critical professional decisions.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
                {/* Case 1 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-xs space-y-space-sm border border-outline-variant/20">
                  <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[24px]">payments</span>
                  </div>
                  <h3 className="font-headline-md text-[18px] font-bold text-on-surface">Corporate Salary &amp; Inflation Hedging</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    If annual inflation rises by 6.5% while an executive receives a 4.0% nominal salary raise, the net purchasing power has actually fallen by <strong>-2.35%</strong> (1.04 / 1.065 - 1), demonstrating why direct arithmetic subtraction is fundamentally invalid.
                  </p>
                </div>

                {/* Case 2 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-xs space-y-space-sm border border-outline-variant/20">
                  <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[24px]">insights</span>
                  </div>
                  <h3 className="font-headline-md text-[18px] font-bold text-on-surface">Digital Marketing &amp; CRO Optimization</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Increasing website checkout conversion from 2.0% to 3.0% is not merely a &quot;1% bump.&quot; It is a massive <strong>+50.0% relative increase</strong> in organic customer acquisition and bottom-line gross sales from identical traffic volumes.
                  </p>
                </div>

                {/* Case 3 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-xs space-y-space-sm border border-outline-variant/20">
                  <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[24px]">biotech</span>
                  </div>
                  <h3 className="font-headline-md text-[18px] font-bold text-on-surface">Scientific Experimental Error Limits</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Laboratory calibration relies on percent relative error: (|Theoretical - Observed| / Theoretical) × 100. In pharmaceutical batching, deviations beyond 0.05% automatically trigger quarantine under FDA CFR Title 21 protocols.
                  </p>
                </div>

                {/* Case 4 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-xs space-y-space-sm border border-outline-variant/20">
                  <div className="w-10 h-10 rounded-lg bg-secondary-fixed flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-[24px]">storefront</span>
                  </div>
                  <h3 className="font-headline-md text-[18px] font-bold text-on-surface">Black Friday Double Discount Traps</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Retailers marketing &quot;40% off + extra 20% off at register&quot; do not yield a 60% discount. A $100 jacket discounted by 40% drops to $60. The subsequent 20% discount on $60 saves $12, resulting in a final price of $48 (a <strong>52% effective discount</strong>).
                  </p>
                </div>

                {/* Case 5 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-xs space-y-space-sm border border-outline-variant/20">
                  <div className="w-10 h-10 rounded-lg bg-secondary-fixed flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-[24px]">domain</span>
                  </div>
                  <h3 className="font-headline-md text-[18px] font-bold text-on-surface">Real Estate Cap Rate &amp; Yields</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    A property yielding $60,000 Net Operating Income acquired for $1,200,000 operates at a 5.0% capitalization rate. If interest rates expand by 150 basis points (1.5%), the asset value must contract by ~23% to preserve investor debt coverage.
                  </p>
                </div>

                {/* Case 6 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-xs space-y-space-sm border border-outline-variant/20">
                  <div className="w-10 h-10 rounded-lg bg-secondary-fixed flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-[24px]">query_stats</span>
                  </div>
                  <h3 className="font-headline-md text-[18px] font-bold text-on-surface">Financial Portfolio Volatility Recovery</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    A portfolio losing 50% in a market crash does not need a 50% gain to recover. It requires an exact <strong>+100% gain</strong> just to break even back to its original capital base. A 90% loss mandates a 900% recovery rally.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CRITICAL PITFALLS TO AVOID (High-Cognition Warning Grid) */}
          <section className="w-full py-space-3xl bg-surface-container-low border-y border-surface-container">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop space-y-space-xl">
              <div className="max-w-2xl space-y-space-xs">
                <span className="font-label-caps text-label-caps uppercase tracking-wider text-error font-bold">Heuristic Danger Zones</span>
                <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">Critical Pitfalls in Percentage Logic</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">Mathematical errors frequently made in spreadsheets, financial audits, and public discourse.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                {/* Pitfall 1 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-md border-l-4 border-error space-y-space-2xs">
                  <div className="flex items-center justify-between">
                    <span className="font-data-mono text-[13px] font-bold text-error">ASYMMETRY PARADOX</span>
                    <span className="material-symbols-outlined text-error text-[18px]">warning</span>
                  </div>
                  <h3 className="font-headline-md text-[18px] font-bold text-on-surface">+50% Followed by -50% ≠ Parity</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    If $100 increases by 50%, it becomes $150. If $150 then decreases by 50%, it drops to $75. You have suffered an irreversible <strong>25% net capital destruction</strong> despite identical percentage magnitudes.
                  </p>
                </div>

                {/* Pitfall 2 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-md border-l-4 border-error space-y-space-2xs">
                  <div className="flex items-center justify-between">
                    <span className="font-data-mono text-[13px] font-bold text-error">TERMINOLOGY CONFUSION</span>
                    <span className="material-symbols-outlined text-error text-[18px]">warning</span>
                  </div>
                  <h3 className="font-headline-md text-[18px] font-bold text-on-surface">Percent (%) vs Percentage Points (pp)</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    If interest rates move from 4.0% to 5.0%, rates increased by <strong>1.0 percentage point</strong>, but the cost of borrowing expanded by <strong>25.0% relative</strong>. Conflating these two in financial reporting leads to grave distortions.
                  </p>
                </div>

                {/* Pitfall 3 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-md border-l-4 border-error space-y-space-2xs">
                  <div className="flex items-center justify-between">
                    <span className="font-data-mono text-[13px] font-bold text-error">BASE ERROR</span>
                    <span className="material-symbols-outlined text-error text-[18px]">warning</span>
                  </div>
                  <h3 className="font-headline-md text-[18px] font-bold text-on-surface">Subtracting Tax Directly from Final Price</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    If an item costs $120 including 20% VAT, deducting 20% from $120 yields $96 (erroneous). The correct pre-tax price is $120 / 1.20 = <strong>$100.00</strong>. Tax was added to the base, not the gross invoice.
                  </p>
                </div>

                {/* Pitfall 4 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-md border-l-4 border-error space-y-space-2xs">
                  <div className="flex items-center justify-between">
                    <span className="font-data-mono text-[13px] font-bold text-error">PROFIT TRAP</span>
                    <span className="material-symbols-outlined text-error text-[18px]">warning</span>
                  </div>
                  <h3 className="font-headline-md text-[18px] font-bold text-on-surface">Setting 50% Markup Expecting 50% Margin</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Buying an asset for $100 and marking it up 50% sets the price at $150. The profit of $50 on a $150 sale is a <strong>33.3% margin</strong>. A true 50% margin requires selling the $100 item for $200 (a 100% markup).
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* KNOWLEDGE BASE & FAQ ACCORDION */}
          <section className="w-full py-space-3xl bg-surface">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop space-y-space-xl">
              <div className="max-w-2xl space-y-space-xs">
                <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-bold">Frequently Answered Queries</span>
                <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">Mathematical Intelligence Q&amp;A</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">Deep-dive technical answers compiled by our computational mathematics group.</p>
              </div>

              <div className="max-w-3xl space-y-space-sm" id="faqAccordion">
                {/* Q1 */}
                <div className="bg-surface-container-lowest rounded-xl shadow-xs overflow-hidden border border-outline-variant/20">
                  <button
                    className="w-full py-space-md px-space-lg flex items-center justify-between text-left font-headline-md text-[17px] font-semibold text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer"
                    onClick={() => toggleFaq(1)}
                    type="button"
                  >
                    <span>How do I calculate percentages by hand without a digital calculator?</span>
                    <span
                      className="material-symbols-outlined text-outline transition-transform duration-200"
                      id="faqIcon-1"
                      style={{ transform: openFaqs[1] ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    >
                      expand_more
                    </span>
                  </button>
                  {openFaqs[1] && (
                    <div className="px-space-lg pb-space-md text-body-sm font-body-sm text-on-surface-variant space-y-space-2xs" id="faqAns-1">
                      <p>To compute percentages manually, convert the target percentage into either a decimal fraction (by shifting the radix point two places left) or a simplified fraction, and then multiply by the base number.</p>
                      <p className="font-data-mono bg-surface-container-low p-2 rounded text-on-surface">
                        Example: 35% of 80 = (0.35) × 80 = (3/10 × 80) + (5/100 × 80) = 24 + 4 = 28.
                      </p>
                    </div>
                  )}
                </div>

                {/* Q2 */}
                <div className="bg-surface-container-lowest rounded-xl shadow-xs overflow-hidden border border-outline-variant/20">
                  <button
                    className="w-full py-space-md px-space-lg flex items-center justify-between text-left font-headline-md text-[17px] font-semibold text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer"
                    onClick={() => toggleFaq(2)}
                    type="button"
                  >
                    <span>What is the mathematical difference between Percent Change and Percentage Difference?</span>
                    <span
                      className="material-symbols-outlined text-outline transition-transform duration-200"
                      id="faqIcon-2"
                      style={{ transform: openFaqs[2] ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    >
                      expand_more
                    </span>
                  </button>
                  {openFaqs[2] && (
                    <div className="px-space-lg pb-space-md text-body-sm font-body-sm text-on-surface-variant space-y-space-2xs" id="faqAns-2">
                      <p><strong>Percent Change</strong> has temporal directionality: it measures change from a defined chronologically earlier &quot;Old&quot; baseline to a &quot;New&quot; final state, with the denominator strictly being the Old value: ((New - Old) / Old) × 100.</p>
                      <p><strong>Percentage Difference</strong> is symmetric and directionless. It compares two quantities of equal chronological standing by dividing their absolute deviation by their arithmetic mean: (|A - B| / ((A + B) / 2)) × 100.</p>
                    </div>
                  )}
                </div>

                {/* Q3 */}
                <div className="bg-surface-container-lowest rounded-xl shadow-xs overflow-hidden border border-outline-variant/20">
                  <button
                    className="w-full py-space-md px-space-lg flex items-center justify-between text-left font-headline-md text-[17px] font-semibold text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer"
                    onClick={() => toggleFaq(3)}
                    type="button"
                  >
                    <span>How do I back-calculate an original pre-tax value from an inclusive receipt?</span>
                    <span
                      className="material-symbols-outlined text-outline transition-transform duration-200"
                      id="faqIcon-3"
                      style={{ transform: openFaqs[3] ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    >
                      expand_more
                    </span>
                  </button>
                  {openFaqs[3] && (
                    <div className="px-space-lg pb-space-md text-body-sm font-body-sm text-on-surface-variant space-y-space-2xs" id="faqAns-3">
                      <p>Do not multiply the final receipt by the tax rate. Instead, divide the final invoice total by (1 + Tax Rate in decimals).</p>
                      <p className="font-data-mono bg-surface-container-low p-2 rounded text-on-surface">
                        If an invoice is $460.00 with 15% GST included: Base Price = 460 / (1 + 0.15) = 460 / 1.15 = $400.00. The tax collected is $60.00.
                      </p>
                    </div>
                  )}
                </div>

                {/* Q4 */}
                <div className="bg-surface-container-lowest rounded-xl shadow-xs overflow-hidden border border-outline-variant/20">
                  <button
                    className="w-full py-space-md px-space-lg flex items-center justify-between text-left font-headline-md text-[17px] font-semibold text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer"
                    onClick={() => toggleFaq(4)}
                    type="button"
                  >
                    <span>What is the Golden Rule for converting Markup to Margin?</span>
                    <span
                      className="material-symbols-outlined text-outline transition-transform duration-200"
                      id="faqIcon-4"
                      style={{ transform: openFaqs[4] ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    >
                      expand_more
                    </span>
                  </button>
                  {openFaqs[4] && (
                    <div className="px-space-lg pb-space-md text-body-sm font-body-sm text-on-surface-variant space-y-space-2xs" id="faqAns-4">
                      <p>Use the algebraic transposition formulas:</p>
                      <ul className="list-disc pl-5 font-data-mono text-[12px] space-y-1 text-on-surface">
                        <li>Margin = Markup / (1 + Markup)</li>
                        <li>Markup = Margin / (1 - Margin)</li>
                      </ul>
                      <p>A 100% markup (doubling cost) equals a 50% margin. A 25% markup equals a 20% margin.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* INTERLINKED ENGINE WEB & STRUCTURED DATA */}
          <section className="w-full py-space-2xl bg-surface-container-lowest border-t border-surface-container">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop space-y-space-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
                <div>
                  <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-bold">Complete Math Topology</span>
                  <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Interlinked Mathematical Tools</h3>
                </div>
                <span className="font-data-mono text-[11px] text-outline">SolveIt Calculator Precision Engine V4.8</span>
              </div>

              <div className="flex flex-wrap gap-space-xs">
                <Link
                  className="px-space-sm py-2 rounded-lg bg-surface-container-low hover:bg-primary-fixed hover:text-on-primary-fixed text-on-surface font-body-sm text-body-sm transition-colors flex items-center gap-1.5 shadow-xs"
                  href="/percentage-calculator#workbench"
                >
                  <span className="material-symbols-outlined text-[16px] text-primary">percent</span> Discount Calculator
                </Link>
                <Link
                  className="px-space-sm py-2 rounded-lg bg-surface-container-low hover:bg-primary-fixed hover:text-on-primary-fixed text-on-surface font-body-sm text-body-sm transition-colors flex items-center gap-1.5 shadow-xs"
                  href="/percentage-calculator#workbench"
                >
                  <span className="material-symbols-outlined text-[16px] text-primary">price_check</span> GST &amp; VAT Calculator
                </Link>
                <Link
                  className="px-space-sm py-2 rounded-lg bg-surface-container-low hover:bg-primary-fixed hover:text-on-primary-fixed text-on-surface font-body-sm text-body-sm transition-colors flex items-center gap-1.5 shadow-xs"
                  href="/percentage-calculator#workbench"
                >
                  <span className="material-symbols-outlined text-[16px] text-primary">query_stats</span> Profit Margin Workbench
                </Link>
                <Link
                  className="px-space-sm py-2 rounded-lg bg-surface-container-low hover:bg-primary-fixed hover:text-on-primary-fixed text-on-surface font-body-sm text-body-sm transition-colors flex items-center gap-1.5 shadow-xs"
                  href="/percentage-calculator#workbench"
                >
                  <span className="material-symbols-outlined text-[16px] text-primary">grade</span> Exam Grade Calculator
                </Link>
                <Link
                  className="px-space-sm py-2 rounded-lg bg-surface-container-low hover:bg-primary-fixed hover:text-on-primary-fixed text-on-surface font-body-sm text-body-sm transition-colors flex items-center gap-1.5 shadow-xs"
                  href="/finance/investment-calculator"
                >
                  <span className="material-symbols-outlined text-[16px] text-primary">show_chart</span> Compound Interest Engine
                </Link>
                <Link
                  className="px-space-sm py-2 rounded-lg bg-surface-container-low hover:bg-primary-fixed hover:text-on-primary-fixed text-on-surface font-body-sm text-body-sm transition-colors flex items-center gap-1.5 shadow-xs"
                  href="/math"
                >
                  <span className="material-symbols-outlined text-[16px] text-primary">calculate</span> Scientific Multi-Base
                </Link>
                <Link
                  className="px-space-sm py-2 rounded-lg bg-surface-container-low hover:bg-primary-fixed hover:text-on-primary-fixed text-on-surface font-body-sm text-body-sm transition-colors flex items-center gap-1.5 shadow-xs"
                  href="/math"
                >
                  <span className="material-symbols-outlined text-[16px] text-primary">compare_arrows</span> Ratio &amp; Proportion Studio
                </Link>
              </div>

              {/* JSON-LD Entity Metadata Card */}
              <div className="p-space-md rounded-xl bg-surface-container-low text-on-surface-variant font-data-mono text-[11px] space-y-1 border border-surface-container">
                <div className="flex items-center justify-between text-outline">
                  <span>STRUCTURAL SCHEMA VALIDATION (IEEE 754 Engine)</span>
                  <span className="text-primary font-bold">100% LOCAL CLIENT RUNTIME</span>
                </div>
                <p className="leading-relaxed">
                  &lt;script type=&quot;application/ld+json&quot;&gt; &#123; &quot;@context&quot;: &quot;https://schema.org&quot;, &quot;@type&quot;: &quot;WebApplication&quot;, &quot;name&quot;: &quot;SolveIt Calculator Universal Percentage Calculator&quot;, &quot;operatingSystem&quot;: &quot;All&quot;, &quot;applicationCategory&quot;: &quot;EducationalApplication&quot; &#125; &lt;/script&gt;
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
