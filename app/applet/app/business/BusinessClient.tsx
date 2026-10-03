'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  Search,
  Sliders,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Percent,
  Calculator,
  Briefcase,
  Rocket,
  Receipt,
  ShoppingCart,
  Users,
  Warehouse,
  BarChart3,
  PieChart,
  ShieldCheck,
  RotateCcw,
  ChevronRight,
  Sparkles,
  ArrowRight,
  BookOpen,
  HelpCircle,
  Clock,
  Layers,
  CheckCircle2,
  Building2,
  Cpu,
  Coffee,
  FileSpreadsheet,
  Target,
  Grid,
  ListFilter,
  Zap,
  Info
} from 'lucide-react';

interface ToolItem {
  name: string;
  desc: string;
  action: string;
  href?: string;
  badge?: string;
}

interface CategoryGroup {
  id: string;
  num: string;
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  color: 'emerald' | 'blue' | 'purple' | 'amber' | 'cyan' | 'rose' | 'indigo';
  count: string;
  group: 'Core' | 'Growth' | 'Operations' | 'Specialized';
  tools: ToolItem[];
}

export default function BusinessClient() {
  // --- Search & Filter State ---
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'Core' | 'Growth' | 'Operations' | 'Specialized'>('all');
  const [viewDensity, setViewDensity] = useState<'compact' | 'detailed'>('compact');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // --- Health Telemetry State in Plain English ---
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
    ratio: 4.94,
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
      ratio: randomRatio,
    });
  };

  // --- Workbench 1: Profit Margin & Selling Price ---
  const [wb1Cogs, setWb1Cogs] = useState<number>(45.0);
  const [wb1Margin, setWb1Margin] = useState<number>(40.0);

  const marginResult = useMemo(() => {
    const cogs = Number(wb1Cogs) || 0;
    const margin = Number(wb1Margin) || 0;

    if (margin >= 100) {
      return { price: 'Over 99%', profit: '$0.00', markup: '0.0%', valid: false };
    }

    const price = cogs / (1 - margin / 100);
    const profit = price - cogs;
    const markup = cogs > 0 ? (profit / cogs) * 100 : 0;

    return {
      price: `$${price.toFixed(2)}`,
      profit: `$${profit.toFixed(2)}`,
      markup: `${markup.toFixed(1)}%`,
      valid: true,
    };
  }, [wb1Cogs, wb1Margin]);

  // --- Workbench 2: Software Health (Growth vs Profit) ---
  const [wb2Growth, setWb2Growth] = useState<number>(32);
  const [wb2Fcf, setWb2Fcf] = useState<number>(14);

  const ruleOf40Result = useMemo(() => {
    const growth = Number(wb2Growth) || 0;
    const fcf = Number(wb2Fcf) || 0;
    const score = growth + fcf;
    const isTopDecile = score >= 40;

    return {
      score: `${score.toFixed(0)}%`,
      badge: isTopDecile ? 'Great Health (Score ≥ 40%)' : 'Needs Optimization (< 40%)',
      badgeClass: isTopDecile
        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
      desc: isTopDecile
        ? 'Strong balance of rapid growth and healthy cash profit.'
        : 'Consider improving sales growth or reducing monthly expenses.',
    };
  }, [wb2Growth, wb2Fcf]);

  // --- Workbench 3: Cash Runway: How Long Money Lasts ---
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
        burn: `Profitable (+$${Math.abs(netBurn).toLocaleString()}/mo)`,
        runway: 'Unlimited (Self-Sustaining)',
        isProfitable: true,
      };
    } else {
      const runway = netBurn > 0 ? cash / netBurn : 0;
      return {
        burn: `-$${netBurn.toLocaleString()}/mo`,
        runway: `${runway.toFixed(1)} Months`,
        isProfitable: false,
      };
    }
  }, [wb3Cash, wb3Rev, wb3Exp]);

  // --- Workbench 4: Online Store Profit per Order ---
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
      pct: `${netMargin.toFixed(1)}%`,
      isPositive: netProfit > 0,
    };
  }, [wb4Price, wb4Cogs, wb4Cpa, wb4Fee]);

  // --- Complete 17-Category Directory in Everyday Plain English ---
  const allCategories: CategoryGroup[] = [
    {
      id: 'category-planning',
      num: '01',
      title: 'Business Planning & Market Size',
      desc: 'Calculate how big your market is, test business plans, and forecast best vs worst scenarios.',
      icon: Target,
      color: 'emerald',
      count: '5 Tools',
      group: 'Core',
      tools: [
        { name: '1-Page Business Plan Canvas', desc: 'Map your business idea, pricing, and main customers on a simple 1-page canvas.', action: 'Create Plan', href: '/plan-a-project-calculator' },
        { name: 'Total Market Size (How Many Customers?)', desc: 'Calculate the total number of people and businesses who could buy your product.', action: 'Size Market' },
        { name: 'Business Risk & External Factors', desc: 'Check economic risks, government rules, and technology trends before launching.', action: 'Check Risks' },
        { name: 'Strengths & Weaknesses Scorer', desc: 'Evaluate what your business does best and where competitors have an edge.', action: 'Score Strengths' },
        { name: 'Best-Case vs Worst-Case Scenarios', desc: 'See how your profits look under high sales, normal sales, or slow seasons.', action: 'Run Scenarios' },
      ],
    },
    {
      id: 'category-startup',
      num: '02',
      title: 'Startups, Equity & Funding',
      desc: 'Company ownership splits, investor rounds, how long funding lasts, and startup valuation.',
      icon: Rocket,
      color: 'blue',
      count: '6 Tools',
      group: 'Core',
      tools: [
        { name: 'Cash Runway: How Long Money Lasts', desc: 'Calculate how many months of cash your business has left before needing new sales.', action: 'Check Runway', badge: 'Popular' },
        { name: 'Ownership & Share Dilution Calculator', desc: 'See what percentage of the company founders and investors own after raising money.', action: 'Check Ownership' },
        { name: 'Investor SAFE Note & Valuation Caps', desc: 'Calculate how much stock early angel investors receive when converting seed notes.', action: 'Convert Notes' },
        { name: 'Co-Founder Equity Split Calculator', desc: 'Divide company shares fairly based on cash invested, idea, and full-time hours.', action: 'Split Equity' },
        { name: 'Are You Ready for Venture Capital?', desc: 'Compare your revenue growth and monthly expenses against standard investor targets.', action: 'Check Readiness' },
        { name: 'Early-Stage Startup Valuation', desc: 'Estimate what your startup is worth before you have steady revenue.', action: 'Estimate Value' },
      ],
    },
    {
      id: 'category-profit',
      num: '03',
      title: 'Pricing, Profit Margins & Break-Even',
      desc: 'How much to charge, profit per item sold, and how many sales you need to pay all bills.',
      icon: DollarSign,
      color: 'purple',
      count: '5 Tools',
      group: 'Core',
      tools: [
        { name: 'Profit Margin & Price Markup Calculator', desc: 'Find the exact selling price needed to hit your target profit margin (e.g. 40% margin).', action: 'Calculate Price', badge: 'Essential' },
        { name: 'How Many Sales to Pay Your Bills (Break-Even)', desc: 'Calculate exactly how many items you must sell each month to cover rent and bills.', action: 'Find Break-Even' },
        { name: 'Money Left per Sale to Pay Overhead', desc: 'Find the profit left from each sale after paying product costs to pay rent.', action: 'Calculate Profit' },
        { name: 'Will Raising Prices Hurt Sales?', desc: 'See how a price increase or discount affects your customer count and total profit.', action: 'Test Price' },
        { name: 'Target Profit Price Setter', desc: 'Work backward from how much profit you want to make to find what price to charge.', action: 'Set Price' },
      ],
    },
    {
      id: 'category-accounting',
      num: '04',
      title: 'Cash Flow, Bills & Business Health',
      desc: 'Checking account buffer, days to get paid by clients, and bank loan safety.',
      icon: Briefcase,
      color: 'emerald',
      count: '5 Tools',
      group: 'Core',
      tools: [
        { name: 'Can You Pay This Month\'s Bills? (Cash Safety)', desc: 'Check if you have enough short-term cash and inventory to pay upcoming bills.', action: 'Check Cash Health', href: '/banking' },
        { name: 'Days for Spent Cash to Return as Profit', desc: 'See how many days it takes from buying inventory to getting paid by customers.', action: 'Check Days' },
        { name: 'Emergency Instant Cash Solver', desc: 'Check your emergency cash reserves without counting unsold inventory.', action: 'Test Solvency' },
        { name: '13-Week Cash Flow Planner', desc: 'Plan your weekly money in vs money out to avoid sudden payroll shortages.', action: 'Plan 13 Weeks' },
        { name: 'Can Your Business Afford Loan Payments?', desc: 'Check if monthly profits are high enough to safely qualify for a business loan.', action: 'Check Loan', href: '/loans-and-amortization' },
      ],
    },
    {
      id: 'category-tax',
      num: '05',
      title: 'Sales Tax, GST & Global Taxes',
      desc: 'Sales tax calculation, GST breakdown, VAT in Europe, and quarterly tax savings.',
      icon: Receipt,
      color: 'amber',
      count: '5 Tools',
      group: 'Core',
      tools: [
        { name: 'Sales Tax & GST Added / Removed', desc: 'Add sales tax to an invoice or extract tax from a total price with one tap.', action: 'Calculate Tax', href: '/global-tax-calculator' },
        { name: 'European VAT & Cross-Border Rules', desc: 'Check European VAT rules for selling digital services and products across borders.', action: 'Check VAT' },
        { name: 'US State Sales Tax by Volume', desc: 'Check if you sell enough orders in other US states to owe state sales tax.', action: 'Check States' },
        { name: 'Quarterly Estimated Business Tax', desc: 'Calculate how much money to set aside each quarter for income taxes.', action: 'Estimate Taxes' },
        { name: 'Contractor Tax Withholding (W-8 / TDS)', desc: 'Calculate how much tax to withhold when paying international freelancers.', action: 'Check Withholding' },
      ],
    },
    {
      id: 'category-sales',
      num: '06',
      title: 'Sales Goals, Commissions & Deals',
      desc: 'Sales rep commission checks, deal close rates, and revenue speed.',
      icon: TrendingUp,
      color: 'cyan',
      count: '5 Tools',
      group: 'Growth',
      tools: [
        { name: 'Sales Speed: How Fast Deals Close', desc: 'Calculate your monthly sales speed based on deal size and close rates.', action: 'Check Speed' },
        { name: 'Sales Rep Commission Calculator', desc: 'Calculate tiered commission bonuses, base salary splits, and quota rewards.', action: 'Calculate Commission' },
        { name: 'Leads to Paying Customers Funnel', desc: 'See what percentage of website leads turn into calls, demos, and closed sales.', action: 'Analyze Funnel' },
        { name: 'How Many Sales Reps Do You Need?', desc: 'Calculate how many sales reps to hire to reach your yearly revenue goal.', action: 'Plan Hiring' },
        { name: 'Yearly vs Total Contract Value', desc: 'Compare 1-year contract value against 3-year or multi-year total contract values.', action: 'Compare Value' },
      ],
    },
    {
      id: 'category-marketing',
      num: '07',
      title: 'Ad Spend, Customer Cost & Returns',
      desc: 'Cost to get a new customer, Google/Facebook ad returns, and customer lifetime spending.',
      icon: BarChart3,
      color: 'purple',
      count: '5 Tools',
      group: 'Growth',
      tools: [
        { name: 'True Cost to Get 1 Customer (CAC)', desc: 'Add up ad spend, tools, and marketing salaries to find real customer acquisition cost.', action: 'Calculate Cost', badge: 'Popular' },
        { name: 'Minimum Ad Return to Not Lose Money', desc: 'Find the minimum Return on Ad Spend (ROAS) needed to make a profit on paid ads.', action: 'Find Minimum ROAS' },
        { name: 'Ad Budget Comparison (Google vs Meta)', desc: 'Compare results and returns across Google Ads, Facebook, Instagram, and TikTok.', action: 'Compare Ads' },
        { name: 'How Much a Customer Spends Over Time (LTV)', desc: 'Calculate total lifetime profit from a customer based on repeat purchases.', action: 'Calculate LTV' },
        { name: 'Sponsorship & Influencer Profit Return', desc: 'Check if an influencer shoutout or newsletter sponsor spot will make money.', action: 'Check Return' },
      ],
    },
    {
      id: 'category-ecommerce',
      num: '08',
      title: 'Online Stores, Amazon FBA & Shopify',
      desc: 'Amazon seller fees, Shopify profits, returns losses, and dropshipping margins.',
      icon: ShoppingCart,
      color: 'emerald',
      count: '5 Tools',
      group: 'Growth',
      tools: [
        { name: 'Amazon FBA Fee & Net Profit per Item', desc: 'Calculate Amazon storage fees, referral cut, shipping, and net profit in your pocket.', action: 'Check FBA Profit', badge: 'Popular' },
        { name: 'Shopify Store Profit & Payment Fees', desc: 'Calculate profit left after Shopify credit card fees, app subscriptions, and refunds.', action: 'Check Profit' },
        { name: 'How Much Customer Returns Really Cost', desc: 'Calculate the true financial loss when customers return shipped products.', action: 'Calculate Return Cost' },
        { name: 'Dropshipping Profit Margin Calculator', desc: 'Find net profits after paying suppliers, overseas shipping, and ad spend.', action: 'Check Margins' },
        { name: 'Etsy & eBay Fee & Profit Calculator', desc: 'Calculate listing fees, transaction fees, and final profit on marketplace sales.', action: 'Calculate Fees' },
      ],
    },
    {
      id: 'category-saas',
      num: '09',
      title: 'Subscriptions & Software (SaaS)',
      desc: 'Monthly recurring revenue, customer cancellations, and customer payback months.',
      icon: Sparkles,
      color: 'blue',
      count: '6 Tools',
      group: 'Growth',
      tools: [
        { name: 'Monthly Subscription Revenue (MRR)', desc: 'Track new sign-ups, plan upgrades, downgrades, and cancellations each month.', action: 'Track MRR', badge: 'Core' },
        { name: 'Existing Customer Revenue Growth (NRR)', desc: 'See if existing customers spend more money over time than what cancels.', action: 'Check Growth' },
        { name: 'Months to Recover Ad Cost per Customer', desc: 'Find how many months of subscription payments it takes to pay off acquisition ads.', action: 'Check Payback' },
        { name: 'Cancellation Rate (Churn Rate)', desc: 'Calculate the percentage of subscribers and monthly revenue lost to cancellations.', action: 'Check Churn' },
        { name: 'Growth + Profit Score (Rule of 40)', desc: 'Add revenue growth percentage and profit margin to see if your software business is healthy.', action: 'Score Health' },
        { name: 'Per-User vs Usage-Based Pricing', desc: 'Compare profits between charging per team seat vs charging per usage unit.', action: 'Compare Pricing' },
      ],
    },
    {
      id: 'category-hr',
      num: '10',
      title: 'Hiring, Employee Cost & Payroll',
      desc: 'True cost to hire beyond salary, hourly wages, overtime pay, and turnover cost.',
      icon: Users,
      color: 'indigo',
      count: '4 Tools',
      group: 'Operations',
      tools: [
        { name: 'True Cost to Hire (Salary + Taxes + Benefits)', desc: 'Calculate what an employee really costs you including payroll taxes, health insurance, and 401k.', action: 'Calculate Total Cost', href: '/salary-and-payroll', badge: 'Popular' },
        { name: 'Convert Yearly Salary to Hourly Wage', desc: 'Easily convert annual salaries into hourly, daily, and weekly take-home pay rates.', action: 'Convert Salary', href: '/daily-wage-calculator' },
        { name: 'Shift Work Hours & Overtime 1.5x Pay', desc: 'Calculate weekly timecard hours, regular hours, overtime pay, and total gross wages.', action: 'Calculate Overtime', href: '/work-hours-payroll-calculator' },
        { name: 'Cost of Losing & Replacing an Employee', desc: 'Calculate the real cost of recruiter fees, training time, and lost work when staff quit.', action: 'Check Turnover Cost' },
      ],
    },
    {
      id: 'category-operations',
      num: '11',
      title: 'Productivity & Office Operations',
      desc: 'Meeting salary tickers, factory machine output, and downtime losses.',
      icon: Clock,
      color: 'amber',
      count: '4 Tools',
      group: 'Operations',
      tools: [
        { name: 'Real-Time Meeting Salary Clock', desc: 'Watch a live money ticker showing how much a meeting costs based on attendee salaries.', action: 'Start Meeting Clock', href: '/meeting-cost-calculator', badge: 'Live Ticker' },
        { name: 'Factory Machine Efficiency Score', desc: 'Measure how close machines and equipment run to full speed with zero defective parts.', action: 'Check Efficiency' },
        { name: 'Factory & Team Capacity in Use', desc: 'See what percentage of your team or workshop capacity is currently being utilized.', action: 'Check Capacity' },
        { name: 'Cost of Website & Server Outages', desc: 'Calculate lost sales and wasted worker hours when your software or website goes down.', action: 'Calculate Loss' },
      ],
    },
    {
      id: 'category-inventory',
      num: '12',
      title: 'Inventory, Stock & Reordering',
      desc: 'When to reorder stock, best order sizes, inventory turnover, and out-of-stock losses.',
      icon: Warehouse,
      color: 'cyan',
      count: '4 Tools',
      group: 'Operations',
      tools: [
        { name: 'Best Order Size to Save on Storage & Shipping', desc: 'Find the ideal quantity to order from suppliers to minimize warehousing and shipping fees.', action: 'Find Order Size' },
        { name: 'When to Reorder & Safety Buffer Stock', desc: 'Calculate how many units you need left on shelves before placing a new supplier order.', action: 'Check Reorder Point' },
        { name: 'How Fast Inventory Sells (Turnover Rate)', desc: 'Find how many days stock sits in your warehouse before finding a buyer.', action: 'Check Turnover' },
        { name: 'Lost Sales from Being Out of Stock', desc: 'Estimate the money lost when popular products run out of stock on your store.', action: 'Calculate Lost Sales' },
      ],
    },
    {
      id: 'category-freelance',
      num: '13',
      title: 'Freelancers, Agencies & Hourly Rates',
      desc: 'What hourly rate to charge, quoting fixed projects, and monthly client retainers.',
      icon: Briefcase,
      color: 'purple',
      count: '4 Tools',
      group: 'Specialized',
      tools: [
        { name: 'What Hourly Rate Should You Charge?', desc: 'Calculate your target hourly rate factoring in taxes, vacation weeks, and unpaid admin hours.', action: 'Find Hourly Rate', href: '/freelance-hourly-rate-calculator', badge: 'Popular' },
        { name: 'Fixed-Price Project Quote Calculator', desc: 'Estimate total project quotes based on estimated hours, revisions, and contingency buffer.', action: 'Quote Project' },
        { name: 'Monthly Client Retainer Profitability', desc: 'Check if a monthly client retainer is profitable or if you are doing too many hours.', action: 'Check Retainer' },
        { name: 'Agency Team Billable Hours Check', desc: 'See what percentage of your agency team time is billed to clients vs internal work.', action: 'Check Billable Hours' },
      ],
    },
    {
      id: 'category-ai',
      num: '14',
      title: 'AI & Cloud Computing Costs',
      desc: 'API token pricing, AI profit markups, and human labor hours saved.',
      icon: Cpu,
      color: 'blue',
      count: '4 Tools',
      group: 'Specialized',
      tools: [
        { name: 'AI Prompt Word & Token Cost Calculator', desc: 'Estimate AI API costs across Gemini and GPT models and add your software markup.', action: 'Calculate Token Cost', badge: 'Modern' },
        { name: 'Money Saved by AI Automation', desc: 'Compare hours of human manual labor saved against software tool subscription costs.', action: 'Calculate Savings' },
        { name: 'Cloud Server & AI Hardware Costs', desc: 'Compare pay-as-you-go hourly server costs against monthly reserved cloud plans.', action: 'Compare Cloud' },
        { name: 'AI Search & Document Storage Costs', desc: 'Estimate database storage and memory costs for searching through company documents.', action: 'Estimate Storage' },
      ],
    },
    {
      id: 'category-local',
      num: '15',
      title: 'Restaurants, Retail & Local Shops',
      desc: 'Restaurant food cost percentage, menu pricing, salon chair rent, and gym members.',
      icon: Coffee,
      color: 'rose',
      count: '4 Tools',
      group: 'Specialized',
      tools: [
        { name: 'Restaurant Food & Kitchen Labor %', desc: 'Check if food costs and kitchen wages stay under 60% of total restaurant sales.', action: 'Check Kitchen Cost' },
        { name: 'Menu Item Profitability Matrix', desc: 'Identify your most popular dishes and highest profit items to optimize your menu.', action: 'Optimize Menu' },
        { name: 'Salon Chair & Treatment Room Profit', desc: 'Calculate sales per square foot and how much profit each stylist chair brings in.', action: 'Calculate Salon Yield' },
        { name: 'Gym Member Lifetime Spending & Cancellations', desc: 'Calculate average monthly membership revenue and how long members stay before quitting.', action: 'Check Gym Health' },
      ],
    },
    {
      id: 'category-realestate',
      num: '16',
      title: 'Commercial Real Estate & Rentals',
      desc: 'Cap rate property valuation, rental cash-on-cash returns, and net rental income.',
      icon: Building2,
      color: 'emerald',
      count: '4 Tools',
      group: 'Specialized',
      tools: [
        { name: 'Property Return Rate (Cap Rate)', desc: 'Evaluate commercial property value and yearly return from rental income.', action: 'Calculate Cap Rate', href: '/mortgages-and-real-estate-debt' },
        { name: 'Cash-on-Cash Rental Return', desc: 'Calculate yearly cash in your pocket divided by your initial down payment.', action: 'Check Return' },
        { name: 'Net Rental Income (NOI)', desc: 'Subtract property taxes, insurance, vacancy, and repairs from total rent collected.', action: 'Estimate Income' },
        { name: 'Quick Property Price Multiplier (GRM)', desc: 'Quick rule of thumb comparing building purchase price to annual rent collected.', action: 'Calculate Price' },
      ],
    },
    {
      id: 'category-templates',
      num: '17',
      title: 'Free Invoices & Business Templates',
      desc: 'Instant PDF invoices, purchase orders, and 5-year financial projections.',
      icon: FileSpreadsheet,
      color: 'indigo',
      count: '4 Tools',
      group: 'Specialized',
      tools: [
        { name: 'Instant Client Invoice Generator', desc: 'Create clean, professional PDF invoices with sales tax breakdown and line items.', action: 'Create Invoice', badge: 'Free Tool' },
        { name: 'Purchase Order (PO) Builder', desc: 'Generate official supplier purchase orders with item quantities, terms, and dates.', action: 'Build PO' },
        { name: '5-Year Cash Flow Projection Sheet', desc: 'Easy spreadsheet template to forecast expected sales, expenses, and profits.', action: 'Forecast Sheet' },
        { name: 'Contractor NDA & Agreement Builder', desc: 'Draft simple confidentiality agreements for hiring freelancers and contractors.', action: 'Draft Agreement' },
      ],
    },
  ];

  // Filtered categories
  const filteredCategories = useMemo(() => {
    let result = allCategories;

    // Filter by group tab
    if (activeTab !== 'all') {
      result = result.filter(c => c.group === activeTab);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result
        .map(cat => ({
          ...cat,
          tools: cat.tools.filter(
            t =>
              t.name.toLowerCase().includes(q) ||
              t.desc.toLowerCase().includes(q) ||
              cat.title.toLowerCase().includes(q) ||
              cat.desc.toLowerCase().includes(q)
          ),
        }))
        .filter(cat => cat.tools.length > 0 || cat.title.toLowerCase().includes(q) || cat.desc.toLowerCase().includes(q));
    }

    return result;
  }, [searchQuery, activeTab, allCategories]);

  // Total tool count
  const totalToolsCount = useMemo(() => {
    return allCategories.reduce((acc, cat) => acc + cat.tools.length, 0);
  }, [allCategories]);

  const colorClasses = {
    emerald: {
      bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      badge: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
      hover: 'hover:border-emerald-500/40',
      icon: 'text-emerald-600 dark:text-emerald-400',
    },
    blue: {
      bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      badge: 'bg-blue-500/10 text-blue-700 dark:text-blue-300',
      hover: 'hover:border-blue-500/40',
      icon: 'text-blue-600 dark:text-blue-400',
    },
    purple: {
      bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
      badge: 'bg-purple-500/10 text-purple-700 dark:text-purple-300',
      hover: 'hover:border-purple-500/40',
      icon: 'text-purple-600 dark:text-purple-400',
    },
    amber: {
      bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      badge: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
      hover: 'hover:border-amber-500/40',
      icon: 'text-amber-600 dark:text-amber-400',
    },
    cyan: {
      bg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
      badge: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300',
      hover: 'hover:border-cyan-500/40',
      icon: 'text-cyan-600 dark:text-cyan-400',
    },
    rose: {
      bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
      badge: 'bg-rose-500/10 text-rose-700 dark:text-rose-300',
      hover: 'hover:border-rose-500/40',
      icon: 'text-rose-600 dark:text-rose-400',
    },
    indigo: {
      bg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
      badge: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300',
      hover: 'hover:border-indigo-500/40',
      icon: 'text-indigo-600 dark:text-indigo-400',
    },
  };

  // 8 Structured FAQ Cards in Plain English
  const persistentFaqs = [
    {
      q: 'What types of business calculations can I do here?',
      a: 'You can calculate profit margins, markups, how many sales you need to pay bills (break-even), how long your company money will last (cash runway), employee hiring costs, and online store profits (Shopify & Amazon).',
      icon: Calculator,
      color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10',
      takeaway: '80+ Easy Business Tools across 17 categories',
    },
    {
      q: 'What is the simple difference between Profit Margin and Markup?',
      a: 'Profit Margin is the percentage of the customer selling price that you keep as profit. Markup is the percentage added on top of what you paid to make the product. For example: If an item costs $50 to make and you sell it for $100, your Markup is 100%, but your Profit Margin is 50%.',
      icon: Percent,
      color: 'text-purple-600 dark:text-purple-400 bg-purple-500/10',
      takeaway: 'Key Rule: A 50% Profit Margin requires a 100% Price Markup',
    },
    {
      q: 'How do I calculate how many sales I need to pay my monthly bills (Break-Even)?',
      a: 'Divide your total monthly bills (rent, software, insurance) by the profit made on each individual item sold. The answer is the exact number of items you must sell each month to not lose money.',
      icon: TrendingUp,
      color: 'text-blue-600 dark:text-blue-400 bg-blue-500/10',
      takeaway: 'Formula: Monthly Bills ÷ Profit per Sale = Minimum Sales Needed',
    },
    {
      q: 'What does "Customer Acquisition Cost" (CAC) mean?',
      a: 'It is the average amount of money you spend on ads, marketing, and sales wages to win one new paying customer. For example, if you spend $1,000 on ads and get 10 new customers, your acquisition cost is $100 per customer.',
      icon: Target,
      color: 'text-amber-600 dark:text-amber-400 bg-amber-500/10',
      takeaway: 'Goal: Make sure each customer spends at least 3x more than what they cost to get',
    },
    {
      q: 'How is company "Cash Runway" calculated?',
      a: 'Divide your total cash in the bank by how much money you lose each month (monthly expenses minus monthly sales). If you have $60,000 in the bank and lose $5,000 each month, your cash runway is 12 months.',
      icon: Clock,
      color: 'text-cyan-600 dark:text-cyan-400 bg-cyan-500/10',
      takeaway: 'Safety Target: Keep at least 12 to 18 months of cash buffer',
    },
    {
      q: 'Is my company revenue, payroll, and financial numbers private?',
      a: '100% private. All calculations happen right on your phone or laptop. None of your prices, salaries, revenue numbers, or company details are ever sent to our servers or seen by anyone.',
      icon: ShieldCheck,
      color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10',
      takeaway: 'Guaranteed: Zero tracking, 100% in-browser processing',
    },
    {
      q: 'Are sales tax and GST calculations the same everywhere?',
      a: 'No. Sales tax, GST, and VAT rates change depending on your state, country, and city. Our tools help you quickly calculate taxes, but always check local tax guidelines when filing official tax returns.',
      icon: Receipt,
      color: 'text-rose-600 dark:text-rose-400 bg-rose-500/10',
      takeaway: 'Tip: Always verify formal statutory tax returns with an accountant',
    },
    {
      q: 'Can I copy or paste these calculation results into Excel or Google Sheets?',
      a: 'Yes. Every calculator displays clean numerical figures that you can easily copy and paste into Microsoft Excel, Google Sheets, or pitch decks with one click.',
      icon: CheckCircle2,
      color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10',
      takeaway: 'Convenient: 1-click clipboard copy for spreadsheets',
    },
  ];

  return (
    <div className="min-h-screen bg-background text-on-surface antialiased flex flex-col selection:bg-primary/20 selection:text-primary">
      {/* ================= BREADCRUMB BAR ================= */}
      <section className="w-full bg-surface-container-low/50 py-2 border-b border-outline-variant/30">
        <div className="max-w-max-width-canvas mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-2 text-xs">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-on-surface-variant flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
              <span>Home</span>
            </Link>
            <span className="text-outline-variant/60">/</span>
            <span className="text-on-surface font-semibold">Business Calculators</span>
          </nav>
          <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-on-surface-variant/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{totalToolsCount} Tools • 100% Free &amp; Private</span>
          </div>
        </div>
      </section>

      {/* ================= SECTION 1: HERO & COMPACT SEARCH ================= */}
      <section className="w-full pt-6 pb-8 sm:pt-8 sm:pb-10 bg-gradient-to-b from-surface-container-low/40 via-background to-background relative overflow-hidden border-b border-outline-variant/20">
        <div className="max-w-max-width-canvas mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-3">
            {/* Header Eyebrow Tag */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container border border-outline-variant/40 text-primary text-xs font-semibold tracking-wide shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>Free Everyday Business Calculators</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-extrabold text-on-surface tracking-tight leading-tight">
              Business Calculators &amp; Easy Financial Tools
            </h1>

            {/* Subheading in Plain English */}
            <p className="text-sm sm:text-base text-on-surface-variant max-w-2xl leading-relaxed">
              Simple, accurate calculators for profit margins, pricing products, break-even sales, cash runway, payroll costs, and online store profits.
            </p>

            {/* Compact Search Bar */}
            <div className="w-full max-w-2xl pt-1">
              <div className="relative flex items-center bg-surface-container-lowest rounded-xl shadow-xs border border-outline-variant/50 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <Search className="w-4 h-4 text-on-surface-variant ml-3.5 shrink-0" />
                <input
                  ref={searchInputRef}
                  id="tool-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search tools: profit margin, break even, payroll, cash runway, sales tax, Amazon FBA..."
                  className="w-full py-2.5 px-3 bg-transparent outline-none text-sm text-on-surface placeholder:text-on-surface-variant/50 font-medium"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="p-1 mr-2 text-on-surface-variant hover:text-on-surface rounded transition-colors text-xs"
                    title="Clear search"
                  >
                    Clear
                  </button>
                )}
                <kbd className="hidden sm:inline-flex items-center justify-center mr-3 bg-surface-container px-2 py-0.5 rounded text-[11px] font-mono text-on-surface-variant font-semibold border border-outline-variant/30">
                  /
                </kbd>
              </div>

              {/* Quick Filter Tag Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2.5 text-xs">
                <span className="text-on-surface-variant/70 text-[11px] font-semibold uppercase tracking-wider mr-1">
                  Popular:
                </span>
                {[
                  'Profit Margin',
                  'Break-Even',
                  'Cash Runway',
                  'Employee Cost',
                  'Amazon Profit',
                  'Sales Tax',
                  'Hourly Rate',
                ].map(tag => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSearchQuery(tag);
                      searchInputRef.current?.focus();
                    }}
                    className={`px-2.5 py-0.5 rounded-md text-xs font-medium transition-all ${
                      searchQuery.toLowerCase() === tag.toLowerCase()
                        ? 'bg-primary text-white shadow-xs'
                        : 'bg-surface-container-lowest hover:bg-surface-container border border-outline-variant/40 text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Compact Plain-English Highlights Strip */}
            <div className="w-full pt-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-surface-container-lowest/80 backdrop-blur-xs rounded-xl p-2.5 border border-outline-variant/40 shadow-2xs">
                <div className="flex items-center gap-2.5 p-2 rounded-lg bg-surface-container-low/40">
                  <div className="w-7 h-7 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div className="text-left min-w-0">
                    <span className="block text-xs font-bold text-on-surface truncate">Instant Live</span>
                    <span className="block text-[10px] text-on-surface-variant truncate">Updates as you type</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2 rounded-lg bg-surface-container-low/40">
                  <div className="w-7 h-7 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="text-left min-w-0">
                    <span className="block text-xs font-bold text-on-surface truncate">Exact Math</span>
                    <span className="block text-[10px] text-on-surface-variant truncate">Standard formulas</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2 rounded-lg bg-surface-container-low/40">
                  <div className="w-7 h-7 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="text-left min-w-0">
                    <span className="block text-xs font-bold text-on-surface truncate">100% Private</span>
                    <span className="block text-[10px] text-on-surface-variant truncate">Runs on your device</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2 rounded-lg bg-surface-container-low/40">
                  <div className="w-7 h-7 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div className="text-left min-w-0">
                    <span className="block text-xs font-bold text-on-surface truncate">17 Hubs</span>
                    <span className="block text-[10px] text-on-surface-variant truncate">80+ Free Tools</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 2: COMPACT GOAL FINDER ================= */}
      <section className="w-full py-6 sm:py-8 bg-surface-container-low/30 border-b border-outline-variant/20">
        <div className="max-w-max-width-canvas mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                Quick Navigation
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-on-surface">
                What do you want to calculate today?
              </h2>
            </div>
            <span className="text-xs text-on-surface-variant">
              Click any category to jump directly
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-2.5">
            {[
              {
                title: 'Start a Business',
                desc: 'Business plans & runway',
                count: '6 Tools',
                icon: Rocket,
                color: 'text-blue-500 bg-blue-500/10',
                link: '#category-startup',
              },
              {
                title: 'Set Prices & Margins',
                desc: 'Profit per sale & markups',
                count: '5 Tools',
                icon: DollarSign,
                color: 'text-emerald-500 bg-emerald-500/10',
                link: '#category-profit',
              },
              {
                title: 'Sales & Commissions',
                desc: 'Sales goals & rep bonuses',
                count: '5 Tools',
                icon: TrendingUp,
                color: 'text-purple-500 bg-purple-500/10',
                link: '#category-sales',
              },
              {
                title: 'Online Store & FBA',
                desc: 'Amazon, Shopify & returns',
                count: '5 Tools',
                icon: ShoppingCart,
                color: 'text-amber-500 bg-amber-500/10',
                link: '#category-ecommerce',
              },
              {
                title: 'Hiring & Payroll',
                desc: 'Total employee cost & wages',
                count: '4 Tools',
                icon: Users,
                color: 'text-indigo-500 bg-indigo-500/10',
                link: '#category-hr',
              },
              {
                title: 'Stock & Inventory',
                desc: 'Reorder alerts & order sizes',
                count: '4 Tools',
                icon: Warehouse,
                color: 'text-cyan-500 bg-cyan-500/10',
                link: '#category-inventory',
              },
              {
                title: 'Ad Spend & Marketing',
                desc: 'Cost to get 1 customer & ROAS',
                count: '5 Tools',
                icon: BarChart3,
                color: 'text-purple-500 bg-purple-500/10',
                link: '#category-marketing',
              },
              {
                title: 'Cash Flow & Taxes',
                desc: 'Can you pay bills & sales tax',
                count: '10 Tools',
                icon: Receipt,
                color: 'text-emerald-500 bg-emerald-500/10',
                link: '#category-accounting',
              },
              {
                title: 'Team Productivity',
                desc: 'Meeting salary clock & hours',
                count: '4 Tools',
                icon: Clock,
                color: 'text-amber-500 bg-amber-500/10',
                link: '#category-operations',
              },
              {
                title: 'Software & SaaS',
                desc: 'Monthly subscriptions & churn',
                count: '6 Tools',
                icon: Sparkles,
                color: 'text-blue-500 bg-blue-500/10',
                link: '#category-saas',
              },
            ].map(item => {
              const IconComp = item.icon;
              return (
                <a
                  key={item.title}
                  href={item.link}
                  className="group bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/40 hover:border-primary/50 hover:shadow-xs transition-all flex flex-col justify-between min-h-[96px]"
                >
                  <div className="flex items-start justify-between gap-1.5">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${item.color}`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono text-on-surface-variant font-medium bg-surface-container px-1.5 py-0.5 rounded">
                      {item.count}
                    </span>
                  </div>
                  <div className="mt-2">
                    <h3 className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors flex items-center justify-between">
                      <span className="truncate">{item.title}</span>
                      <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary shrink-0" />
                    </h3>
                    <p className="text-[11px] text-on-surface-variant/80 truncate mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= SECTION 3: 4 LIVE INTERACTIVE WORKBENCHES ================= */}
      <section className="w-full py-6 sm:py-10 bg-surface-container-low/30 border-b border-outline-variant/20">
        <div className="max-w-max-width-canvas mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                Instant Calculators
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-on-surface">
                Featured Live Business Calculators
              </h2>
              <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
                Type in your numbers below to see instant answers calculated directly in your browser.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* WORKBENCH 1: Margin & Selling Price */}
            <div className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 border border-outline-variant/40 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-on-surface">
                        Profit Margin &amp; Selling Price
                      </h3>
                      <span className="text-[11px] text-on-surface-variant">
                        Find how much to charge based on your cost and desired profit
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-semibold bg-surface-container px-2 py-0.5 rounded text-on-surface-variant">
                    Price Calculator
                  </span>
                </div>

                {/* Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                      Product Cost (What you paid)
                    </label>
                    <div className="relative flex items-center bg-surface-container-low rounded-lg border border-outline-variant/40 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20">
                      <span className="pl-3 text-xs font-mono text-on-surface-variant">$</span>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        value={wb1Cogs}
                        onChange={e => setWb1Cogs(Math.max(0, parseFloat(e.target.value) || 0))}
                        className="w-full py-1.5 px-2 bg-transparent outline-none font-mono text-sm text-on-surface font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                      Target Profit Margin (%)
                    </label>
                    <div className="relative flex items-center bg-surface-container-low rounded-lg border border-outline-variant/40 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20">
                      <input
                        type="number"
                        step="1"
                        min="0"
                        max="99"
                        value={wb1Margin}
                        onChange={e => setWb1Margin(parseFloat(e.target.value) || 0)}
                        className="w-full py-1.5 pl-3 pr-2 bg-transparent outline-none font-mono text-sm text-on-surface font-semibold"
                      />
                      <span className="pr-3 text-xs font-mono text-on-surface-variant">%</span>
                    </div>
                  </div>
                </div>

                {/* Preset Chips */}
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="text-[10px] text-on-surface-variant">Popular:</span>
                  {[20, 35, 50, 65].map(preset => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setWb1Margin(preset)}
                      className={`text-[11px] px-2 py-0.5 rounded font-mono transition-colors ${
                        wb1Margin === preset
                          ? 'bg-purple-500 text-white font-bold'
                          : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
                      }`}
                    >
                      {preset}%
                    </button>
                  ))}
                </div>

                {/* Output Area */}
                <div className="grid grid-cols-3 gap-2 mt-4 p-3 bg-surface-container-low/60 rounded-xl border border-outline-variant/30 text-center">
                  <div>
                    <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider block">
                      Selling Price
                    </span>
                    <span className="text-base sm:text-lg font-bold font-mono text-primary block mt-0.5">
                      {marginResult.price}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider block">
                      Profit in Pocket
                    </span>
                    <span className="text-base sm:text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400 block mt-0.5">
                      {marginResult.profit}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider block">
                      Markup on Cost
                    </span>
                    <span className="text-base sm:text-lg font-bold font-mono text-on-surface block mt-0.5">
                      {marginResult.markup}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 text-right">
                <a
                  href="#category-profit"
                  className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                >
                  Explore Pricing &amp; Margin Tools <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* WORKBENCH 2: Software Health */}
            <div className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 border border-outline-variant/40 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-on-surface">
                        Software Health (Growth + Profit Score)
                      </h3>
                      <span className="text-[11px] text-on-surface-variant">
                        Add yearly growth rate (%) to profit margin (%) (Benchmark: ≥ 40%)
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-semibold bg-surface-container px-2 py-0.5 rounded text-on-surface-variant">
                    Rule of 40
                  </span>
                </div>

                {/* Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                      Yearly Sales Growth (%)
                    </label>
                    <div className="relative flex items-center bg-surface-container-low rounded-lg border border-outline-variant/40 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20">
                      <input
                        type="number"
                        step="1"
                        value={wb2Growth}
                        onChange={e => setWb2Growth(parseFloat(e.target.value) || 0)}
                        className="w-full py-1.5 pl-3 pr-2 bg-transparent outline-none font-mono text-sm text-on-surface font-semibold"
                      />
                      <span className="pr-3 text-xs font-mono text-on-surface-variant">%</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                      Cash Profit Margin (%)
                    </label>
                    <div className="relative flex items-center bg-surface-container-low rounded-lg border border-outline-variant/40 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20">
                      <input
                        type="number"
                        step="1"
                        value={wb2Fcf}
                        onChange={e => setWb2Fcf(parseFloat(e.target.value) || 0)}
                        className="w-full py-1.5 pl-3 pr-2 bg-transparent outline-none font-mono text-sm text-on-surface font-semibold"
                      />
                      <span className="pr-3 text-xs font-mono text-on-surface-variant">%</span>
                    </div>
                  </div>
                </div>

                {/* Output Area */}
                <div className="flex items-center justify-between mt-4 p-3 bg-surface-container-low/60 rounded-xl border border-outline-variant/30">
                  <div>
                    <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider block">
                      Combined Score
                    </span>
                    <span className="text-xl sm:text-2xl font-bold font-mono text-on-surface block mt-0.5">
                      {ruleOf40Result.score}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold font-mono inline-block ${ruleOf40Result.badgeClass}`}>
                      {ruleOf40Result.badge}
                    </span>
                    <span className="text-[11px] text-on-surface-variant block mt-1">
                      {ruleOf40Result.desc}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 text-right">
                <a
                  href="#category-saas"
                  className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                >
                  Explore Subscription &amp; Software Suite <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* WORKBENCH 3: Cash Runway */}
            <div className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 border border-outline-variant/40 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-on-surface">
                        Cash Runway (How Long Money Lasts)
                      </h3>
                      <span className="text-[11px] text-on-surface-variant">
                        Calculate how many months of cash buffer remain in the bank
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-semibold bg-surface-container px-2 py-0.5 rounded text-on-surface-variant">
                    Cash Buffer
                  </span>
                </div>

                {/* Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-3.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">
                      Bank Balance ($)
                    </label>
                    <div className="relative flex items-center bg-surface-container-low rounded-lg border border-outline-variant/40">
                      <span className="pl-2.5 text-xs font-mono text-on-surface-variant">$</span>
                      <input
                        type="number"
                        step="5000"
                        value={wb3Cash}
                        onChange={e => setWb3Cash(parseFloat(e.target.value) || 0)}
                        className="w-full py-1.5 px-1.5 bg-transparent outline-none font-mono text-xs text-on-surface font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">
                      Monthly Sales ($)
                    </label>
                    <div className="relative flex items-center bg-surface-container-low rounded-lg border border-outline-variant/40">
                      <span className="pl-2.5 text-xs font-mono text-on-surface-variant">$</span>
                      <input
                        type="number"
                        step="1000"
                        value={wb3Rev}
                        onChange={e => setWb3Rev(parseFloat(e.target.value) || 0)}
                        className="w-full py-1.5 px-1.5 bg-transparent outline-none font-mono text-xs text-on-surface font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">
                      Monthly Expenses ($)
                    </label>
                    <div className="relative flex items-center bg-surface-container-low rounded-lg border border-outline-variant/40">
                      <span className="pl-2.5 text-xs font-mono text-on-surface-variant">$</span>
                      <input
                        type="number"
                        step="1000"
                        value={wb3Exp}
                        onChange={e => setWb3Exp(parseFloat(e.target.value) || 0)}
                        className="w-full py-1.5 px-1.5 bg-transparent outline-none font-mono text-xs text-on-surface font-semibold"
                      />
                    </div>
                  </div>
                </div>

                {/* Output Area */}
                <div className="grid grid-cols-2 gap-2 mt-4 p-3 bg-surface-container-low/60 rounded-xl border border-outline-variant/30 text-center">
                  <div>
                    <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider block">
                      Monthly Cash Loss / Gain
                    </span>
                    <span className={`text-base sm:text-lg font-bold font-mono block mt-0.5 ${runwayResult.isProfitable ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                      {runwayResult.burn}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider block">
                      Estimated Runway Left
                    </span>
                    <span className="text-base sm:text-lg font-bold font-mono text-primary block mt-0.5">
                      {runwayResult.runway}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 text-right">
                <a
                  href="#category-startup"
                  className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                >
                  Explore Startup &amp; Funding Tools <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* WORKBENCH 4: Ecommerce Profit per Order */}
            <div className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 border border-outline-variant/40 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <ShoppingCart className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-on-surface">
                        Online Store Profit per Order
                      </h3>
                      <span className="text-[11px] text-on-surface-variant">
                        Calculate net profit in your pocket after product cost, ads, and store fees
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-semibold bg-surface-container px-2 py-0.5 rounded text-on-surface-variant">
                    Ecom Profit
                  </span>
                </div>

                {/* Inputs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3.5">
                  <div>
                    <label className="block text-[10px] font-semibold text-on-surface-variant mb-1">
                      Selling Price ($)
                    </label>
                    <div className="relative flex items-center bg-surface-container-low rounded-lg border border-outline-variant/40">
                      <input
                        type="number"
                        step="1"
                        value={wb4Price}
                        onChange={e => setWb4Price(parseFloat(e.target.value) || 0)}
                        className="w-full py-1.5 px-2 bg-transparent outline-none font-mono text-xs text-on-surface font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-on-surface-variant mb-1">
                      Product Cost ($)
                    </label>
                    <div className="relative flex items-center bg-surface-container-low rounded-lg border border-outline-variant/40">
                      <input
                        type="number"
                        step="1"
                        value={wb4Cogs}
                        onChange={e => setWb4Cogs(parseFloat(e.target.value) || 0)}
                        className="w-full py-1.5 px-2 bg-transparent outline-none font-mono text-xs text-on-surface font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-on-surface-variant mb-1">
                      Ad Cost per Sale ($)
                    </label>
                    <div className="relative flex items-center bg-surface-container-low rounded-lg border border-outline-variant/40">
                      <input
                        type="number"
                        step="0.5"
                        value={wb4Cpa}
                        onChange={e => setWb4Cpa(parseFloat(e.target.value) || 0)}
                        className="w-full py-1.5 px-2 bg-transparent outline-none font-mono text-xs text-on-surface font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-on-surface-variant mb-1">
                      Store Fee %
                    </label>
                    <div className="relative flex items-center bg-surface-container-low rounded-lg border border-outline-variant/40">
                      <input
                        type="number"
                        step="1"
                        value={wb4Fee}
                        onChange={e => setWb4Fee(parseFloat(e.target.value) || 0)}
                        className="w-full py-1.5 px-2 bg-transparent outline-none font-mono text-xs text-on-surface font-semibold"
                      />
                    </div>
                  </div>
                </div>

                {/* Output Area */}
                <div className="grid grid-cols-2 gap-2 mt-4 p-3 bg-surface-container-low/60 rounded-xl border border-outline-variant/30 text-center">
                  <div>
                    <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider block">
                      Net Profit in Pocket
                    </span>
                    <span className={`text-base sm:text-lg font-bold font-mono block mt-0.5 ${ecomResult.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {ecomResult.net}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider block">
                      Net Profit Margin %
                    </span>
                    <span className="text-base sm:text-lg font-bold font-mono text-on-surface block mt-0.5">
                      {ecomResult.pct}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 text-right">
                <a
                  href="#category-ecommerce"
                  className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                >
                  Explore Online Store &amp; Amazon Tools <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 4: COMPLETE 17-CATEGORY DIRECTORY ================= */}
      <section className="w-full py-8 sm:py-12 bg-background" id="directory">
        <div className="max-w-max-width-canvas mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                Complete Tool Index
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-on-surface">
                All 17 Business Calculator Categories
              </h2>
              <p className="text-xs sm:text-sm text-on-surface-variant max-w-2xl mt-0.5">
                Organized simply by what you need: Pricing, Sales, Hiring, Inventory, and Cash Flow.
              </p>
            </div>

            {/* Filter Tabs & Density Switcher */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center p-1 bg-surface-container-low rounded-lg border border-outline-variant/30 text-xs">
                {(['all', 'Core', 'Growth', 'Operations', 'Specialized'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                      activeTab === tab
                        ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {tab === 'all' ? 'All (17)' : tab}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setViewDensity(viewDensity === 'compact' ? 'detailed' : 'compact')}
                className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-xs text-on-surface-variant border border-outline-variant/30 transition-colors"
                title="Toggle density"
              >
                {viewDensity === 'compact' ? (
                  <>
                    <ListFilter className="w-3.5 h-3.5" />
                    <span>Detailed</span>
                  </>
                ) : (
                  <>
                    <Grid className="w-3.5 h-3.5" />
                    <span>Compact</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Search notification when filtering */}
          {searchQuery && (
            <div className="mb-4 p-2.5 bg-primary/10 rounded-xl border border-primary/20 flex items-center justify-between text-xs text-on-surface">
              <span>
                Showing results matching <strong>&ldquo;{searchQuery}&rdquo;</strong> across {filteredCategories.length} categories
              </span>
              <button
                onClick={() => setSearchQuery('')}
                className="text-primary font-bold hover:underline"
              >
                Reset Search
              </button>
            </div>
          )}

          {/* Directory Grid */}
          <div className="space-y-4 sm:space-y-6">
            {filteredCategories.map(cat => {
              const IconComp = cat.icon;
              const colorStyle = colorClasses[cat.color] || colorClasses.emerald;

              return (
                <div
                  key={cat.id}
                  id={cat.id}
                  className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 border border-outline-variant/40 shadow-xs transition-shadow hover:shadow-sm"
                >
                  {/* Category Header */}
                  <div className="flex items-center justify-between pb-3 mb-3.5 border-b border-outline-variant/20 gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${colorStyle.bg}`}>
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm sm:text-base font-bold text-on-surface truncate">
                            {cat.num}. {cat.title}
                          </h3>
                        </div>
                        <p className="text-xs text-on-surface-variant truncate">
                          {cat.desc}
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-on-surface-variant bg-surface-container px-2 py-0.5 rounded shrink-0">
                      {cat.tools.length} Tools
                    </span>
                  </div>

                  {/* Category Tools Grid */}
                  <div className={`grid gap-2 ${viewDensity === 'compact' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'}`}>
                    {cat.tools.map(tool => (
                      <Link
                        key={tool.name}
                        href={tool.href || '#directory'}
                        className={`group p-2.5 sm:p-3 rounded-xl bg-surface-container-low/40 hover:bg-surface-container-low border border-outline-variant/30 ${colorStyle.hover} transition-all flex flex-col justify-between`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-1.5">
                            <span className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors flex items-center gap-1.5 line-clamp-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary shrink-0 transition-colors" />
                              <span>{tool.name}</span>
                            </span>
                            {tool.badge && (
                              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-primary/10 text-primary shrink-0">
                                {tool.badge}
                              </span>
                            )}
                          </div>
                          {viewDensity === 'detailed' && (
                            <p className="text-[11px] text-on-surface-variant mt-1 line-clamp-2 leading-relaxed">
                              {tool.desc}
                            </p>
                          )}
                        </div>

                        <div className="mt-2 pt-1.5 border-t border-outline-variant/15 flex items-center justify-between text-[11px]">
                          <span className="text-on-surface-variant/70 text-[10px]">
                            {tool.action}
                          </span>
                          <span className="text-primary font-bold text-xs group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                            Open Tool <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= SECTION 5: EASY FINANCIAL COMPARISONS ================= */}
      <section className="w-full py-8 sm:py-10 bg-surface-container-low/30 border-b border-outline-variant/20">
        <div className="max-w-max-width-canvas mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
              Simple Explanations
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-on-surface mt-0.5">
              Everyday Business Rules &amp; Comparisons
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
              Clear, practical explanations for concepts that frequently confuse business owners.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Concept 1 */}
            <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/40 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  Pricing Rule
                </span>
                <h3 className="text-sm font-bold text-on-surface mt-0.5">
                  Profit Margin vs Price Markup
                </h3>
                <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                  <strong>Margin:</strong> Percentage of selling price you keep.<br />
                  <strong>Markup:</strong> Percentage added to product cost.<br />
                  <span className="text-[11px] text-purple-700 dark:text-purple-300 font-semibold block mt-1">
                    Remember: To get a 50% profit margin, you must double your cost (100% markup).
                  </span>
                </p>
              </div>
            </div>

            {/* Concept 2 */}
            <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/40 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Ad Return Rule
                </span>
                <h3 className="text-sm font-bold text-on-surface mt-0.5">
                  Ad Return (ROAS) vs Real Profit
                </h3>
                <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                  <strong>ROAS:</strong> Total sales generated from ads.<br />
                  <strong>Real Profit:</strong> Money left after paying for products.<br />
                  <span className="text-[11px] text-blue-700 dark:text-blue-300 font-semibold block mt-1">
                    Warning: 3x ad return can still lose money if your product costs are high.
                  </span>
                </p>
              </div>
            </div>

            {/* Concept 3 */}
            <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/40 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Cash Safety Rule
                </span>
                <h3 className="text-sm font-bold text-on-surface mt-0.5">
                  Total Expenses vs Cash Loss
                </h3>
                <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                  <strong>Total Expenses:</strong> Total bills going out each month.<br />
                  <strong>Cash Loss:</strong> Expenses minus what sales bring in.<br />
                  <span className="text-[11px] text-amber-700 dark:text-amber-300 font-semibold block mt-1">
                    Tip: Calculate your runway on Cash Loss, but keep an emergency buffer.
                  </span>
                </p>
              </div>
            </div>

            {/* Concept 4 */}
            <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/40 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Accounting Rule
                </span>
                <h3 className="text-sm font-bold text-on-surface mt-0.5">
                  Cash in Bank vs Invoiced Sales
                </h3>
                <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                  <strong>Cash in Bank:</strong> Real money in your checking account.<br />
                  <strong>Invoiced Sales:</strong> Promises from clients to pay later.<br />
                  <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-semibold block mt-1">
                    Crucial: Sending invoices doesn’t pay rent until the money actually lands.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 6: PRACTICAL BUSINESS GUIDES ================= */}
      <section className="w-full py-8 sm:py-10 bg-background border-b border-outline-variant/20">
        <div className="max-w-max-width-canvas mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                Everyday Business Guides
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-on-surface">
                Practical Guides &amp; Core Formulas
              </h2>
              <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
                Simple formulas and rules of thumb to price right and protect your cash.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Guide 1: Pricing Strategy */}
            <article className="bg-surface-container-lowest p-4 sm:p-5 rounded-xl border border-outline-variant/40 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-purple-600 dark:text-purple-400 font-bold mb-2">
                  <span className="uppercase tracking-wider text-[10px]">Pricing Basics</span>
                  <span className="font-mono text-[11px] font-normal">5 min read</span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-on-surface">
                  How to Price Products for Real Profit
                </h3>
                <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                  Avoid underpricing by adding shipping buffers, card processing fees (3%), and returns into your cost.
                </p>

                {/* Mathematical Formula Callout */}
                <div className="mt-3 p-2.5 bg-surface-container-low rounded-lg border border-outline-variant/30 text-xs font-mono">
                  <span className="text-[10px] text-on-surface-variant uppercase tracking-wider block font-sans font-bold">
                    Easy Formula
                  </span>
                  <div className="text-primary font-bold mt-1 text-[11px]">
                    Price = Product Cost ÷ (1 - Desired Margin %)
                  </div>
                  <div className="text-[10px] text-on-surface-variant mt-0.5">
                    Example: $50 Cost ÷ (1 - 0.50) = $100 Selling Price
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-2.5 border-t border-outline-variant/20 flex items-center justify-between">
                <span className="text-[11px] text-on-surface-variant">
                  50% Margin = 100% Markup
                </span>
                <a
                  href="#category-profit"
                  className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                >
                  Open Price Tool <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </article>

            {/* Guide 2: SaaS Metric Bible */}
            <article className="bg-surface-container-lowest p-4 sm:p-5 rounded-xl border border-outline-variant/40 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-blue-600 dark:text-blue-400 font-bold mb-2">
                  <span className="uppercase tracking-wider text-[10px]">Software Metrics</span>
                  <span className="font-mono text-[11px] font-normal">6 min read</span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-on-surface">
                  Software Business Health: Growth vs Profit
                </h3>
                <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                  How software companies measure if rapid growth is sustainable and profitable.
                </p>

                {/* Mathematical Formula Callout */}
                <div className="mt-3 p-2.5 bg-surface-container-low rounded-lg border border-outline-variant/30 text-xs font-mono">
                  <span className="text-[10px] text-on-surface-variant uppercase tracking-wider block font-sans font-bold">
                    Easy Formula
                  </span>
                  <div className="text-blue-600 dark:text-blue-400 font-bold mt-1 text-[11px]">
                    Health Score = Yearly Growth % + Profit Margin %
                  </div>
                  <div className="text-[10px] text-on-surface-variant mt-0.5">
                    Goal: Combined score of 40% or higher
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-2.5 border-t border-outline-variant/20 flex items-center justify-between">
                <span className="text-[11px] text-on-surface-variant">
                  Standard Investor Target
                </span>
                <a
                  href="#category-saas"
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                >
                  Open Software Tool <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </article>

            {/* Guide 3: 13-Week Cash Flow */}
            <article className="bg-surface-container-lowest p-4 sm:p-5 rounded-xl border border-outline-variant/40 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-amber-600 dark:text-amber-400 font-bold mb-2">
                  <span className="uppercase tracking-wider text-[10px]">Cash Management</span>
                  <span className="font-mono text-[11px] font-normal">5 min read</span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-on-surface">
                  The 13-Week Cash Planner (Never Miss Payroll)
                </h3>
                <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                  A simple weekly schedule of incoming client payments and outgoing bills to keep your bank account safe.
                </p>

                {/* Mathematical Formula Callout */}
                <div className="mt-3 p-2.5 bg-surface-container-low rounded-lg border border-outline-variant/30 text-xs font-mono">
                  <span className="text-[10px] text-on-surface-variant uppercase tracking-wider block font-sans font-bold">
                    Easy Formula
                  </span>
                  <div className="text-amber-600 dark:text-amber-400 font-bold mt-1 text-[11px]">
                    Next Week Cash = Start Cash + Incoming Money - Bills
                  </div>
                  <div className="text-[10px] text-on-surface-variant mt-0.5">
                    Runway = Bank Balance ÷ Monthly Cash Loss
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-2.5 border-t border-outline-variant/20 flex items-center justify-between">
                <span className="text-[11px] text-on-surface-variant">
                  Keep &gt; 3 Months of Buffer
                </span>
                <a
                  href="#category-accounting"
                  className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-1"
                >
                  Open Cash Tool <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ================= SECTION 7: 2-COLUMN ALWAYS-VISIBLE FAQ GRID ================= */}
      <section className="w-full py-8 sm:py-12 bg-surface-container-low/30 border-b border-outline-variant/20">
        <div className="max-w-max-width-canvas mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
              Frequently Asked Questions
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-on-surface mt-0.5">
              Business &amp; Pricing Questions &amp; Answers
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
              Straightforward answers about pricing products, break-even sales, and privacy.
            </p>
          </div>

          {/* Responsive Two-Column Grid with Persistent Always-Visible Answers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {persistentFaqs.map((faq, idx) => {
              const IconComp = faq.icon;
              return (
                <div
                  key={idx}
                  className="bg-surface-container-lowest rounded-xl p-4 sm:p-5 border border-outline-variant/40 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${faq.color}`}>
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xs sm:text-sm font-bold text-on-surface leading-snug">
                          {faq.q}
                        </h3>
                        <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                          {faq.a}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3.5 pt-2.5 border-t border-outline-variant/20 flex items-center gap-1.5 text-[11px] text-on-surface-variant/90">
                    <Info className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="font-medium truncate">{faq.takeaway}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= SECTION 8: TRUST & PRIVACY FOOTER ================= */}
      <section className="w-full py-6 bg-surface-container-low border-t border-outline-variant/20">
        <div className="max-w-max-width-canvas mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-surface-container-lowest rounded-xl p-4 sm:p-5 border border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-on-surface">
                  100% Free, Private &amp; In-Browser Calculations
                </h3>
                <p className="text-[11px] text-on-surface-variant mt-0.5">
                  Your business revenue, sales numbers, and employee salaries are never uploaded or saved.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-on-surface-variant shrink-0">
              <span className="px-2 py-1 rounded bg-surface-container border border-outline-variant/30 font-semibold">
                100% Free &amp; Private
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
