'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Coins,
  PiggyBank,
  FileText,
  Landmark,
  Briefcase,
  TrendingUp,
  Home,
  Calculator,
  ArrowRight,
  ChevronRight,
  FolderOpen,
  Lightbulb,
  HelpCircle,
  LayoutGrid,
  ArrowLeftRight,
  Calendar,
  BarChart3,
  DollarSign,
  Percent,
  Scale,
  Globe,
  BookOpen,
  Compass,
  CheckCircle2,
} from 'lucide-react';

type FinanceFilterCategory =
  | 'All'
  | 'Loans & Wealth'
  | 'Salary & Pay'
  | 'Retirement'
  | 'US Taxes'
  | 'Global Taxes'
  | 'Business';

interface FinanceToolRow {
  id: string;
  name: string;
  description: string;
  href: string;
  category: Exclude<FinanceFilterCategory, 'All'>;
  displayBadge: string;
  formulaNote: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
}

const FINANCE_FILTERS: FinanceFilterCategory[] = [
  'All',
  'Loans & Wealth',
  'Salary & Pay',
  'Retirement',
  'US Taxes',
  'Global Taxes',
  'Business',
];

const SUBCATEGORY_META: Record<
  Exclude<FinanceFilterCategory, 'All'>,
  { title: string; description: string }
> = {
  'Loans & Wealth': {
    title: 'Loans, Mortgages & Wealth Growth',
    description:
      'Amortize home mortgages and personal loans, evaluate refinancing or renting versus buying, and project compound investment returns.',
  },
  'Salary & Pay': {
    title: 'Salary, Paycheck & Compensation Converters',
    description:
      'Convert annual salaries to hourly rates, estimate net take-home paychecks, compare 1099 vs. W-2 offers, and compute overtime or pay raises.',
  },
  Retirement: {
    title: 'Retirement & Financial Independence (FIRE)',
    description:
      'Model 401(k) employer matching, Roth vs. Traditional tax treatment, IRS Required Minimum Distributions, and 4% safe withdrawal rates.',
  },
  'US Taxes': {
    title: 'US Federal, State & Self-Employment Taxes',
    description:
      'Calculate US federal income tax brackets, 50-state paycheck withholding, Schedule SE self-employment tax, and capital gains tax.',
  },
  'Global Taxes': {
    title: 'International Salary & Income Tax Calculators',
    description:
      'Estimate statutory net pay and tax deductions for the United Kingdom, Canada, India, Germany, France, Singapore, and the UAE.',
  },
  Business: {
    title: 'Business Pricing, Margin & Break-Even Tools',
    description:
      'Calculate gross margin, unit price markup, operating and net profit margins, and fixed-cost break-even volume.',
  },
};

