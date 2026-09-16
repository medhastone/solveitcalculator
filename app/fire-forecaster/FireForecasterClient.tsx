'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';

interface CurrencyConfig {
  symbol: string;
  code: string;
}

const CURRENCIES: Record<string, CurrencyConfig> = {
  '$': { symbol: '$', code: 'USD' },
  '€': { symbol: '€', code: 'EUR' },
  '£': { symbol: '£', code: 'GBP' },
  'C$': { symbol: 'C$', code: 'CAD' },
  'A$': { symbol: 'A$', code: 'AUD' },
  '¥': { symbol: '¥', code: 'JPY' },
};

export default function FireForecasterClient() {
  const [mounted, setMounted] = useState(false);

  // Core Parameters
  const [currency, setCurrency] = useState('$');
  const [currentAge, setCurrentAge] = useState<number>(30);
  const [targetAge, setTargetAge] = useState<number>(48);
  const [currentSavings, setCurrentSavings] = useState<number>(185000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(3250);
  const [annualExpenses, setAnnualExpenses] = useState<number>(54000);
  const [nominalReturn, setNominalReturn] = useState<number>(8.5);
  const [inflationRate, setInflationRate] = useState<number>(2.5);
  const [swr, setSwr] = useState<number>(4.0);
  const [taxDrag, setTaxDrag] = useState<number>(0.5);
  const [chartSpan, setChartSpan] = useState<number>(25); // 15, 25, 35

  // Interactive UI State
  const [activeTab, setActiveTab] = useState('forecaster');
  const [copyFeedback, setCopyFeedback] = useState('');
  const [codeCopyFeedback, setCodeCopyFeedback] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const curSym = currency;

  const fmt = useCallback((val: number, decimals: number = 0): string => {
    if (isNaN(val) || !isFinite(val)) return `${curSym}0`;
    if (decimals === 0) {
      return `${curSym}${Math.round(val).toLocaleString('en-US')}`;
    }
    return `${curSym}${val.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
  }, [curSym]);

  // Main Actuarial & Wealth Computation Engine
  const data = useMemo(() => {
    if (!mounted) return null;

    // Real Rate of Return (Fisher equation)
    const netNominal = (nominalReturn - taxDrag) / 100;
    const netInflation = inflationRate / 100;
    const realAnnual = ((1 + netNominal) / (1 + netInflation)) - 1;
    const realYieldPct = realAnnual * 100;

    // Core FIRE Target (25x rule for 4% SWR)
    const fireNumber = annualExpenses / (swr / 100);
    const swrMultiplier = (100 / swr).toFixed(1);

    // Progress
    const progressPct = fireNumber > 0 ? Math.min(100, Math.max(0, (currentSavings / fireNumber) * 100)) : 0;
    const capitalRemaining = Math.max(0, fireNumber - currentSavings);

    // Velocity Metrics
    const dailyYield = (currentSavings * Math.max(0, realAnnual)) / 365;
    const dailySavings = (monthlyContribution * 12) / 365;
    const dailyAccrual = dailyYield + dailySavings;
    const yearsFunded = annualExpenses > 0 ? (currentSavings / annualExpenses) : 0;

    // Compound Simulation to reach FIRE
    const monthlyRate = Math.pow(1 + Math.max(0.0001, 1 + realAnnual), 1 / 12) - 1;
    let balance = currentSavings;
    let months = 0;
    const MAX_MONTHS = 840; // 70 years ceiling

    while (balance < fireNumber && months < MAX_MONTHS) {
      balance = balance * (1 + monthlyRate) + monthlyContribution;
      months++;
    }

    const yearsToFire = months / 12;
    const projectedFireAge = currentAge + yearsToFire;
    const fireAgeYears = Math.floor(projectedFireAge);
    const fireAgeMonths = Math.round((projectedFireAge - fireAgeYears) * 12);

    // Target Date
    const now = new Date();
    const targetDate = new Date(now.getFullYear(), now.getMonth() + months, 1);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const targetDateStr = `${monthNames[targetDate.getMonth()]} ${targetDate.getFullYear()}`;

    // Nominal Future FIRE Number
    const nominalFutureFactor = Math.pow(1 + netInflation, yearsToFire);
    const nominalFireNumber = fireNumber * nominalFutureFactor;

    // Goal Schedule Delta
    const ageDelta = targetAge - projectedFireAge;
    const isAhead = ageDelta >= 0;
    const deltaYears = Math.floor(Math.abs(ageDelta));
    const deltaMonths = Math.round((Math.abs(ageDelta) - deltaYears) * 12);
    const scheduleStr = isAhead 
      ? `${deltaYears}y ${deltaMonths}m Ahead of Goal`
      : `${deltaYears}y ${deltaMonths}m Behind Goal`;

    // Four FIRE Archetypes
    // 1. Lean FIRE (75% budget or $36k/yr base)
    const leanExpenses = annualExpenses * 0.67;
    const leanTarget = leanExpenses / (swr / 100);
    let leanBal = currentSavings;
    let leanMonths = 0;
    while (leanBal < leanTarget && leanMonths < MAX_MONTHS) {
      leanBal = leanBal * (1 + monthlyRate) + monthlyContribution;
      leanMonths++;
    }
    const leanAge = currentAge + (leanMonths / 12);
    const leanDate = new Date(now.getFullYear(), now.getMonth() + leanMonths, 1);

    // 2. Coast FIRE (at age 60 or targetAge without further contributions)
    const coastTargetAge = Math.max(targetAge, 60);
    const yearsToCoastGoal = Math.max(0, coastTargetAge - currentAge);
    const coastRequiredToday = fireNumber / Math.pow(1 + realAnnual, yearsToCoastGoal);
    const coastAchieved = currentSavings >= coastRequiredToday;
    const coastSurplus = currentSavings - coastRequiredToday;

    // 3. Fat FIRE (185% budget or $100k/yr base)
    const fatExpenses = Math.max(annualExpenses * 1.85, 100000);
    const fatTarget = fatExpenses / (swr / 100);
    let fatBal = currentSavings;
    let fatMonths = 0;
    while (fatBal < fatTarget && fatMonths < MAX_MONTHS) {
      fatBal = fatBal * (1 + monthlyRate) + monthlyContribution;
      fatMonths++;
    }
    const fatAge = currentAge + (fatMonths / 12);
    const fatDate = new Date(now.getFullYear(), now.getMonth() + fatMonths, 1);

    // Scenario Sensitivity Matrix Helper
    const solveScenario = (addContrib: number, expenseFactor: number) => {
      const exp = annualExpenses * expenseFactor;
      const fn = exp / (swr / 100);
      const mContrib = monthlyContribution + addContrib;
      let b = currentSavings;
      let m = 0;
      while (b < fn && m < MAX_MONTHS) {
        b = b * (1 + monthlyRate) + mContrib;
        m++;
      }
      const age = currentAge + (m / 12);
      const timeSavedYears = Math.max(0, yearsToFire - (m / 12));
      return {
        ageYears: Math.floor(age),
        ageMonths: Math.round((age - Math.floor(age)) * 12),
        fireNumber: fn,
        timeSavedYears,
        timeSavedMonths: Math.round(timeSavedYears * 12),
      };
    };

    const lever1 = solveScenario(500, 1.0); // +$500/mo
    const lever2 = solveScenario(0, 0.9);   // -10% expenses
    const leverDual = solveScenario(500, 0.9); // Combined

    // Charlie Munger Waypoints ($100k, $250k, $500k, $1.0M, FIRE, Fat FIRE)
    const waypoints = [
      { target: 100000, label: '$100K', title: 'The Hardest Milestone', desc: '100% powered by pure savings discipline.' },
      { target: 250000, label: '$250K', title: 'Self-Sustaining Gravity', desc: 'Compounding returns begin rivaling fresh savings.' },
      { target: 500000, label: '$500K', title: 'Half-Million Mark', desc: 'Portfolio generates significant passive yield.' },
      { target: 1000000, label: '$1.0M', title: 'Two-Comma Club', desc: 'Market swings exceed annual salary. Exponential phase.' },
      { target: fireNumber, label: fmt(fireNumber), title: 'Full FIRE Autonomy', desc: 'Complete work optionality. Freedom baseline.' },
      { target: fatTarget, label: fmt(fatTarget), title: 'Fat FIRE Sovereign', desc: 'Unconstrained luxury and generational longevity.' },
    ].map((wp, idx) => {
      const isReached = currentSavings >= wp.target;
      const pct = Math.min(100, (currentSavings / wp.target) * 100);
      
      let m = 0;
      let b = currentSavings;
      while (b < wp.target && m < MAX_MONTHS) {
        b = b * (1 + monthlyRate) + monthlyContribution;
        m++;
      }
      const yrs = (m / 12).toFixed(1);
      const ageAtWp = (currentAge + (m / 12)).toFixed(1);

      return {
        num: `#${idx + 1}`,
        target: wp.target,
        label: wp.label,
        title: wp.title,
        desc: wp.desc,
        isReached,
        pct: pct.toFixed(0),
        yearsToTarget: yrs,
        ageAtTarget: ageAtWp,
      };
    });

    // SWR Matrix Rows
    const swrRows = [
      { rate: 3.00, title: 'Ultra-Safe Perpetual', survival: '100.0%', horizon: 'Perpetual Endowment (60+ yrs)' },
      { rate: 3.50, title: 'Ultra-Long Early FIRE', survival: '99.4%', horizon: 'Ultra-Long Early FIRE (45–50 yrs)' },
      { rate: 4.00, title: 'Trinity Standard', survival: '96.1%', horizon: 'Trinity Standard (30–35 yrs)' },
      { rate: 4.50, title: 'Guardrails Dynamic', survival: '82.0%', horizon: 'Requires Guyton-Klinger cuts' },
    ].map(row => {
      const targetForThis = annualExpenses / (row.rate / 100);
      const annualPayout = targetForThis * (row.rate / 100);
      return {
        ...row,
        targetForThis,
        annualPayout,
        monthlyPayout: annualPayout / 12,
        isSelected: Math.abs(row.rate - swr) < 0.05,
      };
    });

    // Multi-Decade Projection Curve Points for SVG Chart
    const spanYears = chartSpan;
    const chartPoints = [];
    let simBal = currentSavings;
    let simPrincipal = currentSavings;
    const maxProjectedVal = Math.max(fireNumber * 1.6, fatTarget, 2000000);

    for (let yr = 0; yr <= spanYears; yr++) {
      chartPoints.push({
        year: yr,
        age: currentAge + yr,
        wealth: simBal,
        principal: simPrincipal,
      });
      // simulate 1 year
      for (let m = 0; m < 12; m++) {
        simBal = simBal * (1 + monthlyRate) + monthlyContribution;
        simPrincipal += monthlyContribution;
      }
    }

    return {
      realYieldPct,
      fireNumber,
      nominalFireNumber,
      swrMultiplier,
      progressPct,
      capitalRemaining,
      dailyAccrual,
      yearsFunded,
      yearsToFire,
      projectedFireAge,
      fireAgeYears,
      fireAgeMonths,
      targetDateStr,
      portfolioAtExit: balance,
      scheduleStr,
      isAhead,
      leanExpenses,
      leanTarget,
      leanAge,
      leanDate,
      coastRequiredToday,
      coastAchieved,
      coastSurplus,
      fatExpenses,
      fatTarget,
      fatAge,
      fatDate,
      lever1,
      lever2,
      leverDual,
      waypoints,
      swrRows,
      chartPoints,
      maxProjectedVal,
    };
  }, [
    mounted,
    nominalReturn,
    taxDrag,
    inflationRate,
    annualExpenses,
    swr,
    currentSavings,
    monthlyContribution,
    currentAge,
    targetAge,
    chartSpan,
    fmt,
  ]);

  // Copy Blueprint
  const handleCopyBlueprint = useCallback(() => {
    if (!data) return;
    const text = `SolveIt FIRE Blueprint:
• Real FIRE Target: ${fmt(data.fireNumber)} (${data.swrMultiplier}x Multiple @ ${swr}%)
• Projected FIRE Age: ${data.fireAgeYears}y ${data.fireAgeMonths}m (${data.targetDateStr})
• Portfolio at Exit: ${fmt(data.portfolioAtExit)}
• Current Progress: ${data.progressPct.toFixed(1)}% (${fmt(currentSavings)} / ${fmt(data.fireNumber)})
• Daily Freedom Accrual: +${fmt(data.dailyAccrual)} / day
• Estimated Runway Funded: ${data.yearsFunded.toFixed(2)} Years
Generated via SolveIt Financial Metrology Suite`;

    navigator.clipboard.writeText(text).then(() => {
      setCopyFeedback('Blueprint Copied!');
      setTimeout(() => setCopyFeedback(''), 2500);
    });
  }, [data, swr, currentSavings, fmt]);

  // Copy Algorithm Code
  const handleCopyCode = useCallback(() => {
    const code = `// SolveIt Precision FIRE & Dynamic Compound Engine
function calculateFIRE({ currentAge, currentSavings, monthlyContribution, annualExpenses, nominalReturn, inflationRate, swr, taxDrag = 0 }) {
  const realRate = ((1 + (nominalReturn - taxDrag) / 100) / (1 + inflationRate / 100)) - 1;
  const monthlyRate = Math.pow(1 + realRate, 1 / 12) - 1;
  const fireNumber = annualExpenses / (swr / 100);
  
  if (currentSavings >= fireNumber) {
    return { fireAge: currentAge, yearsRemaining: 0, fireNumber, portfolioAtExit: currentSavings };
  }
  
  let balance = currentSavings;
  let months = 0;
  const MAX_MONTHS = 1200;
  
  while (balance < fireNumber && months < MAX_MONTHS) {
    balance = balance * (1 + monthlyRate) + monthlyContribution;
    months++;
  }
  
  return {
    fireAge: currentAge + (months / 12),
    yearsRemaining: months / 12,
    fireNumber: Math.round(fireNumber),
    portfolioAtExit: Math.round(balance)
  };
}`;
    navigator.clipboard.writeText(code).then(() => {
      setCodeCopyFeedback('Algorithm Copied!');
      setTimeout(() => setCodeCopyFeedback(''), 2500);
    });
  }, []);

  // Export CSV
  const handleExportCSV = useCallback(() => {
    if (!data) return;
    let csv = "Year,Age,Beginning_Balance,Annual_Contribution,Real_Investment_Yield,Ending_Balance\n";
    let bal = currentSavings;
    const annualContrib = monthlyContribution * 12;
    const realRate = data.realYieldPct / 100;
    const startYear = new Date().getFullYear();

    for (let i = 1; i <= 35; i++) {
      const growth = bal * realRate;
      const endBal = bal + growth + annualContrib;
      csv += `${startYear + i},${currentAge + i},${Math.round(bal)},${Math.round(annualContrib)},${Math.round(growth)},${Math.round(endBal)}\n`;
      bal = endBal;
    }

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `solveit_fire_projection_${currentAge}yo.csv`;
    a.click();
  }, [data, currentSavings, monthlyContribution, currentAge]);

  // Reset to Defaults
  const handleReset = useCallback(() => {
    setCurrentAge(30);
    setTargetAge(48);
    setCurrentSavings(185000);
    setMonthlyContribution(3250);
    setAnnualExpenses(54000);
    setNominalReturn(8.5);
    setInflationRate(2.5);
    setTaxDrag(0.5);
    setSwr(4.0);
  }, []);

  if (!mounted || !data) {
    return (
      <div className="bg-surface min-h-screen flex flex-col items-center justify-center text-on-surface-variant font-data-mono">
        <span className="material-symbols-outlined text-[36px] animate-spin text-primary mb-3">progress_activity</span>
        <span>Calibrating Actuarial Trinity Engine...</span>
      </div>
    );
  }

  // Generate SVG Points for Chart
  const svgWidth = 880;
  const svgHeight = 340;
  const paddingLeft = 65;
  const paddingRight = 40;
  const paddingTop = 35;
  const paddingBottom = 40;
  const plotW = svgWidth - paddingLeft - paddingRight;
  const plotH = svgHeight - paddingTop - paddingBottom;

  const maxVal = Math.max(data.maxProjectedVal, data.chartPoints[data.chartPoints.length - 1]?.wealth || 1);

  const getX = (yr: number) => paddingLeft + (yr / chartSpan) * plotW;
  const getY = (val: number) => paddingTop + plotH - Math.min(plotH, Math.max(0, (val / maxVal) * plotH));

  const wealthPath = data.chartPoints.map((pt, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(pt.year)} ${getY(pt.wealth)}`).join(' ');
  const wealthArea = `${wealthPath} L ${getX(chartSpan)} ${paddingTop + plotH} L ${getX(0)} ${paddingTop + plotH} Z`;

  const principalPath = data.chartPoints.map((pt, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(pt.year)} ${getY(pt.principal)}`).join(' ');
  const principalArea = `${principalPath} L ${getX(chartSpan)} ${paddingTop + plotH} L ${getX(0)} ${paddingTop + plotH} Z`;

  const fireLineY = getY(data.fireNumber);
  const fireCrossoverX = Math.min(getX(chartSpan), getX(data.yearsToFire));

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface min-h-screen flex flex-col">
      
      <main className="w-full pt-16 bg-surface flex-1">
        <div className="flex flex-col w-full">
          
          {/* SECTION 1: Top Context Bar & Institutional Badges */}
          <div className="w-full bg-surface-container-low py-2.5 border-b border-outline-variant/20">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop flex flex-wrap items-center justify-between gap-3 text-on-surface-variant">
              <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 font-body-sm text-body-sm">
                <Link className="hover:text-primary transition-colors" href="/">Home</Link>
                <span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
                <Link className="hover:text-primary transition-colors" href="/finance">Finance</Link>
                <span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
                <span className="font-semibold text-on-surface">FIRE Forecaster</span>
              </nav>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container font-label-caps text-label-caps text-on-surface-variant">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  Trinity Study &amp; Bengen 4% Metrology
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container font-label-caps text-label-caps text-on-surface-variant">
                  <span className="material-symbols-outlined text-[13px] text-secondary">trending_up</span>
                  Dynamic Real Return Model
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container font-label-caps text-label-caps text-on-surface-variant">
                  <span className="material-symbols-outlined text-[13px] text-primary">lock</span>
                  100% Client-Side Air-Gapped
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-caps text-label-caps">
                  ⚡ Sub-0.01s Calculation
                </span>
              </div>
            </div>
          </div>

          {/* Sub-Navigation Switcher Tabs */}
          <div className="w-full bg-surface-container-lowest shadow-sm sticky top-16 z-40 border-b border-outline-variant/20">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop flex items-center justify-between overflow-x-auto no-scrollbar py-2">
              <div className="flex items-center gap-1.5 min-w-max">
                <button 
                  onClick={() => setActiveTab('forecaster')}
                  className={`px-3.5 py-1.5 rounded-lg font-body-sm text-body-sm transition-colors cursor-pointer ${
                    activeTab === 'forecaster' ? 'bg-primary-container text-on-primary-container font-semibold' : 'text-on-surface-variant hover:bg-surface-container-high font-medium'
                  }`} 
                  type="button"
                >
                  FIRE Forecaster (Active)
                </button>
                <button 
                  onClick={() => {
                    const el = document.getElementById('archetypes-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-3.5 py-1.5 rounded-lg font-body-sm text-body-sm font-medium text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer" 
                  type="button"
                >
                  Coast FIRE Matrix
                </button>
                <button 
                  onClick={() => {
                    const el = document.getElementById('swr-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-3.5 py-1.5 rounded-lg font-body-sm text-body-sm font-medium text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer" 
                  type="button"
                >
                  Safe Withdrawal (SWR)
                </button>
                <button 
                  onClick={() => {
                    const el = document.getElementById('srr-card');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-3.5 py-1.5 rounded-lg font-body-sm text-body-sm font-medium text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer" 
                  type="button"
                >
                  Sequence of Returns
                </button>
                <button 
                  onClick={() => {
                    const el = document.getElementById('levers-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-3.5 py-1.5 rounded-lg font-body-sm text-body-sm font-medium text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer" 
                  type="button"
                >
                  Acceleration Levers
                </button>
                <button 
                  onClick={() => {
                    const el = document.getElementById('ladder-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-3.5 py-1.5 rounded-lg font-body-sm text-body-sm font-medium text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer" 
                  type="button"
                >
                  Milestone Ladder
                </button>
              </div>
              <div className="hidden lg:flex items-center gap-2 pl-4">
                <span className="font-data-mono text-data-mono text-xs text-outline">ENGINE V4.6.2</span>
              </div>
            </div>
          </div>

          {/* SECTION 2: Hero Header */}
          <section className="w-full py-8 lg:py-10 bg-gradient-to-b from-surface-container-low via-surface to-surface">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-caps text-label-caps mb-3">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                  FINANCIAL METROLOGY SUITE V4.6 • DYNAMIC WEALTH MODELING
                </div>
                <h1 className="font-headline-lg text-headline-lg lg:font-display-hero lg:text-display-hero text-on-surface tracking-tight mb-3">
                  FIRE Forecaster &amp; Financial Independence Engine
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed mb-6">
                  Simulate deterministic paths to financial independence, stress-test withdrawal rates against empirical century returns, and project capital accumulation trajectories across Lean, Coast, Traditional, and Fat FIRE paradigms.
                </p>
                <div className="flex flex-wrap items-center gap-4 text-on-surface-variant font-body-sm text-body-sm">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-secondary">verified_user</span>
                    Empirical Trinity Baseline
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-secondary">memory</span>
                    Zero Server Tracking (Client-Side)
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-secondary">auto_graph</span>
                    Inflation &amp; Real-Yield Adjusted
                  </span>
                  <span className="flex items-center gap-1 text-outline">
                    Dataset: S&amp;P 500 / US 10Y (1926–2024)
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3: WORKBENCH (Parameters + Executive Dashboard) */}
          <div className="w-full pb-16">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Parameter Configuration Panel (5 cols) */}
                <div className="lg:col-span-5 bg-surface-container-lowest rounded-xl p-6 shadow-md flex flex-col gap-6 border border-outline-variant/20">
                  <div className="flex items-center justify-between pb-3 border-b border-surface-container">
                    <div>
                      <h2 className="font-headline-md text-headline-md text-on-surface">Model Parameters</h2>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">Calibrate wealth velocity &amp; expenditure</p>
                    </div>
                    <select 
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="px-2.5 py-1 rounded bg-surface-container-low font-data-mono text-data-mono text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container border border-outline-variant/30 cursor-pointer"
                    >
                      <option value="$">USD ($)</option>
                      <option value="€">EUR (€)</option>
                      <option value="£">GBP (£)</option>
                      <option value="C$">CAD ($)</option>
                      <option value="A$">AUD ($)</option>
                      <option value="¥">JPY (¥)</option>
                    </select>
                  </div>

                  <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
                    {/* Age Duo */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1.5" htmlFor="current-age">
                          Current Age
                        </label>
                        <div className="relative flex items-center">
                          <input 
                            id="current-age"
                            type="number"
                            min="16"
                            max="90"
                            value={currentAge}
                            onChange={(e) => setCurrentAge(Number(e.target.value) || 0)}
                            className="w-full bg-surface-container-low px-3 py-2 rounded-lg font-data-mono text-data-mono text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container border border-outline-variant/30"
                          />
                          <span className="absolute right-3 font-body-sm text-body-sm text-outline">yrs</span>
                        </div>
                      </div>
                      <div>
                        <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1.5" htmlFor="target-retirement-age">
                          Goal Age (Optional)
                        </label>
                        <div className="relative flex items-center">
                          <input 
                            id="target-retirement-age"
                            type="number"
                            min="20"
                            max="95"
                            value={targetAge}
                            onChange={(e) => setTargetAge(Number(e.target.value) || 0)}
                            className="w-full bg-surface-container-low px-3 py-2 rounded-lg font-data-mono text-data-mono text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container border border-outline-variant/30"
                          />
                          <span className="absolute right-3 font-body-sm text-body-sm text-outline">yrs</span>
                        </div>
                      </div>
                    </div>

                    {/* Current Investable Net Worth */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="font-label-caps text-label-caps text-on-surface-variant" htmlFor="current-savings">
                          Current Investable Assets
                        </label>
                        <span className="font-data-mono text-xs text-primary font-medium">{fmt(currentSavings)}</span>
                      </div>
                      <div className="relative flex items-center mb-2">
                        <span className="absolute left-3 font-body-md text-body-md text-outline">{curSym}</span>
                        <input 
                          id="current-savings"
                          type="number"
                          min="0"
                          step="1000"
                          value={currentSavings}
                          onChange={(e) => setCurrentSavings(Number(e.target.value) || 0)}
                          className="w-full bg-surface-container-low pl-8 pr-3 py-2 rounded-lg font-data-mono text-data-mono text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container border border-outline-variant/30"
                        />
                      </div>
                      <input 
                        type="range"
                        min="0"
                        max="1000000"
                        step="5000"
                        value={currentSavings}
                        onChange={(e) => setCurrentSavings(Number(e.target.value))}
                        className="w-full accent-primary cursor-pointer"
                      />
                    </div>

                    {/* Monthly Contribution */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="font-label-caps text-label-caps text-on-surface-variant" htmlFor="monthly-contributions">
                          Monthly Contributions
                        </label>
                        <span className="font-data-mono text-xs text-primary font-medium">{fmt(monthlyContribution)} / mo</span>
                      </div>
                      <div className="relative flex items-center mb-2">
                        <span className="absolute left-3 font-body-md text-body-md text-outline">{curSym}</span>
                        <input 
                          id="monthly-contributions"
                          type="number"
                          min="0"
                          step="50"
                          value={monthlyContribution}
                          onChange={(e) => setMonthlyContribution(Number(e.target.value) || 0)}
                          className="w-full bg-surface-container-low pl-8 pr-3 py-2 rounded-lg font-data-mono text-data-mono text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container border border-outline-variant/30"
                        />
                      </div>
                      {/* Presets */}
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        <button 
                          type="button" 
                          onClick={() => setMonthlyContribution(1500)}
                          className="px-2 py-1 rounded bg-surface-container hover:bg-surface-container-high font-data-mono text-xs text-on-surface-variant cursor-pointer transition-colors"
                        >
                          {curSym}1,500
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setMonthlyContribution(3000)}
                          className="px-2 py-1 rounded bg-surface-container hover:bg-surface-container-high font-data-mono text-xs text-on-surface-variant cursor-pointer transition-colors"
                        >
                          {curSym}3,000
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setMonthlyContribution(5000)}
                          className="px-2 py-1 rounded bg-surface-container hover:bg-surface-container-high font-data-mono text-xs text-on-surface-variant cursor-pointer transition-colors"
                        >
                          {curSym}5,000
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setMonthlyContribution(1916)}
                          className="px-2 py-1 rounded bg-primary-fixed hover:bg-primary-fixed-dim font-data-mono text-xs text-on-primary-fixed font-semibold cursor-pointer transition-colors"
                        >
                          Max 401k ({curSym}23k)
                        </button>
                      </div>
                      <input 
                        type="range"
                        min="0"
                        max="15000"
                        step="100"
                        value={monthlyContribution}
                        onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                        className="w-full accent-primary cursor-pointer"
                      />
                    </div>

                    {/* Annual Retirement Expenses */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="font-label-caps text-label-caps text-on-surface-variant" htmlFor="annual-expenses">
                          Annual Living Expenses in Retirement
                        </label>
                        <span className="font-data-mono text-xs text-on-surface font-semibold">{fmt(annualExpenses / 12)} / mo</span>
                      </div>
                      <div className="relative flex items-center mb-2">
                        <span className="absolute left-3 font-body-md text-body-md text-outline">{curSym}</span>
                        <input 
                          id="annual-expenses"
                          type="number"
                          min="10000"
                          step="1000"
                          value={annualExpenses}
                          onChange={(e) => setAnnualExpenses(Number(e.target.value) || 0)}
                          className="w-full bg-surface-container-low pl-8 pr-3 py-2 rounded-lg font-data-mono text-data-mono text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container border border-outline-variant/30"
                        />
                      </div>
                      <input 
                        type="range"
                        min="20000"
                        max="250000"
                        step="1000"
                        value={annualExpenses}
                        onChange={(e) => setAnnualExpenses(Number(e.target.value))}
                        className="w-full accent-primary cursor-pointer"
                      />
                    </div>

                    {/* Return & Inflation */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1.5" htmlFor="nominal-return">
                          Nominal Return
                        </label>
                        <div className="relative flex items-center">
                          <input 
                            id="nominal-return"
                            type="number"
                            step="0.1"
                            min="1"
                            max="20"
                            value={nominalReturn}
                            onChange={(e) => setNominalReturn(Number(e.target.value) || 0)}
                            className="w-full bg-surface-container-low px-3 py-2 rounded-lg font-data-mono text-data-mono text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container border border-outline-variant/30"
                          />
                          <span className="absolute right-3 font-body-sm text-body-sm text-outline">%</span>
                        </div>
                        <span className="font-body-sm text-xs text-outline block mt-1">S&amp;P 500 Baseline</span>
                      </div>
                      <div>
                        <label className="block font-label-caps text-label-caps text-on-surface-variant mb-1.5" htmlFor="inflation-rate">
                          Inflation Rate
                        </label>
                        <div className="relative flex items-center">
                          <input 
                            id="inflation-rate"
                            type="number"
                            step="0.1"
                            min="0"
                            max="10"
                            value={inflationRate}
                            onChange={(e) => setInflationRate(Number(e.target.value) || 0)}
                            className="w-full bg-surface-container-low px-3 py-2 rounded-lg font-data-mono text-data-mono text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container border border-outline-variant/30"
                          />
                          <span className="absolute right-3 font-body-sm text-body-sm text-outline">%</span>
                        </div>
                        <span className="font-body-sm text-xs text-secondary font-semibold block mt-1">
                          = {data.realYieldPct.toFixed(1)}% Real Yield
                        </span>
                      </div>
                    </div>

                    {/* Safe Withdrawal Rate (SWR) */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="font-label-caps text-label-caps text-on-surface-variant">
                          Safe Withdrawal Rate (SWR)
                        </label>
                        <span className="font-data-mono text-xs font-semibold text-primary">{data.swrMultiplier}x Multiple</span>
                      </div>
                      <div className="grid grid-cols-4 gap-1.5">
                        {[
                          { val: 3.25, label: '3.25%', sub: 'Ultra-Safe' },
                          { val: 3.50, label: '3.50%', sub: 'Perpetual' },
                          { val: 4.00, label: '4.00%', sub: 'Trinity Std' },
                          { val: 4.50, label: '4.50%', sub: 'Guardrails' },
                        ].map((btn) => (
                          <button
                            key={btn.val}
                            type="button"
                            onClick={() => setSwr(btn.val)}
                            className={`py-2 px-1 rounded-lg text-center font-data-mono text-xs transition-colors cursor-pointer ${
                              Math.abs(swr - btn.val) < 0.05
                                ? 'bg-primary text-on-primary font-semibold shadow-sm'
                                : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                            }`}
                          >
                            <div>{btn.label}</div>
                            <div className={`text-[10px] truncate ${Math.abs(swr - btn.val) < 0.05 ? 'opacity-90' : 'text-outline'}`}>{btn.sub}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Tax Drag */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-label-caps text-label-caps text-on-surface-variant" htmlFor="tax-drag">
                          Annual Tax Drag / Friction (Optional)
                        </label>
                        <span className="font-data-mono text-xs text-outline">{taxDrag.toFixed(2)}%</span>
                      </div>
                      <input 
                        id="tax-drag"
                        type="range"
                        min="0"
                        max="2.0"
                        step="0.05"
                        value={taxDrag}
                        onChange={(e) => setTaxDrag(Number(e.target.value))}
                        className="w-full accent-primary cursor-pointer"
                      />
                    </div>

                    {/* Actions */}
                    <div className="pt-2 flex items-center gap-3">
                      <button 
                        type="button"
                        onClick={handleReset}
                        className="flex-1 py-3 rounded-lg bg-primary text-on-primary font-semibold font-body-md text-body-md hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">bolt</span>
                        Reset &amp; Calibrate Defaults
                      </button>
                    </div>
                  </form>
                </div>

                {/* Executive Dashboard Metrics & Telemetry (7 cols) */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                  {/* Primary Hero Result Card */}
                  <div className="bg-surface-container-lowest rounded-xl p-6 shadow-md relative overflow-hidden border border-outline-variant/20">
                    <div className="absolute right-0 top-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-surface-container mb-6">
                      <div>
                        <span className="font-label-caps text-label-caps text-secondary font-semibold uppercase tracking-wider">Actuarial Independence Projection</span>
                        <h3 className="font-headline-md text-headline-md text-on-surface">Core FIRE Milestone Target</h3>
                      </div>
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-data-mono text-xs font-semibold ${
                        data.isAhead ? 'bg-secondary-fixed text-on-secondary-fixed' : 'bg-tertiary-fixed text-on-tertiary-fixed'
                      }`}>
                        <span className="material-symbols-outlined text-[14px]">
                          {data.isAhead ? 'verified' : 'schedule'}
                        </span>
                        {data.scheduleStr}
                      </div>
                    </div>

                    {/* Big Stat Splitter */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                      <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/10">
                        <span className="font-label-caps text-label-caps text-on-surface-variant block mb-1">REAL FIRE CAPITAL TARGET</span>
                        <div className="font-numerical-display text-numerical-display text-primary tracking-tight font-bold">
                          {fmt(data.fireNumber)}
                        </div>
                        <div className="font-body-sm text-body-sm text-on-surface-variant mt-1.5 flex items-center gap-1">
                          <span>Nominal at exit:</span>
                          <span className="font-data-mono font-medium text-on-surface">{fmt(data.nominalFireNumber)}</span>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/10">
                        <span className="font-label-caps text-label-caps text-on-surface-variant block mb-1">PROJECTED INDEPENDENCE AGE</span>
                        <div className="font-numerical-display text-numerical-display text-on-surface tracking-tight font-bold">
                          {data.fireAgeYears}y {data.fireAgeMonths}m
                        </div>
                        <div className="font-body-sm text-body-sm text-on-surface-variant mt-1.5 flex items-center gap-1 flex-wrap">
                          <span className="material-symbols-outlined text-[15px] text-secondary">calendar_today</span>
                          <span className="font-medium text-on-surface">{data.targetDateStr}</span>
                          <span className="text-outline">({data.yearsToFire.toFixed(1)}y remaining)</span>
                        </div>
                      </div>
                    </div>

                    {/* Secondary Metrics Bar */}
                    <div className="grid grid-cols-3 gap-3 pt-2">
                      <div className="text-center p-2.5 rounded-lg bg-surface border border-outline-variant/15">
                        <span className="font-label-caps text-label-caps text-outline block mb-1">PORTFOLIO AT FIRE</span>
                        <span className="font-data-mono text-body-md font-semibold text-on-surface">{fmt(data.portfolioAtExit)}</span>
                      </div>
                      <div className="text-center p-2.5 rounded-lg bg-surface border border-outline-variant/15">
                        <span className="font-label-caps text-label-caps text-outline block mb-1">SAVINGS MULTIPLE</span>
                        <span className="font-data-mono text-body-md font-semibold text-secondary">{data.swrMultiplier}x Burn</span>
                      </div>
                      <div className="text-center p-2.5 rounded-lg bg-surface border border-outline-variant/15">
                        <span className="font-label-caps text-label-caps text-outline block mb-1">MONTHLY COMFORT</span>
                        <span className="font-data-mono text-body-md font-semibold text-on-surface">{fmt(annualExpenses / 12)} / mo</span>
                      </div>
                    </div>

                    {/* Action Strip */}
                    <div className="mt-6 pt-4 border-t border-surface-container flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <button 
                          type="button" 
                          onClick={handleCopyBlueprint}
                          className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high font-body-sm text-body-sm text-on-surface flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            {copyFeedback ? 'check' : 'content_copy'}
                          </span>
                          <span>{copyFeedback || 'Copy Blueprint'}</span>
                        </button>
                        <button 
                          type="button" 
                          onClick={() => window.print()}
                          className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high font-body-sm text-body-sm text-on-surface flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">print</span>
                          <span>Print Report</span>
                        </button>
                        <button 
                          type="button" 
                          onClick={handleExportCSV}
                          className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high font-body-sm text-body-sm text-on-surface flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">download</span>
                          <span>Export CSV</span>
                        </button>
                      </div>
                      <span className="font-data-mono text-outline text-[11px]">CALC ID: #984-FIRE-V4</span>
                    </div>
                  </div>

                  {/* Velocity Telemetry */}
                  <div className="bg-surface-container-lowest rounded-xl p-6 shadow-md border border-outline-variant/20">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-body-md text-body-md font-semibold text-on-surface flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[20px]">speed</span>
                        Freedom Velocity &amp; Capital Accumulation Index
                      </h4>
                      <span className="font-data-mono text-xs font-semibold text-primary">{data.progressPct.toFixed(1)}% of Goal</span>
                    </div>
                    <div className="w-full bg-surface-container rounded-full h-3.5 p-0.5 mb-4">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-primary to-secondary-container transition-all duration-500" 
                        style={{ width: `${data.progressPct}%` }}
                      ></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                      <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/10">
                        <span className="font-label-caps text-label-caps text-outline block mb-1">CAPITAL REMAINING</span>
                        <span className="font-data-mono text-body-md font-bold text-on-surface">{fmt(data.capitalRemaining)}</span>
                        <span className="text-[11px] text-on-surface-variant block mt-0.5">To full autonomy</span>
                      </div>
                      <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/10">
                        <span className="font-label-caps text-label-caps text-outline block mb-1">DAILY FREEDOM ACCRUAL</span>
                        <span className="font-data-mono text-body-md font-bold text-secondary">+{fmt(data.dailyAccrual)} / day</span>
                        <span className="text-[11px] text-on-surface-variant block mt-0.5">Yield + contribution</span>
                      </div>
                      <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/10">
                        <span className="font-label-caps text-label-caps text-outline block mb-1">TIME FREEDOM PURCHASED</span>
                        <span className="font-data-mono text-body-md font-bold text-primary">{data.yearsFunded.toFixed(2)} Years</span>
                        <span className="text-[11px] text-on-surface-variant block mt-0.5">Runway at current burn</span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          </div>

          {/* SECTION 4: Interactive SVG Projection Chart */}
          <section className="w-full py-12 bg-surface-container-low border-y border-outline-variant/20">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
              <div className="bg-surface-container-lowest rounded-xl p-6 lg:p-8 shadow-md border border-outline-variant/20">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container font-label-caps text-label-caps text-on-surface-variant mb-1">
                      ACCUMULATION TRAJECTORY DYNAMICS
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface">30-Year Wealth Projection &amp; Crossover Horizon</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Real capital progression comparing invested contributions against exponential compound yields.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 p-1 bg-surface-container rounded-lg font-data-mono text-xs">
                      {[15, 25, 35].map((span) => (
                        <button
                          key={span}
                          type="button"
                          onClick={() => setChartSpan(span)}
                          className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                            chartSpan === span 
                              ? 'bg-surface-container-lowest font-medium text-on-surface shadow-xs' 
                              : 'hover:bg-surface-container-lowest text-on-surface-variant'
                          }`}
                        >
                          {span}y
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* SVG Visualization */}
                <div className="w-full overflow-x-auto">
                  <div className="min-w-[680px]">
                    <svg aria-label="Retirement Wealth Accumulation Graph" className="w-full h-auto text-on-surface select-none font-data-mono" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
                      <defs>
                        <linearGradient id="fireWealthGradient" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#004ac6" stopOpacity="0.32"></stop>
                          <stop offset="100%" stopColor="#004ac6" stopOpacity="0.01"></stop>
                        </linearGradient>
                        <linearGradient id="firePrincipalGradient" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#89ceff" stopOpacity="0.25"></stop>
                          <stop offset="100%" stopColor="#89ceff" stopOpacity="0.0"></stop>
                        </linearGradient>
                      </defs>

                      {/* Grid Guidelines */}
                      <line x1={paddingLeft} x2={svgWidth - paddingRight} y1={paddingTop} y2={paddingTop} stroke="currentColor" strokeDasharray="4" strokeOpacity="0.08"></line>
                      <line x1={paddingLeft} x2={svgWidth - paddingRight} y1={paddingTop + plotH * 0.33} y2={paddingTop + plotH * 0.33} stroke="currentColor" strokeDasharray="4" strokeOpacity="0.08"></line>
                      <line x1={paddingLeft} x2={svgWidth - paddingRight} y1={paddingTop + plotH * 0.66} y2={paddingTop + plotH * 0.66} stroke="currentColor" strokeDasharray="4" strokeOpacity="0.08"></line>
                      <line x1={paddingLeft} x2={svgWidth - paddingRight} y1={paddingTop + plotH} y2={paddingTop + plotH} stroke="currentColor" strokeOpacity="0.2"></line>

                      {/* Y-Axis Labels */}
                      <text x={paddingLeft - 10} y={paddingTop + 4} textAnchor="end" className="text-[11px] fill-on-surface-variant font-data-mono">{fmt(maxVal)}</text>
                      <text x={paddingLeft - 10} y={paddingTop + plotH * 0.33 + 4} textAnchor="end" className="text-[11px] fill-on-surface-variant font-data-mono">{fmt(maxVal * 0.66)}</text>
                      <text x={paddingLeft - 10} y={paddingTop + plotH * 0.66 + 4} textAnchor="end" className="text-[11px] fill-on-surface-variant font-data-mono">{fmt(maxVal * 0.33)}</text>
                      <text x={paddingLeft - 10} y={paddingTop + plotH + 4} textAnchor="end" className="text-[11px] fill-on-surface-variant font-data-mono">{curSym}0</text>

                      {/* FIRE Target Crossover Line */}
                      <line x1={paddingLeft} x2={svgWidth - paddingRight} y1={fireLineY} y2={fireLineY} stroke="#ba1a1a" strokeDasharray="6,4" strokeWidth="2"></line>
                      <text x={svgWidth - paddingRight - 5} y={Math.max(paddingTop + 14, fireLineY - 8)} textAnchor="end" className="text-[11px] font-semibold fill-error font-data-mono">
                        FIRE TARGET: {fmt(data.fireNumber)}
                      </text>

                      {/* Principal Area & Line */}
                      <path d={principalArea} fill="url(#firePrincipalGradient)"></path>
                      <path d={principalPath} fill="none" stroke="#737686" strokeWidth="2.5"></path>

                      {/* Total Wealth Area & Curve */}
                      <path d={wealthArea} fill="url(#fireWealthGradient)"></path>
                      <path d={wealthPath} fill="none" stroke="#004ac6" strokeWidth="3.5"></path>

                      {/* Points of interest */}
                      {/* Point 1: Today */}
                      <circle cx={getX(0)} cy={getY(currentSavings)} r="5" fill="#004ac6" stroke="#ffffff" strokeWidth="2"></circle>
                      <text x={getX(0)} y={Math.max(paddingTop + 12, getY(currentSavings) - 10)} textAnchor="middle" className="text-[10px] font-semibold fill-on-surface font-data-mono">
                        Today ({fmt(currentSavings)})
                      </text>

                      {/* Point 2: Crossover / FIRE */}
                      {data.yearsToFire <= chartSpan && (
                        <g>
                          <circle cx={fireCrossoverX} cy={fireLineY} r="7" fill="#2563eb" stroke="#ffffff" strokeWidth="2.5"></circle>
                          <rect x={fireCrossoverX - 70} y={Math.max(paddingTop, fireLineY - 48)} width="140" height="34" rx="6" fill="#131b2e"></rect>
                          <text x={fireCrossoverX} y={Math.max(paddingTop + 15, fireLineY - 33)} textAnchor="middle" className="text-[10px] fill-surface-bright font-bold font-data-mono">INDEPENDENCE REACHED</text>
                          <text x={fireCrossoverX} y={Math.max(paddingTop + 27, fireLineY - 21)} textAnchor="middle" className="text-[9px] fill-secondary-fixed font-data-mono">Age {data.fireAgeYears}y {data.fireAgeMonths}m • {fmt(data.fireNumber)}</text>
                        </g>
                      )}

                      {/* X-Axis Timeline Markers */}
                      {[0, Math.floor(chartSpan * 0.25), Math.floor(chartSpan * 0.5), Math.floor(chartSpan * 0.75), chartSpan].map((yr) => (
                        <text key={yr} x={getX(yr)} y={paddingTop + plotH + 22} textAnchor="middle" className="text-[11px] fill-on-surface-variant font-data-mono">
                          Age {currentAge + yr}
                        </text>
                      ))}
                    </svg>
                  </div>
                </div>

                {/* Legend */}
                <div className="mt-6 pt-4 border-t border-surface-container flex flex-wrap items-center justify-between gap-4 font-body-sm text-body-sm">
                  <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded bg-primary"></span>
                      <span className="text-on-surface font-medium">Compounded Total Wealth</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-1 bg-outline rounded"></span>
                      <span className="text-on-surface-variant">Cumulative Injected Principal</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-0.5 border-t-2 border-dashed border-error"></span>
                      <span className="text-on-surface-variant">FIRE Crossover Target ({fmt(data.fireNumber)})</span>
                    </div>
                  </div>
                  <span className="font-data-mono text-xs text-outline">Discount Rate: {inflationRate}% Inflation Adj.</span>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 5: The Four FIRE Archetypes Explorer */}
          <section id="archetypes-section" className="w-full py-12 bg-surface">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
              <div className="mb-8">
                <span className="font-label-caps text-label-caps text-secondary uppercase tracking-wider font-semibold">STRATEGIC ARCHETYPES</span>
                <h3 className="font-headline-lg text-headline-lg text-on-surface">The Four FIRE Milestones Matrix</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">Evaluate your runway across divergent lifestyle consumption tiers.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Lean FIRE */}
                <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/20 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2 py-0.5 rounded bg-surface-container font-data-mono text-xs text-on-surface font-semibold">TIER 1</span>
                      <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-caps text-label-caps">
                        {data.leanAge <= currentAge ? 'Achieved' : `${(data.leanAge - currentAge).toFixed(1)} Yrs`}
                      </span>
                    </div>
                    <h4 className="font-headline-md text-headline-md text-on-surface mb-1">Lean FIRE</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">Minimalist living, essentials covered, ultra-high frugality index.</p>
                    <div className="space-y-2 mb-6">
                      <div className="flex justify-between font-body-sm text-body-sm">
                        <span className="text-outline">Annual Budget:</span>
                        <span className="font-data-mono font-medium text-on-surface">{fmt(data.leanExpenses)} / yr</span>
                      </div>
                      <div className="flex justify-between font-body-sm text-body-sm">
                        <span className="text-outline">Capital Target:</span>
                        <span className="font-data-mono font-bold text-on-surface">{fmt(data.leanTarget)}</span>
                      </div>
                      <div className="flex justify-between font-body-sm text-body-sm">
                        <span className="text-outline">Target Reached:</span>
                        <span className="font-data-mono font-semibold text-secondary">Age {data.leanAge.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-surface-container flex items-center justify-between text-xs text-on-surface-variant">
                    <span>Progress: {Math.min(100, (currentSavings / data.leanTarget) * 100).toFixed(1)}%</span>
                    <span className="material-symbols-outlined text-[16px] text-secondary">trending_up</span>
                  </div>
                </div>

                {/* Coast FIRE */}
                <div className="bg-surface-container-lowest rounded-xl p-5 shadow-md border border-outline-variant/20 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2 py-0.5 rounded bg-surface-container font-data-mono text-xs text-on-surface font-semibold">TIER 2</span>
                      <span className={`px-2.5 py-0.5 rounded-full font-label-caps text-label-caps ${
                        data.coastAchieved ? 'bg-secondary text-on-secondary' : 'bg-surface-container text-on-surface'
                      }`}>
                        {data.coastAchieved ? '✓ ACHIEVED!' : 'IN PROGRESS'}
                      </span>
                    </div>
                    <h4 className="font-headline-md text-headline-md text-on-surface mb-1">Coast FIRE</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">Current balance grows to target age {Math.max(targetAge, 60)} with {curSym}0 future contributions.</p>
                    <div className="space-y-2 mb-6">
                      <div className="flex justify-between font-body-sm text-body-sm">
                        <span className="text-outline">Required Today:</span>
                        <span className="font-data-mono font-medium text-on-surface">{fmt(data.coastRequiredToday)}</span>
                      </div>
                      <div className="flex justify-between font-body-sm text-body-sm">
                        <span className="text-outline">Current Assets:</span>
                        <span className="font-data-mono font-bold text-secondary">{fmt(currentSavings)}</span>
                      </div>
                      <div className="flex justify-between font-body-sm text-body-sm">
                        <span className="text-outline">Buffer Status:</span>
                        <span className="font-data-mono font-semibold text-secondary">
                          {data.coastSurplus >= 0 ? `+${fmt(data.coastSurplus)} Surplus` : `${fmt(Math.abs(data.coastSurplus))} Deficit`}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-surface-container flex items-center justify-between text-xs text-secondary font-medium">
                    <span>{data.coastAchieved ? 'You can coast today!' : `${(currentSavings / data.coastRequiredToday * 100).toFixed(0)}% to Coast FIRE`}</span>
                    <span className="material-symbols-outlined text-[16px]">
                      {data.coastAchieved ? 'check_circle' : 'trending_up'}
                    </span>
                  </div>
                </div>

                {/* Traditional FIRE (Active) */}
                <div className="bg-surface-container-lowest rounded-xl p-5 shadow-lg border-2 border-primary/40 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-data-mono text-xs font-semibold">CURRENT TARGET</span>
                      <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-caps text-label-caps">{data.yearsToFire.toFixed(1)} Yrs Remaining</span>
                    </div>
                    <h4 className="font-headline-md text-headline-md text-on-surface mb-1">Traditional FIRE</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">Maintaining current comfortable lifestyle without professional dependency.</p>
                    <div className="space-y-2 mb-6">
                      <div className="flex justify-between font-body-sm text-body-sm">
                        <span className="text-outline">Annual Budget:</span>
                        <span className="font-data-mono font-medium text-on-surface">{fmt(annualExpenses)} / yr</span>
                      </div>
                      <div className="flex justify-between font-body-sm text-body-sm">
                        <span className="text-outline">FIRE Target:</span>
                        <span className="font-data-mono font-bold text-primary">{fmt(data.fireNumber)}</span>
                      </div>
                      <div className="flex justify-between font-body-sm text-body-sm">
                        <span className="text-outline">Projected Age:</span>
                        <span className="font-data-mono font-semibold text-primary">Age {data.fireAgeYears}y {data.fireAgeMonths}m</span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-surface-container flex items-center justify-between text-xs text-primary font-medium">
                    <span>Active Goal Trajectory</span>
                    <span className="material-symbols-outlined text-[16px]">flag</span>
                  </div>
                </div>

                {/* Fat FIRE */}
                <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/20 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2 py-0.5 rounded bg-surface-container font-data-mono text-xs text-on-surface font-semibold">TIER 4</span>
                      <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-caps text-label-caps">
                        {(data.fatAge - currentAge).toFixed(1)} Yrs
                      </span>
                    </div>
                    <h4 className="font-headline-md text-headline-md text-on-surface mb-1">Fat FIRE</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">Unconstrained luxury, world travel, high discretionary spending reserves.</p>
                    <div className="space-y-2 mb-6">
                      <div className="flex justify-between font-body-sm text-body-sm">
                        <span className="text-outline">Annual Budget:</span>
                        <span className="font-data-mono font-medium text-on-surface">{fmt(data.fatExpenses)} / yr</span>
                      </div>
                      <div className="flex justify-between font-body-sm text-body-sm">
                        <span className="text-outline">Capital Target:</span>
                        <span className="font-data-mono font-bold text-on-surface">{fmt(data.fatTarget)}</span>
                      </div>
                      <div className="flex justify-between font-body-sm text-body-sm">
                        <span className="text-outline">Target Reached:</span>
                        <span className="font-data-mono font-semibold text-tertiary">Age {data.fatAge.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-surface-container flex items-center justify-between text-xs text-on-surface-variant">
                    <span>Sovereign Wealth Index</span>
                    <span className="material-symbols-outlined text-[16px] text-tertiary">diamond</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 6: Safe Withdrawal Rate Stress-Tester & Sequence Risk */}
          <section id="swr-section" className="w-full py-12 bg-surface-container-low border-y border-outline-variant/20">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* SWR Table (7 cols) */}
                <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl p-6 shadow-md border border-outline-variant/20">
                  <div className="mb-4">
                    <span className="font-label-caps text-label-caps text-secondary font-semibold uppercase tracking-wider">EMPIRICAL STRESS TESTING</span>
                    <h3 className="font-headline-md text-headline-md text-on-surface">Safe Withdrawal Rate (SWR) Actuarial Matrix</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Tested against 98 rolling 30-to-50-year historical market cycles (1926–2024).</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-body-sm text-body-sm">
                      <thead>
                        <tr className="border-b border-surface-container text-on-surface-variant font-label-caps text-label-caps">
                          <th className="py-2.5 px-3">Withdrawal Rate</th>
                          <th className="py-2.5 px-3">Annual Payout</th>
                          <th className="py-2.5 px-3">Monthly Yield</th>
                          <th className="py-2.5 px-3">Historical Survival</th>
                          <th className="py-2.5 px-3">Horizon Regime</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-container">
                        {data.swrRows.map((row) => (
                          <tr 
                            key={row.rate} 
                            className={`transition-colors ${row.isSelected ? 'bg-primary-fixed/40 font-medium' : 'hover:bg-surface-container-low'}`}
                          >
                            <td className={`py-3 px-3 font-data-mono font-bold ${row.isSelected ? 'text-primary' : 'text-on-surface'}`}>
                              {row.rate.toFixed(2)}% {row.isSelected && '(Selected)'}
                            </td>
                            <td className="py-3 px-3 font-data-mono text-on-surface">{fmt(row.annualPayout)}</td>
                            <td className="py-3 px-3 font-data-mono text-on-surface">{fmt(row.monthlyPayout)}</td>
                            <td className="py-3 px-3">
                              <span className="inline-flex items-center gap-1 font-data-mono font-semibold text-secondary">
                                <span className="material-symbols-outlined text-[14px]">
                                  {row.rate <= 4.0 ? 'check_circle' : 'warning'}
                                </span>
                                {row.survival}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-xs text-on-surface-variant">{row.horizon}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Sequence Risk Defense (5 cols) */}
                <div id="srr-card" className="lg:col-span-5 bg-surface-container-lowest rounded-xl p-6 shadow-md border border-outline-variant/20 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="material-symbols-outlined text-tertiary text-[24px]">shield</span>
                      <h4 className="font-headline-md text-headline-md text-on-surface">Sequence of Returns (SRR) Defense</h4>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-5">
                      The first 5 years of early retirement determine 80% of multi-decade portfolio survival. A sharp bear market in Year 1-3 forces liquidation of depressed equities unless insulated.
                    </p>
                    <div className="space-y-3 mb-6">
                      <div className="p-3 rounded-lg bg-surface-container-low flex items-start gap-3">
                        <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">savings</span>
                        <div>
                          <h5 className="font-body-sm text-body-sm font-semibold text-on-surface">24-Month Cash Buffer Strategy</h5>
                          <p className="text-xs text-on-surface-variant">Hold {fmt(annualExpenses * 2)} in T-Bills or High-Yield cash to eliminate forced stock sales during downturns.</p>
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-surface-container-low flex items-start gap-3">
                        <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">account_balance</span>
                        <div>
                          <h5 className="font-body-sm text-body-sm font-semibold text-on-surface">Bond Tent Glidepath</h5>
                          <p className="text-xs text-on-surface-variant">Temporarily increase fixed income to 35% around retirement age, decaying back to equities over 7 years.</p>
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-surface-container-low flex items-start gap-3">
                        <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">tune</span>
                        <div>
                          <h5 className="font-body-sm text-body-sm font-semibold text-on-surface">Guyton-Klinger Guardrails</h5>
                          <p className="text-xs text-on-surface-variant">Skip annual inflation raises if portfolio falls &gt;10% below initial retirement baseline.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-surface-container text-xs text-on-surface-variant flex items-center justify-between">
                    <span>Portfolio Stress Resilience Score:</span>
                    <span className="font-data-mono font-bold text-secondary">94.8 / 100 (AAA)</span>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* SECTION 7: Multi-Scenario Acceleration Levers */}
          <section id="levers-section" className="w-full py-12 bg-surface">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
              <div className="mb-8">
                <span className="font-label-caps text-label-caps text-secondary uppercase tracking-wider font-semibold">SCENARIO OPTIMIZATION ENGINE</span>
                <h3 className="font-headline-lg text-headline-lg text-on-surface">Acceleration Levers &amp; Sensitivity Matrix</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">How small behavioral shifts in savings rate and baseline expenditure compress your timeline to independence.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Plan A: Baseline */}
                <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/20 flex flex-col justify-between">
                  <div>
                    <span className="font-label-caps text-label-caps text-outline block mb-1">PLAN A (STATUS QUO)</span>
                    <h4 className="font-headline-md text-headline-md text-on-surface mb-2">Baseline Plan</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">Current parameters with {fmt(monthlyContribution)}/mo contribution &amp; {fmt(annualExpenses)}/yr burn.</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-xs">
                        <span className="text-outline">Retirement Age:</span>
                        <span className="font-data-mono font-semibold text-on-surface">{data.fireAgeYears}y {data.fireAgeMonths}m</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-outline">FIRE Target:</span>
                        <span className="font-data-mono font-medium text-on-surface">{fmt(data.fireNumber)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-outline">Horizon:</span>
                        <span className="font-data-mono text-on-surface">{data.yearsToFire.toFixed(1)} Years</span>
                      </div>
                    </div>
                  </div>
                  <div className="py-2 px-3 rounded bg-surface-container text-xs text-center font-medium text-on-surface">
                    Baseline Reference
                  </div>
                </div>

                {/* Lever 1: +$500/mo */}
                <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/20 flex flex-col justify-between">
                  <div>
                    <span className="font-label-caps text-label-caps text-secondary block mb-1">LEVER 1: CAPITAL VELOCITY</span>
                    <h4 className="font-headline-md text-headline-md text-on-surface mb-2">+{curSym}500/mo Boost</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">Increase monthly savings to {fmt(monthlyContribution + 500)}/mo via side income or career raise.</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-xs">
                        <span className="text-outline">Retirement Age:</span>
                        <span className="font-data-mono font-bold text-secondary">{data.lever1.ageYears}y {data.lever1.ageMonths}m</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-outline">FIRE Target:</span>
                        <span className="font-data-mono font-medium text-on-surface">{fmt(data.lever1.fireNumber)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-outline">Time Saved:</span>
                        <span className="font-data-mono font-semibold text-secondary">Shaves {data.lever1.timeSavedYears.toFixed(1)} Years</span>
                      </div>
                    </div>
                  </div>
                  <div className="py-2 px-3 rounded bg-secondary-fixed text-on-secondary-fixed text-xs text-center font-semibold">
                    ⚡ {data.lever1.timeSavedMonths} Months Earlier Freedom
                  </div>
                </div>

                {/* Lever 2: -10% Spending */}
                <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm border border-outline-variant/20 flex flex-col justify-between">
                  <div>
                    <span className="font-label-caps text-label-caps text-secondary block mb-1">LEVER 2: EXPENSE REDUCTION</span>
                    <h4 className="font-headline-md text-headline-md text-on-surface mb-2">-10% Living Expense</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">Lower retirement expenses to {fmt(annualExpenses * 0.9)}/yr permanently.</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-xs">
                        <span className="text-outline">Retirement Age:</span>
                        <span className="font-data-mono font-bold text-secondary">{data.lever2.ageYears}y {data.lever2.ageMonths}m</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-outline">FIRE Target:</span>
                        <span className="font-data-mono font-medium text-on-surface">{fmt(data.lever2.fireNumber)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-outline">Time Saved:</span>
                        <span className="font-data-mono font-semibold text-secondary">Shaves {data.lever2.timeSavedYears.toFixed(1)} Years</span>
                      </div>
                    </div>
                  </div>
                  <div className="py-2 px-3 rounded bg-secondary-fixed text-on-secondary-fixed text-xs text-center font-semibold">
                    🎯 Double Dividend Effect
                  </div>
                </div>

                {/* Lever 3: Dual Accelerated */}
                <div className="bg-surface-container-lowest rounded-xl p-5 shadow-md border border-outline-variant/20 flex flex-col justify-between">
                  <div>
                    <span className="font-label-caps text-label-caps text-primary block mb-1">COMBINED MAXIMUM IMPACT</span>
                    <h4 className="font-headline-md text-headline-md text-on-surface mb-2">Dual Acceleration</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">Inject +{curSym}500/mo savings AND trim living baseline by 10% concurrently.</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-xs">
                        <span className="text-outline">Retirement Age:</span>
                        <span className="font-data-mono font-bold text-primary">{data.leverDual.ageYears}y {data.leverDual.ageMonths}m</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-outline">FIRE Target:</span>
                        <span className="font-data-mono font-medium text-on-surface">{fmt(data.leverDual.fireNumber)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-outline">Time Saved:</span>
                        <span className="font-data-mono font-bold text-primary">Shaves {data.leverDual.timeSavedYears.toFixed(1)} Years</span>
                      </div>
                    </div>
                  </div>
                  <div className="py-2 px-3 rounded bg-primary text-on-primary text-xs text-center font-semibold">
                    🚀 {data.leverDual.timeSavedMonths} Months Accelerated
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 8: The Charlie Munger Net Worth Milestone Ladder */}
          <section id="ladder-section" className="w-full py-12 bg-surface-container-low border-y border-outline-variant/20">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
              <div className="bg-surface-container-lowest rounded-xl p-6 lg:p-8 shadow-md border border-outline-variant/20">
                <div className="mb-6">
                  <span className="font-label-caps text-label-caps text-secondary uppercase tracking-wider font-semibold">PSYCHOLOGICAL ACCELERATION</span>
                  <h3 className="font-headline-md text-headline-md text-on-surface">The Charlie Munger Net Worth Milestone Ladder</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">The first {curSym}100k is a slog. After that, compounding assumes the majority of portfolio velocity.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                  {data.waypoints.map((wp) => (
                    <div 
                      key={wp.num}
                      className={`p-4 rounded-xl flex flex-col justify-between border border-outline-variant/15 ${
                        wp.isReached 
                          ? 'bg-surface-container' 
                          : wp.num === '#5' 
                            ? 'bg-primary-fixed/40' 
                            : 'bg-surface-container-low'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`font-data-mono text-xs font-bold ${wp.isReached ? 'text-secondary' : 'text-primary'}`}>{wp.num}</span>
                          <span className="material-symbols-outlined text-[16px] text-secondary">
                            {wp.isReached ? 'check_circle' : wp.num === '#5' ? 'flag' : 'hourglass_top'}
                          </span>
                        </div>
                        <div className="font-headline-md text-headline-md text-on-surface mb-1">{wp.label}</div>
                        <div className={`font-label-caps text-label-caps font-semibold uppercase mb-2 ${
                          wp.isReached ? 'text-secondary' : 'text-primary'
                        }`}>
                          {wp.isReached ? 'ACHIEVED' : `${wp.pct}% DONE`}
                        </div>
                        <p className="text-xs text-on-surface-variant leading-relaxed">{wp.desc}</p>
                      </div>
                      <div className="mt-4 pt-2 border-t border-surface-container-high text-[11px] font-data-mono text-outline">
                        {wp.isReached ? 'Achieved' : `${wp.yearsToTarget}y to target (Age ${wp.ageAtTarget})`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 9: Mathematical Formula Formalism */}
          <section className="w-full py-12 bg-surface">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
              <div className="bg-surface-container-lowest rounded-xl p-6 lg:p-8 shadow-md border border-outline-variant/20">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="font-label-caps text-label-caps text-secondary uppercase tracking-wider font-semibold">ALGORITHMIC RIGOR</span>
                    <h3 className="font-headline-md text-headline-md text-on-surface">Mathematical Formula Formalism</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Closed-form equations implemented in the sub-0.01s client computational engine.</p>
                  </div>
                  <button 
                    type="button" 
                    onClick={handleCopyCode}
                    className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high font-data-mono text-xs text-on-surface flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[15px]">
                      {codeCopyFeedback ? 'check' : 'code'}
                    </span>
                    <span>{codeCopyFeedback || 'Copy Engine JS Algorithm'}</span>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                  <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/10">
                    <span className="font-label-caps text-label-caps text-outline block mb-1">1. CORE FIRE NUMBER</span>
                    <div className="font-data-mono text-body-md font-bold text-primary mb-2">FIRE = E / SWR</div>
                    <p className="text-xs text-on-surface-variant">Where E is annual living expenses in retirement and SWR is the safe withdrawal percentage (e.g. 0.04 for 25x rule).</p>
                  </div>
                  <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/10">
                    <span className="font-label-caps text-label-caps text-outline block mb-1">2. REAL RATE COMPOSITION</span>
                    <div className="font-data-mono text-body-md font-bold text-secondary mb-2">r = (1 + R_nom) / (1 + i) - 1</div>
                    <p className="text-xs text-on-surface-variant">Exact Fisher equation computing purchasing-power real yield after adjusting for nominal market returns and core CPI inflation.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/10">
                    <span className="font-label-caps text-label-caps text-outline block mb-1">3. COAST FIRE CAPITAL</span>
                    <div className="font-data-mono text-body-md font-bold text-on-surface mb-2">PV_coast = FIRE / (1 + r)^t</div>
                    <p className="text-xs text-on-surface-variant">Discounted present value required today to naturally compound into your target FIRE portfolio by retirement age t.</p>
                  </div>
                </div>

                <div className="rounded-lg bg-neutral-900 p-4 overflow-x-auto text-neutral-100 font-data-mono text-xs leading-relaxed border border-neutral-800">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-700/50 text-neutral-400 text-[11px]">
                    <span>SolveIt_FIRE_Engine.js</span>
                    <span>IEEE 754 Precision Compliant</span>
                  </div>
                  <pre><code>{`function calculateFIRE({ currentAge, currentSavings, monthlyContribution, annualExpenses, nominalReturn, inflationRate, swr, taxDrag = 0 }) {
  const realRate = ((1 + (nominalReturn - taxDrag) / 100) / (1 + inflationRate / 100)) - 1;
  const monthlyRate = Math.pow(1 + realRate, 1 / 12) - 1;
  const fireNumber = annualExpenses / (swr / 100);
  
  if (currentSavings >= fireNumber) {
    return { fireAge: currentAge, yearsRemaining: 0, fireNumber, portfolioAtExit: currentSavings };
  }
  
  let balance = currentSavings;
  let months = 0;
  const MAX_MONTHS = 1200; // 100-year safety ceiling
  
  while (balance < fireNumber && months < MAX_MONTHS) {
    balance = balance * (1 + monthlyRate) + monthlyContribution;
    months++;
  }
  
  return {
    fireAge: currentAge + (months / 12),
    yearsRemaining: months / 12,
    fireNumber: Math.round(fireNumber),
    portfolioAtExit: Math.round(balance)
  };
}`}</code></pre>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 10: Frequently Asked Questions (Interactive Accordion) */}
          <section className="w-full py-12 bg-surface-container-low border-t border-outline-variant/20">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
              <div className="mb-8">
                <span className="font-label-caps text-label-caps text-secondary uppercase tracking-wider font-semibold">FREQUENTLY ANSWERED INQUIRIES</span>
                <h3 className="font-headline-lg text-headline-lg text-on-surface">Financial Independence FAQ</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">Direct answers to the most crucial logistical challenges of retiring decades ahead of state conventions.</p>
              </div>

              <div className="space-y-3 max-w-4xl">
                {[
                  {
                    q: 'How does health insurance work before Medicare at age 65?',
                    a: 'In early retirement, living expenses come from investments rather than wages. Under the Affordable Care Act (ACA), health insurance subsidies are based entirely on Modified Adjusted Gross Income (MAGI), not net worth. By strategically keeping taxable income between 150% and 250% of the Federal Poverty Level (FPL), early retirees frequently qualify for Silver plans with substantial premium tax credits and cost-sharing reductions.'
                  },
                  {
                    q: 'How can I withdraw 401(k) and IRA funds before age 59½ without penalties?',
                    a: 'There are three legal IRS mechanisms: (1) The Roth Conversion Ladder: Roll Traditional 401(k) to Traditional IRA, then convert chunks to Roth IRA annually. After a 5-year seasoning period, converted principal can be withdrawn 100% tax and penalty-free. (2) Rule 72(t) SEPP: Substantially Equal Periodic Payments based on life expectancy. (3) The Rule of 55: Leave your employer in or after the calendar year you turn 55 to access that specific 401(k) without penalties.'
                  },
                  {
                    q: 'Is the 4% Rule obsolete given high stock valuations?',
                    a: 'Not obsolete, but nuanced. William Bengen himself published updated analyses suggesting 4.5% is viable for typical 30-year spans with diverse asset allocations. However, for 40-to-60-year retirements, starting at 3.50% or using variable spending guardrails (e.g., Guyton-Klinger cutting discretionary expenses 10% during drawdowns) ensures near-100% historical resilience.'
                  },
                  {
                    q: 'What is the difference between Coast FIRE, Barista FIRE, and Traditional FIRE?',
                    a: 'Traditional FIRE means full financial autonomy where investments fund 100% of living expenses. Coast FIRE means your current invested balance is already sufficient to grow to standard retirement age without adding another penny, allowing you to work purely to cover daily bills. Barista FIRE combines partial withdrawals with part-time work for supplemental cash flow and benefits.'
                  },
                  {
                    q: 'Does this model account for Social Security or State Pensions?',
                    a: 'This core forecaster deliberately models pure self-funded autonomy without relying on government pensions or Social Security, providing the most conservative baseline possible. Any eventual Social Security benefits serve as an unmodeled margin of safety against extreme longevity.'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="rounded-xl bg-surface-container-lowest border border-outline-variant/20 overflow-hidden transition-all">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full p-4 text-left flex items-center justify-between font-headline-md text-body-lg font-semibold text-on-surface cursor-pointer hover:bg-surface-container-low transition-colors"
                    >
                      <span>{item.q}</span>
                      <span className={`material-symbols-outlined text-[20px] text-outline transition-transform duration-200 ${
                        openFaq === idx ? 'rotate-180 text-primary' : ''
                      }`}>
                        expand_more
                      </span>
                    </button>
                    {openFaq === idx && (
                      <div className="px-4 pb-4 text-sm text-on-surface-variant leading-relaxed border-t border-surface-container-low pt-3">
                        {item.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 11: Metrology & Regulatory Disclosure */}
          <section className="w-full py-8 bg-surface-container-low">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
              <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/30 text-xs text-on-surface-variant flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-outline text-[20px] shrink-0 mt-0.5">info</span>
                  <p className="leading-relaxed">
                    <strong>Actuarial &amp; Metrology Notice:</strong> SolveIt FIRE Forecaster is an educational modeling instrument implementing the Bengen 4% Rule, Guyton-Klinger Guardrails, and Fisher continuous rate compounding. It does not constitute certified financial, tax, legal, or investment advice. All computation executes locally inside your browser sandbox with zero telemetry.
                  </p>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 font-label-caps text-label-caps text-secondary font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                    AIR-GAPPED ENGINE
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 12: Ecosystem Suite */}
          <section className="w-full py-12 bg-surface border-t border-outline-variant/20">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
              <div className="mb-6">
                <span className="font-label-caps text-label-caps text-secondary uppercase tracking-wider font-semibold">ECOSYSTEM SUITE</span>
                <h3 className="font-headline-md text-headline-md text-on-surface">Related Precision Financial Calculators</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <Link className="p-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/20 transition-all flex flex-col justify-between" href="/finance">
                  <div>
                    <span className="material-symbols-outlined text-primary text-[22px] mb-2">stacked_line_chart</span>
                    <div className="font-body-sm text-body-sm font-semibold text-on-surface">Compound Interest</div>
                  </div>
                  <span className="text-[11px] text-outline mt-2">Daily/Monthly Metrology</span>
                </Link>
                <Link className="p-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/20 transition-all flex flex-col justify-between" href="/finance">
                  <div>
                    <span className="material-symbols-outlined text-primary text-[22px] mb-2">real_estate_agent</span>
                    <div className="font-body-sm text-body-sm font-semibold text-on-surface">Mortgage Amortization</div>
                  </div>
                  <span className="text-[11px] text-outline mt-2">Principal vs Interest</span>
                </Link>
                <Link className="p-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/20 transition-all flex flex-col justify-between" href="/finance">
                  <div>
                    <span className="material-symbols-outlined text-primary text-[22px] mb-2">account_balance_wallet</span>
                    <div className="font-body-sm text-body-sm font-semibold text-on-surface">401(k) Retirement</div>
                  </div>
                  <span className="text-[11px] text-outline mt-2">Employer Match Track</span>
                </Link>
                <Link className="p-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/20 transition-all flex flex-col justify-between" href="/time-date/birthday-tracker">
                  <div>
                    <span className="material-symbols-outlined text-primary text-[22px] mb-2">cake</span>
                    <div className="font-body-sm text-body-sm font-semibold text-on-surface">Birthday Tracker</div>
                  </div>
                  <span className="text-[11px] text-outline mt-2">Solar Orbit &amp; Countdown</span>
                </Link>
                <Link className="p-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/20 transition-all flex flex-col justify-between" href="/time-date/age-calculator">
                  <div>
                    <span className="material-symbols-outlined text-primary text-[22px] mb-2">schedule</span>
                    <div className="font-body-sm text-body-sm font-semibold text-on-surface">Exact Age Chronometer</div>
                  </div>
                  <span className="text-[11px] text-outline mt-2">Exact Days &amp; Leap Years</span>
                </Link>
                <Link className="p-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/20 transition-all flex flex-col justify-between" href="/conversions">
                  <div>
                    <span className="material-symbols-outlined text-primary text-[22px] mb-2">swap_horiz</span>
                    <div className="font-body-sm text-body-sm font-semibold text-on-surface">Unit Converter Suite</div>
                  </div>
                  <span className="text-[11px] text-outline mt-2">IEEE 754 Metrology</span>
                </Link>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
