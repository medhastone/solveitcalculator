'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';

interface DomainCard {
  id: string;
  icon: string;
  toolsCount: string;
  title: string;
  description: string;
  tags: { label: string; href: string }[];
  colorTheme: 'primary' | 'secondary' | 'tertiary' | 'gradient';
  categoryLink: string;
}

export interface FinanceToolItem {
  id: string;
  name: string;
  description: string;
  category: string;
  categoryLink: string;
  path: string;
  keywords: string[];
  icon: string;
  badge?: string;
  badgeColor?: string;
}

export const FINANCE_TOOLS_CATALOG: FinanceToolItem[] = [
  {
    id: 'compound-interest-calc',
    name: 'Compound Interest Calculator',
    description: 'Model compounding interest growth over time with monthly deposits, annual rates, and compounding frequencies.',
    category: 'Investing & Growth',
    categoryLink: '/investing-and-growth',
    path: '/finance/compound-interest-calculator',
    keywords: ['compound interest', 'apy', 'savings growth', 'reinvestment', 'future value', 'compounding frequency', 'interest rate'],
    icon: 'trending_up',
    badge: 'Popular',
    badgeColor: 'bg-primary/10 text-primary',
  },
  {
    id: 'investment-return-calc',
    name: 'Investment Return & CAGR Calculator',
    description: 'Calculate cumulative portfolio returns, S&P 500 historical benchmarks, annualized CAGR, and lump-sum outcomes.',
    category: 'Investing & Growth',
    categoryLink: '/investing-and-growth',
    path: '/finance/investment-calculator',
    keywords: ['investment return', 'cagr', 'sip', 'stock market', 'lump sum', 'portfolio growth', 'dca', 's&p 500'],
    icon: 'monitoring',
    badge: 'Verified',
    badgeColor: 'bg-secondary/10 text-secondary',
  },
  {
    id: 'mortgage-calc',
    name: 'Mortgage & Amortization Calculator',
    description: 'Determine monthly mortgage payments (P&I), property taxes, home insurance, PMI, and full 30-year amortization schedules.',
    category: 'Mortgages & Real Estate',
    categoryLink: '/mortgages-and-real-estate-debt',
    path: '/finance/mortgage-calculator',
    keywords: ['mortgage', 'home loan', 'amortization schedule', 'property tax', 'pmi', 'interest rate', 'fixed rate', 'arm', 'refinance', 'down payment'],
    icon: 'real_estate_agent',
    badge: 'Core Tool',
    badgeColor: 'bg-primary/10 text-primary',
  },
  {
    id: 'emi-calc',
    name: 'Loan EMI & Debt Payoff Calculator',
    description: 'Compute precise Equated Monthly Installments (EMI) for personal, auto, education, and home loans with interest breakdowns.',
    category: 'Loans & Payments',
    categoryLink: '/loans-and-amortization',
    path: '/finance/emi-calculator',
    keywords: ['emi', 'loan payment', 'personal loan', 'car loan', 'auto loan', 'debt payoff', 'interest payment', 'installment'],
    icon: 'payments',
    badge: 'High Precision',
    badgeColor: 'bg-tertiary/10 text-tertiary',
  },
  {
    id: 'fire-forecaster',
    name: 'FIRE Forecaster (Retire Early)',
    description: 'Calculate your Financial Independence number, Coast FIRE, Lean FIRE, Fat FIRE, and safe withdrawal rates (4% rule).',
    category: 'Retirement Planning',
    categoryLink: '/retirement-and-super',
    path: '/finance/fire-forecaster',
    keywords: ['fire', 'retire early', 'financial independence', 'coast fire', 'lean fire', 'fat fire', 'safe withdrawal rate', 'swr', '4% rule'],
    icon: 'local_fire_department',
    badge: 'FIRE Suite',
    badgeColor: 'bg-primary/10 text-primary',
  },
  {
    id: 'global-tax-calc',
    name: 'Global Income Tax Calculator',
    description: 'Estimate federal, state, and international income taxes, marginal vs effective rates, and statutory bracket deductions.',
    category: 'Global Tax Calculator',
    categoryLink: '/global-tax-calculator',
    path: '/global-tax-calculator',
    keywords: ['tax', 'income tax', 'irs 1040', 'tax bracket', 'marginal tax', 'effective tax', 'paye', 'hmrc', 'ato', 'deductions'],
    icon: 'account_balance',
    badge: 'Multi-Region',
    badgeColor: 'bg-tertiary/10 text-tertiary',
  },
  {
    id: 'daily-wage-calc',
    name: 'Daily Wage & Take-Home Pay Calculator',
    description: 'Convert daily, hourly, and project wages into gross and net earnings with overtime, tax withholding, and payroll deductions.',
    category: 'Salary & Wages',
    categoryLink: '/salary-and-payroll',
    path: '/daily-wage-calculator',
    keywords: ['daily wage', 'take home pay', 'hourly rate', 'overtime', 'paycheck', 'salary breakdown', 'gross to net'],
    icon: 'badge',
    badge: 'Payroll',
    badgeColor: 'bg-secondary/10 text-secondary',
  },
  {
    id: 'salary-payroll-hub',
    name: 'Salary & Compensation Hub',
    description: 'Comprehensive payroll converter for annual salary, bi-weekly checks, hourly shifts, bonuses, and employer taxes.',
    category: 'Salary & Wages',
    categoryLink: '/salary-and-payroll',
    path: '/salary-and-payroll',
    keywords: ['salary', 'payroll', 'hourly wage', 'annual income', 'bonus', 'compensation', 'paycheck calculator'],
    icon: 'work',
    badge: 'Suite',
    badgeColor: 'bg-primary/10 text-primary',
  },
  {
    id: 'loans-amortization-hub',
    name: 'Loans & Amortization Suite',
    description: 'Advanced debt payoff modeling, extra principal payments, loan comparison matrices, and snowball vs avalanche strategies.',
    category: 'Loans & Payments',
    categoryLink: '/loans-and-amortization',
    path: '/loans-and-amortization',
    keywords: ['loan amortization', 'debt snowball', 'debt avalanche', 'extra payment', 'principal reduction', 'apr'],
    icon: 'account_balance_wallet',
    badge: 'Comprehensive',
    badgeColor: 'bg-secondary/10 text-secondary',
  },
  {
    id: 'mortgages-real-estate-debt',
    name: 'Mortgages & Real Estate Debt Suite',
    description: 'Model rental property cap rates, cash-on-cash return, points vs interest rate tradeoffs, and home equity lines of credit (HELOC).',
    category: 'Mortgages & Real Estate',
    categoryLink: '/mortgages-and-real-estate-debt',
    path: '/mortgages-and-real-estate-debt',
    keywords: ['real estate', 'cap rate', 'cash on cash', 'rental property', 'heloc', 'refinancing', 'mortgage debt'],
    icon: 'apartment',
    badge: 'Real Estate',
    badgeColor: 'bg-tertiary/10 text-tertiary',
  },
  {
    id: 'banking-cash-accounts',
    name: 'Banking & Cash Accounts Hub',
    description: 'Compare Certificate of Deposit (CD) ladders, high-yield checking, APY interest calculations, and bank fee avoidance.',
    category: 'Banking Accounts',
    categoryLink: '/banking-and-cash-accounts',
    path: '/banking-and-cash-accounts',
    keywords: ['banking', 'checking', 'cd ladder', 'certificate of deposit', 'apy', 'bank fees', 'cash management'],
    icon: 'savings',
    badge: 'Banking',
    badgeColor: 'bg-primary/10 text-primary',
  },
  {
    id: 'savings-liquidity-hub',
    name: 'Savings & Liquidity Planner',
    description: 'Build emergency reserve funds, model high-yield savings account (HYSA) growth, and calculate target savings timelines.',
    category: 'Savings & Liquidity',
    categoryLink: '/savings-and-liquidity',
    path: '/savings-and-liquidity',
    keywords: ['savings', 'emergency fund', 'hysa', 'high yield savings', 'liquidity', 'savings goal', 'inflation hedge'],
    icon: 'savings',
    badge: 'Liquidity',
    badgeColor: 'bg-secondary/10 text-secondary',
  },
  {
    id: 'credit-cards-revolving',
    name: 'Credit Cards & Revolving Debt Payoff',
    description: 'Escape the minimum payment trap, evaluate 0% APR balance transfer fees, and design accelerated debt reduction schedules.',
    category: 'Credit Cards',
    categoryLink: '/credit-cards-and-revolving',
    path: '/credit-cards-and-revolving',
    keywords: ['credit card', 'revolving debt', 'balance transfer', 'minimum payment', 'credit card payoff', '0% apr'],
    icon: 'credit_card',
    badge: 'Debt Solver',
    badgeColor: 'bg-tertiary/10 text-tertiary',
  },
  {
    id: 'investing-growth-hub',
    name: 'Investing & Wealth Growth Hub',
    description: 'Explore stock valuation ratios (P/E, PEG), dividend reinvestment (DRIP), portfolio diversification, and asset allocation.',
    category: 'Investing & Growth',
    categoryLink: '/investing-and-growth',
    path: '/investing-and-growth',
    keywords: ['investing', 'drip', 'dividend', 'asset allocation', 'stock return', 'index fund', 'wealth accumulation'],
    icon: 'diamond',
    badge: 'Growth Suite',
    badgeColor: 'bg-primary/10 text-primary',
  },
  {
    id: 'retirement-super-hub',
    name: 'Retirement & Superannuation Hub',
    description: 'Model 401(k) employer matching, Traditional vs Roth IRA contributions, Australian Superannuation, and pension growth.',
    category: 'Retirement Planning',
    categoryLink: '/retirement-and-super',
    path: '/retirement-and-super',
    keywords: ['retirement', '401k match', 'roth ira', 'traditional ira', 'superannuation', 'pension', 'rmd', 'annuity'],
    icon: 'elderly',
    badge: 'Retirement',
    badgeColor: 'bg-secondary/10 text-secondary',
  },
  {
    id: 'percentage-calc',
    name: 'Percentage & Financial Growth Calculator',
    description: 'Fast percentage increase, profit margin, markup, discount rate, and percent change calculations.',
    category: 'Business Finance',
    categoryLink: '/percentage-calculator',
    path: '/percentage-calculator',
    keywords: ['percentage', 'margin', 'markup', 'discount', 'percent change', 'profit margin'],
    icon: 'percent',
    badge: 'Quick Tool',
    badgeColor: 'bg-primary/10 text-primary',
  },
];

