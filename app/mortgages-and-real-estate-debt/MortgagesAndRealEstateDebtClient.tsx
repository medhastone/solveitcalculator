'use client';

import React, { useState, useMemo, useId } from 'react';
import Link from 'next/link';

// All 12 clusters with 106 calculators total
interface DirectoryCluster {
  id: string;
  name: string;
  icon: string;
  colorClass: string;
  tools: { name: string; href: string }[];
}

const CLUSTERS: DirectoryCluster[] = [
  {
    id: 'mortgage-payments',
    name: 'Mortgage Payments',
    icon: 'payments',
    colorClass: 'text-primary',
    tools: [
      { name: 'Mortgage Calculator', href: '/finance/mortgage-calculator' },
      { name: 'Mortgage Payment Calculator', href: '/finance/mortgage-calculator' },
      { name: 'Monthly Mortgage Calculator', href: '/finance/mortgage-calculator' },
      { name: 'Home Loan Calculator', href: '/finance/mortgage-calculator' },
      { name: 'Mortgage Cost Calculator', href: '/finance/mortgage-calculator' },
      { name: 'Mortgage Breakdown Calculator', href: '/finance/mortgage-calculator' },
      { name: 'Mortgage Comparison Calculator', href: '/finance/mortgage-calculator' },
      { name: 'Mortgage Interest Calculator', href: '/finance/mortgage-calculator' },
      { name: 'Loan-to-Value (LTV) Calculator', href: '/finance/mortgage-calculator' },
      { name: 'Mortgage Balance Calculator', href: '/finance/mortgage-calculator' },
    ],
  },
  {
    id: 'fixed-rate',
    name: 'Fixed-Rate Mortgages',
    icon: 'lock_clock',
    colorClass: 'text-secondary',
    tools: [
      { name: '30-Year Mortgage Calculator', href: '/finance/mortgage-calculator' },
      { name: '15-Year Mortgage Calculator', href: '/finance/mortgage-calculator' },
      { name: '20-Year Mortgage Calculator', href: '/finance/mortgage-calculator' },
      { name: 'Fixed Mortgage Calculator', href: '/finance/mortgage-calculator' },
      { name: 'Fixed Rate Comparison Calculator', href: '/finance/mortgage-calculator' },
      { name: 'Long-Term Mortgage Calculator', href: '/finance/mortgage-calculator' },
      { name: 'Short-Term Mortgage Calculator', href: '/finance/mortgage-calculator' },
    ],
  },
  {
    id: 'arm-loans',
    name: 'Adjustable-Rate (ARM)',
    icon: 'tune',
    colorClass: 'text-tertiary',
    tools: [
      { name: 'ARM Calculator', href: '/finance/mortgage-calculator' },
      { name: '5/1 ARM Calculator', href: '/finance/mortgage-calculator' },
      { name: '7/1 ARM Calculator', href: '/finance/mortgage-calculator' },
      { name: '10/1 ARM Calculator', href: '/finance/mortgage-calculator' },
      { name: 'ARM vs Fixed Calculator', href: '/finance/mortgage-calculator' },
      { name: 'Rate Adjustment Calculator', href: '/finance/mortgage-calculator' },
      { name: 'ARM Break-Even Calculator', href: '/finance/mortgage-calculator' },
      { name: 'ARM Payment Projection Tool', href: '/finance/mortgage-calculator' },
    ],
  },
  {
    id: 'piti-cost',
    name: 'PITI Housing Cost',
    icon: 'receipt',
    colorClass: 'text-primary',
    tools: [
      { name: 'PITI Calculator', href: '/finance/mortgage-calculator' },
      { name: 'Property Tax Calculator', href: '/finance/mortgage-calculator' },
      { name: 'Homeowners Insurance Calculator', href: '/finance/mortgage-calculator' },
      { name: 'Escrow Calculator', href: '/finance/mortgage-calculator' },
      { name: 'Monthly Housing Cost Calculator', href: '/finance/mortgage-calculator' },
      { name: 'Mortgage Breakdown Calculator', href: '/finance/mortgage-calculator' },
      { name: 'Total Ownership Cost Tool', href: '/finance/mortgage-calculator' },
    ],
  },
  {
    id: 'pmi-down',
    name: 'PMI & Down Payment',
    icon: 'verified_user',
    colorClass: 'text-secondary',
    tools: [
      { name: 'PMI Calculator', href: '/finance/mortgage-calculator' },
      { name: 'Private Mortgage Insurance Tool', href: '/finance/mortgage-calculator' },
      { name: 'PMI Removal Calculator', href: '/finance/mortgage-calculator' },
      { name: 'PMI Savings Calculator', href: '/finance/mortgage-calculator' },
      { name: 'LTV Calculator', href: '/finance/mortgage-calculator' },
      { name: 'Down Payment Calculator', href: '/finance/mortgage-calculator' },
      { name: '20 Percent Equity Calculator', href: '/finance/mortgage-calculator' },
    ],
  },
  {
    id: 'affordability',
    name: 'Home Affordability',
    icon: 'credit_score',
    colorClass: 'text-tertiary',
    tools: [
      { name: 'Home Affordability Calculator', href: '/finance/mortgage-calculator' },
      { name: 'How Much House Can I Afford', href: '/finance/mortgage-calculator' },
      { name: 'Mortgage Qualification Tool', href: '/finance/mortgage-calculator' },
      { name: 'Debt-to-Income (DTI) Calculator', href: '/finance/mortgage-calculator' },
      { name: 'Housing Budget Calculator', href: '/finance/mortgage-calculator' },
      { name: 'Maximum Loan Calculator', href: '/finance/mortgage-calculator' },
      { name: 'Mortgage Eligibility Calculator', href: '/finance/mortgage-calculator' },
    ],
  },
  {
    id: 'refinance',
    name: 'Refinancing & Restructure',
    icon: 'sync',
    colorClass: 'text-primary',
    tools: [
      { name: 'Mortgage Refinance Calculator', href: '/finance/mortgage-calculator' },
      { name: 'Refinance Savings Calculator', href: '/finance/mortgage-calculator' },
      { name: 'Refinance Break-Even Calculator', href: '/finance/mortgage-calculator' },
      { name: 'Cash-Out Refinance Calculator', href: '/finance/mortgage-calculator' },
      { name: 'Rate Reduction Calculator', href: '/finance/mortgage-calculator' },
      { name: 'Refinance Cost Calculator', href: '/finance/mortgage-calculator' },
      { name: 'Mortgage Buydown Calculator', href: '/finance/mortgage-calculator' },
      { name: 'Mortgage Points Calculator', href: '/finance/mortgage-calculator' },
    ],
  },
  {
    id: 'equity-wealth',
    name: 'Home Equity & Wealth',
    icon: 'trending_up',
    colorClass: 'text-secondary',
    tools: [
      { name: 'Home Equity Calculator', href: '/finance/mortgage-calculator' },
      { name: 'Equity Growth Calculator', href: '/finance/mortgage-calculator' },
      { name: 'Home Appreciation Calculator', href: '/finance/mortgage-calculator' },
      { name: 'Loan-to-Value Calculator', href: '/finance/mortgage-calculator' },
      { name: 'Cash-Out Equity Calculator', href: '/finance/mortgage-calculator' },
      { name: 'Home Wealth Accumulator', href: '/finance/mortgage-calculator' },
    ],
  },
  {
    id: 'payoff-freedom',
    name: 'Payoff & Early Freedom',
    icon: 'bolt',
    colorClass: 'text-tertiary',
    tools: [
      { name: 'Mortgage Payoff Calculator', href: '/finance/mortgage-calculator' },
      { name: 'Extra Payment Calculator', href: '/finance/mortgage-calculator' },
      { name: 'Biweekly Mortgage Calculator', href: '/finance/mortgage-calculator' },
      { name: 'Early Payoff Calculator', href: '/finance/mortgage-calculator' },
      { name: 'Interest Savings Calculator', href: '/finance/mortgage-calculator' },
      { name: 'Accelerated Mortgage Planner', href: '/finance/mortgage-calculator' },
      { name: 'Mortgage Freedom Calculator', href: '/finance/mortgage-calculator' },
    ],
  },
  {
    id: 'property-investment',
    name: 'Property Investment',
    icon: 'real_estate_agent',
    colorClass: 'text-primary',
    tools: [
      { name: 'Rental Property Calculator', href: '/finance/mortgage-calculator' },
      { name: 'Investment Property Calculator', href: '/finance/mortgage-calculator' },
      { name: 'Rental Cash Flow Calculator', href: '/finance/mortgage-calculator' },
      { name: 'DSCR Loan Calculator', href: '/finance/mortgage-calculator' },
      { name: 'Cap Rate Calculator', href: '/finance/mortgage-calculator' },
      { name: 'Cash-on-Cash Return Tool', href: '/finance/mortgage-calculator' },
      { name: 'Rental ROI Calculator', href: '/finance/mortgage-calculator' },
      { name: 'Property Financing Calculator', href: '/finance/mortgage-calculator' },
    ],
  },
  {
    id: 'closing-costs',
    name: 'Closing Costs & Fees',
    icon: 'price_check',
    colorClass: 'text-secondary',
    tools: [
      { name: 'Closing Cost Calculator', href: '/finance/mortgage-calculator' },
      { name: 'Mortgage Fee Calculator', href: '/finance/mortgage-calculator' },
      { name: 'Title Cost Calculator', href: '/finance/mortgage-calculator' },
      { name: 'Origination Fee Calculator', href: '/finance/mortgage-calculator' },
      { name: 'Transfer Tax Calculator', href: '/finance/mortgage-calculator' },
      { name: 'Home Purchase Cost Calculator', href: '/finance/mortgage-calculator' },
    ],
  },
  {
    id: 'debt-strategy',
    name: 'Debt Strategy & Planning',
    icon: 'hub',
    colorClass: 'text-tertiary',
    tools: [
      { name: 'Mortgage vs Rent Calculator', href: '/finance/mortgage-calculator' },
      { name: '2-1 Buydown Calculator', href: '/finance/mortgage-calculator' },
      { name: 'Debt Consolidation Mortgage', href: '/finance/mortgage-calculator' },
      { name: 'HELOC Calculator', href: '/finance/mortgage-calculator' },
      { name: 'Second Mortgage Calculator', href: '/finance/mortgage-calculator' },
      { name: 'Bridge Loan Calculator', href: '/finance/mortgage-calculator' },
      { name: 'Real Estate Debt Planner', href: '/finance/mortgage-calculator' },
    ],
  },
];

