import React from 'react';
import { Metadata } from 'next';
import CalculatorPageSystem from '@/components/calculator/CalculatorPageSystem';
import { CalculatorSystemData } from '@/lib/calculatorSystemData';
import ProfitMarginClient from './ProfitMarginClient';

export const metadata: Metadata = {
  title: 'Profit Margin Calculator (Gross, EBITDA, Operating & Net Margin + Damodaran Benchmarks) | SolveItCalculator',
  description:
    'Calculate Gross Margin, EBITDA Margin, Operating (EBIT) Margin, and Net Profit Margin with an interactive P&L waterfall and cited NYU Stern (Damodaran) sector benchmarks.',
  alternates: {
    canonical: 'https://solveitcalculator.com/finance/profit-margin-calculator',
  },
};

const SYSTEM_DATA: CalculatorSystemData = {
  id: 'profit-margin-calculator',
  slug: 'profit-margin-calculator',
  name: 'Profit Margin Calculator',
  h1: 'Profit Margin Calculator (Gross, Operating, EBITDA & Net Margin Waterfall)',
  category: 'finance',
  categoryName: 'Finance',
  categoryPath: '/finance',
  subcategory: 'business',
  subcategoryName: 'Business Finance',
  subcategoryPath: '/finance/business',
  canonicalUrl: 'https://solveitcalculator.com/finance/profit-margin-calculator',
  shortAnswer:
    'Calculate your Gross Profit Margin, EBITDA Margin, Operating (EBIT) Margin, and Net Profit Margin from your income statement. Includes a visual P&L waterfall and benchmarking against Prof. Aswath Damodaran’s (NYU Stern) published US sector margin dataset.',
  formula: {
    equation: 'Gross = (Rev − COGS)/Rev ; Operating = (Rev − COGS − OPEX)/Rev ; Net = (Rev − COGS − OPEX − Int − Tax)/Rev',
    description:
      'Evaluates profitability across every tier of the GAAP/IFRS Income Statement and compares your ratios against empirical public-company sector averages compiled by NYU Stern.',
    variables: [
      { symbol: 'COGS', name: 'Cost of Goods Sold', unit: 'USD ($)', description: 'Direct materials, inventory, and production labor costs.' },
      { symbol: 'OPEX', name: 'Operating Expenses (SG&A + R&D)', unit: 'USD ($)', description: 'Selling, general, administrative, payroll, and R&D overhead.' },
      { symbol: 'EBIT', name: 'Operating Profit', unit: 'Revenue − COGS − OPEX', description: 'Earnings Before Interest and Taxes.' },
    ],
    assumptions: ['Depreciation & Amortization (D&A) is assumed included inside Operating Expenses and added back to compute EBITDA.'],
  },
  workedExample: {
    title: '$500,000 Revenue Business ($180k COGS, $170k OPEX, $15k Interest, $28k Tax)',
    scenario: 'A software/services company generating $500,000 in annual revenue.',
    inputs: {
      'Total Revenue': '$500,000',
      'COGS': '$180,000',
      'Operating Expenses (incl. $20k D&A)': '$170,000',
      'Interest & Taxes': '$43,000 ($15k Int + $28k Tax)',
    },
    stepByStep: [
      'Gross Profit = $500,000 − $180,000 = $320,000 (64.0% Gross Margin).',
      'Operating Profit (EBIT) = $320,000 − $170,000 = $150,000 (30.0% Operating Margin); EBITDA = $170,000 (34.0%).',
      'Net Profit = $150,000 − $15,000 − $28,000 = $107,000 (21.4% Net Profit Margin).',
    ],
    finalResult: '64.0% Gross | 34.0% EBITDA | 30.0% Operating | 21.4% Net Profit Margin',
    interpretation: 'Compared to the NYU Stern Software (System & Application) benchmark (71.5% Gross / 20.6% Net), the business outperforms on bottom-line Net Margin (+0.8%).',
  },
  howToUse: [
    'Enter your annual or quarterly Revenue, COGS, and Operating Expenses (OPEX).',
    'Enter Depreciation & Amortization, Interest Expense, and Income Taxes.',
    'Select your industry from the cited Damodaran NYU Stern dropdown to benchmark your margins.',
  ],
  howItIsCalculated: [
    'Computes Gross Profit, EBITDA, Operating Profit (EBIT), and Net Profit.',
    'Divides each profit tier by Total Revenue and renders a proportional P&L waterfall.',
  ],
  whenToUse: ['When analyzing quarterly P&L statements, pitching investors, or auditing cost structure against public industry peers.'],
  limitations: ['Sector benchmarks represent US public equities compiled by Prof. Aswath Damodaran (January 2025 update).'],
  sourceReference: {
    organization: 'Aswath Damodaran, Stern School of Business at New York University (NYU Stern)',
    standardName: 'Operating and Net Margins by Industry Sector (US Equities Dataset)',
    citation: 'https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/margin.html',
    versionOrDate: 'Verified January 2025 Dataset',
  },
  relatedToolIds: ['roi-calculator', 'cagr-calculator'],
  relatedConversionPaths: [
    { label: 'Margin Calculator', path: '/finance/margin-calculator' },
    { label: 'Markup Calculator', path: '/finance/markup-calculator' },
    { label: 'Break-Even Calculator', path: '/finance/break-even-calculator' },
  ],
  relatedGuidePaths: [{ title: 'Break-Even Calculator', path: '/finance/break-even-calculator' }],
  faqs: [
    {
      question: 'What is the difference between Gross Margin, Operating Margin, and Net Profit Margin?',
      answer: 'Gross Margin deducts only direct Cost of Goods Sold (COGS). Operating Margin (EBIT Margin) deducts both COGS and day-to-day Operating Expenses (SG&A, R&D, rent, payroll). Net Profit Margin is the true "bottom line" after deducting COGS, OPEX, debt interest, and corporate taxes.',
    },
  ],
};

export default function ProfitMarginPage() {
  return (
    <CalculatorPageSystem data={SYSTEM_DATA}>
      <ProfitMarginClient />
    </CalculatorPageSystem>
  );
}
