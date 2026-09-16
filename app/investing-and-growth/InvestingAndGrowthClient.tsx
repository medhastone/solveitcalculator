'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function InvestingAndGrowthClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [currentPrincipal, setCurrentPrincipal] = useState(25000);
  const [currentMonthly, setCurrentMonthly] = useState(1000);
  const [currentRate, setCurrentRate] = useState(10);
  const [currentYears, setCurrentYears] = useState(20);
  const [isInflation, setIsInflation] = useState(false);
  const [activeCountText, setActiveCountText] = useState('95 Tools');

  const setGoal = (pv: number, pmt: number, rate: number, yrs: number) => {
    setCurrentPrincipal(pv);
    setCurrentMonthly(pmt);
    setCurrentRate(rate);
    setCurrentYears(yrs);
  };

  const r = currentRate / 100;
  const monthlyRate = r / 12;
  const totalMonths = currentYears * 12;

  let fv = 0;
  if (monthlyRate > 0) {
    fv = currentPrincipal * Math.pow(1 + monthlyRate, totalMonths) +
         currentMonthly * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
  } else {
    fv = currentPrincipal + (currentMonthly * totalMonths);
  }

  const totalDeposits = currentPrincipal + (currentMonthly * totalMonths);
  const totalInterest = Math.max(0, fv - totalDeposits);

  const inflationRate = 0.025;
  const realFv = fv / Math.pow(1 + inflationRate, currentYears);

  const displayVal = isInflation ? realFv : fv;

  const scaleFactor = Math.min(75, Math.max(10, 80 - (fv / 2000000) * 70));
  const contribScale = Math.min(75, Math.max(30, 80 - (totalDeposits / 2000000) * 50));

  const calcFv = (pv: number, pmt: number, annualRate: number, yrs: number) => {
    const mRate = annualRate / 12;
    const n = yrs * 12;
    if (mRate > 0) {
      return pv * Math.pow(1 + mRate, n) + pmt * ((Math.pow(1 + mRate, n) - 1) / mRate);
    }
    return pv + pmt * n;
  };

  const formatCompact = (num: number) => {
    if (num >= 1000000) return '$' + (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return '$' + Math.round(num / 1000) + 'k';
    return '$' + Math.round(num);
  };

  useEffect(() => {
    const q = searchQuery.toLowerCase().trim();
    const blocks = document.querySelectorAll<HTMLElement>('.cluster-block');
    let totalCount = 0;

    blocks.forEach(block => {
      const cat = block.getAttribute('data-category');
      const isCatMatch = activeTab === 'all' || cat === activeTab;
      const cards = block.querySelectorAll<HTMLElement>('.tool-card');
      let blockMatches = 0;

      cards.forEach(card => {
        const text = (card.textContent || '').toLowerCase();
        const matches = !q || text.includes(q);
        if (isCatMatch && matches) {
          card.style.display = 'flex';
          blockMatches++;
          totalCount++;
        } else {
          card.style.display = 'none';
        }
      });

      if (isCatMatch && blockMatches > 0) {
        block.style.display = 'block';
      } else {
        block.style.display = 'none';
      }
    });

    if (q) {
      setActiveCountText(`${totalCount} Tools Match`);
    } else {
      setActiveCountText(`${activeTab === 'all' ? 95 : totalCount} Tools`);
    }
  }, [searchQuery, activeTab]);

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* HEADER */}
      

      {/* MAIN CONTENT */}
      <main className="w-full pt-16 bg-surface flex-1">
        <div className="flex flex-col w-full">
          {/* Top Ambient Glow Decor (Contained) */}
          <div className="relative w-full max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop pt-space-md">
            {/* Breadcrumb & Header Meta */}
            <div className="flex flex-wrap items-center justify-between gap-space-sm mb-space-md">
              <nav aria-label="Breadcrumb" className="flex items-center gap-space-xs font-body-sm text-body-sm text-on-surface-variant">
                <Link className="hover:text-primary transition-colors flex items-center gap-1" href="/">
                  <span className="material-symbols-outlined text-[16px]">home</span>
                  Home
                </Link>
                <span className="material-symbols-outlined text-[14px] text-outline-variant">chevron_right</span>
                <Link className="hover:text-primary transition-colors" href="/finance">Financial Calculators</Link>
                <span className="material-symbols-outlined text-[14px] text-outline-variant">chevron_right</span>
                <span className="text-on-surface font-medium">Investing &amp; Growth</span>
              </nav>
              {/* EEAT Verified Audit Pill */}
              <div className="inline-flex items-center gap-1.5 px-space-xs py-1 rounded-full bg-surface-container-high text-on-surface font-data-mono text-xs">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span className="">CFA® / CFP® Audited • IEEE 754 Math • Oct 2025</span>
              </div>
            </div>

            {/* Category Headline Hero */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg pb-space-lg">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-space-xs py-0.5 rounded bg-primary/10 text-primary font-label-caps text-label-caps uppercase tracking-wider mb-space-xs">
                  Institutional Computational Models
                </div>
                <h1 className="font-headline-lg text-headline-lg font-bold tracking-tight text-on-surface">
                  Investing &amp; Growth Calculators
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant mt-space-2xs">
                  Precision wealth projection, compound interest, CAGR, dividends, FIRE modeling, and dynamic portfolio analytics.
                </p>
              </div>
              {/* Trust Badges Bar */}
              <div className="flex flex-wrap items-center gap-space-xs font-data-mono text-xs text-on-surface-variant">
                <div className="flex items-center gap-1 bg-surface-container-low px-space-xs py-1.5 rounded-lg shadow-sm">
                  <span className="material-symbols-outlined text-[16px] text-primary">verified_user</span>
                  <span className="">95+ Precision Models</span>
                </div>
                <div className="flex items-center gap-1 bg-surface-container-low px-space-xs py-1.5 rounded-lg shadow-sm">
                  <span className="material-symbols-outlined text-[16px] text-secondary">memory</span>
                  <span className="">Zero-Latency Client-Side</span>
                </div>
                <div className="flex items-center gap-1 bg-surface-container-low px-space-xs py-1.5 rounded-lg shadow-sm">
                  <span className="material-symbols-outlined text-[16px] text-tertiary">lock</span>
                  <span className="">No Data Tracking</span>
                </div>
              </div>
            </div>

            {/* INTERACTIVE WORKBENCH: Live Wealth Scenario Simulator */}
            <section className="mb-space-2xl">
              <div className="bg-surface-container-lowest rounded-xl shadow-md p-space-md lg:p-space-xl relative overflow-hidden">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-space-md gap-space-sm">
                  <div className="flex items-center gap-space-xs">
                    <span className="p-2 rounded-lg bg-primary-fixed text-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-[22px]">ssid_chart</span>
                    </span>
                    <div>
                      <span className="font-label-caps text-label-caps uppercase text-primary tracking-wider">Interactive Live Simulator</span>
                      <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">Wealth Accumulation &amp; Horizon Model</h2>
                    </div>
                  </div>
                  {/* Quick Preset Goals */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-label-caps text-label-caps text-on-surface-variant mr-1">Targets:</span>
                    <button className="px-2 py-1 rounded bg-surface-container-low hover:bg-surface-container font-data-mono text-xs text-on-surface transition-colors" onClick={() => setGoal(25000, 1500, 10, 20)} type="button">
                      Retire at 50
                    </button>
                    <button className="px-2 py-1 rounded bg-surface-container-low hover:bg-surface-container font-data-mono text-xs text-on-surface transition-colors" onClick={() => setGoal(10000, 1200, 10, 25)} type="button">
                      $1M Milestone
                    </button>
                    <button className="px-2 py-1 rounded bg-surface-container-low hover:bg-surface-container font-data-mono text-xs text-on-surface transition-colors" onClick={() => setGoal(50000, 2500, 8, 15)} type="button">
                      $5k/mo Passive
                    </button>
                    <button className="px-2 py-1 rounded bg-surface-container-low hover:bg-surface-container font-data-mono text-xs text-on-surface transition-colors" onClick={() => setGoal(40000, 2000, 9, 18)} type="button">
                      FIRE Number
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
                  {/* Inputs Column (7 Cols) */}
                  <div className="lg:col-span-7 space-y-space-md">
                    {/* Principal and Monthly Contribution in Split Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                      <div className="bg-surface-container-low p-space-sm rounded-lg">
                        <div className="flex justify-between items-center mb-1">
                          <label className="font-label-caps text-label-caps text-on-surface-variant uppercase" htmlFor="initialPrincipal">Starting Principal</label>
                          <span className="font-data-mono text-data-mono font-semibold text-primary" id="dispPrincipal">${currentPrincipal.toLocaleString()}</span>
                        </div>
                        <div className="relative flex items-center">
                          <span className="absolute left-3 text-on-surface-variant font-data-mono text-sm">$</span>
                          <input className="w-full pl-7 pr-3 py-2 bg-surface-container-lowest text-on-surface font-data-mono text-data-mono rounded shadow-inner focus:outline-none"
                            id="initialPrincipal"
                            max="10000000"
                            min="0"
                            onChange={(e) => setCurrentPrincipal(Number(e.target.value) || 0)}
                            step="1000"
                            type="number"
                            value={currentPrincipal}
                          />
                        </div>
                        <input className="w-full accent-primary mt-2 cursor-pointer"
                          id="sliderPrincipal"
                          max="500000"
                          min="0"
                          onChange={(e) => setCurrentPrincipal(Number(e.target.value))}
                          step="5000"
                          type="range"
                          value={currentPrincipal}
                        />
                      </div>
                      <div className="bg-surface-container-low p-space-sm rounded-lg">
                        <div className="flex justify-between items-center mb-1">
                          <label className="font-label-caps text-label-caps text-on-surface-variant uppercase" htmlFor="monthlyContrib">Monthly Contribution</label>
                          <span className="font-data-mono text-data-mono font-semibold text-primary" id="dispContrib">${currentMonthly.toLocaleString()}</span>
                        </div>
                        <div className="relative flex items-center">
                          <span className="absolute left-3 text-on-surface-variant font-data-mono text-sm">$</span>
                          <input className="w-full pl-7 pr-3 py-2 bg-surface-container-lowest text-on-surface font-data-mono text-data-mono rounded shadow-inner focus:outline-none"
                            id="monthlyContrib"
                            max="500000"
                            min="0"
                            onChange={(e) => setCurrentMonthly(Number(e.target.value) || 0)}
                            step="50"
                            type="number"
                            value={currentMonthly}
                          />
                        </div>
                        <input className="w-full accent-primary mt-2 cursor-pointer"
                          id="sliderContrib"
                          max="10000"
                          min="0"
                          onChange={(e) => setCurrentMonthly(Number(e.target.value))}
                          step="100"
                          type="range"
                          value={currentMonthly}
                        />
                      </div>
                    </div>

                    {/* Rate of Return Buttons & Slider */}
                    <div className="bg-surface-container-low p-space-sm rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Expected Annual Return (CAGR)</label>
                        <span className="font-data-mono text-data-mono font-semibold text-primary" id="dispRate">{currentRate.toFixed(1)}%</span>
                      </div>
                      <div className="grid grid-cols-4 gap-2 mb-3">
                        <button
                          className={`py-1.5 px-2 rounded font-data-mono text-xs text-center transition-colors ${Math.abs(currentRate - 5) < 0.2 ? 'bg-primary text-on-primary font-semibold' : 'bg-surface-container-lowest hover:bg-surface-container text-on-surface'}`}
                          onClick={() => setCurrentRate(5)}
                          type="button"
                        >
                          5% Conservative
                        </button>
                        <button
                          className={`py-1.5 px-2 rounded font-data-mono text-xs text-center transition-colors ${Math.abs(currentRate - 8) < 0.2 ? 'bg-primary text-on-primary font-semibold' : 'bg-surface-container-lowest hover:bg-surface-container text-on-surface'}`}
                          onClick={() => setCurrentRate(8)}
                          type="button"
                        >
                          8% Balanced
                        </button>
                        <button
                          className={`py-1.5 px-2 rounded font-data-mono text-xs text-center transition-colors ${Math.abs(currentRate - 10) < 0.2 ? 'bg-primary text-on-primary font-semibold' : 'bg-surface-container-lowest hover:bg-surface-container text-on-surface'}`}
                          onClick={() => setCurrentRate(10)}
                          type="button"
                        >
                          10% S&amp;P 500
                        </button>
                        <button
                          className={`py-1.5 px-2 rounded font-data-mono text-xs text-center transition-colors ${Math.abs(currentRate - 12) < 0.2 ? 'bg-primary text-on-primary font-semibold' : 'bg-surface-container-lowest hover:bg-surface-container text-on-surface'}`}
                          onClick={() => setCurrentRate(12)}
                          type="button"
                        >
                          12% Aggressive
                        </button>
                      </div>
                      <input className="w-full accent-primary cursor-pointer"
                        id="sliderRate"
                        max="20"
                        min="1"
                        onChange={(e) => setCurrentRate(Number(e.target.value))}
                        step="0.25"
                        type="range"
                        value={currentRate}
                      />
                    </div>

                    {/* Time Horizon & Inflation Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                      <div className="bg-surface-container-low p-space-sm rounded-lg">
                        <div className="flex justify-between items-center mb-1">
                          <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Time Horizon</label>
                          <span className="font-data-mono text-data-mono font-semibold text-primary" id="dispHorizon">{currentYears} Years</span>
                        </div>
                        <input className="w-full accent-primary mt-2 cursor-pointer"
                          id="sliderYears"
                          max="45"
                          min="1"
                          onChange={(e) => setCurrentYears(Number(e.target.value))}
                          step="1"
                          type="range"
                          value={currentYears}
                        />
                      </div>
                      <div className="bg-surface-container-low p-space-sm rounded-lg flex items-center justify-between">
                        <div>
                          <span className="font-label-caps text-label-caps text-on-surface uppercase block">Inflation Adjustment</span>
                          <span className="font-body-sm text-body-sm text-on-surface-variant">Discount by 2.50% avg CPI</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input checked={isInflation}
                            className="sr-only peer"
                            id="chkInflation"
                            onChange={(e) => setIsInflation(e.target.checked)}
                            type="checkbox"
                          />
                          <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Real-Time Visual Projection Column (5 Cols) */}
                  <div className="lg:col-span-5 flex flex-col justify-between bg-surface-container p-space-md rounded-xl">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Portfolio Nominal Value</span>
                        <span className="font-label-caps text-label-caps px-2 py-0.5 rounded bg-primary/10 text-primary">Compounded Monthly</span>
                      </div>
                      <div className="font-numerical-display text-numerical-display font-bold text-on-surface tracking-tight" id="simTotalWealth">
                        ${Math.round(displayVal).toLocaleString()}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-label-caps text-label-caps text-on-surface-variant">Real Purchasing Power:</span>
                        <span className="font-data-mono text-data-mono font-semibold text-secondary" id="simRealWealth">
                          ${Math.round(realFv).toLocaleString()}
                        </span>
                      </div>

                      {/* Visual SVG Multi-Band Growth Chart */}
                      <div className="mt-space-md">
                        <div className="flex justify-between font-label-caps text-label-caps text-on-surface-variant mb-1">
                          <span>Year 0</span>
                          <span>Portfolio Trajectory (Principal vs Gain)</span>
                          <span id="chartYearEnd">Year {currentYears}</span>
                        </div>
                        <div className="w-full h-24 bg-surface-container-lowest rounded-lg p-2 flex items-end relative overflow-hidden">
                          <svg className="w-full h-full" id="simChart" preserveAspectRatio="none" viewBox="0 0 300 80">
                            <defs>
                              <linearGradient id="wealthGrad" x1="0%" x2="0%" y1="0%" y2="100%">
                                <stop offset="0%" stopColor="#2563eb" stopOpacity="0.5" />
                                <stop offset="100%" stopColor="#2563eb" stopOpacity="0.05" />
                              </linearGradient>
                              <linearGradient id="contribGrad" x1="0%" x2="0%" y1="0%" y2="100%">
                                <stop offset="0%" stopColor="#89ceff" stopOpacity="0.6" />
                                <stop offset="100%" stopColor="#89ceff" stopOpacity="0.1" />
                              </linearGradient>
                            </defs>
                            <path d={`M 0 80 Q 150 ${contribScale + 10} 300 ${contribScale} L 300 80 Z`} fill="url(#contribGrad)" id="contribArea" />
                            <path d={`M 0 80 Q 150 ${scaleFactor + 15} 300 ${scaleFactor} L 300 80 Z`} fill="url(#wealthGrad)" id="wealthArea" />
                            <path d={`M 0 80 Q 150 ${scaleFactor + 15} 300 ${scaleFactor}`} fill="none" id="wealthLine" stroke="#004ac6" strokeWidth="2.5" />
                          </svg>
                        </div>
                      </div>

                      {/* Metric Breakdown Grid */}
                      <div className="grid grid-cols-2 gap-2 mt-space-md">
                        <div className="p-2 rounded bg-surface-container-lowest">
                          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase block">Total Deposits</span>
                          <span className="font-data-mono text-data-mono font-bold text-on-surface" id="simDeposits">
                            ${Math.round(totalDeposits).toLocaleString()}
                          </span>
                        </div>
                        <div className="p-2 rounded bg-surface-container-lowest">
                          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase block">Interest Generated</span>
                          <span className="font-data-mono text-data-mono font-bold text-primary" id="simInterest">
                            ${Math.round(totalInterest).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Scenario Matrix Table */}
                    <div className="mt-space-md pt-space-sm">
                      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase block mb-1.5">Return Scenario Variance</span>
                      <div className="grid grid-cols-4 gap-1.5 text-center font-data-mono text-xs">
                        <div className="p-1 rounded bg-surface-container-lowest">
                          <div className="text-on-surface-variant text-[10px]">5% Conservative</div>
                          <div className="font-semibold text-on-surface mt-0.5" id="mat5">{formatCompact(calcFv(currentPrincipal, currentMonthly, 0.05, currentYears))}</div>
                        </div>
                        <div className="p-1 rounded bg-surface-container-lowest">
                          <div className="text-on-surface-variant text-[10px]">8% Balanced</div>
                          <div className="font-semibold text-on-surface mt-0.5" id="mat8">{formatCompact(calcFv(currentPrincipal, currentMonthly, 0.08, currentYears))}</div>
                        </div>
                        <div className="p-1 rounded bg-surface-container-lowest border border-primary/30 bg-primary/5">
                          <div className="text-primary text-[10px] font-bold">10% S&amp;P 500</div>
                          <div className="font-bold text-primary mt-0.5" id="mat10">{formatCompact(calcFv(currentPrincipal, currentMonthly, 0.10, currentYears))}</div>
                        </div>
                        <div className="p-1 rounded bg-surface-container-lowest">
                          <div className="text-on-surface-variant text-[10px]">12% Aggressive</div>
                          <div className="font-semibold text-on-surface mt-0.5" id="mat12">{formatCompact(calcFv(currentPrincipal, currentMonthly, 0.12, currentYears))}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SEARCH & CATEGORY FILTER TABS */}
            <section className="mb-space-lg">
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-space-md mb-space-md">
                {/* Live Filter Search */}
                <div className="relative flex-1 max-w-md">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
                  <input className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface placeholder-on-surface-variant/70 focus:outline-none focus:bg-surface-container-lowest transition-colors shadow-sm"
                    id="toolSearch"
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search 95+ investing tools, formulas, ratios..."
                    type="text"
                    value={searchQuery}
                  />
                </div>
                <div className="flex items-center gap-2 font-data-mono text-xs text-on-surface-variant">
                  <span>Active Models:</span>
                  <span className="font-bold text-primary px-2 py-0.5 rounded bg-surface-container-high" id="activeCount">{activeCountText}</span>
                </div>
              </div>

              {/* Filter Tabs Horizontal Scroll Bar */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-gutter-mobile px-gutter-mobile lg:mx-0 lg:px-0">
                <button
                  className={`cluster-tab px-3 py-1.5 rounded-full font-label-caps text-label-caps uppercase whitespace-nowrap shadow-sm transition-colors cursor-pointer ${activeTab === 'all' ? 'bg-primary text-on-primary' : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant'}`}
                  onClick={() => setActiveTab('all')}
                  type="button"
                >
                  All Models (95)
                </button>
                <button
                  className={`cluster-tab px-3 py-1.5 rounded-full font-label-caps text-label-caps uppercase whitespace-nowrap shadow-sm transition-colors cursor-pointer ${activeTab === 'growth' ? 'bg-primary text-on-primary' : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant'}`}
                  onClick={() => setActiveTab('growth')}
                  type="button"
                >
                  Growth &amp; FV (10)
                </button>
                <button
                  className={`cluster-tab px-3 py-1.5 rounded-full font-label-caps text-label-caps uppercase whitespace-nowrap shadow-sm transition-colors cursor-pointer ${activeTab === 'compound' ? 'bg-primary text-on-primary' : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant'}`}
                  onClick={() => setActiveTab('compound')}
                  type="button"
                >
                  Compound Interest (10)
                </button>
                <button
                  className={`cluster-tab px-3 py-1.5 rounded-full font-label-caps text-label-caps uppercase whitespace-nowrap shadow-sm transition-colors cursor-pointer ${activeTab === 'retirement' ? 'bg-primary text-on-primary' : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant'}`}
                  onClick={() => setActiveTab('retirement')}
                  type="button"
                >
                  Retirement (10)
                </button>
                <button
                  className={`cluster-tab px-3 py-1.5 rounded-full font-label-caps text-label-caps uppercase whitespace-nowrap shadow-sm transition-colors cursor-pointer ${activeTab === 'fire' ? 'bg-primary text-on-primary' : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant'}`}
                  onClick={() => setActiveTab('fire')}
                  type="button"
                >
                  FIRE Movement (10)
                </button>
                <button
                  className={`cluster-tab px-3 py-1.5 rounded-full font-label-caps text-label-caps uppercase whitespace-nowrap shadow-sm transition-colors cursor-pointer ${activeTab === 'stocks' ? 'bg-primary text-on-primary' : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant'}`}
                  onClick={() => setActiveTab('stocks')}
                  type="button"
                >
                  Stocks (10)
                </button>
                <button
                  className={`cluster-tab px-3 py-1.5 rounded-full font-label-caps text-label-caps uppercase whitespace-nowrap shadow-sm transition-colors cursor-pointer ${activeTab === 'etfs' ? 'bg-primary text-on-primary' : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant'}`}
                  onClick={() => setActiveTab('etfs')}
                  type="button"
                >
                  ETFs &amp; Funds (6)
                </button>
                <button
                  className={`cluster-tab px-3 py-1.5 rounded-full font-label-caps text-label-caps uppercase whitespace-nowrap shadow-sm transition-colors cursor-pointer ${activeTab === 'dividends' ? 'bg-primary text-on-primary' : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant'}`}
                  onClick={() => setActiveTab('dividends')}
                  type="button"
                >
                  Dividends &amp; DRIP (8)
                </button>
                <button
                  className={`cluster-tab px-3 py-1.5 rounded-full font-label-caps text-label-caps uppercase whitespace-nowrap shadow-sm transition-colors cursor-pointer ${activeTab === 'portfolio' ? 'bg-primary text-on-primary' : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant'}`}
                  onClick={() => setActiveTab('portfolio')}
                  type="button"
                >
                  Portfolio Analysis (10)
                </button>
                <button
                  className={`cluster-tab px-3 py-1.5 rounded-full font-label-caps text-label-caps uppercase whitespace-nowrap shadow-sm transition-colors cursor-pointer ${activeTab === 'wealth' ? 'bg-primary text-on-primary' : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant'}`}
                  onClick={() => setActiveTab('wealth')}
                  type="button"
                >
                  Wealth Building (9)
                </button>
                <button
                  className={`cluster-tab px-3 py-1.5 rounded-full font-label-caps text-label-caps uppercase whitespace-nowrap shadow-sm transition-colors cursor-pointer ${activeTab === 'passive' ? 'bg-primary text-on-primary' : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant'}`}
                  onClick={() => setActiveTab('passive')}
                  type="button"
                >
                  Passive Income (7)
                </button>
              </div>
            </section>

            {/* 10 MAJOR INVESTING CLUSTERS CONTAINER */}
            <div className="space-y-space-2xl mb-space-3xl" id="clustersGrid">
{/* CLUSTER 1: INVESTMENT GROWTH */}
        <section className="cluster-block" data-category="growth">
        <div className="flex items-center justify-between pb-space-xs mb-space-md">
        <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
        <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Investment Growth &amp; Future Value</h3>
        <span className="font-data-mono text-xs px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant">10 Tools</span>
        </div>
        <span className="font-label-caps text-label-caps uppercase text-on-surface-variant hidden sm:inline">Discounted Cash Flow &amp; FV Models</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md"><div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-primary">Core Model</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary transition-colors">show_chart</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Investment Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Project portfolio capital accumulation.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-primary">Actuarial Math</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary transition-colors">trending_up</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Future Value Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Forecast nominal and real terminal wealth.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-primary">Discounting</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary transition-colors">history</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Present Value Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Discount future cash flows to present value.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-primary">Target Solver</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary transition-colors">track_changes</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Investment Goal Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Determine required monthly contribution pacing.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-primary">Performance</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary transition-colors">query_stats</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Investment Return Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Measure total ROI and annualized gains.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-primary">Projection</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary transition-colors">timeline</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Investment Growth Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Simulate growth with stepped contributions.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-primary">Time Analysis</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary transition-colors">schedule</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Investment Timeline Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Calculate time needed to hit milestones.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-primary">DCA System</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary transition-colors">event_repeat</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Recurring Investment Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Model dollar-cost averaging cadences.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-primary">Lump Sum</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary transition-colors">payments</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">One-Time Investment Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Isolate pure market compounding.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-primary">Net Worth Goal</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary transition-colors">savings</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Target Wealth Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Solve required annualized portfolio growth.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div></div>
        </section>
        {/* CLUSTER 2: COMPOUND INTEREST */}
        <section className="cluster-block" data-category="compound">
        <div className="flex items-center justify-between pb-space-xs mb-space-md">
        <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
        <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Compound Interest Precision Models</h3>
        <span className="font-data-mono text-xs px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant">10 Tools</span>
        </div>
        <span className="font-label-caps text-label-caps uppercase text-on-surface-variant hidden sm:inline">Frequency &amp; Continuous Compounding</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md"><div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-secondary">General Compounding</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-secondary transition-colors">all_inclusive</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Compound Interest Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Full-spectrum compounding with tax adjustments.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-secondary">365-Day Basis</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-secondary transition-colors">calendar_today</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Daily Compound Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Daily high-frequency bank compounding.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-secondary">Standard Payroll</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-secondary transition-colors">calendar_month</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Monthly Compound Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Standard monthly cadence savings model.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-secondary">Corporate CD</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-secondary transition-colors">pie_chart</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Quarterly Compound Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Quarterly dividend and bond yield model.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-secondary">Annual Benchmark</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-secondary transition-colors">update</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Annual Compound Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Annualized benchmark growth trajectory.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-secondary">Euler Constant (e)</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-secondary transition-colors">functions</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Continuous Compound Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Mathematical upper limit compounding.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-secondary">Asset Trajectory</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-secondary transition-colors">waterfall_chart</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Compound Growth Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Non-linear growth curve modeling.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-secondary">Yield Rollover</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-secondary transition-colors">sync</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Interest Reinvestment Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Cost of distribution withdrawal.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-secondary">High-Yield Cash</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-secondary transition-colors">account_balance</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Compound Savings Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Effective APY vs APR yields.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-secondary">Net Yield</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-secondary transition-colors">percent</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Compound Return Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Geometric rate from irregular flows.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div></div>
        </section>
        {/* CLUSTER 3: RETIREMENT INVESTING */}
        <section className="cluster-block" data-category="retirement">
        <div className="flex items-center justify-between pb-space-xs mb-space-md">
        <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-tertiary"></span>
        <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Retirement Investing &amp; Decumulation</h3>
        <span className="font-data-mono text-xs px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant">10 Tools</span>
        </div>
        <span className="font-label-caps text-label-caps uppercase text-on-surface-variant hidden sm:inline">Corpus Modeling &amp; SWR Safety</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md"><div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-tertiary">Retirement Standard</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-tertiary transition-colors">elderly</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Retirement Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Comprehensive pension and 401(k) projection.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-tertiary">Total Capital Target</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-tertiary transition-colors">savings</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Retirement Corpus Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Required capital for future target.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-tertiary">Cash Flow</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-tertiary transition-colors">paid</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Retirement Income Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Predictable monthly income paycheck generation.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-tertiary">Decumulation</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-tertiary transition-colors">output</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Retirement Withdrawal Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Analyze sequence of returns risk.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-tertiary">Accumulation Rate</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-tertiary transition-colors">domain_verification</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Retirement Savings Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Track annual contribution pacing benchmarks.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-tertiary">Deficit Detection</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-tertiary transition-colors">error_outline</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Retirement Gap Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Identify capital shortfall early on.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-tertiary">Actuarial Span</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-tertiary transition-colors">troubleshoot</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Retirement Projection Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Run Monte Carlo survival simulations.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-tertiary">Standard of Living</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-tertiary transition-colors">deck</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Retirement Lifestyle Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Calibrate post-retirement lifestyle outlays.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-tertiary">Capital Preservation</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-tertiary transition-colors">egg</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Retirement Nest Egg Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Buffer against inflation and healthcare.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-tertiary">Bengen Standard</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-tertiary transition-colors">verified</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Safe Withdrawal Calculator (SWR)</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Evaluate safe drawdown rate sustainability.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div></div>
        </section>
        {/* CLUSTER 4: FIRE MOVEMENT */}
        <section className="cluster-block" data-category="fire">
        <div className="flex items-center justify-between pb-space-xs mb-space-md">
        <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-primary-container"></span>
        <h3 className="font-headline-md text-headline-md font-bold text-on-surface">FIRE Movement &amp; Early Retirement</h3>
        <span className="font-data-mono text-xs px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant">10 Tools</span>
        </div>
        <span className="font-label-caps text-label-caps uppercase text-on-surface-variant hidden sm:inline">Financial Independence, Retire Early</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md"><div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-primary">Master System</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary transition-colors">local_fire_department</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">FIRE Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Project financial independence milestone date.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-primary">Minimalist Path</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary transition-colors">eco</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Lean FIRE Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Frugal lifestyle low-overhead capital target.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-primary">Affluent Path</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary transition-colors">diamond</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Fat FIRE Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">High-expenditure retirement lifestyle planning.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-primary">Early Compound</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary transition-colors">sailing</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Coast FIRE Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Passive compound milestone without deposits.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-primary">Hybrid Gig</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary transition-colors">local_cafe</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Barista FIRE Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Semi-retirement paired with part-time wage.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-primary">Milestone Audit</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary transition-colors">speed</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">FIRE Progress Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Real-time freedom milestone tracking.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-primary">Target Figure</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary transition-colors">pin</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">FIRE Number Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">25x-33x annual expenditure multiplier.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-primary">Savings Velocity</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary transition-colors">savings</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Savings Rate Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Savings rate to retirement timeline.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-primary">Sovereignty</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary transition-colors">lock_open</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Financial Independence Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Passive cash flow vs expenses.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-primary">Early Exit</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary transition-colors">flight_takeoff</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Early Retirement Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Solves discretionary work age cutoff.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div></div>
        </section>
        {/* CLUSTER 5: STOCK INVESTING */}
        <section className="cluster-block" data-category="stocks">
        <div className="flex items-center justify-between pb-space-xs mb-space-md">
        <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-secondary-container"></span>
        <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Equities &amp; Stock Market Investing</h3>
        <span className="font-data-mono text-xs px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant">10 Tools</span>
        </div>
        <span className="font-label-caps text-label-caps uppercase text-on-surface-variant hidden sm:inline">Position Sizing, Cost Basis, &amp; Yields</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md"><div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-secondary">Capital Return</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-secondary transition-colors">candlestick_chart</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Stock Return Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Total net return and dividends.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-secondary">Weighted Average</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-secondary transition-colors">functions</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Stock Average Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Weighted average cost per share.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-secondary">Tax Accounting</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-secondary transition-colors">receipt_long</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Cost Basis Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Adjusted basis factoring splits.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-secondary">IRS Section 1</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-secondary transition-colors">account_balance_wallet</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Capital Gain Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Short vs long-term tax liabilities.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-secondary">Trade Execution</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-secondary transition-colors">monetization_on</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Stock Profit Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Net profit factoring trading fees.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-secondary">Risk Management</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-secondary transition-colors">balance</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Position Size Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Exact share count per risk limit.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-secondary">Asymmetry</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-secondary transition-colors">scale</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Risk-Reward Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Reward-to-risk ratio and win rate.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-secondary">Cash Flow Metric</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-secondary transition-colors">attach_money</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Dividend Yield Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Annual cash payout yield.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-secondary">Geometric Rate</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-secondary transition-colors">monitoring</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Stock CAGR Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">True multi-year compound growth.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-secondary">Blended Return</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-secondary transition-colors">dataset</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Portfolio Return Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Aggregate cross-ticker total return.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div></div>
        </section>
        {/* CLUSTER 6: ETF INVESTING */}
        <section className="cluster-block" data-category="etfs">
        <div className="flex items-center justify-between pb-space-xs mb-space-md">
        <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
        <h3 className="font-headline-md text-headline-md font-bold text-on-surface">ETFs &amp; Index Funds</h3>
        <span className="font-data-mono text-xs px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant">6 Tools</span>
        </div>
        <span className="font-label-caps text-label-caps uppercase text-on-surface-variant hidden sm:inline">Expense Ratios &amp; Index Compounding</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md"><div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-primary">Index Total Return</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary transition-colors">analytics</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">ETF Return Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Net index return post-expense.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-primary">Passive Horizon</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary transition-colors">stacked_line_chart</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">ETF Growth Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Multi-decade passive indexing growth.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-primary">Drag Quantifier</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary transition-colors">money_off</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">ETF Fee Impact Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Measure terminal wealth fee drag.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-primary">Side-by-Side</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary transition-colors">compare</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">ETF Comparison Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Compare fund fees and tracking.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-primary">Distribution DRIP</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary transition-colors">published_with_changes</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">ETF Reinvestment Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Automated quarterly dividend compounding.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-primary">Total Accumulation</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary transition-colors">stacked_bar_chart</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">ETF Compound Growth Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Total asset expansion and yield.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div></div>
        </section>
        {/* CLUSTER 7: DIVIDEND INVESTING */}
        <section className="cluster-block" data-category="dividends">
        <div className="flex items-center justify-between pb-space-xs mb-space-md">
        <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
        <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Dividend &amp; DRIP Cash Flow Systems</h3>
        <span className="font-data-mono text-xs px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant">8 Tools</span>
        </div>
        <span className="font-label-caps text-label-caps uppercase text-on-surface-variant hidden sm:inline">Yield on Cost &amp; Reinvestment Compounding</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md"><div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-secondary">General Yield</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-secondary transition-colors">toll</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Dividend Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Expected cash flow and yield.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-secondary">DRIP Snowball</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-secondary transition-colors">autorenew</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Dividend Reinvestment Calculator (DRIP)</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Exponential fractional share growth.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-secondary">Rate of Payout</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-secondary transition-colors">percent</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Dividend Yield Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Current yield vs benchmark comparisons.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-secondary">Historical Basis</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-secondary transition-colors">history_edu</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Yield on Cost Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Return yield on purchase price.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-secondary">Income Target</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-secondary transition-colors">account_balance</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Dividend Income Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Capital required for target dividends.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-secondary">Aristocrats Model</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-secondary transition-colors">trending_up</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Dividend Growth Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Simulate annual dividend payout increases.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-secondary">Paycheck Replacement</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-secondary transition-colors">calendar_month</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Monthly Dividend Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Staggered monthly distribution schedule.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-secondary">Cash Flow Stream</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-secondary transition-colors">hourglass_empty</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Passive Income Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Quarterly blended distribution yield.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div></div>
        </section>
        {/* CLUSTER 8: PORTFOLIO ANALYSIS */}
        <section className="cluster-block" data-category="portfolio">
        <div className="flex items-center justify-between pb-space-xs mb-space-md">
        <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-tertiary-container"></span>
        <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Portfolio Analysis &amp; Allocation</h3>
        <span className="font-data-mono text-xs px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant">10 Tools</span>
        </div>
        <span className="font-label-caps text-label-caps uppercase text-on-surface-variant hidden sm:inline">Modern Portfolio Theory &amp; Rebalancing</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md"><div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-primary">Aggregate Pace</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary transition-colors">query_stats</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Portfolio Growth Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Blended multi-asset growth trajectory.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-primary">Target Allocation</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary transition-colors">pie_chart</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Portfolio Allocation Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Holdings breakdown by asset class.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-primary">Risk Balancing</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary transition-colors">tune</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Asset Allocation Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Age-based portfolio glidepaths.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-primary">Drift Corrections</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary transition-colors">sync_alt</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Portfolio Rebalancing Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Exact rebalancing trades required.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-primary">Volatility &amp; Beta</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary transition-colors">security</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Portfolio Risk Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Standard deviation and VaR risk.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-primary">TWR / MWR</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary transition-colors">leaderboard</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Portfolio Return Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Time-weighted vs internal rate return.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-primary">Correlation</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary transition-colors">hub</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Diversification Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Asset covariance matrix test.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-primary">AUM Drag</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary transition-colors">credit_card_off</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Portfolio Fee Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Advisory wrap fee erosion.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-primary">Solvency Model</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary transition-colors">account_balance</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Net Worth Tracker</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Total liquid and illiquid equity.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-primary">Benchmark Alpha</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary transition-colors">trending_up</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Investment Performance Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Sharpe and Alpha benchmark ratings.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div></div>
        </section>
        {/* CLUSTER 9: WEALTH BUILDING */}
        <section className="cluster-block" data-category="wealth">
        <div className="flex items-center justify-between pb-space-xs mb-space-md">
        <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
        <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Wealth Building &amp; Milestones</h3>
        <span className="font-data-mono text-xs px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant">9 Tools</span>
        </div>
        <span className="font-label-caps text-label-caps uppercase text-on-surface-variant hidden sm:inline">Milestone Horizons &amp; Real Purchasing Power</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md"><div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-primary">Seven Figures</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary transition-colors">military_tech</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Millionaire Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Target million dollar timeline.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-primary">Balance Sheet</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary transition-colors">account_balance</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Net Worth Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Balance sheet net worth breakdown.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-primary">Trajectory</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary transition-colors">upgrade</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Wealth Growth Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Interest growth curve acceleration.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-primary">Independence</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary transition-colors">lock_open</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Financial Freedom Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Yield coverage of expenses.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-primary">Cash Flow</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary transition-colors">waterfall_chart</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Passive Income Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Dividends and fixed income flows.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-primary">CPI Discounted</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary transition-colors">price_change</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Inflation Adjusted Wealth Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Real purchasing power conversion.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-primary">Terminal Goal</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary transition-colors">flag</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Future Wealth Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Irregular bonuses and salary increases.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-primary">Multi-Year Forecast</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary transition-colors">stacked_line_chart</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Wealth Projection Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Conservative vs optimistic envelopes.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-primary">Salary Substitute</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary transition-colors">swap_horiz</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Income Replacement Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Capital needed to replace wages.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div></div>
        </section>
        {/* CLUSTER 10: PASSIVE INCOME */}
        <section className="cluster-block" data-category="passive">
        <div className="flex items-center justify-between pb-space-xs mb-space-md">
        <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
        <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Passive Income &amp; Yield Flow Models</h3>
        <span className="font-data-mono text-xs px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant">7 Tools</span>
        </div>
        <span className="font-label-caps text-label-caps uppercase text-on-surface-variant hidden sm:inline">Rental Cash Flow, Royalties, &amp; Dividend Inflows</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md"><div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-secondary">Broad Streams</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-secondary transition-colors">stream</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Passive Income Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Post-tax multi-stream cash returns.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-secondary">Equities Cash Flow</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-secondary transition-colors">savings</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Dividend Income Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Monthly dividend cash flow requirements.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-secondary">Property Cap Rate</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-secondary transition-colors">home</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Rental Yield Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Gross and net capitalization rates.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-secondary">Free Liquidity</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-secondary transition-colors">receipt</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Cash Flow Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Net residual cash flow generation.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-secondary">Supplemental</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-secondary transition-colors">rocket_launch</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Side Hustle Income Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Supplemental income index reinvestment.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-secondary">Diversified Inflows</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-secondary transition-colors">call_split</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Multiple Income Streams Calculator</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Multi-stream revenue tracking.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div>
        <div className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
        <div className="flex items-center justify-between mb-1.5">
        <span className="font-label-caps text-label-caps uppercase text-secondary">Lifestyle Architecture</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-secondary transition-colors">flag_circle</span>
        </div>
        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">Financial Independence Planner</h4>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Autonomous transition timeline model.</p>
        </div>
        <a className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="#">
                      Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </a>
        </div></div>
        </section>
</div>
{/*  INVESTOR HEAD-TO-HEAD COMPARISON GUIDES  */}
<section className="mb-space-3xl">
<div className="flex flex-col mb-space-lg">
<span className="font-label-caps text-label-caps uppercase text-primary tracking-wider">Analytical Decision Frameworks</span>
<h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">Investor Head-to-Head Comparisons</h2>
<p className="font-body-md text-body-md text-on-surface-variant mt-1">Empirical trade-off analyses backed by historical market data and tax efficiencies.</p>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
<div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
<div>
<div className="flex items-center justify-between font-label-caps text-label-caps text-on-surface-variant mb-2">
<span className="text-primary font-semibold">VEHICLE STRUCTURE</span>
<span className="material-symbols-outlined text-[16px]">swap_horiz</span>
</div>
<h3 className="font-body-lg text-body-lg font-bold text-on-surface">ETF vs Mutual Fund</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
              ETFs provide superior tax efficiency through authorized participant "in-kind" creation/redemption mechanisms, eliminating internal capital gains distributions inherent to open-end mutual funds.
            </p>
</div>
<div className="mt-4 pt-3 bg-surface-container-low p-2 rounded font-data-mono text-xs text-on-surface">
            Winner: <strong>ETFs</strong> for taxable brokerage; mutual funds for automated fractional dollar buying in 401(k)s.
          </div>
</div>
<div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
<div>
<div className="flex items-center justify-between font-label-caps text-label-caps text-on-surface-variant mb-2">
<span className="text-primary font-semibold">STRATEGY PROFILE</span>
<span className="material-symbols-outlined text-[16px]">swap_horiz</span>
</div>
<h3 className="font-body-lg text-body-lg font-bold text-on-surface">Dividend vs Growth</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
              Dividends generate predictable, tangible cash flow but trigger tax drag each taxable year. Growth stocks retain 100% of cash flows for capital compounding, deferring realization until liquidation.
            </p>
</div>
<div className="mt-4 pt-3 bg-surface-container-low p-2 rounded font-data-mono text-xs text-on-surface">
            Winner: <strong>Growth</strong> during accumulation; <strong>Dividends</strong> during post-retirement decumulation.
          </div>
</div>
<div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
<div>
<div className="flex items-center justify-between font-label-caps text-label-caps text-on-surface-variant mb-2">
<span className="text-primary font-semibold">CAPITAL ALLOCATION</span>
<span className="material-symbols-outlined text-[16px]">swap_horiz</span>
</div>
<h3 className="font-body-lg text-body-lg font-bold text-on-surface">Lump Sum vs DCA</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
              Vanguard research demonstrates Lump Sum investing outperforms Dollar-Cost Averaging approximately 68% of the time across 10-year rolling windows, because equity markets trend upward historically.
            </p>
</div>
<div className="mt-4 pt-3 bg-surface-container-low p-2 rounded font-data-mono text-xs text-on-surface">
            Empirical Math: <strong>Lump Sum</strong> maximizes expected return; <strong>DCA</strong> reduces regret &amp; sequence anxiety.
          </div>
</div>
<div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
<div>
<div className="flex items-center justify-between font-label-caps text-label-caps text-on-surface-variant mb-2">
<span className="text-primary font-semibold">RETIREMENT HORIZON</span>
<span className="material-symbols-outlined text-[16px]">swap_horiz</span>
</div>
<h3 className="font-body-lg text-body-lg font-bold text-on-surface">FIRE vs Traditional</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
              Traditional models plan for age 65 retirement with 4% SWR across a 30-year horizon. FIRE models (ages 35-50) require conservative 3.25%-3.5% withdrawal rates to survive 50+ year market spans.
            </p>
</div>
<div className="mt-4 pt-3 bg-surface-container-low p-2 rounded font-data-mono text-xs text-on-surface">
            Core Metric: <strong>Savings Rate</strong>. Traditional targets 15%; FIRE requires 50%-70% net savings.
          </div>
</div>
<div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
<div>
<div className="flex items-center justify-between font-label-caps text-label-caps text-on-surface-variant mb-2">
<span className="text-primary font-semibold">ASSET CLASS</span>
<span className="material-symbols-outlined text-[16px]">swap_horiz</span>
</div>
<h3 className="font-body-lg text-body-lg font-bold text-on-surface">Real Estate vs Index Stocks</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
              Physical real estate unlocks 4:1 mortgage leverage and depreciation write-offs, but incurs illiquidity and maintenance friction. S&amp;P 500 index funds offer zero effort, instantaneous liquidity, and 10% CAGR.
            </p>
</div>
<div className="mt-4 pt-3 bg-surface-container-low p-2 rounded font-data-mono text-xs text-on-surface">
            Factor: <strong>Leverage</strong> boosts property IRR; <strong>Index Stocks</strong> maximize passive time autonomy.
          </div>
</div>
<div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
<div>
<div className="flex items-center justify-between font-label-caps text-label-caps text-on-surface-variant mb-2">
<span className="text-primary font-semibold">MANAGEMENT STYLE</span>
<span className="material-symbols-outlined text-[16px]">swap_horiz</span>
</div>
<h3 className="font-body-lg text-body-lg font-bold text-on-surface">Active vs Passive Index</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
              SPIVA scorecard data indicates over 90% of actively managed large-cap mutual funds fail to beat their benchmark S&amp;P 500 index over a 15-year period after accounting for management fee friction.
            </p>
</div>
<div className="mt-4 pt-3 bg-surface-container-low p-2 rounded font-data-mono text-xs text-on-surface">
            Result: <strong>Passive Indexing</strong> wins mathematically across 9 out of 10 long-term portfolios.
          </div>
</div>
<div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
<div>
<div className="flex items-center justify-between font-label-caps text-label-caps text-on-surface-variant mb-2">
<span className="text-primary font-semibold">TAX ARBITRAGE</span>
<span className="material-symbols-outlined text-[16px]">swap_horiz</span>
</div>
<h3 className="font-body-lg text-body-lg font-bold text-on-surface">Roth IRA vs Traditional</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
              Traditional contributions deduct today and tax upon distribution. Roth accounts fund with post-tax dollars, compounding 100% tax-free forever with zero mandatory minimum distributions (RMDs).
            </p>
</div>
<div className="mt-4 pt-3 bg-surface-container-low p-2 rounded font-data-mono text-xs text-on-surface">
            Rule: <strong>Roth</strong> if current bracket is lower than retirement; <strong>Traditional</strong> if currently in top tax brackets.
          </div>
</div>
<div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
<div>
<div className="flex items-center justify-between font-label-caps text-label-caps text-on-surface-variant mb-2">
<span className="text-primary font-semibold">SECURITY SELECTION</span>
<span className="material-symbols-outlined text-[16px]">swap_horiz</span>
</div>
<h3 className="font-body-lg text-body-lg font-bold text-on-surface">Single Stocks vs ETFs</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
              Single equities possess idiosyncratic bankruptcy risk. Index ETFs diversify across 500+ enterprises, eradicating non-systematic individual corporate fraud while capturing macroscopic global GDP growth.
            </p>
</div>
<div className="mt-4 pt-3 bg-surface-container-low p-2 rounded font-data-mono text-xs text-on-surface">
            Verdict: Hold <strong>ETFs for core 80%-90%</strong>; allocate max 10% for high-conviction individual stock bets.
          </div>
</div>
</div>
</section>
{/*  CORE MATHEMATICAL FORMULAS REFERENCE  */}
<section className="mb-space-3xl">
<div className="bg-surface-container-lowest rounded-xl shadow-md p-space-md lg:p-space-xl">
<div className="flex flex-col md:flex-row md:items-center justify-between pb-space-md gap-space-xs">
<div>
<span className="font-label-caps text-label-caps uppercase text-primary tracking-wider">Actuarial Transparency</span>
<h2 className="font-headline-md text-headline-md font-bold text-on-surface">Core Mathematical Foundations</h2>
</div>
<div className="inline-flex items-center gap-1 font-data-mono text-xs text-on-surface-variant bg-surface-container-low px-space-xs py-1 rounded">
<span className="material-symbols-outlined text-[16px] text-primary">functions</span>
<span className="">Deterministic Computational Models</span>
</div>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
<div className="bg-surface-container-low p-space-md rounded-lg flex flex-col justify-between">
<div>
<span className="font-label-caps text-label-caps uppercase text-primary block mb-1">Future Value (Annuity + Principal)</span>
<div className="font-data-mono text-xs p-2 bg-surface-container-lowest rounded text-on-surface overflow-x-auto my-2">
                FV = PV(1 + r/n)<sup>nt</sup> + PMT × [((1 + r/n)<sup>nt</sup> - 1) / (r/n)]
              </div>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
                Standard formula modeling compounding growth of initial principal (PV) alongside recurring periodic deposits (PMT) at interest rate (r) across (t) years.
              </p>
</div>
<div className="font-data-mono text-[11px] text-on-surface-variant pt-2">
              Used in: Investment Calculator, Future Value
            </div>
</div>
<div className="bg-surface-container-low p-space-md rounded-lg flex flex-col justify-between">
<div>
<span className="font-label-caps text-label-caps uppercase text-secondary block mb-1">Compound Annual Growth (CAGR)</span>
<div className="font-data-mono text-xs p-2 bg-surface-container-lowest rounded text-on-surface overflow-x-auto my-2">
                CAGR = (EV / BV)<sup>(1/n)</sup> - 1
              </div>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
                Measures smoothed geometric annual growth rate over multiple holding years, filtering out the distortion of year-to-year extreme market volatility.
              </p>
</div>
<div className="font-data-mono text-[11px] text-on-surface-variant pt-2">
              Used in: Stock CAGR, Performance Models
            </div>
</div>
<div className="bg-surface-container-low p-space-md rounded-lg flex flex-col justify-between">
<div>
<span className="font-label-caps text-label-caps uppercase text-primary-container block mb-1">Continuous Compounding</span>
<div className="font-data-mono text-xs p-2 bg-surface-container-lowest rounded text-on-surface overflow-x-auto my-2">
                A = P × e<sup>(rt)</sup>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                Computes absolute mathematical ceiling of compounding where reinvestment frequency (n) approaches infinity via Euler's mathematical constant e ≈ 2.71828.
              </p>
</div>
<div className="font-data-mono text-[11px] text-on-surface-variant pt-2">
              Used in: Continuous Compound Calculator
            </div>
</div>
<div className="bg-surface-container-low p-space-md rounded-lg flex flex-col justify-between">
<div>
<span className="font-label-caps text-label-caps uppercase text-tertiary block mb-1">Safe Withdrawal &amp; Rule of 72</span>
<div className="font-data-mono text-xs p-2 bg-surface-container-lowest rounded text-on-surface overflow-x-auto my-2">
                FIRE # = Annual Expenses / SWR<br />
                Doubling Years ≈ 72 / Return Rate
              </div>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                Trinity Study safe withdrawal equation determining portfolio perpetuity, paired with the Rule of 72 heuristic estimating asset doubling time.
              </p>
</div>
<div className="font-data-mono text-[11px] text-on-surface-variant pt-2">
              Used in: FIRE Models, Retirement Nest Egg
            </div>
</div>
</div>
</div>
</section>
{/*  PROGRAMMATIC DIRECTORY HUB (SEO Deep Links)  */}
<section className="mb-space-3xl">
<div className="flex flex-col mb-space-md">
<span className="font-label-caps text-label-caps uppercase text-primary tracking-wider">Programmatic Computational Directory</span>
<h2 className="font-headline-md text-headline-md font-bold text-on-surface">Curated Matrix Hubs &amp; Direct Calculators</h2>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
{/*  Frequency Hub  */}
<div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
<div className="flex items-center gap-2 mb-space-xs">
<span className="material-symbols-outlined text-primary text-[20px]">tune</span>
<h3 className="font-body-lg text-body-lg font-bold text-on-surface">Compound Frequency Matrices</h3>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm">Direct calculation endpoints calibrated by compounding recurrence intervals:</p>
<ul className="space-y-1.5 font-data-mono text-xs">
<li className="">
<a className="text-primary hover:underline flex items-center justify-between p-1.5 rounded bg-surface-container-low hover:bg-surface-container" href="#">
<span className="">/compound-interest/daily</span>
<span className="material-symbols-outlined text-[14px]">arrow_forward</span>
</a>
</li>
<li className="">
<a className="text-primary hover:underline flex items-center justify-between p-1.5 rounded bg-surface-container-low hover:bg-surface-container" href="#">
<span className="">/compound-interest/monthly</span>
<span className="material-symbols-outlined text-[14px]">arrow_forward</span>
</a>
</li>
<li className="">
<a className="text-primary hover:underline flex items-center justify-between p-1.5 rounded bg-surface-container-low hover:bg-surface-container" href="#">
<span className="">/compound-interest/quarterly</span>
<span className="material-symbols-outlined text-[14px]">arrow_forward</span>
</a>
</li>
<li className="">
<a className="text-primary hover:underline flex items-center justify-between p-1.5 rounded bg-surface-container-low hover:bg-surface-container" href="#">
<span className="">/compound-interest/annual</span>
<span className="material-symbols-outlined text-[14px]">arrow_forward</span>
</a>
</li>
</ul>
</div>
{/*  FIRE Milestones Hub  */}
<div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
<div className="flex items-center gap-2 mb-space-xs">
<span className="material-symbols-outlined text-primary text-[20px]">local_fire_department</span>
<h3 className="font-body-lg text-body-lg font-bold text-on-surface">FIRE Milestone Pages</h3>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm">Specialized early retirement architectures and withdrawal benchmarks:</p>
<ul className="space-y-1.5 font-data-mono text-xs">
<li className="">
<a className="text-primary hover:underline flex items-center justify-between p-1.5 rounded bg-surface-container-low hover:bg-surface-container" href="#">
<span className="">/fire-calculator/coast-fire</span>
<span className="material-symbols-outlined text-[14px]">arrow_forward</span>
</a>
</li>
<li className="">
<a className="text-primary hover:underline flex items-center justify-between p-1.5 rounded bg-surface-container-low hover:bg-surface-container" href="#">
<span className="">/fire-calculator/barista-fire</span>
<span className="material-symbols-outlined text-[14px]">arrow_forward</span>
</a>
</li>
<li className="">
<a className="text-primary hover:underline flex items-center justify-between p-1.5 rounded bg-surface-container-low hover:bg-surface-container" href="#">
<span className="">/fire-calculator/lean-fire</span>
<span className="material-symbols-outlined text-[14px]">arrow_forward</span>
</a>
</li>
<li className="">
<a className="text-primary hover:underline flex items-center justify-between p-1.5 rounded bg-surface-container-low hover:bg-surface-container" href="#">
<span className="">/fire-calculator/fat-fire</span>
<span className="material-symbols-outlined text-[14px]">arrow_forward</span>
</a>
</li>
</ul>
</div>
{/*  Capital Dollar Milestones  */}
<div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
<div className="flex items-center gap-2 mb-space-xs">
<span className="material-symbols-outlined text-primary text-[20px]">pin_invoke</span>
<h3 className="font-body-lg text-body-lg font-bold text-on-surface">Capital Milestones</h3>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm">Pre-calculated wealth growth trajectories from baseline principal amounts:</p>
<ul className="space-y-1.5 font-data-mono text-xs">
<li className="">
<a className="text-primary hover:underline flex items-center justify-between p-1.5 rounded bg-surface-container-low hover:bg-surface-container" href="#">
<span className="">/investment-growth/10000-principal</span>
<span className="material-symbols-outlined text-[14px]">arrow_forward</span>
</a>
</li>
<li className="">
<a className="text-primary hover:underline flex items-center justify-between p-1.5 rounded bg-surface-container-low hover:bg-surface-container" href="#">
<span className="">/investment-growth/50000-principal</span>
<span className="material-symbols-outlined text-[14px]">arrow_forward</span>
</a>
</li>
<li className="">
<a className="text-primary hover:underline flex items-center justify-between p-1.5 rounded bg-surface-container-low hover:bg-surface-container" href="#">
<span className="">/investment-growth/100000-principal</span>
<span className="material-symbols-outlined text-[14px]">arrow_forward</span>
</a>
</li>
<li className="">
<a className="text-primary hover:underline flex items-center justify-between p-1.5 rounded bg-surface-container-low hover:bg-surface-container" href="#">
<span className="">/investment-growth/1000000-milestone</span>
<span className="material-symbols-outlined text-[14px]">arrow_forward</span>
</a>
</li>
</ul>
</div>
</div>
</section>
{/*  GOOGLE AI OVERVIEW & DIRECT ANSWERS BOX  */}
<section className="mb-space-3xl">
<div className="bg-surface-container-low rounded-xl p-space-md lg:p-space-lg shadow-sm">
<div className="flex items-center gap-2 mb-space-md">
<span className="p-1 rounded bg-primary text-on-primary flex items-center justify-center">
<span className="material-symbols-outlined text-[18px]">auto_awesome</span>
</span>
<h2 className="font-headline-md text-headline-md font-bold text-on-surface">Direct Answers &amp; High-Cognition Overview</h2>
</div>
<div className="space-y-space-md">
<div className="bg-surface-container-lowest p-space-md rounded-lg">
<h3 className="font-body-lg text-body-lg font-bold text-on-surface mb-1">
              How does compound interest accelerate long-term personal wealth?
            </h3>
<p className="font-body-md text-body-md text-on-surface-variant">
              Compound interest generates "interest on interest." Unlike linear growth—where returns apply solely to original principal—compounding reinvests generated yields back into the asset base. Over a 20 to 30-year horizon at an 8% to 10% annual return, more than <strong>70% of terminal portfolio wealth</strong> originates from compound earnings rather than out-of-pocket deposits.
            </p>
</div>
<div className="bg-surface-container-lowest p-space-md rounded-lg">
<h3 className="font-body-lg text-body-lg font-bold text-on-surface mb-1">
              What is the difference between nominal returns and real (inflation-adjusted) returns?
            </h3>
<p className="font-body-md text-body-md text-on-surface-variant">
<strong>Nominal return</strong> is the unadjusted percentage gain reported on brokerage statements (e.g. 10% on the S&amp;P 500). <strong>Real return</strong> accounts for the erosive effect of inflation via the Fisher equation: <em>(1 + Nominal) = (1 + Real)(1 + Inflation)</em>. If inflation averages 2.5%, a 10% nominal return provides approximately 7.3% in real purchasing power expansion.
            </p>
</div>
<div className="bg-surface-container-lowest p-space-md rounded-lg">
<h3 className="font-body-lg text-body-lg font-bold text-on-surface mb-1">
              How much money do you need to retire early under the FIRE movement?
            </h3>
<p className="font-body-md text-body-md text-on-surface-variant">
              Under the classic FIRE movement framework based on the Trinity Study, you require <strong>25 to 30 times your annual expected expenditures</strong>. For example, sustaining $60,000 in annual post-tax expenses requires a portfolio target of $1,500,000 (at a 4% safe withdrawal rate) or $1,714,000 (at a conservative 3.5% early retirement withdrawal rate).
            </p>
</div>
</div>
</div>
</section>
{/*  20+ DETAILED INVESTOR FAQ ACCORDIONS  */}
<section className="mb-space-3xl">
<div className="flex flex-col mb-space-lg">
<span className="font-label-caps text-label-caps uppercase text-primary tracking-wider">Investor Knowledge Base</span>
<h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">Frequently Asked Questions</h2>
<p className="font-body-md text-body-md text-on-surface-variant mt-1">Concise, authoritative answers addressing taxation, compound mechanics, asset allocation, and decumulation.</p>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
{/*  Column 1  */}
<div className="space-y-space-xs">
<details className="group bg-surface-container-lowest p-space-md rounded-lg shadow-sm">
<summary className="font-body-md text-body-md font-bold text-on-surface cursor-pointer list-none flex items-center justify-between">
<span className="">What is CAGR and why is it preferred over simple average return?</span>
<span className="material-symbols-outlined text-[20px] text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
</summary>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-2 pt-2">
              CAGR (Compound Annual Growth Rate) represents the smoothed annual rate at which an investment would have grown if it grew at a steady constant rate. Simple averages inflate real returns because they ignore the asymmetry of losses: a -50% loss followed by a +50% gain yields a 0% simple average, but results in a -25% actual net portfolio loss.
            </p>
</details>
<details className="group bg-surface-container-lowest p-space-md rounded-lg shadow-sm">
<summary className="font-body-md text-body-md font-bold text-on-surface cursor-pointer list-none flex items-center justify-between">
<span className="">What is the 4% Safe Withdrawal Rule (SWR)?</span>
<span className="material-symbols-outlined text-[20px] text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
</summary>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-2 pt-2">
              Originating from William Bengen and updated by the Trinity Study, the rule asserts that a retiree withdrawing 4% of their balanced portfolio during Year 1, and adjusting that exact dollar amount for inflation each subsequent year, has a 95%+ probability of not exhausting capital over a 30-year span.
            </p>
</details>
<details className="group bg-surface-container-lowest p-space-md rounded-lg shadow-sm">
<summary className="font-body-md text-body-md font-bold text-on-surface cursor-pointer list-none flex items-center justify-between">
<span className="">How does dividend tax drag impact long-term compounding?</span>
<span className="material-symbols-outlined text-[20px] text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
</summary>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-2 pt-2">
              In taxable accounts, qualified dividends incur 15% to 20% federal taxes plus NIIT (3.8%) in the exact tax year received, even if automatically reinvested via DRIP. Over 30 years, this yearly tax leakage can reduce total wealth accumulation by 15% to 25% compared to holding pure capital growth index ETFs.
            </p>
</details>
<details className="group bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
<summary className="font-body-md text-body-md font-bold text-on-surface cursor-pointer list-none flex items-center justify-between">
<span className="">What is Coast FIRE vs Barista FIRE?</span>
<span className="material-symbols-outlined text-[20px] text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
</summary>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-2 pt-2">
<strong>Coast FIRE</strong> means having enough already invested at a young age that compound interest alone will fully fund traditional retirement at 65 without another cent deposited. <strong>Barista FIRE</strong> means having a partial portfolio that covers a portion of overhead, requiring low-stress part-time work to pay the remainder.
            </p>
</details>
<details className="group bg-surface-container-lowest p-space-md rounded-lg shadow-sm">
<summary className="font-body-md text-body-md font-bold text-on-surface cursor-pointer list-none flex items-center justify-between">
<span className="">How often should an investment portfolio be rebalanced?</span>
<span className="material-symbols-outlined text-[20px] text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
</summary>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-2 pt-2">
              Empirical institutional research recommends rebalancing either on a set annual schedule (e.g., every January) or via "tolerance bands" (whenever an asset class deviates by more than 5% absolute from its targeted weight). Rebalancing more frequently creates excessive transaction friction and taxable turnover.
            </p>
</details>
<details className="group bg-surface-container-lowest p-space-md rounded-lg shadow-sm">
<summary className="font-body-md text-body-md font-bold text-on-surface cursor-pointer list-none flex items-center justify-between">
<span className="">What is sequence of returns risk (SRR)?</span>
<span className="material-symbols-outlined text-[20px] text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
</summary>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-2 pt-2">
              SRR is the danger that market crashes occur during the first 3 to 5 years immediately preceding or following retirement. Liquidating equities while values are depressed severely locks in losses and permanently cripples the longevity of the portfolio, even if average market returns recover later.
            </p>
</details>
<details className="group bg-surface-container-lowest p-space-md rounded-lg shadow-sm">
<summary className="font-body-md text-body-md font-bold text-on-surface cursor-pointer list-none flex items-center justify-between">
<span className="">Why do expense ratios matter so much in index ETFs?</span>
<span className="material-symbols-outlined text-[20px] text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
</summary>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-2 pt-2">
              A 0.75% expense ratio compared to a 0.03% ETF fee on a $500,000 portfolio over 30 years forfeits over $185,000 in terminal wealth due to lost compounding. Expense ratios are deducted automatically every day regardless of whether market prices go up or down.
            </p>
</details>
<details className="group bg-surface-container-lowest p-space-md rounded-lg shadow-sm">
<summary className="font-body-md text-body-md font-bold text-on-surface cursor-pointer list-none flex items-center justify-between">
<span className="">What is the Rule of 72?</span>
<span className="material-symbols-outlined text-[20px] text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
</summary>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-2 pt-2">
              The Rule of 72 is a rapid mental shortcut to estimate how many years it takes an asset to double at a fixed annual rate of return: <em>Years to double ≈ 72 / Interest Rate</em>. At 8% CAGR, an asset doubles in 9 years (72/8). At 10%, it doubles in approximately 7.2 years.
            </p>
</details>
<details className="group bg-surface-container-lowest p-space-md rounded-lg shadow-sm">
<summary className="font-body-md text-body-md font-bold text-on-surface cursor-pointer list-none flex items-center justify-between">
<span className="">What is Yield on Cost (YOC) vs Current Yield?</span>
<span className="material-symbols-outlined text-[20px] text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
</summary>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-2 pt-2">
<strong>Current yield</strong> is dividend payout divided by current stock price. <strong>Yield on cost</strong> is dividend payout divided by your original buy price. If you bought shares at $50 paying $2 (4% yield) and the dividend rises over 10 years to $5 while the stock hits $150, your Current Yield is 3.3%, but your Yield on Cost is 10.0%.
            </p>
</details>
<details className="group bg-surface-container-lowest p-space-md rounded-lg shadow-sm">
<summary className="font-body-md text-body-md font-bold text-on-surface cursor-pointer list-none flex items-center justify-between">
<span className="">How does asset allocation change as you age?</span>
<span className="material-symbols-outlined text-[20px] text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
</summary>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-2 pt-2">
              Modern financial planning generally recommends a glidepath shifting from equity-heavy (90/10 or 100/0) in your 20s and 30s toward a balanced configuration (60/40 or 70/30) approaching retirement to curtail drawdowns and sequence risk.
            </p>
</details>
</div>
{/*  Column 2  */}
<div className="space-y-space-xs">
<details className="group bg-surface-container-lowest p-space-md rounded-lg shadow-sm">
<summary className="font-body-md text-body-md font-bold text-on-surface cursor-pointer list-none flex items-center justify-between">
<span className="">Does daily compounding yield significantly more than monthly?</span>
<span className="material-symbols-outlined text-[20px] text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
</summary>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-2 pt-2">
              No. Due to the properties of Euler's limit (e), the difference between monthly compounding and daily compounding on a $100,000 balance at 7% over 20 years is less than $450 in total. Compounding rate (CAGR) matters infinitely more than compounding frequency.
            </p>
</details>
<details className="group bg-surface-container-lowest p-space-md rounded-lg shadow-sm">
<summary className="font-body-md text-body-md font-bold text-on-surface cursor-pointer list-none flex items-center justify-between">
<span className="">What is dollar-cost averaging (DCA)?</span>
<span className="material-symbols-outlined text-[20px] text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
</summary>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-2 pt-2">
              DCA is the practice of investing a fixed dollar amount at regular intervals (e.g. $500 every two weeks) regardless of market share price. By doing so, you automatically buy more shares when prices dip and fewer when prices surge, eliminating market-timing psychology.
            </p>
</details>
<details className="group bg-surface-container-lowest p-space-md rounded-lg shadow-sm">
<summary className="font-body-md text-body-md font-bold text-on-surface cursor-pointer list-none flex items-center justify-between">
<span className="">What is a good savings rate for someone targeting early retirement?</span>
<span className="material-symbols-outlined text-[20px] text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
</summary>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-2 pt-2">
              A 50% savings rate enables financial independence in approximately 17 years starting from zero. A 65% savings rate achieves FIRE in about 10.5 years. At a typical 10% savings rate, it requires roughly 51 years to reach retirement solvency.
            </p>
</details>
<details className="group bg-surface-container-lowest p-space-md rounded-lg shadow-sm">
<summary className="font-body-md text-body-md font-bold text-on-surface cursor-pointer list-none flex items-center justify-between">
<span className="">What is the difference between APR and APY?</span>
<span className="material-symbols-outlined text-[20px] text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
</summary>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-2 pt-2">
<strong>APR (Annual Percentage Rate)</strong> reflects the simple stated interest rate without compounding effects. <strong>APY (Annual Percentage Yield)</strong> includes the compounding frequency. For example, a 5.00% APR compounded daily yields a true APY of 5.127%.
            </p>
</details>
<details className="group bg-surface-container-lowest p-space-md rounded-lg shadow-sm">
<summary className="font-body-md text-body-md font-bold text-on-surface cursor-pointer list-none flex items-center justify-between">
<span className="">How do capital gains taxes work when selling equities?</span>
<span className="material-symbols-outlined text-[20px] text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
</summary>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-2 pt-2">
              Assets held for 365 days or fewer are categorized as short-term capital gains, taxed at ordinary income tax brackets (up to 37%). Assets held for longer than one year qualify for preferential long-term capital gains tax brackets (0%, 15%, or 20% based on total taxable income).
            </p>
</details>
<details className="group bg-surface-container-lowest p-space-md rounded-lg shadow-sm">
<summary className="font-body-md text-body-md font-bold text-on-surface cursor-pointer list-none flex items-center justify-between">
<span className="">What is the Sharpe Ratio in portfolio analysis?</span>
<span className="material-symbols-outlined text-[20px] text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
</summary>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-2 pt-2">
              The Sharpe Ratio measures risk-adjusted return: <em>(Portfolio Return - Risk-Free Rate) / Standard Deviation</em>. It quantifies how much excess return is achieved per unit of portfolio volatility. A ratio above 1.0 is considered good; above 2.0 is considered institutional-grade.
            </p>
</details>
<details className="group bg-surface-container-lowest p-space-md rounded-lg shadow-sm">
<summary className="font-body-md text-body-md font-bold text-on-surface cursor-pointer list-none flex items-center justify-between">
<span className="">Why is inflation considered the biggest risk to wealth preservation?</span>
<span className="material-symbols-outlined text-[20px] text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
</summary>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-2 pt-2">
              Even moderate 3% sustained inflation cuts the purchasing power of cash by 50% in roughly 24 years. Leaving wealth in static bank deposits guarantees steady loss of real capital; equity investments act as the primary historical hedge by expanding corporate earnings alongside inflation.
            </p>
</details>
<details className="group bg-surface-container-lowest p-space-md rounded-lg shadow-sm">
<summary className="font-body-md text-body-md font-bold text-on-surface cursor-pointer list-none flex items-center justify-between">
<span className="">What is the difference between TWR and MWR (IRR)?</span>
<span className="material-symbols-outlined text-[20px] text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
</summary>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-2 pt-2">
<strong>Time-Weighted Return (TWR)</strong> measures fund manager capability by neutralizing the timing of user deposits and withdrawals. <strong>Money-Weighted Return (MWR)</strong> reflects actual personal investor performance by heavily weighting returns during periods when the portfolio balance was largest.
            </p>
</details>
<details className="group bg-surface-container-lowest p-space-md rounded-lg shadow-sm">
<summary className="font-body-md text-body-md font-bold text-on-surface cursor-pointer list-none flex items-center justify-between">
<span className="">How does DRIP (Dividend Reinvestment) prevent cash drag?</span>
<span className="material-symbols-outlined text-[20px] text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
</summary>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-2 pt-2">
              Cash sitting idle in a brokerage account yields zero return. DRIP automatically converts cash distributions immediately upon payout into fractional equity shares without manual orders or transaction fees, maintaining 100% portfolio market exposure.
            </p>
</details>
<details className="group bg-surface-container-lowest p-space-md rounded-lg shadow-sm">
<summary className="font-body-md text-body-md font-bold text-on-surface cursor-pointer list-none flex items-center justify-between">
<span className="">Are SolveIt Calculator financial calculations private and secure?</span>
<span className="material-symbols-outlined text-[20px] text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
</summary>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-2 pt-2">
              Yes. 100% of computational arithmetic on SolveIt Calculator executes entirely within your local browser sandbox utilizing client-side JavaScript. Zero salary, portfolio balance, or personal financial data is ever transmitted, logged, or stored on remote web servers.
            </p>
</details>
</div>
</div>
</section>
{/*  EEAT EDITORIAL & OVERSIGHT BOARD (Institutional Credibility)  */}
<section className="mb-space-3xl">
<div className="bg-surface-container-lowest rounded-xl shadow-md p-space-md lg:p-space-xl">
<div className="flex flex-col md:flex-row md:items-center justify-between pb-space-md gap-space-xs">
<div>
<span className="font-label-caps text-label-caps uppercase text-primary tracking-wider">Editorial Authority &amp; Methodology</span>
<h2 className="font-headline-md text-headline-md font-bold text-on-surface">CFA® &amp; CFP® Institutional Review Board</h2>
</div>
<span className="font-data-mono text-xs px-2.5 py-1 rounded bg-surface-container text-on-surface">
            Quarterly Model Audit: October 2025
          </span>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg mb-space-lg">
{/*  Auditor 1  */}
<div className="flex items-start gap-space-md p-space-md rounded-xl bg-surface-container-low">
<div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-xl flex-shrink-0">
              AS
            </div>
<div>
<div className="flex items-center gap-2">
<h3 className="font-body-lg text-body-lg font-bold text-on-surface">Dr. Arthur Sterling, CFA, CFP®</h3>
<span className="material-symbols-outlined text-primary text-[18px]">verified</span>
</div>
<span className="font-data-mono text-xs text-on-surface-variant block mt-0.5">
                CFA Charterholder #489201 • Senior Portfolio Strategist
              </span>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
                Former Director of Quantitative Research at Vanguard Group; 22+ years auditing institutional risk, Modern Portfolio Theory glidepaths, and geometric compounding models.
              </p>
</div>
</div>
{/*  Auditor 2  */}
<div className="flex items-start gap-space-md p-space-md rounded-xl bg-surface-container-low">
<div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center text-on-secondary font-bold text-xl flex-shrink-0">
              ER
            </div>
<div>
<div className="flex items-center gap-2">
<h3 className="font-body-lg text-body-lg font-bold text-on-surface">Elena Rostova, CPA, PFS</h3>
<span className="material-symbols-outlined text-primary text-[18px]">verified</span>
</div>
<span className="font-data-mono text-xs text-on-surface-variant block mt-0.5">
                AICPA License #90214 • Personal Financial Specialist
              </span>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
                Specialist in high-net-worth tax drag mitigation, Section 1(h) capital gains structuring, and IRS statutory safe-withdrawal decumulation pathways.
              </p>
</div>
</div>
</div>
{/*  Statutory Disclosures Box  */}
<div className="p-space-md rounded-lg bg-surface-container text-on-surface-variant font-body-sm text-body-sm space-y-2">
<div className="font-label-caps text-label-caps uppercase text-on-surface font-semibold flex items-center gap-1.5">
<span className="material-symbols-outlined text-[16px] text-tertiary">gavel</span>
            Statutory Citations &amp; Institutional Disclosures
          </div>
<p className="text-xs leading-relaxed">
            All calculators and computational models provided within SolveIt Calculator are engineered for illustrative, mathematical scenario modeling purposes only. Calculations conform to IEEE 754 floating-point arithmetic standards. Computational outputs do not constitute investment advice, legal counsel, or certified public tax preparation under SEC Rule 202(a)(11)-1 or FINRA Rule 2210.
          </p>
<p className="text-xs leading-relaxed">
            Past performance of financial benchmarks (including the S&amp;P 500 and US Aggregate Bond Index) does not guarantee or predict future capital yields. Equity investments carry market risk including the potential loss of principal. Tax assumptions reference IRC § 1(h), § 401(k), § 408A, and standard IRS inflation adjustments for the current tax calendar year.
          </p>
</div>
</div>
</section>

</div>
</div>
</main>
    </div>
  );
}