export const FINANCE_TOOLS: FinanceToolRow[] = [
  // Loans & Wealth (8 tools)
  {
    id: 'mortgage-calculator',
    name: 'Mortgage Payment Calculator',
    description:
      'Calculate monthly mortgage principal, interest, property taxes, homeowners insurance, HOA fees, and PMI.',
    href: '/mortgage-calculator',
    category: 'Loans & Wealth',
    displayBadge: 'Mortgage',
    formulaNote: 'M = P[r(1+r)^n]/[(1+r)^n−1] + Tax + Ins + PMI',
    icon: Home,
    iconBg: 'bg-[#FFF0EE]',
    iconColor: 'text-[#E54D37]',
  },
  {
    id: 'loan-calculator',
    name: 'Loan Payment & Amortization Calculator',
    description:
      'Estimate monthly personal or auto loan payments, total interest cost, and full principal-and-interest payoff schedule.',
    href: '/loan-calculator',
    category: 'Loans & Wealth',
    displayBadge: 'Loans',
    formulaNote: 'Standard fixed-rate amortization schedule',
    icon: Home,
    iconBg: 'bg-[#EBF2FF]',
    iconColor: 'text-[#2457D6]',
  },
  {
    id: 'home-affordability-calculator',
    name: 'Home Affordability Calculator (28/36 Rule)',
    description:
      'Calculate the maximum house price you can comfortably afford based on gross income, down payment, and monthly debts.',
    href: '/finance/home-affordability-calculator',
    category: 'Loans & Wealth',
    displayBadge: 'Mortgage',
    formulaNote: 'Front-end ≤ 28% & Back-end DTI ≤ 36%',
    icon: Home,
    iconBg: 'bg-[#EBF2FF]',
    iconColor: 'text-[#2457D6]',
  },
  {
    id: 'refinance-calculator',
    name: 'Mortgage Refinance & Break-Even Calculator',
    description:
      'Compare your current mortgage against a new loan rate and closing costs to find your exact break-even month.',
    href: '/finance/refinance-calculator',
    category: 'Loans & Wealth',
    displayBadge: 'Mortgage',
    formulaNote: 'Break-Even Months = Closing Costs ÷ Monthly Savings',
    icon: Home,
    iconBg: 'bg-[#E6F6F1]',
    iconColor: 'text-[#16856B]',
  },
  {
    id: 'rent-vs-buy-calculator',
    name: 'Rent vs. Buy Home Comparison Calculator',
    description:
      'Compare the long-term net cost of renting versus buying a home including appreciation, maintenance, and equity.',
    href: '/finance/rent-vs-buy-calculator',
    category: 'Loans & Wealth',
    displayBadge: 'Mortgage',
    formulaNote: 'Net Buyer Cost vs. Renter Opportunity Portfolio',
    icon: Scale,
    iconBg: 'bg-[#F3EEFF]',
    iconColor: 'text-[#7C3AED]',
  },
  {
    id: 'compound-interest-calculator',
    name: 'Compound Interest Calculator',
    description:
      'See how your savings and monthly contributions grow over time with daily, monthly, quarterly, or annual compounding.',
    href: '/compound-interest-calculator',
    category: 'Loans & Wealth',
    displayBadge: 'Wealth',
    formulaNote: 'FV = P(1+r/n)^(nt) + PMT[((1+r/n)^(nt)−1)/(r/n)]',
    icon: TrendingUp,
    iconBg: 'bg-[#E6F6F1]',
    iconColor: 'text-[#16856B]',
  },
  {
    id: 'investment-growth-calculator',
    name: 'Investment Growth & Expense Ratio Drag Calculator',
    description:
      'Project long-term portfolio value, ROI, and CAGR while measuring how annual fund expense ratios impact your nest egg.',
    href: '/finance/investment-growth-calculator',
    category: 'Loans & Wealth',
    displayBadge: 'Wealth',
    formulaNote: 'Net Return = Gross CAGR − Expense Ratio %',
    icon: TrendingUp,
    iconBg: 'bg-[#EBF2FF]',
    iconColor: 'text-[#2457D6]',
  },
  {
    id: 'real-rate-of-return-calculator',
    name: 'Real Rate of Return (Inflation-Adjusted) Calculator',
    description:
      'Calculate your true purchasing-power growth rate after accounting for inflation using the exact Fisher equation.',
    href: '/finance/real-rate-of-return-calculator',
    category: 'Loans & Wealth',
    displayBadge: 'Wealth',
    formulaNote: 'r_real = [(1 + r_nominal) ÷ (1 + i_inflation)] − 1',
    icon: Percent,
    iconBg: 'bg-[#FFF6E5]',
    iconColor: 'text-[#D97706]',
  },

  // Salary & Pay (7 tools)
  {
    id: 'salary-calculator',
    name: 'Multi-Country Salary & Take-Home Pay Calculator',
    description:
      'Estimate gross-to-net take-home pay across the US, UK, Canada, Australia, and India with official statutory brackets.',
    href: '/salary-calculator',
    category: 'Salary & Pay',
    displayBadge: 'Global Pay',
    formulaNote: 'Net Pay = Gross − Income Tax − Social Contributions',
    icon: Coins,
    iconBg: 'bg-[#E6F6F1]',
    iconColor: 'text-[#16856B]',
  },
  {
    id: 'take-home-pay-calculator',
    name: 'Take-Home Paycheck Calculator',
    description:
      'Calculate net paycheck amount after taxes, 401(k) retirement contributions, HSA/FSA health deductions, and benefits.',
    href: '/finance/take-home-pay-calculator',
    category: 'Salary & Pay',
    displayBadge: 'Salary & Pay',
    formulaNote: 'Per-pay-period gross-to-net paycheck breakdown',
    icon: Coins,
    iconBg: 'bg-[#E6F6F1]',
    iconColor: 'text-[#16856B]',
  },
  {
    id: 'salary-to-hourly-calculator',
    name: 'Salary to Hourly Wage Converter',
    description:
      'Convert annual salary into hourly, daily, weekly, bi-weekly, and monthly pay rates adjusted for paid vacation and holidays.',
    href: '/finance/salary-to-hourly-calculator',
    category: 'Salary & Pay',
    displayBadge: 'Salary & Pay',
    formulaNote: 'Hourly = Annual Salary ÷ (Hours/Week × Weeks/Year)',
    icon: DollarSign,
    iconBg: 'bg-[#EBF2FF]',
    iconColor: 'text-[#2457D6]',
  },
  {
    id: '1099-vs-w2-calculator',
    name: '1099 Contractor vs. W-2 Employee Calculator',
    description:
      'Compare total after-tax take-home pay and find the exact break-even 1099 hourly or annual rate against a W-2 offer.',
    href: '/finance/1099-vs-w2-calculator',
    category: 'Salary & Pay',
    displayBadge: 'Salary & Pay',
    formulaNote: 'Includes 15.3% SE tax, QBI deduction & benefit value',
    icon: Briefcase,
    iconBg: 'bg-[#FFF6E5]',
    iconColor: 'text-[#D97706]',
  },
  {
    id: 'pay-raise-calculator',
    name: 'Pay Raise & Salary Increase Calculator',
    description:
      'See your new annual salary, hourly rate, and additional monthly income after a percentage or flat dollar raise.',
    href: '/finance/pay-raise-calculator',
    category: 'Salary & Pay',
    displayBadge: 'Salary & Pay',
    formulaNote: 'New Salary = Current × (1 + Raise % ÷ 100)',
    icon: TrendingUp,
    iconBg: 'bg-[#FFF6E5]',
    iconColor: 'text-[#D97706]',
  },
  {
    id: 'overtime-pay-calculator',
    name: 'Overtime Pay Calculator (FLSA 1.5x & 2x)',
    description:
      'Compute total gross earnings including regular hours, time-and-a-half overtime, and double-time shifts.',
    href: '/finance/overtime-pay-calculator',
    category: 'Salary & Pay',
    displayBadge: 'Salary & Pay',
    formulaNote: 'Gross = (Reg × R) + (OT × 1.5R) + (DT × 2R)',
    icon: Calculator,
    iconBg: 'bg-[#F3EEFF]',
    iconColor: 'text-[#7C3AED]',
  },
  {
    id: 'bonus-tax-calculator',
    name: 'Bonus Tax Withholding Calculator (US)',
    description:
      'Compare IRS 22% flat supplemental withholding against the aggregate paycheck method for performance and signing bonuses.',
    href: '/finance/bonus-tax-calculator',
    category: 'Salary & Pay',
    displayBadge: 'US Taxes',
    formulaNote: '22% flat supplemental vs. aggregate bracket method',
    icon: Percent,
    iconBg: 'bg-[#FFF0EE]',
    iconColor: 'text-[#E54D37]',
  },

  // Retirement (5 tools)
  {
    id: '401k-calculator',
    name: '401(k) Retirement Calculator',
    description:
      'Project your 401(k) balance at retirement with employer match caps, IRS contribution limits, and inflation adjustment.',
    href: '/finance/401k-calculator',
    category: 'Retirement',
    displayBadge: 'Retirement',
    formulaNote: 'Employee deferral + Employer match compounding',
    icon: PiggyBank,
    iconBg: 'bg-[#E6F6F1]',
    iconColor: 'text-[#16856B]',
  },
  {
    id: 'roth-vs-traditional-calculator',
    name: 'Roth vs. Traditional Calculator',
    description:
      'Compare after-tax retirement wealth between pre-tax Traditional and post-tax Roth contributions across tax brackets.',
    href: '/finance/roth-vs-traditional-calculator',
    category: 'Retirement',
    displayBadge: 'Retirement',
    formulaNote: 'Current marginal tax rate vs. retirement tax rate',
    icon: Scale,
    iconBg: 'bg-[#EBF2FF]',
    iconColor: 'text-[#2457D6]',
  },
  {
    id: 'rmd-calculator',
    name: 'Required Minimum Distribution (RMD) Calculator',
    description:
      'Calculate mandatory annual withdrawals using official IRS Publication 590-B Uniform Lifetime tables.',
    href: '/finance/rmd-calculator',
    category: 'Retirement',
    displayBadge: 'Retirement',
    formulaNote: 'RMD = Prior Dec 31 Balance ÷ IRS Life Expectancy Factor',
    icon: Calendar,
    iconBg: 'bg-[#FFF6E5]',
    iconColor: 'text-[#D97706]',
  },
  {
    id: 'safe-withdrawal-rate-calculator',
    name: 'Safe Withdrawal Rate (4% Rule) Calculator',
    description:
      'Simulate retirement portfolio longevity across 20 to 40 years using the 4% Safe Withdrawal Rate rule with inflation adjustment.',
    href: '/finance/safe-withdrawal-rate-calculator',
    category: 'Retirement',
    displayBadge: 'Retirement',
    formulaNote: 'Annual Withdrawal = Portfolio × SWR % (inflation-indexed)',
    icon: PiggyBank,
    iconBg: 'bg-[#E6F6F1]',
    iconColor: 'text-[#16856B]',
  },
  {
    id: 'fire-forecaster',
    name: 'FIRE Retirement Forecaster',
    description:
      'Model Financial Independence & Early Retirement (Traditional, Coast, and Barista FIRE) with safe withdrawal guardrails.',
    href: '/fire-forecaster',
    category: 'Retirement',
    displayBadge: 'Retirement',
    formulaNote: 'FIRE Number = Annual Expenses ÷ Safe Withdrawal Rate',
    icon: TrendingUp,
    iconBg: 'bg-[#FFF0EE]',
    iconColor: 'text-[#E54D37]',
  },

  // US Taxes (4 tools)
  {
    id: 'us-federal-income-tax-calculator',
    name: 'US Federal Income Tax Calculator',
    description:
      'Estimate federal tax liability, effective and marginal tax rates, standard deduction, and tax refund or amount owed.',
    href: '/finance/us-federal-income-tax-calculator',
    category: 'US Taxes',
    displayBadge: 'US Taxes',
    formulaNote: 'Progressive 7-bracket IRS calculation + credits',
    icon: Landmark,
    iconBg: 'bg-[#EBF2FF]',
    iconColor: 'text-[#2457D6]',
  },
  {
    id: 'us-state-take-home-calculator',
    name: 'US State Take-Home Paycheck Calculator',
    description:
      'Calculate net pay across all 50 US states after federal income tax, FICA, Medicare, and state tax brackets.',
    href: '/finance/us-state-take-home-calculator',
    category: 'US Taxes',
    displayBadge: 'Paycheck',
    formulaNote: 'Federal + FICA (7.65%) + 50-state tax tables',
    icon: DollarSign,
    iconBg: 'bg-[#E6F6F1]',
    iconColor: 'text-[#16856B]',
  },
  {
    id: 'self-employment-tax-calculator',
    name: 'Self-Employment Tax Calculator',
    description:
      'Compute 15.3% Social Security and Medicare SE tax, half-SE deduction, and quarterly IRS estimated payments.',
    href: '/finance/self-employment-tax-calculator',
    category: 'US Taxes',
    displayBadge: 'US Taxes',
    formulaNote: 'SE Tax = Net Profit × 92.35% × 15.3%',
    icon: FileText,
    iconBg: 'bg-[#F3EEFF]',
    iconColor: 'text-[#7C3AED]',
  },
  {
    id: 'capital-gains-tax-calculator',
    name: 'Capital Gains Tax Calculator (US)',
    description:
      'Calculate short-term and long-term capital gains tax, 3.8% Net Investment Income Tax (NIIT), and net sale proceeds.',
    href: '/finance/capital-gains-tax-calculator',
    category: 'US Taxes',
    displayBadge: 'Investments',
    formulaNote: '0% / 15% / 20% LTCG brackets + 3.8% NIIT',
    icon: TrendingUp,
    iconBg: 'bg-[#E6F6F1]',
    iconColor: 'text-[#16856B]',
  },

  // Global Taxes (10 tools)
  {
    id: 'uk-paye-calculator',
    name: 'UK PAYE Income Tax & National Insurance Calculator',
    description:
      'Calculate UK take-home pay, Personal Allowance taper, Class 1 NI, student loans, and Scottish tax bands.',
    href: '/finance/uk-paye-calculator',
    category: 'Global Taxes',
    displayBadge: 'United Kingdom',
    formulaNote: 'HMRC Personal Allowance (£12,570) + PAYE + NI',
    icon: Globe,
    iconBg: 'bg-[#EBF2FF]',
    iconColor: 'text-[#2457D6]',
  },
  {
    id: 'canada-income-tax-calculator',
    name: 'Canada Federal & Provincial Income Tax Calculator',
    description:
      'Estimate Canadian net income after federal brackets, provincial tax, CPP/QPP, and EI premiums.',
    href: '/finance/canada-income-tax-calculator',
    category: 'Global Taxes',
    displayBadge: 'Canada',
    formulaNote: 'CRA federal + provincial brackets + CPP & EI',
    icon: Globe,
    iconBg: 'bg-[#FFF0EE]',
    iconColor: 'text-[#E54D37]',
  },
  {
    id: 'india-income-tax-calculator',
    name: 'India Income Tax Calculator (New vs. Old Regime)',
    description:
      'Compare New Regime and Old Regime tax slabs, Section 87A rebate, standard deduction, and 4% health & education cess.',
    href: '/finance/india-income-tax-calculator',
    category: 'Global Taxes',
    displayBadge: 'India',
    formulaNote: 'Section 115BAC New Regime vs. Old Regime slabs',
    icon: Globe,
    iconBg: 'bg-[#FFF6E5]',
    iconColor: 'text-[#D97706]',
  },
  {
    id: 'in-hand-salary-calculator',
    name: 'India In-Hand Salary Calculator (CTC to Net)',
    description:
      'Break down annual CTC into monthly in-hand take-home pay after EPF, gratuity, professional tax, and income tax.',
    href: '/finance/in-hand-salary-calculator',
    category: 'Global Taxes',
    displayBadge: 'India',
    formulaNote: 'Monthly In-Hand = Gross − EPF − PT − TDS',
    icon: Coins,
    iconBg: 'bg-[#E6F6F1]',
    iconColor: 'text-[#16856B]',
  },
  {
    id: 'hra-exemption-calculator',
    name: 'HRA Tax Exemption Calculator (India)',
    description:
      'Calculate tax-exempt House Rent Allowance under Section 10(13A) for metro (50%) and non-metro (40%) cities.',
    href: '/finance/hra-exemption-calculator',
    category: 'Global Taxes',
    displayBadge: 'India',
    formulaNote: 'Min of: Actual HRA, Rent − 10% Basic, 50%/40% Basic',
    icon: Home,
    iconBg: 'bg-[#F3EEFF]',
    iconColor: 'text-[#7C3AED]',
  },
  {
    id: 'india-capital-gains-tax-calculator',
    name: 'India Capital Gains Tax Calculator (STCG & LTCG)',
    description:
      'Calculate listed equity, mutual fund, and real estate short-term and long-term capital gains tax.',
    href: '/finance/india-capital-gains-tax-calculator',
    category: 'Global Taxes',
    displayBadge: 'India',
    formulaNote: 'Sec 111A STCG & Sec 112A LTCG exemption rules',
    icon: TrendingUp,
    iconBg: 'bg-[#E6F6F1]',
    iconColor: 'text-[#16856B]',
  },
  {
    id: 'germany-income-tax-calculator',
    name: 'Germany Brutto-Netto Income Tax Calculator',
    description:
      'Compute German net salary after progressive income tax (§32a EStG), solidarity surcharge, and social insurance.',
    href: '/finance/germany-income-tax-calculator',
    category: 'Global Taxes',
    displayBadge: 'Germany',
    formulaNote: 'Lohnsteuer + RV/KV/AV/PV statutory contributions',
    icon: Globe,
    iconBg: 'bg-[#FFF6E5]',
    iconColor: 'text-[#D97706]',
  },
  {
    id: 'france-income-tax-calculator',
    name: 'France Family Quotient Income Tax Calculator',
    description:
      'Calculate French net pay using household quotient familial parts, CSG/CRDS social charges, and income tax bands.',
    href: '/finance/france-income-tax-calculator',
    category: 'Global Taxes',
    displayBadge: 'France',
    formulaNote: 'Quotient familial parts + CSG/CRDS deductions',
    icon: Globe,
    iconBg: 'bg-[#EBF2FF]',
    iconColor: 'text-[#2457D6]',
  },
  {
    id: 'singapore-income-tax-calculator',
    name: 'Singapore Resident Income Tax & CPF Calculator',
    description:
      'Estimate Singapore resident income tax and age-banded Central Provident Fund (CPF) employee and employer contributions.',
    href: '/finance/singapore-income-tax-calculator',
    category: 'Global Taxes',
    displayBadge: 'Singapore',
    formulaNote: 'IRAS progressive resident rates + CPF age bands',
    icon: Globe,
    iconBg: 'bg-[#E6F6F1]',
    iconColor: 'text-[#16856B]',
  },
  {
    id: 'uae-income-tax-calculator',
    name: 'UAE Salary & End-of-Service Gratuity Calculator',
    description:
      'Calculate tax-free UAE salary take-home pay and statutory end-of-service gratuity benefits under UAE Labour Law.',
    href: '/finance/uae-income-tax-calculator',
    category: 'Global Taxes',
    displayBadge: 'UAE',
    formulaNote: '21 days/yr (first 5 yrs) + 30 days/yr (5+ yrs)',
    icon: Globe,
    iconBg: 'bg-[#F3EEFF]',
    iconColor: 'text-[#7C3AED]',
  },

  // Business (4 tools)
  {
    id: 'margin-calculator',
    name: 'Gross Margin Calculator',
    description:
      'Calculate gross profit margin percentage, unit profit, and markup equivalent from cost and selling price.',
    href: '/finance/margin-calculator',
    category: 'Business',
    displayBadge: 'Business',
    formulaNote: 'Gross Margin % = ((Price − Cost) ÷ Price) × 100',
    icon: BarChart3,
    iconBg: 'bg-[#F3EEFF]',
    iconColor: 'text-[#7C3AED]',
  },
  {
    id: 'markup-calculator',
    name: 'Price Markup Calculator',
    description:
      'Determine selling price and gross margin when applying a percentage markup over unit cost.',
    href: '/finance/markup-calculator',
    category: 'Business',
    displayBadge: 'Business',
    formulaNote: 'Markup % = ((Price − Cost) ÷ Cost) × 100',
    icon: Percent,
    iconBg: 'bg-[#FFF6E5]',
    iconColor: 'text-[#D97706]',
  },
  {
    id: 'profit-margin-calculator',
    name: 'Net & Operating Profit Margin Calculator',
    description:
      'Analyze gross, operating, and net profit margins from revenue, COGS, operating expenses, interest, and taxes.',
    href: '/finance/profit-margin-calculator',
    category: 'Business',
    displayBadge: 'Business',
    formulaNote: 'Net Margin % = (Net Income ÷ Revenue) × 100',
    icon: TrendingUp,
    iconBg: 'bg-[#E6F6F1]',
    iconColor: 'text-[#16856B]',
  },
  {
    id: 'break-even-calculator',
    name: 'Break-Even Point Calculator',
    description:
      'Find the exact number of units and revenue required to cover fixed and variable business costs.',
    href: '/finance/break-even-calculator',
    category: 'Business',
    displayBadge: 'Business',
    formulaNote: 'Break-Even Units = Fixed Costs ÷ (Price − Variable Cost)',
    icon: Scale,
    iconBg: 'bg-[#EBF2FF]',
    iconColor: 'text-[#2457D6]',
  },
];

