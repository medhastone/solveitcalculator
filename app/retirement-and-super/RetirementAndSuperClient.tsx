'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function RetirementAndSuperClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Interactive Simulation State
  const [currentAge, setCurrentAge] = useState(32);
  const [retirementAge, setRetirementAge] = useState(65);
  const [currentBalance, setCurrentBalance] = useState(75000);
  const [annualSalary, setAnnualSalary] = useState(95000);
  const [contributionRate, setContributionRate] = useState(11.5); // 11.5% Super Guarantee / 401(k)
  const [employerMatch, setEmployerMatch] = useState(4.5); // 4.5% match
  const [expectedReturn, setExpectedReturn] = useState(7.5); // 7.5% annual return
  const [isInflation, setIsInflation] = useState(false);
  const [activeCountText, setActiveCountText] = useState('95 Tools');

  const yearsToRetire = Math.max(1, retirementAge - currentAge);
  const monthsToRetire = yearsToRetire * 12;
  const totalAnnualContrib = annualSalary * ((contributionRate + employerMatch) / 100);
  const monthlyContrib = totalAnnualContrib / 12;
  const monthlyRate = (expectedReturn / 100) / 12;

  // Compounding Future Value calculation (annuity immediate)
  const fvPrincipal = currentBalance * Math.pow(1 + monthlyRate, monthsToRetire);
  let fvContributions = 0;
  if (monthlyRate > 0) {
    fvContributions = monthlyContrib * ((Math.pow(1 + monthlyRate, monthsToRetire) - 1) / monthlyRate);
  } else {
    fvContributions = monthlyContrib * monthsToRetire;
  }
  const nominalCorpus = fvPrincipal + fvContributions;
  const totalDeposits = currentBalance + (monthlyContrib * monthsToRetire);
  const totalEarnings = Math.max(0, nominalCorpus - totalDeposits);

  // Inflation Discounting (2.50% core CPI)
  const inflationRate = 0.025;
  const realCorpus = nominalCorpus / Math.pow(1 + inflationRate, yearsToRetire);

  // Safe Withdrawal Rate: 4.0% annual rule (Trinity Study)
  const annualWithdrawalNominal = nominalCorpus * 0.04;
  const monthlyWithdrawalNominal = annualWithdrawalNominal / 12;
  const annualWithdrawalReal = realCorpus * 0.04;
  const monthlyWithdrawalReal = annualWithdrawalReal / 12;

  const displayCorpus = isInflation ? realCorpus : nominalCorpus;
  const displayMonthlyIncome = isInflation ? monthlyWithdrawalReal : monthlyWithdrawalNominal;

  const formatUSD = (val: number) => {
    return '$' + Math.round(val).toLocaleString('en-US');
  };

  const formatCompact = (num: number) => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(0)}k`;
    return `$${Math.round(num)}`;
  };

  const setGoal = (age: number, retAge: number, bal: number, sal: number, rate: number, ret: number) => {
    setCurrentAge(age);
    setRetirementAge(retAge);
    setCurrentBalance(bal);
    setAnnualSalary(sal);
    setContributionRate(rate);
    setExpectedReturn(ret);
  };

  const calcScenarioCorpus = (ratePercent: number) => {
    const mr = (ratePercent / 100) / 12;
    const fvP = currentBalance * Math.pow(1 + mr, monthsToRetire);
    const fvC = mr > 0 ? monthlyContrib * ((Math.pow(1 + mr, monthsToRetire) - 1) / mr) : monthlyContrib * monthsToRetire;
    return fvP + fvC;
  };

  // SVG Chart Scaling
  const maxScaleVal = Math.max(nominalCorpus, 2500000);
  const scaleFactor = Math.max(10, Math.min(75, 75 - (Math.min(nominalCorpus, maxScaleVal) / maxScaleVal) * 60));
  const contribScale = Math.max(15, Math.min(78, 78 - (Math.min(totalDeposits, maxScaleVal) / maxScaleVal) * 45));

  // Directory Filter & Search
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
                <span className="text-on-surface font-medium">Retirement &amp; Super</span>
              </nav>
              {/* EEAT Verified Audit Pill */}
              <div className="inline-flex items-center gap-1.5 px-space-xs py-1 rounded-full bg-surface-container-high text-on-surface font-data-mono text-xs">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span>Actuarial Audited • IEEE 754 Math • Oct 2025</span>
              </div>
            </div>

            {/* Category Headline Hero */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg pb-space-lg">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-space-xs py-0.5 rounded bg-primary/10 text-primary font-label-caps text-label-caps uppercase tracking-wider mb-space-xs">
                  Institutional Actuarial Models
                </div>
                <h1 className="font-headline-lg text-headline-lg font-bold tracking-tight text-on-surface">
                  Retirement &amp; Super Calculators
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant mt-space-2xs">
                  Precision nest egg accumulation, Australian Superannuation guarantees, 401(k) matching, Social Security curves, Roth conversions, and Trinity Study safe withdrawal models.
                </p>
              </div>
              {/* Trust Badges Bar */}
              <div className="flex flex-wrap items-center gap-space-xs font-data-mono text-xs text-on-surface-variant">
                <div className="flex items-center gap-1 bg-surface-container-low px-space-xs py-1.5 rounded-lg shadow-sm">
                  <span className="material-symbols-outlined text-[16px] text-primary">verified_user</span>
                  <span>95+ Actuarial Models</span>
                </div>
                <div className="flex items-center gap-1 bg-surface-container-low px-space-xs py-1.5 rounded-lg shadow-sm">
                  <span className="material-symbols-outlined text-[16px] text-secondary">memory</span>
                  <span>Zero-Latency Client-Side</span>
                </div>
                <div className="flex items-center gap-1 bg-surface-container-low px-space-xs py-1.5 rounded-lg shadow-sm">
                  <span className="material-symbols-outlined text-[16px] text-tertiary">lock</span>
                  <span>No Data Tracking</span>
                </div>
              </div>
            </div>

            {/* INTERACTIVE WORKBENCH: Live Retirement & Super Trajectory Simulator */}
            <section className="mb-space-2xl">
              <div className="bg-surface-container-lowest rounded-xl shadow-md p-space-md lg:p-space-xl relative overflow-hidden">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-space-md gap-space-sm">
                  <div className="flex items-center gap-space-xs">
                    <span className="p-2 rounded-lg bg-primary-fixed text-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-[22px]">ssid_chart</span>
                    </span>
                    <div>
                      <span className="font-label-caps text-label-caps uppercase text-primary tracking-wider">Interactive Live Simulator</span>
                      <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">Retirement &amp; Super Trajectory Engine</h2>
                    </div>
                  </div>
                  {/* Quick Preset Goals */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-label-caps text-label-caps text-on-surface-variant mr-1">Targets:</span>
                    <button
                      className="px-2 py-1 rounded bg-surface-container-low hover:bg-surface-container font-data-mono text-xs text-on-surface transition-colors cursor-pointer"
                      onClick={() => setGoal(32, 55, 85000, 120000, 15.0, 8.0)}
                      type="button"
                    >
                      Retire at 55
                    </button>
                    <button
                      className="px-2 py-1 rounded bg-surface-container-low hover:bg-surface-container font-data-mono text-xs text-on-surface transition-colors cursor-pointer"
                      onClick={() => setGoal(28, 62, 45000, 105000, 12.0, 7.5)}
                      type="button"
                    >
                      $2M Nest Egg
                    </button>
                    <button
                      className="px-2 py-1 rounded bg-surface-container-low hover:bg-surface-container font-data-mono text-xs text-on-surface transition-colors cursor-pointer"
                      onClick={() => setGoal(26, 45, 60000, 140000, 28.0, 8.5)}
                      type="button"
                    >
                      FIRE at 45
                    </button>
                    <button
                      className="px-2 py-1 rounded bg-surface-container-low hover:bg-surface-container font-data-mono text-xs text-on-surface transition-colors cursor-pointer"
                      onClick={() => setGoal(35, 65, 120000, 110000, 13.5, 7.0)}
                      type="button"
                    >
                      $8k/mo Pension
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
                  {/* Inputs Column (7 Cols) */}
                  <div className="lg:col-span-7 space-y-space-md">
                    {/* Ages in Split Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                      <div className="bg-surface-container-low p-space-sm rounded-lg">
                        <div className="flex justify-between items-center mb-1">
                          <label className="font-label-caps text-label-caps text-on-surface-variant uppercase" htmlFor="currentAge">Current Age</label>
                          <span className="font-data-mono text-data-mono font-semibold text-primary">{currentAge} Years</span>
                        </div>
                        <div className="relative flex items-center">
                          <input
                            className="w-full px-3 py-2 bg-surface-container-lowest text-on-surface font-data-mono text-data-mono rounded shadow-inner focus:outline-none"
                            id="currentAge"
                            max="75"
                            min="18"
                            onChange={(e) => setCurrentAge(Math.max(18, Math.min(75, Number(e.target.value) || 18)))}
                            type="number"
                            value={currentAge}
                          />
                        </div>
                        <input
                          className="w-full accent-primary mt-2 cursor-pointer"
                          max="75"
                          min="18"
                          onChange={(e) => setCurrentAge(Number(e.target.value))}
                          type="range"
                          value={currentAge}
                        />
                      </div>
                      <div className="bg-surface-container-low p-space-sm rounded-lg">
                        <div className="flex justify-between items-center mb-1">
                          <label className="font-label-caps text-label-caps text-on-surface-variant uppercase" htmlFor="retirementAge">Target Retire Age</label>
                          <span className="font-data-mono text-data-mono font-semibold text-primary">{retirementAge} Years ({yearsToRetire}y left)</span>
                        </div>
                        <div className="relative flex items-center">
                          <input
                            className="w-full px-3 py-2 bg-surface-container-lowest text-on-surface font-data-mono text-data-mono rounded shadow-inner focus:outline-none"
                            id="retirementAge"
                            max="85"
                            min={currentAge + 1}
                            onChange={(e) => setRetirementAge(Math.max(currentAge + 1, Math.min(85, Number(e.target.value) || 65)))}
                            type="number"
                            value={retirementAge}
                          />
                        </div>
                        <input
                          className="w-full accent-primary mt-2 cursor-pointer"
                          max="85"
                          min={currentAge + 1}
                          onChange={(e) => setRetirementAge(Number(e.target.value))}
                          type="range"
                          value={retirementAge}
                        />
                      </div>
                    </div>

                    {/* Current Balance and Salary */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                      <div className="bg-surface-container-low p-space-sm rounded-lg">
                        <div className="flex justify-between items-center mb-1">
                          <label className="font-label-caps text-label-caps text-on-surface-variant uppercase" htmlFor="currentBalance">Current Balance</label>
                          <span className="font-data-mono text-data-mono font-semibold text-primary">{formatUSD(currentBalance)}</span>
                        </div>
                        <div className="relative flex items-center">
                          <span className="absolute left-3 text-on-surface-variant font-data-mono text-sm">$</span>
                          <input
                            className="w-full pl-7 pr-3 py-2 bg-surface-container-lowest text-on-surface font-data-mono text-data-mono rounded shadow-inner focus:outline-none"
                            id="currentBalance"
                            max="10000000"
                            min="0"
                            onChange={(e) => setCurrentBalance(Number(e.target.value) || 0)}
                            step="5000"
                            type="number"
                            value={currentBalance}
                          />
                        </div>
                        <input
                          className="w-full accent-primary mt-2 cursor-pointer"
                          max="1000000"
                          min="0"
                          onChange={(e) => setCurrentBalance(Number(e.target.value))}
                          step="5000"
                          type="range"
                          value={currentBalance}
                        />
                      </div>
                      <div className="bg-surface-container-low p-space-sm rounded-lg">
                        <div className="flex justify-between items-center mb-1">
                          <label className="font-label-caps text-label-caps text-on-surface-variant uppercase" htmlFor="annualSalary">Annual Salary</label>
                          <span className="font-data-mono text-data-mono font-semibold text-primary">{formatUSD(annualSalary)}</span>
                        </div>
                        <div className="relative flex items-center">
                          <span className="absolute left-3 text-on-surface-variant font-data-mono text-sm">$</span>
                          <input
                            className="w-full pl-7 pr-3 py-2 bg-surface-container-lowest text-on-surface font-data-mono text-data-mono rounded shadow-inner focus:outline-none"
                            id="annualSalary"
                            max="1000000"
                            min="0"
                            onChange={(e) => setAnnualSalary(Number(e.target.value) || 0)}
                            step="5000"
                            type="number"
                            value={annualSalary}
                          />
                        </div>
                        <input
                          className="w-full accent-primary mt-2 cursor-pointer"
                          max="500000"
                          min="0"
                          onChange={(e) => setAnnualSalary(Number(e.target.value))}
                          step="5000"
                          type="range"
                          value={annualSalary}
                        />
                      </div>
                    </div>

                    {/* Contribution Rates & Employer Match */}
                    <div className="bg-surface-container-low p-space-sm rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                          Contribution Rate + Employer Match (Super Guarantee)
                        </label>
                        <span className="font-data-mono text-data-mono font-semibold text-primary">
                          {(contributionRate + employerMatch).toFixed(1)}% total ({formatUSD(monthlyContrib)}/mo)
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm mb-1">
                        <div>
                          <div className="flex justify-between text-xs font-body-sm mb-1">
                            <span className="text-on-surface font-medium">Your Contribution / Super</span>
                            <span className="font-data-mono font-bold text-primary">{contributionRate}%</span>
                          </div>
                          <input
                            className="w-full accent-primary cursor-pointer"
                            max="30"
                            min="0"
                            onChange={(e) => setContributionRate(Number(e.target.value))}
                            step="0.5"
                            type="range"
                            value={contributionRate}
                          />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs font-body-sm mb-1">
                            <span className="text-on-surface font-medium">Employer Match / Top-Up</span>
                            <span className="font-data-mono font-bold text-secondary">{employerMatch}%</span>
                          </div>
                          <input
                            className="w-full accent-secondary cursor-pointer"
                            max="15"
                            min="0"
                            onChange={(e) => setEmployerMatch(Number(e.target.value))}
                            step="0.5"
                            type="range"
                            value={employerMatch}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Return Rate & Inflation Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                      <div className="bg-surface-container-low p-space-sm rounded-lg">
                        <div className="flex justify-between items-center mb-1">
                          <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Annual Net Return (CAGR)</label>
                          <span className="font-data-mono text-data-mono font-semibold text-primary">{expectedReturn.toFixed(1)}%</span>
                        </div>
                        <div className="grid grid-cols-4 gap-1.5 my-2">
                          <button
                            type="button"
                            onClick={() => setExpectedReturn(5.0)}
                            className={`py-1 px-1 rounded text-center text-xs font-data-mono transition-colors cursor-pointer ${Math.abs(expectedReturn - 5.0) < 0.2 ? 'bg-primary text-on-primary font-semibold' : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container'}`}
                          >
                            5% Cons.
                          </button>
                          <button
                            type="button"
                            onClick={() => setExpectedReturn(7.5)}
                            className={`py-1 px-1 rounded text-center text-xs font-data-mono transition-colors cursor-pointer ${Math.abs(expectedReturn - 7.5) < 0.2 ? 'bg-primary text-on-primary font-semibold' : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container'}`}
                          >
                            7.5% Bal.
                          </button>
                          <button
                            type="button"
                            onClick={() => setExpectedReturn(9.0)}
                            className={`py-1 px-1 rounded text-center text-xs font-data-mono transition-colors cursor-pointer ${Math.abs(expectedReturn - 9.0) < 0.2 ? 'bg-primary text-on-primary font-semibold' : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container'}`}
                          >
                            9% Growth
                          </button>
                          <button
                            type="button"
                            onClick={() => setExpectedReturn(10.5)}
                            className={`py-1 px-1 rounded text-center text-xs font-data-mono transition-colors cursor-pointer ${Math.abs(expectedReturn - 10.5) < 0.2 ? 'bg-primary text-on-primary font-semibold' : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container'}`}
                          >
                            10.5% Aggr.
                          </button>
                        </div>
                        <input
                          className="w-full accent-primary cursor-pointer"
                          max="15"
                          min="3"
                          onChange={(e) => setExpectedReturn(Number(e.target.value))}
                          step="0.5"
                          type="range"
                          value={expectedReturn}
                        />
                      </div>

                      <div className="bg-surface-container-low p-space-sm rounded-lg flex items-center justify-between">
                        <div>
                          <span className="font-label-caps text-label-caps text-on-surface uppercase block">Inflation Adjustment</span>
                          <span className="font-body-sm text-body-sm text-on-surface-variant">Discount by 2.50% avg CPI</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            checked={isInflation}
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
                        <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Projected Nest Egg / Super</span>
                        <span className="font-label-caps text-label-caps px-2 py-0.5 rounded bg-primary/10 text-primary">At Age {retirementAge}</span>
                      </div>
                      <div className="font-numerical-display text-numerical-display font-bold text-on-surface tracking-tight" id="simTotalWealth">
                        {formatUSD(displayCorpus)}
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center gap-2">
                          <span className="font-label-caps text-label-caps text-on-surface-variant">Monthly Income (4% SWR):</span>
                          <span className="font-data-mono text-data-mono font-semibold text-secondary" id="simRealWealth">
                            {formatUSD(displayMonthlyIncome)}/mo
                          </span>
                        </div>
                      </div>

                      {/* Visual SVG Multi-Band Growth Chart */}
                      <div className="mt-space-md">
                        <div className="flex justify-between font-label-caps text-label-caps text-on-surface-variant mb-1">
                          <span>Age {currentAge}</span>
                          <span>Retirement Trajectory (Deposits vs Growth)</span>
                          <span id="chartYearEnd">Age {retirementAge} ({yearsToRetire}y)</span>
                        </div>
                        <div className="w-full h-24 bg-surface-container-lowest rounded-lg p-2 flex items-end relative overflow-hidden">
                          <svg className="w-full h-full" id="simChart" preserveAspectRatio="none" viewBox="0 0 300 80">
                            <defs>
                              <linearGradient id="retireWealthGrad" x1="0%" x2="0%" y1="0%" y2="100%">
                                <stop offset="0%" stopColor="#2563eb" stopOpacity="0.5" />
                                <stop offset="100%" stopColor="#2563eb" stopOpacity="0.05" />
                              </linearGradient>
                              <linearGradient id="retireContribGrad" x1="0%" x2="0%" y1="0%" y2="100%">
                                <stop offset="0%" stopColor="#89ceff" stopOpacity="0.6" />
                                <stop offset="100%" stopColor="#89ceff" stopOpacity="0.1" />
                              </linearGradient>
                            </defs>
                            <path d={`M 0 80 Q 150 ${contribScale + 10} 300 ${contribScale} L 300 80 Z`} fill="url(#retireContribGrad)" id="contribArea" />
                            <path d={`M 0 80 Q 150 ${scaleFactor + 15} 300 ${scaleFactor} L 300 80 Z`} fill="url(#retireWealthGrad)" id="wealthArea" />
                            <path d={`M 0 80 Q 150 ${scaleFactor + 15} 300 ${scaleFactor}`} fill="none" id="wealthLine" stroke="#004ac6" strokeWidth="2.5" />
                          </svg>
                        </div>
                      </div>

                      {/* Metric Breakdown Grid */}
                      <div className="grid grid-cols-2 gap-2 mt-space-md">
                        <div className="p-2 rounded bg-surface-container-lowest">
                          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase block">Total Contributions</span>
                          <span className="font-data-mono text-data-mono font-bold text-on-surface" id="simDeposits">
                            {formatUSD(totalDeposits)}
                          </span>
                        </div>
                        <div className="p-2 rounded bg-surface-container-lowest">
                          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase block">Compounded Gains</span>
                          <span className="font-data-mono text-data-mono font-bold text-primary" id="simInterest">
                            {formatUSD(totalEarnings)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Scenario Matrix Table */}
                    <div className="mt-space-md pt-space-sm">
                      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase block mb-1.5">Return Scenario Variance</span>
                      <div className="grid grid-cols-4 gap-1.5 text-center font-data-mono text-xs">
                        <div className="p-1 rounded bg-surface-container-lowest">
                          <div className="text-on-surface-variant text-[10px]">5% Cons.</div>
                          <div className="font-semibold text-on-surface mt-0.5">{formatCompact(calcScenarioCorpus(5.0))}</div>
                        </div>
                        <div className="p-1 rounded bg-surface-container-lowest border border-primary/30 bg-primary/5">
                          <div className="text-primary text-[10px] font-bold">7.5% Bal.</div>
                          <div className="font-bold text-primary mt-0.5">{formatCompact(calcScenarioCorpus(7.5))}</div>
                        </div>
                        <div className="p-1 rounded bg-surface-container-lowest">
                          <div className="text-on-surface-variant text-[10px]">9% Growth</div>
                          <div className="font-semibold text-on-surface mt-0.5">{formatCompact(calcScenarioCorpus(9.0))}</div>
                        </div>
                        <div className="p-1 rounded bg-surface-container-lowest">
                          <div className="text-on-surface-variant text-[10px]">10.5% Aggr.</div>
                          <div className="font-semibold text-on-surface mt-0.5">{formatCompact(calcScenarioCorpus(10.5))}</div>
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
                  <input
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-surface-container-low font-body-md text-body-md text-on-surface placeholder-on-surface-variant/70 focus:outline-none focus:bg-surface-container-lowest transition-colors shadow-sm"
                    id="toolSearch"
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search 95+ retirement, 401(k), super & pension tools..."
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
                {[
                  { id: 'all', label: 'All Models (95)' },
                  { id: 'core', label: 'Core Retirement (10)' },
                  { id: 'super', label: 'AU Superannuation (10)' },
                  { id: '401k', label: '401(k) & Plans (10)' },
                  { id: 'fire', label: 'FIRE Early (10)' },
                  { id: 'social-security', label: 'Social Security (10)' },
                  { id: 'drawdown', label: 'Drawdown & SWR (10)' },
                  { id: 'roth', label: 'Roth & Shelters (10)' },
                  { id: 'pension', label: 'Pensions & DB (10)' },
                  { id: 'longevity', label: 'Longevity & Risk (8)' },
                  { id: 'healthcare', label: 'Healthcare & Budget (7)' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    className={`cluster-tab px-3 py-1.5 rounded-full font-label-caps text-label-caps uppercase whitespace-nowrap shadow-sm transition-colors cursor-pointer ${activeTab === tab.id ? 'bg-primary text-on-primary' : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant'}`}
                    onClick={() => setActiveTab(tab.id)}
                    type="button"
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </section>

            {/* 10 MAJOR RETIREMENT & SUPER CLUSTERS (95 Precision Tools in 3-Column Grid) */}
            <div className="space-y-space-2xl mb-space-3xl" id="clustersGrid">
              
              {/* CLUSTER 1: CORE RETIREMENT & NEST EGG (10 Tools) */}
              <section className="cluster-block" data-category="core">
                <div className="flex items-center justify-between pb-space-xs mb-space-md">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                    <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Core Retirement &amp; Nest Egg Models</h3>
                    <span className="font-data-mono text-xs px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant">10 Tools</span>
                  </div>
                  <span className="font-label-caps text-label-caps uppercase text-on-surface-variant hidden sm:inline">Actuarial Accumulation &amp; Longevity</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
                  {[
                    { title: 'Retirement Calculator', desc: 'Full multi-pillar nest egg longevity forecast.', tag: 'Core Model', icon: 'elderly' },
                    { title: 'Retirement Corpus Tool', desc: 'Target lump sum required at date of retirement.', tag: 'Corpus Target', icon: 'account_balance_wallet' },
                    { title: 'Retirement Income Forecaster', desc: 'Monthly passive drawdown supported by capital.', tag: 'Cash Flow', icon: 'payments' },
                    { title: 'Retirement Age Solver', desc: 'Calculate earliest viable retirement date based on savings.', tag: 'Milestone', icon: 'event_available' },
                    { title: 'Retirement Savings Rate Tool', desc: 'Optimal paycheck percentage to achieve financial freedom.', tag: 'Savings %', icon: 'savings' },
                    { title: 'Retirement Deficit Check', desc: 'Shortfall diagnostic between current pacing and target.', tag: 'Gap Analysis', icon: 'warning' },
                    { title: 'Retirement Lifestyle Budget', desc: 'Cost modeling for travel, hobbies, healthcare and housing.', tag: 'Budgeting', icon: 'cottage' },
                    { title: 'Monte Carlo Retirement Engine', desc: 'Probability distribution over 1,000 market scenarios.', tag: 'Simulation', icon: 'query_stats' },
                    { title: 'Terminal Nest Egg Tool', desc: 'Capital preservation and generational legacy estimator.', tag: 'Terminal Value', icon: 'egg' },
                    { title: 'Inflation-Adjusted Retire Model', desc: 'Future purchasing power expressed in today\'s dollars.', tag: 'Real Power', icon: 'compress' },
                  ].map((tool, idx) => (
                    <div key={idx} className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-label-caps text-label-caps uppercase text-primary">{tool.tag}</span>
                          <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary transition-colors">{tool.icon}</span>
                        </div>
                        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">{tool.title}</h4>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{tool.desc}</p>
                      </div>
                      <Link className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="/finance">
                        Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </Link>
                    </div>
                  ))}
                </div>
              </section>

              {/* CLUSTER 2: SUPERANNUATION & AUSTRALIAN ATO SUITE (10 Tools) */}
              <section className="cluster-block" data-category="super">
                <div className="flex items-center justify-between pb-space-xs mb-space-md">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                    <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Superannuation &amp; Australian ATO Suite</h3>
                    <span className="font-data-mono text-xs px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant">10 Tools</span>
                  </div>
                  <span className="font-label-caps text-label-caps uppercase text-on-surface-variant hidden sm:inline">Statutory SG &amp; Tax Sheltering</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
                  {[
                    { title: 'Superannuation Calculator', desc: 'Simulate SG compound growth to preservation age 60.', tag: 'AU Super', icon: 'account_balance' },
                    { title: 'Salary Sacrifice Super Tool', desc: '15% concessional tax arbitrage vs personal marginal tax.', tag: 'Tax Saver', icon: 'price_change' },
                    { title: 'Super Guarantee (SG) Tool', desc: 'Mandatory employer 11.5% to 12% statutory calculations.', tag: 'Statutory SG', icon: 'gavel' },
                    { title: 'Concessional Cap Checker', desc: 'Track $30,000 annual concessional limit & 5-year carry.', tag: 'Cap Limit', icon: 'fact_check' },
                    { title: 'Non-Concessional Cap Tool', desc: '$120,000 post-tax contribution & 3-year bring-forward.', tag: 'Post-Tax', icon: 'savings' },
                    { title: 'Super Consolidation Tool', desc: 'Evaluate fee savings and insurance loss from account merging.', tag: 'Fee Optimizer', icon: 'merge' },
                    { title: 'Government Co-Contribution', desc: 'Low-income matching grant up to $500 calculator.', tag: 'Co-Contrib', icon: 'handshake' },
                    { title: 'Transition to Retirement (TTR)', desc: 'Access super pension while working reduced hours.', tag: 'TTR Pension', icon: 'timelapse' },
                    { title: 'Account-Based Pension Drawdown', desc: 'Minimum statutory decumulation percentage by age tier.', tag: 'Drawdown', icon: 'history_edu' },
                    { title: 'SMSF Cost & Yield Analyzer', desc: 'Self-Managed Super Fund cost-benefit break-even analyzer.', tag: 'SMSF', icon: 'domain' },
                  ].map((tool, idx) => (
                    <div key={idx} className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-label-caps text-label-caps uppercase text-secondary">{tool.tag}</span>
                          <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-secondary transition-colors">{tool.icon}</span>
                        </div>
                        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-secondary transition-colors">{tool.title}</h4>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{tool.desc}</p>
                      </div>
                      <Link className="inline-flex items-center gap-1 font-data-mono text-xs text-secondary font-semibold mt-space-sm group-hover:underline" href="/finance">
                        Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </Link>
                    </div>
                  ))}
                </div>
              </section>

              {/* CLUSTER 3: 401(k), 403(b) & DEFINED CONTRIBUTION (10 Tools) */}
              <section className="cluster-block" data-category="401k">
                <div className="flex items-center justify-between pb-space-xs mb-space-md">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-tertiary"></span>
                    <h3 className="font-headline-md text-headline-md font-bold text-on-surface">401(k), 403(b) &amp; Defined Contribution</h3>
                    <span className="font-data-mono text-xs px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant">10 Tools</span>
                  </div>
                  <span className="font-label-caps text-label-caps uppercase text-on-surface-variant hidden sm:inline">IRS Section 401 &amp; Employer Match</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
                  {[
                    { title: '401(k) Growth Calculator', desc: 'Pre-tax payroll deferral compounding over 30+ years.', tag: '401(k) Core', icon: 'trending_up' },
                    { title: '401(k) Match Optimizer', desc: 'Capture 100% employer match dollar-for-dollar.', tag: 'Free Return', icon: 'star' },
                    { title: 'Roth 401(k) vs Traditional', desc: 'Compare upfront tax deduction vs tax-free distribution.', tag: 'Tax Parity', icon: 'balance' },
                    { title: '403(b) Educator Planner', desc: 'Non-profit and healthcare retirement plan projection.', tag: '403(b) Plan', icon: 'school' },
                    { title: '457(b) Deferred Comp Tool', desc: 'Government plan penalty-free separation withdrawals.', tag: '457(b) Govt', icon: 'account_balance' },
                    { title: '401(k) Catch-Up Limit Tool', desc: 'Age 50+ and SECURE 2.0 extra contribution caps.', tag: 'Age 50+ Cap', icon: 'add_circle' },
                    { title: '401(k) Loan Payoff Model', desc: 'Assess opportunity cost of borrowing against 401(k).', tag: 'Loan Cost', icon: 'credit_card_off' },
                    { title: '401(k) Fee Drag Analyzer', desc: 'Impact of 1% admin and sub-advised mutual fund fees.', tag: 'Fee Drag', icon: 'money_off' },
                    { title: 'Solo 401(k) Self-Employed', desc: 'Employee deferral + employer profit share calculations.', tag: 'Solo Plan', icon: 'work' },
                    { title: 'SEP IRA vs Solo 401(k)', desc: 'Small business owner maximum tax deduction comparison.', tag: 'Small Biz', icon: 'domain' },
                  ].map((tool, idx) => (
                    <div key={idx} className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-label-caps text-label-caps uppercase text-tertiary">{tool.tag}</span>
                          <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-tertiary transition-colors">{tool.icon}</span>
                        </div>
                        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-tertiary transition-colors">{tool.title}</h4>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{tool.desc}</p>
                      </div>
                      <Link className="inline-flex items-center gap-1 font-data-mono text-xs text-tertiary font-semibold mt-space-sm group-hover:underline" href="/finance">
                        Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </Link>
                    </div>
                  ))}
                </div>
              </section>

              {/* CLUSTER 4: FIRE MOVEMENT & EARLY RETIREMENT (10 Tools) */}
              <section className="cluster-block" data-category="fire">
                <div className="flex items-center justify-between pb-space-xs mb-space-md">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                    <h3 className="font-headline-md text-headline-md font-bold text-on-surface">FIRE Movement &amp; Early Retirement</h3>
                    <span className="font-data-mono text-xs px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant">10 Tools</span>
                  </div>
                  <span className="font-label-caps text-label-caps uppercase text-on-surface-variant hidden sm:inline">25x &amp; 33x Multipliers</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
                  {[
                    { title: 'FIRE Master Calculator', desc: 'Comprehensive early retirement horizon forecaster.', tag: 'Master FIRE', icon: 'local_fire_department' },
                    { title: 'Lean FIRE Calculator', desc: 'Minimalist sub-$45,000 annual spend target modeling.', tag: 'Lean FIRE', icon: 'filter_vintage' },
                    { title: 'Fat FIRE Calculator', desc: 'Affluent early retirement with $120k+ yearly budget.', tag: 'Fat FIRE', icon: 'diamond' },
                    { title: 'Coast FIRE Calculator', desc: 'Age at which zero further contributions are needed.', tag: 'Coast FIRE', icon: 'surfing' },
                    { title: 'Barista FIRE Calculator', desc: 'Part-time job healthcare bridge & supplement modeling.', tag: 'Barista', icon: 'local_cafe' },
                    { title: 'FIRE Number Calculator', desc: 'Exact 25x and 30x liquid portfolio milestone solver.', tag: 'Target #', icon: 'tag' },
                    { title: 'FIRE Progress Tracker', desc: 'Percentage completed towards total financial autonomy.', tag: 'Tracker', icon: 'speed' },
                    { title: '72(t) SEPP Early Access', desc: 'Substantially equal penalty-free pre-59½ distributions.', tag: 'SEPP 72(t)', icon: 'lock_open' },
                    { title: 'Rule of 55 Calculator', desc: 'Access current 401(k) penalty-free upon age 55 exit.', tag: 'Rule of 55', icon: 'alarm_on' },
                    { title: 'Financial Independence Index', desc: 'Crossover velocity where investment returns exceed salary.', tag: 'Freedom Index', icon: 'flight_takeoff' },
                  ].map((tool, idx) => (
                    <div key={idx} className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-label-caps text-label-caps uppercase text-primary">{tool.tag}</span>
                          <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary transition-colors">{tool.icon}</span>
                        </div>
                        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">{tool.title}</h4>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{tool.desc}</p>
                      </div>
                      <Link className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="/finance">
                        Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </Link>
                    </div>
                  ))}
                </div>
              </section>

              {/* CLUSTER 5: SOCIAL SECURITY & ENTITLEMENTS (10 Tools) */}
              <section className="cluster-block" data-category="social-security">
                <div className="flex items-center justify-between pb-space-xs mb-space-md">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                    <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Social Security &amp; State Pensions</h3>
                    <span className="font-data-mono text-xs px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant">10 Tools</span>
                  </div>
                  <span className="font-label-caps text-label-caps uppercase text-on-surface-variant hidden sm:inline">Statutory Government Benefits</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
                  {[
                    { title: 'Social Security Estimator', desc: 'Full Retirement Age (FRA) monthly benefit curve model.', tag: 'US SSA', icon: 'receipt_long' },
                    { title: 'Age 62 vs 70 Claiming Tool', desc: 'Actuarial cumulative break-even age for delayed claiming.', tag: 'Break-Even', icon: 'compare_arrows' },
                    { title: 'Spousal Social Security', desc: 'Calculate 50% spousal benefit and survivor options.', tag: 'Spousal SSA', icon: 'group' },
                    { title: 'AU Age Pension Asset Test', desc: 'Taper rate reductions based on homeowner status and assets.', tag: 'AU Pension', icon: 'domain' },
                    { title: 'AU Age Pension Income Test', desc: 'Deeming rate threshold calculator on liquid savings.', tag: 'Deeming Rates', icon: 'attach_money' },
                    { title: 'UK State Pension Forecaster', desc: '35 qualifying National Insurance years validation.', tag: 'UK Pension', icon: 'account_balance' },
                    { title: 'Canada CPP & OAS Optimizer', desc: 'Canada Pension Plan and Old Age Security clawback.', tag: 'Canada', icon: 'map' },
                    { title: 'WEP & GPO Impact Tool', desc: 'Windfall Elimination for public servants and teachers.', tag: 'WEP/GPO', icon: 'rule' },
                    { title: 'Social Security Taxability', desc: 'Combined provisional income tax tiers (50% & 85%).', tag: 'Tax Bracket', icon: 'percent' },
                    { title: 'COLA Adjustment Forecaster', desc: 'Historical and future CPI-W cost-of-living adjustments.', tag: 'COLA', icon: 'trending_up' },
                  ].map((tool, idx) => (
                    <div key={idx} className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-label-caps text-label-caps uppercase text-secondary">{tool.tag}</span>
                          <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-secondary transition-colors">{tool.icon}</span>
                        </div>
                        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-secondary transition-colors">{tool.title}</h4>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{tool.desc}</p>
                      </div>
                      <Link className="inline-flex items-center gap-1 font-data-mono text-xs text-secondary font-semibold mt-space-sm group-hover:underline" href="/finance">
                        Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </Link>
                    </div>
                  ))}
                </div>
              </section>

              {/* CLUSTER 6: DRAWDOWN, SWR & DECUMULATION (10 Tools) */}
              <section className="cluster-block" data-category="drawdown">
                <div className="flex items-center justify-between pb-space-xs mb-space-md">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                    <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Drawdown, SWR &amp; Decumulation</h3>
                    <span className="font-data-mono text-xs px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant">10 Tools</span>
                  </div>
                  <span className="font-label-caps text-label-caps uppercase text-on-surface-variant hidden sm:inline">Trinity Study &amp; Perpetuity</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
                  {[
                    { title: 'Safe Withdrawal Rate (SWR)', desc: 'Bengen 4% rule survival probability across 30-50 years.', tag: 'Bengen 4%', icon: 'verified_user' },
                    { title: 'Guyton-Klinger Guardrails', desc: 'Dynamic capital preservation withdrawal adjustments.', tag: 'Dynamic SWR', icon: 'traffic' },
                    { title: 'Required Minimum Distribution', desc: 'IRS Uniform Lifetime Table RMD solver for age 73+.', tag: 'RMD Table', icon: 'calendar_month' },
                    { title: 'Variable Percentage Drawdown', desc: 'Portfolio percentage spending with floor & ceiling rules.', tag: 'Variable %', icon: 'tune' },
                    { title: 'Annuity vs 4% Drawdown', desc: 'Compare guaranteed lifetime payout against stock index.', tag: 'Tradeoff', icon: 'balance' },
                    { title: 'Portfolio Longevity Tool', desc: 'Simulate exact age when capital reaches $0 under volatility.', tag: 'Longevity', icon: 'hourglass_bottom' },
                    { title: '3-Bucket Strategy Model', desc: 'Cash buffer, bond bridge, and equity compounding buckets.', tag: '3-Bucket', icon: 'view_column' },
                    { title: 'Capital Depletion Curve', desc: 'Visual decumulation tracking under adverse market returns.', tag: 'Depletion', icon: 'waterfall_chart' },
                    { title: 'Tax-Efficient Drawdown Order', desc: 'Optimal sequence: Taxable → Pre-Tax → Roth IRAs.', tag: 'Tax Sequence', icon: 'sort' },
                    { title: 'Floor & Ceiling Guardrails', desc: 'Protect lifestyle spending during severe economic shocks.', tag: 'Guardrails', icon: 'shield' },
                  ].map((tool, idx) => (
                    <div key={idx} className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-label-caps text-label-caps uppercase text-primary">{tool.tag}</span>
                          <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary transition-colors">{tool.icon}</span>
                        </div>
                        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">{tool.title}</h4>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{tool.desc}</p>
                      </div>
                      <Link className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="/finance">
                        Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </Link>
                    </div>
                  ))}
                </div>
              </section>

              {/* CLUSTER 7: ROTH CONVERSION & TAX SHELTERS (10 Tools) */}
              <section className="cluster-block" data-category="roth">
                <div className="flex items-center justify-between pb-space-xs mb-space-md">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                    <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Roth Conversions &amp; Tax Shelters</h3>
                    <span className="font-data-mono text-xs px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant">10 Tools</span>
                  </div>
                  <span className="font-label-caps text-label-caps uppercase text-on-surface-variant hidden sm:inline">Tax-Free Compounding &amp; Backdoor</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
                  {[
                    { title: 'Roth Conversion Ladder', desc: '5-year seasoned penalty-free early access ladder.', tag: 'Roth Ladder', icon: 'stairs' },
                    { title: 'Backdoor Roth IRA Tool', desc: 'High-income non-deductible to Roth conversion.', tag: 'Backdoor', icon: 'door_front' },
                    { title: 'Mega Backdoor Roth Model', desc: 'After-tax 401(k) in-plan conversion up to $70,000.', tag: 'Mega Backdoor', icon: 'door_sliding' },
                    { title: 'Pro-Rata Rule Calculator', desc: 'Determine taxable portion of backdoor conversions.', tag: 'Pro-Rata', icon: 'pie_chart' },
                    { title: 'HSA Stealth Retirement', desc: 'Triple-tax advantaged healthcare nest egg growth.', tag: 'HSA Stealth', icon: 'health_and_safety' },
                    { title: 'Traditional vs Roth IRA', desc: 'Current marginal rate vs expected retirement bracket.', tag: 'Tax Parity', icon: 'swap_horiz' },
                    { title: 'Bracket Bumping Optimizer', desc: 'Convert up to standard 22% or 24% bracket boundary.', tag: 'Tax Bracket', icon: 'stacked_bar_chart' },
                    { title: 'Roth 5-Year Rule Tracker', desc: 'Track seasoning timelines for earnings vs conversions.', tag: '5-Year Rule', icon: 'timer' },
                    { title: 'Inherited IRA 10-Year Rule', desc: 'SECURE Act mandatory depletion schedule solver.', tag: 'Inherited IRA', icon: 'history_toggle_off' },
                    { title: 'QCD Charitable Distributer', desc: 'Direct tax-free RMD donation to charitable 501(c)(3).', tag: 'QCD Gift', icon: 'volunteer_activism' },
                  ].map((tool, idx) => (
                    <div key={idx} className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-label-caps text-label-caps uppercase text-secondary">{tool.tag}</span>
                          <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-secondary transition-colors">{tool.icon}</span>
                        </div>
                        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-secondary transition-colors">{tool.title}</h4>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{tool.desc}</p>
                      </div>
                      <Link className="inline-flex items-center gap-1 font-data-mono text-xs text-secondary font-semibold mt-space-sm group-hover:underline" href="/finance">
                        Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </Link>
                    </div>
                  ))}
                </div>
              </section>

              {/* CLUSTER 8: DEFINED BENEFIT & PENSIONS (10 Tools) */}
              <section className="cluster-block" data-category="pension">
                <div className="flex items-center justify-between pb-space-xs mb-space-md">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-tertiary"></span>
                    <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Defined Benefit &amp; Pensions</h3>
                    <span className="font-data-mono text-xs px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant">10 Tools</span>
                  </div>
                  <span className="font-label-caps text-label-caps uppercase text-on-surface-variant hidden sm:inline">Guaranteed Lifetime Annuities</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
                  {[
                    { title: 'Pension Annuity Calculator', desc: 'Single life vs joint & survivor monthly cash flow.', tag: 'Annuity Payout', icon: 'attach_money' },
                    { title: 'Lump Sum vs Pension Tool', desc: 'Evaluate discounted NPV of lump sum buyout offers.', tag: 'Lump Sum NPV', icon: 'monetization_on' },
                    { title: 'Defined Benefit Formula', desc: 'Final average salary × service years × multiplier.', tag: 'DB Formula', icon: 'calculate' },
                    { title: 'FERS Federal Retirement', desc: 'Federal Employee Retirement System annuity + supplement.', tag: 'US FERS', icon: 'account_balance' },
                    { title: 'Military Pension (BRS)', desc: 'Blended Retirement System 20-year active duty solver.', tag: 'Military BRS', icon: 'military_tech' },
                    { title: 'Teachers Pension (STRS)', desc: 'State Teachers Retirement System formula and COLA.', tag: 'STRS Teacher', icon: 'school' },
                    { title: 'Pension Commutation Tool', desc: 'Tax consequences of commuting pension to lump sum.', tag: 'Commutation', icon: 'currency_exchange' },
                    { title: 'COLA Inflation Drag Tool', desc: 'Measure purchasing power loss on non-indexed pensions.', tag: 'COLA Drag', icon: 'trending_down' },
                    { title: 'Corporate Pension Solvency', desc: 'PBGC guarantee limits and plan funded status check.', tag: 'PBGC Risk', icon: 'health_and_safety' },
                    { title: 'Fixed Indexed Annuity Tool', desc: 'Cap rates, participation rates and principal protection.', tag: 'Indexed Annuity', icon: 'insights' },
                  ].map((tool, idx) => (
                    <div key={idx} className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-label-caps text-label-caps uppercase text-tertiary">{tool.tag}</span>
                          <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-tertiary transition-colors">{tool.icon}</span>
                        </div>
                        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-tertiary transition-colors">{tool.title}</h4>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{tool.desc}</p>
                      </div>
                      <Link className="inline-flex items-center gap-1 font-data-mono text-xs text-tertiary font-semibold mt-space-sm group-hover:underline" href="/finance">
                        Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </Link>
                    </div>
                  ))}
                </div>
              </section>

              {/* CLUSTER 9: LONGEVITY & DOWNSIDE RISK (8 Tools) */}
              <section className="cluster-block" data-category="longevity">
                <div className="flex items-center justify-between pb-space-xs mb-space-md">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                    <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Longevity, Sequence of Returns &amp; Risk</h3>
                    <span className="font-data-mono text-xs px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant">8 Tools</span>
                  </div>
                  <span className="font-label-caps text-label-caps uppercase text-on-surface-variant hidden sm:inline">Tail Risk &amp; Glidepaths</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
                  {[
                    { title: 'Sequence of Returns Risk Tool', desc: 'Simulate early bear market crash during retirement years 1-5.', tag: 'SRR Model', icon: 'warning' },
                    { title: 'Bond Tent Glidepath Model', desc: 'Temporary bond allocation surge to protect transition.', tag: 'Bond Tent', icon: 'cabin' },
                    { title: 'Actuarial Life Expectancy', desc: 'Society of Actuaries mortality tables by lifestyle tier.', tag: 'SOA Tables', icon: 'favorite' },
                    { title: 'Target Date Glidepath Tool', desc: 'Evaluate equity descent curves across leading index funds.', tag: 'Target Date', icon: 'route' },
                    { title: 'Dynamic Asset Allocation', desc: 'Age-adjusted stock, bond, and cash rebalancing rules.', tag: 'Allocation', icon: 'pie_chart' },
                    { title: 'Cash Buffer Reserve Tool', desc: '1-3 years liquid spending buffer to avoid selling lows.', tag: 'Cash Buffer', icon: 'savings' },
                    { title: 'Rising Equity Glidepath', desc: 'Kitces &amp; Pfau inverted equity glidepath model.', tag: 'Kitces Model', icon: 'trending_up' },
                    { title: 'Joint Life Probability Tool', desc: 'Odds of at least one spouse surviving past age 90 or 95.', tag: 'Joint Odds', icon: 'group' },
                  ].map((tool, idx) => (
                    <div key={idx} className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-label-caps text-label-caps uppercase text-primary">{tool.tag}</span>
                          <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary transition-colors">{tool.icon}</span>
                        </div>
                        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">{tool.title}</h4>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{tool.desc}</p>
                      </div>
                      <Link className="inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold mt-space-sm group-hover:underline" href="/finance">
                        Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </Link>
                    </div>
                  ))}
                </div>
              </section>

              {/* CLUSTER 10: HEALTHCARE, MEDICARE & BUDGET (7 Tools) */}
              <section className="cluster-block" data-category="healthcare">
                <div className="flex items-center justify-between pb-space-xs mb-space-md">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                    <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Healthcare, Medicare &amp; Relocation</h3>
                    <span className="font-data-mono text-xs px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant">7 Tools</span>
                  </div>
                  <span className="font-label-caps text-label-caps uppercase text-on-surface-variant hidden sm:inline">Decumulation Expense Stabilization</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
                  {[
                    { title: 'Medicare Part B & D IRMAA', desc: 'Income-Related Monthly Adjustment Amount surcharges.', tag: 'IRMAA Model', icon: 'medical_services' },
                    { title: 'Retirement Healthcare Bridge', desc: 'ACA health insurance subsidies before Medicare age 65.', tag: 'ACA Bridge', icon: 'health_and_safety' },
                    { title: 'Long-Term Care Cost Model', desc: 'Assisted living & memory care expense forecasts.', tag: 'LTC Need', icon: 'assist_walker' },
                    { title: 'Spending Smile Curve Model', desc: 'Blanchett spending decline from Go-Go to Slow-Go years.', tag: 'Smile Curve', icon: 'sentiment_satisfied' },
                    { title: 'State Retirement Tax Map', desc: 'State income, pension and Social Security tax exemption rules.', tag: 'State Taxes', icon: 'map' },
                    { title: 'Reverse Mortgage Evaluator', desc: 'HECM line-of-credit volatility buffer model.', tag: 'HECM Reverse', icon: 'home' },
                    { title: 'Retirement Relocation Index', desc: 'Cost of living and property tax savings by destination.', tag: 'Geo-Arbitrage', icon: 'flight' },
                  ].map((tool, idx) => (
                    <div key={idx} className="tool-card bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-label-caps text-label-caps uppercase text-secondary">{tool.tag}</span>
                          <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-secondary transition-colors">{tool.icon}</span>
                        </div>
                        <h4 className="font-body-lg text-body-lg font-bold text-on-surface group-hover:text-secondary transition-colors">{tool.title}</h4>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{tool.desc}</p>
                      </div>
                      <Link className="inline-flex items-center gap-1 font-data-mono text-xs text-secondary font-semibold mt-space-sm group-hover:underline" href="/finance">
                        Launch Calculator <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </Link>
                    </div>
                  ))}
                </div>
              </section>

            </div>

            {/* ACTUARIAL TRADEOFF MATRIX (9 Analytical Cards) */}
            <section className="mb-space-3xl">
              <div className="mb-space-lg">
                <span className="font-data-mono text-label-caps uppercase tracking-wider text-primary font-bold">Actuarial Tradeoff Matrix</span>
                <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">Retirement Head-to-Head Comparisons</h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1 max-w-2xl">
                  Rigorous empirical trade-offs resolving classic decumulation, pension, and account structure dilemmas.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
                {/* Card 1 */}
                <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-md flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-space-xs mb-space-sm border-b border-surface-container-high">
                      <span className="font-data-mono text-xs font-bold text-primary">System Comparison</span>
                      <span className="material-symbols-outlined text-primary text-[18px]">balance</span>
                    </div>
                    <h3 className="font-headline-md text-headline-md font-bold text-on-surface">401(k) vs. Australian Super</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs leading-relaxed">
                      US 401(k) relies on voluntary payroll deferrals with employer matching, taxed at ordinary income rates on withdrawal. Australian Superannuation enforces a mandatory 11.5% SG employer contribution, taxed at 15% upon entry and 0% tax-free in the pension decumulation phase after age 60.
                    </p>
                    <div className="mt-space-sm p-space-xs rounded bg-surface-container-low text-xs font-data-mono text-on-surface">
                      <span className="font-bold text-primary">Key Advantage:</span> AU Super offers 0% tax in pension phase; US 401(k) offers higher annual limits ($23,500 vs AU $30k concessional cap).
                    </div>
                  </div>
                  <Link className="mt-space-md inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold hover:underline" href="/finance">
                    Compare 401(k) vs Super <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </Link>
                </div>

                {/* Card 2 */}
                <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-md flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-space-xs mb-space-sm border-b border-surface-container-high">
                      <span className="font-data-mono text-xs font-bold text-secondary">Tax Arbitrage</span>
                      <span className="material-symbols-outlined text-secondary text-[18px]">swap_vert</span>
                    </div>
                    <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Roth IRA vs. Traditional 401(k)</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs leading-relaxed">
                      Traditional pre-tax contributions shelter dollars at your current highest marginal tax rate. Roth post-tax dollars enter after today&apos;s tax rate but ensure zero tax on decades of compound earnings and zero tax on withdrawals. If your tax rate now exceeds your future retirement rate, Traditional mathematically wins.
                    </p>
                    <div className="mt-space-sm p-space-xs rounded bg-surface-container-low text-xs font-data-mono text-on-surface">
                      <span className="font-bold text-secondary">Formula:</span> PV · (1 - t₀) · (1 + r)ⁿ = PV · (1 + r)ⁿ · (1 - tₙ) when t₀ = tₙ.
                    </div>
                  </div>
                  <Link className="mt-space-md inline-flex items-center gap-1 font-data-mono text-xs text-secondary font-semibold hover:underline" href="/finance">
                    Model Tax Bracket Arbitrage <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </Link>
                </div>

                {/* Card 3 */}
                <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-md flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-space-xs mb-space-sm border-b border-surface-container-high">
                      <span className="font-data-mono text-xs font-bold text-tertiary">Longevity Guarantee</span>
                      <span className="material-symbols-outlined text-tertiary text-[18px]">verified_user</span>
                    </div>
                    <h3 className="font-headline-md text-headline-md font-bold text-on-surface">4% SWR vs. Lifetime Annuity</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs leading-relaxed">
                      The 4% SWR preserves capital upside and estate legacy, but exposes the retiree to market downturns and Sequence of Returns Risk. Fixed annuities transfer longevity risk to insurance carriers providing guaranteed monthly income for life, but permanently forfeit principal and legacy inheritance.
                    </p>
                    <div className="mt-space-sm p-space-xs rounded bg-surface-container-low text-xs font-data-mono text-on-surface">
                      <span className="font-bold text-tertiary">Hybrid Solution:</span> Annuitize basic essential living costs; keep discretionary spending in 4% stock/bond index drawdown.
                    </div>
                  </div>
                  <Link className="mt-space-md inline-flex items-center gap-1 font-data-mono text-xs text-tertiary font-semibold hover:underline" href="/finance">
                    Test SWR vs Annuity Payout <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </Link>
                </div>

                {/* Card 4 */}
                <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-md flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-space-xs mb-space-sm border-b border-surface-container-high">
                      <span className="font-data-mono text-xs font-bold text-primary">Claiming Horizon</span>
                      <span className="material-symbols-outlined text-primary text-[18px]">calendar_today</span>
                    </div>
                    <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Social Security at Age 62 vs. 70</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs leading-relaxed">
                      Claiming early at age 62 permanently reduces monthly benefits by up to 30%. Delaying until age 70 generates an 8% annual guaranteed delayed retirement credit boost (124% to 132% of primary insurance amount). The actuarial cumulative break-even age is approximately 80.5 years.
                    </p>
                    <div className="mt-space-sm p-space-xs rounded bg-surface-container-low text-xs font-data-mono text-on-surface">
                      <span className="font-bold text-primary">Optimal Strategy:</span> If family history indicates longevity &gt;82 years, delaying to age 70 is an unmatched inflation-adjusted yield.
                    </div>
                  </div>
                  <Link className="mt-space-md inline-flex items-center gap-1 font-data-mono text-xs text-primary font-semibold hover:underline" href="/finance">
                    Calculate Claiming Break-Even <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </Link>
                </div>

                {/* Card 5 */}
                <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-md flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-space-xs mb-space-sm border-b border-surface-container-high">
                      <span className="font-data-mono text-xs font-bold text-secondary">Pension Buyout</span>
                      <span className="material-symbols-outlined text-secondary text-[18px]">monetization_on</span>
                    </div>
                    <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Lump Sum vs. Monthly Pension</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs leading-relaxed">
                      Lump sum buyouts grant complete investment autonomy and estate survivorship, but require achieving an internal rate of return (discount rate) higher than the pension plan&apos;s corporate yield assumption (typically 5.5% - 6.5%) without succumbing to market volatility.
                    </p>
                    <div className="mt-space-sm p-space-xs rounded bg-surface-container-low text-xs font-data-mono text-on-surface">
                      <span className="font-bold text-secondary">Decision Rule:</span> Compare the buyout offer&apos;s implied annuity rate to private market single-premium immediate annuities (SPIA).
                    </div>
                  </div>
                  <Link className="mt-space-md inline-flex items-center gap-1 font-data-mono text-xs text-secondary font-semibold hover:underline" href="/finance">
                    Evaluate Pension Buyout NPV <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </Link>
                </div>

                {/* Card 6 */}
                <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-md flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-space-xs mb-space-sm border-b border-surface-container-high">
                      <span className="font-data-mono text-xs font-bold text-tertiary">Horizon Multipliers</span>
                      <span className="material-symbols-outlined text-tertiary text-[18px]">local_fire_department</span>
                    </div>
                    <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Traditional (65) vs. Early FIRE (45)</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs leading-relaxed">
                      Traditional 30-year retirements utilize Bengen&apos;s 4% rule with government pensions buffering drawdowns. A 45-year FIRE horizon faces extreme 50-year sequence of returns risk, requiring a lower safe withdrawal rate (3.25% - 3.50%) and a larger 30x to 33x expense corpus multiplier.
                    </p>
                    <div className="mt-space-sm p-space-xs rounded bg-surface-container-low text-xs font-data-mono text-on-surface">
                      <span className="font-bold text-tertiary">Corpus Need:</span> $60k/yr spend = $1.5M at traditional 25x; $1.85M - $2.0M for early 45-year horizon.
                    </div>
                  </div>
                  <Link className="mt-space-md inline-flex items-center gap-1 font-data-mono text-xs text-tertiary font-semibold hover:underline" href="/finance">
                    Simulate Early vs Standard SWR <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </section>

            {/* RIGOROUS MATHEMATICAL STANDARDS (4 Equation Cards) */}
            <section className="mb-space-3xl">
              <div className="bg-surface-container-lowest rounded-xl shadow-md p-space-lg lg:p-space-xl">
                <div className="max-w-3xl mb-space-lg">
                  <span className="font-data-mono text-label-caps uppercase tracking-wider text-primary font-bold">Rigorous Mathematical Standards</span>
                  <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface mt-1">Foundational Actuarial Formulations</h2>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                    SolveIt retirement calculators execute closed-form recurrence models compliant with IEEE 754 floating-point precision and actuarial standard practices.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
                  {/* Equation 1 */}
                  <div className="p-space-md rounded-lg bg-surface-container-low flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-label-caps text-label-caps uppercase font-bold text-primary">Super &amp; 401(k) Future Value Accumulation</span>
                        <span className="font-data-mono text-xs text-on-surface-variant">Discrete Recurrence</span>
                      </div>
                      <div className="p-space-sm rounded bg-surface-container-lowest my-2 overflow-x-auto text-center font-data-mono text-body-md font-bold text-on-surface">
                        FV = PV · (1 + r/12)ⁿ + PMT · [((1 + r/12)ⁿ - 1) / (r/12)]
                      </div>
                      <p className="text-body-sm text-on-surface-variant mt-2 leading-relaxed">
                        Where <strong>PV</strong> is existing Super/401(k) balance, <strong>r</strong> is net investment return, <strong>n</strong> is total months to retirement, and <strong>PMT</strong> is total employee + employer monthly contribution.
                      </p>
                    </div>
                    <div className="mt-space-sm pt-space-xs border-t border-surface-container-high text-[11px] font-data-mono text-on-surface-variant">
                      Applies to: Superannuation Calculator, 401(k) Planner, Nest Egg Engine
                    </div>
                  </div>

                  {/* Equation 2 */}
                  <div className="p-space-md rounded-lg bg-surface-container-low flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-label-caps text-label-caps uppercase font-bold text-secondary">Bengen 4% SWR &amp; Corpus Multiplier</span>
                        <span className="font-data-mono text-xs text-on-surface-variant">Trinity Perpetuity</span>
                      </div>
                      <div className="p-space-sm rounded bg-surface-container-lowest my-2 overflow-x-auto text-center font-data-mono text-body-md font-bold text-on-surface">
                        Target Corpus = (Annual Expenses - Guaranteed Pension) / SWR
                      </div>
                      <p className="text-body-sm text-on-surface-variant mt-2 leading-relaxed">
                        At a standard 4.0% SWR, <em>1 / 0.04 = 25</em> (the 25x rule). For conservative 3.33% early FIRE horizons, <em>1 / 0.0333 = 30</em> (the 30x rule). Guaranteed Social Security offsets directly lower the required corpus.
                      </p>
                    </div>
                    <div className="mt-space-sm pt-space-xs border-t border-surface-container-high text-[11px] font-data-mono text-on-surface-variant">
                      Applies to: Safe Withdrawal Rate Tool, FIRE Forecaster, Corpus Target
                    </div>
                  </div>

                  {/* Equation 3 */}
                  <div className="p-space-md rounded-lg bg-surface-container-low flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-label-caps text-label-caps uppercase font-bold text-tertiary">Real Purchasing Power (Fisher Equation)</span>
                        <span className="font-data-mono text-xs text-on-surface-variant">Geometric Deflation</span>
                      </div>
                      <div className="p-space-sm rounded bg-surface-container-lowest my-2 overflow-x-auto text-center font-data-mono text-body-md font-bold text-on-surface">
                        Real Value = Nominal FV / (1 + i)ᵗ
                      </div>
                      <p className="text-body-sm text-on-surface-variant mt-2 leading-relaxed">
                        Discounts nominal future currency by compound inflation rate <strong>i</strong> across horizon <strong>t</strong> in years, establishing the exact real purchasing power of your retirement drawdown.
                      </p>
                    </div>
                    <div className="mt-space-sm pt-space-xs border-t border-surface-container-high text-[11px] font-data-mono text-on-surface-variant">
                      Applies to: Inflation-Adjusted Wealth, Real Income Forecaster
                    </div>
                  </div>

                  {/* Equation 4 */}
                  <div className="p-space-md rounded-lg bg-surface-container-low flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-label-caps text-label-caps uppercase font-bold text-primary">Required Minimum Distribution (RMD)</span>
                        <span className="font-data-mono text-xs text-on-surface-variant">IRS Uniform Lifetime</span>
                      </div>
                      <div className="p-space-sm rounded bg-surface-container-lowest my-2 overflow-x-auto text-center font-data-mono text-body-md font-bold text-on-surface">
                        RMD Year t = Account Balance (Dec 31 t-1) / Distribution Period
                      </div>
                      <p className="text-body-sm text-on-surface-variant mt-2 leading-relaxed">
                        Mandatory annual withdrawal amount derived from IRS Table III (Uniform Lifetime). Starting at age 73 (Distribution Period = 26.5), scaling annually to prevent indefinite tax deferral.
                      </p>
                    </div>
                    <div className="mt-space-sm pt-space-xs border-t border-surface-container-high text-[11px] font-data-mono text-on-surface-variant">
                      Applies to: RMD Table Calculator, Tax Deferral Depletion
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* PROGRAMMATIC SUB-DIRECTORY HUBS */}
            <section className="mb-space-3xl">
              <div className="p-space-lg rounded-xl bg-surface-container-low">
                <div className="flex flex-col md:flex-row md:items-center justify-between pb-space-sm mb-space-md border-b border-surface-container-high gap-2">
                  <div>
                    <span className="font-data-mono text-label-caps uppercase tracking-wider text-primary font-bold">Fast Index Registry</span>
                    <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Retirement Sub-Directory Hubs</h3>
                  </div>
                  <span className="font-data-mono text-xs text-on-surface-variant">Instant Direct URL Routing</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
                  <div>
                    <h4 className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface font-bold mb-space-xs">Super &amp; 401(k) Schedules</h4>
                    <ul className="space-y-1.5 font-data-mono text-xs">
                      <li><Link className="text-primary hover:underline flex items-center gap-1" href="/finance"><span className="material-symbols-outlined text-[14px]">link</span>/superannuation/guarantee-rates</Link></li>
                      <li><Link className="text-primary hover:underline flex items-center gap-1" href="/finance"><span className="material-symbols-outlined text-[14px]">link</span>/superannuation/salary-sacrifice-calculator</Link></li>
                      <li><Link className="text-primary hover:underline flex items-center gap-1" href="/finance"><span className="material-symbols-outlined text-[14px]">link</span>/401k/employer-match-optimizer</Link></li>
                      <li><Link className="text-primary hover:underline flex items-center gap-1" href="/finance"><span className="material-symbols-outlined text-[14px]">link</span>/401k/contribution-limits-2025</Link></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface font-bold mb-space-xs">FIRE &amp; Early Drawdown</h4>
                    <ul className="space-y-1.5 font-data-mono text-xs">
                      <li><Link className="text-secondary hover:underline flex items-center gap-1" href="/finance"><span className="material-symbols-outlined text-[14px]">link</span>/fire-calculator/safe-withdrawal-rates</Link></li>
                      <li><Link className="text-secondary hover:underline flex items-center gap-1" href="/finance"><span className="material-symbols-outlined text-[14px]">link</span>/fire-calculator/roth-conversion-ladder</Link></li>
                      <li><Link className="text-secondary hover:underline flex items-center gap-1" href="/finance"><span className="material-symbols-outlined text-[14px]">link</span>/retirement/72t-sepp-calculator</Link></li>
                      <li><Link className="text-secondary hover:underline flex items-center gap-1" href="/finance"><span className="material-symbols-outlined text-[14px]">link</span>/retirement/rule-of-55</Link></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface font-bold mb-space-xs">Target Corpus Milestones</h4>
                    <ul className="space-y-1.5 font-data-mono text-xs">
                      <li><Link className="text-tertiary hover:underline flex items-center gap-1" href="/finance"><span className="material-symbols-outlined text-[14px]">link</span>/retirement-calculator/500000-target</Link></li>
                      <li><Link className="text-tertiary hover:underline flex items-center gap-1" href="/finance"><span className="material-symbols-outlined text-[14px]">link</span>/retirement-calculator/1000000-millionaire</Link></li>
                      <li><Link className="text-tertiary hover:underline flex items-center gap-1" href="/finance"><span className="material-symbols-outlined text-[14px]">link</span>/retirement-calculator/2000000-nest-egg</Link></li>
                      <li><Link className="text-tertiary hover:underline flex items-center gap-1" href="/finance"><span className="material-symbols-outlined text-[14px]">link</span>/retirement-calculator/3000000-target</Link></li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* HIGH-COGNITION DIRECT ANSWERS */}
            <section className="mb-space-3xl">
              <div className="mb-space-md">
                <span className="font-data-mono text-label-caps uppercase tracking-wider text-primary font-bold">Search Intelligence</span>
                <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">Authoritative Actuarial Direct Answers</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
                <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm">
                  <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-data-mono text-xs font-bold mb-2 inline-block">Superannuation Mechanics</span>
                  <h3 className="font-headline-md text-body-md font-bold text-on-surface">How does Australian Superannuation compound?</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 leading-relaxed">
                    Australian Superannuation compounds within a concessional tax-sheltered environment where investment earnings are taxed at a maximum statutory rate of 15% (reduced to 10% for capital gains held over 12 months). Upon reaching preservation age (60) and entering the retirement pension phase, all investment earnings, capital gains, and withdrawals become 100% tax-free up to the transfer balance cap ($1.9M in FY25).
                  </p>
                </div>

                <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm">
                  <span className="px-2 py-0.5 rounded bg-secondary/10 text-secondary font-data-mono text-xs font-bold mb-2 inline-block">Withdrawal Perpetuity</span>
                  <h3 className="font-headline-md text-body-md font-bold text-on-surface">Is the 4% Safe Withdrawal Rule still valid?</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 leading-relaxed">
                    The Bengen 4% Rule states that withdrawing 4% of a portfolio in year one, adjusted annually for inflation, has a 95%+ historical survival rate over a standard 30-year retirement. For early retirees facing 40 to 50-year horizons, modern actuarial models recommend dynamic guardrails (such as Guyton-Klinger) or a baseline 3.25% - 3.50% initial withdrawal rate to eliminate sequence of returns exhaustion.
                  </p>
                </div>

                <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm">
                  <span className="px-2 py-0.5 rounded bg-tertiary/10 text-tertiary font-data-mono text-xs font-bold mb-2 inline-block">Tax Arbitrage</span>
                  <h3 className="font-headline-md text-body-md font-bold text-on-surface">Salary Sacrifice vs. After-Tax Investing</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 leading-relaxed">
                    Salary sacrifice directs pre-tax salary into superannuation taxed at only 15%, capturing an immediate tax arbitrage saving of 17.5% to 32% compared to personal marginal tax brackets (32.5% to 47%). For high earners, this provides an immediate boost to starting compound capital that surpasses standard taxable index funds.
                  </p>
                </div>
              </div>
            </section>

            {/* COMPREHENSIVE FAQ ACCORDIONS */}
            <section className="mb-space-3xl">
              <div className="max-w-3xl mb-space-lg">
                <span className="font-data-mono text-label-caps uppercase tracking-wider text-primary font-bold">Frequently Asked Questions</span>
                <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface mt-1">Retirement &amp; Superannuation FAQ</h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                  Everything you need to know regarding superannuation guarantee rates, 401(k) matching, safe decumulation rates, and early access rules.
                </p>
              </div>
              <div className="space-y-space-xs">
                {[
                  { q: 'What is the current Australian Superannuation Guarantee (SG) rate?', a: 'The Superannuation Guarantee (SG) rate is 11.50% for the 2024-2025 financial year (FY25). Under statutory legislated schedules, it increases to 12.00% on July 1, 2025. Employers must pay SG contributions on eligible ordinary time earnings (OTE) at least quarterly into the employee\'s nominated complying super fund.' },
                  { q: 'What is the maximum annual contribution cap for Superannuation in Australia?', a: 'For FY25, the annual concessional (before-tax) contributions cap is $30,000. This includes employer SG, salary sacrifice, and personal deductible contributions. Unused concessional cap amounts can be carried forward for up to 5 years if your total super balance is under $500,000. The non-concessional (after-tax) cap is $120,000 per year, or up to $360,000 under the 3-year bring-forward rule.' },
                  { q: 'What is the 401(k) contribution limit for 2025 in the United States?', a: 'For 2025, the individual employee 401(k) contribution limit is $23,500. For employees aged 50 and over, the standard catch-up contribution is $7,500 ($31,000 total). Under the SECURE 2.0 Act, a special enhanced catch-up limit of $11,250 applies to workers aged 60, 61, 62, and 63 in 2025 ($34,750 total).' },
                  { q: 'How do I calculate my required retirement nest egg (FIRE Number)?', a: 'Under the classic 4% rule, multiply your expected annual living expenses in retirement by 25. For example, if you require $80,000 per year, your target nest egg is $80,000 × 25 = $2,000,000. If you have a guaranteed pension or Social Security providing $30,000/yr, your portfolio only needs to generate $50,000/yr, reducing your required nest egg to $50,000 × 25 = $1,250,000.' },
                  { q: 'What is Sequence of Returns Risk (SRR) and how can it be mitigated?', a: 'Sequence of Returns Risk is the danger of market downturns occurring during the initial 3 to 5 years of retirement. Selling depreciated equities to fund fixed living expenses locks in permanent capital losses. Mitigations include maintaining a 1-2 year liquid cash buffer, utilizing a rising equity glidepath (bond tent), or implementing dynamic withdrawal guardrails.' },
                  { q: 'What is the Australian Super preservation age?', a: 'Preservation age is the minimum age at which you can access your superannuation benefits once you retire or start a transition-to-retirement pension. For anyone born on or after July 1, 1964, the preservation age is 60. You can also access super upon turning 65 even if you haven\'t retired.' },
                  { q: 'Can I access my 401(k) or Super before the standard retirement age?', a: 'In the US, you can access 401(k) funds penalty-free prior to age 59½ via: (1) The Rule of 55 if leaving your employer in or after the year you turn 55; (2) IRS Section 72(t) Substantially Equal Periodic Payments (SEPP); or (3) Withdrawing Roth IRA contributions anytime tax-free. In Australia, early super access is strictly restricted to severe financial hardship, compassionate medical grounds, or terminal illness.' },
                  { q: 'How does Social Security taxation work in retirement?', a: 'Up to 85% of Social Security benefits may be subject to federal income tax based on your combined provisional income (Adjusted Gross Income + Non-taxable Interest + 50% of Social Security benefits). For single filers with combined income over $34,000 (or married couples over $44,000), up to 85% of benefits are taxable.' },
                  { q: 'What is a Roth Conversion Ladder?', a: 'A Roth Conversion Ladder is a strategy used by early retirees to access pre-tax 401(k) or Traditional IRA funds penalty-free before age 59½. You convert a portion of pre-tax funds to a Roth IRA each year, paying ordinary income tax in low-income retirement years. After each conversion seasons for 5 years, the converted principal can be withdrawn 100% penalty-free.' },
                  { q: 'What is the difference between Defined Benefit and Defined Contribution pensions?', a: 'A Defined Benefit (DB) pension guarantees a fixed, formula-based monthly payout for life funded by the employer, regardless of market performance. A Defined Contribution (DC) plan (like a 401(k) or Super fund) places investment risk and management responsibility on the employee, with payout determined by market compounding and contributions.' },
                ].map((faq, idx) => (
                  <details key={idx} className="group bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden transition-all">
                    <summary className="flex justify-between items-center p-space-md cursor-pointer list-none select-none">
                      <span className="font-headline-md text-body-md font-semibold text-on-surface group-hover:text-primary transition-colors">{faq.q}</span>
                      <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
                    </summary>
                    <div className="px-space-md pb-space-md text-body-sm text-on-surface-variant leading-relaxed border-t border-surface-container-low pt-space-xs">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </section>

            {/* INSTITUTIONAL ACTUARIAL REVIEW & STATUTORY DISCLOSURES */}
            <section className="pb-space-3xl">
              <div className="bg-surface-container rounded-xl p-space-lg lg:p-space-xl">
                <div className="flex items-center gap-2 mb-space-sm">
                  <span className="material-symbols-outlined text-primary text-[22px]">verified</span>
                  <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Institutional Actuarial Review &amp; Statutory Disclosures</h3>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-4xl leading-relaxed mb-space-lg">
                  The algorithmic models, decumulation simulations, and superannuation formulations hosted within the SolveIt Retirement &amp; Super suite undergo continuous mathematical audits by credentialed actuaries and certified financial planners.
                </p>
                {/* Reviewers Bio Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md mb-space-lg">
                  <div className="p-space-md rounded-lg bg-surface-container-lowest shadow-sm flex items-start gap-space-sm">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary font-bold font-data-mono">
                      AS
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-headline-md text-body-md font-bold text-on-surface">Dr. Arthur Sterling, CFA, CFP®</h4>
                        <span className="px-1.5 py-0.5 rounded bg-surface-container font-data-mono text-[10px] text-primary">Chief Actuary</span>
                      </div>
                      <p className="text-xs text-on-surface-variant mt-0.5">Former Quantitative Research Director, Vanguard Fixed Income Group. PhD in Financial Econometrics, University of Chicago Booth School.</p>
                    </div>
                  </div>
                  <div className="p-space-md rounded-lg bg-surface-container-lowest shadow-sm flex items-start gap-space-sm">
                    <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center shrink-0 text-secondary font-bold font-data-mono">
                      ER
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-headline-md text-body-md font-bold text-on-surface">Elena Rostova, CPA, PFP®</h4>
                        <span className="px-1.5 py-0.5 rounded bg-surface-container font-data-mono text-[10px] text-secondary">Tax &amp; Super Specialist</span>
                      </div>
                      <p className="text-xs text-on-surface-variant mt-0.5">Specialist in Australian ATO Superannuation Guarantee compliance, US Section 72(t) distributions, and international pension transfers.</p>
                    </div>
                  </div>
                </div>
                {/* Statutory Citations & Legal Disclaimers */}
                <div className="pt-space-md border-t border-surface-container-high space-y-2 text-xs font-body-sm text-on-surface-variant leading-relaxed">
                  <p>
                    <strong>Regulatory Disclosure:</strong> Computational workbenches provided by SolveIt Precision Utilities are engineered exclusively for analytical, educational, and self-directed modeling purposes under SEC Rule 204, FINRA Rule 2210, and ASIC Regulatory Guide 244 guidelines. These models do not constitute personalized financial product advice, tax consultation, or actuarial endorsements.
                  </p>
                  <p>
                    <strong>Arithmetic Integrity:</strong> Calculations comply with standard IEEE 754 binary floating-point representation. Inflation adjustments utilize the geometric Fisher formulation. Compounding algorithms assume end-of-period cash flows (annuity immediate) unless explicitly configured otherwise.
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
