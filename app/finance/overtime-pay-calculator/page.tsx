import React from 'react';
import { Metadata } from 'next';
import CalculatorPageSystem from '@/components/calculator/CalculatorPageSystem';
import { CalculatorSystemData } from '@/lib/calculatorSystemData';
import OvertimePayClient from './OvertimePayClient';

export const metadata: Metadata = {
  title: 'Overtime Pay Calculator (1.5x Time-and-a-Half & 2x Double Time) | SolveItCalculator',
  description:
    'Calculate weekly, bi-weekly, monthly, and annual overtime pay, blended effective hourly rate, and 1.5x / 2.0x multipliers under US FLSA (40-hour), California daily overtime, and India Factories Act rules.',
  alternates: {
    canonical: 'https://solveitcalculator.com/finance/overtime-pay-calculator',
  },
  openGraph: {
    title: 'Overtime Pay Calculator (1.5x Time-and-a-Half & 2x Double Time) | SolveItCalculator',
    description: 'Calculate weekly, bi-weekly, monthly, and annual overtime pay, blended effective hourly rate, and 1.5x / 2.0x multipliers under US FLSA (40-hour), California daily overtime, and India Factories Act rules.',
    url: 'https://solveitcalculator.com/finance/overtime-pay-calculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Overtime Pay Calculator (1.5x Time-and-a-Half & 2x Double Time) | SolveItCalculator',
    description: 'Calculate weekly, bi-weekly, monthly, and annual overtime pay, blended effective hourly rate, and 1.5x / 2.0x multipliers under US FLSA (40-hour), California daily overtime, and India Factories Act rules.',
  },
};

const SYSTEM_DATA: CalculatorSystemData = {
  id: 'overtime-pay-calculator',
  slug: 'overtime-pay-calculator',
  name: 'Overtime Pay Calculator',
  h1: 'Overtime Pay Calculator (1.5x Time-and-a-Half & 2.0x Double-Time)',
  category: 'finance',
  categoryName: 'Finance',
  categoryPath: '/finance',
  subcategory: 'salary',
  subcategoryName: 'Salary & Payroll',
  subcategoryPath: '/finance/salary',
  canonicalUrl: 'https://solveitcalculator.com/finance/overtime-pay-calculator',
  shortAnswer:
    'Calculate your gross paycheck, overtime earnings, and blended effective hourly wage across 1.5× time-and-a-half and 2.0× double-time hours. Includes statutory guidance on US FLSA 40-hour rules, California daily overtime, and India 2× overtime rules.',
  formula: {
    equation: 'Gross = (Hours_{Reg} × Rate) + (Hours_{OT} × Rate × 1.5) + (Hours_{DT} × Rate × 2.0)',
    description:
      'Multiplies regular hours by your base hourly rate and adds overtime hours multiplied by the applicable statutory overtime multiplier (1.5× federal FLSA or 2.0× double-time).',
    variables: [
      { symbol: 'Rate', name: 'Regular Hourly Rate', unit: 'USD ($/hr)', description: 'Base hourly wage (or annual non-exempt salary divided by 2,080 hours).' },
      { symbol: '1.5x', name: 'FLSA Overtime Multiplier', unit: 'Time-and-a-Half', description: 'Mandatory minimum federal overtime multiplier for hours worked over 40 per workweek.' },
    ],
    assumptions: ['Under the Fair Labor Standards Act (FLSA), each 7-day workweek stands alone; hours cannot be averaged across two weeks in a bi-weekly pay period.'],
  },
  workedExample: {
    title: '$32/hr Base Rate with 40 Regular Hours and 10 Overtime Hours (1.5x)',
    scenario: 'A non-exempt technician earning $32/hour who works 50 hours in a week (40 regular + 10 overtime hours at 1.5x).',
    inputs: { 'Base Hourly Rate': '$32.00/hr', 'Regular Hours': '40 hrs', 'Overtime Hours (1.5x)': '10 hrs ($48.00/hr)' },
    stepByStep: [
      'Regular Weekly Pay = 40 × $32.00 = $1,280.00.',
      'Overtime Rate (1.5x) = $32.00 × 1.5 = $48.00/hr -> Overtime Pay = 10 × $48.00 = $480.00.',
      'Total Weekly Gross Pay = $1,280.00 + $480.00 = $1,760.00 ($3,520.00 bi-weekly).',
      'Blended Effective Hourly Rate = $1,760.00 ÷ 50 hrs = $35.20/hr.',
    ],
    finalResult: '$1,760.00/week Gross ($480.00 Overtime Pay) | $35.20/hr Effective Rate',
    interpretation: 'Working 10 hours of 1.5x overtime boosts weekly gross earnings by 37.5%.',
  },
  howToUse: [
    'Select Hourly Rate or Non-Exempt Salary.',
    'Enter your base pay rate, regular weekly hours, and weekly overtime hours.',
    'Choose your overtime multiplier (1.5x, 2.0x, or custom) and review your weekly, bi-weekly, monthly, and annual totals.',
  ],
  howItIsCalculated: [
    'Computes regular weekly earnings and adds 1.5x and 2.0x overtime tiers.',
    'Divides total weekly gross compensation by total hours worked to report your blended effective hourly rate.',
  ],
  whenToUse: ['When verifying overtime pay on your paycheck stub or estimating extra shift income.'],
  limitations: ['Shift differentials and non-discretionary bonuses must be included in the regular rate of pay under 29 CFR § 778.208.'],
  sourceReference: {
    organization: 'U.S. Department of Labor (Wage and Hour Division)',
    standardName: 'Fair Labor Standards Act (FLSA) — 29 U.S.C. § 207 & 29 CFR Part 541',
    citation: 'https://www.dol.gov/agencies/whd/overtime',
    versionOrDate: 'Verified October 2025',
  },
  relatedToolIds: ['salary-to-hourly-calculator', 'take-home-pay-calculator', 'pay-raise-calculator'],
  relatedConversionPaths: [
    { label: 'Salary to Hourly Calculator', path: '/finance/salary-to-hourly-calculator' },
    { label: 'Take-Home Pay Calculator', path: '/finance/take-home-pay-calculator' },
    { label: 'Pay Raise Calculator', path: '/finance/pay-raise-calculator' },
  ],
  relatedGuidePaths: [{ title: 'Bonus Tax Calculator', path: '/finance/bonus-tax-calculator' }],
  faqs: [
    {
      question: 'Can my employer average 30 hours one week and 50 hours the next week to avoid paying overtime?',
      answer: 'No. Under US federal FLSA regulations (29 CFR § 778.104), each single workweek (7 consecutive 24-hour periods) is the standard and averaging of hours over two or more weeks is not permitted for non-exempt employees.',
    },
  ],
};

export default function OvertimePayPage() {
  return (
    <CalculatorPageSystem data={SYSTEM_DATA}>
      <OvertimePayClient />
    </CalculatorPageSystem>
  );
}