const WHICH_FINANCE_TOOL_GUIDE = [
  {
    title: 'Mortgage vs. Loan Payment vs. Home Affordability vs. Rent vs. Buy',
    summary:
      'Use the Mortgage Payment Calculator when you know a home price and want full monthly PITI (Principal, Interest, Property Tax, Insurance, and PMI). Use the Loan Payment Calculator for auto, student, or personal loans without property tax escrows. Use the Home Affordability Calculator before house-hunting to find your maximum purchase price under the 28/36 DTI rule, or Rent vs. Buy to compare long-term net equity against renting.',
    recommendedHref: '/mortgage-calculator',
    recommendedLabel: 'Open Mortgage Payment Calculator',
  },
  {
    title: 'Take-Home Pay vs. Salary-to-Hourly vs. 1099 vs. W-2',
    summary:
      'Use Take-Home Pay (or US State Take-Home Paycheck) to see what lands in your bank account each pay period after taxes, 401(k), and insurance deductions. Use Salary to Hourly when converting an annual salary offer into an hourly, weekly, or daily rate adjusted for paid time off. Use 1099 vs. W-2 when comparing an independent contractor rate against a salaried W-2 job with employer benefits.',
    recommendedHref: '/finance/take-home-pay-calculator',
    recommendedLabel: 'Open Take-Home Pay Calculator',
  },
  {
    title: '401(k) vs. Roth vs. Traditional vs. Safe Withdrawal Rate',
    summary:
      'Use the 401(k) Calculator to project your retirement balance with employer matching caps. Use Roth vs. Traditional to decide whether paying taxes now (Roth) or deferring taxes until retirement (Traditional) leaves you with more after-tax wealth. Once near retirement, use the Safe Withdrawal Rate (4% Rule) or RMD Calculator to plan sustainable annual withdrawals.',
    recommendedHref: '/finance/401k-calculator',
    recommendedLabel: 'Open 401(k) Calculator',
  },
  {
    title: 'Compound Interest vs. Investment Growth vs. Real Rate of Return',
    summary:
      'Use Compound Interest to model savings accounts, CDs, or monthly deposits across daily, monthly, or annual compounding frequencies. Use Investment Growth & Expense Ratio Drag to see how annual fund fees (e.g., 0.05% vs. 0.85%) impact long-term portfolio growth. Use Real Rate of Return to strip out inflation via the Fisher equation and see true purchasing-power gains.',
    recommendedHref: '/compound-interest-calculator',
    recommendedLabel: 'Open Compound Interest Calculator',
  },
];

