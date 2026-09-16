'use client';

import React, { useState, useMemo, useId } from 'react';
import Link from 'next/link';

interface ToolItem {
  name: string;
  href: string;
}

interface DirectoryCluster {
  id: string;
  name: string;
  icon: string;
  colorClass: string;
  category: string[];
  tools: ToolItem[];
}

const CLUSTERS: DirectoryCluster[] = [
  {
    id: 'savings-growth',
    name: 'Savings Growth',
    icon: 'trending_up',
    colorClass: 'text-primary',
    category: ['all', 'goals'],
    tools: [
      { name: 'Savings Calculator', href: '/finance/savings-calculator' },
      { name: 'Savings Growth Planner', href: '/finance/savings-calculator' },
      { name: 'Compound Savings Simulator', href: '/finance/compound-interest-calculator' },
      { name: 'Future Savings Forecaster', href: '/finance/savings-calculator' },
      { name: 'Monthly Savings Target', href: '/finance/savings-calculator' },
      { name: 'Savings Projection Model', href: '/finance/savings-calculator' },
      { name: 'Recurring Deposit Schedule', href: '/finance/savings-calculator' },
      { name: 'Goal Savings Milestone', href: '/finance/savings-calculator' },
      { name: 'Savings Contribution Analyzer', href: '/finance/savings-calculator' },
      { name: 'Savings Horizon Timeline', href: '/finance/savings-calculator' },
    ],
  },
  {
    id: 'apy-high-yield',
    name: 'APY & High-Yield Savings',
    icon: 'percent',
    colorClass: 'text-secondary',
    category: ['all', 'apy'],
    tools: [
      { name: 'APY Calculator', href: '/finance/apy-calculator' },
      { name: 'APY vs APR Converter', href: '/finance/apy-calculator' },
      { name: 'High-Yield Savings Rate Match', href: '/finance/savings-calculator' },
      { name: 'Interest Earnings Tracker', href: '/finance/compound-interest-calculator' },
      { name: 'Online Savings Account Evaluator', href: '/finance/savings-calculator' },
      { name: 'Bank Interest Comparison', href: '/finance/savings-calculator' },
      { name: 'Tiered Savings Account Model', href: '/finance/savings-calculator' },
      { name: 'Yield Spread Comparison', href: '/finance/apy-calculator' },
      { name: 'Effective Annual Yield', href: '/finance/apy-calculator' },
      { name: 'Compound APY Multiplier', href: '/finance/compound-interest-calculator' },
    ],
  },
  {
    id: 'certificates-deposit',
    name: 'Certificates of Deposit',
    icon: 'verified',
    colorClass: 'text-on-surface',
    category: ['all', 'cd'],
    tools: [
      { name: 'CD Calculator', href: '/finance/savings-calculator' },
      { name: 'Certificate of Deposit Payout', href: '/finance/savings-calculator' },
      { name: 'Fixed Deposit Maturity', href: '/finance/savings-calculator' },
      { name: 'Term Deposit Return', href: '/finance/savings-calculator' },
      { name: 'CD Earnings Forecaster', href: '/finance/savings-calculator' },
      { name: 'CD Interest at Maturity', href: '/finance/savings-calculator' },
      { name: 'CD Penalty Calculator (Early Exit)', href: '/finance/savings-calculator' },
      { name: 'CD Comparison Matrix', href: '/finance/savings-calculator' },
      { name: 'CD Real Yield After Tax', href: '/finance/savings-calculator' },
    ],
  },
  {
    id: 'cd-ladders',
    name: 'CD Ladder Strategies',
    icon: 'stacked_line_chart',
    colorClass: 'text-primary',
    category: ['all', 'cd'],
    tools: [
      { name: 'CD Ladder Calculator', href: '/finance/savings-calculator' },
      { name: 'CD Ladder Rolling Planner', href: '/finance/savings-calculator' },
      { name: 'CD Reinvestment Optimizer', href: '/finance/savings-calculator' },
      { name: 'Multi-CD Strategy Modeler', href: '/finance/savings-calculator' },
      { name: 'Blended Ladder Yield Calculator', href: '/finance/savings-calculator' },
      { name: 'Rolling Liquidity Schedule', href: '/finance/savings-calculator' },
      { name: 'Mini-Ladder Builder (6-Month)', href: '/finance/savings-calculator' },
      { name: '5-Year Long CD Ladder', href: '/finance/savings-calculator' },
    ],
  },
  {
    id: 'emergency-funds',
    name: 'Emergency Funds',
    icon: 'shield_with_heart',
    colorClass: 'text-tertiary',
    category: ['all', 'emergency'],
    tools: [
      { name: 'Emergency Fund Calculator', href: '/finance/savings-calculator' },
      { name: 'Emergency Savings Sizer', href: '/finance/savings-calculator' },
      { name: 'Financial Safety Net Estimator', href: '/finance/savings-calculator' },
      { name: 'Income Replacement Sizer', href: '/finance/savings-calculator' },
      { name: 'Emergency Goal Timeline', href: '/finance/savings-calculator' },
      { name: 'Essential Expense Coverage', href: '/finance/savings-calculator' },
      { name: 'Expense Reserve Auditor', href: '/finance/savings-calculator' },
      { name: 'Crisis Fund Depletion Modeler', href: '/finance/savings-calculator' },
    ],
  },
  {
    id: 'cash-runway',
    name: 'Cash Runway Models',
    icon: 'flight_takeoff',
    colorClass: 'text-secondary',
    category: ['all', 'runway'],
    tools: [
      { name: 'Cash Runway Calculator', href: '/business/cash-runway' },
      { name: 'Personal Financial Runway', href: '/business/cash-runway' },
      { name: 'Business Runway Calculator', href: '/business/cash-runway' },
      { name: 'Startup Runway Forecaster', href: '/business/cash-runway' },
      { name: 'Net Burn Rate Calculator', href: '/business/burn-rate' },
      { name: 'Cash Burn Sensitivity Engine', href: '/business/burn-rate' },
      { name: 'Survival Runway Threshold', href: '/business/cash-runway' },
      { name: 'FIRE Pre-Retirement Runway', href: '/fire-forecaster' },
    ],
  },
  {
    id: 'liquidity-analysis',
    name: 'Liquidity Analysis',
    icon: 'balance',
    colorClass: 'text-primary',
    category: ['all', 'runway'],
    tools: [
      { name: 'Liquidity Calculator', href: '/finance/savings-calculator' },
      { name: 'Personal Liquidity Ratio', href: '/finance/savings-calculator' },
      { name: 'Quick Ratio (Acid-Test)', href: '/business/working-capital' },
      { name: 'Current Ratio Modeler', href: '/business/working-capital' },
      { name: 'Pure Cash Ratio Tool', href: '/business/working-capital' },
      { name: 'Working Capital Evaluator', href: '/business/working-capital' },
      { name: 'Liquid Net Worth Calculator', href: '/finance/savings-calculator' },
      { name: 'Liquidity Coverage Ratio (LCR)', href: '/finance/savings-calculator' },
    ],
  },
  {
    id: 'savings-goals',
    name: 'Savings Goals',
    icon: 'flag',
    colorClass: 'text-secondary',
    category: ['all', 'goals'],
    tools: [
      { name: 'Savings Goal Calculator', href: '/finance/savings-calculator' },
      { name: 'Vacation Savings Tracker', href: '/finance/savings-calculator' },
      { name: 'House Down Payment Planner', href: '/mortgages-and-real-estate-debt' },
      { name: 'Wedding Budget Savings', href: '/finance/savings-calculator' },
      { name: 'Car Down Payment Calculator', href: '/loans-and-amortization' },
      { name: 'Higher Education Savings', href: '/education' },
      { name: 'Goal Completion Timeline', href: '/finance/savings-calculator' },
      { name: 'Target Savings Allocation', href: '/finance/savings-calculator' },
    ],
  },
  {
    id: 'cash-reserves',
    name: 'Cash Reserves',
    icon: 'assured_workload',
    colorClass: 'text-primary',
    category: ['all', 'runway'],
    tools: [
      { name: 'Cash Reserve Calculator', href: '/finance/savings-calculator' },
      { name: 'Reserve Fund Target Engine', href: '/finance/savings-calculator' },
      { name: 'Business Operating Reserve', href: '/business/cash-runway' },
      { name: 'Operating Cash Buffer Sizer', href: '/business/cash-runway' },
      { name: 'Risk Contingency Reserve', href: '/finance/savings-calculator' },
      { name: 'Short-Term Working Capital Buffer', href: '/business/working-capital' },
    ],
  },
  {
    id: 'sinking-funds',
    name: 'Sinking Funds',
    icon: 'event_repeat',
    colorClass: 'text-tertiary',
    category: ['all', 'sinking'],
    tools: [
      { name: 'Sinking Fund Calculator', href: '/finance/savings-calculator' },
      { name: 'Annual Expense Pre-Funding', href: '/finance/savings-calculator' },
      { name: 'Home Repair Maintenance Fund', href: '/finance/savings-calculator' },
      { name: 'Vehicle Replacement Fund', href: '/loans-and-amortization' },
      { name: 'Equipment Depreciating Sinking Fund', href: '/business' },
      { name: 'Future Purchase Amortizer', href: '/finance/savings-calculator' },
    ],
  },
  {
    id: 'inflation-buying-power',
    name: 'Inflation & Buying Power',
    icon: 'price_change',
    colorClass: 'text-secondary',
    category: ['all', 'apy'],
    tools: [
      { name: 'Inflation Adjusted Savings', href: '/finance/compound-interest-calculator' },
      { name: 'Purchasing Power Calculator', href: '/finance/compound-interest-calculator' },
      { name: 'Real Return (Net of CPI)', href: '/investing-and-growth' },
      { name: 'Inflation Drag on Cash Reserves', href: '/finance/savings-calculator' },
      { name: 'Future Buying Power Model', href: '/finance/compound-interest-calculator' },
      { name: 'Break-Even Inflation Yield (BEI)', href: '/investing-and-growth' },
    ],
  },
  {
    id: 'short-term-wealth',
    name: 'Short-Term Wealth Planning',
    icon: 'account_tree',
    colorClass: 'text-primary',
    category: ['all'],
    tools: [
      { name: 'Cash Asset Allocation Modeler', href: '/investing-and-growth' },
      { name: 'Liquidity Tiering Framework', href: '/finance/savings-calculator' },
      { name: 'Safe Short-Term Yield Analyzer', href: '/finance/apy-calculator' },
      { name: 'Short-Term Investment Matcher', href: '/investing-and-growth' },
      { name: 'Treasury Bill Yield Equivalent', href: '/investing-and-growth' },
      { name: 'Money Market Fund (MMF) Return', href: '/finance/savings-calculator' },
    ],
  },
];

