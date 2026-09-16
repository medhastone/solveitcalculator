'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

interface ToolItem {
  name: string;
  href: string;
}

interface DirectoryCluster {
  id: string;
  name: string;
  icon: string;
  category: string;
  tools: ToolItem[];
}

const CLUSTERS: DirectoryCluster[] = [
  {
    id: 'cluster-checking',
    name: 'Checking Accounts',
    icon: 'account_balance',
    category: 'checking',
    tools: [
      { name: 'Checking Account Calculator', href: '/finance/savings-calculator' },
      { name: 'Minimum Balance Fee Waiver', href: '/finance/savings-calculator' },
      { name: 'High-Yield Checking APY', href: '/finance/apy-calculator' },
      { name: 'Checking Direct Deposit Bonus ROI', href: '/finance/savings-calculator' },
      { name: 'Debit Card Cashback Yield', href: '/finance/savings-calculator' },
      { name: 'Checking Buffer Optimizer', href: '/finance/savings-calculator' },
      { name: 'Paper Check vs ACH Float Lag', href: '/finance/savings-calculator' },
      { name: 'Business Checking Analysis', href: '/business/cash-runway' },
    ],
  },
  {
    id: 'cluster-savings',
    name: 'Savings Accounts',
    icon: 'savings',
    category: 'savings',
    tools: [
      { name: 'Savings Account Calculator', href: '/savings-and-liquidity' },
      { name: 'High-Yield Savings APY Forecaster', href: '/savings-and-liquidity' },
      { name: 'Monthly Savings Target Plan', href: '/savings-and-liquidity' },
      { name: 'Emergency Fund Sizing Tool', href: '/savings-and-liquidity' },
      { name: 'Federal Reserve Rate Cut Impact', href: '/savings-and-liquidity' },
      { name: 'Certificate of Deposit (CD) Ladder', href: '/savings-and-liquidity' },
      { name: 'Early CD Withdrawal Penalty', href: '/savings-and-liquidity' },
      { name: 'Sub-Savings Vault Allocator', href: '/savings-and-liquidity' },
    ],
  },
  {
    id: 'cluster-cma',
    name: 'Cash Management',
    icon: 'account_tree',
    category: 'cash-mgmt',
    tools: [
      { name: 'Cash Management Calculator', href: '/savings-and-liquidity' },
      { name: 'Brokerage Cash Sweep Yield', href: '/savings-and-liquidity' },
      { name: 'Multi-Bank FDIC Limit Sweep ($5M)', href: '/savings-and-liquidity' },
      { name: 'CMA vs HYSA Fee-Yield Differential', href: '/savings-and-liquidity' },
      { name: 'Treasury Sweep vs Cash Fund', href: '/investing-and-growth' },
      { name: 'Settlement Fund Idle Float Loss', href: '/investing-and-growth' },
      { name: 'Uninvested Cash Drag Estimator', href: '/savings-and-liquidity' },
    ],
  },
  {
    id: 'cluster-apr',
    name: 'APR & Interest',
    icon: 'percent',
    category: 'apr-yield',
    tools: [
      { name: 'APR Calculator', href: '/finance/apy-calculator' },
      { name: 'APR to APY Conversion', href: '/finance/apy-calculator' },
      { name: 'APY to APR Reverse Nominal', href: '/finance/apy-calculator' },
      { name: 'Bank Interest Calculator', href: '/finance/compound-interest-calculator' },
      { name: 'Daily Periodic Rate (DPR)', href: '/finance/apy-calculator' },
      { name: 'Continuous Compounding Yield', href: '/finance/compound-interest-calculator' },
      { name: '7-Day SEC Yield Converter', href: '/investing-and-growth' },
      { name: 'Inflation-Adjusted Real Yield', href: '/savings-and-liquidity' },
      { name: 'Tax-Equivalent Bank Yield (TEY)', href: '/global-tax-calculator' },
    ],
  },
  {
    id: 'cluster-fees',
    name: 'Banking Fees',
    icon: 'receipt_long',
    category: 'fees',
    tools: [
      { name: 'Bank Fee Calculator', href: '/finance/savings-calculator' },
      { name: 'Monthly Maintenance Fee Erosion', href: '/finance/savings-calculator' },
      { name: 'Out-of-Network ATM Surcharge', href: '/finance/savings-calculator' },
      { name: 'Domestic & Wire Transfer Cost', href: '/finance/savings-calculator' },
      { name: 'Foreign Transaction Fee Analyzer', href: '/finance/savings-calculator' },
      { name: 'Paper Statement Surcharge', href: '/finance/savings-calculator' },
      { name: 'Inactivity & Dormancy Charge', href: '/finance/savings-calculator' },
      { name: 'Stop Payment Fee Comparison', href: '/finance/savings-calculator' },
      { name: 'Lifetime Banking Cost Projection', href: '/finance/savings-calculator' },
    ],
  },
  {
    id: 'cluster-overdraft',
    name: 'Overdraft Analysis',
    icon: 'warning',
    category: 'overdraft',
    tools: [
      { name: 'Overdraft Calculator', href: '/finance/savings-calculator' },
      { name: 'Overdraft Equivalent APR', href: '/finance/apy-calculator' },
      { name: 'NSF (Non-Sufficient Funds) Fee Cost', href: '/finance/savings-calculator' },
      { name: 'Overdraft Protection Line of Credit APR', href: '/loans-and-amortization' },
      { name: 'Opt-In vs Opt-Out Overdraft Exposure', href: '/finance/savings-calculator' },
      { name: 'Extended Negative Balance Penalty', href: '/finance/savings-calculator' },
      { name: 'Overdraft Fee vs Payday Loan Cost', href: '/loans-and-amortization' },
      { name: 'Linked Savings Transfer Fee Sizer', href: '/finance/savings-calculator' },
      { name: 'Annual Overdraft Vulnerability Index', href: '/finance/savings-calculator' },
    ],
  },
  {
    id: 'cluster-comparisons',
    name: 'Account Comparison',
    icon: 'compare',
    category: 'comparisons',
    tools: [
      { name: 'Account Comparison Calculator', href: '/savings-and-liquidity' },
      { name: 'Online vs Brick-and-Mortar Net Spread', href: '/savings-and-liquidity' },
      { name: 'Credit Union vs Commercial Bank', href: '/savings-and-liquidity' },
      { name: 'Multi-Account Switch Benefit Score', href: '/savings-and-liquidity' },
      { name: 'Fintech Neobank vs FDIC Chartered Bank', href: '/savings-and-liquidity' },
      { name: 'Interest Checking vs High-Yield Savings', href: '/savings-and-liquidity' },
    ],
  },
  {
    id: 'cluster-cashflow',
    name: 'Cash Flow Banking',
    icon: 'waves',
    category: 'checking',
    tools: [
      { name: 'Cash Flow Calculator', href: '/business/cash-runway' },
      { name: 'Checking Minimum Balance Forecaster', href: '/finance/savings-calculator' },
      { name: 'Payday Inflow-to-Outflow Synchronizer', href: '/finance/savings-calculator' },
      { name: 'Bill Auto-Pay Protection Buffer', href: '/finance/savings-calculator' },
      { name: 'Zero-Based Account Balancing Model', href: '/business/cash-runway' },
      { name: 'Semi-Monthly vs Bi-Weekly Cash Cadence', href: '/finance/savings-calculator' },
    ],
  },
  {
    id: 'cluster-deposit-planning',
    name: 'Deposit Planning',
    icon: 'flag',
    category: 'savings',
    tools: [
      { name: 'Deposit Target Date Calculator', href: '/savings-and-liquidity' },
      { name: 'Tiered Balance Rate Optimizer', href: '/savings-and-liquidity' },
      { name: 'Initial vs Monthly Contribution Split', href: '/savings-and-liquidity' },
      { name: 'Tax Season Windfall Allocation', href: '/global-tax-calculator' },
      { name: 'Down Payment Escrow Growth', href: '/mortgages-and-real-estate-debt' },
      { name: 'Annual Deposit Milestone Tracker', href: '/savings-and-liquidity' },
    ],
  },
  {
    id: 'cluster-yield-optimization',
    name: 'Yield Optimization',
    icon: 'military_tech',
    category: 'apr-yield',
    tools: [
      { name: 'Account Yield Calculator', href: '/finance/apy-calculator' },
      { name: 'Treasury Bill (T-Bill) vs HYSA Net Yield', href: '/investing-and-growth' },
      { name: 'State Tax Exemption Yield Delta', href: '/global-tax-calculator' },
      { name: 'Blended Deposit Rate Calculator', href: '/savings-and-liquidity' },
      { name: 'Intro Promo Rate vs Long-Term Yield', href: '/savings-and-liquidity' },
      { name: 'Money Market Account (MMA) vs HYSA', href: '/savings-and-liquidity' },
    ],
  },
  {
    id: 'cluster-digital-banking',
    name: 'Digital Banking',
    icon: 'devices',
    category: 'cash-mgmt',
    tools: [
      { name: 'Instant Transfer Fee Sizer (Venmo/Zelle)', href: '/finance/savings-calculator' },
      { name: 'Neobank Risk vs Yield Scorecard', href: '/savings-and-liquidity' },
      { name: 'Digital Round-Up Spare Change Multiplier', href: '/savings-and-liquidity' },
      { name: 'Virtual Card Cashback Aggregator', href: '/finance/savings-calculator' },
      { name: 'Direct Deposit Advance Cost (EWA APR)', href: '/loans-and-amortization' },
      { name: 'International Wire vs Wise/Remitly Delta', href: '/conversions' },
    ],
  },
  {
    id: 'cluster-personal-cash-architecture',
    name: 'Personal Cash Architecture',
    icon: 'hub',
    category: 'cash-mgmt',
    tools: [
      { name: 'Hub-and-Spoke Banking Allocator', href: '/savings-and-liquidity' },
      { name: 'Joint vs Individual Deposit Sweep', href: '/savings-and-liquidity' },
      { name: 'Self-Employed Tax Escrow Vault', href: '/global-tax-calculator' },
      { name: 'Automated Payday Splitter', href: '/savings-and-liquidity' },
      { name: 'Liquid Reserve Liquidity Ratio', href: '/savings-and-liquidity' },
      { name: 'Family Trust Deposit FDIC Coverage', href: '/savings-and-liquidity' },
    ],
  },
];

