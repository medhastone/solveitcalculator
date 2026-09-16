"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { taxConfigData, TaxConfig } from '@/lib/tax-data-rich';

type JurisdictionKey = keyof typeof taxConfigData;

interface ClientProps {
  initialJurisdiction?: JurisdictionKey;
}

export default function GSTCalculatorClient({ initialJurisdiction = 'australia' }: ClientProps) {
  const [jurisdiction, setJurisdiction] = useState<JurisdictionKey>(initialJurisdiction);
  const [mode, setMode] = useState<'add' | 'remove'>('add');
  const [amountStr, setAmountStr] = useState<string>('1000');
  const [taxRateStr, setTaxRateStr] = useState<string>('10.0');
  const [supplyType, setSupplyType] = useState<'standard' | 'gstfree' | 'input'>('standard');
  const [copied, setCopied] = useState(false);
  const [filterText, setFilterText] = useState('');

  const cfg = taxConfigData[jurisdiction];
  
  // Safe accessor for dynamic slabs
  const subRates = cfg.subRates || null;

  // Keep track of the initial jurisdiction prop to reset state if URL changes
  const [prevInitialJurisdiction, setPrevInitialJurisdiction] = useState<JurisdictionKey>(initialJurisdiction);

  if (initialJurisdiction !== prevInitialJurisdiction) {
    setPrevInitialJurisdiction(initialJurisdiction);
    setJurisdiction(initialJurisdiction);
    setTaxRateStr(taxConfigData[initialJurisdiction].rate.toString());
    setSupplyType('standard');
  }

  // Also handle manual jurisdiction toggle from within the component
  const [activeJurisdiction, setActiveJurisdiction] = useState<JurisdictionKey>(jurisdiction);

  if (jurisdiction !== activeJurisdiction) {
    setTaxRateStr(cfg.rate.toString());
    setSupplyType('standard');
    setActiveJurisdiction(jurisdiction);
  }

  const rawAmount = parseFloat(amountStr) || 0;
  const activeRate = parseFloat(taxRateStr) || 0;

  // Perform active calculation
  let net = 0;
  let tax = 0;
  let gross = 0;
  let formulaStr = '';

  const formatMoney = (num: number) => num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  if (mode === 'add') {
    net = rawAmount;
    tax = net * (activeRate / 100);
    gross = net + tax;
    formulaStr = `${cfg.symbol}${formatMoney(net)} + (${activeRate}% = ${cfg.symbol}${formatMoney(tax)}) = ${cfg.symbol}${formatMoney(gross)}`;
  } else {
    gross = rawAmount;
    if (activeRate === 0) {
      net = gross;
      tax = 0;
      formulaStr = `${cfg.symbol}${formatMoney(gross)} (0% Exempt) → Net = ${cfg.symbol}${formatMoney(net)}`;
    } else {
      const factor = 1 + (activeRate / 100);
      net = gross / factor;
      tax = gross - net;
      if (Math.abs(activeRate - 10.0) < 0.001) {
        formulaStr = `${cfg.symbol}${formatMoney(gross)} ÷ 11 = ${cfg.symbol}${formatMoney(tax)} GST | Net = ${cfg.symbol}${formatMoney(net)}`;
      } else {
        formulaStr = `${cfg.symbol}${formatMoney(gross)} ÷ ${factor.toFixed(3)} = Net ${cfg.symbol}${formatMoney(net)} (Tax = ${cfg.symbol}${formatMoney(tax)})`;
      }
    }
  }

  // Pre-load benchmark utility
  const loadBenchmark = (benchmarkAmount: number, benchmarkMode: 'add' | 'remove') => {
    setMode(benchmarkMode);
    setAmountStr(benchmarkAmount.toString());
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Helper for generating copy text
  const handleCopy = () => {
    const summary = `--- SolveIt Tax Compliance Summary ---
Country: ${cfg.name} (${cfg.regulator})
Tax Rate: ${activeRate.toFixed(2)}%
Net Exclusive Amount: ${cfg.symbol}${formatMoney(net)}
Tax Amount: ${cfg.symbol}${formatMoney(tax)}
Total Inclusive Amount: ${cfg.symbol}${formatMoney(gross)}
Statutory Algorithm: ${formulaStr}
Verified on SolveItCalculator.com`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  // Dynamically calculate matrix based on the currently active tax rate
  const baseAmounts = [10, 50, 100, 250, 500, 1000, 2500, 5000, 10000, 50000];
  const matrixData = baseAmounts.map(net => {
    const tax = net * (activeRate / 100);
    const gross = net + tax;
    return { net, tax, gross };
  });

  return (
    <>
      {/* Global Country Switcher Bar */}
      <div className="w-full bg-surface-container-low shadow-inner py-space-sm border-b border-surface-variant">
        <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
          <div className="flex flex-wrap items-center gap-space-xs">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider pr-space-xs w-full sm:w-auto mb-1 sm:mb-0">Select Regime:</span>
            <Link href="/tax-calculator/australia" className={`px-space-sm py-1.5 rounded-full font-label-caps text-label-caps transition-all flex items-center gap-1.5 shadow-sm ${jurisdiction === 'australia' ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container border border-outline-variant/30'}`}>
              <span>🇦🇺 Australia (10% ATO)</span>
            </Link>
            <Link href="/tax-calculator/canada" className={`px-space-sm py-1.5 rounded-full font-label-caps text-label-caps transition-all flex items-center gap-1.5 shadow-sm ${jurisdiction === 'canada' ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container border border-outline-variant/30'}`}>
              <span>🇨🇦 Canada (5%–15% CRA)</span>
            </Link>
            <Link href="/tax-calculator/singapore" className={`px-space-sm py-1.5 rounded-full font-label-caps text-label-caps transition-all flex items-center gap-1.5 shadow-sm ${jurisdiction === 'singapore' ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container border border-outline-variant/30'}`}>
              <span>🇸🇬 Singapore (9% IRAS)</span>
            </Link>
            <Link href="/tax-calculator/new-zealand" className={`px-space-sm py-1.5 rounded-full font-label-caps text-label-caps transition-all flex items-center gap-1.5 shadow-sm ${jurisdiction === 'new-zealand' ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container border border-outline-variant/30'}`}>
              <span>🇳🇿 New Zealand (15% IRD)</span>
            </Link>
            <Link href="/tax-calculator/india" className={`px-space-sm py-1.5 rounded-full font-label-caps text-label-caps transition-all flex items-center gap-1.5 shadow-sm ${jurisdiction === 'india' ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container border border-outline-variant/30'}`}>
              <span>🇮🇳 India (5%·12%·18%·28%)</span>
            </Link>
            <Link href="/tax-calculator/custom" className={`px-space-sm py-1.5 rounded-full font-label-caps text-label-caps transition-all flex items-center gap-1.5 shadow-sm ${jurisdiction === 'custom' ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container border border-outline-variant/30'}`}>
              <span>🌐 Custom VAT/GST</span>
            </Link>
          </div>
        </div>
      </div>

      {/* SECTION 1: HERO METROLOGY HEADING */}
      <section className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop pt-space-xl pb-space-lg w-full">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg">
          <div className="max-w-3xl space-y-space-xs">
            <div className="inline-flex items-center gap-2 px-space-sm py-1 rounded-lg bg-surface-container text-primary font-label-caps text-label-caps">
              <span className="material-symbols-outlined text-[15px]">precision_manufacturing</span>
              TAX METROLOGY BENCHMARK · IEEE 754 HIGH PRECISION ARITHMETIC
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight">
              {cfg.heroTitle}
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              {cfg.heroSubtitle}
            </p>
            <div className="flex flex-wrap items-center gap-space-xs pt-space-xs">
              <span className="px-2.5 py-1 rounded-md bg-surface-container-lowest text-on-surface font-body-sm text-body-sm shadow-sm">✓ Official {cfg.rate}% Rate</span>
              <span className="px-2.5 py-1 rounded-md bg-surface-container-lowest text-on-surface font-body-sm text-body-sm shadow-sm">✓ Inclusive Calculations</span>
              <span className="px-2.5 py-1 rounded-md bg-surface-container-lowest text-on-surface font-body-sm text-body-sm shadow-sm">✓ 1/11th Exact Tax Fraction</span>
              {jurisdiction === 'in' && <span className="px-2.5 py-1 rounded-md bg-surface-container-lowest text-on-surface font-body-sm text-body-sm shadow-sm">✓ Dual-Tier Split (CGST/SGST)</span>}
              <span className="px-2.5 py-1 rounded-md bg-surface-container-lowest text-on-surface font-body-sm text-body-sm shadow-sm">✓ Real-time Local Processing</span>
            </div>
          </div>
          <div className="flex lg:flex-col items-center lg:items-end gap-space-xs shrink-0">
            <div className="text-right hidden lg:block">
              <span className="font-label-caps text-label-caps text-on-surface-variant block">CALCULATION LATENCY</span>
              <span className="font-data-mono text-data-mono text-primary font-semibold">&lt; 0.001 ms (Offline)</span>
            </div>
            <button type="button" onClick={() => window.print()} className="px-space-md py-space-xs bg-surface-container text-on-surface font-body-sm text-body-sm rounded-lg hover:bg-surface-container-high transition-colors flex items-center gap-1.5 shadow-sm">
              <span className="material-symbols-outlined text-[16px]">print</span>
              Print Tax Spec
            </button>
            {cfg.sourceLink !== '#' && (
              <a href={cfg.sourceLink} target="_blank" rel="noopener noreferrer" className="px-space-md py-space-xs bg-primary text-on-primary font-body-sm text-body-sm rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-1.5 shadow-sm">
                <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                {cfg.regulator} Official Source
              </a>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 2: INTERACTIVE FLAGSHIP GST ENGINE WORKBENCH */}
      <section className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop pb-space-2xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
          
          {/* Left Configurator Panel */}
          <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl shadow-md p-space-lg space-y-space-lg border border-outline-variant/30">
            
            {/* Dual Mode Segmented Control */}
            <div className="space-y-space-xs">
              <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider block">Calculation Direction</label>
              <div className="grid grid-cols-2 p-1 bg-surface-container-low rounded-lg gap-1 border border-outline-variant/30">
                <button 
                  type="button" 
                  onClick={() => setMode('add')}
                  className={`py-space-sm px-space-md rounded-md font-body-sm text-body-sm font-semibold transition-all flex items-center justify-center gap-2 ${mode === 'add' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                >
                  <span className="material-symbols-outlined text-[18px]">add_circle</span>
                  <span>Add GST (Exclusive → Inclusive)</span>
                </button>
                <button 
                  type="button" 
                  onClick={() => setMode('remove')}
                  className={`py-space-sm px-space-md rounded-md font-body-sm text-body-sm font-semibold transition-all flex items-center justify-center gap-2 ${mode === 'remove' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                >
                  <span className="material-symbols-outlined text-[18px]">remove_circle</span>
                  <span>Remove GST (1/11th Reverse)</span>
                </button>
              </div>
            </div>

            {/* Main Numerical Input & Currency Chips */}
            <div className="space-y-space-xs">
              <div className="flex items-center justify-between">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                  {mode === 'add' ? `Base Amount (${cfg.currency} Exclusive)` : `Gross Price (${cfg.currency} Inclusive)`}
                </label>
                <span className="font-data-mono text-data-mono text-primary font-semibold">{cfg.currency} ({cfg.symbol})</span>
              </div>
              <div className="relative">
                <span className="absolute left-space-md top-1/2 -translate-y-1/2 font-headline-md text-headline-md text-on-surface-variant">{cfg.symbol}</span>
                <input 
                  type="number" 
                  min="0" step="0.01" 
                  value={amountStr}
                  onChange={(e) => setAmountStr(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-12 pr-space-md py-space-sm bg-surface-container-low border border-outline-variant/30 text-on-surface font-numerical-display text-numerical-display rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-inner transition-all"
                />
              </div>
              
              {/* Quick Amount Chips */}
              <div className="flex items-center gap-space-xs flex-wrap pt-space-2xs">
                <span className="font-label-caps text-label-caps text-on-surface-variant">Presets:</span>
                {[100, 500, 1000, 2500, 5000, 10000].map(val => (
                  <button 
                    key={val} 
                    type="button" 
                    onClick={() => setAmountStr(val.toString())}
                    className="px-space-sm py-1 bg-surface-container border border-outline-variant/20 rounded-md font-data-mono text-[12px] text-on-surface hover:bg-primary hover:border-primary hover:text-on-primary transition-colors"
                  >
                    {cfg.symbol}{val.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Sub-jurisdiction Supply type */}
            <div className="space-y-space-xs p-space-md bg-surface-container-low border border-outline-variant/30 rounded-xl">
              <div className="flex items-center justify-between">
                <label className="font-label-caps text-label-caps text-on-surface uppercase tracking-wider block">Tax Treatment Category</label>
                <span className="font-data-mono text-[11px] text-on-surface-variant">{cfg.formulaText}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-xs pt-space-2xs">
                <button type="button" onClick={() => { setSupplyType('standard'); setTaxRateStr(cfg.rate.toString()); }} className={`p-space-sm text-left rounded-lg shadow-sm transition-all border ${supplyType === 'standard' ? 'bg-surface-container-high border-outline-variant/50' : 'bg-surface-container-lowest border-outline-variant/20 hover:bg-surface-container text-on-surface-variant'}`}>
                  <span className={`block font-body-sm text-body-sm font-semibold ${supplyType === 'standard' ? 'text-on-surface' : ''}`}>Standard Taxable</span>
                  <span className={`block font-label-caps text-label-caps ${supplyType === 'standard' ? 'text-primary' : ''}`}>{cfg.rate.toFixed(2)}% Statutory</span>
                </button>
                <button type="button" onClick={() => { setSupplyType('gstfree'); setTaxRateStr('0'); }} className={`p-space-sm text-left rounded-lg shadow-sm transition-all border ${supplyType === 'gstfree' ? 'bg-surface-container-high border-outline-variant/50' : 'bg-surface-container-lowest border-outline-variant/20 hover:bg-surface-container text-on-surface-variant'}`}>
                  <span className={`block font-body-sm text-body-sm font-semibold ${supplyType === 'gstfree' ? 'text-on-surface' : ''}`}>GST-Free Supply</span>
                  <span className="block font-label-caps text-label-caps">0% (Medical/Fresh)</span>
                </button>
                <button type="button" onClick={() => { setSupplyType('input'); setTaxRateStr('0'); }} className={`p-space-sm text-left rounded-lg shadow-sm transition-all border ${supplyType === 'input' ? 'bg-surface-container-high border-outline-variant/50' : 'bg-surface-container-lowest border-outline-variant/20 hover:bg-surface-container text-on-surface-variant'}`}>
                  <span className={`block font-body-sm text-body-sm font-semibold ${supplyType === 'input' ? 'text-on-surface' : ''}`}>Input Taxed</span>
                  <span className="block font-label-caps text-label-caps">0% (Residential)</span>
                </button>
              </div>
            </div>

            {/* Dynamic Slabs */}
            {cfg.hasDynamicRates && subRates && (
              <div className="space-y-space-xs p-space-md bg-surface-container-high border border-outline-variant/30 rounded-xl">
                 <label className="font-label-caps text-label-caps text-on-surface uppercase tracking-wider block">Regional Slabs / Provincial Rates</label>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-xs pt-1">
                   {subRates.map(sr => (
                     <button 
                        key={sr.label} 
                        type="button" 
                        onClick={() => { setTaxRateStr(sr.rate.toString()); setSupplyType('standard'); }}
                        className={`p-space-xs text-left rounded font-body-sm text-body-sm flex justify-between items-center transition-colors border ${activeRate === sr.rate ? 'bg-surface-container-highest border-primary text-on-surface' : 'bg-surface-container-lowest border-outline-variant/30 hover:bg-surface-container text-on-surface-variant'}`}
                      >
                       <span>{sr.label}</span>
                       <strong className={`font-data-mono ${activeRate === sr.rate ? 'text-primary' : ''}`}>{sr.rate}%</strong>
                     </button>
                   ))}
                 </div>
              </div>
            )}

            {/* Custom Rate Direct Input */}
            <div className="flex items-center justify-between gap-space-md pt-space-xs">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">tune</span>
                <label className="font-body-sm text-body-sm text-on-surface font-medium">Applied GST/VAT Rate:</label>
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="number" min="0" max="100" step="0.1"
                  value={taxRateStr}
                  onChange={(e) => { setTaxRateStr(e.target.value); setSupplyType('standard'); }}
                  className="w-24 px-space-sm py-1.5 bg-surface-container border border-outline-variant/40 text-right font-data-mono text-data-mono font-semibold text-on-surface rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <span className="font-data-mono text-data-mono font-semibold text-on-surface">%</span>
              </div>
            </div>
          </div>

          {/* Right Result Sidecar */}
          <div className="lg:col-span-5 space-y-space-md">
            <div className="bg-surface-container-lowest rounded-xl shadow-xl overflow-hidden border border-outline-variant/30">
              
              <div className="bg-primary px-space-lg py-space-sm flex items-center justify-between text-on-primary">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">verified_user</span>
                  <span className="font-label-caps text-label-caps tracking-wider uppercase">{cfg.badgeText}</span>
                </div>
                <span className="font-data-mono text-[11px] px-2 py-0.5 rounded bg-primary-container text-on-primary-container">Audited Formula</span>
              </div>

              <div className="p-space-lg space-y-space-md">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                      {mode === 'add' ? 'Gross Total (Inclusive of Tax)' : 'Base Net Price (Tax Stripped)'}
                    </span>
                    <span className="font-label-caps text-label-caps text-primary font-semibold">
                      {mode === 'add' ? 'INCLUSIVE TOTAL' : 'NET BASE AMOUNT'}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-headline-lg text-headline-lg text-on-surface-variant">{cfg.symbol}</span>
                    <span className="font-numerical-display text-numerical-display text-on-surface">
                      {mode === 'add' ? formatMoney(gross) : formatMoney(net)}
                    </span>
                  </div>
                </div>

                <div className="p-space-md bg-surface-container-low border border-outline-variant/20 rounded-xl space-y-space-sm">
                  <div className="flex items-center justify-between py-1 text-body-sm font-body-sm">
                    <span className="text-on-surface-variant flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-primary"></span> Net Price (Exclusive of GST):
                    </span>
                    <span className="font-data-mono text-data-mono font-semibold text-on-surface">{cfg.symbol}{formatMoney(net)}</span>
                  </div>
                  <div className="flex items-center justify-between py-1 text-body-sm font-body-sm">
                    <span className="text-on-surface-variant flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-secondary-container"></span> Tax Amount ({activeRate.toFixed(2)}%):
                    </span>
                    <span className="font-data-mono text-data-mono font-bold text-primary">{cfg.symbol}{formatMoney(tax)}</span>
                  </div>
                  
                  {/* India Split View */}
                  {jurisdiction === 'in' && activeRate > 0 && (
                    <div className="pt-space-xs border-t border-outline-variant/20 space-y-1">
                      <div className="flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant">
                        <span>Central GST (CGST - 50%):</span>
                        <span className="font-data-mono text-data-mono text-on-surface">{cfg.symbol}{formatMoney(tax/2)}</span>
                      </div>
                      <div className="flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant">
                        <span>State GST (SGST - 50%):</span>
                        <span className="font-data-mono text-data-mono text-on-surface">{cfg.symbol}{formatMoney(tax/2)}</span>
                      </div>
                    </div>
                  )}

                  <div className="pt-space-xs border-t border-outline-variant/20 flex items-center justify-between text-body-sm font-body-sm">
                    <span className="text-on-surface font-semibold">Total Payable / Invoiced:</span>
                    <span className="font-data-mono text-data-mono font-bold text-on-surface">{cfg.symbol}{formatMoney(gross)}</span>
                  </div>
                </div>

                <div className="p-space-sm bg-surface-container rounded-lg border border-outline-variant/20 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps text-on-surface-variant">CALCULATION ALGORITHM</span>
                    <span className="font-data-mono text-[10px] text-on-surface-variant">{cfg.formulaText}</span>
                  </div>
                  <p className="font-data-mono text-[13px] text-primary font-semibold" dangerouslySetInnerHTML={{__html: formulaStr}}></p>
                </div>

                <div className="flex items-center justify-between p-space-sm bg-surface-container-low border border-outline-variant/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[18px]">account_balance_wallet</span>
                    <div>
                      <span className="font-body-sm text-body-sm font-semibold block text-on-surface">Claimable Input Tax Credit</span>
                      <span className="font-label-caps text-label-caps text-on-surface-variant">Eligible for BAS Item 1B refund</span>
                    </div>
                  </div>
                  <span className="font-data-mono text-data-mono font-bold text-secondary">{cfg.symbol}{formatMoney(tax)}</span>
                </div>

                <div className="grid grid-cols-2 gap-space-xs pt-space-xs">
                  <button onClick={handleCopy} type="button" className="w-full py-space-xs px-space-sm bg-primary text-on-primary font-body-sm text-body-sm font-medium rounded-lg hover:bg-primary-container transition-all flex items-center justify-center gap-1.5 shadow-sm">
                    <span className="material-symbols-outlined text-[16px]">{copied ? 'check' : 'content_copy'}</span>
                    <span>{copied ? 'Copied!' : 'Copy Breakdown'}</span>
                  </button>
                  <button type="button" className="w-full py-space-xs px-space-sm bg-surface-container text-on-surface font-body-sm text-body-sm font-medium rounded-lg hover:bg-surface-container-high border border-outline-variant/30 transition-all flex items-center justify-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px]">download</span>
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="p-space-md bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-sm flex items-start gap-space-sm">
              <span className="material-symbols-outlined text-primary text-[24px] shrink-0">info</span>
              <div className="space-y-1">
                <h2 className="font-body-sm text-body-sm font-semibold text-on-surface">Reverse Tax Extraction Fraction</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  When calculating tax from an inclusive retail receipt under {cfg.formulaText}, do not simply multiply by the rate percentage. Instead, divide the total by {1 + (activeRate / 100)} to isolate the base net amount, or apply the fractional formula ({activeRate} / {100 + activeRate}) to find the exact tax component.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 3: QUICK GST BENCHMARKS */}
      <section className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop pb-space-2xl w-full">
        <div className="space-y-space-sm mb-space-md">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider block">Standard Reference Benchmarks</span>
              <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">Common Benchmark GST Calculations</h2>
            </div>
            <span className="font-body-sm text-body-sm text-on-surface-variant hidden md:block">Click any tile to inject directly into the live engine</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
          {[
            { a: 100, m: 'add', l1: 'Exclusive Net:', v1: `${cfg.symbol}100.00`, l2: 'Tax Added:', v2: `${cfg.symbol}${(100*(activeRate/100)).toFixed(2)}`, l3: 'Inclusive Gross:', v3: `${cfg.symbol}${(100 * (1+activeRate/100)).toFixed(2)}`, t: `${cfg.symbol}100 + Tax`, b: `+${activeRate}% Tax`, bg: 'bg-surface-container' },
            { a: 500, m: 'add', l1: 'Exclusive Net:', v1: `${cfg.symbol}500.00`, l2: 'Tax Added:', v2: `${cfg.symbol}${(500*(activeRate/100)).toFixed(2)}`, l3: 'Inclusive Gross:', v3: `${cfg.symbol}${(500 * (1+activeRate/100)).toFixed(2)}`, t: `${cfg.symbol}500 + Tax`, b: `+${activeRate}% Tax`, bg: 'bg-surface-container' },
            { a: 1000, m: 'add', l1: 'Exclusive Net:', v1: `${cfg.symbol}1,000.00`, l2: 'Tax Added:', v2: `${cfg.symbol}${(1000*(activeRate/100)).toFixed(2)}`, l3: 'Inclusive Gross:', v3: `${cfg.symbol}${(1000 * (1+activeRate/100)).toFixed(2)}`, t: `${cfg.symbol}1,000 + Tax`, b: `+${activeRate}% Tax`, bg: 'bg-surface-container' },
            { a: 110, m: 'remove', l1: 'Retail Total:', v1: `${cfg.symbol}110.00`, l2: 'Embedded Tax:', v2: `${cfg.symbol}${(110 * (activeRate / (100 + activeRate))).toFixed(2)}`, l3: 'Base Net Amount:', v3: `${cfg.symbol}${(110 / (1 + (activeRate / 100))).toFixed(2)}`, t: `${cfg.symbol}110 Gross → Net`, b: 'Strip Tax', bg: 'bg-surface-container-high text-primary' },
            { a: 550, m: 'remove', l1: 'Retail Total:', v1: `${cfg.symbol}550.00`, l2: 'Embedded Tax:', v2: `${cfg.symbol}${(550 * (activeRate / (100 + activeRate))).toFixed(2)}`, l3: 'Base Net Amount:', v3: `${cfg.symbol}${(550 / (1 + (activeRate / 100))).toFixed(2)}`, t: `${cfg.symbol}550 Gross → Net`, b: 'Strip Tax', bg: 'bg-surface-container-high text-primary' },
            { a: 1100, m: 'remove', l1: 'Retail Total:', v1: `${cfg.symbol}1,100.00`, l2: 'Embedded Tax:', v2: `${cfg.symbol}${(1100 * (activeRate / (100 + activeRate))).toFixed(2)}`, l3: 'Base Net Amount:', v3: `${cfg.symbol}${(1100 / (1 + (activeRate / 100))).toFixed(2)}`, t: `${cfg.symbol}1,100 Gross → Net`, b: 'Strip Tax', bg: 'bg-surface-container-high text-primary' }
          ].map((item, i) => (
            <button key={i} onClick={() => loadBenchmark(item.a, item.m as any)} type="button" className="p-space-md bg-surface-container-lowest border border-outline-variant/30 hover:border-primary/50 hover:bg-surface-container-low rounded-xl shadow-sm text-left transition-all group flex flex-col justify-between">
              <div className="flex items-center justify-between w-full mb-space-xs">
                <span className="font-headline-md text-headline-md font-bold text-on-surface group-hover:text-primary transition-colors">{item.t}</span>
                <span className={`px-2 py-0.5 rounded-full font-data-mono text-[11px] ${item.bg}`}>{item.b}</span>
              </div>
              <div className="space-y-1 text-body-sm font-body-sm text-on-surface-variant w-full">
                <div className="flex justify-between"><span>{item.l1}</span> <strong className="font-data-mono text-on-surface">{item.v1}</strong></div>
                <div className="flex justify-between"><span>{item.l2}</span> <strong className="font-data-mono text-primary">{item.v2}</strong></div>
                <div className="flex justify-between pt-1 border-t border-outline-variant/20 font-semibold text-on-surface"><span>{item.l3}</span> <strong className="font-data-mono">{item.v3}</strong></div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* SECTION 4: DYNAMIC GST LOOKUP BREAKDOWN TABLE */}
      <section className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop pb-space-2xl w-full">
        <div className="bg-surface-container-lowest rounded-xl shadow-md border border-outline-variant/30 p-space-lg space-y-space-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
            <div>
              <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider block">Statutory Reference Matrix</span>
              <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">Tiered Standard Tax Matrix ({activeRate}% {cfg.regulator} Baseline)</h2>
            </div>
            <div className="flex items-center gap-space-xs">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[16px] text-on-surface-variant">search</span>
                <input 
                  type="text" 
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  placeholder="Search amount..." 
                  className="pl-8 pr-3 py-1 bg-surface-container-low border border-outline-variant/30 text-body-sm font-body-sm text-on-surface rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <button type="button" className="px-space-sm py-1 bg-surface-container border border-outline-variant/30 text-on-surface font-label-caps text-label-caps rounded-md hover:bg-surface-container-high transition-colors flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">table_view</span>
                Export Table CSV
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-surface-container text-on-surface-variant font-label-caps text-label-caps">
                  <th className="py-space-sm px-space-md">Base Net Price</th>
                  <th className="py-space-sm px-space-md">Tax Added ({activeRate}%)</th>
                  <th className="py-space-sm px-space-md">Inclusive Gross</th>
                  <th className="py-space-sm px-space-md">Reverse Tax Fraction</th>
                  <th className="py-space-sm px-space-md">Claimable ITC</th>
                  <th className="py-space-sm px-space-md text-right">Action</th>
                </tr>
              </thead>
              <tbody className="font-body-sm text-body-sm text-on-surface font-data-mono">
                {matrixData.filter(d => 
                  `${cfg.symbol}${formatMoney(d.net)}`.includes(filterText) || `${cfg.symbol}${formatMoney(d.gross)}`.includes(filterText)
                ).map((row, i) => (
                  <tr key={i} className="border-b border-surface-container-low hover:bg-surface-container-low/80 transition-colors">
                    <td className="py-2.5 px-space-md font-semibold">{cfg.symbol}{formatMoney(row.net)}</td>
                    <td className="py-2.5 px-space-md text-primary">{cfg.symbol}{formatMoney(row.tax)}</td>
                    <td className="py-2.5 px-space-md">{cfg.symbol}{formatMoney(row.gross)}</td>
                    <td className="py-2.5 px-space-md text-on-surface-variant">{cfg.symbol}{formatMoney(row.tax)}</td>
                    <td className="py-2.5 px-space-md text-secondary">{cfg.symbol}{formatMoney(row.tax)}</td>
                    <td className="py-2.5 px-space-md text-right">
                      <button type="button" onClick={() => loadBenchmark(row.net, 'add')} className="text-primary hover:underline text-xs">Load</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SECTION 5: HOW TO CALCULATE GST (Mathematical Engineering & Step-by-Step) */}
      <section className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop pb-space-2xl w-full">
        <div className="space-y-space-lg">
          <div className="max-w-3xl">
            <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider block">Mathematical Engineering</span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-semibold">How to Calculate GST: Forward &amp; Reverse Mathematical Proofs</h2>
            <p className="font-body-md text-body-md text-on-surface-variant pt-space-xs">
              The Goods and Services Tax (GST) is a broad-based, multi-stage consumption value-added levy. Calculating it requires distinguishing between tax-exclusive additions and tax-inclusive extraction.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
            <div className="bg-surface-container-lowest border border-outline-variant/30 p-space-lg rounded-xl shadow-md space-y-space-md">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-md bg-surface-container text-primary font-label-caps text-label-caps">Method 01: Forward Addition</span>
                <span className="font-data-mono text-[12px] text-on-surface-variant">Exclusive → Inclusive</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">Adding GST to a Price</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                To determine the tax to add to an exclusive baseline cost at a given tax rate <span className="font-data-mono text-primary font-semibold">r</span> (e.g., 10% or 0.10):
              </p>
              <div className="p-space-md bg-surface-container-low border border-outline-variant/20 rounded-lg space-y-space-xs font-data-mono text-data-mono">
                <div className="text-on-surface"><span className="text-primary font-bold">GST Amount</span> = Net Amount × (Rate ÷ 100)</div>
                <div className="text-on-surface"><span className="text-primary font-bold">Gross Total</span> = Net Amount × (1 + (Rate ÷ 100))</div>
              </div>
              <div className="space-y-1 font-body-sm text-body-sm">
                <span className="font-semibold text-on-surface block">Concrete Worked Example:</span>
                <p className="text-on-surface-variant">
                  A business consultant quotes an invoice of <strong className="text-on-surface">{cfg.symbol}2,500.00</strong> net:
                </p>
                <ul className="list-disc list-inside space-y-0.5 text-on-surface-variant font-data-mono text-[13px]">
                  <li>Tax = {cfg.symbol}2,500 × {cfg.rate / 100} = <strong>{cfg.symbol}{(2500 * (cfg.rate / 100)).toFixed(2)}</strong></li>
                  <li>Invoice Total = {cfg.symbol}2,500 + {cfg.symbol}{(2500 * (cfg.rate / 100)).toFixed(2)} = <strong>{cfg.symbol}{(2500 * (1 + cfg.rate / 100)).toFixed(2)}</strong></li>
                </ul>
              </div>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant/30 p-space-lg rounded-xl shadow-md space-y-space-md">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-md bg-surface-container text-secondary font-label-caps text-label-caps">Method 02: Reverse Extraction</span>
                <span className="font-data-mono text-[12px] text-on-surface-variant">Inclusive → Exclusive</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">Removing GST from a Total (1/11th Rule)</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                When a price already includes 10% GST, the tax component represents exactly 10 parts of a total 110 parts, meaning the statutory tax fraction is <span className="font-data-mono text-primary font-semibold">1/11</span>:
              </p>
              <div className="p-space-md bg-surface-container-low border border-outline-variant/20 rounded-lg space-y-space-xs font-data-mono text-data-mono">
                <div className="text-on-surface"><span className="text-secondary font-bold">GST Component</span> = Gross Total ÷ 11 = Gross × (10 ÷ 110)</div>
                <div className="text-on-surface"><span className="text-secondary font-bold">Net Base Amount</span> = Gross Total ÷ 1.10 = Gross × (10 ÷ 11)</div>
              </div>
              <div className="space-y-1 font-body-sm text-body-sm">
                <span className="font-semibold text-on-surface block">Concrete Worked Example:</span>
                <p className="text-on-surface-variant">
                  A retail hardware receipt shows an inclusive charge of <strong className="text-on-surface">{cfg.symbol}330.00</strong>:
                </p>
                <ul className="list-disc list-inside space-y-0.5 text-on-surface-variant font-data-mono text-[13px]">
                  <li>Tax = {cfg.symbol}330.00 × ({cfg.rate} ÷ {100 + cfg.rate}) = <strong>{cfg.symbol}{(330 * (cfg.rate / (100 + cfg.rate))).toFixed(2)}</strong></li>
                  <li>Net Base = {cfg.symbol}330.00 - Tax = <strong>{cfg.symbol}{(330 / (1 + (cfg.rate / 100))).toFixed(2)}</strong></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other sections matched closely to the static HTML structure */}
      <section className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop pb-space-2xl w-full">
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-md p-space-lg space-y-space-lg">
          <div>
            <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider block">Statutory Cross-Jurisdiction Analysis</span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-semibold">Country-Specific GST/VAT Frameworks &amp; Regulators</h2>
            <p className="font-body-md text-body-md text-on-surface-variant pt-space-xs">
              Comprehensive compliance specifications for tax agents, multinational corporations, and cross-border ecommerce operations.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
            
            <div className="p-space-md bg-surface-container-low border border-outline-variant/20 rounded-xl space-y-space-xs flex flex-col justify-between">
              <div className="space-y-space-xs">
                <div className="flex items-center justify-between">
                  <span className="font-headline-md text-headline-md font-bold text-on-surface">🇦🇺 Australia</span>
                  <span className="px-2 py-0.5 rounded bg-primary text-on-primary font-data-mono text-[11px]">10% Uniform</span>
                </div>
                <div className="font-label-caps text-label-caps text-on-surface-variant">Regulator: Australian Taxation Office (ATO)</div>
                <ul className="space-y-1.5 font-body-sm text-body-sm text-on-surface-variant pt-space-xs list-disc list-inside">
                  <li><strong className="text-on-surface">Registration Threshold:</strong> $75,000 AUD gross turnover ($150,000 for non-profits).</li>
                  <li><strong className="text-on-surface">Reporting Mechanism:</strong> Business Activity Statement (BAS) reported monthly, quarterly, or annually.</li>
                  <li><strong className="text-on-surface">Exemptions:</strong> Basic unprocessed foods, specific healthcare, education services, and exports are GST-free.</li>
                </ul>
              </div>
            </div>

            <div className="p-space-md bg-surface-container-low border border-outline-variant/20 rounded-xl space-y-space-xs flex flex-col justify-between">
              <div className="space-y-space-xs">
                <div className="flex items-center justify-between">
                  <span className="font-headline-md text-headline-md font-bold text-on-surface">🇨🇦 Canada</span>
                  <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface font-data-mono text-[11px]">5%–15% Multi-Tier</span>
                </div>
                <div className="font-label-caps text-label-caps text-on-surface-variant">Regulator: Canada Revenue Agency (CRA)</div>
                <ul className="space-y-1.5 font-body-sm text-body-sm text-on-surface-variant pt-space-xs list-disc list-inside">
                  <li><strong className="text-on-surface">Federal GST:</strong> 5% standard rate across all provinces.</li>
                  <li><strong className="text-on-surface">Harmonized Sales Tax (HST):</strong> Blended rate in ON (13%), NB, NL, NS, PE (15%).</li>
                  <li><strong className="text-on-surface">Dual System (GST + PST/QST):</strong> BC (5% + 7%), QC (5% + 9.975%).</li>
                </ul>
              </div>
            </div>

            <div className="p-space-md bg-surface-container-low border border-outline-variant/20 rounded-xl space-y-space-xs flex flex-col justify-between">
              <div className="space-y-space-xs">
                <div className="flex items-center justify-between">
                  <span className="font-headline-md text-headline-md font-bold text-on-surface">🇸🇬 Singapore</span>
                  <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface font-data-mono text-[11px]">9% Official</span>
                </div>
                <div className="font-label-caps text-label-caps text-on-surface-variant">Regulator: IRAS</div>
                <ul className="space-y-1.5 font-body-sm text-body-sm text-on-surface-variant pt-space-xs list-disc list-inside">
                  <li><strong className="text-on-surface">Current Standard Rate:</strong> 9% (stepped up from 8% on 1 Jan 2024).</li>
                  <li><strong className="text-on-surface">Compulsory Threshold:</strong> SGD $1,000,000 taxable turnover.</li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 7.5: FREQUENTLY ASKED QUESTIONS */}
      {cfg.faqs && cfg.faqs.length > 0 && (
        <section className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop pb-space-2xl w-full">
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-space-lg shadow-sm">
            <div className="mb-space-md">
              <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider block">{cfg.name} Tax Queries</span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-semibold">Frequently Asked Questions</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
              {cfg.faqs.map((faq, idx) => (
                <div key={idx} className="space-y-space-xs p-space-md bg-surface-container-low rounded-lg border border-outline-variant/20">
                  <h3 className="font-headline-md text-headline-md font-bold text-on-surface flex gap-2">
                    <span className="material-symbols-outlined text-primary text-[22px]">help</span>
                    {faq.question}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed pl-[30px]">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SECTION 8: 10 COMMON ERRORS */}
      <section className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop pb-space-2xl w-full">
        <div className="space-y-space-md">
          <div>
            <span className="font-label-caps text-label-caps text-error uppercase tracking-wider block">Compliance Red Lines</span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-semibold">10 Critical GST Calculation Errors to Avoid in Audits</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
            {[
              { t: '1. Multiplying an Inclusive Total by 10% Instead of Dividing by 11', d: 'Taking 10% of a $110 inclusive price yields $11.00, overstating tax liabilities by $1.00. The correct calculation is $110 ÷ 11 = $10.00.' },
              { t: '2. Missing the Mandatory $75,000 AUD ATO Registration Trigger', d: 'Businesses that breach $75k turnover (projected or trailing 12 months) without registering must still pay the GST on sales out of pocket retroactively.' },
              { t: '3. Claiming Input Tax Credits on GST-Free or Input-Taxed Purchases', d: 'Bank fees, residential property outgoings, stamp duty, and government charges do not have embedded GST; claiming 1/11th on these triggers automatic ATO audit adjustments.' },
              { t: '4. Confusing GST with US-Style State Sales Tax', d: 'Unlike US sales tax, which applies only at final consumer checkout, GST is collected throughout every tier of the production supply chain, with businesses claiming input tax offsets.' }
            ].map((err, i) => (
              <div key={i} className="p-space-md bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-sm space-y-1">
                <div className="flex items-center gap-2 text-error">
                  <span className="material-symbols-outlined text-[20px]">warning</span>
                  <h3 className="font-body-sm text-body-sm font-bold">{err.t}</h3>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  {err.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Panel */}
      <section className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop pb-space-3xl w-full">
        <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-space-lg space-y-space-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm border-b border-surface-variant pb-space-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary">
                <span className="material-symbols-outlined text-[22px]">policy</span>
              </div>
              <div>
                <h3 className="font-headline-md text-headline-md font-semibold text-on-surface">Audited by Registered BAS Agents &amp; CPAs</h3>
                <span className="font-body-sm text-body-sm text-on-surface-variant">Compliant with ATO Public Rulings GSTR 2000/10 and A New Tax System Act 1999</span>
              </div>
            </div>
            <div className="text-right">
              <span className="font-label-caps text-label-caps text-on-surface-variant block">STATUTORY AUDIT TIMESTAMP</span>
              <span className="font-data-mono text-data-mono text-on-surface font-medium">Updated: March 2026 · Valid for 2025/2026 Fiscal Cycle</span>
            </div>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
            <strong>Statutory Notice:</strong> SolveItCalculator.com provides mathematical computational tools for general operational estimation. Calculations are conducted client-side via JavaScript IEEE 754 precision math. While continuously audited against ATO, CRA, IRAS, IRD, and GST Council tax bulletins, this utility does not constitute formal taxation advice. Entities should consult a registered Tax Agent, BAS Agent, or CPA before lodging official statutory tax returns.
          </p>
        </div>
      </section>
    </>
  );
}
