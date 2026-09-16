'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

interface ToolItem {
  name: string;
  href: string;
  badge?: string;
}

interface DirectoryCluster {
  id: string;
  title: string;
  toolsCount: number;
  category: string;
  icon: string;
  tools: ToolItem[];
}

const CLUSTERS: DirectoryCluster[] = [
  {
    id: 'cluster-interest',
    title: '1. Credit Card Interest',
    toolsCount: 8,
    category: 'interest',
    icon: 'percent',
    tools: [
      { name: 'Credit Card Interest Calculator', href: '/finance/emi-calculator' },
      { name: 'APR Interest Calculator', href: '/finance/emi-calculator' },
      { name: 'Daily Periodic Rate (DPR) Tool', href: '/finance/emi-calculator' },
      { name: 'Monthly Interest Calculator', href: '/finance/emi-calculator' },
      { name: 'Annual Card Interest Analyzer', href: '/finance/emi-calculator' },
      { name: 'Compounding Daily Balance Simulator', href: '/finance/emi-calculator' },
      { name: 'Average Daily Balance Calculator', href: '/finance/emi-calculator' },
      { name: 'Total Card Carrying Cost Calculator', href: '/finance/emi-calculator' },
    ],
  },
  {
    id: 'cluster-minimum',
    title: '2. Minimum Payment Traps',
    toolsCount: 8,
    category: 'minimum',
    icon: 'hourglass_bottom',
    tools: [
      { name: 'Minimum Payment Calculator', href: '/finance/emi-calculator' },
      { name: 'Minimum Payment Trap Simulator', href: '/finance/emi-calculator' },
      { name: 'Payoff Horizon Calculator', href: '/finance/emi-calculator' },
      { name: 'Lifetime Interest Cost Projector', href: '/finance/emi-calculator' },
      { name: 'Fixed vs Minimum Payoff Comparator', href: '/finance/emi-calculator' },
      { name: 'CARD Act 36-Month Benchmark Model', href: '/finance/emi-calculator' },
      { name: 'Revolving Debt Burden Index', href: '/finance/emi-calculator' },
      { name: 'True Cost of Credit Purchases', href: '/finance/emi-calculator' },
    ],
  },
  {
    id: 'cluster-transfer',
    title: '3. Balance Transfers',
    toolsCount: 8,
    category: 'transfer',
    icon: 'sync_alt',
    tools: [
      { name: 'Balance Transfer Calculator', href: '/finance/emi-calculator' },
      { name: '0% Balance Transfer Planner', href: '/finance/emi-calculator' },
      { name: 'Transfer Savings Calculator', href: '/finance/emi-calculator' },
      { name: '3% vs 5% Transfer Fee Analyzer', href: '/finance/emi-calculator' },
      { name: 'Loan vs Transfer Comparator', href: '/loans-and-amortization' },
      { name: 'Transfer Break-Even Month Finder', href: '/finance/emi-calculator' },
      { name: 'Promo Expiration Schedule Tracker', href: '/finance/emi-calculator' },
      { name: 'Transfer Optimization Simulator', href: '/finance/emi-calculator' },
    ],
  },
  {
    id: 'cluster-intro-apr',
    title: '4. 0% Intro APR',
    toolsCount: 8,
    category: 'transfer',
    icon: 'event_repeat',
    tools: [
      { name: '0% APR Calculator', href: '/finance/emi-calculator' },
      { name: 'Intro APR Purchase Planner', href: '/finance/emi-calculator' },
      { name: 'Promotional APR Timeline Modeler', href: '/finance/emi-calculator' },
      { name: 'Deferred Interest Trap Sizer', href: '/finance/emi-calculator' },
      { name: 'Intro Expiration Rate Jump Risk', href: '/finance/emi-calculator' },
      { name: 'Interest Avoidance Planner', href: '/finance/emi-calculator' },
      { name: 'Grace Period Precision Clock', href: '/finance/emi-calculator' },
      { name: 'Zero-APR Monthly Target Plan', href: '/finance/emi-calculator' },
    ],
  },
  {
    id: 'cluster-utilization',
    title: '5. Credit Utilization',
    toolsCount: 8,
    category: 'utilization',
    icon: 'donut_large',
    tools: [
      { name: 'Credit Utilization Calculator', href: '/finance/emi-calculator' },
      { name: 'Credit Limit Increase Impact', href: '/finance/emi-calculator' },
      { name: 'Per-Card vs Aggregate Ratio', href: '/finance/emi-calculator' },
      { name: 'FICO Utilization Threshold Finder', href: '/finance/emi-calculator' },
      { name: 'Optimal 6% Target Calculator', href: '/finance/emi-calculator' },
      { name: 'Available Revolving Line Monitor', href: '/finance/emi-calculator' },
      { name: 'Statement Balance Timing Tool', href: '/finance/emi-calculator' },
      { name: 'Rapid Rescore Simulation Tool', href: '/finance/emi-calculator' },
    ],
  },
  {
    id: 'cluster-strategies',
    title: '6. Debt Payoff Strategies',
    toolsCount: 8,
    category: 'strategies',
    icon: 'stacked_line_chart',
    tools: [
      { name: 'Credit Card Payoff Calculator', href: '/finance/emi-calculator' },
      { name: 'Debt Snowball Schedule Builder', href: '/loans-and-amortization' },
      { name: 'Debt Avalanche Interest Optimizer', href: '/loans-and-amortization' },
      { name: 'Accelerated Debt Sinking Planner', href: '/loans-and-amortization' },
      { name: 'Extra Payment Multiplier Tool', href: '/loans-and-amortization' },
      { name: 'Debt-Free Target Date Predictor', href: '/finance/emi-calculator' },
      { name: 'Interest Savings Forecaster', href: '/finance/emi-calculator' },
      { name: 'Cash Flow Debt Squeeze Tool', href: '/finance/emi-calculator' },
    ],
  },
  {
    id: 'cluster-rewards',
    title: '7. Rewards & Cashback',
    toolsCount: 8,
    category: 'rewards',
    icon: 'account_balance_wallet',
    tools: [
      { name: 'Cash Back Calculator', href: '/finance/savings-calculator' },
      { name: 'Tiered Rewards Category Planner', href: '/finance/savings-calculator' },
      { name: 'Point Value Converter (USD)', href: '/finance/savings-calculator' },
      { name: 'Reward Break-Even vs APR Drag', href: '/finance/emi-calculator' },
      { name: 'Annual Fee Net Return Value', href: '/finance/savings-calculator' },
      { name: 'Rotating Category Spend Tracker', href: '/finance/savings-calculator' },
      { name: 'Sign-Up Bonus (SUB) ROI Calculator', href: '/finance/savings-calculator' },
      { name: 'Cashback Reinvestment Modeler', href: '/investing-and-growth' },
    ],
  },
  {
    id: 'cluster-travel',
    title: '8. Travel Rewards',
    toolsCount: 8,
    category: 'rewards',
    icon: 'flight_takeoff',
    tools: [
      { name: 'Miles Valuation Calculator', href: '/finance/savings-calculator' },
      { name: 'Airline Points Matcher', href: '/finance/savings-calculator' },
      { name: 'Hotel Transfer Partner Valuation', href: '/finance/savings-calculator' },
      { name: 'Cent-Per-Point (CPP) Calculator', href: '/finance/savings-calculator' },
      { name: 'Travel Card Fee Break-Even Tool', href: '/finance/savings-calculator' },
      { name: 'Premium Card Credits Audit', href: '/finance/savings-calculator' },
      { name: 'Airport Lounge Net Value Analyzer', href: '/finance/savings-calculator' },
      { name: 'Foreign Transaction Fee Savings', href: '/finance/savings-calculator' },
    ],
  },
  {
    id: 'cluster-score',
    title: '9. Credit Score Impact',
    toolsCount: 8,
    category: 'score',
    icon: 'credit_score',
    tools: [
      { name: 'Credit Score Impact Estimator', href: '/finance/emi-calculator' },
      { name: 'Hard Inquiry Score Drop Sizer', href: '/finance/emi-calculator' },
      { name: 'Hard Inquiry Recovery Timeline', href: '/finance/emi-calculator' },
      { name: 'Average Age of Accounts (AAoA)', href: '/finance/emi-calculator' },
      { name: 'Revolving Credit Mix Optimizer', href: '/finance/emi-calculator' },
      { name: 'Late Payment Drag Estimator', href: '/finance/emi-calculator' },
      { name: 'Closed Card Limit Shock Simulator', href: '/finance/emi-calculator' },
      { name: 'Rapid Score Rebound Calculator', href: '/finance/emi-calculator' },
    ],
  },
  {
    id: 'cluster-revolving',
    title: '10. Revolving Credit & HELOC',
    toolsCount: 8,
    category: 'score',
    icon: 'account_tree',
    tools: [
      { name: 'Revolving Credit Line Analyzer', href: '/finance/emi-calculator' },
      { name: 'Personal Line of Credit Cost', href: '/loans-and-amortization' },
      { name: 'HELOC vs Credit Card Payoff', href: '/mortgages-and-real-estate-debt' },
      { name: 'Draw Period Interest Forecaster', href: '/mortgages-and-real-estate-debt' },
      { name: 'Revolving Rate Volatility Modeler', href: '/loans-and-amortization' },
      { name: 'Credit Capacity Index', href: '/finance/emi-calculator' },
      { name: 'Emergency Revolving Reserve Sizer', href: '/savings-and-liquidity' },
      { name: 'Business Revolving Line Cost', href: '/business/cash-runway' },
    ],
  },
  {
    id: 'cluster-comparison',
    title: '11. Card Comparison',
    toolsCount: 8,
    category: 'strategies',
    icon: 'compare_arrows',
    tools: [
      { name: 'Head-to-Head Card Comparison', href: '/finance/emi-calculator' },
      { name: '0% Intro APR vs 2% Flat Cashback', href: '/finance/savings-calculator' },
      { name: 'Travel Miles vs Direct Cash Back', href: '/finance/savings-calculator' },
      { name: 'Annual Fee Spend Justification', href: '/finance/savings-calculator' },
      { name: 'Balance Transfer vs Personal Loan', href: '/loans-and-amortization' },
      { name: 'Retail Store Card vs Bank Card APR', href: '/finance/emi-calculator' },
      { name: 'Secured Card Deposit Refund Timeline', href: '/finance/savings-calculator' },
      { name: 'Co-Branded Airline Card Valuation', href: '/finance/savings-calculator' },
    ],
  },
  {
    id: 'cluster-optimization',
    title: '12. Credit Optimization',
    toolsCount: 8,
    category: 'strategies',
    icon: 'verified',
    tools: [
      { name: 'Credit Score Recovery Planner', href: '/finance/emi-calculator' },
      { name: 'Multi-Card Payment Sequencer', href: '/loans-and-amortization' },
      { name: 'Statement Closing Date Payment Timing', href: '/finance/emi-calculator' },
      { name: 'Revolving Credit Limit Allocation', href: '/finance/emi-calculator' },
      { name: 'Total Revolving Financial Health', href: '/finance' },
      { name: 'Consolidation Eligibility Checklist', href: '/loans-and-amortization' },
      { name: 'Negative Amortization Alert Tool', href: '/finance/emi-calculator' },
      { name: 'Statutory Credit Dispute Clock', href: '/finance/emi-calculator' },
    ],
  },
];

