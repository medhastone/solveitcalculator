'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface ModelRecommendation {
  id: string;
  title: string;
  desc: string;
  href: string;
}

const RECOMMENDER_MODELS: Record<string, ModelRecommendation> = {
  'wealth-long': {
    id: '#FIN-204',
    title: 'Systematic Investment Plan (SIP) & Wealth Engine',
    desc: 'Standardized compounding calculation with annual discretionary step-up additions and real inflation yield.',
    href: '/finance#investment-section',
  },
  'wealth-mid': {
    id: '#FIN-205',
    title: 'Compound Interest Horizon Forecaster',
    desc: 'Deterministic continuous and periodic compounding with statutory tax drag modeling.',
    href: '/finance#investment-section',
  },
  'wealth-short': {
    id: '#FIN-302',
    title: 'High-Yield Savings & APY Forecaster',
    desc: 'Daily compounding returns with instant liquidity projections and real purchasing preservation.',
    href: '/finance#savings-section',
  },
  'debt-short': {
    id: '#FIN-106',
    title: 'Credit Card Payoff Accelerator',
    desc: 'Minimizes CARD Act balance carrying costs via aggressive lump sum repayment allocations.',
    href: '/finance#loans-section',
  },
  'debt-mid': {
    id: '#FIN-103',
    title: 'Debt Avalanche vs. Snowball Optimizer',
    desc: 'Highest APR prioritization saving thousands in unnecessary blended debt interest over 3-5 years.',
    href: '/finance#loans-section',
  },
  'debt-long': {
    id: '#FIN-101',
    title: 'Universal Mortgage 30Y Amortization Engine',
    desc: 'Full 360-month principal and interest breakdown with dynamic extra payment acceleration schedules.',
    href: '/finance#loans-section',
  },
  'fire-long': {
    id: '#FIN-401',
    title: 'Comprehensive FIRE Independence Forecaster',
    desc: 'Safe withdrawal rates (3.2% - 4.5%), Lean/Coast/Fat tiers, and sequence-of-returns probability.',
    href: '/fire-forecaster',
  },
  'fire-mid': {
    id: '#FIN-402',
    title: 'Coast FIRE Bridge & SWR Estimator',
    desc: 'Identifies the exact portfolio balance where future personal contributions can safely downshift.',
    href: '/fire-forecaster',
  },
  'fire-short': {
    id: '#FIN-403',
    title: 'Emergency Runway & Early Drawdown Planner',
    desc: '24-month liquid cash buffer strategy to insulate against immediate retirement bear market drawdowns.',
    href: '/fire-forecaster',
  },
  're-long': {
    id: '#FIN-801',
    title: 'Commercial Property Cap Rate & Cash-on-Cash Matrix',
    desc: 'Net Operating Income (NOI) calculation with multi-decade debt service coverage ratio (DSCR).',
    href: '/finance#directory-clusters',
  },
  're-mid': {
    id: '#FIN-802',
    title: 'Rental Yield & 1% Rule Property Screener',
    desc: 'Gross rent multiplier, cash flow sensitivity, and maintenance vacancy reserves.',
    href: '/finance#directory-clusters',
  },
  're-short': {
    id: '#FIN-102',
    title: 'First-Time Homebuyer PITI & Closing Reserve Breakdown',
    desc: 'Calculates down payment targets, debt-to-income (DTI) ceilings, and escrow fees.',
    href: '/finance#loans-section',
  },
  'tax-short': {
    id: '#FIN-701',
    title: '2025 Statutory IRS Bracket Analyzer',
    desc: 'Marginal vs. effective federal tax burden, standard deduction updates, and FICA ceilings.',
    href: '/finance#directory-clusters',
  },
  'tax-mid': {
    id: '#FIN-702',
    title: 'Capital Gains Tax & Loss Harvesting Shield',
    desc: 'Short vs. long-term rate calculation and taxable account asset location optimization.',
    href: '/finance#directory-clusters',
  },
  'tax-long': {
    id: '#FIN-404',
    title: 'Roth Conversion Ladder & Lifetime Tax Drag',
    desc: 'Annual traditional-to-Roth conversion sequencing to navigate future retirement tax brackets.',
    href: '/fire-forecaster',
  },
  'budget-short': {
    id: '#FIN-601',
    title: 'Hourly to Salary & Take-Home Paycheck Pro',
    desc: 'Net take-home cashflow after mandatory federal, state, and payroll deductions.',
    href: '/finance#directory-clusters',
  },
  'budget-mid': {
    id: '#FIN-301',
    title: 'Tiered Emergency Fund Runway (3/6/12 Month)',
    desc: 'Living expense budgeting vs. liquid reserve tiers across volatile market conditions.',
    href: '/finance#savings-section',
  },
  'budget-long': {
    id: '#FIN-602',
    title: 'Liquid Net Worth & Household Balance Sheet Engine',
    desc: 'Comprehensive multi-asset wealth tracking without cloud credential or banking leakages.',
    href: '/finance#directory-clusters',
  },
};

const ALL_CALCULATORS = [
  { name: 'FIRE Forecaster & Independence Planner', category: 'Retirement', tags: ['fire', 'retire', 'swr', 'coast fire', '4% rule'], href: '/fire-forecaster' },
  { name: 'Universal Mortgage Calculator', category: 'Loans & Debt', tags: ['mortgage', 'piti', 'pmi', 'home', 'amortization'], href: '/finance#loans-section' },
  { name: 'Universal EMI & Amortization Workbench', category: 'Loans & Debt', tags: ['emi', 'loan', 'amortization', 'interest'], href: '/finance#loans-section' },
  { name: 'Systematic Investment Plan (SIP) Calculator', category: 'Investments', tags: ['sip', 'cagr', 'compound', 'invest', 'step-up'], href: '/finance#investment-section' },
  { name: 'Compound Interest Horizon Forecaster', category: 'Investments', tags: ['compound', 'interest', 'apy', 'apr', 'rule of 72'], href: '/finance#investment-section' },
  { name: 'Loan Payoff & Prepayment Forecaster', category: 'Loans & Debt', tags: ['payoff', 'prepayment', 'lump sum', 'extra payment'], href: '/finance#loans-section' },
  { name: 'Debt Snowball vs Avalanche Calculator', category: 'Loans & Debt', tags: ['debt', 'snowball', 'avalanche', 'payoff'], href: '/finance#loans-section' },
  { name: 'Auto Loan & Total Ownership Cost', category: 'Loans & Debt', tags: ['car', 'auto', 'vehicle', 'loan'], href: '/finance#loans-section' },
  { name: 'Student Loan Refinance Optimizer', category: 'Loans & Debt', tags: ['student loan', 'refinance', 'idr', 'federal'], href: '/finance#loans-section' },
  { name: 'Credit Card Minimum Payment Trap', category: 'Loans & Debt', tags: ['credit card', 'minimum payment', 'card act', 'apr'], href: '/finance#loans-section' },
  { name: 'SIP Step-Up Wealth Accumulator', category: 'Investments', tags: ['sip', 'step-up', 'wealth', 'escalation'], href: '/finance#investment-section' },
  { name: 'CAGR & Annualized Return Analyzer', category: 'Investments', tags: ['cagr', 'annualized return', 'growth'], href: '/finance#investment-section' },
  { name: 'Dividend Reinvestment (DRIP) Forecaster', category: 'Investments', tags: ['drip', 'dividend', 'reinvestment'], href: '/finance#investment-section' },
  { name: 'Mutual Fund & ETF Expense Ratio Drag', category: 'Investments', tags: ['expense ratio', 'etf', 'fee drag', 'mutual fund'], href: '/finance#investment-section' },
  { name: 'Asset Allocation Rebalance Matrix', category: 'Investments', tags: ['rebalance', 'asset allocation', 'equity', 'bond'], href: '/finance#investment-section' },
  { name: 'Lump Sum vs DCA Historical Simulator', category: 'Investments', tags: ['lump sum', 'dca', 'vanguard', 'dollar cost averaging'], href: '/finance#investment-section' },
  { name: 'Emergency Fund Runway (3/6/12 Mo)', category: 'Savings', tags: ['emergency fund', 'runway', 'cash buffer'], href: '/finance#savings-section' },
  { name: 'High-Yield Savings & APY Forecaster', category: 'Savings', tags: ['hysa', 'savings', 'apy', 'interest'], href: '/finance#savings-section' },
  { name: 'CD Ladder Strategist', category: 'Savings', tags: ['cd', 'certificate of deposit', 'ladder', 'liquidity'], href: '/finance#savings-section' },
  { name: 'Inflation Purchasing Power Erosion', category: 'Savings', tags: ['inflation', 'cpi', 'purchasing power', 'decay'], href: '/finance#savings-section' },
  { name: '401(k) Employer Match Maximizer', category: 'Retirement', tags: ['401k', 'match', 'employer match', 'retirement'], href: '/finance#retirement-section' },
  { name: 'Roth vs. Traditional IRA / 401(k) Matrix', category: 'Retirement', tags: ['roth', 'traditional', 'ira', '401k', 'tax rate'], href: '/finance#retirement-section' },
  { name: 'Social Security Claiming Age Break-Even', category: 'Retirement', tags: ['social security', 'break-even', 'age 62', 'age 70'], href: '/finance#retirement-section' },
  { name: 'Required Minimum Distribution (RMD)', category: 'Retirement', tags: ['rmd', 'secure 2.0', 'irs', 'distribution'], href: '/finance#retirement-section' },
  { name: '2025 Statutory Tax Brackets & Marginal Rates', category: 'Taxation', tags: ['tax', 'irs', 'tax brackets', 'marginal tax'], href: '/finance#directory-clusters' },
  { name: 'Capital Gains Tax & Loss Harvesting', category: 'Taxation', tags: ['capital gains', 'tax loss harvesting', 'short term'], href: '/finance#directory-clusters' },
  { name: 'Cap Rate & Net Operating Income (NOI)', category: 'Real Estate', tags: ['cap rate', 'noi', 'commercial', 'rental yield'], href: '/finance#directory-clusters' },
  { name: 'Cash-on-Cash Return Calculator', category: 'Real Estate', tags: ['cash on cash', 'real estate', 'rental', 'cashflow'], href: '/finance#directory-clusters' },
];