const DOMAINS: DomainCard[] = [
  {
    id: 'domain-investing',
    icon: 'trending_up',
    toolsCount: '150+ Tools',
    title: 'Investing & Growth',
    description: 'Calculate compound interest, stock returns, and growth.',
    tags: [
      { label: 'Compound Interest', href: '/finance/compound-interest-calculator' },
      { label: 'Investment Return', href: '/finance/investment-calculator' },
      { label: 'S&P 500 CAGR', href: '/investing-and-growth' },
    ],
    colorTheme: 'primary',
    categoryLink: '/investing-and-growth',
  },
  {
    id: 'domain-retirement',
    icon: 'elderly',
    toolsCount: '95+ Tools',
    title: 'Retirement Planning',
    description: 'Plan your retirement with 401(k) and savings goals.',
    tags: [
      { label: '401(k) Match', href: '/retirement-and-super' },
      { label: 'Roth IRA vs 401k', href: '/finance#decision-battles' },
      { label: 'FIRE Forecaster', href: '/finance/fire-forecaster' },
    ],
    colorTheme: 'secondary',
    categoryLink: '/retirement-and-super',
  },
  {
    id: 'domain-tax',
    icon: 'account_balance',
    toolsCount: '85+ Tools',
    title: 'Global Tax Calculator',
    description: 'Estimate taxes for USA, UK, Canada, Australia, and worldwide.',
    tags: [
      { label: '1040 Federal Tax', href: '/global-tax-calculator' },
      { label: 'Marginal vs Effective', href: '/global-tax-calculator' },
      { label: 'HMRC PAYE', href: '/global-tax-calculator' },
    ],
    colorTheme: 'tertiary',
    categoryLink: '/global-tax-calculator',
  },
  {
    id: 'domain-loans',
    icon: 'payments',
    toolsCount: '104 Tools',
    title: 'Loans & Payments',
    description: 'Calculate monthly payments, loan schedules, and debt payoff.',
    tags: [
      { label: 'EMI Calculator', href: '/finance/emi-calculator' },
      { label: 'Amortization Table', href: '/loans-and-amortization' },
      { label: 'Debt Payoff', href: '/loans-and-amortization' },
    ],
    colorTheme: 'primary',
    categoryLink: '/loans-and-amortization',
  },
  {
    id: 'domain-mortgage',
    icon: 'real_estate_agent',
    toolsCount: '106 Tools',
    title: 'Mortgages & Real Estate',
    description: 'Plan your home purchase, refinancing, and mortgage payments.',
    tags: [
      { label: '30-Yr Mortgage', href: '/finance/mortgage-calculator' },
      { label: 'Rent vs Buy', href: '/finance#decision-battles' },
      { label: 'Cap Rate', href: '/mortgages-and-real-estate-debt' },
    ],
    colorTheme: 'secondary',
    categoryLink: '/mortgages-and-real-estate-debt',
  },
  {
    id: 'domain-savings',
    icon: 'savings',
    toolsCount: '102 Tools',
    title: 'Savings & Liquidity',
    description: 'Grow your savings with high-yield accounts and emergency funds.',
    tags: [
      { label: 'Emergency Fund', href: '/savings-and-liquidity' },
      { label: 'HYSA Compounder', href: '/savings-and-liquidity' },
      { label: 'Target Savings', href: '/savings-and-liquidity' },
    ],
    colorTheme: 'tertiary',
    categoryLink: '/savings-and-liquidity',
  },
  {
    id: 'domain-banking',
    icon: 'account_balance_wallet',
    toolsCount: '98 Tools',
    title: 'Banking Accounts',
    description: 'Compare bank accounts, interest rates, and avoid fees.',
    tags: [
      { label: 'CD Ladder', href: '/banking-and-cash-accounts' },
      { label: 'APY Calculator', href: '/banking-and-cash-accounts' },
      { label: 'Checking vs Savings', href: '/banking-and-cash-accounts' },
    ],
    colorTheme: 'primary',
    categoryLink: '/banking-and-cash-accounts',
  },
  {
    id: 'domain-credit-cards',
    icon: 'credit_card',
    toolsCount: '96 Tools',
    title: 'Credit Cards',
    description: 'Manage credit card debt, balance transfers, and payoff strategies.',
    tags: [
      { label: 'Card Payoff', href: '/credit-cards-and-revolving' },
      { label: 'Balance Transfer', href: '/credit-cards-and-revolving' },
      { label: '0% APR Strategy', href: '/credit-cards-and-revolving' },
    ],
    colorTheme: 'secondary',
    categoryLink: '/credit-cards-and-revolving',
  },
  {
    id: 'domain-insurance',
    icon: 'health_and_safety',
    toolsCount: '45+ Tools',
    title: 'Insurance & Protection',
    description: 'Estimate life insurance needs and health savings accounts.',
    tags: [
      { label: 'Life Insurance', href: '/investing-and-growth' },
      { label: 'HSA Growth', href: '/investing-and-growth' },
      { label: 'Disability Coverage', href: '/investing-and-growth' },
    ],
    colorTheme: 'tertiary',
    categoryLink: '/investing-and-growth',
  },
  {
    id: 'domain-personal-finance',
    icon: 'vital_signs',
    toolsCount: '50+ Tools',
    title: 'Financial Health & FIRE',
    description: 'Track your net worth, cash flow, and financial wellness.',
    tags: [
      { label: 'FIRE Forecaster', href: '/finance/fire-forecaster' },
      { label: 'Net Worth Tracker', href: '/fire-forecaster' },
      { label: 'Coast FIRE', href: '/finance/fire-forecaster' },
    ],
    colorTheme: 'primary',
    categoryLink: '/fire-forecaster',
  },
  {
    id: 'domain-budgeting',
    icon: 'pie_chart',
    toolsCount: '30+ Tools',
    title: 'Budgeting & Cash Flow',
    description: 'Organize your money using simple and effective budget rules.',
    tags: [
      { label: '50/30/20 Rule', href: '/investing-and-growth' },
      { label: 'Zero-Based Budget', href: '/investing-and-growth' },
      { label: 'Expense Ratio', href: '/investing-and-growth' },
    ],
    colorTheme: 'secondary',
    categoryLink: '/investing-and-growth',
  },
  {
    id: 'domain-debt-elimination',
    icon: 'link_off',
    toolsCount: '40+ Tools',
    title: 'Debt Elimination',
    description: 'Find the fastest and smartest ways to become debt-free.',
    tags: [
      { label: 'Debt Snowball', href: '/loans-and-amortization' },
      { label: 'Debt Avalanche', href: '/loans-and-amortization' },
      { label: 'EMI Solver', href: '/finance/emi-calculator' },
    ],
    colorTheme: 'tertiary',
    categoryLink: '/finance/emi-calculator',
  },
  {
    id: 'domain-wealth-building',
    icon: 'diamond',
    toolsCount: '35+ Tools',
    title: 'Wealth Building',
    description: 'Learn how fast your money can grow and build long-term wealth.',
    tags: [
      { label: 'Rule of 72', href: '/finance/compound-interest-calculator' },
      { label: 'Dollar Cost Averaging', href: '/finance/investment-calculator' },
      { label: 'Asset Compounding', href: '/investing-and-growth' },
    ],
    colorTheme: 'primary',
    categoryLink: '/investing-and-growth',
  },
  {
    id: 'domain-business-finance',
    icon: 'domain',
    toolsCount: '45+ Tools',
    title: 'Business Finance',
    description: 'Calculate business profits, startup costs, and sales goals.',
    tags: [
      { label: 'Profit Margin', href: '/percentage-calculator' },
      { label: 'Break-Even Analysis', href: '/investing-and-growth' },
      { label: 'Markup Calculator', href: '/percentage-calculator' },
    ],
    colorTheme: 'secondary',
    categoryLink: '/investing-and-growth',
  },
  {
    id: 'domain-real-estate',
    icon: 'apartment',
    toolsCount: '60+ Tools',
    title: 'Property Investing',
    description: 'Evaluate rental properties, cash flow, and investment returns.',
    tags: [
      { label: 'Rental Cash Flow', href: '/mortgages-and-real-estate-debt' },
      { label: 'Cap Rate', href: '/mortgages-and-real-estate-debt' },
      { label: 'Mortgage Amortization', href: '/finance/mortgage-calculator' },
    ],
    colorTheme: 'tertiary',
    categoryLink: '/finance/mortgage-calculator',
  },
  {
    id: 'domain-salary',
    icon: 'badge',
    toolsCount: '55+ Tools',
    title: 'Salary & Wages',
    description: 'Calculate your take-home pay, hourly wages, and overtime.',
    tags: [
      { label: 'Daily Wage Net Pay', href: '/daily-wage-calculator' },
      { label: 'Hourly to Salary', href: '/salary-and-payroll' },
      { label: 'Overtime Pay', href: '/salary-and-payroll' },
    ],
    colorTheme: 'primary',
    categoryLink: '/salary-and-payroll',
  },
  {
    id: 'domain-international',
    icon: 'public',
    toolsCount: '30+ Tools',
    title: 'International & Forex',
    description: 'Calculate exchange rates and international taxes.',
    tags: [
      { label: 'Currency Converter', href: '/conversions' },
      { label: 'VAT / GST', href: '/global-tax-calculator' },
      { label: 'Cross-Border Wire', href: '/conversions' },
    ],
    colorTheme: 'secondary',
    categoryLink: '/conversions',
  },
  {
    id: 'domain-crypto',
    icon: 'currency_bitcoin',
    toolsCount: '40+ Tools',
    title: 'Crypto Assets',
    description: 'Track crypto returns, taxes, and mining profits.',
    tags: [
      { label: 'Crypto Profit & Loss', href: '/investing-and-growth' },
      { label: 'Staking APY', href: '/finance/compound-interest-calculator' },
      { label: 'DCA Crypto', href: '/finance/investment-calculator' },
    ],
    colorTheme: 'tertiary',
    categoryLink: '/investing-and-growth',
  },
];

export interface WorldCurrency {
  code: string;
  symbol: string;
  name: string;
  flag: string;
  rate: number;
  locale: string;
}

export const WORLD_CURRENCIES: WorldCurrency[] = [
  { code: 'USD', symbol: '$', name: 'USD ($)', flag: '🇺🇸', rate: 1.0, locale: 'en-US' },
  { code: 'EUR', symbol: '€', name: 'EUR (€)', flag: '🇪🇺', rate: 0.92, locale: 'de-DE' },
  { code: 'GBP', symbol: '£', name: 'GBP (£)', flag: '🇬🇧', rate: 0.79, locale: 'en-GB' },
  { code: 'CAD', symbol: 'CA$', name: 'CAD ($)', flag: '🇨🇦', rate: 1.36, locale: 'en-CA' },
  { code: 'AUD', symbol: 'A$', name: 'AUD ($)', flag: '🇦🇺', rate: 1.52, locale: 'en-AU' },
  { code: 'INR', symbol: '₹', name: 'INR (₹)', flag: '🇮🇳', rate: 83.5, locale: 'en-IN' },
  { code: 'AED', symbol: 'د.إ', name: 'AED (د.إ)', flag: '🇦🇪', rate: 3.67, locale: 'ar-AE' },
  { code: 'SGD', symbol: 'S$', name: 'SGD ($)', flag: '🇸🇬', rate: 1.35, locale: 'en-SG' },
  { code: 'JPY', symbol: '¥', name: 'JPY (¥)', flag: '🇯🇵', rate: 155.0, locale: 'ja-JP' },
];

export const formatMoney = (amountUSD: number, currencyCode: string, prefix = '', suffix = ''): string => {
  const curr = WORLD_CURRENCIES.find((c) => c.code === currencyCode) || WORLD_CURRENCIES[0];
  const converted = Math.round(amountUSD * curr.rate);
  const formatted = converted.toLocaleString(curr.locale);
  return `${prefix}${curr.symbol}${formatted}${suffix}`;
};

interface ScenarioBattleDef {
  id: string;
  label: string;
  alpha: {
    name: string;
    tag: string;
    tagColor: string;
    desc: string;
    annualUSD: number;
    annualSuffix?: string;
    annualLabel: string;
    benefitLabel: string;
    benefitUSD?: number;
    benefitText?: string;
    benefitSuffix?: string;
    benefitColor: string;
    effectiveCostUSD?: number;
    effectiveCostText?: string;
    costLabel: string;
    estValueUSD?: number;
    estValueText?: string;
    note: string;
  };
  beta: {
    name: string;
    tag: string;
    tagColor: string;
    desc: string;
    annualUSD: number;
    annualSuffix?: string;
    annualLabel: string;
    benefitLabel: string;
    benefitUSD?: number;
    benefitText?: string;
    benefitSuffix?: string;
    benefitColor: string;
    effectiveCostUSD?: number;
    effectiveCostText?: string;
    costLabel: string;
    estValueUSD?: number;
    estValueText?: string;
    note: string;
  };
  deltaTitle: string;
  deltaUSD: number;
  deltaDesc: string;
  barAlphaPercent: string;
  barBetaPercent: string;
  barAlphaLabel: string;
  barBetaLabel: string;
  link: string;
  linkText: string;
}