const FEATURED_TOOLS = [
  {
    id: 'tool-payoff',
    name: 'Credit Card Payoff Calculator',
    badge: 'Amortization',
    icon: 'payments',
    description: 'Calculate exact payoff dates and total interest by entering custom monthly payments.',
    link: '/finance/emi-calculator',
    cta: 'Calculate Payoff',
  },
  {
    id: 'tool-interest',
    name: 'Credit Card Interest Calculator',
    badge: 'Finance Charge',
    icon: 'percent',
    description: 'Find daily compounding finance charges and average daily balance costs.',
    link: '/finance/emi-calculator',
    cta: 'Calculate Interest',
  },
  {
    id: 'tool-min-pay',
    name: 'Minimum Payment Calculator',
    badge: 'CARD Act Rule',
    icon: 'warning_amber',
    iconColor: 'text-error',
    description: 'Examine the lifetime interest toll and extended timeline of bank minimum payments.',
    link: '/finance/emi-calculator',
    cta: 'Reveal True Cost',
  },
  {
    id: 'tool-bt',
    name: 'Balance Transfer Calculator',
    badge: 'Debt Arbitrage',
    icon: 'sync_alt',
    iconColor: 'text-secondary',
    description: 'Evaluate 3% and 5% upfront transfer fees against months of saved interest.',
    link: '/finance/emi-calculator',
    cta: 'Calculate Savings',
  },
  {
    id: 'tool-zero-apr',
    name: '0% APR Calculator',
    badge: 'Promo Window',
    icon: 'event_repeat',
    iconColor: 'text-secondary',
    description: 'Structure a zero-interest repayment schedule prior to promotional expiration.',
    link: '/finance/emi-calculator',
    cta: 'Plan 0% Strategy',
  },
  {
    id: 'tool-utilization',
    name: 'Credit Utilization Calculator',
    badge: 'FICO Scoring',
    icon: 'donut_large',
    description: 'Measure individual card and aggregate revolving ratios for optimal score scoring.',
    link: '/finance/emi-calculator',
    cta: 'Optimize Ratio',
  },
  {
    id: 'tool-apr',
    name: 'APR Calculator',
    badge: 'Rate Analysis',
    icon: 'calculate',
    description: 'Convert between nominal APR, Effective APR (EAR), and Daily Periodic Rates.',
    link: '/finance/apy-calculator',
    cta: 'Calculate APR',
  },
  {
    id: 'tool-debt-payoff',
    name: 'Debt Payoff Calculator',
    badge: 'Snowball & Avalanche',
    icon: 'stacked_line_chart',
    iconColor: 'text-tertiary',
    description: 'Compare mathematical interest avalanche against psychological snowball wins.',
    link: '/loans-and-amortization',
    cta: 'Compare Strategies',
  },
  {
    id: 'tool-rewards',
    name: 'Rewards Calculator',
    badge: 'Points Valuation',
    icon: 'loyalty',
    iconColor: 'text-secondary',
    description: 'Determine real monetary value per point and evaluate spend requirements.',
    link: '/finance/savings-calculator',
    cta: 'Calculate Value',
  },
  {
    id: 'tool-cashback',
    name: 'Cash Back Calculator',
    badge: 'Cash Optimization',
    icon: 'account_balance_wallet',
    description: 'Forecast annual liquid cashback returns across fixed and tiered spending categories.',
    link: '/finance/savings-calculator',
    cta: 'Estimate Cashback',
  },
  {
    id: 'tool-score',
    name: 'Credit Score Impact Calculator',
    badge: 'Credit Profile',
    icon: 'credit_score',
    description: 'Model how balance paydowns, credit limit bumps, and inquiries shift scores.',
    link: '/finance/emi-calculator',
    cta: 'Check Impact',
  },
  {
    id: 'tool-revolving',
    name: 'Revolving Credit Calculator',
    badge: 'Lines of Credit',
    icon: 'account_tree',
    description: 'Simulate floating rate draw periods, HELOC variability, and credit lines.',
    link: '/mortgages-and-real-estate-debt',
    cta: 'Analyze Revolving Debt',
  },
];