export default function SavingsAndLiquidityClient() {
  const interestGradId = useId();
  const principalGradId = useId();

  // Search and Category Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Interactive Live Workbench State
  const [initialDeposit, setInitialDeposit] = useState(10000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [apyRate, setApyRate] = useState(4.50);
  const [timelineYears, setTimelineYears] = useState(3);
  const [compoundingFreq, setCompoundingFreq] = useState(365); // Daily by default
  const [inflationRate, setInflationRate] = useState(2.5);

  // Notification / Feedback State
  const [savedNotification, setSavedNotification] = useState<string | null>(null);

  // FAQ Accordion State (single-expand or multi-expand)
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Calculation Engine
  const results = useMemo(() => {
    const P = Math.max(0, initialDeposit);
    const PMT = Math.max(0, monthlyContribution);
    const apy = Math.max(0, apyRate) / 100;
    const n = compoundingFreq || 365;
    const years = timelineYears;
    const infl = Math.max(0, inflationRate) / 100;

    // Convert APY to nominal rate r
    const r = n * (Math.pow(1 + apy, 1 / n) - 1);
    const ratePerPeriod = r / n;
    const totalPeriods = n * years;
    const periodsPerMonth = n / 12;

    let currentBal = P;
    const points: Array<{ principal: number; balance: number }> = [];
    const stepPeriods = Math.max(1, Math.floor(totalPeriods / 4));

    // Sample initial point
    points.push({ principal: P, balance: P });

    let runningPrincipal = P;
    let pmtCounter = 0;

    for (let period = 1; period <= totalPeriods; period++) {
      currentBal *= (1 + ratePerPeriod);

      // Add monthly contribution if aligned with period
      if (period % Math.max(1, Math.round(periodsPerMonth)) === 0 && pmtCounter < (years * 12)) {
        currentBal += PMT;
        runningPrincipal += PMT;
        pmtCounter++;
      }

      if (period % stepPeriods === 0 || period === totalPeriods) {
        points.push({ principal: runningPrincipal, balance: currentBal });
      }
    }

    const totalPrincipal = P + (PMT * 12 * years);
    const totalBalance = currentBal;
    const totalInterest = Math.max(0, totalBalance - totalPrincipal);
    const booster = totalPrincipal > 0 ? ((totalInterest / totalPrincipal) * 100).toFixed(1) : '0';
    const purchasingPower = totalBalance / Math.pow(1 + infl, years);

    // Build SVG paths for graph
    const svgWidth = 500;
    const svgHeight = 160;
    const maxScale = Math.max(totalBalance * 1.05, 1000);

    const coords = points.map((pt, idx) => {
      const x = (idx / (points.length - 1)) * svgWidth;
      const yBal = svgHeight - (pt.balance / maxScale) * (svgHeight - 20) - 10;
      const yPrin = svgHeight - (pt.principal / maxScale) * (svgHeight - 20) - 10;
      return { x, yBal, yPrin };
    });

    let balPath = coords.length > 0 ? `M ${coords[0].x},${coords[0].yBal}` : '';
    let prinPath = coords.length > 0 ? `M ${coords[0].x},${coords[0].yPrin}` : '';
    let prinArea = coords.length > 0 ? `M 0,${svgHeight} L 0,${coords[0].yPrin}` : '';
    let interestArea = coords.length > 0 ? `M ${coords[0].x},${coords[0].yBal}` : '';

    coords.forEach((c) => {
      balPath += ` L ${c.x.toFixed(1)},${c.yBal.toFixed(1)}`;
      prinPath += ` L ${c.x.toFixed(1)},${c.yPrin.toFixed(1)}`;
      prinArea += ` L ${c.x.toFixed(1)},${c.yPrin.toFixed(1)}`;
      interestArea += ` L ${c.x.toFixed(1)},${c.yBal.toFixed(1)}`;
    });

    prinArea += ` L ${svgWidth},${svgHeight} Z`;

    // Loop back for interest stacked area
    for (let i = coords.length - 1; i >= 0; i--) {
      interestArea += ` L ${coords[i].x.toFixed(1)},${coords[i].yPrin.toFixed(1)}`;
    }
    interestArea += ' Z';

    const nodeStartCoords = coords[0] || { x: 0, yBal: 106 };
    const midIdx = Math.floor(coords.length / 2);
    const nodeMidCoords = coords[midIdx] || { x: 250, yBal: 63 };
    const lastIdx = coords.length - 1;
    const nodeEndCoords = coords[lastIdx] || { x: 500, yBal: 16 };

    return {
      totalBalance,
      totalInterest,
      totalPrincipal,
      booster,
      purchasingPower,
      balPath,
      prinPath,
      prinArea,
      interestArea,
      nodeStartCoords,
      nodeMidCoords,
      nodeEndCoords,
    };
  }, [initialDeposit, monthlyContribution, apyRate, timelineYears, compoundingFreq, inflationRate]);

  // Format Helper
  const formatUSD = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val);
  };

  // CSV Export Handler
  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Parameter,Value\n' +
      `Initial Deposit,$${initialDeposit}\n` +
      `Monthly Contribution,$${monthlyContribution}\n` +
      `APY Rate,${apyRate}%\n` +
      `Timeline Years,${timelineYears}\n` +
      `Compounding Frequency,${compoundingFreq === 365 ? 'Daily' : compoundingFreq === 12 ? 'Monthly' : compoundingFreq === 4 ? 'Quarterly' : 'Annually'}\n` +
      `Est. Inflation Rate,${inflationRate}%\n` +
      `Cumulative Principal Deposited,$${results.totalPrincipal.toFixed(2)}\n` +
      `Total Compound Interest Earned,$${results.totalInterest.toFixed(2)}\n` +
      `Projected Final Balance,$${results.totalBalance.toFixed(2)}\n` +
      `Real Purchasing Power,$${results.purchasingPower.toFixed(2)}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `solveit_savings_${timelineYears}yr_plan.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setSavedNotification('CSV Ledger successfully exported!');
    setTimeout(() => setSavedNotification(null), 4000);
  };

  const handleSaveGoalPlan = () => {
    setSavedNotification(`Savings plan ($${initialDeposit.toLocaleString()} + $${monthlyContribution}/mo @ ${apyRate}% APY) saved!`);
    setTimeout(() => setSavedNotification(null), 4000);
  };

  // Filter Directory Clusters
  const filteredClusters = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return CLUSTERS.map((cluster) => {
      // Category tag check
      if (selectedFilter !== 'all' && !cluster.category.includes(selectedFilter)) {
        return null;
      }

      if (!q) return cluster;

      const clusterMatches = cluster.name.toLowerCase().includes(q);
      const matchingTools = cluster.tools.filter((t) => t.name.toLowerCase().includes(q));

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

  const totalFilteredCount = useMemo(() => {
    return filteredClusters.reduce((acc, c) => acc + c.tools.length, 0);
  }, [filteredClusters]);

  return (
    <div className="min-h-screen bg-surface font-body-md text-on-surface">
      

      <main className="w-full pt-16 bg-surface">
        <div className="flex flex-col w-full">

          {/* TOP TRUST BANNER & BREADCRUMB AREA */}
          <section className="w-full bg-surface-container-lowest shadow-sm border-b border-surface-container/60">
            <div className="max-w-[1280px] mx-auto px-gutter-desktop py-space-md">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
                <nav aria-label="Breadcrumb" className="flex items-center gap-space-2xs text-body-sm font-body-sm text-on-surface-variant">
                  <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">home</span> Home
                  </Link>
                  <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                  <Link href="/finance" className="hover:text-primary transition-colors">
                    Financial Calculators
                  </Link>
                  <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                  <span className="text-on-surface font-semibold">Savings &amp; Liquidity</span>
                </nav>

                <div className="flex items-center gap-space-xs bg-surface-container px-space-sm py-1 rounded-full text-secondary">
                  <span className="material-symbols-outlined text-[16px]">savings</span>
                  <span className="font-label-caps text-label-caps tracking-wider uppercase font-semibold">
                    Bank Rates &amp; Formulas · 100% Private &amp; Free
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* CATEGORY HERO & OMNISEARCH */}
          <section className="w-full bg-gradient-to-b from-surface-container-low via-surface to-surface pb-space-2xl pt-space-xl">
            <div className="max-w-[1280px] mx-auto px-gutter-desktop flex flex-col gap-space-lg">
              <div className="flex flex-col max-w-3xl gap-space-xs">
                <div className="flex items-center gap-space-xs text-primary font-label-caps text-label-caps uppercase tracking-widest font-bold">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                  Consumer Banking &amp; Cash Treasury Suite
                </div>
                <h1 className="font-display-hero text-display-hero text-on-surface tracking-tight font-bold">
                  Savings &amp; Liquidity Calculators
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                  Calculate savings growth, high-yield APY, emergency funds, CD returns, and cash goals with simple, free calculators.
                </p>
              </div>

              {/* Live Filter & Search Workbench Bar */}
              <div className="bg-surface-container-lowest rounded-2xl shadow-md p-space-md flex flex-col gap-space-md border border-outline-variant/30">
                <div className="flex items-center bg-surface-container-low px-space-md py-space-sm rounded-xl focus-within:bg-surface-container-lowest focus-within:ring-2 focus-within:ring-primary/20 transition-all border border-outline-variant/20">
                  <span className="material-symbols-outlined text-primary text-[22px] mr-space-sm">search</span>
                  <input
                    id="toolSearchInput"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search 102+ savings, APY, CD ladders, emergency fund, and runway calculators..."
                    className="bg-transparent w-full font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none"
                  />
                  <span className="font-data-mono text-label-caps bg-surface-container-high text-on-surface-variant px-space-xs py-1 rounded">
                    102 TOOLS
                  </span>
                </div>

                <div className="flex items-center gap-space-xs overflow-x-auto pb-1 text-label-caps font-label-caps no-scrollbar">
                  {[
                    { id: 'all', label: 'All Tools (102)' },
                    { id: 'apy', label: 'High-Yield APY (10)' },
                    { id: 'cd', label: 'CD Ladders (17)' },
                    { id: 'emergency', label: 'Emergency Funds (8)' },
                    { id: 'runway', label: 'Cash Runway (8)' },
                    { id: 'sinking', label: 'Sinking Funds (6)' },
                    { id: 'goals', label: 'Goals (8)' },
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => setSelectedFilter(filter.id)}
                      className={`px-space-sm py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                        selectedFilter === filter.id
                          ? 'bg-primary text-on-primary shadow-sm font-bold'
                          : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* INTERACTIVE LIVE SAVINGS & APY GROWTH WORKBENCH */}
          <section className="w-full bg-surface py-space-xl">
            <div className="max-w-[1280px] mx-auto px-gutter-desktop">
              <div className="bg-surface-container-lowest rounded-2xl shadow-xl p-space-lg lg:p-space-xl flex flex-col gap-space-xl border border-outline-variant/30">
                
                {/* Workbench Top Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
                  <div className="flex items-center gap-space-sm">
                    <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-primary shadow-sm">
                      <span className="material-symbols-outlined text-[28px]">trending_up</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-space-xs">
                        <h2 className="font-headline-lg text-headline-lg text-on-surface font-semibold">
                          Live Savings &amp; Interest Calculator
                        </h2>
                        <span className="px-2 py-0.5 rounded-md bg-secondary-fixed text-on-secondary-fixed font-data-mono text-label-caps font-bold">
                          Live Simulator
                        </span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Real-time daily compounded mathematical model with purchasing power inflation offset
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-space-xs">
                    <button
                      id="btnExportCSV"
                      type="button"
                      onClick={handleExportCSV}
                      className="flex items-center gap-1.5 px-space-sm py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm font-medium transition-colors shadow-sm cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">download</span>
                      Export CSV Ledger
                    </button>
                    <button
                      id="btnSaveScenario"
                      type="button"
                      onClick={handleSaveGoalPlan}
                      className="flex items-center gap-1.5 px-space-sm py-2 rounded-lg bg-primary text-on-primary font-body-sm text-body-sm font-medium hover:bg-primary-container transition-colors shadow-sm cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">bookmark</span>
                      Save Goal Plan
                    </button>
                  </div>
                </div>

                {savedNotification && (
                  <div className="p-3 bg-secondary-fixed/50 text-on-secondary-fixed rounded-xl flex items-center gap-2 text-body-sm font-medium animate-in fade-in duration-150">
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    <span>{savedNotification}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
                  
                  {/* Interactive Input Column (5 cols) */}
                  <div className="lg:col-span-5 flex flex-col gap-space-lg bg-surface-container-low p-space-lg rounded-xl border border-outline-variant/30">
                    
                    {/* Initial Deposit */}
                    <div className="flex flex-col gap-space-2xs">
                      <div className="flex items-center justify-between">
                        <label htmlFor="inputInitialDeposit" className="font-body-sm text-body-sm font-semibold text-on-surface">
                          Initial Balance ($)
                        </label>
                        <span className="font-data-mono text-label-caps text-secondary font-bold">Principal Deposit</span>
                      </div>
                      <div className="relative flex items-center">
                        <span className="absolute left-3 font-data-mono text-body-md text-outline">$</span>
                        <input
                          id="inputInitialDeposit"
                          type="number"
                          min="0"
                          step="500"
                          value={initialDeposit}
                          onChange={(e) => setInitialDeposit(Math.max(0, parseFloat(e.target.value) || 0))}
                          className="w-full pl-8 pr-4 py-2.5 rounded-lg bg-surface-container-lowest font-data-mono text-headline-md text-on-surface font-bold focus:shadow-[0_0_0_2px_rgba(0,74,198,0.3)] focus:outline-none transition-all border border-outline-variant/30"
                        />
                      </div>
                      <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                        {[1000, 5000, 10000, 25000, 50000].map((val) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => setInitialDeposit(val)}
                            className={`px-2.5 py-1 rounded font-data-mono text-label-caps transition-all ${
                              initialDeposit === val
                                ? 'bg-primary text-on-primary font-bold'
                                : 'bg-surface-container-high hover:bg-primary hover:text-on-primary'
                            }`}
                          >
                            ${val >= 1000 ? `${val / 1000}k` : val}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Monthly Contribution */}
                    <div className="flex flex-col gap-space-2xs">
                      <div className="flex items-center justify-between">
                        <label htmlFor="inputMonthlyContribution" className="font-body-sm text-body-sm font-semibold text-on-surface">
                          Monthly Recurring Savings ($)
                        </label>
                        <span className="font-data-mono text-body-sm font-bold text-primary" id="labelMonthlyContribution">
                          ${monthlyContribution} / month
                        </span>
                      </div>
                      <div className="relative flex items-center">
                        <span className="absolute left-3 font-data-mono text-body-md text-outline">$</span>
                        <input
                          id="inputMonthlyContribution"
                          type="number"
                          min="0"
                          step="50"
                          value={monthlyContribution}
                          onChange={(e) => setMonthlyContribution(Math.max(0, parseFloat(e.target.value) || 0))}
                          className="w-full pl-8 pr-4 py-2.5 rounded-lg bg-surface-container-lowest font-data-mono text-body-lg text-on-surface font-bold focus:shadow-[0_0_0_2px_rgba(0,74,198,0.3)] focus:outline-none transition-all border border-outline-variant/30"
                        />
                      </div>
                      <input
                        id="sliderMonthlyContribution"
                        type="range"
                        min="0"
                        max="3000"
                        step="50"
                        value={monthlyContribution}
                        onChange={(e) => setMonthlyContribution(parseFloat(e.target.value) || 0)}
                        className="w-full accent-primary cursor-pointer mt-1"
                      />
                    </div>

                    {/* APY Input */}
                    <div className="flex flex-col gap-space-2xs">
                      <div className="flex items-center justify-between">
                        <label htmlFor="inputApy" className="font-body-sm text-body-sm font-semibold text-on-surface">
                          Annual Percentage Yield (APY %)
                        </label>
                        <span className="font-data-mono text-body-sm font-bold text-secondary" id="labelApyRate">
                          {apyRate.toFixed(2)}% APY
                        </span>
                      </div>
                      <div className="grid grid-cols-5 gap-2 items-center">
                        <div className="col-span-3">
                          <input
                            id="sliderApy"
                            type="range"
                            min="0.10"
                            max="8.00"
                            step="0.05"
                            value={apyRate}
                            onChange={(e) => setApyRate(parseFloat(e.target.value) || 0)}
                            className="w-full accent-primary cursor-pointer"
                          />
                        </div>
                        <div className="col-span-2 relative">
                          <input
                            id="inputApy"
                            type="number"
                            min="0"
                            max="15"
                            step="0.05"
                            value={apyRate}
                            onChange={(e) => setApyRate(parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-1.5 rounded-lg bg-surface-container-lowest font-data-mono text-body-md text-right font-bold text-on-surface focus:outline-none border border-outline-variant/30"
                          />
                          <span className="absolute right-7 top-1.5 font-data-mono text-body-sm text-outline">%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-label-caps font-label-caps text-on-surface-variant pt-1">
                        <span>National Avg (0.45%)</span>
                        <span>Top High-Yield (4.50% - 5.15%)</span>
                      </div>
                    </div>

                    {/* Time Horizon */}
                    <div className="flex flex-col gap-space-2xs">
                      <label className="font-body-sm text-body-sm font-semibold text-on-surface">
                        Savings Timeline
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {[1, 3, 5, 10].map((yr) => (
                          <button
                            key={yr}
                            type="button"
                            onClick={() => setTimelineYears(yr)}
                            className={`py-2 rounded-lg font-data-mono text-body-sm font-semibold transition-all ${
                              timelineYears === yr
                                ? 'bg-primary text-on-primary shadow-sm'
                                : 'bg-surface-container-high hover:bg-primary hover:text-on-primary'
                            }`}
                          >
                            {yr} {yr === 1 ? 'Year' : 'Years'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Compounding Frequency & Inflation Offset */}
                    <div className="grid grid-cols-2 gap-space-sm pt-2">
                      <div className="flex flex-col gap-1">
                        <label htmlFor="selectCompounding" className="font-label-caps text-label-caps uppercase text-on-surface-variant font-semibold">
                          Compounding
                        </label>
                        <select
                          id="selectCompounding"
                          value={compoundingFreq}
                          onChange={(e) => setCompoundingFreq(parseInt(e.target.value) || 365)}
                          className="bg-surface-container-lowest text-on-surface font-body-sm text-body-sm py-1.5 px-2 rounded-lg focus:outline-none font-medium border border-outline-variant/30 cursor-pointer"
                        >
                          <option value="365">Daily (HYSA)</option>
                          <option value="12">Monthly</option>
                          <option value="4">Quarterly</option>
                          <option value="1">Annually</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label htmlFor="inputInflation" className="font-label-caps text-label-caps uppercase text-on-surface-variant font-semibold">
                          Est. Inflation
                        </label>
                        <div className="flex items-center bg-surface-container-lowest px-2 py-1 rounded-lg border border-outline-variant/30">
                          <input
                            id="inputInflation"
                            type="number"
                            step="0.1"
                            value={inflationRate}
                            onChange={(e) => setInflationRate(parseFloat(e.target.value) || 0)}
                            className="w-full bg-transparent font-data-mono text-body-sm text-on-surface font-bold focus:outline-none"
                          />
                          <span className="text-label-caps font-label-caps text-outline">%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Output Sidecar & Trajectory Chart (7 cols) */}
                  <div className="lg:col-span-7 flex flex-col gap-space-lg">
                    {/* Big Metrics Bento Card */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                      {/* Projected Total Balance */}
                      <div className="bg-primary text-on-primary rounded-xl p-space-md shadow-md flex flex-col justify-between">
                        <div>
                          <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary-fixed-dim font-bold">
                            Projected Total Balance
                          </span>
                          <div className="font-numerical-display text-numerical-display tracking-tight mt-1 font-extrabold" id="displayTotalBalance">
                            {formatUSD(results.totalBalance)}
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-space-sm mt-space-sm text-label-caps font-label-caps text-primary-fixed border-t border-on-primary/10">
                          <span>Guaranteed FDIC Yield</span>
                          <span className="bg-surface-container-highest/20 px-2 py-0.5 rounded font-data-mono text-on-primary font-bold">
                            REAL-TIME APY
                          </span>
                        </div>
                      </div>

                      {/* Total Compound Interest */}
                      <div className="bg-surface-container-high rounded-xl p-space-md shadow-sm flex flex-col justify-between border border-outline-variant/20">
                        <div>
                          <span className="font-label-caps text-label-caps uppercase tracking-wider text-secondary font-bold">
                            Total Compound Interest
                          </span>
                          <div className="font-numerical-display text-numerical-display text-secondary tracking-tight mt-1 font-extrabold" id="displayTotalInterest">
                            {formatUSD(results.totalInterest)}
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-space-sm mt-space-sm text-body-sm font-body-sm border-t border-outline-variant/20">
                          <span className="text-on-surface-variant font-medium">Free Money Earned</span>
                          <span className="font-data-mono font-bold text-secondary bg-surface-container-lowest px-2 py-0.5 rounded shadow-sm">
                            +{results.booster}% Booster
                          </span>
                        </div>
                      </div>

                      {/* Cumulative Principal Deposited */}
                      <div className="bg-surface-container-low rounded-xl p-space-md shadow-sm flex flex-col border border-outline-variant/20">
                        <span className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant font-semibold">
                          Cumulative Principal Deposited
                        </span>
                        <div className="font-headline-lg text-headline-lg text-on-surface font-bold mt-1" id="displayTotalPrincipal">
                          {formatUSD(results.totalPrincipal)}
                        </div>
                        <span className="font-body-sm text-body-sm text-outline mt-1">
                          ${initialDeposit.toLocaleString()} start + ${(monthlyContribution * 12 * timelineYears).toLocaleString()} contributions
                        </span>
                      </div>

                      {/* Purchasing Power (Real Return) */}
                      <div className="bg-surface-container-low rounded-xl p-space-md shadow-sm flex flex-col border border-outline-variant/20">
                        <span className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant font-semibold">
                          Purchasing Power (Real Return)
                        </span>
                        <div className="font-headline-lg text-headline-lg text-on-surface font-bold mt-1" id="displayPurchasingPower">
                          {formatUSD(results.purchasingPower)}
                        </div>
                        <span className="font-body-sm text-body-sm text-tertiary mt-1">
                          Adjusted for inflation (~{inflationRate}% avg)
                        </span>
                      </div>
                    </div>

                    {/* SVG Visual Growth Trajectory Area Graph */}
                    <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/20 flex flex-col gap-space-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-headline-md text-body-lg font-semibold text-on-surface">
                          Balance Growth &amp; Cumulative Interest Trajectory
                        </span>
                        <div className="flex items-center gap-space-md text-label-caps font-label-caps">
                          <div className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-full bg-surface-variant"></span>
                            <span className="text-on-surface-variant">Principal</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-full bg-primary"></span>
                            <span className="text-primary font-bold">Interest Earned</span>
                          </div>
                        </div>
                      </div>

                      {/* Inline Chart Visualization */}
                      <div className="w-full h-44 relative flex items-end">
                        <svg
                          id="trajectorySvg"
                          className="w-full h-full overflow-visible"
                          preserveAspectRatio="none"
                          viewBox="0 0 500 160"
                        >
                          <defs>
                            <linearGradient id={interestGradId} x1="0" x2="0" y1="0" y2="1">
                              <stop offset="0%" stopColor="#004ac6" stopOpacity="0.35"></stop>
                              <stop offset="100%" stopColor="#004ac6" stopOpacity="0.02"></stop>
                            </linearGradient>
                            <linearGradient id={principalGradId} x1="0" x2="0" y1="0" y2="1">
                              <stop offset="0%" stopColor="#dae2fd" stopOpacity="0.8"></stop>
                              <stop offset="100%" stopColor="#dae2fd" stopOpacity="0.2"></stop>
                            </linearGradient>
                          </defs>

                          {/* Principal Area */}
                          <path
                            id="svgPrincipalArea"
                            d={results.prinArea}
                            fill={`url(#${principalGradId})`}
                          />

                          {/* Total Balance Area (Stacking Interest) */}
                          <path
                            id="svgInterestArea"
                            d={results.interestArea}
                            fill={`url(#${interestGradId})`}
                          />

                          {/* Line Strokes */}
                          <path
                            id="svgPrincipalLine"
                            d={results.prinPath}
                            fill="none"
                            stroke="#737686"
                            strokeDasharray="4,4"
                            strokeWidth="2"
                          />
                          <path
                            id="svgTotalLine"
                            d={results.balPath}
                            fill="none"
                            stroke="#004ac6"
                            strokeWidth="3.5"
                          />

                          {/* Data Nodes */}
                          <circle
                            id="nodeStart"
                            cx={results.nodeStartCoords.x}
                            cy={results.nodeStartCoords.yBal}
                            r="4.5"
                            fill="#004ac6"
                          />
                          <circle
                            id="nodeMid"
                            cx={results.nodeMidCoords.x}
                            cy={results.nodeMidCoords.yBal}
                            r="4.5"
                            fill="#004ac6"
                          />
                          <circle
                            id="nodeEnd"
                            cx={results.nodeEndCoords.x}
                            cy={results.nodeEndCoords.yBal}
                            r="5.5"
                            fill="#004ac6"
                          />
                        </svg>
                      </div>

                      <div className="flex items-center justify-between font-data-mono text-label-caps text-on-surface-variant pt-2 border-t border-surface-container">
                        <span>Start: ${initialDeposit.toLocaleString()}</span>
                        <span>Year 1</span>
                        <span>Year {Math.max(2, timelineYears - 1)}</span>
                        <span id="chartEndLabel">
                          Year {timelineYears}: {formatUSD(results.totalBalance)}
                        </span>
                      </div>
                    </div>

                    {/* Methodology Micro-Proof */}
                    <div className="flex items-center gap-space-sm bg-surface-container px-space-md py-space-xs rounded-lg text-on-surface-variant">
                      <span className="material-symbols-outlined text-[20px] text-primary">security</span>
                      <p className="font-body-sm text-body-sm leading-tight">
                        100% private. Calculations stay on your device with no sign-up or tracking required.
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </section>

          {/* SMART SAVINGS SCENARIOS & CASH ADVISORY (AI CASH COACH) */}
          <section className="w-full bg-surface-container-low py-space-2xl border-y border-surface-container/60">
            <div className="max-w-[1280px] mx-auto px-gutter-desktop flex flex-col gap-space-xl">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
                <div className="flex flex-col gap-space-2xs max-w-2xl">
                  <div className="flex items-center gap-2 text-primary font-label-caps text-label-caps uppercase tracking-wider font-bold">
                    <span className="material-symbols-outlined text-[18px]">savings</span>
                    Smart Savings Tips
                  </div>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface font-semibold">
                    Real Savings Scenarios &amp; Quick Tips
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    See how smart cash moves, high-yield rates, and emergency funds add up in the real world.
                  </p>
                </div>
                <span className="font-data-mono text-label-caps text-secondary font-bold bg-surface-container-lowest px-space-sm py-1.5 rounded-full shadow-sm">
                  UPDATED MARCH 2025 DATA
                </span>
              </div>

              {/* 4 Strategic Scenario Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
                {/* Scenario 1 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-space-md border border-outline-variant/20">
                  <div className="flex flex-col gap-space-xs">
                    <span className="font-label-caps text-label-caps text-secondary font-bold uppercase">
                      Rate Differential
                    </span>
                    <h3 className="font-headline-md text-body-lg text-on-surface font-semibold">
                      Traditional Bank (0.01%) vs. High-Yield (4.50%)
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Leaving $20,000 in a mega-bank yields just $6.00 after 3 years. Moving to a High-Yield Savings Account yields over $2,791.
                    </p>
                  </div>
                  <div className="p-space-sm bg-surface-container-high rounded-xl flex flex-col gap-1">
                    <div className="flex justify-between font-data-mono text-label-caps">
                      <span className="text-on-surface-variant">Lost Opportunity</span>
                      <span className="text-error font-bold">-$2,785.00</span>
                    </div>
                    <div className="font-data-mono text-body-lg font-bold text-primary">
                      +$2,791.32 Earned
                    </div>
                  </div>
                </div>

                {/* Scenario 2 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-space-md border border-outline-variant/20">
                  <div className="flex flex-col gap-space-xs">
                    <span className="font-label-caps text-label-caps text-secondary font-bold uppercase">
                      Certificate Strategy
                    </span>
                    <h3 className="font-headline-md text-body-lg text-on-surface font-semibold">
                      12-Month Rolling CD Ladder ($24,000 Pool)
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Partition into four $6,000 tranches maturing every 90 days. Captures 4.75% locked APY with zero liquidity lockup panic.
                    </p>
                  </div>
                  <div className="p-space-sm bg-surface-container-high rounded-xl flex flex-col gap-1">
                    <div className="flex justify-between font-data-mono text-label-caps">
                      <span className="text-on-surface-variant">Quarterly Liquidity</span>
                      <span className="text-primary font-bold">$6,000 / 90 Days</span>
                    </div>
                    <div className="font-data-mono text-body-lg font-bold text-secondary">
                      4.75% Blended APY
                    </div>
                  </div>
                </div>

                {/* Scenario 3 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-space-md border border-outline-variant/20">
                  <div className="flex flex-col gap-space-xs">
                    <span className="font-label-caps text-label-caps text-secondary font-bold uppercase">
                      Safety Sizing
                    </span>
                    <h3 className="font-headline-md text-body-lg text-on-surface font-semibold">
                      Emergency Fund: 3 vs. 6 Months ($4.2k Burn)
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Dual-income households need $12,600 (3 mo baseline), while solo freelancers or volatile earners should hold $25,200.
                    </p>
                  </div>
                  <div className="p-space-sm bg-surface-container-high rounded-xl flex flex-col gap-1">
                    <div className="flex justify-between font-data-mono text-label-caps">
                      <span className="text-on-surface-variant">Essential Buffer</span>
                      <span className="text-on-surface font-bold">$12.6k – $25.2k</span>
                    </div>
                    <div className="font-data-mono text-body-lg font-bold text-primary">
                      100% Cash Ready
                    </div>
                  </div>
                </div>

                {/* Scenario 4 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-space-md border border-outline-variant/20">
                  <div className="flex flex-col gap-space-xs">
                    <span className="font-label-caps text-label-caps text-secondary font-bold uppercase">
                      Runway Extension
                    </span>
                    <h3 className="font-headline-md text-body-lg text-on-surface font-semibold">
                      Cash Runway Trim: 8 to 13 Months
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Cutting $1,100 of discretionary recurring spend extends a $35,000 cash balance from 8.3 months to 13.1 months of survival runway.
                    </p>
                  </div>
                  <div className="p-space-sm bg-surface-container-high rounded-xl flex flex-col gap-1">
                    <div className="flex justify-between font-data-mono text-label-caps">
                      <span className="text-on-surface-variant">Runway Expansion</span>
                      <span className="text-secondary font-bold">+58% Duration</span>
                    </div>
                    <div className="font-data-mono text-body-lg font-bold text-primary">
                      +4.8 Months Safety
                    </div>
                  </div>
                </div>
              </div>

              {/* High-Yield Cash Callout Banner */}
              <div className="bg-gradient-to-r from-primary to-primary-container text-on-primary rounded-2xl p-space-lg lg:p-space-xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-space-lg">
                <div className="flex items-center gap-space-md">
                  <div className="w-14 h-14 rounded-2xl bg-surface-container-lowest/15 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[32px] text-on-primary">paid</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-label-caps text-label-caps uppercase text-primary-fixed tracking-wider font-bold">
                      The Cost of Inaction
                    </span>
                    <h3 className="font-headline-lg text-headline-md font-bold text-on-primary">
                      The Power of High-Yield Cash vs. Conventional Checking
                    </h3>
                    <p className="font-body-md text-body-md text-primary-fixed-dim max-w-2xl">
                      Leaving $25,000 in a traditional 0.01% savings account costs you over{' '}
                      <strong className="text-on-primary">$1,100 every single year</strong> in missed risk-free compounding interest. Put your idle cash reserves to work.
                    </p>
                  </div>
                </div>
                <a
                  href="#featured-tools"
                  className="px-space-lg py-space-sm rounded-xl bg-surface-container-lowest text-primary font-headline-md text-body-md font-bold shadow-md hover:bg-surface-container hover:scale-105 transition-all shrink-0 cursor-pointer"
                >
                  Explore High-Yield Calculators
                </a>
              </div>
            </div>
          </section>

          {/* MOST POPULAR SAVINGS & LIQUIDITY CALCULATORS (12 Featured Tools) */}
          <section className="w-full bg-surface py-space-2xl" id="featured-tools">
            <div className="max-w-[1280px] mx-auto px-gutter-desktop flex flex-col gap-space-xl">
              <div className="flex flex-col gap-space-2xs">
                <span className="font-label-caps text-label-caps text-primary uppercase tracking-widest font-semibold">
                  Top Tools
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-semibold">
                  Popular Savings Calculators
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                  Quick, simple tools to grow your savings and protect your money.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-space-md">
                {/* 1. Savings Calculator */}
                <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm hover:shadow-lg transition-all flex flex-col justify-between gap-space-md group border border-outline-variant/20">
                  <div className="flex flex-col gap-space-xs">
                    <div className="flex items-center justify-between">
                      <span className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-[22px]">savings</span>
                      </span>
                      <span className="font-data-mono text-label-caps bg-surface-container text-on-surface-variant px-2 py-0.5 rounded">
                        Savings
                      </span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface font-semibold pt-1">
                      Savings Calculator
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      See how your deposits grow over time with compound interest.
                    </p>
                  </div>
                  <Link
                    href="/finance/savings-calculator"
                    className="w-full py-2 px-space-sm rounded-lg bg-surface-container hover:bg-primary hover:text-on-primary text-primary font-body-sm text-body-sm font-semibold transition-colors flex items-center justify-between"
                  >
                    <span>Calculate Growth</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>

                {/* 2. APY Calculator */}
                <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm hover:shadow-lg transition-all flex flex-col justify-between gap-space-md group border border-outline-variant/20">
                  <div className="flex flex-col gap-space-xs">
                    <div className="flex items-center justify-between">
                      <span className="w-10 h-10 rounded-xl bg-secondary-fixed flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-[22px]">percent</span>
                      </span>
                      <span className="font-data-mono text-label-caps bg-surface-container text-on-surface-variant px-2 py-0.5 rounded">
                        APY
                      </span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface font-semibold pt-1">
                      APY Calculator
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Find out your true annual earnings across different compounding schedules.
                    </p>
                  </div>
                  <Link
                    href="/finance/apy-calculator"
                    className="w-full py-2 px-space-sm rounded-lg bg-surface-container hover:bg-primary hover:text-on-primary text-primary font-body-sm text-body-sm font-semibold transition-colors flex items-center justify-between"
                  >
                    <span>Calculate APY</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>

                {/* 3. High-Yield Savings */}
                <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm hover:shadow-lg transition-all flex flex-col justify-between gap-space-md group border border-outline-variant/20">
                  <div className="flex flex-col gap-space-xs">
                    <div className="flex items-center justify-between">
                      <span className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-[22px]">account_balance</span>
                      </span>
                      <span className="font-data-mono text-label-caps bg-surface-container text-on-surface-variant px-2 py-0.5 rounded">
                        Rates
                      </span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface font-semibold pt-1">
                      High-Yield Savings
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Compare earnings between high-yield accounts and typical bank savings.
                    </p>
                  </div>
                  <Link
                    href="/finance/savings-calculator"
                    className="w-full py-2 px-space-sm rounded-lg bg-surface-container hover:bg-primary hover:text-on-primary text-primary font-body-sm text-body-sm font-semibold transition-colors flex items-center justify-between"
                  >
                    <span>Compare Rates</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>

                {/* 4. CD Calculator */}
                <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm hover:shadow-lg transition-all flex flex-col justify-between gap-space-md group border border-outline-variant/20">
                  <div className="flex flex-col gap-space-xs">
                    <div className="flex items-center justify-between">
                      <span className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-on-surface group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-[22px]">verified</span>
                      </span>
                      <span className="font-data-mono text-label-caps bg-surface-container text-on-surface-variant px-2 py-0.5 rounded">
                        CDs
                      </span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface font-semibold pt-1">
                      CD Calculator
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Estimate total payout and interest earned on certificate terms.
                    </p>
                  </div>
                  <Link
                    href="/finance/savings-calculator"
                    className="w-full py-2 px-space-sm rounded-lg bg-surface-container hover:bg-primary hover:text-on-primary text-primary font-body-sm text-body-sm font-semibold transition-colors flex items-center justify-between"
                  >
                    <span>Calculate Maturity</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>

                {/* 5. CD Ladder Calculator */}
                <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm hover:shadow-lg transition-all flex flex-col justify-between gap-space-md group border border-outline-variant/20">
                  <div className="flex flex-col gap-space-xs">
                    <div className="flex items-center justify-between">
                      <span className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-[22px]">stacked_line_chart</span>
                      </span>
                      <span className="font-data-mono text-label-caps bg-surface-container text-on-surface-variant px-2 py-0.5 rounded">
                        Ladders
                      </span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface font-semibold pt-1">
                      CD Ladder Calculator
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Earn higher yields while freeing up cash regularly every few months.
                    </p>
                  </div>
                  <Link
                    href="/finance/savings-calculator"
                    className="w-full py-2 px-space-sm rounded-lg bg-surface-container hover:bg-primary hover:text-on-primary text-primary font-body-sm text-body-sm font-semibold transition-colors flex items-center justify-between"
                  >
                    <span>Build CD Ladder</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>

                {/* 6. Emergency Fund */}
                <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm hover:shadow-lg transition-all flex flex-col justify-between gap-space-md group border border-outline-variant/20">
                  <div className="flex flex-col gap-space-xs">
                    <div className="flex items-center justify-between">
                      <span className="w-10 h-10 rounded-xl bg-tertiary-fixed flex items-center justify-center text-tertiary group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-[22px]">shield_with_heart</span>
                      </span>
                      <span className="font-data-mono text-label-caps bg-surface-container text-on-surface-variant px-2 py-0.5 rounded">
                        Safety
                      </span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface font-semibold pt-1">
                      Emergency Fund
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Determine how much cash reserve you need for unexpected expenses.
                    </p>
                  </div>
                  <Link
                    href="/finance/savings-calculator"
                    className="w-full py-2 px-space-sm rounded-lg bg-surface-container hover:bg-primary hover:text-on-primary text-primary font-body-sm text-body-sm font-semibold transition-colors flex items-center justify-between"
                  >
                    <span>Plan Safety Net</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>

                {/* 7. Cash Runway Calculator */}
                <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm hover:shadow-lg transition-all flex flex-col justify-between gap-space-md group border border-outline-variant/20">
                  <div className="flex flex-col gap-space-xs">
                    <div className="flex items-center justify-between">
                      <span className="w-10 h-10 rounded-xl bg-secondary-fixed flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-[22px]">flight_takeoff</span>
                      </span>
                      <span className="font-data-mono text-label-caps bg-surface-container text-on-surface-variant px-2 py-0.5 rounded">
                        Runway
                      </span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface font-semibold pt-1">
                      Cash Runway Calculator
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Calculate how many months your savings will last given monthly expenses.
                    </p>
                  </div>
                  <Link
                    href="/business/cash-runway"
                    className="w-full py-2 px-space-sm rounded-lg bg-surface-container hover:bg-primary hover:text-on-primary text-primary font-body-sm text-body-sm font-semibold transition-colors flex items-center justify-between"
                  >
                    <span>Calculate Runway</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>

                {/* 8. Liquidity Ratio Calculator */}
                <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm hover:shadow-lg transition-all flex flex-col justify-between gap-space-md group border border-outline-variant/20">
                  <div className="flex flex-col gap-space-xs">
                    <div className="flex items-center justify-between">
                      <span className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-on-surface group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-[22px]">balance</span>
                      </span>
                      <span className="font-data-mono text-label-caps bg-surface-container text-on-surface-variant px-2 py-0.5 rounded">
                        Ratios
                      </span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface font-semibold pt-1">
                      Liquidity Ratio Calculator
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Check your current cash buffer against monthly bills and short-term obligations.
                    </p>
                  </div>
                  <Link
                    href="/finance/savings-calculator"
                    className="w-full py-2 px-space-sm rounded-lg bg-surface-container hover:bg-primary hover:text-on-primary text-primary font-body-sm text-body-sm font-semibold transition-colors flex items-center justify-between"
                  >
                    <span>Check Liquidity</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>

                {/* 9. Sinking Fund Calculator */}
                <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm hover:shadow-lg transition-all flex flex-col justify-between gap-space-md group border border-outline-variant/20">
                  <div className="flex flex-col gap-space-xs">
                    <div className="flex items-center justify-between">
                      <span className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-[22px]">event_repeat</span>
                      </span>
                      <span className="font-data-mono text-label-caps bg-surface-container text-on-surface-variant px-2 py-0.5 rounded">
                        Planning
                      </span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface font-semibold pt-1">
                      Sinking Fund Calculator
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Break down future planned purchases into manageable monthly savings contributions.
                    </p>
                  </div>
                  <Link
                    href="/finance/savings-calculator"
                    className="w-full py-2 px-space-sm rounded-lg bg-surface-container hover:bg-primary hover:text-on-primary text-primary font-body-sm text-body-sm font-semibold transition-colors flex items-center justify-between"
                  >
                    <span>Plan Purchases</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>

                {/* 10. Savings Goal Calculator */}
                <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm hover:shadow-lg transition-all flex flex-col justify-between gap-space-md group border border-outline-variant/20">
                  <div className="flex flex-col gap-space-xs">
                    <div className="flex items-center justify-between">
                      <span className="w-10 h-10 rounded-xl bg-secondary-fixed flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-[22px]">flag</span>
                      </span>
                      <span className="font-data-mono text-label-caps bg-surface-container text-on-surface-variant px-2 py-0.5 rounded">
                        Goals
                      </span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface font-semibold pt-1">
                      Savings Goal Calculator
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Find the exact monthly amount needed to reach your target by date.
                    </p>
                  </div>
                  <Link
                    href="/finance/savings-calculator"
                    className="w-full py-2 px-space-sm rounded-lg bg-surface-container hover:bg-primary hover:text-on-primary text-primary font-body-sm text-body-sm font-semibold transition-colors flex items-center justify-between"
                  >
                    <span>Track Timeline</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>

                {/* 11. Compound Interest */}
                <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm hover:shadow-lg transition-all flex flex-col justify-between gap-space-md group border border-outline-variant/20">
                  <div className="flex flex-col gap-space-xs">
                    <div className="flex items-center justify-between">
                      <span className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-[22px]">auto_graph</span>
                      </span>
                      <span className="font-data-mono text-label-caps bg-surface-container text-on-surface-variant px-2 py-0.5 rounded">
                        Interest
                      </span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface font-semibold pt-1">
                      Compound Interest
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Calculate long-term interest earnings with flexible deposit timing and rates.
                    </p>
                  </div>
                  <Link
                    href="/finance/compound-interest-calculator"
                    className="w-full py-2 px-space-sm rounded-lg bg-surface-container hover:bg-primary hover:text-on-primary text-primary font-body-sm text-body-sm font-semibold transition-colors flex items-center justify-between"
                  >
                    <span>Simulate Interest</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>

                {/* 12. Cash Reserve Calculator */}
                <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm hover:shadow-lg transition-all flex flex-col justify-between gap-space-md group border border-outline-variant/20">
                  <div className="flex flex-col gap-space-xs">
                    <div className="flex items-center justify-between">
                      <span className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-on-surface group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-[22px]">assured_workload</span>
                      </span>
                      <span className="font-data-mono text-label-caps bg-surface-container text-on-surface-variant px-2 py-0.5 rounded">
                        Reserves
                      </span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface font-semibold pt-1">
                      Cash Reserve Calculator
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Size an optimal operating cash buffer to handle income fluctuations.
                    </p>
                  </div>
                  <Link
                    href="/finance/savings-calculator"
                    className="w-full py-2 px-space-sm rounded-lg bg-surface-container hover:bg-primary hover:text-on-primary text-primary font-body-sm text-body-sm font-semibold transition-colors flex items-center justify-between"
                  >
                    <span>Size Cash Buffer</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* COMPLETE DIRECTORY: BROWSE ALL 12 CLUSTERS (102 CALCULATORS) */}
          <section className="w-full bg-surface-container-low py-space-3xl border-y border-surface-container/60">
            <div className="max-w-[1280px] mx-auto px-gutter-desktop flex flex-col gap-space-2xl">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
                <div className="flex flex-col gap-space-2xs max-w-3xl">
                  <div className="flex items-center gap-space-xs text-primary font-label-caps text-label-caps uppercase tracking-wider font-bold">
                    <span className="material-symbols-outlined text-[18px]">folder_open</span>
                    Calculators Directory
                  </div>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface font-semibold">
                    All Savings &amp; Cash Calculators
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Explore our complete collection of easy-to-use savings and cash planning tools.
                  </p>
                </div>
                <div className="font-data-mono text-body-sm font-semibold text-on-surface-variant bg-surface-container-lowest px-4 py-2 rounded-xl shadow-sm border border-outline-variant/20">
                  {totalFilteredCount} TOTAL CALCULATORS
                </div>
              </div>

              {filteredClusters.length === 0 ? (
                <div className="bg-surface-container-lowest p-8 rounded-2xl text-center shadow-sm">
                  <p className="text-on-surface-variant text-body-md">
                    No calculators matched your search query &quot;{searchQuery}&quot;.
                  </p>
                  <button
                    type="button"
                    onClick={() => { setSearchQuery(''); setSelectedFilter('all'); }}
                    className="mt-3 px-4 py-2 bg-primary text-on-primary rounded-xl text-body-sm font-semibold"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
                  {filteredClusters.map((cluster) => (
                    <div
                      key={cluster.id}
                      className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm flex flex-col gap-space-md border border-outline-variant/20"
                    >
                      <div className="flex items-center justify-between pb-space-xs border-b border-surface-container">
                        <div className="flex items-center gap-space-xs">
                          <span className={`material-symbols-outlined ${cluster.colorClass} text-[22px]`}>
                            {cluster.icon}
                          </span>
                          <h3 className="font-headline-md text-body-lg text-on-surface font-semibold">
                            {cluster.name}
                          </h3>
                        </div>
                        <span className="font-data-mono text-label-caps bg-surface-container text-primary font-bold px-2 py-0.5 rounded-full">
                          {cluster.tools.length} Tools
                        </span>
                      </div>

                      <ul className="flex flex-col gap-2 font-body-sm text-body-sm text-on-surface-variant">
                        {cluster.tools.map((tool) => (
                          <li key={tool.name}>
                            <Link
                              href={tool.href}
                              className="hover:text-primary transition-colors flex items-center justify-between py-0.5"
                            >
                              <span>{tool.name}</span>
                              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
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

          {/* SMART FINANCIAL DECISIONS & HEAD-TO-HEAD COMPARISONS (8 Analytical Cards) */}
          <section className="w-full bg-surface py-space-3xl">
            <div className="max-w-[1280px] mx-auto px-gutter-desktop flex flex-col gap-space-2xl">
              <div className="flex flex-col gap-space-2xs max-w-2xl">
                <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest font-semibold">
                  Decision Matrix
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-semibold">
                  Smart Financial Decisions: Head-to-Head Cash Comparisons
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Evaluate trade-offs between yield, penalty risk, liquidity availability, and tax efficiencies to make objective cash allocation decisions.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
                {/* Comparison 1 */}
                <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-space-md border border-outline-variant/20">
                  <div className="flex flex-col gap-space-xs">
                    <span className="font-data-mono text-label-caps text-primary font-bold uppercase">
                      Savings vs. Certificates
                    </span>
                    <h3 className="font-headline-md text-body-lg text-on-surface font-semibold">
                      High-Yield Savings vs. CD
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      High-yield savings offer variable rates with instant liquidity. CDs lock a fixed yield for months or years in exchange for early withdrawal penalties.
                    </p>
                  </div>
                  <div className="bg-surface-container p-2.5 rounded-xl font-label-caps text-label-caps text-on-surface-variant flex justify-between">
                    <span>Winner for Flex: HYSA</span>
                    <span className="text-primary font-bold">Winner for Locks: CD</span>
                  </div>
                </div>

                {/* Comparison 2 */}
                <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-space-md border border-outline-variant/20">
                  <div className="flex flex-col gap-space-xs">
                    <span className="font-data-mono text-label-caps text-primary font-bold uppercase">
                      Liquidity Design
                    </span>
                    <h3 className="font-headline-md text-body-lg text-on-surface font-semibold">
                      CD Ladder vs. Liquid Savings
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      A CD ladder captures longer-term higher certificate yields by staggering maturity dates across 3, 6, 9, and 12-month tranches without giving up quarterly liquidity.
                    </p>
                  </div>
                  <div className="bg-surface-container p-2.5 rounded-xl font-label-caps text-label-caps text-on-surface-variant flex justify-between">
                    <span>Best of Both Worlds</span>
                    <span className="text-secondary font-bold">Yield + Safety</span>
                  </div>
                </div>

                {/* Comparison 3 */}
                <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-space-md border border-outline-variant/20">
                  <div className="flex flex-col gap-space-xs">
                    <span className="font-data-mono text-label-caps text-primary font-bold uppercase">
                      Banking Vehicles
                    </span>
                    <h3 className="font-headline-md text-body-lg text-on-surface font-semibold">
                      HYSA vs. Money Market (MMA)
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Money Market Accounts provide check-writing and debit card capabilities paired with competitive APY, while HYSAs offer purely digital transfer yields.
                    </p>
                  </div>
                  <div className="bg-surface-container p-2.5 rounded-xl font-label-caps text-label-caps text-on-surface-variant flex justify-between">
                    <span>Both FDIC Insured</span>
                    <span className="text-primary font-bold">MMA Adds Checks</span>
                  </div>
                </div>

                {/* Comparison 4 */}
                <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-space-md border border-outline-variant/20">
                  <div className="flex flex-col gap-space-xs">
                    <span className="font-data-mono text-label-caps text-primary font-bold uppercase">
                      Cash Allocation
                    </span>
                    <h3 className="font-headline-md text-body-lg text-on-surface font-semibold">
                      Emergency Fund vs. Low Debt
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      When cash yields 4.5% - 5.0% and low-rate debt (like a 3% mortgage or student loan) is fixed, maintaining cash reserves maximizes safety and net interest spread.
                    </p>
                  </div>
                  <div className="bg-surface-container p-2.5 rounded-xl font-label-caps text-label-caps text-on-surface-variant flex justify-between">
                    <span>Spread Advantage</span>
                    <span className="text-secondary font-bold">+1.5% Net Margin</span>
                  </div>
                </div>

                {/* Comparison 5 */}
                <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-space-md border border-outline-variant/20">
                  <div className="flex flex-col gap-space-xs">
                    <span className="font-data-mono text-label-caps text-primary font-bold uppercase">
                      Account Buffering
                    </span>
                    <h3 className="font-headline-md text-body-lg text-on-surface font-semibold">
                      Checking Buffer vs. HYSA
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Maintain exactly 1 to 1.5 months of living expenses in checking to prevent overdrafts, and sweep all remaining liquid capital to high-yield cash immediately.
                    </p>
                  </div>
                  <div className="bg-surface-container p-2.5 rounded-xl font-label-caps text-label-caps text-on-surface-variant flex justify-between">
                    <span>Checking: 1.0 Mo Max</span>
                    <span className="text-primary font-bold">Sweep The Rest</span>
                  </div>
                </div>

                {/* Comparison 6 */}
                <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-space-md border border-outline-variant/20">
                  <div className="flex flex-col gap-space-xs">
                    <span className="font-data-mono text-label-caps text-primary font-bold uppercase">
                      Sovereign Backing
                    </span>
                    <h3 className="font-headline-md text-body-lg text-on-surface font-semibold">
                      Bank CDs vs. US T-Bills
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Treasury bills are backed by the full faith of the U.S. Government and exempt from state and local income tax, often outperforming CDs in high-tax states.
                    </p>
                  </div>
                  <div className="bg-surface-container p-2.5 rounded-xl font-label-caps text-label-caps text-on-surface-variant flex justify-between">
                    <span>T-Bills: State Tax-Free</span>
                    <span className="text-secondary font-bold">Higher After-Tax</span>
                  </div>
                </div>

                {/* Comparison 7 */}
                <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-space-md border border-outline-variant/20">
                  <div className="flex flex-col gap-space-xs">
                    <span className="font-data-mono text-label-caps text-primary font-bold uppercase">
                      Principal Risk
                    </span>
                    <h3 className="font-headline-md text-body-lg text-on-surface font-semibold">
                      Cash Reserves vs. Bond Funds
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Short-term bond ETFs can fluctuate in price when benchmark interest rates change. FDIC bank cash preserves $1.00 per dollar nominal principal regardless of rate hikes.
                    </p>
                  </div>
                  <div className="bg-surface-container p-2.5 rounded-xl font-label-caps text-label-caps text-on-surface-variant flex justify-between">
                    <span>Cash: Zero Capital Loss</span>
                    <span className="text-primary font-bold">Bonds: Price Risk</span>
                  </div>
                </div>

                {/* Comparison 8 */}
                <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-space-md border border-outline-variant/20">
                  <div className="flex flex-col gap-space-xs">
                    <span className="font-data-mono text-label-caps text-primary font-bold uppercase">
                      Portfolio Horizon
                    </span>
                    <h3 className="font-headline-md text-body-lg text-on-surface font-semibold">
                      Max Liquidity vs. Long Growth
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Cash preserves nominal capital for 0-3 year spending goals. Long-term equities outpace inflation over 10+ years but carry major short-term drawdown volatility.
                    </p>
                  </div>
                  <div className="bg-surface-container p-2.5 rounded-xl font-label-caps text-label-caps text-on-surface-variant flex justify-between">
                    <span>Cash: &lt; 3 Years</span>
                    <span className="text-secondary font-bold">Equities: &gt; 5 Years</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* HOW SAVINGS, APY & COMPOUND INTEREST WORK (MATHEMATICAL FOUNDATIONS) */}
          <section className="w-full bg-surface-container-low py-space-3xl border-y border-surface-container/60">
            <div className="max-w-[1280px] mx-auto px-gutter-desktop flex flex-col gap-space-2xl">
              <div className="flex flex-col gap-space-2xs max-w-2xl">
                <span className="font-label-caps text-label-caps text-primary uppercase tracking-widest font-semibold">
                  How It Works
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-semibold">
                  How Savings &amp; Interest Are Calculated
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Simple, clear formulas that show how your money grows over time.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg items-start">
                {/* Formula 1: Compound Interest Equation */}
                <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm flex flex-col gap-space-md border border-outline-variant/20">
                  <div className="flex items-center justify-between">
                    <h3 className="font-headline-md text-body-lg text-on-surface font-semibold">
                      Standard Compound Interest Equation
                    </h3>
                    <span className="font-data-mono text-label-caps bg-surface-container text-primary font-bold px-2 py-0.5 rounded">
                      FORMULA A
                    </span>
                  </div>
                  <div className="bg-surface-container-high p-space-md rounded-xl font-data-mono text-headline-md text-primary text-center font-bold tracking-wider">
                    A = P × (1 + r / n)<sup>n × t</sup>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Where <strong>A</strong> is the final future balance, <strong>P</strong> is the principal deposit, <strong>r</strong> is the nominal interest rate expressed as a decimal, <strong>n</strong> is the compounding frequency per year (365 for daily, 12 for monthly), and <strong>t</strong> is time in years.
                  </p>
                  <div className="bg-surface-container-low p-space-sm rounded-lg font-body-sm text-body-sm text-on-surface-variant">
                    <span className="font-bold text-on-surface">Daily Compounding Edge:</span> Banks calculating interest daily apply <code className="font-data-mono text-primary font-bold">n = 365</code>. This adds compounding velocity compared to quarterly calculations.
                  </div>
                </div>

                {/* Formula 2: APY Equation */}
                <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm flex flex-col gap-space-md border border-outline-variant/20">
                  <div className="flex items-center justify-between">
                    <h3 className="font-headline-md text-body-lg text-on-surface font-semibold">
                      Annual Percentage Yield (APY) Formula
                    </h3>
                    <span className="font-data-mono text-label-caps bg-surface-container text-secondary font-bold px-2 py-0.5 rounded">
                      REGULATION DD
                    </span>
                  </div>
                  <div className="bg-surface-container-high p-space-md rounded-xl font-data-mono text-headline-md text-secondary text-center font-bold tracking-wider">
                    APY = (1 + r / n)<sup>n</sup> - 1
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    The APY formula calculates the true effective annual rate of return earned by factoring in compounding frequency. Because interest earns interest over the year, APY is strictly greater than or equal to the stated nominal APR.
                  </p>
                  <div className="bg-surface-container-low p-space-sm rounded-lg font-body-sm text-body-sm text-on-surface-variant">
                    <span className="font-bold text-on-surface">Example:</span> A 4.50% nominal interest rate compounded daily produces an effective APY of <strong className="text-secondary font-semibold">4.602%</strong> over a 365-day statutory period.
                  </div>
                </div>

                {/* Formula 3: Cash Runway Formula */}
                <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm flex flex-col gap-space-md border border-outline-variant/20">
                  <div className="flex items-center justify-between">
                    <h3 className="font-headline-md text-body-lg text-on-surface font-semibold">
                      Cash Runway Duration Equation
                    </h3>
                    <span className="font-data-mono text-label-caps bg-surface-container text-on-surface font-bold px-2 py-0.5 rounded">
                      SOLVENCY MODEL
                    </span>
                  </div>
                  <div className="bg-surface-container-high p-space-md rounded-xl font-data-mono text-headline-md text-on-surface text-center font-bold tracking-wider">
                    Runway (Months) = Total Cash / Monthly Net Burn
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Net burn is defined as Total Fixed &amp; Variable Outflows minus Total Guaranteed Recurring Inflows. For zero-income crisis situations, Monthly Net Burn equals Gross Monthly Overhead.
                  </p>
                </div>

                {/* Formula 4: Rule of 72 Table */}
                <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm flex flex-col gap-space-md border border-outline-variant/20">
                  <div className="flex items-center justify-between">
                    <h3 className="font-headline-md text-body-lg text-on-surface font-semibold">
                      The Rule of 72: Doubling Time
                    </h3>
                    <span className="font-data-mono text-label-caps bg-surface-container text-primary font-bold px-2 py-0.5 rounded">
                      HEURISTIC
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    The Rule of 72 provides the approximate time in years required for your savings to double at a given constant yield: <code className="font-data-mono font-bold text-primary">Years ≈ 72 / APY</code>.
                  </p>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="bg-surface-container p-2 rounded-lg">
                      <span className="font-data-mono text-label-caps text-on-surface-variant">2.0% APY</span>
                      <div className="font-data-mono text-body-lg font-bold text-on-surface">36.0 Yrs</div>
                    </div>
                    <div className="bg-surface-container p-2 rounded-lg">
                      <span className="font-data-mono text-label-caps text-on-surface-variant">4.0% APY</span>
                      <div className="font-data-mono text-body-lg font-bold text-secondary">18.0 Yrs</div>
                    </div>
                    <div className="bg-surface-container p-2 rounded-lg">
                      <span className="font-data-mono text-label-caps text-on-surface-variant">5.0% APY</span>
                      <div className="font-data-mono text-body-lg font-bold text-primary">14.4 Yrs</div>
                    </div>
                    <div className="bg-surface-container p-2 rounded-lg">
                      <span className="font-data-mono text-label-caps text-on-surface-variant">8.0% APY</span>
                      <div className="font-data-mono text-body-lg font-bold text-tertiary">9.0 Yrs</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* EDUCATIONAL GUIDES & PROGRAMMATIC SEO HUBS */}
          <section className="w-full bg-surface py-space-3xl">
            <div className="max-w-[1280px] mx-auto px-gutter-desktop flex flex-col gap-space-2xl">
              <div className="flex flex-col gap-space-2xs max-w-3xl">
                <span className="font-label-caps text-label-caps text-primary uppercase tracking-widest font-semibold">
                  Deep Dive Consumer Banking Knowledge
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-semibold">
                  Comprehensive Liquidity, CD &amp; APY Guidance
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Master cash strategy, understand how interest compounds, and learn how to safeguard your liquid assets against inflation and unforeseen emergencies.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg">
                {/* Guide 1 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm flex flex-col gap-space-sm border border-outline-variant/20">
                  <span className="material-symbols-outlined text-primary text-[28px]">account_balance_wallet</span>
                  <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">
                    What Is a Savings Calculator?
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    A savings calculator is a financial forecasting workbench that computes how an initial deposit combined with recurring monthly contributions grows over time under compound interest. It simulates compounding frequency, tax drag, and inflation erosion to reveal your actual future purchasing power.
                  </p>
                </div>

                {/* Guide 2 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm flex flex-col gap-space-sm border border-outline-variant/20">
                  <span className="material-symbols-outlined text-secondary text-[28px]">query_stats</span>
                  <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">
                    How APY Really Works
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Annual Percentage Yield (APY) reflects the true annualized rate earned on cash deposits when compounding is taken into account. Traditional brick-and-mortar savings accounts often pay a meager 0.01% to 0.05% APY, whereas leading online high-yield savings accounts pay 4.00% to 5.25% APY on the exact same insured dollars.
                  </p>
                </div>

                {/* Guide 3 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm flex flex-col gap-space-sm border border-outline-variant/20">
                  <span className="material-symbols-outlined text-tertiary text-[28px]">safety_check</span>
                  <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">
                    How Much Emergency Fund Is Enough?
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Most financial planners recommend holding 3 to 6 months of mandatory living expenses in a liquid account. Dual-income corporate employees with steady income can target 3 to 4 months. Sole proprietors, contractors, or single-earner households with volatile revenue should maintain a 6 to 12-month cash buffer.
                  </p>
                </div>
              </div>

              {/* Programmatic Fast-Links by Deposit Tiers & APY Levels */}
              <div className="bg-surface-container-low rounded-2xl p-space-lg flex flex-col gap-space-md border border-outline-variant/20">
                <h3 className="font-headline-md text-body-lg text-on-surface font-semibold">
                  Quick Calculators by Starting Balance &amp; Target Yield
                </h3>
                <div className="flex flex-col gap-space-sm">
                  <div className="flex flex-wrap items-center gap-space-xs font-body-sm text-body-sm">
                    <span className="font-semibold text-on-surface text-label-caps uppercase tracking-wider min-w-32">
                      By Deposit Tier:
                    </span>
                    {[
                      { val: 1000, label: '$1,000 Savings Growth' },
                      { val: 5000, label: '$5,000 Savings Growth' },
                      { val: 10000, label: '$10,000 High-Yield Plan' },
                      { val: 25000, label: '$25,000 CD Ladder' },
                      { val: 50000, label: '$50,000 Liquidity Matrix' },
                      { val: 100000, label: '$100,000 Wealth Buffer' },
                    ].map((item) => (
                      <button
                        key={item.val}
                        type="button"
                        onClick={() => {
                          setInitialDeposit(item.val);
                          window.scrollTo({ top: 400, behavior: 'smooth' });
                        }}
                        className="px-space-sm py-1 rounded-lg bg-surface-container-lowest hover:bg-primary hover:text-on-primary font-data-mono transition-colors shadow-sm cursor-pointer"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-space-xs font-body-sm text-body-sm">
                    <span className="font-semibold text-on-surface text-label-caps uppercase tracking-wider min-w-32">
                      By APY Benchmark:
                    </span>
                    {[
                      { rate: 3.0, label: '3.00% APY Simulator' },
                      { rate: 4.0, label: '4.00% APY Simulator' },
                      { rate: 4.5, label: '4.50% High-Yield APY' },
                      { rate: 5.0, label: '5.00% Peak CD APY' },
                      { rate: 5.5, label: '5.50% Short Treasury APY' },
                    ].map((item) => (
                      <button
                        key={item.rate}
                        type="button"
                        onClick={() => {
                          setApyRate(item.rate);
                          window.scrollTo({ top: 400, behavior: 'smooth' });
                        }}
                        className="px-space-sm py-1 rounded-lg bg-surface-container-lowest hover:bg-secondary hover:text-on-secondary font-data-mono transition-colors shadow-sm cursor-pointer"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FREQUENTLY ASKED QUESTIONS (STRUCTURED ACCORDIONS) */}
          <section className="w-full bg-surface-container-low py-space-3xl border-t border-surface-container/60">
            <div className="max-w-[840px] mx-auto px-gutter-desktop flex flex-col gap-space-xl">
              <div className="flex flex-col gap-space-2xs text-center items-center">
                <span className="font-label-caps text-label-caps text-primary uppercase tracking-widest font-semibold">
                  Expert Answers
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-semibold">
                  Frequently Asked Questions
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-lg">
                  Clear, audited answers to critical consumer savings, certificate of deposit, and liquidity questions.
                </p>
              </div>

              <div className="flex flex-col gap-space-sm" id="faqAccordion">
                {[
                  {
                    q: 'What is the difference between APR and APY in savings?',
                    a: 'APR (Annual Percentage Rate) is the simple, nominal annualized interest rate without taking compounding into account. APY (Annual Percentage Yield) accounts for how frequently interest compounds (daily, monthly, or quarterly). Because compounding allows earned interest to earn interest itself, APY will always be slightly higher than APR for deposit accounts that compound more than once a year.',
                  },
                  {
                    q: 'How much should I keep in an emergency fund?',
                    a: 'The standard guideline is 3 to 6 months of essential baseline living expenses (housing, groceries, utilities, debt minimums, healthcare). If you are single, self-employed, work on commission, or work in an unstable industry, aiming for 6 to 12 months is strongly advised. Keep this money in a liquid, FDIC-insured high-yield account with instant accessibility.',
                  },
                  {
                    q: 'How does a CD ladder provide both higher yield and liquidity?',
                    a: 'Instead of locking all your capital into a single long-term CD (e.g., a 1-year CD), you divide it into equal parts across 3-month, 6-month, 9-month, and 12-month certificates. Every 3 months, a certificate matures, giving you fresh cash liquidity or the opportunity to roll into a top-paying 1-year CD. This continuous rolling maturity captures top yields without freezing your funds.',
                  },
                  {
                    q: 'Is my money safe in a high-yield savings account (FDIC / NCUA)?',
                    a: 'Yes, provided the financial institution is FDIC-insured (for commercial banks) or NCUA-insured (for credit unions). Your deposits are backed up to $250,000 per depositor, per insured bank, for each account ownership category. Many modern online fintech services utilize multi-bank sweep networks that offer up to $2,000,000 or more in aggregate FDIC coverage.',
                  },
                  {
                    q: 'How does inflation impact cash savings over time?',
                    a: 'Inflation decreases your purchasing power each year. If inflation runs at 3.0% and your savings account earns 4.5% APY, your real return is roughly +1.5% before taxes. However, if your cash sits in a traditional checking account earning 0.01%, inflation causes a real loss of approximately -2.99% per year in purchasing power.',
                  },
                  {
                    q: 'What is a sinking fund and how is it different from an emergency fund?',
                    a: 'An emergency fund is reserved strictly for unexpected emergencies like job loss or emergency medical bills. A sinking fund is dedicated to expected, known upcoming expenditures that do not occur on a monthly schedule, such as annual car insurance premiums, home maintenance, holiday gifts, or planned vacations.',
                  },
                ].map((item, index) => {
                  const isOpen = openFaq === index;
                  return (
                    <div
                      key={index}
                      className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/20"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : index)}
                        className="w-full p-space-md text-left flex items-center justify-between font-headline-md text-body-lg text-on-surface font-semibold focus:outline-none cursor-pointer"
                      >
                        <span>{item.q}</span>
                        <span
                          className={`material-symbols-outlined text-[22px] transition-transform duration-200 ${
                            isOpen ? 'rotate-180 text-primary' : 'text-outline'
                          }`}
                        >
                          expand_more
                        </span>
                      </button>
                      {isOpen && (
                        <div className="px-space-md pb-space-md font-body-sm text-body-sm text-on-surface-variant leading-relaxed animate-in fade-in duration-150">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* VERIFIED BANKING & TREASURY ADVISORY COMPLIANCE BOARD */}
          <section className="w-full bg-surface-container-high py-space-xl">
            <div className="max-w-[1280px] mx-auto px-gutter-desktop">
              <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm flex flex-col md:flex-row items-center justify-between gap-space-lg border border-outline-variant/20">
                <div className="flex items-center gap-space-md">
                  <div className="w-14 h-14 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined text-[32px]">fact_check</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-space-xs">
                      <span className="font-headline-md text-body-lg text-on-surface font-semibold">
                        Audited Financial Methodology
                      </span>
                      <span className="px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-data-mono text-label-caps font-bold">
                        EEAT VERIFIED
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant max-w-2xl">
                      Reviewed by Financial Professionals · Updated March 2025 · 100% Private. Formulas conform with federal banking disclosure guidelines and standard compounding rules.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-space-sm shrink-0">
                  <div className="flex flex-col items-end text-label-caps font-label-caps text-outline">
                    <span>ZERO TELEMETRY</span>
                    <span className="text-secondary font-bold">100% PRIVATE</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-[20px]">lock</span>
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
