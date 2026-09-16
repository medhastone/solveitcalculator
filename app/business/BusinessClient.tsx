'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';

export default function BusinessClient() {
  // --- Search & Filter State ---
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut '/' focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // --- Health Telemetry Dashboard State ---
  const [telemetry, setTelemetry] = useState({
    mrr: 125000,
    mrrGrowth: 14.2,
    grossMargin: 68.4,
    netMargin: 22.1,
    cash: 850000,
    netBurn: 42000,
    runway: 20.2,
    ltv: 4200,
    cac: 850,
    ratio: 4.94
  });

  const refreshDashboard = () => {
    const randomMRR = Math.round(118000 + Math.random() * 24000);
    const randomGrowth = parseFloat((10 + Math.random() * 8).toFixed(1));
    const randomGross = parseFloat((65 + Math.random() * 7).toFixed(1));
    const randomNet = parseFloat((18 + Math.random() * 8).toFixed(1));
    const randomCash = Math.round(750000 + Math.random() * 250000);
    const randomBurn = Math.round(36000 + Math.random() * 12000);
    const randomRunway = parseFloat((randomCash / randomBurn).toFixed(1));
    const randomLtv = Math.round(3800 + Math.random() * 800);
    const randomCac = Math.round(750 + Math.random() * 200);
    const randomRatio = parseFloat((randomLtv / randomCac).toFixed(2));

    setTelemetry({
      mrr: randomMRR,
      mrrGrowth: randomGrowth,
      grossMargin: randomGross,
      netMargin: randomNet,
      cash: randomCash,
      netBurn: randomBurn,
      runway: randomRunway,
      ltv: randomLtv,
      cac: randomCac,
      ratio: randomRatio
    });
  };

  // --- Workbench 1: Profit Margin & Markup Engine ---
  const [wb1Cogs, setWb1Cogs] = useState<number>(45.0);
  const [wb1Margin, setWb1Margin] = useState<number>(40.0);

  const marginResult = useMemo(() => {
    const cogs = Number(wb1Cogs) || 0;
    const margin = Number(wb1Margin) || 0;

    if (margin >= 100) {
      return { price: 'Err (>99%)', profit: '$0.00', markup: '0.0%' };
    }

    const price = cogs / (1 - margin / 100);
    const profit = price - cogs;
    const markup = cogs > 0 ? (profit / cogs) * 100 : 0;

    return {
      price: `$${price.toFixed(2)}`,
      profit: `$${profit.toFixed(2)}`,
      markup: `${markup.toFixed(1)}%`
    };
  }, [wb1Cogs, wb1Margin]);

  // --- Workbench 2: SaaS Rule of 40 ---
  const [wb2Growth, setWb2Growth] = useState<number>(32);
  const [wb2Fcf, setWb2Fcf] = useState<number>(14);

  const ruleOf40Result = useMemo(() => {
    const growth = Number(wb2Growth) || 0;
    const fcf = Number(wb2Fcf) || 0;
    const score = growth + fcf;
    const isTopDecile = score >= 40;

    return {
      score: `${score.toFixed(1)}%`,
      badge: isTopDecile ? 'Top Decile SaaS' : 'Below 40% Benchmark',
      badgeClass: isTopDecile
        ? 'bg-secondary text-on-secondary'
        : 'bg-surface-container-highest text-on-surface-variant',
      desc: isTopDecile ? 'Healthy capital balance (≥40%)' : 'Optimization required (<40%)'
    };
  }, [wb2Growth, wb2Fcf]);

  // --- Workbench 3: Runway & Burn Rate ---
  const [wb3Cash, setWb3Cash] = useState<number>(450000);
  const [wb3Rev, setWb3Rev] = useState<number>(35000);
  const [wb3Exp, setWb3Exp] = useState<number>(62000);

  const runwayResult = useMemo(() => {
    const cash = Number(wb3Cash) || 0;
    const rev = Number(wb3Rev) || 0;
    const exp = Number(wb3Exp) || 0;
    const netBurn = exp - rev;

    if (netBurn <= 0) {
      return {
        burn: `Profitable (+$${Math.abs(netBurn).toLocaleString()})`,
        runway: 'Infinite Runway',
        burnClass: 'text-primary'
      };
    } else {
      const runway = netBurn > 0 ? cash / netBurn : 0;
      return {
        burn: `$${netBurn.toLocaleString()}`,
        runway: `${runway.toFixed(1)} Months`,
        burnClass: 'text-tertiary'
      };
    }
  }, [wb3Cash, wb3Rev, wb3Exp]);

  // --- Workbench 4: Ecommerce Net Margin ---
  const [wb4Price, setWb4Price] = useState<number>(39.99);
  const [wb4Cogs, setWb4Cogs] = useState<number>(12.0);
  const [wb4Cpa, setWb4Cpa] = useState<number>(8.5);
  const [wb4Fee, setWb4Fee] = useState<number>(15);

  const ecomResult = useMemo(() => {
    const price = Number(wb4Price) || 0;
    const cogs = Number(wb4Cogs) || 0;
    const cpa = Number(wb4Cpa) || 0;
    const feePct = Number(wb4Fee) || 0;

    const platformFee = price * (feePct / 100);
    const netProfit = price - cogs - cpa - platformFee;
    const netMargin = price > 0 ? (netProfit / price) * 100 : 0;

    return {
      net: `$${netProfit.toFixed(2)}`,
      pct: `${netMargin.toFixed(1)}%`
    };
  }, [wb4Price, wb4Cogs, wb4Cpa, wb4Fee]);

  // --- Smart Recommender State ---
  const [recModel, setRecModel] = useState<'saas' | 'ecom' | 'agency' | 'startup'>('saas');
  const [recGoal, setRecGoal] = useState<'cash' | 'pricing' | 'growth' | 'hiring'>('pricing');

  const recommenderData = useMemo(() => {
    if (recModel === 'saas' && recGoal === 'pricing') {
      return {
        title: 'Usage vs Seat-Based Elasticity Calculator',
        desc: 'Models the revenue divergence when transitioning subscribers to usage billing.',
        link: '#category-saas'
      };
    } else if (recModel === 'ecom' && recGoal === 'pricing') {
      return {
        title: 'Multichannel Amazon FBA & Shopify Net Profit Modeler',
        desc: 'Isolates dimensional weight fees, refund write-offs, and merchant gateway cuts.',
        link: '#category-ecommerce'
      };
    } else if (recGoal === 'cash') {
      return {
        title: '13-Week Cash Flow & Runway Deficit Forecaster',
        desc: 'Tracks short-term accounts receivable against immediate payroll liabilities.',
        link: '#category-accounting'
      };
    } else if (recGoal === 'hiring') {
      return {
        title: 'True Cost of Employee (Burden Rate Factor)',
        desc: 'Applies statutory taxes, medical buffers, and overhead to base salary rates.',
        link: '#category-hr'
      };
    } else {
      return {
        title: 'Blended Customer Acquisition Cost (CAC) Calculator',
        desc: 'Calculates total marketing spend, agency fees, and customer acquisition payback time.',
        link: '#category-marketing'
      };
    }
  }, [recModel, recGoal]);

  // --- 17-Category Directory Data ---
  const categories = [
    {
      id: 'category-planning',
      num: '1',
      title: 'Business Planning & Strategy',
      desc: 'Market sizing, business plans, and strategic planning tools.',
      icon: 'architecture',
      color: 'primary',
      count: '5 Tools',
      tools: [
        { name: 'Lean Canvas Planner', desc: 'Map your business idea, key assumptions, and revenue model on a 1-page canvas.', action: 'Plan Canvas' },
        { name: 'TAM / SAM / SOM Market Sizer', desc: 'Calculate top-down and bottom-up Total Addressable Market size.', action: 'Size Market' },
        { name: 'PESTLE Risk Evaluator', desc: 'Evaluate macro risk factors across political, economic, and tech conditions.', action: 'Assess Risk' },
        { name: 'SWOT Strategic Scorer', desc: 'Evaluate company strengths, weaknesses, opportunities, and threats.', action: 'SWOT Analysis' },
        { name: 'Scenario & Sensitivity Analyzer', desc: 'Simulate Best-case, Base-case, and Worst-case financial scenarios.', action: 'Run Scenarios' }
      ]
    },
    {
      id: 'category-startup',
      num: '2',
      title: 'Startup & Fundraising',
      desc: 'Cap tables, dilution scenarios, burn projections, and venture valuations.',
      icon: 'rocket',
      color: 'secondary',
      count: '6 Tools',
      tools: [
        { name: 'Startup Runway & Burn Rate', desc: 'Calculate exact runway months and cash burn rate with revenue and cost inputs.', action: 'Calculate Runway' },
        { name: 'Cap Table & Dilution Calculator', desc: 'Model Pre-Seed through Series B equity rounds, employee option pools, and ownership.', action: 'Model Dilution' },
        { name: 'SAFE & Convertible Note Calculator', desc: 'Calculate post-money valuation caps, conversion discounts, and investor equity.', action: 'Model SAFE' },
        { name: 'Founder Equity Split Calculator', desc: 'Equitable co-founder equity splits based on role, cash invested, and time committed.', action: 'Split Equity' },
        { name: 'Series A Readiness Audit', desc: 'Evaluate revenue growth rate, burn multiple, and benchmark against top venture metrics.', action: 'Check Readiness' },
        { name: 'Berkus & Scorecard Valuation', desc: 'Early-stage startup valuation methods for angel investor rounds.', action: 'Estimate Value' }
      ]
    },
    {
      id: 'category-profit',
      num: '3',
      title: 'Profit & Pricing',
      desc: 'Profit margins, markups, break-even unit volumes, and pricing strategy.',
      icon: 'price_change',
      color: 'tertiary',
      count: '5 Tools',
      tools: [
        { name: 'Gross Margin vs Markup Converter', desc: 'Avoid pricing mistakes by calculating exact gross margins, markups, and profits.', action: 'Calculate Margins' },
        { name: 'Break-Even Calculator (Units & $)', desc: 'Calculate exact sales units and revenue needed to cover fixed and variable costs.', action: 'Find Break-Even' },
        { name: 'Contribution Margin Calculator', desc: 'Determine revenue per unit available to cover overhead expenses and profit.', action: 'Calculate Contribution' },
        { name: 'Price Elasticity of Demand (PED)', desc: 'Analyze how changing your price will impact sales volume and total revenue.', action: 'Test Elasticity' },
        { name: 'Target Profit Pricing Calculator', desc: 'Find the required selling price based on your target profit goals.', action: 'Set Target Price' }
      ]
    },
    {
      id: 'category-accounting',
      num: '4',
      title: 'Finance & Accounting',
      desc: 'Working capital, liquidity metrics, cash conversion cycles, and GAAP ratios.',
      icon: 'account_balance_wallet',
      color: 'primary',
      count: '5 Tools',
      tools: [
        { name: 'Working Capital & Current Ratio', desc: 'Instant evaluation of balance sheet liquidity and short-term debt coverage.', action: 'Liquidity Audit' },
        { name: 'Cash Conversion Cycle (CCC)', desc: 'DSO + DIO - DPO formula modeling operational cash velocity in days.', action: 'Calculate Days' },
        { name: 'Acid-Test / Quick Ratio', desc: 'Evaluate ultra-liquid solvency excluding non-liquid inventory assets.', action: 'Solvency Test' },
        { name: 'Direct Cash Flow Statement Forecaster', desc: 'Model 13-week rolling cash forecasts for treasurers and finance leads.', action: '13-Week Cash Model' },
        { name: 'Debt Service Coverage Ratio (DSCR)', desc: 'Verify business ability to service corporate lines of credit and loans.', action: 'DSCR Ratio' }
      ]
    },
    {
      id: 'category-tax',
      num: '5',
      title: 'GST, VAT & Global Indirect Tax',
      desc: 'Compliant sales tax computation, reverse charges, and input tax credit reconciliations.',
      icon: 'receipt_long',
      color: 'secondary',
      count: '5 Tools',
      tools: [
        { name: 'GST Inclusive & Exclusive Calculator', desc: 'Multi-tier GST (5%, 12%, 18%, 28%) extraction with state split.', action: 'Calculate Tax' },
        { name: 'European VAT Reverse Charge Modeler', desc: 'B2B cross-border cross-EU VAT liability and reverse charge flags.', action: 'Model EU VAT' },
        { name: 'US State Nexus Sales Tax Analyzer', desc: 'Assess economic nexus liability based on transaction counts and state revenue.', action: 'Assess Nexus' },
        { name: 'Corporate Income Tax Provision', desc: 'Quarterly estimated corporate tax liability calculation with standard deductions.', action: 'Estimated Tax' },
        { name: 'Withholding Tax (TDS / W-8BEN) Model', desc: 'Determine treaty cross-border deduction percentages for contractor payouts.', action: 'Withholding Calc' }
      ]
    },
    {
      id: 'category-sales',
      num: '6',
      title: 'Sales & Revenue Operations',
      desc: 'Sales pipeline targets, commission calculations, conversion funnels, and contract values.',
      icon: 'filter_alt',
      color: 'primary',
      count: '5 Tools',
      tools: [
        { name: 'Sales Velocity Formula', desc: 'Calculate sales revenue velocity per month based on win rate and deal size.', action: 'Calculate Velocity' },
        { name: 'Tiered Sales Commission Calculator', desc: 'Calculate tiered commissions, accelerators, base salary splits, and quota attainment.', action: 'Calculate Commission' },
        { name: 'Pipeline Stage Conversion Funnel', desc: 'Identify conversion rates between leads, discovery calls, demos, and closed deals.', action: 'Analyze Funnel' },
        { name: 'Sales Capacity & Headcount Planner', desc: 'Calculate how many sales reps you need to hit your annual revenue target.', action: 'Plan Headcount' },
        { name: 'Contract Value Calculator (ACV vs TCV)', desc: 'Calculate Annual Contract Value (ACV) and Total Contract Value (TCV).', action: 'Calculate ACV' }
      ]
    },
    {
      id: 'category-marketing',
      num: '7',
      title: 'Marketing & Performance Advertising',
      desc: 'Ad spend efficiency, customer acquisition costs (CAC), ROAS, and customer lifetime value.',
      icon: 'ads_click',
      color: 'tertiary',
      count: '5 Tools',
      tools: [
        { name: 'Blended Customer Acquisition Cost (CAC)', desc: 'Calculate true customer acquisition cost across ad spend, tools, and marketing payroll.', action: 'Calculate CAC' },
        { name: 'Break-Even ROAS Target Calculator', desc: 'Find the minimum Return On Ad Spend needed to make a profit on ads.', action: 'Find Target ROAS' },
        { name: 'Media Mix Simulator', desc: 'Compare and forecast returns across Google Ads, Meta, TikTok, and other channels.', action: 'Compare Channels' },
        { name: 'Customer Lifetime Value (LTV) Calculator', desc: 'Calculate customer lifetime value based on purchase frequency, margin, and retention.', action: 'Calculate LTV' },
        { name: 'Influencer & Sponsorship ROI Calculator', desc: 'Evaluate sponsorship costs against expected sales and customer acquisition cost.', action: 'Calculate ROI' }
      ]
    },
    {
      id: 'category-ecommerce',
      num: '8',
      title: 'Ecommerce & Marketplaces',
      desc: 'Amazon FBA fees, Shopify store profits, return costs, and marketplace margins.',
      icon: 'storefront',
      color: 'primary',
      count: '5 Tools',
      tools: [
        { name: 'Amazon FBA Fee & Profit Calculator', desc: 'Calculate Amazon referral fees, fulfillment costs, storage, and net profit per unit.', action: 'Calculate FBA Profit' },
        { name: 'Shopify Net Profit & Fee Calculator', desc: 'Calculate net profit after payment gateway fees, app subscriptions, and refunds.', action: 'Calculate Profit' },
        { name: 'Product Return & Profit Loss Calculator', desc: 'Measure the true financial impact of customer returns on your bottom line.', action: 'Calculate Return Cost' },
        { name: 'Dropshipping Profit Margin Calculator', desc: 'Calculate net profit margins factoring in supplier costs, shipping, and ad spend.', action: 'Check Margins' },
        { name: 'Etsy & eBay Fee & Profit Calculator', desc: 'Calculate listing fees, transaction fees, advertising fees, and final profit.', action: 'Calculate Fees' }
      ]
    },
    {
      id: 'category-saas',
      num: '9',
      title: 'SaaS Metrics & Subscriptions',
      desc: 'Monthly recurring revenue, customer churn, retention, and subscription health.',
      icon: 'cloud_sync',
      color: 'secondary',
      count: '6 Tools',
      tools: [
        { name: 'MRR / ARR Revenue Waterfall', desc: 'Track New MRR, Expansion MRR, Downgrades, and Churned Revenue.', action: 'Track Revenue' },
        { name: 'Net Revenue Retention (NRR)', desc: 'Measure customer revenue expansion and churn to benchmark business health.', action: 'Calculate NRR' },
        { name: 'SaaS Magic Number & CAC Payback', desc: 'Determine sales efficiency and how many months it takes to recover acquisition costs.', action: 'Calculate Payback' },
        { name: 'Customer vs Revenue Churn Rate', desc: 'Compare the number of lost customers versus the actual revenue lost to cancellations.', action: 'Analyze Churn' },
        { name: 'Rule of 40 Benchmark Grader', desc: 'Evaluate your software business health by combining revenue growth and profit margin.', action: 'Score Rule of 40' },
        { name: 'Per-User vs Usage-Based Pricing Model', desc: 'Compare revenue projections between per-seat plans and usage-based pricing tiers.', action: 'Compare Pricing' }
      ]
    },
    {
      id: 'category-hr',
      num: '10',
      title: 'Human Resources & Payroll',
      desc: 'Total employee costs, hiring expenses, employee turnover, and overtime rates.',
      icon: 'badge',
      color: 'primary',
      count: '4 Tools',
      tools: [
        { name: 'True Cost of an Employee (Burden Rate)', desc: 'Calculate total employer cost including payroll taxes, health insurance, 401k, and perks.', action: 'Calculate Total Cost' },
        { name: 'Cost Per Hire & Time-to-Fill', desc: 'Calculate recruitment expenses, job board fees, and hiring costs per new employee.', action: 'Calculate Cost Per Hire' },
        { name: 'Employee Turnover Cost Calculator', desc: 'Calculate the true financial cost of employee departures, onboarding, and rehiring.', action: 'Calculate Turnover' },
        { name: 'Overtime vs New Hire Cost Comparison', desc: 'Compare 1.5x overtime wages against the cost of hiring a new full-time team member.', action: 'Compare Options' }
      ]
    },
    {
      id: 'category-operations',
      num: '11',
      title: 'Operations & Productivity',
      desc: 'Productivity metrics, equipment efficiency, meeting costs, and downtime impact.',
      icon: 'speed',
      color: 'tertiary',
      count: '4 Tools',
      tools: [
        { name: 'Real-Time Meeting Cost Ticker', desc: 'Calculate the total cost of any team meeting in real time based on attendee salaries.', action: 'Start Meeting Clock' },
        { name: 'Overall Equipment Effectiveness (OEE)', desc: 'Measure manufacturing efficiency based on equipment availability, performance, and quality.', action: 'Calculate OEE' },
        { name: 'Capacity Utilization Rate', desc: 'Calculate what percentage of your potential production capacity is currently in use.', action: 'Check Capacity' },
        { name: 'Unplanned Downtime Cost Calculator', desc: 'Calculate lost productivity, delayed orders, and financial losses from system outages.', action: 'Calculate Loss' }
      ]
    },
    {
      id: 'category-inventory',
      num: '12',
      title: 'Inventory & Supply Chain',
      desc: 'Order quantities, reorder points, safety stock levels, and inventory turnover.',
      icon: 'warehouse',
      color: 'primary',
      count: '4 Tools',
      tools: [
        { name: 'Economic Order Quantity (EOQ)', desc: 'Find the optimal order quantity to minimize total purchasing and holding costs.', action: 'Calculate EOQ' },
        { name: 'Reorder Point (ROP) & Safety Stock', desc: 'Calculate when to reorder stock and how much buffer inventory to keep on hand.', action: 'Calculate Reorder Point' },
        { name: 'Inventory Turnover Ratio & DSI', desc: 'Calculate Days Sales of Inventory (DSI) to identify slow-moving products.', action: 'Check Turnover' },
        { name: 'Stockout Cost & Loss Calculator', desc: 'Calculate estimated lost revenue from out-of-stock products.', action: 'Calculate Lost Sales' }
      ]
    }
  ];

  // Filtered categories
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const q = searchQuery.toLowerCase();
    return categories
      .map(cat => ({
        ...cat,
        tools: cat.tools.filter(
          t =>
            t.name.toLowerCase().includes(q) ||
            t.desc.toLowerCase().includes(q) ||
            cat.title.toLowerCase().includes(q)
        )
      }))
      .filter(cat => cat.tools.length > 0 || cat.title.toLowerCase().includes(q) || cat.desc.toLowerCase().includes(q));
  }, [searchQuery, categories]);

  return (
    <div className="min-h-screen bg-background font-body-md text-body-md text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container flex flex-col">
      

      <main className="w-full pt-16 bg-background flex-1">
        {/* Breadcrumb Navigation Bar */}
        <section className="w-full bg-surface-container-low/70 py-space-xs border-b border-outline-variant/20">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop flex items-center justify-between gap-space-xs text-body-sm font-body-sm">
            <nav aria-label="Breadcrumb" className="flex items-center gap-space-xs text-on-surface-variant flex-wrap">
              <Link className="hover:text-primary transition-colors flex items-center gap-1" href="/">
                <span className="material-symbols-outlined text-[16px]">home</span>
                Home
              </Link>
              <span className="text-outline-variant">/</span>
              <span className="text-on-surface font-medium">Business Calculators</span>
            </nav>
          </div>
        </section>

        {/* ================= SECTION 1: HERO & TELEMETRY ================= */}
        <section className="w-full pt-space-3xl pb-space-2xl bg-gradient-to-b from-surface-container-low via-background to-background relative overflow-hidden">
          {/* Ambient subtle background glow */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop relative z-10">
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-space-md">
              {/* Eyebrow Badge */}
              <div className="inline-flex items-center gap-space-2xs px-space-sm py-space-2xs rounded-full bg-surface-container-high text-primary font-label-caps text-label-caps uppercase tracking-wider shadow-sm font-semibold">
                <span className="material-symbols-outlined text-[16px]">analytics</span> Business Tools &amp; Growth Platform
              </div>
              {/* Headline H1 */}
              <h1 className="font-display-hero text-display-hero text-on-surface font-extrabold tracking-tight">
                Business Tools &amp; Calculators for Smarter Business Decisions
              </h1>
              {/* Subtitle */}
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
                Calculate profits, pricing, payroll, revenue, ROI, inventory, business expenses, and growth projections with accurate and easy-to-use business calculators.
              </p>

              {/* Omnisearch Engine */}
              <div className="w-full max-w-2xl pt-space-xs">
                <div className="relative flex items-center bg-surface-container-lowest rounded-xl shadow-md border border-outline-variant/30 transition-all focus-within:shadow-xl focus-within:ring-2 focus-within:ring-primary/20">
                  <span className="material-symbols-outlined text-primary ml-space-md text-[24px]">search</span>
                  <input
                    ref={searchInputRef}
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full py-space-md px-space-sm bg-transparent outline-none font-body-md text-body-md text-on-surface placeholder:text-outline font-medium"
                    id="tool-search-input"
                    placeholder="Search Business Calculators: profit margin, ROI, payroll, break-even, pricing, inventory, cash flow, revenue..."
                    type="text"
                  />
                  <kbd className="hidden sm:inline-flex items-center justify-center mr-space-md bg-surface-container-high px-space-xs py-1 rounded font-data-mono text-data-mono text-xs text-on-surface-variant font-bold shadow-inner">
                    /
                  </kbd>
                </div>
                {/* Quick Tag Filter Pills */}
                <div className="flex flex-wrap items-center justify-center gap-space-2xs mt-space-sm font-label-caps text-label-caps">
                  <span className="text-outline uppercase tracking-wider mr-space-2xs">Quick Jump:</span>
                  {[
                    'Profit Margin',
                    'ROI Calculator',
                    'Break-Even',
                    'Payroll',
                    'Pricing & Markup',
                    'Inventory',
                    'Cash Flow',
                    'Startup Cost',
                    'Business Loan',
                    'Sales Tax'
                  ].map(tag => (
                    <button
                      key={tag}
                      onClick={() => setSearchQuery(tag)}
                      className="px-space-xs py-1 bg-surface-container-lowest hover:bg-surface-container-high text-on-surface-variant rounded shadow-sm border border-outline-variant/20 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Telemetry Strip */}
              <div className="w-full pt-space-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-space-sm bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/30">
                  <div className="flex flex-col items-center justify-center p-space-xs">
                    <span className="font-numerical-display text-numerical-display text-primary font-bold">250+</span>
                    <span className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant mt-space-2xs">
                      Business Tools
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-space-xs">
                    <span className="font-numerical-display text-numerical-display text-secondary font-bold">30+</span>
                    <span className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant mt-space-2xs">
                      Specialized Suites
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-space-xs">
                    <span className="font-numerical-display text-numerical-display text-on-surface font-bold">100K+</span>
                    <span className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant mt-space-2xs">
                      Calculations Solved
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-space-xs">
                    <div className="flex items-center gap-space-2xs text-secondary-container">
                      <span className="material-symbols-outlined text-[28px] text-secondary">verified</span>
                    </div>
                    <span className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant mt-space-2xs">
                      100% Free &amp; Private
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SECTION 2: BUSINESS GOAL FINDER ================= */}
        <section className="w-full py-space-2xl bg-surface-container-low/60 border-y border-outline-variant/20">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-xl gap-space-sm">
              <div>
                <span className="font-label-caps text-label-caps uppercase text-primary tracking-widest font-semibold">
                  FIND BY GOAL
                </span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold mt-space-2xs">
                  What is your primary business goal?
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-space-2xs">
                  Choose what you want to calculate to jump straight to the right tools.
                </p>
              </div>
              <span className="font-data-mono text-data-mono text-xs text-on-surface-variant bg-surface-container-high px-space-sm py-space-2xs rounded-md">
                10 Core Business Categories
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-space-md">
              {[
                {
                  title: 'Start a Business',
                  desc: 'Business plans, startup costs, legal structures & funding.',
                  count: '16 Tools',
                  icon: 'rocket_launch',
                  color: 'primary',
                  link: '#category-startup'
                },
                {
                  title: 'Increase Profit',
                  desc: 'Gross margins, pricing markups, and break-even calculations.',
                  count: '14 Tools',
                  icon: 'payments',
                  color: 'secondary',
                  link: '#category-profit'
                },
                {
                  title: 'Grow Revenue',
                  desc: 'Sales pipeline targets, conversion rates & sales team models.',
                  count: '12 Tools',
                  icon: 'trending_up',
                  color: 'tertiary',
                  link: '#category-sales'
                },
                {
                  title: 'Launch Ecommerce',
                  desc: 'Amazon FBA fees, Shopify store profit & shipping calculations.',
                  count: '15 Tools',
                  icon: 'shopping_cart',
                  color: 'primary',
                  link: '#category-ecommerce'
                },
                {
                  title: 'Hire Employees',
                  desc: 'Total employee costs, payroll taxes, overtime & hiring budgets.',
                  count: '11 Tools',
                  icon: 'group_add',
                  color: 'secondary',
                  link: '#category-hr'
                },
                {
                  title: 'Manage Inventory',
                  desc: 'Reorder points, safety stock buffer & inventory turnover.',
                  count: '9 Tools',
                  icon: 'inventory_2',
                  color: 'on-surface',
                  link: '#category-inventory'
                },
                {
                  title: 'Improve Marketing',
                  desc: 'Ad spend ROI, customer acquisition costs & conversion rates.',
                  count: '13 Tools',
                  icon: 'campaign',
                  color: 'primary',
                  link: '#category-marketing'
                },
                {
                  title: 'Improve Cash Flow',
                  desc: 'Working capital, cash runway & operational expense buffers.',
                  count: '12 Tools',
                  icon: 'account_balance',
                  color: 'secondary',
                  link: '#category-accounting'
                },
                {
                  title: 'Scale Operations',
                  desc: 'Production capacity, equipment uptime & meeting cost tracking.',
                  count: '10 Tools',
                  icon: 'precision_manufacturing',
                  color: 'on-surface',
                  link: '#category-operations'
                },
                {
                  title: 'Build SaaS',
                  desc: 'Rule of 40, recurring revenue, customer retention & churn rate.',
                  count: '15 Tools',
                  icon: 'hub',
                  color: 'primary',
                  link: '#category-saas'
                }
              ].map(card => (
                <a
                  key={card.title}
                  href={card.link}
                  className="group bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between hover:-translate-y-0.5 border border-outline-variant/30"
                >
                  <div>
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center mb-space-sm transition-colors ${
                        card.color === 'primary'
                          ? 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-on-primary'
                          : card.color === 'secondary'
                          ? 'bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-on-secondary'
                          : card.color === 'tertiary'
                          ? 'bg-tertiary-fixed-dim/20 text-tertiary group-hover:bg-tertiary group-hover:text-on-tertiary'
                          : 'bg-surface-container-highest text-on-surface group-hover:bg-on-surface group-hover:text-surface-bright'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[22px]">{card.icon}</span>
                    </div>
                    <h3
                      className={`font-headline-md text-headline-md text-on-surface font-semibold transition-colors text-base leading-snug ${
                        card.color === 'primary'
                          ? 'group-hover:text-primary'
                          : card.color === 'secondary'
                          ? 'group-hover:text-secondary'
                          : card.color === 'tertiary'
                          ? 'group-hover:text-tertiary'
                          : 'group-hover:text-primary'
                      }`}
                    >
                      {card.title}
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-2xs line-clamp-2">{card.desc}</p>
                  </div>
                  <div
                    className={`mt-space-md pt-space-xs flex items-center justify-between font-label-caps text-label-caps font-semibold ${
                      card.color === 'primary'
                        ? 'text-primary'
                        : card.color === 'secondary'
                        ? 'text-secondary'
                        : card.color === 'tertiary'
                        ? 'text-tertiary'
                        : 'text-on-surface'
                    }`}
                  >
                    <span>{card.count}</span>
                    <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ================= SECTION 3: BUSINESS HEALTH DASHBOARD ================= */}
        <section className="w-full py-space-2xl bg-background">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="bg-surface-container-lowest rounded-2xl p-space-xl shadow-sm border border-outline-variant/30">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-space-lg gap-space-md">
                <div>
                  <div className="flex items-center gap-space-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary-container animate-pulse"></span>
                    <span className="font-label-caps text-label-caps uppercase text-secondary font-bold tracking-wider">
                      Business Health Benchmarks
                    </span>
                  </div>
                  <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface mt-space-2xs">
                    Key Business Metrics &amp; Benchmarks
                  </h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Standard industry benchmarks and financial targets for healthy, growing companies.
                  </p>
                </div>
                <div className="flex items-center gap-space-sm">
                  <span className="font-data-mono text-data-mono text-xs text-on-surface-variant">
                    Interactive Example
                  </span>
                  <button
                    onClick={refreshDashboard}
                    className="px-space-sm py-space-2xs bg-surface-container hover:bg-surface-container-high rounded text-on-surface font-body-sm text-body-sm flex items-center gap-space-2xs transition-colors cursor-pointer border border-outline-variant/20"
                  >
                    <span className="material-symbols-outlined text-[16px]">sync</span>
                    Simulate Example Numbers
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-lg pt-space-xs">
                {/* Metric 1 */}
                <div className="bg-surface-container-low p-space-lg rounded-xl flex flex-col justify-between border border-outline-variant/20">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider">
                        Monthly Revenue
                      </span>
                      <span className="material-symbols-outlined text-primary text-[20px]">show_chart</span>
                    </div>
                    <div className="mt-space-sm">
                      <span className="font-numerical-display text-numerical-display text-on-surface font-bold tracking-tight">
                        ${telemetry.mrr.toLocaleString()}
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant block mt-space-2xs">
                        Monthly Recurring Revenue (+{telemetry.mrrGrowth}% MoM)
                      </span>
                    </div>
                  </div>
                  <div className="mt-space-md pt-space-sm flex items-center justify-between">
                    <span className="px-space-xs py-0.5 rounded bg-primary/10 text-primary font-label-caps text-label-caps font-bold">
                      Strong Growth
                    </span>
                    <svg className="w-20 h-6 text-primary" fill="none" viewBox="0 0 100 30">
                      <path d="M0 25 Q25 22 50 14 T100 4" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5"></path>
                    </svg>
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="bg-surface-container-low p-space-lg rounded-xl flex flex-col justify-between border border-outline-variant/20">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider">
                        Profit Margins
                      </span>
                      <span className="material-symbols-outlined text-secondary text-[20px]">pie_chart</span>
                    </div>
                    <div className="mt-space-sm">
                      <span className="font-numerical-display text-numerical-display text-on-surface font-bold tracking-tight">
                        {telemetry.grossMargin}%
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant block mt-space-2xs">
                        Gross Margin | {telemetry.netMargin}% Net Margin
                      </span>
                    </div>
                  </div>
                  <div className="mt-space-md pt-space-sm flex items-center justify-between">
                    <span className="px-space-xs py-0.5 rounded bg-secondary/10 text-secondary font-label-caps text-label-caps font-bold">
                      Healthy Margins
                    </span>
                    <svg className="w-20 h-6 text-secondary" fill="none" viewBox="0 0 100 30">
                      <path d="M0 20 L25 18 L50 12 L75 14 L100 6" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5"></path>
                    </svg>
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="bg-surface-container-low p-space-lg rounded-xl flex flex-col justify-between border border-outline-variant/20">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider">
                        Cash Runway
                      </span>
                      <span className="material-symbols-outlined text-tertiary text-[20px]">hourglass_top</span>
                    </div>
                    <div className="mt-space-sm">
                      <span className="font-numerical-display text-numerical-display text-on-surface font-bold tracking-tight">
                        {telemetry.runway} Months
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant block mt-space-2xs">
                        ${(telemetry.cash / 1000).toFixed(0)}k Cash / ${(telemetry.netBurn / 1000).toFixed(0)}k Net Monthly Burn
                      </span>
                    </div>
                  </div>
                  <div className="mt-space-md pt-space-sm flex items-center justify-between">
                    <span className="px-space-xs py-0.5 rounded bg-tertiary-fixed-dim/30 text-tertiary font-label-caps text-label-caps font-bold">
                      Safe Runway
                    </span>
                    <div className="w-20 h-2 bg-surface-container-highest rounded-full overflow-hidden">
                      <div className="w-4/5 h-full bg-tertiary rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* Metric 4 */}
                <div className="bg-surface-container-low p-space-lg rounded-xl flex flex-col justify-between border border-outline-variant/20">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider">
                        Customer Economics (LTV:CAC)
                      </span>
                      <span className="material-symbols-outlined text-primary text-[20px]">balance</span>
                    </div>
                    <div className="mt-space-sm">
                      <span className="font-numerical-display text-numerical-display text-on-surface font-bold tracking-tight">
                        {telemetry.ratio}x
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant block mt-space-2xs">
                        ${telemetry.ltv.toLocaleString()} LTV vs ${telemetry.cac} CAC
                      </span>
                    </div>
                  </div>
                  <div className="mt-space-md pt-space-sm flex items-center justify-between">
                    <span className="px-space-xs py-0.5 rounded bg-primary/10 text-primary font-label-caps text-label-caps font-bold">
                      Target Met
                    </span>
                    <span className="font-data-mono text-data-mono text-xs text-primary font-bold">Target: &gt;3.0x</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SECTION 4: FLAGSHIP INTERACTIVE WORKBENCHES ================= */}
        <section className="w-full py-space-3xl bg-surface-container-low/40 border-y border-outline-variant/20">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="text-center max-w-2xl mx-auto mb-space-2xl">
              <span className="font-label-caps text-label-caps uppercase text-primary tracking-widest font-semibold">
                POPULAR TOOLS
              </span>
              <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface mt-space-2xs">
                Featured Business Calculators
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-space-2xs">
                Try our most popular interactive calculators to test pricing, cash runway, SaaS health, and profit margins.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-xl">
              {/* WORKBENCH 1: Profit Margin & Markup Engine */}
              <div className="bg-surface-container-lowest rounded-2xl p-space-xl shadow-md border border-outline-variant/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-space-md">
                    <div className="flex items-center gap-space-xs">
                      <div className="p-space-xs bg-primary/10 rounded-lg text-primary">
                        <span className="material-symbols-outlined text-[20px]">point_of_sale</span>
                      </div>
                      <div>
                        <h3 className="font-headline-md text-headline-md font-bold text-on-surface text-lg">
                          Profit Margin &amp; Markup Calculator
                        </h3>
                        <span className="font-label-caps text-label-caps text-on-surface-variant">
                          Instant Margin &amp; Markup Formula
                        </span>
                      </div>
                    </div>
                    <span className="font-data-mono text-data-mono text-xs bg-surface-container-high px-space-xs py-0.5 rounded text-on-surface-variant font-semibold">
                      Live Calculator
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md mt-space-lg">
                    <div>
                      <label className="block font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider mb-1">
                        Cost of Goods Sold (COGS)
                      </label>
                      <div className="relative flex items-center bg-surface-container-low rounded-lg focus-within:ring-2 focus-within:ring-primary/20 border border-outline-variant/20">
                        <span className="pl-space-sm font-data-mono text-on-surface-variant">$</span>
                        <input
                          className="w-full py-space-sm px-space-xs bg-transparent outline-none font-data-mono text-data-mono text-on-surface font-semibold"
                          id="wb1-cogs"
                          type="number"
                          step="0.01"
                          value={wb1Cogs}
                          onChange={e => setWb1Cogs(parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider mb-1">
                        Target Gross Margin (%)
                      </label>
                      <div className="relative flex items-center bg-surface-container-low rounded-lg focus-within:ring-2 focus-within:ring-primary/20 border border-outline-variant/20">
                        <input
                          className="w-full py-space-sm px-space-sm bg-transparent outline-none font-data-mono text-data-mono text-on-surface font-semibold"
                          id="wb1-margin"
                          type="number"
                          step="0.5"
                          value={wb1Margin}
                          onChange={e => setWb1Margin(parseFloat(e.target.value) || 0)}
                        />
                        <span className="pr-space-sm font-data-mono text-on-surface-variant">%</span>
                      </div>
                    </div>
                  </div>

                  {/* Calculated Output Area */}
                  <div className="mt-space-lg bg-surface-container-low p-space-md rounded-xl grid grid-cols-3 gap-space-sm text-center border border-outline-variant/20">
                    <div>
                      <span className="font-label-caps text-label-caps uppercase text-on-surface-variant block">Required Price</span>
                      <span className="font-numerical-display text-numerical-display text-primary font-bold block mt-1">
                        {marginResult.price}
                      </span>
                    </div>
                    <div>
                      <span className="font-label-caps text-label-caps uppercase text-on-surface-variant block">Gross Profit</span>
                      <span className="font-numerical-display text-numerical-display text-secondary font-bold block mt-1">
                        {marginResult.profit}
                      </span>
                    </div>
                    <div>
                      <span className="font-label-caps text-label-caps uppercase text-on-surface-variant block">Effective Markup</span>
                      <span className="font-numerical-display text-numerical-display text-on-surface font-bold block mt-1">
                        {marginResult.markup}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-space-md pt-space-sm text-right">
                  <a className="font-body-sm text-body-sm text-primary font-semibold hover:underline inline-flex items-center gap-1" href="#category-profit">
                    Open Profit Calculator →
                  </a>
                </div>
              </div>

              {/* WORKBENCH 2: SaaS Quick-Metrics & Rule of 40 */}
              <div className="bg-surface-container-lowest rounded-2xl p-space-xl shadow-md border border-outline-variant/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-space-md">
                    <div className="flex items-center gap-space-xs">
                      <div className="p-space-xs bg-secondary/10 rounded-lg text-secondary">
                        <span className="material-symbols-outlined text-[20px]">stacked_bar_chart</span>
                      </div>
                      <div>
                        <h3 className="font-headline-md text-headline-md font-bold text-on-surface text-lg">
                          SaaS Rule of 40 Calculator
                        </h3>
                        <span className="font-label-caps text-label-caps text-on-surface-variant">
                          Growth vs Profitability Benchmark
                        </span>
                      </div>
                    </div>
                    <span className="font-data-mono text-data-mono text-xs bg-surface-container-high px-space-xs py-0.5 rounded text-on-surface-variant font-semibold">
                      Live Calculator
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md mt-space-lg">
                    <div>
                      <label className="block font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider mb-1">
                        YoY Revenue Growth Rate
                      </label>
                      <div className="relative flex items-center bg-surface-container-low rounded-lg focus-within:ring-2 focus-within:ring-secondary/20 border border-outline-variant/20">
                        <input
                          className="w-full py-space-sm px-space-sm bg-transparent outline-none font-data-mono text-data-mono text-on-surface font-semibold"
                          id="wb2-growth"
                          type="number"
                          step="1"
                          value={wb2Growth}
                          onChange={e => setWb2Growth(parseFloat(e.target.value) || 0)}
                        />
                        <span className="pr-space-sm font-data-mono text-on-surface-variant">%</span>
                      </div>
                    </div>
                    <div>
                      <label className="block font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider mb-1">
                        Free Cash Flow Margin
                      </label>
                      <div className="relative flex items-center bg-surface-container-low rounded-lg focus-within:ring-2 focus-within:ring-secondary/20 border border-outline-variant/20">
                        <input
                          className="w-full py-space-sm px-space-sm bg-transparent outline-none font-data-mono text-data-mono text-on-surface font-semibold"
                          id="wb2-fcf"
                          type="number"
                          step="1"
                          value={wb2Fcf}
                          onChange={e => setWb2Fcf(parseFloat(e.target.value) || 0)}
                        />
                        <span className="pr-space-sm font-data-mono text-on-surface-variant">%</span>
                      </div>
                    </div>
                  </div>

                  {/* Calculated Output Area */}
                  <div className="mt-space-lg bg-surface-container-low p-space-md rounded-xl flex items-center justify-between border border-outline-variant/20">
                    <div>
                      <span className="font-label-caps text-label-caps uppercase text-on-surface-variant block">
                        Rule of 40 Score
                      </span>
                      <span className="font-numerical-display text-numerical-display text-secondary font-bold block mt-1">
                        {ruleOf40Result.score}
                      </span>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-space-sm py-1 rounded font-label-caps text-label-caps font-bold inline-block ${ruleOf40Result.badgeClass}`}
                      >
                        {ruleOf40Result.badge}
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant block mt-1">
                        {ruleOf40Result.desc}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-space-md pt-space-sm text-right">
                  <a className="font-body-sm text-body-sm text-secondary font-semibold hover:underline inline-flex items-center gap-1" href="#category-saas">
                    Open SaaS Calculator →
                  </a>
                </div>
              </div>

              {/* WORKBENCH 3: Startup Runway & Burn Rate Forecaster */}
              <div className="bg-surface-container-lowest rounded-2xl p-space-xl shadow-md border border-outline-variant/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-space-md">
                    <div className="flex items-center gap-space-xs">
                      <div className="p-space-xs bg-tertiary-fixed-dim/30 rounded-lg text-tertiary">
                        <span className="material-symbols-outlined text-[20px]">timelapse</span>
                      </div>
                      <div>
                        <h3 className="font-headline-md text-headline-md font-bold text-on-surface text-lg">
                          Cash Runway &amp; Burn Rate Calculator
                        </h3>
                        <span className="font-label-caps text-label-caps text-on-surface-variant">
                          Cash Flow &amp; Runway Estimation
                        </span>
                      </div>
                    </div>
                    <span className="font-data-mono text-data-mono text-xs bg-surface-container-high px-space-xs py-0.5 rounded text-on-surface-variant font-semibold">
                      Live Calculator
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm mt-space-lg">
                    <div>
                      <label className="block font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider mb-1 text-xs">
                        Cash Balance
                      </label>
                      <div className="relative flex items-center bg-surface-container-low rounded-lg focus-within:ring-2 focus-within:ring-tertiary/20 border border-outline-variant/20">
                        <span className="pl-space-xs font-data-mono text-xs text-on-surface-variant">$</span>
                        <input
                          className="w-full py-space-sm px-space-xs bg-transparent outline-none font-data-mono text-data-mono text-on-surface font-semibold text-xs"
                          id="wb3-cash"
                          type="number"
                          step="5000"
                          value={wb3Cash}
                          onChange={e => setWb3Cash(parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider mb-1 text-xs">
                        Monthly Rev
                      </label>
                      <div className="relative flex items-center bg-surface-container-low rounded-lg focus-within:ring-2 focus-within:ring-tertiary/20 border border-outline-variant/20">
                        <span className="pl-space-xs font-data-mono text-xs text-on-surface-variant">$</span>
                        <input
                          className="w-full py-space-sm px-space-xs bg-transparent outline-none font-data-mono text-data-mono text-on-surface font-semibold text-xs"
                          id="wb3-rev"
                          type="number"
                          step="1000"
                          value={wb3Rev}
                          onChange={e => setWb3Rev(parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider mb-1 text-xs">
                        Monthly Exp
                      </label>
                      <div className="relative flex items-center bg-surface-container-low rounded-lg focus-within:ring-2 focus-within:ring-tertiary/20 border border-outline-variant/20">
                        <span className="pl-space-xs font-data-mono text-xs text-on-surface-variant">$</span>
                        <input
                          className="w-full py-space-sm px-space-xs bg-transparent outline-none font-data-mono text-data-mono text-on-surface font-semibold text-xs"
                          id="wb3-exp"
                          type="number"
                          step="1000"
                          value={wb3Exp}
                          onChange={e => setWb3Exp(parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Calculated Output Area */}
                  <div className="mt-space-lg bg-surface-container-low p-space-md rounded-xl grid grid-cols-2 gap-space-sm text-center border border-outline-variant/20">
                    <div>
                      <span className="font-label-caps text-label-caps uppercase text-on-surface-variant block">Net Monthly Burn</span>
                      <span className={`font-numerical-display text-numerical-display font-bold block mt-1 ${runwayResult.burnClass}`}>
                        {runwayResult.burn}
                      </span>
                    </div>
                    <div>
                      <span className="font-label-caps text-label-caps uppercase text-on-surface-variant block">Runway Until Zero Cash</span>
                      <span className="font-numerical-display text-numerical-display text-on-surface font-bold block mt-1">
                        {runwayResult.runway}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-space-md pt-space-sm text-right">
                  <a className="font-body-sm text-body-sm text-tertiary font-semibold hover:underline inline-flex items-center gap-1" href="#category-startup">
                    Open Runway Calculator →
                  </a>
                </div>
              </div>

              {/* WORKBENCH 4: Ecommerce Net Profit & Platform Fee Modeler */}
              <div className="bg-surface-container-lowest rounded-2xl p-space-xl shadow-md border border-outline-variant/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-space-md">
                    <div className="flex items-center gap-space-xs">
                      <div className="p-space-xs bg-primary/10 rounded-lg text-primary">
                        <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                      </div>
                      <div>
                        <h3 className="font-headline-md text-headline-md font-bold text-on-surface text-lg">
                          Ecommerce Profit &amp; Fee Calculator
                        </h3>
                        <span className="font-label-caps text-label-caps text-on-surface-variant">
                          Amazon &amp; Shopify Net Profit
                        </span>
                      </div>
                    </div>
                    <span className="font-data-mono text-data-mono text-xs bg-surface-container-high px-space-xs py-0.5 rounded text-on-surface-variant font-semibold">
                      Live Calculator
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-xs mt-space-lg">
                    <div>
                      <label className="block font-label-caps text-label-caps uppercase text-on-surface-variant text-[10px] tracking-wider mb-1">
                        Price
                      </label>
                      <div className="flex items-center bg-surface-container-low rounded-lg border border-outline-variant/20">
                        <span className="pl-1.5 font-data-mono text-xs text-on-surface-variant">$</span>
                        <input
                          className="w-full py-space-xs px-1 bg-transparent outline-none font-data-mono text-xs text-on-surface font-semibold"
                          id="wb4-price"
                          type="number"
                          step="1"
                          value={wb4Price}
                          onChange={e => setWb4Price(parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block font-label-caps text-label-caps uppercase text-on-surface-variant text-[10px] tracking-wider mb-1">
                        COGS
                      </label>
                      <div className="flex items-center bg-surface-container-low rounded-lg border border-outline-variant/20">
                        <span className="pl-1.5 font-data-mono text-xs text-on-surface-variant">$</span>
                        <input
                          className="w-full py-space-xs px-1 bg-transparent outline-none font-data-mono text-xs text-on-surface font-semibold"
                          id="wb4-cogs"
                          type="number"
                          step="1"
                          value={wb4Cogs}
                          onChange={e => setWb4Cogs(parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block font-label-caps text-label-caps uppercase text-on-surface-variant text-[10px] tracking-wider mb-1">
                        Ad CPA
                      </label>
                      <div className="flex items-center bg-surface-container-low rounded-lg border border-outline-variant/20">
                        <span className="pl-1.5 font-data-mono text-xs text-on-surface-variant">$</span>
                        <input
                          className="w-full py-space-xs px-1 bg-transparent outline-none font-data-mono text-xs text-on-surface font-semibold"
                          id="wb4-cpa"
                          type="number"
                          step="0.5"
                          value={wb4Cpa}
                          onChange={e => setWb4Cpa(parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block font-label-caps text-label-caps uppercase text-on-surface-variant text-[10px] tracking-wider mb-1">
                        Fee %
                      </label>
                      <div className="flex items-center bg-surface-container-low rounded-lg border border-outline-variant/20">
                        <input
                          className="w-full py-space-xs px-2 bg-transparent outline-none font-data-mono text-xs text-on-surface font-semibold"
                          id="wb4-fee"
                          type="number"
                          step="1"
                          value={wb4Fee}
                          onChange={e => setWb4Fee(parseFloat(e.target.value) || 0)}
                        />
                        <span className="pr-1.5 font-data-mono text-xs text-on-surface-variant">%</span>
                      </div>
                    </div>
                  </div>

                  {/* Calculated Output Area */}
                  <div className="mt-space-lg bg-surface-container-low p-space-md rounded-xl grid grid-cols-2 gap-space-sm text-center border border-outline-variant/20">
                    <div>
                      <span className="font-label-caps text-label-caps uppercase text-on-surface-variant block">Net Profit / Order</span>
                      <span className="font-numerical-display text-numerical-display text-primary font-bold block mt-1">
                        {ecomResult.net}
                      </span>
                    </div>
                    <div>
                      <span className="font-label-caps text-label-caps uppercase text-on-surface-variant block">Net Margin Percentage</span>
                      <span className="font-numerical-display text-numerical-display text-on-surface font-bold block mt-1">
                        {ecomResult.pct}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-space-md pt-space-sm text-right">
                  <a className="font-body-sm text-body-sm text-primary font-semibold hover:underline inline-flex items-center gap-1" href="#category-ecommerce">
                    Open Ecommerce Calculator →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SECTION 5: EXHAUSTIVE 17-CATEGORY DIRECTORY ================= */}
        <section className="w-full py-space-3xl bg-background" id="all">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-xl gap-space-md">
              <div>
                <span className="font-label-caps text-label-caps uppercase text-primary tracking-widest font-semibold">
                  BUSINESS CALCULATOR DIRECTORY
                </span>
                <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface mt-space-2xs">
                  Explore All Business Calculators
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl mt-space-2xs leading-relaxed">
                  Find free Business Tools &amp; Calculators for profit margins, ROI, payroll, pricing, inventory management, budgeting, revenue forecasting, and business planning. Fast, accurate, and easy-to-use calculators for entrepreneurs, startups, freelancers, and businesses worldwide.
                </p>
              </div>
              <div className="flex items-center gap-space-xs font-data-mono text-data-mono text-xs shrink-0">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                <span>250+ Business Calculators • 100% Free &amp; Private</span>
              </div>
            </div>

            {/* Popular Calculator Categories Grid */}
            <div className="mb-space-2xl">
              <div className="flex items-center justify-between mb-space-sm">
                <h3 className="font-headline-md text-headline-md text-on-surface font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">stars</span>
                  Popular Calculator Categories
                </h3>
                <span className="font-label-caps text-[11px] text-on-surface-variant uppercase">Core Business Hub</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-space-sm">
                {[
                  { name: 'Profit Margin Calculators', icon: 'payments', count: '18 Tools', query: 'Profit Margin' },
                  { name: 'ROI Calculators', icon: 'trending_up', count: '14 Tools', query: 'ROI' },
                  { name: 'Break-Even Calculators', icon: 'balance', count: '12 Tools', query: 'Break-Even' },
                  { name: 'Payroll Calculators', icon: 'badge', count: '15 Tools', query: 'Payroll' },
                  { name: 'Revenue Calculators', icon: 'account_balance_wallet', count: '16 Tools', query: 'Revenue' },
                  { name: 'Pricing & Markup Calculators', icon: 'sell', count: '12 Tools', query: 'Pricing' },
                  { name: 'Inventory Calculators', icon: 'inventory_2', count: '11 Tools', query: 'Inventory' },
                  { name: 'Cash Flow Calculators', icon: 'currency_exchange', count: '14 Tools', query: 'Cash Flow' },
                  { name: 'Startup Cost Calculators', icon: 'rocket_launch', count: '10 Tools', query: 'Startup' },
                  { name: 'Business Loan Calculators', icon: 'account_balance', count: '9 Tools', query: 'Loan' },
                  { name: 'Sales Tax Calculators', icon: 'receipt_long', count: '13 Tools', query: 'Tax' },
                  { name: 'Business Growth Calculators', icon: 'monitoring', count: '15 Tools', query: 'Growth' },
                  { name: 'Productivity Calculators', icon: 'schedule', count: '10 Tools', query: 'Productivity' },
                  { name: 'Financial Planning Tools', icon: 'query_stats', count: '16 Tools', query: 'Financial' },
                ].map(item => (
                  <button
                    key={item.name}
                    onClick={() => {
                      setSearchQuery(item.query);
                      const el = document.getElementById('tool-search-input');
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth' });
                        el.focus();
                      }
                    }}
                    className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/30 hover:border-primary/50 hover:shadow-xs transition-all flex items-center justify-between group text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-primary text-[18px] group-hover:scale-110 transition-transform">
                        {item.icon}
                      </span>
                      <span className="font-body-sm text-body-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                        {item.name}
                      </span>
                    </div>
                    <span className="font-data-mono text-[10px] text-on-surface-variant bg-surface-container px-1.5 py-0.5 rounded">
                      {item.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-space-2xl">
              {filteredCategories.map(cat => (
                <div
                  key={cat.id}
                  className="bg-surface-container-lowest p-space-xl rounded-2xl shadow-sm border border-outline-variant/30"
                  id={cat.id}
                >
                  <div className="flex items-center justify-between pb-space-md mb-space-lg border-b border-outline-variant/15">
                    <div className="flex items-center gap-space-sm">
                      <div
                        className={`p-space-xs rounded-lg ${
                          cat.color === 'primary'
                            ? 'bg-primary/10 text-primary'
                            : cat.color === 'secondary'
                            ? 'bg-secondary/10 text-secondary'
                            : 'bg-tertiary-fixed-dim/30 text-tertiary'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[24px]">{cat.icon}</span>
                      </div>
                      <div>
                        <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
                          {cat.num}. {cat.title}
                        </h3>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">{cat.desc}</span>
                      </div>
                    </div>
                    <span className="font-label-caps text-label-caps px-space-sm py-1 bg-surface-container-high rounded text-on-surface-variant font-semibold">
                      {cat.count}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-md">
                    {cat.tools.map(tool => (
                      <a
                        key={tool.name}
                        className="p-space-md bg-surface-container-low hover:bg-surface-container rounded-xl transition-all flex flex-col justify-between group border border-outline-variant/20 hover:border-outline-variant/50"
                        href="#"
                      >
                        <div>
                          <span
                            className={`font-headline-md text-headline-md text-on-surface font-bold transition-colors text-base ${
                              cat.color === 'primary'
                                ? 'group-hover:text-primary'
                                : cat.color === 'secondary'
                                ? 'group-hover:text-secondary'
                                : 'group-hover:text-tertiary'
                            }`}
                          >
                            {tool.name}
                          </span>
                          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">{tool.desc}</p>
                        </div>
                        <span
                          className={`font-label-caps text-label-caps mt-space-md font-bold ${
                            cat.color === 'primary'
                              ? 'text-primary'
                              : cat.color === 'secondary'
                              ? 'text-secondary'
                              : 'text-tertiary'
                          }`}
                        >
                          → {tool.action}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              ))}

              {/* Remaining Quick Categories 13 to 17 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
                {/* Cat 13 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm border border-outline-variant/30">
                  <div className="flex items-center gap-space-xs mb-space-sm text-secondary">
                    <span className="material-symbols-outlined text-[22px]">laptop_mac</span>
                    <h3 className="font-headline-md text-headline-md font-bold text-on-surface text-base">
                      13. Freelancers &amp; Agencies
                    </h3>
                  </div>
                  <ul className="space-y-space-xs font-body-sm text-body-sm">
                    <li>
                      <a className="text-on-surface hover:text-secondary flex justify-between py-1.5 border-b border-surface-container-low transition-colors group" href="#">
                        <span className="font-bold text-on-surface group-hover:text-secondary">Billable Hourly Rate Engine</span>
                        <span className="font-data-mono text-xs font-bold">→</span>
                      </a>
                    </li>
                    <li>
                      <a className="text-on-surface hover:text-secondary flex justify-between py-1.5 border-b border-surface-container-low transition-colors group" href="#">
                        <span className="font-bold text-on-surface group-hover:text-secondary">Fixed-Fee Project Scope Calculator</span>
                        <span className="font-data-mono text-xs font-bold">→</span>
                      </a>
                    </li>
                    <li>
                      <a className="text-on-surface hover:text-secondary flex justify-between py-1.5 border-b border-surface-container-low transition-colors group" href="#">
                        <span className="font-bold text-on-surface group-hover:text-secondary">Monthly Retainer Profitability</span>
                        <span className="font-data-mono text-xs font-bold">→</span>
                      </a>
                    </li>
                    <li>
                      <a className="text-on-surface hover:text-secondary flex justify-between py-1.5 transition-colors group" href="#">
                        <span className="font-bold text-on-surface group-hover:text-secondary">Agency Capacity Utilization</span>
                        <span className="font-data-mono text-xs font-bold">→</span>
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Cat 14 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm border border-outline-variant/30" id="category-ai">
                  <div className="flex items-center gap-space-xs mb-space-sm text-primary">
                    <span className="material-symbols-outlined text-[22px]">neurology</span>
                    <h3 className="font-headline-md text-headline-md font-bold text-on-surface text-base">
                      14. AI Business &amp; Cloud Tools
                    </h3>
                  </div>
                  <ul className="space-y-space-xs font-body-sm text-body-sm">
                    <li>
                      <a className="text-on-surface hover:text-primary flex justify-between py-1.5 border-b border-surface-container-low transition-colors group" href="#">
                        <span className="font-bold text-on-surface group-hover:text-primary">LLM Token Cost &amp; Margin Estimator</span>
                        <span className="font-data-mono text-xs font-bold">→</span>
                      </a>
                    </li>
                    <li>
                      <a className="text-on-surface hover:text-primary flex justify-between py-1.5 border-b border-surface-container-low transition-colors group" href="#">
                        <span className="font-bold text-on-surface group-hover:text-primary">AI Workflow Automation ROI</span>
                        <span className="font-data-mono text-xs font-bold">→</span>
                      </a>
                    </li>
                    <li>
                      <a className="text-on-surface hover:text-primary flex justify-between py-1.5 border-b border-surface-container-low transition-colors group" href="#">
                        <span className="font-bold text-on-surface group-hover:text-primary">Cloud GPU Server Unit Economics</span>
                        <span className="font-data-mono text-xs font-bold">→</span>
                      </a>
                    </li>
                    <li>
                      <a className="text-on-surface hover:text-primary flex justify-between py-1.5 transition-colors group" href="#">
                        <span className="font-bold text-on-surface group-hover:text-primary">RAG Pipeline Cost Architect</span>
                        <span className="font-data-mono text-xs font-bold">→</span>
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Cat 15 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm border border-outline-variant/30">
                  <div className="flex items-center gap-space-xs mb-space-sm text-tertiary">
                    <span className="material-symbols-outlined text-[22px]">restaurant</span>
                    <h3 className="font-headline-md text-headline-md font-bold text-on-surface text-base">
                      15. Local Business &amp; Hospitality
                    </h3>
                  </div>
                  <ul className="space-y-space-xs font-body-sm text-body-sm">
                    <li>
                      <a className="text-on-surface hover:text-tertiary flex justify-between py-1.5 border-b border-surface-container-low transition-colors group" href="#">
                        <span className="font-bold text-on-surface group-hover:text-tertiary">Restaurant Prime Cost &amp; Food %</span>
                        <span className="font-data-mono text-xs font-bold">→</span>
                      </a>
                    </li>
                    <li>
                      <a className="text-on-surface hover:text-tertiary flex justify-between py-1.5 border-b border-surface-container-low transition-colors group" href="#">
                        <span className="font-bold text-on-surface group-hover:text-tertiary">Menu Engineering Profit Matrix</span>
                        <span className="font-data-mono text-xs font-bold">→</span>
                      </a>
                    </li>
                    <li>
                      <a className="text-on-surface hover:text-tertiary flex justify-between py-1.5 border-b border-surface-container-low transition-colors group" href="#">
                        <span className="font-bold text-on-surface group-hover:text-tertiary">Salon &amp; Studio Chair Yield</span>
                        <span className="font-data-mono text-xs font-bold">→</span>
                      </a>
                    </li>
                    <li>
                      <a className="text-on-surface hover:text-tertiary flex justify-between py-1.5 transition-colors group" href="#">
                        <span className="font-bold text-on-surface group-hover:text-tertiary">Gym Member ARPU &amp; Churn</span>
                        <span className="font-data-mono text-xs font-bold">→</span>
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Cat 16 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm border border-outline-variant/30" id="category-realestate">
                  <div className="flex items-center gap-space-xs mb-space-sm text-secondary">
                    <span className="material-symbols-outlined text-[22px]">domain</span>
                    <h3 className="font-headline-md text-headline-md font-bold text-on-surface text-base">
                      16. Real Estate &amp; Commercial Investing
                    </h3>
                  </div>
                  <ul className="space-y-space-xs font-body-sm text-body-sm">
                    <li>
                      <a className="text-on-surface hover:text-secondary flex justify-between py-1.5 border-b border-surface-container-low transition-colors group" href="#">
                        <span className="font-bold text-on-surface group-hover:text-secondary">Commercial Cap Rate Calculator</span>
                        <span className="font-data-mono text-xs font-bold">→</span>
                      </a>
                    </li>
                    <li>
                      <a className="text-on-surface hover:text-secondary flex justify-between py-1.5 border-b border-surface-container-low transition-colors group" href="#">
                        <span className="font-bold text-on-surface group-hover:text-secondary">Cash-on-Cash Return Modeler</span>
                        <span className="font-data-mono text-xs font-bold">→</span>
                      </a>
                    </li>
                    <li>
                      <a className="text-on-surface hover:text-secondary flex justify-between py-1.5 border-b border-surface-container-low transition-colors group" href="#">
                        <span className="font-bold text-on-surface group-hover:text-secondary">Net Operating Income (NOI) Workbench</span>
                        <span className="font-data-mono text-xs font-bold">→</span>
                      </a>
                    </li>
                    <li>
                      <a className="text-on-surface hover:text-secondary flex justify-between py-1.5 transition-colors group" href="#">
                        <span className="font-bold text-on-surface group-hover:text-secondary">Gross Rent Multiplier (GRM)</span>
                        <span className="font-data-mono text-xs font-bold">→</span>
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Cat 17 */}
                <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm border border-outline-variant/30 md:col-span-2">
                  <div className="flex items-center gap-space-xs mb-space-sm text-primary">
                    <span className="material-symbols-outlined text-[22px]">document_scanner</span>
                    <h3 className="font-headline-md text-headline-md font-bold text-on-surface text-base">
                      17. Generators &amp; Financial Templates
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                    <ul className="space-y-space-xs font-body-sm text-body-sm">
                      <li>
                        <a className="text-on-surface hover:text-primary flex justify-between py-1.5 border-b border-surface-container-low transition-colors group" href="#">
                          <span className="font-bold text-on-surface group-hover:text-primary">Instant Client-Side Invoice Generator</span>
                          <span className="font-data-mono text-xs font-bold">→</span>
                        </a>
                      </li>
                      <li>
                        <a className="text-on-surface hover:text-primary flex justify-between py-1.5 border-b border-surface-container-low transition-colors group" href="#">
                          <span className="font-bold text-on-surface group-hover:text-primary">Standard Purchase Order (PO) Builder</span>
                          <span className="font-data-mono text-xs font-bold">→</span>
                        </a>
                      </li>
                    </ul>
                    <ul className="space-y-space-xs font-body-sm text-body-sm">
                      <li>
                        <a className="text-on-surface hover:text-primary flex justify-between py-1.5 border-b border-surface-container-low transition-colors group" href="#">
                          <span className="font-bold text-on-surface group-hover:text-primary">5-Year Pro-Forma Cash Flow Template</span>
                          <span className="font-data-mono text-xs font-bold">→</span>
                        </a>
                      </li>
                      <li>
                        <a className="text-on-surface hover:text-primary flex justify-between py-1.5 transition-colors group" href="#">
                          <span className="font-bold text-on-surface group-hover:text-primary">Independent Contractor NDA Generator</span>
                          <span className="font-data-mono text-xs font-bold">→</span>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SECTION 6: BUSINESS ECOSYSTEM LIFECYCLE MAP ================= */}
        <section className="w-full py-space-3xl bg-surface-container-low/60 border-y border-outline-variant/20">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="mb-space-2xl text-center max-w-2xl mx-auto">
              <span className="font-label-caps text-label-caps uppercase text-primary tracking-widest font-semibold">
                BUSINESS GROWTH ROADMAP
              </span>
              <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface mt-space-2xs">
                Tools for Every Stage of Your Business
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-space-2xs">
                Find the right financial and operational tools for each milestone from early concept to full exit.
              </p>
            </div>

            <div className="relative overflow-x-auto pb-space-md">
              <div className="min-w-[960px] flex items-stretch gap-space-xs">
                {[
                  { num: '01', stage: 'Idea', desc: 'Validate market readiness and TAM.', tool: 'Lean Canvas', color: 'primary' },
                  { num: '02', stage: 'Validation', desc: 'MVP cost & customer willingness to pay.', tool: 'Break-Even Calc', color: 'primary' },
                  { num: '03', stage: 'Funding', desc: 'Cap table setup, SAFE notes & runway.', tool: 'Cap Table', color: 'secondary' },
                  { num: '04', stage: 'Launch', desc: 'Set initial pricing tiers and margins.', tool: 'Margin Engine', color: 'secondary' },
                  { num: '05', stage: 'PMF', desc: 'Measure cohort churn & retention curve.', tool: 'NRR Cohorts', color: 'tertiary' },
                  { num: '06', stage: 'Growth', desc: 'Dial in paid marketing ROAS & CAC.', tool: 'LTV:CAC Ratio', color: 'tertiary' },
                  { num: '07', stage: 'Hiring', desc: 'Calculate fully loaded burden rates.', tool: 'Burden Rate', color: 'primary' },
                  { num: '08', stage: 'Scale', desc: 'Working capital & cash conversion.', tool: 'Working Capital', color: 'secondary' },
                  { num: '09', stage: 'Exit', desc: 'EBITDA multiples and final M&A cap.', tool: 'Valuation Suite', color: 'on-surface' }
                ].map(step => (
                  <div
                    key={step.num}
                    className="flex-1 bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between"
                  >
                    <div>
                      <span
                        className={`font-data-mono text-data-mono text-xs font-bold ${
                          step.color === 'primary'
                            ? 'text-primary'
                            : step.color === 'secondary'
                            ? 'text-secondary'
                            : step.color === 'tertiary'
                            ? 'text-tertiary'
                            : 'text-on-surface'
                        }`}
                      >
                        {step.num}
                      </span>
                      <h4 className="font-headline-md text-headline-md text-on-surface text-base font-bold mt-1">{step.stage}</h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">{step.desc}</p>
                    </div>
                    <span
                      className={`mt-space-md font-label-caps text-label-caps px-space-xs py-1 rounded inline-block text-center font-semibold ${
                        step.color === 'primary'
                          ? 'text-primary bg-primary/10'
                          : step.color === 'secondary'
                          ? 'text-secondary bg-secondary/10'
                          : step.color === 'tertiary'
                          ? 'text-tertiary bg-tertiary-fixed-dim/30'
                          : 'text-on-surface bg-surface-container-high'
                      }`}
                    >
                      {step.tool}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ================= SECTION 7: SMART TOOL RECOMMENDER ================= */}
        <section className="w-full py-space-3xl bg-background">
          <div className="max-w-max-width-calculator mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="bg-surface-container-lowest rounded-2xl p-space-xl shadow-lg border border-surface-container-high">
              <div className="text-center max-w-xl mx-auto mb-space-lg">
                <span className="font-label-caps text-label-caps uppercase text-primary tracking-widest font-semibold">
                  FIND YOUR TOOL
                </span>
                <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface mt-space-2xs">
                  Smart Calculator Finder
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-2xs">
                  Select your business model and primary goal to find the best calculator for your needs.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                <div>
                  <label className="block font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider mb-2 font-semibold">
                    Step 1: Your Business Model
                  </label>
                  <select
                    className="w-full bg-surface-container-low text-on-surface font-body-md text-body-md py-space-sm px-space-md rounded-lg outline-none focus:ring-2 focus:ring-primary/20 border border-outline-variant/20"
                    id="rec-model"
                    value={recModel}
                    onChange={e => setRecModel(e.target.value as typeof recModel)}
                  >
                    <option value="saas">Subscription / SaaS Software</option>
                    <option value="ecom">Ecommerce / Physical Goods</option>
                    <option value="agency">Consultancy / Professional Services</option>
                    <option value="startup">Early-Stage Venture Startup</option>
                  </select>
                </div>
                <div>
                  <label className="block font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider mb-2 font-semibold">
                    Step 2: Immediate Goal
                  </label>
                  <select
                    className="w-full bg-surface-container-low text-on-surface font-body-md text-body-md py-space-sm px-space-md rounded-lg outline-none focus:ring-2 focus:ring-primary/20 border border-outline-variant/20"
                    id="rec-goal"
                    value={recGoal}
                    onChange={e => setRecGoal(e.target.value as typeof recGoal)}
                  >
                    <option value="cash">Protect Liquidity &amp; Cash Flow</option>
                    <option value="pricing">Optimize Pricing &amp; Profit Margins</option>
                    <option value="growth">Accelerate Customer Acquisition</option>
                    <option value="hiring">Expand Headcount Safely</option>
                  </select>
                </div>
              </div>

              <div className="mt-space-lg p-space-md bg-surface-container-low rounded-xl flex flex-col sm:flex-row items-center justify-between gap-space-md border border-outline-variant/20">
                <div>
                  <span className="font-label-caps text-label-caps uppercase text-primary tracking-wider font-semibold">
                    Recommended Calculator
                  </span>
                  <h4 className="font-headline-md text-headline-md font-bold text-on-surface text-lg mt-1" id="rec-title">
                    {recommenderData.title}
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed" id="rec-desc">
                    {recommenderData.desc}
                  </p>
                </div>
                <a
                  className="px-space-md py-space-sm bg-primary hover:bg-primary/90 text-on-primary font-body-sm text-body-sm font-semibold rounded-lg shadow-sm whitespace-nowrap transition-all"
                  href={recommenderData.link}
                  id="rec-link"
                >
                  Open Calculator →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SECTION 8: INDUSTRY-SPECIFIC CALCULATORS ================= */}
        <section className="w-full py-space-3xl bg-surface-container-low/40 border-y border-outline-variant/20">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="mb-space-2xl text-center max-w-2xl mx-auto">
              <span className="font-label-caps text-label-caps uppercase text-primary tracking-widest font-semibold">
                INDUSTRY SOLUTIONS
              </span>
              <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface mt-space-2xs">
                Industry-Specific Calculators
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-space-2xs">
                Pre-configured formulas tailored for specific industries and business models.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
              {/* Suite 1 */}
              <div className="bg-surface-container-lowest p-space-xl rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-outline-variant/30">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-space-md">
                  <span className="material-symbols-outlined text-[28px]">terminal</span>
                </div>
                <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Software &amp; Micro-SaaS</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs leading-relaxed">
                  Designed for recurring subscriptions, customer retention, server hosting costs, and SaaS valuation metrics.
                </p>
                <div className="mt-space-lg flex flex-wrap gap-space-2xs">
                  <span className="font-label-caps text-label-caps bg-surface-container px-space-xs py-1 rounded text-on-surface-variant">
                    LTV/CAC
                  </span>
                  <span className="font-label-caps text-label-caps bg-surface-container px-space-xs py-1 rounded text-on-surface-variant">
                    NRR
                  </span>
                  <span className="font-label-caps text-label-caps bg-surface-container px-space-xs py-1 rounded text-on-surface-variant">
                    Rule of 40
                  </span>
                </div>
              </div>

              {/* Suite 2 */}
              <div className="bg-surface-container-lowest p-space-xl rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-outline-variant/30">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center mb-space-md">
                  <span className="material-symbols-outlined text-[28px]">local_shipping</span>
                </div>
                <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Direct-to-Consumer &amp; FBA</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs leading-relaxed">
                  Designed for Amazon FBA fees, warehousing, shipping costs, customs duties, and return rates.
                </p>
                <div className="mt-space-lg flex flex-wrap gap-space-2xs">
                  <span className="font-label-caps text-label-caps bg-surface-container px-space-xs py-1 rounded text-on-surface-variant">
                    ROAS
                  </span>
                  <span className="font-label-caps text-label-caps bg-surface-container px-space-xs py-1 rounded text-on-surface-variant">
                    FBA Tiers
                  </span>
                  <span className="font-label-caps text-label-caps bg-surface-container px-space-xs py-1 rounded text-on-surface-variant">
                    Landed COGS
                  </span>
                </div>
              </div>

              {/* Suite 3 */}
              <div className="bg-surface-container-lowest p-space-xl rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-outline-variant/30">
                <div className="w-12 h-12 rounded-xl bg-tertiary-fixed-dim/30 text-tertiary flex items-center justify-center mb-space-md">
                  <span className="material-symbols-outlined text-[28px]">factory</span>
                </div>
                <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Manufacturing &amp; Assembly</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs leading-relaxed">
                  Calculations for machine uptime, scrap waste, inventory holding costs, and optimal batch sizes.
                </p>
                <div className="mt-space-lg flex flex-wrap gap-space-2xs">
                  <span className="font-label-caps text-label-caps bg-surface-container px-space-xs py-1 rounded text-on-surface-variant">
                    OEE
                  </span>
                  <span className="font-label-caps text-label-caps bg-surface-container px-space-xs py-1 rounded text-on-surface-variant">
                    EOQ
                  </span>
                  <span className="font-label-caps text-label-caps bg-surface-container px-space-xs py-1 rounded text-on-surface-variant">
                    Scrap Rate
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SECTION 9: KEY FINANCIAL CONCEPTS EXPLAINED ================= */}
        <section className="w-full py-space-3xl bg-background">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="mb-space-2xl text-center max-w-2xl mx-auto">
              <span className="font-label-caps text-label-caps uppercase text-primary tracking-widest font-semibold">
                ESSENTIAL CONCEPTS
              </span>
              <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface mt-space-2xs">
                Key Financial Concepts Explained
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-space-2xs">
                Common financial terms and calculations clarified with straightforward explanations and examples.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
              {/* Diff 1 */}
              <div className="bg-surface-container-lowest p-space-xl rounded-2xl shadow-sm border border-outline-variant/30">
                <div className="flex items-center gap-space-xs mb-space-sm text-primary">
                  <span className="material-symbols-outlined text-[22px]">compare_arrows</span>
                  <h3 className="font-headline-md text-headline-md font-bold text-on-surface text-base">Margin (%) vs Markup (%)</h3>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  <strong>Margin</strong> is gross profit divided by <em>Selling Price</em>: (Price - Cost) ÷ Price.
                  <br />
                  <strong>Markup</strong> is gross profit divided by <em>Cost of Goods</em>: (Price - Cost) ÷ Cost.
                  <br />
                  <span className="text-xs text-primary font-semibold block mt-space-xs">
                    Key Rule: A 50% Margin requires a 100% Markup. Confusing these two can lead to selling products at a loss.
                  </span>
                </p>
              </div>

              {/* Diff 2 */}
              <div className="bg-surface-container-lowest p-space-xl rounded-2xl shadow-sm border border-outline-variant/30">
                <div className="flex items-center gap-space-xs mb-space-sm text-secondary">
                  <span className="material-symbols-outlined text-[22px]">balance</span>
                  <h3 className="font-headline-md text-headline-md font-bold text-on-surface text-base">ROI vs ROAS</h3>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  <strong>ROAS</strong> (Return on Ad Spend) looks purely at total revenue generated per ad dollar (Revenue ÷ Ad Spend).
                  <br />
                  <strong>ROI</strong> measures true net profit after deducting product costs, overhead, and agency fees: (Net Profit ÷ Total Investment) × 100.
                  <br />
                  <span className="text-xs text-secondary font-semibold block mt-space-xs">
                    Key Rule: A 4.0x ROAS can still be unprofitable if gross product margins are under 25%.
                  </span>
                </p>
              </div>

              {/* Diff 3 */}
              <div className="bg-surface-container-lowest p-space-xl rounded-2xl shadow-sm border border-outline-variant/30">
                <div className="flex items-center gap-space-xs mb-space-sm text-tertiary">
                  <span className="material-symbols-outlined text-[22px]">trending_down</span>
                  <h3 className="font-headline-md text-headline-md font-bold text-on-surface text-base">Gross Burn vs Net Burn</h3>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  <strong>Gross Burn</strong> is the total amount of money your company spends each month, regardless of revenue.
                  <br />
                  <strong>Net Burn</strong> is Gross Burn minus Monthly Cash Revenue.
                  <br />
                  <span className="text-xs text-tertiary font-semibold block mt-space-xs">
                    Key Rule: Runway is typically calculated using Net Burn, but it is wise to test worst-case scenarios using Gross Burn.
                  </span>
                </p>
              </div>

              {/* Diff 4 */}
              <div className="bg-surface-container-lowest p-space-xl rounded-2xl shadow-sm border border-outline-variant/30">
                <div className="flex items-center gap-space-xs mb-space-sm text-on-surface">
                  <span className="material-symbols-outlined text-[22px]">receipt</span>
                  <h3 className="font-headline-md text-headline-md font-bold text-on-surface text-base">Cash vs Accrual Accounting</h3>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  <strong>Cash</strong> accounting records income and expenses only when money actually enters or leaves your bank account.
                  <br />
                  <strong>Accrual</strong> records revenue when earned and expenses when incurred, following standard accounting principles.
                  <br />
                  <span className="text-xs text-on-surface font-semibold block mt-space-xs">
                    Key Rule: Accrual accounting gives you an accurate view of overall health, while cash accounting ensures you don&apos;t run out of money.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SECTION 10: BUSINESS GUIDES & ARTICLES ================= */}
        <section className="w-full py-space-3xl bg-surface-container-low/40 border-y border-outline-variant/20">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-2xl gap-space-md">
              <div>
                <span className="font-label-caps text-label-caps uppercase text-primary tracking-widest font-semibold">
                  GUIDES &amp; ARTICLES
                </span>
                <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface mt-space-2xs">
                  Business Guides &amp; Financial Walkthroughs
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-space-2xs">
                  Practical financial guides written for founders, business owners, and managers.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
              {/* Article 1 */}
              <article className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between border border-outline-variant/30">
                <div className="p-space-lg">
                  <span className="font-label-caps text-label-caps uppercase text-primary font-bold">Pricing Strategy</span>
                  <h3 className="font-headline-md text-headline-md font-bold text-on-surface text-lg mt-space-xs">
                    How to Price for Profitability: Beyond Cost-Plus
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs leading-relaxed">
                    Why many new businesses underprice their products by overlooking shipping overheads, merchant fees, and distributor discounts.
                  </p>
                </div>
                <div className="p-space-lg pt-0">
                  <a className="font-body-sm text-body-sm text-primary font-semibold hover:underline inline-flex items-center gap-1" href="#">
                    Read Guide (8 min) →
                  </a>
                </div>
              </article>

              {/* Article 2 */}
              <article className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between border border-outline-variant/30">
                <div className="p-space-lg">
                  <span className="font-label-caps text-label-caps uppercase text-secondary font-bold">SaaS Benchmarks</span>
                  <h3 className="font-headline-md text-headline-md font-bold text-on-surface text-lg mt-space-xs">
                    Key SaaS Metrics: Benchmarks &amp; Targets
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs leading-relaxed">
                    A comprehensive breakdown of retention rates, sales efficiency, and gross margins that define high-performing companies.
                  </p>
                </div>
                <div className="p-space-lg pt-0">
                  <a className="font-body-sm text-body-sm text-secondary font-semibold hover:underline inline-flex items-center gap-1" href="#">
                    Read Guide (12 min) →
                  </a>
                </div>
              </article>

              {/* Article 3 */}
              <article className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between border border-outline-variant/30">
                <div className="p-space-lg">
                  <span className="font-label-caps text-label-caps uppercase text-tertiary font-bold">Cash Management</span>
                  <h3 className="font-headline-md text-headline-md font-bold text-on-surface text-lg mt-space-xs">
                    The 13-Week Cash Flow Forecast: Practical Template
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs leading-relaxed">
                    The standard cash planning methodology used to manage working capital and prevent unexpected cash shortages during growth periods.
                  </p>
                </div>
                <div className="p-space-lg pt-0">
                  <a className="font-body-sm text-body-sm text-tertiary font-semibold hover:underline inline-flex items-center gap-1" href="#">
                    Read Guide (6 min) →
                  </a>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* ================= SECTION 11: FREQUENTLY ASKED QUESTIONS ================= */}
        <section className="w-full py-space-3xl bg-background">
          <div className="max-w-max-width-calculator mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="text-center mb-space-2xl">
              <span className="font-label-caps text-label-caps uppercase text-primary tracking-widest font-semibold">
                HELP &amp; PRIVACY
              </span>
              <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface mt-space-2xs">
                Frequently Asked Questions
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-space-2xs">
                Learn how our business calculators work, protect your privacy, and ensure accuracy.
              </p>
            </div>

            <div className="space-y-space-md">
              {/* FAQ 1 */}
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/30">
                <h3 className="font-headline-md text-headline-md font-bold text-on-surface text-base flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">help_outline</span>
                  How does SolveIt ensure financial calculation accuracy?
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs leading-relaxed">
                  Every calculator on SolveIt is built using standard GAAP and IFRS financial formulas. Calculations are verified for strict precision so you get dependable results for budgeting, planning, and reporting.
                </p>
              </div>

              {/* FAQ 2 */}
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/30">
                <h3 className="font-headline-md text-headline-md font-bold text-on-surface text-base flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">lock</span>
                  Is my company&apos;s financial data private and secure?
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs leading-relaxed">
                  Yes, 100%. All calculations run entirely in your web browser. None of your financial figures, revenue numbers, cap tables, or pricing details are ever sent to our servers or any third parties.
                </p>
              </div>

              {/* FAQ 3 */}
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/30">
                <h3 className="font-headline-md text-headline-md font-bold text-on-surface text-base flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">file_download</span>
                  Can I export calculations to Excel, CSV, or share with my CPA?
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs leading-relaxed">
                  All calculators feature easy one-click copying, PDF summaries, and CSV downloads without requiring an account or subscription.
                </p>
              </div>

              {/* FAQ 4 */}
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm border border-outline-variant/30">
                <h3 className="font-headline-md text-headline-md font-bold text-on-surface text-base flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">verified</span>
                  Are these formulas compliant with standard business and investor pitch formats?
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs leading-relaxed">
                  Our models (including Cap Table Dilution, SAFE notes, and Break-Even worksheets) adhere to standard venture capital conventions and Small Business Administration (SBA) criteria.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SECTION 12: TRUST & COMPLIANCE BANNER ================= */}
        <section className="w-full py-space-2xl bg-surface-container-low border-t border-outline-variant/20">
          <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop">
            <div className="bg-surface-container-lowest rounded-2xl p-space-xl shadow-sm border border-outline-variant/30 flex flex-col md:flex-row items-center justify-between gap-space-lg">
              <div className="flex items-center gap-space-md">
                <div className="w-14 h-14 rounded-2xl bg-secondary-container text-on-secondary-container flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[32px]">format_image_left</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-headline-md font-bold text-on-surface text-lg">
                    100% Free, Private &amp; Secure Guarantee
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    All calculations run safely right in your browser. We never collect or save your company data.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-space-md flex-shrink-0">
                <div className="flex flex-col text-right">
                  <span className="font-data-mono text-data-mono text-xs font-bold text-primary">GAAP &amp; IFRS Formulas</span>
                  <span className="font-label-caps text-label-caps text-on-surface-variant">100% Private in Browser</span>
                </div>
                <span className="material-symbols-outlined text-primary text-[28px]">lock</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