const MATCHING_FINANCE_GUIDES = [
  {
    title: 'How to Calculate Loan Payments, Mortgage PITI & Total Interest',
    description:
      'Learn the exact monthly loan amortization formula, how PITI works on a mortgage, and how extra principal payments cut years off your loan.',
    href: '/guides/how-to-calculate-loan-and-mortgage-payments',
  },
  {
    title: 'How to Calculate Simple and Compound Interest Step by Step',
    description:
      'Compare simple vs. compound interest, understand compounding frequencies (daily, monthly, annual), and use the Rule of 72.',
    href: '/guides/how-to-calculate-compound-interest',
  },
  {
    title: 'How to Estimate 401(k) Retirement Growth & Employer Match',
    description:
      'Understand how employer 401(k) matching works, how pre-tax vs. Roth contributions grow, and how the 4% rule estimates retirement income.',
    href: '/guides/how-to-estimate-401k-and-retirement-growth',
  },
  {
    title: 'How to Calculate Net Take-Home Salary, Hourly Wage & Sales Tax',
    description:
      'Convert annual salary to hourly pay (based on 2,080 work hours), understand marginal vs. effective tax brackets, and reverse-calculate sales tax.',
    href: '/guides/how-to-calculate-net-salary-and-sales-tax',
  },
  {
    title: 'How to Calculate Discounts, Sale Price, Markup & Profit Margin',
    description:
      'Master retail and business pricing math: single and stacked discounts, reverse pre-sale price, and the difference between markup and gross margin.',
    href: '/guides/how-to-calculate-discounts-and-profit-margin',
  },
];

