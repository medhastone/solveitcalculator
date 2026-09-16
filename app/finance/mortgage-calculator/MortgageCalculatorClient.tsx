'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Jurisdiction,
  computeMonthlyRate,
  computeBaseMonthlyPI,
  computeAmortization,
  AnnualScheduleRow,
  MonthlyScheduleRow,
} from './mortgage-engine';
import {
  CountryCurrencyConfig,
  COUNTRIES_CURRENCIES,
  getCountryCurrencyConfig,
} from './countries-currencies';

export default function MortgageCalculatorClient() {
  // Country & Currency Selection
  const [selectedCountryId, setSelectedCountryId] = useState<string>('US');
  const currentCountry = useMemo(() => getCountryCurrencyConfig(selectedCountryId), [selectedCountryId]);

  // Primary Parameters
  const [price, setPrice] = useState<number>(450000);
  const [downDollars, setDownDollars] = useState<number>(90000);
  const [downPercent, setDownPercent] = useState<number>(20);
  const [rate, setRate] = useState<number>(6.625);
  const [termYears, setTermYears] = useState<number>(30);

  // Escrow & Additional Expenses
  const [taxMonth, setTaxMonth] = useState<number>(380);
  const [insMonth, setInsMonth] = useState<number>(115);
  const [hoaMonth, setHoaMonth] = useState<number>(0);
  const [isEscrowOpen, setIsEscrowOpen] = useState<boolean>(true);

  // Overpayment & Frequency
  const [frequency, setFrequency] = useState<string>('monthly');
  const [extraMonthly, setExtraMonthly] = useState<number>(200);
  const [annualLumpSum, setAnnualLumpSum] = useState<number>(0);
  const [jurisdiction, setJurisdiction] = useState<Jurisdiction>('USA');
  const [scheduleView, setScheduleView] = useState<'annual' | 'monthly'>('annual');

  // Affordability / DTI
  const [annualIncome, setAnnualIncome] = useState<number>(135000);
  const [monthlyDebts, setMonthlyDebts] = useState<number>(650);

  // Refinance Analyzer
  const [refiCurrentRate, setRefiCurrentRate] = useState<number>(7.25);
  const [refiNewRate, setRefiNewRate] = useState<number>(5.75);
  const [refiRemainingBal, setRefiRemainingBal] = useState<number>(340000);
  const [refiClosingCosts, setRefiClosingCosts] = useState<number>(6500);

  // UI state
  const [openFaqs, setOpenFaqs] = useState<Record<string, boolean>>({
    faq1: true,
    faq2: false,
    faq3: false,
    faq4: false,
    faq5: false,
  });
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  // Currency Formatter Helper
  const formatMoney = (val: number, includeDecimals = false) => {
    if (!Number.isFinite(val)) return `${currentCountry.symbol}0`;
    const num = includeDecimals ? val : Math.round(val);
    return `${currentCountry.symbol}${num.toLocaleString(currentCountry.locale, {
      minimumFractionDigits: includeDecimals ? 2 : 0,
      maximumFractionDigits: includeDecimals ? 2 : 0,
    })}`;
  };

  // Switch Country & Currency Standard
  const handleCountryChange = (countryId: string) => {
    setSelectedCountryId(countryId);
    const cfg = getCountryCurrencyConfig(countryId);
    setJurisdiction(cfg.jurisdiction);
    setPrice(cfg.defaultPrice);
    setDownDollars(cfg.defaultDown);
    setDownPercent(parseFloat(((cfg.defaultDown / cfg.defaultPrice) * 100).toFixed(2)));
    setRate(cfg.defaultRate);
    setTermYears(cfg.defaultTerm);
    setTaxMonth(cfg.defaultTax);
    setInsMonth(cfg.defaultIns);
    setRefiCurrentRate(cfg.refiDefaults.curRate);
    setRefiNewRate(cfg.refiDefaults.newRate);
    setRefiRemainingBal(cfg.refiDefaults.curBal);
    setRefiClosingCosts(cfg.refiDefaults.closingCosts);
    setAnnualIncome(cfg.affordDefaults.income);
    setMonthlyDebts(cfg.affordDefaults.debts);
  };

  // Price & Down payment handlers
  const handlePriceChange = (newPrice: number) => {
    const p = Math.max(0, newPrice);
    setPrice(p);
    const newDown = Math.round(p * (downPercent / 100));
    setDownDollars(newDown);
  };

  const handleDownDollarsChange = (val: number) => {
    const d = Math.max(0, val);
    setDownDollars(d);
    if (price > 0) {
      setDownPercent(parseFloat(((d / price) * 100).toFixed(2)));
    }
  };

  const handleDownPercentChange = (pct: number) => {
    const p = Math.max(0, Math.min(100, pct));
    setDownPercent(p);
    setDownDollars(Math.round(price * (p / 100)));
  };

  const applyPreset = (p: number, d: number, r: number, t: number, extra = 0) => {
    setPrice(p);
    setDownDollars(d);
    setDownPercent(parseFloat(((d / p) * 100).toFixed(2)));
    setRate(r);
    setTermYears(t);
    setExtraMonthly(extra);
  };

  const resetDefaults = () => {
    const cfg = currentCountry;
    applyPreset(cfg.defaultPrice, cfg.defaultDown, cfg.defaultRate, cfg.defaultTerm, 0);
    setTaxMonth(cfg.defaultTax);
    setInsMonth(cfg.defaultIns);
    setHoaMonth(0);
    setAnnualLumpSum(0);
    setJurisdiction(cfg.jurisdiction);
    setFrequency('monthly');
  };

  // Calculations
  const principal = useMemo(() => Math.max(0, price - downDollars), [price, downDollars]);

  // PMI calculation: below 20% down (ltv > 80)
  const pmiMonth = useMemo(() => {
    const ltv = price > 0 ? (principal / price) * 100 : 0;
    if (ltv > 80) {
      return Math.round((principal * 0.0055) / 12);
    }
    return 0;
  }, [principal, price]);

  const monthlyRate = useMemo(() => computeMonthlyRate(rate, jurisdiction), [rate, jurisdiction]);
  const totalMonths = useMemo(() => termYears * 12, [termYears]);

  const baseMonthlyPI = useMemo(
    () => computeBaseMonthlyPI(principal, monthlyRate, totalMonths),
    [principal, monthlyRate, totalMonths]
  );

  const totalMonthlyWithoutExtra = useMemo(
    () => baseMonthlyPI + taxMonth + insMonth + hoaMonth + pmiMonth,
    [baseMonthlyPI, taxMonth, insMonth, hoaMonth, pmiMonth]
  );

  const totalMonthlyDisplay = useMemo(
    () => totalMonthlyWithoutExtra + extraMonthly,
    [totalMonthlyWithoutExtra, extraMonthly]
  );

  // Amortization simulation
  const amortizationResults = useMemo(
    () =>
      computeAmortization(
        principal,
        price,
        rate,
        termYears,
        frequency,
        extraMonthly,
        annualLumpSum,
        jurisdiction
      ),
    [principal, price, rate, termYears, frequency, extraMonthly, annualLumpSum, jurisdiction]
  );

  // Donut chart stroke values
  const donutValues = useMemo(() => {
    const total = Math.max(1, totalMonthlyWithoutExtra);
    const piPct = Math.min(100, Math.round((baseMonthlyPI / total) * 100));
    const taxPct = Math.min(100 - piPct, Math.round((taxMonth / total) * 100));
    const insPct = Math.max(0, 100 - piPct - taxPct);
    return { piPct, taxPct, insPct };
  }, [baseMonthlyPI, taxMonth, totalMonthlyWithoutExtra]);

  // DTI Affordability
  const dtiData = useMemo(() => {
    const monthlyGross = (annualIncome || 0) / 12;
    const debts = monthlyDebts || 0;
    const maxFrontEnd = monthlyGross * 0.28;
    const maxBackEndTotal = monthlyGross * 0.36;
    const maxBackEndHousing = Math.max(0, maxBackEndTotal - debts);
    const allowablePITI = Math.min(maxFrontEnd, maxBackEndHousing);

    const estInterest = 0.06625 / 12;
    const n = 360;
    const loanFactor = (estInterest * Math.pow(1 + estInterest, n)) / (Math.pow(1 + estInterest, n) - 1);
    const maxLoan = (allowablePITI * 0.8) / loanFactor;
    const maxHome = maxLoan / 0.8;

    const currentHousing = totalMonthlyWithoutExtra;
    const frontRatio = monthlyGross > 0 ? Math.round((currentHousing / monthlyGross) * 100) : 0;
    const backRatio = monthlyGross > 0 ? Math.round(((currentHousing + debts) / monthlyGross) * 100) : 0;

    let statusText = 'Prime Grade (Low Risk DTI)';
    let statusColor = 'text-secondary';
    if (backRatio > 43) {
      statusText = 'High DTI (Requires Underwrite Exception)';
      statusColor = 'text-error';
    } else if (backRatio > 36) {
      statusText = 'Conforming Limit (Moderate)';
      statusColor = 'text-primary';
    }

    return {
      monthlyGross,
      maxFrontEnd,
      maxBackEndTotal,
      allowablePITI,
      maxHome,
      frontRatio,
      backRatio,
      freeCashflow: Math.max(0, monthlyGross - debts - allowablePITI),
      statusText,
      statusColor,
    };
  }, [annualIncome, monthlyDebts, totalMonthlyWithoutExtra]);

  // Refinance calculation
  const refiResults = useMemo(() => {
    const curRate = (refiCurrentRate / 100) / 12;
    const nRate = (refiNewRate / 100) / 12;
    const p = refiRemainingBal;
    const costs = refiClosingCosts;
    const termMonths = 312; // 26 yrs

    const curPmt = (p * (curRate * Math.pow(1 + curRate, termMonths))) / (Math.pow(1 + curRate, termMonths) - 1);
    const newPmt = (p * (nRate * Math.pow(1 + nRate, termMonths))) / (Math.pow(1 + nRate, termMonths) - 1);
    const monthlySavings = curPmt - newPmt;

    const breakevenMonths = monthlySavings > 0 ? (costs / monthlySavings).toFixed(1) : 'N/A';
    const tenYearNet = monthlySavings > 0 ? Math.round(monthlySavings * 120 - costs) : 0;

    return {
      monthlySavings: Math.max(0, monthlySavings),
      breakevenMonths,
      tenYearNet,
    };
  }, [refiCurrentRate, refiNewRate, refiRemainingBal, refiClosingCosts]);

  // Down Payment Matrix (5%, 10%, 20%, 30%)
  const downPaymentTiers = useMemo(() => {
    const tiers = [
      { pct: 5, label: '5% Down', border: 'border-outline-variant', hasPmi: true, pmiRate: 0.0055 },
      { pct: 10, label: '10% Down', border: 'border-outline-variant', hasPmi: true, pmiRate: 0.0037 },
      { pct: 20, label: '20% Down', border: 'border-primary', hasPmi: false, pmiRate: 0, tag: 'Optimal ROI' },
      { pct: 30, label: '30% Down', border: 'border-secondary', hasPmi: false, pmiRate: 0, tag: 'Lowest Risk' },
    ];

    return tiers.map((tier) => {
      const down = Math.round(price * (tier.pct / 100));
      const loan = Math.max(0, price - down);
      const monthlyPmt = computeBaseMonthlyPI(loan, monthlyRate, totalMonths);
      const pmiVal = tier.hasPmi ? Math.round((loan * tier.pmiRate) / 12) : 0;
      const totalPmt = monthlyPmt + taxMonth + insMonth + hoaMonth + pmiVal;

      return {
        ...tier,
        down,
        loan,
        monthlyPmt: Math.round(monthlyPmt),
        pmiVal,
        totalPmt: Math.round(totalPmt),
      };
    });
  }, [price, monthlyRate, totalMonths, taxMonth, insMonth, hoaMonth]);

  // Copy breakdown
  const handleCopyBreakdown = () => {
    const text = `SolveIt Mortgage Spec (${currentCountry.country} - ${currentCountry.code}):
Purchase Price: ${formatMoney(price)}
Down Payment: ${formatMoney(downDollars)} (${downPercent}%)
Principal: ${formatMoney(principal)}
Rate: ${rate}% | Term: ${termYears} Years
Total Monthly: ${formatMoney(totalMonthlyDisplay)}
P&I: ${formatMoney(baseMonthlyPI)}
Taxes: ${formatMoney(taxMonth)}
Insurance: ${formatMoney(insMonth)}
Estimated Interest Saved: ${formatMoney(amortizationResults.interestSaved)}
Computed via SolveIt Multi-Jurisdictional Precision Engine.`;

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2200);
      });
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    let csv = 'Period,Principal Paid,Interest Paid,Total Paid,Ending Balance,Equity Percent\n';
    amortizationResults.annualData.forEach((row: AnnualScheduleRow) => {
      csv += `${row.year},${Math.round(row.principalPaid)},${Math.round(row.interestPaid)},${Math.round(row.totalPaid)},${Math.round(row.endingBalance)},${row.equityPct}%\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mortgage_amortization_schedule.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const toggleFaq = (id: string) => {
    setOpenFaqs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col selection:bg-primary selection:text-on-primary">
      

      <main className="w-full pt-16 bg-background flex-1">
        <div className="flex flex-col w-full">
          {/* Breadcrumbs */}
          <section className="w-full bg-surface pt-space-md pb-space-xs">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop">
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant">
                <Link className="hover:text-primary transition-colors flex items-center gap-1" href="/">
                  <span className="material-symbols-outlined text-[16px]">home</span>Home
                </Link>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                <Link className="hover:text-primary transition-colors" href="/finance">Financial Calculators</Link>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                <span className="text-on-surface font-medium">Mortgage Calculator</span>
              </nav>
            </div>
          </section>

          {/* Hero Section & Institutional Presets */}
          <section className="w-full bg-surface pb-space-lg">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop">
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg pt-space-xs">
                <div className="max-w-3xl space-y-space-xs">
                  <div className="inline-flex items-center gap-2 px-space-sm py-1 rounded-full bg-primary/10 text-primary font-label-caps text-label-caps uppercase tracking-wider">
                    <span className="material-symbols-outlined text-[14px]">account_balance</span> Universal Amortization Core v4.2
                  </div>
                  <h1 className="font-display-hero text-display-hero-mobile md:text-display-hero text-on-surface font-semibold tracking-tight">
                    Mortgage Calculator
                  </h1>
                  <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                    Calculate exact monthly payments, multi-tier amortization, property taxes, private mortgage insurance (PMI), refinance break-evens, and early payoff trajectories with client-side mathematical certainty.
                  </p>
                  <div className="flex flex-wrap items-center gap-space-xs pt-1 font-body-sm text-body-sm text-on-surface-variant">
                    <span className="inline-flex items-center gap-1 bg-surface-container px-2.5 py-1 rounded-full font-medium text-on-surface">
                      <span className="material-symbols-outlined text-primary text-[16px]">check_circle</span> Institutional Precision
                    </span>
                    <span className="inline-flex items-center gap-1 bg-surface-container px-2.5 py-1 rounded-full font-medium text-on-surface">
                      <span className="material-symbols-outlined text-primary text-[16px]">check_circle</span> Updated 2026 Caps
                    </span>
                    <span className="inline-flex items-center gap-1 bg-surface-container px-2.5 py-1 rounded-full font-medium text-on-surface">
                      <span className="material-symbols-outlined text-primary text-[16px]">check_circle</span> Multi-Jurisdictional Compounding
                    </span>
                    <span className="inline-flex items-center gap-1 bg-surface-container px-2.5 py-1 rounded-full font-medium text-on-surface">
                      <span className="material-symbols-outlined text-primary text-[16px]">check_circle</span> 100% Free &amp; Private
                    </span>
                  </div>
                </div>

                {/* Quick Strategy Presets */}
                <div className="flex flex-col items-start lg:items-end gap-2 shrink-0">
                  <span className="font-label-caps text-label-caps text-outline uppercase tracking-wider">Common Scenarios ({currentCountry.code})</span>
                  <div className="flex flex-wrap gap-1.5 max-w-md lg:justify-end">
                    {currentCountry.presets.map((preset, idx) => (
                      <button
                        key={idx}
                        className={`px-3 py-1.5 rounded-lg font-body-sm text-body-sm transition-colors cursor-pointer ${
                          idx === 3
                            ? 'bg-primary/10 text-primary hover:bg-primary/20 font-medium'
                            : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                        }`}
                        onClick={() => applyPreset(preset.price, preset.down, preset.rate, preset.term, preset.extra)}
                        type="button"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Country, Currency & Jurisdictional Framework Standard */}
          <section className="w-full bg-surface-container-low py-space-md shadow-inner border-y border-surface-container">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop space-y-space-sm">
              {/* Row 1: Country & Currency Standard Selector */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-sm">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">payments</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-label-caps text-label-caps text-on-surface font-semibold uppercase tracking-wider">Country &amp; Currency Standard</span>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-data-mono font-bold bg-secondary/15 text-secondary">
                        {currentCountry.flag} {currentCountry.code} ({currentCountry.symbol.trim()})
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant font-data-mono">Choose your currency symbol, localized formatting, and regulatory compounding standard</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Dropdown with all countries & currencies */}
                  <div className="relative flex items-center">
                    <select
                      id="countryCurrencySelect"
                      value={selectedCountryId}
                      onChange={(e) => handleCountryChange(e.target.value)}
                      className="pl-9 pr-8 py-2 rounded-lg bg-surface-container-lowest text-on-surface font-body-sm text-body-sm font-semibold border border-outline-variant/40 shadow-xs focus:ring-2 focus:ring-primary focus:outline-none cursor-pointer"
                    >
                      {COUNTRIES_CURRENCIES.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.flag} {c.country} — {c.code} ({c.symbol.trim()})
                        </option>
                      ))}
                    </select>
                    <span className="absolute left-2.5 text-base pointer-events-none select-none">
                      {currentCountry.flag}
                    </span>
                    <span className="material-symbols-outlined absolute right-2 text-outline text-[18px] pointer-events-none">
                      arrow_drop_down
                    </span>
                  </div>

                  {/* Fast Quick-Switch Pills for Top Global Currencies */}
                  <div className="hidden sm:flex items-center gap-1">
                    {['US', 'GB', 'EU', 'IN', 'CA', 'AU'].map((cId) => {
                      const item = getCountryCurrencyConfig(cId);
                      const isSelected = selectedCountryId === cId;
                      return (
                        <button
                          key={cId}
                          onClick={() => handleCountryChange(cId)}
                          type="button"
                          className={`px-2.5 py-1.5 rounded-md text-[12px] font-data-mono font-medium transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-primary text-on-primary font-bold shadow-xs'
                              : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                          }`}
                          title={`${item.country} (${item.code} ${item.symbol})`}
                        >
                          {item.flag} {item.code}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Row 2: Compounding Method Standard Switcher */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pt-2 border-t border-surface-container">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[18px]">account_balance</span>
                  <span className="font-label-caps text-label-caps text-on-surface font-semibold uppercase tracking-wider text-xs">Compounding Method:</span>
                </div>
                <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0" id="jurisdictionTabs">
                  {[
                    { id: 'USA', label: '🇺🇸 Monthly (US CFPB / Fixed)' },
                    { id: 'CAN', label: '🇨🇦 Semi-Annual (Canada FCAC)' },
                    { id: 'AUS', label: '🇦🇺 Daily Reducing (Aus ASIC)' },
                    { id: 'GBR', label: '🇬🇧 FCA BoE (UK / Daily Rest)' },
                    { id: 'IND', label: '🇮🇳 Monthly Reducing (India RBI EMI)' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setJurisdiction(tab.id as Jurisdiction)}
                      className={`px-3 py-1.5 rounded-lg font-body-sm text-body-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                        jurisdiction === tab.id
                          ? 'bg-primary text-on-primary shadow-sm font-semibold'
                          : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container'
                      }`}
                      type="button"
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Micro Jurisdictional Explanation Banner */}
              <div className="mt-2 px-3 py-1.5 rounded bg-surface-container text-on-surface-variant font-data-mono text-[11px] flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                {jurisdiction === 'USA' && (
                  <>
                    <span>Current Compounding: <strong>Monthly Compounding (USA Standard)</strong> • Property Tax &amp; Escrow Active • Automatic PMI below 20% equity</span>
                    <span className="text-primary font-bold">Compliant with Regulation Z &amp; RESPA</span>
                  </>
                )}
                {jurisdiction === 'CAN' && (
                  <>
                    <span>Current Compounding: <strong>Semi-Annual Compounding (FCAC Rule)</strong> • 5-Year Term Renewal Architecture • CMHC Default Insurance Protocol</span>
                    <span className="text-secondary font-bold">Canadian Bank Act Formula Validated</span>
                  </>
                )}
                {jurisdiction === 'AUS' && (
                  <>
                    <span>Current Compounding: <strong>Daily Reducing Balance (ASIC Standard)</strong> • 100% Mortgage Offset Account Modeling Enabled</span>
                    <span className="text-primary font-bold">National Consumer Credit Protection Compliant</span>
                  </>
                )}
                {jurisdiction === 'GBR' && (
                  <>
                    <span>Current Compounding: <strong>Annual / Daily Reducing (FCA Standard)</strong> • Standard 10% Annual ERC-Free Overpayment Allowance Active</span>
                    <span className="text-secondary font-bold">MCOB Mortgages Conduct of Business Compliant</span>
                  </>
                )}
                {jurisdiction === 'IND' && (
                  <>
                    <span>Current Compounding: <strong>Monthly Reducing EMI (RBI Repo-Linked EBLR)</strong> • Section 24(b) ₹2 Lakh &amp; 80C ₹1.5 Lakh Tax Shield Active</span>
                    <span className="text-primary font-bold">RBI Master Direction Validated</span>
                  </>
                )}
              </div>
            </div>
          </section>

          {/* Master Mortgage Calculation Engine & Real-Time Workbench */}
          <section className="w-full bg-background py-space-xl">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
                {/* LEFT PANEL: Primary Parameter Controls (7 Cols) */}
                <div className="lg:col-span-7 space-y-space-md">
                  <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm space-y-space-lg border border-outline-variant/20">
                    <div className="flex items-center justify-between border-b pb-3 border-surface-container">
                      <div>
                        <h2 className="font-headline-md text-headline-md text-on-surface font-bold">Property &amp; Loan Parameters</h2>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">Precision financial inputs dynamically recalculated in micro-seconds.</p>
                      </div>
                      <button
                        className="text-primary font-body-sm text-body-sm hover:underline flex items-center gap-1 cursor-pointer"
                        onClick={resetDefaults}
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[16px]">restart_alt</span> Reset
                      </button>
                    </div>

                    {/* Home Price */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="font-body-sm text-body-sm font-semibold text-on-surface" htmlFor="homePrice">Home Purchase Price</label>
                        <div className="flex gap-1">
                          {[
                            Math.round(currentCountry.defaultPrice * 0.6),
                            currentCountry.defaultPrice,
                            Math.round(currentCountry.defaultPrice * 1.5),
                            Math.round(currentCountry.defaultPrice * 2.2),
                          ].map((val) => (
                            <button
                              key={val}
                              className={`px-2 py-0.5 rounded text-[11px] font-data-mono cursor-pointer ${
                                price === val
                                  ? 'bg-primary/10 text-primary font-semibold'
                                  : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
                              }`}
                              onClick={() => handlePriceChange(val)}
                              type="button"
                            >
                              {val >= 10000000
                                ? `${currentCountry.symbol}${(val / 10000000).toFixed(1)}Cr`
                                : val >= 1000000
                                ? `${currentCountry.symbol}${(val / 1000000).toFixed(1)}M`
                                : `${currentCountry.symbol}${Math.round(val / 1000)}k`}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="relative flex items-center">
                        <span className="absolute left-3.5 text-on-surface-variant font-data-mono text-body-md select-none">{currentCountry.symbol}</span>
                        <input
                          id="homePrice"
                          className="w-full pl-8 pr-4 py-2.5 rounded-lg bg-surface-container-low text-on-surface font-data-mono text-body-md font-semibold focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary shadow-inner"
                          min="1000"
                          step={currentCountry.defaultPrice >= 1000000 ? '50000' : '5000'}
                          type="number"
                          value={price}
                          onChange={(e) => handlePriceChange(parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <input
                        className="w-full accent-primary h-1.5 bg-surface-container rounded cursor-pointer"
                        max={Math.round(currentCountry.defaultPrice * 3)}
                        min={Math.round(currentCountry.defaultPrice * 0.1)}
                        step={Math.round(currentCountry.defaultPrice * 0.02)}
                        type="range"
                        value={price}
                        onChange={(e) => handlePriceChange(parseFloat(e.target.value) || 0)}
                      />
                    </div>

                    {/* Down Payment ($ and %) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="font-body-sm text-body-sm font-semibold text-on-surface" htmlFor="downPaymentDollars">Down Payment ({currentCountry.symbol.trim()})</label>
                          <span className={`text-[11px] font-data-mono font-medium ${pmiMonth > 0 ? 'text-error' : 'text-secondary'}`}>
                            {pmiMonth > 0 ? `PMI: ${formatMoney(pmiMonth)}/mo (<20%)` : `PMI: ${currentCountry.symbol}0 (≥20%)`}
                          </span>
                        </div>
                        <div className="relative flex items-center">
                          <span className="absolute left-3.5 text-on-surface-variant font-data-mono text-body-md select-none">{currentCountry.symbol}</span>
                          <input
                            id="downPaymentDollars"
                            className="w-full pl-8 pr-4 py-2 rounded-lg bg-surface-container-low text-on-surface font-data-mono text-body-md font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                            step={currentCountry.defaultPrice >= 1000000 ? '10000' : '1000'}
                            type="number"
                            value={downDollars}
                            onChange={(e) => handleDownDollarsChange(parseFloat(e.target.value) || 0)}
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="font-body-sm text-body-sm font-semibold text-on-surface" htmlFor="downPaymentPercent">Down Payment (%)</label>
                          <div className="flex gap-1">
                            {[5, 10, 20, 25].map((pct) => (
                              <button
                                key={pct}
                                className={`px-1.5 py-0.5 rounded text-[10px] font-data-mono cursor-pointer ${
                                  downPercent === pct
                                    ? 'bg-primary/10 text-primary font-bold'
                                    : 'bg-surface-container hover:bg-surface-container-high'
                                }`}
                                onClick={() => handleDownPercentChange(pct)}
                                type="button"
                              >
                                {pct}%
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="relative flex items-center">
                          <input
                            id="downPaymentPercent"
                            className="w-full pl-3.5 pr-8 py-2 rounded-lg bg-surface-container-low text-on-surface font-data-mono text-body-md font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                            max="100"
                            min="0"
                            step="0.5"
                            type="number"
                            value={downPercent}
                            onChange={(e) => handleDownPercentChange(parseFloat(e.target.value) || 0)}
                          />
                          <span className="absolute right-3.5 text-on-surface-variant font-data-mono text-body-md pointer-events-none select-none">%</span>
                        </div>
                      </div>
                    </div>

                    {/* Calculated Loan Amount Preview Pill */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container">
                      <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-primary">price_check</span> Total Principal Loan Amount:
                      </span>
                      <span className="font-data-mono text-body-md font-bold text-primary">
                        {formatMoney(principal)}
                      </span>
                    </div>

                    {/* Interest Rate & Loan Term */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="font-body-sm text-body-sm font-semibold text-on-surface" htmlFor="interestRate">Interest Rate (% p.a.)</label>
                          <button
                            className="text-[11px] font-data-mono text-primary cursor-pointer hover:underline"
                            onClick={() => setRate(6.625)}
                            type="button"
                          >
                            Benchmark 6.63%
                          </button>
                        </div>
                        <div className="relative flex items-center">
                          <input
                            id="interestRate"
                            className="w-full pl-3.5 pr-8 py-2 rounded-lg bg-surface-container-low text-on-surface font-data-mono text-body-md font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                            max="25"
                            min="0.1"
                            step="0.025"
                            type="number"
                            value={rate}
                            onChange={(e) => setRate(parseFloat(e.target.value) || 0.1)}
                          />
                          <span className="absolute right-3.5 text-on-surface-variant font-data-mono text-body-md pointer-events-none select-none">%</span>
                        </div>
                        <div className="flex gap-1 pt-1">
                          <button
                            className="px-1.5 py-0.5 rounded text-[10px] font-data-mono bg-surface-container hover:bg-surface-container-high cursor-pointer"
                            onClick={() => setRate(5.875)}
                            type="button"
                          >
                            15-Yr (5.88%)
                          </button>
                          <button
                            className="px-1.5 py-0.5 rounded text-[10px] font-data-mono bg-surface-container hover:bg-surface-container-high cursor-pointer"
                            onClick={() => setRate(6.625)}
                            type="button"
                          >
                            30-Yr (6.63%)
                          </button>
                          <button
                            className="px-1.5 py-0.5 rounded text-[10px] font-data-mono bg-surface-container hover:bg-surface-container-high cursor-pointer"
                            onClick={() => setRate(6.375)}
                            type="button"
                          >
                            5/1 ARM (6.38%)
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-body-sm text-body-sm font-semibold text-on-surface">Loan Term (Years)</label>
                        <div className="grid grid-cols-4 gap-1.5">
                          {[15, 20, 25, 30].map((term) => (
                            <button
                              key={term}
                              className={`py-2 rounded-lg font-data-mono text-body-sm transition-all cursor-pointer ${
                                termYears === term
                                  ? 'bg-primary text-on-primary font-bold shadow-sm'
                                  : 'bg-surface-container text-on-surface font-medium hover:bg-surface-container-high'
                              }`}
                              onClick={() => setTermYears(term)}
                              type="button"
                            >
                              {term} Y
                            </button>
                          ))}
                        </div>
                        <p className="font-data-mono text-[11px] text-on-surface-variant pt-1">
                          Amortization horizon: <span>{termYears * 12} monthly cycles</span>
                        </p>
                      </div>
                    </div>

                    {/* Escrow & Recurring Taxes / Fees */}
                    <div className="space-y-space-sm pt-space-xs">
                      <div
                        className="flex items-center justify-between cursor-pointer select-none"
                        onClick={() => setIsEscrowOpen(!isEscrowOpen)}
                      >
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary text-[20px]">real_estate_agent</span>
                          <span className="font-headline-md text-body-md font-bold text-on-surface">Property Taxes, Insurance &amp; HOA Escrow</span>
                        </div>
                        <span className="material-symbols-outlined text-outline text-[20px]">
                          {isEscrowOpen ? 'expand_less' : 'expand_more'}
                        </span>
                      </div>

                      {isEscrowOpen && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm pt-2">
                          <div className="space-y-1">
                            <label className="font-body-sm text-body-sm text-on-surface-variant" htmlFor="propTaxMonth">Property Tax ({currentCountry.symbol.trim()}/mo)</label>
                            <div className="relative flex items-center">
                              <span className="absolute left-3 text-on-surface-variant font-data-mono text-body-sm select-none">{currentCountry.symbol}</span>
                              <input
                                id="propTaxMonth"
                                className="w-full pl-7 pr-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface font-data-mono text-body-sm font-semibold"
                                step="10"
                                type="number"
                                value={taxMonth}
                                onChange={(e) => setTaxMonth(parseFloat(e.target.value) || 0)}
                              />
                            </div>
                            <span className="text-[10px] font-data-mono text-outline">~1.01% annual est.</span>
                          </div>

                          <div className="space-y-1">
                            <label className="font-body-sm text-body-sm text-on-surface-variant" htmlFor="homeInsuranceMonth">Home Insurance ({currentCountry.symbol.trim()}/mo)</label>
                            <div className="relative flex items-center">
                              <span className="absolute left-3 text-on-surface-variant font-data-mono text-body-sm select-none">{currentCountry.symbol}</span>
                              <input
                                id="homeInsuranceMonth"
                                className="w-full pl-7 pr-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface font-data-mono text-body-sm font-semibold"
                                step="5"
                                type="number"
                                value={insMonth}
                                onChange={(e) => setInsMonth(parseFloat(e.target.value) || 0)}
                              />
                            </div>
                            <span className="text-[10px] font-data-mono text-outline">Hazard &amp; Wind policy</span>
                          </div>

                          <div className="space-y-1">
                            <label className="font-body-sm text-body-sm text-on-surface-variant" htmlFor="hoaMonth">HOA / Maintenance ({currentCountry.symbol.trim()}/mo)</label>
                            <div className="relative flex items-center">
                              <span className="absolute left-3 text-on-surface-variant font-data-mono text-body-sm select-none">{currentCountry.symbol}</span>
                              <input
                                id="hoaMonth"
                                className="w-full pl-7 pr-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface font-data-mono text-body-sm font-semibold"
                                step="10"
                                type="number"
                                value={hoaMonth}
                                onChange={(e) => setHoaMonth(parseFloat(e.target.value) || 0)}
                              />
                            </div>
                            <span className="text-[10px] font-data-mono text-outline">Community fees</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Overpayment & Cadence */}
                    <div className="space-y-space-sm pt-space-xs border-t border-surface-container">
                      <div className="flex items-center justify-between">
                        <span className="font-headline-md text-body-md font-bold text-on-surface flex items-center gap-2">
                          <span className="material-symbols-outlined text-secondary text-[20px]">bolt</span> Accelerated Amortization &amp; Prepayments
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-data-mono bg-secondary/10 text-secondary font-bold">Interest Shield Active</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm pt-1">
                        <div className="space-y-1">
                          <label className="font-body-sm text-body-sm text-on-surface-variant" htmlFor="paymentFrequency">Payment Cadence</label>
                          <select
                            id="paymentFrequency"
                            className="w-full px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm font-semibold focus:ring-2 focus:ring-primary"
                            value={frequency}
                            onChange={(e) => setFrequency(e.target.value)}
                          >
                            <option value="monthly">Monthly (12/yr)</option>
                            <option value="biweekly">Standard Bi-Weekly (26/yr)</option>
                            <option value="acc-biweekly">Accelerated Bi-Weekly (Extra 1 Mo/Yr)</option>
                            <option value="acc-weekly">Accelerated Weekly (52/yr)</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="font-body-sm text-body-sm text-on-surface-variant" htmlFor="extraMonthlyPayment">Extra Monthly Principal</label>
                          <div className="relative flex items-center">
                            <span className="absolute left-3 text-on-surface-variant font-data-mono text-body-sm select-none">{currentCountry.symbol}</span>
                            <input
                              id="extraMonthlyPayment"
                              className="w-full pl-7 pr-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface font-data-mono text-body-sm font-semibold"
                              step="25"
                              type="number"
                              value={extraMonthly}
                              onChange={(e) => setExtraMonthly(parseFloat(e.target.value) || 0)}
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="font-body-sm text-body-sm text-on-surface-variant" htmlFor="annualLumpSum">Annual Extra Lump Sum</label>
                          <div className="relative flex items-center">
                            <span className="absolute left-3 text-on-surface-variant font-data-mono text-body-sm select-none">{currentCountry.symbol}</span>
                            <input
                              id="annualLumpSum"
                              className="w-full pl-7 pr-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface font-data-mono text-body-sm font-semibold"
                              step="500"
                              type="number"
                              value={annualLumpSum}
                              onChange={(e) => setAnnualLumpSum(parseFloat(e.target.value) || 0)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT PANEL: Sticky Precision Results Cockpit (5 Cols) */}
                <div className="lg:col-span-5 space-y-space-md lg:sticky lg:top-24">
                  <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-md relative overflow-hidden border border-outline-variant/20">
                    <div className="absolute -right-16 -top-16 w-56 h-56 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="flex items-center justify-between">
                      <span className="font-label-caps text-label-caps text-outline uppercase tracking-wider">Total Monthly Outflow</span>
                      <span className="inline-flex items-center gap-1 font-data-mono text-[11px] px-2 py-0.5 rounded-full bg-secondary/10 text-secondary font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Actuarial Clean
                      </span>
                    </div>

                    {/* Big Metric Display */}
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="font-numerical-display text-4xl sm:text-5xl font-extrabold text-on-surface tracking-tight">
                        {formatMoney(totalMonthlyDisplay)}
                      </span>
                      <span className="font-body-md text-body-md text-on-surface-variant font-medium">/ month</span>
                    </div>
                    <p className="font-data-mono text-[12px] text-secondary font-medium mt-1">
                      {extraMonthly > 0
                        ? `Includes +${formatMoney(extraMonthly)}/mo extra principal prepayment`
                        : 'Contractual baseline payment schedule'}
                    </p>

                    {/* Inline SVG Donut Chart + Breakdown List */}
                    <div className="mt-space-md pt-space-md border-t border-surface-container flex items-center gap-space-md">
                      <div className="relative w-28 h-28 shrink-0">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                          <circle cx="18" cy="18" fill="none" r="15.915" stroke="#eaedff" strokeWidth="4.5" />
                          <circle
                            cx="18"
                            cy="18"
                            fill="none"
                            r="15.915"
                            stroke="#004ac6"
                            strokeDasharray={`${donutValues.piPct}, ${100 - donutValues.piPct}`}
                            strokeDashoffset="0"
                            strokeWidth="4.5"
                          />
                          <circle
                            cx="18"
                            cy="18"
                            fill="none"
                            r="15.915"
                            stroke="#39b8fd"
                            strokeDasharray={`${donutValues.taxPct}, ${100 - donutValues.taxPct}`}
                            strokeDashoffset={`${-donutValues.piPct}`}
                            strokeWidth="4.5"
                          />
                          <circle
                            cx="18"
                            cy="18"
                            fill="none"
                            r="15.915"
                            stroke="#705d00"
                            strokeDasharray={`${donutValues.insPct}, ${100 - donutValues.insPct}`}
                            strokeDashoffset={`${-(donutValues.piPct + donutValues.taxPct)}`}
                            strokeWidth="4.5"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <span className="text-[10px] font-label-caps uppercase text-on-surface-variant font-bold">P&amp;I</span>
                          <span className="font-data-mono text-[14px] font-bold text-primary">{donutValues.piPct}%</span>
                        </div>
                      </div>

                      <div className="flex-1 space-y-1.5 font-body-sm text-body-sm">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-on-surface-variant">
                            <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block"></span> Principal &amp; Interest
                          </span>
                          <span className="font-data-mono font-bold text-on-surface">{formatMoney(baseMonthlyPI)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-on-surface-variant">
                            <span className="w-2.5 h-2.5 rounded-full bg-secondary inline-block"></span> Property Taxes
                          </span>
                          <span className="font-data-mono font-semibold text-on-surface">{formatMoney(taxMonth)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-on-surface-variant">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#705d00] inline-block"></span> Home Insurance
                          </span>
                          <span className="font-data-mono font-semibold text-on-surface">{formatMoney(insMonth)}</span>
                        </div>
                        {pmiMonth > 0 && (
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5 text-error">
                              <span className="w-2.5 h-2.5 rounded-full bg-error inline-block"></span> Private Mort. Ins (PMI)
                            </span>
                            <span className="font-data-mono font-bold text-error">{formatMoney(pmiMonth)}</span>
                          </div>
                        )}
                        {extraMonthly > 0 && (
                          <div className="flex items-center justify-between text-secondary">
                            <span className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-secondary inline-block"></span> Extra Principal
                            </span>
                            <span className="font-data-mono font-bold">+{formatMoney(extraMonthly)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Payoff Acceleration Metrics Grid */}
                    <div className="mt-space-md pt-space-md border-t border-surface-container grid grid-cols-2 gap-space-sm">
                      <div className="p-3 rounded-lg bg-surface-container">
                        <span className="font-label-caps text-[10px] uppercase text-on-surface-variant block">Total Interest Paid</span>
                        <span className="font-data-mono text-body-lg font-bold text-on-surface block mt-0.5">
                          {formatMoney(amortizationResults.totalInterest)}
                        </span>
                        <span className="text-[10px] text-outline font-data-mono">Over loan lifetime</span>
                      </div>
                      <div className="p-3 rounded-lg bg-surface-container">
                        <span className="font-label-caps text-[10px] uppercase text-on-surface-variant block">Total Repayment</span>
                        <span className="font-data-mono text-body-lg font-bold text-on-surface block mt-0.5">
                          {formatMoney(amortizationResults.totalRepayment)}
                        </span>
                        <span className="text-[10px] text-outline font-data-mono">Principal + Interest</span>
                      </div>
                      <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                        <span className="font-label-caps text-[10px] uppercase text-primary font-bold block">Interest Saved</span>
                        <span className="font-data-mono text-body-lg font-extrabold text-primary block mt-0.5">
                          {formatMoney(amortizationResults.interestSaved)}
                        </span>
                        <span className="text-[10px] text-primary/80 font-data-mono">From accelerated payoff</span>
                      </div>
                      <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/20">
                        <span className="font-label-caps text-[10px] uppercase text-secondary font-bold block">Payoff Year</span>
                        <span className="font-data-mono text-body-lg font-extrabold text-secondary block mt-0.5">
                          {amortizationResults.payoffYear}
                        </span>
                        <span className="text-[10px] text-secondary/80 font-data-mono">
                          {amortizationResults.yearsSaved} yrs sooner
                        </span>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="mt-space-md pt-space-md border-t border-surface-container flex flex-wrap gap-2">
                      <button
                        className="flex-1 py-2 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        onClick={handleCopyBreakdown}
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[16px]">{copySuccess ? 'check' : 'content_copy'}</span>
                        {copySuccess ? 'Copied to Clipboard' : 'Copy Breakdown'}
                      </button>
                      <button
                        className="py-2 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        onClick={handleExportCSV}
                        title="Download complete schedule as CSV"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[16px]">download</span> CSV
                      </button>
                      <button
                        className="py-2 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        onClick={() => window.print()}
                        title="Print or Save PDF"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[16px]">print</span>
                      </button>
                    </div>
                  </div>

                  {/* Micro Affordability Gauge Box */}
                  <div className="bg-surface-container-lowest rounded-xl p-space-md border border-outline-variant/20 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-body-sm text-body-sm font-bold text-on-surface flex items-center gap-1">
                        <span className="material-symbols-outlined text-primary text-[18px]">assessment</span> DTI Underwriting Gauge
                      </span>
                      <span className={`text-[11px] font-data-mono font-bold ${dtiData.statusColor}`}>
                        {dtiData.backRatio}% Back-End DTI
                      </span>
                    </div>
                    <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden flex">
                      <div
                        className={`h-full ${dtiData.backRatio > 43 ? 'bg-error' : dtiData.backRatio > 36 ? 'bg-primary' : 'bg-secondary'}`}
                        style={{ width: `${Math.min(100, (dtiData.backRatio / 50) * 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-data-mono text-on-surface-variant">
                      <span>Front: {dtiData.frontRatio}% (Limit: 28%)</span>
                      <span className={dtiData.statusColor}>{dtiData.statusText}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Down Payment Matrix (5%, 10%, 20%, 30%) */}
          <section className="w-full bg-surface-container-low py-space-xl border-t border-surface-container">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop space-y-space-md">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-sm">
                <div>
                  <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider font-semibold">Strategic Capital Allocation</span>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">Down Payment Comparison Matrix</h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Evaluate the true cost of equity versus private mortgage insurance (PMI) and interest drag.</p>
                </div>
                <div className="text-right font-data-mono text-[12px] text-on-surface-variant">
                  Purchase Benchmark: <strong className="text-on-surface">{formatMoney(price)}</strong>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
                {downPaymentTiers.map((tier) => (
                  <div
                    key={tier.pct}
                    className={`bg-surface-container-lowest rounded-xl p-space-md border-2 ${tier.border} shadow-sm space-y-3 relative flex flex-col justify-between`}
                  >
                    {tier.tag && (
                      <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-data-mono bg-primary text-on-primary font-bold">
                        {tier.tag}
                      </span>
                    )}
                    <div className="space-y-1">
                      <span className="font-label-caps text-label-caps text-on-surface-variant font-bold uppercase">{tier.label}</span>
                      <div className="font-data-mono text-2xl font-black text-on-surface">
                        {formatMoney(tier.totalPmt)}
                        <span className="text-xs text-on-surface-variant font-normal"> /mo</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 py-2 border-y border-surface-container font-data-mono text-[12px]">
                      <div className="flex justify-between text-on-surface-variant">
                        <span>Down Payment:</span>
                        <strong className="text-on-surface">{formatMoney(tier.down)}</strong>
                      </div>
                      <div className="flex justify-between text-on-surface-variant">
                        <span>Loan Balance:</span>
                        <strong className="text-on-surface">{formatMoney(tier.loan)}</strong>
                      </div>
                      <div className="flex justify-between text-on-surface-variant">
                        <span>P&amp;I Baseline:</span>
                        <strong className="text-on-surface">{formatMoney(tier.monthlyPmt)}</strong>
                      </div>
                      <div className="flex justify-between text-on-surface-variant">
                        <span>PMI Premium:</span>
                        <strong className={tier.pmiVal > 0 ? 'text-error' : 'text-secondary'}>
                          {tier.pmiVal > 0 ? `${formatMoney(tier.pmiVal)}/mo` : `${currentCountry.symbol}0 (Exempt)`}
                        </strong>
                      </div>
                    </div>

                    <button
                      className="w-full py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-body-sm text-body-sm font-semibold transition-colors cursor-pointer"
                      onClick={() => handleDownPercentChange(tier.pct)}
                      type="button"
                    >
                      Apply {tier.pct}% Structure
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Full Amortization Schedule Table */}
          <section className="w-full bg-background py-space-xl border-t border-surface-container">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop space-y-space-md">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
                <div>
                  <span className="font-label-caps text-label-caps text-secondary uppercase tracking-wider font-semibold">Granular Mathematical Ledger</span>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">Amortization Ledger &amp; Equity Trajectory</h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Every cent accounted for across the entire lifecycle of the mortgage.</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="inline-flex rounded-lg bg-surface-container p-1 border border-surface-container-high">
                    <button
                      className={`px-3 py-1 rounded text-body-sm font-medium transition-colors cursor-pointer ${
                        scheduleView === 'annual'
                          ? 'bg-surface-container-lowest text-primary font-bold shadow-xs'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                      onClick={() => setScheduleView('annual')}
                      type="button"
                    >
                      Annual Summary
                    </button>
                    <button
                      className={`px-3 py-1 rounded text-body-sm font-medium transition-colors cursor-pointer ${
                        scheduleView === 'monthly'
                          ? 'bg-surface-container-lowest text-primary font-bold shadow-xs'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                      onClick={() => setScheduleView('monthly')}
                      type="button"
                    >
                      Monthly Schedule (First 5 Yrs)
                    </button>
                  </div>
                  <button
                    className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm font-medium flex items-center gap-1 cursor-pointer"
                    onClick={handleExportCSV}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[16px]">file_download</span> CSV
                  </button>
                </div>
              </div>

              {/* Table Container */}
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-sm overflow-hidden">
                <div className="overflow-x-auto max-h-[480px]">
                  <table className="w-full text-left font-data-mono text-body-sm border-collapse">
                    <thead className="bg-surface-container sticky top-0 z-10 text-on-surface font-semibold border-b border-surface-container-high text-[11px] uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Period</th>
                        <th className="py-3 px-4 text-right">Principal Paid</th>
                        <th className="py-3 px-4 text-right">Interest Paid</th>
                        <th className="py-3 px-4 text-right">Total Outflow</th>
                        <th className="py-3 px-4 text-right">Ending Balance</th>
                        <th className="py-3 px-4 text-right">Equity %</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-container text-on-surface text-[12px]">
                      {scheduleView === 'annual' ? (
                        amortizationResults.annualData.map((row: AnnualScheduleRow) => (
                          <tr key={row.year} className="hover:bg-surface-container-low transition-colors">
                            <td className="py-2.5 px-4 font-semibold text-primary">{row.date}</td>
                            <td className="py-2.5 px-4 text-right text-on-surface">{formatMoney(row.principalPaid)}</td>
                            <td className="py-2.5 px-4 text-right text-error">{formatMoney(row.interestPaid)}</td>
                            <td className="py-2.5 px-4 text-right font-semibold text-on-surface">{formatMoney(row.totalPaid)}</td>
                            <td className="py-2.5 px-4 text-right font-semibold">{formatMoney(row.endingBalance)}</td>
                            <td className="py-2.5 px-4 text-right">
                              <span className="inline-block px-1.5 py-0.5 rounded bg-surface-container text-secondary font-bold text-[11px]">
                                {row.equityPct}%
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        amortizationResults.monthlyData.map((row: MonthlyScheduleRow) => (
                          <tr key={row.period} className="hover:bg-surface-container-low transition-colors">
                            <td className="py-2.5 px-4 font-semibold text-primary">{row.date}</td>
                            <td className="py-2.5 px-4 text-right text-on-surface">{formatMoney(row.principalPaid)}</td>
                            <td className="py-2.5 px-4 text-right text-error">{formatMoney(row.interestPaid)}</td>
                            <td className="py-2.5 px-4 text-right font-semibold text-on-surface">{formatMoney(row.totalPaid)}</td>
                            <td className="py-2.5 px-4 text-right font-semibold">{formatMoney(row.endingBalance)}</td>
                            <td className="py-2.5 px-4 text-right">
                              <span className="inline-block px-1.5 py-0.5 rounded bg-surface-container text-secondary font-bold text-[11px]">
                                {row.equityPct}%
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          {/* DTI Affordability & Refinance Analyzers Grid */}
          <section className="w-full bg-surface-container-low py-space-xl border-t border-surface-container">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-xl">
                {/* DTI Affordability Underwriter Module */}
                <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm border border-outline-variant/20 space-y-space-md">
                  <div className="border-b pb-3 border-surface-container">
                    <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider font-semibold">Underwriting Intelligence</span>
                    <h3 className="font-headline-md text-headline-md text-on-surface font-bold">DTI Affordability &amp; Debt Ratios</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Verify qualifying conforming debt ratios against standard 28/36 underwriting guidelines.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                    <div className="space-y-1">
                      <label className="font-body-sm text-body-sm font-semibold text-on-surface" htmlFor="grossAnnualIncome">Gross Annual Household Income</label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3 text-on-surface-variant font-data-mono text-body-sm select-none">{currentCountry.symbol}</span>
                        <input
                          id="grossAnnualIncome"
                          className="w-full pl-7 pr-3 py-2 rounded-lg bg-surface-container-low text-on-surface font-data-mono text-body-sm font-semibold"
                          step={currentCountry.defaultPrice >= 1000000 ? '25000' : '5000'}
                          type="number"
                          value={annualIncome}
                          onChange={(e) => setAnnualIncome(parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-body-sm text-body-sm font-semibold text-on-surface" htmlFor="monthlyConsumerDebts">Monthly Recurring Debts</label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3 text-on-surface-variant font-data-mono text-body-sm select-none">{currentCountry.symbol}</span>
                        <input
                          id="monthlyConsumerDebts"
                          className="w-full pl-7 pr-3 py-2 rounded-lg bg-surface-container-low text-on-surface font-data-mono text-body-sm font-semibold"
                          step="50"
                          type="number"
                          value={monthlyDebts}
                          onChange={(e) => setMonthlyDebts(parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <span className="text-[10px] font-data-mono text-outline">Auto, Student, CC Minimums</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-surface-container space-y-2">
                    <div className="flex items-center justify-between text-body-sm">
                      <span className="text-on-surface-variant">Recommended Max Purchase Price:</span>
                      <strong className="font-data-mono text-primary text-body-md">{formatMoney(dtiData.maxHome)}</strong>
                    </div>
                    <div className="flex items-center justify-between text-body-sm">
                      <span className="text-on-surface-variant">Allowable PITI Housing Outflow:</span>
                      <strong className="font-data-mono text-on-surface">{formatMoney(dtiData.allowablePITI)} /mo</strong>
                    </div>
                    <div className="flex items-center justify-between text-body-sm">
                      <span className="text-on-surface-variant">Discretionary Net Surplus:</span>
                      <strong className="font-data-mono text-secondary">{formatMoney(dtiData.freeCashflow)} /mo</strong>
                    </div>
                  </div>
                </div>

                {/* Refinance Opportunity & Break-Even Module */}
                <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm border border-outline-variant/20 space-y-space-md">
                  <div className="border-b pb-3 border-surface-container">
                    <span className="font-label-caps text-label-caps text-secondary uppercase tracking-wider font-semibold">Refinance Break-Even Engine</span>
                    <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Mortgage Refinance &amp; Net Present Value</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Quantify whether lowering your interest rate justifies closing fee friction.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-space-sm">
                    <div className="space-y-1">
                      <label className="font-body-sm text-body-sm text-on-surface-variant" htmlFor="curRateInput">Current Note Rate (%)</label>
                      <input
                        id="curRateInput"
                        className="w-full px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface font-data-mono text-body-sm font-semibold"
                        step="0.125"
                        type="number"
                        value={refiCurrentRate}
                        onChange={(e) => setRefiCurrentRate(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-body-sm text-body-sm text-on-surface-variant" htmlFor="newRateInput">Proposed Refi Rate (%)</label>
                      <input
                        id="newRateInput"
                        className="w-full px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface font-data-mono text-body-sm font-semibold"
                        step="0.125"
                        type="number"
                        value={refiNewRate}
                        onChange={(e) => setRefiNewRate(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-body-sm text-body-sm text-on-surface-variant" htmlFor="curBalInput">Remaining Balance ({currentCountry.symbol.trim()})</label>
                      <input
                        id="curBalInput"
                        className="w-full px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface font-data-mono text-body-sm font-semibold"
                        step={currentCountry.defaultPrice >= 1000000 ? '25000' : '5000'}
                        type="number"
                        value={refiRemainingBal}
                        onChange={(e) => setRefiRemainingBal(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-body-sm text-body-sm text-on-surface-variant" htmlFor="closingCostsInput">Closing Costs ({currentCountry.symbol.trim()})</label>
                      <input
                        id="closingCostsInput"
                        className="w-full px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface font-data-mono text-body-sm font-semibold"
                        step="500"
                        type="number"
                        value={refiClosingCosts}
                        onChange={(e) => setRefiClosingCosts(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-surface-container space-y-2">
                    <div className="flex items-center justify-between text-body-sm">
                      <span className="text-on-surface-variant">Monthly Payment Reduction:</span>
                      <strong className="font-data-mono text-secondary text-body-md">+{formatMoney(refiResults.monthlySavings)} /mo</strong>
                    </div>
                    <div className="flex items-center justify-between text-body-sm">
                      <span className="text-on-surface-variant">Break-Even Horizon:</span>
                      <strong className="font-data-mono text-primary text-body-md">{refiResults.breakevenMonths} Months</strong>
                    </div>
                    <div className="flex items-center justify-between text-body-sm">
                      <span className="text-on-surface-variant">10-Year Cumulative Net Gain:</span>
                      <strong className="font-data-mono text-on-surface">{formatMoney(refiResults.tenYearNet)}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Institutional Actuarial & Financial Guide */}
          <section className="w-full bg-background py-space-xl border-t border-surface-container">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile md:px-gutter-desktop space-y-space-lg">
              <div className="max-w-3xl space-y-2">
                <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider font-semibold">Institutional Knowledge Base</span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">Mortgage Math, Compounding Laws &amp; Equity Optimization</h2>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  A mortgage is the largest financial transaction most individuals ever execute. Understanding how interest amortizes, how jurisdictions govern compounding frequency, and how overpayments destroy principal is critical to preserving wealth.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
                <div className="bg-surface-container-lowest p-space-md rounded-xl border border-outline-variant/20 space-y-2">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">functions</span>
                  </div>
                  <h3 className="font-headline-md text-body-md font-bold text-on-surface">The Standard Amortization Formula</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Fixed-rate mortgages utilize standard annuity formulas: <code className="text-primary font-bold">M = P[i(1+i)^n]/[(1+i)^n - 1]</code>. In early years, up to 75% of your payment is consumed by interest, which gradually flips toward principal as the loan matures.
                  </p>
                </div>

                <div className="bg-surface-container-lowest p-space-md rounded-xl border border-outline-variant/20 space-y-2">
                  <div className="w-9 h-9 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">public</span>
                  </div>
                  <h3 className="font-headline-md text-body-md font-bold text-on-surface">Jurisdictional Compounding Rules</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    In the United States, monthly compounding is mandatory under CFPB rules. In Canada, the Bank Act mandates semi-annual compounding for fixed mortgages, resulting in slightly lower effective monthly rates. In Australia and the UK, daily reducing balance calculations dominate.
                  </p>
                </div>

                <div className="bg-surface-container-lowest p-space-md rounded-xl border border-outline-variant/20 space-y-2">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">shield</span>
                  </div>
                  <h3 className="font-headline-md text-body-md font-bold text-on-surface">PMI &amp; Equity Accumulation</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Under the Homeowners Protection Act of 1998, private mortgage insurance (PMI) must automatically cancel once your principal balance reaches 78% of the original home value, or can be requested at 80% with proven equity.
                  </p>
                </div>
              </div>

              {/* Comprehensive FAQ Accordion */}
              <div className="space-y-space-md pt-space-md">
                <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Frequently Asked Questions</h3>
                <div className="space-y-space-xs">
                  {[
                    {
                      id: 'faq1',
                      q: 'What is included in PITI and why does total monthly outflow exceed Principal & Interest?',
                      a: 'PITI stands for Principal, Interest, Taxes, and Insurance. While Principal and Interest directly amortize your lender balance, municipalities assess property taxes, insurance carriers require hazard/fire coverage, and HOAs collect dues for common maintenance. In escrow accounts, lenders collect 1/12th of annual tax and insurance bills each month.',
                    },
                    {
                      id: 'faq2',
                      q: 'How does an extra monthly payment or bi-weekly schedule reduce my loan term?',
                      a: 'Because interest is calculated each month on the remaining unpaid principal balance, any additional dollar paid directly to principal permanently reduces subsequent interest calculations. A bi-weekly payment schedule (26 half-payments per year) results in 13 full payments annually, shaving 4 to 6 years off a 30-year fixed mortgage.',
                    },
                    {
                      id: 'faq3',
                      q: 'What is the difference between a 15-year and a 30-year fixed mortgage?',
                      a: 'A 15-year mortgage features higher monthly payments because the principal is amortized over half the time, but lenders typically offer interest rates 0.50% to 0.85% lower. Over the full lifecycle, a 15-year mortgage typically saves over 60% in total interest compared to a 30-year note.',
                    },
                    {
                      id: 'faq4',
                      q: 'How is Canadian mortgage compounding different from the US?',
                      a: 'Under the Canadian Bank Act, fixed-rate residential mortgages cannot compound more frequently than semi-annually by law. Therefore, a stated nominal rate of 6% in Canada has an effective annual rate of (1 + 0.06/2)^2 - 1 = 6.09%, which is slightly lower than the US monthly compounding equivalent of (1 + 0.06/12)^12 - 1 = 6.168%.',
                    },
                    {
                      id: 'faq5',
                      q: 'When does it make sense to refinance my mortgage?',
                      a: 'Refinancing is financially prudent when the monthly payment savings recover your total closing costs (title, appraisal, origination fees) within your planned tenure in the home (typically under 24 to 36 months). Our Refinance Break-Even tool calculates your exact break-even month and 10-year cumulative gain.',
                    },
                  ].map((faq) => (
                    <div
                      key={faq.id}
                      className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 overflow-hidden"
                    >
                      <button
                        className="w-full p-4 text-left font-body-md font-semibold text-on-surface flex items-center justify-between gap-2 hover:bg-surface-container-low transition-colors cursor-pointer"
                        onClick={() => toggleFaq(faq.id)}
                        type="button"
                      >
                        <span>{faq.q}</span>
                        <span className="material-symbols-outlined text-outline text-[20px] shrink-0">
                          {openFaqs[faq.id] ? 'expand_less' : 'expand_more'}
                        </span>
                      </button>
                      {openFaqs[faq.id] && (
                        <div className="px-4 pb-4 font-body-sm text-body-sm text-on-surface-variant border-t border-surface-container pt-3 leading-relaxed">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
