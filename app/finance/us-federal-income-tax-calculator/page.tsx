import React from 'react';
import type { Metadata } from 'next';
import CalculatorPageSystem from '@/components/calculator/CalculatorPageSystem';
import { CalculatorSystemData } from '@/lib/calculatorSystemData';
import UsFederalTaxClient from './UsFederalTaxClient';

export const metadata: Metadata = {
  title: 'US Federal Income Tax Calculator (2024 & 2025 IRS Brackets) | SolveItCalculator',
  description:
    'Calculate your US federal income tax, taxable income, effective and marginal tax rates, refund or amount owed, and per-bracket breakdown using verified IRS tax brackets and standard deductions.',
  alternates: {
    canonical: 'https://solveitcalculator.com/finance/us-federal-income-tax-calculator',
  },
};

const SYSTEM_DATA: CalculatorSystemData = {
  id: 'us-federal-income-tax-calculator',
  slug: 'us-federal-income-tax-calculator',
  name: 'US Federal Income Tax Calculator',
  h1: 'US Federal Income Tax Calculator',
  category: 'finance',
  categoryName: 'Finance',
  categoryPath: '/finance',
  subcategory: 'taxes',
  subcategoryName: 'Tax Calculators',
  subcategoryPath: '/finance',
  canonicalUrl: 'https://solveitcalculator.com/finance/us-federal-income-tax-calculator',
  shortAnswer:
    'Estimate your US federal income tax liability, effective and marginal tax rates, standard vs. itemized deductions, progressive bracket breakdown, and expected tax refund or amount owed.',
  formula: {
    equation: 'Taxable Income = max(0, Gross − PreTax − Deduction) ; Net Tax = Σ(BracketTax) − Credits',
    description:
      'Subtracts pre-tax adjustments (401k, HSA) and the greater of your standard or itemized deduction from gross income, then applies the 7 progressive IRS marginal tax brackets (10% to 37%).',
    variables: [
      { symbol: 'AGI', name: 'Adjusted Gross Income', unit: 'USD ($)', description: 'Gross income minus above-the-line pre-tax deductions.' },
      { symbol: 'Deduction', name: 'Standard or Itemized Deduction', unit: 'USD ($)', description: '$15,000 Single / $30,000 Married Filing Jointly in 2025.' },
    ],
    assumptions: ['Uses official IRS Revenue Procedure 2024-40 brackets and standard deductions for 2025.'],
  },
  workedExample: {
    title: 'Single Filer Earning $95,000 in 2025 with Standard Deduction',
    scenario: 'Calculating 2025 federal income tax for a Single filer with $95,000 gross income and $15,000 standard deduction.',
    inputs: { 'Gross Income': '$95,000', 'Taxable Income': '$80,000' },
    stepByStep: [
      'Subtract $15,000 standard deduction from $95,000 = $80,000 Taxable Income.',
      '10% on first $11,925 ($1,192.50) + 12% on next $36,550 ($4,386) + 22% on remaining $31,525 ($6,935.50).',
      'Total Federal Income Tax = $12,514 (13.17% Effective Rate, 22% Marginal Bracket).',
    ],
    finalResult: '$12,514 Federal Tax | 13.17% Effective Rate | 22% Marginal Rate',
    interpretation: 'Even though the top dollar is in the 22% bracket, the overall effective tax rate is only 13.17%.',
  },
  howToUse: [
    'Select your tax year (2025 or 2024) and filing status (Single, Married Filing Jointly, or Head of Household).',
    'Enter your gross annual income and any pre-tax 401(k)/HSA contributions.',
    'Choose between the Standard Deduction or custom Itemized Deductions and tax credits.',
    'Review your total tax, effective vs. marginal rate, and per-bracket breakdown.',
  ],
  howItIsCalculated: [
    'Computes taxable income and slices it across each IRS marginal bracket tier before subtracting tax credits and comparing against withholding.',
  ],
  whenToUse: ['When estimating your annual IRS tax return, checking W-4 withholding, or planning deductions.'],
  limitations: ['Does not include state income taxes or FICA payroll taxes (see US State Take-Home Calculator).'],
  sourceReference: {
    organization: 'Internal Revenue Service (IRS)',
    standardName: 'IRS Revenue Procedure 2024-40',
    citation: '2025 Federal Tax Brackets & Standard Deductions',
    versionOrDate: 'Verified 2025',
  },
  relatedToolIds: ['us-state-take-home-calculator', 'take-home-pay-calculator'],
  relatedConversionPaths: [
    { label: 'US State Take-Home Paycheck Calculator', path: '/finance/us-state-take-home-calculator' },
    { label: 'Self-Employment Tax Calculator', path: '/finance/self-employment-tax-calculator' },
    { label: 'Capital Gains Tax Calculator', path: '/finance/capital-gains-tax-calculator' },
    { label: '1099 vs. W-2 Calculator', path: '/finance/1099-vs-w2-calculator' },
  ],
  relatedGuidePaths: [{ title: 'US State Take-Home Calculator', path: '/finance/us-state-take-home-calculator' }],
  faqs: [
    {
      question: 'How is US Federal Income Tax calculated across progressive tax brackets?',
      answer:
        'The US tax system uses progressive marginal brackets (10%, 12%, 22%, 24%, 32%, 35%, and 37%). Only the portion of your taxable income that falls within a specific tier is taxed at that tier’s percentage rate.',
    },
    {
      question: 'What is the difference between marginal tax rate and effective tax rate?',
      answer:
        'Your marginal tax rate is the percentage applied to the very next dollar you earn. Your effective tax rate is your total federal tax divided by your total gross income.',
    },
    {
      question: 'Should I choose the standard deduction or itemize my deductions?',
      answer:
        'Choose whichever is larger. For 2025, the standard deduction is $15,000 for Single filers and $30,000 for Married Filing Jointly.',
    },
    {
      question: 'What is the difference between a tax deduction and a tax credit?',
      answer:
        'A tax deduction lowers your taxable income, whereas a tax credit reduces your final tax bill dollar-for-dollar.',
    },
  ],
};

export default function UsFederalTaxPage() {
  return (
    <CalculatorPageSystem data={SYSTEM_DATA}>
      <UsFederalTaxClient />
    </CalculatorPageSystem>
  );
}