const RELATED_CATEGORIES = [
  {
    name: 'Business Calculators',
    href: '/finance/business',
    icon: BarChart3,
    iconBg: 'bg-[#F3EEFF]',
    iconColor: 'text-[#7C3AED]',
  },
  {
    name: 'Math Calculators',
    href: '/math',
    icon: Calculator,
    iconBg: 'bg-[#EBF2FF]',
    iconColor: 'text-[#2457D6]',
  },
  {
    name: 'Home & Construction',
    href: '/home-construction',
    icon: Home,
    iconBg: 'bg-[#E6F6F1]',
    iconColor: 'text-[#16856B]',
  },
  {
    name: 'Date & Time Calculators',
    href: '/date-time',
    icon: Calendar,
    iconBg: 'bg-[#FFF0F0]',
    iconColor: 'text-[#E11D48]',
  },
  {
    name: 'Unit Conversion',
    href: '/conversions',
    icon: ArrowLeftRight,
    iconBg: 'bg-[#EBF2FF]',
    iconColor: 'text-[#2457D6]',
  },
];

const FINANCE_FAQS = [
  {
    question: 'What is the difference between marginal and effective tax rate?',
    answer:
      'Your marginal tax rate is the percentage applied only to the last dollar you earn (your highest tax bracket). Your effective tax rate is the total income tax you pay divided by your total gross income, which is always lower than your marginal bracket because progressive tax systems tax earlier income slices at lower rates.',
  },
  {
    question: 'How is a monthly mortgage payment (PITI) calculated?',
    answer:
      'Monthly principal and interest (P&I) is calculated using the standard amortization formula: M = P × [r(1 + r)^n] ÷ [(1 + r)^n − 1], where P is the loan principal, r is the monthly interest rate (annual rate ÷ 12), and n is the total number of monthly payments (years × 12). Monthly property taxes, homeowners insurance, and PMI are added to form total PITI.',
  },
  {
    question: 'Should I choose a Roth or Traditional retirement account?',
    answer:
      'If you expect your tax rate in retirement to be higher than your current marginal rate, post-tax Roth contributions generally produce more after-tax wealth. If your current marginal tax rate is higher than what you expect to pay in retirement, pre-tax Traditional contributions usually leave you with a larger net balance.',
  },
  {
    question: 'How does compound interest work with recurring monthly contributions?',
    answer:
      'Compound interest earns returns on both your initial principal and previously accumulated interest. When you add recurring monthly contributions, each deposit starts its own compounding curve: FV = P(1 + r/n)^(nt) + PMT × [((1 + r/n)^(nt) − 1) ÷ (r/n)].',
  },
  {
    question: 'How are 1099 independent contractors taxed compared to W-2 employees?',
    answer:
      'Independent contractors (1099) pay both the employee and employer halves of Social Security and Medicare taxes (15.3% Self-Employment tax on 92.35% of net profit), though half of that SE tax is deductible from adjusted gross income and eligible sole proprietors may claim up to a 20% Qualified Business Income (QBI) deduction.',
  },
  {
    question: 'How do I convert an annual salary to an hourly wage?',
    answer:
      'Divide your annual gross salary by the number of paid hours worked in a year. For a standard full-time schedule of 40 hours per week across 52 weeks (2,080 hours), a $75,000 salary equals $75,000 ÷ 2,080 = $36.06 per hour.',
  },
];