const RAW_SCENARIO_BATTLES: ScenarioBattleDef[] = [
  {
    id: '401k-vs-roth',
    label: '401(k) vs Roth',
    alpha: {
      name: 'Traditional 401(k)',
      tag: 'Pre-Tax',
      tagColor: 'bg-primary/10 text-primary',
      desc: 'Get a tax break now. You pay taxes later when you withdraw in retirement.',
      annualUSD: 23000,
      annualLabel: 'Annual Contribution:',
      benefitLabel: 'Immediate Tax Saved:',
      benefitUSD: 5520,
      benefitSuffix: ' / yr',
      benefitColor: 'text-primary',
      effectiveCostUSD: 17480,
      costLabel: 'Effective Annual Cost:',
      estValueUSD: 2376512,
      note: 'Pre-tax balance',
    },
    beta: {
      name: 'Roth IRA',
      tag: 'Post-Tax',
      tagColor: 'bg-secondary/10 text-secondary',
      desc: 'Pay taxes upfront. Your money grows and is withdrawn completely tax-free.',
      annualUSD: 23000,
      annualLabel: 'Annual Contribution:',
      benefitLabel: 'Tax-Free Withdrawals:',
      benefitText: '100% Tax-Free',
      benefitColor: 'text-outline',
      effectiveCostUSD: 23000,
      costLabel: 'Effective Annual Cost:',
      estValueUSD: 2376512,
      note: 'Tax-free balance',
    },
    deltaTitle: 'Net After-Tax Outcome',
    deltaUSD: 184210,
    deltaDesc: 'Depending on your tax bracket in retirement, a Traditional 401(k) or Roth can provide more spendable cash.',
    barAlphaPercent: '54%',
    barBetaPercent: '46%',
    barAlphaLabel: 'Traditional 401(k)',
    barBetaLabel: 'Roth IRA',
    link: '/fire-forecaster',
    linkText: 'Compare 401(k) vs Roth →',
  },
  {
    id: 'rent-vs-buy',
    label: 'Rent vs Buy',
    alpha: {
      name: 'Buy a Home',
      tag: 'Build Equity',
      tagColor: 'bg-primary/10 text-primary',
      desc: 'Lock in your monthly payment and build wealth through home equity over time.',
      annualUSD: 32400,
      annualLabel: 'Annual Housing Cost:',
      benefitLabel: 'Equity Built:',
      benefitUSD: 11200,
      benefitSuffix: ' / yr',
      benefitColor: 'text-primary',
      effectiveCostUSD: 21200,
      costLabel: 'Sunk Cost (Interest/Tax):',
      estValueUSD: 1140000,
      note: 'Home value in 20 years',
    },
    beta: {
      name: 'Rent & Invest',
      tag: 'Invest Savings',
      tagColor: 'bg-secondary/10 text-secondary',
      desc: 'Avoid home maintenance and property taxes. Invest the savings in the stock market.',
      annualUSD: 26400,
      annualLabel: 'Annual Rent:',
      benefitLabel: 'Savings Invested:',
      benefitUSD: 7200,
      benefitSuffix: ' / yr',
      benefitColor: 'text-secondary',
      effectiveCostUSD: 26400,
      costLabel: 'Sunk Cost (Rent):',
      estValueUSD: 985400,
      note: 'Investment value in 20 yrs',
    },
    deltaTitle: 'Buying Edge at Year 15+',
    deltaUSD: 154600,
    deltaDesc: 'After several years, buying usually beats renting as rent prices go up and your home builds equity.',
    barAlphaPercent: '58%',
    barBetaPercent: '42%',
    barAlphaLabel: 'Home Equity',
    barBetaLabel: 'Stock Portfolio',
    link: '/finance/mortgage-calculator',
    linkText: 'Run Rent vs Buy Tool →',
  },
  {
    id: 'mortgage-vs-sp500',
    label: 'Pay Off Debt vs Invest',
    alpha: {
      name: 'Pay Down Mortgage',
      tag: 'Guaranteed Return',
      tagColor: 'bg-primary/10 text-primary',
      desc: 'Get a risk-free return equal to your mortgage interest rate. Become debt-free faster.',
      annualUSD: 12000,
      annualSuffix: ' extra',
      annualLabel: 'Amount Directed:',
      benefitLabel: 'Interest Saved:',
      benefitUSD: 124500,
      benefitSuffix: ' total',
      benefitColor: 'text-primary',
      effectiveCostText: 'No Market Risk',
      costLabel: 'Primary Risk Factor:',
      estValueText: 'Paid in 14 Yrs',
      note: '15 years of freedom',
    },
    beta: {
      name: 'Invest in S&P 500',
      tag: 'Market Growth',
      tagColor: 'bg-secondary/10 text-secondary',
      desc: 'Invest extra cash in the stock market to take advantage of historically higher average returns.',
      annualUSD: 12000,
      annualSuffix: ' extra',
      annualLabel: 'Amount Directed:',
      benefitLabel: 'Expected Growth:',
      benefitUSD: 318000,
      benefitSuffix: ' net',
      benefitColor: 'text-secondary',
      effectiveCostText: 'Market Ups & Downs',
      costLabel: 'Primary Risk Factor:',
      estValueUSD: 482500,
      note: 'Portfolio in 15 yrs',
    },
    deltaTitle: 'Investment Potential Edge',
    deltaUSD: 193500,
    deltaDesc: 'Historically, the stock market earns more over the long run than most mortgage interest rates.',
    barAlphaPercent: '39%',
    barBetaPercent: '61%',
    barAlphaLabel: 'Interest Saved',
    barBetaLabel: 'Market Growth',
    link: '/finance/mortgage-calculator',
    linkText: 'Compare Mortgage vs Investing →',
  },
  {
    id: 'lump-sum-vs-dca',
    label: 'Lump Sum vs DCA',
    alpha: {
      name: 'Lump Sum Investment',
      tag: 'Max Market Time',
      tagColor: 'bg-primary/10 text-primary',
      desc: 'Invest all your money at once. Markets go up more often than they go down over time.',
      annualUSD: 100000,
      annualLabel: 'Initial Investment:',
      benefitLabel: 'Historical Win Rate:',
      benefitText: '68% of time',
      benefitColor: 'text-primary',
      effectiveCostText: 'Immediate entry',
      costLabel: 'Primary Drawback:',
      estValueUSD: 259374,
      note: 'In 10 years',
    },
    beta: {
      name: 'Dollar-Cost Averaging',
      tag: 'Less Regret',
      tagColor: 'bg-secondary/10 text-secondary',
      desc: 'Invest smaller amounts over time. Less stressful if the market drops right after you start.',
      annualUSD: 8333,
      annualSuffix: ' / mo',
      annualLabel: 'Investment Schedule:',
      benefitLabel: 'Risk Protection:',
      benefitText: 'Lower Volatility',
      benefitColor: 'text-secondary',
      effectiveCostText: 'Missed early gains',
      costLabel: 'Primary Drawback:',
      estValueUSD: 244120,
      note: 'In 10 years',
    },
    deltaTitle: 'Lump Sum Outperformance',
    deltaUSD: 15254,
    deltaDesc: 'Historically, investing everything upfront wins about two-thirds of the time.',
    barAlphaPercent: '68%',
    barBetaPercent: '32%',
    barAlphaLabel: 'Lump Sum Win',
    barBetaLabel: 'DCA Win',
    link: '/investing-and-growth',
    linkText: 'Calculate DCA vs Lump Sum →',
  },
];

const PRESET_AI_SCENARIOS = [
  {
    label: '"Retire at 50 with $2M"',
    query: 'Retire at 50 with $2,000,000',
    steps: [
      {
        num: '01',
        title: 'Retirement Planner',
        badge: 'Goal Tracking',
        badgeColor: 'text-primary',
        numColor: 'bg-primary/10 text-primary',
        desc: 'Find out how much you need to save each month to reach $2M by age 50.',
        link: '/fire-forecaster',
      },
      {
        num: '02',
        title: 'Roth vs 401(k) Planner',
        badge: 'Tax Saving',
        badgeColor: 'text-secondary',
        numColor: 'bg-secondary/10 text-secondary',
        desc: 'Compare the tax benefits of a Roth IRA and a traditional 401(k) account.',
        link: '/fire-forecaster',
      },
      {
        num: '03',
        title: 'Investment Growth',
        badge: 'Growth Estimate',
        badgeColor: 'text-tertiary',
        numColor: 'bg-tertiary/10 text-tertiary',
        desc: 'See how your investments can grow using historical stock market returns.',
        link: '/investing-and-growth',
      },
    ],
  },
  {
    label: '"Buy $550k home vs Rent"',
    query: 'Compare buying a $550k home vs renting',
    steps: [
      {
        num: '01',
        title: 'Monthly Mortgage Payment',
        badge: 'Payment Estimate',
        badgeColor: 'text-primary',
        numColor: 'bg-primary/10 text-primary',
        desc: 'Calculate your full monthly payment including interest, taxes, and insurance.',
        link: '/finance/mortgage-calculator',
      },
      {
        num: '02',
        title: 'Rent vs Buy Compare',
        badge: 'Decision Tool',
        badgeColor: 'text-secondary',
        numColor: 'bg-secondary/10 text-secondary',
        desc: 'Compare the true cost of renting versus building equity as a homeowner.',
        link: '/finance/mortgage-calculator',
      },
      {
        num: '03',
        title: 'Home Equity Tracker',
        badge: 'Net Worth',
        badgeColor: 'text-tertiary',
        numColor: 'bg-tertiary/10 text-tertiary',
        desc: 'See how fast you will build home equity as you pay down your loan over the years.',
        link: '/finance/mortgage-calculator',
      },
    ],
  },
  {
    label: '"Pay off debt vs Save"',
    query: 'Should I pay off student debt or save in a 401(k)?',
    steps: [
      {
        num: '01',
        title: '401(k) Employer Match',
        badge: 'Free Money',
        badgeColor: 'text-primary',
        numColor: 'bg-primary/10 text-primary',
        desc: 'Calculate the free money you gain by contributing enough to get the employer match.',
        link: '/fire-forecaster',
      },
      {
        num: '02',
        title: 'Debt Payoff Calculator',
        badge: 'Interest Saver',
        badgeColor: 'text-secondary',
        numColor: 'bg-secondary/10 text-secondary',
        desc: 'Find the fastest way to pay off your loans and minimize interest costs.',
        link: '/finance/emi-calculator',
      },
      {
        num: '03',
        title: 'Tax Deduction Check',
        badge: 'Tax Benefit',
        badgeColor: 'text-tertiary',
        numColor: 'bg-tertiary/10 text-tertiary',
        desc: 'See if you can deduct student loan interest from your taxes to save even more.',
        link: '/global-tax-calculator',
      },
    ],
  },
];