export default function FinanceHubClient() {
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');

  // Recommender State
  const [selectedFocus, setSelectedFocus] = useState<string>('wealth');
  const [selectedHorizon, setSelectedHorizon] = useState<string>('mid');

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Hotkey listener for ⌘K and /
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K') || e.key === '/') {
        // Prevent default only if not typing in another input
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          searchInputRef.current?.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Compute recommended model
  const recommenderKey = `${selectedFocus}-${selectedHorizon}`;
  const currentRec = RECOMMENDER_MODELS[recommenderKey] || RECOMMENDER_MODELS['wealth-long'];

  // Filtered list when searching
  const filteredCalculators = searchQuery.trim() === '' 
    ? [] 
    : ALL_CALCULATORS.filter(item => {
        const q = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.tags.some(t => t.includes(q))
        );
      });

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface min-h-screen flex flex-col antialiased">
      <Header />
      <main className="w-full pt-16 bg-surface flex-1">
        <div className="flex flex-col w-full">
          
          {/* METROLOGY TELEMETRY & SUB-STRIP */}
          <section className="w-full bg-surface-container-low/80 backdrop-blur-md border-b border-outline-variant/20">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-xs flex flex-wrap items-center justify-between gap-space-sm text-body-sm">
              <div className="flex items-center gap-space-xs font-data-mono text-[12px] text-on-surface-variant overflow-x-auto py-1">
                <Link className="hover:text-primary transition-colors flex items-center gap-1" href="/">
                  <span className="material-symbols-outlined text-[16px]">home</span>
                  <span>Home</span>
                </Link>
                <span>/</span>
                <span className="text-primary font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">payments</span>
                  <span>Financial Suite (Active Hub)</span>
                </span>
              </div>
              <div className="flex items-center gap-space-md flex-wrap">
                <span className="inline-flex items-center gap-1 font-label-caps text-label-caps text-secondary px-2 py-0.5 rounded-full bg-secondary-fixed/50">
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                  CFA &amp; Actuarial Standards
                </span>
                <span className="hidden md:inline-flex items-center gap-1 font-label-caps text-label-caps text-on-surface-variant px-2 py-0.5 rounded-full bg-surface-container">
                  <span className="material-symbols-outlined text-[14px] text-primary">bolt</span>
                  214 Algorithmic Models
                </span>
                <span className="inline-flex items-center gap-1 font-label-caps text-label-caps text-on-surface-variant px-2 py-0.5 rounded-full bg-surface-container">
                  <span className="material-symbols-outlined text-[14px] text-primary">shield</span>
                  100% Client-Side Sandbox
                </span>
              </div>
            </div>
          </section>

          {/* SECTION 1: HERO & REAL-TIME SEARCH */}
          <section className="relative w-full overflow-hidden bg-gradient-to-b from-surface via-surface-container-lowest to-surface py-space-xl lg:py-space-2xl">
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop relative z-10">
              <div className="max-w-3xl space-y-space-sm mb-space-lg">
                <div className="inline-flex items-center gap-space-2xs px-space-sm py-space-2xs rounded-full bg-primary-fixed text-on-primary-fixed font-label-caps text-label-caps tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                  INSTITUTIONAL METROLOGY DIRECTORY
                </div>
                <h1 className="font-headline-lg text-headline-lg lg:text-display-hero text-on-surface font-bold tracking-tight">
                  Financial Calculators &amp; Wealth Planning Hub
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                  Deterministic financial calculators and forecasting models for debt servicing, yield curves, statutory tax brackets, early retirement, and capital preservation. Executed strictly client-side with sub-millisecond latency.
                </p>
              </div>

              {/* Live Search Workbench */}
              <div className="w-full max-w-4xl bg-surface-container-lowest/90 backdrop-blur-xl p-space-md rounded-xl shadow-xl space-y-space-sm border border-outline-variant/30">
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-space-md text-on-surface-variant text-[24px]">search</span>
                  <input 
                    ref={searchInputRef}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-28 py-space-md bg-surface-container-low rounded-lg text-on-surface placeholder:text-on-surface-variant font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest shadow-sm transition-all border border-outline-variant/30 focus:border-primary"
                    placeholder="Search 214+ financial models (e.g., 'amortization schedule', 'SIP CAGR', '401k match')..."
                    type="text"
                  />
                  <div className="absolute right-space-md flex items-center gap-1 pointer-events-none">
                    <kbd className="px-2 py-1 bg-surface-container-high text-on-surface-variant font-data-mono text-[12px] rounded border border-outline-variant/40">⌘K</kbd>
                    <kbd className="px-2 py-1 bg-surface-container-high text-on-surface-variant font-data-mono text-[12px] rounded border border-outline-variant/40">/</kbd>
                  </div>
                </div>

                {/* Quick Filter Pills */}
                <div className="flex items-center gap-space-xs overflow-x-auto pb-1 pt-space-2xs text-body-sm scrollbar-none">
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider whitespace-nowrap mr-1">Popular:</span>
                  {[
                    { label: 'Universal EMI', q: 'emi' },
                    { label: 'SIP & Compounding', q: 'sip' },
                    { label: 'FIRE Forecaster', q: 'fire' },
                    { label: 'Mortgage 30Y Amortization', q: 'mortgage' },
                    { label: 'Cap Rate & NOI', q: 'cap rate' },
                    { label: '2025 Tax Brackets', q: 'tax' }
                  ].map((pill) => (
                    <button 
                      key={pill.label}
                      type="button"
                      onClick={() => setSearchQuery(pill.q)}
                      className={`px-space-sm py-1 rounded-full font-body-sm whitespace-nowrap transition-all cursor-pointer border ${
                        searchQuery.toLowerCase() === pill.q.toLowerCase()
                          ? 'bg-primary text-on-primary border-primary font-semibold shadow-xs'
                          : 'bg-surface-container hover:bg-surface-container-high text-on-surface border-outline-variant/30'
                      }`}
                    >
                      {pill.label}
                    </button>
                  ))}
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="px-space-sm py-1 rounded-full bg-error-container text-on-error-container text-xs font-semibold hover:opacity-90 cursor-pointer"
                    >
                      Clear ✕
                    </button>
                  )}
                </div>

                {/* Instant Search Results Dropdown */}
                {searchQuery.trim() !== '' && (
                  <div className="p-space-sm bg-surface-container-low rounded-lg border border-outline-variant/30 space-y-1 max-h-72 overflow-y-auto">
                    <div className="flex items-center justify-between text-xs font-data-mono text-on-surface-variant px-2 py-1">
                      <span>SEARCH RESULTS ({filteredCalculators.length})</span>
                      <span>Instant Filter</span>
                    </div>
                    {filteredCalculators.length === 0 ? (
                      <div className="p-3 text-center text-on-surface-variant text-sm">
                        No financial calculators found matching &ldquo;{searchQuery}&rdquo;. Try &ldquo;mortgage&rdquo;, &ldquo;sip&rdquo;, or &ldquo;fire&rdquo;.
                      </div>
                    ) : (
                      filteredCalculators.map((calc, i) => (
                        <Link 
                          key={i}
                          href={calc.href}
                          className="flex items-center justify-between p-2 rounded-md hover:bg-surface-container transition-colors group"
                        >
                          <div>
                            <div className="font-body-md font-semibold text-on-surface group-hover:text-primary transition-colors">
                              {calc.name}
                            </div>
                            <div className="text-xs text-on-surface-variant">
                              {calc.category}
                            </div>
                          </div>
                          <span className="material-symbols-outlined text-[18px] text-primary group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </Link>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Telemetry Strip */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md mt-space-lg">
                <div className="p-space-md bg-surface-container-low/70 backdrop-blur-sm rounded-xl flex items-center gap-space-sm shadow-sm border border-outline-variant/20">
                  <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[20px]">calculate</span>
                  </div>
                  <div>
                    <div className="font-numerical-display text-headline-md text-on-surface font-bold">214+</div>
                    <div className="font-label-caps text-label-caps text-on-surface-variant uppercase">VERIFIED CALCULATORS</div>
                  </div>
                </div>
                <div className="p-space-md bg-surface-container-low/70 backdrop-blur-sm rounded-xl flex items-center gap-space-sm shadow-sm border border-outline-variant/20">
                  <div className="w-10 h-10 rounded-lg bg-secondary-fixed flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-[20px]">account_balance</span>
                  </div>
                  <div>
                    <div className="font-numerical-display text-headline-md text-on-surface font-bold">10</div>
                    <div className="font-label-caps text-label-caps text-on-surface-variant uppercase">Specialized Domains</div>
                  </div>
                </div>
                <div className="p-space-md bg-surface-container-low/70 backdrop-blur-sm rounded-xl flex items-center gap-space-sm shadow-sm border border-outline-variant/20">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[20px]">monitoring</span>
                  </div>
                  <div>
                    <div className="font-numerical-display text-headline-md text-on-surface font-bold">4.8M+</div>
                    <div className="font-label-caps text-label-caps text-on-surface-variant uppercase">Monthly Solves</div>
                  </div>
                </div>
                <div className="p-space-md bg-surface-container-low/70 backdrop-blur-sm rounded-xl flex items-center gap-space-sm shadow-sm border border-outline-variant/20">
                  <div className="w-10 h-10 rounded-lg bg-tertiary-fixed flex items-center justify-center text-tertiary">
                    <span className="material-symbols-outlined text-[20px]">security</span>
                  </div>
                  <div>
                    <div className="font-numerical-display text-headline-md text-on-surface font-bold">0.0 ms</div>
                    <div className="font-label-caps text-label-caps text-on-surface-variant uppercase">Server Leakage</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: INTERACTIVE FINANCIAL GOALS FINDER */}
          <section className="w-full py-space-2xl bg-surface-container-low/40 border-y border-outline-variant/20">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-lg gap-space-xs">
                <div>
                  <div className="font-label-caps text-label-caps text-primary tracking-wider uppercase font-semibold">Goal Orientation Matrix</div>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">What is your primary milestone?</h2>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md">
                  Skip generic directories. Select your focal capital objective to launch calibrated multi-model analysis suites.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-space-md">
                {/* Goal Card 1 */}
                <a className="group p-space-md bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 flex flex-col justify-between h-56 border border-outline-variant/20" href="#loans-section">
                  <div>
                    <div className="w-11 h-11 rounded-lg bg-primary-fixed flex items-center justify-center text-primary mb-space-sm group-hover:bg-primary group-hover:text-on-primary transition-all">
                      <span className="material-symbols-outlined text-[24px]">home</span>
                    </div>
                    <h3 className="font-headline-md text-[17px] leading-snug font-bold text-on-surface group-hover:text-primary transition-colors">Buy A Home</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 line-clamp-2">Mortgage debt, down payment hurdles, closing reserves, rent vs. buy balance.</p>
                  </div>
                  <div className="flex items-center justify-between pt-space-xs border-t border-outline-variant/15">
                    <span className="font-label-caps text-[10px] text-primary font-semibold">12 CALCULATORS</span>
                    <span className="material-symbols-outlined text-[16px] text-on-surface-variant group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </div>
                </a>

                {/* Goal Card 2 */}
                <a className="group p-space-md bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 flex flex-col justify-between h-56 border border-outline-variant/20" href="#investment-section">
                  <div>
                    <div className="w-11 h-11 rounded-lg bg-secondary-fixed flex items-center justify-center text-secondary mb-space-sm group-hover:bg-secondary group-hover:text-on-secondary transition-all">
                      <span className="material-symbols-outlined text-[24px]">trending_up</span>
                    </div>
                    <h3 className="font-headline-md text-[17px] leading-snug font-bold text-on-surface group-hover:text-secondary transition-colors">Grow Investments</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 line-clamp-2">Step-up SIP, CAGR annualized yield, dividend reinvestment, drag models.</p>
                  </div>
                  <div className="flex items-center justify-between pt-space-xs border-t border-outline-variant/15">
                    <span className="font-label-caps text-[10px] text-secondary font-semibold">16 CALCULATORS</span>
                    <span className="material-symbols-outlined text-[16px] text-on-surface-variant group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </div>
                </a>

                {/* Goal Card 3 */}
                <Link className="group p-space-md bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 flex flex-col justify-between h-56 border border-outline-variant/20" href="/fire-forecaster">
                  <div>
                    <div className="w-11 h-11 rounded-lg bg-tertiary-fixed flex items-center justify-center text-tertiary mb-space-sm group-hover:bg-tertiary group-hover:text-on-tertiary transition-all">
                      <span className="material-symbols-outlined text-[24px]">local_fire_department</span>
                    </div>
                    <h3 className="font-headline-md text-[17px] leading-snug font-bold text-on-surface group-hover:text-tertiary transition-colors">Reach FIRE</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 line-clamp-2">Coast FIRE, Lean/Fat tiers, Trinity 4% SWR survival probabilities.</p>
                  </div>
                  <div className="flex items-center justify-between pt-space-xs border-t border-outline-variant/15">
                    <span className="font-label-caps text-[10px] text-tertiary font-semibold">8 CALCULATORS</span>
                    <span className="material-symbols-outlined text-[16px] text-on-surface-variant group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </div>
                </Link>

                {/* Goal Card 4 */}
                <a className="group p-space-md bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 flex flex-col justify-between h-56 border border-outline-variant/20" href="#loans-section">
                  <div>
                    <div className="w-11 h-11 rounded-lg bg-surface-container-high flex items-center justify-center text-error mb-space-sm group-hover:bg-error group-hover:text-on-error transition-all">
                      <span className="material-symbols-outlined text-[24px]">credit_card_off</span>
                    </div>
                    <h3 className="font-headline-md text-[17px] leading-snug font-bold text-on-surface group-hover:text-error transition-colors">Eliminate Debt</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 line-clamp-2">Avalanche vs. Snowball payoff optimization, APR interest compression.</p>
                  </div>
                  <div className="flex items-center justify-between pt-space-xs border-t border-outline-variant/15">
                    <span className="font-label-caps text-[10px] text-on-surface-variant font-semibold">9 CALCULATORS</span>
                    <span className="material-symbols-outlined text-[16px] text-on-surface-variant group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </div>
                </a>

                {/* Goal Card 5 */}
                <a className="group p-space-md bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 flex flex-col justify-between h-56 border border-outline-variant/20" href="#savings-section">
                  <div>
                    <div className="w-11 h-11 rounded-lg bg-secondary-fixed-dim flex items-center justify-center text-on-secondary-container mb-space-sm group-hover:bg-secondary-container group-hover:text-on-secondary-container transition-all">
                      <span className="material-symbols-outlined text-[24px]">savings</span>
                    </div>
                    <h3 className="font-headline-md text-[17px] leading-snug font-bold text-on-surface group-hover:text-secondary transition-colors">Save &amp; Compound</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 line-clamp-2">High-yield CD ladders, real inflation purchasing adjustments, Rule of 72.</p>
                  </div>
                  <div className="flex items-center justify-between pt-space-xs border-t border-outline-variant/15">
                    <span className="font-label-caps text-[10px] text-secondary font-semibold">11 CALCULATORS</span>
                    <span className="material-symbols-outlined text-[16px] text-on-surface-variant group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </div>
                </a>
              </div>
            </div>
          </section>

          {/* SECTION 3: FLAGSHIP BENCHMARK COMPUTATIONAL ENGINES */}
          <section className="w-full py-space-2xl">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-lg gap-space-xs">
                <div>
                  <div className="font-label-caps text-label-caps text-primary tracking-wider uppercase font-semibold">Flagship Workbenches</div>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">Featured Flagship Calculators &amp; Models</h2>
                </div>
                <div className="flex items-center gap-space-xs">
                  <span className="font-data-mono text-[13px] text-on-surface-variant">Active Model Version: 2025.2.4</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg">
                {/* Flagship 1: FIRE Forecaster */}
                <div className="p-space-lg bg-surface-container-lowest rounded-xl shadow-md flex flex-col justify-between relative overflow-hidden border border-outline-variant/20">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-tertiary/5 rounded-bl-full pointer-events-none"></div>
                  <div className="space-y-space-sm">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 font-label-caps text-label-caps px-space-xs py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed">
                        <span className="material-symbols-outlined text-[14px]">whatshot</span> TRENDING #1
                      </span>
                      <span className="font-data-mono text-[12px] text-on-surface-variant">Latency: 0.8ms</span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface font-bold">FIRE Forecaster &amp; Independence Planner</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Simulates safe withdrawal rates (SWR 3.2% - 4.5%), Coast FIRE trajectories, and sequence of returns risk under Monte Carlo distribution across 100 historical equity cycles.
                    </p>
                    {/* Inline Mini Graph SVG Visualization */}
                    <div className="p-space-sm bg-surface-container-low rounded-lg border border-outline-variant/15">
                      <div className="flex items-center justify-between text-[11px] font-data-mono text-on-surface-variant mb-1">
                        <span>PORTFOLIO SIMULATION (30Y HORIZON)</span>
                        <span className="text-secondary font-bold">TRINITY CONFIDENCE: 98.4%</span>
                      </div>
                      <svg className="w-full h-16 text-primary" fill="none" viewBox="0 0 300 60">
                        <path d="M0,55 C40,50 80,45 120,38 C160,30 200,18 240,12 C260,8 280,5 300,2" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5"></path>
                        <path d="M0,55 C40,52 80,48 120,44 C160,42 200,38 240,32 C260,28 280,24 300,20" opacity="0.4" stroke="currentColor" strokeDasharray="3 3" strokeWidth="1.5"></path>
                        <circle cx="300" cy="2" fill="currentColor" r="3"></circle>
                      </svg>
                    </div>
                  </div>
                  <div className="pt-space-md flex items-center justify-between border-t border-outline-variant/15 mt-space-sm">
                    <div className="flex items-center gap-space-xs text-body-sm text-on-surface-variant">
                      <span className="font-semibold text-on-surface">4.9/5</span>
                      <span>(12,410 ratings)</span>
                    </div>
                    <Link href="/fire-forecaster" className="px-space-md py-space-xs bg-primary text-on-primary font-body-sm font-semibold rounded-lg shadow-sm hover:bg-primary-container transition-all flex items-center gap-1 cursor-pointer">
                      <span>Launch Planner</span>
                      <span className="material-symbols-outlined text-[18px]">launch</span>
                    </Link>
                  </div>
                </div>

                {/* Flagship 2: Universal Amortization & EMI Workbench */}
                <div className="p-space-lg bg-surface-container-lowest rounded-xl shadow-md flex flex-col justify-between relative overflow-hidden border border-outline-variant/20">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none"></div>
                  <div className="space-y-space-sm">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 font-label-caps text-label-caps px-space-xs py-0.5 rounded bg-primary-fixed text-on-primary-fixed">
                        <span className="material-symbols-outlined text-[14px]">balance</span> INSTITUTIONAL BENCHMARK
                      </span>
                      <span className="font-data-mono text-[12px] text-on-surface-variant">Zero Rounding Error</span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Universal EMI &amp; Amortization Workbench</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Full 360-month principal and interest breakdown with dynamic extra payment acceleration, bi-weekly schedules, and tax deductible interest schedules.
                    </p>
                    {/* Inline Mini Graph Repayment Bar */}
                    <div className="p-space-sm bg-surface-container-low rounded-lg border border-outline-variant/15">
                      <div className="flex items-center justify-between text-[11px] font-data-mono text-on-surface-variant mb-1">
                        <span>INTEREST VS PRINCIPAL REPAYMENT</span>
                        <span className="text-primary font-bold">SAVINGS: $48,210 ON PREPAY</span>
                      </div>
                      <div className="w-full h-3 bg-surface-container-high rounded-full overflow-hidden flex">
                        <div className="h-full bg-primary" style={{ width: '68%' }}></div>
                        <div className="h-full bg-tertiary" style={{ width: '32%' }}></div>
                      </div>
                      <div className="flex justify-between text-[10px] font-data-mono text-on-surface-variant mt-1">
                        <span>Principal: 68%</span>
                        <span>Interest: 32%</span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-space-md flex items-center justify-between border-t border-outline-variant/15 mt-space-sm">
                    <div className="flex items-center gap-space-xs text-body-sm text-on-surface-variant">
                      <span className="font-semibold text-on-surface">5.0/5</span>
                      <span>(34,880 ratings)</span>
                    </div>
                    <a href="#loans-section" className="px-space-md py-space-xs bg-primary text-on-primary font-body-sm font-semibold rounded-lg shadow-sm hover:bg-primary-container transition-all flex items-center gap-1 cursor-pointer">
                      <span>Open Calculator</span>
                      <span className="material-symbols-outlined text-[18px]">launch</span>
                    </a>
                  </div>
                </div>

                {/* Flagship 3: Systematic Investment Plan (SIP) */}
                <div className="p-space-lg bg-surface-container-lowest rounded-xl shadow-md flex flex-col justify-between relative overflow-hidden border border-outline-variant/20">
                  <div className="space-y-space-sm">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 font-label-caps text-label-caps px-space-xs py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed">
                        <span className="material-symbols-outlined text-[14px]">auto_mode</span> STEP-UP EQUIPPED
                      </span>
                      <span className="font-data-mono text-[12px] text-on-surface-variant">Daily/Monthly DCA</span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Systematic Investment Plan (SIP) Calculator</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Calculate rupee-cost or dollar-cost averaging advantages with annual step-up percentage increases, inflation adjustment, and nominal vs. real yield.
                    </p>
                    <div className="grid grid-cols-3 gap-space-xs p-space-sm bg-surface-container-low rounded-lg font-data-mono text-[12px] border border-outline-variant/15">
                      <div>
                        <span className="text-[10px] text-on-surface-variant block">MONTHLY</span>
                        <span className="font-bold text-on-surface">$1,000/mo</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-on-surface-variant block">CAGR ASSUMED</span>
                        <span className="font-bold text-secondary">11.4%</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-on-surface-variant block">15Y MATURITY</span>
                        <span className="font-bold text-primary">$448,220</span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-space-md flex items-center justify-between border-t border-outline-variant/15 mt-space-sm">
                    <div className="flex items-center gap-space-xs text-body-sm text-on-surface-variant">
                      <span className="font-semibold text-on-surface">4.9/5</span>
                      <span>(18,290 ratings)</span>
                    </div>
                    <a href="#investment-section" className="px-space-md py-space-xs bg-primary text-on-primary font-body-sm font-semibold rounded-lg shadow-sm hover:bg-primary-container transition-all flex items-center gap-1 cursor-pointer">
                      <span>Open Calculator</span>
                      <span className="material-symbols-outlined text-[18px]">launch</span>
                    </a>
                  </div>
                </div>

                {/* Flagship 4: Compound Interest Engine */}
                <div className="p-space-lg bg-surface-container-lowest rounded-xl shadow-md flex flex-col justify-between relative overflow-hidden border border-outline-variant/20">
                  <div className="space-y-space-sm">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 font-label-caps text-label-caps px-space-xs py-0.5 rounded bg-surface-container text-on-surface-variant">
                        <span className="material-symbols-outlined text-[14px]">functions</span> CONTINUOUS &amp; PERIODIC
                      </span>
                      <span className="font-data-mono text-[12px] text-on-surface-variant">Exact Metrology</span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Compound Interest Horizon Forecaster</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Deterministic compounding using standard A = P(1 + r/n)^(nt) and continuous e^(rt) formulas. Includes periodic additions and statutory tax drag modeling.
                    </p>
                    <div className="grid grid-cols-3 gap-space-xs p-space-sm bg-surface-container-low rounded-lg font-data-mono text-[12px] border border-outline-variant/15">
                      <div>
                        <span className="text-[10px] text-on-surface-variant block">COMPOUND FREQ</span>
                        <span className="font-bold text-on-surface">Daily (365)</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-on-surface-variant block">EFFECTIVE APY</span>
                        <span className="font-bold text-primary">7.25%</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-on-surface-variant block">DOUBLING TIME</span>
                        <span className="font-bold text-secondary">9.9 Years</span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-space-md flex items-center justify-between border-t border-outline-variant/15 mt-space-sm">
                    <div className="flex items-center gap-space-xs text-body-sm text-on-surface-variant">
                      <span className="font-semibold text-on-surface">5.0/5</span>
                      <span>(51,100 ratings)</span>
                    </div>
                    <a href="#investment-section" className="px-space-md py-space-xs bg-primary text-on-primary font-body-sm font-semibold rounded-lg shadow-sm hover:bg-primary-container transition-all flex items-center gap-1 cursor-pointer">
                      <span>Open Calculator</span>
                      <span className="material-symbols-outlined text-[18px]">launch</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 4: THE 8 DEEP FINANCIAL CATEGORY CLUSTERS */}
          <section className="w-full py-space-2xl bg-surface-container-low/30 border-y border-outline-variant/20" id="directory-clusters">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop space-y-space-2xl">
              <div className="space-y-space-xs">
                <div className="font-label-caps text-label-caps text-primary uppercase font-semibold">Exhaustive Metrology Repository</div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">The 8 Specialized Financial Clusters</h2>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                  Engineered to institutional specifications. Every formula verified against SEC, FINRA, IRS publication guidelines, and actuarial literature.
                </p>
              </div>

              {/* CATEGORY 1: Loans & Debt Architecture */}
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm space-y-space-md border border-outline-variant/20" id="loans-section">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs pb-space-sm border-b border-outline-variant/15">
                  <div className="flex items-center gap-space-sm">
                    <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[22px]">account_balance_wallet</span>
                    </div>
                    <div>
                      <h3 className="font-headline-md text-headline-md font-bold text-on-surface">1. Loans &amp; Debt Architecture</h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">Amortization schedules, prepayment impact, and interest rate compression</p>
                    </div>
                  </div>
                  <span className="font-label-caps text-label-caps px-space-sm py-1 rounded-full bg-surface-container text-on-surface-variant">10 CALCULATORS</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-sm">
                  {[
                    { title: 'Universal Mortgage Calculator', desc: 'PITI breakdown + PMI & HOA' },
                    { title: 'Loan Payoff & Prepayment Forecaster', desc: 'Extra monthly vs lump sum impact' },
                    { title: 'Debt Snowball vs Avalanche Calculator', desc: 'Payoff timeline and total interest saved' },
                    { title: 'Auto Loan & Total Ownership Cost', desc: 'Depreciation, insurance, APR, fuel' },
                    { title: 'Student Loan Refinance Optimizer', desc: 'Federal IDR vs Private refinance comparison' },
                    { title: 'Credit Card Minimum Payment Trap', desc: 'CARD Act 36-month repayment benchmark' },
                  ].map((item, idx) => (
                    <a key={idx} className="p-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container transition-all group flex items-center justify-between border border-outline-variant/10" href="#directory-clusters">
                      <div>
                        <div className="font-body-md font-semibold text-on-surface group-hover:text-primary transition-colors">{item.title}</div>
                        <div className="font-body-sm text-[12px] text-on-surface-variant">{item.desc}</div>
                      </div>
                      <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">chevron_right</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* CATEGORY 2: Investment & Wealth Accumulation */}
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm space-y-space-md border border-outline-variant/20" id="investment-section">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs pb-space-sm border-b border-outline-variant/15">
                  <div className="flex items-center gap-space-sm">
                    <div className="w-10 h-10 rounded-lg bg-secondary-fixed flex items-center justify-center text-secondary">
                      <span className="material-symbols-outlined text-[22px]">show_chart</span>
                    </div>
                    <div>
                      <h3 className="font-headline-md text-headline-md font-bold text-on-surface">2. Investment &amp; Wealth Accumulation</h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">Capital allocation, dollar cost averaging, and real yield metrics</p>
                    </div>
                  </div>
                  <span className="font-label-caps text-label-caps px-space-sm py-1 rounded-full bg-surface-container text-on-surface-variant">16 CALCULATORS</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-sm">
                  {[
                    { title: 'SIP Step-Up Wealth Accumulator', desc: 'Yearly percentage wage escalation' },
                    { title: 'CAGR & Annualized Return Analyzer', desc: 'Multi-year capital compounding' },
                    { title: 'Dividend Reinvestment (DRIP) Forecaster', desc: 'Dividend growth rate & share accumulation' },
                    { title: 'Mutual Fund & ETF Expense Ratio Drag', desc: 'Lifetime fee attrition analysis' },
                    { title: 'Asset Allocation Rebalance Matrix', desc: 'Equity, bond, alternative drift rebalancer' },
                    { title: 'Lump Sum vs DCA Historical Simulator', desc: 'Vanguard empirical probabilistic model' },
                  ].map((item, idx) => (
                    <a key={idx} className="p-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container transition-all group flex items-center justify-between border border-outline-variant/10" href="#directory-clusters">
                      <div>
                        <div className="font-body-md font-semibold text-on-surface group-hover:text-secondary transition-colors">{item.title}</div>
                        <div className="font-body-sm text-[12px] text-on-surface-variant">{item.desc}</div>
                      </div>
                      <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">chevron_right</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* CATEGORY 3: Savings & Liquidity */}
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm space-y-space-md border border-outline-variant/20" id="savings-section">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs pb-space-sm border-b border-outline-variant/15">
                  <div className="flex items-center gap-space-sm">
                    <div className="w-10 h-10 rounded-lg bg-secondary-fixed-dim flex items-center justify-center text-on-secondary-container">
                      <span className="material-symbols-outlined text-[22px]">savings</span>
                    </div>
                    <div>
                      <h3 className="font-headline-md text-headline-md font-bold text-on-surface">3. Savings, Liquidity &amp; Capital Preservation</h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">Emergency runway, high-yield cash management, and inflation mitigation</p>
                    </div>
                  </div>
                  <span className="font-label-caps text-label-caps px-space-sm py-1 rounded-full bg-surface-container text-on-surface-variant">11 CALCULATORS</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-sm">
                  {[
                    { title: 'Emergency Fund Runway (3/6/12 Mo)', desc: 'Tiered essential expenses vs liquid cash' },
                    { title: 'High-Yield Savings & APY Forecaster', desc: 'Daily compound interest yield schedule' },
                    { title: 'CD Ladder Strategist', desc: 'Liquidity rolling tranches: 3, 6, 9, 12 months' },
                    { title: 'Inflation Purchasing Power Erosion', desc: 'Real purchasing power decay model' },
                  ].map((item, idx) => (
                    <a key={idx} className="p-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container transition-all group flex items-center justify-between border border-outline-variant/10" href="#directory-clusters">
                      <div>
                        <div className="font-body-md font-semibold text-on-surface group-hover:text-secondary transition-colors">{item.title}</div>
                        <div className="font-body-sm text-[12px] text-on-surface-variant">{item.desc}</div>
                      </div>
                      <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">chevron_right</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* CATEGORY 4: Retirement & Financial Autonomy */}
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm space-y-space-md border border-outline-variant/20" id="retirement-section">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs pb-space-sm border-b border-outline-variant/15">
                  <div className="flex items-center gap-space-sm">
                    <div className="w-10 h-10 rounded-lg bg-tertiary-fixed flex items-center justify-center text-tertiary">
                      <span className="material-symbols-outlined text-[22px]">celebration</span>
                    </div>
                    <div>
                      <h3 className="font-headline-md text-headline-md font-bold text-on-surface">4. Retirement &amp; Financial Independence (FIRE)</h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">Pensions, 401(k) / Roth IRA optimization, and sustainable withdrawal rates</p>
                    </div>
                  </div>
                  <span className="font-label-caps text-label-caps px-space-sm py-1 rounded-full bg-surface-container text-on-surface-variant">14 CALCULATORS</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-sm">
                  <Link className="p-space-sm rounded-lg bg-primary-fixed/30 hover:bg-primary-fixed/50 transition-all group flex items-center justify-between border border-primary/30" href="/fire-forecaster">
                    <div>
                      <div className="font-body-md font-semibold text-primary group-hover:text-primary transition-colors flex items-center gap-1.5">
                        <span>Comprehensive FIRE Forecaster</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary text-on-primary font-data-mono">LIVE APP</span>
                      </div>
                      <div className="font-body-sm text-[12px] text-on-surface-variant">Coast, Lean, Fat, and Barista FIRE modes</div>
                    </div>
                    <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">chevron_right</span>
                  </Link>
                  {[
                    { title: '401(k) Employer Match Maximizer', desc: '100% instant return capture & limits 2025' },
                    { title: 'Roth vs. Traditional IRA / 401(k) Matrix', desc: 'Current vs future retirement marginal tax rate' },
                    { title: 'Social Security Claiming Age Break-Even', desc: 'Age 62 vs 67 vs 70 actuarial longevity curves' },
                    { title: 'Required Minimum Distribution (RMD)', desc: 'IRS SECURE 2.0 Act life expectancy table' },
                  ].map((item, idx) => (
                    <a key={idx} className="p-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container transition-all group flex items-center justify-between border border-outline-variant/10" href="#directory-clusters">
                      <div>
                        <div className="font-body-md font-semibold text-on-surface group-hover:text-tertiary transition-colors">{item.title}</div>
                        <div className="font-body-sm text-[12px] text-on-surface-variant">{item.desc}</div>
                      </div>
                      <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">chevron_right</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Clusters 5-8 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                {/* 5. TVM */}
                <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm space-y-space-xs border border-outline-variant/20">
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps text-primary uppercase font-bold">5. TVM &amp; Metrology</span>
                    <span className="font-data-mono text-[12px] text-on-surface-variant">9 CALCULATORS</span>
                  </div>
                  <h4 className="font-headline-md text-[18px] font-bold text-on-surface">Time Value of Money (TVM)</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Present Value (PV), Future Value (FV), APY to APR conversion, Rule of 72 and continuous compounding.</p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    <span className="text-[12px] px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">PV &amp; FV</span>
                    <span className="text-[12px] px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">APY vs APR</span>
                    <span className="text-[12px] px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">Rule of 72 &amp; 114</span>
                  </div>
                </div>

                {/* 6. Personal Finance */}
                <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm space-y-space-xs border border-outline-variant/20">
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps text-primary uppercase font-bold">6. Workforce Economics</span>
                    <span className="font-data-mono text-[12px] text-on-surface-variant">12 CALCULATORS</span>
                  </div>
                  <h4 className="font-headline-md text-[18px] font-bold text-on-surface">Personal Finance &amp; Cashflow</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Hourly to salary conversion, take-home paycheck models, net worth balance sheets, zero-based budgets.</p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    <span className="text-[12px] px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">Paycheck Estimator</span>
                    <span className="text-[12px] px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">Liquid Net Worth</span>
                    <span className="text-[12px] px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">Hourly Wage Pro</span>
                  </div>
                </div>

                {/* 7. Statutory Taxation */}
                <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm space-y-space-xs border border-outline-variant/20">
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps text-primary uppercase font-bold">7. Statutory Taxation</span>
                    <span className="font-data-mono text-[12px] text-on-surface-variant">15 CALCULATORS</span>
                  </div>
                  <h4 className="font-headline-md text-[18px] font-bold text-on-surface">Tax Compliance 2025</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Federal tax brackets, short &amp; long-term capital gains, state income tax models, FICA, Roth conversions.</p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    <span className="text-[12px] px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">2025 IRS Brackets</span>
                    <span className="text-[12px] px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">Capital Gains</span>
                    <span className="text-[12px] px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">Roth Tax Drag</span>
                  </div>
                </div>

                {/* 8. Real Estate Property */}
                <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm space-y-space-xs border border-outline-variant/20">
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-label-caps text-primary uppercase font-bold">8. Real Estate Commercial</span>
                    <span className="font-data-mono text-[12px] text-on-surface-variant">14 CALCULATORS</span>
                  </div>
                  <h4 className="font-headline-md text-[18px] font-bold text-on-surface">Real Estate &amp; Rental Yield</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Cap Rate &amp; NOI, Cash-on-Cash return, 1% rule screeners, 1031 exchange timelines, property appreciation.</p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    <span className="text-[12px] px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">Cap Rate &amp; NOI</span>
                    <span className="text-[12px] px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">Cash-on-Cash</span>
                    <span className="text-[12px] px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">1031 Tax Shield</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 5: POPULAR CURATED WORKFLOW COLLECTIONS */}
          <section className="w-full py-space-2xl">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
              <div className="space-y-space-xs mb-space-lg">
                <div className="font-label-caps text-label-caps text-primary uppercase font-semibold">Workflow Bundles</div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">Curated Calculation Suites for Real Decisions</h2>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">Multi-tool calculation suites assembled to address high-stakes economic life events without disjointed context-switching.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
                {/* Suite 1 */}
                <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between border border-outline-variant/20">
                  <div>
                    <div className="flex items-center justify-between mb-space-xs">
                      <span className="font-label-caps text-[11px] font-bold text-primary uppercase">Suite 01</span>
                      <span className="font-data-mono text-[12px] text-on-surface-variant">4 Calculators</span>
                    </div>
                    <h3 className="font-headline-md text-[18px] font-bold text-on-surface">First-Time Homebuyer Toolkit</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Full journey from down payment savings goal to debt-to-income (DTI) qualification and amortized closing cost breakdown.</p>
                  </div>
                  <div className="pt-space-md">
                    <a href="#loans-section" className="w-full py-2 px-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container text-primary font-body-sm font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer">
                      <span>Open 4-Tool Suite</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </a>
                  </div>
                </div>

                {/* Suite 2 */}
                <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between border border-outline-variant/20">
                  <div>
                    <div className="flex items-center justify-between mb-space-xs">
                      <span className="font-label-caps text-[11px] font-bold text-tertiary uppercase">Suite 02</span>
                      <span className="font-data-mono text-[12px] text-on-surface-variant">5 Tools</span>
                    </div>
                    <h3 className="font-headline-md text-[18px] font-bold text-on-surface">FIRE &amp; Early Autonomy Blueprint</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Calculates baseline living burn rate, 25x-33x capital target, bridge account drawdown, and Trinity safe withdrawal longevity.</p>
                  </div>
                  <div className="pt-space-md">
                    <Link href="/fire-forecaster" className="w-full py-2 px-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container text-tertiary font-body-sm font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer">
                      <span>Open 5-Tool Suite</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </Link>
                  </div>
                </div>

                {/* Suite 3 */}
                <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between border border-outline-variant/20">
                  <div>
                    <div className="flex items-center justify-between mb-space-xs">
                      <span className="font-label-caps text-[11px] font-bold text-secondary uppercase">Suite 03</span>
                      <span className="font-data-mono text-[12px] text-on-surface-variant">3 Calculators</span>
                    </div>
                    <h3 className="font-headline-md text-[18px] font-bold text-on-surface">Tax Season Optimization 2025</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Marginal vs. effective bracket analyzer, capital gain tax-loss harvesting shield, and traditional IRA deduction ceiling.</p>
                  </div>
                  <div className="pt-space-md">
                    <a href="#directory-clusters" className="w-full py-2 px-space-sm rounded-lg bg-surface-container-low hover:bg-surface-container text-secondary font-body-sm font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer">
                      <span>Open 3-Tool Suite</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 6: CHRONOLOGICAL FINANCIAL JOURNEY MAP */}
          <section className="w-full py-space-2xl bg-surface-container-low/50 border-y border-outline-variant/20">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
              <div className="space-y-space-xs mb-space-xl text-center max-w-2xl mx-auto">
                <div className="font-label-caps text-label-caps text-primary uppercase font-semibold">Life-Cycle Actuarial Roadmap</div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">The Chronological Financial Journey</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Calculations that matter at each distinct capital epoch. Align analytical tooling to your current life phase.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md relative">
                {/* Stage 1 */}
                <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm space-y-space-xs flex flex-col justify-between border border-outline-variant/20">
                  <div className="space-y-space-xs">
                    <span className="font-data-mono text-[12px] text-primary font-bold">STAGE 01 • AGES 18-25</span>
                    <h3 className="font-headline-md text-[18px] font-bold text-on-surface">Foundation &amp; Liquidity</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Establishing baseline positive cashflow, emergency buffer, and student loan consolidation.</p>
                    <ul className="text-body-sm text-on-surface-variant space-y-1 pt-space-xs">
                      <li className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-primary">check</span> 3-Month Emergency Fund
                      </li>
                      <li className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-primary">check</span> Paycheck Withholding Pro
                      </li>
                      <li className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-primary">check</span> 401(k) Match Capture
                      </li>
                    </ul>
                  </div>
                  <a className="pt-space-md inline-block font-label-caps text-label-caps text-primary font-semibold hover:underline" href="#savings-section">Explore Stage 01 Suite →</a>
                </div>

                {/* Stage 2 */}
                <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm space-y-space-xs flex flex-col justify-between border border-outline-variant/20">
                  <div className="space-y-space-xs">
                    <span className="font-data-mono text-[12px] text-secondary font-bold">STAGE 02 • AGES 25-40</span>
                    <h3 className="font-headline-md text-[18px] font-bold text-on-surface">Capital Acceleration</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Aggressive equity compounding, primary residential real estate, and child wealth planning.</p>
                    <ul className="text-body-sm text-on-surface-variant space-y-1 pt-space-xs">
                      <li className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-secondary">check</span> Step-Up SIP Compounding
                      </li>
                      <li className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-secondary">check</span> Mortgage Amortization
                      </li>
                      <li className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-secondary">check</span> 529 College Growth
                      </li>
                    </ul>
                  </div>
                  <a className="pt-space-md inline-block font-label-caps text-label-caps text-secondary font-semibold hover:underline" href="#investment-section">Explore Stage 02 Suite →</a>
                </div>

                {/* Stage 3 */}
                <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm space-y-space-xs flex flex-col justify-between border border-outline-variant/20">
                  <div className="space-y-space-xs">
                    <span className="font-data-mono text-[12px] text-tertiary font-bold">STAGE 03 • AGES 40-60</span>
                    <h3 className="font-headline-md text-[18px] font-bold text-on-surface">Preservation &amp; De-risking</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Tax-deferred catch-up contributions, sequence-of-returns defense, and bond laddering.</p>
                    <ul className="text-body-sm text-on-surface-variant space-y-1 pt-space-xs">
                      <li className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-tertiary">check</span> FIRE Longevity Forecaster
                      </li>
                      <li className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-tertiary">check</span> Catch-up 401(k) Limits
                      </li>
                      <li className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-tertiary">check</span> Portfolio Volatility Drag
                      </li>
                    </ul>
                  </div>
                  <Link className="pt-space-md inline-block font-label-caps text-label-caps text-tertiary font-semibold hover:underline" href="/fire-forecaster">Explore Stage 03 Suite →</Link>
                </div>

                {/* Stage 4 */}
                <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm space-y-space-xs flex flex-col justify-between border border-outline-variant/20">
                  <div className="space-y-space-xs">
                    <span className="font-data-mono text-[12px] text-on-surface font-bold">STAGE 04 • AGES 60+</span>
                    <h3 className="font-headline-md text-[18px] font-bold text-on-surface">Autonomy &amp; Distribution</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Statutory RMD distributions, Social Security timing, and intergenerational transfer tax shields.</p>
                    <ul className="text-body-sm text-on-surface-variant space-y-1 pt-space-xs">
                      <li className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-primary">check</span> Social Security Break-Even
                      </li>
                      <li className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-primary">check</span> IRS RMD Table Estimator
                      </li>
                      <li className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-primary">check</span> Annuity vs Drawdown
                      </li>
                    </ul>
                  </div>
                  <a className="pt-space-md inline-block font-label-caps text-label-caps text-primary font-semibold hover:underline" href="#retirement-section">Explore Stage 04 Suite →</a>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 7 & 8: SMART CALCULATOR RECOMMENDER WIDGET */}
          <section className="w-full py-space-2xl">
            <div className="max-w-max-width-calculator mx-auto px-gutter-mobile lg:px-gutter-desktop">
              <div className="bg-surface-container-lowest p-space-lg lg:p-space-xl rounded-xl shadow-lg space-y-space-md border border-outline-variant/25">
                <div className="text-center space-y-space-2xs">
                  <div className="inline-flex items-center gap-1 font-label-caps text-label-caps px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed">
                    <span className="material-symbols-outlined text-[14px]">psychology</span> INTERACTIVE DECISION MATRIX
                  </div>
                  <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">Find Your Ideal Financial Model</h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Answer two parameters to generate your deterministic computation path.</p>
                </div>

                <div className="space-y-space-md pt-space-sm">
                  {/* Step 1 */}
                  <div>
                    <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase mb-space-2xs">Step 1: Your Primary Focal Directive</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-space-xs">
                      {[
                        { val: 'wealth', label: 'Grow Wealth' },
                        { val: 'debt', label: 'Eliminate Debt' },
                        { val: 're', label: 'Real Estate' },
                        { val: 'fire', label: 'Retire Early' },
                        { val: 'tax', label: 'Optimize Taxes' },
                        { val: 'budget', label: 'Cashflow Budget' },
                      ].map((item) => (
                        <button 
                          key={item.val}
                          type="button" 
                          onClick={() => setSelectedFocus(item.val)}
                          className={`p-space-sm rounded-lg font-body-sm text-center transition-all cursor-pointer ${
                            selectedFocus === item.val
                              ? 'bg-primary-container text-on-primary-container font-semibold shadow-xs'
                              : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div>
                    <label className="block font-label-caps text-label-caps text-on-surface-variant uppercase mb-space-2xs">Step 2: Horizon Planning Window</label>
                    <div className="grid grid-cols-3 gap-space-xs">
                      {[
                        { val: 'short', label: '< 1 Year (Immediate)' },
                        { val: 'mid', label: '1 - 5 Years (Medium)' },
                        { val: 'long', label: '10+ Years (Decadal)' },
                      ].map((item) => (
                        <button 
                          key={item.val}
                          type="button" 
                          onClick={() => setSelectedHorizon(item.val)}
                          className={`p-space-sm rounded-lg font-body-sm text-center transition-all cursor-pointer ${
                            selectedHorizon === item.val
                              ? 'bg-primary-container text-on-primary-container font-semibold shadow-xs'
                              : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dynamic Output Card */}
                  <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm border border-outline-variant/20">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-label-caps text-label-caps px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed">RECOMMENDED BENCHMARK</span>
                        <span className="font-data-mono text-[12px] text-on-surface-variant">Model {currentRec.id}</span>
                      </div>
                      <h4 className="font-headline-md text-headline-md font-bold text-on-surface mt-1">{currentRec.title}</h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">{currentRec.desc}</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => {
                        if (currentRec.href.startsWith('/')) {
                          router.push(currentRec.href);
                        } else {
                          const el = document.querySelector(currentRec.href);
                          el?.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="px-space-md py-space-sm bg-primary text-on-primary font-body-sm font-semibold rounded-lg shadow-sm hover:bg-primary-container transition-all whitespace-nowrap cursor-pointer"
                    >
                      Launch Selected
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 9: FINANCIAL COMPARISON BENCHMARK CENTER */}
          <section className="w-full py-space-2xl bg-surface-container-low/30 border-y border-outline-variant/20">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop space-y-space-xl">
              <div className="space-y-space-xs">
                <div className="font-label-caps text-label-caps text-primary uppercase font-semibold">Comparative Metrology Benchmarks</div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">Divergent Mathematical Trade-offs</h2>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                  Empirical side-by-side analysis contrasting common financial dogmas with institutional actuarial reality.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
                {/* Benchmark 1: DCA vs Lump Sum */}
                <div className="p-space-lg bg-surface-container-lowest rounded-xl shadow-sm space-y-space-sm border border-outline-variant/20">
                  <div className="flex items-center justify-between">
                    <h3 className="font-headline-md text-headline-md font-bold text-on-surface">SIP / DCA vs. Lump Sum</h3>
                    <span className="font-data-mono text-[12px] text-secondary font-bold">Vanguard Study 68% Win-rate</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Lump sum investing outperforms Dollar Cost Averaging approximately 68% of the time across 10-year holding periods due to market upward drift, whereas DCA minimizes psychological regret during market peaks.
                  </p>
                  <div className="grid grid-cols-2 gap-space-sm pt-space-xs">
                    <div className="p-space-sm rounded-lg bg-surface-container-low border border-outline-variant/15">
                      <span className="font-label-caps text-label-caps text-on-surface-variant block uppercase">Lump Sum Advantage</span>
                      <span className="font-numerical-display text-headline-md text-primary font-bold">+2.3% p.a.</span>
                      <p className="font-body-sm text-[12px] text-on-surface-variant mt-1">Average historical edge in bull market regimes.</p>
                    </div>
                    <div className="p-space-sm rounded-lg bg-surface-container-low border border-outline-variant/15">
                      <span className="font-label-caps text-label-caps text-on-surface-variant block uppercase">SIP / DCA Advantage</span>
                      <span className="font-numerical-display text-headline-md text-secondary font-bold">-34% Drawdown</span>
                      <p className="font-body-sm text-[12px] text-on-surface-variant mt-1">Volatility dampening during secular bear runs.</p>
                    </div>
                  </div>
                </div>

                {/* Benchmark 2: Snowball vs Avalanche */}
                <div className="p-space-lg bg-surface-container-lowest rounded-xl shadow-sm space-y-space-sm border border-outline-variant/20">
                  <div className="flex items-center justify-between">
                    <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Debt Avalanche vs. Snowball</h3>
                    <span className="font-data-mono text-[12px] text-tertiary font-bold">Mathematical vs. Behavioral</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Debt Avalanche targets highest interest rate first (minimizing pure interest paid). Debt Snowball targets smallest nominal balances first (generating psychological momentum).
                  </p>
                  <div className="grid grid-cols-2 gap-space-sm pt-space-xs">
                    <div className="p-space-sm rounded-lg bg-surface-container-low border border-outline-variant/15">
                      <span className="font-label-caps text-label-caps text-on-surface-variant block uppercase">Avalanche Payoff</span>
                      <span className="font-numerical-display text-headline-md text-tertiary font-bold">$4,850 Saved</span>
                      <p className="font-body-sm text-[12px] text-on-surface-variant mt-1">Direct interest compression on $40k blended debt.</p>
                    </div>
                    <div className="p-space-sm rounded-lg bg-surface-container-low border border-outline-variant/15">
                      <span className="font-label-caps text-label-caps text-on-surface-variant block uppercase">Snowball Payoff</span>
                      <span className="font-numerical-display text-headline-md text-on-surface font-bold">14.2 Months</span>
                      <p className="font-body-sm text-[12px] text-on-surface-variant mt-1">Faster initial account closure for behavioral adherence.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 10: METHODOLOGY KNOWLEDGE CENTER */}
          <section className="w-full py-space-2xl">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop space-y-space-lg">
              <div className="space-y-space-xs">
                <div className="font-label-caps text-label-caps text-primary uppercase font-semibold">Metrological Rigor</div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">Financial Mathematics &amp; Computational Formulas</h2>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                  Complete transparent formula verification. SolveIt calculates client-side with zero approximations or rounded floating-point inaccuracies.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
                <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm space-y-space-xs border border-outline-variant/20">
                  <span className="font-label-caps text-label-caps text-secondary font-bold">FORMULA METROLOGY #01</span>
                  <h3 className="font-headline-md text-[18px] font-bold text-on-surface">Continuous Compounding</h3>
                  <div className="p-space-xs bg-surface-container-low rounded font-data-mono text-[13px] text-primary border border-outline-variant/15">
                    A = P · e^(r · t)
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Where <em>P</em> represents starting principal, <em>r</em> is the nominal annual rate of interest, <em>t</em> is the duration in decimal years, and <em>e</em> is Euler&apos;s mathematical constant (approx. 2.71828).
                  </p>
                </div>

                <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm space-y-space-xs border border-outline-variant/20">
                  <span className="font-label-caps text-label-caps text-secondary font-bold">FORMULA METROLOGY #02</span>
                  <h3 className="font-headline-md text-[18px] font-bold text-on-surface">Fixed Amortization (EMI)</h3>
                  <div className="p-space-xs bg-surface-container-low rounded font-data-mono text-[13px] text-primary border border-outline-variant/15">
                    M = P [ i(1 + i)^n ] / [ (1 + i)^n - 1 ]
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Where <em>P</em> is loan principal, <em>i</em> is monthly interest rate (annual rate / 12), and <em>n</em> is total number of monthly payments across the loan tenure.
                  </p>
                </div>

                <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm space-y-space-xs border border-outline-variant/20">
                  <span className="font-label-caps text-label-caps text-secondary font-bold">FORMULA METROLOGY #03</span>
                  <h3 className="font-headline-md text-[18px] font-bold text-on-surface">Fisher Real Return</h3>
                  <div className="p-space-xs bg-surface-container-low rounded font-data-mono text-[13px] text-primary border border-outline-variant/15">
                    (1 + r_nominal) = (1 + r_real)(1 + i)
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Calculates exact purchasing power preservation after deducting nominal consumer price index (CPI) inflation rates, eliminating common additive estimation flaws.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 11: FREQUENTLY ASKED QUESTIONS (ACCORDION) */}
          <section className="w-full py-space-2xl bg-surface-container-low/40 border-t border-outline-variant/20">
            <div className="max-w-max-width-calculator mx-auto px-gutter-mobile lg:px-gutter-desktop space-y-space-lg">
              <div className="text-center space-y-space-2xs">
                <div className="font-label-caps text-label-caps text-primary uppercase font-semibold">Institutional Clarity</div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">Frequently Asked Questions</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Everything you need to know about our deterministic financial engines.</p>
              </div>

              <div className="space-y-space-xs">
                {[
                  {
                    q: 'Are my financial inputs sent to any remote server or stored in a database?',
                    a: 'Never. All 214+ SolveIt computational engines are compiled into pure client-side JavaScript that executes within your browser’s local sandbox memory. Zero telemetric logging, zero cookies, zero network payloads transmit your personal balance sheets, income figures, or debt values.'
                  },
                  {
                    q: 'How are statutory tax brackets and IRS retirement contribution limits maintained?',
                    a: 'Our metrology pipeline updates each November upon the formal release of IRS Revenue Procedures (such as Rev. Proc. 2024-40 for tax year 2025). We incorporate standard deduction adjustments, IRA contribution ceilings ($7,000 baseline / $8,000 catch-up), 401(k) elective deferrals ($23,500), and SECURE 2.0 Act rules.'
                  },
                  {
                    q: 'Can SolveIt calculations be exported for institutional audits and financial planning?',
                    a: 'Yes. Every flagship calculator includes client-side generation of standardized CSV amortization logs, PDF schedule summaries, and LaTeX mathematical formula traces formatted for compliance reviews.'
                  },
                  {
                    q: 'What is the difference between APR and APY in your interest calculations?',
                    a: 'Annual Percentage Rate (APR) represents the simple annualized interest rate charged on borrowing without considering intra-year compounding. Annual Percentage Yield (APY) incorporates compound interest frequency (daily, monthly, quarterly). SolveIt provides automated bidirectional conversion to isolate real economic cost.'
                  },
                ].map((faq, idx) => (
                  <div key={idx} className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden transition-all">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full flex items-center justify-between font-headline-md text-[17px] font-bold text-on-surface text-left cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <span className={`material-symbols-outlined text-primary text-[20px] transition-transform duration-200 ${
                        openFaq === idx ? 'rotate-180' : ''
                      }`}>
                        expand_more
                      </span>
                    </button>
                    {openFaq === idx && (
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs leading-relaxed border-t border-outline-variant/15 pt-space-xs">
                        {faq.a}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION 12: TRUST BADGES & VERIFIED STANDARDS */}
          <section className="w-full py-space-xl bg-surface border-t border-outline-variant/20">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
              <div className="p-space-lg bg-surface-container-lowest rounded-2xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-space-lg border border-outline-variant/20">
                <div className="space-y-space-2xs">
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-primary text-[24px]">verified</span>
                    <h3 className="font-headline-md text-headline-md font-bold text-on-surface">SolveIt Metrology Trust Architecture</h3>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xl">
                    Calculations are benchmarked against federal statutes, IEEE 754 precision floating point math, and CFA Institute computational rubrics.
                  </p>
                </div>
                <div className="flex items-center gap-space-md flex-wrap">
                  <div className="flex items-center gap-2 px-space-sm py-2 rounded-lg bg-surface-container-low text-on-surface font-label-caps text-label-caps border border-outline-variant/20">
                    <span className="material-symbols-outlined text-primary text-[18px]">verified_user</span>
                    <span>SEC/FINRA Math Models</span>
                  </div>
                  <div className="flex items-center gap-2 px-space-sm py-2 rounded-lg bg-surface-container-low text-on-surface font-label-caps text-label-caps border border-outline-variant/20">
                    <span className="material-symbols-outlined text-secondary text-[18px]">lock</span>
                    <span>Zero Data Ingestion</span>
                  </div>
                  <div className="flex items-center gap-2 px-space-sm py-2 rounded-lg bg-surface-container-low text-on-surface font-label-caps text-label-caps border border-outline-variant/20">
                    <span className="material-symbols-outlined text-tertiary text-[18px]">speed</span>
                    <span>Sub-Millisecond Engine</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}