export default function MortgagesAndRealEstateDebtClient() {
  const equityGradId = useId();
  const balanceGradId = useId();

  // Search & category filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  // Simulator Inputs
  const [homePrice, setHomePrice] = useState(450000);
  const [downPayment, setDownPayment] = useState(90000);
  const [loanTerm, setLoanTerm] = useState(30);
  const [interestRate, setInterestRate] = useState(6.625);
  const [propertyTax, setPropertyTax] = useState(4500);
  const [hazardInsurance, setHazardInsurance] = useState(1440);
  const [extraPrincipal, setExtraPrincipal] = useState(150);

  // Modal for schedule
  const [showAmortizationModal, setShowAmortizationModal] = useState(false);

  // Derived down payment percentage
  const downPaymentPercent = useMemo(() => {
    if (homePrice <= 0) return 0;
    return Math.min(100, Math.max(0, (downPayment / homePrice) * 100));
  }, [homePrice, downPayment]);

  const loanPrincipal = useMemo(() => {
    return Math.max(0, homePrice - downPayment);
  }, [homePrice, downPayment]);

  // Calculation Engine
  const calcResults = useMemo(() => {
    const P = loanPrincipal;
    const n = loanTerm * 12;
    const r = (interestRate / 100) / 12;

    const monthlyTax = propertyTax / 12;
    const monthlyIns = hazardInsurance / 12;

    // Base P&I
    let baseMonthlyPI = 0;
    if (r > 0 && n > 0 && P > 0) {
      baseMonthlyPI = (P * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
    } else if (n > 0) {
      baseMonthlyPI = P / n;
    }

    // PMI calculation: required if downPaymentPercent < 20%
    const isPMIActive = downPaymentPercent < 20 && P > 0;
    // Typical conventional annual PMI rate around 0.75% of original balance
    const monthlyPMI = isPMIActive ? (P * 0.0075) / 12 : 0;

    // First month allocation
    const firstMonthInterest = P * r;
    const firstMonthPrincipal = Math.max(0, baseMonthlyPI - firstMonthInterest);

    const totalMonthlyCommitment = baseMonthlyPI + monthlyTax + monthlyIns + monthlyPMI + extraPrincipal;

    // Amortization simulation with extra principal
    let balance = P;
    let monthsElapsed = 0;
    let totalInterestPaid = 0;
    const monthlyRegularPayment = baseMonthlyPI + extraPrincipal;

    const yearlySchedule: Array<{
      year: number;
      startingBalance: number;
      principalPaid: number;
      interestPaid: number;
      endingBalance: number;
      equity: number;
    }> = [];

    let currentYearPrincipal = 0;
    let currentYearInterest = 0;
    let yearStartBal = P;

    while (balance > 0 && monthsElapsed < 600) {
      monthsElapsed++;
      const interestStep = balance * r;
      totalInterestPaid += interestStep;
      currentYearInterest += interestStep;

      let principalStep = monthlyRegularPayment - interestStep;
      if (principalStep > balance) {
        principalStep = balance;
      }
      balance -= principalStep;
      currentYearPrincipal += principalStep;

      // Record yearly schedule
      if (monthsElapsed % 12 === 0 || balance <= 0) {
        const yr = Math.ceil(monthsElapsed / 12);
        yearlySchedule.push({
          year: yr,
          startingBalance: yearStartBal,
          principalPaid: currentYearPrincipal,
          interestPaid: currentYearInterest,
          endingBalance: Math.max(0, balance),
          equity: homePrice - Math.max(0, balance),
        });
        yearStartBal = Math.max(0, balance);
        currentYearPrincipal = 0;
        currentYearInterest = 0;
      }
    }

    // Baseline standard interest (without extra payments)
    const standardTotalInterest = (baseMonthlyPI * n) - P;
    const interestSaved = Math.max(0, standardTotalInterest - totalInterestPaid);
    const monthsSaved = Math.max(0, n - monthsElapsed);

    const payYears = Math.floor(monthsElapsed / 12);
    const payMonths = monthsElapsed % 12;

    const lifetimeTotalCost = P + totalInterestPaid + (propertyTax * (monthsElapsed / 12)) + (hazardInsurance * (monthsElapsed / 12));

    // Component percentages for stacked bar
    const sumComponents = (firstMonthPrincipal + extraPrincipal) + firstMonthInterest + monthlyTax + monthlyIns + monthlyPMI;
    const pctPrincipal = sumComponents > 0 ? (((firstMonthPrincipal + extraPrincipal) / sumComponents) * 100) : 25;
    const pctInterest = sumComponents > 0 ? ((firstMonthInterest / sumComponents) * 100) : 55;
    const pctTaxes = sumComponents > 0 ? ((monthlyTax / sumComponents) * 100) : 15;
    const pctInsurance = sumComponents > 0 ? (((monthlyIns + monthlyPMI) / sumComponents) * 100) : 5;

    return {
      baseMonthlyPI,
      monthlyTax,
      monthlyIns,
      isPMIActive,
      monthlyPMI,
      firstMonthPrincipal,
      firstMonthInterest,
      totalMonthlyCommitment,
      monthsElapsed,
      payYears,
      payMonths,
      monthsSaved,
      totalInterestPaid,
      interestSaved,
      lifetimeTotalCost,
      pctPrincipal,
      pctInterest,
      pctTaxes,
      pctInsurance,
      yearlySchedule,
    };
  }, [loanPrincipal, loanTerm, interestRate, propertyTax, hazardInsurance, extraPrincipal, downPaymentPercent, homePrice]);

  // Format helper
  const fmt = (n: number) => '$' + Math.round(n).toLocaleString('en-US');
  const fmtExact = (n: number) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Reset presets
  const handleReset = () => {
    setHomePrice(450000);
    setDownPayment(90000);
    setLoanTerm(30);
    setInterestRate(6.625);
    setPropertyTax(4500);
    setHazardInsurance(1440);
    setExtraPrincipal(150);
  };

  // Preset price chip click
  const handleSelectPricePreset = (price: number) => {
    setHomePrice(price);
    setDownPayment(Math.round(price * 0.20));
    setPropertyTax(Math.round(price * 0.01));
  };

  // Load a scenario into the simulator
  const handleLoadScenario = (scenario: string) => {
    if (scenario === 'extra150') {
      setHomePrice(450000);
      setDownPayment(90000);
      setLoanTerm(30);
      setInterestRate(6.625);
      setExtraPrincipal(150);
    } else if (scenario === '15yr') {
      setHomePrice(400000);
      setDownPayment(80000);
      setLoanTerm(15);
      setInterestRate(5.875);
      setExtraPrincipal(0);
    } else if (scenario === '10down') {
      setHomePrice(450000);
      setDownPayment(45000);
      setLoanTerm(30);
      setInterestRate(6.75);
      setExtraPrincipal(0);
    } else if (scenario === 'arm') {
      setHomePrice(550000);
      setDownPayment(110000);
      setLoanTerm(7);
      setInterestRate(5.95);
      setExtraPrincipal(0);
    } else if (scenario === 'refi') {
      setHomePrice(450000);
      setDownPayment(150000);
      setLoanTerm(30);
      setInterestRate(5.875);
      setExtraPrincipal(100);
    }
  };

  // Filter clusters by search & filter chip
  const filteredClusters = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return CLUSTERS.map(cluster => {
      // Category filter check
      if (selectedFilter !== 'All') {
        const filterMap: Record<string, string[]> = {
          'PITI Payments': ['mortgage-payments', 'piti-cost'],
          '15 vs 30 Year': ['fixed-rate'],
          'Refinancing': ['refinance'],
          'Affordability': ['affordability'],
          'ARM Loans': ['arm-loans'],
          'Home Equity': ['equity-wealth'],
          'Investment Property': ['property-investment'],
        };
        const validClusters = filterMap[selectedFilter];
        if (validClusters && !validClusters.includes(cluster.id)) {
          return null;
        }
      }

      if (!q) return cluster;

      const clusterMatches = cluster.name.toLowerCase().includes(q);
      const matchingTools = cluster.tools.filter(t => t.name.toLowerCase().includes(q));

      if (clusterMatches) return cluster;
      if (matchingTools.length > 0) {
        return {
          ...cluster,
          tools: matchingTools,
        };
      }
      return null;
    }).filter(Boolean) as DirectoryCluster[];
  }, [searchQuery, selectedFilter]);

  const totalFilteredTools = useMemo(() => {
    return filteredClusters.reduce((acc, c) => acc + c.tools.length, 0);
  }, [filteredClusters]);

  return (
    <div className="min-h-screen bg-surface font-body-md text-on-surface">
      

      <main className="w-full pt-16 bg-surface">
        <div className="flex flex-col w-full">

          {/* TOP BREADCRUMBS & CATEGORY HERO */}
          <section className="w-full bg-surface-container-low/60 py-space-md border-b border-surface-container/60">
            <div className="max-w-[1280px] mx-auto px-gutter-desktop">
              <nav aria-label="Breadcrumb" className="flex items-center gap-space-xs font-body-sm text-body-sm text-on-surface-variant mb-space-sm">
                <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">home</span> Home
                </Link>
                <span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
                <Link href="/finance" className="hover:text-primary transition-colors">Financial Calculators</Link>
                <span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
                <span className="text-on-surface font-semibold">Mortgages &amp; Real Estate Debt</span>
              </nav>

              <div className="flex flex-wrap items-center gap-space-xs mb-space-xs">
                <span className="inline-flex items-center gap-1.5 px-space-xs py-0.5 rounded bg-primary/10 text-primary font-label-caps text-label-caps uppercase font-bold">
                  <span className="material-symbols-outlined text-[14px]">real_estate_agent</span> Consumer Housing &amp; Mortgage Finance
                </span>
                <span className="inline-flex items-center gap-1 px-space-xs py-0.5 rounded bg-surface-container-high text-secondary font-label-caps text-label-caps uppercase font-semibold">
                  <span className="material-symbols-outlined text-[13px]">verified</span> Free, Accurate &amp; Independent Guide
                </span>
                <span className="inline-flex items-center gap-1 px-space-xs py-0.5 rounded bg-surface-container text-on-surface-variant font-label-caps text-label-caps uppercase">
                  <span className="material-symbols-outlined text-[13px]">gavel</span> Truth in Lending Act (TILA) &amp; RESPA Calibrated
                </span>
              </div>

              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md mt-space-xs">
                <div className="max-w-3xl">
                  <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
                    Mortgages &amp; Real Estate Debt Calculators
                  </h1>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-space-2xs max-w-2xl leading-relaxed">
                    Calculate mortgage payments, PITI costs, PMI expenses, ARM scenarios, refinancing savings, affordability limits, home equity growth, and real estate financing costs with advanced, user-friendly mortgage calculators.
                  </p>
                </div>

                <div className="w-full lg:w-96 shrink-0">
                  <div className="relative flex items-center bg-surface-container-lowest rounded-xl shadow-sm px-space-md py-space-xs border border-outline-variant/30 focus-within:border-primary transition-all">
                    <span className="material-symbols-outlined text-outline text-[20px] mr-space-xs">search</span>
                    <input
                      id="calcSearchInput"
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search mortgage calculators, 15 vs 30-year, PMI..."
                      className="w-full bg-transparent font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none"
                    />
                    <span className="font-data-mono text-label-caps text-on-surface-variant bg-surface-container px-1.5 py-0.5 rounded">
                      106 Tools
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Category Filters */}
              <div className="flex items-center gap-space-xs overflow-x-auto pt-space-md pb-space-xs no-scrollbar">
                {[
                  'All',
                  'PITI Payments',
                  '15 vs 30 Year',
                  'Refinancing',
                  'Affordability',
                  'ARM Loans',
                  'Home Equity',
                  'Investment Property',
                ].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSelectedFilter(tag)}
                    className={`px-space-sm py-1 rounded-full font-label-caps text-label-caps whitespace-nowrap transition-all ${
                      selectedFilter === tag
                        ? 'bg-primary text-on-primary shadow-sm font-bold'
                        : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {tag === 'All' ? 'All Tools (106)' : tag}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 1: LIVE INTERACTIVE MORTGAGE & PITI WORKBENCH */}
          <section className="w-full max-w-[1280px] mx-auto px-gutter-desktop py-space-2xl">
            <div className="bg-surface-container-lowest rounded-2xl shadow-xl overflow-hidden border border-outline-variant/20">
              
              {/* Workbench Header */}
              <div className="bg-gradient-to-r from-primary to-primary-container px-space-xl py-space-md text-on-primary flex flex-wrap items-center justify-between gap-space-md">
                <div className="flex items-center gap-space-sm">
                  <span className="p-2 rounded-xl bg-on-primary/10 text-on-primary">
                    <span className="material-symbols-outlined text-[24px]">calculate</span>
                  </span>
                  <div>
                    <div className="font-label-caps text-label-caps uppercase text-primary-fixed tracking-wider">
                      Interactive Live Simulator
                    </div>
                    <h2 className="font-headline-md text-headline-md font-bold text-on-primary leading-tight">
                      Mortgage Payment &amp; Full PITI Cost Workbench
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-space-xs">
                  <button
                    id="btnResetValues"
                    type="button"
                    onClick={handleReset}
                    className="px-space-sm py-1.5 rounded-lg bg-on-primary/10 hover:bg-on-primary/20 text-on-primary font-body-sm text-body-sm flex items-center gap-1 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">restart_alt</span> Reset Presets
                  </button>
                  <button
                    id="btnPrintSchedule"
                    type="button"
                    onClick={() => window.print()}
                    className="px-space-sm py-1.5 rounded-lg bg-on-primary text-primary font-body-sm text-body-sm font-semibold flex items-center gap-1 transition-colors shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[16px]">print</span> Print Schedule
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                
                {/* Input Panel (5 Cols) */}
                <div className="lg:col-span-5 p-space-xl bg-surface-container-lowest flex flex-col gap-space-md border-r border-surface-container/60">
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps uppercase text-on-surface-variant font-bold">
                      Loan Parameters
                    </span>
                    <span className="font-data-mono text-label-caps text-secondary font-semibold">
                      Client-Side Dynamic Mode
                    </span>
                  </div>

                  {/* Home Purchase Price */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label htmlFor="homePriceInput" className="font-body-sm text-body-sm font-semibold text-on-surface">
                        Home Purchase Price
                      </label>
                      <span className="font-data-mono text-body-sm font-bold text-primary">
                        {fmt(homePrice)}
                      </span>
                    </div>
                    <div className="relative mb-2">
                      <span className="absolute left-3 top-2.5 text-outline font-data-mono">$</span>
                      <input
                        id="homePriceInput"
                        type="number"
                        step="5000"
                        value={homePrice}
                        onChange={(e) => {
                          const p = parseFloat(e.target.value) || 0;
                          setHomePrice(p);
                          setDownPayment(Math.round(p * 0.20));
                        }}
                        className="w-full pl-8 pr-3 py-2 rounded-xl bg-surface-container-low font-data-mono text-body-md text-on-surface focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 transition-all outline-none border border-outline-variant/30"
                      />
                    </div>
                    <div className="flex gap-1.5 flex-wrap">
                      {[300000, 450000, 600000, 850000, 1200000].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => handleSelectPricePreset(val)}
                          className={`px-2 py-0.5 rounded font-data-mono text-label-caps transition-colors ${
                            homePrice === val
                              ? 'bg-primary text-on-primary font-bold'
                              : 'bg-surface-container text-on-surface-variant hover:bg-primary hover:text-on-primary'
                          }`}
                        >
                          {val >= 1000000 ? `$${val / 1000000}M` : `$${val / 1000}k`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Down Payment */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label htmlFor="downPaymentInput" className="font-body-sm text-body-sm font-semibold text-on-surface">
                        Down Payment ({downPaymentPercent.toFixed(1)}%)
                      </label>
                      <span className="font-data-mono text-body-sm font-semibold text-on-surface">
                        {fmt(downPayment)}
                      </span>
                    </div>
                    <div className="relative mb-2">
                      <span className="absolute left-3 top-2.5 text-outline font-data-mono">$</span>
                      <input
                        id="downPaymentInput"
                        type="number"
                        step="2500"
                        value={downPayment}
                        onChange={(e) => setDownPayment(parseFloat(e.target.value) || 0)}
                        className="w-full pl-8 pr-3 py-2 rounded-xl bg-surface-container-low font-data-mono text-body-md text-on-surface focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 transition-all outline-none border border-outline-variant/30"
                      />
                    </div>
                    <input
                      id="downPercentSlider"
                      type="range"
                      min="0"
                      max="50"
                      step="1"
                      value={Math.round(downPaymentPercent)}
                      onChange={(e) => {
                        const pct = parseFloat(e.target.value) || 0;
                        setDownPayment(Math.round(homePrice * (pct / 100)));
                      }}
                      className="w-full accent-primary cursor-pointer"
                    />
                  </div>

                  {/* Loan Term & Rate */}
                  <div className="grid grid-cols-2 gap-space-sm">
                    <div>
                      <label htmlFor="loanTermSelect" className="font-body-sm text-body-sm font-semibold text-on-surface block mb-1">
                        Loan Term
                      </label>
                      <select
                        id="loanTermSelect"
                        value={loanTerm}
                        onChange={(e) => setLoanTerm(parseFloat(e.target.value) || 30)}
                        className="w-full py-2 px-3 rounded-xl bg-surface-container-low font-body-sm text-body-sm text-on-surface outline-none cursor-pointer border border-outline-variant/30"
                      >
                        <option value="30">30-Yr Fixed</option>
                        <option value="15">15-Yr Fixed</option>
                        <option value="20">20-Yr Fixed</option>
                        <option value="5">5/1 ARM (30-Yr)</option>
                        <option value="7">7/1 ARM (30-Yr)</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="interestRateInput" className="font-body-sm text-body-sm font-semibold text-on-surface block mb-1">
                        Interest Rate (APR)
                      </label>
                      <div className="relative">
                        <input
                          id="interestRateInput"
                          type="number"
                          step="0.125"
                          value={interestRate}
                          onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                          className="w-full pr-8 pl-3 py-2 rounded-xl bg-surface-container-low font-data-mono text-body-md text-on-surface outline-none border border-outline-variant/30"
                        />
                        <span className="absolute right-3 top-2 text-outline font-data-mono">%</span>
                      </div>
                    </div>
                  </div>

                  {/* Property Tax & Home Insurance */}
                  <div className="grid grid-cols-2 gap-space-sm">
                    <div>
                      <label htmlFor="propertyTaxInput" className="font-body-sm text-body-sm font-semibold text-on-surface block mb-1">
                        Property Tax (Yr)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-outline font-data-mono text-body-sm">$</span>
                        <input
                          id="propertyTaxInput"
                          type="number"
                          step="100"
                          value={propertyTax}
                          onChange={(e) => setPropertyTax(parseFloat(e.target.value) || 0)}
                          className="w-full pl-7 pr-3 py-2 rounded-xl bg-surface-container-low font-data-mono text-body-sm text-on-surface outline-none border border-outline-variant/30"
                        />
                      </div>
                      <span className="font-label-caps text-label-caps text-on-surface-variant">
                        Est. {homePrice > 0 ? ((propertyTax / homePrice) * 100).toFixed(2) : '1.00'}% of price
                      </span>
                    </div>

                    <div>
                      <label htmlFor="insuranceInput" className="font-body-sm text-body-sm font-semibold text-on-surface block mb-1">
                        Home Insurance (Yr)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-outline font-data-mono text-body-sm">$</span>
                        <input
                          id="insuranceInput"
                          type="number"
                          step="50"
                          value={hazardInsurance}
                          onChange={(e) => setHazardInsurance(parseFloat(e.target.value) || 0)}
                          className="w-full pl-7 pr-3 py-2 rounded-xl bg-surface-container-low font-data-mono text-body-sm text-on-surface outline-none border border-outline-variant/30"
                        />
                      </div>
                      <span className="font-label-caps text-label-caps text-on-surface-variant">
                        {fmtExact(hazardInsurance / 12)} / mo
                      </span>
                    </div>
                  </div>

                  {/* Extra Principal & PMI status */}
                  <div className="grid grid-cols-2 gap-space-sm items-end">
                    <div>
                      <label htmlFor="extraPrincipalInput" className="font-body-sm text-body-sm font-semibold text-on-surface block mb-1">
                        Extra Monthly Principal
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-outline font-data-mono text-body-sm">$</span>
                        <input
                          id="extraPrincipalInput"
                          type="number"
                          step="25"
                          value={extraPrincipal}
                          onChange={(e) => setExtraPrincipal(parseFloat(e.target.value) || 0)}
                          className="w-full pl-7 pr-3 py-2 rounded-xl bg-surface-container-low font-data-mono text-body-sm text-on-surface outline-none border border-outline-variant/30"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="p-2.5 rounded-xl bg-surface-container-low flex flex-col justify-center border border-outline-variant/30">
                        <span className="font-label-caps text-label-caps uppercase text-outline font-semibold">
                          PMI Insurance Status
                        </span>
                        {calcResults.isPMIActive ? (
                          <span className="font-label-caps text-label-caps font-bold text-tertiary flex items-center gap-1 mt-0.5">
                            <span className="material-symbols-outlined text-[15px]">warning</span> Active PMI (+{fmt(calcResults.monthlyPMI)}/mo)
                          </span>
                        ) : (
                          <span className="font-label-caps text-label-caps font-bold text-secondary flex items-center gap-1 mt-0.5">
                            <span className="material-symbols-outlined text-[15px]">check_circle</span> Eliminated (≥20% Equity achieved)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Output & Visual Results Panel (7 Cols) */}
                <div className="lg:col-span-7 p-space-xl bg-surface-container-low/50 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-space-md">
                      <div>
                        <span className="font-label-caps text-label-caps uppercase tracking-wider text-secondary font-bold">
                          Comprehensive Monthly Commitment
                        </span>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="font-numerical-display text-numerical-display text-primary tracking-tight font-extrabold">
                            {fmtExact(calcResults.totalMonthlyCommitment)}
                          </span>
                          <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">
                            / month (PITI)
                          </span>
                        </div>
                      </div>
                      <div className="px-3 py-1.5 rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/30 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[20px]">bolt</span>
                        <span className="font-body-sm text-body-sm font-medium text-on-surface">
                          Loan Amount: <strong className="font-data-mono text-primary">{fmt(loanPrincipal)}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Visual PITI Breakdown Bar */}
                    <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/20 mb-space-md">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-body-sm text-body-sm font-semibold text-on-surface">
                          Monthly PITI Component Allocation
                        </span>
                        <span className="font-data-mono text-label-caps text-on-surface-variant">
                          Includes Principal, Interest, Taxes &amp; Hazard
                        </span>
                      </div>

                      {/* Stacked Segment Bar */}
                      <div className="w-full h-4 rounded-full overflow-hidden flex bg-surface-container">
                        <div
                          className="h-full bg-primary transition-all duration-300"
                          style={{ width: `${calcResults.pctPrincipal}%` }}
                          title="Principal Portion"
                        />
                        <div
                          className="h-full bg-secondary-container transition-all duration-300"
                          style={{ width: `${calcResults.pctInterest}%` }}
                          title="Interest Portion"
                        />
                        <div
                          className="h-full bg-tertiary transition-all duration-300"
                          style={{ width: `${calcResults.pctTaxes}%` }}
                          title="Property Taxes"
                        />
                        <div
                          className="h-full bg-surface-dim transition-all duration-300"
                          style={{ width: `${calcResults.pctInsurance}%` }}
                          title="Hazard & PMI Insurance"
                        />
                      </div>

                      {/* PITI Values Row */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-2 border-t border-surface-container/50">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block"></span>
                            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Principal</span>
                          </div>
                          <span className="font-data-mono text-body-md font-semibold text-on-surface">
                            {fmtExact(calcResults.firstMonthPrincipal + extraPrincipal)}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-secondary-container inline-block"></span>
                            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Interest</span>
                          </div>
                          <span className="font-data-mono text-body-md font-semibold text-on-surface">
                            {fmtExact(calcResults.firstMonthInterest)}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-tertiary inline-block"></span>
                            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Property Tax</span>
                          </div>
                          <span className="font-data-mono text-body-md font-semibold text-on-surface">
                            {fmtExact(calcResults.monthlyTax)}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-surface-dim inline-block"></span>
                            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Insurance</span>
                          </div>
                          <span className="font-data-mono text-body-md font-semibold text-on-surface">
                            {fmtExact(calcResults.monthlyIns + calcResults.monthlyPMI)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Dynamic SVG Trajectory Chart */}
                    <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/20 mb-space-md">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <span className="font-body-sm text-body-sm font-semibold text-on-surface">
                            {loanTerm}-Year Amortization &amp; Equity Trajectory
                          </span>
                          <p className="font-body-sm text-body-sm text-on-surface-variant text-[11px]">
                            Dynamic balance decay vs home equity curve
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5 font-label-caps text-label-caps text-on-surface-variant">
                            <span className="w-3 h-1 bg-primary inline-block rounded"></span> Loan Balance
                          </div>
                          <div className="flex items-center gap-1.5 font-label-caps text-label-caps text-on-surface-variant">
                            <span className="w-3 h-1 bg-secondary-container inline-block rounded"></span> Equity Accumulated
                          </div>
                        </div>
                      </div>

                      {/* Responsive Trajectory SVG Graph */}
                      <div className="w-full h-36 relative mt-2">
                        <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 600 130">
                          <defs>
                            <linearGradient id={equityGradId} x1="0%" x2="0%" y1="100%" y2="0%">
                              <stop offset="0%" stopColor="#39b8fd" stopOpacity="0.05"></stop>
                              <stop offset="100%" stopColor="#39b8fd" stopOpacity="0.3"></stop>
                            </linearGradient>
                            <linearGradient id={balanceGradId} x1="0%" x2="0%" y1="0%" y2="100%">
                              <stop offset="0%" stopColor="#004ac6" stopOpacity="0.25"></stop>
                              <stop offset="100%" stopColor="#004ac6" stopOpacity="0.02"></stop>
                            </linearGradient>
                          </defs>

                          {/* Horizontal Grid Lines */}
                          <line stroke="#eaedff" strokeDasharray="3,3" strokeWidth="1" x1="0" x2="600" y1="10" y2="10"></line>
                          <line stroke="#eaedff" strokeDasharray="3,3" strokeWidth="1" x1="0" x2="600" y1="45" y2="45"></line>
                          <line stroke="#eaedff" strokeDasharray="3,3" strokeWidth="1" x1="0" x2="600" y1="80" y2="80"></line>
                          <line stroke="#eaedff" strokeWidth="1" x1="0" x2="600" y1="115" y2="115"></line>

                          {/* Equity Area & Line */}
                          <path d="M 0,105 Q 260,85 420,35 T 600,10 L 600,115 L 0,115 Z" fill={`url(#${equityGradId})`}></path>
                          <path d="M 0,105 Q 260,85 420,35 T 600,10" fill="none" stroke="#39b8fd" strokeLinecap="round" strokeWidth="3"></path>

                          {/* Balance Area & Line (Accelerated by extra payments) */}
                          <path d="M 0,25 Q 220,45 380,85 T 513,115 L 0,115 Z" fill={`url(#${balanceGradId})`}></path>
                          <path d="M 0,25 Q 220,45 380,85 T 513,115" fill="none" stroke="#004ac6" strokeLinecap="round" strokeWidth="3"></path>

                          {/* 20% PMI threshold point */}
                          <circle cx="0" cy="105" fill="#004ac6" r="4" stroke="#ffffff" strokeWidth="2"></circle>

                          {/* Payoff Marker */}
                          <circle cx="513" cy="115" fill="#004ac6" r="5" stroke="#ffffff" strokeWidth="2"></circle>
                          <text fill="#004ac6" fontFamily="JetBrains Mono" fontSize="10" fontWeight="600" x="490" y="100">
                            Debt-Free: Yr {calcResults.payYears}
                          </text>

                          {/* Full Term baseline comparison */}
                          <circle cx="600" cy="115" fill="#737686" r="3"></circle>
                          <text fill="#737686" fontFamily="JetBrains Mono" fontSize="9" x="535" y="127">
                            Orig. {loanTerm} Yrs
                          </text>
                        </svg>
                      </div>
                    </div>

                    {/* Savings Metrics Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
                      <div className="bg-surface-container-lowest p-space-sm rounded-xl shadow-sm border border-outline-variant/20">
                        <span className="font-label-caps text-label-caps text-on-surface-variant uppercase font-semibold">
                          Total Interest Cost
                        </span>
                        <div className="font-data-mono text-body-lg font-bold text-on-surface mt-1">
                          {fmt(calcResults.totalInterestPaid)}
                        </div>
                        {calcResults.interestSaved > 0 ? (
                          <div className="font-label-caps text-label-caps text-secondary font-medium mt-0.5 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px]">arrow_downward</span> Saves {fmt(calcResults.interestSaved)}
                          </div>
                        ) : (
                          <div className="font-label-caps text-label-caps text-outline font-medium mt-0.5">
                            Standard Schedule
                          </div>
                        )}
                      </div>

                      <div className="bg-surface-container-lowest p-space-sm rounded-xl shadow-sm border border-outline-variant/20">
                        <span className="font-label-caps text-label-caps text-on-surface-variant uppercase font-semibold">
                          Payoff Acceleration
                        </span>
                        <div className="font-data-mono text-body-lg font-bold text-primary mt-1">
                          {calcResults.payYears}y {calcResults.payMonths}m
                        </div>
                        {calcResults.monthsSaved > 0 ? (
                          <div className="font-label-caps text-label-caps text-primary font-medium mt-0.5">
                            Shaves {Math.floor(calcResults.monthsSaved / 12)} yrs {calcResults.monthsSaved % 12} mos
                          </div>
                        ) : (
                          <div className="font-label-caps text-label-caps text-outline font-medium mt-0.5">
                            Standard {loanTerm} years
                          </div>
                        )}
                      </div>

                      <div className="bg-surface-container-lowest p-space-sm rounded-xl shadow-sm border border-outline-variant/20">
                        <span className="font-label-caps text-label-caps text-on-surface-variant uppercase font-semibold">
                          Total Lifetime Outlay
                        </span>
                        <div className="font-data-mono text-body-lg font-bold text-on-surface mt-1">
                          {fmt(calcResults.lifetimeTotalCost)}
                        </div>
                        <div className="font-label-caps text-label-caps text-outline font-medium mt-0.5">
                          Principal + Interest + Taxes
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-space-sm pt-space-md border-t border-surface-container mt-space-md">
                    <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm">
                      <span className="material-symbols-outlined text-secondary text-[18px]">verified</span>
                      <span>Audited under CFPB &amp; Fannie Mae Standard Amortization Formulas</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAmortizationModal(true)}
                      className="px-space-md py-2 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-body-sm text-body-sm font-medium inline-flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      Open Full Amortization Table
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* AMORTIZATION MODAL / POPUP */}
          {showAmortizationModal && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-surface-container-lowest rounded-2xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-outline-variant/30 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-space-lg bg-surface-container-low flex items-center justify-between border-b border-surface-container">
                  <div>
                    <h3 className="font-headline-md font-bold text-on-surface">Annual Mortgage Amortization Ledger</h3>
                    <p className="font-body-sm text-on-surface-variant">
                      Projected loan balance, cumulative interest, and home equity growth based on current parameters.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAmortizationModal(false)}
                    className="p-2 rounded-xl hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
                <div className="p-space-md overflow-y-auto flex-1 font-body-sm">
                  <table className="w-full text-left border-collapse font-body-sm">
                    <thead>
                      <tr className="border-b border-surface-container text-on-surface-variant font-label-caps uppercase text-[11px]">
                        <th className="py-2.5 px-3">Year</th>
                        <th className="py-2.5 px-3">Starting Balance</th>
                        <th className="py-2.5 px-3">Principal Paid</th>
                        <th className="py-2.5 px-3">Interest Paid</th>
                        <th className="py-2.5 px-3">Ending Balance</th>
                        <th className="py-2.5 px-3">Equity Built</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-container font-data-mono text-[13px]">
                      {calcResults.yearlySchedule.map((row) => (
                        <tr key={row.year} className="hover:bg-surface-container-low/50 transition-colors">
                          <td className="py-2.5 px-3 font-semibold text-on-surface">Year {row.year}</td>
                          <td className="py-2.5 px-3 text-on-surface-variant">{fmt(row.startingBalance)}</td>
                          <td className="py-2.5 px-3 text-primary font-medium">{fmt(row.principalPaid)}</td>
                          <td className="py-2.5 px-3 text-tertiary">{fmt(row.interestPaid)}</td>
                          <td className="py-2.5 px-3 font-bold text-on-surface">{fmt(row.endingBalance)}</td>
                          <td className="py-2.5 px-3 text-secondary font-semibold">{fmt(row.equity)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-space-md bg-surface-container-low border-t border-surface-container flex items-center justify-between">
                  <span className="font-body-sm text-on-surface-variant text-[12px]">
                    Includes ${extraPrincipal}/month accelerated principal payment.
                  </span>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-space-md py-1.5 rounded-lg bg-primary text-on-primary font-body-sm text-[13px] font-semibold flex items-center gap-1.5 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[16px]">print</span> Print Ledger
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: SMART MORTGAGE SCENARIOS & ADVISORY */}
          <section className="w-full max-w-[1280px] mx-auto px-gutter-desktop py-space-xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-lg">
              <div>
                <div className="flex items-center gap-1.5 text-primary font-label-caps text-label-caps uppercase tracking-wider mb-1 font-bold">
                  <span className="material-symbols-outlined text-[16px]">psychology</span> Decision Analysis &amp; Financing Scenarios
                </div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                  Smart Mortgage Scenarios &amp; Advisory
                </h2>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md">
                Borrowers face critical trade-offs between cash flow preservation, interest rate volatility, and early debt freedom. Explore empirical outcomes to select the optimal financing structure.
              </p>
            </div>

            {/* 4 Advisor Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md mb-space-xl">
              {/* Dilemma 1 */}
              <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-space-sm">
                    <span className="material-symbols-outlined text-[22px]">swap_horiz</span>
                  </div>
                  <h3 className="font-headline-md text-body-lg font-bold text-on-surface mb-space-2xs">
                    15-Year vs. 30-Year Fixed
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                    Choosing a 15-year term saves an average of $218,400 in interest over the life of a $400k loan, though monthly obligations rise by roughly 35%.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleLoadScenario('15yr')}
                  className="inline-flex items-center justify-between text-primary font-body-sm text-body-sm font-semibold hover:underline text-left cursor-pointer"
                >
                  <span>Compare Terms in Simulator</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>

              {/* Dilemma 2 */}
              <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center mb-space-sm">
                    <span className="material-symbols-outlined text-[22px]">pie_chart</span>
                  </div>
                  <h3 className="font-headline-md text-body-lg font-bold text-on-surface mb-space-2xs">
                    10% Down vs. 20% Down
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                    Evaluate whether paying temporary Private Mortgage Insurance (PMI) is superior to liquidating non-housing investment reserves or emergency funds.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleLoadScenario('10down')}
                  className="inline-flex items-center justify-between text-secondary font-body-sm text-body-sm font-semibold hover:underline text-left cursor-pointer"
                >
                  <span>Analyze PMI Impact</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>

              {/* Dilemma 3 */}
              <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-tertiary/10 text-tertiary flex items-center justify-center mb-space-sm">
                    <span className="material-symbols-outlined text-[22px]">trending_up</span>
                  </div>
                  <h3 className="font-headline-md text-body-lg font-bold text-on-surface mb-space-2xs">
                    Fixed vs. 7/1 ARM in 2025
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                    Assess the 50–75 bps rate discount offered by hybrid adjustable mortgages against adjustment caps if staying in your home beyond year 7.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleLoadScenario('arm')}
                  className="inline-flex items-center justify-between text-tertiary font-body-sm text-body-sm font-semibold hover:underline text-left cursor-pointer"
                >
                  <span>Simulate ARM</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>

              {/* Dilemma 4 */}
              <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-primary-container/10 text-primary-container flex items-center justify-center mb-space-sm">
                    <span className="material-symbols-outlined text-[22px]">currency_exchange</span>
                  </div>
                  <h3 className="font-headline-md text-body-lg font-bold text-on-surface mb-space-2xs">
                    Refinancing at 0.75% Lower
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                    Measure your break-even month by weighing loan closing expenses ($3,000–$6,000) against monthly payment savings.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleLoadScenario('refi')}
                  className="inline-flex items-center justify-between text-primary font-body-sm text-body-sm font-semibold hover:underline text-left cursor-pointer"
                >
                  <span>Check Break-Even</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
            </div>

            {/* Concrete Case Study Callout Box */}
            <div className="bg-surface-container rounded-2xl p-space-xl shadow-sm border border-outline-variant/20">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-space-lg">
                <div className="max-w-2xl">
                  <span className="inline-flex items-center gap-1.5 px-space-xs py-0.5 rounded bg-primary text-on-primary font-label-caps text-label-caps uppercase font-bold">
                    Real-Life Example
                  </span>
                  <h3 className="font-headline-md text-headline-md text-on-surface font-bold mt-2">
                    The Power of Accelerated Principal: Adding $150/Month to a $360k Mortgage
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                    On a conventional 30-year loan at 6.625%, committing an extra $150 per month toward principal pays off the balance{' '}
                    <strong className="text-on-surface">4 years and 4 months early</strong>, eliminating{' '}
                    <strong className="text-primary font-semibold">$53,490 in compound interest</strong>.
                  </p>
                </div>

                <div className="flex flex-wrap sm:flex-nowrap items-center gap-space-md bg-surface-container-lowest p-space-md rounded-xl shadow-sm shrink-0 border border-outline-variant/30">
                  <div className="text-center px-space-sm">
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Time Saved</span>
                    <div className="font-data-mono text-headline-md font-bold text-primary">52 Mos</div>
                  </div>
                  <div className="w-px h-10 bg-surface-container hidden sm:block"></div>
                  <div className="text-center px-space-sm">
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Interest Eliminated</span>
                    <div className="font-data-mono text-headline-md font-bold text-secondary">$53,490</div>
                  </div>
                  <div className="w-px h-10 bg-surface-container hidden sm:block"></div>
                  <button
                    type="button"
                    onClick={() => handleLoadScenario('extra150')}
                    className="px-space-md py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-body-sm text-body-sm font-semibold transition-colors shadow-sm cursor-pointer"
                  >
                    Model Extra Payments
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3: FEATURED POPULAR MORTGAGE TOOLS (12 Flagship Cards) */}
          <section className="w-full max-w-[1280px] mx-auto px-gutter-desktop py-space-2xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-sm mb-space-xl">
              <div>
                <div className="text-primary font-label-caps text-label-caps uppercase tracking-wider mb-1 font-semibold">
                  Flagship Real Estate Solutions
                </div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                  Featured Popular Mortgage Calculators
                </h2>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                The 12 most-used workbenches by prospective homebuyers, investors, and homeowners.
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
              {/* Card 1 */}
              <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm hover:shadow-md border border-outline-variant/20 transition-all flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between mb-space-sm">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-[24px]">account_balance</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-surface-container font-label-caps text-label-caps text-on-surface-variant">
                      Payment Basics
                    </span>
                  </div>
                  <h3 className="font-headline-md text-body-lg font-bold text-on-surface mb-1">Mortgage Calculator</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                    Compute full monthly payments, interest, and payoff schedule.
                  </p>
                </div>
                <Link
                  href="/finance/mortgage-calculator"
                  className="w-full py-2.5 px-space-md rounded-xl bg-surface-container group-hover:bg-primary group-hover:text-on-primary text-on-surface font-body-sm text-body-sm font-semibold flex items-center justify-between transition-colors"
                >
                  <span>Calculate Payment</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
              </div>

              {/* Card 2 */}
              <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm hover:shadow-md border border-outline-variant/20 transition-all flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between mb-space-sm">
                    <div className="w-11 h-11 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-[24px]">receipt_long</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-surface-container font-label-caps text-label-caps text-on-surface-variant">
                      Housing Costs
                    </span>
                  </div>
                  <h3 className="font-headline-md text-body-lg font-bold text-on-surface mb-1">PITI Calculator</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                    Complete breakdown of Principal, Interest, Taxes, and Insurance.
                  </p>
                </div>
                <Link
                  href="/finance/mortgage-calculator"
                  className="w-full py-2.5 px-space-md rounded-xl bg-surface-container group-hover:bg-primary group-hover:text-on-primary text-on-surface font-body-sm text-body-sm font-semibold flex items-center justify-between transition-colors"
                >
                  <span>Calculate PITI</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
              </div>

              {/* Card 3 */}
              <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm hover:shadow-md border border-outline-variant/20 transition-all flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between mb-space-sm">
                    <div className="w-11 h-11 rounded-xl bg-tertiary/10 text-tertiary flex items-center justify-center group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-[24px]">savings</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-surface-container font-label-caps text-label-caps text-on-surface-variant">
                      Underwriting
                    </span>
                  </div>
                  <h3 className="font-headline-md text-body-lg font-bold text-on-surface mb-1">Home Affordability Calculator</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                    Determine how much house you can safely buy based on income and DTI.
                  </p>
                </div>
                <Link
                  href="/finance/mortgage-calculator"
                  className="w-full py-2.5 px-space-md rounded-xl bg-surface-container group-hover:bg-primary group-hover:text-on-primary text-on-surface font-body-sm text-body-sm font-semibold flex items-center justify-between transition-colors"
                >
                  <span>Check Affordability</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
              </div>

              {/* Card 4 */}
              <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm hover:shadow-md border border-outline-variant/20 transition-all flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between mb-space-sm">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-[24px]">published_with_changes</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-surface-container font-label-caps text-label-caps text-on-surface-variant">
                      Restructuring
                    </span>
                  </div>
                  <h3 className="font-headline-md text-body-lg font-bold text-on-surface mb-1">Mortgage Refinance Calculator</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                    Find your break-even date and lifetime interest savings.
                  </p>
                </div>
                <Link
                  href="/finance/mortgage-calculator"
                  className="w-full py-2.5 px-space-md rounded-xl bg-surface-container group-hover:bg-primary group-hover:text-on-primary text-on-surface font-body-sm text-body-sm font-semibold flex items-center justify-between transition-colors"
                >
                  <span>Calculate Savings</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
              </div>

              {/* Card 5 */}
              <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm hover:shadow-md border border-outline-variant/20 transition-all flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between mb-space-sm">
                    <div className="w-11 h-11 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-[24px]">shield</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-surface-container font-label-caps text-label-caps text-on-surface-variant">
                      Insurance
                    </span>
                  </div>
                  <h3 className="font-headline-md text-body-lg font-bold text-on-surface mb-1">PMI Calculator &amp; Removal Tool</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                    Estimate monthly PMI and see the exact month you reach 20% equity.
                  </p>
                </div>
                <Link
                  href="/finance/mortgage-calculator"
                  className="w-full py-2.5 px-space-md rounded-xl bg-surface-container group-hover:bg-primary group-hover:text-on-primary text-on-surface font-body-sm text-body-sm font-semibold flex items-center justify-between transition-colors"
                >
                  <span>Calculate PMI</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
              </div>

              {/* Card 6 */}
              <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm hover:shadow-md border border-outline-variant/20 transition-all flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between mb-space-sm">
                    <div className="w-11 h-11 rounded-xl bg-tertiary/10 text-tertiary flex items-center justify-center group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-[24px]">compare_arrows</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-surface-container font-label-caps text-label-caps text-on-surface-variant">
                      Term Comparison
                    </span>
                  </div>
                  <h3 className="font-headline-md text-body-lg font-bold text-on-surface mb-1">15-Year vs. 30-Year Calculator</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                    Compare monthly budgets against total lifetime interest costs.
                  </p>
                </div>
                <Link
                  href="/finance/mortgage-calculator"
                  className="w-full py-2.5 px-space-md rounded-xl bg-surface-container group-hover:bg-primary group-hover:text-on-primary text-on-surface font-body-sm text-body-sm font-semibold flex items-center justify-between transition-colors"
                >
                  <span>Compare Terms</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
              </div>

              {/* Card 7 */}
              <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm hover:shadow-md border border-outline-variant/20 transition-all flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between mb-space-sm">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-[24px]">tune</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-surface-container font-label-caps text-label-caps text-on-surface-variant">
                      Adjustable Rates
                    </span>
                  </div>
                  <h3 className="font-headline-md text-body-lg font-bold text-on-surface mb-1">5/1 &amp; 7/1 ARM Calculator</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                    Project payment adjustments and worst-case interest rate caps.
                  </p>
                </div>
                <Link
                  href="/finance/mortgage-calculator"
                  className="w-full py-2.5 px-space-md rounded-xl bg-surface-container group-hover:bg-primary group-hover:text-on-primary text-on-surface font-body-sm text-body-sm font-semibold flex items-center justify-between transition-colors"
                >
                  <span>Simulate ARM</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
              </div>

              {/* Card 8 */}
              <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm hover:shadow-md border border-outline-variant/20 transition-all flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between mb-space-sm">
                    <div className="w-11 h-11 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-[24px]">apartment</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-surface-container font-label-caps text-label-caps text-on-surface-variant">
                      Strategy
                    </span>
                  </div>
                  <h3 className="font-headline-md text-body-lg font-bold text-on-surface mb-1">Rent vs. Buy Calculator</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                    Long-term net wealth comparison between renting and homeownership.
                  </p>
                </div>
                <Link
                  href="/finance/mortgage-calculator"
                  className="w-full py-2.5 px-space-md rounded-xl bg-surface-container group-hover:bg-primary group-hover:text-on-primary text-on-surface font-body-sm text-body-sm font-semibold flex items-center justify-between transition-colors"
                >
                  <span>Compare Rent vs Buy</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
              </div>

              {/* Card 9 */}
              <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm hover:shadow-md border border-outline-variant/20 transition-all flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between mb-space-sm">
                    <div className="w-11 h-11 rounded-xl bg-tertiary/10 text-tertiary flex items-center justify-center group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-[24px]">speed</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-surface-container font-label-caps text-label-caps text-on-surface-variant">
                      Early Freedom
                    </span>
                  </div>
                  <h3 className="font-headline-md text-body-lg font-bold text-on-surface mb-1">Extra Payment &amp; Payoff Calculator</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                    Discover how small principal additions eliminate years of debt.
                  </p>
                </div>
                <Link
                  href="/finance/mortgage-calculator"
                  className="w-full py-2.5 px-space-md rounded-xl bg-surface-container group-hover:bg-primary group-hover:text-on-primary text-on-surface font-body-sm text-body-sm font-semibold flex items-center justify-between transition-colors"
                >
                  <span>View Payoff Schedule</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
              </div>

              {/* Card 10 */}
              <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm hover:shadow-md border border-outline-variant/20 transition-all flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between mb-space-sm">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-[24px]">query_stats</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-surface-container font-label-caps text-label-caps text-on-surface-variant">
                      Equity Growth
                    </span>
                  </div>
                  <h3 className="font-headline-md text-body-lg font-bold text-on-surface mb-1">Home Equity &amp; HELOC Calculator</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                    Track your accessible borrowing capacity and home appreciation.
                  </p>
                </div>
                <Link
                  href="/finance/mortgage-calculator"
                  className="w-full py-2.5 px-space-md rounded-xl bg-surface-container group-hover:bg-primary group-hover:text-on-primary text-on-surface font-body-sm text-body-sm font-semibold flex items-center justify-between transition-colors"
                >
                  <span>Calculate Equity</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
              </div>

              {/* Card 11 */}
              <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm hover:shadow-md border border-outline-variant/20 transition-all flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between mb-space-sm">
                    <div className="w-11 h-11 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-[24px]">domain</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-surface-container font-label-caps text-label-caps text-on-surface-variant">
                      Real Estate Investor
                    </span>
                  </div>
                  <h3 className="font-headline-md text-body-lg font-bold text-on-surface mb-1">Investment Property &amp; DSCR</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                    Evaluate rental cash flow, cap rate, and debt-service coverage.
                  </p>
                </div>
                <Link
                  href="/finance/mortgage-calculator"
                  className="w-full py-2.5 px-space-md rounded-xl bg-surface-container group-hover:bg-primary group-hover:text-on-primary text-on-surface font-body-sm text-body-sm font-semibold flex items-center justify-between transition-colors"
                >
                  <span>Analyze Investment</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
              </div>

              {/* Card 12 */}
              <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm hover:shadow-md border border-outline-variant/20 transition-all flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between mb-space-sm">
                    <div className="w-11 h-11 rounded-xl bg-tertiary/10 text-tertiary flex items-center justify-center group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-[24px]">request_quote</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-surface-container font-label-caps text-label-caps text-on-surface-variant">
                      Closing Costs
                    </span>
                  </div>
                  <h3 className="font-headline-md text-body-lg font-bold text-on-surface mb-1">Closing Costs &amp; Purchase Fees</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                    Estimate lender fees, title costs, transfer taxes, and escrow setup.
                  </p>
                </div>
                <Link
                  href="/finance/mortgage-calculator"
                  className="w-full py-2.5 px-space-md rounded-xl bg-surface-container group-hover:bg-primary group-hover:text-on-primary text-on-surface font-body-sm text-body-sm font-semibold flex items-center justify-between transition-colors"
                >
                  <span>Estimate Closing Costs</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
              </div>
            </div>
          </section>

          {/* SECTION 4: COMPLETE DIRECTORY: ALL 12 CLUSTERS (106 Tools Total) */}
          <section id="allClusters" className="w-full bg-surface-container-low/40 py-space-3xl border-y border-surface-container/60">
            <div className="max-w-[1280px] mx-auto px-gutter-desktop">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-2xl">
                <div>
                  <div className="flex items-center gap-1.5 text-secondary font-label-caps text-label-caps uppercase font-bold tracking-wider mb-1">
                    <span className="material-symbols-outlined text-[18px]">folder_copy</span> Master Systematic Directory
                  </div>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                    All 12 Mortgage &amp; Real Estate Debt Clusters
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-data-mono text-body-sm text-on-surface-variant">
                    {totalFilteredTools} Specialized Real Estate Calculators
                  </span>
                </div>
              </div>

              {filteredClusters.length === 0 ? (
                <div className="bg-surface-container-lowest p-8 rounded-2xl text-center shadow-sm">
                  <p className="text-on-surface-variant text-body-md">
                    No mortgage calculators matched your search query &quot;{searchQuery}&quot;.
                  </p>
                  <button
                    type="button"
                    onClick={() => { setSearchQuery(''); setSelectedFilter('All'); }}
                    className="mt-3 px-4 py-2 bg-primary text-on-primary rounded-xl text-body-sm font-semibold"
                  >
                    Reset Search &amp; Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-space-lg">
                  {filteredClusters.map((cluster) => (
                    <div
                      key={cluster.id}
                      className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-space-sm pb-space-xs border-b border-surface-container">
                          <span className={`material-symbols-outlined ${cluster.colorClass} text-[20px]`}>
                            {cluster.icon}
                          </span>
                          <h3 className="font-body-md font-bold text-on-surface">{cluster.name}</h3>
                          <span className="ml-auto font-data-mono text-label-caps text-outline">
                            {cluster.tools.length} Tools
                          </span>
                        </div>
                        <ul className="space-y-2 font-body-sm text-body-sm">
                          {cluster.tools.map((tool) => (
                            <li key={tool.name}>
                              <Link
                                href={tool.href}
                                className="flex items-center justify-between text-on-surface hover:text-primary transition-colors py-0.5"
                              >
                                <span>{tool.name}</span>
                                <span className="material-symbols-outlined text-[14px] text-outline">arrow_forward</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* SECTION 5: HEAD-TO-HEAD MORTGAGE COMPARISON BENCHMARKS (8 Comparison Cards) */}
          <section className="w-full max-w-[1280px] mx-auto px-gutter-desktop py-space-2xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-sm mb-space-xl">
              <div>
                <div className="text-primary font-label-caps text-label-caps uppercase font-bold tracking-wider mb-1">
                  Empirical Decision Frameworks
                </div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                  Head-to-Head Mortgage Comparison Benchmarks
                </h2>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant max-w-sm">
                Direct analytical trade-offs for high-intent property and financing dilemmas.
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
              {/* Benchmark 1 */}
              <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col justify-between">
                <div>
                  <span className="font-label-caps text-label-caps text-primary uppercase font-bold">Term Duration</span>
                  <h3 className="font-body-lg font-bold text-on-surface mt-1 mb-2">30-Year vs 15-Year Fixed</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm">
                    Cash flow flexibility with lower required monthly dues versus saving $150k+ in interest and clearing debt in half the duration.
                  </p>
                </div>
                <div className="pt-space-xs flex items-center justify-between font-label-caps text-label-caps text-secondary font-semibold">
                  <span>Advantage: Term Choice</span>
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </div>
              </div>

              {/* Benchmark 2 */}
              <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col justify-between">
                <div>
                  <span className="font-label-caps text-label-caps text-secondary uppercase font-bold">Rate Volatility</span>
                  <h3 className="font-body-lg font-bold text-on-surface mt-1 mb-2">Fixed vs ARM Loan</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm">
                    Permanent rate certainty against 0.5%–0.75% introductory rate discounts if moving or refinancing within 5 to 7 years.
                  </p>
                </div>
                <div className="pt-space-xs flex items-center justify-between font-label-caps text-label-caps text-secondary font-semibold">
                  <span>Advantage: Rate Flexibility</span>
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </div>
              </div>

              {/* Benchmark 3 */}
              <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col justify-between">
                <div>
                  <span className="font-label-caps text-label-caps text-tertiary uppercase font-bold">Wealth Generation</span>
                  <h3 className="font-body-lg font-bold text-on-surface mt-1 mb-2">Renting vs Buying</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm">
                    Preserving liquidity for equity portfolios versus leveraged appreciation, locked housing costs, and forced principal buildup.
                  </p>
                </div>
                <div className="pt-space-xs flex items-center justify-between font-label-caps text-label-caps text-secondary font-semibold">
                  <span>Advantage: Wealth Profile</span>
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </div>
              </div>

              {/* Benchmark 4 */}
              <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col justify-between">
                <div>
                  <span className="font-label-caps text-label-caps text-primary uppercase font-bold">Equity Threshold</span>
                  <h3 className="font-body-lg font-bold text-on-surface mt-1 mb-2">5% Down vs 20% Down</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm">
                    Entering the property ladder years earlier while paying temporary PMI versus waiting to save 20% to avoid insurance premiums.
                  </p>
                </div>
                <div className="pt-space-xs flex items-center justify-between font-label-caps text-label-caps text-secondary font-semibold">
                  <span>Advantage: Capital Timing</span>
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </div>
              </div>

              {/* Benchmark 5 */}
              <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col justify-between">
                <div>
                  <span className="font-label-caps text-label-caps text-secondary uppercase font-bold">Liquidity Access</span>
                  <h3 className="font-body-lg font-bold text-on-surface mt-1 mb-2">Cash-Out Refi vs HELOC</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm">
                    Locking in a single fixed first-lien rate versus retaining a sub-4% low primary mortgage while drawing on a variable credit line.
                  </p>
                </div>
                <div className="pt-space-xs flex items-center justify-between font-label-caps text-label-caps text-secondary font-semibold">
                  <span>Advantage: Borrowing Cost</span>
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </div>
              </div>

              {/* Benchmark 6 */}
              <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col justify-between">
                <div>
                  <span className="font-label-caps text-label-caps text-tertiary uppercase font-bold">Upfront Cost</span>
                  <h3 className="font-body-lg font-bold text-on-surface mt-1 mb-2">2-1 Buydown vs Points</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm">
                    Temporary 2% discount buffer for the first two years versus permanent lifetime yield reduction via upfront discount points.
                  </p>
                </div>
                <div className="pt-space-xs flex items-center justify-between font-label-caps text-label-caps text-secondary font-semibold">
                  <span>Advantage: Rate Concession</span>
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </div>
              </div>

              {/* Benchmark 7 */}
              <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col justify-between">
                <div>
                  <span className="font-label-caps text-label-caps text-primary uppercase font-bold">Opportunity Cost</span>
                  <h3 className="font-body-lg font-bold text-on-surface mt-1 mb-2">Pay Down Debt vs Indexing</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm">
                    Securing a guaranteed 6.6% risk-free return by paying off principal early versus historical 8–10% broad equity market returns.
                  </p>
                </div>
                <div className="pt-space-xs flex items-center justify-between font-label-caps text-label-caps text-secondary font-semibold">
                  <span>Advantage: Risk Allocation</span>
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </div>
              </div>

              {/* Benchmark 8 */}
              <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col justify-between">
                <div>
                  <span className="font-label-caps text-label-caps text-secondary uppercase font-bold">Underwriting Rules</span>
                  <h3 className="font-body-lg font-bold text-on-surface mt-1 mb-2">Primary vs Investment Loan</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm">
                    Lower interest rates and minimum 3–5% down rules on primary residences versus 20–25% down and DSCR checks for rentals.
                  </p>
                </div>
                <div className="pt-space-xs flex items-center justify-between font-label-caps text-label-caps text-secondary font-semibold">
                  <span>Advantage: Asset Classification</span>
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 6: HOW MORTGAGE PAYMENTS & PITI ARE CALCULATED (Formulas & Explanations) */}
          <section className="w-full bg-surface-container-low/50 py-space-2xl border-y border-surface-container/60">
            <div className="max-w-[1280px] mx-auto px-gutter-desktop">
              <div className="max-w-2xl mb-space-xl">
                <span className="text-primary font-label-caps text-label-caps uppercase font-bold tracking-wider">
                  Exact Mathematical Standards
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold mt-1">
                  How Mortgage Payments Work
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-2xs">
                  SolveIt Calculator implements standard actuarial and Fannie Mae financial formulas. Here is the exact mathematics behind every amortization output.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
                {/* Formula 1 */}
                <div className="bg-surface-container-lowest p-space-xl rounded-2xl shadow-sm border border-outline-variant/20">
                  <div className="flex items-center justify-between mb-space-sm">
                    <span className="font-label-caps text-label-caps uppercase text-primary font-bold">
                      Standard Amortization Formula
                    </span>
                    <span className="font-data-mono text-label-caps text-outline">ISO 80000-2</span>
                  </div>
                  <h3 className="font-headline-md text-body-lg font-bold text-on-surface mb-space-xs">
                    Monthly Principal &amp; Interest (P&amp;I)
                  </h3>
                  <div className="bg-surface-container p-space-md rounded-xl font-data-mono text-body-md text-on-surface overflow-x-auto mb-space-sm text-center font-bold">
                    M = P × [ r(1 + r)<sup>n</sup> ] ÷ [ (1 + r)<sup>n</sup> - 1 ]
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Where <strong className="text-on-surface">M</strong> is the monthly principal &amp; interest payment, <strong className="text-on-surface">P</strong> is loan principal balance, <strong className="text-on-surface">r</strong> is the monthly interest rate (annual APR ÷ 12), and <strong className="text-on-surface">n</strong> is total payment periods (e.g. 360 months for 30 years).
                  </p>
                </div>

                {/* Formula 2 */}
                <div className="bg-surface-container-lowest p-space-xl rounded-2xl shadow-sm border border-outline-variant/20">
                  <div className="flex items-center justify-between mb-space-sm">
                    <span className="font-label-caps text-label-caps uppercase text-secondary font-bold">
                      Escrow &amp; Total Outlay
                    </span>
                    <span className="font-data-mono text-label-caps text-outline">CFPB RESPA Standard</span>
                  </div>
                  <h3 className="font-headline-md text-body-lg font-bold text-on-surface mb-space-xs">
                    Total Monthly PITI Calculation
                  </h3>
                  <div className="bg-surface-container p-space-md rounded-xl font-data-mono text-body-md text-on-surface overflow-x-auto mb-space-sm text-center font-bold">
                    PITI = M + (Annual Tax ÷ 12) + (Hazard Ins. ÷ 12) + PMI + HOA
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Lenders evaluate qualification using your gross PITI. Tax and homeowners insurance are placed into an escrow reserve account managed by your servicer to pay county and insurance bills annually.
                  </p>
                </div>

                {/* Formula 3 */}
                <div className="bg-surface-container-lowest p-space-xl rounded-2xl shadow-sm border border-outline-variant/20">
                  <div className="flex items-center justify-between mb-space-sm">
                    <span className="font-label-caps text-label-caps uppercase text-tertiary font-bold">
                      Equity Threshold
                    </span>
                    <span className="font-data-mono text-label-caps text-outline">Homeowners Protection Act</span>
                  </div>
                  <h3 className="font-headline-md text-body-lg font-bold text-on-surface mb-space-xs">
                    Loan-to-Value (LTV) &amp; PMI Removal
                  </h3>
                  <div className="bg-surface-container p-space-md rounded-xl font-data-mono text-body-md text-on-surface overflow-x-auto mb-space-sm text-center font-bold">
                    LTV = (Current Unpaid Balance ÷ Appraised Value) × 100
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Under the Homeowners Protection Act of 1998, borrowers may request PMI cancellation once the loan balance reaches 80% LTV based on the original value, and servicers must automatically terminate it at 78% LTV.
                  </p>
                </div>

                {/* Formula 4 */}
                <div className="bg-surface-container-lowest p-space-xl rounded-2xl shadow-sm border border-outline-variant/20">
                  <div className="flex items-center justify-between mb-space-sm">
                    <span className="font-label-caps text-label-caps uppercase text-primary font-bold">
                      Refinance Viability
                    </span>
                    <span className="font-data-mono text-label-caps text-outline">Net Present Value</span>
                  </div>
                  <h3 className="font-headline-md text-body-lg font-bold text-on-surface mb-space-xs">
                    Refinance Break-Even Period
                  </h3>
                  <div className="bg-surface-container p-space-md rounded-xl font-data-mono text-body-md text-on-surface overflow-x-auto mb-space-sm text-center font-bold">
                    Break-Even Months = Total Closing Costs ÷ Monthly Payment Reduction
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    If closing expenses amount to $4,500 and the new loan rate cuts payments by $180 per month, the break-even is 25 months. Borrowers staying in the residence longer than 25 months generate net profit.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 7: PROGRAMMATIC DIRECTORIES & HIGH-INTENT LOAN HUBS */}
          <section className="w-full max-w-[1280px] mx-auto px-gutter-desktop py-space-2xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
              {/* Hub 1: Common Terms */}
              <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm border border-outline-variant/20">
                <div className="flex items-center gap-2 mb-space-sm">
                  <span className="material-symbols-outlined text-primary text-[22px]">calendar_month</span>
                  <h3 className="font-body-lg font-bold text-on-surface">Loan Term Hubs</h3>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                  Pre-calibrated amortizations by repayment term.
                </p>
                <div className="flex flex-col gap-2 font-body-sm text-body-sm">
                  <button
                    type="button"
                    onClick={() => { setLoanTerm(30); }}
                    className="p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex items-center justify-between text-on-surface font-medium text-left"
                  >
                    <span>30-Year Fixed Mortgage</span>
                    <span className="font-data-mono text-label-caps text-outline">360 Mos</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setLoanTerm(15); }}
                    className="p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex items-center justify-between text-on-surface font-medium text-left"
                  >
                    <span>15-Year Fixed Mortgage</span>
                    <span className="font-data-mono text-label-caps text-outline">180 Mos</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setLoanTerm(20); }}
                    className="p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex items-center justify-between text-on-surface font-medium text-left"
                  >
                    <span>20-Year Fixed Mortgage</span>
                    <span className="font-data-mono text-label-caps text-outline">240 Mos</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setLoanTerm(10); }}
                    className="p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex items-center justify-between text-on-surface font-medium text-left"
                  >
                    <span>10-Year Accelerated</span>
                    <span className="font-data-mono text-label-caps text-outline">120 Mos</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setLoanTerm(5); }}
                    className="p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex items-center justify-between text-on-surface font-medium text-left"
                  >
                    <span>5/1 Hybrid ARM</span>
                    <span className="font-data-mono text-label-caps text-outline">60 Mos Fixed</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setLoanTerm(7); }}
                    className="p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex items-center justify-between text-on-surface font-medium text-left"
                  >
                    <span>7/1 Hybrid ARM</span>
                    <span className="font-data-mono text-label-caps text-outline">84 Mos Fixed</span>
                  </button>
                </div>
              </div>

              {/* Hub 2: Loan Amount Benchmarks */}
              <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm border border-outline-variant/20">
                <div className="flex items-center gap-2 mb-space-sm">
                  <span className="material-symbols-outlined text-secondary text-[22px]">attach_money</span>
                  <h3 className="font-body-lg font-bold text-on-surface">Loan Amount Benchmarks</h3>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                  Instant payment matrices for standard purchase amounts.
                </p>
                <div className="flex flex-col gap-2 font-body-sm text-body-sm">
                  {[
                    { amount: 200000, est: '~$1,280/mo' },
                    { amount: 350000, est: '~$2,240/mo' },
                    { amount: 500000, est: '~$3,200/mo' },
                    { amount: 750000, est: '~$4,800/mo' },
                    { amount: 1000000, est: '~$6,400/mo', isJumbo: true },
                  ].map((item) => (
                    <button
                      key={item.amount}
                      type="button"
                      onClick={() => handleSelectPricePreset(item.amount)}
                      className="p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex items-center justify-between text-on-surface font-medium text-left"
                    >
                      <span>
                        ${item.amount.toLocaleString()} {item.isJumbo ? 'Jumbo Mortgage' : 'Mortgage'}
                      </span>
                      <span className="font-data-mono text-label-caps text-primary font-bold">
                        {item.est}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Hub 3: Down Payment Tiers */}
              <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm border border-outline-variant/20">
                <div className="flex items-center gap-2 mb-space-sm">
                  <span className="material-symbols-outlined text-tertiary text-[22px]">pie_chart</span>
                  <h3 className="font-body-lg font-bold text-on-surface">Down Payment Tiers</h3>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                  Impact of capital reserves on rates and PMI requirements.
                </p>
                <div className="flex flex-col gap-2 font-body-sm text-body-sm">
                  <button
                    type="button"
                    onClick={() => { setDownPayment(Math.round(homePrice * 0.035)); }}
                    className="p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex items-center justify-between text-on-surface font-medium text-left"
                  >
                    <span>3.5% Down (FHA Loan MIP)</span>
                    <span className="font-data-mono text-label-caps text-outline">High Leverage</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setDownPayment(Math.round(homePrice * 0.05)); }}
                    className="p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex items-center justify-between text-on-surface font-medium text-left"
                  >
                    <span>5% Down (Conventional + PMI)</span>
                    <span className="font-data-mono text-label-caps text-outline">First-Time</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setDownPayment(Math.round(homePrice * 0.10)); }}
                    className="p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex items-center justify-between text-on-surface font-medium text-left"
                  >
                    <span>10% Down (Reduced PMI)</span>
                    <span className="font-data-mono text-label-caps text-outline">Mid Equity</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setDownPayment(Math.round(homePrice * 0.20)); }}
                    className="p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex items-center justify-between text-on-surface font-medium text-left"
                  >
                    <span>20% Down (Zero PMI Threshold)</span>
                    <span className="font-data-mono text-label-caps text-secondary font-bold">Standard</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setDownPayment(Math.round(homePrice * 0.25)); }}
                    className="p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors flex items-center justify-between text-on-surface font-medium text-left"
                  >
                    <span>25%+ Down (Best Investor Rates)</span>
                    <span className="font-data-mono text-label-caps text-outline">Lowest Risk</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 8: COMPREHENSIVE MORTGAGE FAQS */}
          <section className="w-full bg-surface-container-low/30 py-space-3xl border-t border-surface-container/60">
            <div className="max-w-[840px] mx-auto px-gutter-desktop">
              <div className="text-center mb-space-2xl">
                <span className="text-primary font-label-caps text-label-caps uppercase font-bold tracking-wider">
                  Expert Insights &amp; Guidance
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold mt-1">
                  Frequently Asked Mortgage Questions
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                  Clear answers to common questions asked by prospective buyers, homeowners, and real estate borrowers.
                </p>
              </div>

              <div className="flex flex-col gap-space-sm" id="faqAccordion">
                {/* Q1 */}
                <details className="group bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-outline-variant/20 cursor-pointer [&_summary::-webkit-details-marker]:hidden" open>
                  <summary className="flex items-center justify-between font-headline-md text-body-lg font-bold text-on-surface select-none">
                    <span>What exactly is PITI and why is it higher than my base loan payment?</span>
                    <span className="material-symbols-outlined text-outline group-open:rotate-180 transition-transform">
                      expand_more
                    </span>
                  </summary>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-sm leading-relaxed">
                    PITI stands for Principal, Interest, Taxes, and Insurance. While your base mortgage note covers only principal and interest (repaying borrowed funds plus lender interest), mortgage servicers collect property taxes and homeowners hazard insurance into an escrow reserve account each month. Including these prevents tax liens and protects property collateral. For an average $450k home, taxes and insurance frequently add $450 to $700 per month above the base note.
                  </p>
                </details>

                {/* Q2 */}
                <details className="group bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-outline-variant/20 cursor-pointer [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex items-center justify-between font-headline-md text-body-lg font-bold text-on-surface select-none">
                    <span>How does PMI work, and when can I request my lender remove it?</span>
                    <span className="material-symbols-outlined text-outline group-open:rotate-180 transition-transform">
                      expand_more
                    </span>
                  </summary>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-sm leading-relaxed">
                    Private Mortgage Insurance (PMI) is required on conventional loans when putting down less than 20% (an LTV higher than 80%). Under the Homeowners Protection Act, you have the statutory right to request PMI cancellation once your loan principal balance reaches 80% of the original purchase value. Furthermore, servicers are required by federal law to automatically drop PMI once your balance amortizes to 78% LTV. If your home has significantly appreciated in value, you can also order a new appraisal to eliminate PMI earlier.
                  </p>
                </details>

                {/* Q3 */}
                <details className="group bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-outline-variant/20 cursor-pointer [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex items-center justify-between font-headline-md text-body-lg font-bold text-on-surface select-none">
                    <span>Is it better to choose a 15-year or a 30-year fixed mortgage?</span>
                    <span className="material-symbols-outlined text-outline group-open:rotate-180 transition-transform">
                      expand_more
                    </span>
                  </summary>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-sm leading-relaxed">
                    A 15-year fixed loan typically carries a 0.5% to 0.75% lower interest rate and builds equity twice as fast, saving over $150,000 to $250,000 in lifetime interest. However, monthly payments are 30% to 40% higher. A popular alternative strategy is securing a 30-year fixed mortgage for cash-flow safety, while voluntarily making extra principal payments matching the 15-year amortization schedule. This yields identical interest savings while protecting you if personal income fluctuates.
                  </p>
                </details>

                {/* Q4 */}
                <details className="group bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-outline-variant/20 cursor-pointer [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex items-center justify-between font-headline-md text-body-lg font-bold text-on-surface select-none">
                    <span>When does refinancing make financial sense?</span>
                    <span className="material-symbols-outlined text-outline group-open:rotate-180 transition-transform">
                      expand_more
                    </span>
                  </summary>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-sm leading-relaxed">
                    Refinancing makes financial sense when the monthly interest savings recover all transaction closing costs within the period you plan to own the residence. A standard rule of thumb is an interest rate reduction of at least 0.75% to 1.00%, although high-balance loans can break even with a 0.50% reduction in under 24 months. Other beneficial reasons include converting from an adjustable-rate mortgage (ARM) to a fixed rate, removing FHA MIP premiums, or shortening loan terms.
                  </p>
                </details>

                {/* Q5 */}
                <details className="group bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-outline-variant/20 cursor-pointer [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex items-center justify-between font-headline-md text-body-lg font-bold text-on-surface select-none">
                    <span>How does an extra $100 or $200 a month affect my mortgage payoff?</span>
                    <span className="material-symbols-outlined text-outline group-open:rotate-180 transition-transform">
                      expand_more
                    </span>
                  </summary>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-sm leading-relaxed">
                    Because mortgage payments are front-loaded with interest during the initial 10 to 15 years, every dollar of extra payment goes 100% directly toward reducing principal debt. On a $350,000 mortgage at 6.5%, an extra $150 per month trims more than 4 years off the loan term and saves upwards of $48,000 in compound interest over the repayment timeline.
                  </p>
                </details>

                {/* Q6 */}
                <details className="group bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-outline-variant/20 cursor-pointer [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex items-center justify-between font-headline-md text-body-lg font-bold text-on-surface select-none">
                    <span>What Debt-to-Income (DTI) ratio do lenders require for approval?</span>
                    <span className="material-symbols-outlined text-outline group-open:rotate-180 transition-transform">
                      expand_more
                    </span>
                  </summary>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-sm leading-relaxed">
                    Lenders calculate two DTI metrics: Front-End DTI (your total PITI payment divided by gross monthly income) and Back-End DTI (all monthly obligations including car loans, student debt, and credit cards plus PITI divided by gross income). Conventional conforming guidelines typically prefer a maximum 28% front-end and 36% back-end ratio, though automated underwriting systems (Fannie Mae Desktop Underwriter) frequently approve borrowers up to 43% to 45% with strong credit scores and cash reserves.
                  </p>
                </details>
              </div>
            </div>
          </section>

          {/* SECTION 9: AUTHORITATIVE EEAT COMPLIANCE & LEGAL ACCREDITATION */}
          <section className="w-full max-w-[1280px] mx-auto px-gutter-desktop py-space-2xl">
            <div className="bg-surface-container-lowest rounded-2xl p-space-xl shadow-sm border border-outline-variant/20">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-space-lg pb-space-lg border-b border-surface-container">
                <div className="flex items-center gap-space-md">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[28px]">verified</span>
                  </div>
                  <div>
                    <div className="font-label-caps text-label-caps uppercase text-secondary font-bold tracking-wider">
                      Expert Reviewed Content
                    </div>
                    <h3 className="font-headline-md text-body-lg font-bold text-on-surface">
                      Verified Mortgage &amp; Real Estate Advisory Board
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Audited by <strong className="text-on-surface">Robert Sterling, CMB</strong> (Certified Mortgage Banker) and <strong className="text-on-surface">Sarah Jenkins, CPA</strong> (Real Estate Taxation Specialist).
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-space-xs">
                  <span className="px-space-sm py-1 rounded bg-surface-container-low font-data-mono text-label-caps text-on-surface">
                    CFPB Regulation Z
                  </span>
                  <span className="px-space-sm py-1 rounded bg-surface-container-low font-data-mono text-label-caps text-on-surface">
                    RESPA Escrow Rule
                  </span>
                  <span className="px-space-sm py-1 rounded bg-surface-container-low font-data-mono text-label-caps text-on-surface">
                    Fannie Mae Guidelines
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md pt-space-lg">
                <div className="flex items-start gap-space-sm">
                  <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">lock</span>
                  <div>
                    <h4 className="font-body-sm font-semibold text-on-surface">Zero-Tracking Client-Side Calculation Guarantee</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Every financial calculation executes strictly inside your browser environment. SolveIt Calculator does not store, transmit, or monetize your personal income, property value, or debt figures.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-space-sm">
                  <span className="material-symbols-outlined text-outline text-[20px] shrink-0 mt-0.5">info</span>
                  <div>
                    <h4 className="font-body-sm font-semibold text-on-surface">Legal &amp; Lending Disclosure</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Calculations are provided for budgeting and simulation purposes. Actual loan terms, APRs, and qualifying guidelines are determined solely by licensed lenders subject to full underwriting and credit check.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