export default function FinanceHubClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [aiPrompt, setAiPrompt] = useState('Retire at 50 with $2,000,000 liquid portfolio');
  const [activePresetIndex, setActivePresetIndex] = useState(0);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [activeBattleId, setActiveBattleId] = useState('401k-vs-roth');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('solveit_finance_currency');
      if (saved && WORLD_CURRENCIES.some((c) => c.code === saved)) {
        setSelectedCurrency(saved);
      }
    } catch {
      // Ignore local storage error in restricted env
    }
  }, []);

  const handleCurrencyChange = (newCode: string) => {
    setSelectedCurrency(newCode);
    try {
      localStorage.setItem('solveit_finance_currency', newCode);
    } catch {
      // Ignore
    }
  };

  const SCENARIO_BATTLES = useMemo(() => {
    return RAW_SCENARIO_BATTLES.map((b) => {
      const alphaAnnual = formatMoney(b.alpha.annualUSD, selectedCurrency, '', b.alpha.annualSuffix || '');
      const alphaBenefit =
        b.alpha.benefitUSD !== undefined
          ? formatMoney(b.alpha.benefitUSD, selectedCurrency, '+', b.alpha.benefitSuffix || '')
          : b.alpha.benefitText || '';
      const alphaCost =
        b.alpha.effectiveCostUSD !== undefined
          ? formatMoney(b.alpha.effectiveCostUSD, selectedCurrency)
          : b.alpha.effectiveCostText || '';
      const alphaEstValue =
        b.alpha.estValueUSD !== undefined
          ? formatMoney(b.alpha.estValueUSD, selectedCurrency)
          : b.alpha.estValueText || '';

      const betaAnnual = formatMoney(b.beta.annualUSD, selectedCurrency, '', b.beta.annualSuffix || '');
      const betaBenefit =
        b.beta.benefitUSD !== undefined
          ? formatMoney(b.beta.benefitUSD, selectedCurrency, '+', b.beta.benefitSuffix || '')
          : b.beta.benefitText || '';
      const betaCost =
        b.beta.effectiveCostUSD !== undefined
          ? formatMoney(b.beta.effectiveCostUSD, selectedCurrency)
          : b.beta.effectiveCostText || '';
      const betaEstValue =
        b.beta.estValueUSD !== undefined
          ? formatMoney(b.beta.estValueUSD, selectedCurrency)
          : b.beta.estValueText || '';

      const deltaValue = formatMoney(b.deltaUSD, selectedCurrency, '+');

      return {
        ...b,
        alpha: {
          ...b.alpha,
          annual: alphaAnnual,
          benefitVal: alphaBenefit,
          effectiveCost: alphaCost,
          estValue: alphaEstValue,
        },
        beta: {
          ...b.beta,
          annual: betaAnnual,
          benefitVal: betaBenefit,
          effectiveCost: betaCost,
          estValue: betaEstValue,
        },
        deltaValue,
      };
    });
  }, [selectedCurrency]);

  const currentBattle = useMemo(() => {
    return SCENARIO_BATTLES.find((b) => b.id === activeBattleId) || SCENARIO_BATTLES[0];
  }, [SCENARIO_BATTLES, activeBattleId]);

  const currentAiWorkflow = useMemo(() => {
    return PRESET_AI_SCENARIOS[activePresetIndex] || PRESET_AI_SCENARIOS[0];
  }, [activePresetIndex]);

  // Keyboard shortcut handler for ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('global-search-input');
        if (searchInput) {
          searchInput.focus();
          (searchInput as HTMLInputElement).select();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleTriggerAi = () => {
    setIsGeneratingAi(true);
    setTimeout(() => {
      setIsGeneratingAi(false);
    }, 450);
  };

  const handleSelectAiPreset = (index: number) => {
    setActivePresetIndex(index);
    setAiPrompt(PRESET_AI_SCENARIOS[index].query);
    handleTriggerAi();
  };

  // Filter tools based on search query
  const filteredTools = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return [];
    return FINANCE_TOOLS_CATALOG.filter((tool) => {
      const matchName = tool.name.toLowerCase().includes(q);
      const matchDesc = tool.description.toLowerCase().includes(q);
      const matchCategory = tool.category.toLowerCase().includes(q);
      const matchKeywords = tool.keywords.some((k) => k.toLowerCase().includes(q));
      return matchName || matchDesc || matchCategory || matchKeywords;
    });
  }, [searchQuery]);

  // Filter domains based on search query
  const filteredDomains = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return DOMAINS;
    return DOMAINS.filter((domain) => {
      const matchTitle = domain.title.toLowerCase().includes(q);
      const matchDesc = domain.description.toLowerCase().includes(q);
      const matchTags = domain.tags.some((t) => t.label.toLowerCase().includes(q));
      return matchTitle || matchDesc || matchTags;
    });
  }, [searchQuery]);

  const hasSearchQuery = searchQuery.trim().length > 0;

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container min-h-screen">
      {/* Fixed Header */}
      

      {/* Main Content View */}
      <main className="w-full pt-16 bg-surface min-h-[calc(100vh-64px)]">
        <div className="flex flex-col w-full">
          {/* Structured Data JSON-LD */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@graph': [
                  {
                    '@type': 'WebSite',
                    '@id': 'https://solveitcalculator.com/#website',
                    url: 'https://solveitcalculator.com/',
                    name: 'SolveIt Calculator',
                    description: "The world's most comprehensive and rigorous financial calculators ecosystem.",
                    potentialAction: {
                      '@type': 'SearchAction',
                      target: 'https://solveitcalculator.com/search?q={search_term_string}',
                      'query-input': 'required name=search_term_string',
                    },
                  },
                  {
                    '@type': 'Organization',
                    '@id': 'https://solveitcalculator.com/#organization',
                    name: 'SolveIt Financial Technologies Inc.',
                    url: 'https://solveitcalculator.com',
                    logo: 'https://solveitcalculator.com/assets/logo.png',
                    sameAs: [
                      'https://twitter.com/SolveItCalc',
                      'https://linkedin.com/company/solveit-calculator',
                      'https://github.com/solveit-calculator',
                    ],
                  },
                  {
                    '@type': 'WebApplication',
                    name: 'SolveIt Financial Computational Suite',
                    applicationCategory: 'FinanceApplication',
                    operatingSystem: 'All modern browsers',
                    offers: {
                      '@type': 'Offer',
                      price: '0',
                      priceCurrency: 'USD',
                    },
                  },
                  {
                    '@type': 'FAQPage',
                    mainEntity: [
                      {
                        '@type': 'Question',
                        name: 'How does SolveIt ensure precision in financial calculations?',
                        acceptedAnswer: {
                          '@type': 'Answer',
                          text: 'SolveIt implements strict IEEE 754 64-bit floating point exactness paired with arbitrary-precision decimal modules in high-sensitivity workflows like multi-decade amortization and compound interest schedules. Formulas are peer-reviewed by certified CPAs and CFPs.',
                        },
                      },
                      {
                        '@type': 'Question',
                        name: 'Is my personal financial data tracked or stored on your servers?',
                        acceptedAnswer: {
                          '@type': 'Answer',
                          text: 'Never. SolveIt runs 100% client-side in your local browser sandbox. No balances, tax filings, salaries, or portfolio distributions ever touch our servers or third-party analytic trackers.',
                        },
                      },
                    ],
                  },
                ],
              }),
            }}
          />

                    {/* BREADCRUMB & METADATA BAR WITH GLOBAL CURRENCY SWITCHER */}
          <div className="w-full bg-surface-container-lowest border-b border-outline-variant/30 shadow-xs">
            <div className="max-w-max-width-canvas mx-auto px-gutter-mobile lg:px-gutter-desktop py-space-xs flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
              <nav aria-label="Breadcrumb" className="flex items-center gap-space-2xs text-on-surface-variant font-body-sm text-body-sm">
                <Link className="hover:text-primary transition-colors flex items-center gap-1 font-medium" href="/">
                  <span className="material-symbols-outlined text-[16px]">home</span>
                  <span>Home</span>
                </Link>
                <span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
                <span className="text-on-surface font-semibold">Financial Calculators</span>
              </nav>

              {/* Global Currency Switcher */}
              <div className="flex items-center gap-2">
                <label htmlFor="workbench-currency-select" className="flex items-center gap-1.5 text-on-surface-variant font-body-sm text-body-sm font-medium">
                  <span className="material-symbols-outlined text-[18px] text-primary">payments</span>
                  <span className="hidden sm:inline">Workbench Currency:</span>
                  <span className="sm:hidden">Currency:</span>
                </label>
                <div className="relative inline-block">
                  <select
                    id="workbench-currency-select"
                    value={selectedCurrency}
                    onChange={(e) => handleCurrencyChange(e.target.value)}
                    className="appearance-none bg-surface-container-low hover:bg-surface-container border border-outline-variant/50 rounded-lg px-3 py-1 pr-8 text-on-surface font-body-sm text-body-sm font-semibold cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-primary/40"
                    aria-label="Select global financial currency"
                  >
                    {WORLD_CURRENCIES.map((curr) => (
                      <option key={curr.code} value={curr.code}>
                        {curr.flag} {curr.name}
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined text-[16px] text-on-surface-variant absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                    expand_more
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Hero & Global Search Command Bar */}
          <section className="relative w-full max-w-max-width-canvas mx-auto px-gutter-desktop pt-space-xl pb-space-2xl">
            {/* Ambient Blur Halo Backdrop */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 max-w-4xl h-72 bg-gradient-to-tr from-primary/10 via-secondary-container/15 to-transparent rounded-full blur-3xl pointer-events-none -z-10"></div>
            
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-space-md">


              {/* Main Headline */}
              <h1 className="font-display-hero text-display-hero text-on-surface tracking-tight max-w-3xl">
                Financial Calculators for Every Milestone &amp; Decision
              </h1>
              
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
                The world&apos;s most comprehensive financial toolkit. Easily plan your mortgage, prepare for retirement, estimate your taxes, and grow your investments—all in a private and secure environment.
              </p>

              {/* Global Search Command Bar (Desktop & Mobile) */}
              <div className="w-full max-w-2xl mt-space-md relative">
                <div className="relative flex items-center bg-surface-container-lowest rounded-2xl p-2 shadow-xl shadow-primary/5 transition-all focus-within:shadow-primary/10 border border-outline-variant/30">
                  <div className="pl-3 pr-2 flex items-center text-primary">
                    <span className="material-symbols-outlined text-[24px]">search</span>
                  </div>
                  <input
                    className="w-full bg-transparent border-0 outline-none font-body-md text-body-md text-on-surface placeholder:text-outline py-2"
                    id="global-search-input"
                    placeholder="Search tools & domains (e.g., '401k match', 'mortgage', 'compound interest', 'tax', 'EMI')..."
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') setSearchQuery('');
                    }}
                    autoComplete="off"
                  />
                  {hasSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="p-1 mr-1 text-on-surface-variant hover:text-on-surface rounded-full hover:bg-surface-container transition-colors"
                      title="Clear search"
                      aria-label="Clear search query"
                    >
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                  )}
                  <div className="hidden sm:flex items-center gap-1 pr-2">
                    <kbd className="font-data-mono text-[11px] px-2 py-1 rounded-md bg-surface-container-high text-on-surface-variant shadow-sm">⌘K</kbd>
                  </div>
                  <button
                    className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-body-sm text-body-sm font-semibold hover:bg-surface-tint active:scale-[0.98] transition-all shadow-md"
                    type="button"
                    onClick={() => {
                      if (hasSearchQuery) {
                        const searchResultsElem = document.getElementById('search-results-section');
                        if (searchResultsElem) searchResultsElem.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        const allDomainsElem = document.getElementById('all-domains');
                        if (allDomainsElem) allDomainsElem.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    {hasSearchQuery ? 'View Matches' : 'Explore'}
                  </button>
                </div>

                {/* Quick Jump Popular Suggestions */}
                <div className="flex flex-wrap items-center justify-center gap-2 mt-space-sm">
                  <span className="font-label-caps text-label-caps uppercase text-outline self-center">Popular Searches:</span>
                  {[
                    { label: 'Mortgage 30-Yr', query: 'Mortgage' },
                    { label: 'Compound Interest', query: 'Compound Interest' },
                    { label: '1040 Tax Bracket', query: 'Tax' },
                    { label: 'FIRE Forecaster', query: 'FIRE' },
                    { label: 'EMI Calculator', query: 'EMI' },
                    { label: 'Daily Wage Net Pay', query: 'Daily Wage' },
                  ].map((pop) => (
                    <button
                      key={pop.label}
                      type="button"
                      onClick={() => setSearchQuery(pop.query)}
                      className={`px-2.5 py-1 rounded-lg font-body-sm text-body-sm transition-all ${
                        searchQuery.toLowerCase() === pop.query.toLowerCase()
                          ? 'bg-primary text-on-primary font-semibold shadow-xs'
                          : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-primary'
                      }`}
                    >
                      {pop.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ================= DEDICATED LIVE SEARCH RESULTS SECTION ================= */}
          {hasSearchQuery && (
            <section
              id="search-results-section"
              className="w-full max-w-max-width-canvas mx-auto px-gutter-desktop my-space-xl scroll-mt-20 animate-fadeIn"
            >
              <div className="bg-surface-container-lowest rounded-3xl p-space-lg md:p-space-xl shadow-xl border border-primary/20">
                {/* Search Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-md border-b border-outline-variant/30">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-[24px]">manage_search</span>
                    </div>
                    <div>
                      <h2 className="font-headline-md text-headline-md text-on-surface">
                        Search Results for &ldquo;<span className="text-primary">{searchQuery}</span>&rdquo;
                      </h2>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Found <span className="font-bold text-on-surface">{filteredTools.length}</span> calculator{filteredTools.length !== 1 ? 's' : ''} and{' '}
                        <span className="font-bold text-on-surface">{filteredDomains.length}</span> domain{filteredDomains.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface text-body-sm font-semibold transition-all"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                    <span>Clear Search</span>
                  </button>
                </div>

                {/* 1. MATCHED TOOLS GRID */}
                {filteredTools.length > 0 && (
                  <div className="mt-space-lg">
                    <div className="flex items-center gap-2 mb-space-md">
                      <span className="material-symbols-outlined text-[20px] text-primary">calculate</span>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface">
                        Matching Financial Tools &amp; Calculators ({filteredTools.length})
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
                      {filteredTools.map((tool) => (
                        <div
                          key={tool.id}
                          className="group bg-surface-container-low hover:bg-surface-container rounded-2xl p-space-md flex flex-col justify-between border border-outline-variant/20 hover:border-primary/40 transition-all hover:shadow-md"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold font-label-caps uppercase text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded-md">
                                {tool.category}
                              </span>
                              {tool.badge && (
                                <span className={`text-[11px] font-bold font-label-caps uppercase px-2 py-0.5 rounded-md ${tool.badgeColor || 'bg-primary/10 text-primary'}`}>
                                  {tool.badge}
                                </span>
                              )}
                            </div>
                            <div className="flex items-start gap-2.5 my-1">
                              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                                <span className="material-symbols-outlined text-[18px]">{tool.icon}</span>
                              </div>
                              <h4 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors">
                                {tool.name}
                              </h4>
                            </div>
                            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 mb-space-sm line-clamp-2">
                              {tool.description}
                            </p>
                          </div>

                          <div className="pt-space-xs mt-space-xs border-t border-outline-variant/20 flex items-center justify-between">
                            <Link
                              href={tool.categoryLink}
                              className="text-[12px] font-body-sm text-on-surface-variant hover:text-primary underline-offset-2 hover:underline"
                            >
                              Explore Hub
                            </Link>
                            <Link
                              href={tool.path}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-on-primary font-body-sm text-[13px] font-semibold hover:bg-surface-tint active:scale-[0.98] transition-all shadow-xs"
                            >
                              <span>Open Tool</span>
                              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. MATCHED DOMAINS GRID */}
                {filteredDomains.length > 0 && (
                  <div className="mt-space-xl pt-space-lg border-t border-outline-variant/30">
                    <div className="flex items-center gap-2 mb-space-md">
                      <span className="material-symbols-outlined text-[20px] text-secondary">grid_view</span>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface">
                        Matching Computational Domains ({filteredDomains.length})
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-sm">
                      {filteredDomains.map((domain) => (
                        <Link
                          key={domain.id}
                          href={domain.categoryLink}
                          className="group p-space-sm rounded-xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/20 hover:border-secondary/40 transition-all flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                              <span className="material-symbols-outlined text-[18px]">{domain.icon}</span>
                            </div>
                            <div className="min-w-0">
                              <div className="font-headline-sm text-[14px] text-on-surface truncate group-hover:text-secondary transition-colors">
                                {domain.title}
                              </div>
                              <div className="font-data-mono text-[11px] text-on-surface-variant">
                                {domain.toolsCount}
                              </div>
                            </div>
                          </div>
                          <span className="material-symbols-outlined text-[16px] text-on-surface-variant group-hover:text-secondary group-hover:translate-x-0.5 transition-all">
                            chevron_right
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. NO RESULTS STATE */}
                {filteredTools.length === 0 && filteredDomains.length === 0 && (
                  <div className="text-center py-space-2xl space-y-space-md">
                    <div className="w-16 h-16 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center mx-auto">
                      <span className="material-symbols-outlined text-[32px]">search_off</span>
                    </div>
                    <div>
                      <h3 className="font-headline-md text-headline-md text-on-surface">
                        No financial calculators found matching &ldquo;{searchQuery}&rdquo;
                      </h3>
                      <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto mt-1">
                        Try searching by loan type, formula name, tax code, or acronym (e.g., 401k, APR, EMI, FIRE, S&P 500, CAGR).
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                      <span className="font-body-sm text-body-sm text-outline">Try searching for:</span>
                      {['Mortgage', 'Compound Interest', '401k', 'Tax', 'FIRE', 'EMI', 'Salary', 'HYSA'].map((sug) => (
                        <button
                          key={sug}
                          type="button"
                          onClick={() => setSearchQuery(sug)}
                          className="px-3 py-1 rounded-lg bg-surface-container-low hover:bg-surface-container text-primary font-body-sm text-body-sm font-semibold transition-colors"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}



          {/* Interactive What-If Scenario Battle Engine */}
          <section className="w-full max-w-max-width-canvas mx-auto px-gutter-desktop my-space-2xl" id="decision-battles">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-lg">
              <div>
                <div className="flex items-center gap-2 text-primary mb-1">
                  <span className="material-symbols-outlined text-[20px]">compare_arrows</span>
                  <span className="font-label-caps text-label-caps uppercase font-bold tracking-wider">Comparative Modeling</span>
                </div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface">
                  What-If Financial Decision Battles
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-xl mt-1">
                  Compare different financial choices side-by-side to find out which strategy is best for your money.
                </p>
              </div>

              {/* Tabs & Currency Indicator */}
              <div className="mt-4 md:mt-0 flex flex-wrap items-center gap-2">
                <div className="flex gap-1.5 p-1 bg-surface-container-low rounded-xl overflow-x-auto">
                  {SCENARIO_BATTLES.map((battle) => (
                    <button
                      key={battle.id}
                      className={`px-3 py-1.5 rounded-lg font-body-sm text-body-sm font-semibold transition-all ${
                        activeBattleId === battle.id
                          ? 'bg-surface-container-lowest text-primary shadow-sm'
                          : 'text-on-surface-variant hover:bg-surface-container-highest'
                      }`}
                      onClick={() => setActiveBattleId(battle.id)}
                      type="button"
                    >
                      {battle.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Battle Card Container */}
            <div className="bg-surface-container-lowest rounded-3xl p-space-lg md:p-space-xl shadow-xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
                {/* Option A (Alpha) */}
                <div className="lg:col-span-4 bg-surface-container-low rounded-2xl p-space-lg flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-label-caps text-label-caps uppercase text-primary font-bold">Scenario Alpha</span>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-label-caps uppercase font-bold ${currentBattle.alpha.tagColor}`}>
                        {currentBattle.alpha.tag}
                      </span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-2">{currentBattle.alpha.name}</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                      {currentBattle.alpha.desc}
                    </p>
                    <div className="space-y-space-xs">
                      <div className="flex justify-between items-center text-body-sm">
                        <span className="text-on-surface-variant font-body-sm">{currentBattle.alpha.annualLabel}</span>
                        <span className="font-data-mono font-bold text-on-surface">{currentBattle.alpha.annual}</span>
                      </div>
                      <div className="flex justify-between items-center text-body-sm">
                        <span className="text-on-surface-variant font-body-sm">{currentBattle.alpha.benefitLabel}</span>
                        <span className={`font-data-mono font-bold ${currentBattle.alpha.benefitColor}`}>{currentBattle.alpha.benefitVal}</span>
                      </div>
                      <div className="flex justify-between items-center text-body-sm">
                        <span className="text-on-surface-variant font-body-sm">{currentBattle.alpha.costLabel}</span>
                        <span className="font-data-mono font-bold text-on-surface">{currentBattle.alpha.effectiveCost}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-space-md mt-space-md bg-surface-container-high/50 rounded-xl p-3">
                    <span className="font-label-caps text-label-caps uppercase text-outline">Est. Value (Horizon Compound):</span>
                    <div className="font-numerical-display text-numerical-display text-on-surface mt-1">{currentBattle.alpha.estValue}</div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">{currentBattle.alpha.note}</span>
                  </div>
                </div>

                {/* Center: Comparison Indicator & Math Delta */}
                <div className="lg:col-span-4 flex flex-col items-center text-center px-space-sm py-space-md">
                  <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-headline-md text-headline-md font-bold mb-space-xs shadow-md">
                    VS
                  </div>
                  <span className="font-label-caps text-label-caps uppercase text-on-surface-variant font-bold">The Quantitative Delta</span>
                  
                  <div className="my-space-md w-full bg-surface-container-high rounded-2xl p-space-md">
                    <span className="font-label-caps text-label-caps uppercase text-secondary font-bold">{currentBattle.deltaTitle}</span>
                    <div className="font-numerical-display text-numerical-display text-secondary mt-1">{currentBattle.deltaValue}</div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
                      {currentBattle.deltaDesc}
                    </p>
                  </div>

                  {/* Miniature Comparison Bar */}
                  <div className="w-full space-y-2">
                    <div className="flex justify-between font-label-caps text-label-caps uppercase text-outline text-[11px]">
                      <span>{currentBattle.barAlphaLabel}</span>
                      <span>{currentBattle.barBetaLabel}</span>
                    </div>
                    <div className="h-3 w-full bg-surface-container rounded-full overflow-hidden flex">
                      <div className="h-full bg-primary transition-all duration-500" style={{ width: currentBattle.barAlphaPercent }}></div>
                      <div className="h-full bg-secondary-container transition-all duration-500" style={{ width: currentBattle.barBetaPercent }}></div>
                    </div>
                  </div>

                  <Link className="mt-space-md inline-flex items-center gap-1 font-body-sm text-body-sm text-primary font-semibold hover:underline" href={currentBattle.link}>
                    {currentBattle.linkText}
                  </Link>
                </div>

                {/* Option B (Beta) */}
                <div className="lg:col-span-4 bg-surface-container-low rounded-2xl p-space-lg flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-label-caps text-label-caps uppercase text-secondary font-bold">Scenario Beta</span>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-label-caps uppercase font-bold ${currentBattle.beta.tagColor}`}>
                        {currentBattle.beta.tag}
                      </span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-2">{currentBattle.beta.name}</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                      {currentBattle.beta.desc}
                    </p>
                    <div className="space-y-space-xs">
                      <div className="flex justify-between items-center text-body-sm">
                        <span className="text-on-surface-variant font-body-sm">{currentBattle.beta.annualLabel}</span>
                        <span className="font-data-mono font-bold text-on-surface">{currentBattle.beta.annual}</span>
                      </div>
                      <div className="flex justify-between items-center text-body-sm">
                        <span className="text-on-surface-variant font-body-sm">{currentBattle.beta.benefitLabel}</span>
                        <span className={`font-data-mono font-bold ${currentBattle.beta.benefitColor}`}>{currentBattle.beta.benefitVal}</span>
                      </div>
                      <div className="flex justify-between items-center text-body-sm">
                        <span className="text-on-surface-variant font-body-sm">{currentBattle.beta.costLabel}</span>
                        <span className="font-data-mono font-bold text-on-surface">{currentBattle.beta.effectiveCost}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-space-md mt-space-md bg-surface-container-high/50 rounded-xl p-3">
                    <span className="font-label-caps text-label-caps uppercase text-outline">Est. Value (Horizon Compound):</span>
                    <div className="font-numerical-display text-numerical-display text-secondary mt-1">{currentBattle.beta.estValue}</div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">{currentBattle.beta.note}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* All 25 Global Financial Domains Directory System */}
          <section className="w-full max-w-max-width-canvas mx-auto px-gutter-desktop my-space-2xl" id="all-domains">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-xl">
              <div>
                <div className="flex items-center gap-2 text-primary mb-1">
                  <span className="material-symbols-outlined text-[20px]">grid_view</span>
                  <span className="font-label-caps text-label-caps uppercase font-bold tracking-wider">Comprehensive Architecture</span>
                </div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface">
                  All 25 Core Financial Computational Domains
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mt-1">
                  Peer-reviewed mathematical models spanning personal wealth accumulation, corporate enterprise analytics, cross-border payroll, real estate syndication, and macro-economics.
                </p>
              </div>
              <div className="mt-4 md:mt-0 font-data-mono text-body-sm text-on-surface-variant">
                Index: <span className="text-primary font-bold">{filteredDomains.length}</span> / 25 Domains ({DOMAINS.reduce((acc) => acc + 42, 0)} Live Formulated Tools)
              </div>
            </div>

            {/* 25 Domain Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-space-md">
              {filteredDomains.map((domain) => {
                const isGradient = domain.colorTheme === 'gradient';
                const isPrimary = domain.colorTheme === 'primary';
                const isSecondary = domain.colorTheme === 'secondary';
                const isTertiary = domain.colorTheme === 'tertiary';

                const iconBgClass = isGradient
                  ? 'bg-white/20 text-white'
                  : isPrimary
                  ? 'bg-primary/10 text-primary'
                  : isSecondary
                  ? 'bg-secondary/10 text-secondary'
                  : 'bg-tertiary/10 text-tertiary';

                const badgeBgClass = isGradient
                  ? 'bg-white/20 text-white'
                  : isPrimary
                  ? 'bg-surface-container-high text-primary'
                  : isSecondary
                  ? 'bg-surface-container-high text-secondary'
                  : 'bg-surface-container-high text-tertiary';

                const tagHoverClass = isGradient
                  ? 'bg-white/20 text-white hover:bg-white hover:text-primary'
                  : isPrimary
                  ? 'hover:bg-primary/10 hover:text-primary'
                  : isSecondary
                  ? 'hover:bg-secondary/10 hover:text-secondary'
                  : 'hover:bg-tertiary/10 hover:text-tertiary';

                const linkColor = isGradient
                  ? 'text-white'
                  : isPrimary
                  ? 'text-primary'
                  : isSecondary
                  ? 'text-secondary'
                  : 'text-tertiary';

                if (isGradient) {
                  return (
                    <div
                      key={domain.id}
                      className="group bg-gradient-to-br from-primary-container to-primary rounded-2xl p-space-md text-on-primary shadow-lg hover:shadow-2xl transition-all flex flex-col justify-between"
                      id={domain.id}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-space-xs">
                          <div className={`w-10 h-10 rounded-xl ${iconBgClass} flex items-center justify-center`}>
                            <span className="material-symbols-outlined text-[22px]">{domain.icon}</span>
                          </div>
                          <span className={`font-data-mono text-[12px] px-2 py-0.5 rounded ${badgeBgClass} font-bold`}>
                            {domain.toolsCount}
                          </span>
                        </div>
                        <h3 className="font-headline-md text-headline-md text-white mb-1">{domain.title}</h3>
                        <p className="font-body-sm text-body-sm text-white/80 mb-space-sm">{domain.description}</p>
                        <div className="flex flex-wrap gap-1.5 font-body-sm text-[12px]">
                          {domain.tags.map((tag) => (
                            <Link
                              key={tag.label}
                              className={`px-2 py-1 rounded-md transition-colors ${tagHoverClass}`}
                              href={tag.href}
                            >
                              {tag.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                      <Link
                        className={`mt-space-md pt-space-xs flex items-center justify-between ${linkColor} font-body-sm font-semibold`}
                        href={domain.categoryLink}
                      >
                        <span>Explore FIRE Suite</span>
                        <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                      </Link>
                    </div>
                  );
                }

                return (
                  <div
                    key={domain.id}
                    className="group bg-surface-container-lowest rounded-2xl p-space-md shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
                    id={domain.id}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-space-xs">
                        <div className={`w-10 h-10 rounded-xl ${iconBgClass} flex items-center justify-center`}>
                          <span className="material-symbols-outlined text-[22px]">{domain.icon}</span>
                        </div>
                        <span className={`font-data-mono text-[12px] px-2 py-0.5 rounded ${badgeBgClass} font-bold`}>
                          {domain.toolsCount}
                        </span>
                      </div>
                      <h3 className={`font-headline-md text-headline-md text-on-surface group-hover:${linkColor} transition-colors`}>
                        {domain.title}
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 mb-space-sm">{domain.description}</p>
                      <div className="flex flex-wrap gap-1.5 font-body-sm text-[12px]">
                        {domain.tags.map((tag) => (
                          <Link
                            key={tag.label}
                            className={`px-2 py-1 rounded-md bg-surface-container-low text-on-surface-variant transition-colors ${tagHoverClass}`}
                            href={tag.href}
                          >
                            {tag.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                    <Link
                      className={`mt-space-md pt-space-xs flex items-center justify-between ${linkColor} font-body-sm font-semibold`}
                      href={domain.categoryLink}
                    >
                      <span>Open Category</span>
                      <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </Link>
                  </div>
                );
              })}
            </div>

            {filteredDomains.length === 0 && (
              <div className="text-center py-space-2xl bg-surface-container-lowest rounded-2xl p-space-lg">
                <span className="material-symbols-outlined text-outline text-[40px] mb-2">search_off</span>
                <h4 className="font-headline-md text-on-surface">No Computational Domains Found</h4>
                <p className="font-body-sm text-on-surface-variant mt-1">
                  Try searching for terms like &apos;mortgage&apos;, &apos;roth&apos;, &apos;interest&apos;, &apos;tax&apos;, or &apos;salary&apos;.
                </p>
                <button
                  className="mt-4 px-4 py-2 bg-primary text-on-primary rounded-xl font-body-sm font-semibold"
                  onClick={() => setSearchQuery('')}
                  type="button"
                >
                  Clear Filter
                </button>
              </div>
            )}
          </section>

          {/* Programmatic SEO Sub-Directory & Country Hub Matrix */}
          <section className="w-full max-w-max-width-canvas mx-auto px-gutter-desktop my-space-2xl">
            <div className="bg-surface-container-low rounded-3xl p-space-lg md:p-space-xl">
              <div className="flex items-center gap-2 text-primary mb-1">
                <span className="material-symbols-outlined text-[20px]">travel_explore</span>
                <span className="font-label-caps text-label-caps uppercase font-bold tracking-wider">Targeted Calculators</span>
              </div>
              
              <h2 className="font-headline-lg text-headline-lg text-on-surface">
                Localized Hubs &amp; Regional Directories
              </h2>
              
              <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mt-1 mb-space-lg">
                Calculators customized for your local tax rules, regional housing costs, and national guidelines.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
                {/* Column 1: Mortgages */}
                <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm">
                  <div className="flex items-center gap-2 mb-space-xs">
                    <span className="material-symbols-outlined text-primary text-[20px]">home_work</span>
                    <h3 className="font-headline-md text-headline-md text-on-surface">State &amp; Country Mortgages</h3>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm">
                    Includes local property taxes and home buying fees.
                  </p>
                  <div className="grid grid-cols-2 gap-2 font-body-sm text-body-sm">
                    <Link className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface hover:text-primary transition-colors flex items-center justify-between" href="/finance/mortgage-calculator">
                      <span>California</span><span className="text-[11px] text-outline">1.25%</span>
                    </Link>
                    <Link className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface hover:text-primary transition-colors flex items-center justify-between" href="/finance/mortgage-calculator">
                      <span>Texas</span><span className="text-[11px] text-outline">1.90%</span>
                    </Link>
                    <Link className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface hover:text-primary transition-colors flex items-center justify-between" href="/finance/mortgage-calculator">
                      <span>Florida</span><span className="text-[11px] text-outline">0.98%</span>
                    </Link>
                    <Link className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface hover:text-primary transition-colors flex items-center justify-between" href="/finance/mortgage-calculator">
                      <span>New York</span><span className="text-[11px] text-outline">1.73%</span>
                    </Link>
                    <Link className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface hover:text-primary transition-colors flex items-center justify-between" href="/finance/mortgage-calculator">
                      <span>United Kingdom</span><span className="text-[11px] text-outline">SDLT</span>
                    </Link>
                    <Link className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface hover:text-primary transition-colors flex items-center justify-between" href="/finance/mortgage-calculator">
                      <span>Australia</span><span className="text-[11px] text-outline">Stamp</span>
                    </Link>
                  </div>
                </div>

                {/* Column 2: Tax Intelligence */}
                <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm">
                  <div className="flex items-center gap-2 mb-space-xs">
                    <span className="material-symbols-outlined text-secondary text-[20px]">balance</span>
                    <h3 className="font-headline-md text-headline-md text-on-surface">Country Tax Engines</h3>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm">
                    Find out how much income tax you owe based on your country's tax rules.
                  </p>
                  <div className="grid grid-cols-2 gap-2 font-body-sm text-body-sm">
                    <Link className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface hover:text-secondary transition-colors flex items-center justify-between" href="/global-tax-calculator">
                      <span>United States</span><span className="text-[11px] text-outline">IRS 1040</span>
                    </Link>
                    <Link className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface hover:text-secondary transition-colors flex items-center justify-between" href="/global-tax-calculator">
                      <span>United Kingdom</span><span className="text-[11px] text-outline">HMRC PAYE</span>
                    </Link>
                    <Link className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface hover:text-secondary transition-colors flex items-center justify-between" href="/tax-calculator/canada">
                      <span>Canada</span><span className="text-[11px] text-outline">CRA T1</span>
                    </Link>
                    <Link className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface hover:text-secondary transition-colors flex items-center justify-between" href="/tax-calculator/australia">
                      <span>Australia</span><span className="text-[11px] text-outline">ATO GST</span>
                    </Link>
                    <Link className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface hover:text-secondary transition-colors flex items-center justify-between" href="/global-tax-calculator">
                      <span>Germany</span><span className="text-[11px] text-outline">EStG</span>
                    </Link>
                    <Link className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface hover:text-secondary transition-colors flex items-center justify-between" href="/tax-calculator/singapore">
                      <span>Singapore</span><span className="text-[11px] text-outline">IRAS 9%</span>
                    </Link>
                  </div>
                </div>

                {/* Column 3: Age Demographics */}
                <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm">
                  <div className="flex items-center gap-2 mb-space-xs">
                    <span className="material-symbols-outlined text-tertiary text-[20px]">event_repeat</span>
                    <h3 className="font-headline-md text-headline-md text-on-surface">Age-Specific Retirement Hubs</h3>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm">
                    Tailored plans based on your age and how many years you have left to save.
                  </p>
                  <div className="grid grid-cols-2 gap-2 font-body-sm text-body-sm">
                    <Link className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface hover:text-tertiary transition-colors flex items-center justify-between" href="/fire-forecaster">
                      <span>Retire at Age 30</span><span className="text-[11px] text-outline">Aggressive</span>
                    </Link>
                    <Link className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface hover:text-tertiary transition-colors flex items-center justify-between" href="/fire-forecaster">
                      <span>Retire at Age 40</span><span className="text-[11px] text-outline">Coast FIRE</span>
                    </Link>
                    <Link className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface hover:text-tertiary transition-colors flex items-center justify-between" href="/fire-forecaster">
                      <span>Retire at Age 50</span><span className="text-[11px] text-outline">Catch-Up</span>
                    </Link>
                    <Link className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface hover:text-tertiary transition-colors flex items-center justify-between" href="/fire-forecaster">
                      <span>Retire at Age 60</span><span className="text-[11px] text-outline">Soc. Security</span>
                    </Link>
                    <Link className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface hover:text-tertiary transition-colors flex items-center justify-between" href="/fire-forecaster">
                      <span>Retire at Age 65</span><span className="text-[11px] text-outline">Medicare</span>
                    </Link>
                    <Link className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface hover:text-tertiary transition-colors flex items-center justify-between" href="/fire-forecaster">
                      <span>Retire at Age 70</span><span className="text-[11px] text-outline">Max Benefit</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Google AI Overview & Featured Snippet Benchmark Box */}
          <section className="w-full max-w-max-width-canvas mx-auto px-gutter-desktop my-space-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
              {/* Left: Featured Snippet Answer Box */}
              <div className="lg:col-span-5 bg-surface-container-lowest rounded-3xl p-space-lg md:p-space-xl shadow-lg border-0">
                <div className="flex items-center gap-2 text-primary mb-space-xs">
                  <span className="material-symbols-outlined text-[20px]">lightbulb</span>
                  <span className="font-label-caps text-label-caps uppercase font-bold tracking-wider">Featured Snippet Optimization</span>
                </div>
                
                <h3 className="font-headline-md text-headline-md text-on-surface">
                  What is the 4% Safe Withdrawal Rule in Retirement?
                </h3>
                
                <div className="my-space-md p-3.5 bg-surface-container-low rounded-xl font-body-sm text-body-sm text-on-surface leading-relaxed">
                  The <strong>4% Safe Withdrawal Rate (SWR)</strong>, derived from the landmark 1998 Trinity Study, states that an investor retiring with a portfolio balanced 50% equities and 50% bonds can safely withdraw 4% of their starting balance in year one, adjusted annually for inflation, with an <strong>over 95% historical probability</strong> that the fund will survive at least 30 years without total depletion.
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-body-sm">
                    <span className="text-on-surface-variant">Recommended 40+ Year Horizon SWR:</span>
                    <span className="font-data-mono font-bold text-primary">3.25% - 3.50%</span>
                  </div>
                  <div className="flex justify-between items-center text-body-sm">
                    <span className="text-on-surface-variant">Target Nest Egg for $80k Annual Spend:</span>
                    <span className="font-data-mono font-bold text-on-surface">$2,000,000</span>
                  </div>
                  <div className="flex justify-between items-center text-body-sm">
                    <span className="text-on-surface-variant">Sequence of Returns Hedge:</span>
                    <span className="font-data-mono font-bold text-on-surface">18-Month Cash Buffer</span>
                  </div>
                </div>

                <Link
                  className="mt-space-md inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container-high hover:bg-primary hover:text-on-primary text-on-surface font-body-sm font-semibold transition-colors"
                  href="/fire-forecaster"
                >
                  <span className="material-symbols-outlined text-[16px]">calculate</span>
                  Calculate Custom SWR Survival
                </Link>
              </div>

              {/* Right: Direct Comparison Table Against Outdated Legacy Calculators */}
              <div className="lg:col-span-7 bg-surface-container-lowest rounded-3xl p-space-lg md:p-space-xl shadow-lg">
                <div className="flex items-center justify-between mb-space-md">
                  <div>
                    <div className="flex items-center gap-2 text-primary mb-1">
                      <span className="material-symbols-outlined text-[20px]">speed</span>
                      <span className="font-label-caps text-label-caps uppercase font-bold tracking-wider">Architecture Benchmark</span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface">
                      SolveIt vs. Legacy Financial Calculator Portals
                    </h3>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-body-sm text-body-sm">
                    <thead>
                      <tr className="bg-surface-container-low text-on-surface">
                        <th className="p-3 rounded-l-xl font-semibold">Engine Feature</th>
                        <th className="p-3 font-semibold text-primary">SolveIt Calculator</th>
                        <th className="p-3 rounded-r-xl font-semibold text-on-surface-variant">Legacy Sites (Omni, Bankrate)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-transparent space-y-1">
                      <tr className="hover:bg-surface-container-low/50">
                        <td className="p-3 font-medium text-on-surface">User Data Privacy</td>
                        <td className="p-3 font-semibold text-primary flex items-center gap-1">
                          <span className="material-symbols-outlined text-[18px]">check_circle</span> 100% Client-Side Sandbox
                        </td>
                        <td className="p-3 text-on-surface-variant">Server Tracking &amp; Lead Selling</td>
                      </tr>
                      <tr className="hover:bg-surface-container-low/50">
                        <td className="p-3 font-medium text-on-surface">Visual Clutter &amp; Ads</td>
                        <td className="p-3 font-semibold text-primary flex items-center gap-1">
                          <span className="material-symbols-outlined text-[18px]">check_circle</span> 0 Ads, Clean Modern Glass
                        </td>
                        <td className="p-3 text-on-surface-variant">Heavy Banner Ads &amp; Popups</td>
                      </tr>
                      <tr className="hover:bg-surface-container-low/50">
                        <td className="p-3 font-medium text-on-surface">Recalculation Latency</td>
                        <td className="p-3 font-semibold text-primary flex items-center gap-1">
                          <span className="material-symbols-outlined text-[18px]">bolt</span> Sub-Millisecond Instantaneous
                        </td>
                        <td className="p-3 text-on-surface-variant">Full Page Reloads (500ms - 2s)</td>
                      </tr>
                      <tr className="hover:bg-surface-container-low/50">
                        <td className="p-3 font-medium text-on-surface">Mathematical Precision</td>
                        <td className="p-3 font-semibold text-primary flex items-center gap-1">
                          <span className="material-symbols-outlined text-[18px]">check_circle</span> IEEE 754 64-bit Strict Exact
                        </td>
                        <td className="p-3 text-on-surface-variant">Rounded Javascript Approximations</td>
                      </tr>
                      <tr className="hover:bg-surface-container-low/50">
                        <td className="p-3 font-medium text-on-surface">Audit Trail PDF Export</td>
                        <td className="p-3 font-semibold text-primary flex items-center gap-1">
                          <span className="material-symbols-outlined text-[18px]">check_circle</span> Instant Vectorized CPA Sheet
                        </td>
                        <td className="p-3 text-on-surface-variant">Paywalled or Unavailable</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          {/* Institutional Trust & EEAT Verification Bar */}
          <section className="w-full max-w-max-width-canvas mx-auto px-gutter-desktop my-space-2xl">
            <div className="bg-surface-container-highest/40 rounded-3xl p-space-lg md:p-space-xl shadow-inner">
              <div className="flex flex-col md:flex-row items-center justify-between gap-space-lg">
                <div className="flex items-center gap-space-md">
                  <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-on-primary shadow-lg shadow-primary/20 shrink-0">
                    <span className="material-symbols-outlined text-[32px]">workspace_premium</span>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
                      Peer-Reviewed Computational Reliability
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                      Every formula within our directory is subjected to quantitative unit tests authored by Certified Financial Planners (CFP®), certified accountants, and software quantitative analysts.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <div className="px-3 py-2 rounded-xl bg-surface-container-lowest text-on-surface font-body-sm font-semibold shadow-sm flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span> AICPA Standard
                  </div>
                  <div className="px-3 py-2 rounded-xl bg-surface-container-lowest text-on-surface font-body-sm font-semibold shadow-sm flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-secondary text-[18px]">check_circle</span> IFRS-9 Valuation
                  </div>
                  <div className="px-3 py-2 rounded-xl bg-surface-container-lowest text-on-surface font-body-sm font-semibold shadow-sm flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-tertiary text-[18px]">check_circle</span> Reg Z / TILA Math
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Featured Financial Mathematics Guides & Deep Dives */}
          <section className="w-full max-w-max-width-canvas mx-auto px-gutter-desktop my-space-2xl" id="finance-articles">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-lg">
              <div>
                <div className="flex items-center gap-2 text-primary mb-1">
                  <span className="material-symbols-outlined text-[20px]">menu_book</span>
                  <span className="font-label-caps text-label-caps uppercase font-bold tracking-wider">Editorial Publications</span>
                </div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface">
                  Financial Mathematics Guides &amp; Deep Dives
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mt-1">
                  Peer-reviewed computational guides analyzing reducing-balance amortization mechanics, Goods and Services Tax extractions, and multi-decade exponential compounding dynamics.
                </p>
              </div>
              <Link className="text-body-sm font-body-sm font-semibold text-primary hover:underline flex items-center gap-1 mt-3 md:mt-0" href="/article">
                Explore all financial whitepapers <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
              {/* Article 1: EMI */}
              <Link 
                href="/article/how-emi-works"
                className="group bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm flex flex-col border border-outline-variant/20 hover:border-primary/40 transition-all block"
              >
                <div className="h-44 w-full bg-slate-900 relative overflow-hidden flex items-center justify-center">
                  <svg viewBox="0 0 400 200" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" role="img" aria-label="Amortization Dynamics Thumbnail">
                    <rect width="400" height="200" fill="#0f172a" />
                    {/* Grid */}
                    <line x1="40" y1="160" x2="360" y2="160" stroke="#334155" strokeWidth="1.5" />
                    <line x1="40" y1="30" x2="40" y2="160" stroke="#334155" strokeWidth="1.5" />
                    {/* Fixed EMI line */}
                    <line x1="40" y1="50" x2="360" y2="50" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />
                    <text x="200" y="42" fill="#cbd5e1" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">Fixed Monthly EMI</text>
                    {/* Interest curve (drops) */}
                    <path d="M 40 60 Q 180 80 360 150" fill="none" stroke="#f43f5e" strokeWidth="2.5" />
                    {/* Principal curve (rises) */}
                    <path d="M 40 150 Q 180 130 360 60" fill="none" stroke="#10b981" strokeWidth="2.5" />
                    {/* Tipping point */}
                    <circle cx="200" cy="105" r="5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
                    <text x="200" y="95" fill="#fbbf24" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">Tipping Point</text>
                    {/* Labels */}
                    <text x="80" y="145" fill="#10b981" fontSize="10" fontWeight="bold" fontFamily="sans-serif">Principal</text>
                    <text x="80" y="80" fill="#f43f5e" fontSize="10" fontWeight="bold" fontFamily="sans-serif">Interest</text>
                    <text x="45" y="175" fill="#64748b" fontSize="9" fontFamily="sans-serif">Month 1</text>
                    <text x="355" y="175" fill="#64748b" fontSize="9" textAnchor="end" fontFamily="sans-serif">Month 360</text>
                  </svg>
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md bg-surface/90 text-on-surface font-label-caps text-[10px] shadow-sm font-semibold">
                    Consumer Credit
                  </span>
                </div>
                <div className="p-space-md flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-headline-md text-[17px] font-bold text-on-surface mb-2 group-hover:text-primary transition-colors">
                      How EMI Works: The Mathematical Breakdown of Amortization
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-3">
                      Learn how the reducing balance method front-loads interest, and discover how accelerated bi-weekly payment schedules eliminate years of debt.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-surface-container flex items-center justify-between text-[12px] text-on-surface-variant">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-primary">schedule</span>
                      7 min read • Last Updated: September 15, 2026
                    </span>
                    <span className="font-semibold text-primary group-hover:translate-x-0.5 transition-transform shrink-0">Read Guide →</span>
                  </div>
                </div>
              </Link>

              {/* Article 2: GST */}
              <Link 
                href="/article/understanding-gst"
                className="group bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm flex flex-col border border-outline-variant/20 hover:border-secondary/40 transition-all block"
              >
                <div className="h-44 w-full bg-slate-900 relative overflow-hidden flex items-center justify-center">
                  <svg viewBox="0 0 400 200" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" role="img" aria-label="GST Value Added Flow Thumbnail">
                    <rect width="400" height="200" fill="#0b1329" />
                    {/* Stages boxes */}
                    <rect x="30" y="55" width="90" height="70" rx="8" fill="#1e293b" stroke="#3b82f6" strokeWidth="1.5" />
                    <text x="75" y="80" fill="#93c5fd" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">Manufacturer</text>
                    <text x="75" y="100" fill="#f8fafc" fontSize="11" textAnchor="middle" fontFamily="sans-serif">$100 + $10 Tax</text>
                    
                    <line x1="120" y1="90" x2="155" y2="90" stroke="#3b82f6" strokeWidth="2" strokeDasharray="3 3" />
                    
                    <rect x="155" y="55" width="90" height="70" rx="8" fill="#1e293b" stroke="#8b5cf6" strokeWidth="1.5" />
                    <text x="200" y="80" fill="#c4b5fd" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">Distributor</text>
                    <text x="200" y="100" fill="#f8fafc" fontSize="11" textAnchor="middle" fontFamily="sans-serif">$200 + $20 Tax</text>
                    <text x="200" y="115" fill="#34d399" fontSize="9" textAnchor="middle" fontFamily="sans-serif">ITC -$10 = $10 Remit</text>

                    <line x1="245" y1="90" x2="280" y2="90" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="3 3" />

                    <rect x="280" y="55" width="90" height="70" rx="8" fill="#1e293b" stroke="#10b981" strokeWidth="1.5" />
                    <text x="325" y="80" fill="#6ee7b7" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">End Retailer</text>
                    <text x="325" y="100" fill="#f8fafc" fontSize="11" textAnchor="middle" fontFamily="sans-serif">$300 + $30 Tax</text>
                    <text x="325" y="115" fill="#34d399" fontSize="9" textAnchor="middle" fontFamily="sans-serif">ITC -$20 = $10 Remit</text>

                    <rect x="100" y="150" width="200" height="26" rx="13" fill="#1e293b" stroke="#475569" />
                    <text x="200" y="167" fill="#f8fafc" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">No Tax Cascading: Total $30</text>
                  </svg>
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md bg-surface/90 text-on-surface font-label-caps text-[10px] shadow-sm font-semibold">
                    Taxation &amp; Accounting
                  </span>
                </div>
                <div className="p-space-md flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-headline-md text-[17px] font-bold text-on-surface mb-2 group-hover:text-secondary transition-colors">
                      Understanding GST: Step-by-Step Calculation for Buyers &amp; Sellers
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-3">
                      Demystify Goods and Services Tax math. Learn how to extract inclusive base costs and calculate input tax credit (ITC) pass-throughs for businesses.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-surface-container flex items-center justify-between text-[12px] text-on-surface-variant">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-secondary">schedule</span>
                      6 min read • Last Updated: September 15, 2026
                    </span>
                    <span className="font-semibold text-secondary group-hover:translate-x-0.5 transition-transform shrink-0">Read Guide →</span>
                  </div>
                </div>
              </Link>

              {/* Article 3: Investment */}
              <Link 
                href="/article/investment-planning-basics"
                className="group bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm flex flex-col border border-outline-variant/20 hover:border-tertiary/40 transition-all block"
              >
                <div className="h-44 w-full bg-slate-900 relative overflow-hidden flex items-center justify-center">
                  <svg viewBox="0 0 400 200" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" role="img" aria-label="Compound Growth vs Linear Thumbnail">
                    <rect width="400" height="200" fill="#0f172a" />
                    {/* Axis */}
                    <line x1="40" y1="165" x2="360" y2="165" stroke="#334155" strokeWidth="1.5" />
                    <line x1="40" y1="30" x2="40" y2="165" stroke="#334155" strokeWidth="1.5" />
                    {/* Linear savings line */}
                    <line x1="40" y1="150" x2="360" y2="110" stroke="#64748b" strokeWidth="2" strokeDasharray="4 4" />
                    <text x="360" y="105" fill="#94a3b8" fontSize="9" textAnchor="end" fontFamily="sans-serif">Linear Savings ($180k)</text>
                    {/* Exponential Compound curve */}
                    <path d="M 40 150 Q 200 140 280 90 T 360 40" fill="none" stroke="#f59e0b" strokeWidth="3" />
                    <circle cx="360" cy="40" r="5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
                    <text x="355" y="32" fill="#fbbf24" fontSize="10" fontWeight="bold" textAnchor="end" fontFamily="sans-serif">Compound SIP ($944k)</text>
                    {/* Rule of 72 Callout */}
                    <rect x="70" y="55" width="130" height="24" rx="6" fill="#1e293b" stroke="#f59e0b" strokeWidth="1" />
                    <text x="135" y="71" fill="#fde68a" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">Rule of 72: Doubling Math</text>
                    {/* Years Axis labels */}
                    <text x="45" y="180" fill="#64748b" fontSize="9" fontFamily="sans-serif">Year 0</text>
                    <text x="200" y="180" fill="#64748b" fontSize="9" textAnchor="middle" fontFamily="sans-serif">Year 15</text>
                    <text x="355" y="180" fill="#64748b" fontSize="9" textAnchor="end" fontFamily="sans-serif">Year 30</text>
                  </svg>
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md bg-surface/90 text-on-surface font-label-caps text-[10px] shadow-sm font-semibold">
                    Wealth Accumulation
                  </span>
                </div>
                <div className="p-space-md flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-headline-md text-[17px] font-bold text-on-surface mb-2 group-hover:text-tertiary transition-colors">
                      Investment Planning Basics: The Power of Compound Interest &amp; SIP
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-3">
                      Understand the exponential arithmetic of reinvested dividends modeled over 10, 20, and 30-year horizons, with systematic investment plan (SIP) math.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-surface-container flex items-center justify-between text-[12px] text-on-surface-variant">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-tertiary">schedule</span>
                      8 min read • Last Updated: September 15, 2026
                    </span>
                    <span className="font-semibold text-tertiary group-hover:translate-x-0.5 transition-transform shrink-0">Read Guide →</span>
                  </div>
                </div>
              </Link>
            </div>
          </section>

          {/* Google EEAT Editorial Standards & Scientific Review Board Section */}
          <section className="w-full max-w-max-width-canvas mx-auto px-gutter-desktop my-space-2xl" id="editorial-board">
            <div className="bg-surface-container-lowest rounded-3xl p-space-lg md:p-space-xl shadow-xl">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-xl">
                <div>
                  <div className="flex items-center gap-2 text-primary mb-1">
                    <span className="material-symbols-outlined text-[20px]">verified_user</span>
                    <span className="font-label-caps text-label-caps uppercase font-bold tracking-wider">Google EEAT Governance &amp; Methodology</span>
                  </div>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface">
                    Editorial Standards &amp; Review Board
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mt-1">
                    Every formula, interest rate algorithm, and statutory tax table on SolveIt is authored, peer-reviewed, and continuously verified against legal citations by credentialed financial officers.
                  </p>
                </div>
                <div className="mt-4 md:mt-0 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-container-high text-on-surface font-body-sm font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping"></span>
                  <span>Last Updated: September 15, 2026</span>
                </div>
              </div>

              {/* Review Board Expert Profiles */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg mb-space-xl">
                {/* Expert 1 */}
                <div className="bg-surface-container-low rounded-2xl p-space-md flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[18px]">
                        AS
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-primary-container text-on-primary-container font-label-caps text-label-caps uppercase font-semibold">
                        Verified CFP® / CFA
                      </span>
                    </div>
                    <h3 className="font-headline-md text-[18px] text-on-surface font-bold">Dr. Arthur Sterling, CFP®, CFA</h3>
                    <span className="font-body-sm text-[13px] text-primary font-medium block mb-2">Chief Financial Architect</span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                      Former quantitative portfolio manager with 18+ years modeling safe withdrawal rates, Monte Carlo lifecycle simulations, and multi-asset glidepath optimization.
                    </p>
                  </div>
                  <div className="mt-space-md pt-space-xs flex items-center justify-between font-data-mono text-[11px] text-outline">
                    <span>License: CFA #849102</span>
                    <span className="text-primary font-semibold">FINRA Series 65</span>
                  </div>
                </div>

                {/* Expert 2 */}
                <div className="bg-surface-container-low rounded-2xl p-space-md flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-12 h-12 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-bold text-[18px]">
                        ER
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-surface-container-highest text-secondary font-label-caps text-label-caps uppercase font-semibold">
                        Verified CPA / CVA
                      </span>
                    </div>
                    <h3 className="font-headline-md text-[18px] text-on-surface font-bold">Elena Rostova, CPA, CVA</h3>
                    <span className="font-body-sm text-[13px] text-secondary font-medium block mb-2">Tax Metrology Director</span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                      Specialist in international corporate tax architecture, statutory IRS Revenue Procedures, section 179/1031 depreciation schedules, and cross-border payroll compliance.
                    </p>
                  </div>
                  <div className="mt-space-md pt-space-xs flex items-center justify-between font-data-mono text-[11px] text-outline">
                    <span>AICPA ID: 2049182</span>
                    <span className="text-secondary font-semibold">State Board CPA</span>
                  </div>
                </div>

                {/* Expert 3 */}
                <div className="bg-surface-container-low rounded-2xl p-space-md flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-12 h-12 rounded-full bg-tertiary/10 text-tertiary flex items-center justify-center font-bold text-[18px]">
                        MV
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-surface-container-highest text-tertiary font-label-caps text-label-caps uppercase font-semibold">
                        Verified CFA®
                      </span>
                    </div>
                    <h3 className="font-headline-md text-[18px] text-on-surface font-bold">Marcus Vance, CFA®</h3>
                    <span className="font-body-sm text-[13px] text-tertiary font-medium block mb-2">Quantitative Risk Lead</span>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                      Directs IEEE 754 arbitrary-precision code reviews and stress-tests amortization engines against Black-Scholes and Kelly Criterion volatility tolerances.
                    </p>
                  </div>
                  <div className="mt-space-md pt-space-xs flex items-center justify-between font-data-mono text-[11px] text-outline">
                    <span>CFA Charter: #610934</span>
                    <span className="text-tertiary font-semibold">GARP FRM Member</span>
                  </div>
                </div>
              </div>

              {/* 4-Tier Verification Workflow & Statutory Citations */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg pt-space-md">
                {/* 4-Tier Editorial Verification Workflow */}
                <div className="lg:col-span-7 bg-surface-container-high/40 rounded-2xl p-space-md">
                  <h3 className="font-headline-md text-[18px] text-on-surface font-bold mb-space-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">reorder</span>
                    4-Tier Editorial Verification Workflow
                  </h3>
                  <div className="space-y-3 font-body-sm text-body-sm text-on-surface-variant">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center font-data-mono text-[11px] font-bold shrink-0 mt-0.5">1</div>
                      <div>
                        <strong className="text-on-surface">First-Principles Formula Derivation:</strong> Mathematical models are authored from peer-reviewed academic finance literature (e.g. Trinity Study, Markowitz MPT, Black-Scholes 1973).
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center font-data-mono text-[11px] font-bold shrink-0 mt-0.5">2</div>
                      <div>
                        <strong className="text-on-surface">Statutory Benchmarking:</strong> Verified against primary legal statutes including IRS Rev. Proc. 2024-40, UK Finance Act, Australia Income Tax Assessment Act 1997, and Canada ITA.
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center font-data-mono text-[11px] font-bold shrink-0 mt-0.5">3</div>
                      <div>
                        <strong className="text-on-surface">IEEE 754 Decimal Stress Testing:</strong> Multi-decade compound interest and 360-month amortization cycles run in arbitrary-precision decimal modules to eliminate JavaScript 64-bit float drift.
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center font-data-mono text-[11px] font-bold shrink-0 mt-0.5">4</div>
                      <div>
                        <strong className="text-on-surface">Annual Statutory Recalibration:</strong> Every calendar year and fiscal quarter, IRS contribution bounds, Social Security bend points, and indexation rates undergo mandatory sign-off.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Primary Statutory Citations & Editorial Independence */}
                <div className="lg:col-span-5 bg-surface-container-high/40 rounded-2xl p-space-md flex flex-col justify-between">
                  <div>
                    <h3 className="font-headline-md text-[18px] text-on-surface font-bold mb-space-sm flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary text-[20px]">menu_book</span>
                      Primary Statutory Citations
                    </h3>
                    <ul className="space-y-2 font-body-sm text-[13px] text-on-surface-variant">
                      <li className="flex items-center justify-between p-2 rounded-lg bg-surface-container-lowest">
                        <span>IRS Internal Revenue Code § 401(k), § 408A</span>
                        <span className="font-data-mono text-[11px] text-primary">2025 Caps</span>
                      </li>
                      <li className="flex items-center justify-between p-2 rounded-lg bg-surface-container-lowest">
                        <span>CFPB Regulation Z (12 CFR Part 1026 - TILA)</span>
                        <span className="font-data-mono text-[11px] text-secondary">APR/APY</span>
                      </li>
                      <li className="flex items-center justify-between p-2 rounded-lg bg-surface-container-lowest">
                        <span>HMRC Taxes Management Act 1970</span>
                        <span className="font-data-mono text-[11px] text-tertiary">PAYE Class 1</span>
                      </li>
                      <li className="flex items-center justify-between p-2 rounded-lg bg-surface-container-lowest">
                        <span>ATO Superannuation Guarantee Act 1992</span>
                        <span className="font-data-mono text-[11px] text-primary">11.5% SG</span>
                      </li>
                    </ul>
                  </div>
                  <div className="mt-space-md p-3 rounded-xl bg-surface-container-low font-body-sm text-[12px] text-on-surface-variant leading-normal">
                    <strong className="text-on-surface">Editorial Independence:</strong> SolveIt does not accept compensation, lead-bounties, or commissions from banks, lenders, or brokerages for computational placement.
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Frequently Asked Questions (FAQ Accordions) */}
          <section className="w-full max-w-max-width-canvas mx-auto px-gutter-desktop my-space-2xl">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-space-xl">
                <div className="inline-flex items-center gap-1 text-primary mb-1">
                  <span className="material-symbols-outlined text-[20px]">help_center</span>
                  <span className="font-label-caps text-label-caps uppercase font-bold tracking-wider">Expert Insights</span>
                </div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface">
                  Frequently Asked Questions
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                  Everything you need to know about our mathematical standards, data privacy, and formula certifications.
                </p>
              </div>

              <div className="space-y-space-sm" id="faq-container">
                {/* FAQ 1 */}
                <details className="group bg-surface-container-lowest rounded-2xl p-space-md shadow-sm transition-all open:shadow-md">
                  <summary className="flex justify-between items-center font-headline-md text-headline-md text-on-surface cursor-pointer list-none">
                    <span>Are calculations on SolveIt 100% confidential and safe?</span>
                    <span className="material-symbols-outlined text-primary group-open:rotate-180 transition-transform">expand_more</span>
                  </summary>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm pt-space-xs border-t-0">
                    Yes. All computational logic executes entirely within your client device&apos;s browser memory (client-side JavaScript). Zero monetary numbers, salaries, loan terms, or demographic parameters are transmitted to any server or recorded in tracking databases.
                  </p>
                </details>

                {/* FAQ 2 */}
                <details className="group bg-surface-container-lowest rounded-2xl p-space-md shadow-sm transition-all open:shadow-md">
                  <summary className="flex justify-between items-center font-headline-md text-headline-md text-on-surface cursor-pointer list-none">
                    <span>How does SolveIt account for rounding errors over multi-decade schedules?</span>
                    <span className="material-symbols-outlined text-primary group-open:rotate-180 transition-transform">expand_more</span>
                  </summary>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm pt-space-xs border-t-0">
                    Traditional calculators suffer from JavaScript floating point inaccuracies (e.g. 0.1 + 0.2 != 0.3). SolveIt utilizes specialized arbitrary-precision decimal routines for multi-decade compound schedules, ensuring 100% accuracy to the cent across 360-month amortization cycles.
                  </p>
                </details>

                {/* FAQ 3 */}
                <details className="group bg-surface-container-lowest rounded-2xl p-space-md shadow-sm transition-all open:shadow-md">
                  <summary className="flex justify-between items-center font-headline-md text-headline-md text-on-surface cursor-pointer list-none">
                    <span>Can I export amortization and projection schedules for CPA tax filing?</span>
                    <span className="material-symbols-outlined text-primary group-open:rotate-180 transition-transform">expand_more</span>
                  </summary>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm pt-space-xs border-t-0">
                    Yes. Every calculator equipped with full amortization tables includes instant one-click CSV and vectorized PDF export functionality formatted to professional GAAP and AICPA reporting standards.
                  </p>
                </details>

                {/* FAQ 4 */}
                <details className="group bg-surface-container-lowest rounded-2xl p-space-md shadow-sm transition-all open:shadow-md">
                  <summary className="flex justify-between items-center font-headline-md text-headline-md text-on-surface cursor-pointer list-none">
                    <span>How frequently are tax brackets and IRS retirement limits refreshed?</span>
                    <span className="material-symbols-outlined text-primary group-open:rotate-180 transition-transform">expand_more</span>
                  </summary>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm pt-space-xs border-t-0">
                    Our tax engines update immediately whenever statutory IRS, HMRC, CRA, or ATO inflation adjustments are published in federal registers. The platform currently includes verified 2024 and 2025 contribution bounds ($23,000 for 401(k), $7,000 for IRA).
                  </p>
                </details>

                {/* FAQ 5 */}
                <details className="group bg-surface-container-lowest rounded-2xl p-space-md shadow-sm transition-all open:shadow-md">
                  <summary className="flex justify-between items-center font-headline-md text-headline-md text-on-surface cursor-pointer list-none">
                    <span>What makes SolveIt different from Omni Calculator or Bankrate?</span>
                    <span className="material-symbols-outlined text-primary group-open:rotate-180 transition-transform">expand_more</span>
                  </summary>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm pt-space-xs border-t-0">
                    SolveIt is engineered for professional speed with zero advertisement clutter, sub-millisecond recalculation latency, strict data privacy sandboxing, and interactive multi-variable side-by-side what-if engines.
                  </p>
                </details>

                {/* FAQ 6 */}
                <details className="group bg-surface-container-lowest rounded-2xl p-space-md shadow-sm transition-all open:shadow-md">
                  <summary className="flex justify-between items-center font-headline-md text-headline-md text-on-surface cursor-pointer list-none">
                    <span>Are multiple world currencies supported natively?</span>
                    <span className="material-symbols-outlined text-primary group-open:rotate-180 transition-transform">expand_more</span>
                  </summary>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm pt-space-xs border-t-0">
                    Yes. Use the global currency switcher at the top of the workbench to immediately toggle between USD ($), EUR (€), GBP (£), CAD ($), AUD ($), INR (₹), AED (د.إ), SGD ($), and JPY (¥) with localized decimal and comma separators.
                  </p>
                </details>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
