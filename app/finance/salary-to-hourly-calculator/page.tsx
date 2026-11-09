import React from 'react';
import { Metadata } from 'next';
import CalculatorPageSystem from '@/components/calculator/CalculatorPageSystem';
import { CalculatorSystemData } from '@/lib/calculatorSystemData';
import SalaryToHourlyClient from './SalaryToHourlyClient';

export const metadata: Metadata = {
  title: 'Salary to Hourly Calculator (2,080 Hours & All Pay Periods) | SolveItCalculator',
  description:
    'Convert annual salary to hourly wage (or hourly to annual) across daily, weekly, bi-weekly, semi-monthly, and monthly pay periods. Includes unpaid leave and paid holiday adjustments.',
  alternates: {
    canonical: 'https://solveitcalculator.com/finance/salary-to-hourly-calculator',
  },
  openGraph: {
    title: 'Salary to Hourly Calculator (2,080 Hours & All Pay Periods) | SolveItCalculator',
    description: 'Convert annual salary to hourly wage (or hourly to annual) across daily, weekly, bi-weekly, semi-monthly, and monthly pay periods. Includes unpaid leave and paid holiday adjustments.',
    url: 'https://solveitcalculator.com/finance/salary-to-hourly-calculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Salary to Hourly Calculator (2,080 Hours & All Pay Periods) | SolveItCalculator',
    description: 'Convert annual salary to hourly wage (or hourly to annual) across daily, weekly, bi-weekly, semi-monthly, and monthly pay periods. Includes unpaid leave and paid holiday adjustments.',
  },
};

const SYSTEM_DATA: CalculatorSystemData = {
  id: 'salary-to-hourly-calculator',
  slug: 'salary-to-hourly-calculator',
  name: 'Salary to Hourly Calculator',
  h1: 'Salary to Hourly Wage & Pay Period Converter',
  category: 'finance',
  categoryName: 'Finance',
  categoryPath: '/finance',
  subcategory: 'salary',
  subcategoryName: 'Salary & Payroll',
  subcategoryPath: '/finance/salary',
  canonicalUrl: 'https://solveitcalculator.com/finance/salary-to-hourly-calculator',
  shortAnswer:
    'Convert an annual salary into an exact hourly rate—or convert an hourly wage into annual, monthly, semi-monthly, bi-weekly, weekly, and daily pay—based on your scheduled hours per week, unpaid leave, and paid holidays.',
  formula: {
    equation: 'Hourly = Salary / (Hours_{Week} × PaidWeeks) ; Standard = Salary / 2,080',
    description:
      'A standard full-time work year consists of 40 hours/week × 52 weeks/year = 2,080 hours. Subtracting unpaid leave weeks or paid holidays reveals your true effective hourly compensation per hour worked.',
    variables: [
      { symbol: '2,080', name: 'Standard Full-Time Annual Hours', unit: '40 hrs × 52 weeks', description: 'Baseline US Department of Labor annual work-hour divisor.' },
      { symbol: 'Bi-Weekly', name: 'Bi-Weekly Paycheck', unit: 'Salary ÷ 26', description: 'Paid every two weeks (26 paychecks per year).' },
      { symbol: 'Semi-Monthly', name: 'Semi-Monthly Paycheck', unit: 'Salary ÷ 24', description: 'Paid twice a month, typically on the 1st and 15th (24 paychecks per year).' },
    ],
    assumptions: ['Gross pay figures are pre-tax before income tax or payroll deductions.'],
  },
  workedExample: {
    title: '$85,000 Annual Salary on a Standard 40-Hour, 52-Week Schedule',
    scenario: 'Converting an $85,000/year gross salary with 15 paid PTO/holiday days into all pay periods.',
    inputs: {
      'Annual Salary': '$85,000',
      'Hours / Week': '40 hours (52 weeks = 2,080 hrs)',
      'Paid Holidays / PTO': '15 days (120 hours)',
    },
    stepByStep: [
      'Nominal Hourly Rate = $85,000 ÷ 2,080 = $40.87/hour.',
      'Effective Worked Hourly Rate (1,960 worked hours) = $85,000 ÷ 1,960 = $43.37/hour.',
      'Bi-Weekly Paycheck = $85,000 ÷ 26 = $3,269.23 ; Monthly = $7,083.33.',
    ],
    finalResult: '$40.87/hr Nominal ($43.37/hr Worked) | $3,269.23 Bi-Weekly',
    interpretation: 'Bi-weekly paychecks ($3,269.23) are smaller than semi-monthly paychecks ($3,541.67) because bi-weekly payroll delivers two "three-paycheck months" each year.',
  },
  howToUse: [
    'Select Annual Salary → Hourly or Hourly Rate → Salary.',
    'Enter your compensation amount, hours per week, and scheduled weeks per year.',
    'Click Copy Table to copy all converted pay periods to your clipboard.',
  ],
  howItIsCalculated: [
    'Divides annual salary by (hours per week × paid weeks per year) for nominal hourly wage.',
    'Subtracts paid holiday/PTO hours to compute effective compensation per hour actually worked.',
  ],
  whenToUse: [
    'When comparing an hourly contract offer against an annual salaried position.',
    'When budgeting across bi-weekly (26) vs semi-monthly (24) pay schedules.',
  ],
  limitations: ['Does not subtract overtime or tax withholdings (use the Overtime or Take-Home Pay calculators).'],
  sourceReference: {
    organization: 'U.S. Bureau of Labor Statistics (BLS) & FLSA Standards',
    standardName: 'Standard Full-Time Annual Work Year (2,080 Hours)',
    citation: '29 CFR Part 778',
    versionOrDate: 'Verified October 2025',
  },
  relatedToolIds: ['overtime-pay-calculator', 'take-home-pay-calculator', 'pay-raise-calculator'],
  relatedConversionPaths: [
    { label: 'Overtime Pay Calculator', path: '/finance/overtime-pay-calculator' },
    { label: 'Take-Home Pay Calculator', path: '/finance/take-home-pay-calculator' },
    { label: 'Pay Raise Calculator', path: '/finance/pay-raise-calculator' },
  ],
  relatedGuidePaths: [{ title: '1099 vs W-2 Calculator', path: '/finance/1099-vs-w2-calculator' }],
  faqs: [
    {
      question: 'Why are there 2,080 working hours in a standard year?',
      answer: 'A standard full-time schedule is 40 hours per week across 52 weeks per year: 40 × 52 = 2,080 hours.',
    },
  ],
};

export default function SalaryToHourlyPage() {
  return (
    <CalculatorPageSystem data={SYSTEM_DATA}>
      <SalaryToHourlyClient />
    </CalculatorPageSystem>
  );
}