export default function BankingAndCashAccountsClient() {
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Optimizer Inputs State
  const [checkingBalance, setCheckingBalance] = useState(3500);
  const [savingsBalance, setSavingsBalance] = useState(25000);
  const [tradApy, setTradApy] = useState(0.01);
  const [hyApy, setHyApy] = useState(4.60);
  const [maintFee, setMaintFee] = useState(15);
  const [odCount, setOdCount] = useState(1);

  // User Save/Notification Feedback
  const [saveNotification, setSaveNotification] = useState<string | null>(null);

  // Interactive Optimizer Calculations
  const metrics = useMemo(() => {
    const checking = Math.max(0, checkingBalance);
    const savings = Math.max(0, savingsBalance);
    const tApy = Math.max(0, tradApy) / 100;
    const hApy = Math.max(0, hyApy) / 100;
    const mFee = Math.max(0, maintFee);
    const od = Math.max(0, odCount);

    // 1. Lost Yield: Difference between High-Yield Sweep vs Status Quo
    const optimalAnnualYield = (checking + savings) * hApy;
    const statusQuoYield = checking * tApy + savings * (tApy * 2);
    const lostInterest = Math.max(0, optimalAnnualYield - statusQuoYield);

    // 2. Direct Bank Fees
    const annualFees = mFee * 12 + od * 35;

    // 3. Total 1-Year Drain
    const totalDrain = lostInterest + annualFees;

    // 4. 5-Year Compounded Cost at hApy
    let compounded5Yr = 0;
    for (let yr = 1; yr <= 5; yr++) {
      compounded5Yr = (compounded5Yr + totalDrain) * (1 + hApy);
    }

    // Overdraft Equivalent APR: $35 fee on $50 for 7 days
    const odAPR = ((35 / 50) * (365 / 7) * 100).toFixed(0);

    return {
      lostInterest,
      annualFees,
      totalDrain,
      compounded5Yr,
      odAPR,
    };
  }, [checkingBalance, savingsBalance, tradApy, hyApy, maintFee, odCount]);

  // Format Helper
  const formatUSD = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val);
  };

  const resetBankingOptimizer = () => {
    setCheckingBalance(3500);
    setSavingsBalance(25000);
    setTradApy(0.01);
    setHyApy(4.60);
    setMaintFee(15);
    setOdCount(1);
  };

  const handleSaveStrategy = () => {
    setSaveNotification('Banking optimization strategy saved to browser local storage.');
    setTimeout(() => setSaveNotification(null), 4000);
  };

  // Filtered Clusters
  const filteredClusters = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return CLUSTERS.map((cluster) => {
      if (activeCategory !== 'all' && cluster.category !== activeCategory) {
        return null;
      }

      if (!q) return cluster;

      const matchesClusterName = cluster.name.toLowerCase().includes(q);
      const matchingTools = cluster.tools.filter((t) => t.name.toLowerCase().includes(q));

      if (matchesClusterName) return cluster;
      if (matchingTools.length > 0) {
        return {
          ...cluster,
          tools: matchingTools,
        };
      }
      return null;
    }).filter(Boolean) as DirectoryCluster[];
  }, [searchQuery, activeCategory]);

  const totalFilteredTools = useMemo(() => {
    return filteredClusters.reduce((sum, c) => sum + c.tools.length, 0);
  }, [filteredClusters]);

  return (
    <div className="min-h-screen bg-surface font-body-md text-on-surface">
      

      <main className="w-full pt-16 bg-surface">
        <div className="flex flex-col w-full">

          {/* CATEGORY HEADER & CONTEXT */}
          <section className="w-full bg-surface-container-low/60 pt-space-xl pb-space-2xl border-b border-surface-container/60">
            <div className="max-w-[1280px] mx-auto px-gutter-desktop">
              {/* Breadcrumb & Trust Micro-Bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm mb-space-lg">
                <nav aria-label="Breadcrumbs" className="flex items-center gap-space-xs font-body-sm text-body-sm text-on-surface-variant">
                  <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">home</span> Home
                  </Link>
                  <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                  <Link href="/finance" className="hover:text-primary transition-colors">
                    Financial Calculators
                  </Link>
                  <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                  <span className="font-medium text-on-surface">Banking &amp; Cash Accounts</span>
                </nav>

                <div className="inline-flex items-center gap-space-xs px-space-sm py-1 bg-surface-container-lowest rounded-full shadow-sm text-secondary border border-outline-variant/30">
                  <span className="material-symbols-outlined text-[16px] text-primary">account_balance</span>
                  <span className="font-label-caps text-label-caps uppercase font-semibold">
                    FDIC &amp; NCUA Benchmark Formulas · 100% Client-Side Privacy
                  </span>
                </div>
              </div>

              {/* Title & Value Statement */}
              <div className="max-w-3xl mb-space-xl">
                <div className="inline-block font-label-caps text-label-caps uppercase tracking-wider text-primary font-semibold mb-space-2xs">
                  Consumer Liquid Capital Suite
                </div>
                <h1 className="font-display-hero text-headline-lg md:text-display-hero text-on-surface tracking-tight mb-space-sm font-bold">
                  Banking &amp; Cash Accounts <span className="text-primary">Calculators</span>
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                  Compare checking accounts, savings accounts, cash management tools, APR earnings, banking fees, overdraft costs, account yields, and cash optimization strategies with simple, free calculators.
                </p>
              </div>

              {/* Live Search & Interactive Filter Pills */}
              <div className="flex flex-col gap-space-md">
                <div className="relative max-w-2xl">
                  <span className="material-symbols-outlined absolute left-space-md top-1/2 -translate-y-1/2 text-outline text-[20px]">
                    search
                  </span>
                  <input
                    id="category-tool-search"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search banking calculators (e.g. Overdraft APR, APY Sweep, Maintenance Fee)..."
                    className="w-full pl-11 pr-space-xl py-space-sm bg-surface-container-lowest rounded-xl shadow-sm text-on-surface placeholder:text-outline font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all border border-outline-variant/30"
                  />
                  <span className="material-symbols-outlined absolute right-space-md top-1/2 -translate-y-1/2 text-outline-variant text-[18px]">
                    keyboard
                  </span>
                </div>

                <div className="flex items-center gap-space-xs overflow-x-auto pb-space-2xs no-scrollbar">
                  {[
                    { id: 'all', label: 'All Tools (98)' },
                    { id: 'checking', label: 'Checking (8)' },
                    { id: 'savings', label: 'Savings (8)' },
                    { id: 'cash-mgmt', label: 'Cash Management (7)' },
                    { id: 'apr-yield', label: 'APR & Yield (9)' },
                    { id: 'fees', label: 'Bank Fees (9)' },
                    { id: 'overdraft', label: 'Overdraft (9)' },
                    { id: 'comparisons', label: 'Comparisons (6)' },
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => setActiveCategory(filter.id)}
                      className={`px-space-sm py-1.5 rounded-full font-label-caps text-label-caps uppercase transition-all whitespace-nowrap cursor-pointer ${
                        activeCategory === filter.id
                          ? 'bg-primary text-on-primary shadow-sm font-bold'
                          : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* INTERACTIVE LIVE TOOL & FLAGSHIP WORKBENCH */}
          <section className="w-full max-w-[1280px] mx-auto px-gutter-desktop py-space-3xl">
            <div className="flex flex-col gap-space-sm mb-space-xl">
              <div className="flex items-center gap-space-xs text-primary font-label-caps text-label-caps uppercase font-bold">
                <span className="material-symbols-outlined text-[18px]">account_balance</span>
                Flagship Cash Simulation Engine
              </div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-semibold">
                Interactive Banking Optimizer &amp; Fee Erosion Calculator
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                Quantify the combined cash leak from suppressed savings yields, unoptimized checking buffers, monthly maintenance charges, and predatory overdraft penalties.
              </p>
            </div>

            {/* Dual-Pane Workbench Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
              
              {/* Left Configurator Panel (7 Cols) */}
              <div className="lg:col-span-7 bg-surface-container-lowest p-space-xl rounded-2xl shadow-md flex flex-col gap-space-lg border border-outline-variant/30">
                <div className="flex items-center justify-between pb-space-sm border-b border-surface-container">
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-primary text-[22px]">tune</span>
                    <span className="font-headline-md text-headline-md text-on-surface font-semibold">
                      Account Parameters
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={resetBankingOptimizer}
                    className="text-on-surface-variant hover:text-primary font-body-sm text-body-sm flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">restart_alt</span> Reset defaults
                  </button>
                </div>

                {/* 1. Checking Balance */}
                <div className="flex flex-col gap-space-2xs">
                  <div className="flex justify-between items-center">
                    <label htmlFor="input-checking" className="font-body-sm text-body-sm font-semibold text-on-surface">
                      Average Checking Account Balance
                    </label>
                    <span className="font-data-mono text-body-md font-semibold text-primary" id="val-checking-text">
                      ${checkingBalance.toLocaleString('en-US')}
                    </span>
                  </div>
                  <input
                    id="input-checking"
                    type="range"
                    min="500"
                    max="25000"
                    step="250"
                    value={checkingBalance}
                    onChange={(e) => setCheckingBalance(parseFloat(e.target.value) || 0)}
                    className="w-full accent-primary h-2 bg-surface-container rounded-lg cursor-pointer"
                  />
                  <div className="flex gap-space-xs mt-1 flex-wrap">
                    {[1000, 3500, 5000, 10000].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setCheckingBalance(val)}
                        className={`px-space-xs py-0.5 rounded font-data-mono text-label-caps transition-colors cursor-pointer ${
                          checkingBalance === val
                            ? 'bg-primary text-on-primary font-bold'
                            : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant'
                        }`}
                      >
                        ${val.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Cash/Savings Balance */}
                <div className="flex flex-col gap-space-2xs">
                  <div className="flex justify-between items-center">
                    <label htmlFor="input-savings" className="font-body-sm text-body-sm font-semibold text-on-surface">
                      Average Cash / Liquid Savings Balance
                    </label>
                    <span className="font-data-mono text-body-md font-semibold text-primary" id="val-savings-text">
                      ${savingsBalance.toLocaleString('en-US')}
                    </span>
                  </div>
                  <input
                    id="input-savings"
                    type="range"
                    min="2000"
                    max="150000"
                    step="1000"
                    value={savingsBalance}
                    onChange={(e) => setSavingsBalance(parseFloat(e.target.value) || 0)}
                    className="w-full accent-primary h-2 bg-surface-container rounded-lg cursor-pointer"
                  />
                  <div className="flex gap-space-xs mt-1 flex-wrap">
                    {[5000, 15000, 25000, 50000].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setSavingsBalance(val)}
                        className={`px-space-xs py-0.5 rounded font-data-mono text-label-caps transition-colors cursor-pointer ${
                          savingsBalance === val
                            ? 'bg-primary text-on-primary font-bold'
                            : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant'
                        }`}
                      >
                        ${val.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Dual APY Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                  <div className="bg-surface-container-low p-space-md rounded-xl border border-outline-variant/20">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-body-sm text-body-sm font-medium text-on-surface">Traditional Checking APY</span>
                      <span className="font-data-mono text-body-sm font-semibold text-on-surface-variant" id="val-trad-apy">
                        {tradApy.toFixed(2)}%
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-outline mb-2 text-[11px]">National average big-bank rate</p>
                    <input
                      id="input-trad-apy"
                      type="range"
                      min="0.0"
                      max="0.25"
                      step="0.01"
                      value={tradApy}
                      onChange={(e) => setTradApy(parseFloat(e.target.value) || 0)}
                      className="w-full accent-primary h-1.5 bg-surface-container rounded cursor-pointer"
                    />
                  </div>

                  <div className="bg-secondary-fixed/30 p-space-md rounded-xl border border-secondary-fixed">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-body-sm text-body-sm font-medium text-on-surface">High-Yield Cash / CMA APY</span>
                      <span className="font-data-mono text-body-sm font-semibold text-primary" id="val-hy-apy">
                        {hyApy.toFixed(2)}%
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-2 text-[11px]">
                      Top-tier online &amp; broker sweep rate
                    </p>
                    <input
                      id="input-hy-apy"
                      type="range"
                      min="2.0"
                      max="6.0"
                      step="0.05"
                      value={hyApy}
                      onChange={(e) => setHyApy(parseFloat(e.target.value) || 0)}
                      className="w-full accent-primary h-1.5 bg-surface-container rounded cursor-pointer"
                    />
                  </div>
                </div>

                {/* 4. Bank Maintenance Fees & Overdraft Incidents */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="input-maint-fee" className="font-body-sm text-body-sm font-medium text-on-surface">
                      Monthly Maintenance &amp; ATM Fees
                    </label>
                    <div className="flex items-center bg-surface-container-low px-space-md py-space-xs rounded-xl border border-outline-variant/30">
                      <span className="font-data-mono text-on-surface-variant text-body-md mr-1">$</span>
                      <input
                        id="input-maint-fee"
                        type="number"
                        min="0"
                        max="100"
                        value={maintFee}
                        onChange={(e) => setMaintFee(Math.max(0, parseFloat(e.target.value) || 0))}
                        className="bg-transparent w-full font-data-mono text-body-md text-on-surface focus:outline-none"
                      />
                      <span className="font-label-caps text-label-caps text-outline uppercase">/mo</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label htmlFor="input-od-count" className="font-body-sm text-body-sm font-medium text-on-surface">
                      Overdraft Incidents Per Year
                    </label>
                    <div className="flex items-center bg-surface-container-low px-space-md py-space-xs rounded-xl border border-outline-variant/30">
                      <input
                        id="input-od-count"
                        type="number"
                        min="0"
                        max="12"
                        value={odCount}
                        onChange={(e) => setOdCount(Math.max(0, parseFloat(e.target.value) || 0))}
                        className="bg-transparent w-full font-data-mono text-body-md text-on-surface focus:outline-none"
                      />
                      <span className="font-label-caps text-label-caps text-outline uppercase">@ $35/ea</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Real-Time Results Card (5 Cols) */}
              <div className="lg:col-span-5 bg-surface-container-lowest p-space-xl rounded-2xl shadow-xl flex flex-col gap-space-lg relative overflow-hidden border border-outline-variant/30">
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
                
                <div className="flex items-center justify-between pb-space-2xs">
                  <span className="font-label-caps text-label-caps uppercase tracking-wider text-secondary font-semibold">
                    1-Year Loss Audit
                  </span>
                  <span className="px-space-xs py-0.5 rounded bg-error-container text-on-error-container font-label-caps text-label-caps font-bold">
                    Costly Friction
                  </span>
                </div>

                {/* Headline Drain */}
                <div className="bg-surface-container-low p-space-lg rounded-xl flex flex-col gap-1 border border-outline-variant/20">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Total 1-Year Banking Wealth Drain
                  </span>
                  <div className="font-numerical-display text-numerical-display text-error font-extrabold" id="metric-total-drain">
                    {formatUSD(metrics.totalDrain)}
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    Direct bank charges + missed yield on idle balances
                  </span>
                </div>

                {/* Breakdown Grid */}
                <div className="grid grid-cols-2 gap-space-sm">
                  <div className="bg-surface-container p-space-md rounded-xl">
                    <span className="font-label-caps text-label-caps uppercase text-on-surface-variant font-semibold">
                      Annual Lost Interest
                    </span>
                    <div className="font-headline-md text-headline-md text-primary mt-1 font-bold" id="metric-lost-yield">
                      {formatUSD(metrics.lostInterest)}
                    </div>
                    <span className="font-body-sm text-body-sm text-outline text-[12px]">Opportunity cost</span>
                  </div>

                  <div className="bg-surface-container p-space-md rounded-xl">
                    <span className="font-label-caps text-label-caps uppercase text-on-surface-variant font-semibold">
                      Direct Annual Fees
                    </span>
                    <div className="font-headline-md text-headline-md text-error mt-1 font-bold" id="metric-direct-fees">
                      {formatUSD(metrics.annualFees)}
                    </div>
                    <span className="font-body-sm text-body-sm text-outline text-[12px]">Maintenance + Overdraft</span>
                  </div>
                </div>

                {/* 5-Year Cumulative Erosion */}
                <div className="flex items-center justify-between p-space-md rounded-xl bg-surface-container-high">
                  <div className="flex flex-col">
                    <span className="font-body-sm text-body-sm font-semibold text-on-surface">5-Year Compounded Cost</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant text-[12px]">
                      At {hyApy.toFixed(2)}% re-invested yield
                    </span>
                  </div>
                  <span className="font-data-mono text-body-lg font-bold text-on-surface" id="metric-5yr-cost">
                    {formatUSD(metrics.compounded5Yr)}
                  </span>
                </div>

                {/* Overdraft Equivalent APR Spotlight */}
                <div className="p-space-md rounded-xl bg-error-container/40 flex items-start gap-space-sm border border-error/20">
                  <span className="material-symbols-outlined text-error text-[20px] shrink-0 mt-0.5">warning</span>
                  <div className="flex flex-col">
                    <span className="font-label-caps text-label-caps uppercase font-bold text-on-error-container">
                      Overdraft Equivalent APR Alert
                    </span>
                    <p className="font-body-sm text-body-sm text-on-surface mt-0.5" id="metric-od-spotlight">
                      A single $35 fee on an average $50 overdraft settled in 7 days equates to a staggering{' '}
                      <span className="font-data-mono font-bold text-error">
                        {Number(metrics.odAPR).toLocaleString('en-US')}% APR
                      </span>!
                    </p>
                  </div>
                </div>

                {/* Trajectory Comparison Chart (Inline SVG) */}
                <div className="flex flex-col gap-space-xs pt-space-xs">
                  <div className="flex justify-between font-label-caps text-label-caps uppercase text-on-surface-variant font-semibold">
                    <span>5-Year Wealth Trajectory</span>
                    <span className="text-primary font-semibold">Optimized vs Status Quo</span>
                  </div>
                  <div className="w-full h-24 bg-surface-container rounded-xl p-2 flex items-end">
                    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 300 80">
                      <path
                        d="M 0,75 C 60,74 120,73 180,72 L 300,70"
                        fill="none"
                        stroke="#ba1a1a"
                        strokeDasharray="4 2"
                        strokeWidth="2.5"
                      />
                      <path
                        d="M 0,75 C 60,60 120,40 180,25 L 300,10"
                        fill="none"
                        stroke="#004ac6"
                        strokeWidth="3"
                      />
                      <circle cx="300" cy="10" fill="#004ac6" r="4" />
                      <circle cx="300" cy="70" fill="#ba1a1a" r="4" />
                    </svg>
                  </div>
                  <div className="flex justify-between font-body-sm text-body-sm text-outline text-[11px]">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-error inline-block"></span> Status Quo (Fees Drain Capital)
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-primary inline-block"></span> High-Yield CMA (+{hyApy.toFixed(2)}% APY Sweep)
                    </span>
                  </div>
                </div>

                {saveNotification && (
                  <div className="p-2.5 bg-primary-fixed text-on-primary-fixed rounded-lg text-body-sm font-medium flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    <span>{saveNotification}</span>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="flex gap-space-sm pt-space-xs">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="flex-1 py-space-xs px-space-sm bg-primary text-on-primary rounded-xl font-body-sm text-body-sm font-semibold hover:bg-primary-container shadow-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">download</span> Export PDF Report
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveStrategy}
                    className="py-space-xs px-space-md bg-surface-container hover:bg-surface-container-high text-on-surface rounded-xl font-body-sm text-body-sm font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">bookmark</span> Save
                  </button>
                </div>
              </div>

            </div>
          </section>

          {/* SMART BANKING SCENARIOS & ADVISORY (AI BANKING COACH) */}
          <section className="w-full bg-surface-container-low/50 py-space-3xl border-y border-surface-container/60">
            <div className="max-w-[1280px] mx-auto px-gutter-desktop">
              <div className="flex flex-col gap-space-2xs mb-space-xl">
                <span className="font-label-caps text-label-caps uppercase tracking-wider text-secondary font-semibold">
                  Strategic Liquidity Architecture
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-semibold">
                  4 Banking Rules Every Account Holder Must Know
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                  Empirical patterns uncovered from checking and savings audits. Use these mental models to restructure everyday deposits.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
                {/* Scenario 1 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow border border-outline-variant/20">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-error-container/60 text-error flex items-center justify-center mb-space-md">
                      <span className="material-symbols-outlined text-[24px]">cancel</span>
                    </div>
                    <span className="font-label-caps text-label-caps uppercase text-error font-semibold">
                      Fee Trap Danger
                    </span>
                    <h3 className="font-headline-md text-body-lg font-semibold text-on-surface mt-1 mb-space-xs">
                      The $12/Month Checking Trap
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      A recurring $12/mo maintenance charge completely wipes out the entire 1.00% annual interest on a massive $14,400 checking balance. Never pay monthly fees for retail transactions.
                    </p>
                  </div>
                  <div className="mt-space-md pt-space-sm border-t border-surface-container flex items-center justify-between">
                    <span className="font-data-mono text-label-caps text-outline">Threshold: $14.4k @ 1%</span>
                    <a className="text-primary font-body-sm text-body-sm font-semibold hover:underline" href="#cluster-checking">
                      See Fix →
                    </a>
                  </div>
                </div>

                {/* Scenario 2 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow border border-outline-variant/20">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-tertiary-fixed/60 text-tertiary flex items-center justify-center mb-space-md">
                      <span className="material-symbols-outlined text-[24px]">price_change</span>
                    </div>
                    <span className="font-label-caps text-label-caps uppercase text-tertiary font-semibold">
                      Borrowing Math
                    </span>
                    <h3 className="font-headline-md text-body-lg font-semibold text-on-surface mt-1 mb-space-xs">
                      The $35 Overdraft Reality
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Overdraft protection is America&apos;s costliest short-term loan. Covering a $30 coffee run with a $35 fee paid back in 5 days translates to an effective APR exceeding 8,500%.
                    </p>
                  </div>
                  <div className="mt-space-md pt-space-sm border-t border-surface-container flex items-center justify-between">
                    <span className="font-data-mono text-label-caps text-outline">True APR: 1,000%+</span>
                    <a className="text-primary font-body-sm text-body-sm font-semibold hover:underline" href="#cluster-overdraft">
                      Calculate →
                    </a>
                  </div>
                </div>

                {/* Scenario 3 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow border border-outline-variant/20">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-secondary-fixed text-secondary flex items-center justify-center mb-space-md">
                      <span className="material-symbols-outlined text-[24px]">account_tree</span>
                    </div>
                    <span className="font-label-caps text-label-caps uppercase text-secondary font-semibold">
                      Insurance &amp; Sweep
                    </span>
                    <h3 className="font-headline-md text-body-lg font-semibold text-on-surface mt-1 mb-space-xs">
                      CMA Multi-Bank Sweeps
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Cash Management Accounts (CMAs) route capital across up to 20 partner banks, multiplying standard $250k FDIC limits into $2.5M–$5M of insured safety with instant liquidity.
                    </p>
                  </div>
                  <div className="mt-space-md pt-space-sm border-t border-surface-container flex items-center justify-between">
                    <span className="font-data-mono text-label-caps text-outline">FDIC: Up to $5,000,000</span>
                    <a className="text-primary font-body-sm text-body-sm font-semibold hover:underline" href="#cluster-cma">
                      Explore Sweeps →
                    </a>
                  </div>
                </div>

                {/* Scenario 4 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow border border-outline-variant/20">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-primary-fixed text-primary flex items-center justify-center mb-space-md">
                      <span className="material-symbols-outlined text-[24px]">shield</span>
                    </div>
                    <span className="font-label-caps text-label-caps uppercase text-primary font-semibold">
                      Buffer Optimization
                    </span>
                    <h3 className="font-headline-md text-body-lg font-semibold text-on-surface mt-1 mb-space-xs">
                      The 1-Month Buffer Rule
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Keep exactly 1.0 to 1.5 months of routine expenses in operational checking. Sweep 100% of residual cash into high-yield accounts on payday to avoid zero-yield drag.
                    </p>
                  </div>
                  <div className="mt-space-md pt-space-sm border-t border-surface-container flex items-center justify-between">
                    <span className="font-data-mono text-label-caps text-outline">Target Buffer: 30–45 Days</span>
                    <a className="text-primary font-body-sm text-body-sm font-semibold hover:underline" href="#cluster-cashflow">
                      Model Inflows →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 12 FEATURED POPULAR BANKING CALCULATORS */}
          <section className="w-full max-w-[1280px] mx-auto px-gutter-desktop py-space-3xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-xl gap-space-sm">
              <div>
                <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-semibold">
                  Instant Execution
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-semibold">
                  12 Core Banking Calculators
                </h2>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md">
                Streamlined computational cards built for real-world personal banking decisions with zero peripheral clutter.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
              {[
                {
                  title: 'Bank Account Calculator',
                  desc: 'Compare all-in net yield across checking and savings.',
                  badge: 'Net Yield',
                  icon: 'account_balance_wallet',
                  action: 'Calculate Now →',
                  href: '/finance/savings-calculator',
                },
                {
                  title: 'Checking Account Calculator',
                  desc: 'Calculate monthly maintenance and minimum balance costs.',
                  badge: 'Cost Audit',
                  icon: 'payments',
                  action: 'Calculate Costs →',
                  href: '/finance/savings-calculator',
                },
                {
                  title: 'Savings Account Calculator',
                  desc: 'Forecast interest earnings with compounding frequencies.',
                  badge: 'Growth',
                  icon: 'trending_up',
                  action: 'Calculate Growth →',
                  href: '/savings-and-liquidity',
                },
                {
                  title: 'APR Calculator',
                  desc: 'Determine nominal APR and effective annual borrowing cost.',
                  badge: 'Borrowing Rate',
                  icon: 'percent',
                  action: 'Calculate APR →',
                  href: '/finance/apy-calculator',
                },
                {
                  title: 'Bank Fee Calculator',
                  desc: 'Audit monthly maintenance, ATM, and transaction expenses.',
                  badge: 'Expense Audit',
                  icon: 'receipt_long',
                  action: 'Audit Fees →',
                  href: '/finance/savings-calculator',
                },
                {
                  title: 'Overdraft Calculator',
                  desc: 'Analyze overdraft fees and equivalent borrowing rates.',
                  badge: 'Penalty Analysis',
                  icon: 'warning',
                  action: 'Analyze Overdraft →',
                  href: '/finance/savings-calculator',
                },
                {
                  title: 'Account Yield Calculator',
                  desc: 'Convert APR to APY and calculate blended earnings.',
                  badge: 'Compounding APY',
                  icon: 'currency_exchange',
                  action: 'Calculate Yield →',
                  href: '/finance/apy-calculator',
                },
                {
                  title: 'Cash Management Calculator',
                  desc: 'Optimize cash sweeps between checking and high-yield pools.',
                  badge: 'Sweep Protocol',
                  icon: 'sync_alt',
                  action: 'Optimize Cash →',
                  href: '/savings-and-liquidity',
                },
                {
                  title: 'Bank Interest Calculator',
                  desc: 'Simulate daily, monthly, and annual compounding payouts.',
                  badge: 'Interest Simulation',
                  icon: 'query_stats',
                  action: 'Calculate Interest →',
                  href: '/finance/compound-interest-calculator',
                },
                {
                  title: 'Fee Impact Calculator',
                  desc: 'Measure the long-term wealth erosion of account fees.',
                  badge: 'Wealth Erosion',
                  icon: 'trending_down',
                  action: 'Calculate Impact →',
                  href: '/finance/savings-calculator',
                },
                {
                  title: 'Cash Flow Calculator',
                  desc: 'Map income vs. expense inflows and forecast minimum balances.',
                  badge: 'Liquidity Flow',
                  icon: 'waves',
                  action: 'Map Cash Flow →',
                  href: '/business/cash-runway',
                },
                {
                  title: 'Account Comparison Calculator',
                  desc: 'Side-by-side comparison of online vs. brick-and-mortar accounts.',
                  badge: 'Benchmark',
                  icon: 'compare',
                  action: 'Compare Accounts →',
                  href: '/savings-and-liquidity',
                },
              ].map((card, i) => (
                <div
                  key={i}
                  className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between group border border-outline-variant/20"
                >
                  <div>
                    <div className="flex items-center justify-between mb-space-sm">
                      <span className="px-space-xs py-0.5 rounded bg-surface-container font-label-caps text-label-caps uppercase text-on-surface-variant">
                        {card.badge}
                      </span>
                      <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">
                        {card.icon}
                      </span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors font-semibold">
                      {card.title}
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                      {card.desc}
                    </p>
                  </div>
                  <Link
                    href={card.href}
                    className="mt-space-md inline-flex items-center text-primary font-body-sm text-body-sm font-semibold group-hover:translate-x-1 transition-transform"
                  >
                    {card.action}
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* COMPLETE 12 BANKING & CASH ACCOUNTS DIRECTORY (98 TOOLS TOTAL) */}
          <section className="w-full bg-surface-container-low/30 py-space-3xl border-y border-surface-container/60" id="banking-directory">
            <div className="max-w-[1280px] mx-auto px-gutter-desktop">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-2xl gap-space-sm">
                <div>
                  <span className="font-label-caps text-label-caps uppercase tracking-wider text-secondary font-semibold">
                    Exhaustive Mathematical Suite
                  </span>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface font-semibold">
                    Complete Directory of 98 Banking Tools
                  </h2>
                </div>
                <div className="text-on-surface-variant font-data-mono text-body-sm bg-surface-container-lowest px-4 py-1.5 rounded-xl border border-outline-variant/30">
                  {totalFilteredTools} Tools Available · 12 Clusters · All Models Local
                </div>
              </div>

              {filteredClusters.length === 0 ? (
                <div className="bg-surface-container-lowest p-8 rounded-2xl text-center shadow-sm">
                  <p className="text-on-surface-variant text-body-md">
                    No calculators matched your query &quot;{searchQuery}&quot;.
                  </p>
                  <button
                    type="button"
                    onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                    className="mt-3 px-4 py-2 bg-primary text-on-primary rounded-xl text-body-sm font-semibold cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
                  {filteredClusters.map((cluster) => (
                    <div
                      key={cluster.id}
                      id={cluster.id}
                      className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm flex flex-col gap-space-md border border-outline-variant/20"
                    >
                      <div className="flex items-center gap-space-xs pb-space-xs border-b border-surface-container">
                        <span className="material-symbols-outlined text-primary text-[20px]">
                          {cluster.icon}
                        </span>
                        <h3 className="font-headline-md text-body-lg font-semibold text-on-surface">
                          {cluster.name}
                        </h3>
                        <span className="ml-auto font-data-mono text-label-caps bg-surface-container px-2 py-0.5 rounded text-on-surface-variant font-bold">
                          {cluster.tools.length} tools
                        </span>
                      </div>
                      <ul className="flex flex-col gap-space-xs font-body-sm text-body-sm text-on-surface-variant">
                        {cluster.tools.map((tool) => (
                          <li key={tool.name}>
                            <Link
                              href={tool.href}
                              className="hover:text-primary transition-colors flex items-center justify-between py-0.5"
                            >
                              <span>{tool.name}</span>
                              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* SMART BANKING DECISIONS: HEAD-TO-HEAD COMPARISONS (8 Analytical Matrix Cards) */}
          <section className="w-full max-w-[1280px] mx-auto px-gutter-desktop py-space-3xl">
            <div className="flex flex-col gap-space-2xs mb-space-xl">
              <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-semibold">
                Comparative Analysis
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-semibold">
                Smart Banking Decisions: 8 Head-to-Head Matrices
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                Clear mathematical and structural distinctions between popular cash vehicles and account types.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
              {/* Matrix 1 */}
              <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm flex flex-col justify-between border border-outline-variant/20">
                <div>
                  <span className="font-label-caps text-label-caps uppercase text-secondary font-semibold">
                    Account Purpose
                  </span>
                  <h3 className="font-headline-md text-body-lg font-semibold text-on-surface mt-1 mb-space-xs">
                    Checking vs Savings
                  </h3>
                  <div className="space-y-2 mt-3 font-body-sm text-body-sm">
                    <div className="p-2 rounded bg-surface-container-low">
                      <span className="font-semibold text-on-surface block">Checking:</span>
                      <span className="text-on-surface-variant">Transactional utility, debit cards, unlimited debits, 0.01%–0.10% APY.</span>
                    </div>
                    <div className="p-2 rounded bg-surface-container">
                      <span className="font-semibold text-on-surface block">Savings:</span>
                      <span className="text-on-surface-variant">Capital preservation, interest generation, 4.00%–5.00% APY.</span>
                    </div>
                  </div>
                </div>
                <div className="mt-space-md pt-space-xs text-outline font-data-mono text-label-caps border-t border-surface-container">
                  Verdict: Pair both via auto-sweep
                </div>
              </div>

              {/* Matrix 2 */}
              <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm flex flex-col justify-between border border-outline-variant/20">
                <div>
                  <span className="font-label-caps text-label-caps uppercase text-secondary font-semibold">
                    Compounding Math
                  </span>
                  <h3 className="font-headline-md text-body-lg font-semibold text-on-surface mt-1 mb-space-xs">
                    APR vs APY
                  </h3>
                  <div className="space-y-2 mt-3 font-body-sm text-body-sm">
                    <div className="p-2 rounded bg-surface-container-low">
                      <span className="font-semibold text-on-surface block">APR (Nominal):</span>
                      <span className="text-on-surface-variant">Simple annual interest rate excluding the effect of compounding.</span>
                    </div>
                    <div className="p-2 rounded bg-surface-container">
                      <span className="font-semibold text-on-surface block">APY (Effective):</span>
                      <span className="text-on-surface-variant">True yield earned taking daily/monthly compounding into calculation.</span>
                    </div>
                  </div>
                </div>
                <div className="mt-space-md pt-space-xs text-outline font-data-mono text-label-caps border-t border-surface-container">
                  Formula: APY = (1+r/n)ⁿ - 1
                </div>
              </div>

              {/* Matrix 3 */}
              <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm flex flex-col justify-between border border-outline-variant/20">
                <div>
                  <span className="font-label-caps text-label-caps uppercase text-secondary font-semibold">
                    Platform Architecture
                  </span>
                  <h3 className="font-headline-md text-body-lg font-semibold text-on-surface mt-1 mb-space-xs">
                    Online vs Traditional Bank
                  </h3>
                  <div className="space-y-2 mt-3 font-body-sm text-body-sm">
                    <div className="p-2 rounded bg-surface-container-low">
                      <span className="font-semibold text-on-surface block">Online Bank:</span>
                      <span className="text-on-surface-variant">4.25%–5.00% APY, zero monthly fees, no physical teller branches.</span>
                    </div>
                    <div className="p-2 rounded bg-surface-container">
                      <span className="font-semibold text-on-surface block">Brick &amp; Mortar:</span>
                      <span className="text-on-surface-variant">0.01% APY, cash deposits, notary in-person services, $12–$25 fees.</span>
                    </div>
                  </div>
                </div>
                <div className="mt-space-md pt-space-xs text-outline font-data-mono text-label-caps border-t border-surface-container">
                  Spread: +$1,100+/yr per $25k
                </div>
              </div>

              {/* Matrix 4 */}
              <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm flex flex-col justify-between border border-outline-variant/20">
                <div>
                  <span className="font-label-caps text-label-caps uppercase text-secondary font-semibold">
                    Custody &amp; Insurance
                  </span>
                  <h3 className="font-headline-md text-body-lg font-semibold text-on-surface mt-1 mb-space-xs">
                    CMA vs HYSA
                  </h3>
                  <div className="space-y-2 mt-3 font-body-sm text-body-sm">
                    <div className="p-2 rounded bg-surface-container-low">
                      <span className="font-semibold text-on-surface block">CMA (Brokerage):</span>
                      <span className="text-on-surface-variant">Multi-bank sweep, checkwriting + SIPC + $2.5M+ FDIC aggregate.</span>
                    </div>
                    <div className="p-2 rounded bg-surface-container">
                      <span className="font-semibold text-on-surface block">HYSA (Direct Bank):</span>
                      <span className="text-on-surface-variant">Single bank charter, direct FDIC $250k single / $500k joint limit.</span>
                    </div>
                  </div>
                </div>
                <div className="mt-space-md pt-space-xs text-outline font-data-mono text-label-caps border-t border-surface-container">
                  Advantage: CMA for high net worth
                </div>
              </div>

              {/* Matrix 5 */}
              <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm flex flex-col justify-between border border-outline-variant/20">
                <div>
                  <span className="font-label-caps text-label-caps uppercase text-secondary font-semibold">
                    Short-Term Liquidity
                  </span>
                  <h3 className="font-headline-md text-body-lg font-semibold text-on-surface mt-1 mb-space-xs">
                    Overdraft vs Credit Card
                  </h3>
                  <div className="space-y-2 mt-3 font-body-sm text-body-sm">
                    <div className="p-2 rounded bg-surface-container-low">
                      <span className="font-semibold text-on-surface block">Bank Overdraft:</span>
                      <span className="text-on-surface-variant">Flat $35 fee on $50 negative = 3,650% effective annual rate.</span>
                    </div>
                    <div className="p-2 rounded bg-surface-container">
                      <span className="font-semibold text-on-surface block">Credit Card Charge:</span>
                      <span className="text-on-surface-variant">24.99% APR with 21–25 day grace period = $0.00 interest if paid on time.</span>
                    </div>
                  </div>
                </div>
                <div className="mt-space-md pt-space-xs text-outline font-data-mono text-label-caps border-t border-surface-container">
                  Risk: Overdraft is 140x pricier
                </div>
              </div>

              {/* Matrix 6 */}
              <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm flex flex-col justify-between border border-outline-variant/20">
                <div>
                  <span className="font-label-caps text-label-caps uppercase text-secondary font-semibold">
                    Wealth Impact
                  </span>
                  <h3 className="font-headline-md text-body-lg font-semibold text-on-surface mt-1 mb-space-xs">
                    Bank Fees vs Opportunity Cost
                  </h3>
                  <div className="space-y-2 mt-3 font-body-sm text-body-sm">
                    <div className="p-2 rounded bg-surface-container-low">
                      <span className="font-semibold text-on-surface block">Direct Charges:</span>
                      <span className="text-on-surface-variant">$15/mo maintenance fee = $180 annual visible out-of-pocket cash drain.</span>
                    </div>
                    <div className="p-2 rounded bg-surface-container">
                      <span className="font-semibold text-on-surface block">Opportunity Cost:</span>
                      <span className="text-on-surface-variant">Leaving $30k at 0.01% vs 4.60% = $1,377 hidden lost yield each year.</span>
                    </div>
                  </div>
                </div>
                <div className="mt-space-md pt-space-xs text-outline font-data-mono text-label-caps border-t border-surface-container">
                  Insight: Lost yield exceeds fees 7:1
                </div>
              </div>

              {/* Matrix 7 */}
              <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm flex flex-col justify-between border border-outline-variant/20">
                <div>
                  <span className="font-label-caps text-label-caps uppercase text-secondary font-semibold">
                    Institutional Safety
                  </span>
                  <h3 className="font-headline-md text-body-lg font-semibold text-on-surface mt-1 mb-space-xs">
                    Digital Neobank vs Credit Union
                  </h3>
                  <div className="space-y-2 mt-3 font-body-sm text-body-sm">
                    <div className="p-2 rounded bg-surface-container-low">
                      <span className="font-semibold text-on-surface block">Digital Neobank:</span>
                      <span className="text-on-surface-variant">Fintech intermediary relying on partner bank pass-through insurance.</span>
                    </div>
                    <div className="p-2 rounded bg-surface-container">
                      <span className="font-semibold text-on-surface block">Credit Union:</span>
                      <span className="text-on-surface-variant">Member-owned non-profit, direct NCUA insurance up to $250,000.</span>
                    </div>
                  </div>
                </div>
                <div className="mt-space-md pt-space-xs text-outline font-data-mono text-label-caps border-t border-surface-container">
                  Safety: Direct NCUA/FDIC superior
                </div>
              </div>

              {/* Matrix 8 */}
              <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm flex flex-col justify-between border border-outline-variant/20">
                <div>
                  <span className="font-label-caps text-label-caps uppercase text-secondary font-semibold">
                    Yield &amp; Taxes
                  </span>
                  <h3 className="font-headline-md text-body-lg font-semibold text-on-surface mt-1 mb-space-xs">
                    Idle Cash vs Liquid T-Bills
                  </h3>
                  <div className="space-y-2 mt-3 font-body-sm text-body-sm">
                    <div className="p-2 rounded bg-surface-container-low">
                      <span className="font-semibold text-on-surface block">Bank Savings (HYSA):</span>
                      <span className="text-on-surface-variant">Subject to Federal + State + Local income tax on earned interest.</span>
                    </div>
                    <div className="p-2 rounded bg-surface-container">
                      <span className="font-semibold text-on-surface block">4-Week Treasury Bills:</span>
                      <span className="text-on-surface-variant">100% exempt from state &amp; local taxes; federal backing.</span>
                    </div>
                  </div>
                </div>
                <div className="mt-space-md pt-space-xs text-outline font-data-mono text-label-caps border-t border-surface-container">
                  Bonus: Saves 5%–13% state tax
                </div>
              </div>
            </div>
          </section>

          {/* CLEAR BANKING MATHEMATICAL FORMULAS */}
          <section className="w-full bg-surface-container-low/40 py-space-3xl border-y border-surface-container/60">
            <div className="max-w-[1280px] mx-auto px-gutter-desktop">
              <div className="flex flex-col gap-space-2xs mb-space-xl">
                <span className="font-label-caps text-label-caps uppercase tracking-wider text-secondary font-semibold">
                  Formula Codex
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-semibold">
                  Banking Mathematics &amp; Computational Formulas
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                  The governing equations standardized under Truth in Savings Act (Regulation DD) and Consumer Financial Protection Bureau regulations.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
                {/* Formula 1: APY */}
                <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm flex flex-col gap-space-sm border border-outline-variant/20">
                  <div className="flex items-center justify-between">
                    <span className="font-headline-md text-body-lg font-semibold text-on-surface">
                      Annual Percentage Yield (APY)
                    </span>
                    <span className="px-2 py-0.5 rounded bg-surface-container font-data-mono text-label-caps text-primary font-bold">
                      Reg DD § 1030
                    </span>
                  </div>
                  <div className="p-space-md rounded-xl bg-surface-container-high/60 font-data-mono text-body-md text-primary font-bold overflow-x-auto">
                    APY = (1 + r / n)<sup>n</sup> - 1
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Where <span className="font-data-mono text-on-surface font-medium">r</span> is the nominal stated APR as a decimal and{' '}
                    <span className="font-data-mono text-on-surface font-medium">n</span> is the number of compounding periods per year (typically 365 for daily compounding in modern high-yield accounts).
                  </p>
                </div>

                {/* Formula 2: Nominal APR */}
                <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm flex flex-col gap-space-sm border border-outline-variant/20">
                  <div className="flex items-center justify-between">
                    <span className="font-headline-md text-body-lg font-semibold text-on-surface">
                      Nominal Annual Percentage Rate (APR)
                    </span>
                    <span className="px-2 py-0.5 rounded bg-surface-container font-data-mono text-label-caps text-primary font-bold">
                      Reg Z Standard
                    </span>
                  </div>
                  <div className="p-space-md rounded-xl bg-surface-container-high/60 font-data-mono text-body-md text-primary font-bold overflow-x-auto">
                    APR = n × [ (1 + APY)<sup>(1 / n)</sup> - 1 ]
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Derived by reversing compounding intervals. Used to extract the non-compounded contract borrowing or baseline annual interest quote from an advertised consumer yield.
                  </p>
                </div>

                {/* Formula 3: Overdraft APR */}
                <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm flex flex-col gap-space-sm border border-outline-variant/20">
                  <div className="flex items-center justify-between">
                    <span className="font-headline-md text-body-lg font-semibold text-on-surface">
                      Overdraft Equivalent APR
                    </span>
                    <span className="px-2 py-0.5 rounded bg-surface-container font-data-mono text-label-caps text-error font-bold">
                      True Cost
                    </span>
                  </div>
                  <div className="p-space-md rounded-xl bg-surface-container-high/60 font-data-mono text-body-md text-error font-bold overflow-x-auto">
                    Overdraft APR = (Fee / Overdrawn Amount) × (365 / Days Negative) × 100
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Demonstrates why single transaction overdraft penalties act as hyper-usurious short-term credit. A $35 charge on a $70 deficit cured in 3 days produces an annualized rate of 6,083.33%.
                  </p>
                </div>

                {/* Formula 4: Compound Fee Erosion */}
                <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm flex flex-col gap-space-sm border border-outline-variant/20">
                  <div className="flex items-center justify-between">
                    <span className="font-headline-md text-body-lg font-semibold text-on-surface">
                      Compounded Fee Erosion (FV of Cost)
                    </span>
                    <span className="px-2 py-0.5 rounded bg-surface-container font-data-mono text-label-caps text-secondary font-bold">
                      Opportunity Cost
                    </span>
                  </div>
                  <div className="p-space-md rounded-xl bg-surface-container-high/60 font-data-mono text-body-md text-secondary font-bold overflow-x-auto">
                    FV<sub>fees</sub> = Fee × [ ((1 + r/12)<sup>12t</sup> - 1) / (r/12) ]
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Calculates the true future economic loss of recurring monthly bank fees by modeling what those charges would have grown to if left invested in an interest-bearing cash benchmark.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* EEAT & GOOGLE SEARCH OPTIMIZATION SECTION */}
          <section className="w-full max-w-[1280px] mx-auto px-gutter-desktop py-space-3xl">
            {/* Programmatic Balance & APY Matrix */}
            <div className="bg-surface-container-lowest p-space-xl rounded-2xl shadow-sm mb-space-2xl border border-outline-variant/20">
              <div className="flex flex-col gap-space-2xs mb-space-lg">
                <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-semibold">
                  Programmatic Liquidity Matrices
                </span>
                <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">
                  Annual Interest Yield by Cash Balance &amp; APY
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Explore pre-computed annual returns across standard consumer cash thresholds with daily compounding.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-body-sm text-body-sm">
                  <thead>
                    <tr className="bg-surface-container-low text-on-surface border-b border-surface-container">
                      <th className="py-space-xs px-space-md font-semibold">Deposit Balance</th>
                      <th className="py-space-xs px-space-md font-semibold text-on-surface-variant">Traditional (0.01%)</th>
                      <th className="py-space-xs px-space-md font-semibold text-primary">3.50% APY</th>
                      <th className="py-space-xs px-space-md font-semibold text-primary">4.00% APY</th>
                      <th className="py-space-xs px-space-md font-semibold text-primary">4.50% APY</th>
                      <th className="py-space-xs px-space-md font-semibold text-primary font-bold">5.00% APY</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container font-data-mono">
                    {[
                      { tier: '$500 Buffer', trad: '$0.05 / yr', p35: '$17.50 / yr', p40: '$20.00 / yr', p45: '$22.50 / yr', p50: '$25.00 / yr' },
                      { tier: '$2,000 Working Cash', trad: '$0.20 / yr', p35: '$70.00 / yr', p40: '$80.00 / yr', p45: '$90.00 / yr', p50: '$100.00 / yr' },
                      { tier: '$5,000 Emergency Fund', trad: '$0.50 / yr', p35: '$175.00 / yr', p40: '$200.00 / yr', p45: '$225.00 / yr', p50: '$250.00 / yr' },
                      { tier: '$10,000 Cash Reserve', trad: '$1.00 / yr', p35: '$350.00 / yr', p40: '$400.00 / yr', p45: '$450.00 / yr', p50: '$500.00 / yr' },
                      { tier: '$25,000 Liquid Pool', trad: '$2.50 / yr', p35: '$875.00 / yr', p40: '$1,000.00 / yr', p45: '$1,125.00 / yr', p50: '$1,250.00 / yr' },
                    ].map((row, i) => (
                      <tr key={i}>
                        <td className="py-space-xs px-space-md font-semibold text-on-surface">{row.tier}</td>
                        <td className="py-space-xs px-space-md text-outline">{row.trad}</td>
                        <td className="py-space-xs px-space-md text-on-surface">{row.p35}</td>
                        <td className="py-space-xs px-space-md text-on-surface">{row.p40}</td>
                        <td className="py-space-xs px-space-md text-on-surface">{row.p45}</td>
                        <td className="py-space-xs px-space-md text-primary font-bold">{row.p50}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Editorial Advisory & EEAT Verification Board */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg mb-space-2xl">
              <div className="bg-surface-container-low p-space-lg rounded-2xl flex items-start gap-space-md border border-outline-variant/20">
                <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0 font-bold font-data-mono">
                  DS
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-headline-md text-body-md font-bold text-on-surface">David Sterling, CRPC®</h4>
                    <span className="material-symbols-outlined text-primary text-[16px]">verified</span>
                  </div>
                  <span className="font-label-caps text-label-caps uppercase text-secondary font-semibold">
                    Lead Liquidity Auditor
                  </span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                    20+ years specializing in cash sweep optimization, broker-dealer depository networks, and personal wealth preservation models.
                  </p>
                </div>
              </div>

              <div className="bg-surface-container-low p-space-lg rounded-2xl flex items-start gap-space-md border border-outline-variant/20">
                <div className="w-12 h-12 rounded-xl bg-secondary text-on-secondary flex items-center justify-center shrink-0 font-bold font-data-mono">
                  SJ
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-headline-md text-body-md font-bold text-on-surface">Sarah Jenkins, CPA, CFP®</h4>
                    <span className="material-symbols-outlined text-secondary text-[16px]">verified</span>
                  </div>
                  <span className="font-label-caps text-label-caps uppercase text-secondary font-semibold">
                    Former FDIC Compliance Specialist
                  </span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                    Expert on Regulation DD, Truth in Savings compliance, deposit insurance thresholds, and consumer fee transparency standards.
                  </p>
                </div>
              </div>
            </div>

            {/* Comprehensive High-Intent FAQ Accordion */}
            <div className="flex flex-col gap-space-md">
              <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">
                Frequently Asked Banking &amp; Cash Questions
              </h3>
              <div className="space-y-space-xs">
                {[
                  {
                    q: 'How much cash should I keep in checking vs high-yield savings?',
                    a: 'Financial standard methodology suggests maintaining between 1.0 to 1.5 months of routine living expenditures in your operational checking account to safeguard against accidental overdrafts and accommodate billing float. Every dollar beyond this 30-to-45-day cushion should be automatically swept into a high-yield savings or cash management account earning top-tier APY (typically 4.0% to 5.0%+).',
                  },
                  {
                    q: 'What is the actual mathematical difference between APR and APY in banking?',
                    a: 'APR (Annual Percentage Rate) represents the nominal simple interest rate across a 365-day year without taking into account interest compounding. APY (Annual Percentage Yield) accounts for the frequency of compounding (daily, monthly, quarterly). Because daily compound interest generates interest on previously earned interest, an account with a 4.50% nominal APR compounded daily delivers an effective 4.60% APY.',
                  },
                  {
                    q: 'How can a simple $35 overdraft fee equal over 1,000% APR?',
                    a: 'APR calculates the cost of borrowing over an annualized duration. If your bank charges a $35 overdraft fee on a $50 negative balance and your direct deposit restores the balance in 7 days, you effectively paid $35 in interest for a 1-week $50 loan. Annualizing that 70% 7-day borrowing fee across 52.14 weeks yields an effective 3,650% APR.',
                  },
                  {
                    q: 'Are Cash Management Accounts (CMAs) as safe as FDIC-insured banks?',
                    a: 'Yes, provided the CMA uses an established program bank sweep. While the brokerage firm offering the CMA is protected under SIPC rather than FDIC, client cash is automatically swept into multiple participating chartered FDIC member institutions. This structure often allows CMAs to offer $2.5 million to $5 million in aggregate FDIC coverage (up to $250,000 per program bank), far surpassing standard bank caps.',
                  },
                  {
                    q: 'Can checking account monthly maintenance fees be waived permanently?',
                    a: 'Most brick-and-mortar banks waive their $10 to $25 monthly maintenance fee if you maintain a qualifying monthly direct deposit (usually $500 to $1,500) or keep a minimum daily balance ($1,500 to $5,000). However, modern online banks and Cash Management Accounts offer completely fee-free checking accounts with zero minimum balance requirements and no monthly maintenance charges under any circumstance.',
                  },
                ].map((item, index) => (
                  <details
                    key={index}
                    className="group bg-surface-container-lowest rounded-xl shadow-sm p-space-md [&_summary::-webkit-details-marker]:hidden cursor-pointer border border-outline-variant/20"
                  >
                    <summary className="flex items-center justify-between font-body-lg text-body-md font-semibold text-on-surface">
                      <span>{item.q}</span>
                      <span className="material-symbols-outlined text-outline group-open:rotate-180 transition-transform">
                        expand_more
                      </span>
                    </summary>
                    <div className="mt-space-sm font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                      {item.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