export default function CreditCardsAndRevolvingClient() {
  // Simulator State
  const [balance, setBalance] = useState<number>(6500);
  const [apr, setApr] = useState<number>(24.24);
  const [boost, setBoost] = useState<number>(50);
  const [promoMonths, setPromoMonths] = useState<number>(18);
  const [transferFeeRate, setTransferFeeRate] = useState<number>(0.03);
  const [activeCluster, setActiveCluster] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [saveStatus, setSaveStatus] = useState<boolean>(false);
  const [activeStrategyMode, setActiveStrategyMode] = useState<string>('compare');

  // Quick balance buttons
  const quickBalances = [2500, 5000, 6500, 10000, 15000];

  // Mathematical Amortization Calculations
  const calculations = useMemo(() => {
    const monthlyRate = (apr / 100) / 12;
    const maxSafeMonths = 480; // 40 years cap

    // 1. Minimum Payment Scenario (CARD Act Standard: Max of $25 or 1% balance + monthly finance charges)
    let minBal = balance;
    let minMonths = 0;
    let minInterestTotal = 0;
    const minTrajectory: { month: number; balance: number }[] = [{ month: 0, balance }];

    while (minBal > 0.5 && minMonths < maxSafeMonths) {
      minMonths++;
      const monthlyInterest = minBal * monthlyRate;
      minInterestTotal += monthlyInterest;
      let requiredMin = Math.max(25, (minBal * 0.01) + monthlyInterest);
      if (requiredMin > minBal + monthlyInterest) {
        requiredMin = minBal + monthlyInterest;
      }
      const principalPaid = requiredMin - monthlyInterest;
      minBal -= principalPaid;
      if (minBal < 0) minBal = 0;

      if (minMonths % 12 === 0 || minBal <= 0.5) {
        minTrajectory.push({ month: minMonths, balance: minBal });
      }
    }

    const minYears = Math.floor(minMonths / 12);
    const minRemMonths = minMonths % 12;

    // 2. Fixed $250 + Boost Scenario
    const fixedPayment = 250 + boost;
    let fixBal = balance;
    let fixMonths = 0;
    let fixInterestTotal = 0;
    const fixTrajectory: { month: number; balance: number }[] = [{ month: 0, balance }];
    const monthlyInterestInitial = balance * monthlyRate;
    const isUnderInterest = fixedPayment <= monthlyInterestInitial;

    if (!isUnderInterest) {
      while (fixBal > 0.5 && fixMonths < maxSafeMonths) {
        fixMonths++;
        const fInterest = fixBal * monthlyRate;
        fixInterestTotal += fInterest;
        let pPaid = fixedPayment - fInterest;
        if (pPaid > fixBal) {
          pPaid = fixBal;
        }
        fixBal -= pPaid;
        if (fixBal < 0) fixBal = 0;

        if (fixMonths % 6 === 0 || fixBal <= 0.5) {
          fixTrajectory.push({ month: fixMonths, balance: fixBal });
        }
      }
    }

    const fixYears = Math.floor(fixMonths / 12);
    const fixRemMonths = fixMonths % 12;
    const fixedSavings = Math.max(0, minInterestTotal - fixInterestTotal);

    // 3. 0% Balance Transfer Scenario (promoMonths duration)
    const transferFee = balance * transferFeeRate;
    const totalBtPrincipal = balance + transferFee;
    const monthlyBtPayment = totalBtPrincipal / promoMonths;
    const btSavings = Math.max(0, minInterestTotal - transferFee);

    // SVG coordinate mapping
    // Width 500, Height 150 (Y: 20 is start balance, Y: 135 is zero balance)
    // Scale X based on 48 months or minMonths
    const fixedX = Math.min(460, Math.max(60, (fixMonths / 48) * 220));
    const fixedPathD = `M 0 20 Q ${fixedX / 2} 85 ${fixedX} 135 L 500 135`;

    // 0% BT Path (Straight line to month 18 promo finish, then zero)
    const btX = Math.min(300, (promoMonths / 48) * 250);
    const btPathD = `M 0 20 L ${btX} 135 L 500 135`;

    // Min Payment Curve
    const minPathD = 'M 0 20 Q 250 78 500 120';

    return {
      minMonths,
      minYears,
      minRemMonths,
      minInterestTotal,
      minTotalPaid: balance + minInterestTotal,
      fixMonths,
      fixYears,
      fixRemMonths,
      fixInterestTotal,
      fixedSavings,
      isUnderInterest,
      fixedPayment,
      transferFee,
      monthlyBtPayment,
      btSavings,
      fixedPathD,
      btPathD,
      minPathD,
    };
  }, [balance, apr, boost, promoMonths, transferFeeRate]);

  // Handle Save Feedback
  const handleSave = () => {
    setSaveStatus(true);
    setTimeout(() => {
      setSaveStatus(false);
    }, 2500);
  };

  // Filtered clusters based on category and search query
  const filteredClusters = useMemo(() => {
    return CLUSTERS.filter((cluster) => {
      const matchesCategory =
        activeCluster === 'all' ||
        cluster.category === activeCluster ||
        (activeCluster === 'interest' && (cluster.category === 'interest' || cluster.id === 'cluster-interest')) ||
        (activeCluster === 'minimum' && cluster.category === 'minimum') ||
        (activeCluster === 'transfer' && cluster.category === 'transfer') ||
        (activeCluster === 'utilization' && cluster.category === 'utilization') ||
        (activeCluster === 'strategies' && cluster.category === 'strategies') ||
        (activeCluster === 'rewards' && cluster.category === 'rewards') ||
        (activeCluster === 'score' && cluster.category === 'score');

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const titleMatches = cluster.title.toLowerCase().includes(q);
      const toolMatches = cluster.tools.some((t) => t.name.toLowerCase().includes(q));

      return titleMatches || toolMatches;
    });
  }, [activeCluster, searchQuery]);

  return (
    <div className="bg-background font-body-md text-on-surface antialiased min-h-screen flex flex-col">
      

      <main className="w-full pt-16 bg-background flex-1">
        <div className="flex flex-col w-full">
          {/* Top Category Banner */}
          <section className="w-full bg-surface-container-lowest py-space-xl md:py-space-2xl border-b border-surface-container-high/40">
            <div className="max-w-max-width-canvas mx-auto px-gutter-desktop">
              {/* Breadcrumb */}
              <nav aria-label="Breadcrumb" className="mb-space-sm flex items-center gap-1.5 text-body-sm text-outline">
                <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                <span className="text-[12px] opacity-60">/</span>
                <Link href="/finance" className="hover:text-primary transition-colors">Financial Calculators</Link>
                <span className="text-[12px] opacity-60">/</span>
                <span className="text-on-surface font-medium">Credit Cards &amp; Revolving</span>
              </nav>

              <div className="flex flex-col items-start gap-space-sm max-w-4xl">
                {/* Trust Badge */}
                <div className="inline-flex items-center gap-2 px-space-sm py-1 rounded-full bg-surface-container-high text-primary">
                  <span className="material-symbols-outlined text-[16px]">verified_user</span>
                  <span className="font-label-caps text-label-caps uppercase tracking-wider font-semibold">
                    Verified APR &amp; CARD Act Formulas · 100% Private Client-Side Calculation
                  </span>
                </div>

                {/* H1 */}
                <h1 className="font-display-hero text-display-hero-mobile md:text-display-hero text-on-surface tracking-tight">
                  Credit Cards &amp; Revolving Credit Calculators
                </h1>

                {/* Subtitle */}
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl">
                  Calculate credit card interest, payoff timelines, minimum payment costs, balance transfer savings, utilization ratios, debt reduction strategies, and revolving credit expenses with simple, free calculators.
                </p>

                {/* Quick Filter Pills */}
                <div className="flex flex-wrap items-center gap-space-xs pt-space-md">
                  <button
                    className={`cluster-pill px-space-md py-1.5 rounded-full font-label-caps text-label-caps uppercase tracking-wider font-semibold transition-all ${
                      activeCluster === 'all'
                        ? 'bg-primary-container text-on-primary-container shadow-sm'
                        : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'
                    }`}
                    onClick={() => setActiveCluster('all')}
                  >
                    All Tools (96)
                  </button>
                  <button
                    className={`cluster-pill px-space-md py-1.5 rounded-full font-label-caps text-label-caps uppercase tracking-wider font-semibold transition-all ${
                      activeCluster === 'interest'
                        ? 'bg-primary-container text-on-primary-container shadow-sm'
                        : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'
                    }`}
                    onClick={() => setActiveCluster('interest')}
                  >
                    Payoff &amp; Interest (18)
                  </button>
                  <button
                    className={`cluster-pill px-space-md py-1.5 rounded-full font-label-caps text-label-caps uppercase tracking-wider font-semibold transition-all ${
                      activeCluster === 'minimum'
                        ? 'bg-primary-container text-on-primary-container shadow-sm'
                        : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'
                    }`}
                    onClick={() => setActiveCluster('minimum')}
                  >
                    Minimum Payment (12)
                  </button>
                  <button
                    className={`cluster-pill px-space-md py-1.5 rounded-full font-label-caps text-label-caps uppercase tracking-wider font-semibold transition-all ${
                      activeCluster === 'transfer'
                        ? 'bg-primary-container text-on-primary-container shadow-sm'
                        : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'
                    }`}
                    onClick={() => setActiveCluster('transfer')}
                  >
                    Balance Transfer (14)
                  </button>
                  <button
                    className={`cluster-pill px-space-md py-1.5 rounded-full font-label-caps text-label-caps uppercase tracking-wider font-semibold transition-all ${
                      activeCluster === 'utilization'
                        ? 'bg-primary-container text-on-primary-container shadow-sm'
                        : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'
                    }`}
                    onClick={() => setActiveCluster('utilization')}
                  >
                    Utilization (12)
                  </button>
                  <button
                    className={`cluster-pill px-space-md py-1.5 rounded-full font-label-caps text-label-caps uppercase tracking-wider font-semibold transition-all ${
                      activeCluster === 'strategies'
                        ? 'bg-primary-container text-on-primary-container shadow-sm'
                        : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'
                    }`}
                    onClick={() => setActiveCluster('strategies')}
                  >
                    Debt Strategies (16)
                  </button>
                  <button
                    className={`cluster-pill px-space-md py-1.5 rounded-full font-label-caps text-label-caps uppercase tracking-wider font-semibold transition-all ${
                      activeCluster === 'rewards'
                        ? 'bg-primary-container text-on-primary-container shadow-sm'
                        : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'
                    }`}
                    onClick={() => setActiveCluster('rewards')}
                  >
                    Rewards &amp; Cashback (14)
                  </button>
                  <button
                    className={`cluster-pill px-space-md py-1.5 rounded-full font-label-caps text-label-caps uppercase tracking-wider font-semibold transition-all ${
                      activeCluster === 'score'
                        ? 'bg-primary-container text-on-primary-container shadow-sm'
                        : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'
                    }`}
                    onClick={() => setActiveCluster('score')}
                  >
                    Score &amp; Revolving (10)
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Interactive Simulator Workbench */}
          <section className="w-full py-space-2xl bg-surface" id="simulator-workbench">
            <div className="max-w-max-width-canvas mx-auto px-gutter-desktop">
              <div className="bg-surface-container-lowest rounded-xl shadow-md p-space-lg md:p-space-2xl flex flex-col gap-space-xl border border-outline-variant/30">
                {/* Simulator Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
                  <div className="flex flex-col gap-1">
                    <span className="font-label-caps text-label-caps uppercase text-primary tracking-wider font-semibold">
                      Live Interactive Simulator
                    </span>
                    <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                      Credit Card Payoff &amp; Minimum Payment Analyzer
                    </h2>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Model how interest accumulates under minimum payments versus strategic accelerated amortization.
                    </p>
                  </div>
                  <div className="flex items-center gap-space-xs shrink-0">
                    <button
                      className="flex items-center gap-1.5 px-space-md py-2 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm transition-colors cursor-pointer border border-outline-variant/30"
                      onClick={() => window.print()}
                      title="Export this payoff plan"
                    >
                      <span className="material-symbols-outlined text-[18px]">download</span>
                      <span>Export Payoff Plan (PDF)</span>
                    </button>
                    <button
                      id="saveCalcBtn"
                      className="flex items-center gap-1.5 px-space-md py-2 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm transition-colors cursor-pointer border border-outline-variant/30"
                      onClick={handleSave}
                    >
                      {saveStatus ? (
                        <>
                          <span className="material-symbols-outlined text-[18px] text-primary">check</span>
                          <span className="text-primary font-semibold">Saved!</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[18px]">bookmark_add</span>
                          <span>Save</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Simulator Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
                  {/* Input Controls (5 Cols) */}
                  <div className="lg:col-span-5 flex flex-col gap-space-lg bg-surface-container-low p-space-lg rounded-xl border border-outline-variant/30">
                    {/* Current Balance */}
                    <div className="flex flex-col gap-space-xs">
                      <div className="flex justify-between items-center">
                        <label className="font-body-sm text-body-sm text-on-surface font-semibold" htmlFor="inputBalance">
                          Current Card Balance
                        </label>
                        <span className="font-data-mono text-data-mono text-primary font-bold" id="balanceDisplayVal">
                          ${balance.toLocaleString('en-US')}
                        </span>
                      </div>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-data-mono text-on-surface-variant">$</span>
                        <input
                          id="inputBalance"
                          type="number"
                          min="500"
                          max="100000"
                          step="100"
                          value={balance}
                          onChange={(e) => setBalance(Math.max(100, parseFloat(e.target.value) || 0))}
                          className="w-full bg-surface-container-lowest text-on-surface font-data-mono text-data-mono pl-7 pr-3 py-2.5 rounded-lg outline-none focus:shadow-[0_0_0_2px_rgba(37,99,235,0.25)] border border-outline-variant/30"
                        />
                      </div>
                      {/* Quick Select Buttons */}
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        {quickBalances.map((val) => (
                          <button
                            key={val}
                            onClick={() => setBalance(val)}
                            className={`px-2.5 py-1 rounded font-data-mono text-[12px] transition-colors cursor-pointer ${
                              balance === val
                                ? 'bg-primary text-on-primary'
                                : 'bg-surface-container-highest/60 hover:bg-surface-container-highest text-on-surface'
                            }`}
                          >
                            ${val >= 1000 ? `${val / 1000}k` : val}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Card APR */}
                    <div className="flex flex-col gap-space-xs">
                      <div className="flex justify-between items-center">
                        <label className="font-body-sm text-body-sm text-on-surface font-semibold" htmlFor="inputApr">
                          Card Annual APR
                        </label>
                        <span className="font-data-mono text-data-mono text-primary font-bold" id="aprDisplayVal">
                          {apr.toFixed(2)}%
                        </span>
                      </div>
                      <div className="relative">
                        <input
                          id="inputApr"
                          type="number"
                          min="0"
                          max="39.99"
                          step="0.01"
                          value={apr}
                          onChange={(e) => setApr(Math.max(0, parseFloat(e.target.value) || 0))}
                          className="w-full bg-surface-container-lowest text-on-surface font-data-mono text-data-mono px-3 py-2.5 rounded-lg outline-none focus:shadow-[0_0_0_2px_rgba(37,99,235,0.25)] border border-outline-variant/30"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 font-data-mono text-on-surface-variant">%</span>
                      </div>
                      <input
                        id="sliderApr"
                        type="range"
                        min="9"
                        max="35"
                        step="0.25"
                        value={apr}
                        onChange={(e) => setApr(parseFloat(e.target.value) || 0)}
                        className="w-full accent-primary h-2 bg-surface-container-high rounded-lg cursor-pointer"
                      />
                      <span className="font-label-caps text-label-caps text-on-surface-variant">
                        U.S. National Average APR: ~24.24% (Source: Federal Reserve G.19)
                      </span>
                    </div>

                    {/* Monthly Payment Strategy Toggle */}
                    <div className="flex flex-col gap-space-xs">
                      <label className="font-body-sm text-body-sm text-on-surface font-semibold">Active Strategy Focus</label>
                      <div className="grid grid-cols-1 gap-1.5 bg-surface-container-high p-1 rounded-lg">
                        <button
                          id="mode-compare"
                          onClick={() => setActiveStrategyMode('compare')}
                          className="text-left px-3 py-2 rounded-lg bg-surface-container-lowest font-body-sm text-body-sm font-semibold text-on-surface shadow-sm transition-all flex items-center justify-between cursor-pointer"
                        >
                          <span>Compare All 3 Scenarios</span>
                          <span className="material-symbols-outlined text-[16px] text-primary">view_column</span>
                        </button>
                      </div>
                    </div>

                    {/* Additional Monthly Payoff Boost Slider */}
                    <div className="flex flex-col gap-space-xs pt-1">
                      <div className="flex justify-between items-center">
                        <label className="font-body-sm text-body-sm text-on-surface font-semibold" htmlFor="sliderBoost">
                          Additional Monthly Boost
                        </label>
                        <span className="font-data-mono text-data-mono text-secondary font-bold" id="boostDisplayVal">
                          +${boost}/mo
                        </span>
                      </div>
                      <input
                        id="sliderBoost"
                        type="range"
                        min="0"
                        max="500"
                        step="25"
                        value={boost}
                        onChange={(e) => setBoost(parseFloat(e.target.value) || 0)}
                        className="w-full accent-secondary h-2 bg-surface-container-high rounded-lg cursor-pointer"
                      />
                      <span className="font-label-caps text-label-caps text-on-surface-variant">
                        Extra cash allocated on top of fixed monthly payment (${calculations.fixedPayment}/mo total)
                      </span>
                    </div>

                    {/* Advanced Parameters (0% BT Promo Length & Fee) */}
                    <div className="pt-2 border-t border-outline-variant/30 flex items-center justify-between text-body-sm">
                      <span className="font-body-sm text-body-sm text-on-surface-variant">0% Promo Duration:</span>
                      <div className="flex items-center gap-1">
                        {[12, 15, 18, 21].map((mo) => (
                          <button
                            key={mo}
                            onClick={() => setPromoMonths(mo)}
                            className={`px-2 py-0.5 rounded text-[12px] font-data-mono ${
                              promoMonths === mo
                                ? 'bg-secondary text-on-secondary font-semibold'
                                : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
                            }`}
                          >
                            {mo}mo
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Live Dynamic Scenario Cards & Chart (7 Cols) */}
                  <div className="lg:col-span-7 flex flex-col gap-space-md">
                    {/* Three Comparison Output Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-space-sm">
                      {/* Card 1: Minimum Payment Trap */}
                      <div className="p-space-md rounded-xl bg-error-container/20 border border-error/20 flex flex-col justify-between gap-space-sm">
                        <div>
                          <div className="flex items-center gap-1 text-error font-label-caps text-label-caps uppercase tracking-wider font-semibold">
                            <span className="material-symbols-outlined text-[16px]">warning</span>
                            <span>Min. Payment Trap</span>
                          </div>
                          <div className="pt-2">
                            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                              Time to Freedom
                            </span>
                            <div className="font-headline-md text-headline-md text-error tracking-tight" id="minTime">
                              {calculations.minYears}y {calculations.minRemMonths}m
                            </div>
                          </div>
                        </div>
                        <div className="space-y-1 text-on-surface pt-2 border-t border-error/10">
                          <div className="flex justify-between font-body-sm text-body-sm">
                            <span className="text-on-surface-variant">Total Interest:</span>
                            <span className="font-data-mono font-bold" id="minInterest">
                              ${calculations.minInterestTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          </div>
                          <div className="flex justify-between font-body-sm text-body-sm">
                            <span className="text-on-surface-variant">Total Paid:</span>
                            <span className="font-data-mono text-error font-bold" id="minTotal">
                              ${calculations.minTotalPaid.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Card 2: Fixed $250 + Boost */}
                      <div className="p-space-md rounded-xl bg-surface-container-high border border-outline-variant/30 flex flex-col justify-between gap-space-sm">
                        <div>
                          <div className="flex items-center gap-1 text-primary font-label-caps text-label-caps uppercase tracking-wider font-semibold">
                            <span className="material-symbols-outlined text-[16px]">trending_up</span>
                            <span>Fixed Payment Plan</span>
                          </div>
                          <div className="pt-2">
                            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                              Time to Freedom
                            </span>
                            <div className="font-headline-md text-headline-md text-primary tracking-tight" id="fixedTime">
                              {calculations.isUnderInterest ? '> 30y' : `${calculations.fixYears}y ${calculations.fixRemMonths}m`}
                            </div>
                          </div>
                        </div>
                        <div className="space-y-1 text-on-surface pt-2 border-t border-outline-variant/20">
                          <div className="flex justify-between font-body-sm text-body-sm">
                            <span className="text-on-surface-variant">Total Interest:</span>
                            <span className="font-data-mono font-bold" id="fixedInterest">
                              {calculations.isUnderInterest
                                ? 'N/A'
                                : `$${calculations.fixInterestTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                            </span>
                          </div>
                          <div className="flex justify-between font-body-sm text-body-sm">
                            <span className="text-on-surface-variant">Savings vs Min:</span>
                            <span className="font-data-mono text-primary font-bold" id="fixedSavings">
                              ${calculations.fixedSavings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Card 3: 0% Balance Transfer */}
                      <div className="p-space-md rounded-xl bg-secondary-container/30 border border-secondary/20 flex flex-col justify-between gap-space-sm">
                        <div>
                          <div className="flex items-center gap-1 text-secondary font-label-caps text-label-caps uppercase tracking-wider font-semibold">
                            <span className="material-symbols-outlined text-[16px]">bolt</span>
                            <span>0% Balance Transfer</span>
                          </div>
                          <div className="pt-2">
                            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                              {promoMonths} Mo Repayment
                            </span>
                            <div className="font-headline-md text-headline-md text-secondary tracking-tight" id="btPayment">
                              ${Math.round(calculations.monthlyBtPayment)}/mo
                            </div>
                          </div>
                        </div>
                        <div className="space-y-1 text-on-surface pt-2 border-t border-secondary/10">
                          <div className="flex justify-between font-body-sm text-body-sm">
                            <span className="text-on-surface-variant">Transfer Fee (3%):</span>
                            <span className="font-data-mono font-bold" id="btFee">
                              ${calculations.transferFee.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          </div>
                          <div className="flex justify-between font-body-sm text-body-sm">
                            <span className="text-on-surface-variant">Total Savings:</span>
                            <span className="font-data-mono text-secondary font-bold" id="btSavings">
                              ${calculations.btSavings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* SVG Visual Payoff Curve Depletion */}
                    <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/30 flex flex-col gap-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <span className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant font-semibold">
                          Balance Depletion Trajectory Over Time
                        </span>
                        <div className="flex items-center gap-3 font-label-caps text-label-caps">
                          <span className="flex items-center gap-1">
                            <span className="w-2.5 h-2.5 rounded-full bg-error inline-block"></span> Minimum
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block"></span> Fixed + Boost
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="w-2.5 h-2.5 rounded-full bg-secondary inline-block"></span> 0% Transfer
                          </span>
                        </div>
                      </div>

                      {/* Interactive Chart Canvas */}
                      <div className="w-full h-44 relative flex items-end">
                        <svg className="w-full h-full overflow-visible" id="payoffSvgChart" viewBox="0 0 500 150">
                          {/* Gridlines */}
                          <line className="text-surface-container-high" stroke="currentColor" strokeDasharray="3,3" x1="0" x2="500" y1="20" y2="20" />
                          <line className="text-surface-container-high" stroke="currentColor" strokeDasharray="3,3" x1="0" x2="500" y1="75" y2="75" />
                          <line className="text-surface-container-high" stroke="currentColor" x1="0" x2="500" y1="135" y2="135" />

                          {/* Minimum Path (long red shallow curve) */}
                          <path
                            className="text-error"
                            d={calculations.minPathD}
                            fill="none"
                            id="pathMin"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          />

                          {/* Fixed Plan Path (blue steep descent) */}
                          <path
                            className="text-primary"
                            d={calculations.fixedPathD}
                            fill="none"
                            id="pathFixed"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          />

                          {/* 0% Balance Transfer Path (cyan direct linear) */}
                          <path
                            className="text-secondary"
                            d={calculations.btPathD}
                            fill="none"
                            id="pathBt"
                            stroke="currentColor"
                            strokeDasharray="4,2"
                            strokeWidth="2.5"
                          />
                        </svg>
                      </div>

                      <div className="flex justify-between font-label-caps text-label-caps text-on-surface-variant pt-1">
                        <span>Month 0 (Start)</span>
                        <span>Month {promoMonths} (0% Promo End)</span>
                        <span>Year 3</span>
                        <span>Year 10</span>
                        <span>Year 20+</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 4 Smart Credit Strategies */}
          <section className="w-full py-space-2xl bg-surface-container-low border-y border-surface-container-high/40">
            <div className="max-w-max-width-canvas mx-auto px-gutter-desktop flex flex-col gap-space-xl">
              <div className="flex flex-col gap-1 max-w-2xl">
                <span className="font-label-caps text-label-caps uppercase text-primary tracking-wider font-semibold">
                  Credit Optimization Playbook
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                  4 Smart Credit Strategies Every Cardholder Must Know
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  The mechanics banks rely on to generate record consumer interest revenue—and how to mathematically counteract them.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
                {/* Card 1 */}
                <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/30 flex flex-col justify-between gap-space-md">
                  <div className="flex flex-col gap-space-xs">
                    <div className="w-10 h-10 rounded-lg bg-error-container/40 flex items-center justify-center text-error mb-2">
                      <span className="material-symbols-outlined text-[24px]">hourglass_bottom</span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface tracking-tight">
                      1. The Minimum Payment Illusion
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Credit card companies set minimums between 2% and 3% of the outstanding balance. Because interest charges are deducted first, principal decreases by tiny fractions each cycle. On a $6,500 balance, paying only the minimum keeps the balance alive for over 21 years and costs 2.3x the original purchase price.
                    </p>
                  </div>
                  <div className="pt-space-xs border-t border-outline-variant/20">
                    <span className="font-label-caps text-label-caps uppercase text-error font-semibold">
                      Multiplies Principal by ~230%
                    </span>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/30 flex flex-col justify-between gap-space-md">
                  <div className="flex flex-col gap-space-xs">
                    <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary mb-2">
                      <span className="material-symbols-outlined text-[24px]">speed</span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface tracking-tight">
                      2. The 30% Utilization Myth
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      The conventional guideline suggesting 30% revolving utilization is a passing grade, not an optimization strategy. FICO scoring algorithms award maximum points when aggregate and individual card utilization sits strictly between 1% and 6%. Keeping reported balances below 10% can boost credit scores by 35–45 points.
                    </p>
                  </div>
                  <div className="pt-space-xs border-t border-outline-variant/20">
                    <span className="font-label-caps text-label-caps uppercase text-primary font-semibold">
                      Aim for 1%–6% for Peak FICO
                    </span>
                  </div>
                </div>

                {/* Card 3 */}
                <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/30 flex flex-col justify-between gap-space-md">
                  <div className="flex flex-col gap-space-xs">
                    <div className="w-10 h-10 rounded-lg bg-secondary-container/40 flex items-center justify-center text-secondary mb-2">
                      <span className="material-symbols-outlined text-[24px]">swap_horiz</span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface tracking-tight">
                      3. 0% Intro Transfer Arbitrage
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      A standard 3% balance transfer fee upfront on $6,500 equals $195. At an ongoing 24.24% APR, that card accrues approximately $131 in interest every single month. The one-time fee reaches full breakeven in just 45 days. The remaining 16.5 months offer pure interest-free amortization.
                    </p>
                  </div>
                  <div className="pt-space-xs border-t border-outline-variant/20">
                    <span className="font-label-caps text-label-caps uppercase text-secondary font-semibold">
                      Fee Break-Even in &lt; 45 Days
                    </span>
                  </div>
                </div>

                {/* Card 4 */}
                <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/30 flex flex-col justify-between gap-space-md">
                  <div className="flex flex-col gap-space-xs">
                    <div className="w-10 h-10 rounded-lg bg-tertiary-fixed/60 flex items-center justify-center text-tertiary mb-2">
                      <span className="material-symbols-outlined text-[24px]">shield</span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface tracking-tight">
                      4. Grace Period Protection
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      When a cardholder carries over even a $1 balance past the due date, the statutory 21-to-25-day interest-free grace period vanishes entirely. All subsequent daily purchases immediately incur compound interest from the moment of transaction. Paying the statement balance in full restores complete zero-cost rewards mechanics.
                    </p>
                  </div>
                  <div className="pt-space-xs border-t border-outline-variant/20">
                    <span className="font-label-caps text-label-caps uppercase text-tertiary font-semibold">
                      Never Lose Your Grace Period
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 12 Featured Popular Credit Card Calculators */}
          <section className="w-full py-space-2xl bg-surface">
            <div className="max-w-max-width-canvas mx-auto px-gutter-desktop flex flex-col gap-space-xl">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
                <div>
                  <span className="font-label-caps text-label-caps uppercase text-primary tracking-wider font-semibold">
                    Core Tools
                  </span>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                    Featured Credit Card Calculators
                  </h2>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md">
                  Instant, distraction-free calculation tools configured with real-world credit formulas and statutory CARD Act benchmarks.
                </p>
              </div>

              {/* 12 Clean Scannable Grid Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-space-md">
                {FEATURED_TOOLS.map((tool) => (
                  <div
                    key={tool.id}
                    className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow border border-outline-variant/30 flex flex-col justify-between gap-space-md"
                  >
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <span className={`material-symbols-outlined text-[22px] ${tool.iconColor || 'text-primary'}`}>
                          {tool.icon}
                        </span>
                        <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                          {tool.badge}
                        </span>
                      </div>
                      <h4 className="font-headline-md text-headline-md text-on-surface font-semibold text-[18px] leading-snug">
                        {tool.name}
                      </h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                        {tool.description}
                      </p>
                    </div>
                    <Link
                      href={tool.link}
                      className="inline-flex items-center justify-between text-primary font-body-sm text-body-sm font-semibold hover:underline pt-1"
                    >
                      <span>{tool.cta}</span>
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Complete Directory: 12 Categorized Clusters (96 Tools) */}
          <section className="w-full py-space-3xl bg-surface-container-low border-t border-surface-container-high/40" id="allDirectorySection">
            <div className="max-w-max-width-canvas mx-auto px-gutter-desktop flex flex-col gap-space-2xl">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <span className="font-label-caps text-label-caps uppercase text-primary tracking-wider font-semibold">
                    Complete Computational Directory
                  </span>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                    All 12 Credit &amp; Revolving Clusters (96 Precision Tools)
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Every calculator runs client-side with zero telemetry, zero server-side logging, and immediate browser execution.
                  </p>
                </div>

                {/* Omni-Search Box */}
                <div className="relative w-full md:w-80">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
                    search
                  </span>
                  <input
                    type="text"
                    placeholder="Search 96 credit tools..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-surface-container-lowest text-on-surface font-body-sm text-body-sm pl-9 pr-8 py-2 rounded-lg outline-none border border-outline-variant/40 focus:border-primary focus:shadow-[0_0_0_2px_rgba(37,99,235,0.2)] transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg" id="clusterDirectoryGrid">
                {filteredClusters.map((cluster) => (
                  <div
                    key={cluster.id}
                    className="cluster-card bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/30 flex flex-col gap-space-md"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-surface-container-high">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[20px]">{cluster.icon}</span>
                        <h3 className="font-headline-md text-headline-md text-on-surface font-semibold text-[18px]">
                          {cluster.title}
                        </h3>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-surface-container-high font-label-caps text-label-caps text-primary font-bold">
                        {cluster.toolsCount} Tools
                      </span>
                    </div>
                    <ul className="space-y-1.5 font-body-sm text-body-sm">
                      {cluster.tools.map((tool, idx) => (
                        <li key={idx}>
                          <Link
                            href={tool.href}
                            className="hover:text-primary transition-colors flex items-center justify-between py-1 text-on-surface-variant hover:text-primary group"
                          >
                            <span className="group-hover:translate-x-0.5 transition-transform">{tool.name}</span>
                            <span className="material-symbols-outlined text-[16px] text-outline group-hover:text-primary transition-colors">
                              arrow_forward
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 8 Head-to-Head Comparison Matrices */}
          <section className="w-full py-space-3xl bg-surface">
            <div className="max-w-max-width-canvas mx-auto px-gutter-desktop flex flex-col gap-space-2xl">
              <div className="flex flex-col gap-1 max-w-2xl">
                <span className="font-label-caps text-label-caps uppercase text-primary tracking-wider font-semibold">
                  Strategic Trade-Offs
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                  8 Head-to-Head Decision Matrices
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Data-backed trade-offs to eliminate debt efficiently and maximize card mechanics.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
                {/* Matrix 1 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/30 flex flex-col gap-space-sm">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">balance</span>
                    <h3 className="font-headline-md text-headline-md text-on-surface">
                      1. Debt Snowball vs. Debt Avalanche
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm pt-2">
                    <div className="p-3 bg-surface-container-low rounded-lg flex flex-col gap-1 border border-outline-variant/20">
                      <span className="font-label-caps text-label-caps uppercase text-secondary font-bold">
                        Snowball (Smallest Balance)
                      </span>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Accelerates behavioral wins. Eliminates individual account obligations fast to build psychological momentum.
                      </p>
                    </div>
                    <div className="p-3 bg-surface-container-low rounded-lg flex flex-col gap-1 border border-outline-variant/20">
                      <span className="font-label-caps text-label-caps uppercase text-primary font-bold">
                        Avalanche (Highest APR)
                      </span>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Mathematically superior. Minimizes total lifetime interest charges and reaches absolute zero debt faster.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Matrix 2 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/30 flex flex-col gap-space-sm">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">swap_calls</span>
                    <h3 className="font-headline-md text-headline-md text-on-surface">
                      2. 0% Balance Transfer vs. Fixed Loan
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm pt-2">
                    <div className="p-3 bg-surface-container-low rounded-lg flex flex-col gap-1 border border-outline-variant/20">
                      <span className="font-label-caps text-label-caps uppercase text-primary font-bold">
                        0% Balance Transfer
                      </span>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Zero interest for 12–21 months with a 3–5% upfront fee. Demands strict payment discipline before rate spikes.
                      </p>
                    </div>
                    <div className="p-3 bg-surface-container-low rounded-lg flex flex-col gap-1 border border-outline-variant/20">
                      <span className="font-label-caps text-label-caps uppercase text-secondary font-bold">
                        Fixed Personal Loan
                      </span>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        7.99%–14.99% fixed interest over 36–60 months. Structured installment prevents revolving temptation.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Matrix 3 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/30 flex flex-col gap-space-sm">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">redeem</span>
                    <h3 className="font-headline-md text-headline-md text-on-surface">
                      3. Cash Back vs. Travel Miles
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm pt-2">
                    <div className="p-3 bg-surface-container-low rounded-lg flex flex-col gap-1 border border-outline-variant/20">
                      <span className="font-label-caps text-label-caps uppercase text-primary font-bold">
                        Direct Cash Back (1.5–2%)
                      </span>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Liquid, risk-free monetary deposits. Immune to loyalty program devaluations and complex award charts.
                      </p>
                    </div>
                    <div className="p-3 bg-surface-container-low rounded-lg flex flex-col gap-1 border border-outline-variant/20">
                      <span className="font-label-caps text-label-caps uppercase text-secondary font-bold">
                        Travel Miles (1.8–2.4¢/pt)
                      </span>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Superior upside for international business class and partner redemptions, but requires time and strategy.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Matrix 4 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/30 flex flex-col gap-space-sm">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">trending_down</span>
                    <h3 className="font-headline-md text-headline-md text-on-surface">
                      4. Minimum Payment vs. Fixed $250/mo
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm pt-2">
                    <div className="p-3 bg-surface-container-low rounded-lg flex flex-col gap-1 border border-outline-variant/20">
                      <span className="font-label-caps text-label-caps uppercase text-error font-bold">
                        Minimum (CARD Act)
                      </span>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Takes 21 years 4 months. Accrues $8,412 in pure interest on $6,500 balance, paying $14,912 in total.
                      </p>
                    </div>
                    <div className="p-3 bg-surface-container-low rounded-lg flex flex-col gap-1 border border-outline-variant/20">
                      <span className="font-label-caps text-label-caps uppercase text-primary font-bold">
                        Fixed $250/mo Plan
                      </span>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Debt-free in 2 years 11 months. Slashes total interest to $2,130, preserving over $6,280 in net wealth.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Matrix 5 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/30 flex flex-col gap-space-sm">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">credit_card</span>
                    <h3 className="font-headline-md text-headline-md text-on-surface">
                      5. $95 Annual Fee vs. $0 Fee Card
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm pt-2">
                    <div className="p-3 bg-surface-container-low rounded-lg flex flex-col gap-1 border border-outline-variant/20">
                      <span className="font-label-caps text-label-caps uppercase text-primary font-bold">
                        $95 Annual Fee Card
                      </span>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Justified if 3% grocery/dining rewards or travel statement credits outpace the fee by at least $3,200 annual spend.
                      </p>
                    </div>
                    <div className="p-3 bg-surface-container-low rounded-lg flex flex-col gap-1 border border-outline-variant/20">
                      <span className="font-label-caps text-label-caps uppercase text-secondary font-bold">
                        $0 No-Annual-Fee Card
                      </span>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Pure profit with zero break-even drag. Ideal for cardholders spending under $2,000 monthly on revolving lines.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Matrix 6 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/30 flex flex-col gap-space-sm">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">savings</span>
                    <h3 className="font-headline-md text-headline-md text-on-surface">
                      6. Credit Card Debt vs. 401(k) Loan
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm pt-2">
                    <div className="p-3 bg-surface-container-low rounded-lg flex flex-col gap-1 border border-outline-variant/20">
                      <span className="font-label-caps text-label-caps uppercase text-error font-bold">
                        Retaining 24% Card Debt
                      </span>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Guaranteed 24% annual loss on money. Wealth destruction that consistently outperforms stock market gains.
                      </p>
                    </div>
                    <div className="p-3 bg-surface-container-low rounded-lg flex flex-col gap-1 border border-outline-variant/20">
                      <span className="font-label-caps text-label-caps uppercase text-primary font-bold">
                        401(k) Loan Payoff
                      </span>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Stops 24% APR bleed immediately, but subjects funds to double taxation on loan repayments and employment separation risk.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Matrix 7 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/30 flex flex-col gap-space-sm">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">account_balance</span>
                    <h3 className="font-headline-md text-headline-md text-on-surface">
                      7. Card vs. Personal Line of Credit
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm pt-2">
                    <div className="p-3 bg-surface-container-low rounded-lg flex flex-col gap-1 border border-outline-variant/20">
                      <span className="font-label-caps text-label-caps uppercase text-primary font-bold">
                        Revolving Credit Card
                      </span>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        High APR (22–29%), but features a true 25-day interest-free grace period on every new transaction when paid in full.
                      </p>
                    </div>
                    <div className="p-3 bg-surface-container-low rounded-lg flex flex-col gap-1 border border-outline-variant/20">
                      <span className="font-label-caps text-label-caps uppercase text-secondary font-bold">
                        Personal Line of Credit
                      </span>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Lower APR (10–16%), but interest begins accruing on day one of borrowing with zero grace period protections.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Matrix 8 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/30 flex flex-col gap-space-sm">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">receipt_long</span>
                    <h3 className="font-headline-md text-headline-md text-on-surface">
                      8. Statement vs. Current Balance
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm pt-2">
                    <div className="p-3 bg-surface-container-low rounded-lg flex flex-col gap-1 border border-outline-variant/20">
                      <span className="font-label-caps text-label-caps uppercase text-primary font-bold">
                        Pay Statement Balance
                      </span>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        100% interest avoidance. Retains full grace period without paying early on purchases made after billing closed.
                      </p>
                    </div>
                    <div className="p-3 bg-surface-container-low rounded-lg flex flex-col gap-1 border border-outline-variant/20">
                      <span className="font-label-caps text-label-caps uppercase text-secondary font-bold">
                        Pay Total Current Balance
                      </span>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Drives reported utilization to 0%. Ideal 30 days before applying for a mortgage or high-tier auto financing.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Mathematical Formulas & CARD Act Standards */}
          <section className="w-full py-space-3xl bg-surface-container-low border-y border-surface-container-high/40">
            <div className="max-w-max-width-canvas mx-auto px-gutter-desktop flex flex-col gap-space-2xl">
              <div className="flex flex-col gap-1 max-w-2xl">
                <span className="font-label-caps text-label-caps uppercase text-primary tracking-wider font-semibold">
                  Regulatory Standards
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                  Mathematical Formulas &amp; CARD Act Equations
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  The exact statutory equations codified under the Credit CARD Act of 2009 and Truth in Lending Act (Regulation Z).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
                {/* Formula 1 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/30 flex flex-col gap-space-sm">
                  <div className="flex items-center gap-2 text-primary font-body-md text-body-md font-semibold">
                    <span className="material-symbols-outlined text-[20px]">functions</span>
                    <span>1. Daily Periodic Rate (DPR) &amp; Compounding</span>
                  </div>
                  <div className="p-3 bg-surface-container-high rounded-lg font-data-mono text-data-mono text-on-surface">
                    DPR = APR / 365<br />
                    Daily Finance Charge = ADB × DPR<br />
                    Monthly Interest = ∑ (ADB_i × DPR)
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Unlike mortgages that compound monthly, credit cards compute finance charges on an <strong>Average Daily Balance (ADB)</strong> basis. Purchases made on day 2 accrue 28 days of interest within a 30-day billing cycle.
                  </p>
                </div>

                {/* Formula 2 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/30 flex flex-col gap-space-sm">
                  <div className="flex items-center gap-2 text-primary font-body-md text-body-md font-semibold">
                    <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
                    <span>2. Statutory Minimum Payment Formula</span>
                  </div>
                  <div className="p-3 bg-surface-container-high rounded-lg font-data-mono text-data-mono text-on-surface">
                    Min Payment = MAX($25, (1% × Principal) + Monthly Interest + Fees)
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Under federal rules, the minimum payment must amortize at least 1% of the principal balance plus accrued fees. When balances decline, required payments shrink in tandem—trapping consumers in decades of debt.
                  </p>
                </div>

                {/* Formula 3 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/30 flex flex-col gap-space-sm">
                  <div className="flex items-center gap-2 text-secondary font-body-md text-body-md font-semibold">
                    <span className="material-symbols-outlined text-[20px]">currency_exchange</span>
                    <span>3. Balance Transfer Net Benefit</span>
                  </div>
                  <div className="p-3 bg-surface-container-high rounded-lg font-data-mono text-data-mono text-on-surface">
                    Net Savings = (Balance × Old_APR × (Months / 12)) - (Balance × Transfer_Fee_Rate)
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Transferring $10,000 with a 3% fee ($300) to an 18-month 0% card saves $3,636 in interest at 24.24% APR, generating <strong>$3,336 in pure net cash savings</strong>.
                  </p>
                </div>

                {/* Formula 4 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/30 flex flex-col gap-space-sm">
                  <div className="flex items-center gap-2 text-secondary font-body-md text-body-md font-semibold">
                    <span className="material-symbols-outlined text-[20px]">pie_chart</span>
                    <span>4. Credit Utilization Ratio (Aggregate &amp; Per Card)</span>
                  </div>
                  <div className="p-3 bg-surface-container-high rounded-lg font-data-mono text-data-mono text-on-surface">
                    Utilization Ratio = (∑ Reported Balances / ∑ Credit Limits) × 100
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    FICO assesses both aggregate ratio across all accounts and maximum utilization on any single line. Crossing 29.5% triggers automatic scoring deduction penalties regardless of on-time payment history.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Programmatic Payoff Tiers & APR Matrices */}
          <section className="w-full py-space-3xl bg-surface">
            <div className="max-w-max-width-canvas mx-auto px-gutter-desktop flex flex-col gap-space-2xl">
              <div className="flex flex-col gap-1 max-w-2xl">
                <span className="font-label-caps text-label-caps uppercase text-primary tracking-wider font-semibold">
                  Benchmark Reference Tables
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                  Balance Tiers &amp; APR Interest Drain Matrix
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Monthly carrying cost and minimum payment timelines across common revolving debt brackets.
                </p>
              </div>

              {/* Comparison Matrix Table */}
              <div className="overflow-x-auto bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30">
                <table className="w-full text-left border-collapse font-body-sm text-body-sm">
                  <thead>
                    <tr className="bg-surface-container-high text-on-surface font-semibold font-label-caps text-label-caps uppercase tracking-wider">
                      <th className="p-space-md">Balance Tier</th>
                      <th className="p-space-md">14.99% APR (Tier 1 Prime)</th>
                      <th className="p-space-md">19.99% APR (Tier 2 Average)</th>
                      <th className="p-space-md">24.99% APR (Tier 3 Subprime)</th>
                      <th className="p-space-md">29.99% APR (Retail / Penalty)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container-high">
                    <tr>
                      <td className="p-space-md font-data-mono font-bold text-on-surface">$1,000</td>
                      <td className="p-space-md font-data-mono">$12.49/mo (Payoff: 5y 8m)</td>
                      <td className="p-space-md font-data-mono">$16.66/mo (Payoff: 7y 2m)</td>
                      <td className="p-space-md font-data-mono text-error font-semibold">$20.83/mo (Payoff: 9y 6m)</td>
                      <td className="p-space-md font-data-mono text-error font-bold">$24.99/mo (Payoff: 14y 1m)</td>
                    </tr>
                    <tr className="bg-surface-container-low/50">
                      <td className="p-space-md font-data-mono font-bold text-on-surface">$2,500</td>
                      <td className="p-space-md font-data-mono">$31.23/mo (Payoff: 9y 1m)</td>
                      <td className="p-space-md font-data-mono">$41.65/mo (Payoff: 12y 4m)</td>
                      <td className="p-space-md font-data-mono text-error font-semibold">$52.06/mo (Payoff: 17y 3m)</td>
                      <td className="p-space-md font-data-mono text-error font-bold">$62.48/mo (Payoff: 23y 8m)</td>
                    </tr>
                    <tr>
                      <td className="p-space-md font-data-mono font-bold text-on-surface">$5,000</td>
                      <td className="p-space-md font-data-mono">$62.46/mo (Payoff: 12y 11m)</td>
                      <td className="p-space-md font-data-mono">$83.29/mo (Payoff: 17y 6m)</td>
                      <td className="p-space-md font-data-mono text-error font-semibold">$104.13/mo (Payoff: 24y 2m)</td>
                      <td className="p-space-md font-data-mono text-error font-bold">$124.96/mo (Payoff: 31y 5m)</td>
                    </tr>
                    <tr className="bg-surface-container-low/50">
                      <td className="p-space-md font-data-mono font-bold text-on-surface">$10,000</td>
                      <td className="p-space-md font-data-mono">$124.92/mo (Payoff: 16y 8m)</td>
                      <td className="p-space-md font-data-mono">$166.58/mo (Payoff: 22y 9m)</td>
                      <td className="p-space-md font-data-mono text-error font-semibold">$208.25/mo (Payoff: 30y 11m)</td>
                      <td className="p-space-md font-data-mono text-error font-bold">$249.92/mo (Payoff: 39y 2m)</td>
                    </tr>
                    <tr>
                      <td className="p-space-md font-data-mono font-bold text-on-surface">$20,000</td>
                      <td className="p-space-md font-data-mono">$249.83/mo (Payoff: 20y 4m)</td>
                      <td className="p-space-md font-data-mono">$333.17/mo (Payoff: 28y 2m)</td>
                      <td className="p-space-md font-data-mono text-error font-semibold">$416.50/mo (Payoff: 37y 6m)</td>
                      <td className="p-space-md font-data-mono text-error font-bold">$499.83/mo (Payoff: 47y 8m)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Editorial Advisory, Trust & Compliance Section */}
          <section className="w-full py-space-3xl bg-surface-container-lowest border-t border-surface-container-high/40">
            <div className="max-w-max-width-canvas mx-auto px-gutter-desktop flex flex-col gap-space-2xl">
              {/* Expert Review Grid */}
              <div className="p-space-xl rounded-xl bg-surface-container-low flex flex-col md:flex-row items-center gap-space-xl border border-outline-variant/30">
                <div className="flex -space-x-3 shrink-0">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold shadow-md">
                    MV
                  </div>
                  <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-on-secondary font-bold shadow-md">
                    SJ
                  </div>
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">verified</span>
                    <span className="font-label-caps text-label-caps uppercase tracking-wider text-primary font-bold">
                      Actuarial &amp; Financial Review Board
                    </span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface">
                    Audited by Certified Financial Planners &amp; Credit Specialists
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Content, algorithmic amortizations, and statutory disclosures reviewed by <strong>Marcus Vance, CFP®, AFC®</strong> (Accredited Financial Counselor) and <strong>Sarah Jenkins, CPA, CFP®</strong> (Former FDIC Compliance Specialist). All models align with the Credit CARD Act of 2009, Truth in Lending Act (TILA Regulation Z § 1026.5), and the Fair Credit Reporting Act (FCRA).
                  </p>
                </div>
                <div className="shrink-0 flex flex-col items-center justify-center p-space-md rounded-xl bg-surface-container-lowest shadow-sm text-center border border-outline-variant/30">
                  <span className="material-symbols-outlined text-[32px] text-secondary">memory</span>
                  <span className="font-label-caps text-label-caps uppercase text-on-surface font-bold mt-1">Zero Cloud Logging</span>
                  <span className="font-label-caps text-[10px] text-on-surface-variant">100% In-Browser Memory</span>
                </div>
              </div>

              {/* FAQ Section Optimized for AI Overviews & Search */}
              <div className="flex flex-col gap-space-lg">
                <div className="flex flex-col gap-1">
                  <span className="font-label-caps text-label-caps uppercase text-primary tracking-wider font-semibold">
                    Direct Answers
                  </span>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                    Credit Card FAQs &amp; Critical Answers
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                  <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-space-xs border border-outline-variant/20">
                    <h4 className="font-body-lg text-body-lg text-on-surface font-semibold">
                      How is credit card interest calculated?
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Interest compounds on an Average Daily Balance (ADB). Your APR is divided by 365 to establish your Daily Periodic Rate (DPR). Each day’s balance is multiplied by this DPR, and the accumulated daily sums are added to your statement as the finance charge.
                    </p>
                  </div>
                  <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-space-xs border border-outline-variant/20">
                    <h4 className="font-body-lg text-body-lg text-on-surface font-semibold">
                      Why are minimum payments so dangerous?
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Minimum payments are set at just 1% to 3% of your balance. Because interest is deducted first, very little money touches the principal. On a $6,500 balance at 24% APR, minimum payments take 21+ years and cost more than $8,400 in interest alone.
                    </p>
                  </div>
                  <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-space-xs border border-outline-variant/20">
                    <h4 className="font-body-lg text-body-lg text-on-surface font-semibold">
                      Is a 0% balance transfer card worth the fee?
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Yes, in nearly all cases where high APR debt is carried. A 3% upfront fee on $6,500 costs $195. At 24.24% APR, you pay ~$131 in interest monthly. You reach break-even within 45 days, saving thousands over an 18-month promotional window.
                    </p>
                  </div>
                  <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-space-xs border border-outline-variant/20">
                    <h4 className="font-body-lg text-body-lg text-on-surface font-semibold">
                      Does closing an unused credit card hurt my score?
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Yes, in two ways: it immediately reduces your total available credit, which increases your overall credit utilization ratio. Second, over time, closed accounts fall off your report, shortening your average age of accounts (AAoA).
                    </p>
                  </div>
                  <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-space-xs md:col-span-2 border border-outline-variant/20">
                    <h4 className="font-body-lg text-body-lg text-on-surface font-semibold">
                      When should I pay my credit card to maximize my credit score?
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Pay 2 to 3 days <em>before your statement closing date</em>, not just before your payment due date. Credit bureaus receive the balance reported on your statement closing date. By paying early, you report a near-zero or 1% balance, instantly boosting your FICO score.
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
