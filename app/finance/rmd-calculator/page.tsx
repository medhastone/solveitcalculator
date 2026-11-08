import React from 'react';
import type { Metadata } from 'next';
import CalculatorPageSystem from '@/components/calculator/CalculatorPageSystem';
import { CalculatorSystemData } from '@/lib/calculatorSystemData';
import RmdCalculatorClient from './RmdCalculatorClient';

export const metadata: Metadata = {
  title: 'RMD Calculator: Required Minimum Distribution (IRS Pub 590-B & SECURE 2.0) | SolveItCalculator',
  description:
    'Calculate your Required Minimum Distribution (RMD), percentage of prior year-end balance, mandatory deadline, and SECURE 2.0 start age (73 or 75) using verified IRS Uniform Lifetime (Table III) and Joint Life (Table II) tables.',
  alternates: {
    canonical: 'https://solveitcalculator.com/finance/rmd-calculator',
  },
};

const SYSTEM_DATA: CalculatorSystemData = {
  id: 'rmd-calculator',
  slug: 'rmd-calculator',
  name: 'RMD Calculator',
  h1: 'RMD (Required Minimum Distribution) Calculator',
  category: 'finance',
  categoryName: 'Finance',
  categoryPath: '/finance',
  subcategory: 'retirement',
  subcategoryName: 'Retirement & Super',
  subcategoryPath: '/retirement-and-super',
  canonicalUrl: 'https://solveitcalculator.com/finance/rmd-calculator',
  shortAnswer:
    'Calculate your mandatory Required Minimum Distribution (RMD), distribution period factor, withdrawal deadline, and SECURE 2.0 start age (73 or 75) using official IRS Publication 590-B life expectancy tables.',
  formula: {
    equation: 'Annual RMD = Prior Dec 31 Account Balance ÷ IRS Distribution Period Factor',
    description:
      'Divides your retirement account balance as of December 31 of the prior year by the IRS life expectancy factor from Table III (Uniform Lifetime) or Table II (Joint Life with spouse >10 years younger).',
    variables: [
      { symbol: 'Balance', name: 'Prior Dec 31 Balance', unit: 'USD ($)', description: 'Account value at the end of the previous year.' },
      { symbol: 'Factor', name: 'Distribution Period', unit: 'Years', description: 'IRS Publication 590-B life expectancy divisor.' },
    ],
    assumptions: ['Reflects SECURE 2.0 Act starting ages (73 for 1951–1959 birth years; 75 for 1960+ birth years).'],
  },
  workedExample: {
    title: 'Age 75 Retiree with $500,000 Prior Year-End IRA Balance',
    scenario: 'Calculating the mandatory RMD for a 75-year-old using the IRS Uniform Lifetime Table (divisor 24.6).',
    inputs: { 'Account Balance': '$500,000', 'Age 75 Factor': '24.6' },
    stepByStep: [
      'Look up age 75 on IRS Uniform Lifetime Table III: Distribution Period = 24.6.',
      'Divide $500,000 by 24.6 = $20,325.20 mandatory withdrawal.',
      'Equivalent to 4.07% of the prior year-end account balance.',
    ],
    finalResult: '$20,325.20 Required Minimum Distribution (4.07%)',
    interpretation: 'Must be withdrawn by December 31 to avoid the 25% IRS excise tax penalty on shortfalls.',
  },
  howToUse: [
    'Enter your birth year or age and your retirement account balance as of December 31 of last year.',
    'Indicate whether your sole beneficiary is a spouse more than 10 years younger.',
    'Click Calculate to see your exact IRS distribution factor and mandatory dollar withdrawal.',
    'Review your deadline and multi-year RMD projection table.',
  ],
  howItIsCalculated: [
    'Matches your age and beneficiary status to official IRS Publication 590-B Table III or Table II divisors.',
  ],
  whenToUse: ['When planning annual IRA, 401(k), 403(b), or 457(b) withdrawals at age 73 or older.'],
  limitations: ['Applies to lifetime account owners; inherited IRAs follow separate beneficiary rules.'],
  sourceReference: {
    organization: 'Internal Revenue Service (IRS)',
    standardName: 'IRS Publication 590-B & SECURE 2.0 Act',
    citation: 'IRC Section 401(a)(9)',
    versionOrDate: 'Verified 2025',
  },
  relatedToolIds: ['401k-calculator', 'roth-vs-traditional-calculator'],
  relatedConversionPaths: [
    { label: '401(k) Calculator', path: '/finance/401k-calculator' },
    { label: 'Roth vs. Traditional Calculator', path: '/finance/roth-vs-traditional-calculator' },
    { label: 'US Federal Income Tax Calculator', path: '/finance/us-federal-income-tax-calculator' },
    { label: 'Compound Interest Calculator', path: '/compound-interest-calculator' },
  ],
  relatedGuidePaths: [{ title: '401(k) Calculator', path: '/finance/401k-calculator' }],
  faqs: [
    {
      question: 'How is my Required Minimum Distribution (RMD) calculated?',
      answer:
        'Divide your retirement account balance as of December 31 of the prior calendar year by the distribution period factor from IRS Publication 590-B (Table III for most owners, or Table II if your sole beneficiary is a spouse more than 10 years younger).',
    },
    {
      question: 'What is the RMD starting age under the SECURE 2.0 Act?',
      answer:
        'If you were born between 1951 and 1959, your RMD starting age is 73. If you were born in 1960 or later, your RMD starting age is 75.',
    },
    {
      question: 'What is the deadline for taking an RMD?',
      answer:
        'Annual RMDs must be taken by December 31 each year. For your very first RMD year, you can delay until April 1 of the following year, though doing so requires taking two distributions in that second calendar year.',
    },
    {
      question: 'What is the IRS penalty for missing an RMD?',
      answer:
        'Under SECURE 2.0, the excise tax penalty for an undistributed RMD shortfall is 25%, which drops to 10% if corrected within the two-year correction window.',
    },
  ],
};

export default function RmdCalculatorPage() {
  return (
    <CalculatorPageSystem data={SYSTEM_DATA}>
      <RmdCalculatorClient />
    </CalculatorPageSystem>
  );
}
