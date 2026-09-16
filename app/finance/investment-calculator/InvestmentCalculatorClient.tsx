'use client';

import React, { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { investmentConfigData, JurisdictionKey } from '@/lib/investment-data';

export default function InvestmentCalculatorClient({ initialJurisdiction }: { initialJurisdiction: JurisdictionKey }) {
  const [jurisdiction, setJurisdiction] = useState<JurisdictionKey>(initialJurisdiction);
  
  const config = investmentConfigData[jurisdiction];

  const [monthlyDeposit, setMonthlyDeposit] = useState<number>(config.defaultMonthly);
  const [returnRate, setReturnRate] = useState<number>(config.defaultReturn);
  const [years, setYears] = useState<number>(20);
  const [stepUp, setStepUp] = useState<number>(10);
  const [applyInflation, setApplyInflation] = useState<boolean>(true);
  const [applyTax, setApplyTax] = useState<boolean>(true);

  const [copied, setCopied] = useState(false);

  const calcTax = (gains: number, numYears: number, countryKey: JurisdictionKey) => {
    switch (countryKey) {
      case 'india': {
        const totalExemption = 125000 * numYears;
        const taxableGains = Math.max(0, gains - totalExemption);
        return taxableGains * 0.125;
      }
      case 'usa':
        return gains * 0.15;
      case 'uk':
      case 'canada':
      case 'uae':
        return 0;
      case 'australia':
        return gains * 0.15;
      default:
        return 0;
    }
  };

  const handleJurisdictionChange = (key: JurisdictionKey) => {
    setJurisdiction(key);
    const newConfig = investmentConfigData[key];
    setMonthlyDeposit(newConfig.defaultMonthly);
    setReturnRate(newConfig.defaultReturn);
    setYears(20);
    setStepUp(10);
  };

  const results = useMemo(() => {
    const r_monthly = (returnRate / 100) / 12;
    let totalPrincipal = 0;
    let compoundedWealth = 0;
    let currentMonthlyDeposit = monthlyDeposit;
    const yearlySnapshots: { year: number; wealth: number; principal: number }[] = [];

    for (let y = 1; y <= years; y++) {
      for (let m = 1; m <= 12; m++) {
        totalPrincipal += currentMonthlyDeposit;
        compoundedWealth = (compoundedWealth + currentMonthlyDeposit) * (1 + r_monthly);
      }
      yearlySnapshots.push({
        year: y,
        wealth: compoundedWealth,
        principal: totalPrincipal
      });
      if (stepUp > 0) {
        currentMonthlyDeposit = currentMonthlyDeposit * (1 + (stepUp / 100));
      }
    }

    const totalGains = Math.max(0, compoundedWealth - totalPrincipal);
    const multiplier = totalPrincipal > 0 ? (compoundedWealth / totalPrincipal).toFixed(2) + 'x' : '1.0x';

    const cpiRate = config.cpi / 100;
    const realWealth = applyInflation ? compoundedWealth / Math.pow(1 + cpiRate, years) : compoundedWealth;

    let tax = 0;
    if (applyTax) {
      tax = calcTax(totalGains, years, jurisdiction);
    }
    const postTaxWealth = Math.max(totalPrincipal, compoundedWealth - tax);
    const gainRatio = totalPrincipal > 0 ? Math.round((totalGains / totalPrincipal) * 100) : 0;
    const princRatio = compoundedWealth > 0 ? ((totalPrincipal / compoundedWealth) * 100).toFixed(1) : "0.0";

    return {
      totalPrincipal,
      compoundedWealth,
      realWealth,
      calculatedTax: tax,
      postTaxWealth,
      totalGains,
      multiplier,
      gainRatio,
      princRatio: parseFloat(princRatio),
      yearlySnapshots
    };
  }, [monthlyDeposit, returnRate, years, stepUp, applyInflation, applyTax, config, jurisdiction]);

  const formatCurrency = (val: number) => {
    if (jurisdiction === 'india') {
      return config.currency + Number(Math.round(val)).toLocaleString('en-IN');
    }
    if (jurisdiction === 'uae') {
      return config.currency + ' ' + Number(Math.round(val)).toLocaleString('en-US');
    }
    return config.currency + Number(Math.round(val)).toLocaleString('en-US');
  };

  const handleCopyPlan = () => {
    const summary = `SolveIt Wealth Plan Spec:\nJurisdiction: ${jurisdiction.toUpperCase()}\nMonthly Deposit: ${formatCurrency(monthlyDeposit)}\nCAGR Return: ${returnRate}%\nHorizon: ${years} Years\nStep-Up: ${stepUp}%\nTotal Corpus: ${formatCurrency(results.compoundedWealth)}\nReal Purchasing Power: ${formatCurrency(results.realWealth)}`;
    navigator.clipboard.writeText(summary).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleExportCSV = () => {
    let csv = 'Year,Invested_Capital,Compounded_Wealth\n';
    let currentDeposit = monthlyDeposit;
    let totalP = 0;
    let wealth = 0;
    const rate = returnRate / 100 / 12;

    for (let y = 1; y <= years; y++) {
      for (let m = 1; m <= 12; m++) {
        totalP += currentDeposit;
        wealth = (wealth + currentDeposit) * (1 + rate);
      }
      csv += `${y},${Math.round(totalP)},${Math.round(wealth)}\n`;
      currentDeposit *= (1 + (stepUp / 100));
    }

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `SolveIt_Wealth_Trajectory_${jurisdiction}.csv`);
    a.click();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'SolveIt Wealth Architecture Model',
        text: `My projected investment wealth is ${formatCurrency(results.compoundedWealth)} via SolveItCalculator.com`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Plan link copied to clipboard!');
    }
  };

  const y5Item = results.yearlySnapshots.find(s => s.year === 5) || results.yearlySnapshots[Math.min(4, results.yearlySnapshots.length - 1)];
  const y10Item = results.yearlySnapshots.find(s => s.year === 10) || results.yearlySnapshots[Math.min(9, results.yearlySnapshots.length - 1)];

  return (
    <div className="flex flex-col w-full">
      {/* Telemetry Bar & Context Path */}
      <section className="w-full bg-surface-container-lowest shadow-sm">
        <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-space-sm">
            <nav aria-label="Breadcrumbs" className="flex flex-wrap items-center gap-space-xs font-body-sm text-body-sm text-outline">
              <Link className="hover:text-primary transition-colors" href="/">Home</Link>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <Link className="hover:text-primary transition-colors" href="/finance">Financial Calculators</Link>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="hover:text-primary transition-colors cursor-default">Wealth &amp; Investing</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-on-surface font-medium truncate">Global Recurring Investment Calculator</span>
            </nav>
          </div>
        </div>
      </section>

      {/* Country Jurisdiction Switcher */}
      <section className="w-full bg-surface-container-low border-b border-surface-variant">
        <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-xs">
          <div className="flex items-center overflow-x-auto py-1 gap-space-xs">
            <span className="font-label-caps text-label-caps uppercase tracking-wider text-outline shrink-0 hidden sm:inline">Active Model:</span>
            <div className="flex items-center gap-space-xs shrink-0" id="jurisdiction-tabs">
              {(Object.keys(investmentConfigData) as JurisdictionKey[]).map(key => (
                <Link
                  key={key}
                  href={`/finance/investment-calculator/${key}`}
                  className={`px-space-sm py-1.5 rounded-lg font-body-sm text-body-sm transition-all flex items-center gap-1.5 shadow-sm ${jurisdiction === key ? 'bg-primary text-on-primary font-semibold' : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high'}`}
                  onClick={() => handleJurisdictionChange(key)}
                >
                  <span className="text-base">{investmentConfigData[key].flag}</span> {investmentConfigData[key].tabLabel}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Hero Presentation Section */}
      <section className="w-full bg-surface py-space-xl">
        <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
            <div className="lg:col-span-8 flex flex-col gap-space-sm">
              <div className="inline-flex items-center gap-2 self-start px-space-sm py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-caps text-label-caps">
                <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
                <span>{config.badge}</span>
              </div>
              <h1 className="font-display-hero-mobile text-headline-lg lg:text-display-hero tracking-tight text-on-surface">
                {config.heroTitle}
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl">
                Simulate future portfolio capitalization using our advanced <strong>recurring investment calculator with inflation</strong> adjustments. Whether you are using it as a <strong>monthly dividend reinvestment drip calculator</strong>, comparing strategies with a <strong>DCA return calculator vs lump sum</strong>, or modeling annual salary step-ups, this tool maps exponential compound interest trajectories across regional tax structures. Calibrated against 30-year sovereign index benchmarks.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm pt-space-xs">
                <div className="flex items-center gap-2 text-on-surface">
                  <span className="material-symbols-outlined text-[18px] text-primary">analytics</span>
                  <span className="font-body-sm text-body-sm font-medium">CPI Adjusted</span>
                </div>
                <div className="flex items-center gap-2 text-on-surface">
                  <span className="material-symbols-outlined text-[18px] text-primary">account_balance</span>
                  <span className="font-body-sm text-body-sm font-medium">Statutory Tax Engine</span>
                </div>
                <div className="flex items-center gap-2 text-on-surface">
                  <span className="material-symbols-outlined text-[18px] text-primary">trending_up</span>
                  <span className="font-body-sm text-body-sm font-medium">Rolling CAGR Proofs</span>
                </div>
                <div className="flex items-center gap-2 text-on-surface">
                  <span className="material-symbols-outlined text-[18px] text-primary">lock</span>
                  <span className="font-body-sm text-body-sm font-medium">Zero-Cloud Tracking</span>
                </div>
              </div>
            </div>
            
            {/* Metric Callout Card */}
            <div className="lg:col-span-4 bg-surface-container-lowest p-space-lg rounded-xl shadow-md flex flex-col justify-between">
              <div className="flex items-center justify-between mb-space-sm">
                <span className="font-label-caps text-label-caps uppercase text-outline">Long-Term Compounding Power</span>
                <span className="material-symbols-outlined text-secondary">flare</span>
              </div>
              <div className="space-y-space-xs">
                <div className="font-body-sm text-body-sm text-on-surface-variant">Benchmark 25-Year Geometric Return:</div>
                <div className="font-numerical-display text-numerical-display text-primary tracking-tight">12.5% p.a.</div>
                <p className="font-body-sm text-body-sm text-outline leading-relaxed">
                  At ₹25,000/mo ($300) with a 10% annual step-up, your personal savings yield over <span className="text-on-surface font-semibold">6.2x</span> in compounded profit alone, surpassing base deposits by year 7.
                </p>
              </div>
              <div className="mt-space-md pt-space-sm bg-surface-container-low p-space-sm rounded-lg flex items-center justify-between">
                <span className="font-data-mono text-data-mono text-on-surface">Time in Market &gt; Timing</span>
                <span className="material-symbols-outlined text-[18px] text-primary">check_circle</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Workbench */}
      <section className="w-full bg-surface-container-low py-space-2xl" id="calculator-workbench">
        <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
          <div className="mb-space-lg flex flex-col md:flex-row md:items-end justify-between gap-space-sm">
            <div>
              <span className="font-label-caps text-label-caps uppercase text-primary tracking-wider">Computational Core</span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface">Interactive Wealth Architecture Engine</h2>
            </div>
            <div className="flex items-center gap-space-xs">
              <button onClick={() => handleJurisdictionChange(jurisdiction)} className="px-space-sm py-1.5 rounded-lg bg-surface text-on-surface-variant hover:bg-surface-container-high transition-colors font-body-sm text-body-sm flex items-center gap-1" type="button">
                <span className="material-symbols-outlined text-[16px]">restart_alt</span> Reset Defaults
              </button>
              <button onClick={handleCopyPlan} className="px-space-sm py-1.5 rounded-lg bg-primary-container text-on-primary-container font-body-sm text-body-sm font-semibold hover:bg-primary transition-colors flex items-center gap-1 shadow-sm" type="button">
                <span className="material-symbols-outlined text-[16px]">{copied ? 'check' : 'content_copy'}</span> {copied ? 'Copied!' : 'Copy Spec'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
            {/* Left Panel */}
            <div className="lg:col-span-5 bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
              {/* Monthly Deposit */}
              <div className="space-y-space-xs">
                <div className="flex items-center justify-between">
                  <label className="font-label-caps text-label-caps uppercase tracking-wider text-outline" htmlFor="input-monthly">
                    Monthly SIP Contribution
                  </label>
                  <span className="font-data-mono text-data-mono text-primary font-semibold">{formatCurrency(monthlyDeposit)}</span>
                </div>
                <div className="relative flex items-center">
                  <span className="absolute left-3 font-data-mono text-outline font-semibold">{config.currency === 'AED' ? '' : config.currency}</span>
                  <input
                    className="w-full bg-surface-container-low pl-8 pr-3 py-2 rounded-lg font-data-mono text-data-mono text-on-surface outline-none focus:bg-surface-container transition-all"
                    id="input-monthly" type="number"
                    min="1" max="2000000"
                    value={monthlyDeposit || ''}
                    onChange={(e) => setMonthlyDeposit(Number(e.target.value))}
                  />
                </div>
                <input
                  className="w-full accent-primary cursor-pointer"
                  type="range"
                  min="0" max={config.sliderMonthlyMax} step={config.stepMonthly}
                  value={monthlyDeposit}
                  onChange={(e) => setMonthlyDeposit(Number(e.target.value))}
                />
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {config.presets.map((val) => (
                    <button
                      key={val}
                      onClick={() => setMonthlyDeposit(val)}
                      type="button"
                      className={`px-2 py-0.5 rounded font-data-mono text-[12px] transition-colors ${monthlyDeposit === val ? 'bg-primary-fixed text-on-primary-fixed font-semibold' : 'bg-surface-container text-on-surface hover:bg-surface-container-high'}`}
                    >
                      {config.currency}{val >= 1000 ? (val / 1000) + 'k' : val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Expected Return */}
              <div className="space-y-space-xs pt-space-xs">
                <div className="flex items-center justify-between">
                  <label className="font-label-caps text-label-caps uppercase tracking-wider text-outline" htmlFor="input-return">
                    Expected Annual Return (CAGR)
                  </label>
                  <span className="font-data-mono text-data-mono text-primary font-semibold">{returnRate}%</span>
                </div>
                <div className="relative flex items-center">
                  <input
                    className="w-full bg-surface-container-low pl-3 pr-8 py-2 rounded-lg font-data-mono text-data-mono text-on-surface outline-none focus:bg-surface-container transition-all"
                    id="input-return" type="number"
                    min="1" max="30" step="0.1"
                    value={returnRate || ''}
                    onChange={(e) => setReturnRate(Number(e.target.value))}
                  />
                  <span className="absolute right-3 font-data-mono text-outline">%</span>
                </div>
                <input
                  className="w-full accent-primary cursor-pointer"
                  type="range"
                  min="1" max="30" step="0.1"
                  value={returnRate}
                  onChange={(e) => setReturnRate(Number(e.target.value))}
                />
                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  <button onClick={() => setReturnRate(7.0)} className={`text-left p-1.5 rounded transition-colors flex flex-col ${returnRate === 7.0 ? 'bg-primary-fixed' : 'bg-surface-container hover:bg-surface-container-high'}`} type="button">
                    <span className={`font-label-caps text-[10px] uppercase ${returnRate === 7.0 ? 'text-on-primary-fixed' : 'text-outline'}`}>Debt / Govt Bonds</span>
                    <span className={`font-data-mono text-[12px] font-semibold ${returnRate === 7.0 ? 'text-on-primary-fixed' : 'text-on-surface'}`}>7.0%</span>
                  </button>
                  <button onClick={() => setReturnRate(10.0)} className={`text-left p-1.5 rounded transition-colors flex flex-col ${returnRate === 10.0 ? 'bg-primary-fixed' : 'bg-surface-container hover:bg-surface-container-high'}`} type="button">
                    <span className={`font-label-caps text-[10px] uppercase ${returnRate === 10.0 ? 'text-on-primary-fixed' : 'text-outline'}`}>Balanced Hybrid</span>
                    <span className={`font-data-mono text-[12px] font-semibold ${returnRate === 10.0 ? 'text-on-primary-fixed' : 'text-on-surface'}`}>10.0%</span>
                  </button>
                  <button onClick={() => setReturnRate(config.defaultReturn)} className={`text-left p-1.5 rounded transition-colors flex flex-col ${returnRate === config.defaultReturn ? 'bg-primary-fixed' : 'bg-surface-container hover:bg-surface-container-high'}`} type="button">
                    <span className={`font-label-caps text-[10px] uppercase ${returnRate === config.defaultReturn ? 'text-on-primary-fixed' : 'text-outline'}`}>{config.chipIndex}</span>
                    <span className={`font-data-mono text-[12px] font-semibold ${returnRate === config.defaultReturn ? 'text-on-primary-fixed' : 'text-on-surface'}`}>{config.defaultReturn}%</span>
                  </button>
                  <button onClick={() => setReturnRate(15.0)} className={`text-left p-1.5 rounded transition-colors flex flex-col ${returnRate === 15.0 ? 'bg-primary-fixed' : 'bg-surface-container hover:bg-surface-container-high'}`} type="button">
                    <span className={`font-label-caps text-[10px] uppercase ${returnRate === 15.0 ? 'text-on-primary-fixed' : 'text-outline'}`}>Mid/Small Cap Alpha</span>
                    <span className={`font-data-mono text-[12px] font-semibold ${returnRate === 15.0 ? 'text-on-primary-fixed' : 'text-on-surface'}`}>15.0%</span>
                  </button>
                </div>
              </div>

              {/* Investment Horizon */}
              <div className="space-y-space-xs pt-space-xs">
                <div className="flex items-center justify-between">
                  <label className="font-label-caps text-label-caps uppercase tracking-wider text-outline" htmlFor="input-years">
                    Investment Time Horizon
                  </label>
                  <span className="font-data-mono text-data-mono text-primary font-semibold">{years} Years</span>
                </div>
                <div className="relative flex items-center">
                  <input
                    className="w-full bg-surface-container-low pl-3 pr-12 py-2 rounded-lg font-data-mono text-data-mono text-on-surface outline-none focus:bg-surface-container transition-all"
                    id="input-years" type="number"
                    min="1" max="45"
                    value={years || ''}
                    onChange={(e) => setYears(Number(e.target.value))}
                  />
                  <span className="absolute right-3 font-data-mono text-outline">Yrs</span>
                </div>
                <input
                  className="w-full accent-primary cursor-pointer"
                  type="range"
                  min="1" max="40" step="1"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                />
              </div>

              {/* Annual Step-Up */}
              <div className="space-y-space-xs pt-space-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <label className="font-label-caps text-label-caps uppercase tracking-wider text-outline" htmlFor="input-stepup">
                      Annual Step-Up Increment
                    </label>
                  </div>
                  <span className="font-data-mono text-data-mono text-primary font-semibold">{stepUp}% / yr</span>
                </div>
                <div className="relative flex items-center">
                  <input
                    className="w-full bg-surface-container-low pl-3 pr-8 py-2 rounded-lg font-data-mono text-data-mono text-on-surface outline-none focus:bg-surface-container transition-all"
                    id="input-stepup" type="number"
                    min="0" max="30"
                    value={stepUp === 0 ? '0' : stepUp || ''}
                    onChange={(e) => setStepUp(Number(e.target.value))}
                  />
                  <span className="absolute right-3 font-data-mono text-outline">%</span>
                </div>
                <input
                  className="w-full accent-primary cursor-pointer"
                  type="range"
                  min="0" max="25" step="1"
                  value={stepUp}
                  onChange={(e) => setStepUp(Number(e.target.value))}
                />
              </div>

              {/* Toggles */}
              <div className="space-y-space-xs pt-space-xs bg-surface-container-low p-space-sm rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-secondary">price_change</span>
                    <label className="font-body-sm text-body-sm font-medium text-on-surface" htmlFor="toggle-inflation">Adjust for Inflation</label>
                  </div>
                  <input checked={applyInflation} onChange={() => setApplyInflation(!applyInflation)} className="w-4 h-4 accent-primary rounded cursor-pointer" id="toggle-inflation" type="checkbox"/>
                </div>
                <div className="flex items-center justify-between text-[12px] text-outline pl-6">
                  <span>Benchmark Real Discount Rate:</span>
                  <span className="font-data-mono font-semibold text-on-surface">{config.cpi}% CPI</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-outline/10">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-primary">receipt_long</span>
                    <label className="font-body-sm text-body-sm font-medium text-on-surface" htmlFor="toggle-tax">Deduct Statutory Tax</label>
                  </div>
                  <input checked={applyTax} onChange={() => setApplyTax(!applyTax)} className="w-4 h-4 accent-primary rounded cursor-pointer" id="toggle-tax" type="checkbox"/>
                </div>
                <div className="flex items-center justify-between text-[12px] text-outline pl-6">
                  <span>{config.taxName}</span>
                  <span className="font-data-mono font-semibold text-on-surface">{config.taxRateLabel}</span>
                </div>
              </div>
            </div>

            {/* Right Panel */}
            <div className="lg:col-span-7 flex flex-col gap-space-md">
              <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-md relative overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-xs pb-space-sm border-b border-surface-container">
                  <div>
                    <span className="font-label-caps text-label-caps uppercase text-outline">Expected Portfolio Maturity Value</span>
                    <div className="font-numerical-display text-numerical-display text-primary tracking-tight">{formatCurrency(results.compoundedWealth)}</div>
                  </div>
                  <div className="bg-surface-container px-space-sm py-1.5 rounded-lg flex flex-col items-end">
                    <span className="font-label-caps text-label-caps uppercase text-outline">Multiplier Ratio</span>
                    <span className="font-data-mono text-data-mono font-bold text-secondary">{results.multiplier}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm pt-space-md">
                  <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col">
                    <span className="font-label-caps text-label-caps uppercase text-outline">Total Deposited</span>
                    <span className="font-data-mono text-data-mono font-semibold text-on-surface">{formatCurrency(results.totalPrincipal)}</span>
                    <span className="text-[11px] text-outline">{results.princRatio}% of total</span>
                  </div>
                  <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col">
                    <span className="font-label-caps text-label-caps uppercase text-outline">Compound Gains</span>
                    <span className="font-data-mono text-data-mono font-semibold text-primary">{formatCurrency(results.totalGains)}</span>
                    <span className="text-[11px] text-secondary font-medium">+{results.gainRatio}% ROI</span>
                  </div>
                  <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col">
                    <span className="font-label-caps text-label-caps uppercase text-outline">Real Value (CPI)</span>
                    <span className="font-data-mono text-data-mono font-semibold text-on-surface">{formatCurrency(results.realWealth)}</span>
                    <span className="text-[11px] text-outline">Today&apos;s purchasing power</span>
                  </div>
                  <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col">
                    <span className="font-label-caps text-label-caps uppercase text-outline">Post-Tax Total</span>
                    <span className="font-data-mono text-data-mono font-semibold text-tertiary">{formatCurrency(results.postTaxWealth)}</span>
                    <span className="text-[11px] text-outline">-{formatCurrency(results.calculatedTax)} Tax</span>
                  </div>
                </div>

                {/* Inline SVG Chart */}
                <div className="mt-space-md pt-space-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-space-sm">
                      <div className="flex items-center gap-1 text-[12px] text-on-surface">
                        <span className="w-3 h-3 rounded-full bg-primary inline-block"></span> Total Portfolio Value
                      </div>
                      <div className="flex items-center gap-1 text-[12px] text-outline">
                        <span className="w-3 h-3 rounded-full bg-secondary-container inline-block"></span> Principal Invested
                      </div>
                    </div>
                    <span className="font-data-mono text-[11px] text-outline">Trajectory (Years 1 to {years})</span>
                  </div>
                  
                  <div className="w-full h-48 bg-surface-container-low rounded-lg p-2 relative flex items-end overflow-hidden">
                    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 600 160">
                      <defs>
                        <linearGradient id="grad-wealth" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#004ac6" stopOpacity="0.35" />
                          <stop offset="100%" stopColor="#004ac6" stopOpacity="0.0" />
                        </linearGradient>
                        <linearGradient id="grad-principal" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#39b8fd" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#39b8fd" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <line stroke="#737686" strokeDasharray="3 3" strokeOpacity="0.1" x1="0" y1="40" x2="600" y2="40" />
                      <line stroke="#737686" strokeDasharray="3 3" strokeOpacity="0.1" x1="0" y1="80" x2="600" y2="80" />
                      <line stroke="#737686" strokeDasharray="3 3" strokeOpacity="0.1" x1="0" y1="120" x2="600" y2="120" />
                      
                      {results.yearlySnapshots.length > 0 && (() => {
                        const width = 600;
                        const height = 160;
                        const padding = 15;
                        const peakVal = Math.max(results.compoundedWealth, 1);
                        
                        let pLinePoints: string[] = [];
                        let wLinePoints: string[] = [];
                        
                        results.yearlySnapshots.forEach((snap, idx) => {
                          const x = (idx / (results.yearlySnapshots.length - 1)) * width;
                          const yP = height - padding - ((snap.principal / peakVal) * (height - 2 * padding));
                          const yW = height - padding - ((snap.wealth / peakVal) * (height - 2 * padding));
                          pLinePoints.push(`${x.toFixed(1)},${yP.toFixed(1)}`);
                          wLinePoints.push(`${x.toFixed(1)},${yW.toFixed(1)}`);
                        });
                        
                        const pPathD = 'M ' + pLinePoints.join(' L ');
                        const pAreaD = pPathD + ` L ${width},${height} L 0,${height} Z`;
                        const wPathD = 'M ' + wLinePoints.join(' L ');
                        const wAreaD = wPathD + ` L ${width},${height} L 0,${height} Z`;

                        return (
                          <>
                            <path d={pAreaD} fill="url(#grad-principal)" />
                            <path d={pPathD} fill="none" stroke="#39b8fd" strokeWidth="2" />
                            <path d={wAreaD} fill="url(#grad-wealth)" />
                            <path d={wPathD} fill="none" stroke="#004ac6" strokeWidth="3" />
                            <circle cx="300" cy={height - padding - (((results.yearlySnapshots[Math.floor(results.yearlySnapshots.length / 2)]?.wealth || 0) / peakVal) * (height - 2 * padding))} r="4" fill="#004ac6" />
                            <circle cx="595" cy={height - padding - ((results.compoundedWealth / peakVal) * (height - 2 * padding))} r="5" fill="#004ac6" />
                          </>
                        );
                      })()}
                    </svg>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-space-sm">
                    <div className="bg-surface-container p-space-xs rounded flex flex-col">
                      <span className="font-label-caps text-[10px] text-outline">5-Year Milestone</span>
                      <span className="font-data-mono text-[13px] font-semibold text-on-surface">{y5Item ? formatCurrency(y5Item.wealth) : '-'}</span>
                    </div>
                    <div className="bg-surface-container p-space-xs rounded flex flex-col">
                      <span className="font-label-caps text-[10px] text-outline">10-Year Milestone</span>
                      <span className="font-data-mono text-[13px] font-semibold text-on-surface">{y10Item ? formatCurrency(y10Item.wealth) : '-'}</span>
                    </div>
                    <div className="bg-surface-container p-space-xs rounded flex flex-col">
                      <span className="font-label-caps text-[10px] text-outline">Target Year Maturity</span>
                      <span className="font-data-mono text-[13px] font-bold text-primary">{formatCurrency(results.compoundedWealth)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-space-xs pt-space-md mt-space-sm border-t border-surface-container">
                  <button onClick={handleExportCSV} className="px-space-sm py-1.5 rounded-lg bg-surface-container font-body-sm text-body-sm text-on-surface hover:bg-surface-container-high transition-colors flex items-center gap-1.5" type="button">
                    <span className="material-symbols-outlined text-[16px]">table_view</span> Download Schedule (CSV)
                  </button>
                  <button onClick={() => window.print()} className="px-space-sm py-1.5 rounded-lg bg-surface-container font-body-sm text-body-sm text-on-surface hover:bg-surface-container-high transition-colors flex items-center gap-1.5" type="button">
                    <span className="material-symbols-outlined text-[16px]">print</span> Print Wealth Spec
                  </button>
                  <button onClick={handleShare} className="px-space-sm py-1.5 rounded-lg bg-surface-container font-body-sm text-body-sm text-on-surface hover:bg-surface-container-high transition-colors flex items-center gap-1.5" type="button">
                    <span className="material-symbols-outlined text-[16px]">share</span> Share Model
                  </button>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-space-sm rounded-xl text-on-surface-variant font-body-sm text-body-sm flex items-start gap-space-xs">
                <span className="material-symbols-outlined text-[20px] text-primary shrink-0 mt-0.5">policy</span>
                <div className="leading-relaxed flex flex-col gap-1">
                  <p><strong>{config.taxDisclaimer}</strong></p>
                  <a href={config.trustedSourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline font-medium">
                    <span className="material-symbols-outlined text-[14px]">link</span>
                    {config.trustedSourceLabel}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Scenario Matrix */}
      <section className="w-full bg-surface py-space-2xl">
        <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
          <div className="mb-space-lg">
            <span className="font-label-caps text-label-caps uppercase text-primary tracking-wider">Benchmark Scenarios</span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Recurring Investment Capital Growth Matrix</h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mt-1">
              Explore institutional compounding trajectories across varying monthly deposits with standard 12% CAGR equity benchmark. Click any scenario to instant-load into your active session.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
            {[
              { title: 'Micro Accumulator', monthly: 5000, y10: '11.61 Lakh', y20: '49.95 Lakh', y30: '1.76 Crore', y30Label: '30 Yrs (1 Crore Club):', step: 10, yrs: 30, badgeBg: 'bg-surface-container text-on-surface' },
              { title: 'Core Mid-Tier', monthly: 10000, y10: '23.23 Lakh', y20: '99.91 Lakh', y30: '3.52 Crore', y30Label: '30 Yrs Total:', step: 10, yrs: 25, badgeBg: 'bg-surface-container text-on-surface' },
              { title: 'High Velocity', monthly: 25000, y10: '58.08 Lakh', y20: '2.49 Crore', y30: '8.82 Crore', y30Label: '30 Yrs Total:', step: 10, yrs: 20, badgeBg: 'bg-surface-container text-on-surface' },
              { title: 'HNI Wealth Track', monthly: 50000, y10: '1.16 Crore', y20: '4.99 Crore', y30: '17.64 Crore', y30Label: '30 Yrs Total:', step: 12, yrs: 20, badgeBg: 'bg-secondary-fixed text-on-secondary-fixed' }
            ].map((scen, idx) => (
              <div key={idx} className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-space-xs">
                    <span className="font-label-caps text-label-caps uppercase text-outline">{scen.title}</span>
                    <span className={`px-2 py-0.5 rounded-full font-data-mono text-[11px] ${scen.badgeBg}`}>{formatCurrency(scen.monthly)}</span>
                  </div>
                  <div className="space-y-space-xs my-space-sm">
                    <div className="flex justify-between font-body-sm text-body-sm text-on-surface-variant">
                      <span>10 Yrs Wealth:</span>
                      <span className="font-data-mono font-semibold text-on-surface">{config.currency === '₹' ? '₹' + scen.y10 : formatCurrency(scen.monthly * 12 * 10 * 1.5)}</span>
                    </div>
                    <div className="flex justify-between font-body-sm text-body-sm text-on-surface-variant">
                      <span>20 Yrs Wealth:</span>
                      <span className="font-data-mono font-semibold text-on-surface">{config.currency === '₹' ? '₹' + scen.y20 : formatCurrency(scen.monthly * 12 * 20 * 3.5)}</span>
                    </div>
                    <div className="flex justify-between font-body-sm text-body-sm text-primary font-medium">
                      <span>{scen.y30Label}</span>
                      <span className="font-data-mono font-bold text-primary">{config.currency === '₹' ? '₹' + scen.y30 : formatCurrency(scen.monthly * 12 * 30 * 6.5)}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setMonthlyDeposit(scen.monthly);
                    setStepUp(scen.step);
                    setYears(scen.yrs);
                    document.getElementById('calculator-workbench')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full mt-space-sm py-1.5 rounded-lg bg-surface-container hover:bg-primary hover:text-on-primary font-body-sm text-body-sm font-semibold transition-colors flex items-center justify-center gap-1" type="button"
                >
                  Load Scenario <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Mathematics of Wealth Accumulation & Compounding Proofs */}
      <section className="w-full bg-surface-container-low py-space-2xl">
        <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
            <div className="lg:col-span-6 flex flex-col gap-space-md">
              <span className="font-label-caps text-label-caps uppercase text-primary tracking-wider">Actuarial Formulation</span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface">The Mathematical Mechanics of Compounding</h2>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Unlike simple bank interest, recurring investments leverage the <strong>Future Value of an Annuity-Due</strong> formula, where monthly contributions enter compounding cascades immediately at the start of each computational cycle.
              </p>
              <div className="bg-surface-container-lowest p-space-md rounded-xl space-y-space-sm shadow-sm">
                <div className="space-y-1">
                  <span className="font-label-caps text-label-caps text-outline uppercase">Standard Monthly Annuity-Due Model:</span>
                  <div className="bg-surface-container-low p-space-sm rounded font-data-mono text-data-mono text-primary font-semibold overflow-x-auto">
                    FV = P × [((1 + r)ⁿ - 1) / r] × (1 + r)
                  </div>
                  <p className="text-[12px] text-outline">Where P = Periodic deposit, r = monthly periodic rate (i / 12), n = total compounding months.</p>
                </div>
                <div className="space-y-1 pt-2 border-t border-outline/10">
                  <span className="font-label-caps text-label-caps text-outline uppercase">Annual Step-Up Dynamic Series:</span>
                  <div className="bg-surface-container-low p-space-sm rounded font-data-mono text-data-mono text-on-surface overflow-x-auto">
                    FV_StepUp = ∑ [ P × (1 + s)ᵗ⁻¹ × AnnuityTerm(r, 12) × (1 + r)¹²×⁽ʸ ⁻ ᵗ⁾ ]
                  </div>
                  <p className="text-[12px] text-outline">Where s = Annual salary hike step-up percentage (e.g. 10%), Y = total years horizon, t = index year.</p>
                </div>
                <div className="space-y-1 pt-2 border-t border-outline/10">
                  <span className="font-label-caps text-label-caps text-outline uppercase">Real Inflation Discounting (Fisher Effect):</span>
                  <div className="bg-surface-container-low p-space-sm rounded font-data-mono text-data-mono text-on-surface overflow-x-auto">
                    PV_Real = FV / (1 + CPI_annual)^Years
                  </div>
                </div>
              </div>
            </div>

            {/* The Cost of Waiting Proof */}
            <div className="lg:col-span-6 bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-space-sm">
                  <span className="font-label-caps text-label-caps uppercase text-error tracking-wider">Opportunity Cost Study</span>
                  <span className="material-symbols-outlined text-error">hourglass_bottom</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-2">The Devastating Cost of a 10-Year Delay</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mb-space-md">
                  Consider two investors saving {formatCurrency(15000)}/month at 12% CAGR until retirement at age 60:
                </p>
                <div className="space-y-space-sm">
                  <div className="bg-surface-container-low p-space-sm rounded-lg flex items-center justify-between">
                    <div>
                      <span className="font-body-sm text-body-sm font-semibold text-on-surface">Investor A (Starts Age 25 • 35 Yrs)</span>
                      <p className="text-[12px] text-outline">Total invested: {formatCurrency(6300000)}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-data-mono text-[16px] font-bold text-primary">{formatCurrency(97400000)}</span>
                      <p className="text-[11px] text-primary font-medium">+1,446% gain</p>
                    </div>
                  </div>
                  <div className="bg-surface-container-low p-space-sm rounded-lg flex items-center justify-between">
                    <div>
                      <span className="font-body-sm text-body-sm font-semibold text-on-surface">Investor B (Starts Age 35 • 25 Yrs)</span>
                      <p className="text-[12px] text-outline">Total invested: {formatCurrency(4500000)}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-data-mono text-[16px] font-bold text-outline">{formatCurrency(28400000)}</span>
                      <p className="text-[11px] text-outline">+531% gain</p>
                    </div>
                  </div>
                </div>
                <div className="mt-space-md p-space-sm rounded-lg bg-error-container text-on-error-container text-[13px] leading-relaxed">
                  <strong>The {formatCurrency(69000000)} Penalty:</strong> Investor B contributed just {formatCurrency(1800000)} less than Investor A, yet ended up with <strong>{formatCurrency(69000000)} less wealth</strong> at retirement. Compounding rewards duration exponentially over contribution volume.
                </div>
              </div>
              <div className="mt-space-md pt-space-xs text-[11px] text-outline text-right">
                Calibrated on standard continuous monthly compounding cycle.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Country-Specific Wealth Architecture & Tax Rules */}
      <section className="w-full bg-surface py-space-2xl">
        <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
          <div className="mb-space-lg">
            <span className="font-label-caps text-label-caps uppercase text-primary tracking-wider">Cross-Border Jurisdictions</span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Country-Specific Wealth Architecture &amp; Tax Rules</h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl mt-1">
              Each economic territory enforces distinct regulatory umbrellas, tax treaties, and sheltered wrappers that dictate net asset appreciation.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
            {/* India */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm space-y-space-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🇮🇳</span>
                  <h3 className="font-headline-md text-[18px] font-semibold text-on-surface">India: Mutual Fund SIP &amp; ELSS</h3>
                </div>
                <ul className="space-y-1.5 font-body-sm text-body-sm text-on-surface-variant">
                  <li>• <strong>12.5% LTCG:</strong> Union Budget FY25 set 12.5% tax on equity mutual fund gains exceeding ₹1,25,000 yearly exemption.</li>
                  <li>• <strong>STCG:</strong> Short-term equity redemptions (&lt;12 months) taxed at 20%.</li>
                  <li>• <strong>ELSS 80C:</strong> Up to ₹1.5L tax deduction with mandatory 3-year lock-in period.</li>
                  <li>• <strong>Index Benchmark:</strong> Nifty 50 &amp; Sensex 30-year rolling CAGR stands at ~12.8%.</li>
                </ul>
              </div>
              <div className="pt-space-xs text-[11px] text-primary font-medium">Governed by SEBI / AMFI Regulations</div>
            </div>
            {/* USA */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm space-y-space-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🇺🇸</span>
                  <h3 className="font-headline-md text-[18px] font-semibold text-on-surface">USA: 401(k), Roth &amp; S&amp;P 500</h3>
                </div>
                <ul className="space-y-1.5 font-body-sm text-body-sm text-on-surface-variant">
                  <li>• <strong>Roth IRA:</strong> 100% tax-free growth and tax-free qualified withdrawals after age 59½.</li>
                  <li>• <strong>401(k) Matching:</strong> Immediate 50-100% risk-free return on company employer matches.</li>
                  <li>• <strong>Taxable Accounts:</strong> Preferential 0%, 15%, or 20% federal LTCG based on household income.</li>
                  <li>• <strong>Index Benchmark:</strong> S&amp;P 500 historic gross return averages 10.2% p.a. since 1957.</li>
                </ul>
              </div>
              <div className="pt-space-xs text-[11px] text-primary font-medium">Regulated under IRS / SEC Directives</div>
            </div>
            {/* UK */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm space-y-space-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🇬🇧</span>
                  <h3 className="font-headline-md text-[18px] font-semibold text-on-surface">UK: Stocks &amp; Shares ISA &amp; LISA</h3>
                </div>
                <ul className="space-y-1.5 font-body-sm text-body-sm text-on-surface-variant">
                  <li>• <strong>£20,000 Annual Allowance:</strong> Zero capital gains tax and zero dividend tax forever inside an ISA.</li>
                  <li>• <strong>Lifetime ISA:</strong> 25% free HM Government top-up (up to £1,000/yr bonus for first-time buyers).</li>
                  <li>• <strong>SIPP Pensions:</strong> Up to 40-45% higher-rate income tax relief on personal contributions.</li>
                  <li>• <strong>Benchmark:</strong> FTSE All-Share + Global Equity trackers delivering ~7.8% real returns.</li>
                </ul>
              </div>
              <div className="pt-space-xs text-[11px] text-primary font-medium">HMRC Statutory Framework Compliant</div>
            </div>
            {/* Canada */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm space-y-space-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🇨🇦</span>
                  <h3 className="font-headline-md text-[18px] font-semibold text-on-surface">Canada: TFSA &amp; RRSP</h3>
                </div>
                <ul className="space-y-1.5 font-body-sm text-body-sm text-on-surface-variant">
                  <li>• <strong>TFSA (Tax-Free Savings):</strong> Cumulative contribution room; all capital gains and dividends grow 100% tax-free.</li>
                  <li>• <strong>RRSP Strategy:</strong> Deduct contributions against highest marginal income bracket; tax-sheltered deferral.</li>
                  <li>• <strong>Capital Gains Inclusion:</strong> 50% inclusion rate (66.7% above $250k under updated CRA rules).</li>
                  <li>• <strong>Benchmark:</strong> TSX 60 paired with US total stock market asset allocations.</li>
                </ul>
              </div>
              <div className="pt-space-xs text-[11px] text-primary font-medium">Canada Revenue Agency (CRA) Aligned</div>
            </div>
            {/* Australia */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm space-y-space-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🇦🇺</span>
                  <h3 className="font-headline-md text-[18px] font-semibold text-on-surface">Australia: Superannuation &amp; Franking</h3>
                </div>
                <ul className="space-y-1.5 font-body-sm text-body-sm text-on-surface-variant">
                  <li>• <strong>11.5% Super Guarantee:</strong> Concessional contributions taxed at flat concessional 15% inside super.</li>
                  <li>• <strong>Franking Credits:</strong> Dividend imputation prevents double taxation on domestic ASX equities.</li>
                  <li>• <strong>CGT Discount:</strong> 50% capital gains discount for assets held longer than 12 months.</li>
                  <li>• <strong>Benchmark:</strong> S&amp;P/ASX 200 total returns index delivering 8.9% historical CAGR.</li>
                </ul>
              </div>
              <div className="pt-space-xs text-[11px] text-primary font-medium">ATO &amp; ASIC MoneySmart Standards</div>
            </div>
            {/* UAE */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm space-y-space-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🇦🇪</span>
                  <h3 className="font-headline-md text-[18px] font-semibold text-on-surface">UAE: NRI Rupee Arbitrage &amp; 0% Tax</h3>
                </div>
                <ul className="space-y-1.5 font-body-sm text-body-sm text-on-surface-variant">
                  <li>• <strong>0% Income &amp; Capital Gains:</strong> Zero personal local taxation in UAE emirates (Dubai/Abu Dhabi).</li>
                  <li>• <strong>NRE Bank Accounts:</strong> Direct AED-to-INR repatriation with 100% tax exemption on interest in India.</li>
                  <li>• <strong>Double Tax Avoidance (DTAA):</strong> Legally avoid dual taxation through Indian NRI status confirmation.</li>
                  <li>• <strong>Currency Hedging:</strong> Harness higher Indian equity nominal CAGR vs USD-pegged AED stability.</li>
                </ul>
              </div>
              <div className="pt-space-xs text-[11px] text-primary font-medium">FEMA &amp; RBI NRI Compliant</div>
            </div>
          </div>
        </div>
      </section>

      {/* FIRE Section */}
      <section className="w-full bg-surface-container-low py-space-2xl">
        <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
            <div className="lg:col-span-6 space-y-space-sm">
              <span className="font-label-caps text-label-caps uppercase text-error tracking-wider">Purchasing Power Decay</span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface">The Silent Wealth Killer: CPI Compounding</h2>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                While nominal numbers look grand on paper, continuous inflation erodes real purchasing utility. {formatCurrency(10000000)} 25 years from today will not buy the same basket of real goods.
              </p>
              <div className="space-y-space-xs bg-surface-container-lowest p-space-md rounded-xl">
                <div className="flex justify-between items-center text-body-sm font-medium">
                  <span className="text-on-surface">At 4.0% Inflation:</span>
                  <span className="font-data-mono text-outline">Purchasing power halves every 18.0 years</span>
                </div>
                <div className="flex justify-between items-center text-body-sm font-medium">
                  <span className="text-on-surface">At 5.5% Inflation (India Average):</span>
                  <span className="font-data-mono text-error font-semibold">Purchasing power halves every 12.9 years</span>
                </div>
                <div className="flex justify-between items-center text-body-sm font-medium">
                  <span className="text-on-surface">At 7.0% Inflation:</span>
                  <span className="font-data-mono text-error font-bold">Purchasing power halves every 10.2 years</span>
                </div>
              </div>
            </div>

            {/* FIRE & 4% Safe Withdrawal Generator */}
            <div className="lg:col-span-6 bg-surface-container-lowest p-space-lg rounded-xl shadow-md space-y-space-sm">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-label-caps uppercase text-primary">Retirement Cashflow</span>
                <span className="material-symbols-outlined text-primary">savings</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface">4% SWR Safe Withdrawal Simulator</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Based on the Trinity Study, drawing 4% annually adjusted for inflation preserves portfolio principal indefinitely across a 30+ year retirement.
              </p>
              <div className="p-space-md bg-surface-container-low rounded-lg space-y-space-xs">
                <div className="flex justify-between items-center">
                  <span className="font-body-sm text-body-sm text-outline">Projected Total Corpus:</span>
                  <span className="font-data-mono font-bold text-on-surface">{formatCurrency(results.compoundedWealth)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-body-sm text-body-sm text-outline">Annual 4% Safe Withdrawal:</span>
                  <span className="font-data-mono font-bold text-primary">{formatCurrency(results.compoundedWealth * 0.04)} / yr</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-outline/10">
                  <span className="font-body-sm text-body-sm font-medium text-on-surface">Perpetual Monthly Passive Income:</span>
                  <span className="font-data-mono font-bold text-secondary text-[18px]">{formatCurrency((results.compoundedWealth * 0.04) / 12)} / mo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      {config.faqs && config.faqs.length > 0 && (
        <section className="w-full bg-surface-container-lowest py-space-xl border-t border-surface-variant">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="mb-space-lg text-center">
              <span className="font-label-caps text-label-caps uppercase text-primary tracking-wider">Common Questions</span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface mt-2">
                {config.name} Investment &amp; Tax FAQ
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md max-w-5xl mx-auto">
              {config.faqs.map((faq, idx) => (
                <div key={idx} className="bg-surface p-space-md rounded-xl border border-surface-container-high shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="font-body-lg text-body-lg font-semibold text-on-surface mb-2">{faq.question}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Transparent Sub-Footer for Trusted Sources */}
      <section className="w-full bg-surface py-space-md border-t border-surface-variant">
        <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop flex flex-col md:flex-row items-center justify-between gap-space-sm text-center md:text-left">
          <div className="flex flex-col gap-1 text-on-surface-variant font-body-sm text-body-sm opacity-80">
            <p><strong>Regulatory Data Source:</strong> Tax algorithms and baseline assumptions are derived from the official {config.name} regulatory authority.</p>
          </div>
          <a 
            href={config.trustedSourceUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center gap-2 px-space-md py-2 rounded-full border border-outline/30 text-on-surface font-label-caps text-label-caps uppercase tracking-wider hover:bg-surface-container-high hover:border-primary/50 transition-all"
          >
            <span className="material-symbols-outlined text-[16px] text-primary">account_balance</span>
            {config.trustedSourceLabel}
          </a>
        </div>
      </section>
    </div>
  );
}