export default function FinanceCategoryPageClient() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] =
    useState<FinanceFilterCategory>('All');

  const filteredTools = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return FINANCE_TOOLS.filter((tool) => {
      const matchesCat =
        selectedFilter === 'All' || tool.category === selectedFilter;
      const matchesQuery =
        !q ||
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q) ||
        tool.displayBadge.toLowerCase().includes(q) ||
        tool.formulaNote.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [searchQuery, selectedFilter]);

  const groupedSubcategories = useMemo(() => {
    const order: Exclude<FinanceFilterCategory, 'All'>[] = [
      'Loans & Wealth',
      'Salary & Pay',
      'Retirement',
      'US Taxes',
      'Global Taxes',
      'Business',
    ];
    return order
      .map((cat) => ({
        category: cat,
        meta: SUBCATEGORY_META[cat],
        tools: filteredTools.filter((t) => t.category === cat),
      }))
      .filter((group) => group.tools.length > 0);
  }, [filteredTools]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (filteredTools.length === 1) {
      router.push(filteredTools[0].href);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#152238]">
      {/* Category Header / Hero Section */}
      <section
        aria-labelledby="finance-category-heading"
        className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-b from-[#EAF2FF] via-[#F1F6FF] to-[#F5F7FA] pt-5 pb-6"
      >
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb: Home / Finance */}
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-1.5 text-xs sm:text-sm font-medium">
              <li>
                <Link
                  href="/"
                  className="text-[#2457D6] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] rounded-xs"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="text-slate-400">
                <ChevronRight className="w-3.5 h-3.5" />
              </li>
              <li aria-current="page" className="text-[#2457D6] font-semibold">
                Finance Calculators
              </li>
            </ol>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1 max-w-4xl">
              <div className="flex items-start gap-4">
                <div
                  className="w-16 h-16 rounded-2xl bg-[#DCE8FF] border border-[#C6DBFF] text-[#2457D6] flex items-center justify-center shrink-0 shadow-2xs"
                  aria-hidden="true"
                >
                  <Coins className="w-8 h-8 stroke-[2.2]" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/90 border border-[#C6DBFF] text-[#2457D6] text-xs font-bold mb-2">
                    <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{FINANCE_TOOLS.length} Verified Calculators</span>
                  </div>
                  <h1
                    id="finance-category-heading"
                    className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#152238]"
                  >
                    Finance, Tax &amp; Salary Calculators
                  </h1>
                  <p className="mt-2 text-sm sm:text-base text-slate-700 leading-relaxed max-w-3xl">
                    Choosing the right finance calculator depends on whether you are borrowing money, comparing job compensation, filing taxes, or projecting retirement wealth: use our Mortgage, Refinance, Home Affordability, and Loan calculators for debt and housing payments, Take-Home Pay and Salary-to-Hourly converters for paycheck planning, country-specific tax calculators for US, UK, Canada, India, Germany, France, Singapore, and UAE liabilities, or 401(k), Roth vs. Traditional, RMD, Safe Withdrawal Rate, and Compound Interest calculators for long-term investing.
                  </p>
                </div>
              </div>

              {/* Prominent Search Field */}
              <form
                onSubmit={handleSearchSubmit}
                role="search"
                aria-label="Find a finance calculator"
                className="mt-5 flex items-center bg-white rounded-xl border border-slate-200/90 shadow-xs p-1.5 focus-within:ring-2 focus-within:ring-[#2457D6] focus-within:border-[#2457D6] transition-all"
              >
                <label htmlFor="finance-category-search" className="sr-only">
                  Find a finance calculator
                </label>
                <div className="pl-3 pr-2 text-[#152238] flex items-center pointer-events-none">
                  <Search className="w-5 h-5" aria-hidden="true" />
                </div>
                <input
                  id="finance-category-search"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Find a finance calculator (e.g. mortgage, 401k, paycheck, UK tax, margin...)"
                  className="w-full py-2 px-2 text-sm sm:text-base text-[#152238] placeholder:text-slate-400 bg-transparent focus:outline-none"
                />
                <button
                  type="submit"
                  className="shrink-0 bg-[#2457D6] hover:bg-[#1d47b0] text-white font-semibold text-sm px-6 py-2.5 rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2457D6]"
                >
                  Search
                </button>
              </form>

              {/* Filter Controls with Exact Counts */}
              <div
                role="group"
                aria-label="Filter finance calculators by topic"
                className="mt-3.5 flex flex-wrap items-center gap-2"
              >
                {FINANCE_FILTERS.map((category) => {
                  const isActive = selectedFilter === category;
                  const count =
                    category === 'All'
                      ? FINANCE_TOOLS.length
                      : FINANCE_TOOLS.filter((t) => t.category === category)
                          .length;
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setSelectedFilter(category)}
                      aria-pressed={isActive}
                      className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] ${
                        isActive
                          ? 'bg-[#2457D6] text-white border-[#2457D6] shadow-2xs'
                          : 'bg-[#E2ECFC] hover:bg-[#D2E2FA] text-[#152238] border-[#C6DBFF] dark:bg-[#1E325C] dark:border-[#33528E] dark:text-[#F8FAFC] dark:hover:bg-[#284278]'
                      }`}
                    >
                      {category} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Decorative Finance Illustration */}
            <div
              aria-hidden="true"
              className="hidden xl:flex items-center justify-center relative w-64 h-44 shrink-0 select-none"
            >
              <div className="w-44 h-44 rounded-full bg-[#DCE8FF]/70 flex items-center justify-center relative">
                <div className="absolute -left-2 top-3 w-11 h-11 rounded-xl bg-[#16856B] text-white font-extrabold text-xl flex items-center justify-center shadow-sm -rotate-12">
                  $
                </div>
                <div className="absolute -left-5 bottom-8 w-11 h-10 rounded-xl bg-[#D1FAE5] text-[#16856B] font-extrabold text-sm flex items-center justify-center shadow-sm -rotate-6">
                  %
                </div>
                <div className="w-24 h-32 rounded-2xl bg-[#2457D6] p-2.5 shadow-md rotate-12 flex flex-col justify-between border-2 border-[#3B82F6]">
                  <div className="h-6 rounded-md bg-[#93C5FD]/90 w-full" />
                  <div className="grid grid-cols-3 gap-1.5">
                    <div className="h-3.5 rounded-xs bg-white/90" />
                    <div className="h-3.5 rounded-xs bg-white/90" />
                    <div className="h-3.5 rounded-xs bg-[#60A5FA]" />
                    <div className="h-3.5 rounded-xs bg-white/90" />
                    <div className="h-3.5 rounded-xs bg-white/90" />
                    <div className="h-3.5 rounded-xs bg-[#60A5FA]" />
                    <div className="h-3.5 rounded-xs bg-white/90" />
                    <div className="h-3.5 rounded-xs bg-white/90" />
                    <div className="h-3.5 rounded-xs bg-[#FBBF24]" />
                  </div>
                </div>
                <div className="absolute -right-3 top-12 w-11 h-11 rounded-xl bg-[#FBBF24] text-white font-extrabold text-lg flex items-center justify-center shadow-sm rotate-12">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-7 space-y-10">
        {/* "Which finance calculator should I use?" Guide */}
        <section
          aria-labelledby="which-finance-tool-heading"
          className="rounded-2xl bg-white border border-slate-200/90 p-5 sm:p-6 shadow-2xs"
        >
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-xl bg-[#EBF2FF] text-[#2457D6] flex items-center justify-center shrink-0">
              <Compass className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2
                id="which-finance-tool-heading"
                className="text-lg sm:text-xl font-extrabold text-[#152238]"
              >
                Which Finance Calculator Should I Use?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Compare key differences between our mortgage, salary, tax, and retirement calculators before entering your numbers.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {WHICH_FINANCE_TOOL_GUIDE.map((item) => (
              <div
                key={item.title}
                className="rounded-xl bg-[#F8FAFC] border border-slate-200/80 p-4 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[#152238]">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                    {item.summary}
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-200/60">
                  <Link
                    href={item.recommendedHref}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2457D6] hover:underline"
                  >
                    <span>{item.recommendedLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Grouped Tool Directory + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
          {/* Left Main Column: Grouped Finance Calculators */}
          <div className="lg:col-span-8 space-y-8">
            {groupedSubcategories.length > 0 ? (
              groupedSubcategories.map((group) => (
                <section
                  key={group.category}
                  aria-labelledby={`finance-subcat-${group.category}`}
                  className="space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-2.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <LayoutGrid
                          className="w-4 h-4 text-[#2457D6]"
                          aria-hidden="true"
                        />
                        <h2
                          id={`finance-subcat-${group.category}`}
                          className="text-lg sm:text-xl font-extrabold text-[#152238] tracking-tight"
                        >
                          {group.meta.title}
                        </h2>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                        {group.meta.description}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-[#2457D6] bg-[#EAF2FF] border border-[#C6DBFF] px-2.5 py-1 rounded-full shrink-0 self-start sm:self-auto">
                      {group.tools.length}{' '}
                      {group.tools.length === 1 ? 'Calculator' : 'Calculators'}
                    </span>
                  </div>

                  <div className="space-y-3" role="list">
                    {group.tools.map((tool) => {
                      const IconComponent = tool.icon;
                      return (
                        <div
                          key={tool.id}
                          role="listitem"
                          className="group rounded-xl bg-white border border-slate-200/90 px-4 py-3.5 hover:border-[#2457D6] hover:shadow-xs transition-all"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
                            <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                              <div
                                className={`w-12 h-12 rounded-xl ${tool.iconBg} ${tool.iconColor} flex items-center justify-center shrink-0`}
                                aria-hidden="true"
                              >
                                <IconComponent className="w-6 h-6" />
                              </div>
                              <div className="min-w-0">
                                <Link
                                  href={tool.href}
                                  className="text-base font-bold text-[#152238] group-hover:text-[#2457D6] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] rounded-xs"
                                >
                                  {tool.name}
                                </Link>
                                <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-snug">
                                  {tool.description}
                                </p>
                                <p className="text-[11px] font-mono text-slate-500 mt-1">
                                  {tool.formulaNote}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pl-15 sm:pl-0">
                              <span className="text-[11px] font-semibold text-slate-700 bg-[#EEF3FA] border border-slate-200/80 dark:bg-[#1E2E4F] dark:text-[#E2E8F0] dark:border-[#334E7D] px-2.5 py-1 rounded-md">
                                {tool.displayBadge}
                              </span>
                              <Link
                                href={tool.href}
                                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#2457D6] hover:text-[#1d47b0] whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] rounded-md py-1 px-1.5"
                              >
                                <span>Open calculator</span>
                                <ArrowRight
                                  className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                                  aria-hidden="true"
                                />
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              ))
            ) : (
              <div className="rounded-xl bg-white border border-slate-200 p-8 text-center">
                <p className="text-base font-bold text-[#152238]">
                  No matching finance calculators found
                </p>
                <p className="text-sm text-slate-600 mt-1">
                  Try clearing your search query or switching the filter back to
                  &ldquo;All&rdquo;.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedFilter('All');
                  }}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2457D6] text-white text-xs sm:text-sm font-semibold hover:bg-[#1d47b0] transition-colors cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>

          {/* Right Sidebar Column */}
          <aside
            aria-label="Matching guides and related categories"
            className="lg:col-span-4 space-y-5"
          >
            {/* Matching Finance Formula Guides */}
            <div className="rounded-2xl bg-white border border-slate-200/90 p-5 shadow-2xs">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <BookOpen
                  className="w-5 h-5 text-[#2457D6]"
                  aria-hidden="true"
                />
                <h2 className="text-base font-extrabold text-[#152238]">
                  Matching Finance Guides
                </h2>
              </div>

              <ul className="divide-y divide-slate-100 mt-1">
                {MATCHING_FINANCE_GUIDES.map((guide) => (
                  <li key={guide.href} className="py-3 first:pt-2 last:pb-0">
                    <Link
                      href={guide.href}
                      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] rounded-md"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs sm:text-sm font-bold text-[#152238] group-hover:text-[#2457D6] transition-colors">
                          {guide.title}
                        </span>
                        <ChevronRight
                          className="w-4 h-4 text-slate-400 group-hover:text-[#2457D6] group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {guide.description}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Related Calculator Categories */}
            <div className="rounded-2xl bg-white border border-slate-200/90 p-5 shadow-2xs">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <FolderOpen
                  className="w-5 h-5 text-[#2457D6]"
                  aria-hidden="true"
                />
                <h2 className="text-base font-extrabold text-[#152238]">
                  Related Calculator Categories
                </h2>
              </div>

              <ul className="divide-y divide-slate-100 mt-1">
                {RELATED_CATEGORIES.map((cat) => {
                  const IconComponent = cat.icon;
                  return (
                    <li key={cat.name}>
                      <Link
                        href={cat.href}
                        className="group flex items-center justify-between gap-3 py-2.5 hover:text-[#2457D6] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457D6] rounded-md"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-8 h-8 rounded-lg ${cat.iconBg} ${cat.iconColor} flex items-center justify-center shrink-0`}
                          >
                            <IconComponent
                              className="w-4 h-4"
                              aria-hidden="true"
                            />
                          </div>
                          <span className="text-xs sm:text-sm font-bold text-[#152238] group-hover:text-[#2457D6] truncate transition-colors">
                            {cat.name}
                          </span>
                        </div>
                        <ChevronRight
                          className="w-4 h-4 text-slate-400 group-hover:text-[#2457D6] group-hover:translate-x-0.5 transition-all shrink-0"
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Need a different calculator? CTA Box */}
            <div className="rounded-2xl bg-[#EAF2FF] border border-[#CFE0FF] p-5">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white text-[#D97706] flex items-center justify-center shrink-0 shadow-2xs">
                  <Lightbulb className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-[#152238]">
                    Need a different calculator?
                  </h2>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Browse all calculators across math, conversions, health, construction, and science.
                  </p>
                </div>
              </div>

              <Link
                href="/calculators"
                className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-[#2457D6] hover:bg-[#1d47b0] text-white text-xs sm:text-sm font-semibold py-2.5 px-4 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2457D6]"
              >
                <span>View All Calculators</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </aside>
        </div>

        {/* Frequently Asked Questions with Visible Answers */}
        <section
          id="faq"
          aria-labelledby="finance-faq-heading"
          className="rounded-2xl bg-white border border-slate-200/90 p-5 sm:p-6 shadow-2xs"
        >
          <div className="flex items-center gap-2.5 mb-4">
            <HelpCircle
              className="w-5 h-5 text-[#2457D6]"
              aria-hidden="true"
            />
            <div>
              <h2
                id="finance-faq-heading"
                className="text-lg sm:text-xl font-extrabold text-[#152238]"
              >
                Frequently Asked Questions About Finance &amp; Tax Calculators
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Direct answers to common questions on tax brackets, mortgage amortization, retirement accounts, and salary conversions.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FINANCE_FAQS.map((faq) => (
              <div
                key={faq.question}
                className="rounded-xl bg-[#F8FAFC] border border-slate-200/80 p-4 space-y-1.5"
              >
                <h3 className="text-sm sm:text-base font-bold text-[#152238]">
                  {faq.question}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
