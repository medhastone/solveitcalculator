'use client';

import React from 'react';
import CategoryHubPageClient, {
  CategoryHubConfig,
} from '@/components/CategoryHubPageClient';

const RETIREMENT_AND_SUPER_CONFIG: CategoryHubConfig = {
  id: 'retirement-and-super',
  breadcrumbLabel: 'Retirement & Super',
  parentBreadcrumb: { label: 'Finance', href: '/finance' },
  title: 'Retirement & Super Calculators',
  shortTitle: 'Retirement',
  introduction:
    'Plan your long-term financial independence with clarity. Calculate 401(k) employer matches, Roth vs. Traditional tax trade-offs, Required Minimum Distributions (RMDs), and safe withdrawal rates.',
  searchPlaceholder: 'Find a retirement calculator (e.g. 401k, Roth, RMD, FIRE...)',
  headerIconName: 'piggy-bank',
  heroBadgeTopLeft: '401k',
  heroBadgeBottomLeft: '4%',
  filters: [
    'All',
    '401(k) & Employer Match',
    'Roth vs. Traditional',
    'RMDs & Withdrawals',
    'FIRE & Independence',
    'Compound Growth',
  ],
  tools: [
    {
      id: '401k-calculator',
      name: '401(k) Retirement Calculator',
      description:
        'Project your 401(k) balance at retirement with employer match caps, IRS contribution limits, catch-up rules, and inflation adjustment.',
      href: '/finance/401k-calculator',
      category: '401(k) & Employer Match',
      displayBadge: '401(k) & Match',
      iconName: 'piggy-bank',
      iconBg: 'bg-[#E6F6F1]',
      iconColor: 'text-[#16856B]',
      isPopular: true,
    },
    {
      id: 'roth-vs-traditional-calculator',
      name: 'Roth vs. Traditional Retirement Calculator',
      description:
        'Compare after-tax retirement wealth between pre-tax Traditional and post-tax Roth contributions at your current and expected retirement tax rates.',
      href: '/finance/roth-vs-traditional-calculator',
      category: 'Roth vs. Traditional',
      displayBadge: 'Roth vs. Traditional',
      iconName: 'scale',
      iconBg: 'bg-[#EBF2FF]',
      iconColor: 'text-[#2457D6]',
      isPopular: true,
    },
    {
      id: 'rmd-calculator',
      name: 'Required Minimum Distribution (RMD) Calculator',
      description:
        'Calculate mandatory annual withdrawals using official IRS Publication 590-B Uniform Lifetime and Joint Life tables.',
      href: '/finance/rmd-calculator',
      category: 'RMDs & Withdrawals',
      displayBadge: 'RMD Rules',
      iconName: 'calendar',
      iconBg: 'bg-[#FFF6E5]',
      iconColor: 'text-[#D97706]',
      isPopular: true,
    },
    {
      id: 'safe-withdrawal-rate-calculator',
      name: 'Safe Withdrawal Rate (4% Rule) Calculator',
      description:
        'Simulate retirement portfolio longevity across 20 to 40 years with inflation-adjusted annual withdrawals.',
      href: '/finance/safe-withdrawal-rate-calculator',
      category: 'RMDs & Withdrawals',
      displayBadge: 'Withdrawals',
      iconName: 'trending-up',
      iconBg: 'bg-[#E6F6F1]',
      iconColor: 'text-[#16856B]',
      isPopular: true,
    },
    {
      id: 'fire-forecaster',
      name: 'FIRE Forecaster & Financial Independence Engine',
      description:
        'Calculate your Financial Independence target number, years to retirement, and Lean, Regular, or Fat FIRE trajectory.',
      href: '/fire-forecaster',
      category: 'FIRE & Independence',
      displayBadge: 'FIRE Engine',
      iconName: 'flame',
      iconBg: 'bg-[#FFF0EE]',
      iconColor: 'text-[#E54D37]',
      isPopular: true,
    },
    {
      id: 'compound-interest-calculator',
      name: 'Compound Interest & Nest Egg Calculator',
      description:
        'See how initial retirement savings and monthly contributions grow over decades with compound interest.',
      href: '/compound-interest-calculator',
      category: 'Compound Growth',
      displayBadge: 'Compound Growth',
      iconName: 'trending-up',
      iconBg: 'bg-[#EBF2FF]',
      iconColor: 'text-[#2457D6]',
      isPopular: true,
    },
    {
      id: 'investment-growth-calculator',
      name: 'Investment Growth & Expense Ratio Drag Calculator',
      description:
        'Project long-term retirement portfolio value and measure how annual fund expense ratios impact your final nest egg.',
      href: '/finance/investment-growth-calculator',
      category: 'Compound Growth',
      displayBadge: 'Investments',
      iconName: 'bar-chart',
      iconBg: 'bg-[#F3EEFF]',
      iconColor: 'text-[#7C3AED]',
    },
    {
      id: 'real-rate-of-return-calculator',
      name: 'Real Rate of Return (Inflation-Adjusted) Calculator',
      description:
        'Calculate your true purchasing-power growth rate after accounting for inflation using the exact Fisher equation.',
      href: '/finance/real-rate-of-return-calculator',
      category: 'Compound Growth',
      displayBadge: 'Purchasing Power',
      iconName: 'percent',
      iconBg: 'bg-[#FFF6E5]',
      iconColor: 'text-[#D97706]',
    },
    {
      id: 'us-federal-income-tax-calculator',
      name: 'US Federal Income Tax & Pre-Tax Deduction Calculator',
      description:
        'See how pre-tax 401(k) and HSA contributions reduce your Adjusted Gross Income (AGI) and current federal tax bill.',
      href: '/finance/us-federal-income-tax-calculator',
      category: '401(k) & Employer Match',
      displayBadge: 'Tax Savings',
      iconName: 'landmark',
      iconBg: 'bg-[#EBF2FF]',
      iconColor: 'text-[#2457D6]',
    },
  ],
  relatedCategories: [
    {
      name: 'Finance Calculators',
      href: '/finance',
      iconName: 'coins',
      iconBg: 'bg-[#FFF6E5]',
      iconColor: 'text-[#D97706]',
    },
    {
      name: 'Business Calculators',
      href: '/finance/business',
      iconName: 'bar-chart',
      iconBg: 'bg-[#F3EEFF]',
      iconColor: 'text-[#7C3AED]',
    },
    {
      name: 'Math Calculators',
      href: '/math',
      iconName: 'calculator',
      iconBg: 'bg-[#EBF2FF]',
      iconColor: 'text-[#2457D6]',
    },
    {
      name: 'Date & Time Calculators',
      href: '/date-time',
      iconName: 'calendar',
      iconBg: 'bg-[#FFF0F0]',
      iconColor: 'text-[#E11D48]',
    },
    {
      name: 'Health & Fitness Calculators',
      href: '/health-fitness',
      iconName: 'heart',
      iconBg: 'bg-[#E6F6F1]',
      iconColor: 'text-[#16856B]',
    },
    {
      name: 'Home & Construction',
      href: '/home-construction',
      iconName: 'home',
      iconBg: 'bg-[#E6F6F1]',
      iconColor: 'text-[#16856B]',
    },
  ],
  chooseGuideHeading: 'How to choose the right retirement calculator',
  chooseSteps: [
    {
      step: 1,
      title: 'Start with employer matching',
      description:
        'Use the 401(k) Calculator first to ensure you are contributing enough to capture 100% of your employer match.',
    },
    {
      step: 2,
      title: 'Compare tax treatments',
      description:
        'Use the Roth vs. Traditional Calculator to compare paying taxes now versus paying taxes in retirement.',
    },
    {
      step: 3,
      title: 'Open the calculator',
      description:
        'Select the retirement accumulation or withdrawal calculator from the list above.',
    },
    {
      step: 4,
      title: 'Plan sustainable withdrawals',
      description:
        'Check the Safe Withdrawal Rate and RMD calculators to estimate sustainable retirement income.',
    },
  ],
  faqs: [
    {
      question: 'What is "money left on the table" in a 401(k)?',
      answer:
        'If your employer matches contributions up to a certain percentage of your salary (for example, 100% match up to 4% of pay) and you contribute less than that cap, you forfeit free employer contributions. Our 401(k) Calculator shows the exact dollar amount of unclaimed match.',
    },
    {
      question: 'When do Required Minimum Distributions (RMDs) start?',
      answer:
        'Under the SECURE 2.0 Act, RMDs begin at age 73 for individuals born between 1951 and 1959, and at age 75 for individuals born in 1960 or later.',
    },
    {
      question: 'How does the 4% Safe Withdrawal Rate rule work?',
      answer:
        'Based on the Trinity Study, the 4% rule states that withdrawing 4% of your initial retirement portfolio in year one—and adjusting that dollar amount for inflation each subsequent year—historically sustained a balanced portfolio for at least 30 years.',
    },
    {
      question: 'Do Roth IRAs and Roth 401(k)s have Required Minimum Distributions?',
      answer:
        'Original owners of Roth IRAs are not subject to lifetime RMDs, and starting in 2024 under SECURE 2.0, designated Roth 401(k) accounts are also exempt from lifetime RMDs for the original account owner.',
    },
  ],
};

export default function RetirementAndSuperClient() {
  return <CategoryHubPageClient config={RETIREMENT_AND_SUPER_CONFIG} />;
}
