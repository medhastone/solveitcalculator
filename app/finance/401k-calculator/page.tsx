import React from 'react';
import { Metadata } from 'next';
import CalculatorPageSystem from '@/components/calculator/CalculatorPageSystem';
import { CalculatorSystemData } from '@/lib/calculatorSystemData';
import FourOhOneKClient from './FourOhOneKClient';

export const metadata: Metadata = {
  title: '401(k) Calculator — Employer Match, IRS Limits & Retirement Growth | SolveItCalculator',
  description:
    'Calculate your 401(k) balance at retirement, employer match optimization, IRS Section 402(g) elective deferral limits ($23,500), age 50+ catch-up ($7,500), and SECURE 2.0 Super Catch-Up ($11,250 for ages 60–63).',
  alternates: {
    canonical: 'https://solveitcalculator.com/finance/401k-calculator',
  },
};

const SYSTEM_DATA: CalculatorSystemData = {
  id: '401k-calculator',
  slug: '401k-calculator',
  name: '401(k) Calculator',
  h1: '401(k) Retirement & Employer Match Calculator',
  category: 'finance',
  categoryName: 'Finance',
  categoryPath: '/finance',
  subcategory: 'retirement',
  subcategoryName: 'Retirement & Super',
  subcategoryPath: '/retirement-and-super',
  canonicalUrl: 'https://solveitcalculator.com/finance/401k-calculator',
  shortAnswer:
    'Forecast your 401(k) retirement balance, calculate employer matching contributions, and check 2025 IRS elective deferral limits ($23,500 base, $7,500 Age 50+ catch-up, and $11,250 SECURE 2.0 Super Catch-Up).',
  formula: {
    equation: 'FV = Balance₀(1 + r)ⁿ + (Employee + EmployerMatch) × [((1 + r)ⁿ − 1) ÷ r]',
    description:
      'Compounds your existing 401(k) balance plus annual employee deferrals and employer matching contributions over your remaining working years.',
    variables: [
      { symbol: 'FV', name: 'Projected Retirement Nest Egg', unit: 'USD ($)', description: 'Total 401(k) balance at retirement age.' },
      { symbol: 'r', name: 'Annual Rate of Return', unit: 'Percentage (%)', description: 'Expected annualized portfolio return.' },
    ],
    assumptions: ['Assumes 2025 IRS Section 402(g) elective deferral limits and SECURE 2.0 catch-up provisions.'],
  },
  workedExample: {
    title: 'Age 35 Saver Earning $100,000 with 6% Deferral + 4% Match',
    scenario: 'Saving 6% of a $100,000 salary with a 4% employer match and $45,000 starting balance at 7% annual return until age 65.',
    inputs: { Salary: '$100,000', Deferral: '6% + 4% Match' },
    stepByStep: [
      'Annual employee contribution = $6,000; Employer match = $4,000 (Total = $10,000/yr).',
      'Compound $45,000 initial balance and $10,000 annual additions over 30 years at 7%.',
      'Projected retirement balance at age 65 = $1,318,450.',
    ],
    finalResult: '$1,318,450 Projected 401(k) Balance',
    interpretation: 'Capturing the full employer match adds over $375,000 in free compounded retirement wealth.',
  },
  howToUse: [
    'Enter your current age, target retirement age, and annual salary.',
    'Enter your current 401(k) balance and employee contribution percentage.',
    'Configure your employer match formula and expected annual return.',
    'Review your projected retirement balance, employer match value, and IRS cap status.',
  ],
  howItIsCalculated: [
    'Applies monthly compound interest to your starting balance, employee contributions, and employer matching funds.',
  ],
  whenToUse: ['When choosing your 401(k) deferral rate or verifying you capture 100% of your employer match.'],
  limitations: ['Future investment returns and tax brackets vary over multi-decade horizons.'],
  sourceReference: {
    organization: 'Internal Revenue Service (IRS)',
    standardName: 'IRC Section 401(k) & Section 402(g) Limits',
    citation: 'IRS Notice 2024-80',
    versionOrDate: 'Verified 2025',
  },
  relatedToolIds: ['roth-vs-traditional-calculator', 'rmd-calculator'],
  relatedConversionPaths: [
    { label: 'Roth vs. Traditional Calculator', path: '/finance/roth-vs-traditional-calculator' },
    { label: 'RMD Calculator', path: '/finance/rmd-calculator' },
    { label: 'Compound Interest Calculator', path: '/compound-interest-calculator' },
    { label: 'Take-Home Pay Calculator', path: '/finance/take-home-pay-calculator' },
  ],
  relatedGuidePaths: [{ title: 'Roth vs Traditional Calculator', path: '/finance/roth-vs-traditional-calculator' }],
  faqs: [
    {
      question: 'What is the 2025 401(k) contribution limit?',
      answer:
        'For 2025, the employee elective deferral limit is $23,500. Workers aged 50 and older can contribute an additional $7,500 catch-up ($31,000 total), and workers aged 60–63 qualify for the SECURE 2.0 Super Catch-Up of $11,250 ($34,750 total).',
    },
    {
      question: 'Does my employer match count toward the $23,500 limit?',
      answer:
        'No. The $23,500 cap applies only to your employee elective deferrals. Combined employee and employer contributions are governed by the higher Section 415(c) overall limit ($70,000 in 2025 before catch-up).',
    },
    {
      question: 'How much should I contribute to my 401(k)?',
      answer:
        'At a minimum, contribute enough to capture 100% of your employer match—otherwise you leave guaranteed 50% to 100% return on the table. Many retirement planners target 15% of gross income including employer match.',
    },
    {
      question: 'Should I choose Traditional pre-tax or Roth 401(k) contributions?',
      answer:
        'Choose Traditional 401(k) if you expect your tax rate in retirement to be lower than your current marginal rate. Choose Roth 401(k) if you expect higher tax rates later or want tax-free withdrawals in retirement.',
    },
  ],
};

export default function FourOhOneKCalculatorPage() {
  return (
    <CalculatorPageSystem data={SYSTEM_DATA}>
      <FourOhOneKClient />
    </CalculatorPageSystem>
  );
}
