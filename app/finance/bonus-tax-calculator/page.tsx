import React from 'react';
import { Metadata } from 'next';
import CalculatorPageSystem from '@/components/calculator/CalculatorPageSystem';
import { CalculatorSystemData } from '@/lib/calculatorSystemData';
import BonusTaxClient from './BonusTaxClient';

export const metadata: Metadata = {
  title: 'Bonus Tax Calculator (2025 IRS 22% Flat Supplemental vs Aggregate Method) | SolveItCalculator',
  description:
    'Calculate your net bonus paycheck after the 22% IRS flat supplemental withholding rate (37% over $1M), FICA ($176,100 Social Security cap), and state supplemental tax. Compares paycheck withholding vs actual tax liability.',
  alternates: {
    canonical: 'https://solveitcalculator.com/finance/bonus-tax-calculator',
  },
};

const SYSTEM_DATA: CalculatorSystemData = {
  id: 'bonus-tax-calculator',
  slug: 'bonus-tax-calculator',
  name: 'Bonus Tax Calculator',
  h1: 'US Bonus Tax & Supplemental Withholding Calculator (2025)',
  category: 'finance',
  categoryName: 'Finance',
  categoryPath: '/finance',
  subcategory: 'salary',
  subcategoryName: 'Salary & Payroll',
  subcategoryPath: '/finance/salary',
  canonicalUrl: 'https://solveitcalculator.com/finance/bonus-tax-calculator',
  shortAnswer:
    'Calculate your net bonus check after federal supplemental withholding (22% flat rate up to $1M; 37% above $1M), FICA taxes (with automatic $176,100 Social Security cap tracking), state supplemental rates, and 401(k) deferrals. Explains whether the 22% flat withholding creates a refund or balance due at April tax filing.',
  formula: {
    equation: 'Net_{Bonus} = Bonus − Deferral_{401k} − Withholding_{Fed(22\\%/37\\%)} − FICA − State_{Supp}',
    description:
      'Applies IRS Publication 15 (Circular E) Section 7 rules for supplemental wages, checks remaining room under the $176,100 Social Security wage base after your regular salary, and compares paycheck withholding against actual marginal Form 1040 tax.',
    variables: [
      { symbol: '22%', name: 'IRS Flat Supplemental Rate', unit: 'Up to $1,000,000', description: 'Standard federal optional flat withholding rate on bonuses under $1M.' },
      { symbol: '37%', name: 'Mandatory Million-Dollar Rate', unit: 'Excess over $1,000,000', description: 'Mandatory withholding rate on supplemental wages exceeding $1M in a calendar year.' },
    ],
    assumptions: ['401(k) deferrals from a bonus reduce federal and state income tax withholding but remain subject to FICA taxes.'],
  },
  workedExample: {
    title: '$20,000 Bonus on a $115,000 Salary in California (6% 401k Deferral)',
    scenario: 'A single California employee earning $115,000 receives a $20,000 performance bonus and defers 6% ($1,200) into a Traditional 401(k).',
    inputs: { 'Gross Bonus': '$20,000', 'Base Salary': '$115,000', 'State': 'California (10.23% bonus rate + 1.2% SDI)' },
    stepByStep: [
      'Taxable Bonus after $1,200 401(k) deferral = $18,800.',
      'Federal Flat 22% Withholding = $18,800 × 22% = $4,136.00 (Actual marginal tax at 24% bracket is $4,512.00).',
      'FICA on $20,000 = $1,240 Social Security (6.2%) + $290 Medicare (1.45%) = $1,530.00.',
      'California Supplemental (10.23% on $18,800) + CA SDI (1.2% on $20,000) = $2,163.24.',
      'Net Bonus Check In-Hand = $20,000 − $1,200 − $4,136 − $1,530 − $2,163.24 = $10,970.76.',
    ],
    finalResult: '$10,970.76 Net Bonus Check | $376 Under-Withheld vs 24% Marginal Bracket',
    interpretation: 'Because the 22% flat withholding is 2% lower than the taxpayer’s 24% marginal bracket, $376 is reconciled when filing Form 1040.',
  },
  howToUse: [
    'Enter your gross bonus amount and your regular annual base salary.',
    'Select your state, filing status, and whether your employer uses the Flat 22% Supplemental or Aggregate method.',
    'Compare Federal Withheld Today vs Actual Marginal Tax to see if your bonus will boost your refund or leave a small balance at filing.',
  ],
  howItIsCalculated: [
    'Applies 22% flat federal withholding up to $1M and 37% above $1M.',
    'Computes exact incremental Form 1040 tax by running the #30 Federal Tax engine with and without the bonus.',
  ],
  whenToUse: ['When receiving an annual performance bonus, signing bonus, or sales commission check.'],
  limitations: ['RSU vestings follow similar supplemental withholding rules but do not allow 401(k) deferrals directly from shares.'],
  sourceReference: {
    organization: 'Internal Revenue Service (IRS) & State Revenue Agencies',
    standardName: 'IRS Publication 15 (Circular E), Employer’s Tax Guide — Section 7 Supplemental Wages',
    citation: 'https://www.irs.gov/publications/p15',
    versionOrDate: 'Verified October 2025',
  },
  relatedToolIds: ['us-federal-income-tax-calculator', 'us-state-take-home-calculator', '401k-calculator'],
  relatedConversionPaths: [
    { label: 'US Federal Income Tax Calculator', path: '/finance/us-federal-income-tax-calculator' },
    { label: 'US State Take-Home Calculator', path: '/finance/us-state-take-home-calculator' },
    { label: '401(k) Calculator', path: '/finance/401k-calculator' },
  ],
  relatedGuidePaths: [{ title: 'Pay Raise Calculator', path: '/finance/pay-raise-calculator' }],
  faqs: [
    {
      question: 'Are bonuses taxed at a higher rate than regular salary?',
      answer: 'No. On your annual tax return, bonuses are taxed as ordinary income at the exact same marginal bracket as your salary. They only appear to be taxed differently on payday because employers use the flat 22% supplemental withholding rule (plus state supplemental rates like California’s 10.23%). Any difference between the flat withholding and your actual tax bracket is refunded or settled when you file your tax return.',
    },
  ],
};

export default function BonusTaxPage() {
  return (
    <CalculatorPageSystem data={SYSTEM_DATA}>
      <BonusTaxClient />
    </CalculatorPageSystem>
  );
}
